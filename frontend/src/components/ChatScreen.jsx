import React, { useState } from "react";

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "こんにちは" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // ユーザーのメッセージをステートに追加
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // バックエンドにメッセージを送信
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }), // ユーザー入力
      });

      const data = await res.json();
      // Geminiの応答をステートに追加
      const aiReply = {
        sender: "ai",
        text: data.response || "申し訳ありません、うまく応答できませんでした。",
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "エラーが発生しました。" },
      ]);
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <div style={{ height: "60vh", overflowY: "auto", border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <span style={{
              display: "inline-block",
              background: msg.sender === "user" ? "#d0e8ff" : "#f0f0f0",
              borderRadius: "16px",
              padding: "8px 12px",
              margin: "4px 0"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="メッセージを入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flexGrow: 1, padding: "0.5rem" }}
        />
        <button onClick={handleSend}>送信</button>
      </div>
    </div>
  );
};

export default ChatScreen;
