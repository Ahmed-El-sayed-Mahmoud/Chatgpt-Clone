import React, {
  useReducer,
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import LoaderIcon from "react-loader-icon";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import "../../Components/MainChat.css";
import "../../Components/SideBar.css";
import "./ChatPage.css";
import "../../Components/PopUp.css";
import gpt_img from "../../assets/logo.png";
import ChatHeader from "../../Components/ChatHeader";
import MainChat from "../../Components/MainChat";
import UserRes from "../../Components/UserRes";
import GptRes from "../../Components/GptRes";
import logo from "../../assets/logo.png";
import { AiHelper } from "../../OpenAiHelper";
import Typewriter from "typewriter-effect";
import axios, { formToJSON } from "axios";
import { Navigate } from "react-router-dom";
import {
  getBase64,
  fileToGenerativePart,
  aiImageRun,
} from "../ImageRecognition";
let api = axios.create({
  withCredentials: true,
});
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

let convs = [];
let count = 0;
const initialState = {
  value: "",
  messages: [],
  response: "",
  loading: false,
  generating: false,
  error: "",
  conversations: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_VALUE":
      return { ...state, value: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_GENERATING":
      return { ...state, generating: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "APPEND_RESPONSE":
      return {
        ...state,
        response: state.response + action.payload,
        messages: state.messages.map((msg, index) =>
          index === state.messages.length - 1
            ? { ...msg, text: msg.text + action.payload }
            : msg
        ),
      };
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload };
    default:
      return state;
  }
};

function ChatPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const[file,setFile]=useState("")

  const [imageInineData, setImageInlineData] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [CurrentChatId, setCurChatId] = useState("");
  const [newchatName, setNewChatName] = useState("");
  const [shouldUpdateHistory, setShouldUpdateHistory] = useState(false);
  const msg_end = useRef(null);
  const file_ref=useRef(null)
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file)
    getBase64(file)
      .then((result) => {
        setImage(result);
      })
      .catch((e) => console.log(e));

    fileToGenerativePart(file).then((image) => {
      setImageInlineData(image);
    });
  };
  useLayoutEffect(() => {
    const refreshTokenInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes("/refresh-token")) {
          console.log("url contain to refresh");
          //return navigate("/login")
          return Promise.reject(error);
        }

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const res = await api.get(
              "https://chatgpt-clone-a6nm.vercel.app/user/refresh-token",
              { headers: { "skip-interceptor": true } }
            );
            console.log("Token refreshed", res);
            return api(originalRequest);
          } catch (err) {
            console.error("Token refresh failed", err);
            navigate("/login");
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(refreshTokenInterceptor);
  }, [navigate]);
  const handleLogout = async () => {
    try {
      await axios.delete("https://chatgpt-clone-a6nm.vercel.app/user/logout", {
        withCredentials: true,
      });
      //deleteCookie('refreshtoken');
      deleteCookie("accesstoken");

      navigate("/login");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };
  const GetChat = async (id) => {
    try {
      const response = await api.post(
        "https://chatgpt-clone-a6nm.vercel.app/chat/get-chat",
        {
          conversationId: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("AccessToken"),
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
  const makePostRequest = async (url, name) => {
    try {
      const response = await api.post(
        "https://chatgpt-clone-a6nm.vercel.app/chat/add-chat",
        {
          name: name,
        },
        {
          headers: {
            Authorization: localStorage.getItem("AccessToken"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const fetchConversations = async () => {
    try {
      const response = await api.get(
        "https://chatgpt-clone-a6nm.vercel.app/chat/get-all",
        { withCredentials: true },
        {}
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      /* if (error.response && (error.response.status == 401))
       {
          await GetNewAccessToken();
          //await fetchConversations()
       } */
      console.log(error);

      return [];
    }
  };
  const GetNewAccessToken = async () => {
    try {
      const response = await api.get(
        "https://chatgpt-clone-a6nm.vercel.app/user/refresh-token",
        { withCredentials: true }
      );
    } catch (error) {
      if (error.response && error.response.status == 401)
        navigate("/login", { replace: true });
      console.log(error);
    }
  };
  const loadConversations = async () => {
    try {
      const conversations = await fetchConversations();
      convs = conversations.chats;
      console.log("convs ", convs);
      if (convs.length == 0) {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
      //console.log(conversations)
      if (conversations.chats[0]) {
        setCurChatId(conversations.chats[0]._id);
        dispatch({ type: "SET_CONVERSATIONS", payload: conversations.chats });
        dispatch({
          type: "SET_MESSAGES",
          payload: conversations.chats[0].messages,
        });
        setShouldUpdateHistory(true);
      }
    } catch (err) {}
  };
  useEffect(() => {
    try {
      console.log("mount");
      //GetNewAccessToken();
      console.log("getting convs");
      loadConversations();
      count++;
    } catch (err) {
      console.log("error while getting convs");
      //navigate('/login')
    }
  }, []);
  const DeleteChat = async (id) => {
    try {
      const response = await api.delete(
        `https://chatgpt-clone-a6nm.vercel.app/chat/delete-chat?id=${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("AccessToken"),
            "Content-Type": "application/json",
          },
        }
      );
      await loadConversations();
      dispatch({ type: "" });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
  };
  const handleSubmit = async () => {
    if (state.value === "") return;
    setFile("")
    dispatch({ type: "SET_GENERATING", payload: true });
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: "" });
    dispatch({ type: "APPEND_RESPONSE", payload: "" });
    let newMessage
    console.log(file)
    if(file=="")
    {
      newMessage = { role: "user", text: state.value };
      console.log("adding without image")
    }
     
    else
    {
      newMessage = { role: "user", text: state.value,image:file?.name };
      console.log("adding with image",file?.name)

    }
    const updatedMessages = [newMessage, { role: "model", text: "" }];
    dispatch({ type: "ADD_MESSAGE", payload: newMessage });
    dispatch({ type: "ADD_MESSAGE", payload: { role: "model", text: "" } });
    let complete_res = "";
    let x = [];
    if (shouldUpdateHistory)
      state.messages.map((val) => {
        x.push({ role: val.role, parts: [{ text: val.text }] });
      });
    console.log(x);
    try {
      if(image==="")
      {
        await AiHelper(state.value, shouldUpdateHistory, x, (chunkText) => {
          complete_res += chunkText;
          dispatch({ type: "APPEND_RESPONSE", payload: chunkText });
        });
      }
      else
      {await aiImageRun(state.value,imageInineData,(chunkText) => {
        complete_res += chunkText;
        dispatch({ type: "APPEND_RESPONSE", payload: chunkText });
      })}
      
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: "Error creating chat completion",
      });
      console.error(err);
    } finally {
      setShouldUpdateHistory(false);
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_GENERATING", payload: false });
      updatedMessages[updatedMessages.length - 1].text = complete_res;
      setImage("")
      await AddMessages(updatedMessages, CurrentChatId);

    }
  };

  useEffect(() => {
    msg_end.current.scrollIntoView();
  }, [state.response, state.messages]);
  //////////////////////////////////////////////////
  const AddMessages = async (updatedMessages, chatId) => {
    console.log("messages to add", updatedMessages);
    console.log("chatId", CurrentChatId);
    try {
      const response = await api.post(
        "https://chatgpt-clone-a6nm.vercel.app/chat/add-msgs",
        JSON.stringify({
          conversationId: chatId,
          messages: updatedMessages,
        }),
        {
          headers: {
            Authorization: localStorage.getItem("AccessToken"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
  const calculateRows = (value) => {
    const lines = value.split("\n").length;
    return Math.max(lines, 1);
  };

  const handleChange = (event) => {
    dispatch({ type: "SET_VALUE", payload: event.target.value });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      dispatch({ type: "SET_VALUE", payload: "" });
      
        handleSubmit();
      
    }
  };

  const handleNewChatKeyPress = async (e) => {
    if (e.key === "Enter") {
      if (state.generating) return;
      const res = await makePostRequest(
        "https://chatgpt-clone-a6nm.vercel.app/chat/add-chat",
        newchatName
      );
      dispatch({ type: "CLEAR_MESSAGES" });
      setShowPopup(false);
      //setCurChatId(res._id)
      // console.log(res)
      const conversations = await fetchConversations();
      if (conversations) {
        dispatch({ type: "SET_CONVERSATIONS", payload: conversations.chats });
        if (conversations.chats) setCurChatId(conversations.chats[0]._id);
      }
    }
  };
  const handleChatClick = async (id) => {
    console.log("chat click");
    if (state.generating) return;
    setShouldUpdateHistory(true);
    setCurChatId(id);
    const chat = await GetChat(id);
    console.log(chat);
    if (chat) dispatch({ type: "SET_MESSAGES", payload: chat.messages });
  };
  return (
    <>
      <div className="content">
        {showPopup && (
          <>
            <div className="overlay"></div>
            <div className={`cool-popup${showPopup ? " active" : ""}`}>
              <div className="cool-popup-content">
                <span className="close" onClick={handleClosePopup}>
                  &times;
                </span>
                <p style={{ fontSize: "18px" }}>Chat Name</p>
                <input
                  type="text"
                  onKeyPress={handleNewChatKeyPress}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder="Enter chat name"
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    fontSize: "18px",
                  }}
                />
              </div>
            </div>
          </>
        )}
        <div className="sidebar">
          <div className="sidebar_container">
            <div className="uppper">
              <div className="upper_container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#ffffff"
                    d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"
                  />
                </svg>
                <svg
                  onClick={() => setShowPopup(true)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="#ffffff"
                    d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                  />
                </svg>
              </div>
              <div className="headings ">
                <div className="logo side_part">
                  <div className="img">
                    <img src={gpt_img} alt="GPT logo" />
                  </div>
                  <div className="upper_sidebar_text">
                    <a href="/home"> ChatGpt</a>
                  </div>
                </div>
                <div className="explore side_part">
                  <div className="img">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#ffffff"
                        d="M257 8C120 8 9 119 9 256s111 248 248 248 248-111 248-248S394 8 257 8zm-49.5 374.8L81.8 257.1l125.7-125.7 35.2 35.4-24.2 24.2-11.1-11.1-77.2 77.2 77.2 77.2 26.6-26.6-53.1-52.9 24.4-24.4 77.2 77.2-75 75.2zm99-2.2l-35.2-35.2 24.1-24.4 11.1 11.1 77.2-77.2-77.2-77.2-26.5 26.5 53.1 52.9-24.4 24.4-77.2-77.2 75-75L432.2 255 306.5 380.6z"
                      />
                    </svg>
                  </div>
                  <div className="upper_sidebar_text">
                    {" "}
                    <a href="/home">Explore GPTs</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="lower">
              {state.conversations.map((val) => (
                <div
                  className={CurrentChatId == val._id ? "active_chat" : ""}
                  key={val._id}
                >
                  <ChatHeader
                    text={val.name}
                    id={val._id}
                    del_func={DeleteChat}
                    normal_func={handleChatClick}
                  />
                </div>
              ))}
            </div>
            <div className="logout">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
        <div className="chat">
          <div className="chat_container">
            <div className="conv">
              {state.messages.length === 0 && (
                <div className="init">
                  <img src={logo} alt="Logo" style={{ height: "400px" }} />
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(
                          "Unlock the exceptional power and speed of our AI model, ensuring quick"
                        )
                        .pauseFor(1500)
                        .deleteChars(5)
                        .typeString("effective responses")
                        .pauseFor(1500)
                        .deleteChars(19)
                        .typeString("Precise Responses")
                        .start();
                    }}
                  />
                </div>
              )}
              {state.messages.map((message, index) => {
                if (message.role === "user") {
                  return <UserRes key={index} text={message.text} image={message.image} />;
                } else {
                  return <GptRes key={index} text={message.text} />;
                }
              })}
              <div ref={msg_end}></div>
              {state.loading&&<LoaderIcon type={"cubes"}color={"white"} size={50} />}
            </div>
            <div className="input_text">
              
              {/* <input
                type="file"
                id="fileInput"
                style={{
                  opacity: 0,
                  position: "absolute",
                  cursor: "pointer",
                  width: "41px",
                }}
                onChange={handleImageChange}
              /> */}
              <div>
     <label  htmlFor="formId">
         <input ref={file_ref} accept=".jpg, .jpeg, .png" onChange={handleImageChange} name="" type="file" id="formId" hidden />
         <svg className="file"
                xmlns="http://www.w3.org/2000/svg"
                style={{ cursor: "pointer" }}
                viewBox="0 0 448 512"
              >
                <path
                  fill="#ffffff"
                  d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
                />{" "}
              </svg>
     </label>
 </div>

              <textarea
                placeholder="Type your message here..."
                value={state.value}
                onChange={handleChange}
                rows={calculateRows(state.value)}
                onKeyDown={handleKeyPress}
                disabled={state.generating}
                style={{ resize: "none" }}
              />
              <svg
                onClick={handleSubmit}
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              
              >
                <path
                  fill={state.value === "" ? "#808080" : "#FFFFFF"}
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.707a1 1 0 00-1.414-1.414L5.586 9.586a1 1 0 000 1.414l3.707 3.707a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2h-3.586l1.293-1.293z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {file!=""&&(<div className="uploaded"><p>{file?.name}</p><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#ffffff" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z"/></svg></div>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
