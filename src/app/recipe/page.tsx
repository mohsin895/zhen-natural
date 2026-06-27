"use client";
import React, { useState } from "react";

/* ── Breadcrumb ── */
type BreadcrumbProps = {
  title: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title }) => (
  <div
    style={{
      background:
        "linear-gradient(135deg, #e0f7f7 0%, #b2ebf2 50%, #e8f5e9 100%)",
      padding: "60px 20px",
      textAlign: "center",
    }}
  >
    <h1
      style={{
        fontFamily: '"Trebuchet MS", sans-serif',
        fontSize: "2.2rem",
        fontWeight: "700",
        letterSpacing: "0.15em",
        color: "#2d3436",
        margin: 0,
        textTransform: "uppercase",
      }}
    >
      {title}
    </h1>
  </div>
);

/* ── Mock Data ── */
type BlogType = {
  id: number;
  title: string;
  category: string;
  image: string;
};

const blogs: BlogType[] = [
  {
    id: 1,
    title: "Chia Seeds: A Tiny Seed, A Mighty Nutrient Powerhouse",
    category: "WEIGHT LOSS",
    image:
      "https://images.unsplash.com/photo-1514995669114-6081e934b693?w=400&q=80",
  },
  {
    id: 2,
    title: "Top 10 Foods That Naturally Boost Your Metabolism",
    category: "WEIGHT LOSS",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
  },
  {
    id: 3,
    title: "How to Create a Sustainable Calorie Deficit Without Starving",
    category: "WEIGHT LOSS",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80",
  },
];

const categories = [
  "WEIGHT LOSS",
  "NUTRITION",
  "FITNESS",
  "RECIPES",
  "WELLNESS",
];

/* ── BlogCard ── */
type BlogCardProps = {
  blog: BlogType;
};

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      transition: "transform 0.2s ease, boxShadow 0.2s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.13)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
    }}
  >
    <div style={{ height: "220px", overflow: "hidden", background: "#f0f9f9" }}>
      <img
        src={blog.image}
        alt={blog.title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
    <div style={{ padding: "20px" }}>
      <h3
        style={{
          fontFamily: '"Georgia", serif',
          fontSize: "1.05rem",
          fontWeight: "700",
          color: "#2d3436",
          margin: "0 0 16px 0",
          lineHeight: "1.5",
        }}
      >
        {blog.title}
      </h3>
      <button
        style={{
          background: "linear-gradient(135deg, #26a69a, #00897b)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 22px",
          fontSize: "0.9rem",
          fontWeight: "600",
          cursor: "pointer",
          letterSpacing: "0.03em",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Read More
      </button>
    </div>
  </div>
);

/* ── Page ── */
const Page: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "WEIGHT LOSS",
  ]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const filtered = blogs.filter((b) => selectedCategories.includes(b.category));

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        background: "#fafafa",
      }}
    >
      <Breadcrumb title="Weight Loss" />

      <section style={{ padding: "50px 0" }}>
        <div className="blog-layout">
          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                border: "1px solid #f0f0f0",
              }}
            >
              <h2
                style={{
                  fontFamily: '"Trebuchet MS", sans-serif',
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#2d3436",
                  margin: "0 0 18px 0",
                  paddingBottom: "12px",
                  borderBottom: "2px solid #e0f7f7",
                }}
              >
                Categories
              </h2>
              {categories.map((cat) => (
                <label
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    color: selectedCategories.includes(cat)
                      ? "#00897b"
                      : "#636e72",
                    fontWeight: selectedCategories.includes(cat)
                      ? "600"
                      : "400",
                    transition: "color 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    style={{
                      accentColor: "#00897b",
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                    }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </aside>

          {/* Blog Grid */}
          <div className="blog-content">
            <div className="blog-grid">
              {filtered.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
              {filtered.length === 0 && (
                <p style={{ color: "#b2bec3", fontSize: "1rem" }}>
                  No blogs found for selected categories.
                </p>
              )}
            </div>
            <p style={{ fontSize: "0.9rem", color: "#636e72", margin: 0 }}>
              Showing 1–{filtered.length} of {filtered.length} blog(s)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
