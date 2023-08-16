package com.mmt.domain.request.lesson;

import com.mmt.domain.entity.lesson.Difficulty;
import com.mmt.domain.entity.lesson.LessonCategory;
import com.mmt.domain.entity.lesson.LessonStep;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LessonPostReq {
    private int lessonId;
    private String lessonTitle;
    private String cookyerId;
//    @Max(value = 7, message = "유효한 카테고리를 선택해주세요.") -> form-data 사용 시 int가 string으로 넘어와서 유효성 검사 못함
    private String categoryId;
    private Difficulty difficulty;
//    @Min(value = 60, message = "소요시간은 최소 60분부터입니다.")
//    @Max(value = 240, message = "소요시간은 최대 240분까지입니다.")
    private String timeTaken;
    private String description;
//    @Max(value = 6, message = "최대인원은 6명 이하여야 합니다.")
    private String maximum;
    private String price;
    private List<String> materials;
    private String lessonDate;
    private String videoUrl;
    private MultipartFile thumbnailUrl; // s3 처리를 위해 form-data로 받음
    private List<LessonStep> lessonStepList;
}
