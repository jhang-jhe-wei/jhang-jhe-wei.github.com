import React from "react";

export default function Tag({ name }) {
  return (
  <span
    className="px-3 py-1 mr-3 text-xs font-semibold text-gray-500 bg-gray-200 cursor-pointer rounded-2xl align-center w-max active:bg-gray-300 transition duration-300 ease">{ name }</span>
  );
}

