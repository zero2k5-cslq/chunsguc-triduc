# ==============================================================================
# HỆ THỐNG CHUNG SỨC TỰ ĐỘNG - PowerShell Native HTTP Server & REST API v2.0
# ==============================================================================

Add-Type -AssemblyName System.Web -ErrorAction SilentlyContinue

$port = 8080
$prefix = "http://localhost:$port/"
$webRoot = Join-Path $PSScriptRoot "src\main\resources\META-INF\resources"
$dbFile = Join-Path $PSScriptRoot "database.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " KHỞI ĐỘNG HỆ THỐNG CHUNG SỨC TỰ ĐỘNG SERVER (Port $port)..." -ForegroundColor Green
Write-Host " Thư mục Web Root: $webRoot" -ForegroundColor Yellow
Write-Host " File Cơ Sở Dữ Liệu: $dbFile" -ForegroundColor Yellow
Write-Host " Đường dẫn truy cập: $prefix" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Load DB helper
function Get-Database {
    if (Test-Path $dbFile) {
        $raw = Get-Content -Path $dbFile -Raw -Encoding UTF8
        return ConvertFrom-Json $raw
    }
    return [PSCustomObject]@{
        users = @()
        packages = @()
        orders = @()
        transactions = @()
        settings = @{}
    }
}

# Save DB helper
function Save-Database($db) {
    $json = ConvertTo-Json -InputObject $db -Depth 10
    Set-Content -Path $dbFile -Value $json -Encoding UTF8
}

# Initialize HttpListener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "[OK] Server đã bắt đầu lắng nghe tại $prefix" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Không thể khởi động server: $_" -ForegroundColor Red
    exit 1
}

# MIME Types Dictionary
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

