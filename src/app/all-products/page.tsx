"use client";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ProductsAccordion from "@/components/products-section/ProductsAccordion";
import { Suspense } from "react";
import { Row } from "react-bootstrap";

const Page = () => {
  return (
    <>
      <Breadcrumb title={"Product Page"} />

      <section className="section-product padding-tb-50">
        <div className="container">
          <Row className="mb-minus-24">
            {/* FIX: Wrap with Suspense */}
            <Suspense fallback={<div>Loading products...</div>}>
                <ProductsAccordion />
            </Suspense>


          </Row>
        </div>
      </section>
    </>
  );
};

export default Page;
