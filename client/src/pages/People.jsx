import React from 'react'
import Person from '../components/Person'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllUsers } from '../features/user/userThunk'

const People = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllUsers())
  }, [])

  const { allUsers } = useSelector(store => store.user)

  return (
    <motion.section
      className='h-full bg-gray-800 p-6'
      initial={{ x: '100vw' }}
      animate={{ x: '0' }}
      transition={{ type: 'tween', duration: 0.15 }}
    >
      <div className='container mx-auto'>
        <h2 className='text-accent text-3xl font-bold mb-4'>People</h2>

        <div className='grid gap-6 justify-center lg:grid-cols-2'>
          {allUsers.map((person, index) => {
            return <Person key={index} {...person} />
          })}
        </div>
      </div>
    </motion.section>
  )
}

export default People
