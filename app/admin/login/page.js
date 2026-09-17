import Link from "next/link";
import AdminLoginForm from "../../../components/admin-login-form";
import BrandLogo from "../../../components/brand-logo";

export const metadata = { title: "Administrator sign in — Tova ERP" };

export default function AdminLogin() {
  return (
    <>
      <header className="app-header"><Link className="logo" href="/"><BrandLogo /></Link></header>
      <main className="login-page admin-login-page">
        <p className="eyebrow">SECURE ADMINISTRATION</p>
        <h1>Administrator sign in</h1>
        <p>Use the deployment-configured superadmin credentials to manage affiliate applications.</p>
        <AdminLoginForm />
      </main>
    </>
  );
}
