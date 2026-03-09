"use client";

import ProductItemCard from "@/components/item/ProductItemCard";
import { RootState } from "@/store";
import {
  setRange,
  setSelectedCategory,
  setSelectedTags,
} from "@/store/reducer/filterReducer";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ShopSidebar from "../shop/sidebar-section/ShopSidebar";

interface ProductsAccordionProps {
  forcedCategory?: string;
}

const ProductsAccordion = ({ forcedCategory }: ProductsAccordionProps) => {
  const { minPrice, maxPrice, selectedCategory, selectedTags } = useSelector(
    (state: RootState) => state.filter,
  );

  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const categoryId = searchParams.get("category_id");

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [brands, setBrands] = useState<any[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<any[]>([]);

  // ── Search state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;

  // ── Handlers ──
  const handlePriceChange = useCallback(
    (min: number, max: number) => {
      dispatch(setRange({ min, max }));
    },
    [dispatch],
  );

  const handleCategoryChange = (category: any) => {
    const updated = selectedCategory.includes(category)
      ? selectedCategory.filter((cat: any) => cat !== category)
      : [...selectedCategory, category];
    dispatch(setSelectedCategory(updated));
  };

  const handleBrandChange = (brand: any) => {
    const updated = selectedBrand.includes(brand)
      ? selectedBrand.filter((b: any) => b !== brand)
      : [...selectedBrand, brand];
    setSelectedBrand(updated);
  };

  const handleTagsChange = (tag: any) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((tg: any) => tg !== tag)
      : [...selectedTags, tag];
    dispatch(setSelectedTags(updated));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  // ── Fetch Categories ──
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/filter/categories`);
        const result = await res.json();
        setCategories(result?.data || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [API_BASE]);

  // ── Fetch Brands ──
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${API_BASE}/all-brands`);
        const result = await res.json();
        setBrands(result?.data || []);
      } catch (err) {
        console.error("Brands fetch error:", err);
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchBrands();
  }, [API_BASE]);

  // ── Fetch Products ──
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE}/all-products`;

        if (keyword || categoryId) {
          const params = new URLSearchParams();
          if (keyword) params.append("keyword", keyword);
          if (categoryId) params.append("category_id", categoryId);
          url = `${API_BASE}/products/search?${params.toString()}`;
        } else {
          const activeCat =
            forcedCategory || urlCategory || selectedCategory[0] || null;
          if (activeCat) {
            url = `${API_BASE}/products/category/${activeCat}`;
          }
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const result = await res.json();

        const products = (result.data || []).map((item: any) => ({
          id: item.id,
          title: item.name,
          slug: item.slug,
          newPrice: item.main_price,
          oldPrice: item.stroked_price,
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
          current_stock: item.current_stock ?? item.stock ?? 0,
          date: "",
          status: "",
          location: "",
          brand: item.brand || "",
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
  }, [
    forcedCategory,
    selectedCategory,
    urlCategory,
    keyword,
    categoryId,
    API_BASE,
  ]);

  // ── Client-side filter: search + brand + price ──
  const filteredProducts = useMemo(() => {
    let result = [...data];

    const parsePrice = (price: any): number => {
      if (!price) return 0;
      return parseFloat(String(price).replace(/[^\d.]/g, "")) || 0;
    };

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q),
      );
    }

    if (selectedBrand.length > 0) {
      result = result.filter((item) => selectedBrand.includes(item.brand));
    }

    if (minPrice > 0) {
      result = result.filter((item) => parsePrice(item.newPrice) >= minPrice);
    }

    if (maxPrice > 0) {
      result = result.filter((item) => parsePrice(item.newPrice) <= maxPrice);
    }

    return result.slice(0, 12);
  }, [data, searchQuery, selectedBrand, minPrice, maxPrice]);

  return (
    <section className="section-products-details pb-100">
      <div className="container">
        {/* ── Search Bar ── */}
        <Row className="mb-4">
          <Col xs={12}>
            {(searchQuery ||
              selectedBrand.length > 0 ||
              minPrice > 0 ||
              maxPrice > 0) && (
              <div className="mt-2 d-flex flex-wrap gap-2 align-items-center">
                <small className="text-muted">Active filters:</small>
                {searchQuery && (
                  <span className="badge bg-secondary">
                    Search: &quot;{searchQuery}&quot;
                    <button
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: "0.6rem" }}
                      onClick={handleSearchClear}
                    />
                  </span>
                )}
                {selectedBrand.map((b) => (
                  <span key={b} className="badge bg-secondary">
                    Brand: {b}
                    <button
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: "0.6rem" }}
                      onClick={() => handleBrandChange(b)}
                    />
                  </span>
                ))}
                {(minPrice > 0 || maxPrice > 0) && (
                  <span className="badge bg-secondary">
                    Price: ৳{minPrice} – ৳{maxPrice}
                  </span>
                )}
                <small className="text-muted">
                  ({filteredProducts.length} result
                  {filteredProducts.length !== 1 ? "s" : ""})
                </small>
              </div>
            )}
          </Col>
        </Row>

        <Row className="bb-pro-box">
          {/* Sidebar */}
          <Col lg={3} xs={12}>
            <ShopSidebar
              handleCategoryChange={handleCategoryChange}
              handleBrandChange={handleBrandChange}
              handlePriceChange={handlePriceChange}
              min={minPrice || 0}
              max={maxPrice || 1000}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              categories={categories}
              categoriesLoading={categoriesLoading}
              brands={brands}
              brandsLoading={brandsLoading}
            />
          </Col>

          {/* Products */}
          <Col lg={9} xs={12}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted">Loading products...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">Error: {error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="ri-search-line"
                  style={{ fontSize: "3rem", color: "#ccc" }}
                ></i>
                <p className="mt-3 text-muted">
                  No products found
                  {searchQuery ? ` for &quot;${searchQuery}&quot;` : ""}.
                </p>
                {(searchQuery || selectedBrand.length > 0) && (
                  <button
                    className="btn btn-outline-secondary mt-2"
                    onClick={() => {
                      handleSearchClear();
                      setSelectedBrand([]);
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <Row>
                {filteredProducts.map((item: any, idx: number) => (
                  <div
                    className="col-xl-3 col-md-4 col-6 mb-24 bb-product-box"
                    key={item.id || idx}
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
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ProductsAccordion;
