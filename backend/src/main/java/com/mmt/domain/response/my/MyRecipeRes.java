package com.mmt.domain.response.my;

import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.lesson.LessonStep;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class MyRecipeRes extends ResponseDto {
    private int lessonId;
    private String lessonTitle;
    private String cookyerId;
    private String cookyerName;
    private int categoryId;
    private String lessonDate;
    private String thumbnailUrl;
    private List<LessonStep> lessonStepList;

    public MyRecipeRes(Lesson lesson){
        this.lessonId = lesson.getLessonId();
        this.lessonTitle = lesson.getLessonTitle();
        this.cookyerId = lesson.getCookyerId();
        this.cookyerName = lesson.getCookyerName();
        this.categoryId = lesson.getLessonCategory().getCategoryId();
        this.lessonDate = lesson.getLessonDate();
        this.thumbnailUrl = lesson.getThumbnailUrl();
        this.lessonStepList = lesson.getLessonStepList();
    }
}
