// 백엔드 컨트롤러 변경안 - ResponseEntity 사용
// 기존 코드를 ResponseEntity로 변경하여 프론트엔드와 통신하도록 수정

@DeleteMapping("/{id}")
public ResponseEntity<?> noticeDelete(@PathVariable("id") Long id,
                                     HttpSession session) {
    
    // 1. 로그인 사용자 정보 조회 (세션에 저장된 값 기준)
    LoginDTO.Response loginUser = (LoginDTO.Response) session.getAttribute("LOGIN_USER");
    
    // 2. 비로그인 상태면 삭제 불가
    if (loginUser == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "로그인이 필요합니다."));
    }
    
    try {
        // 3. 검증 통과 → 삭제 진행
        boardService.deleteBoard(id, loginUser.getId());
        
        // 4. 성공 응답 반환
        return ResponseEntity.ok(Map.of("success", true, "message", "게시글이 삭제되었습니다."));
    } catch (Exception e) {
        // 5. 삭제 실패 시 에러 응답
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "게시글 삭제 중 오류가 발생했습니다."));
    }
}

// 필요한 import 문:
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import java.util.Map;

