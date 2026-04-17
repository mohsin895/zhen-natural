import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import { Suspense } from 'react'


export default function Page() {
    return (
        <Suspense fallback={<div></div>}>
            <Breadcrumb title={"Product Page"} />

        </Suspense>
    )
}