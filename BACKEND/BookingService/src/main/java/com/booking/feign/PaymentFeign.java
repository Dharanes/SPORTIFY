package com.booking.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.booking.dto.OrderDto;

@FeignClient(name="payment",url = "http://localhost:8083")
public interface PaymentFeign {

@GetMapping("/getOrder/{email}")
@ResponseBody
public OrderDto getOrder(@PathVariable("email") String email);


}