import React, { useState } from 'react'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://zhennatural.zhenaura.net/api/v2'

const steps = [
    { id: 1, label: 'Order Confirmed', icon: '✓' },
    { id: 2, label: 'Processing Order', icon: '⚙' },
    { id: 3, label: 'Quality Check', icon: '◎' },
    { id: 4, label: 'Product Dispatched', icon: '⟶' },
    { id: 5, label: 'Product Delivered', icon: '⌂' },
]

const TrackOrders = () => {
    const [orderCode, setOrderCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [orderData, setOrderData] = useState<any | null>(null)
    const [activeStep, setActiveStep] = useState(0)

    const handleTrack = async () => {
        if (!orderCode.trim()) {
            setError('Please enter an order number.')
            return
        }
        setLoading(true)
        setError(null)
        setOrderData(null)

        try {
            const params = new URLSearchParams({ order_code: orderCode.trim() })
            const res = await fetch(`${DOMAIN}/track-your-order?${params}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            })

            const text = await res.text()
            if (!text) throw new Error('No order found with this order number.')
            const data = JSON.parse(text)

            if (!data.success) {
                setError(data.message || 'Order not found.')
                return
            }

            setOrderData(data.order)

            const statusMap: Record<string, number> = {
                confirmed: 1,
                processing: 2,
                quality_check: 3,
                dispatched: 4,
                delivered: 5,
            }
            const status = data.order?.orderStatus?.name?.toLowerCase?.().replace(/\s+/g, '_') || ''
            setActiveStep(statusMap[status] || 1)
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page as React.CSSProperties}>
            <div style={styles.blob1 as React.CSSProperties} />
            <div style={styles.blob2 as React.CSSProperties} />

            <div style={styles.container as React.CSSProperties}>
                {/* Header */}
                <div style={styles.header as React.CSSProperties}>
                    <span style={styles.eyebrow as React.CSSProperties}>Zhen Natural</span>
                    <h1 style={styles.title as React.CSSProperties}>Track Your Order</h1>
                    <p style={styles.subtitle as React.CSSProperties}>Enter your order number to check the status of your order.</p>
                </div>

                {/* Card */}
                <div style={styles.card as React.CSSProperties}>
                    <h2 style={styles.cardTitle as React.CSSProperties}>Order Tracking</h2>

                    {/* Input Row */}
                    <div style={styles.inputRow as React.CSSProperties}>
                        <div style={styles.inputWrapper as React.CSSProperties}>
                            <label style={styles.label as React.CSSProperties}>Order Number</label>
                            <input
                                style={styles.input as React.CSSProperties}
                                type="text"
                                placeholder="e.g. ZN-20240001"
                                value={orderCode}
                                onChange={e => setOrderCode(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                            />
                        </div>
                        <button
                            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) } as React.CSSProperties}
                            onClick={handleTrack}
                            disabled={loading}
                        >
                            {loading ? (
                                <span style={styles.spinner as React.CSSProperties} />
                            ) : (
                                'Track Order'
                            )}
                        </button>
                    </div>

                    {/* Error */}
                    {error && <p style={styles.error as React.CSSProperties}>{error}</p>}

                    {/* Order Info */}
                    {orderData && (
                        <div style={styles.orderInfo as React.CSSProperties}>
                            <div style={styles.orderInfoGrid as React.CSSProperties}>
                                {orderData.code && <div><span style={styles.infoLabel as React.CSSProperties}>Order Code</span><span style={styles.infoVal as React.CSSProperties}>{orderData.code}</span></div>}
                                {orderData.orderStatus?.name && <div><span style={styles.infoLabel as React.CSSProperties}>Status</span><span style={styles.infoVal as React.CSSProperties}>{orderData.orderStatus.name}</span></div>}
                                {orderData.created_at && <div><span style={styles.infoLabel as React.CSSProperties}>Placed On</span><span style={styles.infoVal as React.CSSProperties}>{new Date(orderData.created_at).toLocaleDateString()}</span></div>}
                                {orderData.grand_total && <div><span style={styles.infoLabel as React.CSSProperties}>Total</span><span style={styles.infoVal as React.CSSProperties}>{orderData.grand_total}</span></div>}
                            </div>
                        </div>
                    )}

                    {/* Stepper */}
                    <div style={styles.stepperOuter as React.CSSProperties}>
                        <div style={styles.progressTrack as React.CSSProperties}>
                            <div
                                style={{
                                    ...styles.progressFill,
                                    width: activeStep > 0 ? `${((activeStep - 1) / (steps.length - 1)) * 100}%` : '0%',
                                } as React.CSSProperties}
                            />
                        </div>

                        {steps.map((step) => {
                            const done = step.id < activeStep
                            const current = step.id === activeStep
                            return (
                                <div key={step.id} style={styles.stepItem as React.CSSProperties}>
                                    <div
                                        style={{
                                            ...styles.stepDot,
                                            ...(done ? styles.stepDotDone : {}),
                                            ...(current ? styles.stepDotCurrent : {}),
                                        } as React.CSSProperties}
                                    >
                                        <span style={styles.stepIcon as React.CSSProperties}>{step.icon}</span>
                                    </div>
                                    <span
                                        style={{
                                            ...styles.stepLabel,
                                            ...(current ? styles.stepLabelActive : {}),
                                        } as React.CSSProperties}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    )
}

const green = '#3a6b4a'
const greenLight = '#e8f0eb'
const greenMid = '#7aad8a'
const cream = '#faf8f3'

const styles = {
    page: {
        minHeight: '100vh',
        background: cream,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
    },
    blob1: {
        position: 'absolute', top: '-120px', left: '-120px',
        width: '420px', height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #c8dfc9 0%, transparent 70%)',
        opacity: 0.5, pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute', bottom: '-100px', right: '-80px',
        width: '340px', height: '340px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #d4c5b2 0%, transparent 70%)',
        opacity: 0.45, pointerEvents: 'none',
    },
    container: {
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '720px',
        display: 'flex', flexDirection: 'column', gap: '32px',
    },
    header: { textAlign: 'center' },
    eyebrow: {
        display: 'block',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '11px', fontWeight: 500,
        letterSpacing: '3px', textTransform: 'uppercase',
        color: greenMid, marginBottom: '8px',
    },
    title: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '48px', fontWeight: 600, lineHeight: 1.1,
        color: '#1c2e1c', marginBottom: '12px',
    },
    subtitle: {
        fontSize: '15px', color: '#6b7a6b', fontWeight: 300, lineHeight: 1.6,
    },
    card: {
        background: '#fff',
        borderRadius: '20px',
        padding: '40px 40px 48px',
        boxShadow: '0 2px 40px rgba(60,90,60,0.09)',
        border: '1px solid #e6ede6',
        animation: 'fadeIn 0.5s ease',
    },
    cardTitle: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '24px', fontWeight: 600,
        color: '#1c2e1c', marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${greenLight}`,
    },
    inputRow: {
        display: 'flex', gap: '12px', alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    inputWrapper: { flex: 1, minWidth: '200px' },
    label: {
        display: 'block', fontSize: '12px',
        fontWeight: 500, color: '#5a7060',
        letterSpacing: '0.5px', marginBottom: '8px',
        textTransform: 'uppercase',
    },
    input: {
        width: '100%', padding: '12px 16px',
        border: `1.5px solid #d4e0d4`,
        borderRadius: '10px', fontSize: '15px',
        color: '#1c2e1c', background: '#f8faf8',
        outline: 'none', transition: 'border-color 0.2s',
        fontFamily: "'DM Sans', sans-serif",
    },
    button: {
        padding: '13px 28px',
        background: green,
        color: '#fff',
        border: 'none', borderRadius: '10px',
        fontSize: '14px', fontWeight: 500,
        cursor: 'pointer', letterSpacing: '0.3px',
        transition: 'background 0.2s, transform 0.1s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minWidth: '130px', height: '48px',
    },
    buttonDisabled: { background: greenMid, cursor: 'not-allowed' },
    spinner: {
        width: '18px', height: '18px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
    },
    error: {
        marginTop: '12px', color: '#b94a4a',
        fontSize: '13px', background: '#fdf0f0',
        padding: '10px 14px', borderRadius: '8px',
        border: '1px solid #f5d0d0',
    },
    orderInfo: {
        marginTop: '20px', padding: '16px 20px',
        background: greenLight, borderRadius: '10px',
        animation: 'fadeIn 0.4s ease',
    },
    orderInfoGrid: {
        display: 'flex', gap: '24px', flexWrap: 'wrap',
    },
    infoLabel: {
        display: 'block', fontSize: '11px',
        color: '#5a7060', textTransform: 'uppercase',
        letterSpacing: '0.5px', marginBottom: '3px',
    },
    infoVal: { fontSize: '14px', fontWeight: 500, color: '#1c2e1c' },
    stepperOuter: {
        marginTop: '36px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    progressTrack: {
        position: 'absolute',
        top: '18px', left: '18px',
        right: '18px', height: '3px',
        background: '#e0e8e0',
        borderRadius: '2px',
        zIndex: 0,
    },
    progressFill: {
        height: '100%',
        background: `linear-gradient(90deg, ${green}, ${greenMid})`,
        borderRadius: '2px',
        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
    },
    stepItem: {
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '8px',
        flex: 1,
    },
    stepDot: {
        width: '38px', height: '38px',
        borderRadius: '50%',
        background: '#e8ede8',
        border: '2px solid #d0dcd0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.4s ease',
    },
    stepDotDone: {
        background: green, borderColor: green,
    },
    stepDotCurrent: {
        background: '#fff',
        borderColor: green,
        boxShadow: `0 0 0 4px ${greenLight}`,
    },
    stepIcon: {
        fontSize: '14px', color: '#fff',
    },
    stepLabel: {
        fontSize: '11px', color: '#8a9e8a',
        textAlign: 'center', fontWeight: 400,
        lineHeight: 1.3, maxWidth: '72px',
    },
    stepLabelActive: {
        color: green, fontWeight: 500,
    },
}

export default TrackOrders