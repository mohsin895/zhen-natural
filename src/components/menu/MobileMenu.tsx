"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Collapse from "react-bootstrap/Collapse";

const MobileMenu = ({
  isMobileMenuOpen,
  closeMobileManu,
  toggleMainMenu,
  activeMainMenu,
}: any) => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;

  const toggleSubMenu = (submenu: string) => {
    setActiveSubMenu((prevSubMenu) =>
      prevSubMenu === submenu ? null : submenu,
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/filter/categories`);
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
        const res = await fetch(`${API_BASE}/recipe`);
        const data = await res.json();
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
      <div
        style={{ display: isMobileMenuOpen ? "block" : "none" }}
        onClick={closeMobileManu}
        className="bb-mobile-menu-overlay"
      ></div>

      <div
        id="bb-mobile-menu"
        className={`bb-mobile-menu ${isMobileMenuOpen ? "bb-menu-open" : ""}`}
      >
        <div className="bb-menu-title">
          <span className="menu_title">My Menu</span>
          <button
            onClick={closeMobileManu}
            type="button"
            className="bb-close-menu"
          >
            ×
          </button>
        </div>

        <div className="bb-menu-inner">
          <div className="bb-menu-content">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>

              <li>
                <Link href="/all-products">Products</Link>
              </li>

              {/* CATEGORY */}
              <li>
                <span
                  onClick={() => toggleMainMenu("Categories")}
                  className="menu-toggle"
                ></span>

                <Link onClick={() => toggleMainMenu("Categories")} href="">
                  Categories
                </Link>

                <Collapse in={activeMainMenu === "Categories"}>
                  <ul
                    style={{
                      display:
                        activeMainMenu === "Categories" ? "block" : "none",
                    }}
                    className="sub-menu height-transition-1s-ease"
                  >
                    {loading && (
                      <li>
                        <span></span>
                      </li>
                    )}

                    {!loading && categories.length === 0 && (
                      <li>
                        <span>No Category Found</span>
                      </li>
                    )}

                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              </li>

              <li>
                <Link href="/offer">Offers</Link>
              </li>

              <li>
                <Link href="/wholesale">Wholesale</Link>
              </li>

              {/* RECIPE */}
              <li>
                <span
                  onClick={() => toggleMainMenu("Recipe")}
                  className="menu-toggle"
                ></span>

                <Link onClick={() => toggleMainMenu("Recipe")} href="">
                  Recipe
                </Link>

                <Collapse in={activeMainMenu === "Recipe"}>
                  <ul
                    style={{
                      display: activeMainMenu === "Recipe" ? "block" : "none",
                    }}
                    className="sub-menu height-transition-1s-ease"
                  >
                    {loading && (
                      <li>
                        <span></span>
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
                </Collapse>
              </li>

              <li>
                <Link href="/about-us">About Us</Link>
              </li>

              <li>
                <Link href="/blog">Blog</Link>
              </li>

              <li>
                <Link href="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="header-res-lan-curr">
            <div className="header-res-social">
              <div className="header-top-social">
                <ul className="mb-0">
                  <li className="list-inline-item">
                    <Link href="#">
                      <i className="ri-facebook-fill"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link href="#">
                      <i className="ri-twitter-fill"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link href="#">
                      <i className="ri-instagram-line"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link href="#">
                      <i className="ri-linkedin-fill"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
