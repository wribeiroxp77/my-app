import { motion, useSpring, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, ReactNode } from "react";

/**
 * Modern SaaS animation tokens (Notion, Linear, Stripe-inspired)
 * - Micro: 100-120ms for hover/tap
 * - Standard: 200-220ms for transitions
 * - Relaxed: 350-400ms for progress/numbers
 */
const duration = {
  micro: 0.12,
  standard: 0.22,
  relaxed: 0.38,
} as const;

/** Ease-out-expo: snappy finish, no overshoot (Linear, Stripe) */
const easeOut = [0.16, 1, 0.3, 1] as const;

/** Ease-out for enter, ease-in for exit (Notion-style) */
const easeOutEnter = [0.32, 0.72, 0, 1] as const;
const easeInExit = [0.4, 0, 0.2, 1] as const;

/** Subtle ease-in-out for state changes */
const easeSmooth = [0.4, 0, 0.2, 1] as const;

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: {
    duration: duration.standard,
    ease: easeOutEnter,
  },
  exitTransition: {
    duration: duration.micro,
    ease: easeInExit,
  },
};

export function AnimatedPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={{
        ...pageTransition.exit,
        transition: pageTransition.exitTransition,
      }}
      transition={pageTransition.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedProgressBar({ progress }: { progress: number }) {
  return (
    <motion.div
      className="h-full bg-linear-to-r from-purple-600 to-blue-600 rounded-full"
      initial={false}
      animate={{ width: `${progress}%` }}
      transition={{
        duration: duration.relaxed,
        ease: easeOut,
      }}
    />
  );
}

export function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, {
    stiffness: 110,
    damping: 20,
    mass: 0.5,
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useMotionValueEvent(spring, "change", latest => {
    setDisplay(Math.round(latest));
  });

  return (
    <motion.span className="text-accent font-semibold tabular-nums">
      {display}
    </motion.span>
  );
}

const taskCardVariants = {
  incomplete: {
    scale: 1,
    boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)",
  },
  completed: {
    scale: 1.01,
    boxShadow:
      "0 0 0 1px rgba(34, 197, 94, 0.2), 0 4px 12px -2px rgba(34, 197, 94, 0.12)",
  },
};

const taskCardTransition = {
  duration: duration.standard,
  ease: easeSmooth,
};

export function AnimatedTaskCard({
  completed,
  onClick,
  className,
  children,
}: {
  completed: boolean;
  onClick: () => void;
  className: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      layout
      variants={taskCardVariants}
      initial={false}
      animate={completed ? "completed" : "incomplete"}
      transition={taskCardTransition}
      whileHover={{
        scale: completed ? 1.01 : 1.005,
        transition: { duration: duration.micro },
      }}
      whileTap={{
        scale: 0.995,
        transition: { duration: duration.micro },
      }}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

const buttonTransition = {
  type: "tween" as const,
  duration: duration.micro,
  ease: easeOut,
};

export function AnimatedButton({
  children,
  className,
  onClick,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      type={type}
      whileHover={{
        scale: 1.01,
        filter: "brightness(1.03)",
      }}
      whileTap={{
        scale: 0.99,
        transition: { duration: 0.08 },
      }}
      transition={buttonTransition}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
