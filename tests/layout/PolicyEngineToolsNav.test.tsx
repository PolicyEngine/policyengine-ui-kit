import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../../src/layout/header';
import { PolicyEngineHeader } from '../../src/layout/PolicyEngineHeader';

/** A client-side link: marks what it renders so tests can tell it apart. */
function ClientLink({
  children,
  href,
  to: _to,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: string }) {
  return (
    <a href={href} data-client-link="" {...props}>
      {children}
    </a>
  );
}

// Records whether the header cancelled each click, then cancels it so jsdom
// doesn't try to navigate. Listeners on document run after React's handlers.
let clickWasPrevented: boolean[] = [];
function recordClick(event: MouseEvent) {
  if ((event.target as Element | null)?.closest('a')) {
    clickWasPrevented.push(event.defaultPrevented);
    event.preventDefault();
  }
}

beforeEach(() => {
  clickWasPrevented = [];
  document.addEventListener('click', recordClick);
});

afterEach(() => {
  document.removeEventListener('click', recordClick);
});

async function openDesktopMenu(label: string) {
  await userEvent.click(screen.getByRole('button', { name: label }));
}

async function openMobileMenu() {
  await userEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }));
  return screen.getByRole('dialog');
}

describe('PolicyEngineHeader Tools menu', () => {
  it('opens the main app and the US tools as plain links even with a router link and onNavigate', async () => {
    const onNavigate = vi.fn();
    render(
      <PolicyEngineHeader
        country="us"
        linkComponent={ClientLink}
        onNavigate={onNavigate}
      />,
    );

    await openDesktopMenu('Tools');
    const rows = [
      ['PolicyEngine app', 'https://app.policyengine.org/us'],
      ['CliffWatch', 'https://policyengine.org/us/cliffwatch'],
      ['Coverage Compass', 'https://policyengine.org/us/coverage-compass'],
      ['GiveCalc', 'https://policyengine.org/us/givecalc'],
      ['Marriage calculator', 'https://policyengine.org/us/marriage'],
      ['QBI deduction calculator', 'https://policyengine.org/us/qbi-calculator'],
      ['SPM threshold calculator', 'https://policyengine.org/us/spm-calculator'],
      ['TANF calculator', 'https://policyengine.org/us/tanf-calculator'],
    ];
    const panel = screen
      .getByRole('link', { name: 'CliffWatch' })
      .closest<HTMLElement>('div[style*="position: absolute"]')!;
    expect(
      within(panel)
        .getAllByRole('link')
        .map((link) => [link.textContent, link.getAttribute('href')]),
    ).toEqual(rows);
    for (const link of within(panel).getAllByRole('link')) {
      expect(link).not.toHaveAttribute('data-client-link');
    }

    await userEvent.click(screen.getByRole('link', { name: 'QBI deduction calculator' }));
    expect(onNavigate).not.toHaveBeenCalled();
    expect(clickWasPrevented).toEqual([false]);
    // The click also closes the dropdown, for a browser that keeps the page
    // (a middle click, or a click the browser refuses to follow).
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: 'PolicyEngine app' })).toBeNull(),
    );
  });

  it('still routes the other dropdowns through the link component and onNavigate', async () => {
    const onNavigate = vi.fn();
    render(
      <PolicyEngineHeader
        country="us"
        linkComponent={ClientLink}
        onNavigate={onNavigate}
      />,
    );

    await openDesktopMenu('About');
    const team = screen.getByRole('link', { name: /Team/ });
    expect(team).toHaveAttribute('data-client-link');

    await userEvent.click(team);
    expect(onNavigate).toHaveBeenCalledWith('https://policyengine.org/us/team');
    expect(clickWasPrevented).toEqual([true]);
  });

  it('sizes the dropdown to its longest row so labels stay on one line', async () => {
    render(<PolicyEngineHeader country="us" />);

    await openDesktopMenu('Tools');
    const panel = screen
      .getByRole('link', { name: 'QBI deduction calculator' })
      .closest<HTMLElement>('div[style*="position: absolute"]');
    expect(panel).not.toBeNull();
    expect(panel!.contains(screen.getByRole('link', { name: 'CliffWatch' }))).toBe(
      true,
    );
    expect(panel!.style.width).toBe('max-content');
    expect(panel!.style.minWidth).toBe('220px');
    expect(panel!.style.maxWidth).toBe('min(28rem, calc(100vw - 32px))');
  });

  it('lists the main app and the UK tools for the UK', async () => {
    render(<PolicyEngineHeader country="uk" />);

    await openDesktopMenu('Tools');
    const panel = screen
      .getByRole('link', { name: 'UK CliffWatch' })
      .closest<HTMLElement>('div[style*="position: absolute"]')!;
    expect(
      within(panel)
        .getAllByRole('link')
        .map((link) => [link.textContent, link.getAttribute('href')]),
    ).toEqual([
      ['PolicyEngine app', 'https://app.policyengine.org/uk'],
      ['Marriage calculator', 'https://policyengine.org/uk/marriage'],
      ['Student loan calculator', 'https://policyengine.org/uk/uk-student-loan-calculator'],
      ['UK CliffWatch', 'https://policyengine.org/uk/uk-cliff-watch'],
    ]);
    expect(screen.queryByRole('link', { name: 'CliffWatch' })).toBeNull();
    for (const link of document.querySelectorAll('a')) {
      expect(link.getAttribute('href')).not.toMatch(/\/uk\/cliffwatch(\/|\?|$)/);
    }
  });

  it('links the main app on the appUrl it is given', async () => {
    render(
      <PolicyEngineHeader
        country="uk"
        baseUrl="https://staging.policyengine.org"
        appUrl="https://app.staging.policyengine.org/"
      />,
    );

    await openDesktopMenu('Tools');
    expect(screen.getByRole('link', { name: 'PolicyEngine app' })).toHaveAttribute(
      'href',
      'https://app.staging.policyengine.org/uk',
    );
    expect(screen.getByRole('link', { name: 'UK CliffWatch' })).toHaveAttribute(
      'href',
      'https://staging.policyengine.org/uk/uk-cliff-watch',
    );
  });

  it('has no Tools menu for another country', async () => {
    render(<PolicyEngineHeader country="ca" />);

    expect(screen.queryByRole('button', { name: 'Tools' })).toBeNull();
    const menu = await openMobileMenu();
    expect(within(menu).queryByText('Tools')).toBeNull();
    expect(within(menu).getByText('Research')).toBeInTheDocument();
  });

  it('lists the main app and the tools as plain links in the mobile menu', async () => {
    const onNavigate = vi.fn();
    render(
      <PolicyEngineHeader
        country="us"
        linkComponent={ClientLink}
        onNavigate={onNavigate}
      />,
    );

    const menu = await openMobileMenu();
    expect(within(menu).getByText('Tools')).toBeInTheDocument();
    const mainApp = within(menu).getByRole('link', { name: 'PolicyEngine app' });
    expect(mainApp).toHaveAttribute('href', 'https://app.policyengine.org/us');
    expect(mainApp).not.toHaveAttribute('data-client-link');
    const cliffWatch = within(menu).getByRole('link', { name: 'CliffWatch' });
    expect(cliffWatch).toHaveAttribute('href', 'https://policyengine.org/us/cliffwatch');
    expect(cliffWatch).not.toHaveAttribute('data-client-link');
    expect(within(menu).getByRole('link', { name: 'Team' })).toHaveAttribute(
      'data-client-link',
    );

    await userEvent.click(cliffWatch);
    expect(onNavigate).not.toHaveBeenCalled();
    expect(clickWasPrevented).toEqual([false]);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('lets the mobile menu scroll above the sticky header', async () => {
    render(<PolicyEngineHeader country="us" />);

    const menu = await openMobileMenu();
    expect(menu.style.overflowY).toBe('auto');
    expect(Number(menu.style.zIndex)).toBeGreaterThan(1000);
    expect(within(menu).getByRole('link', { name: 'Donate' })).toBeInTheDocument();
  });

  it('leaves mobile tool links to the browser when there is no router', async () => {
    const onNavigate = vi.fn();
    render(<PolicyEngineHeader country="uk" onNavigate={onNavigate} />);

    const menu = await openMobileMenu();
    await userEvent.click(within(menu).getByRole('link', { name: 'UK CliffWatch' }));
    expect(onNavigate).not.toHaveBeenCalled();
    expect(clickWasPrevented).toEqual([false]);

    const menuAgain = await openMobileMenu();
    await userEvent.click(within(menuAgain).getByRole('link', { name: 'Team' }));
    expect(onNavigate).toHaveBeenCalledWith('https://policyengine.org/uk/team');
    expect(clickWasPrevented).toEqual([false, true]);
  });
});

