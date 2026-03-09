"use client";
import { deleteCartItemApi } from "@/api/cart";
import DiscountCoupon from "@/components/discount-coupon/DiscountCoupon";
import QuantitySelector from "@/components/quantity-selector/QuantitySelector";
import { RootState } from "@/store";
import { removeItem, updateQuantity } from "@/store/reducer/cartSlice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

type CartImage =
  | {
      file_name: string;
    }
  | string;

type CartItem = {
  id: number;
  cart_id: number;
  title: string;
  quantity: number;
  newPrice: number | string;
  image: CartImage;
  slug?: string;
  description?: string;
};

const Cart: React.FC = () => {
  const cartSlice = useSelector(
    (state: RootState) => state.cart?.items,
  ) as CartItem[];
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const dispatch = useDispatch();

  // ✅ Move parsePrice outside useEffect
  const parsePrice = (price: string | number): number => {
    if (!price) return 0;
    const parsed = Number(String(price).replace(/[^\d.]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleRemoveItem = async (data: CartItem) => {
    try {
      await deleteCartItemApi(data.cart_id);
      dispatch(removeItem(data.id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Handle quantity change with API
  const handleQuantityChange = (cart_id: number, newQuantity: number) => {
    dispatch(updateQuantity({ cart_id, quantity: newQuantity }));
  };

  useEffect(() => {
    if (cartSlice.length === 0) {
      setSubTotal(0);
      setVat(0);
      return;
    }

    const subtotal = cartSlice.reduce(
      (acc, item) => acc + parsePrice(item.newPrice) * item.quantity,
      0,
    );
    setSubTotal(subtotal);
    const vatAmount = subtotal * 0.2;
    setVat(vatAmount);
    console.log("cart slice", cartSlice);
  }, [cartSlice]);

  const handleDiscountApplied = (discountValue: number) => {
    setDiscount(discountValue);
  };

  const discountAmount = subTotal * (discount / 100);
  const total = subTotal - discountAmount;

  return (
    <>
      <section className="section-cart padding-tb-50">
        <div className="container">
          <Row className="mb-minus-24">
            {/* Summary Sidebar */}
            <Col lg={4} className="mb-24">
              <Fade triggerOnce direction="up" duration={1000} delay={200}>
                <div className="bb-cart-sidebar-block">
                  <div className="bb-sb-title">
                    <h3>Summary</h3>
                  </div>
                  <div className="bb-sb-blok-contact">
                    <div className="bb-cart-summary">
                      <div className="inner-summary">
                        <ul>
                          <li>
                            <span className="text-left">Sub-Total</span>
                            <span className="text-right">
                              BDT {subTotal.toFixed(2)}
                            </span>
                          </li>
                          <li>
                            <span className="text-left">Coupon Discount</span>
                            <span className="text-right">
                              <a className="bb-coupon drop-coupon">
                                Apply Coupon
                              </a>
                            </span>
                          </li>
                          <DiscountCoupon
                            onDiscountApplied={handleDiscountApplied}
                          />
                        </ul>
                      </div>

                      {/* Discount Display */}
                      {discount > 0 && (
                        <div className="summary-discount">
                          <ul>
                            <li>
                              <span className="text-left">
                                Discount ({discount}%)
                              </span>
                              <span className="text-right">
                                -BDT {discountAmount.toFixed(2)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      )}

                      <div className="summary-total">
                        <ul>
                          <li>
                            <span className="text-left">Total Amount</span>
                            <span
                              className="text-right"
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#42A590",
                              }}
                            >
                              BDT {total.toFixed(2)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Fade>
            </Col>

            {/* Cart Table */}
            <Col lg={8} className="mb-24">
              <Fade
                triggerOnce
                direction="up"
                duration={1000}
                delay={400}
                className="bb-cart-table"
              >
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartSlice?.length === 0 ? (
                      <tr style={{ textAlign: "center" }}>
                        <td colSpan={5} style={{ padding: "24px" }}>
                          <p style={{ marginBottom: "16px" }}>
                            Your cart is empty
                          </p>
                          <Link
                            href="/"
                            style={{
                              color: "#42A590",
                              textDecoration: "underline",
                            }}
                          >
                            Continue Shopping
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      cartSlice?.map((data) => {
                        const itemPrice = parsePrice(data.newPrice);
                        const itemTotal = itemPrice * data.quantity;

                        return (
                          <tr key={data.cart_id}>
                            <td>
                              <div className="Product-cart">
                                <Link href={`/details/${data.slug}`}>
                                  <img
                                    src={
                                      typeof data.image === "string"
                                        ? data.image
                                        : data.image.file_name
                                    }
                                    alt={data.title}
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "cover",
                                      borderRadius: "4px",
                                    }}
                                  />
                                </Link>
                                <div style={{ marginLeft: "12px" }}>
                                  <Link href={`/details/${data.slug}`}>
                                    <p style={{ fontWeight: 600, margin: 0 }}>
                                      {data.title}
                                    </p>
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="price">
                                BDT {itemPrice.toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <div className="qty-plus-minus">
                                <QuantitySelector
                                  id={data.id}
                                  cart_id={data.cart_id}
                                  quantity={data.quantity}
                                  onQuantityChange={(newQty) =>
                                    handleQuantityChange(data.cart_id, newQty)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <span
                                className="price"
                                style={{ fontWeight: "bold", color: "#42A590" }}
                              >
                                BDT {itemTotal.toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <div className="pro-remove">
                                <button
                                  onClick={() => handleRemoveItem(data)}
                                  style={{
                                    cursor: "pointer",
                                    color: "#e53935",
                                  }}
                                  title="Remove item"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </Fade>

              {cartSlice.length > 0 && (
                <Fade triggerOnce direction="up" duration={1000} delay={400}>
                  <div style={{ marginTop: "16px", textAlign: "right" }}>
                    <Link href="/checkout" className="bb-btn-2 check-btn">
                      Check Out
                    </Link>
                  </div>
                </Fade>
              )}
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Cart;
