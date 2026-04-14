"use client"

import Link from "next/link"

export function GenerateQRButton() {
  return (
    <Link href="/generate">
      <button className="qr-button group relative flex items-center gap-2 px-6 py-2.5 bg-transparent border-none rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-100">
        <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-black/5 to-black/5 dark:from-white/10 dark:to-white/5 backdrop-blur-[20px] border border-black/10 dark:border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05),0_4px_16px_-4px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_0.375rem_rgba(0,0,0,0.05)] dark:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_0_0.375rem_rgba(255,255,255,0.3)] z-0"></div>
        <div className="absolute inset-0 w-full h-full rounded-xl bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 z-[2]"></div>
        
        <div className="dots_border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-transparent rounded-xl z-[-10] w-[calc(100%+2px)] h-[calc(100%+2px)]"></div>
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="sparkle relative z-10 w-7 transition-colors duration-300"
        >
          <path
            className="path fill-foreground stroke-foreground transition-all duration-300 group-hover:animate-[path_1.5s_linear_0.5s_infinite] group-hover:fill-background group-hover:stroke-background group-focus:animate-[path_1.5s_linear_0.5s_infinite]"
            strokeLinejoin="round"
            strokeLinecap="round"
            d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
          ></path>
          <path
            className="path fill-foreground stroke-foreground transition-all duration-300 group-hover:animate-[path_1.5s_linear_0.5s_infinite] group-hover:fill-background group-hover:stroke-background group-focus:animate-[path_1.5s_linear_0.5s_infinite]"
            strokeLinejoin="round"
            strokeLinecap="round"
            d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
          ></path>
          <path
            className="path fill-foreground stroke-foreground transition-all duration-300 group-hover:animate-[path_1.5s_linear_0.5s_infinite] group-hover:fill-background group-hover:stroke-background group-focus:animate-[path_1.5s_linear_0.5s_infinite]"
            strokeLinejoin="round"
            strokeLinecap="round"
            d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
          ></path>
        </svg>
        <span className="text_button relative z-10 text-foreground transition-colors duration-300 group-hover:text-background font-medium">Generate QR</span>

        <style jsx>{`
          .dots_border::before {
            content: "";
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            transform-origin: left;
            transform: rotate(0deg);

            width: 100%;
            height: 2rem;
            background-color: var(--foreground);

            mask: linear-gradient(transparent 0%, black 120%);
            -webkit-mask: linear-gradient(transparent 0%, black 120%);
            animation: rotate 2s linear infinite;
          }

          @keyframes rotate {
            to {
              transform: rotate(360deg);
            }
          }

          .path:nth-child(1) { --scale_path: 1.2; }
          .path:nth-child(2) { --scale_path: 1.2; }
          .path:nth-child(3) { --scale_path: 1.2; }

          @keyframes path {
            0%, 34%, 71%, 100% {
              transform: scale(1);
            }
            33%, 66% {
              transform: scale(var(--scale_path, 1.2));
            }
          }
        `}</style>
      </button>
    </Link>
  )
}
