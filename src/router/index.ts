import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
        {
            path: '/explore',
            name: 'explore',
            component: () => import('../views/ExploreAnime.vue'),
        },
		{
			path: '/season',
			name: 'season',
			component: () => import('../views/SeasonalAnime.vue'),
		},
		{
			path: '/anime/:id',
			name: 'anime',
			component: () => import('../views/ViewAnime.vue'),
		},
        { 
            path: '/studio/:id',   
            name: 'studio',
            component: () => import('../views/ViewEntity.vue'),
            props: r => ({ type: 'studio' }) 
        },
        {
            path: '/producer/:id',
            name: 'producer',
            component: () => import('../views/ViewEntity.vue'),
            props: r => ({type: 'producer' })
        },
        {
            path: '/licensor/:id',
            name: 'licensor',
            component: () => import('../views/ViewEntity.vue'),
            props: r => ({ type: 'licensor' })
        },
		{
			path: '/profile/:id',
			name: 'profile',
			component: () => import('../views/ViewProfile.vue'),
		},
		{
			path: '/users',
			name: 'users',
			component: () => import('../views/ExploreUsers.vue'),
		},
		{
			path: '/auth/google/login',
			name: 'login',
			component: {},
			beforeEnter: () => {
				window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`
				return false
			}
		},
		{
			path: '/logout',
			name: 'logout',
			component: {},
			beforeEnter: () => {
				window.location.href = `${import.meta.env.VITE_API_URL}/auth/logout`
				return false
			}
		}
	],
})

export default router
