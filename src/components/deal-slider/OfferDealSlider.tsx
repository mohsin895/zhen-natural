"use client"
import React from 'react'
import { Fade } from 'react-awesome-reveal'
import Slider from './slider/Slider'
import DealEndSlider from '../dealend-slider/DealEndSlider'
import { Row } from 'react-bootstrap'

const OfferDealSlider = () => {
    return (
        <section className="section-deal padding-tb-50">
            <div className="container">
                <Row>

                    <Slider />
                </Row>
            </div>
        </section>
    )
}

export default OfferDealSlider
