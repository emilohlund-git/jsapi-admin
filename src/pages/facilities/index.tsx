import FacilityList from "@/components/FacilityList"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

type Props = {}

const facilities = (props: Props) => {
  return (
    <div className="p-4 flex flex-col gap-y-2">
      <FacilityList />
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default facilities