(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/utilities/FetchWithAuth.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "FetchWithAuth": (()=>FetchWithAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Redux$2f$Store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Redux/Store/store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
'use client';
;
;
const FetchWithAuth = async (url, method = "GET", body = null, extraHeaders = {}, suppressToast = false)=>{
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    const token = localStorage.getItem("dsciAuthToken") || Cookies.get("dsciAuthToken") || "";
    const loginPath = "/administration/login"; // Simplified to only use admin login path
    const headers = {
        "Content-Type": "application/json",
        ...token && {
            Authorization: `Bearer ${token}`
        },
        ...extraHeaders
    };
    const options = {
        method,
        headers,
        credentials: "include",
        ...body && {
            body: JSON.stringify(body)
        }
    };
    try {
        const response = await fetch(url, options);
        // Handle token expiration
        if (response.status === 401) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Redux$2f$Store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"].dispatch({
                type: "auth/logout"
            });
            localStorage.removeItem("rsvAuthToken");
            if (!suppressToast) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Your session has expired. Please login again.");
            window.location.href = `${loginPath}?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
        }
        // Handle empty response (204 No Content)
        if (response.status === 204) return null;
        const responseData = await response.json();
        if (!response.ok) {
            const message = responseData?.error || responseData?.message || "Something went wrong";
            // if (!suppressToast) toast.error(message);
            throw new Error(message);
        }
        return responseData;
    } catch (error) {
        const finalMessage = error.message || "Network error";
        // if (!suppressToast) toast.error(finalMessage);
        throw new Error(finalMessage);
    }
};
_c = FetchWithAuth;
var _c;
__turbopack_context__.k.register(_c, "FetchWithAuth");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utilities/ApiManager.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EventApi": (()=>EventApi),
    "LoginApi": (()=>LoginApi),
    "RegisterApi": (()=>RegisterApi)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$FetchWithAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilities/FetchWithAuth.js [app-client] (ecmascript)");
'use client';
;
const LoginApi = async (formData)=>{
    const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    return res;
};
_c = LoginApi;
const RegisterApi = async (formData)=>{
    const url = '/api/admin/auth/register';
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    return res;
};
_c1 = RegisterApi;
const EventApi = async (data, method)=>{
    if (method === "Get") {
        const url = '/api/admin/data/eventoutreach';
        const res = await fetch(url);
        return res;
    }
    if (method === "Post") {
        const url = '/api/admin/data/eventoutreach';
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return res;
    }
};
_c2 = EventApi;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "LoginApi");
__turbopack_context__.k.register(_c1, "RegisterApi");
__turbopack_context__.k.register(_c2, "EventApi");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/Component/UI/TableFormat.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Button": (()=>Button),
    "Card": (()=>Card),
    "ConfirmDialog": (()=>ConfirmDialog),
    "Container": (()=>Container),
    "Dialog": (()=>Dialog),
    "DialogContent": (()=>DialogContent),
    "DialogTitle": (()=>DialogTitle),
    "DialogTrigger": (()=>DialogTrigger),
    "ExpandableTableRow": (()=>ExpandableTableRow),
    "Grid": (()=>Grid),
    "Input": (()=>Input),
    "StatusBadge": (()=>StatusBadge),
    "Tab": (()=>Tab),
    "Table": (()=>Table),
    "TableBody": (()=>TableBody),
    "TableCell": (()=>TableCell),
    "TableHead": (()=>TableHead),
    "TableHeader": (()=>TableHeader),
    "TableRow": (()=>TableRow),
    "Tabs": (()=>Tabs),
    "cn": (()=>cn),
    "formatDate": (()=>formatDate)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
'use client';
;
;
;
;
;
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DialogContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
                className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/TableFormat.js",
                lineNumber: 19,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: cn('fixed z-50 bg-white rounded-xl shadow-2xl top-1/2 left-1/2 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[70%] transform -translate-x-1/2 -translate-y-1/2', 'max-h-[90vh] overflow-y-auto', className),
                ...props,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/TableFormat.js",
                lineNumber: 20,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 18,
        columnNumber: 3
    }, this));
_c1 = DialogContent;
DialogContent.displayName = 'DialogContent';
const DialogTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: cn('text-lg sm:text-xl font-semibold text-[#111827]  pt-6  border-b border-[#E5E7EB]', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 37,
        columnNumber: 3
    }, this));
_c2 = DialogTitle;
DialogTitle.displayName = 'DialogTitle';
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c3 = ({ className, variant = 'default', size = 'default', icon, iconPosition = 'left', fullWidth = false, children, ...props }, ref)=>{
    // Style configurations
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const sizeStyles = {
        default: 'px-3 py-2 text-sm sm:px-4 sm:py-2',
        sm: 'px-2.5 py-1.5 text-xs sm:px-3 sm:py-1.5',
        lg: 'px-5 py-2.5 text-base sm:px-6 sm:py-3',
        icon: 'p-2'
    };
    const variantStyles = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700'
    };
    // Icon rendering logic
    const renderIcon = ()=>{
        if (!icon) return null;
        const iconClasses = cn('flex-shrink-0', children ? iconPosition === 'left' ? 'mr-2' : 'ml-2' : '', 'h-4 w-4');
        if (/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(icon)) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"])(icon, {
                className: cn(icon.props.className, iconClasses)
            });
        }
        const IconComponent = icon;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
            className: iconClasses,
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/src/Component/UI/TableFormat.js",
            lineNumber: 95,
            columnNumber: 12
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        className: cn(baseStyles, sizeStyles[size] || sizeStyles.default, variantStyles[variant] || variantStyles.default, fullWidth && 'w-full', className),
        ...props,
        children: [
            iconPosition === 'left' && renderIcon(),
            children,
            iconPosition === 'right' && renderIcon()
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 99,
        columnNumber: 5
    }, this);
});
_c4 = Button;
Button.displayName = 'Button';
function Table({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-x-auto -mx-2  font-sans sm:-mx-4 md:mx-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "inline-block min-w-full  align-middle  lg:px-0",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-hidden bg-white rounded-lg shadow border border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: cn('min-w-full divide-y divide-gray-200 text-sm', className),
                    ...props,
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/Component/UI/TableFormat.js",
                    lineNumber: 125,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/TableFormat.js",
                lineNumber: 124,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/Component/UI/TableFormat.js",
            lineNumber: 123,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_c5 = Table;
function TableHeader({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        className: cn('bg-gray-50 hidden sm:table-header-group', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_c6 = TableHeader;
function TableBody({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        className: cn('divide-y divide-gray-100 bg-white', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_c7 = TableBody;
function TableRow({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        className: cn('hover:bg-gray-50 transition-colors block sm:table-row', 'border-b border-gray-200 sm:border-0', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_c8 = TableRow;
function TableHead({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        className: cn('px-3 py-3.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap', 'hidden sm:table-cell', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
_c9 = TableHead;
function TableCell({ className, header, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        className: cn('px-3 py-3 text-sm text-gray-900', 'block sm:table-cell', 'first:pt-4 last:pb-4 sm:first:pt-3 sm:last:pb-3', 'before:content-[attr(data-label)] before:block before:font-medium before:text-gray-500 before:text-xs before:mb-1 sm:before:content-none', className),
        "data-label": header,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
_c10 = TableCell;
function ExpandableTableRow({ children, expanded, onToggle, expandedContent, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: cn('hover:bg-gray-50 transition-colors block sm:table-row', 'border-b border-gray-200 sm:border-0', expanded && 'bg-gray-50', props.className),
                onClick: onToggle,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].map(children, (child, index)=>{
                    if (/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(child) && child.type === TableCell) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
                            className: cn(child.props.className, 'block sm:table-cell', index === 0 && 'pt-4 sm:pt-3', index === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].count(children) - 1 && 'pb-4 sm:pb-3')
                        });
                    }
                    return child;
                })
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/TableFormat.js",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "block bg-gray-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                    colSpan: 100,
                    className: "px-4 py-3 sm:px-6 sm:py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-700",
                        children: expandedContent
                    }, void 0, false, {
                        fileName: "[project]/src/Component/UI/TableFormat.js",
                        lineNumber: 228,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Component/UI/TableFormat.js",
                    lineNumber: 227,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/TableFormat.js",
                lineNumber: 226,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_c11 = ExpandableTableRow;
function Card({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cn('bg-white rounded-xl border border-gray-200 shadow-sm', 'w-full mx-auto', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 241,
        columnNumber: 5
    }, this);
}
_c12 = Card;
Card.Header = function CardHeader({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cn('px-4 py-4 border-b border-gray-200', 'sm:px-6', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 256,
        columnNumber: 5
    }, this);
};
Card.Content = function CardContent({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cn('p-4', 'sm:p-6', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 271,
        columnNumber: 5
    }, this);
};
function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description = 'This action cannot be undone.', confirmLabel = 'Yes', cancelLabel = 'Cancel', confirmColor = 'danger', loading = false }) {
    const confirmBtnColor = confirmColor === 'danger' ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white' : confirmColor === 'success' ? 'bg-[#22C55E] hover:bg-[#16A34A] text-white' : 'bg-[#0C2FB2] hover:bg-[#0A2899] text-white';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        open: open,
        onOpenChange: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
                    className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                }, void 0, false, {
                    fileName: "[project]/src/Component/UI/TableFormat.js",
                    lineNumber: 305,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                    className: "fixed z-50 bg-white rounded-xl shadow-2xl top-1/2 left-1/2 w-[95%] sm:w-[400px] transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto font-sans",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogTitle, {
                            className: "px-6 pt-6 pb-2 text-lg font-semibold text-[#111827]",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/Component/UI/TableFormat.js",
                            lineNumber: 310,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 pb-6 text-[#374151] text-sm",
                            children: description
                        }, void 0, false, {
                            fileName: "[project]/src/Component/UI/TableFormat.js",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 pb-6 flex justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "px-4 py-2 rounded bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB] font-medium",
                                    onClick: ()=>onClose(false),
                                    disabled: loading,
                                    children: cancelLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/UI/TableFormat.js",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: `px-4 py-2 rounded font-medium ${confirmBtnColor}`,
                                    onClick: ()=>onConfirm(),
                                    disabled: loading,
                                    children: loading ? 'Please wait...' : confirmLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/UI/TableFormat.js",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/Component/UI/TableFormat.js",
                            lineNumber: 316,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/UI/TableFormat.js",
                    lineNumber: 306,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/UI/TableFormat.js",
            lineNumber: 304,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 303,
        columnNumber: 5
    }, this);
}
_c13 = ConfirmDialog;
const Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c14 = ({ className, type = 'text', ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: cn('flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white', 'focus:outline-none focus:ring-2 focus:ring-[#0C2FB2] focus:ring-offset-1', 'placeholder:text-gray-400', 'disabled:cursor-not-allowed disabled:opacity-50', 'sm:text-sm', className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 343,
        columnNumber: 5
    }, this);
});
_c15 = Input;
Input.displayName = 'Input';
function Grid({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cn('grid grid-cols-1 gap-4', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 363,
        columnNumber: 5
    }, this);
}
_c16 = Grid;
function Container({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cn('w-full px-4 mx-auto', 'sm:max-w-[640px] sm:px-6', 'md:max-w-[768px] md:px-8', 'lg:max-w-[1024px]', 'xl:max-w-[1280px]', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 381,
        columnNumber: 5
    }, this);
}
_c17 = Container;
function StatusBadge({ status, className, ...props }) {
    const statusConfig = {
        pending: {
            text: 'Pending',
            bg: 'bg-yellow-50',
            textColor: 'text-yellow-800',
            border: 'border-yellow-400'
        },
        accepted: {
            text: 'Accepted',
            bg: 'bg-green-50',
            textColor: 'text-green-800',
            border: 'border-green-400'
        },
        rejected: {
            text: 'Rejected',
            bg: 'bg-red-50',
            textColor: 'text-red-700',
            border: 'border-red-400'
        },
        active: {
            text: 'Active',
            bg: 'bg-green-50',
            textColor: 'text-green-800',
            border: 'border-green-400'
        },
        inactive: {
            text: 'Inactive',
            bg: 'bg-gray-100',
            textColor: 'text-gray-800',
            border: 'border-gray-300'
        }
    };
    const config = statusConfig[status?.toLowerCase()] || {
        text: status || 'Unknown',
        bg: 'bg-gray-100',
        textColor: 'text-gray-800',
        border: 'border-gray-300'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: cn('inline-flex items-center rounded px-2.5 py-0.5 text-xs font-bold border', 'sm:px-3 sm:py-1 sm:text-sm', config.bg, config.textColor, config.border, className),
        ...props,
        children: config.text
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 440,
        columnNumber: 5
    }, this);
}
_c18 = StatusBadge;
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}
const Tabs = ({ activeTab, setActiveTab, children, onRemoveTab })=>{
    const tabCount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].count(children);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-blue-400",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap px-2 items-center gap-2  ",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].map(children, (child, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setActiveTab(index),
                            className: `flex items-center px-3 py-1.5 rounded-t-lg text-sm font-medium border transition-all duration-200
                ${index === activeTab ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-sm' : 'bg-white text-blue-500 border border-blue-100 hover:bg-blue-50'}
              `,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: child.props.title || `Tab ${index + 1}`
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/UI/TableFormat.js",
                                    lineNumber: 489,
                                    columnNumber: 15
                                }, this),
                                tabCount > 1 && typeof onRemoveTab === 'function' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 14,
                                    className: "ml-2 text-gray-400 hover:text-red-500 cursor-pointer",
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onRemoveTab(index);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/UI/TableFormat.js",
                                    lineNumber: 491,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, index, true, {
                            fileName: "[project]/src/Component/UI/TableFormat.js",
                            lineNumber: 478,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/Component/UI/TableFormat.js",
                    lineNumber: 476,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/TableFormat.js",
                lineNumber: 475,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white mt-3 rounded-md border border-blue-100 p-1 shadow-sm transition-all duration-300",
                children: children[activeTab]
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/TableFormat.js",
                lineNumber: 506,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/TableFormat.js",
        lineNumber: 473,
        columnNumber: 5
    }, this);
};
_c19 = Tabs;
const Tab = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
_c20 = Tab;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20;
__turbopack_context__.k.register(_c, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c1, "DialogContent");
__turbopack_context__.k.register(_c2, "DialogTitle");
__turbopack_context__.k.register(_c3, "Button$React.forwardRef");
__turbopack_context__.k.register(_c4, "Button");
__turbopack_context__.k.register(_c5, "Table");
__turbopack_context__.k.register(_c6, "TableHeader");
__turbopack_context__.k.register(_c7, "TableBody");
__turbopack_context__.k.register(_c8, "TableRow");
__turbopack_context__.k.register(_c9, "TableHead");
__turbopack_context__.k.register(_c10, "TableCell");
__turbopack_context__.k.register(_c11, "ExpandableTableRow");
__turbopack_context__.k.register(_c12, "Card");
__turbopack_context__.k.register(_c13, "ConfirmDialog");
__turbopack_context__.k.register(_c14, "Input$React.forwardRef");
__turbopack_context__.k.register(_c15, "Input");
__turbopack_context__.k.register(_c16, "Grid");
__turbopack_context__.k.register(_c17, "Container");
__turbopack_context__.k.register(_c18, "StatusBadge");
__turbopack_context__.k.register(_c19, "Tabs");
__turbopack_context__.k.register(_c20, "Tab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/Component/Dashboard/EventCard.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$TableFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/UI/TableFormat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
const EventCard = ({ event, onView, onEdit, onDelete })=>{
    const handleAction = (e, action)=>{
        e.stopPropagation();
        action(event);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].article, {
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        whileHover: {
            y: -8,
            boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)'
        },
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 15
        },
        className: "relative flex flex-col h-full bg-white rounded-xl border border-gray-100 overflow-hidden group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.8
                    },
                    whileHover: {
                        opacity: 1,
                        scale: 1.2,
                        transition: {
                            duration: 0.4
                        }
                    },
                    className: "absolute inset-0 bg-gradient-to-br from-blue-50/30 via-blue-100/10 to-transparent pointer-events-none"
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventCard.js",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                whileHover: {
                    boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
                    transition: {
                        duration: 0.3
                    }
                },
                className: "absolute inset-0 pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-semibold text-gray-800 text-center line-clamp-2",
                    children: event.title
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventCard.js",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex flex-col flex-grow p-5 z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center text-gray-500 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiCalendar"], {
                                className: "w-5 h-5 mr-2 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium",
                                children: [
                                    new Date(event.dates.start).toLocaleDateString(),
                                    " - ",
                                    new Date(event.dates.end).toLocaleDateString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/Component/Dashboard/EventCard.js",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto flex justify-end space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$TableFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiEye"],
                                onClick: (e)=>handleAction(e, onView),
                                className: "group-hover:bg-blue-50/50 transition-colors",
                                children: "View"
                            }, void 0, false, {
                                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$TableFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "primary",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiEdit2"],
                                onClick: (e)=>handleAction(e, onEdit),
                                className: "group-hover:bg-blue-700 transition-colors",
                                children: "Edit"
                            }, void 0, false, {
                                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$TableFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "danger",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiTrash2"],
                                onClick: (e)=>handleAction(e, onDelete),
                                className: "group-hover:bg-red-700 transition-colors",
                                children: "Delete"
                            }, void 0, false, {
                                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/Component/Dashboard/EventCard.js",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/Dashboard/EventCard.js",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/Dashboard/EventCard.js",
        lineNumber: 13,
        columnNumber: 5
    }, this);
};
_c = EventCard;
const __TURBOPACK__default__export__ = EventCard;
var _c;
__turbopack_context__.k.register(_c, "EventCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/Component/UI/ReusableCom.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DetailItem": (()=>DetailItem),
    "InfoCard": (()=>InfoCard),
    "InputField": (()=>InputField),
    "NativeSelectField": (()=>NativeSelectField),
    "OtpPasswordInput": (()=>OtpPasswordInput),
    "Skeleton": (()=>Skeleton),
    "SkeletonWrapper": (()=>SkeletonWrapper),
    "TextAreaField": (()=>TextAreaField)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const InputField = ({ id, label, required = false, name, value, onChange, placeholder, readOnly = false, type = 'text', className = '', inputClass = '', textarea = false, rows = 3 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full max-w-full font-sans ${className}`,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: "block text-sm md:text-base font-semibold text-gray-700 mb-1 md:mb-2",
                children: [
                    label,
                    " ",
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/Component/UI/ReusableCom.js",
                        lineNumber: 25,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 24,
                columnNumber: 9
            }, this),
            textarea ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                id: id,
                name: name,
                value: value,
                onChange: onChange,
                placeholder: placeholder,
                required: required,
                readOnly: readOnly,
                rows: rows,
                className: `w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${inputClass}`
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 29,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: id,
                name: name,
                type: type,
                value: value,
                onChange: onChange,
                placeholder: placeholder,
                required: required,
                readOnly: readOnly,
                className: `w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${inputClass}`
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 41,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/ReusableCom.js",
        lineNumber: 22,
        columnNumber: 5
    }, this);
};
_c = InputField;
const NativeSelectField = ({ id, label, name, value, onChange, onClick, options = [], placeholder, required = false, className = "", selectClass = "" })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: "block mb-0.5 font-medium text-gray-700",
                children: [
                    label,
                    " ",
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/Component/UI/ReusableCom.js",
                        lineNumber: 76,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 75,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                id: id,
                name: name,
                value: value,
                onChange: onChange,
                onClick: onClick,
                required: required,
                className: `w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 ${selectClass}`,
                children: [
                    placeholder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: placeholder
                    }, void 0, false, {
                        fileName: "[project]/src/Component/UI/ReusableCom.js",
                        lineNumber: 88,
                        columnNumber: 25
                    }, this),
                    options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: opt.value,
                            children: opt.label
                        }, opt.value, false, {
                            fileName: "[project]/src/Component/UI/ReusableCom.js",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/ReusableCom.js",
        lineNumber: 73,
        columnNumber: 5
    }, this);
};
_c1 = NativeSelectField;
const InfoCard = ({ title, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-xl border border-gray-200 p-3 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xl font-semibold text-gray-900 mb-2 border-b pb-2",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 104,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/ReusableCom.js",
        lineNumber: 102,
        columnNumber: 5
    }, this);
};
_c2 = InfoCard;
const DetailItem = ({ label, value })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex text-sm text-gray-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                className: "font-medium font-semibold w-32",
                children: [
                    label,
                    ":"
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                className: "ml-1",
                children: value || "-"
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 113,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/ReusableCom.js",
        lineNumber: 111,
        columnNumber: 5
    }, this);
};
_c3 = DetailItem;
const TextAreaField = ({ id, label, name, value, onChange, placeholder, required = false, className = "", textareaClass = "" })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: "block mb-0.5 font-medium text-gray-700",
                children: [
                    label,
                    " ",
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/Component/UI/ReusableCom.js",
                        lineNumber: 135,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 134,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                id: id,
                name: name,
                value: value,
                onChange: onChange,
                placeholder: placeholder,
                required: required,
                className: `w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${textareaClass}`
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/ReusableCom.js",
        lineNumber: 132,
        columnNumber: 5
    }, this);
};
_c4 = TextAreaField;
const Skeleton = ({ className = "", variant = "rectangular", width, height, ...props })=>{
    const baseClasses = "bg-gray-200 animate-pulse rounded";
    const variants = {
        rectangular: "",
        circular: "rounded-full",
        text: "h-4 rounded-full",
        title: "h-6 rounded-lg w-3/4",
        subtitle: "h-4 rounded-lg w-1/2",
        button: "h-10 rounded-lg w-24",
        card: "h-full w-full rounded-lg"
    };
    const style = {
        ...width && {
            width: typeof width === 'number' ? `${width}px` : width
        },
        ...height && {
            height: typeof height === 'number' ? `${height}px` : height
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        className: `${baseClasses} ${variants[variant] || ''} ${className}`,
        style: style,
        initial: {
            opacity: 0.7
        },
        animate: {
            opacity: 1
        },
        transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse'
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/ReusableCom.js",
        lineNumber: 172,
        columnNumber: 5
    }, this);
};
_c5 = Skeleton;
const SkeletonWrapper = ({ children, isLoading = true, className = "", ...props })=>{
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `animate-pulse ${className}`,
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/Component/UI/ReusableCom.js",
            lineNumber: 187,
            columnNumber: 7
        }, this);
    }
    return children;
};
_c6 = SkeletonWrapper;
const OtpPasswordInput = ({ value = "", onChange, length = 6 })=>{
    _s();
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Array(length).fill(""));
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OtpPasswordInput.useEffect": ()=>{
            if (value && value.length === length) {
                setOtp(value.split(""));
            }
        }
    }["OtpPasswordInput.useEffect"], [
        value,
        length
    ]);
    const handleChange = (index, e)=>{
        const digit = e.target.value.replace(/\D/, "");
        if (!digit) return;
        const updated = [
            ...otp
        ];
        updated[index] = digit;
        setOtp(updated);
        onChange?.(updated.join(""));
        // Focus next input
        if (index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (index, e)=>{
        if (e.key === "Backspace") {
            e.preventDefault();
            const updated = [
                ...otp
            ];
            if (otp[index] === "" && index > 0) {
                updated[index - 1] = "";
                inputRefs.current[index - 1]?.focus();
            } else {
                updated[index] = "";
            }
            setOtp(updated);
            onChange?.(updated.join(""));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex items-center gap-2",
        children: [
            otp.map((digit, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    ref: (el)=>inputRefs.current[idx] = el,
                    type: showPassword ? "text" : "password",
                    inputMode: "numeric",
                    maxLength: "1",
                    value: digit,
                    onChange: (e)=>handleChange(idx, e),
                    onKeyDown: (e)=>handleKeyDown(idx, e),
                    className: "w-10 h-10 text-center border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                }, idx, false, {
                    fileName: "[project]/src/Component/UI/ReusableCom.js",
                    lineNumber: 242,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setShowPassword((prev)=>!prev),
                className: "ml-2 text-gray-500 hover:text-gray-800",
                title: showPassword ? "Hide Password" : "Show Password",
                children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/src/Component/UI/ReusableCom.js",
                    lineNumber: 261,
                    columnNumber: 25
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/src/Component/UI/ReusableCom.js",
                    lineNumber: 261,
                    columnNumber: 48
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/Component/UI/ReusableCom.js",
                lineNumber: 255,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/UI/ReusableCom.js",
        lineNumber: 240,
        columnNumber: 5
    }, this);
};
_s(OtpPasswordInput, "/C2w0tzk+8evGD9pDh07vsdVdTg=");
_c7 = OtpPasswordInput;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "InputField");
__turbopack_context__.k.register(_c1, "NativeSelectField");
__turbopack_context__.k.register(_c2, "InfoCard");
__turbopack_context__.k.register(_c3, "DetailItem");
__turbopack_context__.k.register(_c4, "TextAreaField");
__turbopack_context__.k.register(_c5, "Skeleton");
__turbopack_context__.k.register(_c6, "SkeletonWrapper");
__turbopack_context__.k.register(_c7, "OtpPasswordInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/Component/UI/Modal.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
'use client';
;
;
;
const Modal = ({ isOpen, onClose, title, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0
            },
            transition: {
                duration: 0.2
            },
            className: "fixed inset-0 z-50 flex items-center justify-center p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        backdropFilter: 'blur(0px)'
                    },
                    animate: {
                        backdropFilter: 'blur(4px)'
                    },
                    exit: {
                        backdropFilter: 'blur(0px)'
                    },
                    className: "fixed inset-0 bg-black/30",
                    onClick: onClose
                }, void 0, false, {
                    fileName: "[project]/src/Component/UI/Modal.js",
                    lineNumber: 17,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        y: 20,
                        opacity: 0
                    },
                    animate: {
                        y: 0,
                        opacity: 1
                    },
                    exit: {
                        y: 20,
                        opacity: 0
                    },
                    transition: {
                        type: 'spring',
                        damping: 20,
                        stiffness: 300
                    },
                    className: "relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gradient-to-r from-blue-50 to-purple-50 p-5 border-b border-gray-100",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-semibold text-gray-800",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/UI/Modal.js",
                                        lineNumber: 36,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onClose,
                                        className: "p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700",
                                        "aria-label": "Close modal",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 20,
                                            strokeWidth: 2
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/UI/Modal.js",
                                            lineNumber: 42,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/UI/Modal.js",
                                        lineNumber: 37,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/Component/UI/Modal.js",
                                lineNumber: 35,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/Component/UI/Modal.js",
                            lineNumber: 34,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/Component/UI/Modal.js",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/UI/Modal.js",
                    lineNumber: 26,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/UI/Modal.js",
            lineNumber: 9,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Component/UI/Modal.js",
        lineNumber: 7,
        columnNumber: 5
    }, this);
};
_c = Modal;
const __TURBOPACK__default__export__ = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/Component/Dashboard/EventForm.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>EventForm)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/UI/ReusableCom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$Modal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/UI/Modal.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const initialState = {
    title: '',
    year: new Date().getFullYear(),
    edition: 1,
    websiteURL: '',
    socialMediaLinks: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: ''
    },
    dates: {
        start: '',
        end: ''
    },
    location: {
        address: '',
        latitude: 0,
        longitude: 0,
        googleMapsLink: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
    },
    description: ''
};
function EventForm({ onSuccess, onClose, eventData = {} }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('basic');
    // Initialize form data based on edit mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventForm.useEffect": ()=>{
            if (eventData?.editMode) {
                // Format dates for datetime-local inputs
                const formattedData = {
                    ...eventData,
                    dates: {
                        start: eventData.dates.start ? formatDateForInput(eventData.dates.start) : '',
                        end: eventData.dates.end ? formatDateForInput(eventData.dates.end) : ''
                    }
                };
                setFormData(formattedData);
            } else {
                setFormData(initialState);
            }
        }
    }["EventForm.useEffect"], [
        eventData
    ]);
    const formatDateForInput = (dateString)=>{
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };
    const handleChange = (e)=>{
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev)=>({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                }));
        } else {
            setFormData((prev)=>({
                    ...prev,
                    [name]: value
                }));
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Format dates back to ISO string before submission
            const submissionData = {
                ...formData,
                dates: {
                    start: new Date(formData.dates.start).toISOString(),
                    end: new Date(formData.dates.end).toISOString()
                }
            };
            const method = eventData?.editMode ? 'PUT' : 'POST';
            const url = eventData?.editMode ? `/api/admin/data/eventoutreach/${eventData._id}` : '/api/admin/data/eventoutreach';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save event');
            }
            const result = await response.json();
            onSuccess(result.data);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Event ${eventData?.editMode ? 'updated' : 'created'} successfully!`);
            onClose();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Failed to save event');
            console.error('Error:', error);
        } finally{
            setIsSubmitting(false);
        }
    };
    const renderSectionNavigation = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-b",
                children: [
                    'basic',
                    'dateLocation',
                    'media'
                ].map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setActiveSection(section),
                        className: `px-4 py-2 font-medium text-sm transition-colors ${activeSection === section ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`,
                        children: [
                            section === 'basic' && 'Basic Info',
                            section === 'dateLocation' && 'Date & Location',
                            section === 'media' && 'Media & Social'
                        ]
                    }, section, true, {
                        fileName: "[project]/src/Component/Dashboard/EventForm.js",
                        lineNumber: 133,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/Component/Dashboard/EventForm.js",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/Component/Dashboard/EventForm.js",
            lineNumber: 130,
            columnNumber: 5
        }, this);
    const renderBasicInfoSection = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                    id: "event-title",
                    label: "Event Title",
                    name: "title",
                    value: formData.title,
                    onChange: handleChange,
                    required: true,
                    containerClass: "mb-4"
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 154,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-year",
                            label: "Year",
                            name: "year",
                            type: "number",
                            value: formData.year,
                            onChange: handleChange,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 165,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-edition",
                            label: "Edition",
                            name: "edition",
                            type: "number",
                            value: formData.edition,
                            onChange: handleChange,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 174,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 164,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextAreaField"], {
                    id: "event-description",
                    label: "Description",
                    name: "description",
                    value: formData.description,
                    onChange: handleChange,
                    rows: 4,
                    containerClass: "mb-4"
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 185,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                    id: "event-website",
                    label: "Website URL",
                    name: "websiteURL",
                    type: "url",
                    value: formData.websiteURL,
                    onChange: handleChange,
                    placeholder: "https://example.com"
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 195,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/Dashboard/EventForm.js",
            lineNumber: 153,
            columnNumber: 5
        }, this);
    const renderDateLocationSection = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-start-date",
                            label: "Start Date",
                            name: "dates.start",
                            type: "datetime-local",
                            value: formData.dates.start,
                            onChange: handleChange,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 210,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-end-date",
                            label: "End Date",
                            name: "dates.end",
                            type: "datetime-local",
                            value: formData.dates.end,
                            onChange: handleChange,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 219,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 209,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-city",
                            label: "City",
                            name: "location.city",
                            value: formData.location.city,
                            onChange: handleChange,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 231,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-state",
                            label: "State",
                            name: "location.state",
                            value: formData.location.state,
                            onChange: handleChange,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 239,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-country",
                            label: "Country",
                            name: "location.country",
                            value: formData.location.country,
                            onChange: handleChange,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 247,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 230,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                    id: "event-address",
                    label: "Full Address",
                    name: "location.address",
                    value: formData.location.address,
                    onChange: handleChange,
                    required: true,
                    containerClass: "mb-4"
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 257,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-pincode",
                            label: "Postal Code",
                            name: "location.pincode",
                            value: formData.location.pincode,
                            onChange: handleChange,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 268,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-latitude",
                            label: "Latitude",
                            name: "location.latitude",
                            type: "number",
                            value: formData.location.latitude,
                            onChange: handleChange,
                            step: "any"
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 276,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                            id: "event-longitude",
                            label: "Longitude",
                            name: "location.longitude",
                            type: "number",
                            value: formData.location.longitude,
                            onChange: handleChange,
                            step: "any"
                        }, void 0, false, {
                            fileName: "[project]/src/Component/Dashboard/EventForm.js",
                            lineNumber: 285,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 267,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                    id: "event-gmaps",
                    label: "Google Maps Link",
                    name: "location.googleMapsLink",
                    type: "url",
                    value: formData.location.googleMapsLink,
                    onChange: handleChange,
                    placeholder: "https://maps.google.com/...",
                    containerClass: "mt-4"
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 296,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/Dashboard/EventForm.js",
            lineNumber: 208,
            columnNumber: 5
        }, this);
    const renderMediaSection = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: Object.entries(formData.socialMediaLinks).map(([platform, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputField"], {
                    id: `event-${platform}`,
                    label: platform.charAt(0).toUpperCase() + platform.slice(1),
                    name: `socialMediaLinks.${platform}`,
                    type: "url",
                    value: value,
                    onChange: handleChange,
                    placeholder: `https://${platform}.com/...`,
                    containerClass: "mb-3"
                }, platform, false, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 312,
                    columnNumber: 9
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/Component/Dashboard/EventForm.js",
            lineNumber: 310,
            columnNumber: 5
        }, this);
    const renderFooterButtons = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between pt-6 mt-6 border-t",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: activeSection !== 'basic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setActiveSection(activeSection === 'dateLocation' ? 'basic' : 'dateLocation'),
                        className: "px-4 py-2 text-sm border rounded text-gray-700 hover:bg-gray-50 transition-colors",
                        children: "Back"
                    }, void 0, false, {
                        fileName: "[project]/src/Component/Dashboard/EventForm.js",
                        lineNumber: 331,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 329,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: activeSection !== 'media' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setActiveSection(activeSection === 'basic' ? 'dateLocation' : 'media'),
                        className: "px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors",
                        children: "Next"
                    }, void 0, false, {
                        fileName: "[project]/src/Component/Dashboard/EventForm.js",
                        lineNumber: 342,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: isSubmitting,
                        className: "px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors",
                        children: isSubmitting ? eventData?.editMode ? 'Updating...' : 'Creating...' : eventData?.editMode ? 'Update Event' : 'Create Event'
                    }, void 0, false, {
                        fileName: "[project]/src/Component/Dashboard/EventForm.js",
                        lineNumber: 350,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Component/Dashboard/EventForm.js",
                    lineNumber: 340,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/Dashboard/EventForm.js",
            lineNumber: 328,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$Modal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: true,
        onClose: onClose,
        title: eventData?.editMode ? 'Edit Event' : 'Create New Event',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            children: [
                renderSectionNavigation(),
                activeSection === 'basic' && renderBasicInfoSection(),
                activeSection === 'dateLocation' && renderDateLocationSection(),
                activeSection === 'media' && renderMediaSection(),
                renderFooterButtons()
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/Dashboard/EventForm.js",
            lineNumber: 370,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Component/Dashboard/EventForm.js",
        lineNumber: 365,
        columnNumber: 5
    }, this);
}
_s(EventForm, "/rDG0W+2uaVzhgXFBjcupWvpuIA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = EventForm;
var _c;
__turbopack_context__.k.register(_c, "EventForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/administration/dashboard/loading.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DashboardLoading)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/UI/ReusableCom.js [app-client] (ecmascript)");
'use client';
;
;
function DashboardLoading() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-10 w-48"
                    }, void 0, false, {
                        fileName: "[project]/src/app/administration/dashboard/loading.js",
                        lineNumber: 8,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-10 w-32"
                    }, void 0, false, {
                        fileName: "[project]/src/app/administration/dashboard/loading.js",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/administration/dashboard/loading.js",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: [
                    ...Array(3)
                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                className: "h-6 w-3/4 mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/administration/dashboard/loading.js",
                                lineNumber: 15,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                className: "h-4 w-1/2 mb-2"
                            }, void 0, false, {
                                fileName: "[project]/src/app/administration/dashboard/loading.js",
                                lineNumber: 16,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                className: "h-4 w-1/3"
                            }, void 0, false, {
                                fileName: "[project]/src/app/administration/dashboard/loading.js",
                                lineNumber: 17,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "h-8 w-20"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/administration/dashboard/loading.js",
                                        lineNumber: 19,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$ReusableCom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "h-8 w-20"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/administration/dashboard/loading.js",
                                        lineNumber: 20,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/administration/dashboard/loading.js",
                                lineNumber: 18,
                                columnNumber: 13
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/app/administration/dashboard/loading.js",
                        lineNumber: 14,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/administration/dashboard/loading.js",
                lineNumber: 12,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/administration/dashboard/loading.js",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = DashboardLoading;
var _c;
__turbopack_context__.k.register(_c, "DashboardLoading");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/administration/dashboard/page.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DashboardPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Redux$2f$Reducer$2f$menuSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Redux/Reducer/menuSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$ApiManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilities/ApiManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Dashboard$2f$EventCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/Dashboard/EventCard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Dashboard$2f$EventForm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/Dashboard/EventForm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$Modal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/UI/Modal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$TableFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/UI/TableFormat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$administration$2f$dashboard$2f$loading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/administration/dashboard/loading.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
function DashboardPage() {
    _s();
    const [events, setEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [modalState, setModalState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        open: Boolean(false),
        data: null
    });
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])({
        "DashboardPage.useSelector[isLoading]": (state)=>state.menu.loading
    }["DashboardPage.useSelector[isLoading]"]);
    const fetchEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardPage.useCallback[fetchEvents]": async ()=>{
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Redux$2f$Reducer$2f$menuSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLoading"])(true));
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilities$2f$ApiManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventApi"])(null, "Get");
                if (!response.ok) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to fetch events');
                const data = await response.json();
                setEvents(data.data);
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(err.message);
            } finally{
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Redux$2f$Reducer$2f$menuSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLoading"])(false));
            }
        }
    }["DashboardPage.useCallback[fetchEvents]"], [
        dispatch
    ]);
    const handleView = (event)=>{
        router.push(`/administration/dashboard/specificEventCard/${event._id}`);
    };
    const handleDelete = (event)=>{
        console.log(event);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            fetchEvents();
        }
    }["DashboardPage.useEffect"], [
        fetchEvents
    ]);
    const handleEditEvent = (event)=>{
        const editData = {
            ...event,
            editMode: true
        };
        console.log(editData);
        setModalState({
            open: Boolean(true),
            data: editData
        });
    };
    const handleCloseModal = ()=>{
        setModalState({
            open: Boolean(false),
            data: null
        });
    };
    const onSuccess = ()=>{
        fetchEvents();
        handleCloseModal();
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$administration$2f$dashboard$2f$loading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/administration/dashboard/page.js",
            lineNumber: 66,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "p-6 h-full overflow-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: "Event Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/src/app/administration/dashboard/page.js",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$UI$2f$TableFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>setModalState({
                                open: Boolean(true),
                                data: null
                            }),
                        className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded",
                        children: "Create New Event"
                    }, void 0, false, {
                        fileName: "[project]/src/app/administration/dashboard/page.js",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/administration/dashboard/page.js",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            events.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500",
                    children: "No events found. Create your first event!"
                }, void 0, false, {
                    fileName: "[project]/src/app/administration/dashboard/page.js",
                    lineNumber: 83,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/administration/dashboard/page.js",
                lineNumber: 82,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                layout: true,
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: events.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Dashboard$2f$EventCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            event: event,
                            onView: handleView,
                            onEdit: handleEditEvent,
                            onDelete: handleDelete
                        }, `event-${event._id}`, false, {
                            fileName: "[project]/src/app/administration/dashboard/page.js",
                            lineNumber: 92,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/administration/dashboard/page.js",
                    lineNumber: 90,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/administration/dashboard/page.js",
                lineNumber: 86,
                columnNumber: 9
            }, this),
            modalState.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Dashboard$2f$EventForm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSuccess: onSuccess,
                onClose: handleCloseModal,
                eventData: modalState.data
            }, void 0, false, {
                fileName: "[project]/src/app/administration/dashboard/page.js",
                lineNumber: 104,
                columnNumber: 27
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/administration/dashboard/page.js",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "zXlgEVCK5Lqt9CUhJyLlxIkBRLA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"]
    ];
});
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_c18b827b._.js.map