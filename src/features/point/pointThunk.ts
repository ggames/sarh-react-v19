import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosWithAuth from "../../api/api.axios";
import {
  PointWithId,
  Point,
  PercentagePoint,
  AmountPoint,
} from "../../models/point";

export const fetchPoints = createAsyncThunk<
  PointWithId[],
  void,
  { rejectValue: string }
>("points/fetchPoints", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.get<PointWithId[]>("/point/all");
    return data.sort((a, b) => a.positionCode - b.positionCode);
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const fetchPointById = createAsyncThunk<
  PointWithId,
  { point_id: number },
  { rejectValue: string }
>("points/fetchPointById", async ({ point_id }, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.get<PointWithId>(`/point/${point_id}`);
    return data;
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const createPoint = createAsyncThunk<
  PointWithId,
  { point: Point },
  { rejectValue: string }
>("points/createPoint", async ({ point }, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.post<PointWithId>(
      "/point/create",
      point
    );
    return data;
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const updatePointByPercentage = createAsyncThunk<
  void,
  { percentage: PercentagePoint },
  { rejectValue: string }
>("points/updatePoint", async ({ percentage }, { rejectWithValue }) => {
  try {
    const { data } = await axiosWithAuth.post<void>(
      `/point/parity`,
      percentage
    );
    return data;
  } catch (error) {
    return rejectWithValue(String(error));
  }
});

export const updatePoint = createAsyncThunk<
  PointWithId,
  { point_id: number; amount_point: AmountPoint },
  { rejectValue: string }
>(
  "points/updatePoint",
  async ({ point_id, amount_point }, { rejectWithValue }) => {
    try {
      const { data } = await axiosWithAuth.put<PointWithId>(
        `/point/parity/${point_id}`,
        amount_point
      );
      return data;
    } catch (error) {
      return rejectWithValue(String(error));
    }
  }
);
