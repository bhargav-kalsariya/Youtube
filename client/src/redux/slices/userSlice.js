import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosClient } from '../../utilities/axiosClient';

export const getMyProfile = createAsyncThunk('user/profile', async () => {

    try {

        const response = await axiosClient.get('/user/profile');
        const userData = response.data.result;

        return userData;

    } catch (error) {

        return Promise.reject(error);

    }

});

export const updateProfile = createAsyncThunk('user/updateProfile', async (body) => {

    try {

        const response = await axiosClient.post('/user/updateProfile', body);
        const updatedProfile = response.data.result;

        return updatedProfile;

    } catch (error) {

        return Promise.reject(error);

    }

})

export const getWatchHistory = createAsyncThunk('user/watchHistory', async (limit = 50) => {
    try {
        const response = await axiosClient.get(`/user/watchHistory?limit=${limit}`);
        return response.data.result.data;
    } catch (error) {
        return Promise.reject(error);
    }
});

export const clearWatchHistory = createAsyncThunk('user/clearWatchHistory', async () => {
    try {
        const response = await axiosClient.delete('/user/watchHistory');
        return response.data.result;
    } catch (error) {
        return Promise.reject(error);
    }
});

const userSlice = createSlice({

    name: 'userSlice',
    initialState: {
        myProfile: null,
        watchHistory: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.myProfile = action.payload;
                state.loading = false;
            })
            .addCase(getMyProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.myProfile = action.payload;
                state.loading = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getWatchHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWatchHistory.fulfilled, (state, action) => {
                state.watchHistory = action.payload;
                state.loading = false;
            })
            .addCase(getWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(clearWatchHistory.fulfilled, (state) => {
                state.watchHistory = [];
                state.loading = false;
            })
            .addCase(clearWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }

});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;