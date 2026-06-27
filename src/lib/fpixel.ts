// lib/fpixel.ts
// Thin typed wrapper around the Facebook Pixel global `fbq`.

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID as string;

declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
    }
}

/** Fires a standard FB pixel event, e.g. pageview() handles itself via the snippet. */
export const pageview = () => {
    if (typeof window === "undefined" || !window.fbq) return;
    window.fbq("track", "PageView");
};

/**
 * Fires a standard Facebook event (ViewContent, AddToCart, InitiateCheckout, Purchase, etc.)
 * https://developers.facebook.com/docs/meta-pixel/reference#standard-events
 */
export const fbEvent = (name: string, options: Record<string, any> = {}) => {
    if (typeof window === "undefined" || !window.fbq) return;
    window.fbq("track", name, options);
};

/** Fires a non-standard / custom event. */
export const fbCustomEvent = (name: string, options: Record<string, any> = {}) => {
    if (typeof window === "undefined" || !window.fbq) return;
    window.fbq("trackCustom", name, options);
};