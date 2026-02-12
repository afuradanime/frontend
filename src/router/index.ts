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
        path: '/anime/:id',
        name: 'anime',
        component: () => import('../views/ViewAnime.vue'),
    }
  ],
})

export default router
