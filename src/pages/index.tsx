import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user } = useUser();

  return (
    <main
      className={`flex flex-col items-center justify-center p-24 font-mono gap-4`}
    >
      {!user ?
        <>
          <h1 className="font-extralight">Welcome, please log in</h1>
          <a href="/api/auth/login" className="btn btn-outline btn-wide">Login</a>
        </>
        :
        <>
          <h1 className="font-extralight">Welcome back</h1>
          <span>{user.name}</span>
          <a href="/api/auth/logout" className="btn btn-outline btn-wide">Logout</a>
        </>
      }
    </main>
  )
}
