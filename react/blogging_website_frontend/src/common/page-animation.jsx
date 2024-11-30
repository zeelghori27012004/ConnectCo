import { AnimatePresence, motion } from "framer-motion"; // Importing components for animations from framer-motion

// AnimationWrapper component definition
// This component wraps its children with animation effects using framer-motion
const AnimationWrapper = ({
  children, // The children elements to be animated
  keyValue, // Unique key to help React identify elements for animations
  initial = { opacity: 0 }, // Initial animation state (default: fully transparent)
  animate = { opacity: 1 }, // Target animation state (default: fully opaque)
  transition = { duration: 0.5 }, // Transition configuration (default: half-second duration)
  className, // Optional additional CSS class for styling
}) => {
  return (
    <AnimatePresence> {/* Enables animation for components being mounted and unmounted */}
      <motion.div
        key={keyValue} // Assign unique key for animation handling
        initial={initial} // Defines the starting animation state
        animate={animate} // Defines the final animation state
        transition={transition} // Specifies the timing and behavior of the animation
        className={className} // Applies optional custom styling
      >
        {children} {/* Render wrapped child components */}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper; // Exporting the component for use in other files
