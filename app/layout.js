import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Outfit, Poppins } from "next/font/google";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "./provider/QueryProvider";

export const metadata = {
  title: "Studify",
  description: "AI based study material app",
  icons: {
    icon: "/icons8-logo.svg"
  }
};

const outfit = Outfit({ subsets: ["latin"] });
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400","700"],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className} >
          <QueryProvider>
            <Provider>{children}</Provider>
          </QueryProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
