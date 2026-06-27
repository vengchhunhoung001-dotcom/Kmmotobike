<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-blobs">
        <div class="blob blob-orange animate-pulse"></div>
        <div class="blob blob-yellow animate-pulse animation-delay-2000"></div>
        <div class="blob blob-blue animate-pulse animation-delay-4000"></div>
      </div>
      <div class="hero-content container">
        <h1 class="hero-title">{{ t('home.title') }}</h1>
        <p class="hero-subtitle">{{ t('home.subtitle') }}</p>
        <div class="hero-actions">
          <router-link to="/products" class="btn-primary hero-btn">{{ t('home.cta') }}</router-link>
        </div>
      </div>
      <div class="scroll-indicator animate-bounce">
        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section section-white">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t('home.featured') }}</h2>
          <div class="section-divider"></div>
        </div>
        <div class="products-grid">
          <div v-for="product in featuredProducts" :key="product.id" class="product-card card-hover">
            <div class="product-image">
              <span class="product-icon">{{ product.icon }}</span>
              <div class="product-badge">-{{ product.discount }}%</div>
            </div>
            <div class="product-body">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-footer">
                <div class="product-price">
                  <span class="price-current">${{ product.price }}</span>
                  <span class="price-original">${{ product.originalPrice }}</span>
                </div>
                <button @click="addToCart(product)" class="cart-btn">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="section-cta">
          <router-link to="/products" class="btn-primary">{{ t('products.viewDetails') }}</router-link>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="section section-warm">
      <div class="container">
        <div class="about-grid">
          <div class="about-text">
            <h2 class="section-title">{{ t('home.about') }}</h2>
            <p class="about-desc">{{ t('home.aboutText') }}</p>
            <ul class="about-list">
              <li class="about-item">
                <svg width="24" height="24" fill="#f97316" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>高品质产品</span>
              </li>
              <li class="about-item">
                <svg width="24" height="24" fill="#f97316" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>专业支持</span>
              </li>
              <li class="about-item">
                <svg width="24" height="24" fill="#f97316" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>全球配送</span>
              </li>
            </ul>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">15+</div>
              <p class="stat-label">Years Experience</p>
            </div>
            <div class="stat-card">
              <div class="stat-number">1000+</div>
              <p class="stat-label">Happy Customers</p>
            </div>
            <div class="stat-card">
              <div class="stat-number">5000+</div>
              <p class="stat-label">Products</p>
            </div>
            <div class="stat-card">
              <div class="stat-number">24/7</div>
              <p class="stat-label">Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="section section-white">
      <div class="container">
        <h2 class="section-title text-center" style="margin-bottom:4rem">{{ t('home.contact') }}</h2>
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon">
              <svg width="32" height="32" fill="white" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>
            <h3 class="contact-title">{{ t('home.email') }}</h3>
            <p class="contact-desc">Email support available</p>
          </div>
          <div class="contact-card">
            <div class="contact-icon">
              <svg width="32" height="32" fill="white" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.8c.164.904.596 2.857 1.379 4.915a1 1 0 01-.244 1.052l-1.829 1.829a13.995 13.995 0 005.093 5.093l1.829-1.829a1 1 0 011.052-.244c2.057.783 4.011 1.215 4.915 1.379a1 1 0 01.8.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
            </div>
            <h3 class="contact-title">{{ t('home.phone') }}</h3>
            <p class="contact-desc">Phone support available</p>
          </div>
          <div class="contact-card">
            <div class="contact-icon">
              <svg width="32" height="32" fill="white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h3 class="contact-title">{{ t('home.address') }}</h3>
            <p class="contact-desc">Visit our store</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/useStore'
import { t } from '../assets/i18n'

const store = useAppStore()

const featuredProducts = [
  { id: 1, name: 'Premium Engine Kit', description: '高性能发动机改装套件', price: 299, originalPrice: 399, discount: 25, icon: '⚙️' },
  { id: 2, name: 'Advanced Suspension', description: '专业级悬挂系统', price: 499, originalPrice: 699, discount: 29, icon: '🏍️' },
]

