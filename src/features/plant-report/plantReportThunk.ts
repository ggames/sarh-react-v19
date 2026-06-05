import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosWithAuth from "../../api/api.axios";
//import { mapPlantOfPositionToReportDto, PlantOfPositionDto, PlantOfPositionReportDto } from "../../models/plant-position";
import { PlantFilter } from "../../models/plantFilter";
import { AxiosError } from "axios";
import { PlantOfPositionDto } 
from "../../models/plant-position";
import { PlantStatus } from "../../constants/PlantStatus";
import { CharacterPlant } from "../../constants/CharacterPlant";

 
const statusMap: Record<string, PlantStatus> = {
  "0": PlantStatus.ACTIVO,
  "1": PlantStatus.FINALIZADO,
  "2": PlantStatus.LICENCIA_TRANSITORIA,
  "3": PlantStatus.OCUPADO_TRANSITORIAMENTE,
  "4": PlantStatus.RENUNCIA,
  "5": PlantStatus.SUSPENDIDO
};
const characterPlantMap: Record<string, CharacterPlant> = {
  "0": CharacterPlant.ORDINARIO,
  "1": CharacterPlant.INTERINO,
  "2": CharacterPlant.CONTRATADO 
};

const mapPlantDtoToModel = (dto: PlantOfPositionDto): PlantOfPositionDto=> ({
   ...dto,     
   currentStatusID: statusMap[dto.currentStatusID], 
   characterplantID: characterPlantMap[dto.characterplantID]// 🔑 lookup en el mapa
});
 
 export const searchPlantReport = createAsyncThunk<PlantOfPositionDto[], 
 PlantFilter,
{ rejectValue: string }>
("plantReport/searchPlantReport", async (filter, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.get<PlantOfPositionDto[]>(
      "/plant/search/",
      { params: filter }
    );
    const mappedData = data.map(mapPlantDtoToModel);

    console.log("Mapped Data:", mappedData); // Verifica el mapeo
    return mappedData;
    //
    //return data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    // Devuelvo un mensaje seguro para el reject
    return rejectWithValue(
      error.response?.data?.message || "Error al buscar el reporte de planta"
    );
  }
}); 
