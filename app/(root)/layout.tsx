import type { Metadata } from "next";
import { Lexend } from "next/font/google";

import { MainLayout } from "@/src/shared/components/common/Layout";

import { ThemeProvider } from "next-themes";
import { AntdStyledComponentsRegistry } from "@/src/shared/infra/antd/AntdStyledComponentsRegistry";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";

import "@/src/shared/styles/_main.scss";
import Head from "next/head";
import { NavigationEvents } from "@/src/shared/components/utils/NavigationItems";

const lexend = Lexend({ display: "swap", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description:
    "Threads clone using Nextjs, Prisma, TailwindCSS, Ant Design, Zustand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={lexend.className}>
        <ClerkProvider>
          <ThemeProvider attribute="class">
            <AntdStyledComponentsRegistry>
              <MainLayout>
                {children}
                <Suspense fallback={null}>
                  <NavigationEvents />
                </Suspense>
              </MainLayout>
            </AntdStyledComponentsRegistry>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
