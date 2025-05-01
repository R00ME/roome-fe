import { notificationAPI as originalNotificationAPI } from '@apis/notification';
import { housemateAPI as originalHousemateAPI } from '@apis/housemate';
import { roomAPI as originalRoomAPI } from '@apis/room';
import {
  getDummyNotificationResponse,
  dummyRooms,
  userUnlockedThemes,
} from './dummyData';

// 오리지널 API 객체 백업
export const originalAPIs = {
  notification: { ...originalNotificationAPI },
  housemate: { ...originalHousemateAPI },
  room: { ...originalRoomAPI },
};

// notificationAPI 모킹
export const mockNotificationAPI = {
  ...originalNotificationAPI,

  getNotifications: async (
    _userId: number,
    cursor?: number,
    limit: number = 20,
    read?: boolean,
  ) => {
    const startIndex = cursor || 0;
    const response = getDummyNotificationResponse(read);

    const paginatedNotifications = response.notifications.slice(
      startIndex,
      startIndex + limit,
    );
    const hasNext = startIndex + limit < response.notifications.length;

    return {
      notifications: paginatedNotifications,
      hasNext,
      nextCursor: hasNext ? startIndex + limit : null,
    };
  },

  readNotification: async (notificationId: number) => {
    console.log(`Mock: 알림 ${notificationId} 읽음 처리`);
    return { success: true };
  },
};

// housemateAPI 모킹
export const mockHousemateAPI = {
  ...originalHousemateAPI,

  getFollowing: async (
    cursor?: number,
    limit: number = 20,
    nickname?: string,
  ) => {
    console.log('Mock: getFollowing 호출됨', { cursor, limit, nickname });

    let following = dummyRooms.slice(1, 4).map((room) => ({
      userId: room.userId,
      nickname: room.nickname,
      profileImage: 'https://example.com/avatar.jpg',
      bio: '안녕하세요!',
      status: 'ONLINE',
    }));

    if (nickname) {
      following = following.filter((user) =>
        user.nickname.toLowerCase().includes(nickname.toLowerCase()),
      );
    }

    const startIndex = cursor || 0;
    const paginatedHousemates = following.slice(startIndex, startIndex + limit);
    const hasNext = startIndex + limit < following.length;

    return {
      housemates: paginatedHousemates,
      hasNext,
      nextCursor: hasNext ? startIndex + limit : 0,
    };
  },

  getFollowers: async (
    cursor?: number,
    limit: number = 20,
    nickname?: string,
  ) => {
    console.log('Mock: getFollowers 호출됨', { cursor, limit, nickname });

    let followers = dummyRooms.slice(2, 5).map((room) => ({
      userId: room.userId,
      nickname: room.nickname,
      profileImage: 'https://example.com/avatar.jpg',
      bio: '반갑습니다!',
      status: 'ONLINE',
    }));

    if (nickname) {
      followers = followers.filter((user) =>
        user.nickname.toLowerCase().includes(nickname.toLowerCase()),
      );
    }

    const startIndex = cursor || 0;
    const paginatedHousemates = followers.slice(startIndex, startIndex + limit);
    const hasNext = startIndex + limit < followers.length;

    return {
      housemates: paginatedHousemates,
      hasNext,
      nextCursor: hasNext ? startIndex + limit : 0,
    };
  },

  followHousemate: async (targetId: number) => {
    console.log(`Mock: 하우스메이트 ${targetId} 팔로우`);
    return { success: true };
  },

  unfollowHousemate: async (targetId: number) => {
    console.log(`Mock: 하우스메이트 ${targetId} 언팔로우`);
    return { success: true };
  },
};

// roomAPI 모킹
export const mockRoomAPI = {
  ...originalRoomAPI,

  getRoomById: async (userId: number) => {
    console.log('Mock: getRoomById 호출됨, userId:', userId);
    const room = dummyRooms.find((room) => room.userId === userId);
    if (!room) {
      throw new Error(`방을 찾을 수 없습니다. (userId: ${userId})`);
    }
    return room;
  },

  updateRoomTheme: async (
    roomId: number,
    userId: number,
    themeName: string,
  ) => {
    console.log(`Mock: 방 ${roomId}의 테마를 ${themeName}로 변경`);
    const room = dummyRooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    room.theme = themeName;
    return { success: true };
  },

  updateRoomFurniture: async (
    roomId: number,
    userId: number,
    furnitureType: string,
  ) => {
    console.log(`Mock: 방 ${roomId}의 가구 ${furnitureType} 설정 변경`);
    const room = dummyRooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    return { success: true };
  },

  getUnlockThemes: async (userId: number) => {
    console.log('Mock: getUnlockThemes 호출됨, userId:', userId);
    return userUnlockedThemes[userId] || ['BASIC'];
  },

  purchaseThemes: async (roomId: number, themeName: string) => {
    console.log(`Mock: 방 ${roomId}의 테마 ${themeName} 구매`);
    const room = dummyRooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    if (userUnlockedThemes[room.userId]) {
      userUnlockedThemes[room.userId].push(themeName);
    } else {
      userUnlockedThemes[room.userId] = [themeName];
    }
    return { success: true };
  },
};

// API 변경 함수
export const enableMockAPIs = () => {
  // API 객체 교체
  Object.assign(originalNotificationAPI, mockNotificationAPI);
  Object.assign(originalHousemateAPI, mockHousemateAPI);
  Object.assign(originalRoomAPI, mockRoomAPI);
  console.log('🔧 Mock APIs 활성화됨');
};

// 원래 API로 복구 함수
export const restoreOriginalAPIs = () => {
  Object.assign(originalNotificationAPI, originalAPIs.notification);
  Object.assign(originalHousemateAPI, originalAPIs.housemate);
  Object.assign(originalRoomAPI, originalAPIs.room);
  console.log('🔄 Original APIs 복구됨');
};
