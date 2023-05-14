import { gql, useQuery } from "@apollo/client"
import Link from "next/link"
import LoadingSpinner from "./LoadingSpinner"
import PartnerListItem from "./PartnerListItem"

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

export type Partner = {
  id: string
  name: string
  website: string
  description: string
  image: Image
  createdAt: Date
  updatedAt: Date
  imageId: string
}


const getPartnersQuery = gql`
query GetPartners {
  getPartners {
    createdAt
    description
    id
    image {
      createdAt
      fileId
      id
      profile
      updatedAt
      url
    }
    name
    updatedAt
    website
  }
}
`

const PartnerList = (props: Props) => {
  const { data, loading, error } = useQuery(getPartnersQuery);

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
      {data.getPartners.map((partner: Partner) => {
        return (
          <PartnerListItem partner={partner} key={partner.id} />
        )
      })}
      <Link href="/partners/create" className="btn w-full btn-outline">Create new partner</Link>
    </>
  )
}

export default PartnerList