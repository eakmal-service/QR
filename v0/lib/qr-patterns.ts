export interface QRPattern {
    id: string;
    label: string;
    viewBox: string;
    path: string; // SVG path data (d attribute)
}

export const CUSTOM_PATTERNS: QRPattern[] = [
    {
        id: "pattern-squares",
        label: "Squares",
        viewBox: "0 0 100 100",
        path: "M0 0h100v100H0z" // Full Fill
    },
    {
        id: "pattern-dots",
        label: "Dots",
        viewBox: "0 0 100 100",
        path: "M50 5a45 45 0 1 1 0 90 45 45 0 0 1 0-90z" // Large Circle
    },
    {
        id: "pattern-rounded",
        label: "Rounded",
        viewBox: "0 0 100 100",
        path: "M20 0h60a20 20 0 0 1 20 20v60a20 20 0 0 1-20 20H20a20 20 0 0 1-20-20V20a20 20 0 0 1 20-20z" // Rounded Rect
    },
    {
        id: "pattern-extra-rounded",
        label: "Extra Rounded",
        viewBox: "0 0 100 100",
        path: "M40 0h20a40 40 0 0 1 40 40v20a40 40 0 0 1-40 40H40a40 40 0 0 1-40-40V40a40 40 0 0 1 40-40z" // Deeply Rounded
    },
    {
        id: "pattern-classy",
        label: "Classy",
        viewBox: "0 0 100 100",
        path: "M50 0h50v50a50 50 0 0 1-50 50h-50v-50a50 50 0 0 1 50-50z" // TR and BL rounded
    },
    {
        id: "pattern-classy-2",
        label: "Classy Inverted",
        viewBox: "0 0 100 100",
        path: "M50 0a50 50 0 0 1 50 50v50h-50a50 50 0 0 1-50-50v-50h50z" // TL and BR rounded
    },
    {
        id: "pattern-diamond",
        label: "Diamond",
        viewBox: "0 0 100 100",
        path: "M50 0l50 50-50 50-50-50z" // Rhombus
    },
    {
        id: "pattern-cross",
        label: "Cross",
        viewBox: "0 0 100 100",
        path: "M35 0h30v35h35v30h-35v35h-30v-35h-35v-30h35z" // Thick Plus
    },
    {
        id: "pattern-star",
        label: "Star",
        viewBox: "0 0 100 100",
        path: "M50 0l15 35 35 15-35 15-15 35-15-35-35-15 35-15z" // 4-Point Star
    },
    {
        id: "pattern-mosaic",
        label: "Mosaic",
        viewBox: "0 0 100 100",
        path: "M5 5h40v40h-40zM55 5h40v40h-40zM5 55h40v40h-40zM55 55h40v40h-40z" // 4 Large Squares
    }
]

export interface CornerSquarePattern {
    id: string;
    label: string;
    viewBox: string;
    path: string; // The outer frame path
    clip?: boolean; // Whether to clip the inner area (simulated by path direction or mask)
    isStroke?: boolean; // If true, render as stroke instead of fill
    strokeWidth?: number; // Optional stroke width (default 3.5 for standard 7x7)
}

