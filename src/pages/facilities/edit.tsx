import EditableImage from "@/components/EditableImage"
import { Facility } from "@/components/FacilityList"
import LoadingSpinner from "@/components/LoadingSpinner"
import { gql, useMutation, useQuery } from "@apollo/client"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useState } from "react"
import { BsHouses } from "react-icons/bs"

type Props = {}

const getFacilityWhereQuery = gql`
query GetFacilities($getFacilityArgs: GetFacilityArgs) {
  getFacilities(GetFacilityArgs: $getFacilityArgs) {
    id
    name
    description
    images {
      id
      url
      fileId
      profile
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`

const updateFacilityMutation = gql`
mutation UpdateFacility($facilityUpdateInput: FacilityUpdateInput!, $facilityWhereUnique: FacilityWhereUniqueInput!) {
  updateFacility(FacilityUpdateInput: $facilityUpdateInput, FacilityWhereUnique: $facilityWhereUnique) {
    createdAt
    description
    id
    images {
      id
      url
      profile
      createdAt
      updatedAt
    }
    name
    updatedAt
  }
}
`

const Edit = (props: Props) => {
  const router = useRouter();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState('');
  const { data, error, loading } = useQuery(getFacilityWhereQuery, {
    variables: {
      getFacilityArgs: {
        where: {
          id: {
            equals: router.query.id
          }
        }
      }
    }
  });
  const [updateFacility, {
    loading: updateLoading
  }] = useMutation(updateFacilityMutation);

  const [updateData, setUpdateData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    if (!loading && data) {
      setUpdateData({
        name: data.getFacilities[0].name,
        description: data.getFacilities[0].description,
      })
    }
  }, [data, loading])

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

  const handleUpdate = async () => {
    console.log(updateData);
    const result = await updateFacility({
      variables: {
        facilityUpdateInput: {
          name: {
            set: updateData.name
          },
          description: {
            set: updateData.description
          },
        },
        facilityWhereUnique: {
          id: data.getFacilities[0].id
        }
      },
      refetchQueries: ['GetFacilities']
    })

    console.log(result);
    router.push('/facilities');
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageUploadLoading(true);

    if (e.target.files) {
      console.log(data.getFacilities);
      setUploadInfo(`Uploading file..`)
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('folder', data.getFacilities[0].name.replaceAll(" ", ""));

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const json = await result.json();

      if (result.status === 201) {
        setUploadInfo('Updating database..');
        const result = await updateFacility({
          variables: {
            facilityUpdateInput: {
              images: {
                create: [
                  {
                    url: json.url,
                    profile: false,
                    fileId: json.fileId
                  }
                ]
              }
            },
            facilityWhereUnique: {
              id: router.query.id
            }
          },
          refetchQueries: ['GetFacilities']
        })

        console.log(result);
      }
    }

    setImageUploadLoading(false);
  }

  return (
    <div className="p-4 flex flex-col gap-y-8 pb-36">
      {imageUploadLoading ?
        <div className="flex flex-col gap-4 justify-center items-center z-20 bg-black bg-opacity-40 fixed w-full h-screen">
          <span>{uploadInfo}</span>
          <progress className="progress w-56 progress-error"></progress>
        </div>
        : <></>}
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href="/facilities" className="flex gap-2">
                <BsHouses />
                Facilities
              </Link>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Edit {data.getFacilities[0].name}
            </li>
          </ul>
        </div>
      </div>
      {data.getFacilities.map((facility: Facility) => {
        return (
          <div key={facility.id}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile</span>
              </label>
              <div className="avatar">
                <div className="w-full h-40">
                  <EditableImage facilityId={facility.id} image={facility.images.filter((image) => image.profile == true)[0]} alt={`Profile image of ${facility.name}`} />
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Images</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {facility.images.filter((image) => image.profile === false).map((image) => {
                  return (
                    <EditableImage facilityId={facility.id} key={image.id} image={image} alt={`Image of ${facility.name}`} />
                  )
                })}
              </div>
              <input onChange={async (e) => {
                await handleUpload(e);
              }} accept="image/*" type="file" className={`file-input file-input-bordered w-full ${facility.images.filter((image) => image.profile === false).length > 0 ? 'mt-5' : ''
                }`} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <label className="input-group">
                <input value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} type="text" placeholder={facility.name} className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <label className="input-group">
                <textarea value={updateData.description} onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })} placeholder={facility.description} className="textarea textarea-bordered w-full" />
              </label>
            </div>
          </div>
        )
      })}
      <div className="fixed flex bottom-20 right-4">
        <button onClick={() => handleUpdate()} className={`btn w-full btn-error bottom-20 ${updateLoading ? 'loading' : ''}`}>Save changes</button>
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Edit