package com.example.productapp.service;

import com.example.productapp.model.Product;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

    private final List<Product> products = new CopyOnWriteArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(100);

    @PostConstruct
    void init() {
        // Danh mục Acc Game & Sản phẩm công nghệ mẫu
        products.add(new Product(
            1L,
            "Acc Liên Quân Mobile - Rank Cao Thủ, Full 116 Tướng, 320 Skin VIP",
            "Liên Quân Mobile",
            1250000.0,
            1650000.0,
            "Full tướng, 320 skin gồm Thứ Nguyên Vệ Thần, Tuyệt Sắc SS, AIC. Đăng ký trắng thông tin 100%.",
            "Tài khoản Liên Quân Mobile chính chủ cực phẩm: Rank Cao Thủ 25 Sao, 116/116 tướng, sở hữu 320 trang phục cao cấp bao gồm: Tel'Annas Thứ Nguyên Vệ Thần, Nakroth Siêu Việt bậc 5, Raz Muay Thái, Lauriel Tinh Vân Sứ, Murad Chí Tôn Kiếm Tiên. Bảng ngọc chuẩn 30 bảng full cấp 3. Tài khoản trắng thông tin, đổi số điện thoại và email chính chủ an toàn tuyệt đối.",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
            5.0,
            48,
            true,
            Map.of(
                "Tướng", "116 / 116 Tướng",
                "Trang phục", "320 Skin (Có Thứ Nguyên, SS Tuyệt Sắc)",
                "Bậc Rank", "Cao Thủ 25 Sao (Mùa hiện tại)",
                "Bảng Ngọc", "30 Bảng Ngọc Cấp 3 Full",
                "Tình trạng", "Trắng thông tin, đổi được SĐT & Email",
                "Máy chủ", "Mặt Trời (Việt Nam)"
            ),
            List.of(
                "Sở hữu nhiều trang phục giới hạn sự kiện không thể mua lại",
                "Trắng thông tin hoàn toàn, hỗ trợ đổi liên kết ngay lập tức",
                "Bảo hành trọn đời, chống hồi phục tài khoản 100%",
                "Tỷ lệ thắng cao 62.5% với hơn 3500 trận thi đấu"
            )
        ));

        products.add(new Product(
            2L,
            "Acc Valorant - Rank Kim Cương 3, Vandal Kuronami + Reaver + Dao Karambit",
            "Valorant",
            1850000.0,
            2400000.0,
            "Kho skin khủng: Vandal Kuronami, Reaver, Phantom Oni, Dao Champions Karambit. Server Asia/VN.",
            "Tài khoản Valorant rank Kim Cương 3 máy chủ Việt Nam (Asia). Kho đồ đắt giá được đầu tư bài bản: Vandal Kuronami full nâng cấp, Vandal Reaver, Phantom Oni 2.0, Operator Ion, Spectre Prime. Cận chiến cực phẩm Karambit Champions 2023 và Xenohunter Knife. Đã hoàn thành 4 Battlepass, hơn 150 Radianite Points sẵn có. Mail gốc chính chủ bàn giao toàn bộ.",
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
            4.9,
            36,
            true,
            Map.of(
                "Rank", "Kim Cương 3 (Diamond 3)",
                "Skin Vandal", "Kuronami, Reaver, Prime, Gaia's Vengeance",
                "Skin Phantom", "Oni, Recon, Glitchpop",
                "Dao / Cận chiến", "Karambit Champions 2023, Xenohunter",
                "Máy chủ", "Việt Nam (Riot ID SEA/VN)",
                "Mail gốc", "Bàn giao kèm Gmail gốc tạo nick"
            ),
            List.of(
                "Bàn giao trọn gói Email gốc khởi tạo (First Mail) an toàn 100%",
                "Điểm kinh nghiệm Battlepass max cấp với nhiều buddy hiếm",
                "Hơn 150 điểm Radianite Point sẵn sàng nâng cấp hiệu ứng",
                "Cam kết tài khoản sạch, không sử dụng tool/hack, chưa từng bị cảnh cáo"
            )
        ));

        products.add(new Product(
            3L,
            "Acc Genshin Impact AR60 - C6 Raiden Shogun, C2 Furina + 45 Nhân Vật 5 Sao",
            "Genshin Impact",
            2400000.0,
            3200000.0,
            "AR 60 VIP, Raiden Shogun C6R1, Furina C2R1, Nahida, Kazuha, Neuvillette. La Hoàn 36 sao nhàn tênh.",
            "Tài khoản Genshin Impact World AR60 tâm huyết từ ngày đầu ra mắt server Châu Á (Asia). Đội hình tinh hoa bậc nhất: Lôi Thần Raiden Shogun Cung Mệnh 6 + Vũ khí Trấn Đoạn Thảo Trường Đao Tinh Luyện 1. Thủy Thần Furina C2 + Trấn Kiếm Khải Hoàn, Thảo Thần Nahida C0R1, Phong Thần Kazuha C0R1, Rồng Nước Neuvillette C1R1, Hu Tao C1R1 Trượng Hộ Ma. Thánh di vật build chuẩn chỉ CV 40+, vượt La Hoàn Thâm Cảnh 36 sao dễ dàng.",
            "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
            5.0,
            62,
            true,
            Map.of(
                "Cấp Mạo Hiểm", "AR 60 (Server Châu Á / Asia)",
                "Nhân vật 5 sao", "45 nhân vật (Raiden C6, Furina C2, Neuvi C1)",
                "Vũ khí 5 sao", "22 vũ khí trấn 5 sao tinh luyện cao",
                "Nguyên thạch tích lũy", "8.500 Nguyên thạch + 15 Mối Duyên Vương Vấn",
                "La Hoàn Thâm Cảnh", "Thông 36 sao tự động mỗi mùa",
                "Bảo mật", "Trắng liên kết bên thứ 3, đổi được mail Hoyoverse"
            ),
            List.of(
                "Tài khoản cày chay kết hợp nạp chuẩn thẻ quà tặng chính hãng",
                "Hầu hết các vùng đất Mondstadt, Liyue, Inazuma, Sumeru, Fontaine khám phá 100%",
                "Đầy đủ quà kỷ niệm 4 năm, cánh độc quyền hòa nhạc và pet theo chân",
                "Hỗ trợ đổi mail Hoyoverse ngay lập tức và hướng dẫn bảo mật 2 lớp"
            )
        ));

        products.add(new Product(
            4L,
            "Acc Liên Minh Huyền Thoại (LOL) - Rank Kim Cương, Full Tướng, 480 Trang Phục",
            "Liên Minh Huyền Thoại",
            950000.0,
            1350000.0,
            "Full 168 tướng, 480 skin gồm Tối Thượng, Thần Thoại, Hàng Hiệu. Khung Viền Vinh Quang cực đẹp.",
            "Tài khoản Liên Minh Huyền Thoại máy chủ Riot VNG. Sở hữu toàn bộ 168 vị tướng, bộ sưu tập 480 trang phục quý giá: Lux Thập Đại Nguyên Tố, Ezreal Vũ Khí Tối Thượng, Yasuo Ma Kiếm, Yone Kiếm Sĩ Bình Minh, Lee Sin Nộ Long Cước, Akali K/DA Hàng Hiệu, Vayne Đoạt Hồn Thần Thoại. Đầy đủ mẫu mắt và biểu cảm giới hạn từ mùa 3 tới nay.",
            "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&auto=format&fit=crop&q=80",
            4.8,
            55,
            true,
            Map.of(
                "Tướng", "168 / 168 Tướng (Full)",
                "Trang phục", "480 Skin (Đủ bậc Tối Thượng, Hàng Hiệu)",
                "Bậc Rank", "Kim Cương 4 (Mùa giải Riot mới nhất)",
                "Tinh hoa lam", "65.000 Tinh Hoa Lam đổi tên thoải mái",
                "Tinh hoa thần thoại", "125 Tinh Hoa Thần Thoại chưa dùng",
                "Tình trạng", "Riot ID chính chủ, đổi Riot ID & Email tự do"
            ),
            List.of(
                "Kèm theo tài khoản Đấu Trường Chân Lý (TFT) rank Cao Thủ",
                "Linh thú Tí Nị Yasuo Ma Kiếm và Sàn Đấu Thần Thoại độc quyền",
                "Mức giá siêu tiết kiệm so với chi phí nạp thực tế hơn 25 triệu VNĐ",
                "Bảo hành vĩnh viễn không lo tranh chấp"
            )
        ));

        products.add(new Product(
            5L,
            "Acc Free Fire - Rank Huyền Thoại, AK Rồng Xanh Lv7 + MP40 Mãng Xà Lv7",
            "Free Fire",
            1100000.0,
            1500000.0,
            "Cặp súng thần thoại AK Rồng Xanh & MP40 Mãng Xà max cấp 7 hiệu ứng độc quyền. Full set trang phục hot.",
            "Tài khoản Free Fire cực VIP dành cho game thủ bắn súng sinh tồn: Sở hữu cặp súng nâng cấp cấp 7 (Max Level) AK Rồng Xanh và MP40 Mãng Xà với hiệu ứng hạ gục độc quyền. Ngoài ra còn có Scar Cá Mập Đen Lv5, XM8 Lôi Thần Lv4. Kho đồ thời trang phong phú với set Quỷ Dạ Xoa, Quần Đi Biển, Áo Búp Bê, Thẻ Vô Cực mùa 1-10. Đăng nhập qua Facebook/Google sạch trắng liên kết.",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
            4.9,
            41,
            true,
            Map.of(
                "Súng Nâng Cấp", "AK Rồng Xanh Lv7 + MP40 Mãng Xà Lv7 (Max)",
                "Súng Khác", "Scar Cá Mập Lv5, M1014 Long Tộc Lv4",
                "Rank", "Huyền Thoại 45 Sao Tử Chiến & Sinh Tồn",
                "Nhân vật", "Alok, Chrono, K, Wukong thức tỉnh full",
                "Trang phục", "Set Quỷ Dạ Xoa, Quần Đi Biển, Áo Cổ Tròn",
                "Tài khoản", "Liên kết Google sạch, chuyển nhượng ngay"
            ),
            List.of(
                "Hiệu ứng nổ đạn và hành động độc quyền của súng nâng cấp cấp 7",
                "Hàng trăm hòm thính và vé quay vòng quay may mắn còn nguyên",
                "Tỷ lệ Headshot ấn tượng 74% trong chế độ Tử Chiến Xếp Hạng",
                "Hỗ trợ giao dịch trung gian hoặc trực tiếp nhanh chóng trong 5 phút"
            )
        ));

        products.add(new Product(
            6L,
            "Acc FC Online (FIFA) - Đội Hình Real Madrid 2.800 Tỷ BP, Gullit ICON + Ronaldo CR7",
            "FC Online",
            1450000.0,
            1900000.0,
            "Giá trị đội hình 2.800 Tỷ BP, Ruud Gullit ICON +5, Cristiano Ronaldo 24TY +6, Zidane ICON +5.",
            "Tài khoản FC Online (FIFA Online 4) máy chủ Garena Việt Nam. Đội hình Real Madrid toàn sao huyền thoại với giá trị thị trường chuyển nhượng cán mốc 2.800 Tỷ BP: Ruud Gullit ICON thẻ cộng 5 gánh tuyến giữa, Siêu sao Cristiano Ronaldo 24TY thẻ cộng 6 dứt điểm bách phát bách trúng, Zinedine Zidane ICON cộng 5, Jude Bellingham 24TY +6, Thibaut Courtois bắt bóng xuất sắc. Kèm 120 Tỷ BP tiền mặt sẵn có.",
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80",
            4.8,
            33,
            true,
            Map.of(
                "Giá trị đội hình", "2.800 Tỷ BP (Real Madrid All-Star)",
                "Cầu thủ tâm điểm", "Gullit ICON +5, CR7 24TY +6, Zidane ICON +5",
                "BP Tiền mặt", "120 Tỷ BP trắng chưa sử dụng",
                "Thẻ HLV", "Full 4 HLV 5 sao kỹ năng đỡ bước 1 và sút xa",
                "Xếp hạng", "Siêu Sao 1 / Thách Đấu (Đá 1vs1)",
                "Bảo mật", "Trắng thông tin Garena, đổi SĐT và CMND ngay"
            ),
            List.of(
                "Đội hình đã tối ưu hóa sơ đồ chiến thuật 4-2-2-2 và 4-2-3-1 chuẩn meta",
                "Nhiều phôi nâng cấp và thẻ bảo vệ thẻ cầu thủ cao cấp trong kho",
                "BP trắng hợp lệ nhận từ sự kiện cày cuốc, không lo bị khóa acc",
                "Bàn giao tài khoản Garena sạch thông tin 100%"
            )
        ));
    }

    public List<Product> getAllProducts(String search, String category, String sortBy) {
        return products.stream()
            .filter(p -> {
                if (search == null || search.trim().isEmpty()) {
                    return true;
                }
                String query = search.trim().toLowerCase();
                return p.getName().toLowerCase().contains(query)
                    || (p.getShortDescription() != null && p.getShortDescription().toLowerCase().contains(query))
                    || (p.getCategory() != null && p.getCategory().toLowerCase().contains(query))
                    || (p.getFullDescription() != null && p.getFullDescription().toLowerCase().contains(query));
            })
            .filter(p -> {
                if (category == null || category.trim().isEmpty() || "Tất cả".equalsIgnoreCase(category)) {
                    return true;
                }
                return p.getCategory() != null && p.getCategory().equalsIgnoreCase(category.trim());
            })
            .sorted((p1, p2) -> {
                if ("price-asc".equalsIgnoreCase(sortBy)) {
                    return Double.compare(p1.getPrice(), p2.getPrice());
                } else if ("price-desc".equalsIgnoreCase(sortBy)) {
                    return Double.compare(p2.getPrice(), p1.getPrice());
                } else if ("rating".equalsIgnoreCase(sortBy)) {
                    return Double.compare(p2.getRating(), p1.getRating());
                } else if ("name".equalsIgnoreCase(sortBy)) {
                    return p1.getName().compareToIgnoreCase(p2.getName());
                }
                return Long.compare(p2.getId(), p1.getId()); // Mới nhất lên đầu
            })
            .collect(Collectors.toList());
    }

    public Optional<Product> getProductById(Long id) {
        return products.stream()
            .filter(p -> p.getId().equals(id))
            .findFirst();
    }

    public List<String> getCategories() {
        List<String> categories = new ArrayList<>();
        categories.add("Tất cả");
        products.stream()
            .map(Product::getCategory)
            .filter(Objects::nonNull)
            .distinct()
            .forEach(categories::add);
        return categories;
    }

    /**
     * THÊM Sản Phẩm mới (Admin Create)
     */
    public Product addProduct(Product product) {
        if (product.getId() == null || product.getId() <= 0) {
            product.setId(idCounter.incrementAndGet());
        }
        if (product.getRating() == null) product.setRating(5.0);
        if (product.getReviewCount() == null) product.setReviewCount(1);
        if (product.getInStock() == null) product.setInStock(true);
        if (product.getSpecs() == null) product.setSpecs(new HashMap<>());
        if (product.getFeatures() == null) product.setFeatures(new ArrayList<>());
        if (product.getOriginalPrice() == null || product.getOriginalPrice() <= 0) {
            product.setOriginalPrice(product.getPrice());
        }

        products.add(0, product);
        return product;
    }

    /**
     * SỬA Sản Phẩm (Admin Update)
     */
    public Optional<Product> updateProduct(Long id, Product updated) {
        for (int i = 0; i < products.size(); i++) {
            Product current = products.get(i);
            if (current.getId().equals(id)) {
                updated.setId(id);
                if (updated.getRating() == null) updated.setRating(current.getRating());
                if (updated.getReviewCount() == null) updated.setReviewCount(current.getReviewCount());
                if (updated.getInStock() == null) updated.setInStock(current.getInStock());
                if (updated.getSpecs() == null) updated.setSpecs(current.getSpecs());
                if (updated.getFeatures() == null) updated.setFeatures(current.getFeatures());
                if (updated.getOriginalPrice() == null || updated.getOriginalPrice() <= 0) {
                    updated.setOriginalPrice(updated.getPrice());
                }
                products.set(i, updated);
                return Optional.of(updated);
            }
        }
        return Optional.empty();
    }

    /**
     * XÓA Sản Phẩm (Admin Delete)
     */
    public boolean deleteProduct(Long id) {
        return products.removeIf(p -> p.getId().equals(id));
    }
}
