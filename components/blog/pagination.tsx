import React from "react";
import Link from "next/link";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
}
export default function Pagination(props: PaginationProps) {
  const { totalPage, currentPage } = props
  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <Link href="/posts/page/1" className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <span className="sr-only">Previous</span>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </Link>
        </li>
        {
          Array(totalPage - 1).fill(0).map((_, index) => (
            <li key={index} >
              <Link
                className={`
                  px-3
                  py-2
                  leading-tight
                  text-gray-500
                  bg-white
                  border
                  border-gray-300
                  dark:bg-gray-800
                  dark:border-gray-700
                  dark:text-gray-400
                  ${
                    currentPage === index + 1 ?
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white' :
                      'hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
                  }
                  `}
                  aria-current={currentPage === index + 1 ? 'page' : undefined}
                  href={`/posts/page/${index + 1}`}
                >
                  { index + 1 }
                </Link>
              </li>
            ))
        }
        <li>
          <Link href={`/posts/page/${totalPage - 1}`} className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <span className="sr-only">Next</span>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

