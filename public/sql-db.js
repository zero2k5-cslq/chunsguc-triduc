const fs = require('fs');
const path = require('path');

function parseSqlValues(valuesClause) {
  const rows = [];
  let inString = false;
  let stringChar = '';
  let currentVal = '';
  let currentRow = [];
  let parenDepth = 0;

  for (let i = 0; i < valuesClause.length; i++) {
    const ch = valuesClause[i];

    if (inString) {
      if (ch === stringChar) {
        if (valuesClause[i + 1] === stringChar) {
          currentVal += stringChar;
          i++; // Skip escaped quote
        } else {
          inString = false;
        }
      } else {
        currentVal += ch;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (ch === '(') {
      if (parenDepth === 0) {
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += ch;
      }
      parenDepth++;
    } else if (ch === ')') {
      parenDepth--;
      if (parenDepth === 0) {
        let v = currentVal.trim();
        if (v === 'NULL') v = null;
        else if (v === 'NOW()') v = new Date().toLocaleString('vi-VN');
        else if (!isNaN(v) && v !== '') v = Number(v);
        currentRow.push(v);
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += ch;
      }
    } else if (ch === ',' && parenDepth === 1) {
      let v = currentVal.trim();
      if (v === 'NULL') v = null;
      else if (v === 'NOW()') v = new Date().toLocaleString('vi-VN');
      else if (!isNaN(v) && v !== '') v = Number(v);
      currentRow.push(v);
      currentVal = '';
    } else if (parenDepth > 0) {
      currentVal += ch;
    }
  }
  return rows;
}

function parseSql(sqlText) {
  const db = {
    users: [],
    packages: [],
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

  // 1. Users
  const userMatch = sqlText.match(/INSERT\s+INTO\s+`?users`?\s*(?:\([^\)]*\))?\s*VALUES\s*([\s\S]*?);/i);
  if (userMatch) {
    const rawRows = parseSqlValues(userMatch[1]);
    db.users = rawRows.map(r => ({
      id: r[0],
      username: r[1],
      password: r[2],
      role: r[3],
      balance: r[4] || 0,
      phone: r[5] || '0372.852.287',
      email: r[6] || (r[1] + '@shopchungsuc.com'),
      status: r[7] || 'ACTIVE',
      createdAt: r[8] || new Date().toLocaleString('vi-VN')
    }));
  }

  // 2. Packages (event_packages)
  const pkgMatch = sqlText.match(/INSERT\s+INTO\s+`?event_packages`?\s*(?:\([^\)]*\))?\s*VALUES\s*([\s\S]*?);/i);
  if (pkgMatch) {
    const rawRows = parseSqlValues(pkgMatch[1]);
    db.packages = rawRows.map(r => ({
      id: r[1], // package_code
      code: r[1],
      title: r[2],
      ticketCount: r[3],
      price: r[4],
      originalPrice: r[5] || Math.round(r[4] * 1.2),
      badge: r[6] || '',
      description: r[7] || '',
      imageUrl: r[8] || 'uploads/logo.png',
      isActive: r[9] === 1 || r[9] === true
    }));
  }

  // 3. System Settings
  const stMatch = sqlText.match(/INSERT\s+INTO\s+`?system_settings`?\s*(?:\([^\)]*\))?\s*VALUES\s*([\s\S]*?);/i);
  if (stMatch) {
    const rawRows = parseSqlValues(stMatch[1]);
    rawRows.forEach(r => {
      const key = r[0];
      const val = r[1];
      if (key === 'ADMIN_HOTLINE') db.settings.adminPhone = val;
      if (key === 'ADMIN_ZALO') db.settings.adminZalo = val;
      if (key === 'DEFAULT_TICKET_PRICE') db.settings.ticketPrice = Number(val) || 500;
      if (key === 'BANK_NAME') db.settings.bankName = val;
      if (key === 'BANK_ACCOUNT_NUMBER') db.settings.bankAccount = val;
      if (key === 'BANK_ACCOUNT_NAME') db.settings.bankOwner = val;
    });
  }

  // 4. Orders
  const ordMatch = sqlText.match(/INSERT\s+INTO\s+`?orders`?\s*(?:\([^\)]*\))?\s*VALUES\s*([\s\S]*?);/i);
  if (ordMatch) {
    const rawRows = parseSqlValues(ordMatch[1]);
    db.orders = rawRows.map(r => ({
      id: r[1], // order_code
      orderCode: r[1],
      customerName: r[3],
      code: r[4], // event_code
      packageId: r[5],
      packageTitle: r[6],
      ticketCount: r[7],
      totalCount: r[7],
      unitPrice: r[8],
      price: r[9],
      speed: r[10] || 'VIP',
      completedCount: r[11] || 0,
      status: r[12] || 'RUNNING',
      createdAt: r[13] || new Date().toLocaleString('vi-VN')
    }));
  }

  // 5. Transactions
  const txMatch = sqlText.match(/INSERT\s+INTO\s+`?transactions`?\s*(?:\([^\)]*\))?\s*VALUES\s*([\s\S]*?);/i);
  if (txMatch) {
    const rawRows = parseSqlValues(txMatch[1]);
    db.transactions = rawRows.map(r => ({
      id: r[1], // trans_code
      username: r[2],
      type: r[3],
      amount: r[4],
      method: r[5],
      description: r[6],
      status: r[7] || 'SUCCESS',
      createdAt: r[8] || new Date().toLocaleString('vi-VN')
    }));
  }

  return db;
}

