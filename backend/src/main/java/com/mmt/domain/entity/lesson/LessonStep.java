package com.mmt.domain.entity.lesson;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@DynamicUpdate
public class LessonStep { // 요리 진행 단계

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lessonStepId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @JsonIgnore
    private Lesson lesson;

    private int stepOrder;
    private String stepContent;
}