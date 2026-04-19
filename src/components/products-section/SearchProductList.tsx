"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Col, Row } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import ProductItemCard from "@/components/item/ProductItemCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;

export default function SearchProductList() {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const categoryId = searchParams.get("category_id") || "";

    // Build query string for Laravel /products/search endpoint
    const query = new URLSearchParams();
    if (keyword) query.set("name", keyword);
    if (categoryId) query.set("categories", categoryId);

    const { data, isLoading } = useSWR<{ data: any[] }>(
        `${API_BASE}/products/search?${query.toString()}`,
        fetcher
    );

    const products = data?.data ?? [];

    const formattedProducts = products.map((item: any) => ({
        id: item.id,
        title: item.name,
        slug: item.slug,
        newPrice: item.main_price || item.unit_price || 0,
        oldPrice: item.stroked_price || item.unit_price || 0,
        image: item.thumbnail_image,
        imageTwo: item.thumbnail_image,
        category: item.category || "",
        weight: item.weight || "",
        rating: item.rating || 0,
        quantity: 1,
        has_discount: item.has_discount || false,
        discount: item.discount || 0,
        discount_type: item.discount_type || "",
        sale: item.has_discount ? `-${item.discount}` : "",
        current_stock: item.current_stock ?? 10,
        date: "",
        status: "",
        location: "",
        brand: item.brand || "",
        sku: item.id,
    }));

    if (isLoading) return <div>Searching...</div>;

    if (!formattedProducts.length) {
        return (
            <div className="col-12 text-center py-5">
                <p>No products found{keyword ? ` for "${keyword}"` : ""}.</p>
            </div>
        );
    }

    return (
        <Col lg={12} xs={12}>
            <Row>
                {formattedProducts.map((item: any, idx: number) => (
                    <div
                        className="col-xl-3 col-md-3 col-6 mb-24 bb-product-box"
                        key={item.id || idx}
                    >
                        <Fade triggerOnce direction="up" duration={1000} delay={200}>
                            <ProductItemCard data={item} />
                        </Fade>
                    </div>
                ))}
            </Row>
        </Col>
    );
}