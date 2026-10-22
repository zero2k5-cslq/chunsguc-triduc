/**
 * Vua Dịch Vụ LQ Admin Dashboard - JavaScript Logic
 * Quản lý Sản Phẩm Acc Game: Thêm, Sửa, Xóa và Tải ảnh từ thiết bị
 */

// Initial Seed Data for Fallback (Acc Lien Quan Mobile VIP)
const DEFAULT_GAME_ACCOUNTS = [
    {
        id: 1,
        accCode: "LQ-001",
        name: "Acc Liên Quân Rank Thách Đấu - Full 116 Tướng, 420 Skin VIP (Thứ Nguyên Vệ Thần)",
        category: "Cao Thủ - Thách Đấu",
        price: 1250000,
        originalPrice: 1650000,
        shortDescription: "Full tướng, 420 skin gồm Tel'Annas & Nakroth Thứ Nguyên Vệ Thần, Raz Muay Thái. Đăng ký trắng thông tin 100%.",
        fullDescription: "Tài khoản Liên Quân Mobile chính chủ cực phẩm: Rank Thách Đấu 52 Sao, 116/116 tướng full, sở hữu 420 trang phục cao cấp bao gồm: Tel'Annas Thứ Nguyên Vệ Thần, Nakroth Thứ Nguyên Vệ Thần, Nakroth Siêu Việt bậc 5, Raz Muay Thái, Lauriel Tinh Vân Sứ, Murad Chí Tôn Kiếm Tiên. Bảng ngọc chuẩn 30 bảng full cấp 3. Tài khoản trắng thông tin, đổi số điện thoại và email chính chủ an toàn tuyệt đối.",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
        rating: 5.0,
        reviewCount: 86,
        inStock: true,
        specs: {
            "Bậc Rank": "Thách Đấu 52 Sao (Top Server)",
            "Số Tướng": "116 / 116 Tướng (Full)",
            "Trang phục": "420 Skin (Đủ Thứ Nguyên, SS Tuyệt Sắc)",
            "Bảng Ngọc": "30 Bảng Ngọc Cấp 3 Full",
            "Tình trạng": "Trắng thông tin, đổi SĐT & Email ngay",
            "Máy chủ": "Mặt Trời (Việt Nam)"
        },
        features: [
            "Sở hữu nhiều trang phục giới hạn sự kiện không thể mua lại",
            "Trắng thông tin hoàn toàn, hỗ trợ đổi liên kết ngay lập tức",
            "Bảo hành trọn đời, chống hồi phục tài khoản 100%",
            "Tỷ lệ thắng cao 65.5% với hơn 4500 trận thi đấu"
        ]
    },
    {
        id: 2,
        accCode: "LQ-002",
        name: "Acc Liên Quân Rank Cao Thủ 35* - Raz Muay Thái + Nakroth Siêu Việt Bậc 5",
        category: "Skin SS - Thứ Nguyên",
        price: 790000,
        originalPrice: 1150000,
        shortDescription: "Raz Muay Thái full hiệu ứng, Nakroth Siêu Việt Bậc 5, Ngộ Không Nhóc Tì Bá Đạo. Rank Cao Thủ 35 sao.",
        fullDescription: "Tài khoản Liên Quân chuyên gánh team: Sở hữu trọn bộ sát thủ đình đám: Raz Muay Thái, Nakroth Siêu Việt Bậc 5, Ngộ Không Nhóc Tì Bá Đạo, Florentino Tinh Hệ. Rank Cao Thủ 35 Sao mùa hiện tại, 105 tướng, 260 trang phục. Bảng ngọc công vật lý và phép chuẩn 100%.",
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 54,
        inStock: true,
        specs: {
            "Bậc Rank": "Cao Thủ 35 Sao",
            "Số Tướng": "105 / 116 Tướng",
            "Trang phục": "260 Skin (Raz Muay Thái, Nak Siêu Việt)",
            "Bảng Ngọc": "25 Bảng Ngọc Chuẩn Meta",
            "Tình trạng": "Trắng thông tin 100%",
            "Máy chủ": "Mặt Trời (Việt Nam)"
        },
        features: [
            "Raz Muay Thái múa cực mượt hiệu ứng quyền thái rực lửa",
            "Đổi mật khẩu và số điện thoại bảo mật ngay trong 3 phút",
            "Bảo hành vĩnh viễn không back acc",
            "Tặng kèm 40.000 Vàng trong tài khoản"
        ]
    },
    {
        id: 3,
        accCode: "LQ-003",
        name: "Acc Cho Thuê: Liên Quân Full Tướng, 300 Skin VIP - Thuê Trải Nghiệm Giá Rẻ",
        category: "Cho thuê acc",
        price: 30000,
        originalPrice: 50000,
        shortDescription: "Cho thuê theo ca / theo ngày. Acc Full 116 tướng, 300 skin, rank Cao Thủ múa Florentino, Nakroth, Raz tẹt ga.",
        fullDescription: "Dịch vụ cho thuê acc Liên Quân Mobile uy tín của Ri-Duc Liên Quân: Nhận mật khẩu tự động đăng nhập chơi ngay. Acc Full tướng, hơn 300 trang phục hot: Raz Muay Thái, Tulen Chí Tôn Kiếm Tiên, Lauriel Tinh Vân Sứ, Nakroth BBoy Công Nghệ. Hỗ trợ leo rank, quay clip TikTok, trải nghiệm skin đắt tiền không cần bỏ tiền triệu mua nick.",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
        rating: 5.0,
        reviewCount: 142,
        inStock: true,
        specs: {
            "Hình thức": "Cho thuê theo giờ / theo ngày",
            "Số Tướng": "116 Tướng (Đủ mọi tướng)",
            "Trang phục": "300 Skin xịn (Raz Muay Thái, Nakroth)",
            "Bậc Rank": "Cao Thủ 20 Sao",
            "Cam kết": "Nick sạch không tool hack, chơi mượt mà",
            "Hỗ trợ": "Nhận mã đăng nhập nhanh qua Zalo"
        },
        features: [
            "Chi phí siêu rẻ chỉ từ vài chục nghìn đồng để trải nghiệm nick VIP",
            "Đầy đủ ngọc chuẩn cấp 3 cho tất cả các vị trí đi rừng, mid, ad, sp, top",
            "Hệ thống cấp tài khoản tự động hoặc hỗ trợ qua Zalo 24/7",
            "Bảo đảm trải nghiệm mượt mà không bị tranh chấp lượt chơi"
        ]
    },
    {
        id: 4,
        accCode: "LQ-004",
        name: "Acc Liên Quân Giá Rẻ Học Sinh - Rank Tinh Anh, 98 Tướng, 160 Trang Phục",
        category: "Acc Giá Rẻ Học Sinh",
        price: 150000,
        originalPrice: 250000,
        shortDescription: "Giá học sinh sinh viên siêu mềm! 98 tướng, 160 skin, rank Tinh Anh 1 chuẩn bị lên Cao Thủ, trắng thông tin.",
        fullDescription: "Tài khoản Liên Quân giá học sinh sinh viên cực mềm: 98 tướng, 160 trang phục, rank Tinh Anh 1 cận kề Cao Thủ. Đầy đủ các tướng hot: Florentino, Valhein, Yorn, Zuka, Krixi, Hayate. Bảng ngọc cấp 3 cơ bản hoàn chỉnh. Trắng thông tin, đổi mật khẩu Garena ngay lập tức.",
        imageUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviewCount: 68,
        inStock: true,
        specs: {
            "Bậc Rank": "Tinh Anh 1 (4 Sao)",
            "Số Tướng": "98 Tướng",
            "Trang phục": "160 Skin",
            "Bảng Ngọc": "15 Bảng Ngọc Cấp 3",
            "Tình trạng": "Trắng thông tin Garena",
            "Máy chủ": "Mặt Trời (Việt Nam)"
        },
        features: [
            "Mức giá siêu tiết kiệm chỉ bằng vài ly trà sữa",
            "Acc cày chay sạch sẽ, không nạp bẩn",
            "Bảo hành trọn đời từ Ri-Duc Liên Quân",
            "Bàn giao tài khoản trong 1 phút"
        ]
    },
    {
        id: 5,
        accCode: "LQ-005",
        name: "Acc Liên Quân Florentino Ultramax - Tulen Chí Tôn Kiếm Tiên + Lauriel Tinh Vân Sứ",
        category: "Cao Thủ - Thách Đấu",
        price: 650000,
        originalPrice: 900000,
        shortDescription: "Acc chuyên Florentino & Tulen: Flo Tinh Hệ + Thần Thoại Hy Lạp, Tulen Chí Tôn Kiếm Tiên, Lauriel Tinh Vân Sứ.",
        fullDescription: "Tài khoản Liên Quân dành riêng cho các game thủ kỹ năng cao: Florentino gần 2.000 trận tỉ lệ thắng 70% có Flo Thần Thoại Hy Lạp và Flo Bá Tước. Kèm theo Tulen Chí Tôn Kiếm Tiên, Lauriel Tinh Vân Sứ, Liliana Tân Nguyệt Mị Ly. Rank Cao Thủ 28 Sao, 112 tướng, 240 trang phục.",
        imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 42,
        inStock: true,
        specs: {
            "Bậc Rank": "Cao Thủ 28 Sao",
            "Số Tướng": "112 / 116 Tướng",
            "Trang phục": "240 Trang Phục",
            "Tướng Tủ": "Florentino 2000 trận, Tulen, Lauriel",
            "Tình trạng": "Trắng thông tin 100%",
            "Máy chủ": "Mặt Trời (Việt Nam)"
        },
        features: [
            "Bộ sưu tập skin tướng kỹ năng đỉnh cao",
            "Bảng ngọc tốc đánh - hút máu - xuyên giáp chuẩn Florentino",
            "Giao dịch an toàn, hướng dẫn đổi bảo mật chi tiết",
            "Bảo hành vĩnh viễn không lo mất nick"
        ]
    },
    {
        id: 6,
        accCode: "LQ-006",
        name: "Acc Liên Quân Trắng Thông Tin 100% - Đổi SĐT & Email Gốc Ngay, 310 Skin",
        category: "Acc Trắng Thông Tin",
        price: 890000,
        originalPrice: 1200000,
        shortDescription: "Trắng thông tin tuyệt đối, chưa từng liên kết SĐT/CMND. Full 116 tướng, 310 skin, rank Cao Thủ 15 sao.",
        fullDescription: "Tài khoản Liên Quân an toàn bậc nhất: Hoàn toàn chưa kích hoạt số điện thoại, chưa cài CMND, email chưa xác thực. Người mua đăng nhập vào tự tay thêm số điện thoại và email của mình trở thành chủ sở hữu đầu tiên 100%. Kho đồ 116/116 tướng, 310 trang phục đẹp mắt, Rank Cao Thủ 15 Sao.",
        imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80",
        rating: 5.0,
        reviewCount: 77,
        inStock: true,
        specs: {
            "Bậc Rank": "Cao Thủ 15 Sao",
            "Số Tướng": "116 Tướng (Full)",
            "Trang phục": "310 Trang Phục",
            "Bảo Mật": "Trắng thông tin 100% (Tự thêm SĐT)",
            "Bảng Ngọc": "Full 30 bảng cấp 3",
            "Máy chủ": "Mặt Trời (Việt Nam)"
        },
        features: [
            "Trắng thông tin tuyệt đối, an toàn số 1 thị trường",
            "Người mua là chủ duy nhất của nick",
            "Bảo hành hoàn tiền 100% nếu có bất kỳ lỗi nào",
            "Hỗ trợ nhiệt tình qua Zalo triduc1903"
        ]
    }
];

