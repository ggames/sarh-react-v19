import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PositionDto,  PositionWithId } from "../../models/position";
import { addPosition, fetchPositionById, fetchPositions, fetchVacantPositions, fetchAvailablePositions, updatePosition, fetchOriginPositions } from "./positionThunk";
import { StatusOfPosition } from "../../constants/StatusOfPosition";


 interface PositionState {
   position: PositionWithId | null;
   positions: PositionDto[];
   originPositions: PositionDto[];
   positionDto: PositionDto | null;
   loading: boolean;
   error: string | null;   
}

const initialState: PositionState = {
   position: null,
   positions: [],
   originPositions: [],
   positionDto: null,
   loading: false,
   error: null

}  

export const positionSlice = createSlice({

    name: 'position',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchPositions.pending, (state)=> {
        state.loading = true;
        state.error = null;
      });

      builder.addCase(fetchPositions.fulfilled, (state, action: PayloadAction<PositionDto[]>)=>{
          state.loading = false;
          state.positions = action.payload;
      });

      builder.addCase(fetchPositions.rejected, (state, action)=> {
         state.loading = false;
         state.error = action.payload as string;

      });
      builder.addCase(fetchVacantPositions.pending, (state)=> {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchVacantPositions.fulfilled, (state, action: PayloadAction<PositionDto[]>)=>{
          state.loading = false;
          state.positions = action.payload;
      });
      builder.addCase(fetchVacantPositions.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      });

      builder.addCase(fetchAvailablePositions.pending, (state)=> {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchAvailablePositions.fulfilled, (state, action: PayloadAction<PositionDto[]>)=>{
          state.loading = false;
          state.positions = action.payload;
      });
      builder.addCase(fetchAvailablePositions.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      });

      builder.addCase(fetchPositionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchPositionById.fulfilled, (state, action: PayloadAction<PositionWithId>)=>{
         state.loading = false;
         state.position = action.payload;
      });
      builder.addCase(fetchPositionById.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      });
      builder.addCase(fetchOriginPositions.pending, (state) => {
        state.loading = true;
        state.error = null; 
      });
      builder.addCase(fetchOriginPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.originPositions = action.payload;
      });
      builder.addCase(fetchOriginPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      });

      builder.addCase(addPosition.pending, (state) =>{
        state.loading = true;
        state.error = null;
      });
      builder.addCase(addPosition.fulfilled, (state)=>{
          state.loading = false;
           
         // state.positions.push(action.payload as PositionDto);
      });

      builder.addCase(addPosition.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      });
      builder.addCase( updatePosition.pending, (state)=> {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(updatePosition.fulfilled, (state, action: PayloadAction<PositionWithId>)=>{
        state.loading = false;
        const index = state.positions.findIndex(pos => pos.id === action.payload.id);
        if(index !== -1){
          const { id , organizationalUnit: organizational, pointsAvailable } = action.payload;

            const  nameUnit  = organizational?.nameUnit ;
            const updatedPosition: PositionDto = {
            id: id,
            namePosition: '',
            nameUnit: nameUnit,
            positionStatus: StatusOfPosition.ACTIVO, // Enum value
            amountPoint: 0,
            pointsAvailable: pointsAvailable,
            resolutionNumber: '',
            discountedQuantity: 0
            }
          state.positions[index] = updatedPosition; 
        }
        if(state.positionDto && state.positionDto.id === action.payload.id){
          state.positionDto = state.positions[index];
        }

      });
      builder.addCase(updatePosition.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      });
    }

})

export default positionSlice.reducer;