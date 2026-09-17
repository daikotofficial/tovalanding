import Theme from "../components/theme";
import { ToastProvider } from "../components/toast";
import BackToTop from "../components/back-to-top";
export const metadata = {
  title: "Tova ERP — ERP software built around real business functions",
  description:
    "Connected ERP applications for finance, fixed assets, inventory, and workplace operations.",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Theme />
        <ToastProvider>{children}</ToastProvider>
        <BackToTop />
      </body>
    </html>
  );
}
