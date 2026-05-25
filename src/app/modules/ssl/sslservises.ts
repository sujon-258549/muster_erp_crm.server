import axios from "axios";
import config from "../../config/index.ts";

export const sslServices = {
  createPayment: async (payload: any) => {
    const data = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePassword,
      total_amount: 100,
      currency: "BDT",
      tran_id: payload?.tran_id, // use unique tran_id for each api call
      success_url: config.ssl.successUrl,
      fail_url: config?.ssl?.failUrl,
      cancel_url: config?.ssl?.cancelUrl,
      ipn_url: config?.ssl?.ipnUrl,
      shipping_method: "Courier",
      product_name: payload.product_name,
      product_category: payload?.product_category,
      product_profile: payload.cus_name,
      cus_name: payload.cus_name,
      cus_email: payload.cus_email,
      cus_add1: payload.cus_add1,
      cus_add2: payload.cus_add2,
      cus_city: payload.cus_city,
      cus_state: payload.cus_state,
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.cus_phone,
      cus_fax: payload.cus_phone,
      ship_name: payload.cus_name,
      ship_add1: payload?.cus_add1,
      ship_add2: payload?.cus_add1,
      ship_city: payload?.cus_city,
      ship_state: payload?.ship_state,
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const result = await axios({
      method: "POST",
      url: config.ssl.ssl_payment_url,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return result.data.GatewayPageURL;
  },
};


export const sslValidatePayment = async (payload: any) => {
  const result = await axios({
    method: "GET",
    url: `${config.ssl.validate_api}?val_id=${payload.val_id}&store_id=${config.ssl.storeId}&store_pass=${config.ssl.storePassword}&format=json`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return result.data;
};



