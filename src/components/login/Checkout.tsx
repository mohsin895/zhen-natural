"use client";
import { RootState } from "@/store";
import { addOrder, clearCart, setOrders } from "@/store/reducer/cartSlice";
import { Formik, FormikProps } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import Link from "next/link";
import DiscountCoupon from "../discount-coupon/DiscountCoupon";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";

interface FormValues {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Checkout = () => {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const cartSlice = useSelector((state: RootState) => state.cart?.items);
  const siteKey = "6Le1SxktAAAAAO0vuM1eQyfnm0t66HZU_kMfdhxV";

  const [agree, setAgree] = useState(false);

  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("free");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [orderLoading, setOrderLoading] = useState(false);
  const settings = data?.data || [];

  const freeShippingSetting = settings.find(
    (item: any) => item.type === "free_shipping",
  );

  const isFreeShippingEnabled = freeShippingSetting?.value === "1";

  // ── SSL Payment callback ──
  useEffect(() => {
    const paymentStatus = searchParams?.get("payment");
    if (!paymentStatus) return;

    const pendingOrder = localStorage.getItem("pending_ssl_order");
    if (!pendingOrder) return;

    const order = JSON.parse(pendingOrder);

    if (paymentStatus === "success") {
      dispatch(addOrder(order));
      dispatch(clearCart());
      localStorage.removeItem("pending_ssl_order");
      localStorage.removeItem("guest_token");
      showSuccessToast("পেমেন্ট ও অর্ডার সফল হয়েছে!");
      router.replace("/orders");
    } else if (paymentStatus === "failed") {
      localStorage.removeItem("pending_ssl_order");
      showErrorToast("পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      router.replace("/checkout");
    } else if (paymentStatus === "cancelled") {
      localStorage.removeItem("pending_ssl_order");
      showErrorToast("পেমেন্ট বাতিল করা হয়েছে।");
      router.replace("/checkout");
    }
  }, [searchParams, dispatch, router]);

  // ── Subtotal ──
  const parsePrice = (price: any) => {
    if (!price) return 0;
    const cleaned = String(price).replace(/[^\d.]/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    if (cartSlice.length === 0) {
      setSubTotal(0);
      setVat(0);
      return;
    }

    const subtotal = cartSlice.reduce((acc, item) => {
      const price = parsePrice(item?.newPrice);
      const qty = item?.quantity || 1;
      return acc + price * qty;
    }, 0);

    setSubTotal(subtotal);

    let deliveryCharge = 0;

    if (!isFreeShippingEnabled) {
      deliveryCharge = selectedMethod === "free" ? 60 : 110;
    }

    setVat(deliveryCharge);
  }, [cartSlice, selectedMethod]);

  const discountAmount = subTotal * (discount / 100);
  const total = subTotal + vat - discountAmount;

  // ── Checkout ──
  const handleCheckout = async (values: FormValues) => {
    if (!agree) {
      showErrorToast("Please accept Terms & Conditions");
      return;
    }
    if (!values.name?.trim()) {
      showErrorToast("নাম দেওয়া আবশ্যক।");
      return;
    }
    if (!values.phone?.trim()) {
      showErrorToast("মোবাইল নম্বর দেওয়া আবশ্যক।");
      return;
    }
    if (!values.address?.trim()) {
      showErrorToast("ঠিকানা দেওয়া আবশ্যক।");
      return;
    }
    if (!captchaToken) {
      showErrorToast("Please verify that you are not a robot.");
      return;
    }

    const tempUserId = localStorage.getItem("guest_token") || "";
    const orderItems = cartSlice.map((item: any) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.newPrice,
    }));

    let shippingCost = 0;

    if (!isFreeShippingEnabled) {
      shippingCost = selectedMethod === "free" ? 60 : 110;
    }

    const payload = {
      temp_user_id: tempUserId,
      name: values.name.trim(),
      email: values.email?.trim() || "",
      phone: values.phone.trim(),
      address: values.address.trim(),
      shipping_method: selectedMethod,

      sub_total: subTotal,
      shipping_cost: shippingCost,

      discount: discountAmount,
      total: subTotal + shippingCost - discountAmount,

      items: orderItems,
    };

