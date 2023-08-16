package com.mmt.domain.response.lesson;

import com.mmt.domain.entity.lesson.Difficulty;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
public class LessonSearchRes extends ResponseDto {
    private int lessonId;
    private String lessonTitle;
    private String cookyerId;
    private String cookyerName;
    private int categoryId;
    private Difficulty difficulty;
    private int timeTaken;
    private int remaining;
    private int maximum;
    private int price;
    private List<String> materials;
    private String lessonDate;
    private float reviewAvg;
    private int reviewCnt;
    private float reviewSum;
    private String thumbnailUrl;
    private int jjimCount;
    private String createdDate;
    private String modifiedDate;
    private Long toDeadline;
    private boolean isOver; // 마감됐는지
    private boolean isEnd; // 과외가 종료됐는지
    private String sessionId;

    public LessonSearchRes(Lesson lesson){
        this.lessonId = lesson.getLessonId();
        this.lessonTitle = lesson.getLessonTitle();
        this.cookyerId = lesson.getCookyerId();
        this.cookyerName = lesson.getCookyerName();
        this.categoryId = lesson.getLessonCategory().getCategoryId();
        this.difficulty = lesson.getDifficulty();
        this.timeTaken = lesson.getTimeTaken();
        this.maximum = lesson.getMaximum();
        this.price = lesson.getPrice();
        this.materials = Arrays.asList(lesson.getMaterials().split(","));
        this.lessonDate = lesson.getLessonDate();
        this.thumbnailUrl = lesson.getThumbnailUrl();
        this.jjimCount = lesson.getJjimCount();
        this.createdDate = lesson.getCreatedDate().toString();
        this.modifiedDate = lesson.getModifiedDate().toString();
        this.isOver = lesson.getIsOver();
        this.isEnd = lesson.getIsEnd();
        this.sessionId = lesson.getSessionId();
    }
}
