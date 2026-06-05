// features/agent/agentThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosWithAuth from "../../api/api.axios";
import { Agent } from "../../models/agent";
import { AgentWithId } from "../../models/agent.d";
import { toast } from "react-toastify";
import { AxiosError } from "axios";


export const fetchAgents = createAsyncThunk<AgentWithId[], number, { rejectValue: string}>(
  "agent/all",
  async (pageParam, { rejectWithValue }) => {
    try {
      const { data } = await axiosWithAuth.get<AgentWithId[]>("agent/all", { params: pageParam});
      return data;
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);

export const fetchAgentById = createAsyncThunk<AgentWithId, {agentId: number}, { rejectValue: string}>(
  "agent/fetchById",
  async ({agentId}, { rejectWithValue }) => {
    try {
      const { data } = await axiosWithAuth.get<AgentWithId>(`/agent/${agentId}`);
    
     console.log("AGENTE OBTENIDO POR ID ", data);
      return data;
    } catch (error) {
      
       if(error instanceof AxiosError && (error.response?.status === 404)){
        toast.error( error.response?.data?.message );
        return rejectWithValue( error.response?.data?.message);
      }

      return rejectWithValue("Error inesperado" + String(error));
    }
  }
);

export const fetchAgentByDocument = createAsyncThunk(
  "agent/document",
  async (document: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosWithAuth.get<AgentWithId>(
        `/agent/document/${document}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addAgent = createAsyncThunk<
  AgentWithId,
  Agent,
  { rejectValue: string }
>("agent/add", async (agent, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.post<AgentWithId>(
      "/agent/create",
      agent
    );

    toast.success("El agente se ha creado con exito");
    return data as AgentWithId;
  } catch (error) {
     if(error instanceof AxiosError && (error.response?.status === 400 && error.response?.data)){
      const validationErrors = error.response.data as Record<string, string>;

        // Mostrar todos los errores en toast
        Object.values(validationErrors).forEach((msg: string) => {
          toast.error(msg);
        });
        return rejectWithValue(String(validationErrors));
      }
    return rejectWithValue("Error inesperado");
  }
});

export const updateAgent = createAsyncThunk<
  AgentWithId,
  { agentId: number; agent: AgentWithId },
  { rejectValue: string }
>(
  "agent/update",
  async (
    { agentId, agent },
    { rejectWithValue }
  ) => {
    try {
     
      const { data } = await axiosWithAuth.put<AgentWithId>(
        `/agent/update/${agentId}`,
        agent
      );
       console.log("AGENTE PARA ACTUALIZAR ", agent); 

      return data as AgentWithId;
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);
