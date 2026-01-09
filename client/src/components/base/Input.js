import styled, { css } from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.neutral[400]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    cursor: not-allowed;
  }

  ${({ $error, theme }) =>
    $error &&
    css`
      border-color: ${theme.colors.error};

      &:focus {
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 3px ${theme.colors.secondary[100]};
      }
    `}
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
`;

const HelperText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Input = ({ label, error, helperText, id, ...props }) => {
  return (
    <InputWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput id={id} $error={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
};

export default Input;
