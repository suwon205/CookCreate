import React, { useState } from "react";
import ChatList from "../component/ChatList/ChatList";
import ShowChat from "../component/ChatRoom/ShowChat";
import "../style/chat/chatroom.css";

function ChatRoom() {
  //채팅받기
  // const [chatinfo, setChatInfo] = useState([]);
  // const [chatList, setChatList] = useState([]); // 화면에 표시될 채팅 기록
  // const { lessonId } = useParams();

  const [chatTitle, setChatTitle] = useState();
  const [lessonId, setLessonId] = useState(null);
  const [chatOver, setChatOver] = useState(false);

  const goChatRoom = ({ lessonId, chatTitle, chatOver }) => {
    console.log("고챗룸", chatOver);
    setLessonId(lessonId);
    setChatTitle(chatTitle);
    setChatOver(chatOver);
  };

  const emptyHeader = {
    width: '100%',
    backgroundColor: '#FFB697',
    height: '70px'
  };

  const emptyRoom = {
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: '510px',
    position: 'relative',
  };

  return (
    <div className="chatroom-container">
      <div className="ChatListContainer">
        <ChatList goChatRoom={goChatRoom} />
      </div>
      <div className="chat-room-content">
        {lessonId === null ? (
          <div className="ChatSpace"> 
            <div style={emptyHeader}/>
            <div style={emptyRoom}>
              <p className="Emptychat">채팅방을 선택해주세요.</p>
            </div>
          </div>
        ) : (
          <div className="ChatSpace">
            <ShowChat lessonId={lessonId} chatTitle={chatTitle} chatOver={chatOver} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
