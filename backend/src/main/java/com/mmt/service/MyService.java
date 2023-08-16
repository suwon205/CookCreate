package com.mmt.service;


import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.my.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MyService {

    List<MyLessonRes> getMyLesson(String userId, boolean isCompleted);
    List<MyRecipeRes> getMyRecipe(String userId);
    List<MyReviewRes> getMyReview(String userId);
    ResponseDto registerLicense(String userId, MultipartFile multipartFile);
    List<MyBadgeRes> getLicenseList(String userId);
    ResponseDto deleteProfileImg(String userId);
    List<MyPaymentRes> getCookieePayment(String UserId);
    List<MyPaymentRes> getCookyerPayment(String userId);
}
