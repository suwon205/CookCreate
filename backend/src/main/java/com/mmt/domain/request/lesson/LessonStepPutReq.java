package com.mmt.domain.request.lesson;

import com.mmt.domain.entity.lesson.LessonStep;
import lombok.Data;

import java.util.List;

@Data
public class LessonStepPutReq {
    private int lessonId;
    private List<LessonStep> lessonStepList;
}
