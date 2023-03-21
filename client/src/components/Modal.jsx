// import React from 'react'
// import { Link } from 'react-router-dom'
// import AccentButton from './AccentButton'
// import { AiFillCloseCircle } from 'react-icons/ai'
// import tower from '../images/tower.png'
// import { useDispatch, useSelector } from 'react-redux'
// import { closeModal } from '../features/exploreInputsSlice/exploreInputsSlice'

// const Modal = () => {
//   const dispatch = useDispatch()
//   const state = useSelector(store => store.exploreInputs)

//   const clickHandler = () => dispatch(closeModal())

//   return (
//     <div className='absolute h-screen w-screen top-0 left-0 z-10'>
//       {/* backdrop */}
//       <div
//         className='h-full w-full bg-black/90 cursor-pointer'
//         onClick={clickHandler}
//       ></div>
//       {/* modal container */}
//       <div className='absolute max-w-2xl p-6 w-5/6 bg-white rounded-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:grid grid-cols-2 items-center shadow-lg shadow-accent/30'>
//         <img src={tower} alt='tower' className='w-56 hidden md:block' />
//         <div>
//           <AiFillCloseCircle
//             size={32}
//             className='ml-auto mb-6 cursor-pointer md:absolute right-5 top-5'
//             onClick={clickHandler}
//           />
//           <h3 className='font-bold'>You are curently not logged in</h3>
//           <p className='max-w-lg mb-6'>
//             Please login to save places and add favourites to your profile. You
//             can still continue to browse without logging in.
//           </p>
//           <Link to='/register' className='inline-block'>
//             <AccentButton>Login</AccentButton>
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Modal

import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import FlexContainer from './FlexContainer'

const Modal = ({ children, closeModal, className = '' }) => {
  const innerDivClasses = classnames(
    className,
    'fixed py-6 rounded bg-white dark:bg-modal shadow-md cursor-auto overflow-y-scroll'
  )
  const backdropClasses =
    'fixed inset-0 bg-dark-gray bg-opacity-50 backdrop-blur-sm z-20 cursor-pointer flex flex-col justify-center items-center'

  const handleModal = e => {
    e.stopPropagation()
    if (e.target.id === 'backdrop') return closeModal ? closeModal() : null
  }

  return ReactDOM.createPortal(
    <div id='backdrop' className={backdropClasses} onMouseDown={handleModal}>
      <div className={innerDivClasses}>{children}</div>
    </div>,
    document.getElementById('modal')
  )
}

export default Modal
