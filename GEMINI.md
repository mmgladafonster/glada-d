# Project Overview

This is a Next.js web application for a window cleaning company called "Glada Fönster". The application is built with TypeScript, React, and Tailwind CSS. It uses `v0.dev` for automatic synchronization and is deployed on Vercel.

The application features a home page, an about page, a contact page, and a privacy policy page. It also includes a form for requesting a quote, which sends an email using the Resend API.

## Building and Running

To build and run this project locally, you will need to have Node.js and pnpm installed.

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Run the development server:**

    ```bash
    pnpm run dev
    ```

    This will start the development server on `http://localhost:3000`.

3.  **Build for production:**

    ```bash
    pnpm run build
    ```

    This will create a production-ready build in the `.next` directory.

4.  **Run in production mode:**

    ```bash
    pnpm run start
    ```

    This will start the application in production mode.

## Development Conventions

*   **Linting:** The project uses ESLint for linting. You can run the linter with the following command:

    ```bash
    pnpm run lint
    ```

*   **Code Formatting:** The project uses Prettier for code formatting. It is recommended to set up your editor to format on save.

*   **Components:** Components are located in the `components` directory. UI components are located in the `components/ui` directory.

*   **Styling:** The project uses Tailwind CSS for styling. The configuration is located in the `tailwind.config.ts` file.

*   **Email:** The project uses Resend to send emails. The email sending logic is located in `app/actions/send-email.ts` and the Resend configuration is located in `lib/resend.ts`.