// Admin State
const adminState = {
    products: [],
    searchQuery: '',
    selectedCategory: 'Tất cả',
    sortBy: 'default',
    editingProductId: null,
    deletingProductId: null,
    currentImageDataUrl: '',
    isBackendOnline: true
};

// Format Currency VND
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info')}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// =========================================================================
// AUTHENTICATION GUARD
// =========================================================================
function checkAdminAuth() {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    if (!token) {
        // Redirect to store with login request
        window.location.href = 'index.html?login_required=true';
        return false;
    }
    const username = localStorage.getItem('admin_user') || 'zero2k5';
    const displayEl = document.getElementById('adminDisplayUsername');
    if (displayEl) displayEl.textContent = username;
    return true;
}

// Handle Logout
function setupLogout() {
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn đăng xuất quyền Admin không?')) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                sessionStorage.removeItem('admin_token');
                sessionStorage.removeItem('admin_user');
                window.location.href = 'index.html';
            }
        });
    }
}

// =========================================================================
// DATA FETCHING & SYNCHRONIZATION
// =========================================================================
async function fetchProducts() {
    const tableBody = document.getElementById('adminTableBody');
    const emptyState = document.getElementById('adminEmptyTable');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="table-loading-row">
                    <div class="spinner"></div>
                    <p>Đang tải danh sách tài khoản game từ hệ thống Quarkus...</p>
                </td>
            </tr>
        `;
    }

    try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('API server không phản hồi');
        const data = await res.json();
        adminState.products = data;
        adminState.isBackendOnline = true;
        // Save local backup
        localStorage.setItem('tech_store_products', JSON.stringify(data));
        updateBackendStatus(true);
    } catch (err) {
        console.warn('Backend offline hoặc chạy static, dùng dữ liệu lưu trữ local:', err);
        adminState.isBackendOnline = false;
        updateBackendStatus(false);

        // Fallback to localStorage or default seed data
        const localData = localStorage.getItem('tech_store_products');
        if (localData) {
            try {
                adminState.products = JSON.parse(localData);
            } catch (e) {
                adminState.products = [...DEFAULT_GAME_ACCOUNTS];
                localStorage.setItem('tech_store_products', JSON.stringify(adminState.products));
            }
        } else {
            adminState.products = [...DEFAULT_GAME_ACCOUNTS];
            localStorage.setItem('tech_store_products', JSON.stringify(adminState.products));
        }
    }

    populateCategoryFilter();
    renderProductsTable();
    updateDashboardStats();
}

function updateBackendStatus(isOnline) {
    const statusEl = document.getElementById('adminBackendStatus');
    if (statusEl) {
        if (isOnline) {
            statusEl.textContent = 'Quarkus API Live';
            statusEl.parentElement.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            statusEl.parentElement.style.color = '#34d399';
        } else {
            statusEl.textContent = 'Lưu trữ Cục Bộ (Local Ready)';
            statusEl.parentElement.style.borderColor = 'rgba(245, 158, 11, 0.4)';
            statusEl.parentElement.style.color = '#fbbf24';
        }
    }
}

// Populate Category Filter dropdown
function populateCategoryFilter() {
    const select = document.getElementById('adminCategoryFilter');
    if (!select) return;

    const currentVal = select.value;
    const categories = new Set(['Tất cả']);
    adminState.products.forEach(p => {
        if (p.category) categories.add(p.category);
    });

    select.innerHTML = Array.from(categories).map(cat => `
        <option value="${cat}">${cat === 'Tất cả' ? 'Tất cả thể loại' : cat}</option>
    `).join('');

    if (categories.has(currentVal)) {
        select.value = currentVal;
    }
}

// =========================================================================
// TABLE RENDERING & FILTERING
// =========================================================================
function getGameBadgeClass(category) {
    if (!category) return 'game-badge-default';
    const cat = category.toLowerCase();
    if (cat.includes('liên quân')) return 'game-badge-lq';
    if (cat.includes('valorant')) return 'game-badge-valo';
    if (cat.includes('genshin')) return 'game-badge-genshin';
    if (cat.includes('liên minh') || cat.includes('lol')) return 'game-badge-lol';
    if (cat.includes('free fire')) return 'game-badge-ff';
    return 'game-badge-default';
}

function renderProductsTable() {
    const tableBody = document.getElementById('adminTableBody');
    const emptyState = document.getElementById('adminEmptyTable');
    const summaryEl = document.getElementById('adminTableSummary');
    if (!tableBody) return;

    // Filter & Sort
    let filtered = [...adminState.products];

    // Search query
    if (adminState.searchQuery) {
        const q = adminState.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => {
            const code = (p.accCode || ('LQ-' + String(p.id).padStart(3, '0'))).toLowerCase();
            return code.includes(q) ||
                p.name.toLowerCase().includes(q) ||
                String(p.id).includes(q) ||
                (p.category && p.category.toLowerCase().includes(q)) ||
                (p.shortDescription && p.shortDescription.toLowerCase().includes(q));
        });
    }

    // Category filter
    if (adminState.selectedCategory && adminState.selectedCategory !== 'Tất cả') {
        filtered = filtered.filter(p => p.category === adminState.selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
        if (adminState.sortBy === 'price-asc') return a.price - b.price;
        if (adminState.sortBy === 'price-desc') return b.price - a.price;
        if (adminState.sortBy === 'name') return a.name.localeCompare(b.name);
        return b.id - a.id; // default newest
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (summaryEl) summaryEl.textContent = 'Hiển thị 0 sản phẩm';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (summaryEl) summaryEl.textContent = `Hiển thị ${filtered.length} / ${adminState.products.length} sản phẩm acc game`;

    tableBody.innerHTML = filtered.map(p => {
        const badgeClass = getGameBadgeClass(p.category);
        const inStock = p.inStock !== false;

        // Extract some specs tags
        let specsHtml = '';
        if (p.specs) {
            specsHtml = Object.entries(p.specs).slice(0, 3).map(([k, v]) => `
                <span class="acc-spec-pill" title="${k}: ${v}"><strong>${k}:</strong> ${v}</span>
            `).join('');
        }

        const accCode = p.accCode || ('LQ-' + String(p.id).padStart(3, '0'));

        return `
            <tr data-id="${p.id}">
                <td>
                    <span class="acc-code-pill" title="Mã Acc Game: ${accCode}">
                        <i class="fa-solid fa-hashtag"></i> ${accCode}
                    </span>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 3px;">ID: #${p.id}</div>
                </td>
                <td>
                    <div class="table-img-wrap" data-img="${p.imageUrl}" data-name="${p.name}" title="Nhấn để phóng to ảnh acc">
                        <img src="${p.imageUrl}" alt="${p.name}" class="table-acc-img" onerror="this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'">
                        <div class="table-img-zoom-hint">
                            <i class="fa-solid fa-magnifying-glass-plus"></i>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="acc-cell-title">${p.name}</div>
                    <div class="acc-cell-desc">${p.shortDescription || 'Chưa có mô tả ngắn'}</div>
                    <div class="acc-spec-pills">${specsHtml}</div>
                </td>
                <td>
                    <span class="game-badge ${badgeClass}">
                        <i class="fa-solid fa-gamepad"></i> ${p.category || 'Game'}
                    </span>
                </td>
                <td>
                    <div class="price-cell-main">${formatCurrency(p.price)}</div>
                    ${p.originalPrice && p.originalPrice > p.price ? `
                        <div class="price-cell-orig">${formatCurrency(p.originalPrice)}</div>
                    ` : ''}
                </td>
                <td>
                    <span class="stock-pill ${inStock ? 'in-stock' : 'out-of-stock'}">
                        <i class="fa-solid ${inStock ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                        ${inStock ? 'Còn hàng' : 'Đã bán'}
                    </span>
                </td>
                <td>
                    <div class="table-actions-group">
                        <button class="btn-action-edit" data-action="edit" data-id="${p.id}" title="Chỉnh sửa thông tin acc này">
                            <i class="fa-solid fa-pen-to-square"></i> Sửa
                        </button>
                        <button class="btn-action-delete" data-action="delete" data-id="${p.id}" title="Xóa acc này">
                            <i class="fa-solid fa-trash-can"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Attach row events
    attachTableEvents();
}

