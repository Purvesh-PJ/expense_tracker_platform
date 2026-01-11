import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.neutral[50]};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[50]};
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.neutral[200]};

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.lg};
  }

  &:last-child {
    border-top-right-radius: ${({ theme }) => theme.borderRadius.lg};
  }
`;

export const Td = styled.td`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  vertical-align: middle;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  background: ${({ theme }) => theme.colors.neutral[0]};
`;

export default Table;
