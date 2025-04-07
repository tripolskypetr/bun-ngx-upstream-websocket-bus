import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from "bun";
import { CC_WWWROOT_PATH } from "./params";

const app = new Hono({});

app.use("*", cors());

app.use("/*", serveStatic({ root: CC_WWWROOT_PATH }));

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

export { app, upgradeWebSocket, websocket };
