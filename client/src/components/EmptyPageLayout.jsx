import React from 'react'
import { motion } from 'framer-motion'
import parachuteBg from '../images/parachute-bg.svg'
import parachute from '../images/parachute.svg'
import AccentButton from '../components/AccentButton'
import { Link } from 'react-router-dom'

const EmptyPageLayout = ({ user }) => {
  return (
    <motion.section className='h-screen bg-slate-100'>
      <div className='p-6 h-screen relative'>
        <img src={parachuteBg} alt='' className='absolute top-0 left-0 w-full h-full' />
        <motion.img
          animate={{ rotate: [1, -1, 1], x: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 8 }}
          src={parachute}
          alt=''
          className='absolute top-20 right-72 w-80'
        />
        <div className='flex items-center gap-2 absolute bottom-5 left-1/2 -translate-x-1/2'>
          <h3 className='text-xl'>{user ? 'No places were found.' : 'Login to see your added places'}</h3>
          <Link to={`${user ? '/explore/search' : 'register'}`}>
            <AccentButton>{user ? 'Explore' : 'Login'}</AccentButton>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

export default EmptyPageLayout
