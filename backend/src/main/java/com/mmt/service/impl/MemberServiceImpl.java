package com.mmt.service.impl;

import com.mmt.common.auth.JwtUtil;
import com.mmt.domain.TokenDto;
import com.mmt.domain.entity.Member;
import com.mmt.domain.entity.RefreshToken;
import com.mmt.domain.request.UserLoginPostReq;
import com.mmt.domain.request.UserSignUpReq;
import com.mmt.domain.request.UserUpdateReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.UserInfoRes;
import com.mmt.repository.MemberRepository;
import com.mmt.repository.RefreshTokenRepository;
import com.mmt.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;

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
    public ResponseDto login(UserLoginPostReq userLoginPostReq, HttpServletResponse response) {
        // 아이디 검사
        Optional<Member> member = memberRepository.findByUserId(userLoginPostReq.getUserId());
        if(member.isEmpty()) return new ResponseDto(HttpStatus.NOT_FOUND, "존재하지 않는 계정입니다.");

        // 비밀번호 검사
        if(!passwordEncoder.matches(userLoginPostReq.getUserPw(), member.get().getUserPw())) {
            return new ResponseDto(HttpStatus.UNAUTHORIZED, "비밀번호를 확인해주세요.");
        }

        // 아이디 정보로 Token생성
        TokenDto tokenDto = jwtUtil.createAllToken(userLoginPostReq.getUserId());

        // Refresh토큰 있는지 확인
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userLoginPostReq.getUserId());

        // 있다면 새토큰 발급후 업데이트
        // 없다면 새로 만들고 디비 저장
        if(refreshToken.isPresent()) {
            refreshTokenRepository.save(refreshToken.get().updateToken(tokenDto.getRefreshToken()));
        }else {
            RefreshToken newToken = new RefreshToken(tokenDto.getRefreshToken(), userLoginPostReq.getUserId());
            refreshTokenRepository.save(newToken);
        }

        // response 헤더에 Access Token / Refresh Token 넣음
        setHeader(response, tokenDto);

        return new ResponseDto(HttpStatus.OK, "Success");
    }

    @Transactional
    @Override
    public ResponseDto logout(HttpServletRequest request, HttpServletResponse response) {
        jwtUtil.logout(request);

        TokenDto tokenDto = new TokenDto();
        tokenDto.setAccessToken(null);
        tokenDto.setRefreshToken(null);
        setHeader(response, tokenDto);

        return new ResponseDto(HttpStatus.OK, "Success Logout");
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
    public Member getUserInfo(String userId) {
        Member member = memberRepository.findByUserId(userId).orElseThrow(
                () -> new RuntimeException("Not found Account"));
        return member;
    }

    @Override
    public Optional<Member> updateUserInfo(String userId, UserUpdateReq userUpdateReq) {
        Optional<Member> member = memberRepository.findByUserId(userId);
        member.ifPresent(t -> {
            if(userUpdateReq.getNickname() != null) {
                t.setNickname(userUpdateReq.getNickname());
            }
            this.memberRepository.save(t);
        });

        return member;
    }

    @Override
    public ResponseDto deleteUser(String userId) {
        return null;
    }

    private void setHeader(HttpServletResponse response, TokenDto tokenDto) {
        response.addHeader(JwtUtil.ACCESS_TOKEN, tokenDto.getAccessToken());
        response.addHeader(JwtUtil.REFRESH_TOKEN, tokenDto.getRefreshToken());
    }
}
