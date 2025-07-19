import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const wsRef = useRef();
  const inputRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // Correct protocol

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }));
    };

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    const message = inputRef.current?.value.trim();
    if (!message) return;

    wsRef.current.send(JSON.stringify({
      type: "chat",
      payload: {
        message: message
      }
    }));

    inputRef.current.value = "";
  };

  return (
    <div className='h-screen bg-black flex flex-col'>
      <div className='flex-1 overflow-y-auto p-4'>
        {messages.map((message, idx) => (
          <div key={idx} className='mb-4 flex justify-start'>
            <span className='bg-white text-black rounded-xl p-4 max-w-[70%] break-words'>
              {message}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className='w-full bg-white flex border-t border-gray-300'>
        <input
          ref={inputRef}
          id="message"
          className="flex-1 p-4 text-black outline-none"
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
        />
        <button
          onClick={handleSendMessage}
          className='bg-purple-600 text-white px-6 py-4 hover:bg-purple-700 transition-all'
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;


