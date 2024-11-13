import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Mail, Copy, Check, CheckCircle, CheckCircleIcon } from "lucide-react";
import { useState } from "react";

interface EmailTemplateProps {
  promoCode: string;
  discountAmount: number;
}

function EmailTemplate({ promoCode, discountAmount }) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#333",
        maxWidth: "600px",
        margin: "40px auto",
      }}
    >

      <div
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            backgroundColor: "#4CAF50",
            color: "#FFF",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Mail />
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Your Free Discount Awaits!
          </h2>
        </div>
        <div style={{ padding: "24px" }}>
          <p style={{ fontSize: "18px", marginBottom: "16px" }}>
            Dear Valued Customer,
          </p>
          <p style={{ marginBottom: "16px" }}>
            We're excited to offer you an exclusive discount on your next
            purchase:
          </p>
          <ul
            style={{
              marginBottom: "16px",
              paddingLeft: "20px",
              listStyleType: "disc",
            }}
          >
            <li>
              <strong>{discountAmount}% OFF</strong> your entire order
            </li>
            <li>Valid until you finish using It</li>
            <li>Applicable to all produCts in our store</li>
          </ul>
          <p style={{ marginBottom: "16px" }}>
            Use the code below at checkout to claim your discount:
          </p>
          <div
            style={{
              backgroundColor: "#F3F4F6",
              color: "#1F2937",
              padding: "16px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              {promoCode}
            </span>
    
          </div>
          <p style={{ fontSize: "14px", color: "#6B7280" }}>
            This offer is valid for 7 days from receipt. Terms and conditions
            apply.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#E5E7EB",
            padding: "24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#FFF",
              backgroundColor: "#4CAF50",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailTemplate;
