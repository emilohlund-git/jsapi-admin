import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function Home() {
  const { user } = useUser();

  return (
    <main
      className={`flex flex-col items-center justify-center p-24 font-mono gap-4`}
    >
      {!user ?
        <>
          <h1 className="font-extralight">Welcome, please log in</h1>
          <Link href="/api/auth/login" className="btn btn-outline btn-wide">Login</Link>
        </>
        :
        <>
          <h1 className="font-extralight">Welcome back</h1>
          <span>{user.name}</span>
          <Link href="/api/auth/logout" className="btn btn-outline btn-wide">Logout</Link>
        </>
      }
    </main>
  )
}
