/**
 * Vua Dịch Vụ LQ - Main JavaScript Application
 * Interacting with Quarkus REST API & handling UI events
 * Hỗ trợ Acc Game VIP, Đăng nhập Admin và chuyển hướng trang chủ Admin
 */

// Seed Data for Game Accounts Fallback
// Seed Data for Lien Quan Mobile Accounts Fallback
const DEFAULT_STORE_PRODUCTS = [
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

// Application State
const state = {
    products: [],
    allProductsRaw: [],
    categories: [],
    selectedCategory: 'Tất cả',
    searchQuery: '',
    sortBy: 'default',
    cartCount: 0,
    activeProduct: null,
    modalQty: 1
};

// DOM Elements
const elements = {
    productGrid: document.getElementById('productGrid'),
    emptyState: document.getElementById('emptyState'),
    categoryTabs: document.getElementById('categoryTabs'),
    mainSearchInput: document.getElementById('mainSearchInput'),
    headerSearchInput: document.getElementById('headerSearchInput'),
    mainClearBtn: document.getElementById('mainClearBtn'),
    headerClearBtn: document.getElementById('headerClearBtn'),
    sortSelect: document.getElementById('sortSelect'),
    resultsCount: document.getElementById('resultsCount'),
    activeFilterTags: document.getElementById('activeFilterTags'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    productModalBackdrop: document.getElementById('productModalBackdrop'),
    productModal: document.getElementById('productModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalContent: document.getElementById('modalContent'),
    cartCount: document.getElementById('cartCount'),
    cartBtn: document.getElementById('cartBtn'),
    toastContainer: document.getElementById('toastContainer'),
    backendStatus: document.getElementById('backendStatus'),

    // Admin Quick Button & Login Modal Elements
    adminQuickBtn: document.getElementById('adminQuickBtn'),
    adminLoginModalBackdrop: document.getElementById('adminLoginModalBackdrop'),
    adminLoginCloseBtn: document.getElementById('adminLoginCloseBtn'),
    adminLoginForm: document.getElementById('adminLoginForm'),
    adminUsernameInput: document.getElementById('adminUsernameInput'),
    adminPasswordInput: document.getElementById('adminPasswordInput'),
    adminSubmitBtn: document.getElementById('adminSubmitBtn'),
    adminLoginError: document.getElementById('adminLoginError'),
    togglePasswordBtn: document.getElementById('togglePasswordBtn')
};

// Utility: Format Currency (VND)
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Utility: Render Star Rating
function renderStars(rating) {
    const fullStars = Math.floor(rating || 5);
    const hasHalf = (rating || 5) % 1 >= 0.5;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
    }
    if (hasHalf) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="fa-regular fa-star"></i>';
    }
    return starsHtml;
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info')}"></i>
        <span>${message}</span>
    `;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Fetch Categories from API or Local Data
async function loadCategories() {
    try {
        const res = await fetch('/api/categories');
        if (res.ok) {
            state.categories = await res.json();
            renderCategoryTabs();
            return;
        }
    } catch (err) {
        // Handled below
    }

    // Fallback: extract distinct categories from raw products
    const cats = new Set(['Tất cả']);
    state.allProductsRaw.forEach(p => {
        if (p.category) cats.add(p.category);
    });

    if (cats.size <= 1) {
        ['Cho thuê acc', 'Cao Thủ - Thách Đấu', 'Skin SS - Thứ Nguyên', 'Acc Giá Rẻ Học Sinh', 'Acc Trắng Thông Tin'].forEach(c => cats.add(c));
    }

    state.categories = Array.from(cats);
    renderCategoryTabs();
}

// Render Category Tabs
function renderCategoryTabs() {
    const iconMap = {
        'Tất cả': 'fa-layer-group',
        'Cho thuê acc': 'fa-key',
        'Cao Thủ - Thách Đấu': 'fa-crown',
        'Skin SS - Thứ Nguyên': 'fa-wand-magic-sparkles',
        'Acc Giá Rẻ Học Sinh': 'fa-graduation-cap',
        'Acc Trắng Thông Tin': 'fa-shield-halved',
        'Liên Quân Mobile': 'fa-shield-halved'
    };

    elements.categoryTabs.innerHTML = state.categories.map(cat => {
        const icon = iconMap[cat] || 'fa-shield-halved';
        const isActive = cat === state.selectedCategory ? 'active' : '';
        return `
            <button class="cat-pill ${isActive}" data-category="${cat}">
                <i class="fa-solid ${icon}"></i> ${cat}
            </button>
        `;
    }).join('');

    // Attach click events
    elements.categoryTabs.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-category');
            selectCategory(cat);
        });
    });
}

// Select a Category
function selectCategory(category) {
    state.selectedCategory = category;
    renderCategoryTabs();
    applyFiltersAndRender();
}

// Fetch Products (Quarkus REST API + LocalStorage fallback)
async function loadProducts() {
    elements.productGrid.style.display = 'grid';
    elements.emptyState.style.display = 'none';
    elements.productGrid.innerHTML = `
        <div class="grid-loading">
            <div class="spinner"></div>
            <p>Đang tìm kiếm tài khoản game từ Quarkus REST API...</p>
        </div>
    `;

    try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('API server không phản hồi');
        const data = await res.json();
        state.allProductsRaw = data;
        localStorage.setItem('tech_store_products', JSON.stringify(data));
        
        if (elements.backendStatus) {
            elements.backendStatus.textContent = 'Java 21 • Quarkus Live';
        }
    } catch (err) {
        console.warn('Backend API offline, sử dụng dữ liệu lưu trữ nội bộ:', err);
        const localData = localStorage.getItem('tech_store_products');
        if (localData) {
            try {
                state.allProductsRaw = JSON.parse(localData);
            } catch (e) {
                state.allProductsRaw = [...DEFAULT_STORE_PRODUCTS];
            }
        } else {
            state.allProductsRaw = [...DEFAULT_STORE_PRODUCTS];
            localStorage.setItem('tech_store_products', JSON.stringify(state.allProductsRaw));
        }

        if (elements.backendStatus) {
            elements.backendStatus.textContent = 'Lưu trữ Cục Bộ (Local Ready)';
            elements.backendStatus.parentElement.style.borderColor = 'rgba(245, 158, 11, 0.4)';
            elements.backendStatus.parentElement.style.color = '#fbbf24';
        }
    }

    await loadCategories();
    applyFiltersAndRender();
}

// Filter and Sort in Client
function applyFiltersAndRender() {
    let list = [...state.allProductsRaw];

    // Filter search
    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase().trim();
        list = list.filter(p => {
            const accCode = (p.accCode || ('LQ-' + String(p.id).padStart(3, '0'))).toLowerCase();
            return accCode.includes(q) ||
                p.name.toLowerCase().includes(q) ||
                (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
                (p.category && p.category.toLowerCase().includes(q)) ||
                (p.fullDescription && p.fullDescription.toLowerCase().includes(q));
        });
    }

    // Filter category
    if (state.selectedCategory && state.selectedCategory !== 'Tất cả') {
        list = list.filter(p => p.category === state.selectedCategory);
    }

    // Sort
    list.sort((a, b) => {
        if (state.sortBy === 'price-asc') return a.price - b.price;
        if (state.sortBy === 'price-desc') return b.price - a.price;
        if (state.sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        if (state.sortBy === 'name') return a.name.localeCompare(b.name);
        return b.id - a.id;
    });

    state.products = list;
    renderProductGrid();
    updateResultsInfo();
}

// Render Products Grid
function renderProductGrid() {
    if (!state.products || state.products.length === 0) {
        elements.productGrid.style.display = 'none';
        elements.emptyState.style.display = 'block';
        return;
    }

    elements.productGrid.style.display = 'grid';
    elements.emptyState.style.display = 'none';

    elements.productGrid.innerHTML = state.products.map(product => {
        const discountPct = product.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;
        const accCode = product.accCode || ('LQ-' + String(product.id).padStart(3, '0'));

        return `
            <article class="product-card" data-id="${product.id}">
                <!-- Clickable Image Box with Corner Acc Code Badge -->
                <div class="product-image-box" title="Click để xem chi tiết ${product.name}">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'">
                    <!-- Mã Acc trên góc ảnh -->
                    <span class="card-badge-acc-code" title="Mã tài khoản: ${accCode}">
                        <i class="fa-solid fa-hashtag"></i> ${accCode}
                    </span>
                    <span class="card-badge-category">${product.category || 'Game'}</span>
                    ${discountPct > 0 ? `<span class="card-badge-discount">-${discountPct}%</span>` : ''}
                    <div class="img-hover-overlay">
                        <span class="view-detail-hint">
                            <i class="fa-solid fa-circle-info"></i> Xem chi tiết
                        </span>
                    </div>
                </div>

                <!-- Product Body -->
                <div class="product-card-body">
                    <div class="card-rating-row">
                        ${renderStars(product.rating)}
                        <span class="rating-count">(${product.rating || 5.0} • ${product.reviewCount || 10} đánh giá)</span>
                    </div>

                    <h3 class="product-title" title="${product.name}">
                        ${product.name}
                    </h3>

                    <!-- Short Description under product -->
                    <p class="product-short-desc">
                        ${product.shortDescription || 'Tài khoản chính chủ, bảo hành an toàn trọn đời.'}
                    </p>

                    <div class="product-price-row">
                        <span class="current-price">${formatCurrency(product.price)}</span>
                        ${product.originalPrice && product.originalPrice > product.price ? `
                            <span class="original-price">${formatCurrency(product.originalPrice)}</span>
                        ` : ''}
                    </div>

                    <div class="product-card-actions">
                        <button class="btn-card-detail" data-action="view-detail" data-id="${product.id}">
                            <i class="fa-solid fa-circle-info"></i> Chi tiết
                        </button>
                        <button class="btn-card-buy" data-action="quick-buy" data-id="${product.id}" title="Thêm vào giỏ">
                            <i class="fa-solid fa-cart-plus"></i> Mua ngay
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Attach Click Event on Product Image and Titles to Open Detail Modal
    elements.productGrid.querySelectorAll('.product-card').forEach(card => {
        const id = Number(card.getAttribute('data-id'));
        
        // Clicking image box opens modal
        const imgBox = card.querySelector('.product-image-box');
        imgBox.addEventListener('click', () => openProductDetail(id));

        // Clicking product title opens modal
        const title = card.querySelector('.product-title');
        title.addEventListener('click', () => openProductDetail(id));

        // Clicking detail button opens modal
        const detailBtn = card.querySelector('[data-action="view-detail"]');
        detailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openProductDetail(id);
        });

        // Clicking buy button
        const buyBtn = card.querySelector('[data-action="quick-buy"]');
        buyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prod = state.products.find(p => p.id === id);
            addToCart(prod, 1);
        });
    });
}

