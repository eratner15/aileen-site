import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'RatLinks by Evan Ratner',
    description: 'Business, culture, markets, and everything worth knowing.',
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
