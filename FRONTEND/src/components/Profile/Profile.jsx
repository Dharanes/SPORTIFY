import React from 'react'
import UserProfile from './UserProfile'
import OwnerProfile from './OwnerProfile'
import {useSelector} from 'react-redux';
 
function Profile() {
    const role = useSelector((state) => state.auth.role)
 
    return(
      <>
       {role==='USER'?<UserProfile />:role==='OWNER'?
        <OwnerProfile />:
        <div className='p-32 text-5xl font-bold text-center mb-6'>
        LOGIN TO VIEW PROFILE
        </div>}
      </>
    )
}
 
export default Profile
 