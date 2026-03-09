"use client"
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import Faq from '@/components/faq/Faq'
import TermsAndConditions from '@/components/terms-conditions/TermsAndConditions'


const page = () => {
  return (
    <>
      <Breadcrumb title={"Terms & Conditions"} />
      <TermsAndConditions />

    </>
  )
}

export default page
