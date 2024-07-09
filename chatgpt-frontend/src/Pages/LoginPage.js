import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import logo from "../assets/darklogo.png";
import micro from "../assets/micro.png";
import google from "../assets/google.png";
import video from "../assets/video.mp4";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const[email,setEmail]=useState()
    const[password,setPassword]=useState()
    const[error,setError]=useState("")
    const navigate=useNavigate()
    useEffect(() => {
      const checkIfLoggedIn = async () => {
        try {
          const response = await axios.post("http://localhost:3000/user/isloggedin",{},{withCredentials:true});
          if (response.status === 200) {
            navigate("/");
          }
        } catch (error) {
          console.log(error);
        }
      };
  
      checkIfLoggedIn();
    }, []);
    const handleLogIn= async(e)=>{
        e.preventDefault();
        console.log(email,password)
        try{
                axios.defaults.withCredentials=true
            const response=await axios.post('http://localhost:3000/user/login',
                {
                    email:email,
                    password:password
                }
            )
            setError("")
            console.log(response.data)
            navigate("/")
            
        }
        catch(err)
        {
            console.log(err.response.data.error.message)
            setError(err.response.data.error.message)
            console.log(err)
        }
        
    }


  return (

    <div className="back">
      <video className="video-background" src={video} autoPlay muted loop></video>
      <div className="login_container">
        <div className="login_logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2 className="welcome-text">WELCOME BACK</h2>
        <form className="login-form">
          <div className="input-group">
            <div className="border">
              <div className="text">Email Address</div>
              <input id="email" type="email" className="input" placeholder="name@example.com" required onChange={(e)=>setEmail(e.target.value) }/>
            </div>
            <div className="border">
              <div className="text">Password</div>
              <input id="password" type="password" className="input" placeholder="Type Strong Password" required onChange={(e)=>setPassword(e.target.value)} />
            </div>
          </div>
          {error!=""&&<p className='error'>{"*"+error}</p>}
          <button type="submit" className="continue-button" onClick={handleLogIn}>Continue</button>
        </form>
        <p className="signup-text">
          Don't have an account? <a href="/signup" className="signup-link">Sign up</a>
        </p>
        <div className="separator">OR</div>
        <button className="social-login google-login">
          <img src={google} alt="Google Icon" className="social-icon" />
          Continue with Google
        </button>
        <button className="social-login microsoft-login">
          <img src={micro} alt="Microsoft Icon" className="social-icon" />
          Continue with Microsoft Account
        </button>
      </div>
    </div>
  );
}
