"use client";
import { RootState } from "@/store";
import { login } from "@/store/reducer/loginSlice";
import { Formik, FormikHelpers, FormikProps } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";

interface FormValues {
  phone: string;
  password: string;
}

const loginStyles = `
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
  .auth-forgot {
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    color: #82bc23;
    text-decoration: none;
    display: block;
    text-align: right;
    margin-bottom: 28px;
    margin-top: -8px;
    transition: color 0.2s;
  }
  .auth-forgot:hover {
    color: #0ed7ff;
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

const Login = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated,
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const schema = yup.object().shape({
    phone: yup.string().required("Phone number is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const initialValues: FormValues = {
    phone: "",
    password: "",
  };

  const handleLoginBtn = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    formikHelpers.setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: values.phone,
          password: values.password,
        }),
      });

      const data = await res.json();
      console.log("Login API response:", data);

      if (!res.ok) {
        const errorMsg =
          data?.message ||
          (data?.errors
            ? Object.values(data.errors).flat().join(", ")
            : "Invalid phone number or password.");
        showErrorToast(errorMsg);
        formikHelpers.setStatus({ error: errorMsg });
        return;
      }

      const userData = data?.data || data;
      dispatch(login(userData));

      if (typeof window !== "undefined") {
        localStorage.setItem("login_user", JSON.stringify(userData));
      }

      showSuccessToast("User login successful!");
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      showErrorToast("Something went wrong. Please try again.");
      formikHelpers.setStatus({
        error: "Something went wrong. Please try again.",
      });
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <>
      <style>{loginStyles}</style>
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
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                        fill="#82bc23"
                      />
                    </svg>
                  </div>

                  <h2 className="auth-title">
                    Welcome <span>Back</span>
                  </h2>
                  <p className="auth-subtitle">
                    Sign in to your account to continue
                  </p>

                  <Formik
                    validationSchema={schema}
                    onSubmit={handleLoginBtn}
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

                        {/* Phone */}
                        <div className="auth-field">
                          <label className="auth-label">Mobile Number</label>
                          <Form.Group>
                            <InputGroup>
                              <Form.Control
                                onChange={handleChange}
                                value={values.phone}
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="01XXXXXXXXX"
                                required
                                isInvalid={!!errors.phone}
                                className="auth-input"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.phone}
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
                                onChange={handleChange}
                                value={values.password}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                isInvalid={!!errors.password}
                                className="auth-input"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.password}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </div>

                        <a
                          className="auth-forgot"
                          onClick={(e) => e.preventDefault()}
                          href="#"
                        >
                          Forgot Password?
                        </a>

                        <button
                          className="auth-submit-btn"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Signing in..." : "Sign In"}
                        </button>

                        <div className="auth-divider">
                          <div className="auth-divider-line" />
                          <span className="auth-divider-text">OR</span>
                          <div className="auth-divider-line" />
                        </div>

                        <button type="button" className="auth-secondary-btn">
                          <span className="auth-secondary-text">
                            New here? Please
                          </span>
                          <Link
                            href="/register"
                            className="auth-secondary-link"
                          >
                            Create an account
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

export default Login;
