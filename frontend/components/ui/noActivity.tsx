"use client";

import { Monitor } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function DeviceBreakdownZeroState() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col items-center text-center p-8 max-w-sm rounded-lg border border-border bg-card shadow-md h-full"
      >
        <motion.div
          variants={iconVariants}
          className="mb-5 rounded-full bg-primary/20 p-5"
        >
          <Monitor className="h-10 w-10 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-card-foreground mb-3">
          No Device Data Available
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Device usage data will appear here once your links start receiving traffic. Track engagement by device to gain detailed insights.
        </p>
      </motion.div>
    </div>
  );
}
