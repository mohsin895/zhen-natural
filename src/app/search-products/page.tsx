"use client";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { Suspense } from "react";
import { Row } from "react-bootstrap";
import SearchProductList from "@/components/products-section/SearchProductList";

const Page = () => {
    return (
        <>
            <Breadcrumb title={"Search Results"} />
            <section className="section-product padding-tb-50">
                <div className="container">
                    <Row className="mb-minus-24">
                        <Suspense fallback={<div>Loading products...</div>}>
                            <SearchProductList />
                        </Suspense>
                    </Row>
                </div>
            </section>
        </>
    );
};

export default Page;