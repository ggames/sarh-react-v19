import { createSlice } from "@reduxjs/toolkit";
import { UserResponse, UserWithId } from "../../models/user";

import { registerUser, updateRegisterUser } from "../../services/userService";
import { fetchAllUsers, fetchUserById } from "./userThunk";

export interface UserState {
  id: number | null;
  users: UserResponse[];
  user: UserResponse |  null;
  userUpdate: UserWithId | null,
  photoUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
    id: null,
    users: [],
    user: null,
    userUpdate: null,
    photoUrl: localStorage.getItem('photoUrl') || null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.id = action.payload;
        },
        setUserPhoto: (state, action) => {
            const newPhotoUrl = action.payload;
            state.photoUrl = newPhotoUrl;
            if (newPhotoUrl) {
                localStorage.setItem('photoUrl', newPhotoUrl);
            } else {
                localStorage.removeItem('photoUrl');
            }   
        },
      
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || 'Error al crear usuario';
        });
        builder.addCase(fetchAllUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        });
        builder.addCase(fetchAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || 'Error al listar usuarios';
        });
        builder.addCase(fetchUserById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserById.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchUserById.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Error al cargar al usuario";
        });
        builder.addCase(updateRegisterUser.pending, (state)=> {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateRegisterUser.fulfilled, (state, action) => {
            state.loading = true;
            state.userUpdate = action.payload;

        });
        builder.addCase(updateRegisterUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

    }
})

export const { setUserData, setUserPhoto } = userSlice.actions;

export const userReducer = userSlice.reducer;