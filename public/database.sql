-- ==============================================================================
-- CƠ SỞ DỮ LIỆU MYSQL: HỆ THỐNG CHUNG SỨC TỰ ĐỘNG LIÊN QUÂN MOBILE
-- Phiên bản: 2.0 (Hỗ trợ quản trị, gói sự kiện, đơn hàng, giao dịch, thống kê)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `chungsuc_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `chungsuc_db`;

-- ------------------------------------------------------------------------------
-- 1. BẢNG NGƯỜI DÙNG (users)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `order_details`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `event_packages`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `system_settings`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('ROLE_ADMIN', 'ROLE_USER') NOT NULL DEFAULT 'ROLE_USER',
  `balance` BIGINT NOT NULL DEFAULT 0,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(255) NULL,
  `status` ENUM('ACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. BẢNG GÓI SỰ KIỆN (event_packages)
-- ------------------------------------------------------------------------------
CREATE TABLE `event_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `package_code` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL COMMENT 'Tên gói sự kiện',
  `ticket_count` INT NOT NULL DEFAULT 10 COMMENT 'Số vé / lượt chạy',
  `price` BIGINT NOT NULL DEFAULT 5000 COMMENT 'Giá thanh toán (VNĐ)',
  `original_price` BIGINT NULL COMMENT 'Giá gốc trước khi giảm',
  `badge` VARCHAR(50) NULL DEFAULT 'HOT' COMMENT 'Huy hiệu: HOT, TIẾT KIỆM, VIP...',
  `description` TEXT NULL COMMENT 'Mô tả chi tiết quyền lợi',
  `image_url` LONGTEXT NULL COMMENT 'Ảnh tham khảo từ thiết bị hoặc URL',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Hoạt động, 0: Ẩn',
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_packages_active` (`is_active`),
  INDEX `idx_packages_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. BẢNG ĐƠN HÀNG (orders)
