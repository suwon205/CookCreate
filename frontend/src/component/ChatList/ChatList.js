import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";



const ChatListContainer = styled.div`
  // flex: 1;
  // padding: 20px;
  background-color: #ffffff;
  border: 1px solid #D9D9D9;
  // overflow-y: auto;
  // margin-right: 1px;

  flex: none;
  height: 512px; 
  width: 230px;
  padding: 20px;
  // background-color: rgb(255 239 221);
  // border-right: 2px solid #ccc;
  overflow-y: auto;
  margin-right: 1px;
`;

const StyledChatH3 = styled.h3`
  font-size: 17px;
  color: #414141;
  text-align: center; 
`;


const Wrapper = styled.header`
  width: 100%;
  border: 1px solid #D9D9D9;
  // background-color: #ff8a00;
  // background-color: #ff9416;
  background-color: #FFB697;
  height: 70px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  flex-direction: row-reverse;

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
    width: 60px;
    height: 30px;

    font-size: 15px;
    background-color: #FF7A42;
    // background-color: #ff9416;
    // background-color: #FF7A42;
    outline: none;
    cursor: pointer;
    border-radius: 3px;
    border: none;
    color: wheat;
    // &:hover {
    //   background-color: #FF7A42;
    // }
  }
`;



const ChatList = (props) => {
  console.log("props", props);
  const accessToken = localStorage.getItem("access_token");
  const [chatlist, setChatList] = useState([]);
  const [selected, setSelected] = useState(false);


//선택한 채팅방 색 바꾸기
  const handleClick = () => {
    setSelected(!selected);
  };

  const textStyle = {
    color: selected ? '#FF7A42' : '#414141',
  };



  useEffect(() => {
    console.log(chatlist);
    axios
      .get(`/api/v1/chat`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("채팅목록", res.data);
        setChatList(res.data);
      })
      .catch((err) => {
        console.log("채팅목록 조회못함", err);
      });
  }, [chatlist]);

  // const formatTime = (dateTimeString) => {
  //   const dateObject = new Date(dateTimeString);
  //   const formattedTime = dateObject.toISOString().slice(0, 16);
  //   return formattedTime;
  // };

  const handleChatRoom = ({ chatTitle, lessonId, chatOver }) => {
    console.log(chatTitle, lessonId, chatOver);
    props.goChatRoom({ chatTitle, lessonId, chatOver });
    // setSelectedChatRoom(chatRoom.lessonId)}
    // onMouseEnter={() => setSelectedChatRoom(chatRoom.lessonId)}
    // onMouseLeave={() => setSelectedChatRoom(null)}
  };


  // const selectRoom = (lessonId) => {
  //   setSelectedChatRoom(lessonId);
  // }

  return (
    <div>
      <Wrapper>
      </Wrapper>
      <ChatListContainer>
        <StyledChatH3>참여중인 채팅방</StyledChatH3>
        <div>
          {chatlist.map((chatRoom) => (
            <div key={chatRoom.lessonId}>
              {chatRoom.chatRoomOver === false && (
                <>
                  <div style={{  marginLeft: '40px'}} onClick={() => handleChatRoom({ lessonId: chatRoom.lessonId, chatTitle: chatRoom.lessonTitle, chatOver: chatRoom.chatRoomOver })}>
                    {/* <Link to={`/chatroom`}> */}
                    {chatRoom.lessonTitle ? <strong style={textStyle} onClick={handleClick} >{chatRoom.lessonTitle}</strong> : <p>참여중인 채팅방이 없습니다.</p>}
                    {chatRoom.leastContent !== null ? (
                      <div>
                        <p style={{ color:'#B5B4B4'}} >{chatRoom.leastContent.length > 10 ? chatRoom.leastContent.slice(0, 12) + ".." : chatRoom.leastContent}</p>
                        {/* <span>{formatTime(chatRoom.lestCreateTime)}</span> */}
                        <span style={{ fontSize: "10px", color:'#B5B4B4' }}>
                          {new Date(chatRoom.lestCreateTime).toLocaleDateString("ko-KR", {
                            month: "2-digit",
                            day: "2-digit",
                            weekday: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ) : (
                      <p></p>
                    )}
                  </div>
                </>
              )}

              {chatRoom.chatRoomOver === true && (
                <>
                  {/* <h3 className="ChatH3" style={{ fontSize: 17, color: 'rgb(87, 49, 14)',textAlign:'center' }} >종료된 채팅방</h3> */}
                  <StyledChatH3>종료된 채팅방</StyledChatH3>
                  <div  style={{ marginLeft: '40px' }} onClick={() => handleChatRoom({ lessonId: chatRoom.lessonId, chatTitle: chatRoom.leastContent, chatOver: chatRoom.chatRoomOver })}>
                    {/* <Link to={`/chatroom`}> */}
                    <strong  style={textStyle} onClick={handleClick} >{chatRoom.lessonTitle}</strong>
                    {/* <h2>{chatRoom.lessonTitle}</h2> */}
                    {/* <p>마지막 메세지: {chatRoom.leastContent}</p> */}
                    <p style={{ color:'#B5B4B4' }}>{chatRoom.leastContent.length > 10 ? chatRoom.leastContent.slice(0, 12) + "..." : chatRoom.leastContent}</p>
                    {/* <span>종료 시간: {formatTime(chatRoom.lestCreateTime)}</span> */}
                    <span style={{ fontSize: "10px",color:'#B5B4B4' }}>
                      {new Date(chatRoom.lestCreateTime).toLocaleDateString("ko-KR", {
                        month: "2-digit",
                        day: "2-digit",
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ChatListContainer>
    </div>
  );
};

export default ChatList;