function attachTableEvents() {
    // Zoom image
    document.querySelectorAll('.table-img-wrap').forEach(wrap => {
        wrap.addEventListener('click', () => {
            const imgUrl = wrap.getAttribute('data-img');
            const name = wrap.getAttribute('data-name');
            openLightbox(imgUrl, name);
        });
    });

    // Edit button
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-id'));
            openEditProductModal(id);
        });
    });

    // Delete button
    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-id'));
            openDeleteConfirmModal(id);
        });
    });
}

// Update Dashboard Statistics
function updateDashboardStats() {
    const totalEl = document.getElementById('statTotalProducts');
    const inStockEl = document.getElementById('statInStock');
    const totalValEl = document.getElementById('statTotalValue');
    const catEl = document.getElementById('statCategories');

    const total = adminState.products.length;
    const inStock = adminState.products.filter(p => p.inStock !== false).length;
    const totalValue = adminState.products.reduce((acc, p) => acc + (p.price || 0), 0);
    const uniqueCats = new Set(adminState.products.map(p => p.category).filter(Boolean)).size;

    if (totalEl) totalEl.textContent = total;
    if (inStockEl) inStockEl.textContent = inStock;
    if (totalValEl) totalValEl.textContent = formatCurrency(totalValue);
    if (catEl) catEl.textContent = uniqueCats;
}

