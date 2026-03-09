"use client"
import React, { Suspense } from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import Checkout from '@/components/login/Checkout'

export const dynamic = "force-dynamic";

const Page = () => {
    return (
        <>
            <Breadcrumb title={"Checkout"} />
            <Suspense fallback={<div>Loading checkout...</div>}>
                <Checkout />
            </Suspense>
        </>
    )
}

export default Page