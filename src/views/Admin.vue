<template>
  <div class="admin-page">
    <!-- Admin Header -->
    <div class="admin-header">
      <div class="container">
        <h1 class="admin-title">{{ t('admin.title') }}</h1>
        <p class="admin-welcome">Welcome, {{ user.username }}!</p>
      </div>
    </div>

    <div class="container admin-body">
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f97316, #eab308)">📦</div>
          <div>
            <p class="stat-label">Products</p>
            <p class="stat-value">{{ store.products.length }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #22c55e, #16a34a)">📊</div>
          <div>
            <p class="stat-label">Orders</p>
            <p class="stat-value">{{ store.orders.length }}</p>
          </div>
        </div>
      </div>

      <!-- Tab Panel -->
      <div class="tab-panel">
        <div class="tab-headers">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="['tab-btn', activeTab === tab.key ? 'tab-active' : '']"
          >
            {{ t(`admin.${tab.key}`) }}
          </button>
        </div>

        <div class="tab-content">

          <!-- Dashboard -->
          <div v-if="activeTab === 'dashboard'">
            <h2 class="tab-title">{{ t('admin.dashboard') }}</h2>
            <div class="dash-grid">
              <div class="dash-card dash-orange">
                <h3 class="dash-card-title">Sales Overview</h3>
                <div class="dash-chart">📈 Chart</div>
              </div>
              <div class="dash-card dash-blue">
                <h3 class="dash-card-title">Recent Activity</h3>
                <ul class="activity-list">
                  <li>✓ New order from customer</li>
                  <li>✓ Product inventory updated</li>
                  <li>✓ New user registration</li>
                  <li>✓ Payment received</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Products -->
          <div v-if="activeTab === 'products'">
            <div class="tab-topbar">
              <h2 class="tab-title">{{ t('admin.products') }}</h2>
              <button class="btn-primary" @click="openAddProduct">{{ t('admin.addProduct') }}</button>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in store.products" :key="p.id">
                    <td>{{ p.name }}</td>
                    <td>{{ p.category }}</td>
                    <td><strong>${{ p.price }}</strong></td>
                    <td><span class="badge badge-green">{{ p.stock }}</span></td>
                    <td>
                      <button class="action-btn action-edit" @click="openEditProduct(p)">编辑</button>
                      <button class="action-btn action-delete" @click="deleteProduct(p.id)">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Users -->
          <div v-if="activeTab === 'users'">
            <h2 class="tab-title">{{ t('admin.users') }}</h2>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, idx) in adminUsers" :key="u.id">
                    <td>{{ u.username }}</td>
                    <td>{{ u.email }}</td>
                    <td><span class="badge badge-blue">{{ u.role }}</span></td>
                    <td><span :class="['badge', u.active ? 'badge-green' : 'badge-red']">{{ u.active ? 'Active' : 'Suspended' }}</span></td>
                    <td>
                      <button class="action-btn action-edit" @click="openEditUser(u, idx)">编辑</button>
                      <button class="action-btn action-delete" @click="toggleUserStatus(idx)">{{ u.active ? '停用' : '启用' }}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Orders -->
          <div v-if="activeTab === 'orders'">
            <h2 class="tab-title">{{ t('admin.orders') }}</h2>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="o in store.orders" :key="o.id">
                    <td><strong>{{ o.id }}</strong></td>
                    <td>{{ o.customer }}</td>
                    <td><strong>${{ o.amount }}</strong></td>
                    <td><span :class="['badge', o.status === 'Pending' ? 'badge-yellow' : 'badge-green']">{{ o.status }}</span></td>
                    <td>{{ o.date }}</td>
                    <td>
                      <button class="action-btn action-edit" @click="openOrderDetail(o)">查看</button>
                      <button class="action-btn action-delete" @click="deleteOrder(o.id)">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Feedbacks -->
          <div v-if="activeTab === 'feedbacks'">
            <div class="tab-topbar">
              <h2 class="tab-title">{{ t('admin.feedbacks') }}</h2>
              <span class="badge badge-red" style="font-size:0.85rem;padding:0.3rem 0.8rem;" v-if="unreadCount > 0">{{ unreadCount }} 未读</span>
            </div>
            <div v-if="store.feedbacks.length === 0" style="text-align:center;padding:3rem;color:#9ca3af;">
              <p>暂无留言反馈</p>
            </div>
            <div v-else class="feedback-list">
              <div
                v-for="fb in store.feedbacks"
                :key="fb.id"
                :class="['feedback-card', fb.read ? 'fb-read' : 'fb-unread']"
              >
                <div class="fb-header">
                  <div class="fb-meta">
                    <span class="fb-dot" v-if="!fb.read">●</span>
                    <strong class="fb-name">{{ fb.name }}</strong>
                    <span class="fb-email">{{ fb.email }}</span>
                    <span class="fb-id">{{ fb.id }}</span>
                  </div>
                  <div class="fb-actions">
                    <span class="fb-date">{{ fb.date }}</span>
                    <button class="action-btn action-edit" @click="openFeedbackDetail(fb)">查看</button>
                    <button class="action-btn action-delete" @click="deleteFeedback(fb.id)">删除</button>
                  </div>
                </div>
                <p class="fb-preview" @click="openFeedbackDetail(fb)">{{ fb.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showProductModal" class="modal-overlay" @click.self="closeProductModal">
      <div class="modal-md">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingProduct ? '编辑产品' : '添加产品' }}</h2>
          <button class="modal-close-btn" @click="closeProductModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">产品名称</label>
            <input v-model="productForm.name" class="form-input" placeholder="请输入产品名称" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">分类</label>
              <select v-model="productForm.category" class="form-input">
                <option value="engine">发动机配件</option>
                <option value="suspension">悬挂系统</option>
                <option value="brakes">刹车系统</option>
                <option value="wheels">轮胎轮圈</option>
                <option value="accessories">配件配饰</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">价格 ($)</label>
              <input v-model.number="productForm.price" class="form-input" type="number" placeholder="0" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">库存数量</label>
            <input v-model.number="productForm.stock" class="form-input" type="number" placeholder="0" />
          </div>

          <div class="form-group">
            <label class="form-label">产品描述</label>
            <textarea
              v-model="productForm.description"
              class="form-input form-textarea"
              placeholder="请输入产品描述（将显示在产品卡片和详情页）"
              rows="3"
            ></textarea>
          </div>

          <!-- 大图上传 -->
          <div class="form-group">
            <label class="form-label">主图（大图）</label>
            <div class="img-upload-zone" @click="!uploadingMain && triggerMainImg()">
              <span v-if="uploadingMain" class="img-upload-placeholder">
                <span class="upload-spinner">⏳</span> 上传中...
              </span>
              <span v-else-if="!productForm.mainImg" class="img-upload-placeholder">
                📷 点击上传主图
              </span>
              <div v-else class="img-preview-wrap">
                <img :src="productForm.mainImg" class="img-preview" alt="main" />
                <button class="img-remove-btn" @click.stop="productForm.mainImg = ''">✕</button>
              </div>
            </div>
            <input ref="mainImgInput" type="file" accept="image/*" style="display:none" @change="onMainImgChange" />
          </div>

          <!-- 小图上传 -->
          <div class="form-group">
            <label class="form-label">小图（最多6张）</label>
            <div class="thumb-upload-list">
              <div
                v-for="(thumb, idx) in productForm.thumbs"
                :key="idx"
                class="thumb-upload-item"
              >
                <img :src="thumb" class="thumb-preview" alt="" />
                <button class="img-remove-btn thumb-remove" @click="removeThumb(idx)">✕</button>
              </div>
              <div v-if="productForm.thumbs.length < 6" class="thumb-add-btn" @click="!uploadingThumb && triggerThumbImg()">
                <span v-if="uploadingThumb">⏳</span>
                <span v-else>＋</span>
              </div>
            </div>
            <input ref="thumbImgInput" type="file" accept="image/*" style="display:none" @change="onThumbImgChange" />
          </div>

          <p v-if="productError" class="form-error">{{ productError }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-outline-gray" @click="closeProductModal">取消</button>
          <button class="btn-primary" @click="saveProduct">{{ editingProduct ? '保存修改' : '添加产品' }}</button>
        </div>
      </div>
    </div>

    <!-- ===== 编辑用户弹窗 ===== -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="closeUserModal">
      <div class="modal-md">
        <div class="modal-header">
          <h2 class="modal-title">编辑用户</h2>
          <button class="modal-close-btn" @click="closeUserModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input v-model="userForm.username" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input v-model="userForm.email" class="form-input" type="email" />
          </div>
          <div class="form-group">
            <label class="form-label">角色</label>
            <select v-model="userForm.role" class="form-input">
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline-gray" @click="closeUserModal">取消</button>
          <button class="btn-primary" @click="saveUser">保存</button>
        </div>
      </div>
    </div>

    <!-- ===== 订单详情弹窗 ===== -->
    <div v-if="showOrderModal && selectedOrder" class="modal-overlay" @click.self="closeOrderModal">
      <div class="modal-md">
        <div class="modal-header">
          <h2 class="modal-title">📋 订单详情 — {{ selectedOrder.id }}</h2>
          <button class="modal-close-btn" @click="closeOrderModal">✕</button>
        </div>
        <div class="modal-body">
          <!-- 产品清单 -->
          <p class="section-subtitle">📦 购买产品</p>
          <div v-for="item in selectedOrder.items" :key="item.name" class="order-item-row">
            <span class="order-item-icon">{{ item.icon }}</span>
            <span class="order-item-name">{{ item.name }}</span>
            <span class="order-item-qty">× {{ item.qty }}</span>
            <span class="order-item-price">${{ item.price * item.qty }}</span>
          </div>
          <div class="order-total-row">
            <span>合计</span>
            <span class="order-total-val">${{ selectedOrder.amount }}</span>
          </div>

          <!-- 客户信息 -->
          <p class="section-subtitle" style="margin-top:1.5rem">👤 客户信息</p>
          <div class="customer-info-card">
            <div class="cinfo-row">
              <span class="cinfo-label">📞 电话</span>
              <span class="cinfo-val">{{ selectedOrder.phone }}</span>
            </div>
            <div class="cinfo-row">
              <span class="cinfo-label">💬 Facebook</span>
              <span class="cinfo-val">{{ selectedOrder.facebook }}</span>
            </div>
            <div class="cinfo-row">
              <span class="cinfo-label">📅 日期</span>
              <span class="cinfo-val">{{ selectedOrder.date }}</span>
            </div>
            <div class="cinfo-row">
              <span class="cinfo-label">📊 状态</span>
              <span :class="['badge', selectedOrder.status === 'Pending' ? 'badge-yellow' : 'badge-green']">
                {{ selectedOrder.status }}
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline-gray" @click="closeOrderModal">关闭</button>
        </div>
      </div>
    </div>

    <!-- ===== 留言详情弹窗 ===== -->
    <div v-if="showFeedbackModal && selectedFeedback" class="modal-overlay" @click.self="closeFeedbackModal">
      <div class="modal-md">
        <div class="modal-header">
          <h2 class="modal-title">💬 留言详情</h2>
          <button class="modal-close-btn" @click="closeFeedbackModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="customer-info-card" style="margin-bottom:1.25rem;">
            <div class="cinfo-row"><span class="cinfo-label">📋 编号</span><span class="cinfo-val">{{ selectedFeedback.id }}</span></div>
            <div class="cinfo-row"><span class="cinfo-label">👤 姓名</span><span class="cinfo-val">{{ selectedFeedback.name }}</span></div>
            <div class="cinfo-row"><span class="cinfo-label">📧 邮箱</span><span class="cinfo-val">{{ selectedFeedback.email }}</span></div>
            <div class="cinfo-row"><span class="cinfo-label">📅 日期</span><span class="cinfo-val">{{ selectedFeedback.date }}</span></div>
          </div>
          <p class="section-subtitle">💬 留言内容</p>
          <div class="fb-message-box">{{ selectedFeedback.message }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline-gray" @click="closeFeedbackModal">关闭</button>
          <button class="action-btn action-delete" style="padding:0.5rem 1.25rem;border:1px solid #fca5a5;border-radius:0.5rem;" @click="deleteFeedback(selectedFeedback.id); closeFeedbackModal()">删除留言</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="toast-msg">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '../stores/useStore'
import { supabase } from '../lib/supabase'
import { t } from '../assets/i18n'

const store = useAppStore()
const activeTab = ref('dashboard')
const user = store.user
const toast = ref('')

const tabs = [
  { key: 'dashboard' },
  { key: 'products' },
  { key: 'users' },
  { key: 'orders' },
  { key: 'feedbacks' },
]

// 组件挂载时刷新数据
onMounted(() => {
  store.refreshOrders()
  store.refreshProducts()
})

// ===== 产品数据 =====
// adminProducts 已移至 useStore.js，使用 store.products

// ===== 用户数据 =====
const adminUsers = ref([
  { id: 1, username: 'john_doe', email: 'john@example.com', role: 'Customer', active: true },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'Staff', active: true },
  { id: 3, username: 'bob_admin', email: 'bob@example.com', role: 'Admin', active: false },
])

// ===== 订单数据 - 从store中读取 =====
// adminOrders 已移至 useStore.js，使用 store.orders

// ===== 产品弹窗 =====
const showProductModal = ref(false)
const editingProduct = ref(null)
const editingProductIdx = ref(-1)
const productError = ref('')
const mainImgInput = ref(null)
const thumbImgInput = ref(null)
const productForm = ref({ name: '', description: '', category: 'engine', price: 0, stock: 0, mainImg: '', thumbs: [] })
const uploadingMain = ref(false)
const uploadingThumb = ref(false)

// 上传图片到 Supabase Storage，返回公开 URL
const uploadImageToStorage = async (file, folder = 'products') => {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { contentType: file.type, upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
  return data.publicUrl
}

const openAddProduct = () => {
  editingProduct.value = null
  productForm.value = { name: '', description: '', category: 'engine', price: 0, stock: 0, mainImg: '', thumbs: [] }
  productError.value = ''
  showProductModal.value = true
}
const openEditProduct = (p) => {
  editingProduct.value = p
  productForm.value = { name: p.name, description: p.description || '', category: p.category, price: p.price, stock: p.stock, mainImg: p.mainImg || '', thumbs: [...(p.thumbs || [])] }
  productError.value = ''
  showProductModal.value = true
}
const closeProductModal = () => { showProductModal.value = false }

const triggerMainImg = () => mainImgInput.value?.click()
const triggerThumbImg = () => thumbImgInput.value?.click()

const onMainImgChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploadingMain.value = true
  try {
    const url = await uploadImageToStorage(file, 'main')
    productForm.value.mainImg = url
    showToast('✅ 主图上传成功')
  } catch (err) {
    showToast('❌ 上传失败：' + err.message)
  } finally {
    uploadingMain.value = false
    e.target.value = ''
  }
}

const onThumbImgChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploadingThumb.value = true
  try {
    const url = await uploadImageToStorage(file, 'thumbs')
    productForm.value.thumbs.push(url)
    showToast('✅ 小图上传成功')
  } catch (err) {
    showToast('❌ 上传失败：' + err.message)
  } finally {
    uploadingThumb.value = false
    e.target.value = ''
  }
}
const removeThumb = (idx) => productForm.value.thumbs.splice(idx, 1)

