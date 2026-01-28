import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { postsData } from '../data/postsData';

function AnnouncementEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id) || 1;
  const post = postsData.announcements[postId] || postsData.announcements[1];
  const [category, setCategory] = useState(post.category || '공지');
  const [title, setTitle] = useState(post.title || '');
  const [imagePreview, setImagePreview] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Quill && !quillRef.current) {
      const quill = new window.Quill('#announcementEditor', {
        theme: 'snow',
        placeholder: '공지사항 내용을 입력하세요',
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

  const updateAnnouncement = (e) => {
    e.preventDefault();
    alert("공지사항이 수정되었습니다.");
    navigate(`/announcement-detail/${postId}`);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1 style={{marginBottom: '2rem'}}>공지사항 수정</h1>
        <div className="form-card" style={{maxWidth: '800px'}}>
          <form onSubmit={updateAnnouncement}>
            <div className="form-group">
              <label>분류</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem'}}
              >
                <option value="공지">공지</option>
                <option value="점검">점검</option>
                <option value="이벤트">이벤트</option>
              </select>
            </div>
            <div className="form-group">
              <label>제목</label>
              <input 
                type="text" 
                placeholder="공지사항 제목을 입력하세요" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label>내용</label>
              <div id="announcementEditor" className="editor-container"></div>
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
            <div className="form-actions" style={{textAlign: 'center'}}>
              <button type="submit" className="btn btn-primary">수정</button>
              <button type="button" onClick={() => navigate(`/announcement-detail/${postId}`)} className="btn btn-secondary">취소</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AnnouncementEdit;

