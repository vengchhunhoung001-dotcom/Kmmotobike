<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-blob blob-orange"></div>
      <div class="bg-blob blob-yellow"></div>
    </div>

    <div class="login-wrap">
      <!-- Card -->
      <div class="login-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-logo">⚙</div>
          <h1 class="card-brand">MotoShop</h1>
          <p class="card-tagline">{{ t('login.title') }}</p>
        </div>

        <!-- Form -->
        <div class="card-body">
          <form @submit.prevent="handleLogin">
            <div class="field">
              <label class="field-label">{{ t('login.username') }}</label>
              <input v-model="username" type="text" placeholder="admin" />
            </div>

            <div class="field">
              <label class="field-label">{{ t('login.password') }}</label>
              <input v-model="password" type="password" placeholder="password" />
            </div>

            <div class="field-check">
              <label class="check-label">
                <input v-model="rememberMe" type="checkbox" />
                <span>{{ t('login.rememberMe') }}</span>
              </label>
            </div>

            <div v-if="error" class="error-msg">{{ error }}</div>

            <button type="submit" class="btn-primary submit-btn">{{ t('login.submit') }}</button>
          </form>

          <div class="signup-row">
            <p class="signup-text">
              {{ t('login.noAccount') }}
              <a href="#" class="signup-link">{{ t('login.signup') }}</a>
            </p>
          </div>

          <!-- Demo Account -->
          <div class="demo-box">
            <h3 class="demo-title">Demo Account:</h3>
            <p class="demo-info">
              <strong>Username:</strong> admin<br />
              <strong>Password:</strong> password
            </p>
          </div>
        </div>
      </div>

      <!-- Back Link -->
      <div class="back-link-wrap">
        <router-link to="/" class="back-link">← {{ t('nav.home') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/useStore'
import { t } from '../assets/i18n'

const router = useRouter()
const store = useAppStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(true)
const error = ref('')

const handleLogin = () => {
  error.value = ''
  if (username.value === 'admin' && password.value === 'password') {
    store.login({ username: username.value, email: 'admin@motoshop.com', role: 'admin' })
    router.push('/admin')
  } else {
    error.value = t('login.error')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  pointer-events: none;
}
.bg-blob {
  position: absolute;
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  filter: blur(60px);
}
.blob-orange { top: 5rem; left: 2.5rem; background-color: #f97316; }
.blob-yellow { bottom: 5rem; right: 2.5rem; background-color: #facc15; }

.login-wrap {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 28rem;
}

.login-card {
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0,0,0,0.3);
  overflow: hidden;
}
:global(.dark) .login-card { background-color: #111827; }

.card-header {
  background: linear-gradient(to right, #f97316, #eab308);
  padding: 3rem 2rem;
  text-align: center;
}
.card-logo {
  width: 4rem;
  height: 4rem;
  background-color: #ffffff;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.875rem;
  margin: 0 auto 1rem;
}
.card-brand { font-size: 1.875rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem; }
.card-tagline { color: #fed7aa; }

.card-body { padding: 2.5rem 2rem; }

.field { margin-bottom: 1.5rem; }
.field-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}
:global(.dark) .field-label { color: #d1d5db; }

.field-check { margin-bottom: 1.5rem; }
.check-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #4b5563;
  font-size: 0.9rem;
}
:global(.dark) .check-label { color: #9ca3af; }
.check-label input { width: 1rem; height: 1rem; accent-color: #f97316; cursor: pointer; }

.error-msg {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}
:global(.dark) .error-msg {
  background-color: #7f1d1d;
  border-color: #b91c1c;
  color: #fecaca;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 1.125rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
}

.signup-row { text-align: center; }
.signup-text { color: #4b5563; font-size: 0.9rem; }
:global(.dark) .signup-text { color: #9ca3af; }
.signup-link { color: #f97316; font-weight: 600; text-decoration: none; }
.signup-link:hover { color: #ea580c; }

.demo-box {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #eff6ff;
  border-radius: 0.5rem;
}
:global(.dark) .demo-box { background-color: #1e3a8a; }
.demo-title { font-weight: 600; color: #1e40af; margin-bottom: 0.5rem; }
:global(.dark) .demo-title { color: #bfdbfe; }
.demo-info { font-size: 0.875rem; color: #1e40af; line-height: 1.6; }
:global(.dark) .demo-info { color: #bfdbfe; }

.back-link-wrap { text-align: center; margin-top: 1.5rem; }
.back-link { color: #d1d5db; text-decoration: none; transition: color 0.3s; font-size: 0.9rem; }
.back-link:hover { color: #f97316; }
</style>
