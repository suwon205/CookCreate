import React, { useState } from "react";
import styled from "styled-components";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import axios from "axios";

const Wrapper = styled.footer`
  display: flex;
  position: relative;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  min-height: 50px;
  max-height: 200px;
  overflow: auto;
  padding: 6px;
  z-index: 100;
  // background-color: #f5f2f2;
  // display: flex;
  justify-content: flex-end;

  // border: 1px solid rgb(255 239 221);
  border: 1px solid #D9D9D9;
  

  
  & form {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    
    & textarea,
    button {
      display: inline-block;
      border: none;
      outline: none;
    }
    
    & textarea {
      width: 100%;
      resize: none;
      height: 90%;
      margin: 0;
      padding: 5px 20px;
    }
    
    & button {
      width: 52px;
      height: 47.5px;
      // background: #ff8a00;
      
      &.canSubmit {
        cursor: pointer;
        pointer-events: all;
        color: #ffedca;
        // background: #ff9416;
        background: #FF7A42;
        border-radius: 10%;
      }
      
      &.cannotSubmit {
        pointer-events: none;
        color: #b4b4b4;
        border-radius: 10%;
      }
    }
  }
`;


const InputChat = ({ sendMessage }) => {
  // const accessToken = useSelector((state) => state.auth.token);
  const role = localStorage.getItem("role");
  const [messages, setMessages] = useState("");
  const isCanSubmit = !!messages.replace(/ |\n/g, "");
  const btnClassName = isCanSubmit ? "canSubmit" : "cannotSubmit";

  const onMessageChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setMessages(value);
  };

  // const dispatch = useDispatch();

  // const onSubmit = (event) => {
  //   event.preventDefault();
  //   if (isCanSubmit) {
  //     dispatch(Chatting(contents));
  //     // dispatch(sendMessage({ message, localeTime: new Date().toLocaleTimeString() }));
  //     console.log(contents);
  //     setContents("");
  //   }
  // };

  const onSubmit = (e) => {
    // e.preventDefault();
    if (isCanSubmit) {
      sendMessage(messages);
      setMessages("");
    }
  };

  const onEnterPress = (event) => {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  const buttonContent = role === "COOKIEE" ? "🍪" : "🍳"; // 버튼 내용 설정


  return (
    <Wrapper>
      <form onSubmit={onSubmit}>
        <textarea value={messages} autoFocus={true} onChange={onMessageChange} onKeyPress={onEnterPress} />
        <button className={btnClassName} type="submit">
          <p style={{ fontSize: '20px' }} >{buttonContent}</p>
          {/* <p style={{ fontSize: '20px' }} >🍳</p> */}
        </button>
      </form>
    </Wrapper>
  );
};

export default InputChat;
