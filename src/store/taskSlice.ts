import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FullTaskDto } from '../dtos/FullTaskDto';
import axiosInstance from '../../axiosConfig';

// Define what our task state looks like
interface TaskState {
    tasks: FullTaskDto[];
    loading: boolean;
    error: string | null;
}

// Set initial state
const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

// Create async thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (userId: string) => {
        const response = await axiosInstance.get<FullTaskDto[]>(
            `/Task/GetAllFullTasksByNewbieId/${userId}`
        );
        return response.data;
    }
);

// Create the slice
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        updateTaskLocally: (state, action: PayloadAction<FullTaskDto>) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        clearTasks: (state) => {
            state.tasks = [];
            state.error = null;
        },
    },/*
    extraReducers: (builder) => {
        // Handle async action states
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.loading = false;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch tasks';
            });
    },*/
});

export const { updateTaskLocally, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;