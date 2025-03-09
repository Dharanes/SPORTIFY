package com.customer.exception;

public class NoCustomerExistsException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public NoCustomerExistsException(String msg) {
		super(msg);
	}

}
