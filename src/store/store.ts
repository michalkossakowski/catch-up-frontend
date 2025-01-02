import { configureStore } from '@reduxjs/toolkit';
import schoolingReducer from './schoolingSlice';

const store = configureStore({
    reducer: {
        schooling: schoolingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
