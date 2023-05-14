import EditableImage from "@/components/EditableImage"
import { Horse } from "@/components/HorseList"
import LoadingSpinner from "@/components/LoadingSpinner"
import { gql, useMutation, useQuery } from "@apollo/client"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useState } from "react"
import { FaHorseHead } from "react-icons/fa"

type Props = {}

const getHorseWhereQuery = gql`
query GetHorses($getHorseArgs: GetHorseArgs) {
  getHorses(GetHorseArgs: $getHorseArgs) {
    id
    name
    nickname
    after
    owner
    birthyear
    color
    category
    gender
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

const getColorsQuery = gql`
query GetColors {
  getColors {
    color
    createdAt
    id
    updatedAt
  }
}
`

const getGendersQuery = gql`
query GetGenders {
  getGenders {
    gender
    createdAt
    id
    updatedAt
  }
}
`

const getCategoriesQuery = gql`
query GetCategories {
  getCategories {
    category
    createdAt
    id
    updatedAt
  }
}
`

const updateHorseMutation = gql`
mutation UpdateHorse($HorseUpdateInput: HorseUpdateInput!, $HorseWhereUnique: HorseWhereUniqueInput!) {
  updateHorse(HorseUpdateInput: $HorseUpdateInput, HorseWhereUniqueInput: $HorseWhereUnique) {
    id
    name
    nickname
    after
    owner
    birthyear
    color
    category
    gender
    images {
      id
      url
      profile
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`

const Edit = (props: Props) => {
  const router = useRouter();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState('');
  const { data, error, loading } = useQuery(getHorseWhereQuery, {
    variables: {
      getHorseArgs: {
        where: {
          id: {
            equals: router.query.id
          }
        }
      }
    }
  });
  const [updateHorse, {
    loading: updateLoading
  }] = useMutation(updateHorseMutation);

  const { data: colorData, loading: colorLoading, error: colorError } = useQuery(getColorsQuery);
  const { data: genderData, loading: genderLoading, error: genderError } = useQuery(getGendersQuery);
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(getCategoriesQuery);

  const [updateData, setUpdateData] = useState({
    name: '',
    nickname: '',
    after: '',
    owner: '',
    birthyear: '',
    color: '',
    category: '',
    gender: ''
  })

  useEffect(() => {
    if (!loading && data) {
      setUpdateData({
        name: data.getHorses[0].name,
        nickname: data.getHorses[0].nickname,
        after: data.getHorses[0].after,
        owner: data.getHorses[0].owner,
        birthyear: data.getHorses[0].birthyear,
        color: data.getHorses[0].color,
        category: data.getHorses[0].category,
        gender: data.getHorses[0].gender
      })
    }
  }, [data, loading])

  if (loading || colorLoading || genderLoading || categoryLoading) {
    return (
      <LoadingSpinner />
    )
  }

  if (error || colorError || genderError || categoryError) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{JSON.stringify(error) || JSON.stringify(colorError) || JSON.stringify(genderError) || JSON.stringify(categoryError)}</span>
        </div>
      </div>
    )
  }

  const handleUpdate = async () => {
    const result = await updateHorse({
      variables: {
        horseUpdateInput: {
          name: {
            set: updateData.name
          },
          nickname: {
            set: updateData.nickname
          },
          owner: {
            set: updateData.owner
          },
          after: {
            set: updateData.after
          },
          birthyear: {
            set: updateData.birthyear
          },
          category: {
            set: updateData.category
          },
          color: {
            set: updateData.color
          },
          gender: {
            set: updateData.gender
          }
        },
        horseWhereUnique: {
          id: data.getHorses[0].id
        }
      },
      refetchQueries: ['GetHorses']
    })

    console.log(result);
    router.push('/Horses');
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageUploadLoading(true);

    if (e.target.files) {
      setUploadInfo(`Uploading file..`)
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('folder', data.getHorses[0].name.replaceAll(' ', ''));

      const result = await fetch('http://localhost:3000/image/upload', {
        method: 'POST',
        body: formData
      });

      const json = await result.json();

      if (result.status === 201) {
        setUploadInfo('Updating database..');
        const result = await updateHorse({
          variables: {
            horseUpdateInput: {
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
            horseWhereUnique: {
              id: data.getHorses[0].id
            }
          },
          refetchQueries: ['GetHorses']
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
              <Link href="/horses" className="flex gap-2">
                <FaHorseHead />
                Horses
              </Link>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Edit {data.getHorses[0].name}
            </li>
          </ul>
        </div>
      </div>
      {data.getHorses.map((horse: Horse) => {
        return (
          <div key={horse.id}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile</span>
              </label>
              <div className="avatar">
                <div className="w-full h-40">
                  <EditableImage horseId={horse.id} image={horse.images.filter((image) => image.profile == true)[0]} alt={`Profile image of ${horse.name}`} />
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Images</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {horse.images.filter((image) => image.profile === false).map((image) => {
                  return (
                    <EditableImage horseId={horse.id} key={image.id} image={image} alt={`Image of ${horse.name}`} />
                  )
                })}
              </div>
              <input onChange={async (e) => {
                await handleUpload(e);
              }} accept="image/*" type="file" className={`file-input file-input-bordered w-full ${horse.images.filter((image) => image.profile === false).length > 0 ? 'mt-5' : ''
                }`} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <label className="input-group">
                <input value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} type="text" placeholder={horse.name} className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nickname</span>
              </label>
              <label className="input-group">
                <input value={updateData.nickname} onChange={(e) => setUpdateData({ ...updateData, nickname: e.target.value })} type="text" placeholder={horse.nickname} className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Birthyear</span>
              </label>
              <label className="input-group">
                <input value={updateData.birthyear} onChange={(e) => setUpdateData({ ...updateData, birthyear: e.target.value })} type="text" placeholder={horse.birthyear} className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Owner</span>
              </label>
              <label className="input-group">
                <input value={updateData.owner} onChange={(e) => setUpdateData({ ...updateData, owner: e.target.value })} type="text" placeholder={horse.owner} className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">After</span>
              </label>
              <label className="input-group">
                <input value={updateData.after} onChange={(e) => setUpdateData({ ...updateData, after: e.target.value })} type="text" placeholder={horse.after} className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Color</span>
              </label>
              <label className="input-group">
                <select defaultValue={horse.color} onChange={(e) => setUpdateData({ ...updateData, color: e.target.value })} className="select select-bordered w-full">
                  {colorData.getColors.map((color: any, index: any) => {
                    return (
                      <option value={color.color} key={color.id}>{color.color}</option>
                    )
                  })}
                </select>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <label className="input-group">
                <select defaultValue={horse.gender} onChange={(e) => setUpdateData({ ...updateData, gender: e.target.value })} className="select select-bordered w-full">
                  {genderData.getGenders.map((gender: any, index: any) => {
                    return (
                      <option value={gender.gender} key={gender.id}>{gender.gender}</option>
                    )
                  })}
                </select>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <label className="input-group">
                <select defaultValue={horse.category} onChange={(e) => setUpdateData({ ...updateData, category: e.target.value })} className="select select-bordered w-full">
                  {categoryData.getCategories.map((category: any, index: any) => {
                    return (
                      <option value={category.category} key={category.id}>{category.category}</option>
                    )
                  })}
                </select>
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