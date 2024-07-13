import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/user";
import menuSlice from "./reducers/menuSlice";
import toolboxSlice from "./reducers/toolboxSlice";

const store = configureStore({
    reducer: {
        [userSlice.name]: userSlice.reducer,
        [menuSlice.name]: menuSlice.reducer,
        [toolboxSlice.name]: toolboxSlice.reducer,
    },
});

export default store;
