"use client";
import React, { useEffect, useState } from "react";
import WholesaleCard from "./wholesaleCard/wholesaleCard";

interface Product {
  id: number;
  name: string;
  thumbnail_image: string;
  stroked_price?: string;
  current_stock?: number;
}

interface SelectedItem {
  product_id: number;
  quantity: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

const WholesalePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<
    Partial<FormData & { products: string }>
  >({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/all-products`,
        );
        const text = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch (_) {}
        const list: Product[] = data?.data ?? [];
        setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Products fetch error:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("wholesale_cart");
    if (saved) {
      try {
        setSelectedItems(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const saveToLS = (items: SelectedItem[]) =>
    localStorage.setItem("wholesale_cart", JSON.stringify(items));

  const handleToggle = (productId: number) => {
    const exists = selectedItems.find((i) => i.product_id === productId);
    const updated = exists
      ? selectedItems.filter((i) => i.product_id !== productId)
      : [...selectedItems, { product_id: productId, quantity: 1 }];
    setSelectedItems(updated);
    saveToLS(updated);
  };

  const handleQuantityChange = (productId: number, qty: number) => {
    const updated = selectedItems.map((i) =>
      i.product_id === productId ? { ...i, quantity: qty } : i,
    );
    setSelectedItems(updated);
    saveToLS(updated);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.postal_code.trim()) e.postal_code = "Postal code is required";
    if (selectedItems.length === 0)
      e.products = "Please select at least 1 product";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        products: selectedItems.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/whole-sale-order/store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (_) {}
      if (!res.ok) {
        alert(data?.message || "Order could not be placed.");
        return;
      }
      setSubmitSuccess(true);
      setSelectedItems([]);
      localStorage.removeItem("wholesale_cart");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postal_code: "",
      });
    } catch (_) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProductIds = selectedItems.map((i) => i.product_id);

  return (
    <>
      <style>{`
        /* ── Reset ── */
        .ws * { box-sizing: border-box; }

        /* ── Page ── */
        .ws {
          font-family: 'Segoe UI', sans-serif;
          background: #f5f8f0;
          min-height: 100vh;
          padding-bottom: 60px;
        }

        /* ── Header ── */
        .ws-hdr {
          background: linear-gradient(135deg, #1a2008, #3d6b0e);
          padding: 36px 24px 44px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ws-hdr::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 25% 50%, rgba(130,188,35,0.13) 0%, transparent 60%);
        }
        .ws-hdr__tag {
          display: inline-block;
          background: rgba(130,188,35,0.2);
          border: 1px solid rgba(130,188,35,0.5);
          color: #b8e05a;
          font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 3px 14px; border-radius: 20px;
          margin-bottom: 10px; position: relative;
        }
        .ws-hdr h1 { font-size: clamp(20px,4vw,36px); color:#fff; font-weight:800; position:relative; margin:0 0 6px; }
        .ws-hdr p  { color:rgba(255,255,255,0.55); font-size:13px; position:relative; margin:0; }

        /* ── Top split: Form | Selected Cards ── */
        .ws-top {
          max-width: 1300px;
          margin: 32px auto 0;
          padding: 0 30px;
          display: grid;
          grid-template-columns: 520px 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 860px) { .ws-top { grid-template-columns: 1fr; } }

        /* ── Form panel ── */
        .ws-form-panel {
          background: #fff;
          border: 1px solid #d6e8b0;
          border-radius: 12px;
          padding: 24px;
          position: sticky;
          top: 16px;
        }
        .ws-form-panel h2 {
          font-size: 16px; font-weight: 800; color: #1a2008;
          margin: 0 0 18px; padding-bottom: 12px;
          border-bottom: 2px solid #e8f2d0;
          display: flex; align-items: center; gap: 8px;
        }
        .ws-fg { margin-bottom: 13px; }
        .ws-fg label {
          display: block; font-size: 11px; font-weight: 700;
          color: #6a7a50; margin-bottom: 4px;
          text-transform: uppercase; letter-spacing: 0.6px;
        }
        .ws-fg input {
          width: 100%; height: 38px;
          border: 1.5px solid #d6e8b0; border-radius: 7px;
          padding: 0 11px; font-size: 14px; color: #1a2008;
          background: #fafff5; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ws-fg input:focus { border-color: #82bc23; box-shadow: 0 0 0 3px rgba(130,188,35,0.12); }
        .ws-fg input.err { border-color: #ef4444; }
        .ws-errmsg { font-size: 11px; color: #ef4444; margin-top: 3px; }
        .ws-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
        .ws-submit {
          width: 100%; height: 44px; margin-top: 6px;
          background: linear-gradient(90deg, #82bc23, #6aa81e);
          color: #fff; border: none; border-radius: 8px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s;
        }
        .ws-submit:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(130,188,35,0.35); transform: translateY(-1px); }
        .ws-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Selected cards panel ── */
        .ws-sel-panel {}
        .ws-sel-title {
          font-size: 15px; font-weight: 700; color: #1a2008;
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .ws-sel-title .cnt {
          background: #82bc23; color: #fff;
          font-size: 12px; padding: 2px 10px; border-radius: 20px;
          text: center;
        }
        .ws-sel-empty {
          background: #fff; border: 2px dashed #d6e8b0;
          border-radius: 10px; padding: 36px 20px;
          text-align: center; color: #9ab070; font-size: 14px;
        }
        .ws-sel-empty .icon { font-size: 36px; margin-bottom: 8px; }
        /* Selected cards grid */
        .ws-sel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 14px;
        }
        .ws-sel-card {
          background: #fff;
          border: 2px solid #82bc23;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }
        .ws-sel-card__img-wrap {
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #f0f7e0;
        }
        .ws-sel-card__img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .ws-sel-card__body { padding: 7px 9px 9px; }
        .ws-sel-card__name {
          font-size: 12px; font-weight: 600; color: #1a2008;
          line-height: 1.3; margin: 0 0 6px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          text-align: center;
        }
        .ws-sel-card__qty {
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .ws-sel-qty-btn {
          width: 24px; height: 24px;
          background: #82bc23; color: #fff;
          border: none; border-radius: 5px;
          font-size: 15px; font-weight: 700;
          cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .ws-sel-qty-btn:hover { background: #6aa81e; }
        .ws-sel-qty-val { font-size: 13px; font-weight: 700; color: #1a2008; min-width: 22px; text-align: center; }
        .ws-sel-remove {
          position: absolute; top: 5px; right: 5px;
          width: 20px; height: 20px;
          background: #ef4444; color: #fff;
          border: none; border-radius: 50%;
          font-size: 11px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4;
        }
        .ws-sel-remove:hover { background: #dc2626; }

        /* ── Products error ── */
        .ws-prod-err {
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 6px; padding: 8px 12px;
          font-size: 12px; color: #ef4444; margin-bottom: 14px;
        }

        /* ── Bottom: Product selection grid ── */
        .ws-bottom {
          max-width: 1300px;
          margin: 36px auto 0;
          padding: 0 20px;
        }
        .ws-divider { border: none; border-top: 2px dashed #d6e8b0; margin-bottom: 28px; }
        .ws-bot-title {
          font-size: 16px; font-weight: 700; color: #1a2008;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .ws-bot-title span { background: #82bc23; color: #fff; font-size: 12px; padding: 4px 10px; border-radius: 20px; }
        .ws-prod-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 items per row */
  gap: 12px;
}
  .ws-prod-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

@media (max-width: 1400px) {
  .ws-prod-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1200px) {
  .ws-prod-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .ws-prod-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .ws-prod-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .ws-prod-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
        .ws-prod-msg { grid-column: 1/-1; text-align: center; padding: 40px; color: #82bc23; font-size: 14px; }

        /* ── Success ── */
        .ws-success {
          background: #fff; border: 1px solid #d6e8b0;
          border-radius: 12px; padding: 40px 24px;
          text-align: center;
        }
        .ws-success__ico {
          width: 64px; height: 64px; background: #82bc23;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 30px; margin: 0 auto 16px;
        }
        .ws-success h3 { font-size: 20px; font-weight: 800; color: #1a2008; margin-bottom: 8px; }
        .ws-success p  { font-size: 14px; color: #6a7a50; }
        .ws-success-btn {
          margin-top: 18px; background: #82bc23; color: #fff;
          border: none; border-radius: 8px;
          padding: 10px 26px; font-size: 14px; font-weight: 600; cursor: pointer;
        }
      `}</style>

      <div className="ws">
        <div className="ws-top p-4">
          {/* Form */}
          <div className="ws-form-panel p-4">
            {submitSuccess ? (
              <div className="ws-success">
                <div className="ws-success__ico"></div>
                <h3>Order Successful!</h3>
                <p>
                  Your wholesale order has been placed. We will contact you
                  soon.
                </p>
                <button
                  className="ws-success-btn"
                  onClick={() => setSubmitSuccess(false)}
                >
                  New Order
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2>Order Form</h2>

                <div className="ws-fg">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={errors.name ? "err" : ""}
                  />
                  {errors.name && <p className="ws-errmsg">{errors.name}</p>}
                </div>

                <div className="ws-fg">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={errors.email ? "err" : ""}
                  />
                  {errors.email && <p className="ws-errmsg">{errors.email}</p>}
                </div>

                <div className="ws-fg">
                  <label>Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={errors.phone ? "err" : ""}
                  />
                  {errors.phone && <p className="ws-errmsg">{errors.phone}</p>}
                </div>

                <div className="ws-fg">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className={errors.address ? "err" : ""}
                  />
                  {errors.address && (
                    <p className="ws-errmsg">{errors.address}</p>
                  )}
                </div>

                <div className="ws-2col">
                  <div className="ws-fg">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Dhaka"
                      value={formData.city}
                      onChange={handleFormChange}
                      className={errors.city ? "err" : ""}
                    />
                    {errors.city && <p className="ws-errmsg">{errors.city}</p>}
                  </div>
                  <div className="ws-fg">
                    <label>Postal Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      placeholder="1200"
                      value={formData.postal_code}
                      onChange={handleFormChange}
                      className={errors.postal_code ? "err" : ""}
                    />
                    {errors.postal_code && (
                      <p className="ws-errmsg">{errors.postal_code}</p>
                    )}
                  </div>
                </div>

                {errors.products && (
                  <div className="ws-prod-err">{errors.products}</div>
                )}

                <button
                  type="submit"
                  className="ws-submit"
                  disabled={submitting}
                >
                  {submitting ? "Placing order..." : "Place Wholesale Order"}
                </button>
              </form>
            )}
          </div>

          {/* Selected Cards Panel */}
          <div className="ws-sel-panel">
            <div className="ws-sel-title">
              Selected Products
              {selectedItems.length > 0 && (
                <span className="cnt">{selectedItems.length}</span>
              )}
            </div>

            {selectedItems.length === 0 ? (
              <div className="ws-sel-empty">
                <div className="icon">🛒</div>
                <p>
                  No products selected yet.
                  <br />
                  Choose from the grid below.
                </p>
              </div>
            ) : (
              <div className="ws-sel-grid">
                {selectedItems.map((item) => {
                  const p = products.find((p) => p.id === item.product_id);
                  if (!p) return null;
                  return (
                    <div key={item.product_id} className="ws-sel-card">
                      {/* Remove button */}
                      <button
                        className="ws-sel-remove"
                        onClick={() => handleToggle(p.id)}
                        title="Remove"
                      >
                        ✕
                      </button>

                      {/* Image */}
                      <div className="ws-sel-card__img-wrap">
                        <img
                          src={p.thumbnail_image}
                          alt={p.name}
                          className="ws-sel-card__img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://admin.zhennatural.com/public/assets/img/placeholder.jpg";
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="ws-sel-card__body">
                        <p className="ws-sel-card__name">{p.name}</p>
                        {/* Quantity */}
                        <div className="ws-sel-card__qty">
                          <button
                            className="ws-sel-qty-btn"
                            onClick={() =>
                              handleQuantityChange(
                                p.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                          >
                            −
                          </button>
                          <span className="ws-sel-qty-val">
                            {item.quantity}
                          </span>
                          <button
                            className="ws-sel-qty-btn"
                            onClick={() =>
                              handleQuantityChange(p.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM: All products to select from ── */}
        <div className="ws-bottom">
          <hr className="ws-divider" />
          <div className="ws-bot-title">
            Select Products
            {!loadingProducts && <span>{products.length} products</span>}
          </div>

          <div className="ws-prod-grid">
            {loadingProducts ? (
              <div className="ws-prod-msg">Loading products... </div>
            ) : products.length === 0 ? (
              <div className="ws-prod-msg">No products found.</div>
            ) : (
              products.map((product) => (
                <WholesaleCard
                  key={product.id}
                  product={product}
                  selected={selectedProductIds.includes(product.id)}
                  quantity={
                    selectedItems.find((i) => i.product_id === product.id)
                      ?.quantity ?? 1
                  }
                  onToggle={handleToggle}
                  onQuantityChange={handleQuantityChange}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WholesalePage;
