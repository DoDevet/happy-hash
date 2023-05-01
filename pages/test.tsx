import { motion } from "framer-motion";

export default function TestPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-red-400 ">
      <motion.div
        animate={{ scale: 1 }}
        className="h-20 w-20 bg-white"
        initial={{ scale: 0 }}
      ></motion.div>
    </div>
  );
}
