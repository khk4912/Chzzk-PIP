import type { RecordInfo } from '../../../types/record_info'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkRecordInfo = (x: any): x is RecordInfo => {
  if (!(typeof x.startDateTime === 'number' &&
    typeof x.resultBlobURL === 'string' &&
    typeof x.streamInfo === 'object')
  ) {
    return false
  }

  return true
}

const DEFAULT_RECORD_INFO: RecordInfo = {
  startDateTime: -1,
  stopDateTime: -1,
  resultBlobURL: 'string',
  streamInfo: {
    streamerName: '?',
    streamTitle: '?'
  }
}

export const setRecordInfo = async (info: RecordInfo): Promise<void> => {
  await chrome.storage.local.set({ recordInfo: info })
}

export const getRecordInfo = async (): Promise<RecordInfo> => {
  const data = await chrome.storage.local.get('recordInfo')

  if (typeof data.recordInfo !== 'object') {
    console.error('recordInfo is corrupted!')
    return DEFAULT_RECORD_INFO
  }
  const recordInfo = data.recordInfo

  // Check if data is RecordInfo
  if (!checkRecordInfo(recordInfo)) {
    console.error('recordInfo is corrupted!')
    return DEFAULT_RECORD_INFO
  }

  return recordInfo
}

export const setTempBlobURL = async (url: string): Promise<void> => {
  await chrome.storage.local.set({ tempBlobURL: url })
}

export const getTempBlobURL = async (): Promise<string> => {
  const { tempBlobURL } = await chrome.storage.local.get('tempBlobURL') as { tempBlobURL: string }
  return tempBlobURL
}
