"use client"
import React from 'react'
import ProductsDetails from './Products-Detail/ProductsDetails'
import ProductsTabs from './Products-Tabs/ProductsTabs'
import { Col } from 'react-bootstrap'
import type { ProductData } from '@/app/details/[slug]/page'

interface ProductsProps {
    product: ProductData
}

const Products: React.FC<ProductsProps> = ({ product }) => {
    return (
        <Col lg={12} sm={12} className="mb-24">
            <ProductsDetails product={product} />
            <ProductsTabs product={product} />
        </Col>
    )
}

export default Products