// =========================================================================
// IMAGE UPLOAD FROM ADMIN DEVICE (FileReader & Optimizer)
// =========================================================================
function setupImageUploadHandlers() {
    const fileInput = document.getElementById('deviceFileInput');
    const dropzone = document.getElementById('fileDropzone');
    const dropzonePrompt = document.getElementById('dropzonePrompt');
    const dropzonePreview = document.getElementById('dropzonePreview');
    const previewImg = document.getElementById('previewImageElement');
    const previewFileName = document.getElementById('previewFileName');
    const finalImageUrlInput = document.getElementById('finalImageUrl');
    const changeImgBtn = document.getElementById('changeImageBtn');
    const removeImgBtn = document.getElementById('removeImageBtn');

    const tabDevice = document.getElementById('tabUploadDevice');
    const tabUrl = document.getElementById('tabUploadUrl');
    const panelDevice = document.getElementById('panelUploadDevice');
    const panelUrl = document.getElementById('panelUploadUrl');
    const imageUrlInput = document.getElementById('imageUrlInput');
    const previewUrlBtn = document.getElementById('previewUrlBtn');

    // Switch Tabs
    tabDevice.addEventListener('click', () => {
        tabDevice.classList.add('active');
        tabUrl.classList.remove('active');
        panelDevice.style.display = 'block';
        panelUrl.style.display = 'none';
    });

    tabUrl.addEventListener('click', () => {
        tabUrl.classList.add('active');
        tabDevice.classList.remove('active');
        panelDevice.style.display = 'none';
        panelUrl.style.display = 'block';
    });

    // Dropzone Click -> Trigger File Input
    dropzonePrompt.addEventListener('click', () => {
        fileInput.click();
    });

    changeImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    removeImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetImageUploadState();
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleSelectedFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleSelectedFile(e.target.files[0]);
        }
    });

    // Preview URL button
    previewUrlBtn.addEventListener('click', () => {
        const url = imageUrlInput.value.trim();
        if (!url) {
            showToast('Vui lòng nhập đường dẫn ảnh hợp lệ', 'error');
            return;
        }
        setImagePreview(url, 'Link ảnh online');
    });
}

