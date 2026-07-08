<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-blob blob-orange"></div>
      <div class="bg-blob blob-yellow"></div>
    </div>

    <div class="login-wrap">
      <div class="login-card">
        <!-- Header -->
        <div class="card-header">
          <div class="card-logo"><img src="/logo-color.png" alt="KM Motobike Logo" class="navbar-logo-img" /></div>
          <h1 class="card-brand">MotoShop</h1>
          <p class="card-tagline">{{ t('login.title') }}</p>
        </div>

        <!-- Form -->
        <div class="card-body">
          <div class="field">
            <label class="field-label">{{ t('login.username') }} (Email)</label>
            <input v-model="email" type="email" placeholder="admin@example.com" autocomplete="email" />
          </div>

          <div class="field">
            <label class="field-label">{{ t('login.password') }}</label>
            <input v-model="password" type="password" placeholder="••••••••" autocomplete="current-password" />
          </div>

          <div v-if="error" class="error-msg">{{ error }}</div>

          <button @click="handleLogin" :disabled="loading" class="btn-primary submit-btn">
            <span v-if="loading">登录中...</span>
            <span v-else>{{ t('login.submit') }}</span>
          </button>
        </div>
      </div>

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

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = '请输入邮箱和密码'
    return
  }
  loading.value = true
  const { error: authError } = await store.login(email.value, password.value)
  loading.value = false
  if (authError) {
    error.value = '邮箱或密码错误，请重试'
  } else {
    router.push('/admin')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
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
.blob-orange { top: 5rem; left: 2.5rem; background-color: #f2b705; }
.blob-yellow { bottom: 5rem; right: 2.5rem; background-color: #d99e0b; }

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
  background: #f2b705;
  padding: 2.25rem 2rem 2rem;
  text-align: center;
}
.card-logo {
  width: 4.5rem;
  height: 4.5rem;
  background-color: #ffffff;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.18), 0 0 0 3px rgba(0,0,0,0.08);
  padding: 0.45rem;
  overflow: hidden;
}
.card-logo .navbar-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.card-brand { font-size: 1.75rem; font-weight: 800; color: #111827; margin-bottom: 0.3rem; letter-spacing: -0.02em; }
.card-tagline { color: #374151; font-weight: 500; font-size: 0.9rem; }

.card-body { padding: 2.5rem 2rem; }

.field { margin-bottom: 1.5rem; }
.field-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}
:global(.dark) .field-label { color: #d1d5db; }

.field input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.field input:focus { border-color: #f2b705; box-shadow: 0 0 0 3px rgba(242,183,5,0.2); }
:global(.dark) .field input {
  background-color: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.error-msg {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 1.125rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.back-link-wrap { text-align: center; margin-top: 1.5rem; }
.back-link { color: #9ca3af; text-decoration: none; transition: color 0.3s; font-size: 0.9rem; }
.back-link:hover { color: #f2b705; }
</style>
