"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import Link from 'next/link'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const PATH = process.env.NEXT_PUBLIC_PATH

// ─── Types ───────────────────────────────────────────────────────────────────

interface Thumbnail {
    id: number
    file_name: string // e.g. "uploads/all/xxx.png"
    file_original_name: string
}

interface Blog {
    id: number
    category_id: number
    title: string
    slug: string
    short_description: string
    description: string
    status: number
    thumbnail: Thumbnail | null
    // injected client-side
    category_name?: string
}

interface RecipeCategory {
    id: number
    category_name: string
    category_type: string
    slug: string
    blogs: Blog[]
}

// ─── Page ────────────────────────────────────────────────────────────────────

const RecipeSlugPage = () => {
    const params = useParams()
    const slug = params?.slug as string

    const [allCategories, setAllCategories] = useState<RecipeCategory[]>([])
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [activeCategory, setActiveCategory] = useState<RecipeCategory | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const res = await fetch(`${DOMAIN}/recipe`)
                const json = await res.json()

                if (!json.success) {
                    setError(json.message || 'Failed to load recipes')
                    return
                }

                const categoryData: RecipeCategory[] = json.data || []
                setAllCategories(categoryData)

                // Find active category by slug
                const matched = categoryData.find(c => c.slug === slug)
                const target = matched || categoryData[0]

                if (target) {
                    setActiveCategory(target)
                    const enrichedBlogs: Blog[] = (target.blogs || []).map(blog => ({
                        ...blog,
                        category_name: target.category_name,
                    }))
                    setBlogs(enrichedBlogs)
                }
            } catch {
                setError('Failed to connect to the server.')
            } finally {
                setLoading(false)
            }
        }

        if (slug) fetchData()
    }, [slug])

    const pageTitle = activeCategory?.category_name || 'Recipe'

    return (
        <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fafafa' }}>
            <Breadcrumb title={pageTitle} />

            <section style={{ padding: '50px 0' }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px',
                    display: 'flex',
                    gap: '32px',
                    alignItems: 'flex-start',
                }}>

                    {/* ── Sidebar ── */}
                    <aside style={{ width: '260px', flexShrink: 0 }}>
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                            border: '1px solid #f0f0f0',
                            position: 'sticky',
                            top: '20px',
                        }}>
                            <h2 style={{
                                fontFamily: '"Trebuchet MS", sans-serif',
                                fontSize: '1.05rem',
                                fontWeight: '700',
                                color: '#2d3436',
                                margin: '0 0 16px 0',
                                paddingBottom: '12px',
                                borderBottom: '2px solid #e0f7f7',
                            }}>
                                Categories
                            </h2>

                            {loading
                                ? Array(3).fill(0).map((_, i) => (
                                    <div key={i} style={{
                                        height: '14px',
                                        background: '#eee',
                                        borderRadius: '4px',
                                        margin: '12px 0',
                                        animation: 'pulse 1.5s infinite',
                                    }} />
                                ))
                                : allCategories.map(cat => {
                                    const isActive = cat.slug === slug
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/recipe/${cat.slug}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '9px 12px',
                                                marginBottom: '4px',
                                                borderRadius: '8px',
                                                fontSize: '0.88rem',
                                                textDecoration: 'none',
                                                color: isActive ? '#fff' : '#636e72',
                                                background: isActive
                                                    ? 'linear-gradient(135deg, #26a69a, #00897b)'
                                                    : 'transparent',
                                                fontWeight: isActive ? '600' : '400',
                                                transition: 'all 0.2s',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                            }}
                                        >
                                            <span style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                background: isActive ? '#fff' : '#26a69a',
                                            }} />
                                            {cat.category_name}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </aside>

                    {/* ── Blog Grid ── */}
                    <div style={{ flex: 1 }}>
                        {loading ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                gap: '24px',
                            }}>
                                {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : error ? (
                            <ErrorBox message={error} />
                        ) : (
                            <>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                    gap: '24px',
                                    marginBottom: '20px',
                                }}>
                                    {blogs.length > 0
                                        ? blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)
                                        : (
                                            <p style={{
                                                color: '#b2bec3',
                                                fontSize: '1rem',
                                                gridColumn: '1/-1',
                                                textAlign: 'center',
                                                padding: '60px 0',
                                            }}>
                                                No recipes found in this category.
                                            </p>
                                        )
                                    }
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#b2bec3', margin: 0 }}>
                                    Showing 1–{blogs.length} of {blogs.length} blog(s)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    )
}

// ─── Blog Card ───────────────────────────────────────────────────────────────

const BlogCard = ({ blog }: { blog: Blog }) => {
    // thumbnail.file_name = "uploads/all/xxx.png"
    // Full URL = NEXT_PUBLIC_PATH + "/" + file_name
    const imageUrl = blog.thumbnail?.file_name
        ? `${PATH}/${blog.thumbnail.file_name}`
        : '/placeholder.jpg'

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.13)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'
            }}
        >
            {/* Image */}
            <div style={{ height: '210px', overflow: 'hidden', background: '#f0f9f9', flexShrink: 0 }}>
                <img
                    src={imageUrl}
                    alt={blog.thumbnail?.file_original_name || blog.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.35s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
                />
            </div>

            {/* Content */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Category badge */}
                <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    color: '#00897b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8px',
                }}>
                    {blog.category_name}
                </span>

                {/* Title */}
                <h3 style={{
                    fontFamily: '"Georgia", serif',
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#2d3436',
                    margin: '0 0 8px 0',
                    lineHeight: '1.5',
                }}>
                    {blog.title}
                </h3>

                {/* Short description */}
                {blog.short_description && (
                    <p style={{
                        fontSize: '0.85rem',
                        color: '#888',
                        margin: '0 0 16px 0',
                        lineHeight: '1.5',
                        flex: 1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {blog.short_description}
                    </p>
                )}

                {/* Read More */}
                <Link
                    href={`/blog/${blog.slug || blog.id}`}
                    style={{
                        display: 'inline-block',
                        alignSelf: 'flex-start',
                        background: 'linear-gradient(135deg, #26a69a, #00897b)',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '9px 20px',
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        letterSpacing: '0.03em',
                        transition: 'opacity 0.2s',
                        marginTop: 'auto',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                    Read More
                </Link>
            </div>
        </div>
    )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
    <div style={{
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    }}>
        <div style={{ height: '210px', background: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
        <div style={{ padding: '20px' }}>
            <div style={{ height: '11px', background: '#eee', borderRadius: '4px', width: '35%', marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '16px', background: '#eee', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '16px', background: '#eee', borderRadius: '4px', width: '60%', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '36px', background: '#eee', borderRadius: '8px', width: '110px', animation: 'pulse 1.5s infinite' }} />
        </div>
    </div>
)

// ─── Error ───────────────────────────────────────────────────────────────────

const ErrorBox = ({ message }: { message: string }) => (
    <div style={{
        background: '#fff3f3',
        border: '1px solid #ffcccc',
        borderRadius: '12px',
        padding: '32px',
        color: '#e74c3c',
        textAlign: 'center',
        fontSize: '0.95rem',
    }}>
        ⚠️ {message}
    </div>
)

export default RecipeSlugPage