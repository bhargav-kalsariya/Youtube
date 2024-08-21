import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utilities/axiosClient"

export const getAllVideos = createAsyncThunk('videos/getAll', async () => {

    const allVideos = await axiosClient.get('/video/getAll');
    return allVideos.data.result.data;

});

export const subscribe_unsubscribe = createAsyncThunk('user/subscribe_unsubscribe', async (body) => {

    const response = await axiosClient.post('/user/subscribe-unsubscribe', body);
    return response.data.result;

});

export const likeThisVideo = createAsyncThunk('video/like', async (body) => {

    const response = await axiosClient.post('/video/like', body);
    return response.data.result;

});

export const dislikeThisVideo = createAsyncThunk('video/dislike', async (body) => {

    const response = await axiosClient.post('/video/dislike', body);
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