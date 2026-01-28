import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registerMember, loginMember, checkLoginStatus, logoutMember } from '../api/memberApi';
import useUserStore from '../store/userStore';

// 로그인 상태 확인 Query
export const useLoginStatus = () => {
  return useQuery({
    queryKey: ['loginStatus'],
    queryFn: checkLoginStatus,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 0, // 항상 최신 상태 확인
    // 에러가 발생해도 null을 반환하도록 처리 (이미 API에서 처리함)
  });
};

// 회원가입 Mutation
export const useRegisterMutation = (options = {}) => {
  return useMutation({
    mutationFn: registerMember,
    onSuccess: (data, variables) => {
      // 기본 성공 처리
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      } else {
        // 기본 동작: alert만 표시
        alert(`회원가입이 완료되었습니다!\n이름: ${variables.userName}\n아이디: ${variables.userId}\n이메일: ${variables.email}`);
      }
    },
    onError: (error) => {
      // 기본 에러 처리
      if (options.onError) {
        options.onError(error);
      } else {
        if (error.response) {
          const errorMessage = error.response.data?.message || error.response.data?.error || '회원가입에 실패했습니다.';
          alert(errorMessage);
        } else if (error.request) {
          alert('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        } else {
          alert('회원가입 요청 중 오류가 발생했습니다.');
        }
      }
    },
  });
};

// 로그인 Mutation
export const useLoginMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { setCurrentUser } = useUserStore();
  
  return useMutation({
    mutationFn: loginMember,
    onSuccess: (data) => {
      // 백엔드에서 반환한 사용자 정보를 store에 저장
      setCurrentUser(data);
      // 로그인 상태 확인 쿼리 캐시 무효화하여 Header가 최신 상태 확인
      queryClient.invalidateQueries({ queryKey: ['loginStatus'] });
      
      // 사용자 정의 onSuccess가 있으면 실행, 없으면 기본 동작
      if (options.onSuccess) {
        options.onSuccess(data);
      } else {
        alert(`로그인 되었습니다: ${data.userName || data.userId}`);
      }
    },
    onError: (error) => {
      // 사용자 정의 onError가 있으면 실행, 없으면 기본 동작은 컴포넌트에서 처리
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

// 로그아웃 Mutation
export const useLogoutMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { logout } = useUserStore();
  
  return useMutation({
    mutationFn: logoutMember,
    onSuccess: (data) => {
      // 로컬 store에서 사용자 정보 제거
      logout();
      // 로그인 상태 확인 쿼리 캐시 무효화하여 Header가 최신 상태 확인
      queryClient.invalidateQueries({ queryKey: ['loginStatus'] });
      
      // 사용자 정의 onSuccess가 있으면 실행
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      // 로그아웃 실패해도 로컬 상태는 초기화
      logout();
      queryClient.invalidateQueries({ queryKey: ['loginStatus'] });
      
      // 사용자 정의 onError가 있으면 실행
      if (options.onError) {
        options.onError(error);
      } else {
        // 기본 에러 처리: 로그아웃은 실패해도 로컬 상태는 초기화했으므로 조용히 처리
        console.error('로그아웃 중 오류 발생:', error);
      }
    },
  });
};

