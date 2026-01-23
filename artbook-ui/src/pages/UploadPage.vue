<template>
  <div class="upload-page">
    <h1>Upload Image</h1>

    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <form @submit.prevent="handleSubmit" class="upload-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Enter image title"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Enter image description"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label>Tags</label>
        <div class="tags-input">
          <div v-for="(tag, index) in form.tags" :key="index" class="tag-input-row">
            <input v-model="tag.key" type="text" placeholder="Key" class="tag-key" />
            <input v-model="tag.value" type="text" placeholder="Value" class="tag-value" />
            <button @click="removeTag(index)" type="button" class="remove-btn">Remove</button>
          </div>
        </div>
        <button @click="addTag" type="button" class="add-tag-btn">+ Add Tag</button>
      </div>

      <div class="form-group">
        <label for="file">Select Image</label>
        <div class="file-input-wrapper">
          <input
            id="file"
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            required
          />
          <span v-if="selectedFileName" class="file-name"> ✓ {{ selectedFileName }} </span>
        </div>
      </div>

      <button type="submit" class="submit-btn">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  title: '',
  description: '',
  tags: [],
  file: null,
})
const selectedFileName = ref('')
const fileInput = ref(null)
const successMessage = ref('')

const addTag = () => {
  form.value.tags.push({ key: '', value: '' })
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.file = file
    selectedFileName.value = file.name
  }
}

const handleSubmit = async () => {
  if (!form.value.file) {
    alert('Please select an image file')
    return
  }

  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('image', form.value.file)
  form.value.tags.forEach((tag, index) => {
    formData.append(`tags[${index}][key]`, tag.key)
    formData.append(`tags[${index}][value]`, tag.value)
  })

  try {
    // Placeholder: POST to /api/images
    // const response = await fetch('/api/images', {
    //   method: 'POST',
    //   body: formData
    // })
    // const data = await response.json()

    // Mock response for now
    const imageId = 'image-' + Date.now()

    // Redirect to viewer page
    router.push({
      name: 'viewer',
      params: { imageId },
    })

    // Show success message (would need to pass it to viewer page in real implementation)
    successMessage.value = 'Upload successful.'
  } catch (error) {
    alert('Error uploading image: ' + error.message)
  }
}
</script>

<style scoped>
.upload-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.upload-page h1 {
  margin-bottom: 1.5rem;
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input[type='text'],
.form-group textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input[type='text']:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag-input-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.tag-key,
.tag-value {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.remove-btn {
  padding: 0.5rem 0.75rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.remove-btn:hover {
  background-color: #c0392b;
}

.add-tag-btn {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.add-tag-btn:hover {
  background-color: #e0e0e0;
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-input-wrapper input[type='file'] {
  flex: 1;
}

.file-name {
  color: #27ae60;
  font-weight: bold;
  white-space: nowrap;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn:hover {
  background-color: #357abd;
}
</style>
