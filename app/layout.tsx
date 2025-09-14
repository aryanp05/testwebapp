"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactFlowProvider } from "@xyflow/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { WorkflowProvider } from "@/contexts/WorkflowContext";
import { AppProvider } from "@/contexts/AppContext";

const queryClient = new QueryClient();
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <WorkflowProvider>
              <div className="min-h-screen bg-gray-950">
                <main>
                  <ReactFlowProvider>{children}</ReactFlowProvider>
                </main>
              </div>
              <Toaster
                position="bottom-right"
                theme="dark"
                closeButton
                richColors
              />
            </WorkflowProvider>
          </AppProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
