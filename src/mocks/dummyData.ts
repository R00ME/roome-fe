// 알림 타입 정의
type NotificationType =
  | 'GUESTBOOK'
  | 'MUSIC_COMMENT'
  | 'HOUSE_MATE'
  | 'EVENT'
  | 'POINT';

interface Notification {
  notificationId: number;
  type: NotificationType;
  senderId: number;
  senderNickName: string;
  senderProfileImage: string;
  targetId: number;
  content?: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationResponse {
  notifications: Notification[];
  hasNext: boolean;
  nextCursor: number | null;
}

// 하우스메이트 타입 정의
type UserStatus = 'ONLINE' | 'OFFLINE';

interface Housemate {
  userId: number;
  nickname: string;
  profileImage: string;
  bio: string;
  status: UserStatus;
}

interface HousemateResponse {
  housemates: Housemate[];
  hasNext: boolean;
  nextCursor: number;
}

// 방 더미 데이터
export const dummyRooms: RoomData[] = [
  {
    roomId: 1,
    nickname: '비빔팝',
    userId: 1,
    theme: 'BASIC',
    createdAt: new Date().toISOString(),
    furnitures: [
      {
        furnitureType: 'BOOKSHELF',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
      {
        furnitureType: 'CD_RACK',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
    ],
    storageLimits: {
      maxBooks: 30,
      maxMusic: 30,
    },
    userStorage: {
      savedBooks: 10,
      savedMusic: 5,
      writtenMusicLogs: 3,
      writtenReviews: 2,
    },
    topBookGenres: ['소설', '에세이'],
    topCdGenres: ['K-POP', '클래식'],
  },
  {
    roomId: 2,
    nickname: '햄섯더',
    userId: 2,
    theme: 'FOREST',
    createdAt: new Date().toISOString(),
    furnitures: [
      {
        furnitureType: 'BOOKSHELF',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
      {
        furnitureType: 'CD_RACK',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
    ],
    storageLimits: {
      maxBooks: 30,
      maxMusic: 30,
    },
    userStorage: {
      savedBooks: 15,
      savedMusic: 8,
      writtenMusicLogs: 5,
      writtenReviews: 4,
    },
    topBookGenres: ['자기계발', '인문'],
    topCdGenres: ['재즈', '팝'],
  },
  {
    roomId: 3,
    nickname: '김비빔',
    userId: 3,
    theme: 'MARINE',
    createdAt: new Date().toISOString(),
    furnitures: [
      {
        furnitureType: 'BOOKSHELF',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
      {
        furnitureType: 'CD_RACK',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
    ],
    storageLimits: {
      maxBooks: 30,
      maxMusic: 30,
    },
    userStorage: {
      savedBooks: 20,
      savedMusic: 12,
      writtenMusicLogs: 6,
      writtenReviews: 8,
    },
    topBookGenres: ['과학', '기술'],
    topCdGenres: ['R&B', '힙합'],
  },
  {
    roomId: 4,
    nickname: '비빔인간',
    userId: 4,
    theme: 'BASIC',
    createdAt: new Date().toISOString(),
    furnitures: [
      {
        furnitureType: 'BOOKSHELF',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
      {
        furnitureType: 'CD_RACK',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
    ],
    storageLimits: {
      maxBooks: 30,
      maxMusic: 30,
    },
    userStorage: {
      savedBooks: 5,
      savedMusic: 3,
      writtenMusicLogs: 1,
      writtenReviews: 2,
    },
    topBookGenres: ['여행', '요리'],
    topCdGenres: ['발라드', 'OST'],
  },
  {
    roomId: 5,
    nickname: '최영',
    userId: 5,
    theme: 'FOREST',
    createdAt: new Date().toISOString(),
    furnitures: [
      {
        furnitureType: 'BOOKSHELF',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
      {
        furnitureType: 'CD_RACK',
        level: 1,
        isVisible: true,
        maxCapacity: 30,
      },
    ],
    storageLimits: {
      maxBooks: 30,
      maxMusic: 30,
    },
    userStorage: {
      savedBooks: 12,
      savedMusic: 15,
      writtenMusicLogs: 7,
      writtenReviews: 5,
    },
    topBookGenres: ['예술', '문화'],
    topCdGenres: ['인디', '락'],
  },
];

// 알림 더미 데이터
export const dummyNotifications: Notification[] = [
  {
    notificationId: 1,
    type: 'GUESTBOOK',
    senderId: 2,
    senderNickName: '김방명',
    senderProfileImage: 'https://example.com/avatar1.jpg',
    targetId: 1,
    content: '안녕하세요!',
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    notificationId: 2,
    type: 'MUSIC_COMMENT',
    senderId: 3,
    senderNickName: '이음악',
    senderProfileImage: 'https://example.com/avatar2.jpg',
    targetId: 5,
    content: '음악 좋네요!',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
  },
  {
    notificationId: 3,
    type: 'HOUSE_MATE',
    senderId: 4,
    senderNickName: '박친구',
    senderProfileImage: 'https://example.com/avatar3.jpg',
    targetId: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
  },
  {
    notificationId: 4,
    type: 'EVENT',
    senderId: 0,
    senderNickName: 'SYSTEM',
    senderProfileImage: '',
    targetId: 0,
    content: '이벤트 알림입니다!',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isRead: false,
  },
  {
    notificationId: 5,
    type: 'POINT',
    senderId: 0,
    senderNickName: 'SYSTEM',
    senderProfileImage: '',
    targetId: 0,
    content: '1000포인트가 지급되었습니다.',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    isRead: true,
  },
];

// 하우스메이트 더미 데이터
export const dummyHousemates: Housemate[] = [
  {
    userId: 1,
    nickname: '김철수',
    profileImage: 'https://example.com/profile1.jpg',
    bio: '안녕하세요 반갑습니다',
    status: 'ONLINE',
  },
  {
    userId: 2,
    nickname: '이영희',
    profileImage: 'https://example.com/profile2.jpg',
    bio: '책 좋아하는 사람입니다',
    status: 'OFFLINE',
  },
  {
    userId: 3,
    nickname: '박지민',
    profileImage: 'https://example.com/profile3.jpg',
    bio: '음악 감상이 취미입니다',
    status: 'ONLINE',
  },
  {
    userId: 4,
    nickname: '최영수',
    profileImage: 'https://example.com/profile4.jpg',
    bio: '여행 다니는 걸 좋아해요',
    status: 'OFFLINE',
  },
  {
    userId: 5,
    nickname: '정민지',
    profileImage: 'https://example.com/profile5.jpg',
    bio: '영화 보는 게 취미입니다',
    status: 'ONLINE',
  },
];

// API 응답 형식 맞추기
export const getDummyNotificationResponse = (
  read?: boolean,
): NotificationResponse => {
  const filtered =
    read !== undefined
      ? dummyNotifications.filter((n) => n.isRead === read)
      : dummyNotifications;

  return {
    notifications: filtered,
    hasNext: false,
    nextCursor: null,
  };
};

export const getDummyHousemateResponse = (
  type: 'followers' | 'following',
  nickname?: string,
): HousemateResponse => {
  let filtered = [...dummyHousemates];

  if (nickname) {
    filtered = filtered.filter((h) => h.nickname.includes(nickname));
  }

  return {
    housemates: filtered,
    hasNext: false,
    nextCursor: 0,
  };
};

// 사용자별 잠금 해제된 테마
export const userUnlockedThemes: { [key: number]: string[] } = {
  1: ['BASIC', 'FOREST', 'MARINE'],
  2: ['BASIC', 'FOREST'],
  3: ['BASIC', 'MARINE'],
  4: ['BASIC'],
  5: ['BASIC', 'FOREST'],
};
