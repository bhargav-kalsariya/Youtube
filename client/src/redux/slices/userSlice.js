import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({

    name: 'userSlice',
    initialState: {
        myProfile: {}
    },
    extraReducers: (builder) => {



    }

});

export default userSlice.reducer;