import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './pages/LoginPage.vue'
import ViewerPage from './pages/ViewerPage.vue'
import UploadPage from './pages/UploadPage.vue'
import GalleryPage from './pages/GalleryPage.vue'
import { getCurrentUser } from 'aws-amplify/auth'

const routes = [
  {
    path: '/',
    redirect: '/gallery',
  },
  {
    path: '/login',
    component: LoginPage,
    name: 'login',
  },
  {
    path: '/gallery',
    component: GalleryPage,
    name: 'gallery',
  },
  {
    path: '/upload',
    component: UploadPage,
    name: 'upload',
    meta: { requiresAuth: true },
  },
  {
    path: '/viewer/:imageId',
    component: ViewerPage,
    name: 'viewer',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      await getCurrentUser()
      next()
    } catch (err) {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
