"use client";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/85 dark:bg-black/85 backdrop-blur-lg z-[9999] animate-fadeInFast transition-colors duration-300">
      <div className="relative flex items-center justify-center">

        {/* Animated circular glow ring */}
        <div className="absolute w-64 h-64 rounded-full border-[6px] border-emerald-500/40 shadow-[0_0_40px_15px_rgba(16,185,129,0.25)] animate-spinSlow" />

        {/* GIF with floating animation */}
        <img
          src="/loading.gif"
          alt="loading"
          className="w-52 h-52 object-contain rounded-xl animate-float"
        />
      </div>

      {/* Loading text */}
      <p className="mt-8 text-gray-900 dark:text-white text-2xl font-semibold tracking-wide animate-pulse">
        We are Loading...
      </p>
    </div>
  );
}