export const CORNER_SQUARE_PATHS: CornerSquarePattern[] = [
    {
        id: "square-thick",
        label: "Square Thick",
        viewBox: "0 0 33 33",
        path: "M3 3h27v27H3z", // User SVG 2 (Rect stroke=5).
        isStroke: true,
        strokeWidth: 5
    },
    {
        id: "corner-check",
        label: "CheckBox",
        viewBox: "0 0 35 35",
        path: "M31.016 25.686a6 6 0 0 1-6 6H8.551a6 6 0 0 1-6-6V3.265h22.465a6 6 0 0 1 6 6v16.421Z", // User SVG 5
        isStroke: true,
        strokeWidth: 5
    },
    {
        id: "corner-cut",
        label: "Corner Cut",
        viewBox: "0 0 37 36",
        path: "M3.318 2.494H23.87c5.523 0 10 4.478 10 10v20.553H13.318c-5.523 0-10-4.477-10-10V2.494Z", // User SVG 6
        isStroke: true,
        strokeWidth: 5
    },
    {
        id: "corner-flower",
        label: "Flower",
        viewBox: "0 0 35 35",
        path: "M3.431 17.524c0-7.848 6.374-14.21 14.222-14.21 7.86 0 14.244 6.372 14.244 14.233v14.188H17.642c-7.848 0-14.21-6.362-14.21-14.21Z", // User SVG 8
        isStroke: true,
        strokeWidth: 5
    },
    {
        id: "corner-diamond",
        label: "Diamond",
        viewBox: "0 0 32 34",
        path: "M14.018 1.107a3.21 3.21 0 0 1 3.96 0l1.35 1.057L21 1.797a3.209 3.209 0 0 1 3.569 1.718l.756 1.538 1.668.395a3.21 3.21 0 0 1 2.469 3.097l.014 1.714 1.331 1.08a3.209 3.209 0 0 1 .882 3.86l-.731 1.55.73 1.551a3.209 3.209 0 0 1-.88 3.861l-1.332 1.08-.014 1.714a3.21 3.21 0 0 1-2.47 3.096l-1.667.395-.756 1.538A3.209 3.209 0 0 1 21 31.704l-1.674-.368-1.349 1.058a3.21 3.21 0 0 1-3.96 0l-1.349-1.058-1.674.368a3.209 3.209 0 0 1-3.568-1.718l-.757-1.539-1.667-.395a3.21 3.21 0 0 1-2.47-3.096L2.52 23.24l-1.331-1.08 1.271-1.567.014-.018m-.014.018L1.188 22.16a3.21 3.21 0 0 1-.881-3.86l.73-1.551-.73-1.55a3.21 3.21 0 0 1 .881-3.862l1.331-1.08.014-1.713a3.209 3.209 0 0 1 2.47-3.097l1.667-.395.757-1.538a3.209 3.209 0 0 1 3.568-1.718l1.674.367 1.349-1.057m1.98 3.634-1.134.89a3.209 3.209 0 0 1-2.669.608l-1.407-.309-.636 1.294a3.209 3.209 0 0 1-2.14 1.706l-1.403.332-.011 1.442A3.209 3.209 0 0 1 5.41 13.17l-1.12.908.615 1.303c.409.867.409 1.87 0 2.738l-.615 1.303 1.12.908-1.286 1.585L5.41 20.33a3.209 3.209 0 0 1 1.188 2.466l.011 1.441 1.403.332c.932.221 1.717.847 2.14 1.707l.636 1.293 1.407-.309a3.209 3.209 0 0 1 2.67.61l1.133.889 1.134-.89a3.209 3.209 0 0 1 2.669-.609l1.408.31.636-1.294a3.209 3.209 0 0 1 2.14-1.707l1.402-.332.012-1.441a3.209 3.209 0 0 1 1.188-2.466l1.119-.908-.615-1.303a3.209 3.209 0 0 1 0-2.738l.615-1.303-1.12-.908a3.209 3.209 0 0 1-1.187-2.466l-.012-1.442-1.402-.332a3.209 3.209 0 0 1-2.14-1.706l-.636-1.294-1.408.31a3.21 3.21 0 0 1-2.669-.61l-1.134-.889Z" // User SVG 10
    }
]

