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
        console.log({ response });
        const updatedProfile = response.data.result;
        console.log({ updatedProfile });


    } catch (error) {

        return Promise.reject(error);

    }

})

const userSlice = createSlice({

    name: 'userSlice',
    initialState: {
        myProfile: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.myProfile = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.myProfile = action.payload;
            });
    }

});

export default userSlice.reducer;