import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FullTaskDto } from '../dtos/FullTaskDto';
import { getAllFullTasksByNewbieId } from "../services/taskService.ts";

interface TaskState {
    tasks: FullTaskDto[]; // all tasks in total, might use it for admin in the future
    tasksByUser: Record<string, FullTaskDto[]>; // tasks grouped by userId
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    tasksByUser: {},
    loading: false,
    error: null,
};

// if the tasks were fetched, return them, if not then call the API
export const fetchTasks = createAsyncThunk("tasks/fetchTasks",
    async (userId: string, { getState }) => {
        const state = getState() as { tasks: TaskState };

        if (state.tasks.tasksByUser[userId]) {
            return { tasks: state.tasks.tasksByUser[userId], userId };
        }

        const response = await getAllFullTasksByNewbieId(userId)
        return { tasks: response, userId };
    }
);

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        updateTaskLocally: (state, action: PayloadAction<FullTaskDto>) => {
            const { id, newbieId } = action.payload;

            // update task in the total list
            const taskIndex = state.tasks.findIndex((task) => task.id === id);
            if (taskIndex !== -1) {
                state.tasks[taskIndex] = action.payload;
            } else {
                state.tasks.push(action.payload);
            }

            // update the task in the cached userId list
            if (newbieId && state.tasksByUser[newbieId]) {
                const userTaskIndex = state.tasksByUser[newbieId].findIndex((task) => task.id === id);
                if (userTaskIndex !== -1) {
                    state.tasksByUser[newbieId][userTaskIndex] = action.payload;
                } else {
                    state.tasksByUser[newbieId].push(action.payload);
                }
            }
        },
        clearTasks: (state) => {
            state.tasks = [];
            state.tasksByUser = {};
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
                const { tasks, userId } = action.payload;
                state.tasksByUser[userId] = tasks;
                state.tasks = tasks;
                state.loading = false;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch tasks";
            });
    },
});

export const { updateTaskLocally, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
