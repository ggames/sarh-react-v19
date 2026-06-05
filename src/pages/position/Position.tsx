import { useEffect, useState } from "react";
import { RootState } from "../../features";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";

import { StatusOfPosition } from "../../constants/StatusOfPosition";
//import { usePointAction } from "../../features/point/usePointAction";

import { useForm } from "react-hook-form";
import {
  addPosition,
  updatePosition,
  fetchPositionById,
} from "../../features/position/positionThunk";
import { PositionRequestWithId } from "../../models/position";
import { fetchOrganizationalUnitDto } from "../../features/organization/organizationalThunk";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "../../components/ui/Label";
import { Select } from "../../components/ui/Select";
import { format } from "date-fns";
import { Input } from "../../components/ui/Input";
import { TableOfPositions } from "./TableOfPositions";

import { OriginPositions } from "./OriginPositions";
import { fetchPoints } from "../../features/point/pointThunk";
import { fetchTransformations } from "../../features/transformation/transformationThunk";

type PositionFields = {
  id?: number;
  point: number;
  organizational: number;
  OriginPositions?: number[];
  pointsAvailable: number;
  positionStatus: string;
  resolutionTransformation?: number;
};

export const Position = ({ mode }: { mode: "create" | "edit" }) => {
  const swal = withReactContent(Swal);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { points } = useAppSelector((state: RootState) => state.points);
  const { transformations } = useAppSelector(
    (state: RootState) => state.transformations
  );
  const { organizationalsDto } = useAppSelector(
    (state: RootState) => state.organizationals
  );
  const { position } = useAppSelector((state: RootState) => state.positions);
  // const { originPositions } = useAppSelector((state: RootState) => state.positions);
  //const {} = useAppSelector((state: RootState) => state.positions)

  //const { fetchPoints } = usePointAction();
  //const { fetchTransformations } = ();

  const [originPositionIds, setOriginPositionIds] = useState<number[]>([]);
  // const [selectedPoint, setSelectedPoint] = useState(0);

  const { register, setValue, handleSubmit } = useForm<PositionFields>();

  useEffect(() => {
    dispatch(fetchPoints());
    dispatch(fetchTransformations());
    dispatch(fetchOrganizationalUnitDto());

    if (mode === "edit" && id) {
      dispatch(fetchPositionById({ positionId: Number(id) }));
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    console.log("EDICION CARGO ", position);
    if (mode === "edit" && position) {
      setValue("id", position.id);
      setValue("point", position?.point?.id);
      setValue("pointsAvailable", position.point.amountPoint);
      setValue("organizational", position.organizationalUnit.id);
      setValue("positionStatus", position?.positionStatus ?? "");
      setValue(
        "resolutionTransformation",
        position?.creationResolution?.id
      );
    }
  }, [mode, position, setValue]);

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const pointSelect = points.find((p) => Number(p.id) === Number(value));
    console.log("Valor de Puntos " + pointSelect?.amountPoint);
    setValue(
      "pointsAvailable",
      pointSelect?.amountPoint ? pointSelect.amountPoint : 0
    );
    //setSelectedPoint(pointSelect?.amountPoint? pointSelect.amountPoint: 0);
  };

  const onSubmit = (data: PositionFields) => {
    const positionRequest: PositionRequestWithId = {
      id: Number(id),
      point: Number(data.point),
      organizational: Number(data.organizational),
      originPositionIds: originPositionIds,
      positionStatus: data.positionStatus as (typeof StatusOfPosition)[
        | "ACTIVO"
        | "VACANTE_DEFINITIVA"
        | "VACANTE_TRANSITORIA"
        | "SUPRIMIDO"],
      resolutionTransformation: Number(data.resolutionTransformation),
    };
    console.log("POSITION REQUEST: ", positionRequest);
    console.log("ORIGEN DE CARGO ", originPositionIds);

    if (mode === "create") {
      swal
        .fire({
          title: (
            <small>'Estas seguro de esto?, Esta acción es irreversible'</small>
          ),
          showCancelButton: true,
          confirmButtonText: "Sí",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            dispatch(addPosition(positionRequest)).then(() =>
              navigate("/cargos/all")
            );
          }
        });
    } else {
      dispatch(
        updatePosition({
          positionId: Number(id),
          position_request: positionRequest,
        })
   
      );
      navigate("/cargos/all");
    }
  };

  return (
    <div>
      <h5 className="p-2 mb-1 text-1xl font-bold text-gray-400 dark:text-white border border-gray-200 bg-[#cddafd] rounded-t-lg">
        {mode === "create" ? "Nuevo Cargo" : "Editar Cargo"}
      </h5>
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            {/* Oculto para edit */}
            {mode === "edit" && <input type="hidden" {...register("id")} />}

            <div>
              <Label htmlFor="resolutionTransformation">Transformación</Label>
              <Select
                {...register("resolutionTransformation")}
                style={{ fontFamily: "monospace" }}
        
              >
                <option value="">Seleccionar</option>
                {transformations.map((t) => (
                  <option key={t.id} value={t.id}>
                    {`${t.resolutionNumber?.toString().padEnd(10, " ")}|
                    ${t.date ? format(new Date(t.date), "dd-MM-yyyy") : ""}
                   `}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="point">Tipo de Cargo</Label>
              <Select
                {...register("point")}
                onChange={handleChangeSelect}
        
              >
                <option value="">Seleccionar</option>
                {points.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.namePosition}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="amountPoint">Cantidad de Puntos</Label>
              <Input
                {...register("pointsAvailable")}
        
                disabled
              />
            </div>

            <div>
              <Label>Estado del Cargo</Label>
              <Select
                {...register("positionStatus")}
        
              >
                <option value="">Seleccionar</option>
                {Object.entries(StatusOfPosition).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="organizational">Unidad Org.</Label>
              <Select
                {...register("organizational")}
        
              >
                <option value="">Seleccionar</option>
                {organizationalsDto.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.nameUnit}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {mode !== "edit" ? (
            <TableOfPositions
              getSelectedPositions={setOriginPositionIds}
              shouldReset={false}
              onResetDone={() => {}}
            />
          ) : (
            <>
            {id  && <OriginPositions originId={Number(id)} />}  
              </>
             
          )}

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500"
            >
              {mode === "create" ? "Guardar" : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
