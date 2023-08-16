package com.mmt.controller;

import com.mmt.domain.entity.chat.Type;
import com.mmt.domain.request.chat.ChatSaveReq;
import com.mmt.domain.response.chat.ChatRes;
import com.mmt.service.ChatService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "채팅 메세지 API", description = "채팅 메세지 관련 API입니다.")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/message")
public class MessageController {
    private final RedisTemplate<String,Object> redisTemplate;
    private final ChatService chatService;
    private final ChannelTopic channelTopic;
    private final SimpMessageSendingOperations simpMessageSendingOperations;
    /*
        /sub/room/1                     - 구독(lessonId : 1)
        /pub/chat/(enter/message)       - 메세지 발행
     */

    @MessageMapping("/chat/enter")
    public void enter(ChatSaveReq message) {
        log.debug("enter");
        message.setContent(message.getNickname() + "님이 채팅방에 입장했습니다.");
        message.setType(Type.ENTER);

        ChatRes chatRes = chatService.saveMessage(message);
        redisTemplate.convertAndSend(channelTopic.getTopic(),chatRes);
//        simpMessageSendingOperations.convertAndSend("/sub/room/" + message.getLessonId(),chatRes);

    }

    @MessageMapping("/chat/message")
    public void message(ChatSaveReq message) {
        message.setType(Type.CHAT);
        
        ChatRes chatRes = chatService.saveMessage(message);
        redisTemplate.convertAndSend(channelTopic.getTopic(),chatRes);
//        simpMessageSendingOperations.convertAndSend("/sub/room/" + message.getLessonId(),chatRes);
    }
}
