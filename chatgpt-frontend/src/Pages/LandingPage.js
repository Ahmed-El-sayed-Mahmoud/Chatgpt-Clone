import React from 'react';
import './LandingPage.css';
import logo from '../assets/logo.png'; 
import land from '../assets/land.jpg'
import video from "../assets/video.mp4";
function LandingPage() {
  return (
    <div className="container ll">
        <video className="video-background" src={video} autoPlay muted loop></video>
         <header className="header">

            <div className='logo'> <img src={logo} alt="OpenAI Logo" className="logo" /> <div className='text'>OpenAi</div> </div>
       
        <nav className="nav">
          <ul>
            <li><a href="/signup" className="signup-link">SignUp</a></li>
            <li><a href="/login" className="signup-link">LogIn</a></li>
            
          </ul>
        </nav>
      </header>
<div className='ontent'>
    <div className='text'>We’ve trained a model called ChatGPT which interacts in a conversational way. The dialogue format makes it possible for ChatGPT to answer followup questions, admit its mistakes, challenge incorrect premises, and reject inappropriate requests.</div>
    <button><a href='/'>Try it Now</a></button>
</div>
      
    </div>
  );
}

export default LandingPage;
