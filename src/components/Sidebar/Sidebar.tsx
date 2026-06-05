// import { GrBusinessService } from "react-icons/gr";
import { FaSignOutAlt } from "react-icons/fa";
//import { LiaUserClockSolid } from "react-icons/lia";

//import { FaUserClock } from "react-icons/fa6";

//import { FiUsers } from 'react-icons/fi';
//import { PiTreeStructureDuotone } from "react-icons/pi";
//import { VscLibrary } from "react-icons/vsc";
//import { TbReport, TbTransformFilled } from "react-icons/tb";

import SidebarItem from './SidebarItem';
import { Button } from '../ui/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { logout } from '../../features/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminItems, ISidebarItem, userItems, invitedItems, developerItems } from "./sidebar.config";


import logo from "@/assets/unl.png";


const Sidebar = () => {

  const dispatch = useAppDispatch();

     const navigate = useNavigate();

    const location = useLocation();

    const from = location.state?.from?.pathname || "/login";

    const state = useAppSelector((state) => state);

    console.log("STATE COMPLETO", state);

   const role = useAppSelector((state) => state.auth.roles);

   console.log("ROLES DE SIDEBAR", role[4]);

   
   const items: ISidebarItem[] = [];

 // const items = role.includes("ROLE_ADMIN")? adminItems: userItems;

   if( role.includes("ROLE_ADMIN")) items.push(...adminItems);
   if( role.includes('ROLE_USER'))  items.push(...userItems);
   if( role.includes('ROLE_INVITED')) items.push(...invitedItems);
   if( role.includes('ROLE_DEVELOPER')) items.push(...developerItems);

  const handleLogout = () => {
      console.log("CIERRE");
       dispatch(logout());
       localStorage.clear();
       sessionStorage.clear();
       navigate('/login', { replace: true});
  }

  {/* <div className='flex justify-center'>
          <img className='h-10 w-fit' src='/src/assets/logo_fich.svg' alt="Logo" />

        </div> */}
  return (
    <>

      <aside className='p-2 w-64 shadow-md'>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Logo" className="h-16 w-fit" />

          </div>
        </div>

        { /* <!-- User Profile --> */}


        <nav className='mt-8'>
          {items.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))

          }
        </nav>
          <div className="relative bottom-1 flex justify-center mb-4">
    <Button
      onClick={handleLogout}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 px-6 font-dm text-base font-medium text-white shadow-xl shadow-green-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
    >
      <FaSignOutAlt />
      Salir
    </Button>
  </div>
      </aside>
    </>


  )
}


/*  const Sidebar = () => {

const isSidebarOpen = useAppSelector((state: RootState) => state.isSideBarOpen);
const dispatch = useAppDispatch();

return (
  <>
    {isSidebarOpen && (<div
      className="fade-in absolute top-0 left-0 w-screen 
      h-screen backdrop-blur-xs backdrop-filter z-10"
      onClick={() => dispatch(closeSidebar())}
    />)}
    <img className='h-10 w-fit' src="./src/assets/logo_fich.svg" alt="Logo" />
    <nav   className={clsx(
        "h-full w-[200px] px-3 bg-red-50 absolute top-0 -left-[200px] ",
        "transform transition-all duration-300 z-20",
        { "translate-x-[200px]": isSidebarOpen }
      )}>
      {items.map((item, index) => (
        <SidebarItem key={index} item={item} />
      ))

      }
    </nav>
  </>
)
} */



export default Sidebar;