import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AccentButton from '../components/AccentButton'
import FlexContainer from '../components/FlexContainer'
import FormRow from '../components/FormRow'
import ImageUploader from '../components/ImageUploader'
import profileInputs from '../utils/data/profileInputs'
import ContentPageLayout from '../components/ContentPageLayout'
import { getUserInfo, updateUser } from '../features/user/userThunk'
import { getUserPlaces } from '../features/places/PlacesThunks'
import EmptyPageLayout from '../components/EmptyPageLayout'

const limit = 10

const initialState = {
  firstName: '',
  lastName: '',
  aboutMe: '',
  email: '',
  // tags: [],
  isPublic: false,
  image: null,
}

const Profile = () => {
  const dispatch = useDispatch()
  const { user, isLoading, currentUser } = useSelector(store => store.user)
  const { placesByCurrentUser } = useSelector(store => store.places)

  const { firstName, lastName, email, aboutMe, image, imageId, isPublic } = currentUser || {}

  const [selectedImage, setSelectedImage] = useState('')
  const [coordinates, setCoordinates] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [values, setValues] = useState(initialState)
  const { id: userId } = user || {}

  const handleGetPrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1)
  }

  const handleGetNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const onChangeHandler = e => {
    const { name, value, files, checked } = e.target

    if (name === 'image') {
      const image = files[0]
      setSelectedImage(URL.createObjectURL(image))
      return setValues({ ...values, image })
    }

    if (name === 'isPublic') {
      return setValues({ ...values, isPublic: checked })
    }

    setValues({ ...values, [name]: value })
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()

    for (let key in values) {
      formData.append(key, values[key])
      // if (key === 'tags') formData.append(key, JSON.stringify(values[key]))
      // else formData.append(key, values[key])
    }

    dispatch(updateUser(formData))
    setCoordinates(null)
    setValues(initialState)
  }

  const generatePropsObject = (index, input) => {
    return {
      index: index,
      input: input,
      onChange: onChangeHandler,
      value: values[input.label],
      inputClassName: 'p-1 text-dark-gray',
      flexClassName: 'gap-1',
    }
  }

  const renderProfileInputs = profileInputs.map((input, index) => {
    const propsObj = generatePropsObject(index, input)
    if (input.label === 'email') return <FormRow key={index} {...propsObj} disabled />
    return <FormRow key={index} {...propsObj} />
  })

  useEffect(() => {
    if (!placesByCurrentUser.length && currentPage > 0) setCurrentPage(currentPage - 1)
  }, [placesByCurrentUser])

  useEffect(() => {
    if (!userId) return
    dispatch(getUserInfo(userId))
    dispatch(getUserPlaces({ userId, signedInUser: user?.id, currentPage, limit }))
  }, [userId, currentPage])

  useEffect(() => {
    if (currentUser) {
      setValues({ ...values, firstName, lastName, email, aboutMe, isPublic })
      setSelectedImage(image)
    }
  }, [currentUser])

  if (!userId) return <EmptyPageLayout />

  return (
    <section className='grid h-full sm:grid-cols-[2fr,2fr] md:grid-cols-[1fr,2fr] lg:grid-cols-[1fr,4fr]'>
      {/* left side form inputs */}
      <FlexContainer center className='p-4 h-[calc(100vh-57px)] bg-dark-gray'>
        <form className='space-y-3 w-full' onSubmit={handleSubmit}>
          <FlexContainer center>
            <ImageUploader rounded onChange={onChangeHandler} selectedImage={selectedImage} className='' />
          </FlexContainer>

          {renderProfileInputs}

          <FlexContainer gap>
            <input
              type='checkbox'
              name='isPublic'
              id='isPublic'
              className='hover:cursor-pointer'
              checked={values.isPublic}
              onChange={onChangeHandler}
            />
            <label htmlFor='isPublic' className='hover:cursor-pointer'>
              Make account public
            </label>
          </FlexContainer>

          <AccentButton small full primary isLoading={isLoading}>
            update profile
          </AccentButton>
        </form>
      </FlexContainer>

      {/* right side google map */}

      <div className='h-[calc(100vh-57px)]'>
        <ContentPageLayout
          title='places added by you'
          data={placesByCurrentUser}
          isPublic={true}
          isFollowedByCurrentUser={true}
          handleGetPrevPage={handleGetPrevPage}
          handleGetNextPage={handleGetNextPage}
          mapClassName='lg:block'
          contentContainerClassName='lg:grid-cols-[1fr,2fr]'
        />
      </div>
    </section>
  )
}

export default Profile
