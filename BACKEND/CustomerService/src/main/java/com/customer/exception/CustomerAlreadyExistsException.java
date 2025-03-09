package com.customer.exception;

public class CustomerAlreadyExistsException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public CustomerAlreadyExistsException(String msg) {
		super(msg);
	}

}
