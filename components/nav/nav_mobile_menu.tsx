import Link from "next/link";
export default function NavMobileMenu({reveal}) {
  return (
    <div className={`z-40 fixed top-0 left-0 h-screen transition-all overflow-x-hidden duration-500 bg-opacity-95 bg-primary ${reveal? "w-full": "w-0"}`}>
      <div className="absolute w-full top-1/3">
        <ul className="ml-12">
          <li>
            <Link href="/" className="text-2xl text-white hover:no-underline">
              Wells
            </Link>
          </li>
          <li className="mt-16">
            <Link href="/portfolio" className="text-xl text-white hover:no-underline">
              作品集
            </Link>
          </li>
          <li className="mt-4">
            <Link href="/about" className="text-xl text-white hover:no-underline">
              經歷
            </Link>
          </li>
          <li className="mt-4">
            <Link
              href="https://blog.wells.tw"
              className="text-xl text-white hover:no-underline">
              部落格
            </Link>
          </li>
          <li className="mt-16">
            <Link
              href="mailto:jhang0912407249@gmail.com"
              className={`border border-secondary text-white px-5 pt-3 pb-2 rounded-[10px] bg-secondary dark:hover:border-primary hover:bg-white hover:text-secondary hover:no-underline`}>
               聯絡我 
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
