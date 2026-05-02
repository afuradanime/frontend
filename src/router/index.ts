import { useWelcome } from '@/composables/welcome'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../pages/Homepage.vue')
        },
        {
            path: '/explore',
            name: 'explore',
            component: () => import('../pages/ExploreAnime.vue'),
        },
		{
			path: '/season',
			name: 'season',
			component: () => import('../pages/SeasonalAnime.vue'),
		},
        {
			path: '/top',
			name: 'top',
			component: () => import('../pages/TopAnime.vue'),
		},
        {
			path: '/popular',
			name: 'popular',
			component: () => import('../pages/PopularAnime.vue'),
		},
		{
			path: '/anime/:id',
			name: 'anime',
			component: () => import('../pages/ViewAnime.vue'),
		},
        { 
            path: '/anime/random', 
            component: () => import('@/pages/RandomAnime.vue') 
        },
        { 
            path: '/tag/:id', 
            name: 'tag',
            component: () => import('@/pages/ExploreAnimeByTag.vue') 
        },
        { 
            path: '/genres', 
            name: 'genres',
            component: () => import('@/pages/ExploreTags.vue') 
        },
        { 
            path: '/studio/:id',   
            name: 'studio',
            component: () => import('../pages/ViewEntity.vue'),
            props: r => ({ type: 'studio' }) 
        },
        {
            path: '/producer/:id',
            name: 'producer',
            component: () => import('../pages/ViewEntity.vue'),
            props: r => ({type: 'producer' })
        },
        {
            path: '/licensor/:id',
            name: 'licensor',
            component: () => import('../pages/ViewEntity.vue'),
            props: r => ({ type: 'licensor' })
        },
		{
			path: '/profile/:id',
			name: 'profile',
			component: () => import('../pages/ViewProfile.vue'),
		},
        {
			path: '/friends/pending',
			name: 'pending_friends',
			component: () => import('../pages/PendingRequests.vue'),
		},
        {
			path: '/recommendations',
			name: 'recommendations',
			component: () => import('../pages/ViewRecommendations.vue')
		},
		{
			path: '/users',
			name: 'users',
			component: () => import('../pages/ExploreUsers.vue'),
		},
        { 
            path: '/post/:id', 
            name: 'post', 
            component: () => import('@/pages/ViewPost.vue') 
        },
        {
            path: '/moderation',
            name: 'moderation',
            component: () => import('../pages/Moderation/ViewModeration.vue')
        },
        {
            path: '/moderation/translations',
            name: 'translations',
            component: () => import('../pages/Moderation/PendingTranslations.vue')
        },
        {
            path: '/moderation/reports',
            name: 'reports',
            component: () => import('@/pages/Moderation/ViewReports.vue'),
        },
        {
            path: '/moderation/reports/user/:userID',
            name: 'user reports',
            component: () => import('@/pages/Moderation/ViewUserReports.vue'),
        },
        {
            path: '/moderation/users/:id',
            component: () => import('@/pages/Moderation/ManageUser.vue'),
        },
        { 
            path: '/moderation/permissions', 
            component: () => import('@/pages/Moderation/ControlUsers.vue') 
        },
        { 
            path: '/groups', 
            component: () => import('@/pages/ExploreGroups.vue') 
        },
        { 
            path: '/groups/:id', 
            component: () => import('@/pages/ViewGroup.vue') 
        },
        { 
            path: '/artists', 
            component: () => import('@/pages/ComingSoon.vue') 
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
		},
        // Static pages
        {
            path: '/info/descriptions',
            component: () => import('@/pages/Info/AboutDescriptions.vue')
        },
        {
            path: '/info/terms',
            component: () => import('@/pages/Info/AboutService.vue')
        },
        {
            path: '/info/version',
            component: () => import('@/pages/Info/AboutVersion.vue')
        }
	],
})

router.afterEach((to) => {
    const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, c) => {
        const [key, val] = c.trim().split('=')
        if (key && val) {
            acc[key] = val
        }
        return acc
    }, {})

    if (cookies['first_login'] === 'true') {

        useWelcome().showWelcome.value = true;

        // Delete it after reading
        document.cookie = 'first_login=; Max-Age=0; path=/';
    }
});

export default router
