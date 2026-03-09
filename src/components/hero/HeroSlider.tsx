"use client"

import React, { useEffect, useState } from 'react'
import { Navigation, Pagination, EffectFade, Autoplay, Parallax } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import NewsletterModal from '../modal/NewsletterModal'
import { Col, Row } from 'react-bootstrap'
import ScrollPage from '../scroll-page/ScrollPage'
import HeroImage from './HeroImage'
import Link from 'next/link'

// ✅ Type for slider item
interface Slider {
    photo: string
    url: string | null
}

const HeroSlider: React.FC = () => {
    const [sliders, setSliders] = useState<Slider[]>([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/sliders`)
            .then(res => res.json())
            .then(res => {
                if (res.success && Array.isArray(res.data)) {
                    setSliders(res.data)
                }
            })
            .catch(err => console.error('Slider fetch error:', err))
    }, [])

    return (
        <>
            {/*<NewsletterModal />*/}

            <section className="section-hero margin-b-50">
                <div className="container">
                    <Row>
                        <div className="col-12">
                            <div className="hero-slider swiper-container">
                                <Swiper
                                    pagination={{ clickable: true }}
                                    navigation={{
                                        nextEl: ".swiper-button-next",
                                        prevEl: ".swiper-button-prev",
                                    }}
                                    modules={[
                                        Pagination,
                                        Navigation,
                                        EffectFade,
                                        Autoplay,
                                        Parallax,
                                    ]}
                                    loop
                                    centeredSlides
                                    speed={1000}
                                    parallax
                                    autoplay={{ delay: 5000 }}
                                    effect="fade"
                                    slidesPerView={1}
                                >
                                    {sliders.map((slider, index) => {
                                        const SlideContent = (
                                            <Row className="mb-minus-24">
                                                <Col lg={12} className="col-12 mb-24">
                                                    <HeroImage
                                                        src={slider.photo}
                                                        alt="hero"
                                                    />
                                                </Col>
                                            </Row>
                                        )

                                        return (
                                            <SwiperSlide
                                                key={index}
                                                className={`swiper-slide slide-${index + 1}`}
                                            >
                                                {slider.url ? (
                                                    <Link href={slider.url}>
                                                        {SlideContent}
                                                    </Link>
                                                ) : (
                                                    SlideContent
                                                )}
                                            </SwiperSlide>
                                        )
                                    })}

                                    <div className="swiper-buttons">
                                        <div className="swiper-button-next"></div>
                                        <div className="swiper-button-prev"></div>
                                    </div>
                                </Swiper>
                            </div>
                        </div>
                    </Row>
                </div>

                <ScrollPage />
            </section>
        </>
    )
}

export default HeroSlider
