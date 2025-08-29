"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";

// Client-side logging (minimal)
const logClientError = (message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[RECAPTCHA CONFIG] ${message}`)
  }
}

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!recaptchaKey) {
    logClientError("Site key not found in environment variables");
    return <>{children}</>;
  }
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
