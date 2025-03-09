package com.payment.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class StripeResponseTest {

    // Test Default Constructor
    @Test
    void testStripeResponseDefaultConstructor() {
        // Arrange
        StripeResponse stripeResponse = new StripeResponse();

        // Act & Assert
        assertNull(stripeResponse.getStatus());
        assertNull(stripeResponse.getMessage());
        assertNull(stripeResponse.getSessionId());
        assertNull(stripeResponse.getSessionUrl());
    }

    // Test All-Args Constructor
    @Test
    void testStripeResponseAllArgsConstructor() {
        // Arrange
        String status = "success";
        String message = "Payment processed";
        String sessionId = "session123";
        String sessionUrl = "http://example.com/session";

        // Act
        StripeResponse stripeResponse = new StripeResponse(status, message, sessionId, sessionUrl);

        // Assert
        assertEquals(status, stripeResponse.getStatus());
        assertEquals(message, stripeResponse.getMessage());
        assertEquals(sessionId, stripeResponse.getSessionId());
        assertEquals(sessionUrl, stripeResponse.getSessionUrl());
    }

    // Test Setter and Getter for Status
    @Test
    void testStatusSetterAndGetter() {
        // Arrange
        StripeResponse stripeResponse = new StripeResponse();

        // Act
        stripeResponse.setStatus("failed");

        // Assert
        assertEquals("failed", stripeResponse.getStatus());
    }

    // Test Setter and Getter for Message
    @Test
    void testMessageSetterAndGetter() {
        // Arrange
        StripeResponse stripeResponse = new StripeResponse();

        // Act
        stripeResponse.setMessage("Error processing payment");

        // Assert
        assertEquals("Error processing payment", stripeResponse.getMessage());
    }

    // Test Setter and Getter for Session ID
    @Test
    void testSessionIdSetterAndGetter() {
        // Arrange
        StripeResponse stripeResponse = new StripeResponse();

        // Act
        stripeResponse.setSessionId("session456");

        // Assert
        assertEquals("session456", stripeResponse.getSessionId());
    }

    // Test Setter and Getter for Session URL
    @Test
    void testSessionUrlSetterAndGetter() {
        // Arrange
        StripeResponse stripeResponse = new StripeResponse();

        // Act
        stripeResponse.setSessionUrl("http://example.com/updatedSession");

        // Assert
        assertEquals("http://example.com/updatedSession", stripeResponse.getSessionUrl());
    }

    // Test toString Method
    @Test
    void testStripeResponseToString() {
        // Arrange
        StripeResponse stripeResponse = new StripeResponse("success", "Payment completed",
                                                            "session789", "http://example.com/session");

        // Act
        String toStringResult = stripeResponse.toString();

        // Assert
        assertTrue(toStringResult.contains("success"));
        assertTrue(toStringResult.contains("Payment completed"));
        assertTrue(toStringResult.contains("session789"));
        assertTrue(toStringResult.contains("http://example.com/session"));
    }

    // Test Null Message
    @Test
    void testNullMessage() {
        // Arrange
        StripeResponse stripeResponse = new StripeResponse();

        // Act
        stripeResponse.setMessage(null);

        // Assert
        assertNull(stripeResponse.getMessage());
    }

    // Test Null Session ID
    @Test
    void testNullSessionId() {
        // Arrange
        StripeResponse stripeResponse = new StripeResponse();

        // Act
        stripeResponse.setSessionId(null);

        // Assert
        assertNull(stripeResponse.getSessionId());
    }
}
