import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthLayout } from '../components/layout';
import { Button, Input } from '../components/base';
import { useAuth } from '../context';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Footer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const Register = () => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    clearError();
    setValidationError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    await register(formData.username, formData.email, formData.password);
  };

  const displayError = validationError || error;

  return (
    <AuthLayout title="Create account" subtitle="Start tracking your expenses">
      <Form onSubmit={handleSubmit}>
        {displayError && <ErrorMessage>{displayError}</ErrorMessage>}
        
        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        
        <Button type="submit" $fullWidth disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </Form>

      <Footer>
        Already have an account? <Link to="/login">Sign in</Link>
      </Footer>
    </AuthLayout>
  );
};

export default Register;
