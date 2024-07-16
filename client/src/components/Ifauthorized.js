import React from 'react'
import { ACCESS_TOKEN_KEY, getItem } from '../utilities/localStorage'
import { Navigate, Outlet } from 'react-router-dom';

function Ifauthorized() {

    const curUser = getItem(ACCESS_TOKEN_KEY);

    return (

        curUser ? <Outlet /> : <Navigate to={'/login'} />

    )
}

export default Ifauthorized