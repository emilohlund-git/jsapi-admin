import Image from "next/image"
import Link from "next/link"
import { AiOutlineDelete } from "react-icons/ai"
import { FiEdit } from "react-icons/fi"
import DeleteHorseModal from "./DeleteHorseModal"
import { Horse } from "./HorseList"

type Props = {
  horse: Horse
}

const HorseListItem: React.FC<Props> = ({ horse }) => {
  if (!horse) return <></>

  return (
    <div className="flex gap-4 border-2 border-slate-800 p-4 rounded-2xl" key={horse.id}>
      <input type="checkbox" id={"modal-" + horse.name} className="modal-toggle" />
      <DeleteHorseModal horse={horse} />
      <div className="avatar">
        <div className="w-24">
          {horse.images?.filter((image) => image.profile === true).length > 0 ?
            <Image className="rounded-lg" src={horse.images?.filter((image) => image.profile == true)[0].url} alt={`Image of ${horse.name}`} width={100} height={100} />
            : <></>}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 overflow-hidden">
        <div className="flex items-center gap-4 justify-between">
          <h2 className="text-2xl font-bold truncate">{horse.name}</h2>
          <div className="badge badge-secondary rounded-md badge-outline">{horse.category}</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <span>{horse.nickname}</span>
            <span>{horse.gender}</span>
          </div>
          <div className="flex self-end gap-2">
            <Link href={{
              pathname: 'horses/edit',
              query: {
                id: horse.id
              }
            }} className="btn btn-outline">
              <FiEdit className="text-xl" />
            </Link>
            <label htmlFor={"modal-" + horse.name} className="btn btn-outline btn-error">
              <AiOutlineDelete className="text-xl" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HorseListItem