import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik'

export const ThemeToggle = component$(() => {
  const isDark = useSignal(true)

  const applyTheme = $((dark: boolean) => {
    if (dark) {
      document.documentElement.style.setProperty('color-scheme', 'dark')
      document.body.classList.remove('light-theme')
      document.body.classList.add('dark-theme')
    } else {
      document.documentElement.style.setProperty('color-scheme', 'light') 
      document.body.classList.remove('dark-theme')
      document.body.classList.add('light-theme')
    }
  })

  useVisibleTask$(async () => {
    // Check if user has a preference in localStorage
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = prefersDark
    }
    
    // Apply the theme
    await applyTheme(isDark.value)
  })

  const toggleTheme = $(async () => {
    isDark.value = !isDark.value
    await applyTheme(isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  })

  return (
    <button
      onClick$={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '1000',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '2px solid var(--card-border)',
        background: 'var(--card-background)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        transition: 'var(--transition)',
        boxShadow: 'var(--shadow-soft)'
      }}
      title={isDark.value ? '切换到浅色模式' : '切换到深色模式'}
    >
      {isDark.value ? '🌞' : '🌙'}
    </button>
  )
})