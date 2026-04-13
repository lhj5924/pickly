import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { QueryProvider } from '@/components/providers/QueryProvider';

// Test component that reads query client config
function ConfigReader() {
  const queryClient = useQueryClient();
  const defaults = queryClient.getDefaultOptions();

  return (
    <div>
      <span data-testid="retry">{String(defaults.queries?.retry)}</span>
      <span data-testid="refetchOnWindowFocus">{String(defaults.queries?.refetchOnWindowFocus)}</span>
      <span data-testid="staleTime">{String(defaults.queries?.staleTime)}</span>
      <span data-testid="gcTime">{String(defaults.queries?.gcTime)}</span>
      <span data-testid="mutation-retry">{String(defaults.mutations?.retry)}</span>
    </div>
  );
}

describe('QueryProvider', () => {
  it('should provide QueryClient with correct default options', () => {
    render(
      <QueryProvider>
        <ConfigReader />
      </QueryProvider>,
    );

    expect(screen.getByTestId('retry').textContent).toBe('1');
    expect(screen.getByTestId('refetchOnWindowFocus').textContent).toBe('false');
    expect(screen.getByTestId('staleTime').textContent).toBe('120000'); // 2분
    expect(screen.getByTestId('gcTime').textContent).toBe('600000'); // 10분
    expect(screen.getByTestId('mutation-retry').textContent).toBe('0');
  });

  it('should render children', () => {
    render(
      <QueryProvider>
        <div data-testid="child">Hello</div>
      </QueryProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
