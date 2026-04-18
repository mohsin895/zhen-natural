import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroImageProps {
    src: string;
    alt: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ src, alt }) => {
    
    const [isSvgLoading, setIsSvgLoading] = useState(true);

    useEffect(() => {
        // Simulate SVG loading time
        const timer = setTimeout(() => {
            setIsSvgLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div >
            <img src={src} alt={alt} style={{ width: '100%' }} />
            {isSvgLoading ? (
                <div className="hero-loader">
                    <div className="spinner"></div>
                </div>
            ) : (
             <>
             </>

            )}
            
        </div>
    );
};

export default HeroImage; 