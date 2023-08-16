package com.mmt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mmt.domain.request.chat.ChatSaveReq;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {
    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    // redis에서 메세지가 발행되면 대기하고 있던 redis subscriber가 해당 메세지를 받아 처리한다.
    @Override
    public void onMessage(Message message, byte[] pattern) {

        log.debug("redis subscriber");

        try {
            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());

            ChatSaveReq chatMessage = objectMapper.readValue(publishMessage, ChatSaveReq.class);

            log.debug(chatMessage.toString());

            messagingTemplate.convertAndSend("/sub/room/" + chatMessage.getLessonId(), chatMessage);
        } catch (Exception e) {
            log.error(e.getMessage());
        }

    }
}
