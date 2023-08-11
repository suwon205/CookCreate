import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatList = (props) => {
  console.log("props", props);
  const accessToken = localStorage.getItem("access_token");
  const [chatlist, setChatList] = useState([]);

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
  }, []);

  const formatTime = (dateTimeString) => {
    const dateObject = new Date(dateTimeString);
    const formattedTime = dateObject.toISOString().slice(0, 16);
    return formattedTime;
  };

  const handleChatRoom = ({ chatTitle, lessonId, chatOver }) => {
    console.log(chatTitle, lessonId, chatOver);
    props.goChatRoom({ chatTitle, lessonId, chatOver });
  };

  return (
    <div>
      <h2>참여중인 채팅방</h2>
      <ul>
        {chatlist.map((chatRoom) => (
          <div key={chatRoom.lessonId}>
            {chatRoom.chatRoomOver === false && (
              <>
                <div onClick={() => handleChatRoom({ lessonId: chatRoom.lessonId, chatTitle: chatRoom.lessonTitle, chatOver: chatRoom.chatRoomOver })}>
                  {/* <Link to={`/chatroom`}> */}
                  <strong>{chatRoom.lessonTitle}</strong>
                  <p>마지막 메세지:{chatRoom.leastContent}</p>
                  {/* <span>시간: {chatRoom.lestCreateTime}</span> */}
                  <span>{formatTime(chatRoom.lestCreateTime)}</span>
                </div>
              </>
            )}
            {chatRoom.chatRoomOver === true && (
              <>
                <p>완료된 채팅방</p>
                <div onClick={() => handleChatRoom({ lessonId: chatRoom.lessonId, chatTitle: chatRoom.leastContent, chatOver: chatRoom.chatRoomOver })}>
                  {/* <Link to={`/chatroom`}> */}
                  <strong>{chatRoom.lessonTitle}</strong>
                  <p>마지막 메세지: {chatRoom.leastContent}</p>
                  <span>종료 시간: {formatTime(chatRoom.lestCreateTime)}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
