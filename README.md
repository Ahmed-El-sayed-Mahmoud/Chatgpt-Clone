# Chemini: A ChatGPT Clone using Gemini API

Chemini is a ChatGPT clone built with the MERN stack (MongoDB, Express, React, Node.js) and utilizes the Gemini API for AI-generated responses. The project includes user authentication with JWT, HTTP requests with Axios, and caching with Redis for improved performance. Additionally, users can send and receive pictures in the chat interface.

## Live URL
View the live deployment of Chemini: [Chemini ChatGPT Clone](https://chatgpt-clone-frontend-kappa.vercel.app/home)

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [License](#license)

## Features
- Real-time chat interface
- AI-generated responses using Gemini API
- User authentication with JWT
- State management with Redux
- Caching with Redis
- Responsive design
- Send pictures with image recognition

## Technologies Used
**Frontend:**
- React
- React Router
- Axios
- Redux

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose
- Redis
- JSON Web Token (JWT)
- Google Generative AI (Gemini API)

https://github.com/Ahmed-El-sayed-Mahmoud/Chatgpt-Clone/assets/130814088/f9c508c7-b73e-46c0-a859-bd7feec2aa54

## Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js
- npm (Node Package Manager)
## Environment Variables
Create a `.env` file in the root directory of your project and add the following variables:
- REACT_APP_OPENAI_API_KEY=your_openai_api_key
- REACT_APP_GEMINI_API_KEY=your_gemini_api_key
- REDIS_CLIENT_KEY=your_redis_client_key


### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chemini.git
   cd chemini
