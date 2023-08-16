package com.mmt.service.impl;

import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.entity.chat.Chat;
import com.mmt.domain.entity.chat.Type;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.lesson.LessonParticipant;
import com.mmt.domain.request.chat.ChatSaveReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.chat.ChatRes;
import com.mmt.domain.response.chat.ChatRoomRes;
import com.mmt.repository.ChatRepository;
import com.mmt.repository.MemberRepository;
import com.mmt.repository.lesson.LessonParticipantRepository;
import com.mmt.repository.lesson.LessonRepository;
import com.mmt.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.nullness.Opt;
import org.checkerframework.checker.units.qual.C;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final LessonRepository lessonRepository;
    private final LessonParticipantRepository lessonParticipantRepository;
    private final ChatRepository chatRepository;
    private final MemberRepository memberRepository;
    @Override
    public ChatRes saveMessage(ChatSaveReq message) {
        Lesson lesson = lessonRepository.findByLessonId(message.getLessonId()).get();
        Member member = memberRepository.findByUserId(message.getUserId()).get();
        Chat chat = Chat.builder()
                .member(member)
                .lesson(lesson)
                .content(message.getContent())
                .type(message.getType())
                .build();

        chatRepository.save(chat);

        return new ChatRes(chat);
    }

    @Override
    public ResponseDto closeChatRoom(String userId, int lessonId) {
        // 예외 처리
        Lesson lesson = lessonRepository.findByLessonId(lessonId).get();
        if(!lesson.getCookyerId().equals(userId)) {
            return new ResponseDto(HttpStatus.FORBIDDEN, "해당 수업을 개설한 Cookyer만 이용 가능합니다.");
        }

        lesson.setIsChatRoomOver(true);
        lessonRepository.save(lesson);
        return new ResponseDto(HttpStatus.OK, "success");
    }

    @Override
    public ResponseDto leaveChatRoom(String userId, int lessonId) {
        Lesson lesson = lessonRepository.findByLessonId(lessonId).get();
        if(lesson.getCookyerId().equals(userId) && !lesson.getIsChatRoomOver()) {
            return new ResponseDto(HttpStatus.BAD_REQUEST, "Cookyer은 채팅방을 닫은 후 나갈 수 있습니다.");
        }

        LessonParticipant lessonParticipant = lessonParticipantRepository.findByLesson_LessonIdAndMember_UserId(lessonId, userId).get();
        lessonParticipant.setLeaveChat(true);
        lessonParticipantRepository.save(lessonParticipant);
        return new ResponseDto(HttpStatus.OK, "success");
    }

    @Override
    public List<ChatRes> getChatMessageList(String userId, int lessonId) {
        List<ChatRes> result = new ArrayList<>();

        if (!isUserParticipantChatRoom(userId, lessonId)) {
            result.add(new ChatRes(HttpStatus.FORBIDDEN, "접근 권한이 없는 채팅방입니다."));
            return result;
        }

        List<Chat> messageList = lessonRepository.findByLessonId(lessonId).get().getChatList();

        if(messageList.isEmpty()) {
            result.add(new ChatRes(HttpStatus.OK, "채팅 내용이 없습니다."));
            return result;
        }

        for(Chat chat : messageList) {
            ChatRes chatRes = new ChatRes(chat);
            chatRes.setStatusCode(HttpStatus.OK);
            chatRes.setMessage("success");

            result.add(chatRes);
        }

        return result;
    }

    @Override
    public List<ChatRoomRes> getChatRoomList(String userId) {
        List<LessonParticipant> lessonParticipantList = lessonParticipantRepository.findAllByMember_UserIdAndIsLeaveChat(userId, false);
        List<ChatRoomRes> result = new ArrayList<>();

        for (LessonParticipant lessonParticipant : lessonParticipantList) {
            Lesson lesson = lessonParticipant.getLesson();
            ChatRoomRes chatRoomRes = new ChatRoomRes(lesson);

            Optional<Chat> chatRoom = chatRepository.findFirst1ByLesson_LessonIdOrderByCreatedDateDesc(lesson.getLessonId());
            if(!chatRoom.isPresent()) {
                chatRoomRes.setStatusCode(HttpStatus.OK);
                chatRoomRes.setMessage("해당 채팅방에 채팅 내역이 없습니다.");
                result.add(chatRoomRes);
                continue;
            }

            Chat chat = chatRoom.get();

            chatRoomRes.setLeastContent(chat.getContent());
            chatRoomRes.setLestCreateTime(chat.getCreatedDate().toString());
            chatRoomRes.setStatusCode(HttpStatus.OK);
            chatRoomRes.setMessage("success");

            result.add(chatRoomRes);
        }

        if(result.isEmpty()) {
            result.add(new ChatRoomRes(HttpStatus.OK, "참여 중인 채팅방이 없습니다."));
        }

        return result;
    }

    @Override
    public boolean isUserParticipantChatRoom(String userId, int lessonId) {
        Optional<LessonParticipant> isParticipant = lessonParticipantRepository.findByLesson_LessonIdAndMember_UserId(lessonId, userId);
        if(!isParticipant.isPresent()) {
           return false;
        }

        LessonParticipant lessonParticipant = isParticipant.get();
        if (lessonParticipant.isLeaveChat()) {
            return false;
        }

        return true;
    }
}
