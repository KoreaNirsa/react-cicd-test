import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoticeList } from '../query/useBoardQueries';

export const useNoticeListHook = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // 공지사항 리스트 조회
  const { data, isLoading, isError, error } = useNoticeList(currentPage);

  // 백엔드 응답 구조에 맞게 데이터 추출
  // 백엔드가 Page 객체를 반환하는 경우: { content: [], totalPages: 3, totalElements: 30, ... }
  // 또는 직접 배열과 메타데이터를 반환하는 경우: { noticeList: [], currentPage: 1, totalPages: 3 }
  const noticeList = useMemo(() => {
    if (!data) return [];
    
    // Spring Data Page 객체인 경우
    if (data.content && Array.isArray(data.content)) {
      return data.content;
    }
    
    // 직접 배열을 반환하는 경우
    if (Array.isArray(data)) {
      return data;
    }
    
    // noticeList 속성이 있는 경우
    if (data.noticeList && Array.isArray(data.noticeList)) {
      return data.noticeList;
    }
    
    return [];
  }, [data]);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    
    // Spring Data Page 객체인 경우
    if (data.totalPages !== undefined) {
      return data.totalPages;
    }
    
    // 직접 totalPages를 반환하는 경우
    if (data.totalPages !== undefined) {
      return data.totalPages;
    }
    
    return 1;
  }, [data]);

  // 상세 페이지로 이동
  const goToDetail = (postId) => {
    navigate(`/notice-detail/${postId}`);
  };

  // 페이지 변경
  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // 첫 페이지로 이동
  const goToFirstPage = () => {
    handlePageChange(1);
  };

  // 마지막 페이지로 이동
  const goToLastPage = () => {
    handlePageChange(totalPages);
  };

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // 페이지 번호 배열 생성 (5개씩 그룹으로 표시: 1~5, 6~10, 11~15...)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const pageGroup = Math.ceil(currentPage / 5); // 현재 페이지가 속한 그룹 (1~5는 1그룹, 6~10은 2그룹)
    const startPage = (pageGroup - 1) * 5 + 1; // 그룹의 시작 페이지
    const endPage = Math.min(pageGroup * 5, totalPages); // 그룹의 끝 페이지
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  return {
    noticeList,
    currentPage,
    totalPages,
    isLoading,
    isError,
    error,
    goToDetail,
    handlePageChange,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
    pageNumbers,
  };
};

