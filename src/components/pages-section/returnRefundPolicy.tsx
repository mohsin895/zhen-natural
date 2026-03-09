import Services from '@/components/services/Services';
import React from 'react'
import { Fade } from 'react-awesome-reveal';
import { Row } from 'react-bootstrap';

const ReturnRefundPolicy = () => {
    return (
        <section className="section-services padding-tb-50">
            <div className="container">
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Introduction</h2>
                    <div className="section-title text-left">


                        <p>At Zhen Nature, customer satisfaction is our priority. If you are not happy with your purchase, we offer a combined refund and return policy under the conditions outlined below.</p>
                    </div>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Eligibility for Refund and Return</h2>
                    <div className="section-title text-left">


                        <ul>
                            <li>
                                1.Items must be unused and in their original packaging.
                            </li>
                            <li>
                                2.Requests must be made within 7 days of receiving the item.
                            </li>
                        </ul>

                    </div>
                </Fade>


                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Process</h2>
                    <div className="section-title text-left">


                      <ul>
                          <li>1.Contact us at support@zhennatural.com within 3 days to initiate a refund or return.</li>
                          <li>2.Follow the provided instructions for returning the product.</li>
                          <li>3.Refunds will be processed after receiving and inspecting the item, and will be credited within 7-10 business days.</li>
                      </ul>

                    </div>
                </Fade>
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Non-Refundable/Non-Returnable Items</h2>
                    <div className="section-title text-left">

<ul>
    <li>1.Gift cards</li>
    <li>2.Downloadable products</li>
    <li>3. Items marked as &quot;Final Sale&quot; or &quot;Discount Sale&quot;.</li>
    <li>4.Perishable goods</li>
    <li>5.Customized products</li>
    <li>6.Clearance items</li>
</ul>

                    </div>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-left mb-4">Return Shipping</h2>
                    <div className="section-title text-left">


                        <p>Customers are responsible for return shipping costs unless the return is due to a faulty or incorrect item. We recommend using a trackable shipping service.</p>

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

export default ReturnRefundPolicy;