describe('Header external dropdowns', () => {
  const navItems = [
    {
      label: 'Zones',
      href: '/zones',
      external: true,
      children: [
        { label: 'Zone row', href: 'https://example.org/zone' },
        { label: 'Local row', href: '/local', external: false },
      ],
    },
    {
      label: 'Mixed',
      href: '/mixed',
      children: [
        { label: 'Routed row', href: '/routed' },
        { label: 'Other zone row', href: 'https://example.org/other', external: true },
      ],
    },
  ];

  it('passes the item flag to rows on desktop unless a row sets its own', async () => {
    const onNavigate = vi.fn();
    render(
      <Header navItems={navItems} linkComponent={ClientLink} onNavigate={onNavigate} />,
    );

    await openDesktopMenu('Zones');
    expect(screen.getByRole('link', { name: 'Zone row' })).not.toHaveAttribute(
      'data-client-link',
    );
    expect(screen.getByRole('link', { name: 'Local row' })).toHaveAttribute(
      'data-client-link',
    );
    await userEvent.click(screen.getByRole('link', { name: 'Zone row' }));
    expect(onNavigate).not.toHaveBeenCalled();

    await openDesktopMenu('Mixed');
    expect(screen.getByRole('link', { name: 'Routed row' })).toHaveAttribute(
      'data-client-link',
    );
    await userEvent.click(screen.getByRole('link', { name: 'Other zone row' }));
    expect(onNavigate).not.toHaveBeenCalled();
    expect(clickWasPrevented).toEqual([false, false]);
  });

  it('passes the item flag to rows on mobile unless a row sets its own', async () => {
    const { unmount } = render(
      <Header navItems={navItems} linkComponent={ClientLink} />,
    );
    const routedMenu = await openMobileMenu();
    expect(
      within(routedMenu).getByRole('link', { name: 'Zone row' }),
    ).not.toHaveAttribute('data-client-link');
    expect(
      within(routedMenu).getByRole('link', { name: 'Local row' }),
    ).toHaveAttribute('data-client-link');
    expect(
      within(routedMenu).getByRole('link', { name: 'Routed row' }),
    ).toHaveAttribute('data-client-link');
    expect(
      within(routedMenu).getByRole('link', { name: 'Other zone row' }),
    ).not.toHaveAttribute('data-client-link');
    unmount();

    const onNavigate = vi.fn();
    render(<Header navItems={navItems} onNavigate={onNavigate} />);
    for (const name of ['Zone row', 'Other zone row']) {
      const menu = await openMobileMenu();
      await userEvent.click(within(menu).getByRole('link', { name }));
      expect(screen.queryByRole('dialog')).toBeNull();
    }
    expect(onNavigate).not.toHaveBeenCalled();

    const menu = await openMobileMenu();
    await userEvent.click(within(menu).getByRole('link', { name: 'Local row' }));
    expect(onNavigate).toHaveBeenCalledWith('/local');
    expect(clickWasPrevented).toEqual([false, false, true]);
  });
});

