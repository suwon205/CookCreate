package com.mmt.service.impl;

import com.mmt.common.auth.JwtUtil;
import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.TokenDto;
import com.mmt.domain.entity.auth.Member;
import com.mmt.domain.request.auth.UserLoginPostReq;
import com.mmt.domain.request.auth.UserSignUpReq;
import com.mmt.domain.request.auth.UserUpdateReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.auth.UserInfoRes;
import com.mmt.domain.response.auth.UserLoginRes;
import com.mmt.repository.MemberRepository;
import com.mmt.service.AwsS3Uploader;
import com.mmt.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.IOException;
import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    private final MemberRepository memberRepository;

    private final AwsS3Uploader awsS3Uploader;

    private final RedisTemplate<String, String> redisTemplate;

    @Transactional
    @Override
    public ResponseDto signUp(UserSignUpReq userSignUpReq){

        // 비밀번호 확인
        if(!userSignUpReq.getUserPw().equals(userSignUpReq.getUserPwCk())) {
            return new ResponseDto(HttpStatus.BAD_REQUEST, "비밀번호 확인을 다시 입력해주세요.");
        }

        // 아이디 중복 확인
        if(checkUserId(userSignUpReq.getUserId()).getStatusCode().equals(HttpStatus.CONFLICT)){
            return new ResponseDto(HttpStatus.CONFLICT, "중복된 아이디입니다.");
        }

        // 닉네임 중복 확인
        if(checkNickname(userSignUpReq.getNickname()).getStatusCode().equals(HttpStatus.CONFLICT)){
            return new ResponseDto(HttpStatus.CONFLICT, "중복된 닉네임입니다.");
        }

        // 패스워드 암호화
        userSignUpReq.setEncodePw(passwordEncoder.encode(userSignUpReq.getUserPw()));
        Member member = new Member(userSignUpReq);

        // 회원가입 성공
        memberRepository.save(member);
        return new ResponseDto(HttpStatus.CREATED, "Success");
    }

    @Transactional
    @Override
    public UserLoginRes login(UserLoginPostReq userLoginPostReq, HttpServletResponse response) {
        UserLoginRes userLoginRes = new UserLoginRes();

        // 아이디 검사
        Optional<Member> member = memberRepository.findByUserId(userLoginPostReq.getUserId());
        if(member.isEmpty()) {
            userLoginRes.setStatusCode(HttpStatus.NOT_FOUND);
            userLoginRes.setMessage("존재하지 않는 계정입니다.");
            return userLoginRes;
        }

        // 비밀번호 검사
        if(!passwordEncoder.matches(userLoginPostReq.getUserPw(), member.get().getUserPw())) {
            userLoginRes.setStatusCode(HttpStatus.UNAUTHORIZED);
            userLoginRes.setMessage("비밀번호를 확인해주세요.");
            return userLoginRes;
        }

        // 아이디 정보로 Token생성
        TokenDto tokenDto = jwtUtil.createAllToken(userLoginPostReq.getUserId());

        // Refresh토큰 있는지 확인
//        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userLoginPostReq.getUserId());

        // redis에 저장
        redisTemplate.opsForValue().set(
                member.get().getUserId(),
                tokenDto.getRefreshToken(),
                Duration.ofDays(14).toMillis(),
                TimeUnit.MILLISECONDS
        );

        // 있다면 새토큰 발급후 업데이트
        // 없다면 새로 만들고 디비 저장
//        if(refreshToken.isPresent()) {
//            refreshTokenRepository.save(refreshToken.get().updateToken(tokenDto.getRefreshToken()));
//        }else {
//            RefreshToken newToken = new RefreshToken(tokenDto.getRefreshToken(), userLoginPostReq.getUserId());
//            refreshTokenRepository.save(newToken);
//        }

        // response 헤더에 Access Token / Refresh Token 넣음
        setHeader(response, tokenDto);

        userLoginRes.setRole(member.get().getRole());
        userLoginRes.setNickname(member.get().getNickname());

        // ok 세팅
        userLoginRes.setStatusCode(HttpStatus.OK);
        userLoginRes.setMessage("Success");

        return userLoginRes;
    }

    @Override
    public UserLoginRes regenerateToken(TokenDto tokenDto, HttpServletResponse response) { // refresh token 재발급
        String refreshToken = tokenDto.getRefreshToken();
        UserLoginRes userLoginRes = new UserLoginRes();

        // 검증
        if(!jwtUtil.tokenValidation(refreshToken)){
            userLoginRes.setStatusCode(HttpStatus.BAD_REQUEST);
            userLoginRes.setMessage("유효하지 않은 토큰입니다.");
            return userLoginRes;
        }

        // redis에 저장된 값과 동일한지 검증
        String userId = jwtUtil.getUserIdFromToken(refreshToken);
        String savedRefreshToken = redisTemplate.opsForValue().get(userId);

        // TODO: 로그아웃되어 redis에 refresh token이 존재하지 않는 경우 처리
        if(ObjectUtils.isEmpty(savedRefreshToken)){
            userLoginRes.setStatusCode(HttpStatus.BAD_REQUEST);
            userLoginRes.setMessage("이미 로그아웃을 진행하였습니다.");
            return userLoginRes;
        }

        if(!refreshToken.equals(savedRefreshToken)){
            userLoginRes.setStatusCode(HttpStatus.NOT_FOUND);
            userLoginRes.setMessage("refresh token이 저장된 값과 같지 않습니다.");
            return userLoginRes;
        }

        // 토큰 재발행
        TokenDto result = jwtUtil.createAllToken(userId);

        // redis에 다시 저장
        redisTemplate.opsForValue().set(
                userId,
                result.getRefreshToken(),
                Duration.ofDays(14).toMillis(),
                TimeUnit.MILLISECONDS
        );

        // response 헤더에 Access Token / Refresh Token 넣음
        setHeader(response, tokenDto);

        // userId로 member 찾아서 role, nickname 세팅
        Optional<Member> member = memberRepository.findByUserId(userId);
        userLoginRes.setRole(member.get().getRole());
        userLoginRes.setNickname(member.get().getNickname());

        // ok 세팅
        userLoginRes.setStatusCode(HttpStatus.OK);
        userLoginRes.setMessage("Success");

        return userLoginRes;
    }

    @Transactional
    @Override
    public ResponseDto logout(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = jwtUtil.getHeaderToken(request, "Access_Token");

        // access token 검증
        if(!jwtUtil.tokenValidation(accessToken)){
            return new ResponseDto(HttpStatus.BAD_REQUEST, "잘못된 요청입니다.");
        }

        String userId = jwtUtil.getUserIdFromToken(accessToken);

        // redis에 refresh token이 저장되어 있다면 삭제
        if(redisTemplate.opsForValue().get(userId) != null){
            redisTemplate.delete(userId);
        }

        // access token의 유효시간을 가지고 와서 black list로 저장
        Long expiration = jwtUtil.getExpiration(accessToken);
        redisTemplate.opsForValue()
                .set(accessToken, "logout", expiration, TimeUnit.MILLISECONDS);

//        // redis 도입 전 로그아웃
//        jwtUtil.logout(request);
//
//        TokenDto tokenDto = new TokenDto();
//        tokenDto.setAccessToken(null);
//        tokenDto.setRefreshToken(null);
//        setHeader(response, tokenDto);

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Override
    public ResponseDto checkUserId(String userId){
        if(userId.length() < 4 || userId.length() > 10) return new ResponseDto(HttpStatus.BAD_REQUEST, "아이디는 4자 이상 10자 이하여야 합니다.");

        Optional<Member> result = memberRepository.findByUserId(userId);

        if(result.isPresent()){ // user id로 찾아서 값이 존재한다면 해당 아이디는 사용 불가
            return new ResponseDto(HttpStatus.CONFLICT, "이미 존재하는 사용자 ID입니다.");
        }

        return new ResponseDto(HttpStatus.OK, "사용 가능한 ID입니다.");
    }

    @Override
    public ResponseDto checkNickname(String nickname){
        if(nickname.length() < 2 || nickname.length() > 8) return new ResponseDto(HttpStatus.BAD_REQUEST, "아이디는 2자 이상 8자 이하여야 합니다.");

        Optional<Member> result = memberRepository.findByNickname(nickname);

        if(result.isPresent()){ // 닉네임으로 찾아서 값이 존재한다면 해당 아이디는 사용 불가
            return new ResponseDto(HttpStatus.CONFLICT, "이미 존재하는 사용자 닉네임입니다.");
        }

        return new ResponseDto(HttpStatus.OK, "사용 가능한 닉네임입니다.");
    }

    @Override
    public UserInfoRes getUserInfo(String userId) {
        Member member = memberRepository.findByUserId(userId).get();
        return new UserInfoRes(member);
    }

    @Transactional
    @Override
    public ResponseDto updateUserInfo(UserUpdateReq userUpdateReq) {
        Optional<Member> member = memberRepository.findByUserId(userUpdateReq.getUserId());

        if(member.isEmpty()) {
            return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 계정입니다.");
        }

        // 비밀번호 확인
//        if(!userUpdateReq.getUserPw().equals(userUpdateReq.getUserPwCk())) {
//            return new ResponseDto(HttpStatus.BAD_REQUEST, "비밀번호 확인을 다시 입력해주세요.");
//        }

//        userUpdateReq.setEncodePw(passwordEncoder.encode(userUpdateReq.getUserPw()));

        member.get().update(userUpdateReq);

        // s3에 썸네일 이미지 업로드 후 url을 db에 저장
        if(userUpdateReq.getProfileImg() != null){
            try {
                String profileUrl = awsS3Uploader.uploadFile(userUpdateReq.getProfileImg(), "profile");
                member.get().setProfileImg(profileUrl);
                log.info(profileUrl);
            } catch (IOException e) {
                return new ResponseDto(HttpStatus.CONFLICT, e.getMessage());
            }
        }

        memberRepository.save(member.get());

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Override
    public ResponseDto deleteUser(String userId) {
        return null;
    }

    @Override
    public Role getRole(String userId){
        Optional<Member> member = memberRepository.findByUserId(userId);
        return member.get().getRole();
    }

    private void setHeader(HttpServletResponse response, TokenDto tokenDto) {
        response.addHeader(JwtUtil.ACCESS_TOKEN, tokenDto.getAccessToken());
        response.addHeader(JwtUtil.REFRESH_TOKEN, tokenDto.getRefreshToken());
    }
}
