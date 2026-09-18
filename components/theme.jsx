// One shared design system for all React routes.
const styles = `
@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/poppins-400.woff2") format("woff2");
}
@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/poppins-500.woff2") format("woff2");
}
@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/poppins-600.woff2") format("woff2");
}
@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/poppins-700.woff2") format("woff2");
}
:root {
  --navy: #07172f;
  --blue: #234b76;
  --green: #07996e;
  --mint: #d6faea;
  --bg: #f7fbf8;
  --line: #d9e6df;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  background: white;
  color: var(--navy);
  font-family: "Poppins", Arial, sans-serif;
  overflow-x: hidden;
}
.header {
  height: 66px;
  border-top: 3px solid #18302b;
  border-bottom: 1px solid #e0eee7;
  display: flex;
  align-items: center;
  padding: 0 max(40px, calc((100% - 1400px) / 2));
  gap: 32px;
  background: #fff;
}
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  color: var(--green);
  font-weight: 700;
  font-size: 16px;
}
.brand-logo-crop {position:relative;display:block;width:116px;height:44px;overflow:hidden;flex:0 0 116px;}
.brand-logo-image {position:absolute;left:0;top:-34px;width:116px;height:auto;max-width:none;}
.logo span {
  font: bold 20px "Poppins", sans-serif;
  color: #168a61;
}
.header nav {
  display: flex;
  gap: 32px;
  margin-left: auto;
}
.header nav a,
footer a {
  color: var(--navy);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}
.header nav a:hover,
footer a:hover {
  color: var(--green);
}
.top-button,
.button {
  border-radius: 5px;
  padding: 10px 17px;
  font-size: 12px;
  text-decoration: none;
  font-weight: 700;
}
.top-button {
  background: var(--green);
  color: #fff;
}
.top-button b,
.button b {
  margin-left: 12px;
}
.hero {
  min-height: 745px;
  padding: 80px max(40px, calc((100% - 1400px) / 2));
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 65px;
  align-items: center;
  background: #f7fcf9;
  background-image: repeating-linear-gradient(
    135deg,
    rgba(10, 155, 110, 0.045) 0,
    rgba(10, 155, 110, 0.045) 1px,
    transparent 1px,
    transparent 13px
  );
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 0.19em;
  font-weight: 700;
  color: var(--green);
}
h1,
h2,
h3,
p {
  margin-top: 0;
}
.hero h1 {
  font-size: clamp(48px, 5vw, 70px);
  line-height: 1.1;
  letter-spacing: -0.075em;
  max-width: 640px;
  margin: 27px 0;
  color: var(--navy);
  font-weight: 700;
}
.lead {
  color: var(--blue);
  font-size: 16px;
  line-height: 1.75;
  max-width: 560px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin: 30px 0;
}
.button.dark {
  background: var(--navy);
  color: #fff;
}
.button.outline {
  color: var(--navy);
  border: 1px solid #bfd1df;
}
.hero-list {
  columns: 2;
  padding: 0;
  list-style: none;
  color: var(--blue);
  font-size: 13px;
  line-height: 1.45;
  max-width: 550px;
}
.hero-list li {
  break-inside: avoid;
  margin: 12px 15px 0 0;
}
.hero-list li:before {
  content: "✓";
  border: 1px solid var(--green);
  color: var(--green);
  border-radius: 50%;
  font-size: 9px;
  padding: 0 2px;
  margin-right: 8px;
}
.snapshot {
  padding: 33px;
  border-radius: 29px;
  background: linear-gradient(135deg, #0b4443, #06142b);
  color: #fff;
  box-shadow: 0 25px 50px rgba(8, 30, 47, 0.22);
}
.snapshot .mint {
  color: #a6e9cb;
}
.snapshot h2 {
  font-size: 26px;
  line-height: 1.35;
  letter-spacing: -0.04em;
  margin: 17px 0 28px;
}
.snapshot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.snapshot-grid > div {
  min-height: 135px;
  border: 1px solid #405870;
  background: #1d3047;
  border-radius: 12px;
  padding: 17px;
}
.snapshot-grid h3 {
  font-size: 14px;
  line-height: 1.5;
}
.snapshot-grid p {
  font-size: 12px;
  line-height: 1.4;
  color: #c7d5df;
}
.snapshot-note {
  border: 1px solid #187d72;
  border-radius: 13px;
  background: #083c42;
  margin-top: 20px;
  padding: 16px;
  font-size: 12px;
  color: #c0f3de;
}
.standards {
  padding: 0 max(40px, calc((100% - 1400px) / 2));
  background: #f7fcf9;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  position: relative;
  top: 0;
  padding: 0 0 65px;
}
.cards article {
  background: #fff;
  border: 1px solid #cfe0d8;
  border-radius: 16px;
  padding: 25px;
  min-height: 190px;
  box-shadow: 0 12px 25px rgba(20, 60, 70, 0.07);
}
.card-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  border-radius: 11px;
  background: var(--mint);
  color: var(--green);
  font-size: 20px;
}
.cards h3 {
  font-size: 17px;
  margin: 18px 0 7px;
}
.cards p,
.solution p,
.engagement article p {
  font-size: 13px;
  line-height: 1.65;
  color: var(--blue);
}
.solution {
  padding: 92px max(40px, calc((100% - 1400px) / 2));
}
.section-title {
  max-width: 760px;
}
.section-title h2,
.engagement > h2,
.products > h2 {
  font-size: 42px;
  line-height: 1.15;
  letter-spacing: -0.06em;
  margin: 18px 0 48px;
}
.solution-grid,
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.solution-grid article {
  border: 1px solid #d7e6e0;
  border-radius: 16px;
  padding: 25px;
  min-height: 235px;
}
.solution-grid h3 {
  font-size: 19px;
  margin: 0 0 8px;
}
.solution-grid span {
  display: block;
  color: var(--blue);
  font-size: 13px;
  line-height: 2;
}
.solution-grid span::first-letter {
  color: var(--green);
}
.engagement {
  background: #effaf4;
  padding: 88px max(40px, calc((100% - 1400px) / 2));
  text-align: center;
}
.engagement > h2 {
  margin-bottom: 38px;
}
.steps {
  text-align: left;
}
.steps article {
  background: #fff;
  border: 1px solid #c9eedb;
  border-radius: 16px;
  padding: 25px;
  min-height: 160px;
}
.steps article .eyebrow {
  margin-bottom: 17px;
}
.steps h3 {
  font-size: 16px;
  margin: 0 0 7px;
}
.products {
  padding: 98px max(40px, calc((100% - 1400px) / 2));
  text-align: center;
}
.center {
  display: block;
  text-align: center;
}
.products h2 {
  margin: 17px 0 12px;
}
.copy {
  color: var(--blue);
  font-size: 12px;
  max-width: 600px;
  margin: 0 auto;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: left;
  margin-top: 50px;
}
.product {
  min-height: 260px;
  border: 1px solid #d7e6e0;
  border-radius: 16px;
  padding: 24px;
  text-decoration: none;
  color: var(--navy);
  position: relative;
}
.product:hover {
  border-color: #8fdbc0;
  box-shadow: 0 12px 25px rgba(20, 60, 70, 0.07);
}
.product-badge {
  display: inline-block;
  background: var(--mint);
  color: #087d5b;
  padding: 5px 10px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 700;
}
.product-badge.muted {
  background: #edf1ed;
  color: #6e7c71;
}
.product h3 {
  font-size: 17px;
  margin: 26px 0 8px;
}
.product p {
  color: var(--blue);
  font-size: 11px;
  line-height: 1.6;
}
.product > b,
.product .coming {
  position: absolute;
  bottom: 22px;
  left: 24px;
  font-size: 11px;
  color: var(--green);
}
.product .coming {
  color: #7b887d;
}
.affiliate {
  padding: 90px max(40px, calc((100% - 1400px) / 2));
}
.affiliate > div {
  background: #083d43;
  border-radius: 18px;
  padding: 55px 65px;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
.affiliate .mint {
  color: #a5eacd;
}
.affiliate h2 {
  font-size: 42px;
  letter-spacing: -0.06em;
  margin: 20px 0;
}
.affiliate > div > div:first-child > p:not(.eyebrow) {
  max-width: 390px;
  color: #b8ddd1;
  font-size: 13px;
}
.button.light {
  display: inline-block;
  background: #fff;
  color: var(--navy);
  margin-top: 14px;
}
.affiliate-side {
  align-self: flex-end;
  border-top: 1px solid #4f877f;
  padding-top: 17px;
  width: 30%;
  font-size: 10px;
  color: #a5dcca;
}
.affiliate-side strong {
  display: block;
  color: #fff;
  font-size: 25px;
  line-height: 1.1;
  margin-top: 22px;
}
.affiliate-side strong br + * {
  color: #a5eacd;
}
footer {
  border-top: 1px solid var(--line);
  padding: 27px max(40px, calc((100% - 1400px) / 2)) 38px;
  display: grid;
  grid-template-columns: 1fr 1.4fr 2fr;
  gap: 20px;
}
footer p {
  font-size: 11px;
  color: var(--blue);
}
footer div {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}
footer small {
  grid-column: 1/-1;
  color: #84928a;
  font-size: 10px;
}
@media (max-width: 800px) {
  .header {
    padding: 0 20px;
  }
  .header nav,
  .top-button {
    display: none;
  }
  .hero {
    display: block;
    padding: 70px 20px;
  }
  .hero h1 {
    font-size: 49px;
  }
  .hero-list {
    columns: 1;
  }
  .snapshot {
    margin-top: 50px;
    padding: 24px;
  }
  .snapshot-grid {
    grid-template-columns: 1fr;
  }
  .snapshot-grid > div {
    min-height: 0;
  }
  .cards,
  .solution-grid,
  .steps,
  .product-grid {
    display: block;
  }
  .cards article,
  .solution-grid article,
  .steps article,
  .product {
    margin-bottom: 14px;
  }
  .solution,
  .engagement,
  .products,
  .affiliate {
    padding: 75px 20px;
  }
  .section-title h2,
  .engagement > h2,
  .products > h2,
  .affiliate h2 {
    font-size: 38px;
  }
  .affiliate > div {
    display: block;
    padding: 38px 27px;
  }
  .affiliate-side {
    width: 100%;
    margin-top: 55px;
  }
  footer {
    display: block;
    padding: 28px 20px;
  }
  footer p {
    margin: 15px 0;
  }
  footer div {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .hero-actions {
    flex-wrap: wrap;
  }
}

.app-header {
  height: 66px;
  border-top: 3px solid #18302b;
  border-bottom: 1px solid #deebe5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 max(25px, calc((100% - 1320px) / 2));
}
.app-header a {
  color: #07172f;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
}
.app-header nav {
  display: flex;
  gap: 25px;
  margin-left: auto;
  margin-right: 35px;
}
.auth-layout {
  min-height: calc(100vh - 66px);
  display: grid;
  grid-template-columns: 1fr 430px;
  gap: 110px;
  align-items: center;
  max-width: 1120px;
  margin: auto;
  padding: 70px 0;
}
.auth-copy h1,
.login-page h1,
.dashboard h1 {
  font-size: clamp(42px, 5vw, 68px);
  letter-spacing: -0.075em;
  line-height: 1.06;
  margin: 22px 0;
}
.auth-copy h1 em,
.login-page h1 em,
.dashboard h1 em {
  font: inherit;
  color: #07996e;
}
.auth-copy > p:not(.eyebrow) {
  max-width: 500px;
  color: #31567d;
  line-height: 1.75;
}
.auth-points {
  display: grid;
  gap: 13px;
  margin-top: 42px;
  color: #31567d;
  font-size: 12px;
}
.auth-points b {
  color: #07996e;
  font:
    11px ui-monospace,
    monospace;
  margin-right: 14px;
}
.auth-card {
  background: #fff;
  border: 1px solid #d7e6df;
  border-radius: 14px;
  padding: 32px;
  box-shadow: 0 18px 40px rgba(12, 51, 68, 0.08);
}
.form-kicker {
  color: #07996e;
  font:
    700 10px ui-monospace,
    monospace;
  letter-spacing: 0.14em;
}
.auth-card h2 {
  font-size: 25px;
  letter-spacing: -0.06em;
  margin: 15px 0 8px;
}
.form-help {
  font-size: 11px;
  color: #687b8d;
  line-height: 1.6;
}
.auth-card form {
  display: grid;
  gap: 15px;
  margin-top: 25px;
}
.auth-card label {
  font-size: 11px;
  font-weight: 700;
  color: #45586c;
}
.auth-card input,
.auth-card select {
  display: block;
  width: 100%;
  margin-top: 7px;
  padding: 12px;
  border: 1px solid #c9d9d1;
  border-radius: 4px;
  font: 12px "Poppins";
  outline: none;
}
.auth-card input:focus,
.auth-card select:focus {
  border-color: #07996e;
}
.auth-card .check {
  font-weight: 400;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.check input {
  width: 15px !important;
  margin: 2px 0 0 !important;
}
.solid {
  background: #07172f;
  color: #fff;
  border: 0;
  border-radius: 4px;
  padding: 13px 16px;
  font: 700 12px "Poppins";
  cursor: pointer;
}
.solid:disabled {
  opacity: 0.6;
}
.switch {
  font-size: 11px;
  color: #70808c;
}
.switch a {
  color: #07996e;
  font-weight: 700;
}
.error {
  background: #fff0ed;
  color: #a34638;
  padding: 10px;
  font-size: 11px;
}
.affiliate-hero {
}
.dashboard {
  max-width: 1120px;
  padding: 78px 0 110px;
  margin: auto;
}
.dashboard-shell {display:grid;grid-template-columns:230px minmax(0,1fr);min-height:calc(100vh - 66px);background:#f7faf8;}
.dashboard-sidebar {display:flex;flex-direction:column;padding:32px 20px;border-right:1px solid #dfeae4;background:#fff;}
.dashboard-sidebar .logo {padding:0 12px;}
.sidebar-label {margin:58px 12px 12px;font:700 10px ui-monospace,monospace;letter-spacing:.12em;color:#93a299;}
.sidebar-nav {display:grid;gap:4px;}.sidebar-nav a {display:flex;align-items:center;gap:12px;padding:12px;border-radius:7px;color:#62746b;text-decoration:none;font-size:12px;font-weight:600;}.sidebar-nav a span {width:16px;color:#82968b;font-size:15px;text-align:center;}.sidebar-nav a:hover,.sidebar-nav a.active {background:#eaf7f0;color:#087b5c;}.sidebar-nav a.active span {color:#087b5c;}
.sidebar-bottom {margin-top:auto;padding:16px 12px;border-top:1px solid #e5ede8;}.sidebar-bottom p {font-size:11px;color:#87968e;margin-bottom:3px;}.sidebar-bottom a {font-size:11px;color:#087b5c;text-decoration:none;font-weight:600;line-height:1.5;}
.dashboard-main {min-width:0;max-width:1320px;width:100%;padding:0 48px 50px;}.dashboard-main .dashboard-footer {display:flex;justify-content:space-between;margin-top:24px;color:#91a097;font-size:11px;}.dashboard-main .dashboard-footer a {font-size:11px;color:#688077;}
.dashboard .app-label {
  font:
    10px ui-monospace,
    monospace;
  letter-spacing: 0.1em;
  color: #718378;
}
.dash-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  border-bottom: 1px solid #d7e6df;
  padding-bottom: 35px;
}
.dash-head h1 {
  margin-bottom: 0;
}
.dash-actions {display:flex;align-items:center;gap:16px;}
.settings-link {border:1px solid #cfe0d8;border-radius:4px;padding:10px 14px;}
.dashboard-tabs {display:flex;align-items:center;gap:24px;border-bottom:1px solid #d7e6df;padding:18px 0 0;margin-top:8px;}
.dashboard-tabs a,.dashboard-tabs span {padding:0 0 16px;color:#718378;font-size:12px;text-decoration:none;font-weight:600;}
.dashboard-tabs a.active {color:#07865f;border-bottom:2px solid #07865f;}
.dashboard-tabs span {margin-left:auto;font-weight:400;}
.dashboard-tabs span strong {color:#07865f;margin-left:5px;}
.dash-head > a,
.dashboard a {
  color: #07996e;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}
.referral-identity {
  background: #073d43;
  color: #fff;
  padding: 25px 30px;
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 7px;
}
.referral-identity small,
.dash-metrics small {
  display: block;
  font:
    9px ui-monospace,
    monospace;
  letter-spacing: 0.08em;
  color: #9dd8c7;
}
.referral-identity strong {
  display: block;
  color: #bdec4a;
  font:
    700 28px ui-monospace,
    monospace;
  margin: 7px 0;
}
.referral-identity p {
  margin: 0;
  color: #b4d6d0;
  font-size: 11px;
}
.dash-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 28px 0;
}
.dash-metrics > div {
  padding: 21px;
  border-block: 1px solid #d7e6df;
  border-left: 1px solid #d7e6df;
}
.dash-metrics > div:last-child {
  border-right: 1px solid #d7e6df;
}
.dash-metrics strong {
  display: block;
  font-size: 24px;
  letter-spacing: -0.06em;
  margin: 8px 0;
}
.dash-metrics small {font-size:10px;}
.dash-metrics span,
.fine {
  color: #819089;
  font-size: 12px;
}
.dash-panels {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr;
  gap: 18px;
}
.dash-panels > div {
  background: #fff;
  border: 1px solid #d7e6df;
  border-radius: 8px;
  padding: 24px;
}
.dash-panels h2 {
  font-size: 19px;
  letter-spacing: -0.05em;
  border-bottom: 1px solid #d7e6df;
  padding-bottom: 17px;
  margin: 0;
}
.empty-state {
  text-align: center;
  padding: 65px 15px;
  color: #84938a;
}
.empty-state strong {
  font-size: 28px;
  color: #c4e66c;
}
.empty-state h3 {
  font-size: 14px;
  color: #425650;
  margin: 8px;
}
.empty-state p {
  font-size: 11px;
}
.payout-line {
  display: flex;
  justify-content: space-between;
  padding: 25px 0;
  border-bottom: 1px solid #d7e6df;
  color: #69776e;
  font-size: 13px;
}
.payout-line strong {
  color: #07172f;
  font-size: 20px;
}
.dash-panels .solid {
  margin-top: 20px;
}
.fine {
  line-height: 1.6;
}
.login-page {
  max-width: 450px;
  margin: 80px auto;
}
.login-page h1 {
  font-size: 50px;
}
.loading {
  text-align: center;
  padding: 110px;
  color: #687b8d;
}
.admin-status {
  color: #07996e;
  font:
    10px ui-monospace,
    monospace;
}
.admin-review-actions {display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.admin-review-actions button {border:1px solid transparent;border-radius:4px;padding:8px 11px;cursor:pointer;font:600 11px "Poppins";}
.admin-approve {background:#087b5c;color:#fff;}
.admin-reject {background:#fff;color:#a34638;border-color:#e6c5bd!important;}
.admin-review-actions button:disabled {opacity:.55;cursor:wait;}
.admin-review-actions small {width:100%;color:#087b5c;font-size:10px;}
.admin-affiliate-details {grid-column:1 / -1;margin-top:8px;border-top:1px solid #edf1ee;padding-top:10px;}
.admin-affiliate-details summary {cursor:pointer;color:#087b5c;font-size:12px;font-weight:600;}
.admin-detail-grid {display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:14px;padding:16px;background:#f7fbf8;border-radius:7px;}
.admin-detail-grid div {display:grid;align-content:start;gap:5px;min-width:0;}.admin-detail-grid strong {font-size:11px;color:#31567d;margin-bottom:3px;}.admin-detail-grid span {font-size:11px;color:#718378;overflow-wrap:anywhere;}
.review-page {max-width:680px;margin:0 auto;padding:110px 20px;text-align:center;}
.review-page h1 {font-size:clamp(34px,4vw,52px);letter-spacing:-.05em;line-height:1.12;margin:20px 0 16px;}
.review-page > p:not(.eyebrow) {color:#587067;font-size:16px;line-height:1.75;}
.review-status {display:grid;gap:7px;margin:32px 0;padding:22px;border:1px solid #d5e7dd;border-radius:10px;background:#f3fbf6;color:#31567d;font-size:13px;line-height:1.6;}
.review-status strong {color:#087b5c;font-size:14px;}
.auth-layout a,.dashboard-shell a,.settings-page a,.review-page a {text-decoration:none;}
.admin-login-page {max-width:520px;margin:0 auto;padding:86px 20px 110px;}
.admin-login-page h1 {font-size:clamp(34px,4vw,48px);line-height:1.12;letter-spacing:-.05em;margin:18px 0 14px;}
.admin-login-page > p:not(.eyebrow) {color:#587067;font-size:14px;line-height:1.7;margin-bottom:28px;}
.admin-login-form {display:grid;gap:17px;padding:28px;border:1px solid #d7e6df;border-radius:12px;background:#fff;box-shadow:0 12px 35px rgba(12,51,68,.06);}
.admin-login-form label {font-size:13px;font-weight:700;color:#45586c;}
.admin-login-form input {display:block;width:100%;margin-top:7px;padding:12px;border:1px solid #c9d9d1;border-radius:5px;font:14px "Poppins";outline:none;}
.admin-login-form input:focus {border-color:#07996e;box-shadow:0 0 0 3px rgba(7,153,110,.1);}
.admin-header-actions {display:flex;align-items:center;gap:20px;}
.admin-header-actions form {margin:0;}
.admin-header-actions button {border:0;background:transparent;color:#31567d;cursor:pointer;font:600 12px "Poppins";}
.admin-header-actions button:hover {color:#087b5c;}
.admin-header-actions > span {font-size:12px;color:#718378;}
.admin-tools {margin-top:28px;padding:24px;border:1px solid #d7e6df;border-radius:10px;background:#fff;}
.admin-tools h2 {font-size:19px;margin:0 0 8px;}.admin-tools h2 small {font-size:11px;color:#087b5c;font-weight:500;margin-left:8px;}.admin-tools > p {font-size:13px;color:#587067;line-height:1.6;}
.admin-user-form {display:grid;grid-template-columns:1fr 1fr auto;gap:10px;margin-top:18px;}.admin-user-form input {min-width:0;padding:11px;border:1px solid #c9d9d1;border-radius:4px;font:13px "Poppins";}.admin-user-form small {grid-column:1 / -1;color:#087b5c;font-size:11px;}.admin-user-list {display:grid;gap:8px;margin-top:20px;padding-top:16px;border-top:1px solid #edf1ee;}.admin-user-list div {display:flex;justify-content:space-between;gap:16px;align-items:center;font-size:13px;color:#31567d;}.admin-user-list div > span {display:grid;gap:3px;}.admin-user-list em {font-style:normal;color:#087b5c;font-size:11px;}.admin-user-actions {display:flex;gap:7px;align-items:center;flex-wrap:wrap;}.admin-user-actions button {border:1px solid #c9d9d1;background:#fff;border-radius:4px;padding:7px 9px;color:#087b5c;font:600 11px Poppins;cursor:pointer;}.admin-user-actions small {color:#b42318;font-size:10px;}.admin-review-actions input {flex-basis:100%;border:1px solid #c9d9d1;border-radius:4px;padding:8px;font:11px Poppins;min-width:180px;}
.settings-page {max-width:760px;padding:58px 20px 100px;margin:auto;}
.admin-payout-actions {display:inline-flex;gap:5px;}.admin-payout-actions button {border:0;background:none;color:#087b5c;cursor:pointer;font:600 11px "Poppins";padding:0;}.admin-payout-actions button:last-child {color:#a34638;}
.back-link {color:#07865f;text-decoration:none;font-size:11px;font-weight:700;}
.settings-page h1 {font-size:clamp(32px,4vw,48px);letter-spacing:-.05em;margin:30px 0 12px;}
.settings-lead {color:#587067;font-size:14px;max-width:540px;line-height:1.75;margin-bottom:34px;}
.settings-note {font-size:11px;color:#718378;line-height:1.6;margin:-10px 0 20px;}
.settings-card {border:1px solid #d7e6df;border-radius:14px;padding:28px;background:#fff;margin-top:18px;}
.settings-card h2 {font-size:18px;letter-spacing:-.04em;margin:0 0 22px;}
.settings-intro {display:flex;gap:14px;padding:16px;background:#f1faf5;border-radius:10px;margin-bottom:22px;}
.settings-icon {display:grid;place-items:center;flex:none;width:35px;height:35px;border-radius:9px;background:#d9f4e5;color:#07865f;font-weight:700;}
.settings-intro strong {font-size:12px;}.settings-intro p {font-size:11px;color:#698077;margin:2px 0 0;line-height:1.5;}
.settings-form {display:grid;gap:16px;}.settings-form label {font-size:11px;font-weight:700;color:#45586c;}.settings-form input {display:block;width:100%;margin-top:7px;padding:12px;border:1px solid #c9d9d1;border-radius:4px;background:#fcfefd;font:12px Poppins;outline:none;}.settings-form input:focus {border-color:#07996e;box-shadow:0 0 0 3px rgba(7,153,110,.1);}.form-status {font-size:11px;color:#087b5c;background:#edf8f3;padding:10px;margin:0;}.profile-grid {display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}.profile-grid span {padding:14px;border:1px solid #e4ede8;border-radius:8px;}.profile-grid small,.profile-grid strong {display:block;}.profile-grid small {font-size:9px;color:#819089;margin-bottom:5px;}.profile-grid strong {font-size:12px;overflow-wrap:anywhere;}
.settings-form input:disabled {background:#edf2ef;color:#819089;cursor:not-allowed;}
.settings-cancel {border:0;background:transparent;color:#6b7d73;font:600 11px Poppins;cursor:pointer;}
@media (max-width: 760px) {
  .dashboard-shell {display:block;}
  .dashboard-sidebar {display:block;padding:18px 20px;border-right:0;border-bottom:1px solid #dfeae4;}
  .sidebar-label,.sidebar-bottom {display:none;}
  .sidebar-nav {display:flex;overflow-x:auto;margin-top:18px;gap:4px;}
  .sidebar-nav a {white-space:nowrap;padding:9px 10px;}
  .dashboard-main {padding:0 20px 36px;}
  .dashboard-main .dashboard-footer {display:block;line-height:1.7;}
  .dashboard-main .dashboard-footer a {display:block;margin-top:6px;}
  .app-header {
    padding: 0 20px;
  }
  .app-header nav {
    display: none;
  }
  .auth-layout {
    display: block;
    padding: 55px 20px;
  }
  .auth-card {
    margin-top: 50px;
  }
  .dashboard {
    padding: 55px 20px;
  }
  .dash-head {
    display: block;
  }
  .dash-actions {margin-top:20px;justify-content:space-between;}
  .dash-head > a {
    display: block;
    margin-top: 20px;
  }
  .referral-identity {
    display: block;
  }
  .referral-identity .solid {
    margin-top: 20px;
  }
  .dash-metrics {
    grid-template-columns: 1fr 1fr;
  }
  .dash-metrics > div {
    border-right: 1px solid #d7e6df;
  }
  .dash-panels {
    display: block;
  }
  .dashboard-tabs {gap:14px;overflow-x:auto;white-space:nowrap;}
  .dashboard-tabs span {margin-left:0;}
  .dash-panels > div {
    margin-top: 15px;
  }
  .login-page {
    margin: 55px 20px;
  }
  .profile-grid {grid-template-columns:1fr;}
  .settings-page {padding-top:38px;}
}

.admin-panel {
  display: block;
}
.admin-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d7e6df;
  padding-bottom: 17px;
}
.admin-tools h2 {
  margin: 0;
  font-size: 17px;
}
.admin-tools h2 small {
  font-size: 10px;
  color: #819089;
  font-weight: 400;
  margin-left: 8px;
}
.admin-tools input {
  border: 1px solid #d7e6df;
  border-radius: 4px;
  padding: 10px 12px;
  font: 11px "Poppins";
  min-width: 230px;
}
.admin-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 18px 0;
  border-bottom: 1px solid #d7e6df;
  align-items: center;
  font-size: 11px;
}
.admin-row strong,
.admin-row small {
  display: block;
}
.admin-row small {
  color: #819089;
  margin-top: 3px;
}
.admin-head {
  color: #819089;
  font:
    9px ui-monospace,
    monospace;
  text-transform: uppercase;
}
.admin-status {
  color: #07996e;
  font:
    10px ui-monospace,
    monospace;
}
@media (max-width: 760px) {
  .admin-tools {
    display: block;
  }
  .admin-tools input {
    margin-top: 18px;
    width: 100%;
  }
  .admin-row {
    grid-template-columns: 2fr 1fr 1fr;
  }
  .admin-row span:nth-child(4) {
    display: none;
  }
}

/* Shared refinements across marketing and affiliate pages. */
body {
  line-height: 1.6;
}
.hero {
  min-height: 620px;
  gap: 48px;
}
.hero h1 {
  font-size: clamp(32px, 3.5vw, 48px);
  letter-spacing: -0.045em;
  line-height: 1.18;
  max-width: 580px;
}
.auth-copy h1,
.dashboard h1,
.login-page h1 {
  font-size: clamp(30px, 3.4vw, 44px);
  letter-spacing: -0.04em;
  line-height: 1.2;
}
.section-title h2,
.engagement > h2,
.products > h2,
.affiliate h2 {
  font-size: clamp(26px, 2.6vw, 34px);
  letter-spacing: -0.035em;
}
.auth-layout {
  width: min(1120px, calc(100% - 40px));
  gap: 64px;
}
input,
select,
button {
  font: inherit;
}
.referral-identity strong {
  color: #c5f4df;
  font-size: 20px;
  overflow-wrap: anywhere;
}
.referral-identity p {
  overflow-wrap: anywhere;
}
.referral-code-help {font-size:12px;color:#587067;margin:8px 0 4px;}
.referral-actions-stack {display:grid;gap:10px;min-width:180px;}
.referral-credentials {display:grid;gap:0;background:#083f43;border-radius:10px;padding:14px 18px;margin-bottom:28px;color:#fff;}
.credential-row {display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px solid rgba(198,240,220,.18);}
.credential-row:last-of-type {border-bottom:0;}
.credential-copy {min-width:0;}
.credential-copy small {display:block;margin-bottom:6px;color:#9edbc5;font:700 11px ui-monospace,monospace;letter-spacing:.12em;}
.credential-copy strong {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;font-size:16px;font-weight:600;}
.credential-actions {display:flex;align-items:center;gap:8px;flex:none;}
.credential-eye,.credential-copy-button {height:34px;border:1px solid rgba(198,240,220,.35);border-radius:4px;background:transparent;color:#d7f5e5;cursor:pointer;font:600 12px "Poppins";}
.credential-eye {width:36px;font-size:18px;line-height:1;}
.credential-eye:hover,.credential-copy-button:hover {background:rgba(215,245,229,.12);}
.credential-copy-button {min-width:68px;padding:0 12px;}
.credential-note {margin:12px 0 0;color:#b9d9cc;font-size:13px;line-height:1.5;}
.affiliate {
  display: grid;
  grid-template-columns: 2fr 1fr;
  background: #083d43;
  margin: 32px auto 72px;
  max-width: 1280px;
  padding: 40px;
  border-radius: 16px;
}
.affiliate > div {
  display: block;
  padding: 0;
  border-radius: 0;
}
.affiliate-side {
  width: auto;
  padding: 20px !important;
}
.product {
  display: block;
}
.legal-page {
  width: min(800px, calc(100% - 40px));
  margin: 60px auto;
}
.legal-page h1 {
  font-size: 36px;
  letter-spacing: -0.04em;
}
.legal-page h2 {
  font-size: 20px;
  margin-top: 32px;
}
.legal-page p {
  color: var(--blue);
}
.legal-page a {
  color: var(--green);
}
.legal-page .eyebrow {
  margin-top: 32px;
}
:focus-visible {
  outline: 3px solid #099b70;
  outline-offset: 4px;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.notice {
  background: #edf8f3;
  color: #235341;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
}
.faq {
  max-width: 1180px;
  margin: 60px auto;
  padding: 20px;
}
.faq details {
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
}
.faq summary {
  cursor: pointer;
  font-weight: 600;
}
.mobile-menu {
  display: none;
}
@media (max-width: 800px) {
  .header nav {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin: 0;
    font-size: 12px;
  }
  .header {
    height: auto;
    min-height: 72px;
    flex-wrap: wrap;
    padding: 12px 20px;
    gap: 12px;
  }
  .header nav a {
    font-size: 12px;
  }
  .app-header {
    height: auto;
    min-height: 66px;
    gap: 12px;
    flex-wrap: wrap;
    padding: 12px 20px;
  }
  .app-header nav {
    display: flex;
    margin: 0;
  }
  .hero {
    padding: 48px 20px;
  }
  .hero h1 {
    font-size: 34px;
  }
  .auth-layout {
    padding: 40px 0;
  }
  .affiliate {
    display: block;
    margin: 20px;
    padding: 28px;
  }
  .snapshot {
    margin-top: 32px;
  }
  footer a {
    font-size: 12px;
  }
  .referral-identity strong {
    font-size: 16px;
  }
  .admin-row {
    overflow-wrap: anywhere;
    gap: 12px;
  }
}

/* Navigation and layout refinement: retain the approved type scale. */
.header,.app-header {
 position:sticky;
 top:0;
 z-index:50;
 background:rgba(255,255,255,.94);
 backdrop-filter:blur(18px);
 box-shadow:0 1px 0 rgba(7,23,47,.04);
}
.logo {white-space:nowrap;letter-spacing:-.025em;}
.header nav {align-items:center;gap:24px;}
.header nav a,.app-header nav a {padding:8px 0;transition:color .18s ease;}
.header nav a:hover,.app-header nav a:hover {color:var(--green);}
section[id] {scroll-margin-top:90px;}
.hero {background-image:none;background:linear-gradient(125deg,#f5fbf8 0%,#fff 75%);}
.hero-list {margin-bottom:0;}
.snapshot {box-shadow:0 18px 45px rgba(8,30,47,.14);border-radius:20px;}
.snapshot-note {margin-bottom:0;}
.standards {background:#fff;}
.cards {padding-bottom:48px;}
.cards article {box-shadow:none;border-color:#e0e9e4;}
.solution,.products {padding-top:64px;padding-bottom:64px;}
.engagement {padding-top:64px;padding-bottom:64px;}
.solution-grid article {background:#fbfdfc;min-height:210px;}
.solution-grid h3 {font-size:19px;}
.solution-grid p {font-size:14px;}
.solution-grid span {padding-top:4px;font-size:13px;}
.product-grid {grid-template-columns:repeat(6,minmax(0,1fr));gap:20px;}
.product {grid-column:span 2;min-height:260px;transition:border-color .18s,box-shadow .18s;}
.product.upcoming-product {grid-column:span 3;min-height:195px;background:#fafcfb;box-shadow:none;}
.upcoming-product h3 {margin-top:16px;}
.upcoming-product p {max-width:460px;margin-bottom:28px;}
.affiliate {margin-top:8px;margin-bottom:48px;}
.auth-copy h1,.login-page h1,.dashboard h1 {font-size:clamp(38px,4vw,58px);}
.auth-copy h1 {font-size:clamp(34px,3.4vw,48px);}
.auth-copy > p:not(.eyebrow) {font-size:18px;line-height:1.75;}
.auth-points {font-size:15px;line-height:1.55;}
.auth-points b {font-size:13px;}
.auth-card .form-kicker {font-size:13px;}
.auth-card h2 {font-size:29px;}
.auth-card .form-help {font-size:15px;line-height:1.65;}
.auth-card label {font-size:14px;}
.auth-card input,.auth-card select {font-size:15px;}
.auth-card .solid {font-size:15px;}
.auth-card .switch {font-size:14px;}
.auth-card .error {font-size:14px;}
.auth-card .password-hint {font-size:12px;}
.password-requirements {display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;margin:7px 0 0;padding:0;list-style:none;color:#819089;font-size:12px;line-height:1.5;font-weight:400;}
.password-requirements li {transition:color .15s ease;}
.password-requirements li.valid {color:#087b5c;}
.password-requirements li span {display:inline-block;width:15px;color:#a6b2ab;}
.password-requirements li.valid span {color:#07996e;font-weight:700;}
.affiliate-rate strong {font-size:32px;}
.affiliate-rate span {font-size:13px;}
.faq {margin-top:32px;margin-bottom:48px;}
footer {align-items:start;row-gap:24px;background:#fafcfb;}
footer div {flex-wrap:wrap;}
.auth-layout {align-items:start;min-height:calc(100vh - 66px);padding-top:56px;padding-bottom:64px;}
.auth-copy {padding:32px 0;}
.auth-copy h1 {max-width:500px;}
.auth-copy > p:not(.eyebrow) {max-width:440px;}
.affiliate-rate {display:flex;align-items:center;gap:16px;margin:28px 0 4px;padding:16px 18px;border:1px solid #cfe6d9;border-radius:12px;background:#f3fbf6;max-width:440px;color:#31567d;}
.affiliate-rate strong {font-size:30px;line-height:1;color:#07865f;letter-spacing:-.06em;}
.affiliate-rate span {font-size:11px;line-height:1.5;}
.auth-points {margin-top:32px;padding:24px 0;border-top:1px solid var(--line);gap:0;}
.auth-points span {display:flex;align-items:center;padding:14px 0;border-bottom:1px solid #e7eee9;}
.auth-points b {display:grid;place-items:center;flex-shrink:0;width:30px;height:30px;background:#e9f6ef;border-radius:50%;margin-right:14px;}
.auth-card {border-radius:16px;box-shadow:0 12px 35px rgba(12,51,68,.055);padding:32px;}
.auth-card .form-help {line-height:1.7;}
.auth-card input {background:#fcfefd;transition:border-color .18s,box-shadow .18s;}
.auth-card input:focus {box-shadow:0 0 0 3px rgba(7,153,110,.1);}
.password-hint {display:block;margin-top:6px;color:#819089;font-size:10px;font-weight:400;}
.auth-card input[type=checkbox] {accent-color:var(--green);}
.auth-card .check {line-height:1.7;gap:10px;}
.auth-card .switch {margin-top:20px;padding-top:18px;border-top:1px solid var(--line);margin-bottom:0;}
.auth-card a {color:#087b5c;text-underline-offset:3px;}
.referral-row {display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid #e6eee9;font-size:11px;color:#6b7d73;}
.referral-row strong,.referral-row small {display:block;}
.referral-row strong {font-size:12px;color:#233d36;font-weight:600;}
.referral-row small {color:#8a9990;margin-top:3px;}
.status-pill {padding:5px 8px;border-radius:999px;background:#eef4f0;color:#65776d;font-size:9px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}
.status-pill.converted {background:#dff6ea;color:#087b5c;}
.payout-button {width:100%;}
.payout-history {border-top:1px solid #edf1ee;padding-top:10px;margin-top:12px;}
.auth-card .solid {background:var(--green);transition:background .18s;}
.auth-card .solid:hover:not(:disabled) {background:#087b5c;}
.channel-field {position:relative;min-width:0;}
.field-label {display:block;font-size:12px;font-weight:700;color:#45586c;}
.channel-trigger {display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:13px 14px;margin-top:7px;min-height:48px;border:1px solid #c9d9d1;border-radius:7px;background:#fcfefd;color:var(--navy);font:500 14px 'Poppins',sans-serif;cursor:pointer;transition:border-color .18s,box-shadow .18s,background .18s;}
.channel-trigger:hover {border-color:#6eb69b;}
.channel-trigger[aria-expanded=true] {border-color:var(--green);box-shadow:0 0 0 3px rgba(7,153,110,.1);}
.channel-trigger[aria-expanded=true] svg {transform:rotate(180deg);}
.channel-options {position:absolute;top:100%;left:0;right:0;z-index:10;list-style:none;margin:6px 0 0;padding:6px;border:1px solid #c9dfd3;border-radius:8px;background:white;box-shadow:0 12px 30px rgba(7,23,47,.12);max-height:250px;overflow-y:auto;}
.channel-options li {display:flex;justify-content:space-between;gap:12px;padding:12px 11px;border-radius:6px;cursor:pointer;color:var(--navy);font:500 14px 'Poppins',sans-serif;line-height:1.4;}
.channel-options li[data-active=true],.channel-options li:hover {background:#e5f5ed;color:#076c50;}
.channel-options li[aria-selected=true] {color:#087b5c;font-weight:600;}
.toast-viewport {position:fixed;right:22px;bottom:22px;z-index:1000;display:grid;gap:10px;width:min(390px,calc(100vw - 32px));pointer-events:none;}
.toast {display:flex;align-items:center;gap:11px;padding:13px 14px;border:1px solid #cfe2d9;border-radius:12px;background:#fff;color:#18352c;box-shadow:0 18px 45px rgba(7,23,47,.18);font:500 13px/1.45 'Poppins',sans-serif;pointer-events:auto;animation:toast-in .2s ease-out;}
.toast-mark {display:grid;place-items:center;flex:0 0 22px;width:22px;height:22px;border-radius:50%;background:#e1f6eb;color:#087b5c;font-weight:700;}
.toast-error {border-color:#f0c9c1;color:#783d35;}.toast-error .toast-mark {background:#ffe6e0;color:#b34e3f;}.toast-success {border-color:#bfe3d0;}.toast-info .toast-mark {background:#e6eff8;color:#2d628c;}
.toast button {margin-left:auto;border:0;background:transparent;color:#789087;font-size:20px;line-height:1;cursor:pointer;padding:2px 4px;}
@keyframes toast-in {from {opacity:0;transform:translateY(8px)}to {opacity:1;transform:translateY(0)}}
@media(max-width:1000px){
 .header {gap:16px;}
 .header nav {gap:16px;}
 .header .top-button {display:none;}
 .auth-layout {gap:32px;grid-template-columns:minmax(0,1fr) minmax(0,430px);}
}
@media(max-width:800px){
 .header,.app-header {backdrop-filter:blur(18px);}
 .header nav {gap:14px;width:100%;justify-content:flex-start;}
 .header nav a {padding:2px 0;}
 section[id] {scroll-margin-top:130px;}
 .hero {padding-top:36px;}
 .solution,.products,.engagement {padding-top:44px;padding-bottom:44px;}
 .cards {padding-bottom:20px;}
 .product-grid {display:grid;grid-template-columns:1fr;}
 .product,.product.upcoming-product {grid-column:auto;margin:0;}
 .product {min-height:235px;}
 .auth-layout {display:block;padding-top:28px;padding-bottom:44px;}
 .auth-copy {padding:0;}
 .auth-points {padding:8px 0;margin-top:20px;}
 .auth-card {margin-top:24px;padding:24px;}
 .auth-copy h1 {max-width:100%;}
}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto;}*{transition:none!important;}}
/* Product detail readability and pricing. The established heading scale is retained. */
.product p {font-size:14px;line-height:1.75;}
.product-badge {font-size:12px;}
.product>b,.product .coming {font-size:13px;}
.product.upcoming-product {min-height:215px;}
.upcoming-product p {max-width:100%;margin-bottom:40px;}
.product:not(.upcoming-product) p {margin-bottom:44px;}
.product {min-height:290px;}
.pricing-section {padding:64px max(40px,calc((100% - 1400px)/2));background:#f5f9f7;border-block:1px solid #e1ebe5;}
.pricing-heading {display:flex;justify-content:space-between;align-items:flex-end;gap:32px;margin-bottom:32px;}
.pricing-heading h2 {font-size:clamp(26px,2.6vw,34px);line-height:1.2;letter-spacing:-.035em;margin-bottom:0;}
.pricing-heading>p {max-width:340px;margin:0;font-size:14px;color:var(--blue);line-height:1.7;}
.pricing-grid {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;}
.pricing-card {background:white;border:1px solid #d6e4dc;border-radius:16px;padding:28px;display:flex;flex-direction:column;}
.pricing-card h3 {font-size:17px;letter-spacing:-.03em;margin-bottom:6px;}
.pricing-category {font-size:13px;color:var(--blue);margin-bottom:28px;}
.pricing-start {font-size:12px;color:#536a5e;margin-bottom:4px;}
.pricing-amount {display:flex;align-items:baseline;gap:6px;margin-bottom:24px;}
.pricing-amount strong {font-size:32px;letter-spacing:-.045em;color:var(--navy);}
.pricing-amount span {font-size:13px;color:#536a5e;}
.pricing-details {margin:0 0 24px;padding:0;list-style:none;flex:1;}
.pricing-details li {padding:12px 0;border-top:1px solid #e5ede8;font-size:13px;color:var(--blue);}
.pricing-details li>div {display:flex;align-items:baseline;justify-content:space-between;gap:12px;}
.pricing-details li>div>span {white-space:nowrap;color:#385548;font-size:12px;}
.pricing-details li>p {margin:4px 0 0;font-size:12px;}
.billing-control {display:inline-flex;padding:4px;margin-bottom:28px;border:1px solid #d3e1d8;background:#eaf1ed;border-radius:9px;gap:4px;}
.billing-control button {border:0;padding:10px 16px;background:transparent;color:#526c5c;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;border-radius:6px;}
.billing-control button[aria-pressed=true] {background:#fff;color:#083e2b;box-shadow:0 1px 4px #163d1712;}
.billing-control button:hover {color:#087b5c;}
.billing-control span {display:inline-block;margin-left:6px;color:#087b5c;font-size:11px;}
.pricing-details strong {font-weight:600;color:var(--navy);}
.pricing-card>a {display:flex;justify-content:space-between;gap:12px;text-decoration:none;padding:12px 16px;border:1px solid #c9dfd3;border-radius:6px;font-size:13px;font-weight:600;color:#087b5c;background:#f5fbf8;}
.pricing-card>a:hover {background:#e6f5ed;border-color:#07996e;}
.pricing-note {margin:22px 0 0;font-size:12px;color:#536a5e;}
.referral-banner {max-width:1280px;width:calc(100% - 80px);margin:72px auto 48px;border-radius:22px;display:grid;grid-template-columns:1.3fr 1fr;gap:64px;padding:52px;background:radial-gradient(ellipse at top right,rgba(41,160,118,.2),transparent 65%),#092e2d;color:white;border:1px solid #1d5145;}
.referral-copy .eyebrow {color:#9edbc5;margin-bottom:24px;}
.referral-copy h2 {font-size:clamp(26px,2.6vw,34px);letter-spacing:-.035em;line-height:1.25;margin:0 0 20px;}
.referral-copy h2 span {color:#a8e8cb;}
.referral-copy>p:not(.eyebrow) {color:#d1e3db;max-width:500px;font-size:16px;line-height:1.75;margin-bottom:28px;}
.referral-actions {display:flex;align-items:center;gap:20px;flex-wrap:wrap;}
.referral-actions>.button {display:inline-flex;gap:22px;align-items:center;padding:13px 18px;background:#d7f5e5;color:#0d3d2d;border:1px solid transparent;}
.referral-actions>.button:hover {background:white;}
.referral-login {color:#d1e3db;font-size:12px;text-decoration:none;text-underline-offset:4px;}
.referral-login:hover {text-decoration:underline;color:white;}
.referral-steps {list-style:none;margin:0;padding:0;align-self:center;}
.referral-steps li {display:flex;gap:18px;padding:22px 0;border-bottom:1px solid #346058;}
.referral-steps li:last-child {border:0;}
.referral-step-number {flex:none;display:grid;place-items:center;align-self:flex-start;width:36px;height:36px;border-radius:50%;border:1px solid #427e66;background:#194536;color:#b8e8d1;font-size:12px;}
.referral-steps h3 {font-size:17px;margin:2px 0 6px;font-weight:600;}
.referral-steps p {font-size:14px;line-height:1.65;color:#bfd6ca;margin:0;}
.admin-shell {display:grid;grid-template-columns:240px minmax(0,1fr);min-height:calc(100vh - 66px);background:#f6faf8;}
.admin-sidebar {display:flex;flex-direction:column;padding:32px 18px;background:#fff;border-right:1px solid #dce9e2;}.admin-brand-label {padding:0 12px;margin:0 0 24px;color:#91a299;font:700 10px ui-monospace,monospace;letter-spacing:.12em;}.admin-sidebar nav {display:grid;gap:4px;}.admin-sidebar nav a {display:flex;align-items:center;gap:12px;padding:12px;border-radius:7px;color:#587067;text-decoration:none;font-size:13px;font-weight:600;}.admin-sidebar nav a span {width:18px;color:#7d998c;text-align:center;font-size:15px;}.admin-sidebar nav a b {margin-left:auto;min-width:20px;padding:2px 6px;border-radius:999px;background:#e4f5eb;color:#087b5c;text-align:center;font-size:11px;}.admin-sidebar nav a.active,.admin-sidebar nav a:hover {background:#eaf7f0;color:#087b5c;}.admin-sidebar-foot {margin-top:auto;padding:16px 12px;border-top:1px solid #e5ede8;color:#91a299;font-size:11px;line-height:1.7;}
.admin-content {min-width:0;max-width:1440px;width:100%;padding:52px 56px 80px;}.admin-page-heading {margin-bottom:32px;}.admin-page-heading h1 {font-size:clamp(32px,3.4vw,48px);line-height:1.12;letter-spacing:-.05em;margin:14px 0 10px;}.admin-page-heading p:not(.eyebrow) {color:#587067;font-size:14px;line-height:1.6;margin:0;}.admin-summary-grid {display:grid;grid-template-columns:repeat(4,1fr);margin-bottom:40px;border:1px solid #d7e6df;background:#fff;}.admin-summary-grid div {padding:22px;border-right:1px solid #d7e6df;}.admin-summary-grid div:last-child {border:0;}.admin-summary-grid small,.admin-summary-grid span {display:block;color:#819089;font-size:12px;}.admin-summary-grid strong {display:block;margin:9px 0;font-size:28px;letter-spacing:-.05em;}.admin-section-title {font-size:20px;margin:0 0 16px;}.admin-table-card,.admin-list-card {background:#fff;border:1px solid #d7e6df;border-radius:10px;overflow:auto;}.admin-table-head {display:grid;grid-template-columns:minmax(220px,2fr) .8fr 1fr .8fr 1fr auto;gap:16px;min-width:900px;padding:14px 20px;color:#819089;font:700 10px ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #e6eee9;}.admin-row {grid-template-columns:minmax(220px,2fr) .8fr 1fr .8fr 1fr auto;min-width:900px;padding:18px 20px;border-bottom:1px solid #e6eee9;align-items:center;font-size:12px;}.admin-row:last-child {border:0;}.admin-row strong,.admin-row small {display:block;}.admin-row small {margin-top:4px;color:#819089;font-size:11px;}.admin-status-badge {font-size:11px;font-weight:600;color:#587067;text-transform:capitalize;}.admin-status-badge.active {color:#087b5c;}.admin-status-badge.pending {color:#9a6b16;}.admin-status-badge.suspended,.admin-status-badge.rejected {color:#a34638;}.admin-affiliate-details {grid-column:1 / -1;margin-top:8px;border-top:1px solid #edf1ee;padding-top:10px;}.admin-affiliate-details summary {cursor:pointer;color:#087b5c;font-size:12px;font-weight:600;}.admin-detail-grid {display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:14px;padding:16px;background:#f7fbf8;border-radius:7px;min-width:900px;}.admin-detail-grid div {display:grid;align-content:start;gap:5px;min-width:0;}.admin-detail-grid strong {font-size:11px;color:#31567d;margin-bottom:3px;}.admin-detail-grid span {font-size:11px;color:#718378;overflow-wrap:anywhere;}.admin-list-heading,.admin-list-row {display:grid;grid-template-columns:1.2fr 1fr 1.5fr .8fr .8fr .8fr;gap:16px;align-items:center;min-width:900px;}.admin-list-heading {padding:14px 18px;color:#819089;font:700 10px ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #e6eee9;}.admin-list-row {padding:16px 18px;border-bottom:1px solid #e6eee9;color:#587067;font-size:12px;}.admin-list-row:last-child {border:0;}.admin-list-row strong,.admin-list-row small {display:block;}.admin-list-row small {margin-top:3px;color:#819089;font-size:11px;}.admin-empty {padding:24px;background:#fff;border:1px solid #d7e6df;border-radius:10px;color:#587067;}
.admin-tools {display:block;}.admin-login-page h1 {font-size:clamp(32px,3.4vw,44px);}.admin-payout-actions {display:inline-flex;gap:5px;}.admin-payout-actions button {border:0;background:none;color:#087b5c;cursor:pointer;font:600 11px "Poppins";padding:0;}.admin-payout-actions button:last-child {color:#a34638;}
.system-settings {max-width:880px;}.system-settings > p {margin:0 0 18px;color:#587067;font-size:13px;line-height:1.6;}.system-setting-row {display:flex;align-items:center;justify-content:space-between;gap:24px;padding:17px 0;border-top:1px solid #e6eee9;}.system-setting-row span {display:grid;gap:4px;}.system-setting-row strong {font-size:13px;color:#31567d;}.system-setting-row small {font-size:11px;color:#819089;}.system-status {padding:5px 9px;border-radius:999px;font-size:11px!important;font-weight:600!important;white-space:nowrap;}.system-status.configured {background:#e5f6ed;color:#087b5c!important;}.system-status.missing {background:#fff3e2;color:#9a6b16!important;}.system-value {font-weight:500!important;color:#587067!important;}
.admin-row {grid-template-columns:minmax(220px,2fr) .8fr .9fr 1fr auto;gap:16px;font-size:12px;}
.admin-row small {font-size:11px;}
.admin-login-page h1 {font-size:clamp(32px,3.4vw,44px);}
@media(max-width:800px){
 .pricing-section {padding:44px 20px;}
 .pricing-heading {display:block;}
 .pricing-heading>p {margin-top:18px;}
 .pricing-grid {grid-template-columns:1fr;}
 .pricing-card {padding:24px;}
 .referral-banner {width:calc(100% - 40px);grid-template-columns:1fr;gap:24px;padding:28px;margin:44px auto;}
 .referral-copy>p:not(.eyebrow) {font-size:16px;}
 .product,.product.upcoming-product {min-height:0;padding-bottom:58px;}
 .product p,.upcoming-product p {margin-bottom:12px;}
 .referral-steps li {padding:18px 0;}
 .admin-row {grid-template-columns:1fr;gap:8px;}
 .admin-user-form {grid-template-columns:1fr;}
 .admin-shell {display:block;}.admin-sidebar {padding:18px 20px;border-right:0;border-bottom:1px solid #dce9e2;}.admin-sidebar-foot {display:none;}.admin-sidebar nav {display:flex;overflow:auto;}.admin-sidebar nav a {white-space:nowrap;}.admin-content {padding:36px 20px 56px;}.admin-summary-grid {grid-template-columns:1fr 1fr;}.admin-summary-grid div:nth-child(2) {border-right:0;}.admin-summary-grid div:nth-child(-n+2) {border-bottom:1px solid #d7e6df;}
}
.skip-link {position:fixed;left:12px;top:8px;z-index:100;color:#fff;background:#07172f;padding:10px 14px;border-radius:5px;transform:translateY(-150%);transition:transform .15s ease;font-size:13px;font-weight:600;}
.skip-link:focus {transform:translateY(0);}
.mobile-menu {display:none;position:relative;margin-left:auto;}
.mobile-menu-button {border:1px solid #c9d9d1;border-radius:6px;background:#fff;color:#07172f;width:44px;height:44px;font:22px/1 Poppins;cursor:pointer;}
.mobile-menu-panel {position:absolute;right:0;top:52px;z-index:60;display:grid;gap:2px;min-width:210px;padding:8px;border:1px solid #d7e6df;border-radius:8px;background:#fff;box-shadow:0 12px 30px rgba(7,23,47,.14);}
.mobile-menu-panel a {padding:11px 12px;color:#07172f;text-decoration:none;font-size:13px;font-weight:600;border-radius:4px;}
.mobile-menu-panel a:hover,.mobile-menu-panel a:focus {background:#eaf7f0;color:#087b5c;}
.form-status.error {background:#fff1ef;color:#a34638;}
.admin-payout-actions small {display:block;color:#a34638;font-size:10px;}
.password-input-wrap {display:block;position:relative;margin-top:7px;}
.password-input-wrap input {margin-top:0!important;padding-right:48px!important;}
.password-toggle {position:absolute;right:5px;top:50%;transform:translateY(-50%);width:36px;height:36px;border:0;border-radius:4px;background:transparent;color:#587067;cursor:pointer;display:grid;place-items:center;}
.password-toggle svg {display:block;}
.password-toggle:hover,.password-toggle:focus-visible {background:#eaf7f0;color:#087b5c;}
.back-to-top {position:fixed;right:22px;bottom:22px;z-index:80;display:grid;place-items:center;width:44px;height:44px;border:1px solid #b8d8ca;border-radius:50%;background:#07996e;color:#fff;box-shadow:0 10px 24px rgba(7,23,47,.2);cursor:pointer;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .18s,visibility .18s,transform .18s,background .18s;}
.back-to-top.is-visible {opacity:1;visibility:visible;transform:translateY(0);}
.back-to-top:hover,.back-to-top:focus-visible {background:#087b5c;}
.site-footer {display:block!important;background:#0d172c;color:#eaf5f1;border-top:0;padding:64px max(24px,calc((100% - 1320px) / 2)) 28px;}
.site-footer a {color:#d8e9e3;text-decoration:none;}
.site-footer a:hover,.site-footer a:focus-visible {color:#74e0b7;}
.site-footer-main {display:grid!important;grid-template-columns:minmax(220px,.8fr) 2fr;align-items:start;justify-content:initial;gap:64px;max-width:1320px;margin:0 auto;padding:0;}
.site-footer-brand {display:block!important;min-width:0;}
.site-footer-brand .footer-wordmark {display:inline-block;color:#74e0b7;font-size:24px;font-weight:700;letter-spacing:-.04em;text-decoration:none;}
.site-footer-brand p {max-width:230px;margin:18px 0 12px;color:#a6b9b5;font-size:13px;line-height:1.7;}
.site-footer-email {font-size:13px;color:#74e0b7!important;overflow-wrap:anywhere;}
.site-footer-columns {display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));align-items:start;justify-content:initial;gap:28px;min-width:0;}
.site-footer-column {display:block!important;min-width:0;}
.site-footer-column h2 {margin:0 0 18px;color:#fff;font-size:13px;font-weight:700;}
.site-footer-column nav {display:grid!important;justify-content:initial;gap:11px;}
.site-footer-column nav a {font-size:13px;line-height:1.45;}
.site-footer-bottom {display:flex;align-items:center;justify-content:space-between;gap:20px;max-width:1320px;margin:58px auto 0;padding-top:22px;border-top:1px solid rgba(190,220,209,.18);color:#829795;font-size:10px;letter-spacing:.01em;}
.site-footer-bottom span {color:#8fc8b2;text-transform:uppercase;letter-spacing:.18em;font-size:10px;}

/* Authenticated affiliate portal: one calm navigation system, no competing
   marketing header or duplicate page tabs. */
.portal-shell {display:grid;grid-template-columns:248px minmax(0,1fr);min-height:100vh;background:#f5f8f6;color:#07172f;}
.portal-sidebar {display:flex;flex-direction:column;padding:34px 22px 24px;border-right:1px solid #dce8e1;background:#fff;}
.portal-brand {padding:0 10px;height:46px;display:flex;align-items:center;pointer-events:none;}
.portal-brand .brand-logo-crop {width:112px;height:42px;flex-basis:112px;}
.portal-brand .brand-logo-image {width:112px;top:-33px;}
.portal-sidebar .sidebar-label {margin:10px 10px 14px;}
.portal-sidebar .sidebar-nav {gap:6px;}
.portal-sidebar .sidebar-nav a {min-height:46px;padding:12px 13px;border-radius:10px;font-size:13px;}
.portal-sidebar .sidebar-nav a span {font-size:14px;}
.portal-content {min-width:0;width:100%;max-width:1500px;padding:48px clamp(24px,5vw,76px) 34px;}
.portal-heading {display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-bottom:30px;border-bottom:1px solid #d9e7df;}
.portal-heading h1 {margin:6px 0 0;font-size:clamp(30px,3.1vw,46px);line-height:1.12;letter-spacing:-.055em;}
.portal-actions {display:flex;align-items:center;gap:12px;flex:none;}
.portal-actions .settings-link {font-size:13px;}
.portal-content .referral-credentials {margin-top:28px;}
.portal-content .dash-metrics {margin-top:28px;gap:12px;grid-template-columns:repeat(5,minmax(0,1fr));}
.portal-content .dash-metrics > div {min-height:128px;padding:20px;background:#fff;border:1px solid #dce8e1;border-radius:12px;box-shadow:0 4px 16px rgba(23,61,47,.035);}
.portal-content .dash-metrics strong {font-size:25px;}
.portal-content .dash-panels {margin-top:28px;gap:18px;}
.portal-content .dash-panels > div {background:#fff;border:1px solid #dce8e1;border-radius:14px;padding:24px;box-shadow:0 4px 16px rgba(23,61,47,.035);}
.portal-content .dash-panels h2 {font-size:18px;letter-spacing:-.025em;}
.portal-content .referral-row {display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:18px;align-items:center;padding:17px 0;border-bottom:1px solid #edf2ef;}
.portal-content .referral-row:last-child {border-bottom:0;}
.portal-content .referral-row strong {font-size:13px;color:#173d2f;}
.portal-content .referral-row small {display:block;margin-top:5px;color:#71857c;font-size:11px;line-height:1.6;}
.portal-content .status-pill {white-space:nowrap;border:1px solid #d8e7df;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:700;text-transform:capitalize;}
.portal-content .status-pill.converted {background:#e7f8ef;border-color:#bfe8d2;color:#087b5c;}
.portal-content .status-pill.registered {background:#fff8e7;border-color:#f1dfaa;color:#96701d;}
.portal-settings-page {width:100%;max-width:840px;margin:28px 0 0;padding:0;}
.portal-settings-page .settings-lead {margin:0 0 20px;color:#667b70;font-size:14px;}
.portal-settings-page .settings-card {margin:14px 0;background:#fff;border:1px solid #dce8e1;border-radius:14px;box-shadow:0 4px 16px rgba(23,61,47,.035);}
.portal-settings-page .settings-card h2 {font-size:17px;}
.portal-content .dashboard-footer {display:flex;justify-content:space-between;gap:20px;margin-top:30px;padding-top:20px;border-top:1px solid #d9e7df;color:#91a097;font-size:11px;}
.portal-content .dashboard-footer a {color:#688077;}
@media(max-width:1050px){.portal-content .dash-metrics{grid-template-columns:repeat(3,minmax(0,1fr));}.portal-content .dash-panels{grid-template-columns:1fr;}}
@media(max-width:760px){.portal-shell{display:block;}.portal-sidebar{display:block;padding:16px 18px;border-right:0;border-bottom:1px solid #dce8e1;}.portal-sidebar .sidebar-label{display:none;}.portal-sidebar .sidebar-nav{display:flex;overflow-x:auto;margin-top:0;padding-bottom:2px;scrollbar-width:none;}.portal-sidebar .sidebar-nav::-webkit-scrollbar{display:none;}.portal-sidebar .sidebar-nav a{flex:0 0 auto;min-height:40px;padding:9px 11px;font-size:12px;}.portal-sidebar .sidebar-bottom{display:none;}.portal-content{padding:28px 18px 24px;}.portal-heading{align-items:flex-start;flex-direction:column;padding-bottom:22px;}.portal-actions{width:100%;justify-content:flex-start;}.portal-content .dash-metrics{grid-template-columns:repeat(2,minmax(0,1fr));}.portal-content .dash-metrics > div{min-height:112px;padding:15px;}.portal-content .dash-metrics strong{font-size:21px;}.portal-content .referral-row{grid-template-columns:1fr;gap:9px;}.portal-content .referral-row > span:last-child{font-weight:700;}.portal-content .dash-panels > div{padding:18px;overflow:hidden;}.portal-content .dashboard-footer{display:grid;line-height:1.6;}}
/* Final shared type and layout scale. Keep all product, affiliate, and admin
   surfaces aligned instead of allowing legacy selectors to compete. */
.header,.app-header {height:72px;min-height:72px;padding-left:max(24px,calc((100% - 1320px) / 2));padding-right:max(24px,calc((100% - 1320px) / 2));}
.header nav a,.app-header nav a {font:600 14px/1.4 "Poppins",sans-serif;}
.header .top-button,.header .button,.app-header button,.app-header>a:not(.logo) {font:600 14px/1.4 "Poppins",sans-serif;}
.logo {font-size:14px;}
.auth-card,.admin-login-form,.admin-tools,.settings-card {font-family:"Poppins",Arial,sans-serif;}
.auth-card h2 {font-size:28px;line-height:1.2;}
.auth-card .form-help,.auth-card label,.auth-card input,.auth-card select,.auth-card .solid {font-size:14px;line-height:1.55;}
.auth-card .switch {font-size:14px;}
.admin-sidebar nav a {font:600 14px/1.45 "Poppins",sans-serif;}
.admin-content {font-family:"Poppins",Arial,sans-serif;}
.admin-page-heading h1 {font-size:42px;line-height:1.15;}
.admin-page-heading p:not(.eyebrow),.admin-tools>p {font-size:14px;line-height:1.6;}
.admin-summary-grid small,.admin-summary-grid span {font-size:13px;}
.admin-summary-grid strong {font-size:30px;}
.admin-section-title,.admin-tools h2 {font-size:22px;line-height:1.3;}
.admin-row,.admin-list-row {font-size:14px;line-height:1.5;}
.admin-row small,.admin-list-row small {font-size:12px;}
.admin-status-badge,.admin-affiliate-details summary {font-size:13px;}
.admin-table-head,.admin-list-heading {font-size:11px;}
.site-footer-column nav a {font-size:14px;line-height:1.5;}
.site-footer-brand p,.site-footer-email {font-size:14px;line-height:1.6;}
@media(max-width:800px){
 .mobile-menu {display:block;}
 .header {position:sticky;flex-wrap:nowrap;align-items:center;gap:12px;}
 .header > nav {display:none;}
 .header .mobile-menu-panel {display:grid;}
 .header .logo {min-width:0;}
 .header .mobile-menu {margin-left:auto;}
 .mobile-menu-button {display:grid;place-items:center;width:46px;height:46px;border:1px solid #a9cbbd;border-radius:8px;background:#fff;color:#07172f;box-shadow:0 2px 8px rgba(7,23,47,.08);}
 .mobile-menu-panel {right:0;top:54px;min-width:230px;padding:10px;box-shadow:0 18px 38px rgba(7,23,47,.2);}
 .mobile-menu-panel a {padding:13px 14px;font-size:14px;}
 .app-header {flex-wrap:nowrap;gap:14px;}
 .app-header > a:not(.logo) {min-width:0;text-align:right;overflow-wrap:anywhere;}
 .app-header nav {display:flex;align-items:center;gap:12px;margin-left:auto;min-width:0;}
 .app-header nav a {white-space:nowrap;}
 .hero {width:100%;min-width:0;padding:44px 20px 56px;}
 .hero h1 {font-size:clamp(34px,10vw,44px);line-height:1.12;}
 .lead {font-size:15px;line-height:1.65;}
 .hero-actions {align-items:stretch;}
 .hero-actions .button {flex:1 1 150px;}
 .admin-list-card,.admin-table-card {overflow-x:auto;-webkit-overflow-scrolling:touch;}
 .admin-list-heading,.admin-list-row,.admin-table-head,.admin-row {min-width:760px;}
 .auth-card input,.auth-card select,.settings-form input,.admin-login-form input {min-height:44px;}
 .password-toggle {width:40px;height:40px;}
 .button,.solid,.top-button {min-height:44px;display:inline-flex;align-items:center;justify-content:center;}
 .site-footer {padding:48px 20px 24px;}
 .site-footer-main {display:block!important;}
 .site-footer-brand {margin-bottom:40px;}
 .site-footer-columns {display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px 20px;}
 .site-footer-column nav {gap:10px;}
 .site-footer-column nav a {font-size:12px;}
 .site-footer-bottom {display:grid;gap:12px;margin-top:42px;line-height:1.6;}
 .header,.app-header {min-height:68px;height:auto;padding:12px 20px;}
 .header nav a,.app-header nav a {font-size:13px;}
 .brand-logo-crop {width:100px;height:40px;flex-basis:100px;}
 .brand-logo-image {width:100px;top:-29px;}
 .admin-page-heading h1 {font-size:34px;}
 .back-to-top {right:16px;bottom:16px;}
}
`;
export default function Theme() {
  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}
