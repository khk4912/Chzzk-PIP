import { DEFAULT_OPTIONS } from '../types/options'
import { getOption } from '../types/options'

export function useOptions () {
  const [options, setOptions] = useState<typeof DEFAULT_OPTIONS>(DEFAULT_OPTIONS)

  useEffect(() => {
    getOption()
      .then(setOptions)
      .catch(console.error)
  }, [])

  return { options }
}
