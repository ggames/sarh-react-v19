import { useEffect } from "react";
import { RootState } from "../../features";
import { fetchPositions } from "../../features/position/positionThunk";
import { useAppDispatch, useAppSelector } from "../../hooks/store"
import { Link } from "react-router-dom";
import { LuFilePen, LuTrash2 } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";


export const ListPositions = () => {

   const dispatch = useAppDispatch();
   const { positions } = useAppSelector((state: RootState) => state.positions);
   const loading = useAppSelector((state: RootState) => state.positions.loading);


   useEffect(() => {
      dispatch(fetchPositions());
   }, [dispatch]);

   return (
      <div className="container max-w-6xl mx-auto px-4 py-6">

          <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Información de Cargos
                </h2>

                <Link to={"/cargo/create"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 px-6 font-dm text-base font-medium text-white shadow-xl shadow-green-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
>
                    Agregar <FaPlus />
                </Link>
            </div>


         <div  className="w-full h-[75vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm" >
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-[#d5d8d3]">

                  <tr>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Id
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departamento - Cargo
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado Cargo
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ptos Disp
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                     </th>

                  </tr>

               </thead>
               <tbody >
                  {loading ? (<tr>
                     <td colSpan={4} className="text-center py-4 text-gray-500">
                        Cargando cargos ...
                     </td>
                  </tr>) : Array.isArray(positions) && positions.length > 0 ? (
                     positions.map((position) => (
                        <tr key={position.id} className="bg-white even:bg-gray-50 hover:bg-gray-100">
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">

                                 <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                       {position.id}
                                    </div>

                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                 {position.nameUnit}
                              </div>
                              <div className="text-sm text-gray-900">{position.namePosition}</div>

                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                 {position.positionStatus}
                              </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Math.floor(position.pointsAvailable * position.amountPoint / 100)}
                           </td>
                           <td className="p-6 py-4 font-medium text-gray-900 
                    dark:text-white break-words max-w-xs">
                              <div className="flex justify-center gap-3 text-gray-600">
                                 <Link to={`/cargo/edit/${position.id}`}>
                                      <LuFilePen size={18} className="hover:text-blue-600" />
                                 </Link>
                                 <Link to={'#'}>
                                    <LuTrash2 size={20} />
                                 </Link>
                              </div>

                           </td>

                        </tr>)))
                     : (<tr>
                        <td colSpan={4} className="text-center py-4 text-gray-500">
                           No hay cargos de origen.
                        </td>
                     </tr>)

                  }

               </tbody>
            </table>

         </div>

      </div>

   )
}
