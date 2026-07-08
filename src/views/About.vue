<template>
  <div class="about-page">
    <!-- Hero -->
    <div class="about-hero">
      <div class="container">
        <h1 class="hero-title">关于我们 · About Us</h1>
        <p class="hero-sub">专业摩托车配件供应商 · Professional Motorcycle Parts Supplier</p>
      </div>
    </div>

    <!-- Company Info -->
    <section class="section container">
      <div class="two-col">
        <div class="col-text">
          <div class="section-badge">🏍️ 公司简介</div>
          <h2 class="section-title">我们是谁？</h2>
          <p class="section-para">
            MotoShop 成立于 2009 年，是柬埔寨领先的摩托车配件专业供应商。我们致力于为摩托车爱好者、维修技师及车队提供最高品质的配件与专业技术支持。
          </p>
          <p class="section-para">
            经过 15 年的发展，我们已建立起遍布全球的供应链网络，合作品牌超过 200 家，服务客户超过 10,000 人次。
          </p>
          <ul class="feature-list">
            <li>✅ 全球优质品牌原厂配件</li>
            <li>✅ 专业技术团队 7×12 在线支持</li>
            <li>✅ 快速发货，全国配送</li>
            <li>✅ 30 天无忧退换保障</li>
          </ul>
        </div>
        <div class="col-stats">
          <div class="stats-grid-2">
            <div class="stat-box stat-orange">
              <span class="stat-num">15+</span>
              <span class="stat-lbl">年行业经验</span>
            </div>
            <div class="stat-box stat-blue">
              <span class="stat-num">10K+</span>
              <span class="stat-lbl">满意客户</span>
            </div>
            <div class="stat-box stat-green">
              <span class="stat-num">200+</span>
              <span class="stat-lbl">合作品牌</span>
            </div>
            <div class="stat-box stat-purple">
              <span class="stat-num">5K+</span>
              <span class="stat-lbl">产品种类</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission / Vision / Values -->
    <section class="section-alt">
      <div class="container">
        <div class="section-badge center">🌟 使命与愿景</div>
        <h2 class="section-title center">我们的核心理念</h2>
        <div class="mvv-grid">
          <div class="mvv-card">
            <div class="mvv-icon">🎯</div>
            <h3 class="mvv-title">使命</h3>
            <p class="mvv-desc">为每一位摩托车爱好者提供可靠、实惠的高品质配件，让驾驶更安全、更畅快。</p>
          </div>
          <div class="mvv-card">
            <div class="mvv-icon">🔭</div>
            <h3 class="mvv-title">愿景</h3>
            <p class="mvv-desc">成为东南亚最受信赖的摩托车配件平台，连接全球优质品牌与本地客户。</p>
          </div>
          <div class="mvv-card">
            <div class="mvv-icon">💎</div>
            <h3 class="mvv-title">价值观</h3>
            <p class="mvv-desc">诚信经营、专业服务、持续创新，始终把客户满意度放在第一位。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section container">
      <div class="section-badge center">👥 我们的团队</div>
      <h2 class="section-title center">专业的团队</h2>
      <div class="team-grid">
        <div class="team-card" v-for="member in team" :key="member.name">
          <div class="team-avatar">{{ member.avatar }}</div>
          <h3 class="team-name">{{ member.name }}</h3>
          <p class="team-role">{{ member.role }}</p>
          <p class="team-desc">{{ member.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="section-alt">
      <div class="container">
        <div class="section-badge center">📞 联系我们</div>
        <h2 class="section-title center">随时欢迎您的咨询</h2>
        <div class="contact-grid">
          <div class="contact-card">
            <span class="contact-icon">📧</span>
            <h4>邮箱</h4>
            <a href="mailto:info@motoshop.com" class="contact-link">info@motoshop.com</a>
          </div>
          <div class="contact-card">
            <span class="contact-icon">📞</span>
            <h4>电话</h4>
            <a href="tel:+85512345678" class="contact-link">+855 12 345 678</a>
          </div>
          <div class="contact-card">
            <span class="contact-icon">📍</span>
            <h4>地址</h4>
            <p class="contact-link">Phnom Penh, Cambodia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container cta-inner">
        <h2 class="cta-title">准备好了吗？</h2>
        <p class="cta-sub">浏览我们的产品或前往帮助中心获取支持</p>
        <div class="cta-btns">
          <router-link to="/products" class="btn-cta-primary">查看产品</router-link>
          <router-link to="/help" class="btn-cta-outline">帮助中心</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const team = [
  { avatar: '👨‍💼', name: 'David Chen', role: '创始人 & CEO', desc: '摩托车行业 20 年资深从业者，致力于将全球优质配件带入东南亚市场。' },
  { avatar: '👩‍🔧', name: 'Sophea Meas', role: '技术总监', desc: '专业摩托车工程师，拥有丰富的配件选型与技术支持经验。' },
  { avatar: '👨‍💻', name: 'Aarav Patel', role: '电商运营总监', desc: '负责线上平台运营与客户体验优化，让每次购物都更顺畅。' },
  { avatar: '👩‍🎨', name: 'Lin Jing', role: '客户服务经理', desc: '带领客服团队提供 7×12 专业支持，确保每位客户都能得到满意的解答。' },
]
</script>

<style scoped>
.about-page { min-height: 100vh; background: #ffffff; }
:global(.dark) .about-page { background: #030712; }

/* Hero */
.about-hero {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  color: #fff;
  padding: 5rem 0;
  text-align: center;
  border-bottom: 3px solid #f2b705;
}
.hero-title span { color: #f2b705; }
.hero-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 1rem; }
.hero-sub { font-size: 1.2rem; color: #d1d5db; }

/* Sections */
.section { padding: 5rem 0; }
.section-alt { padding: 5rem 0; background: #f9fafb; }
:global(.dark) .section-alt { background: #0f172a; }

.section-badge {
  display: inline-block;
  background: #fdf1d6;
  color: #111827;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.3rem 0.9rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
  border: 1px solid #f2b705;
}
:global(.dark) .section-badge { background: rgba(242,183,5,0.12); color: #f2b705; border-color: rgba(242,183,5,0.3); }
.section-badge.center { display: flex; justify-content: center; margin: 0 auto 1rem; width: fit-content; }
.section-title { font-size: clamp(1.6rem, 3vw, 2.5rem); font-weight: 800; margin-bottom: 1.5rem; }
.section-title.center { text-align: center; }
.section-para { color: #4b5563; line-height: 1.8; margin-bottom: 1rem; font-size: 1rem; }
:global(.dark) .section-para { color: #9ca3af; }

/* Two col */
.two-col { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center; }
@media (min-width: 1024px) { .two-col { grid-template-columns: 1fr 1fr; } }
.feature-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }
.feature-list li { font-size: 0.95rem; color: #374151; }
:global(.dark) .feature-list li { color: #d1d5db; }

/* Stats boxes */
.stats-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.stat-box {
  border-radius: 1rem;
  padding: 1.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}
.stat-orange { background: linear-gradient(135deg, #fdf1d6, #f6dba0); border: 1px solid rgba(242,183,5,0.3); }
.stat-blue   { background: linear-gradient(135deg, #fdf1d6, #f6dba0); border: 1px solid rgba(242,183,5,0.3); }
.stat-green  { background: linear-gradient(135deg, #fdf1d6, #f6dba0); border: 1px solid rgba(242,183,5,0.3); }
.stat-purple { background: linear-gradient(135deg, #fdf1d6, #f6dba0); border: 1px solid rgba(242,183,5,0.3); }
:global(.dark) .stat-orange { background: rgba(242,183,5,0.08); border-color: rgba(242,183,5,0.15); }
:global(.dark) .stat-blue   { background: rgba(242,183,5,0.08); border-color: rgba(242,183,5,0.15); }
:global(.dark) .stat-green  { background: rgba(242,183,5,0.08); border-color: rgba(242,183,5,0.15); }
:global(.dark) .stat-purple { background: rgba(242,183,5,0.08); border-color: rgba(242,183,5,0.15); }
.stat-num { font-size: 2.2rem; font-weight: 800; color: #a8690a; }
.stat-lbl { font-size: 0.85rem; color: #6b7280; font-weight: 600; }
:global(.dark) .stat-lbl { color: #9ca3af; }

/* MVV */
.mvv-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 2rem; }
@media (min-width: 768px) { .mvv-grid { grid-template-columns: repeat(3, 1fr); } }
.mvv-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}
.mvv-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
:global(.dark) .mvv-card { background: #1f2937; }
.mvv-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.mvv-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem; }
.mvv-desc { color: #6b7280; font-size: 0.9rem; line-height: 1.7; }
:global(.dark) .mvv-desc { color: #9ca3af; }

/* Team */
.team-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem; }
@media (min-width: 1024px) { .team-grid { grid-template-columns: repeat(4, 1fr); } }
.team-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.75rem 1.25rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  text-align: center;
  transition: transform 0.3s;
}
.team-card:hover { transform: translateY(-3px); }
:global(.dark) .team-card { background: #1f2937; }
.team-avatar { font-size: 3rem; margin-bottom: 0.75rem; }
.team-name { font-weight: 700; font-size: 1.05rem; margin-bottom: 0.25rem; }
.team-role {
  display: inline-block;
  background: #fdf1d6;
  color: #111827;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
  border: 1px solid #f2b705;
}
:global(.dark) .team-role { background: rgba(242,183,5,0.1); color: #f2b705; border-color: rgba(242,183,5,0.3); }
.team-desc { color: #6b7280; font-size: 0.82rem; line-height: 1.6; }
:global(.dark) .team-desc { color: #9ca3af; }

/* Contact */
.contact-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-top: 2rem; }
@media (min-width: 768px) { .contact-grid { grid-template-columns: repeat(3, 1fr); } }
.contact-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  text-align: center;
}
:global(.dark) .contact-card { background: #1f2937; }
.contact-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
.contact-card h4 { font-weight: 700; margin-bottom: 0.5rem; }
.contact-link { color: #a8690a; font-size: 0.95rem; text-decoration: none; font-weight: 600; }
.contact-link:hover { color: #f2b705; text-decoration: underline; }

/* CTA */
.cta-section {
  background: #f2b705;
  padding: 4rem 0;
  text-align: center;
  color: #111827;
  position: relative;
  overflow: hidden;
}
.cta-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%);
  pointer-events: none;
}
.cta-inner { max-width: 600px; margin: 0 auto; }
.cta-title { font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem; }
.cta-sub { font-size: 1.1rem; margin-bottom: 2rem; color: #374151; }
.cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-cta-primary {
  padding: 0.75rem 2rem;
  background: #111827;
  color: #f2b705;
  border-radius: 9999px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}
.btn-cta-primary:hover { transform: translateY(-2px); background: #000; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
.btn-cta-outline {
  padding: 0.75rem 2rem;
  background: transparent;
  color: #111827;
  border: 2px solid #111827;
  border-radius: 9999px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.btn-cta-outline:hover { background: rgba(0,0,0,0.08); }

/* ===== 480px Mobile ===== */
@media (max-width: 480px) {
  .about-hero { padding: 3rem 0; }
  .hero-title { font-size: 1.6rem; }
  .hero-sub { font-size: 1rem; }

  .section { padding: 3rem 0; }
  .section-alt { padding: 3rem 0; }
  .section-title { font-size: 1.4rem; }
  .section-para { font-size: 0.9rem; }

  .two-col { gap: 2rem; }
  .stats-grid-2 { gap: 0.75rem; }
  .stat-box { padding: 1.25rem 0.85rem; }
  .stat-num { font-size: 1.7rem; }

  .mvv-grid { gap: 1rem; }
  .mvv-card { padding: 1.5rem 1.1rem; }
  .mvv-icon { font-size: 2rem; }

  .team-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
  .team-card { padding: 1.25rem 0.85rem; }
  .team-avatar { font-size: 2.2rem; }
  .team-name { font-size: 0.9rem; }
  .team-desc { font-size: 0.78rem; }

  .contact-grid { gap: 1rem; }
  .contact-card { padding: 1.5rem 1rem; }
  .contact-icon { font-size: 2rem; }

  .cta-section { padding: 2.5rem 0; }
  .cta-title { font-size: 1.5rem; }
  .cta-sub { font-size: 0.95rem; }
  .btn-cta-primary, .btn-cta-outline { padding: 0.65rem 1.5rem; font-size: 0.9rem; }
}
</style>
