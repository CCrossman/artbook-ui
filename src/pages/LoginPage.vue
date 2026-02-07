<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'

const { fetchApi } = useApi()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showResetModal = ref(false)
const resetEmail = ref('')
const resetMessage = ref('')
const resetError = ref('')
const isResetting = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const response = await fetchApi('/api/v1/credentials/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    const data = await response.json()
    console.log('Login successful:', data)

    // Store token if provided
    if (data.token) {
      localStorage.setItem('authToken', data.token)
    }

    // Redirect to gallery
    router.push('/gallery')
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  showResetModal.value = true
  resetEmail.value = email.value
  resetError.value = ''
  resetMessage.value = ''
}

const handleResetSubmit = async () => {
  resetError.value = ''
  resetMessage.value = ''
  isResetting.value = true

  try {
    const response = await fetchApi('/api/v1/credentials/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: resetEmail.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Password reset request failed')
    }

    resetMessage.value = 'Password reset link sent to your email. Please check your inbox.'
  } catch (err) {
    console.error('Reset error:', err)
    resetError.value = err.message || 'Failed to send reset link. Please try again.'
  } finally {
    isResetting.value = false
  }
}

const closeResetModal = () => {
  showResetModal.value = false
  resetEmail.value = ''
  resetError.value = ''
  resetMessage.value = ''
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h1>Artbook</h1>
        <p class="subtitle">Sign in to your account</p>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
              :disabled="isLoading"
            />
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="forgot-password">
          <button
            type="button"
            class="forgot-password-link"
            @click="handleForgotPassword"
            :disabled="isLoading"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      <!-- Password Reset Modal -->
      <div v-if="showResetModal" class="modal-overlay" @click="closeResetModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeResetModal">×</button>
          <h2>Reset Password</h2>
          <p class="modal-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div v-if="resetError" class="error-message">
            {{ resetError }}
          </div>

          <div v-if="resetMessage" class="success-message">
            {{ resetMessage }}
          </div>

          <form @submit.prevent="handleResetSubmit" class="reset-form">
            <div class="form-group">
              <label for="reset-email">Email</label>
              <input
                id="reset-email"
                v-model="resetEmail"
                type="email"
                placeholder="your@email.com"
                required
                :disabled="isResetting"
              />
            </div>

            <button
              type="submit"
              class="login-button"
              :disabled="isResetting || resetMessage !== ''"
            >
              {{ isResetting ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 2rem;
}

.login-card h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.login-button {
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.forgot-password {
  text-align: center;
  margin-top: 1rem;
}

.forgot-password-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password-link:hover:not(:disabled) {
  color: #764ba2;
  text-decoration: underline;
}

.forgot-password-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #333;
}

.modal-content h2 {
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.5rem;
}

.modal-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.success-message {
  padding: 0.75rem;
  background-color: #efe;
  color: #3c3;
  border: 1px solid #cfc;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-card h1 {
    font-size: 1.5rem;
  }
}
</style>
