import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function BoardWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Quill && !quillRef.current) {
      const quill = new window.Quill('#boardEditor', {
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

  const submitBoardPost = (e) => {
    e.preventDefault();
    alert("게시글이 작성되었습니다.");
    navigate('/board');
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1 style={{marginBottom: '2rem'}}>게시글 작성</h1>
        <div className="form-card" style={{maxWidth: '800px'}}>
          <form onSubmit={submitBoardPost}>
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
              <div id="boardEditor" className="editor-container"></div>
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
              <button type="submit" className="btn btn-primary">작성</button>
              <button type="button" onClick={() => navigate('/board')} className="btn btn-secondary">취소</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default BoardWrite;

