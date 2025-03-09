package com.payment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.payment.dto.ProductRequest;
import com.payment.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class StripeService {

	@Value("${stripe.secretKey}")
	private String secretKey;

	public StripeResponse checkoutProducts(ProductRequest productRequest) {
		
		Stripe.apiKey = secretKey;

		SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData
				.builder().setName(productRequest.getName()).build();

		SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
				.setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency() : "USD")
				.setUnitAmount(productRequest.getAmount() * 100).setProductData(productData).build();

		SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
				.setQuantity(productRequest.getQuantity()).setPriceData(priceData).build();

		SessionCreateParams params = SessionCreateParams.builder().setMode(SessionCreateParams.Mode.PAYMENT)
				.setSuccessUrl("http://localhost:5173/booking/success")
				.setCancelUrl("http://localhost:5173/booking/failure").addLineItem(lineItem).build();

		Session session = null;
		try {
			session = Session.create(params);
		} catch (StripeException e) {
			return StripeResponse.builder().status("FAILURE")
					.message("Failed to create payment session: " + e.getMessage()).build();
		}

		return StripeResponse.builder().status("SUCCESS").message("Payment session created ").sessionId(session.getId())
				.sessionUrl(session.getUrl()).build();
	}
}
