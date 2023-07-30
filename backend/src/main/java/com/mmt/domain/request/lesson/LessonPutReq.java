package com.mmt.domain.request.lesson;

import com.mmt.domain.entity.lesson.Difficulty;
import com.mmt.domain.entity.lesson.LessonStep;
import lombok.Data;

import javax.validation.constraints.*;
import java.util.List;

@Data
public class LessonPutReq {
    @NotNull(message = "아이디는 필수입력값입니다.")
    private int lessonId;
    @NotBlank(message = "제목은 필수입력값입니다.")
    private String lessonTitle;
    private String cookyerId;
    @NotNull(message = "카테고리는 필수입력값입니다.")
    @Min(value = 1, message = "유효한 카테고리를 선택해주세요.")
    @Max(value = 7, message = "유효한 카테고리를 선택해주세요.")
    private int categoryId;
    private Difficulty difficulty;
    @Min(value = 60, message = "소요시간은 최소 60분부터입니다.")
    @Max(value = 240, message = "소요시간은 최대 240분까지입니다.")
    private int timeTaken;
    private String description;
    @NotEmpty(message = "준비물은 필수입력값입니다.")
    private List<String> materials;
    private String videoUrl;
    private String thumbnailUrl;
    private String sessionId;
    @NotEmpty(message = "요리 단계는 필수입력값입니다.")
    private List<LessonStep> lessonStepList;
}
