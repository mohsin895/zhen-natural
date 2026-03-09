"use client";
import { login } from "@/store/reducer/loginSlice";
import { Formik, FormikHelpers, FormikProps } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fade } from "react-awesome-reveal";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { showSuccessToast } from "../toast-popup/Toastify";

interface FormValues {
  name: string;
  password: string;
  phoneNumber: string;
}

const registerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

  .auth-page-wrapper {
    min-height: 100vh;
    background: #f7f5f0;
    display: flex;
    align-items: center;
    padding: 60px 0;
    position: relative;
    overflow: hidden;
  }
  .auth-page-wrapper::before {
    content: '';
    position: absolute;
    top: -120px;
    right: -120px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(130,188,35,0.10) 0%, transparent 70%);
    pointer-events: none;
  }
  .auth-page-wrapper::after {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(14,215,255,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .auth-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 56px 52px;
    box-shadow: 0 8px 48px rgba(60,80,20,0.08), 0 1px 3px rgba(0,0,0,0.04);
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .auth-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    border-radius: 24px 24px 0 0;
    background: linear-gradient(90deg, #82bc23 0%, #0ed7ff 100%);
  }
  .auth-leaf-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, #f0f9e0 0%, #e6f7ff 100%);
    margin: 0 auto 24px;
  }
  .auth-leaf-icon svg {
    width: 28px;
    height: 28px;
  }
  .auth-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 600;
    color: #1a2a0a;
    text-align: center;
    margin-bottom: 6px;
    line-height: 1.2;
    letter-spacing: -0.5px;
  }
  .auth-title span {
    background: linear-gradient(90deg, #82bc23, #0ed7ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .auth-subtitle {
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    color: #8a9a7a;
    text-align: center;
    margin-bottom: 36px;
    font-weight: 300;
    letter-spacing: 0.3px;
  }
  .auth-field {
    margin-bottom: 20px;
  }
  .auth-label {
    display: block;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #5a6a4a;
    margin-bottom: 8px;
  }
  .auth-input {
    width: 100%;
    height: 52px;
    border: 1.5px solid #e8ede0 !important;
    border-radius: 12px !important;
    background: #fafaf7 !important;
    font-family: 'Jost', sans-serif !important;
    font-size: 15px !important;
    color: #1a2a0a !important;
    padding: 0 18px !important;
    transition: all 0.25s ease !important;
    box-shadow: none !important;
  }
  .auth-input:focus {
    border-color: #82bc23 !important;
    background: #fff !important;
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(130,188,35,0.10) !important;
  }
  .auth-input::placeholder {
    color: #b8c8a8 !important;
    font-weight: 300 !important;
  }
  .auth-submit-btn {
    width: 100%;
    height: 52px;
    background: linear-gradient(90deg, #82bc23 0%, #6aa81e 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'Jost', sans-serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(130,188,35,0.25);
    margin-top: 8px;
  }
  .auth-submit-btn:hover:not(:disabled) {
    background: linear-gradient(90deg, #74aa1f 0%, #82bc23 100%);
    box-shadow: 0 6px 24px rgba(130,188,35,0.35);
    transform: translateY(-1px);
  }
  .auth-submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
  }
  .auth-divider-line {
    flex: 1;
    height: 1px;
    background: #e8ede0;
  }
  .auth-divider-text {
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    color: #b8c8a8;
    letter-spacing: 0.5px;
  }
  .auth-secondary-btn {
    width: 100%;
    height: 52px;
    background: transparent;
    border: 1.5px solid #e8ede0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .auth-secondary-btn:hover {
    border-color: #82bc23;
    background: #f7fbf0;
  }
  .auth-secondary-text {
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    color: #5a6a4a;
  }
  .auth-secondary-link {
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #82bc23;
    text-decoration: none;
    transition: color 0.2s;
  }
  .auth-secondary-link:hover {
    color: #0ed7ff;
  }
  .auth-error-msg {
    color: #e05555;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    text-align: center;
    margin-bottom: 16px;
    padding: 10px 16px;
    background: #fff5f5;
    border-radius: 8px;
    border: 1px solid #fecaca;
  }
`;

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    phoneNumber: yup
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const initialValues: FormValues = {
    name: "",
    phoneNumber: "",
    password: "",
  };

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    formikHelpers.setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phoneNumber,
          password: values.password,
        }),
      });

      const data = await res.json();
      console.log("Register API response:", data);

      if (!res.ok) {
        const errorMsg =
          data?.message ||
          (data?.errors
            ? Object.values(data.errors).flat().join(", ")
            : "Registration failed. Please try again.");
        formikHelpers.setStatus({ error: errorMsg });
        return;
      }

      const userData = data?.data || data;
      dispatch(login(userData));

      if (typeof window !== "undefined") {
        localStorage.setItem("login_user", JSON.stringify(userData));
      }

      showSuccessToast("Registration successful!");
      formikHelpers.resetForm();
      router.push("/");
    } catch (err) {
      console.error("Register error:", err);
      formikHelpers.setStatus({
        error: "Something went wrong. Please try again.",
      });
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <>
      <style>{registerStyles}</style>
      <section className="auth-page-wrapper">
        <div className="container">
          <Row>
            <Col sm={12}>
              <Fade triggerOnce direction="up" duration={800} delay={100}>
                <div className="auth-card">
                  {/* Icon */}
                  <div className="auth-leaf-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 8C8 10 5.9 16.17 3.82 19.83 3.42 20.56 3.83 21.45 4.62 21.73 8 23 12 19 12 19C14 17 18 16 19 12C20.47 7.6 17 8 17 8Z"
                        fill="#82bc23"
                      />
                      <path
                        d="M3 21C5 17 8 13 12 12"
                        stroke="#82bc23"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <h2 className="auth-title">
                    Create <span>Account</span>
                  </h2>
                  <p className="auth-subtitle">
                    Join us and discover natural goodness
                  </p>

                  <Formik
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                  >
                    {({
                      handleSubmit,
                      handleChange,
                      values,
                      errors,
                      status,
                      isSubmitting,
                    }: FormikProps<FormValues>) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        {status?.error && (
                          <div className="auth-error-msg">{status.error}</div>
                        )}

                        {/* Name */}
                        <div className="auth-field">
                          <label className="auth-label">Full Name</label>
                          <Form.Group>
                            <InputGroup>
                              <Form.Control
                                value={values.name}
                                onChange={handleChange}
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                required
                                isInvalid={!!errors.name}
                                className="auth-input"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.name}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </div>

                        {/* Phone */}
                        <div className="auth-field">
                          <label className="auth-label">Phone Number</label>
                          <Form.Group>
                            <InputGroup>
                              <Form.Control
                                value={values.phoneNumber}
                                onChange={handleChange}
                                isInvalid={!!errors.phoneNumber}
                                type="text"
                                name="phoneNumber"
                                placeholder="01XXXXXXXXX"
                                required
                                className="auth-input"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.phoneNumber}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                          <label className="auth-label">Password</label>
                          <Form.Group>
                            <InputGroup>
                              <Form.Control
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                className="auth-input"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.password}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </div>

                        <button
                          type="submit"
                          className="auth-submit-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Creating Account..."
                            : "Create Account"}
                        </button>

                        <div className="auth-divider">
                          <div className="auth-divider-line" />
                          <span className="auth-divider-text">OR</span>
                          <div className="auth-divider-line" />
                        </div>

                        <button type="button" className="auth-secondary-btn">
                          <span className="auth-secondary-text">
                            Already registered? Please
                          </span>
                          <Link href="/login" className="auth-secondary-link">
                            Login
                          </Link>
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Fade>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Register;

export const getRegistrationData = () => {
  if (typeof window !== "undefined") {
    const registrationData = localStorage.getItem("registrationData");
    return registrationData ? JSON.parse(registrationData) : [];
  }
  return [];
};

export const setRegistrationData = (data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("registrationData", JSON.stringify(data));
  }
};
