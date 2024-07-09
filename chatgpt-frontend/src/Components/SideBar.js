import React, { useState } from "react";
import "./SideBar.css";
import gpt_img from "../assets/logo.png";
import ChatHeader from "./ChatHeader";
function SideBar() {
    
  return (
    <>
      <div className="sidebar_container">
        <div className="uppper">
          <div className="upper_container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="#ffffff"
                d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"
              />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                fill="#ffffff"
                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
              />
            </svg>
          </div>
          <div className="headings ">
            <div className="logo side_part">
              <div className="img">
                <img src={gpt_img}></img>
              </div>
              <div className="upper_sidebar_text">ChatGpt</div>
            </div>
            <div className="explore side_part">
              <div className="img">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#ffffff"
                    d="M257 8C120 8 9 119 9 256s111 248 248 248 248-111 248-248S394 8 257 8zm-49.5 374.8L81.8 257.1l125.7-125.7 35.2 35.4-24.2 24.2-11.1-11.1-77.2 77.2 77.2 77.2 26.6-26.6-53.1-52.9 24.4-24.4 77.2 77.2-75 75.2zm99-2.2l-35.2-35.2 24.1-24.4 11.1 11.1 77.2-77.2-77.2-77.2-26.5 26.5 53.1 52.9-24.4 24.4-77.2-77.2 75-75L432.2 255 306.5 380.6z"
                  />
                </svg>
              </div>
              <div className="upper_sidebar_text">Explore GPTs</div>
            </div>
          </div>
        </div>
        <div className="lower">
          <ChatHeader text="What is Programming ?" />
          <ChatHeader text="Net framework" />
          <ChatHeader text="Internship program application" />
          <ChatHeader text="What is Programming dmfns  wjf of oie foiw f f3fwef ?" />
        </div>
      </div>
    </>
  );
}

export default SideBar;
