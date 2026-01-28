// 게시물 데이터
export const postsData = {
  notice: {
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
  free: {
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
};

let commentIdCounter = 3;

export const getCommentIdCounter = () => commentIdCounter++;
export const setCommentIdCounter = (value) => { commentIdCounter = value; };

