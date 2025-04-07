import { ioc } from "../lib";
import { app, websocket } from "../config/app";

import "../routes/listen";
import "../routes/notify";
import "../routes/kill";

const { port } = ioc.bootstrapService.getArgs();

if (port) {
  console.log("Server started", { port });
  const server = Bun.serve({
    fetch: app.fetch,
    websocket,
    port,
    development: false,
  });
  ioc.bootstrapService.listen(({ topic, data }) => {
    if (server.subscriberCount(topic)) {
      console.log("Publishing", { topic, data });
      server.publish(topic, JSON.stringify(data));
    }
  });
}
