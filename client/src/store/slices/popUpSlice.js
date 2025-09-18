import {createSlice} from "@reduxjs/toolkit";

const popUpSlice = createSlice({
    name: "popup",
    initialState: {
        settingPopup: false,
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        returnBookPopup: false,
        addNewAdminPopup: false,
    },
    reducers: {
        toggleSettingPopup(state){
            state.settingPopup = !state.settingPopup;
        },
        toggleAddBookPopup(state){
            state.addBookPopup = !state.addBookPopup;
        },
        toggleReadBookPopup(state){
            state.readBookPopup = !state.readBookPopup;
        },
        toggleRecordBookPopup(state){
            state.recordBookPopup = !state.recordBookPopup;
        },
        toggleAddNewAdminPopup(state){
            state.addNewAdminPopup = !state.addNewAdminPopup;
        },
        toggleReturnBookPopup(state){
            state.returnBookPopup = !state.returnBookPopup;
        },
        closeAllPopup(state){
            state.settingPopup = false;
            state.addBookPopup = false;
            state.readBookPopup = false;
            state.recordBookPopup = false;
            state.returnBookPopup = false;
            state.addNewAdminPopup = false;
        },
    },
});

export const {
    toggleSettingPopup,
    toggleAddBookPopup,
    toggleReadBookPopup,
    toggleRecordBookPopup,
    toggleReturnBookPopup,
    toggleAddNewAdminPopup,
    closeAllPopup
} = popUpSlice.actions;

export default popUpSlice.reducer;