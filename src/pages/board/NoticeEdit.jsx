import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../../components/Header.jsx';
import { useNoticeEdit } from '../../query/useBoardQueries';
import { updateNotice } from '../../api/boardApi';

function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const postId = id ? parseInt(id) : null;
  
  // API를 통해 수정용 데이터 조회
  const { data: boardDTO, isLoading, isError, error } = useNoticeEdit(postId);
  
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const quillRef = useRef(null);
  const contentLoadedRef = useRef(false);
  const editorInitializedRef = useRef(false);

  // API 데이터가 로드되면 state 업데이트
  useEffect(() => {
    if (boardDTO) {
      setCategory(boardDTO.category || '공지');
      setTitle(boardDTO.title || '');
    }
  }, [boardDTO]);

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
          console.error('[NoticeEdit] Quill을 로드할 수 없습니다.');
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
      if (editorInitializedRef.current || quillRef.current) {
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
        editorInitializedRef.current = true;
        setEditorReady(true); // state 업데이트로 리렌더링 트리거
        
        // 에디터가 편집 가능한지 확인
        quill.enable(true);
        
        console.log('[NoticeEdit] Quill 에디터 초기화 완료');
      } catch (err) {
        console.error('[NoticeEdit] Quill 에디터 초기화 실패:', err);
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

  // API 데이터가 로드되고 에디터가 초기화되면 내용 로드
  useEffect(() => {
    if (editorReady && quillRef.current && boardDTO && boardDTO.content && !contentLoadedRef.current) {
      try {
        const content = boardDTO.content || '';
        if (content.trim()) {
          quillRef.current.clipboard.dangerouslyPasteHTML(content);
          contentLoadedRef.current = true;
          console.log('[NoticeEdit] 게시글 내용을 에디터에 로드 완료');
        }
      } catch (err) {
        console.error('[NoticeEdit] 내용 로드 실패:', err);
      }
    }
  }, [boardDTO, editorReady]); // boardDTO와 에디터 초기화 상태가 준비되면 실행

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
      
      // BoardDTO.EditRequest 필드 추가
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      
      // 파일 추가 (여러 파일 가능)
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      
      console.log('[NoticeEdit] 수정 요청 데이터:', {
        id: postId,
        title,
        content,
        category,
        filesCount: selectedFiles.length
      });
      
      // API 호출
      await updateNotice(postId, formData);
      
      // 디테일 페이지 쿼리 캐시 무효화하여 최신 데이터를 다시 조회하도록 함
      queryClient.invalidateQueries({ queryKey: ['noticeDetail', postId] });
      
      alert('공지사항이 수정되었습니다.');
      navigate(`/notice-detail/${postId}`);
    } catch (error) {
      console.error('[NoticeEdit] 수정 실패:', error);
      
      if (error.response) {
        // 서버 응답 에러
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           '게시글 수정 중 오류가 발생했습니다.';
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
    console.error('[NoticeEdit] 에러 발생:', error);
    return (
      <>
        <Header />
        <div className="container">
          <button 
            onClick={() => navigate(`/notice-detail/${postId}`)}
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
            ← 돌아가기
          </button>
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--error)'}}>
            게시글을 불러오는 중 오류가 발생했습니다.
            <br />
            {error?.message || error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}
          </div>
        </div>
      </>
    );
  }

  // 데이터가 없는 경우
  if (!boardDTO) {
    return (
      <>
        <Header />
        <div className="container">
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
        <h1 style={{marginBottom: '2rem'}}>공지사항 수정</h1>
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
                {isSubmitting ? '수정 중...' : '수정'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate(`/notice-detail/${postId}`)} 
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

export default NoticeEdit;
