"use client"
import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Container, Row, Col } from 'react-bootstrap'
import Image from 'next/image'

const TopVendor = () => {
    // Retail partner logos - replace these paths with your actual logo image paths
    const retailers = [
        { name: 'Unimart', logo: '/assets/img/vendors/unimart.webp' },
        { name: 'Lavender', logo: '/assets/img/vendors/lavender.webp' },
        { name: 'Shwapno', logo: '/assets/img/vendors/swapno.webp' },
        { name: 'PQR', logo: '/assets/img/vendors/trust.webp' },
        { name: 'ABC', logo: '/assets/img/vendors/prince.webp' },
        { name: 'Meena Bazar', logo: '/assets/img/vendors/meena.webp' },
        { name: 'Agora', logo: '/assets/img/vendors/agora.webp' },
        { name: 'Khulna Store', logo: '/assets/img/vendors/adidhali.webp' },
        { name: 'Retail Shop', logo: '/assets/img/vendors/csdlogo.webp' },
    ]

    return (
        <section className="bb-top-vendor py-5 py-md-6">
            <Container>
                <Row className="align-items-center g-4 g-lg-5">
                    {/* Left side - Store image */}
                    <Col lg={6} md={6}>
                        <Fade direction="left" triggerOnce>
                            <div className="bb-vendor-image-wrapper">
                                <div className="bb-vendor-image rounded-circle h-[528px] w-[560px] overflow-hidden">
                                    <Image
                                        src="/assets/img/vendors/image.webp"
                                        alt="Grocery Store Interior"
                                        width={500}
                                        height={500}
                                        className="w-100 h-100 object-fit-cover"
                                    />
                                </div>
                            </div>
                        </Fade>
                    </Col>

                    {/* Right side - Content */}
                    <Col lg={6} md={6}>
                        <Fade direction="right" triggerOnce>
                            <div className="bb-vendor-content">
                                <h2 className="bb-vendor-title mb-3 mb-md-4">
                                    Find us in-store
                                </h2>
                                <p className="bb-vendor-description text-muted mb-4 mb-md-5">
                                    Find our products in thousands of grocery stores nationwide.
                                    You can visit your nearest super shop from below
                                </p>

                                {/* Retailer logos grid */}
                                <div className="bb-retailer-logos">
                                    <Row className="g-3 g-md-4 align-items-center justify-content-start">
                                        {retailers.map((retailer, index) => (
                                            <Col key={index} xs={4} sm={3} md={3} lg={2}>
                                                <div className="bb-retailer-logo-item">
                                                    <a
                                                        href="#"
                                                        className="d-block bb-retailer-link"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <Image
                                                            src={retailer.logo}
                                                            alt={retailer.name}
                                                            width={100}
                                                            height={50}
                                                            className="w-100 h-auto"
                                                            style={{ objectFit: 'contain' }}
                                                        />
                                                    </a>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default TopVendor