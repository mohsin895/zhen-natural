import ItemModal from '@/components/modal/ItemModal';
import StarRating from '@/components/stars/StarRating';
import { showErrorToast, showSuccessToast } from '@/components/toast-popup/Toastify';
import { RootState } from '@/store';
import { addItem, updateQuantity } from '@/store/reducer/cartSlice';
import { addCompare } from '@/store/reducer/compareSlice';
import { addWishlist, removeWishlist } from '@/store/reducer/wishlistSlice';
import Link from 'next/link';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

interface Item {
    id: number;
    title: string;
    slug: string;
    newPrice: number;
    weight: string;
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
    sale?: string;
    itemLeft?: string;
}

interface WishlistItemCardProps {
    data: Item;
}

const WishlistItemCard = ({ data }: WishlistItemCardProps) => {
    const dispatch = useDispatch()
    const cartSlice = useSelector((state: RootState) => state.cart?.items);
    const wishlistItem = useSelector((state: RootState) => state.wishlist?.wishlist);
    const compareItems = useSelector((state: RootState) => state.compare?.compare)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRemoveWishlist = (id: number) => {
        dispatch(removeWishlist(id))
    }

    const openItemModal = () => setIsModalOpen(true)
    const closeItemModal = () => setIsModalOpen(false)

    const handleCart = (data: Item) => {
        const isItemInCart = cartSlice?.some((item) => item.id === data.id);

        if (!isItemInCart) {
            dispatch(addItem({ ...data, quantity: 1 }));
            showSuccessToast("Item added to cart item");
        } else {
            const existingItem = cartSlice?.find((item) => item.id === data.id);
            if (existingItem) {
                dispatch(updateQuantity({
                    id: data.id,
                    quantity: existingItem.quantity + 1,
                }));
                showSuccessToast("Item quantity increased in cart");
            }
        }
    };

    const handleWishlist = (data: Item) => {
        const isItemInWishlist = wishlistItem?.some(
            (item) => item.id === data.id
        );

        if (!isItemInWishlist) {
            dispatch(addWishlist(data));
            showSuccessToast("Item added to wishlist");
        } else {
            showErrorToast("Item already have to wishlist");
        }
    };

    const handleCompareItem = (data: Item) => {
        const isItemInCompare = compareItems?.some(
            (item) => item.id === data.id
        );

        if (!isItemInCompare) {
            dispatch(addCompare(data));
            showSuccessToast("Item added to compare list");
        } else {
            showErrorToast("Item already have to compare list");
        }
    };

    return (
        <>
            <div className="bb-pro-box">
                <div className="bb-pro-img">
                    <span className="bb-remove-wish">
                        <a onClick={() => handleRemoveWishlist(data.id)}>
                            <i className="ri-close-circle-fill"></i>
                        </a>
                    </span>

                    <span className="flags">
                        <span>{data.sale}</span>
                    </span>

                    <div className="inner-img">
                        <img className="main-img" src={data.image} alt="product-1" />
                        <img className="hover-img" src={data.imageTwo} alt="product-1" />
                    </div>

                    <ul className="bb-pro-actions">
                        <li className={`bb-btn-group ${wishlistItem ? "disabled" : ""}`}>
                            <a onClick={() => handleWishlist(data)}>
                                <i className="ri-heart-line"></i>
                            </a>
                        </li>

                        <li className="bb-btn-group">
                            <a
                                onClick={openItemModal}
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#bry_quickview_modal"
                            >
                                <i className="ri-eye-line"></i>
                            </a>
                        </li>

                        <li className="bb-btn-group">
                            <a onClick={() => handleCompareItem(data)}>
                                <i className="ri-repeat-line"></i>
                            </a>
                        </li>

                        <li className="bb-btn-group">
                            <a onClick={() => handleCart(data)}>
                                <i className="ri-shopping-bag-4-line"></i>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="bb-pro-contact">
                    <h4 className="bb-pro-title">
                        <Link href="/product-left-sidebar">
                            {data.title}
                        </Link>
                    </h4>

                    <div className="bb-price">
                        <div className="inner-price">
                            <span className="new-price">
                                ${data.newPrice}.00
                            </span>

                            <span className={`${data.oldPrice ? "old-price" : "item-left"}`}>
                                {data.oldPrice
                                    ? `$${data.oldPrice}`
                                    : data.itemLeft}
                            </span>
                        </div>

                        <span className="last-items">
                            {data.weight}
                        </span>
                    </div>
                </div>
            </div>

            <ItemModal
                data={data}
                isModalOpen={isModalOpen}
                closeItemModal={closeItemModal}
            />
        </>
    )
}

export default WishlistItemCard;