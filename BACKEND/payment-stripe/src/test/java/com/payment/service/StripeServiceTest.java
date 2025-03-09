package com.payment.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.payment.dto.ProductRequest;
import com.payment.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class StripeServiceTest {

    @InjectMocks
    private StripeService stripeService;

    @Mock
    private Session session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        stripeService = new StripeService();
    }

    @Test
    void testCheckoutProducts_Success() throws StripeException {
        // Arrange
        ProductRequest productRequest = new ProductRequest(100L, "Test Product", "USD", 2L);
        SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName(productRequest.getName()).build();

        SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency(productRequest.getCurrency())
                .setUnitAmount(productRequest.getAmount() * 100)
                .setProductData(productData)
                .build();

        SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                .setQuantity(productRequest.getQuantity())
                .setPriceData(priceData)
                .build();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/booking/success")
                .setCancelUrl("http://localhost:5173/booking/failure")
                .addLineItem(lineItem)
                .build();

        when(Session.create(params)).thenReturn(session);
        when(session.getId()).thenReturn("session_id_123");
        when(session.getUrl()).thenReturn("https://checkout.stripe.com/session_url");

        // Act
        StripeResponse response = stripeService.checkoutProducts(productRequest);

        // Assert
        assertNotNull(response);
        assertEquals("SUCCESS", response.getStatus());
        assertEquals("Payment session created ", response.getMessage());
        assertEquals("session_id_123", response.getSessionId());
        assertEquals("https://checkout.stripe.com/session_url", response.getSessionUrl());
    }

    
}
