<template>
  <div class="help-page">
    <!-- Hero -->
    <div class="help-hero">
      <div class="container">
        <h1 class="hero-title">帮助中心 · Help Center</h1>
        <p class="hero-sub">我们在这里为您提供支持 · We're here to support you</p>
      </div>
    </div>

    <div class="container help-body">

      <!-- Action Cards Row -->
      <div class="action-cards">

        <!-- Get Support (留言) -->
        <div class="action-card" :class="{ 'card-open': supportOpen }">
          <button class="action-card-header" @click="toggleSupport">
            <div class="action-card-left">
              <span class="action-card-icon">💬</span>
              <div>
                <h3 class="action-card-title">留言反馈</h3>
                <p class="action-card-sub">给我们发送您的问题或建议</p>
              </div>
            </div>
            <span class="action-card-arrow" :class="{ 'arrow-open': supportOpen }">▼</span>
          </button>

          <transition name="slide-down">
            <div v-if="supportOpen" class="action-card-body">
              <div v-if="submitSuccess" class="success-banner">
                ✅ 留言已提交！我们将在 24 小时内回复您。
              </div>
              <div v-else>
                <div class="form-group">
                  <label class="form-label">👤 您的姓名 <span class="required">*</span></label>
                  <input v-model="supportForm.name" class="form-input" placeholder="请输入您的姓名" />
                </div>
                <div class="form-group">
                  <label class="form-label">📧 电子邮箱 <span class="required">*</span></label>
                  <input v-model="supportForm.email" class="form-input" placeholder="请输入您的邮箱" type="email" />
                </div>
                <div class="form-group">
                  <label class="form-label">💬 留言内容 <span class="required">*</span></label>
                  <textarea v-model="supportForm.message" class="form-textarea" rows="4" placeholder="请详细描述您的问题或建议…"></textarea>
                </div>
                <p v-if="supportError" class="form-error">{{ supportError }}</p>
                <button class="btn-submit" @click="submitSupport" :disabled="submitting">
                  {{ submitting ? '提交中…' : '📤 提交留言' }}
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Contact Sales -->
        <div class="action-card" :class="{ 'card-open': salesOpen }">
          <button class="action-card-header" @click="toggleSales">
            <div class="action-card-left">
              <span class="action-card-icon">🤝</span>
              <div>
                <h3 class="action-card-title">联系销售</h3>
                <p class="action-card-sub">直接联系我们的销售团队</p>
              </div>
            </div>
            <span class="action-card-arrow" :class="{ 'arrow-open': salesOpen }">▼</span>
          </button>

          <transition name="slide-down">
            <div v-if="salesOpen" class="action-card-body">
              <div class="contact-options">

                <!-- Phone -->
                <a href="tel:+85512345678" class="contact-option contact-phone">
                  <span class="co-icon">☎️</span>
                  <div class="co-info">
                    <span class="co-label">电话号码</span>
                    <span class="co-value">+855 12 345 678</span>
                  </div>
                  <span class="co-arrow">→</span>
                </a>

                <!-- Telegram -->
                <!-- 备注：请将下方链接 https://t.me/MotoShopOfficial 替换为您自己的 Telegram 账号链接 -->
                <a href="https://t.me/MotoShopOfficial" target="_blank" rel="noopener" class="contact-option contact-telegram">
                  <span class="co-icon">✈️</span>
                  <div class="co-info">
                    <span class="co-label">Telegram</span>
                    <span class="co-value">@MotoShopOfficial</span>
                  </div>
                  <span class="co-arrow">→</span>
                </a>

                <!-- WeChat -->
                <!-- 备注：点击显示微信二维码弹窗，请将二维码图片替换为您自己的 -->
                <button class="contact-option contact-wechat" @click="showWechatModal = true">
                  <span class="co-icon">💬</span>
                  <div class="co-info">
                    <span class="co-label">WeChat</span>
                    <span class="co-value">点击查看二维码</span>
                  </div>
                  <span class="co-arrow">→</span>
                </button>

              </div>
            </div>
          </transition>
        </div>

      </div>

      <!-- FAQ Section -->
      <div class="faq-section">
        <h2 class="faq-title">❓ 常见问题 FAQ</h2>
        <div class="faq-list">
          <div
            v-for="(item, idx) in faqs"
            :key="idx"
            class="faq-item"
            :class="{ 'faq-open': openFaq === idx }"
          >
            <button class="faq-question" @click="toggleFaq(idx)">
              <span>{{ item.q }}</span>
              <span class="faq-chevron" :class="{ 'chevron-open': openFaq === idx }">▼</span>
            </button>
            <transition name="slide-down">
              <div v-if="openFaq === idx" class="faq-answer">
                <p>{{ item.a }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>

    </div>

    <!-- WeChat QR Modal -->
    <!-- 备注：请将 wechat-qr.png 替换为您真实的微信二维码图片路径 -->
    <div v-if="showWechatModal" class="modal-overlay" @click.self="showWechatModal = false">
      <div class="wechat-modal">
        <button class="wechat-close" @click="showWechatModal = false">✕</button>
        <h3 class="wechat-title">💬 微信扫码添加</h3>
        <div class="wechat-qr-wrap">
          <!-- 请替换 src 为您的二维码图片路径，例如 /images/wechat-qr.png -->
          <div class="wechat-qr-placeholder">
            <span style="font-size:4rem;">📱</span>
            <p style="margin-top:0.5rem;color:#9ca3af;font-size:0.85rem;">请替换为您的微信二维码图片</p>
            <code style="font-size:0.75rem;color:#d1d5db;word-break:break-all;">&lt;img src="/your-wechat-qr.png" /&gt;</code>
          </div>
        </div>
        <p class="wechat-hint">使用微信扫描二维码添加我们的客服</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../stores/useStore'

const store = useAppStore()

const supportOpen = ref(false)
const salesOpen = ref(false)
const showWechatModal = ref(false)
const openFaq = ref(null)

const supportForm = ref({ name: '', email: '', message: '' })
const supportError = ref('')
const submitSuccess = ref(false)
const submitting = ref(false)

const toggleSupport = () => {
  supportOpen.value = !supportOpen.value
  if (supportOpen.value) salesOpen.value = false
}
const toggleSales = () => {
  salesOpen.value = !salesOpen.value
  if (salesOpen.value) supportOpen.value = false
}
const toggleFaq = (idx) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const submitSupport = () => {
  supportError.value = ''
  if (!supportForm.value.name.trim()) { supportError.value = '请填写您的姓名'; return }
  if (!supportForm.value.email.trim()) { supportError.value = '请填写您的邮箱'; return }
  if (!supportForm.value.message.trim()) { supportError.value = '请填写留言内容'; return }
  submitting.value = true
  setTimeout(() => {
    store.addFeedback({ ...supportForm.value })
    submitting.value = false
    submitSuccess.value = true
    supportForm.value = { name: '', email: '', message: '' }
  }, 800)
}

const faqs = [
  {
    q: '📦 如何查询我的订单状态？',
    a: '您可以通过联系我们的客服团队（电话、Telegram 或微信），提供您的订单编号，我们将立即为您查询最新状态。'
  },
  {
    q: '🔄 产品是否支持退换货？',
    a: '是的，我们提供 30 天无忧退换货保障。商品需保持原包装且未使用状态。请通过留言或联系销售申请退换。'
  },
  {
    q: '🚚 支持哪些配送方式？',
    a: '我们支持全国快递配送，金边市区可选择同城急送（当日到达）。下单后我们将与您确认配送方式和时间。'
  },
  {
    q: '💳 支持哪些付款方式？',
    a: '我们支持银行转账、ABA 支付、Wing Money 以及货到付款（限金边部分区域）。'
  },
  {
    q: '🔧 如何确认配件与我的摩托车型号兼容？',
    a: '请在留言或联系我们时提供您的摩托车品牌、型号及年份，我们的技术团队将帮您确认兼容性。'
  },
]
</script>

<style scoped>
.help-page { min-height: 100vh; background: #ffffff; }
:global(.dark) .help-page { background: #030712; }

/* Hero */
.help-hero {
  background: linear-gradient(135deg, #111827, #000);
  color: #fff;
  padding: 5rem 0;
  text-align: center;
}
.hero-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 1rem; }
.hero-sub { font-size: 1.15rem; color: #d1d5db; }

.help-body { padding: 4rem 0; }

/* Action cards */
.action-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 4rem;
}
@media (min-width: 768px) { .action-cards { grid-template-columns: 1fr 1fr; } }

.action-card {
  border: 1.5px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: #fff;
}
:global(.dark) .action-card { background: #1f2937; border-color: #374151; }
.action-card:hover, .card-open { border-color: #f97316; box-shadow: 0 4px 20px rgba(249,115,22,0.1); }

.action-card-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 1rem;
}
.action-card-left { display: flex; align-items: center; gap: 1rem; }
.action-card-icon { font-size: 2rem; flex-shrink: 0; }
.action-card-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.2rem; color: inherit; }
.action-card-sub { font-size: 0.85rem; color: #6b7280; }
:global(.dark) .action-card-sub { color: #9ca3af; }
.action-card-arrow {
  font-size: 0.75rem;
  color: #9ca3af;
  transition: transform 0.3s;
  flex-shrink: 0;
}
.arrow-open { transform: rotate(180deg); color: #f97316; }

.action-card-body {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid #f3f4f6;
}
:global(.dark) .action-card-body { border-color: #374151; }

/* Slide transition */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.slide-down-enter-to, .slide-down-leave-from {
  max-height: 600px;
  opacity: 1;
}

/* Form */
.form-group { margin-bottom: 1.1rem; padding-top: 1.25rem; }
.form-group:first-child { padding-top: 1.25rem; }
.form-label { display: block; font-weight: 600; margin-bottom: 0.45rem; font-size: 0.9rem; }
.required { color: #ef4444; }
.form-input, .form-textarea {
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
  font-family: inherit;
}
.form-textarea { resize: vertical; min-height: 100px; }
.form-input:focus, .form-textarea:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
:global(.dark) .form-input, :global(.dark) .form-textarea { background: #374151; border-color: #4b5563; color: #f9fafb; }
.form-error { color: #ef4444; font-size: 0.85rem; margin-bottom: 0.75rem; }
.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, #f97316, #eab308);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  margin-top: 0.5rem;
}
.btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(249,115,22,0.3); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.success-banner {
  padding: 1.25rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  color: #16a34a;
  font-weight: 600;
  text-align: center;
  margin-top: 1.25rem;
}
:global(.dark) .success-banner { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3); color: #4ade80; }

/* Contact options */
.contact-options { display: flex; flex-direction: column; gap: 0.75rem; padding-top: 1.25rem; }
.contact-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  text-align: left;
  width: 100%;
}
.contact-option:hover { transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
:global(.dark) .contact-option { background: #111827; border-color: #374151; }
.contact-phone:hover  { border-color: #3b82f6; }
.contact-telegram:hover { border-color: #0ea5e9; }
.contact-wechat:hover { border-color: #22c55e; }
.co-icon { font-size: 1.6rem; flex-shrink: 0; }
.co-info { flex: 1; display: flex; flex-direction: column; }
.co-label { font-size: 0.78rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.co-value { font-size: 0.95rem; font-weight: 700; color: #111827; }
:global(.dark) .co-value { color: #f9fafb; }
.co-arrow { color: #d1d5db; font-size: 1rem; }

/* FAQ */
.faq-section { }
.faq-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; }
.faq-list { display: flex; flex-direction: column; gap: 0.75rem; }
.faq-item {
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: border-color 0.2s;
}
:global(.dark) .faq-item { border-color: #374151; }
.faq-item.faq-open { border-color: #f97316; }
.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.97rem;
  font-weight: 600;
  color: inherit;
  gap: 1rem;
}
.faq-chevron { font-size: 0.72rem; color: #9ca3af; transition: transform 0.3s; flex-shrink: 0; }
.chevron-open { transform: rotate(180deg); color: #f97316; }
.faq-answer {
  padding: 0 1.25rem 1.25rem;
  color: #4b5563;
  font-size: 0.92rem;
  line-height: 1.75;
  border-top: 1px solid #f3f4f6;
}
:global(.dark) .faq-answer { color: #9ca3af; border-color: #374151; }

/* WeChat modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.wechat-modal {
  background: #fff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 340px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
  text-align: center;
}
:global(.dark) .wechat-modal { background: #1f2937; color: #f9fafb; }
.wechat-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.wechat-close:hover { background: #e5e7eb; }
:global(.dark) .wechat-close { background: #374151; color: #f9fafb; }
.wechat-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem; }
.wechat-qr-wrap { margin-bottom: 1rem; }
.wechat-qr-placeholder {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
:global(.dark) .wechat-qr-placeholder { background: #111827; border-color: #374151; }
.wechat-hint { font-size: 0.85rem; color: #6b7280; }
:global(.dark) .wechat-hint { color: #9ca3af; }
</style>
