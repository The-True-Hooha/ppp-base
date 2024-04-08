import Providers from "@/redux/provider";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "PPP-Base",
  description: "Generated by create next app",
  icons: {
    icon: ["/favicon.ico?v=4"],
  },
};

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en">
        <body className="lg:max-w-2xl mx-auto  ">
          {children}

          <ToastContainer closeOnClick pauseOnHover />
        </body>
      </html>
    </Providers>
  );
}

// localStorage: window.localStorage
// url: window.localStorage.href
