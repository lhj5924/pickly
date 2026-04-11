'use client';

import styled from 'styled-components';

const FooterWrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 3rem 1.5rem;
  text-align: center;
`;

const FooterLogo = styled.p`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: 'Pretendard Variable', sans-serif;
  margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const FooterSubLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
`;

export function Footer() {
  return (
    <FooterWrapper>
      <FooterLogo>pickly</FooterLogo>
      <FooterLinks>
        <FooterLink href="#">고객센터</FooterLink>
        <FooterLink href="#">CONTACT US</FooterLink>
      </FooterLinks>
      <FooterSubLinks>
        <span>이용약관</span>
        <span>개인정보처리방침</span>
      </FooterSubLinks>
      <SocialLinks>
        <SocialIcon href="#">Y</SocialIcon>
        <SocialIcon href="#">@</SocialIcon>
        <SocialIcon href="#">X</SocialIcon>
        <SocialIcon href="#">♪</SocialIcon>
      </SocialLinks>
    </FooterWrapper>
  );
}
