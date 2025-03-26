import Head from 'next/head'; // Pastikan import Head ini ada
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";  // Pastikan mengimpor file CSS global Anda

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Transformers Official Indonesia",
  description: "Verifikasi garansi dan keaslian produk Transformers Anda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Transformers Official Indonesia</title>
        <meta name="description" content="Verifikasi garansi dan keaslian produk Transformers Anda." />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
