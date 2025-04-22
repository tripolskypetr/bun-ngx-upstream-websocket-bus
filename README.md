# Bun NGX Upstream WebSocket Bus

This repository contains the source code for a high-performance backend solution that optimizes microservices and WebSocket communication using NGinx, Lua, and Bun. The project focuses on creating a scalable event bus for seamless replica restarts and efficient handling of WebSocket connections.

## Overview

The project addresses challenges in microservice architectures, particularly in environments without dedicated DevOps support. It implements an NGinx-based proxy layer to manage backend restarts and a Bun-based event bus to ensure uninterrupted WebSocket connections across replicas.

### Key Features
- **NGinx Proxy Layer**: Pauses requests during backend restarts, ensuring no connection drops.
- **Seamless Replica Restarts**: Uses Linux `SO_REUSEPORT` to allow multiple processes to share the same port, eliminating dead process wait times.
- **Event Bus**: Facilitates inter-replica communication via file-based channels, optimized for performance.
- **Scalable WebSocket**: Leverages Bun's pub/sub model for efficient WebSocket broadcasting.

## Installation

### Prerequisites
- Linux-based host machine
- Root or sudo access for installing dependencies

### Dependencies
Install NGinx and required modules on the host machine:

```bash
sudo apt install nginx nginx-extras
sudo add-apt-repository ppa:ondrej/nginx
sudo apt update
sudo apt install libnginx-mod-http-lua
sudo sysctl net.ipv4.ip_unprivileged_port_start=0
sudo tee -a /etc/sysctl.conf <<< "net.ipv4.ip_unprivileged_port_start=0"
```

### NGinx Configuration
The NGinx configuration [/etc/nginx/nginx.conf](./config/nginx.conf.prod) is designed to handle backend restarts gracefully. It waits up to 10 seconds for the backend to respond, returning a reload page if the backend is unavailable. See the [NGinx configuration](#nginx-configuration) section for details.

## Usage

### NGinx Configuration
The NGinx setup acts as a proxy between the backend and external network, handling HTTP and WebSocket requests. Key configurations include:
- Proxying requests to `http://127.0.0.1:8081`.
- Handling WebSocket upgrades with `proxy_set_header Upgrade` and `Connection`.
- Lua-based health checks to pause requests during backend restarts.

### Event Bus
The event bus uses Bun to manage inter-replica communication. Each replica is assigned a conditional port for identification and restart handling. The `ecosystem.config.js` file configures replica ports, and the `bootstrapService` handles event broadcasting.

### WebSocket Implementation
WebSocket connections are managed using Bun's pub/sub model. The `/api/v1/listen` endpoint establishes WebSocket connections, subscribing to the `broadcast` topic. Messages are published across replicas using the `broadcast` method.

### Example API Endpoints
- **POST `/api/v1/notify`**: Broadcasts a notification to all replicas.
- **GET `/api/v1/listen`**: Establishes a WebSocket connection for real-time updates.

## Project Structure

- **`ecosystem.config.js`**: Configures replica ports and manages process restarts.
- **`nginx.conf`**: NGinx configuration for proxying and health checks.
- **`src/`**: Contains Bun-based backend code, including WebSocket and event bus logic.

## How It Works

1. **NGinx Proxy**: Routes incoming requests to the backend, pausing them if the backend is restarting.
2. **Health Checks**: Lua scripts check backend health (`/health_check`) and trigger reloads if the backend is down.
3. **Event Bus**: Replicas communicate via file-based channels, ensuring low-latency event propagation.
4. **WebSocket Broadcasting**: Bun's pub/sub model allows replicas to share WebSocket messages seamlessly.

## Why This Approach?

- **Cost-Effective**: Eliminates the need for complex DevOps setups like Envoy proxy.
- **High Availability**: Prevents connection drops during restarts using `SO_REUSEPORT` and NGinx buffering.
- **Scalability**: Supports multiple replicas without queue bottlenecks, ideal for IoT and media-heavy applications.
- **Performance**: File-based event bus outperforms network-based communication for microservices.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request with your changes. Ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Bun Documentation](https://bun.sh/) for WebSocket and clustering guides.
- [NGinx Lua Module](https://github.com/openresty/lua-nginx-module) for advanced proxy logic.
- [Habr Article](https://github.com/tripolskypetr/bun-ngx-upstream-websocket-bus) for the original inspiration and code walkthrough.
