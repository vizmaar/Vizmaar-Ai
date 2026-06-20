"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ToolLayout } from "./ToolLayout";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  PKR: "Rs",
  EUR: "€",
  GBP: "£",
  AED: "AED",
  SAR: "SAR",
};

export default function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);
  const [currency, setCurrency] = useState("USD");
  const [logo, setLogo] = useState<string | null>(null);

  const sym = CURRENCY_SYMBOLS[currency] ?? "$";
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    if (logo) {
      doc.addImage(logo, "PNG", 150, 10, 40, 20);
    }

    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text("INVOICE", 20, 35);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`#${invoiceNumber}`, 20, 42);
    doc.text(`Date: ${date}`, 150, 47);
    if (dueDate) doc.text(`Due: ${dueDate}`, 150, 54);

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text("From:", 20, 56);
    doc.setFontSize(10);
    doc.text(fromName || "Your Name", 20, 63);
    doc.text(fromEmail || "your@email.com", 20, 69);

    doc.setFontSize(11);
    doc.text("Bill To:", 120, 56);
    doc.setFontSize(10);
    doc.text(toName || "Client Name", 120, 63);
    doc.text(toEmail || "client@email.com", 120, 69);

    let y = 84;
    doc.setFillColor(99, 102, 241);
    doc.rect(20, y, 170, 8, "F");
    doc.setTextColor(255);
    doc.setFontSize(9);
    doc.text("Description", 22, y + 5.5);
    doc.text("Qty", 120, y + 5.5);
    doc.text("Rate", 140, y + 5.5);
    doc.text("Amount", 165, y + 5.5);
    y += 12;

    doc.setTextColor(0);
    items.forEach((item) => {
      const amount = item.quantity * item.rate;
      doc.text(item.description || "-", 22, y);
      doc.text(String(item.quantity), 120, y);
      doc.text(`${sym}${item.rate.toFixed(2)}`, 140, y);
      doc.text(`${sym}${amount.toFixed(2)}`, 165, y);
      y += 8;
    });

    y += 10;
    doc.text(`Subtotal: ${sym}${subtotal.toFixed(2)}`, 140, y);
    y += 7;
    if (taxRate > 0) {
      doc.text(`Tax (${taxRate}%): ${sym}${tax.toFixed(2)}`, 140, y);
      y += 7;
    }
    doc.setFontSize(12);
    doc.setTextColor(99, 102, 241);
    doc.text(`Total: ${sym}${total.toFixed(2)}`, 140, y);

    if (notes) {
      y += 15;
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("Notes:", 20, y);
      doc.text(notes, 20, y + 7);
    }

    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <ToolLayout>
      <div>
        <Label>Company Logo</Label>
        <input
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-hover cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => setLogo(reader.result as string);
            reader.readAsDataURL(file);
          }}
        />
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo preview" className="h-20 mt-3 object-contain border border-border rounded-lg" />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
          >
            <option value="USD">USD ($)</option>
            <option value="PKR">PKR (Rs)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED</option>
            <option value="SAR">SAR</option>
          </select>
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input id="taxRate" type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>From</Label>
          <Input placeholder="Your name" value={fromName} onChange={(e) => setFromName(e.target.value)} className="mb-2" />
          <Input placeholder="your@email.com" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
        </div>
        <div>
          <Label>Bill To</Label>
          <Input placeholder="Client name" value={toName} onChange={(e) => setToName(e.target.value)} className="mb-2" />
          <Input placeholder="client@email.com" value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Line Items</Label>
        {items.map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2 mb-2">
            <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} className="flex-1" />
            <Input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, "quantity", Number(e.target.value))} className="w-full sm:w-20" />
            <Input type="number" min="0" step="0.01" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(i, "rate", Number(e.target.value))} className="w-full sm:w-24" />
            <Button variant="ghost" size="sm" onClick={() => removeItem(i)} disabled={items.length === 1}>Remove</Button>
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, thank you note..." />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="text-sm text-muted space-x-2">
          <span>Subtotal: {sym}{subtotal.toFixed(2)}</span>
          <span>|</span>
          <span>Tax: {sym}{tax.toFixed(2)}</span>
          <span>|</span>
          <span className="font-semibold text-foreground">Total: {sym}{total.toFixed(2)}</span>
        </div>
        <Button onClick={generatePDF}>Download PDF</Button>
      </div>
    </ToolLayout>
  );
}
