import React, { useEffect, useRef } from "react";
import "./MainChat.css";
import { useState } from "react";
import UserRes from "./UserRes";
import GptRes from "./GptRes";
import logo from "../assets/logo.png";
import { AiHelper } from "../OpenAiHelper";
import Typewriter from "typewriter-effect";
let messages = [];
function MainChat() {
  const msg_end = useRef(null);
  const [value, setValue] = useState("");
  const [update, setupdate] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, SetGenerating] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async () => {
    if (value == "") return;
    SetGenerating(true);
    setLoading(true);
    setError("");
    setResponse("");

    let newMessage = { role: "user", text: value };
    console.log("messssaaages", messages);
    messages = [...messages, newMessage, { role: "model", text: "" }];
    setupdate(true);

    try {
      await AiHelper(value, (chunkText) => {
        console.log("handle Submiiit");
        messages[messages.length - 1].text += chunkText;
        setResponse((r) => r + chunkText);
      });
    } catch (err) {
      setError("Error creating chat completion");
      console.error(err);
    } finally {
      setLoading(false);
      console.log(messages);
      SetGenerating(false);
    }
  };

  useEffect(() => {
    msg_end.current.scrollIntoView();
  }, [response]);
  const calculateRows = (value) => {
    const lines = value.split("\n").length;
    return Math.max(lines, 1);
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setValue("");
      handleSubmit(event);
    }
  };
const newchat=()=>{
  
}
  return (
    <>
      <div className="chat_container">
        <div className="conv">
          {messages.length == 0 && (
            <div className="init">
              <img src={logo} alt="Logo" style={{ height: "400px" }} />
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString(
                      "Unlock the exceptional power and speed of our AI model, ensuring quick"
                    )
                    .pauseFor(1500)
                    .deleteChars(5);

                  typewriter
                    .typeString("effective responses")
                    .pauseFor(1500)
                    .deleteChars(19);

                  typewriter
                    .typeString("Pricise Responses")

                    .start();
                }}
              />
            </div>
          )}
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {update &&
            messages.slice(0, -1).map((val, index) => {
              if (val.role == "user")
                return (
                  <div className="msg">
                    {" "}
                    <UserRes text={val.text} />
                  </div>
                );
              else
                return (
                  <div className="msg">
                    {" "}
                    <GptRes text={val.text} />
                  </div>
                );
            })}
          {update && (
            <div className="msg">
              {" "}
              <GptRes text={response} />
            </div>
          )}

          <div ref={msg_end} />
        </div>
        <div className="input_text">
          <textarea
            placeholder="Message ChatGPT"
            onChange={handleChange}
            value={value}
            rows={calculateRows(value)}
            onKeyPress={handleKeyPress}
            disabled={generating}
            style={{ resize: "none" }}
          />
          <svg
            onClick={handleSubmit}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill={value == "" ? "#808080" : "#FFFFFF"}
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z"
            />
          </svg>
        </div>
      </div>
    </>
  );
}

export default MainChat;