const saveProduct = () => {
  productError.value = ''
  if (!productForm.value.name.trim()) { productError.value = '请填写产品名称'; return }
  if (editingProduct.value) {
    store.updateProduct(editingProduct.value.id, {
      name: productForm.value.name,
      description: productForm.value.description,
      category: productForm.value.category,
      price: productForm.value.price,
      stock: productForm.value.stock,
      mainImg: productForm.value.mainImg,
      thumbs: productForm.value.thumbs,
    })
    showToast('✅ 产品已更新')
  } else {
    store.addProduct({
      name: productForm.value.name,
      description: productForm.value.description,
      category: productForm.value.category,
      price: productForm.value.price,
      stock: productForm.value.stock,
      mainImg: productForm.value.mainImg,
      thumbs: productForm.value.thumbs,
    })
    showToast('✅ 产品已添加')
  }
  closeProductModal()
}
const deleteProduct = (productId) => {
  if (confirm('确认删除该产品？')) {
    store.removeProduct(productId)
    showToast('🗑 产品已删除')
  }
}

// ===== 用户弹窗 =====
const showUserModal = ref(false)
const editingUserIdx = ref(-1)
const userForm = ref({ username: '', email: '', role: 'Customer' })

const openEditUser = (u, idx) => {
  editingUserIdx.value = idx
  userForm.value = { username: u.username, email: u.email, role: u.role }
  showUserModal.value = true
}
const closeUserModal = () => { showUserModal.value = false }
const saveUser = () => {
  Object.assign(adminUsers.value[editingUserIdx.value], userForm.value)
  showToast('✅ 用户已更新')
  closeUserModal()
}
const toggleUserStatus = (idx) => {
  adminUsers.value[idx].active = !adminUsers.value[idx].active
  showToast(adminUsers.value[idx].active ? '✅ 用户已启用' : '⛔ 用户已停用')
}

