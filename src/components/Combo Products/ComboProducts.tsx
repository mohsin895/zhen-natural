"use client";

import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Row } from "react-bootstrap";
import ProductItemCard from "../item/ProductItemCard";

const API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/combo-products`;

const ComboProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const result = await res.json();

        const formatted = result.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          newPrice: item.main_price,
          oldPrice:
            item.stroked_price !== item.main_price ? item.stroked_price : null,
          image: item.thumbnail_image,
          imageTwo: item.thumbnail_image,
          category: item.category || "",
          weight: item.weight || "",
          rating: item.rating || 0,
          quantity: 1,
          slug: item.slug,
          has_discount: item.has_discount || false,
          discount: item.discount || 0,
          discount_type: item.discount_type || "",
          current_stock: item.current_stock || 0,
          sku: item.id,
        }));

        setProducts(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return null;

  return (
    <section className="padding-tb-50">
      <div className="container">
        <Row className="mb-4">
          <div className="col-12">
            <Fade triggerOnce direction="up">
              <div className="section-title">
                <div className="section-detail">
                  <h2 className="bb-title">
                    Combo <span>Offers</span>
                  </h2>
                  <p>Save more with our specially curated combo packages.</p>
                </div>
              </div>
            </Fade>
          </div>
        </Row>

        <Row className="g-3">
          {products.map((item, index) => (
            <div
              key={index}
              className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box"
            >
              <Fade triggerOnce direction="up">
                <ProductItemCard data={item} />
              </Fade>
            </div>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ComboProducts;
