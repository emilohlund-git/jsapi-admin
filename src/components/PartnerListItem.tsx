import Image from "next/image"
import Link from "next/link"
import { AiOutlineDelete } from "react-icons/ai"
import { FiEdit } from "react-icons/fi"
import DeletePartnerModal from "./DeletePartnerModal"
import { Partner } from "./PartnerList"

type Props = {
  partner: Partner
}

const PartnerListItem: React.FC<Props> = ({ partner }) => {
  if (!partner) return <></>

  return (
    <div className="flex gap-4 border-2 border-slate-800 p-4 rounded-2xl" key={partner.id}>
      <input type="checkbox" id={"modal-" + partner.name} className="modal-toggle" />
      <DeletePartnerModal partner={partner} />
      <div className="avatar">
        <div className="w-24">
          {partner.image ?
            <Image className="rounded-lg" src={partner.image.url} alt={`Image of ${partner.name}`} width={100} height={100} />
            : <></>}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 overflow-hidden">
        <div className="flex items-center gap-4 justify-between">
          <h2 className="text-2xl font-bold truncate">{partner.name}</h2>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col overflow-hidden">
            <span className="truncate">{partner.description}</span>
          </div>
          <div className="flex self-end gap-2">
            <Link href={{
              pathname: 'partners/edit',
              query: {
                id: partner.id
              }
            }} className="btn btn-outline">
              <FiEdit className="text-xl" />
            </Link>
            <label htmlFor={"modal-" + partner.name} className="btn btn-outline btn-error">
              <AiOutlineDelete className="text-xl" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerListItem