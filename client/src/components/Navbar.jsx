import React from 'react'
import logo from '../images/logosmall.svg'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/user/userSlice'
import Image from './Image'
import WebsiteContainer from './WebsiteContainer'
import Alerts from './Alerts'

const navListItems = ['places', 'people', 'favorites', 'explore', 'profile']

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(store => store.user)

  const handleAuth = () => {
    if (!user) return navigate('/register')

    dispatch(logout())
    return navigate('/people')
  }

  const listItems = navListItems.map(item => <ListItem key={item} item={item} className='hov' />)

  return (
    <div className='bg-accent'>
      {/* Navbar inner container to wrap logo and navigation links */}

      <WebsiteContainer>
        <nav>
          <ul className='flex items-center justify-between capitalize py-1'>
            {/* logo */}
            <Link to='/'>
              <Image src={logo} alt='around the world logo' />
            </Link>

            {/* navigation links */}
            {listItems}

            {/* alerts button */}
            <Alerts />

            {/* auth button */}
            <Link to='/register' onClick={handleAuth}>
              {user ? 'Logout' : 'Login'}
            </Link>
          </ul>
        </nav>
      </WebsiteContainer>
    </div>
  )
}

export default Navbar

const ListItem = ({ item }) => {
  const linkURL = item === 'places' ? '' : item
  return (
    <li>
      <NavLink to={'/' + linkURL} end={true} className={({ isActive }) => (isActive ? `hov active` : 'hov')}>
        {item}
      </NavLink>
    </li>
  )
}
