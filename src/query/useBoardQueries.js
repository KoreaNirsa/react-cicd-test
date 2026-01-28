import { useQuery } from '@tanstack/react-query';
import { getNoticeList, getNoticeDetail, getNoticeEdit } from '../api/boardApi';

// 공지사항 목록 조회 Query
export const useNoticeList = (page = 1) => {
  return useQuery({
    queryKey: ['noticeList', page],
    queryFn: () => getNoticeList(page),
    staleTime: 30000, // 30초간 캐시 유지
    retry: 1,
  });
};

// 공지사항 상세보기 Query
export const useNoticeDetail = (id) => {
  return useQuery({
    queryKey: ['noticeDetail', id],
    queryFn: () => getNoticeDetail(id),
    enabled: !!id, // id가 있을 때만 실행
    staleTime: 60000, // 1분간 캐시 유지
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 최신 데이터 조회
    retry: 1,
  });
};

// 공지사항 수정용 데이터 조회 Query
export const useNoticeEdit = (id) => {
  return useQuery({
    queryKey: ['noticeEdit', id],
    queryFn: () => getNoticeEdit(id),
    enabled: !!id, // id가 있을 때만 실행
    staleTime: 0, // 수정 페이지는 항상 최신 데이터를 가져와야 함
    retry: 1,
  });
};

