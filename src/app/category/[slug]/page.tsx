"use client";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ProductsAccordion from "@/components/products-section/ProductsAccordion";
import { setSelectedCategory } from "@/store/reducer/filterReducer";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = use(params);
    const dispatch = useDispatch();
    const [categoryName, setCategoryName] = useState(slug);

    const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;

    useEffect(() => {
        dispatch(setSelectedCategory([slug]));

        const fetchCategoryName = async () => {
            try {
                const res = await fetch(`${API_BASE}/filter/categories`);
                const result = await res.json();

                const matched = result?.data?.find(
                    (cat: any) => cat.slug === slug
                );

                if (matched) {
                    setCategoryName(matched.name);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategoryName();
    }, [slug, dispatch, API_BASE]);

    return (
        <>
            <Breadcrumb title={categoryName} />
            <ProductsAccordion />
        </>
    );
};

export default CategoryPage;