import type { Meta, StoryObj } from '@storybook/react';
import { ArtistSocial } from '@/components/VercelChat/tools/ArtistSocial';

const meta = {
  title: 'Components/ArtistSocial',
  component: ArtistSocial,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ArtistSocial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spotify: Story = {
  args: {
    social: {
      id: '1',
      profile_url: 'open.spotify.com/artist/123abc',
      username: 'artist_name',
      account_id: '123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
};

export const Instagram: Story = {
  args: {
    social: {
      id: '2',
      profile_url: 'instagram.com/gliiicogliico',
      username: '@gliiicogliico',
      account_id: '123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
};

export const TikTok: Story = {
  args: {
    social: {
      id: '3',
      profile_url: 'tiktok.com/@artist',
      username: '@artist',
      account_id: '123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
};

export const YouTube: Story = {
  args: {
    social: {
      id: '4',
      profile_url: 'youtube.com/@artistchannel',
      username: '@artistchannel',
      account_id: '123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
};

export const MultipleSocials: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 w-96">
      <ArtistSocial social={{
        id: '1',
        profile_url: 'open.spotify.com/artist/123',
        username: 'artist_name',
        account_id: '123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }} />
      <ArtistSocial social={{
        id: '2',
        profile_url: 'instagram.com/gliiicogliico',
        username: '@gliiicogliico',
        account_id: '123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }} />
    </div>
  ),
};

