import style from './Header.module.css'
import logo from '../../../logos/logo.png'

export function Header (): React.ReactNode {
  return (

    <div className={style.header}>
      <img id={style.logoImg} src={logo} alt='Chzzk-PIP 로고' />
      <span id={style.logo}>Chzzk-PIP</span>
      <span id={style.desc}>변경된 설정은 치지직을 새로고침해야 적용됩니다.</span>
    </div>

  )
}
