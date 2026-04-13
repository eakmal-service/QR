"use client";

import React from "react";

export const RubyLogo = () => (
    <div className="flex flex-col items-center justify-center pt-6 pb-4 animate-in fade-in zoom-in duration-500">
        <img 
            src="/ruby-logo.svg" 
            alt="Ruby Store" 
            className="h-28 sm:h-32 object-contain"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
                document.getElementById('ruby-fallback-text')!.style.display = 'block';
            }}
        />
        <h1 id="ruby-fallback-text" className="hidden text-[42px] sm:text-[52px] font-bold tracking-wider text-[#D4AF37]" style={{ textShadow: "0 2px 10px rgba(212,175,55,0.3)" }}>
            RUBY
        </h1>
    </div>
);
