"use client";

import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Row } from "react-bootstrap";

interface OrderItem {
  product_id: number;
  product_name: string;
  thumbnail_image?: string;
  image?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  combined_order_id?: number;
  created_at: string;
  payment_status?: string;
  delivery_status?: string;
  grand_total?: number;
  order_details?: OrderItem[];
  ordered_products?: OrderItem[];
  items?: OrderItem[];
  products?: OrderItem[];
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const loginUser = JSON.parse(
          localStorage.getItem("login_user") || "{}",
        );
        const token =
          loginUser?.token ||
          loginUser?.access_token ||
          loginUser?.api_token ||
          "";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/customer/order-list`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          },
        );

        const data = await res.json();
        console.log("ORDER API STATUS:", res.status);
        console.log("ORDER API RESPONSE:", JSON.stringify(data, null, 2));

        if (!res.ok) {
          setError(data?.message || "অর্ডার লোড করা যায়নি।");
          return;
        }

        // API response structure handle — data.data or data.orders or data
        const list = data?.data || data?.orders || data || [];
        setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError("নেটওয়ার্ক সমস্যা।");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  //  Order এর products বের করো — field name যাই হোক
  const getItems = (order: Order): OrderItem[] => {
    return (
      order.order_details ||
      order.ordered_products ||
      order.items ||
      order.products ||
      []
    );
  };

  //  Product image বের করো
  const getImage = (item: OrderItem): string => {
    return item.thumbnail_image || item.image || "/placeholder.png";
  };

  if (loading) {
    return (
      <section className="section-cart padding-tb-50">
        <div
          className="container"
          style={{ textAlign: "center", padding: "60px 0" }}
        >
          <p>Loading orders...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-cart padding-tb-50">
        <div
          className="container"
          style={{ textAlign: "center", padding: "60px 0", color: "#dc3545" }}
        >
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-cart padding-tb-50">
      <div className="container">
        <Row className="mb-minus-24">
          <div className="col-12 mb-24">
            <Fade
              triggerOnce
              direction="up"
              duration={1000}
              delay={200}
              className="bb-cart-table"
            >
              <table style={{ width: "100%" }}>
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <th>Order ID</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#999",
                        }}
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const items = getItems(order);

                      // ✅ If no items, show order row without products
                      if (items.length === 0) {
                        return (
                          <tr key={order.id} style={{ textAlign: "center" }}>
                            <td>#{order.id}</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString(
                                    "en-GB",
                                  )
                                : "—"}
                            </td>
                            <td>
                              {order.grand_total
                                ? `BDT ${order.grand_total}`
                                : "—"}
                            </td>
                            <td>
                              <span
                                style={{
                                  background:
                                    order.payment_status === "paid"
                                      ? "#d4edda"
                                      : "#fff3cd",
                                  color:
                                    order.payment_status === "paid"
                                      ? "#155724"
                                      : "#856404",
                                  padding: "3px 10px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                }}
                              >
                                {order.payment_status || "Pending"}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{
                                  background: "#e8f4ff",
                                  color: "#0056b3",
                                  padding: "3px 10px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                }}
                              >
                                {order.delivery_status || "Processing"}
                              </span>
                            </td>
                          </tr>
                        );
                      }

                      // ✅ Show a row per product
                      return items.map((item, idx) => (
                        <tr
                          key={`${order.id}-${idx}`}
                          style={{ textAlign: "center" }}
                        >
                          {idx === 0 && (
                            <td rowSpan={items.length}>#{order.id}</td>
                          )}
                          <td>
                            <img
                              src={getImage(item)}
                              alt={item.product_name || "product"}
                              width="56"
                              height="56"
                              style={{
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                              onError={(e: any) => {
                                e.currentTarget.src = "/placeholder.png";
                              }}
                            />
                          </td>
                          <td style={{ textAlign: "left", maxWidth: "200px" }}>
                            {item.product_name || `Product #${item.product_id}`}
                          </td>
                          <td>{item.quantity}</td>
                          {idx === 0 && (
                            <>
                              <td rowSpan={items.length}>
                                {order.created_at
                                  ? new Date(
                                      order.created_at,
                                    ).toLocaleDateString("en-GB")
                                  : "—"}
                              </td>
                              <td rowSpan={items.length}>
                                {order.grand_total
                                  ? `BDT ${order.grand_total}`
                                  : "—"}
                              </td>
                              <td rowSpan={items.length}>
                                <span
                                  style={{
                                    background:
                                      order.payment_status === "paid"
                                        ? "#d4edda"
                                        : "#fff3cd",
                                    color:
                                      order.payment_status === "paid"
                                        ? "#155724"
                                        : "#856404",
                                    padding: "3px 10px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {order.payment_status || "Pending"}
                                </span>
                              </td>
                              <td rowSpan={items.length}>
                                <span
                                  style={{
                                    background: "#e8f4ff",
                                    color: "#0056b3",
                                    padding: "3px 10px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {order.delivery_status || "Processing"}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      ));
                    })
                  )}
                </tbody>
              </table>
            </Fade>
          </div>
        </Row>
      </div>
    </section>
  );
};

export default OrderPage;
