package com.mmt.domain.response.lesson;

import com.mmt.domain.entity.lesson.LessonStep;
import lombok.Data;

@Data
public class LessonStepRes {
    private int stepOrder;
    private String stepContent;

    public LessonStepRes(LessonStep lessonStep){
        this.stepOrder = lessonStep.getStepOrder();
        this.stepContent = lessonStep.getStepContent();
    }
}
