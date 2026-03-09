"use client"
import dynamic from 'next/dynamic'
import { Row } from 'react-bootstrap'

const Products = dynamic(() => import('@/components/products-section/Products'), { ssr: false })

export default function ProductLeftSidebarClient() {
    return (
        <>
            <section className="section-product padding-tb-50">
                <div className="container">
                    <Row className="row mb-minus-24">
                        <Products />
                    </Row>
                </div>
            </section>

        </>
    )
}