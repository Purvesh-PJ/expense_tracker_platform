import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/users/register', { username, email, password });
            console.log('Registration Successful:', response.data);
            alert('Registration Successful');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Container>
            {/* <Heading>Register to our Expense Tracker Platform</Heading> */}
            <Form onSubmit={handleSubmit}>
                <Title>Register</Title>
                {error && <Error>{error}</Error>}
                <Input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <Input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <Input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <Button type="submit">Register</Button>
                <hr />
                <LoginLink to={'/Login'}>Login</LoginLink>
            </Form>
        </Container>
    );
};

// const Heading = styled.h1`
//     font-size: 36px;
//     font-weight: bold;
//     color: white;
// `;

const LoginLink = styled(Link)`
    text-decoration: none;
    color: #007bff;
`;

const Container = styled.div`
    display: flex;
    flex-direction : column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f4f4f4;
    background: linear-gradient(45deg, #f4a261, #2a9d8f); /* Gradient background */
`;

const Form = styled.form`
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-sizing : border-box;
    width : 100%;
    max-width : 400px;
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 1rem;
`;

const Input = styled.input`
    padding: 0.8rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    box-sizing : border-box;
`;

const Button = styled.button`
    padding: 0.8rem;
    font-size: 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background: #0056b3;
    }
`;

const Error = styled.div`
    color: red;
    font-size: 0.9rem;
`;

export default RegisterPage;
