import { useEffect } from "react";
import { RootState } from "../../features";
// import { usePositionAction } from "../../features/position/usePositionAction";
import { useAppDispatch, useAppSelector } from "../../hooks/store"

import { fetchOriginPositions } from "../../features/position/positionThunk";



export const OriginPositions = ({ originId }: { originId: number }) => {

    const dispatch = useAppDispatch();
    const { originPositions } = useAppSelector((state: RootState) => state.positions);

    const loading = useAppSelector((state: RootState) => state.positions.loading);

    // const { fetchPositions } = usePositionAction();

    useEffect(() => {
      
        if (originId) {
             
            dispatch(fetchOriginPositions({ originId }));

            
        }

    }, [dispatch, originId])

    useEffect(() => {
        console.log("CARGOS DE ORIGEN EN COMPONENTE ", originPositions);
    }, [originPositions]);   

    return (
        <div className="container max-w-5xl mt-5">

            <div className="left-0 top-0">
                <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-400 sm:text-xl">Cargos de Origen</h2>

            </div>
          
            <div className="w-full mt-4">
                <table className="w-full divide-y divide-gray-200">
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


                        </tr>

                    </thead>
                    <tbody >
                        {loading ? (<tr>
                            <td colSpan={4} className="text-center py-4 text-gray-500">
                                Cargando cargos ...
                            </td>
                        </tr>) : Array.isArray(originPositions) && originPositions.length > 0 ? (
                            originPositions.map((position) => (
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
                                        {position.pointsAvailable}
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
