import Dropzone, { DropFile } from "@/components/Dropzone"
import { gql, useMutation } from "@apollo/client"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { FiUsers } from "react-icons/fi"

type Props = {}

const createPartnerMutation = gql`
mutation CreatePartner($partnerCreateInput: PartnerCreateInput!) {
  createPartner(PartnerCreateInput: $partnerCreateInput) {
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

const Create = (props: Props) => {
  const router = useRouter();
  const [files, setFiles] = useState<DropFile[]>([]);
  const [uploadInfo, setUploadInfo] = useState('');

  const [createLoading, setCreateLoading] = useState(false);
  const [createPartner] = useMutation(createPartnerMutation);

  const [createData, setCreateData] = useState({
    name: '',
    description: '',
    website: '',
  })

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    type URLFILE = {
      url: string;
      profile?: boolean;
      fileId: string;
    }

    const filesData: URLFILE[] = [];

    setCreateLoading(true);

    setUploadInfo(`Uploading file..`)
    const formData = new FormData();
    formData.append('file', files[0]);
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
      fileId: json.fileId,
      profile: true
    });

    if (response.status === 201) {

      setUploadInfo('Saving partner to database.');

      await createPartner({
        variables: {
          partnerCreateInput: {
            ...createData,
            image: {
              create: {
                ...filesData[0]
              }
            }
          },
        },
        refetchQueries: ['ROOT_QUERY']
      }).then(() => {
        setCreateLoading(false);
        router.push('/partners');
      });
    }
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
                <Link href="/partners" className="flex gap-2">
                  <FiUsers />
                  Partners
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
              <span className="label-text">Description</span>
            </label>
            <label className="input-group">
              <textarea value={createData.description} onChange={(e) => setCreateData({ ...createData, description: e.target.value })} placeholder={'Description..'} className="textarea textarea-bordered w-full" />
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Website</span>
            </label>
            <label className="input-group">
              <input value={createData.website} onChange={(e) => setCreateData({ ...createData, website: e.target.value })} type="text" placeholder={'Website..'} className="input input-bordered w-full" />
            </label>
          </div>
          <div className="fixed flex bottom-20 right-4">
            <button type="submit" className={`btn w-full btn-error bottom-20 ${createLoading ? 'loading' : ''}`}>Create partner</button>
          </div>
        </form>
      </div>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Create;
