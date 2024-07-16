import React from 'react'
import { ACCESS_TOKEN_KEY, getItem } from '../utilities/localStorage'
import { Navigate, Outlet } from 'react-router-dom';

function Ifunauthorized() {

    const curUser = getItem(ACCESS_TOKEN_KEY);

    return (

        curUser ? <Navigate to={'/'} /> : <Outlet />

    )
}

export default Ifunauthorized