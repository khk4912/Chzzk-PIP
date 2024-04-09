import React from 'react'

import type { OptionProp } from '../types/prop'
import type { OptionInfo } from '../types/option'
import Toggle from './toggle'

const Info: OptionInfo = {
  pip: {
    name: 'PIP',
    desc: '영상의 오른쪽 하단에 PIP 버튼을 추가합니다.'
  },
  rec: {
    name: '녹화',
    desc: '영상의 오른쪽 하단에 녹화 버튼을 추가합니다.'
  },
  fastRec: {
    name: '빠른 녹화 저장',
    desc: '녹화가 종료되면 webm 파일을 결과창 표시 없이 즉시 다운로드합니다.'
  },
  seek: {
    name: '방향키 탐색',
    desc: '시청 중 방향키를 이용해 5초씩 앞뒤로 이동할 수 있습니다.'
  },
  screenshot: {
    name: '스크린샷',
    desc: '영상의 오른쪽 하단에 스크린샷 버튼을 추가합니다.'
  },
  screenshotPreview: {
    name: '스크린샷 미리보기',
    desc: '스크린샷을 찍은 후 미리보기를 표시하고, 저장 여부를 선택할 수 있습니다.'
  },
  highFrameRateRec: {
    name: '고프레임 녹화(베타)',
    desc: '스트림이 60fps로 송출되고 있을 경우, 60fps로 녹화를 시도합니다.\n(구현 방식의 한계로, 빠른 저장 기능이 작동되지 않습니다.)'
  }
}

const Option = ({ name }: OptionProp): JSX.Element => (

  <div className='item'>
    <div className='item-name'>
      <span>{Info[name].name}</span>
      <span className='desc'>{Info[name].desc}</span>
    </div>
    <Toggle
      id={name}
    />
  </div>
)

export default Option
