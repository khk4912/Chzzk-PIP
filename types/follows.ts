export interface FollowApiResponse {
  code: number
  message: string | null
  content: Content
}

export interface LiveInfo {
  liveTitle: string | null
  concurrentUserCount: number
  liveCategoryValue: string
}

interface Streamer {
  openLive: boolean
}

interface PersonalData {
  following: {
    following: boolean
    notification: boolean
    followDate: string
  }
  privateUserBlock: boolean
}

interface Channel {
  channelId: string
  channelName: string
  channelImageUrl: string | null
  verifiedMark: boolean
  activatedChannelBadgeIds: string[]
  personalData: PersonalData
}

export interface FollowingItem {
  channelId: string
  channel: Channel
  streamer: Streamer
  liveInfo: LiveInfo
}

interface Content {
  totalCount: number
  totalPage: number
  followingList: FollowingItem[]
}
