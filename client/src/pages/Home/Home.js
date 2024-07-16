import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import { useDispatch } from 'react-redux';
import { getMyProfile } from '../../redux/slices/userSlice';

function Home() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch])

    return (
        <Header />
    )
}

export default Home