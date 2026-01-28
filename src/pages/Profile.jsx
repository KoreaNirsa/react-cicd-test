import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

function Profile() {
  const [name, setName] = useState('홍길동');
  const [email, setEmail] = useState('user@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const updateProfile = (e) => {
    e.preventDefault();
    if (name && email) {
      alert("프로필이 업데이트되었습니다.");
      // 실제 프로필 수정 로직은 여기에 구현 (Spring 백엔드 API 연동)
    }
  };

  const changePassword = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (currentPassword && newPassword) {
      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // 실제 비밀번호 변경 로직은 여기에 구현 (Spring 백엔드 API 연동)
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1 style={{marginBottom: '2rem'}}>회원정보</h1>
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-avatar">👤</div>
            <div style={{textAlign: 'center'}}>
              <h3 style={{marginBottom: '0.5rem'}}>홍길동</h3>
              <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>user@example.com</p>
            </div>
          </div>
          <div className="profile-main">
            <div className="profile-section">
              <h3>기본 정보</h3>
              <form onSubmit={updateProfile}>
                <div className="form-group">
                  <label>이름</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>아이디</label>
                  <input type="text" value="user123" disabled />
                </div>
                <div className="form-group">
                  <label>이메일</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary">저장</button>
              </form>
            </div>

            <div className="profile-section">
              <h3>비밀번호 변경</h3>
              <form onSubmit={changePassword}>
                <div className="form-group">
                  <label>현재 비밀번호</label>
                  <input 
                    type="password" 
                    placeholder="현재 비밀번호를 입력하세요" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>새 비밀번호</label>
                  <input 
                    type="password" 
                    placeholder="새 비밀번호를 입력하세요" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>비밀번호 확인</label>
                  <input 
                    type="password" 
                    placeholder="비밀번호를 다시 입력하세요" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary">비밀번호 변경</button>
              </form>
            </div>

            <div className="profile-section">
              <Link to="/login" className="btn btn-secondary" style={{textDecoration: 'none', display: 'inline-block', marginTop: '2rem'}}>로그아웃</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

