import React, { useEffect, useRef } from 'react'

import FlexContainer from './FlexContainer'
import Heading from './Heading'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Image from './Image'

import { getComments, getCommentsForSignedInUsers, postComment } from '../features/comments/commentsThunks'
import { toast } from 'react-toastify'
import Comment from './Comment'
import CommentForm from './CommentForm'

const Comments = () => {
  const inputRef = useRef()
  const dispatch = useDispatch()
  const { placeId } = useParams()

  const { user } = useSelector(store => store.user)
  const { comments, isLoading } = useSelector(store => store.comments)

  const handleCommentSubmit = e => {
    e.preventDefault()
    const comment = inputRef.current.innerText

    if (!comment) return toast.error('Please enter a comment')
    dispatch(postComment({ comment, placeId }))
  }

  useEffect(() => {
    user ? dispatch(getCommentsForSignedInUsers(placeId)) : dispatch(getComments(placeId))
  }, [placeId])

  const renderComments = comments.map((comment, index) => <Comment key={index} comment={comment} />)

  return (
    <div className='w-[42rem] text-sm'>
      <Heading offWhite h4>
        Comments
      </Heading>

      {/* comments container */}
      <div className='space-y-6 mt-2 mb-6'>{renderComments}</div>

      {/* comment form */}
      <CommentForm marginLeft onSubmit={handleCommentSubmit} isLoading={isLoading} ref={inputRef} />
    </div>
  )
}

export default Comments