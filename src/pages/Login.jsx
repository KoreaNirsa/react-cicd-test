import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { useLoginForm } from '../hooks/useLoginForm';

function Login() {
  const { userId, password, error, handleUserIdChange, handlePasswordChange, handleSubmit, isPending } = useLoginForm();

  return (
    <>
      <Header />
      <div className="container">
        <div className="form-card">
          <h2>로그인</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>아이디</label>
              <input 
                type="text" 
                placeholder="사용자 아이디를 입력하세요" 
                value={userId}
                onChange={handleUserIdChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>비밀번호</label>
              <input 
                type="password" 
                placeholder="비밀번호를 입력하세요" 
                value={password}
                onChange={handlePasswordChange}
                required 
              />
            </div>
            {error && (
              <div style={{color: 'var(--error)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center'}}>
                {error}
              </div>
            )}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
          <div className="form-link">
            <Link to="/find-id">아이디 찾기</Link> | 
            <Link to="/find-password"> 비밀번호 찾기</Link>
          </div>
          <div className="form-link">
            계정이 없으신가요? <Link to="/register">회원가입</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

