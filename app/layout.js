import Theme from "../components/theme";
export const metadata = {
  title: "Tova Solutions — ERP software built around real business functions",
  description:
    "Connected ERP applications for finance, fixed assets, inventory, and workplace operations.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Theme />
        {children}
      </body>
    </html>
  );
}
