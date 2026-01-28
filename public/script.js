// 로그인 함수
function handleLogin(event) {
  event.preventDefault()
  const form = event.target
  const userId = form.querySelector('input[type="text"]').value
  const password = form.querySelector('input[type="password"]').value

  if (userId && password) {
    alert(`로그인 되었습니다: ${userId}`)
    // 실제 로그인 로직은 여기에 구현 (Spring 백엔드 API 연동)
    // window.location.href = 'index.html'
  }
}

// 회원가입 함수
function handleRegister(event) {
  event.preventDefault()
  const form = event.target
  const inputs = form.querySelectorAll("input")
  const name = inputs[0].value
  const userId = inputs[1].value
  const email = inputs[2].value
  const password = inputs[3].value
  const passwordConfirm = inputs[4].value

  if (password !== passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.")
    return
  }

  if (name && userId && email && password) {
    alert(`회원가입이 완료되었습니다!\n이름: ${name}\n아이디: ${userId}\n이메일: ${email}`)
    // 실제 회원가입 로직은 여기에 구현 (Spring 백엔드 API 연동)
    // window.location.href = 'login.html'
  }
}

// 아이디 찾기 - 인증 코드 발송
function sendVerificationCode() {
  const emailInput = document.querySelector('input[type="email"]')
  const email = emailInput ? emailInput.value : ""

  if (!email) {
    alert("이메일을 입력하세요.")
    return
  }

  alert(`${email}로 인증 코드를 발송했습니다.`)

  const verificationCodeGroup = document.getElementById("verificationCodeGroup")
  const emailVerifyBtn = document.getElementById("emailVerifyBtn")
  const findIdBtn = document.getElementById("findIdBtn")

  if (verificationCodeGroup) verificationCodeGroup.style.display = "block"
  if (emailVerifyBtn) emailVerifyBtn.style.display = "none"
  if (findIdBtn) findIdBtn.style.display = "block"
}

function handleFindId(event) {
  event.preventDefault()
  const form = event.target
  const inputs = form.querySelectorAll("input")
  const email = inputs[0].value
  const code = inputs[1] ? inputs[1].value : ""

  if (code) {
    alert(`아이디를 찾았습니다: testuser\n${email}로 전송되었습니다.`)
    // window.location.href = 'login.html'
  }
}

// 비밀번호 찾기 - 인증 코드 발송
function sendPasswordVerificationCode() {
  const form = event.target.closest("form")
  const inputs = form.querySelectorAll("input")
  const userId = inputs[0].value
  const email = inputs[1].value

  if (!userId || !email) {
    alert("아이디와 이메일을 입력하세요.")
    return
  }

  alert(`${email}로 인증 코드를 발송했습니다.`)

  const verificationCodeGroup = document.getElementById("passwordVerificationCodeGroup")
  const verifyBtn = document.getElementById("passwordVerifyBtn")
  const resetBtn = document.getElementById("resetPasswordBtn")

  if (verificationCodeGroup) verificationCodeGroup.style.display = "block"
  if (verifyBtn) verifyBtn.style.display = "none"
  if (resetBtn) resetBtn.style.display = "block"

  setTimeout(() => {
    const newPasswordGroup = document.getElementById("newPasswordGroup")
    const confirmPasswordGroup = document.getElementById("confirmPasswordGroup")
    if (newPasswordGroup) newPasswordGroup.style.display = "block"
    if (confirmPasswordGroup) confirmPasswordGroup.style.display = "block"
  }, 1000)
}

function handleFindPassword(event) {
  event.preventDefault()
  const form = event.target
  const inputs = form.querySelectorAll("input")

  let newPassword = ""
  let confirmPassword = ""

  // 입력된 input의 순서에 따라 새 비밀번호와 확인 비밀번호 추출
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "password") {
      if (!newPassword) {
        newPassword = inputs[i].value
      } else if (!confirmPassword) {
        confirmPassword = inputs[i].value
        break
      }
    }
  }

  if (newPassword !== confirmPassword) {
    alert("새 비밀번호가 일치하지 않습니다.")
    return
  }

  if (newPassword) {
    alert("비밀번호가 변경되었습니다.")
    // window.location.href = 'login.html'
  }
}

// 게시물 작성 모달
function showWritePost() {
  const modal = document.getElementById("writePostModal")
  if (modal) {
    modal.classList.add("active")
  }
}

