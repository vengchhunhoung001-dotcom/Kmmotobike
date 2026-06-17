<template>
  <div class="app-wrapper">
    <Navbar />
    <main class="app-main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/useStore'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const store = useAppStore()

onMounted(async () => {
  await store.fetchProducts()
  await store.fetchOrders()
  await store.fetchFeedbacks()
  if (store.darkMode) {
    document.documentElement.classList.add('dark')
  }
})

</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #111827;
  transition: background-color 0.3s, color 0.3s;
}
:global(.dark) .app-wrapper {
  background-color: #030712;
  color: #f3f4f6;
}
.app-main {
  flex: 1;
}
</style>
