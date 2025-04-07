import { errorData, getErrorMessage } from "functools-kit";
import type { NotifyRequest } from "../model/NotifyRequest.model";
import { app } from "../config/app";
import { ioc } from "../lib";

const { port } = ioc.bootstrapService.getArgs();

app.post("/api/v1/notify", async (ctx) => {
  const request = await ctx.req.json<NotifyRequest>();
  console.time(`/api/v1/notify ${request.requestId}`);
  ioc.loggerService.log("/api/v1/notify", { request });
  try {
    ioc.bootstrapService.broadcast("broadcast", {
      clientId: request.clientId,
      requestId: request.requestId,
      port,
    });
    const result = {
      status: "ok",
      port,
    };
    ioc.loggerService.log("/api/v1/notify ok", { request, result });
    return ctx.json(result, 200);
  } catch (error) {
    ioc.loggerService.log("/api/v1/notify error", {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
      },
      500
    );
  } finally {
    console.timeEnd(`/api/v1/notify ${request.requestId}`);
  }
});
