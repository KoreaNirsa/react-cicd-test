import axios from 'axios';

const API_BASE_URL = 'https://d160juzh8yu4t9.cloudfront.net';

// Axios 인스턴스 생성
const boardApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 공지사항 목록 조회 (페이징 포함)
export const getNoticeList = async (page = 1) => {
  try {
    console.log(`[API] 공지사항 목록 조회 요청: page=${page}`);
    const response = await boardApi.get('/board/notice', {
      params: {
        page: page,
      },
      withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
    });
    console.log('[API] 공지사항 목록 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] 공지사항 목록 조회 실패:', error);
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      console.error('응답 데이터:', error.response.data);
      console.error('상태 코드:', error.response.status);
      throw error;
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    } else {
      // 요청 설정 중 에러 발생
      console.error('요청 설정 오류:', error.message);
      throw error;
    }
  }
};

// 공지사항 상세보기 조회
export const getNoticeDetail = async (id) => {
  try {
    console.log(`[API] 공지사항 상세보기 조회 요청: id=${id}`);
    const response = await boardApi.get(`/board/notice/${id}`, {
      withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
    });
    console.log('[API] 공지사항 상세보기 조회 성공:', response.data);
    // 백엔드가 boardDTO로 감싸서 반환할 수도 있으므로 확인
    return response.data.boardDTO || response.data;
  } catch (error) {
    console.error('[API] 공지사항 상세보기 조회 실패:', error);
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      console.error('응답 데이터:', error.response.data);
      console.error('상태 코드:', error.response.status);
      throw error;
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    } else {
      // 요청 설정 중 에러 발생
      console.error('요청 설정 오류:', error.message);
      throw error;
    }
  }
};

// 공지사항 수정용 데이터 조회
export const getNoticeEdit = async (id) => {
  try {
    console.log(`[API] 공지사항 수정용 데이터 조회 요청: id=${id}`);
    const response = await boardApi.get(`/board/notice/${id}/edit`, {
      withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
    });
    console.log('[API] 공지사항 수정용 데이터 조회 성공:', response.data);
    // 백엔드가 boardDTO로 감싸서 반환
    return response.data.boardDTO || response.data;
  } catch (error) {
    console.error('[API] 공지사항 수정용 데이터 조회 실패:', error);
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      console.error('응답 데이터:', error.response.data);
      console.error('상태 코드:', error.response.status);
      throw error;
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    } else {
      // 요청 설정 중 에러 발생
      console.error('요청 설정 오류:', error.message);
      throw error;
    }
  }
};

// 공지사항 생성 요청
export const createNotice = async (formData) => {
  try {
    console.log('[API] 공지사항 생성 요청:', formData);
    const response = await boardApi.post('/board/notice/create', formData, {
      withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위해 필요
      },
    });
    console.log('[API] 공지사항 생성 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] 공지사항 생성 실패:', error);
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      console.error('응답 데이터:', error.response.data);
      console.error('상태 코드:', error.response.status);
      throw error;
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    } else {
      // 요청 설정 중 에러 발생
      console.error('요청 설정 오류:', error.message);
      throw error;
    }
  }
};

// 공지사항 수정 요청
export const updateNotice = async (id, formData) => {
  try {
    console.log(`[API] 공지사항 수정 요청: id=${id}`, formData);
    const response = await boardApi.patch(`/board/notice/${id}/edit`, formData, {
      withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위해 필요
      },
    });
    console.log('[API] 공지사항 수정 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] 공지사항 수정 실패:', error);
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      console.error('응답 데이터:', error.response.data);
      console.error('상태 코드:', error.response.status);
      throw error;
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    } else {
      // 요청 설정 중 에러 발생
      console.error('요청 설정 오류:', error.message);
      throw error;
    }
  }
};

// 공지사항 삭제 요청
export const deleteNotice = async (id) => {
  try {
    console.log(`[API] 공지사항 삭제 요청: id=${id}`);
    const response = await boardApi.delete(`/board/notice/${id}`, {
      withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
    });
    console.log('[API] 공지사항 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] 공지사항 삭제 실패:', error);
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      console.error('응답 데이터:', error.response.data);
      console.error('상태 코드:', error.response.status);
      throw error;
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    } else {
      // 요청 설정 중 에러 발생
      console.error('요청 설정 오류:', error.message);
      throw error;
    }
  }
};

export default boardApi;

