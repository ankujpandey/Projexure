import React from 'react'
import Navbar from '@/app/(components)/Navbar'
import Sidebar from '@/app/(components)/Sidebar'

const DashboardWrapper = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='flex min-h-screen w-full bg-gray-50 text-gray-900'>
            {/* sidebar */}
            <Sidebar />
            <main className={`dark:bg-dark-bg flex w-full flex-col bg-gray-50 md:pl-64`}>
                {/* navbar */}
                <Navbar />
                {children}
            </main>
        </div>
    )
}

export default DashboardWrapper

