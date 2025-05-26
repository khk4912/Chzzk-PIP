interface BooleanOptions {
  pip?: boolean
  rec?: boolean
  fastRec?: boolean
  seek?: boolean
  screenshot?: boolean
  screenshotPreview?: boolean
  highFrameRateRec?: boolean
  preferMP4?: boolean
  preferHQ?: boolean
  autoPIP?: boolean
  favorites?: boolean
}

export interface OtherOptions {
  videoBitsPerSecond?: number
}

export interface Option extends BooleanOptions, OtherOptions { }
export const DEFAULT_OPTIONS: Required<Option> = {
  pip: false,
  rec: true,
  fastRec: false,
  seek: false,
  screenshot: true,
  screenshotPreview: true,
  highFrameRateRec: false,
  preferMP4: false,
  videoBitsPerSecond: 4000000,
  preferHQ: false,
  autoPIP: true,
  favorites: false
}

export interface KeyBindings {
  rec?: string
  screenshot?: string
  pip?: string
}

export const DEFAULT_KEYBINDINGS: Required<KeyBindings> = {
  rec: 'R',
  screenshot: 'S',
  pip: 'P'
}

export const getOption = async (): Promise<Required<Option>> => {
  try {
    const option = ((await chrome.storage.local.get('option'))?.option ?? {}) as Option
    const result = { ...DEFAULT_OPTIONS }

    for (const key in option) {
      if (key in DEFAULT_OPTIONS) {
        const k = key as keyof Option
        Object.assign(result, { [k]: option[k] })
      }
    }

    return result
  } catch (error) {
    console.error('Failed to get options:', error)
    return { ...DEFAULT_OPTIONS } // Return default on error
  }
}

export const setOption = async <T extends keyof Option>(option: T, value: NonNullable<Option[T]>): Promise<void> => {
  try {
    const options = ((await chrome.storage.local.get('option'))?.option ?? {}) as Option
    options[option] = value

    await chrome.storage.local.set({ option: options })
  } catch (error) {
    console.error('Failed to set option:', error)
    throw error // Re-throw to allow caller to handle if needed
  }
}

export const getKeyBindings = async (): Promise<Required<KeyBindings>> => {
  try {
    const keyBindings = ((await chrome.storage.local.get('keyBindings'))?.keyBindings ?? {}) as KeyBindings
    const result = { ...DEFAULT_KEYBINDINGS }

    for (const key in keyBindings) {
      if (key in DEFAULT_KEYBINDINGS) {
        const k = key as keyof KeyBindings
        Object.assign(result, { [k]: keyBindings[k] })
      }
    }

    return result
  } catch (error) {
    console.error('Failed to get key bindings:', error)
    return { ...DEFAULT_KEYBINDINGS } // Return default on error
  }
}

export const setKeyBindings = async <T extends keyof KeyBindings>(key: T, value: NonNullable<KeyBindings[T]>): Promise<void> => {
  try {
    const keyBindings = ((await chrome.storage.local.get('keyBindings'))?.keyBindings ?? {}) as KeyBindings
    keyBindings[key] = value

    await chrome.storage.local.set({ keyBindings })
  } catch (error) {
    console.error('Failed to set key binding:', error)
    throw error // Re-throw
  }
}

export interface FavoritesList {
  favorites: Set<string>
}

export const getFavorites = async (): Promise<Set<string>> => {
  try {
    const { favorites } = (await chrome.storage.local.get('favorites')) as FavoritesList
    return favorites ? new Set(favorites) : new Set<string>()
  } catch (error) {
    console.error('Failed to get favorites:', error)
    return new Set<string>() // Return empty set on error
  }
}

export const addFavorite = async (channel: string): Promise<void> => {
  try {
    const favorites = await getFavorites() // Relies on getFavorites' error handling
    favorites.add(channel)

    await chrome.storage.local.set({ favorites: Array.from(favorites) })
  } catch (error) {
    console.error('Failed to add favorite:', error)
    throw error // Re-throw
  }
}

export const removeFavorite = async (channel: string): Promise<void> => {
  try {
    const favorites = await getFavorites() // Relies on getFavorites' error handling
    favorites.delete(channel)

    await chrome.storage.local.set({ favorites: Array.from(favorites) })
  } catch (error) {
    console.error('Failed to remove favorite:', error)
    throw error // Re-throw
  }
}

// Removed original content as it's being replaced by the try/catch wrapped versions above.
// This diff block is just to make the tool replace the entire section.
