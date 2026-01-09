import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerCircle = styled.div`
  width: ${({ $size }) => {
    const sizes = { sm: '16px', md: '24px', lg: '32px' };
    return sizes[$size] || sizes.md;
  }};
  height: ${({ $size }) => {
    const sizes = { sm: '16px', md: '24px', lg: '32px' };
    return sizes[$size] || sizes.md;
  }};
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Spinner = ({ size = 'md' }) => {
  return (
    <SpinnerWrapper role="status" aria-label="Loading">
      <SpinnerCircle $size={size} />
    </SpinnerWrapper>
  );
};

export default Spinner;
