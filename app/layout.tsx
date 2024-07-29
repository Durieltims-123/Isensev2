import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
import { SessionProvider } from "next-auth/react";
import { getSession } from "next-auth/react";
// import { Session } from "next-auth/types";
const inter = Inter({ subsets: ["latin"] });
import { Session } from "next-auth";
import GoogleCaptchaWrapper from "@/components/auth/captcha-wrapper";
export const metadata: Metadata = {
  title: "iSense",
};

// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const session = await auth();

//   return (
//     <html lang="en">
//       <body>
//         <AuthContext session={session}>
//           {children}
//         </AuthContext >
//       </body>
//     </html>
//   )
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider session={session}>
            <GoogleCaptchaWrapper>
              <Toaster />
              {children}
            </GoogleCaptchaWrapper>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
