"use client";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Row } from "react-bootstrap";
import { TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ProductItemCard from "../item/ProductItemCard";

const API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/all-products`;

const NewArrivals = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const Categories = [
    {
      groupname: "Snacks",
      categoryName: ["Snacks", "Juice", "Chips", "Spices", "Sauces"],
    },
    { groupname: "Fruit", categoryName: ["Fruit"] },
    {
      groupname: "Vegetable",
      categoryName: ["Vegetable", "Tuber Root", "Leaves"],
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const result = await res.json();
        const products = result.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          newPrice: item.main_price,
          oldPrice:
            item.stroked_price !== item.main_price ? item.stroked_price : null,
          image: item.thumbnail_image,
          imageTwo: item.thumbnail_image,
          category: item.category || "Others",
          weight: item.weight || "",
          rating: item.rating || 0,
          quantity: 1,
          slug: item.slug,
          has_discount: item.has_discount || false,
          discount: item.discount || 0,
          discount_type: item.discount_type || "",
          sale: item.has_discount
            ? item.discount_type === "amount"
              ? `৳${item.discount} OFF`
              : `${item.discount}% OFF`
            : "",
          current_stock: item.current_stock || 0,
          date: "",
          status: "",
          location: "",
          brand: "",
          sku: item.id,
        }));
        setData(products);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;
  if (!data.length)
    return <div className="text-center py-5">No products found</div>;

  const filterByAll = () =>
    data
      .map((item: any) => ({ item, sort: Math.random() }))
      .sort((a: any, b: any) => a.sort - b.sort)
      .map(({ item }: any) => item)
      .slice(0, 12);

  const filterByCategory = (category: string) =>
    data.filter((product: any) =>
      Categories.find(
        (cat: any) =>
          cat.groupname === category &&
          cat.categoryName.includes(product.category),
      ),
    );

  return (
    <section className="section-product-tabs padding-tb-50">
      <div className="container">
        {/*  Section Title */}
        <Row className="mb-4">
          <div className="col-12">
            <Fade triggerOnce direction="up" duration={1000} delay={200}>
              <div className="section-title bb-deal">
                <div className="section-detail">
                  <h2 className="bb-title">
                    New <span>Arrivals</span>
                  </h2>
                  <p>Shop online for new arrivals and get free shipping!</p>
                </div>
              </div>
            </Fade>
          </div>
        </Row>

        {/*   Tabs with TabList */}
        <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
          {/*   Tab Headers */}

          {/*   All Products Tab */}
          <TabPanel>
            <Row className="mb-minus-24">
              {filterByAll().map((item: any, idx: number) => (
                <div
                  className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box"
                  key={idx}
                >
                  <Fade triggerOnce direction="up" duration={1000} delay={200}>
                    <ProductItemCard data={item} />
                  </Fade>
                </div>
              ))}
            </Row>
          </TabPanel>

          {/*   Category Tabs */}
          {Categories.map((category, idx) => (
            <TabPanel key={idx}>
              <Row className="mb-minus-24">
                {filterByCategory(category.groupname).map(
                  (item: any, index: number) => (
                    <div
                      className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box"
                      key={index}
                    >
                      <Fade
                        triggerOnce
                        direction="up"
                        duration={1000}
                        delay={200}
                      >
                        <ProductItemCard data={item} />
                      </Fade>
                    </div>
                  ),
                )}
              </Row>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default NewArrivals;
