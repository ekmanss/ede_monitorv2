import React from 'react'
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import AuthService from "../../services/auth";


//一个简单的鉴权操作
export const AuthWrapComponent = ({ children }) => {
    const user = AuthService.getCurrentUser();
    return (
        <Fragment>
            {/* 注意一定要replace ,导航到404空白页 或者 401无权*/}
            {user ? children : <Navigate to='/login' replace />}
        </Fragment>
    )
}
