"use client";
import { setSelectedCategory } from "@/store/reducer/filterReducer";
import AOS from "aos";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import fetcher from "../fetcher/Fetcher";

const ShopCategorySlider = ({ onSuccess = () => {}, onError = () => {} }) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_DOMAIN}/filter/categories`,
    fetcher,
    {
      onSuccess,
      onError,
    },
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    dispatch(setSelectedCategory([slug]));
    router.push(`/shop-left-sidebar-col-3?category=${slug}`);
  };
  const settings = {
    modules: [Autoplay],
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    speed: 500,
    breakpoints: {
      0: { slidesPerView: 1 },
      421: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
      1200: { slidesPerView: 5 },
      1400: { slidesPerView: 6 },
    },
  };
  useEffect(() => {
    AOS.init();
  }, []);

  if (error) return <div>Failed to load products</div>;
  if (!data) return <div></div>;

  return (
    <section className="section-category padding-t-50 mb-24">
      <div className="container">
        <Row>
          <div className="col-12">
            <Swiper {...settings} className="bb-category-6-colum">
              {data?.data && data.data.length > 0 ? (
                data.data.map((each: any, index: number) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`bb-category-box category-items-${each.num}`}
                      data-aos="flip-left"
                      data-aos-duration="1000"
                      data-aos-delay="500"
                      onClick={() => handleCategoryClick(each.slug)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="category-image">
                        <img
                          src={`${process.env.NEXT_PUBLIC_PATH}/${each.image}`}
                          alt={each.name}
                          onError={(e: any) => {
                            e.currentTarget.src = " ";
                          }}
                        />
                      </div>
                      <div className="category-sub-contact">
                        <h5>
                          <Link href={`/category/${each.slug}`}>
                            {each.name}
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <></>
              )}
            </Swiper>
          </div>
        </Row>
      </div>
    </section>
  );
};

export default ShopCategorySlider;
