/**
 * BROWSER DEBUGGER
 *
 * PURPOSE
 * -------
 * Provides framework-independent utilities for inspecting the current browser
 * and frontend environment.
 *
 * Helps answer:
 * - Which browser and OS is being used?
 * - What is the current viewport size?
 * - What is the screen size?
 * - Is the browser online?
 * - What language and timezone are being used?
 * - Is the device likely mobile, tablet, or desktop?
 * - What browser capabilities are available?
 * - What environment is the application currently running in?
 *
 * AVAILABLE FUNCTIONS
 * -------------------
 * browser.info()
 *   Returns general browser and environment information.
 *   Returns: BrowserInfo
 *
 * browser.viewport()
 *   Returns current viewport dimensions.
 *   Returns: ViewportInfo
 *
 * browser.screen()
 *   Returns current screen information.
 *   Returns: ScreenInfo
 *
 * browser.connection()
 *   Returns network connection information when available.
 *   Returns: ConnectionInfo | null
 *
 * browser.isOnline()
 *   Checks whether the browser currently reports an online connection.
 *   Returns: boolean
 *
 * browser.isMobile()
 *   Checks whether the current device is likely mobile.
 *   Returns: boolean
 *
 * browser.isTablet()
 *   Checks whether the current device is likely a tablet.
 *   Returns: boolean
 *
 * browser.isTouchDevice()
 *   Checks whether touch input is available.
 *   Returns: boolean
 *
 * browser.summary()
 *   Prints a useful browser/environment summary to the console.
 *   Returns: BrowserInfo
 *
 *
 * BASIC USAGE
 * -----------
 *
 * import { browser } from "./browser";
 *
 * console.log(browser.info());
 *
 * console.log(browser.viewport());
 *
 * console.log(browser.isMobile());
 *
 *
 * QUICK DEBUGGING
 * ---------------
 *
 * browser.summary();
 *
 * Example output:
 *
 * [BROWSER]
 * Browser: Chrome
 * OS: Windows
 * Device: Desktop
 * Viewport: 1920 × 945
 * Screen: 1920 × 1080
 * Online: true
 * Language: en-IN
 * Timezone: Asia/Kolkata
 * Touch: false
 *
 *
 * IMPORTANT
 * ---------
 * Browser and OS detection is based on browser-provided information and
 * user-agent data. It should be treated as debugging information, not as
 * authoritative device detection.
 *
 * Do not use these utilities for security decisions, authentication,
 * authorization, or critical application logic.
 *
 *
 * BROWSER SUPPORT
 * ---------------
 * Designed for modern browsers.
 *
 * Some information, especially connection information, is not available in
 * every browser. Unsupported information returns null where appropriate.
 *
 *
 * SSR
 * ---
 * Browser APIs do not exist during server-side rendering.
 *
 * Functions that require browser APIs throw a clear error when called outside
 * a browser environment.
 *
 *
 * IMMUTABILITY
 * ------------
 * Returned information is captured as a snapshot and browser state is not
 * modified.
 */

export type DeviceType =
    | "mobile"
    | "tablet"
    | "desktop"
    | "unknown";

export interface ViewportInfo {
    readonly width: number;
    readonly height: number;
    readonly devicePixelRatio: number;
}

export interface ScreenInfo {
    readonly width: number;
    readonly height: number;
    readonly availableWidth: number;
    readonly availableHeight: number;
    readonly colorDepth: number;
    readonly pixelDepth: number;
}

export interface ConnectionInfo {
    readonly effectiveType?: string;
    readonly downlink?: number;
    readonly rtt?: number;
    readonly saveData?: boolean;
    readonly type?: string;
}

export interface BrowserInfo {
    readonly browser: string;
    readonly browserVersion: string | null;
    readonly os: string;
    readonly osVersion: string | null;
    readonly device: DeviceType;
    readonly userAgent: string;
    readonly language: string;
    readonly languages: readonly string[];
    readonly timezone: string;
    readonly online: boolean;
    readonly touch: boolean;
    readonly viewport: ViewportInfo;
    readonly screen: ScreenInfo;
    readonly connection: ConnectionInfo | null;
}

