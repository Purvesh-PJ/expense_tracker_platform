import styled, { css } from 'styled-components';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;

  ${({ $padding, theme }) => {
    const paddingMap = {
      none: '0',
      sm: theme.spacing[3],
      md: theme.spacing[4],
      lg: theme.spacing[6],
    };
    return css`
      padding: ${paddingMap[$padding] || paddingMap.md};
    `;
  }}

  ${({ $hoverable, theme }) =>
    $hoverable &&
    css`
      transition: box-shadow ${theme.transitions.fast}, transform ${theme.transitions.fast};
      cursor: pointer;

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
      }
    `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CardContent = styled.div``;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
export default Card;
