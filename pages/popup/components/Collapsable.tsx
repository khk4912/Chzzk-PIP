import { useState } from 'react'
import style from './Collapsable.module.css'

export function Collapsable ({ title, desc, children }: { title: string, desc: string, children: React.ReactNode }): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={style.collapsable}>
      <div className={style.title} onClick={() => { setIsOpen((x) => !x) }}>
        <div
          className={style.arrow}
          style={{
            color: isOpen ? 'gray' : undefined
          }}
        >
          {isOpen ? '▼' : '▶'}
          <span id={style.title}>
            {title}
          </span>
        </div>
        {!isOpen && <span id={style.desc}>{desc}</span>}
      </div>
      <div className={style.content}>
        {isOpen && children}
      </div>
    </div>
  )
}
