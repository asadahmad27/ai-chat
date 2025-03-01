import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, sendMessage, setError } from "../../redux/reducers/chat";
import axios from "axios";
import { ArrowSend } from "../icons";

const BASE_URL = "http://localhost:3333";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { chatHistory, loading, error } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [failedMessage, setFailedMessage] = useState(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory, failedMessage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create preview
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const sendMessageToAPI = async (message, image) => {
    let response;
    if (image) {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("image", image);

      response = await axios.post(`${BASE_URL}/api/chat-with-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await axios.post(`${BASE_URL}/api/chat`, { message });
    }
    return response.data.response;
  };

  const handleSubmit = async (e, retry = false) => {
    e.preventDefault();

    const messageToSend = retry ? failedMessage.message : message;
    const imageToSend = retry ? failedMessage.image : image;

    if (!retry) {
      // Show user message instantly
      dispatch(
        sendMessage({
          user: messageToSend,
          ai: null,
          type: "user",
          image: imagePreview,
        })
      );
    }

    setMessage("");
    setImage(null);
    setImagePreview(null);
    setFailedMessage(null);
    dispatch(setLoading(true));

    setTimeout(async () => {
      try {
        const aiResponse = await sendMessageToAPI(messageToSend, imageToSend);

        // Show AI response
        dispatch(
          sendMessage({
            user: aiResponse,
            ai: "",
            type: "ai",
          })
        );
      } catch (err) {
        console.error("Message failed:", messageToSend);
        setFailedMessage({ message: messageToSend, image: imageToSend });
      } finally {
        dispatch(setLoading(false));
      }
    }, 2000);
  };

  // Auto-expand textarea when typing
  const handleTextareaChange = (e) => {
    setMessage(e.target.value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on content
  };

  // Handle Enter key press (send message instead of new line)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line
      if (message.trim()) {
        handleSubmit(e); // Sends the message
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-17rem)] bg-[#131629] text-white">
      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {error && <p className="text-red-500">{error}</p>}

        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs p-3 rounded-lg shadow-md bg-gray-700 text-white break-words">
              {chat.image && (
                <img
                  src={chat.image}
                  alt="Uploaded"
                  className="mb-2 rounded-md"
                />
              )}
              <p>{chat.user}</p>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-4"></div>
            Generating Response...
          </div>
        )}

        {/* Retry Button at Bottom if Message Fails */}
        {failedMessage && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-red-700 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={(e) => handleSubmit(e, true)}
            >
              Retry Last Message
            </button>
          </div>
        )}
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1D36] p-4 border-t border-gray-700 flex flex-col"
      >
        {/* Image Preview Section */}
        {imagePreview && (
          <div className="relative mb-2 flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 rounded-md shadow-md"
            />
            <button
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
              onClick={removeImage}
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center space-x-3">
          {/* Image Upload Button */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </label>

          {/* Expanding Textarea Input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-[#131629] border border-gray-700 text-white rounded-lg px-4 py-3 resize-none overflow-hidden focus:outline-none focus:border-gray-500"
            rows="1"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;
