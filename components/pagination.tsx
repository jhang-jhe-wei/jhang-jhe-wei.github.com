import React from "react";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
}
export default function Pagination({ totalPage, currentPage }: PaginationProps) {
  return (
    <>
      <div className="flex items-center justify-center px-4 pb-2 bg-white lg:px-0 sm:px-6">
        <div className="flex items-center justify-between w-full border-t border-gray-200 lg:w-3/5">
          <div className="flex items-center pt-3 text-gray-600 cursor-pointer hover:text-indigo-700">
            <svg width={14} height={8} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.1665 4H12.8332" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.1665 4L4.49984 7.33333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.1665 4.00002L4.49984 0.666687" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="ml-3 text-sm font-medium leading-none ">Previous</p>
          </div>
          <div className="hidden sm:flex">
            {
              Array(totalPage).fill(0).map((_, index) => (
                <a key={index} className={`px-2 pt-3 mr-4 text-sm font-medium leading-none text-gray-600 border-t border-transparent cursor-pointer ${index === currentPage? 'text-indigo-700 border-indigo-400 ': 'hover:text-indigo-700 hover:border-indigo-400 '}`} href={`/posts/${index + 1}`}>
                  { index + 1 }
                </a>
              ))
            }
          </div>
          <div className="flex items-center pt-3 text-gray-600 cursor-pointer hover:text-indigo-700">
            <p className="mr-3 text-sm font-medium leading-none">Next</p>
            <svg width={14} height={8} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.1665 4H12.8332" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 7.33333L12.8333 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 0.666687L12.8333 4.00002" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