// ===== 订单弹窗 =====
const showOrderModal = ref(false)
const selectedOrder = ref(null)
const openOrderDetail = (o) => { selectedOrder.value = o; showOrderModal.value = true }
const closeOrderModal = () => { showOrderModal.value = false }
const deleteOrder = (orderId) => {
  if (confirm('确认删除该订单？')) {
    store.removeOrder(orderId)
    showToast('🗑 订单已删除')
  }
}

// ===== 留言反馈弹窗 =====
const showFeedbackModal = ref(false)
const selectedFeedback = ref(null)
const unreadCount = computed(() => store.feedbacks.filter(f => !f.read).length)

const openFeedbackDetail = (fb) => {
  selectedFeedback.value = fb
  showFeedbackModal.value = true
  store.markFeedbackRead(fb.id)
}
const closeFeedbackModal = () => { showFeedbackModal.value = false }
const deleteFeedback = (id) => {
  if (confirm('确认删除该留言？')) {
    store.removeFeedback(id)
    showToast('🗑 留言已删除')
  }
}

const showToast = (msg) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2500)
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: #f9fafb;
}
:global(.dark) .admin-page { background-color: #030712; }

.admin-header {
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  padding: 1.5rem 0;
}
:global(.dark) .admin-header { background-color: #111827; }
.admin-title { font-size: 1.875rem; font-weight: 700; }
.admin-welcome { color: #4b5563; margin-top: 0.25rem; }
:global(.dark) .admin-welcome { color: #9ca3af; }

.admin-body { padding: 3rem 0; }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
}
@media (min-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
:global(.dark) .stat-card { background-color: #111827; }
.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.stat-label { font-size: 0.875rem; color: #4b5563; margin-bottom: 0.25rem; }
:global(.dark) .stat-label { color: #9ca3af; }
.stat-value { font-size: 1.5rem; font-weight: 700; }

/* Tabs */
.tab-panel {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
:global(.dark) .tab-panel { background-color: #111827; }

.tab-headers {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1.5rem;
  overflow-x: auto;
}
:global(.dark) .tab-headers { border-color: #1f2937; }

.tab-btn {
  padding: 1rem 0.25rem;
  margin-right: 2rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.3s;
  white-space: nowrap;
}
.tab-btn:hover { color: #111827; border-color: #d1d5db; }
:global(.dark) .tab-btn { color: #9ca3af; }
:global(.dark) .tab-btn:hover { color: #f3f4f6; border-color: #374151; }
.tab-active { border-color: #f97316 !important; color: #ea580c !important; }
:global(.dark) .tab-active { color: #fb923c !important; }

.tab-content { padding: 1.5rem; }
.tab-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; }
.tab-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.tab-topbar .tab-title { margin-bottom: 0; }

/* Dashboard */
.dash-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .dash-grid { grid-template-columns: 1fr 1fr; } }
.dash-card { border-radius: 0.5rem; padding: 1.5rem; }
.dash-orange { background: linear-gradient(135deg, #fff7ed, #fefce8); }
:global(.dark) .dash-orange { background: linear-gradient(135deg, #1f2937, #111827); }
.dash-blue { background: linear-gradient(135deg, #eff6ff, #dbeafe); }
:global(.dark) .dash-blue { background: linear-gradient(135deg, #1f2937, #111827); }
.dash-card-title { font-weight: 700; margin-bottom: 1rem; }
.dash-chart { height: 12rem; background-color: #ffffff; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 1.5rem; }
:global(.dark) .dash-chart { background-color: #374151; }
.activity-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; }

/* Table */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.data-table th, .data-table td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #f3f4f6; }
:global(.dark) .data-table th, :global(.dark) .data-table td { border-color: #1f2937; }
.data-table th { font-weight: 700; color: #6b7280; font-size: 0.8rem; text-transform: uppercase; }
:global(.dark) .data-table th { color: #9ca3af; }

/* Badges */
.badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
.badge-green { background: #dcfce7; color: #16a34a; }
.badge-blue { background: #dbeafe; color: #2563eb; }
.badge-yellow { background: #fef9c3; color: #ca8a04; }
.badge-red { background: #fee2e2; color: #dc2626; }

/* Action buttons */
.action-btn { background: none; border: none; cursor: pointer; font-size: 0.875rem; margin-right: 0.75rem; transition: text-decoration 0.2s; }
.action-btn:hover { text-decoration: underline; }
.action-edit { color: #2563eb; }
:global(.dark) .action-edit { color: #60a5fa; }
.action-delete { color: #dc2626; }
:global(.dark) .action-delete { color: #f87171; }

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
:global(.dark) .modal-md { background: #1f2937; color: #f9fafb; }
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
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; }
:global(.dark) .modal-footer { border-color: #374151; }

/* Form */
.form-group { margin-bottom: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
.form-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
.form-error { color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem; }

/* Image upload */
.img-upload-zone {
  width: 100%;
  height: 140px;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: border-color 0.2s;
}
.img-upload-zone:hover { border-color: #f97316; }
.img-upload-placeholder { color: #9ca3af; font-size: 0.9rem; }
.img-preview-wrap { position: relative; width: 100%; height: 100%; }
.img-preview { width: 100%; height: 100%; object-fit: cover; }
.img-remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-upload-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.thumb-upload-item { position: relative; width: 64px; height: 64px; }
.thumb-preview { width: 64px; height: 64px; object-fit: cover; border-radius: 0.4rem; border: 1px solid #e5e7eb; }
.thumb-remove { top: 2px; right: 2px; width: 18px; height: 18px; font-size: 0.65rem; }
.thumb-add-btn {
  width: 64px;
  height: 64px;
  border: 2px dashed #d1d5db;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #9ca3af;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.thumb-add-btn:hover { border-color: #f97316; color: #f97316; }

/* Order detail */
.section-subtitle { font-weight: 700; font-size: 0.95rem; color: #6b7280; margin-bottom: 0.75rem; }
:global(.dark) .section-subtitle { color: #9ca3af; }
.order-item-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.9rem;
}
:global(.dark) .order-item-row { border-color: #374151; }
.order-item-icon { font-size: 1.3rem; }
.order-item-name { flex: 1; }
.order-item-qty { color: #6b7280; }
.order-item-price { font-weight: 700; color: #f97316; }
.order-total-row { display: flex; justify-content: space-between; padding: 0.75rem 0 0; font-weight: 600; }
.order-total-val { color: #f97316; font-size: 1.1rem; font-weight: 700; }
.customer-info-card {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
}
:global(.dark) .customer-info-card { background: #111827; }
.cinfo-row { display: flex; align-items: center; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px solid #e5e7eb; }
:global(.dark) .cinfo-row { border-color: #374151; }
.cinfo-row:last-child { border-bottom: none; }
.cinfo-label { width: 90px; font-size: 0.85rem; color: #6b7280; flex-shrink: 0; }
:global(.dark) .cinfo-label { color: #9ca3af; }
.cinfo-val { font-weight: 600; font-size: 0.9rem; }

/* Feedback list */
.feedback-list { display: flex; flex-direction: column; gap: 0.75rem; }
.feedback-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.feedback-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #f97316; }
.fb-unread { border-left: 4px solid #f97316; background: #fff7ed; }
:global(.dark) .fb-unread { background: rgba(249,115,22,0.07); }
.fb-read { opacity: 0.75; }
.fb-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem; }
.fb-meta { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.fb-dot { color: #f97316; font-size: 0.6rem; }
.fb-name { font-weight: 700; font-size: 0.95rem; }
.fb-email { color: #6b7280; font-size: 0.82rem; }
:global(.dark) .fb-email { color: #9ca3af; }
.fb-id { background: #f3f4f6; color: #6b7280; padding: 0.1rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; }
:global(.dark) .fb-id { background: #374151; color: #9ca3af; }
.fb-actions { display: flex; align-items: center; gap: 0.75rem; }
.fb-date { font-size: 0.8rem; color: #9ca3af; }
.fb-preview {
  color: #374151;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}
:global(.dark) .fb-preview { color: #d1d5db; }
.fb-message-box {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
}
:global(.dark) .fb-message-box { background: #111827; border-color: #374151; color: #d1d5db; }

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
</style>
