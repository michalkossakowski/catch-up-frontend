import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FullSchoolingDto } from '../dtos/FullSchoolingDto';

const initialState: { selectedSchooling: FullSchoolingDto | null } = {
    selectedSchooling: null,
};

const schoolingSlice = createSlice({
    name: 'fullSchooling',
    initialState,
    reducers: {
        setSchooling: (state, action: PayloadAction<FullSchoolingDto>) => {
            state.selectedSchooling = action.payload;
        },
        clearSchooling: (state) => {
            state.selectedSchooling = null;
        },
    },
});

export const { setSchooling, clearSchooling } = schoolingSlice.actions;
export default schoolingSlice.reducer;

