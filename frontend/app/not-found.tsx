"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <h1 className="text-7xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <p className="text-gray-600 mb-8 leading-relaxed">
          It might have been moved, deleted, or you may have typed the URL incorrectly.
          Let’s get you back on track!
        </p>

        <Link href="/" passHref legacyBehavior>
          <Button
            className="px-8 py-3 text-base font-semibold"
            type="button"
          >
            Go to Homepage
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
