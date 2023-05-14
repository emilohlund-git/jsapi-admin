import Head from 'next/head';
import React, { ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';

type Props = {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <main
      className={`flex min-h-screen w-full flex-col py-2 bg-gray-900 font-mono`}
    ><Head><title>Jemmastables Admin</title></Head>
      {children}
      <BottomNavigation />
    </main>
  )
}

export default Layout