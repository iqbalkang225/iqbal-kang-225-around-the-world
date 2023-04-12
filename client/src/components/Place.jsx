import React, { useEffect, useRef } from 'react'
import { BiSearch } from 'react-icons/bi'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdModeEdit, MdDeleteForever } from 'react-icons/md'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deletePlace, editPlace, getSinglePlace, toggleLikedPlace } from '../features/places/PlacesThunks'
import FlexContainer from './FlexContainer'
import Heading from './Heading'

import LoginModal from './LoginModal'
import RoundButton from './RoundButton'
import CountryWithRating from './CountryWithRating'
import CustomDescriptionLink from './CustomDescriptionLink'
import Image from './Image'
import { useNavigate } from 'react-router-dom'
import { toggleEditPlace } from '../features/places/placesSlice'
import Spinner from './Spinner'

const shortenText = (text, length) => {
  if (!text) return
  if (text.length > length) return text.slice(0, length) + '...'
  return text
}

const Place = props => {
  const dispatch = useDispatch()
  const placeRef = useRef()

  const { isLoading, user } = useSelector(store => store.user)
  const { title, country, rating, description, id, isFavorite, firstName, lat, lng, image, updateCoordinates, userId } =
    props

  const [isDescVisible, setIsDescVisible] = useState(false)
  const [loginModal, setLoginModal] = useState(false)

  const toggleDescription = () => setIsDescVisible(prevState => !prevState)

  const handleToggleFavorite = placeId => {
    if (!user) return setLoginModal(true)
    dispatch(toggleLikedPlace(placeId))
  }

  const handleGetCoordinates = () => {
    if (updateCoordinates) updateCoordinates({ lat, lng })
  }

  const imageContainerClasses =
    'relative w-36 h-full rounded-3xl shadow-md shadow-dark-gray shadow-dark-gray overflow-hidden group'
  const overlayClasses = 'absolute inset-0 bg-black/30 group-hover:bg-black/70 duration-200'
  const searchButtonClasses =
    'hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:block z-10'
  const favoriteButtonClasses = 'absolute top-5 right-5 z-10'

  const favoriteIcon = isFavorite => {
    const favoriteIconClasses = 'text-accent'
    return isFavorite ? (
      <AiFillHeart className={favoriteIconClasses} />
    ) : (
      <AiOutlineHeart className={favoriteIconClasses} />
    )
  }

  const closeLoginModal = () => setLoginModal(false)

  useEffect(() => {
    if (!isLoading) setLoginModal(false)
  }, [isLoading])

  useEffect(() => {
    setIsDescVisible(false)
  }, [title])

  return (
    <article onClick={handleGetCoordinates} className='flex-shrink-0 space-y-2 cursor-pointer' ref={placeRef}>
      {/* container for photo and place description */}
      <div className='flex gap-2 h-52'>
        {/* container for place image, favorite & search */}
        <div className={imageContainerClasses}>
          <Image src={image} alt={title} />
          <RoundButton primary className={favoriteButtonClasses} onClick={handleToggleFavorite.bind(null, id)}>
            {favoriteIcon(isFavorite)}
          </RoundButton>
          <RoundButton className={searchButtonClasses} onClick={toggleDescription}>
            <BiSearch className='text-accent w-10 h-10' />
          </RoundButton>
          {/* overlay */}
          <div className={overlayClasses}></div>
        </div>

        {/* description container */}
        <Description
          description={description}
          isDescVisible={isDescVisible}
          title={title}
          toPlace={id}
          toUser={userId}
          value={firstName}
        />
      </div>
      {/* container for place info */}
      <FlexContainer col className='gap-0'>
        <p className='font-semibold capitalize' title={title}>
          {shortenText(title, 16)}
        </p>
        <CountryWithRating rating={rating} country={country} className='text-sm' />
      </FlexContainer>

      {loginModal && <LoginModal closeModal={closeLoginModal} isLoading={isLoading} />}
    </article>
  )
}

export default Place

const Description = ({ description, isDescVisible, title, toPlace, toUser, value }) => {
  const containerBaseClasses =
    'bg-dark-gray text-white rounded-3xl shadow-md shadow-dark-gray origin-left duration-200 cursor-auto'
  const containerExtraClasses = isDescVisible ? ' scale-x-100 p-6' : ' scale-x-0 w-0 h-60'

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(store => store.user)
  const { isLoading } = useSelector(store => store.places)

  const handlePlaceEditClick = placeId => {
    dispatch(toggleEditPlace())
    dispatch(getSinglePlace({ placeId }))
    navigate('/explore/')
    // setTimeout(() => {
    // navigate('/explore/')
    // }, 200)
  }

  const handlePlaceDeleteClick = placeId => dispatch(deletePlace(placeId))

  const renderButtons = () => {
    const buttonClasses = 'hover:text-accent duration-200'
    if (toUser === user.id)
      return (
        <FlexContainer gap className='mr-4'>
          <button onClick={handlePlaceEditClick.bind(null, toPlace)}>
            <MdModeEdit size={16} className={buttonClasses} />
          </button>
          <button onClick={handlePlaceDeleteClick.bind(null, toPlace)}>
            {isLoading ? <Spinner /> : <MdDeleteForever size={16} className={buttonClasses} />}
          </button>
        </FlexContainer>
      )
  }

  return (
    <div className={containerBaseClasses + containerExtraClasses}>
      <FlexContainer col className='h-full w-[400px] text-sm'>
        {/* heading, delete and edit buttons */}
        <FlexContainer justifyBetween>
          <Heading offWhite h6>
            about {title}
          </Heading>
          {renderButtons()}
        </FlexContainer>
        <p className='flex-1'>{shortenText(description, 300)}</p>
        <FlexContainer justifyBetween>
          <CustomDescriptionLink text='added by' value={value} to={'/people/' + toUser} />
          <CustomDescriptionLink text='take me to' value={title} to={'/places/' + toPlace} />
        </FlexContainer>
      </FlexContainer>
    </div>
  )
}
