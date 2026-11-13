import Link from "next/link";
import { connection } from "next/server";

import { SignInLink } from "./site-chrome";
import { SignOutButton } from "./sign-out-button";
import { authenticate } from "@/lib/supabase/server";

/**
 * Reads the session on the server. Render behind a Suspense boundary so the
 * static shell prerenders and the sign-in state streams in.
 *
 * `connection()` defers this component to request time so that the Supabase
 * auth check (which calls Date.now() internally for token expiry) doesn't
 * conflict with Next.js static prerendering.
 */
export async function AuthSlot() {
  await connection();
  const { user } = await authenticate();

  if (!user) {
    return <SignInLink />;
  }

  return (
    <>
      <Link
        href="/dashboard"
        className="ml-1.5 inline-flex h-9 items-center rounded-full bg-text-primary px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-black"
      >
        Dashboard
      </Link>
      <SignOutButton />
    </>
  );
}