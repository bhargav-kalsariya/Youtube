import { axiosClient } from "../../utilities/axiosClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUserProfile = createAsyncThunk('video/getUserProfile', async (body) => {

    const response = await axiosClient.post('/user/othersProfile', body);

    return response.data.result;

});

export const addCommentToThisVideo = createAsyncThunk('video/add-comment', async (body) => {

    const response = await axiosClient.post('/video/addComment', body);
    return response.data.result;

});

const videoSlice = createSlice({

    name: "video",
    initialState: {
        currentVideo: null,
        userProfile: null,
        status: 'idle',
        error: null
    },
    reducers: {
        setCurrentVideo: (state, action) => {
            state.currentVideo = action.payload;
        },
    },
    extraReducers:
        (builder) => {
            builder
                .addCase(getUserProfile.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.userProfile = action.payload
                })
                .addCase(addCommentToThisVideo.fulfilled, (state, action) => {
                    state.currentVideo = action.payload.data;
                });
        }

});

export const { setCurrentVideo } = videoSlice.actions;

export default videoSlice.reducer;