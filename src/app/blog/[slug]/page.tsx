"use client";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React, { useEffect, useState } from "react";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
const PATH = process.env.NEXT_PUBLIC_PATH;

interface BlogThumbnail {
  file_name: string;
}

interface Blog {
  id: number;
  slug: string;
  title: string;
  short_description?: string;
  description: string;
  created_at: string;
  thumbnail?: BlogThumbnail;
}

interface RecentBlog {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  thumbnail?: BlogThumbnail;
}

const BlogDetailsPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = React.use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await fetch(`${DOMAIN}/blog-details/${slug}`);
        const data = await res.json();
        if (data.result) {
          setBlog(data.blog);
          setRecentBlogs(data.recent_blogs);
        }
      } catch (err) {
        console.error("Failed to fetch blog details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title={"Blog"} />
        <section className="section-product padding-tb-50">
          <div className="container">
            <div className="blog-loading">Loading...</div>
          </div>
        </section>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Breadcrumb title={"Blog"} />
        <section className="section-product padding-tb-50">
          <div className="container">
            <div className="blog-not-found">Blog not found.</div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={"Blog Details"} />
      <section className="section-product padding-tb-50">
        <div className="container">
          <div className="blog-details-wrapper">
            {/* LEFT SIDE — Recent Blogs */}
            <div className="blog-sidebar">
              <div className="sidebar-widget">
                <h3 className="widget-title">Recent Posts</h3>
                <ul className="recent-blog-list">
                  {recentBlogs.map((rb) => (
                    <li key={rb.id} className="recent-blog-item">
                      <a href={`/blog/${rb.slug}`} className="rb">
                        <div className="rb-thumb">
                          {rb.thumbnail?.file_name ? (
                            <img
                              src={`${PATH}/${rb.thumbnail.file_name}`}
                              alt={rb.title}
                            />
                          ) : (
                            <div className="rb-thumb-placeholder" />
                          )}
                        </div>
                        <div className="rb-info">
                          <span className="rb-date">
                            {formatDate(rb.created_at)}
                          </span>
                          <p className="rb-title">{rb.title}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT SIDE — Blog Details */}
            <div className="blog-details-content">
              {blog.thumbnail?.file_name && (
                <div className="blog-details-banner">
                  <img
                    src={`${PATH}/${blog.thumbnail.file_name}`}
                    alt={blog.title}
                  />
                </div>
              )}

              <div className="blog-details-meta">
                <span className="blog-date">{formatDate(blog.created_at)}</span>
              </div>

              <h1 className="blog-details-title">{blog.title}</h1>

              {blog.short_description && (
                <p className="blog-details-short-desc">
                  {blog.short_description}
                </p>
              )}

              <div
                className="blog-details-description"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .blog-details-wrapper {
          display: flex;
          gap: 30px;
          align-items: flex-start;
        }

        /* ── LEFT SIDEBAR ── */
        .blog-sidebar {
          width: 300px;
          flex-shrink: 0;
        }

        .sidebar-widget {
          background: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 20px;
        }

        .widget-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0e0e0;
          color: #222;
        }

        .recent-blog-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .recent-blog-item a.rb {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          text-decoration: none;
          color: inherit;
          transition: opacity 0.2s;
        }

        .recent-blog-item a.rb:hover {
          opacity: 0.75;
        }

        .rb-thumb {
          width: 70px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          background: #ddd;
        }

        .rb-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rb-thumb-placeholder {
          width: 100%;
          height: 100%;
          background: #ccc;
        }

        .rb-info {
          flex: 1;
        }

        .rb-date {
          font-size: 12px;
          color: #999;
          display: block;
          margin-bottom: 4px;
        }

        .rb-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── RIGHT BLOG DETAILS ── */
        .blog-details-content {
          flex: 1;
          min-width: 0;
        }

        .blog-details-banner {
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .blog-details-banner img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .blog-details-meta {
          margin-bottom: 10px;
        }

        .blog-date {
          font-size: 13px;
          color: #888;
        }

        .blog-details-title {
          font-size: 28px;
          font-weight: 700;
          color: #111;
          margin-bottom: 14px;
          line-height: 1.3;
        }

        .blog-details-short-desc {
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
          font-style: italic;
          border-left: 3px solid #ccc;
          padding-left: 14px;
        }

        .blog-details-description {
          font-size: 15px;
          color: #444;
          line-height: 1.8;
        }

        .blog-details-description p {
          margin-bottom: 16px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .blog-details-wrapper {
            flex-direction: column-reverse;
          }
          .blog-sidebar {
            width: 100%;
          }
          .blog-details-banner img {
            height: 220px;
          }
        }
      `}</style>
    </>
  );
};

export default BlogDetailsPage;
