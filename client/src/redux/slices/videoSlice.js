import { axiosClient } from "../../utilities/axiosClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAllVideos = createAsyncThunk('videos/getAll', async () => {

    const allVideos = await axiosClient.get('/video/getAll');

    console.log({ allVideos });
    return allVideos.data.result.data;

})

export const getUserProfile = createAsyncThunk('video/getUserProfile', async (body) => {

    const response = await axiosClient.post('/user/othersProfile', body);

    console.log({ userprofile: response.data.result });
    return response.data.result;

});

const videoSlice = createSlice({

    name: "video",
    initialState: {
        userProfile: null,
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
                })
                .addCase(getUserProfile.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.userProfile = action.payload
                });
        }

});

export default videoSlice.reducer;