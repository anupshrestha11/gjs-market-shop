import type { NextPageWithLayout } from '@/types';
import Layout from '@/layouts/_layout';
import { useFollowedShopsProducts } from '@/data/shop';
import Grid from '@/components/product/grid';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';

function Products() {
  const { products, isLoading } = useFollowedShopsProducts({ limit: 15 });

  return (
    <>
      <div className="flex flex-col-reverse flex-wrap items-center justify-between px-4 pt-5 pb-4 xs:flex-row xs:space-x-4 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <div className="pt-3 xs:pt-0">
          Total {products.length} products found
        </div>
      </div>
      <Grid
        products={products}
        hasNextPage={false}
        isLoadingMore={false}
        isLoading={isLoading}
      />
    </>
  );
}

const Feed: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Top Products"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.feed}
      />
      <Products />
    </>
  );
};

Feed.authorization = true;
Feed.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Feed;
