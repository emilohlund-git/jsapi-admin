import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

type Props = {
  image: any;
  alt: string;
  horseId?: string;
  facilityId?: string;
  partnerId?: string;
}

const setProfileMutation = gql`
mutation SetProfile($imageWhereUniqueInput: ImageWhereUniqueInput!, $facilityWhereUniqueInput: FacilityWhereUniqueInput, $horseWhereUniqueInput: HorseWhereUniqueInput) {
  setProfile(ImageWhereUniqueInput: $imageWhereUniqueInput, FacilityWhereUniqueInput: $facilityWhereUniqueInput, HorseWhereUniqueInput: $horseWhereUniqueInput) {
    createdAt
    id
    profile
    updatedAt
    url
  }
}
`;

const deleteImageMutation = gql`
mutation DeleteImage($imageWhereUniqueInput: ImageWhereUniqueInput!) {
  deleteImage(ImageWhereUniqueInput: $imageWhereUniqueInput) {
    createdAt
    id
    profile
    updatedAt
    url
  }
}
`;

const EditableImage: React.FC<Props> = ({ image, alt, horseId, facilityId, partnerId }) => {
  const [setProfile] = useMutation(setProfileMutation);
  const [deleteImage, {
    loading
  }] = useMutation(deleteImageMutation);
  const [profileLoading, setProfileLoading] = useState(false);

  console.log(image);

  const handleSetProfile = async () => {
    setProfileLoading(true);
    const result = await setProfile({
      variables: {
        imageWhereUniqueInput: {
          id: image.id
        },
        horseWhereUniqueInput: {
          id: horseId
        },
        facilityWhereUniqueInput: {
          id: facilityId
        },
        partnerWhereUniqueInput: {
          id: partnerId
        }
      },
      refetchQueries: ['GetHorses', 'GetFacilities', 'GetPartners']
    })
    setProfileLoading(false);
    console.log(result);
  }

  const handleDelete = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/image/${image.fileId}`, {
      method: 'DELETE',
    }).then(async () => {
      const result = await deleteImage({
        variables: {
          imageWhereUniqueInput: {
            id: image.id
          }
        },
        refetchQueries: ['GetHorses', 'GetFacilities', 'GetPartners']
      })

      console.log(result);
    }).catch((exception) => {
      console.error(exception);
    });
  }

  return (
    <div className="w-full h-40 relative">
      {image ?
        <>
          <div className="flex self-end gap-2 z-10 absolute bottom-2 right-2">
            <button onClick={() => handleSetProfile()} disabled={image.profile} className={`btn ${profileLoading ? 'loading' : ''}`}>
              {profileLoading ? <></> :
                <CgProfile className="text-xl" />
              }
            </button>
            <button onClick={() => handleDelete()} className={`btn btn-error ${loading ? 'loading' : ''}`}>
              <AiOutlineDelete className="text-xl" />
            </button>
          </div>
          <Image fill className="rounded-lg object-cover border-[1px] border-slate-500" src={image.url} alt={alt} />
        </>
        : <></>}
    </div>
  )
}

export default EditableImage