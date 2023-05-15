import Dropzone, { DropFile } from "@/components/Dropzone"
import LoadingSpinner from "@/components/LoadingSpinner"
import { gql, useMutation, useQuery } from "@apollo/client"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"
import { FormEvent, useState } from "react"
import { FaHorseHead } from "react-icons/fa"

type Props = {}

const colorQuery = gql`
     query GetColors {
      getColors {
        color
        createdAt
        id
        updatedAt
      }
    }
`

const genderQuery = gql`
     query GetGenders {
      getGenders {
        gender
        createdAt
        id
        updatedAt
      }
    }
`

const categoryQuery = gql`
     query GetCategories {
      getCategories {
        category
        createdAt
        id
        updatedAt
      }
    }
`

const createHorseMutation = gql`
mutation CreateHorse($horseCreateInput: HorseCreateInput!) {
  createHorse(HorseCreateInput: $horseCreateInput) {
    after
    birthyear
    category
    color
    createdAt
    gender
    id
    images {
      createdAt
      id
      profile
      updatedAt
      url
    }
    name
    nickname
    owner
    updatedAt
  }
}
`

const Create = (props: Props) => {
  const [files, setFiles] = useState<DropFile[]>([]);
  const [uploadInfo, setUploadInfo] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const { data: colorData, loading: colorLoading } = useQuery(colorQuery);
  const { data: genderData, loading: genderLoading } = useQuery(genderQuery);
  const { data: categoryData, loading: categoryLoading } = useQuery(categoryQuery);
  const [createHorse] = useMutation(createHorseMutation);

  const [createData, setCreateData] = useState({
    name: '',
    nickname: '',
    birthyear: '',
    owner: '',
    after: '',
    color: '',
    gender: '',
    category: ''
  })

  if (genderLoading || categoryLoading || colorLoading) {
    return (
      <LoadingSpinner />
    )
  }

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    type URLFILE = {
      url: string;
      profile?: boolean;
      fileId: string;
    }

    const filesData: URLFILE[] = [];

    setCreateLoading(true);

    for (let i = 0; i < files.length; i++) {
      setUploadInfo(`Uploading file ${i + 1} out of ${files.length}..`)
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('folder', createData.name.replaceAll(' ', ''));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const json: {
        AITags?: string;
        fileId: string;
        filePath: string;
        fileType: string;
        height: number;
        name: string;
        size: number;
        thumbnailUrl: string;
        url: string;
        versionInfo: {
          id: string;
          name: string;
        }
        width: number;
      } = await response.json();

      filesData.push({
        url: json.url,
        fileId: json.fileId
      });

      if (response.status === 201) continue
      else return;
    }

    setUploadInfo('Saving horse to database.');

    filesData[0].profile = true;

    await createHorse({
      variables: {
        horseCreateInput: {
          ...createData,
          images: {
            createMany: {
              data: filesData
            }
          }
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: ['GetHorses']
    }).then(() => {
      setCreateLoading(false);
      setCreateData({
        name: '',
        nickname: '',
        birthyear: '',
        owner: '',
        after: '',
        color: '',
        gender: '',
        category: ''
      });
      setFiles([]);
    });
  }

  return (
    <>
      {createLoading ?
        <div className="flex flex-col gap-4 justify-center items-center z-20 bg-black bg-opacity-40 fixed w-full h-screen">
          <span>{uploadInfo}</span>
          <progress className="progress w-56 progress-error"></progress>
        </div>
        : <></>}
      <div className="p-4 flex flex-col gap-y-8 pb-36">
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
                Create
              </li>
            </ul>
          </div>
        </div>
        <form onSubmit={(e) => handleCreate(e)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Images</span>
            </label>
            <div className="flex gap-4 flex-wrap">
              <Dropzone files={files} setFiles={setFiles} />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <label className="input-group">
              <input value={createData.name} required onChange={(e) => setCreateData({ ...createData, name: e.target.value })} type="text" placeholder={'Name..'} className="input input-bordered w-full" />
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nickname</span>
            </label>
            <label className="input-group">
              <input value={createData.nickname} required onChange={(e) => setCreateData({ ...createData, nickname: e.target.value })} type="text" placeholder={'Nickname..'} className="input input-bordered w-full" />
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Birthyear</span>
            </label>
            <label className="input-group">
              <input value={createData.birthyear} required onChange={(e) => setCreateData({ ...createData, birthyear: e.target.value })} type="number" placeholder={'1957'} className="input input-bordered w-full" />
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Owner</span>
            </label>
            <label className="input-group">
              <input value={createData.owner} required onChange={(e) => setCreateData({ ...createData, owner: e.target.value })} type="text" placeholder={'Owner..'} className="input input-bordered w-full" />
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">After</span>
            </label>
            <label className="input-group">
              <input value={createData.after} required onChange={(e) => setCreateData({ ...createData, after: e.target.value })} type="text" placeholder={'After..'} className="input input-bordered w-full" />
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Color</span>
            </label>
            <label className="input-group">
              <select defaultValue={''} required onChange={(e) => setCreateData({ ...createData, color: e.target.value })} className="select select-bordered w-full">
                <option value='' disabled>Choose color</option>
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
              <select defaultValue={''} required onChange={(e) => setCreateData({ ...createData, gender: e.target.value })} className="select select-bordered w-full">
                <option value='' disabled>Choose gender</option>
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
              <select defaultValue={''} required onChange={(e) => setCreateData({ ...createData, category: e.target.value })} className="select select-bordered w-full">
                <option value='' disabled>Choose category</option>
                {categoryData.getCategories.map((category: any, index: any) => {
                  return (
                    <option value={category.category} key={category.id}>{category.category}</option>
                  )
                })}
              </select>
            </label>
          </div>
          <div className="fixed flex bottom-20 right-4">
            <button type="submit" className={`btn w-full btn-error bottom-20 ${createLoading ? 'loading' : ''}`}>Create horse</button>
          </div>
        </form>
      </div>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Create;
