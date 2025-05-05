import { useModal } from './Modal'

function Footer () {
  const { openModal } = useModal()

  const handleCopyrightClick = () => {
    openModal(
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2>저작권 정보</h2>
        <p>이 프로젝트는 개인 학습 및 연구 목적으로 제작되었습니다.</p>
        <button onClick={() => openModal(null)}>닫기</button>
      </div>
    )
  }

  return (
    <footer style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f1f1f1' }}>
      <a href='https://github.com/khk4912' target='_blank' rel='noopener noreferrer'>GitHub</a> |
      <a href='mailto:khk4912@example.com'>문의</a> |
      <button onClick={handleCopyrightClick} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
        저작권
      </button>
    </footer>
  )
}

export default Footer
