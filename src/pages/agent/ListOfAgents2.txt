// import { useAgentAction } from "../../features/agent/useAgentAction";

import { Link } from "react-router-dom";
import { Spinner } from "../../components/ui/Spinner";
import { LuFilePen, LuTrash2 } from "react-icons/lu";

import { FaPlus } from "react-icons/fa";
import { useAgentInfinite } from "../../hooks/agent/useAgent";
//import { useMemo } from "react";


//import { AgentWithId } from "../../models/agent";
//import { Table } from "../../components/ui/Table";
//import { Info } from '../../models/info-page.d';
import InfiniteScroll from "react-infinite-scroll-component"
//import { AgentWithId } from "../../models/agent";


export const ListOfAgents2 = () => {

    const {
        agents,
        isLoading,

        // isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useAgentInfinite();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner></Spinner>
            </div>
        )
    }


    return (
        <div className="container max-w-6xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Información de Agentes
                </h2>

                <Link to={"/agente/create"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 px-6 font-dm text-base font-medium text-white shadow-xl shadow-green-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
>
                    Agregar <FaPlus />
                </Link>
            </div>

            {/* Tabla con scroll infinito */}
            <div
                id="scrollableDiv"
                className="w-full h-[75vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm"
            >
                <InfiniteScroll
                    dataLength={agents ? agents.results.length : 0}
                    next={fetchNextPage}
                    hasMore={!!hasNextPage}
                    loader={
                        <tr>
                            <td colSpan={6} className="py-4 text-center">
                                <Spinner />
                            </td>
                        </tr>
                    }
                // mantiene estructura semántica
                >
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Apellido - Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Dirección
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Teléfono
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Correo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">

                            {agents?.results?.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2 text-sm text-gray-700">{agent.id}</td>

                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        <div className="font-medium">{agent.lastname}</div>
                                        <div className="text-gray-500">{agent.firstname}</div>
                                    </td>

                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        {agent.address || "-"}
                                    </td>

                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        {agent.phone || "-"}
                                    </td>

                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        {agent.email || "-"}
                                    </td>

                                    <td className="px-4 py-2 text-center">
                                        <div className="flex justify-center gap-3 text-gray-600">
                                            <Link to={`/agente/edit/${agent.id}`}>
                                                <LuFilePen size={18} className="hover:text-blue-600" />
                                            </Link>
                                            <button>
                                                <LuTrash2 size={18} className="hover:text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </InfiniteScroll>
            </div>
        </div>
    );
};

/*  return (
     <div className='container max-w-5xl' >

         <div className="left-0 top-0">
             <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-400 sm:text-xl">Información de agentes</h2>

         </div>
         <div className="flex gap-4 pb-4">

             <Button className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#DAA520] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                 Agregar  <FaPlus /></Button>
         </div>
         <div className='w-full h-[80vh] overflow-y-auto'>

             <table className=" divide-y divide-gray-200">
                 <thead className="bg-[#d5d8d3]">
                     <tr>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">ID</th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Apellido - Nombre</th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-winder">Dirección</th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Telefono</th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Correo</th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Actions</th>
                     </tr>
                 </thead>

                 <tbody>
                
                         <InfiniteScroll
                             dataLength={agents ? agents.info.size : 0}
                             next={() => fetchNextPage()}
                             hasMore={!!hasNextPage}
                             loader={<Spinner></Spinner>}
                         >
                             {agents.results.map((agent) => (
                                 <tr key={agent.id}>
                                     <td className="px-6 py-2 whitespace-nowrap">
                                         <div className="flex items-center">
                                             <div className="ml-4">
                                                 <div className="text-sm font-medium text-gray-500">
                                                     {agent.id}
                                                 </div>
                                             </div>
                                         </div>
                                     </td>
                                     <td className="px-6 py-2 whitespace-nowrap">
                                         <div className="text-sm text-gray-500">
                                             {agent.lastname}
                                         </div>
                                         <div className="text-sm text-gray-900">
                                             {agent.firstname}
                                         </div>
                                     </td>
                                     <td className="px-6 py-3 whitespace-nowrap">
                                         <div className="text-sm text-gray-500">
                                             {agent.address}
                                         </div>
                                     </td>
                                     <td className="px-6 py-3 whitespace-nowrap">
                                         <div className="text-sm text-gray-500">
                                             {agent.phone}
                                         </div>
                                     </td>
                                     <td className="px-6 py-3 whitespace-nowrap">
                                         <div className="text-sm text-gray-500">
                                             {agent.email}
                                         </div>
                                     </td>
                                     <td className="p-6 py-4 font-medium text-gray-900 
                 dark:text-white break-words max-w-xs">
                                         <div className="grid grid-cols-2 gap-1">
                                             <Link to={`/agente/edit/${agent.id}`}>
                                                 <LuFilePen size={20} />
                                             </Link>
                                             <Link to={'#'}>
                                                 <LuTrash2 size={20} />
                                             </Link>
                                         </div>

                                     </td>
                                 </tr>))}

                         </InfiniteScroll>
                                    


                 </tbody>

             </table>



         </div>

     </div >

 ) */



