import Image from "next/image";

export default function BrandLogo() {
  return (
    <span className="brand-logo-crop" aria-label="Tova ERP">
      <Image
        src="/tova-erp-logo.png"
        alt="Tova ERP"
        width={1308}
        height={1159}
        priority
        className="brand-logo-image"
      />
    </span>
  );
}
