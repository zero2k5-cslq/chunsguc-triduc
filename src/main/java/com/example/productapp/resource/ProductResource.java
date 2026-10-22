package com.example.productapp.resource;

import com.example.productapp.model.Product;
import com.example.productapp.service.ProductService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @Inject
    ProductService productService;

    // Credentials bảo mật cho tài khoản Admin (chỉ quản trị viên biết)
    private static final String ADMIN_USER = "zero2k5";
    private static final String ADMIN_PASS = "a19032005";

    @GET
    @Path("/products")
    public Response getProducts(
            @QueryParam("search") String search,
            @QueryParam("category") String category,
            @QueryParam("sortBy") String sortBy) {
        List<Product> products = productService.getAllProducts(search, category, sortBy);
        return Response.ok(products).build();
    }

    @GET
    @Path("/products/{id}")
    public Response getProductById(@PathParam("id") Long id) {
        return productService.getProductById(id)
                .map(product -> Response.ok(product).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorMessage("Không tìm thấy sản phẩm với mã: " + id))
                        .build());
    }

    @POST
    @Path("/products")
    public Response createProduct(Product product) {
        if (product == null || product.getName() == null || product.getName().trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorMessage("Tên sản phẩm không được để trống"))
                    .build();
        }
        if (product.getPrice() == null || product.getPrice() < 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorMessage("Giá sản phẩm không hợp lệ"))
                    .build();
        }
        Product created = productService.addProduct(product);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/products/{id}")
    public Response updateProduct(@PathParam("id") Long id, Product product) {
        if (product == null || product.getName() == null || product.getName().trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorMessage("Tên sản phẩm không được để trống"))
                    .build();
        }
        return productService.updateProduct(id, product)
                .map(p -> Response.ok(p).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorMessage("Không tìm thấy sản phẩm với mã: " + id))
                        .build());
    }

    @DELETE
    @Path("/products/{id}")
    public Response deleteProduct(@PathParam("id") Long id) {
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Đã xóa sản phẩm thành công");
            res.put("id", id);
            return Response.ok(res).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorMessage("Không tìm thấy sản phẩm với mã: " + id))
                    .build();
        }
    }

    @GET
    @Path("/categories")
    public Response getCategories() {
        return Response.ok(productService.getCategories()).build();
    }

    /**
     * API Xác thực tài khoản Admin
     */
    @POST
    @Path("/admin/login")
    public Response adminLogin(LoginRequest credentials) {
        if (credentials == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorMessage("Thông tin đăng nhập không hợp lệ"))
                    .build();
        }

        String username = credentials.getUsername() != null ? credentials.getUsername().trim() : "";
        String password = credentials.getPassword() != null ? credentials.getPassword().trim() : "";

        // Xác thực chính xác tài khoản và mật khẩu admin
        if (ADMIN_USER.equalsIgnoreCase(username) && ADMIN_PASS.equals(password)) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "Đăng nhập quyền Admin thành công");
            resp.put("token", "admin_session_" + UUID.randomUUID().toString());
            resp.put("username", "zero2k5");
            resp.put("role", "ROLE_ADMIN");
            return Response.ok(resp).build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorMessage("Tài khoản hoặc mật khẩu Admin không chính xác"))
                    .build();
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public LoginRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ErrorMessage {
        private String message;

        public ErrorMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
