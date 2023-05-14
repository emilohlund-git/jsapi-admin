import Image from "next/image"
import Link from "next/link"
import { AiOutlineDelete } from "react-icons/ai"
import { FiEdit } from "react-icons/fi"
import DeleteFacilityModal from "./DeleteFacilityModal"
import { Facility } from "./FacilityList"

type Props = {
  facility: Facility
}

const FacilityListItem: React.FC<Props> = ({ facility }) => {
  if (!facility) return <></>

  return (
    <div className="flex gap-4 border-2 border-slate-800 p-4 rounded-2xl" key={facility.id}>
      <input type="checkbox" id={"modal-" + facility.name} className="modal-toggle" />
      <DeleteFacilityModal facility={facility} />
      <div className="avatar">
        <div className="w-24">
          {facility.images?.filter((image) => image.profile === true).length > 0 ?
            <Image className="rounded-lg" src={facility.images?.filter((image) => image.profile == true)[0].url} alt={`Image of ${facility.name}`} width={100} height={100} />
            : <></>}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 overflow-hidden">
        <div className="flex items-center gap-4 justify-between">
          <h2 className="text-2xl font-bold truncate">{facility.name}</h2>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col overflow-hidden">
            <span className="truncate">{facility.description}</span>
          </div>
          <div className="flex self-end gap-2">
            <Link href={{
              pathname: 'facilities/edit',
              query: {
                id: facility.id
              }
            }} className="btn btn-outline">
              <FiEdit className="text-xl" />
            </Link>
            <label htmlFor={"modal-" + facility.name} className="btn btn-outline btn-error">
              <AiOutlineDelete className="text-xl" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacilityListItem