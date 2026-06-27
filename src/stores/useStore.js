import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAppStore = defineStore('app', () => {
  // =============================================
  // UI 状态（保留 localStorage，不需要数据库）
  // =============================================
  const language = ref(localStorage.getItem('language') || 'zh')
  const darkMode = ref(localStorage.getItem('darkMode') === 'true')
  const isLoggedIn = ref(false)
  const user = ref(null)

  // 初始化时从 Supabase 恢复 session
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      isLoggedIn.value = true
      user.value = { email: data.session.user.email, role: 'admin' }
    }
  })

  // 监听 Supabase auth 状态变化（跨 tab 同步）
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      isLoggedIn.value = true
      user.value = { email: session.user.email, role: 'admin' }
    } else {
      isLoggedIn.value = false
      user.value = null
    }
  })

  // 购物车（只存本地，不需要数据库）
  const cart = ref(JSON.parse(localStorage.getItem('cart')) || [])

  // =============================================
  // 数据库数据
  // =============================================
  const products = ref([])
  const orders = ref([])
  const feedbacks = ref([])
  const loading = ref(false)

  // =============================================
  // UI 方法
  // =============================================
  const setLanguage = (lang) => {
    language.value = lang
    localStorage.setItem('language', lang)
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value)
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // login: 调 Supabase Auth，返回 { error }
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data.session) {
      isLoggedIn.value = true
      user.value = { email: data.session.user.email, role: 'admin' }
    }
    return { error }
  }

  // logout
  const logout = async () => {
    await supabase.auth.signOut()
    isLoggedIn.value = false
    user.value = null
  }


  // =============================================
  // 购物车（本地）
  // =============================================
  const addToCart = (product) => {
    const existing = cart.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.value.push({ ...product, quantity: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const removeFromCart = (productId) => {
    cart.value = cart.value.filter(item => item.id !== productId)
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const clearCart = () => {
    cart.value = []
    localStorage.setItem('cart', JSON.stringify([]))
  }

  const cartTotal = computed(() =>
    cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
  )

  const cartCount = computed(() =>
    cart.value.reduce((count, item) => count + item.quantity, 0)
  )

  // =============================================
  // 产品 — Supabase
  // =============================================
  const fetchProducts = async () => {
    loading.value = true
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error) {
      // 把 snake_case 转成 camelCase 给前端用
      products.value = data.map(p => ({
        ...p,
        originalPrice: p.original_price,
        inStock: p.in_stock,
        mainImg: p.main_img,
      }))
    }
    loading.value = false
  }

  const addProduct = async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description || '',
        category: productData.category || 'engine',
        price: productData.price || 0,
        original_price: productData.originalPrice || null,
        discount: productData.discount || 0,
        stock: productData.stock || 0,
        rating: productData.rating || 4.5,
        icon: productData.icon || '⚙️',
        main_img: productData.mainImg || '',
        thumbs: productData.thumbs || [],
      }])
      .select()
      .single()
    if (!error && data) {
      products.value.push({
        ...data,
        originalPrice: data.original_price,
        inStock: data.in_stock,
        mainImg: data.main_img,
      })
    }
    return { data, error }
  }

  const updateProduct = async (productId, productData) => {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        category: productData.category,
        price: productData.price,
        original_price: productData.originalPrice,
        discount: productData.discount,
        stock: productData.stock,
        rating: productData.rating,
        icon: productData.icon,
        main_img: productData.mainImg,
        thumbs: productData.thumbs,
      })
      .eq('id', productId)
      .select()
      .single()
    if (!error && data) {
      const idx = products.value.findIndex(p => p.id === productId)
      if (idx !== -1) {
        products.value[idx] = {
          ...data,
          originalPrice: data.original_price,
          inStock: data.in_stock,
          mainImg: data.main_img,
        }
      }
    }
    return { data, error }
  }

  const removeProduct = async (productId) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    if (!error) {
      products.value = products.value.filter(p => p.id !== productId)
    }
    return { error }
  }

  // 兼容旧代码（同步方法名）
  const refreshProducts = () => fetchProducts()

  // =============================================
  // 订单 — Supabase
  // =============================================
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) orders.value = data
  }

  const addOrder = async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer: orderData.facebook || '未知客户',
        amount: orderData.total,
        status: 'Pending',
        phone: orderData.phone,
        facebook: orderData.facebook,
        items: orderData.items,
      }])
      .select()
      .single()
    if (!error && data) {
      orders.value.unshift(data)
    }
    return { data, error }
  }

  const removeOrder = async (orderId) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
    if (!error) {
      orders.value = orders.value.filter(o => o.id !== orderId)
    }
    return { error }
  }

  const updateOrderStatus = async (orderId, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    if (!error) {
      const o = orders.value.find(o => o.id === orderId)
      if (o) o.status = status
    }
    return { error }
  }

  const refreshOrders = () => fetchOrders()

  // =============================================
  // 反馈 — Supabase
  // =============================================
  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) feedbacks.value = data
  }

  const addFeedback = async (feedbackData) => {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([{
        name: feedbackData.name,
        email: feedbackData.email || '',
        message: feedbackData.message,
      }])
      .select()
      .single()
    if (!error && data) {
      feedbacks.value.unshift(data)
    }
    return { data, error }
  }

  const markFeedbackRead = async (id) => {
    const { error } = await supabase
      .from('feedbacks')
      .update({ read: true })
      .eq('id', id)
    if (!error) {
      const fb = feedbacks.value.find(f => f.id === id)
      if (fb) fb.read = true
    }
  }

  const removeFeedback = async (id) => {
    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id)
    if (!error) {
      feedbacks.value = feedbacks.value.filter(f => f.id !== id)
    }
  }

  return {
    // 状态
    language, darkMode, isLoggedIn, user, cart, loading,
    products, orders, feedbacks,
    // 计算
    cartTotal, cartCount,
    // UI
    setLanguage, toggleDarkMode, login, logout,
    // 购物车
    addToCart, removeFromCart, clearCart,
    // 产品
    fetchProducts, addProduct, updateProduct, removeProduct, refreshProducts,
    // 订单
    fetchOrders, addOrder, removeOrder, updateOrderStatus, refreshOrders,
    // 反馈
    fetchFeedbacks, addFeedback, markFeedbackRead, removeFeedback,
  }
})