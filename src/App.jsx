import { useState, useRef, useEffect } from "react";
// import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: { contents: [{ parts: [{ text: currentQuestion }] }] },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: "Sorry - Something went wrong. Please try again!" },
      ]);
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-gray-100 drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Modern AI Chat
      </motion.h1>

      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
        <div
          ref={chatContainerRef}
          className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-900"
        >
          {chatHistory.map((chat, index) => (
            <motion.div
              key={index}
              className={`flex ${chat.type === "question" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[70%] p-4 rounded-xl text-sm font-medium shadow-md ${{
                  question: "bg-blue-600 text-white",
                  answer: "bg-gray-700 text-gray-300",
                }[chat.type]}`}
              >
                <ReactMarkdown>{chat.content}</ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={generateAnswer} className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <textarea
              className="flex-1 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              rows="1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={generatingAnswer}
            >
              {generatingAnswer ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
              <span>{generatingAnswer ? "Loading..." : "Send"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;