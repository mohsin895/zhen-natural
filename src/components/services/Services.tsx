import React from 'react'
import { Fade } from 'react-awesome-reveal';
import { Col, Row } from 'react-bootstrap';

const Services = () => {
    return (
        <section className="section-services padding-tb-50">
            <div className="container">
                <Row className="mb-minus-24">
                    <Col lg={3} md={6} className="mb-24 col-12">
                        <Fade triggerOnce duration={1000} direction='up' delay={200}>
                            <div className="bb-services-box">
                                <div className="services-img">
                                    <img src="/assets/img/services/1.png" alt="services-1" />
                                </div>
                                <div className="services-contact">
                                    <h4>Fast Shipping</h4>
                                    <p>Receive your order swiftly, anywhere in Bangladesh.</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                    <Col lg={3} md={6} className="mb-24 col-12">
                        <Fade triggerOnce duration={1000} direction='up' delay={400}>
                            <div className="bb-services-box">
                                <div className="services-img">
                                    <img src="/assets/img/services/2.png" alt="services-2" />
                                </div>
                                <div className="services-contact">
                                    <h4>24x7 Support</h4>
                                    <p>Our dedicated team is always ready to assist you.</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                    <Col lg={3} md={6} className="mb-24 col-12">
                        <Fade triggerOnce duration={1000} direction='up' delay={600}>
                            <div className="bb-services-box">
                                <div className="services-img">
                                    <img src="/assets/img/services/3.png" alt="services-3" />
                                </div>
                                <div className="services-contact">
                                    <h4>30 Days Return</h4>
                                    <p>Return your purchase within 3 days for a hassle-free exchange.</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                    <Col lg={3} md={6} className="mb-24 col-12">
                        <Fade triggerOnce duration={1000} direction='up' delay={800}>
                            <div className="bb-services-box">
                                <div className="services-img">
                                    <img src="/assets/img/services/4.png" alt="services-4" />
                                </div>
                                <div className="services-contact">
                                    <h4>Payment Secure</h4>
                                    <p>Your payment information is safe and protected.</p>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                </Row>
            </div>
        </section>
    )
}
export default Services;