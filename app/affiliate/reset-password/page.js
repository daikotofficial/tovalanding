import Link from "next/link";
import PasswordResetForm from "../../../components/password-reset-form";
export const metadata = { title: "Reset password — Tova Solutions" };
export default function ResetPassword() { return <><header className="app-header"><Link className="logo" href="/">Tova Solutions</Link><Link href="/affiliate/login">Back to login</Link></header><main className="login-page"><PasswordResetForm /><p className="switch"><Link href="/affiliate/login">← Return to secure login</Link></p></main></>; }
