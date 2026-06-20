"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolGrid, StatBox } from "./ToolLayout";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState(100);
  const [discount, setDiscount] = useState(20);

  const result = useMemo(() => {
    const saved = (originalPrice * discount) / 100;
    const finalPrice = originalPrice - saved;
    return { saved, finalPrice };
  }, [originalPrice, discount]);

  return (
    <ToolLayout>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="original">Original Price ($)</Label>
          <Input id="original" type="number" min="0" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input id="discount" type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </div>
      </div>
      <ToolGrid>
        <StatBox label="You Save" value={`$${result.saved.toFixed(2)}`} />
        <StatBox label="Final Price" value={`$${result.finalPrice.toFixed(2)}`} />
        <StatBox label="Discount" value={`${discount}%`} />
      </ToolGrid>
    </ToolLayout>
  );
}
