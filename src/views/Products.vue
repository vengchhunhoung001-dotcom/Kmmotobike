<template>
  <div class="products-page">
    <!-- Page Header -->
    <div class="page-header">
      <img src="/product-banner.png" alt="KM Motorbike Banner" class="page-header-img" />
    </div>

    <!-- ===== 手机版 Filter Bar (≤768px) ===== -->
    <div class="mobile-filterbar">
      <!-- 搜索展开栏 -->
      <transition name="msearch-slide">
        <div v-if="showMobileSearch" class="msearch-bar">
          <svg width="16" height="16" fill="none" stroke="#a8690a" viewBox="0 0 24 24" style="flex-shrink:0">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            ref="mobileSearchInput"
            v-model="searchKeyword"
            type="text"
            class="msearch-input"
            placeholder="搜索产品名字..."
            @keyup.enter="closeMobileSearch"
          />
          <button v-if="searchKeyword" class="msearch-clear" @click="searchKeyword = ''">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <button class="msearch-cancel" @click="closeMobileSearch">取消</button>
        </div>
      </transition>

      <!-- 横向滚动 Chips 行 -->
      <div class="mfb-scroll">
        <div class="mfb-row">

          <!-- 🔍 搜索 -->
          <button :class="['mfb-chip', searchKeyword ? 'mfb-chip--on' : '']" @click="openMobileSearch">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="mfb-chip__txt">{{ searchKeyword || '搜索' }}</span>
            <span v-if="searchKeyword" class="mfb-dot"></span>
          </button>

          <div class="mfb-sep"></div>

          <!-- 分类 -->
          <div class="mfb-wrap" ref="catWrap">
            <button :class="['mfb-chip', selectedCategory ? 'mfb-chip--on' : '']" @click="toggleMenu('cat')">
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"/>
              </svg>
              <span class="mfb-chip__txt">{{ selectedCategory ? catLabel : '分类' }}</span>
              <svg class="mfb-arr" :class="openMenu==='cat' ? 'mfb-arr--up':''" width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
              <span v-if="selectedCategory" class="mfb-dot"></span>
            </button>
            <transition name="mfb-pop">
              <div v-if="openMenu==='cat'" class="mfb-dropdown">
                <button :class="['mfb-ditem', selectedCategory==='' ?'mfb-ditem--on':'']" @click="pickCat('')">{{ t('products.allCategories') }}</button>
                <button v-for="cat in PRODUCT_CATEGORIES" :key="cat" :class="['mfb-ditem', selectedCategory===cat ?'mfb-ditem--on':'']" @click="pickCat(cat)">{{ t(`products.${cat}`) }}</button>
              </div>
            </transition>
          </div>

          <!-- 价格 -->
          <div class="mfb-wrap" ref="priceWrap">
            <button :class="['mfb-chip', maxPrice<1000 ? 'mfb-chip--on' : '']" @click="toggleMenu('price')">
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2"/>
              </svg>
              <span class="mfb-chip__txt">{{ maxPrice<1000 ? '≤$'+maxPrice : '价格' }}</span>
              <svg class="mfb-arr" :class="openMenu==='price'?'mfb-arr--up':''" width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
              <span v-if="maxPrice<1000" class="mfb-dot"></span>
            </button>
            <transition name="mfb-pop">
              <div v-if="openMenu==='price'" class="mfb-dropdown mfb-dropdown--price">
                <p class="mfb-plabel">最高价格 <strong style="color:#a8690a">${{ maxPrice }}</strong></p>
                <input type="range" v-model="maxPrice" min="0" max="1000" class="mfb-range"/>
                <div class="mfb-prow"><span>$0</span><span>$1000</span></div>
                <button class="mfb-pconfirm" @click="openMenu=null">确认</button>
              </div>
            </transition>
          </div>

          <!-- 排序 -->
          <div class="mfb-wrap" ref="sortWrap">
            <button :class="['mfb-chip', sortBy!=='popular' ? 'mfb-chip--on' : '']" @click="toggleMenu('sort')">
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
              </svg>
              <span class="mfb-chip__txt">{{ sortLabel }}</span>
              <svg class="mfb-arr" :class="openMenu==='sort'?'mfb-arr--up':''" width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
              <span v-if="sortBy!=='popular'" class="mfb-dot"></span>
            </button>
            <transition name="mfb-pop">
              <div v-if="openMenu==='sort'" class="mfb-dropdown">
                <button :class="['mfb-ditem', sortBy==='popular'?'mfb-ditem--on':'']" @click="pickSort('popular')">热门优先</button>
                <button :class="['mfb-ditem', sortBy==='price-low'?'mfb-ditem--on':'']" @click="pickSort('price-low')">价格 低→高</button>
                <button :class="['mfb-ditem', sortBy==='price-high'?'mfb-ditem--on':'']" @click="pickSort('price-high')">价格 高→低</button>
                <button :class="['mfb-ditem', sortBy==='newest'?'mfb-ditem--on':'']" @click="pickSort('newest')">最新上架</button>
              </div>
            </transition>
          </div>

          <!-- 更多筛选 -->
          <button :class="['mfb-chip mfb-chip--more', activeFilterCount>0?'mfb-chip--on':'']" @click="openFilterDrawer">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 4h18M7 9h10M11 14h2"/>
            </svg>
            <span class="mfb-chip__txt">更多筛选</span>
            <span v-if="activeFilterCount>0" class="mfb-badge">{{ activeFilterCount }}</span>
          </button>

          <!-- 购物车 -->
          <button class="mfb-chip mfb-chip--cart" @click="openCart">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="mfb-chip__txt">购物车</span>
            <span v-if="store.cartCount>0" class="mfb-badge mfb-badge--red">{{ store.cartCount }}</span>
          </button>

        </div>
      </div>

      <!-- 已激活的筛选 tag 行（有筛选时才显示） -->
      <div v-if="activeFilterCount>0" class="mfb-active-row">
        <span v-if="searchKeyword" class="mfb-tag" @click="searchKeyword=''">
          🔍 {{ searchKeyword }} <span class="mfb-tag-x">✕</span>
        </span>
        <span v-if="selectedCategory" class="mfb-tag" @click="selectedCategory=''">
          {{ catLabel }} <span class="mfb-tag-x">✕</span>
        </span>
        <span v-if="maxPrice<1000" class="mfb-tag" @click="maxPrice=1000">
          ≤${{ maxPrice }} <span class="mfb-tag-x">✕</span>
        </span>
        <span v-if="sortBy!=='popular'" class="mfb-tag" @click="sortBy='popular'">
          {{ sortLabel }} <span class="mfb-tag-x">✕</span>
        </span>
        <button class="mfb-clear-all" @click="resetFilters">全部清除</button>
      </div>
    </div>
    <!-- 点击外部关闭 dropdown -->
    <div v-if="openMenu" class="mfb-backdrop" @click="openMenu=null"></div>

    <!-- Main Content -->
    <div class="container products-layout">
      <!-- Sidebar (桌面端) -->
      <aside class="sidebar">
        <div class="sidebar-card">
          <div class="search-group">
            <input v-model="searchKeyword" type="text" class="search-input" placeholder="搜索产品名字..."/>
            <span v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">✕</span>
          </div>
          <h3 class="filter-title">{{ t('products.filter') }}</h3>
          <div class="filter-group">
            <h4 class="filter-label">{{ t('products.category') }}</h4>
            <div class="radio-list">
              <label class="radio-item"><input type="radio" v-model="selectedCategory" value="" /> {{ t('products.allCategories') }}</label>
              <label v-for="cat in PRODUCT_CATEGORIES" :key="cat" class="radio-item"><input type="radio" v-model="selectedCategory" :value="cat" /> {{ t(`products.${cat}`) }}</label>
            </div>
          </div>
          <div class="filter-group">
            <h4 class="filter-label">{{ t('products.price') }}</h4>
            <input type="range" v-model="maxPrice" min="0" max="1000" />
            <div class="price-range-labels"><span>$0</span><span class="price-max">${{ maxPrice }}</span></div>
          </div>
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
        <div class="cart-trigger-wrap">
          <button class="cart-trigger-btn" @click="openCart">
            <span class="cart-trigger-icon">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
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
                <div class="pcard-rating"><span>⭐</span><span class="rating-val">{{ product.rating }}</span></div>
              </div>
              <button @click.stop="addToCart(product)" :disabled="!product.inStock" :class="['add-cart-btn', product.inStock ? 'add-cart-active' : 'add-cart-disabled']">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span>{{ product.inStock ? t('products.addToCart') : t('products.outOfStock') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Filter Drawer (Mobile) ===== -->
    <transition name="drawer-fade">
      <div v-if="showFilterDrawer" class="filter-drawer-overlay" @click.self="closeFilterDrawer"></div>
    </transition>
    <transition name="drawer-slide">
      <div v-if="showFilterDrawer" class="filter-drawer">
        <div class="drawer-grip"></div>
        <div class="drawer-head">
          <h3 class="drawer-title">搜索 &amp; 筛选</h3>
          <div class="drawer-head-actions">
            <button v-if="activeFilterCount > 0" class="drawer-reset-btn" @click="resetFilters">全部重置</button>
            <button class="drawer-close-btn" @click="closeFilterDrawer">✕</button>
          </div>
        </div>
        <div class="drawer-body">
          <div class="drawer-section">
            <p class="drawer-section-label">🔍 搜索</p>
            <div class="search-group">
              <input v-model="searchKeyword" type="text" class="search-input" placeholder="搜索产品名字..." />
              <span v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">✕</span>
            </div>
          </div>
          <div class="drawer-section">
            <p class="drawer-section-label">{{ t('products.category') }}</p>
            <div class="drawer-chips">
              <button :class="['drawer-chip', selectedCategory === '' ? 'drawer-chip-active' : '']" @click="selectedCategory = ''">{{ t('products.allCategories') }}</button>
              <button v-for="cat in PRODUCT_CATEGORIES" :key="cat" :class="['drawer-chip', selectedCategory === cat ? 'drawer-chip-active' : '']" @click="selectedCategory = cat">{{ t(`products.${cat}`) }}</button>
            </div>
          </div>
          <div class="drawer-section">
            <p class="drawer-section-label">{{ t('products.price') }}<span class="drawer-price-tag">${{ maxPrice }}</span></p>
            <input type="range" v-model="maxPrice" min="0" max="1000" class="drawer-range" />
            <div class="price-range-labels"><span>$0</span><span class="price-max">${{ maxPrice }}</span></div>
          </div>
          <div class="drawer-section">
            <p class="drawer-section-label">{{ t('products.sort') }}</p>
            <div class="drawer-chips">
              <button :class="['drawer-chip', sortBy === 'popular' ? 'drawer-chip-active' : '']" @click="sortBy = 'popular'">热门</button>
              <button :class="['drawer-chip', sortBy === 'price-low' ? 'drawer-chip-active' : '']" @click="sortBy = 'price-low'">价格↑</button>
              <button :class="['drawer-chip', sortBy === 'price-high' ? 'drawer-chip-active' : '']" @click="sortBy = 'price-high'">价格↓</button>
              <button :class="['drawer-chip', sortBy === 'newest' ? 'drawer-chip-active' : '']" @click="sortBy = 'newest'">最新</button>
            </div>
          </div>
        </div>
        <div class="drawer-footer">
          <button class="drawer-apply-btn" @click="closeFilterDrawer">查看 {{ filteredProducts.length }} 件产品</button>
        </div>
      </div>
    </transition>

    <!-- ===== 购物车弹窗 ===== -->
    <div v-if="showCart" class="modal-overlay" @click.self="closeCart">
      <div class="modal-md">
        <div class="modal-header">
          <h2 class="modal-title">🛒 购物车</h2>
          <button class="modal-close-btn" @click="closeCart">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="store.cart.length === 0" class="cart-empty"><p>购物车是空的，去添加产品吧！</p></div>
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
            <div class="cart-total-row"><span>合计</span><span class="cart-total-val">${{ store.cartTotal.toFixed(2) }}</span></div>
          </div>
        </div>
        <div class="modal-footer" v-if="store.cart.length > 0">
          <button class="btn-outline-gray" @click="closeCart">继续购物</button>
          <button class="btn-primary" @click="goCheckout">提交订单</button>
        </div>
      </div>
    </div>

    <!-- ===== 提交订单 ===== -->
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
        <div class="detail-main-img" @click="openLightbox(activeThumb)">
          <img v-if="allImages.length > 0" :src="allImages[activeThumb]" class="detail-real-img lightbox-trigger-img" alt="product" />
          <span v-else class="detail-main-icon">{{ detailProduct.icon }}</span>
          <div class="zoom-hint">🔍 点击放大</div>
        </div>
        <div class="detail-thumbs-wrap">
          <div class="detail-thumbs" ref="thumbsRef">
            <template v-if="allImages.length > 0">
              <div v-for="(img, idx) in allImages" :key="idx" :class="['detail-thumb', activeThumb === idx ? 'thumb-active' : '']" @click="activeThumb = idx">
                <img :src="img" class="thumb-real-img" alt="" />
              </div>
            </template>
            <template v-else>
              <div v-for="(thumb, idx) in detailThumbs" :key="idx" :class="['detail-thumb', activeThumb === idx ? 'thumb-active' : '']" @click="activeThumb = idx">
                <span class="thumb-icon">{{ thumb }}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-info-top">
            <div>
              <h2 class="detail-name">{{ detailProduct.name }}</h2>
              <p class="detail-desc">{{ detailProduct.description }}</p>
            </div>
            <button class="share-btn" @click="openShare">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
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
          <button @click="addToCart(detailProduct); closeDetail()" :disabled="!detailProduct.inStock" :class="['add-cart-btn detail-add-btn', detailProduct.inStock ? 'add-cart-active' : 'add-cart-disabled']">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {{ detailProduct.inStock ? '加入购物车' : '缺货' }}
          </button>
        </div>
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
            <span class="share-option-icon">🔗</span><span>复制链接</span>
            <span v-if="linkCopied" class="copy-tip">已复制！</span>
          </button>
          <button class="share-option share-tg">
            <span class="share-option-icon">✈️</span><span>分享到 Telegram</span>
            <span class="share-note">（待配置）</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== 灯箱 ===== -->
    <div v-if="showLightbox" class="lightbox-overlay" @click.self="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">✕</button>
      <button class="lightbox-arrow lightbox-prev" @click="prevLightbox" :disabled="lightboxImages.length <= 1">‹</button>
      <div class="lightbox-img-wrap">
        <img :src="lightboxImages[lightboxIndex]" class="lightbox-img" :key="lightboxIndex" alt="lightbox" />
        <div class="lightbox-counter" v-if="lightboxImages.length > 1">{{ lightboxIndex + 1 }} / {{ lightboxImages.length }}</div>
      </div>
      <button class="lightbox-arrow lightbox-next" @click="nextLightbox" :disabled="lightboxImages.length <= 1">›</button>
    </div>

    <div v-if="toast" class="toast-msg">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/useStore'
import { t, PRODUCT_CATEGORIES } from '../assets/i18n'

const store = useAppStore()
const selectedCategory = ref('')
const maxPrice = ref(1000)
const sortBy = ref('popular')
const searchKeyword = ref('')

onMounted(() => { store.refreshProducts() })

// ── 手机版搜索 ──
const showMobileSearch = ref(false)
const mobileSearchInput = ref(null)
const openMobileSearch = () => {
  showMobileSearch.value = true
  setTimeout(() => mobileSearchInput.value?.focus(), 50)
}
const closeMobileSearch = () => { showMobileSearch.value = false }

// ── 手机版 chip 下拉 ──
const openMenu = ref(null) // 'cat' | 'price' | 'sort' | null
const toggleMenu = (name) => { openMenu.value = openMenu.value === name ? null : name }
const pickCat = (v) => { selectedCategory.value = v; openMenu.value = null }
const pickSort = (v) => { sortBy.value = v; openMenu.value = null }

const catLabel = computed(() => {
  return selectedCategory.value ? t(`products.${selectedCategory.value}`) : t('products.allCategories')
})
const sortLabel = computed(() => {
  const m = { popular:'排序', 'price-low':'价格↑', 'price-high':'价格↓', newest:'最新' }
  return m[sortBy.value] || '排序'
})

// ── Filter Drawer ──
const showFilterDrawer = ref(false)
const openFilterDrawer = () => { showFilterDrawer.value = true }
const closeFilterDrawer = () => { showFilterDrawer.value = false }
const resetFilters = () => { searchKeyword.value=''; selectedCategory.value=''; maxPrice.value=1000; sortBy.value='popular' }

const activeFilterCount = computed(() => {
  let c = 0
  if (searchKeyword.value) c++
  if (selectedCategory.value) c++
  if (maxPrice.value < 1000) c++
  if (sortBy.value !== 'popular') c++
  return c
})

// ── 弹窗 ──
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
  if (searchKeyword.value.trim()) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (selectedCategory.value) products = products.filter(p => p.category === selectedCategory.value)
  products = products.filter(p => p.price <= maxPrice.value)
  if (sortBy.value === 'price-low') products = [...products].sort((a,b) => a.price - b.price)
  else if (sortBy.value === 'price-high') products = [...products].sort((a,b) => b.price - a.price)
  else if (sortBy.value === 'newest') products = [...products].sort((a,b) => b.id - a.id)
  return products
})

