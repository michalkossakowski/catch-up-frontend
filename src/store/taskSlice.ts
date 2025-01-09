import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FullTaskDto } from '../dtos/FullTaskDto';
import axiosInstance from '../../axiosConfig';

interface TaskState {
    tasks: FullTaskDto[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (userId?: string) => {
        const endpoint = userId
            ? `/Task/GetAllFullTasksByNewbieId/${userId}`
            : `/Task/GetAllFullTasks`;
        const response = await axiosInstance.get<FullTaskDto[]>(endpoint);
        return response.data;
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        updateTaskLocally: (state, action: PayloadAction<FullTaskDto>) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            } else {
                state.tasks.push(action.payload);
            }
        },
        clearTasks: (state) => {
            state.tasks = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
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
    },
});

export const { updateTaskLocally, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;