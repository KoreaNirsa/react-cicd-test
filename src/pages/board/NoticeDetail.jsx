import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../../components/Header.jsx';
import { useNoticeDetailHook } from '../../hooks/useNoticeDetail';
import { deleteNotice } from '../../api/boardApi';

function NoticeDetail() {
  const queryClient = useQueryClient();
  const {
    post,
    postId,
    isLoading,
    isError,
    error,
    isLoggedIn,
    isWriter,
    currentUser,
    goToList,
    goToEdit,
  } = useNoticeDetailHook();

  // 디버깅: 작성자 확인 상태 로그
  if (post) {
    console.log('[NoticeDetail] isLoggedIn:', isLoggedIn);
    console.log('[NoticeDetail] isWriter:', isWriter);
    console.log('[NoticeDetail] currentUser:', currentUser);
    console.log('[NoticeDetail] post.writer:', post.writer);
    console.log('[NoticeDetail] post.writerId:', post.writerId);
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      writer: '홍길동',
      content: '좋은 정보 감사합니다!',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      writer: '김철수',
      content: '추가로 궁금한 점이 있습니다.',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      writer: '이영희',
      content: '도움이 많이 되었어요.',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ]);

  const deletePost = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!postId) {
      alert('게시글 ID를 찾을 수 없습니다.');
      return;
    }

    setIsDeleting(true);

    try {
      // API 호출
      await deleteNotice(postId);
      
      // 목록 페이지 쿼리 캐시 무효화하여 최신 데이터를 다시 조회하도록 함
      queryClient.invalidateQueries({ queryKey: ['noticeList'] });
      
      alert('게시글이 삭제되었습니다.');
      closeDeleteModal();
      goToList();
    } catch (error) {
      console.error('[NoticeDetail] 삭제 실패:', error);
      
      if (error.response) {
        // 서버 응답 에러
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           '게시글 삭제 중 오류가 발생했습니다.';
        alert(errorMessage);
        
        // 인증 오류인 경우 로그인 페이지로 리다이렉트
        if (error.response.status === 401 || error.response.status === 403) {
          closeDeleteModal();
          // 로그인 페이지로 이동하는 로직이 필요하면 추가
        }
      } else if (error.request) {
        alert('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert('요청 처리 중 오류가 발생했습니다: ' + error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const submitComment = () => {
    if (!commentInput.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    const newComment = {
      id: comments.length + 1,
      writer: "현재사용자",
      content: commentInput.trim(),
      createdAt: new Date().toISOString()
    };

    setComments([...comments, newComment]);
    setCommentInput('');
  };

  // 로딩 중
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container">
          <div style={{textAlign: 'center', padding: '2rem'}}>로딩 중...</div>
        </div>
      </>
    );
  }

  // 에러 발생
  if (isError) {
    console.error('[NoticeDetail] 에러 발생:', error);
    return (
      <>
        <Header />
        <div className="container">
          <button 
            onClick={goToList}
            style={{
              color: 'var(--accent)', 
              textDecoration: 'none', 
              marginBottom: '1rem', 
              display: 'inline-block',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          >
            ← 목록으로 돌아가기
          </button>
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--error)'}}>
            게시글을 불러오는 중 오류가 발생했습니다.
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

  // 게시글이 없는 경우
  if (!post) {
    return (
      <>
        <Header />
        <div className="container">
          <Link to="/notice" style={{color: 'var(--accent)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block'}}>← 목록으로 돌아가기</Link>
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
            게시글을 찾을 수 없습니다.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <button 
          onClick={goToList}
          style={{
            color: 'var(--accent)', 
            textDecoration: 'none', 
            marginBottom: '1rem', 
            display: 'inline-block',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        >
          ← 목록으로 돌아가기
        </button>
        
        <div className="post-detail">
          <div className="detail-header">
            <div>
              <h1>{post.title || '제목 없음'}</h1>
              <div className="detail-meta">
                <span>{post.writer || post.writerName || '작성자'}</span>
                <span>
                  {post.createdAt 
                    ? new Date(post.createdAt).toLocaleDateString('ko-KR')
                    : post.createdDate 
                    ? new Date(post.createdDate).toLocaleDateString('ko-KR')
                    : '날짜 없음'}
                </span>
                {(post.viewCount !== undefined || post.views !== undefined) && (
                  <span>조회수 {post.viewCount || post.views}</span>
                )}
                {post.category && (
                  <span className="badge" style={{marginLeft: '0.5rem'}}>{post.category}</span>
                )}
              </div>
            </div>
            {isLoggedIn && isWriter && (
              <div className="detail-actions" style={{display: 'flex', gap: '0.5rem'}}>
                <button 
                  onClick={goToEdit}
                  className="btn btn-secondary"
                >
                  수정
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={deletePost}
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {post.imageUrl && (
            <div style={{margin: '2rem 0'}}>
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                style={{width: '100%', maxWidth: '600px', borderRadius: '0.5rem'}} 
              />
            </div>
          )}
          
          <div 
            className="detail-content"
            style={{
              marginTop: '2rem',
              padding: '1rem',
              lineHeight: '1.6',
              minHeight: '200px'
            }}
          >
            {/* 게시글 내용 */}
            <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            
            {/* 첨부된 이미지 파일들을 게시글 내용에 표시 */}
            {post.files && post.files.length > 0 && (
              <div style={{marginTop: '2rem'}}>
                {post.files
                  .filter(file => {
                    // contentType이 image로 시작하거나, 파일 확장자로 이미지 판단
                    const isImageByType = file.contentType && file.contentType.startsWith('image/');
                    const isImageByExt = file.originalFileName && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.originalFileName);
                    return isImageByType || isImageByExt;
                  })
                  .map((file) => {
                    // 이미지 URL 생성
                    let imageUrl = '';
                    if (file.filePath) {
                      imageUrl = file.filePath.startsWith('http') 
                        ? file.filePath 
                        : `http://54.146.225.79:8080${file.filePath}`;
                    } else if (file.storedFileName) {
                      imageUrl = `http://54.146.225.79:8080/files/${file.storedFileName}`;
                    }
                    
                    console.log('[이미지 로드] 파일 정보:', file);
                    console.log('[이미지 로드] 이미지 URL:', imageUrl);
                    
                    if (!imageUrl) {
                      console.warn('[이미지 로드] URL을 생성할 수 없습니다:', file);
                      return null;
                    }
                    
                    return (
                      <div key={file.id} style={{marginBottom: '1rem'}}>
                        <img 
                          src={imageUrl}
                          alt={file.originalFileName || '첨부 이미지'}
                          style={{
                            width: '100%',
                            maxWidth: '800px',
                            height: 'auto',
                            borderRadius: '0.5rem',
                            display: 'block',
                            border: '1px solid var(--border)'
                          }}
                          onError={(e) => {
                            console.error('[이미지 로드 실패] URL:', imageUrl);
                            console.error('[이미지 로드 실패] 파일 정보:', file);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('[이미지 로드 성공] URL:', imageUrl);
                          }}
                        />
                      </div>
                    );
                  })
                  .filter(Boolean)}
              </div>
            )}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="comments-section" style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)'}}>
          <h2 style={{marginBottom: '1.5rem'}}>댓글 ({comments.length})</h2>
          
          <div className="comment-form" style={{marginBottom: '2rem'}}>
            <textarea 
              placeholder="댓글을 입력하세요" 
              rows="3"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontFamily: 'inherit',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
            <button 
              className="btn btn-primary" 
              onClick={submitComment}
              style={{marginTop: '0.5rem'}}
            >
              댓글 작성
            </button>
          </div>

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onUpdate={(updatedComment) => {
                    setComments(comments.map(c => c.id === updatedComment.id ? updatedComment : c));
                  }}
                  onDelete={(commentId) => {
                    setComments(comments.filter(c => c.id !== commentId));
                  }}
                />
              ))
            ) : (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                등록된 댓글이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal active" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{marginBottom: '1.5rem'}}>게시글 삭제</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-secondary)'}}>정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                onClick={confirmDelete} 
                style={{backgroundColor: 'var(--error)'}}
                disabled={isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CommentItem({ comment, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const editComment = () => {
    setIsEditing(true);
  };

  const saveCommentEdit = () => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    const updatedComment = {
      ...comment,
      content: editContent.trim()
    };
    setIsEditing(false);
    onUpdate(updatedComment);
  };

  const cancelCommentEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const deleteComment = () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }
    onDelete(comment.id);
  };

  return (
    <div className="comment-item" style={{
      padding: '1rem',
      borderBottom: '1px solid var(--border)',
      marginBottom: '1rem'
    }}>
      <div className="comment-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <div>
          <span className="comment-author" style={{fontWeight: 'bold'}}>
            {comment.writer}
          </span>
          <span className="comment-date" style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginLeft: '0.5rem'
          }}>
            {new Date(comment.createdAt).toLocaleString('ko-KR')}
          </span>
        </div>
        <div className="comment-actions" style={{display: 'flex', gap: '0.5rem'}}>
          <button 
            onClick={editComment}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.25rem 0.5rem'
            }}
          >
            수정
          </button>
          <button 
            onClick={deleteComment}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--error)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.25rem 0.5rem'
            }}
          >
            삭제
          </button>
        </div>
      </div>
      {isEditing ? (
        <div>
          <textarea 
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--border)',
              borderRadius: '0.3rem',
              fontFamily: 'inherit',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
          <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.5rem'}}>
            <button 
              onClick={saveCommentEdit} 
              className="btn btn-primary" 
              style={{padding: '0.3rem 0.8rem', fontSize: '0.75rem'}}
            >
              저장
            </button>
            <button 
              onClick={cancelCommentEdit} 
              className="btn btn-secondary" 
              style={{padding: '0.3rem 0.8rem', fontSize: '0.75rem'}}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-content" style={{
          color: 'var(--text-primary)',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
          {comment.content}
        </div>
      )}
    </div>
  );
}

export default NoticeDetail;

