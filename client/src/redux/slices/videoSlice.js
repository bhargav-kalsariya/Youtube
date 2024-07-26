import { axiosClient } from "../../utilities/axiosClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUserProfile = createAsyncThunk('video/getUserProfile', async (body) => {

    const response = await axiosClient.post('/user/othersProfile', body);

    console.log({ userprofile: response.data.result });
    return response.data.result;

});

const videoSlice = createSlice({

    name: "video",
    initialState: {
        userProfile: null,
        status: 'idle',
        error: null
    },
    extraReducers:
        (builder) => {
            builder
                .addCase(getUserProfile.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.userProfile = action.payload
                });
        }

});

export default videoSlice.reducer;