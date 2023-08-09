import React, { useState } from "react";
import styled from "styled-components";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";

const Wrapper = styled.footer`
  position: fixed;
  bottom: 0px;
  right: 0px; /* Adjust right position */
  width: 80%;
  min-height: 50px;
  max-height: 200px;
  overflow: auto;
  padding: 6px;
  z-index: 100;
  background-color: #eeeeee;
  display: flex; /* Add display flex */
  justify-content: flex-end; /* Align to the right */
  
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
      height: 100%;
      margin: 0;
      padding: 5px 20px;
    }
    & button {
      width: 50px;
      height: 40px;
      background: #ff8a00;
      &.canSubmit {
        cursor: pointer;
        pointer-events: all;
        color: #ffffff;
      }
      &.cannotSubmit {
        pointer-events: none;
        color: #b4b4b4;
      }
    }
  }
`;

const InputChat = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const [contents, setContents] = useState("");
  const isCanSubmit = !!contents.replace(/ |\n/g, "");
  const btnClassName = isCanSubmit ? "canSubmit" : "cannotSubmit";

  const onMessageChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setContents(value);
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
    e.preventDefault();
    const data = {
      // lessonId,
      // userId,
      contents
    };
    axios
      .put(`api/v1/send/{lessonId}`, data, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onEnterPress = (event) => {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Wrapper>
      <form onSubmit={onSubmit}>
        <textarea value={contents} autoFocus={true} onChange={onMessageChange} onKeyPress={onEnterPress} />
        <button className={btnClassName} type="submit">
          전송
        </button>
      </form>
    </Wrapper>
  );
};

export default InputChat;
