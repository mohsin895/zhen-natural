import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col, Row } from 'react-bootstrap'

const AboutMe = () => {
    return (
        <>
            <section className="section-about padding-tb-50">
                <div className="container">
                    <Row className="mb-minus-24">
                        <Col lg={6} className="mb-24 col-12">
                            <div className="bb-about-img">
                                <img src="/assets/img/about/about.webp" alt="about-one" />
                            </div>
                        </Col>
                        <Col lg={6}  className="mb-24 col-12">
                            <div className="bb-about-contact">
                                <Fade triggerOnce direction='up' duration={1000} delay={200} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                                    <div className="section-title">
                                        <div className="section-detail">
                                            <h2 className="bb-title">About  <span>Zhen Natural Ltd</span></h2>
                                        </div>
                                    </div>
                                </Fade>
                                <Fade triggerOnce direction='up' duration={1000} delay={400}>
                                    <div className="about-inner-contact">
                                        <h4>Discover the Power of Nature with Zhen Natural Ltd..</h4>
                                        <p>Imagine sitting down to a course crafted from the finest organic food products, knowing each bite is a step toward a better, healthier future. Yes, Zhen Natural Ltd is on a mission to make that dream of yours come true! We aspire to establish a Bangladesh where everyone has access to nutritious, healthful, and organic foods</p>
                                        <p>As part of the RANGS Group, our goal is to offer more than just organic products; we strive to give comprehensive guidance to nourish your body, mind, and soul. Whether you are a health-conscious individual or seeking to lead a healthy life, Zhen is here for all. We also have natural and organic superfoods for people dealing with delicate conditions.</p>
                                    </div>
                                </Fade>
                                <Fade triggerOnce direction='up' duration={1000} delay={600} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
                                    <Row className="bb-vendor-rows row mb-minus-24">
                                        <Col sm={4} className="mb-24">
                                            <div className="bb-vendor-box">
                                                <div className="bb-count">
                                                    <h5 className="counter">30 +</h5>
                                                </div>
                                                <div className="inner-text">
                                                    <p>vendors</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={4} className="mb-24">
                                            <div className="bb-vendor-box">
                                                <div className="bb-count">
                                                    <h5 className="counter">65k +</h5>
                                                </div>
                                                <div className="inner-text">
                                                    <p>Sales</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={4} className="mb-24">
                                            <div className="bb-vendor-box">
                                                <div className="bb-count">
                                                    <h5 className="counter">20k +</h5>
                                                </div>
                                                <div className="inner-text">
                                                    <p>Customers</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="bb-vendor-rows row mb-minus-24">
                                        <Col sm={12} className="mb-24">


                                                <div className="inner-text text-[#000] mt-10">
                                                    <p>Our Trade License No.: <span>TRAD/DNCC/007091/2022</span></p>
                                                </div>

                                        </Col>

                                    </Row>
                                </Fade>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>
        </>
    )
}

export default AboutMe
