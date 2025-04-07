import { ioc } from "../lib";

const { bootstrap } = ioc.bootstrapService.getArgs();

if (bootstrap) {
  const ports = bootstrap
    .split(",")
    .map(Number);
  console.log(`Launching bootstrap`, { ports });
  ioc.bootstrapService.launch(ports);
}
