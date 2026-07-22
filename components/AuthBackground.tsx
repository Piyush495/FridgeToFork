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



      {/* Food decor asset in bottom-left */}
      <div className="absolute bottom-0 left-0 w-64 sm:w-80 pointer-events-none select-none z-0 mix-blend-multiply opacity-80 transform -translate-x-8 translate-y-4">
        <img src="/auth-food.png" alt="Decorative ingredients" className="w-full h-auto object-contain" />
      </div>
    </div>
  );
}
