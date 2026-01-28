import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../../components/Header.jsx';
import { createNotice } from '../../api/boardApi';

function NoticeWrite() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('공지');
  const [title, setTitle] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const quillRef = useRef(null);

  // Quill 에디터 초기화
  useEffect(() => {
    let timeoutId = null;
    let retryCount = 0;
    const maxRetries = 50; // 최대 5초 대기 (100ms * 50)
    
    const initEditor = () => {
      // Quill이 로드되지 않았으면 재시도
      if (typeof window === 'undefined' || !window.Quill) {
        if (retryCount < maxRetries) {
          retryCount++;
          timeoutId = setTimeout(initEditor, 100);
        } else {
          console.error('[NoticeWrite] Quill을 로드할 수 없습니다.');
        }
        return;
      }

      const editorElement = document.getElementById('noticeEditor');
      if (!editorElement) {
        // DOM 요소가 아직 준비되지 않았으면 재시도
        if (retryCount < maxRetries) {
          retryCount++;
          timeoutId = setTimeout(initEditor, 100);
        }
        return;
      }

      // 이미 초기화되었으면 스킵
      if (quillRef.current) {
        return;
      }

      try {
        const quill = new window.Quill('#noticeEditor', {
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
        setEditorReady(true);
        
        console.log('[NoticeWrite] Quill 에디터 초기화 완료');
      } catch (err) {
        console.error('[NoticeWrite] Quill 에디터 초기화 실패:', err);
      }
    };

    initEditor();
    
    // cleanup 함수
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // 미리보기용 첫 번째 파일만 표시
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!quillRef.current) {
      alert('에디터가 준비되지 않았습니다.');
      return;
    }
    
    // 에디터에서 내용 가져오기
    const content = quillRef.current.root.innerHTML;
    
    if (!content.trim() || content === '<p><br></p>') {
      alert('내용을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // FormData 생성 (파일 업로드를 위해)
      const formData = new FormData();
      
      // BoardDTO.CreateRequest 필드 추가
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      
      // 파일 추가 (여러 파일 가능)
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      
      console.log('[NoticeWrite] 생성 요청 데이터:', {
        title,
        content,
        category,
        filesCount: selectedFiles.length
      });
      
      // API 호출
      const response = await createNotice(formData);
      
      // 목록 페이지 쿼리 캐시 무효화하여 최신 데이터를 다시 조회하도록 함
      queryClient.invalidateQueries({ queryKey: ['noticeList'] });
      
      alert('공지사항이 작성되었습니다.');
      
      // 생성된 게시글의 ID가 응답에 포함되어 있다면 디테일 페이지로 이동
      if (response?.id || response?.boardDTO?.id) {
        const noticeId = response.id || response.boardDTO.id;
        navigate(`/notice-detail/${noticeId}`);
      } else {
        // ID가 없으면 목록 페이지로 이동
        navigate('/notice');
      }
    } catch (error) {
      console.error('[NoticeWrite] 작성 실패:', error);
      
      if (error.response) {
        // 서버 응답 에러
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           '게시글 작성 중 오류가 발생했습니다.';
        alert(errorMessage);
        
        // 인증 오류인 경우 로그인 페이지로 리다이렉트
        if (error.response.status === 401 || error.response.status === 403) {
          navigate('/login');
        }
      } else if (error.request) {
        alert('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert('요청 처리 중 오류가 발생했습니다: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1 style={{marginBottom: '2rem'}}>공지사항 작성</h1>
        <div className="form-card" style={{maxWidth: '800px'}}>
          <form onSubmit={handleSubmit}>
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
              <div id="noticeEditor" className="editor-container"></div>
            </div>
            <div className="form-group">
              <label>이미지 업로드</label>
              <input 
                type="file" 
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              {imagePreview && (
                <div style={{marginTop: '1rem'}}>
                  <img src={imagePreview} alt="Preview" style={{maxWidth: '300px', borderRadius: '0.5rem'}} />
                </div>
              )}
              {selectedFiles.length > 1 && (
                <div style={{marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                  {selectedFiles.length}개의 파일이 선택되었습니다.
                </div>
              )}
            </div>
            <div className="form-actions" style={{textAlign: 'center'}}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? '작성 중...' : '작성'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/notice')} 
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default NoticeWrite;

