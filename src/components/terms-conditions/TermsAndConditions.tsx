
import React from 'react'
import { Fade } from 'react-awesome-reveal';
import { Row } from 'react-bootstrap';

const TermsAndConditions = () => {
    return (
        <section className="section-services padding-tb-50">
            <div className="container">
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Introduction</h2>
                    <div className="section-title text-left">

                        <p>
                            These terms govern your use of Zhen Nature&apos;s website and your purchases.
                        </p>
                    </div>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">User Accounts</h2>
                    <div className="section-title text-left">

                        <p>You are responsible for maintaining the confidentiality of your account information.</p>
                    </div>
                </Fade>


                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Product Information</h2>
                    <div className="section-title text-left">

<p>We strive for accuracy but cannot guarantee error-free content. Availability is subject to change.</p>

                    </div>
                </Fade>
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Payment</h2>
                    <div className="section-title text-left">

                        <p>Prices are listed in local currency and include taxes. Payments are securely processed via Cash on Delivery, MFS (Mobile Financial Services), and credit/debit cards.</p>

                    </div>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Shipping & Delivery Policy</h2>
                    <div className="section-title text-left">
                      <h3 className="bb-title text-left mb-4">Delivery Areas & Timeframe</h3>
                        <ul>
                            <li>1.Inside Dhaka: Orders are typically delivered within 2-3 working days.</li>
                      <li>2.Outside Dhaka: Deliveries may take 3-5 working days, depending on location and courier availability.</li>
                        </ul>

                    </div>
                    <h3 className="bb-title text-left mb-4">Delivery Charges
                    </h3>
                    <div className="section-title text-left">



                        <ul>
                            <li>1.Inside Dhaka: 60 Taka</li>
                            <li>2.Outside Dhaka: 120 Taka</li>
                        </ul>


                    </div>
                    <p>Delivery charges are calculated at checkout. Occasionally, we may offer special promotions or free delivery on selected items—stay tuned to our official channels for updates!</p>
                    <p>Note: If the weight increases, the charge will change accordingly. Charges and delivery times vary by location.</p>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Order Processing & Shipping</h2>
                    <div className="section-title text-left">

                     <ul>
                         <li>
                         1.Orders are processed within 24 hours of confirmation.
                     </li>
                         <li>2.Deliveries are made between 9 AM - 8 PM, excluding public holidays.</li>
                         <li>3.If there are any unforeseen delays, our team will notify you.</li>

                     </ul>

                    </div>
                    <h2 className="bb-title text-left mb-4">Special Instructions</h2>
                    <div className="section-title text-left">



                        <ul>
                            <li>1.Please provide an accurate shipping address and contact number for a smooth delivery experience.</li>
                            <li>2.If the recipient is unavailable at the time of delivery, our courier partner will attempt a second delivery.</li>
                        </ul>
                    </div>
                </Fade>
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Liability</h2>
                    <div className="section-title text-left">

                       <p>We are not responsible for indirect or incidental damages related to our products.</p>
                    </div>
                </Fade>
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Governing Law</h2>
                    <div className="section-title text-left">

                        <p>These terms are governed by Bangladeshi law, and disputes will be handled in Dhaka courts.</p>
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

export default TermsAndConditions;

