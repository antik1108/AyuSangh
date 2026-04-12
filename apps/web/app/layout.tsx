import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AyuSangh — Healthcare Discovery",
  description:
    "Find verified hospitals, doctors, and diagnostic centres. Powered by real patient data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
