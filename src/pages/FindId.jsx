import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

function FindId() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showFindBtn, setShowFindBtn] = useState(false);

  const sendVerificationCode = () => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }

    alert(`${email}로 인증 코드를 발송했습니다.`);
    setShowCodeInput(true);
    setShowFindBtn(true);
  };

  const handleFindId = (e) => {
    e.preventDefault();
    if (code) {
      alert(`아이디를 찾았습니다: testuser\n${email}로 전송되었습니다.`);
      // navigate('/login');
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="form-card">
          <h2>아이디 찾기</h2>
          <form onSubmit={handleFindId}>
            <div className="form-group">
              <label>등록하신 이메일</label>
              <input 
                type="email" 
                placeholder="회원가입 시 입력한 이메일" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem'}}>
              입력하신 이메일로 인증 코드가 발송됩니다.
            </p>
            <div className="form-group" style={{display: showCodeInput ? 'block' : 'none'}}>
              <label>인증 코드</label>
              <input 
                type="text" 
                placeholder="인증 코드를 입력하세요"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={sendVerificationCode}
                style={{display: showFindBtn ? 'none' : 'block'}}
              >
                인증코드 발송
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{display: showFindBtn ? 'block' : 'none'}}
              >
                아이디 찾기
              </button>
            </div>
          </form>
          <div className="form-link">
            <Link to="/login">로그인으로 돌아가기</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindId;

