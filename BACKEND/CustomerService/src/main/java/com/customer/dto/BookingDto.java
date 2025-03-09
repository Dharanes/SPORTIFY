package com.customer.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDto {


Long bookingId;
Long userId;
Long courtId;
Long timeSlotId;
int duration;
double cost;
LocalDateTime bookedOn;
String bookingStatus;



}