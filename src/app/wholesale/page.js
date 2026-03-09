"use client"
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import WholesalePage from '@/components/wholesale/Wholesale'


const page = () => {
    return (
        <>
            <Breadcrumb title={"WholeSale"} />
            <WholesalePage />
        </>
    )
}

export default page
