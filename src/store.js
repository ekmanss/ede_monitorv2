import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/CounterSlice'
import messagesReducer from "./slices/MessagesSlice";
import authReducer from "./slices/AuthSlice";

export default configureStore({
    reducer: {
        counter: counterReducer,
        messages: messagesReducer,
        auth: authReducer,
    }
})