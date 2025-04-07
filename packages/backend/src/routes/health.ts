import os from "os";

import { app } from "../config/app";
import { ioc } from "../lib";

const { port } = ioc.bootstrapService.getArgs();

app.get("/health_check", async (ctx) => {
  const [cpuLoad] = os.loadavg();
  return ctx.json(
    {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuLoad,
      pid: process.pid,
      port,
    },
    200
  );
});
