"use client";

import ProductItemCard from "@/components/item/ProductItemCard";
import { RootState } from "@/store";
import {
    setPriceRange,
    setSearchTerm,
    setSelectedCategory,
    setSelectedTags,
    setSortOption,
} from "@/store/reducer/filterReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ShopSidebar from "../shop/sidebar-section/ShopSidebar";

interface ProductsAccordionProps {
    forcedCategory?: string;
}

const SORT_OPTIONS = [
    { value: "", label: "Default" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A–Z" },
    { value: "name_desc", label: "Name: Z–A" },
    { value: "rating_desc", label: "Top Rated" },
    { value: "discount_desc", label: "Biggest Discount" },
];

const parsePrice = (price: any): number => {
    if (price === null || price === undefined || price === "") return 0;
    if (typeof price === "number") return isNaN(price) ? 0 : price;
    const parsed = parseFloat(String(price).replace(/[^\d.]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
};

const normaliseProduct = (item: any) => ({
    id:            item.id,
    title:         item.name,
    slug:          item.slug,
    newPrice:      item.main_price,
    oldPrice:      item.stroked_price,
    image:         item.thumbnail_image,
    imageTwo:      item.thumbnail_image,
    category:      item.category_slug || item.category?.slug || "",
    weight:        item.weight || "",
    rating:        parseFloat(item.rating) || 0,
    quantity:      1,
    has_discount:  item.has_discount || false,
    discount:      parseFloat(item.discount) || 0,
    discount_type: item.discount_type || "",
    sale:          item.has_discount ? `-${item.discount}` : "",
    current_stock: item.current_stock ?? item.stock ?? 0,
    date:          "",
    status:        "",
    location:      "",
    brand:
        typeof item.brand === "object" && item.brand !== null
            ? (item.brand.name ?? "")
            : (item.brand ?? ""),
    brand_id:
        item.brand_id ??
        (typeof item.brand === "object" && item.brand !== null ? item.brand.id : null),
    sku: item.id,
});

const ProductsAccordion = ({ forcedCategory }: ProductsAccordionProps) => {
    const { minPrice, maxPrice, selectedCategory, selectedTags, sortOption } =
        useSelector((state: RootState) => state.filter);

    const dispatch     = useDispatch();
    const router       = useRouter();
    const searchParams = useSearchParams();

    // ── URL params ──
    const urlCategory   = searchParams.get("category");
    const urlKeyword    = searchParams.get("keyword");
    const urlCategoryId = searchParams.get("category_id");
    // FIX: brand ids now live in the URL as ?brands=1,2,3
    // This makes brand behave exactly like category — URL change → fetch → results.
    const urlBrands     = searchParams.get("brands");

    const [data, setData]       = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    const [categories, setCategories]               = useState<any[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [brands, setBrands]                       = useState<any[]>([]);
    const [brandsLoading, setBrandsLoading]         = useState(true);

    const [localSearch, setLocalSearch] = useState("");

    const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;

    // Derive selected brand ids from URL — URL is the single source of truth
    const selectedBrandIds: string[] = useMemo(
        () => (urlBrands ? urlBrands.split(",").filter(Boolean) : []),
        [urlBrands],
    );

    // ── Handlers ──

    const handlePriceChange = useCallback(
        (min: number, max: number) => {
            dispatch(setPriceRange({ min, max }));
        },
        [dispatch],
    );

    const handleCategoryChange = (category: any) => {
        const updated = selectedCategory.includes(category)
            ? selectedCategory.filter((c: any) => c !== category)
            : [...selectedCategory, category];
        dispatch(setSelectedCategory(updated));
    };

    // FIX: brand click → update URL (?brands=1,2,3) → useEffect re-runs →
    // fetch hits /products/search?brands=1,2,3 → Laravel filters by brand_id.
    // Previously brand was local state only, never touched the URL or API.
    const handleBrandChange = (brandId: string | number) => {
        const id     = String(brandId);
        const newIds = selectedBrandIds.includes(id)
            ? selectedBrandIds.filter((b) => b !== id)
            : [...selectedBrandIds, id];

        const params = new URLSearchParams(searchParams.toString());
        if (newIds.length > 0) {
            params.set("brands", newIds.join(","));
        } else {
            params.delete("brands");
        }
        router.push(`?${params.toString()}`);
    };

    const handleTagsChange = (tag: any) => {
        const updated = selectedTags.includes(tag)
            ? selectedTags.filter((t: any) => t !== tag)
            : [...selectedTags, tag];
        dispatch(setSelectedTags(updated));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSortOption(e.target.value));
    };

    const handleUrlKeywordClear = () => {
        dispatch(setSearchTerm(""));
        const params = new URLSearchParams(searchParams.toString());
        params.delete("keyword");
        params.delete("category_id");
        router.push(`/all-products${params.toString() ? `?${params.toString()}` : ""}`);
    };

    const handleClearAll = () => {
        setLocalSearch("");
        dispatch(setPriceRange({ min: 0, max: 0 }));
        dispatch(setSortOption(""));
        dispatch(setSelectedCategory([]));
        if (urlKeyword) dispatch(setSearchTerm(""));
        // Wipe all URL params including brands
        router.push("/all-products");
    };

    // ── Fetch Categories ──
    useEffect(() => {
        (async () => {
            try {
                const res    = await fetch(`${API_BASE}/filter/categories`);
                const result = await res.json();
                setCategories(result?.data || []);
            } catch (err) {
                console.error("Category fetch error:", err);
            } finally {
                setCategoriesLoading(false);
            }
        })();
    }, [API_BASE]);

    // ── Fetch Brands ──
    useEffect(() => {
        (async () => {
            try {
                const res    = await fetch(`${API_BASE}/all-brands`);
                const result = await res.json();
                setBrands(result?.data || []);
            } catch (err) {
                console.error("Brands fetch error:", err);
            } finally {
                setBrandsLoading(false);
            }
        })();
    }, [API_BASE]);

    // ── Fetch Products ──
    // Triggered by ANY URL param change: keyword, category_id, brands.
    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                let rawProducts: any[] = [];

                if (urlKeyword || urlCategoryId || urlBrands) {
                    // Search endpoint handles keyword + category + brands together
                    const params = new URLSearchParams();
                    if (urlKeyword)    params.append("keyword",     urlKeyword);
                    if (urlCategoryId) params.append("category_id", urlCategoryId);
                    if (urlBrands)     params.append("brands",      urlBrands); // sent to Laravel
                    const res    = await fetch(`${API_BASE}/products/search?${params.toString()}`);
                    if (!res.ok) throw new Error("Search failed");
                    const result = await res.json();
                    rawProducts  = result.data || [];

                } else if (selectedCategory.length > 0 || forcedCategory || urlCategory) {
                    // Category browsing (no keyword/brand active)
                    const cats = forcedCategory
                        ? [forcedCategory]
                        : urlCategory
                            ? [urlCategory]
                            : selectedCategory;

                    const responses = await Promise.all(
                        cats.map((cat) =>
                            fetch(`${API_BASE}/products/category/${cat}`)
                                .then((r) => (r.ok ? r.json() : { data: [] }))
                                .catch(() => ({ data: [] })),
                        ),
                    );

                    const merged = responses.flatMap((r) => r.data || []);
                    const seen   = new Set<number>();
                    rawProducts  = merged.filter((item) => {
                        if (seen.has(item.id)) return false;
                        seen.add(item.id);
                        return true;
                    });

                } else {
                    // No filters — fetch all
                    const res = await fetch(`${API_BASE}/all-products`);
                    if (!res.ok) throw new Error("Failed to fetch products");
                    const result = await res.json();
                    rawProducts  = result.data || [];
                }

                setData(rawProducts.map(normaliseProduct));
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        })();
    }, [
        forcedCategory,
        selectedCategory,
        urlCategory,
        urlKeyword,
        urlCategoryId,
        urlBrands,   // ← brand URL param triggers re-fetch just like category
        API_BASE,
    ]);

    // ── Client-side filter + sort ──
    // Brand is now server-side. Client only handles: local search, price, sort.
    const filteredProducts = useMemo(() => {
        let result = [...data];

        // 1. Real-time local text search
        if (localSearch.trim()) {
            const q = localSearch.toLowerCase().trim();
            result = result.filter(
                (item) =>
                    item.title?.toLowerCase().includes(q) ||
                    item.category?.toLowerCase().includes(q) ||
                    item.brand?.toLowerCase().includes(q),
            );
        }

        // 2. Price range
        if (minPrice > 0) {
            result = result.filter((item) => parsePrice(item.newPrice) >= minPrice);
        }
        if (maxPrice > 0) {
            result = result.filter((item) => parsePrice(item.newPrice) <= maxPrice);
        }

        // 3. Sort
        switch (sortOption) {
            case "price_asc":
                result.sort((a, b) => parsePrice(a.newPrice) - parsePrice(b.newPrice));
                break;
            case "price_desc":
                result.sort((a, b) => parsePrice(b.newPrice) - parsePrice(a.newPrice));
                break;
            case "name_asc":
                result.sort((a, b) =>
                    (a.title || "").localeCompare(b.title || "", "bn", { sensitivity: "base" }),
                );
                break;
            case "name_desc":
                result.sort((a, b) =>
                    (b.title || "").localeCompare(a.title || "", "bn", { sensitivity: "base" }),
                );
                break;
            case "rating_desc":
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "discount_desc":
                result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
        }

        // 4. Slice after filter + sort
        return result.slice(0, 12);
    }, [data, localSearch, minPrice, maxPrice, sortOption]);

    const hasActiveFilters =
        !!urlKeyword ||
        !!localSearch.trim() ||
        selectedBrandIds.length > 0 ||
        minPrice > 0 ||
        maxPrice > 0 ||
        !!sortOption;

    return (
        <section className="section-products-details pb-100">
            <div className="container">
                <Row className="bb-pro-box">

                    {/* ── Sidebar ── */}
                    <Col lg={3} xs={12}>
                        <ShopSidebar
                            handleCategoryChange={handleCategoryChange}
                            handleBrandChange={handleBrandChange}
                            handlePriceChange={handlePriceChange}
                            min={minPrice || 0}
                            max={maxPrice || 1000}
                            selectedCategory={selectedCategory}
                            selectedBrandIds={selectedBrandIds}
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                            brands={brands}
                            brandsLoading={brandsLoading}
                        />
                    </Col>

                    {/* ── Products ── */}
                    <Col lg={9} xs={12}>

                        {/* Sort bar */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                            <span className="text-muted" style={{ fontSize: "0.875rem" }}>
                                {loading
                                    ? "Loading…"
                                    : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
                            </span>

                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                {/* Local search */}
                                <div className="d-flex align-items-center gap-1">
                                    <i className="ri-search-line text-muted" style={{ fontSize: "1rem" }} />
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search in results…"
                                        style={{ minWidth: "145px" }}
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                    />
                                    {localSearch && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link p-0 text-muted"
                                            onClick={() => setLocalSearch("")}
                                            title="Clear"
                                        >
                                            <i className="ri-close-line" />
                                        </button>
                                    )}
                                </div>

                                {/* Sort */}
                                <div className="d-flex align-items-center gap-1">
                                    <label
                                        htmlFor="sort-select"
                                        className="text-muted mb-0 text-nowrap"
                                        style={{ fontSize: "0.875rem" }}
                                    >
                                        Sort:
                                    </label>
                                    <select
                                        id="sort-select"
                                        className="form-select form-select-sm"
                                        style={{ minWidth: "175px" }}
                                        value={sortOption}
                                        onChange={handleSortChange}
                                    >
                                        {SORT_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Active filter badges */}
                        {hasActiveFilters && (
                            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                                <small className="text-muted">Active:</small>

                                {urlKeyword && (
                                    <span className="badge bg-primary d-flex align-items-center gap-1">
                                        Search: &quot;{urlKeyword}&quot;
                                        <button
                                            className="btn-close btn-close-white"
                                            style={{ fontSize: "0.55rem" }}
                                            onClick={handleUrlKeywordClear}
                                            aria-label="Remove keyword search"
                                        />
                                    </span>
                                )}

                                {localSearch.trim() && (
                                    <span className="badge bg-secondary d-flex align-items-center gap-1">
                                        Filter: &quot;{localSearch}&quot;
                                        <button
                                            className="btn-close btn-close-white"
                                            style={{ fontSize: "0.55rem" }}
                                            onClick={() => setLocalSearch("")}
                                            aria-label="Remove local search"
                                        />
                                    </span>
                                )}

                                {/* Brand badges — name looked up from brands list by id */}
                                {selectedBrandIds.map((id) => (
                                    <span key={id} className="badge bg-secondary d-flex align-items-center gap-1">
                                        {brands.find((b) => String(b.id) === id)?.name ?? id}
                                        <button
                                            className="btn-close btn-close-white"
                                            style={{ fontSize: "0.55rem" }}
                                            onClick={() => handleBrandChange(id)}
                                            aria-label={`Remove brand ${id}`}
                                        />
                                    </span>
                                ))}

                                {(minPrice > 0 || maxPrice > 0) && (
                                    <span className="badge bg-secondary">
                                        ৳{minPrice} – ৳{maxPrice}
                                    </span>
                                )}

                                {sortOption && (
                                    <span className="badge bg-secondary d-flex align-items-center gap-1">
                                        {SORT_OPTIONS.find((o) => o.value === sortOption)?.label}
                                        <button
                                            className="btn-close btn-close-white"
                                            style={{ fontSize: "0.55rem" }}
                                            onClick={() => dispatch(setSortOption(""))}
                                            aria-label="Remove sort"
                                        />
                                    </span>
                                )}

                                <button
                                    className="btn btn-outline-secondary btn-sm py-0"
                                    style={{ fontSize: "0.75rem" }}
                                    onClick={handleClearAll}
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Product grid */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" />
                                <p className="mt-2 text-muted">Loading products…</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger">Error: {error}</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="ri-search-line" style={{ fontSize: "3rem", color: "#ccc" }} />
                                <p className="mt-3 text-muted">
                                    No products found
                                    {urlKeyword  ? ` for "${urlKeyword}"` : ""}
                                    {localSearch ? ` matching "${localSearch}"` : ""}.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        className="btn btn-outline-secondary mt-2"
                                        onClick={handleClearAll}
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <Row>
                                {filteredProducts.map((item: any, idx: number) => (
                                    <div
                                        className="col-xl-4 col-md-4 col-6 mb-24 bb-product-box"
                                        key={item.id || idx}
                                    >
                                        <Fade triggerOnce direction="up" duration={1000} delay={200}>
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