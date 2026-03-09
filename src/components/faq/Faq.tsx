"use client"
import React, { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { Col, Row } from 'react-bootstrap';

const Faq = () => {
    const [activeAccordion, setActiveAccordion] = useState(1);

    const handleAccordionToggle = (index: any) => {
        setActiveAccordion(index === activeAccordion ? null : index);
    };

    return (
        <section className="section-faq ">
            <div className="container">
                <Row className="mb-minus-24">


                    <Col lg={12} className="mb-24">
                        <Fade className="bb-faq-contact" triggerOnce direction='up' duration={1000} delay={200}>
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(0)} className="accordion-header" id="headingOne">
                                        <button className={`accordion-button ${activeAccordion === 0 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">

                                            How does the site work?

                                        </button>
                                    </h2>
                                    <div id="collapseOne" className={`accordion-collapse collapse ${activeAccordion === 0 ? "show" : ""}`}
                                        aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            You can browse the site or use our search engine to find your desired products. You can then add them to your shopping bag and click on place order. You let us know your address, select a delivery time – and voila, you are done.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(1)} className="accordion-header" id="headingTwo">
                                        <button className={`accordion-button ${activeAccordion === 1 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">

                                            How do I know when my order is here?

                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className={`accordion-collapse collapse ${activeAccordion === 1 ? "show" : ""}`}
                                        aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">

                                            A representative will call you as soon as they are at your house to let you know about your delivery.

                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(2)} className="accordion-header" id="headingThree">
                                        <button className={`accordion-button ${activeAccordion === 2 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree" aria-expanded="false"
                                            aria-controls="collapseThree">

                                            I can&apos;t find the product I am looking for. What do I do?

                                        </button>
                                    </h2>
                                    <div id="collapseThree" className={`accordion-collapse collapse ${activeAccordion === 2 ? "show" : ""}`}
                                        aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">

                                            We are always open to new suggestions and will add an item to our inventory just for you. There is a &quot;Product Request&quot; feature that you can use to inform us of your requirement.

                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(3)} className="accordion-header" id="headingFour">
                                        <button className={`accordion-button ${activeAccordion === 3 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseFour" aria-expanded="false"
                                            aria-controls="collapseFour">

                                            What if the item is out of stock?

                                        </button>
                                    </h2>
                                    <div id="collapseFour" className={`accordion-collapse collapse ${activeAccordion === 3 ? "show" : ""}`} aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">

                                            We hold our own inventory in our warehouses, so we rarely run out of stock. However, we will try our best to source what you need. If we cannot find it, we will SMS/call you and let you know what substitutes are available.

                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(4)} className="accordion-header" id="headingFive">
                                        <button className={`accordion-button ${activeAccordion === 4 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseFive" aria-expanded="false"
                                            aria-controls="collapseFive">

                                            Why should we buy from you when I have a store nearby?

                                        </button>
                                    </h2>
                                    <div id="collapseFive" className={`accordion-collapse collapse ${activeAccordion === 4 ? "show" : ""}`} aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">

                                            Well, that is up to you but you can also be a couch potato like our founders and have your items delivered to your house for free. Our prices are sometimes lower than that of major superstores in the city. We also carry a larger variety than the average corner store. So, there is really no reason to not buy from us.

                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 onClick={() => handleAccordionToggle(5)} className="accordion-header" id="headingSix">
                                        <button className={`accordion-button ${activeAccordion === 5 ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">

                                            Well, that is up to you but you can also be a couch potato like our founders and have your items delivered to your house for free. Our prices are sometimes lower than that of major superstores in the city. We also carry a larger variety than the average corner store. So, there is really no reason to not buy from us.

                                        </button>
                                    </h2>
                                    <div id="collapseSix" className={`accordion-collapse collapse ${activeAccordion === 5 ? "show" : ""}`} aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">

                                            Our prices are our own but we try our best to offer them to you at or below market prices. Our prices are the same as the local market and we are working hard to get them even lower! If you feel that any product is priced unfairly, please let us know.

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </Col>
                </Row>
            </div>
        </section>
    )
}

export default Faq
