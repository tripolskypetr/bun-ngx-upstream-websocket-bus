const path = require("path");
const os = require("os");
const dotenv = require("dotenv");

const readConfig = () => dotenv.parse("./.env");

const getPath = (unixPath) => {
  return path.resolve(unixPath.replace("~", os.homedir()));
};

const apps = [
  {
    name: "bun-ws-1",
    exec_mode: "fork",
    instances: "1",
    autorestart: true,
    cron_restart: "0 0 * * *",
    max_memory_restart: "1250M",
    script: "./packages/backend/src/index.ts",
    interpreter: getPath("~/.bun/bin/bun"),
    env: readConfig(),
    args: ["--bootstrap=8081,8082,8083,8084,8085"],
    out_file: "./logs/pm2/bun-ws-1-out.log",
    error_file: "./logs/pm2/bun-ws-1-error.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    merge_logs: true,
  },
];

module.exports = {
  apps,
};