describe('Header external items', () => {
  const navItems = [
    { label: 'Zone page', href: 'https://example.org/zone', external: true },
    { label: 'Local page', href: '/local' },
  ];

  it('renders a top-level external item as a plain link on desktop', async () => {
    const onNavigate = vi.fn();
    render(
      <Header navItems={navItems} linkComponent={ClientLink} onNavigate={onNavigate} />,
    );

    const nav = document.querySelector<HTMLElement>('.hidden.lg\\:flex')!;
    const zone = within(nav).getByRole('link', { name: 'Zone page' });
    expect(zone).not.toHaveAttribute('data-client-link');
    expect(within(nav).getByRole('link', { name: 'Local page' })).toHaveAttribute(
      'data-client-link',
    );

    await userEvent.click(zone);
    expect(onNavigate).not.toHaveBeenCalled();
    expect(clickWasPrevented).toEqual([false]);
  });

  it('renders a top-level external item as a plain link on mobile', async () => {
    const { unmount } = render(
      <Header navItems={navItems} linkComponent={ClientLink} />,
    );
    const routedMenu = await openMobileMenu();
    expect(
      within(routedMenu).getByRole('link', { name: 'Zone page' }),
    ).not.toHaveAttribute('data-client-link');
    expect(
      within(routedMenu).getByRole('link', { name: 'Local page' }),
    ).toHaveAttribute('data-client-link');
    unmount();

    const onNavigate = vi.fn();
    render(<Header navItems={navItems} onNavigate={onNavigate} />);

    const menu = await openMobileMenu();
    await userEvent.click(within(menu).getByRole('link', { name: 'Zone page' }));
    expect(onNavigate).not.toHaveBeenCalled();

    const menuAgain = await openMobileMenu();
    await userEvent.click(within(menuAgain).getByRole('link', { name: 'Local page' }));
    expect(onNavigate).toHaveBeenCalledWith('/local');
    expect(clickWasPrevented).toEqual([false, true]);
  });
});
