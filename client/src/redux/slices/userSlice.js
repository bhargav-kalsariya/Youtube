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

})

const userSlice = createSlice({

    name: 'userSlice',
    initialState: {
        myProfile: {}
    },
    extraReducers: (builder) => {

        builder.addCase(getMyProfile.fulfilled, (state, action) => {
            state.myProfile = action.payload;
        })

    }

});

export default userSlice.reducer;