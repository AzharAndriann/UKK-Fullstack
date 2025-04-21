// import { Bell } from 'lucide-react';
import dayjs from 'dayjs';
// import { useLocation } from 'react-router-dom';


const Navbar = () =>
{
   // const location = useLocation();
   // const currentPage = getPageName( location.pathname );
   function getGreeting (): string
   {
      const currentHour = dayjs().hour();

      if ( currentHour >= 1 && currentHour <= 11 )
      {
         return 'Good Morning';
      } else if ( currentHour >= 12 && currentHour <= 15 )
      {
         return 'Good Afternoon';
      } else if ( currentHour >= 16 && currentHour <= 18 )
      {
         return 'Good Evening';
      } else
      {
         return 'Good Night';
      }
   }

   // function getPageName ( pathname: string ): string
   // {
   //    switch ( pathname )
   //    {
   //       case '/':
   //          return 'Home';
   //       case '/archive':
   //          return 'Archive';
   //       default:
   //          return 'Unknown Page';
   //    }
   // }
   return (
      <div className="bg-slate-900 mt-5 me-5 rounded-xl">
         <div className="flex justify-between text-white p-4">
            <div className="flex ms-9 text-2xl font-semibold">Hello, { getGreeting() }</div>
            {/* <div className="relative me-9">
               <Bell size={ 28 } strokeWidth={ 2.5 } />
               <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-xs font-bold py-0.5 px-1 rounded-full">
                  12
               </span>
            </div> */}
         </div>
      </div>
   );
}

export default Navbar