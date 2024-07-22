import { axiosClient } from "../../utilities/axiosClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAllVideos = createAsyncThunk('videos/getAll', async () => {

    const allVideos = await axiosClient.get('/video/getAll');

    console.log({ allVideos });
    return allVideos.data.result.data;

})

const videoSlice = createSlice({

    name: "video",
    initialState: {
        videos: [],
        status: 'idle',
        error: null
    },
    extraReducers:
        (builder) => {
            builder
                .addCase(getAllVideos.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(getAllVideos.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.videos = action.payload
                })
                .addCase(getAllVideos.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message
                });
        }

});

export default videoSlice.reducer;