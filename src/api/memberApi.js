import axios from 'axios';

const API_BASE_URL = 'https://d160juzh8yu4t9.cloudfront.net';

// Axios 인스턴스 생성
const memberApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 회원가입 요청
export const registerMember = async (registerData) => {
  const response = await memberApi.post('/member/register', {
    userId: registerData.userId,
    userName: registerData.userName,
    email: registerData.email,
    password: registerData.password,
    passwordCheck: registerData.passwordCheck,
  });
  return response.data;
};

// 로그인 요청
export const loginMember = async (loginData) => {
  const response = await memberApi.post('/member/login', {
    userId: loginData.userId,
    password: loginData.password,
  }, {
    withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
  });
  return response.data;
};

// 현재 로그인 상태 확인
export const checkLoginStatus = async () => {
  try {
    const response = await memberApi.get('/member/check', {
      withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
    });
    return response.data;
  } catch (error) {
    // 401 (Unauthorized)는 로그인되지 않은 상태를 의미하므로 정상적인 경우
    if (error.response && error.response.status === 401) {
      return null;
    }
    // 다른 에러는 그대로 throw
    throw error;
  }
};

// 로그아웃 요청
export const logoutMember = async () => {
  const response = await memberApi.get('/member/logout', {
    withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
  });
  return response.data;
};

export default memberApi;

