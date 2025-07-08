export type ApifyInstagramPost = {
  id: string;
  type: string;
  shortCode: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  url: string;
  commentsCount: number;
  dimensionsHeight: number;
  dimensionsWidth: number;
  displayUrl: string;
  images: string[];
  alt: string;
  likesCount: number;
  timestamp: string;
  childPosts: ApifyInstagramPost[];
  ownerUsername: string;
  ownerId: string;
  isCommentsDisabled: boolean;
};

export interface ApifyInstagramProfileResult {
  latestPosts?: ApifyInstagramPost[];
  profilePicUrlHD?: string;
  profilePicUrl?: string;
  username?: string;
  url?: string;
  biography?: string;
  followersCount?: number;
  followsCount?: number;
  fullName?: string;
}
