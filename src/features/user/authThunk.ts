import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import axiosWithAuth from "../../api/api.axios";
import { toast } from "react-toastify";

interface changePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  roles: string[];
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const loginUser = createAsyncThunk<LoginResponse, { username: string; password: string }, { rejectValue: string }>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/log-in`, credentials);
      console.log("USUARIO LOGIN " + response.data.username);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Error al iniciar sesión"
        );
      }
      return rejectWithValue("Error inesperado al iniciar sesión");
    }
  }
);

export const changePasswordThunk = createAsyncThunk<{ message: string }, changePasswordPayload, { rejectValue: string }>(
  "auth/ChangePass", 
  async (changePass, { rejectWithValue }) => {
    try {
      const result = await axiosWithAuth.post<{ message: string }>("/auth/change", changePass);
      return result.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Error al cambiar la contraseña");
      }
      return rejectWithValue("Error al cambiar la contraseña");
    }
  }
);

export const resetPasswordThunk = createAsyncThunk<any, number, { rejectValue: string }>(
  "auth/ResetPassword", 
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosWithAuth.post(`/api/admin/user/${id}/reset-password`);
      toast.success("Se ha restablecido la contraseña provisoria y enviado el correo electrónico.");
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const validationErrors = error.response?.data;
        
        if (validationErrors && typeof validationErrors === 'object') {
          Object.values(validationErrors).forEach((msg: any) => toast.error(String(msg)));
          return rejectWithValue(JSON.stringify(validationErrors));
        }
        
        const errorMsg = error.response?.data?.message || "Error en el servidor";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }

      toast.error("Error inesperado al restablecer la contraseña");
      return rejectWithValue('Error inesperado');
    }
  }
);