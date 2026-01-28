import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import { postsData } from '../../store/postsStore';

function FreeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id) || 1;
  const post = postsData.free[postId] || postsData.free[1];
  const [title, setTitle] = useState(post.title || '');
  const [imagePreview, setImagePreview] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Quill && !quillRef.current) {
      const quill = new window.Quill('#freeEditor', {
        theme: 'snow',
        placeholder: '게시글 내용을 입력하세요',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
      quillRef.current = quill;
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateFreePost = (e) => {
    e.preventDefault();
    alert("게시글이 수정되었습니다.");
    navigate(`/free-detail/${postId}`);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1 style={{marginBottom: '2rem'}}>게시글 수정</h1>
        <div className="form-card" style={{maxWidth: '800px'}}>
          <form onSubmit={updateFreePost}>
            <div className="form-group">
              <label>제목</label>
              <input 
                type="text" 
                placeholder="게시글 제목을 입력하세요" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label>내용</label>
              <div id="freeEditor" className="editor-container"></div>
            </div>
            <div className="form-group">
              <label>이미지 업로드</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div style={{marginTop: '1rem'}}>
                  <img src={imagePreview} alt="Preview" style={{maxWidth: '300px', borderRadius: '0.5rem'}} />
                </div>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">수정</button>
              <button type="button" onClick={() => navigate(`/free-detail/${postId}`)} className="btn btn-secondary">취소</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FreeEdit;