const addToCart = (product) => {
  if (product.inStock) { store.addToCart(product); showToast('✅ 已加入购物车：' + product.name) }
}
const increaseQty = (item) => { item.quantity += 1; localStorage.setItem('cart', JSON.stringify(store.cart)) }
const decreaseQty = (item) => {
  if (item.quantity > 1) { item.quantity -= 1; localStorage.setItem('cart', JSON.stringify(store.cart)) }
  else store.removeFromCart(item.id)
}

const openCart = () => { showCart.value = true }
const closeCart = () => { showCart.value = false }
const goCheckout = () => { showCart.value = false; showCheckout.value = true }
const closeCheckout = () => { showCheckout.value = false; showCart.value = true }

const submitOrder = () => {
  checkoutError.value = ''
  if (!checkoutForm.value.phone.trim()) { checkoutError.value = '请填写电话号码'; return }
  if (!checkoutForm.value.facebook.trim()) { checkoutError.value = '请填写 Facebook 名字'; return }
  const orderItems = store.cart.map(item => ({ name: item.name, icon: item.icon, qty: item.quantity, price: item.price }))
  store.addOrder({ phone: checkoutForm.value.phone, facebook: checkoutForm.value.facebook, items: orderItems, total: store.cartTotal })
  const cartItemsToRemove = [...store.cart]
  cartItemsToRemove.forEach(item => store.removeFromCart(item.id))
  showToast('🎉 订单已提交！我们将尽快联系您')
  showCheckout.value = false
  checkoutForm.value = { phone: '', facebook: '' }
}

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
const prevLightbox = () => { lightboxIndex.value = (lightboxIndex.value - 1 + lightboxImages.value.length) % lightboxImages.value.length }
const nextLightbox = () => { lightboxIndex.value = (lightboxIndex.value + 1) % lightboxImages.value.length }

