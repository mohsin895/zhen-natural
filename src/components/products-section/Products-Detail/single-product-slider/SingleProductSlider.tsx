import React, { useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ZoomProductImage from '../../zoom-product-img/ZoomProductImage';
import { ProductData } from '@/app/details/[slug]/page';

interface SingleProductSliderProps {
    product: ProductData;
}

const SingleProductSlider: React.FC<SingleProductSliderProps> = ({ product }) => {
    const [nav1, setNav1] = useState<Slider | null>(null);
    const [nav2, setNav2] = useState<Slider | null>(null);

    const basePath = process.env.NEXT_PUBLIC_PATH ?? '';

    const getImageUrl = (image: any): string => {
        if (!image) return `${basePath}/uploads/default-product.jpg`;
        if (typeof image === 'string') return `${basePath}/${image}`;
        if (image?.file_name) return `${basePath}/${image.file_name}`;
        if (image?.upload_path) return `${basePath}/${image.upload_path}`;
        return `${basePath}/uploads/default-product.jpg`;
    };

    // Build deduplicated list: thumbnail first, then photo_list
    const buildImageList = () => {
        const images: any[] = [];
        const seenIds = new Set<number>();

        if (product?.thumbnail) {
            images.push(product.thumbnail);

            const thumbId = product.thumbnail.id;
            if (typeof thumbId === "number") {
                seenIds.add(thumbId);
            }
        }

        if (product?.photo_list?.length) {
            for (const img of product.photo_list) {
                if (!seenIds.has(img.id)) {
                    images.push(img);
                    seenIds.add(img.id);
                }
            }
        }

        return images;
    };

    const productImages = buildImageList();

    if (!product || productImages.length === 0) {
        return <div>No images available</div>;
    }

    return (
        <div className="single-pro-slider">
            {/* ── Main Slider ── */}
            <Slider
                asNavFor={nav2 ?? undefined}
                ref={(slider) => setNav1(slider)}
                slidesToShow={1}
                slidesToScroll={1}
                arrows={false}
                fade={false}
                infinite={productImages.length > 1}
                swipe={productImages.length > 1}
                className="single-product-cover"
            >
                {productImages.map((image: any, index: number) => (
                    <div key={index} className="single-slide zoom-image-hover">
                        <ZoomProductImage
                            className="img-responsive"
                            src={getImageUrl(image)}
                            alt={`${product.name} - Image ${index + 1}`}
                        />
                    </div>
                ))}
            </Slider>

            {/* ── Thumbnail Nav — only render if more than 1 image ── */}
            {productImages.length > 1 && (
                <Slider
                    asNavFor={nav1 ?? undefined}
                    ref={(slider) => setNav2(slider)}
                    slidesToShow={Math.min(4, productImages.length)}
                    slidesToScroll={1}
                    dots={false}
                    arrows={productImages.length > 4}
                    focusOnSelect={true}
                    swipeToSlide={true}
                    infinite={productImages.length > 1}
                    className="single-nav-thumb"
                    responsive={[
                        {
                            breakpoint: 768,
                            settings: { slidesToShow: Math.min(3, productImages.length) }
                        },
                        {
                            breakpoint: 480,
                            settings: { slidesToShow: Math.min(2, productImages.length) }
                        }
                    ]}
                >
                    {productImages.map((image: any, index: number) => (
                        <div key={index} className="single-slide">
                            <img
                                className="img-responsive"
                                src={getImageUrl(image)}
                                alt={`${product.name} - Thumbnail ${index + 1}`}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
}

export default SingleProductSlider;