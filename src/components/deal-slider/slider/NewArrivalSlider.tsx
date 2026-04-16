"use client";

import ProductItemCard from "@/components/item/ProductItemCard";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/products/new-arrival`;

interface SliderProps {
  hasPaginate?: boolean;
}

const NewArrivalSlider: React.FC<SliderProps> = ({ hasPaginate = false }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");

        const result = await res.json();

        // Access result.data since your API returns { data: [...] }
        setProducts(hasPaginate ? result.data : result.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [hasPaginate]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;
  if (!products.length) return <div>No products found</div>;

  return (
    <div className="col-12">
      <Fade triggerOnce duration={1000} delay={200} direction="up">
        <Swiper
          loop
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[Autoplay]}
          slidesPerView={4}
          breakpoints={{
            0: { slidesPerView: 1 },
            481: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          className="bb-deal-slider"
        >
          {products.map((item: any, index: number) => (
            <SwiperSlide className="bb-deal-card" key={index}>
              <ProductItemCard
                data={{
                  id: item.id,
                  title: item.name,
                  slug: item.slug,
                  newPrice: item.main_price,
                  oldPrice: item.stroked_price,
                  rating: item.rating,
                  weight: "",
                  image: item.thumbnail_image,
                  imageTwo: item.thumbnail_image,
                  category: item.category || "Uncategorized",
                  quantity: 1,
                  date: "",
                  status: "",
                  location: "",
                  brand: "",
                  sku: 0,
                  sale: item.has_discount ? "Sale" : "",
                  itemLeft: "",
                  description: item.short_description || "",
                  current_stock: item.current_stock || 0,
                  has_discount: item.has_discount || false,
                  discount: item.discount || 0,
                  discount_type: item.discount_type || "amount",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Fade>
    </div>
  );
};

export default NewArrivalSlider;
