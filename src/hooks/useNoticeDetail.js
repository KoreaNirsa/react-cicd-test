import { useParams, useNavigate } from 'react-router-dom';
import { useNoticeDetail } from '../query/useBoardQueries';
import { useLoginStatus } from '../query/useMemberQueries';

export const useNoticeDetailHook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = id ? parseInt(id) : null;

  // 공지사항 상세보기 조회
  const { data, isLoading, isError, error } = useNoticeDetail(postId);

  // 로그인 상태 확인 (수정/삭제 버튼 표시용)
  const { data: currentUser, isLoading: isLoginLoading } = useLoginStatus();
  const isLoggedIn = !isLoginLoading && currentUser;

  // 현재 사용자가 작성자인지 확인
  // 백엔드 응답 구조에 따라 writerId 또는 writer 필드 확인
  const isWriter = currentUser && data && (() => {
    // 디버깅을 위한 로그
    console.log('[작성자 확인] currentUser:', currentUser);
    console.log('[작성자 확인] post data:', data);
    
    // writerId로 비교 (가장 정확한 방법)
    if (data.writerId && currentUser.id === data.writerId) {
      console.log('[작성자 확인] writerId로 일치:', data.writerId);
      return true;
    }
    
    // writer 필드로 비교 (이름 또는 ID)
    if (data.writer) {
      // writer가 사용자 이름과 일치하는지 확인
      if (currentUser.userName === data.writer || currentUser.userId === data.writer) {
        console.log('[작성자 확인] writer 이름으로 일치:', data.writer);
        return true;
      }
    }
    
    console.log('[작성자 확인] 작성자가 아님');
    return false;
  })();

  // 목록으로 돌아가기
  const goToList = () => {
    navigate('/notice');
  };

  // 수정 페이지로 이동
  const goToEdit = () => {
    if (postId) {
      navigate(`/notice-edit/${postId}`);
    }
  };

  return {
    post: data,
    postId,
    isLoading,
    isError,
    error,
    isLoggedIn,
    isWriter,
    currentUser,
    goToList,
    goToEdit,
  };
};