const openDetail = (product) => { detailProduct.value = product; activeThumb.value = 0; showDetail.value = true }
const closeDetail = () => { showDetail.value = false; detailProduct.value = null }
const openShare = () => { showShare.value = true; linkCopied.value = false }
const closeShare = () => { showShare.value = false }
const copyLink = () => {
  const url = detailProduct.value ? `${window.location.origin}/products?id=${detailProduct.value.id}` : window.location.href
  navigator.clipboard.writeText(url).catch(() => {})
  linkCopied.value = true
}
const showToast = (msg) => { toast.value = msg; setTimeout(() => { toast.value = '' }, 2500) }
</script>

<style scoped>
.products-page { min-height: 100vh; background-color: #ffffff; }
:global(.dark) .products-page { background-color: #030712; }

/* ── Header ── */
.page-header {
  width: 100%;
  line-height: 0;
  border-bottom: 3px solid #f2b705;
}
.page-header-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* ── Layout ── */
.products-layout {
  display: flex; flex-direction: column;
  gap: 2rem; padding-top: 1.5rem; padding-bottom: 3rem;
}
@media (min-width: 1024px) { .products-layout { flex-direction: row; padding-top: 3rem; } }

/* ── Sidebar ── */
.sidebar { flex-shrink: 0; }
@media (min-width: 1024px) { .sidebar { width: 16rem; } }
.sidebar-card {
  background-color: #ffffff; border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 1.5rem;
  position: sticky; top: 6rem;
}
:global(.dark) .sidebar-card { background-color: #111827; }
.search-group { position: relative; margin-bottom: 1.5rem; }
.search-input {
  width: 100%; padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.95rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}
:global(.dark) .search-input { background-color: #1f2937; border-color: #374151; color: #f3f4f6; }
.search-input:focus { outline: none; border-color: #f2b705; box-shadow: 0 0 0 3px rgba(242,183,5,0.15); }
.search-clear {
  position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
  cursor: pointer; color: #9ca3af; font-weight: 700; font-size: 1rem;
}
.search-clear:hover { color: #f2b705; }
.filter-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
.filter-group { margin-bottom: 2rem; }
.filter-label { font-weight: 700; margin-bottom: 1rem; font-size: 0.95rem; display: block; }
.radio-list { display: flex; flex-direction: column; gap: 0.5rem; }
.radio-item { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-size: 0.9rem; }
.radio-item:hover { color: #a8690a; }
.radio-item input { width: 1rem; height: 1rem; accent-color: #a8690a; cursor: pointer; }
.price-range-labels { display: flex; justify-content: space-between; font-size: 0.875rem; margin-top: 0.5rem; }
.price-max { font-weight: 700; color: #a8690a; }
.cart-trigger-wrap { margin-top: 1rem; }
.cart-trigger-btn {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  padding: 0.75rem 1rem; background: #f2b705;
  color: #111827; border: none; border-radius: 0.75rem; font-size: 1rem; font-weight: 700;
  cursor: pointer; position: relative; box-shadow: 0 4px 16px rgba(242,183,5,0.4);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}
.cart-trigger-btn:hover { transform: translateY(-2px); background: #c98f04; box-shadow: 0 8px 24px rgba(242,183,5,0.5); }
.cart-trigger-icon { display: flex; align-items: center; }
.cart-trigger-badge {
  position: absolute; top: -6px; right: -6px;
  background: #ef4444; color: #fff; border-radius: 9999px;
  font-size: 0.72rem; font-weight: 700; min-width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px; border: 2px solid #fff;
}

/* ── Grid ── */
.products-content { flex: 1; }
.no-products { text-align: center; padding: 3rem; }
.no-products-text { color: #6b7280; font-size: 1.125rem; margin-top: 1rem; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

/* ── Product Card (desktop) ── */
.pcard { cursor: pointer; display: flex; flex-direction: column; }
.pcard-img {
  position: relative; height: 16rem;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 0.5rem; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
:global(.dark) .pcard-img { background: linear-gradient(135deg, #1f2937, #374151); }
.pcard-icon { font-size: 4rem; }
.pcard-real-img { width: 100%; height: 100%; object-fit: cover; }
.stock-badge {
  position: absolute; top: 1rem; left: 1rem;
  padding: 0.25rem 0.75rem; border-radius: 9999px;
  font-size: 0.75rem; font-weight: 700; color: #ffffff;
}
.badge-in { background-color: #22c55e; }
.badge-out { background-color: #ef4444; }
.discount-badge {
  position: absolute; top: 1rem; right: 1rem;
  background: #f2b705; color: #111827;
  padding: 0.25rem 0.75rem; border-radius: 9999px;
  font-size: 0.75rem; font-weight: 800;
  box-shadow: 0 2px 8px rgba(242,183,5,0.4);
}
.pcard-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: all 0.3s;
}
.pcard:hover .pcard-overlay { background: rgba(0,0,0,0.4); opacity: 1; }
.pcard-body { margin-top: 1rem; display: flex; flex-direction: column; flex: 1; }
.pcard-name { font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; }
.pcard:hover .pcard-name { color: #a8690a; }
.pcard-desc {
  color: #4b5563; font-size: 0.875rem;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; min-height: 2.5rem; line-height: 1.43;
}
:global(.dark) .pcard-desc { color: #9ca3af; }
.pcard-meta { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 0.75rem; margin-bottom: 1rem; }
.pcard-price { display: flex; align-items: baseline; gap: 0.5rem; }
.price-current { font-size: 1.5rem; font-weight: 800; color: #a8690a; }
.price-original { color: #9ca3af; text-decoration: line-through; font-size: 0.875rem; }
.pcard-rating { display: flex; align-items: center; gap: 0.25rem; }
.rating-val { font-size: 0.875rem; color: #4b5563; }
:global(.dark) .rating-val { color: #9ca3af; }
.add-cart-btn {
  width: 100%; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600;
  border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: 0.5rem; transition: all 0.3s; font-size: 0.9rem;
}
.add-cart-active { background: #f2b705; color: #111827; }
.add-cart-active:hover { box-shadow: 0 8px 20px rgba(242,183,5,0.4); transform: scale(1.02); background: #c98f04; }
.add-cart-disabled { background-color: #d1d5db; color: #6b7280; cursor: not-allowed; }
:global(.dark) .add-cart-disabled { background-color: #374151; color: #9ca3af; }

/* ════════════════════════════════════════
   手机版 Filter Bar  (≤ 768px only)
   ════════════════════════════════════════ */
.mobile-filterbar {
  display: none;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
:global(.dark) .mobile-filterbar { background: #111827; border-color: #1f2937; }

@media (max-width: 768px) {
  .mobile-filterbar { display: block; }
  .sidebar { display: none !important; }
  .products-layout { padding-top: 0.75rem; }
  /* 手机版 grid: 2列紧凑卡片 */
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  /* 手机版产品卡片重设计 */
  .pcard-img { height: 10rem; border-radius: 0.5rem 0.5rem 0 0; }
  .pcard-body { margin-top: 0; padding: 0.6rem 0.5rem 0.75rem; background: #fff; border-radius: 0 0 0.5rem 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
  :global(.dark) .pcard-body { background: #1f2937; }
  .pcard { border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); overflow: hidden; }
  :global(.dark) .pcard { box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
  .pcard-name { font-size: 0.82rem; font-weight: 700; margin-bottom: 0.2rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .pcard-desc { font-size: 0.72rem; min-height: unset; -webkit-line-clamp: 1; margin-bottom: 0.3rem; }
  .price-current { font-size: 1rem; }
  .price-original { font-size: 0.72rem; }
  .pcard-meta { padding-top: 0.3rem; margin-bottom: 0.5rem; }
  .rating-val { font-size: 0.72rem; }
  .add-cart-btn { font-size: 0.75rem; padding: 0.45rem 0.5rem; gap: 0.3rem; border-radius: 0.4rem; }
  .add-cart-btn svg { width: 14px; height: 14px; }
  .stock-badge { font-size: 0.62rem; padding: 0.15rem 0.45rem; top: 0.5rem; left: 0.5rem; }
  .discount-badge { font-size: 0.62rem; padding: 0.15rem 0.45rem; top: 0.5rem; right: 0.5rem; }
}

/* ── 搜索展开栏 ── */
.msearch-bar {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 0.875rem;
  background: #fff; border-bottom: 2px solid #f2b705;
  box-shadow: 0 2px 10px rgba(242,183,5,0.15);
}
:global(.dark) .msearch-bar { background: #1f2937; border-color: #f2b705; }
.msearch-input {
  flex: 1; border: none; outline: none; background: transparent;
  font-size: 0.9rem; color: #111827; min-width: 0;
}
:global(.dark) .msearch-input { color: #f3f4f6; }
.msearch-input::placeholder { color: #9ca3af; }
.msearch-clear {
  display: flex; align-items: center; justify-content: center;
  background: #e5e7eb; border: none; border-radius: 50%;
  width: 20px; height: 20px; cursor: pointer; color: #6b7280;
  flex-shrink: 0; transition: background 0.15s;
}
.msearch-clear:hover { background: #d1d5db; }
:global(.dark) .msearch-clear { background: #374151; color: #9ca3af; }
.msearch-cancel { background: none; border: none; color: #a8690a; font-size: 0.82rem; font-weight: 700; cursor: pointer; white-space: nowrap; padding: 0; flex-shrink: 0; }
.msearch-slide-enter-active { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
.msearch-slide-leave-active { transition: all 0.15s ease-in; }
.msearch-slide-enter-from, .msearch-slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── 横向滚动区 ── */
.mfb-scroll {
  overflow-x: auto; overflow-y: visible;
  -webkit-overflow-scrolling: touch; scrollbar-width: none;
  padding: 0.5rem 0.75rem;
}
.mfb-scroll::-webkit-scrollbar { display: none; }
.mfb-row {
  display: flex; align-items: center; gap: 0.4rem;
  width: max-content;
}

/* ── 分隔线 ── */
.mfb-sep { width: 1px; height: 16px; background: #e5e7eb; flex-shrink: 0; margin: 0 0.1rem; }
:global(.dark) .mfb-sep { background: #374151; }

/* ── chip 包裹（dropdown 定位用） ── */
.mfb-wrap { position: relative; flex-shrink: 0; }

/* ── Chip 基础 ── */
.mfb-chip {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.38rem 0.7rem;
  border-radius: 12px;
  font-size: 0.85rem; font-weight: 500;
  border: 1.5px solid #e5e7eb;
  background: #0000001f; color: #000000;
  cursor: pointer; white-space: nowrap; position: relative;
  transition: border-color 0.15s, color 0.15s, background 0.15s, box-shadow 0.15s;
  user-select: none; flex-shrink: 0;
}
:global(.dark) .mfb-chip { background: #1f2937; border-color: #374151; color: #d1d5db; }
.mfb-chip:hover:not(.mfb-chip--cart) { border-color: #f2b705; color: #111827; background: #fdf1d6; }
:global(.dark) .mfb-chip:hover:not(.mfb-chip--cart) { background: rgba(242,183,5,0.08); color: #f2b705; border-color: #f2b705; }

/* 激活态 */
.mfb-chip--on {
  background: #fdf1d6 !important;
  border-color: #f2b705 !important;
  color: #111827 !important;
  font-weight: 700 !important;
  box-shadow: 0 1px 6px rgba(242,183,5,0.25);
}
:global(.dark) .mfb-chip--on { background: rgba(242,183,5,0.12) !important; color: #f2b705 !important; border-color: #f2b705 !important; }

/* 更多筛选虚线 */
.mfb-chip--more { border-style: dashed; }
.mfb-chip--more.mfb-chip--on { border-style: solid; }

/* 购物车 chip */
.mfb-chip--cart {
  background: #f2b705 !important;
  border-color: transparent !important;
  color: #111827 !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 10px rgba(242,183,5,0.4);
}

/* chip 文字 */
.mfb-chip__txt { max-width: 5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* 箭头 */
.mfb-arr { transition: transform 0.2s; flex-shrink: 0; }
.mfb-arr--up { transform: rotate(180deg); }

/* 小黄点（已激活指示） */
.mfb-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #f2b705; flex-shrink: 0;
}

/* badge */
.mfb-badge {
  display: inline-flex; align-items: center; justify-content: center;
  background: #f2b705; color: #111827;
  border-radius: 9999px; font-size: 0.6rem; font-weight: 800;
  min-width: 16px; height: 16px; padding: 0 3px; flex-shrink: 0;
}
.mfb-badge--red { background: #ef4444; color: #fff; }

/* ── Dropdown ── */
.mfb-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 200;
  background: #fff; border: 1.5px solid #e5e7eb;
  border-radius: 0.875rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  min-width: 140px; overflow: hidden; padding: 0.3rem 0;
}
:global(.dark) .mfb-dropdown { background: #1f2937; border-color: #374151; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
.mfb-pop-enter-active { transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1); }
.mfb-pop-leave-active { transition: all 0.12s ease-in; }
.mfb-pop-enter-from, .mfb-pop-leave-to { opacity: 0; transform: translateY(-6px) scale(0.96); }

.mfb-ditem {
  display: block; width: 100%; padding: 0.55rem 1rem;
  font-size: 0.82rem; font-weight: 500; color: #374151;
  background: none; border: none; text-align: left;
  cursor: pointer; transition: background 0.12s, color 0.12s; white-space: nowrap;
}
:global(.dark) .mfb-ditem { color: #d1d5db; }
.mfb-ditem:hover { background: #fdf1d6; color: #111827; }
:global(.dark) .mfb-ditem:hover { background: rgba(242,183,5,0.08); color: #f2b705; }
.mfb-ditem--on { color: #111827 !important; font-weight: 700 !important; background: #fdf1d6 !important; }
:global(.dark) .mfb-ditem--on { background: rgba(242,183,5,0.12) !important; color: #f2b705 !important; }
.mfb-ditem--on::before { content: '✓ '; font-size: 0.75rem; }

/* 价格 dropdown */
.mfb-dropdown--price { min-width: 200px; padding: 0.75rem 1rem 0.65rem; }
.mfb-plabel { font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
:global(.dark) .mfb-plabel { color: #d1d5db; }
.mfb-range { width: 100%; accent-color: #f2b705; margin: 0.15rem 0 0.4rem; }
.mfb-prow { display: flex; justify-content: space-between; font-size: 0.75rem; color: #6b7280; margin-bottom: 0.6rem; }
:global(.dark) .mfb-prow { color: #9ca3af; }
.mfb-pconfirm {
  width: 100%; padding: 0.5rem;
  background: #f2b705;
  color: #111827; border: none; border-radius: 0.6rem;
  font-size: 0.82rem; font-weight: 800; cursor: pointer; transition: background 0.15s, box-shadow 0.15s;
}
.mfb-pconfirm:hover { background: #c98f04; box-shadow: 0 4px 12px rgba(242,183,5,0.4); }

/* backdrop */
.mfb-backdrop { position: fixed; inset: 0; z-index: 150; }

/* ── 已激活筛选 tag 行 ── */
.mfb-active-row {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.75rem 0.5rem;
  overflow-x: auto; scrollbar-width: none;
  border-top: 1px solid #f9fafb;
}
:global(.dark) .mfb-active-row { border-color: #1f2937; }
.mfb-active-row::-webkit-scrollbar { display: none; }
.mfb-tag {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.25rem 0.6rem; border-radius: 9999px;
  background: #fdf1d6; color: #111827;
  font-size: 0.72rem; font-weight: 600;
  border: 1px solid #f2b705; cursor: pointer; white-space: nowrap; flex-shrink: 0;
  transition: background 0.15s, box-shadow 0.15s;
}
.mfb-tag:hover { background: #f6dba0; box-shadow: 0 1px 6px rgba(242,183,5,0.3); }
.mfb-tag-x { font-size: 0.65rem; opacity: 0.7; }
.mfb-clear-all {
  margin-left: auto; flex-shrink: 0;
  background: none; border: none;
  color: #9ca3af; font-size: 0.72rem; font-weight: 600;
  cursor: pointer; white-space: nowrap; padding: 0.2rem 0;
}
.mfb-clear-all:hover { color: #ef4444; }

/* ════════════════════════════════════════
   Filter Drawer
   ════════════════════════════════════════ */
.filter-drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  z-index: 1500; backdrop-filter: blur(1px);
}
.filter-drawer {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 1501;
  background: #fff; border-radius: 1.5rem 1.5rem 0 0;
  max-height: 88vh; display: flex; flex-direction: column;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.2); overflow: hidden;
}
:global(.dark) .filter-drawer { background: #111827; }
.drawer-grip { width: 36px; height: 3.5px; background: #d1d5db; border-radius: 9999px; margin: 0.85rem auto 0; flex-shrink: 0; }
:global(.dark) .drawer-grip { background: #374151; }
.drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem 0.875rem; border-bottom: 1px solid #f3f4f6; flex-shrink: 0; }
:global(.dark) .drawer-head { border-color: #1f2937; }
.drawer-title { font-size: 1.05rem; font-weight: 700; }
.drawer-head-actions { display: flex; align-items: center; gap: 0.65rem; }
.drawer-reset-btn { background: none; border: none; color: #a8690a; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
.drawer-close-btn { background: #f3f4f6; border: none; color: #374151; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
:global(.dark) .drawer-close-btn { background: #374151; color: #f9fafb; }
.drawer-close-btn:hover { background: #e5e7eb; }
.drawer-body { flex: 1; overflow-y: auto; }
.drawer-section { padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6; }
:global(.dark) .drawer-section { border-color: #1f2937; }
.drawer-section:last-child { border-bottom: none; }
.drawer-section-label { font-size: 0.85rem; font-weight: 700; color: #374151; margin-bottom: 0.65rem; }
:global(.dark) .drawer-section-label { color: #d1d5db; }
.drawer-price-tag { color: #a8690a; font-weight: 700; margin-left: 0.5rem; }
.drawer-range { width: 100%; accent-color: #f2b705; margin: 0.3rem 0; }
.drawer-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }
.drawer-chip {
  padding: 0.38rem 0.85rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 500;
  border: 1.5px solid #e5e7eb; background: #fff; color: #374151;
  cursor: pointer; transition: all 0.15s;
}
:global(.dark) .drawer-chip { background: #1f2937; border-color: #374151; color: #d1d5db; }
.drawer-chip:hover { border-color: #f2b705; color: #111827; background: #fdf1d6; }
:global(.dark) .drawer-chip:hover { background: rgba(242,183,5,0.08); color: #f2b705; border-color: #f2b705; }
.drawer-chip-active { background: #f2b705 !important; border-color: transparent !important; color: #111827 !important; font-weight: 700 !important; box-shadow: 0 2px 8px rgba(242,183,5,0.4); }
.drawer-footer { padding: 0.875rem 1.25rem; border-top: 1px solid #f3f4f6; flex-shrink: 0; background: #fff; }
:global(.dark) .drawer-footer { border-color: #1f2937; background: #111827; }
.drawer-apply-btn {
  width: 100%; padding: 0.875rem;
  background: #f2b705;
  color: #111827; border: none; border-radius: 0.875rem;
  font-size: 1rem; font-weight: 800; cursor: pointer;
  box-shadow: 0 4px 16px rgba(242,183,5,0.4); transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}
.drawer-apply-btn:hover { transform: translateY(-1px); background: #c98f04; box-shadow: 0 6px 24px rgba(242,183,5,0.5); }
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.25s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-slide-enter-active { transition: transform 0.32s cubic-bezier(0.32,0.72,0,1); }
.drawer-slide-leave-active { transition: transform 0.22s ease-in; }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateY(100%); }

/* ════════════════════════════════════════
   Modal / Cart / Checkout / Detail
   ════════════════════════════════════════ */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.modal-md { background: #fff; border-radius: 1rem; width: 100%; max-width: 540px; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
.modal-sm { background: #fff; border-radius: 1rem; width: 100%; max-width: 360px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
:global(.dark) .modal-md, :global(.dark) .modal-sm { background: #1f2937; color: #f9fafb; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; }
:global(.dark) .modal-header { border-color: #374151; }
.modal-title { font-size: 1.2rem; font-weight: 700; }
.modal-close-btn { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: #6b7280; padding: 0.25rem 0.5rem; border-radius: 0.25rem; transition: background 0.2s; }
.modal-close-btn:hover { background: #f3f4f6; color: #111827; }
:global(.dark) .modal-close-btn:hover { background: #374151; color: #f9fafb; }
.modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; }
:global(.dark) .modal-footer { border-color: #374151; }
.cart-empty { text-align: center; color: #9ca3af; padding: 2rem 0; }
.cart-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; }
:global(.dark) .cart-item { border-color: #374151; }
.cart-item-icon { font-size: 2rem; flex-shrink: 0; }
.cart-item-info { flex: 1; min-width: 0; }
.cart-item-name { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-item-price { color: #a8690a; font-size: 0.85rem; margin-top: 0.2rem; font-weight: 700; }
.cart-item-qty { display: flex; align-items: center; gap: 0.4rem; }
.qty-btn { background: #f3f4f6; border: none; border-radius: 0.3rem; width: 26px; height: 26px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
:global(.dark) .qty-btn { background: #374151; color: #f9fafb; }
.qty-btn:hover { background: #e5e7eb; }
.qty-val { min-width: 20px; text-align: center; font-weight: 600; }
.cart-item-subtotal { font-weight: 700; color: #111827; font-size: 0.9rem; flex-shrink: 0; }
:global(.dark) .cart-item-subtotal { color: #f9fafb; }
.cart-item-remove { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: 0.6; transition: opacity 0.2s; }
.cart-item-remove:hover { opacity: 1; }
.cart-total-row { display: flex; justify-content: space-between; padding: 1rem 0 0; font-size: 1rem; font-weight: 600; }
.cart-total-val { color: #a8690a; font-size: 1.2rem; font-weight: 800; }
.order-summary { background: #f9fafb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem; }
:global(.dark) .order-summary { background: #111827; }
.order-summary-title { font-weight: 700; margin-bottom: 0.75rem; }
.order-line { display: flex; justify-content: space-between; font-size: 0.9rem; padding: 0.25rem 0; color: #4b5563; }
:global(.dark) .order-line { color: #9ca3af; }
.order-total { border-top: 1px solid #e5e7eb; margin-top: 0.75rem; padding-top: 0.75rem; display: flex; justify-content: flex-end; }
:global(.dark) .order-total { border-color: #374151; }
.form-group { margin-bottom: 1.25rem; }
.form-label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-input { width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.65rem 0.85rem; font-size: 0.95rem; outline: none; transition: border-color 0.2s; background: #fff; color: #111827; box-sizing: border-box; }
.form-input:focus { border-color: #f2b705; box-shadow: 0 0 0 3px rgba(242,183,5,0.15); }
:global(.dark) .form-input { background: #374151; border-color: #4b5563; color: #f9fafb; }
.form-error { color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem; }
.modal-detail { background: #fff; border-radius: 1rem; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative; }
:global(.dark) .modal-detail { background: #1f2937; color: #f9fafb; }
.detail-close { position: absolute; top: 1rem; right: 1rem; z-index: 10; background: rgba(0,0,0,0.35); color: #fff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
.detail-close:hover { background: rgba(0,0,0,0.6); }
.detail-main-img { height: 280px; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); display: flex; align-items: center; justify-content: center; border-radius: 1rem 1rem 0 0; overflow: hidden; cursor: zoom-in; position: relative; }
:global(.dark) .detail-main-img { background: linear-gradient(135deg, #111827, #374151); }
.detail-main-icon { font-size: 6rem; }
.detail-real-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
.detail-main-img:hover .detail-real-img { transform: scale(1.02); }
.zoom-hint { position: absolute; bottom: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.5); color: #fff; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 9999px; pointer-events: none; opacity: 0; transition: opacity 0.2s; }
.detail-main-img:hover .zoom-hint { opacity: 1; }
.detail-thumbs-wrap { overflow-x: auto; padding: 0.75rem 1.25rem; scrollbar-width: thin; }
.detail-thumbs { display: flex; gap: 0.6rem; min-width: max-content; }
.detail-thumb { width: 60px; height: 60px; border-radius: 0.4rem; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; border: 2px solid transparent; flex-shrink: 0; transition: border-color 0.2s; }
:global(.dark) .detail-thumb { background: #374151; }
.thumb-active { border-color: #f2b705; box-shadow: 0 0 0 2px rgba(242,183,5,0.3); }
.thumb-real-img { width: 100%; height: 100%; object-fit: cover; }
.detail-info { padding: 1.25rem 1.5rem 1rem; }
.detail-info-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.detail-name { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.3rem; }
.detail-desc { color: #6b7280; font-size: 0.9rem; }
:global(.dark) .detail-desc { color: #9ca3af; }
.share-btn { display: flex; align-items: center; gap: 0.4rem; background: #f3f4f6; border: none; border-radius: 0.5rem; padding: 0.5rem 0.85rem; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: #374151; white-space: nowrap; flex-shrink: 0; transition: background 0.2s; }
.share-btn:hover { background: #e5e7eb; }
:global(.dark) .share-btn { background: #374151; color: #e5e7eb; }
:global(.dark) .share-btn:hover { background: #4b5563; }
.detail-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.detail-price-wrap { display: flex; align-items: baseline; gap: 0.6rem; }
.detail-price { font-size: 1.8rem; font-weight: 800; color: #a8690a; }
.detail-original { text-decoration: line-through; color: #9ca3af; font-size: 1rem; }
.detail-discount { background: #f2b705; color: #111827; font-size: 0.8rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 9999px; }
.detail-rating { font-size: 0.95rem; color: #6b7280; }
.detail-stock { font-size: 0.9rem; font-weight: 600; margin-bottom: 1.25rem; }
.stock-in { color: #16a34a; }
.stock-out { color: #dc2626; }
.detail-add-btn { margin-top: 0; font-size: 1rem; padding: 0.75rem 1rem; }
.detail-footer-info { display: flex; gap: 1.5rem; padding: 1rem 1.5rem 1.5rem; border-top: 1px solid #f3f4f6; font-size: 0.85rem; color: #6b7280; }
:global(.dark) .detail-footer-info { border-color: #374151; color: #9ca3af; }
.share-body { display: flex; flex-direction: column; gap: 0.75rem; }
.share-option { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border: 1px solid #e5e7eb; border-radius: 0.6rem; background: #fff; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: background 0.2s; text-align: left; }
.share-option:hover { background: #f9fafb; }
:global(.dark) .share-option { background: #374151; border-color: #4b5563; color: #f9fafb; }
:global(.dark) .share-option:hover { background: #4b5563; }
.share-option-icon { font-size: 1.25rem; }
.copy-tip { margin-left: auto; color: #16a34a; font-size: 0.8rem; font-weight: 700; }
.share-tg { opacity: 0.7; cursor: default; }
.share-note { margin-left: auto; color: #9ca3af; font-size: 0.78rem; }
.toast-msg { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #111827; color: #fff; padding: 0.65rem 1.5rem; border-radius: 9999px; font-size: 0.9rem; font-weight: 500; z-index: 2000; box-shadow: 0 4px 16px rgba(0,0,0,0.3); pointer-events: none; }
.btn-outline-gray { padding: 0.5rem 1.25rem; border: 1px solid #d1d5db; background: none; border-radius: 0.5rem; cursor: pointer; font-size: 0.9rem; font-weight: 500; color: #374151; transition: background 0.2s; }
.btn-outline-gray:hover { background: #f3f4f6; }
:global(.dark) .btn-outline-gray { border-color: #4b5563; color: #e5e7eb; }
:global(.dark) .btn-outline-gray:hover { background: #374151; }
.lightbox-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.lightbox-img-wrap { position: relative; max-width: 90vw; max-height: 90vh; display: flex; align-items: center; justify-content: center; }
.lightbox-img { max-width: 80vw; max-height: 85vh; object-fit: contain; border-radius: 0.5rem; box-shadow: 0 0 60px rgba(0,0,0,0.6); animation: lbFadeIn 0.2s ease; }
@keyframes lbFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.lightbox-close { position: absolute; top: 1.25rem; right: 1.25rem; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 38px; height: 38px; border-radius: 50%; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: background 0.2s; }
.lightbox-close:hover { background: rgba(255,255,255,0.3); }
.lightbox-arrow { background: rgba(255,255,255,0.15); border: none; color: #fff; width: 50px; height: 50px; border-radius: 50%; font-size: 2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.2s; flex-shrink: 0; line-height: 1; padding-bottom: 3px; }
.lightbox-arrow:hover:not(:disabled) { background: rgba(255,255,255,0.3); transform: scale(1.1); }
.lightbox-arrow:disabled { opacity: 0.2; cursor: not-allowed; }
.lightbox-counter { position: absolute; bottom: -2rem; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.7); font-size: 0.85rem; white-space: nowrap; }
.card-hover { transition: box-shadow 0.2s, transform 0.2s; }
.card-hover:hover { transform: translateY(-2px); }
.btn-primary { padding: 0.5rem 1.25rem; background: #f2b705; color: #111827; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 0.9rem; font-weight: 700; transition: background 0.2s, box-shadow 0.2s; }
.btn-primary:hover { background: #c98f04; box-shadow: 0 4px 14px rgba(242,183,5,0.4); }
</style>