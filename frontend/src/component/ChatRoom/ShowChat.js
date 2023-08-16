import React, { useEffect, useRef, useState } from "react";
import { MyChat, FriendChat, SeparationBlock } from "./ChatBlock";
import HeaderChat from "./HeaderChat";
import InputChat from "./InputChat"
import * as StompJs from "@stomp/stompjs";
import axios from "axios";

const ShowChat = ({lessonId, chatTitle, chatOver}) => {
  const accessToken = localStorage.getItem("access_token");
  const nick = localStorage.getItem("nickname");
  const id = localStorage.getItem("id");
  // const [EnterNickname, setEnterNickname] = useState("")

  const [messageList, setMessageList] = useState([])


  /** 스크롤 관련 */
  const scrollRef = useRef()

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messageList])

  const client = useRef({});



  const connect = () => {

    client.current = new StompJs.Client({
      // brokerURL: `wss://i9c111.p.ssafy.io/api/v1/message`,
      brokerURL: `ws://localhost:8080/api/v1/message`,
      onConnect: () => {
        console.log("웹소켓 연결");
  
        // const destination = "/pub/chat/enter";
        // const data = {
        //   lessonId: lessonId,
        //   userId: id,
        //   nickname: nick,
        // };
  
        // const body = JSON.stringify(data);
        // console.log("채팅입장", body);
        // const ParsedData = JSON.parse(body);
        // console.log("PD",ParsedData.nickname)
        // setEnterNickname(ParsedData.nickname);
        // console.log("닉넴",EnterNickname)
        

        // client.current.publish({ destination, body });
        // console.log("enter!");
  

        //입장시 채팅내용조회
        axios
          .get(`/api/v1/chat/${lessonId}`, {
            headers: {
              Access_Token: accessToken,
            },
          })
          .then((res) => {
            console.log("채팅내용", res.data);
            setMessageList(res.data);
            console.log("채팅", messageList);
          })
          .catch((err) => {
            console.log("채팅내용 조회못함", err);
          });
  
        subscribe(client);
      },
    });
  
    client.current.activate();
  }




  const subscribe = (client) => {
    client.current.subscribe("/sub/room/" + lessonId, (message) => {
      console.log(message, "구독1")
      const json_body = JSON.parse(message.body);
      console.log(json_body, "구독2")
      setMessageList((prev) => [...prev, json_body]);
    });
  }

  const sendMessage = (messages) => {
    if (!client.current.connected) return
    const destination = "/pub/chat/message";
    const data = {
      lessonId: lessonId,
      userId: id,
      nickname: nick,
      content: messages,
    };
    const body = JSON.stringify(data);
    console.log("채팅내용", body);

    client.current.publish({ destination, body });
    console.log("chat!");
  };

  const disconnect = () => {
    client.current.deactivate();

  };

  useEffect(() => {
    if (lessonId) {
      connect()
      return () => disconnect()
    }
  }, [lessonId])

  return (
    <div>
      <HeaderChat lessonId={lessonId} chatTitle={chatTitle} chatOver={chatOver} />
      <div style={{ overflowY: "auto", height: "450px", background:"#FFF9F6" }} id="ChatRoom" ref={scrollRef}>
        {messageList.map((chat, index) => {
          if (chat.type === "CHAT")  {
            // return <SeparationBlock  key={index} EnterNickname={chat.content} />
             return chat.userId !== id ? (<FriendChat key={index} message={chat.content} author={chat.userId} />)
             : (<MyChat key={index} message={chat.content} />
             )
          }
        }
        )}
      </div>
      {!chatOver && (
        <div className="InputChatContainer" >
          <InputChat sendMessage={sendMessage} />
        </div>
      )}
    </div>
  );
};

export default ShowChat;


