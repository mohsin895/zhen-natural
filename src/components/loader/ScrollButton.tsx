"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const ScrollButton = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [offset, setOffset] = useState(0)
    const pathRef = useRef<SVGPathElement | null>(null)
    const pathLengthRef = useRef(0)

    useEffect(() => {
        const progressPath = document.querySelector('.back-to-top-wrap path') as SVGPathElement | null
        if (!progressPath) return

        pathRef.current = progressPath
        const length = progressPath.getTotalLength()
        pathLengthRef.current = length

        progressPath.style.transition = 'none'
        progressPath.style.strokeDasharray = `${length} ${length}`
        progressPath.style.strokeDashoffset = `${length}`
        progressPath.getBoundingClientRect()
        progressPath.style.transition = 'stroke-dashoffset 10ms linear'

        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const len = pathLengthRef.current
            const progress = len - (scrollTop * len) / docHeight

            if (pathRef.current) {
                pathRef.current.style.strokeDashoffset = `${progress}`
            }

            setIsVisible(scrollTop > 50)
            setOffset(scrollTop > 50 ? 1 : 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, []) // runs once on mount

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            {/* WhatsApp Button */}

            {/* Facebook Button */}


            {/* Back to Top */}
            <a
                style={{ display: isVisible ? 'block' : 'none' }}
                href="#Top"
                onClick={scrollToTop}
                className="back-to-top result-placeholder"
            >
                <i className="ri-arrow-up-line"></i>
                <div className={`back-to-top-wrap ${offset ? 'active-progress' : ''}`}>
                    <svg viewBox="-1 -1 102 102">
                        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"></path>
                    </svg>
                </div>
            </a>
        </>
    )
}

export default ScrollButton