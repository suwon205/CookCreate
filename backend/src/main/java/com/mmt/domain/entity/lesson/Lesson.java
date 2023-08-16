package com.mmt.domain.entity.lesson;

import com.mmt.domain.entity.BaseTimeEntity;
import com.mmt.domain.entity.chat.Chat;
import com.mmt.domain.entity.lesson.Difficulty;
import com.mmt.domain.request.lesson.LessonPostReq;
import com.mmt.domain.request.lesson.LessonPutReq;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.DynamicInsert;
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
@DynamicInsert
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
    @Column(columnDefinition = "boolean default false")
    private Boolean isOver;
    @Column(columnDefinition = "boolean default false")
    private Boolean isChatRoomOver;
    @Column(columnDefinition = "boolean default false")
    private Boolean isEnd;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<Chat> chatList = new ArrayList<>();

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<LessonStep> lessonStepList = new ArrayList<>();

    public Lesson(LessonPostReq lessonPostReq){
        this.lessonTitle = lessonPostReq.getLessonTitle();
        this.cookyerId = lessonPostReq.getCookyerId();
        this.difficulty = lessonPostReq.getDifficulty();
        this.timeTaken = Integer.parseInt(lessonPostReq.getTimeTaken());
        this.description = lessonPostReq.getDescription();
        this.maximum = Integer.parseInt(lessonPostReq.getMaximum());
        this.price = Integer.parseInt(lessonPostReq.getPrice());
        this.materials = String.join(",", lessonPostReq.getMaterials());
        this.lessonDate = lessonPostReq.getLessonDate();
        this.videoUrl = lessonPostReq.getVideoUrl();
        this.lessonStepList = lessonPostReq.getLessonStepList();
    }

    public void update(LessonPutReq lessonPutReq){
        this.lessonId = Integer.parseInt(lessonPutReq.getLessonId());
        this.lessonTitle = lessonPutReq.getLessonTitle();
        this.cookyerId = lessonPutReq.getCookyerId();
        this.difficulty = lessonPutReq.getDifficulty();
        this.timeTaken = Integer.parseInt(lessonPutReq.getTimeTaken());
        this.description = lessonPutReq.getDescription();
        this.materials = String.join(",", lessonPutReq.getMaterials());
        this.videoUrl = lessonPutReq.getVideoUrl();
        this.lessonStepList = lessonPutReq.getLessonStepList();
    }
}