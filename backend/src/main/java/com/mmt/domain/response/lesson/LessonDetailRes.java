package com.mmt.domain.response.lesson;

import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.entity.lesson.Difficulty;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.lesson.LessonParticipant;
import com.mmt.domain.entity.lesson.LessonStep;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
public class LessonDetailRes {
    private int lessonId;
    private String lessonTitle;
    private String cookyerId;
    private String cookyerName;
    private int categoryId;
    private String categoryName;
    private Difficulty difficulty;
    private int timeTaken;
    private String description;
    private int remaining;
    private int maximum;
    private int price;
    private List<String> materials;
    private String lessonDate;
    private float reviewAvg;
    private int reviewCnt;
    private float reviewSum;
//    private List<LessonParticipant> lessonParticipantList;
    private String videoUrl;
    private String thumbnailUrl;
    private List<LessonStep> lessonStepList;
    private int jjimCount;
    private String createdDate;
    private String modifiedDate;
    private boolean isApproved;
    private String phoneNumber;
    private String userEmail;
    private List<Integer> food;
    private String introduce;
    private String profileImg;
    private boolean isOver; // 마감됐는지
    private boolean isEnd; // 과외가 종료됐는지
    private String sessionId;

    public LessonDetailRes(Lesson lesson){
        this.lessonId = lesson.getLessonId();
        this.lessonTitle = lesson.getLessonTitle();
        this.cookyerId = lesson.getCookyerId();
        this.cookyerName = lesson.getCookyerName();
        this.categoryId = lesson.getLessonCategory().getCategoryId();
        this.difficulty = lesson.getDifficulty();
        this.timeTaken = lesson.getTimeTaken();
        this.description = lesson.getDescription();
        this.maximum = lesson.getMaximum();
        this.price = lesson.getPrice();
        this.materials = Arrays.asList(lesson.getMaterials().split(","));
        this.lessonDate = lesson.getLessonDate();
        this.videoUrl = lesson.getVideoUrl();
        this.thumbnailUrl = lesson.getThumbnailUrl();
        this.jjimCount = lesson.getJjimCount();
        this.createdDate = lesson.getCreatedDate().toString();
        this.modifiedDate = lesson.getModifiedDate().toString();
//        this.lessonParticipantList = lesson.getLessonParticipantList();
        this.isOver = lesson.getIsOver();
        this.isEnd = lesson.getIsEnd();
        this.sessionId = lesson.getSessionId();
    }
}