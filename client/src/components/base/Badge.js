import styled, { css } from 'styled-components';

const variants = {
  success: css`
    background-color: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[700]};
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.secondary[100]};
    color: ${({ theme }) => theme.colors.secondary[700]};
  `,
  warning: css`
    background-color: #FFF3E0;
    color: #E65100;
  `,
  info: css`
    background-color: #E3F2FD;
    color: #1565C0;
  `,
  neutral: css`
    background-color: ${({ theme }) => theme.colors.neutral[200]};
    color: ${({ theme }) => theme.colors.neutral[700]};
  `,
};

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  white-space: nowrap;

  ${({ variant = 'neutral' }) => variants[variant]}
`;

export default Badge;
