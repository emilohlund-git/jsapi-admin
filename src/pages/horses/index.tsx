import HorseList from "@/components/HorseList";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

type Props = {}

const Horses = (props: Props) => {
  return (
    <div className="p-4 flex flex-col gap-y-2">
      <HorseList />
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Horses