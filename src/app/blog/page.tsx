"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "https://localhost/zhennatural/api/v2"
const PATH   = process.env.NEXT_PUBLIC_PATH   || "https://localhost/zhennatural/public"

/* ────────────────────────── TYPES ─────────────────────────────── */
interface BlogThumbnail {
    file_name: string
}

interface Blog {
    id: number
    slug: string
    title: string
    short_description?: string
    description?: string
    created_at?: string
    category_id?: number
    thumbnail?: BlogThumbnail
    banner?: string
    _catName?: string
}

interface Category {
    id: number
    slug: string
    category_name: string
    blogs?: Blog[]
}

/* ────────────────────────── HELPERS ────────────────────────────── */
const getBannerUrl = (blog: Blog): string => {
    if (blog.thumbnail?.file_name) return `${PATH}/${blog.thumbnail.file_name}`
    if (blog.banner && typeof blog.banner === 'string' && blog.banner.startsWith('http')) return blog.banner
    return `https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80`
}

/* ────────────────────────── STYLES ─────────────────────────────── */
const Styles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --green:     #3a7d5a;
      --green-lt:  #e8f4ee;
      --green-mid: #c2dece;
      --cream:     #f9f7f3;
      --ink:       #1a1f1c;
      --muted:     #6b7570;
      --border:    #e2e8e4;
      --white:     #ffffff;
    }
    body { font-family: 'Inter', sans-serif; background: var(--cream); color: var(--ink); }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
    @keyframes shimmer { 0%{ background-position:-600px 0 } 100%{ background-position:600px 0 } }
    @keyframes spin    { to { transform:rotate(360deg) } }

    .fade-up { animation: fadeUp .45s ease both }

    .skel {
      background: linear-gradient(90deg, #ede9e2 25%, #f6f4f0 50%, #ede9e2 75%);
      background-size: 600px 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }

    .hero {
      background: linear-gradient(145deg,#1a2e22 0%,#2e5240 60%,#3a7d5a 100%);
      padding: 80px 20px 64px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero::after {
      content:''; position:absolute; inset:0;
      background:radial-gradient(ellipse 55% 70% at 50% 120%,rgba(58,125,90,.22) 0%,transparent 70%);
      pointer-events:none;
    }
    .hero h1 {
      font-family:'Playfair Display',serif;
      font-size:clamp(2.2rem,5vw,3.6rem);
      color:#fff; letter-spacing:.03em;
      position:relative; z-index:1;
    }
    .hero p {
      font-size:.92rem; color:var(--green-mid);
      margin-top:10px; letter-spacing:.06em;
      text-transform:uppercase; position:relative; z-index:1;
    }

    .layout {
      max-width:1200px; margin:0 auto;
      padding:48px 20px 80px;
      display:flex; gap:28px; align-items:flex-start;
    }

    .sidebar { width:248px; flex-shrink:0; position:sticky; top:24px; }
    .s-card {
      background:var(--white); border:1px solid var(--border);
      border-radius:14px; padding:18px 14px;
      box-shadow:0 2px 12px rgba(0,0,0,.05); margin-bottom:16px;
    }
    .s-card h3 {
      font-family:'Playfair Display',serif; font-size:.98rem;
      color:var(--ink); padding-bottom:10px; margin-bottom:12px;
      border-bottom:2px solid var(--green-lt);
    }

    .sw { position:relative }
    .sw svg { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none }
    .si {
      width:100%; padding:10px 12px 10px 34px;
      border:1.5px solid var(--border); border-radius:9px;
      font-family:'Inter',sans-serif; font-size:.84rem;
      background:var(--white); color:var(--ink); outline:none;
      transition:border-color .2s;
    }
    .si:focus { border-color:var(--green) }

    .cb {
      display:flex; align-items:center; justify-content:space-between;
      width:100%; padding:9px 10px;
      border:none; border-radius:9px; background:transparent;
      cursor:pointer; font-family:'Inter',sans-serif; font-size:.82rem;
      color:var(--muted); transition:background .18s,color .18s;
      text-align:left; margin-bottom:2px;
    }
    .cb:hover   { background:var(--green-lt); color:var(--green) }
    .cb.act     { background:var(--green-lt); color:var(--green); font-weight:600 }
    .cb .cnt {
      font-size:.7rem; background:var(--green-mid); color:var(--green);
      border-radius:999px; padding:1px 7px; font-weight:600; flex-shrink:0;
    }
    .cb.act .cnt { background:var(--green); color:#fff }

    .ri {
      display:flex; gap:10px; align-items:center;
      padding:8px 0; border-bottom:1px solid var(--border);
      text-decoration:none; transition:opacity .2s;
    }
    .ri:last-child { border-bottom:none }
    .ri:hover { opacity:.7 }
    .ri img { width:48px; height:48px; object-fit:cover; border-radius:8px; background:var(--green-lt); flex-shrink:0 }
    .ri span { font-size:.78rem; color:var(--ink); line-height:1.45; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden }

    .grid {
      flex:1;
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
      gap:22px;
    }

    .card {
      background:var(--white); border:1px solid var(--border);
      border-radius:16px; overflow:hidden;
      box-shadow:0 2px 12px rgba(0,0,0,.05);
      display:flex; flex-direction:column;
      transition:transform .26s cubic-bezier(.4,0,.2,1),box-shadow .26s ease;
    }
    .card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(58,125,90,.14) }
    .ci { height:210px; overflow:hidden; background:var(--green-lt) }
    .ci img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease }
    .card:hover .ci img { transform:scale(1.05) }
    .cb2 { padding:18px 18px 20px; display:flex; flex-direction:column; flex:1 }
    .chip {
      display:inline-block; font-size:.67rem; font-weight:600;
      letter-spacing:.1em; text-transform:uppercase;
      color:var(--green); background:var(--green-lt);
      border-radius:999px; padding:2px 10px; margin-bottom:9px; align-self:flex-start;
    }
    .ct {
      font-family:'Playfair Display',serif; font-size:1.04rem; font-weight:700;
      color:var(--ink); line-height:1.45; margin-bottom:8px; flex:1;
    }
    .cd {
      font-size:.79rem; color:var(--muted); line-height:1.6; margin-bottom:14px;
      display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    }
    .rb {
      display:inline-flex; align-items:center; gap:5px;
      background:var(--ink); color:var(--white);
      border:none; border-radius:7px; padding:9px 18px;
      font-family:'Inter',sans-serif; font-size:.77rem; font-weight:600;
      letter-spacing:.05em; text-transform:uppercase;
      cursor:pointer; transition:background .2s,transform .15s;
      align-self:flex-start; text-decoration:none;
    }
    .rb:hover { background:var(--green); transform:scale(1.02) }

    .empty  { grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--muted); font-size:.95rem }
    .err    { grid-column:1/-1; background:#fff3cd; border:1px solid #ffc107; border-radius:10px; padding:14px 18px; font-size:.85rem; color:#856404 }
    .footer { font-size:.79rem; color:var(--muted); margin-top:18px; letter-spacing:.03em }

    @media(max-width:768px){
      .layout { flex-direction:column }
      .sidebar { width:100%; position:static }
    }
  `}</style>
)

/* ────────────────────────── SKELETON ───────────────────────────── */
const SkeletonCard = () => (
    <div className="card" style={{pointerEvents:'none'}}>
        <div className="skel" style={{height:210}} />
        <div className="cb2">
            <div className="skel" style={{height:12,width:'40%',marginBottom:10}} />
            <div className="skel" style={{height:16,width:'90%',marginBottom:6}} />
            <div className="skel" style={{height:16,width:'72%',marginBottom:16}} />
            <div className="skel" style={{height:12,width:'80%',marginBottom:6}} />
            <div className="skel" style={{height:12,width:'60%',marginBottom:18}} />
            <div className="skel" style={{height:34,width:110}} />
        </div>
    </div>
)

/* ────────────────────────── BLOG CARD ──────────────────────────── */
const BlogCard = ({ blog, catName, index }: { blog: Blog; catName: string; index: number }) => (
    <div className="card fade-up" style={{animationDelay:`${index*0.07}s`}}>
        <div className="ci">
            <img
                src={getBannerUrl(blog)}
                alt={blog.title}
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80' }}
            />
        </div>
        <div className="cb2">
            {catName && <span className="chip">{catName}</span>}
            <h3 className="ct">{blog.title}</h3>
            {blog.short_description && <p className="cd">{blog.short_description}</p>}
            <a href={`/blog/${blog.slug}`} className="rb">
                Read More
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </a>
        </div>
    </div>
)

/* ────────────────────────── PAGE ───────────────────────────────── */
export default function BlogPage() {
    const [allBlogs, setAllBlogs]           = useState<Blog[]>([])
    const [categories, setCategories]       = useState<Category[]>([])
    const [loadingBlogs, setLoadingBlogs]   = useState(true)
    const [loadingCats, setLoadingCats]     = useState(true)
    const [blogsError, setBlogsError]       = useState<string | null>(null)
    const [activeCatSlug, setActiveCatSlug] = useState<string | null>(null)
    const [search, setSearch]               = useState('')
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    /* ── fetch blogs wrapped in useCallback ── */
    const fetchBlogs = useCallback((catSlug: string | null = null, q: string = '') => {
        setLoadingBlogs(true)
        setBlogsError(null)
        const params = new URLSearchParams()
        if (catSlug) params.append('selected_categories[]', catSlug)
        if (q)       params.append('search', q)

        fetch(`${DOMAIN}/blog-list?${params}`)
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
            .then(json => {
                if (!json.result) throw new Error('API returned result:false')
                setAllBlogs(json.blogs?.data || [])
            })
            .catch((e: Error) => setBlogsError(e.message))
            .finally(() => setLoadingBlogs(false))
    }, [])

    /* ── fetch categories ── */
    useEffect(() => {
        fetch(`${DOMAIN}/blog-category`)
            .then(r => r.json())
            .then(json => { if (json.success) setCategories(json.data || []) })
            .catch(() => {})
            .finally(() => setLoadingCats(false))
    }, [])

    /* ── initial blog load ── */
    useEffect(() => {
        fetchBlogs()
    }, [fetchBlogs])

    /* ── displayed blogs with category name injected ── */
    const displayedBlogs: Blog[] = (() => {
        if (activeCatSlug) {
            const cat = categories.find(c => c.slug === activeCatSlug)
            const source = (cat?.blogs?.length ? cat.blogs : allBlogs)
            return source.map(b => ({ ...b, _catName: cat?.category_name || '' }))
        }
        const catMap: Record<number, string> = Object.fromEntries(categories.map(c => [c.id, c.category_name]))
        return allBlogs.map(b => ({ ...b, _catName: b.category_id ? (catMap[b.category_id] || '') : '' }))
    })()

    const handleCatClick = (slug: string) => {
        const next = activeCatSlug === slug ? null : slug
        setActiveCatSlug(next)
        fetchBlogs(next, search)
    }

    const handleSearch = (val: string) => {
        setSearch(val)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => fetchBlogs(activeCatSlug, val), 420)
    }

    const activeCat = categories.find(c => c.slug === activeCatSlug)
    const isLoading = loadingBlogs

    return (
        <>
            <Styles />

            <header className="hero">
                <h1>Blog</h1>
            </header>

            <div className="layout">

                {/* ── SIDEBAR ── */}
                <aside className="sidebar">

                    {/* Search */}
                    <div className="s-card">
                        <div className="sw">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                className="si"
                                type="text"
                                placeholder="Search articles…"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="s-card">
                        <h3>Categories</h3>

                        <button
                            className={`cb${!activeCatSlug ? ' act' : ''}`}
                            onClick={() => { setActiveCatSlug(null); fetchBlogs(null, search) }}
                        >
                            All Posts
                            <span className="cnt">{allBlogs.length || '—'}</span>
                        </button>

                        {loadingCats
                            ? [1,2,3].map(i => <div key={i} className="skel" style={{height:34,marginBottom:4}} />)
                            : categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`cb${activeCatSlug === cat.slug ? ' act' : ''}`}
                                    onClick={() => handleCatClick(cat.slug)}
                                >
                                    <span style={{flex:1}}>{cat.category_name}</span>
                                    <span className="cnt">{cat.blogs?.length ?? 0}</span>
                                </button>
                            ))
                        }
                    </div>
                </aside>

                {/* ── MAIN GRID ── */}
                <div style={{flex:1}}>

                    {activeCat && (
                        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                            <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1.12rem',fontWeight:700,color:'var(--ink)'}}>
                                {activeCat.category_name}
                            </span>
                            <button
                                onClick={() => { setActiveCatSlug(null); fetchBlogs(null, search) }}
                                style={{fontSize:'.72rem',color:'var(--muted)',background:'var(--border)',border:'none',borderRadius:999,padding:'3px 10px',cursor:'pointer'}}
                            >
                                ✕ Clear
                            </button>
                        </div>
                    )}

                    <div className="grid">
                        {isLoading
                            ? Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)
                            : blogsError
                                ? <div className="err">⚠️ Could not load articles: {blogsError}</div>
                                : displayedBlogs.length === 0
                                    ? <div className="empty">
                                        No articles found{search ? ` for "${search}"` : ''}.
                                    </div>
                                    : displayedBlogs.map((blog, i) => (
                                        <BlogCard key={blog.id} blog={blog} catName={blog._catName || ''} index={i} />
                                    ))
                        }
                    </div>

                    {!isLoading && !blogsError && displayedBlogs.length > 0 && (
                        <p className="footer">
                            Showing {displayedBlogs.length} article{displayedBlogs.length !== 1 ? 's' : ''}
                            {activeCat ? ` in "${activeCat.category_name}"` : ''}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}