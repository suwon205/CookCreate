package com.mmt.domain;

import com.mmt.domain.entity.lesson.Lesson;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class ChatRoomDto {
    private int lessonId;
    private String lessonTitle;
    private Set<WebSocketSession> sessions = new HashSet<>();

    public static ChatRoomDto create(Lesson lesson) {
        ChatRoomDto room = new ChatRoomDto();
        room.lessonId = lesson.getLessonId();
        room.lessonTitle = lesson.getLessonTitle();
        return room;
    }

}
