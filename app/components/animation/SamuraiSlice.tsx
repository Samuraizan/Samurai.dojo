'use client'

import { memo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const SamuraiSlice = memo(function SamuraiSlice() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="text-center"
    >
      <Image
        src="/assets/Samurai Slice 960x540.gif"
        alt="Samurai Animation"
        width={960}
        height={540}
        priority
        className="mx-auto"
      />
    </motion.div>
  )
})

export default SamuraiSlice 