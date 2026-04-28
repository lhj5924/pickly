'use client';

import { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import type { TermsSection } from '@/content/terms';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to { opacity: 1; transform: translateY(0); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.2s ease;
`;

const Dialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 0.25s ease;
  overflow: hidden;
  outline: none;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Body = styled.div`
  overflow-y: auto;
  padding: 1.5rem;
  flex: 1;
`;

const SectionItem = styled.div`
  & + & {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
  }
`;

const SectionHeading = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.375rem;
`;

const SectionBody = styled.p`
  font-size: 0.875rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: justify;
`;

const PopupFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
`;

const CloseTextButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

interface TermsPopupProps {
  title: string;
  sections: TermsSection[];
  onClose: () => void;
}

export function TermsPopup({ title, sections, onClose }: TermsPopupProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <Backdrop onClick={onClose}>
      <Dialog
        ref={dialogRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-popup-title"
      >
        <Header>
          <Title id="terms-popup-title">{title}</Title>
          <CloseButton onClick={onClose} aria-label="닫기">
            ×
          </CloseButton>
        </Header>

        <Body>
          {sections.map((section, i) => (
            <SectionItem key={i}>
              {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
              <SectionBody>{section.body}</SectionBody>
            </SectionItem>
          ))}
        </Body>

        <PopupFooter>
          <CloseTextButton onClick={onClose}>닫기</CloseTextButton>
        </PopupFooter>
      </Dialog>
    </Backdrop>
  );
}
