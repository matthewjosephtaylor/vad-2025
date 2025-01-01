var Ko = Object.defineProperty;
var Xo = (e, t, r) => t in e ? Ko(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var vt = (e, t, r) => Xo(e, typeof t != "symbol" ? t + "" : t, r);
import * as H from "react";
import et, { forwardRef as Jo, useContext as Qo, Children as Zo, isValidElement as qt, cloneElement as Gt, useEffect as er, useRef as ei, useState as tr } from "react";
function oo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ft = { exports: {} }, St = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var un;
function ti() {
  if (un) return St;
  un = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.fragment");
  function r(n, o, i) {
    var a = null;
    if (i !== void 0 && (a = "" + i), o.key !== void 0 && (a = "" + o.key), "key" in o) {
      i = {};
      for (var s in o)
        s !== "key" && (i[s] = o[s]);
    } else i = o;
    return o = i.ref, {
      $$typeof: e,
      type: n,
      key: a,
      ref: o !== void 0 ? o : null,
      props: i
    };
  }
  return St.Fragment = t, St.jsx = r, St.jsxs = r, St;
}
var Et = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ln;
function ri() {
  return ln || (ln = 1, process.env.NODE_ENV !== "production" && function() {
    function e(g) {
      if (g == null) return null;
      if (typeof g == "function")
        return g.$$typeof === j ? null : g.displayName || g.name || null;
      if (typeof g == "string") return g;
      switch (g) {
        case F:
          return "Fragment";
        case h:
          return "Portal";
        case ee:
          return "Profiler";
        case V:
          return "StrictMode";
        case U:
          return "Suspense";
        case d:
          return "SuspenseList";
      }
      if (typeof g == "object")
        switch (typeof g.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), g.$$typeof) {
          case c:
            return (g.displayName || "Context") + ".Provider";
          case re:
            return (g._context.displayName || "Context") + ".Consumer";
          case B:
            var N = g.render;
            return g = g.displayName, g || (g = N.displayName || N.name || "", g = g !== "" ? "ForwardRef(" + g + ")" : "ForwardRef"), g;
          case l:
            return N = g.displayName || null, N !== null ? N : e(g.type) || "Memo";
          case S:
            N = g._payload, g = g._init;
            try {
              return e(g(N));
            } catch {
            }
        }
      return null;
    }
    function t(g) {
      return "" + g;
    }
    function r(g) {
      try {
        t(g);
        var N = !1;
      } catch {
        N = !0;
      }
      if (N) {
        N = console;
        var G = N.error, ne = typeof Symbol == "function" && Symbol.toStringTag && g[Symbol.toStringTag] || g.constructor.name || "Object";
        return G.call(
          N,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          ne
        ), t(g);
      }
    }
    function n() {
    }
    function o() {
      if (W === 0) {
        z = console.log, K = console.info, X = console.warn, J = console.error, Q = console.group, q = console.groupCollapsed, te = console.groupEnd;
        var g = {
          configurable: !0,
          enumerable: !0,
          value: n,
          writable: !0
        };
        Object.defineProperties(console, {
          info: g,
          log: g,
          warn: g,
          error: g,
          group: g,
          groupCollapsed: g,
          groupEnd: g
        });
      }
      W++;
    }
    function i() {
      if (W--, W === 0) {
        var g = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: _({}, g, { value: z }),
          info: _({}, g, { value: K }),
          warn: _({}, g, { value: X }),
          error: _({}, g, { value: J }),
          group: _({}, g, { value: Q }),
          groupCollapsed: _({}, g, { value: q }),
          groupEnd: _({}, g, { value: te })
        });
      }
      0 > W && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function a(g) {
      if (w === void 0)
        try {
          throw Error();
        } catch (G) {
          var N = G.stack.trim().match(/\n( *(at )?)/);
          w = N && N[1] || "", le = -1 < G.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < G.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + w + g + le;
    }
    function s(g, N) {
      if (!g || we) return "";
      var G = je.get(g);
      if (G !== void 0) return G;
      we = !0, G = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var ne = null;
      ne = L.H, L.H = null, o();
      try {
        var Te = {
          DetermineComponentFrameRoot: function() {
            try {
              if (N) {
                var He = function() {
                  throw Error();
                };
                if (Object.defineProperty(He.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(He, []);
                  } catch (We) {
                    var Bt = We;
                  }
                  Reflect.construct(g, [], He);
                } else {
                  try {
                    He.call();
                  } catch (We) {
                    Bt = We;
                  }
                  g.call(He.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (We) {
                  Bt = We;
                }
                (He = g()) && typeof He.catch == "function" && He.catch(function() {
                });
              }
            } catch (We) {
              if (We && Bt && typeof We.stack == "string")
                return [We.stack, Bt.stack];
            }
            return [null, null];
          }
        };
        Te.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var ge = Object.getOwnPropertyDescriptor(
          Te.DetermineComponentFrameRoot,
          "name"
        );
        ge && ge.configurable && Object.defineProperty(
          Te.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var Z = Te.DetermineComponentFrameRoot(), Ye = Z[0], nt = Z[1];
        if (Ye && nt) {
          var _e = Ye.split(`
`), Ze = nt.split(`
`);
          for (Z = ge = 0; ge < _e.length && !_e[ge].includes(
            "DetermineComponentFrameRoot"
          ); )
            ge++;
          for (; Z < Ze.length && !Ze[Z].includes(
            "DetermineComponentFrameRoot"
          ); )
            Z++;
          if (ge === _e.length || Z === Ze.length)
            for (ge = _e.length - 1, Z = Ze.length - 1; 1 <= ge && 0 <= Z && _e[ge] !== Ze[Z]; )
              Z--;
          for (; 1 <= ge && 0 <= Z; ge--, Z--)
            if (_e[ge] !== Ze[Z]) {
              if (ge !== 1 || Z !== 1)
                do
                  if (ge--, Z--, 0 > Z || _e[ge] !== Ze[Z]) {
                    var bt = `
` + _e[ge].replace(
                      " at new ",
                      " at "
                    );
                    return g.displayName && bt.includes("<anonymous>") && (bt = bt.replace("<anonymous>", g.displayName)), typeof g == "function" && je.set(g, bt), bt;
                  }
                while (1 <= ge && 0 <= Z);
              break;
            }
        }
      } finally {
        we = !1, L.H = ne, i(), Error.prepareStackTrace = G;
      }
      return _e = (_e = g ? g.displayName || g.name : "") ? a(_e) : "", typeof g == "function" && je.set(g, _e), _e;
    }
    function f(g) {
      if (g == null) return "";
      if (typeof g == "function") {
        var N = g.prototype;
        return s(
          g,
          !(!N || !N.isReactComponent)
        );
      }
      if (typeof g == "string") return a(g);
      switch (g) {
        case U:
          return a("Suspense");
        case d:
          return a("SuspenseList");
      }
      if (typeof g == "object")
        switch (g.$$typeof) {
          case B:
            return g = s(g.render, !1), g;
          case l:
            return f(g.type);
          case S:
            N = g._payload, g = g._init;
            try {
              return f(g(N));
            } catch {
            }
        }
      return "";
    }
    function p() {
      var g = L.A;
      return g === null ? null : g.getOwner();
    }
    function b(g) {
      if (T.call(g, "key")) {
        var N = Object.getOwnPropertyDescriptor(g, "key").get;
        if (N && N.isReactWarning) return !1;
      }
      return g.key !== void 0;
    }
    function y(g, N) {
      function G() {
        Qe || (Qe = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          N
        ));
      }
      G.isReactWarning = !0, Object.defineProperty(g, "key", {
        get: G,
        configurable: !0
      });
    }
    function E() {
      var g = e(this.type);
      return Ge[g] || (Ge[g] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), g = this.props.ref, g !== void 0 ? g : null;
    }
    function $(g, N, G, ne, Te, ge) {
      return G = ge.ref, g = {
        $$typeof: R,
        type: g,
        key: N,
        props: ge,
        _owner: Te
      }, (G !== void 0 ? G : null) !== null ? Object.defineProperty(g, "ref", {
        enumerable: !1,
        get: E
      }) : Object.defineProperty(g, "ref", { enumerable: !1, value: null }), g._store = {}, Object.defineProperty(g._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(g, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(g.props), Object.freeze(g)), g;
    }
    function C(g, N, G, ne, Te, ge) {
      if (typeof g == "string" || typeof g == "function" || g === F || g === ee || g === V || g === U || g === d || g === m || typeof g == "object" && g !== null && (g.$$typeof === S || g.$$typeof === l || g.$$typeof === c || g.$$typeof === re || g.$$typeof === B || g.$$typeof === I || g.getModuleId !== void 0)) {
        var Z = N.children;
        if (Z !== void 0)
          if (ne)
            if (D(Z)) {
              for (ne = 0; ne < Z.length; ne++)
                u(Z[ne], g);
              Object.freeze && Object.freeze(Z);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else u(Z, g);
      } else
        Z = "", (g === void 0 || typeof g == "object" && g !== null && Object.keys(g).length === 0) && (Z += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), g === null ? ne = "null" : D(g) ? ne = "array" : g !== void 0 && g.$$typeof === R ? (ne = "<" + (e(g.type) || "Unknown") + " />", Z = " Did you accidentally export a JSX literal instead of a component?") : ne = typeof g, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          ne,
          Z
        );
      if (T.call(N, "key")) {
        Z = e(g);
        var Ye = Object.keys(N).filter(function(_e) {
          return _e !== "key";
        });
        ne = 0 < Ye.length ? "{key: someKey, " + Ye.join(": ..., ") + ": ...}" : "{key: someKey}", jt[Z + ne] || (Ye = 0 < Ye.length ? "{" + Ye.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          ne,
          Z,
          Ye,
          Z
        ), jt[Z + ne] = !0);
      }
      if (Z = null, G !== void 0 && (r(G), Z = "" + G), b(N) && (r(N.key), Z = "" + N.key), "key" in N) {
        G = {};
        for (var nt in N)
          nt !== "key" && (G[nt] = N[nt]);
      } else G = N;
      return Z && y(
        G,
        typeof g == "function" ? g.displayName || g.name || "Unknown" : g
      ), $(g, Z, ge, Te, p(), G);
    }
    function u(g, N) {
      if (typeof g == "object" && g && g.$$typeof !== wr) {
        if (D(g))
          for (var G = 0; G < g.length; G++) {
            var ne = g[G];
            P(ne) && M(ne, N);
          }
        else if (P(g))
          g._store && (g._store.validated = 1);
        else if (g === null || typeof g != "object" ? G = null : (G = O && g[O] || g["@@iterator"], G = typeof G == "function" ? G : null), typeof G == "function" && G !== g.entries && (G = G.call(g), G !== g))
          for (; !(g = G.next()).done; )
            P(g.value) && M(g.value, N);
      }
    }
    function P(g) {
      return typeof g == "object" && g !== null && g.$$typeof === R;
    }
    function M(g, N) {
      if (g._store && !g._store.validated && g.key == null && (g._store.validated = 1, N = Y(N), !yt[N])) {
        yt[N] = !0;
        var G = "";
        g && g._owner != null && g._owner !== p() && (G = null, typeof g._owner.tag == "number" ? G = e(g._owner.type) : typeof g._owner.name == "string" && (G = g._owner.name), G = " It was passed a child from " + G + ".");
        var ne = L.getCurrentStack;
        L.getCurrentStack = function() {
          var Te = f(g.type);
          return ne && (Te += ne() || ""), Te;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          N,
          G
        ), L.getCurrentStack = ne;
      }
    }
    function Y(g) {
      var N = "", G = p();
      return G && (G = e(G.type)) && (N = `

Check the render method of \`` + G + "`."), N || (g = e(g)) && (N = `

Check the top-level render call using <` + g + ">."), N;
    }
    var k = et, R = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), F = Symbol.for("react.fragment"), V = Symbol.for("react.strict_mode"), ee = Symbol.for("react.profiler"), re = Symbol.for("react.consumer"), c = Symbol.for("react.context"), B = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), l = Symbol.for("react.memo"), S = Symbol.for("react.lazy"), m = Symbol.for("react.offscreen"), O = Symbol.iterator, j = Symbol.for("react.client.reference"), L = k.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, T = Object.prototype.hasOwnProperty, _ = Object.assign, I = Symbol.for("react.client.reference"), D = Array.isArray, W = 0, z, K, X, J, Q, q, te;
    n.__reactDisabledLog = !0;
    var w, le, we = !1, je = new (typeof WeakMap == "function" ? WeakMap : Map)(), wr = Symbol.for("react.client.reference"), Qe, Ge = {}, jt = {}, yt = {};
    Et.Fragment = F, Et.jsx = function(g, N, G, ne, Te) {
      return C(g, N, G, !1, ne, Te);
    }, Et.jsxs = function(g, N, G, ne, Te) {
      return C(g, N, G, !0, ne, Te);
    };
  }()), Et;
}
var fn;
function ni() {
  return fn || (fn = 1, process.env.NODE_ENV === "production" ? Ft.exports = ti() : Ft.exports = ri()), Ft.exports;
}
var Ee = ni();
const Ot = {
  black: "#000",
  white: "#fff"
}, ot = {
  50: "#ffebee",
  100: "#ffcdd2",
  200: "#ef9a9a",
  300: "#e57373",
  400: "#ef5350",
  500: "#f44336",
  600: "#e53935",
  700: "#d32f2f",
  800: "#c62828",
  900: "#b71c1c",
  A100: "#ff8a80",
  A200: "#ff5252",
  A400: "#ff1744",
  A700: "#d50000"
}, it = {
  50: "#f3e5f5",
  100: "#e1bee7",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#9c27b0",
  600: "#8e24aa",
  700: "#7b1fa2",
  800: "#6a1b9a",
  900: "#4a148c",
  A100: "#ea80fc",
  A200: "#e040fb",
  A400: "#d500f9",
  A700: "#aa00ff"
}, at = {
  50: "#e3f2fd",
  100: "#bbdefb",
  200: "#90caf9",
  300: "#64b5f6",
  400: "#42a5f5",
  500: "#2196f3",
  600: "#1e88e5",
  700: "#1976d2",
  800: "#1565c0",
  900: "#0d47a1",
  A100: "#82b1ff",
  A200: "#448aff",
  A400: "#2979ff",
  A700: "#2962ff"
}, st = {
  50: "#e1f5fe",
  100: "#b3e5fc",
  200: "#81d4fa",
  300: "#4fc3f7",
  400: "#29b6f6",
  500: "#03a9f4",
  600: "#039be5",
  700: "#0288d1",
  800: "#0277bd",
  900: "#01579b",
  A100: "#80d8ff",
  A200: "#40c4ff",
  A400: "#00b0ff",
  A700: "#0091ea"
}, ct = {
  50: "#e8f5e9",
  100: "#c8e6c9",
  200: "#a5d6a7",
  300: "#81c784",
  400: "#66bb6a",
  500: "#4caf50",
  600: "#43a047",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20",
  A100: "#b9f6ca",
  A200: "#69f0ae",
  A400: "#00e676",
  A700: "#00c853"
}, wt = {
  50: "#fff3e0",
  100: "#ffe0b2",
  200: "#ffcc80",
  300: "#ffb74d",
  400: "#ffa726",
  500: "#ff9800",
  600: "#fb8c00",
  700: "#f57c00",
  800: "#ef6c00",
  900: "#e65100",
  A100: "#ffd180",
  A200: "#ffab40",
  A400: "#ff9100",
  A700: "#ff6d00"
}, oi = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#f5f5f5",
  A200: "#eeeeee",
  A400: "#bdbdbd",
  A700: "#616161"
};
function Ke(e, ...t) {
  const r = new URL(`https://mui.com/production-error/?code=${e}`);
  return t.forEach((n) => r.searchParams.append("args[]", n)), `Minified MUI error #${e}; visit ${r} for the full message.`;
}
const ii = "$$material";
function rr() {
  return rr = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, rr.apply(null, arguments);
}
var ai = !1;
function si(e) {
  if (e.sheet)
    return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e)
      return document.styleSheets[t];
}
function ci(e) {
  var t = document.createElement("style");
  return t.setAttribute("data-emotion", e.key), e.nonce !== void 0 && t.setAttribute("nonce", e.nonce), t.appendChild(document.createTextNode("")), t.setAttribute("data-s", ""), t;
}
var ui = /* @__PURE__ */ function() {
  function e(r) {
    var n = this;
    this._insertTag = function(o) {
      var i;
      n.tags.length === 0 ? n.insertionPoint ? i = n.insertionPoint.nextSibling : n.prepend ? i = n.container.firstChild : i = n.before : i = n.tags[n.tags.length - 1].nextSibling, n.container.insertBefore(o, i), n.tags.push(o);
    }, this.isSpeedy = r.speedy === void 0 ? !ai : r.speedy, this.tags = [], this.ctr = 0, this.nonce = r.nonce, this.key = r.key, this.container = r.container, this.prepend = r.prepend, this.insertionPoint = r.insertionPoint, this.before = null;
  }
  var t = e.prototype;
  return t.hydrate = function(n) {
    n.forEach(this._insertTag);
  }, t.insert = function(n) {
    this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(ci(this));
    var o = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var i = si(o);
      try {
        i.insertRule(n, i.cssRules.length);
      } catch {
      }
    } else
      o.appendChild(document.createTextNode(n));
    this.ctr++;
  }, t.flush = function() {
    this.tags.forEach(function(n) {
      var o;
      return (o = n.parentNode) == null ? void 0 : o.removeChild(n);
    }), this.tags = [], this.ctr = 0;
  }, e;
}(), Ce = "-ms-", nr = "-moz-", oe = "-webkit-", io = "comm", Yr = "rule", Wr = "decl", li = "@import", ao = "@keyframes", fi = "@layer", di = Math.abs, ar = String.fromCharCode, pi = Object.assign;
function mi(e, t) {
  return xe(e, 0) ^ 45 ? (((t << 2 ^ xe(e, 0)) << 2 ^ xe(e, 1)) << 2 ^ xe(e, 2)) << 2 ^ xe(e, 3) : 0;
}
function so(e) {
  return e.trim();
}
function hi(e, t) {
  return (e = t.exec(e)) ? e[0] : e;
}
function ie(e, t, r) {
  return e.replace(t, r);
}
function Ir(e, t) {
  return e.indexOf(t);
}
function xe(e, t) {
  return e.charCodeAt(t) | 0;
}
function Rt(e, t, r) {
  return e.slice(t, r);
}
function De(e) {
  return e.length;
}
function Ur(e) {
  return e.length;
}
function Dt(e, t) {
  return t.push(e), e;
}
function gi(e, t) {
  return e.map(t).join("");
}
var sr = 1, pt = 1, co = 0, Ae = 0, Se = 0, ht = "";
function cr(e, t, r, n, o, i, a) {
  return { value: e, root: t, parent: r, type: n, props: o, children: i, line: sr, column: pt, length: a, return: "" };
}
function xt(e, t) {
  return pi(cr("", null, null, "", null, null, 0), e, { length: -e.length }, t);
}
function yi() {
  return Se;
}
function bi() {
  return Se = Ae > 0 ? xe(ht, --Ae) : 0, pt--, Se === 10 && (pt = 1, sr--), Se;
}
function Me() {
  return Se = Ae < co ? xe(ht, Ae++) : 0, pt++, Se === 10 && (pt = 1, sr++), Se;
}
function Ve() {
  return xe(ht, Ae);
}
function Ht() {
  return Ae;
}
function Mt(e, t) {
  return Rt(ht, e, t);
}
function At(e) {
  switch (e) {
    // \0 \t \n \r \s whitespace token
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    // ! + , / > @ ~ isolate token
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    // ; { } breakpoint token
    case 59:
    case 123:
    case 125:
      return 4;
    // : accompanied token
    case 58:
      return 3;
    // " ' ( [ opening delimit token
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    // ) ] closing delimit token
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function uo(e) {
  return sr = pt = 1, co = De(ht = e), Ae = 0, [];
}
function lo(e) {
  return ht = "", e;
}
function Kt(e) {
  return so(Mt(Ae - 1, jr(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function vi(e) {
  for (; (Se = Ve()) && Se < 33; )
    Me();
  return At(e) > 2 || At(Se) > 3 ? "" : " ";
}
function Si(e, t) {
  for (; --t && Me() && !(Se < 48 || Se > 102 || Se > 57 && Se < 65 || Se > 70 && Se < 97); )
    ;
  return Mt(e, Ht() + (t < 6 && Ve() == 32 && Me() == 32));
}
function jr(e) {
  for (; Me(); )
    switch (Se) {
      // ] ) " '
      case e:
        return Ae;
      // " '
      case 34:
      case 39:
        e !== 34 && e !== 39 && jr(Se);
        break;
      // (
      case 40:
        e === 41 && jr(e);
        break;
      // \
      case 92:
        Me();
        break;
    }
  return Ae;
}
function Ei(e, t) {
  for (; Me() && e + Se !== 57; )
    if (e + Se === 84 && Ve() === 47)
      break;
  return "/*" + Mt(t, Ae - 1) + "*" + ar(e === 47 ? e : Me());
}
function wi(e) {
  for (; !At(Ve()); )
    Me();
  return Mt(e, Ae);
}
function xi(e) {
  return lo(Xt("", null, null, null, [""], e = uo(e), 0, [0], e));
}
function Xt(e, t, r, n, o, i, a, s, f) {
  for (var p = 0, b = 0, y = a, E = 0, $ = 0, C = 0, u = 1, P = 1, M = 1, Y = 0, k = "", R = o, h = i, F = n, V = k; P; )
    switch (C = Y, Y = Me()) {
      // (
      case 40:
        if (C != 108 && xe(V, y - 1) == 58) {
          Ir(V += ie(Kt(Y), "&", "&\f"), "&\f") != -1 && (M = -1);
          break;
        }
      // " ' [
      case 34:
      case 39:
      case 91:
        V += Kt(Y);
        break;
      // \t \n \r \s
      case 9:
      case 10:
      case 13:
      case 32:
        V += vi(C);
        break;
      // \
      case 92:
        V += Si(Ht() - 1, 7);
        continue;
      // /
      case 47:
        switch (Ve()) {
          case 42:
          case 47:
            Dt(Ti(Ei(Me(), Ht()), t, r), f);
            break;
          default:
            V += "/";
        }
        break;
      // {
      case 123 * u:
        s[p++] = De(V) * M;
      // } ; \0
      case 125 * u:
      case 59:
      case 0:
        switch (Y) {
          // \0 }
          case 0:
          case 125:
            P = 0;
          // ;
          case 59 + b:
            M == -1 && (V = ie(V, /\f/g, "")), $ > 0 && De(V) - y && Dt($ > 32 ? pn(V + ";", n, r, y - 1) : pn(ie(V, " ", "") + ";", n, r, y - 2), f);
            break;
          // @ ;
          case 59:
            V += ";";
          // { rule/at-rule
          default:
            if (Dt(F = dn(V, t, r, p, b, o, s, k, R = [], h = [], y), i), Y === 123)
              if (b === 0)
                Xt(V, t, F, F, R, i, y, s, h);
              else
                switch (E === 99 && xe(V, 3) === 110 ? 100 : E) {
                  // d l m s
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    Xt(e, F, F, n && Dt(dn(e, F, F, 0, 0, o, s, k, o, R = [], y), h), o, h, y, s, n ? R : h);
                    break;
                  default:
                    Xt(V, F, F, F, [""], h, 0, s, h);
                }
        }
        p = b = $ = 0, u = M = 1, k = V = "", y = a;
        break;
      // :
      case 58:
        y = 1 + De(V), $ = C;
      default:
        if (u < 1) {
          if (Y == 123)
            --u;
          else if (Y == 125 && u++ == 0 && bi() == 125)
            continue;
        }
        switch (V += ar(Y), Y * u) {
          // &
          case 38:
            M = b > 0 ? 1 : (V += "\f", -1);
            break;
          // ,
          case 44:
            s[p++] = (De(V) - 1) * M, M = 1;
            break;
          // @
          case 64:
            Ve() === 45 && (V += Kt(Me())), E = Ve(), b = y = De(k = V += wi(Ht())), Y++;
            break;
          // -
          case 45:
            C === 45 && De(V) == 2 && (u = 0);
        }
    }
  return i;
}
function dn(e, t, r, n, o, i, a, s, f, p, b) {
  for (var y = o - 1, E = o === 0 ? i : [""], $ = Ur(E), C = 0, u = 0, P = 0; C < n; ++C)
    for (var M = 0, Y = Rt(e, y + 1, y = di(u = a[C])), k = e; M < $; ++M)
      (k = so(u > 0 ? E[M] + " " + Y : ie(Y, /&\f/g, E[M]))) && (f[P++] = k);
  return cr(e, t, r, o === 0 ? Yr : s, f, p, b);
}
function Ti(e, t, r) {
  return cr(e, t, r, io, ar(yi()), Rt(e, 2, -2), 0);
}
function pn(e, t, r, n) {
  return cr(e, t, r, Wr, Rt(e, 0, n), Rt(e, n + 1, -1), n);
}
function ft(e, t) {
  for (var r = "", n = Ur(e), o = 0; o < n; o++)
    r += t(e[o], o, e, t) || "";
  return r;
}
function Ci(e, t, r, n) {
  switch (e.type) {
    case fi:
      if (e.children.length) break;
    case li:
    case Wr:
      return e.return = e.return || e.value;
    case io:
      return "";
    case ao:
      return e.return = e.value + "{" + ft(e.children, n) + "}";
    case Yr:
      e.value = e.props.join(",");
  }
  return De(r = ft(e.children, n)) ? e.return = e.value + "{" + r + "}" : "";
}
function _i(e) {
  var t = Ur(e);
  return function(r, n, o, i) {
    for (var a = "", s = 0; s < t; s++)
      a += e[s](r, n, o, i) || "";
    return a;
  };
}
function Oi(e) {
  return function(t) {
    t.root || (t = t.return) && e(t);
  };
}
function fo(e) {
  var t = /* @__PURE__ */ Object.create(null);
  return function(r) {
    return t[r] === void 0 && (t[r] = e(r)), t[r];
  };
}
var Ri = function(t, r, n) {
  for (var o = 0, i = 0; o = i, i = Ve(), o === 38 && i === 12 && (r[n] = 1), !At(i); )
    Me();
  return Mt(t, Ae);
}, Ai = function(t, r) {
  var n = -1, o = 44;
  do
    switch (At(o)) {
      case 0:
        o === 38 && Ve() === 12 && (r[n] = 1), t[n] += Ri(Ae - 1, r, n);
        break;
      case 2:
        t[n] += Kt(o);
        break;
      case 4:
        if (o === 44) {
          t[++n] = Ve() === 58 ? "&\f" : "", r[n] = t[n].length;
          break;
        }
      // fallthrough
      default:
        t[n] += ar(o);
    }
  while (o = Me());
  return t;
}, Pi = function(t, r) {
  return lo(Ai(uo(t), r));
}, mn = /* @__PURE__ */ new WeakMap(), $i = function(t) {
  if (!(t.type !== "rule" || !t.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  t.length < 1)) {
    for (var r = t.value, n = t.parent, o = t.column === n.column && t.line === n.line; n.type !== "rule"; )
      if (n = n.parent, !n) return;
    if (!(t.props.length === 1 && r.charCodeAt(0) !== 58 && !mn.get(n)) && !o) {
      mn.set(t, !0);
      for (var i = [], a = Pi(r, i), s = n.props, f = 0, p = 0; f < a.length; f++)
        for (var b = 0; b < s.length; b++, p++)
          t.props[p] = i[f] ? a[f].replace(/&\f/g, s[b]) : s[b] + " " + a[f];
    }
  }
}, Mi = function(t) {
  if (t.type === "decl") {
    var r = t.value;
    // charcode for l
    r.charCodeAt(0) === 108 && // charcode for b
    r.charCodeAt(2) === 98 && (t.return = "", t.value = "");
  }
};
function po(e, t) {
  switch (mi(e, t)) {
    // color-adjust
    case 5103:
      return oe + "print-" + e + e;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return oe + e + e;
    // appearance, user-select, transform, hyphens, text-size-adjust
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return oe + e + nr + e + Ce + e + e;
    // flex, flex-direction
    case 6828:
    case 4268:
      return oe + e + Ce + e + e;
    // order
    case 6165:
      return oe + e + Ce + "flex-" + e + e;
    // align-items
    case 5187:
      return oe + e + ie(e, /(\w+).+(:[^]+)/, oe + "box-$1$2" + Ce + "flex-$1$2") + e;
    // align-self
    case 5443:
      return oe + e + Ce + "flex-item-" + ie(e, /flex-|-self/, "") + e;
    // align-content
    case 4675:
      return oe + e + Ce + "flex-line-pack" + ie(e, /align-content|flex-|-self/, "") + e;
    // flex-shrink
    case 5548:
      return oe + e + Ce + ie(e, "shrink", "negative") + e;
    // flex-basis
    case 5292:
      return oe + e + Ce + ie(e, "basis", "preferred-size") + e;
    // flex-grow
    case 6060:
      return oe + "box-" + ie(e, "-grow", "") + oe + e + Ce + ie(e, "grow", "positive") + e;
    // transition
    case 4554:
      return oe + ie(e, /([^-])(transform)/g, "$1" + oe + "$2") + e;
    // cursor
    case 6187:
      return ie(ie(ie(e, /(zoom-|grab)/, oe + "$1"), /(image-set)/, oe + "$1"), e, "") + e;
    // background, background-image
    case 5495:
    case 3959:
      return ie(e, /(image-set\([^]*)/, oe + "$1$`$1");
    // justify-content
    case 4968:
      return ie(ie(e, /(.+:)(flex-)?(.*)/, oe + "box-pack:$3" + Ce + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + oe + e + e;
    // (margin|padding)-inline-(start|end)
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return ie(e, /(.+)-inline(.+)/, oe + "$1$2") + e;
    // (min|max)?(width|height|inline-size|block-size)
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (De(e) - 1 - t > 6) switch (xe(e, t + 1)) {
        // (m)ax-content, (m)in-content
        case 109:
          if (xe(e, t + 4) !== 45) break;
        // (f)ill-available, (f)it-content
        case 102:
          return ie(e, /(.+:)(.+)-([^]+)/, "$1" + oe + "$2-$3$1" + nr + (xe(e, t + 3) == 108 ? "$3" : "$2-$3")) + e;
        // (s)tretch
        case 115:
          return ~Ir(e, "stretch") ? po(ie(e, "stretch", "fill-available"), t) + e : e;
      }
      break;
    // position: sticky
    case 4949:
      if (xe(e, t + 1) !== 115) break;
    // display: (flex|inline-flex)
    case 6444:
      switch (xe(e, De(e) - 3 - (~Ir(e, "!important") && 10))) {
        // stic(k)y
        case 107:
          return ie(e, ":", ":" + oe) + e;
        // (inline-)?fl(e)x
        case 101:
          return ie(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + oe + (xe(e, 14) === 45 ? "inline-" : "") + "box$3$1" + oe + "$2$3$1" + Ce + "$2box$3") + e;
      }
      break;
    // writing-mode
    case 5936:
      switch (xe(e, t + 11)) {
        // vertical-l(r)
        case 114:
          return oe + e + Ce + ie(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        // vertical-r(l)
        case 108:
          return oe + e + Ce + ie(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        // horizontal(-)tb
        case 45:
          return oe + e + Ce + ie(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return oe + e + Ce + e + e;
  }
  return e;
}
var ki = function(t, r, n, o) {
  if (t.length > -1 && !t.return) switch (t.type) {
    case Wr:
      t.return = po(t.value, t.length);
      break;
    case ao:
      return ft([xt(t, {
        value: ie(t.value, "@", "@" + oe)
      })], o);
    case Yr:
      if (t.length) return gi(t.props, function(i) {
        switch (hi(i, /(::plac\w+|:read-\w+)/)) {
          // :read-(only|write)
          case ":read-only":
          case ":read-write":
            return ft([xt(t, {
              props: [ie(i, /:(read-\w+)/, ":" + nr + "$1")]
            })], o);
          // :placeholder
          case "::placeholder":
            return ft([xt(t, {
              props: [ie(i, /:(plac\w+)/, ":" + oe + "input-$1")]
            }), xt(t, {
              props: [ie(i, /:(plac\w+)/, ":" + nr + "$1")]
            }), xt(t, {
              props: [ie(i, /:(plac\w+)/, Ce + "input-$1")]
            })], o);
        }
        return "";
      });
  }
}, Ni = [ki], Ii = function(t) {
  var r = t.key;
  if (r === "css") {
    var n = document.querySelectorAll("style[data-emotion]:not([data-s])");
    Array.prototype.forEach.call(n, function(u) {
      var P = u.getAttribute("data-emotion");
      P.indexOf(" ") !== -1 && (document.head.appendChild(u), u.setAttribute("data-s", ""));
    });
  }
  var o = t.stylisPlugins || Ni, i = {}, a, s = [];
  a = t.container || document.head, Array.prototype.forEach.call(
    // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll('style[data-emotion^="' + r + ' "]'),
    function(u) {
      for (var P = u.getAttribute("data-emotion").split(" "), M = 1; M < P.length; M++)
        i[P[M]] = !0;
      s.push(u);
    }
  );
  var f, p = [$i, Mi];
  {
    var b, y = [Ci, Oi(function(u) {
      b.insert(u);
    })], E = _i(p.concat(o, y)), $ = function(P) {
      return ft(xi(P), E);
    };
    f = function(P, M, Y, k) {
      b = Y, $(P ? P + "{" + M.styles + "}" : M.styles), k && (C.inserted[M.name] = !0);
    };
  }
  var C = {
    key: r,
    sheet: new ui({
      key: r,
      container: a,
      nonce: t.nonce,
      speedy: t.speedy,
      prepend: t.prepend,
      insertionPoint: t.insertionPoint
    }),
    nonce: t.nonce,
    inserted: i,
    registered: {},
    insert: f
  };
  return C.sheet.hydrate(s), C;
}, zt = { exports: {} }, ae = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hn;
function ji() {
  if (hn) return ae;
  hn = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, s = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, p = e ? Symbol.for("react.concurrent_mode") : 60111, b = e ? Symbol.for("react.forward_ref") : 60112, y = e ? Symbol.for("react.suspense") : 60113, E = e ? Symbol.for("react.suspense_list") : 60120, $ = e ? Symbol.for("react.memo") : 60115, C = e ? Symbol.for("react.lazy") : 60116, u = e ? Symbol.for("react.block") : 60121, P = e ? Symbol.for("react.fundamental") : 60117, M = e ? Symbol.for("react.responder") : 60118, Y = e ? Symbol.for("react.scope") : 60119;
  function k(h) {
    if (typeof h == "object" && h !== null) {
      var F = h.$$typeof;
      switch (F) {
        case t:
          switch (h = h.type, h) {
            case f:
            case p:
            case n:
            case i:
            case o:
            case y:
              return h;
            default:
              switch (h = h && h.$$typeof, h) {
                case s:
                case b:
                case C:
                case $:
                case a:
                  return h;
                default:
                  return F;
              }
          }
        case r:
          return F;
      }
    }
  }
  function R(h) {
    return k(h) === p;
  }
  return ae.AsyncMode = f, ae.ConcurrentMode = p, ae.ContextConsumer = s, ae.ContextProvider = a, ae.Element = t, ae.ForwardRef = b, ae.Fragment = n, ae.Lazy = C, ae.Memo = $, ae.Portal = r, ae.Profiler = i, ae.StrictMode = o, ae.Suspense = y, ae.isAsyncMode = function(h) {
    return R(h) || k(h) === f;
  }, ae.isConcurrentMode = R, ae.isContextConsumer = function(h) {
    return k(h) === s;
  }, ae.isContextProvider = function(h) {
    return k(h) === a;
  }, ae.isElement = function(h) {
    return typeof h == "object" && h !== null && h.$$typeof === t;
  }, ae.isForwardRef = function(h) {
    return k(h) === b;
  }, ae.isFragment = function(h) {
    return k(h) === n;
  }, ae.isLazy = function(h) {
    return k(h) === C;
  }, ae.isMemo = function(h) {
    return k(h) === $;
  }, ae.isPortal = function(h) {
    return k(h) === r;
  }, ae.isProfiler = function(h) {
    return k(h) === i;
  }, ae.isStrictMode = function(h) {
    return k(h) === o;
  }, ae.isSuspense = function(h) {
    return k(h) === y;
  }, ae.isValidElementType = function(h) {
    return typeof h == "string" || typeof h == "function" || h === n || h === p || h === i || h === o || h === y || h === E || typeof h == "object" && h !== null && (h.$$typeof === C || h.$$typeof === $ || h.$$typeof === a || h.$$typeof === s || h.$$typeof === b || h.$$typeof === P || h.$$typeof === M || h.$$typeof === Y || h.$$typeof === u);
  }, ae.typeOf = k, ae;
}
var se = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gn;
function Bi() {
  return gn || (gn = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, s = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, p = e ? Symbol.for("react.concurrent_mode") : 60111, b = e ? Symbol.for("react.forward_ref") : 60112, y = e ? Symbol.for("react.suspense") : 60113, E = e ? Symbol.for("react.suspense_list") : 60120, $ = e ? Symbol.for("react.memo") : 60115, C = e ? Symbol.for("react.lazy") : 60116, u = e ? Symbol.for("react.block") : 60121, P = e ? Symbol.for("react.fundamental") : 60117, M = e ? Symbol.for("react.responder") : 60118, Y = e ? Symbol.for("react.scope") : 60119;
    function k(w) {
      return typeof w == "string" || typeof w == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      w === n || w === p || w === i || w === o || w === y || w === E || typeof w == "object" && w !== null && (w.$$typeof === C || w.$$typeof === $ || w.$$typeof === a || w.$$typeof === s || w.$$typeof === b || w.$$typeof === P || w.$$typeof === M || w.$$typeof === Y || w.$$typeof === u);
    }
    function R(w) {
      if (typeof w == "object" && w !== null) {
        var le = w.$$typeof;
        switch (le) {
          case t:
            var we = w.type;
            switch (we) {
              case f:
              case p:
              case n:
              case i:
              case o:
              case y:
                return we;
              default:
                var je = we && we.$$typeof;
                switch (je) {
                  case s:
                  case b:
                  case C:
                  case $:
                  case a:
                    return je;
                  default:
                    return le;
                }
            }
          case r:
            return le;
        }
      }
    }
    var h = f, F = p, V = s, ee = a, re = t, c = b, B = n, U = C, d = $, l = r, S = i, m = o, O = y, j = !1;
    function L(w) {
      return j || (j = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), T(w) || R(w) === f;
    }
    function T(w) {
      return R(w) === p;
    }
    function _(w) {
      return R(w) === s;
    }
    function I(w) {
      return R(w) === a;
    }
    function D(w) {
      return typeof w == "object" && w !== null && w.$$typeof === t;
    }
    function W(w) {
      return R(w) === b;
    }
    function z(w) {
      return R(w) === n;
    }
    function K(w) {
      return R(w) === C;
    }
    function X(w) {
      return R(w) === $;
    }
    function J(w) {
      return R(w) === r;
    }
    function Q(w) {
      return R(w) === i;
    }
    function q(w) {
      return R(w) === o;
    }
    function te(w) {
      return R(w) === y;
    }
    se.AsyncMode = h, se.ConcurrentMode = F, se.ContextConsumer = V, se.ContextProvider = ee, se.Element = re, se.ForwardRef = c, se.Fragment = B, se.Lazy = U, se.Memo = d, se.Portal = l, se.Profiler = S, se.StrictMode = m, se.Suspense = O, se.isAsyncMode = L, se.isConcurrentMode = T, se.isContextConsumer = _, se.isContextProvider = I, se.isElement = D, se.isForwardRef = W, se.isFragment = z, se.isLazy = K, se.isMemo = X, se.isPortal = J, se.isProfiler = Q, se.isStrictMode = q, se.isSuspense = te, se.isValidElementType = k, se.typeOf = R;
  }()), se;
}
var yn;
function Fi() {
  return yn || (yn = 1, process.env.NODE_ENV === "production" ? zt.exports = ji() : zt.exports = Bi()), zt.exports;
}
var xr, bn;
function Di() {
  if (bn) return xr;
  bn = 1;
  var e = Fi(), t = {
    childContextTypes: !0,
    contextType: !0,
    contextTypes: !0,
    defaultProps: !0,
    displayName: !0,
    getDefaultProps: !0,
    getDerivedStateFromError: !0,
    getDerivedStateFromProps: !0,
    mixins: !0,
    propTypes: !0,
    type: !0
  }, r = {
    name: !0,
    length: !0,
    prototype: !0,
    caller: !0,
    callee: !0,
    arguments: !0,
    arity: !0
  }, n = {
    $$typeof: !0,
    render: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0
  }, o = {
    $$typeof: !0,
    compare: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0,
    type: !0
  }, i = {};
  i[e.ForwardRef] = n, i[e.Memo] = o;
  function a(C) {
    return e.isMemo(C) ? o : i[C.$$typeof] || t;
  }
  var s = Object.defineProperty, f = Object.getOwnPropertyNames, p = Object.getOwnPropertySymbols, b = Object.getOwnPropertyDescriptor, y = Object.getPrototypeOf, E = Object.prototype;
  function $(C, u, P) {
    if (typeof u != "string") {
      if (E) {
        var M = y(u);
        M && M !== E && $(C, M, P);
      }
      var Y = f(u);
      p && (Y = Y.concat(p(u)));
      for (var k = a(C), R = a(u), h = 0; h < Y.length; ++h) {
        var F = Y[h];
        if (!r[F] && !(P && P[F]) && !(R && R[F]) && !(k && k[F])) {
          var V = b(u, F);
          try {
            s(C, F, V);
          } catch {
          }
        }
      }
    }
    return C;
  }
  return xr = $, xr;
}
Di();
var zi = !0;
function mo(e, t, r) {
  var n = "";
  return r.split(" ").forEach(function(o) {
    e[o] !== void 0 ? t.push(e[o] + ";") : o && (n += o + " ");
  }), n;
}
var qr = function(t, r, n) {
  var o = t.key + "-" + r.name;
  // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (n === !1 || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  zi === !1) && t.registered[o] === void 0 && (t.registered[o] = r.styles);
}, ho = function(t, r, n) {
  qr(t, r, n);
  var o = t.key + "-" + r.name;
  if (t.inserted[r.name] === void 0) {
    var i = r;
    do
      t.insert(r === i ? "." + o : "", i, t.sheet, !0), i = i.next;
    while (i !== void 0);
  }
};
function Li(e) {
  for (var t = 0, r, n = 0, o = e.length; o >= 4; ++n, o -= 4)
    r = e.charCodeAt(n) & 255 | (e.charCodeAt(++n) & 255) << 8 | (e.charCodeAt(++n) & 255) << 16 | (e.charCodeAt(++n) & 255) << 24, r = /* Math.imul(k, m): */
    (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16), r ^= /* k >>> r: */
    r >>> 24, t = /* Math.imul(k, m): */
    (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  switch (o) {
    case 3:
      t ^= (e.charCodeAt(n + 2) & 255) << 16;
    case 2:
      t ^= (e.charCodeAt(n + 1) & 255) << 8;
    case 1:
      t ^= e.charCodeAt(n) & 255, t = /* Math.imul(h, m): */
      (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  }
  return t ^= t >>> 13, t = /* Math.imul(h, m): */
  (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), ((t ^ t >>> 15) >>> 0).toString(36);
}
var Vi = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  scale: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
}, Yi = /[A-Z]|^ms/g, Wi = /_EMO_([^_]+?)_([^]*?)_EMO_/g, go = function(t) {
  return t.charCodeAt(1) === 45;
}, vn = function(t) {
  return t != null && typeof t != "boolean";
}, Tr = /* @__PURE__ */ fo(function(e) {
  return go(e) ? e : e.replace(Yi, "-$&").toLowerCase();
}), Sn = function(t, r) {
  switch (t) {
    case "animation":
    case "animationName":
      if (typeof r == "string")
        return r.replace(Wi, function(n, o, i) {
          return ze = {
            name: o,
            styles: i,
            next: ze
          }, o;
        });
  }
  return Vi[t] !== 1 && !go(t) && typeof r == "number" && r !== 0 ? r + "px" : r;
};
function Pt(e, t, r) {
  if (r == null)
    return "";
  var n = r;
  if (n.__emotion_styles !== void 0)
    return n;
  switch (typeof r) {
    case "boolean":
      return "";
    case "object": {
      var o = r;
      if (o.anim === 1)
        return ze = {
          name: o.name,
          styles: o.styles,
          next: ze
        }, o.name;
      var i = r;
      if (i.styles !== void 0) {
        var a = i.next;
        if (a !== void 0)
          for (; a !== void 0; )
            ze = {
              name: a.name,
              styles: a.styles,
              next: ze
            }, a = a.next;
        var s = i.styles + ";";
        return s;
      }
      return Ui(e, t, r);
    }
    case "function": {
      if (e !== void 0) {
        var f = ze, p = r(e);
        return ze = f, Pt(e, t, p);
      }
      break;
    }
  }
  var b = r;
  if (t == null)
    return b;
  var y = t[b];
  return y !== void 0 ? y : b;
}
function Ui(e, t, r) {
  var n = "";
  if (Array.isArray(r))
    for (var o = 0; o < r.length; o++)
      n += Pt(e, t, r[o]) + ";";
  else
    for (var i in r) {
      var a = r[i];
      if (typeof a != "object") {
        var s = a;
        t != null && t[s] !== void 0 ? n += i + "{" + t[s] + "}" : vn(s) && (n += Tr(i) + ":" + Sn(i, s) + ";");
      } else if (Array.isArray(a) && typeof a[0] == "string" && (t == null || t[a[0]] === void 0))
        for (var f = 0; f < a.length; f++)
          vn(a[f]) && (n += Tr(i) + ":" + Sn(i, a[f]) + ";");
      else {
        var p = Pt(e, t, a);
        switch (i) {
          case "animation":
          case "animationName": {
            n += Tr(i) + ":" + p + ";";
            break;
          }
          default:
            n += i + "{" + p + "}";
        }
      }
    }
  return n;
}
var En = /label:\s*([^\s;{]+)\s*(;|$)/g, ze;
function ur(e, t, r) {
  if (e.length === 1 && typeof e[0] == "object" && e[0] !== null && e[0].styles !== void 0)
    return e[0];
  var n = !0, o = "";
  ze = void 0;
  var i = e[0];
  if (i == null || i.raw === void 0)
    n = !1, o += Pt(r, t, i);
  else {
    var a = i;
    o += a[0];
  }
  for (var s = 1; s < e.length; s++)
    if (o += Pt(r, t, e[s]), n) {
      var f = i;
      o += f[s];
    }
  En.lastIndex = 0;
  for (var p = "", b; (b = En.exec(o)) !== null; )
    p += "-" + b[1];
  var y = Li(o) + p;
  return {
    name: y,
    styles: o,
    next: ze
  };
}
var qi = function(t) {
  return t();
}, Gi = H.useInsertionEffect ? H.useInsertionEffect : !1, yo = Gi || qi, Hi = !1, bo = /* @__PURE__ */ H.createContext(
  // we're doing this to avoid preconstruct's dead code elimination in this one case
  // because this module is primarily intended for the browser and node
  // but it's also required in react native and similar environments sometimes
  // and we could have a special build just for that
  // but this is much easier and the native packages
  // might use a different theme context in the future anyway
  typeof HTMLElement < "u" ? /* @__PURE__ */ Ii({
    key: "css"
  }) : null
);
bo.Provider;
var vo = function(t) {
  return /* @__PURE__ */ Jo(function(r, n) {
    var o = Qo(bo);
    return t(r, o, n);
  });
}, Gr = /* @__PURE__ */ H.createContext({}), Hr = {}.hasOwnProperty, Br = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__", Ki = function(t, r) {
  var n = {};
  for (var o in r)
    Hr.call(r, o) && (n[o] = r[o]);
  return n[Br] = t, n;
}, Xi = function(t) {
  var r = t.cache, n = t.serialized, o = t.isStringTag;
  return qr(r, n, o), yo(function() {
    return ho(r, n, o);
  }), null;
}, Ji = /* @__PURE__ */ vo(function(e, t, r) {
  var n = e.css;
  typeof n == "string" && t.registered[n] !== void 0 && (n = t.registered[n]);
  var o = e[Br], i = [n], a = "";
  typeof e.className == "string" ? a = mo(t.registered, i, e.className) : e.className != null && (a = e.className + " ");
  var s = ur(i, void 0, H.useContext(Gr));
  a += t.key + "-" + s.name;
  var f = {};
  for (var p in e)
    Hr.call(e, p) && p !== "css" && p !== Br && !Hi && (f[p] = e[p]);
  return f.className = a, r && (f.ref = r), /* @__PURE__ */ H.createElement(H.Fragment, null, /* @__PURE__ */ H.createElement(Xi, {
    cache: t,
    serialized: s,
    isStringTag: typeof o == "string"
  }), /* @__PURE__ */ H.createElement(o, f));
}), Qi = Ji, Zi = function(t, r) {
  var n = arguments;
  if (r == null || !Hr.call(r, "css"))
    return H.createElement.apply(void 0, n);
  var o = n.length, i = new Array(o);
  i[0] = Qi, i[1] = Ki(t, r);
  for (var a = 2; a < o; a++)
    i[a] = n[a];
  return H.createElement.apply(null, i);
};
(function(e) {
  var t;
  t || (t = e.JSX || (e.JSX = {}));
})(Zi);
function ea() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return ur(t);
}
function Kr() {
  var e = ea.apply(void 0, arguments), t = "animation-" + e.name;
  return {
    name: t,
    styles: "@keyframes " + t + "{" + e.styles + "}",
    anim: 1,
    toString: function() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
}
var ta = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/, ra = /* @__PURE__ */ fo(
  function(e) {
    return ta.test(e) || e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) < 91;
  }
  /* Z+1 */
), na = ra, oa = function(t) {
  return t !== "theme";
}, wn = function(t) {
  return typeof t == "string" && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  t.charCodeAt(0) > 96 ? na : oa;
}, xn = function(t, r, n) {
  var o;
  if (r) {
    var i = r.shouldForwardProp;
    o = t.__emotion_forwardProp && i ? function(a) {
      return t.__emotion_forwardProp(a) && i(a);
    } : i;
  }
  return typeof o != "function" && n && (o = t.__emotion_forwardProp), o;
}, ia = function(t) {
  var r = t.cache, n = t.serialized, o = t.isStringTag;
  return qr(r, n, o), yo(function() {
    return ho(r, n, o);
  }), null;
}, aa = function e(t, r) {
  var n = t.__emotion_real === t, o = n && t.__emotion_base || t, i, a;
  r !== void 0 && (i = r.label, a = r.target);
  var s = xn(t, r, n), f = s || wn(o), p = !f("as");
  return function() {
    var b = arguments, y = n && t.__emotion_styles !== void 0 ? t.__emotion_styles.slice(0) : [];
    if (i !== void 0 && y.push("label:" + i + ";"), b[0] == null || b[0].raw === void 0)
      y.push.apply(y, b);
    else {
      var E = b[0];
      y.push(E[0]);
      for (var $ = b.length, C = 1; C < $; C++)
        y.push(b[C], E[C]);
    }
    var u = vo(function(P, M, Y) {
      var k = p && P.as || o, R = "", h = [], F = P;
      if (P.theme == null) {
        F = {};
        for (var V in P)
          F[V] = P[V];
        F.theme = H.useContext(Gr);
      }
      typeof P.className == "string" ? R = mo(M.registered, h, P.className) : P.className != null && (R = P.className + " ");
      var ee = ur(y.concat(h), M.registered, F);
      R += M.key + "-" + ee.name, a !== void 0 && (R += " " + a);
      var re = p && s === void 0 ? wn(k) : f, c = {};
      for (var B in P)
        p && B === "as" || re(B) && (c[B] = P[B]);
      return c.className = R, Y && (c.ref = Y), /* @__PURE__ */ H.createElement(H.Fragment, null, /* @__PURE__ */ H.createElement(ia, {
        cache: M,
        serialized: ee,
        isStringTag: typeof k == "string"
      }), /* @__PURE__ */ H.createElement(k, c));
    });
    return u.displayName = i !== void 0 ? i : "Styled(" + (typeof o == "string" ? o : o.displayName || o.name || "Component") + ")", u.defaultProps = t.defaultProps, u.__emotion_real = u, u.__emotion_base = o, u.__emotion_styles = y, u.__emotion_forwardProp = s, Object.defineProperty(u, "toString", {
      value: function() {
        return "." + a;
      }
    }), u.withComponent = function(P, M) {
      var Y = e(P, rr({}, r, M, {
        shouldForwardProp: xn(u, M, !0)
      }));
      return Y.apply(void 0, y);
    }, u;
  };
}, sa = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  // SVG
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
], Fr = aa.bind(null);
sa.forEach(function(e) {
  Fr[e] = Fr(e);
});
var Lt = { exports: {} }, Vt = { exports: {} }, ce = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tn;
function ca() {
  if (Tn) return ce;
  Tn = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, s = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, p = e ? Symbol.for("react.concurrent_mode") : 60111, b = e ? Symbol.for("react.forward_ref") : 60112, y = e ? Symbol.for("react.suspense") : 60113, E = e ? Symbol.for("react.suspense_list") : 60120, $ = e ? Symbol.for("react.memo") : 60115, C = e ? Symbol.for("react.lazy") : 60116, u = e ? Symbol.for("react.block") : 60121, P = e ? Symbol.for("react.fundamental") : 60117, M = e ? Symbol.for("react.responder") : 60118, Y = e ? Symbol.for("react.scope") : 60119;
  function k(h) {
    if (typeof h == "object" && h !== null) {
      var F = h.$$typeof;
      switch (F) {
        case t:
          switch (h = h.type, h) {
            case f:
            case p:
            case n:
            case i:
            case o:
            case y:
              return h;
            default:
              switch (h = h && h.$$typeof, h) {
                case s:
                case b:
                case C:
                case $:
                case a:
                  return h;
                default:
                  return F;
              }
          }
        case r:
          return F;
      }
    }
  }
  function R(h) {
    return k(h) === p;
  }
  return ce.AsyncMode = f, ce.ConcurrentMode = p, ce.ContextConsumer = s, ce.ContextProvider = a, ce.Element = t, ce.ForwardRef = b, ce.Fragment = n, ce.Lazy = C, ce.Memo = $, ce.Portal = r, ce.Profiler = i, ce.StrictMode = o, ce.Suspense = y, ce.isAsyncMode = function(h) {
    return R(h) || k(h) === f;
  }, ce.isConcurrentMode = R, ce.isContextConsumer = function(h) {
    return k(h) === s;
  }, ce.isContextProvider = function(h) {
    return k(h) === a;
  }, ce.isElement = function(h) {
    return typeof h == "object" && h !== null && h.$$typeof === t;
  }, ce.isForwardRef = function(h) {
    return k(h) === b;
  }, ce.isFragment = function(h) {
    return k(h) === n;
  }, ce.isLazy = function(h) {
    return k(h) === C;
  }, ce.isMemo = function(h) {
    return k(h) === $;
  }, ce.isPortal = function(h) {
    return k(h) === r;
  }, ce.isProfiler = function(h) {
    return k(h) === i;
  }, ce.isStrictMode = function(h) {
    return k(h) === o;
  }, ce.isSuspense = function(h) {
    return k(h) === y;
  }, ce.isValidElementType = function(h) {
    return typeof h == "string" || typeof h == "function" || h === n || h === p || h === i || h === o || h === y || h === E || typeof h == "object" && h !== null && (h.$$typeof === C || h.$$typeof === $ || h.$$typeof === a || h.$$typeof === s || h.$$typeof === b || h.$$typeof === P || h.$$typeof === M || h.$$typeof === Y || h.$$typeof === u);
  }, ce.typeOf = k, ce;
}
var ue = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Cn;
function ua() {
  return Cn || (Cn = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, s = e ? Symbol.for("react.context") : 60110, f = e ? Symbol.for("react.async_mode") : 60111, p = e ? Symbol.for("react.concurrent_mode") : 60111, b = e ? Symbol.for("react.forward_ref") : 60112, y = e ? Symbol.for("react.suspense") : 60113, E = e ? Symbol.for("react.suspense_list") : 60120, $ = e ? Symbol.for("react.memo") : 60115, C = e ? Symbol.for("react.lazy") : 60116, u = e ? Symbol.for("react.block") : 60121, P = e ? Symbol.for("react.fundamental") : 60117, M = e ? Symbol.for("react.responder") : 60118, Y = e ? Symbol.for("react.scope") : 60119;
    function k(w) {
      return typeof w == "string" || typeof w == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      w === n || w === p || w === i || w === o || w === y || w === E || typeof w == "object" && w !== null && (w.$$typeof === C || w.$$typeof === $ || w.$$typeof === a || w.$$typeof === s || w.$$typeof === b || w.$$typeof === P || w.$$typeof === M || w.$$typeof === Y || w.$$typeof === u);
    }
    function R(w) {
      if (typeof w == "object" && w !== null) {
        var le = w.$$typeof;
        switch (le) {
          case t:
            var we = w.type;
            switch (we) {
              case f:
              case p:
              case n:
              case i:
              case o:
              case y:
                return we;
              default:
                var je = we && we.$$typeof;
                switch (je) {
                  case s:
                  case b:
                  case C:
                  case $:
                  case a:
                    return je;
                  default:
                    return le;
                }
            }
          case r:
            return le;
        }
      }
    }
    var h = f, F = p, V = s, ee = a, re = t, c = b, B = n, U = C, d = $, l = r, S = i, m = o, O = y, j = !1;
    function L(w) {
      return j || (j = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), T(w) || R(w) === f;
    }
    function T(w) {
      return R(w) === p;
    }
    function _(w) {
      return R(w) === s;
    }
    function I(w) {
      return R(w) === a;
    }
    function D(w) {
      return typeof w == "object" && w !== null && w.$$typeof === t;
    }
    function W(w) {
      return R(w) === b;
    }
    function z(w) {
      return R(w) === n;
    }
    function K(w) {
      return R(w) === C;
    }
    function X(w) {
      return R(w) === $;
    }
    function J(w) {
      return R(w) === r;
    }
    function Q(w) {
      return R(w) === i;
    }
    function q(w) {
      return R(w) === o;
    }
    function te(w) {
      return R(w) === y;
    }
    ue.AsyncMode = h, ue.ConcurrentMode = F, ue.ContextConsumer = V, ue.ContextProvider = ee, ue.Element = re, ue.ForwardRef = c, ue.Fragment = B, ue.Lazy = U, ue.Memo = d, ue.Portal = l, ue.Profiler = S, ue.StrictMode = m, ue.Suspense = O, ue.isAsyncMode = L, ue.isConcurrentMode = T, ue.isContextConsumer = _, ue.isContextProvider = I, ue.isElement = D, ue.isForwardRef = W, ue.isFragment = z, ue.isLazy = K, ue.isMemo = X, ue.isPortal = J, ue.isProfiler = Q, ue.isStrictMode = q, ue.isSuspense = te, ue.isValidElementType = k, ue.typeOf = R;
  }()), ue;
}
var _n;
function So() {
  return _n || (_n = 1, process.env.NODE_ENV === "production" ? Vt.exports = ca() : Vt.exports = ua()), Vt.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var Cr, On;
function la() {
  if (On) return Cr;
  On = 1;
  var e = Object.getOwnPropertySymbols, t = Object.prototype.hasOwnProperty, r = Object.prototype.propertyIsEnumerable;
  function n(i) {
    if (i == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(i);
  }
  function o() {
    try {
      if (!Object.assign)
        return !1;
      var i = new String("abc");
      if (i[5] = "de", Object.getOwnPropertyNames(i)[0] === "5")
        return !1;
      for (var a = {}, s = 0; s < 10; s++)
        a["_" + String.fromCharCode(s)] = s;
      var f = Object.getOwnPropertyNames(a).map(function(b) {
        return a[b];
      });
      if (f.join("") !== "0123456789")
        return !1;
      var p = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(b) {
        p[b] = b;
      }), Object.keys(Object.assign({}, p)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return Cr = o() ? Object.assign : function(i, a) {
    for (var s, f = n(i), p, b = 1; b < arguments.length; b++) {
      s = Object(arguments[b]);
      for (var y in s)
        t.call(s, y) && (f[y] = s[y]);
      if (e) {
        p = e(s);
        for (var E = 0; E < p.length; E++)
          r.call(s, p[E]) && (f[p[E]] = s[p[E]]);
      }
    }
    return f;
  }, Cr;
}
var _r, Rn;
function Xr() {
  if (Rn) return _r;
  Rn = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return _r = e, _r;
}
var Or, An;
function Eo() {
  return An || (An = 1, Or = Function.call.bind(Object.prototype.hasOwnProperty)), Or;
}
var Rr, Pn;
function fa() {
  if (Pn) return Rr;
  Pn = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = /* @__PURE__ */ Xr(), r = {}, n = /* @__PURE__ */ Eo();
    e = function(i) {
      var a = "Warning: " + i;
      typeof console < "u" && console.error(a);
      try {
        throw new Error(a);
      } catch {
      }
    };
  }
  function o(i, a, s, f, p) {
    if (process.env.NODE_ENV !== "production") {
      for (var b in i)
        if (n(i, b)) {
          var y;
          try {
            if (typeof i[b] != "function") {
              var E = Error(
                (f || "React class") + ": " + s + " type `" + b + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof i[b] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw E.name = "Invariant Violation", E;
            }
            y = i[b](a, b, f, s, null, t);
          } catch (C) {
            y = C;
          }
          if (y && !(y instanceof Error) && e(
            (f || "React class") + ": type specification of " + s + " `" + b + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof y + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), y instanceof Error && !(y.message in r)) {
            r[y.message] = !0;
            var $ = p ? p() : "";
            e(
              "Failed " + s + " type: " + y.message + ($ ?? "")
            );
          }
        }
    }
  }
  return o.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (r = {});
  }, Rr = o, Rr;
}
var Ar, $n;
function da() {
  if ($n) return Ar;
  $n = 1;
  var e = So(), t = la(), r = /* @__PURE__ */ Xr(), n = /* @__PURE__ */ Eo(), o = /* @__PURE__ */ fa(), i = function() {
  };
  process.env.NODE_ENV !== "production" && (i = function(s) {
    var f = "Warning: " + s;
    typeof console < "u" && console.error(f);
    try {
      throw new Error(f);
    } catch {
    }
  });
  function a() {
    return null;
  }
  return Ar = function(s, f) {
    var p = typeof Symbol == "function" && Symbol.iterator, b = "@@iterator";
    function y(T) {
      var _ = T && (p && T[p] || T[b]);
      if (typeof _ == "function")
        return _;
    }
    var E = "<<anonymous>>", $ = {
      array: M("array"),
      bigint: M("bigint"),
      bool: M("boolean"),
      func: M("function"),
      number: M("number"),
      object: M("object"),
      string: M("string"),
      symbol: M("symbol"),
      any: Y(),
      arrayOf: k,
      element: R(),
      elementType: h(),
      instanceOf: F,
      node: c(),
      objectOf: ee,
      oneOf: V,
      oneOfType: re,
      shape: U,
      exact: d
    };
    function C(T, _) {
      return T === _ ? T !== 0 || 1 / T === 1 / _ : T !== T && _ !== _;
    }
    function u(T, _) {
      this.message = T, this.data = _ && typeof _ == "object" ? _ : {}, this.stack = "";
    }
    u.prototype = Error.prototype;
    function P(T) {
      if (process.env.NODE_ENV !== "production")
        var _ = {}, I = 0;
      function D(z, K, X, J, Q, q, te) {
        if (J = J || E, q = q || X, te !== r) {
          if (f) {
            var w = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw w.name = "Invariant Violation", w;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var le = J + ":" + X;
            !_[le] && // Avoid spamming the console because they are often not actionable except for lib authors
            I < 3 && (i(
              "You are manually calling a React.PropTypes validation function for the `" + q + "` prop on `" + J + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), _[le] = !0, I++);
          }
        }
        return K[X] == null ? z ? K[X] === null ? new u("The " + Q + " `" + q + "` is marked as required " + ("in `" + J + "`, but its value is `null`.")) : new u("The " + Q + " `" + q + "` is marked as required in " + ("`" + J + "`, but its value is `undefined`.")) : null : T(K, X, J, Q, q);
      }
      var W = D.bind(null, !1);
      return W.isRequired = D.bind(null, !0), W;
    }
    function M(T) {
      function _(I, D, W, z, K, X) {
        var J = I[D], Q = m(J);
        if (Q !== T) {
          var q = O(J);
          return new u(
            "Invalid " + z + " `" + K + "` of type " + ("`" + q + "` supplied to `" + W + "`, expected ") + ("`" + T + "`."),
            { expectedType: T }
          );
        }
        return null;
      }
      return P(_);
    }
    function Y() {
      return P(a);
    }
    function k(T) {
      function _(I, D, W, z, K) {
        if (typeof T != "function")
          return new u("Property `" + K + "` of component `" + W + "` has invalid PropType notation inside arrayOf.");
        var X = I[D];
        if (!Array.isArray(X)) {
          var J = m(X);
          return new u("Invalid " + z + " `" + K + "` of type " + ("`" + J + "` supplied to `" + W + "`, expected an array."));
        }
        for (var Q = 0; Q < X.length; Q++) {
          var q = T(X, Q, W, z, K + "[" + Q + "]", r);
          if (q instanceof Error)
            return q;
        }
        return null;
      }
      return P(_);
    }
    function R() {
      function T(_, I, D, W, z) {
        var K = _[I];
        if (!s(K)) {
          var X = m(K);
          return new u("Invalid " + W + " `" + z + "` of type " + ("`" + X + "` supplied to `" + D + "`, expected a single ReactElement."));
        }
        return null;
      }
      return P(T);
    }
    function h() {
      function T(_, I, D, W, z) {
        var K = _[I];
        if (!e.isValidElementType(K)) {
          var X = m(K);
          return new u("Invalid " + W + " `" + z + "` of type " + ("`" + X + "` supplied to `" + D + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return P(T);
    }
    function F(T) {
      function _(I, D, W, z, K) {
        if (!(I[D] instanceof T)) {
          var X = T.name || E, J = L(I[D]);
          return new u("Invalid " + z + " `" + K + "` of type " + ("`" + J + "` supplied to `" + W + "`, expected ") + ("instance of `" + X + "`."));
        }
        return null;
      }
      return P(_);
    }
    function V(T) {
      if (!Array.isArray(T))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? i(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : i("Invalid argument supplied to oneOf, expected an array.")), a;
      function _(I, D, W, z, K) {
        for (var X = I[D], J = 0; J < T.length; J++)
          if (C(X, T[J]))
            return null;
        var Q = JSON.stringify(T, function(te, w) {
          var le = O(w);
          return le === "symbol" ? String(w) : w;
        });
        return new u("Invalid " + z + " `" + K + "` of value `" + String(X) + "` " + ("supplied to `" + W + "`, expected one of " + Q + "."));
      }
      return P(_);
    }
    function ee(T) {
      function _(I, D, W, z, K) {
        if (typeof T != "function")
          return new u("Property `" + K + "` of component `" + W + "` has invalid PropType notation inside objectOf.");
        var X = I[D], J = m(X);
        if (J !== "object")
          return new u("Invalid " + z + " `" + K + "` of type " + ("`" + J + "` supplied to `" + W + "`, expected an object."));
        for (var Q in X)
          if (n(X, Q)) {
            var q = T(X, Q, W, z, K + "." + Q, r);
            if (q instanceof Error)
              return q;
          }
        return null;
      }
      return P(_);
    }
    function re(T) {
      if (!Array.isArray(T))
        return process.env.NODE_ENV !== "production" && i("Invalid argument supplied to oneOfType, expected an instance of array."), a;
      for (var _ = 0; _ < T.length; _++) {
        var I = T[_];
        if (typeof I != "function")
          return i(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + j(I) + " at index " + _ + "."
          ), a;
      }
      function D(W, z, K, X, J) {
        for (var Q = [], q = 0; q < T.length; q++) {
          var te = T[q], w = te(W, z, K, X, J, r);
          if (w == null)
            return null;
          w.data && n(w.data, "expectedType") && Q.push(w.data.expectedType);
        }
        var le = Q.length > 0 ? ", expected one of type [" + Q.join(", ") + "]" : "";
        return new u("Invalid " + X + " `" + J + "` supplied to " + ("`" + K + "`" + le + "."));
      }
      return P(D);
    }
    function c() {
      function T(_, I, D, W, z) {
        return l(_[I]) ? null : new u("Invalid " + W + " `" + z + "` supplied to " + ("`" + D + "`, expected a ReactNode."));
      }
      return P(T);
    }
    function B(T, _, I, D, W) {
      return new u(
        (T || "React class") + ": " + _ + " type `" + I + "." + D + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + W + "`."
      );
    }
    function U(T) {
      function _(I, D, W, z, K) {
        var X = I[D], J = m(X);
        if (J !== "object")
          return new u("Invalid " + z + " `" + K + "` of type `" + J + "` " + ("supplied to `" + W + "`, expected `object`."));
        for (var Q in T) {
          var q = T[Q];
          if (typeof q != "function")
            return B(W, z, K, Q, O(q));
          var te = q(X, Q, W, z, K + "." + Q, r);
          if (te)
            return te;
        }
        return null;
      }
      return P(_);
    }
    function d(T) {
      function _(I, D, W, z, K) {
        var X = I[D], J = m(X);
        if (J !== "object")
          return new u("Invalid " + z + " `" + K + "` of type `" + J + "` " + ("supplied to `" + W + "`, expected `object`."));
        var Q = t({}, I[D], T);
        for (var q in Q) {
          var te = T[q];
          if (n(T, q) && typeof te != "function")
            return B(W, z, K, q, O(te));
          if (!te)
            return new u(
              "Invalid " + z + " `" + K + "` key `" + q + "` supplied to `" + W + "`.\nBad object: " + JSON.stringify(I[D], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(T), null, "  ")
            );
          var w = te(X, q, W, z, K + "." + q, r);
          if (w)
            return w;
        }
        return null;
      }
      return P(_);
    }
    function l(T) {
      switch (typeof T) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !T;
        case "object":
          if (Array.isArray(T))
            return T.every(l);
          if (T === null || s(T))
            return !0;
          var _ = y(T);
          if (_) {
            var I = _.call(T), D;
            if (_ !== T.entries) {
              for (; !(D = I.next()).done; )
                if (!l(D.value))
                  return !1;
            } else
              for (; !(D = I.next()).done; ) {
                var W = D.value;
                if (W && !l(W[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function S(T, _) {
      return T === "symbol" ? !0 : _ ? _["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && _ instanceof Symbol : !1;
    }
    function m(T) {
      var _ = typeof T;
      return Array.isArray(T) ? "array" : T instanceof RegExp ? "object" : S(_, T) ? "symbol" : _;
    }
    function O(T) {
      if (typeof T > "u" || T === null)
        return "" + T;
      var _ = m(T);
      if (_ === "object") {
        if (T instanceof Date)
          return "date";
        if (T instanceof RegExp)
          return "regexp";
      }
      return _;
    }
    function j(T) {
      var _ = O(T);
      switch (_) {
        case "array":
        case "object":
          return "an " + _;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + _;
        default:
          return _;
      }
    }
    function L(T) {
      return !T.constructor || !T.constructor.name ? E : T.constructor.name;
    }
    return $.checkPropTypes = o, $.resetWarningCache = o.resetWarningCache, $.PropTypes = $, $;
  }, Ar;
}
var Pr, Mn;
function pa() {
  if (Mn) return Pr;
  Mn = 1;
  var e = /* @__PURE__ */ Xr();
  function t() {
  }
  function r() {
  }
  return r.resetWarningCache = t, Pr = function() {
    function n(a, s, f, p, b, y) {
      if (y !== e) {
        var E = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw E.name = "Invariant Violation", E;
      }
    }
    n.isRequired = n;
    function o() {
      return n;
    }
    var i = {
      array: n,
      bigint: n,
      bool: n,
      func: n,
      number: n,
      object: n,
      string: n,
      symbol: n,
      any: n,
      arrayOf: o,
      element: n,
      elementType: n,
      instanceOf: o,
      node: n,
      objectOf: o,
      oneOf: o,
      oneOfType: o,
      shape: o,
      exact: o,
      checkPropTypes: r,
      resetWarningCache: t
    };
    return i.PropTypes = i, i;
  }, Pr;
}
var kn;
function ma() {
  if (kn) return Lt.exports;
  if (kn = 1, process.env.NODE_ENV !== "production") {
    var e = So(), t = !0;
    Lt.exports = /* @__PURE__ */ da()(e.isElement, t);
  } else
    Lt.exports = /* @__PURE__ */ pa()();
  return Lt.exports;
}
var ha = /* @__PURE__ */ ma();
const v = /* @__PURE__ */ oo(ha);
/**
 * @mui/styled-engine v6.3.0
 *
 * @license MIT
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function ga(e, t) {
  const r = Fr(e, t);
  return process.env.NODE_ENV !== "production" ? (...n) => {
    const o = typeof e == "string" ? `"${e}"` : "component";
    return n.length === 0 ? console.error([`MUI: Seems like you called \`styled(${o})()\` without a \`style\` argument.`, 'You must provide a `styles` argument: `styled("div")(styleYouForgotToPass)`.'].join(`
`)) : n.some((i) => i === void 0) && console.error(`MUI: the styled(${o})(...args) API requires all its args to be defined.`), r(...n);
  } : r;
}
function ya(e, t) {
  Array.isArray(e.__emotion_styles) && (e.__emotion_styles = t(e.__emotion_styles));
}
const Nn = [];
function In(e) {
  return Nn[0] = e, ur(Nn);
}
function Le(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function wo(e) {
  if (/* @__PURE__ */ H.isValidElement(e) || !Le(e))
    return e;
  const t = {};
  return Object.keys(e).forEach((r) => {
    t[r] = wo(e[r]);
  }), t;
}
function Oe(e, t, r = {
  clone: !0
}) {
  const n = r.clone ? {
    ...e
  } : e;
  return Le(e) && Le(t) && Object.keys(t).forEach((o) => {
    /* @__PURE__ */ H.isValidElement(t[o]) ? n[o] = t[o] : Le(t[o]) && // Avoid prototype pollution
    Object.prototype.hasOwnProperty.call(e, o) && Le(e[o]) ? n[o] = Oe(e[o], t[o], r) : r.clone ? n[o] = Le(t[o]) ? wo(t[o]) : t[o] : n[o] = t[o];
  }), n;
}
const ba = (e) => {
  const t = Object.keys(e).map((r) => ({
    key: r,
    val: e[r]
  })) || [];
  return t.sort((r, n) => r.val - n.val), t.reduce((r, n) => ({
    ...r,
    [n.key]: n.val
  }), {});
};
function va(e) {
  const {
    // The breakpoint **start** at this value.
    // For instance with the first breakpoint xs: [xs, sm).
    values: t = {
      xs: 0,
      // phone
      sm: 600,
      // tablet
      md: 900,
      // small laptop
      lg: 1200,
      // desktop
      xl: 1536
      // large screen
    },
    unit: r = "px",
    step: n = 5,
    ...o
  } = e, i = ba(t), a = Object.keys(i);
  function s(E) {
    return `@media (min-width:${typeof t[E] == "number" ? t[E] : E}${r})`;
  }
  function f(E) {
    return `@media (max-width:${(typeof t[E] == "number" ? t[E] : E) - n / 100}${r})`;
  }
  function p(E, $) {
    const C = a.indexOf($);
    return `@media (min-width:${typeof t[E] == "number" ? t[E] : E}${r}) and (max-width:${(C !== -1 && typeof t[a[C]] == "number" ? t[a[C]] : $) - n / 100}${r})`;
  }
  function b(E) {
    return a.indexOf(E) + 1 < a.length ? p(E, a[a.indexOf(E) + 1]) : s(E);
  }
  function y(E) {
    const $ = a.indexOf(E);
    return $ === 0 ? s(a[1]) : $ === a.length - 1 ? f(a[$]) : p(E, a[a.indexOf(E) + 1]).replace("@media", "@media not all and");
  }
  return {
    keys: a,
    values: i,
    up: s,
    down: f,
    between: p,
    only: b,
    not: y,
    unit: r,
    ...o
  };
}
function Sa(e, t) {
  if (!e.containerQueries)
    return t;
  const r = Object.keys(t).filter((n) => n.startsWith("@container")).sort((n, o) => {
    var a, s;
    const i = /min-width:\s*([0-9.]+)/;
    return +(((a = n.match(i)) == null ? void 0 : a[1]) || 0) - +(((s = o.match(i)) == null ? void 0 : s[1]) || 0);
  });
  return r.length ? r.reduce((n, o) => {
    const i = t[o];
    return delete n[o], n[o] = i, n;
  }, {
    ...t
  }) : t;
}
function Ea(e, t) {
  return t === "@" || t.startsWith("@") && (e.some((r) => t.startsWith(`@${r}`)) || !!t.match(/^@\d/));
}
function wa(e, t) {
  const r = t.match(/^@([^/]+)?\/?(.+)?$/);
  if (!r) {
    if (process.env.NODE_ENV !== "production")
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The provided shorthand ${`(${t})`} is invalid. The format should be \`@<breakpoint | number>\` or \`@<breakpoint | number>/<container>\`.
For example, \`@sm\` or \`@600\` or \`@40rem/sidebar\`.` : Ke(18, `(${t})`));
    return null;
  }
  const [, n, o] = r, i = Number.isNaN(+n) ? n || 0 : +n;
  return e.containerQueries(o).up(i);
}
function xa(e) {
  const t = (i, a) => i.replace("@media", a ? `@container ${a}` : "@container");
  function r(i, a) {
    i.up = (...s) => t(e.breakpoints.up(...s), a), i.down = (...s) => t(e.breakpoints.down(...s), a), i.between = (...s) => t(e.breakpoints.between(...s), a), i.only = (...s) => t(e.breakpoints.only(...s), a), i.not = (...s) => {
      const f = t(e.breakpoints.not(...s), a);
      return f.includes("not all and") ? f.replace("not all and ", "").replace("min-width:", "width<").replace("max-width:", "width>").replace("and", "or") : f;
    };
  }
  const n = {}, o = (i) => (r(n, i), n);
  return r(o), {
    ...e,
    containerQueries: o
  };
}
const Ta = {
  borderRadius: 4
}, Je = process.env.NODE_ENV !== "production" ? v.oneOfType([v.number, v.string, v.object, v.array]) : {};
function _t(e, t) {
  return t ? Oe(e, t, {
    clone: !1
    // No need to clone deep, it's way faster.
  }) : e;
}
const lr = {
  xs: 0,
  // phone
  sm: 600,
  // tablet
  md: 900,
  // small laptop
  lg: 1200,
  // desktop
  xl: 1536
  // large screen
}, jn = {
  // Sorted ASC by size. That's important.
  // It can't be configured as it's used statically for propTypes.
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (e) => `@media (min-width:${lr[e]}px)`
}, Ca = {
  containerQueries: (e) => ({
    up: (t) => {
      let r = typeof t == "number" ? t : lr[t] || t;
      return typeof r == "number" && (r = `${r}px`), e ? `@container ${e} (min-width:${r})` : `@container (min-width:${r})`;
    }
  })
};
function Be(e, t, r) {
  const n = e.theme || {};
  if (Array.isArray(t)) {
    const i = n.breakpoints || jn;
    return t.reduce((a, s, f) => (a[i.up(i.keys[f])] = r(t[f]), a), {});
  }
  if (typeof t == "object") {
    const i = n.breakpoints || jn;
    return Object.keys(t).reduce((a, s) => {
      if (Ea(i.keys, s)) {
        const f = wa(n.containerQueries ? n : Ca, s);
        f && (a[f] = r(t[s], s));
      } else if (Object.keys(i.values || lr).includes(s)) {
        const f = i.up(s);
        a[f] = r(t[s], s);
      } else {
        const f = s;
        a[f] = t[f];
      }
      return a;
    }, {});
  }
  return r(t);
}
function xo(e = {}) {
  var r;
  return ((r = e.keys) == null ? void 0 : r.reduce((n, o) => {
    const i = e.up(o);
    return n[i] = {}, n;
  }, {})) || {};
}
function To(e, t) {
  return e.reduce((r, n) => {
    const o = r[n];
    return (!o || Object.keys(o).length === 0) && delete r[n], r;
  }, t);
}
function _a(e, ...t) {
  const r = xo(e), n = [r, ...t].reduce((o, i) => Oe(o, i), {});
  return To(Object.keys(r), n);
}
function Oa(e, t) {
  if (typeof e != "object")
    return {};
  const r = {}, n = Object.keys(t);
  return Array.isArray(e) ? n.forEach((o, i) => {
    i < e.length && (r[o] = !0);
  }) : n.forEach((o) => {
    e[o] != null && (r[o] = !0);
  }), r;
}
function $r({
  values: e,
  breakpoints: t,
  base: r
}) {
  const n = r || Oa(e, t), o = Object.keys(n);
  if (o.length === 0)
    return e;
  let i;
  return o.reduce((a, s, f) => (Array.isArray(e) ? (a[s] = e[f] != null ? e[f] : e[i], i = f) : typeof e == "object" ? (a[s] = e[s] != null ? e[s] : e[i], i = s) : a[s] = e, a), {});
}
function Re(e) {
  if (typeof e != "string")
    throw new Error(process.env.NODE_ENV !== "production" ? "MUI: `capitalize(string)` expects a string argument." : Ke(7));
  return e.charAt(0).toUpperCase() + e.slice(1);
}
function fr(e, t, r = !0) {
  if (!t || typeof t != "string")
    return null;
  if (e && e.vars && r) {
    const n = `vars.${t}`.split(".").reduce((o, i) => o && o[i] ? o[i] : null, e);
    if (n != null)
      return n;
  }
  return t.split(".").reduce((n, o) => n && n[o] != null ? n[o] : null, e);
}
function or(e, t, r, n = r) {
  let o;
  return typeof e == "function" ? o = e(r) : Array.isArray(e) ? o = e[r] || n : o = fr(e, r) || n, t && (o = t(o, n, e)), o;
}
function ve(e) {
  const {
    prop: t,
    cssProperty: r = e.prop,
    themeKey: n,
    transform: o
  } = e, i = (a) => {
    if (a[t] == null)
      return null;
    const s = a[t], f = a.theme, p = fr(f, n) || {};
    return Be(a, s, (y) => {
      let E = or(p, o, y);
      return y === E && typeof y == "string" && (E = or(p, o, `${t}${y === "default" ? "" : Re(y)}`, y)), r === !1 ? E : {
        [r]: E
      };
    });
  };
  return i.propTypes = process.env.NODE_ENV !== "production" ? {
    [t]: Je
  } : {}, i.filterProps = [t], i;
}
function Ra(e) {
  const t = {};
  return (r) => (t[r] === void 0 && (t[r] = e(r)), t[r]);
}
const Aa = {
  m: "margin",
  p: "padding"
}, Pa = {
  t: "Top",
  r: "Right",
  b: "Bottom",
  l: "Left",
  x: ["Left", "Right"],
  y: ["Top", "Bottom"]
}, Bn = {
  marginX: "mx",
  marginY: "my",
  paddingX: "px",
  paddingY: "py"
}, $a = Ra((e) => {
  if (e.length > 2)
    if (Bn[e])
      e = Bn[e];
    else
      return [e];
  const [t, r] = e.split(""), n = Aa[t], o = Pa[r] || "";
  return Array.isArray(o) ? o.map((i) => n + i) : [n + o];
}), dr = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"], pr = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"], Ma = [...dr, ...pr];
function kt(e, t, r, n) {
  const o = fr(e, t, !0) ?? r;
  return typeof o == "number" || typeof o == "string" ? (i) => typeof i == "string" ? i : (process.env.NODE_ENV !== "production" && typeof i != "number" && console.error(`MUI: Expected ${n} argument to be a number or a string, got ${i}.`), typeof o == "string" ? `calc(${i} * ${o})` : o * i) : Array.isArray(o) ? (i) => {
    if (typeof i == "string")
      return i;
    const a = Math.abs(i);
    process.env.NODE_ENV !== "production" && (Number.isInteger(a) ? a > o.length - 1 && console.error([`MUI: The value provided (${a}) overflows.`, `The supported values are: ${JSON.stringify(o)}.`, `${a} > ${o.length - 1}, you need to add the missing values.`].join(`
`)) : console.error([`MUI: The \`theme.${t}\` array type cannot be combined with non integer values.You should either use an integer value that can be used as index, or define the \`theme.${t}\` as a number.`].join(`
`)));
    const s = o[a];
    return i >= 0 ? s : typeof s == "number" ? -s : `-${s}`;
  } : typeof o == "function" ? o : (process.env.NODE_ENV !== "production" && console.error([`MUI: The \`theme.${t}\` value (${o}) is invalid.`, "It should be a number, an array or a function."].join(`
`)), () => {
  });
}
function mr(e) {
  return kt(e, "spacing", 8, "spacing");
}
function rt(e, t) {
  return typeof t == "string" || t == null ? t : e(t);
}
function ka(e, t) {
  return (r) => e.reduce((n, o) => (n[o] = rt(t, r), n), {});
}
function Na(e, t, r, n) {
  if (!t.includes(r))
    return null;
  const o = $a(r), i = ka(o, n), a = e[r];
  return Be(e, a, i);
}
function Co(e, t) {
  const r = mr(e.theme);
  return Object.keys(e).map((n) => Na(e, t, n, r)).reduce(_t, {});
}
function ye(e) {
  return Co(e, dr);
}
ye.propTypes = process.env.NODE_ENV !== "production" ? dr.reduce((e, t) => (e[t] = Je, e), {}) : {};
ye.filterProps = dr;
function be(e) {
  return Co(e, pr);
}
be.propTypes = process.env.NODE_ENV !== "production" ? pr.reduce((e, t) => (e[t] = Je, e), {}) : {};
be.filterProps = pr;
process.env.NODE_ENV !== "production" && Ma.reduce((e, t) => (e[t] = Je, e), {});
function _o(e = 8, t = mr({
  spacing: e
})) {
  if (e.mui)
    return e;
  const r = (...n) => (process.env.NODE_ENV !== "production" && (n.length <= 4 || console.error(`MUI: Too many arguments provided, expected between 0 and 4, got ${n.length}`)), (n.length === 0 ? [1] : n).map((i) => {
    const a = t(i);
    return typeof a == "number" ? `${a}px` : a;
  }).join(" "));
  return r.mui = !0, r;
}
function hr(...e) {
  const t = e.reduce((n, o) => (o.filterProps.forEach((i) => {
    n[i] = o;
  }), n), {}), r = (n) => Object.keys(n).reduce((o, i) => t[i] ? _t(o, t[i](n)) : o, {});
  return r.propTypes = process.env.NODE_ENV !== "production" ? e.reduce((n, o) => Object.assign(n, o.propTypes), {}) : {}, r.filterProps = e.reduce((n, o) => n.concat(o.filterProps), []), r;
}
function Ne(e) {
  return typeof e != "number" ? e : `${e}px solid`;
}
function Ie(e, t) {
  return ve({
    prop: e,
    themeKey: "borders",
    transform: t
  });
}
const Ia = Ie("border", Ne), ja = Ie("borderTop", Ne), Ba = Ie("borderRight", Ne), Fa = Ie("borderBottom", Ne), Da = Ie("borderLeft", Ne), za = Ie("borderColor"), La = Ie("borderTopColor"), Va = Ie("borderRightColor"), Ya = Ie("borderBottomColor"), Wa = Ie("borderLeftColor"), Ua = Ie("outline", Ne), qa = Ie("outlineColor"), gr = (e) => {
  if (e.borderRadius !== void 0 && e.borderRadius !== null) {
    const t = kt(e.theme, "shape.borderRadius", 4, "borderRadius"), r = (n) => ({
      borderRadius: rt(t, n)
    });
    return Be(e, e.borderRadius, r);
  }
  return null;
};
gr.propTypes = process.env.NODE_ENV !== "production" ? {
  borderRadius: Je
} : {};
gr.filterProps = ["borderRadius"];
hr(Ia, ja, Ba, Fa, Da, za, La, Va, Ya, Wa, gr, Ua, qa);
const yr = (e) => {
  if (e.gap !== void 0 && e.gap !== null) {
    const t = kt(e.theme, "spacing", 8, "gap"), r = (n) => ({
      gap: rt(t, n)
    });
    return Be(e, e.gap, r);
  }
  return null;
};
yr.propTypes = process.env.NODE_ENV !== "production" ? {
  gap: Je
} : {};
yr.filterProps = ["gap"];
const br = (e) => {
  if (e.columnGap !== void 0 && e.columnGap !== null) {
    const t = kt(e.theme, "spacing", 8, "columnGap"), r = (n) => ({
      columnGap: rt(t, n)
    });
    return Be(e, e.columnGap, r);
  }
  return null;
};
br.propTypes = process.env.NODE_ENV !== "production" ? {
  columnGap: Je
} : {};
br.filterProps = ["columnGap"];
const vr = (e) => {
  if (e.rowGap !== void 0 && e.rowGap !== null) {
    const t = kt(e.theme, "spacing", 8, "rowGap"), r = (n) => ({
      rowGap: rt(t, n)
    });
    return Be(e, e.rowGap, r);
  }
  return null;
};
vr.propTypes = process.env.NODE_ENV !== "production" ? {
  rowGap: Je
} : {};
vr.filterProps = ["rowGap"];
const Ga = ve({
  prop: "gridColumn"
}), Ha = ve({
  prop: "gridRow"
}), Ka = ve({
  prop: "gridAutoFlow"
}), Xa = ve({
  prop: "gridAutoColumns"
}), Ja = ve({
  prop: "gridAutoRows"
}), Qa = ve({
  prop: "gridTemplateColumns"
}), Za = ve({
  prop: "gridTemplateRows"
}), es = ve({
  prop: "gridTemplateAreas"
}), ts = ve({
  prop: "gridArea"
});
hr(yr, br, vr, Ga, Ha, Ka, Xa, Ja, Qa, Za, es, ts);
function dt(e, t) {
  return t === "grey" ? t : e;
}
const rs = ve({
  prop: "color",
  themeKey: "palette",
  transform: dt
}), ns = ve({
  prop: "bgcolor",
  cssProperty: "backgroundColor",
  themeKey: "palette",
  transform: dt
}), os = ve({
  prop: "backgroundColor",
  themeKey: "palette",
  transform: dt
});
hr(rs, ns, os);
function $e(e) {
  return e <= 1 && e !== 0 ? `${e * 100}%` : e;
}
const is = ve({
  prop: "width",
  transform: $e
}), Jr = (e) => {
  if (e.maxWidth !== void 0 && e.maxWidth !== null) {
    const t = (r) => {
      var o, i, a, s, f;
      const n = ((a = (i = (o = e.theme) == null ? void 0 : o.breakpoints) == null ? void 0 : i.values) == null ? void 0 : a[r]) || lr[r];
      return n ? ((f = (s = e.theme) == null ? void 0 : s.breakpoints) == null ? void 0 : f.unit) !== "px" ? {
        maxWidth: `${n}${e.theme.breakpoints.unit}`
      } : {
        maxWidth: n
      } : {
        maxWidth: $e(r)
      };
    };
    return Be(e, e.maxWidth, t);
  }
  return null;
};
Jr.filterProps = ["maxWidth"];
const as = ve({
  prop: "minWidth",
  transform: $e
}), ss = ve({
  prop: "height",
  transform: $e
}), cs = ve({
  prop: "maxHeight",
  transform: $e
}), us = ve({
  prop: "minHeight",
  transform: $e
});
ve({
  prop: "size",
  cssProperty: "width",
  transform: $e
});
ve({
  prop: "size",
  cssProperty: "height",
  transform: $e
});
const ls = ve({
  prop: "boxSizing"
});
hr(is, Jr, as, ss, cs, us, ls);
const Nt = {
  // borders
  border: {
    themeKey: "borders",
    transform: Ne
  },
  borderTop: {
    themeKey: "borders",
    transform: Ne
  },
  borderRight: {
    themeKey: "borders",
    transform: Ne
  },
  borderBottom: {
    themeKey: "borders",
    transform: Ne
  },
  borderLeft: {
    themeKey: "borders",
    transform: Ne
  },
  borderColor: {
    themeKey: "palette"
  },
  borderTopColor: {
    themeKey: "palette"
  },
  borderRightColor: {
    themeKey: "palette"
  },
  borderBottomColor: {
    themeKey: "palette"
  },
  borderLeftColor: {
    themeKey: "palette"
  },
  outline: {
    themeKey: "borders",
    transform: Ne
  },
  outlineColor: {
    themeKey: "palette"
  },
  borderRadius: {
    themeKey: "shape.borderRadius",
    style: gr
  },
  // palette
  color: {
    themeKey: "palette",
    transform: dt
  },
  bgcolor: {
    themeKey: "palette",
    cssProperty: "backgroundColor",
    transform: dt
  },
  backgroundColor: {
    themeKey: "palette",
    transform: dt
  },
  // spacing
  p: {
    style: be
  },
  pt: {
    style: be
  },
  pr: {
    style: be
  },
  pb: {
    style: be
  },
  pl: {
    style: be
  },
  px: {
    style: be
  },
  py: {
    style: be
  },
  padding: {
    style: be
  },
  paddingTop: {
    style: be
  },
  paddingRight: {
    style: be
  },
  paddingBottom: {
    style: be
  },
  paddingLeft: {
    style: be
  },
  paddingX: {
    style: be
  },
  paddingY: {
    style: be
  },
  paddingInline: {
    style: be
  },
  paddingInlineStart: {
    style: be
  },
  paddingInlineEnd: {
    style: be
  },
  paddingBlock: {
    style: be
  },
  paddingBlockStart: {
    style: be
  },
  paddingBlockEnd: {
    style: be
  },
  m: {
    style: ye
  },
  mt: {
    style: ye
  },
  mr: {
    style: ye
  },
  mb: {
    style: ye
  },
  ml: {
    style: ye
  },
  mx: {
    style: ye
  },
  my: {
    style: ye
  },
  margin: {
    style: ye
  },
  marginTop: {
    style: ye
  },
  marginRight: {
    style: ye
  },
  marginBottom: {
    style: ye
  },
  marginLeft: {
    style: ye
  },
  marginX: {
    style: ye
  },
  marginY: {
    style: ye
  },
  marginInline: {
    style: ye
  },
  marginInlineStart: {
    style: ye
  },
  marginInlineEnd: {
    style: ye
  },
  marginBlock: {
    style: ye
  },
  marginBlockStart: {
    style: ye
  },
  marginBlockEnd: {
    style: ye
  },
  // display
  displayPrint: {
    cssProperty: !1,
    transform: (e) => ({
      "@media print": {
        display: e
      }
    })
  },
  display: {},
  overflow: {},
  textOverflow: {},
  visibility: {},
  whiteSpace: {},
  // flexbox
  flexBasis: {},
  flexDirection: {},
  flexWrap: {},
  justifyContent: {},
  alignItems: {},
  alignContent: {},
  order: {},
  flex: {},
  flexGrow: {},
  flexShrink: {},
  alignSelf: {},
  justifyItems: {},
  justifySelf: {},
  // grid
  gap: {
    style: yr
  },
  rowGap: {
    style: vr
  },
  columnGap: {
    style: br
  },
  gridColumn: {},
  gridRow: {},
  gridAutoFlow: {},
  gridAutoColumns: {},
  gridAutoRows: {},
  gridTemplateColumns: {},
  gridTemplateRows: {},
  gridTemplateAreas: {},
  gridArea: {},
  // positions
  position: {},
  zIndex: {
    themeKey: "zIndex"
  },
  top: {},
  right: {},
  bottom: {},
  left: {},
  // shadows
  boxShadow: {
    themeKey: "shadows"
  },
  // sizing
  width: {
    transform: $e
  },
  maxWidth: {
    style: Jr
  },
  minWidth: {
    transform: $e
  },
  height: {
    transform: $e
  },
  maxHeight: {
    transform: $e
  },
  minHeight: {
    transform: $e
  },
  boxSizing: {},
  // typography
  font: {
    themeKey: "font"
  },
  fontFamily: {
    themeKey: "typography"
  },
  fontSize: {
    themeKey: "typography"
  },
  fontStyle: {
    themeKey: "typography"
  },
  fontWeight: {
    themeKey: "typography"
  },
  letterSpacing: {},
  textTransform: {},
  lineHeight: {},
  textAlign: {},
  typography: {
    cssProperty: !1,
    themeKey: "typography"
  }
};
function fs(...e) {
  const t = e.reduce((n, o) => n.concat(Object.keys(o)), []), r = new Set(t);
  return e.every((n) => r.size === Object.keys(n).length);
}
function ds(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ps() {
  function e(r, n, o, i) {
    const a = {
      [r]: n,
      theme: o
    }, s = i[r];
    if (!s)
      return {
        [r]: n
      };
    const {
      cssProperty: f = r,
      themeKey: p,
      transform: b,
      style: y
    } = s;
    if (n == null)
      return null;
    if (p === "typography" && n === "inherit")
      return {
        [r]: n
      };
    const E = fr(o, p) || {};
    return y ? y(a) : Be(a, n, (C) => {
      let u = or(E, b, C);
      return C === u && typeof C == "string" && (u = or(E, b, `${r}${C === "default" ? "" : Re(C)}`, C)), f === !1 ? u : {
        [f]: u
      };
    });
  }
  function t(r) {
    const {
      sx: n,
      theme: o = {}
    } = r || {};
    if (!n)
      return null;
    const i = o.unstable_sxConfig ?? Nt;
    function a(s) {
      let f = s;
      if (typeof s == "function")
        f = s(o);
      else if (typeof s != "object")
        return s;
      if (!f)
        return null;
      const p = xo(o.breakpoints), b = Object.keys(p);
      let y = p;
      return Object.keys(f).forEach((E) => {
        const $ = ds(f[E], o);
        if ($ != null)
          if (typeof $ == "object")
            if (i[E])
              y = _t(y, e(E, $, o, i));
            else {
              const C = Be({
                theme: o
              }, $, (u) => ({
                [E]: u
              }));
              fs(C, $) ? y[E] = t({
                sx: $,
                theme: o
              }) : y = _t(y, C);
            }
          else
            y = _t(y, e(E, $, o, i));
      }), Sa(o, To(b, y));
    }
    return Array.isArray(n) ? n.map(a) : a(n);
  }
  return t;
}
const mt = ps();
mt.filterProps = ["sx"];
function ms(e, t) {
  var n;
  const r = this;
  if (r.vars) {
    if (!((n = r.colorSchemes) != null && n[e]) || typeof r.getColorSchemeSelector != "function")
      return {};
    let o = r.getColorSchemeSelector(e);
    return o === "&" ? t : ((o.includes("data-") || o.includes(".")) && (o = `*:where(${o.replace(/\s*&$/, "")}) &`), {
      [o]: t
    });
  }
  return r.palette.mode === e ? t : {};
}
function Sr(e = {}, ...t) {
  const {
    breakpoints: r = {},
    palette: n = {},
    spacing: o,
    shape: i = {},
    ...a
  } = e, s = va(r), f = _o(o);
  let p = Oe({
    breakpoints: s,
    direction: "ltr",
    components: {},
    // Inject component definitions.
    palette: {
      mode: "light",
      ...n
    },
    spacing: f,
    shape: {
      ...Ta,
      ...i
    }
  }, a);
  return p = xa(p), p.applyStyles = ms, p = t.reduce((b, y) => Oe(b, y), p), p.unstable_sxConfig = {
    ...Nt,
    ...a == null ? void 0 : a.unstable_sxConfig
  }, p.unstable_sx = function(y) {
    return mt({
      sx: y,
      theme: this
    });
  }, p;
}
function hs(e) {
  return Object.keys(e).length === 0;
}
function gs(e = null) {
  const t = H.useContext(Gr);
  return !t || hs(t) ? e : t;
}
const ys = Sr();
function bs(e = ys) {
  return gs(e);
}
const vs = (e) => {
  var n;
  const t = {
    systemProps: {},
    otherProps: {}
  }, r = ((n = e == null ? void 0 : e.theme) == null ? void 0 : n.unstable_sxConfig) ?? Nt;
  return Object.keys(e).forEach((o) => {
    r[o] ? t.systemProps[o] = e[o] : t.otherProps[o] = e[o];
  }), t;
};
function Ss(e) {
  const {
    sx: t,
    ...r
  } = e, {
    systemProps: n,
    otherProps: o
  } = vs(r);
  let i;
  return Array.isArray(t) ? i = [n, ...t] : typeof t == "function" ? i = (...a) => {
    const s = t(...a);
    return Le(s) ? {
      ...n,
      ...s
    } : n;
  } : i = {
    ...n,
    ...t
  }, {
    ...o,
    sx: i
  };
}
const Fn = (e) => e, Es = () => {
  let e = Fn;
  return {
    configure(t) {
      e = t;
    },
    generate(t) {
      return e(t);
    },
    reset() {
      e = Fn;
    }
  };
}, ws = Es();
function Oo(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = Oo(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function Pe() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = Oo(e)) && (n && (n += " "), n += t);
  return n;
}
const xs = {
  active: "active",
  checked: "checked",
  completed: "completed",
  disabled: "disabled",
  error: "error",
  expanded: "expanded",
  focused: "focused",
  focusVisible: "focusVisible",
  open: "open",
  readOnly: "readOnly",
  required: "required",
  selected: "selected"
};
function It(e, t, r = "Mui") {
  const n = xs[t];
  return n ? `${r}-${n}` : `${ws.generate(e)}-${t}`;
}
function Qr(e, t, r = "Mui") {
  const n = {};
  return t.forEach((o) => {
    n[o] = It(e, o, r);
  }), n;
}
var Yt = { exports: {} }, fe = {};
/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dn;
function Ts() {
  if (Dn) return fe;
  Dn = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), i = Symbol.for("react.consumer"), a = Symbol.for("react.context"), s = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), p = Symbol.for("react.suspense_list"), b = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), E = Symbol.for("react.offscreen"), $ = Symbol.for("react.client.reference");
  function C(u) {
    if (typeof u == "object" && u !== null) {
      var P = u.$$typeof;
      switch (P) {
        case e:
          switch (u = u.type, u) {
            case r:
            case o:
            case n:
            case f:
            case p:
              return u;
            default:
              switch (u = u && u.$$typeof, u) {
                case a:
                case s:
                case y:
                case b:
                  return u;
                case i:
                  return u;
                default:
                  return P;
              }
          }
        case t:
          return P;
      }
    }
  }
  return fe.ContextConsumer = i, fe.ContextProvider = a, fe.Element = e, fe.ForwardRef = s, fe.Fragment = r, fe.Lazy = y, fe.Memo = b, fe.Portal = t, fe.Profiler = o, fe.StrictMode = n, fe.Suspense = f, fe.SuspenseList = p, fe.isContextConsumer = function(u) {
    return C(u) === i;
  }, fe.isContextProvider = function(u) {
    return C(u) === a;
  }, fe.isElement = function(u) {
    return typeof u == "object" && u !== null && u.$$typeof === e;
  }, fe.isForwardRef = function(u) {
    return C(u) === s;
  }, fe.isFragment = function(u) {
    return C(u) === r;
  }, fe.isLazy = function(u) {
    return C(u) === y;
  }, fe.isMemo = function(u) {
    return C(u) === b;
  }, fe.isPortal = function(u) {
    return C(u) === t;
  }, fe.isProfiler = function(u) {
    return C(u) === o;
  }, fe.isStrictMode = function(u) {
    return C(u) === n;
  }, fe.isSuspense = function(u) {
    return C(u) === f;
  }, fe.isSuspenseList = function(u) {
    return C(u) === p;
  }, fe.isValidElementType = function(u) {
    return typeof u == "string" || typeof u == "function" || u === r || u === o || u === n || u === f || u === p || u === E || typeof u == "object" && u !== null && (u.$$typeof === y || u.$$typeof === b || u.$$typeof === a || u.$$typeof === i || u.$$typeof === s || u.$$typeof === $ || u.getModuleId !== void 0);
  }, fe.typeOf = C, fe;
}
var de = {};
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zn;
function Cs() {
  return zn || (zn = 1, process.env.NODE_ENV !== "production" && function() {
    function e(u) {
      if (typeof u == "object" && u !== null) {
        var P = u.$$typeof;
        switch (P) {
          case t:
            switch (u = u.type, u) {
              case n:
              case i:
              case o:
              case p:
              case b:
                return u;
              default:
                switch (u = u && u.$$typeof, u) {
                  case s:
                  case f:
                  case E:
                  case y:
                    return u;
                  case a:
                    return u;
                  default:
                    return P;
                }
            }
          case r:
            return P;
        }
      }
    }
    var t = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), a = Symbol.for("react.consumer"), s = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), b = Symbol.for("react.suspense_list"), y = Symbol.for("react.memo"), E = Symbol.for("react.lazy"), $ = Symbol.for("react.offscreen"), C = Symbol.for("react.client.reference");
    de.ContextConsumer = a, de.ContextProvider = s, de.Element = t, de.ForwardRef = f, de.Fragment = n, de.Lazy = E, de.Memo = y, de.Portal = r, de.Profiler = i, de.StrictMode = o, de.Suspense = p, de.SuspenseList = b, de.isContextConsumer = function(u) {
      return e(u) === a;
    }, de.isContextProvider = function(u) {
      return e(u) === s;
    }, de.isElement = function(u) {
      return typeof u == "object" && u !== null && u.$$typeof === t;
    }, de.isForwardRef = function(u) {
      return e(u) === f;
    }, de.isFragment = function(u) {
      return e(u) === n;
    }, de.isLazy = function(u) {
      return e(u) === E;
    }, de.isMemo = function(u) {
      return e(u) === y;
    }, de.isPortal = function(u) {
      return e(u) === r;
    }, de.isProfiler = function(u) {
      return e(u) === i;
    }, de.isStrictMode = function(u) {
      return e(u) === o;
    }, de.isSuspense = function(u) {
      return e(u) === p;
    }, de.isSuspenseList = function(u) {
      return e(u) === b;
    }, de.isValidElementType = function(u) {
      return typeof u == "string" || typeof u == "function" || u === n || u === i || u === o || u === p || u === b || u === $ || typeof u == "object" && u !== null && (u.$$typeof === E || u.$$typeof === y || u.$$typeof === s || u.$$typeof === a || u.$$typeof === f || u.$$typeof === C || u.getModuleId !== void 0);
    }, de.typeOf = e;
  }()), de;
}
var Ln;
function _s() {
  return Ln || (Ln = 1, process.env.NODE_ENV === "production" ? Yt.exports = /* @__PURE__ */ Ts() : Yt.exports = /* @__PURE__ */ Cs()), Yt.exports;
}
var Vn = /* @__PURE__ */ _s();
function Ro(e, t = "") {
  return e.displayName || e.name || t;
}
function Yn(e, t, r) {
  const n = Ro(t);
  return e.displayName || (n !== "" ? `${r}(${n})` : r);
}
function Os(e) {
  if (e != null) {
    if (typeof e == "string")
      return e;
    if (typeof e == "function")
      return Ro(e, "Component");
    if (typeof e == "object")
      switch (e.$$typeof) {
        case Vn.ForwardRef:
          return Yn(e, e.render, "ForwardRef");
        case Vn.Memo:
          return Yn(e, e.type, "memo");
        default:
          return;
      }
  }
}
function Ao(e) {
  const {
    variants: t,
    ...r
  } = e, n = {
    variants: t,
    style: In(r),
    isProcessed: !0
  };
  return n.style === r || t && t.forEach((o) => {
    typeof o.style != "function" && (o.style = In(o.style));
  }), n;
}
const Rs = Sr();
function Mr(e) {
  return e !== "ownerState" && e !== "theme" && e !== "sx" && e !== "as";
}
function As(e) {
  return e ? (t, r) => r[e] : null;
}
function Ps(e, t, r) {
  e.theme = ks(e.theme) ? r : e.theme[t] || e.theme;
}
function Jt(e, t) {
  const r = typeof t == "function" ? t(e) : t;
  if (Array.isArray(r))
    return r.flatMap((n) => Jt(e, n));
  if (Array.isArray(r == null ? void 0 : r.variants)) {
    let n;
    if (r.isProcessed)
      n = r.style;
    else {
      const {
        variants: o,
        ...i
      } = r;
      n = i;
    }
    return Po(e, r.variants, [n]);
  }
  return r != null && r.isProcessed ? r.style : r;
}
function Po(e, t, r = []) {
  var o;
  let n;
  e: for (let i = 0; i < t.length; i += 1) {
    const a = t[i];
    if (typeof a.props == "function") {
      if (n ?? (n = {
        ...e,
        ...e.ownerState,
        ownerState: e.ownerState
      }), !a.props(n))
        continue;
    } else
      for (const s in a.props)
        if (e[s] !== a.props[s] && ((o = e.ownerState) == null ? void 0 : o[s]) !== a.props[s])
          continue e;
    typeof a.style == "function" ? (n ?? (n = {
      ...e,
      ...e.ownerState,
      ownerState: e.ownerState
    }), r.push(a.style(n))) : r.push(a.style);
  }
  return r;
}
function $o(e = {}) {
  const {
    themeId: t,
    defaultTheme: r = Rs,
    rootShouldForwardProp: n = Mr,
    slotShouldForwardProp: o = Mr
  } = e;
  function i(s) {
    Ps(s, t, r);
  }
  return (s, f = {}) => {
    ya(s, (h) => h.filter((F) => F !== mt));
    const {
      name: p,
      slot: b,
      skipVariantsResolver: y,
      skipSx: E,
      // TODO v6: remove `lowercaseFirstLetter()` in the next major release
      // For more details: https://github.com/mui/material-ui/pull/37908
      overridesResolver: $ = As(Mo(b)),
      ...C
    } = f, u = y !== void 0 ? y : (
      // TODO v6: remove `Root` in the next major release
      // For more details: https://github.com/mui/material-ui/pull/37908
      b && b !== "Root" && b !== "root" || !1
    ), P = E || !1;
    let M = Mr;
    b === "Root" || b === "root" ? M = n : b ? M = o : Ns(s) && (M = void 0);
    const Y = ga(s, {
      shouldForwardProp: M,
      label: Ms(p, b),
      ...C
    }), k = (h) => {
      if (typeof h == "function" && h.__emotion_real !== h)
        return function(V) {
          return Jt(V, h);
        };
      if (Le(h)) {
        const F = Ao(h);
        return F.variants ? function(ee) {
          return Jt(ee, F);
        } : F.style;
      }
      return h;
    }, R = (...h) => {
      const F = [], V = h.map(k), ee = [];
      if (F.push(i), p && $ && ee.push(function(U) {
        var m, O;
        const l = (O = (m = U.theme.components) == null ? void 0 : m[p]) == null ? void 0 : O.styleOverrides;
        if (!l)
          return null;
        const S = {};
        for (const j in l)
          S[j] = Jt(U, l[j]);
        return $(U, S);
      }), p && !u && ee.push(function(U) {
        var S, m;
        const d = U.theme, l = (m = (S = d == null ? void 0 : d.components) == null ? void 0 : S[p]) == null ? void 0 : m.variants;
        return l ? Po(U, l) : null;
      }), P || ee.push(mt), Array.isArray(V[0])) {
        const B = V.shift(), U = new Array(F.length).fill(""), d = new Array(ee.length).fill("");
        let l;
        l = [...U, ...B, ...d], l.raw = [...U, ...B.raw, ...d], F.unshift(l);
      }
      const re = [...F, ...V, ...ee], c = Y(...re);
      return s.muiName && (c.muiName = s.muiName), process.env.NODE_ENV !== "production" && (c.displayName = $s(p, b, s)), c;
    };
    return Y.withConfig && (R.withConfig = Y.withConfig), R;
  };
}
function $s(e, t, r) {
  return e ? `${e}${Re(t || "")}` : `Styled(${Os(r)})`;
}
function Ms(e, t) {
  let r;
  return process.env.NODE_ENV !== "production" && e && (r = `${e}-${Mo(t || "Root")}`), r;
}
function ks(e) {
  for (const t in e)
    return !1;
  return !0;
}
function Ns(e) {
  return typeof e == "string" && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  e.charCodeAt(0) > 96;
}
function Mo(e) {
  return e && e.charAt(0).toLowerCase() + e.slice(1);
}
const Is = $o();
function $t(e, t) {
  const r = {
    ...t
  };
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      const o = n;
      if (o === "components" || o === "slots")
        r[o] = {
          ...e[o],
          ...r[o]
        };
      else if (o === "componentsProps" || o === "slotProps") {
        const i = e[o], a = t[o];
        if (!a)
          r[o] = i || {};
        else if (!i)
          r[o] = a;
        else {
          r[o] = {
            ...a
          };
          for (const s in i)
            if (Object.prototype.hasOwnProperty.call(i, s)) {
              const f = s;
              r[o][f] = $t(i[f], a[f]);
            }
        }
      } else r[o] === void 0 && (r[o] = e[o]);
    }
  return r;
}
function js(e) {
  const {
    theme: t,
    name: r,
    props: n
  } = e;
  return !t || !t.components || !t.components[r] || !t.components[r].defaultProps ? n : $t(t.components[r].defaultProps, n);
}
function Bs({
  props: e,
  name: t,
  defaultTheme: r,
  themeId: n
}) {
  let o = bs(r);
  return n && (o = o[n] || o), js({
    theme: o,
    name: t,
    props: e
  });
}
const Fs = typeof window < "u" ? H.useLayoutEffect : H.useEffect;
function Ds(e, t = Number.MIN_SAFE_INTEGER, r = Number.MAX_SAFE_INTEGER) {
  return Math.max(t, Math.min(e, r));
}
function Zr(e, t = 0, r = 1) {
  return process.env.NODE_ENV !== "production" && (e < t || e > r) && console.error(`MUI: The value provided ${e} is out of range [${t}, ${r}].`), Ds(e, t, r);
}
function zs(e) {
  e = e.slice(1);
  const t = new RegExp(`.{1,${e.length >= 6 ? 2 : 1}}`, "g");
  let r = e.match(t);
  return r && r[0].length === 1 && (r = r.map((n) => n + n)), process.env.NODE_ENV !== "production" && e.length !== e.trim().length && console.error(`MUI: The color: "${e}" is invalid. Make sure the color input doesn't contain leading/trailing space.`), r ? `rgb${r.length === 4 ? "a" : ""}(${r.map((n, o) => o < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3).join(", ")})` : "";
}
function Xe(e) {
  if (e.type)
    return e;
  if (e.charAt(0) === "#")
    return Xe(zs(e));
  const t = e.indexOf("("), r = e.substring(0, t);
  if (!["rgb", "rgba", "hsl", "hsla", "color"].includes(r))
    throw new Error(process.env.NODE_ENV !== "production" ? `MUI: Unsupported \`${e}\` color.
The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().` : Ke(9, e));
  let n = e.substring(t + 1, e.length - 1), o;
  if (r === "color") {
    if (n = n.split(" "), o = n.shift(), n.length === 4 && n[3].charAt(0) === "/" && (n[3] = n[3].slice(1)), !["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].includes(o))
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: unsupported \`${o}\` color space.
The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.` : Ke(10, o));
  } else
    n = n.split(",");
  return n = n.map((i) => parseFloat(i)), {
    type: r,
    values: n,
    colorSpace: o
  };
}
const Ls = (e) => {
  const t = Xe(e);
  return t.values.slice(0, 3).map((r, n) => t.type.includes("hsl") && n !== 0 ? `${r}%` : r).join(" ");
}, Tt = (e, t) => {
  try {
    return Ls(e);
  } catch {
    return t && process.env.NODE_ENV !== "production" && console.warn(t), e;
  }
};
function Er(e) {
  const {
    type: t,
    colorSpace: r
  } = e;
  let {
    values: n
  } = e;
  return t.includes("rgb") ? n = n.map((o, i) => i < 3 ? parseInt(o, 10) : o) : t.includes("hsl") && (n[1] = `${n[1]}%`, n[2] = `${n[2]}%`), t.includes("color") ? n = `${r} ${n.join(" ")}` : n = `${n.join(", ")}`, `${t}(${n})`;
}
function ko(e) {
  e = Xe(e);
  const {
    values: t
  } = e, r = t[0], n = t[1] / 100, o = t[2] / 100, i = n * Math.min(o, 1 - o), a = (p, b = (p + r / 30) % 12) => o - i * Math.max(Math.min(b - 3, 9 - b, 1), -1);
  let s = "rgb";
  const f = [Math.round(a(0) * 255), Math.round(a(8) * 255), Math.round(a(4) * 255)];
  return e.type === "hsla" && (s += "a", f.push(t[3])), Er({
    type: s,
    values: f
  });
}
function Dr(e) {
  e = Xe(e);
  let t = e.type === "hsl" || e.type === "hsla" ? Xe(ko(e)).values : e.values;
  return t = t.map((r) => (e.type !== "color" && (r /= 255), r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4)), Number((0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]).toFixed(3));
}
function Wn(e, t) {
  const r = Dr(e), n = Dr(t);
  return (Math.max(r, n) + 0.05) / (Math.min(r, n) + 0.05);
}
function lt(e, t) {
  return e = Xe(e), t = Zr(t), (e.type === "rgb" || e.type === "hsl") && (e.type += "a"), e.type === "color" ? e.values[3] = `/${t}` : e.values[3] = t, Er(e);
}
function Wt(e, t, r) {
  try {
    return lt(e, t);
  } catch {
    return e;
  }
}
function en(e, t) {
  if (e = Xe(e), t = Zr(t), e.type.includes("hsl"))
    e.values[2] *= 1 - t;
  else if (e.type.includes("rgb") || e.type.includes("color"))
    for (let r = 0; r < 3; r += 1)
      e.values[r] *= 1 - t;
  return Er(e);
}
function pe(e, t, r) {
  try {
    return en(e, t);
  } catch {
    return e;
  }
}
function tn(e, t) {
  if (e = Xe(e), t = Zr(t), e.type.includes("hsl"))
    e.values[2] += (100 - e.values[2]) * t;
  else if (e.type.includes("rgb"))
    for (let r = 0; r < 3; r += 1)
      e.values[r] += (255 - e.values[r]) * t;
  else if (e.type.includes("color"))
    for (let r = 0; r < 3; r += 1)
      e.values[r] += (1 - e.values[r]) * t;
  return Er(e);
}
function me(e, t, r) {
  try {
    return tn(e, t);
  } catch {
    return e;
  }
}
function Vs(e, t = 0.15) {
  return Dr(e) > 0.5 ? en(e, t) : tn(e, t);
}
function Ut(e, t, r) {
  try {
    return Vs(e, t);
  } catch {
    return e;
  }
}
function Ys(e, t) {
  return process.env.NODE_ENV === "production" ? () => null : function(...n) {
    return e(...n) || t(...n);
  };
}
function Ws(e) {
  const {
    prototype: t = {}
  } = e;
  return !!t.isReactComponent;
}
function Us(e, t, r, n, o) {
  const i = e[t], a = o || t;
  if (i == null || // When server-side rendering React doesn't warn either.
  // This is not an accurate check for SSR.
  // This is only in place for emotion compat.
  // TODO: Revisit once https://github.com/facebook/react/issues/20047 is resolved.
  typeof window > "u")
    return null;
  let s;
  return typeof i == "function" && !Ws(i) && (s = "Did you accidentally provide a plain function component instead?"), s !== void 0 ? new Error(`Invalid ${n} \`${a}\` supplied to \`${r}\`. Expected an element type that can hold a ref. ${s} For more information see https://mui.com/r/caveat-with-refs-guide`) : null;
}
const qs = Ys(v.elementType, Us), Gs = v.oneOfType([v.func, v.object]);
function Hs(e, t) {
  typeof e == "function" ? e(t) : e && (e.current = t);
}
function Qt(e) {
  const t = H.useRef(e);
  return Fs(() => {
    t.current = e;
  }), H.useRef((...r) => (
    // @ts-expect-error hide `this`
    (0, t.current)(...r)
  )).current;
}
function Un(...e) {
  return H.useMemo(() => e.every((t) => t == null) ? null : (t) => {
    e.forEach((r) => {
      Hs(r, t);
    });
  }, e);
}
const qn = {};
function No(e, t) {
  const r = H.useRef(qn);
  return r.current === qn && (r.current = e(t)), r;
}
const Ks = [];
function Xs(e) {
  H.useEffect(e, Ks);
}
class rn {
  constructor() {
    vt(this, "currentId", null);
    vt(this, "clear", () => {
      this.currentId !== null && (clearTimeout(this.currentId), this.currentId = null);
    });
    vt(this, "disposeEffect", () => this.clear);
  }
  static create() {
    return new rn();
  }
  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  start(t, r) {
    this.clear(), this.currentId = setTimeout(() => {
      this.currentId = null, r();
    }, t);
  }
}
function Js() {
  const e = No(rn.create).current;
  return Xs(e.disposeEffect), e;
}
function Gn(e) {
  try {
    return e.matches(":focus-visible");
  } catch {
    process.env.NODE_ENV !== "production" && !/jsdom/.test(window.navigator.userAgent) && console.warn(["MUI: The `:focus-visible` pseudo class is not supported in this browser.", "Some components rely on this feature to work properly."].join(`
`));
  }
  return !1;
}
function nn(e, t, r = void 0) {
  const n = {};
  for (const o in e) {
    const i = e[o];
    let a = "", s = !0;
    for (let f = 0; f < i.length; f += 1) {
      const p = i[f];
      p && (a += (s === !0 ? "" : " ") + t(p), s = !1, r && r[p] && (a += " " + r[p]));
    }
    n[o] = a;
  }
  return n;
}
const Qs = /* @__PURE__ */ H.createContext(void 0);
process.env.NODE_ENV !== "production" && (v.node, v.object);
function Zs(e) {
  const {
    theme: t,
    name: r,
    props: n
  } = e;
  if (!t || !t.components || !t.components[r])
    return n;
  const o = t.components[r];
  return o.defaultProps ? $t(o.defaultProps, n) : !o.styleOverrides && !o.variants ? $t(o, n) : n;
}
function ec({
  props: e,
  name: t
}) {
  const r = H.useContext(Qs);
  return Zs({
    props: e,
    name: t,
    theme: {
      components: r
    }
  });
}
const Hn = {
  theme: void 0
};
function tc(e) {
  let t, r;
  return function(o) {
    let i = t;
    return (i === void 0 || o.theme !== r) && (Hn.theme = o.theme, i = Ao(e(Hn)), t = i, r = o.theme), i;
  };
}
function rc(e = "") {
  function t(...n) {
    if (!n.length)
      return "";
    const o = n[0];
    return typeof o == "string" && !o.match(/(#|\(|\)|(-?(\d*\.)?\d+)(px|em|%|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc))|^(-?(\d*\.)?\d+)$|(\d+ \d+ \d+)/) ? `, var(--${e ? `${e}-` : ""}${o}${t(...n.slice(1))})` : `, ${o}`;
  }
  return (n, ...o) => `var(--${e ? `${e}-` : ""}${n}${t(...o)})`;
}
const Kn = (e, t, r, n = []) => {
  let o = e;
  t.forEach((i, a) => {
    a === t.length - 1 ? Array.isArray(o) ? o[Number(i)] = r : o && typeof o == "object" && (o[i] = r) : o && typeof o == "object" && (o[i] || (o[i] = n.includes(i) ? [] : {}), o = o[i]);
  });
}, nc = (e, t, r) => {
  function n(o, i = [], a = []) {
    Object.entries(o).forEach(([s, f]) => {
      (!r || !r([...i, s])) && f != null && (typeof f == "object" && Object.keys(f).length > 0 ? n(f, [...i, s], Array.isArray(f) ? [...a, s] : a) : t([...i, s], f, a));
    });
  }
  n(e);
}, oc = (e, t) => typeof t == "number" ? ["lineHeight", "fontWeight", "opacity", "zIndex"].some((n) => e.includes(n)) || e[e.length - 1].toLowerCase().includes("opacity") ? t : `${t}px` : t;
function kr(e, t) {
  const {
    prefix: r,
    shouldSkipGeneratingVar: n
  } = t || {}, o = {}, i = {}, a = {};
  return nc(
    e,
    (s, f, p) => {
      if ((typeof f == "string" || typeof f == "number") && (!n || !n(s, f))) {
        const b = `--${r ? `${r}-` : ""}${s.join("-")}`, y = oc(s, f);
        Object.assign(o, {
          [b]: y
        }), Kn(i, s, `var(${b})`, p), Kn(a, s, `var(${b}, ${y})`, p);
      }
    },
    (s) => s[0] === "vars"
    // skip 'vars/*' paths
  ), {
    css: o,
    vars: i,
    varsWithDefaults: a
  };
}
function ic(e, t = {}) {
  const {
    getSelector: r = P,
    disableCssColorScheme: n,
    colorSchemeSelector: o
  } = t, {
    colorSchemes: i = {},
    components: a,
    defaultColorScheme: s = "light",
    ...f
  } = e, {
    vars: p,
    css: b,
    varsWithDefaults: y
  } = kr(f, t);
  let E = y;
  const $ = {}, {
    [s]: C,
    ...u
  } = i;
  if (Object.entries(u || {}).forEach(([k, R]) => {
    const {
      vars: h,
      css: F,
      varsWithDefaults: V
    } = kr(R, t);
    E = Oe(E, V), $[k] = {
      css: F,
      vars: h
    };
  }), C) {
    const {
      css: k,
      vars: R,
      varsWithDefaults: h
    } = kr(C, t);
    E = Oe(E, h), $[s] = {
      css: k,
      vars: R
    };
  }
  function P(k, R) {
    var F, V;
    let h = o;
    if (o === "class" && (h = ".%s"), o === "data" && (h = "[data-%s]"), o != null && o.startsWith("data-") && !o.includes("%s") && (h = `[${o}="%s"]`), k) {
      if (h === "media")
        return e.defaultColorScheme === k ? ":root" : {
          [`@media (prefers-color-scheme: ${((V = (F = i[k]) == null ? void 0 : F.palette) == null ? void 0 : V.mode) || k})`]: {
            ":root": R
          }
        };
      if (h)
        return e.defaultColorScheme === k ? `:root, ${h.replace("%s", String(k))}` : h.replace("%s", String(k));
    }
    return ":root";
  }
  return {
    vars: E,
    generateThemeVars: () => {
      let k = {
        ...p
      };
      return Object.entries($).forEach(([, {
        vars: R
      }]) => {
        k = Oe(k, R);
      }), k;
    },
    generateStyleSheets: () => {
      var ee, re;
      const k = [], R = e.defaultColorScheme || "light";
      function h(c, B) {
        Object.keys(B).length && k.push(typeof c == "string" ? {
          [c]: {
            ...B
          }
        } : c);
      }
      h(r(void 0, {
        ...b
      }), b);
      const {
        [R]: F,
        ...V
      } = $;
      if (F) {
        const {
          css: c
        } = F, B = (re = (ee = i[R]) == null ? void 0 : ee.palette) == null ? void 0 : re.mode, U = !n && B ? {
          colorScheme: B,
          ...c
        } : {
          ...c
        };
        h(r(R, {
          ...U
        }), U);
      }
      return Object.entries(V).forEach(([c, {
        css: B
      }]) => {
        var l, S;
        const U = (S = (l = i[c]) == null ? void 0 : l.palette) == null ? void 0 : S.mode, d = !n && U ? {
          colorScheme: U,
          ...B
        } : {
          ...B
        };
        h(r(c, {
          ...d
        }), d);
      }), k;
    }
  };
}
function ac(e) {
  return function(r) {
    return e === "media" ? (process.env.NODE_ENV !== "production" && r !== "light" && r !== "dark" && console.error(`MUI: @media (prefers-color-scheme) supports only 'light' or 'dark', but receive '${r}'.`), `@media (prefers-color-scheme: ${r})`) : e ? e.startsWith("data-") && !e.includes("%s") ? `[${e}="${r}"] &` : e === "class" ? `.${r} &` : e === "data" ? `[data-${r}] &` : `${e.replace("%s", r)} &` : "&";
  };
}
const sc = Sr(), cc = Is("div", {
  name: "MuiStack",
  slot: "Root",
  overridesResolver: (e, t) => t.root
});
function uc(e) {
  return Bs({
    props: e,
    name: "MuiStack",
    defaultTheme: sc
  });
}
function lc(e, t) {
  const r = H.Children.toArray(e).filter(Boolean);
  return r.reduce((n, o, i) => (n.push(o), i < r.length - 1 && n.push(/* @__PURE__ */ H.cloneElement(t, {
    key: `separator-${i}`
  })), n), []);
}
const fc = (e) => ({
  row: "Left",
  "row-reverse": "Right",
  column: "Top",
  "column-reverse": "Bottom"
})[e], dc = ({
  ownerState: e,
  theme: t
}) => {
  let r = {
    display: "flex",
    flexDirection: "column",
    ...Be({
      theme: t
    }, $r({
      values: e.direction,
      breakpoints: t.breakpoints.values
    }), (n) => ({
      flexDirection: n
    }))
  };
  if (e.spacing) {
    const n = mr(t), o = Object.keys(t.breakpoints.values).reduce((f, p) => ((typeof e.spacing == "object" && e.spacing[p] != null || typeof e.direction == "object" && e.direction[p] != null) && (f[p] = !0), f), {}), i = $r({
      values: e.direction,
      base: o
    }), a = $r({
      values: e.spacing,
      base: o
    });
    typeof i == "object" && Object.keys(i).forEach((f, p, b) => {
      if (!i[f]) {
        const E = p > 0 ? i[b[p - 1]] : "column";
        i[f] = E;
      }
    }), r = Oe(r, Be({
      theme: t
    }, a, (f, p) => e.useFlexGap ? {
      gap: rt(n, f)
    } : {
      // The useFlexGap={false} implement relies on each child to give up control of the margin.
      // We need to reset the margin to avoid double spacing.
      "& > :not(style):not(style)": {
        margin: 0
      },
      "& > :not(style) ~ :not(style)": {
        [`margin${fc(p ? i[p] : e.direction)}`]: rt(n, f)
      }
    }));
  }
  return r = _a(t.breakpoints, r), r;
};
function pc(e = {}) {
  const {
    // This will allow adding custom styled fn (for example for custom sx style function)
    createStyledComponent: t = cc,
    useThemeProps: r = uc,
    componentName: n = "MuiStack"
  } = e, o = () => nn({
    root: ["root"]
  }, (f) => It(n, f), {}), i = t(dc), a = /* @__PURE__ */ H.forwardRef(function(f, p) {
    const b = r(f), y = Ss(b), {
      component: E = "div",
      direction: $ = "column",
      spacing: C = 0,
      divider: u,
      children: P,
      className: M,
      useFlexGap: Y = !1,
      ...k
    } = y, R = {
      direction: $,
      spacing: C,
      useFlexGap: Y
    }, h = o();
    return /* @__PURE__ */ Ee.jsx(i, {
      as: E,
      ownerState: R,
      ref: p,
      className: Pe(h.root, M),
      ...k,
      children: u ? lc(P, u) : P
    });
  });
  return process.env.NODE_ENV !== "production" && (a.propTypes = {
    children: v.node,
    direction: v.oneOfType([v.oneOf(["column-reverse", "column", "row-reverse", "row"]), v.arrayOf(v.oneOf(["column-reverse", "column", "row-reverse", "row"])), v.object]),
    divider: v.node,
    spacing: v.oneOfType([v.arrayOf(v.oneOfType([v.number, v.string])), v.number, v.object, v.string]),
    sx: v.oneOfType([v.arrayOf(v.oneOfType([v.func, v.object, v.bool])), v.func, v.object])
  }), a;
}
const Io = pc();
process.env.NODE_ENV !== "production" && (Io.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: v.node,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: v.elementType,
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   * @default 'column'
   */
  direction: v.oneOfType([v.oneOf(["column-reverse", "column", "row-reverse", "row"]), v.arrayOf(v.oneOf(["column-reverse", "column", "row-reverse", "row"])), v.object]),
  /**
   * Add an element between each child.
   */
  divider: v.node,
  /**
   * Defines the space between immediate children.
   * @default 0
   */
  spacing: v.oneOfType([v.arrayOf(v.oneOfType([v.number, v.string])), v.number, v.object, v.string]),
  /**
   * The system prop, which allows defining system overrides as well as additional CSS styles.
   */
  sx: v.oneOfType([v.arrayOf(v.oneOfType([v.func, v.object, v.bool])), v.func, v.object]),
  /**
   * If `true`, the CSS flexbox `gap` is used instead of applying `margin` to children.
   *
   * While CSS `gap` removes the [known limitations](https://mui.com/joy-ui/react-stack/#limitations),
   * it is not fully supported in some browsers. We recommend checking https://caniuse.com/?search=flex%20gap before using this flag.
   *
   * To enable this flag globally, follow the theme's default props configuration.
   * @default false
   */
  useFlexGap: v.bool
});
function jo() {
  return {
    // The colors used to style the text.
    text: {
      // The most important text.
      primary: "rgba(0, 0, 0, 0.87)",
      // Secondary text.
      secondary: "rgba(0, 0, 0, 0.6)",
      // Disabled text have even lower visual prominence.
      disabled: "rgba(0, 0, 0, 0.38)"
    },
    // The color used to divide different elements.
    divider: "rgba(0, 0, 0, 0.12)",
    // The background colors used to style the surfaces.
    // Consistency between these values is important.
    background: {
      paper: Ot.white,
      default: Ot.white
    },
    // The colors used to style the action elements.
    action: {
      // The color of an active action like an icon button.
      active: "rgba(0, 0, 0, 0.54)",
      // The color of an hovered action.
      hover: "rgba(0, 0, 0, 0.04)",
      hoverOpacity: 0.04,
      // The color of a selected action.
      selected: "rgba(0, 0, 0, 0.08)",
      selectedOpacity: 0.08,
      // The color of a disabled action.
      disabled: "rgba(0, 0, 0, 0.26)",
      // The background color of a disabled action.
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(0, 0, 0, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.12
    }
  };
}
const mc = jo();
function Bo() {
  return {
    text: {
      primary: Ot.white,
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
      icon: "rgba(255, 255, 255, 0.5)"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    background: {
      paper: "#121212",
      default: "#121212"
    },
    action: {
      active: Ot.white,
      hover: "rgba(255, 255, 255, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(255, 255, 255, 0.16)",
      selectedOpacity: 0.16,
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(255, 255, 255, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.24
    }
  };
}
const Xn = Bo();
function Jn(e, t, r, n) {
  const o = n.light || n, i = n.dark || n * 1.5;
  e[t] || (e.hasOwnProperty(r) ? e[t] = e[r] : t === "light" ? e.light = tn(e.main, o) : t === "dark" && (e.dark = en(e.main, i)));
}
function hc(e = "light") {
  return e === "dark" ? {
    main: at[200],
    light: at[50],
    dark: at[400]
  } : {
    main: at[700],
    light: at[400],
    dark: at[800]
  };
}
function gc(e = "light") {
  return e === "dark" ? {
    main: it[200],
    light: it[50],
    dark: it[400]
  } : {
    main: it[500],
    light: it[300],
    dark: it[700]
  };
}
function yc(e = "light") {
  return e === "dark" ? {
    main: ot[500],
    light: ot[300],
    dark: ot[700]
  } : {
    main: ot[700],
    light: ot[400],
    dark: ot[800]
  };
}
function bc(e = "light") {
  return e === "dark" ? {
    main: st[400],
    light: st[300],
    dark: st[700]
  } : {
    main: st[700],
    light: st[500],
    dark: st[900]
  };
}
function vc(e = "light") {
  return e === "dark" ? {
    main: ct[400],
    light: ct[300],
    dark: ct[700]
  } : {
    main: ct[800],
    light: ct[500],
    dark: ct[900]
  };
}
function Sc(e = "light") {
  return e === "dark" ? {
    main: wt[400],
    light: wt[300],
    dark: wt[700]
  } : {
    main: "#ed6c02",
    // closest to orange[800] that pass 3:1.
    light: wt[500],
    dark: wt[900]
  };
}
function on(e) {
  const {
    mode: t = "light",
    contrastThreshold: r = 3,
    tonalOffset: n = 0.2,
    ...o
  } = e, i = e.primary || hc(t), a = e.secondary || gc(t), s = e.error || yc(t), f = e.info || bc(t), p = e.success || vc(t), b = e.warning || Sc(t);
  function y(u) {
    const P = Wn(u, Xn.text.primary) >= r ? Xn.text.primary : mc.text.primary;
    if (process.env.NODE_ENV !== "production") {
      const M = Wn(u, P);
      M < 3 && console.error([`MUI: The contrast ratio of ${M}:1 for ${P} on ${u}`, "falls below the WCAG recommended absolute minimum contrast ratio of 3:1.", "https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast"].join(`
`));
    }
    return P;
  }
  const E = ({
    color: u,
    name: P,
    mainShade: M = 500,
    lightShade: Y = 300,
    darkShade: k = 700
  }) => {
    if (u = {
      ...u
    }, !u.main && u[M] && (u.main = u[M]), !u.hasOwnProperty("main"))
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The color${P ? ` (${P})` : ""} provided to augmentColor(color) is invalid.
The color object needs to have a \`main\` property or a \`${M}\` property.` : Ke(11, P ? ` (${P})` : "", M));
    if (typeof u.main != "string")
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The color${P ? ` (${P})` : ""} provided to augmentColor(color) is invalid.
\`color.main\` should be a string, but \`${JSON.stringify(u.main)}\` was provided instead.

Did you intend to use one of the following approaches?

import { green } from "@mui/material/colors";

const theme1 = createTheme({ palette: {
  primary: green,
} });

const theme2 = createTheme({ palette: {
  primary: { main: green[500] },
} });` : Ke(12, P ? ` (${P})` : "", JSON.stringify(u.main)));
    return Jn(u, "light", Y, n), Jn(u, "dark", k, n), u.contrastText || (u.contrastText = y(u.main)), u;
  };
  let $;
  return t === "light" ? $ = jo() : t === "dark" && ($ = Bo()), process.env.NODE_ENV !== "production" && ($ || console.error(`MUI: The palette mode \`${t}\` is not supported.`)), Oe({
    // A collection of common colors.
    common: {
      ...Ot
    },
    // prevent mutable object.
    // The palette mode, can be light or dark.
    mode: t,
    // The colors used to represent primary interface elements for a user.
    primary: E({
      color: i,
      name: "primary"
    }),
    // The colors used to represent secondary interface elements for a user.
    secondary: E({
      color: a,
      name: "secondary",
      mainShade: "A400",
      lightShade: "A200",
      darkShade: "A700"
    }),
    // The colors used to represent interface elements that the user should be made aware of.
    error: E({
      color: s,
      name: "error"
    }),
    // The colors used to represent potentially dangerous actions or important messages.
    warning: E({
      color: b,
      name: "warning"
    }),
    // The colors used to present information to the user that is neutral and not necessarily important.
    info: E({
      color: f,
      name: "info"
    }),
    // The colors used to indicate the successful completion of an action that user triggered.
    success: E({
      color: p,
      name: "success"
    }),
    // The grey colors.
    grey: oi,
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: r,
    // Takes a background color and returns the text color that maximizes the contrast.
    getContrastText: y,
    // Generate a rich color object.
    augmentColor: E,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: n,
    // The light and dark mode object.
    ...$
  }, o);
}
function Ec(e) {
  const t = {};
  return Object.entries(e).forEach((n) => {
    const [o, i] = n;
    typeof i == "object" && (t[o] = `${i.fontStyle ? `${i.fontStyle} ` : ""}${i.fontVariant ? `${i.fontVariant} ` : ""}${i.fontWeight ? `${i.fontWeight} ` : ""}${i.fontStretch ? `${i.fontStretch} ` : ""}${i.fontSize || ""}${i.lineHeight ? `/${i.lineHeight} ` : ""}${i.fontFamily || ""}`);
  }), t;
}
function wc(e, t) {
  return {
    toolbar: {
      minHeight: 56,
      [e.up("xs")]: {
        "@media (orientation: landscape)": {
          minHeight: 48
        }
      },
      [e.up("sm")]: {
        minHeight: 64
      }
    },
    ...t
  };
}
function xc(e) {
  return Math.round(e * 1e5) / 1e5;
}
const Qn = {
  textTransform: "uppercase"
}, Zn = '"Roboto", "Helvetica", "Arial", sans-serif';
function Tc(e, t) {
  const {
    fontFamily: r = Zn,
    // The default font size of the Material Specification.
    fontSize: n = 14,
    // px
    fontWeightLight: o = 300,
    fontWeightRegular: i = 400,
    fontWeightMedium: a = 500,
    fontWeightBold: s = 700,
    // Tell MUI what's the font-size on the html element.
    // 16px is the default font-size used by browsers.
    htmlFontSize: f = 16,
    // Apply the CSS properties to all the variants.
    allVariants: p,
    pxToRem: b,
    ...y
  } = typeof t == "function" ? t(e) : t;
  process.env.NODE_ENV !== "production" && (typeof n != "number" && console.error("MUI: `fontSize` is required to be a number."), typeof f != "number" && console.error("MUI: `htmlFontSize` is required to be a number."));
  const E = n / 14, $ = b || ((P) => `${P / f * E}rem`), C = (P, M, Y, k, R) => ({
    fontFamily: r,
    fontWeight: P,
    fontSize: $(M),
    // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
    lineHeight: Y,
    // The letter spacing was designed for the Roboto font-family. Using the same letter-spacing
    // across font-families can cause issues with the kerning.
    ...r === Zn ? {
      letterSpacing: `${xc(k / M)}em`
    } : {},
    ...R,
    ...p
  }), u = {
    h1: C(o, 96, 1.167, -1.5),
    h2: C(o, 60, 1.2, -0.5),
    h3: C(i, 48, 1.167, 0),
    h4: C(i, 34, 1.235, 0.25),
    h5: C(i, 24, 1.334, 0),
    h6: C(a, 20, 1.6, 0.15),
    subtitle1: C(i, 16, 1.75, 0.15),
    subtitle2: C(a, 14, 1.57, 0.1),
    body1: C(i, 16, 1.5, 0.15),
    body2: C(i, 14, 1.43, 0.15),
    button: C(a, 14, 1.75, 0.4, Qn),
    caption: C(i, 12, 1.66, 0.4),
    overline: C(i, 12, 2.66, 1, Qn),
    // TODO v6: Remove handling of 'inherit' variant from the theme as it is already handled in Material UI's Typography component. Also, remember to remove the associated types.
    inherit: {
      fontFamily: "inherit",
      fontWeight: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit"
    }
  };
  return Oe({
    htmlFontSize: f,
    pxToRem: $,
    fontFamily: r,
    fontSize: n,
    fontWeightLight: o,
    fontWeightRegular: i,
    fontWeightMedium: a,
    fontWeightBold: s,
    ...u
  }, y, {
    clone: !1
    // No need to clone deep
  });
}
const Cc = 0.2, _c = 0.14, Oc = 0.12;
function he(...e) {
  return [`${e[0]}px ${e[1]}px ${e[2]}px ${e[3]}px rgba(0,0,0,${Cc})`, `${e[4]}px ${e[5]}px ${e[6]}px ${e[7]}px rgba(0,0,0,${_c})`, `${e[8]}px ${e[9]}px ${e[10]}px ${e[11]}px rgba(0,0,0,${Oc})`].join(",");
}
const Rc = ["none", he(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), he(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), he(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), he(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), he(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), he(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), he(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), he(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), he(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), he(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), he(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), he(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), he(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), he(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), he(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), he(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), he(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), he(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), he(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), he(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), he(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), he(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), he(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), he(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)], Ac = {
  // This is the most common easing curve.
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
}, Pc = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195
};
function eo(e) {
  return `${Math.round(e)}ms`;
}
function $c(e) {
  if (!e)
    return 0;
  const t = e / 36;
  return Math.min(Math.round((4 + 15 * t ** 0.25 + t / 5) * 10), 3e3);
}
function Mc(e) {
  const t = {
    ...Ac,
    ...e.easing
  }, r = {
    ...Pc,
    ...e.duration
  };
  return {
    getAutoHeightDuration: $c,
    create: (o = ["all"], i = {}) => {
      const {
        duration: a = r.standard,
        easing: s = t.easeInOut,
        delay: f = 0,
        ...p
      } = i;
      if (process.env.NODE_ENV !== "production") {
        const b = (E) => typeof E == "string", y = (E) => !Number.isNaN(parseFloat(E));
        !b(o) && !Array.isArray(o) && console.error('MUI: Argument "props" must be a string or Array.'), !y(a) && !b(a) && console.error(`MUI: Argument "duration" must be a number or a string but found ${a}.`), b(s) || console.error('MUI: Argument "easing" must be a string.'), !y(f) && !b(f) && console.error('MUI: Argument "delay" must be a number or a string.'), typeof i != "object" && console.error(["MUI: Secong argument of transition.create must be an object.", "Arguments should be either `create('prop1', options)` or `create(['prop1', 'prop2'], options)`"].join(`
`)), Object.keys(p).length !== 0 && console.error(`MUI: Unrecognized argument(s) [${Object.keys(p).join(",")}].`);
      }
      return (Array.isArray(o) ? o : [o]).map((b) => `${b} ${typeof a == "string" ? a : eo(a)} ${s} ${typeof f == "string" ? f : eo(f)}`).join(",");
    },
    ...e,
    easing: t,
    duration: r
  };
}
const kc = {
  mobileStepper: 1e3,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
};
function Nc(e) {
  return Le(e) || typeof e > "u" || typeof e == "string" || typeof e == "boolean" || typeof e == "number" || Array.isArray(e);
}
function Fo(e = {}) {
  const t = {
    ...e
  };
  function r(n) {
    const o = Object.entries(n);
    for (let i = 0; i < o.length; i++) {
      const [a, s] = o[i];
      !Nc(s) || a.startsWith("unstable_") ? delete n[a] : Le(s) && (n[a] = {
        ...s
      }, r(n[a]));
    }
  }
  return r(t), `import { unstable_createBreakpoints as createBreakpoints, createTransitions } from '@mui/material/styles';

const theme = ${JSON.stringify(t, null, 2)};

theme.breakpoints = createBreakpoints(theme.breakpoints || {});
theme.transitions = createTransitions(theme.transitions || {});

export default theme;`;
}
function zr(e = {}, ...t) {
  const {
    breakpoints: r,
    mixins: n = {},
    spacing: o,
    palette: i = {},
    transitions: a = {},
    typography: s = {},
    shape: f,
    ...p
  } = e;
  if (e.vars)
    throw new Error(process.env.NODE_ENV !== "production" ? "MUI: `vars` is a private field used for CSS variables support.\nPlease use another name." : Ke(20));
  const b = on(i), y = Sr(e);
  let E = Oe(y, {
    mixins: wc(y.breakpoints, n),
    palette: b,
    // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
    shadows: Rc.slice(),
    typography: Tc(b, s),
    transitions: Mc(a),
    zIndex: {
      ...kc
    }
  });
  if (E = Oe(E, p), E = t.reduce(($, C) => Oe($, C), E), process.env.NODE_ENV !== "production") {
    const $ = ["active", "checked", "completed", "disabled", "error", "expanded", "focused", "focusVisible", "required", "selected"], C = (u, P) => {
      let M;
      for (M in u) {
        const Y = u[M];
        if ($.includes(M) && Object.keys(Y).length > 0) {
          if (process.env.NODE_ENV !== "production") {
            const k = It("", M);
            console.error([`MUI: The \`${P}\` component increases the CSS specificity of the \`${M}\` internal state.`, "You can not override it like this: ", JSON.stringify(u, null, 2), "", `Instead, you need to use the '&.${k}' syntax:`, JSON.stringify({
              root: {
                [`&.${k}`]: Y
              }
            }, null, 2), "", "https://mui.com/r/state-classes-guide"].join(`
`));
          }
          u[M] = {};
        }
      }
    };
    Object.keys(E.components).forEach((u) => {
      const P = E.components[u].styleOverrides;
      P && u.startsWith("Mui") && C(P, u);
    });
  }
  return E.unstable_sxConfig = {
    ...Nt,
    ...p == null ? void 0 : p.unstable_sxConfig
  }, E.unstable_sx = function(C) {
    return mt({
      sx: C,
      theme: this
    });
  }, E.toRuntimeSource = Fo, E;
}
function Ic(e) {
  let t;
  return e < 1 ? t = 5.11916 * e ** 2 : t = 4.5 * Math.log(e + 1) + 2, Math.round(t * 10) / 1e3;
}
const jc = [...Array(25)].map((e, t) => {
  if (t === 0)
    return "none";
  const r = Ic(t);
  return `linear-gradient(rgba(255 255 255 / ${r}), rgba(255 255 255 / ${r}))`;
});
function Do(e) {
  return {
    inputPlaceholder: e === "dark" ? 0.5 : 0.42,
    inputUnderline: e === "dark" ? 0.7 : 0.42,
    switchTrackDisabled: e === "dark" ? 0.2 : 0.12,
    switchTrack: e === "dark" ? 0.3 : 0.38
  };
}
function zo(e) {
  return e === "dark" ? jc : [];
}
function Bc(e) {
  const {
    palette: t = {
      mode: "light"
    },
    // need to cast to avoid module augmentation test
    opacity: r,
    overlays: n,
    ...o
  } = e, i = on(t);
  return {
    palette: i,
    opacity: {
      ...Do(i.mode),
      ...r
    },
    overlays: n || zo(i.mode),
    ...o
  };
}
function Fc(e) {
  var t;
  return !!e[0].match(/(cssVarPrefix|colorSchemeSelector|rootSelector|typography|mixins|breakpoints|direction|transitions)/) || !!e[0].match(/sxConfig$/) || // ends with sxConfig
  e[0] === "palette" && !!((t = e[1]) != null && t.match(/(mode|contrastThreshold|tonalOffset)/));
}
const Dc = (e) => [...[...Array(25)].map((t, r) => `--${e ? `${e}-` : ""}overlays-${r}`), `--${e ? `${e}-` : ""}palette-AppBar-darkBg`, `--${e ? `${e}-` : ""}palette-AppBar-darkColor`], zc = (e) => (t, r) => {
  const n = e.rootSelector || ":root", o = e.colorSchemeSelector;
  let i = o;
  if (o === "class" && (i = ".%s"), o === "data" && (i = "[data-%s]"), o != null && o.startsWith("data-") && !o.includes("%s") && (i = `[${o}="%s"]`), e.defaultColorScheme === t) {
    if (t === "dark") {
      const a = {};
      return Dc(e.cssVarPrefix).forEach((s) => {
        a[s] = r[s], delete r[s];
      }), i === "media" ? {
        [n]: r,
        "@media (prefers-color-scheme: dark)": {
          [n]: a
        }
      } : i ? {
        [i.replace("%s", t)]: a,
        [`${n}, ${i.replace("%s", t)}`]: r
      } : {
        [n]: {
          ...r,
          ...a
        }
      };
    }
    if (i && i !== "media")
      return `${n}, ${i.replace("%s", String(t))}`;
  } else if (t) {
    if (i === "media")
      return {
        [`@media (prefers-color-scheme: ${String(t)})`]: {
          [n]: r
        }
      };
    if (i)
      return i.replace("%s", String(t));
  }
  return n;
};
function Lc(e, t) {
  t.forEach((r) => {
    e[r] || (e[r] = {});
  });
}
function A(e, t, r) {
  !e[t] && r && (e[t] = r);
}
function Ct(e) {
  return typeof e != "string" || !e.startsWith("hsl") ? e : ko(e);
}
function Ue(e, t) {
  `${t}Channel` in e || (e[`${t}Channel`] = Tt(Ct(e[t]), `MUI: Can't create \`palette.${t}Channel\` because \`palette.${t}\` is not one of these formats: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().
To suppress this warning, you need to explicitly provide the \`palette.${t}Channel\` as a string (in rgb format, for example "12 12 12") or undefined if you want to remove the channel token.`));
}
function Vc(e) {
  return typeof e == "number" ? `${e}px` : typeof e == "string" || typeof e == "function" || Array.isArray(e) ? e : "8px";
}
const Fe = (e) => {
  try {
    return e();
  } catch {
  }
}, Yc = (e = "mui") => rc(e);
function Nr(e, t, r, n) {
  if (!t)
    return;
  t = t === !0 ? {} : t;
  const o = n === "dark" ? "dark" : "light";
  if (!r) {
    e[n] = Bc({
      ...t,
      palette: {
        mode: o,
        ...t == null ? void 0 : t.palette
      }
    });
    return;
  }
  const {
    palette: i,
    ...a
  } = zr({
    ...r,
    palette: {
      mode: o,
      ...t == null ? void 0 : t.palette
    }
  });
  return e[n] = {
    ...t,
    palette: i,
    opacity: {
      ...Do(o),
      ...t == null ? void 0 : t.opacity
    },
    overlays: (t == null ? void 0 : t.overlays) || zo(o)
  }, a;
}
function Wc(e = {}, ...t) {
  const {
    colorSchemes: r = {
      light: !0
    },
    defaultColorScheme: n,
    disableCssColorScheme: o = !1,
    cssVarPrefix: i = "mui",
    shouldSkipGeneratingVar: a = Fc,
    colorSchemeSelector: s = r.light && r.dark ? "media" : void 0,
    rootSelector: f = ":root",
    ...p
  } = e, b = Object.keys(r)[0], y = n || (r.light && b !== "light" ? "light" : b), E = Yc(i), {
    [y]: $,
    light: C,
    dark: u,
    ...P
  } = r, M = {
    ...P
  };
  let Y = $;
  if ((y === "dark" && !("dark" in r) || y === "light" && !("light" in r)) && (Y = !0), !Y)
    throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The \`colorSchemes.${y}\` option is either missing or invalid.` : Ke(21, y));
  const k = Nr(M, Y, p, y);
  C && !M.light && Nr(M, C, void 0, "light"), u && !M.dark && Nr(M, u, void 0, "dark");
  let R = {
    defaultColorScheme: y,
    ...k,
    cssVarPrefix: i,
    colorSchemeSelector: s,
    rootSelector: f,
    getCssVar: E,
    colorSchemes: M,
    font: {
      ...Ec(k.typography),
      ...k.font
    },
    spacing: Vc(p.spacing)
  };
  Object.keys(R.colorSchemes).forEach((re) => {
    const c = R.colorSchemes[re].palette, B = (U) => {
      const d = U.split("-"), l = d[1], S = d[2];
      return E(U, c[l][S]);
    };
    if (c.mode === "light" && (A(c.common, "background", "#fff"), A(c.common, "onBackground", "#000")), c.mode === "dark" && (A(c.common, "background", "#000"), A(c.common, "onBackground", "#fff")), Lc(c, ["Alert", "AppBar", "Avatar", "Button", "Chip", "FilledInput", "LinearProgress", "Skeleton", "Slider", "SnackbarContent", "SpeedDialAction", "StepConnector", "StepContent", "Switch", "TableCell", "Tooltip"]), c.mode === "light") {
      A(c.Alert, "errorColor", pe(c.error.light, 0.6)), A(c.Alert, "infoColor", pe(c.info.light, 0.6)), A(c.Alert, "successColor", pe(c.success.light, 0.6)), A(c.Alert, "warningColor", pe(c.warning.light, 0.6)), A(c.Alert, "errorFilledBg", B("palette-error-main")), A(c.Alert, "infoFilledBg", B("palette-info-main")), A(c.Alert, "successFilledBg", B("palette-success-main")), A(c.Alert, "warningFilledBg", B("palette-warning-main")), A(c.Alert, "errorFilledColor", Fe(() => c.getContrastText(c.error.main))), A(c.Alert, "infoFilledColor", Fe(() => c.getContrastText(c.info.main))), A(c.Alert, "successFilledColor", Fe(() => c.getContrastText(c.success.main))), A(c.Alert, "warningFilledColor", Fe(() => c.getContrastText(c.warning.main))), A(c.Alert, "errorStandardBg", me(c.error.light, 0.9)), A(c.Alert, "infoStandardBg", me(c.info.light, 0.9)), A(c.Alert, "successStandardBg", me(c.success.light, 0.9)), A(c.Alert, "warningStandardBg", me(c.warning.light, 0.9)), A(c.Alert, "errorIconColor", B("palette-error-main")), A(c.Alert, "infoIconColor", B("palette-info-main")), A(c.Alert, "successIconColor", B("palette-success-main")), A(c.Alert, "warningIconColor", B("palette-warning-main")), A(c.AppBar, "defaultBg", B("palette-grey-100")), A(c.Avatar, "defaultBg", B("palette-grey-400")), A(c.Button, "inheritContainedBg", B("palette-grey-300")), A(c.Button, "inheritContainedHoverBg", B("palette-grey-A100")), A(c.Chip, "defaultBorder", B("palette-grey-400")), A(c.Chip, "defaultAvatarColor", B("palette-grey-700")), A(c.Chip, "defaultIconColor", B("palette-grey-700")), A(c.FilledInput, "bg", "rgba(0, 0, 0, 0.06)"), A(c.FilledInput, "hoverBg", "rgba(0, 0, 0, 0.09)"), A(c.FilledInput, "disabledBg", "rgba(0, 0, 0, 0.12)"), A(c.LinearProgress, "primaryBg", me(c.primary.main, 0.62)), A(c.LinearProgress, "secondaryBg", me(c.secondary.main, 0.62)), A(c.LinearProgress, "errorBg", me(c.error.main, 0.62)), A(c.LinearProgress, "infoBg", me(c.info.main, 0.62)), A(c.LinearProgress, "successBg", me(c.success.main, 0.62)), A(c.LinearProgress, "warningBg", me(c.warning.main, 0.62)), A(c.Skeleton, "bg", `rgba(${B("palette-text-primaryChannel")} / 0.11)`), A(c.Slider, "primaryTrack", me(c.primary.main, 0.62)), A(c.Slider, "secondaryTrack", me(c.secondary.main, 0.62)), A(c.Slider, "errorTrack", me(c.error.main, 0.62)), A(c.Slider, "infoTrack", me(c.info.main, 0.62)), A(c.Slider, "successTrack", me(c.success.main, 0.62)), A(c.Slider, "warningTrack", me(c.warning.main, 0.62));
      const U = Ut(c.background.default, 0.8);
      A(c.SnackbarContent, "bg", U), A(c.SnackbarContent, "color", Fe(() => c.getContrastText(U))), A(c.SpeedDialAction, "fabHoverBg", Ut(c.background.paper, 0.15)), A(c.StepConnector, "border", B("palette-grey-400")), A(c.StepContent, "border", B("palette-grey-400")), A(c.Switch, "defaultColor", B("palette-common-white")), A(c.Switch, "defaultDisabledColor", B("palette-grey-100")), A(c.Switch, "primaryDisabledColor", me(c.primary.main, 0.62)), A(c.Switch, "secondaryDisabledColor", me(c.secondary.main, 0.62)), A(c.Switch, "errorDisabledColor", me(c.error.main, 0.62)), A(c.Switch, "infoDisabledColor", me(c.info.main, 0.62)), A(c.Switch, "successDisabledColor", me(c.success.main, 0.62)), A(c.Switch, "warningDisabledColor", me(c.warning.main, 0.62)), A(c.TableCell, "border", me(Wt(c.divider, 1), 0.88)), A(c.Tooltip, "bg", Wt(c.grey[700], 0.92));
    }
    if (c.mode === "dark") {
      A(c.Alert, "errorColor", me(c.error.light, 0.6)), A(c.Alert, "infoColor", me(c.info.light, 0.6)), A(c.Alert, "successColor", me(c.success.light, 0.6)), A(c.Alert, "warningColor", me(c.warning.light, 0.6)), A(c.Alert, "errorFilledBg", B("palette-error-dark")), A(c.Alert, "infoFilledBg", B("palette-info-dark")), A(c.Alert, "successFilledBg", B("palette-success-dark")), A(c.Alert, "warningFilledBg", B("palette-warning-dark")), A(c.Alert, "errorFilledColor", Fe(() => c.getContrastText(c.error.dark))), A(c.Alert, "infoFilledColor", Fe(() => c.getContrastText(c.info.dark))), A(c.Alert, "successFilledColor", Fe(() => c.getContrastText(c.success.dark))), A(c.Alert, "warningFilledColor", Fe(() => c.getContrastText(c.warning.dark))), A(c.Alert, "errorStandardBg", pe(c.error.light, 0.9)), A(c.Alert, "infoStandardBg", pe(c.info.light, 0.9)), A(c.Alert, "successStandardBg", pe(c.success.light, 0.9)), A(c.Alert, "warningStandardBg", pe(c.warning.light, 0.9)), A(c.Alert, "errorIconColor", B("palette-error-main")), A(c.Alert, "infoIconColor", B("palette-info-main")), A(c.Alert, "successIconColor", B("palette-success-main")), A(c.Alert, "warningIconColor", B("palette-warning-main")), A(c.AppBar, "defaultBg", B("palette-grey-900")), A(c.AppBar, "darkBg", B("palette-background-paper")), A(c.AppBar, "darkColor", B("palette-text-primary")), A(c.Avatar, "defaultBg", B("palette-grey-600")), A(c.Button, "inheritContainedBg", B("palette-grey-800")), A(c.Button, "inheritContainedHoverBg", B("palette-grey-700")), A(c.Chip, "defaultBorder", B("palette-grey-700")), A(c.Chip, "defaultAvatarColor", B("palette-grey-300")), A(c.Chip, "defaultIconColor", B("palette-grey-300")), A(c.FilledInput, "bg", "rgba(255, 255, 255, 0.09)"), A(c.FilledInput, "hoverBg", "rgba(255, 255, 255, 0.13)"), A(c.FilledInput, "disabledBg", "rgba(255, 255, 255, 0.12)"), A(c.LinearProgress, "primaryBg", pe(c.primary.main, 0.5)), A(c.LinearProgress, "secondaryBg", pe(c.secondary.main, 0.5)), A(c.LinearProgress, "errorBg", pe(c.error.main, 0.5)), A(c.LinearProgress, "infoBg", pe(c.info.main, 0.5)), A(c.LinearProgress, "successBg", pe(c.success.main, 0.5)), A(c.LinearProgress, "warningBg", pe(c.warning.main, 0.5)), A(c.Skeleton, "bg", `rgba(${B("palette-text-primaryChannel")} / 0.13)`), A(c.Slider, "primaryTrack", pe(c.primary.main, 0.5)), A(c.Slider, "secondaryTrack", pe(c.secondary.main, 0.5)), A(c.Slider, "errorTrack", pe(c.error.main, 0.5)), A(c.Slider, "infoTrack", pe(c.info.main, 0.5)), A(c.Slider, "successTrack", pe(c.success.main, 0.5)), A(c.Slider, "warningTrack", pe(c.warning.main, 0.5));
      const U = Ut(c.background.default, 0.98);
      A(c.SnackbarContent, "bg", U), A(c.SnackbarContent, "color", Fe(() => c.getContrastText(U))), A(c.SpeedDialAction, "fabHoverBg", Ut(c.background.paper, 0.15)), A(c.StepConnector, "border", B("palette-grey-600")), A(c.StepContent, "border", B("palette-grey-600")), A(c.Switch, "defaultColor", B("palette-grey-300")), A(c.Switch, "defaultDisabledColor", B("palette-grey-600")), A(c.Switch, "primaryDisabledColor", pe(c.primary.main, 0.55)), A(c.Switch, "secondaryDisabledColor", pe(c.secondary.main, 0.55)), A(c.Switch, "errorDisabledColor", pe(c.error.main, 0.55)), A(c.Switch, "infoDisabledColor", pe(c.info.main, 0.55)), A(c.Switch, "successDisabledColor", pe(c.success.main, 0.55)), A(c.Switch, "warningDisabledColor", pe(c.warning.main, 0.55)), A(c.TableCell, "border", pe(Wt(c.divider, 1), 0.68)), A(c.Tooltip, "bg", Wt(c.grey[700], 0.92));
    }
    Ue(c.background, "default"), Ue(c.background, "paper"), Ue(c.common, "background"), Ue(c.common, "onBackground"), Ue(c, "divider"), Object.keys(c).forEach((U) => {
      const d = c[U];
      U !== "tonalOffset" && d && typeof d == "object" && (d.main && A(c[U], "mainChannel", Tt(Ct(d.main))), d.light && A(c[U], "lightChannel", Tt(Ct(d.light))), d.dark && A(c[U], "darkChannel", Tt(Ct(d.dark))), d.contrastText && A(c[U], "contrastTextChannel", Tt(Ct(d.contrastText))), U === "text" && (Ue(c[U], "primary"), Ue(c[U], "secondary")), U === "action" && (d.active && Ue(c[U], "active"), d.selected && Ue(c[U], "selected")));
    });
  }), R = t.reduce((re, c) => Oe(re, c), R);
  const h = {
    prefix: i,
    disableCssColorScheme: o,
    shouldSkipGeneratingVar: a,
    getSelector: zc(R)
  }, {
    vars: F,
    generateThemeVars: V,
    generateStyleSheets: ee
  } = ic(R, h);
  return R.vars = F, Object.entries(R.colorSchemes[R.defaultColorScheme]).forEach(([re, c]) => {
    R[re] = c;
  }), R.generateThemeVars = V, R.generateStyleSheets = ee, R.generateSpacing = function() {
    return _o(p.spacing, mr(this));
  }, R.getColorSchemeSelector = ac(s), R.spacing = R.generateSpacing(), R.shouldSkipGeneratingVar = a, R.unstable_sxConfig = {
    ...Nt,
    ...p == null ? void 0 : p.unstable_sxConfig
  }, R.unstable_sx = function(c) {
    return mt({
      sx: c,
      theme: this
    });
  }, R.toRuntimeSource = Fo, R;
}
function to(e, t, r) {
  e.colorSchemes && r && (e.colorSchemes[t] = {
    ...r !== !0 && r,
    palette: on({
      ...r === !0 ? {} : r.palette,
      mode: t
    })
    // cast type to skip module augmentation test
  });
}
function Uc(e = {}, ...t) {
  const {
    palette: r,
    cssVariables: n = !1,
    colorSchemes: o = r ? void 0 : {
      light: !0
    },
    defaultColorScheme: i = r == null ? void 0 : r.mode,
    ...a
  } = e, s = i || "light", f = o == null ? void 0 : o[s], p = {
    ...o,
    ...r ? {
      [s]: {
        ...typeof f != "boolean" && f,
        palette: r
      }
    } : void 0
  };
  if (n === !1) {
    if (!("colorSchemes" in e))
      return zr(e, ...t);
    let b = r;
    "palette" in e || p[s] && (p[s] !== !0 ? b = p[s].palette : s === "dark" && (b = {
      mode: "dark"
    }));
    const y = zr({
      ...e,
      palette: b
    }, ...t);
    return y.defaultColorScheme = s, y.colorSchemes = p, y.palette.mode === "light" && (y.colorSchemes.light = {
      ...p.light !== !0 && p.light,
      palette: y.palette
    }, to(y, "dark", p.dark)), y.palette.mode === "dark" && (y.colorSchemes.dark = {
      ...p.dark !== !0 && p.dark,
      palette: y.palette
    }, to(y, "light", p.light)), y;
  }
  return !r && !("light" in p) && s === "light" && (p.light = !0), Wc({
    ...a,
    colorSchemes: p,
    defaultColorScheme: s,
    ...typeof n != "boolean" && n
  }, ...t);
}
const qc = Uc();
function Gc(e) {
  return e !== "ownerState" && e !== "theme" && e !== "sx" && e !== "as";
}
const Lo = (e) => Gc(e) && e !== "classes", gt = $o({
  themeId: ii,
  defaultTheme: qc,
  rootShouldForwardProp: Lo
}), Hc = tc;
process.env.NODE_ENV !== "production" && (v.node, v.object.isRequired);
function an(e) {
  return ec(e);
}
function Kc(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.includes(n)) continue;
    r[n] = e[n];
  }
  return r;
}
function Lr(e, t) {
  return Lr = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, n) {
    return r.__proto__ = n, r;
  }, Lr(e, t);
}
function Xc(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Lr(e, t);
}
const ro = et.createContext(null);
function Jc(e) {
  if (e === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function sn(e, t) {
  var r = function(i) {
    return t && qt(i) ? t(i) : i;
  }, n = /* @__PURE__ */ Object.create(null);
  return e && Zo.map(e, function(o) {
    return o;
  }).forEach(function(o) {
    n[o.key] = r(o);
  }), n;
}
function Qc(e, t) {
  e = e || {}, t = t || {};
  function r(b) {
    return b in t ? t[b] : e[b];
  }
  var n = /* @__PURE__ */ Object.create(null), o = [];
  for (var i in e)
    i in t ? o.length && (n[i] = o, o = []) : o.push(i);
  var a, s = {};
  for (var f in t) {
    if (n[f])
      for (a = 0; a < n[f].length; a++) {
        var p = n[f][a];
        s[n[f][a]] = r(p);
      }
    s[f] = r(f);
  }
  for (a = 0; a < o.length; a++)
    s[o[a]] = r(o[a]);
  return s;
}
function tt(e, t, r) {
  return r[t] != null ? r[t] : e.props[t];
}
function Zc(e, t) {
  return sn(e.children, function(r) {
    return Gt(r, {
      onExited: t.bind(null, r),
      in: !0,
      appear: tt(r, "appear", e),
      enter: tt(r, "enter", e),
      exit: tt(r, "exit", e)
    });
  });
}
function eu(e, t, r) {
  var n = sn(e.children), o = Qc(t, n);
  return Object.keys(o).forEach(function(i) {
    var a = o[i];
    if (qt(a)) {
      var s = i in t, f = i in n, p = t[i], b = qt(p) && !p.props.in;
      f && (!s || b) ? o[i] = Gt(a, {
        onExited: r.bind(null, a),
        in: !0,
        exit: tt(a, "exit", e),
        enter: tt(a, "enter", e)
      }) : !f && s && !b ? o[i] = Gt(a, {
        in: !1
      }) : f && s && qt(p) && (o[i] = Gt(a, {
        onExited: r.bind(null, a),
        in: p.props.in,
        exit: tt(a, "exit", e),
        enter: tt(a, "enter", e)
      }));
    }
  }), o;
}
var tu = Object.values || function(e) {
  return Object.keys(e).map(function(t) {
    return e[t];
  });
}, ru = {
  component: "div",
  childFactory: function(t) {
    return t;
  }
}, cn = /* @__PURE__ */ function(e) {
  Xc(t, e);
  function t(n, o) {
    var i;
    i = e.call(this, n, o) || this;
    var a = i.handleExited.bind(Jc(i));
    return i.state = {
      contextValue: {
        isMounting: !0
      },
      handleExited: a,
      firstRender: !0
    }, i;
  }
  var r = t.prototype;
  return r.componentDidMount = function() {
    this.mounted = !0, this.setState({
      contextValue: {
        isMounting: !1
      }
    });
  }, r.componentWillUnmount = function() {
    this.mounted = !1;
  }, t.getDerivedStateFromProps = function(o, i) {
    var a = i.children, s = i.handleExited, f = i.firstRender;
    return {
      children: f ? Zc(o, s) : eu(o, a, s),
      firstRender: !1
    };
  }, r.handleExited = function(o, i) {
    var a = sn(this.props.children);
    o.key in a || (o.props.onExited && o.props.onExited(i), this.mounted && this.setState(function(s) {
      var f = rr({}, s.children);
      return delete f[o.key], {
        children: f
      };
    }));
  }, r.render = function() {
    var o = this.props, i = o.component, a = o.childFactory, s = Kc(o, ["component", "childFactory"]), f = this.state.contextValue, p = tu(this.state.children).map(a);
    return delete s.appear, delete s.enter, delete s.exit, i === null ? /* @__PURE__ */ et.createElement(ro.Provider, {
      value: f
    }, p) : /* @__PURE__ */ et.createElement(ro.Provider, {
      value: f
    }, /* @__PURE__ */ et.createElement(i, s, p));
  }, t;
}(et.Component);
cn.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * `<TransitionGroup>` renders a `<div>` by default. You can change this
   * behavior by providing a `component` prop.
   * If you use React v16+ and would like to avoid a wrapping `<div>` element
   * you can pass in `component={null}`. This is useful if the wrapping div
   * borks your css styles.
   */
  component: v.any,
  /**
   * A set of `<Transition>` components, that are toggled `in` and out as they
   * leave. the `<TransitionGroup>` will inject specific transition props, so
   * remember to spread them through if you are wrapping the `<Transition>` as
   * with our `<Fade>` example.
   *
   * While this component is meant for multiple `Transition` or `CSSTransition`
   * children, sometimes you may want to have a single transition child with
   * content that you want to be transitioned out and in when you change it
   * (e.g. routes, images etc.) In that case you can change the `key` prop of
   * the transition child as you change its content, this will cause
   * `TransitionGroup` to transition the child out and back in.
   */
  children: v.node,
  /**
   * A convenience prop that enables or disables appear animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  appear: v.bool,
  /**
   * A convenience prop that enables or disables enter animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  enter: v.bool,
  /**
   * A convenience prop that enables or disables exit animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  exit: v.bool,
  /**
   * You may need to apply reactive updates to a child as it is exiting.
   * This is generally done by using `cloneElement` however in the case of an exiting
   * child the element has already been removed and not accessible to the consumer.
   *
   * If you do need to update a child as it leaves you can provide a `childFactory`
   * to wrap every child, even the ones that are leaving.
   *
   * @type Function(child: ReactElement) -> ReactElement
   */
  childFactory: v.func
} : {};
cn.defaultProps = ru;
class ir {
  constructor() {
    vt(this, "mountEffect", () => {
      this.shouldMount && !this.didMount && this.ref.current !== null && (this.didMount = !0, this.mounted.resolve());
    });
    this.ref = {
      current: null
    }, this.mounted = null, this.didMount = !1, this.shouldMount = !1, this.setShouldMount = null;
  }
  /** React ref to the ripple instance */
  /** If the ripple component should be mounted */
  /** Promise that resolves when the ripple component is mounted */
  /** If the ripple component has been mounted */
  /** React state hook setter */
  static create() {
    return new ir();
  }
  static use() {
    const t = No(ir.create).current, [r, n] = H.useState(!1);
    return t.shouldMount = r, t.setShouldMount = n, H.useEffect(t.mountEffect, [r]), t;
  }
  mount() {
    return this.mounted || (this.mounted = ou(), this.shouldMount = !0, this.setShouldMount(this.shouldMount)), this.mounted;
  }
  /* Ripple API */
  start(...t) {
    this.mount().then(() => {
      var r;
      return (r = this.ref.current) == null ? void 0 : r.start(...t);
    });
  }
  stop(...t) {
    this.mount().then(() => {
      var r;
      return (r = this.ref.current) == null ? void 0 : r.stop(...t);
    });
  }
  pulsate(...t) {
    this.mount().then(() => {
      var r;
      return (r = this.ref.current) == null ? void 0 : r.pulsate(...t);
    });
  }
}
function nu() {
  return ir.use();
}
function ou() {
  let e, t;
  const r = new Promise((n, o) => {
    e = n, t = o;
  });
  return r.resolve = e, r.reject = t, r;
}
function Vo(e) {
  const {
    className: t,
    classes: r,
    pulsate: n = !1,
    rippleX: o,
    rippleY: i,
    rippleSize: a,
    in: s,
    onExited: f,
    timeout: p
  } = e, [b, y] = H.useState(!1), E = Pe(t, r.ripple, r.rippleVisible, n && r.ripplePulsate), $ = {
    width: a,
    height: a,
    top: -(a / 2) + i,
    left: -(a / 2) + o
  }, C = Pe(r.child, b && r.childLeaving, n && r.childPulsate);
  return !s && !b && y(!0), H.useEffect(() => {
    if (!s && f != null) {
      const u = setTimeout(f, p);
      return () => {
        clearTimeout(u);
      };
    }
  }, [f, s, p]), /* @__PURE__ */ Ee.jsx("span", {
    className: E,
    style: $,
    children: /* @__PURE__ */ Ee.jsx("span", {
      className: C
    })
  });
}
process.env.NODE_ENV !== "production" && (Vo.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: v.object.isRequired,
  className: v.string,
  /**
   * @ignore - injected from TransitionGroup
   */
  in: v.bool,
  /**
   * @ignore - injected from TransitionGroup
   */
  onExited: v.func,
  /**
   * If `true`, the ripple pulsates, typically indicating the keyboard focus state of an element.
   */
  pulsate: v.bool,
  /**
   * Diameter of the ripple.
   */
  rippleSize: v.number,
  /**
   * Horizontal position of the ripple center.
   */
  rippleX: v.number,
  /**
   * Vertical position of the ripple center.
   */
  rippleY: v.number,
  /**
   * exit delay
   */
  timeout: v.number.isRequired
});
const ke = Qr("MuiTouchRipple", ["root", "ripple", "rippleVisible", "ripplePulsate", "child", "childLeaving", "childPulsate"]), Vr = 550, iu = 80, au = Kr`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`, su = Kr`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`, cu = Kr`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`, uu = gt("span", {
  name: "MuiTouchRipple",
  slot: "Root"
})({
  overflow: "hidden",
  pointerEvents: "none",
  position: "absolute",
  zIndex: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  borderRadius: "inherit"
}), lu = gt(Vo, {
  name: "MuiTouchRipple",
  slot: "Ripple"
})`
  opacity: 0;
  position: absolute;

  &.${ke.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${au};
    animation-duration: ${Vr}ms;
    animation-timing-function: ${({
  theme: e
}) => e.transitions.easing.easeInOut};
  }

  &.${ke.ripplePulsate} {
    animation-duration: ${({
  theme: e
}) => e.transitions.duration.shorter}ms;
  }

  & .${ke.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${ke.childLeaving} {
    opacity: 0;
    animation-name: ${su};
    animation-duration: ${Vr}ms;
    animation-timing-function: ${({
  theme: e
}) => e.transitions.easing.easeInOut};
  }

  & .${ke.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${cu};
    animation-duration: 2500ms;
    animation-timing-function: ${({
  theme: e
}) => e.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`, Yo = /* @__PURE__ */ H.forwardRef(function(t, r) {
  const n = an({
    props: t,
    name: "MuiTouchRipple"
  }), {
    center: o = !1,
    classes: i = {},
    className: a,
    ...s
  } = n, [f, p] = H.useState([]), b = H.useRef(0), y = H.useRef(null);
  H.useEffect(() => {
    y.current && (y.current(), y.current = null);
  }, [f]);
  const E = H.useRef(!1), $ = Js(), C = H.useRef(null), u = H.useRef(null), P = H.useCallback((R) => {
    const {
      pulsate: h,
      rippleX: F,
      rippleY: V,
      rippleSize: ee,
      cb: re
    } = R;
    p((c) => [...c, /* @__PURE__ */ Ee.jsx(lu, {
      classes: {
        ripple: Pe(i.ripple, ke.ripple),
        rippleVisible: Pe(i.rippleVisible, ke.rippleVisible),
        ripplePulsate: Pe(i.ripplePulsate, ke.ripplePulsate),
        child: Pe(i.child, ke.child),
        childLeaving: Pe(i.childLeaving, ke.childLeaving),
        childPulsate: Pe(i.childPulsate, ke.childPulsate)
      },
      timeout: Vr,
      pulsate: h,
      rippleX: F,
      rippleY: V,
      rippleSize: ee
    }, b.current)]), b.current += 1, y.current = re;
  }, [i]), M = H.useCallback((R = {}, h = {}, F = () => {
  }) => {
    const {
      pulsate: V = !1,
      center: ee = o || h.pulsate,
      fakeElement: re = !1
      // For test purposes
    } = h;
    if ((R == null ? void 0 : R.type) === "mousedown" && E.current) {
      E.current = !1;
      return;
    }
    (R == null ? void 0 : R.type) === "touchstart" && (E.current = !0);
    const c = re ? null : u.current, B = c ? c.getBoundingClientRect() : {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    };
    let U, d, l;
    if (ee || R === void 0 || R.clientX === 0 && R.clientY === 0 || !R.clientX && !R.touches)
      U = Math.round(B.width / 2), d = Math.round(B.height / 2);
    else {
      const {
        clientX: S,
        clientY: m
      } = R.touches && R.touches.length > 0 ? R.touches[0] : R;
      U = Math.round(S - B.left), d = Math.round(m - B.top);
    }
    if (ee)
      l = Math.sqrt((2 * B.width ** 2 + B.height ** 2) / 3), l % 2 === 0 && (l += 1);
    else {
      const S = Math.max(Math.abs((c ? c.clientWidth : 0) - U), U) * 2 + 2, m = Math.max(Math.abs((c ? c.clientHeight : 0) - d), d) * 2 + 2;
      l = Math.sqrt(S ** 2 + m ** 2);
    }
    R != null && R.touches ? C.current === null && (C.current = () => {
      P({
        pulsate: V,
        rippleX: U,
        rippleY: d,
        rippleSize: l,
        cb: F
      });
    }, $.start(iu, () => {
      C.current && (C.current(), C.current = null);
    })) : P({
      pulsate: V,
      rippleX: U,
      rippleY: d,
      rippleSize: l,
      cb: F
    });
  }, [o, P, $]), Y = H.useCallback(() => {
    M({}, {
      pulsate: !0
    });
  }, [M]), k = H.useCallback((R, h) => {
    if ($.clear(), (R == null ? void 0 : R.type) === "touchend" && C.current) {
      C.current(), C.current = null, $.start(0, () => {
        k(R, h);
      });
      return;
    }
    C.current = null, p((F) => F.length > 0 ? F.slice(1) : F), y.current = h;
  }, [$]);
  return H.useImperativeHandle(r, () => ({
    pulsate: Y,
    start: M,
    stop: k
  }), [Y, M, k]), /* @__PURE__ */ Ee.jsx(uu, {
    className: Pe(ke.root, i.root, a),
    ref: u,
    ...s,
    children: /* @__PURE__ */ Ee.jsx(cn, {
      component: null,
      exit: !0,
      children: f
    })
  });
});
process.env.NODE_ENV !== "production" && (Yo.propTypes = {
  /**
   * If `true`, the ripple starts at the center of the component
   * rather than at the point of interaction.
   */
  center: v.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: v.object,
  /**
   * @ignore
   */
  className: v.string
});
function fu(e) {
  return It("MuiButtonBase", e);
}
const du = Qr("MuiButtonBase", ["root", "disabled", "focusVisible"]), pu = (e) => {
  const {
    disabled: t,
    focusVisible: r,
    focusVisibleClassName: n,
    classes: o
  } = e, a = nn({
    root: ["root", t && "disabled", r && "focusVisible"]
  }, fu, o);
  return r && n && (a.root += ` ${n}`), a;
}, mu = gt("button", {
  name: "MuiButtonBase",
  slot: "Root",
  overridesResolver: (e, t) => t.root
})({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxSizing: "border-box",
  WebkitTapHighlightColor: "transparent",
  backgroundColor: "transparent",
  // Reset default value
  // We disable the focus ring for mouse, touch and keyboard users.
  outline: 0,
  border: 0,
  margin: 0,
  // Remove the margin in Safari
  borderRadius: 0,
  padding: 0,
  // Remove the padding in Firefox
  cursor: "pointer",
  userSelect: "none",
  verticalAlign: "middle",
  MozAppearance: "none",
  // Reset
  WebkitAppearance: "none",
  // Reset
  textDecoration: "none",
  // So we take precedent over the style of a native <a /> element.
  color: "inherit",
  "&::-moz-focus-inner": {
    borderStyle: "none"
    // Remove Firefox dotted outline.
  },
  [`&.${du.disabled}`]: {
    pointerEvents: "none",
    // Disable link interactions
    cursor: "default"
  },
  "@media print": {
    colorAdjust: "exact"
  }
}), Wo = /* @__PURE__ */ H.forwardRef(function(t, r) {
  const n = an({
    props: t,
    name: "MuiButtonBase"
  }), {
    action: o,
    centerRipple: i = !1,
    children: a,
    className: s,
    component: f = "button",
    disabled: p = !1,
    disableRipple: b = !1,
    disableTouchRipple: y = !1,
    focusRipple: E = !1,
    focusVisibleClassName: $,
    LinkComponent: C = "a",
    onBlur: u,
    onClick: P,
    onContextMenu: M,
    onDragLeave: Y,
    onFocus: k,
    onFocusVisible: R,
    onKeyDown: h,
    onKeyUp: F,
    onMouseDown: V,
    onMouseLeave: ee,
    onMouseUp: re,
    onTouchEnd: c,
    onTouchMove: B,
    onTouchStart: U,
    tabIndex: d = 0,
    TouchRippleProps: l,
    touchRippleRef: S,
    type: m,
    ...O
  } = n, j = H.useRef(null), L = nu(), T = Un(L.ref, S), [_, I] = H.useState(!1);
  p && _ && I(!1), H.useImperativeHandle(o, () => ({
    focusVisible: () => {
      I(!0), j.current.focus();
    }
  }), []);
  const D = L.shouldMount && !b && !p;
  H.useEffect(() => {
    _ && E && !b && L.pulsate();
  }, [b, E, _, L]);
  const W = qe(L, "start", V, y), z = qe(L, "stop", M, y), K = qe(L, "stop", Y, y), X = qe(L, "stop", re, y), J = qe(L, "stop", (N) => {
    _ && N.preventDefault(), ee && ee(N);
  }, y), Q = qe(L, "start", U, y), q = qe(L, "stop", c, y), te = qe(L, "stop", B, y), w = qe(L, "stop", (N) => {
    Gn(N.target) || I(!1), u && u(N);
  }, !1), le = Qt((N) => {
    j.current || (j.current = N.currentTarget), Gn(N.target) && (I(!0), R && R(N)), k && k(N);
  }), we = () => {
    const N = j.current;
    return f && f !== "button" && !(N.tagName === "A" && N.href);
  }, je = Qt((N) => {
    E && !N.repeat && _ && N.key === " " && L.stop(N, () => {
      L.start(N);
    }), N.target === N.currentTarget && we() && N.key === " " && N.preventDefault(), h && h(N), N.target === N.currentTarget && we() && N.key === "Enter" && !p && (N.preventDefault(), P && P(N));
  }), wr = Qt((N) => {
    E && N.key === " " && _ && !N.defaultPrevented && L.stop(N, () => {
      L.pulsate(N);
    }), F && F(N), P && N.target === N.currentTarget && we() && N.key === " " && !N.defaultPrevented && P(N);
  });
  let Qe = f;
  Qe === "button" && (O.href || O.to) && (Qe = C);
  const Ge = {};
  Qe === "button" ? (Ge.type = m === void 0 ? "button" : m, Ge.disabled = p) : (!O.href && !O.to && (Ge.role = "button"), p && (Ge["aria-disabled"] = p));
  const jt = Un(r, j), yt = {
    ...n,
    centerRipple: i,
    component: f,
    disabled: p,
    disableRipple: b,
    disableTouchRipple: y,
    focusRipple: E,
    tabIndex: d,
    focusVisible: _
  }, g = pu(yt);
  return /* @__PURE__ */ Ee.jsxs(mu, {
    as: Qe,
    className: Pe(g.root, s),
    ownerState: yt,
    onBlur: w,
    onClick: P,
    onContextMenu: z,
    onFocus: le,
    onKeyDown: je,
    onKeyUp: wr,
    onMouseDown: W,
    onMouseLeave: J,
    onMouseUp: X,
    onDragLeave: K,
    onTouchEnd: q,
    onTouchMove: te,
    onTouchStart: Q,
    ref: jt,
    tabIndex: p ? -1 : d,
    type: m,
    ...Ge,
    ...O,
    children: [a, D ? /* @__PURE__ */ Ee.jsx(Yo, {
      ref: T,
      center: i,
      ...l
    }) : null]
  });
});
function qe(e, t, r, n = !1) {
  return Qt((o) => (r && r(o), n || e[t](o), !0));
}
process.env.NODE_ENV !== "production" && (Wo.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * A ref for imperative actions.
   * It currently only supports `focusVisible()` action.
   */
  action: Gs,
  /**
   * If `true`, the ripples are centered.
   * They won't start at the cursor interaction position.
   * @default false
   */
  centerRipple: v.bool,
  /**
   * The content of the component.
   */
  children: v.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: v.object,
  /**
   * @ignore
   */
  className: v.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: qs,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: v.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: v.bool,
  /**
   * If `true`, the touch ripple effect is disabled.
   * @default false
   */
  disableTouchRipple: v.bool,
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * @default false
   */
  focusRipple: v.bool,
  /**
   * This prop can help identify which element has keyboard focus.
   * The class name will be applied when the element gains the focus through keyboard interaction.
   * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
   * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
   * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
   * if needed.
   */
  focusVisibleClassName: v.string,
  /**
   * @ignore
   */
  href: v.any,
  /**
   * The component used to render a link when the `href` prop is provided.
   * @default 'a'
   */
  LinkComponent: v.elementType,
  /**
   * @ignore
   */
  onBlur: v.func,
  /**
   * @ignore
   */
  onClick: v.func,
  /**
   * @ignore
   */
  onContextMenu: v.func,
  /**
   * @ignore
   */
  onDragLeave: v.func,
  /**
   * @ignore
   */
  onFocus: v.func,
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible: v.func,
  /**
   * @ignore
   */
  onKeyDown: v.func,
  /**
   * @ignore
   */
  onKeyUp: v.func,
  /**
   * @ignore
   */
  onMouseDown: v.func,
  /**
   * @ignore
   */
  onMouseLeave: v.func,
  /**
   * @ignore
   */
  onMouseUp: v.func,
  /**
   * @ignore
   */
  onTouchEnd: v.func,
  /**
   * @ignore
   */
  onTouchMove: v.func,
  /**
   * @ignore
   */
  onTouchStart: v.func,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: v.oneOfType([v.arrayOf(v.oneOfType([v.func, v.object, v.bool])), v.func, v.object]),
  /**
   * @default 0
   */
  tabIndex: v.number,
  /**
   * Props applied to the `TouchRipple` element.
   */
  TouchRippleProps: v.object,
  /**
   * A ref that points to the `TouchRipple` element.
   */
  touchRippleRef: v.oneOfType([v.func, v.shape({
    current: v.shape({
      pulsate: v.func.isRequired,
      start: v.func.isRequired,
      stop: v.func.isRequired
    })
  })]),
  /**
   * @ignore
   */
  type: v.oneOfType([v.oneOf(["button", "reset", "submit"]), v.string])
});
function hu(e) {
  return typeof e.main == "string";
}
function gu(e, t = []) {
  if (!hu(e))
    return !1;
  for (const r of t)
    if (!e.hasOwnProperty(r) || typeof e[r] != "string")
      return !1;
  return !0;
}
function yu(e = []) {
  return ([, t]) => t && gu(t, e);
}
function bu(e) {
  return It("MuiButton", e);
}
const ut = Qr("MuiButton", ["root", "text", "textInherit", "textPrimary", "textSecondary", "textSuccess", "textError", "textInfo", "textWarning", "outlined", "outlinedInherit", "outlinedPrimary", "outlinedSecondary", "outlinedSuccess", "outlinedError", "outlinedInfo", "outlinedWarning", "contained", "containedInherit", "containedPrimary", "containedSecondary", "containedSuccess", "containedError", "containedInfo", "containedWarning", "disableElevation", "focusVisible", "disabled", "colorInherit", "colorPrimary", "colorSecondary", "colorSuccess", "colorError", "colorInfo", "colorWarning", "textSizeSmall", "textSizeMedium", "textSizeLarge", "outlinedSizeSmall", "outlinedSizeMedium", "outlinedSizeLarge", "containedSizeSmall", "containedSizeMedium", "containedSizeLarge", "sizeMedium", "sizeSmall", "sizeLarge", "fullWidth", "startIcon", "endIcon", "icon", "iconSizeSmall", "iconSizeMedium", "iconSizeLarge"]), Uo = /* @__PURE__ */ H.createContext({});
process.env.NODE_ENV !== "production" && (Uo.displayName = "ButtonGroupContext");
const qo = /* @__PURE__ */ H.createContext(void 0);
process.env.NODE_ENV !== "production" && (qo.displayName = "ButtonGroupButtonContext");
const vu = (e) => {
  const {
    color: t,
    disableElevation: r,
    fullWidth: n,
    size: o,
    variant: i,
    classes: a
  } = e, s = {
    root: ["root", i, `${i}${Re(t)}`, `size${Re(o)}`, `${i}Size${Re(o)}`, `color${Re(t)}`, r && "disableElevation", n && "fullWidth"],
    label: ["label"],
    startIcon: ["icon", "startIcon", `iconSize${Re(o)}`],
    endIcon: ["icon", "endIcon", `iconSize${Re(o)}`]
  }, f = nn(s, bu, a);
  return {
    ...a,
    // forward the focused, disabled, etc. classes to the ButtonBase
    ...f
  };
}, Go = [{
  props: {
    size: "small"
  },
  style: {
    "& > *:nth-of-type(1)": {
      fontSize: 18
    }
  }
}, {
  props: {
    size: "medium"
  },
  style: {
    "& > *:nth-of-type(1)": {
      fontSize: 20
    }
  }
}, {
  props: {
    size: "large"
  },
  style: {
    "& > *:nth-of-type(1)": {
      fontSize: 22
    }
  }
}], Su = gt(Wo, {
  shouldForwardProp: (e) => Lo(e) || e === "classes",
  name: "MuiButton",
  slot: "Root",
  overridesResolver: (e, t) => {
    const {
      ownerState: r
    } = e;
    return [t.root, t[r.variant], t[`${r.variant}${Re(r.color)}`], t[`size${Re(r.size)}`], t[`${r.variant}Size${Re(r.size)}`], r.color === "inherit" && t.colorInherit, r.disableElevation && t.disableElevation, r.fullWidth && t.fullWidth];
  }
})(Hc(({
  theme: e
}) => {
  const t = e.palette.mode === "light" ? e.palette.grey[300] : e.palette.grey[800], r = e.palette.mode === "light" ? e.palette.grey.A100 : e.palette.grey[700];
  return {
    ...e.typography.button,
    minWidth: 64,
    padding: "6px 16px",
    border: 0,
    borderRadius: (e.vars || e).shape.borderRadius,
    transition: e.transitions.create(["background-color", "box-shadow", "border-color", "color"], {
      duration: e.transitions.duration.short
    }),
    "&:hover": {
      textDecoration: "none"
    },
    [`&.${ut.disabled}`]: {
      color: (e.vars || e).palette.action.disabled
    },
    variants: [{
      props: {
        variant: "contained"
      },
      style: {
        color: "var(--variant-containedColor)",
        backgroundColor: "var(--variant-containedBg)",
        boxShadow: (e.vars || e).shadows[2],
        "&:hover": {
          boxShadow: (e.vars || e).shadows[4],
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            boxShadow: (e.vars || e).shadows[2]
          }
        },
        "&:active": {
          boxShadow: (e.vars || e).shadows[8]
        },
        [`&.${ut.focusVisible}`]: {
          boxShadow: (e.vars || e).shadows[6]
        },
        [`&.${ut.disabled}`]: {
          color: (e.vars || e).palette.action.disabled,
          boxShadow: (e.vars || e).shadows[0],
          backgroundColor: (e.vars || e).palette.action.disabledBackground
        }
      }
    }, {
      props: {
        variant: "outlined"
      },
      style: {
        padding: "5px 15px",
        border: "1px solid currentColor",
        borderColor: "var(--variant-outlinedBorder, currentColor)",
        backgroundColor: "var(--variant-outlinedBg)",
        color: "var(--variant-outlinedColor)",
        [`&.${ut.disabled}`]: {
          border: `1px solid ${(e.vars || e).palette.action.disabledBackground}`
        }
      }
    }, {
      props: {
        variant: "text"
      },
      style: {
        padding: "6px 8px",
        color: "var(--variant-textColor)",
        backgroundColor: "var(--variant-textBg)"
      }
    }, ...Object.entries(e.palette).filter(yu()).map(([n]) => ({
      props: {
        color: n
      },
      style: {
        "--variant-textColor": (e.vars || e).palette[n].main,
        "--variant-outlinedColor": (e.vars || e).palette[n].main,
        "--variant-outlinedBorder": e.vars ? `rgba(${e.vars.palette[n].mainChannel} / 0.5)` : lt(e.palette[n].main, 0.5),
        "--variant-containedColor": (e.vars || e).palette[n].contrastText,
        "--variant-containedBg": (e.vars || e).palette[n].main,
        "@media (hover: hover)": {
          "&:hover": {
            "--variant-containedBg": (e.vars || e).palette[n].dark,
            "--variant-textBg": e.vars ? `rgba(${e.vars.palette[n].mainChannel} / ${e.vars.palette.action.hoverOpacity})` : lt(e.palette[n].main, e.palette.action.hoverOpacity),
            "--variant-outlinedBorder": (e.vars || e).palette[n].main,
            "--variant-outlinedBg": e.vars ? `rgba(${e.vars.palette[n].mainChannel} / ${e.vars.palette.action.hoverOpacity})` : lt(e.palette[n].main, e.palette.action.hoverOpacity)
          }
        }
      }
    })), {
      props: {
        color: "inherit"
      },
      style: {
        color: "inherit",
        borderColor: "currentColor",
        "--variant-containedBg": e.vars ? e.vars.palette.Button.inheritContainedBg : t,
        "@media (hover: hover)": {
          "&:hover": {
            "--variant-containedBg": e.vars ? e.vars.palette.Button.inheritContainedHoverBg : r,
            "--variant-textBg": e.vars ? `rgba(${e.vars.palette.text.primaryChannel} / ${e.vars.palette.action.hoverOpacity})` : lt(e.palette.text.primary, e.palette.action.hoverOpacity),
            "--variant-outlinedBg": e.vars ? `rgba(${e.vars.palette.text.primaryChannel} / ${e.vars.palette.action.hoverOpacity})` : lt(e.palette.text.primary, e.palette.action.hoverOpacity)
          }
        }
      }
    }, {
      props: {
        size: "small",
        variant: "text"
      },
      style: {
        padding: "4px 5px",
        fontSize: e.typography.pxToRem(13)
      }
    }, {
      props: {
        size: "large",
        variant: "text"
      },
      style: {
        padding: "8px 11px",
        fontSize: e.typography.pxToRem(15)
      }
    }, {
      props: {
        size: "small",
        variant: "outlined"
      },
      style: {
        padding: "3px 9px",
        fontSize: e.typography.pxToRem(13)
      }
    }, {
      props: {
        size: "large",
        variant: "outlined"
      },
      style: {
        padding: "7px 21px",
        fontSize: e.typography.pxToRem(15)
      }
    }, {
      props: {
        size: "small",
        variant: "contained"
      },
      style: {
        padding: "4px 10px",
        fontSize: e.typography.pxToRem(13)
      }
    }, {
      props: {
        size: "large",
        variant: "contained"
      },
      style: {
        padding: "8px 22px",
        fontSize: e.typography.pxToRem(15)
      }
    }, {
      props: {
        disableElevation: !0
      },
      style: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none"
        },
        [`&.${ut.focusVisible}`]: {
          boxShadow: "none"
        },
        "&:active": {
          boxShadow: "none"
        },
        [`&.${ut.disabled}`]: {
          boxShadow: "none"
        }
      }
    }, {
      props: {
        fullWidth: !0
      },
      style: {
        width: "100%"
      }
    }]
  };
})), Eu = gt("span", {
  name: "MuiButton",
  slot: "StartIcon",
  overridesResolver: (e, t) => {
    const {
      ownerState: r
    } = e;
    return [t.startIcon, t[`iconSize${Re(r.size)}`]];
  }
})({
  display: "inherit",
  marginRight: 8,
  marginLeft: -4,
  variants: [{
    props: {
      size: "small"
    },
    style: {
      marginLeft: -2
    }
  }, ...Go]
}), wu = gt("span", {
  name: "MuiButton",
  slot: "EndIcon",
  overridesResolver: (e, t) => {
    const {
      ownerState: r
    } = e;
    return [t.endIcon, t[`iconSize${Re(r.size)}`]];
  }
})({
  display: "inherit",
  marginRight: -4,
  marginLeft: 8,
  variants: [{
    props: {
      size: "small"
    },
    style: {
      marginRight: -2
    }
  }, ...Go]
}), Ho = /* @__PURE__ */ H.forwardRef(function(t, r) {
  const n = H.useContext(Uo), o = H.useContext(qo), i = $t(n, t), a = an({
    props: i,
    name: "MuiButton"
  }), {
    children: s,
    color: f = "primary",
    component: p = "button",
    className: b,
    disabled: y = !1,
    disableElevation: E = !1,
    disableFocusRipple: $ = !1,
    endIcon: C,
    focusVisibleClassName: u,
    fullWidth: P = !1,
    size: M = "medium",
    startIcon: Y,
    type: k,
    variant: R = "text",
    ...h
  } = a, F = {
    ...a,
    color: f,
    component: p,
    disabled: y,
    disableElevation: E,
    disableFocusRipple: $,
    fullWidth: P,
    size: M,
    type: k,
    variant: R
  }, V = vu(F), ee = Y && /* @__PURE__ */ Ee.jsx(Eu, {
    className: V.startIcon,
    ownerState: F,
    children: Y
  }), re = C && /* @__PURE__ */ Ee.jsx(wu, {
    className: V.endIcon,
    ownerState: F,
    children: C
  }), c = o || "";
  return /* @__PURE__ */ Ee.jsxs(Su, {
    ownerState: F,
    className: Pe(n.className, V.root, b, c),
    component: p,
    disabled: y,
    focusRipple: !$,
    focusVisibleClassName: Pe(V.focusVisible, u),
    ref: r,
    type: k,
    ...h,
    classes: V,
    children: [ee, s, re]
  });
});
process.env.NODE_ENV !== "production" && (Ho.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: v.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: v.object,
  /**
   * @ignore
   */
  className: v.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * @default 'primary'
   */
  color: v.oneOfType([v.oneOf(["inherit", "primary", "secondary", "success", "error", "info", "warning"]), v.string]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: v.elementType,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: v.bool,
  /**
   * If `true`, no elevation is used.
   * @default false
   */
  disableElevation: v.bool,
  /**
   * If `true`, the  keyboard focus ripple is disabled.
   * @default false
   */
  disableFocusRipple: v.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: v.bool,
  /**
   * Element placed after the children.
   */
  endIcon: v.node,
  /**
   * @ignore
   */
  focusVisibleClassName: v.string,
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth: v.bool,
  /**
   * The URL to link to when the button is clicked.
   * If defined, an `a` element will be used as the root node.
   */
  href: v.string,
  /**
   * The size of the component.
   * `small` is equivalent to the dense button styling.
   * @default 'medium'
   */
  size: v.oneOfType([v.oneOf(["small", "medium", "large"]), v.string]),
  /**
   * Element placed before the children.
   */
  startIcon: v.node,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: v.oneOfType([v.arrayOf(v.oneOfType([v.func, v.object, v.bool])), v.func, v.object]),
  /**
   * @ignore
   */
  type: v.oneOfType([v.oneOf(["button", "reset", "submit"]), v.string]),
  /**
   * The variant to use.
   * @default 'text'
   */
  variant: v.oneOfType([v.oneOf(["contained", "outlined", "text"]), v.string])
});
const xu = async (e) => {
  var f;
  const t = new AudioContext();
  t.state === "suspended" && (await t.resume(), console.log("Audio context resumed after user gesture."));
  const n = (await navigator.mediaDevices.enumerateDevices()).filter((p) => p.kind === "audioinput");
  console.log("Available microphones:", n);
  const o = (f = n[0]) == null ? void 0 : f.deviceId;
  if (!o)
    throw new Error("No microphone devices available");
  const i = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: { exact: o }
    }
  });
  console.log("Audio stream captured from microphone:", i);
  const a = t.createMediaStreamSource(i), s = t.createAnalyser();
  return s.fftSize = 2048, a.connect(s), { audioCtx: t, stream: i, analyserNode: s, mics: n };
}, Tu = (e) => {
  const [t, r] = et.useState({
    analyserNode: void 0
  });
  return er(() => {
    e && !t.analyserNode && xu(
      // "e18767886adb9583a29268deeae90b9e36fcfb273504d3a9893f40d604aa6c71"
    ).then(({ analyserNode: n }) => {
      r((o) => ({ ...o, analyserNode: n }));
    });
  }, [e]), t.analyserNode;
};
var Zt = { exports: {} }, Cu = Zt.exports, no;
function _u() {
  return no || (no = 1, function(e, t) {
    (function(r, n) {
      e.exports = n();
    })(Cu, function() {
      function r(d, l, S) {
        for (var m, O = 0, j = l.length; O < j; O++) !m && O in l || (m || (m = Array.prototype.slice.call(l, 0, O)), m[O] = l[O]);
        return d.concat(m || Array.prototype.slice.call(l));
      }
      var n = Object.freeze({ __proto__: null, blackman: function(d) {
        for (var l = new Float32Array(d), S = 2 * Math.PI / (d - 1), m = 2 * S, O = 0; O < d / 2; O++) l[O] = 0.42 - 0.5 * Math.cos(O * S) + 0.08 * Math.cos(O * m);
        for (O = Math.ceil(d / 2); O > 0; O--) l[d - O] = l[O - 1];
        return l;
      }, hamming: function(d) {
        for (var l = new Float32Array(d), S = 0; S < d; S++) l[S] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (S / d - 1));
        return l;
      }, hanning: function(d) {
        for (var l = new Float32Array(d), S = 0; S < d; S++) l[S] = 0.5 - 0.5 * Math.cos(2 * Math.PI * S / (d - 1));
        return l;
      }, sine: function(d) {
        for (var l = Math.PI / (d - 1), S = new Float32Array(d), m = 0; m < d; m++) S[m] = Math.sin(l * m);
        return S;
      } }), o = {};
      function i(d) {
        for (; d % 2 == 0 && d > 1; ) d /= 2;
        return d === 1;
      }
      function a(d, l) {
        if (l !== "rect") {
          if (l !== "" && l || (l = "hanning"), o[l] || (o[l] = {}), !o[l][d.length]) try {
            o[l][d.length] = n[l](d.length);
          } catch {
            throw new Error("Invalid windowing function");
          }
          d = function(S, m) {
            for (var O = [], j = 0; j < Math.min(S.length, m.length); j++) O[j] = S[j] * m[j];
            return O;
          }(d, o[l][d.length]);
        }
        return d;
      }
      function s(d, l, S) {
        for (var m = new Float32Array(d), O = 0; O < m.length; O++) m[O] = O * l / S, m[O] = 13 * Math.atan(m[O] / 1315.8) + 3.5 * Math.atan(Math.pow(m[O] / 7518, 2));
        return m;
      }
      function f(d) {
        return Float32Array.from(d);
      }
      function p(d) {
        return 1125 * Math.log(1 + d / 700);
      }
      function b(d, l, S) {
        for (var m, O = new Float32Array(d + 2), j = new Float32Array(d + 2), L = l / 2, T = p(0), _ = (p(L) - T) / (d + 1), I = new Array(d + 2), D = 0; D < O.length; D++) O[D] = D * _, j[D] = (m = O[D], 700 * (Math.exp(m / 1125) - 1)), I[D] = Math.floor((S + 1) * j[D] / l);
        for (var W = new Array(d), z = 0; z < W.length; z++) {
          for (W[z] = new Array(S / 2 + 1).fill(0), D = I[z]; D < I[z + 1]; D++) W[z][D] = (D - I[z]) / (I[z + 1] - I[z]);
          for (D = I[z + 1]; D < I[z + 2]; D++) W[z][D] = (I[z + 2] - D) / (I[z + 2] - I[z + 1]);
        }
        return W;
      }
      function y(d, l, S, m, O, j, L) {
        m === void 0 && (m = 5), O === void 0 && (O = 2), j === void 0 && (j = !0), L === void 0 && (L = 440);
        var T = Math.floor(S / 2) + 1, _ = new Array(S).fill(0).map(function(q, te) {
          return d * function(w, le) {
            return Math.log2(16 * w / le);
          }(l * te / S, L);
        });
        _[0] = _[1] - 1.5 * d;
        var I, D, W, z = _.slice(1).map(function(q, te) {
          return Math.max(q - _[te]);
        }, 1).concat([1]), K = Math.round(d / 2), X = new Array(d).fill(0).map(function(q, te) {
          return _.map(function(w) {
            return (10 * d + K + w - te) % d - K;
          });
        }), J = X.map(function(q, te) {
          return q.map(function(w, le) {
            return Math.exp(-0.5 * Math.pow(2 * X[te][le] / z[le], 2));
          });
        });
        if (D = (I = J)[0].map(function() {
          return 0;
        }), W = I.reduce(function(q, te) {
          return te.forEach(function(w, le) {
            q[le] += Math.pow(w, 2);
          }), q;
        }, D).map(Math.sqrt), J = I.map(function(q, te) {
          return q.map(function(w, le) {
            return w / (W[le] || 1);
          });
        }), O) {
          var Q = _.map(function(q) {
            return Math.exp(-0.5 * Math.pow((q / d - m) / O, 2));
          });
          J = J.map(function(q) {
            return q.map(function(te, w) {
              return te * Q[w];
            });
          });
        }
        return j && (J = r(r([], J.slice(3), !0), J.slice(0, 3))), J.map(function(q) {
          return q.slice(0, T);
        });
      }
      function E(d, l) {
        for (var S = 0, m = 0, O = 0; O < l.length; O++) S += Math.pow(O, d) * Math.abs(l[O]), m += l[O];
        return S / m;
      }
      function $(d) {
        var l = d.ampSpectrum, S = d.barkScale, m = d.numberOfBarkBands, O = m === void 0 ? 24 : m;
        if (typeof l != "object" || typeof S != "object") throw new TypeError();
        var j = O, L = new Float32Array(j), T = 0, _ = l, I = new Int32Array(j + 1);
        I[0] = 0;
        for (var D = S[_.length - 1] / j, W = 1, z = 0; z < _.length; z++) for (; S[z] > D; ) I[W++] = z, D = W * S[_.length - 1] / j;
        for (I[j] = _.length - 1, z = 0; z < j; z++) {
          for (var K = 0, X = I[z]; X < I[z + 1]; X++) K += _[X];
          L[z] = Math.pow(K, 0.23);
        }
        for (z = 0; z < L.length; z++) T += L[z];
        return { specific: L, total: T };
      }
      function C(d) {
        var l = d.ampSpectrum;
        if (typeof l != "object") throw new TypeError();
        for (var S = new Float32Array(l.length), m = 0; m < S.length; m++) S[m] = Math.pow(l[m], 2);
        return S;
      }
      function u(d) {
        var l = d.ampSpectrum, S = d.melFilterBank, m = d.bufferSize;
        if (typeof l != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
        if (typeof S != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
        for (var O = C({ ampSpectrum: l }), j = S.length, L = Array(j), T = new Float32Array(j), _ = 0; _ < T.length; _++) {
          L[_] = new Float32Array(m / 2), T[_] = 0;
          for (var I = 0; I < m / 2; I++) L[_][I] = S[_][I] * O[I], T[_] += L[_][I];
          T[_] = Math.log(T[_] + 1);
        }
        return Array.prototype.slice.call(T);
      }
      function P(d) {
        return d.__esModule && Object.prototype.hasOwnProperty.call(d, "default") ? d.default : d;
      }
      var M = null, Y = P(function(d, l) {
        var S = d.length;
        return l = l || 2, M && M[S] || function(m) {
          (M = M || {})[m] = new Array(m * m);
          for (var O = Math.PI / m, j = 0; j < m; j++) for (var L = 0; L < m; L++) M[m][L + j * m] = Math.cos(O * (L + 0.5) * j);
        }(S), d.map(function() {
          return 0;
        }).map(function(m, O) {
          return l * d.reduce(function(j, L, T, _) {
            return j + L * M[S][T + O * S];
          }, 0);
        });
      }), k = Object.freeze({ __proto__: null, amplitudeSpectrum: function(d) {
        return d.ampSpectrum;
      }, buffer: function(d) {
        return d.signal;
      }, chroma: function(d) {
        var l = d.ampSpectrum, S = d.chromaFilterBank;
        if (typeof l != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
        if (typeof S != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
        var m = S.map(function(j, L) {
          return l.reduce(function(T, _, I) {
            return T + _ * j[I];
          }, 0);
        }), O = Math.max.apply(Math, m);
        return O ? m.map(function(j) {
          return j / O;
        }) : m;
      }, complexSpectrum: function(d) {
        return d.complexSpectrum;
      }, energy: function(d) {
        var l = d.signal;
        if (typeof l != "object") throw new TypeError();
        for (var S = 0, m = 0; m < l.length; m++) S += Math.pow(Math.abs(l[m]), 2);
        return S;
      }, loudness: $, melBands: u, mfcc: function(d) {
        var l = d.ampSpectrum, S = d.melFilterBank, m = d.numberOfMFCCCoefficients, O = d.bufferSize, j = Math.min(40, Math.max(1, m || 13));
        if (S.length < j) throw new Error("Insufficient filter bank for requested number of coefficients");
        var L = u({ ampSpectrum: l, melFilterBank: S, bufferSize: O });
        return Y(L).slice(0, j);
      }, perceptualSharpness: function(d) {
        for (var l = $({ ampSpectrum: d.ampSpectrum, barkScale: d.barkScale }), S = l.specific, m = 0, O = 0; O < S.length; O++) m += O < 15 ? (O + 1) * S[O + 1] : 0.066 * Math.exp(0.171 * (O + 1));
        return m *= 0.11 / l.total;
      }, perceptualSpread: function(d) {
        for (var l = $({ ampSpectrum: d.ampSpectrum, barkScale: d.barkScale }), S = 0, m = 0; m < l.specific.length; m++) l.specific[m] > S && (S = l.specific[m]);
        return Math.pow((l.total - S) / l.total, 2);
      }, powerSpectrum: C, rms: function(d) {
        var l = d.signal;
        if (typeof l != "object") throw new TypeError();
        for (var S = 0, m = 0; m < l.length; m++) S += Math.pow(l[m], 2);
        return S /= l.length, S = Math.sqrt(S);
      }, spectralCentroid: function(d) {
        var l = d.ampSpectrum;
        if (typeof l != "object") throw new TypeError();
        return E(1, l);
      }, spectralCrest: function(d) {
        var l = d.ampSpectrum;
        if (typeof l != "object") throw new TypeError();
        var S = 0, m = -1 / 0;
        return l.forEach(function(O) {
          S += Math.pow(O, 2), m = O > m ? O : m;
        }), S /= l.length, S = Math.sqrt(S), m / S;
      }, spectralFlatness: function(d) {
        var l = d.ampSpectrum;
        if (typeof l != "object") throw new TypeError();
        for (var S = 0, m = 0, O = 0; O < l.length; O++) S += Math.log(l[O]), m += l[O];
        return Math.exp(S / l.length) * l.length / m;
      }, spectralFlux: function(d) {
        var l = d.signal, S = d.previousSignal, m = d.bufferSize;
        if (typeof l != "object" || typeof S != "object") throw new TypeError();
        for (var O = 0, j = -m / 2; j < l.length / 2 - 1; j++) x = Math.abs(l[j]) - Math.abs(S[j]), O += (x + Math.abs(x)) / 2;
        return O;
      }, spectralKurtosis: function(d) {
        var l = d.ampSpectrum;
        if (typeof l != "object") throw new TypeError();
        var S = l, m = E(1, S), O = E(2, S), j = E(3, S), L = E(4, S);
        return (-3 * Math.pow(m, 4) + 6 * m * O - 4 * m * j + L) / Math.pow(Math.sqrt(O - Math.pow(m, 2)), 4);
      }, spectralRolloff: function(d) {
        var l = d.ampSpectrum, S = d.sampleRate;
        if (typeof l != "object") throw new TypeError();
        for (var m = l, O = S / (2 * (m.length - 1)), j = 0, L = 0; L < m.length; L++) j += m[L];
        for (var T = 0.99 * j, _ = m.length - 1; j > T && _ >= 0; ) j -= m[_], --_;
        return (_ + 1) * O;
      }, spectralSkewness: function(d) {
        var l = d.ampSpectrum;
        if (typeof l != "object") throw new TypeError();
        var S = E(1, l), m = E(2, l), O = E(3, l);
        return (2 * Math.pow(S, 3) - 3 * S * m + O) / Math.pow(Math.sqrt(m - Math.pow(S, 2)), 3);
      }, spectralSlope: function(d) {
        var l = d.ampSpectrum, S = d.sampleRate, m = d.bufferSize;
        if (typeof l != "object") throw new TypeError();
        for (var O = 0, j = 0, L = new Float32Array(l.length), T = 0, _ = 0, I = 0; I < l.length; I++) {
          O += l[I];
          var D = I * S / m;
          L[I] = D, T += D * D, j += D, _ += D * l[I];
        }
        return (l.length * _ - j * O) / (O * (T - Math.pow(j, 2)));
      }, spectralSpread: function(d) {
        var l = d.ampSpectrum;
        if (typeof l != "object") throw new TypeError();
        return Math.sqrt(E(2, l) - Math.pow(E(1, l), 2));
      }, zcr: function(d) {
        var l = d.signal;
        if (typeof l != "object") throw new TypeError();
        for (var S = 0, m = 1; m < l.length; m++) (l[m - 1] >= 0 && l[m] < 0 || l[m - 1] < 0 && l[m] >= 0) && S++;
        return S;
      } });
      function R(d) {
        if (Array.isArray(d)) {
          for (var l = 0, S = Array(d.length); l < d.length; l++) S[l] = d[l];
          return S;
        }
        return Array.from(d);
      }
      var h = {}, F = {}, V = { bitReverseArray: function(d) {
        if (h[d] === void 0) {
          for (var l = (d - 1).toString(2).length, S = "0".repeat(l), m = {}, O = 0; O < d; O++) {
            var j = O.toString(2);
            j = S.substr(j.length) + j, j = [].concat(R(j)).reverse().join(""), m[O] = parseInt(j, 2);
          }
          h[d] = m;
        }
        return h[d];
      }, multiply: function(d, l) {
        return { real: d.real * l.real - d.imag * l.imag, imag: d.real * l.imag + d.imag * l.real };
      }, add: function(d, l) {
        return { real: d.real + l.real, imag: d.imag + l.imag };
      }, subtract: function(d, l) {
        return { real: d.real - l.real, imag: d.imag - l.imag };
      }, euler: function(d, l) {
        var S = -2 * Math.PI * d / l;
        return { real: Math.cos(S), imag: Math.sin(S) };
      }, conj: function(d) {
        return d.imag *= -1, d;
      }, constructComplexArray: function(d) {
        var l = {};
        l.real = d.real === void 0 ? d.slice() : d.real.slice();
        var S = l.real.length;
        return F[S] === void 0 && (F[S] = Array.apply(null, Array(S)).map(Number.prototype.valueOf, 0)), l.imag = F[S].slice(), l;
      } }, ee = function(d) {
        var l = {};
        d.real === void 0 || d.imag === void 0 ? l = V.constructComplexArray(d) : (l.real = d.real.slice(), l.imag = d.imag.slice());
        var S = l.real.length, m = Math.log2(S);
        if (Math.round(m) != m) throw new Error("Input size must be a power of 2.");
        if (l.real.length != l.imag.length) throw new Error("Real and imaginary components must have the same length.");
        for (var O = V.bitReverseArray(S), j = { real: [], imag: [] }, L = 0; L < S; L++) j.real[O[L]] = l.real[L], j.imag[O[L]] = l.imag[L];
        for (var T = 0; T < S; T++) l.real[T] = j.real[T], l.imag[T] = j.imag[T];
        for (var _ = 1; _ <= m; _++) for (var I = Math.pow(2, _), D = 0; D < I / 2; D++) for (var W = V.euler(D, I), z = 0; z < S / I; z++) {
          var K = I * z + D, X = I * z + D + I / 2, J = { real: l.real[K], imag: l.imag[K] }, Q = { real: l.real[X], imag: l.imag[X] }, q = V.multiply(W, Q), te = V.subtract(J, q);
          l.real[X] = te.real, l.imag[X] = te.imag;
          var w = V.add(q, J);
          l.real[K] = w.real, l.imag[K] = w.imag;
        }
        return l;
      }, re = ee, c = function() {
        function d(l, S) {
          var m = this;
          if (this._m = S, !l.audioContext) throw this._m.errors.noAC;
          if (l.bufferSize && !i(l.bufferSize)) throw this._m._errors.notPow2;
          if (!l.source) throw this._m._errors.noSource;
          this._m.audioContext = l.audioContext, this._m.bufferSize = l.bufferSize || this._m.bufferSize || 256, this._m.hopSize = l.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = l.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = l.callback, this._m.windowingFunction = l.windowingFunction || "hanning", this._m.featureExtractors = k, this._m.EXTRACTION_STARTED = l.startImmediately || !1, this._m.channel = typeof l.channel == "number" ? l.channel : 0, this._m.inputs = l.inputs || 1, this._m.outputs = l.outputs || 1, this._m.numberOfMFCCCoefficients = l.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = l.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = l.featureExtractors || [], this._m.barkScale = s(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = b(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(l.source), this._m.spn.onaudioprocess = function(O) {
            var j;
            m._m.inputData !== null && (m._m.previousInputData = m._m.inputData), m._m.inputData = O.inputBuffer.getChannelData(m._m.channel), m._m.previousInputData ? ((j = new Float32Array(m._m.previousInputData.length + m._m.inputData.length - m._m.hopSize)).set(m._m.previousInputData.slice(m._m.hopSize)), j.set(m._m.inputData, m._m.previousInputData.length - m._m.hopSize)) : j = m._m.inputData;
            var L = function(T, _, I) {
              if (T.length < _) throw new Error("Buffer is too short for frame length");
              if (I < 1) throw new Error("Hop length cannot be less that 1");
              if (_ < 1) throw new Error("Frame length cannot be less that 1");
              var D = 1 + Math.floor((T.length - _) / I);
              return new Array(D).fill(0).map(function(W, z) {
                return T.slice(z * I, z * I + _);
              });
            }(j, m._m.bufferSize, m._m.hopSize);
            L.forEach(function(T) {
              m._m.frame = T;
              var _ = m._m.extract(m._m._featuresToExtract, m._m.frame, m._m.previousFrame);
              typeof m._m.callback == "function" && m._m.EXTRACTION_STARTED && m._m.callback(_), m._m.previousFrame = m._m.frame;
            });
          };
        }
        return d.prototype.start = function(l) {
          this._m._featuresToExtract = l || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
        }, d.prototype.stop = function() {
          this._m.EXTRACTION_STARTED = !1;
        }, d.prototype.setSource = function(l) {
          this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = l, this._m.source.connect(this._m.spn);
        }, d.prototype.setChannel = function(l) {
          l <= this._m.inputs ? this._m.channel = l : console.error("Channel ".concat(l, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(l, " when instantiating the MeydaAnalyzer"));
        }, d.prototype.get = function(l) {
          return this._m.inputData ? this._m.extract(l || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
        }, d;
      }(), B = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: k, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: a, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(d) {
        return new c(d, Object.assign({}, B));
      }, listAvailableFeatureExtractors: function() {
        return Object.keys(this.featureExtractors);
      }, extract: function(d, l, S) {
        var m = this;
        if (!l) throw this._errors.invalidInput;
        if (typeof l != "object") throw this._errors.invalidInput;
        if (!d) throw this._errors.featureUndef;
        if (!i(l.length)) throw this._errors.notPow2;
        this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = s(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = b(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = y(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in l && l.buffer === void 0 ? this.signal = f(l) : this.signal = l;
        var O = U(l, this.windowingFunction, this.bufferSize);
        if (this.signal = O.windowedSignal, this.complexSpectrum = O.complexSpectrum, this.ampSpectrum = O.ampSpectrum, S) {
          var j = U(S, this.windowingFunction, this.bufferSize);
          this.previousSignal = j.windowedSignal, this.previousComplexSpectrum = j.complexSpectrum, this.previousAmpSpectrum = j.ampSpectrum;
        }
        var L = function(T) {
          return m.featureExtractors[T]({ ampSpectrum: m.ampSpectrum, chromaFilterBank: m.chromaFilterBank, complexSpectrum: m.complexSpectrum, signal: m.signal, bufferSize: m.bufferSize, sampleRate: m.sampleRate, barkScale: m.barkScale, melFilterBank: m.melFilterBank, previousSignal: m.previousSignal, previousAmpSpectrum: m.previousAmpSpectrum, previousComplexSpectrum: m.previousComplexSpectrum, numberOfMFCCCoefficients: m.numberOfMFCCCoefficients, numberOfBarkBands: m.numberOfBarkBands });
        };
        if (typeof d == "object") return d.reduce(function(T, _) {
          var I;
          return Object.assign({}, T, ((I = {})[_] = L(_), I));
        }, {});
        if (typeof d == "string") return L(d);
        throw this._errors.invalidFeatureFmt;
      } }, U = function(d, l, S) {
        var m = {};
        d.buffer === void 0 ? m.signal = f(d) : m.signal = d, m.windowedSignal = a(m.signal, l), m.complexSpectrum = re(m.windowedSignal), m.ampSpectrum = new Float32Array(S / 2);
        for (var O = 0; O < S / 2; O++) m.ampSpectrum[O] = Math.sqrt(Math.pow(m.complexSpectrum.real[O], 2) + Math.pow(m.complexSpectrum.imag[O], 2));
        return m;
      };
      return typeof window < "u" && (window.Meyda = B), B;
    });
  }(Zt)), Zt.exports;
}
var Ou = _u();
const Ru = /* @__PURE__ */ oo(Ou), Au = (e, t) => {
  const r = Ru.createMeydaAnalyzer({
    audioContext: e.context,
    source: e,
    bufferSize: 512,
    featureExtractors: [
      "mfcc",
      "rms",
      "spectralCentroid",
      "spectralFlatness",
      "energy"
    ],
    // callback,
    callback: (n) => {
      const o = Pu(n);
      t(o);
    }
  });
  return r.start(), console.log("Meyda initialized"), r;
};
function Pu(e) {
  const { mfcc: t, rms: r, spectralCentroid: n } = e;
  return {
    AA: r && t ? Math.min(r * (t[0] || 0), 1) : 0,
    // Broad mouth opening
    EE: t ? Math.min(t[5] || 0, 1) : 0,
    // High frequency for EE
    IH: t ? Math.min(t[3] || 0, 1) : 0,
    // Mid-range frequency for IH
    OH: t ? Math.min(t[2] || 0, 1) : 0,
    // Lower mid-range for OH
    OU: t ? Math.min((t[0] + t[5]) / 2, 1) : 0,
    // Combination for OU
    W: n && n > 1500 ? 1 : 0,
    // W (rounded)
    UW: n && n > 1e3 ? 1 : 0,
    // UW
    TH: n && n > 2e3 ? 1 : 0,
    // TH
    T: n && n > 2500 ? 1 : 0,
    // T
    SH: n && n > 5e3 ? 1 : 0,
    // SH
    S: n && n > 4e3 ? 1 : 0,
    // S
    OW: t ? Math.min((t[0] + t[5]) / 2, 1) : 0,
    // OW
    M: r && t ? Math.min(r * (t[0] || 0), 1) : 0,
    // M (nasal)
    L: t ? Math.min(t[2] || 0, 1) : 0,
    // L (liquid sound)
    K: n && n > 3e3 ? 1 : 0,
    // K
    IY: t ? Math.min(t[4] || 0, 1) : 0,
    // IY
    F: n && n > 6e3 ? 1 : 0,
    // F
    ER: t ? Math.min(t[1] || 0, 1) : 0,
    // ER
    EH: t ? Math.min(t[2] || 0, 1) : 0,
    // EH
    TONGUE_UP_DOWN: t ? Math.min(t[6] || 0, 1) : 0,
    // Placeholder for tongue movement
    TONGUE_IN_OUT: n && n > 1500 ? 1 : 0,
    // Placeholder
    MOUTH_WIDE_NARROW: r && r > 0.5 ? 1 : 0,
    // Placeholder for mouth wide/narrow
    MOUTH_OPEN: r && r > 0.3 ? 1 : 0
    // Placeholder for mouth open
  };
}
const $u = ({ name: e, value: t }) => {
  const r = ei(null), [n, o] = tr(0), [i, a] = tr(1);
  return er(() => {
    t && (t < n && o(t), t > i && a(t));
  }, [t, n, i]), er(() => {
    const s = r.current;
    if (s) {
      const f = s.getContext("2d", { willReadFrequently: !0 });
      if (f) {
        const p = f.getImageData(
          1,
          0,
          s.width - 1,
          s.height
        );
        f.putImageData(p, 0, 0), f.clearRect(s.width - 1, 0, 1, s.height);
        const b = i - n || 1, y = (t - n) / b, E = s.height - y * s.height;
        f.lineWidth = 5, f.beginPath(), f.moveTo(s.width - 2, E), f.lineTo(s.width - 1, E), f.strokeStyle = "green", f.stroke();
      }
    }
  }, [t, n, i]), /* @__PURE__ */ Ee.jsxs("div", { children: [
    /* @__PURE__ */ Ee.jsx("h4", { children: e }),
    /* @__PURE__ */ Ee.jsx("canvas", { ref: r, width: 300, height: 100 }),
    /* @__PURE__ */ Ee.jsxs("p", { children: [
      "Min: ",
      n.toFixed(2),
      " | Max: ",
      i.toFixed(2),
      " | Current:",
      " ",
      t.toFixed(2)
    ] })
  ] });
}, Mu = ({
  analyserNode: e
}) => {
  const [t, r] = tr({});
  return er(() => {
    if (!e)
      return;
    const n = Au(e, (o) => {
      r(o);
    });
    return () => {
      n.stop();
    };
  }, [e]), /* @__PURE__ */ Ee.jsx(
    "div",
    {
      style: { border: "1px solid white", maxHeight: "80vh", overflow: "auto" },
      children: Object.entries(t).map(([n, o]) => /* @__PURE__ */ Ee.jsx($u, { name: n, value: o }, n))
    }
  );
}, Iu = () => {
  const [e, t] = tr(!1), r = Tu(e);
  return /* @__PURE__ */ Ee.jsxs(Io, { spacing: 2, children: [
    /* @__PURE__ */ Ee.jsx(
      Ho,
      {
        variant: "contained",
        color: "primary",
        onClick: () => {
          console.log("Start button clicked"), t((n) => !n);
        },
        children: "Start"
      }
    ),
    /* @__PURE__ */ Ee.jsx(Mu, { analyserNode: r })
  ] });
};
export {
  Iu as StartButton
};
