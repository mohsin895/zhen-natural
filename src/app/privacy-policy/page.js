"use client";
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import PrivecyPolicy from "@/components/pages-section/PrivecyPolicy";

const page = () => {
    return (
        <>
            <Breadcrumb title={"privacy policy"} />
          <PrivecyPolicy />

        </>
    )
}

export default page
