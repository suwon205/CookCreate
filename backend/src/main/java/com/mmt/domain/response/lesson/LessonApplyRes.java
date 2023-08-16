package com.mmt.domain.response.lesson;

import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LessonApplyRes extends ResponseDto {
    private int lessonId;
    private String lessonTitle;
    private int timeTaken;
    private int price;
    private String lessonDate;

    public LessonApplyRes(Lesson lesson){
        this.lessonId = lesson.getLessonId();
        this.lessonTitle = lesson.getLessonTitle();
        this.timeTaken = lesson.getTimeTaken();
        this.price = lesson.getPrice();
        this.lessonDate = lesson.getLessonDate();
    }
}