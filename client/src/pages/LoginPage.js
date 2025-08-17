import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Access login function from AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/users/login', { email, password });
            console.log('Login Successful:', response.data);
            // Use login function to set the token in AuthContext and localStorage
            login(response.data.token);
            // Redirect to the dashboard
            navigate('/DataVisualization');
        } 
        catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Container>
            <Heading>Expense Tracker Platform</Heading>
            <Form onSubmit={handleSubmit}>
                <Title>Login</Title>
                {error && <Error>{error}</Error>}
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
                <Button type="submit">Login</Button>
                <hr />
                <SignupLink to={'/Register'}>Sign up</SignupLink>
            </Form>
        </Container>
    );
};

export default LoginPage;

const SignupLink = styled(Link)`
    text-decoration: none;
    color: #007bff;
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(45deg, #f4a261, #2a9d8f); /* Gradient background */
    color: white;
    font-family: 'Arial', sans-serif;
    text-align: center;
`;

const Heading = styled.h1`
    position: absolute;
    top: 20px;
    font-size: 36px;
    font-weight: bold;
    color: white;
    z-index: -1; /* To place behind the form */
`;

const Form = styled.form`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    box-sizing : border-box;
`;

const Title = styled.h2`
    margin-bottom: 1rem;
    font-size: 24px;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
        background: #0056b3;
    }
`;

const Error = styled.p`
    color: red;
    font-size: 14px;
    margin-bottom: 1rem;
`;
