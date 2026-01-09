import styled, { css } from 'styled-components';

const baseStyles = css`
  margin: 0;
  color: ${({ $color, theme }) => {
    if ($color === 'secondary') return theme.colors.text.secondary;
    if ($color === 'success') return theme.colors.success;
    if ($color === 'error') return theme.colors.error;
    return theme.colors.text.primary;
  }};
`;

export const H1 = styled.h1`
  ${baseStyles}
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const H2 = styled.h2`
  ${baseStyles}
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const H3 = styled.h3`
  ${baseStyles}
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const H4 = styled.h4`
  ${baseStyles}
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const Text = styled.p`
  ${baseStyles}
  font-size: ${({ $size, theme }) => {
    const sizes = {
      xs: theme.typography.fontSize.xs,
      sm: theme.typography.fontSize.sm,
      md: theme.typography.fontSize.base,
      lg: theme.typography.fontSize.lg,
    };
    return sizes[$size] || sizes.md;
  }};
  font-weight: ${({ $weight, theme }) => {
    const weights = {
      regular: theme.typography.fontWeight.regular,
      medium: theme.typography.fontWeight.medium,
      semibold: theme.typography.fontWeight.semibold,
      bold: theme.typography.fontWeight.bold,
    };
    return weights[$weight] || weights.regular;
  }};
`;

export const Label = styled.span`
  ${baseStyles}
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const Caption = styled.span`
  ${baseStyles}
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
