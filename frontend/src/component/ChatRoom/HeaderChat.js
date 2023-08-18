import React, {useState} from "react";
import styled from "styled-components";
import axios from "axios";
import AlertModal from "../Modal/AlertModal";
const Wrapper = styled.header`
  width: 100%;
  // border-right: 0.7px solid #D9D9D9;
  // background-color: #ff8a00;
  // background-color: #ff9416;
  background-color: #FFB697;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;

  & span {
    color:#FFFFFF;
    font-weight: bold;
    font-size: 25px;
    // margin-right: 50px;
    text-align: center;
    flex-grow: 1;
    justify-content: center;
    display:flex;
    // margin-left: 60px;
  }

  & button {
    align-items: center;
    justify-content: center;
    display:flex;
    padding: 0.3rem 0.7rem;

    font-size: 15px;
    background-color: #FF7A42;
    // background-color: #ff9416;
    // background-color: #FF7A42;
    outline: none;
    cursor: pointer;
    border-radius: 3px;
    border: none;
    color : #ffffff;
    // &:hover {
    //   background-color: #FF7A42;
    // }
  }
`;

const style = {
  fontSize: '1.0rem',
  fontWeight : '500',
  color: '#FFFFFF',
  textAlign: 'center', 
};

const HeaderChat = ({ lessonId, chatTitle, chatOver }) => {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  // const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);

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
      // setModalOpen(true)
      alert("채팅이 종료되었습니다.")
      window.location.href = '/';
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
      // setModalOpen(true)
      window.location.href = '/';
  };

  // const onBefore = () => {
  //   window.location.href = '/';
  // };

  return (
    <Wrapper>
      <div style={style}>{chatTitle}</div>
        <div>
          {role === 'COOKYER' && chatOver === false ? (
          <button type="button" onClick={ExitT}>
            <p>종료</p>
            <i className="fas fa-arrow-left" />
          </button>
        ) : null}
        {role === 'COOKIEE' && chatOver === false ? (
          <button type="button" onClick={ExitS}>
            <p>나가기</p>
          </button>
        ) : null}
      </div>
    </Wrapper>
  );
};

export default HeaderChat;
