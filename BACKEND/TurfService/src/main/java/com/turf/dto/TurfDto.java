package com.turf.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurfDto {
	Long turfId;
	String turfName;
	String turfLocation;
	String imageUrl;
	
}
