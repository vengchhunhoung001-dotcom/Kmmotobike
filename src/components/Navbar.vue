<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <div class="logo-icon">
          <span>⚙</span>
        </div>
        <span class="logo-text">MotoShop</span>
      </router-link>

      <!-- Center Nav -->
      <div class="navbar-center">
        <router-link to="/" class="nav-link">{{ t('nav.home') }}</router-link>
        <router-link to="/products" class="nav-link">{{ t('nav.products') }}</router-link>
        <router-link to="/about" class="nav-link">{{ t('nav.about') }}</router-link>
        <router-link to="/help" class="nav-link">{{ t('nav.help') }}</router-link>
      </div>

      <!-- Right Controls -->
      <div class="navbar-right">

        <!-- Language Selector (dropdown with flags) -->
        <div class="dropdown-wrap">
          <button class="ctrl-btn lang-ctrl-btn">
            <span :class="['fi', currentLangFlag]" class="nav-flag"></span>
            <span class="lang-label">{{ currentLangLabel }}</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div class="dropdown-menu lang-dropdown">
            <button
              v-for="lang in langOptions"
              :key="lang.value"
              @click="setLanguage(lang.value)"
              :class="['lang-dropdown-item', currentLang === lang.value ? 'lang-dropdown-item--active' : '']"
            >
              <span :class="['fi', lang.flag]" class="nav-flag"></span>
              <span class="lang-item-text">{{ lang.label }}</span>
              <svg v-if="currentLang === lang.value" width="14" height="14" fill="#f97316" viewBox="0 0 20 20" class="lang-check">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Dark Mode Toggle -->
        <button @click="toggleDarkMode" class="ctrl-btn icon-btn">
          <svg v-if="darkMode" width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style="color:#eab308">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
          <svg v-else width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style="color:#f97316">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414zM5 17a1 1 0 100-2H4a1 1 0 100 2h1z" clip-rule="evenodd"/>
          </svg>
        </button>

        <!-- Auth -->
        <div v-if="isLoggedIn && user" class="dropdown-wrap">
          <button class="btn-user">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
            <span>{{ user.username }}</span>
          </button>
          <div class="dropdown-menu">
            <router-link to="/admin" class="dropdown-item">{{ t('nav.admin') }}</router-link>
            <button @click="logout" class="dropdown-item dropdown-item--danger">{{ t('nav.logout') }}</button>
          </div>
        </div>
        <router-link v-else to="/login" class="btn-primary">{{ t('nav.login') }}</router-link>

        <!-- Mobile Menu Toggle -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-toggle">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="mobile-menu container">
      <router-link to="/" class="mobile-link" @click="mobileMenuOpen = false">{{ t('nav.home') }}</router-link>
      <router-link to="/products" class="mobile-link" @click="mobileMenuOpen = false">{{ t('nav.products') }}</router-link>
      <router-link to="/about" class="mobile-link" @click="mobileMenuOpen = false">{{ t('nav.about') }}</router-link>
      <router-link to="/help" class="mobile-link" @click="mobileMenuOpen = false">{{ t('nav.help') }}</router-link>
      <!-- Mobile language options -->
      <div class="mobile-lang-row">
        <button
          v-for="lang in langOptions"
          :key="lang.value"
          @click="setLanguage(lang.value); mobileMenuOpen = false"
          :class="['mobile-lang-btn', currentLang === lang.value ? 'mobile-lang-btn--active' : '']"
        >
          <span :class="['fi', lang.flag]" class="nav-flag"></span>
          {{ lang.shortLabel }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '../stores/useStore'
import { useRouter } from 'vue-router'
import { t } from '../assets/i18n'

const store = useAppStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const darkMode = store.darkMode
const isLoggedIn = store.isLoggedIn
const user = store.user

const langOptions = [
  { value: 'km', flag: 'fi-kh', label: 'ភាសាខ្មែរ (Khmer)', shortLabel: 'ខ្មែរ' },
  { value: 'zh', flag: 'fi-cn', label: '汉语 (中文)',         shortLabel: '中文' },
  { value: 'en', flag: 'fi-gb', label: 'English',             shortLabel: 'EN'   },
]

const currentLang = computed(() => store.language || 'zh')

const currentLangFlag = computed(() => {
  return langOptions.find(l => l.value === currentLang.value)?.flag || 'fi-cn'
})

const currentLangLabel = computed(() => {
  const map = { km: 'ខ្មែរ', zh: '中文', en: 'EN' }
  return map[currentLang.value] || '中文'
})

const setLanguage = (lang) => {
  store.setLanguage(lang)
  location.reload()
}

const toggleDarkMode = () => {
  store.toggleDarkMode()
}

const logout = () => {
  store.logout()
  router.push('/')
}
</script>

<style scoped>
/* 引入 flag-icons（如果 index.html 已引入则删此行） */
@import 'https://cdn.jsdelivr.net/npm/flag-icons@6.14.0/css/flag-icons.min.css';

.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.3s, border-color 0.3s;
}
:global(.dark) .navbar {
  background-color: #111827;
  border-color: #1f2937;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #f97316, #eab308);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
  transition: transform 0.3s;
}
.navbar-logo:hover .logo-icon { transform: scale(1.1); }
.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #f97316, #eab308);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (max-width: 640px) { .logo-text { display: none; } }

