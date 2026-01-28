import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import FindId from './pages/FindId.jsx';
import FindPassword from './pages/FindPassword.jsx';
import Profile from './pages/Profile.jsx';
import Notice from './pages/board/Notice.jsx';
import NoticeDetail from './pages/board/NoticeDetail.jsx';
import NoticeWrite from './pages/board/NoticeWrite.jsx';
import NoticeEdit from './pages/board/NoticeEdit.jsx';
import Free from './pages/board/Free.jsx';
import FreeDetail from './pages/board/FreeDetail.jsx';
import FreeWrite from './pages/board/FreeWrite.jsx';
import FreeEdit from './pages/board/FreeEdit.jsx';
import './App.css';

function App() {
  console.log('App component rendering');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice-detail/:id" element={<NoticeDetail />} />
        <Route path="/notice-write" element={<NoticeWrite />} />
        <Route path="/notice-edit/:id" element={<NoticeEdit />} />
        <Route path="/free" element={<Free />} />
        <Route path="/free-detail/:id" element={<FreeDetail />} />
        <Route path="/free-write" element={<FreeWrite />} />
        <Route path="/free-edit/:id" element={<FreeEdit />} />
      </Routes>
    </Router>
  );
}

export default App;

