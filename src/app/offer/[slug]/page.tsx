"use client";

import OfferSection from "@/components/offer/OfferSection";
import { use } from "react";

export default function OfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return <OfferSection slug={slug} />;
}
