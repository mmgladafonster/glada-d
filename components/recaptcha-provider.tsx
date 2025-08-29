"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";

// Client-side logging (minimal)
const logClientError = (message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[RECAPTCHA CONFIG] ${message}`)
  }
}

// Security error component for missing reCAPTCHA configuration
function RecaptchaConfigError() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #fecaca'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Security Configuration Error
        </h1>
        <p style={{ marginBottom: '1rem' }}>
          The website security system is not properly configured. 
          Please contact the administrator.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Error Code: RECAPTCHA_CONFIG_MISSING
        </p>
      </div>
    </div>
  );
}

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  if (!recaptchaKey || recaptchaKey === 'your_new_site_key_here') {
    logClientError("Site key not found or using placeholder value in environment variables");
    // SECURITY: Fail securely - do not render children without reCAPTCHA protection
    return <RecaptchaConfigError />;
  }
  
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
