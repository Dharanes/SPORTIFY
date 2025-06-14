package com.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class PaymentStripeApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaymentStripeApplication.class, args);
	}

}
