"use client"
import React from 'react'
import { Fade } from 'react-awesome-reveal'
import fetcher from '../fetcher/Fetcher';
import useSWR from 'swr';

interface OfferItem {
    id: string | number;
    icon: string;
    name?: string;
}

const Offer = ({
                   onSuccess = () => { },
                   hasPaginate = false,
                   onError = () => { },
               }) => {

    const API_BASE = process.env.NEXT_PUBLIC_DOMAIN;
    const IMAGE_BASE = process.env.NEXT_PUBLIC_PATH;
    const { data, error } = useSWR(`${API_BASE}/all-offers`, fetcher, { onSuccess, onError });

    if (error) return <div>Failed to load offers</div>;
    if (!data) return null;

    const offers: OfferItem[] = data?.data ?? [];

    if (!offers.length) return null;

    const rows: OfferItem[][] = [];
    for (let i = 0; i < offers.length; i += 2) {
        rows.push(offers.slice(i, i + 2));
    }

    return (
        <>
            <style>{`
                .offer-section {
                    padding: 20px 0;
                }
                .offer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 15px;
                }
                .offer-row {
                    display: flex;
                    gap: 14px;
                    margin-bottom: 14px;
                }
                .offer-banner {
                    flex: 1;
                    border-radius: 12px;
                    overflow: hidden;
                    height: 200px;
                }
                .offer-banner img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                @media (max-width: 768px) {
                    .offer-row {
                        flex-direction: column;
                    }
                    .offer-banner {
                        height: 160px;
                    }
                }
            `}</style>

            <section className="offer-section">
                <div className="offer-container">
                    {rows.map((row, rowIdx) => (
                        <Fade key={rowIdx} triggerOnce direction="up" duration={800} delay={rowIdx * 150}>
                            <div className="offer-row">
                                {row.map((offer: OfferItem) => (
                                    <div key={offer.id} className="offer-banner">
                                        <img
                                            src={offer.icon}
                                            alt={offer.name || 'Offer'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Offer