export const CORNER_DOT_PATHS: CornerSquarePattern[] = [

    {
        id: "dot-square",
        label: "Square",
        viewBox: "0 0 33 33",
        path: "M11 11h11v11H11z"
    },
    {
        id: "dot-rounded",
        label: "Rounded",
        viewBox: "0 0 33 33",
        path: "M14.158 11.209h5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3z"
    },
    {
        id: "dot-circle",
        label: "Circle",
        viewBox: "0 0 33 33",
        path: "M16.5 11c3.038 0 5.5 2.462 5.5 5.5s-2.462 5.5-5.5 5.5-5.5-2.462-5.5-5.5 2.462-5.5 5.5-5.5z"
    },
    {
        id: "dot-rhombus",
        label: "Rhombus",
        viewBox: "0 0 33 33",
        path: "M10.568 13.84a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v8h-8a3 3 0 0 1-3-3v-5Z"
    },
    {
        id: "dot-rounded-in",
        label: "Rounded In",
        viewBox: "0 0 33 33",
        path: "M11.318 10.84h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3v-8Z"
    },
    {
        id: "dot-rounded-out",
        label: "Rounded Out",
        viewBox: "0 0 33 33",
        path: "M10.693 10.84h8a3 3 0 0 1 3 3v8h-8a3 3 0 0 1-3-3v-8Z"
    },
    {
        id: "dot-rounded-corner",
        label: "Rounded Corner",
        viewBox: "0 0 33 33",
        path: "M21.692 10.84h-8a3 3 0 0 0-3 3v8h8a3 3 0 0 0 3-3v-8Z"
    },
    {
        id: "dot-diamond-sharp",
        label: "Diamond Sharp",
        viewBox: "0 0 33 33",
        path: "m8 16.34 7.778-7.778 7.779 7.778-7.779 7.778z"
    },
    {
        id: "dot-star",
        label: "Star",
        viewBox: "0 0 33 33",
        path: "M15.444 9.895a2.2 2.2 0 0 1 3.112 0l4.666 4.667a2.2 2.2 0 0 1 0 3.112l-4.666 4.666a2.2 2.2 0 0 1-3.112 0l-4.667-4.666a2.2 2.2 0 0 1 0-3.112l4.667-4.667Z"
    },
    {
        id: "dot-flower",
        label: "Flower",
        viewBox: "0 0 33 33",
        path: "M16 10.67a.757.757 0 0 1 1.25 0L19 13.3c.101.15.257.26.437.305l3.133.794c.524.133.73.743.387 1.147l-2.052 2.42a.7.7 0 0 0-.166.494l.185 3.121c.031.521-.507.899-1.01.709l-3.02-1.135a.768.768 0 0 0-.539 0l-3.018 1.135c-.504.19-1.042-.188-1.011-.709l.185-3.12a.7.7 0 0 0-.166-.496l-2.052-2.419c-.342-.404-.137-1.014.387-1.147l3.133-.794a.742.742 0 0 0 .436-.306L16 10.67Z"
    },
    {
        id: "dot-leaf",
        label: "Leaf",
        viewBox: "0 0 33 33",
        path: "M15.735 10.478a.618.618 0 0 1 .78 0l.755.614a.618.618 0 0 0 .487.13l.96-.153a.618.618 0 0 1 .676.39l.347.909a.617.617 0 0 0 .357.357l.91.346a.618.618 0 0 1 .389.676l-.154.96a.618.618 0 0 0 .13.488l.614.755a.618.618 0 0 1 0 .78l-.614.754a.618.618 0 0 0-.13.488l.154.96a.618.618 0 0 1-.39.676l-.909.347a.618.618 0 0 0-.357.357l-.347.909a.618.618 0 0 1-.675.39l-.96-.155a.618.618 0 0 0-.488.131l-.755.614a.618.618 0 0 1-.78 0l-.755-.614a.618.618 0 0 0-.488-.13l-.96.154a.618.618 0 0 1-.675-.39l-.347-.91a.618.618 0 0 0-.357-.356l-.91-.347a.618.618 0 0 1-.39-.675l.155-.96a.618.618 0 0 0-.13-.489l-.615-.754a.618.618 0 0 1 0-.78l.614-.755a.618.618 0 0 0 .131-.488l-.154-.96a.618.618 0 0 1 .39-.676l.909-.346a.618.618 0 0 0 .357-.357l.347-.91a.618.618 0 0 1 .675-.39l.96.155a.618.618 0 0 0 .488-.13l.755-.615Z"
    }
]
