package com.turf.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingTurfDto {
	Long id;
	String turfName;
	String location;
	String status;
}	
