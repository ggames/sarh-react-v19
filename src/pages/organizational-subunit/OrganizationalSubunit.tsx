import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { useParams } from "react-router-dom";
//import { addSuborganizational, fetchSuborganizationalById, updateSuborganizational } from "../../features/agent/suborganizational/suborganizationalThunk";
import { useForm } from "react-hook-form";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { fetchOrganizationalUnit } from "../../features/organization/organizationalThunk";
import { OrganizationalSubUnitWithId } from '../../models/organizationalSubUnit.d';
import { toast } from "react-toastify";
import { addSuborganizational, fetchSuborganizationalById, updateSuborganizational } from "../../features/suborganizational/suborganizationalThunk";
import { FaSave } from "react-icons/fa";
import { Select } from "../../components/ui/Select";
import { LuRefreshCcw } from "react-icons/lu";
import { OrganizationalUnitWithId } from "@/models/organizationalUnit";


export const OrganizationalSubunit = ({ mode }: { mode: "create" | "edit" }) => {



  interface SubOrganizationalFields {
    id: number;
    nameSubUnit: string;
    guaraniCode?: string;
    organizationalUnitId: number;
  }

  const dispatch = useAppDispatch();

  const { suborganizational } = useAppSelector((state) => state.suborganizationals);
  const { organizationals } = useAppSelector((state) => state.organizationals);

  const { id } = useParams<{ id: string }>();

  const { register, handleSubmit, setValue } = useForm<SubOrganizationalFields>();

  useEffect(() => {
    if (mode === "edit" && id) {
      dispatch(fetchSuborganizationalById({ suborganizational_id: Number(id) }));
    }

    dispatch(fetchOrganizationalUnit());

  }, [id, mode, dispatch]);

  useEffect(() => {
    if (mode === "edit" && suborganizational) {
      setValue("id", suborganizational.id);

      setValue("nameSubUnit", suborganizational.nameSubUnit);
      setValue("guaraniCode", suborganizational.guaraniCode ?? undefined);
      setValue("organizationalUnitId", suborganizational.organizationalUnit.id);
      console.log('ORGANIZACION IDDIDIDIDIDID' + JSON.stringify(suborganizational.organizationalUnit));

    }
  }, [mode, suborganizational]);

  const suborganizationSubmit = async (data: SubOrganizationalFields) => {

    try {
      // buscar el objeto organizationalUnit completo basado en el organizationalUnitId seleccionado
      const organizationalFound = organizationals.find((org) => Number(org.id) === 
      Number(data.organizationalUnitId));

      if (!organizationalFound) {
        toast.error( "Debe seleccionar una unidad organizacional");
        return;
      }

      const subOrganizationalRequest: OrganizationalSubUnitWithId = {
        id: data.id ?? 0,
        nameSubUnit: data.nameSubUnit,
        guaraniCode: data.guaraniCode,
        organizationalUnit: organizationalFound as OrganizationalUnitWithId
      };



      if (mode === "create") {


        await dispatch(addSuborganizational(subOrganizationalRequest)).unwrap();

        toast.success("Materia creada exitosamente");

      } else {

        await dispatch(updateSuborganizational({
          suborganizational_id: Number(id),
          suborganizational: subOrganizationalRequest
        })).unwrap();

        toast.success("Materia actualizada exitosamente");

      }

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }


  }

/*   const handleOrganizationalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedOrganizational = organizationals.find((org) => Number(org.id) === Number(value));
    setValue("organizationalUnit", selectedOrganizational!);

    console.log('SELECTED ORGANIZATIONAL ' + JSON.stringify(selectedOrganizational));
  }; */

  return (
    <div>
      <h5 className="p-2 mb-1 text-1xl font-bold text-gray-400 dark:text-white border border-gray-200 bg-[#cddafd] rounded-t-lg">
       { mode === "create" ? "Agregar Materia" : "Editar Materia" } 
      </h5>
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit(suborganizationSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nameSubUnit">Materia</Label>
              <Input {...register("nameSubUnit")} />
            </div>
            <div>
              <Label htmlFor="nameUnit">Cod. Guarani</Label>
              <Input {...register("guaraniCode")} />
            </div>
            <div className="mb-4">
              <Label htmlFor="organizationalUnitId">
                Departamento Academico
              </Label>
              <Select {...register("organizationalUnitId", { required: true, valueAsNumber: true })} 
              >
                <option value="">Seleccionar</option>
                {organizationals.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.nameUnit}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg inline-flex text-sm px-5 py-2.5 items-center gap-2"
          >
            {mode === "create" ? (
              <>
                Agregar <FaSave />
              </>
            ) : (
              <>
                Actualizar <LuRefreshCcw />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );

}
