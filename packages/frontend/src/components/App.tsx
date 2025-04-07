import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const CLIENT_ID = uuid();

function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new WebSocket("/api/v1/listen");
    socket.onmessage = (event) => {
      setText((prev) => `${prev}\n\n${event.data}`);
    };
  }, []);

  const handleNotify = async () => {
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
    alert("ok");
  };

  const handleKill = async () => {
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
    alert("ok");
  };

  return (
    <>
      <div>
        <p>
          Send notify <button onClick={handleNotify}>notify</button>
        </p>
        <p>
          Send kill <button onClick={handleKill}>kill</button>
        </p>
      </div>
      <pre>{text}</pre>
    </>
  );
}

export default App;
