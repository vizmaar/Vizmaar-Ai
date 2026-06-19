"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Download, Printer, History, Trash2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ToolLayout } from "./ToolLayout";
import { saveToHistory, getHistory, saveDraft, loadDraft } from "@/lib/storage";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface BankingInfo {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  branchName: string;
}

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  taxType: "none" | "vat" | "gst";
  taxRate: number;
  discountRate: number;
  shippingFee: number;
  company: CompanyInfo;
  client: ClientInfo;
  banking: BankingInfo;
  items: LineItem[];
  notes: string;
  terms: string;
  signature: string;
  logo: string | null;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", PKR: "Rs", EUR: "€", GBP: "£", AED: "AED ", SAR: "SAR ",
};

const EMPTY_INVOICE: InvoiceData = {
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  currency: "USD",
  taxType: "none",
  taxRate: 0,
  discountRate: 0,
  shippingFee: 0,
  company: { name: "", email: "", phone: "", address: "", website: "" },
  client: { name: "", email: "", phone: "", address: "" },
  banking: { bankName: "", accountHolder: "", accountNumber: "", iban: "", swiftCode: "", branchName: "" },
  items: [{ id: "1", description: "", quantity: 1, rate: 0 }],
  notes: "",
  terms: "Payment is due within 30 days of invoice date.",
  signature: "",
  logo: null,
};

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(EMPTY_INVOICE);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<InvoiceData[]>([]);

  useEffect(() => {
    const draft = loadDraft<InvoiceData>("invoice");
    if (draft) setData(draft);
    setHistory(getHistory<InvoiceData>("invoice"));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => saveDraft("invoice", data), 800);
    return () => clearTimeout(timer);
  }, [data]);

  const sym = CURRENCY_SYMBOLS[data.currency] ?? "$";
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discount = subtotal * (data.discountRate / 100);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * (data.taxRate / 100);
  const total = afterDiscount + tax + data.shippingFee;

  const update = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const generateQR = async () => {
    const paymentText = [
      `Invoice: ${data.invoiceNumber}`,
      `Amount: ${sym}${total.toFixed(2)}`,
      data.banking.iban ? `IBAN: ${data.banking.iban}` : "",
      data.banking.accountNumber ? `Account: ${data.banking.accountNumber}` : "",
    ].filter(Boolean).join("\n");
    try {
      const url = await QRCode.toDataURL(paymentText, { width: 200, margin: 2 });
      setQrDataUrl(url);
    } catch { /* ignore */ }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const primary: [number, number, number] = [99, 102, 241];

    // Header band
    doc.setFillColor(...primary);
    doc.rect(0, 0, 210, 42, "F");

    if (data.logo) {
      try { doc.addImage(data.logo, "PNG", 15, 8, 35, 18); } catch { /* ignore */ }
    }

    doc.setTextColor(255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", data.logo ? 60 : 15, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`#${data.invoiceNumber}`, data.logo ? 60 : 15, 30);
    doc.text(`Issue: ${data.issueDate}`, 150, 18);
    if (data.dueDate) doc.text(`Due: ${data.dueDate}`, 150, 25);

    let y = 52;
    doc.setTextColor(0);

    // Company & Client
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text("FROM", 15, y);
    doc.text("BILL TO", 110, y);
    y += 6;
    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    [data.company.name, data.company.email, data.company.phone, data.company.address].filter(Boolean).forEach((line, i) => {
      doc.text(line, 15, y + i * 5);
    });
    [data.client.name, data.client.email, data.client.phone, data.client.address].filter(Boolean).forEach((line, i) => {
      doc.text(line, 110, y + i * 5);
    });
    y += 24;

    // Items table
    doc.setFillColor(...primary);
    doc.rect(15, y, 180, 8, "F");
    doc.setTextColor(255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 17, y + 5.5);
    doc.text("Qty", 120, y + 5.5);
    doc.text("Rate", 140, y + 5.5);
    doc.text("Amount", 165, y + 5.5);
    y += 11;

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    data.items.forEach((item) => {
      const amount = item.quantity * item.rate;
      doc.text(item.description || "-", 17, y);
      doc.text(String(item.quantity), 120, y);
      doc.text(`${sym}${item.rate.toFixed(2)}`, 140, y);
      doc.text(`${sym}${amount.toFixed(2)}`, 165, y);
      y += 7;
    });

    y += 5;
    const totalsX = 130;
    doc.setFontSize(9);
    const totals: [string, string][] = [
      ["Subtotal:", `${sym}${subtotal.toFixed(2)}`],
    ];
    if (data.discountRate > 0) totals.push([`Discount (${data.discountRate}%):`, `-${sym}${discount.toFixed(2)}`]);
    if (data.taxRate > 0) totals.push([`${data.taxType.toUpperCase()} (${data.taxRate}%):`, `${sym}${tax.toFixed(2)}`]);
    if (data.shippingFee > 0) totals.push(["Shipping:", `${sym}${data.shippingFee.toFixed(2)}`]);
    totals.push(["TOTAL:", `${sym}${total.toFixed(2)}`]);

    totals.forEach(([label, value], i) => {
      const isTotal = i === totals.length - 1;
      if (isTotal) { doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...primary); }
      doc.text(label, totalsX, y);
      doc.text(value, 165, y);
      y += isTotal ? 8 : 6;
      if (isTotal) { doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(0); }
    });

    // Banking
    if (data.banking.bankName || data.banking.iban) {
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primary);
      doc.text("Payment Details", 15, y); y += 6;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      const bankLines = [
        data.banking.bankName && `Bank: ${data.banking.bankName}`,
        data.banking.accountHolder && `Account Holder: ${data.banking.accountHolder}`,
        data.banking.accountNumber && `Account: ${data.banking.accountNumber}`,
        data.banking.iban && `IBAN: ${data.banking.iban}`,
        data.banking.swiftCode && `SWIFT: ${data.banking.swiftCode}`,
        data.banking.branchName && `Branch: ${data.banking.branchName}`,
      ].filter(Boolean) as string[];
      bankLines.forEach((line) => { doc.text(line, 15, y); y += 5; });
    }

    // QR Code
    if (qrDataUrl) {
      try { doc.addImage(qrDataUrl, "PNG", 155, y, 35, 35); } catch { /* ignore */ }
    }

    // Notes & Terms
    if (data.notes) {
      y += qrDataUrl ? 40 : 8;
      doc.setFont("helvetica", "bold");
      doc.text("Notes", 15, y); y += 5;
      doc.setFont("helvetica", "normal");
      doc.text(doc.splitTextToSize(data.notes, 170), 15, y);
      y += 12;
    }
    if (data.terms) {
      doc.setFont("helvetica", "bold");
      doc.text("Terms & Conditions", 15, y); y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(doc.splitTextToSize(data.terms, 170), 15, y);
    }

    // Signature
    if (data.signature) {
      doc.setFontSize(9);
      doc.text("_______________________", 15, 275);
      doc.text(data.signature, 15, 280);
    }

    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text("Generated by VIZMAAR Invoice Generator", 15, 290);

    doc.save(`${data.invoiceNumber}.pdf`);
    saveToHistory("invoice", { ...data, logo: null });
    setHistory(getHistory<InvoiceData>("invoice"));
  };

  return (
    <ToolLayout wide>
      <div className="space-y-6">
        {/* Logo & Invoice meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Company Logo</Label>
            <input type="file" accept="image/*" className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => update("logo", reader.result as string);
                reader.readAsDataURL(file);
              }} />
            {data.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logo} alt="Logo" className="h-16 mt-2 object-contain border border-border rounded-lg" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Invoice #</Label><Input value={data.invoiceNumber} onChange={(e) => update("invoiceNumber", e.target.value)} /></div>
            <div>
              <Label>Currency</Label>
              <select value={data.currency} onChange={(e) => update("currency", e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                {Object.keys(CURRENCY_SYMBOLS).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><Label>Issue Date</Label><Input type="date" value={data.issueDate} onChange={(e) => update("issueDate", e.target.value)} /></div>
            <div><Label>Due Date</Label><Input type="date" value={data.dueDate} onChange={(e) => update("dueDate", e.target.value)} /></div>
          </div>
        </div>

        {/* Company & Client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <fieldset className="space-y-2 p-4 rounded-lg border border-border">
            <legend className="text-sm font-semibold px-1">Company Information</legend>
            {(["name", "email", "phone", "address", "website"] as const).map((field) => (
              <Input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={data.company[field]}
                onChange={(e) => update("company", { ...data.company, [field]: e.target.value })} />
            ))}
          </fieldset>
          <fieldset className="space-y-2 p-4 rounded-lg border border-border">
            <legend className="text-sm font-semibold px-1">Client Information</legend>
            {(["name", "email", "phone", "address"] as const).map((field) => (
              <Input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={data.client[field]}
                onChange={(e) => update("client", { ...data.client, [field]: e.target.value })} />
            ))}
          </fieldset>
        </div>

        {/* Line Items */}
        <div>
          <Label>Line Items</Label>
          {data.items.map((item, i) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-2 mb-2">
              <Input placeholder="Description" value={item.description} className="flex-1"
                onChange={(e) => { const items = [...data.items]; items[i] = { ...item, description: e.target.value }; update("items", items); }} />
              <Input type="number" min="1" placeholder="Qty" value={item.quantity} className="w-full sm:w-20"
                onChange={(e) => { const items = [...data.items]; items[i] = { ...item, quantity: Number(e.target.value) }; update("items", items); }} />
              <Input type="number" min="0" step="0.01" placeholder="Rate" value={item.rate} className="w-full sm:w-24"
                onChange={(e) => { const items = [...data.items]; items[i] = { ...item, rate: Number(e.target.value) }; update("items", items); }} />
              <span className="flex items-center text-sm font-medium w-20">{sym}{(item.quantity * item.rate).toFixed(2)}</span>
              <Button variant="ghost" size="sm" onClick={() => update("items", data.items.filter((it) => it.id !== item.id))} disabled={data.items.length === 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => update("items", [...data.items, { id: uid(), description: "", quantity: 1, rate: 0 }])}>Add Item</Button>
        </div>

        {/* Financial */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <Label>Tax Type</Label>
            <select value={data.taxType} onChange={(e) => update("taxType", e.target.value as InvoiceData["taxType"])} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
              <option value="none">None</option><option value="vat">VAT</option><option value="gst">GST</option>
            </select>
          </div>
          <div><Label>Tax %</Label><Input type="number" min="0" max="100" value={data.taxRate} onChange={(e) => update("taxRate", Number(e.target.value))} /></div>
          <div><Label>Discount %</Label><Input type="number" min="0" max="100" value={data.discountRate} onChange={(e) => update("discountRate", Number(e.target.value))} /></div>
          <div><Label>Shipping</Label><Input type="number" min="0" step="0.01" value={data.shippingFee} onChange={(e) => update("shippingFee", Number(e.target.value))} /></div>
        </div>

        {/* Banking */}
        <fieldset className="space-y-2 p-4 rounded-lg border border-border">
          <legend className="text-sm font-semibold px-1">Banking Details</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([["bankName", "Bank Name"], ["accountHolder", "Account Holder"], ["accountNumber", "Account Number"], ["iban", "IBAN"], ["swiftCode", "SWIFT Code"], ["branchName", "Branch Name"]] as const).map(([key, label]) => (
              <div key={key}><Label>{label}</Label><Input value={data.banking[key]} onChange={(e) => update("banking", { ...data.banking, [key]: e.target.value })} /></div>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={generateQR}><QrCode className="h-4 w-4" /> Generate Payment QR</Button>
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="Payment QR" className="h-32 w-32 border border-border rounded-lg" />
          )}
        </fieldset>

        {/* Notes, Terms, Signature */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Notes</Label><Textarea value={data.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Thank you for your business..." /></div>
          <div><Label>Terms & Conditions</Label><Textarea value={data.terms} onChange={(e) => update("terms", e.target.value)} /></div>
        </div>
        <div><Label>Signature Name</Label><Input value={data.signature} onChange={(e) => update("signature", e.target.value)} placeholder="Authorized signatory" /></div>

        {/* Totals & Actions */}
        <div className="rounded-lg border border-border p-4 bg-surface-hover/30 space-y-2">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{sym}{subtotal.toFixed(2)}</span></div>
          {data.discountRate > 0 && <div className="flex justify-between text-sm text-success"><span>Discount ({data.discountRate}%)</span><span>-{sym}{discount.toFixed(2)}</span></div>}
          {data.taxRate > 0 && <div className="flex justify-between text-sm"><span>{data.taxType.toUpperCase()} ({data.taxRate}%)</span><span>{sym}{tax.toFixed(2)}</span></div>}
          {data.shippingFee > 0 && <div className="flex justify-between text-sm"><span>Shipping</span><span>{sym}{data.shippingFee.toFixed(2)}</span></div>}
          <div className="flex justify-between text-lg font-bold border-t border-border pt-2"><span>Grand Total</span><span className="text-brand">{sym}{total.toFixed(2)}</span></div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={generatePDF}><Download className="h-4 w-4" /> Download PDF</Button>
          <Button variant="outline" onClick={generatePDF}><Printer className="h-4 w-4" /> Print</Button>
          <Button variant="secondary" onClick={() => setShowHistory(!showHistory)}><History className="h-4 w-4" /> History ({history.length})</Button>
        </div>

        {showHistory && history.length > 0 && (
          <div className="space-y-2">
            {history.map((inv, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border text-sm">
                <span>{inv.invoiceNumber} — {inv.client.name || "No client"}</span>
                <Button variant="ghost" size="sm" onClick={() => setData({ ...inv, logo: null })}>Load</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
