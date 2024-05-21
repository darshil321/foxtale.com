import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import Search, { SearchSkeleton } from './search';
import LogoSquare from '@/components/logo-square';

export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <nav className="relative flex items-center justify-between border-b p-2 shadow-md md:border-none md:shadow-none lg:px-0 lg:py-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex ">
          <Link
            href="/collections/shop-1"
            className="ml-2 mr-2 flex h-[32px] w-[95px] items-center  justify-center md:h-full md:w-auto lg:mr-6"
          >
            <LogoSquare />
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline "
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex ">
          {/* <Suspense fallback={<OpenCart />}>
            <Cart />
          </Suspense> */}
        </div>
      </div>
    </nav>
  );
}
