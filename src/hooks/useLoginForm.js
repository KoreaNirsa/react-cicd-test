import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../query/useMemberQueries';

export const useLoginForm = () => {
  const navigate = useNavigate();
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // TanStack Query Mutation
  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      alert(`로그인 되었습니다: ${data.userName || data.userId}`);
      navigate('/');
    },
    onError: (error) => {
      if (error.response) {
        // 서버에서 반환한 에러 메시지 처리
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errorMsg || 
                           '아이디 또는 비밀번호가 올바르지 않습니다.';
        setError(errorMessage);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        // 요청 설정 중 에러 발생
        setError('로그인 요청 중 오류가 발생했습니다.');
      }
    },
  });

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    setError(''); // 입력 시 에러 초기화
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // 입력 시 에러 초기화
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // 에러 초기화
    
    if (!userId.trim()) {
      setError('아이디를 입력하세요.');
      return;
    }
    
    if (!password) {
      setError('비밀번호를 입력하세요.');
      return;
    }

    // 로그인 요청
    loginMutation.mutate({
      userId: userId.trim(),
      password: password,
    });
  };

  return {
    userId,
    password,
    error,
    handleUserIdChange,
    handlePasswordChange,
    handleSubmit,
    isPending: loginMutation.isPending,
  };
};




