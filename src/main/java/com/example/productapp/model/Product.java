package com.example.productapp.model;

import java.util.List;
import java.util.Map;

public class Product {
    private Long id;
    private String name;
    private String category;
    private Double price;
    private Double originalPrice;
    private String shortDescription;
    private String fullDescription;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;
    private Boolean inStock;
    private Map<String, String> specs;
    private List<String> features;

    public Product() {
    }

    public Product(Long id, String name, String category, Double price, Double originalPrice,
                   String shortDescription, String fullDescription, String imageUrl,
                   Double rating, Integer reviewCount, Boolean inStock,
                   Map<String, String> specs, List<String> features) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.originalPrice = originalPrice;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.inStock = inStock;
        this.specs = specs;
        this.features = features;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Boolean getInStock() {
        return inStock;
    }

    public void setInStock(Boolean inStock) {
        this.inStock = inStock;
    }

    public Map<String, String> getSpecs() {
        return specs;
    }

    public void setSpecs(Map<String, String> specs) {
        this.specs = specs;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }
}
