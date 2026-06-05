import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosWithAuth from "../../api/api.axios";
import {
  PositionDto,
  PositionRequest,
  PositionRequestWithId,
  PositionWithId,
} from "../../models/position";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const fetchAllPosition = createAsyncThunk<
  PositionWithId,
  void,
  { rejectValue: string }
>("position/fetchAllPosition", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.get("position/allposition");
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data.message || "Error al buscar los cargos"
    );
  }
});

export const fetchPositions = createAsyncThunk(
  "position/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosWithAuth.get<PositionDto[]>("/position/all");
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVacantPositions = createAsyncThunk(
  "position/fetchVacant",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosWithAuth.get<PositionDto[]>(
        "/position/vacant"
      );
      console.log("VACANT POSITIONS ", data);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAvailablePositions = createAsyncThunk(
  "position/fetchAvailable",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosWithAuth.get<PositionDto[]>(
        "/position/available"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPositionById = createAsyncThunk<
  PositionWithId,
  { positionId: number },
  { rejectValue: string }
>("/position/fetchById", async ({ positionId }, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.get<PositionWithId>(
      `/position/${positionId}`
    );
    console.log("Cargo ID ", data);
    return data;
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const fetchOriginPositions = createAsyncThunk<
  PositionDto[],
  { originId: number | null },
  { rejectValue: string }
>("position/fetchOrigin", async ({ originId }, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.get(`position/origin/${originId}`);
    console.log("CARGOS DE ORIGEN ", data);
    return data;
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const addPosition = createAsyncThunk<
  PositionWithId,
  PositionRequest,
  { rejectValue: string }
>("/position/add", async (position: PositionRequestWithId, { rejectWithValue }) => {
  try {

    console.log("ADD POSITION REQUEST ", position);
    const { data } = await axiosWithAuth.post<PositionWithId>(
      "position/create",
      position
    );
    
    toast.success("Cargo se ha creado con éxito");
    return data as PositionWithId;
  } catch (error) {
       if(error instanceof AxiosError) {
         const message = error.response?.data.message || "Error al actualizar el cargo";  
         toast.error(message);
         return rejectWithValue(message);                 
      }
      return rejectWithValue("Error inesperado");
  }
});

export const updatePosition = createAsyncThunk<
  PositionWithId,
  { positionId: number; position_request: PositionRequestWithId },
  { rejectValue: string }
>(
  "/position/update",
  async (
    {
      positionId,
      position_request,
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("UPDATE POSITION REQUEST ", position_request);
      const { data } = await axiosWithAuth.put<PositionWithId>(
        `position/update/${positionId}`,
        position_request
      );
       toast.success("Cargo actualizado con éxito");
      return data;
    } catch (error) {
      if(error instanceof AxiosError) {
         const message = error.response?.data.message || "Error al actualizar el cargo";  
         toast.error(message);
         return rejectWithValue(message);                 
      }
      return rejectWithValue("Error inesperado");
    }
  }  
);
