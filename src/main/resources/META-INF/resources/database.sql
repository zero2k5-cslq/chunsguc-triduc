-- ==============================================================================
-- CƠ SỞ DỮ LIỆU MYSQL: HỆ THỐNG CHUNG SỨC TỰ ĐỘNG LIÊN QUÂN MOBILE
-- Tự động đồng bộ từ database.json vào lúc: 27/10/2026 23:04:42
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `chungsuc_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `chungsuc_db`;

DROP TABLE IF EXISTS `order_details`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `event_packages`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `system_settings`;

-- 1. BẢNG NGƯỜI DÙNG (users)
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

-- 2. BẢNG GÓI SỰ KIỆN (event_packages)
CREATE TABLE `event_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `package_code` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL COMMENT 'Tên gói sự kiện',
  `ticket_count` INT NOT NULL DEFAULT 10 COMMENT 'Số vé / lượt chạy',
  `price` BIGINT NOT NULL DEFAULT 5000 COMMENT 'Giá thanh toán (VNĐ)',
  `original_price` BIGINT NULL COMMENT 'Giá gốc trước khi giảm',
  `badge` VARCHAR(50) NULL DEFAULT 'HOT',
  `description` TEXT NULL,
  `image_url` LONGTEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_packages_active` (`is_active`),
  INDEX `idx_packages_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG ĐƠN HÀNG (orders)
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `event_code` VARCHAR(255) NOT NULL,
  `package_id` VARCHAR(50) NULL,
  `package_title` VARCHAR(255) NULL,
  `ticket_count` INT NOT NULL DEFAULT 10,
  `unit_price` BIGINT NOT NULL DEFAULT 500,
  `total_price` BIGINT NOT NULL DEFAULT 5000,
  `speed` ENUM('VIP', 'STANDARD') NOT NULL DEFAULT 'VIP',
  `completed_count` INT NOT NULL DEFAULT 0,
  `status` ENUM('PENDING', 'RUNNING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'RUNNING',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG GIAO DỊCH (transactions)
CREATE TABLE `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `trans_code` VARCHAR(50) NOT NULL UNIQUE,
  `username` VARCHAR(64) NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `amount` BIGINT NOT NULL,
  `method` VARCHAR(50) NOT NULL DEFAULT 'VietQR',
  `description` VARCHAR(255) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG CẤU HÌNH HỆ THỐNG (system_settings)
CREATE TABLE `system_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DỮ LIỆU HIỆN HÀNH (LIVE SEED DATA TỪ DATABASE.JSON)
-- ==============================================================================

-- 1. DỮ LIỆU NGƯỜI DÙNG
INSERT INTO `users` (`id`, `username`, `password`, `role`, `balance`, `phone`, `email`, `status`, `created_at`) VALUES
(1, 'admin', 'admin123', 'ROLE_ADMIN', 1000000, '0372.852.287', 'admin@shopchungsuc.com', 'ACTIVE', NOW()),
(2, 'zero2k5', 'a19032005', 'ROLE_ADMIN', 1000000, '0372.852.287', 'zero2k5@shopchungsuc.com', 'ACTIVE', NOW()),
(3, 'demo', 'demo12345678', 'ROLE_USER', 255000, '0912345678', 'demo@shopchungsuc.com', 'ACTIVE', NOW());

-- 2. DỮ LIỆU GÓI SỰ KIỆN
INSERT INTO `event_packages` (`id`, `package_code`, `title`, `ticket_count`, `price`, `original_price`, `badge`, `description`, `image_url`, `is_active`, `display_order`) VALUES
(1, 'PKG_10', 'Gói Khởi Động Chung Sức', 10, 5000, 6000, '', 'Chạy tự động sự kiện Chung Sức Liên Quân Mobile bằng hệ thống BOT VIP 24/7. Tốc độ siêu tốc trong 1-2 phút, đảm bảo trúng rương trang phục và tướng mở màn.', 'uploads/logo.png', 1, 1),
(2, 'PKG_20', 'Gói Tiết Kiệm Chung Sức', 20, 10000, 12000, '', 'Gói sự kiện phổ biến và được game thủ lựa chọn nhiều nhất. Tương thích toàn bộ sự kiện Chung Sức & Bắn Bi, cam kết tỷ lệ hoàn thành 100% cực kỳ ổn định.', 'uploads/logo.png', 1, 2),
(3, 'PKG_50', 'Gói Cao Thủ Siêu Tốc', 50, 24000, 28000, '', 'Gói cao cấp ưu đãi đặc biệt với luồng BOT VIP độc quyền. Đẩy tiến độ liên tục hoàn thành trong 3 phút, giúp săn trọn bộ quà tặng sự kiện và mở khóa skin giới hạn.', 'uploads/logo.png', 1, 3),
(4, 'PKG_100', 'Gói Đại Gia VIP', 100, 45000, 55000, '', 'Gói toàn diện chuyên nghiệp dành cho game thủ săn full sự kiện Liên Quân. Ưu tiên hàng chờ số 1 hệ thống, tự động hoàn thành siêu tốc và tiết kiệm chi phí tối đa.', 'uploads/logo.png', 1, 4),
(5, 'PKG_BANBI_30', 'Gói Bắn Bi Siêu Tốc', 30, 15000, 18000, '', 'Thiết kế tối ưu chuyên biệt cho sự kiện Bắn Bi Liên Quân Mobile. Tự động tính toán điểm chuẩn, bắn trúng ô quà VIP không cần canh giờ thủ công.', 'uploads/logo.png', 1, 5),
(6, 'PKG_200', 'Gói Chiến Tướng Max Binh', 200, 85000, 110000, '', 'Gói khủng nhất hệ thống phục vụ cày toàn bộ sự kiện lớn hoặc nhiều tài khoản cùng lúc. BOT VIP đa luồng xử lý đồng thời, bảo hành hoàn thành 100%.', 'uploads/logo.png', 1, 6);

-- 3. CẤU HÌNH HỆ THỐNG
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `description`) VALUES
('ADMIN_HOTLINE', '0372.852.287', 'Số điện thoại hỗ trợ admin'),
('ADMIN_ZALO', 'https://zalo.me/triduc1903', 'Đường link Zalo hỗ trợ khách hàng'),
('DEFAULT_TICKET_PRICE', '500', 'Đơn giá mỗi vé chạy mã (VNĐ)'),
('BANK_NAME', 'MB Bank', 'Tên ngân hàng nhận chuyển khoản'),
('BANK_ACCOUNT_NUMBER', '01111111111100', 'Số tài khoản ngân hàng'),
('BANK_ACCOUNT_NAME', 'NGUYEN TRI DUC', 'Tên chủ tài khoản ngân hàng');

