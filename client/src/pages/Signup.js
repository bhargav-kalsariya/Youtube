import React, { useState } from 'react'
import './Signup.scss';
import { Link } from 'react-router-dom'

function Signup() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {

        e.preventDefault();
        console.log(username, email, password);

    }

    return (
        <div className='signup'>
            <div className='signup-box'>
                <h2 className='heading'>Signup</h2>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="name">Name</label>
                    <input type="text" className="name" id="name" onChange={(e) => { setUsername(e.target.value) }} />

                    <label htmlFor="email">Email</label>
                    <input type="email" className="email" id="email" onChange={(e) => { setEmail(e.target.value) }} />

                    <label htmlFor="password">Password</label>
                    <input type="password" className="password" id="password" onChange={(e) => { setPassword(e.target.value) }} />

                    <input type="submit" className="submit" id="" />
                </form>
                <p className='subheading'>Already have an account?
                    <Link to='/login' className='login-btn'>  Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup