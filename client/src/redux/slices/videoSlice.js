import { axiosClient } from "../../utilities/axiosClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUserProfile = createAsyncThunk('video/getUserProfile', async (body) => {
    try {
        const response = await axiosClient.post('/user/othersProfile', body);
        return response.data.result;
    } catch (error) {
        return Promise.reject(error);
    }
});

export const addCommentToThisVideo = createAsyncThunk('video/addComment', async (body) => {
    try {
        const response = await axiosClient.post('/video/addComment', body);
        return response.data.result.data;
    } catch (error) {
        return Promise.reject(error);
    }
});

export const deleteVideo = createAsyncThunk('video/delete', async (videoId) => {
    try {
        const response = await axiosClient.delete(`/video/${videoId}`);
        return { videoId, message: response.data.result };
    } catch (error) {
        return Promise.reject(error);
    }
});

export const updateVideo = createAsyncThunk('video/update', async ({ videoId, updates }) => {
    try {
        const response = await axiosClient.put(`/video/${videoId}`, updates);
        return response.data.result.data;
    } catch (error) {
        return Promise.reject(error);
    }
});

const videoSlice = createSlice({
    name: 'videoSlice',
    initialState: {
        currentVideo: null,
        userProfile: null,
        loading: false,
        error: null
    },
    reducers: {
        setCurrentVideo: (state, action) => {
            state.currentVideo = action.payload;
        },
        clearCurrentVideo: (state) => {
            state.currentVideo = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.userProfile = action.payload;
                state.loading = false;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addCommentToThisVideo.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCommentToThisVideo.fulfilled, (state, action) => {
                state.currentVideo = action.payload;
                state.loading = false;
            })
            .addCase(addCommentToThisVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteVideo.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteVideo.fulfilled, (state, action) => {
                state.loading = false;
                // Remove video from current state if it's the deleted one
                if (state.currentVideo && state.currentVideo._id === action.payload.videoId) {
                    state.currentVideo = null;
                }
            })
            .addCase(deleteVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateVideo.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateVideo.fulfilled, (state, action) => {
                state.currentVideo = action.payload;
                state.loading = false;
            })
            .addCase(updateVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setCurrentVideo, clearCurrentVideo, clearError } = videoSlice.actions;
export default videoSlice.reducer;