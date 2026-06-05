import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosWithAuth from "../../api/api.axios";
import { Transformation, TransformationWithId } from "../../models/transformation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";


export const fetchTransformations = createAsyncThunk<
  TransformationWithId[],
  void,
  { rejectValue: string }
>("fetchTransformation/all", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.get("/transformation/all");
    return data;
  } catch (error) {
    return rejectWithValue(String(error));
  }
});



export const fetchTransformationLast = createAsyncThunk<
  TransformationWithId,
  void,
  { rejectValue: string }
>("fetchTransformationLast/last", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.get("/transformation/last");
    return data;
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const addTransformation = createAsyncThunk<TransformationWithId, Transformation, { rejectValue: string }>(
  "addTransformation/add", async (transformation, { rejectWithValue }) => {
    console.log("TRANSFORMATION TO ADD ", transformation);
    try {


      const { data } = await axiosWithAuth.post<TransformationWithId>("transformation/create", transformation);
      return data;
    } catch (error) {

      if (error instanceof AxiosError && (error.response?.status === 400 && error.response?.data)) {
        const validationErrors = error.response.data as Record<string, string>;

        // Mostrar todos los errores en toast
        Object.values(validationErrors).forEach((msg: string) => {
          toast.error(msg);
        });
        return rejectWithValue(String(validationErrors));
      }

      return rejectWithValue(String(error));

    }
  }
)