function serializeToSql(db) {
  const esc = (str) => {
    if (str === null || str === undefined) return "NULL";
    return "'" + String(str).replace(/'/g, "''") + "'";
  };

  const lines = [];
  lines.push('-- ==============================================================================');
  lines.push('-- CƠ SỞ DỮ LIỆU MYSQL GỐC: HỆ THỐNG CHUNG SỨC TỰ ĐỘNG LIÊN QUÂN MOBILE');
  lines.push('-- Tự động cập nhật trực tiếp vào lúc: ' + new Date().toLocaleString('vi-VN'));
  lines.push('-- ==============================================================================');
  lines.push('');
  lines.push('CREATE DATABASE IF NOT EXISTS `chungsuc_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  lines.push('USE `chungsuc_db`;');
  lines.push('');
  lines.push('DROP TABLE IF EXISTS `order_details`;');
  lines.push('DROP TABLE IF EXISTS `orders`;');
  lines.push('DROP TABLE IF EXISTS `transactions`;');
  lines.push('DROP TABLE IF EXISTS `event_packages`;');
  lines.push('DROP TABLE IF EXISTS `users`;');
  lines.push('DROP TABLE IF EXISTS `system_settings`;');
  lines.push('');
  lines.push('-- 1. BẢNG NGƯỜI DÙNG (users)');
  lines.push('CREATE TABLE `users` (');
  lines.push('  `id` INT AUTO_INCREMENT PRIMARY KEY,');
  lines.push('  `username` VARCHAR(64) NOT NULL UNIQUE,');
  lines.push('  `password` VARCHAR(255) NOT NULL,');
  lines.push("  `role` ENUM('ROLE_ADMIN', 'ROLE_USER') NOT NULL DEFAULT 'ROLE_USER',");
  lines.push('  `balance` BIGINT NOT NULL DEFAULT 0,');
  lines.push('  `phone` VARCHAR(20) NOT NULL,');
  lines.push('  `email` VARCHAR(255) NULL,');
  lines.push("  `status` ENUM('ACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',");
  lines.push('  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,');
  lines.push('  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,');
  lines.push('  INDEX `idx_users_role` (`role`),');
  lines.push('  INDEX `idx_users_status` (`status`)');
  lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
  lines.push('');
  lines.push('-- 2. BẢNG GÓI SỰ KIỆN (event_packages)');
  lines.push('CREATE TABLE `event_packages` (');
  lines.push('  `id` INT AUTO_INCREMENT PRIMARY KEY,');
  lines.push('  `package_code` VARCHAR(50) NOT NULL UNIQUE,');
  lines.push("  `title` VARCHAR(255) NOT NULL COMMENT 'Tên gói sự kiện',");
  lines.push("  `ticket_count` INT NOT NULL DEFAULT 10 COMMENT 'Số vé / lượt chạy',");
  lines.push("  `price` BIGINT NOT NULL DEFAULT 5000 COMMENT 'Giá thanh toán (VNĐ)',");
  lines.push("  `original_price` BIGINT NULL COMMENT 'Giá gốc trước khi giảm',");
  lines.push("  `badge` VARCHAR(50) NULL DEFAULT 'HOT',");
  lines.push('  `description` TEXT NULL,');
  lines.push('  `image_url` LONGTEXT NULL,');
  lines.push('  `is_active` TINYINT(1) NOT NULL DEFAULT 1,');
  lines.push('  `display_order` INT NOT NULL DEFAULT 0,');
  lines.push('  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,');
  lines.push('  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,');
  lines.push('  INDEX `idx_packages_active` (`is_active`),');
  lines.push('  INDEX `idx_packages_order` (`display_order`)');
  lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
  lines.push('');
  lines.push('-- 3. BẢNG ĐƠN HÀNG (orders)');
  lines.push('CREATE TABLE `orders` (');
  lines.push('  `id` INT AUTO_INCREMENT PRIMARY KEY,');
  lines.push('  `order_code` VARCHAR(50) NOT NULL UNIQUE,');
  lines.push('  `user_id` INT NULL,');
  lines.push('  `customer_name` VARCHAR(150) NOT NULL,');
  lines.push('  `event_code` VARCHAR(255) NOT NULL,');
  lines.push('  `package_id` VARCHAR(50) NULL,');
  lines.push('  `package_title` VARCHAR(255) NULL,');
  lines.push('  `ticket_count` INT NOT NULL DEFAULT 10,');
  lines.push('  `unit_price` BIGINT NOT NULL DEFAULT 500,');
  lines.push('  `total_price` BIGINT NOT NULL DEFAULT 5000,');
  lines.push("  `speed` ENUM('VIP', 'STANDARD') NOT NULL DEFAULT 'VIP',");
  lines.push('  `completed_count` INT NOT NULL DEFAULT 0,');
  lines.push("  `status` ENUM('PENDING', 'RUNNING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'RUNNING',");
  lines.push('  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
  lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
  lines.push('');
  lines.push('-- 4. BẢNG GIAO DỊCH (transactions)');
  lines.push('CREATE TABLE `transactions` (');
  lines.push('  `id` INT AUTO_INCREMENT PRIMARY KEY,');
  lines.push('  `trans_code` VARCHAR(50) NOT NULL UNIQUE,');
  lines.push('  `username` VARCHAR(64) NOT NULL,');
  lines.push('  `type` VARCHAR(20) NOT NULL,');
  lines.push('  `amount` BIGINT NOT NULL,');
  lines.push("  `method` VARCHAR(50) NOT NULL DEFAULT 'VietQR',");
  lines.push('  `description` VARCHAR(255) NOT NULL,');
  lines.push("  `status` VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',");
  lines.push('  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
  lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
  lines.push('');
  lines.push('-- 5. BẢNG CẤU HÌNH HỆ THỐNG (system_settings)');
  lines.push('CREATE TABLE `system_settings` (');
  lines.push('  `id` INT AUTO_INCREMENT PRIMARY KEY,');
  lines.push('  `setting_key` VARCHAR(100) NOT NULL UNIQUE,');
  lines.push('  `setting_value` TEXT NOT NULL,');
  lines.push('  `description` VARCHAR(255) NULL,');
  lines.push('  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
  lines.push('');
  lines.push('-- ==============================================================================');
  lines.push('-- DỮ LIỆU HIỆN HÀNH (LIVE SEED DATA TRỰC TIẾP TỪ DATABASE.SQL)');
  lines.push('-- ==============================================================================');
  lines.push('');

  // 1. Users
  const uList = db.users || [];
  if (uList.length > 0) {
    lines.push('-- 1. DỮ LIỆU NGƯỜI DÙNG');
    const uRows = uList.map((u, idx) => {
      return `(${idx + 1}, ${esc(u.username)}, ${esc(u.password || 'password123456')}, ${esc(u.role || 'ROLE_USER')}, ${u.balance || 0}, ${esc(u.phone || '0372.852.287')}, ${esc(u.email || (u.username + '@shopchungsuc.com'))}, 'ACTIVE', NOW())`;
    });
    lines.push('INSERT INTO `users` (`id`, `username`, `password`, `role`, `balance`, `phone`, `email`, `status`, `created_at`) VALUES');
    lines.push(uRows.join(',\n') + ';\n');
  }

  // 2. Packages
  const pList = db.packages || [];
  if (pList.length > 0) {
    lines.push('-- 2. DỮ LIỆU GÓI SỰ KIỆN');
    const pRows = pList.map((p, idx) => {
      const code = p.id || p.code || ('PKG_' + (idx + 1));
      const orig = p.originalPrice || Math.round((p.price || 5000) * 1.2);
      return `(${idx + 1}, ${esc(code)}, ${esc(p.title)}, ${p.ticketCount || 10}, ${p.price || 5000}, ${orig}, ${esc(p.badge || '')}, ${esc(p.description || '')}, ${esc(p.imageUrl || 'uploads/logo.png')}, ${p.isActive ? 1 : 0}, ${idx + 1})`;
    });
    lines.push('INSERT INTO `event_packages` (`id`, `package_code`, `title`, `ticket_count`, `price`, `original_price`, `badge`, `description`, `image_url`, `is_active`, `display_order`) VALUES');
    lines.push(pRows.join(',\n') + ';\n');
  }

  // 3. Settings
  const st = db.settings || {};
  lines.push('-- 3. CẤU HÌNH HỆ THỐNG');
  const sRows = [
    `('ADMIN_HOTLINE', ${esc(st.adminPhone || '0372.852.287')}, 'Số điện thoại hỗ trợ admin')`,
    `('ADMIN_ZALO', ${esc(st.adminZalo || 'https://zalo.me/triduc1903')}, 'Đường link Zalo hỗ trợ khách hàng')`,
    `('DEFAULT_TICKET_PRICE', ${esc(st.ticketPrice || 500)}, 'Đơn giá mỗi vé chạy mã (VNĐ)')`,
    `('BANK_NAME', ${esc(st.bankName || 'MB Bank')}, 'Tên ngân hàng nhận chuyển khoản')`,
    `('BANK_ACCOUNT_NUMBER', ${esc(st.bankAccount || '01111111111100')}, 'Số tài khoản ngân hàng')`,
    `('BANK_ACCOUNT_NAME', ${esc(st.bankOwner || 'NGUYEN TRI DUC')}, 'Tên chủ tài khoản ngân hàng')`
  ];
  lines.push('INSERT INTO `system_settings` (`setting_key`, `setting_value`, `description`) VALUES');
  lines.push(sRows.join(',\n') + ';\n');

  // 4. Orders
  const oList = db.orders || [];
  if (oList.length > 0) {
    lines.push('-- 4. DỮ LIỆU ĐƠN HÀNG');
    const oRows = oList.map((o, idx) => {
      const code = o.id || o.orderCode || ('CS' + (10000 + idx));
      const cName = o.customerName || o.username || 'Khách';
      const eCode = o.code || o.eventCode || 'AOV-VIP';
      const pkgId = o.packageId || 'PKG_10';
      const pkgTitle = o.packageTitle || 'Chung Sức';
      const tCount = o.ticketCount || o.totalCount || 10;
      const uPrice = o.unitPrice || 500;
      const tPrice = o.price || 5000;
      const speed = o.speed || 'VIP';
      const cCount = o.completedCount || 0;
      const status = o.status || 'RUNNING';
      return `(${idx + 1}, ${esc(code)}, 3, ${esc(cName)}, ${esc(eCode)}, ${esc(pkgId)}, ${esc(pkgTitle)}, ${tCount}, ${uPrice}, ${tPrice}, ${esc(speed)}, ${cCount}, ${esc(status)}, NOW())`;
    });
    lines.push('INSERT INTO `orders` (`id`, `order_code`, `user_id`, `customer_name`, `event_code`, `package_id`, `package_title`, `ticket_count`, `unit_price`, `total_price`, `speed`, `completed_count`, `status`, `created_at`) VALUES');
    lines.push(oRows.join(',\n') + ';\n');
  }

  // 5. Transactions
  const tList = db.transactions || [];
  if (tList.length > 0) {
    lines.push('-- 5. DỮ LIỆU LỊCH SỬ GIAO DỊCH');
    const tRows = tList.map((t, idx) => {
      const code = t.id || t.transCode || ('GD' + (1000 + idx));
      const uName = t.username || 'demo';
      const type = t.type || 'deposit';
      const amt = t.amount || 0;
      const meth = t.method || 'VietQR MBBank';
      const desc = t.description || 'Giao dịch';
      const status = t.status || 'SUCCESS';
      return `(${idx + 1}, ${esc(code)}, ${esc(uName)}, ${esc(type)}, ${amt}, ${esc(meth)}, ${esc(desc)}, ${esc(status)}, NOW())`;
    });
    lines.push('INSERT INTO `transactions` (`id`, `trans_code`, `username`, `type`, `amount`, `method`, `description`, `status`, `created_at`) VALUES');
    lines.push(tRows.join(',\n') + ';\n');
  }

  return lines.join('\n');
}

module.exports = {
  parseSql,
  serializeToSql
};
