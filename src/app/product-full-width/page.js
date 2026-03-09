"use client"
import React from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'


import { Row } from 'react-bootstrap'


const page = () => {
  return (
    <>
      <Breadcrumb title={"Product Page"} />
      <section className="section-product padding-tb-50">
        <div className="container">
          <Row>

          </Row>
        </div>
      </section>

    </>
  )
}

export default page
