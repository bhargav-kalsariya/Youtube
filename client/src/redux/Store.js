import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import videoSlice from "./slices/videoSlice";
import feedSlice from "./slices/feedSlice";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage
}

const rootReducer = combineReducers({
    userReducer: userSlice,
    videoReducer: videoSlice,
    feedReducer: feedSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register'],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };