import { useState } from "react";

function BackendTest() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function testBackend() {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/test"
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={testBackend} disabled={loading}>
        {loading ? "Connecting..." : "Test Backend Connection"}
      </button>

      <p>{message}</p>
    </div>
  );
}

export default BackendTest;