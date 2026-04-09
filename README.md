# Ginashe Digital Academy

Africa's premier institution for cloud computing, artificial intelligence, and digital transformation.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (Auth & Database)
- **Deployment**: Cloudflare Pages
- **Payments**: Paystack
- **Emails**: Resend

## Deployment to Cloudflare Pages

This project is configured for Cloudflare Pages.

1.  **Push to GitHub**:
    *   Create a new repository on your GitHub account.
    *   Push this project's code to that repository.

2.  **Connect to Cloudflare**:
    *   Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
    *   Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
    *   Select your GitHub repository.

3.  **Configure Build Settings**:
    *   **Framework Preset**: `Vite`
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
    *   **Note**: These settings must be configured in the Cloudflare Dashboard during setup, as they are not supported in the `wrangler.toml` for Pages projects.

4.  **Add Environment Variables**:
    *   In the Cloudflare Dashboard, go to **Settings** > **Functions** > **Variables**.
    *   Add the following variables:
        *   `VITE_SUPABASE_URL`: Your Supabase URL.
        *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
        *   `RESEND_API_KEY`: Your Resend API Key.
        *   `PAYSTACK_SECRET_KEY`: Your Paystack Secret Key.

5.  **Deploy**:
    *   Cloudflare will build and deploy your app automatically on every push.

## Local Development
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the project.
