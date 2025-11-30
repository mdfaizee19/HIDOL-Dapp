"use client";

import "./globals.css";
import { MeshProvider } from "@meshsdk/react";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MeshProvider>
          <AppProvider>{children}</AppProvider>
        </MeshProvider>
      </body>
    </html>
  );
}