-- ------------------------------------------------------------------------------
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã đơn dạng CS12345',
  `user_id` INT NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL COMMENT 'Tên khách hàng bắt buộc',
  `event_code` VARCHAR(255) NOT NULL COMMENT 'Mã sự kiện hoặc link mời trong game',
  `package_id` INT NULL COMMENT 'Gói sự kiện (nếu chọn theo gói)',
  `ticket_count` INT NOT NULL DEFAULT 10 COMMENT 'Số vé cần chạy',
  `unit_price` BIGINT NOT NULL DEFAULT 500 COMMENT 'Đơn giá mỗi vé (VNĐ)',
  `total_price` BIGINT NOT NULL DEFAULT 5000 COMMENT 'Tổng số tiền thanh toán (VNĐ)',
  `speed` ENUM('VIP', 'STANDARD') NOT NULL DEFAULT 'VIP',
  `completed_count` INT NOT NULL DEFAULT 0 COMMENT 'Số vé đã hoàn tất',
  `status` ENUM('PENDING', 'RUNNING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'RUNNING',
  `note` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_orders_user` (`user_id`),
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_created` (`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orders_package` FOREIGN KEY (`package_id`) REFERENCES `event_packages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. BẢNG CHI TIẾT ĐƠN HÀNG (order_details)
-- ------------------------------------------------------------------------------
CREATE TABLE `order_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `event_type` VARCHAR(100) NOT NULL DEFAULT 'chungsuc' COMMENT 'Chung Sức, Bắn Bi, Mời Bạn Bè...',
  `server_bot` VARCHAR(50) NOT NULL DEFAULT 'BOT_VIP_SUPER_01',
  `log_info` TEXT NULL COMMENT 'Nhật ký tiến trình chạy',
  `start_time` DATETIME NULL,
  `finish_time` DATETIME NULL,
  CONSTRAINT `fk_order_details_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. BẢNG LỊCH SỬ GIAO DỊCH & BIẾN ĐỘNG SỐ DƯ (transactions)
-- ------------------------------------------------------------------------------
CREATE TABLE `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `trans_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã giao dịch dạng GD1234',
  `user_id` INT NOT NULL,
  `type` ENUM('DEPOSIT', 'PURCHASE', 'REFUND', 'ADMIN_ADJUST') NOT NULL,
  `amount` BIGINT NOT NULL COMMENT 'Số tiền biến động (+ hoặc -)',
  `balance_before` BIGINT NOT NULL DEFAULT 0,
  `balance_after` BIGINT NOT NULL DEFAULT 0,
  `method` VARCHAR(50) NOT NULL DEFAULT 'VietQR' COMMENT 'VietQR, Thẻ cào, Trừ số dư, Admin',
  `description` VARCHAR(255) NOT NULL,
  `status` ENUM('SUCCESS', 'PENDING', 'FAILED') NOT NULL DEFAULT 'SUCCESS',
  `card_type` VARCHAR(50) NULL,
  `card_pin` VARCHAR(100) NULL,
  `card_seri` VARCHAR(100) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_trans_user` (`user_id`),
  INDEX `idx_trans_type` (`type`),
  INDEX `idx_trans_created` (`created_at`),
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. BẢNG CẤU HÌNH HỆ THỐNG (system_settings)
-- ------------------------------------------------------------------------------
CREATE TABLE `system_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ==============================================================================

-- 1. Tài khoản mặc định: Admin và Demo User
INSERT INTO `users` (`id`, `username`, `password`, `role`, `balance`, `phone`, `email`, `status`, `created_at`) VALUES
(1, 'admin', 'admin123', 'ROLE_ADMIN', 1000000, '0372.852.287', 'admin@shopchungsuc.com', 'ACTIVE', NOW()),
(2, 'zero2k5', 'a19032005', 'ROLE_ADMIN', 1000000, '0372.852.287', 'zero2k5@shopchungsuc.com', 'ACTIVE', NOW()),
(3, 'demo', 'demo12345678', 'ROLE_USER', 150000, '0912345678', 'demo@shopchungsuc.com', 'ACTIVE', NOW());

-- 2. Gói sự kiện mẫu ban đầu
INSERT INTO `event_packages` (`id`, `package_code`, `title`, `ticket_count`, `price`, `original_price`, `badge`, `description`, `image_url`, `is_active`, `display_order`) VALUES
(1, 'PKG_10', 'Gói Khởi Động - 10 Vé Chung Sức', 10, 5000, 6000, 'CƠ BẢN', 'Chạy 10 vé sự kiện Chung Sức Liên Quân cực nhanh trong 1-2 phút. Thích hợp mở đầu nhận quà.', 'uploads/logo.png', 1, 1),
(2, 'PKG_20', 'Gói Tiết Kiệm - 20 Vé Chung Sức', 20, 10000, 12000, 'PHỔ BIẾN', 'Gói được game thủ lựa chọn nhiều nhất. Chạy 20 lượt trúng rương trang phục và tướng hot.', 'uploads/logo.png', 1, 2),
(3, 'PKG_50', 'Gói Cao Thủ - 50 Vé Chung Sức', 50, 24000, 28000, 'HOT -4%', 'Chạy 50 vé siêu tốc ưu đãi giảm giá, BOT VIP đẩy tự động hoàn thành trong 3 phút.', 'uploads/logo.png', 1, 3),
(4, 'PKG_100', 'Gói Đại Gia - 100 Vé Chung Sức', 100, 45000, 55000, 'VIP -10%', 'Chạy 100 vé sự kiện nhận trọn bộ quà tặng sự kiện độc quyền. Giảm ngay 10.000 đ.', 'uploads/logo.png', 1, 4),
(5, 'PKG_BANBI_30', 'Gói Bắn Bi Siêu Tốc - 30 Vé', 30, 15000, 18000, 'BẮN BI', 'Chuyên dụng cho sự kiện Bắn Bi Liên Quân Mobile. Bắn trúng ô quà VIP không tốn công.', 'uploads/logo.png', 1, 5),
(6, 'PKG_200', 'Gói Chiến Tướng - 200 Vé Max Binh', 200, 85000, 110000, 'SIÊU GIẢM 15%', 'Gói max binh 200 vé ưu đãi cực khủng, hỗ trợ chạy nhiều sự kiện cùng lúc siêu tốc.', 'uploads/logo.png', 1, 6);

-- 3. Cấu hình hệ thống (Admin, Hotline, Zalo)
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `description`) VALUES
('ADMIN_HOTLINE', '0372.852.287', 'Số điện thoại hỗ trợ admin'),
('ADMIN_ZALO', 'https://zalo.me/triduc1903', 'Đường link Zalo hỗ trợ khách hàng'),
('DEFAULT_TICKET_PRICE', '500', 'Đơn giá mỗi vé chạy mã (VNĐ)'),
('BANK_NAME', 'MB BANK (Ngân hàng Quân Đội)', 'Tên ngân hàng nhận chuyển khoản'),
('BANK_ACCOUNT_NUMBER', '01111111111100', 'Số tài khoản ngân hàng'),
('BANK_ACCOUNT_NAME', 'NGUYEN TRI DUC', 'Tên chủ tài khoản ngân hàng');

-- 4. Đơn hàng mẫu
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `customer_name`, `event_code`, `package_id`, `ticket_count`, `unit_price`, `total_price`, `speed`, `completed_count`, `status`, `created_at`) VALUES
(1, 'CS10091', 3, 'Nguyễn Văn Nam', 'AOV-LQ888-VN', 2, 20, 500, 10000, 'VIP', 20, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 'CS10092', 3, 'Trần Minh Quang', 'BANBI-77992', 3, 50, 480, 24000, 'VIP', 42, 'RUNNING', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(3, 'CS10093', 3, 'Lê Hoàng Long', 'AOV-CS-CHIENTUONG', 1, 10, 500, 5000, 'VIP', 10, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 5. Lịch sử giao dịch mẫu
INSERT INTO `transactions` (`id`, `trans_code`, `user_id`, `type`, `amount`, `balance_before`, `balance_after`, `method`, `description`, `status`, `created_at`) VALUES
(1, 'GD9901', 3, 'DEPOSIT', 100000, 0, 100000, 'VietQR MBBank', 'Nạp tiền tự động qua VietQR MB Bank', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 'GD9902', 3, 'PURCHASE', -10000, 100000, 90000, 'Trừ số dư', 'Thanh toán đơn chạy mã Chung Sức #CS10091', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(3, 'GD9903', 3, 'DEPOSIT', 50000, 90000, 140000, 'VietQR MBBank', 'Nạp tiền tự động qua VietQR MB Bank', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(4, 'GD9904', 3, 'PURCHASE', -24000, 140000, 116000, 'Trừ số dư', 'Thanh toán đơn chạy mã Bắn Bi #CS10092', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 30 MINUTE));
