package com.customer.exception;

public class PasswordNotCorrectException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public PasswordNotCorrectException(String msg) {
		super(msg);
	}

}
