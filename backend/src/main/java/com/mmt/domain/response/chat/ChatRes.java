package com.mmt.domain.response.chat;

import com.mmt.domain.entity.chat.Chat;
import com.mmt.domain.entity.chat.Type;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ChatRes extends ResponseDto {
    private String userId;
    private String nickname;
    private int lessonId;
    private String content;
    private Type type;
    private String createTime;

    public ChatRes(Chat chat) {
        this.userId = chat.getMember().getUserId();
        this.nickname = chat.getMember().getNickname();
        this.lessonId = chat.getLesson().getLessonId();
        this.content = chat.getContent();
        this.type = chat.getType();
        this.createTime = chat.getCreatedDate().toString();
    }

    public ChatRes(HttpStatus httpStatus, String message) {
        this.setStatusCode(httpStatus);
        this.setMessage(message);
    }
}
