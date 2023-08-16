package com.mmt.domain.response.chat;

import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ChatRoomRes extends ResponseDto {
    private int lessonId;
    private String lessonTitle;
    private String leastContent;
    private String lestCreateTime;
    private boolean isChatRoomOver;

    public ChatRoomRes(Lesson lesson) {
        this.lessonId = lesson.getLessonId();
        this.lessonTitle = lesson.getLessonTitle();
        this.isChatRoomOver = lesson.getIsChatRoomOver();
    }

    public ChatRoomRes(HttpStatus httpStatus, String message) {
        this.setStatusCode(httpStatus);
        this.setMessage(message);
    }
}
