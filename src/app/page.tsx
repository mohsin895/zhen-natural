"use client";
import NewArrivals from "@/components/arrivals/NewArrivals";
import BlogSlider from "@/components/blog/BlogSlider";
import Brands from "@/components/brands";
import ExploreCategory from "@/components/category/ExploreCategory";
import ComboProducts from "@/components/Combo Products/ComboProducts";
import DealSlider from "@/components/deal-slider/DealSlider";
import HeroSlider from "@/components/hero/HeroSlider";
import Services from "@/components/services/Services";
import SocialMediaGallery from "@/components/SocialMediaGallery";
import TopVendor from "@/components/top-vendor/TopVendor";
import UpcomingProducts from "@/components/Upcoming Products/UpcomingProducts";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <ExploreCategory />
      <DealSlider />

      {/*<BannerTwo />*/}
      <NewArrivals />
      <ComboProducts />
      <UpcomingProducts />
      <Services />
      <TopVendor />
      <SocialMediaGallery />
      <Brands />
      <BlogSlider />
      {/*<Instagram />*/}
    </>
  );
}
