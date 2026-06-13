// // frontend/src/sections/Hero.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// const Hero = () => {
//   return (
//     <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
//       {/* Background image (if you want it only on hero, not body) */}
//       <div className="absolute inset-0 z-0">
//         <img
//           src="/images/Crisis7778.png"
//           alt="Crisis Solver background"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/50" /> {/* dark overlay */}
//       </div>

//       {/* Content – stays on top */}
//       <div className="relative z-10 text-white">
//         <h1 className="text-6xl font-bold text-green-400 mb-6">CRISIS SOLVER</h1>
//         <p className="text-2xl mb-4 max-w-3xl">Earn • Support • Heal the World</p>
//         <p className="text-gray-200 max-w-2xl mb-10">
//           A global humanitarian platform empowering people to fight hunger, health crises,
//           and displacement through digital engagement, donations, games, media, and AI‑powered solutions.
//         </p>
//         <div className="flex flex-wrap gap-4 justify-center">
//           <Link to="/register" className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold">
//             Get Started
//           </Link>
//           <Link to="/login" className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-semibold">
//             Login
//           </Link>
//           <Link to="/dashboard" className="border border-green-400 hover:bg-green-500 hover:text-white px-6 py-3 rounded-xl font-semibold">
//             Enter App
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;