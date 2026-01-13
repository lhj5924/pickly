'use client';

import styled from 'styled-components';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

const Container = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const StarButton = styled.button<{ $active: boolean; $readonly: boolean }>`
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary[500] : theme.colors.neutral[300]};
  cursor: ${({ $readonly }) => ($readonly ? 'default' : 'pointer')};
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme, $readonly }) =>
      $readonly ? undefined : theme.colors.primary[400]};
  }
`;

export const StarRating = ({
  rating,
  onChange,
  readonly = false,
  size = 24,
}: StarRatingProps) => {
  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  return (
    <Container>
      {[1, 2, 3, 4, 5].map((value) => (
        <StarButton
          key={value}
          type="button"
          $active={value <= rating}
          $readonly={readonly}
          onClick={() => handleClick(value)}
        >
          <Star
            size={size}
            fill={value <= rating ? 'currentColor' : 'none'}
          />
        </StarButton>
      ))}
    </Container>
  );
};
