"use client";
import { changeCartQuantityApi } from "@/api/cart";
import { updateQuantity } from "@/store/reducer/cartSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface QuantitySelectorProps {
  id: number;
  cart_id?: number;
  quantity: number;
  onQuantityChange?: (qty: number) => void;
}

const QuantitySelector = ({
  id,
  cart_id,
  quantity,
  onQuantityChange,
}: QuantitySelectorProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(quantity || 1);

  // ✅ Sync localQuantity when quantity prop changes
  useEffect(() => {
    setLocalQuantity(quantity || 1);
  }, [quantity]);

  const handleLocalIncrement = () => {
    const newQty = localQuantity + 1;
    setLocalQuantity(newQty);
    onQuantityChange?.(newQty);
  };

  const handleLocalDecrement = () => {
    if (localQuantity > 1) {
      const newQty = localQuantity - 1;
      setLocalQuantity(newQty);
      onQuantityChange?.(newQty);
    }
  };

  const handleApiIncrement = async () => {
    if (loading || !cart_id) return;

    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    onQuantityChange?.(newQuantity);

    try {
      setLoading(true);
      await changeCartQuantityApi(cart_id, newQuantity);
      dispatch(updateQuantity({ cart_id, quantity: newQuantity }));
    } catch (err: any) {
      alert(err.message || "Failed to update quantity");
      setLocalQuantity(localQuantity);
      onQuantityChange?.(localQuantity);
    } finally {
      setLoading(false);
    }
  };

  const handleApiDecrement = async () => {
    if (loading || !cart_id || localQuantity <= 1) return;

    const newQuantity = localQuantity - 1;
    setLocalQuantity(newQuantity);
    onQuantityChange?.(newQuantity);

    try {
      setLoading(true);
      await changeCartQuantityApi(cart_id, newQuantity);
      dispatch(updateQuantity({ cart_id, quantity: newQuantity }));
    } catch (err: any) {
      alert(err.message || "Failed to update quantity");
      setLocalQuantity(localQuantity);
      onQuantityChange?.(localQuantity);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = cart_id ? handleApiDecrement : handleLocalDecrement;
  const handleIncrement = cart_id ? handleApiIncrement : handleLocalIncrement;

  return (
    <>
      <div
        className="bb-qtybtn"
        onClick={handleDecrement}
        style={{ cursor: "pointer" }}
      >
        −
      </div>
      <input
        readOnly
        className="qty-input location-select"
        value={localQuantity}
      />
      <div
        className="bb-qtybtn"
        onClick={handleIncrement}
        style={{ cursor: "pointer" }}
      >
        +
      </div>
    </>
  );
};

export default QuantitySelector;
