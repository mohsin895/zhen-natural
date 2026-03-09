"use client";
import { RootState } from "@/store";
import { setSelectedCategory } from "@/store/reducer/filterReducer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import fetcher from "../fetcher/Fetcher";
import ScrollButton from "../loader/ScrollButton";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
const PATH = process.env.NEXT_PUBLIC_PATH;

interface Category {
  id: number | string;
  name: string;
  slug: string;
}

interface FooterProps {
  onSuccess?: () => void;
  onError?: () => void;
  hasPaginate?: boolean;
}

interface SettingItem {
  type: string;
  value: string;
}

interface SettingsResponse {
  data: SettingItem[];
}

interface CategoriesResponse {
  data: Category[];
}

const Footer: React.FC<FooterProps> = ({
  onSuccess = () => {},
  onError = () => {},
  hasPaginate = false,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [dropdownState, setDropdownState] = useState<string | null>(null);
  const { selectedCategory } = useSelector((state: RootState) => state.filter);

  // category api
  const { data, error } = useSWR<CategoriesResponse>(
    `${DOMAIN}/filter/categories`,
    fetcher,
    { onSuccess, onError },
  );

  // business settings api
  const { data: settingsData } = useSWR<SettingsResponse>(
    `${DOMAIN}/business-settings`,
    fetcher,
  );

  // convert settings array → object
  const settingsObj: Record<string, string> =
    settingsData?.data?.reduce(
      (acc: Record<string, string>, item: SettingItem) => {
        acc[item.type] = item.value;
        return acc;
      },
      {},
    ) || {};

  const footerLogo = settingsObj.footer_logo
    ? settingsObj.footer_logo.startsWith("http")
      ? settingsObj.footer_logo
      : `${PATH}/${settingsObj.footer_logo}`
    : "/assets/img/logo/logo.webp";

  const phone = settingsObj.contact_phone;
  const email = settingsObj.contact_email;
  const address = settingsObj.contact_address;
  const description = settingsObj.about_us_description;

  const facebook = settingsObj.facebook_link;
  const twitter = settingsObj.twitter_link;
  const instagram = settingsObj.instagram_link;
  const linkedin = settingsObj.linkedin_link;

  // Safely get categories after fetch
  const categories: Category[] = Array.isArray(data?.data)
    ? hasPaginate
      ? data.data
      : data.data.slice(0, 6)
    : [];

  const handleCategoryChange = (categorySlug: string) => {
    dispatch(setSelectedCategory([categorySlug]));
    router.push(`/shop-left-sidebar-col-3?category=${categorySlug}`);
  };

  const toggleDropdown = (dropdown: string) => {
    setDropdownState((current) => (current === dropdown ? null : dropdown));
  };

  return (
    <>
      <ScrollButton />
      <footer
        className="bb-footer margin-t-50"
        style={{
          background:
            "linear-gradient(169deg, rgba(255, 255, 255, 1) 9%, rgba(130, 188, 35, 1) 100%)",
        }}
      >
        <div className="footer-container">
          <div className="footer-top padding-tb-50">
            <div className="container">
              <Row className="m-minus-991">
                {/* LOGO & ABOUT */}
                <Col lg={3} className="bb-footer-cat col-12">
                  <div className="bb-footer-widget bb-footer-company">
                    <img
                      src={"/assets/img/logo/logo.webp"}
                      alt="logo"
                      className="dark width-50 mb-3"
                    />
                    <p
                      className="bb-footer-detail"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                </Col>

                {/* CATEGORY */}
                <Col lg={2} className="col-12">
                  <div className="bb-footer-widget">
                    <h4
                      onClick={() => toggleDropdown("category")}
                      className="bb-footer-heading"
                    >
                      Category
                    </h4>
                    <motion.div
                      className="bb-footer-links"
                      initial={{ height: 0 }}
                      animate={{
                        height: dropdownState === "category" ? "auto" : 0,
                      }}
                    >
                      <ul>
                        {categories.map((item: Category) => (
                          <li key={item.id}>
                            <Link href={`/category/${item.slug}`}>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </Col>

                {/* COMPANY */}
                <Col lg={2} className="bb-footer-account col-12">
                  <div className="bb-footer-widget">
                    <h4
                      onClick={() => toggleDropdown("company")}
                      className="bb-footer-heading"
                    >
                      Company
                    </h4>
                    <motion.div
                      className="bb-footer-links"
                      initial={{ height: 0 }}
                      animate={{
                        height: dropdownState === "company" ? "auto" : 0,
                      }}
                    >
                      <ul>
                        <li>
                          <Link href="/about-us">About us</Link>
                        </li>
                        <li>
                          <Link href="/faq">FAQs</Link>
                        </li>
                        <li>
                          <Link href="/return-and-refund-policy">
                            Return & Refund Policy
                          </Link>
                        </li>
                        <li>
                          <Link href="/terms">Terms & Conditions</Link>
                        </li>
                        <li>
                          <Link href="/privacy-policy">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link href="/contact-us">Contact us</Link>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </Col>

                {/* ACCOUNT */}
                <Col lg={2} className="bb-footer-service col-12">
                  <div className="bb-footer-widget">
                    <h4
                      onClick={() => toggleDropdown("account")}
                      className="bb-footer-heading"
                    >
                      Account
                      <div className="bb-heading-res">
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                    </h4>
                    <motion.div
                      className=" bb-footer-dropdown"
                      initial={{ height: 0, opacity: 0, translateY: -20 }}
                      animate={{
                        height: dropdownState === "account" ? "auto" : 0,
                        opacity: dropdownState === "account" ? 1 : 0,
                        translateY: dropdownState === "account" ? 0 : -20,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{
                        overflow: "hidden",
                        display: "block",
                        paddingBottom:
                          dropdownState === "account" ? "20px" : "0px",
                      }}
                    >
                      <ul className="align-items-center">
                        <li className="bb-footer-link">
                          <Link href="/login">Sign In</Link>
                        </li>
                        <li className="bb-footer-link">
                          <Link href="/cart">View Cart</Link>
                        </li>
                        <li className="bb-footer-link">
                          <Link href="/faq">Wishlist</Link>
                        </li>
                        <li className="bb-footer-link">
                          <Link href="/yoga">Yoga</Link>
                        </li>
                        <li className="bb-footer-link">
                          <Link href="/product-left-sidebar">
                            Affiliate Program
                          </Link>
                        </li>
                        <li className="bb-footer-link">
                          <Link href="/checkout">Payments</Link>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </Col>

                {/* CONTACT */}
                <Col lg={3} className="bb-footer-cont-social col-12">
                  <div className="bb-footer-widget">
                    <h4
                      onClick={() => toggleDropdown("contact")}
                      className="bb-footer-heading"
                    >
                      Contact
                    </h4>
                    <motion.div
                      className="bb-footer-links"
                      initial={{ height: 0 }}
                      animate={{
                        height: dropdownState === "contact" ? "auto" : 0,
                      }}
                    >
                      <ul>
                        <li>{address}</li>
                        <li>
                          <Link href={`tel:${phone}`}>{phone}</Link>
                        </li>
                        <li>
                          <Link href={`mailto:${email}`}>{email}</Link>
                        </li>
                      </ul>
                    </motion.div>

                    <ul className="mt-3 d-flex gap-3">
                      {facebook && (
                        <li>
                          <a href={facebook}>
                            <i className="ri-facebook-fill"></i>
                          </a>
                        </li>
                      )}
                      {twitter && (
                        <li>
                          <a href={twitter}>
                            <i className="ri-twitter-fill"></i>
                          </a>
                        </li>
                      )}
                      {instagram && (
                        <li>
                          <a href={instagram}>
                            <i className="ri-instagram-line"></i>
                          </a>
                        </li>
                      )}
                      {linkedin && (
                        <li>
                          <a href={linkedin}>
                            <i className="ri-linkedin-fill"></i>
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="text-center py-3">
            <img
              src="/assets/img/sslcommerz.png"
              alt="SSLCommerz Payment Gateway"
              style={{ maxWidth: "480px", height: "auto" }}
            />
          </div>
          <div className="footer-bottom">
            <div className="container text-center">
              <h4 className="text-white text-center text-sm sm:text-base sm:pb-0">
                Copyright © {new Date().getFullYear()} Zhen naural. All Rights
                Reserved. Powered by{" "}
                <a
                  href="https://nelsistech.com/"
                  target="_blank"
                  className="text-sm text-white"
                >
                  Nelsis Tech
                </a>
              </h4>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
