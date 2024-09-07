import { Header } from './components/Header'
import { OptionView } from './components/OptionView'
import Option from './components/Option'
import './style.css'
import { Collapsable } from './components/Collapsable'

export default function App (): React.ReactNode {
  return (
    <div>
      <Header />
      <OptionView>
        <Option>
          <Option.Header title='녹화' desc='방송 화면에 녹화 버튼을 추가합니다.' />
          <Option.CheckButton optionID='rec' />
        </Option>
        <Option>
          <Option.Header title='스크린샷' desc='방송 화면에 스크린샷 버튼을 추가합니다.' />
          <Option.CheckButton optionID='screenshot' />
        </Option>
        <Option>
          <Option.Header title='방향키 탐색' desc='방향키를 이용하여 방송의 이전 내용으로 돌아갈 수 있습니다.' />
          <Option.CheckButton optionID='seek' />
        </Option>
        <Option>
          <Option.Header title='영상 빠른 저장' desc='영상 녹화 완료 페이지 표시 없이 즉시 녹화 파일을 저장합니다.' />
          <Option.CheckButton optionID='fastRec' />
        </Option>
        <Option>
          <Option.Header
            title='스크린샷 미리보기'
            desc='스크린샷 촬영 후 미리보기를 사용합니다.
                  (미리보기를 사용하지 않으면 촬영한 스크린샷은 즉시 저장됩니다.)'
          />
          <Option.CheckButton optionID='screenshotPreview' />
        </Option>
        <Option>
          <Option.Header title='PIP' desc='방송 화면에 PIP 버튼을 추가합니다.' />
          <Option.CheckButton optionID='pip' />
        </Option>
        <Collapsable
          title='고급 옵션'
          desc='확장 프로그램의 작동 방식에 큰 변화를 주는 옵션들입니다.
                이 옵션들을 변경하면 오류가 발생할 수 있습니다.
                옵션을 변경한 후 정상적으로 작동하는지 확인해주세요.'
        >
          <Option>
            <Option.Header
              title='MP4 선호'
              desc='영상 녹화 시 브라우저가 지원하는 경우 MP4(AAC)로 녹화합니다.'
            />
            <Option.CheckButton optionID='preferMP4' />
          </Option>
          <Option>
            <Option.Header
              title='고프레임 녹화'
              desc='영상 녹화 시 최대 60fps로 녹화합니다.'
            />
            <Option.CheckButton optionID='highFrameRateRec' />
          </Option>

          <Option>
            <Option.Header
              title='녹화 비트레이트'
              desc='녹화 시 사용할 비트레이트를 설정합니다.
                    단위는 bps(초당 비트)입니다.

                    (기본값: 8000000)'
            />
            <Option.NumberInput optionID='videoBitsPerSecond' />
          </Option>
        </Collapsable>
      </OptionView>
    </div>
  )
}