// Process selected file from admin device
function handleSelectedFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chỉ chọn file ảnh (PNG, JPG, JPEG, WEBP, GIF)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const originalDataUrl = e.target.result;

        // Optimize image size via off-screen canvas (scale down if too large)
        optimizeImage(originalDataUrl, 1400, 0.88, (optimizedDataUrl) => {
            setImagePreview(optimizedDataUrl, file.name);
            showToast(`Đã tải ảnh "${file.name}" từ thiết bị thành công!`, 'success');
        });
    };
    reader.readAsDataURL(file);
}

// Client-side image optimizer to keep memory and transmission light
function optimizeImage(dataUrl, maxDimension, quality, callback) {
    const img = new Image();
    img.onload = function() {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
            if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
            } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
            }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL('image/jpeg', quality);
        callback(compressedUrl);
    };
    img.src = dataUrl;
}

// Set Image Preview on Dropzone
function setImagePreview(imageUrl, filename = 'Ảnh đã chọn') {
    const dropzonePrompt = document.getElementById('dropzonePrompt');
    const dropzonePreview = document.getElementById('dropzonePreview');
    const previewImg = document.getElementById('previewImageElement');
    const previewFileName = document.getElementById('previewFileName');
    const finalImageUrlInput = document.getElementById('finalImageUrl');
    const errorMsg = document.getElementById('imageValidationError');

    previewImg.src = imageUrl;
    previewFileName.textContent = filename;
    finalImageUrlInput.value = imageUrl;
    adminState.currentImageDataUrl = imageUrl;

    dropzonePrompt.style.display = 'none';
    dropzonePreview.style.display = 'flex';
    if (errorMsg) errorMsg.style.display = 'none';
}

// Reset Dropzone
function resetImageUploadState() {
    const dropzonePrompt = document.getElementById('dropzonePrompt');
    const dropzonePreview = document.getElementById('dropzonePreview');
    const previewImg = document.getElementById('previewImageElement');
    const finalImageUrlInput = document.getElementById('finalImageUrl');
    const fileInput = document.getElementById('deviceFileInput');
    const imageUrlInput = document.getElementById('imageUrlInput');

    previewImg.src = '';
    finalImageUrlInput.value = '';
    adminState.currentImageDataUrl = '';
    if (fileInput) fileInput.value = '';
    if (imageUrlInput) imageUrlInput.value = '';

    dropzonePrompt.style.display = 'block';
    dropzonePreview.style.display = 'none';
}

