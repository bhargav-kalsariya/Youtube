import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utilities/axiosClient"

export const getAllVideos = createAsyncThunk('videos/getAll', async () => {

    const allVideos = await axiosClient.get('/video/getAll');

    console.log({ allVideos });
    return allVideos.data.result.data;

});

export const subscribe_unsubscribe = createAsyncThunk('user/subscribe_unsubscribe', async (body) => {

    const response = await axiosClient.post('/user/subscribe-unsubscribe', body);
    console.log({ subscribe_unsubscribe: response.data });
    return response.data.result;

});

const feedSlice = createSlice({

    name: "feedSlice",
    initialState: {
        feedData: {},
        videos: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllVideos.fulfilled, (state, action) => {
                state.videos = action.payload
            })
            .addCase(subscribe_unsubscribe.fulfilled, (state, action) => {
                state.feedData = action.payload
            })
    }

})

export default feedSlice.reducer;