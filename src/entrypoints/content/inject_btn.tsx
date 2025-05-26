import { createRoot, type Root } from 'react-dom/client'
import { useEffect, useRef } from 'react' // Added for NavigationAwareInjector
import { InjectButtons } from './portal_handler'
import { usePageNavigate } from '@/hooks/usePageNavigate' // Import the new hook

export const waitForElement = async (querySelector: string): Promise<Element> => {
  return await new Promise((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector(querySelector)
      if (element !== null) {
        clearInterval(interval)
        resolve(element)
      }
    }, 100)
  })
}

/**
 * Helper function to create and render React content into a target element.
 * @param node The React node to render.
 * @param target The HTML element to render into.
 * @returns The created React Root instance.
 */
function renderReactContent (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)
  return root
}

/**
 * @component NavigationAwareInjector
 * @description This component is responsible for managing the lifecycle of `InjectButtons`.
 * It uses `usePageNavigate` to detect page navigations and then unmounts, removes the old container,
 * creates a new container, and re-renders `InjectButtons` into the new container.
 * This ensures that `InjectButtons` are correctly re-injected on SPA navigations.
 */
function NavigationAwareInjector (): null { // This component does not render anything itself
  const buttonsContainerRef = useRef<HTMLDivElement | null>(null)
  const reactRootRef = useRef<Root | null>(null)

  const mountButtons = () => {
    // Ensure previous instances are cleaned up (though usePageNavigate should prevent overlap)
    if (reactRootRef.current) {
      reactRootRef.current.unmount()
    }
    if (buttonsContainerRef.current) {
      buttonsContainerRef.current.remove()
    }

    // Create new container and root
    const newDiv = document.createElement('div')
    newDiv.id = 'cheese-pip-buttons' // The ID for the div that InjectButtons populates
    // TODO: Determine the correct parent for newDiv. Using document.body for now.
    // This might need to be more specific, e.g., waiting for a player element.
    // For now, document.body is a placeholder.
    document.body.appendChild(newDiv)
    buttonsContainerRef.current = newDiv

    const newRoot = renderReactContent(<InjectButtons />, newDiv)
    reactRootRef.current = newRoot
  }

  // Initial mount
  useEffect(() => {
    mountButtons()

    // Cleanup on component unmount (though this component might live for the page's lifetime)
    return () => {
      if (reactRootRef.current) {
        reactRootRef.current.unmount()
      }
      if (buttonsContainerRef.current) {
        buttonsContainerRef.current.remove()
      }
    }
  }, []) // Runs once on mount

  // Handle navigations
  usePageNavigate(mountButtons)

  return null // This component manages DOM elsewhere, doesn't render UI itself
}

/**
 * Injects the main application component (`NavigationAwareInjector`) into the page.
 * This function ensures that the injection happens only once.
 */
export function injectButton () {
  const appContainerId = 'cheese-pip-app-container'
  if (document.getElementById(appContainerId)) {
    // Already injected
    return
  }

  const appContainer = document.createElement('div')
  appContainer.id = appContainerId
  document.body.appendChild(appContainer)

  // Render the NavigationAwareInjector, which will handle creating/managing 'cheese-pip-buttons' div
  renderReactContent(<NavigationAwareInjector />, appContainer)
}

// The old 'inject' function is renamed to 'renderReactContent' and is now local.
// If it was intended for export for other uses, it can be exported again.
// export function inject (node: React.ReactNode, target: HTMLElement): Root {
//   const root = createRoot(target)
//   root.render(node)
//   return root
// }
