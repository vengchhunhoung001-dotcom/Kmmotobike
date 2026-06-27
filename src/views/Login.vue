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
          <div class="card-logo">⚙</div>
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
.field input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.15); }
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
.back-link { color: #d1d5db; text-decoration: none; transition: color 0.3s; font-size: 0.9rem; }
.back-link:hover { color: #f97316; }
</style>
