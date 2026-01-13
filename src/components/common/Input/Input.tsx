'use client';

import styled, { css } from 'styled-components';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Wrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InputWrapper = styled.div<{ $hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1.5px solid ${({ theme, $hasError }) =>
    $hasError ? theme.colors.error : theme.colors.border.default};
  border-radius: 0.5rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) =>
      $hasError ? 'rgba(239, 68, 68, 0.1)' : theme.colors.primary[100]};
  }
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background: transparent;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, fullWidth = false, ...props }, ref) => {
    return (
      <Wrapper $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputWrapper $hasError={!!error}>
          {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
          <StyledInput ref={ref} {...props} />
          {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
        </InputWrapper>
        {error && <ErrorText>{error}</ErrorText>}
      </Wrapper>
    );
  }
);

Input.displayName = 'Input';
