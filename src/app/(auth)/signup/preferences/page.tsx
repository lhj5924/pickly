'use client';

import styled, { keyframes } from 'styled-components';
import Image from 'next/image';
import { Button } from '@/components/common';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Category, BOOK_CATEGORIES } from '@/types';
import { ArrowRight } from 'lucide-react';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf6ef 0%, #fef9f4 50%, #e8ebd8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 46px;
`;

const Container = styled.div`
  width: 100%;
  min-height: 700px;
  height: calc(100vh - 92px);
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(155.99deg, #ffe5cc 10.49%, #d2ffca 93.28%);
  border: 6px solid #ffffff;
  border-radius: 30px 0px 0px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;

  @media (max-width: 768px) {
    padding: 2rem;
    min-height: 40vh;
    border-radius: 24px 24px 0 0;
  }
`;

const Logo = styled.h1`
  font-size: 110px;
  font-weight: 400;
  color: #57824c;
  font-family: 'Titan One', cursive;
  margin-bottom: 4rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 60px;
    margin-bottom: 0.5rem;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const JarImage = styled.div`
  animation: ${float} 4s ease-in-out infinite;
`;

const RightPanel = styled.div`
  flex: 2;
  background: rgba(255, 255, 255, 0.6);
  border: 6px solid #ffffff;
  border-radius: 0 24px 24px 0;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 2rem;
    min-height: 60vh;
    border-radius: 0 0 24px 24px;
  }
`;

const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryChip = styled.button<{ $selected: boolean }>`
  padding: 24px 42px;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  border: 1.5px solid ${({ theme, $selected }) => ($selected ? theme.colors.primary[500] : theme.colors.border.default)};
  background: ${({ theme, $selected }) => ($selected ? theme.colors.primary[50] : 'white')};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.primary[600] : theme.colors.text.secondary)};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;

export default function PreferencesPage() {
  const router = useRouter();
  const { updateSignupData, completeSignup } = useAuthStore();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories(prev =>
      prev.find(c => c.id === category.id) ? prev.filter(c => c.id !== category.id) : [...prev, category],
    );
  };

  const handleComplete = () => {
    if (selectedCategories.length < 3) return;

    updateSignupData({ favoriteCategories: selectedCategories });
    completeSignup();
    router.push('/home');
  };

  const isValid = selectedCategories.length >= 3;

  return (
    <PageWrapper>
      <Container>
        <LeftPanel>
          <Logo>Pickley</Logo>
          <JarImage>
            <Image src="/pickly-jar.png" alt="Pickly Jar" width={174} height={280} priority />
          </JarImage>
        </LeftPanel>

        <RightPanel>
          <Title>피클리에 오신 것을 환영해요!</Title>
          <Subtitle>선호하는 장르를 최소 3개 이상 선택해주세요.</Subtitle>

          <CategoryGrid>
            {BOOK_CATEGORIES.map(category => (
              <CategoryChip
                key={category.id}
                $selected={selectedCategories.some(c => c.id === category.id)}
                onClick={() => handleCategoryToggle(category)}
              >
                {category.name}
              </CategoryChip>
            ))}
          </CategoryGrid>

          <ButtonWrapper>
            <Button size="lg" disabled={!isValid} onClick={handleComplete} rightIcon={<ArrowRight size={20} />}>
              피클리 시작하기
            </Button>
          </ButtonWrapper>
        </RightPanel>
      </Container>
    </PageWrapper>
  );
}
