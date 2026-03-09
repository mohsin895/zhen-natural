"use client";
import { RootState } from "@/store";
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

  const { data, error } = useSWR<CategoriesResponse>(
    `${DOMAIN}/filter/categories`,
    fetcher,
    { onSuccess, onError },
  );

  const { data: settingsData } = useSWR<SettingsResponse>(
    `${DOMAIN}/business-settings`,
    fetcher,
  );

  const settingsObj: Record<string, string> =
    settingsData?.data?.reduce(
      (acc: Record<string, string>, item: SettingItem) => {
        acc[item.type] = item.value;
        return acc;
      },
      {},
    ) || {};

  const phone = settingsObj.contact_phone;
  const email = settingsObj.contact_email;
  const address = settingsObj.contact_address;
  const description = settingsObj.about_us_description;

  const facebook = settingsObj.facebook_link;
  const twitter = settingsObj.twitter_link;
  const instagram = settingsObj.instagram_link;
  const linkedin = settingsObj.linkedin_link;

  const categories: Category[] = Array.isArray(data?.data)
    ? hasPaginate
      ? data.data
      : data.data.slice(0, 6)
    : [];

  const toggleDropdown = (dropdown: string) => {
    setDropdownState((current) => (current === dropdown ? null : dropdown));
  };

  const footerStyles = `
    .bb-footer-widget {
      height: 100%;
    }

    @media (max-width: 991px) {
      .bb-footer-widget {
        margin-bottom: 20px;
      }
      .bb-footer-heading {
        font-size: 15px;
        padding: 12px 0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }
      .bb-footer-links,
      .bb-footer-dropdown {
        width: 100%;
      }
      .bb-footer-links ul,
      .bb-footer-dropdown ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
      }
      .bb-footer-links li,
      .bb-footer-dropdown li {
        padding: 10px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: 13px;
      }
      .bb-footer-links li:last-child,
      .bb-footer-dropdown li:last-child {
        border-bottom: none;
      }
      .bb-footer-links a,
      .bb-footer-dropdown a {
        color: #333;
        text-decoration: none;
        display: block;
        padding: 5px 0;
      }
      .bb-footer-detail {
        font-size: 13px;
        line-height: 1.6;
        color: #666;
      }
      .bb-footer-company {
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
      }
      .bb-footer-company img {
        max-width: 120px;
        height: auto;
        margin-bottom: 10px;
      }
      .bb-footer-cont-social {
        margin-top: 0;
      }
      .bb-footer-cont-social ul {
        gap: 15px !important;
        padding-top: 15px;
      }
      .bb-footer-cont-social ul li a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        background-color: #42A590;
        color: white;
        border-radius: 50%;
        font-size: 16px;
        transition: background-color 0.3s;
      }
      .bb-footer-cont-social ul li a:hover {
        background-color: #358b78;
      }
      .footer-bottom {
        padding: 15px 0;
      }
      .footer-bottom h4 {
        font-size: 13px;
        margin: 0;
        color: white;
        line-height: 1.6;
      }
      .footer-bottom a {
        color: white;
        text-decoration: none;
      }
      .footer-bottom a:hover {
        text-decoration: underline;
      }
      .text-center.py-3 {
        padding: 15px 0 !important;
      }
      .text-center.py-3 img {
        max-width: 400px !important;
        height: auto;
      }
    }

    @media (max-width: 768px) {
      .bb-footer-heading {
        font-size: 14px;
        padding: 10px 0;
      }
      .bb-footer-detail {
        font-size: 13px;
      }
      .bb-footer-links li,
      .bb-footer-dropdown li {
        padding: 8px 0;
        font-size: 12px;
      }
      .footer-bottom h4 {
        font-size: 12px;
      }
      .text-center.py-3 img {
        max-width: 350px !important;
      }
    }

    @media (max-width: 576px) {
      .bb-footer-heading {
        font-size: 13px;
        font-weight: 600;
      }
      .bb-footer-detail {
        font-size: 12px;
      }
      .bb-footer-links li,
      .bb-footer-dropdown li {
        padding: 6px 0;
        font-size: 11px;
      }
      .footer-bottom h4 {
        font-size: 10px;
      }
      .text-center.py-3 {
        padding: 10px 0 !important;
      }
      .text-center.py-3 img {
        max-width: 280px !important;
      }
      .bb-footer-company {
        padding-bottom: 15px;
        margin-bottom: 15px;
      }
      .bb-footer-company img {
        max-width: 100px;
      }
    }
  `;

  return (
    <>
      <style>{footerStyles}</style>
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
                <Col lg={3} md={6} sm={12} xs={12} className="bb-footer-cat">
                  <div className="bb-footer-widget bb-footer-company">
                    <img
                      src={"/assets/img/logo/logo.webp"}
                      alt="logo"
                      className="dark width-50 mb-3"
                      style={{ maxWidth: "150px" }}
                    />
                    <p
                      className="bb-footer-detail"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                </Col>

                {/* CATEGORY */}
                <Col lg={2} md={6} sm={12} xs={12}>
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
                      transition={{ duration: 0.3 }}
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
                <Col lg={2} md={6} sm={12} xs={12}>
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
                      transition={{ duration: 0.3 }}
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
                <Col lg={2} md={6} sm={12} xs={12}>
                  <div className="bb-footer-widget">
                    <h4
                      onClick={() => toggleDropdown("account")}
                      className="bb-footer-heading"
                    >
                      Account
                    </h4>
                    <motion.div
                      className="bb-footer-dropdown"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: dropdownState === "account" ? "auto" : 0,
                        opacity: dropdownState === "account" ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <ul>
                        <li>
                          <Link href="/login">Sign In</Link>
                        </li>
                        <li>
                          <Link href="/cart">View Cart</Link>
                        </li>
                        <li>
                          <Link href="/faq">Wishlist</Link>
                        </li>
                        <li>
                          <Link href="/yoga">Yoga</Link>
                        </li>
                        <li>
                          <Link href="/product-left-sidebar">
                            Affiliate Program
                          </Link>
                        </li>
                        <li>
                          <Link href="/checkout">Payments</Link>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </Col>

                {/* CONTACT */}
                <Col
                  lg={3}
                  md={6}
                  sm={12}
                  xs={12}
                  className="bb-footer-cont-social"
                >
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
                      transition={{ duration: 0.3 }}
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
                          <a
                            href={facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="ri-facebook-fill"></i>
                          </a>
                        </li>
                      )}
                      {twitter && (
                        <li>
                          <a
                            href={twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="ri-twitter-fill"></i>
                          </a>
                        </li>
                      )}
                      {instagram && (
                        <li>
                          <a
                            href={instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="ri-instagram-line"></i>
                          </a>
                        </li>
                      )}
                      {linkedin && (
                        <li>
                          <a
                            href={linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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

          {/* SSL Commerz */}
          <div className="text-center py-3">
            <img
              src="/assets/img/sslcommerz.png"
              alt="SSLCommerz Payment Gateway"
              style={{ maxWidth: "480px", height: "auto" }}
            />
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="container text-center">
              <h4>
                Copyright © {new Date().getFullYear()} Zhen Natural. All Rights
                Reserved. Powered by{" "}
                <a
                  href="https://nelsistech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
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
