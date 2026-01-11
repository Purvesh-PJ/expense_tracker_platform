import styled, { css } from 'styled-components';

const variants = {
  success: css`
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%);
    color: #059669;
    border: 1px solid rgba(16, 185, 129, 0.3);
  `,
  danger: css`
    background: linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(251, 113, 133, 0.15) 100%);
    color: #E11D48;
    border: 1px solid rgba(244, 63, 94, 0.3);
  `,
  warning: css`
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%);
    color: #D97706;
    border: 1px solid rgba(245, 158, 11, 0.3);
  `,
  info: css`
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(96, 165, 250, 0.15) 100%);
    color: #2563EB;
    border: 1px solid rgba(59, 130, 246, 0.3);
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.neutral[600]};
    border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  `,
  primary: css`
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
    color: #4F46E5;
    border: 1px solid rgba(99, 102, 241, 0.3);
  `,
};

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  white-space: nowrap;
  text-transform: capitalize;

  ${({ variant = 'neutral' }) => variants[variant]}
`;

export default Badge;