const addToCart = (product) => {
  store.addToCart(product)
}
</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%);
}
.hero-blobs {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  pointer-events: none;
}
.blob {
  position: absolute;
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  filter: blur(60px);
  mix-blend-mode: multiply;
}
.blob-orange { top: 2.5rem; left: 2.5rem; background-color: #f97316; }
.blob-yellow { top: 10rem; right: 2.5rem; background-color: #facc15; }
.blob-blue { bottom: -2rem; left: 5rem; background-color: #3b82f6; }

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 56rem;
}
.hero-title {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}
.hero-subtitle {
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: #d1d5db;
  margin-bottom: 2rem;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.hero-btn { font-size: 1.125rem; padding: 0.75rem 2rem; }

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* Sections */
.section { padding: 5rem 0; }
.section-white { background-color: #ffffff; }
:global(.dark) .section-white { background-color: #030712; }
.section-warm { background: linear-gradient(to right, #fff7ed, #fefce8); }
:global(.dark) .section-warm { background: linear-gradient(to right, #111827, #1f2937); }

.section-header { text-align: center; margin-bottom: 4rem; }
.section-title { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 1rem; }
.section-divider {
  width: 6rem;
  height: 0.25rem;
  background: linear-gradient(to right, #f97316, #eab308);
  margin: 0 auto;
  border-radius: 9999px;
}
.section-cta { text-align: center; margin-top: 3rem; }

/* Products */
.products-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 640px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }

.product-card { background: transparent; }
.product-image {
  position: relative;
  height: 16rem;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
:global(.dark) .product-image { background: linear-gradient(135deg, #1f2937, #374151); }
.product-icon { font-size: 4rem; }
.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(to right, #f97316, #eab308);
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
}
.product-body { margin-top: 1rem; }
.product-name { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
.product-desc { color: #4b5563; margin-bottom: 1rem; font-size: 0.9rem; }
:global(.dark) .product-desc { color: #9ca3af; }
.product-footer { display: flex; align-items: center; justify-content: space-between; }
.product-price { display: flex; align-items: baseline; gap: 0.5rem; }
.price-current { font-size: 1.5rem; font-weight: 700; color: #f97316; }
.price-original { color: #9ca3af; text-decoration: line-through; font-size: 0.875rem; }
.cart-btn {
  background: linear-gradient(to right, #f97316, #eab308);
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-btn:hover { transform: scale(1.1); }

/* About */
.about-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center; }
@media (min-width: 768px) { .about-grid { grid-template-columns: 1fr 1fr; } }

.about-desc { font-size: 1.125rem; color: #4b5563; margin-bottom: 2rem; line-height: 1.7; }
:global(.dark) .about-desc { color: #9ca3af; }
.about-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
.about-item { display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.stat-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s;
}
:global(.dark) .stat-card { background-color: #1f2937; }
.stat-card:hover { transform: scale(1.05); }
.stat-number { font-size: 2rem; font-weight: 700; color: #f97316; margin-bottom: 0.5rem; }
.stat-label { color: #4b5563; font-size: 0.875rem; }
:global(.dark) .stat-label { color: #9ca3af; }

/* Contact */
.contact-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 768px) { .contact-grid { grid-template-columns: repeat(3, 1fr); } }
.contact-card { text-align: center; }
.contact-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #f97316, #eab308);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.contact-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
.contact-desc { color: #4b5563; }
:global(.dark) .contact-desc { color: #9ca3af; }

.text-center { text-align: center; }

/* ===== 480px Mobile ===== */
@media (max-width: 480px) {
  .hero { height: auto; min-height: 100svh; padding: 5rem 0 3rem; }
  .hero-title { font-size: 2rem; margin-bottom: 1rem; }
  .hero-subtitle { font-size: 1rem; }
  .hero-btn { font-size: 1rem; padding: 0.65rem 1.5rem; }
  .blob { width: 10rem; height: 10rem; filter: blur(40px); }

  .section { padding: 3rem 0; }
  .section-header { margin-bottom: 2rem; }
  .section-title { font-size: 1.6rem; }
  .section-cta { margin-top: 2rem; }

  .products-grid { gap: 1.25rem; }
  .product-image { height: 12rem; }
  .product-icon { font-size: 3rem; }
  .product-name { font-size: 1rem; }

  .about-grid { gap: 2rem; }
  .about-desc { font-size: 1rem; }
  .stats-grid { gap: 0.75rem; }
  .stat-card { padding: 1.25rem; }
  .stat-number { font-size: 1.5rem; }

  .contact-grid { gap: 1rem; }
  .contact-icon { width: 3rem; height: 3rem; }
}
</style>
