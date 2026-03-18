import { ref, onMounted } from 'vue'

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme')
    if (typeof storedPrefs === 'string' && (storedPrefs === 'light' || storedPrefs === 'dark')) {
      return storedPrefs
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)')
    if (userMedia.matches) {
      return 'dark'
    }
  }

  return 'light'
}

const theme = ref<'light' | 'dark'>(getInitialTheme())

const applyTheme = (newTheme: 'light' | 'dark') => {
  theme.value = newTheme;
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('sl-theme-dark');
    document.body.classList.remove('sl-theme-light');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.add('sl-theme-light');
    document.body.classList.remove('sl-theme-dark');
  }
  localStorage.setItem('theme', newTheme);
}

const toggleTheme = () => {
  applyTheme(theme.value === 'light' ? 'dark' : 'light');
}

const initTheme = () => {
  applyTheme(getInitialTheme());
}

export const useTheme = () => {
  return {
    theme,
    toggleTheme,
    initTheme,
    applyTheme
  }
}
