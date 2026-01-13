'use client';

import styled, { css } from 'styled-components';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'kakao' | 'google' | 'stats';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 0.5rem;
  `,
  md: css`
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    border-radius: 0.75rem;
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
    border-radius: 1rem;
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[600]};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.text.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.neutral[200]};
    }
  `,
  outline: css`
    background: transparent;
    border: 1.5px solid ${({ theme }) => theme.colors.border.default};
    color: ${({ theme }) => theme.colors.text.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.neutral[50]};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.neutral[100]};
    }
  `,
  kakao: css`
    background: #fbe300;
    color: #000000;

    &:hover:not(:disabled) {
      background: #fbe300;
    }
  `,
  google: css`
    background: #ffffff;
    color: #000000;
    border: 1.5px solid ${({ theme }) => theme.colors.border.default};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.neutral[50]};
    }
  `,
  stats: css`
    height: 100px;
    background: linear-gradient(90deg, #fec893 0%, #90cf80 100%);
    border-radius: 20px;
    color: white;
    font-size: 1.5rem;
    font-weight: 700;

    &:hover:not(:disabled) {
      background: linear-gradient(90deg, #fedca1 0%, #a0d995 100%);
    }
  `,
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $isLoading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}
`;

const Spinner = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $isLoading={isLoading}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';
