package com.customer.exception;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	
	public final ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {

		ErrorResponse res = new ErrorResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false), "INTERNAL_SERVER_ERROR");

		return new ResponseEntity<>(res,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(value= {CustomerNotFoundException.class,
							CustomerAlreadyExistsException.class,
							NoCustomerExistsException.class,
							CredentialsInvalidException.class})
	public final ResponseEntity<ErrorResponse> handleCustomException(Exception ex,WebRequest req){
		ErrorResponse res = new ErrorResponse(
								LocalDateTime.now(),
								ex.getMessage(),
								req.getDescription(false),
								"NOT_FOUND"
								);
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
	}
	
	
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		
		List<String> errors = ex.getBindingResult().getFieldErrors()
								.stream()
								.map(error->error.getDefaultMessage())
								.toList();
		ErrorResponse res = new ErrorResponse(
							LocalDateTime.now(),
							"Validation Failed",
							String.join(",", errors),
							"BAD_REQUEST");
		return new ResponseEntity<>(res,HttpStatus.BAD_REQUEST);
	}
}
