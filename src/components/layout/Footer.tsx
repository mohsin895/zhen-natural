"use client";
import { RootState } from "@/store";
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
        font-weight: 600;
        margin-bottom: 10px;
      }

      .bb-footer-links,
      .bb-footer-dropdown {
        display: block !important;
        height: auto !important;
        opacity: 1 !important;
      }

      .bb-footer-links ul,
      .bb-footer-dropdown ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
      }

      .bb-footer-links li,
      .bb-footer-dropdown li {
        padding: 6px 0;
        font-size: 13px;
      }

      .bb-footer-detail {
        font-size: 13px;
        line-height: 1.6;
      }

      .bb-footer-company img {
        max-width: 120px;
      }

      .text-center.py-3 img {
        max-width: 350px !important;
      }
    }

    @media (max-width: 576px) {
      .bb-footer-heading {
        font-size: 14px;
      }

      .bb-footer-links li,
      .bb-footer-dropdown li {
        font-size: 12px;
      }

      .text-center.py-3 img {
        max-width: 280px !important;
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
                {/* LOGO */}
                <Col lg={3} md={6} sm={12} xs={12}>
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
                    <h4 className="bb-footer-heading">Category</h4>
                    <div className="bb-footer-links">
                      <ul>
                        {categories.map((item: Category) => (
                          <li key={item.id}>
                            <Link href={`/category/${item.slug}`}>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Col>

                {/* COMPANY */}
                <Col lg={2} md={6} sm={12} xs={12}>
                  <div className="bb-footer-widget">
                    <h4 className="bb-footer-heading">Company</h4>
                    <div className="bb-footer-links">
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
                    </div>
                  </div>
                </Col>

                {/* ACCOUNT */}
                <Col lg={2} md={6} sm={12} xs={12}>
                  <div className="bb-footer-widget">
                    <h4 className="bb-footer-heading">Account</h4>
                    <div className="bb-footer-dropdown">
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
                          <Link href="/checkout">Payments</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>

                {/* CONTACT */}
                <Col lg={3} md={6} sm={12} xs={12}>
                  <div className="bb-footer-widget">
                    <h4 className="bb-footer-heading">Contact</h4>
                    <div className="bb-footer-links">
                      <ul>
                        <li>{address}</li>
                        <li>
                          <Link href={`tel:${phone}`}>{phone}</Link>
                        </li>
                        <li>
                          <Link href={`mailto:${email}`}>{email}</Link>
                        </li>
                      </ul>
                    </div>

                    <ul className="mt-3 d-flex gap-3">
                      {facebook && (
                        <li>
                          <a href={facebook} target="_blank">
                            <i className="ri-facebook-fill"></i>
                          </a>
                        </li>
                      )}
                      {twitter && (
                        <li>
                          <a href={twitter} target="_blank">
                            <i className="ri-twitter-fill"></i>
                          </a>
                        </li>
                      )}
                      {instagram && (
                        <li>
                          <a href={instagram} target="_blank">
                            <i className="ri-instagram-line"></i>
                          </a>
                        </li>
                      )}
                      {linkedin && (
                        <li>
                          <a href={linkedin} target="_blank">
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

          {/* SSL */}
          <div className="text-center py-3">
            <img
              src="/assets/img/sslcommerz/sslcommerz.png"
              alt="sslcommerz Payment Gateway"
              style={{ maxWidth: "480px", height: "auto" }}
            />
          </div>

          {/* Bottom */}
          <div className="footer-bottom">
            <div className="container text-center">
              <h6 className=" text-gray-200">
                Copyright © {new Date().getFullYear()}{" "}
                <a
                  href="https://zhennatural.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7E92CA]"
                >
                  Zhen Natural Ltd .
                </a>{" "}
                All Rights Reserved. Powered by{" "}
                <a
                  href="https://nelsistech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7E92CA]"
                >
                  Nelsis Tech
                </a>
              </h6>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
