import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const CLIENT_ID = uuid();

const sleep = (timeout = 100) => new Promise<void>((res) => setTimeout(() => res(), timeout));

function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new WebSocket("/api/v1/listen");
    socket.onmessage = (event) => {
      setText((prev) => `${prev}\n\n${event.data}`);
    };
  }, []);

  const handleStress = async () => {
    while (true) {
      for (let i = 0; i !== 10; i++) {
        await handleKill(false);
      }
      for (let i = 0; i !== 10; i++) {
        await handleNotify(false);
      }
      await sleep();
    }
  };

  const handleNotify = async (withAlert = true) => {
    await fetch("/api/v1/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: CLIENT_ID,
        requestId: uuid(),
      }),
    });
    withAlert && alert("ok");
  };

  const handleKill = async (withAlert = true) => {
    await fetch("/api/v1/kill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: CLIENT_ID,
        requestId: uuid(),
      }),
    });
    withAlert && alert("ok");
  };

  return (
    <>
      <div>
        <p>
          Send notify <button onClick={() => handleNotify()}>notify</button>
        </p>
        <p>
          Send kill <button onClick={() => handleKill()}>kill</button>
        </p>
        <p>
          Send stresstest <button onClick={handleStress}>kill</button>
        </p>
      </div>
      <pre>{text}</pre>
    </>
  );
}

export default App;
