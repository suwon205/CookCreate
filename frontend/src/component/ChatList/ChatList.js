import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";



const ChatListContainer = styled.div`
  // flex: 1;
  background-color: #ffffff;
  border-left: 0.7px solid #D9D9D9;
  border-right: 0.7px solid #D9D9D9;
  border-bottom : 0.7px solid #D9D9D9;
  // overflow-y: auto;
  // margin-right: 1px;

  flex: none;
  width: 100%;
  height: 550px; 
  // background-color: rgb(255 239 221);
  // border-right: 2px solid #ccc;
  overflow-y: auto;
  margin-right: 1px;
`;

const StyledChatH3 = styled.h3`
  font-size: 1.0rem;
  font-weight : 500;  
  color: #FFFFFF;
  text-align: center; 
`;


const Wrapper = styled.header`
  width: 100%;
  border-left: 0.9px solid #D9D9D9;
  border-right: 0.9px solid #D9D9D9;
  // background-color: #ff8a00;
  // background-color: #ff9416;
  background-color: #FFB697;
  height: 70px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 30px;

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
  const [selectedRoom, setSelectedRoom] = useState([]);


  useEffect(() => {
    console.log(chatlist);
    axios
      .get(`/api/v1/chat`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        // console.log("채팅목록", res.data);
        setChatList(res.data);
      })
      .catch((err) => {
        console.log("채팅목록 조회못함", err);
      });
  }, []);



  const handleChatRoom = ({ chatTitle, lessonId, chatOver }) => {
    console.log(chatTitle, lessonId, chatOver);
    props.goChatRoom({ chatTitle, lessonId, chatOver });

  };


  useEffect(()=>{
    console.log("선택된 채팅방",selectedRoom)
  },[selectedRoom])

  

  return (
    <div>
      <Wrapper>
        <StyledChatH3>참여중인 채팅방</StyledChatH3>
      </Wrapper>
      <ChatListContainer>  
        <div>
          {chatlist.map((chatRoom) => (
            <div key={chatRoom.lessonId}>
              {chatRoom.chatRoomOver === false && (
                <>
                  <div style={{ backgroundColor: selectedRoom === chatRoom.lessonId ? "rgb(243 243 243)" : "#FFFFFF", 
                  // marginLeft: '40px',
                  cursor: 'pointer',
                  padding: '20px 30px',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                }} 
                  // onClick={() => handleChatRoom({ lessonId: chatRoom.lessonId, chatTitle: chatRoom.lessonTitle, chatOver: chatRoom.chatRoomOver }),setSelectedRoom(chatRoom.lessonId)}>
                  onClick={() => {
                    setSelectedRoom(chatRoom.lessonId);
                    handleChatRoom({
                      lessonId: chatRoom.lessonId,
                      chatTitle: chatRoom.lessonTitle,
                      chatOver: chatRoom.chatRoomOver
                    });
                  }}
                  >  
                    {chatRoom.lessonTitle ? <strong style={{color: "#414141", cursor: "pointer"}}>{chatRoom.lessonTitle}</strong> : <p>참여중인 채팅방이 없습니다.</p>}
                    {chatRoom.leastContent !== null ? (
                      <div>
                        <p style={{ color:'#B5B4B4', fontSize : '1rem', marginTop : '0.4rem'}} >{chatRoom.leastContent.length > 10 ? chatRoom.leastContent.slice(0, 12) + ".." : chatRoom.leastContent}</p>
                        {/* <span>{formatTime(chatRoom.lestCreateTime)}</span> */}
                        <span style={{ fontSize: "0.8rem", color:'#B5B4B4' }}>
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
                      <div>
                        <p style={{ color:'#B5B4B4', fontSize : '1rem', marginTop : '0.4rem'}} >아직 채팅 내용이 없어요.</p>
                        {/* <span>{formatTime(chatRoom.lestCreateTime)}</span> */}
                        <span style={{ fontSize: "0.8rem", color:'#ffffff00' }}>
                          '' 
                        </span>  
                      </div>
                    )}
                  </div>
                </>
              )}

              {chatRoom.chatRoomOver === true && (
                <>
                  <div  style={{ backgroundColor: selectedRoom === chatRoom.lessonId ? "rgb(243 243 243)" : "#FFFFFF", 
                  cursor: 'pointer',
                  padding: '20px 30px',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                
                }}
                  // onClick={() => handleChatRoom({ lessonId: chatRoom.lessonId, chatTitle: chatRoom.leastContent, chatOver: chatRoom.chatRoomOver })}>
                    onClick={() => {
                      setSelectedRoom(chatRoom.lessonId);
                      handleChatRoom({
                        lessonId: chatRoom.lessonId,
                        chatTitle: chatRoom.lessonTitle,
                        chatOver: chatRoom.chatRoomOver
                      });
                    }}
                    >  
                    <strong  style={{color:"#414141",cursor: "pointer"}} onClick={() => setSelectedRoom(chatRoom.lessonId)} >{chatRoom.lessonTitle}</strong>
                    <p style={{ color:'#B5B4B4', fontSize : '1rem', marginTop : '0.4rem' }}>{chatRoom.leastContent.length > 10 ? chatRoom.leastContent.slice(0, 12) + "..." : chatRoom.leastContent}</p>
                    {/* <span>종료 시간: {formatTime(chatRoom.lestCreateTime)}</span> */}
                    <span style={{ fontSize: "0.8rem", color:'#B5B4B4'  }}>
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