// =========================================================================
// PRODUCT CRUD (THÊM - SỬA - XÓA)
// =========================================================================

// Open Modal: Thêm Acc Game Mới
function openAddProductModal() {
    adminState.editingProductId = null;
    document.getElementById('editProductId').value = '';
    document.getElementById('formModalTitle').textContent = 'Thêm Acc Game Mới';
    document.getElementById('formModalSubtitle').textContent = 'Tải ảnh từ thiết bị của bạn lên, nhập thông tin và giá bán';
    document.getElementById('formModalIcon').innerHTML = '<i class="fa-solid fa-plus"></i>';

    // Reset fields
    document.getElementById('productForm').reset();
    resetImageUploadState();

    // Auto-generate next acc code
    const maxNum = (adminState.products || []).reduce((acc, p) => {
        const m = (p.accCode || '').match(/(\d+)/);
        const val = m ? parseInt(m[1], 10) : (p.id || 0);
        return Math.max(acc, val);
    }, 0);
    const nextAccCode = `LQ-${String(maxNum + 1).padStart(3, '0')}`;
    const codeInput = document.getElementById('productAccCodeInput');
    if (codeInput) codeInput.value = nextAccCode;

    document.getElementById('priceFormattedHelper').textContent = '0 đ';
    document.getElementById('origPriceFormattedHelper').textContent = 'Để trống nếu không giảm giá';
    document.getElementById('formGlobalError').style.display = 'none';
    document.getElementById('customCategoryField').style.display = 'none';

    document.getElementById('productFormModalBackdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open Modal: Sửa Acc Game
function openEditProductModal(productId) {
    const product = adminState.products.find(p => p.id === productId);
    if (!product) {
        showToast('Không tìm thấy thông tin sản phẩm!', 'error');
        return;
    }

    adminState.editingProductId = productId;
    document.getElementById('editProductId').value = productId;
    document.getElementById('formModalTitle').textContent = `Chỉnh Sửa Acc Game #${productId}`;
    document.getElementById('formModalSubtitle').textContent = 'Thay đổi ảnh tải lên từ thiết bị, cập nhật giá hoặc mô tả';
    document.getElementById('formModalIcon').innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    // Fill form inputs
    const codeInput = document.getElementById('productAccCodeInput');
    if (codeInput) {
        codeInput.value = product.accCode || ('LQ-' + String(product.id).padStart(3, '0'));
    }
    document.getElementById('productNameInput').value = product.name || '';
    
    // Category
    const catSelect = document.getElementById('productCategorySelect');
    const catOptions = Array.from(catSelect.options).map(o => o.value);
    if (catOptions.includes(product.category)) {
        catSelect.value = product.category;
        document.getElementById('customCategoryField').style.display = 'none';
    } else {
        catSelect.value = 'Khác';
        document.getElementById('customCategoryField').style.display = 'block';
        document.getElementById('customCategoryInput').value = product.category || '';
    }

    document.getElementById('productInStockSelect').value = product.inStock !== false ? 'true' : 'false';
    document.getElementById('productShortDescInput').value = product.shortDescription || '';
    document.getElementById('productFullDescInput').value = product.fullDescription || '';

    // Price
    document.getElementById('productPriceInput').value = product.price || '';
    document.getElementById('productOriginalPriceInput').value = product.originalPrice || '';
    document.getElementById('priceFormattedHelper').textContent = formatCurrency(product.price);
    document.getElementById('origPriceFormattedHelper').textContent = product.originalPrice ? formatCurrency(product.originalPrice) : 'Để trống nếu không giảm giá';

    // Specs
    const specs = product.specs || {};
    document.getElementById('specRankInput').value = specs['Bậc Rank'] || specs['Rank'] || '';
    document.getElementById('specHeroesInput').value = specs['Tướng'] || specs['Số Tướng'] || '';
    document.getElementById('specSkinsInput').value = specs['Trang phục'] || specs['Số Skin'] || '';
    document.getElementById('specSecurityInput').value = specs['Tình trạng'] || specs['Bảo mật'] || '';
    document.getElementById('specServerInput').value = specs['Máy chủ'] || '';
    document.getElementById('specWarrantyInput').value = specs['Bảo Hành'] || '';

    // Image
    if (product.imageUrl) {
        setImagePreview(product.imageUrl, `Ảnh acc #${productId}`);
    } else {
        resetImageUploadState();
    }

    document.getElementById('formGlobalError').style.display = 'none';
    document.getElementById('productFormModalBackdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Product Form Modal
function closeProductFormModal() {
    document.getElementById('productFormModalBackdrop').classList.remove('active');
    document.body.style.overflow = '';
    adminState.editingProductId = null;
}

// Save Product Form (Create or Update)
async function handleSaveProduct(e) {
    e.preventDefault();

    const codeInput = document.getElementById('productAccCodeInput');
    const accCode = codeInput ? codeInput.value.trim() : '';
    const name = document.getElementById('productNameInput').value.trim();
    let category = document.getElementById('productCategorySelect').value;
    if (category === 'Khác') {
        const customCat = document.getElementById('customCategoryInput').value.trim();
        category = customCat || 'Khác';
    }

    const price = parseFloat(document.getElementById('productPriceInput').value);
    const origPriceVal = document.getElementById('productOriginalPriceInput').value;
    const originalPrice = origPriceVal ? parseFloat(origPriceVal) : price;
    const inStock = document.getElementById('productInStockSelect').value === 'true';
    const shortDescription = document.getElementById('productShortDescInput').value.trim();
    const fullDescription = document.getElementById('productFullDescInput').value.trim();
    const imageUrl = document.getElementById('finalImageUrl').value.trim();

    // Validation
    if (!name) {
        showFormError('Vui lòng nhập tiêu đề acc game');
        return;
    }
    if (isNaN(price) || price < 0) {
        showFormError('Giá bán không hợp lệ');
        return;
    }
    if (!imageUrl) {
        document.getElementById('imageValidationError').style.display = 'flex';
        showFormError('Vui lòng tải ảnh acc game từ thiết bị của bạn lên!');
        return;
    }

    // Specs map
    const specs = {};
    const rank = document.getElementById('specRankInput').value.trim();
    const heroes = document.getElementById('specHeroesInput').value.trim();
    const skins = document.getElementById('specSkinsInput').value.trim();
    const sec = document.getElementById('specSecurityInput').value.trim();
    const server = document.getElementById('specServerInput').value.trim();
    const warranty = document.getElementById('specWarrantyInput').value.trim();

    if (rank) specs['Bậc Rank'] = rank;
    if (heroes) specs['Tướng'] = heroes;
    if (skins) specs['Trang phục'] = skins;
    if (sec) specs['Tình trạng'] = sec;
    if (server) specs['Máy chủ'] = server;
    if (warranty) specs['Bảo Hành'] = warranty;

    const isEdit = Boolean(adminState.editingProductId);
    const productId = isEdit ? Number(adminState.editingProductId) : null;
    const finalAccCode = accCode || (productId ? 'LQ-' + String(productId).padStart(3, '0') : 'LQ-999');

    const payload = {
        id: productId,
        accCode: finalAccCode,
        name,
        category,
        price,
        originalPrice,
        shortDescription,
        fullDescription: fullDescription || shortDescription,
        imageUrl,
        inStock,
        specs,
        rating: 5.0,
        reviewCount: Math.floor(Math.random() * 20) + 10,
        features: [
            shortDescription,
            specs['Bậc Rank'] ? `Bậc rank: ${specs['Bậc Rank']}` : 'Tài khoản sạch, tỷ lệ thắng cao',
            specs['Tình trạng'] ? `Bảo mật: ${specs['Tình trạng']}` : 'Đổi thông tin chính chủ 100%',
            'Bảo hành trọn đời, an toàn tuyệt đối'
        ]
    };

    const saveBtn = document.getElementById('saveProductBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;"></div> Đang lưu...';

    try {
        if (isEdit) {
            // Update via Quarkus API
            let updated = null;
            try {
                const res = await fetch(`/api/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    updated = await res.json();
                }
            } catch (err) {
                console.warn('Backend update failed, using local update:', err);
            }

            // Sync local state
            const idx = adminState.products.findIndex(p => p.id === productId);
            if (idx !== -1) {
                adminState.products[idx] = updated || { ...adminState.products[idx], ...payload };
            }
            localStorage.setItem('tech_store_products', JSON.stringify(adminState.products));
            showToast(`Đã cập nhật Acc Game #${productId} thành công!`, 'success');
        } else {
            // Create via Quarkus API
            let created = null;
            try {
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    created = await res.json();
                }
            } catch (err) {
                console.warn('Backend create failed, using local create:', err);
            }

            if (!created) {
                // Generate next ID locally
                const maxId = adminState.products.reduce((max, p) => p.id > max ? p.id : max, 100);
                payload.id = maxId + 1;
                created = payload;
            }

            adminState.products.unshift(created);
            localStorage.setItem('tech_store_products', JSON.stringify(adminState.products));
            showToast(`Đã thêm Acc Game "${name}" thành công!`, 'success');
        }

        closeProductFormModal();
        populateCategoryFilter();
        renderProductsTable();
        updateDashboardStats();
    } catch (err) {
        console.error('Error saving product:', err);
        showToast('Có lỗi xảy ra khi lưu sản phẩm', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu Sản Phẩm';
    }
}

function showFormError(msg) {
    const errorEl = document.getElementById('formGlobalError');
    if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }
}

// =========================================================================
// DELETE CONFIRMATION MODAL
// =========================================================================
function openDeleteConfirmModal(productId) {
    const product = adminState.products.find(p => p.id === productId);
    if (!product) return;

    adminState.deletingProductId = productId;
    document.getElementById('deleteTargetName').textContent = product.name;
    document.getElementById('deleteTargetPrice').textContent = formatCurrency(product.price);
    const imgEl = document.getElementById('deleteTargetImg');
    imgEl.src = product.imageUrl;

    document.getElementById('deleteConfirmModalBackdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDeleteConfirmModal() {
    document.getElementById('deleteConfirmModalBackdrop').classList.remove('active');
    document.body.style.overflow = '';
    adminState.deletingProductId = null;
}

async function handleConfirmDelete() {
    const id = adminState.deletingProductId;
    if (!id) return;

    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<div class="spinner" style="width:14px;height:14px;border-width:2px;"></div> Đang xóa...';

    try {
        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.warn('Backend delete failed, performing local delete:', err);
        }

        // Remove locally
        adminState.products = adminState.products.filter(p => p.id !== id);
        localStorage.setItem('tech_store_products', JSON.stringify(adminState.products));

        showToast(`Đã xóa Acc Game #${id} khỏi hệ thống!`, 'success');
        closeDeleteConfirmModal();
        populateCategoryFilter();
        renderProductsTable();
        updateDashboardStats();
    } catch (err) {
        console.error('Error deleting product:', err);
        showToast('Lỗi khi xóa sản phẩm', 'error');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Xác Nhận Xóa';
    }
}

// =========================================================================
// LIGHTBOX MODAL FOR ZOOMING IMAGES
// =========================================================================
function openLightbox(imageUrl, title) {
    const backdrop = document.getElementById('imageLightboxBackdrop');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');

    img.src = imageUrl;
    caption.textContent = title || 'Ảnh Acc Game';

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const backdrop = document.getElementById('imageLightboxBackdrop');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
}

// =========================================================================
// SETUP EVENT LISTENERS
// =========================================================================
function setupEventListeners() {
    // Open Add Modal Buttons
    const openAddBtn = document.getElementById('openAddModalBtn');
    const openAddBtn2 = document.getElementById('openAddModalBtn2');
    const emptyAddBtn = document.getElementById('emptyAddBtn');
    if (openAddBtn) openAddBtn.addEventListener('click', openAddProductModal);
    if (openAddBtn2) openAddBtn2.addEventListener('click', openAddProductModal);
    if (emptyAddBtn) emptyAddBtn.addEventListener('click', openAddProductModal);

    // Close Modal Buttons
    document.getElementById('productFormCloseBtn').addEventListener('click', closeProductFormModal);
    document.getElementById('cancelFormBtn').addEventListener('click', closeProductFormModal);
    document.getElementById('productFormModalBackdrop').addEventListener('click', (e) => {
        if (e.target.id === 'productFormModalBackdrop') closeProductFormModal();
    });

    // Save Product Form
    document.getElementById('productForm').addEventListener('submit', handleSaveProduct);

    // Delete Modal Buttons
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteConfirmModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
    document.getElementById('deleteConfirmModalBackdrop').addEventListener('click', (e) => {
        if (e.target.id === 'deleteConfirmModalBackdrop') closeDeleteConfirmModal();
    });

    // Lightbox Close
    document.getElementById('lightboxCloseBtn').addEventListener('click', closeLightbox);
    document.getElementById('imageLightboxBackdrop').addEventListener('click', (e) => {
        if (e.target.id === 'imageLightboxBackdrop') closeLightbox();
    });

    // Search and Filters
    const searchInput = document.getElementById('adminSearchInput');
    const clearSearchBtn = document.getElementById('adminClearSearchBtn');
    searchInput.addEventListener('input', (e) => {
        adminState.searchQuery = e.target.value.trim();
        clearSearchBtn.style.display = adminState.searchQuery ? 'flex' : 'none';
        renderProductsTable();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        adminState.searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderProductsTable();
    });

    // Category filter
    document.getElementById('adminCategoryFilter').addEventListener('change', (e) => {
        adminState.selectedCategory = e.target.value;
        renderProductsTable();
    });

    // Sort select
    document.getElementById('adminSortSelect').addEventListener('change', (e) => {
        adminState.sortBy = e.target.value;
        renderProductsTable();
    });

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        fetchProducts();
        showToast('Đã làm mới dữ liệu từ hệ thống!', 'info');
    });

    // Price input helpers
    const priceInput = document.getElementById('productPriceInput');
    const origPriceInput = document.getElementById('productOriginalPriceInput');
    priceInput.addEventListener('input', () => {
        const val = parseFloat(priceInput.value);
        document.getElementById('priceFormattedHelper').textContent = isNaN(val) ? '0 đ' : formatCurrency(val);
    });

    origPriceInput.addEventListener('input', () => {
        const val = parseFloat(origPriceInput.value);
        document.getElementById('origPriceFormattedHelper').textContent = isNaN(val) ? 'Để trống nếu không giảm giá' : formatCurrency(val);
    });

    // Category select "Khác"
    document.getElementById('productCategorySelect').addEventListener('change', (e) => {
        const customField = document.getElementById('customCategoryField');
        customField.style.display = e.target.value === 'Khác' ? 'block' : 'none';
    });

    // Keyboard ESC to close any modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductFormModal();
            closeDeleteConfirmModal();
            closeLightbox();
        }
    });

    // Image Upload Handlers
    setupImageUploadHandlers();

    // Logout
    setupLogout();
}

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (checkAdminAuth()) {
        setupEventListeners();
        fetchProducts();
    }
});
