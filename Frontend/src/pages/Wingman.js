import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IoMdSend,
  IoMdVolumeHigh,
  IoMdPause,
  IoMdMic,
  IoMdArrowDown,
  IoMdCopy,
} from "react-icons/io";

const Wingman = () => {
  const typingIntervalRef = useRef(null); // Reference for managing bot typing simulation
  const micTimeoutRef = useRef(null); // Reference for managing mic timeout
  const messagesEndRef = useRef(null); // Reference for scrolling to the bottom of messages
  const messagesContainerRef = useRef(null); // Reference for the messages container
  const inputRef = useRef(null); // Reference for the input textarea
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  // State Variables
  const [userInteracted, setUserInteracted] = useState(false); // Track if the user has interacted
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Duplicate, consider removing
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false); // Track if textarea is disabled
  const [isTyping, setIsTyping] = useState(false); // Track if the bot is typing
  const [messages, setMessages] = useState([]); // Array of chat messages
  const [inputMessage, setInputMessage] = useState(""); // The current input message
  const [isLoading, setIsLoading] = useState(false); // Track loading state for sending messages
  const [speakingIndex, setSpeakingIndex] = useState(null); // Track the currently speaking message index
  const [listening, setListening] = useState(false); // Track if speech recognition is active
  const [micTimeout, setMicTimeout] = useState(null); // Timeout for auto-sending the message after 2 seconds of silence
  const [showScrollButton, setShowScrollButton] = useState(false); // Track if scroll-to-bottom button should be shown
  // **Updated state for copied message**
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null); // Track which message was copied

  const navigate = useNavigate(); // Navigation hook from React Router

  // Check if user is logged in by looking for the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Auto-scroll to the bottom of the messages container only when at the bottom
  useEffect(() => {
    if (messagesContainerRef.current && autoScrollEnabled) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping, autoScrollEnabled]);

  // Scroll event listener to manage the scroll button and auto-scroll state
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const { scrollTop, scrollHeight, clientHeight } = container;

        // Allow a small threshold to account for rounding issues
        const isScrolledToBottom =
          Math.abs(scrollHeight - scrollTop - clientHeight) <= 1;

        // Update the state for scroll button visibility
        setShowScrollButton(!isScrolledToBottom);

        // Enable or disable auto-scroll based on user scrolling
        setAutoScrollEnabled(isScrolledToBottom);
      }
    };

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", handleScroll);
    }

    // Cleanup the event listener
    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  // Auto-focus useEffect
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  // Function to handle sending a message
  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    // Add user message
    const newMessage = { sender: "user", text: message, speaking: false };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage(""); // Clear input field

    setIsTyping(true); // Show typing state
    setIsTextareaDisabled(true); // Disable the textarea while typing

    try {
      // Send the user message to the backend
      const response = await axios.post(
        "http://localhost:5000/api/wingman/chat",
        { message }
      );
      const botReply =
        response.data.reply || "Sorry, I couldn't understand that.";

      // Add initial "Thinking..." message to simulate thinking state
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", speaking: false },
      ]);

      // Start simulating typing the bot's reply
      simulateTyping(botReply);
    } catch (error) {
      console.error("Error communicating with the chatbot:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Oops! Something went wrong. Please try again later.",
          speaking: false,
        },
      ]);
      setIsTyping(false);
      setIsTextareaDisabled(false); // Re-enable the textarea on error
    }
  };
  // Function to simulate bot typing
  const simulateTyping = (text) => {
    let i = 0;
    const typingSpeed = 50; // Adjust typing speed here (ms per character)

    typingIntervalRef.current = setInterval(() => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = {
          sender: "bot",
          text: text.slice(0, i + 1), // Reveal the text character by character
          speaking: false,
        };
        return newMessages;
      });
      i++;

      if (i === text.length) {
        clearInterval(typingIntervalRef.current); // Stop when the text is fully revealed
        setIsTyping(false); // Reset typing state
        setIsTextareaDisabled(false); // Enable the textarea after typing stops

        // Restore focus to the textarea
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.selectionStart = inputRef.current.value.length;
            inputRef.current.selectionEnd = inputRef.current.value.length;
          }
        }, 50); // Slight delay to ensure proper focus
      }
    }, typingSpeed);
  };
  // Function to stop typing and show the full response
  const stopTyping = () => {
    setIsTyping(false);
    clearInterval(typingIntervalRef.current);
    setIsTextareaDisabled(false);

    // Show the full bot reply immediately
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.sender === "bot") {
        lastMessage.text = lastMessage.text;
      }
      return newMessages;
    });

    // Ensure proper focus management
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    }, 50);
  };

  // Function to make the bot's message speak
  const speakMessage = (index, message) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Set the speaking index to the current message index
    setSpeakingIndex(index);

    // Function to split the message into chunks
    const splitMessageIntoChunks = (message, maxLength = 200) => {
      const chunks = [];
      let chunk = "";

      // Split message into chunks of maxLength (e.g., 200 characters)
      message.split(" ").forEach((word) => {
        if ((chunk + " " + word).length <= maxLength) {
          chunk += " " + word;
        } else {
          chunks.push(chunk.trim());
          chunk = word;
        }
      });

      // Push any remaining chunk
      if (chunk) {
        chunks.push(chunk.trim());
      }

      return chunks;
    };

    // Split the message into smaller chunks
    const messageChunks = splitMessageIntoChunks(message);

    // Create a new SpeechSynthesisUtterance for each chunk
    let currentIndex = 0;

    const speakNextChunk = () => {
      if (currentIndex < messageChunks.length) {
        const speech = new SpeechSynthesisUtterance(
          messageChunks[currentIndex]
        );
        const voices = window.speechSynthesis.getVoices();

        // Set the desired voice (Google UK English Male in this case)
        const selectedVoice = voices.find(
          (voice) => voice.name === "Google UK English Male"
        );
        if (selectedVoice) {
          speech.voice = selectedVoice; // Set the selected voice
        }

        // Set speech parameters for a heavier voice
        speech.rate = 0.9; // Slow down the speech slightly for a deeper sound
        speech.pitch = 0.7; // Lower the pitch for a heavier male voice

        // Event when speech ends, move to the next chunk
        speech.onend = () => {
          currentIndex++;
          speakNextChunk(); // Recursively speak the next chunk
        };

        // Speak the current chunk
        window.speechSynthesis.speak(speech);
      } else {
        setSpeakingIndex(null); // Reset when all chunks are spoken
      }
    };

    // Start speaking from the first chunk
    speakNextChunk();
  };

  // Ensure voices are available after loading
  window.speechSynthesis.onvoiceschanged = () => {
    // Update available voices here if needed
  };

  // Function to stop the speech if it's playing
  const stopSpeech = () => {
    window.speechSynthesis.cancel(); // Stop the ongoing speech
    setSpeakingIndex(null); // Reset the speaking state
  };

  // Set up Speech Recognition for voice input
  const setupSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false; // Don't show interim results
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) =>
      console.error("Speech recognition error:", event);
    recognition.onresult = (event) => {
      let transcript = event.results[event.resultIndex][0].transcript;
      setInputMessage(""); // Clear the input field
      handleSendMessage(transcript); // Send the message
    };

    recognition.start();

    // Automatically stop speech recognition if no speech for 2 seconds
    if (micTimeout) clearTimeout(micTimeout);
    setMicTimeout(
      setTimeout(() => {
        if (inputMessage.trim()) {
          handleSendMessage(inputMessage); // Send message after timeout
        }
      }, 2000) // Set 2 seconds timeout
    );
  };

  // Function to handle mic button click
  const handleMicClick = () => {
    if (listening) {
      setListening(false);
      window.SpeechRecognition && window.SpeechRecognition.stop();
    } else {
      setupSpeechRecognition();
    }
  };
  // Function to copy message text
  const handleCopyMessage = (message, index) => {
    navigator.clipboard.writeText(message.text).then(() => {
      // Update the copiedMessageIndex to show which message is copied
      setCopiedMessageIndex(index);

      // Reset copied state after 2 seconds for the copied message
      setTimeout(() => {
        setCopiedMessageIndex(null); // Reset the copied index after timeout
      }, 2000);
    });
  };

  return (
    <div className="flex justify-center min-h-screen bg-dark py-8">
      <div
        className="flex flex-col bg-dark border rounded-xl mx-8 px-8 py-6"
        style={{
          width: "100%",
          height: "calc(100vh - 52px)",
          borderRadius: "30px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Chat Header */}
        <header
          className="text-white text-center py-3 px-4"
          style={{ width: "100%", borderRadius: "10px" }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Wingman - Your Fitness Companion |{" "}
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              What can I help with?
            </span>
          </h1>
        </header>

        {/* Chat Messages (Scrollable container) */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 mb-12 custom-scrollbar"
          style={{
            maxHeight: "calc(100vh - 200px)",
            scrollbarWidth: "none",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                style={{ maxWidth: "40%" }}
                className={`p-3 rounded-lg shadow-xl ${
                  message.sender === "user"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                <p
                  className="break-words"
                  style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                >
                  {message.text}
                </p>

                {message.sender === "bot" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() =>
                        speakingIndex === index
                          ? stopSpeech()
                          : speakMessage(index, message.text)
                      }
                      className="text-indigo-500 hover:text-indigo-400"
                    >
                      {speakingIndex === index ? (
                        <IoMdPause size={20} />
                      ) : (
                        <IoMdVolumeHigh size={20} />
                      )}
                    </button>

                    {/* Copy Icon */}
                    <button
                      onClick={() => handleCopyMessage(message, index)}
                      className="text-indigo-500 hover:text-indigo-400"
                    >
                      <IoMdCopy size={20} />
                    </button>

                    {/* Show "Copied!" message only for the copied message */}
                    {copiedMessageIndex === index && (
                      <span className="text-green-500 text-sm">Copied!</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showScrollButton && (
          <button
            className="absolute top-[75%] left-1/2 transform -translate-x-1/2 p-2 bg-indigo-500 rounded-full shadow-md text-white hover:bg-indigo-600"
            onClick={() => {
              if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTo({
                  top: messagesContainerRef.current.scrollHeight,
                  behavior: "smooth",
                });
              }
            }}
          >
            <IoMdArrowDown size={18} />
          </button>
        )}

        {/* Message Input (Fixed at the bottom) */}
        <div
          className="p-4 border-t bg-dark flex items-center"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#1a1a1a",
          }}
        >
          <div
            className="relative flex-1"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <textarea
              rows={1}
              placeholder="Ask Wingman...."
              className="flex-1 p-2 bg-dark text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                const textarea = e.target;
                const maxLineHeight = 120;
                textarea.style.height = "auto";
                textarea.style.height = `${Math.min(
                  textarea.scrollHeight,
                  maxLineHeight
                )}px`;
                textarea.style.overflowY =
                  textarea.scrollHeight > maxLineHeight ? "scroll" : "hidden";
              }}
              id="messageBox"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                  const textarea = document.getElementById("messageBox");
                  if (textarea) {
                    textarea.style.height = "auto";
                    textarea.style.overflowY = "hidden";
                  }
                }
              }}
              disabled={isTextareaDisabled}
              ref={inputRef}
              onFocus={() => {
                // Optional: Add logic for user interaction tracking if needed
              }}
              style={{
                scrollbarWidth: "thin", // For Firefox
                scrollbarColor: "#808080 transparent", // For Firefox
              }}
            ></textarea>
          </div>

          {/* Mic Button visible only when textarea is empty and bot is not typing */}
          {inputMessage.trim() === "" && !isTyping && !isLoading && (
            <button
              onClick={handleMicClick}
              className="ml-2 text-white bg-indigo-600 p-2 rounded-md shadow hover:bg-indigo-700"
              disabled={isTyping || isLoading} // Disable mic when typing or loading
            >
              <IoMdMic size={20} />
            </button>
          )}

          {/* Send/Stop Button */}
          <button
            onClick={isTyping ? stopTyping : handleSendMessage} // Toggle between stop and send actions
            className={`ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-600 ${
              isLoading || isTyping ? "opacity-100" : "opacity-100"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              "Sending..."
            ) : isTyping ? (
              "Stop"
            ) : (
              <IoMdSend size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wingman;
