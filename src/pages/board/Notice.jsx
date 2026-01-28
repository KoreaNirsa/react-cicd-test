import { Link } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import { useNoticeListHook } from '../../hooks/useNoticeList';
import { useLoginStatus } from '../../query/useMemberQueries';

function Notice() {
  const {
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
  } = useNoticeListHook();

  // 로그인 상태 확인
  const { data: currentUser, isLoading: isLoginLoading } = useLoginStatus();
  const isLoggedIn = !isLoginLoading && currentUser;

  // 로딩 중
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <h1>공지사항</h1>
            {isLoggedIn && (
              <Link to="/notice-write" className="btn btn-primary" style={{textDecoration: 'none'}}>글쓰기</Link>
            )}
          </div>
          <div style={{textAlign: 'center', padding: '2rem'}}>로딩 중...</div>
        </div>
      </>
    );
  }

  // 에러 발생
  if (isError) {
    console.error('[Notice] 에러 발생:', error);
    return (
      <>
        <Header />
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <h1>공지사항</h1>
            {isLoggedIn && (
              <Link to="/notice-write" className="btn btn-primary" style={{textDecoration: 'none'}}>글쓰기</Link>
            )}
          </div>
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--error)'}}>
            공지사항을 불러오는 중 오류가 발생했습니다.
            <br />
            {error?.message || error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}
            <br />
            <small style={{color: 'var(--text-secondary)', marginTop: '1rem', display: 'block'}}>
              {error?.response?.status && `상태 코드: ${error.response.status}`}
              {error?.request && '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'}
            </small>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1>공지사항</h1>
          {isLoggedIn && (
            <Link to="/notice-write" className="btn btn-primary" style={{textDecoration: 'none'}}>글쓰기</Link>
          )}
        </div>
        
        {noticeList.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          <>
            <div className="post-list">
              {noticeList.map((post) => (
                <div 
                  key={post.id} 
                  className="post-item" 
                  onClick={() => goToDetail(post.id)}
                  style={{cursor: 'pointer'}}
                >
                  <div className="post-header">
                    <div>
                      <div className="post-title">{post.title || '제목 없음'}</div>
                    </div>
                    {post.category && (
                      <span className="badge">{post.category}</span>
                    )}
                  </div>
                  <div className="post-footer">
                    <span>{post.writer || '작성자'}</span>
                    <span>
                      {post.createdAt 
                        ? new Date(post.createdAt).toLocaleDateString('ko-KR')
                        : '날짜 없음'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn" 
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  {"<<"}
                </button>
                <button 
                  className="page-btn" 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </button>
                {pageNumbers.map((pageNum) => (
                  <button 
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`} 
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button 
                  className="page-btn" 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </button>
                <button 
                  className="page-btn" 
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  {">>"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Notice;

