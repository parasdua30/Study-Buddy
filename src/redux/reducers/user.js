import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
    remoteSocketId: null,
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setRemoteSocketId: (state, action) => {
            state.remoteSocketId = action.payload;
        },
        clearRemoteSocketId: (state) => {
            state.remoteSocketId = null;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
    },
});

export default userSlice;
export const { setRemoteSocketId, clearRemoteSocketId, setUsername } =
    userSlice.actions;
