"use client"
import React from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import Wishlist from '@/components/wishlist/Wishlist'
import ReturnRefundPolicy from "@/components/pages-section/returnRefundPolicy";


const page = () => {
    return (
        <>
            <Breadcrumb title={"Refund and Return Policy"} />
            <ReturnRefundPolicy />
        </>
    )
}

export default page
