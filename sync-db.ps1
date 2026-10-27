# ==============================================================================
# SCRIPT TỰ ĐỘNG CHUYỂN ĐỔI DATABASE.JSON THÀNH DATABASE.SQL CHUẨN
# ==============================================================================
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$jsonPath = Join-Path $PSScriptRoot "database.json"
$sqlPath = Join-Path $PSScriptRoot "database.sql"

if (-not (Test-Path $jsonPath)) {
    Write-Host "[ERROR] Không tìm thấy file $jsonPath" -ForegroundColor Red
    exit 1
}

$raw = Get-Content -Path $jsonPath -Raw -Encoding UTF8
$db = ConvertFrom-Json $raw

function Escape-Sql([string]$str) {
    if ($null -eq $str) { return "NULL" }
    $escaped = $str.Replace("'", "''")
    return "'$escaped'"
}

$lines = [System.Collections.Generic.List[string]]::new()

$lines.Add('-- ==============================================================================')
$lines.Add('-- CƠ SỞ DỮ LIỆU MYSQL: HỆ THỐNG CHUNG SỨC TỰ ĐỘNG LIÊN QUÂN MOBILE')
$lines.Add("-- Tự động đồng bộ từ database.json vào lúc: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')")
$lines.Add('-- ==============================================================================')
$lines.Add('')
$lines.Add('CREATE DATABASE IF NOT EXISTS `chungsuc_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;')
$lines.Add('USE `chungsuc_db`;')
$lines.Add('')
$lines.Add('DROP TABLE IF EXISTS `order_details`;')
$lines.Add('DROP TABLE IF EXISTS `orders`;')
$lines.Add('DROP TABLE IF EXISTS `transactions`;')
$lines.Add('DROP TABLE IF EXISTS `event_packages`;')
$lines.Add('DROP TABLE IF EXISTS `users`;')
$lines.Add('DROP TABLE IF EXISTS `system_settings`;')
$lines.Add('')
$lines.Add('-- 1. BẢNG NGƯỜI DÙNG (users)')
$lines.Add('CREATE TABLE `users` (')
$lines.Add('  `id` INT AUTO_INCREMENT PRIMARY KEY,')
$lines.Add('  `username` VARCHAR(64) NOT NULL UNIQUE,')
$lines.Add('  `password` VARCHAR(255) NOT NULL,')
$lines.Add('  `role` ENUM(''ROLE_ADMIN'', ''ROLE_USER'') NOT NULL DEFAULT ''ROLE_USER'',')
$lines.Add('  `balance` BIGINT NOT NULL DEFAULT 0,')
$lines.Add('  `phone` VARCHAR(20) NOT NULL,')
$lines.Add('  `email` VARCHAR(255) NULL,')
$lines.Add('  `status` ENUM(''ACTIVE'', ''BANNED'') NOT NULL DEFAULT ''ACTIVE'',')
$lines.Add('  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,')
$lines.Add('  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,')
$lines.Add('  INDEX `idx_users_role` (`role`),')
$lines.Add('  INDEX `idx_users_status` (`status`)')
$lines.Add(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
$lines.Add('')
$lines.Add('-- 2. BẢNG GÓI SỰ KIỆN (event_packages)')
$lines.Add('CREATE TABLE `event_packages` (')
$lines.Add('  `id` INT AUTO_INCREMENT PRIMARY KEY,')
$lines.Add('  `package_code` VARCHAR(50) NOT NULL UNIQUE,')
$lines.Add('  `title` VARCHAR(255) NOT NULL COMMENT ''Tên gói sự kiện'',')
$lines.Add('  `ticket_count` INT NOT NULL DEFAULT 10 COMMENT ''Số vé / lượt chạy'',')
$lines.Add('  `price` BIGINT NOT NULL DEFAULT 5000 COMMENT ''Giá thanh toán (VNĐ)'',')
$lines.Add('  `original_price` BIGINT NULL COMMENT ''Giá gốc trước khi giảm'',')
$lines.Add('  `badge` VARCHAR(50) NULL DEFAULT ''HOT'',')
$lines.Add('  `description` TEXT NULL,')
$lines.Add('  `image_url` LONGTEXT NULL,')
$lines.Add('  `is_active` TINYINT(1) NOT NULL DEFAULT 1,')
$lines.Add('  `display_order` INT NOT NULL DEFAULT 0,')
$lines.Add('  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,')
$lines.Add('  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,')
$lines.Add('  INDEX `idx_packages_active` (`is_active`),')
$lines.Add('  INDEX `idx_packages_order` (`display_order`)')
$lines.Add(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
$lines.Add('')
$lines.Add('-- 3. BẢNG ĐƠN HÀNG (orders)')
$lines.Add('CREATE TABLE `orders` (')
$lines.Add('  `id` INT AUTO_INCREMENT PRIMARY KEY,')
$lines.Add('  `order_code` VARCHAR(50) NOT NULL UNIQUE,')
$lines.Add('  `user_id` INT NULL,')
$lines.Add('  `customer_name` VARCHAR(150) NOT NULL,')
$lines.Add('  `event_code` VARCHAR(255) NOT NULL,')
$lines.Add('  `package_id` VARCHAR(50) NULL,')
$lines.Add('  `package_title` VARCHAR(255) NULL,')
$lines.Add('  `ticket_count` INT NOT NULL DEFAULT 10,')
$lines.Add('  `unit_price` BIGINT NOT NULL DEFAULT 500,')
$lines.Add('  `total_price` BIGINT NOT NULL DEFAULT 5000,')
$lines.Add('  `speed` ENUM(''VIP'', ''STANDARD'') NOT NULL DEFAULT ''VIP'',')
$lines.Add('  `completed_count` INT NOT NULL DEFAULT 0,')
$lines.Add('  `status` ENUM(''PENDING'', ''RUNNING'', ''COMPLETED'', ''CANCELLED'') NOT NULL DEFAULT ''RUNNING'',')
$lines.Add('  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP')
$lines.Add(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
$lines.Add('')
$lines.Add('-- 4. BẢNG GIAO DỊCH (transactions)')
$lines.Add('CREATE TABLE `transactions` (')
$lines.Add('  `id` INT AUTO_INCREMENT PRIMARY KEY,')
$lines.Add('  `trans_code` VARCHAR(50) NOT NULL UNIQUE,')
$lines.Add('  `username` VARCHAR(64) NOT NULL,')
$lines.Add('  `type` VARCHAR(20) NOT NULL,')
$lines.Add('  `amount` BIGINT NOT NULL,')
$lines.Add('  `method` VARCHAR(50) NOT NULL DEFAULT ''VietQR'',')
$lines.Add('  `description` VARCHAR(255) NOT NULL,')
$lines.Add('  `status` VARCHAR(20) NOT NULL DEFAULT ''SUCCESS'',')
$lines.Add('  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP')
$lines.Add(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
$lines.Add('')
$lines.Add('-- 5. BẢNG CẤU HÌNH HỆ THỐNG (system_settings)')
$lines.Add('CREATE TABLE `system_settings` (')
$lines.Add('  `id` INT AUTO_INCREMENT PRIMARY KEY,')
$lines.Add('  `setting_key` VARCHAR(100) NOT NULL UNIQUE,')
$lines.Add('  `setting_value` TEXT NOT NULL,')
$lines.Add('  `description` VARCHAR(255) NULL,')
$lines.Add('  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
$lines.Add(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
$lines.Add('')
$lines.Add('-- ==============================================================================')
$lines.Add('-- DỮ LIỆU HIỆN HÀNH (LIVE SEED DATA TỪ DATABASE.JSON)')
$lines.Add('-- ==============================================================================')
$lines.Add('')

# 1. Users
if ($db.users -and $db.users.Count -gt 0) {
    $lines.Add('-- 1. DỮ LIỆU NGƯỜI DÙNG')
    $userRows = @()
    foreach ($u in $db.users) {
        $uRole = if ($u.role) { $u.role } else { "ROLE_USER" }
        $uBal = if ($u.balance) { $u.balance } else { 0 }
        $uPhone = if ($u.phone) { $u.phone } else { "0372.852.287" }
        $uEmail = if ($u.email) { $u.email } else { "$($u.username)@shopchungsuc.com" }
        $userRows += "($($u.id), $(Escape-Sql $u.username), $(Escape-Sql $u.password), $(Escape-Sql $uRole), $uBal, $(Escape-Sql $uPhone), $(Escape-Sql $uEmail), 'ACTIVE', NOW())"
    }
    $lines.Add('INSERT INTO `users` (`id`, `username`, `password`, `role`, `balance`, `phone`, `email`, `status`, `created_at`) VALUES')
    $lines.Add(($userRows -join ",`n") + ';')
    $lines.Add('')
}

# 2. Packages
if ($db.packages -and $db.packages.Count -gt 0) {
    $lines.Add('-- 2. DỮ LIỆU GÓI SỰ KIỆN')
    $pkgRows = @()
    $pIdx = 1
    foreach ($p in $db.packages) {
        $pOrig = if ($p.originalPrice) { $p.originalPrice } else { 0 }
        $pBadge = if ($p.badge) { $p.badge } else { "" }
        $pDesc = if ($p.description) { $p.description } else { "" }
        $pImg = if ($p.imageUrl) { $p.imageUrl } else { "uploads/logo.png" }
        $pActive = if ($p.isActive -eq $false) { 0 } else { 1 }
        $pkgRows += "($pIdx, $(Escape-Sql $p.id), $(Escape-Sql $p.title), $($p.ticketCount), $($p.price), $pOrig, $(Escape-Sql $pBadge), $(Escape-Sql $pDesc), $(Escape-Sql $pImg), $pActive, $pIdx)"
        $pIdx++
    }
    $lines.Add('INSERT INTO `event_packages` (`id`, `package_code`, `title`, `ticket_count`, `price`, `original_price`, `badge`, `description`, `image_url`, `is_active`, `display_order`) VALUES')
    $lines.Add(($pkgRows -join ",`n") + ';')
    $lines.Add('')
}

# 3. Settings
if ($db.settings) {
    $lines.Add('-- 3. CẤU HÌNH HỆ THỐNG')
    $setRows = @(
        "('ADMIN_HOTLINE', $(Escape-Sql $db.settings.adminPhone), 'Số điện thoại hỗ trợ admin')",
        "('ADMIN_ZALO', $(Escape-Sql $db.settings.adminZalo), 'Đường link Zalo hỗ trợ khách hàng')",
        "('DEFAULT_TICKET_PRICE', $(Escape-Sql ([string]$db.settings.ticketPrice)), 'Đơn giá mỗi vé chạy mã (VNĐ)')",
        "('BANK_NAME', $(Escape-Sql $db.settings.bankName), 'Tên ngân hàng nhận chuyển khoản')",
        "('BANK_ACCOUNT_NUMBER', $(Escape-Sql $db.settings.bankAccount), 'Số tài khoản ngân hàng')",
        "('BANK_ACCOUNT_NAME', $(Escape-Sql $db.settings.bankOwner), 'Tên chủ tài khoản ngân hàng')"
    )
    $lines.Add('INSERT INTO `system_settings` (`setting_key`, `setting_value`, `description`) VALUES')
    $lines.Add(($setRows -join ",`n") + ';')
    $lines.Add('')
}

# 4. Orders
if ($db.orders -and $db.orders.Count -gt 0) {
    $lines.Add('-- 4. DỮ LIỆU ĐƠN HÀNG')
    $ordRows = @()
    $oIdx = 1
    foreach ($o in $db.orders) {
        $cName = if ($o.customerName) { $o.customerName } else { "Khách Hàng" }
        $eCode = if ($o.eventCode) { $o.eventCode } else { if ($o.code) { $o.code } else { "AOV-LQ" } }
        $pkgId = if ($o.packageId) { $o.packageId } else { "PKG_10" }
        $pkgTitle = if ($o.packageTitle) { $o.packageTitle } else { "Gói Sự Kiện" }
        $tCount = if ($o.ticketCount) { $o.ticketCount } else { if ($o.totalCount) { $o.totalCount } else { 10 } }
        $cCount = if ($o.completedCount) { $o.completedCount } else { 0 }
        $uPrice = if ($o.unitPrice) { $o.unitPrice } else { 500 }
        $tPrice = if ($o.price) { $o.price } else { 5000 }
        $oStatus = if ($o.status) { $o.status } else { "RUNNING" }
        $ordRows += "($oIdx, $(Escape-Sql $o.id), 3, $(Escape-Sql $cName), $(Escape-Sql $eCode), $(Escape-Sql $pkgId), $(Escape-Sql $pkgTitle), $tCount, $uPrice, $tPrice, 'VIP', $cCount, $(Escape-Sql $oStatus), NOW())"
        $oIdx++
    }
    $lines.Add('INSERT INTO `orders` (`id`, `order_code`, `user_id`, `customer_name`, `event_code`, `package_id`, `package_title`, `ticket_count`, `unit_price`, `total_price`, `speed`, `completed_count`, `status`, `created_at`) VALUES')
    $lines.Add(($ordRows -join ",`n") + ';')
    $lines.Add('')
}

# 5. Transactions
if ($db.transactions -and $db.transactions.Count -gt 0) {
    $lines.Add('-- 5. DỮ LIỆU LỊCH SỬ GIAO DỊCH')
    $txRows = @()
    $tIdx = 1
    foreach ($t in $db.transactions) {
        $tUser = if ($t.username) { $t.username } else { "demo" }
        $tType = if ($t.type) { $t.type } else { "deposit" }
        $tAmt = if ($t.amount) { $t.amount } else { 0 }
        $tMeth = if ($t.method) { $t.method } else { "VietQR MBBank" }
        $tDesc = if ($t.description) { $t.description } else { "Giao dịch hệ thống" }
        $tStat = if ($t.status) { $t.status } else { "SUCCESS" }
        $txRows += "($tIdx, $(Escape-Sql $t.id), $(Escape-Sql $tUser), $(Escape-Sql $tType), $tAmt, $(Escape-Sql $tMeth), $(Escape-Sql $tDesc), $(Escape-Sql $tStat), NOW())"
        $tIdx++
    }
    $lines.Add('INSERT INTO `transactions` (`id`, `trans_code`, `username`, `type`, `amount`, `method`, `description`, `status`, `created_at`) VALUES')
    $lines.Add(($txRows -join ",`n") + ';')
    $lines.Add('')
}

[System.IO.File]::WriteAllLines($sqlPath, $lines, [System.Text.Encoding]::UTF8)

$pubSql = Join-Path $PSScriptRoot "public\database.sql"
if (Test-Path (Split-Path -Parent $pubSql)) {
    [System.IO.File]::WriteAllLines($pubSql, $lines, [System.Text.Encoding]::UTF8)
}

$srcSql = Join-Path $PSScriptRoot "src\main\resources\META-INF\resources\database.sql"
if (Test-Path (Split-Path -Parent $srcSql)) {
    [System.IO.File]::WriteAllLines($srcSql, $lines, [System.Text.Encoding]::UTF8)
}

Write-Host "[OK] Đã ghi toàn bộ dữ liệu mới nhất vào database.sql thành công!" -ForegroundColor Green
