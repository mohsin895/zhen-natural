"use client";
import React from "react";

interface Product {
  id: number;
  name: string;
  thumbnail_image: string;
}

interface WholesaleCardProps {
  product: Product;
  selected: boolean;
  quantity: number;
  onToggle: (id: number) => void;
  onQuantityChange: (id: number, qty: number) => void;
}

const WholesaleCard: React.FC<WholesaleCardProps> = ({
  product,
  selected,
  quantity,
  onToggle,
  onQuantityChange,
}) => {
  return (
    <>
      <div
        className={`ws-card${selected ? " ws-card--selected" : ""}`}
        onClick={() => onToggle(product.id)}
      >
        {selected && <span className="ws-card__check">✓</span>}

        <div className="ws-card__img-wrap">
          <img
            src={product.thumbnail_image}
            alt={product.name}
            className="ws-card__img"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://admin.zhennatural.com/public/assets/img/placeholder.jpg";
            }}
          />
        </div>

        <p className="ws-card__title">{product.name}</p>

        {selected && (
          <div className="ws-card__qty" onClick={(e) => e.stopPropagation()}>
            <button
              className="ws-qty-btn"
              onClick={() =>
                onQuantityChange(product.id, Math.max(1, quantity - 1))
              }
            >
              −
            </button>
            <span className="ws-qty-val">{quantity}</span>
            <button
              className="ws-qty-btn"
              onClick={() => onQuantityChange(product.id, quantity + 1)}
            >
              +
            </button>
          </div>
        )}
      </div>

      <style>{`
        .ws-card {
          position: relative;
          background: #fff;
          border: 2px solid #e4efcc;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          user-select: none;
        }
        .ws-card:hover {
          border-color: #82bc23;
          box-shadow: 0 4px 14px rgba(130,188,35,0.2);
          transform: translateY(-2px);
        }
        .ws-card--selected {
          border-color: #82bc23 !important;
          background: #f6ffea;
          box-shadow: 0 4px 18px rgba(130,188,35,0.28) !important;
        }
        .ws-card__check {
          position: absolute;
          top: 7px; right: 7px;
          width: 22px; height: 22px;
          background: #82bc23;
          color: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800;
          z-index: 3;
        }
        .ws-card__img-wrap {
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #f2f7e8;
        }
        .ws-card__img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
          display: block;
        }
        .ws-card:hover .ws-card__img { transform: scale(1.05); }
        .ws-card__title {
          padding: 8px 10px 4px;
          font-size: 13px;
          font-weight: 600;
          color: #1a2008;
          line-height: 1.4;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin: 0;
        }
        .ws-card__qty {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 6px 10px 10px;
        }
        .ws-qty-btn {
          width: 26px; height: 26px;
          background: #82bc23;
          color: #fff;
          border: none; border-radius: 6px;
          font-size: 16px; font-weight: 700;
          cursor: pointer; line-height: 1;
          transition: background 0.15s;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .ws-qty-btn:hover { background: #6aa81e; }
        .ws-qty-val {
          min-width: 26px;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: #1a2008;
        }
      `}</style>
    </>
  );
};

export default WholesaleCard;
