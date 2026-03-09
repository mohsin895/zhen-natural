
import React from 'react'
import { Fade } from 'react-awesome-reveal';
import { Row } from 'react-bootstrap';

const PrivacyPolicy = () => {
    return (
        <section className="section-services padding-tb-50">
            <div className="container">
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Introduction</h2>
                    <div className="section-title text-left">
                        <p>This Privacy Policy explains how Zhen Nature collects, uses, and protects your personal information.</p>
                    </div>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Information We Collect</h2>
                    <div className="section-title text-left">

                       <ul>
                           <li>1.Personal Information: Name, email, address</li>
                           <li>2.Usage Data: IP address, browser type, pages visited</li>
                           <li>3.Cookies: Used to enhance your website experience</li>
                       </ul>
                    </div>
                </Fade>


                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Usage of Information</h2>
                    <p>We use the collected data for various purposes, including to:</p>
                    <div className="section-title text-left">
             <ul>
                 <li>To provide and improve our services</li>
                 <li>To communicate promotional offers</li>
                 <li>To analyze website performance</li>
             </ul>

                    </div>
                </Fade>
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Protection Measures</h2>
                    <div className="section-title text-left">

                        <p>We implement security measures like encryption and secure servers. However, absolute security cannot be guaranteed.</p>
                    </div>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Third-Party Links</h2>
                    <div className="section-title text-left">
                        <p>Our website may link to external sites. We are not responsible for their privacy practices.</p>

                    </div>

                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Cookies</h2>
                    <div className="section-title text-left">

                      <p>By using our website, you consent to the use of cookies. You can adjust your browser settings to manage cookies.</p>

                    </div>

                </Fade>
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Policy Updates</h2>
                    <div className="section-title text-left">

                        <p>We may update this Privacy Policy. Changes will be posted on this page with an updated &quot;Last Updated&quot; date.</p>
                    </div>
                </Fade>

                <Row className="mb-minus-24">
                    <div className="col-12">


                        <Fade triggerOnce direction='up' duration={1000} delay={200}>
                            <div className="section-title text-left">
                                <div className="section-detail">
                                    <h2 className="bb-title">Contact Us</h2>
                                    <p>Email: support@zhennatural.com</p>
                                    <p>Phone: 01844545500</p>
                                </div>
                            </div>
                        </Fade>
                    </div>

                </Row>
            </div>
        </section>
    )
}

export default PrivacyPolicy;

