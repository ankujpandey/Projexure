import { User } from '@/state/api'
import Image from 'next/image'
import React from 'react'

type Props = {
    user: User
}

const UserCard = ({user}: Props) => {
  return (
    <div className='flex items-center my-3 border rounded-lg p-3 shadow transition-shadow duration-300 hover:shadow-lg dark:bg-dark-secondary dark:text-white'>
        {user.profilePictureUrl && (
            <Image
                src={`/${user.profilePictureUrl}`}
                alt='profile picture'
                width={32}
                height={32}
                className='h-16 w-16 mr-5 rounded-full border-2 border-white object-cover dark:border-dark-secondary'
            />
        )}
        <div>
            <h3 className='font-semibold'>{user.username}</h3>
            <p>{user.email}</p>
        </div>
    </div>
  )
}

export default UserCard