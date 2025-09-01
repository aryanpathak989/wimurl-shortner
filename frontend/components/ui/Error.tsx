"use client";

import Link from "next/link";
import { ArrowLeft,Frown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } }
};

const iconVariants = {
  hidden: { opacity: 0, rotate: -90 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    transition: { duration: 0.5 }
  }
};

export default function NotFound() {
  return (
    <div className="min-h-screen  flex items-center">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container flex flex-col items-center justify-center px-4 py-16 text-center"
      >
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="mx-auto max-w-md rounded-lg border border-border bg-card p-8 shadow-sm"
        >
          <div className="mb-6 flex justify-center">
            <motion.div variants={iconVariants} className="rounded-full bg-primary/10 p-4">
              <Frown className="h-12 w-12 text-primary" />
            </motion.div>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-card-foreground">Oops</h1>
          <p className="mb-8 text-muted-foreground">
            Something went wrong with your request. Please wait or try agin later
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
