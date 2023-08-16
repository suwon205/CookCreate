package com.mmt.domain.entity.chat;

import com.mmt.domain.entity.BaseTimeEntity;
import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.entity.lesson.Lesson;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Chat extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int message_id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Member member;
    private String content;
    @Enumerated
    private Type type;

}

