import { useNavigate } from 'react-router-dom';
import { useLoginStatus, useLogoutMutation } from '../query/useMemberQueries';

export const useHeader = () => {
  const navigate = useNavigate();

  // API를 통해 현재 로그인 상태 확인
  const { data: currentUser, isLoading, isError } = useLoginStatus();

  // 로그아웃 Mutation
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate('/');
    },
    onError: () => {
      // 에러가 발생해도 로컬 상태는 이미 초기화되었으므로 홈으로 이동
      navigate('/');
    },
  });

  const handleLogout = () => {
    // 백엔드 API를 통해 로그아웃 처리
    logoutMutation.mutate();
  };

  // 로딩 중이거나 에러가 발생한 경우, 또는 currentUser가 null인 경우 로그인 안 된 상태로 처리
  const isLoggedIn = !isLoading && !isError && currentUser;

  return {
    currentUser,
    isLoading,
    isLoggedIn,
    handleLogout,
    isLoggingOut: logoutMutation.isPending,
  };
};

