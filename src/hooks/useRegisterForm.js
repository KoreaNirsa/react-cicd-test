import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { useRegisterMutation } from '../query/useMemberQueries';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { checkUserIdExists, checkEmailExists } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [errors, setErrors] = useState({});

  // TanStack Query Mutation
  const registerMutation = useRegisterMutation({
    onSuccess: (data, variables) => {
      alert(`회원가입이 완료되었습니다!\n이름: ${variables.userName}\n아이디: ${variables.userId}\n이메일: ${variables.email}`);
      navigate('/login');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 에러 초기화
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력하세요.';
    }

    if (!formData.userId.trim()) {
      newErrors.userId = '아이디를 입력하세요.';
    } else if (checkUserIdExists(formData.userId)) {
      newErrors.userId = '이미 사용 중인 아이디입니다.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력하세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    } else if (checkEmailExists(formData.email)) {
      newErrors.email = '이미 사용 중인 이메일입니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력하세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력하세요.';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 백엔드 DTO에 맞게 작성
    const registerData = {
      userId: formData.userId.trim(),
      userName: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      passwordCheck: formData.passwordConfirm,
    };

    // TanStack Query Mutation 실행
    registerMutation.mutate(registerData);
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isPending: registerMutation.isPending,
  };
};




