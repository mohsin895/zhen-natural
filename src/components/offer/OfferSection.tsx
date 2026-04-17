"use client";

import ProductItemCard from "@/components/item/ProductItemCard";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;

export default function OfferSection({ slug }: { slug: string }) {
  const { data: offerData } = useSWR<{ data: any[] }>(
    slug ? `${API_BASE}/offers/products/${slug}` : null,
    fetcher,
  );

  const offers = offerData?.data ?? [];

  const formattedProducts = offers.map((item: any) => ({
    id: item.id,
    title: item.name,
    slug: item.slug,
    newPrice: item.main_price || item.offer_price || 0,
    oldPrice: item.stroked_price || item.price || 0,
    image: item.thumbnail_image || item.icon,
    imageTwo: item.thumbnail_image || item.icon,
    category: item.category || "",
    weight: item.weight || "",
    rating: item.rating || 0,
    quantity: 1,
    has_discount: item.has_discount || false,
    discount: item.discount || 0,
    discount_type: item.discount_type || "",
    sale: item.has_discount ? `-${item.discount}` : "",
    current_stock: item.current_stock ?? item.stock ?? 10,
    date: "",
    status: "",
    location: "",
    brand: item.brand || "",
    sku: item.id,
  }));

  return (
    <section className="py-10 px-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formattedProducts.map((item: any, idx: number) => (
          <div className="grid ">
            <ProductItemCard key={item.id || idx} data={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
