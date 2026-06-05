import { useParams } from "react-router-dom"
// import { usePlantPositionAction } from '../../features/plant/usePlantPositionAction';

import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { RootState } from "../../features";
import { useEffect } from "react";
import { CharacterPlant } from "../../constants/CharacterPlant";
import { StatusOfPosition } from "../../constants/StatusOfPosition";
// import { usePlantHistoryAction } from "../../features/planthistory/usePlantHistoryAction";
import { useForm } from "react-hook-form";

import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";

import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { PlantStatus } from "../../constants/PlantStatus";
import { fetchPlantsOfPositionById, updatePlantPosition } from "../../features/plant/plantPositionThunk";
import { PlantPositionRequest } from "../../models/plant-position";
import { fetchPlantHistoryLast, fetchPlantHistoryList } from "../../features/planthistory/PlantHistoryThunk";
import { DocumentType } from "../../constants/DocumentType";
import { Spinner } from "../../components/ui/Spinner";



interface PlantEditableFields {
  id: number,
  positionId: number,
  agentId: number,
  organizationalSubUnitId?: number,
  characterPlantID?: (typeof CharacterPlant),
  currentStatusID?: (typeof StatusOfPosition),
  dateFrom?: string | undefined,
  dateTo?: string | undefined
}


export const PlantPositionUpdate = () => {

  const { id } = useParams<{ id: string }>()
  // const { fetchPlantPositionById, updatePlantPosition } = usePlantPositionAction();
  //const { fetchPlantHistoryList, fetchPlantHistoryLast } = usePlantHistoryAction();

  const dispatch = useAppDispatch();
  const { plant } = useAppSelector((state: RootState) => state.plants);
  
  
  const { plantHistories, plantHistory, loading } = useAppSelector((state: RootState) => state.planthistory);

  const { register, reset, handleSubmit } = useForm<PlantEditableFields>();


  useEffect(() => {
     console.log("ID Planta a editar: ", id);
    if(id) {
       console.log("ENTRO AL IF: ", id);
        dispatch(fetchPlantsOfPositionById({plantId: Number(id)}));
        dispatch(fetchPlantHistoryList({planthistory_id: Number(id)}));
        dispatch(fetchPlantHistoryLast({ planthistory_id: Number(id)}));
    }
 
     console.log("Planta actualizada ", plant);
    
  //  
  //  
   

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  useEffect(() => {

  },[]);

  useEffect(() => {
     
    if(!plant) return;

    if (plantHistory && plantHistory?.dateTo == undefined) {
      reset(
        {
          id: plant.id,
          positionId: plant.position.id,
          agentId: plant.agent.id,
          organizationalSubUnitId: plant.organizationalSubUnit.id,
          characterPlantID: plant.characterplantID,
          currentStatusID: plantHistory.plantStatus,
          dateFrom: plantHistory.dateFrom,
          dateTo: plantHistory.dateTo
        }
      )
    }
    
   else {
      reset(
        {
          positionId: plant.position.id,
          agentId: plant.agent.id,
          organizationalSubUnitId: plant.organizationalSubUnit.id,
          characterPlantID: plant.characterplantID,
          currentStatusID: plant.currentStatusID,
          id: 0,
          dateFrom: '',
          dateTo: '',

        }
      )
    }

    console.log("Plant para editar", plant);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ plant, plantHistory, reset])

  const onSubmit = (data: PlantEditableFields) => {
    
    const updatePlant: PlantPositionRequest  = {
      positionId: data.positionId,
      agentId: data.agentId,
      organizationalSubUnit: plant?.organizationalSubUnit.id || 0,
      characterplantID: typeof data.characterPlantID === "string" ? data.characterPlantID : "" ,
      currentStatusID: typeof data.currentStatusID === "string" ? data.currentStatusID : "",
      dateFrom: data.dateFrom ?? '',
      dateTo: data.dateTo ?? '',
      id: 0,
      reasonForMovement: ""
    }

    console.log("Edición Planta de Cargos ", data);
    
    dispatch(updatePlantPosition( { plantId: data.id, plantPositionRequest: updatePlant } ));
    
   // dispatch(fetchPlantsOfPositionById(Number(id)));
   // dispatch(fetchPlantHistoryList(Number(id)));
   // dispatch(fetchPlantHistoryLast(Number(id)));
    

  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5 className="p-2 mb-0 text-1xl font-bold  text-gray-900 dark:text-white border border-gray-200 bg-gray-100">
          Información Personal
        </h5>
        <div className="grid grid-cols-4 mb-3 gap-4">
          <div>
            <Label htmlFor="firstname">Nombre</Label>
            <Input value={plant?.agent.firstname} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="lastname">Apellido</Label>
            <Input value={plant?.agent.lastname} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="documenttype">Tipo Doc.</Label>
            <Select value={plant?.agent.documenttype} disabled>
              {Object.entries(DocumentType).map(([key, docType]) => (
                <option key={key} value={key}>
                  {docType}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="document">Documento</Label>
            <Input value={plant?.agent.document} readOnly />
          </div>
        </div>
        <h5 className="p-2 mb-0 text-1xl font-bold  text-gray-900 dark:text-white border border-gray-200 bg-gray-100">
          Información de Cargo.
        </h5>

        <div className="grid grid-cols-3 mb-3 gap-4">
          <div>
            <Label htmlFor="positionCode">Cod. Cargo</Label>
            <Input
              value={plant?.position.point.positionCode}
              readOnly
              className="outline-green-600"
            />
          </div>
          <div>
            <Label htmlFor="namePosition">Tipo Cargo</Label>
            <Input
              value={plant?.position.point.namePosition}
              readOnly
              className="outline-green-600"
            />
          </div>
          <div>
            <Label htmlFor="pointsAvailable">Ptos Disponibles.</Label>
            <Input
              value={Math.floor(
                ((plant?.position?.pointsAvailable ?? 0) *
                  (plant?.position?.point?.amountPoint ?? 0)) /
                  100
              )}
              readOnly
              className="outline-green-600"
            />
          </div>
          <div>
            <Label htmlFor="characterplantID">Caracter Cargo</Label>
            <Input
              value={plant?.characterplantID}
              readOnly
              className="outline-green-600"
            />
          </div>
          <div>
            <Label htmlFor="currentStatusID">Estado Actual</Label>
            <Input
              value={plant?.currentStatusID}
              readOnly
              className="outline-green-600"
            />
          </div>
          <div>
            <Label htmlFor="nameUnit">Unidad Org.</Label>
            <Input
              value={plant?.position.organizationalUnit.nameUnit}
              readOnly
              className="outline-green-600"
            />
          </div>
        </div>
        <h5 className="p-2 mb-0 text-1xl font-bold  text-gray-900 dark:text-white border border-gray-200 bg-gray-100">
          Información de Planta.
        </h5>

        <div className="grid grid-cols-3 mb-3 gap-4">
          <div>
            <Label htmlFor="dateFrom">Fecha Desde</Label>
            <Input
              type="date"
              {...register("dateFrom")}
              className="outline-green-600"
            />
          </div>
          <div>
            <Label htmlFor="dateTo">Fecha Hasta</Label>
            <Input
              type="date"
              {...register("dateTo")}
              className="outline-green-600"
            />
          </div>
          <div>
            <Label htmlFor="movementForReason">Estado Planta</Label>
            <Select
              {...register("currentStatusID")}
              className="outline-green-600"
            >
              {Object.entries(PlantStatus).map(([key, plantState]) => (
                <option key={key} value={key}>
                  {plantState}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Button
          onSubmit={() => onSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {" "}
          Modificar
        </Button>

        <div></div>
        <div className="p-2">
           <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-[#d5d8d3]">
                                 <tr>   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Id Cargo  </th>
                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Estado Actual</th>
                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-winder">Fecha Inicio</th>
                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Fecha Cese</th>
                                 </tr>
                             </thead>
         
                             <tbody>
                                 {loading ? (
                                     <tr>
                                         <td colSpan={6} className="items-center">
                                             <Spinner></Spinner>
                                         </td>
                                     </tr>) : Array.isArray(plantHistories) && plantHistories.length > 0 ?
                                     (plantHistories.map((plantHistory) => (
                                         <tr key={plantHistory.id}>
                                             <td className="px-6 py-2 whitespace-nowrap">
                                                 <div className="flex items-center">
                                                     <div className="ml-4">
                                                         <div className="text-sm font-medium text-gray-500">
                                                             {plantHistory.id}
                                                         </div>
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className="px-6 py-2 whitespace-nowrap">
                                                 <div className="text-sm text-gray-500">
                                                     {plantHistory.plantStatus}
                                                 </div>
         
                                             </td>
                                             <td className="px-6 py-3 whitespace-nowrap">
                                                 <div className="text-sm text-gray-500">
                                                     {plantHistory.dateFrom ?? 'N/A'}
                                                 </div>
                                             </td>
                                             <td className="px-6 py-3 whitespace-nowrap">
                                                 <div className="text-sm text-gray-500">
                                                     {plantHistory.dateTo}
                                                 </div>
                                             </td>
         
         
                                         </tr>
                                     ))) :
                                     (<></>)
         
                                 }
                             </tbody>
         
                         </table>
        </div>
      </form>
    </div>
  );
}

