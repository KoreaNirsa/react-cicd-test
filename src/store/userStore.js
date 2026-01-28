import { create } from 'zustand';

const useUserStore = create((set) => ({
  // 사용자 정보
  users: [],
  
  // 현재 로그인한 사용자
  currentUser: null,
  
  // 회원가입
  register: (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      users: [...state.users, newUser],
      currentUser: newUser,
    }));
    
    return newUser;
  },
  
  // 로그인 (백엔드 API 응답 데이터로 설정)
  setCurrentUser: (userData) => {
    set({ currentUser: userData });
  },
  
  // 로그인 (로컬 스토어에서 찾기 - 레거시)
  login: (userId, password) => {
    const user = useUserStore.getState().users.find(
      (u) => u.userId === userId && u.password === password
    );
    
    if (user) {
      set({ currentUser: user });
      return user;
    }
    return null;
  },
  
  // 로그아웃
  logout: () => {
    set({ currentUser: null });
  },
  
  // 사용자 정보 업데이트
  updateUser: (userId, updatedData) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.userId === userId ? { ...user, ...updatedData } : user
      ),
      currentUser:
        state.currentUser?.userId === userId
          ? { ...state.currentUser, ...updatedData }
          : state.currentUser,
    }));
  },
  
  // 사용자 삭제
  deleteUser: (userId) => {
    set((state) => ({
      users: state.users.filter((user) => user.userId !== userId),
      currentUser:
        state.currentUser?.userId === userId ? null : state.currentUser,
    }));
  },
  
  // 아이디 중복 확인
  checkUserIdExists: (userId) => {
    return useUserStore.getState().users.some((user) => user.userId === userId);
  },
  
  // 이메일 중복 확인
  checkEmailExists: (email) => {
    return useUserStore.getState().users.some((user) => user.email === email);
  },
}));

export default useUserStore;

