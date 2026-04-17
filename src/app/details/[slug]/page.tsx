"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";

// const Breadcrumb = dynamic(() => import('@/components/breadcrumb/Breadcrumb'), {
//     ssr: false
// })
const Products = dynamic(
  () => import("@/components/products-section/Products"),
  {
    ssr: false,
  },
);
const RelatedSlider = dynamic(
  () => import("@/components/deal-slider/RelatedSlider"),
  {
    ssr: false,
  },
);

export interface ProductData {
  id: number;
  name: string;
  slug: string;
  unit_price: number;
  discount: number;
  discount_type: string;
  stocks: Array<{
    id: number;
    product_id: number;
    variant: string;
    sku: string;
    price: number;
    qty: number;
  }>;
  rating: number;
  num_of_sale: number;
  description: string;
  meta_description: string;
  image?: string;
  photo_list: Array<{
    id: number;
    file_name: string;
    file_original_name: string;
    extension: string;
  }>;
  thumbnail: {
    id?: number;
    file_name?: string;
    file_original_name?: string;
  };
  category_id: number;
  brand_id: number;
  tags: string;
  current_stock: number;
  colors: string;
  choice_options: string;
  attributes: string;
}

const ProductDetailsPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/products/details/${params.slug}`,
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        // console.log("Product data:", data);
        setProduct(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug && mounted) {
      fetchProduct();
    }
  }, [params.slug, mounted]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="container padding-tb-50">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container padding-tb-50">
        <div className="alert alert-danger" role="alert">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Breadcrumb title={product.name} /> */}
      <section className="section-product my-5 padding-tb-50">
        <div className="container">
          <Row className="mb-minus-24">
            <Products product={product} />
          </Row>
        </div>
      </section>
      {/*<RelatedSlider categoryId={product.category_id} />*/}
    </>
  );
};

export default ProductDetailsPage;
