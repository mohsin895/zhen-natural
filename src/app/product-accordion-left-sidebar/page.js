import { Suspense } from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'


export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Breadcrumb title={"Product Page"} />

        </Suspense>
    )
}