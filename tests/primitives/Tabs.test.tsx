import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../src/primitives/Tabs';

describe('Tabs', () => {
  it('shows default tab content', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>,
    );
    expect(screen.getByText('Content A')).toBeInTheDocument();
  });

  it('switches tabs on click', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>,
    );
    await user.click(screen.getByText('Tab B'));
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });
});
