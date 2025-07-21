import { useSelector } from 'react-redux';

export function useMyProfile() {
    return useSelector(state => state.userReducer.myProfile);
} 