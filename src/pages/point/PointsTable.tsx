import { useEffect, useState } from "react";
import { RootState } from "../../features";
import { useAppDispatch, useAppSelector } from "../../hooks/store"
import { fetchPoints, updatePoint } from "../../features/point/pointThunk";
import { Spinner } from "../../components/ui/Spinner";
import { LuFilePen } from "react-icons/lu";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PointWithId } from "@/models/point";
import { Autocomplete } from "@/components/Autocomplete";

// === función para filtrar la tabla de puntos ===
function buildFetchPoints(allPoints: PointWithId[]) {

    return async (query: string) => {
        const q = query.toLowerCase();
        return allPoints.filter(p => p.namePosition.toLowerCase().includes(q)
            || String(p.positionCode).includes(q)
            || String(p.id).includes(q));
    }

}

export const PointsTable = () => {

    interface RowData {
        id: number;
        amountPoint: number;
    }

    const dispatch = useAppDispatch();

    const { points, loading } = useAppSelector((state: RootState) => state.points);
    const [editingCell, setEditingCell] = useState<{ id: number; field: keyof RowData } | null>(null);
    const [editedvalue, setEditedValue] = useState<string>("");
    //  const [isDirty, setIsDirty] = useState(false);

    const [selectedPoint, setSelectedPoint] = useState<PointWithId | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const allPoints: PointWithId[] = points ?? [];
    const displayedPoints = selectedPoint ? allPoints.filter(p => p.id === selectedPoint.id) :
        searchQuery.length >= 1
            ? allPoints.filter((p) => p.namePosition.toLowerCase().includes(searchQuery.toLowerCase())
                || String(p.positionCode).includes(searchQuery)
                || String(p.id).includes(searchQuery))
            : allPoints;

    const fetchItems = async (query: string): Promise<PointWithId[]> => {
        const q = query.toLowerCase();
        return allPoints.filter(p => p.namePosition.toLowerCase().includes(q)
            || String(p.positionCode).includes(q)
            || String(p.id).includes(q));
    };

    const handleSelect = (point: PointWithId | null) => {
        setSelectedPoint(point);
        setSearchQuery(`${point?.namePosition}, ${point?.namePosition}`);
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (value === "") setSelectedPoint(null);
    }

    const clearSearch = () => {
        setSearchQuery("");
        setSelectedPoint(null);
    }

    useEffect(() => {
        dispatch(fetchPoints());
    }, [dispatch, setEditingCell]);

    const handleDoubleClick = (id: number, field: keyof RowData, currentValue: string) => {
        setEditingCell({ id, field });
        setEditedValue(currentValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedValue(e.target.value);

    };

    const handleSave = async (id: number) => {
        if (!editedvalue.trim()) return;

        await dispatch(updatePoint({
            point_id: id,
            amount_point: { amountPositionNew: Number(editedvalue) }
        }));

        //dispatch(fetchPoints());
        setEditingCell(null);

    }

    return (
        <div className="mt-4 ">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Tipos de cargos
                </h2>
            </div>
            {/* ── Barra de búsqueda ───────────────────────────────────────── */}
            <div className="mb-4 flex items-center gap-2">

                <Autocomplete<PointWithId>
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onSelect={handleSelect}
                    fetchItems={fetchItems}
                    placeholder="Buscar por nombre de cargo, código o ID…"
                    debounceMs={200}
                    minChars={1}
                    className="flex-1"
                    inputClassName="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    renderItem={(point, highlighted) => (
                        <div
                            className={`flex items-center gap-3 ${highlighted ? "text-green-700 font-medium" : "text-gray-700"
                                }`}
                        >
                            <span className="text-xs text-gray-400 w-8 shrink-0">
                                #{point.id}
                            </span>
                            <span>
                                {point.namePosition}, {point.positionCode}
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
                    {displayedPoints.length === 0
                        ? "Sin resultados para la búsqueda."
                        : `Mostrando ${displayedPoints.length} resultado${displayedPoints.length !== 1 ? "s" : ""
                        }.`}
                </p>
            )}

            <div className="w-full h-[75vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm" >

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#d5d8d3]">
                        <tr>

                            <th className="p-3 font-medium text-center">
                                ID Punto
                            </th>
                            <th className="p-3 font-medium text-center">
                                Nombre Cargo
                            </th>
                            <th className="p-3 font-medium text-center">
                                Cod. Cargo
                            </th>
                            <th className="p-3 font-medium text-center">
                                Cant. Puntos
                            </th>
                            <th className="p-3 font-medium text-center">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {loading ?
                            (
                                <tr>
                                    <td colSpan={6} className="items-center">
                                        <div className="flex justify-center items-center py-4"><Spinner></Spinner></div></td>
                                </tr>
                            )
                            : Array.isArray(displayedPoints) && displayedPoints.length > 0 ? (displayedPoints.map(
                                point => {

                                    return (

                                        <tr key={point.id}>

                                            <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{point.id}</td>
                                            <td className='px-6 py-4 font-medium text-gray-900 dark:text-white break-words max-w-xs'>{point.namePosition}</td>
                                            <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{point.positionCode}</td>
                                            <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                                                onDoubleClick={() => handleDoubleClick(point.id, "amountPoint", point.amountPoint.toString())} >
                                                {editingCell?.id === point.id && editingCell?.field === "amountPoint" ? (
                                                    <Input type="number" value={editedvalue} onChange={handleChange}
                                                        onBlur={() => handleSave(point.id)} autoFocus

                                                    />) : (
                                                    point.amountPoint
                                                )}

                                            </td>
                                            <td className="p-6 py-4 font-medium text-gray-900 
                    dark:text-white break-words max-w-xs">
                                                <div className="flex ">
                                                    <Button onClick={() => handleSave(point.id)}
                                                        disabled={editingCell?.id !== point.id || !editedvalue.trim()}
                                                    >
                                                        <LuFilePen />
                                                    </Button>

                                                </div>

                                            </td>
                                        </tr>
                                    )
                                }
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-3">No hay registros</td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>


        </div>
    )
}