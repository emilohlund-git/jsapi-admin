import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsHouses } from 'react-icons/bs';
import { FaHorseHead } from 'react-icons/fa';
import { FiSettings, FiUsers } from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';

const MenuItems = [
  {
    icon: <MdOutlineDashboard className="text-2xl" />,
    route: '/'
  },
  {
    icon: <FaHorseHead className="text-2xl" />,
    route: '/horses'
  },
  {
    icon: <BsHouses className="text-2xl" />,
    route: '/facilities'
  },
  {
    icon: <FiUsers className="text-2xl" />,
    route: '/partners'
  },
  {
    icon: <FiSettings className="text-2xl" />,
    route: '/settings'
  }
]

type Props = {}

const BottomNavigation = (props: Props) => {
  const { pathname } = useRouter();

  return (
    <div className="btm-nav">
      {MenuItems.map((item, index) => {
        return (
          <Link className={item.route === pathname ? 'active bg-white bg-opacity-5 transition-all' : ''} href={item.route} key={index}>
            {item.icon}
          </Link>
        )
      })}
    </div>
  )
}

export default BottomNavigation