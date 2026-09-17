import Link from "next/link";
import PasswordResetForm from "../../../components/password-reset-form";
import SiteFooter from "../../../components/site-footer";
import BrandLogo from "../../../components/brand-logo";
export const metadata = { title: "Reset password — Tova ERP" };
export default function ResetPassword() { return <><header className="app-header"><Link className="logo" href="/"><BrandLogo /></Link><Link href="/affiliate/login">Back to login</Link></header><main className="login-page"><PasswordResetForm /><p className="switch"><Link href="/affiliate/login">← Return to secure login</Link></p></main><SiteFooter /></>; }