/* Center nav */
.navbar-center {
  display: flex;
  align-items: center;
  gap: 2rem;
}
@media (max-width: 768px) { .navbar-center { display: none; } }

.nav-link {
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  transition: color 0.3s;
}
.nav-link:hover, .nav-link.router-link-active { color: #f97316; }
:global(.dark) .nav-link { color: #d1d5db; }
:global(.dark) .nav-link:hover { color: #fb923c; }

/* Right controls */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ctrl-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.65rem;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  border: 1px solid rgba(0,0,0,0.07);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: inherit;
  transition: background-color 0.2s, border-color 0.2s;
}
.ctrl-btn:hover { background-color: #e5e7eb; border-color: rgba(0,0,0,0.12); }
:global(.dark) .ctrl-btn { background-color: #1f2937; border-color: rgba(255,255,255,0.08); }
:global(.dark) .ctrl-btn:hover { background-color: #374151; }

/* Language button specifically */
.lang-ctrl-btn { gap: 0.4rem; padding: 0.4rem 0.6rem; }

/* Flag icon shared */
.nav-flag {
  width: 1.25em;
  height: 1.25em;
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
  box-shadow: 0 0 0 0.5px rgba(0,0,0,0.15);
}

.lang-label { font-size: 0.8rem; font-weight: 600; }

.icon-btn { padding: 0.5rem; }

/* User button */
.btn-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #f97316, #eab308);
  color: #ffffff;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: box-shadow 0.3s;
}
.btn-user:hover { box-shadow: 0 4px 12px rgba(249,115,22,0.4); }

/* Dropdown */
.dropdown-wrap { position: relative; }
.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 8rem;
  background-color: #ffffff;
  border-radius: 0.6rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.07);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
  transform: translateY(-4px);
  z-index: 100;
  overflow: hidden;
}
:global(.dark) .dropdown-menu { background-color: #1f2937; box-shadow: 0 8px 24px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.06); }
.dropdown-wrap:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Regular dropdown item */
.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.15s;
}
.dropdown-item:hover { background-color: #f3f4f6; }
:global(.dark) .dropdown-item:hover { background-color: #374151; }
.dropdown-item--danger { color: #dc2626; }
:global(.dark) .dropdown-item--danger { color: #f87171; }

/* Language dropdown items (with flags) */
.lang-dropdown { min-width: 180px; padding: 4px 0; }

.lang-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: inherit;
  transition: background-color 0.15s;
  text-align: left;
}
.lang-dropdown-item:hover { background-color: #f3f4f6; }
:global(.dark) .lang-dropdown-item:hover { background-color: #374151; }

.lang-dropdown-item--active { background-color: #fff7ed; }
:global(.dark) .lang-dropdown-item--active { background-color: rgba(249,115,22,0.12); }

.lang-item-text { flex: 1; font-weight: 500; }
.lang-check { flex-shrink: 0; }

/* Mobile toggle */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 0.25rem;
}
@media (max-width: 768px) { .mobile-toggle { display: block; } }

/* Mobile menu */
.mobile-menu {
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-top: 1px solid #e5e7eb;
}
:global(.dark) .mobile-menu { border-color: #1f2937; }
.mobile-link {
  display: block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  transition: background-color 0.2s;
}
.mobile-link:hover { background-color: #f3f4f6; }
:global(.dark) .mobile-link:hover { background-color: #1f2937; }

/* Mobile language row */
.mobile-lang-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem 0.25rem;
}
.mobile-lang-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #f3f4f6;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: inherit;
  transition: background 0.15s;
}
.mobile-lang-btn:hover { background: #e5e7eb; }
.mobile-lang-btn--active { background: #fff7ed; border-color: #f97316; color: #f97316; }
:global(.dark) .mobile-lang-btn { background: #1f2937; border-color: rgba(255,255,255,0.1); }
:global(.dark) .mobile-lang-btn--active { background: rgba(249,115,22,0.12); }
</style>
