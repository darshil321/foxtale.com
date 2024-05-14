import OpengraphImage from 'components/opengraph-image';
import { getCollection } from 'lib/shopify';

export default async function Image() {
  const collection = await getCollection('all');
  const title = collection?.seo?.title || collection?.title;

  return await OpengraphImage({ title });
}