# Helper: Send JSON response
function Send-JsonResponse($response, $statusCode, $data, $httpMethod = "GET") {
    $response.StatusCode = $statusCode
    $response.ContentType = "application/json; charset=utf-8"
    $response.Headers.Add("Access-Control-Allow-Origin", "*")
    $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, x-csrf-token")
    
    $jsonString = ConvertTo-Json -InputObject $data -Depth 10 -Compress
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
    $response.ContentLength64 = $buffer.Length
    if ($httpMethod -ne "HEAD") {
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    $response.OutputStream.Close()
}

# Helper: Parse date safely
function Parse-DateSafe([string]$dateStr) {
    if ([string]::IsNullOrWhiteSpace($dateStr)) { return $null }
    try {
        return [DateTime]::ParseExact($dateStr, "dd/MM/yyyy HH:mm:ss", [System.Globalization.CultureInfo]::InvariantCulture)
    } catch {
        try {
            return [DateTime]::Parse($dateStr, [System.Globalization.CultureInfo]::InvariantCulture)
        } catch {
            return $null
        }
    }
}

# Main Request Loop
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $httpMethod = $request.HttpMethod
        $path = $request.Url.LocalPath

        # Handle CORS preflight
        if ($httpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, x-csrf-token")
            $response.OutputStream.Close()
            continue
        }

        # Read Request Body
        $requestBody = ""
        if ($request.HasEntityBody) {
            $encoding = if ($request.ContentEncoding) { $request.ContentEncoding } else { [System.Text.Encoding]::UTF8 }
            $reader = New-Object System.IO.StreamReader($request.InputStream, $encoding)
            $requestBody = $reader.ReadToEnd()
            $reader.Close()
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/auth/login
        # -----------------------------------------------------------------
        if ($path -eq "/api/auth/login" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $u = if ($req.username) { $req.username.Trim().ToLower() } else { "" }
            $p = if ($req.password) { $req.password.Trim() } else { "" }

            $foundUser = $null
            foreach ($usr in $db.users) {
                if ($usr.username.ToLower() -eq $u -and $usr.password -eq $p) {
                    $foundUser = $usr
                    break
                }
            }

            if ($foundUser) {
                $token = "cs_token_" + [System.Guid]::NewGuid().ToString()
                Send-JsonResponse $response 200 @{
                    success = $true
                    message = "Đăng nhập thành công"
                    token = $token
                    user = @{
                        username = $foundUser.username
                        role = $foundUser.role
                        balance = $foundUser.balance
                        phone = $foundUser.phone
                        email = $foundUser.email
                    }
                }
            } else {
                Send-JsonResponse $response 401 @{
                    success = $false
                    message = "Tên đăng nhập hoặc mật khẩu không chính xác!"
                }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/auth/register
        # -----------------------------------------------------------------
        if ($path -eq "/api/auth/register" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $u = if ($req.username) { $req.username.Trim() } else { "" }
            $p = if ($req.password) { $req.password.Trim() } else { "" }
            $phone = if ($req.phone) { $req.phone.Trim() } else { "" }
            $email = if ($req.email) { $req.email.Trim() } else { "" }

            if ([string]::IsNullOrWhiteSpace($u) -or [string]::IsNullOrWhiteSpace($p)) {
                Send-JsonResponse $response 400 @{ success = $false; message = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!" }
                continue
            }

            $exists = $false
            foreach ($usr in $db.users) {
                if ($usr.username.ToLower() -eq $u.ToLower()) {
                    $exists = $true
                    break
                }
            }

            if ($exists) {
                Send-JsonResponse $response 400 @{ success = $false; message = "Tên đăng nhập đã tồn tại trong hệ thống. Vui lòng chọn tên khác!" }
                continue
            }

            $newUser = [PSCustomObject]@{
                id = ($db.users.Count + 1)
                username = $u
                password = $p
                role = "ROLE_USER"
                balance = 50000 # Khuyến mãi tặng 50.000đ khi đăng ký mới
                phone = $phone
                email = $email
                createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
            }

            $userList = [System.Collections.ArrayList]@($db.users)
            $userList.Add($newUser) | Out-Null
            $db.users = $userList
            Save-Database $db

            Send-JsonResponse $response 200 @{
                success = $true
                message = "Đăng ký tài khoản thành công! Tặng ngay 50.000 đ vào tài khoản."
                username = $u
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/auth/me
        # -----------------------------------------------------------------
        if ($path -eq "/api/auth/me" -and $httpMethod -eq "GET") {
            $db = Get-Database
            $query = [System.Web.HttpUtility]::ParseQueryString($request.Url.Query)
            $targetU = $query["username"]
            if ([string]::IsNullOrWhiteSpace($targetU)) {
                Send-JsonResponse $response 401 @{ success = $false; message = "Chưa đăng nhập!" }
                continue
            }

            $targetUser = $null
            foreach ($usr in $db.users) {
                if ($usr.username.ToLower() -eq $targetU.ToLower()) {
                    $targetUser = $usr
                    break
                }
            }
            if (-not $targetUser) {
                Send-JsonResponse $response 404 @{ success = $false; message = "Không tìm thấy user!" }
                continue
            }

            Send-JsonResponse $response 200 @{
                success = $true
                user = @{
                    username = $targetUser.username
                    role = $targetUser.role
                    balance = $targetUser.balance
                    phone = $targetUser.phone
                    email = $targetUser.email
                }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/packages (Lấy danh sách gói sự kiện)
        # -----------------------------------------------------------------
        if ($path -eq "/api/packages" -and $httpMethod -eq "GET") {
            $db = Get-Database
            Send-JsonResponse $response 200 $db.packages
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/packages/create (Admin thêm gói sự kiện)
        # -----------------------------------------------------------------
        if ($path -eq "/api/packages/create" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $pkgId = "PKG_" + [System.Guid]::NewGuid().ToString().Substring(0, 8).ToUpper()
            
            $newPkg = [PSCustomObject]@{
                id = $pkgId
                title = if ($req.title) { $req.title.Trim() } else { "Gói Sự Kiện Mới" }
                ticketCount = if ($req.ticketCount) { [int]$req.ticketCount } else { 10 }
                price = if ($req.price) { [int]$req.price } else { 5000 }
                originalPrice = if ($req.originalPrice) { [int]$req.originalPrice } else { 6000 }
                badge = if ($req.badge) { $req.badge.Trim() } else { "HOT" }
                description = if ($req.description) { $req.description.Trim() } else { "" }
                imageUrl = if ($req.imageUrl) { $req.imageUrl } else { "uploads/logo.png" }
                isActive = $true
            }

            $pkgList = [System.Collections.ArrayList]@($db.packages)
            $pkgList.Add($newPkg) | Out-Null
            $db.packages = $pkgList
            Save-Database $db

            Send-JsonResponse $response 200 @{
                success = $true
                message = "Đã thêm gói sự kiện thành công!"
                package = $newPkg
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/packages/update (Admin sửa gói sự kiện)
        # -----------------------------------------------------------------
        if ($path -eq "/api/packages/update" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $targetId = $req.id

            $updated = $false
            foreach ($pkg in $db.packages) {
                if ($pkg.id -eq $targetId) {
                    if ($req.title) { $pkg.title = $req.title.Trim() }
                    if ($req.ticketCount) { $pkg.ticketCount = [int]$req.ticketCount }
                    if ($req.price) { $pkg.price = [int]$req.price }
                    if ($req.originalPrice) { $pkg.originalPrice = [int]$req.originalPrice }
                    if ($req.badge) { $pkg.badge = $req.badge.Trim() }
                    if ($req.description) { $pkg.description = $req.description.Trim() }
                    if ($req.imageUrl) { $pkg.imageUrl = $req.imageUrl }
                    if ($null -ne $req.isActive) { $pkg.isActive = [bool]$req.isActive }
                    $updated = $true
                    break
                }
            }

            if ($updated) {
                Save-Database $db
                Send-JsonResponse $response 200 @{ success = $true; message = "Cập nhật gói sự kiện thành công!" }
            } else {
                Send-JsonResponse $response 404 @{ success = $false; message = "Không tìm thấy gói sự kiện ID: $targetId" }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/packages/delete (Admin xóa gói sự kiện)
        # -----------------------------------------------------------------
        if ($path -eq "/api/packages/delete" -and ($httpMethod -eq "POST" -or $httpMethod -eq "DELETE")) {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $targetId = $req.id

            $pkgList = [System.Collections.ArrayList]@($db.packages)
            $foundIndex = -1
            for ($i = 0; $i -lt $pkgList.Count; $i++) {
                if ($pkgList[$i].id -eq $targetId) {
                    $foundIndex = $i
                    break
                }
            }

            if ($foundIndex -ge 0) {
                $pkgList.RemoveAt($foundIndex)
                $db.packages = $pkgList
                Save-Database $db
                Send-JsonResponse $response 200 @{ success = $true; message = "Đã xóa gói sự kiện thành công!" }
            } else {
                Send-JsonResponse $response 404 @{ success = $false; message = "Không tìm thấy gói cần xóa!" }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/packages/purchase (Chọn và mua gói sự kiện)
        # -----------------------------------------------------------------
        if ($path -eq "/api/packages/purchase" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $u = if ($req.username) { $req.username.Trim() } else { "" }
            $pkgId = if ($req.packageId) { $req.packageId.Trim() } else { "" }
            $customerName = if ($req.customerName) { $req.customerName.Trim() } else { "" }
            $code = if ($req.code) { $req.code.Trim() } else { "" }

            if ([string]::IsNullOrWhiteSpace($u)) {
                Send-JsonResponse $response 401 @{ success = $false; message = "Vui lòng đăng nhập trước khi mua gói sự kiện!" }
                continue
            }

            $foundPkg = $null
            foreach ($p in $db.packages) {
                if ($p.id -eq $pkgId) {
                    $foundPkg = $p
                    break
                }
            }
            if (-not $foundPkg) {
                Send-JsonResponse $response 404 @{ success = $false; message = "Không tìm thấy gói sự kiện!" }
                continue
            }

            $userFound = $null
            foreach ($usr in $db.users) {
                if ($usr.username.ToLower() -eq $u.ToLower()) {
                    $userFound = $usr
                    break
                }
            }
            if (-not $userFound) {
                Send-JsonResponse $response 404 @{ success = $false; message = "Tài khoản không tồn tại!" }
                continue
            }

            if ($userFound.balance -lt $foundPkg.price) {
                Send-JsonResponse $response 400 @{
                    success = $false
                    message = "Số dư không đủ để mua gói này (Cần $($foundPkg.price.ToString('N0')) đ, hiện có $($userFound.balance.ToString('N0')) đ). Vui lòng nạp thêm tiền!"
                }
                continue
            }

            # Trừ tiền tài khoản người dùng
            $userFound.balance -= $foundPkg.price

            # Tên khách hàng & mã sự kiện
            $cName = if (-not [string]::IsNullOrWhiteSpace($customerName)) { $customerName } else { $userFound.username }
            $eCode = if (-not [string]::IsNullOrWhiteSpace($code)) { $code } else { "AUTO-CS-" + (Get-Random -Minimum 10000 -Maximum 99999) }

            # Tạo đơn hàng
            $orderId = "CS" + (Get-Random -Minimum 10000 -Maximum 99999)
            $newOrder = [PSCustomObject]@{
                id = $orderId
                username = $u
                customerName = $cName
                code = $eCode
                packageTitle = $foundPkg.title
                eventType = "chungsuc"
                totalCount = $foundPkg.ticketCount
                completedCount = [int]($foundPkg.ticketCount * 0.75)
                unitPrice = 500
                price = $foundPkg.price
                speed = "VIP"
                status = "RUNNING"
                createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
            }

            $orderList = [System.Collections.ArrayList]@($db.orders)
            $orderList.Insert(0, $newOrder)
            $db.orders = $orderList

            # Ghi lịch sử giao dịch
            $txId = "GD" + (Get-Random -Minimum 1000 -Maximum 9999)
            $newTx = [PSCustomObject]@{
                id = $txId
                username = $u
                type = "order"
                amount = $foundPkg.price
                method = "Trừ số dư"
                description = "Mua gói: $($foundPkg.title) #$orderId - KH: $cName"
                status = "SUCCESS"
                createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
            }

            $txList = [System.Collections.ArrayList]@($db.transactions)
            $txList.Insert(0, $newTx)
            $db.transactions = $txList

            Save-Database $db

            Send-JsonResponse $response 200 @{
                success = $true
                message = "Đã chọn gói thành công! Đơn hàng #$orderId đã được tạo và tiền đã được trừ vào tài khoản."
                order = $newOrder
                newBalance = $userFound.balance
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/chungsuc/create (Tạo đơn chạy mã)
        # -----------------------------------------------------------------
        if ($path -eq "/api/chungsuc/create" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $u = if ($req.username) { $req.username.Trim() } else { "demo" }
            $customerName = if ($req.customerName) { $req.customerName.Trim() } else { "" }
            $code = if ($req.code) { $req.code.Trim() } else { "" }
            $eventType = if ($req.eventType) { $req.eventType } else { "chungsuc" }
            $count = if ($req.count) { [int]$req.count } else { 10 }
            $price = if ($req.price) { [int]$req.price } else { 5000 }
            $packageTitle = if ($req.packageTitle) { $req.packageTitle.Trim() } else { "Gói Tự Chọn ($count Vé)" }
            $speed = if ($req.speed) { $req.speed } else { "VIP" }

            # BẮT BUỘC TÊN KHÁCH HÀNG
            if ([string]::IsNullOrWhiteSpace($customerName)) {
                Send-JsonResponse $response 400 @{
                    success = $false
                    message = "Vui lòng nhập Tên khách hàng (Bắt buộc) để hệ thống nhận diện đơn!"
                }
                continue
            }

            if ([string]::IsNullOrWhiteSpace($code)) {
                Send-JsonResponse $response 400 @{
                    success = $false
                    message = "Vui lòng nhập Mã sự kiện hoặc dán link mời trong game!"
                }
                continue
            }

            $userFound = $null
            foreach ($usr in $db.users) {
                if ($usr.username.ToLower() -eq $u.ToLower()) {
                    $userFound = $usr
                    break
                }
            }

            if (-not $userFound) {
                Send-JsonResponse $response 404 @{ success = $false; message = "Người dùng không tồn tại!" }
                continue
            }

            if ($userFound.balance -lt $price) {
                Send-JsonResponse $response 400 @{
                    success = $false
                    message = "Số dư không đủ để thanh toán đơn hàng này (Cần $price đ, hiện có $($userFound.balance) đ). Vui lòng nạp thêm tiền!"
                }
                continue
            }

            # Trừ tiền tài khoản
            $userFound.balance -= $price

            # Tạo đơn hàng
            $orderId = "CS" + (Get-Random -Minimum 10000 -Maximum 99999)
            $newOrder = [PSCustomObject]@{
                id = $orderId
                username = $u
                customerName = $customerName
                code = $code
                packageTitle = $packageTitle
                eventType = $eventType
                totalCount = $count
                completedCount = [int]($count * 0.7) # Mô phỏng khởi chạy ngay 70%
                unitPrice = 500
                price = $price
                speed = $speed
                status = "RUNNING"
                createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
            }

            $orderList = [System.Collections.ArrayList]@($db.orders)
            $orderList.Insert(0, $newOrder)
            $db.orders = $orderList

            # Ghi nhận biến động số dư
            $txId = "GD" + (Get-Random -Minimum 1000 -Maximum 9999)
            $newTx = [PSCustomObject]@{
                id = $txId
                username = $u
                type = "order"
                amount = $price
                method = "Trừ số dư"
                description = "Chạy mã $eventType #$orderId - KH: $customerName ($count vé)"
                status = "SUCCESS"
                createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
            }

            $txList = [System.Collections.ArrayList]@($db.transactions)
            $txList.Insert(0, $newTx)
            $db.transactions = $txList

            Save-Database $db

            Send-JsonResponse $response 200 @{
                success = $true
                message = "Tạo đơn chạy mã thành công!"
                order = $newOrder
                newBalance = $userFound.balance
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/chungsuc/history (Lịch sử đơn của User)
        # -----------------------------------------------------------------
        if ($path -eq "/api/chungsuc/history" -and $httpMethod -eq "GET") {
            $db = Get-Database
            $query = [System.Web.HttpUtility]::ParseQueryString($request.Url.Query)
            $u = $query["username"]
            if ([string]::IsNullOrWhiteSpace($u)) {
                Send-JsonResponse $response 200 @()
                continue
            }

            $userOrders = [System.Collections.ArrayList]::new()
            foreach ($o in $db.orders) {
                if ($o.username.ToLower() -eq $u.ToLower() -or $u -eq "admin") {
                    # Tự động tăng tiến trình nếu đang chạy
                    if ($o.status -eq "RUNNING" -and $o.completedCount -lt $o.totalCount) {
                        $o.completedCount = [Math]::Min($o.totalCount, $o.completedCount + 2)
                        if ($o.completedCount -ge $o.totalCount) {
                            $o.status = "COMPLETED"
                        }
                    }
                    $userOrders.Add($o) | Out-Null
                }
            }
            Save-Database $db
            Send-JsonResponse $response 200 $userOrders
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/admin/orders (Admin theo dõi toàn bộ đơn hàng)
        # -----------------------------------------------------------------
        if ($path -eq "/api/admin/orders" -and $httpMethod -eq "GET") {
            $db = Get-Database
            $query = [System.Web.HttpUtility]::ParseQueryString($request.Url.Query)
            $statusFilter = $query["status"]

            $resultOrders = [System.Collections.ArrayList]::new()
            foreach ($o in $db.orders) {
                if ([string]::IsNullOrEmpty($statusFilter) -or $statusFilter -eq "ALL" -or $o.status -eq $statusFilter) {
                    $resultOrders.Add($o) | Out-Null
                }
            }
            Send-JsonResponse $response 200 $resultOrders
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/admin/orders/update-status (Admin cập nhật đơn)
        # -----------------------------------------------------------------
        if ($path -eq "/api/admin/orders/update-status" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $targetId = $req.id
            $newStatus = $req.status

            $foundOrder = $null
            foreach ($o in $db.orders) {
                if ($o.id -eq $targetId) {
                    $foundOrder = $o
                    break
                }
            }

            if ($foundOrder) {
                $foundOrder.status = $newStatus
                if ($newStatus -eq "COMPLETED") {
                    $foundOrder.completedCount = $foundOrder.totalCount
                }
                Save-Database $db
                Send-JsonResponse $response 200 @{ success = $true; message = "Đã cập nhật trạng thái đơn #$targetId thành $newStatus" }
            } else {
                Send-JsonResponse $response 404 @{ success = $false; message = "Không tìm thấy đơn hàng!" }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/admin/statistics (Thống kê doanh thu theo thời gian)
        # -----------------------------------------------------------------
        if ($path -eq "/api/admin/statistics" -and $httpMethod -eq "GET") {
            $db = Get-Database
            $query = [System.Web.HttpUtility]::ParseQueryString($request.Url.Query)
            $fromStr = $query["from"]
            $toStr = $query["to"]

            $filteredOrders = [System.Collections.ArrayList]::new()
            $filteredTxs = [System.Collections.ArrayList]::new()

            $fromDate = $null
            $toDate = $null
            if (-not [string]::IsNullOrEmpty($fromStr)) {
                [DateTime]::TryParse($fromStr, [ref]$fromDate) | Out-Null
            }
            if (-not [string]::IsNullOrEmpty($toStr)) {
                [DateTime]::TryParse($toStr, [ref]$toDate) | Out-Null
                if ($toDate) { $toDate = $toDate.AddDays(1).AddTicks(-1) }
            }

            $totalIncome = 0
            $totalDeposit = 0
            $completedCount = 0
            $runningCount = 0
            $cancelledCount = 0

            # Filter orders
            foreach ($o in $db.orders) {
                $orderDate = Parse-DateSafe $o.createdAt
                
                $match = $true
                if ($fromDate -and $orderDate -and $orderDate -lt $fromDate) { $match = $false }
                if ($toDate -and $orderDate -and $orderDate -gt $toDate) { $match = $false }

                if ($match) {
                    $filteredOrders.Add($o) | Out-Null
                    $totalIncome += [int]$o.price
                    if ($o.status -eq "COMPLETED") { $completedCount++ }
                    elseif ($o.status -eq "RUNNING") { $runningCount++ }
                    elseif ($o.status -eq "CANCELLED") { $cancelledCount++ }
                }
            }

            # Filter transactions
            foreach ($tx in $db.transactions) {
                $txDate = Parse-DateSafe $tx.createdAt

                $match = $true
                if ($fromDate -and $txDate -and $txDate -lt $fromDate) { $match = $false }
                if ($toDate -and $txDate -and $txDate -gt $toDate) { $match = $false }

                if ($match) {
                    $filteredTxs.Add($tx) | Out-Null
                    if ($tx.type -eq "deposit" -and $tx.status -eq "SUCCESS") {
                        $totalDeposit += [int]$tx.amount
                    }
                }
            }

            Send-JsonResponse $response 200 @{
                success = $true
                stats = @{
                    totalIncome = $totalIncome
                    totalDeposit = $totalDeposit
                    totalOrders = $filteredOrders.Count
                    completedOrders = $completedCount
                    runningOrders = $runningCount
                    cancelledOrders = $cancelledCount
                    totalUsers = $db.users.Count
                }
                orders = $filteredOrders
                transactions = $filteredTxs
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/deposit/confirm (VietQR confirmation & system notification)
        # -----------------------------------------------------------------
        if ($path -eq "/api/deposit/confirm" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $u = if ($req.username) { $req.username.Trim() } else { "" }
            $amt = if ($req.amount) { [int]$req.amount } else { 20000 }
            $hasBill = if ($req.hasBill) { [bool]$req.hasBill } else { $false }
            $pkgName = if ($req.packageName) { $req.packageName.Trim() } else { "Nạp tiền VietQR tự động" }
            $pkgId = if ($req.packageId) { $req.packageId.Trim() } else { "" }
            $customerName = if ($req.customerName) { $req.customerName.Trim() } else { $u }
            $eventCode = if ($req.code) { $req.code.Trim() } else { "" }

            if ([string]::IsNullOrWhiteSpace($u)) {
                Send-JsonResponse $response 401 @{ success = $false; message = "Vui lòng đăng nhập trước khi nạp tiền!" }
                continue
            }

            if ($amt -lt 5000) {
                Send-JsonResponse $response 400 @{ success = $false; message = "Số tiền thanh toán tối thiểu là 5.000 đ!" }
                continue
            }

            $userFound = $null
            foreach ($usr in $db.users) {
                if ($usr.username.ToLower() -eq $u.ToLower()) {
                    $userFound = $usr
                    break
                }
            }

            if ($userFound) {
                $txId = "GD" + (Get-Random -Minimum 1000 -Maximum 9999)
                $orderId = ""

                # Nếu là mua trực tiếp gói bằng VietQR kèm mã sự kiện
                if (-not [string]::IsNullOrWhiteSpace($pkgId) -or (-not [string]::IsNullOrWhiteSpace($eventCode) -and $pkgName -ne "Nạp tiền VietQR tự động")) {
                    $orderId = "CS" + (Get-Random -Minimum 10000 -Maximum 99999)
                    $tCount = 20
                    foreach ($p in $db.packages) {
                        if ($p.id -eq $pkgId -or $p.title -eq $pkgName) {
                            $tCount = $p.ticketCount
                            break
                        }
                    }

                    $newOrder = [PSCustomObject]@{
                        id = $orderId
                        username = $u
                        customerName = $customerName
                        code = if ($eventCode) { $eventCode } else { "AUTO-CS-" + (Get-Random -Minimum 10000 -Maximum 99999) }
                        packageTitle = $pkgName
                        eventType = "chungsuc"
                        totalCount = $tCount
                        completedCount = [int]($tCount * 0.75)
                        unitPrice = 500
                        price = $amt
                        speed = "VIP"
                        status = "RUNNING"
                        createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
                    }

                    $orderList = [System.Collections.ArrayList]@($db.orders)
                    $orderList.Insert(0, $newOrder)
                    $db.orders = $orderList

                    # Ghi lịch sử giao dịch thanh toán gói qua VietQR
                    $currStk = if ($db.settings -and $db.settings.bankAccount) { $db.settings.bankAccount } else { "01111111111100" }
                    $desc = "Thanh toán gói [$pkgName] qua VietQR NGUYEN TRI DUC ($currStk)"
                    $newTx = [PSCustomObject]@{
                        id = $txId
                        username = $u
                        type = "order"
                        amount = $amt
                        method = "VietQR ($currStk)"
                        description = $desc
                        status = "SUCCESS"
                        createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
                    }
                    $txList = [System.Collections.ArrayList]@($db.transactions)
                    $txList.Insert(0, $newTx)
                    $db.transactions = $txList
                } else {
                    # Nạp tiền vào tài khoản
                    $userFound.balance += $amt
                    $currStk = if ($db.settings -and $db.settings.bankAccount) { $db.settings.bankAccount } else { "01111111111100" }
                    $desc = if ($hasBill) { "Nạp tiền tự động qua QR NGUYEN TRI DUC (Đã nhận & xác minh Bill)" } else { "Nạp tiền tự động qua QR NGUYEN TRI DUC ($currStk)" }
                    if ($pkgName -and $pkgName -ne "Nạp tiền VietQR tự động") {
                        $desc = "Nạp tiền qua VietQR theo gói [$pkgName] ($currStk - NGUYEN TRI DUC)"
                    }
                    $newTx = [PSCustomObject]@{
                        id = $txId
                        username = $u
                        type = "deposit"
                        amount = $amt
                        method = "VietQR (NGUYEN TRI DUC)"
                        description = $desc
                        status = "SUCCESS"
                        createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
                    }
                    $txList = [System.Collections.ArrayList]@($db.transactions)
                    $txList.Insert(0, $newTx)
                    $db.transactions = $txList
                }

                Save-Database $db

                Send-JsonResponse $response 200 @{
                    success = $true
                    message = "Thanh toán thành công! Đã gửi thông báo về hệ thống và cập nhật số dư cho $u."
                    txId = $txId
                    orderId = $orderId
                    packageName = $pkgName
                    amount = $amt
                    newBalance = $userFound.balance
                }

                # Đồng bộ trạng thái phiên VietQR nếu có
                if ($global:VietQrSessions) {
                    try {
                        if ($req.txId -and $global:VietQrSessions.ContainsKey($req.txId)) {
                            $target = $global:VietQrSessions[$req.txId]
                            $target.status = "PAID"
                            if ($target.PSObject.Properties['newBalance']) { $target.newBalance = $userFound.balance } else { $target | Add-Member -NotePropertyName newBalance -NotePropertyValue $userFound.balance -Force }
                            if ($target.PSObject.Properties['orderId']) { $target.orderId = $orderId } else { $target | Add-Member -NotePropertyName orderId -NotePropertyValue $orderId -Force }
                        }
                        foreach ($k in $global:VietQrSessions.Keys) {
                            $s = $global:VietQrSessions[$k]
                            if ($s.username.ToLower() -eq $u.ToLower() -and $s.amount -eq $amt -and $s.status -eq "PENDING") {
                                $s.status = "PAID"
                                if ($s.PSObject.Properties['newBalance']) { $s.newBalance = $userFound.balance } else { $s | Add-Member -NotePropertyName newBalance -NotePropertyValue $userFound.balance -Force }
                                if ($s.PSObject.Properties['orderId']) { $s.orderId = $orderId } else { $s | Add-Member -NotePropertyName orderId -NotePropertyValue $orderId -Force }
                                break
                            }
                        }
                    } catch {}
                }
            } else {
                Send-JsonResponse $response 404 @{ success = $false; message = "Không tìm thấy user: $u!" }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/vietqr/create-payment (Tạo phiên thanh toán VietQR chuẩn NAPAS 247)
        # -----------------------------------------------------------------
        if ($path -eq "/api/vietqr/create-payment" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $u = if ($req.username) { $req.username.Trim() } else { "" }
            $amt = if ($req.amount) { [int]$req.amount } else { 20000 }
            $pkgName = if ($req.packageName) { $req.packageName.Trim() } else { "Nạp tiền VietQR tự động" }
            $pkgId = if ($req.packageId) { $req.packageId.Trim() } else { "" }
            $customerName = if ($req.customerName) { $req.customerName.Trim() } else { $u }
            $code = if ($req.code) { $req.code.Trim() } else { "" }

            if ([string]::IsNullOrWhiteSpace($u)) {
                Send-JsonResponse $response 401 @{ success = $false; message = "Vui lòng đăng nhập trước khi tạo thanh toán!" }
                continue
            }

            $txId = "VQR" + (Get-Random -Minimum 100000 -Maximum 999999)
            $safePkg = [System.Text.RegularExpressions.Regex]::Replace($pkgName, "[^a-zA-Z0-9]", " ").Trim()
            if ($safePkg.Length -gt 15) { $safePkg = $safePkg.Substring(0, 15).Trim() }
            $transferContent = "NAP " + $safePkg + " " + $u

            $st = $db.settings
            $stk = if ($st -and $st.bankAccount) { $st.bankAccount } else { "01111111111100" }
            $bOwner = if ($st -and $st.bankOwner) { $st.bankOwner } else { "NGUYEN TRI DUC" }
            $bName = if ($st -and $st.bankName) { $st.bankName } else { "MB Bank (Ngân hàng Quân đội)" }
            $encodedOwner = [System.Uri]::EscapeDataString($bOwner)

            $encodedContent = [System.Uri]::EscapeDataString($transferContent)
            $qrUrl = "https://img.vietqr.io/image/970422-$stk-compact2.png?amount=$amt&addInfo=$encodedContent&accountName=$encodedOwner"

            $session = [PSCustomObject]@{
                txId = $txId
                username = $u
                amount = $amt
                packageName = $pkgName
                packageId = $pkgId
                customerName = $customerName
                code = $code
                transferContent = $transferContent
                qrUrl = $qrUrl
                bankName = $bName
                bankBin = "970422"
                bankAccount = $stk
                bankOwner = $bOwner
                status = "PENDING"
                newBalance = 0
                orderId = ""
                createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
            }

            if (-not $global:VietQrSessions) {
                $global:VietQrSessions = [System.Collections.Hashtable]::Synchronized(@{})
            }
            $global:VietQrSessions[$txId] = $session

            Send-JsonResponse $response 200 @{
                success = $true
                session = $session
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/vietqr/check-status (Kiểm tra trạng thái thanh toán VietQR)
        # -----------------------------------------------------------------
        if ($path -eq "/api/vietqr/check-status" -and $httpMethod -eq "GET") {
            $query = [System.Web.HttpUtility]::ParseQueryString($request.Url.Query)
            $txId = $query["txId"]

            if (-not $global:VietQrSessions) {
                $global:VietQrSessions = [System.Collections.Hashtable]::Synchronized(@{})
            }

            $targetSession = $null
            if (-not [string]::IsNullOrWhiteSpace($txId) -and $global:VietQrSessions.ContainsKey($txId)) {
                $targetSession = $global:VietQrSessions[$txId]
            }

            if ($targetSession) {
                Send-JsonResponse $response 200 @{
                    success = $true
                    txId = $targetSession.txId
                    status = $targetSession.status
                    paid = ($targetSession.status -eq "PAID")
                    amount = $targetSession.amount
                    packageName = $targetSession.packageName
                    newBalance = $targetSession.newBalance
                    orderId = $targetSession.orderId
                }
            } else {
                Send-JsonResponse $response 200 @{
                    success = $true
                    paid = $false
                    status = "PENDING"
                }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/settings (Cấu hình hệ thống & thông tin ngân hàng)
        # -----------------------------------------------------------------
        if ($path -eq "/api/settings" -and $httpMethod -eq "GET") {
            $db = Get-Database
            Send-JsonResponse $response 200 $db.settings
            continue
        }

        if (($path -eq "/api/settings" -or $path -eq "/api/admin/settings") -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            if ($null -ne $req.ticketPrice) { $db.settings.ticketPrice = [int]$req.ticketPrice }
            if ($req.siteName) { $db.settings.siteName = $req.siteName.Trim() }
            if ($req.adminPhone) { $db.settings.adminPhone = $req.adminPhone.Trim() }
            if ($req.adminZalo) { $db.settings.adminZalo = $req.adminZalo.Trim() }
            if ($req.bankName) { $db.settings.bankName = $req.bankName.Trim() }
            if ($req.bankAccount) { $db.settings.bankAccount = $req.bankAccount.Trim() }
            if ($req.bankOwner) { $db.settings.bankOwner = $req.bankOwner.Trim() }
            Save-Database $db
            Send-JsonResponse $response 200 @{ success = $true; message = "Cập nhật cấu hình đơn giá thành công!"; settings = $db.settings }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/deposit/card (Scratch card deposit)
        # -----------------------------------------------------------------
        if ($path -eq "/api/deposit/card" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $u = if ($req.username) { $req.username.Trim() } else { "demo" }
            $amt = if ($req.amount) { [int]$req.amount } else { 50000 }
            $type = if ($req.type) { $req.type } else { "VIETTEL" }
            $pin = if ($req.pin) { $req.pin.Trim() } else { "" }
            $seri = if ($req.seri) { $req.seri.Trim() } else { "" }

            if ($pin.Length -lt 8 -or $seri.Length -lt 8) {
                Send-JsonResponse $response 400 @{ success = $false; message = "Mã thẻ hoặc số Seri không hợp lệ!" }
                continue
            }

            $userFound = $null
            foreach ($usr in $db.users) {
                if ($usr.username.ToLower() -eq $u.ToLower()) {
                    $userFound = $usr
                    break
                }
            }

            if ($userFound) {
                $userFound.balance += $amt
                $txId = "THE" + (Get-Random -Minimum 1000 -Maximum 9999)
                $newTx = [PSCustomObject]@{
                    id = $txId
                    username = $u
                    type = "deposit"
                    amount = $amt
                    method = "Thẻ Cào $type"
                    description = "Nạp thẻ cào $type mệnh giá $($amt.ToString('N0')) đ"
                    status = "SUCCESS"
                    createdAt = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
                }
                $txList = [System.Collections.ArrayList]@($db.transactions)
                $txList.Insert(0, $newTx)
                $db.transactions = $txList
                Save-Database $db

                Send-JsonResponse $response 200 @{
                    success = $true
                    message = "Thẻ cào $type chính xác! Đã cộng $($amt.ToString('N0')) đ vào số dư của bạn."
                    newBalance = $userFound.balance
                }
            } else {
                Send-JsonResponse $response 404 @{ success = $false; message = "Không tìm thấy user!" }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/deposit/history
        # -----------------------------------------------------------------
        if ($path -eq "/api/deposit/history" -and $httpMethod -eq "GET") {
            $db = Get-Database
            $query = [System.Web.HttpUtility]::ParseQueryString($request.Url.Query)
            $u = $query["username"]
            if ([string]::IsNullOrWhiteSpace($u)) {
                Send-JsonResponse $response 200 @()
                continue
            }

            $userTxs = [System.Collections.ArrayList]::new()
            foreach ($t in $db.transactions) {
                if ($t.username.ToLower() -eq $u.ToLower() -or $u -eq "admin") {
                    $userTxs.Add($t) | Out-Null
                }
            }
            Send-JsonResponse $response 200 $userTxs
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/admin/users
        # -----------------------------------------------------------------
        if ($path -eq "/api/admin/users" -and $httpMethod -eq "GET") {
            $db = Get-Database
            Send-JsonResponse $response 200 $db.users
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/admin/adjust-balance
        # -----------------------------------------------------------------
        if ($path -eq "/api/admin/adjust-balance" -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            $u = if ($req.username) { $req.username.Trim() } else { "" }
            $amt = if ($req.amount) { [int]$req.amount } else { 0 }

            $foundUser = $null
            foreach ($usr in $db.users) {
                if ($usr.username.ToLower() -eq $u.ToLower()) {
                    $foundUser = $usr
                    break
                }
            }

            if ($foundUser) {
                $foundUser.balance += $amt
                Save-Database $db
                Send-JsonResponse $response 200 @{
                    success = $true
                    message = "Đã cập nhật số dư cho $($u): $($foundUser.balance) đ"
                    newBalance = $foundUser.balance
                }
            } else {
                Send-JsonResponse $response 404 @{ success = $false; message = "Không tìm thấy user: $($u)" }
            }
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/settings (GET)
        # -----------------------------------------------------------------
        if ($path -eq "/api/settings" -and $httpMethod -eq "GET") {
            $db = Get-Database
            $currentSettings = $db.settings
            if ($null -eq $currentSettings) {
                $currentSettings = [PSCustomObject]@{
                    siteName = "Chung sức Trí Đức"
                    adminPhone = "0372.852.287"
                    adminZalo = "https://zalo.me/triduc1903"
                    ticketPrice = 500
                    bankName = "MB Bank"
                    bankAccount = "01111111111100"
                    bankOwner = "NGUYEN TRI DUC"
                }
            }
            Send-JsonResponse $response 200 $currentSettings
            continue
        }

        # -----------------------------------------------------------------
        # API ROUTE: /api/settings or /api/admin/settings (POST - Update Ticket Price & Settings)
        # -----------------------------------------------------------------
        if (($path -eq "/api/settings" -or $path -eq "/api/admin/settings") -and $httpMethod -eq "POST") {
            $db = Get-Database
            $req = ConvertFrom-Json $requestBody
            if ($null -eq $db.settings) {
                $db | Add-Member -NotePropertyName settings -NotePropertyValue ([PSCustomObject]@{}) -Force
            }
            if ($null -ne $req.ticketPrice) { $db.settings.ticketPrice = [int]$req.ticketPrice }
            if ($req.siteName) { $db.settings.siteName = $req.siteName.Trim() }
            if ($req.adminPhone) { $db.settings.adminPhone = $req.adminPhone.Trim() }
            if ($req.adminZalo) { $db.settings.adminZalo = $req.adminZalo.Trim() }
            if ($req.bankName) { $db.settings.bankName = $req.bankName.Trim() }
            if ($req.bankAccount) { $db.settings.bankAccount = $req.bankAccount.Trim() }
            if ($req.bankOwner) { $db.settings.bankOwner = $req.bankOwner.Trim() }

            Save-Database $db
            Send-JsonResponse $response 200 @{
                success = $true
                message = "Đã lưu cài đặt đơn giá ($($db.settings.ticketPrice) đ/vé) và cấu hình thành công!"
                settings = $db.settings
            }
            continue
        }

        # -----------------------------------------------------------------
        # STATIC FILE SERVING WITH FRIENDLY ROUTING
        # -----------------------------------------------------------------
        $cleanPath = $path.TrimStart('/')
        if ([string]::IsNullOrEmpty($cleanPath) -or $cleanPath -eq "home") {
            $cleanPath = "index.html"
        } elseif ($cleanPath -eq "login") {
            $cleanPath = "login.html"
        } elseif ($cleanPath -eq "register") {
            $cleanPath = "register.html"
        } elseif ($cleanPath -eq "admin") {
            $cleanPath = "admin.html"
        } elseif ($cleanPath -eq "terms") {
            $cleanPath = "terms.html"
        } elseif ($cleanPath -eq "privacy") {
            $cleanPath = "privacy.html"
        } elseif ($cleanPath -eq "payment-success" -or $cleanPath -eq "success") {
            $cleanPath = "payment-success.html"
        }

        $localFilePath = Join-Path $webRoot $cleanPath

        if (Test-Path $localFilePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $response.StatusCode = 200
            $response.ContentType = $mime
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.ContentLength64 = $bytes.Length
            if ($httpMethod -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.OutputStream.Close()
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $response.ContentLength64 = $errBytes.Length
            if ($httpMethod -ne "HEAD") {
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.OutputStream.Close()
        }
    } catch {
        Write-Host "[ERR] Lỗi xử lý request: $_" -ForegroundColor Red
        try {
            $response.StatusCode = 500
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("500 Internal Server Error: $_")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            $response.OutputStream.Close()
        } catch {}
    }
}

$listener.Close()
