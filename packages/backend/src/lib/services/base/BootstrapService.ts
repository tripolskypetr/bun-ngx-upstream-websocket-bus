import { singleshot, Subject } from "functools-kit";
import { parseArgs } from "util";
import { inject } from "../../core/di";
import LoggerService from "./LoggerService";
import TYPES from "../../core/types";

interface IBroadcastMessage<T extends object = object> {
  type: typeof BROADCAST_CHANNEL;
  topic: string;
  data: T;
}

const BROADCAST_CHANNEL = "broadcast-channel";

export class BootstrapService {
  private readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  private _childProcMap = new Map<number, Bun.Subprocess>();
  private _messageSubject = new Subject<object>();

  private spawnChildProc = (port: number) => {
    this.loggerService.log("bootstrapService spawnChildProc", { port });
    return Bun.spawn([process.execPath, Bun.main, `--port=${port}`], {
      cwd: process.cwd(),
      env: process.env,
      killSignal: "SIGKILL",
      windowsHide: true,
      stdio: ["inherit", "inherit", "inherit"],
      ipc: (message, childProc) => {
        if (message.type !== BROADCAST_CHANNEL) {
          return;
        }
        this.loggerService.log(
          `bootstrapService ipc recieved message port=${port}`,
          { port, message }
        );
        for (const proc of this._childProcMap.values()) {
          if (proc.pid === childProc.pid) {
            continue;
          }
          proc.send(message);
        }
      },
      onExit: () => {
        this.loggerService.log(
          `bootstrapService Child process exited unexpectedly port=${port}`
        );
        this._childProcMap.set(port, this.spawnChildProc(port));
      },
      serialization: "json",
    });
  };

  public getArgs = singleshot(() => {
    const { values } = parseArgs({
      args: Bun.argv,
      options: {
        bootstrap: {
          type: "string",
        },
        port: {
          type: "string",
        },
      },
      strict: true,
      allowPositionals: true,
    });
    return values;
  });

  public launch = (ports: number[]) => {
    this.loggerService.log("bootstrapService launch", { ports });
    ports.forEach((port) =>
      this._childProcMap.set(port, this.spawnChildProc(port))
    );
  };

  public broadcast = async <T extends object = object>(
    topic: string,
    data: T
  ) => {
    this.loggerService.log("bootstrapService broadcast", { topic, data });
    const message: IBroadcastMessage<T> = {
      type: BROADCAST_CHANNEL,
      topic,
      data,
    };
    for (const [port, proc] of this._childProcMap) {
      if (proc.killed) {
        this.loggerService.log(
          `bootstrapService broadcast error process exited port=${port}`,
          { port, topic, data }
        );
        continue;
      }
      proc.send(message);
    }
    process.send && process.send(message);
  };

  public listen = <T extends object = object>(
    fn: (data: IBroadcastMessage<T>) => void
  ) => {
    this.loggerService.log("bootstrapService listen");
    return this._messageSubject.subscribe(fn);
  };

  protected init = () => {
    this.loggerService.log("bootstrapService init");
    process.on("message", (message: IBroadcastMessage) => {
      if (message.type !== BROADCAST_CHANNEL) {
        return;
      }
      this._messageSubject.next(message);
    });
  };
}

export default BootstrapService;
