import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilePair } from '../interfaces/FilePair';

interface UserFilesState {
    filePairs: FilePair[];
}

const initialState: UserFilesState = {
    filePairs:[],
};

const userFilesSlice = createSlice({
    name: 'files',
    initialState: initialState,
    reducers: {
        setFiles: (state, action: PayloadAction<FilePair[]>) => {
            state.filePairs = action.payload;
        },
        clearFiles: (state) => {
            state.filePairs = [];
        },
        addFile: (state, action: PayloadAction<FilePair>) => {
            state.filePairs.push(action.payload);
        },
        removeFile: (state, action: PayloadAction<number>) => {
            state.filePairs = state.filePairs.filter(pair => pair.fileDto.id !== action.payload);
        }
    },
});

export const { setFiles, clearFiles, addFile, removeFile } = userFilesSlice.actions;
export default userFilesSlice.reducer;
