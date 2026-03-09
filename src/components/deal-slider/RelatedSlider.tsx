// Slider.tsx
"use client"
import React from 'react';

export interface SliderProps {
    categoryId: number;
}

const Slider: React.FC<SliderProps> = ({ categoryId }) => {
    return (
        <div className="slider-wrapper">
            {/* Render products based on categoryId */}
            <p>Slider for Category ID: {categoryId}</p>
        </div>
    );
};

export default Slider;