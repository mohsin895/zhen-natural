"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Row } from "react-bootstrap";
import useSWR from "swr";
import fetcher from "../fetcher/Fetcher";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Blog {
    id: number;
    title: string;
    slug: string;
    banner: string;
    name?: string;
    date?: string;
}

interface BlogSliderProps {
    hasPaginate?: boolean;
}

const BlogSlider: React.FC<BlogSliderProps> = ({ hasPaginate = false }) => {
    const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;
    const IMAGE_BASE = process.env.NEXT_PUBLIC_PATH;

    const { data, error } = useSWR(`${API_BASE}/blog-list`, fetcher);

    useEffect(() => {
        if (typeof window !== "undefined") {
            AOS.init({ once: true });
        }
    }, []);

    if (error) return <div>Failed to load blogs</div>;
    if (!data) return <div>Loading blogs...</div>;

    const blogs: Blog[] = data.blogs.data;

    const settings = {
        modules: [Navigation, Pagination, Autoplay],
        spaceBetween: 20,
        loop: true,
        navigation: false,
        pagination: false,
        autoplay: false,
        speed: 500,
        breakpoints: {
            0: { slidesPerView: 1 },
            421: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
        },
    };

    return (
        <>
            <style>{`
                .section-blog {
                    padding-top: 100px;
                    padding-bottom: 50px;
                    background: #fff;
                }

                .blog-2-card {
                    background: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                }

                .blog-2-card:hover {
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.14);
                    transform: translateY(-4px);
                }

                .blog-img {
                    width: 100%;
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                    background: #f0f0f0;
                    position: relative;
                }

                .blog-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.4s ease;
                }

                .blog-2-card:hover .blog-img img {
                    transform: scale(1.05);
                }

                .blog-contact {
                    padding: 16px 18px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .blog-contact span {
                    font-size: 13px;
                    color: #888;
                    font-family: 'Georgia', serif;
                    font-style: italic;
                    letter-spacing: 0.01em;
                }

                .blog-contact h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 1.4;
                    color: #1a1a1a;
                    font-family: 'Georgia', serif;
                }

                .blog-contact h4 a {
                    color: inherit;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .blog-contact h4 a:hover {
                    color: #3a7d44;
                }

                .blog-2-slider .swiper-slide {
                    height: auto;
                }
            `}</style>

            <section className="section-blog">
                <div className="container">
                    <Row>
                        <div className="col-12">
                            <Swiper {...settings} className="blog-2-slider">
                                {blogs.map((blog) => (
                                    <SwiperSlide key={blog.id}>
                                        <div
                                            className="blog-2-card"
                                            data-aos="fade-up"
                                            data-aos-duration="800"
                                            data-aos-delay="100"
                                        >
                                            <div className="blog-img">
                                                <img
                                                    src={blog.banner ? blog.banner : "/placeholder.png"}
                                                    alt={blog.title}
                                                />
                                            </div>
                                            <div className="blog-contact">
                                                <span>{blog.date || "Unknown date"}</span>
                                                <h4>
                                                    <Link href={`/blog-detail-left-sidebar/${blog.slug}`}>
                                                        {blog.title}
                                                    </Link>
                                                </h4>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </Row>
                </div>
            </section>
        </>
    );
};

export default BlogSlider;