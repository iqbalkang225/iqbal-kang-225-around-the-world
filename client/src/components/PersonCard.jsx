// import React from 'react'
// import userImage from '../images/user.png'
// import { useDispatch, useSelector } from 'react-redux'
// import { getUserPlaces } from '../features/places/PlacesThunks'
// import { Link } from 'react-router-dom'

// const PersonCard = ({ firstName, lastName, userPlaces, _id }) => {
//   const dispatch = useDispatch()

//   const handleClick = () => dispatch(getUserPlaces(_id))

//   return (
//     <Link
//       to='/myPlaces'
//       className='max-w-lg lg:max-w-max flex gap-2 items-center bg-white rounded-xl p-4 shadow-md cursor-pointer'
//       onClick={handleClick}
//     >
//       {/* left info col */}
//       <div>
//         <h3 className='card-heading'>
//           {firstName} {lastName}
//         </h3>
//         <h4 className='mb-4'>
//           <span className='font-bold'>{userPlaces?.length}</span> {userPlaces?.length <= 1 ? 'place' : 'places'}
//         </h4>
//         <p>
//           Dolore non deserunt sunt nostrud consectetur. Dolore non deserunt nostrud consectetur. Dolore non deserunt
//         </p>
//       </div>
//       {/* right photo col */}
//       <img src={userImage} alt='user' className='w-28 h-36 shrink-0 object-cover rounded-xl' />
//     </Link>
//   )
// }

// export default PersonCard

import React from 'react'

import { Link } from 'react-router-dom'
import FlexContainer from './FlexContainer'
import Heading from './Heading'
import { renderLargeImage } from '../utils/rendeImage'

const PersonCard = ({ firstName, lastName, aboutMe, image, id: userId, totalPlaces }) => {
  const shortenDescription = description => {
    if (!description) return 'no description added'
    if (description?.length > 130) return description.slice(0, 130) + '...'

    return description
  }

  return (
    <FlexContainer gap justifyBetween className='bg-off-white text-dark-gray p-4 rounded-3xl shadow-md'>
      {/* left info col */}
      <FlexContainer col>
        <Heading h5 bold>
          {firstName} {lastName}
        </Heading>
        <p className='text-xs mb-2'>
          Places added:
          <span className='font-bold text-sm ml-2'>{totalPlaces}</span>
        </p>
        <p className='text-sm flex-1 first-letter:capitalize'>
          {shortenDescription(aboutMe)}
          <Link to={'/people/' + userId} className='text-accent ml-2'>
            know more
          </Link>
        </p>
      </FlexContainer>
      {/* right photo col */}
      <div className='w-28 h-36 shrink-0 rounded-xl overflow-hidden shadow-lg'>
        {renderLargeImage(image, firstName, lastName)}
      </div>
    </FlexContainer>
  )
}

export default PersonCard
