'use client';

import clsx from 'clsx';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({ item }: { item: Menu }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <div>
      <Link
        href={item.path}
        className={clsx(
          'block p-1 text-sm text-[#2c2c2c] underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm ',
          {
            'text-black ': active
          }
        )}
      >
        {item.title}
      </Link>
    </div>
  );
};

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav>
      <span className="block px-1 pb-3 text-sm font-medium leading-7  tracking-widest text-black md:inline-block">
        {menu.length > 0 ? menu[0]?.title : ''}
      </span>
      {/* <br /> */}
      {menu?.slice(1, menu.length).map((item: Menu) => {
        return <FooterMenuItem key={item.title} item={item} />;
      })}
    </nav>
  );
}
