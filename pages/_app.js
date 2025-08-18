import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <SignedIn></SignedIn>
      <Component {...pageProps} />
      <Analytics />
    </ClerkProvider>
  );
}
