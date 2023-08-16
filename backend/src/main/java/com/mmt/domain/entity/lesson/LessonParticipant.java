package com.mmt.domain.entity.lesson;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mmt.domain.entity.BaseTimeEntity;
import com.mmt.domain.entity.auth.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
// 과외 신청자/참여자
public class LessonParticipant extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lessonParticipantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Member member;

    private boolean isLeaveChat;
    private boolean isCompleted; // true면 끝남, false면 아직 시작 안함
}