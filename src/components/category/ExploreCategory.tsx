"use client";

import { setSelectedCategory } from "@/store/reducer/filterReducer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useSWR from "swr";

import AOS from "aos";
import "aos/dist/aos.css";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ExploreCategory = ({ onSuccess = () => {}, onError = () => {} }) => {
  const API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/filter/categories`;
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, error, isLoading } = useSWR(API_URL, fetcher, {
    onSuccess,
    onError,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({ once: true });
    }
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    dispatch(setSelectedCategory([categorySlug]));
    router.push(`/shop-left-sidebar-col-3?category=${categorySlug}`);
  };

  const settings = {
    spaceBetween: 24,
    breakpoints: {
      0: { slidesPerView: 2 },
      421: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1200: { slidesPerView: 6 },
    },
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load categories</div>;

  return (
    <>
      <style>{`
        .bb-category-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 8px;
          transition: transform 0.3s ease;
        }

        .bb-category-circle:hover {
          transform: translateY(-6px);
        }

        .circle-image-wrapper {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;
           border: 1px solid #cdc8c8;
          background-clip: padding-box;
          box-shadow: 0 4px 15px rgba(14, 215, 255, 0.2);
          position: relative;
          transition: box-shadow 0.3s ease, border 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bb-category-circle:hover .circle-image-wrapper {
          box-shadow: 0 6px 25px rgba(130, 188, 35, 0.35);
          border: 1px solid #cdc8c8;
        }

        .circle-image-wrapper::before {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: #fff;
          z-index: -1;
        }

        .circle-image-wrapper img {
          width: 75%;
          height: 75%;
          object-fit: contain;
        }

        .circle-label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }

        .bb-category-circle:hover .circle-label {
          background: linear-gradient(to right, #0ed7ff, #82bc23);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <section className="section-category padding-tb-50">
        <div className="container">
          <Row>
            <Col lg={12}>
              <div className="bb-category-contact">
                <div className="category-title">
                  <h2
                    style={{
                      background:
                        "linear-gradient(to right, #0ed7ff 8%, #82bc23 14%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "48px",
                    }}
                  >
                    Explore Categories
                  </h2>
                </div>

                <Swiper {...settings} className="bb-category-block">
                  {Array.isArray(data?.data) &&
                    data.data.map((item: any, index: number) => (
                      <SwiperSlide key={index}>
                        <div
                          className="bb-category-circle"
                          data-aos="zoom-in"
                          data-aos-delay={index * 50}
                          onClick={() => handleCategoryClick(item.slug)}
                        >
                          <div className="circle-image-wrapper">
                            <img
                              src={item.icon}
                              alt={item.name}
                              onError={(e: any) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = " ";
                              }}
                            />
                          </div>
                          <span className="circle-label">{item.name}</span>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default ExploreCategory;
