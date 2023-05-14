import PartnerList from "@/components/PartnerList";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

type Props = {}

const Partners = (props: Props) => {
  return (
    <div className="p-4 flex flex-col gap-y-2">
      <PartnerList />
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Partners