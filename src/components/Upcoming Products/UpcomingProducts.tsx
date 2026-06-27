"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Row } from "react-bootstrap";

const API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/upcoming-products`;

const UpcomingProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const result = await res.json();
        setProducts(result.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return null;

  return (
    <section className="padding-tb-50 bg-light">
      <div className="container">
        <Row className="mb-4">
          <div className="col-12">
            <Fade triggerOnce direction="up">
              <div className="section-title">
                <div className="section-detail">
                  <h2 className="bb-title">
                    Upcoming <span>Products</span>
                  </h2>
                  <p>Products coming soon.</p>
                </div>
              </div>
            </Fade>
          </div>
        </Row>

        <Row className="g-3">
          {products.map((item: any) => (
            <div
              key={item.id}
              className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box"
            >
              <Fade triggerOnce direction="up">
                <div className="upcoming-card h-100">
                  <div className="upcoming-badge">Coming Soon</div>

                  <Link href={`/details/${item.slug}`}>
                    <div className="image-wrapper">
                      <img
                        src={item.thumbnail_image}
                        alt={item.name}
                        className="w-100"
                      />
                    </div>
                  </Link>

                  <div className="p-3">
                    <h6 className="mb-2">
                      {/* <Link href={`/details/${item.slug}`}
                      
                      ></Link> */}
                      {item.name}
                    </h6>

                    <div className="price mb-3">{item.main_price}</div>

                    <button className="btn btn-secondary w-100" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </Fade>
            </div>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default UpcomingProducts;
