package com.mmt.domain.request.lesson;

import com.mmt.domain.entity.lesson.Difficulty;
import com.mmt.domain.entity.lesson.LessonCategory;
import com.mmt.domain.entity.lesson.LessonStep;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LessonPostReq {
    private int lessonId;
    private String lessonTitle;
    private String cookyerId;
    @Min(value = 1, message = "유효한 카테고리를 선택해주세요.")
    @Max(value = 7, message = "유효한 카테고리를 선택해주세요.")
    private int categoryId;
    private Difficulty difficulty;
    @Min(value = 60, message = "소요시간은 최소 60분부터입니다.")
    @Max(value = 240, message = "소요시간은 최대 240분까지입니다.")
    private int timeTaken;
    private String description;
    @Min(value = 4, message = "최대인원은 4명 이상이여야 합니다.")
    @Max(value = 6, message = "최대인원은 6명 이하여야 합니다.")
    private int maximum;
    private int price;
    private List<String> materials;
    private String lessonDate;
    private String videoUrl;
    private String thumbnailUrl;
    private String sessionId;
    private List<LessonStep> lessonStepList;
}
