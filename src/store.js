import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/CounterSlice'
import messagesReducer from "./slices/MessagesSlice";

export default configureStore({
    reducer: {
        counter: counterReducer,
        messages: messagesReducer,
    }
})