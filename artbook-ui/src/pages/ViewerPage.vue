<template>
  <div class="viewer-page">
    <div v-if="image" class="image-container">
      <h1>{{ image.title }}</h1>

      <div class="image-wrapper">
        <img :src="image.imageUrl" :alt="image.title" class="main-image" />
        <button @click="putLike" class="like-button" :class="{ liked: image.liked }">
          ♥ {{ image.likes }}
        </button>
      </div>

      <p class="description">{{ image.description }}</p>

      <div class="tags-section">
        <h3>Tags</h3>
        <div class="tags">
          <span v-for="tag in image.tags" :key="tag.key" class="tag">
            {{ tag.key }}: {{ tag.value }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="loading">Loading image...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const image = ref(null)
const { fetchApi } = useApi()

onMounted(async () => {
  const imageId = route.params.imageId

  // fetch image data from backend
  const response = await fetchApi(`/api/images/${imageId}`)
  image.value = await response.json()
})

const putLike = () => {
  if (image.value) {
    // POST to /api/images/{imageId}/like
    const response = fetchApi('/api/images/' + image.value.imageId + '/like', {
      method: 'PUT',
    })
  }
}
</script>

<style scoped>
.viewer-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.image-container h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.image-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.main-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  display: block;
  margin-bottom: 1rem;
}

.like-button {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.like-button:hover {
  background-color: #e0e0e0;
}

.like-button.liked {
  background-color: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #333;
}

.tags-section h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  background-color: #e0e0e0;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
