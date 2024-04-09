import React, { useEffect, useState } from 'react'
import './toggle.css'
import type { Option } from '../types/option'
import { getOption, setOption } from '../scripts/utils/options/option_handler'

const changeHandler = async (id: keyof Option, checked: boolean): Promise<void> => {
  await setOption(id, checked)
}

function Toggle ({ id }: { id: keyof Option }): JSX.Element {
  const [checked, setChecked] = useState<boolean>(false)

  useEffect(() => {
    void getOption()
      .then(res => { setChecked(res[id]) })
  })

  return (
    <input
      role='switch'
      type='checkbox'
      checked={checked}
      onChange={() => {
        const newChecked = !checked
        setChecked(newChecked)
        void changeHandler(id, newChecked)
      }}
    />
  )
}

export default Toggle
