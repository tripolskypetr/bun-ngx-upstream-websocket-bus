import type { NotifyRequest } from "../model/NotifyRequest.model";
import { app } from "../config/app";
import { ioc } from "../lib";

const { port } = ioc.bootstrapService.getArgs();

app.post("/api/v1/kill", async (ctx) => {
  const request = await ctx.req.json<NotifyRequest>();
  ioc.loggerService.log("/api/v1/kill", { request });
  const result = { status: "ok", port };
  setTimeout(() => {
    throw new Error(`Kill endpoint called for port=${port}`);
  }, 3_000);
  return ctx.json(result, 200);
});
