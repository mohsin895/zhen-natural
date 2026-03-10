"use client";
import { RootState } from "@/store";
import { addItem, updateQuantity } from "@/store/reducer/cartSlice";
import { addCompare } from "@/store/reducer/compareSlice";
import { addWishlist } from "@/store/reducer/wishlistSlice";
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

  const openItemModal = () => setIsModalOpen(true);
  const closeItemModal = () => setIsModalOpen(false);

  const isOutOfStock = data.current_stock === 0 || data.current_stock < 1;
  const isLowStock = data.current_stock > 0 && data.current_stock <= 10;

  const handleCart = (data: Item) => {
    if (isOutOfStock) {
      showErrorToast("Product is out of stock");
      return;
    }

    const isItemInCart = cartSlice?.some((item: Item) => item.id === data.id);

    if (!isItemInCart) {
      dispatch(addItem({ ...data, quantity: 1 }));
      showSuccessToast("Item added to cart");
    } else {
      const cartItem = cartSlice.find((item: Item) => item.id === data.id);
      const currentQuantityInCart = cartItem?.quantity || 0;

      if (currentQuantityInCart + 1 > (data.current_stock ?? Infinity)) {
        showErrorToast(
          `Only ${data.current_stock ?? 0} items available in stock`,
        );
        return;
      }

      dispatch(
        updateQuantity({ id: data.id, quantity: currentQuantityInCart + 1 }),
      );
      showSuccessToast("Item quantity increased in cart");
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

          <div
            className="inner-img"
            style={isOutOfStock ? { filter: "grayscale(60%)" } : {}}
          >
            <img className="main-img" src={data.image} alt={data.title} />
            <img className="hover-img" src={data.imageTwo} alt={data.title} />
          </div>

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
              <Link
                href={`/details/${data.slug}`}
                title={isOutOfStock ? "Out of Stock" : "Add To Cart"}
                style={{
                  pointerEvents: isOutOfStock ? "none" : "auto",
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  opacity: isOutOfStock ? 0.5 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <i className="ri-shopping-bag-4-line"></i>
              </Link>
            </li>
          </ul>
        </div>

        <div className="bb-pro-contact">
          <h4 className="bb-pro-title">
            <Link href={`/details/${data.slug}`}>{data.title}</Link>
          </h4>
          <div className="bb-price">
            <div className="inner-price">
              <span className="new-price">{data.newPrice}</span>
              <span
                className={`${data.oldPrice && data.oldPrice !== data.newPrice ? "old-price" : "item-left"}`}
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
