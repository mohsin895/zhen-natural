"use client";
import { addToCartApi } from "@/api/cart";
import { RootState } from "@/store";
import { addItem } from "@/store/reducer/cartSlice";
import { getCartImageUrl } from "@/utility/imageHelper";
import { fbEvent } from "@/lib/fpixel";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";

interface Item {
    id: number;
    title: string;
    newPrice: number | string;
    weight: string;
    image: string;
    imageTwo: string;
    date: string;
    status: string;
    rating: number;
    oldPrice: number | string;
    location: string;
    brand: string;
    sku: number;
    category: string;
    quantity: number;
    slug: string;
    description?: string;
    cart_id?: number;
    current_stock?: number;
}

interface ItemModalProps {
    closeItemModal: () => void;
    isModalOpen: boolean;
    data: Item;
}

const ItemModal = ({ closeItemModal, isModalOpen, data }: ItemModalProps) => {
    const cartSlice = useSelector((state: RootState) => state.cart?.items);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    //    Safe price parsing
    const parsePrice = (price: any): number => {
        if (!price) return 0;
        const parsed = parseFloat(String(price).replace(/[^0-9.]/g, ""));
        return isNaN(parsed) ? 0 : parsed;
    };

    const discountedPrice = parsePrice(data.newPrice);
    const oldPrice = parsePrice(data.oldPrice);
    const isOutOfStock = !data.current_stock || data.current_stock === 0;
    const isLowStock =
        data.current_stock && data.current_stock > 0 && data.current_stock <= 10;

    const handleCart = async (data: Item) => {
        try {
            setLoading(true);
            const response = await addToCartApi(data.id, quantity);

            //    Handle both array and single object response
            let cartItem = response.cart;
            if (Array.isArray(cartItem)) {
                cartItem = cartItem.find((c: any) => c.product_id === data.id);
            }

            if (!cartItem) throw new Error("Cart item not found");

            dispatch(
                addItem({
                    cart_id: cartItem.id,
                    id: cartItem.product_id,
                    quantity: cartItem.quantity,
                    title: data.title,
                    slug: data.slug,
                    newPrice: discountedPrice,
                    weight: data.weight,
                    image: data.image,
                    imageTwo: data.imageTwo,
                    date: data.date,
                    status: data.status,
                    rating: data.rating,
                    oldPrice: oldPrice,
                    location: data.location,
                    brand: data.brand,
                    sku: data.sku,
                    category: data.category,
                }),
            );

            // FB Pixel: AddToCart
            fbEvent("AddToCart", {
                content_ids: [data.id],
                content_name: data.title,
                content_type: "product",
                value: discountedPrice * quantity,
                currency: "BDT",
                contents: [
                    {
                        id: data.id,
                        quantity: quantity,
                    },
                ],
            });

            showSuccessToast("Item added to cart");
            setQuantity(1); // ← Reset quantity
            closeItemModal(); // ← Close modal
        } catch (error: any) {
            showErrorToast(error.message || "Failed to add to cart");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const cartItem = cartSlice.find((item: Item) => item.id === data.id);

    //    Calculate discount percentage
    const discountPercent =
        oldPrice > 0 && discountedPrice > 0
            ? Math.round(((oldPrice - discountedPrice) / oldPrice) * 100)
            : 0;

    return (
        <Modal
            show={isModalOpen}
            onHide={closeItemModal}
            centered
            keyboard={false}
            className="modal fade quickview-modal"
            id="bry_quickview_modal"
            tabIndex={-1}
            role="dialog"
        >
            <Modal.Header closeButton>
                {/* <Modal.Title>{data.title}</Modal.Title> */}
            </Modal.Header>

            <Modal.Body>
                <Row className="mb-minus-24">
                    {/* LEFT: Product Image */}
                    <Col xs={12} sm={12} md={5} className="mb-24">
                        <div className="quickview-pro-img">
                            <img
                                src={getCartImageUrl(data.image)}
                                alt={data.title}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = " ";
                                }}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "8px",
                                    objectFit: "cover",
                                }}
                            />

                            {/*     Stock Status Badge */}
                            {isOutOfStock && (
                                <div
                                    style={{
                                        marginTop: "8px",
                                        padding: "8px 12px",
                                        backgroundColor: "#e53935",
                                        color: "#fff",
                                        borderRadius: "6px",
                                        textAlign: "center",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Out of Stock
                                </div>
                            )}
                            {isLowStock && !isOutOfStock && (
                                <div
                                    style={{
                                        marginTop: "8px",
                                        padding: "8px 12px",
                                        backgroundColor: "#ff9800",
                                        color: "#fff",
                                        borderRadius: "6px",
                                        textAlign: "center",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Only {data.current_stock} left in stock
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* RIGHT: Product Content */}
                    <Col xs={12} sm={12} md={7} className="mb-24">
                        <div className="quickview-pro-content">
                            {/* Product Title */}
                            <h5
                                style={{
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    marginBottom: "12px",
                                }}
                            >
                                {data.title}
                            </h5>

                            {/*     Product Description - নতুন যোগ হয়েছে */}
                            {data.description && (
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#666",
                                        marginBottom: "12px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {data.description}
                                </p>
                            )}

                            {/*    Price Display */}
                            <div
                                className="bb-quickview-price"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    marginBottom: "16px",
                                    flexWrap: "wrap",
                                }}
                            >
                <span
                    className="new-price"
                    style={{
                        fontSize: "26px",
                        fontWeight: 700,
                        color: "#42A590",
                    }}
                >
                  BDT {discountedPrice.toFixed(2)}
                </span>

                                {oldPrice > 0 && oldPrice !== discountedPrice && (
                                    <>
                    <span
                        className="old-price"
                        style={{
                            fontSize: "16px",
                            color: "#aaa",
                            textDecoration: "line-through",
                        }}
                    >
                      BDT {oldPrice.toFixed(2)}
                    </span>
                                        {discountPercent > 0 && (
                                            <span
                                                style={{
                                                    fontSize: "13px",
                                                    fontWeight: 600,
                                                    color: "#fff",
                                                    backgroundColor: "#e53935",
                                                    padding: "2px 8px",
                                                    borderRadius: "12px",
                                                }}
                                            >
                        -{discountPercent}% OFF
                      </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Divider */}
                            <div
                                style={{ borderTop: "1px solid #f0f0f0", marginBottom: "16px" }}
                            />

                            {/* Quantity Selector */}
                            <div
                                className="bb-quickview-qty"
                                style={{ marginBottom: "16px" }}
                            >
                                <label
                                    style={{
                                        fontSize: "13px",
                                        color: "#555",
                                        marginBottom: "8px",
                                        display: "block",
                                    }}
                                >
                                    Quantity:
                                </label>
                                <div
                                    className="qty-plus-minus"
                                    style={{ marginBottom: "12px" }}
                                >
                                    <QuantitySelector
                                        id={data.id}
                                        cart_id={cartItem?.cart_id}
                                        quantity={quantity}
                                        onQuantityChange={(newQty) => setQuantity(newQty)}
                                        max={data.current_stock || 0}
                                    />
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleCart(data)}
                                disabled={loading || isOutOfStock}
                                style={{
                                    width: "100%",
                                    padding: "10px 18px",
                                    backgroundColor:
                                        isOutOfStock || loading ? "#b0b0b0" : "#42A590",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    cursor: loading || isOutOfStock ? "not-allowed" : "pointer",
                                    opacity: loading || isOutOfStock ? 0.7 : 1,
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                }}
                            >
                                {loading ? (
                                    <>
                    <span
                        style={{
                            display: "inline-block",
                            width: "14px",
                            height: "14px",
                            border: "2px solid rgba(255,255,255,0.4)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                        }}
                    />
                                        Adding...
                                    </>
                                ) : isOutOfStock ? (
                                    "Out of Stock"
                                ) : (
                                    <>Add To Cart</>
                                )}
                            </button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default ItemModal;