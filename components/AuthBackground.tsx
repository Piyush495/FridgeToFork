import React from "react";

export default function AuthBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-tr from-[#F4F9F4] via-white to-[#EAF5EB] select-none pointer-events-none">
      {/* Soft Green Organic Wave/Blob in the background */}
      <svg
        className="absolute top-1/4 -right-24 sm:-right-48 w-[600px] h-[600px] text-[#2D6A4F]/5 opacity-60"
        viewBox="0 0 200 200"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M45.7,-64.1C58.3,-58,67.1,-44.6,71.2,-30.2C75.3,-15.8,74.7,-0.4,70.9,13.7C67.1,27.8,60.1,40.7,49.6,50.7C39.1,60.8,25.1,68.1,9.8,70.6C-5.5,73.1,-22.1,70.8,-36.8,63.9C-51.5,57,-64.3,45.5,-71.4,31.2C-78.5,16.8,-79.8,-0.5,-75.4,-15.9C-71,-31.3,-60.9,-44.9,-48.1,-51C-35.3,-57.2,-19.7,-55.9,-2.8,-52C14.1,-48.1,28.2,-41.7,45.7,-64.1Z"
          transform="translate(100 100)"
        />
      </svg>

      <svg
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] text-[#52B788]/5 opacity-40"
        viewBox="0 0 200 200"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M39.9,-53.4C51.6,-47.2,60.9,-35.6,65.2,-22.1C69.5,-8.6,68.8,6.8,64.2,20.8C59.6,34.8,51.1,47.4,39.3,55.1C27.5,62.8,12.4,65.6,-2.1,68.5C-16.7,71.4,-33.4,74.4,-46.8,68C-60.2,61.6,-70.4,45.8,-74.6,29C-78.8,12.2,-77,-5.6,-71.2,-20.9C-65.4,-36.2,-55.6,-49,-43,-55C-30.4,-61,-15.2,-60.2,-0.3,-59.8C14.6,-59.4,28.2,-59.6,39.9,-53.4Z"
          transform="translate(100 100)"
        />
      </svg>



      {/* Blurred Leaf branch in the bottom-left foreground */}
      <div className="absolute bottom-[-20px] left-[-20px] sm:bottom-[-40px] sm:left-[-40px] w-48 h-48 sm:w-64 sm:h-64 text-[#2D6A4F]/25 blur-[1.5px] select-none pointer-events-none transform -rotate-12">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          {/* Main stem */}
          <path
            d="M10 90 C 25 75, 45 65, 75 55"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Leaves */}
          {/* Leaf 1 */}
          <path d="M22 80 C 15 72, 18 62, 28 72 C 32 76, 28 82, 22 80 Z" />
          {/* Leaf 2 */}
          <path d="M35 73 C 28 63, 33 55, 41 65 C 45 69, 41 75, 35 73 Z" />
          {/* Leaf 3 */}
          <path d="M48 67 C 42 55, 48 48, 55 58 C 58 62, 54 68, 48 67 Z" />
          {/* Leaf 4 */}
          <path d="M62 61 C 58 48, 65 42, 70 52 C 72 56, 68 62, 62 61 Z" />
          
          {/* Opposite leaves */}
          {/* Leaf 5 */}
          <path d="M25 84 C 32 88, 38 80, 32 74 C 28 70, 22 78, 25 84 Z" />
          {/* Leaf 6 */}
          <path d="M38 77 C 46 80, 50 72, 44 66 C 40 62, 34 71, 38 77 Z" />
          {/* Leaf 7 */}
          <path d="M51 71 C 60 73, 63 65, 57 59 C 53 55, 47 64, 51 71 Z" />
        </svg>
      </div>
    </div>
  );
}
