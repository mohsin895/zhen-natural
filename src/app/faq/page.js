"use client"
import React from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import Faq from '@/components/faq/Faq'

const page = () => {
  return (
    <>
      <Breadcrumb title={"Frequently Asked Questions"} />
      <Faq />
    </>
  )
}

export default page