function closeWritePost() {
  const modal = document.getElementById("writePostModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function submitPost(event) {
  event.preventDefault()
  const form = event.target
  const title = form.querySelector('input[type="text"]').value
  const content = form.querySelector("textarea").value

  if (title && content) {
    alert(`게시물이 작성되었습니다.\n제목: ${title}`)
    form.reset()
    closeWritePost()
    // 실제로는 여기에서 백엔드 API 호출
  }
}

// 회원정보 수정
function updateProfile(event) {
  event.preventDefault()
  const form = event.target
  const inputs = form.querySelectorAll("input")
  const name = inputs[0].value
  const email = inputs[2].value

  if (name && email) {
    alert("프로필이 업데이트되었습니다.")
    // 실제 프로필 수정 로직은 여기에 구현 (Spring 백엔드 API 연동)
  }
}

// 비밀번호 변경
function changePassword(event) {
  event.preventDefault()
  const form = event.target
  const inputs = form.querySelectorAll("input")
  const currentPassword = inputs[0].value
  const newPassword = inputs[1].value
  const confirmPassword = inputs[2].value

  if (newPassword !== confirmPassword) {
    alert("새 비밀번호가 일치하지 않습니다.")
    return
  }

  if (currentPassword && newPassword) {
    alert("비밀번호가 변경되었습니다.")
    form.reset()
    // 실제 비밀번호 변경 로직은 여기에 구현 (Spring 백엔드 API 연동)
  }
}

const postsData = {
  announcements: {
    1: {
      title: "Spring 학습 플랫폼 오픈",
      author: "관리자",
      date: "2025.11.29",
      content:
        "새로운 Spring 학습 플랫폼이 정식 오픈되었습니다. 이 플랫폼에서는 Spring Boot, Spring Data JPA, Spring Security 등 다양한 Spring 기술을 학습할 수 있습니다. 많은 이용 부탁드립니다.",
      image: "/spring-platform-launch.jpg",
      category: "공지",
      views: 156,
      comments: [
        { id: 1, author: "user123", date: "2025.11.29", content: "감사합니다!" },
        { id: 2, author: "developer456", date: "2025.11.29", content: "좋은 소식이네요." },
      ],
    },
    2: {
      title: "시스템 점검 예정",
      author: "관리자",
      date: "2025.11.28",
      content:
        "12월 1일 오전 2시부터 4시까지 시스템 점검이 예정되어 있습니다. 이 시간 동안 서비스 이용이 불가능할 수 있으니 참고 부탁드립니다.",
      image: null,
      category: "점검",
      views: 89,
      comments: [],
    },
  },
  board: {
    1: {
      title: "Spring Boot 질문입니다",
      author: "user123",
      date: "2025.11.29",
      content:
        "@RequestMapping 어노테이션의 정확한 사용법에 대해 궁금합니다. value, method, produces, consumes 등 다양한 속성이 있는데, 각각의 역할과 언제 사용해야 하는지 알려주세요.",
      image: "/spring-boot-code.jpg",
      category: "질문",
      views: 234,
      comments: [
        { id: 1, author: "user456", date: "2025.11.29", content: "감사합니다! 잘 이해했습니다." },
        { id: 2, author: "admin", date: "2025.11.29", content: "추가 질문이 있으시면 댓글로 남겨주세요." },
      ],
    },
    2: {
      title: "Dependency Injection 관련 정보",
      author: "developer456",
      date: "2025.11.28",
      content:
        "Spring의 DI(Dependency Injection) 패턴은 객체 간의 의존성을 외부에서 주입하는 방식입니다. 이는 결합도를 낮추고 코드의 재사용성을 높이는 중요한 패턴입니다. @Autowired, @Inject, @Resource 등 다양한 방식으로 DI를 구현할 수 있습니다.",
      image: null,
      category: "정보",
      views: 412,
      comments: [],
    },
  },
}

let commentIdCounter = 3

function displayAnnouncementDetail(postId) {
  const data = postsData.announcements[postId] || postsData.announcements[1]

  document.getElementById("detailTitle").textContent = data.title
  document.getElementById("detailAuthor").textContent = data.author
  document.getElementById("detailDate").textContent = data.date
  document.getElementById("detailViews").textContent = `조회수 ${data.views}`
  document.getElementById("detailContent").textContent = data.content

  if (data.image) {
    document.getElementById("detailImage").innerHTML =
      `<img src="${data.image}" style="width: 100%; max-width: 600px; border-radius: 0.5rem;">`
  }

  displayComments(data.comments)
}

function displayBoardDetail(postId) {
  const data = postsData.board[postId] || postsData.board[1]

  document.getElementById("detailTitle").textContent = data.title
  document.getElementById("detailAuthor").textContent = data.author
  document.getElementById("detailDate").textContent = data.date
  document.getElementById("detailViews").textContent = `조회수 ${data.views}`
  document.getElementById("detailContent").textContent = data.content

  if (data.image) {
    document.getElementById("detailImage").innerHTML =
      `<img src="${data.image}" style="width: 100%; max-width: 600px; border-radius: 0.5rem;">`
  }

  displayComments(data.comments)
}

function displayComments(comments) {
  const commentsList = document.getElementById("commentsList")
  const commentCount = document.getElementById("commentCount")

  commentCount.textContent = comments.length
  commentsList.innerHTML = ""

  comments.forEach((comment, index) => {
    const commentHTML = `
      <div class="comment-item" id="comment-${comment.id}">
        <div class="comment-header">
          <div>
            <span class="comment-author">${comment.author}</span>
            <span class="comment-date"> | ${comment.date}</span>
          </div>
          <div class="comment-actions">
            <button onclick="editComment(${comment.id})">수정</button>
            <button onclick="deleteComment(${comment.id})">삭제</button>
          </div>
        </div>
        <div class="comment-content" id="comment-content-${comment.id}">${comment.content}</div>
      </div>
    `
    commentsList.innerHTML += commentHTML
  })
}

function submitComment() {
  const commentInput = document.getElementById("commentInput")
  const content = commentInput.value.trim()

  if (!content) {
    alert("댓글 내용을 입력하세요.")
    return
  }

  const postId = new URLSearchParams(window.location.search).get("id") || 1
  const isAnnouncement = window.location.pathname.includes("announcement-detail")
  const postsType = isAnnouncement ? "announcements" : "board"
  const currentPost = postsData[postsType][postId]

  // 새 댓글 객체 생성
  const newComment = {
    id: commentIdCounter++,
    author: "currentUser",
    date: new Date().toLocaleDateString("ko-KR"),
    content: content,
  }

  currentPost.comments.push(newComment)
  displayComments(currentPost.comments)
  commentInput.value = ""
}

function editComment(commentId) {
  const postId = new URLSearchParams(window.location.search).get("id") || 1
  const isAnnouncement = window.location.pathname.includes("announcement-detail")
  const postsType = isAnnouncement ? "announcements" : "board"
  const currentPost = postsData[postsType][postId]

  const comment = currentPost.comments.find((c) => c.id === commentId)
  if (!comment) return

  const contentElement = document.getElementById(`comment-content-${commentId}`)
  const currentContent = comment.content

  // 수정 입력 폼으로 변환
  contentElement.innerHTML = `
    <textarea id="edit-comment-input-${commentId}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.3rem; font-family: inherit;">${currentContent}</textarea>
    <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
      <button onclick="saveCommentEdit(${commentId})" class="btn btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.75rem;">저장</button>
      <button onclick="cancelCommentEdit(${commentId}, '${currentContent}')" class="btn btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 0.75rem;">취소</button>
    </div>
  `
}

function saveCommentEdit(commentId) {
  const postId = new URLSearchParams(window.location.search).get("id") || 1
  const isAnnouncement = window.location.pathname.includes("announcement-detail")
  const postsType = isAnnouncement ? "announcements" : "board"
  const currentPost = postsData[postsType][postId]

  const comment = currentPost.comments.find((c) => c.id === commentId)
  const editInput = document.getElementById(`edit-comment-input-${commentId}`)
  const newContent = editInput.value.trim()

  if (!newContent) {
    alert("댓글 내용을 입력하세요.")
    return
  }

  comment.content = newContent
  displayComments(currentPost.comments)
}

function cancelCommentEdit(commentId, originalContent) {
  const contentElement = document.getElementById(`comment-content-${commentId}`)
  contentElement.textContent = originalContent
}

function deleteComment(commentId) {
  if (!confirm("댓글을 삭제하시겠습니까?")) {
    return
  }

  const postId = new URLSearchParams(window.location.search).get("id") || 1
  const isAnnouncement = window.location.pathname.includes("announcement-detail")
  const postsType = isAnnouncement ? "announcements" : "board"
  const currentPost = postsData[postsType][postId]

  currentPost.comments = currentPost.comments.filter((c) => c.id !== commentId)
  displayComments(currentPost.comments)
}

function deletePost() {
  const modal = document.getElementById("deleteModal")
  if (modal) {
    modal.classList.add("active")
  }
}

function closeDeleteModal() {
  const modal = document.getElementById("deleteModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function confirmDelete() {
  alert("게시글이 삭제되었습니다.")
  closeDeleteModal()
  window.history.back()
}

function submitAnnouncement(event) {
  event.preventDefault()
  alert("공지사항이 작성되었습니다.")
  window.location.href = "announcements.html"
}

function updateAnnouncement(event) {
  event.preventDefault()
  alert("공지사항이 수정되었습니다.")
  window.location.href = "announcement-detail.html"
}

function submitBoardPost(event) {
  event.preventDefault()
  alert("게시글이 작성되었습니다.")
  window.location.href = "board.html"
}

function updateBoardPost(event) {
  event.preventDefault()
  alert("게시글이 수정되었습니다.")
  window.location.href = "board-detail.html"
}

function goToFirstPage() {
  const buttons = document.querySelectorAll(".page-btn")
  buttons.forEach((btn) => btn.classList.remove("active"))
  buttons[2].classList.add("active")
  alert("첫 페이지로 이동했습니다.")
}

function goToLastPage() {
  const buttons = document.querySelectorAll(".page-btn")
  buttons.forEach((btn) => btn.classList.remove("active"))
  buttons[buttons.length - 3].classList.add("active")
  alert("마지막 페이지로 이동했습니다.")
}

function goToPrevPage() {
  const buttons = document.querySelectorAll(".page-btn")
  const activeButton = Array.from(buttons).find((btn) => btn.classList.contains("active"))

  if (activeButton && activeButton.previousElementSibling) {
    buttons.forEach((btn) => btn.classList.remove("active"))
    activeButton.previousElementSibling.classList.add("active")
    alert("이전 페이지로 이동했습니다.")
  }
}

function goToNextPage() {
  const buttons = document.querySelectorAll(".page-btn")
  const activeButton = Array.from(buttons).find((btn) => btn.classList.contains("active"))

  if (activeButton && activeButton.nextElementSibling) {
    buttons.forEach((btn) => btn.classList.remove("active"))
    activeButton.nextElementSibling.classList.add("active")
    alert("다음 페이지로 이동했습니다.")
  }
}

function goToPage(pageNum) {
  const buttons = document.querySelectorAll(".page-btn")
  buttons.forEach((btn) => btn.classList.remove("active"))
  const pageButton = Array.from(buttons).find((btn) => btn.textContent === String(pageNum))
  if (pageButton) {
    pageButton.classList.add("active")
  }
  alert(`${pageNum} 페이지로 이동했습니다.`)
}

function goToBoardFirstPage() {
  const buttons = document.querySelectorAll(".page-btn")
  buttons.forEach((btn) => btn.classList.remove("active"))
  buttons[2].classList.add("active")
  alert("첫 페이지로 이동했습니다.")
}

function goToBoardLastPage() {
  const buttons = document.querySelectorAll(".page-btn")
  buttons.forEach((btn) => btn.classList.remove("active"))
  buttons[buttons.length - 3].classList.add("active")
  alert("마지막 페이지로 이동했습니다.")
}

function goToBoardPrevPage() {
  const buttons = document.querySelectorAll(".page-btn")
  const activeButton = Array.from(buttons).find((btn) => btn.classList.contains("active"))

  if (activeButton && activeButton.previousElementSibling) {
    buttons.forEach((btn) => btn.classList.remove("active"))
    activeButton.previousElementSibling.classList.add("active")
    alert("이전 페이지로 이동했습니다.")
  }
}

function goToBoardNextPage() {
  const buttons = document.querySelectorAll(".page-btn")
  const activeButton = Array.from(buttons).find((btn) => btn.classList.contains("active"))

  if (activeButton && activeButton.nextElementSibling) {
    buttons.forEach((btn) => btn.classList.remove("active"))
    activeButton.nextElementSibling.classList.add("active")
    alert("다음 페이지로 이동했습니다.")
  }
}

function goToBoardPage(pageNum) {
  const buttons = document.querySelectorAll(".page-btn")
  buttons.forEach((btn) => btn.classList.remove("active"))
  const pageButton = Array.from(buttons).find((btn) => btn.textContent === String(pageNum))
  if (pageButton) {
    pageButton.classList.add("active")
  }
  alert(`${pageNum} 페이지로 이동했습니다.`)
}

// 모달 외부 클릭 시 닫기
document.addEventListener("click", (event) => {
  const writePostModal = document.getElementById("writePostModal")
  const deleteModal = document.getElementById("deleteModal")

  if (writePostModal && event.target === writePostModal) {
    closeWritePost()
  }
  if (deleteModal && event.target === deleteModal) {
    closeDeleteModal()
  }
})

// 이동 함수
function goToAnnouncement(postId) {
  window.location.href = `announcement-detail.html?id=${postId}`
}

function goBoardDetail(postId) {
  window.location.href = `board-detail.html?id=${postId}`
}
