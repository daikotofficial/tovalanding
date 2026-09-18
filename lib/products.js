export const affiliateProducts = [
  {
    key: "tovabooks",
    name: "TovaBooks",
    signupUrl: "https://www.tovabooks.com.ng/signup",
  },
  {
    key: "tovapos",
    name: "TovaPOS",
    signupUrl: "https://www.tovapos.com.ng/sign-up-login?tab=signup",
  },
  {
    key: "tovafixedasset",
    name: "Tova Fixed Asset",
    signupUrl: "https://tovafixedasset.com.ng/signup",
  },
];

export function affiliateProduct(key) {
  return affiliateProducts.find((product) => product.key === key) || null;
}

export function productSignupUrl(product, referralCode) {
  const url = new URL(product.signupUrl);
  url.searchParams.set("ref", referralCode);
  return url.toString();
}