interface NavigatorWithConnection extends Navigator {
    readonly connection?: {
        readonly effectiveType?: string;
        readonly downlink?: number;
        readonly rtt?: number;
        readonly saveData?: boolean;
        readonly type?: string;
    };
}

function getWindow(): Window {
    if (typeof window === "undefined") {
        throw new Error(
            "[debugger/browser] Browser APIs are not available in this environment.",
        );
    }

    return window;
}

function getNavigator(): NavigatorWithConnection {
    if (typeof navigator === "undefined") {
        throw new Error(
            "[debugger/browser] Navigator API is not available in this environment.",
        );
    }

    return navigator as NavigatorWithConnection;
}

function detectBrowser(): {
    name: string;
    version: string | null;
} {
    const userAgent = getNavigator().userAgent;

    const browsers: readonly {
        readonly name: string;
        readonly pattern: RegExp;
    }[] = [
        {
            name: "Edge",
            pattern: /Edg\/([\d.]+)/i,
        },
        {
            name: "Opera",
            pattern: /(?:OPR|Opera)\/([\d.]+)/i,
        },
        {
            name: "Samsung Internet",
            pattern: /SamsungBrowser\/([\d.]+)/i,
        },
        {
            name: "Chrome",
            pattern: /Chrome\/([\d.]+)/i,
        },
        {
            name: "Firefox",
            pattern: /Firefox\/([\d.]+)/i,
        },
        {
            name: "Safari",
            pattern: /Version\/([\d.]+).*Safari/i,
        },
    ];

    for (const browser of browsers) {
        const match = userAgent.match(browser.pattern);

        if (match) {
            return {
                name: browser.name,
                version: match[1] ?? null,
            };
        }
    }

    return {
        name: "Unknown",
        version: null,
    };
}

function detectOS(): {
    name: string;
    version: string | null;
} {
    const userAgent = getNavigator().userAgent;

    if (/Windows NT/i.test(userAgent)) {
        const version = userAgent.match(/Windows NT ([\d.]+)/i)?.[1];

        return {
            name: "Windows",
            version: version ?? null,
        };
    }

    if (/Android/i.test(userAgent)) {
        const version = userAgent.match(/Android ([\d.]+)/i)?.[1];

        return {
            name: "Android",
            version: version ?? null,
        };
    }

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        const version = userAgent.match(/OS ([\d_]+)/i)?.[1];

        return {
            name: "iOS",
            version: version?.replace(/_/g, ".") ?? null,
        };
    }

    if (/Mac OS X/i.test(userAgent)) {
        const version = userAgent.match(/Mac OS X ([\d_]+)/i)?.[1];

        return {
            name: "macOS",
            version: version?.replace(/_/g, ".") ?? null,
        };
    }

    if (/Linux/i.test(userAgent)) {
        return {
            name: "Linux",
            version: null,
        };
    }

    return {
        name: "Unknown",
        version: null,
    };
}

function isTouchDevice(): boolean {
    const windowApi = getWindow();
    const navigatorApi = getNavigator();

    return (
        "ontouchstart" in windowApi ||
        navigatorApi.maxTouchPoints > 0
    );
}

function detectDeviceType(): DeviceType {
    const userAgent = getNavigator().userAgent.toLowerCase();

    const touch = isTouchDevice();

    const mobilePattern =
        /android.*mobile|iphone|ipod|windows phone|mobile/i;

    const tabletPattern =
        /ipad|android(?!.*mobile)|tablet/i;

    if (tabletPattern.test(userAgent)) {
        return "tablet";
    }

    if (mobilePattern.test(userAgent)) {
        return "mobile";
    }

    if (touch) {
        const width = getWindow().innerWidth;

        if (width <= 768) {
            return "mobile";
        }

        if (width <= 1024) {
            return "tablet";
        }
    }

    if (typeof window !== "undefined") {
        return "desktop";
    }

    return "unknown";
}

