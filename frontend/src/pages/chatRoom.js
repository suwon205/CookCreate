import React from "react";
import InputChat from "../component/ChatRoom/InputChat";
import HeaderChat from "../component/ChatRoom/HeaderChat"
import ShowChat from "../component/ChatRoom/ShowChat";
import ChatList from "../component/ChatList/ChatList";
// import "../style/chatroom.css"
import "../style/chatroom.css"


function ChatRoom() {

  return (
    // <div className="chat-room-container">
    //   <HeaderChat />
    //   <div className="chat-list-container">
    //     <ChatList/>
    //   </div>
    //   <div>
    //     <ShowChat />
    //   </div>
    //   <div className="input-chat-container">
    //     <InputChat />
    //   </div>
    // </div>
    <div className="chat-room-container">
    <HeaderChat />
    <div className="chat-list-container">
      <ChatList />
    </div>
    <div className="chat-space"></div>
    <div>
      <ShowChat />
    </div>
    <div className="input-chat-container">
      <InputChat />
    </div>
  </div>

  );
}

export default ChatRoom;
