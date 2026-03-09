import { Col, Row } from "react-bootstrap";

const Breadcrumb = ({ title }: any) => {
  return (
    <section
      className="section-breadcrumb margin-b-50 text-center"
      style={{
        background:
          "linear-gradient(180deg, rgba(11, 201, 0, 0.03125) 9%, rgba(0, 167, 201, 0.32816876750700286) 100%)",
        padding: "48px 0",
      }}
    >
      <div className="container">
        <Row>
          <div className="col-12">
            <Row className="bb-breadcrumb-inner justify-content-center">
              <Col md={12} sm={12}>
                {/* <h2 className="bb-breadcrumb-title text-[32px] text-center">
                                    {title}
                                </h2> */}
              </Col>
            </Row>
          </div>
        </Row>
      </div>
    </section>
  );
};

export default Breadcrumb;
