import style from './Header.module.css'
import logo from '@/assets/logos/logo.png'

/**
 * Header component
 *
 * Popup 페이지의 상단에 위치하는 헤더 컴포넌트입니다.
 */
export function Header (): React.ReactNode {
  return (
    <div className={style.header}>
      <img id={style.logoImg} src={logo} alt='Cheese-PIP 로고' />
      <span id={style.logo}>Cheese-PIP</span>
      <span id={style.desc}>변경된 설정은 치지직을 새로고침해야 적용됩니다.</span>
    </div>

  )
}
