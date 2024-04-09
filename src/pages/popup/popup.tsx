import React from 'react'
import { createRoot } from 'react-dom/client'

import './popup.css'
import Logo from '../../../public/logos/logo.png'
import Option from '../../components/option'

const Header = (): JSX.Element => (
  <div className='header'>
    <img
      src={Logo}
      alt='Chzzk-PIP 로고'
      id='logo_img'
    />
    <h2>Chzzk-PIP</h2>
    <span>변경한 설정은 치지직을 새로고침해야 적용됩니다.</span>
  </div>
)

const Options = (): JSX.Element => {
  return (
    <div className='options'>
      <Option name='rec' />
      <Option name='fastRec' />
      <Option name='seek' />
      <Option name='screenshot' />
      <Option name='screenshotPreview' />
      <Option name='highFrameRateRec' />
      <Option name='pip' />
    </div>
  )
}

function Popup (): JSX.Element {
  return (
    <>
      <Header />
      <Options />
    </>
  )
}

const root = document.getElementById('root')
if (root !== null) {
  createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  )
}
