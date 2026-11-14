# YUBBY DUBBY Frontend

Production Next.js storefront for **Yubby Dubby**, integrated with a headless WooCommerce REST API backend, featuring server-rendered dynamic catalog browsing, animated interactive UI components, secure customer accounts, OTP verification, and cart & checkout workflows.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) `16.4.1` (App Router, Webpack compiler)
- **Runtime**: [Node.js](https://nodejs.org/) `>= 20.9.0` (Recommended: Node.js 22 LTS)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Backend API**: Headless WooCommerce REST API (`@woocommerce/woocommerce-rest-api`)
- **Authentication**: JWT token verification (`HMAC-SHA256`) & SMTP OTP verification via Nodemailer

---

## Prerequisites

- **Node.js**: `20.9.0` or higher (Node 22 LTS recommended)
- **npm**: `10.x` or higher

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zuhaibtariqkhan/YUBBYDUBBY.git
cd YUBBYDUBBY/yubby-dubby-frontend
```

### 2. Install dependencies cleanly

```bash
npm ci
```

### 3. Environment Variables Configuration

Create a `.env.local` file in the project root:

```ini
# Application URL
NEXT_PUBLIC_APP_URL="https://yubbydubby.com"

# WooCommerce Headless Backend
WOOCOMMERCE_API_URL="https://shop.yubbydubby.com"
WOOCOMMERCE_CONSUMER_KEY="ck_your_consumer_key"
WOOCOMMERCE_CONSUMER_SECRET="cs_your_consumer_secret"

# JWT Authentication (min 32 characters)
JWT_SECRET="your_secure_random_jwt_secret_key_here"

# SMTP OTP Email Dispatch (Optional in development)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="noreply@yubbydubby.com"
SMTP_PASS="your_smtp_password"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server |
| `npm run build` | Compiles production build using the Webpack engine (`next build --webpack`) |
| `npm run start` | Boots the compiled production server |
| `npm run lint` | Runs ESLint validation across codebase |
| `npx tsc --noEmit` | Runs TypeScript static type checking without emitting files |

---

## Hostinger Deployment Instructions

This project is optimized for deployment on Hostinger's Node.js hosting platform:

1. **Node.js Version**: In Hostinger hPanel under **Node.js Deployment**, select **Node.js 22.x**.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**: Add the production environment variables (`WOOCOMMERCE_API_URL`, `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`, `JWT_SECRET`, etc.) in the Hostinger hPanel environment variables section.
5. **Git Repository**: Connect the repository (`main` branch) and click **Deploy**.

---

## CI/CD Pipeline

Every pull request and push to `main` and `master` automatically triggers the GitHub Actions CI workflow (`.github/workflows/ci.yml`), verifying:
- Clean dependency installation (`npm ci`)
- ESLint code standard compliance (`npm run lint`)
- TypeScript type soundness (`npx tsc --noEmit`)
- Production build compilation (`npm run build`)
