import { gql, useQuery } from "@apollo/client"
import Link from "next/link"
import FacilityListItem from "./FacilityListItem"
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

export type Facility = {
  id: string
  name: string
  description: string
  images: Image[]
  createdAt: Date
  updatedAt: Date
}

const getFacilitiesQuery = gql`
query GetFacilities {
  getFacilities {
    id
    name
    description
    images {
      id
      url
      profile
      fileId
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`

const FacilityList = (props: Props) => {
  const { data, loading, error } = useQuery(getFacilitiesQuery);

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
      {data.getFacilities.map((facility: Facility) => {
        return (
          <FacilityListItem facility={facility} key={facility.id} />
        )
      })}
      <Link href="/facilities/create" className="btn w-full btn-outline">Create new facility</Link>
    </>
  )
}

export default FacilityList