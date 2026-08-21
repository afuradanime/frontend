import { ref } from 'vue'

const getInitialNavigation = (): 'sidebar' | 'topbar' => {
  if (typeof window !== 'undefined' && window.localStorage) {
	const storedPrefs = window.localStorage.getItem('navigation')
	if (typeof storedPrefs === 'string' && (storedPrefs === 'sidebar' || storedPrefs === 'topbar')) {
	  return storedPrefs
	}

	const userMedia = window.matchMedia('(prefers-navigation-style: sidebar)')
	if (userMedia.matches) {
	  return 'sidebar'
	}
  }

  return 'topbar'
}

const navigation = ref<'sidebar' | 'topbar'>(getInitialNavigation())

const applyNavigation = (newNavigation: 'sidebar' | 'topbar') => {
	navigation.value = newNavigation;
	if (newNavigation === 'topbar') {
		document.documentElement.classList.add('topbar');
	} else {
		document.documentElement.classList.remove('topbar');
	}
	localStorage.setItem('navigation', newNavigation);
}

const toggleNavigation = () => {
	applyNavigation(navigation.value === 'sidebar' ? 'topbar' : 'sidebar');
}

const initNavigation = () => {
	applyNavigation(getInitialNavigation());
}

export const useNavigation = () => {
	return {
		navigation,
		toggleNavigation,
		initNavigation,
		applyNavigation,
	}
}
