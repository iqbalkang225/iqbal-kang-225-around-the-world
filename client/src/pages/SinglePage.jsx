import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FlexContainer from '../components/FlexContainer'
import Heading from '../components/Heading'
import {
  getSimilarPlaces,
  getSimilarPlacesForSignedInUsers,
  getSinglePlace,
  toggleLikedPlace,
} from '../features/places/PlacesThunks'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BiMessageSquare } from 'react-icons/bi'
import RoundButton from '../components/RoundButton'
import CountryWithRating from '../components/CountryWithRating'
import CustomDescriptionLink from '../components/CustomDescriptionLink'
import Image from '../components/Image'
import WebsiteContainer from '../components/WebsiteContainer'
import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import Gmap from '../components/Gmap'

import Comments from '../components/Comments'
import FollowingContainer from '../components/FollowingContainer'
import Place from '../components/Place'

const SinglePage = () => {
  const { placeId } = useParams()
  const dispatch = useDispatch()
  const commentsRef = useRef()

  const [loginModal, setLoginModal] = useState(false)

  const { singlePlace, similarPlaces } = useSelector(store => store.places)
  const { comments } = useSelector(store => store.comments)
  const { user, isLoading } = useSelector(store => store.user) || {}
  const { id: userId } = user || {}

  const {
    title,
    description,
    address,
    id,
    tags,
    likes,
    country,
    rating,
    image,
    isFavorite,
    addedBy,
    lat,
    lng,
    userId: addedByUserId,
  } = singlePlace || {}

  useEffect(() => {
    dispatch(getSinglePlace({ userId, placeId }))
    user ? dispatch(getSimilarPlacesForSignedInUsers(placeId)) : dispatch(getSimilarPlaces(placeId))
  }, [isFavorite, placeId])

  useEffect(() => {
    if (!isLoading) setLoginModal(false)
  }, [isLoading])

  const handleToggleFavorite = placeId => {
    if (!userId) return setLoginModal(true)
    dispatch(toggleLikedPlace(placeId))
  }

  const handleCommentsClick = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const closeLoginModal = () => setLoginModal(false)

  const favoriteIcon = isFavorite => {
    return isFavorite ? <AiFillHeart /> : <AiOutlineHeart />
  }

  const renderLikes = likes?.map(like => <FollowingContainer key={like.id} {...like} singlePage placeId={placeId} />)

  const renderTags = tags?.map((tag, index) => <Tag title={tag} key={index} />)

  return (
    <section className='bg-dark-gray text-off-white'>
      <div className='grid grid-cols-[3fr,1fr] h-[600px]'>
        <div className='h-[600px]'>
          <Image src={image} alt={title} />
        </div>
        {/* people who liked */}
        <div className='grid grid-rows-[min-content,1fr,min-content] h-[600px]'>
          <Heading h6 className='text-off-white  p-2'>
            People who liked {title}
          </Heading>
          {/* person */}
          <div className=' overflow-scroll px-4 divide-y-2 divide-[#555]'>{renderLikes}</div>

          {/* place stats */}
          <FlexContainer col className='bg-accent p-2 px-4 gap-1'>
            <FlexContainer justifyBetween>
              <ValueWithIcon
                value={likes?.length}
                text={likes?.length > 1 ? 'likes' : 'like'}
                onClick={handleToggleFavorite.bind(null, placeId)}
              >
                {favoriteIcon(isFavorite)}
              </ValueWithIcon>
              <ValueWithIcon value={comments?.length} text='comments' onClick={handleCommentsClick}>
                <BiMessageSquare />
              </ValueWithIcon>
            </FlexContainer>
            <p className='text-sm'>{address}</p>
          </FlexContainer>
        </div>
      </div>

      {/* place info */}
      <div>
        <WebsiteContainer className='py-6'>
          {/* plave label with  rating */}
          <FlexContainer alignEnd gap>
            <Heading h2 offWhite>
              {title}
            </Heading>
            <CountryWithRating rating={rating} country={country} className='text-md' isLabel />
          </FlexContainer>
          {/* tags */}
          <FlexContainer gap className='mt-2 mb-4'>
            {renderTags}
          </FlexContainer>

          {/* description */}
          <FlexContainer col className='text-sm max-w-3xl'>
            {description}
            <CustomDescriptionLink text='added by' value={addedBy} to={'/people/' + addedByUserId} />
          </FlexContainer>

          {/* comments */}
          <Comments ref={commentsRef} />
        </WebsiteContainer>

        {similarPlaces.length > 0 && <SimilarPlaces similarPlaces={similarPlaces} />}

        {/* google map */}
        <div className='h-[500px]'>
          <Gmap coordinates={{ lat, lng }} />
        </div>
      </div>

      {/* login modal */}
      {loginModal && <LoginModal closeModal={closeLoginModal} isLoading={isLoading} />}
    </section>
  )
}

export default SinglePage

const ValueWithIcon = ({ children, value, text, onClick }) => {
  return (
    <FlexContainer alignCenter gap>
      <RoundButton primary className='text-accent' onClick={onClick}>
        {children}
      </RoundButton>
      <p>
        {value} {text}
      </p>
    </FlexContainer>
  )
}

const Tag = ({ title }) => {
  return <span className='bg-off-white text-accent text-xs rounded-3xl p-1 px-3 capitalize'>{title}</span>
}

const SimilarPlaces = ({ similarPlaces }) => {
  return (
    <FlexContainer col className='overflow-x-auto bg-off-white text-dark-gray p-6'>
      <Heading h4>similar places</Heading>
      <div className='flex gap-4'>
        {similarPlaces.map((place, index) => (
          <Place key={index} {...place} />
        ))}
      </div>
    </FlexContainer>
  )
}
