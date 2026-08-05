// ListOfAgents2.tsx
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../../components/ui/Spinner";
import { LuFilePen, LuTrash2 } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useAgentInfinite } from "../../hooks/agent/useAgent";
import InfiniteScroll from "react-infinite-scroll-component";
import { Autocomplete } from "../../components/Autocomplete";
import { AgentWithId } from "@/models/agent";



// ---------- función que filtra agentes localmente ----------
// Si preferís buscar en el backend, reemplazá esta función por un fetch real.
function buildFetchAgents(allAgents: AgentWithId[]) {
    return async (query: string): Promise<AgentWithId[]> => {
        const q = query.toLowerCase();
        return allAgents.filter(
            (a) =>
                a.lastname?.toLowerCase().includes(q) ||
                a.firstname?.toLowerCase().includes(q) ||
                String(a.id).includes(q)
        );
    };
}

export const ListOfAgents2 = () => {
    const { agents, isLoading, hasNextPage, fetchNextPage } = useAgentInfinite();

    // agente seleccionado en el autocomplete para resaltar / filtrar
    const [selectedAgent, setSelectedAgent] = useState<AgentWithId | null>(null);
    // texto libre del autocomplete (para saber si hay una búsqueda activa)
    const [searchQuery, setSearchQuery] = useState("");

    // lista final que se muestra en la tabla
    const allAgents: AgentWithId[] = agents?.results ?? [];
    const displayedAgents =
        selectedAgent
            ? allAgents.filter((a) => a.id === selectedAgent.id)
            : searchQuery.length >= 1
            ? allAgents.filter((a) => {
                  const q = searchQuery.toLowerCase();
                  return (
                      a.lastname?.toLowerCase().includes(q) ||
                      a.firstname?.toLowerCase().includes(q) ||
                      String(a.id).includes(q)
                  );
              })
            : allAgents;

    // fetchItems memoizado para el Autocomplete
    const fetchItems = useCallback(
        (query: string) => buildFetchAgents(allAgents)(query),
        [allAgents]
    );

    const handleSelect = (agent: AgentWithId) => {
        setSelectedAgent(agent);
        setSearchQuery(`${agent.lastname}, ${agent.firstname}`);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (value === "") setSelectedAgent(null);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSelectedAgent(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto px-4 py-6">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Información de Agentes
                </h2>

                <Link
                    to="/agente/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 px-6 font-dm text-base font-medium text-white shadow-xl shadow-green-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                >
                    Agregar <FaPlus />
                </Link>
            </div>

            {/* ── Barra de búsqueda ───────────────────────────────────────── */}
            <div className="mb-4 flex items-center gap-2">
                <Autocomplete<AgentWithId>
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onSelect={handleSelect}
                    fetchItems={fetchItems}
                    placeholder="Buscar por apellido, nombre o ID…"
                    debounceMs={200}
                    minChars={1}
                    className="flex-1"
                    inputClassName="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    renderItem={(agent, highlighted) => (
                        <div
                            className={`flex items-center gap-3 ${
                                highlighted ? "text-green-700 font-medium" : "text-gray-700"
                            }`}
                        >
                            <span className="text-xs text-gray-400 w-8 shrink-0">
                                #{agent.id}
                            </span>
                            <span>
                                {agent.lastname}, {agent.firstname}
                            </span>
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
                    {displayedAgents.length === 0
                        ? "Sin resultados para la búsqueda."
                        : `Mostrando ${displayedAgents.length} resultado${
                              displayedAgents.length !== 1 ? "s" : ""
                          }.`}
                </p>
            )}

            {/* ── Tabla con scroll infinito ───────────────────────────────── */}
            <div
                id="scrollableDiv"
                className="w-full h-[70vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm"
            >
                <InfiniteScroll
                    dataLength={displayedAgents.length}
                    next={fetchNextPage}
                    // Solo paginamos cuando no hay búsqueda activa
                    hasMore={!searchQuery && !!hasNextPage}
                    loader={
                        <tr>
                            <td colSpan={6} className="py-4 text-center">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                {["ID", "Apellido - Nombre", "Dirección", "Teléfono", "Correo", "Acciones"].map(
                                    (col) => (
                                        <th
                                            key={col}
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                        >
                                            {col}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">
                            {displayedAgents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-10 text-center text-sm text-gray-400"
                                    >
                                        {searchQuery.length >= 1
                                            ? "No se encontraron agentes con ese criterio."
                                            : "No hay agentes disponibles."}
                                    </td>
                                </tr>
                            ) : (
                                displayedAgents.map((agent) => (
                                    <tr
                                        key={agent.id}
                                        className={`hover:bg-gray-50 transition-colors ${
                                            selectedAgent?.id === agent.id
                                                ? "bg-green-50 ring-1 ring-inset ring-green-200"
                                                : ""
                                        }`}
                                    >
                                        <td className="px-4 py-2 text-sm text-gray-700">
                                            {agent.id}
                                        </td>

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
                                                    <LuFilePen
                                                        size={18}
                                                        className="hover:text-blue-600"
                                                    />
                                                </Link>
                                                <button>
                                                    <LuTrash2
                                                        size={18}
                                                        className="hover:text-red-600"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </InfiniteScroll>
            </div>
        </div>
    );
};