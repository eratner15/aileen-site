import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'AILEEN Magazine',
    description: 'Elegant travel, timeless style, and food that feels like home.',
    site: context.site,
    items: posts.map(post => {
      const [pillar, ...rest] = post.id.split('/');
      const slug = rest.join('/');
      return {
        title: post.data.title,
        description: post.data.metaDescription,
        pubDate: new Date(post.data.date),
        link: `/magazine/${pillar}/${slug}/`,
      };
    }),
  });
}
