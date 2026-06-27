"use client";
import { addToCartApi } from "@/api/cart";
import { RootState } from "@/store";
import { addItem, updateQuantity } from "@/store/reducer/cartSlice";
import { addCompare } from "@/store/reducer/compareSlice";
import { addWishlist } from "@/store/reducer/wishlistSlice";
import { getCartImageUrl } from "@/utility/imageHelper";
import { fbEvent } from "@/lib/fpixel";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemModal from "../modal/ItemModal";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";

interface Item {
    id: number;
    title: string;
    newPrice: number;
    weight: string;
    slug: string;
    image: string;
    imageTwo: string;
    date: string;
    status: string;
    rating: number;
    oldPrice: number;
    location: string;
    brand: string;
    sku: number;
    category: string;
    quantity: number;
    description?: string;
    current_stock?: number;
    has_discount?: boolean;
    discount?: number;
    discount_type?: string;
    sale?: string;
}

const ProductItemCard = ({ data }: any) => {
    // console.log("ProductItemCard data:", data);
    // console.log("ProductItemCard data.image:", data.image);
    const dispatch = useDispatch();
    const cartSlice = useSelector((state: RootState) => state.cart?.items);
    const wishlistItem = useSelector(
        (state: RootState) => state.wishlist?.wishlist,
    );
    const compareItems = useSelector(
        (state: RootState) => state.compare?.compare,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const openItemModal = () => setIsModalOpen(true);
    const closeItemModal = () => setIsModalOpen(false);

    const isOutOfStock = data.current_stock === 0 || data.current_stock < 1;
    const isLowStock = data.current_stock > 0 && data.current_stock <= 10;

    const handleCart = async (data: Item) => {
        if (isOutOfStock) {
            showErrorToast("Product is out of stock");
            return;
        }

        const isItemInCart = cartSlice?.some((item: Item) => item.id === data.id);

        // Fast client-side guard — server response remains the source of truth
        if (isItemInCart) {
            const cartItem = cartSlice.find((item: Item) => item.id === data.id);
            const currentQuantityInCart = cartItem?.quantity || 0;

            if (currentQuantityInCart + 1 > (data.current_stock ?? Infinity)) {
                showErrorToast(
                    `Only ${data.current_stock ?? 0} items available in stock`,
                );
                return;
            }
        }

        try {
            setCartLoading(true);
            const response = await addToCartApi(data.id, 1);

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
                    newPrice: data.newPrice,
                    weight: data.weight,
                    image: getCartImageUrl(data.image),
                    imageTwo: getCartImageUrl(data.imageTwo),
                    date: data.date,
                    status: data.status,
                    rating: data.rating,
                    oldPrice: data.oldPrice,
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
                value: data.newPrice,
                currency: "BDT",
                contents: [
                    {
                        id: data.id,
                        quantity: 1,
                    },
                ],
            });

            showSuccessToast(
                isItemInCart ? "Item quantity increased in cart" : "Item added to cart",
            );
        } catch (error: any) {
            showErrorToast(error.message || "Failed to add to cart");
            console.error(error);
        } finally {
            setCartLoading(false);
        }
    };

    const handleWishlist = (data: Item) => {
        const isItemInWishlist = wishlistItem.some((item) => item.id === data.id);
        if (!isItemInWishlist) {
            dispatch(addWishlist(data));
            showSuccessToast("Item added to wishlist");
        } else {
            showErrorToast("Item already in wishlist");
        }
    };

    const handleCompareItem = (data: Item) => {
        const isItemInCompare = compareItems.some((item) => item.id === data.id);
        if (!isItemInCompare) {
            dispatch(addCompare(data));
            showSuccessToast("Item added to compare list");
        } else {
            showErrorToast("Item already in compare list");
        }
    };

    const getDiscountLabel = () => {
        if (data.has_discount && data.discount) {
            if (data.discount_type === "amount") return `৳${data.discount} OFF`;
            if (data.discount_type === "percent") return `${data.discount}% OFF`;
            return `${data.discount} OFF`;
        }
        return data.sale || "";
    };

    return (
        <>
            <div
                className={`bb-pro-box ${isOutOfStock ? "out-of-stock" : ""}`}
                style={isOutOfStock ? { pointerEvents: "none", opacity: 0.6 } : {}}
            >
                <div className="bb-pro-img">
                    {isOutOfStock ? (
                        <span
                            className="flags out-of-stock-badge"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 10,
                                backgroundColor: "#e53935",
                                color: "#fff",
                                padding: "8px 18px",
                                borderRadius: "4px",
                                fontWeight: 700,
                                fontSize: "14px",
                                letterSpacing: "0.5px",
                                whiteSpace: "nowrap",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                                pointerEvents: "none",
                            }}
                        >
              Out of Stock
            </span>
                    ) : data.has_discount || data.sale ? (
                        <span className="flags"></span>
                    ) : null}

                    <Link href={`/details/${data.slug}`}>
                        <div
                            className="inner-img h-[220px] overflow-hidden"
                            style={isOutOfStock ? { filter: "grayscale(60%)" } : {}}
                        >
                            <img
                                className="w-full h-[260px] object-cover"
                                style={{ height: "260px" }}
                                src={data.image}
                                alt={data.title}
                            />
                            <img
                                className="hover-img w-full h-[260px] object-cover"
                                src={data.imageTwo}
                                alt={data.title}
                            />
                        </div>
                    </Link>

                    {isOutOfStock && (
                        <div
                            className="out-of-stock-overlay"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(255, 255, 255, 0.45)",
                                zIndex: 9,
                                borderRadius: "inherit",
                                pointerEvents: "none",
                            }}
                        />
                    )}

                    <ul className="bb-pro-actions">
                        <li className="bb-btn-group">
                            <a onClick={() => handleWishlist(data)} title="Wishlist">
                                <i className="ri-heart-line"></i>
                            </a>
                        </li>
                        <li className="bb-btn-group">
                            <a
                                onClick={openItemModal}
                                data-link-action="quickview"
                                title="Quick View"
                                data-bs-toggle="modal"
                                data-bs-target="#bry_quickview_modal"
                            >
                                <i className="ri-eye-line"></i>
                            </a>
                        </li>
                        <li className="bb-btn-group">
                            <a
                                onClick={() => !cartLoading && handleCart(data)}
                                title={isOutOfStock ? "Out of Stock" : "Add To Cart"}
                                style={{
                                    pointerEvents: isOutOfStock || cartLoading ? "none" : "auto",
                                    cursor:
                                        isOutOfStock || cartLoading ? "not-allowed" : "pointer",
                                    opacity: isOutOfStock || cartLoading ? 0.5 : 1,
                                    display: "inline-flex",
                                    alignItems: "center",
                                }}
                            >
                                <i className="ri-shopping-bag-4-line"></i>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="bb-pro-contact">
                    <h4 className="text-base text-black mb-2">
                        <Link href={`/details/${data.slug}`}>{data.title}</Link>
                    </h4>
                    <div className="bb-price">
                        <div className="inner-price">
                            <span className="new-price">{data.newPrice}</span>
                            <span
                                style={{ color: "red", fontWeight: 700 }}
                                className={` ${data.oldPrice && data.oldPrice !== data.newPrice ? "old-price" : "item-left"}`}
                            >
                {data.oldPrice && data.oldPrice !== data.newPrice
                    ? data.oldPrice
                    : data.itemLeft}
              </span>
                            {isOutOfStock ? (
                                <span className="flags out-of-stock-badge"></span>
                            ) : data.has_discount || data.sale ? (
                                <span className="flags">
                  <span>{getDiscountLabel()}</span>
                </span>
                            ) : null}
                        </div>
                        <span className="last-items">
              {data.weight}
                            {isLowStock && !isOutOfStock && (
                                <span
                                    className="low-stock-badge"
                                    style={{
                                        color: "#ff6b6b",
                                        marginLeft: "5px",
                                        fontSize: "12px",
                                    }}
                                >
                  • Only {data.current_stock} left
                </span>
                            )}
            </span>
                    </div>
                </div>
            </div>
            <ItemModal
                data={{
                    ...data,
                    image: data.image || " ",
                    description: data.description,
                    current_stock: data.current_stock,
                }}
                isModalOpen={isModalOpen}
                closeItemModal={closeItemModal}
            />
        </>
    );
};

export default ProductItemCard;