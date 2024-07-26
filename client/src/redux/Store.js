import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import videoSlice from "./slices/videoSlice";
import feedSlice from "./slices/feedSlice";

export default configureStore({

    reducer: {
        userReducer: userSlice,
        videoReducer: videoSlice,
        feedReducer: feedSlice
    }

})