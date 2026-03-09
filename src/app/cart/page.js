"use client"
import React from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import Cart from '@/components/cart/cart-section/Cart'


const page = () => {
  return (
    <>
      <Breadcrumb title={"Cart"} />
      <Cart />

    </>
  )
}

export default page
