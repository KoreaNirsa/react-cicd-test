import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { useRegisterForm } from '../hooks/useRegisterForm';

function Register() {
  const { formData, errors, handleChange, handleSubmit, isPending } = useRegisterForm();

  return (
    <>
      <Header />
      <div className="container">
        <div className="form-card">
          <h2>회원가입</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>이름</label>
              <input 
                type="text" 
                name="name"
                placeholder="이름을 입력하세요" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              {errors.name && <span style={{color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>아이디</label>
              <input 
                type="text" 
                name="userId"
                placeholder="사용할 아이디를 입력하세요" 
                value={formData.userId}
                onChange={handleChange}
                required 
              />
              {errors.userId && <span style={{color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.userId}</span>}
            </div>
            <div className="form-group">
              <label>이메일</label>
              <input 
                type="email" 
                name="email"
                placeholder="이메일을 입력하세요" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              {errors.email && <span style={{color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>비밀번호</label>
              <input 
                type="password" 
                name="password"
                placeholder="비밀번호를 입력하세요 (최소 6자)" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              {errors.password && <span style={{color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>비밀번호 확인</label>
              <input 
                type="password" 
                name="passwordConfirm"
                placeholder="비밀번호를 다시 입력하세요" 
                value={formData.passwordConfirm}
                onChange={handleChange}
                required 
              />
              {errors.passwordConfirm && <span style={{color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{errors.passwordConfirm}</span>}
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? '처리 중...' : '가입하기'}
              </button>
              <Link to="/" className="btn btn-secondary" style={{textDecoration: 'none', textAlign: 'center'}}>취소</Link>
            </div>
          </form>
          <div className="form-link">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

