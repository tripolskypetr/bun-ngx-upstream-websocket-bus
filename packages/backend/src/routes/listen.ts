import { app, upgradeWebSocket } from "../config/app";
import { ioc } from "../lib";

const { port } = ioc.bootstrapService.getArgs();

app.get(
  "/api/v1/listen",
  upgradeWebSocket((c) => {
    return {
      onOpen: (_, ws) => {
        const bunWs = ws.raw!;
        bunWs.subscribe("broadcast");
        ws.send(JSON.stringify({ port }))
      },
      onClose: (_, ws) => {
        const bunWs = ws.raw!;
        bunWs.unsubscribe("broadcast");
      },
    };
  })
);