    setOrderLoading(true);
    try {
      // ── Step 1: Store order ──
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/gust/user/order/store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (_) {}

      // Response: { combined_order_id: 53, order_id: 61, result: true, message: "..." }
      // console.log("ORDER RESPONSE:", JSON.stringify(data, null, 2));

      if (!res.ok) {
        showErrorToast(data?.message || "অর্ডার করা যায়নি।");
        return;
      }

      // ── COD ──
      if (paymentMethod === "cod") {
        const orderForStore = {
          orderId: data?.order_id ?? data?.combined_order_id ?? Date.now(),
          shippingMethod:
            selectedMethod === "free"
              ? "ঢাকার ভেতরে (৳60)"
              : "ঢাকার বাইরে (৳110)",
          totalItems: cartSlice.reduce(
            (acc: number, item: any) => acc + item.quantity,
            0,
          ),
          totalPrice: total.toFixed(2),
          status: "Pending", // ← Orders page এ filter করছে "Pending" দিয়ে
          name: values.name,
          phone: values.phone,
          address: values.address,
          items: cartSlice,
          createdAt: new Date().toISOString(),
        };

        dispatch(addOrder(orderForStore));
        dispatch(clearCart());
        localStorage.removeItem("guest_token");
        showSuccessToast("অর্ডার সফল হয়েছে!");
        router.push("/orders");
        return;
      }

      // ── Online: get combined_order_id ──
      const combinedOrderId = data?.combined_order_id;
      if (!combinedOrderId) {
        showErrorToast("Order ID পাওয়া যায়নি।");
        console.error("No combined_order_id:", data);
        return;
      }

      localStorage.setItem(
        "pending_ssl_order",
        JSON.stringify({
          ...payload,
          combined_order_id: combinedOrderId,
          order_id: data?.order_id,
        }),
      );

      showSuccessToast("অর্ডার নিবন্ধিত! পেমেন্ট পেজে যাচ্ছেন...");

      // ── Step 2: SSLCommerz begin ──
      const sslRes = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/sslcommerz/begin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            payment_type: "cart_payment",
            combined_order_id: combinedOrderId,
            amount: total,
          }),
        },
      );

      const sslText = await sslRes.text();
      let sslData: any = {};
      try {
        sslData = JSON.parse(sslText);
      } catch (_) {}
      // console.log("SSL RESPONSE:", JSON.stringify(sslData, null, 2));

      const redirectUrl =
        sslData?.url ||
        sslData?.GatewayPageURL ||
        sslData?.redirect_url ||
        sslData?.gateway_url ||
        null;

      if (!redirectUrl) {
        showErrorToast("পেমেন্ট গেটওয়ে URL পাওয়া যায়নি।");
        console.error("No redirect URL:", sslData);
        localStorage.removeItem("pending_ssl_order");
        return;
      }

      window.location.href = redirectUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      showErrorToast("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleDiscountApplied = (disc: any) => setDiscount(disc);
  const handleDeliveryChange = (e: any) => setSelectedMethod(e.target.value);

  const schema = yup.object().shape({
    name: yup.string().required("নাম দেওয়া আবশ্যক"),
    address: yup.string().required("ঠিকানা দেওয়া আবশ্যক"),
    phone: yup
      .string()
      .required("মোবাইল নম্বর দেওয়া আবশ্যক")
      .min(10, "সঠিক মোবাইল নম্বর দিন"),
  });

  const initialValues: FormValues = {
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  return (
    <>
      <style>{`
        .phone-row { display: flex; gap: 10px; align-items: flex-start; }
        .phone-row .form-control { flex: 1; }
        .btn-send-otp { height: 38px; padding: 0 18px; background: linear-gradient(90deg, #82bc23, #6aa81e); color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.2s; }
        .btn-send-otp:hover:not(:disabled) { box-shadow: 0 3px 10px rgba(130,188,35,0.35); }
        .btn-send-otp:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn-send-otp.sent { background: linear-gradient(90deg, #4caf50, #388e3c); }
        .otp-input-wrap label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: #333; }
        .otp-input-wrap input { width: 100%; height: 38px; border: 1.5px solid #ced4da; border-radius: 6px; padding: 0 14px; font-size: 16px; letter-spacing: 4px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; color: #333; }
        .otp-input-wrap input:focus { border-color: #82bc23; box-shadow: 0 0 0 3px rgba(130,188,35,0.15); }
        .otp-input-wrap input:disabled { background: #f5f5f5; cursor: not-allowed; color: #999; }
        .otp-hint  { font-size: 12px; color: #82bc23; margin-top: 5px; display: block; }
        .otp-error { font-size: 12px; color: #dc3545; margin-top: 5px; display: block; }
        .otp-sent-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #4caf50; font-weight: 600; margin-top: 6px; }
        .payment-options { display: flex; gap: 14px; margin-top: 10px; flex-wrap: wrap; }
        @media (max-width: 768px) {
  .payment-options {
    display: grid;
  }
    .payment-card{
    display: grid;
    }
}
        
        .payment-card { flex: 1; min-width: 160px; border: 2px solid #e0e0e0; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; background: #fff; user-select: none; }
        .payment-card:hover { border-color: #82bc23; background: #f9ffe9; }
        .payment-card.active { border-color: #82bc23; background: #f4ffe1; box-shadow: 0 2px 10px rgba(130,188,35,0.18); }
        .payment-card input[type="radio"] { accent-color: #82bc23; width: 17px; height: 17px; flex-shrink: 0; }
        .payment-card .card-label { font-size: 14px; font-weight: 600; color: #333; }
        .payment-card .card-sub   { font-size: 11px; color: #888; margin-top: 2px; }
        .payment-card .card-icon  { font-size: 22px; flex-shrink: 0; }
        .ssl-info { margin-top: 12px; padding: 10px 14px; border-radius: 8px; background: #f0f9ff; border: 1px solid #bee3f8; font-size: 12px; color: #555; }
        .ssl-info ul { margin: 4px 0 0 0; padding-left: 16px; }
        .ssl-info ul li { margin-bottom: 2px; }
        .bb-btn-2:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <section className="section-checkout padding-tb-50">
        <div className="container">
          <h2>
            Your Cart
            <span
              style={{
                display: "block",
                fontSize: "18px",
                margin: "10px 0",
                color: "#666",
                fontWeight: 500,
              }}
            >
              There are {cartSlice.length} products in your cart
            </span>
          </h2>
          <Row className="mb-minus-24">
            {/* ── Summary Sidebar ── */}

            {/* ── Billing Form ── */}
            <Col lg={8} sm={12} className="mb-24">
              <Fade triggerOnce direction="up" duration={1000} delay={400}>
                <div className="bb-checkout-contact">
                  <div className="main-title">
                    <h4>Billing Details</h4>
                  </div>
                  <div className="input-box-form">
                    <Formik
                      validationSchema={schema}
                      onSubmit={() => {}}
                      initialValues={initialValues}
                    >
                      {({
                        handleChange,
                        values,
                        errors,
                      }: FormikProps<FormValues>) => (
                        <Form>
                          <Row>
                            {/* Phone + OTP Send */}
                            <Col lg={6} sm={12}>
                              <Form.Group className="input-item">
                                <label>Phone *</label>

                                <Form.Control
                                  type="text"
                                  name="phone"
                                  placeholder="01XXXXXXXXX"
                                  value={values.phone}
                                  isInvalid={!!errors.phone}
                                  onChange={handleChange}
                                />

                                <Form.Control.Feedback type="invalid">
                                  {errors.phone}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            {/* Name */}
                            <Col lg={6} sm={12}>
                              <Form.Group className="input-item">
                                <label>Name *</label>
                                <InputGroup>
                                  <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={values.name}
                                    isInvalid={!!errors.name}
                                    onChange={handleChange}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                  </Form.Control.Feedback>
                                </InputGroup>
                              </Form.Group>
                            </Col>

                            {/* Email */}
                            <Col sm={12}>
                              <Form.Group className="input-item">
                                <label>Email *</label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  placeholder="someone@gmail.com"
                                  value={values.email}
                                  isInvalid={!!errors.email}
                                  onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.email}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            {/* Address */}
                            <Col sm={12}>
                              <Form.Group className="input-item">
                                <label>Address *</label>
                                <InputGroup>
                                  <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="address line 1"
                                    value={values.address}
                                    isInvalid={!!errors.address}
                                    onChange={handleChange}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                  </Form.Control.Feedback>
                                </InputGroup>
                              </Form.Group>
                            </Col>

                            {/* Delivery Method */}
                            <Col sm={12}>
                              <Fade
                                triggerOnce
                                direction="up"
                                duration={1000}
                                delay={400}
                              >
                                <div className="checkout-items">
                                  <div className="checkout-method">
                                    <div className="sub-title">
                                      <h4>Delivery Method</h4>
                                    </div>
                                    <span className="details">
                                      Please select the preferred shipping
                                      method to use on this order.
                                    </span>
                                    <div
                                      className="bb-del-option"
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div
                                        className="inner-del mb-24"
                                        style={{ display: "flex", gap: "10px" }}
                                      >
                                        <span className="bb-del-head">
                                          Inside Dhaka
                                        </span>
                                        <div className="radio-itens">
                                          <input
                                            checked={selectedMethod === "free"}
                                            onChange={handleDeliveryChange}
                                            value="free"
                                            type="radio"
                                            id="rate1"
                                            name="rate"
                                          />
                                          <label htmlFor="rate1">
                                            Rate - ৳60.00
                                          </label>
                                        </div>
                                      </div>
                                      <div
                                        className="inner-del mb-24"
                                        style={{ display: "flex", gap: "10px" }}
                                      >
                                        <span className="bb-del-head">
                                          Out Side Dhaka
                                        </span>
                                        <div className="radio-itens">
                                          <input
                                            checked={selectedMethod === "flat"}
                                            onChange={handleDeliveryChange}
                                            value="flat"
                                            type="radio"
                                            id="rate2"
                                            name="rate"
                                          />
                                          <label htmlFor="rate2">
                                            Rate - ৳110.00
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Fade>
                            </Col>

                            {/* Payment Method */}
                            <Col sm={12}>
                              <Fade
                                triggerOnce
                                direction="up"
                                duration={1000}
                                delay={600}
                              >
                                <div className="checkout-items">
                                  <div className="sub-title">
                                    <h4>Payment Method</h4>
                                  </div>
                                  <div className="checkout-method">
                                    <span className="details">
                                      Please select the preferred Payment
                                      method.
                                    </span>
                                    <div className="payment-options">
                                      <label
                                        className={`payment-card${paymentMethod === "cod" ? " active" : ""}`}
                                        htmlFor="cash1"
                                      >
                                        <input
                                          type="radio"
                                          id="cash1"
                                          name="payment"
                                          checked={paymentMethod === "cod"}
                                          onChange={() =>
                                            setPaymentMethod("cod")
                                          }
                                        />

                                        <div>
                                          <div className="card-label">
                                            Cash On Delivery
                                          </div>
                                        </div>
                                      </label>
                                      <label
                                        className={`payment-card${paymentMethod === "online" ? " active" : ""}`}
                                        htmlFor="online1"
                                      >
                                        <input
                                          type="radio"
                                          id="online1"
                                          name="payment"
                                          checked={paymentMethod === "online"}
                                          onChange={() =>
                                            setPaymentMethod("online")
                                          }
                                        />

                                        <div>
                                          <div className="card-label">
                                            Online Payment
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </Fade>
                            </Col>
                            <Col sm={12}>
                              <div className="my-3">
                                {siteKey ? (
                                  <ReCAPTCHA
                                    sitekey={siteKey}
                                    onChange={(token) => setCaptchaToken(token)}
                                  />
                                ) : (
                                  <div>reCAPTCHA not configured</div>
                                )}
                              </div>
                            </Col>
                            <Col sm={12}>
                              <div
                                style={{
                                  marginTop: "15px",
                                  fontSize: "14px",
                                  color: "#555",
                                }}
                              >
                                <label
                                  style={{
                                    display: "flex",
                                    gap: "6px",
                                    justifyContent: "center",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                    style={{ width: "16px" }}
                                  />

                                  <span className="-mt-10">
                                    I agree to the{" "}
                                    <Link
                                      href="/terms"
                                      className="checkout-link"
                                    >
                                      Terms and Conditions
                                    </Link>
                                    ,{" "}
                                    <Link
                                      href="/privacy-policy"
                                      className="checkout-link"
                                    >
                                      Privacy Policy
                                    </Link>
                                    ,{" "}
                                    <Link
                                      href="/shipping-delivery"
                                      className="checkout-link"
                                    >
                                      Shipping & Delivery
                                    </Link>
                                    ,{" "}
                                    <Link
                                      href="/return-and-refund-policy"
                                      className="checkout-link"
                                    >
                                      Returns & Exchanges
                                    </Link>
                                  </span>
                                </label>
                              </div>
                            </Col>

                            {/* Submit */}
                            <Col sm={12}>
                              <div className="input-button mt-4">
                                <button
                                  type="button"
                                  className="bb-btn-2"
                                  disabled={orderLoading || !agree}
                                  onClick={() => handleCheckout(values)}
                                >
                                  {orderLoading
                                    ? paymentMethod === "online"
                                      ? "Payment..."
                                      : "Order..."
                                    : paymentMethod === "online"
                                      ? "Please Payment"
                                      : "Please Order"}
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </Fade>
            </Col>
            <Col lg={4} sm={12} className="mb-24">
              <div className="bb-checkout-sidebar">
                <Fade triggerOnce direction="up" duration={1000} delay={200}>
                  <div className="checkout-items">
                    <div className="sub-title">
                      <h4>Summary</h4>
                    </div>
                    <div className="checkout-summary">
                      <ul>
                        <li>
                          <span className="left-item">Sub-total</span>
                          <span>BDT {subTotal.toFixed(2)}</span>
                        </li>
                        <li>
                          <span className="left-item">Delivery Charges</span>
                          <span>BDT {vat.toFixed(2)}</span>
                        </li>

                        {isFreeShippingEnabled && (
                          <li>
                            <span className="left-item"></span>
                            <span style={{ color: "green", fontWeight: 600 }}>
                              Free Shipping Active
                            </span>
                          </li>
                        )}
                        <li>
                          <span className="left-item">Coupon Discount</span>
                          <span>
                            <a
                              onClick={(e) => e.preventDefault()}
                              href="#"
                              className="apply drop-coupon"
                            >
                              Apply Coupon
                            </a>
                          </span>
                        </li>
                        <DiscountCoupon
                          onDiscountApplied={handleDiscountApplied}
                        />
                      </ul>
                      <div className="summary-total">
                        <ul>
                          <li>
                            <span className="text-left">Total Amount</span>
                            <span className="text-right">
                              BDT {total.toFixed(2)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bb-checkout-pro">
                      {cartSlice.map((data: any, index: any) => (
                        <div key={index} className="pro-items">
                          <div className="image">
                            <img
                              src={
                                data.image ||
                                `${process.env.NEXT_PUBLIC_PATH}/${data.image?.file_name}`
                              }
                              alt={data.title}
                              onError={(e: any) => {
                                e.currentTarget.src = " ";
                              }}
                            />
                          </div>
                          <div className="items-contact">
                            <h4>
                              <a onClick={(e) => e.preventDefault()} href="#">
                                {data.title}
                              </a>
                            </h4>
                            <div className="inner-price">
                              <span className="new-price">
                                BDT {data.newPrice}
                              </span>
                              <span className="old-price">
                                BDT {data.oldPrice}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="about-order border border-1 px-3 py-4 rounded"
                    style={{ marginTop: "16px" }}
                  >
                    <h5>Add Comments About Your Order</h5>
                    <textarea name="your-comment" placeholder="comment" />
                  </div>
                </Fade>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Checkout;

export const useLoadOrders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginUser = JSON.parse(localStorage.getItem("login_user") || "{}");

      if (loginUser?.uid) {
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "{}");
        const userOrders = storedOrders[loginUser.uid] || [];
        if (userOrders.length > 0) dispatch(setOrders(userOrders));
      } else {
        const guestOrders = JSON.parse(
          localStorage.getItem("guest_orders") || "[]",
        );
        if (guestOrders.length > 0) dispatch(setOrders(guestOrders));
      }
    }
  }, [dispatch]);
};