function getViewport(): ViewportInfo {
    const windowApi = getWindow();

    return {
        width: windowApi.innerWidth,
        height: windowApi.innerHeight,
        devicePixelRatio: windowApi.devicePixelRatio || 1,
    };
}

function getScreen(): ScreenInfo {
    const screenApi = getWindow().screen;

    return {
        width: screenApi.width,
        height: screenApi.height,
        availableWidth: screenApi.availWidth,
        availableHeight: screenApi.availHeight,
        colorDepth: screenApi.colorDepth,
        pixelDepth: screenApi.pixelDepth,
    };
}

function getConnection(): ConnectionInfo | null {
    const connection = getNavigator().connection;

    if (!connection) {
        return null;
    }

    return {
        ...(connection.effectiveType !== undefined
            ? { effectiveType: connection.effectiveType }
            : {}),
        ...(connection.downlink !== undefined
            ? { downlink: connection.downlink }
            : {}),
        ...(connection.rtt !== undefined
            ? { rtt: connection.rtt }
            : {}),
        ...(connection.saveData !== undefined
            ? { saveData: connection.saveData }
            : {}),
        ...(connection.type !== undefined
            ? { type: connection.type }
            : {}),
    };
}

function getTimezone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return "Unknown";
    }
}

export function viewport(): ViewportInfo {
    return getViewport();
}

export function screen(): ScreenInfo {
    return getScreen();
}

export function connection(): ConnectionInfo | null {
    return getConnection();
}

export function isOnline(): boolean {
    return getNavigator().onLine;
}

export function isMobile(): boolean {
    return detectDeviceType() === "mobile";
}

export function isTablet(): boolean {
    return detectDeviceType() === "tablet";
}

export function isTouchDevice(): boolean {
    return (
        "ontouchstart" in getWindow() ||
        getNavigator().maxTouchPoints > 0
    );
}

export function info(): BrowserInfo {
    const browser = detectBrowser();
    const os = detectOS();
    const navigatorApi = getNavigator();

    return {
        browser: browser.name,
        browserVersion: browser.version,
        os: os.name,
        osVersion: os.version,
        device: detectDeviceType(),
        userAgent: navigatorApi.userAgent,
        language: navigatorApi.language,
        languages: [...navigatorApi.languages],
        timezone: getTimezone(),
        online: navigatorApi.onLine,
        touch: isTouchDevice(),
        viewport: getViewport(),
        screen: getScreen(),
        connection: getConnection(),
    };
}

export function summary(): BrowserInfo {
    const browserInfo = info();

    console.group("[BROWSER]");

    console.info(
        `Browser: ${ browserInfo.browser }${
    browserInfo.browserVersion
        ? ` ${browserInfo.browserVersion}`
        : ""
} `,
    );

    console.info(
        `OS: ${ browserInfo.os }${
    browserInfo.osVersion
        ? ` ${browserInfo.osVersion}`
        : ""
} `,
    );

    console.info(`Device: ${ browserInfo.device } `);

    console.info(
        `Viewport: ${ browserInfo.viewport.width } × ${ browserInfo.viewport.height } `,
    );

    console.info(
        `Screen: ${ browserInfo.screen.width } × ${ browserInfo.screen.height } `,
    );

    console.info(`Online: ${ browserInfo.online } `);

    console.info(`Language: ${ browserInfo.language } `);

    console.info(`Timezone: ${ browserInfo.timezone } `);

    console.info(`Touch: ${ browserInfo.touch } `);

    if (browserInfo.connection) {
        console.info("Connection:", browserInfo.connection);
    }

    console.groupEnd();

    return browserInfo;
}

export const browser = {
    info,
    viewport,
    screen,
    connection,
    isOnline,
    isMobile,
    isTablet,
    isTouchDevice,
    summary,
};