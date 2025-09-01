"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear",
    },
  },
};

export default function LoadingScreen() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col items-center space-y-4 text-center"
      >
        <motion.div
          variants={spinnerVariants}
          animate="animate"
          className="p-4 rounded-full bg-primary/10"
        >
          <Loader2 className="h-10 w-10 text-primary" />
        </motion.div>
        <h2 className="text-xl font-semibold text-card-foreground">Loading...</h2>
        <p className="text-muted-foreground">Hang tight! We&apos;re getting things ready for you.</p>
      </motion.div>
    </div>
  );
}
