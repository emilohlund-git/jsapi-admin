import { gql, useQuery } from "@apollo/client"
import Link from "next/link"
import HorseListItem from "./HorseListItem"
import LoadingSpinner from "./LoadingSpinner"

type Props = {}

export type Image = {
  url: string
  id: string
  horseId: string | null
  profile: boolean
  facilityId: string | null
  createdAt: Date
  updatedAt: Date
}

export type Horse = {
  id: string
  name: string
  nickname: string
  category: string
  owner: string
  after: string
  birthyear: string
  images: Image[]
  gender: string
  color: string
  createdAt: Date
  updatedAt: Date
}

const getHorsesQuery = gql`
query GetHorses {
  getHorses {
    after
    birthyear
    category
    color
    createdAt
    gender
    id
    images {
      id
      url
      fileId
      profile
      createdAt
      updatedAt
    }
    name
    nickname
    owner
    updatedAt
  }
}
`

const HorseList = (props: Props) => {
  const { data, loading, error } = useQuery(getHorsesQuery);

  if (loading) {
    return (
      <LoadingSpinner />
    )
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{JSON.stringify(error)}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {data.getHorses.map((horse: Horse) => {
        return (
          <HorseListItem horse={horse} key={horse.id} />
        )
      })}
      <Link href="/horses/create" className="btn w-full btn-outline">Create new horse</Link>
    </>
  )
}

export default HorseList