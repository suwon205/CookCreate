package com.mmt.domain.entity.lesson;

import com.mmt.domain.entity.BaseTimeEntity;
import com.mmt.domain.entity.lesson.Difficulty;
import com.mmt.domain.request.lesson.LessonPostReq;
import com.mmt.domain.request.lesson.LessonPutReq;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@DynamicUpdate // 변경된 컬럼만 찾아서 변경
public class Lesson extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lessonId;
    private String lessonTitle;
    private String cookyerId;
    private String cookyerName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private LessonCategory lessonCategory;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<LessonParticipant> lessonParticipantList = new ArrayList<>();

    private Difficulty difficulty;
    private int timeTaken;
    private String description;
    private int maximum;
    private int price;
    private String materials;
    private String lessonDate;
    private int jjimCount;
    private String videoUrl;
    private String thumbnailUrl;
    private String sessionId;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<LessonStep> lessonStepList = new ArrayList<>();

    public Lesson(LessonPostReq lessonPostReq){
        this.lessonTitle = lessonPostReq.getLessonTitle();
        this.cookyerId = lessonPostReq.getCookyerId();
        this.difficulty = lessonPostReq.getDifficulty();
        this.timeTaken = lessonPostReq.getTimeTaken();
        this.description = lessonPostReq.getDescription();
        this.maximum = lessonPostReq.getMaximum();
        this.price = lessonPostReq.getPrice();
        this.materials = String.join(",", lessonPostReq.getMaterials());
        this.lessonDate = lessonPostReq.getLessonDate();
        this.videoUrl = lessonPostReq.getVideoUrl();
        this.thumbnailUrl = lessonPostReq.getThumbnailUrl();
        this.lessonStepList = lessonPostReq.getLessonStepList();
        this.sessionId = lessonPostReq.getSessionId();
    }

    public void update(LessonPutReq lessonPutReq){
        this.lessonId = lessonPutReq.getLessonId();
        this.lessonTitle = lessonPutReq.getLessonTitle();
        this.cookyerId = lessonPutReq.getCookyerId();
        this.difficulty = lessonPutReq.getDifficulty();
        this.timeTaken = lessonPutReq.getTimeTaken();
        this.description = lessonPutReq.getDescription();
        this.materials = String.join(",", lessonPutReq.getMaterials());
        this.videoUrl = lessonPutReq.getVideoUrl();
        this.thumbnailUrl = lessonPutReq.getThumbnailUrl();
        this.lessonStepList = lessonPutReq.getLessonStepList();
    }
}