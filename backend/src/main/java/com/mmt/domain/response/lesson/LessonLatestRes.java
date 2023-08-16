package com.mmt.domain.response.lesson;

import com.mmt.domain.entity.lesson.Difficulty;
import com.mmt.domain.entity.lesson.Lesson;
import com.mmt.domain.entity.lesson.LessonStep;
import com.mmt.domain.response.ResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
public class LessonLatestRes extends ResponseDto {

    private String lessonTitle;
    private String cookyerId;
    private int categoryId;
    private Difficulty difficulty;
    private int timeTaken;
    private String description;
    private int maximum;
    private int price;
    private List<String> materials;
    private String videoUrl;
    private List<LessonStep> lessonStepList;

    public LessonLatestRes(Lesson lesson){
        this.lessonTitle = lesson.getLessonTitle();
        this.cookyerId = lesson.getCookyerId();
        this.categoryId = lesson.getLessonCategory().getCategoryId();
        this.difficulty = lesson.getDifficulty();
        this.timeTaken = lesson.getTimeTaken();
        this.description = lesson.getDescription();
        this.maximum = lesson.getMaximum();
        this.price = lesson.getPrice();
        this.materials = Arrays.asList(lesson.getMaterials().split(","));
        this.videoUrl = lesson.getVideoUrl();
        this.lessonStepList = lesson.getLessonStepList();
    }
}
