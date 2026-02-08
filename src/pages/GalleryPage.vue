<template>
  <div class="gallery-page">
    <h1>Gallery</h1>

    <div class="filters-section">
      <div class="filter-group">
        <label for="title-filter">Title</label>
        <input
          id="title-filter"
          v-model="filters.titleSearch"
          type="text"
          placeholder="Search by title..."
        />
      </div>

      <div class="filter-group">
        <label for="tag-filter">Tags</label>
        <input
          id="tag-filter"
          v-model="filters.tagInput"
          type="text"
          placeholder="Search by tag..."
        />
        <div v-if="filters.selectedTags.length" class="selected-tags">
          <span v-for="tag in filters.selectedTags" :key="tag" class="tag-pill">
            {{ tag }}
            <button @click="removeTag(tag)" type="button" class="remove-tag">✕</button>
          </span>
        </div>
      </div>

      <div class="filter-group">
        <label>Date Range</label>
        <div class="date-range">
          <input v-model="filters.startDate" type="date" placeholder="Start date" />
          <span>to</span>
          <input v-model="filters.endDate" type="date" placeholder="End date" />
        </div>
      </div>
    </div>

    <div class="controls-section">
      <div class="sort-controls">
        <label for="sort-by">Sort By</label>
        <select id="sort-by" v-model="pagination.sortBy">
          <option value="title">Title</option>
          <option value="createdDate">Creation Date</option>
        </select>

        <select v-model="pagination.sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div class="page-size-controls">
        <label for="page-size">Page Size</label>
        <select id="page-size" v-model.number="pagination.pageSize">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <div class="result-info">
        Total Results: <strong>{{ totalResults }}</strong>
      </div>
    </div>

    <div class="thumbnails-grid">
      <router-link
        v-for="image in images"
        :key="image.id"
        :to="{ name: 'viewer', params: { imageId: image.id } }"
        class="thumbnail"
      >
        <img :src="image.thumbnailUrl" :alt="image.title" />
        <div class="thumbnail-title">{{ image.title }}</div>
      </router-link>
    </div>

    <div class="pagination-section">
      <nav class="pagination">
        <button @click="previousPage" :disabled="pagination.currentPage === 1" class="page-nav">
          ← Previous
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="{ active: pagination.currentPage === page }"
            class="page-number"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="pagination.currentPage === totalPages"
          class="page-nav"
        >
          Next →
        </button>
      </nav>

      <div class="page-info">Page {{ pagination.currentPage }} of {{ totalPages }}</div>
    </div>

    <router-link to="/upload" class="upload-link">+ Upload New Image</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

const { fetchImages } = useApi()

const filters = ref({
  titleSearch: '',
  tagInput: '',
  selectedTags: [],
  startDate: '',
  endDate: '',
})

const pagination = ref({
  currentPage: 1,
  pageSize: 25,
  sortBy: 'title',
  sortOrder: 'asc',
})

const images = ref([])
const totalResults = ref(0)

const totalPages = computed(() => Math.ceil(totalResults.value / pagination.value.pageSize))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, pagination.value.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const removeTag = (tag) => {
  filters.value.selectedTags = filters.value.selectedTags.filter((t) => t !== tag)
}

const previousPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
    loadImages()
  }
}

const nextPage = () => {
  if (pagination.value.currentPage < totalPages.value) {
    pagination.value.currentPage++
    loadImages()
  }
}

const goToPage = (page) => {
  pagination.value.currentPage = page
  loadImages()
}

const loadImages = async () => {
  const params = new URLSearchParams({
    title: filters.value.titleSearch,
    tags: filters.value.selectedTags.join(','),
    startDate: filters.value.startDate,
    endDate: filters.value.endDate,
    page: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    sortBy: pagination.value.sortBy,
    sortOrder: pagination.value.sortOrder,
  })
  const response = await fetchImages(params)
  const data = await response?.json()

  images.value = data?.items || []
  totalResults.value = data?.totalCount || 0
}

onMounted(() => {
  loadImages()
})
</script>

<style scoped>
.gallery-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-page h1 {
  margin-bottom: 2rem;
}

.filters-section {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.filter-group input[type='text'],
.filter-group input[type='date'] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-range input {
  flex: 1;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4a90e2;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.85rem;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
}

.controls-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.sort-controls,
.page-size-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.sort-controls label,
.page-size-controls label {
  font-weight: bold;
}

.sort-controls select,
.page-size-controls select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.result-info {
  margin-left: auto;
  font-weight: bold;
}

.thumbnails-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.thumbnail {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  border-radius: 4px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.thumbnail:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.thumbnail img {
  width: 100%;
  height: 128px;
  object-fit: cover;
  display: block;
}

.thumbnail-title {
  padding: 0.5rem;
  font-size: 0.85rem;
  text-align: center;
  background-color: #f9f9f9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-nav,
.page-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.page-nav:hover:not(:disabled),
.page-number:hover {
  background-color: #f0f0f0;
}

.page-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-info {
  font-weight: bold;
  white-space: nowrap;
}

.upload-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.upload-link:hover {
  background-color: #229954;
}

@media (max-width: 768px) {
  .filters-section {
    grid-template-columns: 1fr;
  }

  .controls-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-info {
    margin-left: 0;
  }

  .thumbnails-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .page-numbers {
    display: none;
  }
}
</style>
