package com.gateway.model;


public class JwtToken {
	String jwtToken;
	
	public JwtToken(String tkn) {
		this.jwtToken = tkn;
	}
	String getToken() {
		return this.jwtToken;
	}
	
	void setToken(String tkn) {
		this.jwtToken = tkn;
	}
}
