"use client";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const getEmbedUrl = (url: string) => {
  const videoId = url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${videoId}`;
};

const Yoga = () => {
  const [yogaData, setYogaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/yoga`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setYogaData(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching yoga data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center" }}>Loading...</div>;
  }

  return (
    <section className="section-wishlist padding-tb-50">
      <div className="container">
        <Row>
          {yogaData.length === 0 ? (
            <div style={{ textAlign: "center" }}>No Yoga Videos Found</div>
          ) : (
            yogaData.map((item, index) => (
              <Col lg={3} md={3} sm={12} key={index}>
                <div className="bb-pro-box">
                  <div className="bb-pro-contact">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={getEmbedUrl(item.url)}
                        title="YouTube video"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </div>
    </section>
  );
};

export default Yoga;
