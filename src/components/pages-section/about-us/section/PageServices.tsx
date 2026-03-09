import Services from '@/components/services/Services';
import React from 'react'
import { Fade } from 'react-awesome-reveal';
import { Row } from 'react-bootstrap';

const PageServices = () => {
    return (
        <section className="section-services padding-tb-50">
            <div className="container">
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-center mb-4">The Origin</h2>
                    <div className="section-title bb-center">


                            <p>With a simple, transformative discovery our story began in the kitchen when our beloved Managing Director tried to find a healthy solution for her family. Chia seeds, turmeric, ginger, honey, and fresh greens- mixing all these items she made a fresh smoothie that came as a perfect nutrition solution against persistent skin issues and bloating. The remarkable result spurred her to explore more nutrient-dense diets to balance and prevent long-term health difficulties, such as PCOS, PCOD, thyroid, diabetes, heart disease, weight loss, etc. Thus, a voyage for individual remedy blossomed into a quest for wellness as Zhen Natural Ltd, a company that not only sells but also thrives on organic items and superfoods.</p>

                    </div>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-center mb-4">A Noble Mission</h2>
                    <div className="section-title bb-center">


                        <p>
                            With a noble goal, Zhen Natural Ltd. started its journey in 2015 to cultivate a healthier Bangladesh. Therefore, every item within our range has been chosen with care from certified global brands to ensure that it is natural, organic, and harmful pesticides or chemicals-free. We believe that besides eating healthy, it’s important to adopt a holistic approach to wellness. Incorporating the right food into your diet optimizes the results of a healthy lifestyle. Therefore, Zhen wants to empower health-conscious individuals who understand the power of nature’s bounty and encourage others to build a healthy living community. To support delicate health conditions like PCOS/PCOD, Thyroid, Diabetes, Menopause, etc, Zhen has arranged an extensive range of organic superfoods. We understand how tough balancing these health conditions can be, especially for women. There is beetroot powder, matcha green tea, cacao powder, maca powder, etc- you can pick whichever you want. Our products are carefully sourced to support a journey toward a better future.
                        </p>

                    </div>
                </Fade>


                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-center mb-4">Our Valuable Partners</h2>
                    <div className="section-title bb-center">


                        <p>
                            Our adventure started with a simple yet substantial partnership with &quot;Tilda.&quot; Their premium rice products set the benchmark for our objective of serving the best products. Then slowly our ambition bloomed with our growth and we gradually incorporated more recognized international brands to our portfolio, including Equal, Naturel, and Nature&apos;s Superfoods. Our passion for sustainability and wellness are shared by all of our partners equally. With the same vision we are proud to offer an extensive range of organic food products that has been chosen carefully to complement a healthy way of living.
                        </p>

                    </div>
                </Fade>
                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-center mb-4">Wholesale and Retail Services Across The Country</h2>
                    <div className="section-title bb-center">


                        <p>
                            From Teknaf to Tetuliya, Zhen Natural Ltd provides wholesale and retail services throughout Bangladesh. The company prioritizes each and every vendor and consumer demand and ensures they have access to the highest quality organic goods. The retail services are intended for customers who wish to choose healthier options for their families and themselves. Because if you want to have a better result, besides consuming organic items you will also have to maintain a healthy lifestyle. Otherwise, you won&apos;t get a better result. So, Zhen always values the customers who are health conscious as well as prioritizes customers who are interested in leading a healthy life in the future. The wholesale ensures that clients are getting a consistent supply of premium organic products and superfoods. To compete with the growing need for healthy and sustainable solutions, Zhen tries to provide all the vendors with 100% authentic organic products and superfoods.
                        </p>

                    </div>
                </Fade>

                <Fade triggerOnce direction='up' duration={1000} delay={200}>
                    <h2 className="bb-title text-center mb-4">Why Choose Zhen Natural Ltd</h2>
                    <div className="section-title bb-center">


                        <p>
                            Picture a scenario where a mother is pouring her heart and soul into the kitchen to prepare the best meal for her babies with nutritious ingredients. Only a mother knows what is best when it comes to the best of her child. This is exactly how Zhen Natural Ltd aspires to cherish and nurture every valuable customer. We carefully handpick all the organic items and superfoods from globally certified renowned brands, because we don&apos;t compromise when it comes to the wellness of our customers. Unlike other brands, we promise to offer you what we trust is best for our families. To ensure the standard and quality, our items undergo various rigorous selection procedures. In addition, we have a dedicated staff of helpful professionals that are always ready to assist our clients with any product-related questions or guidance. Zhen Natural is here to help you on your road to wellbeing, not just sell items. So by choosing us, you are choosing more than simply a brand, but also a companion for healthy living.
                        </p>

                    </div>
                </Fade>
                <Row className="mb-minus-24">
                    <div className="col-12">


                        <Fade triggerOnce direction='up' duration={1000} delay={200}>
                            <div className="section-title bb-center">
                                <div className="section-detail">
                                    <h2 className="bb-title">Our <span>Services</span></h2>
                                    <p>Customer service should not be a department. It should be the entire company.</p>
                                </div>
                            </div>
                        </Fade>
                    </div>
                    <Services />
                </Row>
            </div>
        </section>
    )
}

export default PageServices;
