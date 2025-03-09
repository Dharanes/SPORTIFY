package com.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingUserTurfDto {


Long id;
String user;
String turf;
String game;
double price;

LocalDate date;
LocalTime time;


}