package com.turf.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerSendDto {
	Long id;
	String userName;
	String email;
	String contactNumber;
}
