<template>
  <div class="products-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">{{ t('products.title') }}</h1>
        <p class="page-subtitle">{{ t('products.subtitle') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container products-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-card">
          <!-- 搜索框 -->
          <div class="search-group">
            <input 
              v-model="searchKeyword" 
              type="text" 
              class="search-input" 
              placeholder="搜索产品名字..."
            />
            <span v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">✕</span>
          </div>

          <h3 class="filter-title">{{ t('products.filter') }}</h3>

          <!-- Category -->
          <div class="filter-group">
            <h4 class="filter-label">{{ t('products.category') }}</h4>
            <div class="radio-list">
              <label class="radio-item">
                <input type="radio" v-model="selectedCategory" value="" /> {{ t('products.allCategories') }}
              </label>
              <label class="radio-item">
                <input type="radio" v-model="selectedCategory" value="engine" /> {{ t('products.engineParts') }}
              </label>
              <label class="radio-item">
                <input type="radio" v-model="selectedCategory" value="suspension" /> {{ t('products.suspension') }}
              </label>
              <label class="radio-item">
                <input type="radio" v-model="selectedCategory" value="brakes" /> {{ t('products.brakes') }}
              </label>
              <label class="radio-item">
                <input type="radio" v-model="selectedCategory" value="wheels" /> {{ t('products.wheels') }}
              </label>
              <label class="radio-item">
                <input type="radio" v-model="selectedCategory" value="accessories" /> {{ t('products.accessories') }}
              </label>
            </div>
          </div>

          <!-- Price -->
          <div class="filter-group">
            <h4 class="filter-label">{{ t('products.price') }}</h4>
            <input type="range" v-model="maxPrice" min="0" max="1000" />
            <div class="price-range-labels">
              <span>$0</span>
              <span class="price-max">${{ maxPrice }}</span>
            </div>
          </div>

          <!-- Sort -->
          <div class="filter-group">
            <h4 class="filter-label">{{ t('products.sort') }}</h4>
            <select v-model="sortBy">
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <!-- 购物车按钮（淘宝风格） -->
        <div class="cart-trigger-wrap">
          <button class="cart-trigger-btn" @click="openCart">
            <span class="cart-trigger-icon">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </span>
            <span class="cart-trigger-label">购物车</span>
            <span v-if="store.cartCount > 0" class="cart-trigger-badge">{{ store.cartCount }}</span>
          </button>
        </div>
      </aside>

      <!-- Products Grid -->
      <div class="products-content">
        <div v-if="filteredProducts.length === 0" class="no-products">
          <svg width="64" height="64" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="no-products-text">No products found</p>
        </div>

        <div v-else class="grid">
          <div v-for="product in filteredProducts" :key="product.id" class="pcard card-hover" @click="openDetail(product)">
            <div class="pcard-img">
              <img v-if="product.mainImg" :src="product.mainImg" class="pcard-real-img" alt="product" />
              <span v-else class="pcard-icon">{{ product.icon }}</span>
              <div :class="['stock-badge', product.inStock ? 'badge-in' : 'badge-out']">
                {{ product.inStock ? t('products.inStock') : t('products.outOfStock') }}
              </div>
              <div v-if="product.discount" class="discount-badge">-{{ product.discount }}%</div>
              <div class="pcard-overlay">
                <button @click.stop="openDetail(product)" class="btn-primary">{{ t('products.viewDetails') }}</button>
              </div>
            </div>
            <div class="pcard-body">
              <h3 class="pcard-name">{{ product.name }}</h3>
              <p class="pcard-desc">{{ product.description }}</p>
              <div class="pcard-meta">
                <div class="pcard-price">
                  <span class="price-current">${{ product.price }}</span>
                  <span v-if="product.originalPrice" class="price-original">${{ product.originalPrice }}</span>
                </div>
                <div class="pcard-rating">
                  <span>⭐</span>
                  <span class="rating-val">{{ product.rating }}</span>
                </div>
              </div>
              <button
                @click.stop="addToCart(product)"
                :disabled="!product.inStock"
                :class="['add-cart-btn', product.inStock ? 'add-cart-active' : 'add-cart-disabled']"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span>{{ product.inStock ? t('products.addToCart') : t('products.outOfStock') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 购物车弹窗 ===== -->
    <div v-if="showCart" class="modal-overlay" @click.self="closeCart">
      <div class="modal-md">
        <div class="modal-header">
          <h2 class="modal-title">🛒 购物车</h2>
          <button class="modal-close-btn" @click="closeCart">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="store.cart.length === 0" class="cart-empty">
            <p>购物车是空的，去添加产品吧！</p>
          </div>
          <div v-else>
            <div v-for="item in store.cart" :key="item.id" class="cart-item">
              <span class="cart-item-icon">{{ item.icon }}</span>
              <div class="cart-item-info">
                <div class="cart-item-name">{{ item.name }}</div>
                <div class="cart-item-price">${{ item.price }}</div>
              </div>
              <div class="cart-item-qty">
                <button class="qty-btn" @click="decreaseQty(item)">−</button>
                <span class="qty-val">{{ item.quantity }}</span>
                <button class="qty-btn" @click="increaseQty(item)">＋</button>
              </div>
              <div class="cart-item-subtotal">${{ (item.price * item.quantity).toFixed(2) }}</div>
              <button class="cart-item-remove" @click="store.removeFromCart(item.id)">🗑</button>
            </div>
            <div class="cart-total-row">
              <span>合计</span>
              <span class="cart-total-val">${{ store.cartTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer" v-if="store.cart.length > 0">
          <button class="btn-outline-gray" @click="closeCart">继续购物</button>
          <button class="btn-primary" @click="goCheckout">提交订单</button>
        </div>
      </div>
    </div>

    <!-- ===== 提交订单 / 用户信息 ===== -->
    <div v-if="showCheckout" class="modal-overlay" @click.self="closeCheckout">
      <div class="modal-md">
        <div class="modal-header">
          <h2 class="modal-title">📋 填写联系信息</h2>
          <button class="modal-close-btn" @click="closeCheckout">✕</button>
        </div>
        <div class="modal-body">
          <div class="order-summary">
            <p class="order-summary-title">📦 订单摘要</p>
            <div v-for="item in store.cart" :key="item.id" class="order-line">
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="order-total">总计：<strong>${{ store.cartTotal.toFixed(2) }}</strong></div>
          </div>
          <div class="form-group">
            <label class="form-label">📞 电话号码</label>
            <input v-model="checkoutForm.phone" class="form-input" placeholder="请输入您的电话号码" type="tel" />
          </div>
          <div class="form-group">
            <label class="form-label">💬 Facebook 名字</label>
            <input v-model="checkoutForm.facebook" class="form-input" placeholder="请输入您的 Facebook 名字" />
          </div>
          <p v-if="checkoutError" class="form-error">{{ checkoutError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-outline-gray" @click="closeCheckout">返回</button>
          <button class="btn-primary" @click="submitOrder">确认提交</button>
        </div>
      </div>
    </div>

    <!-- ===== 产品详情弹窗 ===== -->
    <div v-if="showDetail && detailProduct" class="modal-overlay" @click.self="closeDetail">
      <div class="modal-detail">
        <button class="modal-close-btn detail-close" @click="closeDetail">✕</button>

        <!-- 大图（支持点击缩略图放大） -->
        <div class="detail-main-img" @click="openLightbox(activeThumb)">
          <img v-if="allImages.length > 0" :src="allImages[activeThumb]" class="detail-real-img lightbox-trigger-img" alt="product" />
          <span v-else class="detail-main-icon">{{ detailProduct.icon }}</span>
          <div class="zoom-hint">🔍 点击放大</div>
        </div>

        <!-- 小图列表 -->
        <div class="detail-thumbs-wrap">
          <div class="detail-thumbs" ref="thumbsRef">
            <template v-if="allImages.length > 0">
              <div
                v-for="(img, idx) in allImages"
                :key="idx"
                :class="['detail-thumb', activeThumb === idx ? 'thumb-active' : '']"
                @click="activeThumb = idx"
              >
                <img :src="img" class="thumb-real-img" alt="" />
              </div>
            </template>
            <template v-else>
              <div
                v-for="(thumb, idx) in detailThumbs"
                :key="idx"
                :class="['detail-thumb', activeThumb === idx ? 'thumb-active' : '']"
                @click="activeThumb = idx"
              >
                <span class="thumb-icon">{{ thumb }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- 产品信息 -->
        <div class="detail-info">
          <div class="detail-info-top">
            <div>
              <h2 class="detail-name">{{ detailProduct.name }}</h2>
              <p class="detail-desc">{{ detailProduct.description }}</p>
            </div>
            <!-- 分享按钮 -->
            <button class="share-btn" @click="openShare">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              分享
            </button>
          </div>
          <div class="detail-meta">
            <div class="detail-price-wrap">
              <span class="detail-price">${{ detailProduct.price }}</span>
              <span v-if="detailProduct.originalPrice" class="detail-original">${{ detailProduct.originalPrice }}</span>
              <span v-if="detailProduct.discount" class="detail-discount">-{{ detailProduct.discount }}%</span>
            </div>
            <div class="detail-rating">⭐ {{ detailProduct.rating }}</div>
          </div>
          <div :class="['detail-stock', detailProduct.inStock ? 'stock-in' : 'stock-out']">
            {{ detailProduct.inStock ? '✅ 有库存' : '❌ 缺货' }}
          </div>
          <button
            @click="addToCart(detailProduct); closeDetail()"
            :disabled="!detailProduct.inStock"
            :class="['add-cart-btn detail-add-btn', detailProduct.inStock ? 'add-cart-active' : 'add-cart-disabled']"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {{ detailProduct.inStock ? '加入购物车' : '缺货' }}
          </button>
        </div>

        <!-- Footer区域 -->
        <div class="detail-footer-info">
          <div class="detail-footer-item">🏷 品类：{{ detailProduct.category }}</div>
          <div class="detail-footer-item">📦 产品编号：#P{{ detailProduct.id.toString().padStart(4,'0') }}</div>
        </div>
      </div>
    </div>

    <!-- ===== 分享弹窗 ===== -->
    <div v-if="showShare" class="modal-overlay" @click.self="closeShare">
      <div class="modal-sm">
        <div class="modal-header">
          <h2 class="modal-title">📤 分享产品</h2>
          <button class="modal-close-btn" @click="closeShare">✕</button>
        </div>
        <div class="modal-body share-body">
          <button class="share-option" @click="copyLink">
            <span class="share-option-icon">🔗</span>
            <span>复制链接</span>
            <span v-if="linkCopied" class="copy-tip">已复制！</span>
          </button>
          <!-- Telegram 分享（备注：请自行填入 Telegram 分享链接或 Bot 逻辑） -->
          <button class="share-option share-tg">
            <span class="share-option-icon">✈️</span>
            <span>分享到 Telegram</span>
            <span class="share-note">（待配置）</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== 图片灯箱 Lightbox ===== -->
    <div v-if="showLightbox" class="lightbox-overlay" @click.self="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">✕</button>
      <button class="lightbox-arrow lightbox-prev" @click="prevLightbox" :disabled="lightboxImages.length <= 1">‹</button>
      <div class="lightbox-img-wrap">
        <img :src="lightboxImages[lightboxIndex]" class="lightbox-img" :key="lightboxIndex" alt="lightbox" />
        <div class="lightbox-counter" v-if="lightboxImages.length > 1">{{ lightboxIndex + 1 }} / {{ lightboxImages.length }}</div>
      </div>
      <button class="lightbox-arrow lightbox-next" @click="nextLightbox" :disabled="lightboxImages.length <= 1">›</button>
    </div>

    <!-- Toast 提示 -->
    <div v-if="toast" class="toast-msg">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/useStore'
import { t } from '../assets/i18n'

const store = useAppStore()
const selectedCategory = ref('')
const maxPrice = ref(1000)
const sortBy = ref('popular')
const searchKeyword = ref('')

// 组件挂载时刷新产品数据
onMounted(() => {
  store.refreshProducts()
})

// 弹窗状态
const showCart = ref(false)
const showCheckout = ref(false)
const showDetail = ref(false)
const showShare = ref(false)
const detailProduct = ref(null)
const activeThumb = ref(0)
const linkCopied = ref(false)
const toast = ref('')
const checkoutError = ref('')
const checkoutForm = ref({ phone: '', facebook: '' })

const detailThumbs = computed(() => {
  if (!detailProduct.value) return []
  const icon = detailProduct.value.icon
  return [icon, icon, icon, icon, icon, icon]
})

const allImages = computed(() => {
  if (!detailProduct.value) return []
  const imgs = []
  if (detailProduct.value.mainImg) imgs.push(detailProduct.value.mainImg)
  if (detailProduct.value.thumbs?.length) imgs.push(...detailProduct.value.thumbs)
  return imgs
})

const filteredProducts = computed(() => {
  let products = store.products
  
  // 搜索关键字过滤
  if (searchKeyword.value.trim()) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }
  products = products.filter(p => p.price <= maxPrice.value)
  if (sortBy.value === 'price-low') products = [...products].sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'price-high') products = [...products].sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'newest') products = [...products].sort((a, b) => b.id - a.id)
  return products
})

// 购物车操作
const addToCart = (product) => {
  if (product.inStock) {
    store.addToCart(product)
    showToast('✅ 已加入购物车：' + product.name)
  }
}
const increaseQty = (item) => {
  item.quantity += 1
  localStorage.setItem('cart', JSON.stringify(store.cart))
}
const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1
    localStorage.setItem('cart', JSON.stringify(store.cart))
  } else {
    store.removeFromCart(item.id)
  }
}

// 弹窗逻辑
const openCart = () => { showCart.value = true }
const closeCart = () => { showCart.value = false }
const goCheckout = () => { showCart.value = false; showCheckout.value = true }
const closeCheckout = () => { showCheckout.value = false; showCart.value = true }

const submitOrder = () => {
  checkoutError.value = ''
  if (!checkoutForm.value.phone.trim()) {
    checkoutError.value = '请填写电话号码'
    return
  }
  if (!checkoutForm.value.facebook.trim()) {
    checkoutError.value = '请填写 Facebook 名字'
    return
  }
  
  // 将订单数据保存到store
  const orderItems = store.cart.map(item => ({
    name: item.name,
    icon: item.icon,
    qty: item.quantity,
    price: item.price
  }))
  
  store.addOrder({
    phone: checkoutForm.value.phone,
    facebook: checkoutForm.value.facebook,
    items: orderItems,
    total: store.cartTotal
  })
  
  // 清空购物车
  const cartItemsToRemove = [...store.cart]
  cartItemsToRemove.forEach(item => store.removeFromCart(item.id))
  
  showToast('🎉 订单已提交！我们将尽快联系您')
  showCheckout.value = false
  checkoutForm.value = { phone: '', facebook: '' }
}

// 灯箱
const showLightbox = ref(false)
const lightboxImages = ref([])
const lightboxIndex = ref(0)

const openLightbox = (idx) => {
  if (!detailProduct.value || allImages.value.length === 0) return
  lightboxImages.value = allImages.value
  lightboxIndex.value = idx < allImages.value.length ? idx : 0
  showLightbox.value = true
}
const closeLightbox = () => { showLightbox.value = false }
const prevLightbox = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + lightboxImages.value.length) % lightboxImages.value.length
}
const nextLightbox = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % lightboxImages.value.length
}

const openDetail = (product) => {
  detailProduct.value = product
  activeThumb.value = 0
  showDetail.value = true
}
const closeDetail = () => {
  showDetail.value = false
  detailProduct.value = null
}

const openShare = () => { showShare.value = true; linkCopied.value = false }
const closeShare = () => { showShare.value = false }
const copyLink = () => {
  const url = detailProduct.value
    ? `${window.location.origin}/products?id=${detailProduct.value.id}`
    : window.location.href
  navigator.clipboard.writeText(url).catch(() => {})
  linkCopied.value = true
}

const showToast = (msg) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2500)
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background-color: #ffffff;
}
:global(.dark) .products-page { background-color: #030712; }

/* Header */
.page-header {
  background: linear-gradient(to right, #111827, #000000);
  color: #ffffff;
  padding: 4rem 0;
  text-align: center;
}
.page-title { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 1rem; }
.page-subtitle { font-size: 1.25rem; color: #d1d5db; }

/* Layout */
.products-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
}
@media (min-width: 1024px) {
  .products-layout { flex-direction: row; }
}

/* Sidebar */
.sidebar { flex-shrink: 0; }
@media (min-width: 1024px) { .sidebar { width: 16rem; } }

.sidebar-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 1.5rem;
  position: sticky;
  top: 6rem;
}
:global(.dark) .sidebar-card { background-color: #111827; }

/* 搜索框 */
.search-group {
  position: relative;
  margin-bottom: 1.5rem;
}
.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}
:global(.dark) .search-input {
  background-color: #1f2937;
  border-color: #374151;
  color: #f3f4f6;
}
.search-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}
.search-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #9ca3af;
  font-weight: 700;
  font-size: 1rem;
  transition: color 0.2s;
}
.search-clear:hover { color: #f97316; }

.filter-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
.filter-group { margin-bottom: 2rem; }
.filter-label { font-weight: 700; margin-bottom: 1rem; font-size: 0.95rem; display: block; }

.radio-list { display: flex; flex-direction: column; gap: 0.5rem; }
.radio-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 0.9rem;
}
.radio-item:hover { color: #f97316; }
.radio-item input { width: 1rem; height: 1rem; accent-color: #f97316; cursor: pointer; }

.price-range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
.price-max { font-weight: 700; color: #f97316; }

/* 购物车触发按钮（淘宝风格） */
.cart-trigger-wrap {
  margin-top: 1rem;
}
.cart-trigger-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(to right, #f97316, #eab308);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 12px rgba(249,115,22,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.cart-trigger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249,115,22,0.4);
}
.cart-trigger-icon { display: flex; align-items: center; }
.cart-trigger-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: #fff;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #fff;
}

/* No products */
.no-products { text-align: center; padding: 3rem; }
.no-products-text { color: #6b7280; font-size: 1.125rem; margin-top: 1rem; }

/* Grid */
.products-content { flex: 1; }
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Product Card */
.pcard { cursor: pointer; }
.pcard-img {
  position: relative;
  height: 16rem;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
:global(.dark) .pcard-img { background: linear-gradient(135deg, #1f2937, #374151); }
.pcard-icon { font-size: 4rem; }
.pcard-real-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
}
.badge-in { background-color: #22c55e; }
.badge-out { background-color: #ef4444; }

.discount-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #f97316;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.pcard-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s;
}
.pcard:hover .pcard-overlay {
  background: rgba(0,0,0,0.4);
  opacity: 1;
}

.pcard-body { margin-top: 1rem; }
.pcard-name {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}
.pcard:hover .pcard-name { color: #f97316; }
.pcard-desc { color: #4b5563; font-size: 0.875rem; margin-bottom: 1rem; }
:global(.dark) .pcard-desc { color: #9ca3af; }

.pcard-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.pcard-price { display: flex; align-items: baseline; gap: 0.5rem; }
.price-current { font-size: 1.5rem; font-weight: 700; color: #f97316; }
.price-original { color: #9ca3af; text-decoration: line-through; font-size: 0.875rem; }
.pcard-rating { display: flex; align-items: center; gap: 0.25rem; }
.rating-val { font-size: 0.875rem; color: #4b5563; }
:global(.dark) .rating-val { color: #9ca3af; }

.add-cart-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
  font-size: 0.9rem;
}
.add-cart-active {
  background: linear-gradient(to right, #f97316, #eab308);
  color: #ffffff;
}
.add-cart-active:hover {
  box-shadow: 0 8px 15px rgba(249,115,22,0.3);
  transform: scale(1.02);
}
.add-cart-disabled {
  background-color: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
}
:global(.dark) .add-cart-disabled { background-color: #374151; color: #9ca3af; }

/* ===== 通用 Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-md {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 540px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}
.modal-sm {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}
:global(.dark) .modal-md, :global(.dark) .modal-sm { background: #1f2937; color: #f9fafb; }
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
:global(.dark) .modal-header { border-color: #374151; }
.modal-title { font-size: 1.2rem; font-weight: 700; }
.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background 0.2s;
}
.modal-close-btn:hover { background: #f3f4f6; color: #111827; }
:global(.dark) .modal-close-btn:hover { background: #374151; color: #f9fafb; }
.modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}
:global(.dark) .modal-footer { border-color: #374151; }

/* 购物车列表 */
.cart-empty { text-align: center; color: #9ca3af; padding: 2rem 0; }
.cart-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}
:global(.dark) .cart-item { border-color: #374151; }
.cart-item-icon { font-size: 2rem; flex-shrink: 0; }
.cart-item-info { flex: 1; min-width: 0; }
.cart-item-name { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-item-price { color: #f97316; font-size: 0.85rem; margin-top: 0.2rem; }
.cart-item-qty { display: flex; align-items: center; gap: 0.4rem; }
.qty-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 0.3rem;
  width: 26px;
  height: 26px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
:global(.dark) .qty-btn { background: #374151; color: #f9fafb; }
.qty-btn:hover { background: #e5e7eb; }
.qty-val { min-width: 20px; text-align: center; font-weight: 600; }
.cart-item-subtotal { font-weight: 700; color: #111827; font-size: 0.9rem; flex-shrink: 0; }
:global(.dark) .cart-item-subtotal { color: #f9fafb; }
.cart-item-remove { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: 0.6; transition: opacity 0.2s; }
.cart-item-remove:hover { opacity: 1; }
.cart-total-row {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0 0;
  font-size: 1rem;
  font-weight: 600;
}
.cart-total-val { color: #f97316; font-size: 1.2rem; font-weight: 700; }

/* 提交订单 */
.order-summary {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}
:global(.dark) .order-summary { background: #111827; }
.order-summary-title { font-weight: 700; margin-bottom: 0.75rem; }
.order-line { display: flex; justify-content: space-between; font-size: 0.9rem; padding: 0.25rem 0; color: #4b5563; }
:global(.dark) .order-line { color: #9ca3af; }
.order-total { border-top: 1px solid #e5e7eb; margin-top: 0.75rem; padding-top: 0.75rem; display: flex; justify-content: flex-end; }
:global(.dark) .order-total { border-color: #374151; }
.form-group { margin-bottom: 1.25rem; }
.form-label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.65rem 0.85rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
  color: #111827;
  box-sizing: border-box;
}
.form-input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
:global(.dark) .form-input { background: #374151; border-color: #4b5563; color: #f9fafb; }
.form-error { color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem; }

/* ===== 详情弹窗 ===== */
.modal-detail {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
}
:global(.dark) .modal-detail { background: #1f2937; color: #f9fafb; }
.detail-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(0,0,0,0.35);
  color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}
.detail-close:hover { background: rgba(0,0,0,0.6); }
.detail-main-img {
  height: 280px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem 1rem 0 0;
  overflow: hidden;
}
:global(.dark) .detail-main-img { background: linear-gradient(135deg, #111827, #374151); }
.detail-main-icon { font-size: 6rem; }
.detail-real-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 缩略图 */
.detail-thumbs-wrap {
  overflow-x: auto;
  padding: 0.75rem 1.25rem;
  scrollbar-width: thin;
}
.detail-thumbs {
  display: flex;
  gap: 0.6rem;
  min-width: max-content;
}
.detail-thumb {
  width: 60px;
  height: 60px;
  border-radius: 0.4rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  border: 2px solid transparent;
  flex-shrink: 0;
  transition: border-color 0.2s;
}
:global(.dark) .detail-thumb { background: #374151; }
.thumb-active { border-color: #f97316; }
.thumb-icon { pointer-events: none; }
.thumb-real-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 产品信息 */
.detail-info { padding: 1.25rem 1.5rem 1rem; }
.detail-info-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.detail-name { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.3rem; }
.detail-desc { color: #6b7280; font-size: 0.9rem; }
:global(.dark) .detail-desc { color: #9ca3af; }
.share-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.2s;
}
.share-btn:hover { background: #e5e7eb; }
:global(.dark) .share-btn { background: #374151; color: #e5e7eb; }
:global(.dark) .share-btn:hover { background: #4b5563; }
.detail-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.detail-price-wrap { display: flex; align-items: baseline; gap: 0.6rem; }
.detail-price { font-size: 1.8rem; font-weight: 700; color: #f97316; }
.detail-original { text-decoration: line-through; color: #9ca3af; font-size: 1rem; }
.detail-discount {
  background: #fef3c7;
  color: #d97706;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}
.detail-rating { font-size: 0.95rem; color: #6b7280; }
.detail-stock { font-size: 0.9rem; font-weight: 600; margin-bottom: 1.25rem; }
.stock-in { color: #16a34a; }
.stock-out { color: #dc2626; }
.detail-add-btn { margin-top: 0; font-size: 1rem; padding: 0.75rem 1rem; }

.detail-footer-info {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.85rem;
  color: #6b7280;
}
:global(.dark) .detail-footer-info { border-color: #374151; color: #9ca3af; }

/* 分享弹窗 */
.share-body { display: flex; flex-direction: column; gap: 0.75rem; }
.share-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  background: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.2s;
  text-align: left;
}
.share-option:hover { background: #f9fafb; }
:global(.dark) .share-option { background: #374151; border-color: #4b5563; color: #f9fafb; }
:global(.dark) .share-option:hover { background: #4b5563; }
.share-option-icon { font-size: 1.25rem; }
.copy-tip { margin-left: auto; color: #16a34a; font-size: 0.8rem; font-weight: 700; }
.share-tg { opacity: 0.7; cursor: default; }
.share-note { margin-left: auto; color: #9ca3af; font-size: 0.78rem; }

/* Toast */
.toast-msg {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: #fff;
  padding: 0.65rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 2000;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  pointer-events: none;
}

/* zoom hint on detail main img */
.detail-main-img { cursor: zoom-in; position: relative; }
.zoom-hint {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}
.detail-main-img:hover .zoom-hint { opacity: 1; }
.lightbox-trigger-img { transition: transform 0.2s; }
.detail-main-img:hover .lightbox-trigger-img { transform: scale(1.02); }

/* ===== Lightbox ===== */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.lightbox-img-wrap {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-img {
  max-width: 80vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 0 60px rgba(0,0,0,0.6);
  animation: lbFadeIn 0.2s ease;
}
@keyframes lbFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
.lightbox-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s;
}
.lightbox-close:hover { background: rgba(255,255,255,0.3); }
.lightbox-arrow {
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  flex-shrink: 0;
  line-height: 1;
  padding-bottom: 3px;
}
.lightbox-arrow:hover:not(:disabled) { background: rgba(255,255,255,0.3); transform: scale(1.1); }
.lightbox-arrow:disabled { opacity: 0.2; cursor: not-allowed; }
.lightbox-counter {
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.7);
  font-size: 0.85rem;
  white-space: nowrap;
}

/* Buttons */
.btn-outline-gray {
  padding: 0.5rem 1.25rem;
  border: 1px solid #d1d5db;
  background: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  transition: background 0.2s;
}
.btn-outline-gray:hover { background: #f3f4f6; }
:global(.dark) .btn-outline-gray { border-color: #4b5563; color: #e5e7eb; }
:global(.dark) .btn-outline-gray:hover { background: #374151; }

/* ===== 480px Mobile ===== */
@media (max-width: 480px) {
  .page-header { padding: 2.5rem 0; }
  .page-title { font-size: 1.6rem; }
  .page-subtitle { font-size: 1rem; }

  .products-layout { padding-top: 1.5rem; padding-bottom: 1.5rem; gap: 1.25rem; }

  .sidebar-card { padding: 1rem; }
  .filter-title { font-size: 1rem; margin-bottom: 1rem; }
  .filter-group { margin-bottom: 1.25rem; }

  .cart-trigger-btn { font-size: 0.9rem; padding: 0.65rem 0.85rem; }

  .grid { gap: 1rem;  grid-template-columns: repeat(2, 1fr); }
  .pcard-img { height: 12rem; }
  .pcard-name { font-size: 1rem; }
  .price-current { font-size: 1.2rem; }

  /* Detail modal */
  .modal-detail { border-radius: 0.75rem; max-height: 95vh; }
  .detail-main-img { height: 200px; }
  .detail-name { font-size: 1.1rem; }
  .detail-price { font-size: 1.4rem; }
  .detail-info { padding: 1rem; }
  .detail-footer-info { flex-direction: column; gap: 0.5rem; padding: 0.75rem 1rem 1rem; }

  /* Cart modal */
  .modal-md { max-width: 100%; border-radius: 0.75rem; }
  .cart-item { gap: 0.5rem; }
  .cart-item-icon { font-size: 1.5rem; }

  /* Lightbox */
  .lightbox-arrow { width: 36px; height: 36px; font-size: 1.4rem; }
  .lightbox-img { max-width: 95vw; }
}
</style>
