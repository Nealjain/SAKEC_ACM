import { useEffect } from 'react'

export function useCopyProtection() {
  useEffect(() => {
    const scrambleText = (text: string): string => {
      const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
      return text
        .split('')
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('')
    }

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      const selection = window.getSelection()
      if (selection) {
        const originalText = selection.toString()
        const scrambledText = scrambleText(originalText)
        
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', scrambledText)
        }
      }
    }

    document.addEventListener('copy', handleCopy)

    return () => {
      document.removeEventListener('copy', handleCopy)
    }
  }, [])
}
