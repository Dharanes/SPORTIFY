package com.customer.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {
String userName;
String password;
String email;
String contactNumber;
@Pattern(regexp = "USER|OWNER",message="Role must be either USER or OWNER")
String role;
}