import styled from 'styled-components';

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gradients.dark};
  padding: ${({ theme }) => theme.spacing[4]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
    top: -200px;
    right: -200px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(244, 63, 94, 0.1) 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
  }
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 440px;
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing[10]};
  position: relative;
  z-index: 1;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const AuthLogo = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: ${({ theme }) => theme.colors.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
`;

const AuthTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

const AuthSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <AuthWrapper>
      <AuthCard>
        <AuthHeader>
          <AuthLogo>💰 ExpenseTracker</AuthLogo>
          {title && <AuthTitle>{title}</AuthTitle>}
          {subtitle && <AuthSubtitle>{subtitle}</AuthSubtitle>}
        </AuthHeader>
        {children}
      </AuthCard>
    </AuthWrapper>
  );
};

export default AuthLayout;
