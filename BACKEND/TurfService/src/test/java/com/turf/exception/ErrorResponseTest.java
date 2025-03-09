package com.turf.exception;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class ErrorResponseTest {

    @Test
    public void testConstructorAndGetters() {
        // Given
        LocalDateTime time = LocalDateTime.now();
        String message = "An error occurred";
        String details = "Detailed error information";
        String httpCodeMessage = "404 Not Found";

        // When
        ErrorResponse errorResponse = new ErrorResponse(time, message, details, httpCodeMessage);

        // Then
        assertNotNull(errorResponse);
        assertEquals(time, errorResponse.getTime());
        assertEquals(message, errorResponse.getMessage());
        assertEquals(details, errorResponse.getDetails());
        assertEquals(httpCodeMessage, errorResponse.getHttpCodeMessage());
    }

    @Test
    public void testSetters() {
        // Given
        ErrorResponse errorResponse = new ErrorResponse();

        // When
        LocalDateTime time = LocalDateTime.now();
        errorResponse.setTime(time);
        errorResponse.setMessage("An error occurred");
        errorResponse.setDetails("Detailed error information");
        errorResponse.setHttpCodeMessage("404 Not Found");

        // Then
        assertEquals(time, errorResponse.getTime());
        assertEquals("An error occurred", errorResponse.getMessage());
        assertEquals("Detailed error information", errorResponse.getDetails());
        assertEquals("404 Not Found", errorResponse.getHttpCodeMessage());
    }

    @Test
    public void testDefaultConstructor() {
        // Given
        ErrorResponse errorResponse = new ErrorResponse();

        // When
        // Access default values (they should be null)
        LocalDateTime time = errorResponse.getTime();
        String message = errorResponse.getMessage();
        String details = errorResponse.getDetails();
        String httpCodeMessage = errorResponse.getHttpCodeMessage();

        // Then
        assertNull(time);
        assertNull(message);
        assertNull(details);
        assertNull(httpCodeMessage);
    }
    
    @Test
    public void testNullValues() {
        // Given
        LocalDateTime time = LocalDateTime.now();
        String message = null;
        String details = null;
        String httpCodeMessage = null;

        // When
        ErrorResponse errorResponse = new ErrorResponse(time, message, details, httpCodeMessage);

        // Then
        assertNotNull(errorResponse);
        assertEquals(time, errorResponse.getTime());
        assertNull(errorResponse.getMessage());
        assertNull(errorResponse.getDetails());
        assertNull(errorResponse.getHttpCodeMessage());
    }

    // 2. Test time being set to a past value
    @Test
    public void testTimeWithPastValue() {
        // Given
        LocalDateTime time = LocalDateTime.of(2022, 5, 1, 10, 0, 0, 0);
        String message = "Old error occurred";
        String details = "This error occurred in the past";
        String httpCodeMessage = "400 Bad Request";

        // When
        ErrorResponse errorResponse = new ErrorResponse(time, message, details, httpCodeMessage);

        // Then
        assertNotNull(errorResponse);
        assertEquals(time, errorResponse.getTime());
        assertEquals(message, errorResponse.getMessage());
        assertEquals(details, errorResponse.getDetails());
        assertEquals(httpCodeMessage, errorResponse.getHttpCodeMessage());
    }

    // 3. Test time being set to a future value
    @Test
    public void testTimeWithFutureValue() {
        // Given
        LocalDateTime time = LocalDateTime.of(2025, 12, 31, 23, 59, 59, 999999999);
        String message = "Future error occurred";
        String details = "This error occurred in the future";
        String httpCodeMessage = "500 Internal Server Error";

        // When
        ErrorResponse errorResponse = new ErrorResponse(time, message, details, httpCodeMessage);

        // Then
        assertNotNull(errorResponse);
        assertEquals(time, errorResponse.getTime());
        assertEquals(message, errorResponse.getMessage());
        assertEquals(details, errorResponse.getDetails());
        assertEquals(httpCodeMessage, errorResponse.getHttpCodeMessage());
    }

    // 4. Test ErrorResponse with current time
    @Test
    public void testTimeWithCurrentValue() {
        // Given
        LocalDateTime time = LocalDateTime.now();
        String message = "Current error occurred";
        String details = "This error occurred now";
        String httpCodeMessage = "403 Forbidden";

        // When
        ErrorResponse errorResponse = new ErrorResponse(time, message, details, httpCodeMessage);

        // Then
        assertNotNull(errorResponse);
        assertEquals(time, errorResponse.getTime());
        assertEquals(message, errorResponse.getMessage());
        assertEquals(details, errorResponse.getDetails());
        assertEquals(httpCodeMessage, errorResponse.getHttpCodeMessage());
    }

    // 5. Test ErrorResponse with empty values
    @Test
    public void testEmptyValues() {
        // Given
        LocalDateTime time = LocalDateTime.now();
        String message = "";
        String details = "";
        String httpCodeMessage = "";

        // When
        ErrorResponse errorResponse = new ErrorResponse(time, message, details, httpCodeMessage);

        // Then
        assertNotNull(errorResponse);
        assertEquals(time, errorResponse.getTime());
        assertEquals("", errorResponse.getMessage());
        assertEquals("", errorResponse.getDetails());
        assertEquals("", errorResponse.getHttpCodeMessage());
    }

    // 6. Test equality of two ErrorResponse objects
    @Test
    public void testEquality() {
        // Given
        LocalDateTime time1 = LocalDateTime.of(2024, 1, 1, 12, 0, 0, 0);
        String message1 = "Error 1";
        String details1 = "Details of error 1";
        String httpCodeMessage1 = "500 Internal Server Error";

        LocalDateTime time2 = LocalDateTime.of(2024, 1, 1, 12, 0, 0, 0);
        String message2 = "Error 1";
        String details2 = "Details of error 1";
        String httpCodeMessage2 = "500 Internal Server Error";

        // When
        ErrorResponse errorResponse1 = new ErrorResponse(time1, message1, details1, httpCodeMessage1);
        ErrorResponse errorResponse2 = new ErrorResponse(time2, message2, details2, httpCodeMessage2);

        // Then
        assertEquals(errorResponse1, errorResponse2);
    }
}
