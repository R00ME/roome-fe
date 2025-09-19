interface UserProfile {
  id: string;
  userId: string;
  nickname: string;
  profileImage: string;
  bio: string;
  musicGenres: string[];
  bookGenres: string[];
  myProfile: boolean;
  isFollowing: boolean;
}

interface RecommendedUser {
  userId: string;
  nickname: string;
  profileImage: string;
}

interface GenreCardProps {
  title: '음악 감성' | '독서 취향' | '취향 키워드';
  genres: string[];
}

interface ProfileButtonsProps {
  userId: string;
  isMyProfile: boolean;
  isFollowing: boolean;
  onProfileUpdate?: () => void;
}

interface UserProfileResponse {
  id: string;
  nickname: string;
  profileImage: string;
  bio: string;
  musicGenres: string[];
  bookGenres: string[];
  recommendedUsers: RecommendedUser[];
  myProfile: boolean;
  isFollowing: boolean;
}

interface ProfileSectionProps {
  profile: Pick<UserProfileResponse, 'nickname' | 'profileImage' | 'bio'>;
}

interface GenreCardProps {
  title: string;
  genres: string[];
}

interface RecommendedUserListProps {
  users: RecommendedUser[];
}

interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  musicGenres?: string[];
  bookGenres?: string[];
}

interface UserProfileResponse {
  id: string;
  nickname: string;
  profileImage: string;
  bio: string;
  musicGenres: string[];
  bookGenres: string[];
  recommendedUsers?: {
    userId: number;
    nickname: string;
    profileImage: string;
  }[];
  following: boolean;
  myProfile: boolean;
}
