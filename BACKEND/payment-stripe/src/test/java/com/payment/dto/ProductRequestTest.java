package com.payment.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class ProductRequestTest {

    // Test Default Constructor
    @Test
    void testProductRequestDefaultConstructor() {
        // Arrange
        ProductRequest productRequest = new ProductRequest();

        // Act & Assert
        assertNull(productRequest.getAmount());
        assertNull(productRequest.getName());
        assertNull(productRequest.getCurrency());
        assertNull(productRequest.getQuantity());
    }

    // Test All-Args Constructor
    @Test
    void testProductRequestAllArgsConstructor() {
        // Arrange
        Long amount = 100L;
        String name = "Product A";
        String currency = "USD";
        Long quantity = 2L;

        // Act
        ProductRequest productRequest = new ProductRequest(amount, name, currency, quantity);

        // Assert
        assertEquals(amount, productRequest.getAmount());
        assertEquals(name, productRequest.getName());
        assertEquals(currency, productRequest.getCurrency());
        assertEquals(quantity, productRequest.getQuantity());
    }

    // Test Setter and Getter for Amount
    @Test
    void testAmountSetterAndGetter() {
        // Arrange
        ProductRequest productRequest = new ProductRequest();
        Long amount = 500L;

        // Act
        productRequest.setAmount(amount);

        // Assert
        assertEquals(amount, productRequest.getAmount());
    }

    // Test Setter and Getter for Name
    @Test
    void testNameSetterAndGetter() {
        // Arrange
        ProductRequest productRequest = new ProductRequest();
        String name = "Product B";

        // Act
        productRequest.setName(name);

        // Assert
        assertEquals(name, productRequest.getName());
    }

    // Test Setter and Getter for Currency
    @Test
    void testCurrencySetterAndGetter() {
        // Arrange
        ProductRequest productRequest = new ProductRequest();
        String currency = "EUR";

        // Act
        productRequest.setCurrency(currency);

        // Assert
        assertEquals(currency, productRequest.getCurrency());
    }

    // Test Setter and Getter for Quantity
    @Test
    void testQuantitySetterAndGetter() {
        // Arrange
        ProductRequest productRequest = new ProductRequest();
        Long quantity = 3L;

        // Act
        productRequest.setQuantity(quantity);

        // Assert
        assertEquals(quantity, productRequest.getQuantity());
    }

    // Test ToString Method
    @Test
    void testProductRequestToString() {
        // Arrange
        ProductRequest productRequest = new ProductRequest(200L, "Product C", "INR", 4L);

        // Act
        String toStringResult = productRequest.toString();

        // Assert
        assertTrue(toStringResult.contains("200"));
        assertTrue(toStringResult.contains("Product C"));
        assertTrue(toStringResult.contains("INR"));
        assertTrue(toStringResult.contains("4"));
    }

    // Test Null Values in Fields
    @Test
    void testNullFields() {
        // Arrange
        ProductRequest productRequest = new ProductRequest();

        // Act
        productRequest.setAmount(null);
        productRequest.setName(null);
        productRequest.setCurrency(null);
        productRequest.setQuantity(null);

        // Assert
        assertNull(productRequest.getAmount());
        assertNull(productRequest.getName());
        assertNull(productRequest.getCurrency());
        assertNull(productRequest.getQuantity());
    }

    // Test Negative Amount
    @Test
    void testNegativeAmount() {
        // Arrange
        ProductRequest productRequest = new ProductRequest();

        // Act
        productRequest.setAmount(-100L);

        // Assert
        assertEquals(-100L, productRequest.getAmount());
    }

    // Test Zero Quantity
    @Test
    void testZeroQuantity() {
        // Arrange
        ProductRequest productRequest = new ProductRequest();

        // Act
        productRequest.setQuantity(0L);

        // Assert
        assertEquals(0L, productRequest.getQuantity());
    }
}
