import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

function FindPassword() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [showResetBtn, setShowResetBtn] = useState(false);

  const sendPasswordVerificationCode = () => {
    if (!userId || !email) {
      alert("아이디와 이메일을 입력하세요.");
      return;
    }

    alert(`${email}로 인증 코드를 발송했습니다.`);
    setShowCodeInput(true);
    setShowResetBtn(true);

    setTimeout(() => {
      setShowPasswordInputs(true);
    }, 1000);
  };

  const handleFindPassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword) {
      alert("비밀번호가 변경되었습니다.");
      // navigate('/login');
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="form-card">
          <h2>비밀번호 찾기</h2>
          <form onSubmit={handleFindPassword}>
            <div className="form-group">
              <label>아이디</label>
              <input 
                type="text" 
                placeholder="사용자 아이디" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required 
              />
            </div>
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
            <div className="form-group" style={{display: showPasswordInputs ? 'block' : 'none'}}>
              <label>새 비밀번호</label>
              <input 
                type="password" 
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group" style={{display: showPasswordInputs ? 'block' : 'none'}}>
              <label>비밀번호 확인</label>
              <input 
                type="password" 
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={sendPasswordVerificationCode}
                style={{display: showResetBtn ? 'none' : 'block'}}
              >
                인증코드 발송
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{display: showResetBtn ? 'block' : 'none'}}
              >
                비밀번호 재설정
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

export default FindPassword;

