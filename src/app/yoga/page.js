"use client"
import React from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import Wishlist from '@/components/yoga/Yoga'


const page = () => {
    return (
        <>
            <Breadcrumb title={"Yoga"} />
            <Wishlist />
        </>
    )
}

export default page
