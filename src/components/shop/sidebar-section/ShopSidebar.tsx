import PriceRangeSlider from "@/components/price-range/PriceRangeSlider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";

type ShowType = {
  categories: boolean;

  brands: boolean;
};

function ShopSidebar({
  onSuccess = () => {},
  onError = () => {},
  handleCategoryChange,
  selectedCategory,

  handleBrandChange,
  selectedBrand,
  handlePriceChange,
  min,
  max,
  categories,
  categoriesLoading,
  brands,
  brandsLoading,
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(true);
  const [show, setShow] = useState<ShowType>({
    categories: false,
    brands: false,
  });

  useEffect(() => {
    const hiddenPaths = [
      "/product-left-sidebar",
      "/product-right-sidebar",
      "/product-accordion-left-sidebar",
      "/product-accordion-right-sidebar",
    ];

    setShowButton(hiddenPaths.includes(pathname));
  }, [pathname]);

  const limit = 5;

  const handleToggleShow = (key: keyof ShowType) =>
    setShow({ ...show, [key]: !show[key] });

  const getCategoryData = () => {
    if (!categories || categories.length === 0) return [];
    return show.categories === false ? categories.slice(0, limit) : categories;
  };
  const getBrandData = () => {
    if (!brands || brands.length === 0) return [];
    return show.brands === false ? brands.slice(0, limit) : brands;
  };

  const handleFilterBtn = () => {
    router.push("/shop-left-sidebar-col-3");
  };

  const categoryData = getCategoryData();
  const BrandData = getBrandData();

  return (
    <>
      <div className="bb-shop-wrap">
        <div className="bb-sidebar-block">
          <div className="bb-sidebar-title">
            <h3>Category</h3>
          </div>
          <div className="bb-sidebar-contact">
            <ul>
              {categoriesLoading ? (
                <li>
                  <span>Loading categories...</span>
                </li>
              ) : categoryData.length === 0 ? (
                <li>
                  <span>No categories found</span>
                </li>
              ) : (
                categoryData.map((data: any, index: any) => (
                  <li key={data.id || index}>
                    <Fade
                      triggerOnce
                      direction="up"
                      duration={1000}
                      delay={200}
                    >
                      <div className="bb-sidebar-block-item">
                        <input
                          onChange={() => handleCategoryChange(data.slug)}
                          checked={selectedCategory?.includes(data.slug)}
                          type="checkbox"
                        />
                        <Link onClick={(e) => e.preventDefault()} href="/#">
                          {data.name}
                        </Link>
                        <span className="checked"></span>
                      </div>
                    </Fade>
                  </li>
                ))
              )}
              {!categoriesLoading &&
                categories &&
                categories.length > limit && (
                  <li>
                    <a onClick={() => handleToggleShow("categories")}>
                      <small>{show.categories ? "less" : "load more"}</small>
                    </a>
                  </li>
                )}
            </ul>
          </div>
        </div>
        <div className="bb-sidebar-block">
          <div className="bb-sidebar-title">
            <h3>Brands</h3>
          </div>
          <div className="bb-sidebar-contact">
            <ul>
              {brandsLoading ? (
                <li>
                  <span>Loading brands...</span>
                </li>
              ) : BrandData.length === 0 ? (
                <li>
                  <span>No brands found</span>
                </li>
              ) : (
                BrandData.map((data: any, index: any) => (
                  <li key={data.id || index}>
                    <Fade
                      triggerOnce
                      direction="up"
                      duration={1000}
                      delay={200}
                    >
                      <div className="bb-sidebar-block-item">
                        <input
                          onChange={() => handleBrandChange(data.name)}
                          checked={selectedBrand?.includes(data.name)}
                          type="checkbox"
                        />
                        <a onClick={(e) => e.preventDefault()} href="#">
                          {data.name}
                        </a>
                        <span className="checked"></span>
                      </div>
                    </Fade>
                  </li>
                ))
              )}
              {!brandsLoading && brands && brands.length > limit && (
                <li>
                  <a onClick={() => handleToggleShow("brands")}>
                    <small>{show.brands ? "less" : "load more"}</small>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="bb-sidebar-block">
          <div className="bb-sidebar-title">
            <h3>Price</h3>
          </div>
          <PriceRangeSlider
            onPriceChange={handlePriceChange}
            min={min}
            max={max}
          />
        </div>
        {showButton && (
          <div
            style={{
              margin: "20px 10px",
              display: "flex",
              justifyContent: "end",
            }}
            className="input-button"
          >
            <button
              onClick={handleFilterBtn}
              type="button"
              className="bb-btn-2"
            >
              Filter
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ShopSidebar;
