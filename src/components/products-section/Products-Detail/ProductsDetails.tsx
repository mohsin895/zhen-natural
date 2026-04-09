"use client";
import { addToCartApi } from "@/api/cart";
import { ProductData } from "@/app/details/[slug]/page";
import { useRouter } from "next/navigation";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/toast-popup/Toastify";
import { addItem } from "@/store/reducer/cartSlice";
import { getCartImageUrl } from "@/utility/imageHelper";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import SingleProductSlider from "./single-product-slider/SingleProductSlider";

interface ProductsDetailsProps {
  product: ProductData;
}

const ProductsDetails: React.FC<ProductsDetailsProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const calculatePrice = () => {
    if (product.discount_type === "percent") {
      return product.unit_price - (product.unit_price * product.discount) / 100;
    }
    return product.unit_price - product.discount;
  };
  const router = useRouter();
  const discountedPrice = calculatePrice();
  const discountPercent =
    product.discount > 0 && product.unit_price > 0
      ? product.discount_type === "percent"
        ? product.discount
        : Math.round((product.discount / product.unit_price) * 100)
      : 0;
  const basePath = process.env.NEXT_PUBLIC_PATH || "";

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const data = await addToCartApi(product.id, quantity);

      if (data.result && data.cart && data.cart.length > 0) {
        const cartItem = data.cart.find(
          (c: any) => c.product_id === product.id,
        );
        if (!cartItem) throw new Error("Cart item not found");

        dispatch(
          addItem({
            cart_id: cartItem.id,
            id: product.id,
            title: product.name,
            slug: product.slug,
            newPrice: discountedPrice,
            weight: "",
            image: getCartImageUrl(product.thumbnail?.file_name),
            imageTwo: getCartImageUrl(product.thumbnail?.file_name),
            date: new Date().toISOString(),
            status: product.current_stock > 0 ? "In Stock" : "Out Of Stock",
            rating: 0,
            oldPrice: product.unit_price,
            location: "online",
            brand: "",
            sku: product.id,
            category: "",
            quantity: cartItem.quantity,
          }),
        );
        showSuccessToast("Added to cart!");
        setQuantity(1);
      }
    } catch (error: any) {
      showErrorToast(error.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };
  const handleBuyNow = async () => {
    try {
      setLoading(true);
      const data = await addToCartApi(product.id, quantity);

      if (data.result && data.cart && data.cart.length > 0) {
        const cartItem = data.cart.find(
          (c: any) => c.product_id === product.id,
        );
        if (!cartItem) throw new Error("Cart item not found");

        dispatch(
          addItem({
            cart_id: cartItem.id,
            id: product.id,
            title: product.name,
            slug: product.slug,
            newPrice: discountedPrice,
            image: getCartImageUrl(product.thumbnail?.file_name),
            quantity: cartItem.quantity,
            oldPrice: product.unit_price,
            status: product.current_stock > 0 ? "In Stock" : "Out Of Stock",
          }),
        );

        setQuantity(1);

        router.push("/checkout");
      }
    } catch (error: any) {
      showErrorToast(error.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const description = (product as any)?.short_description || "";

  const isInStock = product.current_stock > 0;

  return (
    <div className="bb-single-pro">
      <Row>
        {/* ── LEFT: Slider ── */}
        <Col sm={12} lg={5} className="col-12 mb-24">
          <SingleProductSlider
            product={{
              ...product,
              image: getCartImageUrl(product.thumbnail?.file_name),
              thumbnail: {
                file_name: getCartImageUrl(product.thumbnail?.file_name),
              },
            }}
          />
        </Col>

        {/* ── RIGHT: Details ── */}
        <Col lg={7} className="col-12 mb-24">
          <div className="bb-single-pro-contact" style={styles.contact}>
            {/* Product Name */}
            <div className="bb-sub-title" style={styles.titleWrap}>
              <h4 style={styles.title}>{product.name}</h4>
            </div>

            {/* Description */}
            {description ? (
              <div
                style={styles.short_description}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p
                style={{
                  ...styles.short_description,
                  color: "#aaa",
                  fontStyle: "italic",
                }}
              >
                No description available.
              </p>
            )}

            {/* Divider */}
            <div style={styles.divider} />

            {/* Pricing */}
            <div style={styles.priceBox}>
              <span style={styles.currentPrice}>
                BDT {discountedPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span style={styles.oldPrice}>
                    BDT {product.unit_price.toFixed(2)}
                  </span>
                  <span style={styles.discountTag}>
                    -{discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <div style={styles.divider} />

            {/* Quantity + Add to Cart */}
            <div className="bb-single-qty" style={styles.qtyRow}>
              {/* Quantity Control */}
              <div style={styles.qtyControl}>
                <button
                  onClick={handleDecrement}
                  style={styles.qtyBtn}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span style={styles.qtyValue}>{quantity}</span>
                <button
                  onClick={handleIncrement}
                  style={styles.qtyBtn}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={loading || !isInStock}
                style={styles.cartBtn(loading || !isInStock)}
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={loading || !isInStock}
                style={styles.cartBtn(loading || !isInStock)}
              >
                Buy Now
              </button>
            </div>

            {product.tags && (
              <div style={styles.tags}>
                <h6>Tags:</h6>
                {product.tags.split(",").map((tag: string, index: number) => (
                  <span key={index} style={styles.tag}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

/* ─── Inline Styles ─────────────────────────────────────────── */
const styles: Record<string, any> = {
  contact: {
    padding: "8px 0",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "12px",
  },

  tag: {
    background: "#ACE2F7",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    color: "#555",
  },
  titleWrap: {
    marginBottom: "10px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#222",
    lineHeight: 1.3,
    margin: 0,
  },
  stockBadge: (inStock: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "14px",
    backgroundColor: inStock ? "#e8f7f4" : "#fdecea",
    color: inStock ? "#42A590" : "#e53935",
    border: `1px solid ${inStock ? "#42A590" : "#e53935"}`,
  }),
  stockDot: (inStock: boolean): React.CSSProperties => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: inStock ? "#42A590" : "#e53935",
    display: "inline-block",
  }),
  description: {
    fontSize: "14px",
    color: "#555",
    lineHeight: 1.7,
    marginBottom: "16px",
  },
  divider: {
    borderTop: "1px solid #f0f0f0",
    marginBottom: "16px",
  },
  priceBox: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "10px",
    marginBottom: "10px",
  },
  currentPrice: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#42A590",
  },
  oldPrice: {
    fontSize: "16px",
    color: "#aaa",
    textDecoration: "line-through",
  },
  discountTag: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: "#e53935",
    padding: "2px 8px",
    borderRadius: "12px",
  },
  meta: {
    fontSize: "13px",
    color: "#888",
    marginBottom: "0",
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "14px",
    marginBottom: "12px",
  },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
  },
  qtyBtn: {
    width: "38px",
    height: "42px",
    border: "none",
    background: "#f5f5f5",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
    lineHeight: 1,
  },
  qtyValue: {
    minWidth: "44px",
    textAlign: "center" as const,
    fontSize: "16px",
    fontWeight: 600,
    color: "#222",
  },
  cartBtn: (disabled: boolean): React.CSSProperties => ({
    padding: "0 28px",
    height: "42px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: disabled ? "#b0b0b0" : "#42A590",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.2s ease",
    flexShrink: 0,
  }),
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  } as React.CSSProperties,
  total: {
    fontSize: "14px",
    color: "#555",
    marginTop: "2px",
  },
};

export default ProductsDetails;
