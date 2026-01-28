import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import { postsData } from '../../store/postsStore';

function Free() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const goFreeDetail = (postId) => {
    navigate(`/free-detail/${postId}`);
  };

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
    alert(`${pageNum} 페이지로 이동했습니다.`);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    alert("첫 페이지로 이동했습니다.");
  };

  const goToLastPage = () => {
    setCurrentPage(3);
    alert("마지막 페이지로 이동했습니다.");
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      alert("이전 페이지로 이동했습니다.");
    }
  };

  const goToNextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
      alert("다음 페이지로 이동했습니다.");
    }
  };

  const freePosts = Object.values(postsData.free);

  return (
    <>
      <Header />
      <div className="container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1>자유게시판</h1>
          <Link to="/free-write" className="btn btn-primary" style={{textDecoration: 'none'}}>글쓰기</Link>
        </div>
        <div className="post-list">
          {Object.entries(postsData.free).map(([id, post]) => (
            <div key={id} className="post-item" onClick={() => goFreeDetail(parseInt(id))}>
              <div className="post-header">
                <div>
                  <div className="post-title">{post.title}</div>
                  <div className="post-content">{post.content.substring(0, 50)}...</div>
                </div>
              </div>
              <div className="post-footer">
                <span>{post.author}</span>
                <span>{post.date} | 댓글 {post.comments.length}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button className="page-btn" onClick={goToFirstPage}>{"<<"}</button>
          <button className="page-btn" onClick={goToPrevPage}>{"<"}</button>
          <button className={`page-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => goToPage(1)}>1</button>
          <button className={`page-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => goToPage(2)}>2</button>
          <button className={`page-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => goToPage(3)}>3</button>
          <button className="page-btn" onClick={goToNextPage}>{">"}</button>
          <button className="page-btn" onClick={goToLastPage}>{">>"}</button>
        </div>
      </div>
    </>
  );
}

export default Free;

