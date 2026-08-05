import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setToken, clearTokens } from "../../api/api.axios";
import { changePasswordThunk, loginUser, resetPasswordThunk } from "./authThunk";

interface AuthState {
  user: string | null;
  roles: string[];
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  message: string;
  passwordChanged: boolean;
}

const initialState: AuthState = {
  // Se corrigieron las llaves para que coincidan con lo que se guarda en el login
  user: localStorage.getItem("user") || null,
  roles: JSON.parse(localStorage.getItem("roles") || "[]"),
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  message: "",
  passwordChanged: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ accessToken: string; refreshToken: string; user: string; roles: string[] }>) {
      const { accessToken, refreshToken, user, roles } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.user = user;
      state.roles = roles ?? [];

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", user);
      localStorage.setItem("roles", JSON.stringify(roles ?? []));
      
      setToken(accessToken, refreshToken, user, roles);
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.roles = [];
      state.error = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
      
      clearTokens();
    },
    updateAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    updateUserData(state, action: PayloadAction<{ user: string; roles: string[] }>) {
      state.user = action.payload.user;
      state.roles = action.payload.roles;

      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("roles", JSON.stringify(action.payload.roles));
    }
  },
  extraReducers: (builder) => {
    // --- Login User ---
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      // Mapeamos username de la API a nuestro estado 'user'
      state.user = action.payload.username; 
      state.roles = action.payload.roles ?? [];
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Guardar en almacenamiento local
     // localStorage.setItem("accessToken", action.payload.accessToken);
     // localStorage.setItem("refreshToken", action.payload.refreshToken);
     // localStorage.setItem("user", action.payload.username);
    //  localStorage.setItem("roles", JSON.stringify(action.payload.roles ?? []));
      
      setToken(action.payload.accessToken, action.payload.refreshToken, action.payload.username, action.payload.roles);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // --- Reset Password ---
    builder.addCase(resetPasswordThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPasswordThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(resetPasswordThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // --- Change Password ---
    builder.addCase(changePasswordThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePasswordThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.passwordChanged = true;
    });
    builder.addCase(changePasswordThunk.rejected, (state, action) => {
      state.loading = false;
      // Se corrigió action.error por action.payload para obtener el string enviado por el Thunk
      state.error = action.payload as string; 
    });
  }
});

export const { loginSuccess, logout, updateAccessToken, updateUserData } = authSlice.actions;
export default authSlice.reducer;