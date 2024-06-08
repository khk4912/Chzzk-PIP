export interface Video {
  code: number
  message: any
  content: {
    videoNo: number
    videoId: string
    videoTitle: string
    videoType: string
    publishDate: string
    thumbnailImageUrl: string
    trailerUrl: any
    duration: number
    readCount: number
    publishDateAt: number
    categoryType: string
    videoCategory: string
    videoCategoryValue: string
    exposure: boolean
    adult: boolean
    channel: {
      channelId: string
      channelName: string
      channelImageUrl: string
      verifiedMark: boolean
    }
    paidPromotion: boolean
    inKey: string
    liveOpenDate: string
    vodStatus: string
    prevVideo: {
      videoNo: number
      videoId: string
      videoTitle: string
      videoType: string
      publishDate: string
      thumbnailImageUrl: string
      trailerUrl: string
      duration: number
      readCount: number
      publishDateAt: number
      categoryType: string
      videoCategory: string
      videoCategoryValue: string
      exposure: boolean
      adult: boolean
      channel: {
        channelId: string
        channelName: string
        channelImageUrl: string
        verifiedMark: boolean
      }
    }
    nextVideo: {
      videoNo: number
      videoId: string
      videoTitle: string
      videoType: string
      publishDate: string
      thumbnailImageUrl: string
      trailerUrl: string
      duration: number
      readCount: number
      publishDateAt: number
      categoryType: string
      videoCategory: string
      videoCategoryValue: string
      exposure: boolean
      adult: boolean
      channel: {
        channelId: string
        channelName: string
        channelImageUrl: string
        verifiedMark: boolean
      }
    }
    userAdultStatus: any
  }
}

export interface VideoInfo {
  videoTitle: string
  inKey: string
  videoID: string
  thumbnailURL: string
}

export interface ContentInfo {
  contentTitle: string
  inKey: string
  contentID: string
}
interface ClipOwnerChannel {
  channelId: string
  channelName: string
  channelImageUrl: string
  verifiedMark: boolean
}

interface ClipContent {
  contentType: string
  contentId: number
  videoId: string
  vodStatus: string
  contentTitle: string
  adult: boolean
  inKey: string
  userAdultStatus: string
  ownerChannel: ClipOwnerChannel
}

export interface Clip {
  code: number
  message: string | null
  content: ClipContent
}

export interface PlayBackURL {
  resolution: number
  fps: number
  url: string
}
