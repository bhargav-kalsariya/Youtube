import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utilities/axiosClient"

export const getAllVideos = createAsyncThunk('videos/getAll', async () => {

    const allVideos = await axiosClient.get('/video/getAll');
    return allVideos.data.result.data;

});

export const searchVideos = createAsyncThunk('videos/search', async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    const searchResults = await axiosClient.get(`/video/search?${queryString}`);
    return searchResults.data.result.data;
});

export const getTrendingVideos = createAsyncThunk('videos/trending', async (limit = 20) => {
    const trendingVideos = await axiosClient.get(`/video/trending?limit=${limit}`);
    return trendingVideos.data.result.data;
});

export const getVideoById = createAsyncThunk('videos/getById', async (videoId) => {
    const video = await axiosClient.get(`/video/${videoId}`);
    return video.data.result.data;
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
        videos: [],
        searchResults: [],
        trendingVideos: [],
        currentVideo: null,
        loading: false,
        error: null
    },
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllVideos.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllVideos.fulfilled, (state, action) => {
                state.videos = action.payload;
                state.loading = false;
            })
            .addCase(getAllVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(searchVideos.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchVideos.fulfilled, (state, action) => {
                state.searchResults = action.payload;
                state.loading = false;
            })
            .addCase(searchVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getTrendingVideos.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTrendingVideos.fulfilled, (state, action) => {
                state.trendingVideos = action.payload;
                state.loading = false;
            })
            .addCase(getTrendingVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getVideoById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getVideoById.fulfilled, (state, action) => {
                state.currentVideo = action.payload;
                state.loading = false;
            })
            .addCase(getVideoById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(subscribe_unsubscribe.fulfilled, (state, action) => {
                state.feedData = action.payload
            })
            .addCase(likeThisVideo.fulfilled, (state, action) => {
                // Update video in videos array if it exists
                const videoIndex = state.videos.findIndex(video => video._id === action.payload._id);
                if (videoIndex !== -1) {
                    state.videos[videoIndex] = action.payload;
                }
                // Update video in searchResults if it exists
                const searchIndex = state.searchResults.findIndex(video => video._id === action.payload._id);
                if (searchIndex !== -1) {
                    state.searchResults[searchIndex] = action.payload;
                }
                // Update current video if it's the same
                if (state.currentVideo && state.currentVideo._id === action.payload._id) {
                    state.currentVideo = action.payload;
                }
            })
            .addCase(dislikeThisVideo.fulfilled, (state, action) => {
                // Update video in videos array if it exists
                const videoIndex = state.videos.findIndex(video => video._id === action.payload._id);
                if (videoIndex !== -1) {
                    state.videos[videoIndex] = action.payload;
                }
                // Update video in searchResults if it exists
                const searchIndex = state.searchResults.findIndex(video => video._id === action.payload._id);
                if (searchIndex !== -1) {
                    state.searchResults[searchIndex] = action.payload;
                }
                // Update current video if it's the same
                if (state.currentVideo && state.currentVideo._id === action.payload._id) {
                    state.currentVideo = action.payload;
                }
            })
    }

})

export const { clearSearchResults, clearError } = feedSlice.actions;
export default feedSlice.reducer;