import React from "react";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.header`
  width: 100%;
  background-color: #ff8a00;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  flex-direction: row-reverse;

  & span {
    font-weight: bold;
    font-size: 20px;
    margin-right: 50px;
    text-align: center;
    flex-grow: 1;
  }

  & button {
    font-size: 20px;
    background-color: #a9bdce;
    outline: none;
    cursor: pointer;
    &:hover {
      color: #dcdcdc;
    }
  }
`;

const HeaderChat = ({ lessonId, chatTitle, chatOver }) => {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  // const history = useHistory();

  //채팅종료여부
  console.log("chatOver", chatOver);
  console.log("role", role);

  const ExitT = () => {
    axios
      .put(
        `/api/v1/chat/close/${lessonId}`,
        {},
        {
          headers: {
            Access_Token: accessToken,
          },
        }
      )
      .then((res) => {
        console.log("채팅종료", res.data);
      })
      .catch((err) => {
        console.log("채팅종료못함", err);
      });

      axios
      .put(`/api/v1/chat/${lessonId}`,
        {},
       {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("채팅나가기", res.data);
      })
      .catch((err) => {
        console.log("채팅나가기못함", err);
      });

      alert("채팅이 종료되었습니다.")
  };

  const ExitS = () => {
    axios
      .put(`/api/v1/chat/${lessonId}`,
        {},
       {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("채팅나가기", res.data);
      })
      .catch((err) => {
        console.log("채팅나가기못함", err);
      });

      alert("채팅방나가기 성공")
  };

  const onBefore = () => {
    window.location.href = '/';
  };

  return (
    <Wrapper>
      {role === 'COOKYER' && chatOver === false ? (
      <button type="button" onClick={ExitT}>
        <p>종료</p>
        <i className="fas fa-arrow-left" />
      </button>
    ) : null}
    {role === 'COOKIEE' && chatOver === false ? (
      <button type="button" onClick={ExitS}>
        <p>나가기</p>
        <i className="fas fa-arrow-left" />
      </button>
    ) : null}
    <button type="button" onClick={onBefore}>
      <p>HOME</p>
      <i className="fas fa-arrow-left" />
    </button>
    <span>{chatTitle}</span>
    </Wrapper>
  );
};

export default HeaderChat;
