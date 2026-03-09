import React, { useEffect, useRef, useState } from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface PriceRangeSliderProps {
    onPriceChange: (min: number, max: number) => void;
    min: number;
    max: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
                                                               onPriceChange,
                                                               max,
                                                               min,
                                                           }: any) => {
    const sliderRef = useRef<any>(null);
    const { range } = useSelector((state: RootState) => state.filter);

    // Provide default values if min/max are not numbers
    const safeMin = typeof min === 'number' && !isNaN(min) ? min : 0;
    const safeMax = typeof max === 'number' && !isNaN(max) ? max : 100;

    const [minValue, setMinValue] = useState(range.min || safeMin);
    const [maxValue, setMaxValue] = useState(range.max || safeMax);

    useEffect(() => {
        // Don't create slider if min/max are not valid numbers
        if (!sliderRef.current || sliderRef.current.noUiSlider) return;
        if (typeof safeMin !== 'number' || typeof safeMax !== 'number') return;
        if (isNaN(safeMin) || isNaN(safeMax)) return;

        const actualMin = safeMin === safeMax ? safeMin - 1 : safeMin;
        const actualMax = safeMin === safeMax ? safeMax + 1 : safeMax;

        const slider = sliderRef.current;

        noUiSlider.create(slider, {
            start: [range.min || actualMin, range.max || actualMax],
            connect: true,
            range: {
                min: actualMin,
                max: actualMax,
            },
            format: {
                to: (value: number) => Math.round(value).toString(),
                from: (value: string) => parseInt(value, 10),
            },
        });

        slider.noUiSlider.on("update", (values: (number | string)[]) => {
            setMinValue(Math.round(parseFloat(values[0] as string)));
            setMaxValue(Math.round(parseFloat(values[1] as string)));
        });

        slider.noUiSlider.on("change", (values: (number | string)[]) => {
            const newMinValue = parseInt(values[0] as string, 10);
            const newMaxValue = parseInt(values[1] as string, 10);
            if (newMinValue <= newMaxValue) {
                onPriceChange(newMinValue, newMaxValue);
            }
        });

        return () => {
            if (slider.noUiSlider) {
                slider.noUiSlider.destroy();
            }
        };
    }, [safeMax, safeMin, range.min, range.max, onPriceChange]);

    useEffect(() => {
        if (!sliderRef.current || !sliderRef.current.noUiSlider) return;
        if (typeof safeMin !== 'number' || typeof safeMax !== 'number') return;
        if (isNaN(safeMin) || isNaN(safeMax)) return;

        const actualMin = safeMin === safeMax ? safeMin - 1 : safeMin;
        const actualMax = safeMin === safeMax ? safeMax + 1 : safeMax;

        const slider = sliderRef.current.noUiSlider;

        slider.updateOptions({
            start: [range.min || actualMin, range.max || actualMax],
            range: {
                min: actualMin,
                max: actualMax,
            },
        });
    }, [safeMin, safeMax, range.min, range.max]);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        handle: number
    ) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && sliderRef.current && sliderRef.current.noUiSlider) {
            const values = sliderRef.current.noUiSlider.get() as string[];
            values[handle] = Math.min(Math.max(value, safeMin), safeMax).toString();
            sliderRef.current.noUiSlider.set(values);
        }
    };

    return (
        <div className="bb-price-range">
            <div className="price-range-slider">
                <p className="range-value">
                    <input
                        type="text"
                        value={`BDT${minValue} - BDT${maxValue}`}
                        readOnly
                        id="amount"
                        onChange={(e) => handleInputChange(e, 1)}
                    />
                </p>
                <div ref={sliderRef} id="slider-range" className="range-bar"></div>
            </div>
        </div>
    );
};

export default PriceRangeSlider;