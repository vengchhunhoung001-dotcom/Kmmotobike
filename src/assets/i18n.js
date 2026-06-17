export const translations = {
  zh: {
    nav: {
      home: '首页',
      products: '产品',
      about: '关于我们',
      help: '帮助中心',
      login: '登录',
      logout: '退出',
      language: '语言',
      darkMode: '暗色模式',
      lightMode: '亮色模式',
      admin: '管理后台'
    },
    home: {
      title: '欢迎来到摩托车配件店',
      subtitle: '高品质摩托车配件，专业团队服务',
      tagline: '我们提供最优质的摩托车配件和专业的技术支持',
      cta: '查看产品',
      featured: '精选产品',
      about: '关于我们',
      aboutText: '拥有15年行业经验，为全球摩托爱好者提供高品质配件',
      contact: '联系我们',
      email: '邮箱: info@motoshop.com',
      phone: '电话: +86-XXX-XXXX-XXXX',
      address: '地址: 中国 · 全国服务'
    },
    products: {
      title: '我们的产品',
      subtitle: '精选摩托车配件目录',
      filter: '筛选',
      price: '价格',
      category: '分类',
      sort: '排序',
      addToCart: '加入购物车',
      viewDetails: '查看详情',
      inStock: '库存',
      outOfStock: '缺货',
      allCategories: '所有分类',
      engineParts: '发动机配件',
      suspension: '悬挂系统',
      brakes: '刹车系统',
      wheels: '轮胎轮圈',
      accessories: '配件配饰'
    },
    login: {
      title: '登录',
      username: '用户名',
      password: '密码',
      rememberMe: '记住我',
      submit: '登录',
      noAccount: '没有账户？',
      signup: '注册',
      error: '用户名或密码错误'
    },
    admin: {
      title: '管理后台',
      dashboard: '仪表板',
      products: '产品管理',
      users: '用户管理',
      orders: '订单管理',
      feedbacks: '留言反馈',
      settings: '设置',
      addProduct: '添加产品',
      editProduct: '编辑产品',
      deleteProduct: '删除产品'
    },
    footer: {
      about: '关于',
      contact: '联系',
      privacy: '隐私政策',
      terms: '服务条款',
      copyright: '© 2024 摩托车配件店。版权所有。'
    },
    language: {
      selectLanguage: '选择语言',
      chinese: '中文 (Chinese)',
      english: '英语 (English)'
    }
  },
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About Us',
      help: 'Help Center',
      login: 'Login',
      logout: 'Logout',
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      admin: 'Admin'
    },
    home: {
      title: 'Welcome to Moto Parts Shop',
      subtitle: 'Premium motorcycle parts with professional service',
      tagline: 'We provide the highest quality motorcycle parts and professional technical support',
      cta: 'Shop Now',
      featured: 'Featured Products',
      about: 'About Us',
      aboutText: 'With 15 years of industry experience, we serve motorcycle enthusiasts worldwide',
      contact: 'Contact Us',
      email: 'Email: info@motoshop.com',
      phone: 'Phone: +86-XXX-XXXX-XXXX',
      address: 'Address: China · Nationwide Service'
    },
    products: {
      title: 'Our Products',
      subtitle: 'Premium Motorcycle Parts Catalog',
      filter: 'Filter',
      price: 'Price',
      category: 'Category',
      sort: 'Sort',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      allCategories: 'All Categories',
      engineParts: 'Engine Parts',
      suspension: 'Suspension',
      brakes: 'Brakes',
      wheels: 'Wheels & Tires',
      accessories: 'Accessories'
    },
    login: {
      title: 'Login',
      username: 'Username',
      password: 'Password',
      rememberMe: 'Remember me',
      submit: 'Sign In',
      noAccount: 'No account?',
      signup: 'Sign up',
      error: 'Invalid username or password'
    },
    admin: {
      title: 'Admin Dashboard',
      dashboard: 'Dashboard',
      products: 'Product Management',
      users: 'User Management',
      orders: 'Order Management',
      feedbacks: 'Messages & Feedback',
      settings: 'Settings',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product'
    },
    footer: {
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2024 Moto Parts Shop. All rights reserved.'
    }
  }
}

export function t(key, language = 'zh') {
  const keys = key.split('.')
  let value = translations[language]
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  
  return value || key
}
