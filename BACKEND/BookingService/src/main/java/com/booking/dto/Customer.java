package com.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {


Long id;
String userName;
String password;
String email;
String contactNumber;
String role;
String imageUrl;


}