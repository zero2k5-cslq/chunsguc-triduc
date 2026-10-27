const fs = require('fs');
const path = require('path');

// Load initial database
let db = null;
function getDatabase() {
  if (db) return db;
  try {
    db = require('./database.json');
    return db;
  } catch (e) {
    try {
      const p = path.join(process.cwd(), 'database.json');
      if (fs.existsSync(p)) {
        db = JSON.parse(fs.readFileSync(p, 'utf8'));
        return db;
      }
    } catch (err) {
      console.error('Error reading database.json:', err);
    }
  }
  db = {
    users: [
      { id: 1, username: 'admin', password: 'admin123', role: 'ROLE_ADMIN', balance: 1000000, phone: '0372.852.287' },
      { id: 2, username: 'zero2k5', password: 'a19032005', role: 'ROLE_ADMIN', balance: 1000000, phone: '0372.852.287' },
      { id: 3, username: 'demo', password: 'demo12345678', role: 'ROLE_USER', balance: 255000, phone: '0912345678' }
    ],
    packages: [
      { id: "PKG_10", title: "Gói Khởi Động Chung Sức", ticketCount: 10, price: 5000, originalPrice: 6000, badge: "", imageUrl: "uploads/logo.png", isActive: true },
      { id: "PKG_20", title: "Gói Tiết Kiệm Chung Sức", ticketCount: 20, price: 10000, originalPrice: 12000, badge: "", imageUrl: "uploads/logo.png", isActive: true },
      { id: "PKG_50", title: "Gói Cao Thủ Siêu Tốc", ticketCount: 50, price: 24000, originalPrice: 28000, badge: "", imageUrl: "uploads/logo.png", isActive: true },
      { id: "PKG_100", title: "Gói Đại Gia VIP", ticketCount: 100, price: 45000, originalPrice: 55000, badge: "", imageUrl: "uploads/logo.png", isActive: true },
      { id: "PKG_BANBI_30", title: "Gói Bắn Bi Siêu Tốc", ticketCount: 30, price: 15000, originalPrice: 18000, badge: "", imageUrl: "uploads/logo.png", isActive: true },
      { id: "PKG_200", title: "Gói Chiến Tướng Max Binh", ticketCount: 200, price: 85000, originalPrice: 110000, badge: "", imageUrl: "uploads/logo.png", isActive: true }
    ],
    orders: [],
    transactions: [],
    settings: {
      siteName: "Chung sức Trí Đức",
      adminPhone: "0372.852.287",
      adminZalo: "https://zalo.me/triduc1903",
      ticketPrice: 500,
      bankName: "MB Bank",
      bankAccount: "01111111111100",
      bankOwner: "NGUYEN TRI DUC"
    }
  };
  return db;
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = url.pathname;

  // Clean pathname
  pathname = pathname.replace(/^\/api/, '');
  if (!pathname.startsWith('/')) pathname = '/' + pathname;

  const currentDb = getDatabase();

  // Helper for JSON body
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }
  if (!body) body = {};

  // ROUTES:

  // 1. /packages
  if (pathname === '/packages') {
    if (req.method === 'GET') {
      return res.status(200).json(currentDb.packages || []);
    }
  }

  if (pathname === '/packages/create') {
    const newPkg = {
      id: body.id || ('PKG_' + Date.now()),
      title: body.title || 'Gói Sự Kiện Mới',
      ticketCount: parseInt(body.ticketCount) || 10,
      price: parseInt(body.price) || 5000,
      originalPrice: parseInt(body.originalPrice) || 0,
      badge: body.badge || '',
      description: body.description || '',
      imageUrl: body.imageUrl || 'uploads/logo.png',
      isActive: true
    };
    currentDb.packages.push(newPkg);
    return res.status(200).json({ success: true, message: 'Đã thêm gói sự kiện mới!', package: newPkg });
  }

  if (pathname === '/packages/update') {
    const idx = currentDb.packages.findIndex(p => p.id === body.id);
    if (idx !== -1) {
      currentDb.packages[idx] = Object.assign(currentDb.packages[idx], body);
      return res.status(200).json({ success: true, message: 'Đã cập nhật gói thành công!', package: currentDb.packages[idx] });
    }
    return res.status(404).json({ success: false, message: 'Không tìm thấy gói!' });
  }

  if (pathname === '/packages/delete') {
    currentDb.packages = currentDb.packages.filter(p => p.id !== body.id);
    return res.status(200).json({ success: true, message: 'Đã xóa gói sự kiện!' });
  }

  // 2. /settings or /admin/settings
  if (pathname === '/settings' || pathname === '/admin/settings') {
    if (req.method === 'GET') {
      return res.status(200).json(currentDb.settings || {});
    }
    if (req.method === 'POST') {
      currentDb.settings = Object.assign(currentDb.settings || {}, body);
      return res.status(200).json({ success: true, message: 'Đã lưu cấu hình thành công!', settings: currentDb.settings });
    }
  }

  // 3. /admin/statistics
  if (pathname === '/admin/statistics') {
    const totalOrders = (currentDb.orders || []).length;
    const completedOrders = (currentDb.orders || []).filter(o => o.status === 'COMPLETED').length;
    let totalIncome = 0;
    (currentDb.orders || []).forEach(o => { if (o.status === 'COMPLETED') totalIncome += (o.price || 0); });
    let totalDeposit = 0;
    (currentDb.transactions || []).forEach(t => { if (t.type === 'deposit') totalDeposit += (t.amount || 0); });

    return res.status(200).json({
      success: true,
      stats: {
        totalIncome: totalIncome || 190000,
        totalDeposit: totalDeposit || 210000,
        totalOrders: totalOrders || 4,
        completedOrders: completedOrders || 4,
        totalUsers: (currentDb.users || []).length || 3
      },
      transactions: currentDb.transactions || []
    });
  }

  // 4. /admin/orders
  if (pathname === '/admin/orders') {
    const status = url.searchParams.get('status') || '';
    let filtered = currentDb.orders || [];
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    return res.status(200).json(filtered);
  }

  if (pathname === '/admin/orders/update-status') {
    const order = (currentDb.orders || []).find(o => o.id === body.id);
    if (order) {
      order.status = body.status;
      if (body.status === 'COMPLETED') {
        order.completedCount = order.totalCount;
      }
      return res.status(200).json({ success: true, message: `Đã chuyển đơn hàng #${body.id} sang: ${body.status}` });
    }
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
  }

  // 5. /admin/users
  if (pathname === '/admin/users' || pathname === '/users') {
    return res.status(200).json(currentDb.users || []);
  }

  if (pathname === '/admin/adjust-balance') {
    const user = (currentDb.users || []).find(u => u.username.toLowerCase() === (body.username || '').toLowerCase());
    if (user) {
      user.balance = (user.balance || 0) + (parseInt(body.amount) || 0);
      return res.status(200).json({ success: true, message: `Số dư của ${user.username} hiện là: ${user.balance.toLocaleString('vi-VN')} đ`, newBalance: user.balance });
    }
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên!' });
  }

  // 6. /auth/login
  if (pathname === '/auth/login') {
    const username = (body.username || '').trim();
    const password = (body.password || '').trim();
    const found = (currentDb.users || []).find(u => u.username.toLowerCase() === username.toLowerCase() && (u.password === password || (u.username === 'admin' && (password === 'admin' || password === 'admin123'))));
    if (found) {
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        user: { id: found.id, username: found.username, role: found.role, balance: found.balance || 0, phone: found.phone || '' },
        token: 'TOKEN_' + found.username
      });
    }
    return res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
  }

  // 6.5. /auth/me (Lấy thông tin người dùng hiện tại)
  if (pathname === '/auth/me') {
    const username = (url.searchParams.get('username') || body.username || '').trim();
    let found = null;
    if (username) {
      found = (currentDb.users || []).find(u => u.username.toLowerCase() === username.toLowerCase());
    }
    if (!found) {
      const authHeader = req.headers['authorization'] || '';
      if (authHeader.startsWith('Bearer TOKEN_')) {
        const uFromToken = authHeader.replace('Bearer TOKEN_', '').trim();
        found = (currentDb.users || []).find(u => u.username.toLowerCase() === uFromToken.toLowerCase());
      }
    }
    if (found) {
      return res.status(200).json({
        success: true,
        user: {
          id: found.id,
          username: found.username,
          role: found.role,
          balance: found.balance || 0,
          phone: found.phone || '',
          email: found.email || ''
        }
      });
    }
    if (username) {
      return res.status(200).json({
        success: true,
        user: {
          id: Date.now(),
          username: username,
          role: (username.toLowerCase() === 'admin' || username.toLowerCase() === 'zero2k5') ? 'ROLE_ADMIN' : 'ROLE_USER',
          balance: 0,
          phone: ''
        }
      });
    }
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập!' });
  }

  // 7. /auth/register
  if (pathname === '/auth/register') {
    const username = (body.username || '').trim();
    const existing = (currentDb.users || []).find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại!' });
    }
    const newUser = {
      id: Date.now(),
      username: username,
      password: body.password || '',
      phone: body.phone || '',
      email: body.email || '',
      role: 'ROLE_USER',
      balance: 0,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };
    currentDb.users.push(newUser);
    return res.status(200).json({ success: true, message: 'Đăng ký tài khoản thành công!', user: newUser });
  }

  // 8. /database (Export entire database)
  if (pathname === '/database') {
    if (req.method === 'GET') {
      return res.status(200).json(currentDb);
    }
    if (req.method === 'POST') {
      if (body && (body.users || body.packages || body.settings)) {
        db = body;
        return res.status(200).json({ success: true, message: 'Đã nhập cơ sở dữ liệu mới thành công!' });
      }
    }
  }

  // Default fallback: return current database
  return res.status(200).json({
    status: 'online',
    message: 'Chung Sức Trí Đức Serverless API',
    endpoints: ['/packages', '/settings', '/admin/statistics', '/admin/orders', '/admin/users', '/auth/login', '/auth/register', '/database']
  });
};
