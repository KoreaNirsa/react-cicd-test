import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import { postsData, getCommentIdCounter } from '../../store/postsStore';

function FreeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id) || 1;
  const [post, setPost] = useState(postsData.free[postId] || postsData.free[1]);
  const [commentInput, setCommentInput] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const data = postsData.free[postId] || postsData.free[1];
    setPost(data);
  }, [postId]);

  const submitComment = () => {
    if (!commentInput.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    const newComment = {
      id: getCommentIdCounter(),
      author: "currentUser",
      date: new Date().toLocaleDateString("ko-KR"),
      content: commentInput.trim(),
    };

    post.comments.push(newComment);
    setPost({ ...post, comments: [...post.comments] });
    setCommentInput('');
  };

  const deletePost = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    alert("게시글이 삭제되었습니다.");
    closeDeleteModal();
    navigate('/free');
  };

  return (
    <>
      <Header />
      <div className="container">
        <Link to="/free" style={{color: 'var(--accent)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block'}}>← 목록으로 돌아가기</Link>
        
        <div className="post-detail">
          <div className="detail-header">
            <div>
              <h1>{post.title}</h1>
              <div className="detail-meta">
                <span>{post.author}</span>
                <span>{post.date}</span>
                <span>조회수 {post.views}</span>
              </div>
            </div>
            <div className="detail-actions">
              <Link to={`/free-edit/${postId}`} className="btn btn-secondary" style={{textDecoration: 'none'}}>수정</Link>
              <button className="btn btn-secondary" onClick={deletePost}>삭제</button>
            </div>
          </div>

          {post.image && (
            <div style={{margin: '2rem 0'}}>
              <img src={post.image} alt={post.title} style={{width: '100%', maxWidth: '600px', borderRadius: '0.5rem'}} />
            </div>
          )}
          
          <div className="detail-content">
            {post.content}
          </div>
        </div>

        <div className="comments-section">
          <h2>댓글 ({post.comments.length})</h2>
          
          <div className="comment-form">
            <textarea 
              placeholder="댓글을 입력하세요" 
              rows="3"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button className="btn btn-primary" onClick={submitComment}>댓글 작성</button>
          </div>

          <div className="comments-list">
            {post.comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                postId={postId} 
                isNotice={false}
                onUpdate={() => {
                  const data = postsData.free[postId] || postsData.free[1];
                  setPost({ ...data });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal active" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{marginBottom: '1.5rem'}}>게시글 삭제</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-secondary)'}}>정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={confirmDelete} style={{backgroundColor: 'var(--error)'}}>삭제</button>
              <button className="btn btn-secondary" onClick={closeDeleteModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CommentItem({ comment, postId, isNotice, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const postsType = isNotice ? 'notice' : 'free';
  const currentPost = postsData[postsType][postId];

  const editComment = () => {
    setIsEditing(true);
  };

  const saveCommentEdit = () => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    const commentIndex = currentPost.comments.findIndex(c => c.id === comment.id);
    if (commentIndex !== -1) {
      currentPost.comments[commentIndex].content = editContent.trim();
      setIsEditing(false);
      onUpdate();
    }
  };

  const cancelCommentEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const deleteComment = () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }
    const commentIndex = currentPost.comments.findIndex(c => c.id === comment.id);
    if (commentIndex !== -1) {
      currentPost.comments.splice(commentIndex, 1);
      onUpdate();
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div>
          <span className="comment-author">{comment.author}</span>
          <span className="comment-date"> | {comment.date}</span>
        </div>
        <div className="comment-actions">
          <button onClick={editComment}>수정</button>
          <button onClick={deleteComment}>삭제</button>
        </div>
      </div>
      {isEditing ? (
        <div>
          <textarea 
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.3rem', fontFamily: 'inherit'}}
          />
          <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.5rem'}}>
            <button onClick={saveCommentEdit} className="btn btn-primary" style={{padding: '0.3rem 0.8rem', fontSize: '0.75rem'}}>저장</button>
            <button onClick={cancelCommentEdit} className="btn btn-secondary" style={{padding: '0.3rem 0.8rem', fontSize: '0.75rem'}}>취소</button>
          </div>
        </div>
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}
    </div>
  );
}

export default FreeDetail;

