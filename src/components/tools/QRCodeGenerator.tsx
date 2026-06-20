"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ToolLayout, ToolResult } from "./ToolLayout";
import { downloadDataUrl } from "@/lib/utils";

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState("text");

  const [text, setText] = useState("https://vizmaar.com");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wifiName, setWifiName] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");

  const [size, setSize] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    let value = "";

    if (qrType === "text") {
      value = text;
    }

    if (qrType === "phone") {
      value = `tel:${phone}`;
    }

    if (qrType === "email") {
      value = `mailto:${email}`;
    }

    if (qrType === "wifi") {
      value = `WIFI:T:WPA;S:${wifiName};P:${wifiPassword};;`;
    }

    if (!value.trim()) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [
    qrType,
    text,
    phone,
    email,
    wifiName,
    wifiPassword,
    size,
  ]);

  return (
    <ToolLayout>
      <div>
        <Label>QR Type</Label>

        <select
          value={qrType}
          onChange={(e) => setQrType(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
        >
          <option value="text">Text / URL</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="wifi">WiFi</option>
        </select>
      </div>

      {qrType === "text" && (
        <div>
          <Label>Text or URL</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}

      {qrType === "phone" && (
        <div>
          <Label>Phone Number</Label>
          <Textarea
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+923001234567"
          />
        </div>
      )}

      {qrType === "email" && (
        <div>
          <Label>Email Address</Label>
          <Textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@example.com"
          />
        </div>
      )}

      {qrType === "wifi" && (
        <>
          <div>
            <Label>WiFi Name (SSID)</Label>
            <Textarea
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
            />
          </div>

          <div>
            <Label>WiFi Password</Label>
            <Textarea
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
            />
          </div>
        </>
      )}

      <div>
        <Label>Size (px): {size}</Label>

        <input
          type="range"
          min="128"
          max="512"
          step="32"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {qrDataUrl && (
        <ToolResult label="Preview">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={qrDataUrl}
              alt="QR Code"
              width={size}
              height={size}
              className="rounded-lg border border-border max-w-full h-auto"
              unoptimized
            />

            <Button
              onClick={() =>
                downloadDataUrl(qrDataUrl, "qrcode.png")
              }
            >
              Download PNG
            </Button>
          </div>
        </ToolResult>
      )}
    </ToolLayout>
  );
}