
import { useEffect } from "react";
import { RootState } from "../../features";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { fetchTransformations } from "../../features/transformation/transformationThunk";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Spinner } from "../../components/ui/Spinner";
import { LuTrash2 } from "react-icons/lu";

export const ListOfTransformations = () => {

  const dispatch = useAppDispatch();

  const { transformations, loading } = useAppSelector((state: RootState) => state.transformations);

  useEffect(() => {
    dispatch(fetchTransformations());
  }, [])

  return (
    <div>
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Información de Transformación
          </h2>

          <Link
            to={"/transformacion"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 px-6 font-dm text-base font-medium text-white shadow-xl shadow-green-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
          >
            Agregar <FaPlus />
          </Link>
        </div>

        <div
          id="scrollableDiv"
          className="w-full h-[75vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#d5d8d3]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider"
                >
                  ID
                </th>
               
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-winder"
                >
                  Resolución
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider"
                >
                  Fecha Resolución
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider"
                >
                  Descripción
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="items-center">
                    <Spinner></Spinner>
                  </td>
                </tr>
              ) : Array.isArray(transformations) &&
                transformations.length > 0 ? (
                transformations.map((transformation) => (
                  <tr key={transformation.id}>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-500">
                            {transformation.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        { transformation.resolutionNumber}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {transformation.date} 
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {transformation.reason} 
                      </div>
                    </td>

                    <td
                      className="p-6 py-4 font-medium text-gray-900 
                    dark:text-white break-words max-w-xs"
                    >
                      <div className="flex justify-center gap-3 text-gray-600">
                     
                        <Link to={"#"}>
                          <LuTrash2 size={20} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