-- 4. DỮ LIỆU ĐƠN HÀNG
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `customer_name`, `event_code`, `package_id`, `package_title`, `ticket_count`, `unit_price`, `total_price`, `speed`, `completed_count`, `status`, `created_at`) VALUES
(1, 'CS86814', 3, 'Anh Duc Test', 'AOV-TEST-CODE-888', 'PKG_10', 'Gói Khởi Động Chung Sức', 10, 500, 5000, 'VIP', 10, 'COMPLETED', NOW()),
(2, 'CS10091', 3, 'Nguyễn Văn Nam', 'AOV-LQ888-VN', 'PKG_10', 'Gói Tiết Kiệm - 20 Vé Chung Sức', 20, 500, 10000, 'VIP', 20, 'COMPLETED', NOW()),
(3, 'CS10092', 3, 'Trần Minh Quang', 'BANBI-77992', 'PKG_10', 'Gói Cao Thủ - 50 Vé Chung Sức', 50, 480, 24000, 'VIP', 50, 'COMPLETED', NOW()),
(4, 'CS10093', 3, 'Lê Hoàng Long', 'AOV-CS-CHIENTUONG', 'PKG_10', 'Gói Khởi Động - 10 Vé Chung Sức', 10, 500, 5000, 'VIP', 10, 'COMPLETED', NOW());

-- 5. DỮ LIỆU LỊCH SỬ GIAO DỊCH
INSERT INTO `transactions` (`id`, `trans_code`, `username`, `type`, `amount`, `method`, `description`, `status`, `created_at`) VALUES
(1, 'GD1847', 'demo', 'deposit', 20000, 'VietQR (NGUYEN TRI DUC)', 'Nạp tiền qua VietQR theo gói [Goi Tiet Kiem] (0111111111100 - NGUYEN TRI DUC)', 'SUCCESS', NOW()),
(2, 'GD8181', 'demo', 'deposit', 20000, 'VietQR (NGUYEN TRI DUC)', 'Nạp tiền qua VietQR theo gói [Goi Tiet Kiem] (0111111111100 - NGUYEN TRI DUC)', 'SUCCESS', NOW()),
(3, 'GD3238', 'demo', 'deposit', 50000, 'VietQR (NGUYEN TRI DUC)', 'Nạp tiền tự động qua QR NGUYEN TRI DUC (Đã nhận & xác minh Bill)', 'SUCCESS', NOW()),
(4, 'GD8017', 'demo', 'order', 5000, 'Trừ số dư', 'Mua gói: Gói Khởi Động Chung Sức #CS86814 - KH: Anh Duc Test', 'SUCCESS', NOW()),
(5, 'GD2329', 'demo', 'deposit', 20000, 'VietQR MBBank', 'Nạp tiền tự động qua VietQR MB Bank', 'SUCCESS', NOW()),
(6, 'GD9901', 'demo', 'deposit', 100000, 'VietQR MBBank', 'Nạp tiền tự động qua VietQR MB Bank', 'SUCCESS', NOW()),
(7, 'GD9902', 'demo', 'order', 10000, 'Trừ số dư', 'Thanh toán đơn chạy mã Chung Sức #CS10091', 'SUCCESS', NOW()),
(8, 'GD9903', 'demo', 'deposit', 50000, 'VietQR MBBank', 'Nạp tiền tự động qua VietQR MB Bank', 'SUCCESS', NOW()),
(9, 'GD9904', 'demo', 'order', 24000, 'Trừ số dư', 'Thanh toán đơn chạy mã Bắn Bi #CS10092', 'SUCCESS', NOW());

