import EditableImage from "@/components/EditableImage"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Partner } from "@/components/PartnerList"
import { gql, useMutation, useQuery } from "@apollo/client"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useState } from "react"
import { FiUsers } from "react-icons/fi"

type Props = {}

const getPartnerWhereQuery = gql`
query GetPartners($getPartnerArgs: GetPartnersArgs) {
  getPartners(GetPartnerArgs: $getPartnerArgs) {
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

const updatePartnerMutation = gql`
mutation UpdatePartner($partnerUpdateInput: PartnerUpdateInput!, $partnerWhereUnique: PartnerWhereUniqueInput!) {
  updatePartner(PartnerUpdateInput: $partnerUpdateInput, PartnerWhereUnique: $partnerWhereUnique) {
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

const Edit = (props: Props) => {
  const router = useRouter();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState('');
  const { data, error, loading } = useQuery(getPartnerWhereQuery, {
    variables: {
      getPartnerArgs: {
        where: {
          id: {
            equals: router.query.id
          }
        }
      }
    }
  });
  const [updatePartner, {
    loading: updateLoading
  }] = useMutation(updatePartnerMutation);

  const [updateData, setUpdateData] = useState({
    name: '',
    description: '',
    website: '',
  })

  useEffect(() => {
    if (!loading && data) {
      setUpdateData({
        name: data.getPartners[0].name,
        description: data.getPartners[0].description,
        website: data.getPartners[0].website,
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
    const result = await updatePartner({
      variables: {
        partnerUpdateInput: {
          name: {
            set: updateData.name
          },
          description: {
            set: updateData.description
          },
          website: {
            set: updateData.website
          },
        },
        partnerWhereUnique: {
          id: data.getPartners[0].id
        }
      },
      refetchQueries: ['GetPartners']
    })

    console.log(result);
    router.push('/partners');
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageUploadLoading(true);

    if (e.target.files) {
      setUploadInfo(`Uploading file..`)
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('folder', data.getPartners[0].name.replaceAll(' ', ''));

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const json = await result.json();

      if (result.status === 201) {
        setUploadInfo('Updating database..');
        const result = await updatePartner({
          variables: {
            partnerUpdateInput: {
              image: {
                create: {
                  url: json.url,
                  profile: false,
                  fileId: json.fileId
                }
              }
            },
            partnerWhereUnique: {
              id: router.query.id
            }
          },
          refetchQueries: ['GetPartners']
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
              <Link href="/partners" className="flex gap-2">
                <FiUsers />
                Partners
              </Link>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Edit {data.getPartners[0].name}
            </li>
          </ul>
        </div>
      </div>
      {data.getPartners.map((partner: Partner) => {
        return (
          <div key={partner.id}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile</span>
              </label>
              <div className="avatar">
                <div className="w-full h-40">
                  <EditableImage partnerId={partner.id} image={partner.image} alt={`Profile image of ${partner.name}`} />
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <label className="input-group">
                <input value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} type="text" placeholder={partner.name} className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <label className="input-group">
                <textarea value={updateData.description} onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })} placeholder={partner.description} className="textarea textarea-bordered w-full" />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Website</span>
              </label>
              <label className="input-group">
                <input value={updateData.website} onChange={(e) => setUpdateData({ ...updateData, website: e.target.value })} type="text" placeholder={partner.website} className="input input-bordered w-full" />
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