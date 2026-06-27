import { Formik, FormikHelpers } from "formik";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import * as yup from "yup";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  content: string;
}

const Contact: React.FC = () => {
  // Validation schema
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .matches(/^\d{10,12}$/, "Phone must be 10-12 digits")
      .required("Phone is required"),
    content: yup.string().required("Message is required"),
  });

  // Initial form values
  const initialValues: FormValues = {
    name: "",
    email: "",
    phone: "",
    content: "",
  };

  // Submit handler
  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Message sent successfully!");
      formikHelpers.resetForm();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error sending message");
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <section className="section-contact padding-tb-50">
      <div className="container">
        <Row className="mb-minus-24">
          <Col sm={12}>
            <Fade triggerOnce direction="up" duration={1000} delay={200}>
              <div className="section-title bb-center">
                <div className="section-detail">
                  <h2 className="bb-title">
                    Get In <span>Touch</span>
                  </h2>
                  <p>
                    Please select a topic below related to your inquiry. If you
                    don&apos;t find what you need, fill out our contact form.
                  </p>
                </div>
              </div>
            </Fade>
          </Col>

          <Col lg={6} sm={12} className="mb-24">
            <Fade triggerOnce direction="up" duration={1000} delay={400}>
              <div className="bb-contact-form">
                <Formik
                  initialValues={initialValues}
                  validationSchema={schema}
                  onSubmit={handleSubmit}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors,
                    isSubmitting,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      {/* Name */}
                      <Form.Group className="bb-contact-wrap mb-3">
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter Your Name"
                          value={values.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name && touched.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Email */}
                      <Form.Group className="bb-contact-wrap mb-3">
                        <InputGroup>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter Your Email"
                            value={values.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email && touched.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      {/* Phone */}
                      <Form.Group className="bb-contact-wrap mb-3">
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Enter Your Phone Number"
                          value={values.phone}
                          onChange={handleChange}
                          isInvalid={!!errors.phone && touched.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Message */}
                      <Form.Group className="bb-contact-wrap mb-3">
                        <Form.Control
                          as="textarea"
                          name="content"
                          rows={4}
                          placeholder="Please leave your comments here..."
                          value={values.content}
                          onChange={handleChange}
                          isInvalid={!!errors.content && touched.content}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.content}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="bb-contact-button">
                        <button
                          type="submit"
                          className="bb-btn-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Submit"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Fade>
          </Col>

          {/* Map */}
          <Col lg={6} sm={12}>
            <Fade triggerOnce direction="up" duration={1000} delay={600}>
              <div className="bb-contact-maps">
                <iframe
                  src="https://maps.google.com/maps?q=117/A%20Bir%20Uttam%20Ziaur%20Rahman%20Road,%20Dhaka%201215,%20Bangladesh&z=17&output=embed"
                  loading="lazy"
                  style={{ width: "100%", height: "400px", border: 0 }}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Contact;
