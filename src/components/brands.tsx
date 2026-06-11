"use client";

import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Brand {
  id: number;
  name: string;
  logo?: string | null;
  image?: string | null;
  icon?: string | null;
}

interface BrandsProps {
  onSuccess?: () => void;
  onError?: () => void;
  hasPaginate?: boolean;
}

const Brands: React.FC<BrandsProps> = ({
  onSuccess = () => {},
  onError = () => {},
  hasPaginate = false,
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;
  const IMAGE_BASE = process.env.NEXT_PUBLIC_PATH; // <-- use this for image base URL

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${API_BASE}/all-brands`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch brands");
        const result = await res.json();
        setBrands(result?.data || []);
        onSuccess();
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        onError();
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [API_BASE, onError, onSuccess]);

  const settings = {
    spaceBetween: 24,
    loop: true,
    speed: 3000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    allowTouchMove: true,
    breakpoints: {
      0: { slidesPerView: 1 },
      321: { slidesPerView: 2 },
      421: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      992: { slidesPerView: 5 },
      1400: { slidesPerView: 6 },
    },
  };

  // if (error) return <div>Failed to load brands: {error}</div>;
  // if (loading) return <div>Loading brands...</div>;

  return (
    <section className="section-instagram padding-tb-50">
      <div className="container">
        <Row>
          <div className="col-12">
            <div className="category-title my-3">
              <h2
                style={{
                  background:
                    "linear-gradient(to right, #0ed7ff 8%, #82bc23 14%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "38px",
                }}
              >
                Explore Brands
              </h2>
            </div>

            <Swiper
              {...settings}
              modules={[Autoplay]}
              className="bb-instagram-slider"
            >
              {brands.length > 0 ? (
                brands.map((brand, index) => (
                  <SwiperSlide key={brand.id || index}>
                    <div className="bb-instagram-card">
                      <div className="instagram-img">
                        <a
                          onClick={(e) => e.preventDefault()}
                          href="#"
                          title={brand.name}
                        >
                          <img
                            src={brand.icon || ""}
                            alt={brand.name || `brand-${index + 1}`}
                          />
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div>No brands available</div>
              )}
            </Swiper>
          </div>
        </Row>
      </div>
    </section>
  );
};

export default Brands;
