package com.mmt.service;

import com.mmt.domain.request.chat.ChatSaveReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.chat.ChatRes;
import com.mmt.domain.response.chat.ChatRoomRes;

import java.util.List;

public interface ChatService {
    ChatRes saveMessage(ChatSaveReq message);
    ResponseDto closeChatRoom(String userId, int lessonId);
    ResponseDto leaveChatRoom(String userId, int lessonId);
    List<ChatRes> getChatMessageList(String userId, int lessenId);
    List<ChatRoomRes> getChatRoomList(String userId);
    boolean isUserParticipantChatRoom(String userId, int lessonId);

}

