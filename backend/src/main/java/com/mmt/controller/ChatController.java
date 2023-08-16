package com.mmt.controller;

import com.mmt.domain.entity.auth.Role;
import com.mmt.domain.entity.auth.UserDetailsImpl;
import com.mmt.domain.request.chat.ChatSaveReq;
import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.chat.ChatRes;
import com.mmt.domain.response.chat.ChatRoomRes;
import com.mmt.repository.MemberRepository;
import com.mmt.service.ChatService;
import com.mmt.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "채팅 API", description = "채팅 관련 API입니다.")
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final MemberService memberService;

    @Operation(summary = "채팅방 목록 불러오기", description = "사용자가 참여 중인 채팅방 목록을 불러옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "200", description = "참여 중인 채팅방이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @GetMapping()
    public ResponseEntity<List<ChatRoomRes>> getChatRoomList(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        List<ChatRoomRes> chatRoomList = chatService.getChatRoomList(userId);


        return new ResponseEntity<>(chatRoomList, chatRoomList.get(0).getStatusCode());
    }

    @Operation(summary = "채팅 내용 불러오기", description = "채팅방의 내용을 불러옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없는 채팅방입니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
    })
    @GetMapping("/{lessonId}")
    public ResponseEntity<List<ChatRes>> getChatMessageList(@PathVariable int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        List<ChatRes> chatList = chatService.getChatMessageList(userId, lessonId);

        return new ResponseEntity<>(chatList, chatList.get(0).getStatusCode());
    }

    @Operation(summary = "채팅방 닫기", description = "선생님이 채팅방을 닫습니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "해당 수업을 개설한 Cookyer만 이용 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
    })
    @PutMapping("/close/{lessonId}")
    public ResponseEntity<ResponseDto> closeChatRoom(@PathVariable int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        ResponseDto responseDto = chatService.closeChatRoom(userId, lessonId);
        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());
    }


    @Operation(summary = "채팅방 나가기", description = "사용자가 채팅방을 나갑니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "success",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 후 이용해주세요.(Token expired)",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Cookyer은 채팅방을 닫은 후 나갈 수 있습니다.",
                    content = @Content(schema = @Schema(implementation = ResponseDto.class)))
    })
    @PutMapping("/{lessonId}")
    public ResponseEntity<ResponseDto> leaveChatRoom(@PathVariable int lessonId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        ResponseDto responseDto = chatService.leaveChatRoom(userId, lessonId);
        return new ResponseEntity<>(responseDto, responseDto.getStatusCode());

    }

}
