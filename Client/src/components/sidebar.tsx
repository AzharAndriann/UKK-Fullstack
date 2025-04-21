import { Archive, House } from "lucide-react";
import { useLocation } from "react-router-dom";

const Sidebar = () =>
{
   const location = useLocation();
   const currentPath = location.pathname;

   const isActive = ( path: string ) =>
      currentPath === path
         ? "bg-slate-700"
         : "bg-slate-800 bg-opacity-20 hover:bg-slate-700 duration-500"

   return (
      <div className="bg-slate-900 w-[250px] m-5 rounded-xl">
         <div className="text-white flex justify-center items-center text-2xl font-bold mt-5">
            To Do List
         </div>
         <a href="/">
            <div className={ `flex gap-3 m-3 ps-4 py-2 rounded-md text-white ${ isActive( "/" ) }` }>
               <House />
               Home
            </div>
         </a>
         <a href="/archive">
            <div className={ `flex gap-3 m-3 ps-4 py-2 rounded-md text-white ${ isActive( "/archive" ) }` }>
               <Archive />
               Archive
            </div>
         </a>
      </div>
   )
}

export default Sidebar;
