import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary[600]};
    }

    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary[700]};
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary[600]};
    border: 1px solid ${({ theme }) => theme.colors.primary[500]};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary[50]};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.secondary[500]};
    color: ${({ theme }) => theme.colors.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.secondary[600]};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.neutral[100]};
      color: ${({ theme }) => theme.colors.text.primary};
    }
  `,
};

const sizes = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `,
};

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;

  ${({ variant = 'primary' }) => variants[variant]}
  ${({ size = 'md' }) => sizes[size]}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export default Button;