// Update Results Info Bar
function updateResultsInfo() {
    const total = state.products.length;
    let text = `Tìm thấy <strong>${total}</strong> tài khoản game`;
    if (state.selectedCategory !== 'Tất cả') {
        text += ` trong danh mục "<strong>${state.selectedCategory}</strong>"`;
    }
    if (state.searchQuery) {
        text += ` khớp với "<strong>${state.searchQuery}</strong>"`;
    }
    elements.resultsCount.innerHTML = text;

    // Filter tags
    let tagsHtml = '';
    if (state.selectedCategory !== 'Tất cả') {
        tagsHtml += `
            <span class="filter-tag">
                ${state.selectedCategory}
                <i class="fa-solid fa-xmark remove-tag" onclick="selectCategory('Tất cả')"></i>
            </span>
        `;
    }
    if (state.searchQuery) {
        tagsHtml += `
            <span class="filter-tag">
                "${state.searchQuery}"
                <i class="fa-solid fa-xmark remove-tag" onclick="clearSearch()"></i>
            </span>
        `;
    }
    elements.activeFilterTags.innerHTML = tagsHtml;
}

// Open Product Detail Modal
async function openProductDetail(productId) {
    state.modalQty = 1;
    
    // Check locally first or fetch
    let product = state.allProductsRaw.find(p => p.id === productId);

    elements.productModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (product) {
        state.activeProduct = product;
        renderModalDetail(product);
        return;
    }

    // Otherwise try API
    try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Không tìm thấy chi tiết sản phẩm');
        product = await res.json();
        state.activeProduct = product;
        renderModalDetail(product);
    } catch (err) {
        elements.modalContent.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <p style="color: #f43f5e; margin-bottom: 16px;">Không tìm thấy thông tin sản phẩm này.</p>
                <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
            </div>
        `;
    }
}

// Render Modal Detail Content
function renderModalDetail(product) {
    const savings = product.originalPrice && product.originalPrice > product.price
        ? product.originalPrice - product.price
        : 0;

    // Specifications Grid HTML
    let specsHtml = '';
    if (product.specs && Object.keys(product.specs).length > 0) {
        specsHtml = `
            <div class="modal-specs-section">
                <h4><i class="fa-solid fa-microchip"></i> Thông số & Tình trạng tài khoản</h4>
                <div class="specs-grid">
                    ${Object.entries(product.specs).map(([key, val]) => `
                        <div class="spec-item">
                            <span class="spec-key">${key}</span>
                            <span class="spec-val">${val}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Features List HTML
    let featuresHtml = '';
    if (product.features && product.features.length > 0) {
        featuresHtml = `
            <div class="modal-features-section">
                <h4><i class="fa-solid fa-wand-magic-sparkles"></i> Quyền lợi & Điểm nổi bật</h4>
                <ul class="features-list">
                    ${product.features.map(feat => `
                        <li><i class="fa-solid fa-circle-check"></i> <span>${feat}</span></li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    const accCode = product.accCode || ('LQ-' + String(product.id).padStart(3, '0'));

    elements.modalContent.innerHTML = `
        <div class="modal-detail-layout">
            <!-- Left: Main Image with Corner Acc Code Badge -->
            <div class="modal-image-col">
                <div class="modal-main-img-wrap">
                    <img src="${product.imageUrl}" alt="${product.name}" class="modal-main-img" onerror="this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'">
                    <span class="modal-corner-acc-code" title="Mã Acc: ${accCode}">
                        <i class="fa-solid fa-hashtag"></i> Mã: ${accCode}
                    </span>
                    <div class="modal-stock-badge">
                        <i class="fa-solid fa-check-circle"></i>
                        <span>${product.inStock !== false ? 'Sẵn sàng giao dịch ngay' : 'Đã bán / Tạm hết'}</span>
                    </div>
                </div>
            </div>

            <!-- Right: Info, Specs, Actions -->
            <div class="modal-info-col">
                <div class="modal-header-meta">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="acc-code-pill" style="font-size: 0.85rem; padding: 4px 10px;">
                            <i class="fa-solid fa-hashtag"></i> Mã: ${accCode}
                        </span>
                        <span class="modal-category">${product.category || 'Game'}</span>
                    </div>
                    <div class="modal-rating-badge">
                        ${renderStars(product.rating)}
                        <span>${product.rating || 5.0} (${product.reviewCount || 10} đánh giá)</span>
                    </div>
                </div>

                <h2 class="modal-product-title" id="modalProductTitle">${product.name}</h2>

                <!-- Price Box -->
                <div class="modal-price-box">
                    <div class="modal-price-group">
                        <span class="modal-curr-price">${formatCurrency(product.price)}</span>
                        ${product.originalPrice && product.originalPrice > product.price ? `
                            <span class="modal-orig-price">${formatCurrency(product.originalPrice)}</span>
                        ` : ''}
                    </div>
                    ${savings > 0 ? `
                        <span class="modal-savings">Tiết kiệm ${formatCurrency(savings)}</span>
                    ` : ''}
                </div>

                <!-- Full Detailed Description -->
                <div class="modal-desc-section">
                    <h4><i class="fa-solid fa-align-left"></i> Mô tả chi tiết acc game</h4>
                    <p class="modal-full-desc">${product.fullDescription || product.shortDescription || 'Tài khoản sạch, hỗ trợ đổi liên kết ngay.'}</p>
                </div>

                <!-- Specs -->
                ${specsHtml}

                <!-- Features -->
                ${featuresHtml}

                <!-- Actions: Direct Zalo & Transaction -->
                <div class="modal-actions-row" style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="https://zalo.me/triduc1903" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1; min-width: 200px; text-align: center; text-decoration: none; padding: 13px 18px; font-weight: 700; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
                        <i class="fa-solid fa-comment-dots"></i> Nhắn Tin Zalo ${product.category === 'Cho thuê acc' ? 'Thuê Acc' : 'Mua Acc'} (triduc1903)
                    </a>
                    <button class="btn-modal-cart" id="modalAddToCartBtn" style="flex: 1; min-width: 180px;">
                        <i class="fa-solid fa-bolt"></i> ${product.category === 'Cho thuê acc' ? 'Đặt Thuê Acc' : 'Chọn Mua Acc'}
                    </button>
                </div>
            </div>
        </div>
    `;

    const addToCartBtn = document.getElementById('modalAddToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(product, 1);
            closeModal();
        });
    }
}

// Close Product Detail Modal
function closeModal() {
    elements.productModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    state.activeProduct = null;
}

// Add Product to Cart or Direct Zalo Notification
function addToCart(product, quantity = 1) {
    if (!product) return;
    state.cartCount += quantity;
    if (elements.cartCount) {
        elements.cartCount.textContent = state.cartCount;
        elements.cartCount.classList.add('bump');
        setTimeout(() => elements.cartCount.classList.remove('bump'), 300);
    }

    const isRental = product.category === 'Cho thuê acc';
    const actionText = isRental ? 'thuê acc' : 'mua acc';
    showToast(`Đã chọn ${actionText} <strong>${product.name}</strong>! Vui lòng liên hệ Zalo: <strong>triduc1903</strong> để nhận thông tin đăng nhập ngay nhé.`, 'success');
}

// Clear Search Function
function clearSearch() {
    state.searchQuery = '';
    elements.mainSearchInput.value = '';
    elements.headerSearchInput.value = '';
    elements.mainClearBtn.style.display = 'none';
    elements.headerClearBtn.style.display = 'none';
    applyFiltersAndRender();
}

// Debounce helper
function debounce(fn, delay = 250) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

const handleSearchChange = debounce((query) => {
    state.searchQuery = query.trim();
    applyFiltersAndRender();
}, 250);

function syncSearchInputs(value) {
    elements.mainSearchInput.value = value;
    elements.headerSearchInput.value = value;
    const showClear = value.length > 0;
    elements.mainClearBtn.style.display = showClear ? 'flex' : 'none';
    elements.headerClearBtn.style.display = showClear ? 'flex' : 'none';
    handleSearchChange(value);
}

// =========================================================================
// ADMIN BUTTON & ADMIN LOGIN LOGIC
// =========================================================================
function openAdminLoginModal() {
    // If already logged in, redirect directly to admin.html
    const existingToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    if (existingToken) {
        showToast('Bạn đang trong phiên đăng nhập Admin! Đang chuyển hướng...', 'info');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 500);
        return;
    }

    elements.adminLoginError.style.display = 'none';
    if (elements.adminLoginForm) {
        elements.adminLoginForm.reset();
    }
    if (elements.adminUsernameInput) {
        elements.adminUsernameInput.value = '';
    }
    if (elements.adminPasswordInput) {
        elements.adminPasswordInput.value = '';
    }
    elements.adminLoginModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (elements.adminUsernameInput) {
        elements.adminUsernameInput.focus();
    }
}

function closeAdminLoginModal() {
    elements.adminLoginModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
}

async function handleAdminLoginSubmit(e) {
    e.preventDefault();

    const username = elements.adminUsernameInput.value.trim();
    const password = elements.adminPasswordInput.value.trim();

    if (!username || !password) {
        showAdminLoginError('Vui lòng nhập đầy đủ tài khoản và mật khẩu admin!');
        return;
    }

    elements.adminSubmitBtn.disabled = true;
    elements.adminSubmitBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;"></div> Đang xác thực...';

    let isSuccess = false;
    let authToken = null;

    try {
        // Attempt calling Quarkus Admin Login API
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            isSuccess = true;
            authToken = data.token;
        }
    } catch (err) {
        console.warn('Backend login endpoint không khả dụng, sử dụng kiểm tra tài khoản mặc định:', err);
    }

    // Offline / fallback login verification (bảo mật cho tài khoản quản trị)
    if (!isSuccess) {
        if (username.toLowerCase() === 'zero2k5' && password === 'a19032005') {
            isSuccess = true;
            authToken = 'admin_session_' + Date.now();
        }
    }

    if (isSuccess) {
        // Save token to localStorage
        localStorage.setItem('admin_token', authToken || 'admin_token_default');
        localStorage.setItem('admin_user', username);

        showToast('Đăng nhập Admin thành công! Đang chuyển hướng sang trang chủ admin...', 'success');
        elements.adminSubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đăng nhập thành công!';

        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 600);
    } else {
        elements.adminSubmitBtn.disabled = false;
        elements.adminSubmitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập & Chuyển Hướng';
        showAdminLoginError('Tài khoản hoặc mật khẩu Quản trị viên không chính xác!');
    }
}

function showAdminLoginError(msg) {
    elements.adminLoginError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
    elements.adminLoginError.style.display = 'flex';
}

// Service Modal Functions (Đang phát triển - Zalo Admin)
function openServiceModal(serviceName) {
    const titleEl = document.getElementById('serviceModalTitle');
    if (titleEl) {
        titleEl.textContent = serviceName;
    }
    const backdrop = document.getElementById('serviceModalBackdrop');
    if (backdrop) {
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeServiceModal() {
    const backdrop = document.getElementById('serviceModalBackdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Search input typing
    if (elements.mainSearchInput) {
        elements.mainSearchInput.addEventListener('input', (e) => syncSearchInputs(e.target.value));
    }
    if (elements.headerSearchInput) {
        elements.headerSearchInput.addEventListener('input', (e) => syncSearchInputs(e.target.value));
    }

    // Clear buttons
    if (elements.mainClearBtn) elements.mainClearBtn.addEventListener('click', clearSearch);
    if (elements.headerClearBtn) elements.headerClearBtn.addEventListener('click', clearSearch);

    // Sorting Dropdown
    if (elements.sortSelect) {
        elements.sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            applyFiltersAndRender();
        });
    }

    // Reset Filters button
    if (elements.resetFiltersBtn) {
        elements.resetFiltersBtn.addEventListener('click', () => {
            state.searchQuery = '';
            state.selectedCategory = 'Tất cả';
            state.sortBy = 'default';
            if (elements.mainSearchInput) elements.mainSearchInput.value = '';
            if (elements.headerSearchInput) elements.headerSearchInput.value = '';
            if (elements.sortSelect) elements.sortSelect.value = 'default';
            if (elements.mainClearBtn) elements.mainClearBtn.style.display = 'none';
            if (elements.headerClearBtn) elements.headerClearBtn.style.display = 'none';
            renderCategoryTabs();
            applyFiltersAndRender();
        });
    }

    // Product Modal Close
    if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeModal);
    if (elements.productModalBackdrop) {
        elements.productModalBackdrop.addEventListener('click', (e) => {
            if (e.target === elements.productModalBackdrop) {
                closeModal();
            }
        });
    }

    // LQ Services Menu Navigation Handlers
    const menuButtons = document.querySelectorAll('.nav-menu-item');
    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceType = btn.getAttribute('data-service');
            const serviceTitle = btn.getAttribute('data-title') || btn.querySelector('span')?.textContent || 'Vua Dịch Vụ LQ';

            if (serviceType === 'rental') {
                menuButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectCategory('Cho thuê acc');
                const productsSec = document.getElementById('productsSection');
                if (productsSec) {
                    productsSec.scrollIntoView({ behavior: 'smooth' });
                }
                showToast('Đang hiển thị danh sách Acc Liên Quân cho thuê!', 'info');
            } else {
                openServiceModal(serviceTitle);
            }
        });
    });

    // Service Modal Close Handlers
    const serviceCloseBtn = document.getElementById('serviceModalCloseBtn');
    if (serviceCloseBtn) {
        serviceCloseBtn.addEventListener('click', closeServiceModal);
    }
    const serviceModalBackdrop = document.getElementById('serviceModalBackdrop');
    if (serviceModalBackdrop) {
        serviceModalBackdrop.addEventListener('click', (e) => {
            if (e.target === serviceModalBackdrop) {
                closeServiceModal();
            }
        });
    }

    // Admin Quick Button Click -> Open Admin Login
    if (elements.adminQuickBtn) {
        elements.adminQuickBtn.addEventListener('click', openAdminLoginModal);
    }

    // Admin Login Modal Close
    if (elements.adminLoginCloseBtn) {
        elements.adminLoginCloseBtn.addEventListener('click', closeAdminLoginModal);
    }
    if (elements.adminLoginModalBackdrop) {
        elements.adminLoginModalBackdrop.addEventListener('click', (e) => {
            if (e.target === elements.adminLoginModalBackdrop) {
                closeAdminLoginModal();
            }
        });
    }

    // Admin Login Form Submit
    if (elements.adminLoginForm) {
        elements.adminLoginForm.addEventListener('submit', handleAdminLoginSubmit);
    }

    // Toggle Password Visibility
    if (elements.togglePasswordBtn) {
        elements.togglePasswordBtn.addEventListener('click', () => {
            const input = elements.adminPasswordInput;
            const icon = elements.togglePasswordBtn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fa-solid fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fa-solid fa-eye';
            }
        });
    }

    // Keyboard ESC & Shortcut
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.productModalBackdrop && elements.productModalBackdrop.classList.contains('active')) closeModal();
            if (elements.adminLoginModalBackdrop && elements.adminLoginModalBackdrop.classList.contains('active')) closeAdminLoginModal();
            const sBackdrop = document.getElementById('serviceModalBackdrop');
            if (sBackdrop && sBackdrop.classList.contains('active')) closeServiceModal();
        }
        if (e.key === '/' && document.activeElement !== elements.mainSearchInput && document.activeElement !== elements.headerSearchInput) {
            e.preventDefault();
            if (elements.headerSearchInput) elements.headerSearchInput.focus();
        }
    });

    // Cart Button Click (Guarded safely)
    if (elements.cartBtn) {
        elements.cartBtn.addEventListener('click', () => {
            if (state.cartCount === 0) {
                showToast('Giỏ hàng của bạn đang trống! Hãy chọn tài khoản game ưng ý nhé.', 'info');
            } else {
                showToast(`Bạn đang có ${state.cartCount} tài khoản game trong giỏ hàng.`, 'success');
            }
        });
    }

    // Check URL parameters for redirect login
    if (window.location.search.includes('login_required') || window.location.search.includes('login=true')) {
        openAdminLoginModal();
        showAdminLoginError('Vui lòng đăng nhập tài khoản Admin để truy cập trang quản trị!');
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadProducts();
});
