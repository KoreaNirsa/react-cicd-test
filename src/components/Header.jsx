import { Link, useLocation } from 'react-router-dom';
import { useHeader } from '../hooks/useHeader';
import '../App.css';

function Header() {
  const location = useLocation();
  const { isLoggedIn, handleLogout } = useHeader();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <header>
      <nav>
        <div className="logo">Spring Hub</div>
        <ul className="nav-center">
          <li><Link to="/" className={isActive('/')}>홈</Link></li>
          <li><Link to="/notice" className={isActive('/notice')}>공지사항</Link></li>
          <li><Link to="/free" className={isActive('/free')}>자유게시판</Link></li>
          {isLoggedIn && (
            <li><Link to="/profile" className={isActive('/profile')}>회원정보</Link></li>
          )}
        </ul>
        {!isLoggedIn ? (
          <div className="nav-right">
            <Link to="/login" className="btn btn-secondary" style={{textDecoration: 'none'}}>로그인</Link>
            <Link to="/register" className="btn btn-primary" style={{textDecoration: 'none', display: 'inline-block'}}>회원가입</Link>
          </div>
        ) : (
          <div className="nav-right">
            <button 
              onClick={handleLogout} 
              className="btn btn-primary" 
              style={{textDecoration: 'none', display: 'inline-block', border: 'none', cursor: 'pointer'}}
            >
              로그아웃
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;

