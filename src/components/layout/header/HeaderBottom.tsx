import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";

import "rc-dropdown/assets/index.css";

const HeaderBottom = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;
  const svgProps: React.SVGProps<SVGSVGElement> = {
    enableBackground: "new 0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg",
  };

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  const openCategoryPopup = () => {
    setIsPopupOpen(true);
  };

  const closeCategoryPopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/filter/categories`,
        );
        const data = await res.json();
        setCategories(data?.data || []);
      } catch (error) {
        console.error("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();

    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/recipe`);
        const data = await res.json();
        // console.log(data);
        setRecipes(data?.data || []);
      } catch (error) {
        console.error("Recipe fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [API_BASE]);

  return (
    <>
      <div className="bb-main-menu-desk">
        <div className="container">
          <Row>
            <div className="col-12">
              <div className="bb-inner-menu-desk">
                <div className="bb-main-menu" id="navbarSupportedContent">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link className="nav-link" href="/">
                        Home
                      </Link>
                    </li>

                    <li className="nav-item bb-dropdown">
                      <Link href="/all-products" className="nav-link ">
                        Products
                      </Link>
                    </li>

                    <li className="nav-item bb-dropdown">
                      <Link
                        onClick={(e) => e.preventDefault()}
                        className="nav-link bb-dropdown-item"
                        href=""
                      >
                        Category
                      </Link>
                      <ul className="bb-dropdown-menu">
                        {loading && (
                          <li>
                            <span>Loading...</span>
                          </li>
                        )}

                        {!loading && categories.length === 0 && (
                          <li>
                            <span>No Category Found</span>
                          </li>
                        )}

                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <Link href={`/category/${cat.slug}`}>
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/offer">
                        <svg
                          {...svgProps}
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          x="0"
                          y="0"
                          viewBox="0 0 64 64"
                        >
                          <g>
                            <path
                              d="M10 16v22c0 .3.1.6.2.8.3.6 6.5 13.8 21 20h.2c.2 0 .3.1.5.1s.3 0 .5-.1h.2c14.5-6.2 20.8-19.4 21-20 .1-.3.2-.5.2-.8V16c0-.9-.6-1.7-1.5-1.9-7.6-1.9-19.3-9.6-19.4-9.7-.1-.1-.2-.1-.4-.2-.1 0-.1 0-.2-.1h-.9c-.1 0-.2.1-.3.1-.1.1-.2.1-.4.2s-11.8 7.8-19.4 9.7c-.7.2-1.3 1-1.3 1.9zm4 1.5c6.7-2.1 15-7.2 18-9.1 3 1.9 11.3 7 18 9.1v20c-1.1 2.1-6.7 12.1-18 17.3-11.3-5.2-16.9-15.2-18-17.3z"
                              fill="#000000"
                              opacity="1"
                              data-original="#000000"
                            ></path>
                            <path
                              d="M28.6 38.4c.4.4.9.6 1.4.6s1-.2 1.4-.6l9.9-9.9c.8-.8.8-2 0-2.8s-2-.8-2.8 0L30 34.2l-4.5-4.5c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8z"
                              fill="#000000"
                              opacity="1"
                              data-original="#000000"
                            ></path>
                          </g>
                        </svg>{" "}
                        Offers
                      </Link>
                    </li>
                    <li className="nav-item bb-dropdown">
                      <Link
                        className="nav-link bb-dropdown-item"
                        href="/wholesale"
                      >
                        Wholesale
                      </Link>
                    </li>

                    <li className="nav-item bb-dropdown">
                      <Link
                        onClick={(e) => e.preventDefault()}
                        className="nav-link bb-dropdown-item"
                        href=""
                      >
                        Recipe
                      </Link>
                      <ul className="bb-dropdown-menu">
                        {loading && (
                          <li>
                            <span>Loading...</span>
                          </li>
                        )}

                        {!loading && recipes.length === 0 && (
                          <li>
                            <span>No Recipe Found</span>
                          </li>
                        )}

                        {recipes.map((cat) => (
                          <li key={cat.id}>
                            <Link href={`/recipe/${cat.slug}`}>
                              {cat.category_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/about-us">
                        About Us
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/blog">
                        Blog
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" href="/contact-us">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Row>
        </div>
      </div>
      {/*<CategoryPopup isPopupOpen={isPopupOpen} closeCategoryPopup={closeCategoryPopup} />*/}
    </>
  );
};

export default HeaderBottom;
