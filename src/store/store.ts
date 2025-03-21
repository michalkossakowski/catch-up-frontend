import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Używa localStorage
import schoolingReducer from './schoolingSlice'
import taskReducer from './taskSlice'
import notificationReducer from './notificationSlice';
import userFilesReducer from './userFilesSlice';
const rootReducer = combineReducers({
    schooling: schoolingReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
    files: userFilesReducer,
})

const persistConfig = {
  key: 'root',
  storage,
    //   blacklist: ['schooling'], // Wyklucz schooling z persystencji
    blacklist: ['tasks'], // now we get fresh tasks after refresh
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;





// Nie zapisuje stanu
// import { configureStore } from '@reduxjs/toolkit';
// import schoolingReducer from './schoolingSlice';

// const store = configureStore({
//     reducer: {
//         schooling: schoolingReducer,
//     },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;
