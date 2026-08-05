import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { fetchAllUsers } from "../../features/user/userThunk";
import { LuFilePen, LuTrash2 } from "react-icons/lu";
import { UserResponse } from "@/models/user";
import Autocomplete from "@/components/Autocomplete";

function buildFetchUsers (allUsers: UserResponse[]){
    return async (query:string) => {
        const q = query.toLowerCase();
        return allUsers.filter( user => {
            user.username.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
            || String(user.id).includes(q);
        })

    }
}

export function ListOfUsers() {

    const { users, loading } = useAppSelector((state) => state.users);

    const dispatch = useAppDispatch();

    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    
    const allUsers: UserResponse[] = users?? [];
    
    const displayedUsers = selectedUser ? allUsers.filter( (u) => u.id === selectedUser.id)
                   : searchQuery.length >= 1 ? 
                   allUsers.filter( (u) => {
                    const q = searchQuery.toLowerCase();
                    return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
                    || String(u.id).includes(q);
                   })
                   : allUsers;

    const fetchUsers = async (query: string):Promise<UserResponse[]> => {
        const q = query.toLowerCase();
        return allUsers.filter(user => user.username.toLowerCase().includes(q)
                     || user.email.toLowerCase().includes(q) || String(user.id).includes(q));
        
    }

    const handleSelectUser = (user: UserResponse | null ) => {
        setSelectedUser(user);
        setSearchQuery(`${user?.username} , (${user?.email})`);
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if(value === "") setSelectedUser(null);
    }

    const clearSearch = () => {
        setSearchQuery("");
    }

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, []);

    return (
        <div className="container max-w-6xl mx-auto px-4 py-6">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Información de Usuarios
                </h2>

                <Link to={"/register/create"} className="inline-flex items-center justify-center gap-2 rounded-xl 
                        bg-green-600 py-3 px-6 font-dm text-base font-medium text-white shadow-xl 
                        shadow-green-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                >
                    Agregar <FaPlus />
                </Link>
            </div>
 
            <div className="mb-4 flex items-center gap-2">
                <Autocomplete<UserResponse> 
                 value={searchQuery}
                 onChange={handleSearchChange}
                 onSelect={handleSelectUser}
                 fetchItems={fetchUsers}
                 placeholder="Buscar por nombre de usuario, email o ID..."
                 debounceMs={200}
                 minChars={1}
                 className="flex-1"
                 inputClassName="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 renderItem={(user, highlighted) => (
                    <div className={`p-2 ${highlighted ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}>
                        {user.username} ({user.email})
                    </div>
                 )}
               
                 />
                      {/* Botón para limpiar búsqueda */}
                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 transition"
                        title="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
            </div>
               {/* ── Contador de resultados ──────────────────────────────────── */}
            {searchQuery.length >= 1 && (
                <p className="mb-2 text-xs text-gray-500">
                    {displayedUsers.length === 0
                        ? "Sin resultados para la búsqueda."
                        : `Mostrando ${displayedUsers.length} resultado${displayedUsers.length !== 1 ? "s" : ""
                        }.`}
                </p>
            )}


            <div className="w-full h-[75vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm" >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#d5d8d3]">

                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Id
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Roles
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>

                        </tr>

                    </thead>
                    <tbody >
                        {loading ? (<tr>
                            <td colSpan={4} className="text-center py-4 text-gray-500">
                                Cargando cargos ... {loading}
                            </td>
                        </tr>) : displayedUsers && displayedUsers.length > 0 ? (
                            displayedUsers.map((user) => (
                                <tr key={user.id} className="bg-white even:bg-gray-50 hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">

                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.id}
                                                </div>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {user.username}
                                        </div>

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {user.email}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {Array.isArray(user.roles)
                                                ? user.roles
                                                    .map((r) => r.roleEnum)
                                                    .join(", ")
                                                : "Sin roles"}
                                        </td>
                                    </td>
                                    <td className="p-6 py-4 font-medium text-gray-900 
                    dark:text-white break-words max-w-xs">
                                        <div className="grid grid-cols-2 gap-1">
                                            <Link to={`/register/edit/${user.id}`}>
                                                <LuFilePen size={20} />
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

    );
}