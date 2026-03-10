"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
interface OrderPageProps {
  id: string | number;
}

interface OrderItem {
  product_id?: number;
  product_name?: string;
  price?: number | string;
  quantity?: number;
  tax?: number | string;
  discount?: number | string;
  thumbnail_image?: string;
  image?: string;
  photo?: string;
}

interface Order {
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_method?: string;
  shipping_method?: string;
  payment_status?: string;
  order_status?: string;
  completion_status?: string;
  delivery_status?: string;
  txn_id?: string;
  created_at?: string;
  sub_total?: number | string;
  shipping_charge?: number | string;
  tax?: number | string;
  discount?: number | string;
  grand_total?: number | string;
  order_details?: OrderItem[];
}

const OrderPage = ({ id }: OrderPageProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();
  const orderId = id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Fetch Order Details ──
  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/customer/order/${orderId}`;
        // console.log(" Fetching:", apiUrl);

        const res = await fetch(apiUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        // console.log("📊 Status:", res.status);

        const data = await res.json();
        // console.log("📦 Response:", data);

        if (!res.ok) {
          setError(data?.message || `Error ${res.status}`);
          setLoading(false);
          return;
        }

        let orderData = data?.data || data?.order || data;
        // console.log("✅ Order:", orderData);

        if (!orderData || typeof orderData !== "object") {
          setError("Invalid order data");
          setLoading(false);
          return;
        }

        if (!orderData.order_details) {
          orderData.order_details = orderData.items || [];
        }

        // console.log("📋 Items:", orderData.order_details?.length);

        setOrder(orderData);
        setLoading(false);
      } catch (error) {
        console.error(" Error:", error);

        const err = error as Error;
        setError("Network error: " + err.message);

        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ── Get Items ──
  const getItems = () => {
    if (!order || !order.order_details) return [];
    return Array.isArray(order.order_details) ? order.order_details : [];
  };

  // ── Get Image ──
  const getImage = (item: OrderItem) => {
    const img = item?.thumbnail_image || item?.image || item?.photo;
    if (!img) return "";
    if (String(img).startsWith("http")) return img;
    const basePath = process.env.NEXT_PUBLIC_PATH || "";
    const cleanPath = String(img).startsWith("/") ? img : `/${img}`;
    return `${basePath}${cleanPath}`;
  };

  // ── Price Parser ──
  const parsePrice = (price: number | string | null | undefined) => {
    if (price === null || price === undefined || price === "") return 0;
    const cleaned = String(price).replace(/[^\d.]/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // ── Loading ──
  if (loading) {
    return (
      <section
        style={{ background: "#f9f9f9", minHeight: "100vh", padding: "50px 0" }}
      >
        <Container>
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "16px", color: "#666" }}>Loading order...</p>
          </div>
        </Container>
      </section>
    );
  }

  // ── Error ──
  if (error || !order) {
    return (
      <section
        style={{ background: "#f9f9f9", minHeight: "100vh", padding: "50px 0" }}
      >
        <Container>
          <div
            style={{ textAlign: "center", padding: "60px 0", color: "#dc3545" }}
          >
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              {error || "Order not found"}
            </p>
            <button
              onClick={() => router.push("/orders")}
              style={{
                padding: "10px 20px",
                background: "#42A590",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ← Back to Orders
            </button>
          </div>
        </Container>
      </section>
    );
  }

  const items = getItems();
  const subtotal =
    parsePrice(order.sub_total) ||
    items.reduce(
      (acc: number, item: OrderItem) =>
        acc + parsePrice(item.price) * (item.quantity || 1),
      0,
    );
  const shippingCharge = parsePrice(order.shipping_charge) || 0;
  const taxAmount = parsePrice(order.tax) || 0;
  const discountAmount = parsePrice(order.discount) || 0;
  const grandTotal =
    parsePrice(order.grand_total) ||
    subtotal + shippingCharge + taxAmount - discountAmount;

  return (
    <section
      style={{ background: "#f9f9f9", minHeight: "100vh", padding: "50px 0" }}
    >
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .order-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
        
        /* Header Section */
        .order-header {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 25px;
        }
        
        .order-code-badge {
          font-size: 18px;
          font-weight: 700;
          
          padding: 10px 16px;
          border-radius: 6px;
        }
        
        .order-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn-simple {
          padding: 10px 16px;
          border: 1.5px solid #ddd;
          background: #fff;
          color: #333;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .btn-simple:hover {
          border-color: #42A590;
          color: #42A590;
          background: #f9ffe9;
        }
        
        .btn-print {
         
        }
        
        .btn-print:hover {
          background: #3a9177;
          color: "#ffff"
        }
        
        /* Logo Section */
        .logo-section {
          text-align: center;
          margin-bottom: 40px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 20px;
        }
        
        .logo-section img {
          max-width: 120px;
          height: auto;
        }
        
        .order-code-center {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }
        
        /* Card Section */
        .    {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        
        .card-title {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 15px;
        }
        
        .card-item {
          display: flex;
          flex-direction: column;
        }
        
        .card-label {
          font-size: 11px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 4px;
        }
        
        .card-value {
          font-size: 13px;
          color: #333;
          font-weight: 500;
          word-break: break-word;
        }
        
        /* Status Badge */
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .badge-pending {
        
        }
        
        .badge-paid {
      
        }
        
        .badge-processing {
        
        }
        
        /* Table */
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0;
        }
        
        .items-table thead {
          background: #f5f5f5;
        }
        
        .items-table th {
          padding: 10px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          border-bottom: 1px solid #ddd;
        }
        
        .items-table td {
          padding: 12px 10px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 13px;
          color: #333;
        }
        
        .items-table tr:hover {
          background: #f9f9f9;
        }
        
        .product-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .product-name-cell {
          font-weight: 600;
          max-width: 220px;
          word-break: break-word;
        }
        
        /* Summary */
        
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 13px;
       
        }
        
        .summary-item:last-child {
          border-bottom: none;
        }
        
        .summary-label {
          color: #666;
          font-weight: 500;
        }
        
        .summary-value {
          color: #333;
          font-weight: 500;
          text-align: right;
        }
        
        .summary-total {
       
          
          font-size: 14px !important;
          font-weight: 700 !important;
          
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .logo-section {
            flex-direction: column;
            gap: 15px;
          }
        }
        
        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .order-code-badge {
            font-size: 16px;
            width: 100%;
            text-align: center;
          }
          
          .order-buttons {
            width: 100%;
            justify-content: stretch;
          }
          
          .btn-simple {
            flex: 1;
          }
          
          .card-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .items-table {
            font-size: 12px;
          }
          
          .items-table th,
          .items-table td {
            padding: 8px;
          }
          
          .product-img {
            width: 40px;
            height: 40px;
          }
          
          .product-name-cell {
            max-width: 150px;
            font-size: 12px;
          }
          
          .card-label {
            font-size: 10px;
          }
          
          .card-value {
            font-size: 12px;
          }
          
          .logo-section img {
            max-width: 100px;
          }
          
          .order-code-center {
            font-size: 18px;
          }
        }
        
       @media print {

  @page {
    size: A4;
    margin: 10mm;
  }

  header,
  nav,
  footer,
  .navbar,
  .footer {
    display: none !important;
  }

  .order-buttons {
    display: none !important;
  }

  body {
    margin: 0;
    padding: 0;
    zoom: 0.85;
  }

  section {
    padding: 0 !important;
    background: #fff !important;
  }

  .order-wrapper {
    max-width: 100% !important;
  }

  /* remove large paddings only in print */
  [style*="paddingLeft: 120px"] {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  * {
    box-shadow: none !important;
  }
}
      `}</style>

      <div className="order-wrapper">
        {/* Header */}
        <div className="order-header">
          <div className="order-code-badge">{order.code}</div>
          <div className="order-buttons">
            <button
              className="btn-simple btn-print"
              onClick={() => window.print()}
            >
              Print
            </button>
            <button
              className="btn-simple"
              onClick={() => router.push("/orders")}
            >
              Back
            </button>
          </div>
        </div>

        {/* Logo Section */}
        <div className="logo-section">
          <img
            src="/assets/img/logo/logo.webp"
            alt="logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/logo.png";
            }}
          />
          <div className="order-code-center">{order.code}</div>
        </div>

        {/* Billing & Shipping */}
        <Row
          style={{
            marginBottom: "20px",
            paddingLeft: "120px",
            paddingRight: "120px",
          }}
        >
          <Col md={6} style={{ marginBottom: "20px" }}>
            <div className="">
              <div className="card-title">Billing Info</div>
              <div className="card-grid">
                <div className="card-item">
                  <span className="card-label">Name</span>
                  <span className="card-value">{order.name}</span>
                </div>
                <div className="card-item">
                  <span className="card-label">Email</span>
                  <span className="card-value">{order.email}</span>
                </div>
                <div className="card-item">
                  <span className="card-label">Phone</span>
                  <span className="card-value">{order.phone}</span>
                </div>
                <div className="card-item">
                  <span className="card-label">Address</span>
                  <span className="card-value">{order.address}</span>
                </div>
              </div>
            </div>
          </Col>

          <Col md={6} style={{ marginBottom: "20px" }}>
            <div className="">
              <div className="card-title">Shipping Info</div>
              <div className="card-grid">
                <div className="card-item">
                  <span className="card-label">Name</span>
                  <span className="card-value">{order.name}</span>
                </div>
                <div className="card-item">
                  <span className="card-label">Email</span>
                  <span className="card-value">{order.email}</span>
                </div>
                <div className="card-item">
                  <span className="card-label">Phone</span>
                  <span className="card-value">{order.phone}</span>
                </div>
                <div className="card-item">
                  <span className="card-label">Address</span>
                  <span className="card-value">{order.address}</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Payment & Status */}
        <Row
          style={{
            marginBottom: "20px",
            paddingLeft: "120px",
            paddingRight: "120px",
          }}
        >
          <Col md={6} style={{ marginBottom: "20px" }}>
            <div className="   ">
              <div className="card-title">Payment Info</div>
              <div className="card-grid">
                <div className="card-item">
                  <span className="card-label">Method</span>
                  <span className="card-value">
                    {order.payment_method || "Cash On Delivery"}
                  </span>
                </div>
                <div className="card-item">
                  <span className="card-label">Amount</span>
                  <span className="card-value">৳ {grandTotal.toFixed(2)}</span>
                </div>
                <div className="card-item">
                  <span className="card-label">TXN ID</span>
                  <span className="card-value">{order.txn_id}</span>
                </div>
                <div className="card-item">
                  <span className="card-label">Date</span>
                  <span className="card-value">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="card-item">
                  <span className="card-label">Payment Status</span>
                  <span className="card-value">
                    <span
                      className={`badge ${
                        order.payment_status === "paid"
                          ? "badge-paid"
                          : "badge-pending"
                      }`}
                    >
                      {order.payment_status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </span>
                </div>
                <div className="card-item">
                  <span className="card-label">Shipping Method</span>
                  <span className="card-value">{order.shipping_method}</span>
                </div>
              </div>
            </div>
          </Col>

          <Col
            md={6}
            style={{
              marginBottom: "20px",
              paddingLeft: "120px",
              paddingRight: "120px",
            }}
          >
            <div className="   ">
              <div className="card-title">Order Status</div>
              <div className="card-grid">
                <div className="card-item">
                  <span className="card-label">Order Status</span>
                  <span className="card-value">
                    <span className="badge badge-processing">
                      {order.order_status || "Processing"}
                    </span>
                  </span>
                </div>
                <div className="card-item">
                  <span className="card-label">Payment Status</span>
                  <span className="card-value">
                    <span
                      className={`badge ${
                        order.payment_status === "paid"
                          ? "badge-paid"
                          : "badge-pending"
                      }`}
                    >
                      {order.payment_status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </span>
                </div>
                <div className="card-item">
                  <span className="card-label">Completion Status</span>
                  <span className="card-value">
                    <span className="badge badge-processing">
                      {order.completion_status ||
                        order.delivery_status ||
                        "Pending"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Items Table */}
        <div style={{ paddingLeft: "120px", paddingRight: "120px" }}>
          <div className="card-title">
            SL &nbsp; &nbsp; Image &nbsp; &nbsp; Name &nbsp; &nbsp; &nbsp;
            Details &nbsp; &nbsp; &nbsp; Price &nbsp; &nbsp; &nbsp; Discount
            &nbsp; &nbsp; &nbsp; TAX/GST &nbsp; &nbsp; &nbsp; Total
          </div>
          {items.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "30px", color: "#999" }}
            >
              No items in this order.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="items-table">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>#</th>
                    <th style={{ width: "60px" }}>Image</th>
                    <th>Name</th>
                    <th style={{ textAlign: "center", width: "60px" }}>
                      Details
                    </th>
                    <th style={{ textAlign: "right", width: "70px" }}>Price</th>
                    <th style={{ textAlign: "right", width: "70px" }}>
                      Discount
                    </th>
                    <th style={{ textAlign: "right", width: "70px" }}>TAX</th>
                    <th style={{ textAlign: "right", width: "70px" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem, idx: number) => {
                    const itemPrice = parsePrice(item.price);
                    const itemTax = parsePrice(item.tax) || 0;
                    const itemDiscount = parsePrice(item.discount) || 0;
                    const itemQty = item.quantity || 1;
                    const itemTotal =
                      itemPrice * itemQty + itemTax - itemDiscount;

                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <img
                            src={getImage(item)}
                            alt={item.product_name || "Product"}
                            className="product-img"
                          />
                        </td>
                        <td className="product-name-cell">
                          {item.product_name || `Product #${item.product_id}`}
                        </td>
                        <td style={{ textAlign: "center" }}>qty: {itemQty}</td>
                        <td style={{ textAlign: "right" }}>
                          ৳ {itemPrice.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {itemDiscount > 0
                            ? `৳ ${itemDiscount.toFixed(2)}`
                            : "-—"}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {itemTax > 0 ? `৳ ${itemTax.toFixed(2)}` : "—"}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            fontWeight: 600,
                            color: "#42A590",
                          }}
                        >
                          ৳ {itemTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={{ paddingLeft: "120px", paddingRight: "120px" }}>
          <div className="card-title">Order Info</div>
          <div className="summary-box">
            <div className="summary-item">
              <span className="summary-label">Is Paid</span>
              <span className="summary-value">
                {order.payment_status === "paid" ? "Yes" : "No"}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">৳ {subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Shipping Charge</span>
              <span className="summary-value">
                + ৳ {shippingCharge.toFixed(2)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">TAX/GST</span>
              <span className="summary-value">+ ৳ {taxAmount.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-item">
                <span className="summary-label">Discount</span>
                <span className="summary-value">
                  - ৳ {discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="summary-item summary-total">
              <span className="summary-label">Grand Total</span>
              <span className="summary-value">৳ {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
