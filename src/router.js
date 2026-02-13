import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './pages/LoginPage.vue'
import ViewerPage from './pages/ViewerPage.vue'
import UploadPage from './pages/UploadPage.vue'
import GalleryPage from './pages/GalleryPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
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

export default router
