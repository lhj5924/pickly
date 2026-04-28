'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { Logo } from '@/components/common';
import { useState } from 'react';
import { TermsPopup } from '@/components/common/Popup';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '@/content/terms';

const FooterWrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 3rem 1.5rem;
  text-align: center;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  width: 88px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 1rem 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 0.875rem;
  transform: translateY(1.25rem);
  border-left: 1px solid ${({ theme }) => theme.colors.border.default};
`;

const FooterSubLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  font-size: 0.75rem;
`;

const FooterSubLink = styled.button`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.625rem;
`;

const SocialIcon = styled.a`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const socialLinks = [
  { name: 'youtube', src: '/icons/social-youtube.svg', label: 'YouTube' },
  { name: 'instagram', src: '/icons/social-instagram.svg', label: 'Instagram' },
  { name: 'x', src: '/icons/social-x.svg', label: 'X' },
  { name: 'tiktok', src: '/icons/social-tiktok.svg', label: 'TikTok' },
];

const DOCS = {
  terms: TERMS_OF_SERVICE,
  privacy: PRIVACY_POLICY,
};

export function Footer() {
  const [popupType, setPopupType] = useState<'terms' | 'privacy' | null>(null);
  const currentDoc = popupType ? DOCS[popupType] : null;

  return (
    <FooterWrapper>
      <Logo />
      <FooterLinks>
        <FooterLink href="#">만든 이</FooterLink>
        <Divider />
        <FooterLink href="#">CONTACT US</FooterLink>
      </FooterLinks>
      <FooterSubLinks>
        <FooterSubLink onClick={() => setPopupType('terms')}>이용약관</FooterSubLink>
        <FooterSubLink onClick={() => setPopupType('privacy')}>개인정보처리방침</FooterSubLink>
      </FooterSubLinks>
      <SocialLinks>
        {socialLinks.map(({ name, src, label }) => (
          <SocialIcon key={name} href="#" aria-label={label}>
            <Image src={src} alt={label} width={24} height={24} />
          </SocialIcon>
        ))}
      </SocialLinks>

      {currentDoc && (
        <TermsPopup
          title={currentDoc.title}
          sections={currentDoc.sections}
          onClose={() => setPopupType(null)}
        />
      )}
    </FooterWrapper>
  );
}
