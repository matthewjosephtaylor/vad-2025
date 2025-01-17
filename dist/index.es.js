import require$$0$1, { useEffect, useRef, useState } from "react";
const getMicAudio = async (C) => {
  var f;
  const u = new AudioContext();
  u.state === "suspended" && (await u.resume(), console.log("Audio context resumed after user gesture."));
  const h = (await navigator.mediaDevices.enumerateDevices()).filter((a) => a.kind === "audioinput");
  console.log("Available microphones:", h);
  const p = C || ((f = h[0]) == null ? void 0 : f.deviceId);
  if (!p)
    throw new Error("No microphone devices available");
  const g = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: { exact: p }
    }
  });
  console.log("Audio stream captured from microphone:", g);
  const o = u.createMediaStreamSource(g), c = u.createAnalyser();
  return c.fftSize = 2048, o.connect(c), { audioCtx: u, stream: g, analyserNode: c, mics: h };
};
async function getMicrophoneInput() {
  try {
    const C = await navigator.mediaDevices.getUserMedia({ audio: !0 }), u = new AudioContext(), b = u.createMediaStreamSource(C);
    return { audioContext: u, source: b, stream: C };
  } catch (C) {
    throw new Error("Unable to access microphone", { cause: C });
  }
}
function getDefaultExportFromCjs(C) {
  return C && C.__esModule && Object.prototype.hasOwnProperty.call(C, "default") ? C.default : C;
}
function getAugmentedNamespace(C) {
  if (C.__esModule) return C;
  var u = C.default;
  if (typeof u == "function") {
    var b = function h() {
      return this instanceof h ? Reflect.construct(u, arguments, this.constructor) : u.apply(this, arguments);
    };
    b.prototype = u.prototype;
  } else b = {};
  return Object.defineProperty(b, "__esModule", { value: !0 }), Object.keys(C).forEach(function(h) {
    var p = Object.getOwnPropertyDescriptor(C, h);
    Object.defineProperty(b, h, p.get ? p : {
      enumerable: !0,
      get: function() {
        return C[h];
      }
    });
  }), b;
}
var dist = {}, ortWeb_min = { exports: {} };
const backends = {}, backendsSortedByPriority = [], registerBackend = (C, u, b) => {
  if (u && typeof u.init == "function" && typeof u.createSessionHandler == "function") {
    const h = backends[C];
    if (h === void 0)
      backends[C] = { backend: u, priority: b };
    else {
      if (h.priority > b)
        return;
      if (h.priority === b && h.backend !== u)
        throw new Error(`cannot register backend "${C}" using priority ${b}`);
    }
    if (b >= 0) {
      const p = backendsSortedByPriority.indexOf(C);
      p !== -1 && backendsSortedByPriority.splice(p, 1);
      for (let g = 0; g < backendsSortedByPriority.length; g++)
        if (backends[backendsSortedByPriority[g]].priority <= b) {
          backendsSortedByPriority.splice(g, 0, C);
          return;
        }
      backendsSortedByPriority.push(C);
    }
    return;
  }
  throw new TypeError("not a valid backend");
}, resolveBackend = async (C) => {
  const u = C.length === 0 ? backendsSortedByPriority : C, b = [];
  for (const h of u) {
    const p = backends[h];
    if (p) {
      if (p.initialized)
        return p.backend;
      if (p.aborted)
        continue;
      const g = !!p.initPromise;
      try {
        return g || (p.initPromise = p.backend.init()), await p.initPromise, p.initialized = !0, p.backend;
      } catch (o) {
        g || b.push({ name: h, err: o }), p.aborted = !0;
      } finally {
        delete p.initPromise;
      }
    }
  }
  throw new Error(`no available backend found. ERR: ${b.map((h) => `[${h.name}] ${h.err}`).join(", ")}`);
};
class EnvImpl {
  constructor() {
    this.wasm = {}, this.webgl = {}, this.logLevelInternal = "warning";
  }
  // TODO standadize the getter and setter convention in env for other fields.
  set logLevel(u) {
    if (u !== void 0) {
      if (typeof u != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(u) === -1)
        throw new Error(`Unsupported logging level: ${u}`);
      this.logLevelInternal = u;
    }
  }
  get logLevel() {
    return this.logLevelInternal;
  }
}
const env = new EnvImpl(), isBigInt64ArrayAvailable = typeof BigInt64Array < "u" && typeof BigInt64Array.from == "function", isBigUint64ArrayAvailable = typeof BigUint64Array < "u" && typeof BigUint64Array.from == "function", NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP = /* @__PURE__ */ new Map([
  ["float32", Float32Array],
  ["uint8", Uint8Array],
  ["int8", Int8Array],
  ["uint16", Uint16Array],
  ["int16", Int16Array],
  ["int32", Int32Array],
  ["bool", Uint8Array],
  ["float64", Float64Array],
  ["uint32", Uint32Array]
]), NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP = /* @__PURE__ */ new Map([
  [Float32Array, "float32"],
  [Uint8Array, "uint8"],
  [Int8Array, "int8"],
  [Uint16Array, "uint16"],
  [Int16Array, "int16"],
  [Int32Array, "int32"],
  [Float64Array, "float64"],
  [Uint32Array, "uint32"]
]);
isBigInt64ArrayAvailable && (NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("int64", BigInt64Array), NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(BigInt64Array, "int64"));
isBigUint64ArrayAvailable && (NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("uint64", BigUint64Array), NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(BigUint64Array, "uint64"));
const calculateSize = (C) => {
  let u = 1;
  for (let b = 0; b < C.length; b++) {
    const h = C[b];
    if (typeof h != "number" || !Number.isSafeInteger(h))
      throw new TypeError(`dims[${b}] must be an integer, got: ${h}`);
    if (h < 0)
      throw new RangeError(`dims[${b}] must be a non-negative integer, got: ${h}`);
    u *= h;
  }
  return u;
};
let Tensor$1 = class Ot {
  constructor(u, b, h) {
    let p, g, o;
    if (typeof u == "string")
      if (p = u, o = h, u === "string") {
        if (!Array.isArray(b))
          throw new TypeError("A string tensor's data must be a string array.");
        g = b;
      } else {
        const f = NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.get(u);
        if (f === void 0)
          throw new TypeError(`Unsupported tensor type: ${u}.`);
        if (Array.isArray(b))
          g = f.from(b);
        else if (b instanceof f)
          g = b;
        else
          throw new TypeError(`A ${p} tensor's data must be type of ${f}`);
      }
    else if (o = b, Array.isArray(u)) {
      if (u.length === 0)
        throw new TypeError("Tensor type cannot be inferred from an empty array.");
      const f = typeof u[0];
      if (f === "string")
        p = "string", g = u;
      else if (f === "boolean")
        p = "bool", g = Uint8Array.from(u);
      else
        throw new TypeError(`Invalid element type of data array: ${f}.`);
    } else {
      const f = NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.get(u.constructor);
      if (f === void 0)
        throw new TypeError(`Unsupported type for tensor data: ${u.constructor}.`);
      p = f, g = u;
    }
    if (o === void 0)
      o = [g.length];
    else if (!Array.isArray(o))
      throw new TypeError("A tensor's dims must be a number array");
    const c = calculateSize(o);
    if (c !== g.length)
      throw new Error(`Tensor's size(${c}) does not match data length(${g.length}).`);
    this.dims = o, this.type = p, this.data = g, this.size = c;
  }
  // #endregion
  /**
   * Create a new tensor object from image object
   *
   * @param buffer - Extracted image buffer data - assuming RGBA format
   * @param imageFormat - input image configuration - required configurations height, width, format
   * @param tensorFormat - output tensor configuration - Default is RGB format
   */
  static bufferToTensor(u, b) {
    if (u === void 0)
      throw new Error("Image buffer must be defined");
    if (b.height === void 0 || b.width === void 0)
      throw new Error("Image height and width must be defined");
    const { height: h, width: p } = b, g = b.norm;
    let o, c;
    g === void 0 || g.mean === void 0 ? o = 255 : o = g.mean, g === void 0 || g.bias === void 0 ? c = 0 : c = g.bias;
    const f = b.bitmapFormat !== void 0 ? b.bitmapFormat : "RGBA", a = b.tensorFormat !== void 0 && b.tensorFormat !== void 0 ? b.tensorFormat : "RGB", i = h * p, t = a === "RGBA" ? new Float32Array(i * 4) : new Float32Array(i * 3);
    let e = 4, n = 0, r = 1, s = 2, l = 3, d = 0, m = i, y = i * 2, w = -1;
    f === "RGB" && (e = 3, n = 0, r = 1, s = 2, l = -1), a === "RGBA" ? w = i * 3 : a === "RBG" ? (d = 0, y = i, m = i * 2) : a === "BGR" && (y = 0, m = i, d = i * 2);
    for (let S = 0; S < i; S++, n += e, s += e, r += e, l += e)
      t[d++] = (u[n] + c) / o, t[m++] = (u[r] + c) / o, t[y++] = (u[s] + c) / o, w !== -1 && l !== -1 && (t[w++] = (u[l] + c) / o);
    return a === "RGBA" ? new Ot("float32", t, [1, 4, h, p]) : new Ot("float32", t, [1, 3, h, p]);
  }
  static async fromImage(u, b) {
    const h = typeof HTMLImageElement < "u" && u instanceof HTMLImageElement, p = typeof ImageData < "u" && u instanceof ImageData, g = typeof ImageBitmap < "u" && u instanceof ImageBitmap, o = typeof String < "u" && (u instanceof String || typeof u == "string");
    let c, f = {};
    if (h) {
      const a = document.createElement("canvas"), i = a.getContext("2d");
      if (i != null) {
        let t = u.naturalHeight, e = u.naturalWidth;
        if (b !== void 0 && b.resizedHeight !== void 0 && b.resizedWidth !== void 0 && (t = b.resizedHeight, e = b.resizedWidth), b !== void 0) {
          if (f = b, b.tensorFormat !== void 0)
            throw new Error("Image input config format must be RGBA for HTMLImageElement");
          if (f.tensorFormat = "RGBA", b.height !== void 0 && b.height !== t)
            throw new Error("Image input config height doesn't match HTMLImageElement height");
          if (f.height = t, b.width !== void 0 && b.width !== e)
            throw new Error("Image input config width doesn't match HTMLImageElement width");
          f.width = e;
        } else
          f.tensorFormat = "RGBA", f.height = t, f.width = e;
        a.width = e, a.height = t, i.drawImage(u, 0, 0, e, t), c = i.getImageData(0, 0, e, t).data;
      } else
        throw new Error("Can not access image data");
    } else if (p) {
      const a = "RGBA";
      let i, t;
      if (b !== void 0 && b.resizedWidth !== void 0 && b.resizedHeight !== void 0 ? (i = b.resizedHeight, t = b.resizedWidth) : (i = u.height, t = u.width), b !== void 0) {
        if (f = b, b.bitmapFormat !== void 0 && b.bitmapFormat !== a)
          throw new Error("Image input config format must be RGBA for ImageData");
        f.bitmapFormat = "RGBA";
      } else
        f.bitmapFormat = "RGBA";
      if (f.height = i, f.width = t, b !== void 0) {
        const e = document.createElement("canvas");
        e.width = t, e.height = i;
        const n = e.getContext("2d");
        if (n != null)
          n.putImageData(u, 0, 0), c = n.getImageData(0, 0, t, i).data;
        else
          throw new Error("Can not access image data");
      } else
        c = u.data;
    } else if (g) {
      if (b === void 0)
        throw new Error("Please provide image config with format for Imagebitmap");
      if (b.bitmapFormat !== void 0)
        throw new Error("Image input config format must be defined for ImageBitmap");
      const a = document.createElement("canvas").getContext("2d");
      if (a != null) {
        const i = u.height, t = u.width;
        if (a.drawImage(u, 0, 0, t, i), c = a.getImageData(0, 0, t, i).data, b !== void 0) {
          if (b.height !== void 0 && b.height !== i)
            throw new Error("Image input config height doesn't match ImageBitmap height");
          if (f.height = i, b.width !== void 0 && b.width !== t)
            throw new Error("Image input config width doesn't match ImageBitmap width");
          f.width = t;
        } else
          f.height = i, f.width = t;
        return Ot.bufferToTensor(c, f);
      } else
        throw new Error("Can not access image data");
    } else {
      if (o)
        return new Promise((a, i) => {
          const t = document.createElement("canvas"), e = t.getContext("2d");
          if (!u || !e)
            return i();
          const n = new Image();
          n.crossOrigin = "Anonymous", n.src = u, n.onload = () => {
            t.width = n.width, t.height = n.height, e.drawImage(n, 0, 0, t.width, t.height);
            const r = e.getImageData(0, 0, t.width, t.height);
            if (b !== void 0) {
              if (b.height !== void 0 && b.height !== t.height)
                throw new Error("Image input config height doesn't match ImageBitmap height");
              if (f.height = t.height, b.width !== void 0 && b.width !== t.width)
                throw new Error("Image input config width doesn't match ImageBitmap width");
              f.width = t.width;
            } else
              f.height = t.height, f.width = t.width;
            a(Ot.bufferToTensor(r.data, f));
          };
        });
      throw new Error("Input data provided is not supported - aborted tensor creation");
    }
    if (c !== void 0)
      return Ot.bufferToTensor(c, f);
    throw new Error("Input data provided is not supported - aborted tensor creation");
  }
  toImageData(u) {
    var b, h;
    const p = document.createElement("canvas").getContext("2d");
    let g;
    if (p != null) {
      const o = this.dims[3], c = this.dims[2], f = this.dims[1], a = u !== void 0 && u.format !== void 0 ? u.format : "RGB", i = u !== void 0 && ((b = u.norm) === null || b === void 0 ? void 0 : b.mean) !== void 0 ? u.norm.mean : 255, t = u !== void 0 && ((h = u.norm) === null || h === void 0 ? void 0 : h.bias) !== void 0 ? u.norm.bias : 0, e = c * o;
      if (u !== void 0) {
        if (u.height !== void 0 && u.height !== c)
          throw new Error("Image output config height doesn't match tensor height");
        if (u.width !== void 0 && u.width !== o)
          throw new Error("Image output config width doesn't match tensor width");
        if (u.format !== void 0 && f === 4 && u.format !== "RGBA" || f === 3 && u.format !== "RGB" && u.format !== "BGR")
          throw new Error("Tensor format doesn't match input tensor dims");
      }
      const n = 4;
      let r = 0, s = 1, l = 2, d = 3, m = 0, y = e, w = e * 2, _ = -1;
      a === "RGBA" ? (m = 0, y = e, w = e * 2, _ = e * 3) : a === "RGB" ? (m = 0, y = e, w = e * 2) : a === "RBG" && (m = 0, w = e, y = e * 2), g = p.createImageData(o, c);
      for (let S = 0; S < c * o; r += n, s += n, l += n, d += n, S++)
        g.data[r] = (this.data[m++] - t) * i, g.data[s] = (this.data[y++] - t) * i, g.data[l] = (this.data[w++] - t) * i, g.data[d] = _ === -1 ? 255 : (this.data[_++] - t) * i;
    } else
      throw new Error("Can not access image data");
    return g;
  }
  // #endregion
  // #region tensor utilities
  reshape(u) {
    return new Ot(this.type, this.data, u);
  }
};
const Tensor = Tensor$1;
let InferenceSession$1 = class ln {
  constructor(u) {
    this.handler = u;
  }
  async run(u, b, h) {
    const p = {};
    let g = {};
    if (typeof u != "object" || u === null || u instanceof Tensor || Array.isArray(u))
      throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
    let o = !0;
    if (typeof b == "object") {
      if (b === null)
        throw new TypeError("Unexpected argument[1]: cannot be null.");
      if (b instanceof Tensor)
        throw new TypeError("'fetches' cannot be a Tensor");
      if (Array.isArray(b)) {
        if (b.length === 0)
          throw new TypeError("'fetches' cannot be an empty array.");
        o = !1;
        for (const a of b) {
          if (typeof a != "string")
            throw new TypeError("'fetches' must be a string array or an object.");
          if (this.outputNames.indexOf(a) === -1)
            throw new RangeError(`'fetches' contains invalid output name: ${a}.`);
          p[a] = null;
        }
        if (typeof h == "object" && h !== null)
          g = h;
        else if (typeof h < "u")
          throw new TypeError("'options' must be an object.");
      } else {
        let a = !1;
        const i = Object.getOwnPropertyNames(b);
        for (const t of this.outputNames)
          if (i.indexOf(t) !== -1) {
            const e = b[t];
            (e === null || e instanceof Tensor) && (a = !0, o = !1, p[t] = e);
          }
        if (a) {
          if (typeof h == "object" && h !== null)
            g = h;
          else if (typeof h < "u")
            throw new TypeError("'options' must be an object.");
        } else
          g = b;
      }
    } else if (typeof b < "u")
      throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
    for (const a of this.inputNames)
      if (typeof u[a] > "u")
        throw new Error(`input '${a}' is missing in 'feeds'.`);
    if (o)
      for (const a of this.outputNames)
        p[a] = null;
    const c = await this.handler.run(u, p, g), f = {};
    for (const a in c)
      Object.hasOwnProperty.call(c, a) && (f[a] = new Tensor(c[a].type, c[a].data, c[a].dims));
    return f;
  }
  static async create(u, b, h, p) {
    let g, o = {};
    if (typeof u == "string") {
      if (g = u, typeof b == "object" && b !== null)
        o = b;
      else if (typeof b < "u")
        throw new TypeError("'options' must be an object.");
    } else if (u instanceof Uint8Array) {
      if (g = u, typeof b == "object" && b !== null)
        o = b;
      else if (typeof b < "u")
        throw new TypeError("'options' must be an object.");
    } else if (u instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && u instanceof SharedArrayBuffer) {
      const t = u;
      let e = 0, n = u.byteLength;
      if (typeof b == "object" && b !== null)
        o = b;
      else if (typeof b == "number") {
        if (e = b, !Number.isSafeInteger(e))
          throw new RangeError("'byteOffset' must be an integer.");
        if (e < 0 || e >= t.byteLength)
          throw new RangeError(`'byteOffset' is out of range [0, ${t.byteLength}).`);
        if (n = u.byteLength - e, typeof h == "number") {
          if (n = h, !Number.isSafeInteger(n))
            throw new RangeError("'byteLength' must be an integer.");
          if (n <= 0 || e + n > t.byteLength)
            throw new RangeError(`'byteLength' is out of range (0, ${t.byteLength - e}].`);
          if (typeof p == "object" && p !== null)
            o = p;
          else if (typeof p < "u")
            throw new TypeError("'options' must be an object.");
        } else if (typeof h < "u")
          throw new TypeError("'byteLength' must be a number.");
      } else if (typeof b < "u")
        throw new TypeError("'options' must be an object.");
      g = new Uint8Array(t, e, n);
    } else
      throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
    const f = (o.executionProviders || []).map((t) => typeof t == "string" ? t : t.name), i = await (await resolveBackend(f)).createSessionHandler(g, o);
    return new ln(i);
  }
  startProfiling() {
    this.handler.startProfiling();
  }
  endProfiling() {
    this.handler.endProfiling();
  }
  get inputNames() {
    return this.handler.inputNames;
  }
  get outputNames() {
    return this.handler.outputNames;
  }
};
const InferenceSession = InferenceSession$1, lib = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  InferenceSession,
  Tensor,
  env,
  registerBackend
}, Symbol.toStringTag, { value: "Module" })), require$$0 = /* @__PURE__ */ getAugmentedNamespace(lib);
/*!
* ONNX Runtime Web v1.14.0
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
var hasRequiredOrtWeb_min;
function requireOrtWeb_min() {
  return hasRequiredOrtWeb_min || (hasRequiredOrtWeb_min = 1, function(module, exports) {
    (function(C, u) {
      module.exports = u(require$$0);
    })(self, (__WEBPACK_EXTERNAL_MODULE__1670__) => (() => {
      var __webpack_modules__ = { 3474: (C, u, b) => {
        var h, p = (h = (h = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0) || "/index.js", function(g) {
          function o() {
            return H.buffer != Z && $e(H.buffer), ne;
          }
          function c() {
            return H.buffer != Z && $e(H.buffer), ue;
          }
          function f() {
            return H.buffer != Z && $e(H.buffer), ye;
          }
          function a() {
            return H.buffer != Z && $e(H.buffer), oe;
          }
          function i() {
            return H.buffer != Z && $e(H.buffer), be;
          }
          var t, e, n;
          g = g || {}, t || (t = g !== void 0 ? g : {}), t.ready = new Promise(function(T, $) {
            e = T, n = $;
          });
          var r, s, l, d, m, y, w = Object.assign({}, t), _ = "./this.program", S = (T, $) => {
            throw $;
          }, A = typeof window == "object", P = typeof importScripts == "function", v = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", R = t.ENVIRONMENT_IS_PTHREAD || !1, B = "";
          function q(T) {
            return t.locateFile ? t.locateFile(T, B) : B + T;
          }
          if (v) {
            let T;
            B = P ? b(908).dirname(B) + "/" : "//", y = () => {
              m || (d = b(1384), m = b(908));
            }, r = function($, F) {
              return y(), $ = m.normalize($), d.readFileSync($, F ? void 0 : "utf8");
            }, l = ($) => (($ = r($, !0)).buffer || ($ = new Uint8Array($)), $), s = ($, F, V) => {
              y(), $ = m.normalize($), d.readFile($, function(G, K) {
                G ? V(G) : F(K.buffer);
              });
            }, 1 < process.argv.length && (_ = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), process.on("uncaughtException", function($) {
              if (!($ instanceof et)) throw $;
            }), process.on("unhandledRejection", function($) {
              throw $;
            }), S = ($, F) => {
              if (Ye()) throw process.exitCode = $, F;
              F instanceof et || M("exiting due to exception: " + F), process.exit($);
            }, t.inspect = function() {
              return "[Emscripten Module object]";
            };
            try {
              T = b(9925);
            } catch ($) {
              throw console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'), $;
            }
            b.g.Worker = T.Worker;
          } else (A || P) && (P ? B = self.location.href : typeof document < "u" && document.currentScript && (B = document.currentScript.src), h && (B = h), B = B.indexOf("blob:") !== 0 ? B.substr(0, B.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", v || (r = (T) => {
            var $ = new XMLHttpRequest();
            return $.open("GET", T, !1), $.send(null), $.responseText;
          }, P && (l = (T) => {
            var $ = new XMLHttpRequest();
            return $.open("GET", T, !1), $.responseType = "arraybuffer", $.send(null), new Uint8Array($.response);
          }), s = (T, $, F) => {
            var V = new XMLHttpRequest();
            V.open("GET", T, !0), V.responseType = "arraybuffer", V.onload = () => {
              V.status == 200 || V.status == 0 && V.response ? $(V.response) : F();
            }, V.onerror = F, V.send(null);
          }));
          v && typeof performance > "u" && (b.g.performance = b(6953).performance);
          var D = console.log.bind(console), O = console.warn.bind(console);
          v && (y(), D = (T) => d.writeSync(1, T + `
`), O = (T) => d.writeSync(2, T + `
`));
          var N, E = t.print || D, M = t.printErr || O;
          Object.assign(t, w), w = null, t.thisProgram && (_ = t.thisProgram), t.quit && (S = t.quit), t.wasmBinary && (N = t.wasmBinary);
          var Y = t.noExitRuntime || !1;
          typeof WebAssembly != "object" && _e("no native wasm support detected");
          var H, te, Z, ne, ue, ye, oe, be, me = !1, Re = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
          function Ve(T, $, F) {
            var V = ($ >>>= 0) + F;
            for (F = $; T[F] && !(F >= V); ) ++F;
            if (16 < F - $ && T.buffer && Re) return Re.decode(T.buffer instanceof SharedArrayBuffer ? T.slice($, F) : T.subarray($, F));
            for (V = ""; $ < F; ) {
              var G = T[$++];
              if (128 & G) {
                var K = 63 & T[$++];
                if ((224 & G) == 192) V += String.fromCharCode((31 & G) << 6 | K);
                else {
                  var re = 63 & T[$++];
                  65536 > (G = (240 & G) == 224 ? (15 & G) << 12 | K << 6 | re : (7 & G) << 18 | K << 12 | re << 6 | 63 & T[$++]) ? V += String.fromCharCode(G) : (G -= 65536, V += String.fromCharCode(55296 | G >> 10, 56320 | 1023 & G));
                }
              } else V += String.fromCharCode(G);
            }
            return V;
          }
          function de(T, $) {
            return (T >>>= 0) ? Ve(c(), T, $) : "";
          }
          function Ee(T, $, F, V) {
            if (!(0 < V)) return 0;
            var G = F >>>= 0;
            V = F + V - 1;
            for (var K = 0; K < T.length; ++K) {
              var re = T.charCodeAt(K);
              if (55296 <= re && 57343 >= re && (re = 65536 + ((1023 & re) << 10) | 1023 & T.charCodeAt(++K)), 127 >= re) {
                if (F >= V) break;
                $[F++ >>> 0] = re;
              } else {
                if (2047 >= re) {
                  if (F + 1 >= V) break;
                  $[F++ >>> 0] = 192 | re >> 6;
                } else {
                  if (65535 >= re) {
                    if (F + 2 >= V) break;
                    $[F++ >>> 0] = 224 | re >> 12;
                  } else {
                    if (F + 3 >= V) break;
                    $[F++ >>> 0] = 240 | re >> 18, $[F++ >>> 0] = 128 | re >> 12 & 63;
                  }
                  $[F++ >>> 0] = 128 | re >> 6 & 63;
                }
                $[F++ >>> 0] = 128 | 63 & re;
              }
            }
            return $[F >>> 0] = 0, F - G;
          }
          function Ie(T) {
            for (var $ = 0, F = 0; F < T.length; ++F) {
              var V = T.charCodeAt(F);
              127 >= V ? $++ : 2047 >= V ? $ += 2 : 55296 <= V && 57343 >= V ? ($ += 4, ++F) : $ += 3;
            }
            return $;
          }
          function $e(T) {
            Z = T, t.HEAP8 = ne = new Int8Array(T), t.HEAP16 = new Int16Array(T), t.HEAP32 = ye = new Int32Array(T), t.HEAPU8 = ue = new Uint8Array(T), t.HEAPU16 = new Uint16Array(T), t.HEAPU32 = oe = new Uint32Array(T), t.HEAPF32 = new Float32Array(T), t.HEAPF64 = be = new Float64Array(T);
          }
          R && (Z = t.buffer);
          var Fe = t.INITIAL_MEMORY || 16777216;
          if (R) H = t.wasmMemory, Z = t.buffer;
          else if (t.wasmMemory) H = t.wasmMemory;
          else if (!((H = new WebAssembly.Memory({ initial: Fe / 65536, maximum: 65536, shared: !0 })).buffer instanceof SharedArrayBuffer)) throw M("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"), v && console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"), Error("bad memory");
          H && (Z = H.buffer), Fe = Z.byteLength, $e(Z);
          var Be, ze = [], qe = [], Je = [], He = [];
          function Ye() {
            return Y || !1;
          }
          function We() {
            var T = t.preRun.shift();
            ze.unshift(T);
          }
          var ke, Ge = 0, Qe = null;
          function _e(T) {
            throw R ? postMessage({ cmd: "onAbort", arg: T }) : t.onAbort && t.onAbort(T), M(T = "Aborted(" + T + ")"), me = !0, T = new WebAssembly.RuntimeError(T + ". Build with -sASSERTIONS for more info."), n(T), T;
          }
          function pt() {
            return ke.startsWith("data:application/octet-stream;base64,");
          }
          function st() {
            var T = ke;
            try {
              if (T == ke && N) return new Uint8Array(N);
              if (l) return l(T);
              throw "both async and sync fetching of the wasm failed";
            } catch ($) {
              _e($);
            }
          }
          ke = "ort-wasm-threaded.wasm", pt() || (ke = q(ke));
          var At = {};
          function et(T) {
            this.name = "ExitStatus", this.message = "Program terminated with exit(" + T + ")", this.status = T;
          }
          function ut(T) {
            (T = le.Vb[T]) || _e(), le.mc(T);
          }
          function ht(T) {
            var $ = le.Cc();
            if (!$) return 6;
            le.ac.push($), le.Vb[T.Ub] = $, $.Ub = T.Ub;
            var F = { cmd: "run", start_routine: T.Ic, arg: T.zc, pthread_ptr: T.Ub };
            return $.$b = () => {
              F.time = performance.now(), $.postMessage(F, T.Nc);
            }, $.loaded && ($.$b(), delete $.$b), 0;
          }
          function Ue(T) {
            if (R) return ie(1, 1, T);
            Ye() || (le.oc(), t.onExit && t.onExit(T), me = !0), S(T, new et(T));
          }
          function ct(T, $) {
            if (!$ && R) throw It(T), "unwind";
            Ye() || R || (qt(), it(Je), Gt(0), Ft[1].length && kt(1, 10), Ft[2].length && kt(2, 10), le.oc()), Ue(T);
          }
          var le = { Yb: [], ac: [], qc: [], Vb: {}, fc: function() {
            R && le.Ec();
          }, Pc: function() {
          }, Ec: function() {
            le.receiveObjectTransfer = le.Gc, le.threadInitTLS = le.pc, le.setExitStatus = le.nc, Y = !1;
          }, nc: function() {
          }, oc: function() {
            for (var T of Object.values(le.Vb)) le.mc(T);
            for (T of le.Yb) T.terminate();
            le.Yb = [];
          }, mc: function(T) {
            var $ = T.Ub;
            delete le.Vb[$], le.Yb.push(T), le.ac.splice(le.ac.indexOf(T), 1), T.Ub = 0, Nt($);
          }, Gc: function() {
          }, pc: function() {
            le.qc.forEach((T) => T());
          }, Fc: function(T, $) {
            T.onmessage = (F) => {
              var V = (F = F.data).cmd;
              if (T.Ub && (le.Bc = T.Ub), F.targetThread && F.targetThread != $t()) {
                var G = le.Vb[F.Qc];
                G ? G.postMessage(F, F.transferList) : M('Internal error! Worker sent a message "' + V + '" to target pthread ' + F.targetThread + ", but that thread no longer exists!");
              } else V === "processProxyingQueue" ? L(F.queue) : V === "spawnThread" ? ht(F) : V === "cleanupThread" ? ut(F.thread) : V === "killThread" ? (F = F.thread, V = le.Vb[F], delete le.Vb[F], V.terminate(), Nt(F), le.ac.splice(le.ac.indexOf(V), 1), V.Ub = 0) : V === "cancelThread" ? le.Vb[F.thread].postMessage({ cmd: "cancel" }) : V === "loaded" ? (T.loaded = !0, $ && $(T), T.$b && (T.$b(), delete T.$b)) : V === "print" ? E("Thread " + F.threadId + ": " + F.text) : V === "printErr" ? M("Thread " + F.threadId + ": " + F.text) : V === "alert" ? alert("Thread " + F.threadId + ": " + F.text) : F.target === "setimmediate" ? T.postMessage(F) : V === "onAbort" ? t.onAbort && t.onAbort(F.arg) : V && M("worker sent an unknown command " + V);
              le.Bc = void 0;
            }, T.onerror = (F) => {
              throw M("worker sent an error! " + F.filename + ":" + F.lineno + ": " + F.message), F;
            }, v && (T.on("message", function(F) {
              T.onmessage({ data: F });
            }), T.on("error", function(F) {
              T.onerror(F);
            }), T.on("detachedExit", function() {
            })), T.postMessage({ cmd: "load", urlOrBlob: t.mainScriptUrlOrBlob || h, wasmMemory: H, wasmModule: te });
          }, yc: function() {
            var T = q("ort-wasm-threaded.worker.js");
            le.Yb.push(new Worker(T));
          }, Cc: function() {
            return le.Yb.length == 0 && (le.yc(), le.Fc(le.Yb[0])), le.Yb.pop();
          } };
          function it(T) {
            for (; 0 < T.length; ) T.shift()(t);
          }
          function Et(T) {
            var $ = ve();
            return T = T(), we($), T;
          }
          function It(T) {
            if (R) return ie(2, 0, T);
            try {
              ct(T);
            } catch ($) {
              $ instanceof et || $ == "unwind" || S(1, $);
            }
          }
          t.PThread = le, t.establishStackSpace = function() {
            var T = $t(), $ = f()[T + 44 >> 2 >>> 0];
            T = f()[T + 48 >> 2 >>> 0], Kt($, $ - T), we($);
          };
          var Ze = [];
          function Pe(T) {
            var $ = Ze[T];
            return $ || (T >= Ze.length && (Ze.length = T + 1), Ze[T] = $ = Be.get(T)), $;
          }
          t.invokeEntryPoint = function(T, $) {
            T = Pe(T)($), Ye() ? le.nc(T) : Xt(T);
          };
          var Xe, lt, rt = [], ge = 0, fe = 0;
          function pe(T) {
            this.Zb = T, this.Sb = T - 24, this.xc = function($) {
              a()[this.Sb + 4 >> 2 >>> 0] = $;
            }, this.bc = function() {
              return a()[this.Sb + 4 >> 2 >>> 0];
            }, this.wc = function($) {
              a()[this.Sb + 8 >> 2 >>> 0] = $;
            }, this.Dc = function() {
              return a()[this.Sb + 8 >> 2 >>> 0];
            }, this.rc = function() {
              f()[this.Sb >> 2 >>> 0] = 0;
            }, this.hc = function($) {
              $ = $ ? 1 : 0, o()[this.Sb + 12 >> 0 >>> 0] = $;
            }, this.uc = function() {
              return o()[this.Sb + 12 >> 0 >>> 0] != 0;
            }, this.ic = function($) {
              $ = $ ? 1 : 0, o()[this.Sb + 13 >> 0 >>> 0] = $;
            }, this.kc = function() {
              return o()[this.Sb + 13 >> 0 >>> 0] != 0;
            }, this.fc = function($, F) {
              this.cc(0), this.xc($), this.wc(F), this.rc(), this.hc(!1), this.ic(!1);
            }, this.sc = function() {
              Atomics.add(f(), this.Sb >> 2, 1);
            }, this.Hc = function() {
              return Atomics.sub(f(), this.Sb >> 2, 1) === 1;
            }, this.cc = function($) {
              a()[this.Sb + 16 >> 2 >>> 0] = $;
            }, this.tc = function() {
              return a()[this.Sb + 16 >> 2 >>> 0];
            }, this.vc = function() {
              if (Jt(this.bc())) return a()[this.Zb >> 2 >>> 0];
              var $ = this.tc();
              return $ !== 0 ? $ : this.Zb;
            };
          }
          function yt(T) {
            return zt(new pe(T).Sb);
          }
          function ot(T, $, F, V) {
            return R ? ie(3, 1, T, $, F, V) : gt(T, $, F, V);
          }
          function gt(T, $, F, V) {
            if (typeof SharedArrayBuffer > "u") return M("Current environment does not support SharedArrayBuffer, pthreads are not available!"), 6;
            var G = [];
            return R && G.length === 0 ? ot(T, $, F, V) : (T = { Ic: F, Ub: T, zc: V, Nc: G }, R ? (T.Oc = "spawnThread", postMessage(T, G), 0) : ht(T));
          }
          function _t(T, $, F) {
            return R ? ie(4, 1, T, $, F) : 0;
          }
          function wt(T, $) {
            if (R) return ie(5, 1, T, $);
          }
          function mt(T, $) {
            if (R) return ie(6, 1, T, $);
          }
          function bt(T, $, F) {
            if (R) return ie(7, 1, T, $, F);
          }
          function vt(T, $, F) {
            return R ? ie(8, 1, T, $, F) : 0;
          }
          function xt(T, $) {
            if (R) return ie(9, 1, T, $);
          }
          function Tt(T, $, F) {
            if (R) return ie(10, 1, T, $, F);
          }
          function St(T, $, F, V) {
            if (R) return ie(11, 1, T, $, F, V);
          }
          function j(T, $, F, V) {
            if (R) return ie(12, 1, T, $, F, V);
          }
          function ee(T, $, F, V) {
            if (R) return ie(13, 1, T, $, F, V);
          }
          function se(T) {
            if (R) return ie(14, 1, T);
          }
          function I(T, $) {
            if (R) return ie(15, 1, T, $);
          }
          function k(T, $, F) {
            if (R) return ie(16, 1, T, $, F);
          }
          function L(T) {
            Atomics.store(f(), T >> 2, 1), $t() && Yt(T), Atomics.compareExchange(f(), T >> 2, 1, 0);
          }
          function U(T) {
            return a()[T >>> 2] + 4294967296 * f()[T + 4 >>> 2];
          }
          function z(T, $, F, V, G, K) {
            return R ? ie(17, 1, T, $, F, V, G, K) : -52;
          }
          function W(T, $, F, V, G, K) {
            if (R) return ie(18, 1, T, $, F, V, G, K);
          }
          function Q(T) {
            var $ = Ie(T) + 1, F = Mt($);
            return F && Ee(T, o(), F, $), F;
          }
          function ae(T, $, F) {
            function V(Ae) {
              return (Ae = Ae.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? Ae[1] : "GMT";
            }
            if (R) return ie(19, 1, T, $, F);
            var G = (/* @__PURE__ */ new Date()).getFullYear(), K = new Date(G, 0, 1), re = new Date(G, 6, 1);
            G = K.getTimezoneOffset();
            var ce = re.getTimezoneOffset(), Se = Math.max(G, ce);
            f()[T >> 2 >>> 0] = 60 * Se, f()[$ >> 2 >>> 0] = +(G != ce), T = V(K), $ = V(re), T = Q(T), $ = Q($), ce < G ? (a()[F >> 2 >>> 0] = T, a()[F + 4 >> 2 >>> 0] = $) : (a()[F >> 2 >>> 0] = $, a()[F + 4 >> 2 >>> 0] = T);
          }
          function ie(T, $) {
            var F = arguments.length - 2, V = arguments;
            return Et(() => {
              for (var G = jt(8 * F), K = G >> 3, re = 0; re < F; re++) {
                var ce = V[2 + re];
                i()[K + re >>> 0] = ce;
              }
              return Ht(T, F, G, $);
            });
          }
          t.executeNotifiedProxyingQueue = L, lt = v ? () => {
            var T = process.hrtime();
            return 1e3 * T[0] + T[1] / 1e6;
          } : R ? () => performance.now() - t.__performance_now_clock_drift : () => performance.now();
          var he, Oe = [], Ce = {};
          function Ne() {
            if (!he) {
              var T, $ = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: _ || "./this.program" };
              for (T in Ce) Ce[T] === void 0 ? delete $[T] : $[T] = Ce[T];
              var F = [];
              for (T in $) F.push(T + "=" + $[T]);
              he = F;
            }
            return he;
          }
          function X(T, $) {
            if (R) return ie(20, 1, T, $);
            var F = 0;
            return Ne().forEach(function(V, G) {
              var K = $ + F;
              for (G = a()[T + 4 * G >> 2 >>> 0] = K, K = 0; K < V.length; ++K) o()[G++ >> 0 >>> 0] = V.charCodeAt(K);
              o()[G >> 0 >>> 0] = 0, F += V.length + 1;
            }), 0;
          }
          function xe(T, $) {
            if (R) return ie(21, 1, T, $);
            var F = Ne();
            a()[T >> 2 >>> 0] = F.length;
            var V = 0;
            return F.forEach(function(G) {
              V += G.length + 1;
            }), a()[$ >> 2 >>> 0] = V, 0;
          }
          function Me(T) {
            return R ? ie(22, 1, T) : 52;
          }
          function tt(T, $, F, V) {
            return R ? ie(23, 1, T, $, F, V) : 52;
          }
          function ft(T, $, F, V, G) {
            return R ? ie(24, 1, T, $, F, V, G) : 70;
          }
          var Ft = [null, [], []];
          function kt(T, $) {
            var F = Ft[T];
            $ === 0 || $ === 10 ? ((T === 1 ? E : M)(Ve(F, 0)), F.length = 0) : F.push($);
          }
          function Lt(T, $, F, V) {
            if (R) return ie(25, 1, T, $, F, V);
            for (var G = 0, K = 0; K < F; K++) {
              var re = a()[$ >> 2 >>> 0], ce = a()[$ + 4 >> 2 >>> 0];
              $ += 8;
              for (var Se = 0; Se < ce; Se++) kt(T, c()[re + Se >>> 0]);
              G += ce;
            }
            return a()[V >> 2 >>> 0] = G, 0;
          }
          var Ke = 0;
          function Dt(T) {
            return T % 4 == 0 && (T % 100 != 0 || T % 400 == 0);
          }
          var Vt = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Ut = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          function Bt(T, $, F, V) {
            function G(J, De, je) {
              for (J = typeof J == "number" ? J.toString() : J || ""; J.length < De; ) J = je[0] + J;
              return J;
            }
            function K(J, De) {
              return G(J, De, "0");
            }
            function re(J, De) {
              function je(Pt) {
                return 0 > Pt ? -1 : 0 < Pt ? 1 : 0;
              }
              var dt;
              return (dt = je(J.getFullYear() - De.getFullYear())) === 0 && (dt = je(J.getMonth() - De.getMonth())) === 0 && (dt = je(J.getDate() - De.getDate())), dt;
            }
            function ce(J) {
              switch (J.getDay()) {
                case 0:
                  return new Date(J.getFullYear() - 1, 11, 29);
                case 1:
                  return J;
                case 2:
                  return new Date(J.getFullYear(), 0, 3);
                case 3:
                  return new Date(J.getFullYear(), 0, 2);
                case 4:
                  return new Date(J.getFullYear(), 0, 1);
                case 5:
                  return new Date(J.getFullYear() - 1, 11, 31);
                case 6:
                  return new Date(J.getFullYear() - 1, 11, 30);
              }
            }
            function Se(J) {
              var De = J.Wb;
              for (J = new Date(new Date(J.Xb + 1900, 0, 1).getTime()); 0 < De; ) {
                var je = J.getMonth(), dt = (Dt(J.getFullYear()) ? Vt : Ut)[je];
                if (!(De > dt - J.getDate())) {
                  J.setDate(J.getDate() + De);
                  break;
                }
                De -= dt - J.getDate() + 1, J.setDate(1), 11 > je ? J.setMonth(je + 1) : (J.setMonth(0), J.setFullYear(J.getFullYear() + 1));
              }
              return je = new Date(J.getFullYear() + 1, 0, 4), De = ce(new Date(J.getFullYear(), 0, 4)), je = ce(je), 0 >= re(De, J) ? 0 >= re(je, J) ? J.getFullYear() + 1 : J.getFullYear() : J.getFullYear() - 1;
            }
            var Ae = f()[V + 40 >> 2 >>> 0];
            for (var Le in V = { Lc: f()[V >> 2 >>> 0], Kc: f()[V + 4 >> 2 >>> 0], dc: f()[V + 8 >> 2 >>> 0], jc: f()[V + 12 >> 2 >>> 0], ec: f()[V + 16 >> 2 >>> 0], Xb: f()[V + 20 >> 2 >>> 0], Tb: f()[V + 24 >> 2 >>> 0], Wb: f()[V + 28 >> 2 >>> 0], Rc: f()[V + 32 >> 2 >>> 0], Jc: f()[V + 36 >> 2 >>> 0], Mc: Ae ? de(Ae) : "" }, F = de(F), Ae = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" }) F = F.replace(new RegExp(Le, "g"), Ae[Le]);
            var at = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), nt = "January February March April May June July August September October November December".split(" ");
            for (Le in Ae = { "%a": function(J) {
              return at[J.Tb].substring(0, 3);
            }, "%A": function(J) {
              return at[J.Tb];
            }, "%b": function(J) {
              return nt[J.ec].substring(0, 3);
            }, "%B": function(J) {
              return nt[J.ec];
            }, "%C": function(J) {
              return K((J.Xb + 1900) / 100 | 0, 2);
            }, "%d": function(J) {
              return K(J.jc, 2);
            }, "%e": function(J) {
              return G(J.jc, 2, " ");
            }, "%g": function(J) {
              return Se(J).toString().substring(2);
            }, "%G": function(J) {
              return Se(J);
            }, "%H": function(J) {
              return K(J.dc, 2);
            }, "%I": function(J) {
              return (J = J.dc) == 0 ? J = 12 : 12 < J && (J -= 12), K(J, 2);
            }, "%j": function(J) {
              for (var De = 0, je = 0; je <= J.ec - 1; De += (Dt(J.Xb + 1900) ? Vt : Ut)[je++]) ;
              return K(J.jc + De, 3);
            }, "%m": function(J) {
              return K(J.ec + 1, 2);
            }, "%M": function(J) {
              return K(J.Kc, 2);
            }, "%n": function() {
              return `
`;
            }, "%p": function(J) {
              return 0 <= J.dc && 12 > J.dc ? "AM" : "PM";
            }, "%S": function(J) {
              return K(J.Lc, 2);
            }, "%t": function() {
              return "	";
            }, "%u": function(J) {
              return J.Tb || 7;
            }, "%U": function(J) {
              return K(Math.floor((J.Wb + 7 - J.Tb) / 7), 2);
            }, "%V": function(J) {
              var De = Math.floor((J.Wb + 7 - (J.Tb + 6) % 7) / 7);
              if (2 >= (J.Tb + 371 - J.Wb - 2) % 7 && De++, De) De == 53 && ((je = (J.Tb + 371 - J.Wb) % 7) == 4 || je == 3 && Dt(J.Xb) || (De = 1));
              else {
                De = 52;
                var je = (J.Tb + 7 - J.Wb - 1) % 7;
                (je == 4 || je == 5 && Dt(J.Xb % 400 - 1)) && De++;
              }
              return K(De, 2);
            }, "%w": function(J) {
              return J.Tb;
            }, "%W": function(J) {
              return K(Math.floor((J.Wb + 7 - (J.Tb + 6) % 7) / 7), 2);
            }, "%y": function(J) {
              return (J.Xb + 1900).toString().substring(2);
            }, "%Y": function(J) {
              return J.Xb + 1900;
            }, "%z": function(J) {
              var De = 0 <= (J = J.Jc);
              return J = Math.abs(J) / 60, (De ? "+" : "-") + ("0000" + (J / 60 * 100 + J % 60)).slice(-4);
            }, "%Z": function(J) {
              return J.Mc;
            }, "%%": function() {
              return "%";
            } }, F = F.replace(/%%/g, "\0\0"), Ae) F.includes(Le) && (F = F.replace(new RegExp(Le, "g"), Ae[Le](V)));
            return Le = function(J) {
              var De = Array(Ie(J) + 1);
              return Ee(J, De, 0, De.length), De;
            }(F = F.replace(/\0\0/g, "%")), Le.length > $ ? 0 : (function(J, De) {
              o().set(J, De >>> 0);
            }(Le, T), Le.length - 1);
          }
          le.fc();
          var fn = [null, Ue, It, ot, _t, wt, mt, bt, vt, xt, Tt, St, j, ee, se, I, k, z, W, ae, X, xe, Me, tt, ft, Lt], dn = { b: function(T) {
            return Mt(T + 24) + 24;
          }, n: function(T) {
            return (T = new pe(T)).uc() || (T.hc(!0), ge--), T.ic(!1), rt.push(T), T.sc(), T.vc();
          }, ma: function(T) {
            throw M("Unexpected exception thrown, this is not properly supported - aborting"), me = !0, T;
          }, x: function() {
            Te(0);
            var T = rt.pop();
            if (T.Hc() && !T.kc()) {
              var $ = T.Dc();
              $ && Pe($)(T.Zb), yt(T.Zb);
            }
            fe = 0;
          }, e: function() {
            var T = fe;
            if (!T) return Ke = 0;
            var $ = new pe(T);
            $.cc(T);
            var F = $.bc();
            if (!F) return Ke = 0, T;
            for (var V = Array.prototype.slice.call(arguments), G = 0; G < V.length; G++) {
              var K = V[G];
              if (K === 0 || K === F) break;
              if (Ct(K, F, $.Sb + 16)) return Ke = K, T;
            }
            return Ke = F, T;
          }, l: function() {
            var T = fe;
            if (!T) return Ke = 0;
            var $ = new pe(T);
            $.cc(T);
            var F = $.bc();
            if (!F) return Ke = 0, T;
            for (var V = Array.prototype.slice.call(arguments), G = 0; G < V.length; G++) {
              var K = V[G];
              if (K === 0 || K === F) break;
              if (Ct(K, F, $.Sb + 16)) return Ke = K, T;
            }
            return Ke = F, T;
          }, h: function() {
            var T = fe;
            if (!T) return Ke = 0;
            var $ = new pe(T);
            $.cc(T);
            var F = $.bc();
            if (!F) return Ke = 0, T;
            for (var V = Array.prototype.slice.call(arguments), G = 0; G < V.length; G++) {
              var K = V[G];
              if (K === 0 || K === F) break;
              if (Ct(K, F, $.Sb + 16)) return Ke = K, T;
            }
            return Ke = F, T;
          }, t: yt, M: function() {
            var T = rt.pop();
            T || _e("no exception to throw");
            var $ = T.Zb;
            throw T.kc() || (rt.push(T), T.ic(!0), T.hc(!1), ge++), fe = $, $;
          }, c: function(T, $, F) {
            throw new pe(T).fc($, F), fe = T, ge++, T;
          }, pa: function() {
            return ge;
          }, Fa: function(T) {
            Wt(T, !P, 1, !A), le.pc();
          }, T: function(T) {
            R ? postMessage({ cmd: "cleanupThread", thread: T }) : ut(T);
          }, xa: gt, j: function(T) {
            throw fe || (fe = T), T;
          }, H: _t, Ma: wt, ua: mt, wa: bt, oa: vt, Ka: xt, Ca: Tt, Ja: St, V: j, va: ee, sa: se, La: I, ta: k, Ta: function() {
          }, X: function() {
            _e("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
          }, Ua: function() {
            _e("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
          }, W: function() {
            return Date.now();
          }, ya: function() {
            return 2097152;
          }, Oa: function() {
            return !0;
          }, za: function(T, $, F, V) {
            if (T == $) setTimeout(() => L(V));
            else if (R) postMessage({ targetThread: T, cmd: "processProxyingQueue", queue: V });
            else {
              if (!(T = le.Vb[T])) return;
              T.postMessage({ cmd: "processProxyingQueue", queue: V });
            }
            return 1;
          }, Ea: function() {
            return -1;
          }, Pa: function(T, $) {
            T = new Date(1e3 * U(T)), f()[$ >> 2 >>> 0] = T.getUTCSeconds(), f()[$ + 4 >> 2 >>> 0] = T.getUTCMinutes(), f()[$ + 8 >> 2 >>> 0] = T.getUTCHours(), f()[$ + 12 >> 2 >>> 0] = T.getUTCDate(), f()[$ + 16 >> 2 >>> 0] = T.getUTCMonth(), f()[$ + 20 >> 2 >>> 0] = T.getUTCFullYear() - 1900, f()[$ + 24 >> 2 >>> 0] = T.getUTCDay(), T = (T.getTime() - Date.UTC(T.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0, f()[$ + 28 >> 2 >>> 0] = T;
          }, Qa: function(T, $) {
            T = new Date(1e3 * U(T)), f()[$ >> 2 >>> 0] = T.getSeconds(), f()[$ + 4 >> 2 >>> 0] = T.getMinutes(), f()[$ + 8 >> 2 >>> 0] = T.getHours(), f()[$ + 12 >> 2 >>> 0] = T.getDate(), f()[$ + 16 >> 2 >>> 0] = T.getMonth(), f()[$ + 20 >> 2 >>> 0] = T.getFullYear() - 1900, f()[$ + 24 >> 2 >>> 0] = T.getDay();
            var F = new Date(T.getFullYear(), 0, 1), V = (T.getTime() - F.getTime()) / 864e5 | 0;
            f()[$ + 28 >> 2 >>> 0] = V, f()[$ + 36 >> 2 >>> 0] = -60 * T.getTimezoneOffset(), V = new Date(T.getFullYear(), 6, 1).getTimezoneOffset(), T = 0 | (V != (F = F.getTimezoneOffset()) && T.getTimezoneOffset() == Math.min(F, V)), f()[$ + 32 >> 2 >>> 0] = T;
          }, Ra: function(T) {
            var $ = new Date(f()[T + 20 >> 2 >>> 0] + 1900, f()[T + 16 >> 2 >>> 0], f()[T + 12 >> 2 >>> 0], f()[T + 8 >> 2 >>> 0], f()[T + 4 >> 2 >>> 0], f()[T >> 2 >>> 0], 0), F = f()[T + 32 >> 2 >>> 0], V = $.getTimezoneOffset(), G = new Date($.getFullYear(), 0, 1), K = new Date($.getFullYear(), 6, 1).getTimezoneOffset(), re = G.getTimezoneOffset(), ce = Math.min(re, K);
            return 0 > F ? f()[T + 32 >> 2 >>> 0] = +(K != re && ce == V) : 0 < F != (ce == V) && (K = Math.max(re, K), $.setTime($.getTime() + 6e4 * ((0 < F ? ce : K) - V))), f()[T + 24 >> 2 >>> 0] = $.getDay(), F = ($.getTime() - G.getTime()) / 864e5 | 0, f()[T + 28 >> 2 >>> 0] = F, f()[T >> 2 >>> 0] = $.getSeconds(), f()[T + 4 >> 2 >>> 0] = $.getMinutes(), f()[T + 8 >> 2 >>> 0] = $.getHours(), f()[T + 12 >> 2 >>> 0] = $.getDate(), f()[T + 16 >> 2 >>> 0] = $.getMonth(), $.getTime() / 1e3 | 0;
          }, Aa: z, Ba: W, Sa: function T($, F, V) {
            T.Ac || (T.Ac = !0, ae($, F, V));
          }, y: function() {
            _e("");
          }, U: function() {
            if (!v && !P) {
              var T = "Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread";
              Xe || (Xe = {}), Xe[T] || (Xe[T] = 1, v && (T = "warning: " + T), M(T));
            }
          }, ra: function() {
            return 4294901760;
          }, B: lt, Ia: function(T, $, F) {
            c().copyWithin(T >>> 0, $ >>> 0, $ + F >>> 0);
          }, F: function() {
            return v ? b(3993).cpus().length : navigator.hardwareConcurrency;
          }, Da: function(T, $, F) {
            Oe.length = $, F >>= 3;
            for (var V = 0; V < $; V++) Oe[V] = i()[F + V >>> 0];
            return (0 > T ? At[-T - 1] : fn[T]).apply(null, Oe);
          }, qa: function(T) {
            var $ = c().length;
            if ((T >>>= 0) <= $ || 4294901760 < T) return !1;
            for (var F = 1; 4 >= F; F *= 2) {
              var V = $ * (1 + 0.2 / F);
              V = Math.min(V, T + 100663296);
              var G = Math;
              V = Math.max(T, V), G = G.min.call(G, 4294901760, V + (65536 - V % 65536) % 65536);
              e: {
                try {
                  H.grow(G - Z.byteLength + 65535 >>> 16), $e(H.buffer);
                  var K = 1;
                  break e;
                } catch {
                }
                K = void 0;
              }
              if (K) return !0;
            }
            return !1;
          }, Na: function() {
            throw "unwind";
          }, Ga: X, Ha: xe, J: ct, I: Me, S: tt, ga: ft, R: Lt, d: function() {
            return Ke;
          }, na: function T($, F) {
            T.lc || (T.lc = function() {
              if (typeof crypto == "object" && typeof crypto.getRandomValues == "function") {
                var G = new Uint8Array(1);
                return () => (crypto.getRandomValues(G), G[0]);
              }
              if (v) try {
                var K = b(Object(function() {
                  var re = new Error("Cannot find module 'crypto'");
                  throw re.code = "MODULE_NOT_FOUND", re;
                }()));
                return () => K.randomBytes(1)[0];
              } catch {
              }
              return () => _e("randomDevice");
            }());
            for (var V = 0; V < F; V++) o()[$ + V >> 0 >>> 0] = T.lc();
            return 0;
          }, ia: function(T, $, F) {
            var V = ve();
            try {
              return Pe(T)($, F);
            } catch (G) {
              if (we(V), G !== G + 0) throw G;
              Te(1, 0);
            }
          }, ja: function(T, $, F) {
            var V = ve();
            try {
              return Pe(T)($, F);
            } catch (G) {
              if (we(V), G !== G + 0) throw G;
              Te(1, 0);
            }
          }, K: function(T) {
            var $ = ve();
            try {
              return Pe(T)();
            } catch (F) {
              if (we($), F !== F + 0) throw F;
              Te(1, 0);
            }
          }, f: function(T, $) {
            var F = ve();
            try {
              return Pe(T)($);
            } catch (V) {
              if (we(F), V !== V + 0) throw V;
              Te(1, 0);
            }
          }, P: function(T, $, F) {
            var V = ve();
            try {
              return Pe(T)($, F);
            } catch (G) {
              if (we(V), G !== G + 0) throw G;
              Te(1, 0);
            }
          }, Q: function(T, $, F) {
            var V = ve();
            try {
              return Pe(T)($, F);
            } catch (G) {
              if (we(V), G !== G + 0) throw G;
              Te(1, 0);
            }
          }, k: function(T, $, F) {
            var V = ve();
            try {
              return Pe(T)($, F);
            } catch (G) {
              if (we(V), G !== G + 0) throw G;
              Te(1, 0);
            }
          }, p: function(T, $, F, V) {
            var G = ve();
            try {
              return Pe(T)($, F, V);
            } catch (K) {
              if (we(G), K !== K + 0) throw K;
              Te(1, 0);
            }
          }, q: function(T, $, F, V, G) {
            var K = ve();
            try {
              return Pe(T)($, F, V, G);
            } catch (re) {
              if (we(K), re !== re + 0) throw re;
              Te(1, 0);
            }
          }, N: function(T, $, F, V, G, K) {
            var re = ve();
            try {
              return Pe(T)($, F, V, G, K);
            } catch (ce) {
              if (we(re), ce !== ce + 0) throw ce;
              Te(1, 0);
            }
          }, s: function(T, $, F, V, G, K) {
            var re = ve();
            try {
              return Pe(T)($, F, V, G, K);
            } catch (ce) {
              if (we(re), ce !== ce + 0) throw ce;
              Te(1, 0);
            }
          }, w: function(T, $, F, V, G, K, re) {
            var ce = ve();
            try {
              return Pe(T)($, F, V, G, K, re);
            } catch (Se) {
              if (we(ce), Se !== Se + 0) throw Se;
              Te(1, 0);
            }
          }, L: function(T, $, F, V, G, K, re, ce) {
            var Se = ve();
            try {
              return Pe(T)($, F, V, G, K, re, ce);
            } catch (Ae) {
              if (we(Se), Ae !== Ae + 0) throw Ae;
              Te(1, 0);
            }
          }, E: function(T, $, F, V, G, K, re, ce, Se, Ae, Le, at) {
            var nt = ve();
            try {
              return Pe(T)($, F, V, G, K, re, ce, Se, Ae, Le, at);
            } catch (J) {
              if (we(nt), J !== J + 0) throw J;
              Te(1, 0);
            }
          }, aa: function(T, $, F, V, G, K, re, ce) {
            var Se = ve();
            try {
              return sn(T, $, F, V, G, K, re, ce);
            } catch (Ae) {
              if (we(Se), Ae !== Ae + 0) throw Ae;
              Te(1, 0);
            }
          }, _: function(T, $, F, V, G, K, re) {
            var ce = ve();
            try {
              return Qt(T, $, F, V, G, K, re);
            } catch (Se) {
              if (we(ce), Se !== Se + 0) throw Se;
              Te(1, 0);
            }
          }, Z: function(T, $, F, V, G) {
            var K = ve();
            try {
              return un(T, $, F, V, G);
            } catch (re) {
              if (we(K), re !== re + 0) throw re;
              Te(1, 0);
            }
          }, ca: function(T, $, F, V) {
            var G = ve();
            try {
              return on(T, $, F, V);
            } catch (K) {
              if (we(G), K !== K + 0) throw K;
              Te(1, 0);
            }
          }, $: function(T) {
            var $ = ve();
            try {
              return Zt(T);
            } catch (F) {
              if (we($), F !== F + 0) throw F;
              Te(1, 0);
            }
          }, ba: function(T, $) {
            var F = ve();
            try {
              return an(T, $);
            } catch (V) {
              if (we(F), V !== V + 0) throw V;
              Te(1, 0);
            }
          }, Y: function(T, $, F) {
            var V = ve();
            try {
              return en(T, $, F);
            } catch (G) {
              if (we(V), G !== G + 0) throw G;
              Te(1, 0);
            }
          }, g: function(T) {
            var $ = ve();
            try {
              Pe(T)();
            } catch (F) {
              if (we($), F !== F + 0) throw F;
              Te(1, 0);
            }
          }, r: function(T, $) {
            var F = ve();
            try {
              Pe(T)($);
            } catch (V) {
              if (we(F), V !== V + 0) throw V;
              Te(1, 0);
            }
          }, i: function(T, $, F) {
            var V = ve();
            try {
              Pe(T)($, F);
            } catch (G) {
              if (we(V), G !== G + 0) throw G;
              Te(1, 0);
            }
          }, ha: function(T, $, F, V) {
            var G = ve();
            try {
              Pe(T)($, F, V);
            } catch (K) {
              if (we(G), K !== K + 0) throw K;
              Te(1, 0);
            }
          }, m: function(T, $, F, V) {
            var G = ve();
            try {
              Pe(T)($, F, V);
            } catch (K) {
              if (we(G), K !== K + 0) throw K;
              Te(1, 0);
            }
          }, v: function(T, $, F, V, G) {
            var K = ve();
            try {
              Pe(T)($, F, V, G);
            } catch (re) {
              if (we(K), re !== re + 0) throw re;
              Te(1, 0);
            }
          }, u: function(T, $, F, V, G, K) {
            var re = ve();
            try {
              Pe(T)($, F, V, G, K);
            } catch (ce) {
              if (we(re), ce !== ce + 0) throw ce;
              Te(1, 0);
            }
          }, O: function(T, $, F, V, G, K, re) {
            var ce = ve();
            try {
              Pe(T)($, F, V, G, K, re);
            } catch (Se) {
              if (we(ce), Se !== Se + 0) throw Se;
              Te(1, 0);
            }
          }, A: function(T, $, F, V, G, K, re, ce) {
            var Se = ve();
            try {
              Pe(T)($, F, V, G, K, re, ce);
            } catch (Ae) {
              if (we(Se), Ae !== Ae + 0) throw Ae;
              Te(1, 0);
            }
          }, ka: function(T, $, F, V, G, K, re, ce, Se) {
            var Ae = ve();
            try {
              Pe(T)($, F, V, G, K, re, ce, Se);
            } catch (Le) {
              if (we(Ae), Le !== Le + 0) throw Le;
              Te(1, 0);
            }
          }, C: function(T, $, F, V, G, K, re, ce, Se, Ae, Le) {
            var at = ve();
            try {
              Pe(T)($, F, V, G, K, re, ce, Se, Ae, Le);
            } catch (nt) {
              if (we(at), nt !== nt + 0) throw nt;
              Te(1, 0);
            }
          }, D: function(T, $, F, V, G, K, re, ce, Se, Ae, Le, at, nt, J, De, je) {
            var dt = ve();
            try {
              Pe(T)($, F, V, G, K, re, ce, Se, Ae, Le, at, nt, J, De, je);
            } catch (Pt) {
              if (we(dt), Pt !== Pt + 0) throw Pt;
              Te(1, 0);
            }
          }, fa: function(T, $, F, V, G, K, re, ce) {
            var Se = ve();
            try {
              tn(T, $, F, V, G, K, re, ce);
            } catch (Ae) {
              if (we(Se), Ae !== Ae + 0) throw Ae;
              Te(1, 0);
            }
          }, da: function(T, $, F, V, G, K, re, ce, Se, Ae, Le, at) {
            var nt = ve();
            try {
              rn(T, $, F, V, G, K, re, ce, Se, Ae, Le, at);
            } catch (J) {
              if (we(nt), J !== J + 0) throw J;
              Te(1, 0);
            }
          }, ea: function(T, $, F, V, G, K) {
            var re = ve();
            try {
              nn(T, $, F, V, G, K);
            } catch (ce) {
              if (we(re), ce !== ce + 0) throw ce;
              Te(1, 0);
            }
          }, o: function(T) {
            return T;
          }, a: H || t.wasmMemory, G: function(T) {
            Ke = T;
          }, la: Bt, z: function(T, $, F, V) {
            return Bt(T, $, F, V);
          } };
          (function() {
            function T(G, K) {
              t.asm = G.exports, le.qc.push(t.asm.sb), Be = t.asm.ub, qe.unshift(t.asm.Va), te = K, R || (Ge--, t.monitorRunDependencies && t.monitorRunDependencies(Ge), Ge == 0 && Qe && (G = Qe, Qe = null, G()));
            }
            function $(G) {
              T(G.instance, G.module);
            }
            function F(G) {
              return function() {
                if (!N && (A || P)) {
                  if (typeof fetch == "function" && !ke.startsWith("file://")) return fetch(ke, { credentials: "same-origin" }).then(function(K) {
                    if (!K.ok) throw "failed to load wasm binary file at '" + ke + "'";
                    return K.arrayBuffer();
                  }).catch(function() {
                    return st();
                  });
                  if (s) return new Promise(function(K, re) {
                    s(ke, function(ce) {
                      K(new Uint8Array(ce));
                    }, re);
                  });
                }
                return Promise.resolve().then(function() {
                  return st();
                });
              }().then(function(K) {
                return WebAssembly.instantiate(K, V);
              }).then(function(K) {
                return K;
              }).then(G, function(K) {
                M("failed to asynchronously prepare wasm: " + K), _e(K);
              });
            }
            var V = { a: dn };
            if (R || (Ge++, t.monitorRunDependencies && t.monitorRunDependencies(Ge)), t.instantiateWasm) try {
              return t.instantiateWasm(V, T);
            } catch (G) {
              return M("Module.instantiateWasm callback failed with error: " + G), !1;
            }
            (N || typeof WebAssembly.instantiateStreaming != "function" || pt() || ke.startsWith("file://") || v || typeof fetch != "function" ? F($) : fetch(ke, { credentials: "same-origin" }).then(function(G) {
              return WebAssembly.instantiateStreaming(G, V).then($, function(K) {
                return M("wasm streaming compile failed: " + K), M("falling back to ArrayBuffer instantiation"), F($);
              });
            })).catch(n);
          })(), t.___wasm_call_ctors = function() {
            return (t.___wasm_call_ctors = t.asm.Va).apply(null, arguments);
          }, t._OrtInit = function() {
            return (t._OrtInit = t.asm.Wa).apply(null, arguments);
          }, t._OrtCreateSessionOptions = function() {
            return (t._OrtCreateSessionOptions = t.asm.Xa).apply(null, arguments);
          }, t._OrtAppendExecutionProvider = function() {
            return (t._OrtAppendExecutionProvider = t.asm.Ya).apply(null, arguments);
          }, t._OrtAddSessionConfigEntry = function() {
            return (t._OrtAddSessionConfigEntry = t.asm.Za).apply(null, arguments);
          }, t._OrtReleaseSessionOptions = function() {
            return (t._OrtReleaseSessionOptions = t.asm._a).apply(null, arguments);
          }, t._OrtCreateSession = function() {
            return (t._OrtCreateSession = t.asm.$a).apply(null, arguments);
          }, t._OrtReleaseSession = function() {
            return (t._OrtReleaseSession = t.asm.ab).apply(null, arguments);
          }, t._OrtGetInputCount = function() {
            return (t._OrtGetInputCount = t.asm.bb).apply(null, arguments);
          }, t._OrtGetOutputCount = function() {
            return (t._OrtGetOutputCount = t.asm.cb).apply(null, arguments);
          }, t._OrtGetInputName = function() {
            return (t._OrtGetInputName = t.asm.db).apply(null, arguments);
          }, t._OrtGetOutputName = function() {
            return (t._OrtGetOutputName = t.asm.eb).apply(null, arguments);
          }, t._OrtFree = function() {
            return (t._OrtFree = t.asm.fb).apply(null, arguments);
          }, t._OrtCreateTensor = function() {
            return (t._OrtCreateTensor = t.asm.gb).apply(null, arguments);
          }, t._OrtGetTensorData = function() {
            return (t._OrtGetTensorData = t.asm.hb).apply(null, arguments);
          }, t._OrtReleaseTensor = function() {
            return (t._OrtReleaseTensor = t.asm.ib).apply(null, arguments);
          }, t._OrtCreateRunOptions = function() {
            return (t._OrtCreateRunOptions = t.asm.jb).apply(null, arguments);
          }, t._OrtAddRunConfigEntry = function() {
            return (t._OrtAddRunConfigEntry = t.asm.kb).apply(null, arguments);
          }, t._OrtReleaseRunOptions = function() {
            return (t._OrtReleaseRunOptions = t.asm.lb).apply(null, arguments);
          }, t._OrtRun = function() {
            return (t._OrtRun = t.asm.mb).apply(null, arguments);
          }, t._OrtEndProfiling = function() {
            return (t._OrtEndProfiling = t.asm.nb).apply(null, arguments);
          };
          var $t = t._pthread_self = function() {
            return ($t = t._pthread_self = t.asm.ob).apply(null, arguments);
          }, Mt = t._malloc = function() {
            return (Mt = t._malloc = t.asm.pb).apply(null, arguments);
          }, zt = t._free = function() {
            return (zt = t._free = t.asm.qb).apply(null, arguments);
          }, Gt = t._fflush = function() {
            return (Gt = t._fflush = t.asm.rb).apply(null, arguments);
          };
          t.__emscripten_tls_init = function() {
            return (t.__emscripten_tls_init = t.asm.sb).apply(null, arguments);
          };
          var qt = t.___funcs_on_exit = function() {
            return (qt = t.___funcs_on_exit = t.asm.tb).apply(null, arguments);
          }, Wt = t.__emscripten_thread_init = function() {
            return (Wt = t.__emscripten_thread_init = t.asm.vb).apply(null, arguments);
          };
          t.__emscripten_thread_crashed = function() {
            return (t.__emscripten_thread_crashed = t.asm.wb).apply(null, arguments);
          };
          var Rt, Ht = t._emscripten_run_in_main_runtime_thread_js = function() {
            return (Ht = t._emscripten_run_in_main_runtime_thread_js = t.asm.xb).apply(null, arguments);
          }, Yt = t.__emscripten_proxy_execute_task_queue = function() {
            return (Yt = t.__emscripten_proxy_execute_task_queue = t.asm.yb).apply(null, arguments);
          }, Nt = t.__emscripten_thread_free_data = function() {
            return (Nt = t.__emscripten_thread_free_data = t.asm.zb).apply(null, arguments);
          }, Xt = t.__emscripten_thread_exit = function() {
            return (Xt = t.__emscripten_thread_exit = t.asm.Ab).apply(null, arguments);
          }, Te = t._setThrew = function() {
            return (Te = t._setThrew = t.asm.Bb).apply(null, arguments);
          }, Kt = t._emscripten_stack_set_limits = function() {
            return (Kt = t._emscripten_stack_set_limits = t.asm.Cb).apply(null, arguments);
          }, ve = t.stackSave = function() {
            return (ve = t.stackSave = t.asm.Db).apply(null, arguments);
          }, we = t.stackRestore = function() {
            return (we = t.stackRestore = t.asm.Eb).apply(null, arguments);
          }, jt = t.stackAlloc = function() {
            return (jt = t.stackAlloc = t.asm.Fb).apply(null, arguments);
          }, Ct = t.___cxa_can_catch = function() {
            return (Ct = t.___cxa_can_catch = t.asm.Gb).apply(null, arguments);
          }, Jt = t.___cxa_is_pointer_type = function() {
            return (Jt = t.___cxa_is_pointer_type = t.asm.Hb).apply(null, arguments);
          }, Zt = t.dynCall_j = function() {
            return (Zt = t.dynCall_j = t.asm.Ib).apply(null, arguments);
          }, Qt = t.dynCall_iiiiij = function() {
            return (Qt = t.dynCall_iiiiij = t.asm.Jb).apply(null, arguments);
          }, en = t.dynCall_jii = function() {
            return (en = t.dynCall_jii = t.asm.Kb).apply(null, arguments);
          }, tn = t.dynCall_viiiiij = function() {
            return (tn = t.dynCall_viiiiij = t.asm.Lb).apply(null, arguments);
          }, nn = t.dynCall_vjji = function() {
            return (nn = t.dynCall_vjji = t.asm.Mb).apply(null, arguments);
          }, rn = t.dynCall_viiijjjii = function() {
            return (rn = t.dynCall_viiijjjii = t.asm.Nb).apply(null, arguments);
          }, on = t.dynCall_iij = function() {
            return (on = t.dynCall_iij = t.asm.Ob).apply(null, arguments);
          }, an = t.dynCall_ji = function() {
            return (an = t.dynCall_ji = t.asm.Pb).apply(null, arguments);
          }, sn = t.dynCall_iiiiiij = function() {
            return (sn = t.dynCall_iiiiiij = t.asm.Qb).apply(null, arguments);
          }, un = t.dynCall_iiij = function() {
            return (un = t.dynCall_iiij = t.asm.Rb).apply(null, arguments);
          };
          function cn() {
            function T() {
              if (!Rt && (Rt = !0, t.calledRun = !0, !me) && (R || it(qe), e(t), t.onRuntimeInitialized && t.onRuntimeInitialized(), !R)) {
                if (t.postRun) for (typeof t.postRun == "function" && (t.postRun = [t.postRun]); t.postRun.length; ) {
                  var $ = t.postRun.shift();
                  He.unshift($);
                }
                it(He);
              }
            }
            if (!(0 < Ge)) if (R) e(t), R || it(qe), postMessage({ cmd: "loaded" });
            else {
              if (t.preRun) for (typeof t.preRun == "function" && (t.preRun = [t.preRun]); t.preRun.length; ) We();
              it(ze), 0 < Ge || (t.setStatus ? (t.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  t.setStatus("");
                }, 1), T();
              }, 1)) : T());
            }
          }
          if (t.UTF8ToString = de, t.stringToUTF8 = function(T, $, F) {
            return Ee(T, c(), $, F);
          }, t.lengthBytesUTF8 = Ie, t.keepRuntimeAlive = Ye, t.wasmMemory = H, t.stackSave = ve, t.stackRestore = we, t.stackAlloc = jt, t.ExitStatus = et, t.PThread = le, Qe = function T() {
            Rt || cn(), Rt || (Qe = T);
          }, t.preInit) for (typeof t.preInit == "function" && (t.preInit = [t.preInit]); 0 < t.preInit.length; ) t.preInit.pop()();
          return cn(), g.ready;
        });
        C.exports = p;
      }, 932: (C, u, b) => {
        var h, p = (h = (h = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0) || "/index.js", function(g) {
          var o, c, f;
          g = g || {}, o || (o = g !== void 0 ? g : {}), o.ready = new Promise(function(I, k) {
            c = I, f = k;
          });
          var a, i, t, e, n, r, s = Object.assign({}, o), l = "./this.program", d = (I, k) => {
            throw k;
          }, m = typeof window == "object", y = typeof importScripts == "function", w = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", _ = "";
          w ? (_ = y ? b(908).dirname(_) + "/" : "//", r = () => {
            n || (e = b(1384), n = b(908));
          }, a = function(I, k) {
            return r(), I = n.normalize(I), e.readFileSync(I, k ? void 0 : "utf8");
          }, t = (I) => ((I = a(I, !0)).buffer || (I = new Uint8Array(I)), I), i = (I, k, L) => {
            r(), I = n.normalize(I), e.readFile(I, function(U, z) {
              U ? L(U) : k(z.buffer);
            });
          }, 1 < process.argv.length && (l = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), process.on("uncaughtException", function(I) {
            if (!(I instanceof qe)) throw I;
          }), process.on("unhandledRejection", function(I) {
            throw I;
          }), d = (I, k) => {
            if (v || 0 < Re) throw process.exitCode = I, k;
            k instanceof qe || P("exiting due to exception: " + k), process.exit(I);
          }, o.inspect = function() {
            return "[Emscripten Module object]";
          }) : (m || y) && (y ? _ = self.location.href : typeof document < "u" && document.currentScript && (_ = document.currentScript.src), h && (_ = h), _ = _.indexOf("blob:") !== 0 ? _.substr(0, _.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", a = (I) => {
            var k = new XMLHttpRequest();
            return k.open("GET", I, !1), k.send(null), k.responseText;
          }, y && (t = (I) => {
            var k = new XMLHttpRequest();
            return k.open("GET", I, !1), k.responseType = "arraybuffer", k.send(null), new Uint8Array(k.response);
          }), i = (I, k, L) => {
            var U = new XMLHttpRequest();
            U.open("GET", I, !0), U.responseType = "arraybuffer", U.onload = () => {
              U.status == 200 || U.status == 0 && U.response ? k(U.response) : L();
            }, U.onerror = L, U.send(null);
          });
          var S, A = o.print || console.log.bind(console), P = o.printErr || console.warn.bind(console);
          Object.assign(o, s), s = null, o.thisProgram && (l = o.thisProgram), o.quit && (d = o.quit), o.wasmBinary && (S = o.wasmBinary);
          var v = o.noExitRuntime || !1;
          typeof WebAssembly != "object" && $e("no native wasm support detected");
          var R, B, q, D, O, N, E = !1, M = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
          function Y(I, k, L) {
            var U = (k >>>= 0) + L;
            for (L = k; I[L] && !(L >= U); ) ++L;
            if (16 < L - k && I.buffer && M) return M.decode(I.subarray(k, L));
            for (U = ""; k < L; ) {
              var z = I[k++];
              if (128 & z) {
                var W = 63 & I[k++];
                if ((224 & z) == 192) U += String.fromCharCode((31 & z) << 6 | W);
                else {
                  var Q = 63 & I[k++];
                  65536 > (z = (240 & z) == 224 ? (15 & z) << 12 | W << 6 | Q : (7 & z) << 18 | W << 12 | Q << 6 | 63 & I[k++]) ? U += String.fromCharCode(z) : (z -= 65536, U += String.fromCharCode(55296 | z >> 10, 56320 | 1023 & z));
                }
              } else U += String.fromCharCode(z);
            }
            return U;
          }
          function H(I, k) {
            return (I >>>= 0) ? Y(D, I, k) : "";
          }
          function te(I, k, L, U) {
            if (!(0 < U)) return 0;
            var z = L >>>= 0;
            U = L + U - 1;
            for (var W = 0; W < I.length; ++W) {
              var Q = I.charCodeAt(W);
              if (55296 <= Q && 57343 >= Q && (Q = 65536 + ((1023 & Q) << 10) | 1023 & I.charCodeAt(++W)), 127 >= Q) {
                if (L >= U) break;
                k[L++ >>> 0] = Q;
              } else {
                if (2047 >= Q) {
                  if (L + 1 >= U) break;
                  k[L++ >>> 0] = 192 | Q >> 6;
                } else {
                  if (65535 >= Q) {
                    if (L + 2 >= U) break;
                    k[L++ >>> 0] = 224 | Q >> 12;
                  } else {
                    if (L + 3 >= U) break;
                    k[L++ >>> 0] = 240 | Q >> 18, k[L++ >>> 0] = 128 | Q >> 12 & 63;
                  }
                  k[L++ >>> 0] = 128 | Q >> 6 & 63;
                }
                k[L++ >>> 0] = 128 | 63 & Q;
              }
            }
            return k[L >>> 0] = 0, L - z;
          }
          function Z(I) {
            for (var k = 0, L = 0; L < I.length; ++L) {
              var U = I.charCodeAt(L);
              127 >= U ? k++ : 2047 >= U ? k += 2 : 55296 <= U && 57343 >= U ? (k += 4, ++L) : k += 3;
            }
            return k;
          }
          function ne() {
            var I = R.buffer;
            B = I, o.HEAP8 = q = new Int8Array(I), o.HEAP16 = new Int16Array(I), o.HEAP32 = O = new Int32Array(I), o.HEAPU8 = D = new Uint8Array(I), o.HEAPU16 = new Uint16Array(I), o.HEAPU32 = N = new Uint32Array(I), o.HEAPF32 = new Float32Array(I), o.HEAPF64 = new Float64Array(I);
          }
          var ue, ye = [], oe = [], be = [], me = [], Re = 0;
          function Ve() {
            var I = o.preRun.shift();
            ye.unshift(I);
          }
          var de, Ee = 0, Ie = null;
          function $e(I) {
            throw o.onAbort && o.onAbort(I), P(I = "Aborted(" + I + ")"), E = !0, I = new WebAssembly.RuntimeError(I + ". Build with -sASSERTIONS for more info."), f(I), I;
          }
          function Fe() {
            return de.startsWith("data:application/octet-stream;base64,");
          }
          if (de = "ort-wasm.wasm", !Fe()) {
            var Be = de;
            de = o.locateFile ? o.locateFile(Be, _) : _ + Be;
          }
          function ze() {
            var I = de;
            try {
              if (I == de && S) return new Uint8Array(S);
              if (t) return t(I);
              throw "both async and sync fetching of the wasm failed";
            } catch (k) {
              $e(k);
            }
          }
          function qe(I) {
            this.name = "ExitStatus", this.message = "Program terminated with exit(" + I + ")", this.status = I;
          }
          function Je(I) {
            for (; 0 < I.length; ) I.shift()(o);
          }
          var He = [], Ye = 0, We = 0;
          function ke(I) {
            this.Db = I, this.zb = I - 24, this.Ub = function(k) {
              N[this.zb + 4 >> 2 >>> 0] = k;
            }, this.Eb = function() {
              return N[this.zb + 4 >> 2 >>> 0];
            }, this.Sb = function(k) {
              N[this.zb + 8 >> 2 >>> 0] = k;
            }, this.Wb = function() {
              return N[this.zb + 8 >> 2 >>> 0];
            }, this.Tb = function() {
              O[this.zb >> 2 >>> 0] = 0;
            }, this.Ib = function(k) {
              q[this.zb + 12 >> 0 >>> 0] = k ? 1 : 0;
            }, this.Pb = function() {
              return q[this.zb + 12 >> 0 >>> 0] != 0;
            }, this.Jb = function(k) {
              q[this.zb + 13 >> 0 >>> 0] = k ? 1 : 0;
            }, this.Lb = function() {
              return q[this.zb + 13 >> 0 >>> 0] != 0;
            }, this.Rb = function(k, L) {
              this.Fb(0), this.Ub(k), this.Sb(L), this.Tb(), this.Ib(!1), this.Jb(!1);
            }, this.Nb = function() {
              O[this.zb >> 2 >>> 0] += 1;
            }, this.Xb = function() {
              var k = O[this.zb >> 2 >>> 0];
              return O[this.zb >> 2 >>> 0] = k - 1, k === 1;
            }, this.Fb = function(k) {
              N[this.zb + 16 >> 2 >>> 0] = k;
            }, this.Ob = function() {
              return N[this.zb + 16 >> 2 >>> 0];
            }, this.Qb = function() {
              if (gt(this.Eb())) return N[this.Db >> 2 >>> 0];
              var k = this.Ob();
              return k !== 0 ? k : this.Db;
            };
          }
          function Ge(I) {
            return Xe(new ke(I).zb);
          }
          var Qe = [];
          function _e(I) {
            var k = Qe[I];
            return k || (I >= Qe.length && (Qe.length = I + 1), Qe[I] = k = ue.get(I)), k;
          }
          function pt(I) {
            var k = Z(I) + 1, L = Pe(k);
            return L && te(I, q, L, k), L;
          }
          var st = {};
          function At() {
            if (!et) {
              var I, k = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: l || "./this.program" };
              for (I in st) st[I] === void 0 ? delete k[I] : k[I] = st[I];
              var L = [];
              for (I in k) L.push(I + "=" + k[I]);
              et = L;
            }
            return et;
          }
          var et, ut = [null, [], []];
          function ht(I, k) {
            var L = ut[I];
            k === 0 || k === 10 ? ((I === 1 ? A : P)(Y(L, 0)), L.length = 0) : L.push(k);
          }
          var Ue = 0;
          function ct(I) {
            return I % 4 == 0 && (I % 100 != 0 || I % 400 == 0);
          }
          var le = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], it = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          function Et(I, k, L, U) {
            function z(X, xe, Me) {
              for (X = typeof X == "number" ? X.toString() : X || ""; X.length < xe; ) X = Me[0] + X;
              return X;
            }
            function W(X, xe) {
              return z(X, xe, "0");
            }
            function Q(X, xe) {
              function Me(ft) {
                return 0 > ft ? -1 : 0 < ft ? 1 : 0;
              }
              var tt;
              return (tt = Me(X.getFullYear() - xe.getFullYear())) === 0 && (tt = Me(X.getMonth() - xe.getMonth())) === 0 && (tt = Me(X.getDate() - xe.getDate())), tt;
            }
            function ae(X) {
              switch (X.getDay()) {
                case 0:
                  return new Date(X.getFullYear() - 1, 11, 29);
                case 1:
                  return X;
                case 2:
                  return new Date(X.getFullYear(), 0, 3);
                case 3:
                  return new Date(X.getFullYear(), 0, 2);
                case 4:
                  return new Date(X.getFullYear(), 0, 1);
                case 5:
                  return new Date(X.getFullYear() - 1, 11, 31);
                case 6:
                  return new Date(X.getFullYear() - 1, 11, 30);
              }
            }
            function ie(X) {
              var xe = X.Bb;
              for (X = new Date(new Date(X.Cb + 1900, 0, 1).getTime()); 0 < xe; ) {
                var Me = X.getMonth(), tt = (ct(X.getFullYear()) ? le : it)[Me];
                if (!(xe > tt - X.getDate())) {
                  X.setDate(X.getDate() + xe);
                  break;
                }
                xe -= tt - X.getDate() + 1, X.setDate(1), 11 > Me ? X.setMonth(Me + 1) : (X.setMonth(0), X.setFullYear(X.getFullYear() + 1));
              }
              return Me = new Date(X.getFullYear() + 1, 0, 4), xe = ae(new Date(X.getFullYear(), 0, 4)), Me = ae(Me), 0 >= Q(xe, X) ? 0 >= Q(Me, X) ? X.getFullYear() + 1 : X.getFullYear() : X.getFullYear() - 1;
            }
            var he = O[U + 40 >> 2 >>> 0];
            for (var Oe in U = { $b: O[U >> 2 >>> 0], Zb: O[U + 4 >> 2 >>> 0], Gb: O[U + 8 >> 2 >>> 0], Kb: O[U + 12 >> 2 >>> 0], Hb: O[U + 16 >> 2 >>> 0], Cb: O[U + 20 >> 2 >>> 0], Ab: O[U + 24 >> 2 >>> 0], Bb: O[U + 28 >> 2 >>> 0], bc: O[U + 32 >> 2 >>> 0], Yb: O[U + 36 >> 2 >>> 0], ac: he ? H(he) : "" }, L = H(L), he = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" }) L = L.replace(new RegExp(Oe, "g"), he[Oe]);
            var Ce = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), Ne = "January February March April May June July August September October November December".split(" ");
            for (Oe in he = { "%a": function(X) {
              return Ce[X.Ab].substring(0, 3);
            }, "%A": function(X) {
              return Ce[X.Ab];
            }, "%b": function(X) {
              return Ne[X.Hb].substring(0, 3);
            }, "%B": function(X) {
              return Ne[X.Hb];
            }, "%C": function(X) {
              return W((X.Cb + 1900) / 100 | 0, 2);
            }, "%d": function(X) {
              return W(X.Kb, 2);
            }, "%e": function(X) {
              return z(X.Kb, 2, " ");
            }, "%g": function(X) {
              return ie(X).toString().substring(2);
            }, "%G": function(X) {
              return ie(X);
            }, "%H": function(X) {
              return W(X.Gb, 2);
            }, "%I": function(X) {
              return (X = X.Gb) == 0 ? X = 12 : 12 < X && (X -= 12), W(X, 2);
            }, "%j": function(X) {
              for (var xe = 0, Me = 0; Me <= X.Hb - 1; xe += (ct(X.Cb + 1900) ? le : it)[Me++]) ;
              return W(X.Kb + xe, 3);
            }, "%m": function(X) {
              return W(X.Hb + 1, 2);
            }, "%M": function(X) {
              return W(X.Zb, 2);
            }, "%n": function() {
              return `
`;
            }, "%p": function(X) {
              return 0 <= X.Gb && 12 > X.Gb ? "AM" : "PM";
            }, "%S": function(X) {
              return W(X.$b, 2);
            }, "%t": function() {
              return "	";
            }, "%u": function(X) {
              return X.Ab || 7;
            }, "%U": function(X) {
              return W(Math.floor((X.Bb + 7 - X.Ab) / 7), 2);
            }, "%V": function(X) {
              var xe = Math.floor((X.Bb + 7 - (X.Ab + 6) % 7) / 7);
              if (2 >= (X.Ab + 371 - X.Bb - 2) % 7 && xe++, xe) xe == 53 && ((Me = (X.Ab + 371 - X.Bb) % 7) == 4 || Me == 3 && ct(X.Cb) || (xe = 1));
              else {
                xe = 52;
                var Me = (X.Ab + 7 - X.Bb - 1) % 7;
                (Me == 4 || Me == 5 && ct(X.Cb % 400 - 1)) && xe++;
              }
              return W(xe, 2);
            }, "%w": function(X) {
              return X.Ab;
            }, "%W": function(X) {
              return W(Math.floor((X.Bb + 7 - (X.Ab + 6) % 7) / 7), 2);
            }, "%y": function(X) {
              return (X.Cb + 1900).toString().substring(2);
            }, "%Y": function(X) {
              return X.Cb + 1900;
            }, "%z": function(X) {
              var xe = 0 <= (X = X.Yb);
              return X = Math.abs(X) / 60, (xe ? "+" : "-") + ("0000" + (X / 60 * 100 + X % 60)).slice(-4);
            }, "%Z": function(X) {
              return X.ac;
            }, "%%": function() {
              return "%";
            } }, L = L.replace(/%%/g, "\0\0"), he) L.includes(Oe) && (L = L.replace(new RegExp(Oe, "g"), he[Oe](U)));
            return Oe = function(X) {
              var xe = Array(Z(X) + 1);
              return te(X, xe, 0, xe.length), xe;
            }(L = L.replace(/\0\0/g, "%")), Oe.length > k ? 0 : (q.set(Oe, I >>> 0), Oe.length - 1);
          }
          var It = { a: function(I) {
            return Pe(I + 24) + 24;
          }, m: function(I) {
            return (I = new ke(I)).Pb() || (I.Ib(!0), Ye--), I.Jb(!1), He.push(I), I.Nb(), I.Qb();
          }, ia: function(I) {
            throw P("Unexpected exception thrown, this is not properly supported - aborting"), E = !0, I;
          }, w: function() {
            ge(0);
            var I = He.pop();
            if (I.Xb() && !I.Lb()) {
              var k = I.Wb();
              k && _e(k)(I.Db), Ge(I.Db);
            }
            We = 0;
          }, d: function() {
            var I = We;
            if (!I) return Ue = 0;
            var k = new ke(I);
            k.Fb(I);
            var L = k.Eb();
            if (!L) return Ue = 0, I;
            for (var U = Array.prototype.slice.call(arguments), z = 0; z < U.length; z++) {
              var W = U[z];
              if (W === 0 || W === L) break;
              if (ot(W, L, k.zb + 16)) return Ue = W, I;
            }
            return Ue = L, I;
          }, k: function() {
            var I = We;
            if (!I) return Ue = 0;
            var k = new ke(I);
            k.Fb(I);
            var L = k.Eb();
            if (!L) return Ue = 0, I;
            for (var U = Array.prototype.slice.call(arguments), z = 0; z < U.length; z++) {
              var W = U[z];
              if (W === 0 || W === L) break;
              if (ot(W, L, k.zb + 16)) return Ue = W, I;
            }
            return Ue = L, I;
          }, g: function() {
            var I = We;
            if (!I) return Ue = 0;
            var k = new ke(I);
            k.Fb(I);
            var L = k.Eb();
            if (!L) return Ue = 0, I;
            for (var U = Array.prototype.slice.call(arguments), z = 0; z < U.length; z++) {
              var W = U[z];
              if (W === 0 || W === L) break;
              if (ot(W, L, k.zb + 16)) return Ue = W, I;
            }
            return Ue = L, I;
          }, s: Ge, L: function() {
            var I = He.pop();
            I || $e("no exception to throw");
            var k = I.Db;
            throw I.Lb() || (He.push(I), I.Jb(!0), I.Ib(!1), Ye++), We = k, k;
          }, b: function(I, k, L) {
            throw new ke(I).Rb(k, L), We = I, Ye++, I;
          }, la: function() {
            return Ye;
          }, i: function(I) {
            throw We || (We = I), I;
          }, H: function() {
            return 0;
          }, Ba: function() {
          }, pa: function() {
          }, ra: function() {
          }, ka: function() {
            return 0;
          }, za: function() {
          }, ua: function() {
          }, ya: function() {
          }, R: function() {
          }, qa: function() {
          }, na: function() {
          }, Aa: function() {
          }, oa: function() {
          }, Ha: function() {
          }, Ja: function() {
            $e("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
          }, Ia: function() {
            $e("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
          }, S: function() {
            return Date.now();
          }, Ca: function() {
            return !0;
          }, Da: function(I, k) {
            I = new Date(1e3 * (N[I >>> 2] + 4294967296 * O[I + 4 >>> 2])), O[k >> 2 >>> 0] = I.getUTCSeconds(), O[k + 4 >> 2 >>> 0] = I.getUTCMinutes(), O[k + 8 >> 2 >>> 0] = I.getUTCHours(), O[k + 12 >> 2 >>> 0] = I.getUTCDate(), O[k + 16 >> 2 >>> 0] = I.getUTCMonth(), O[k + 20 >> 2 >>> 0] = I.getUTCFullYear() - 1900, O[k + 24 >> 2 >>> 0] = I.getUTCDay(), O[k + 28 >> 2 >>> 0] = (I.getTime() - Date.UTC(I.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0;
          }, Ea: function(I, k) {
            I = new Date(1e3 * (N[I >>> 2] + 4294967296 * O[I + 4 >>> 2])), O[k >> 2 >>> 0] = I.getSeconds(), O[k + 4 >> 2 >>> 0] = I.getMinutes(), O[k + 8 >> 2 >>> 0] = I.getHours(), O[k + 12 >> 2 >>> 0] = I.getDate(), O[k + 16 >> 2 >>> 0] = I.getMonth(), O[k + 20 >> 2 >>> 0] = I.getFullYear() - 1900, O[k + 24 >> 2 >>> 0] = I.getDay();
            var L = new Date(I.getFullYear(), 0, 1);
            O[k + 28 >> 2 >>> 0] = (I.getTime() - L.getTime()) / 864e5 | 0, O[k + 36 >> 2 >>> 0] = -60 * I.getTimezoneOffset();
            var U = new Date(I.getFullYear(), 6, 1).getTimezoneOffset();
            L = L.getTimezoneOffset(), O[k + 32 >> 2 >>> 0] = 0 | (U != L && I.getTimezoneOffset() == Math.min(L, U));
          }, Fa: function(I) {
            var k = new Date(O[I + 20 >> 2 >>> 0] + 1900, O[I + 16 >> 2 >>> 0], O[I + 12 >> 2 >>> 0], O[I + 8 >> 2 >>> 0], O[I + 4 >> 2 >>> 0], O[I >> 2 >>> 0], 0), L = O[I + 32 >> 2 >>> 0], U = k.getTimezoneOffset(), z = new Date(k.getFullYear(), 0, 1), W = new Date(k.getFullYear(), 6, 1).getTimezoneOffset(), Q = z.getTimezoneOffset(), ae = Math.min(Q, W);
            return 0 > L ? O[I + 32 >> 2 >>> 0] = +(W != Q && ae == U) : 0 < L != (ae == U) && (W = Math.max(Q, W), k.setTime(k.getTime() + 6e4 * ((0 < L ? ae : W) - U))), O[I + 24 >> 2 >>> 0] = k.getDay(), O[I + 28 >> 2 >>> 0] = (k.getTime() - z.getTime()) / 864e5 | 0, O[I >> 2 >>> 0] = k.getSeconds(), O[I + 4 >> 2 >>> 0] = k.getMinutes(), O[I + 8 >> 2 >>> 0] = k.getHours(), O[I + 12 >> 2 >>> 0] = k.getDate(), O[I + 16 >> 2 >>> 0] = k.getMonth(), k.getTime() / 1e3 | 0;
          }, sa: function() {
            return -52;
          }, ta: function() {
          }, Ga: function I(k, L, U) {
            I.Vb || (I.Vb = !0, function(z, W, Q) {
              function ae(Ne) {
                return (Ne = Ne.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? Ne[1] : "GMT";
              }
              var ie = (/* @__PURE__ */ new Date()).getFullYear(), he = new Date(ie, 0, 1), Oe = new Date(ie, 6, 1);
              ie = he.getTimezoneOffset();
              var Ce = Oe.getTimezoneOffset();
              O[z >> 2 >>> 0] = 60 * Math.max(ie, Ce), O[W >> 2 >>> 0] = +(ie != Ce), z = ae(he), W = ae(Oe), z = pt(z), W = pt(W), Ce < ie ? (N[Q >> 2 >>> 0] = z, N[Q + 4 >> 2 >>> 0] = W) : (N[Q >> 2 >>> 0] = W, N[Q + 4 >> 2 >>> 0] = z);
            }(k, L, U));
          }, B: function() {
            $e("");
          }, ma: function() {
            return 4294901760;
          }, I: w ? () => {
            var I = process.hrtime();
            return 1e3 * I[0] + I[1] / 1e6;
          } : () => performance.now(), xa: function(I, k, L) {
            D.copyWithin(I >>> 0, k >>> 0, k + L >>> 0);
          }, G: function(I) {
            var k = D.length;
            if (4294901760 < (I >>>= 0)) return !1;
            for (var L = 1; 4 >= L; L *= 2) {
              var U = k * (1 + 0.2 / L);
              U = Math.min(U, I + 100663296);
              var z = Math;
              U = Math.max(I, U), z = z.min.call(z, 4294901760, U + (65536 - U % 65536) % 65536);
              e: {
                try {
                  R.grow(z - B.byteLength + 65535 >>> 16), ne();
                  var W = 1;
                  break e;
                } catch {
                }
                W = void 0;
              }
              if (W) return !0;
            }
            return !1;
          }, va: function(I, k) {
            var L = 0;
            return At().forEach(function(U, z) {
              var W = k + L;
              for (z = N[I + 4 * z >> 2 >>> 0] = W, W = 0; W < U.length; ++W) q[z++ >> 0 >>> 0] = U.charCodeAt(W);
              q[z >> 0 >>> 0] = 0, L += U.length + 1;
            }), 0;
          }, wa: function(I, k) {
            var L = At();
            N[I >> 2 >>> 0] = L.length;
            var U = 0;
            return L.forEach(function(z) {
              U += z.length + 1;
            }), N[k >> 2 >>> 0] = U, 0;
          }, ba: function(I) {
            v || 0 < Re || (rt(), Je(be), lt(0), ut[1].length && ht(1, 10), ut[2].length && ht(2, 10)), v || 0 < Re || (o.onExit && o.onExit(I), E = !0), d(I, new qe(I));
          }, E: function() {
            return 52;
          }, Q: function() {
            return 52;
          }, ca: function() {
            return 70;
          }, P: function(I, k, L, U) {
            for (var z = 0, W = 0; W < L; W++) {
              var Q = N[k >> 2 >>> 0], ae = N[k + 4 >> 2 >>> 0];
              k += 8;
              for (var ie = 0; ie < ae; ie++) ht(I, D[Q + ie >>> 0]);
              z += ae;
            }
            return N[U >> 2 >>> 0] = z, 0;
          }, c: function() {
            return Ue;
          }, ja: function I(k, L) {
            I.Mb || (I.Mb = function() {
              if (typeof crypto == "object" && typeof crypto.getRandomValues == "function") {
                var z = new Uint8Array(1);
                return () => (crypto.getRandomValues(z), z[0]);
              }
              if (w) try {
                var W = b(Object(function() {
                  var Q = new Error("Cannot find module 'crypto'");
                  throw Q.code = "MODULE_NOT_FOUND", Q;
                }()));
                return () => W.randomBytes(1)[0];
              } catch {
              }
              return () => $e("randomDevice");
            }());
            for (var U = 0; U < L; U++) q[k + U >> 0 >>> 0] = I.Mb();
            return 0;
          }, ea: function(I, k, L) {
            var U = fe();
            try {
              return _e(I)(k, L);
            } catch (z) {
              if (pe(U), z !== z + 0) throw z;
              ge(1, 0);
            }
          }, fa: function(I, k, L) {
            var U = fe();
            try {
              return _e(I)(k, L);
            } catch (z) {
              if (pe(U), z !== z + 0) throw z;
              ge(1, 0);
            }
          }, J: function(I) {
            var k = fe();
            try {
              return _e(I)();
            } catch (L) {
              if (pe(k), L !== L + 0) throw L;
              ge(1, 0);
            }
          }, e: function(I, k) {
            var L = fe();
            try {
              return _e(I)(k);
            } catch (U) {
              if (pe(L), U !== U + 0) throw U;
              ge(1, 0);
            }
          }, N: function(I, k, L) {
            var U = fe();
            try {
              return _e(I)(k, L);
            } catch (z) {
              if (pe(U), z !== z + 0) throw z;
              ge(1, 0);
            }
          }, O: function(I, k, L) {
            var U = fe();
            try {
              return _e(I)(k, L);
            } catch (z) {
              if (pe(U), z !== z + 0) throw z;
              ge(1, 0);
            }
          }, j: function(I, k, L) {
            var U = fe();
            try {
              return _e(I)(k, L);
            } catch (z) {
              if (pe(U), z !== z + 0) throw z;
              ge(1, 0);
            }
          }, o: function(I, k, L, U) {
            var z = fe();
            try {
              return _e(I)(k, L, U);
            } catch (W) {
              if (pe(z), W !== W + 0) throw W;
              ge(1, 0);
            }
          }, p: function(I, k, L, U, z) {
            var W = fe();
            try {
              return _e(I)(k, L, U, z);
            } catch (Q) {
              if (pe(W), Q !== Q + 0) throw Q;
              ge(1, 0);
            }
          }, M: function(I, k, L, U, z, W) {
            var Q = fe();
            try {
              return _e(I)(k, L, U, z, W);
            } catch (ae) {
              if (pe(Q), ae !== ae + 0) throw ae;
              ge(1, 0);
            }
          }, r: function(I, k, L, U, z, W) {
            var Q = fe();
            try {
              return _e(I)(k, L, U, z, W);
            } catch (ae) {
              if (pe(Q), ae !== ae + 0) throw ae;
              ge(1, 0);
            }
          }, v: function(I, k, L, U, z, W, Q) {
            var ae = fe();
            try {
              return _e(I)(k, L, U, z, W, Q);
            } catch (ie) {
              if (pe(ae), ie !== ie + 0) throw ie;
              ge(1, 0);
            }
          }, K: function(I, k, L, U, z, W, Q, ae) {
            var ie = fe();
            try {
              return _e(I)(k, L, U, z, W, Q, ae);
            } catch (he) {
              if (pe(ie), he !== he + 0) throw he;
              ge(1, 0);
            }
          }, D: function(I, k, L, U, z, W, Q, ae, ie, he, Oe, Ce) {
            var Ne = fe();
            try {
              return _e(I)(k, L, U, z, W, Q, ae, ie, he, Oe, Ce);
            } catch (X) {
              if (pe(Ne), X !== X + 0) throw X;
              ge(1, 0);
            }
          }, X: function(I, k, L, U, z, W, Q, ae) {
            var ie = fe();
            try {
              return j(I, k, L, U, z, W, Q, ae);
            } catch (he) {
              if (pe(ie), he !== he + 0) throw he;
              ge(1, 0);
            }
          }, V: function(I, k, L, U, z, W, Q) {
            var ae = fe();
            try {
              return wt(I, k, L, U, z, W, Q);
            } catch (ie) {
              if (pe(ae), ie !== ie + 0) throw ie;
              ge(1, 0);
            }
          }, U: function(I, k, L, U, z) {
            var W = fe();
            try {
              return ee(I, k, L, U, z);
            } catch (Q) {
              if (pe(W), Q !== Q + 0) throw Q;
              ge(1, 0);
            }
          }, Z: function(I, k, L, U) {
            var z = fe();
            try {
              return Tt(I, k, L, U);
            } catch (W) {
              if (pe(z), W !== W + 0) throw W;
              ge(1, 0);
            }
          }, W: function(I) {
            var k = fe();
            try {
              return _t(I);
            } catch (L) {
              if (pe(k), L !== L + 0) throw L;
              ge(1, 0);
            }
          }, Y: function(I, k) {
            var L = fe();
            try {
              return St(I, k);
            } catch (U) {
              if (pe(L), U !== U + 0) throw U;
              ge(1, 0);
            }
          }, T: function(I, k, L) {
            var U = fe();
            try {
              return mt(I, k, L);
            } catch (z) {
              if (pe(U), z !== z + 0) throw z;
              ge(1, 0);
            }
          }, f: function(I) {
            var k = fe();
            try {
              _e(I)();
            } catch (L) {
              if (pe(k), L !== L + 0) throw L;
              ge(1, 0);
            }
          }, q: function(I, k) {
            var L = fe();
            try {
              _e(I)(k);
            } catch (U) {
              if (pe(L), U !== U + 0) throw U;
              ge(1, 0);
            }
          }, h: function(I, k, L) {
            var U = fe();
            try {
              _e(I)(k, L);
            } catch (z) {
              if (pe(U), z !== z + 0) throw z;
              ge(1, 0);
            }
          }, da: function(I, k, L, U) {
            var z = fe();
            try {
              _e(I)(k, L, U);
            } catch (W) {
              if (pe(z), W !== W + 0) throw W;
              ge(1, 0);
            }
          }, l: function(I, k, L, U) {
            var z = fe();
            try {
              _e(I)(k, L, U);
            } catch (W) {
              if (pe(z), W !== W + 0) throw W;
              ge(1, 0);
            }
          }, t: function(I, k, L, U, z) {
            var W = fe();
            try {
              _e(I)(k, L, U, z);
            } catch (Q) {
              if (pe(W), Q !== Q + 0) throw Q;
              ge(1, 0);
            }
          }, u: function(I, k, L, U, z, W) {
            var Q = fe();
            try {
              _e(I)(k, L, U, z, W);
            } catch (ae) {
              if (pe(Q), ae !== ae + 0) throw ae;
              ge(1, 0);
            }
          }, x: function(I, k, L, U, z, W, Q) {
            var ae = fe();
            try {
              _e(I)(k, L, U, z, W, Q);
            } catch (ie) {
              if (pe(ae), ie !== ie + 0) throw ie;
              ge(1, 0);
            }
          }, z: function(I, k, L, U, z, W, Q, ae) {
            var ie = fe();
            try {
              _e(I)(k, L, U, z, W, Q, ae);
            } catch (he) {
              if (pe(ie), he !== he + 0) throw he;
              ge(1, 0);
            }
          }, ga: function(I, k, L, U, z, W, Q, ae, ie) {
            var he = fe();
            try {
              _e(I)(k, L, U, z, W, Q, ae, ie);
            } catch (Oe) {
              if (pe(he), Oe !== Oe + 0) throw Oe;
              ge(1, 0);
            }
          }, A: function(I, k, L, U, z, W, Q, ae, ie, he, Oe) {
            var Ce = fe();
            try {
              _e(I)(k, L, U, z, W, Q, ae, ie, he, Oe);
            } catch (Ne) {
              if (pe(Ce), Ne !== Ne + 0) throw Ne;
              ge(1, 0);
            }
          }, C: function(I, k, L, U, z, W, Q, ae, ie, he, Oe, Ce, Ne, X, xe, Me) {
            var tt = fe();
            try {
              _e(I)(k, L, U, z, W, Q, ae, ie, he, Oe, Ce, Ne, X, xe, Me);
            } catch (ft) {
              if (pe(tt), ft !== ft + 0) throw ft;
              ge(1, 0);
            }
          }, aa: function(I, k, L, U, z, W, Q, ae) {
            var ie = fe();
            try {
              bt(I, k, L, U, z, W, Q, ae);
            } catch (he) {
              if (pe(ie), he !== he + 0) throw he;
              ge(1, 0);
            }
          }, _: function(I, k, L, U, z, W, Q, ae, ie, he, Oe, Ce) {
            var Ne = fe();
            try {
              xt(I, k, L, U, z, W, Q, ae, ie, he, Oe, Ce);
            } catch (X) {
              if (pe(Ne), X !== X + 0) throw X;
              ge(1, 0);
            }
          }, $: function(I, k, L, U, z, W) {
            var Q = fe();
            try {
              vt(I, k, L, U, z, W);
            } catch (ae) {
              if (pe(Q), ae !== ae + 0) throw ae;
              ge(1, 0);
            }
          }, n: function(I) {
            return I;
          }, F: function(I) {
            Ue = I;
          }, ha: Et, y: function(I, k, L, U) {
            return Et(I, k, L, U);
          } };
          (function() {
            function I(z) {
              o.asm = z.exports, R = o.asm.Ka, ne(), ue = o.asm.ib, oe.unshift(o.asm.La), Ee--, o.monitorRunDependencies && o.monitorRunDependencies(Ee), Ee == 0 && Ie && (z = Ie, Ie = null, z());
            }
            function k(z) {
              I(z.instance);
            }
            function L(z) {
              return function() {
                if (!S && (m || y)) {
                  if (typeof fetch == "function" && !de.startsWith("file://")) return fetch(de, { credentials: "same-origin" }).then(function(W) {
                    if (!W.ok) throw "failed to load wasm binary file at '" + de + "'";
                    return W.arrayBuffer();
                  }).catch(function() {
                    return ze();
                  });
                  if (i) return new Promise(function(W, Q) {
                    i(de, function(ae) {
                      W(new Uint8Array(ae));
                    }, Q);
                  });
                }
                return Promise.resolve().then(function() {
                  return ze();
                });
              }().then(function(W) {
                return WebAssembly.instantiate(W, U);
              }).then(function(W) {
                return W;
              }).then(z, function(W) {
                P("failed to asynchronously prepare wasm: " + W), $e(W);
              });
            }
            var U = { a: It };
            if (Ee++, o.monitorRunDependencies && o.monitorRunDependencies(Ee), o.instantiateWasm) try {
              return o.instantiateWasm(U, I);
            } catch (z) {
              return P("Module.instantiateWasm callback failed with error: " + z), !1;
            }
            (S || typeof WebAssembly.instantiateStreaming != "function" || Fe() || de.startsWith("file://") || w || typeof fetch != "function" ? L(k) : fetch(de, { credentials: "same-origin" }).then(function(z) {
              return WebAssembly.instantiateStreaming(z, U).then(k, function(W) {
                return P("wasm streaming compile failed: " + W), P("falling back to ArrayBuffer instantiation"), L(k);
              });
            })).catch(f);
          })(), o.___wasm_call_ctors = function() {
            return (o.___wasm_call_ctors = o.asm.La).apply(null, arguments);
          }, o._OrtInit = function() {
            return (o._OrtInit = o.asm.Ma).apply(null, arguments);
          }, o._OrtCreateSessionOptions = function() {
            return (o._OrtCreateSessionOptions = o.asm.Na).apply(null, arguments);
          }, o._OrtAppendExecutionProvider = function() {
            return (o._OrtAppendExecutionProvider = o.asm.Oa).apply(null, arguments);
          }, o._OrtAddSessionConfigEntry = function() {
            return (o._OrtAddSessionConfigEntry = o.asm.Pa).apply(null, arguments);
          }, o._OrtReleaseSessionOptions = function() {
            return (o._OrtReleaseSessionOptions = o.asm.Qa).apply(null, arguments);
          }, o._OrtCreateSession = function() {
            return (o._OrtCreateSession = o.asm.Ra).apply(null, arguments);
          }, o._OrtReleaseSession = function() {
            return (o._OrtReleaseSession = o.asm.Sa).apply(null, arguments);
          }, o._OrtGetInputCount = function() {
            return (o._OrtGetInputCount = o.asm.Ta).apply(null, arguments);
          }, o._OrtGetOutputCount = function() {
            return (o._OrtGetOutputCount = o.asm.Ua).apply(null, arguments);
          }, o._OrtGetInputName = function() {
            return (o._OrtGetInputName = o.asm.Va).apply(null, arguments);
          }, o._OrtGetOutputName = function() {
            return (o._OrtGetOutputName = o.asm.Wa).apply(null, arguments);
          }, o._OrtFree = function() {
            return (o._OrtFree = o.asm.Xa).apply(null, arguments);
          }, o._OrtCreateTensor = function() {
            return (o._OrtCreateTensor = o.asm.Ya).apply(null, arguments);
          }, o._OrtGetTensorData = function() {
            return (o._OrtGetTensorData = o.asm.Za).apply(null, arguments);
          }, o._OrtReleaseTensor = function() {
            return (o._OrtReleaseTensor = o.asm._a).apply(null, arguments);
          }, o._OrtCreateRunOptions = function() {
            return (o._OrtCreateRunOptions = o.asm.$a).apply(null, arguments);
          }, o._OrtAddRunConfigEntry = function() {
            return (o._OrtAddRunConfigEntry = o.asm.ab).apply(null, arguments);
          }, o._OrtReleaseRunOptions = function() {
            return (o._OrtReleaseRunOptions = o.asm.bb).apply(null, arguments);
          }, o._OrtRun = function() {
            return (o._OrtRun = o.asm.cb).apply(null, arguments);
          }, o._OrtEndProfiling = function() {
            return (o._OrtEndProfiling = o.asm.db).apply(null, arguments);
          };
          var Ze, Pe = o._malloc = function() {
            return (Pe = o._malloc = o.asm.eb).apply(null, arguments);
          }, Xe = o._free = function() {
            return (Xe = o._free = o.asm.fb).apply(null, arguments);
          }, lt = o._fflush = function() {
            return (lt = o._fflush = o.asm.gb).apply(null, arguments);
          }, rt = o.___funcs_on_exit = function() {
            return (rt = o.___funcs_on_exit = o.asm.hb).apply(null, arguments);
          }, ge = o._setThrew = function() {
            return (ge = o._setThrew = o.asm.jb).apply(null, arguments);
          }, fe = o.stackSave = function() {
            return (fe = o.stackSave = o.asm.kb).apply(null, arguments);
          }, pe = o.stackRestore = function() {
            return (pe = o.stackRestore = o.asm.lb).apply(null, arguments);
          }, yt = o.stackAlloc = function() {
            return (yt = o.stackAlloc = o.asm.mb).apply(null, arguments);
          }, ot = o.___cxa_can_catch = function() {
            return (ot = o.___cxa_can_catch = o.asm.nb).apply(null, arguments);
          }, gt = o.___cxa_is_pointer_type = function() {
            return (gt = o.___cxa_is_pointer_type = o.asm.ob).apply(null, arguments);
          }, _t = o.dynCall_j = function() {
            return (_t = o.dynCall_j = o.asm.pb).apply(null, arguments);
          }, wt = o.dynCall_iiiiij = function() {
            return (wt = o.dynCall_iiiiij = o.asm.qb).apply(null, arguments);
          }, mt = o.dynCall_jii = function() {
            return (mt = o.dynCall_jii = o.asm.rb).apply(null, arguments);
          }, bt = o.dynCall_viiiiij = function() {
            return (bt = o.dynCall_viiiiij = o.asm.sb).apply(null, arguments);
          }, vt = o.dynCall_vjji = function() {
            return (vt = o.dynCall_vjji = o.asm.tb).apply(null, arguments);
          }, xt = o.dynCall_viiijjjii = function() {
            return (xt = o.dynCall_viiijjjii = o.asm.ub).apply(null, arguments);
          }, Tt = o.dynCall_iij = function() {
            return (Tt = o.dynCall_iij = o.asm.vb).apply(null, arguments);
          }, St = o.dynCall_ji = function() {
            return (St = o.dynCall_ji = o.asm.wb).apply(null, arguments);
          }, j = o.dynCall_iiiiiij = function() {
            return (j = o.dynCall_iiiiiij = o.asm.xb).apply(null, arguments);
          }, ee = o.dynCall_iiij = function() {
            return (ee = o.dynCall_iiij = o.asm.yb).apply(null, arguments);
          };
          function se() {
            function I() {
              if (!Ze && (Ze = !0, o.calledRun = !0, !E)) {
                if (Je(oe), c(o), o.onRuntimeInitialized && o.onRuntimeInitialized(), o.postRun) for (typeof o.postRun == "function" && (o.postRun = [o.postRun]); o.postRun.length; ) {
                  var k = o.postRun.shift();
                  me.unshift(k);
                }
                Je(me);
              }
            }
            if (!(0 < Ee)) {
              if (o.preRun) for (typeof o.preRun == "function" && (o.preRun = [o.preRun]); o.preRun.length; ) Ve();
              Je(ye), 0 < Ee || (o.setStatus ? (o.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  o.setStatus("");
                }, 1), I();
              }, 1)) : I());
            }
          }
          if (o.UTF8ToString = H, o.stringToUTF8 = function(I, k, L) {
            return te(I, D, k, L);
          }, o.lengthBytesUTF8 = Z, o.stackSave = fe, o.stackRestore = pe, o.stackAlloc = yt, Ie = function I() {
            Ze || se(), Ze || (Ie = I);
          }, o.preInit) for (typeof o.preInit == "function" && (o.preInit = [o.preInit]); 0 < o.preInit.length; ) o.preInit.pop()();
          return se(), g.ready;
        });
        C.exports = p;
      }, 4537: (C) => {
        C.exports = function(u, b) {
          for (var h = new Array(arguments.length - 1), p = 0, g = 2, o = !0; g < arguments.length; ) h[p++] = arguments[g++];
          return new Promise(function(c, f) {
            h[p] = function(a) {
              if (o) if (o = !1, a) f(a);
              else {
                for (var i = new Array(arguments.length - 1), t = 0; t < i.length; ) i[t++] = arguments[t];
                c.apply(null, i);
              }
            };
            try {
              u.apply(b || null, h);
            } catch (a) {
              o && (o = !1, f(a));
            }
          });
        };
      }, 7419: (C, u) => {
        var b = u;
        b.length = function(c) {
          var f = c.length;
          if (!f) return 0;
          for (var a = 0; --f % 4 > 1 && c.charAt(f) === "="; ) ++a;
          return Math.ceil(3 * c.length) / 4 - a;
        };
        for (var h = new Array(64), p = new Array(123), g = 0; g < 64; ) p[h[g] = g < 26 ? g + 65 : g < 52 ? g + 71 : g < 62 ? g - 4 : g - 59 | 43] = g++;
        b.encode = function(c, f, a) {
          for (var i, t = null, e = [], n = 0, r = 0; f < a; ) {
            var s = c[f++];
            switch (r) {
              case 0:
                e[n++] = h[s >> 2], i = (3 & s) << 4, r = 1;
                break;
              case 1:
                e[n++] = h[i | s >> 4], i = (15 & s) << 2, r = 2;
                break;
              case 2:
                e[n++] = h[i | s >> 6], e[n++] = h[63 & s], r = 0;
            }
            n > 8191 && ((t || (t = [])).push(String.fromCharCode.apply(String, e)), n = 0);
          }
          return r && (e[n++] = h[i], e[n++] = 61, r === 1 && (e[n++] = 61)), t ? (n && t.push(String.fromCharCode.apply(String, e.slice(0, n))), t.join("")) : String.fromCharCode.apply(String, e.slice(0, n));
        };
        var o = "invalid encoding";
        b.decode = function(c, f, a) {
          for (var i, t = a, e = 0, n = 0; n < c.length; ) {
            var r = c.charCodeAt(n++);
            if (r === 61 && e > 1) break;
            if ((r = p[r]) === void 0) throw Error(o);
            switch (e) {
              case 0:
                i = r, e = 1;
                break;
              case 1:
                f[a++] = i << 2 | (48 & r) >> 4, i = r, e = 2;
                break;
              case 2:
                f[a++] = (15 & i) << 4 | (60 & r) >> 2, i = r, e = 3;
                break;
              case 3:
                f[a++] = (3 & i) << 6 | r, e = 0;
            }
          }
          if (e === 1) throw Error(o);
          return a - t;
        }, b.test = function(c) {
          return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(c);
        };
      }, 9211: (C) => {
        function u() {
          this._listeners = {};
        }
        C.exports = u, u.prototype.on = function(b, h, p) {
          return (this._listeners[b] || (this._listeners[b] = [])).push({ fn: h, ctx: p || this }), this;
        }, u.prototype.off = function(b, h) {
          if (b === void 0) this._listeners = {};
          else if (h === void 0) this._listeners[b] = [];
          else for (var p = this._listeners[b], g = 0; g < p.length; ) p[g].fn === h ? p.splice(g, 1) : ++g;
          return this;
        }, u.prototype.emit = function(b) {
          var h = this._listeners[b];
          if (h) {
            for (var p = [], g = 1; g < arguments.length; ) p.push(arguments[g++]);
            for (g = 0; g < h.length; ) h[g].fn.apply(h[g++].ctx, p);
          }
          return this;
        };
      }, 945: (C) => {
        function u(o) {
          return typeof Float32Array < "u" ? function() {
            var c = new Float32Array([-0]), f = new Uint8Array(c.buffer), a = f[3] === 128;
            function i(r, s, l) {
              c[0] = r, s[l] = f[0], s[l + 1] = f[1], s[l + 2] = f[2], s[l + 3] = f[3];
            }
            function t(r, s, l) {
              c[0] = r, s[l] = f[3], s[l + 1] = f[2], s[l + 2] = f[1], s[l + 3] = f[0];
            }
            function e(r, s) {
              return f[0] = r[s], f[1] = r[s + 1], f[2] = r[s + 2], f[3] = r[s + 3], c[0];
            }
            function n(r, s) {
              return f[3] = r[s], f[2] = r[s + 1], f[1] = r[s + 2], f[0] = r[s + 3], c[0];
            }
            o.writeFloatLE = a ? i : t, o.writeFloatBE = a ? t : i, o.readFloatLE = a ? e : n, o.readFloatBE = a ? n : e;
          }() : function() {
            function c(a, i, t, e) {
              var n = i < 0 ? 1 : 0;
              if (n && (i = -i), i === 0) a(1 / i > 0 ? 0 : 2147483648, t, e);
              else if (isNaN(i)) a(2143289344, t, e);
              else if (i > 34028234663852886e22) a((n << 31 | 2139095040) >>> 0, t, e);
              else if (i < 11754943508222875e-54) a((n << 31 | Math.round(i / 1401298464324817e-60)) >>> 0, t, e);
              else {
                var r = Math.floor(Math.log(i) / Math.LN2);
                a((n << 31 | r + 127 << 23 | 8388607 & Math.round(i * Math.pow(2, -r) * 8388608)) >>> 0, t, e);
              }
            }
            function f(a, i, t) {
              var e = a(i, t), n = 2 * (e >> 31) + 1, r = e >>> 23 & 255, s = 8388607 & e;
              return r === 255 ? s ? NaN : n * (1 / 0) : r === 0 ? 1401298464324817e-60 * n * s : n * Math.pow(2, r - 150) * (s + 8388608);
            }
            o.writeFloatLE = c.bind(null, b), o.writeFloatBE = c.bind(null, h), o.readFloatLE = f.bind(null, p), o.readFloatBE = f.bind(null, g);
          }(), typeof Float64Array < "u" ? function() {
            var c = new Float64Array([-0]), f = new Uint8Array(c.buffer), a = f[7] === 128;
            function i(r, s, l) {
              c[0] = r, s[l] = f[0], s[l + 1] = f[1], s[l + 2] = f[2], s[l + 3] = f[3], s[l + 4] = f[4], s[l + 5] = f[5], s[l + 6] = f[6], s[l + 7] = f[7];
            }
            function t(r, s, l) {
              c[0] = r, s[l] = f[7], s[l + 1] = f[6], s[l + 2] = f[5], s[l + 3] = f[4], s[l + 4] = f[3], s[l + 5] = f[2], s[l + 6] = f[1], s[l + 7] = f[0];
            }
            function e(r, s) {
              return f[0] = r[s], f[1] = r[s + 1], f[2] = r[s + 2], f[3] = r[s + 3], f[4] = r[s + 4], f[5] = r[s + 5], f[6] = r[s + 6], f[7] = r[s + 7], c[0];
            }
            function n(r, s) {
              return f[7] = r[s], f[6] = r[s + 1], f[5] = r[s + 2], f[4] = r[s + 3], f[3] = r[s + 4], f[2] = r[s + 5], f[1] = r[s + 6], f[0] = r[s + 7], c[0];
            }
            o.writeDoubleLE = a ? i : t, o.writeDoubleBE = a ? t : i, o.readDoubleLE = a ? e : n, o.readDoubleBE = a ? n : e;
          }() : function() {
            function c(a, i, t, e, n, r) {
              var s = e < 0 ? 1 : 0;
              if (s && (e = -e), e === 0) a(0, n, r + i), a(1 / e > 0 ? 0 : 2147483648, n, r + t);
              else if (isNaN(e)) a(0, n, r + i), a(2146959360, n, r + t);
              else if (e > 17976931348623157e292) a(0, n, r + i), a((s << 31 | 2146435072) >>> 0, n, r + t);
              else {
                var l;
                if (e < 22250738585072014e-324) a((l = e / 5e-324) >>> 0, n, r + i), a((s << 31 | l / 4294967296) >>> 0, n, r + t);
                else {
                  var d = Math.floor(Math.log(e) / Math.LN2);
                  d === 1024 && (d = 1023), a(4503599627370496 * (l = e * Math.pow(2, -d)) >>> 0, n, r + i), a((s << 31 | d + 1023 << 20 | 1048576 * l & 1048575) >>> 0, n, r + t);
                }
              }
            }
            function f(a, i, t, e, n) {
              var r = a(e, n + i), s = a(e, n + t), l = 2 * (s >> 31) + 1, d = s >>> 20 & 2047, m = 4294967296 * (1048575 & s) + r;
              return d === 2047 ? m ? NaN : l * (1 / 0) : d === 0 ? 5e-324 * l * m : l * Math.pow(2, d - 1075) * (m + 4503599627370496);
            }
            o.writeDoubleLE = c.bind(null, b, 0, 4), o.writeDoubleBE = c.bind(null, h, 4, 0), o.readDoubleLE = f.bind(null, p, 0, 4), o.readDoubleBE = f.bind(null, g, 4, 0);
          }(), o;
        }
        function b(o, c, f) {
          c[f] = 255 & o, c[f + 1] = o >>> 8 & 255, c[f + 2] = o >>> 16 & 255, c[f + 3] = o >>> 24;
        }
        function h(o, c, f) {
          c[f] = o >>> 24, c[f + 1] = o >>> 16 & 255, c[f + 2] = o >>> 8 & 255, c[f + 3] = 255 & o;
        }
        function p(o, c) {
          return (o[c] | o[c + 1] << 8 | o[c + 2] << 16 | o[c + 3] << 24) >>> 0;
        }
        function g(o, c) {
          return (o[c] << 24 | o[c + 1] << 16 | o[c + 2] << 8 | o[c + 3]) >>> 0;
        }
        C.exports = u(u);
      }, 7199: (module) => {
        function inquire(moduleName) {
          try {
            var mod = eval("quire".replace(/^/, "re"))(moduleName);
            if (mod && (mod.length || Object.keys(mod).length)) return mod;
          } catch (C) {
          }
          return null;
        }
        module.exports = inquire;
      }, 6662: (C) => {
        C.exports = function(u, b, h) {
          var p = h || 8192, g = p >>> 1, o = null, c = p;
          return function(f) {
            if (f < 1 || f > g) return u(f);
            c + f > p && (o = u(p), c = 0);
            var a = b.call(o, c, c += f);
            return 7 & c && (c = 1 + (7 | c)), a;
          };
        };
      }, 4997: (C, u) => {
        var b = u;
        b.length = function(h) {
          for (var p = 0, g = 0, o = 0; o < h.length; ++o) (g = h.charCodeAt(o)) < 128 ? p += 1 : g < 2048 ? p += 2 : (64512 & g) == 55296 && (64512 & h.charCodeAt(o + 1)) == 56320 ? (++o, p += 4) : p += 3;
          return p;
        }, b.read = function(h, p, g) {
          if (g - p < 1) return "";
          for (var o, c = null, f = [], a = 0; p < g; ) (o = h[p++]) < 128 ? f[a++] = o : o > 191 && o < 224 ? f[a++] = (31 & o) << 6 | 63 & h[p++] : o > 239 && o < 365 ? (o = ((7 & o) << 18 | (63 & h[p++]) << 12 | (63 & h[p++]) << 6 | 63 & h[p++]) - 65536, f[a++] = 55296 + (o >> 10), f[a++] = 56320 + (1023 & o)) : f[a++] = (15 & o) << 12 | (63 & h[p++]) << 6 | 63 & h[p++], a > 8191 && ((c || (c = [])).push(String.fromCharCode.apply(String, f)), a = 0);
          return c ? (a && c.push(String.fromCharCode.apply(String, f.slice(0, a))), c.join("")) : String.fromCharCode.apply(String, f.slice(0, a));
        }, b.write = function(h, p, g) {
          for (var o, c, f = g, a = 0; a < h.length; ++a) (o = h.charCodeAt(a)) < 128 ? p[g++] = o : o < 2048 ? (p[g++] = o >> 6 | 192, p[g++] = 63 & o | 128) : (64512 & o) == 55296 && (64512 & (c = h.charCodeAt(a + 1))) == 56320 ? (o = 65536 + ((1023 & o) << 10) + (1023 & c), ++a, p[g++] = o >> 18 | 240, p[g++] = o >> 12 & 63 | 128, p[g++] = o >> 6 & 63 | 128, p[g++] = 63 & o | 128) : (p[g++] = o >> 12 | 224, p[g++] = o >> 6 & 63 | 128, p[g++] = 63 & o | 128);
          return g - f;
        };
      }, 3442: (C, u) => {
        u.__esModule = !0;
        var b = function() {
          function h(p) {
            if (!p) throw new TypeError("Invalid argument; `value` has no value.");
            this.value = h.EMPTY, p && h.isGuid(p) && (this.value = p);
          }
          return h.isGuid = function(p) {
            var g = p.toString();
            return p && (p instanceof h || h.validator.test(g));
          }, h.create = function() {
            return new h([h.gen(2), h.gen(1), h.gen(1), h.gen(1), h.gen(3)].join("-"));
          }, h.createEmpty = function() {
            return new h("emptyguid");
          }, h.parse = function(p) {
            return new h(p);
          }, h.raw = function() {
            return [h.gen(2), h.gen(1), h.gen(1), h.gen(1), h.gen(3)].join("-");
          }, h.gen = function(p) {
            for (var g = "", o = 0; o < p; o++) g += (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
            return g;
          }, h.prototype.equals = function(p) {
            return h.isGuid(p) && this.value === p.toString();
          }, h.prototype.isEmpty = function() {
            return this.value === h.EMPTY;
          }, h.prototype.toString = function() {
            return this.value;
          }, h.prototype.toJSON = function() {
            return { value: this.value };
          }, h.validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i"), h.EMPTY = "00000000-0000-0000-0000-000000000000", h;
        }();
        u.Guid = b;
      }, 3720: (C) => {
        C.exports = b;
        var u = null;
        try {
          u = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
        } catch {
        }
        function b(v, R, B) {
          this.low = 0 | v, this.high = 0 | R, this.unsigned = !!B;
        }
        function h(v) {
          return (v && v.__isLong__) === !0;
        }
        b.prototype.__isLong__, Object.defineProperty(b.prototype, "__isLong__", { value: !0 }), b.isLong = h;
        var p = {}, g = {};
        function o(v, R) {
          var B, q, D;
          return R ? (D = 0 <= (v >>>= 0) && v < 256) && (q = g[v]) ? q : (B = f(v, (0 | v) < 0 ? -1 : 0, !0), D && (g[v] = B), B) : (D = -128 <= (v |= 0) && v < 128) && (q = p[v]) ? q : (B = f(v, v < 0 ? -1 : 0, !1), D && (p[v] = B), B);
        }
        function c(v, R) {
          if (isNaN(v)) return R ? d : l;
          if (R) {
            if (v < 0) return d;
            if (v >= n) return S;
          } else {
            if (v <= -9223372036854776e3) return A;
            if (v + 1 >= r) return _;
          }
          return v < 0 ? c(-v, R).neg() : f(v % e | 0, v / e | 0, R);
        }
        function f(v, R, B) {
          return new b(v, R, B);
        }
        b.fromInt = o, b.fromNumber = c, b.fromBits = f;
        var a = Math.pow;
        function i(v, R, B) {
          if (v.length === 0) throw Error("empty string");
          if (v === "NaN" || v === "Infinity" || v === "+Infinity" || v === "-Infinity") return l;
          if (typeof R == "number" ? (B = R, R = !1) : R = !!R, (B = B || 10) < 2 || 36 < B) throw RangeError("radix");
          var q;
          if ((q = v.indexOf("-")) > 0) throw Error("interior hyphen");
          if (q === 0) return i(v.substring(1), R, B).neg();
          for (var D = c(a(B, 8)), O = l, N = 0; N < v.length; N += 8) {
            var E = Math.min(8, v.length - N), M = parseInt(v.substring(N, N + E), B);
            if (E < 8) {
              var Y = c(a(B, E));
              O = O.mul(Y).add(c(M));
            } else O = (O = O.mul(D)).add(c(M));
          }
          return O.unsigned = R, O;
        }
        function t(v, R) {
          return typeof v == "number" ? c(v, R) : typeof v == "string" ? i(v, R) : f(v.low, v.high, typeof R == "boolean" ? R : v.unsigned);
        }
        b.fromString = i, b.fromValue = t;
        var e = 4294967296, n = e * e, r = n / 2, s = o(1 << 24), l = o(0);
        b.ZERO = l;
        var d = o(0, !0);
        b.UZERO = d;
        var m = o(1);
        b.ONE = m;
        var y = o(1, !0);
        b.UONE = y;
        var w = o(-1);
        b.NEG_ONE = w;
        var _ = f(-1, 2147483647, !1);
        b.MAX_VALUE = _;
        var S = f(-1, -1, !0);
        b.MAX_UNSIGNED_VALUE = S;
        var A = f(0, -2147483648, !1);
        b.MIN_VALUE = A;
        var P = b.prototype;
        P.toInt = function() {
          return this.unsigned ? this.low >>> 0 : this.low;
        }, P.toNumber = function() {
          return this.unsigned ? (this.high >>> 0) * e + (this.low >>> 0) : this.high * e + (this.low >>> 0);
        }, P.toString = function(v) {
          if ((v = v || 10) < 2 || 36 < v) throw RangeError("radix");
          if (this.isZero()) return "0";
          if (this.isNegative()) {
            if (this.eq(A)) {
              var R = c(v), B = this.div(R), q = B.mul(R).sub(this);
              return B.toString(v) + q.toInt().toString(v);
            }
            return "-" + this.neg().toString(v);
          }
          for (var D = c(a(v, 6), this.unsigned), O = this, N = ""; ; ) {
            var E = O.div(D), M = (O.sub(E.mul(D)).toInt() >>> 0).toString(v);
            if ((O = E).isZero()) return M + N;
            for (; M.length < 6; ) M = "0" + M;
            N = "" + M + N;
          }
        }, P.getHighBits = function() {
          return this.high;
        }, P.getHighBitsUnsigned = function() {
          return this.high >>> 0;
        }, P.getLowBits = function() {
          return this.low;
        }, P.getLowBitsUnsigned = function() {
          return this.low >>> 0;
        }, P.getNumBitsAbs = function() {
          if (this.isNegative()) return this.eq(A) ? 64 : this.neg().getNumBitsAbs();
          for (var v = this.high != 0 ? this.high : this.low, R = 31; R > 0 && !(v & 1 << R); R--) ;
          return this.high != 0 ? R + 33 : R + 1;
        }, P.isZero = function() {
          return this.high === 0 && this.low === 0;
        }, P.eqz = P.isZero, P.isNegative = function() {
          return !this.unsigned && this.high < 0;
        }, P.isPositive = function() {
          return this.unsigned || this.high >= 0;
        }, P.isOdd = function() {
          return (1 & this.low) == 1;
        }, P.isEven = function() {
          return (1 & this.low) == 0;
        }, P.equals = function(v) {
          return h(v) || (v = t(v)), (this.unsigned === v.unsigned || this.high >>> 31 != 1 || v.high >>> 31 != 1) && this.high === v.high && this.low === v.low;
        }, P.eq = P.equals, P.notEquals = function(v) {
          return !this.eq(v);
        }, P.neq = P.notEquals, P.ne = P.notEquals, P.lessThan = function(v) {
          return this.comp(v) < 0;
        }, P.lt = P.lessThan, P.lessThanOrEqual = function(v) {
          return this.comp(v) <= 0;
        }, P.lte = P.lessThanOrEqual, P.le = P.lessThanOrEqual, P.greaterThan = function(v) {
          return this.comp(v) > 0;
        }, P.gt = P.greaterThan, P.greaterThanOrEqual = function(v) {
          return this.comp(v) >= 0;
        }, P.gte = P.greaterThanOrEqual, P.ge = P.greaterThanOrEqual, P.compare = function(v) {
          if (h(v) || (v = t(v)), this.eq(v)) return 0;
          var R = this.isNegative(), B = v.isNegative();
          return R && !B ? -1 : !R && B ? 1 : this.unsigned ? v.high >>> 0 > this.high >>> 0 || v.high === this.high && v.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(v).isNegative() ? -1 : 1;
        }, P.comp = P.compare, P.negate = function() {
          return !this.unsigned && this.eq(A) ? A : this.not().add(m);
        }, P.neg = P.negate, P.add = function(v) {
          h(v) || (v = t(v));
          var R = this.high >>> 16, B = 65535 & this.high, q = this.low >>> 16, D = 65535 & this.low, O = v.high >>> 16, N = 65535 & v.high, E = v.low >>> 16, M = 0, Y = 0, H = 0, te = 0;
          return H += (te += D + (65535 & v.low)) >>> 16, Y += (H += q + E) >>> 16, M += (Y += B + N) >>> 16, M += R + O, f((H &= 65535) << 16 | (te &= 65535), (M &= 65535) << 16 | (Y &= 65535), this.unsigned);
        }, P.subtract = function(v) {
          return h(v) || (v = t(v)), this.add(v.neg());
        }, P.sub = P.subtract, P.multiply = function(v) {
          if (this.isZero()) return l;
          if (h(v) || (v = t(v)), u) return f(u.mul(this.low, this.high, v.low, v.high), u.get_high(), this.unsigned);
          if (v.isZero()) return l;
          if (this.eq(A)) return v.isOdd() ? A : l;
          if (v.eq(A)) return this.isOdd() ? A : l;
          if (this.isNegative()) return v.isNegative() ? this.neg().mul(v.neg()) : this.neg().mul(v).neg();
          if (v.isNegative()) return this.mul(v.neg()).neg();
          if (this.lt(s) && v.lt(s)) return c(this.toNumber() * v.toNumber(), this.unsigned);
          var R = this.high >>> 16, B = 65535 & this.high, q = this.low >>> 16, D = 65535 & this.low, O = v.high >>> 16, N = 65535 & v.high, E = v.low >>> 16, M = 65535 & v.low, Y = 0, H = 0, te = 0, Z = 0;
          return te += (Z += D * M) >>> 16, H += (te += q * M) >>> 16, te &= 65535, H += (te += D * E) >>> 16, Y += (H += B * M) >>> 16, H &= 65535, Y += (H += q * E) >>> 16, H &= 65535, Y += (H += D * N) >>> 16, Y += R * M + B * E + q * N + D * O, f((te &= 65535) << 16 | (Z &= 65535), (Y &= 65535) << 16 | (H &= 65535), this.unsigned);
        }, P.mul = P.multiply, P.divide = function(v) {
          if (h(v) || (v = t(v)), v.isZero()) throw Error("division by zero");
          var R, B, q;
          if (u) return this.unsigned || this.high !== -2147483648 || v.low !== -1 || v.high !== -1 ? f((this.unsigned ? u.div_u : u.div_s)(this.low, this.high, v.low, v.high), u.get_high(), this.unsigned) : this;
          if (this.isZero()) return this.unsigned ? d : l;
          if (this.unsigned) {
            if (v.unsigned || (v = v.toUnsigned()), v.gt(this)) return d;
            if (v.gt(this.shru(1))) return y;
            q = d;
          } else {
            if (this.eq(A)) return v.eq(m) || v.eq(w) ? A : v.eq(A) ? m : (R = this.shr(1).div(v).shl(1)).eq(l) ? v.isNegative() ? m : w : (B = this.sub(v.mul(R)), q = R.add(B.div(v)));
            if (v.eq(A)) return this.unsigned ? d : l;
            if (this.isNegative()) return v.isNegative() ? this.neg().div(v.neg()) : this.neg().div(v).neg();
            if (v.isNegative()) return this.div(v.neg()).neg();
            q = l;
          }
          for (B = this; B.gte(v); ) {
            R = Math.max(1, Math.floor(B.toNumber() / v.toNumber()));
            for (var D = Math.ceil(Math.log(R) / Math.LN2), O = D <= 48 ? 1 : a(2, D - 48), N = c(R), E = N.mul(v); E.isNegative() || E.gt(B); ) E = (N = c(R -= O, this.unsigned)).mul(v);
            N.isZero() && (N = m), q = q.add(N), B = B.sub(E);
          }
          return q;
        }, P.div = P.divide, P.modulo = function(v) {
          return h(v) || (v = t(v)), u ? f((this.unsigned ? u.rem_u : u.rem_s)(this.low, this.high, v.low, v.high), u.get_high(), this.unsigned) : this.sub(this.div(v).mul(v));
        }, P.mod = P.modulo, P.rem = P.modulo, P.not = function() {
          return f(~this.low, ~this.high, this.unsigned);
        }, P.and = function(v) {
          return h(v) || (v = t(v)), f(this.low & v.low, this.high & v.high, this.unsigned);
        }, P.or = function(v) {
          return h(v) || (v = t(v)), f(this.low | v.low, this.high | v.high, this.unsigned);
        }, P.xor = function(v) {
          return h(v) || (v = t(v)), f(this.low ^ v.low, this.high ^ v.high, this.unsigned);
        }, P.shiftLeft = function(v) {
          return h(v) && (v = v.toInt()), (v &= 63) == 0 ? this : v < 32 ? f(this.low << v, this.high << v | this.low >>> 32 - v, this.unsigned) : f(0, this.low << v - 32, this.unsigned);
        }, P.shl = P.shiftLeft, P.shiftRight = function(v) {
          return h(v) && (v = v.toInt()), (v &= 63) == 0 ? this : v < 32 ? f(this.low >>> v | this.high << 32 - v, this.high >> v, this.unsigned) : f(this.high >> v - 32, this.high >= 0 ? 0 : -1, this.unsigned);
        }, P.shr = P.shiftRight, P.shiftRightUnsigned = function(v) {
          if (h(v) && (v = v.toInt()), (v &= 63) == 0) return this;
          var R = this.high;
          return v < 32 ? f(this.low >>> v | R << 32 - v, R >>> v, this.unsigned) : f(v === 32 ? R : R >>> v - 32, 0, this.unsigned);
        }, P.shru = P.shiftRightUnsigned, P.shr_u = P.shiftRightUnsigned, P.toSigned = function() {
          return this.unsigned ? f(this.low, this.high, !1) : this;
        }, P.toUnsigned = function() {
          return this.unsigned ? this : f(this.low, this.high, !0);
        }, P.toBytes = function(v) {
          return v ? this.toBytesLE() : this.toBytesBE();
        }, P.toBytesLE = function() {
          var v = this.high, R = this.low;
          return [255 & R, R >>> 8 & 255, R >>> 16 & 255, R >>> 24, 255 & v, v >>> 8 & 255, v >>> 16 & 255, v >>> 24];
        }, P.toBytesBE = function() {
          var v = this.high, R = this.low;
          return [v >>> 24, v >>> 16 & 255, v >>> 8 & 255, 255 & v, R >>> 24, R >>> 16 & 255, R >>> 8 & 255, 255 & R];
        }, b.fromBytes = function(v, R, B) {
          return B ? b.fromBytesLE(v, R) : b.fromBytesBE(v, R);
        }, b.fromBytesLE = function(v, R) {
          return new b(v[0] | v[1] << 8 | v[2] << 16 | v[3] << 24, v[4] | v[5] << 8 | v[6] << 16 | v[7] << 24, R);
        }, b.fromBytesBE = function(v, R) {
          return new b(v[4] << 24 | v[5] << 16 | v[6] << 8 | v[7], v[0] << 24 | v[1] << 16 | v[2] << 8 | v[3], R);
        };
      }, 1446: (C, u, b) => {
        var h, p, g, o = b(2100), c = o.Reader, f = o.Writer, a = o.util, i = o.roots.default || (o.roots.default = {});
        i.onnx = ((g = {}).Version = (h = {}, (p = Object.create(h))[h[0] = "_START_VERSION"] = 0, p[h[1] = "IR_VERSION_2017_10_10"] = 1, p[h[2] = "IR_VERSION_2017_10_30"] = 2, p[h[3] = "IR_VERSION_2017_11_3"] = 3, p[h[4] = "IR_VERSION_2019_1_22"] = 4, p[h[5] = "IR_VERSION"] = 5, p), g.AttributeProto = function() {
          function t(e) {
            if (this.floats = [], this.ints = [], this.strings = [], this.tensors = [], this.graphs = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.name = "", t.prototype.refAttrName = "", t.prototype.docString = "", t.prototype.type = 0, t.prototype.f = 0, t.prototype.i = a.Long ? a.Long.fromBits(0, 0, !1) : 0, t.prototype.s = a.newBuffer([]), t.prototype.t = null, t.prototype.g = null, t.prototype.floats = a.emptyArray, t.prototype.ints = a.emptyArray, t.prototype.strings = a.emptyArray, t.prototype.tensors = a.emptyArray, t.prototype.graphs = a.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.name != null && e.hasOwnProperty("name") && n.uint32(10).string(e.name), e.f != null && e.hasOwnProperty("f") && n.uint32(21).float(e.f), e.i != null && e.hasOwnProperty("i") && n.uint32(24).int64(e.i), e.s != null && e.hasOwnProperty("s") && n.uint32(34).bytes(e.s), e.t != null && e.hasOwnProperty("t") && i.onnx.TensorProto.encode(e.t, n.uint32(42).fork()).ldelim(), e.g != null && e.hasOwnProperty("g") && i.onnx.GraphProto.encode(e.g, n.uint32(50).fork()).ldelim(), e.floats != null && e.floats.length) {
              n.uint32(58).fork();
              for (var r = 0; r < e.floats.length; ++r) n.float(e.floats[r]);
              n.ldelim();
            }
            if (e.ints != null && e.ints.length) {
              for (n.uint32(66).fork(), r = 0; r < e.ints.length; ++r) n.int64(e.ints[r]);
              n.ldelim();
            }
            if (e.strings != null && e.strings.length) for (r = 0; r < e.strings.length; ++r) n.uint32(74).bytes(e.strings[r]);
            if (e.tensors != null && e.tensors.length) for (r = 0; r < e.tensors.length; ++r) i.onnx.TensorProto.encode(e.tensors[r], n.uint32(82).fork()).ldelim();
            if (e.graphs != null && e.graphs.length) for (r = 0; r < e.graphs.length; ++r) i.onnx.GraphProto.encode(e.graphs[r], n.uint32(90).fork()).ldelim();
            return e.docString != null && e.hasOwnProperty("docString") && n.uint32(106).string(e.docString), e.type != null && e.hasOwnProperty("type") && n.uint32(160).int32(e.type), e.refAttrName != null && e.hasOwnProperty("refAttrName") && n.uint32(170).string(e.refAttrName), n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.AttributeProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  s.name = e.string();
                  break;
                case 21:
                  s.refAttrName = e.string();
                  break;
                case 13:
                  s.docString = e.string();
                  break;
                case 20:
                  s.type = e.int32();
                  break;
                case 2:
                  s.f = e.float();
                  break;
                case 3:
                  s.i = e.int64();
                  break;
                case 4:
                  s.s = e.bytes();
                  break;
                case 5:
                  s.t = i.onnx.TensorProto.decode(e, e.uint32());
                  break;
                case 6:
                  s.g = i.onnx.GraphProto.decode(e, e.uint32());
                  break;
                case 7:
                  if (s.floats && s.floats.length || (s.floats = []), (7 & l) == 2) for (var d = e.uint32() + e.pos; e.pos < d; ) s.floats.push(e.float());
                  else s.floats.push(e.float());
                  break;
                case 8:
                  if (s.ints && s.ints.length || (s.ints = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) s.ints.push(e.int64());
                  else s.ints.push(e.int64());
                  break;
                case 9:
                  s.strings && s.strings.length || (s.strings = []), s.strings.push(e.bytes());
                  break;
                case 10:
                  s.tensors && s.tensors.length || (s.tensors = []), s.tensors.push(i.onnx.TensorProto.decode(e, e.uint32()));
                  break;
                case 11:
                  s.graphs && s.graphs.length || (s.graphs = []), s.graphs.push(i.onnx.GraphProto.decode(e, e.uint32()));
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.name != null && e.hasOwnProperty("name") && !a.isString(e.name)) return "name: string expected";
            if (e.refAttrName != null && e.hasOwnProperty("refAttrName") && !a.isString(e.refAttrName)) return "refAttrName: string expected";
            if (e.docString != null && e.hasOwnProperty("docString") && !a.isString(e.docString)) return "docString: string expected";
            if (e.type != null && e.hasOwnProperty("type")) switch (e.type) {
              default:
                return "type: enum value expected";
              case 0:
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
              case 8:
              case 9:
              case 10:
            }
            if (e.f != null && e.hasOwnProperty("f") && typeof e.f != "number") return "f: number expected";
            if (e.i != null && e.hasOwnProperty("i") && !(a.isInteger(e.i) || e.i && a.isInteger(e.i.low) && a.isInteger(e.i.high))) return "i: integer|Long expected";
            if (e.s != null && e.hasOwnProperty("s") && !(e.s && typeof e.s.length == "number" || a.isString(e.s))) return "s: buffer expected";
            if (e.t != null && e.hasOwnProperty("t") && (r = i.onnx.TensorProto.verify(e.t))) return "t." + r;
            if (e.g != null && e.hasOwnProperty("g") && (r = i.onnx.GraphProto.verify(e.g))) return "g." + r;
            if (e.floats != null && e.hasOwnProperty("floats")) {
              if (!Array.isArray(e.floats)) return "floats: array expected";
              for (var n = 0; n < e.floats.length; ++n) if (typeof e.floats[n] != "number") return "floats: number[] expected";
            }
            if (e.ints != null && e.hasOwnProperty("ints")) {
              if (!Array.isArray(e.ints)) return "ints: array expected";
              for (n = 0; n < e.ints.length; ++n) if (!(a.isInteger(e.ints[n]) || e.ints[n] && a.isInteger(e.ints[n].low) && a.isInteger(e.ints[n].high))) return "ints: integer|Long[] expected";
            }
            if (e.strings != null && e.hasOwnProperty("strings")) {
              if (!Array.isArray(e.strings)) return "strings: array expected";
              for (n = 0; n < e.strings.length; ++n) if (!(e.strings[n] && typeof e.strings[n].length == "number" || a.isString(e.strings[n]))) return "strings: buffer[] expected";
            }
            if (e.tensors != null && e.hasOwnProperty("tensors")) {
              if (!Array.isArray(e.tensors)) return "tensors: array expected";
              for (n = 0; n < e.tensors.length; ++n) if (r = i.onnx.TensorProto.verify(e.tensors[n])) return "tensors." + r;
            }
            if (e.graphs != null && e.hasOwnProperty("graphs")) {
              if (!Array.isArray(e.graphs)) return "graphs: array expected";
              for (n = 0; n < e.graphs.length; ++n) {
                var r;
                if (r = i.onnx.GraphProto.verify(e.graphs[n])) return "graphs." + r;
              }
            }
            return null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.AttributeProto) return e;
            var n = new i.onnx.AttributeProto();
            switch (e.name != null && (n.name = String(e.name)), e.refAttrName != null && (n.refAttrName = String(e.refAttrName)), e.docString != null && (n.docString = String(e.docString)), e.type) {
              case "UNDEFINED":
              case 0:
                n.type = 0;
                break;
              case "FLOAT":
              case 1:
                n.type = 1;
                break;
              case "INT":
              case 2:
                n.type = 2;
                break;
              case "STRING":
              case 3:
                n.type = 3;
                break;
              case "TENSOR":
              case 4:
                n.type = 4;
                break;
              case "GRAPH":
              case 5:
                n.type = 5;
                break;
              case "FLOATS":
              case 6:
                n.type = 6;
                break;
              case "INTS":
              case 7:
                n.type = 7;
                break;
              case "STRINGS":
              case 8:
                n.type = 8;
                break;
              case "TENSORS":
              case 9:
                n.type = 9;
                break;
              case "GRAPHS":
              case 10:
                n.type = 10;
            }
            if (e.f != null && (n.f = Number(e.f)), e.i != null && (a.Long ? (n.i = a.Long.fromValue(e.i)).unsigned = !1 : typeof e.i == "string" ? n.i = parseInt(e.i, 10) : typeof e.i == "number" ? n.i = e.i : typeof e.i == "object" && (n.i = new a.LongBits(e.i.low >>> 0, e.i.high >>> 0).toNumber())), e.s != null && (typeof e.s == "string" ? a.base64.decode(e.s, n.s = a.newBuffer(a.base64.length(e.s)), 0) : e.s.length && (n.s = e.s)), e.t != null) {
              if (typeof e.t != "object") throw TypeError(".onnx.AttributeProto.t: object expected");
              n.t = i.onnx.TensorProto.fromObject(e.t);
            }
            if (e.g != null) {
              if (typeof e.g != "object") throw TypeError(".onnx.AttributeProto.g: object expected");
              n.g = i.onnx.GraphProto.fromObject(e.g);
            }
            if (e.floats) {
              if (!Array.isArray(e.floats)) throw TypeError(".onnx.AttributeProto.floats: array expected");
              n.floats = [];
              for (var r = 0; r < e.floats.length; ++r) n.floats[r] = Number(e.floats[r]);
            }
            if (e.ints) {
              if (!Array.isArray(e.ints)) throw TypeError(".onnx.AttributeProto.ints: array expected");
              for (n.ints = [], r = 0; r < e.ints.length; ++r) a.Long ? (n.ints[r] = a.Long.fromValue(e.ints[r])).unsigned = !1 : typeof e.ints[r] == "string" ? n.ints[r] = parseInt(e.ints[r], 10) : typeof e.ints[r] == "number" ? n.ints[r] = e.ints[r] : typeof e.ints[r] == "object" && (n.ints[r] = new a.LongBits(e.ints[r].low >>> 0, e.ints[r].high >>> 0).toNumber());
            }
            if (e.strings) {
              if (!Array.isArray(e.strings)) throw TypeError(".onnx.AttributeProto.strings: array expected");
              for (n.strings = [], r = 0; r < e.strings.length; ++r) typeof e.strings[r] == "string" ? a.base64.decode(e.strings[r], n.strings[r] = a.newBuffer(a.base64.length(e.strings[r])), 0) : e.strings[r].length && (n.strings[r] = e.strings[r]);
            }
            if (e.tensors) {
              if (!Array.isArray(e.tensors)) throw TypeError(".onnx.AttributeProto.tensors: array expected");
              for (n.tensors = [], r = 0; r < e.tensors.length; ++r) {
                if (typeof e.tensors[r] != "object") throw TypeError(".onnx.AttributeProto.tensors: object expected");
                n.tensors[r] = i.onnx.TensorProto.fromObject(e.tensors[r]);
              }
            }
            if (e.graphs) {
              if (!Array.isArray(e.graphs)) throw TypeError(".onnx.AttributeProto.graphs: array expected");
              for (n.graphs = [], r = 0; r < e.graphs.length; ++r) {
                if (typeof e.graphs[r] != "object") throw TypeError(".onnx.AttributeProto.graphs: object expected");
                n.graphs[r] = i.onnx.GraphProto.fromObject(e.graphs[r]);
              }
            }
            return n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if ((n.arrays || n.defaults) && (r.floats = [], r.ints = [], r.strings = [], r.tensors = [], r.graphs = []), n.defaults) {
              if (r.name = "", r.f = 0, a.Long) {
                var s = new a.Long(0, 0, !1);
                r.i = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s;
              } else r.i = n.longs === String ? "0" : 0;
              n.bytes === String ? r.s = "" : (r.s = [], n.bytes !== Array && (r.s = a.newBuffer(r.s))), r.t = null, r.g = null, r.docString = "", r.type = n.enums === String ? "UNDEFINED" : 0, r.refAttrName = "";
            }
            if (e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.f != null && e.hasOwnProperty("f") && (r.f = n.json && !isFinite(e.f) ? String(e.f) : e.f), e.i != null && e.hasOwnProperty("i") && (typeof e.i == "number" ? r.i = n.longs === String ? String(e.i) : e.i : r.i = n.longs === String ? a.Long.prototype.toString.call(e.i) : n.longs === Number ? new a.LongBits(e.i.low >>> 0, e.i.high >>> 0).toNumber() : e.i), e.s != null && e.hasOwnProperty("s") && (r.s = n.bytes === String ? a.base64.encode(e.s, 0, e.s.length) : n.bytes === Array ? Array.prototype.slice.call(e.s) : e.s), e.t != null && e.hasOwnProperty("t") && (r.t = i.onnx.TensorProto.toObject(e.t, n)), e.g != null && e.hasOwnProperty("g") && (r.g = i.onnx.GraphProto.toObject(e.g, n)), e.floats && e.floats.length) {
              r.floats = [];
              for (var l = 0; l < e.floats.length; ++l) r.floats[l] = n.json && !isFinite(e.floats[l]) ? String(e.floats[l]) : e.floats[l];
            }
            if (e.ints && e.ints.length) for (r.ints = [], l = 0; l < e.ints.length; ++l) typeof e.ints[l] == "number" ? r.ints[l] = n.longs === String ? String(e.ints[l]) : e.ints[l] : r.ints[l] = n.longs === String ? a.Long.prototype.toString.call(e.ints[l]) : n.longs === Number ? new a.LongBits(e.ints[l].low >>> 0, e.ints[l].high >>> 0).toNumber() : e.ints[l];
            if (e.strings && e.strings.length) for (r.strings = [], l = 0; l < e.strings.length; ++l) r.strings[l] = n.bytes === String ? a.base64.encode(e.strings[l], 0, e.strings[l].length) : n.bytes === Array ? Array.prototype.slice.call(e.strings[l]) : e.strings[l];
            if (e.tensors && e.tensors.length) for (r.tensors = [], l = 0; l < e.tensors.length; ++l) r.tensors[l] = i.onnx.TensorProto.toObject(e.tensors[l], n);
            if (e.graphs && e.graphs.length) for (r.graphs = [], l = 0; l < e.graphs.length; ++l) r.graphs[l] = i.onnx.GraphProto.toObject(e.graphs[l], n);
            return e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.type != null && e.hasOwnProperty("type") && (r.type = n.enums === String ? i.onnx.AttributeProto.AttributeType[e.type] : e.type), e.refAttrName != null && e.hasOwnProperty("refAttrName") && (r.refAttrName = e.refAttrName), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t.AttributeType = function() {
            var e = {}, n = Object.create(e);
            return n[e[0] = "UNDEFINED"] = 0, n[e[1] = "FLOAT"] = 1, n[e[2] = "INT"] = 2, n[e[3] = "STRING"] = 3, n[e[4] = "TENSOR"] = 4, n[e[5] = "GRAPH"] = 5, n[e[6] = "FLOATS"] = 6, n[e[7] = "INTS"] = 7, n[e[8] = "STRINGS"] = 8, n[e[9] = "TENSORS"] = 9, n[e[10] = "GRAPHS"] = 10, n;
          }(), t;
        }(), g.ValueInfoProto = function() {
          function t(e) {
            if (e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.name = "", t.prototype.type = null, t.prototype.docString = "", t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            return n || (n = f.create()), e.name != null && e.hasOwnProperty("name") && n.uint32(10).string(e.name), e.type != null && e.hasOwnProperty("type") && i.onnx.TypeProto.encode(e.type, n.uint32(18).fork()).ldelim(), e.docString != null && e.hasOwnProperty("docString") && n.uint32(26).string(e.docString), n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.ValueInfoProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  s.name = e.string();
                  break;
                case 2:
                  s.type = i.onnx.TypeProto.decode(e, e.uint32());
                  break;
                case 3:
                  s.docString = e.string();
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.name != null && e.hasOwnProperty("name") && !a.isString(e.name)) return "name: string expected";
            if (e.type != null && e.hasOwnProperty("type")) {
              var n = i.onnx.TypeProto.verify(e.type);
              if (n) return "type." + n;
            }
            return e.docString != null && e.hasOwnProperty("docString") && !a.isString(e.docString) ? "docString: string expected" : null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.ValueInfoProto) return e;
            var n = new i.onnx.ValueInfoProto();
            if (e.name != null && (n.name = String(e.name)), e.type != null) {
              if (typeof e.type != "object") throw TypeError(".onnx.ValueInfoProto.type: object expected");
              n.type = i.onnx.TypeProto.fromObject(e.type);
            }
            return e.docString != null && (n.docString = String(e.docString)), n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            return n.defaults && (r.name = "", r.type = null, r.docString = ""), e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.type != null && e.hasOwnProperty("type") && (r.type = i.onnx.TypeProto.toObject(e.type, n)), e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.NodeProto = function() {
          function t(e) {
            if (this.input = [], this.output = [], this.attribute = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.input = a.emptyArray, t.prototype.output = a.emptyArray, t.prototype.name = "", t.prototype.opType = "", t.prototype.domain = "", t.prototype.attribute = a.emptyArray, t.prototype.docString = "", t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.input != null && e.input.length) for (var r = 0; r < e.input.length; ++r) n.uint32(10).string(e.input[r]);
            if (e.output != null && e.output.length) for (r = 0; r < e.output.length; ++r) n.uint32(18).string(e.output[r]);
            if (e.name != null && e.hasOwnProperty("name") && n.uint32(26).string(e.name), e.opType != null && e.hasOwnProperty("opType") && n.uint32(34).string(e.opType), e.attribute != null && e.attribute.length) for (r = 0; r < e.attribute.length; ++r) i.onnx.AttributeProto.encode(e.attribute[r], n.uint32(42).fork()).ldelim();
            return e.docString != null && e.hasOwnProperty("docString") && n.uint32(50).string(e.docString), e.domain != null && e.hasOwnProperty("domain") && n.uint32(58).string(e.domain), n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.NodeProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  s.input && s.input.length || (s.input = []), s.input.push(e.string());
                  break;
                case 2:
                  s.output && s.output.length || (s.output = []), s.output.push(e.string());
                  break;
                case 3:
                  s.name = e.string();
                  break;
                case 4:
                  s.opType = e.string();
                  break;
                case 7:
                  s.domain = e.string();
                  break;
                case 5:
                  s.attribute && s.attribute.length || (s.attribute = []), s.attribute.push(i.onnx.AttributeProto.decode(e, e.uint32()));
                  break;
                case 6:
                  s.docString = e.string();
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.input != null && e.hasOwnProperty("input")) {
              if (!Array.isArray(e.input)) return "input: array expected";
              for (var n = 0; n < e.input.length; ++n) if (!a.isString(e.input[n])) return "input: string[] expected";
            }
            if (e.output != null && e.hasOwnProperty("output")) {
              if (!Array.isArray(e.output)) return "output: array expected";
              for (n = 0; n < e.output.length; ++n) if (!a.isString(e.output[n])) return "output: string[] expected";
            }
            if (e.name != null && e.hasOwnProperty("name") && !a.isString(e.name)) return "name: string expected";
            if (e.opType != null && e.hasOwnProperty("opType") && !a.isString(e.opType)) return "opType: string expected";
            if (e.domain != null && e.hasOwnProperty("domain") && !a.isString(e.domain)) return "domain: string expected";
            if (e.attribute != null && e.hasOwnProperty("attribute")) {
              if (!Array.isArray(e.attribute)) return "attribute: array expected";
              for (n = 0; n < e.attribute.length; ++n) {
                var r = i.onnx.AttributeProto.verify(e.attribute[n]);
                if (r) return "attribute." + r;
              }
            }
            return e.docString != null && e.hasOwnProperty("docString") && !a.isString(e.docString) ? "docString: string expected" : null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.NodeProto) return e;
            var n = new i.onnx.NodeProto();
            if (e.input) {
              if (!Array.isArray(e.input)) throw TypeError(".onnx.NodeProto.input: array expected");
              n.input = [];
              for (var r = 0; r < e.input.length; ++r) n.input[r] = String(e.input[r]);
            }
            if (e.output) {
              if (!Array.isArray(e.output)) throw TypeError(".onnx.NodeProto.output: array expected");
              for (n.output = [], r = 0; r < e.output.length; ++r) n.output[r] = String(e.output[r]);
            }
            if (e.name != null && (n.name = String(e.name)), e.opType != null && (n.opType = String(e.opType)), e.domain != null && (n.domain = String(e.domain)), e.attribute) {
              if (!Array.isArray(e.attribute)) throw TypeError(".onnx.NodeProto.attribute: array expected");
              for (n.attribute = [], r = 0; r < e.attribute.length; ++r) {
                if (typeof e.attribute[r] != "object") throw TypeError(".onnx.NodeProto.attribute: object expected");
                n.attribute[r] = i.onnx.AttributeProto.fromObject(e.attribute[r]);
              }
            }
            return e.docString != null && (n.docString = String(e.docString)), n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if ((n.arrays || n.defaults) && (r.input = [], r.output = [], r.attribute = []), n.defaults && (r.name = "", r.opType = "", r.docString = "", r.domain = ""), e.input && e.input.length) {
              r.input = [];
              for (var s = 0; s < e.input.length; ++s) r.input[s] = e.input[s];
            }
            if (e.output && e.output.length) for (r.output = [], s = 0; s < e.output.length; ++s) r.output[s] = e.output[s];
            if (e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.opType != null && e.hasOwnProperty("opType") && (r.opType = e.opType), e.attribute && e.attribute.length) for (r.attribute = [], s = 0; s < e.attribute.length; ++s) r.attribute[s] = i.onnx.AttributeProto.toObject(e.attribute[s], n);
            return e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.domain != null && e.hasOwnProperty("domain") && (r.domain = e.domain), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.ModelProto = function() {
          function t(e) {
            if (this.opsetImport = [], this.metadataProps = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.irVersion = a.Long ? a.Long.fromBits(0, 0, !1) : 0, t.prototype.opsetImport = a.emptyArray, t.prototype.producerName = "", t.prototype.producerVersion = "", t.prototype.domain = "", t.prototype.modelVersion = a.Long ? a.Long.fromBits(0, 0, !1) : 0, t.prototype.docString = "", t.prototype.graph = null, t.prototype.metadataProps = a.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.irVersion != null && e.hasOwnProperty("irVersion") && n.uint32(8).int64(e.irVersion), e.producerName != null && e.hasOwnProperty("producerName") && n.uint32(18).string(e.producerName), e.producerVersion != null && e.hasOwnProperty("producerVersion") && n.uint32(26).string(e.producerVersion), e.domain != null && e.hasOwnProperty("domain") && n.uint32(34).string(e.domain), e.modelVersion != null && e.hasOwnProperty("modelVersion") && n.uint32(40).int64(e.modelVersion), e.docString != null && e.hasOwnProperty("docString") && n.uint32(50).string(e.docString), e.graph != null && e.hasOwnProperty("graph") && i.onnx.GraphProto.encode(e.graph, n.uint32(58).fork()).ldelim(), e.opsetImport != null && e.opsetImport.length) for (var r = 0; r < e.opsetImport.length; ++r) i.onnx.OperatorSetIdProto.encode(e.opsetImport[r], n.uint32(66).fork()).ldelim();
            if (e.metadataProps != null && e.metadataProps.length) for (r = 0; r < e.metadataProps.length; ++r) i.onnx.StringStringEntryProto.encode(e.metadataProps[r], n.uint32(114).fork()).ldelim();
            return n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.ModelProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  s.irVersion = e.int64();
                  break;
                case 8:
                  s.opsetImport && s.opsetImport.length || (s.opsetImport = []), s.opsetImport.push(i.onnx.OperatorSetIdProto.decode(e, e.uint32()));
                  break;
                case 2:
                  s.producerName = e.string();
                  break;
                case 3:
                  s.producerVersion = e.string();
                  break;
                case 4:
                  s.domain = e.string();
                  break;
                case 5:
                  s.modelVersion = e.int64();
                  break;
                case 6:
                  s.docString = e.string();
                  break;
                case 7:
                  s.graph = i.onnx.GraphProto.decode(e, e.uint32());
                  break;
                case 14:
                  s.metadataProps && s.metadataProps.length || (s.metadataProps = []), s.metadataProps.push(i.onnx.StringStringEntryProto.decode(e, e.uint32()));
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.irVersion != null && e.hasOwnProperty("irVersion") && !(a.isInteger(e.irVersion) || e.irVersion && a.isInteger(e.irVersion.low) && a.isInteger(e.irVersion.high))) return "irVersion: integer|Long expected";
            if (e.opsetImport != null && e.hasOwnProperty("opsetImport")) {
              if (!Array.isArray(e.opsetImport)) return "opsetImport: array expected";
              for (var n = 0; n < e.opsetImport.length; ++n) if (r = i.onnx.OperatorSetIdProto.verify(e.opsetImport[n])) return "opsetImport." + r;
            }
            if (e.producerName != null && e.hasOwnProperty("producerName") && !a.isString(e.producerName)) return "producerName: string expected";
            if (e.producerVersion != null && e.hasOwnProperty("producerVersion") && !a.isString(e.producerVersion)) return "producerVersion: string expected";
            if (e.domain != null && e.hasOwnProperty("domain") && !a.isString(e.domain)) return "domain: string expected";
            if (e.modelVersion != null && e.hasOwnProperty("modelVersion") && !(a.isInteger(e.modelVersion) || e.modelVersion && a.isInteger(e.modelVersion.low) && a.isInteger(e.modelVersion.high))) return "modelVersion: integer|Long expected";
            if (e.docString != null && e.hasOwnProperty("docString") && !a.isString(e.docString)) return "docString: string expected";
            if (e.graph != null && e.hasOwnProperty("graph") && (r = i.onnx.GraphProto.verify(e.graph))) return "graph." + r;
            if (e.metadataProps != null && e.hasOwnProperty("metadataProps")) {
              if (!Array.isArray(e.metadataProps)) return "metadataProps: array expected";
              for (n = 0; n < e.metadataProps.length; ++n) {
                var r;
                if (r = i.onnx.StringStringEntryProto.verify(e.metadataProps[n])) return "metadataProps." + r;
              }
            }
            return null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.ModelProto) return e;
            var n = new i.onnx.ModelProto();
            if (e.irVersion != null && (a.Long ? (n.irVersion = a.Long.fromValue(e.irVersion)).unsigned = !1 : typeof e.irVersion == "string" ? n.irVersion = parseInt(e.irVersion, 10) : typeof e.irVersion == "number" ? n.irVersion = e.irVersion : typeof e.irVersion == "object" && (n.irVersion = new a.LongBits(e.irVersion.low >>> 0, e.irVersion.high >>> 0).toNumber())), e.opsetImport) {
              if (!Array.isArray(e.opsetImport)) throw TypeError(".onnx.ModelProto.opsetImport: array expected");
              n.opsetImport = [];
              for (var r = 0; r < e.opsetImport.length; ++r) {
                if (typeof e.opsetImport[r] != "object") throw TypeError(".onnx.ModelProto.opsetImport: object expected");
                n.opsetImport[r] = i.onnx.OperatorSetIdProto.fromObject(e.opsetImport[r]);
              }
            }
            if (e.producerName != null && (n.producerName = String(e.producerName)), e.producerVersion != null && (n.producerVersion = String(e.producerVersion)), e.domain != null && (n.domain = String(e.domain)), e.modelVersion != null && (a.Long ? (n.modelVersion = a.Long.fromValue(e.modelVersion)).unsigned = !1 : typeof e.modelVersion == "string" ? n.modelVersion = parseInt(e.modelVersion, 10) : typeof e.modelVersion == "number" ? n.modelVersion = e.modelVersion : typeof e.modelVersion == "object" && (n.modelVersion = new a.LongBits(e.modelVersion.low >>> 0, e.modelVersion.high >>> 0).toNumber())), e.docString != null && (n.docString = String(e.docString)), e.graph != null) {
              if (typeof e.graph != "object") throw TypeError(".onnx.ModelProto.graph: object expected");
              n.graph = i.onnx.GraphProto.fromObject(e.graph);
            }
            if (e.metadataProps) {
              if (!Array.isArray(e.metadataProps)) throw TypeError(".onnx.ModelProto.metadataProps: array expected");
              for (n.metadataProps = [], r = 0; r < e.metadataProps.length; ++r) {
                if (typeof e.metadataProps[r] != "object") throw TypeError(".onnx.ModelProto.metadataProps: object expected");
                n.metadataProps[r] = i.onnx.StringStringEntryProto.fromObject(e.metadataProps[r]);
              }
            }
            return n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if ((n.arrays || n.defaults) && (r.opsetImport = [], r.metadataProps = []), n.defaults) {
              if (a.Long) {
                var s = new a.Long(0, 0, !1);
                r.irVersion = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s;
              } else r.irVersion = n.longs === String ? "0" : 0;
              r.producerName = "", r.producerVersion = "", r.domain = "", a.Long ? (s = new a.Long(0, 0, !1), r.modelVersion = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s) : r.modelVersion = n.longs === String ? "0" : 0, r.docString = "", r.graph = null;
            }
            if (e.irVersion != null && e.hasOwnProperty("irVersion") && (typeof e.irVersion == "number" ? r.irVersion = n.longs === String ? String(e.irVersion) : e.irVersion : r.irVersion = n.longs === String ? a.Long.prototype.toString.call(e.irVersion) : n.longs === Number ? new a.LongBits(e.irVersion.low >>> 0, e.irVersion.high >>> 0).toNumber() : e.irVersion), e.producerName != null && e.hasOwnProperty("producerName") && (r.producerName = e.producerName), e.producerVersion != null && e.hasOwnProperty("producerVersion") && (r.producerVersion = e.producerVersion), e.domain != null && e.hasOwnProperty("domain") && (r.domain = e.domain), e.modelVersion != null && e.hasOwnProperty("modelVersion") && (typeof e.modelVersion == "number" ? r.modelVersion = n.longs === String ? String(e.modelVersion) : e.modelVersion : r.modelVersion = n.longs === String ? a.Long.prototype.toString.call(e.modelVersion) : n.longs === Number ? new a.LongBits(e.modelVersion.low >>> 0, e.modelVersion.high >>> 0).toNumber() : e.modelVersion), e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.graph != null && e.hasOwnProperty("graph") && (r.graph = i.onnx.GraphProto.toObject(e.graph, n)), e.opsetImport && e.opsetImport.length) {
              r.opsetImport = [];
              for (var l = 0; l < e.opsetImport.length; ++l) r.opsetImport[l] = i.onnx.OperatorSetIdProto.toObject(e.opsetImport[l], n);
            }
            if (e.metadataProps && e.metadataProps.length) for (r.metadataProps = [], l = 0; l < e.metadataProps.length; ++l) r.metadataProps[l] = i.onnx.StringStringEntryProto.toObject(e.metadataProps[l], n);
            return r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.StringStringEntryProto = function() {
          function t(e) {
            if (e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.key = "", t.prototype.value = "", t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            return n || (n = f.create()), e.key != null && e.hasOwnProperty("key") && n.uint32(10).string(e.key), e.value != null && e.hasOwnProperty("value") && n.uint32(18).string(e.value), n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.StringStringEntryProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  s.key = e.string();
                  break;
                case 2:
                  s.value = e.string();
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            return typeof e != "object" || e === null ? "object expected" : e.key != null && e.hasOwnProperty("key") && !a.isString(e.key) ? "key: string expected" : e.value != null && e.hasOwnProperty("value") && !a.isString(e.value) ? "value: string expected" : null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.StringStringEntryProto) return e;
            var n = new i.onnx.StringStringEntryProto();
            return e.key != null && (n.key = String(e.key)), e.value != null && (n.value = String(e.value)), n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            return n.defaults && (r.key = "", r.value = ""), e.key != null && e.hasOwnProperty("key") && (r.key = e.key), e.value != null && e.hasOwnProperty("value") && (r.value = e.value), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.TensorAnnotation = function() {
          function t(e) {
            if (this.quantParameterTensorNames = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.tensorName = "", t.prototype.quantParameterTensorNames = a.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.tensorName != null && e.hasOwnProperty("tensorName") && n.uint32(10).string(e.tensorName), e.quantParameterTensorNames != null && e.quantParameterTensorNames.length) for (var r = 0; r < e.quantParameterTensorNames.length; ++r) i.onnx.StringStringEntryProto.encode(e.quantParameterTensorNames[r], n.uint32(18).fork()).ldelim();
            return n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.TensorAnnotation(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  s.tensorName = e.string();
                  break;
                case 2:
                  s.quantParameterTensorNames && s.quantParameterTensorNames.length || (s.quantParameterTensorNames = []), s.quantParameterTensorNames.push(i.onnx.StringStringEntryProto.decode(e, e.uint32()));
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.tensorName != null && e.hasOwnProperty("tensorName") && !a.isString(e.tensorName)) return "tensorName: string expected";
            if (e.quantParameterTensorNames != null && e.hasOwnProperty("quantParameterTensorNames")) {
              if (!Array.isArray(e.quantParameterTensorNames)) return "quantParameterTensorNames: array expected";
              for (var n = 0; n < e.quantParameterTensorNames.length; ++n) {
                var r = i.onnx.StringStringEntryProto.verify(e.quantParameterTensorNames[n]);
                if (r) return "quantParameterTensorNames." + r;
              }
            }
            return null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.TensorAnnotation) return e;
            var n = new i.onnx.TensorAnnotation();
            if (e.tensorName != null && (n.tensorName = String(e.tensorName)), e.quantParameterTensorNames) {
              if (!Array.isArray(e.quantParameterTensorNames)) throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: array expected");
              n.quantParameterTensorNames = [];
              for (var r = 0; r < e.quantParameterTensorNames.length; ++r) {
                if (typeof e.quantParameterTensorNames[r] != "object") throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: object expected");
                n.quantParameterTensorNames[r] = i.onnx.StringStringEntryProto.fromObject(e.quantParameterTensorNames[r]);
              }
            }
            return n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if ((n.arrays || n.defaults) && (r.quantParameterTensorNames = []), n.defaults && (r.tensorName = ""), e.tensorName != null && e.hasOwnProperty("tensorName") && (r.tensorName = e.tensorName), e.quantParameterTensorNames && e.quantParameterTensorNames.length) {
              r.quantParameterTensorNames = [];
              for (var s = 0; s < e.quantParameterTensorNames.length; ++s) r.quantParameterTensorNames[s] = i.onnx.StringStringEntryProto.toObject(e.quantParameterTensorNames[s], n);
            }
            return r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.GraphProto = function() {
          function t(e) {
            if (this.node = [], this.initializer = [], this.input = [], this.output = [], this.valueInfo = [], this.quantizationAnnotation = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.node = a.emptyArray, t.prototype.name = "", t.prototype.initializer = a.emptyArray, t.prototype.docString = "", t.prototype.input = a.emptyArray, t.prototype.output = a.emptyArray, t.prototype.valueInfo = a.emptyArray, t.prototype.quantizationAnnotation = a.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.node != null && e.node.length) for (var r = 0; r < e.node.length; ++r) i.onnx.NodeProto.encode(e.node[r], n.uint32(10).fork()).ldelim();
            if (e.name != null && e.hasOwnProperty("name") && n.uint32(18).string(e.name), e.initializer != null && e.initializer.length) for (r = 0; r < e.initializer.length; ++r) i.onnx.TensorProto.encode(e.initializer[r], n.uint32(42).fork()).ldelim();
            if (e.docString != null && e.hasOwnProperty("docString") && n.uint32(82).string(e.docString), e.input != null && e.input.length) for (r = 0; r < e.input.length; ++r) i.onnx.ValueInfoProto.encode(e.input[r], n.uint32(90).fork()).ldelim();
            if (e.output != null && e.output.length) for (r = 0; r < e.output.length; ++r) i.onnx.ValueInfoProto.encode(e.output[r], n.uint32(98).fork()).ldelim();
            if (e.valueInfo != null && e.valueInfo.length) for (r = 0; r < e.valueInfo.length; ++r) i.onnx.ValueInfoProto.encode(e.valueInfo[r], n.uint32(106).fork()).ldelim();
            if (e.quantizationAnnotation != null && e.quantizationAnnotation.length) for (r = 0; r < e.quantizationAnnotation.length; ++r) i.onnx.TensorAnnotation.encode(e.quantizationAnnotation[r], n.uint32(114).fork()).ldelim();
            return n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.GraphProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  s.node && s.node.length || (s.node = []), s.node.push(i.onnx.NodeProto.decode(e, e.uint32()));
                  break;
                case 2:
                  s.name = e.string();
                  break;
                case 5:
                  s.initializer && s.initializer.length || (s.initializer = []), s.initializer.push(i.onnx.TensorProto.decode(e, e.uint32()));
                  break;
                case 10:
                  s.docString = e.string();
                  break;
                case 11:
                  s.input && s.input.length || (s.input = []), s.input.push(i.onnx.ValueInfoProto.decode(e, e.uint32()));
                  break;
                case 12:
                  s.output && s.output.length || (s.output = []), s.output.push(i.onnx.ValueInfoProto.decode(e, e.uint32()));
                  break;
                case 13:
                  s.valueInfo && s.valueInfo.length || (s.valueInfo = []), s.valueInfo.push(i.onnx.ValueInfoProto.decode(e, e.uint32()));
                  break;
                case 14:
                  s.quantizationAnnotation && s.quantizationAnnotation.length || (s.quantizationAnnotation = []), s.quantizationAnnotation.push(i.onnx.TensorAnnotation.decode(e, e.uint32()));
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.node != null && e.hasOwnProperty("node")) {
              if (!Array.isArray(e.node)) return "node: array expected";
              for (var n = 0; n < e.node.length; ++n) if (r = i.onnx.NodeProto.verify(e.node[n])) return "node." + r;
            }
            if (e.name != null && e.hasOwnProperty("name") && !a.isString(e.name)) return "name: string expected";
            if (e.initializer != null && e.hasOwnProperty("initializer")) {
              if (!Array.isArray(e.initializer)) return "initializer: array expected";
              for (n = 0; n < e.initializer.length; ++n) if (r = i.onnx.TensorProto.verify(e.initializer[n])) return "initializer." + r;
            }
            if (e.docString != null && e.hasOwnProperty("docString") && !a.isString(e.docString)) return "docString: string expected";
            if (e.input != null && e.hasOwnProperty("input")) {
              if (!Array.isArray(e.input)) return "input: array expected";
              for (n = 0; n < e.input.length; ++n) if (r = i.onnx.ValueInfoProto.verify(e.input[n])) return "input." + r;
            }
            if (e.output != null && e.hasOwnProperty("output")) {
              if (!Array.isArray(e.output)) return "output: array expected";
              for (n = 0; n < e.output.length; ++n) if (r = i.onnx.ValueInfoProto.verify(e.output[n])) return "output." + r;
            }
            if (e.valueInfo != null && e.hasOwnProperty("valueInfo")) {
              if (!Array.isArray(e.valueInfo)) return "valueInfo: array expected";
              for (n = 0; n < e.valueInfo.length; ++n) if (r = i.onnx.ValueInfoProto.verify(e.valueInfo[n])) return "valueInfo." + r;
            }
            if (e.quantizationAnnotation != null && e.hasOwnProperty("quantizationAnnotation")) {
              if (!Array.isArray(e.quantizationAnnotation)) return "quantizationAnnotation: array expected";
              for (n = 0; n < e.quantizationAnnotation.length; ++n) {
                var r;
                if (r = i.onnx.TensorAnnotation.verify(e.quantizationAnnotation[n])) return "quantizationAnnotation." + r;
              }
            }
            return null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.GraphProto) return e;
            var n = new i.onnx.GraphProto();
            if (e.node) {
              if (!Array.isArray(e.node)) throw TypeError(".onnx.GraphProto.node: array expected");
              n.node = [];
              for (var r = 0; r < e.node.length; ++r) {
                if (typeof e.node[r] != "object") throw TypeError(".onnx.GraphProto.node: object expected");
                n.node[r] = i.onnx.NodeProto.fromObject(e.node[r]);
              }
            }
            if (e.name != null && (n.name = String(e.name)), e.initializer) {
              if (!Array.isArray(e.initializer)) throw TypeError(".onnx.GraphProto.initializer: array expected");
              for (n.initializer = [], r = 0; r < e.initializer.length; ++r) {
                if (typeof e.initializer[r] != "object") throw TypeError(".onnx.GraphProto.initializer: object expected");
                n.initializer[r] = i.onnx.TensorProto.fromObject(e.initializer[r]);
              }
            }
            if (e.docString != null && (n.docString = String(e.docString)), e.input) {
              if (!Array.isArray(e.input)) throw TypeError(".onnx.GraphProto.input: array expected");
              for (n.input = [], r = 0; r < e.input.length; ++r) {
                if (typeof e.input[r] != "object") throw TypeError(".onnx.GraphProto.input: object expected");
                n.input[r] = i.onnx.ValueInfoProto.fromObject(e.input[r]);
              }
            }
            if (e.output) {
              if (!Array.isArray(e.output)) throw TypeError(".onnx.GraphProto.output: array expected");
              for (n.output = [], r = 0; r < e.output.length; ++r) {
                if (typeof e.output[r] != "object") throw TypeError(".onnx.GraphProto.output: object expected");
                n.output[r] = i.onnx.ValueInfoProto.fromObject(e.output[r]);
              }
            }
            if (e.valueInfo) {
              if (!Array.isArray(e.valueInfo)) throw TypeError(".onnx.GraphProto.valueInfo: array expected");
              for (n.valueInfo = [], r = 0; r < e.valueInfo.length; ++r) {
                if (typeof e.valueInfo[r] != "object") throw TypeError(".onnx.GraphProto.valueInfo: object expected");
                n.valueInfo[r] = i.onnx.ValueInfoProto.fromObject(e.valueInfo[r]);
              }
            }
            if (e.quantizationAnnotation) {
              if (!Array.isArray(e.quantizationAnnotation)) throw TypeError(".onnx.GraphProto.quantizationAnnotation: array expected");
              for (n.quantizationAnnotation = [], r = 0; r < e.quantizationAnnotation.length; ++r) {
                if (typeof e.quantizationAnnotation[r] != "object") throw TypeError(".onnx.GraphProto.quantizationAnnotation: object expected");
                n.quantizationAnnotation[r] = i.onnx.TensorAnnotation.fromObject(e.quantizationAnnotation[r]);
              }
            }
            return n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if ((n.arrays || n.defaults) && (r.node = [], r.initializer = [], r.input = [], r.output = [], r.valueInfo = [], r.quantizationAnnotation = []), n.defaults && (r.name = "", r.docString = ""), e.node && e.node.length) {
              r.node = [];
              for (var s = 0; s < e.node.length; ++s) r.node[s] = i.onnx.NodeProto.toObject(e.node[s], n);
            }
            if (e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.initializer && e.initializer.length) for (r.initializer = [], s = 0; s < e.initializer.length; ++s) r.initializer[s] = i.onnx.TensorProto.toObject(e.initializer[s], n);
            if (e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.input && e.input.length) for (r.input = [], s = 0; s < e.input.length; ++s) r.input[s] = i.onnx.ValueInfoProto.toObject(e.input[s], n);
            if (e.output && e.output.length) for (r.output = [], s = 0; s < e.output.length; ++s) r.output[s] = i.onnx.ValueInfoProto.toObject(e.output[s], n);
            if (e.valueInfo && e.valueInfo.length) for (r.valueInfo = [], s = 0; s < e.valueInfo.length; ++s) r.valueInfo[s] = i.onnx.ValueInfoProto.toObject(e.valueInfo[s], n);
            if (e.quantizationAnnotation && e.quantizationAnnotation.length) for (r.quantizationAnnotation = [], s = 0; s < e.quantizationAnnotation.length; ++s) r.quantizationAnnotation[s] = i.onnx.TensorAnnotation.toObject(e.quantizationAnnotation[s], n);
            return r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.TensorProto = function() {
          function t(e) {
            if (this.dims = [], this.floatData = [], this.int32Data = [], this.stringData = [], this.int64Data = [], this.externalData = [], this.doubleData = [], this.uint64Data = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.dims = a.emptyArray, t.prototype.dataType = 0, t.prototype.segment = null, t.prototype.floatData = a.emptyArray, t.prototype.int32Data = a.emptyArray, t.prototype.stringData = a.emptyArray, t.prototype.int64Data = a.emptyArray, t.prototype.name = "", t.prototype.docString = "", t.prototype.rawData = a.newBuffer([]), t.prototype.externalData = a.emptyArray, t.prototype.dataLocation = 0, t.prototype.doubleData = a.emptyArray, t.prototype.uint64Data = a.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.dims != null && e.dims.length) {
              n.uint32(10).fork();
              for (var r = 0; r < e.dims.length; ++r) n.int64(e.dims[r]);
              n.ldelim();
            }
            if (e.dataType != null && e.hasOwnProperty("dataType") && n.uint32(16).int32(e.dataType), e.segment != null && e.hasOwnProperty("segment") && i.onnx.TensorProto.Segment.encode(e.segment, n.uint32(26).fork()).ldelim(), e.floatData != null && e.floatData.length) {
              for (n.uint32(34).fork(), r = 0; r < e.floatData.length; ++r) n.float(e.floatData[r]);
              n.ldelim();
            }
            if (e.int32Data != null && e.int32Data.length) {
              for (n.uint32(42).fork(), r = 0; r < e.int32Data.length; ++r) n.int32(e.int32Data[r]);
              n.ldelim();
            }
            if (e.stringData != null && e.stringData.length) for (r = 0; r < e.stringData.length; ++r) n.uint32(50).bytes(e.stringData[r]);
            if (e.int64Data != null && e.int64Data.length) {
              for (n.uint32(58).fork(), r = 0; r < e.int64Data.length; ++r) n.int64(e.int64Data[r]);
              n.ldelim();
            }
            if (e.name != null && e.hasOwnProperty("name") && n.uint32(66).string(e.name), e.rawData != null && e.hasOwnProperty("rawData") && n.uint32(74).bytes(e.rawData), e.doubleData != null && e.doubleData.length) {
              for (n.uint32(82).fork(), r = 0; r < e.doubleData.length; ++r) n.double(e.doubleData[r]);
              n.ldelim();
            }
            if (e.uint64Data != null && e.uint64Data.length) {
              for (n.uint32(90).fork(), r = 0; r < e.uint64Data.length; ++r) n.uint64(e.uint64Data[r]);
              n.ldelim();
            }
            if (e.docString != null && e.hasOwnProperty("docString") && n.uint32(98).string(e.docString), e.externalData != null && e.externalData.length) for (r = 0; r < e.externalData.length; ++r) i.onnx.StringStringEntryProto.encode(e.externalData[r], n.uint32(106).fork()).ldelim();
            return e.dataLocation != null && e.hasOwnProperty("dataLocation") && n.uint32(112).int32(e.dataLocation), n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.TensorProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  if (s.dims && s.dims.length || (s.dims = []), (7 & l) == 2) for (var d = e.uint32() + e.pos; e.pos < d; ) s.dims.push(e.int64());
                  else s.dims.push(e.int64());
                  break;
                case 2:
                  s.dataType = e.int32();
                  break;
                case 3:
                  s.segment = i.onnx.TensorProto.Segment.decode(e, e.uint32());
                  break;
                case 4:
                  if (s.floatData && s.floatData.length || (s.floatData = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) s.floatData.push(e.float());
                  else s.floatData.push(e.float());
                  break;
                case 5:
                  if (s.int32Data && s.int32Data.length || (s.int32Data = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) s.int32Data.push(e.int32());
                  else s.int32Data.push(e.int32());
                  break;
                case 6:
                  s.stringData && s.stringData.length || (s.stringData = []), s.stringData.push(e.bytes());
                  break;
                case 7:
                  if (s.int64Data && s.int64Data.length || (s.int64Data = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) s.int64Data.push(e.int64());
                  else s.int64Data.push(e.int64());
                  break;
                case 8:
                  s.name = e.string();
                  break;
                case 12:
                  s.docString = e.string();
                  break;
                case 9:
                  s.rawData = e.bytes();
                  break;
                case 13:
                  s.externalData && s.externalData.length || (s.externalData = []), s.externalData.push(i.onnx.StringStringEntryProto.decode(e, e.uint32()));
                  break;
                case 14:
                  s.dataLocation = e.int32();
                  break;
                case 10:
                  if (s.doubleData && s.doubleData.length || (s.doubleData = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) s.doubleData.push(e.double());
                  else s.doubleData.push(e.double());
                  break;
                case 11:
                  if (s.uint64Data && s.uint64Data.length || (s.uint64Data = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) s.uint64Data.push(e.uint64());
                  else s.uint64Data.push(e.uint64());
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.dims != null && e.hasOwnProperty("dims")) {
              if (!Array.isArray(e.dims)) return "dims: array expected";
              for (var n = 0; n < e.dims.length; ++n) if (!(a.isInteger(e.dims[n]) || e.dims[n] && a.isInteger(e.dims[n].low) && a.isInteger(e.dims[n].high))) return "dims: integer|Long[] expected";
            }
            if (e.dataType != null && e.hasOwnProperty("dataType") && !a.isInteger(e.dataType)) return "dataType: integer expected";
            if (e.segment != null && e.hasOwnProperty("segment") && (r = i.onnx.TensorProto.Segment.verify(e.segment))) return "segment." + r;
            if (e.floatData != null && e.hasOwnProperty("floatData")) {
              if (!Array.isArray(e.floatData)) return "floatData: array expected";
              for (n = 0; n < e.floatData.length; ++n) if (typeof e.floatData[n] != "number") return "floatData: number[] expected";
            }
            if (e.int32Data != null && e.hasOwnProperty("int32Data")) {
              if (!Array.isArray(e.int32Data)) return "int32Data: array expected";
              for (n = 0; n < e.int32Data.length; ++n) if (!a.isInteger(e.int32Data[n])) return "int32Data: integer[] expected";
            }
            if (e.stringData != null && e.hasOwnProperty("stringData")) {
              if (!Array.isArray(e.stringData)) return "stringData: array expected";
              for (n = 0; n < e.stringData.length; ++n) if (!(e.stringData[n] && typeof e.stringData[n].length == "number" || a.isString(e.stringData[n]))) return "stringData: buffer[] expected";
            }
            if (e.int64Data != null && e.hasOwnProperty("int64Data")) {
              if (!Array.isArray(e.int64Data)) return "int64Data: array expected";
              for (n = 0; n < e.int64Data.length; ++n) if (!(a.isInteger(e.int64Data[n]) || e.int64Data[n] && a.isInteger(e.int64Data[n].low) && a.isInteger(e.int64Data[n].high))) return "int64Data: integer|Long[] expected";
            }
            if (e.name != null && e.hasOwnProperty("name") && !a.isString(e.name)) return "name: string expected";
            if (e.docString != null && e.hasOwnProperty("docString") && !a.isString(e.docString)) return "docString: string expected";
            if (e.rawData != null && e.hasOwnProperty("rawData") && !(e.rawData && typeof e.rawData.length == "number" || a.isString(e.rawData))) return "rawData: buffer expected";
            if (e.externalData != null && e.hasOwnProperty("externalData")) {
              if (!Array.isArray(e.externalData)) return "externalData: array expected";
              for (n = 0; n < e.externalData.length; ++n) {
                var r;
                if (r = i.onnx.StringStringEntryProto.verify(e.externalData[n])) return "externalData." + r;
              }
            }
            if (e.dataLocation != null && e.hasOwnProperty("dataLocation")) switch (e.dataLocation) {
              default:
                return "dataLocation: enum value expected";
              case 0:
              case 1:
            }
            if (e.doubleData != null && e.hasOwnProperty("doubleData")) {
              if (!Array.isArray(e.doubleData)) return "doubleData: array expected";
              for (n = 0; n < e.doubleData.length; ++n) if (typeof e.doubleData[n] != "number") return "doubleData: number[] expected";
            }
            if (e.uint64Data != null && e.hasOwnProperty("uint64Data")) {
              if (!Array.isArray(e.uint64Data)) return "uint64Data: array expected";
              for (n = 0; n < e.uint64Data.length; ++n) if (!(a.isInteger(e.uint64Data[n]) || e.uint64Data[n] && a.isInteger(e.uint64Data[n].low) && a.isInteger(e.uint64Data[n].high))) return "uint64Data: integer|Long[] expected";
            }
            return null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.TensorProto) return e;
            var n = new i.onnx.TensorProto();
            if (e.dims) {
              if (!Array.isArray(e.dims)) throw TypeError(".onnx.TensorProto.dims: array expected");
              n.dims = [];
              for (var r = 0; r < e.dims.length; ++r) a.Long ? (n.dims[r] = a.Long.fromValue(e.dims[r])).unsigned = !1 : typeof e.dims[r] == "string" ? n.dims[r] = parseInt(e.dims[r], 10) : typeof e.dims[r] == "number" ? n.dims[r] = e.dims[r] : typeof e.dims[r] == "object" && (n.dims[r] = new a.LongBits(e.dims[r].low >>> 0, e.dims[r].high >>> 0).toNumber());
            }
            if (e.dataType != null && (n.dataType = 0 | e.dataType), e.segment != null) {
              if (typeof e.segment != "object") throw TypeError(".onnx.TensorProto.segment: object expected");
              n.segment = i.onnx.TensorProto.Segment.fromObject(e.segment);
            }
            if (e.floatData) {
              if (!Array.isArray(e.floatData)) throw TypeError(".onnx.TensorProto.floatData: array expected");
              for (n.floatData = [], r = 0; r < e.floatData.length; ++r) n.floatData[r] = Number(e.floatData[r]);
            }
            if (e.int32Data) {
              if (!Array.isArray(e.int32Data)) throw TypeError(".onnx.TensorProto.int32Data: array expected");
              for (n.int32Data = [], r = 0; r < e.int32Data.length; ++r) n.int32Data[r] = 0 | e.int32Data[r];
            }
            if (e.stringData) {
              if (!Array.isArray(e.stringData)) throw TypeError(".onnx.TensorProto.stringData: array expected");
              for (n.stringData = [], r = 0; r < e.stringData.length; ++r) typeof e.stringData[r] == "string" ? a.base64.decode(e.stringData[r], n.stringData[r] = a.newBuffer(a.base64.length(e.stringData[r])), 0) : e.stringData[r].length && (n.stringData[r] = e.stringData[r]);
            }
            if (e.int64Data) {
              if (!Array.isArray(e.int64Data)) throw TypeError(".onnx.TensorProto.int64Data: array expected");
              for (n.int64Data = [], r = 0; r < e.int64Data.length; ++r) a.Long ? (n.int64Data[r] = a.Long.fromValue(e.int64Data[r])).unsigned = !1 : typeof e.int64Data[r] == "string" ? n.int64Data[r] = parseInt(e.int64Data[r], 10) : typeof e.int64Data[r] == "number" ? n.int64Data[r] = e.int64Data[r] : typeof e.int64Data[r] == "object" && (n.int64Data[r] = new a.LongBits(e.int64Data[r].low >>> 0, e.int64Data[r].high >>> 0).toNumber());
            }
            if (e.name != null && (n.name = String(e.name)), e.docString != null && (n.docString = String(e.docString)), e.rawData != null && (typeof e.rawData == "string" ? a.base64.decode(e.rawData, n.rawData = a.newBuffer(a.base64.length(e.rawData)), 0) : e.rawData.length && (n.rawData = e.rawData)), e.externalData) {
              if (!Array.isArray(e.externalData)) throw TypeError(".onnx.TensorProto.externalData: array expected");
              for (n.externalData = [], r = 0; r < e.externalData.length; ++r) {
                if (typeof e.externalData[r] != "object") throw TypeError(".onnx.TensorProto.externalData: object expected");
                n.externalData[r] = i.onnx.StringStringEntryProto.fromObject(e.externalData[r]);
              }
            }
            switch (e.dataLocation) {
              case "DEFAULT":
              case 0:
                n.dataLocation = 0;
                break;
              case "EXTERNAL":
              case 1:
                n.dataLocation = 1;
            }
            if (e.doubleData) {
              if (!Array.isArray(e.doubleData)) throw TypeError(".onnx.TensorProto.doubleData: array expected");
              for (n.doubleData = [], r = 0; r < e.doubleData.length; ++r) n.doubleData[r] = Number(e.doubleData[r]);
            }
            if (e.uint64Data) {
              if (!Array.isArray(e.uint64Data)) throw TypeError(".onnx.TensorProto.uint64Data: array expected");
              for (n.uint64Data = [], r = 0; r < e.uint64Data.length; ++r) a.Long ? (n.uint64Data[r] = a.Long.fromValue(e.uint64Data[r])).unsigned = !0 : typeof e.uint64Data[r] == "string" ? n.uint64Data[r] = parseInt(e.uint64Data[r], 10) : typeof e.uint64Data[r] == "number" ? n.uint64Data[r] = e.uint64Data[r] : typeof e.uint64Data[r] == "object" && (n.uint64Data[r] = new a.LongBits(e.uint64Data[r].low >>> 0, e.uint64Data[r].high >>> 0).toNumber(!0));
            }
            return n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if ((n.arrays || n.defaults) && (r.dims = [], r.floatData = [], r.int32Data = [], r.stringData = [], r.int64Data = [], r.doubleData = [], r.uint64Data = [], r.externalData = []), n.defaults && (r.dataType = 0, r.segment = null, r.name = "", n.bytes === String ? r.rawData = "" : (r.rawData = [], n.bytes !== Array && (r.rawData = a.newBuffer(r.rawData))), r.docString = "", r.dataLocation = n.enums === String ? "DEFAULT" : 0), e.dims && e.dims.length) {
              r.dims = [];
              for (var s = 0; s < e.dims.length; ++s) typeof e.dims[s] == "number" ? r.dims[s] = n.longs === String ? String(e.dims[s]) : e.dims[s] : r.dims[s] = n.longs === String ? a.Long.prototype.toString.call(e.dims[s]) : n.longs === Number ? new a.LongBits(e.dims[s].low >>> 0, e.dims[s].high >>> 0).toNumber() : e.dims[s];
            }
            if (e.dataType != null && e.hasOwnProperty("dataType") && (r.dataType = e.dataType), e.segment != null && e.hasOwnProperty("segment") && (r.segment = i.onnx.TensorProto.Segment.toObject(e.segment, n)), e.floatData && e.floatData.length) for (r.floatData = [], s = 0; s < e.floatData.length; ++s) r.floatData[s] = n.json && !isFinite(e.floatData[s]) ? String(e.floatData[s]) : e.floatData[s];
            if (e.int32Data && e.int32Data.length) for (r.int32Data = [], s = 0; s < e.int32Data.length; ++s) r.int32Data[s] = e.int32Data[s];
            if (e.stringData && e.stringData.length) for (r.stringData = [], s = 0; s < e.stringData.length; ++s) r.stringData[s] = n.bytes === String ? a.base64.encode(e.stringData[s], 0, e.stringData[s].length) : n.bytes === Array ? Array.prototype.slice.call(e.stringData[s]) : e.stringData[s];
            if (e.int64Data && e.int64Data.length) for (r.int64Data = [], s = 0; s < e.int64Data.length; ++s) typeof e.int64Data[s] == "number" ? r.int64Data[s] = n.longs === String ? String(e.int64Data[s]) : e.int64Data[s] : r.int64Data[s] = n.longs === String ? a.Long.prototype.toString.call(e.int64Data[s]) : n.longs === Number ? new a.LongBits(e.int64Data[s].low >>> 0, e.int64Data[s].high >>> 0).toNumber() : e.int64Data[s];
            if (e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.rawData != null && e.hasOwnProperty("rawData") && (r.rawData = n.bytes === String ? a.base64.encode(e.rawData, 0, e.rawData.length) : n.bytes === Array ? Array.prototype.slice.call(e.rawData) : e.rawData), e.doubleData && e.doubleData.length) for (r.doubleData = [], s = 0; s < e.doubleData.length; ++s) r.doubleData[s] = n.json && !isFinite(e.doubleData[s]) ? String(e.doubleData[s]) : e.doubleData[s];
            if (e.uint64Data && e.uint64Data.length) for (r.uint64Data = [], s = 0; s < e.uint64Data.length; ++s) typeof e.uint64Data[s] == "number" ? r.uint64Data[s] = n.longs === String ? String(e.uint64Data[s]) : e.uint64Data[s] : r.uint64Data[s] = n.longs === String ? a.Long.prototype.toString.call(e.uint64Data[s]) : n.longs === Number ? new a.LongBits(e.uint64Data[s].low >>> 0, e.uint64Data[s].high >>> 0).toNumber(!0) : e.uint64Data[s];
            if (e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.externalData && e.externalData.length) for (r.externalData = [], s = 0; s < e.externalData.length; ++s) r.externalData[s] = i.onnx.StringStringEntryProto.toObject(e.externalData[s], n);
            return e.dataLocation != null && e.hasOwnProperty("dataLocation") && (r.dataLocation = n.enums === String ? i.onnx.TensorProto.DataLocation[e.dataLocation] : e.dataLocation), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t.DataType = function() {
            var e = {}, n = Object.create(e);
            return n[e[0] = "UNDEFINED"] = 0, n[e[1] = "FLOAT"] = 1, n[e[2] = "UINT8"] = 2, n[e[3] = "INT8"] = 3, n[e[4] = "UINT16"] = 4, n[e[5] = "INT16"] = 5, n[e[6] = "INT32"] = 6, n[e[7] = "INT64"] = 7, n[e[8] = "STRING"] = 8, n[e[9] = "BOOL"] = 9, n[e[10] = "FLOAT16"] = 10, n[e[11] = "DOUBLE"] = 11, n[e[12] = "UINT32"] = 12, n[e[13] = "UINT64"] = 13, n[e[14] = "COMPLEX64"] = 14, n[e[15] = "COMPLEX128"] = 15, n[e[16] = "BFLOAT16"] = 16, n;
          }(), t.Segment = function() {
            function e(n) {
              if (n) for (var r = Object.keys(n), s = 0; s < r.length; ++s) n[r[s]] != null && (this[r[s]] = n[r[s]]);
            }
            return e.prototype.begin = a.Long ? a.Long.fromBits(0, 0, !1) : 0, e.prototype.end = a.Long ? a.Long.fromBits(0, 0, !1) : 0, e.create = function(n) {
              return new e(n);
            }, e.encode = function(n, r) {
              return r || (r = f.create()), n.begin != null && n.hasOwnProperty("begin") && r.uint32(8).int64(n.begin), n.end != null && n.hasOwnProperty("end") && r.uint32(16).int64(n.end), r;
            }, e.encodeDelimited = function(n, r) {
              return this.encode(n, r).ldelim();
            }, e.decode = function(n, r) {
              n instanceof c || (n = c.create(n));
              for (var s = r === void 0 ? n.len : n.pos + r, l = new i.onnx.TensorProto.Segment(); n.pos < s; ) {
                var d = n.uint32();
                switch (d >>> 3) {
                  case 1:
                    l.begin = n.int64();
                    break;
                  case 2:
                    l.end = n.int64();
                    break;
                  default:
                    n.skipType(7 & d);
                }
              }
              return l;
            }, e.decodeDelimited = function(n) {
              return n instanceof c || (n = new c(n)), this.decode(n, n.uint32());
            }, e.verify = function(n) {
              return typeof n != "object" || n === null ? "object expected" : n.begin != null && n.hasOwnProperty("begin") && !(a.isInteger(n.begin) || n.begin && a.isInteger(n.begin.low) && a.isInteger(n.begin.high)) ? "begin: integer|Long expected" : n.end != null && n.hasOwnProperty("end") && !(a.isInteger(n.end) || n.end && a.isInteger(n.end.low) && a.isInteger(n.end.high)) ? "end: integer|Long expected" : null;
            }, e.fromObject = function(n) {
              if (n instanceof i.onnx.TensorProto.Segment) return n;
              var r = new i.onnx.TensorProto.Segment();
              return n.begin != null && (a.Long ? (r.begin = a.Long.fromValue(n.begin)).unsigned = !1 : typeof n.begin == "string" ? r.begin = parseInt(n.begin, 10) : typeof n.begin == "number" ? r.begin = n.begin : typeof n.begin == "object" && (r.begin = new a.LongBits(n.begin.low >>> 0, n.begin.high >>> 0).toNumber())), n.end != null && (a.Long ? (r.end = a.Long.fromValue(n.end)).unsigned = !1 : typeof n.end == "string" ? r.end = parseInt(n.end, 10) : typeof n.end == "number" ? r.end = n.end : typeof n.end == "object" && (r.end = new a.LongBits(n.end.low >>> 0, n.end.high >>> 0).toNumber())), r;
            }, e.toObject = function(n, r) {
              r || (r = {});
              var s = {};
              if (r.defaults) {
                if (a.Long) {
                  var l = new a.Long(0, 0, !1);
                  s.begin = r.longs === String ? l.toString() : r.longs === Number ? l.toNumber() : l;
                } else s.begin = r.longs === String ? "0" : 0;
                a.Long ? (l = new a.Long(0, 0, !1), s.end = r.longs === String ? l.toString() : r.longs === Number ? l.toNumber() : l) : s.end = r.longs === String ? "0" : 0;
              }
              return n.begin != null && n.hasOwnProperty("begin") && (typeof n.begin == "number" ? s.begin = r.longs === String ? String(n.begin) : n.begin : s.begin = r.longs === String ? a.Long.prototype.toString.call(n.begin) : r.longs === Number ? new a.LongBits(n.begin.low >>> 0, n.begin.high >>> 0).toNumber() : n.begin), n.end != null && n.hasOwnProperty("end") && (typeof n.end == "number" ? s.end = r.longs === String ? String(n.end) : n.end : s.end = r.longs === String ? a.Long.prototype.toString.call(n.end) : r.longs === Number ? new a.LongBits(n.end.low >>> 0, n.end.high >>> 0).toNumber() : n.end), s;
            }, e.prototype.toJSON = function() {
              return this.constructor.toObject(this, o.util.toJSONOptions);
            }, e;
          }(), t.DataLocation = function() {
            var e = {}, n = Object.create(e);
            return n[e[0] = "DEFAULT"] = 0, n[e[1] = "EXTERNAL"] = 1, n;
          }(), t;
        }(), g.TensorShapeProto = function() {
          function t(e) {
            if (this.dim = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.dim = a.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.dim != null && e.dim.length) for (var r = 0; r < e.dim.length; ++r) i.onnx.TensorShapeProto.Dimension.encode(e.dim[r], n.uint32(10).fork()).ldelim();
            return n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.TensorShapeProto(); e.pos < r; ) {
              var l = e.uint32();
              l >>> 3 == 1 ? (s.dim && s.dim.length || (s.dim = []), s.dim.push(i.onnx.TensorShapeProto.Dimension.decode(e, e.uint32()))) : e.skipType(7 & l);
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.dim != null && e.hasOwnProperty("dim")) {
              if (!Array.isArray(e.dim)) return "dim: array expected";
              for (var n = 0; n < e.dim.length; ++n) {
                var r = i.onnx.TensorShapeProto.Dimension.verify(e.dim[n]);
                if (r) return "dim." + r;
              }
            }
            return null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.TensorShapeProto) return e;
            var n = new i.onnx.TensorShapeProto();
            if (e.dim) {
              if (!Array.isArray(e.dim)) throw TypeError(".onnx.TensorShapeProto.dim: array expected");
              n.dim = [];
              for (var r = 0; r < e.dim.length; ++r) {
                if (typeof e.dim[r] != "object") throw TypeError(".onnx.TensorShapeProto.dim: object expected");
                n.dim[r] = i.onnx.TensorShapeProto.Dimension.fromObject(e.dim[r]);
              }
            }
            return n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if ((n.arrays || n.defaults) && (r.dim = []), e.dim && e.dim.length) {
              r.dim = [];
              for (var s = 0; s < e.dim.length; ++s) r.dim[s] = i.onnx.TensorShapeProto.Dimension.toObject(e.dim[s], n);
            }
            return r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t.Dimension = function() {
            function e(r) {
              if (r) for (var s = Object.keys(r), l = 0; l < s.length; ++l) r[s[l]] != null && (this[s[l]] = r[s[l]]);
            }
            var n;
            return e.prototype.dimValue = a.Long ? a.Long.fromBits(0, 0, !1) : 0, e.prototype.dimParam = "", e.prototype.denotation = "", Object.defineProperty(e.prototype, "value", { get: a.oneOfGetter(n = ["dimValue", "dimParam"]), set: a.oneOfSetter(n) }), e.create = function(r) {
              return new e(r);
            }, e.encode = function(r, s) {
              return s || (s = f.create()), r.dimValue != null && r.hasOwnProperty("dimValue") && s.uint32(8).int64(r.dimValue), r.dimParam != null && r.hasOwnProperty("dimParam") && s.uint32(18).string(r.dimParam), r.denotation != null && r.hasOwnProperty("denotation") && s.uint32(26).string(r.denotation), s;
            }, e.encodeDelimited = function(r, s) {
              return this.encode(r, s).ldelim();
            }, e.decode = function(r, s) {
              r instanceof c || (r = c.create(r));
              for (var l = s === void 0 ? r.len : r.pos + s, d = new i.onnx.TensorShapeProto.Dimension(); r.pos < l; ) {
                var m = r.uint32();
                switch (m >>> 3) {
                  case 1:
                    d.dimValue = r.int64();
                    break;
                  case 2:
                    d.dimParam = r.string();
                    break;
                  case 3:
                    d.denotation = r.string();
                    break;
                  default:
                    r.skipType(7 & m);
                }
              }
              return d;
            }, e.decodeDelimited = function(r) {
              return r instanceof c || (r = new c(r)), this.decode(r, r.uint32());
            }, e.verify = function(r) {
              if (typeof r != "object" || r === null) return "object expected";
              var s = {};
              if (r.dimValue != null && r.hasOwnProperty("dimValue") && (s.value = 1, !(a.isInteger(r.dimValue) || r.dimValue && a.isInteger(r.dimValue.low) && a.isInteger(r.dimValue.high)))) return "dimValue: integer|Long expected";
              if (r.dimParam != null && r.hasOwnProperty("dimParam")) {
                if (s.value === 1) return "value: multiple values";
                if (s.value = 1, !a.isString(r.dimParam)) return "dimParam: string expected";
              }
              return r.denotation != null && r.hasOwnProperty("denotation") && !a.isString(r.denotation) ? "denotation: string expected" : null;
            }, e.fromObject = function(r) {
              if (r instanceof i.onnx.TensorShapeProto.Dimension) return r;
              var s = new i.onnx.TensorShapeProto.Dimension();
              return r.dimValue != null && (a.Long ? (s.dimValue = a.Long.fromValue(r.dimValue)).unsigned = !1 : typeof r.dimValue == "string" ? s.dimValue = parseInt(r.dimValue, 10) : typeof r.dimValue == "number" ? s.dimValue = r.dimValue : typeof r.dimValue == "object" && (s.dimValue = new a.LongBits(r.dimValue.low >>> 0, r.dimValue.high >>> 0).toNumber())), r.dimParam != null && (s.dimParam = String(r.dimParam)), r.denotation != null && (s.denotation = String(r.denotation)), s;
            }, e.toObject = function(r, s) {
              s || (s = {});
              var l = {};
              return s.defaults && (l.denotation = ""), r.dimValue != null && r.hasOwnProperty("dimValue") && (typeof r.dimValue == "number" ? l.dimValue = s.longs === String ? String(r.dimValue) : r.dimValue : l.dimValue = s.longs === String ? a.Long.prototype.toString.call(r.dimValue) : s.longs === Number ? new a.LongBits(r.dimValue.low >>> 0, r.dimValue.high >>> 0).toNumber() : r.dimValue, s.oneofs && (l.value = "dimValue")), r.dimParam != null && r.hasOwnProperty("dimParam") && (l.dimParam = r.dimParam, s.oneofs && (l.value = "dimParam")), r.denotation != null && r.hasOwnProperty("denotation") && (l.denotation = r.denotation), l;
            }, e.prototype.toJSON = function() {
              return this.constructor.toObject(this, o.util.toJSONOptions);
            }, e;
          }(), t;
        }(), g.TypeProto = function() {
          function t(n) {
            if (n) for (var r = Object.keys(n), s = 0; s < r.length; ++s) n[r[s]] != null && (this[r[s]] = n[r[s]]);
          }
          var e;
          return t.prototype.tensorType = null, t.prototype.denotation = "", Object.defineProperty(t.prototype, "value", { get: a.oneOfGetter(e = ["tensorType"]), set: a.oneOfSetter(e) }), t.create = function(n) {
            return new t(n);
          }, t.encode = function(n, r) {
            return r || (r = f.create()), n.tensorType != null && n.hasOwnProperty("tensorType") && i.onnx.TypeProto.Tensor.encode(n.tensorType, r.uint32(10).fork()).ldelim(), n.denotation != null && n.hasOwnProperty("denotation") && r.uint32(50).string(n.denotation), r;
          }, t.encodeDelimited = function(n, r) {
            return this.encode(n, r).ldelim();
          }, t.decode = function(n, r) {
            n instanceof c || (n = c.create(n));
            for (var s = r === void 0 ? n.len : n.pos + r, l = new i.onnx.TypeProto(); n.pos < s; ) {
              var d = n.uint32();
              switch (d >>> 3) {
                case 1:
                  l.tensorType = i.onnx.TypeProto.Tensor.decode(n, n.uint32());
                  break;
                case 6:
                  l.denotation = n.string();
                  break;
                default:
                  n.skipType(7 & d);
              }
            }
            return l;
          }, t.decodeDelimited = function(n) {
            return n instanceof c || (n = new c(n)), this.decode(n, n.uint32());
          }, t.verify = function(n) {
            if (typeof n != "object" || n === null) return "object expected";
            if (n.tensorType != null && n.hasOwnProperty("tensorType")) {
              var r = i.onnx.TypeProto.Tensor.verify(n.tensorType);
              if (r) return "tensorType." + r;
            }
            return n.denotation != null && n.hasOwnProperty("denotation") && !a.isString(n.denotation) ? "denotation: string expected" : null;
          }, t.fromObject = function(n) {
            if (n instanceof i.onnx.TypeProto) return n;
            var r = new i.onnx.TypeProto();
            if (n.tensorType != null) {
              if (typeof n.tensorType != "object") throw TypeError(".onnx.TypeProto.tensorType: object expected");
              r.tensorType = i.onnx.TypeProto.Tensor.fromObject(n.tensorType);
            }
            return n.denotation != null && (r.denotation = String(n.denotation)), r;
          }, t.toObject = function(n, r) {
            r || (r = {});
            var s = {};
            return r.defaults && (s.denotation = ""), n.tensorType != null && n.hasOwnProperty("tensorType") && (s.tensorType = i.onnx.TypeProto.Tensor.toObject(n.tensorType, r), r.oneofs && (s.value = "tensorType")), n.denotation != null && n.hasOwnProperty("denotation") && (s.denotation = n.denotation), s;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t.Tensor = function() {
            function n(r) {
              if (r) for (var s = Object.keys(r), l = 0; l < s.length; ++l) r[s[l]] != null && (this[s[l]] = r[s[l]]);
            }
            return n.prototype.elemType = 0, n.prototype.shape = null, n.create = function(r) {
              return new n(r);
            }, n.encode = function(r, s) {
              return s || (s = f.create()), r.elemType != null && r.hasOwnProperty("elemType") && s.uint32(8).int32(r.elemType), r.shape != null && r.hasOwnProperty("shape") && i.onnx.TensorShapeProto.encode(r.shape, s.uint32(18).fork()).ldelim(), s;
            }, n.encodeDelimited = function(r, s) {
              return this.encode(r, s).ldelim();
            }, n.decode = function(r, s) {
              r instanceof c || (r = c.create(r));
              for (var l = s === void 0 ? r.len : r.pos + s, d = new i.onnx.TypeProto.Tensor(); r.pos < l; ) {
                var m = r.uint32();
                switch (m >>> 3) {
                  case 1:
                    d.elemType = r.int32();
                    break;
                  case 2:
                    d.shape = i.onnx.TensorShapeProto.decode(r, r.uint32());
                    break;
                  default:
                    r.skipType(7 & m);
                }
              }
              return d;
            }, n.decodeDelimited = function(r) {
              return r instanceof c || (r = new c(r)), this.decode(r, r.uint32());
            }, n.verify = function(r) {
              if (typeof r != "object" || r === null) return "object expected";
              if (r.elemType != null && r.hasOwnProperty("elemType") && !a.isInteger(r.elemType)) return "elemType: integer expected";
              if (r.shape != null && r.hasOwnProperty("shape")) {
                var s = i.onnx.TensorShapeProto.verify(r.shape);
                if (s) return "shape." + s;
              }
              return null;
            }, n.fromObject = function(r) {
              if (r instanceof i.onnx.TypeProto.Tensor) return r;
              var s = new i.onnx.TypeProto.Tensor();
              if (r.elemType != null && (s.elemType = 0 | r.elemType), r.shape != null) {
                if (typeof r.shape != "object") throw TypeError(".onnx.TypeProto.Tensor.shape: object expected");
                s.shape = i.onnx.TensorShapeProto.fromObject(r.shape);
              }
              return s;
            }, n.toObject = function(r, s) {
              s || (s = {});
              var l = {};
              return s.defaults && (l.elemType = 0, l.shape = null), r.elemType != null && r.hasOwnProperty("elemType") && (l.elemType = r.elemType), r.shape != null && r.hasOwnProperty("shape") && (l.shape = i.onnx.TensorShapeProto.toObject(r.shape, s)), l;
            }, n.prototype.toJSON = function() {
              return this.constructor.toObject(this, o.util.toJSONOptions);
            }, n;
          }(), t;
        }(), g.OperatorSetIdProto = function() {
          function t(e) {
            if (e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.domain = "", t.prototype.version = a.Long ? a.Long.fromBits(0, 0, !1) : 0, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            return n || (n = f.create()), e.domain != null && e.hasOwnProperty("domain") && n.uint32(10).string(e.domain), e.version != null && e.hasOwnProperty("version") && n.uint32(16).int64(e.version), n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, s = new i.onnx.OperatorSetIdProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  s.domain = e.string();
                  break;
                case 2:
                  s.version = e.int64();
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return s;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            return typeof e != "object" || e === null ? "object expected" : e.domain != null && e.hasOwnProperty("domain") && !a.isString(e.domain) ? "domain: string expected" : e.version != null && e.hasOwnProperty("version") && !(a.isInteger(e.version) || e.version && a.isInteger(e.version.low) && a.isInteger(e.version.high)) ? "version: integer|Long expected" : null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.OperatorSetIdProto) return e;
            var n = new i.onnx.OperatorSetIdProto();
            return e.domain != null && (n.domain = String(e.domain)), e.version != null && (a.Long ? (n.version = a.Long.fromValue(e.version)).unsigned = !1 : typeof e.version == "string" ? n.version = parseInt(e.version, 10) : typeof e.version == "number" ? n.version = e.version : typeof e.version == "object" && (n.version = new a.LongBits(e.version.low >>> 0, e.version.high >>> 0).toNumber())), n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if (n.defaults) if (r.domain = "", a.Long) {
              var s = new a.Long(0, 0, !1);
              r.version = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s;
            } else r.version = n.longs === String ? "0" : 0;
            return e.domain != null && e.hasOwnProperty("domain") && (r.domain = e.domain), e.version != null && e.hasOwnProperty("version") && (typeof e.version == "number" ? r.version = n.longs === String ? String(e.version) : e.version : r.version = n.longs === String ? a.Long.prototype.toString.call(e.version) : n.longs === Number ? new a.LongBits(e.version.low >>> 0, e.version.high >>> 0).toNumber() : e.version), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g), C.exports = i;
      }, 2100: (C, u, b) => {
        C.exports = b(9482);
      }, 9482: (C, u, b) => {
        var h = u;
        function p() {
          h.util._configure(), h.Writer._configure(h.BufferWriter), h.Reader._configure(h.BufferReader);
        }
        h.build = "minimal", h.Writer = b(1173), h.BufferWriter = b(3155), h.Reader = b(1408), h.BufferReader = b(593), h.util = b(9693), h.rpc = b(5994), h.roots = b(5054), h.configure = p, p();
      }, 1408: (C, u, b) => {
        C.exports = f;
        var h, p = b(9693), g = p.LongBits, o = p.utf8;
        function c(s, l) {
          return RangeError("index out of range: " + s.pos + " + " + (l || 1) + " > " + s.len);
        }
        function f(s) {
          this.buf = s, this.pos = 0, this.len = s.length;
        }
        var a, i = typeof Uint8Array < "u" ? function(s) {
          if (s instanceof Uint8Array || Array.isArray(s)) return new f(s);
          throw Error("illegal buffer");
        } : function(s) {
          if (Array.isArray(s)) return new f(s);
          throw Error("illegal buffer");
        }, t = function() {
          return p.Buffer ? function(s) {
            return (f.create = function(l) {
              return p.Buffer.isBuffer(l) ? new h(l) : i(l);
            })(s);
          } : i;
        };
        function e() {
          var s = new g(0, 0), l = 0;
          if (!(this.len - this.pos > 4)) {
            for (; l < 3; ++l) {
              if (this.pos >= this.len) throw c(this);
              if (s.lo = (s.lo | (127 & this.buf[this.pos]) << 7 * l) >>> 0, this.buf[this.pos++] < 128) return s;
            }
            return s.lo = (s.lo | (127 & this.buf[this.pos++]) << 7 * l) >>> 0, s;
          }
          for (; l < 4; ++l) if (s.lo = (s.lo | (127 & this.buf[this.pos]) << 7 * l) >>> 0, this.buf[this.pos++] < 128) return s;
          if (s.lo = (s.lo | (127 & this.buf[this.pos]) << 28) >>> 0, s.hi = (s.hi | (127 & this.buf[this.pos]) >> 4) >>> 0, this.buf[this.pos++] < 128) return s;
          if (l = 0, this.len - this.pos > 4) {
            for (; l < 5; ++l) if (s.hi = (s.hi | (127 & this.buf[this.pos]) << 7 * l + 3) >>> 0, this.buf[this.pos++] < 128) return s;
          } else for (; l < 5; ++l) {
            if (this.pos >= this.len) throw c(this);
            if (s.hi = (s.hi | (127 & this.buf[this.pos]) << 7 * l + 3) >>> 0, this.buf[this.pos++] < 128) return s;
          }
          throw Error("invalid varint encoding");
        }
        function n(s, l) {
          return (s[l - 4] | s[l - 3] << 8 | s[l - 2] << 16 | s[l - 1] << 24) >>> 0;
        }
        function r() {
          if (this.pos + 8 > this.len) throw c(this, 8);
          return new g(n(this.buf, this.pos += 4), n(this.buf, this.pos += 4));
        }
        f.create = t(), f.prototype._slice = p.Array.prototype.subarray || p.Array.prototype.slice, f.prototype.uint32 = (a = 4294967295, function() {
          if (a = (127 & this.buf[this.pos]) >>> 0, this.buf[this.pos++] < 128 || (a = (a | (127 & this.buf[this.pos]) << 7) >>> 0, this.buf[this.pos++] < 128) || (a = (a | (127 & this.buf[this.pos]) << 14) >>> 0, this.buf[this.pos++] < 128) || (a = (a | (127 & this.buf[this.pos]) << 21) >>> 0, this.buf[this.pos++] < 128) || (a = (a | (15 & this.buf[this.pos]) << 28) >>> 0, this.buf[this.pos++] < 128)) return a;
          if ((this.pos += 5) > this.len) throw this.pos = this.len, c(this, 10);
          return a;
        }), f.prototype.int32 = function() {
          return 0 | this.uint32();
        }, f.prototype.sint32 = function() {
          var s = this.uint32();
          return s >>> 1 ^ -(1 & s) | 0;
        }, f.prototype.bool = function() {
          return this.uint32() !== 0;
        }, f.prototype.fixed32 = function() {
          if (this.pos + 4 > this.len) throw c(this, 4);
          return n(this.buf, this.pos += 4);
        }, f.prototype.sfixed32 = function() {
          if (this.pos + 4 > this.len) throw c(this, 4);
          return 0 | n(this.buf, this.pos += 4);
        }, f.prototype.float = function() {
          if (this.pos + 4 > this.len) throw c(this, 4);
          var s = p.float.readFloatLE(this.buf, this.pos);
          return this.pos += 4, s;
        }, f.prototype.double = function() {
          if (this.pos + 8 > this.len) throw c(this, 4);
          var s = p.float.readDoubleLE(this.buf, this.pos);
          return this.pos += 8, s;
        }, f.prototype.bytes = function() {
          var s = this.uint32(), l = this.pos, d = this.pos + s;
          if (d > this.len) throw c(this, s);
          return this.pos += s, Array.isArray(this.buf) ? this.buf.slice(l, d) : l === d ? new this.buf.constructor(0) : this._slice.call(this.buf, l, d);
        }, f.prototype.string = function() {
          var s = this.bytes();
          return o.read(s, 0, s.length);
        }, f.prototype.skip = function(s) {
          if (typeof s == "number") {
            if (this.pos + s > this.len) throw c(this, s);
            this.pos += s;
          } else do
            if (this.pos >= this.len) throw c(this);
          while (128 & this.buf[this.pos++]);
          return this;
        }, f.prototype.skipType = function(s) {
          switch (s) {
            case 0:
              this.skip();
              break;
            case 1:
              this.skip(8);
              break;
            case 2:
              this.skip(this.uint32());
              break;
            case 3:
              for (; (s = 7 & this.uint32()) != 4; ) this.skipType(s);
              break;
            case 5:
              this.skip(4);
              break;
            default:
              throw Error("invalid wire type " + s + " at offset " + this.pos);
          }
          return this;
        }, f._configure = function(s) {
          h = s, f.create = t(), h._configure();
          var l = p.Long ? "toLong" : "toNumber";
          p.merge(f.prototype, { int64: function() {
            return e.call(this)[l](!1);
          }, uint64: function() {
            return e.call(this)[l](!0);
          }, sint64: function() {
            return e.call(this).zzDecode()[l](!1);
          }, fixed64: function() {
            return r.call(this)[l](!0);
          }, sfixed64: function() {
            return r.call(this)[l](!1);
          } });
        };
      }, 593: (C, u, b) => {
        C.exports = g;
        var h = b(1408);
        (g.prototype = Object.create(h.prototype)).constructor = g;
        var p = b(9693);
        function g(o) {
          h.call(this, o);
        }
        g._configure = function() {
          p.Buffer && (g.prototype._slice = p.Buffer.prototype.slice);
        }, g.prototype.string = function() {
          var o = this.uint32();
          return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + o, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + o, this.len));
        }, g._configure();
      }, 5054: (C) => {
        C.exports = {};
      }, 5994: (C, u, b) => {
        u.Service = b(7948);
      }, 7948: (C, u, b) => {
        C.exports = p;
        var h = b(9693);
        function p(g, o, c) {
          if (typeof g != "function") throw TypeError("rpcImpl must be a function");
          h.EventEmitter.call(this), this.rpcImpl = g, this.requestDelimited = !!o, this.responseDelimited = !!c;
        }
        (p.prototype = Object.create(h.EventEmitter.prototype)).constructor = p, p.prototype.rpcCall = function g(o, c, f, a, i) {
          if (!a) throw TypeError("request must be specified");
          var t = this;
          if (!i) return h.asPromise(g, t, o, c, f, a);
          if (t.rpcImpl) try {
            return t.rpcImpl(o, c[t.requestDelimited ? "encodeDelimited" : "encode"](a).finish(), function(e, n) {
              if (e) return t.emit("error", e, o), i(e);
              if (n !== null) {
                if (!(n instanceof f)) try {
                  n = f[t.responseDelimited ? "decodeDelimited" : "decode"](n);
                } catch (r) {
                  return t.emit("error", r, o), i(r);
                }
                return t.emit("data", n, o), i(null, n);
              }
              t.end(!0);
            });
          } catch (e) {
            return t.emit("error", e, o), void setTimeout(function() {
              i(e);
            }, 0);
          }
          else setTimeout(function() {
            i(Error("already ended"));
          }, 0);
        }, p.prototype.end = function(g) {
          return this.rpcImpl && (g || this.rpcImpl(null, null, null), this.rpcImpl = null, this.emit("end").off()), this;
        };
      }, 1945: (C, u, b) => {
        C.exports = p;
        var h = b(9693);
        function p(f, a) {
          this.lo = f >>> 0, this.hi = a >>> 0;
        }
        var g = p.zero = new p(0, 0);
        g.toNumber = function() {
          return 0;
        }, g.zzEncode = g.zzDecode = function() {
          return this;
        }, g.length = function() {
          return 1;
        };
        var o = p.zeroHash = "\0\0\0\0\0\0\0\0";
        p.fromNumber = function(f) {
          if (f === 0) return g;
          var a = f < 0;
          a && (f = -f);
          var i = f >>> 0, t = (f - i) / 4294967296 >>> 0;
          return a && (t = ~t >>> 0, i = ~i >>> 0, ++i > 4294967295 && (i = 0, ++t > 4294967295 && (t = 0))), new p(i, t);
        }, p.from = function(f) {
          if (typeof f == "number") return p.fromNumber(f);
          if (h.isString(f)) {
            if (!h.Long) return p.fromNumber(parseInt(f, 10));
            f = h.Long.fromString(f);
          }
          return f.low || f.high ? new p(f.low >>> 0, f.high >>> 0) : g;
        }, p.prototype.toNumber = function(f) {
          if (!f && this.hi >>> 31) {
            var a = 1 + ~this.lo >>> 0, i = ~this.hi >>> 0;
            return a || (i = i + 1 >>> 0), -(a + 4294967296 * i);
          }
          return this.lo + 4294967296 * this.hi;
        }, p.prototype.toLong = function(f) {
          return h.Long ? new h.Long(0 | this.lo, 0 | this.hi, !!f) : { low: 0 | this.lo, high: 0 | this.hi, unsigned: !!f };
        };
        var c = String.prototype.charCodeAt;
        p.fromHash = function(f) {
          return f === o ? g : new p((c.call(f, 0) | c.call(f, 1) << 8 | c.call(f, 2) << 16 | c.call(f, 3) << 24) >>> 0, (c.call(f, 4) | c.call(f, 5) << 8 | c.call(f, 6) << 16 | c.call(f, 7) << 24) >>> 0);
        }, p.prototype.toHash = function() {
          return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
        }, p.prototype.zzEncode = function() {
          var f = this.hi >> 31;
          return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ f) >>> 0, this.lo = (this.lo << 1 ^ f) >>> 0, this;
        }, p.prototype.zzDecode = function() {
          var f = -(1 & this.lo);
          return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ f) >>> 0, this.hi = (this.hi >>> 1 ^ f) >>> 0, this;
        }, p.prototype.length = function() {
          var f = this.lo, a = (this.lo >>> 28 | this.hi << 4) >>> 0, i = this.hi >>> 24;
          return i === 0 ? a === 0 ? f < 16384 ? f < 128 ? 1 : 2 : f < 2097152 ? 3 : 4 : a < 16384 ? a < 128 ? 5 : 6 : a < 2097152 ? 7 : 8 : i < 128 ? 9 : 10;
        };
      }, 9693: function(C, u, b) {
        var h = u;
        function p(o, c, f) {
          for (var a = Object.keys(c), i = 0; i < a.length; ++i) o[a[i]] !== void 0 && f || (o[a[i]] = c[a[i]]);
          return o;
        }
        function g(o) {
          function c(f, a) {
            if (!(this instanceof c)) return new c(f, a);
            Object.defineProperty(this, "message", { get: function() {
              return f;
            } }), Error.captureStackTrace ? Error.captureStackTrace(this, c) : Object.defineProperty(this, "stack", { value: new Error().stack || "" }), a && p(this, a);
          }
          return (c.prototype = Object.create(Error.prototype)).constructor = c, Object.defineProperty(c.prototype, "name", { get: function() {
            return o;
          } }), c.prototype.toString = function() {
            return this.name + ": " + this.message;
          }, c;
        }
        h.asPromise = b(4537), h.base64 = b(7419), h.EventEmitter = b(9211), h.float = b(945), h.inquire = b(7199), h.utf8 = b(4997), h.pool = b(6662), h.LongBits = b(1945), h.isNode = !!(b.g !== void 0 && b.g && b.g.process && b.g.process.versions && b.g.process.versions.node), h.global = h.isNode && b.g || typeof window < "u" && window || typeof self < "u" && self || this, h.emptyArray = Object.freeze ? Object.freeze([]) : [], h.emptyObject = Object.freeze ? Object.freeze({}) : {}, h.isInteger = Number.isInteger || function(o) {
          return typeof o == "number" && isFinite(o) && Math.floor(o) === o;
        }, h.isString = function(o) {
          return typeof o == "string" || o instanceof String;
        }, h.isObject = function(o) {
          return o && typeof o == "object";
        }, h.isset = h.isSet = function(o, c) {
          var f = o[c];
          return !(f == null || !o.hasOwnProperty(c)) && (typeof f != "object" || (Array.isArray(f) ? f.length : Object.keys(f).length) > 0);
        }, h.Buffer = function() {
          try {
            var o = h.inquire("buffer").Buffer;
            return o.prototype.utf8Write ? o : null;
          } catch {
            return null;
          }
        }(), h._Buffer_from = null, h._Buffer_allocUnsafe = null, h.newBuffer = function(o) {
          return typeof o == "number" ? h.Buffer ? h._Buffer_allocUnsafe(o) : new h.Array(o) : h.Buffer ? h._Buffer_from(o) : typeof Uint8Array > "u" ? o : new Uint8Array(o);
        }, h.Array = typeof Uint8Array < "u" ? Uint8Array : Array, h.Long = h.global.dcodeIO && h.global.dcodeIO.Long || h.global.Long || h.inquire("long"), h.key2Re = /^true|false|0|1$/, h.key32Re = /^-?(?:0|[1-9][0-9]*)$/, h.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/, h.longToHash = function(o) {
          return o ? h.LongBits.from(o).toHash() : h.LongBits.zeroHash;
        }, h.longFromHash = function(o, c) {
          var f = h.LongBits.fromHash(o);
          return h.Long ? h.Long.fromBits(f.lo, f.hi, c) : f.toNumber(!!c);
        }, h.merge = p, h.lcFirst = function(o) {
          return o.charAt(0).toLowerCase() + o.substring(1);
        }, h.newError = g, h.ProtocolError = g("ProtocolError"), h.oneOfGetter = function(o) {
          for (var c = {}, f = 0; f < o.length; ++f) c[o[f]] = 1;
          return function() {
            for (var a = Object.keys(this), i = a.length - 1; i > -1; --i) if (c[a[i]] === 1 && this[a[i]] !== void 0 && this[a[i]] !== null) return a[i];
          };
        }, h.oneOfSetter = function(o) {
          return function(c) {
            for (var f = 0; f < o.length; ++f) o[f] !== c && delete this[o[f]];
          };
        }, h.toJSONOptions = { longs: String, enums: String, bytes: String, json: !0 }, h._configure = function() {
          var o = h.Buffer;
          o ? (h._Buffer_from = o.from !== Uint8Array.from && o.from || function(c, f) {
            return new o(c, f);
          }, h._Buffer_allocUnsafe = o.allocUnsafe || function(c) {
            return new o(c);
          }) : h._Buffer_from = h._Buffer_allocUnsafe = null;
        };
      }, 1173: (C, u, b) => {
        C.exports = t;
        var h, p = b(9693), g = p.LongBits, o = p.base64, c = p.utf8;
        function f(m, y, w) {
          this.fn = m, this.len = y, this.next = void 0, this.val = w;
        }
        function a() {
        }
        function i(m) {
          this.head = m.head, this.tail = m.tail, this.len = m.len, this.next = m.states;
        }
        function t() {
          this.len = 0, this.head = new f(a, 0, 0), this.tail = this.head, this.states = null;
        }
        var e = function() {
          return p.Buffer ? function() {
            return (t.create = function() {
              return new h();
            })();
          } : function() {
            return new t();
          };
        };
        function n(m, y, w) {
          y[w] = 255 & m;
        }
        function r(m, y) {
          this.len = m, this.next = void 0, this.val = y;
        }
        function s(m, y, w) {
          for (; m.hi; ) y[w++] = 127 & m.lo | 128, m.lo = (m.lo >>> 7 | m.hi << 25) >>> 0, m.hi >>>= 7;
          for (; m.lo > 127; ) y[w++] = 127 & m.lo | 128, m.lo = m.lo >>> 7;
          y[w++] = m.lo;
        }
        function l(m, y, w) {
          y[w] = 255 & m, y[w + 1] = m >>> 8 & 255, y[w + 2] = m >>> 16 & 255, y[w + 3] = m >>> 24;
        }
        t.create = e(), t.alloc = function(m) {
          return new p.Array(m);
        }, p.Array !== Array && (t.alloc = p.pool(t.alloc, p.Array.prototype.subarray)), t.prototype._push = function(m, y, w) {
          return this.tail = this.tail.next = new f(m, y, w), this.len += y, this;
        }, r.prototype = Object.create(f.prototype), r.prototype.fn = function(m, y, w) {
          for (; m > 127; ) y[w++] = 127 & m | 128, m >>>= 7;
          y[w] = m;
        }, t.prototype.uint32 = function(m) {
          return this.len += (this.tail = this.tail.next = new r((m >>>= 0) < 128 ? 1 : m < 16384 ? 2 : m < 2097152 ? 3 : m < 268435456 ? 4 : 5, m)).len, this;
        }, t.prototype.int32 = function(m) {
          return m < 0 ? this._push(s, 10, g.fromNumber(m)) : this.uint32(m);
        }, t.prototype.sint32 = function(m) {
          return this.uint32((m << 1 ^ m >> 31) >>> 0);
        }, t.prototype.uint64 = function(m) {
          var y = g.from(m);
          return this._push(s, y.length(), y);
        }, t.prototype.int64 = t.prototype.uint64, t.prototype.sint64 = function(m) {
          var y = g.from(m).zzEncode();
          return this._push(s, y.length(), y);
        }, t.prototype.bool = function(m) {
          return this._push(n, 1, m ? 1 : 0);
        }, t.prototype.fixed32 = function(m) {
          return this._push(l, 4, m >>> 0);
        }, t.prototype.sfixed32 = t.prototype.fixed32, t.prototype.fixed64 = function(m) {
          var y = g.from(m);
          return this._push(l, 4, y.lo)._push(l, 4, y.hi);
        }, t.prototype.sfixed64 = t.prototype.fixed64, t.prototype.float = function(m) {
          return this._push(p.float.writeFloatLE, 4, m);
        }, t.prototype.double = function(m) {
          return this._push(p.float.writeDoubleLE, 8, m);
        };
        var d = p.Array.prototype.set ? function(m, y, w) {
          y.set(m, w);
        } : function(m, y, w) {
          for (var _ = 0; _ < m.length; ++_) y[w + _] = m[_];
        };
        t.prototype.bytes = function(m) {
          var y = m.length >>> 0;
          if (!y) return this._push(n, 1, 0);
          if (p.isString(m)) {
            var w = t.alloc(y = o.length(m));
            o.decode(m, w, 0), m = w;
          }
          return this.uint32(y)._push(d, y, m);
        }, t.prototype.string = function(m) {
          var y = c.length(m);
          return y ? this.uint32(y)._push(c.write, y, m) : this._push(n, 1, 0);
        }, t.prototype.fork = function() {
          return this.states = new i(this), this.head = this.tail = new f(a, 0, 0), this.len = 0, this;
        }, t.prototype.reset = function() {
          return this.states ? (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new f(a, 0, 0), this.len = 0), this;
        }, t.prototype.ldelim = function() {
          var m = this.head, y = this.tail, w = this.len;
          return this.reset().uint32(w), w && (this.tail.next = m.next, this.tail = y, this.len += w), this;
        }, t.prototype.finish = function() {
          for (var m = this.head.next, y = this.constructor.alloc(this.len), w = 0; m; ) m.fn(m.val, y, w), w += m.len, m = m.next;
          return y;
        }, t._configure = function(m) {
          h = m, t.create = e(), h._configure();
        };
      }, 3155: (C, u, b) => {
        C.exports = g;
        var h = b(1173);
        (g.prototype = Object.create(h.prototype)).constructor = g;
        var p = b(9693);
        function g() {
          h.call(this);
        }
        function o(c, f, a) {
          c.length < 40 ? p.utf8.write(c, f, a) : f.utf8Write ? f.utf8Write(c, a) : f.write(c, a);
        }
        g._configure = function() {
          g.alloc = p._Buffer_allocUnsafe, g.writeBytesBuffer = p.Buffer && p.Buffer.prototype instanceof Uint8Array && p.Buffer.prototype.set.name === "set" ? function(c, f, a) {
            f.set(c, a);
          } : function(c, f, a) {
            if (c.copy) c.copy(f, a, 0, c.length);
            else for (var i = 0; i < c.length; ) f[a++] = c[i++];
          };
        }, g.prototype.bytes = function(c) {
          p.isString(c) && (c = p._Buffer_from(c, "base64"));
          var f = c.length >>> 0;
          return this.uint32(f), f && this._push(g.writeBytesBuffer, f, c), this;
        }, g.prototype.string = function(c) {
          var f = p.Buffer.byteLength(c);
          return this.uint32(f), f && this._push(o, f, c), this;
        }, g._configure();
      }, 7714: (C, u, b) => {
        u.R = void 0;
        const h = b(6919), p = b(7448);
        u.R = new class {
          async init() {
          }
          async createSessionHandler(g, o) {
            const c = new h.Session(o);
            return await c.loadModel(g), new p.OnnxjsSessionHandler(c);
          }
        }();
      }, 4200: (C, u, b) => {
        u.c8 = u.rX = void 0;
        const h = b(1670), p = b(5381), g = b(2157), o = b(2306);
        u.rX = () => {
          if ((typeof h.env.wasm.initTimeout != "number" || h.env.wasm.initTimeout < 0) && (h.env.wasm.initTimeout = 0), typeof h.env.wasm.simd != "boolean" && (h.env.wasm.simd = !0), typeof h.env.wasm.proxy != "boolean" && (h.env.wasm.proxy = !1), typeof h.env.wasm.numThreads != "number" || !Number.isInteger(h.env.wasm.numThreads) || h.env.wasm.numThreads <= 0) {
            const c = typeof navigator > "u" ? (0, p.cpus)().length : navigator.hardwareConcurrency;
            h.env.wasm.numThreads = Math.min(4, Math.ceil((c || 1) / 2));
          }
        }, u.c8 = new class {
          async init() {
            (0, u.rX)(), await (0, g.initWasm)();
          }
          async createSessionHandler(c, f) {
            const a = new o.OnnxruntimeWebAssemblySessionHandler();
            return await a.loadModel(c, f), Promise.resolve(a);
          }
        }();
      }, 6018: function(C, u, b) {
        var h = this && this.__createBinding || (Object.create ? function(o, c, f, a) {
          a === void 0 && (a = f);
          var i = Object.getOwnPropertyDescriptor(c, f);
          i && !("get" in i ? !c.__esModule : i.writable || i.configurable) || (i = { enumerable: !0, get: function() {
            return c[f];
          } }), Object.defineProperty(o, a, i);
        } : function(o, c, f, a) {
          a === void 0 && (a = f), o[a] = c[f];
        }), p = this && this.__exportStar || function(o, c) {
          for (var f in o) f === "default" || Object.prototype.hasOwnProperty.call(c, f) || h(c, o, f);
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), p(b(1670), u);
        const g = b(1670);
        {
          const o = b(7714).R;
          (0, g.registerBackend)("webgl", o, -10);
        }
        {
          const o = b(4200).c8;
          (0, g.registerBackend)("cpu", o, 10), (0, g.registerBackend)("wasm", o, 10), (0, g.registerBackend)("xnnpack", o, 9);
        }
      }, 246: (C, u) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createAttributeWithCacheKey = void 0;
        class b {
          constructor(p) {
            Object.assign(this, p);
          }
          get cacheKey() {
            return this._cacheKey || (this._cacheKey = Object.getOwnPropertyNames(this).sort().map((p) => `${this[p]}`).join(";")), this._cacheKey;
          }
        }
        u.createAttributeWithCacheKey = (h) => new b(h);
      }, 7778: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Attribute = void 0;
        const h = b(1446), p = b(9395), g = b(9162), o = b(2517);
        var c = p.onnxruntime.experimental.fbs;
        class f {
          constructor(i) {
            if (this._attributes = /* @__PURE__ */ new Map(), i != null) {
              for (const t of i) t instanceof h.onnx.AttributeProto ? this._attributes.set(t.name, [f.getValue(t), f.getType(t)]) : t instanceof c.Attribute && this._attributes.set(t.name(), [f.getValue(t), f.getType(t)]);
              if (this._attributes.size < i.length) throw new Error("duplicated attribute names");
            }
          }
          set(i, t, e) {
            this._attributes.set(i, [e, t]);
          }
          delete(i) {
            this._attributes.delete(i);
          }
          getFloat(i, t) {
            return this.get(i, "float", t);
          }
          getInt(i, t) {
            return this.get(i, "int", t);
          }
          getString(i, t) {
            return this.get(i, "string", t);
          }
          getTensor(i, t) {
            return this.get(i, "tensor", t);
          }
          getFloats(i, t) {
            return this.get(i, "floats", t);
          }
          getInts(i, t) {
            return this.get(i, "ints", t);
          }
          getStrings(i, t) {
            return this.get(i, "strings", t);
          }
          getTensors(i, t) {
            return this.get(i, "tensors", t);
          }
          get(i, t, e) {
            const n = this._attributes.get(i);
            if (n === void 0) {
              if (e !== void 0) return e;
              throw new Error(`required attribute not found: ${i}`);
            }
            if (n[1] !== t) throw new Error(`type mismatch: expected ${t} but got ${n[1]}`);
            return n[0];
          }
          static getType(i) {
            const t = i instanceof h.onnx.AttributeProto ? i.type : i.type();
            switch (t) {
              case h.onnx.AttributeProto.AttributeType.FLOAT:
                return "float";
              case h.onnx.AttributeProto.AttributeType.INT:
                return "int";
              case h.onnx.AttributeProto.AttributeType.STRING:
                return "string";
              case h.onnx.AttributeProto.AttributeType.TENSOR:
                return "tensor";
              case h.onnx.AttributeProto.AttributeType.FLOATS:
                return "floats";
              case h.onnx.AttributeProto.AttributeType.INTS:
                return "ints";
              case h.onnx.AttributeProto.AttributeType.STRINGS:
                return "strings";
              case h.onnx.AttributeProto.AttributeType.TENSORS:
                return "tensors";
              default:
                throw new Error(`attribute type is not supported yet: ${h.onnx.AttributeProto.AttributeType[t]}`);
            }
          }
          static getValue(i) {
            const t = i instanceof h.onnx.AttributeProto ? i.type : i.type();
            if (t === h.onnx.AttributeProto.AttributeType.GRAPH || t === h.onnx.AttributeProto.AttributeType.GRAPHS) throw new Error("graph attribute is not supported yet");
            const e = this.getValueNoCheck(i);
            if (t === h.onnx.AttributeProto.AttributeType.INT && o.LongUtil.isLong(e)) return o.LongUtil.longToNumber(e);
            if (t === h.onnx.AttributeProto.AttributeType.INTS) {
              const n = e, r = new Array(n.length);
              for (let s = 0; s < n.length; s++) {
                const l = n[s];
                r[s] = o.LongUtil.longToNumber(l);
              }
              return r;
            }
            if (t === h.onnx.AttributeProto.AttributeType.TENSOR) return i instanceof h.onnx.AttributeProto ? g.Tensor.fromProto(e) : g.Tensor.fromOrtTensor(e);
            if (t === h.onnx.AttributeProto.AttributeType.TENSORS) {
              if (i instanceof h.onnx.AttributeProto) return e.map((n) => g.Tensor.fromProto(n));
              if (i instanceof c.Attribute) return e.map((n) => g.Tensor.fromOrtTensor(n));
            }
            if (t === h.onnx.AttributeProto.AttributeType.STRING && i instanceof h.onnx.AttributeProto) {
              const n = e;
              return (0, o.decodeUtf8String)(n);
            }
            return t === h.onnx.AttributeProto.AttributeType.STRINGS && i instanceof h.onnx.AttributeProto ? e.map(o.decodeUtf8String) : e;
          }
          static getValueNoCheck(i) {
            return i instanceof h.onnx.AttributeProto ? this.getValueNoCheckFromOnnxFormat(i) : this.getValueNoCheckFromOrtFormat(i);
          }
          static getValueNoCheckFromOnnxFormat(i) {
            switch (i.type) {
              case h.onnx.AttributeProto.AttributeType.FLOAT:
                return i.f;
              case h.onnx.AttributeProto.AttributeType.INT:
                return i.i;
              case h.onnx.AttributeProto.AttributeType.STRING:
                return i.s;
              case h.onnx.AttributeProto.AttributeType.TENSOR:
                return i.t;
              case h.onnx.AttributeProto.AttributeType.GRAPH:
                return i.g;
              case h.onnx.AttributeProto.AttributeType.FLOATS:
                return i.floats;
              case h.onnx.AttributeProto.AttributeType.INTS:
                return i.ints;
              case h.onnx.AttributeProto.AttributeType.STRINGS:
                return i.strings;
              case h.onnx.AttributeProto.AttributeType.TENSORS:
                return i.tensors;
              case h.onnx.AttributeProto.AttributeType.GRAPHS:
                return i.graphs;
              default:
                throw new Error(`unsupported attribute type: ${h.onnx.AttributeProto.AttributeType[i.type]}`);
            }
          }
          static getValueNoCheckFromOrtFormat(i) {
            switch (i.type()) {
              case c.AttributeType.FLOAT:
                return i.f();
              case c.AttributeType.INT:
                return i.i();
              case c.AttributeType.STRING:
                return i.s();
              case c.AttributeType.TENSOR:
                return i.t();
              case c.AttributeType.GRAPH:
                return i.g();
              case c.AttributeType.FLOATS:
                return i.floatsArray();
              case c.AttributeType.INTS: {
                const t = [];
                for (let e = 0; e < i.intsLength(); e++) t.push(i.ints(e));
                return t;
              }
              case c.AttributeType.STRINGS: {
                const t = [];
                for (let e = 0; e < i.stringsLength(); e++) t.push(i.strings(e));
                return t;
              }
              case c.AttributeType.TENSORS: {
                const t = [];
                for (let e = 0; e < i.tensorsLength(); e++) t.push(i.tensors(e));
                return t;
              }
              default:
                throw new Error(`unsupported attribute type: ${c.AttributeType[i.type()]}`);
            }
          }
        }
        u.Attribute = f;
      }, 7091: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.resolveBackend = u.backend = void 0;
        const h = b(5038), p = /* @__PURE__ */ new Map();
        async function g(o) {
          const c = u.backend;
          if (c[o] !== void 0 && function(f) {
            const a = f;
            return "initialize" in a && typeof a.initialize == "function" && "createSessionHandler" in a && typeof a.createSessionHandler == "function" && "dispose" in a && typeof a.dispose == "function";
          }(c[o])) {
            const f = c[o];
            let a = f.initialize();
            if (typeof a == "object" && "then" in a && (a = await a), a) return p.set(o, f), f;
          }
        }
        u.backend = { webgl: new h.WebGLBackend() }, u.resolveBackend = async function o(c) {
          if (!c) return o(["webgl"]);
          {
            const f = typeof c == "string" ? [c] : c;
            for (const a of f) {
              const i = p.get(a);
              if (i) return i;
              const t = await g(a);
              if (t) return t;
            }
          }
          throw new Error("no available backend to use");
        };
      }, 5038: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.WebGLBackend = void 0;
        const h = b(1670), p = b(6231), g = b(6416), o = b(7305);
        u.WebGLBackend = class {
          get contextId() {
            return h.env.webgl.contextId;
          }
          set contextId(c) {
            h.env.webgl.contextId = c;
          }
          get matmulMaxBatchSize() {
            return h.env.webgl.matmulMaxBatchSize;
          }
          set matmulMaxBatchSize(c) {
            h.env.webgl.matmulMaxBatchSize = c;
          }
          get textureCacheMode() {
            return h.env.webgl.textureCacheMode;
          }
          set textureCacheMode(c) {
            h.env.webgl.textureCacheMode = c;
          }
          get pack() {
            return h.env.webgl.pack;
          }
          set pack(c) {
            h.env.webgl.pack = c;
          }
          get async() {
            return h.env.webgl.async;
          }
          set async(c) {
            h.env.webgl.async = c;
          }
          initialize() {
            try {
              return this.glContext = (0, o.createWebGLContext)(this.contextId), typeof this.matmulMaxBatchSize != "number" && (this.matmulMaxBatchSize = 16), typeof this.textureCacheMode != "string" && (this.textureCacheMode = "full"), typeof this.pack != "boolean" && (this.pack = !1), typeof this.async != "boolean" && (this.async = !1), p.Logger.setWithEnv(h.env), p.Logger.verbose("WebGLBackend", `Created WebGLContext: ${typeof this.glContext} with matmulMaxBatchSize: ${this.matmulMaxBatchSize}; textureCacheMode: ${this.textureCacheMode}; pack: ${this.pack}; async: ${this.async}.`), !0;
            } catch (c) {
              return p.Logger.warning("WebGLBackend", `Unable to initialize WebGLBackend. ${c}`), !1;
            }
          }
          createSessionHandler(c) {
            return new g.WebGLSessionHandler(this, c);
          }
          dispose() {
            this.glContext.dispose();
          }
        };
      }, 5107: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.CoordsGlslLib = void 0;
        const h = b(2517), p = b(8520), g = b(5060), o = b(7859), c = b(9390);
        class f extends p.GlslLib {
          constructor(i) {
            super(i);
          }
          getFunctions() {
            return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.offsetToCoords()), this.coordsToOffset()), this.toVec()), this.valueFrom()), this.getCommonUtilFuncs()), this.getInputsSamplingSnippets()), this.getOutputSamplingSnippet());
          }
          getCustomTypes() {
            return {};
          }
          offsetToCoords() {
            return { offsetToCoords: new p.GlslLibRoutine(`
      vec2 offsetToCoords(int offset, int width, int height) {
        int t = offset / width;
        int s = offset - t*width;
        vec2 coords = (vec2(s,t) + vec2(0.5,0.5)) / vec2(width, height);
        return coords;
      }
      `) };
          }
          coordsToOffset() {
            return { coordsToOffset: new p.GlslLibRoutine(`
      int coordsToOffset(vec2 coords, int width, int height) {
        float s = coords.s * float(width);
        float t = coords.t * float(height);
        int offset = int(t) * width + int(s);
        return offset;
      }
      `) };
          }
          getOutputSamplingSnippet() {
            const i = this.context.outputTextureLayout;
            return i.isPacked ? this.getPackedOutputSamplingSnippet(i) : this.getUnpackedOutputSamplingSnippet(i);
          }
          getPackedOutputSamplingSnippet(i) {
            const t = i.unpackedShape, e = [i.width, i.height], n = {}, r = "getOutputCoords";
            switch (t.length) {
              case 0:
                n[r] = this.getOutputScalarCoords();
                break;
              case 1:
                n[r] = this.getOutputPacked1DCoords(t, e);
                break;
              case 2:
                n[r] = this.getOutputPacked2DCoords(t, e);
                break;
              case 3:
                n[r] = this.getOutputPacked3DCoords(t, e);
                break;
              default:
                n[r] = this.getOutputPackedNDCoords(t, e);
            }
            const s = `
      void setOutput(vec4 val) {
        ${(0, g.getGlsl)(this.context.glContext.version).output} = val;
      }
    `;
            return n.floatTextureSetRGBA = new p.GlslLibRoutine(s), n;
          }
          getUnpackedOutputSamplingSnippet(i) {
            const t = i.unpackedShape, e = [i.width, i.height], n = {}, r = "getOutputCoords";
            switch (t.length) {
              case 0:
                n[r] = this.getOutputScalarCoords();
                break;
              case 1:
                n[r] = this.getOutputUnpacked1DCoords(t, e);
                break;
              case 2:
                n[r] = this.getOutputUnpacked2DCoords(t, e);
                break;
              case 3:
                n[r] = this.getOutputUnpacked3DCoords(t, e);
                break;
              case 4:
                n[r] = this.getOutputUnpacked4DCoords(t, e);
                break;
              case 5:
                n[r] = this.getOutputUnpacked5DCoords(t, e);
                break;
              case 6:
                n[r] = this.getOutputUnpacked6DCoords(t, e);
                break;
              default:
                throw new Error(`Unsupported output dimensionality: ${t.length}`);
            }
            const s = `
        void setOutput(float val) {
          ${(0, g.getGlsl)(this.context.glContext.version).output} = vec4(val, 0, 0, 0);
        }
    `;
            return n.floatTextureSetR = new p.GlslLibRoutine(s), n;
          }
          getOutputScalarCoords() {
            return new p.GlslLibRoutine(`
      int getOutputCoords() {
        return 0;
      }
    `);
          }
          getOutputPacked1DCoords(i, t) {
            const e = t;
            let n = "";
            return e[0] === 1 ? (n = `
          int getOutputCoords() {
            return 2 * int(TexCoords.y * ${e[1]}.0);
          }
        `, new p.GlslLibRoutine(n)) : e[1] === 1 ? (n = `
          int getOutputCoords() {
            return 2 * int(TexCoords.x * ${e[0]}.0);
          }
        `, new p.GlslLibRoutine(n)) : (n = `
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                 vec2(${e[0]}, ${e[1]}));
          return 2 * (resTexRC.y * ${e[0]} + resTexRC.x);
        }
      `, new p.GlslLibRoutine(n));
          }
          getOutputPacked2DCoords(i, t) {
            let e = "";
            if (h.ArrayUtil.arraysEqual(i, t)) return e = `
        ivec2 getOutputCoords() {
          return 2 * ivec2(TexCoords.xy * vec2(${t[0]}, ${t[1]}));
        }
      `, new p.GlslLibRoutine(e);
            const n = t, r = Math.ceil(i[1] / 2);
            return e = `
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));

          int index = resTexRC.y * ${n[0]} + resTexRC.x;

          // reverse r and c order for packed texture
          int r = imod(index, ${r}) * 2;
          int c = 2 * (index / ${r});

          return ivec2(r, c);
        }
      `, new p.GlslLibRoutine(e);
          }
          getOutputPacked3DCoords(i, t) {
            const e = [t[0], t[1]], n = Math.ceil(i[2] / 2), r = n * Math.ceil(i[1] / 2), s = `
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${e[0]}, ${e[1]}));
          int index = resTexRC.y * ${e[0]} + resTexRC.x;

          int b = index / ${r};
          index -= b * ${r};

          // reverse r and c order for packed texture
          int r = imod(index, ${n}) * 2;
          int c = 2 * (index / ${n});

          return ivec3(b, r, c);
        }
      `;
            return new p.GlslLibRoutine(s);
          }
          getOutputPackedNDCoords(i, t) {
            const e = [t[0], t[1]], n = Math.ceil(i[i.length - 1] / 2), r = n * Math.ceil(i[i.length - 2] / 2);
            let s = r, l = "", d = "b, r, c";
            for (let y = 2; y < i.length - 1; y++) s *= i[i.length - y - 1], l = `
      int b${y} = index / ${s};
      index -= b${y} * ${s};
    ` + l, d = `b${y}, ` + d;
            const m = `
      ivec${i.length} getOutputCoords() {
        ivec2 resTexRC = ivec2(TexCoords.xy *
                              vec2(${e[0]}, ${e[1]}));
        int index = resTexRC.y * ${e[0]} + resTexRC.x;

        ${l}

        int b = index / ${r};
        index -= b * ${r};

        // reverse r and c order for packed texture
        int r = imod(index, ${n}) * 2;
        int c = 2 * (index / ${n});

        return ivec${i.length}(${d});
      }
    `;
            return new p.GlslLibRoutine(m);
          }
          getOutputUnpacked1DCoords(i, t) {
            const e = `
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          return resTexRC.y * ${t[0]} + resTexRC.x;
        }
      `;
            return new p.GlslLibRoutine(e);
          }
          getOutputUnpacked2DCoords(i, t) {
            const e = `
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          int r = index / ${i[1]};
          int c = index - r * ${i[1]};
          return ivec2(r, c);
        }
      `;
            return new p.GlslLibRoutine(e);
          }
          getOutputUnpacked3DCoords(i, t) {
            let e = "";
            const n = i.length;
            let r = null;
            n < 2 && (r = []), r = new Array(n - 1), r[n - 2] = i[n - 1];
            for (let d = n - 3; d >= 0; --d) r[d] = r[d + 1] * i[d + 1];
            const s = ["r", "c", "d"], l = r.map((d, m) => `int ${s[m]} = index / ${d}; ${m === r.length - 1 ? `int ${s[m + 1]} = index - ${s[m]} * ${d}` : `index -= ${s[m]} * ${d}`};`).join("");
            return e = `
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${l}
          return ivec3(r, c, d);
        }
      `, new p.GlslLibRoutine(e);
          }
          getOutputUnpacked4DCoords(i, t) {
            let e = "";
            const n = i.length;
            let r = null;
            n < 2 && (r = []), r = new Array(n - 1), r[n - 2] = i[n - 1];
            for (let d = n - 3; d >= 0; --d) r[d] = r[d + 1] * i[d + 1];
            const s = ["r", "c", "d", "d2"], l = r.map((d, m) => `int ${s[m]} = index / ${d}; ${m === r.length - 1 ? `int ${s[m + 1]} = index - ${s[m]} * ${d}` : `index -= ${s[m]} * ${d}`};`).join("");
            return e = `
      ivec4 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${l}
          return ivec4(r, c, d, d2);
        }
      `, new p.GlslLibRoutine(e);
          }
          getOutputUnpacked5DCoords(i, t) {
            let e = "";
            const n = i.length;
            let r = null;
            n < 2 && (r = []), r = new Array(n - 1), r[n - 2] = i[n - 1];
            for (let d = n - 3; d >= 0; --d) r[d] = r[d + 1] * i[d + 1];
            const s = ["r", "c", "d", "d2", "d3"], l = r.map((d, m) => `int ${s[m]} = index / ${d}; ${m === r.length - 1 ? `int ${s[m + 1]} = index - ${s[m]} * ${d}` : `index -= ${s[m]} * ${d}`};`).join("");
            return e = `
      ivec5 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${l}
          return ivec5(r, c, d, d2, d3);
        }
      `, new p.GlslLibRoutine(e);
          }
          getOutputUnpacked6DCoords(i, t) {
            let e = "";
            const n = i.length;
            let r = null;
            n < 2 && (r = []), r = new Array(n - 1), r[n - 2] = i[n - 1];
            for (let d = n - 3; d >= 0; --d) r[d] = r[d + 1] * i[d + 1];
            const s = ["r", "c", "d", "d2", "d3", "d4"], l = r.map((d, m) => `int ${s[m]} = index / ${d}; ${m === r.length - 1 ? `int ${s[m + 1]} = index - ${s[m]} * ${d}` : `index -= ${s[m]} * ${d}`};`).join("");
            return e = `
     ivec6 getOutputCoords() {
         ivec2 resTexRC = ivec2(TexCoords.xy *
                               vec2(${t[0]}, ${t[1]}));
         int index = resTexRC.y * ${t[0]} + resTexRC.x;
         ${l}
         return ivec6(r, c, d, d2, d3, d4);
       }
     `, new p.GlslLibRoutine(e);
          }
          getCommonUtilFuncs() {
            const i = {};
            let t = "uvFromFlat";
            i[t] = new p.GlslLibRoutine(`
    vec2 uvFromFlat(int texNumR, int texNumC, int index) {
      int texC = index / texNumR;
      int texR = index - texC * texNumR;
      // TODO: swap texR, texC order in following function so row is corresponding to u and column is corresponding to
      //       v.
      return (vec2(texR, texC) + halfCR) / vec2(texNumR, texNumC);
    }
    `), t = "packedUVfrom1D", i[t] = new p.GlslLibRoutine(`
      vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
        int texelIndex = index / 2;
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `), t = "packedUVfrom2D", i[t] = new p.GlslLibRoutine(`
      vec2 packedUVfrom2D(int texNumR, int texNumC, int texelsInLogicalRow, int row, int col) {
        int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `), t = "packedUVfrom3D", i[t] = new p.GlslLibRoutine(`
      vec2 packedUVfrom3D(int texNumR, int texNumC,
          int texelsInBatch, int texelsInLogicalRow, int b,
          int row, int col) {
        int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = index / texNumC;
        int texC = index - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `), t = "sampleTexture";
            const e = (0, g.getGlsl)(this.context.glContext.version);
            return i[t] = new p.GlslLibRoutine(`
        float sampleTexture(sampler2D textureSampler, vec2 uv) {
            return ${e.texture2D}(textureSampler, uv).r;
        }`), i;
          }
          getInputsSamplingSnippets() {
            const i = {}, t = this.context.outputTextureLayout;
            return this.context.programInfo.inputNames.forEach((e, n) => {
              const r = this.context.inputTextureLayouts[n], s = (0, c.generateShaderFuncNameFromInputSamplerName)(e);
              r.isPacked ? i[s] = this.getPackedSamplerFromInput(s, e, r) : i[s] = this.getUnpackedSamplerFromInput(s, e, r);
              const l = (0, c.generateShaderFuncNameFromInputSamplerNameAtOutCoords)(e);
              r.unpackedShape.length <= t.unpackedShape.length && (r.isPacked ? i[l] = this.getPackedSamplerAtOutputCoords(l, r, t, e) : i[l] = this.getUnpackedSamplerAtOutputCoords(l, r, t, e));
            }), i;
          }
          getPackedSamplerAtOutputCoords(i, t, e, n) {
            const r = t.unpackedShape, s = e.unpackedShape, l = n, d = (0, c.generateShaderFuncNameFromInputSamplerName)(l), m = r.length, y = s.length, w = h.BroadcastUtil.getBroadcastDims(r, s), _ = (0, c.getCoordsDataType)(y), S = y - m;
            let A;
            const P = (0, c.getGlChannels)();
            A = m === 0 ? "" : y < 2 && w.length >= 1 ? "coords = 0;" : w.map((O) => `coords.${P[O + S]} = 0;`).join(`
`);
            let v = "";
            v = y < 2 && m > 0 ? "coords" : r.map((O, N) => `coords.${P[N + S]}`).join(", ");
            let R = "return outputValue;";
            const B = h.ShapeUtil.size(r) === 1, q = h.ShapeUtil.size(s) === 1;
            if (m !== 1 || B || q) {
              if (B && !q) R = y === 1 ? `
          return vec4(outputValue.x, outputValue.x, 0., 0.);
        ` : `
          return vec4(outputValue.x);
        `;
              else if (w.length) {
                const O = m - 2, N = m - 1;
                w.indexOf(O) > -1 && w.indexOf(N) > -1 ? R = "return vec4(outputValue.x);" : w.indexOf(O) > -1 ? R = "return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);" : w.indexOf(N) > -1 && (R = "return vec4(outputValue.xx, outputValue.zz);");
              }
            } else R = `
        return vec4(outputValue.xy, outputValue.xy);
      `;
            const D = `
      vec4 ${i}() {
        ${_} coords = getOutputCoords();
        
        int lastDim = coords.${P[y - 1]};
        coords.${P[y - 1]} = coords.${P[y - 2]};
        coords.${P[y - 2]} = lastDim;
      
        ${A}
        vec4 outputValue = ${d}(${v});
        ${R}
      }
    `;
            return new p.GlslLibRoutine(D, ["coordinates.getOutputCoords"]);
          }
          getUnpackedSamplerAtOutputCoords(i, t, e, n) {
            const r = [e.width, e.height], s = [t.width, t.height], l = t.unpackedShape.length, d = e.unpackedShape.length, m = t.unpackedShape, y = e.unpackedShape, w = (0, c.generateShaderFuncNameFromInputSamplerName)(n);
            if (l === d && h.ArrayUtil.arraysEqual(s, r)) {
              const q = `
          float ${i}() {
            return sampleTexture(${n}, TexCoords);
          }
        `;
              return new p.GlslLibRoutine(q, ["coordinates.sampleTexture"]);
            }
            const _ = (0, c.getCoordsDataType)(d), S = h.BroadcastUtil.getBroadcastDims(m, y), A = d - l;
            let P;
            const v = (0, c.getGlChannels)();
            P = l === 0 ? "" : d < 2 && S.length >= 1 ? "coords = 0;" : S.map((q) => `coords.${v[q + A]} = 0;`).join(`
`);
            let R = "";
            R = d < 2 && l > 0 ? "coords" : t.unpackedShape.map((q, D) => `coords.${v[D + A]}`).join(", ");
            const B = `
        float ${i}() {
          ${_} coords = getOutputCoords();
          ${P}
          return ${w}(${R});
        }
      `;
            return new p.GlslLibRoutine(B, ["coordinates.getOutputCoords"]);
          }
          getPackedSamplerFromInput(i, t, e) {
            switch (e.unpackedShape.length) {
              case 0:
                return this.getPackedSamplerScalar(i, t);
              case 1:
                return this.getPackedSampler1D(i, t, e);
              case 2:
                return this.getPackedSampler2D(i, t, e);
              case 3:
                return this.getPackedSampler3D(i, t, e);
              default:
                return this.getPackedSamplerND(i, t, e);
            }
          }
          getUnpackedSamplerFromInput(i, t, e) {
            const n = e.unpackedShape;
            switch (n.length) {
              case 0:
                return this.getUnpackedSamplerScalar(i, t, e);
              case 1:
                return this.getUnpackedSampler1D(i, t, e);
              case 2:
                return this.getUnpackedSampler2D(i, t, e);
              case 3:
                return this.getUnpackedSampler3D(i, t, e);
              case 4:
                return this.getUnpackedSampler4D(i, t, e);
              case 5:
                return this.getUnpackedSampler5D(i, t, e);
              case 6:
                return this.getUnpackedSampler6D(i, t, e);
              default:
                throw new Error(`Unsupported dimension ${n.length}-D`);
            }
          }
          getPackedSamplerScalar(i, t) {
            const e = `
          vec4 ${i}() {
            return ${(0, g.getGlsl)(this.context.glContext.version).texture2D}(${t}, halfCR);
          }
        `;
            return new p.GlslLibRoutine(e);
          }
          getPackedSampler1D(i, t, e) {
            const n = [e.width, e.height], r = [n[1], n[0]], s = (0, g.getGlsl)(this.context.glContext.version), l = `vec4 ${i}(int index) {
      vec2 uv = packedUVfrom1D(
      ${r[0]}, ${r[1]}, index);
      return ${s.texture2D}(${t}, uv);
    }`;
            return new p.GlslLibRoutine(l, ["coordinates.packedUVfrom1D"]);
          }
          getPackedSampler2D(i, t, e) {
            const n = e.unpackedShape, r = [e.width, e.height], s = (0, g.getGlsl)(this.context.glContext.version), l = r[0], d = r[1];
            if (r != null && h.ArrayUtil.arraysEqual(n, r)) {
              const _ = `vec4 ${i}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${d}.0, ${l}.0);
        return ${s.texture2D}(${t}, uv);
      }`;
              return new p.GlslLibRoutine(_);
            }
            const m = r, y = Math.ceil(n[1] / 2), w = `vec4 ${i}(int row, int col) {
      vec2 uv = packedUVfrom2D(${m[1]}, ${m[0]}, ${y}, row, col);
      return ${s.texture2D}(${t}, uv);
    }`;
            return new p.GlslLibRoutine(w, ["coordinates.packedUVfrom2D"]);
          }
          getPackedSampler3D(i, t, e) {
            const n = e.unpackedShape, r = [e.width, e.height], s = [r[0], r[1]], l = (0, g.getGlsl)(this.context.glContext.version);
            if (n[0] === 1) {
              const _ = n.slice(1), S = [1, 2], A = (0, c.squeezeInputShape)(n, _), P = ["b", "row", "col"], v = JSON.parse(JSON.stringify(e));
              v.unpackedShape = A;
              const R = this.getPackedSamplerFromInput(i, t, v), B = `${R.routineBody}
      vec4 ${i}(int b, int row, int col) {
        return ${i}(${(0, c.getSqueezedParams)(P, S)});
      } `;
              return new p.GlslLibRoutine(B, R.dependencies);
            }
            const d = s[0], m = s[1], y = Math.ceil(n[2] / 2), w = `vec4 ${i}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${m}, ${d}, ${y * Math.ceil(n[1] / 2)}, ${y}, b, row, col);
      return ${l.texture2D}(${t}, uv);}`;
            return new p.GlslLibRoutine(w, ["coordinates.packedUVfrom3D"]);
          }
          getPackedSamplerND(i, t, e) {
            const n = e.unpackedShape, r = n.length, s = [e.width, e.height], l = (0, g.getGlsl)(this.context.glContext.version), d = [s[0], s[1]], m = d[1], y = d[0], w = Math.ceil(n[r - 1] / 2);
            let _ = w * Math.ceil(n[r - 2] / 2), S = "int b, int row, int col", A = `b * ${_} + (row / 2) * ${w} + (col / 2)`;
            for (let v = 2; v < r - 1; v++) S = `int b${v}, ` + S, _ *= n[r - v - 1], A = `b${v} * ${_} + ` + A;
            const P = `vec4 ${i}(${S}) {
      int index = ${A};
      int texR = index / ${y};
      int texC = index - texR * ${y};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${y}, ${m});
      return ${l.texture2D}(${t}, uv);
    }`;
            return new p.GlslLibRoutine(P);
          }
          getUnpackedSamplerScalar(i, t, e) {
            const [n, r] = [e.width, e.height];
            if (n === 1 && r === 1) {
              const l = `
          float ${i}() {
            return sampleTexture(${t}, halfCR);
          }
        `;
              return new p.GlslLibRoutine(l, ["coordinates.sampleTexture"]);
            }
            const s = `
        float ${i}() {
          int offset_${t} = coordsToOffset(TexCoords, ${n}, ${r});
          vec2 uv = uvFromFlat(${n}, ${r}, offset_${t});
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(s, ["coordinates.uvFromFlat", "coordinates.sampleTexture", "coordinates.coordsToOffset"]);
          }
          getUnpackedSampler1D(i, t, e) {
            const n = e.width, r = e.height;
            if (r === 1 && n === 1) {
              const l = `
        float ${i}(int index) {
          return sampleTexture(${t}, halfCR);
        }
      `;
              return new p.GlslLibRoutine(l, ["coordinates.sampleTexture"]);
            }
            if (r === 1) {
              const l = `
          float ${i}(int index) {
            vec2 uv = vec2((float(index) + 0.5) / ${n}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;
              return new p.GlslLibRoutine(l, ["coordinates.sampleTexture"]);
            }
            if (n === 1) {
              const l = `
          float ${i}(int index) {
            vec2 uv = vec2(0.5, (float(index) + 0.5) / ${r}.0);
            return sampleTexture(${t}, uv);
          }
        `;
              return new p.GlslLibRoutine(l, ["coordinates.sampleTexture"]);
            }
            const s = `
        float ${i}(int index) {
          vec2 uv = uvFromFlat(${n}, ${r}, index);
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(s, ["coordinates.uvFromFlat", "coordinates.sampleTexture"]);
          }
          getUnpackedSampler2D(i, t, e) {
            const n = e.unpackedShape, r = [e.height, e.width];
            if (r != null && h.ArrayUtil.arraysEqual(n, r)) {
              const _ = `
          float ${i}(int row, int col) {
            vec2 uv = (vec2(row, col) + halfCR) / vec2(${r[1]}.0, ${r[0]}.0);
            return sampleTexture(${t}, uv);
          }
        `;
              return new p.GlslLibRoutine(_, ["coordinates.sampleTexture"]);
            }
            const { newShape: s, keptDims: l } = (0, o.squeezeShape)(n), d = s;
            if (d.length < n.length) {
              const _ = (0, c.squeezeInputShape)(n, d), S = JSON.parse(JSON.stringify(e));
              S.unpackedShape = _;
              const A = ["col", "row"], P = `
          ${this.getUnpackedSamplerFromInput(i, t, S).routineBody}
          float ${i}(int row, int col) {
            return ${i}(${(0, c.getSqueezedParams)(A, l)});
          }
        `;
              return new p.GlslLibRoutine(P, ["coordinates.sampleTexture"]);
            }
            const m = r[1], y = r[0];
            if (y === 1) {
              const _ = `
          float ${i}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${m}, ${y});
            float index = dot(vec3(row, col, offset_${t}), vec3(${n[1]}, 1, 1));
            vec2 uv = vec2(0.5, (index + 0.5) / ${m}.0);
            return sampleTexture(${t}, uv);
          }
        `;
              return new p.GlslLibRoutine(_, ["coordinates.sampleTexture", "coordinates.coordsToOffset"]);
            }
            if (m === 1) {
              const _ = `
          float ${i}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${m}, ${y});
            float index = dot(vec3(row, col, offset_${t}), vec3(${n[1]}, 1, 1));
            vec2 uv = vec2((index + 0.5) / ${y}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;
              return new p.GlslLibRoutine(_, ["coordinates.sampleTexture", "coordinates.coordsToOffset"]);
            }
            const w = `
        float ${i}(int row, int col) {
          int index = col * ${n[1]} + row;
          vec2 uv = uvFromFlat(${m}, ${y}, index);
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(w, ["coordinates.uvFromFlat", "coordinates.sampleTexture", "coordinates.coordsToOffset"]);
          }
          getUnpackedSampler3D(i, t, e) {
            const n = e.unpackedShape, r = n[1] * n[2], s = n[2], { newShape: l, keptDims: d } = (0, o.squeezeShape)(n), m = l;
            if (m.length < n.length) {
              const w = (0, c.squeezeInputShape)(n, m), _ = ["batch", "col", "row"], S = JSON.parse(JSON.stringify(e));
              S.unpackedShape = w;
              const A = this.getUnpackedSamplerFromInput(i, t, S), P = d.reverse(), v = `
          ${A.routineBody}
          float ${i}(int batch, int row, int col) {
            return ${i}(${(0, c.getSqueezedParams)(_, P)});
          }
        `;
              return new p.GlslLibRoutine(v, A.dependencies);
            }
            const y = `
          float ${i}(int depth, int row, int col) {
            // Explicitly use integer operations as dot() only works on floats.
            int index = depth * ${r} + col * ${s} + row;
            vec2 uv = uvFromFlat(${e.width}, ${e.height}, index);
            return sampleTexture(${t}, uv);
          }
      `;
            return new p.GlslLibRoutine(y, ["coordinates.uvFromFlat", "coordinates.sampleTexture", "coordinates.coordsToOffset"]);
          }
          getUnpackedSampler4D(i, t, e) {
            const n = e.unpackedShape, r = n[3], s = n[2] * r, l = `
        float ${i}(int row, int col, int depth, int depth2) {
          int index = row * ${n[1] * s} + col * ${s} +
              depth2 * ${r} + depth;
          vec2 uv = uvFromFlat(${e.width}, ${e.height}, index);
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(l, ["coordinates.uvFromFlat", "coordinates.sampleTexture"]);
          }
          getUnpackedSampler5D(i, t, e) {
            const n = e.unpackedShape, r = n[4], s = n[3] * r, l = n[2] * s, d = n[1] * l, { newShape: m, keptDims: y } = (0, o.squeezeShape)(n);
            if (m.length < n.length) {
              const _ = (0, c.squeezeInputShape)(n, m), S = ["row", "col", "depth", "depth2", "depth3"], A = JSON.parse(JSON.stringify(e));
              A.unpackedShape = _;
              const P = `
          ${this.getUnpackedSamplerFromInput(i, t, A).routineBody}
          float ${i}(int row, int col, int depth, int depth2, int depth3) {
            return ${i}(${(0, c.getSqueezedParams)(S, y)});
          }
        `;
              return new p.GlslLibRoutine(P, ["coordinates.sampleTexture", "coordinates.uvFromFlat"]);
            }
            const w = `
        float ${i}(int row, int col, int depth, int depth2, int depth3) {
          int index = row * ${d} + col * ${l} + depth * ${s} +
          depth3 * ${r} + depth2;
          vec2 uv = uvFromFlat(${e.width}, ${e.height}, index);
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(w, ["coordinates.sampleTexture", "coordinates.uvFromFlat"]);
          }
          getUnpackedSampler6D(i, t, e) {
            const n = e.unpackedShape, r = n[5], s = n[4] * r, l = n[3] * s, d = n[2] * l, m = n[1] * d, { newShape: y, keptDims: w } = (0, o.squeezeShape)(n);
            if (y.length < n.length) {
              const S = (0, c.squeezeInputShape)(n, y), A = ["row", "col", "depth", "depth2", "depth3", "depth4"], P = JSON.parse(JSON.stringify(e));
              P.unpackedShape = S;
              const v = `
            ${this.getUnpackedSamplerFromInput(i, t, P).routineBody}
            float ${i}(int row, int col, int depth,
              int depth2, int depth3, int depth4) {
              return ${i}(${(0, c.getSqueezedParams)(A, w)});
            }
          `;
              return new p.GlslLibRoutine(v, ["coordinates.sampleTexture", "coordinates.uvFromFlat"]);
            }
            const _ = `
          float ${i}(int row, int col, int depth,
            int depth2, int depth3, int depth4) {
            int index = row * ${m} + col * ${d} + depth * ${l} +
            depth2 * ${s} + depth3 * ${r} + depth4;
            vec2 uv = uvFromFlat(${e.width}, ${e.height}, index);
            return sampleTexture(${t}, uv);
          }
        `;
            return new p.GlslLibRoutine(_, ["coordinates.uvFromFlat", "coordinates.sampleTexture", "coordinates.coordsToOffset"]);
          }
          toVec() {
            const i = this.context.outputTextureLayout, t = i.shape.length, e = i.strides, n = i.width, r = i.height, s = [];
            for (let d = 0; d < t - 1; ++d) s.push(`
        c[${d}] = offset / ${e[d]};`), s.push(`
        offset -= c[${d}] * ${e[d]};`);
            s.push(`
        c[${t - 1}] = offset;`);
            const l = `
      void toVec(vec2 texCoords, out int c[${t}]) {
        int offset = coordsToOffset(texCoords, ${n}, ${r});
        ${s.join("")}
      }
      void toVec(int offset, out int c[${t}]) {
        ${s.join("")}
      }
    `;
            return { toVec: new p.GlslLibRoutine(l, ["coordinates.coordsToOffset"]) };
          }
          valueFrom() {
            const i = {};
            return this.context.programInfo.inputNames.forEach((t, e) => {
              const n = this.context.inputTextureLayouts[e], r = (n.unpackedShape.length > 0 ? n.unpackedShape : n.shape).length;
              let s = `_${t}`;
              i[s] = new p.GlslLibRoutine(this.getValueFromSingle(t, r, n.width, n.height, !1), [`shapeUtils.indicesToOffset${s}`, "coordinates.offsetToCoords", "fragcolor.getColorAsFloat"]), s += "_T", i[s] = new p.GlslLibRoutine(this.getValueFromSingle(t, r, n.width, n.height, !0), [`shapeUtils.indicesToOffset${s}`, "coordinates.offsetToCoords", "fragcolor.getColorAsFloat"]);
            }), i;
          }
          getValueFromSingle(i, t, e, n, r) {
            let s = `_${i}`;
            return r && (s += "_T"), `
        float ${s}(int m[${t}]) {
          int offset = indicesToOffset${s}(m);
          vec2 coords = offsetToCoords(offset, ${e}, ${n});
          float value = getColorAsFloat(${(0, g.getGlsl)(this.context.glContext.version).texture2D}(${i}, coords));
          return value;
        }
        `;
          }
          getPackedValueFrom(i, t, e, n, r) {
            let s = `_${i}_Pack`;
            return r && (s += "_T"), `
        vec4 ${s}(int m[${t}]) {
          int offset = indicesToOffset_${i}(m);
          vec2 coords = offsetToCoords(offset, ${e}, ${n});
          return ${(0, g.getGlsl)(this.context.glContext.version).texture2D}(${i}, coords);
        }
        `;
          }
        }
        u.CoordsGlslLib = f;
      }, 8520: (C, u) => {
        var b;
        Object.defineProperty(u, "__esModule", { value: !0 }), u.TopologicalSortGlslRoutines = u.GlslLibRoutineNode = u.GlslLibRoutine = u.GlslLib = u.GlslContext = u.FunctionType = void 0, (b = u.FunctionType || (u.FunctionType = {}))[b.ValueBased = 0] = "ValueBased", b[b.Positional = 1] = "Positional", u.GlslContext = class {
          constructor(h, p, g, o) {
            this.glContext = h, this.programInfo = p, this.inputTextureLayouts = g, this.outputTextureLayout = o;
          }
        }, u.GlslLib = class {
          constructor(h) {
            this.context = h;
          }
        }, u.GlslLibRoutine = class {
          constructor(h, p) {
            this.routineBody = h, this.dependencies = p;
          }
        }, u.GlslLibRoutineNode = class {
          constructor(h, p, g) {
            this.name = h, this.dependencies = g || [], p && (this.routineBody = p);
          }
          addDependency(h) {
            h && this.dependencies.push(h);
          }
        }, u.TopologicalSortGlslRoutines = class {
          static returnOrderedNodes(h) {
            if (!h || h.length === 0) return [];
            if (h.length === 1) return h;
            const p = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), o = new Array();
            return this.createOrderedNodes(h, p, g, o), o;
          }
          static createOrderedNodes(h, p, g, o) {
            for (let c = 0; c < h.length; ++c) this.dfsTraverse(h[c], p, g, o);
          }
          static dfsTraverse(h, p, g, o) {
            if (!h || g.has(h.name)) return;
            if (p.has(h.name)) throw new Error("Cyclic dependency detected. Can't topologically sort routines needed for shader.");
            p.add(h.name);
            const c = h.dependencies;
            if (c && c.length > 0) for (let f = 0; f < c.length; ++f) this.dfsTraverse(c[f], p, g, o);
            o.push(h), g.add(h.name), p.delete(h.name);
          }
        };
      }, 7341: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.EncodingGlslLib = void 0;
        const h = b(8520);
        class p extends h.GlslLib {
          constructor(o) {
            super(o);
          }
          getFunctions() {
            return Object.assign(Object.assign({}, this.encodeFloat32()), this.decodeFloat32());
          }
          getCustomTypes() {
            return {};
          }
          encodeFloat32() {
            return { encode: new h.GlslLibRoutine(`highp vec4 encode(highp float f) {
        return vec4(f, 0.0, 0.0, 0.0);
      }
        `) };
          }
          decodeFloat32() {
            return { decode: new h.GlslLibRoutine(`highp float decode(highp vec4 rgba) {
        return rgba.r;
      }
        `) };
          }
          encodeUint8() {
            const o = p.isLittleEndian() ? "rgba.rgba=rgba.abgr;" : "";
            return { encode: new h.GlslLibRoutine(`
      highp vec4 encode(highp float f) {
        highp float F = abs(f);
        highp float Sign = step(0.0,-f);
        highp float Exponent = floor(log2(F));
        highp float Mantissa = (exp2(- Exponent) * F);
        Exponent = floor(log2(F) + 127.0) + floor(log2(Mantissa));
        highp vec4 rgba;
        rgba[0] = 128.0 * Sign  + floor(Exponent*exp2(-1.0));
        rgba[1] = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);
        rgba[2] = floor(mod(floor(Mantissa*exp2(23.0 -8.0)),exp2(8.0)));
        rgba[3] = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));
        ${o}
        rgba = rgba / 255.0; // values need to be normalized to [0,1]
        return rgba;
    }
        `) };
          }
          decodeUint8() {
            const o = p.isLittleEndian() ? "rgba.rgba=rgba.abgr;" : "";
            return { decode: new h.GlslLibRoutine(`
        highp float decode(highp vec4 rgba) {
          rgba = rgba * 255.0; // values need to be de-normalized from [0,1] to [0,255]
          ${o}
          highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;
          highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;
          highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);
          highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));
          return Result;
      }
        `) };
          }
          static isLittleEndian() {
            const o = new ArrayBuffer(4), c = new Uint32Array(o), f = new Uint8Array(o);
            if (c[0] = 3735928559, f[0] === 239) return !0;
            if (f[0] === 222) return !1;
            throw new Error("unknown endianness");
          }
        }
        u.EncodingGlslLib = p;
      }, 9894: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.FragColorGlslLib = void 0;
        const h = b(8520), p = b(5060);
        class g extends h.GlslLib {
          constructor(c) {
            super(c);
          }
          getFunctions() {
            return Object.assign(Object.assign({}, this.setFragColor()), this.getColorAsFloat());
          }
          getCustomTypes() {
            return {};
          }
          setFragColor() {
            const c = (0, p.getGlsl)(this.context.glContext.version);
            return { setFragColor: new h.GlslLibRoutine(`
        void setFragColor(float value) {
            ${c.output} = encode(value);
        }
        `, ["encoding.encode"]) };
          }
          getColorAsFloat() {
            return { getColorAsFloat: new h.GlslLibRoutine(`
        float getColorAsFloat(vec4 color) {
            return decode(color);
        }
        `, ["encoding.decode"]) };
          }
        }
        u.FragColorGlslLib = g;
      }, 2848: (C, u) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.replaceInlines = void 0;
        const b = /@inline[\s\n\r]+(\w+)[\s\n\r]+([0-9a-zA-Z_]+)\s*\(([^)]*)\)\s*{(([^}]|[\n\r])*)}/gm;
        u.replaceInlines = function(h) {
          const p = {};
          let g;
          for (; (g = b.exec(h)) !== null; ) {
            const o = g[3].split(",").map((c) => {
              const f = c.trim().split(" ");
              return f && f.length === 2 ? { type: f[0], name: f[1] } : null;
            }).filter((c) => c !== null);
            p[g[2]] = { params: o, body: g[4] };
          }
          for (const o in p) {
            const c = "(\\w+)?\\s+([_0-9a-zA-Z]+)\\s+=\\s+__FUNC__\\((.*)\\)\\s*;".replace("__FUNC__", o), f = new RegExp(c, "gm");
            for (; (g = f.exec(h)) !== null; ) {
              const a = g[1], i = g[2], t = g[3].split(","), e = a ? `${a} ${i};` : "";
              let n = p[o].body, r = "";
              p[o].params.forEach((l, d) => {
                l && (r += `${l.type} ${l.name} = ${t[d]};
`);
              }), n = `${r}
 ${n}`, n = n.replace("return", `${i} = `);
              const s = `
      ${e}
      {
        ${n}
      }
      `;
              h = h.replace(g[0], s);
            }
          }
          return h.replace(b, "");
        };
      }, 8879: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.GlslPreprocessor = void 0;
        const h = b(8520), p = b(2848), g = b(5483), o = b(5060);
        u.GlslPreprocessor = class {
          constructor(c, f, a, i) {
            this.libs = {}, this.glslLibRoutineDependencyGraph = {}, this.context = new h.GlslContext(c, f, a, i), Object.keys(g.glslRegistry).forEach((e) => {
              const n = new g.glslRegistry[e](this.context);
              this.libs[e] = n;
            });
            const t = this.glslLibRoutineDependencyGraph;
            for (const e in this.libs) {
              const n = this.libs[e].getFunctions();
              for (const r in n) {
                const s = e + "." + r;
                let l;
                t[s] ? (l = t[s], l.routineBody = n[r].routineBody) : (l = new h.GlslLibRoutineNode(s, n[r].routineBody), t[s] = l);
                const d = n[r].dependencies;
                if (d) for (let m = 0; m < d.length; ++m) if (t[d[m]]) l.addDependency(t[d[m]]);
                else {
                  const y = new h.GlslLibRoutineNode(d[m]);
                  t[d[m]] = y, l.addDependency(y);
                }
              }
            }
          }
          preprocess() {
            const c = this.context.programInfo;
            let f = c.shaderSource;
            return this.context.programInfo.hasMain || (f = `${f}
      ${(0, o.getDefaultFragShaderMain)(this.context.glContext.version, this.context.outputTextureLayout.shape.length)}`), f = (0, p.replaceInlines)(f), `${(0, o.getFragShaderPreamble)(this.context.glContext.version)}
    ${this.getUniforms(c.inputNames, c.variables)}
    ${this.getImports(f)}
    ${f}`;
          }
          getImports(c) {
            const f = this.selectGlslLibRoutinesToBeIncluded(c);
            if (f.length === 0) return "";
            let a = "";
            for (let i = 0; i < f.length; ++i) {
              if (!f[i].routineBody) throw new Error(`Missing body for the Glsl Library routine: ${f[i].name}`);
              a += f[i].routineBody + `
`;
            }
            return a;
          }
          selectGlslLibRoutinesToBeIncluded(c) {
            const f = [];
            return Object.keys(this.glslLibRoutineDependencyGraph).forEach((a) => {
              const i = a.split(".")[1];
              c.indexOf(i) !== -1 && f.push(this.glslLibRoutineDependencyGraph[a]);
            }), h.TopologicalSortGlslRoutines.returnOrderedNodes(f);
          }
          getUniforms(c, f) {
            const a = [];
            if (c) for (const i of c) a.push(`uniform sampler2D ${i};`);
            if (f) for (const i of f) a.push(`uniform ${i.type} ${i.name}${i.arrayLength ? `[${i.arrayLength}]` : ""};`);
            return a.join(`
`);
          }
        };
      }, 5483: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.glslRegistry = void 0;
        const h = b(5107), p = b(7341), g = b(9894), o = b(2655), c = b(3891);
        u.glslRegistry = { encoding: p.EncodingGlslLib, fragcolor: g.FragColorGlslLib, vec: c.VecGlslLib, shapeUtils: o.ShapeUtilsGlslLib, coordinates: h.CoordsGlslLib };
      }, 2655: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.ShapeUtilsGlslLib = void 0;
        const h = b(8520);
        class p extends h.GlslLib {
          constructor(o) {
            super(o);
          }
          getFunctions() {
            return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.bcastIndex()), this.bcastMatmulIndex()), this.offsetToIndices()), this.indicesToOffset()), this.incrementIndices());
          }
          getCustomTypes() {
            return {};
          }
          bcastIndex() {
            const o = this.context.outputTextureLayout.shape.length, c = {};
            return this.context.programInfo.inputNames.forEach((f, a) => {
              const i = this.context.inputTextureLayouts[a].unpackedShape;
              if (i.length <= o) {
                const t = i.length, e = o - t, n = `bcastIndices_${f}`;
                let r = "";
                for (let l = 0; l < t; ++l) r += `
          realIndices[${l}] = int( mod(float(bcastedIndices[${e + l}]), ${i[l]}.0) );
          `;
                const s = `
        void ${n} (int bcastedIndices[${o}], out int realIndices[${t}]) {
          ${r}
        }
        `;
                c[n] = new h.GlslLibRoutine(s);
              }
            }), c;
          }
          bcastMatmulIndex() {
            const o = this.context.outputTextureLayout.shape.length, c = {};
            return this.context.programInfo.inputNames.forEach((f, a) => {
              const i = this.context.inputTextureLayouts[a].shape;
              if (!(i.length < 2 || i.length > o)) {
                const t = i.length, e = o - t, n = `bcastMatmulIndices_${f}`;
                let r = "";
                for (let l = 0; l < t - 2; ++l) r += `
          realIndices[${l}] = int( mod(float(bcastedIndices[${e + l}]), ${i[l]}.0) );
          `;
                const s = `
        void ${n}(int bcastedIndices[${o}], out int realIndices[${t}]) {
          ${r}
          realIndices[${t - 1}] = bcastedIndices[${o - 1}];
          realIndices[${t - 2}] = bcastedIndices[${o - 2}];
        }
        `;
                c[n] = new h.GlslLibRoutine(s);
              }
            }), c;
          }
          indicesToOffset() {
            const o = {};
            return this.context.programInfo.inputNames.forEach((c, f) => {
              const a = this.context.inputTextureLayouts[f].shape, i = this.context.inputTextureLayouts[f].strides, t = a.length;
              let e = `indicesToOffset_${c}`;
              o[e] = new h.GlslLibRoutine(p.indexToOffsetSingle(e, t, i)), e = `indicesToOffset_${c}_T`, o[e] = new h.GlslLibRoutine(p.indexToOffsetSingle(e, t, i.slice().reverse()));
            }), o;
          }
          static indexToOffsetSingle(o, c, f) {
            let a = "";
            for (let i = c - 1; i >= 0; --i) a += `
        offset += indices[${i}] * ${f[i]};
        `;
            return `
      int ${o}(int indices[${c}]) {
        int offset = 0;
        ${a}
        return offset;
      }
      `;
          }
          offsetToIndices() {
            const o = {};
            return this.context.programInfo.inputNames.forEach((c, f) => {
              const a = this.context.inputTextureLayouts[f].shape, i = this.context.inputTextureLayouts[f].strides, t = a.length;
              let e = `offsetToIndices_${c}`;
              o[e] = new h.GlslLibRoutine(p.offsetToIndicesSingle(e, t, i)), e = `offsetToIndices_${c}_T`, o[e] = new h.GlslLibRoutine(p.offsetToIndicesSingle(e, t, i.slice().reverse()));
            }), o;
          }
          static offsetToIndicesSingle(o, c, f) {
            const a = [];
            for (let i = 0; i < c - 1; ++i) a.push(`
      indices[${i}] = offset / ${f[i]};`), a.push(`
        offset -= indices[${i}] * ${f[i]};`);
            return a.push(`
      indices[${c - 1}] = offset;`), `
      void ${o}(int offset, out int indices[${c}]) {
        ${a.join("")}
      }
      `;
          }
          incrementIndices() {
            const o = {};
            return this.context.programInfo.inputNames.forEach((c, f) => {
              const a = this.context.inputTextureLayouts[f].shape, i = a.length, t = `incrementIndices_${c}`;
              let e = "";
              for (let r = 0; r < i; ++r) e += `
        shape[${r}] = ${a[r]};`;
              const n = `
        void ${t}(int axis, out int indices[${i}]) {
          int shape[${i}];
          ${e};
          for(int i = ${i} -1 ; i >= 0; --i) {
            if(i > axis) continue;
            indices[i] += 1;
            if(indices[i] < shape[i]) {
              break;
            }
            indices[i] = 0;
          }
        }
        `;
              o[t] = new h.GlslLibRoutine(n);
            }), o;
          }
        }
        u.ShapeUtilsGlslLib = p;
      }, 5060: (C, u) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.getDefaultFragShaderMain = u.getFragShaderPreamble = u.getVertexShaderSource = u.getGlsl = void 0;
        const b = { version: "", attribute: "attribute", varyingVertex: "varying", varyingFrag: "varying", texture2D: "texture2D", output: "gl_FragColor", outputDeclaration: "" }, h = { version: "#version 300 es", attribute: "in", varyingVertex: "out", varyingFrag: "in", texture2D: "texture", output: "outputColor", outputDeclaration: "out vec4 outputColor;" };
        function p(g) {
          return g === 1 ? b : h;
        }
        u.getGlsl = p, u.getVertexShaderSource = function(g) {
          const o = p(g);
          return `${o.version}
      precision highp float;
      ${o.attribute} vec3 position;
      ${o.attribute} vec2 textureCoord;

      ${o.varyingVertex} vec2 TexCoords;

      void main()
      {
          gl_Position = vec4(position, 1.0);
          TexCoords = textureCoord;
      }`;
        }, u.getFragShaderPreamble = function(g) {
          const o = p(g);
          return `${o.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${o.varyingFrag} vec2 TexCoords;
    ${o.outputDeclaration}
    const vec2 halfCR = vec2(0.5, 0.5);

    // Custom vector types to handle higher dimenalities.
    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    `;
        }, u.getDefaultFragShaderMain = function(g, o) {
          return `
  void main() {
    int indices[${o}];
    toVec(TexCoords, indices);
    vec4 result = vec4(process(indices));
    ${p(g).output} = result;
  }
  `;
        };
      }, 3891: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.VecGlslLib = void 0;
        const h = b(8520);
        class p extends h.GlslLib {
          constructor(o) {
            super(o);
          }
          getCustomTypes() {
            return {};
          }
          getFunctions() {
            return Object.assign(Object.assign(Object.assign(Object.assign({}, this.binaryVecFunctions()), this.copyVec()), this.setVecItem()), this.getVecItem());
          }
          binaryVecFunctions() {
            const o = this.context.outputTextureLayout.shape.length, c = { add: "+=", sub: "-=", mul: "*=", div: "/=" }, f = {};
            for (const a in c) {
              const i = `${a}Vec`;
              let t = "";
              for (let n = 0; n < o; ++n) t += `
          dest[${n}] ${c[a]} src[${n}];
          `;
              const e = `
        void ${i}(int src[${o}], out int dest[${o}]) {
          ${t}
        }
        `;
              f[i] = new h.GlslLibRoutine(e);
            }
            return f;
          }
          copyVec() {
            const o = this.context.outputTextureLayout.shape.length;
            let c = "";
            for (let a = 0; a < o; ++a) c += `
        dest[${a}] = src[${a}];
        `;
            const f = `
      void copyVec(int src[${o}], out int dest[${o}]) {
        ${c}
      }
      `;
            return { copyVec: new h.GlslLibRoutine(f) };
          }
          setVecItem() {
            const o = this.context.outputTextureLayout.shape.length;
            let c = `
        if(index < 0)
            index =${o} + index;
        if (index == 0)
            m[0] = value;
        `;
            for (let a = 1; a < o - 1; ++a) c += `
        else if (index == ${a})
            m[${a}] = value;
            `;
            c += `
        else
            m[${o - 1}] = value;
        `;
            const f = `
      void setVecItem(out int m[${o}], int index, int value) {
        ${c}
      }
        `;
            return { setVecItem: new h.GlslLibRoutine(f) };
          }
          getVecItem() {
            const o = this.context.outputTextureLayout.shape.length;
            let c = `
        if(index < 0)
            index = ${o} + index;
        if (index == 0)
            return m[0];
      `;
            for (let a = 1; a < o - 1; ++a) c += `
        else if (index == ${a})
            return m[${a}];
      `;
            c += `
        else
            return m[${o - 1}];
        `;
            const f = `
      int getVecItem(int m[${o}], int index) {
        ${c}
      }
    `;
            return { getVecItem: new h.GlslLibRoutine(f) };
          }
        }
        u.VecGlslLib = p;
      }, 8316: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.WebGLInferenceHandler = void 0;
        const h = b(6231), p = b(9162), g = b(2517), o = b(2403), c = b(7019), f = b(8710), a = b(5611), i = b(4057), t = b(2039);
        u.WebGLInferenceHandler = class {
          constructor(e) {
            this.session = e, this.packedTextureDataCache = /* @__PURE__ */ new Map(), this.unpackedTextureDataCache = /* @__PURE__ */ new Map();
          }
          calculateTextureWidthAndHeight(e, n) {
            return (0, i.calculateTextureWidthAndHeight)(this.session.layoutStrategy, e, n);
          }
          executeProgram(e, n) {
            if (n.length < e.inputNames.length) throw new Error(`Input size mustn't be less than ${e.inputNames.length}.`);
            if (e.inputNames.length !== e.inputTypes.length) throw new Error("input names size does not match input types");
            const r = [];
            for (let w = 0; w < e.inputNames.length; ++w) r[w] = this.getOrCreateTextureData(n[w], e.inputTypes[w]);
            const s = ((w, _) => {
              const S = _.map((P) => `${P.unpackedShape.join(",")};${P.width}x${P.height}`).join("_");
              let A = w.name;
              return w.cacheHint && (A += "[" + w.cacheHint + "]"), A += ":" + S, A;
            })(e, r);
            let l = this.session.programManager.getArtifact(s);
            const d = l ? l.programInfo : typeof e.get == "function" ? e.get() : e, m = (0, i.createTextureLayoutFromTextureType)(this.session.layoutStrategy, d.output.dims, d.output.textureType), y = this.createTextureData(m, d.output.type);
            return l || (l = this.session.programManager.build(d, r, y), this.session.programManager.setArtifact(s, l)), this.runProgram(l, r, y), y;
          }
          run(e, n) {
            return this.executeProgram(e, n).tensor;
          }
          runProgram(e, n, r) {
            for (let s = 0; s < n.length; ++s) if (!!n[s].isPacked != (e.programInfo.inputTypes[s] === t.TextureType.packed)) throw new Error(`input[${s}] property packed inconsistent`);
            if (!!r.isPacked != (e.programInfo.output.textureType === t.TextureType.packed)) throw new Error("output property packed inconsistent");
            this.session.programManager.run(e, n, r);
          }
          getOrCreateTextureData(e, n) {
            let r = this.getTextureData(e.dataId, n === t.TextureType.packed);
            if (!r && (r = this.getTextureData(e.dataId, n !== t.TextureType.packed), r)) return n === t.TextureType.packed ? this.pack(r) : this.unpack(r);
            if (!r) {
              const s = (0, i.createTextureLayoutFromTextureType)(this.session.layoutStrategy, e.dims, n);
              if (n === t.TextureType.packedLastDimension) {
                const m = e.dims;
                if (m.length === 4) {
                  const y = [m[0], Math.ceil(m[1] * m[2] * m[3] / 4)], w = (0, i.createTextureLayoutFromTextureType)(this.session.layoutStrategy, y, n);
                  let _ = e.numberData;
                  if (m[1] * m[2] * m[3] % 4 != 0) {
                    const S = m[0], A = m[1] * m[2] * m[3], P = Math.ceil(A * 1 / 4) * 4;
                    _ = new Float32Array(S * P);
                    for (let v = 0; v < S; ++v) {
                      const R = v * A, B = v * P + v % 1 * A;
                      _.set(e.numberData.subarray(R, R + A), B);
                    }
                  }
                  return this.createTextureData(w, e.type, _, e, 1);
                }
              }
              if (n === t.TextureType.packed) {
                const l = (0, i.createTextureLayoutFromShape)(this.session.layoutStrategy, e.dims, 1, [], { reverseWH: !0 }), d = this.createTextureData(l, e.type, e.numberData, e, 1);
                r = this.pack(d);
              } else r = this.createTextureData(s, e.type, e.numberData, e, 1);
            }
            return r;
          }
          createTextureDataFromLayoutBindTensor(e, n, r, s) {
            return this.createTextureData(e, n, r, s, 1);
          }
          createTextureData(e, n, r, s, l) {
            h.Logger.verbose("InferenceHandler", `Creating TextureData: layout:[${JSON.stringify(e)}]`);
            const d = this.session.textureManager.createTextureFromLayout(n, e, r, l);
            return this.createTextureDataFromTexture(e, n, d, s);
          }
          reshapeUnpacked(e, n) {
            const r = this.getOrCreateTextureData(e, t.TextureType.unpacked), s = { channels: r.channels, height: r.height, width: r.width, shape: n.length !== 0 ? n : [1], strides: g.ShapeUtil.computeStrides(n), unpackedShape: n };
            return this.createTextureDataFromTexture(s, e.type, r.texture).tensor;
          }
          reshapePacked(e, n) {
            const r = this.getOrCreateTextureData(e, t.TextureType.packed);
            if ((0, c.isReshapeCheap)(e.dims, n)) {
              const y = { channels: r.channels, height: r.height, width: r.width, shape: n.length !== 0 ? n : [1], strides: g.ShapeUtil.computeStrides(n), unpackedShape: n, isPacked: !0 };
              return this.createTextureDataFromTexture(y, e.type, r.texture).tensor;
            }
            const s = (0, c.processDims3D)(e.dims), l = (0, c.processDims3D)(n), d = this.reshapePacked(e, s), m = this.run((0, c.createPackedReshape3DProgramInfoLoader)(this, d, l), [d]);
            return this.reshapePacked(m, n);
          }
          cast(e, n) {
            const r = this.getOrCreateTextureData(e, t.TextureType.unpacked);
            return this.createTextureDataFromTexture(r, n, r.texture).tensor;
          }
          createTextureDataFromTexture(e, n, r, s, l) {
            const d = Object.assign(Object.assign({}, e), { tensor: s || new p.Tensor(e.unpackedShape, n, (m) => this.readTexture(d), async (m) => this.readTextureAsync(d), void 0, l), texture: r });
            return this.setTextureData(d.tensor.dataId, d, e.isPacked), d;
          }
          getTextureData(e, n = !1) {
            return this.session.isInitializer(e) ? this.session.getTextureData(e, n) : n ? this.packedTextureDataCache.get(e) : this.unpackedTextureDataCache.get(e);
          }
          setTextureData(e, n, r = !1) {
            this.session.isInitializer(e) ? this.session.setTextureData(e, n, r) : (r ? this.packedTextureDataCache : this.unpackedTextureDataCache).set(e, n);
          }
          isTextureLayoutCached(e, n = !1) {
            return !!this.getTextureData(e.dataId, n);
          }
          dispose() {
            this.session.textureManager.clearActiveTextures(), this.packedTextureDataCache.forEach((e) => this.session.textureManager.releaseTexture(e)), this.packedTextureDataCache = /* @__PURE__ */ new Map(), this.unpackedTextureDataCache.forEach((e) => this.session.textureManager.releaseTexture(e)), this.unpackedTextureDataCache = /* @__PURE__ */ new Map();
          }
          readTexture(e) {
            return e.isPacked ? this.readTexture(this.unpack(e)) : this.session.backend.glContext.isFloat32DownloadSupported ? this.session.textureManager.readTexture(e, e.tensor.type, e.channels) : this.session.textureManager.readUint8TextureAsFloat((0, f.encodeAsUint8)(this, e));
          }
          async readTextureAsync(e) {
            return e.isPacked ? this.readTextureAsync(this.unpack(e)) : this.session.backend.glContext.isFloat32DownloadSupported ? this.session.textureManager.readTextureAsync(e, e.tensor.type, e.channels) : this.session.textureManager.readUint8TextureAsFloat((0, f.encodeAsUint8)(this, e));
          }
          pack(e) {
            return this.executeProgram((0, o.createPackProgramInfoLoader)(this, e.tensor), [e.tensor]);
          }
          unpack(e) {
            return this.executeProgram((0, a.createUnpackProgramInfoLoader)(this, e.tensor), [e.tensor]);
          }
        };
      }, 1640: function(C, u, b) {
        var h = this && this.__createBinding || (Object.create ? function(H, te, Z, ne) {
          ne === void 0 && (ne = Z);
          var ue = Object.getOwnPropertyDescriptor(te, Z);
          ue && !("get" in ue ? !te.__esModule : ue.writable || ue.configurable) || (ue = { enumerable: !0, get: function() {
            return te[Z];
          } }), Object.defineProperty(H, ne, ue);
        } : function(H, te, Z, ne) {
          ne === void 0 && (ne = Z), H[ne] = te[Z];
        }), p = this && this.__setModuleDefault || (Object.create ? function(H, te) {
          Object.defineProperty(H, "default", { enumerable: !0, value: te });
        } : function(H, te) {
          H.default = te;
        }), g = this && this.__importStar || function(H) {
          if (H && H.__esModule) return H;
          var te = {};
          if (H != null) for (var Z in H) Z !== "default" && Object.prototype.hasOwnProperty.call(H, Z) && h(te, H, Z);
          return p(te, H), te;
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.WEBGL_OP_RESOLVE_RULES = void 0;
        const o = b(2898), c = g(b(7839)), f = b(4196), a = b(2069), i = b(8138), t = b(9663), e = b(5193), n = b(7992), r = b(1253), s = b(4776), l = b(6572), d = b(3346), m = b(5623), y = b(2870), w = b(2143), _ = b(4939), S = b(718), A = b(2268), P = b(8117), v = b(2278), R = b(5524), B = b(5975), q = b(3933), D = b(6558), O = b(5723), N = b(3738), E = g(b(4909)), M = b(8428), Y = b(9793);
        u.WEBGL_OP_RESOLVE_RULES = [["Abs", "", "6+", E.abs], ["Acos", "", "7+", E.acos], ["Add", "", "7+", c.add], ["And", "", "7+", c.and], ["Asin", "", "7+", E.asin], ["Atan", "", "7+", E.atan], ["AveragePool", "", "7+", w.averagePool, w.parseAveragePoolAttributes], ["BatchNormalization", "", "7+", o.batchNormalization, o.parseBatchNormalizationAttributes], ["Cast", "", "6+", f.cast, f.parseCastAttributes], ["Ceil", "", "6+", E.ceil], ["Clip", "", "6-10", E.clip, E.parseClipAttributes], ["Clip", "", "11+", E.clipV11], ["Concat", "", "4+", a.concat, a.parseConcatAttributes], ["Conv", "", "1+", i.conv, i.parseConvAttributes], ["ConvTranspose", "", "1+", t.convTranspose, t.parseConvTransposeAttributes], ["Cos", "", "7+", E.cos], ["Div", "", "7+", c.div], ["Dropout", "", "7+", E.identity], ["DepthToSpace", "", "1+", e.depthToSpace, e.parseDepthToSpaceAttributes], ["Equal", "", "7+", c.equal], ["Elu", "", "6+", E.elu, E.parseEluAttributes], ["Exp", "", "6+", E.exp], ["Flatten", "", "1+", n.flatten, n.parseFlattenAttributes], ["Floor", "", "6+", E.floor], ["FusedConv", "com.microsoft", "1+", i.conv, i.parseConvAttributes], ["Gather", "", "1+", r.gather, r.parseGatherAttributes], ["Gemm", "", "7-10", s.gemm, s.parseGemmAttributesV7], ["Gemm", "", "11+", s.gemm, s.parseGemmAttributesV11], ["GlobalAveragePool", "", "1+", w.globalAveragePool, w.parseGlobalAveragePoolAttributes], ["GlobalMaxPool", "", "1+", w.globalMaxPool], ["Greater", "", "7+", c.greater], ["Identity", "", "1+", E.identity], ["ImageScaler", "", "1+", l.imageScaler, l.parseImageScalerAttributes], ["InstanceNormalization", "", "6+", d.instanceNormalization, d.parseInstanceNormalizationAttributes], ["LeakyRelu", "", "6+", E.leakyRelu, E.parseLeakyReluAttributes], ["Less", "", "7+", c.less], ["Log", "", "6+", E.log], ["MatMul", "", "1+", m.matMul, m.parseMatMulAttributes], ["MaxPool", "", "1+", w.maxPool, w.parseMaxPoolAttributes], ["Mul", "", "7+", c.mul], ["Neg", "", "6+", E.neg], ["Not", "", "1+", E.not], ["Or", "", "7+", c.or], ["Pad", "", "2-10", y.padV2, y.parsePadAttributesV2], ["Pad", "", "11+", y.padV11, y.parsePadAttributesV11], ["Pow", "", "7+", c.pow], ["PRelu", "", "7+", c.pRelu], ["ReduceLogSum", "", "1+", _.reduceLogSum, _.parseReduceAttributes], ["ReduceMax", "", "1+", _.reduceMax, _.parseReduceAttributes], ["ReduceMean", "", "1+", _.reduceMean, _.parseReduceAttributes], ["ReduceMin", "", "1+", _.reduceMin, _.parseReduceAttributes], ["ReduceProd", "", "1+", _.reduceProd, _.parseReduceAttributes], ["ReduceSum", "", "1-12", _.reduceSum, _.parseReduceAttributes], ["ReduceSumSquare", "", "1+", _.reduceLogSumSquare, _.parseReduceAttributes], ["Relu", "", "6+", E.relu], ["Reshape", "", "5+", S.reshape], ["Resize", "", "10", A.resize, A.parseResizeAttributesV10], ["Resize", "", "11+", A.resize, A.parseResizeAttributesV11], ["Shape", "", "1+", P.shape], ["Sigmoid", "", "6+", E.sigmoid], ["Sin", "", "7+", E.sin], ["Slice", "", "10+", v.sliceV10], ["Slice", "", "1-9", v.slice, v.parseSliceAttributes], ["Softmax", "", "1-12", R.softmax, R.parseSoftmaxAttributes], ["Softmax", "", "13+", R.softmaxV13, R.parseSoftmaxAttributesV13], ["Split", "", "2-12", B.split, B.parseSplitAttributes], ["Sqrt", "", "6+", E.sqrt], ["Squeeze", "", "1-12", q.squeeze, q.parseSqueezeAttributes], ["Squeeze", "", "13+", q.squeezeV13], ["Sub", "", "7+", c.sub], ["Sum", "", "6+", D.sum], ["Tan", "", "7+", E.tan], ["Tanh", "", "6+", E.tanh], ["Tile", "", "6+", O.tile], ["Transpose", "", "1+", N.transpose, N.parseTransposeAttributes], ["Upsample", "", "7-8", Y.upsample, Y.parseUpsampleAttributesV7], ["Upsample", "", "9", Y.upsample, Y.parseUpsampleAttributesV9], ["Unsqueeze", "", "1-12", M.unsqueeze, M.parseUnsqueezeAttributes], ["Unsqueeze", "", "13+", M.unsqueezeV13], ["Xor", "", "7+", c.xor]];
      }, 2898: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseBatchNormalizationAttributes = u.batchNormalization = void 0;
        const h = b(246), p = b(5060), g = b(2039), o = { name: "BatchNormalization", inputNames: ["A", "Scale", "B", "Mean", "Variance"], inputTypes: [g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked] };
        u.batchNormalization = (a, i, t) => (f(i), [a.run(Object.assign(Object.assign({}, o), { cacheHint: t.cacheKey, get: () => c(a, i, t) }), i)]), u.parseBatchNormalizationAttributes = (a) => {
          const i = a.attributes.getFloat("epsilon", 1e-5), t = a.attributes.getFloat("momentum", 0.9), e = a.attributes.getInt("spatial", 1);
          return (0, h.createAttributeWithCacheKey)({ epsilon: i, momentum: t, spatial: e });
        };
        const c = (a, i, t) => {
          const e = (0, p.getGlsl)(a.session.backend.glContext.version), n = i[0].dims.length, [r, s] = a.calculateTextureWidthAndHeight(i[1].dims, g.TextureType.unpacked), l = `
  float process(int[${n}] indices) {
    vec2 position = offsetToCoords(indices[1], ${r}, ${s});
    float scale = getColorAsFloat(${e.texture2D}(Scale, position));
    float mean = getColorAsFloat(${e.texture2D}(Mean, position));
    float variance = getColorAsFloat(${e.texture2D}(Variance, position));
    float b = getColorAsFloat(${e.texture2D}(B, position));

    return scale * ( (_A(indices) - mean) / sqrt(variance + float(${t.epsilon})) ) + b;
  }`;
          return Object.assign(Object.assign({}, o), { output: { dims: i[0].dims, type: i[0].type, textureType: g.TextureType.unpacked }, shaderSource: l });
        }, f = (a) => {
          if (!a || a.length !== 5) throw new Error("BatchNormalization requires 5 inputs.");
          const i = a[0], t = a[1], e = a[2], n = a[3], r = a[4];
          if (i.dims.length < 3 || t.dims.length !== 1 || e.dims.length !== 1 || n.dims.length !== 1 || r.dims.length !== 1) throw new Error("invalid input shape.");
          if (t.dims[0] !== i.dims[1] || e.dims[0] !== i.dims[1] || n.dims[0] !== i.dims[1] || r.dims[0] !== i.dims[1]) throw new Error("invalid input shape.");
          if (i.type !== "float32" && i.type !== "float64" || t.type !== "float32" && t.type !== "float64" || e.type !== "float32" && e.type !== "float64" || n.type !== "float32" && n.type !== "float64" || r.type !== "float32" && r.type !== "float64") throw new Error("invalid input tensor types.");
        };
      }, 7839: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.xor = u.sub = u.pRelu = u.pow = u.or = u.mul = u.less = u.greater = u.equal = u.div = u.and = u.add = u.glslPRelu = u.glslPow = u.glslXor = u.glslOr = u.glslAnd = u.glslLess = u.glslGreater = u.glslEqual = u.glslSub = u.glslMul = u.glslDiv = u.glslAdd = void 0;
        const h = b(2517), p = b(8520), g = b(5060), o = b(2039);
        function c() {
          const _ = "add_";
          return { body: `
  float ${_}(float a, float b) {
    return a + b;
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    return v1 + v2;
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function f() {
          const _ = "div_";
          return { body: `
  float ${_}(float a, float b) {
    return a / b;
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    return v1 / v2;
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function a() {
          const _ = "mul_";
          return { body: `
  float ${_}(float a, float b) {
    return a * b;
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    return v1 * v2;
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function i() {
          const _ = "sub_";
          return { body: `
  float ${_}(float a, float b) {
    return a - b;
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    return v1 - v2;
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function t() {
          const _ = "equal_";
          return { body: `
  float ${_}(float a, float b) {
    return float(a == b);
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    return vec4(equal(v1, v2));
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function e() {
          const _ = "greater_";
          return { body: `
  float ${_}(float a, float b) {
    return float(a > b);
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    return vec4( v1.r > v2.r ,
      v1.g > v2.g,
      v1.b > v2.b,
      v1.a > v2.a );
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function n() {
          const _ = "less_";
          return { body: `
  float ${_}(float a, float b) {
    return float(a < b);
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    return vec4( v1.r < v2.r ,
                v1.g < v2.g,
                v1.b < v2.b,
                v1.a < v2.a );
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function r() {
          const _ = "and_";
          return { body: `
  float ${_}(float a, float b) {
    return float( bool(a) && bool(b) );
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r && b2.r ,
                b1.g && b2.g,
                b1.b && b2.b,
                b1.a && b2.a );
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function s() {
          const _ = "or_";
          return { body: `
  float ${_}(float a, float b) {
    return float( bool(a) || bool(b) );
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r || b2.r ,
                b1.g || b2.g,
                b1.b || b2.b,
                b1.a || b2.a );
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function l() {
          const _ = "xor_";
          return { body: `
  float ${_}(float a, float b) {
    return float( bool(a) ^^ bool(b) );
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r ^^ b2.r ,
                b1.g ^^ b2.g,
                b1.b ^^ b2.b,
                b1.a ^^ b2.a );
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        function d() {
          return function(_) {
            const S = `${_}_`;
            return { body: `
  float ${S}(float a, float b) {
    return ${_}(a, b);
  }
  vec4 ${S}(vec4 v1, vec4 v2) {
    return ${_}(v1, v2);
  }
  `, name: S, type: p.FunctionType.ValueBased };
          }("pow");
        }
        function m() {
          const _ = "prelu_";
          return { body: `
  float ${_}(float a, float b) {
    return a < 0.0 ? a * b: a;
  }
  vec4 ${_}(vec4 v1, vec4 v2) {
    return vec4(
      v1.r < 0.0 ? v1.r * v2.r: v1.r,
      v1.g < 0.0 ? v1.g * v2.g: v1.g,
      v1.b < 0.0 ? v1.b * v2.b: v1.b,
      v1.a < 0.0 ? v1.a * v2.a: v1.a
      );
  }
  `, name: _, type: p.FunctionType.ValueBased };
        }
        u.glslAdd = c, u.glslDiv = f, u.glslMul = a, u.glslSub = i, u.glslEqual = t, u.glslGreater = e, u.glslLess = n, u.glslAnd = r, u.glslOr = s, u.glslXor = l, u.glslPow = d, u.glslPRelu = m;
        const y = (_, S, A, P = S[0].type, v) => {
          const R = _.session.pack ? o.TextureType.packed : o.TextureType.unpacked;
          return { name: A.name, inputNames: ["A", "B"], inputTypes: [R, R], cacheHint: v, get: () => w(_, S, A, P) };
        }, w = (_, S, A, P = S[0].type) => {
          const v = _.session.pack ? o.TextureType.packed : o.TextureType.unpacked, R = !h.ShapeUtil.areEqual(S[0].dims, S[1].dims);
          let B = S[0].dims;
          const q = _.session.pack;
          if (R) {
            const N = h.BroadcastUtil.calcShape(S[0].dims, S[1].dims, !1);
            if (!N) throw new Error("Can't perform binary op on the given tensors");
            B = N;
            const E = B.length, M = S[0].dims.length !== 0 ? S[0].dims.length : 1, Y = S[1].dims.length !== 0 ? S[1].dims.length : 1, H = S[0].dims.length !== 0 ? "bcastIndices_A(indices, aindices);" : "aindices[0] = 0;", te = S[1].dims.length !== 0 ? "bcastIndices_B(indices, bindices);" : "bindices[0] = 0;", Z = (0, g.getGlsl)(_.session.backend.glContext.version), ne = q ? `
      ${A.body}
      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();
        vec4 result = ${A.name}(a, b);
        ${Z.output} = result;
      }` : `
      ${A.body}
      float process(int indices[${E}]) {
        int aindices[${M}];
        int bindices[${Y}];
        ${H}
        ${te}
        return ${A.name}(_A(aindices), _B(bindices));
      }`;
            return { name: A.name, inputNames: ["A", "B"], inputTypes: [v, v], output: { dims: B, type: P, textureType: v }, shaderSource: ne, hasMain: q };
          }
          const D = (0, g.getGlsl)(_.session.backend.glContext.version), O = `
    ${A.body}
    void main() {
      vec4 v1 = ${D.texture2D}(A, TexCoords);
      vec4 v2 = ${D.texture2D}(B, TexCoords);
      vec4 result = ${A.name}(v1, v2);
      ${D.output} = result;
    }
    `;
          return { name: A.name, inputNames: ["A", "B"], inputTypes: [v, v], output: { dims: S[0].dims, type: P, textureType: v }, shaderSource: O, hasMain: !0 };
        };
        u.add = (_, S) => [_.run(y(_, S, c()), S)], u.and = (_, S) => [_.run(y(_, S, r(), "bool"), S)], u.div = (_, S) => [_.run(y(_, S, f()), S)], u.equal = (_, S) => [_.run(y(_, S, t(), "bool"), S)], u.greater = (_, S) => [_.run(y(_, S, e(), "bool"), S)], u.less = (_, S) => [_.run(y(_, S, n(), "bool"), S)], u.mul = (_, S) => [_.run(y(_, S, a()), S)], u.or = (_, S) => [_.run(y(_, S, s(), "bool"), S)], u.pow = (_, S) => [_.run(y(_, S, d()), S)], u.pRelu = (_, S) => [_.run(y(_, S, m()), S)], u.sub = (_, S) => [_.run(y(_, S, i()), S)], u.xor = (_, S) => [_.run(y(_, S, l(), "bool"), S)];
      }, 4196: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseCastAttributes = u.cast = void 0;
        const h = b(2517);
        u.cast = (g, o, c) => (p(o), [g.cast(o[0], c)]), u.parseCastAttributes = (g) => h.ProtoUtil.tensorDataTypeFromProto(g.attributes.getInt("to"));
        const p = (g) => {
          if (!g || g.length !== 1) throw new Error("Cast requires 1 input.");
          if (g[0].type === "string") throw new Error("Invalid input type.");
        };
      }, 1163: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createPackedConcatProgramInfoLoader = void 0;
        const h = b(5060), p = b(2039), g = b(9390), o = b(2827);
        u.createPackedConcatProgramInfoLoader = (f, a, i) => {
          const t = (e = a.length, n = i.cacheKey, { name: "Concat (packed)", inputNames: Array.from({ length: e }, (r, s) => `X${s}`), inputTypes: Array(e).fill(p.TextureType.packed), cacheHint: n });
          var e, n;
          return Object.assign(Object.assign({}, t), { get: () => ((r, s, l, d) => {
            const m = l[0].dims.slice();
            if (d >= m.length || d < -1 * m.length) throw new Error("axis specified for concat doesn't match input dimensionality");
            d < 0 && (d = m.length + d);
            const y = m.slice(0);
            for (let H = 1; H < l.length; H++) {
              const te = l[H].dims.slice();
              for (let Z = 0; Z < m.length; Z++) if (Z === d) y[d] += te[Z];
              else if (m[Z] !== te[Z]) throw new Error("non concat dimensions must match");
            }
            const w = y.length, _ = (0, o.getChannels)("coords", w), S = (0, g.getCoordsDataType)(w), A = (0, o.unpackFromChannel)(), P = l.map((H) => H.dims), v = (0, g.getGlChannels)(w), R = new Array(P.length - 1);
            R[0] = P[0][d];
            for (let H = 1; H < R.length; H++) R[H] = R[H - 1] + P[H][d];
            const B = v[d], q = v.slice(-2), D = v.join();
            let O = `if (${B} < ${R[0]}) {
        return getChannel(
            getX0(${D}), vec2(${q.join()}));
        }`;
            for (let H = 1; H < R.length; H++) {
              const te = R[H - 1];
              O += `
            if (${B} < ${R[H]}  && ${B} >= ${R[H - 1]}) {
              return getChannel(
                getX${H}(${c(v, B, te)}),
                vec2(${c(q, B, te)}));
            }`;
            }
            const N = R.length, E = R[R.length - 1];
            O += `
            return getChannel(
              getX${N}(${c(v, B, E)}),
              vec2(${c(q, B, E)}));`;
            const M = (0, h.getGlsl)(r.session.backend.glContext.version), Y = `
          ${A}
          float getValue(${v.map((H) => "int " + H)}) {
            ${O}
          }

          void main() {
            ${S} coords = getOutputCoords();
            int lastDim = coords.${v[w - 1]};
            coords.${v[w - 1]} = coords.${v[w - 2]};
            coords.${v[w - 2]} = lastDim;

            vec4 result = vec4(getValue(${_}), 0., 0., 0.);

            ${_[w - 1]} = ${_[w - 1]} + 1;
            if (${_[w - 1]} < ${y[w - 1]}) {
              result.g = getValue(${_});
            }

            ${_[w - 2]} = ${_[w - 2]} + 1;
            if (${_[w - 2]} < ${y[w - 2]}) {
              result.a = getValue(${_});
            }

            ${_[w - 1]} = ${_[w - 1]} - 1;
            if (${_[w - 2]} < ${y[w - 2]} &&
                ${_[w - 1]} < ${y[w - 1]}) {
              result.b = getValue(${_});
            }
            ${M.output} = result;
          }
        `;
            return Object.assign(Object.assign({}, s), { output: { dims: y, type: l[0].type, textureType: p.TextureType.packed }, shaderSource: Y, hasMain: !0 });
          })(f, t, a, i.axis) });
        };
        const c = (f, a, i) => {
          const t = f.indexOf(a);
          return f.map((e, n) => n === t ? `${e} - ${i}` : e).join();
        };
      }, 2069: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseConcatAttributes = u.concat = void 0;
        const h = b(246), p = b(2039), g = b(1163);
        u.concat = (e, n, r) => (t(n), e.session.pack && n[0].dims.length > 1 ? [e.run((0, g.createPackedConcatProgramInfoLoader)(e, n, r), n)] : [e.run(o(e, n, r), n)]);
        const o = (e, n, r) => {
          const s = (l = n.length, d = r.cacheKey, { name: "Concat", inputNames: Array.from({ length: l }, (m, y) => `X${y}`), inputTypes: Array(l).fill(p.TextureType.unpacked), cacheHint: d });
          var l, d;
          return Object.assign(Object.assign({}, s), { get: () => ((m, y, w, _) => {
            const S = w[0].dims.slice();
            if (_ >= S.length || _ < -1 * S.length) throw new Error("axis specified for concat doesn't match input dimensionality");
            _ < 0 && (_ = S.length + _);
            const A = S.slice(0);
            for (let D = 1; D < w.length; D++) {
              const O = w[D].dims.slice();
              for (let N = 0; N < S.length; N++) if (N === _) A[_] += O[N];
              else if (S[N] !== O[N]) throw new Error("non concat dimensions must match");
            }
            const P = A.length, v = new Array(w.length);
            let R = 0;
            for (let D = 0; D < v.length; ++D) R += w[D].dims[_], v[D] = R;
            let B = "";
            B = w.length < 5 ? c(v) : f(v);
            const q = `
        ${a(w.length, P)}
        ${i(v)}
        ${B}
        float process(int indices[${P}]) {
          int textureIndex = getTextureWhereDataResides (indices[${_}]);

          if(textureIndex != 0) {
            indices[${_}] = indices[${_}] - int(getSizeInConcatAxisValueFromIndex(textureIndex-int(1)));
          }

          return fetchDataFromCorrectTexture(textureIndex, indices);
        }`;
            return Object.assign(Object.assign({}, y), { output: { dims: A, type: w[0].type, textureType: p.TextureType.unpacked }, shaderSource: q });
          })(0, s, n, r.axis) });
        }, c = (e) => `int getTextureWhereDataResides(int index) {
      ${e.map((n, r) => `if(index<${n}) {return ${r};}
`).join("")}
    }`, f = (e) => c(e), a = (e, n) => {
          const r = [`float fetchDataFromCorrectTexture(int textureIndex, int indices[${n}]) {`];
          for (let s = 0; s < e; ++s) s === 0 ? r.push(`	if (textureIndex == ${s}) { return _X${s}(indices); }`) : s === e - 1 ? r.push(`	else { return _X${s}(indices); }`) : r.push(`	else if (textureIndex == ${s}) { return _X${s}(indices); }`);
          return r.push("	}"), r.join(`
`);
        }, i = (e) => {
          const n = ["int getSizeInConcatAxisValueFromIndex(int index) {"];
          for (let r = 0; r < e.length; ++r) r === 0 ? n.push(`	if (index == ${r}) { return ${e[r]}; }`) : r === e.length - 1 ? n.push(`	else { return ${e[r]}; }`) : n.push(`	else if (index == ${r}) { return ${e[r]}; }`);
          return n.push("	}"), n.join(`
`);
        };
        u.parseConcatAttributes = (e) => (0, h.createAttributeWithCacheKey)({ axis: e.attributes.getInt("axis") });
        const t = (e) => {
          if (!e || e.length < 1) throw new Error("too few inputs");
          const n = e[0].type, r = e[0].dims.length;
          if (n === "string") throw new Error("string tensor is not supported yet");
          for (const s of e) {
            if (s.type !== n) throw new Error("input tensors should be one type");
            if (s.dims.length !== r) throw new Error("input tensors should have the same shape");
          }
        };
      }, 4770: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createUnpackedGroupedConvProgramInfoLoader = void 0;
        const h = b(6231), p = b(5060), g = b(2039), o = b(8138), c = b(2823);
        u.createUnpackedGroupedConvProgramInfoLoader = (f, a, i) => {
          const t = (e = a.length > 2, n = i.cacheKey, { name: "GroupedConv", inputNames: e ? ["X", "W", "Bias"] : ["X", "W"], inputTypes: e ? [g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked] : [g.TextureType.unpacked, g.TextureType.unpacked], cacheHint: n });
          var e, n;
          return Object.assign(Object.assign({}, t), { get: () => ((r, s, l, d) => {
            const m = s.length > 2 ? "value += getBias(output_channel);" : "", y = s[0].dims.slice(), w = s[1].dims.slice(), _ = w[0] / d.group;
            h.Logger.verbose("GroupedConv", `autpPad:${d.autoPad}, dilations:${d.dilations}, group:${d.group}, kernelShape:${d.kernelShape}, pads:${d.pads}, strides:${d.strides}`);
            const S = (0, o.calculateOutputShape)(y, w, d.dilations, d.pads, d.strides), A = (0, p.getGlsl)(r.session.backend.glContext.version), { activationFunction: P, applyActivation: v } = (0, c.getActivationSnippet)(d), R = `
  const ivec2 strides = ivec2(${d.strides[0]}, ${d.strides[1]});
  const ivec2 pads = ivec2(${d.pads[0]}, ${d.pads[1]});
  ${P}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;
    ivec2 xRCCorner = coords.zw * strides - pads;
    int group_id = output_channel / ${_};

    float value = 0.0;
    for (int wInChannel = 0; wInChannel < ${w[1]}; wInChannel++) {
      int input_channel = group_id * ${w[1]} + wInChannel;
      for (int wHeight = 0; wHeight < ${w[2]}; wHeight++) {
        int xHeight = xRCCorner.x + wHeight * ${d.dilations[0]};

        if (xHeight < 0 || xHeight >= ${y[2]}) {
          continue;
        }

        for (int wWidth = 0; wWidth < ${w[3]}; wWidth++) {
          int xWidth = xRCCorner.y + wWidth * ${d.dilations[1]};
          if (xWidth < 0 || xWidth >= ${y[3]}) {
            continue;
          }

          float xVal = getX(batch, input_channel, xWidth, xHeight);
          float wVal = getW(output_channel, wInChannel, wWidth, wHeight);
          value += xVal*wVal;
        }
      }
    }
    ${m}
    ${v}
    ${A.output} = vec4(value, .0, .0, .0);
  }
`;
            return Object.assign(Object.assign({}, l), { output: { dims: S, type: s[0].type, textureType: g.TextureType.unpacked }, shaderSource: R, hasMain: !0 });
          })(f, a, t, i) });
        };
      }, 1386: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.conv2DPacked = u.conv2DPackedPointwise = void 0;
        const h = b(8138), p = b(8555), g = b(708);
        u.conv2DPackedPointwise = (o, c, f) => {
          const a = c[0].dims, i = c[1].dims, t = (0, h.calculateOutputShape)(a, i, f.dilations, f.pads, f.strides), e = o.reshapePacked(c[0], [a[1], a[2] * a[3]]), n = o.reshapePacked(c[1], [i[0], i[1]]), r = c.length > 2 ? [n, e, c[2]] : [n, e], s = o.run((0, g.createPackedMatmulProgramInfoLoader)(o, r, f), r);
          return o.reshapePacked(s, t);
        }, u.conv2DPacked = (o, c, f) => {
          const a = c[0].dims, i = c[1].dims, t = (0, h.calculateOutputShape)(a, i, f.dilations, f.pads, f.strides), e = o.run((0, p.createPackedIm2ColProgramInfoLoader)(o, c[0], c[1], t, f), [c[0]]), n = o.reshapePacked(c[1], [i[0], i[1] * i[2] * i[3]]), r = c.length === 3 ? [n, e, c[2]] : [n, e], s = o.run((0, g.createPackedMatmulProgramInfoLoader)(o, r, f), r);
          return o.reshapePacked(s, t);
        };
      }, 9663: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseConvTransposeAttributes = u.convTranspose = void 0;
        const h = b(246), p = b(5060), g = b(2039), o = b(2823), c = (n, r, s, l, d, m) => (n - 1) * r + s + (l - 1) * d + 1 - m, f = (n, r, s, l, d) => {
          const m = Math.floor(n / 2);
          r === "SAME_UPPER" ? (s[l] = m, s[d] = n - m) : r === "SAME_LOWER" && (s[l] = n - m, s[d] = m);
        };
        u.convTranspose = (n, r, s) => (e(r, s), a(n, r, s));
        const a = (n, r, s) => {
          const l = t(s, r);
          return [i(n, r, l)];
        }, i = (n, r, s) => n.run(((l, d, m) => {
          const y = (w = d.length > 2, _ = m.cacheKey, { name: "ConvTranspose", inputNames: w ? ["X", "W", "B"] : ["X", "W"], inputTypes: w ? [g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked] : [g.TextureType.unpacked, g.TextureType.unpacked], cacheHint: _ });
          var w, _;
          return Object.assign(Object.assign({}, y), { get: () => ((S, A, P, v) => {
            const R = A.length > 2 ? "getB(output_channel)" : "0.0", B = A[0].dims, q = A[1].dims, D = q[1], O = q[0] / v.group, N = [A[0].dims[0], A[1].dims[1] * v.group, ...v.outputShape], E = (0, p.getGlsl)(S.session.backend.glContext.version), { activationFunction: M, applyActivation: Y } = (0, o.getActivationSnippet)(v), H = `
  const ivec2 strides = ivec2(${v.strides[0]}, ${v.strides[1]});
  const ivec2 pads = ivec2(${v.pads[0]}, ${v.pads[1]});
  ${M}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;

    ivec2 loc = coords.zw + pads;

    int group_id = output_channel / ${D};
    int wOutChannel = output_channel - group_id * ${D};

    float value = ${R};
    for (int inChannelOffset = 0; inChannelOffset < ${O}; inChannelOffset++) {
      int input_channel = group_id * ${O} + inChannelOffset;
      for (int wWOff = 0; wWOff < ${q[2]}; wWOff++) {
        for (int wHOff = 0; wHOff < ${q[3]}; wHOff++) {
          ivec2 wOff = ivec2(wWOff * ${v.dilations[0]}, wHOff * ${v.dilations[1]});
          ivec2 wLoc = loc - wOff;
          ivec2 wLocIn = wLoc / strides;
          if (
            wLocIn * strides == wLoc &&
            wLocIn.x >= 0 && wLocIn.x < ${B[2]} &&
            wLocIn.y >= 0 && wLocIn.y < ${B[3]}
          ) {
            float xVal = getX(batch, input_channel, wLocIn.y, wLocIn.x);
            float wVal = getW(input_channel, wOutChannel, wHOff, wWOff);
            value += xVal * wVal;
          }
        }
      }
    }
    ${Y}
    ${E.output} = vec4(value, .0, .0, .0);
  }
`;
            return Object.assign(Object.assign({}, P), { output: { dims: N, type: A[0].type, textureType: g.TextureType.unpacked }, shaderSource: H, hasMain: !0 });
          })(l, d, y, m) });
        })(n, r, s), r), t = (n, r) => {
          const s = n.kernelShape.slice();
          if (n.kernelShape.length === 0) for (let y = 2; y < r[1].dims.length; ++y) s.push(r[1].dims[y]);
          const l = n.pads.slice(), d = n.outputShape.slice();
          ((y, w, _, S, A, P, v, R) => {
            const B = y.length - 2, q = R.length === 0;
            for (let D = 0; D < B; ++D) {
              const O = q ? y[D + 2] * P[D] : R[D], N = c(y[D + 2], P[D], A[D], w[D], _[D], O);
              f(N, S, A, D, D + B), q && R.push(P[D] * (y[D + 2] - 1) + v[D] + (w[D] - 1) * _[D] + 1 - A[D] - A[D + B]);
            }
          })(r[0].dims, s, n.dilations, n.autoPad, l, n.strides, n.outputPadding, d);
          const m = Object.assign({}, n);
          return Object.assign(m, { kernelShape: s, pads: l, outputShape: d, cacheKey: n.cacheKey }), m;
        };
        u.parseConvTransposeAttributes = (n) => {
          const r = n.attributes, s = (0, o.parseInternalActivationAttributes)(r), l = r.getString("auto_pad", "NOTSET"), d = r.getInts("dilations", [1, 1]), m = r.getInt("group", 1), y = r.getInts("kernel_shape", []), w = r.getInts("output_padding", [0, 0]), _ = r.getInts("output_shape", []), S = r.getInts("pads", [0, 0, 0, 0]), A = r.getInts("strides", [1, 1]);
          return (0, h.createAttributeWithCacheKey)(Object.assign({ autoPad: l, dilations: d, group: m, kernelShape: y, outputPadding: w, outputShape: _, pads: S, strides: A }, s));
        };
        const e = (n, r) => {
          if (!n || n.length !== 2 && n.length !== 3) throw new Error("Conv requires 2 or 3 inputs");
          if (n[0].dims.length !== 4 || n[1].dims.length !== 4) throw new Error("currently only support 2-dimensional conv");
          if (n[0].dims[1] !== n[1].dims[0]) throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");
          const s = n[1].dims[1] * r.group;
          if (n.length === 3 && (n[2].dims.length !== 1 || n[2].dims[0] !== s)) throw new Error("invalid bias");
          const l = n[0].dims.length - 2;
          if (r.dilations.length !== l) throw new Error(`dilations should be ${l}D`);
          if (r.strides.length !== l) throw new Error(`strides should be ${l}D`);
          if (r.pads.length !== 2 * l) throw new Error(`pads should be ${2 * l}D`);
          if (r.outputPadding.length !== l) throw new Error(`output_padding should be ${l}D`);
          if (r.kernelShape.length !== 0 && r.kernelShape.length !== n[1].dims.length - 2) throw new Error("invalid kernel shape");
          if (r.outputShape.length !== 0 && r.outputShape.length !== n[0].dims.length - 2) throw new Error("invalid output shape");
          if (n[0].type !== "float32" || n[1].type !== "float32") throw new Error("ConvTranspose input(X,W) should be float tensor");
          if (n.length === 3 && n[2].type !== "float32") throw new Error("ConvTranspose input(bias) should be float tensor");
        };
      }, 8138: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseConvAttributes = u.conv = u.calculateOutputShape = void 0;
        const h = b(246), p = b(2517), g = b(4770), o = b(1386), c = b(9828), f = b(2823), a = b(3248), i = b(5623);
        u.calculateOutputShape = (l, d, m, y, w) => {
          const _ = l[0], S = l.slice(2), A = S.length, P = d[0], v = d.slice(2).map((B, q) => B + (B - 1) * (m[q] - 1)), R = S.map((B, q) => B + y[q] + y[q + A]).map((B, q) => Math.floor((B - v[q] + w[q]) / w[q]));
          return [_, P].concat(...R);
        }, u.conv = (l, d, m) => (s(d, m), t(l, d, m));
        const t = (l, d, m) => {
          const y = r(m, d), w = l.session.pack, _ = y.kernelShape[0] === 1 && y.kernelShape[1] === 1;
          return y.group > 1 ? [l.run((0, g.createUnpackedGroupedConvProgramInfoLoader)(l, d, y), d)] : _ && w ? [e(l, d, y)] : w && d[0].dims.length === 4 && d[0].dims[0] === 1 && !_ ? [(0, o.conv2DPacked)(l, d, y)] : [n(l, d, y)];
        }, e = (l, d, m) => {
          const y = d[0].dims, w = d[1].dims, _ = (0, u.calculateOutputShape)(y, w, m.dilations, m.pads, m.strides), S = l.reshapeUnpacked(d[0], [y[1], y[2] * y[3]]), A = l.reshapeUnpacked(d[1], [w[0], w[1]]), P = d.length > 2 ? [A, S, d[2]] : [A, S], v = l.run((0, i.createMatmulProgramInfoLoader)(P, m), P);
          return l.reshapeUnpacked(v, _);
        }, n = (l, d, m) => {
          const y = d[0].dims, w = d[1].dims, _ = (0, u.calculateOutputShape)(y, w, m.dilations, m.pads, m.strides), S = l.run((0, a.createIm2ColProgramInfoLoader)(l, d[0], d[1], _, m), [d[0]]), A = d.length === 3 ? [S, d[1], d[2]] : [S, d[1]];
          return l.run((0, c.createDotProductProgramInfoLoader)(l, d, _, m), A);
        }, r = (l, d) => {
          const m = l.kernelShape.slice();
          if (l.kernelShape.length === 0) for (let _ = 2; _ < d[1].dims.length; ++_) m.push(d[1].dims[_]);
          const y = l.pads.slice();
          p.PoolConvUtil.adjustPadsBasedOnAutoPad(d[0].dims, l.strides, l.dilations, m, y, l.autoPad);
          const w = Object.assign({}, l);
          return Object.assign(w, { kernelShape: m, pads: y, cacheKey: l.cacheKey }), w;
        };
        u.parseConvAttributes = (l) => {
          const d = l.attributes, m = (0, f.parseInternalActivationAttributes)(d), y = d.getString("auto_pad", "NOTSET"), w = d.getInts("dilations", [1, 1]), _ = d.getInt("group", 1), S = d.getInts("kernel_shape", []), A = d.getInts("pads", [0, 0, 0, 0]), P = d.getInts("strides", [1, 1]);
          return (0, h.createAttributeWithCacheKey)(Object.assign({ autoPad: y, dilations: w, group: _, kernelShape: S, pads: A, strides: P }, m));
        };
        const s = (l, d) => {
          if (!l || l.length !== 2 && l.length !== 3) throw new Error("Conv requires 2 or 3 inputs");
          if (l[0].dims.length !== 4 || l[1].dims.length !== 4) throw new Error("currently only support 2-dimensional conv");
          if (l[0].dims[1] !== l[1].dims[1] * d.group) throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");
          if (l.length === 3 && (l[2].dims.length !== 1 || l[1].dims[0] !== l[2].dims[0])) throw new Error("invalid bias");
          const m = l[0].dims.length - 2;
          if (d.dilations.length !== m) throw new Error(`dilations should be ${m}D`);
          if (d.strides.length !== m) throw new Error(`strides should be ${m}D`);
          if (d.pads.length !== 2 * m) throw new Error(`pads should be ${2 * m}D`);
          if (d.kernelShape.length !== 0 && d.kernelShape.length !== l[1].dims.length - 2) throw new Error("invalid kernel shape");
          if (l[0].type !== "float32" || l[1].type !== "float32") throw new Error("Conv input(X,W) should be float tensor");
          if (l.length === 3 && l[2].type !== "float32") throw new Error("Conv input(bias) should be float tensor");
        };
      }, 5193: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseDepthToSpaceAttributes = u.depthToSpace = void 0;
        const h = b(3738);
        u.depthToSpace = (g, o, c) => {
          p(o);
          const f = c.blocksize, a = f * f, i = c.mode === "DCR" ? [0, 3, 4, 1, 5, 2] : [0, 1, 4, 2, 5, 3], t = c.mode === "DCR" ? [o[0].dims[0], f, f, o[0].dims[1] / a, o[0].dims[2], o[0].dims[3]] : [o[0].dims[0], o[0].dims[1] / a, f, f, o[0].dims[2], o[0].dims[3]], e = g.reshapeUnpacked(o[0], t), n = { perm: i, cacheKey: `${i}` }, [r] = (0, h.transpose)(g, [e], n), s = [o[0].dims[0], o[0].dims[1] / a, o[0].dims[2] * f, o[0].dims[3] * f];
          return [g.reshapeUnpacked(r, s)];
        }, u.parseDepthToSpaceAttributes = (g) => {
          const o = g.attributes.getInt("blocksize");
          if (o < 1) throw new Error(`blocksize must be >= 1, but got : ${o} for DepthToSpace`);
          const c = g.attributes.getString("mode", "DCR");
          if (c !== "DCR" && c !== "CRD") throw new Error(`unrecognized mode: ${c} for DepthToSpace`);
          return { mode: c, blocksize: o };
        };
        const p = (g) => {
          if (g.length !== 1) throw new Error(`DepthToSpace expect 1 inputs, but got ${g.length}`);
          if (g[0].type === "string" || g[0].dims.length !== 4) throw new TypeError("DepthToSpace input should be a 4-D numeric tensor");
        };
      }, 9828: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createDotProductProgramInfoLoader = void 0;
        const h = b(2517), p = b(5060), g = b(2039), o = b(2823), c = b(3248);
        u.createDotProductProgramInfoLoader = (f, a, i, t) => {
          const e = ((n, r) => ({ name: "ConvDotProduct", inputNames: n ? ["Im2Col", "K", "B"] : ["Im2Col", "K"], inputTypes: n ? [g.TextureType.unpacked, g.TextureType.packedLastDimension, g.TextureType.unpacked] : [g.TextureType.unpacked, g.TextureType.packedLastDimension], cacheKey: r.activationCacheKey }))(a.length > 2, t);
          return Object.assign(Object.assign({}, e), { get: () => ((n, r, s, l, d) => {
            const m = s[0].dims, y = s[1].dims, w = [y[0], Math.ceil(m[1] * y[2] * y[3] / 4)], _ = (0, c.calculateIm2ColDims)(m, y, l), [S, A] = n.calculateTextureWidthAndHeight(w, g.TextureType.packedLastDimension), P = h.ShapeUtil.computeStrides(_), [v, R] = n.calculateTextureWidthAndHeight(_, g.TextureType.packedLastDimension), B = l.length, q = s.length < 3 ? "0.0" : "_B(b)", D = Math.ceil(m[1] * y[2] * y[3] / 4), { activationFunction: O, applyActivation: N } = (0, o.getActivationSnippet)(d), E = (0, p.getGlsl)(n.session.backend.glContext.version), M = `
${O}
float process(int indices[${B}]) {
  int b[1];
  b[0] = indices[1];
  int im2col[4];
  im2col[0] = indices[0];
  im2col[1] = indices[2];
  im2col[2] = indices[3];
  int im2colOffset = im2col[0] * ${P[0]} + im2col[1] * ${P[1]} + im2col[2] * ${P[2]};
  int kernelOffset = indices[1] * ${w[1]};
  float value = ${q};
  for (int i = 0; i < ${D}; ++i) {
    vec2 im2colCoords = offsetToCoords(im2colOffset, ${v}, ${R});
    vec2 kernelCoords = offsetToCoords(kernelOffset, ${S}, ${A});
    value += dot(${E.texture2D}(Im2Col, im2colCoords), ${E.texture2D}(K, kernelCoords));
    ++im2colOffset;
    ++kernelOffset;
  }
  ${N}
  return value;
}`;
            return Object.assign(Object.assign({}, r), { output: { dims: l, type: s[0].type, textureType: g.TextureType.unpacked }, shaderSource: M });
          })(f, e, a, i, t) });
        };
      }, 7992: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseFlattenAttributes = u.flatten = void 0;
        const h = b(2517);
        u.flatten = (g, o, c) => {
          p(o, c);
          const f = h.ShapeUtil.flattenShape(o[0].dims, c);
          return [g.reshapeUnpacked(o[0], f)];
        }, u.parseFlattenAttributes = (g) => g.attributes.getInt("axis", 1);
        const p = (g, o) => {
          if (!g || g.length !== 1) throw new Error("Flatten requires 1 input.");
          const c = g[0].dims.length;
          if (c === 0) throw new Error("scalar tensor is not supported.");
          if (o < -c || o > c) throw new Error("Invalid axis");
          if (g[0].type === "string") throw new Error("string tensor is not supported.");
        };
      }, 2823: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseInternalActivationAttributes = u.getActivationSnippet = void 0;
        const h = b(2517), p = b(4909);
        u.getActivationSnippet = function(g) {
          let o;
          switch (g.activation) {
            case "Relu":
              o = (0, p.glslRelu)();
              break;
            case "Sigmoid":
              o = (0, p.glslSigmoid)();
              break;
            case "Clip":
              o = (0, p.glslClip)(g.clipMin, g.clipMax);
              break;
            default:
              return { activationFunction: "", applyActivation: "" };
          }
          const c = o.name;
          return { activationFunction: o.body, applyActivation: `value = ${c}_(value);` };
        }, u.parseInternalActivationAttributes = (g) => {
          const o = g.getString("activation", "");
          if (o === "Clip") {
            const [c, f] = g.getFloats("activation_params", [h.MIN_CLIP, h.MAX_CLIP]);
            return { activation: o, clipMax: f, clipMin: c, activationCacheKey: `${o}:${c},${f}` };
          }
          return { activation: o, activationCacheKey: o };
        };
      }, 1253: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseGatherAttributes = u.gather = void 0;
        const h = b(246), p = b(782), g = b(2517), o = b(2039);
        u.gather = (i, t, e) => (a(t, e.axis), [i.run(f(i, t, e), t)]), u.parseGatherAttributes = (i) => (0, h.createAttributeWithCacheKey)({ axis: i.attributes.getInt("axis", 0) });
        const c = { name: "Gather", inputNames: ["A", "B"], inputTypes: [o.TextureType.unpacked, o.TextureType.unpacked] }, f = (i, t, e) => {
          const n = Object.assign(Object.assign({}, c), { cacheHint: e.cacheKey });
          return Object.assign(Object.assign({}, n), { get: () => ((r, s, l, d) => {
            const m = l[0].dims.slice(), y = l[1].dims.slice(), w = new Array(m.length + y.length - 1);
            d = g.ShapeUtil.normalizeAxis(d, m.length);
            const _ = [];
            for (let A = 0; A < w.length; A++) A < d ? (w[A] = m[A], _.push(`inputIdx[${A}] = outputIdx[${A}];`)) : A < d + y.length ? (w[A] = y[A - d], _.push(`indexDataIdx[${A - d}] = outputIdx[${A}];`)) : (w[A] = m[A - y.length + 1], _.push(`inputIdx[${A - y.length + 1}] = outputIdx[${A}];`));
            const S = `
      float process(int outputIdx[${w.length || 1}]) {
        int inputIdx[${m.length}];
        int indexDataIdx[${y.length || 1}];
        indexDataIdx[0] = 0;
        ${_.join(`
        `)}
        int idx = int(_B(indexDataIdx));
        inputIdx[${d}] = idx < 0 ? idx + ${m[d]} : idx;
        return _A(inputIdx);
      }`;
            return Object.assign(Object.assign({}, s), { output: { dims: w, type: l[0].type, textureType: o.TextureType.unpacked }, shaderSource: S });
          })(0, n, t, e.axis) });
        }, a = (i, t) => {
          if (!i || i.length !== 2) throw new Error("Gather requires 2 inputs.");
          const e = i[0].dims.length;
          if (e < 1) throw new Error("Invalid input shape.");
          if (t < -e || t > e - 1) throw new Error("Invalid axis.");
          if (p.NUMBER_TYPES.indexOf(i[0].type) === -1) throw new Error("Invaid input type.");
          if (i[1].type !== "int32" && i[1].type !== "int16") throw new Error("Invaid input type.");
        };
      }, 4776: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseGemmAttributesV11 = u.parseGemmAttributesV7 = u.gemm = void 0;
        const h = b(246), p = b(2517), g = b(2039);
        u.gemm = (i, t, e) => (a(t, e), [i.run(c(t, e), t)]);
        const o = (i, t) => {
          const e = i.attributes.getInt("transA", 0) !== 0, n = i.attributes.getInt("transB", 0) !== 0, r = i.attributes.getFloat("alpha", 1), s = i.attributes.getFloat("beta", 1);
          return (0, h.createAttributeWithCacheKey)({ transA: e, transB: n, alpha: r, beta: s, isOptionalC: t });
        };
        u.parseGemmAttributesV7 = (i) => o(i, !1), u.parseGemmAttributesV11 = (i) => o(i, !0);
        const c = (i, t) => {
          const e = { name: "Gemm", inputNames: i.length === 3 ? ["A", "B", "C"] : ["A", "B"], inputTypes: i.length === 3 ? [g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked] : [g.TextureType.unpacked, g.TextureType.unpacked], key: t.cacheKey };
          return Object.assign(Object.assign({}, e), { get: () => f(e, i, t) });
        }, f = (i, t, e) => {
          const n = t[0].dims.slice(), r = t[1].dims.slice(), [s, l] = p.GemmUtil.getShapeOfGemmResult(n, e.transA, r, e.transB, t.length === 3 ? t[2].dims : void 0), d = [s, l];
          if (!d) throw new Error("Can't use gemm on the given tensors");
          let m = n[n.length - 1], y = "";
          e.transA && (m = n[0]), e.transA && e.transB ? y = "value += _A_T(a) * _B_T(b);" : e.transA && !e.transB ? y = "value += _A_T(a) * _B(b);" : !e.transA && e.transB ? y = "value += _A(a) * _B_T(b);" : e.transA || e.transB || (y = "value += _A(a) * _B(b);");
          const w = d.length, _ = `
      float process(int indices[${w}]) {
          int a[${w}];
          int b[${w}];
          ${t.length === 3 ? `int c[${t[2].dims.length}];` : ""}

          copyVec(indices, a);
          copyVec(indices, b);
          ${t.length === 3 ? "bcastIndices_C(indices, c);" : ""}

          float value = 0.0;
          for (int k=0; k<${m}; ++k) {
              a[${w - 1}] = k;
              b[${w - 2}] = k;
              ${y}
          }

          value = value * alpha;
          ${t.length === 3 ? "value += beta * _C(c);" : ""}
          return value;
      }`;
          return Object.assign(Object.assign({}, i), { output: { dims: d, type: t[0].type, textureType: g.TextureType.unpacked }, variables: [{ name: "alpha", type: "float", data: e.alpha }, { name: "beta", type: "float", data: e.beta }], shaderSource: _ });
        }, a = (i, t) => {
          if (!i) throw new Error("Input is missing");
          if (t.isOptionalC && (i.length < 2 || i.length > 3)) throw new Error("Invaid input shape.");
          if (!t.isOptionalC && i.length !== 3) throw new Error("Gemm requires 3 inputs");
          if (i.length === 3 && i[2].dims.length !== 1 && i[2].dims.length !== 2) throw new Error("Invalid input shape of C");
          if (i[0].type !== "float32" && i[0].type !== "float64" || i[1].type !== "float32" && i[1].type !== "float64" || i.length === 3 && i[2].type !== "float32" && i[2].type !== "float64") throw new Error("Invalid input type.");
          if (i[0].type !== i[1].type || i.length === 3 && i[0].type !== i[2].type) throw new Error("Input types are mismatched");
        };
      }, 8555: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createPackedIm2ColProgramInfoLoader = void 0;
        const h = b(5060), p = b(2039), g = b(2827);
        u.createPackedIm2ColProgramInfoLoader = (o, c, f, a, i) => {
          const t = (e = i.cacheKey, { name: "Im2Col (packed)", inputNames: ["A"], inputTypes: [p.TextureType.packed], cacheHint: e });
          var e;
          return Object.assign(Object.assign({}, t), { get: () => ((n, r, s, l, d, m) => {
            const y = s.dims, w = l.dims, _ = d.length, S = [w[1] * w[2] * w[3], d[2] * d[3]], A = w[2] * w[3], P = (0, g.unpackFromChannel)(), v = (0, h.getGlsl)(n.session.backend.glContext.version);
            let R = "";
            for (let q = 0; q <= 1; q++) for (let D = 0; D <= 1; D++) R += `
            blockIndex = rc.x + ${D};
            pos = rc.y + ${q};

            if(blockIndex < ${S[1]} && pos < ${S[0]}) {
              offsetY = int(blockIndex / (${d[_ - 1]})) * ${m.strides[0]} -
                ${m.pads[0]};
              d0 = offsetY + ${m.dilations[0]} * (imod(pos, ${A}) / ${w[2]});

              if(d0 < ${y[2]} && d0 >= 0) {
                offsetX = imod(blockIndex, ${d[_ - 1]}) * ${m.strides[1]} -
                  ${m.pads[1]};
                d1 = offsetX + ${m.dilations[1]} * imod(imod(pos, ${A}), ${w[2]});

                if(d1 < ${y[3]} && d1 >= 0) {

                  ch = int(float(pos)/ ${A}.);
                    innerDims = vec2(d0, d1);
                    result[${2 * q + D}] = getChannel(
                      getA(0, ch, int(innerDims.x),
                      int(innerDims.y)), innerDims);
                }
              }
            }

          `;
            const B = `
      ${P}

      void main() {
        ivec2 rc = getOutputCoords();
          vec4 result = vec4(0.0);
          int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
          vec2 innerDims;
          ${R}
          ${v.output} = result;
      }
            `;
            return Object.assign(Object.assign({}, r), { output: { dims: S, type: s.type, textureType: p.TextureType.packed }, shaderSource: B, hasMain: !0 });
          })(o, t, c, f, a, i) });
        };
      }, 3248: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.calculateIm2ColDims = u.createIm2ColProgramInfoLoader = void 0;
        const h = b(2039);
        u.createIm2ColProgramInfoLoader = (p, g, o, c, f) => {
          const a = (i = f.cacheKey, { name: "Im2Col", inputNames: ["X"], inputTypes: [h.TextureType.unpacked], cacheHint: i });
          var i;
          return Object.assign(Object.assign({}, a), { get: () => ((t, e, n, r, s, l) => {
            const d = n.dims, m = r.dims, y = s.length, w = (0, u.calculateIm2ColDims)(d, m, s, 4), _ = `
        const int XC = ${d[1]};
        const int XH = ${d[2]};
        const int XW = ${d[3]};
        const int KH = ${l.kernelShape[0]};
        const int KW = ${l.kernelShape[1]};
        const int dilationH = ${l.dilations[0]};
        const int dilationW = ${l.dilations[1]};
        const int strideH = ${l.strides[0]};
        const int strideW = ${l.strides[1]};
        const int padH = ${l.pads[0]};
        const int padW = ${l.pads[1]};
        const int KHKW = KH*KW;
        const int XCKHKW = XC * KHKW;
        const int outputChannels = 4;
        vec4 process(int indices[${y}]) {
          int b  = indices[0]; // batch size
          int oh = indices[1] * strideH - padH; //output height
          int ow = indices[2] * strideW - padW; //output width
          int p = indices[3] * outputChannels; //patch
          vec4 value = vec4(0.0);
          for(int i=0; i < outputChannels; ++i) {
            if(p < XCKHKW) {
              int patchC = p / KHKW;
              int patchH = (p - patchC*KHKW) / KW;
              int patchW = (p - patchC*KHKW) - patchH * KW;
              int xh2 = oh + patchH * dilationH;
              int xw2 = ow + patchW * dilationW;
              int x[${d.length}];
              x[0] = b;
              x[1] = patchC;
              x[2] = xh2;
              x[3] = xw2;
              if(xh2 >= 0 &&
                  xh2 < XH &&
                  xw2 >= 0 &&
                  xw2 < XW) {
                value[i] = _X(x);
              }
            }
            ++p;
          }
          return value;
        }
        `;
            return Object.assign(Object.assign({}, e), { output: { dims: w, type: n.type, textureType: h.TextureType.packedLastDimension }, shaderSource: _ });
          })(0, a, g, o, c, f) });
        }, u.calculateIm2ColDims = (p, g, o, c = 4) => [o[0], o[2], o[3], Math.ceil(p[1] * g[2] * g[3] / c)];
      }, 6572: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseImageScalerAttributes = u.imageScaler = void 0;
        const h = b(246), p = b(2039);
        u.imageScaler = (a, i, t) => (f(i), [a.run(o(a, i, t), i)]), u.parseImageScalerAttributes = (a) => {
          const i = a.attributes.getFloat("scale"), t = a.attributes.getFloats("bias");
          return (0, h.createAttributeWithCacheKey)({ scale: i, bias: t });
        };
        const g = { name: "ImageScaler", inputNames: ["X"], inputTypes: [p.TextureType.unpacked] }, o = (a, i, t) => {
          const e = Object.assign(Object.assign({}, g), { cacheHint: t.cacheKey });
          return Object.assign(Object.assign({}, e), { get: () => ((n, r, s, l) => {
            const d = s[0].dims.slice(), m = d.length, y = `
      ${c(l.bias.length)}
      float process(int indices[${m}]) {
        return _X(indices) * scale + getBias(bias, indices[1]);
      }`;
            return Object.assign(Object.assign({}, r), { output: { dims: d, type: s[0].type, textureType: p.TextureType.unpacked }, variables: [{ name: "bias", type: "float", arrayLength: l.bias.length, data: l.bias }, { name: "scale", type: "float", data: l.scale }], shaderSource: y });
          })(0, e, i, t) });
        }, c = (a) => {
          const i = [`float getBias(float bias[${a}], int channel) {`];
          for (let t = 0; t < a; ++t) t === 0 ? i.push(`	if (channel == ${t}) { return bias[${t}]; }`) : t === a - 1 ? i.push(`	else { return bias[${t}]; }`) : i.push(`	else if (channel == ${t}) { return bias[${t}]; }`);
          return i.push("	}"), i.join(`
`);
        }, f = (a) => {
          if (!a || a.length !== 1) throw new Error("ImageScaler requires 1 input.");
          if (a[0].dims.length !== 4) throw new Error("Invalid input shape.");
          if (a[0].type !== "float32" && a[0].type !== "float64") throw new Error("Invalid input type.");
        };
      }, 3346: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseInstanceNormalizationAttributes = u.instanceNormalization = void 0;
        const h = b(5060), p = b(2039);
        u.instanceNormalization = (i, t, e) => {
          a(t);
          const n = i.run(o(t[0]), t);
          return [i.run(f(i, t[0], e, n.dims), [t[0], n, t[1], t[2]])];
        }, u.parseInstanceNormalizationAttributes = (i) => i.attributes.getFloat("epsilon", 1e-5);
        const g = { name: "InstanceNormalization_MeanAndVariance", inputNames: ["X"], inputTypes: [p.TextureType.unpacked] }, o = (i) => Object.assign(Object.assign({}, g), { get: () => ((t, e) => {
          const n = e.dims.slice(), r = n[1], s = n[2] * n[3], l = [n[0], r], d = `
      vec4 process(int[2] indices) {
        vec4 v = vec4(0.0);
        int a[4];
        a[0] = indices[0];
        a[1] = indices[1];
        float temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += x;
          }
        }
        float mean = temp / float(${s});
        temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += (x - mean) * (x - mean);
          }
        }
        v.r = mean;
        v.g = temp / float(${s});

        return v;
      }`;
          return Object.assign(Object.assign({}, t), { output: { dims: l, type: e.type, textureType: p.TextureType.packedLastDimension }, shaderSource: d });
        })(g, i) }), c = { name: "InstanceNormalization_ComputeOutput", inputNames: ["X", "MeanAndVariance", "Scale", "B"], inputTypes: [p.TextureType.unpacked, p.TextureType.packedLastDimension, p.TextureType.unpacked, p.TextureType.unpacked] }, f = (i, t, e, n) => {
          const r = Object.assign(Object.assign({}, c), { cacheHint: `${e}` });
          return Object.assign(Object.assign({}, r), { get: () => ((s, l, d, m, y) => {
            const w = (0, h.getGlsl)(s.session.backend.glContext.version), [_, S] = s.calculateTextureWidthAndHeight(y, p.TextureType.packedLastDimension), [A, P] = [_ / 4, S], v = `
      vec4 get_MeanAndVariance(int[2] mv) {
        int offset = indicesToOffset_MeanAndVariance(mv);
        vec2 coords = offsetToCoords(offset, ${A}, ${P});
        return ${w.texture2D}(MeanAndVariance, coords);
      }

      float process(int[4] indices) {
        int mv[2];
        mv[0] = indices[0];
        mv[1] = indices[1];
        vec4 mean_and_variance = get_MeanAndVariance(mv);
        float mean = mean_and_variance.r;
        float variance = mean_and_variance.g;

        int sb[1];
        sb[0] = indices[1];
        float scale = _Scale(sb);
        float b = _B(sb);

        return scale * (_X(indices) - mean) / sqrt(variance + epsilon) + b;
      }`;
            return Object.assign(Object.assign({}, l), { output: { dims: d.dims, type: d.type, textureType: p.TextureType.unpacked }, variables: [{ name: "epsilon", type: "float", data: m }], shaderSource: v });
          })(i, r, t, e, n) });
        }, a = (i) => {
          if (!i || i.length !== 3) throw new Error("InstanceNormalization requires 3 inputs.");
          const t = i[0], e = i[1], n = i[2];
          if (t.dims.length < 3 || e.dims.length !== 1 || n.dims.length !== 1) throw new Error("Invalid input shape.");
          if (e.dims[0] !== t.dims[1] || n.dims[0] !== t.dims[1]) throw new Error("Input shapes are mismatched.");
          if (t.type !== "float32" && t.type !== "float64" || e.type !== "float32" && e.type !== "float64" || n.type !== "float32" && n.type !== "float64") throw new Error("Invalid input type.");
          if (i[0].dims.length !== 4) throw new Error("Only support 4-D input shape.");
        };
      }, 708: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createPackedMatmulProgramInfoLoader = void 0;
        const h = b(2517), p = b(5060), g = b(2039), o = b(9390), c = b(2823), f = b(5623);
        u.createPackedMatmulProgramInfoLoader = (a, i, t) => {
          const e = (n = i.length > 2, r = t.activationCacheKey, { name: "MatMul (packed)", inputNames: n ? ["A", "B", "Bias"] : ["A", "B"], inputTypes: n ? [g.TextureType.packed, g.TextureType.packed, g.TextureType.packed] : [g.TextureType.packed, g.TextureType.packed], cacheHint: r });
          var n, r;
          return Object.assign(Object.assign({}, e), { get: () => ((s, l, d, m) => {
            const y = d.length > 2, w = y ? "value += getBiasForMatmul();" : "", _ = d[0].dims, S = d[1].dims, A = h.BroadcastUtil.calcShape(_, S, !0), P = !h.ShapeUtil.areEqual(d[0].dims, d[1].dims);
            if (!A) throw new Error("Can't use matmul on the given tensors");
            const v = _[_.length - 1], R = Math.ceil(v / 2), B = _.length, q = S.length, D = (0, p.getGlsl)(s.session.backend.glContext.version), O = (0, o.getCoordsDataType)(A.length), N = A.length, E = (0, o.getGlChannels)(), { activationFunction: M, applyActivation: Y } = (0, c.getActivationSnippet)(m), H = y ? `${(0, f.getBiasForMatmul)(O, E, d[2].dims, A, !0)}` : "", te = P ? `${function(ye, oe, be, me) {
              let Re = [], Ve = [];
              const de = be[0].dims, Ee = be[1].dims, Ie = de.length, $e = Ee.length, Fe = me.length, Be = Fe - Ie, ze = Fe - $e;
              Re = de.map((ke, Ge) => `coords.${oe[Ge + Be]}`), Re[Ie - 1] = "i*2", Re.join(", "), Ve = Ee.map((ke, Ge) => `coords.${oe[Ge + ze]}`), Ve[$e - 2] = "i*2", Ve.join(", ");
              const qe = h.BroadcastUtil.getBroadcastDims(de, me), Je = h.BroadcastUtil.getBroadcastDims(Ee, me), He = qe.map((ke) => `coords.${oe[ke + Be]} = 0;`).join(`
`), Ye = Je.map((ke) => `coords.${oe[ke + ze]} = 0;`).join(`
`), We = `int lastDim = coords.${oe[Fe - 1]};
  coords.${oe[Fe - 1]} = coords.${oe[Fe - 2]};
  coords.${oe[Fe - 2]} = lastDim;`;
              return `
vec4 getAAtOutCoordsMatmul(int i) {
  ${ye} coords = getOutputCoords();
  ${We}
  ${He}
  vec4 outputValue = getA(${Re});
  return outputValue;
}

vec4 getBAtOutCoordsMatmul(int i) {
  ${ye} coords = getOutputCoords();
  ${We}
  ${Ye}
  vec4 outputValue = getB(${Ve});
  return outputValue;
}`;
            }(O, E, d, A)}` : "", Z = P ? "getAAtOutCoordsMatmul(i)" : `getA(${function(ye, oe) {
              let be = "";
              for (let me = 0; me < oe - 2; me++) be += `rc.${ye[me]}, `;
              return be += `rc.${ye[oe - 2]}, i*2`, be;
            }(E, B)})`, ne = P ? "getBAtOutCoordsMatmul(i)" : `getB(${function(ye, oe) {
              let be = "";
              for (let me = 0; me < oe - 2; me++) be += `rc.${ye[me]}, `;
              return be += `i*2, rc.${ye[oe - 1]}`, be;
            }(E, q)})`, ue = `
            ${te}
            ${H}
            ${M}
            void main() {
              ${P ? "" : `${O} rc =
          getOutputCoords(); int lastDim = rc.${E[N - 1]}; rc.${E[N - 1]} =
          rc.${E[N - 2]}; rc.${E[N - 2]} = lastDim;
      `}

              vec4 value = vec4(0);
              for (int i = 0; i < ${R}; i++) {
                vec4 a = ${Z};
                vec4 b = ${ne};

                value += (a.rrbb * b.rgrg);
                value += (a.ggaa * b.baba);
              }
              ${w}
              ${Y}
              ${D.output} = value;
            }`;
            return Object.assign(Object.assign({}, l), { output: { dims: A, type: d[0].type, textureType: g.TextureType.packed }, shaderSource: ue, hasMain: !0 });
          })(a, e, i, t) });
        };
      }, 5623: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.getBiasForMatmul = u.createMatmulProgramInfoLoader = u.parseMatMulAttributes = u.matMul = void 0;
        const h = b(2517), p = b(2039), g = b(9390), o = b(2823), c = b(708);
        function f(t, e) {
          const n = (r = t.length > 2, s = e.activationCacheKey, { name: "MatMul", inputNames: r ? ["A", "B", "Bias"] : ["A", "B"], inputTypes: r ? [p.TextureType.unpacked, p.TextureType.unpacked, p.TextureType.unpacked] : [p.TextureType.unpacked, p.TextureType.unpacked], cacheHint: s });
          var r, s;
          return Object.assign(Object.assign({}, n), { get: () => function(l, d, m) {
            const y = d[0].dims, w = d[1].dims, _ = h.BroadcastUtil.calcShape(y, w, !0);
            if (!_) throw new Error("Can't use matmul on the given tensors");
            const S = (0, g.getCoordsDataType)(_.length), A = (0, g.getGlChannels)(), { activationFunction: P, applyActivation: v } = (0, o.getActivationSnippet)(m), R = d.length > 2, B = R ? "value += getBiasForMatmul();" : "", q = R ? `${i(S, A, d[2].dims, _, !1)}` : "", D = _.length, O = y.length, N = w.length, E = `
    ${P}
    ${q}
    float process(int indices[${D}]) {
        int a[${O}];
        int b[${N}];
        bcastMatmulIndices_A(indices, a);
        bcastMatmulIndices_B(indices, b);

        float value;
        for (int k=0; k<${y[y.length - 1]}; ++k) {
            a[${O - 1}] = k;
            b[${N - 2}] = k;
            value += _A(a) * _B(b);
        }
        ${B}
        ${v}
        return value;
    }`;
            return Object.assign(Object.assign({}, l), { output: { dims: _, type: d[0].type, textureType: p.TextureType.unpacked }, shaderSource: E });
          }(n, t, e) });
        }
        u.matMul = (t, e, n) => (a(e), t.session.pack ? [t.run((0, c.createPackedMatmulProgramInfoLoader)(t, e, n), e)] : [t.run(f(e, n), e)]), u.parseMatMulAttributes = (t) => (0, o.parseInternalActivationAttributes)(t.attributes), u.createMatmulProgramInfoLoader = f;
        const a = (t) => {
          if (!t || t.length !== 2) throw new Error("MatMul requires 2 inputs.");
          if (t[0].dims[t[0].dims.length - 1] !== t[1].dims[t[1].dims.length - 2]) throw new Error("shared dimension does not match.");
          if (t[0].type !== "float32" && t[0].type !== "float64" || t[1].type !== "float32" && t[1].type !== "float64") throw new Error("inputs should be float type");
          if (t[0].type !== t[1].type) throw new Error("inputs types should match");
        };
        function i(t, e, n, r, s) {
          let l = "";
          const d = n.length, m = r.length, y = m - d;
          l = m < 2 && d > 0 ? "coords" : n.map((S, A) => `coords.${e[A + y]}`).join(", ");
          const w = h.BroadcastUtil.getBroadcastDims(n, r).map((S) => `coords.${e[S + y]} = 0;`).join(`
`);
          let _ = "vec4(outputValue.xx, outputValue.yy)";
          return h.ShapeUtil.size(n) === 1 && (_ = "vec4(outputValue.x)"), s ? `
vec4 getBiasForMatmul() {
  ${t} coords = getOutputCoords();
  ${w}
  vec4 outputValue = getBias(${l});
  return ${_};
}` : `
float getBiasForMatmul() {
  ${t} coords = getOutputCoords();
  ${w}
  return getBias(coords.x);
}`;
        }
        u.getBiasForMatmul = i;
      }, 2403: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createPackProgramInfoLoader = void 0;
        const h = b(5060), p = b(2039), g = b(9390), o = b(2827), c = { name: "pack", inputNames: ["A"], inputTypes: [p.TextureType.unpackedReversed] };
        u.createPackProgramInfoLoader = (f, a) => Object.assign(Object.assign({}, c), { get: () => ((i, t) => {
          const e = (0, h.getGlsl)(i.session.backend.glContext.version), n = t.dims, r = n.length, s = t.dims.length, l = (0, g.getCoordsDataType)(s), d = (0, o.getChannels)("rc", s), m = (y = s, w = d, _ = n[n.length - 2], S = n[n.length - 1], y === 0 || y === 1 ? "" : `
    int r = ${w[y - 2]};
    int c = ${w[y - 1]};
    int rp1 = ${w[y - 2]} + 1;
    int cp1 = ${w[y - 1]} + 1;
    bool rEdge = rp1 >= ${S};
    bool cEdge = cp1 >= ${_};
    `);
          var y, w, _, S;
          let A;
          A = r === 0 ? [1, 1] : r === 1 ? [n[0], 1] : [n[s - 1], n[s - 2]];
          const P = function(B, q, D) {
            if (B === 0) return "false";
            if (B === 1) return `rc > ${q[0]}`;
            let O = "";
            for (let N = B - 2; N < B; N++) O += `${D[N]} >= ${q[N - B + 2]}`, N < B - 1 && (O += "||");
            return O;
          }(s, A, d), v = function(B, q) {
            const D = B.length;
            if (D === 0) return "getA(), 0, 0, 0";
            if (D === 1) return `getA(rc),
            rc + 1 >= ${B[0]} ? 0. : getA(rc + 1),
            0, 0`;
            let O = "";
            if (D > 2) for (let N = 0; N < D - 2; ++N) O += `${q[N]},`;
            return `getA(${O}r, c),
          rEdge ? 0. : getA(${O}rp1, c),
          cEdge ? 0. : getA(${O}r, cp1),
          rEdge || cEdge ? 0. : getA(${O}rp1, cp1)`;
          }(n, d), R = `
        void main() {
          ${l} rc = getOutputCoords();

          if(${P}) {
            ${e.output} = vec4(0);
          } else {
            ${m}

            ${e.output} = vec4(${v});
          }
        }
      `;
          return Object.assign(Object.assign({}, c), { hasMain: !0, output: { dims: t.dims, type: t.type, textureType: p.TextureType.packed }, shaderSource: R });
        })(f, a) });
      }, 2827: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.unpackFromChannel = u.getChannels = u.getVecChannels = void 0;
        const h = b(9390);
        function p(g, o) {
          return (0, h.getGlChannels)(o).map((c) => `${g}.${c}`);
        }
        u.getVecChannels = p, u.getChannels = function(g, o) {
          return o === 1 ? [g] : p(g, o);
        }, u.unpackFromChannel = function() {
          return `
    float getChannel(vec4 frag, int dim) {
      int modCoord = imod(dim, 2);
      return modCoord == 0 ? frag.r : frag.g;
    }

    float getChannel(vec4 frag, vec2 innerDims) {
      vec2 modCoord = mod(innerDims, 2.);
      return modCoord.x == 0. ?
        (modCoord.y == 0. ? frag.r : frag.g) :
        (modCoord.y == 0. ? frag.b : frag.a);
    }
  `;
        };
      }, 2870: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parsePadAttributesV11 = u.padV11 = u.parsePadAttributesV2 = u.padV2 = void 0;
        const h = b(246), p = b(2517), g = b(5060), o = b(2039), c = { name: "Pad", inputNames: ["A"], inputTypes: [o.TextureType.unpacked] };
        u.padV2 = (l, d, m) => (i(d), [l.run(Object.assign(Object.assign({}, c), { cacheHint: m.cacheKey, get: () => a(l, d[0], m) }), d)]), u.parsePadAttributesV2 = (l) => {
          const d = l.attributes.getString("mode", "constant"), m = l.attributes.getFloat("value", 0), y = l.attributes.getInts("pads");
          return (0, h.createAttributeWithCacheKey)({ mode: d, value: m, pads: y });
        }, u.padV11 = (l, d, m) => {
          t(d);
          const y = f(l, d, m);
          return (0, u.padV2)(l, [d[0]], y);
        }, u.parsePadAttributesV11 = (l) => l.attributes.getString("mode", "constant");
        const f = (l, d, m) => {
          if (!l.session.isInitializer(d[1].dataId) || d.length >= 3 && !l.session.isInitializer(d[2].dataId)) throw new Error("dynamic pad attributes are not allowed");
          const y = Array.from(d[1].integerData), w = d.length >= 3 ? d[2].floatData[0] : 0;
          return (0, h.createAttributeWithCacheKey)({ mode: m, pads: y, value: w });
        }, a = (l, d, m) => {
          const y = p.ShapeUtil.padShape(d.dims.slice(), m.pads), w = y.length, _ = `
      ${e(l, d, m)}
      float process(int[${w}] indices) {
          return padA(indices);
      }`;
          return { name: "Pad", inputNames: ["A"], inputTypes: [o.TextureType.unpacked], output: { dims: y, type: d.type, textureType: o.TextureType.unpacked }, shaderSource: _ };
        }, i = (l) => {
          if (!l || l.length !== 1) throw new Error("Pad requires 1 input");
          if (l[0].type !== "float32" && l[0].type !== "float64") throw new Error("Invalid input type.");
        }, t = (l) => {
          if (!l || l.length !== 2 && l.length !== 3) throw new Error("Pad requires 2 or 3 inputs");
          if (l[1].type !== "int32") throw new Error("Invalid input type.");
          if (l.length >= 3 && l[2].type === "string") throw new Error("Invalid input type.");
        }, e = (l, d, m) => {
          const y = (0, g.getGlsl)(l.session.backend.glContext.version), [w, _] = l.calculateTextureWidthAndHeight(d.dims, o.TextureType.unpacked), S = p.ShapeUtil.computeStrides(d.dims);
          switch (m.mode) {
            case "constant":
              return n(y, d.dims, S, w, _, m.pads, m.value);
            case "reflect":
              return r(y, d.dims, S, w, _, m.pads);
            case "edge":
              return s(y, d.dims, S, w, _, m.pads);
            default:
              throw new Error("Invalid mode");
          }
        }, n = (l, d, m, y, w, _, S) => {
          const A = d.length;
          let P = "";
          for (let v = A - 1; v >= 0; --v) P += `
        k = m[${v}] - ${_[v]};
        if (k < 0)  return constant;
        if (k >= ${d[v]}) return constant;
        offset += k * ${m[v]};
        `;
          return `
      float padA(int m[${A}]) {
        const float constant = float(${S});
        int offset = 0;
        int k = 0;
        ${P}
        vec2 coords = offsetToCoords(offset, ${y}, ${w});
        float value = getColorAsFloat(${l.texture2D}(A, coords));
        return value;
      }
      `;
        }, r = (l, d, m, y, w, _) => {
          const S = d.length;
          let A = "";
          for (let P = S - 1; P >= 0; --P) A += `
        k = m[${P}] - ${_[P]};
        if (k < 0) { k = -k; }
        {
          const int _2n_1 = ${2 * (d[P] - 1)};
          k = int( mod( float(k), float(_2n_1) ) ) ;
          if(k >= ${d[P]}) { k = _2n_1 - k; }
        }
        offset += k * ${m[P]};
        `;
          return `
      float padA(int m[${S}]) {
        int offset = 0;
        int k = 0;
        ${A}
        vec2 coords = offsetToCoords(offset, ${y}, ${w});
        float value = getColorAsFloat(${l.texture2D}(A, coords));
        return value;
      }
      `;
        }, s = (l, d, m, y, w, _) => {
          const S = d.length;
          let A = "";
          for (let P = S - 1; P >= 0; --P) A += `
        k = m[${P}] - ${_[P]};
        if (k < 0)  k = 0;
        if (k >= ${d[P]}) k = ${d[P] - 1};
        offset += k * ${m[P]};
      `;
          return `
      float padA(int m[${S}]) {
        int offset = 0;
        int k = 0;
        ${A}
        vec2 coords = offsetToCoords(offset, ${y}, ${w});
        float value = getColorAsFloat(${l.texture2D}(A, coords));
        return value;
      }
      `;
        };
      }, 2143: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.globalMaxPool = u.parseMaxPoolAttributes = u.maxPool = u.parseGlobalAveragePoolAttributes = u.globalAveragePool = u.parseAveragePoolAttributes = u.averagePool = void 0;
        const h = b(246), p = b(2517), g = b(2039);
        u.averagePool = (s, l, d) => {
          t(l);
          const m = { name: "AveragePool", inputNames: ["X"], inputTypes: [g.TextureType.unpacked], cacheHint: d.cacheKey };
          return [s.run(Object.assign(Object.assign({}, m), { get: () => o(l, m, !1, d) }), l)];
        }, u.parseAveragePoolAttributes = (s) => {
          const l = s.attributes.getString("auto_pad", "NOTSET"), d = s.attributes.getInt("ceil_mode", 0), m = s.attributes.getInt("count_include_pad", 0) !== 0, y = s.attributes.getInts("kernel_shape"), w = s.attributes.getInts("strides", []), _ = s.attributes.getInts("pads", []);
          if (d !== 0) throw new Error("using ceil() in shape computation is not yet supported for AveragePool");
          return (0, h.createAttributeWithCacheKey)({ autoPad: l, ceilMode: d, countIncludePad: m, kernelShape: y, strides: w, pads: _ });
        };
        const o = (s, l, d, m) => {
          const [y, w] = f(s, m, d), _ = p.ShapeUtil.size(y.kernelShape);
          let S = "";
          y.countIncludePad ? S += `value /= float(${_});` : S += `value /= float(${_} - pad);`;
          const A = `
        ${e(s[0].dims, y, "value += _X(x);", S, "0.0")}
      `;
          return Object.assign(Object.assign({}, l), { output: { dims: w, type: s[0].type, textureType: g.TextureType.unpacked }, shaderSource: A });
        };
        u.globalAveragePool = (s, l, d) => {
          t(l);
          const m = { name: "GlobalAveragePool", inputNames: ["X"], inputTypes: [g.TextureType.unpacked], cacheHint: `${d.countIncludePad}` };
          return [s.run(Object.assign(Object.assign({}, m), { get: () => o(l, m, !0, d) }), l)];
        }, u.parseGlobalAveragePoolAttributes = (s) => {
          const l = s.attributes.getInt("count_include_pad", 0) !== 0;
          return (0, h.createAttributeWithCacheKey)({ autoPad: "", ceilMode: 0, countIncludePad: l, kernelShape: [], strides: [], pads: [] });
        }, u.maxPool = (s, l, d) => {
          t(l);
          const m = { name: "MaxPool", inputNames: ["X"], inputTypes: [g.TextureType.unpacked], cacheHint: d.cacheKey };
          return [s.run(Object.assign(Object.assign({}, m), { get: () => c(l, m, !1, d) }), l)];
        }, u.parseMaxPoolAttributes = (s) => {
          const l = s.attributes.getString("auto_pad", "NOTSET"), d = s.attributes.getInt("ceil_mode", 0), m = s.attributes.getInts("kernel_shape"), y = s.attributes.getInts("strides", []), w = s.attributes.getInts("pads", []), _ = s.attributes.getInt("storage_order", 0), S = s.attributes.getInts("dilations", []);
          if (_ !== 0) throw new Error("column major storage order is not yet supported for MaxPool");
          if (d !== 0) throw new Error("using ceil() in shape computation is not yet supported for MaxPool");
          return (0, h.createAttributeWithCacheKey)({ autoPad: l, ceilMode: d, countIncludePad: !1, kernelShape: m, strides: y, pads: w, storageOrder: _, dilations: S });
        };
        const c = (s, l, d, m) => {
          const [y, w] = f(s, m, d), _ = `
      ${e(s[0].dims, y, `
      value = max(_X(x), value);
    `, "", "-1e5")}
    `;
          return Object.assign(Object.assign({}, l), { output: { dims: w, type: s[0].type, textureType: g.TextureType.unpacked }, shaderSource: _ });
        }, f = (s, l, d) => {
          const m = s[0].dims.slice(), y = Object.hasOwnProperty.call(l, "dilations"), w = l.kernelShape.slice(), _ = l.strides.slice(), S = y ? l.dilations.slice() : [], A = l.pads.slice();
          p.PoolConvUtil.adjustPoolAttributes(d, m, w, _, S, A);
          const P = p.PoolConvUtil.computePoolOutputShape(d, m, _, S, w, A, l.autoPad), v = Object.assign({}, l);
          return y ? Object.assign(v, { kernelShape: w, strides: _, pads: A, dilations: S, cacheKey: l.cacheKey }) : Object.assign(v, { kernelShape: w, strides: _, pads: A, cacheKey: l.cacheKey }), [v, P];
        }, a = { autoPad: "", ceilMode: 0, countIncludePad: !1, kernelShape: [], strides: [], pads: [], storageOrder: 0, dilations: [], cacheKey: "" }, i = { name: "GlobalMaxPool", inputNames: ["X"], inputTypes: [g.TextureType.unpacked] };
        u.globalMaxPool = (s, l) => (t(l), [s.run(Object.assign(Object.assign({}, i), { get: () => c(l, i, !0, a) }), l)]);
        const t = (s) => {
          if (!s || s.length !== 1) throw new Error("Pool ops requires 1 input.");
          if (s[0].type !== "float32" && s[0].type !== "float64") throw new Error("Invalid input type.");
        }, e = (s, l, d, m, y) => {
          const w = s.length;
          if (l.kernelShape.length <= 2) {
            const _ = l.kernelShape[l.kernelShape.length - 1], S = l.strides[l.strides.length - 1], A = l.pads[l.pads.length / 2 - 1], P = l.pads[l.pads.length - 1], v = s[w - 1];
            let R = "", B = "", q = "";
            if (R = A + P !== 0 ? `
          for (int i = 0; i < ${_}; i++) {
            x[${w} - 1] = indices[${w} - 1] * ${S} - ${A} + i;
            if (x[${w} - 1] < 0 || x[${w} - 1] >= ${v}) {
              pad++;
              continue;
            }
            ${d}
          }` : `
          for (int i = 0; i < ${_}; i++) {
            x[${w} - 1] = indices[${w} - 1] * ${S} - ${A} + i;
            ${d}
          }`, l.kernelShape.length === 2) {
              const D = l.kernelShape[l.kernelShape.length - 2], O = l.strides[l.strides.length - 2], N = l.pads[l.pads.length / 2 - 2], E = l.pads[l.pads.length - 2], M = s[w - 2];
              B = N + E !== 0 ? `
            for (int j = 0; j < ${D}; j++) {
              x[${w} - 2] = indices[${w} - 2] * ${O} - ${N} + j;
              if (x[${w} - 2] < 0 || x[${w} - 2] >= ${M}) {
                pad+= ${_};
                continue;
              }
          ` : `
            for (int j = 0; j < ${D}; j++) {
              x[${w} - 2] = indices[${w} - 2] * ${O} - ${N} + j;
            `, q = `
          }
        `;
            }
            return `
        float process(int indices[${w}]) {
          int x[${w}];
          copyVec(indices, x);

          float value = ${y};
          int pad = 0;
          ${B}
          ${R}
          ${q}
          ${m}
          return value;
        }
      `;
          }
          {
            const _ = p.ShapeUtil.size(l.kernelShape), S = p.ShapeUtil.computeStrides(l.kernelShape), A = S.length, P = l.pads.length, v = r(A), R = n(s, "inputDims"), B = n(l.pads, "pads"), q = n(S, "kernelStrides"), D = n(l.strides, "strides");
            let O = "";
            return O = l.pads.reduce((N, E) => N + E) ? `
            if (x[j] >= inputDims[j] || x[j] < 0) {
              pad++;
              isPad = true;
              break;
            }
          }
          if (!isPad) {
            ${d}
          }` : `
          }
          ${d}
        `, `
        ${v}
        float process(int indices[${w}]) {
          int x[${w}];
          copyVec(indices, x);
          int offset[${A}];
          int pads[${P}];
          int inputDims[${w}];
          int kernelStrides[${A}];
          int strides[${A}];
          ${B}
          ${R}
          ${D}
          ${q}

          float value = ${y};
          int pad = 0;
          bool isPad = false;
          for (int i = 0; i < ${_}; i++) {
            offsetToIndices(i, kernelStrides, offset);
            isPad = false;
            for (int j = ${w} - ${A}; j < ${w}; j++) {
              x[j] = indices[j] * strides[j - ${w} + ${A}]
                + offset[j - ${w} + ${A}] - pads[j - 2];
              ${O}
          }
          ${m}

          return value;
        }
      `;
          }
        }, n = (s, l) => {
          let d = "";
          for (let m = 0; m < s.length; m++) d += `
      ${l}[${m}] = ${s[m]};
    `;
          return d;
        }, r = (s) => `
  void offsetToIndices(int offset, int[${s}] strides, out int[${s}] indices) {
    if (${s} == 0) {
      return;
    }
    for (int i = 0; i < ${s} - 1; ++i) {
      indices[i] = offset / strides[i];
      offset -= indices[i] * strides[i];
    }
    indices[${s} - 1] = offset;
  }`;
      }, 4939: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.reduceLogSumSquare = u.reduceLogSum = u.reduceProd = u.reduceMin = u.reduceMax = u.reduceMean = u.reduceSum = u.parseReduceAttributes = void 0;
        const h = b(246), p = b(782), g = b(2517), o = b(2039), c = (i, t, e, n, r) => {
          a(t);
          const s = { name: n, inputNames: ["A"], inputTypes: [o.TextureType.unpacked] };
          return [i.run(Object.assign(Object.assign({}, s), { cacheHint: e.cacheKey, get: () => f(i, t, e, n, r, s) }), t)];
        };
        u.parseReduceAttributes = (i) => {
          const t = i.attributes.getInts("axes", []), e = i.attributes.getInt("keepdims", 1) === 1;
          return (0, h.createAttributeWithCacheKey)({ axes: t, keepDims: e });
        };
        const f = (i, t, e, n, r, s) => {
          const l = [], d = t[0].dims.length || 1, m = [], y = g.ShapeUtil.normalizeAxes(e.axes, t[0].dims.length), w = r(t, y);
          let _ = w[1];
          for (let A = 0; A < t[0].dims.length; A++) y.indexOf(A) >= 0 || y.length === 0 ? (e.keepDims && l.push(1), _ = `
          for(int j${A} = 0; j${A} < ${t[0].dims[A]}; j${A}++) {
            inputIdx[${A}] = j${A};
            ${_}
          }`) : (m.push(`inputIdx[${A}] = outputIdx[${l.length}];`), l.push(t[0].dims[A]));
          const S = `
      float process(int outputIdx[${l.length || 1}]) {
        float value;                 // final result
        int inputIdx[${d}];      // addressing input data
        ${m.join(`
`)}
        ${w[0]}       // init ops for reduce max/min
        ${_}
        ${w[2]}       // final computation for reduce mean
        return value;
      }`;
          return Object.assign(Object.assign({}, s), { output: { dims: l, type: t[0].type, textureType: o.TextureType.unpacked }, shaderSource: S });
        }, a = (i) => {
          if (!i || i.length !== 1) throw new Error("Reduce op requires 1 input.");
          if (p.NUMBER_TYPES.indexOf(i[0].type) === -1) throw new Error("Invalid input type.");
        };
        u.reduceSum = (i, t, e) => c(i, t, e, "ReduceSum", () => ["value = 0.0;", "value += _A(inputIdx);", ""]), u.reduceMean = (i, t, e) => c(i, t, e, "ReduceMean", (n, r) => {
          let s = 1;
          for (let l = 0; l < n[0].dims.length; l++) (r.indexOf(l) >= 0 || r.length === 0) && (s *= n[0].dims[l]);
          return ["value = 0.0;", "value += _A(inputIdx);", `value /= ${s}.;`];
        }), u.reduceMax = (i, t, e) => c(i, t, e, "ReduceMax", (n, r) => {
          const s = [];
          for (let l = 0; l < n[0].dims.length; l++) (r.indexOf(l) >= 0 || r.length === 0) && s.push(`inputIdx[${l}] = 0;`);
          return [`${s.join(`
`)}
value = _A(inputIdx);`, "value = max(value, _A(inputIdx));", ""];
        }), u.reduceMin = (i, t, e) => c(i, t, e, "ReduceMin", (n, r) => {
          const s = [];
          for (let l = 0; l < n[0].dims.length; l++) (r.indexOf(l) >= 0 || r.length === 0) && s.push(`inputIdx[${l}] = 0;`);
          return [`${s.join(`
`)}
value = _A(inputIdx);`, "value = min(value, _A(inputIdx));", ""];
        }), u.reduceProd = (i, t, e) => c(i, t, e, "ReduceProd", () => ["value = 1.0;", "value *= _A(inputIdx);", ""]), u.reduceLogSum = (i, t, e) => c(i, t, e, "ReduceLogSum", () => ["value = 0.0;", "value += _A(inputIdx);", "value = log(value);"]), u.reduceLogSumSquare = (i, t, e) => c(i, t, e, "ReduceLogSumSquare", () => ["float t; value = 0.0;", "t = _A(inputIdx); value += t * t;", ""]);
      }, 7019: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.isReshapeCheap = u.processDims3D = u.createPackedReshape3DProgramInfoLoader = void 0;
        const h = b(2517), p = b(5060), g = b(2039), o = b(2827);
        u.createPackedReshape3DProgramInfoLoader = (c, f, a) => {
          const i = ((t) => ({ name: "Reshape (packed)", inputTypes: [g.TextureType.packed], inputNames: ["A"], cacheHint: `${t}` }))(a);
          return Object.assign(Object.assign({}, i), { get: () => ((t, e, n, r) => {
            const s = e.dims, l = r;
            let d = "";
            for (let w = 0; w < 4; w++) {
              let _ = "";
              switch (w) {
                case 0:
                  _ = "outputCoords = rc;";
                  break;
                case 1:
                  _ = "outputCoords = ivec3(rc.x, rc.y+1, rc.z);";
                  break;
                case 2:
                  _ = "outputCoords = ivec3(rc.x, rc.y, rc.z+1);";
                  break;
                case 3:
                  _ = "outputCoords = ivec3(rc.x, rc.y+1, rc.z+1);";
                  break;
                default:
                  throw new Error();
              }
              d += `
        ${_}
        ${w > 0 ? "if(outputCoords.y < rows && outputCoords.z < cols){" : ""}
          int flattenedIndex = getFlattenedIndex(outputCoords);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flattenedIndex);
          vec2 innerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${w}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), innerDims);

        ${w > 0 ? "}" : ""}
      `;
            }
            const m = (0, p.getGlsl)(t.session.backend.glContext.version), y = `
      ${function(w) {
              const _ = h.ShapeUtil.computeStrides(w), S = ["b", "r", "c"], A = "index";
              return `
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${_.map((P, v) => `int ${S[v]} = ${A} / ${P}; ${v === _.length - 1 ? `int ${S[v + 1]} = ${A} - ${S[v]} * ${P}` : `index -= ${S[v]} * ${P}`};`).join("")}
      return ivec3(b, r, c);
    }
  `;
            }(s)}
      ${function(w) {
              const _ = h.ShapeUtil.computeStrides(w);
              return `
  int getFlattenedIndex(ivec3 coords) {
    // reverse y, z order
    return coords.x * ${_[0]} + coords.z * ${_[1]} + coords.y;
  }
`;
            }(l)}
      ${(0, o.unpackFromChannel)()}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.0);

        ivec3 outputCoords;
        int rows = ${l[2]};
        int cols = ${l[1]};

        ${d}
        ${m.output} = result;
      }
    `;
            return Object.assign(Object.assign({}, n), { output: { dims: l, type: e.type, textureType: g.TextureType.packed }, shaderSource: y, hasMain: !0 });
          })(c, f, i, a) });
        }, u.processDims3D = function(c) {
          if (c.length === 0) return [1, 1, 1];
          let f = 1;
          for (let a = 0; a < c.length - 2; ++a) f *= c[a];
          return [f, c.length > 1 ? c[c.length - 2] : 1, c[c.length - 1]];
        }, u.isReshapeCheap = function(c, f) {
          let a = !1;
          return a = c.length === 0 || f.length === 0 || (c.length < 2 || f.length < 2 ? c[c.length - 1] === f[f.length - 1] : c[c.length - 1] === f[f.length - 1] && c[c.length - 2] === f[f.length - 2]), a;
        };
      }, 718: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.reshape = void 0;
        const h = b(2517);
        u.reshape = (p, g) => {
          const o = h.ShapeUtil.calculateReshapedDims(g[0].dims, g[1].integerData);
          return p.session.pack ? [p.reshapePacked(g[0], o)] : [p.reshapeUnpacked(g[0], o)];
        };
      }, 2268: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseResizeAttributesV11 = u.parseResizeAttributesV10 = u.resize = void 0;
        const h = b(5060), p = b(2039), g = b(9390), o = b(2827), c = b(9793), f = { name: "Resize", inputNames: ["A"], inputTypes: [p.TextureType.packed] };
        u.resize = (n, r, s) => ((0, c.validateInputs)(r, s), [n.run(Object.assign(Object.assign({}, f), { cacheHint: s.cacheKey, get: () => a(n, r, s) }), r)]), u.parseResizeAttributesV10 = (n) => (0, c.parseUpsampleAttributes)(n, 10), u.parseResizeAttributesV11 = (n) => (0, c.parseUpsampleAttributes)(n, 11);
        const a = (n, r, s) => {
          const l = (0, h.getGlsl)(n.session.backend.glContext.version), [d, m] = i(r, s);
          if (d.every((O) => O === 1) && s.coordinateTransformMode !== "tf_crop_and_resize") return Object.assign(Object.assign({}, f), { output: { dims: m, type: r[0].type, textureType: p.TextureType.packed }, hasMain: !0, shaderSource: `void main() {
                    vec4 v = ${l.texture2D}(X, TexCoords);
                    ${l.output} = v;
                }` });
          const y = m.length;
          if (y < 2) throw new Error(`output dimension should be at least 2, but got ${y}`);
          const w = m[y - 2], _ = m[y - 1], S = r[0].dims;
          if (y !== S.length) throw new Error(`output dimension should match input ${S.length}, but got ${y}`);
          const A = S[y - 2], P = S[y - 1], v = d[y - 2], R = d[y - 1];
          let B = "";
          if (s.mode !== "linear") throw new Error(`resize (packed) does not support mode: '${s.mode}'`);
          switch (s.coordinateTransformMode) {
            case "asymmetric":
              B = `
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return vec4(coords) / scaleWHWH;
                    }
                `;
              break;
            case "half_pixel":
              B = `
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return (vec4(coords) + 0.5) / scaleWHWH - 0.5;
                    }
                `;
              break;
            case "pytorch_half_pixel":
              B = `
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 fcoords = vec4(coords);
                        return vec4(
                            ${_}.0 > 1.0 ? (fcoords.x + 0.5) / scaleWHWH.x - 0.5 : 0.0,
                            ${w}.0 > 1.0 ? (fcoords.y + 0.5) / scaleWHWH.y - 0.5 : 0.0,
                            ${_}.0 > 1.0 ? (fcoords.z + 0.5) / scaleWHWH.z - 0.5 : 0.0,
                            ${w}.0 > 1.0 ? (fcoords.w + 0.5) / scaleWHWH.w - 0.5 : 0.0
                          );
                    }
                `;
              break;
            case "align_corners":
              B = `
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 resized = vec4(${_}.0 - 1.0, ${w}.0 - 1.0, ${_}.0 - 1.0,
                            ${w}.0 - 1.0);
                        vec4 original = vec4(${P}.0 - 1.0, ${A}.0 - 1.0, ${P}.0 - 1.0,
                            ${A}.0 - 1.0);
                        vec4 new_scale = original / resized;
                        return vec4(coords) * new_scale;
                    }
                `;
              break;
            default:
              throw new Error(`resize (packed) does not support coordinateTransformMode:                                 '${s.coordinateTransformMode}'`);
          }
          const q = (0, g.getCoordsDataType)(y), D = `
            const vec2 inputWH = vec2(${A}.0, ${P}.0);
            const vec4 scaleWHWH = vec4(float(${v}), float(${R}), float(${v}), float(${R}));
            ${(0, o.unpackFromChannel)()}
            ${B}
            float getAValue(int x10, int r, int c, int d) {
                return getChannel(getA(x10, r, c, d), vec2(c, d));
            }
            void main() {
                ${q} rc = getOutputCoords();

                int batch = rc[0];
                int depth = rc[1];

                // retrieve the 4 coordinates that is used in the 4 packed output values.
                ivec4 coords = ivec4(rc.wz, rc.w + 1, rc.z + 1);

                // calculate the source index in fraction
                vec4 sourceFrac = getSourceFracIndex(coords);

                // get the lower and upper bound of the 4 values that will be packed into one texel.
                ivec4 x00 = ivec4(max(sourceFrac.xy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xy)));
                ivec4 x01 = ivec4(max(sourceFrac.xw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xw)));
                ivec4 x10 = ivec4(max(sourceFrac.zy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zy)));
                ivec4 x11 = ivec4(max(sourceFrac.zw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zw)));

                bool hasNextRow = rc.w < ${w - 1};
                bool hasNextCol = rc.z < ${_ - 1};

                // pack x00, x01, x10, x11's top-left corner into one vec4 structure
                vec4 topLeft = vec4(
                    getAValue(batch, depth, x00.x, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.y) : 0.0);

                // pack x00, x01, x10, x11's top-right corner into one vec4 structure
                vec4 topRight = vec4(
                    getAValue(batch, depth, x00.x, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.w) : 0.0);

                // pack x00, x01, x10, x11's bottom-left corner into one vec4 structure
                vec4 bottomLeft = vec4(
                    getAValue(batch, depth, x00.z, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.y) : 0.0);

                // pack x00, x01, x10, x11's bottom-right corner into one vec4 structure
                vec4 bottomRight = vec4(
                    getAValue(batch, depth, x00.z, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.w) : 0.0);

                // calculate the interpolation fraction on u and v direction
                vec4 frac = vec4(sourceFrac) - floor(sourceFrac);
                vec4 clampFrac = clamp(frac, vec4(0.0), vec4(1.0));

                vec4 top = mix(topLeft, topRight, clampFrac.ywyw);
                vec4 bottom = mix(bottomLeft, bottomRight, clampFrac.ywyw);
                vec4 newValue = mix(top, bottom, clampFrac.xxzz);

                ${l.output} = vec4(newValue);
            }
        `;
          return Object.assign(Object.assign({}, f), { output: { dims: m, type: r[0].type, textureType: p.TextureType.packed }, hasMain: !0, shaderSource: D });
        }, i = (n, r) => {
          const s = n[0].dims;
          let l, d = r.scales;
          if (d.length === 0) {
            const y = n[r.scalesInputIdx];
            if (y && y.size !== 0) {
              if (n[r.sizesInputIdx]) throw new Error("Only one of scales or sizes must be provided as input.");
              d = t(y, r.mode, r.isResize);
            } else {
              const w = n[r.sizesInputIdx];
              if (!w || w.size === 0) throw new Error("Either scales or sizes MUST be provided as input.");
              l = Array.from(w.integerData), d = e(l, s, r.mode, r.isResize);
            }
          } else if (n[r.sizesInputIdx]) throw new Error("Only one of scales or sizes must be provided as input.");
          const m = l || s.map((y, w) => Math.floor(y * d[w]));
          return [d, m];
        }, t = (n, r, s) => {
          const l = Array.from(n.floatData);
          return (0, c.scalesValidation)(l, r, s), l;
        }, e = (n, r, s, l) => {
          const d = r.length, m = new Array(d);
          for (let y = 0, w = d; y < w; y++) if (r[y] === 0) {
            if (n[y] !== 0) throw new Error("Input dim is zero but required output dim is non-zero.");
            m[y] = 1;
          } else m[y] = n[y] / r[y];
          return (0, c.scalesValidation)(m, s, l), m;
        };
      }, 8117: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.shape = void 0;
        const h = b(9162);
        u.shape = (g, o) => (p(o), [new h.Tensor([o[0].dims.length], "int32", void 0, void 0, new Int32Array(o[0].dims))]);
        const p = (g) => {
          if (!g || g.length !== 1) throw new Error("Shape requires 1 input.");
        };
      }, 2278: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.sliceV10 = u.parseSliceAttributes = u.slice = void 0;
        const h = b(246), p = b(782), g = b(2517), o = b(2039), c = { name: "Slice", inputNames: ["A"], inputTypes: [o.TextureType.unpacked] };
        u.slice = (e, n, r) => (a(n), [e.run(Object.assign(Object.assign({}, c), { cacheHint: r.cacheKey, get: () => f(e, n[0], r) }), n)]), u.parseSliceAttributes = (e) => {
          const n = e.attributes.getInts("starts"), r = e.attributes.getInts("ends"), s = e.attributes.getInts("axes", []);
          return (0, h.createAttributeWithCacheKey)({ starts: n, ends: r, axes: s });
        };
        const f = (e, n, r) => {
          const s = r.axes.length === 0 ? n.dims.slice(0).map((S, A) => A) : r.axes, l = g.ShapeUtil.normalizeAxes(s, n.dims.length), d = r.starts.map((S, A) => S > n.dims[l[A]] - 1 ? n.dims[l[A]] : g.ShapeUtil.normalizeAxis(S, n.dims[l[A]])), m = r.ends.map((S, A) => S > n.dims[l[A]] - 1 ? n.dims[l[A]] : g.ShapeUtil.normalizeAxis(S, n.dims[l[A]])), y = n.dims.slice(), w = [];
          for (let S = 0; S < l.length; S++) y[l[S]] = m[S] - d[S], d[S] > 0 && w.push(`outputIdx[${l[S]}] += ${d[S]};`);
          const _ = `
      float process(int outputIdx[${y.length}]) {
        ${w.join(`
      `)}
        return _A(outputIdx);
      }`;
          return Object.assign(Object.assign({}, c), { output: { dims: y, type: n.type, textureType: o.TextureType.unpacked }, shaderSource: _ });
        }, a = (e) => {
          if (!e || e.length !== 1) throw new Error("Slice requires 1 input.");
          if (p.NUMBER_TYPES.indexOf(e[0].type) === -1) throw new Error("Invalid input type.");
        };
        u.sliceV10 = (e, n) => {
          t(n);
          const r = i(e, n);
          return [e.run(Object.assign(Object.assign({}, c), { cacheHint: r.cacheKey, get: () => f(e, n[0], r) }), [n[0]])];
        };
        const i = (e, n) => {
          if (!e.session.isInitializer(n[1].dataId) || !e.session.isInitializer(n[2].dataId) || n.length >= 4 && !e.session.isInitializer(n[3].dataId) || n.length >= 5 && !e.session.isInitializer(n[4].dataId)) throw new Error("dynamic slice attributes are not allowed");
          if (n.length >= 5 && n[4].integerData.some((d) => d !== 1)) throw new Error("currently non-1 steps is not supported for Slice");
          const r = Array.from(n[1].integerData), s = Array.from(n[2].integerData), l = n.length >= 4 ? Array.from(n[3].integerData) : [];
          return { starts: r, ends: s, axes: l, cacheKey: `${l};${r};${s}` };
        }, t = (e) => {
          if (!e || e.length < 3 || e.length > 5) throw new Error("Invalid input number.");
          if (e[1].type !== "int32" || e[1].dims.length !== 1) throw new Error("Invalid input type.");
          if (e[2].type !== "int32" || e[2].dims.length !== 1) throw new Error("Invalid input type.");
          if (e.length >= 4 && (e[3].type !== "int32" || e[3].dims.length !== 1)) throw new Error("Invalid input type.");
          if (e.length >= 5 && (e[4].type !== "int32" || e[4].dims.length !== 1)) throw new Error("Invalid input type.");
        };
      }, 5524: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.softmaxV13 = u.parseSoftmaxAttributesV13 = u.parseSoftmaxAttributes = u.softmax = void 0;
        const h = b(246), p = b(2517), g = b(5060), o = b(2039), c = b(3738), f = { name: "SoftmaxComputeMax", inputNames: ["A"], inputTypes: [o.TextureType.unpacked] }, a = { name: "SoftmaxComputeScale", inputNames: ["A", "Max"], inputTypes: [o.TextureType.unpacked, o.TextureType.unpacked] }, i = { name: "SoftMax", inputNames: ["A", "Max", "Norm"], inputTypes: [o.TextureType.unpacked, o.TextureType.unpacked, o.TextureType.unpacked] };
        u.softmax = (l, d, m) => {
          s(d);
          const y = d[0].dims.slice(), w = p.ShapeUtil.normalizeAxis(m.axis, y.length), _ = p.ShapeUtil.sizeToDimension(y, w), S = p.ShapeUtil.sizeFromDimension(y, w);
          return t(l, d, m, _, S);
        }, u.parseSoftmaxAttributes = (l) => (0, h.createAttributeWithCacheKey)({ axis: l.attributes.getInt("axis", 1) }), u.parseSoftmaxAttributesV13 = (l) => (0, h.createAttributeWithCacheKey)({ axis: l.attributes.getInt("axis", -1) }), u.softmaxV13 = (l, d, m) => {
          s(d);
          const y = d[0].dims.slice(), w = p.ShapeUtil.normalizeAxis(m.axis, y.length), _ = y.length, S = w !== _ - 1, A = [];
          let P, v = [], R = [];
          S && (v = Array.from({ length: _ }).map((O, N) => N), v[w] = _ - 1, v[_ - 1] = w, v.map((O) => A.push(y[O])), P = (0, h.createAttributeWithCacheKey)({ perm: v }), R = (0, c.transpose)(l, d, P));
          const B = S ? p.ShapeUtil.sizeToDimension(A, _ - 1) : p.ShapeUtil.sizeToDimension(y, _ - 1), q = S ? p.ShapeUtil.sizeFromDimension(A, _ - 1) : p.ShapeUtil.sizeFromDimension(y, _ - 1), D = t(l, S ? R : d, m, B, q);
          return S ? (0, c.transpose)(l, D, P) : D;
        };
        const t = (l, d, m, y, w) => {
          const _ = e(l, d[0], y, w, [y]), S = l.run(Object.assign(Object.assign({}, f), { cacheHint: m.cacheKey, get: () => _ }), d), A = n(l, d[0], y, w, _.output.dims, [y]), P = l.run(Object.assign(Object.assign({}, a), { cacheHint: m.cacheKey, get: () => A }), [d[0], S]), v = r(l, d[0], y, w, _.output.dims, A.output.dims);
          return [l.run(Object.assign(Object.assign({}, i), { cacheHint: m.cacheKey, get: () => v }), [d[0], S, P])];
        }, e = (l, d, m, y, w) => {
          const [_, S] = l.calculateTextureWidthAndHeight(d.dims, o.TextureType.unpacked), A = w.length;
          if (m < 1 || y < 1) throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
          if (w.length !== 1) throw new Error("Dimensionality of the output should be 1");
          if (w[0] !== m) throw new Error("Shape of the output should be equal to logical row count");
          const P = (0, g.getGlsl)(l.session.backend.glContext.version), v = `
      float process(int[${A}] indices) {
        int logical_row_start_offset = indices[0] * ${y};

        float max = getColorAsFloat(${P.texture2D}(A, offsetToCoords(logical_row_start_offset, ${_},
        ${S} )));
        for(int i=1; i<${y}; ++i)
        {
          float current = getColorAsFloat(${P.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${_}, ${S})));
          if(current > max)
          max = current;
        }

        return max;
      }`;
          return Object.assign(Object.assign({}, f), { output: { dims: w, type: d.type, textureType: o.TextureType.unpacked }, shaderSource: v });
        }, n = (l, d, m, y, w, _) => {
          const [S, A] = l.calculateTextureWidthAndHeight(d.dims, o.TextureType.unpacked), P = _.length;
          if (m < 1 || y < 1) throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
          if (_.length !== 1) throw new Error("Dimensionality of the output should be 1");
          if (_[0] !== m) throw new Error("Shape of the output should be equal to logical row count");
          if (w.length !== 1) throw new Error("Dimensionality of the intermediate results should be 1");
          if (w[0] !== m) throw new Error("Shape of the intermediate results should be equal to logical row count");
          const v = `
      float process(int[${P}] indices) {
        int logical_row_start_offset = indices[0] * ${y};

        float norm_factor = 0.0;
        float max = _Max(indices);
        for(int i=0; i<${y}; ++i)
        {
          norm_factor += exp(getColorAsFloat(${(0, g.getGlsl)(l.session.backend.glContext.version).texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${S}, ${A}))) - max);
        }

        return norm_factor;
      }`;
          return Object.assign(Object.assign({}, a), { output: { dims: _, type: d.type, textureType: o.TextureType.unpacked }, shaderSource: v });
        }, r = (l, d, m, y, w, _) => {
          const [S, A] = l.calculateTextureWidthAndHeight(d.dims, o.TextureType.unpacked), P = d.dims.length;
          if (m < 1 || y < 1) throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
          if (w.length !== 1 || _.length !== 1) throw new Error("Dimensionality of the intermediate results should be 1");
          if (w[0] !== m || _[0] !== m) throw new Error("Shape of the intermediate results should be equal to logical row count");
          const v = `
      float process(int[${P}] indices) {

      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)
      int offset = coordsToOffset(TexCoords, ${S}, ${A});

      //determine the logical row for this index
      int logical_row_index[1];
      logical_row_index[0] = offset / ${y};

      float norm_factor = _Norm(logical_row_index);

      // avoid possible division by 0
      // if norm_facor is 0, all elements are zero
      // if so, return 0
      if(norm_factor == 0.0)
        return 0.0;

      return exp(_A(indices) - _Max(logical_row_index)) / norm_factor;
    }`;
          return Object.assign(Object.assign({}, i), { output: { dims: d.dims, type: d.type, textureType: o.TextureType.unpacked }, shaderSource: v });
        }, s = (l) => {
          if (!l || l.length !== 1) throw new Error("Softmax requires 1 input.");
          if (l[0].type !== "float32" && l[0].type !== "float64") throw new Error("Invalid input type");
        };
      }, 5975: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseSplitAttributes = u.split = void 0;
        const h = b(246), p = b(2517), g = b(2039), o = { name: "Split", inputNames: ["A"], inputTypes: [g.TextureType.unpacked] };
        u.split = (i, t, e) => {
          a(t);
          const n = p.ShapeUtil.normalizeAxis(e.axis, t[0].dims.length), r = c(i, t, n, e), s = [];
          for (let l = 0; l < r; ++l) s.push(i.run(Object.assign(Object.assign({}, o), { cacheHint: `${e.cacheKey};${l}`, get: () => f(i, t[0], e, n, l) }), t));
          return s;
        }, u.parseSplitAttributes = (i) => {
          const t = i.attributes.getInt("axis", 0), e = i.attributes.getInts("split", []), n = i.outputs.length;
          return (0, h.createAttributeWithCacheKey)({ axis: t, split: e, numOutputs: n });
        };
        const c = (i, t, e, n) => {
          const [, r] = p.SplitUtil.splitShape(t[0].dims, e, n.split, n.numOutputs);
          return r.length;
        }, f = (i, t, e, n, r) => {
          const [s, l] = p.SplitUtil.splitShape(t.dims, n, e.split, e.numOutputs), d = l[r], m = s[r], y = `
      float process(int indices[${m.length}]) {
        indices[${n}] += ${d};
        return _A(indices);
      }
    `;
          return Object.assign(Object.assign({}, o), { cacheHint: `${e.cacheKey}:${r}`, output: { dims: m, type: t.type, textureType: g.TextureType.unpacked }, shaderSource: y });
        }, a = (i) => {
          if (!i || i.length !== 1) throw new Error("Split requires one input.");
          if (i[0].type !== "int8" && i[0].type !== "uint8" && i[0].type !== "int16" && i[0].type !== "uint16" && i[0].type !== "int32" && i[0].type !== "uint32" && i[0].type !== "float32" && i[0].type !== "float64" && i[0].type !== "bool") throw new Error("Invalid input type.");
        };
      }, 3933: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseSqueezeAttributes = u.squeezeV13 = u.squeeze = void 0;
        const h = b(2517);
        u.squeeze = (o, c, f) => {
          p(c);
          const a = h.ShapeUtil.squeezeShape(c[0].dims, f);
          return [o.reshapeUnpacked(c[0], a)];
        }, u.squeezeV13 = (o, c) => (g(c), (0, u.squeeze)(o, [c[0]], Array.from(c[1].integerData))), u.parseSqueezeAttributes = (o) => o.attributes.getInts("axes");
        const p = (o) => {
          if (!o || o.length !== 1) throw new Error("Squeeze requires 1 input.");
          if (o[0].type === "string") throw new Error("invalid input tensor types.");
        }, g = (o) => {
          if (!o || o.length !== 2) throw new Error("Squeeze requires 2 inputs.");
          if (o[1].type !== "int32") throw new Error("Invalid input type.");
        };
      }, 6558: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.sum = void 0;
        const h = b(5060), p = b(2039);
        u.sum = (c, f) => {
          o(f);
          const a = { name: "Sum", inputNames: f.map((i, t) => `X${t}`), inputTypes: new Array(f.length).fill(p.TextureType.unpacked) };
          return [c.run(Object.assign(Object.assign({}, a), { get: () => g(c, f, a) }), f)];
        };
        const g = (c, f, a) => {
          const i = (0, h.getGlsl)(c.session.backend.glContext.version), t = f[0].dims.slice(), e = `
      void main() {
        vec4 result = ${f.map((n, r) => `${i.texture2D}(X${r},TexCoords)`).join(" + ")};
        ${i.output} = result;
      }
    `;
          return Object.assign(Object.assign({}, a), { output: { dims: t, type: f[0].type, textureType: p.TextureType.unpacked }, hasMain: !0, shaderSource: e });
        }, o = (c) => {
          if (!c || c.length === 0) throw new Error("Sum requires inputs.");
          const f = c[0].dims.length;
          for (let a = 1; a < c.length; a++) {
            if (f !== c[a].dims.length) throw new Error("Input shapes are mismatched.");
            for (let i = 0; i < f; i++) if (c[0].dims[i] !== c[a].dims[i]) throw new Error("Input shapes are not matched.");
          }
          if (c[0].type !== "float32" && c[0].type !== "float64") throw new Error("Invalid input type.");
          for (let a = 1; a < c.length; a++) if (c[0].type !== c[a].type) throw new Error("Input types are not matched.");
        };
      }, 5723: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.tile = void 0;
        const h = b(782), p = b(2039);
        u.tile = (c, f) => {
          o(f);
          const a = { name: "Tile", inputNames: ["A"], inputTypes: [p.TextureType.unpacked] };
          return [c.run(Object.assign(Object.assign({}, a), { get: () => g(c, f, a) }), f)];
        };
        const g = (c, f, a) => {
          const i = f[0].dims.slice(), t = new Array(i.length), e = [];
          for (let s = 0; s < i.length; s++) t[s] = i[s] * f[1].numberData[s], e.push(`inputIdx[${s}] = int(mod(float(outputIdx[${s}]), ${i[s]}.));`);
          const n = t.length, r = `
      float process(int outputIdx[${n}]) {
        int inputIdx[${n}];
        ${e.join(`
`)}
        return _A(inputIdx);
      }
    `;
          return Object.assign(Object.assign({}, a), { output: { dims: t, type: f[0].type, textureType: p.TextureType.unpacked }, shaderSource: r });
        }, o = (c) => {
          if (!c || c.length !== 2) throw new Error("Tile requires 2 input.");
          if (c[1].dims.length !== 1) throw new Error("The second input shape must 1 dimension.");
          if (c[1].dims[0] !== c[0].dims.length) throw new Error("Invalid input shape.");
          if (h.NUMBER_TYPES.indexOf(c[0].type) === -1) throw new Error("Invalid input type.");
          if (c[1].type !== "int32" && c[1].type !== "int16") throw new Error("Invalid repeat type.");
        };
      }, 3738: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseTransposeAttributes = u.transpose = void 0;
        const h = b(246), p = b(2517), g = b(2039), o = { name: "Transpose", inputNames: ["A"], inputTypes: [g.TextureType.unpacked] };
        u.transpose = (e, n, r) => (t(n), [e.run(Object.assign(Object.assign({}, o), { cacheHint: r.cacheKey, get: () => c(e, n[0], r.perm) }), n)]), u.parseTransposeAttributes = (e) => (0, h.createAttributeWithCacheKey)({ perm: e.attributes.getInts("perm", []) });
        const c = (e, n, r) => {
          const s = n.dims;
          r = f(s, r);
          const l = a(s, r), d = s.length, m = `
      ${i("perm", r, d)}
      float process(int indices[${d}]) {
        int a[${d}];
        perm(a, indices);
        return _A(a);
      }`;
          return Object.assign(Object.assign({}, o), { output: { dims: l, type: n.type, textureType: g.TextureType.unpacked }, shaderSource: m });
        }, f = (e, n) => (n && n.length !== e.length && (n = [...e.keys()].reverse()), n), a = (e, n) => (n = f(e, n), p.ShapeUtil.sortBasedOnPerm(e, n)), i = (e, n, r) => {
          const s = [];
          s.push(`void ${e}(out int a[${r}], int src[${r}]) {`);
          for (let l = 0; l < r; ++l) s.push(`	a[${n[l]}]=src[${l}];`);
          return s.push("	}"), s.join(`
`);
        }, t = (e) => {
          if (!e || e.length !== 1) throw new Error("Transpose requires 1 input.");
          if (e[0].type !== "float32" && e[0].type !== "float64") throw new Error("input should be float tensor");
        };
      }, 8710: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.encodeAsUint8 = void 0;
        const h = b(5060), p = b(2039);
        u.encodeAsUint8 = (g, o) => {
          const c = o.shape, f = (0, h.getGlsl)(g.session.backend.glContext.version), a = `
    const float FLOAT_MAX = 1.70141184e38;
    const float FLOAT_MIN = 1.17549435e-38;

    bool isNaN(float val) {
      return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;
    }

    highp vec4 encodeAsUint8(highp float v) {
      if (isNaN(v)) {
        return vec4(255, 255, 255, 255);
      }

      highp float av = abs(v);

      if(av < FLOAT_MIN) {
        return vec4(0.0, 0.0, 0.0, 0.0);
      } else if(v > FLOAT_MAX) {
        return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
      } else if(v < -FLOAT_MAX) {
        return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
      }

      highp vec4 c = vec4(0,0,0,0);

      highp float e = floor(log2(av));
      highp float m = exp2(fract(log2(av))) - 1.0;

      c[2] = floor(128.0 * m);
      m -= c[2] / 128.0;
      c[1] = floor(32768.0 * m);
      m -= c[1] / 32768.0;
      c[0] = floor(8388608.0 * m);

      highp float ebias = e + 127.0;
      c[3] = floor(ebias / 2.0);
      ebias -= c[3] * 2.0;
      c[2] += floor(ebias) * 128.0;

      c[3] += 128.0 * step(0.0, -v);

      return c / 255.0;
    }

    void main() {
      float value = ${f.texture2D}(X,TexCoords).r;
      ${f.output} = encodeAsUint8(value);
    }`, i = { name: "Uint8Encode", inputTypes: [p.TextureType.unpacked], inputNames: ["X"], output: { dims: c, type: o.tensor.type, textureType: p.TextureType.downloadUint8AsFloat }, shaderSource: a, hasMain: !0 };
          return g.executeProgram(i, [o.tensor]);
        };
      }, 4909: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.tanh = u.tan = u.sqrt = u.sin = u.sigmoid = u.relu = u.not = u.neg = u.log = u.parseLeakyReluAttributes = u.leakyRelu = u.identity = u.floor = u.exp = u.parseEluAttributes = u.elu = u.cos = u.ceil = u.clipV11 = u.parseClipAttributes = u.clip = u.atan = u.asin = u.acos = u.abs = u.glslTanh = u.glslTan = u.glslSqrt = u.glslSigmoid = u.glslRelu = u.glslSin = u.glslNot = u.glslNeg = u.glslLog = u.glslLeakyRelu = u.glslIdentity = u.glslClip = u.glslFloor = u.glslExp = u.glslElu = u.glslCos = u.glslCeil = u.glslAtan = u.glslAsin = u.glslAcos = u.glslAbs = void 0;
        const h = b(246), p = b(2517), g = b(8520), o = b(5060), c = b(2039);
        function f() {
          return D("abs");
        }
        function a() {
          return D("acos");
        }
        function i() {
          return D("asin");
        }
        function t() {
          return D("atan");
        }
        function e() {
          return D("ceil");
        }
        function n() {
          return D("cos");
        }
        function r(E) {
          const M = "elu";
          return { body: `
  const float alpha = float(${E});

  float ${M}_(float a) {
    return a >= 0.0 ? a: (exp(a) - 1.0) * alpha;
  }
  vec4 ${M}_(vec4 v) {
    return vec4(${M}_(v.x), ${M}_(v.y), ${M}_(v.z), ${M}_(v.w));
  }
  `, name: M, type: g.FunctionType.ValueBased };
        }
        function s() {
          return D("exp");
        }
        function l() {
          return D("floor");
        }
        function d(E, M) {
          const Y = "clip";
          return { body: `
  const float min = float(${E});
  const float max = float(${M});

  float ${Y}_(float a) {
    return clamp(a, min, max);
  }
  vec4 ${Y}_(vec4 v) {
    return clamp(v, min, max);
  }
  `, name: Y, type: g.FunctionType.ValueBased };
        }
        function m() {
          const E = "indentity";
          return { body: `
  float ${E}_(float a) {
    return a;
  }
  vec4 ${E}_(vec4 v) {
    return v;
  }
  `, name: E, type: g.FunctionType.ValueBased };
        }
        function y(E) {
          const M = "leakyRelu";
          return { body: `
  const float alpha = float(${E});

  float ${M}_(float a) {
    return a < 0.0 ? a * alpha : a;
  }
  vec4 ${M}_(vec4 v) {
    return vec4(${M}_(v.x), ${M}_(v.y), ${M}_(v.z), ${M}_(v.w));
  }
  `, name: M, type: g.FunctionType.ValueBased };
        }
        function w() {
          return D("log");
        }
        function _() {
          const E = "neg";
          return { body: `
  float ${E}_(float a) {
    return -a;
  }
  vec4 ${E}_(vec4 v) {
    return -v;
  }
  `, name: E, type: g.FunctionType.ValueBased };
        }
        function S() {
          const E = "not";
          return { body: `
  float ${E}_(float a) {
    return float( ! bool(a) );
  }
  bool ${E}_(bool a) {
    return !a;
  }
  vec4 ${E}_(vec4 v) {
    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));
  }
  bvec4 ${E}_(bvec4 v) {
    return bvec4(!v.x, !v.y, !v.z, !v.w);
  }
  `, name: E, type: g.FunctionType.ValueBased };
        }
        function A() {
          return D("sin");
        }
        function P() {
          const E = "relu";
          return { body: `
  float ${E}_(float a) {
    return max( a, 0.0 );
  }
  vec4 ${E}_(vec4 v) {
    return max( v, 0.0 );
  }
  `, name: E, type: g.FunctionType.ValueBased };
        }
        function v() {
          const E = "sigmoid";
          return { body: `
  float ${E}_(float a) {
    return 1.0 / (1.0 + exp(-a));
  }
  vec4 ${E}_(vec4 v) {
    return 1.0 / (1.0 + exp(-v));
  }
  `, name: E, type: g.FunctionType.ValueBased };
        }
        function R() {
          return D("sqrt");
        }
        function B() {
          return D("tan");
        }
        function q() {
          const E = "tanh";
          return { body: `
  float ${E}_(float a) {
    a = clamp(a, -10., 10.);
    a = exp(2.*a);
    return (a - 1.) / (a + 1.);
  }
  vec4 ${E}_(vec4 v) {
    v = clamp(v, -10., 10.);
    v = exp(2.*v);
    return (v - 1.) / (v + 1.);
  }
  `, name: E, type: g.FunctionType.ValueBased };
        }
        function D(E) {
          return { body: `
  float ${E}_(float a) {
    return ${E}(a);
  }
  vec4 ${E}_(vec4 v) {
    return ${E}(v);
  }
  `, name: E, type: g.FunctionType.ValueBased };
        }
        u.glslAbs = f, u.glslAcos = a, u.glslAsin = i, u.glslAtan = t, u.glslCeil = e, u.glslCos = n, u.glslElu = r, u.glslExp = s, u.glslFloor = l, u.glslClip = d, u.glslIdentity = m, u.glslLeakyRelu = y, u.glslLog = w, u.glslNeg = _, u.glslNot = S, u.glslSin = A, u.glslRelu = P, u.glslSigmoid = v, u.glslSqrt = R, u.glslTan = B, u.glslTanh = q;
        const O = (E, M, Y, H) => {
          const te = E.session.pack ? c.TextureType.packed : c.TextureType.unpacked, Z = { name: Y.name, inputTypes: [te], inputNames: ["A"], cacheHint: H };
          return Object.assign(Object.assign({}, Z), { get: () => ((ne, ue, ye, oe) => {
            const be = ne.session.pack ? c.TextureType.packed : c.TextureType.unpacked, me = (0, o.getGlsl)(ne.session.backend.glContext.version);
            return Object.assign(Object.assign({}, ue), { output: { dims: ye.dims, type: ye.type, textureType: be }, shaderSource: `
     ${oe.body}
     void main() {
       vec4 v = ${me.texture2D}(A, TexCoords);
       v = ${oe.name}_(v);
       ${me.output} = v;
     }
     `, hasMain: !0 });
          })(E, Z, M, Y) });
        };
        u.abs = (E, M) => [E.run(O(E, M[0], f()), M)], u.acos = (E, M) => [E.run(O(E, M[0], a()), M)], u.asin = (E, M) => [E.run(O(E, M[0], i()), M)], u.atan = (E, M) => [E.run(O(E, M[0], t()), M)], u.clip = (E, M, Y) => [E.run(O(E, M[0], d(Y.min, Y.max), Y.cacheKey), M)], u.parseClipAttributes = (E) => (0, h.createAttributeWithCacheKey)({ min: E.attributes.getFloat("min", p.MIN_CLIP), max: E.attributes.getFloat("max", p.MAX_CLIP) }), u.clipV11 = (E, M) => {
          const Y = N(E, M);
          return (0, u.clip)(E, [M[0]], Y);
        };
        const N = (E, M) => {
          if (M.length >= 3 && (!E.session.isInitializer(M[1].dataId) || !E.session.isInitializer(M[2].dataId))) throw new Error("dynamic clip attributes are not allowed");
          const Y = M.length >= 3 ? M[1].numberData[0] : p.MIN_CLIP, H = M.length >= 3 ? M[2].numberData[0] : p.MAX_CLIP;
          return (0, h.createAttributeWithCacheKey)({ min: Y, max: H });
        };
        u.ceil = (E, M) => [E.run(O(E, M[0], e()), M)], u.cos = (E, M) => [E.run(O(E, M[0], n()), M)], u.elu = (E, M, Y) => [E.run(O(E, M[0], r(Y.alpha), Y.cacheKey), M)], u.parseEluAttributes = (E) => (0, h.createAttributeWithCacheKey)({ alpha: E.attributes.getFloat("alpha", 1) }), u.exp = (E, M) => [E.run(O(E, M[0], s()), M)], u.floor = (E, M) => [E.run(O(E, M[0], l()), M)], u.identity = (E, M) => [E.run(O(E, M[0], m()), M)], u.leakyRelu = (E, M, Y) => [E.run(O(E, M[0], y(Y.alpha), Y.cacheKey), M)], u.parseLeakyReluAttributes = (E) => (0, h.createAttributeWithCacheKey)({ alpha: E.attributes.getFloat("alpha", 0.01) }), u.log = (E, M) => [E.run(O(E, M[0], w()), M)], u.neg = (E, M) => [E.run(O(E, M[0], _()), M)], u.not = (E, M) => [E.run(O(E, M[0], S()), M)], u.relu = (E, M) => [E.run(O(E, M[0], P()), M)], u.sigmoid = (E, M) => [E.run(O(E, M[0], v()), M)], u.sin = (E, M) => [E.run(O(E, M[0], A()), M)], u.sqrt = (E, M) => [E.run(O(E, M[0], R()), M)], u.tan = (E, M) => [E.run(O(E, M[0], B()), M)], u.tanh = (E, M) => [E.run(O(E, M[0], q()), M)];
      }, 5611: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createUnpackProgramInfoLoader = u.createUnpackProgramInfo = void 0;
        const h = b(5060), p = b(2039), g = b(9390), o = b(2827), c = { name: "unpack", inputNames: ["A"], inputTypes: [p.TextureType.packed] };
        u.createUnpackProgramInfo = (f, a) => {
          const i = a.dims.length, t = (0, o.getChannels)("rc", i), e = t.slice(-2), n = (0, g.getCoordsDataType)(i), r = (0, o.unpackFromChannel)(), s = a.dims.length === 0 ? "" : function(m, y) {
            if (m === 1) return "rc";
            let w = "";
            for (let _ = 0; _ < m; _++) w += y[_], _ < m - 1 && (w += ",");
            return w;
          }(i, t), l = i <= 1 ? "rc" : `vec2(${e.join(",")})`, d = `
    ${r}
    void main() {
      ${n} rc = getOutputCoords();

       // Sample the texture with the coords to get the rgba channel value.
       vec4 packedInput = getA(${s});

       ${(0, h.getGlsl)(f.session.backend.glContext.version).output} = vec4(getChannel(packedInput, ${l}), 0, 0, 0);
     }
   `;
          return Object.assign(Object.assign({}, c), { hasMain: !0, output: { dims: a.dims, type: a.type, textureType: p.TextureType.unpacked }, shaderSource: d });
        }, u.createUnpackProgramInfoLoader = (f, a) => Object.assign(Object.assign({}, c), { get: () => (0, u.createUnpackProgramInfo)(f, a) });
      }, 8428: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseUnsqueezeAttributes = u.unsqueezeV13 = u.unsqueeze = void 0;
        const h = b(2517);
        u.unsqueeze = (o, c, f) => {
          p(c);
          const a = h.ShapeUtil.unsqueezeShape(c[0].dims, f);
          return [o.reshapeUnpacked(c[0], a)];
        }, u.unsqueezeV13 = (o, c) => (g(c), (0, u.unsqueeze)(o, [c[0]], Array.from(c[1].integerData))), u.parseUnsqueezeAttributes = (o) => o.attributes.getInts("axes");
        const p = (o) => {
          if (!o || o.length !== 1) throw new Error("Unsqueeze requires 1 input.");
          if (o[0].type === "string") throw new Error("invalid input tensor types.");
        }, g = (o) => {
          if (!o || o.length !== 2) throw new Error("Unsqueeze requires 2 inputs.");
          if (o[1].type !== "int32") throw new Error("Invalid input type.");
        };
      }, 9793: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.scalesValidation = u.validateInputs = u.parseUpsampleAttributes = u.parseUpsampleAttributesV9 = u.parseUpsampleAttributesV7 = u.upsample = void 0;
        const h = b(246), p = b(5060), g = b(2039), o = { name: "Upsample", inputNames: ["X"], inputTypes: [g.TextureType.unpacked] };
        u.upsample = (f, a, i) => ((0, u.validateInputs)(a, i), [f.run(Object.assign(Object.assign({}, o), { cacheHint: i.cacheKey, get: () => c(f, a, i) }), a)]), u.parseUpsampleAttributesV7 = (f) => (0, u.parseUpsampleAttributes)(f, 7), u.parseUpsampleAttributesV9 = (f) => (0, u.parseUpsampleAttributes)(f, 9), u.parseUpsampleAttributes = (f, a) => {
          const i = a >= 10, t = f.attributes.getString("mode", "nearest");
          if (t !== "nearest" && t !== "linear" && (a < 11 || t !== "cubic")) throw new Error(`unrecognized mode: ${t}`);
          let e = [];
          a < 9 && (e = f.attributes.getFloats("scales"), (0, u.scalesValidation)(e, t, i));
          const n = f.attributes.getFloat("extrapolation_value", 0), r = a > 10 ? f.attributes.getString("coordinate_transformation_mode", "half_pixel") : "asymmetric";
          if (["asymmetric", "pytorch_half_pixel", "tf_half_pixel_for_nn", "align_corners", "tf_crop_and_resize", "half_pixel"].indexOf(r) === -1) throw new Error(`coordinate_transform_mode '${r}' is not supported`);
          const s = r === "tf_crop_and_resize", l = s, d = t === "nearest" && a >= 11 ? f.attributes.getString("nearest_mode", "round_prefer_floor") : "";
          if (["round_prefer_floor", "round_prefer_ceil", "floor", "ceil", ""].indexOf(d) === -1) throw new Error(`nearest_mode '${d}' is not supported`);
          const m = f.attributes.getFloat("cubic_coeff_a", -0.75), y = f.attributes.getInt("exclude_outside", 0) !== 0;
          if (y && t !== "cubic") throw new Error("exclude_outside can be set to 1 only when mode is CUBIC.");
          const w = a < 11 || t === "nearest" && r === "asymmetric" && d === "floor";
          let _ = 0, S = 0, A = 0;
          return a > 10 ? f.inputs.length > 2 ? (_ = 1, S = 2, A = 3) : (S = 1, A = 2) : a === 9 && (S = 1), (0, h.createAttributeWithCacheKey)({ opset: a, isResize: i, mode: t, scales: e, extrapolationValue: n, coordinateTransformMode: r, useExtrapolation: l, needRoiInput: s, nearestMode: d, cubicCoefficientA: m, excludeOutside: y, useNearest2xOptimization: w, roiInputIdx: _, scalesInputIdx: S, sizesInputIdx: A });
        };
        const c = (f, a, i) => {
          const t = (0, p.getGlsl)(f.session.backend.glContext.version), [e, n] = f.calculateTextureWidthAndHeight(a[0].dims, g.TextureType.unpacked), r = a[0].dims.map((A, P) => Math.floor(A * i.scales[P])), [s, l] = f.calculateTextureWidthAndHeight(r, g.TextureType.unpacked), d = r.length, m = new Array(d), y = new Array(d);
          let w = `
      int output_pitches[${d}];
      int input_pitches[${d}];
      `;
          for (let A = d - 1; A >= 0; A--) m[A] = A === d - 1 ? 1 : m[A + 1] * r[A + 1], y[A] = A === d - 1 ? 1 : y[A + 1] * a[0].dims[A + 1], w += `
        output_pitches[${A}] = ${m[A]};
        input_pitches[${A}] = ${y[A]};
        `;
          const _ = `
      float getInputFloat(int index) {
        vec2 coords = offsetToCoords(index, ${e}, ${n});
        float value = getColorAsFloat(${t.texture2D}(X, coords));
        return value;
      }
      `, S = i.mode === "nearest" ? `
    ${_}
    float process(int indices[${d}]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${s}, ${l});

      ${w}

      int d, m;
      for (int dim = 0; dim < ${d}; ++dim) {
        d = output_index / output_pitches[dim];
        m = output_index - d * output_pitches[dim];
        output_index = m;

        if (scales[dim] != 1 && d > 0) {
          int d2 = d / scales[dim];
          m = d - d2 * scales[dim];
          d = d2;
        }
        input_index += input_pitches[dim] * d;
      }

      return getInputFloat(input_index);
    }` : d === 4 ? `
    ${_}
    float process(int indices[4]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${s}, ${l});

      ${w}

      int m;
      int index_of_dim0, index_of_dim1, index_of_dim2, index_of_dim3;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m / output_pitches[1];
      m = m - index_of_dim1 * output_pitches[1];
      index_of_dim2 = m / output_pitches[2];
      m = m - index_of_dim2 * output_pitches[2];
      index_of_dim3 = m;

      int index_of_input_dim2, index_of_input_dim3, x_offset, y_offset;
      index_of_input_dim2 = index_of_dim2 / scales[2];
      y_offset = index_of_dim2 - index_of_input_dim2 * scales[2];
      index_of_input_dim3 = index_of_dim3 / scales[3];
      x_offset = index_of_dim3 - index_of_input_dim3 * scales[3];

      input_index = index_of_dim0 * input_pitches[0] +
            index_of_dim1 * input_pitches[1] +
            index_of_input_dim2 * input_pitches[2] +
            index_of_input_dim3;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim2 = false;
      if (index_of_input_dim2 == (${a[0].dims[2]} - 1)) {
        // It's the end in dimension 2
        x01 = x00;
        end_of_dim2 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[2]);
      }

      if (index_of_input_dim3 == (input_pitches[2] - 1)) {
        // It's the end in dimension 3
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim2 ? x10 : getInputFloat(input_index + input_pitches[2] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[2]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[2]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[3]);
    }` : `
    ${_}
    float process(int indices[2]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${s}, ${l});

      ${w}

      int m;
      int index_of_dim0, index_of_dim1;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m;

      int index_of_input_dim0, index_of_input_dim1, x_offset, y_offset;
      index_of_input_dim0 = index_of_dim0 / scales[0];
      y_offset = index_of_dim0 - index_of_input_dim0 * scales[0];
      index_of_input_dim1 = index_of_dim1 / scales[1];
      x_offset = index_of_dim1 - index_of_input_dim1 * scales[1];

      input_index = index_of_input_dim0 * input_pitches[0] + index_of_input_dim1;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim0 = false;
      if (index_of_input_dim0 == (${a[0].dims[0]} - 1)) {
        // It's the end in dimension 0
        x01 = x00;
        end_of_dim0 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[0]);
      }

      if (index_of_input_dim1 == (input_pitches[0] - 1)) {
        // It's the end in dimension 1
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim0 ? x10 : getInputFloat(input_index + input_pitches[0] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[0]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[0]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[1]);
    }`;
          return Object.assign(Object.assign({}, o), { output: { dims: r, type: a[0].type, textureType: g.TextureType.unpacked }, shaderSource: S, variables: [{ name: "scales", type: "int", arrayLength: i.scales.length, data: i.scales.map((A) => Math.ceil(A)) }] });
        };
        u.validateInputs = (f, a) => {
          if (!f || a.opset < 9 && f.length !== 1 || a.opset >= 9 && a.opset < 11 && f.length !== 2 || a.opset >= 11 && f.length < 2) throw new Error("invalid inputs.");
          if (a.scales.length > 0 && f[0].dims.length !== a.scales.length) throw new Error("Invalid input shape.");
          if (f[0].type === "string") throw new Error("Invalid input tensor types.");
        }, u.scalesValidation = (f, a, i) => {
          if (i) {
            for (const t of f) if (t <= 0) throw new Error("Scale value should be greater than 0.");
          } else for (const t of f) if (t < 1) throw new Error("Scale value should be greater than or equal to 1.");
          if (!(a !== "linear" && a !== "cubic" || f.length === 2 || f.length === 4 && f[0] === 1 && f[1] === 1)) throw new Error(`'Linear' mode and 'Cubic' mode only support 2-D inputs ('Bilinear', 'Bicubic')         or 4-D inputs with the corresponding outermost 2 scale values being 1         in the ${i ? "Resize" : "Upsample"} opeartor.`);
        };
      }, 1958: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.ProgramManager = void 0;
        const h = b(1670), p = b(6231), g = b(8879), o = b(5060);
        u.ProgramManager = class {
          constructor(c, f, a) {
            this.profiler = c, this.glContext = f, this.textureLayoutStrategy = a, this.repo = /* @__PURE__ */ new Map(), this.attributesBound = !1;
          }
          getArtifact(c) {
            return this.repo.get(c);
          }
          setArtifact(c, f) {
            this.repo.set(c, f);
          }
          run(c, f, a) {
            var i;
            this.profiler.event("op", `ProgramManager.run ${(i = c.programInfo.name) !== null && i !== void 0 ? i : "unknown kernel"}`, () => {
              var t;
              const e = this.glContext.gl, n = c.program;
              e.useProgram(n);
              try {
                this.bindOutput(a), this.attributesBound || this.bindAttributes(c.attribLocations), this.bindUniforms(c.uniformLocations, (t = c.programInfo.variables) !== null && t !== void 0 ? t : [], f);
              } catch (r) {
                throw p.Logger.error("ProgramManager", c.programInfo.shaderSource), r;
              }
              this.profiler.event("backend", "GlContext.draw()", () => {
                this.glContext.draw();
              });
            }, this.glContext);
          }
          dispose() {
            this.vertexShader && this.glContext.deleteShader(this.vertexShader), this.repo.forEach((c) => this.glContext.deleteProgram(c.program));
          }
          build(c, f, a) {
            return this.profiler.event("backend", "ProgramManager.build", () => {
              const i = new g.GlslPreprocessor(this.glContext, c, f, a), t = i.preprocess(), e = this.compile(t);
              return { programInfo: c, program: e, uniformLocations: this.getUniformLocations(e, i.context.programInfo.inputNames, i.context.programInfo.variables), attribLocations: this.getAttribLocations(e) };
            });
          }
          compile(c) {
            if (!this.vertexShader) {
              p.Logger.verbose("ProrgramManager", "Compiling and caching Vertex shader for the first time");
              const i = (0, o.getVertexShaderSource)(this.glContext.version);
              this.vertexShader = this.glContext.compileShader(i, this.glContext.gl.VERTEX_SHADER);
            }
            h.env.debug && p.Logger.verbose("ProrgramManager", `FragShader:
${c}
`);
            const f = this.glContext.compileShader(c, this.glContext.gl.FRAGMENT_SHADER), a = this.glContext.createProgram(this.vertexShader, f);
            return this.glContext.deleteShader(f), a;
          }
          bindOutput(c) {
            const f = c.width, a = c.height;
            p.Logger.verbose("ProrgramManager", `Binding output texture to Framebuffer: w/h=${f}/${a}, shape=${c.shape}, type=${c.tensor.type}`), this.glContext.attachFramebuffer(c.texture, f, a);
          }
          bindAttributes(c) {
            const f = c.position, a = c.textureCoord;
            this.glContext.setVertexAttributes(f, a), this.attributesBound = !0;
          }
          bindUniforms(c, f, a) {
            var i;
            const t = this.glContext.gl;
            let e = 0;
            for (const { name: n, type: r, location: s, arrayLength: l } of c) {
              const d = (i = f.find((m) => m.name === n)) === null || i === void 0 ? void 0 : i.data;
              if (r !== "sampler2D" && !d) throw new Error(`variable '${n}' does not have data defined in program info`);
              switch (r) {
                case "sampler2D":
                  this.bindTexture(a[e], s, e), e++;
                  break;
                case "float":
                  l ? t.uniform1fv(s, d) : t.uniform1f(s, d);
                  break;
                case "int":
                  l ? t.uniform1iv(s, d) : t.uniform1i(s, d);
                  break;
                default:
                  throw new Error(`Uniform not implemented: ${r}`);
              }
            }
          }
          bindTexture(c, f, a) {
            this.glContext.bindTextureToUniform(c.texture, a, f);
          }
          getAttribLocations(c) {
            return { position: this.getAttribLocation(c, "position"), textureCoord: this.getAttribLocation(c, "textureCoord") };
          }
          getUniformLocations(c, f, a) {
            const i = [];
            if (f) for (const t of f) i.push({ name: t, type: "sampler2D", location: this.getUniformLocation(c, t) });
            if (a) for (const t of a) i.push(Object.assign(Object.assign({}, t), { location: this.getUniformLocation(c, t.name) }));
            return i;
          }
          getUniformLocation(c, f) {
            const a = this.glContext.gl.getUniformLocation(c, f);
            if (a === null) throw new Error(`Uniform ${f} not found.`);
            return a;
          }
          getAttribLocation(c, f) {
            return this.glContext.gl.getAttribLocation(c, f);
          }
        };
      }, 6416: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.WebGLSessionHandler = void 0;
        const h = b(6231), p = b(1047), g = b(8316), o = b(1640), c = b(1958), f = b(7859), a = b(5702);
        u.WebGLSessionHandler = class {
          constructor(i, t) {
            this.backend = i, this.context = t, this.layoutStrategy = new f.PreferLogicalStrategy(i.glContext.maxTextureSize), this.programManager = new c.ProgramManager(this.context.profiler, i.glContext, this.layoutStrategy), this.textureManager = new a.TextureManager(i.glContext, this.layoutStrategy, this.context.profiler, { reuseTextures: i.textureCacheMode === "full" }), this.packedTextureDataCache = /* @__PURE__ */ new Map(), this.unpackedTextureDataCache = /* @__PURE__ */ new Map(), this.pack = i.pack, this.pack2unpackMap = /* @__PURE__ */ new Map(), this.unpack2packMap = /* @__PURE__ */ new Map();
          }
          createInferenceHandler() {
            return new g.WebGLInferenceHandler(this);
          }
          onGraphInitialized(i) {
            const t = i.getValues().filter((e) => e.from === -1 && e.tensor).map((e) => e.tensor.dataId);
            this.initializers = new Set(t);
          }
          isInitializer(i) {
            return !!this.initializers && this.initializers.has(i);
          }
          addInitializer(i) {
            this.initializers.add(i);
          }
          getTextureData(i, t) {
            return t ? this.packedTextureDataCache.get(i) : this.unpackedTextureDataCache.get(i);
          }
          setTextureData(i, t, e = !1) {
            h.Logger.verbose("WebGLSessionHandler", "Storing Texture data in cache"), e ? this.packedTextureDataCache.set(i, t) : this.unpackedTextureDataCache.set(i, t);
          }
          dispose() {
            this.programManager.dispose(), this.textureManager.clearActiveTextures(), this.packedTextureDataCache.forEach((i) => this.textureManager.releaseTexture(i, !0)), this.packedTextureDataCache = /* @__PURE__ */ new Map(), this.unpackedTextureDataCache.forEach((i) => this.textureManager.releaseTexture(i, !0)), this.unpackedTextureDataCache = /* @__PURE__ */ new Map();
          }
          resolve(i, t, e) {
            const n = (0, p.resolveOperator)(i, t, o.WEBGL_OP_RESOLVE_RULES);
            return { impl: n.opImpl, context: n.opInit ? n.opInit(i, e) : i };
          }
        };
      }, 7769: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Uint8DataEncoder = u.RGBAFloatDataEncoder = u.RedFloat32DataEncoder = void 0;
        const h = b(6231);
        u.RedFloat32DataEncoder = class {
          constructor(p, g = 1) {
            if (g === 1) this.internalFormat = p.R32F, this.format = p.RED, this.textureType = p.FLOAT, this.channelSize = g;
            else {
              if (g !== 4) throw new Error(`Invalid number of channels: ${g}`);
              this.internalFormat = p.RGBA32F, this.format = p.RGBA, this.textureType = p.FLOAT, this.channelSize = g;
            }
          }
          encode(p, g) {
            let o, c;
            return p.constructor !== Float32Array && (h.Logger.warning("Encoder", "data was not of type Float32; creating new Float32Array"), c = new Float32Array(p)), g * this.channelSize > p.length ? (h.Logger.warning("Encoder", "Source data too small. Allocating larger array"), c = p, o = this.allocate(g * this.channelSize), c.forEach((f, a) => o[a] = f)) : (c = p, o = c), o;
          }
          allocate(p) {
            return new Float32Array(4 * p);
          }
          decode(p, g) {
            return this.channelSize === 1 ? p.filter((o, c) => c % 4 == 0).subarray(0, g) : p.subarray(0, g);
          }
        }, u.RGBAFloatDataEncoder = class {
          constructor(p, g = 1, o) {
            if (g !== 1 && g !== 4) throw new Error(`Invalid number of channels: ${g}`);
            this.internalFormat = p.RGBA, this.format = p.RGBA, this.channelSize = g, this.textureType = o || p.FLOAT;
          }
          encode(p, g) {
            let o = p;
            return this.channelSize === 1 && (h.Logger.verbose("Encoder", "Exploding into a larger array"), o = this.allocate(g), p.forEach((c, f) => o[4 * f] = c)), o;
          }
          allocate(p) {
            return new Float32Array(4 * p);
          }
          decode(p, g) {
            return this.channelSize === 1 ? p.filter((o, c) => c % 4 == 0).subarray(0, g) : p.subarray(0, g);
          }
        }, u.Uint8DataEncoder = class {
          constructor(p, g = 1) {
            if (this.channelSize = 4, g === 1) this.internalFormat = p.ALPHA, this.format = p.ALPHA, this.textureType = p.UNSIGNED_BYTE, this.channelSize = g;
            else {
              if (g !== 4) throw new Error(`Invalid number of channels: ${g}`);
              this.internalFormat = p.RGBA, this.format = p.RGBA, this.textureType = p.UNSIGNED_BYTE, this.channelSize = g;
            }
          }
          encode(p, g) {
            return new Uint8Array(p.buffer, p.byteOffset, p.byteLength);
          }
          allocate(p) {
            return new Uint8Array(p * this.channelSize);
          }
          decode(p, g) {
            if (p instanceof Uint8Array) return p.subarray(0, g);
            throw new Error(`Invalid array type: ${p.constructor}`);
          }
        };
      }, 7859: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.getBatchDim = u.sizeToSquarishShape = u.getRowsCols = u.sizeFromShape = u.isInt = u.parseAxisParam = u.squeezeShape = u.PreferLogicalStrategy = u.AlwaysKeepOriginalSizeStrategy = void 0;
        const h = b(6231), p = b(2517);
        function g(i, t) {
          const e = [], n = [], r = t != null && Array.isArray(t) && t.length === 0, s = t == null || r ? null : o(t, i).sort();
          let l = 0;
          for (let d = 0; d < i.length; ++d) {
            if (s != null) {
              if (s[l] === d && i[d] !== 1) throw new Error(`Can't squeeze axis ${d} since its dim '${i[d]}' is not 1`);
              (s[l] == null || s[l] > d) && i[d] === 1 && (e.push(i[d]), n.push(d)), s[l] <= d && l++;
            }
            i[d] !== 1 && (e.push(i[d]), n.push(d));
          }
          return { newShape: e, keptDims: n };
        }
        function o(i, t) {
          const e = t.length;
          return i = i == null ? t.map((n, r) => r) : [].concat(i), (0, p.assert)(i.every((n) => n >= -e && n < e), () => `All values in axis param must be in range [-${e}, ${e}) but got axis ${i}`), (0, p.assert)(i.every(c), () => `All values in axis param must be integers but got axis ${i}`), i.map((n) => n < 0 ? e + n : n);
        }
        function c(i) {
          return i % 1 == 0;
        }
        function f(i) {
          if (i.length === 0) return 1;
          let t = i[0];
          for (let e = 1; e < i.length; e++) t *= i[e];
          return t;
        }
        function a(i) {
          const t = Math.ceil(Math.sqrt(i));
          return [t, Math.ceil(i / t)];
        }
        u.AlwaysKeepOriginalSizeStrategy = class {
          constructor(i) {
            this.maxTextureSize = i;
          }
          computeTextureWH(i, t) {
            if (i.length === 0) return [1, 1];
            const e = this.maxTextureSize;
            if (t && t.breakAxis !== void 0) {
              const s = t.breakAxis >= i.length ? 1 : i.slice(t.breakAxis).reduce((d, m) => d * m), l = t.breakAxis <= 0 ? 1 : i.slice(0, t.breakAxis).reduce((d, m) => d * m);
              if (!(s > e || l > e)) return [s, l];
              h.Logger.verbose("TextureLayout", `Given width/height preferences were unattainable: shape:${i}, breakAxis:${t.breakAxis}`);
            }
            const n = i.reduce((s, l) => s * l);
            let r = Math.floor(Math.sqrt(n));
            for (; r < e && r < n && n % r != 0; r++) ;
            if (r >= e || n % r != 0) throw new Error(`The given dimensions are outside this GPU's boundaries: ${i}`);
            return [r, n / r];
          }
        }, u.PreferLogicalStrategy = class {
          constructor(i) {
            this.maxTextureSize = i;
          }
          computeTextureWH(i, t) {
            const e = this.computeTexture(i, t);
            return t && t.isPacked && (e[0] /= 2, e[1] /= 2), t && t.reverseWH ? [e[1], e[0]] : e;
          }
          computeTexture(i, t) {
            const e = t && t.isPacked;
            if (i.length === 0) return e ? [2, 2] : [1, 1];
            let n = this.maxTextureSize;
            if (t && t.breakAxis !== void 0) {
              const l = t.breakAxis >= i.length ? 1 : i.slice(t.breakAxis).reduce((m, y) => m * y), d = t.breakAxis <= 0 ? 1 : i.slice(0, t.breakAxis).reduce((m, y) => m * y);
              if (!(l > n || d > n)) return [l, d];
              h.Logger.verbose("TextureLayout", `Given width/height preferences were unattainable: shape:${i}, breakAxis:${t.breakAxis}`);
            }
            let r = i.slice(0);
            e && (n *= 2, r = r.map((l, d) => d >= r.length - 2 ? r[d] % 2 == 0 ? r[d] : r[d] + 1 : r[d]), r.length === 1 && (r = [2, r[0]])), r.length !== 2 && (r = g(r).newShape);
            const s = f(r);
            return r.length <= 1 && s <= n ? [1, s] : r.length === 2 && r[0] <= n && r[1] <= n ? r : r.length === 3 && r[0] * r[1] <= n && r[2] <= n ? [r[0] * r[1], r[2]] : r.length === 3 && r[0] <= n && r[1] * r[2] <= n ? [r[0], r[1] * r[2]] : r.length === 4 && r[0] * r[1] * r[2] <= n && r[3] <= n ? [r[0] * r[1] * r[2], r[3]] : r.length === 4 && r[0] <= n && r[1] * r[2] * r[3] <= n ? [r[0], r[1] * r[2] * r[3]] : e ? a(s / 4).map((l) => 2 * l) : a(s);
          }
        }, u.squeezeShape = g, u.parseAxisParam = o, u.isInt = c, u.sizeFromShape = f, u.getRowsCols = function(i) {
          if (i.length === 0) throw Error("Cannot get rows and columns of an empty shape array.");
          return [i.length > 1 ? i[i.length - 2] : 1, i[i.length - 1]];
        }, u.sizeToSquarishShape = a, u.getBatchDim = function(i, t = 2) {
          return f(i.slice(0, i.length - t));
        };
      }, 4057: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createTextureLayoutFromShape = u.calculateTextureWidthAndHeight = u.createTextureLayoutFromTextureType = void 0;
        const h = b(2517), p = b(2039);
        u.createTextureLayoutFromTextureType = (g, o, c) => {
          const f = c === p.TextureType.unpacked || c === p.TextureType.unpackedReversed ? 1 : 4, a = c === p.TextureType.packed, i = c === p.TextureType.unpackedReversed || c === p.TextureType.packed, t = c === p.TextureType.packedLastDimension ? o.length - 1 : void 0, e = c === p.TextureType.packedLastDimension ? o.map((n, r) => r === o.length - 1 ? 4 * n : n) : void 0;
          return (0, u.createTextureLayoutFromShape)(g, o, f, e, { isPacked: a, reverseWH: i, breakAxis: t });
        }, u.calculateTextureWidthAndHeight = (g, o, c) => {
          const f = (0, u.createTextureLayoutFromTextureType)(g, o, c);
          return [f.width, f.height];
        }, u.createTextureLayoutFromShape = (g, o, c = 1, f, a) => {
          const i = !(!a || !a.isPacked), [t, e] = g.computeTextureWH(i && f || o, a), n = o.length;
          let r = o.slice(0);
          if (n === 0 && (r = [1]), c === 1) f = o;
          else if (i) {
            if (c !== 4) throw new Error("a packed texture must be 4-channel");
            f = o, n > 0 && (r[n - 1] = Math.ceil(r[n - 1] / 2)), n > 1 && (r[n - 2] = Math.ceil(r[n - 2] / 2));
          } else if (!f) throw new Error("Unpacked shape is needed when using channels > 1");
          return { width: t, height: e, channels: c, isPacked: i, shape: r, strides: h.ShapeUtil.computeStrides(r), unpackedShape: f, reversedWH: a && a.reverseWH };
        };
      }, 5702: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.TextureManager = void 0;
        const h = b(6231);
        u.TextureManager = class {
          constructor(p, g, o, c) {
            this.glContext = p, this.layoutStrategy = g, this.profiler = o, this.config = c, this.pendingRead = /* @__PURE__ */ new Map(), c.reuseTextures && (this.inUseTextures = /* @__PURE__ */ new Map(), this.idleTextures = /* @__PURE__ */ new Map(), this.textureLookup = /* @__PURE__ */ new Map());
          }
          createTextureFromLayout(p, g, o, c) {
            const f = this.toEncoderType(p), a = this.glContext.getEncoder(f, g.channels || 1, c);
            if (g.isPacked && c === 1) throw new Error("not implemented");
            const i = g.width, t = g.height;
            let e, n;
            if (this.config.reuseTextures) {
              e = `${i}x${t}_${a.format}_${a.internalFormat}_${a.textureType}`, n = this.inUseTextures.get(e), n || (n = [], this.inUseTextures.set(e, n));
              const s = this.idleTextures.get(e);
              if (s && s.length > 0) {
                const l = s.pop();
                return n.push(l), c === 1 && this.glContext.updateTexture(l, i, t, a, this.toTextureData(p, o)), l;
              }
            }
            h.Logger.verbose("TextureManager", `Creating new texture of size ${g.width}x${g.height}`);
            const r = this.glContext.allocateTexture(i, t, a, this.toTextureData(p, o));
            return this.config.reuseTextures && (n.push(r), this.textureLookup.set(r, e)), r;
          }
          readTexture(p, g, o) {
            return o || (o = 1), this.profiler.event("backend", "TextureManager.readTexture", () => {
              const c = p.shape.reduce((a, i) => a * i) * o, f = this.glContext.readTexture(p.texture, p.width, p.height, c, this.toEncoderType(g), o);
              return this.toTensorData(g, f);
            });
          }
          async readTextureAsync(p, g, o) {
            const c = p.tensor.dataId;
            if (o || (o = 1), this.pendingRead.has(c)) {
              const f = this.pendingRead.get(c);
              return new Promise((a) => f == null ? void 0 : f.push(a));
            }
            return this.profiler.event("backend", "TextureManager.readTextureAsync", async () => {
              this.pendingRead.set(c, []);
              const f = p.shape.reduce((e, n) => e * n) * o;
              await this.glContext.createAndWaitForFence();
              const a = this.glContext.readTexture(p.texture, p.width, p.height, f, this.toEncoderType(g), o), i = this.toTensorData(g, a), t = this.pendingRead.get(c);
              return this.pendingRead.delete(c), t == null || t.forEach((e) => e(i)), i;
            });
          }
          readUint8TextureAsFloat(p) {
            return this.profiler.event("backend", "TextureManager.readUint8TextureAsFloat", () => {
              const g = p.shape.reduce((c, f) => c * f), o = this.glContext.readTexture(p.texture, p.width, p.height, 4 * g, "byte", 4);
              return new Float32Array(o.buffer, o.byteOffset, g);
            });
          }
          releaseTexture(p, g) {
            let o;
            if (this.config.reuseTextures && (o = this.textureLookup.get(p.texture), o)) {
              g && this.textureLookup.delete(o);
              const c = this.inUseTextures.get(o);
              if (c) {
                const f = c.indexOf(p.texture);
                if (f !== -1) {
                  c.splice(f, 1);
                  let a = this.idleTextures.get(o);
                  a || (a = [], this.idleTextures.set(o, a)), a.push(p.texture);
                }
              }
            }
            o && !g || (h.Logger.verbose("TextureManager", `Deleting texture of size ${p.width}x${p.height}`), this.glContext.deleteTexture(p.texture));
          }
          toTensorData(p, g) {
            switch (p) {
              case "int16":
                return g instanceof Int16Array ? g : Int16Array.from(g);
              case "int32":
                return g instanceof Int32Array ? g : Int32Array.from(g);
              case "int8":
                return g instanceof Int8Array ? g : Int8Array.from(g);
              case "uint16":
                return g instanceof Uint16Array ? g : Uint16Array.from(g);
              case "uint32":
                return g instanceof Uint32Array ? g : Uint32Array.from(g);
              case "uint8":
              case "bool":
                return g instanceof Uint8Array ? g : Uint8Array.from(g);
              case "float32":
                return g instanceof Float32Array ? g : Float32Array.from(g);
              case "float64":
                return g instanceof Float64Array ? g : Float64Array.from(g);
              default:
                throw new Error(`TensorData type ${p} is not supported`);
            }
          }
          toTextureData(p, g) {
            if (g) return g instanceof Float32Array ? g : new Float32Array(g);
          }
          toEncoderType(p) {
            return "float";
          }
          clearActiveTextures() {
            this.glContext.clearActiveTextures();
          }
        };
      }, 2039: (C, u) => {
        var b;
        Object.defineProperty(u, "__esModule", { value: !0 }), u.TextureType = void 0, (b = u.TextureType || (u.TextureType = {}))[b.unpacked = 0] = "unpacked", b[b.unpackedReversed = 1] = "unpackedReversed", b[b.packed = 2] = "packed", b[b.downloadUint8AsFloat = 3] = "downloadUint8AsFloat", b[b.packedLastDimension = 4] = "packedLastDimension";
      }, 9390: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.getGlChannels = u.getCoordsDataType = u.getSqueezedParams = u.squeezeInputShape = u.generateShaderFuncNameFromInputSamplerNameAtOutCoords = u.generateShaderFuncNameFromInputSamplerName = u.repeatedTry = u.getPackedShape = void 0;
        const h = b(2517);
        u.getPackedShape = function(p) {
          const g = p.length;
          return p.slice(0, g - 1).concat(p[g - 1] / 4);
        }, u.repeatedTry = async function(p, g = (c) => 0, o) {
          return new Promise((c, f) => {
            let a = 0;
            const i = () => {
              if (p()) return void c();
              a++;
              const t = g(a);
              o != null && a >= o ? f() : setTimeout(i, t);
            };
            i();
          });
        }, u.generateShaderFuncNameFromInputSamplerName = function(p) {
          return (0, h.assert)(p !== void 0 && p.length !== 0, () => "empty string found for sampler name"), "get" + p.charAt(0).toUpperCase() + p.slice(1);
        }, u.generateShaderFuncNameFromInputSamplerNameAtOutCoords = function(p) {
          return (0, h.assert)(p !== void 0 && p.length !== 0, () => "empty string found for sampler name"), "get" + p.charAt(0).toUpperCase() + p.slice(1) + "AtOutCoords";
        }, u.squeezeInputShape = function(p, g) {
          let o = JSON.parse(JSON.stringify(p));
          return o = g, o;
        }, u.getSqueezedParams = function(p, g) {
          return g.map((o) => p[o]).join(", ");
        }, u.getCoordsDataType = function(p) {
          if (p <= 1) return "int";
          if (p === 2) return "ivec2";
          if (p === 3) return "ivec3";
          if (p === 4) return "ivec4";
          if (p === 5) return "ivec5";
          if (p === 6) return "ivec6";
          throw Error(`GPU for rank ${p} is not yet supported`);
        }, u.getGlChannels = function(p = 6) {
          return ["x", "y", "z", "w", "u", "v"].slice(0, p);
        };
      }, 7305: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createNewWebGLContext = u.createWebGLContext = void 0;
        const h = b(6231), p = b(1713), g = {};
        function o(c) {
          const f = function() {
            if (typeof document > "u") {
              if (typeof OffscreenCanvas > "u") throw new TypeError("failed to create canvas: OffscreenCanvas is not supported");
              return new OffscreenCanvas(1, 1);
            }
            const t = document.createElement("canvas");
            return t.width = 1, t.height = 1, t;
          }();
          let a;
          const i = { alpha: !1, depth: !1, antialias: !1, stencil: !1, preserveDrawingBuffer: !1, premultipliedAlpha: !1, failIfMajorPerformanceCaveat: !1 };
          if ((!c || c === "webgl2") && (a = f.getContext("webgl2", i), a)) try {
            return new p.WebGLContext(a, 2);
          } catch (t) {
            h.Logger.warning("GlContextFactory", `failed to create WebGLContext using contextId 'webgl2'. Error: ${t}`);
          }
          if ((!c || c === "webgl") && (a = f.getContext("webgl", i) || f.getContext("experimental-webgl", i), a)) try {
            return new p.WebGLContext(a, 1);
          } catch (t) {
            h.Logger.warning("GlContextFactory", `failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: ${t}`);
          }
          throw new Error("WebGL is not supported");
        }
        u.createWebGLContext = function c(f) {
          let a;
          f && f !== "webgl2" || !("webgl2" in g) ? f && f !== "webgl" || !("webgl" in g) || (a = g.webgl) : a = g.webgl2, a = a || o(f), f = f || a.version === 1 ? "webgl" : "webgl2";
          const i = a.gl;
          return g[f] = a, i.isContextLost() ? (delete g[f], c(f)) : (i.disable(i.DEPTH_TEST), i.disable(i.STENCIL_TEST), i.disable(i.BLEND), i.disable(i.DITHER), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SAMPLE_COVERAGE), i.enable(i.SCISSOR_TEST), i.enable(i.CULL_FACE), i.cullFace(i.BACK), a);
        }, u.createNewWebGLContext = o;
      }, 1713: function(C, u, b) {
        var h = this && this.__createBinding || (Object.create ? function(i, t, e, n) {
          n === void 0 && (n = e);
          var r = Object.getOwnPropertyDescriptor(t, e);
          r && !("get" in r ? !t.__esModule : r.writable || r.configurable) || (r = { enumerable: !0, get: function() {
            return t[e];
          } }), Object.defineProperty(i, n, r);
        } : function(i, t, e, n) {
          n === void 0 && (n = e), i[n] = t[e];
        }), p = this && this.__setModuleDefault || (Object.create ? function(i, t) {
          Object.defineProperty(i, "default", { enumerable: !0, value: t });
        } : function(i, t) {
          i.default = t;
        }), g = this && this.__importStar || function(i) {
          if (i && i.__esModule) return i;
          var t = {};
          if (i != null) for (var e in i) e !== "default" && Object.prototype.hasOwnProperty.call(i, e) && h(t, i, e);
          return p(t, i), t;
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.WebGLContext = u.linearSearchLastTrue = void 0;
        const o = b(1670), c = g(b(7769)), f = b(9390);
        function a(i) {
          let t = 0;
          for (; t < i.length && i[t](); ++t) ;
          return t - 1;
        }
        u.linearSearchLastTrue = a, u.WebGLContext = class {
          constructor(i, t) {
            this.frameBufferBound = !1, this.itemsToPoll = [], this.gl = i, this.version = t, this.getExtensions(), this.vertexbuffer = this.createVertexbuffer(), this.framebuffer = this.createFramebuffer(), this.queryVitalParameters();
          }
          allocateTexture(i, t, e, n) {
            const r = this.gl, s = r.createTexture();
            r.bindTexture(r.TEXTURE_2D, s), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE);
            const l = n ? e.encode(n, i * t) : null;
            return r.texImage2D(r.TEXTURE_2D, 0, e.internalFormat, i, t, 0, e.format, e.textureType, l), this.checkError(), s;
          }
          updateTexture(i, t, e, n, r) {
            const s = this.gl;
            s.bindTexture(s.TEXTURE_2D, i);
            const l = n.encode(r, t * e);
            s.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, t, e, n.format, n.textureType, l), this.checkError();
          }
          attachFramebuffer(i, t, e) {
            const n = this.gl;
            n.bindTexture(n.TEXTURE_2D, i), n.bindFramebuffer(n.FRAMEBUFFER, this.framebuffer), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, i, 0), this.checkError(), n.viewport(0, 0, t, e), n.scissor(0, 0, t, e);
          }
          readTexture(i, t, e, n, r, s) {
            const l = this.gl;
            s || (s = 1), this.frameBufferBound || this.attachFramebuffer(i, t, e);
            const d = this.getEncoder(r, s), m = d.allocate(t * e);
            return l.bindTexture(l.TEXTURE_2D, i), l.framebufferTexture2D(l.FRAMEBUFFER, l.COLOR_ATTACHMENT0, l.TEXTURE_2D, i, 0), l.readPixels(0, 0, t, e, l.RGBA, d.textureType, m), this.checkError(), d.decode(m, n);
          }
          isFramebufferReady() {
            return !0;
          }
          getActiveTexture() {
            const i = this.gl;
            return "TEXTURE" + (i.getParameter(this.gl.ACTIVE_TEXTURE) - i.TEXTURE0);
          }
          getTextureBinding() {
            return this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
          }
          getFramebufferBinding() {
            return this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);
          }
          setVertexAttributes(i, t) {
            const e = this.gl;
            e.vertexAttribPointer(i, 3, e.FLOAT, !1, 20, 0), e.enableVertexAttribArray(i), t !== -1 && (e.vertexAttribPointer(t, 2, e.FLOAT, !1, 20, 12), e.enableVertexAttribArray(t)), this.checkError();
          }
          createProgram(i, t) {
            const e = this.gl, n = e.createProgram();
            return e.attachShader(n, i), e.attachShader(n, t), e.linkProgram(n), n;
          }
          compileShader(i, t) {
            const e = this.gl, n = e.createShader(t);
            if (!n) throw new Error(`createShader() returned null with type ${t}`);
            if (e.shaderSource(n, i), e.compileShader(n), e.getShaderParameter(n, e.COMPILE_STATUS) === !1) throw new Error(`Failed to compile shader: ${e.getShaderInfoLog(n)}
Shader source:
${i}`);
            return n;
          }
          deleteShader(i) {
            this.gl.deleteShader(i);
          }
          bindTextureToUniform(i, t, e) {
            const n = this.gl;
            n.activeTexture(n.TEXTURE0 + t), this.checkError(), n.bindTexture(n.TEXTURE_2D, i), this.checkError(), n.uniform1i(e, t), this.checkError();
          }
          draw() {
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4), this.checkError();
          }
          checkError() {
            if (o.env.debug) {
              const i = this.gl, t = i.getError();
              let e = "";
              switch (t) {
                case i.NO_ERROR:
                  return;
                case i.INVALID_ENUM:
                  e = "INVALID_ENUM";
                  break;
                case i.INVALID_VALUE:
                  e = "INVALID_VALUE";
                  break;
                case i.INVALID_OPERATION:
                  e = "INVALID_OPERATION";
                  break;
                case i.INVALID_FRAMEBUFFER_OPERATION:
                  e = "INVALID_FRAMEBUFFER_OPERATION";
                  break;
                case i.OUT_OF_MEMORY:
                  e = "OUT_OF_MEMORY";
                  break;
                case i.CONTEXT_LOST_WEBGL:
                  e = "CONTEXT_LOST_WEBGL";
                  break;
                default:
                  e = `Unknown WebGL Error: ${t.toString(16)}`;
              }
              throw new Error(e);
            }
          }
          deleteTexture(i) {
            this.gl.deleteTexture(i);
          }
          deleteProgram(i) {
            this.gl.deleteProgram(i);
          }
          getEncoder(i, t, e = 0) {
            if (this.version === 2) return new c.RedFloat32DataEncoder(this.gl, t);
            switch (i) {
              case "float":
                return e === 1 || this.isRenderFloat32Supported ? new c.RGBAFloatDataEncoder(this.gl, t) : new c.RGBAFloatDataEncoder(this.gl, t, this.textureHalfFloatExtension.HALF_FLOAT_OES);
              case "int":
                throw new Error("not implemented");
              case "byte":
                return new c.Uint8DataEncoder(this.gl, t);
              default:
                throw new Error(`Invalid dataType: ${i}`);
            }
          }
          clearActiveTextures() {
            const i = this.gl;
            for (let t = 0; t < this.maxTextureImageUnits; ++t) i.activeTexture(i.TEXTURE0 + t), i.bindTexture(i.TEXTURE_2D, null);
          }
          dispose() {
            if (this.disposed) return;
            const i = this.gl;
            i.bindFramebuffer(i.FRAMEBUFFER, null), i.deleteFramebuffer(this.framebuffer), i.bindBuffer(i.ARRAY_BUFFER, null), i.deleteBuffer(this.vertexbuffer), i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, null), i.finish(), this.disposed = !0;
          }
          createDefaultGeometry() {
            return new Float32Array([-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]);
          }
          createVertexbuffer() {
            const i = this.gl, t = i.createBuffer();
            if (!t) throw new Error("createBuffer() returned null");
            const e = this.createDefaultGeometry();
            return i.bindBuffer(i.ARRAY_BUFFER, t), i.bufferData(i.ARRAY_BUFFER, e, i.STATIC_DRAW), this.checkError(), t;
          }
          createFramebuffer() {
            const i = this.gl.createFramebuffer();
            if (!i) throw new Error("createFramebuffer returned null");
            return i;
          }
          queryVitalParameters() {
            const i = this.gl;
            if (this.isFloatTextureAttachableToFrameBuffer = this.checkFloatTextureAttachableToFrameBuffer(), this.isRenderFloat32Supported = this.checkRenderFloat32(), this.isFloat32DownloadSupported = this.checkFloat32Download(), this.version === 1 && !this.textureHalfFloatExtension && !this.isRenderFloat32Supported) throw new Error("both float32 and float16 TextureType are not supported");
            this.isBlendSupported = !this.isRenderFloat32Supported || this.checkFloat32Blend(), this.maxTextureSize = i.getParameter(i.MAX_TEXTURE_SIZE), this.maxTextureImageUnits = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), this.version;
          }
          getExtensions() {
            this.version === 2 ? (this.colorBufferFloatExtension = this.gl.getExtension("EXT_color_buffer_float"), this.disjointTimerQueryWebgl2Extension = this.gl.getExtension("EXT_disjoint_timer_query_webgl2")) : (this.textureFloatExtension = this.gl.getExtension("OES_texture_float"), this.textureHalfFloatExtension = this.gl.getExtension("OES_texture_half_float"));
          }
          checkFloatTextureAttachableToFrameBuffer() {
            const i = this.gl, t = i.createTexture();
            i.bindTexture(i.TEXTURE_2D, t);
            const e = this.version === 2 ? i.RGBA32F : i.RGBA;
            i.texImage2D(i.TEXTURE_2D, 0, e, 1, 1, 0, i.RGBA, i.FLOAT, null);
            const n = i.createFramebuffer();
            i.bindFramebuffer(i.FRAMEBUFFER, n), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, t, 0);
            const r = i.checkFramebufferStatus(i.FRAMEBUFFER) === i.FRAMEBUFFER_COMPLETE;
            return i.bindTexture(i.TEXTURE_2D, null), i.bindFramebuffer(i.FRAMEBUFFER, null), i.deleteTexture(t), i.deleteFramebuffer(n), r;
          }
          checkRenderFloat32() {
            if (this.version === 2) {
              if (!this.colorBufferFloatExtension) return !1;
            } else if (!this.textureFloatExtension) return !1;
            return this.isFloatTextureAttachableToFrameBuffer;
          }
          checkFloat32Download() {
            if (this.version === 2) {
              if (!this.colorBufferFloatExtension) return !1;
            } else if (!this.textureFloatExtension || !this.gl.getExtension("WEBGL_color_buffer_float")) return !1;
            return this.isFloatTextureAttachableToFrameBuffer;
          }
          checkFloat32Blend() {
            const i = this.gl;
            let t, e, n, r, s;
            try {
              t = i.createTexture(), e = i.createFramebuffer(), i.bindTexture(i.TEXTURE_2D, t);
              const l = this.version === 2 ? i.RGBA32F : i.RGBA;
              return i.texImage2D(i.TEXTURE_2D, 0, l, 1, 1, 0, i.RGBA, i.FLOAT, null), i.bindFramebuffer(i.FRAMEBUFFER, e), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, t, 0), i.enable(i.BLEND), n = i.createShader(i.VERTEX_SHADER), !!n && (i.shaderSource(n, "void main(){}"), i.compileShader(n), r = i.createShader(i.FRAGMENT_SHADER), !!r && (i.shaderSource(r, "precision highp float;void main(){gl_FragColor=vec4(0.5);}"), i.compileShader(r), s = i.createProgram(), !!s && (i.attachShader(s, n), i.attachShader(s, r), i.linkProgram(s), i.useProgram(s), i.drawArrays(i.POINTS, 0, 1), i.getError() === i.NO_ERROR)));
            } finally {
              i.disable(i.BLEND), s && i.deleteProgram(s), n && i.deleteShader(n), r && i.deleteShader(r), e && (i.bindFramebuffer(i.FRAMEBUFFER, null), i.deleteFramebuffer(e)), t && (i.bindTexture(i.TEXTURE_2D, null), i.deleteTexture(t));
            }
          }
          beginTimer() {
            if (this.version === 2 && this.disjointTimerQueryWebgl2Extension) {
              const i = this.gl, t = this.disjointTimerQueryWebgl2Extension, e = i.createQuery();
              return i.beginQuery(t.TIME_ELAPSED_EXT, e), e;
            }
            throw new Error("WebGL1 profiling currently not supported.");
          }
          endTimer() {
            if (this.version !== 2 || !this.disjointTimerQueryWebgl2Extension) throw new Error("WebGL1 profiling currently not supported");
            {
              const i = this.gl, t = this.disjointTimerQueryWebgl2Extension;
              i.endQuery(t.TIME_ELAPSED_EXT);
            }
          }
          isTimerResultAvailable(i) {
            let t = !1, e = !1;
            if (this.version !== 2 || !this.disjointTimerQueryWebgl2Extension) throw new Error("WebGL1 profiling currently not supported");
            {
              const n = this.gl, r = this.disjointTimerQueryWebgl2Extension;
              t = n.getQueryParameter(i, n.QUERY_RESULT_AVAILABLE), e = n.getParameter(r.GPU_DISJOINT_EXT);
            }
            return t && !e;
          }
          getTimerResult(i) {
            let t = 0;
            if (this.version !== 2) throw new Error("WebGL1 profiling currently not supported");
            {
              const e = this.gl;
              t = e.getQueryParameter(i, e.QUERY_RESULT), e.deleteQuery(i);
            }
            return t / 1e6;
          }
          async waitForQueryAndGetTime(i) {
            return await (0, f.repeatedTry)(() => this.isTimerResultAvailable(i)), this.getTimerResult(i);
          }
          async createAndWaitForFence() {
            const i = this.createFence(this.gl);
            return this.pollFence(i);
          }
          createFence(i) {
            let t;
            const e = i, n = e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE, 0);
            return i.flush(), t = n === null ? () => !0 : () => {
              const r = e.clientWaitSync(n, 0, 0);
              return r === e.ALREADY_SIGNALED || r === e.CONDITION_SATISFIED;
            }, { query: n, isFencePassed: t };
          }
          async pollFence(i) {
            return new Promise((t) => {
              this.addItemToPoll(() => i.isFencePassed(), () => t());
            });
          }
          pollItems() {
            const i = a(this.itemsToPoll.map((t) => t.isDoneFn));
            for (let t = 0; t <= i; ++t) {
              const { resolveFn: e } = this.itemsToPoll[t];
              e();
            }
            this.itemsToPoll = this.itemsToPoll.slice(i + 1);
          }
          async addItemToPoll(i, t) {
            this.itemsToPoll.push({ isDoneFn: i, resolveFn: t }), this.itemsToPoll.length > 1 || await (0, f.repeatedTry)(() => (this.pollItems(), this.itemsToPoll.length === 0));
          }
        };
      }, 1036: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.ExecutionPlan = void 0;
        const h = b(6231);
        class p {
          constructor(o, c) {
            this.op = o, this.node = c;
          }
        }
        u.ExecutionPlan = class {
          constructor(g, o, c) {
            this.graph = g, this.profiler = c, this.initialize(o);
          }
          initialize(g) {
            this.profiler.event("session", "ExecutionPlan.initialize", () => {
              const o = this.graph.getNodes();
              if (o.length !== g.length) throw new Error("The size of nodes and OPs do not match.");
              this._ops = g.map((c, f) => new p(c, o[f])), this.reset(), this._starter = [], this._ops.forEach((c, f) => {
                let a = !0;
                for (const i of c.node.inputs) if (!this._values[i] && this.graph.getInputIndices().indexOf(i) === -1) {
                  a = !1;
                  break;
                }
                a && this._starter.push(f);
              });
            });
          }
          reset() {
            this._values = this.graph.getValues().map((g) => g.tensor);
          }
          async execute(g, o) {
            return this.profiler.event("session", "ExecutionPlan.execute", async () => {
              this.reset();
              const c = g.createInferenceHandler(), f = this.graph.getInputIndices();
              if (o.length !== f.length) throw new Error(`number of input tensors don't match the number of inputs to the model: actual: ${o.length} expected: ${f.length}`);
              o.forEach((r, s) => {
                const l = f[s];
                this._values[l] = r;
              });
              const a = this._starter.slice(0), i = this.graph.getValues(), t = this.graph.getNodes();
              let e = 0;
              for (; e < a.length; ) {
                const r = a[e++], s = this._ops[r], l = s.node.inputs.map((w) => this._values[w]);
                if (l.indexOf(void 0) !== -1) throw new Error(`unresolved input detected: op: ${s.node}`);
                const d = l;
                h.Logger.verbose("ExecPlan", `Runing op:${s.node.name} (${d.map((w, _) => `'${s.node.inputs[_]}': ${w.type}[${w.dims.join(",")}]`).join(", ")})`);
                const m = await this.profiler.event("node", s.node.name, async () => s.op.impl(c, d, s.op.context));
                if (m.length !== s.node.outputs.length) throw new Error("the size of output does not match model definition.");
                m.forEach((w, _) => {
                  const S = s.node.outputs[_];
                  if (this._values[S]) throw new Error(`output [${S}] already has value: op:${s.node.name}`);
                  this._values[S] = w;
                });
                const y = /* @__PURE__ */ new Set();
                m.forEach((w, _) => {
                  const S = s.node.outputs[_];
                  for (const A of i[S].to) {
                    const P = t[A];
                    let v = !0;
                    for (const R of P.inputs) if (!this._values[R]) {
                      v = !1;
                      break;
                    }
                    v && y.add(A);
                  }
                }), a.push(...y);
              }
              const n = [];
              for (let r = 0; r < this.graph.getOutputIndices().length; r++) {
                const s = this.graph.getOutputIndices()[r], l = this._values[s];
                if (l === void 0) throw new Error(`required output [${s}] does not have value`);
                s === 0 ? await l.getData() : l.data, n.push(l);
              }
              return h.Logger.verbose("ExecPlan", "disposing of inferenceHandler"), c.dispose(), n;
            });
          }
        };
      }, 7070: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Graph = void 0;
        const h = b(1446), p = b(7778), g = b(9395), o = b(9162), c = b(2517);
        var f = g.onnxruntime.experimental.fbs;
        u.Graph = { from: (e, n) => new t(e, n) };
        class a {
          constructor(n) {
            this._from = void 0, this._to = [], this.tensor = void 0, this.type = void 0, n && (this.type = c.ProtoUtil.tensorValueTypeFromProto(n.type.tensorType));
          }
          get from() {
            return this._from;
          }
          get to() {
            return this._to;
          }
        }
        class i {
          constructor(n, r) {
            n instanceof h.onnx.NodeProto ? (this.name = n.name, this.opType = n.opType, this.attributes = new p.Attribute(n.attribute)) : n instanceof f.Node && (this.name = r ?? n.name(), this.opType = n.opType(), this.attributes = new p.Attribute(c.ProtoUtil.tensorAttributesFromORTFormat(n))), this.inputs = [], this.outputs = [], this.executeNode = !0;
          }
        }
        class t {
          constructor(n, r) {
            if (!n) throw new TypeError("graph is empty");
            this.buildGraph(n), this.transformGraph(r), this.checkIsAcyclic();
          }
          getInputIndices() {
            return this._allInputIndices;
          }
          getInputNames() {
            return this._allInputNames;
          }
          getOutputIndices() {
            return this._allOutputIndices;
          }
          getOutputNames() {
            return this._allOutputNames;
          }
          getValues() {
            return this._allData;
          }
          getNodes() {
            return this._nodes;
          }
          buildGraph(n) {
            if (n instanceof h.onnx.GraphProto) this.buildGraphFromOnnxFormat(n);
            else {
              if (!(n instanceof f.Graph)) throw new TypeError("Graph type is not supported.");
              this.buildGraphFromOrtFormat(n);
            }
          }
          buildGraphFromOnnxFormat(n) {
            const r = /* @__PURE__ */ new Map();
            this._allData = [], this._allInputIndices = [], this._allInputNames = [], this._allOutputIndices = [], this._allOutputNames = [], this._nodes = [];
            const s = /* @__PURE__ */ new Map();
            if (!n.input) throw new Error("missing information in graph: input");
            const l = [];
            for (const d of n.input) {
              if (r.has(d.name)) throw new Error(`duplicated input name: ${d.name}`);
              const m = this._allData.push(new a(d)) - 1;
              r.set(d.name, m), l.push(d.name);
            }
            if (!n.initializer) throw new Error("missing information in graph: initializer");
            for (const d of n.initializer) {
              let m = r.get(d.name);
              if (m === void 0) {
                const y = new a();
                y.type = { shape: { dims: c.ProtoUtil.tensorDimsFromProto(d.dims) }, tensorType: c.ProtoUtil.tensorDataTypeFromProto(d.dataType) }, m = this._allData.push(y) - 1, r.set(d.name, m);
              }
              this._allData[m]._from = -1, this._allData[m].tensor = o.Tensor.fromProto(d);
            }
            for (let d = 0; d < this._allData.length; d++) this._allData[d].tensor || (this._allInputIndices.push(d), this._allInputNames.push(l[d]));
            if (!n.output) throw new Error("missing information in graph: output");
            for (const d of n.output) {
              if (r.has(d.name)) throw new Error(`duplicated output name: ${d.name}`);
              const m = this._allData.push(new a(d)) - 1;
              r.set(d.name, m), this._allOutputIndices.push(m), this._allOutputNames.push(d.name);
            }
            if (!n.node) throw new Error("missing information in graph: node");
            for (const d of n.node) {
              if (!d.name) for (let y = 0; ; y++) {
                const w = `unnamed_${d.opType}_${y}`;
                if (!s.has(w)) {
                  d.name = w;
                  break;
                }
              }
              if (s.has(d.name)) throw new Error(`duplicated node name: ${d.name}`);
              const m = this._nodes.push(new i(d)) - 1;
              s.set(d.name, m);
            }
            for (let d = 0; d < this._nodes.length; d++) {
              const m = this._nodes[d], y = n.node[d];
              if (!y.output) throw new Error(`missing output for node: ${y.name}`);
              for (const w of y.output) {
                let _ = r.get(w);
                if (_ === void 0 && (_ = this._allData.push(new a()) - 1, r.set(w, _)), m.outputs.push(_), this._allData[_]._from !== void 0) throw new Error(`multiple nodes output to one data value: ${_}`);
                if (this._allData[_]._from = d, y.opType === "Constant") {
                  if (!y.attribute || y.attribute.length !== 1 || !y.attribute[0].t) throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");
                  if (!y.output || y.output.length !== 1) throw new Error("missing output or incorrect number of outputs for this Constant operator");
                  m.outputs.pop(), m.executeNode = !1, this._allData[_]._from = -1, this._allData[_].tensor = o.Tensor.fromProto(y.attribute[0].t);
                }
              }
            }
            for (let d = 0; d < this._nodes.length; d++) {
              const m = this._nodes[d], y = n.node[d];
              if (!y.input) throw new Error(`missing input for node: ${y.name}`);
              for (const w of y.input) {
                const _ = r.get(w);
                if (_ === void 0) {
                  if (w === "" && y.input.length === 3 && y.opType === "Resize") continue;
                  throw new Error(`unrecognized input '${w}' for node: ${y.name}`);
                }
                m.inputs.push(_), this._allData[_]._to.push(d);
              }
            }
            return !0;
          }
          buildGraphFromOrtFormat(n) {
            var r, s, l;
            const d = /* @__PURE__ */ new Map();
            this._allData = [], this._allInputIndices = [], this._allInputNames = [], this._allOutputIndices = [], this._allOutputNames = [], this._nodes = [];
            const m = /* @__PURE__ */ new Map(), y = [];
            for (let w = 0; w < n.inputsLength(); w++) {
              const _ = n.inputs(w);
              if (d.has(_)) throw new Error(`duplicated input name: ${_}`);
              for (let S = 0; S < n.nodeArgsLength(); S++) if (((r = n.nodeArgs(S)) === null || r === void 0 ? void 0 : r.name()) === _) {
                const A = new a();
                if (((l = (s = n.nodeArgs(S)) === null || s === void 0 ? void 0 : s.type()) === null || l === void 0 ? void 0 : l.valueType()) !== f.TypeInfoValue.tensor_type) throw new Error("Unexpected value type for the nodeArg.");
                const P = n.nodeArgs(S).type().value(new f.TensorTypeAndShape()), v = c.ProtoUtil.tensorDataTypeFromProto(P.elemType()), R = P.shape(), B = [];
                for (let D = 0; D < R.dimLength(); D++) B.push(c.LongUtil.longToNumber(R.dim(D).value().dimValue()));
                A.type = { shape: { dims: B }, tensorType: v };
                const q = this._allData.push(A) - 1;
                d.set(_, q), y.push(_);
              }
            }
            for (let w = 0; w < n.initializersLength(); w++) {
              const _ = n.initializers(w);
              let S = d.get(_.name());
              if (S === void 0) {
                const A = new a(), P = c.ProtoUtil.tensorDimsFromORTFormat(_), v = c.ProtoUtil.tensorDataTypeFromProto(_.dataType());
                A.type = { shape: { dims: P }, tensorType: v }, S = this._allData.push(A) - 1, d.set(_.name(), S);
              }
              this._allData[S]._from = -1, this._allData[S].tensor = o.Tensor.fromOrtTensor(_);
            }
            for (let w = 0; w < this._allData.length; w++) this._allData[w].tensor || (this._allInputIndices.push(w), this._allInputNames.push(y[w]));
            for (let w = 0; w < n.outputsLength(); w++) {
              const _ = n.outputs(w);
              if (d.has(_)) throw new Error(`duplicated output name: ${_}`);
              const S = this._allData.push(new a()) - 1;
              d.set(_, S), this._allOutputIndices.push(S), this._allOutputNames.push(_);
            }
            if (!n.nodes) throw new Error("missing information in graph: node");
            for (let w = 0; w < n.nodesLength(); w++) {
              const _ = n.nodes(w);
              let S = _.name();
              if (!S) for (let P = 0; S = `unnamed_${_.opType()}_${P}`, m.has(S); P++) ;
              if (m.has(S)) throw new Error(`duplicated node name: ${S}`);
              const A = this._nodes.push(new i(_, S)) - 1;
              m.set(S, A);
            }
            for (let w = 0; w < this._nodes.length; w++) {
              const _ = this._nodes[w], S = n.nodes(w);
              if (S == null) throw new Error(`No node exists at index ${w}`);
              if ((S == null ? void 0 : S.outputsLength()) === 0) throw new Error(`missing output for node: ${S.name}`);
              for (let A = 0; A < (S == null ? void 0 : S.outputsLength()); A++) {
                const P = S == null ? void 0 : S.outputs(A);
                let v = d.get(P);
                if (v === void 0 && (v = this._allData.push(new a()) - 1, d.set(P, v)), _.outputs.push(v), this._allData[v]._from !== void 0) throw new Error(`multiple nodes output to one data value: ${v}`);
                if (this._allData[v]._from = w, S.opType() === "Constant") {
                  if (S.attributesLength() !== 1 || !S.attributes(0).t()) throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");
                  if (S.outputsLength() !== 1) throw new Error("missing output or incorrect number of outputs for this Constant operator");
                  _.outputs.pop(), _.executeNode = !1, this._allData[v]._from = -1, this._allData[v].tensor = o.Tensor.fromOrtTensor(S.attributes(0).t());
                }
              }
            }
            for (let w = 0; w < this._nodes.length; w++) {
              const _ = this._nodes[w], S = n.nodes(w);
              if (S.inputsLength() === 0) throw new Error(`missing input for node: ${S.name}`);
              for (let A = 0; A < S.inputsLength(); A++) {
                const P = S.inputs(A), v = d.get(P);
                if (v === void 0) throw new Error(`unrecognized input '${P}' for node: ${S.name()}`);
                _.inputs.push(v), this._allData[v]._to.push(w);
              }
            }
          }
          checkIsAcyclic() {
            const n = /* @__PURE__ */ new Set();
            this._allInputIndices.forEach((l) => {
              this._allData[l]._to.forEach((d) => {
                n.add(d);
              });
            });
            const r = Array.from(n), s = new Array(this._nodes.length).fill("white");
            for (; r.length > 0; ) {
              const l = r.pop();
              s[l] === "gray" ? s[l] = "black" : (r.push(l), s[l] = "gray", this._nodes[l].outputs.forEach((d) => {
                const m = this._allData[d];
                if (m.tensor !== void 0) throw new Error("node outputs should not be initialized");
                if (m._from !== l) throw new Error("from property of the Value object doesn't match index of Node being processed");
                m._to.forEach((y) => {
                  if (s[y] === "gray") throw new Error("model graph is cyclic");
                  s[y] === "white" && r.push(y);
                });
              }));
            }
          }
          transformGraph(n) {
            this.removeAllIdentityNodes(), this.removeAllDropoutNodes(), this.fuseConvActivationNodes(), n && n.transformGraph(this), this.finalizeGraph();
          }
          finalizeGraph() {
            let n = 0;
            for (let r = 0; r < this._nodes.length; r++) this._nodes[r].executeNode ? n > 0 && (this._nodes[r].inputs.forEach((s) => {
              const l = this._allData[s]._to.indexOf(r + n);
              l !== -1 && (this._allData[s]._to[l] = r);
            }), this._nodes[r].outputs.forEach((s) => {
              this._allData[s]._from && this._allData[s]._from === r + n && (this._allData[s]._from = r);
            })) : (n++, this._nodes[r].outputs.forEach((s) => {
              this._allData[s]._from = -2;
            }), this._nodes.splice(r, 1), r--);
            n = 0;
            for (let r = 0; r < this._allData.length; r++) if (this._allData[r].from !== -2 || this._allOutputIndices.indexOf(r + n) !== -1) {
              if (n > 0) {
                let s = -1;
                this._allData[r].from !== void 0 && this._allData[r].from !== -1 ? (s = this._nodes[this._allData[r].from].outputs.indexOf(r + n), s !== -1 && (this._nodes[this._allData[r].from].outputs[s] = r)) : (s = this._allInputIndices.indexOf(r + n), s !== -1 && (this._allInputIndices[s] = r)), this._allData[r].to.forEach((l) => {
                  s = this._nodes[l].inputs.indexOf(r + n), s !== -1 && (this._nodes[l].inputs[s] = r);
                }), this._allData[r].to.length === 0 && (s = this._allOutputIndices.indexOf(r + n), s !== -1 && (this._allOutputIndices[s] = r));
              }
            } else n++, this._allData.splice(r, 1), r--;
          }
          deleteNode(n) {
            const r = this._nodes[n];
            if (r.outputs.length > 1) {
              for (let w = 1; w < r.outputs.length; w++) if (this._allData[r.outputs[w]].to.length > 0) throw new Error("Node deletion with more than one output connected to other nodes is not supported. ");
            }
            r.executeNode = !1;
            const s = r.inputs[0], l = r.outputs[0], d = this._allData[l].to, m = this._allData[s].to.indexOf(n);
            if (m === -1) throw new Error("The Value object doesn't have the current Node in it's 'to' property ");
            this._allData[s].to.splice(m, 1), this._allData[l]._to = [];
            const y = this._allOutputIndices.indexOf(l);
            if (y !== -1 && (this._allOutputIndices[y] = s), d && d.length > 0) for (const w of d) {
              const _ = this._nodes[w].inputs.indexOf(l);
              if (_ === -1) throw new Error("The Node object doesn't have the output Value in it's 'inputs' property ");
              this._nodes[w].inputs[_] = s, this._allData[s].to.push(w);
            }
          }
          removeAllDropoutNodes() {
            let n = 0;
            for (const r of this._nodes) {
              if (r.opType === "Dropout") {
                if (r.inputs.length !== 1) throw new Error("Dropout nodes should only contain one input. ");
                if (r.outputs.length !== 1 && r.outputs.length !== 2) throw new Error("Dropout nodes should contain either 1 or 2 output(s)");
                if (r.outputs.length === 2 && this._allData[r.outputs[1]]._to.length !== 0) throw new Error("Dropout nodes's second output should not be referenced by other nodes");
                this.deleteNode(n);
              }
              n++;
            }
          }
          removeAllIdentityNodes() {
            let n = 0;
            for (const r of this._nodes) r.opType === "Identity" && this.deleteNode(n), n++;
          }
          isActivation(n) {
            switch (n.opType) {
              case "Relu":
              case "Sigmoid":
              case "Clip":
                return !0;
              default:
                return !1;
            }
          }
          fuseConvActivationNodes() {
            for (const n of this._nodes) if (n.opType === "Conv") {
              const r = this._allData[n.outputs[0]]._to;
              if (r.length === 1 && this.isActivation(this._nodes[r[0]])) {
                const s = this._nodes[r[0]];
                if (s.opType === "Clip") if (s.inputs.length === 1) try {
                  n.attributes.set("activation_params", "floats", [s.attributes.getFloat("min"), s.attributes.getFloat("max")]);
                } catch {
                  n.attributes.set("activation_params", "floats", [c.MIN_CLIP, c.MAX_CLIP]);
                }
                else {
                  if (!(s.inputs.length >= 3 && this._allData[s.inputs[1]].tensor !== void 0 && this._allData[s.inputs[2]].tensor !== void 0)) continue;
                  n.attributes.set("activation_params", "floats", [this._allData[s.inputs[1]].tensor.floatData[0], this._allData[s.inputs[2]].tensor.floatData[0]]);
                }
                n.attributes.set("activation", "string", s.opType), this.deleteNode(r[0]);
              }
            }
          }
        }
      }, 6231: (C, u) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.now = u.Profiler = u.Logger = void 0;
        const b = { verbose: 1e3, info: 2e3, warning: 4e3, error: 5e3, fatal: 6e3 }, h = { none: new class {
          log(i, t, e) {
          }
        }(), console: new class {
          log(i, t, e) {
            console.log(`${this.color(i)} ${e ? "\x1B[35m" + e + "\x1B[0m " : ""}${t}`);
          }
          color(i) {
            switch (i) {
              case "verbose":
                return "\x1B[34;40mv\x1B[0m";
              case "info":
                return "\x1B[32mi\x1B[0m";
              case "warning":
                return "\x1B[30;43mw\x1B[0m";
              case "error":
                return "\x1B[31;40me\x1B[0m";
              case "fatal":
                return "\x1B[101mf\x1B[0m";
              default:
                throw new Error(`unsupported severity: ${i}`);
            }
          }
        }() }, p = { provider: "console", minimalSeverity: "warning", logDateTime: !0, logSourceLocation: !1 };
        let g = { "": p };
        function o(i, t, e, n) {
          if (t === void 0) return r = i, { verbose: o.verbose.bind(null, r), info: o.info.bind(null, r), warning: o.warning.bind(null, r), error: o.error.bind(null, r), fatal: o.fatal.bind(null, r) };
          if (e === void 0) c(i, t);
          else if (typeof e == "number" && n === void 0) c(i, t);
          else if (typeof e == "string" && n === void 0) c(i, e, 0, t);
          else {
            if (typeof e != "string" || typeof n != "number") throw new TypeError("input is valid");
            c(i, e, 0, t);
          }
          var r;
        }
        function c(i, t, e, n) {
          const r = g[n || ""] || g[""];
          b[i] < b[r.minimalSeverity] || (r.logDateTime && (t = `${(/* @__PURE__ */ new Date()).toISOString()}|${t}`), r.logSourceLocation, h[r.provider].log(i, t, n));
        }
        (function(i) {
          function t(n) {
            g = {}, e("", n || {});
          }
          function e(n, r) {
            if (n === "*") t(r);
            else {
              const s = g[n] || p;
              g[n] = { provider: r.provider || s.provider, minimalSeverity: r.minimalSeverity || s.minimalSeverity, logDateTime: r.logDateTime === void 0 ? s.logDateTime : r.logDateTime, logSourceLocation: r.logSourceLocation === void 0 ? s.logSourceLocation : r.logSourceLocation };
            }
          }
          i.verbose = function(n, r) {
            i("verbose", n, r);
          }, i.info = function(n, r) {
            i("info", n, r);
          }, i.warning = function(n, r) {
            i("warning", n, r);
          }, i.error = function(n, r) {
            i("error", n, r);
          }, i.fatal = function(n, r) {
            i("fatal", n, r);
          }, i.reset = t, i.set = e, i.setWithEnv = function(n) {
            const r = {};
            n.logLevel && (r.minimalSeverity = n.logLevel), e("", r);
          };
        })(o), u.Logger = o;
        class f {
          constructor(t, e, n, r, s, l) {
            this.category = t, this.name = e, this.startTime = n, this.endCallback = r, this.timer = s, this.ctx = l;
          }
          end() {
            return this.endCallback(this);
          }
          async checkTimer() {
            if (this.ctx === void 0 || this.timer === void 0) throw new Error("No webgl timer found");
            return this.ctx.endTimer(), this.ctx.waitForQueryAndGetTime(this.timer);
          }
        }
        class a {
          constructor(t, e, n, r) {
            this.category = t, this.name = e, this.startTime = n, this.endTime = r;
          }
        }
        u.Profiler = class {
          static create(i) {
            return i === void 0 ? new this() : new this(i.maxNumberEvents, i.flushBatchSize, i.flushIntervalInMilliseconds);
          }
          constructor(i, t, e) {
            this._started = !1, this._flushPointer = 0, this._started = !1, this._maxNumberEvents = i === void 0 ? 1e4 : i, this._flushBatchSize = t === void 0 ? 10 : t, this._flushIntervalInMilliseconds = e === void 0 ? 5e3 : e;
          }
          start() {
            this._started = !0, this._timingEvents = [], this._flushTime = (0, u.now)(), this._flushPointer = 0;
          }
          stop() {
            for (this._started = !1; this._flushPointer < this._timingEvents.length; this._flushPointer++) this.logOneEvent(this._timingEvents[this._flushPointer]);
          }
          event(i, t, e, n) {
            const r = this._started ? this.begin(i, t, n) : void 0;
            let s = !1;
            const l = e();
            if (l && typeof l.then == "function") return s = !0, new Promise((d, m) => {
              l.then(async (y) => {
                r && await r.end(), d(y);
              }, async (y) => {
                r && await r.end(), m(y);
              });
            });
            if (!s && r) {
              const d = r.end();
              if (d && typeof d.then == "function") return new Promise((m, y) => {
                d.then(() => {
                  m(l);
                }, (w) => {
                  y(w);
                });
              });
            }
            return l;
          }
          begin(i, t, e) {
            if (!this._started) throw new Error("profiler is not started yet");
            if (e === void 0) {
              const n = (0, u.now)();
              return this.flush(n), new f(i, t, n, (r) => this.endSync(r));
            }
            {
              const n = e.beginTimer();
              return new f(i, t, 0, async (r) => this.end(r), n, e);
            }
          }
          async end(i) {
            const t = await i.checkTimer();
            this._timingEvents.length < this._maxNumberEvents && (this._timingEvents.push(new a(i.category, i.name, i.startTime, t)), this.flush(t));
          }
          endSync(i) {
            const t = (0, u.now)();
            this._timingEvents.length < this._maxNumberEvents && (this._timingEvents.push(new a(i.category, i.name, i.startTime, t)), this.flush(t));
          }
          logOneEvent(i) {
            u.Logger.verbose(`Profiler.${i.category}`, `${(i.endTime - i.startTime).toFixed(2)}ms on event '${i.name}' at ${i.endTime.toFixed(2)}`);
          }
          flush(i) {
            if (this._timingEvents.length - this._flushPointer >= this._flushBatchSize || i - this._flushTime >= this._flushIntervalInMilliseconds) {
              for (const t = this._flushPointer; this._flushPointer < t + this._flushBatchSize && this._flushPointer < this._timingEvents.length; this._flushPointer++) this.logOneEvent(this._timingEvents[this._flushPointer]);
              this._flushTime = (0, u.now)();
            }
          }
          get started() {
            return this._started;
          }
        }, u.now = typeof performance < "u" && performance.now ? () => performance.now() : Date.now;
      }, 2644: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Model = void 0;
        const h = b(5686), p = b(1446), g = b(7070), o = b(9395), c = b(2517);
        var f = o.onnxruntime.experimental.fbs;
        u.Model = class {
          constructor() {
          }
          load(a, i, t) {
            if (!t) try {
              return void this.loadFromOnnxFormat(a, i);
            } catch (e) {
              if (t !== void 0) throw e;
            }
            this.loadFromOrtFormat(a, i);
          }
          loadFromOnnxFormat(a, i) {
            const t = p.onnx.ModelProto.decode(a);
            if (c.LongUtil.longToNumber(t.irVersion) < 3) throw new Error("only support ONNX model with IR_VERSION>=3");
            this._opsets = t.opsetImport.map((e) => ({ domain: e.domain, version: c.LongUtil.longToNumber(e.version) })), this._graph = g.Graph.from(t.graph, i);
          }
          loadFromOrtFormat(a, i) {
            const t = new h.flatbuffers.ByteBuffer(a), e = f.InferenceSession.getRootAsInferenceSession(t).model();
            if (c.LongUtil.longToNumber(e.irVersion()) < 3) throw new Error("only support ONNX model with IR_VERSION>=3");
            this._opsets = [];
            for (let n = 0; n < e.opsetImportLength(); n++) {
              const r = e.opsetImport(n);
              this._opsets.push({ domain: r == null ? void 0 : r.domain(), version: c.LongUtil.longToNumber(r.version()) });
            }
            this._graph = g.Graph.from(e.graph(), i);
          }
          get graph() {
            return this._graph;
          }
          get opsets() {
            return this._opsets;
          }
        };
      }, 782: (C, u) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.FLOAT_TYPES = u.INT_TYPES = u.NUMBER_TYPES = void 0, u.NUMBER_TYPES = ["float32", "float64", "int32", "int16", "int8", "uint16", "uint32", "uint8"], u.INT_TYPES = ["int32", "int16", "int8", "uint16", "uint32", "uint8"], u.FLOAT_TYPES = ["float32", "float64"];
      }, 1047: (C, u) => {
        function b(h, p) {
          if (p.endsWith("+")) {
            const g = Number.parseInt(p.substring(0, p.length - 1), 10);
            return !isNaN(g) && g <= h;
          }
          if (p.split("-").length === 2) {
            const g = p.split("-"), o = Number.parseInt(g[0], 10), c = Number.parseInt(g[1], 10);
            return !isNaN(o) && !isNaN(c) && o <= h && h <= c;
          }
          return Number.parseInt(p, 10) === h;
        }
        Object.defineProperty(u, "__esModule", { value: !0 }), u.resolveOperator = void 0, u.resolveOperator = function(h, p, g) {
          for (const o of g) {
            const c = o[0], f = o[1], a = o[2], i = o[3], t = o[4];
            if (h.opType === c) {
              for (const e of p) if ((e.domain === f || e.domain === "ai.onnx" && f === "") && b(e.version, a)) return { opImpl: i, opInit: t };
            }
          }
          throw new TypeError(`cannot resolve operator '${h.opType}' with opsets: ${p.map((o) => `${o.domain || "ai.onnx"} v${o.version}`).join(", ")}`);
        };
      }, 9395: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.onnxruntime = void 0;
        const h = b(5686);
        var p, g;
        p = u.onnxruntime || (u.onnxruntime = {}), function(o) {
          (function(c) {
            c[c.UNDEFINED = 0] = "UNDEFINED", c[c.FLOAT = 1] = "FLOAT", c[c.INT = 2] = "INT", c[c.STRING = 3] = "STRING", c[c.TENSOR = 4] = "TENSOR", c[c.GRAPH = 5] = "GRAPH", c[c.FLOATS = 6] = "FLOATS", c[c.INTS = 7] = "INTS", c[c.STRINGS = 8] = "STRINGS", c[c.TENSORS = 9] = "TENSORS", c[c.GRAPHS = 10] = "GRAPHS", c[c.SPARSE_TENSOR = 11] = "SPARSE_TENSOR", c[c.SPARSE_TENSORS = 12] = "SPARSE_TENSORS";
          })(o.AttributeType || (o.AttributeType = {}));
        }((g = p.experimental || (p.experimental = {})).fbs || (g.fbs = {})), function(o) {
          (function(c) {
            (function(f) {
              (function(a) {
                a[a.UNKNOWN = 0] = "UNKNOWN", a[a.VALUE = 1] = "VALUE", a[a.PARAM = 2] = "PARAM";
              })(f.DimensionValueType || (f.DimensionValueType = {}));
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              (function(a) {
                a[a.UNDEFINED = 0] = "UNDEFINED", a[a.FLOAT = 1] = "FLOAT", a[a.UINT8 = 2] = "UINT8", a[a.INT8 = 3] = "INT8", a[a.UINT16 = 4] = "UINT16", a[a.INT16 = 5] = "INT16", a[a.INT32 = 6] = "INT32", a[a.INT64 = 7] = "INT64", a[a.STRING = 8] = "STRING", a[a.BOOL = 9] = "BOOL", a[a.FLOAT16 = 10] = "FLOAT16", a[a.DOUBLE = 11] = "DOUBLE", a[a.UINT32 = 12] = "UINT32", a[a.UINT64 = 13] = "UINT64", a[a.COMPLEX64 = 14] = "COMPLEX64", a[a.COMPLEX128 = 15] = "COMPLEX128", a[a.BFLOAT16 = 16] = "BFLOAT16";
              })(f.TensorDataType || (f.TensorDataType = {}));
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              (function(a) {
                a[a.Primitive = 0] = "Primitive", a[a.Fused = 1] = "Fused";
              })(f.NodeType || (f.NodeType = {}));
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              (function(a) {
                a[a.NONE = 0] = "NONE", a[a.tensor_type = 1] = "tensor_type", a[a.sequence_type = 2] = "sequence_type", a[a.map_type = 3] = "map_type";
              })(f.TypeInfoValue || (f.TypeInfoValue = {}));
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsShape(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsShape(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                dim(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 4);
                  return n ? (e || new o.experimental.fbs.Dimension()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                dimLength() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startShape(t) {
                  t.startObject(1);
                }
                static addDim(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static createDimVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startDimVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static endShape(t) {
                  return t.endObject();
                }
                static createShape(t, e) {
                  return a.startShape(t), a.addDim(t, e), a.endShape(t);
                }
              }
              f.Shape = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsDimension(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsDimension(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                value(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? (t || new o.experimental.fbs.DimensionValue()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                denotation(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                static startDimension(t) {
                  t.startObject(2);
                }
                static addValue(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addDenotation(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static endDimension(t) {
                  return t.endObject();
                }
                static createDimension(t, e, n) {
                  return a.startDimension(t), a.addValue(t, e), a.addDenotation(t, n), a.endDimension(t);
                }
              }
              f.Dimension = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsDimensionValue(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsDimensionValue(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                dimType() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? this.bb.readInt8(this.bb_pos + t) : o.experimental.fbs.DimensionValueType.UNKNOWN;
                }
                dimValue() {
                  let t = this.bb.__offset(this.bb_pos, 6);
                  return t ? this.bb.readInt64(this.bb_pos + t) : this.bb.createLong(0, 0);
                }
                dimParam(t) {
                  let e = this.bb.__offset(this.bb_pos, 8);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                static startDimensionValue(t) {
                  t.startObject(3);
                }
                static addDimType(t, e) {
                  t.addFieldInt8(0, e, o.experimental.fbs.DimensionValueType.UNKNOWN);
                }
                static addDimValue(t, e) {
                  t.addFieldInt64(1, e, t.createLong(0, 0));
                }
                static addDimParam(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static endDimensionValue(t) {
                  return t.endObject();
                }
                static createDimensionValue(t, e, n, r) {
                  return a.startDimensionValue(t), a.addDimType(t, e), a.addDimValue(t, n), a.addDimParam(t, r), a.endDimensionValue(t);
                }
              }
              f.DimensionValue = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsTensorTypeAndShape(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsTensorTypeAndShape(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                elemType() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? this.bb.readInt32(this.bb_pos + t) : o.experimental.fbs.TensorDataType.UNDEFINED;
                }
                shape(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? (t || new o.experimental.fbs.Shape()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                static startTensorTypeAndShape(t) {
                  t.startObject(2);
                }
                static addElemType(t, e) {
                  t.addFieldInt32(0, e, o.experimental.fbs.TensorDataType.UNDEFINED);
                }
                static addShape(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static endTensorTypeAndShape(t) {
                  return t.endObject();
                }
                static createTensorTypeAndShape(t, e, n) {
                  return a.startTensorTypeAndShape(t), a.addElemType(t, e), a.addShape(t, n), a.endTensorTypeAndShape(t);
                }
              }
              f.TensorTypeAndShape = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsMapType(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsMapType(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                keyType() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? this.bb.readInt32(this.bb_pos + t) : o.experimental.fbs.TensorDataType.UNDEFINED;
                }
                valueType(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? (t || new o.experimental.fbs.TypeInfo()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                static startMapType(t) {
                  t.startObject(2);
                }
                static addKeyType(t, e) {
                  t.addFieldInt32(0, e, o.experimental.fbs.TensorDataType.UNDEFINED);
                }
                static addValueType(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static endMapType(t) {
                  return t.endObject();
                }
                static createMapType(t, e, n) {
                  return a.startMapType(t), a.addKeyType(t, e), a.addValueType(t, n), a.endMapType(t);
                }
              }
              f.MapType = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsSequenceType(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsSequenceType(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                elemType(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? (t || new o.experimental.fbs.TypeInfo()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                static startSequenceType(t) {
                  t.startObject(1);
                }
                static addElemType(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static endSequenceType(t) {
                  return t.endObject();
                }
                static createSequenceType(t, e) {
                  return a.startSequenceType(t), a.addElemType(t, e), a.endSequenceType(t);
                }
              }
              f.SequenceType = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (c.fbs || (c.fbs = {})).EdgeEnd = class {
              constructor() {
                this.bb = null, this.bb_pos = 0;
              }
              __init(f, a) {
                return this.bb_pos = f, this.bb = a, this;
              }
              nodeIndex() {
                return this.bb.readUint32(this.bb_pos);
              }
              srcArgIndex() {
                return this.bb.readInt32(this.bb_pos + 4);
              }
              dstArgIndex() {
                return this.bb.readInt32(this.bb_pos + 8);
              }
              static createEdgeEnd(f, a, i, t) {
                return f.prep(4, 12), f.writeInt32(t), f.writeInt32(i), f.writeInt32(a), f.offset();
              }
            };
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsNodeEdge(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsNodeEdge(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                nodeIndex() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? this.bb.readUint32(this.bb_pos + t) : 0;
                }
                inputEdges(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 6);
                  return n ? (e || new o.experimental.fbs.EdgeEnd()).__init(this.bb.__vector(this.bb_pos + n) + 12 * t, this.bb) : null;
                }
                inputEdgesLength() {
                  let t = this.bb.__offset(this.bb_pos, 6);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                outputEdges(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 8);
                  return n ? (e || new o.experimental.fbs.EdgeEnd()).__init(this.bb.__vector(this.bb_pos + n) + 12 * t, this.bb) : null;
                }
                outputEdgesLength() {
                  let t = this.bb.__offset(this.bb_pos, 8);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startNodeEdge(t) {
                  t.startObject(3);
                }
                static addNodeIndex(t, e) {
                  t.addFieldInt32(0, e, 0);
                }
                static addInputEdges(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static startInputEdgesVector(t, e) {
                  t.startVector(12, e, 4);
                }
                static addOutputEdges(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static startOutputEdgesVector(t, e) {
                  t.startVector(12, e, 4);
                }
                static endNodeEdge(t) {
                  return t.endObject();
                }
                static createNodeEdge(t, e, n, r) {
                  return a.startNodeEdge(t), a.addNodeIndex(t, e), a.addInputEdges(t, n), a.addOutputEdges(t, r), a.endNodeEdge(t);
                }
              }
              f.NodeEdge = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsNode(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsNode(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                name(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                docString(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                domain(t) {
                  let e = this.bb.__offset(this.bb_pos, 8);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                sinceVersion() {
                  let t = this.bb.__offset(this.bb_pos, 10);
                  return t ? this.bb.readInt32(this.bb_pos + t) : 0;
                }
                index() {
                  let t = this.bb.__offset(this.bb_pos, 12);
                  return t ? this.bb.readUint32(this.bb_pos + t) : 0;
                }
                opType(t) {
                  let e = this.bb.__offset(this.bb_pos, 14);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                type() {
                  let t = this.bb.__offset(this.bb_pos, 16);
                  return t ? this.bb.readInt32(this.bb_pos + t) : o.experimental.fbs.NodeType.Primitive;
                }
                executionProviderType(t) {
                  let e = this.bb.__offset(this.bb_pos, 18);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                inputs(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 20);
                  return n ? this.bb.__string(this.bb.__vector(this.bb_pos + n) + 4 * t, e) : null;
                }
                inputsLength() {
                  let t = this.bb.__offset(this.bb_pos, 20);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                outputs(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 22);
                  return n ? this.bb.__string(this.bb.__vector(this.bb_pos + n) + 4 * t, e) : null;
                }
                outputsLength() {
                  let t = this.bb.__offset(this.bb_pos, 22);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                attributes(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 24);
                  return n ? (e || new o.experimental.fbs.Attribute()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                attributesLength() {
                  let t = this.bb.__offset(this.bb_pos, 24);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                inputArgCounts(t) {
                  let e = this.bb.__offset(this.bb_pos, 26);
                  return e ? this.bb.readInt32(this.bb.__vector(this.bb_pos + e) + 4 * t) : 0;
                }
                inputArgCountsLength() {
                  let t = this.bb.__offset(this.bb_pos, 26);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                inputArgCountsArray() {
                  let t = this.bb.__offset(this.bb_pos, 26);
                  return t ? new Int32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
                }
                implicitInputs(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 28);
                  return n ? this.bb.__string(this.bb.__vector(this.bb_pos + n) + 4 * t, e) : null;
                }
                implicitInputsLength() {
                  let t = this.bb.__offset(this.bb_pos, 28);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startNode(t) {
                  t.startObject(13);
                }
                static addName(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addDocString(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static addDomain(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static addSinceVersion(t, e) {
                  t.addFieldInt32(3, e, 0);
                }
                static addIndex(t, e) {
                  t.addFieldInt32(4, e, 0);
                }
                static addOpType(t, e) {
                  t.addFieldOffset(5, e, 0);
                }
                static addType(t, e) {
                  t.addFieldInt32(6, e, o.experimental.fbs.NodeType.Primitive);
                }
                static addExecutionProviderType(t, e) {
                  t.addFieldOffset(7, e, 0);
                }
                static addInputs(t, e) {
                  t.addFieldOffset(8, e, 0);
                }
                static createInputsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startInputsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addOutputs(t, e) {
                  t.addFieldOffset(9, e, 0);
                }
                static createOutputsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startOutputsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addAttributes(t, e) {
                  t.addFieldOffset(10, e, 0);
                }
                static createAttributesVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startAttributesVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addInputArgCounts(t, e) {
                  t.addFieldOffset(11, e, 0);
                }
                static createInputArgCountsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addInt32(e[n]);
                  return t.endVector();
                }
                static startInputArgCountsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addImplicitInputs(t, e) {
                  t.addFieldOffset(12, e, 0);
                }
                static createImplicitInputsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startImplicitInputsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static endNode(t) {
                  return t.endObject();
                }
                static createNode(t, e, n, r, s, l, d, m, y, w, _, S, A, P) {
                  return a.startNode(t), a.addName(t, e), a.addDocString(t, n), a.addDomain(t, r), a.addSinceVersion(t, s), a.addIndex(t, l), a.addOpType(t, d), a.addType(t, m), a.addExecutionProviderType(t, y), a.addInputs(t, w), a.addOutputs(t, _), a.addAttributes(t, S), a.addInputArgCounts(t, A), a.addImplicitInputs(t, P), a.endNode(t);
                }
              }
              f.Node = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsValueInfo(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsValueInfo(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                name(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                docString(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                type(t) {
                  let e = this.bb.__offset(this.bb_pos, 8);
                  return e ? (t || new o.experimental.fbs.TypeInfo()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                static startValueInfo(t) {
                  t.startObject(3);
                }
                static addName(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addDocString(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static addType(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static endValueInfo(t) {
                  return t.endObject();
                }
                static createValueInfo(t, e, n, r) {
                  return a.startValueInfo(t), a.addName(t, e), a.addDocString(t, n), a.addType(t, r), a.endValueInfo(t);
                }
              }
              f.ValueInfo = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsTypeInfo(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsTypeInfo(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                denotation(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                valueType() {
                  let t = this.bb.__offset(this.bb_pos, 6);
                  return t ? this.bb.readUint8(this.bb_pos + t) : o.experimental.fbs.TypeInfoValue.NONE;
                }
                value(t) {
                  let e = this.bb.__offset(this.bb_pos, 8);
                  return e ? this.bb.__union(t, this.bb_pos + e) : null;
                }
                static startTypeInfo(t) {
                  t.startObject(3);
                }
                static addDenotation(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addValueType(t, e) {
                  t.addFieldInt8(1, e, o.experimental.fbs.TypeInfoValue.NONE);
                }
                static addValue(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static endTypeInfo(t) {
                  return t.endObject();
                }
                static createTypeInfo(t, e, n, r) {
                  return a.startTypeInfo(t), a.addDenotation(t, e), a.addValueType(t, n), a.addValue(t, r), a.endTypeInfo(t);
                }
              }
              f.TypeInfo = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsOperatorSetId(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsOperatorSetId(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                domain(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                version() {
                  let t = this.bb.__offset(this.bb_pos, 6);
                  return t ? this.bb.readInt64(this.bb_pos + t) : this.bb.createLong(0, 0);
                }
                static startOperatorSetId(t) {
                  t.startObject(2);
                }
                static addDomain(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addVersion(t, e) {
                  t.addFieldInt64(1, e, t.createLong(0, 0));
                }
                static endOperatorSetId(t) {
                  return t.endObject();
                }
                static createOperatorSetId(t, e, n) {
                  return a.startOperatorSetId(t), a.addDomain(t, e), a.addVersion(t, n), a.endOperatorSetId(t);
                }
              }
              f.OperatorSetId = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsTensor(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsTensor(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                name(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                docString(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                dims(t) {
                  let e = this.bb.__offset(this.bb_pos, 8);
                  return e ? this.bb.readInt64(this.bb.__vector(this.bb_pos + e) + 8 * t) : this.bb.createLong(0, 0);
                }
                dimsLength() {
                  let t = this.bb.__offset(this.bb_pos, 8);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                dataType() {
                  let t = this.bb.__offset(this.bb_pos, 10);
                  return t ? this.bb.readInt32(this.bb_pos + t) : o.experimental.fbs.TensorDataType.UNDEFINED;
                }
                rawData(t) {
                  let e = this.bb.__offset(this.bb_pos, 12);
                  return e ? this.bb.readUint8(this.bb.__vector(this.bb_pos + e) + t) : 0;
                }
                rawDataLength() {
                  let t = this.bb.__offset(this.bb_pos, 12);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                rawDataArray() {
                  let t = this.bb.__offset(this.bb_pos, 12);
                  return t ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
                }
                stringData(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 14);
                  return n ? this.bb.__string(this.bb.__vector(this.bb_pos + n) + 4 * t, e) : null;
                }
                stringDataLength() {
                  let t = this.bb.__offset(this.bb_pos, 14);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startTensor(t) {
                  t.startObject(6);
                }
                static addName(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addDocString(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static addDims(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static createDimsVector(t, e) {
                  t.startVector(8, e.length, 8);
                  for (let n = e.length - 1; n >= 0; n--) t.addInt64(e[n]);
                  return t.endVector();
                }
                static startDimsVector(t, e) {
                  t.startVector(8, e, 8);
                }
                static addDataType(t, e) {
                  t.addFieldInt32(3, e, o.experimental.fbs.TensorDataType.UNDEFINED);
                }
                static addRawData(t, e) {
                  t.addFieldOffset(4, e, 0);
                }
                static createRawDataVector(t, e) {
                  t.startVector(1, e.length, 1);
                  for (let n = e.length - 1; n >= 0; n--) t.addInt8(e[n]);
                  return t.endVector();
                }
                static startRawDataVector(t, e) {
                  t.startVector(1, e, 1);
                }
                static addStringData(t, e) {
                  t.addFieldOffset(5, e, 0);
                }
                static createStringDataVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startStringDataVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static endTensor(t) {
                  return t.endObject();
                }
                static createTensor(t, e, n, r, s, l, d) {
                  return a.startTensor(t), a.addName(t, e), a.addDocString(t, n), a.addDims(t, r), a.addDataType(t, s), a.addRawData(t, l), a.addStringData(t, d), a.endTensor(t);
                }
              }
              f.Tensor = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsSparseTensor(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsSparseTensor(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                values(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? (t || new o.experimental.fbs.Tensor()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                indices(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? (t || new o.experimental.fbs.Tensor()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                dims(t) {
                  let e = this.bb.__offset(this.bb_pos, 8);
                  return e ? this.bb.readInt64(this.bb.__vector(this.bb_pos + e) + 8 * t) : this.bb.createLong(0, 0);
                }
                dimsLength() {
                  let t = this.bb.__offset(this.bb_pos, 8);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startSparseTensor(t) {
                  t.startObject(3);
                }
                static addValues(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addIndices(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static addDims(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static createDimsVector(t, e) {
                  t.startVector(8, e.length, 8);
                  for (let n = e.length - 1; n >= 0; n--) t.addInt64(e[n]);
                  return t.endVector();
                }
                static startDimsVector(t, e) {
                  t.startVector(8, e, 8);
                }
                static endSparseTensor(t) {
                  return t.endObject();
                }
                static createSparseTensor(t, e, n, r) {
                  return a.startSparseTensor(t), a.addValues(t, e), a.addIndices(t, n), a.addDims(t, r), a.endSparseTensor(t);
                }
              }
              f.SparseTensor = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsAttribute(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsAttribute(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                name(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                docString(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                type() {
                  let t = this.bb.__offset(this.bb_pos, 8);
                  return t ? this.bb.readInt32(this.bb_pos + t) : o.experimental.fbs.AttributeType.UNDEFINED;
                }
                f() {
                  let t = this.bb.__offset(this.bb_pos, 10);
                  return t ? this.bb.readFloat32(this.bb_pos + t) : 0;
                }
                i() {
                  let t = this.bb.__offset(this.bb_pos, 12);
                  return t ? this.bb.readInt64(this.bb_pos + t) : this.bb.createLong(0, 0);
                }
                s(t) {
                  let e = this.bb.__offset(this.bb_pos, 14);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                t(t) {
                  let e = this.bb.__offset(this.bb_pos, 16);
                  return e ? (t || new o.experimental.fbs.Tensor()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                g(t) {
                  let e = this.bb.__offset(this.bb_pos, 18);
                  return e ? (t || new o.experimental.fbs.Graph()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                floats(t) {
                  let e = this.bb.__offset(this.bb_pos, 20);
                  return e ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + e) + 4 * t) : 0;
                }
                floatsLength() {
                  let t = this.bb.__offset(this.bb_pos, 20);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                floatsArray() {
                  let t = this.bb.__offset(this.bb_pos, 20);
                  return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
                }
                ints(t) {
                  let e = this.bb.__offset(this.bb_pos, 22);
                  return e ? this.bb.readInt64(this.bb.__vector(this.bb_pos + e) + 8 * t) : this.bb.createLong(0, 0);
                }
                intsLength() {
                  let t = this.bb.__offset(this.bb_pos, 22);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                strings(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 24);
                  return n ? this.bb.__string(this.bb.__vector(this.bb_pos + n) + 4 * t, e) : null;
                }
                stringsLength() {
                  let t = this.bb.__offset(this.bb_pos, 24);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                tensors(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 26);
                  return n ? (e || new o.experimental.fbs.Tensor()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                tensorsLength() {
                  let t = this.bb.__offset(this.bb_pos, 26);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                graphs(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 28);
                  return n ? (e || new o.experimental.fbs.Graph()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                graphsLength() {
                  let t = this.bb.__offset(this.bb_pos, 28);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startAttribute(t) {
                  t.startObject(13);
                }
                static addName(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addDocString(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static addType(t, e) {
                  t.addFieldInt32(2, e, o.experimental.fbs.AttributeType.UNDEFINED);
                }
                static addF(t, e) {
                  t.addFieldFloat32(3, e, 0);
                }
                static addI(t, e) {
                  t.addFieldInt64(4, e, t.createLong(0, 0));
                }
                static addS(t, e) {
                  t.addFieldOffset(5, e, 0);
                }
                static addT(t, e) {
                  t.addFieldOffset(6, e, 0);
                }
                static addG(t, e) {
                  t.addFieldOffset(7, e, 0);
                }
                static addFloats(t, e) {
                  t.addFieldOffset(8, e, 0);
                }
                static createFloatsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addFloat32(e[n]);
                  return t.endVector();
                }
                static startFloatsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addInts(t, e) {
                  t.addFieldOffset(9, e, 0);
                }
                static createIntsVector(t, e) {
                  t.startVector(8, e.length, 8);
                  for (let n = e.length - 1; n >= 0; n--) t.addInt64(e[n]);
                  return t.endVector();
                }
                static startIntsVector(t, e) {
                  t.startVector(8, e, 8);
                }
                static addStrings(t, e) {
                  t.addFieldOffset(10, e, 0);
                }
                static createStringsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startStringsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addTensors(t, e) {
                  t.addFieldOffset(11, e, 0);
                }
                static createTensorsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startTensorsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addGraphs(t, e) {
                  t.addFieldOffset(12, e, 0);
                }
                static createGraphsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startGraphsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static endAttribute(t) {
                  return t.endObject();
                }
                static createAttribute(t, e, n, r, s, l, d, m, y, w, _, S, A, P) {
                  return a.startAttribute(t), a.addName(t, e), a.addDocString(t, n), a.addType(t, r), a.addF(t, s), a.addI(t, l), a.addS(t, d), a.addT(t, m), a.addG(t, y), a.addFloats(t, w), a.addInts(t, _), a.addStrings(t, S), a.addTensors(t, A), a.addGraphs(t, P), a.endAttribute(t);
                }
              }
              f.Attribute = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsGraph(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsGraph(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                initializers(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 4);
                  return n ? (e || new o.experimental.fbs.Tensor()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                initializersLength() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                nodeArgs(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 6);
                  return n ? (e || new o.experimental.fbs.ValueInfo()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                nodeArgsLength() {
                  let t = this.bb.__offset(this.bb_pos, 6);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                nodes(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 8);
                  return n ? (e || new o.experimental.fbs.Node()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                nodesLength() {
                  let t = this.bb.__offset(this.bb_pos, 8);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                maxNodeIndex() {
                  let t = this.bb.__offset(this.bb_pos, 10);
                  return t ? this.bb.readUint32(this.bb_pos + t) : 0;
                }
                nodeEdges(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 12);
                  return n ? (e || new o.experimental.fbs.NodeEdge()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                nodeEdgesLength() {
                  let t = this.bb.__offset(this.bb_pos, 12);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                inputs(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 14);
                  return n ? this.bb.__string(this.bb.__vector(this.bb_pos + n) + 4 * t, e) : null;
                }
                inputsLength() {
                  let t = this.bb.__offset(this.bb_pos, 14);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                outputs(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 16);
                  return n ? this.bb.__string(this.bb.__vector(this.bb_pos + n) + 4 * t, e) : null;
                }
                outputsLength() {
                  let t = this.bb.__offset(this.bb_pos, 16);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                sparseInitializers(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 18);
                  return n ? (e || new o.experimental.fbs.SparseTensor()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                sparseInitializersLength() {
                  let t = this.bb.__offset(this.bb_pos, 18);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startGraph(t) {
                  t.startObject(8);
                }
                static addInitializers(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static createInitializersVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startInitializersVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addNodeArgs(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static createNodeArgsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startNodeArgsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addNodes(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static createNodesVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startNodesVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addMaxNodeIndex(t, e) {
                  t.addFieldInt32(3, e, 0);
                }
                static addNodeEdges(t, e) {
                  t.addFieldOffset(4, e, 0);
                }
                static createNodeEdgesVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startNodeEdgesVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addInputs(t, e) {
                  t.addFieldOffset(5, e, 0);
                }
                static createInputsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startInputsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addOutputs(t, e) {
                  t.addFieldOffset(6, e, 0);
                }
                static createOutputsVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startOutputsVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addSparseInitializers(t, e) {
                  t.addFieldOffset(7, e, 0);
                }
                static createSparseInitializersVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startSparseInitializersVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static endGraph(t) {
                  return t.endObject();
                }
                static createGraph(t, e, n, r, s, l, d, m, y) {
                  return a.startGraph(t), a.addInitializers(t, e), a.addNodeArgs(t, n), a.addNodes(t, r), a.addMaxNodeIndex(t, s), a.addNodeEdges(t, l), a.addInputs(t, d), a.addOutputs(t, m), a.addSparseInitializers(t, y), a.endGraph(t);
                }
              }
              f.Graph = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsModel(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsModel(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                irVersion() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? this.bb.readInt64(this.bb_pos + t) : this.bb.createLong(0, 0);
                }
                opsetImport(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 6);
                  return n ? (e || new o.experimental.fbs.OperatorSetId()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                opsetImportLength() {
                  let t = this.bb.__offset(this.bb_pos, 6);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                producerName(t) {
                  let e = this.bb.__offset(this.bb_pos, 8);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                producerVersion(t) {
                  let e = this.bb.__offset(this.bb_pos, 10);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                domain(t) {
                  let e = this.bb.__offset(this.bb_pos, 12);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                modelVersion() {
                  let t = this.bb.__offset(this.bb_pos, 14);
                  return t ? this.bb.readInt64(this.bb_pos + t) : this.bb.createLong(0, 0);
                }
                docString(t) {
                  let e = this.bb.__offset(this.bb_pos, 16);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                graph(t) {
                  let e = this.bb.__offset(this.bb_pos, 18);
                  return e ? (t || new o.experimental.fbs.Graph()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                graphDocString(t) {
                  let e = this.bb.__offset(this.bb_pos, 20);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                static startModel(t) {
                  t.startObject(9);
                }
                static addIrVersion(t, e) {
                  t.addFieldInt64(0, e, t.createLong(0, 0));
                }
                static addOpsetImport(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static createOpsetImportVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startOpsetImportVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addProducerName(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static addProducerVersion(t, e) {
                  t.addFieldOffset(3, e, 0);
                }
                static addDomain(t, e) {
                  t.addFieldOffset(4, e, 0);
                }
                static addModelVersion(t, e) {
                  t.addFieldInt64(5, e, t.createLong(0, 0));
                }
                static addDocString(t, e) {
                  t.addFieldOffset(6, e, 0);
                }
                static addGraph(t, e) {
                  t.addFieldOffset(7, e, 0);
                }
                static addGraphDocString(t, e) {
                  t.addFieldOffset(8, e, 0);
                }
                static endModel(t) {
                  return t.endObject();
                }
                static createModel(t, e, n, r, s, l, d, m, y, w) {
                  return a.startModel(t), a.addIrVersion(t, e), a.addOpsetImport(t, n), a.addProducerName(t, r), a.addProducerVersion(t, s), a.addDomain(t, l), a.addModelVersion(t, d), a.addDocString(t, m), a.addGraph(t, y), a.addGraphDocString(t, w), a.endModel(t);
                }
              }
              f.Model = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsKernelCreateInfos(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsKernelCreateInfos(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                nodeIndices(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.readUint32(this.bb.__vector(this.bb_pos + e) + 4 * t) : 0;
                }
                nodeIndicesLength() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                nodeIndicesArray() {
                  let t = this.bb.__offset(this.bb_pos, 4);
                  return t ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
                }
                kernelDefHashes(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? this.bb.readUint64(this.bb.__vector(this.bb_pos + e) + 8 * t) : this.bb.createLong(0, 0);
                }
                kernelDefHashesLength() {
                  let t = this.bb.__offset(this.bb_pos, 6);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startKernelCreateInfos(t) {
                  t.startObject(2);
                }
                static addNodeIndices(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static createNodeIndicesVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addInt32(e[n]);
                  return t.endVector();
                }
                static startNodeIndicesVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static addKernelDefHashes(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static createKernelDefHashesVector(t, e) {
                  t.startVector(8, e.length, 8);
                  for (let n = e.length - 1; n >= 0; n--) t.addInt64(e[n]);
                  return t.endVector();
                }
                static startKernelDefHashesVector(t, e) {
                  t.startVector(8, e, 8);
                }
                static endKernelCreateInfos(t) {
                  return t.endObject();
                }
                static createKernelCreateInfos(t, e, n) {
                  return a.startKernelCreateInfos(t), a.addNodeIndices(t, e), a.addKernelDefHashes(t, n), a.endKernelCreateInfos(t);
                }
              }
              f.KernelCreateInfos = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsSubGraphSessionState(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsSubGraphSessionState(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                graphId(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                sessionState(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? (t || new o.experimental.fbs.SessionState()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                static startSubGraphSessionState(t) {
                  t.startObject(2);
                }
                static addGraphId(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addSessionState(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static endSubGraphSessionState(t) {
                  let e = t.endObject();
                  return t.requiredField(e, 4), e;
                }
                static createSubGraphSessionState(t, e, n) {
                  return a.startSubGraphSessionState(t), a.addGraphId(t, e), a.addSessionState(t, n), a.endSubGraphSessionState(t);
                }
              }
              f.SubGraphSessionState = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsSessionState(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsSessionState(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                kernels(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? (t || new o.experimental.fbs.KernelCreateInfos()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                subGraphSessionStates(t, e) {
                  let n = this.bb.__offset(this.bb_pos, 6);
                  return n ? (e || new o.experimental.fbs.SubGraphSessionState()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + n) + 4 * t), this.bb) : null;
                }
                subGraphSessionStatesLength() {
                  let t = this.bb.__offset(this.bb_pos, 6);
                  return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
                }
                static startSessionState(t) {
                  t.startObject(2);
                }
                static addKernels(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addSubGraphSessionStates(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static createSubGraphSessionStatesVector(t, e) {
                  t.startVector(4, e.length, 4);
                  for (let n = e.length - 1; n >= 0; n--) t.addOffset(e[n]);
                  return t.endVector();
                }
                static startSubGraphSessionStatesVector(t, e) {
                  t.startVector(4, e, 4);
                }
                static endSessionState(t) {
                  return t.endObject();
                }
                static createSessionState(t, e, n) {
                  return a.startSessionState(t), a.addKernels(t, e), a.addSubGraphSessionStates(t, n), a.endSessionState(t);
                }
              }
              f.SessionState = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class a {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsInferenceSession(t, e) {
                  return (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsInferenceSession(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new a()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static bufferHasIdentifier(t) {
                  return t.__has_identifier("ORTM");
                }
                ortVersion(t) {
                  let e = this.bb.__offset(this.bb_pos, 4);
                  return e ? this.bb.__string(this.bb_pos + e, t) : null;
                }
                model(t) {
                  let e = this.bb.__offset(this.bb_pos, 6);
                  return e ? (t || new o.experimental.fbs.Model()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                sessionState(t) {
                  let e = this.bb.__offset(this.bb_pos, 8);
                  return e ? (t || new o.experimental.fbs.SessionState()).__init(this.bb.__indirect(this.bb_pos + e), this.bb) : null;
                }
                static startInferenceSession(t) {
                  t.startObject(3);
                }
                static addOrtVersion(t, e) {
                  t.addFieldOffset(0, e, 0);
                }
                static addModel(t, e) {
                  t.addFieldOffset(1, e, 0);
                }
                static addSessionState(t, e) {
                  t.addFieldOffset(2, e, 0);
                }
                static endInferenceSession(t) {
                  return t.endObject();
                }
                static finishInferenceSessionBuffer(t, e) {
                  t.finish(e, "ORTM");
                }
                static finishSizePrefixedInferenceSessionBuffer(t, e) {
                  t.finish(e, "ORTM", !0);
                }
                static createInferenceSession(t, e, n, r) {
                  return a.startInferenceSession(t), a.addOrtVersion(t, e), a.addModel(t, n), a.addSessionState(t, r), a.endInferenceSession(t);
                }
              }
              f.InferenceSession = a;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {}));
      }, 7448: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.OnnxjsSessionHandler = void 0;
        const h = b(1670), p = b(9162);
        u.OnnxjsSessionHandler = class {
          constructor(g) {
            this.session = g, this.inputNames = this.session.inputNames, this.outputNames = this.session.outputNames;
          }
          async dispose() {
          }
          async run(g, o, c) {
            const f = /* @__PURE__ */ new Map();
            for (const t in g) if (Object.hasOwnProperty.call(g, t)) {
              const e = g[t];
              f.set(t, new p.Tensor(e.dims, e.type, void 0, void 0, e.data));
            }
            const a = await this.session.run(f), i = {};
            return a.forEach((t, e) => {
              i[e] = new h.Tensor(t.type, t.data, t.dims);
            }), i;
          }
          startProfiling() {
            this.session.startProfiling();
          }
          endProfiling() {
            this.session.endProfiling();
          }
        };
      }, 6919: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Session = void 0;
        const h = b(7067), p = b(1296), g = b(7091), o = b(1036), c = b(6231), f = b(2644);
        u.Session = class {
          constructor(a = {}) {
            this._initialized = !1, this.backendHint = a.backendHint, this.profiler = c.Profiler.create(a.profiler), this.context = { profiler: this.profiler, graphInputTypes: [], graphInputDims: [] };
          }
          get inputNames() {
            return this._model.graph.getInputNames();
          }
          get outputNames() {
            return this._model.graph.getOutputNames();
          }
          startProfiling() {
            this.profiler.start();
          }
          endProfiling() {
            this.profiler.stop();
          }
          async loadModel(a, i, t) {
            await this.profiler.event("session", "Session.loadModel", async () => {
              const e = await (0, g.resolveBackend)(this.backendHint);
              if (this.sessionHandler = e.createSessionHandler(this.context), this._model = new f.Model(), typeof a == "string") {
                const n = a.endsWith(".ort");
                if (typeof fetch > "u") {
                  const r = await (0, p.promisify)(h.readFile)(a);
                  this.initialize(r, n);
                } else {
                  const r = await fetch(a), s = await r.arrayBuffer();
                  this.initialize(new Uint8Array(s), n);
                }
              } else if (ArrayBuffer.isView(a)) this.initialize(a);
              else {
                const n = new Uint8Array(a, i || 0, t || a.byteLength);
                this.initialize(n);
              }
            });
          }
          initialize(a, i) {
            if (this._initialized) throw new Error("already initialized");
            this.profiler.event("session", "Session.initialize", () => {
              const t = this.sessionHandler.transformGraph ? this.sessionHandler : void 0;
              this._model.load(a, t, i), this.sessionHandler.onGraphInitialized && this.sessionHandler.onGraphInitialized(this._model.graph), this.initializeOps(this._model.graph), this._executionPlan = new o.ExecutionPlan(this._model.graph, this._ops, this.profiler);
            }), this._initialized = !0;
          }
          async run(a) {
            if (!this._initialized) throw new Error("session not initialized yet");
            return this.profiler.event("session", "Session.run", async () => {
              const i = this.normalizeAndValidateInputs(a), t = await this._executionPlan.execute(this.sessionHandler, i);
              return this.createOutput(t);
            });
          }
          normalizeAndValidateInputs(a) {
            const i = this._model.graph.getInputNames();
            if (Array.isArray(a)) {
              if (a.length !== i.length) throw new Error(`incorrect input array length: expected ${i.length} but got ${a.length}`);
            } else {
              if (a.size !== i.length) throw new Error(`incorrect input map size: expected ${i.length} but got ${a.size}`);
              const t = new Array(a.size);
              let e = 0;
              for (let n = 0; n < i.length; ++n) {
                const r = a.get(i[n]);
                if (!r) throw new Error(`missing input tensor for: '${name}'`);
                t[e++] = r;
              }
              a = t;
            }
            if (this.context.graphInputTypes && this.context.graphInputTypes.length !== 0 && this.context.graphInputDims && this.context.graphInputDims.length !== 0) this.validateInputTensorDims(this.context.graphInputDims, a, !1);
            else {
              const t = this._model.graph.getInputIndices(), e = this._model.graph.getValues(), n = new Array(t.length);
              for (let r = 0; r < t.length; ++r) {
                const s = e[t[r]];
                n[r] = s.type.shape.dims, this.context.graphInputTypes.push(s.type.tensorType), this.context.graphInputDims.push(a[r].dims);
              }
              this.validateInputTensorDims(n, a, !0);
            }
            return this.validateInputTensorTypes(this.context.graphInputTypes, a), a;
          }
          validateInputTensorTypes(a, i) {
            for (let t = 0; t < i.length; t++) {
              const e = a[t], n = i[t].type;
              if (e !== n) throw new Error(`input tensor[${t}] check failed: expected type '${e}' but got ${n}`);
            }
          }
          validateInputTensorDims(a, i, t) {
            for (let e = 0; e < i.length; e++) {
              const n = a[e], r = i[e].dims;
              if (!this.compareTensorDims(n, r, t)) throw new Error(`input tensor[${e}] check failed: expected shape '[${n.join(",")}]' but got [${r.join(",")}]`);
            }
          }
          compareTensorDims(a, i, t) {
            if (a.length !== i.length) return !1;
            for (let e = 0; e < a.length; ++e) if (a[e] !== i[e] && (!t || a[e] !== 0)) return !1;
            return !0;
          }
          createOutput(a) {
            const i = this._model.graph.getOutputNames();
            if (a.length !== i.length) throw new Error("expected number of outputs do not match number of generated outputs");
            const t = /* @__PURE__ */ new Map();
            for (let e = 0; e < i.length; ++e) t.set(i[e], a[e]);
            return t;
          }
          initializeOps(a) {
            const i = a.getNodes();
            this._ops = new Array(i.length);
            for (let t = 0; t < i.length; t++) this._ops[t] = this.sessionHandler.resolve(i[t], this._model.opsets, a);
          }
        };
      }, 9162: function(C, u, b) {
        var h = this && this.__importDefault || function(s) {
          return s && s.__esModule ? s : { default: s };
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Tensor = void 0;
        const p = b(3442), g = h(b(3720)), o = b(1446), c = b(9395), f = b(2517);
        var a = c.onnxruntime.experimental.fbs;
        class i {
          get data() {
            if (this.cache === void 0) {
              const l = this.dataProvider(this.dataId);
              if (l.length !== this.size) throw new Error("Length of data provided by the Data Provider is inconsistent with the dims of this Tensor.");
              this.cache = l;
            }
            return this.cache;
          }
          get stringData() {
            if (this.type !== "string") throw new TypeError("data type is not string");
            return this.data;
          }
          get integerData() {
            switch (this.type) {
              case "uint8":
              case "int8":
              case "uint16":
              case "int16":
              case "int32":
              case "uint32":
              case "bool":
                return this.data;
              default:
                throw new TypeError("data type is not integer (uint8, int8, uint16, int16, int32, uint32, bool)");
            }
          }
          get floatData() {
            switch (this.type) {
              case "float32":
              case "float64":
                return this.data;
              default:
                throw new TypeError("data type is not float (float32, float64)");
            }
          }
          get numberData() {
            if (this.type !== "string") return this.data;
            throw new TypeError("type cannot be non-number (string)");
          }
          get(l) {
            return this.data[f.ShapeUtil.indicesToOffset(l, this.strides)];
          }
          set(l, d) {
            this.data[f.ShapeUtil.indicesToOffset(l, this.strides)] = d;
          }
          async getData() {
            return this.cache === void 0 && (this.cache = await this.asyncDataProvider(this.dataId)), this.cache;
          }
          get strides() {
            return this._strides || (this._strides = f.ShapeUtil.computeStrides(this.dims)), this._strides;
          }
          constructor(l, d, m, y, w, _ = p.Guid.create()) {
            this.dims = l, this.type = d, this.dataProvider = m, this.asyncDataProvider = y, this.cache = w, this.dataId = _, this.size = f.ShapeUtil.validateDimsAndCalcSize(l);
            const S = this.size, A = m === void 0 && y === void 0 && w === void 0;
            if (w !== void 0 && w.length !== S) throw new RangeError("Input dims doesn't match data length.");
            if (d === "string") {
              if (!(w === void 0 || Array.isArray(w) && w.every((P) => typeof P == "string"))) throw new TypeError("cache should be a string array");
              A && (this.cache = new Array(S));
            } else {
              if (w !== void 0) {
                const P = e(d);
                if (!(w instanceof P)) throw new TypeError(`cache should be type ${P.name}`);
              }
              if (A) {
                const P = new ArrayBuffer(S * function(v) {
                  switch (v) {
                    case "bool":
                    case "int8":
                    case "uint8":
                      return 1;
                    case "int16":
                    case "uint16":
                      return 2;
                    case "int32":
                    case "uint32":
                    case "float32":
                      return 4;
                    case "float64":
                      return 8;
                    default:
                      throw new Error(`cannot calculate sizeof() on type ${v}`);
                  }
                }(d));
                this.cache = function(v, R) {
                  return new (e(R))(v);
                }(P, d);
              }
            }
          }
          static fromProto(l) {
            if (!l) throw new Error("cannot construct Value from an empty tensor");
            const d = f.ProtoUtil.tensorDataTypeFromProto(l.dataType), m = f.ProtoUtil.tensorDimsFromProto(l.dims), y = new i(m, d);
            if (d === "string") l.stringData.forEach((w, _) => {
              y.data[_] = (0, f.decodeUtf8String)(w);
            });
            else if (l.rawData && typeof l.rawData.byteLength == "number" && l.rawData.byteLength > 0) {
              const w = y.data, _ = new DataView(l.rawData.buffer, l.rawData.byteOffset, l.rawData.byteLength), S = t(l.dataType), A = l.rawData.byteLength / S;
              if (l.rawData.byteLength % S != 0) throw new Error("invalid buffer length");
              if (w.length !== A) throw new Error("buffer length mismatch");
              for (let P = 0; P < A; P++) {
                const v = r(_, l.dataType, P * S);
                w[P] = v;
              }
            } else {
              let w;
              switch (l.dataType) {
                case o.onnx.TensorProto.DataType.FLOAT:
                  w = l.floatData;
                  break;
                case o.onnx.TensorProto.DataType.INT32:
                case o.onnx.TensorProto.DataType.INT16:
                case o.onnx.TensorProto.DataType.UINT16:
                case o.onnx.TensorProto.DataType.INT8:
                case o.onnx.TensorProto.DataType.UINT8:
                case o.onnx.TensorProto.DataType.BOOL:
                  w = l.int32Data;
                  break;
                case o.onnx.TensorProto.DataType.INT64:
                  w = l.int64Data;
                  break;
                case o.onnx.TensorProto.DataType.DOUBLE:
                  w = l.doubleData;
                  break;
                case o.onnx.TensorProto.DataType.UINT32:
                case o.onnx.TensorProto.DataType.UINT64:
                  w = l.uint64Data;
                  break;
                default:
                  throw new Error("unspecific error");
              }
              if (w == null) throw new Error("failed to populate data from a tensorproto value");
              const _ = y.data;
              if (_.length !== w.length) throw new Error("array length mismatch");
              for (let S = 0; S < w.length; S++) {
                const A = w[S];
                g.default.isLong(A) ? _[S] = n(A, l.dataType) : _[S] = A;
              }
            }
            return y;
          }
          static fromData(l, d, m) {
            return new i(d, m, void 0, void 0, l);
          }
          static fromOrtTensor(l) {
            if (!l) throw new Error("cannot construct Value from an empty tensor");
            const d = f.ProtoUtil.tensorDimsFromORTFormat(l), m = f.ProtoUtil.tensorDataTypeFromProto(l.dataType()), y = new i(d, m);
            if (m === "string") for (let w = 0; w < l.stringDataLength(); w++) y.data[w] = l.stringData(w);
            else if (l.rawDataArray() && typeof l.rawDataLength() == "number" && l.rawDataLength() > 0) {
              const w = y.data, _ = new DataView(l.rawDataArray().buffer, l.rawDataArray().byteOffset, l.rawDataLength()), S = t(l.dataType()), A = l.rawDataLength() / S;
              if (l.rawDataLength() % S != 0) throw new Error("invalid buffer length");
              if (w.length !== A) throw new Error("buffer length mismatch");
              for (let P = 0; P < A; P++) {
                const v = r(_, l.dataType(), P * S);
                w[P] = v;
              }
            }
            return y;
          }
        }
        function t(s) {
          switch (s) {
            case o.onnx.TensorProto.DataType.UINT8:
            case o.onnx.TensorProto.DataType.INT8:
            case o.onnx.TensorProto.DataType.BOOL:
              return 1;
            case o.onnx.TensorProto.DataType.UINT16:
            case o.onnx.TensorProto.DataType.INT16:
              return 2;
            case o.onnx.TensorProto.DataType.FLOAT:
            case o.onnx.TensorProto.DataType.INT32:
            case o.onnx.TensorProto.DataType.UINT32:
              return 4;
            case o.onnx.TensorProto.DataType.INT64:
            case o.onnx.TensorProto.DataType.DOUBLE:
            case o.onnx.TensorProto.DataType.UINT64:
              return 8;
            default:
              throw new Error(`cannot calculate sizeof() on type ${o.onnx.TensorProto.DataType[s]}`);
          }
        }
        function e(s) {
          switch (s) {
            case "bool":
            case "uint8":
              return Uint8Array;
            case "int8":
              return Int8Array;
            case "int16":
              return Int16Array;
            case "uint16":
              return Uint16Array;
            case "int32":
              return Int32Array;
            case "uint32":
              return Uint32Array;
            case "float32":
              return Float32Array;
            case "float64":
              return Float64Array;
            default:
              throw new Error("unspecified error");
          }
        }
        function n(s, l) {
          if (l === o.onnx.TensorProto.DataType.INT64 || l === a.TensorDataType.INT64) {
            if (s.greaterThanOrEqual(2147483648) || s.lessThan(-2147483648)) throw new TypeError("int64 is not supported");
          } else {
            if (l !== o.onnx.TensorProto.DataType.UINT32 && l !== a.TensorDataType.UINT32 && l !== o.onnx.TensorProto.DataType.UINT64 && l !== a.TensorDataType.UINT64) throw new TypeError(`not a LONG type: ${o.onnx.TensorProto.DataType[l]}`);
            if (s.greaterThanOrEqual(4294967296) || s.lessThan(0)) throw new TypeError("uint64 is not supported");
          }
          return s.toNumber();
        }
        function r(s, l, d) {
          switch (l) {
            case o.onnx.TensorProto.DataType.BOOL:
            case o.onnx.TensorProto.DataType.UINT8:
              return s.getUint8(d);
            case o.onnx.TensorProto.DataType.INT8:
              return s.getInt8(d);
            case o.onnx.TensorProto.DataType.UINT16:
              return s.getUint16(d, !0);
            case o.onnx.TensorProto.DataType.INT16:
              return s.getInt16(d, !0);
            case o.onnx.TensorProto.DataType.FLOAT:
              return s.getFloat32(d, !0);
            case o.onnx.TensorProto.DataType.INT32:
              return s.getInt32(d, !0);
            case o.onnx.TensorProto.DataType.UINT32:
              return s.getUint32(d, !0);
            case o.onnx.TensorProto.DataType.INT64:
              return n(g.default.fromBits(s.getUint32(d, !0), s.getUint32(d + 4, !0), !1), l);
            case o.onnx.TensorProto.DataType.DOUBLE:
              return s.getFloat64(d, !0);
            case o.onnx.TensorProto.DataType.UINT64:
              return n(g.default.fromBits(s.getUint32(d, !0), s.getUint32(d + 4, !0), !0), l);
            default:
              throw new Error(`cannot read from DataView for type ${o.onnx.TensorProto.DataType[l]}`);
          }
        }
        u.Tensor = i;
      }, 2517: function(C, u, b) {
        var h = this && this.__importDefault || function(l) {
          return l && l.__esModule ? l : { default: l };
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.decodeUtf8String = u.MAX_CLIP = u.MIN_CLIP = u.PoolConvUtil = u.ReduceUtil = u.SplitUtil = u.MathUtil = u.ShapeUtil = u.LongUtil = u.ProtoUtil = u.GemmUtil = u.arrayCopyHelper = u.BroadcastUtil = u.MatMulUtil = u.ArrayUtil = u.assert = u.checkInputsShape = void 0;
        const p = b(5686), g = h(b(3720)), o = b(1446), c = b(9162);
        u.checkInputsShape = function(l, ...d) {
          if (!l || l.length !== d.length) return !1;
          for (let m = 0; m < l.length; m++) if (!l[m].dims || l[m].dims.length !== d[m]) return !1;
          return !0;
        }, u.assert = function(l, d) {
          if (!l) throw new Error(typeof d == "string" ? d : d());
        }, u.ArrayUtil = class {
          static arraysEqual(l, d) {
            if (l.length !== d.length) return !1;
            for (let m = 0; m < l.length; m++) if (l[m] !== d[m]) return !1;
            return !0;
          }
        };
        class f {
          static preprocessInputShapes(d, m) {
            return [d.length === 1 ? [1, d[0]] : d, m.length === 1 ? [m[0], 1] : m];
          }
          static postprocessOutputShape(d, m, y) {
            m === 1 && d.splice(d.length - 2, 1), y === 1 && d.pop();
          }
          static calcMatMulShape(d, m) {
            return d[1] !== m[0] ? void 0 : [d[0], m[1]];
          }
        }
        u.MatMulUtil = f;
        class a {
          static calcShape(d, m, y = !1) {
            const w = d.length, _ = m.length;
            if (w === 0) return m;
            if (_ === 0) return d;
            const S = Math.max(d.length, m.length), A = new Array(S);
            if (y) {
              if (w < 2 || _ < 2) return;
              const P = f.calcMatMulShape([d[w - 2], d[w - 1]], [m[_ - 2], m[_ - 1]]);
              if (P === void 0) return;
              [A[S - 2], A[S - 1]] = P;
            }
            for (let P = y ? 3 : 1; P <= S; P++) {
              const v = w - P < 0 ? 1 : d[w - P], R = _ - P < 0 ? 1 : m[_ - P];
              if (v !== R && v > 1 && R > 1) return;
              A[S - P] = Math.max(v, R);
            }
            return A;
          }
          static index(d, m) {
            const y = new Array(m.length);
            return a.fillIndex(d, m, y), y;
          }
          static fillIndex(d, m, y) {
            const w = d.length - m.length;
            for (let _ = 0; _ < m.length; _++) y[_] = d[w + _] % m[_];
          }
          static calc(d, m, y, w, _) {
            const S = a.calcShape(d.dims, m.dims);
            if (S) {
              if (w && !e.areEqual(S, d.dims)) return;
              const A = e.size(S), P = w ? d : new c.Tensor(S, _ || d.type);
              if (S.length === 0) P.set([], y(d.get([]), m.get([])));
              else {
                const v = new Array(S.length), R = new Array(d.dims.length), B = new Array(m.dims.length);
                let q, D = 0, O = 0, N = !1, E = !1;
                d.dims.length === 0 && (D = d.get([]), N = !0), m.dims.length === 0 && (O = m.get([]), E = !0);
                for (let M = 0; M < A; M++) {
                  q = M;
                  for (let Y = S.length - 1; Y >= 0; Y--) v[Y] = q % S[Y], q = Math.floor(q / S[Y]);
                  N || (a.fillIndex(v, d.dims, R), D = d.get(R)), E || (a.fillIndex(v, m.dims, B), O = m.get(B)), P.set(v, y(D, O));
                }
              }
              return P;
            }
          }
          static isValidBroadcast(d, m) {
            const y = d.length, w = m.length;
            if (y > w) return !1;
            for (let _ = 1; _ <= y; _++) if (d[y - _] !== 1 && d[y - _] !== m[w - _]) return !1;
            return !0;
          }
          static getBroadcastDims(d, m) {
            const y = d.length, w = [];
            for (let _ = 0; _ < y; _++) {
              const S = y - 1 - _, A = d[S] || 1;
              (m[m.length - 1 - _] || 1) > 1 && A === 1 && w.unshift(S);
            }
            return w;
          }
        }
        u.BroadcastUtil = a, u.arrayCopyHelper = function(l, d, m, y, w) {
          if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
          if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
          if (y + w > d.length) throw new Error("source indices to be copied are outside bounds");
          if (m + w > l.length) throw new Error("target array is too small to hold result");
          for (let _ = 0; _ < w; _++) l[m + _] = d[y + _];
        }, u.GemmUtil = class {
          static getShapeOfGemmResult(l, d, m, y, w) {
            if (l.length !== 2 || m.length !== 2) throw new Error("shape need to be of size 2");
            let _, S, A;
            d ? (_ = l[1], S = l[0]) : (_ = l[0], S = l[1]);
            let P = -1;
            if (y ? (A = m[0], P = 1) : (A = m[1], P = 0), m[P] !== S) throw new Error("dimension mismatch");
            if (_ <= 0 || A <= 0 || S <= 0) throw new Error("invalid shape specified");
            if (w && !a.isValidBroadcast(w, [_, A])) throw new Error("gemm: invalid bias shape for broadcast");
            return [_, A, S];
          }
        };
        class i {
          static tensorDataTypeFromProto(d) {
            switch (d) {
              case o.onnx.TensorProto.DataType.INT8:
                return "int8";
              case o.onnx.TensorProto.DataType.UINT8:
                return "uint8";
              case o.onnx.TensorProto.DataType.BOOL:
                return "bool";
              case o.onnx.TensorProto.DataType.INT16:
                return "int16";
              case o.onnx.TensorProto.DataType.UINT16:
                return "uint16";
              case o.onnx.TensorProto.DataType.INT32:
                return "int32";
              case o.onnx.TensorProto.DataType.UINT32:
                return "uint32";
              case o.onnx.TensorProto.DataType.FLOAT:
                return "float32";
              case o.onnx.TensorProto.DataType.DOUBLE:
                return "float64";
              case o.onnx.TensorProto.DataType.STRING:
                return "string";
              case o.onnx.TensorProto.DataType.INT64:
                return "int32";
              case o.onnx.TensorProto.DataType.UINT64:
                return "uint32";
              default:
                throw new Error(`unsupported data type: ${o.onnx.TensorProto.DataType[d]}`);
            }
          }
          static tensorDataTypeStringToEnum(d) {
            switch (d) {
              case "int8":
                return o.onnx.TensorProto.DataType.INT8;
              case "uint8":
                return o.onnx.TensorProto.DataType.UINT8;
              case "bool":
                return o.onnx.TensorProto.DataType.BOOL;
              case "int16":
                return o.onnx.TensorProto.DataType.INT16;
              case "uint16":
                return o.onnx.TensorProto.DataType.UINT16;
              case "int32":
                return o.onnx.TensorProto.DataType.INT32;
              case "uint32":
                return o.onnx.TensorProto.DataType.UINT32;
              case "float32":
                return o.onnx.TensorProto.DataType.FLOAT;
              case "float64":
                return o.onnx.TensorProto.DataType.DOUBLE;
              case "string":
                return o.onnx.TensorProto.DataType.STRING;
              case "int64":
                return o.onnx.TensorProto.DataType.INT64;
              case "uint64":
                return o.onnx.TensorProto.DataType.UINT64;
              default:
                throw new Error(`unsupported data type: ${d}`);
            }
          }
          static tensorDimsFromProto(d) {
            return d.map((m) => g.default.isLong(m) ? m.toNumber() : m);
          }
          static tensorValueTypeFromProto(d) {
            return { tensorType: i.tensorDataTypeFromProto(d.elemType), shape: { dims: i.tensorDimsFromProto(d.shape.dim.map((m) => m.dimValue)) } };
          }
          static tensorDimsFromORTFormat(d) {
            const m = [];
            for (let y = 0; y < d.dimsLength(); y++) m.push(t.longToNumber(d.dims(y)));
            return m;
          }
          static tensorAttributesFromORTFormat(d) {
            const m = [];
            for (let y = 0; y < d.attributesLength(); y++) m.push(d.attributes(y));
            return m;
          }
        }
        u.ProtoUtil = i;
        class t {
          static longToNumber(d, m) {
            return g.default.isLong(d) ? d.toNumber() : d instanceof p.flatbuffers.Long ? g.default.fromValue({ low: d.low, high: d.high, unsigned: m != null && m }).toNumber() : d;
          }
          static isLong(d) {
            return g.default.isLong(d) || d instanceof p.flatbuffers.Long;
          }
        }
        u.LongUtil = t;
        class e {
          static size(d) {
            return e.getSizeFromDimensionRange(d, 0, d.length);
          }
          static sizeFromDimension(d, m) {
            if (m < 0 || m > d.length) throw new Error(`invalid dimension of ${m} for sizeFromDimension as Tensor has ${d.length} dimensions.`);
            return e.getSizeFromDimensionRange(d, m, d.length);
          }
          static sizeToDimension(d, m) {
            if (m < 0 || m > d.length) throw new Error(`invalid dimension of ${m} for sizeToDimension as Tensor has ${d.length} dimensions.`);
            return e.getSizeFromDimensionRange(d, 0, m);
          }
          static getSizeFromDimensionRange(d, m, y) {
            let w = 1;
            for (let _ = m; _ < y; _++) {
              if (d[_] <= 0) throw new Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");
              w *= d[_];
            }
            return w;
          }
          static computeStrides(d) {
            const m = d.length;
            if (m === 0) return [];
            if (m === 1) return [1];
            const y = new Array(m);
            y[m - 1] = 1, y[m - 2] = d[m - 1];
            for (let w = m - 3; w >= 0; --w) y[w] = y[w + 1] * d[w + 1];
            return y;
          }
          static transpose(d) {
            return d.slice().reverse();
          }
          static indicesToOffset(d, m, y) {
            y === void 0 && (y = d.length);
            let w = 0;
            for (let _ = 0; _ < y; ++_) w += m[_] * d[_];
            return w;
          }
          static offsetToIndices(d, m) {
            const y = m.length;
            if (y === 0) return [];
            if (y === 1) return [d * m[0]];
            const w = new Array(m.length);
            for (let _ = 0; _ < w.length - 1; ++_) w[_] = Math.floor(d / m[_]), d -= w[_] * m[_];
            return w[w.length - 1] = d, w;
          }
          static normalizeAxis(d, m) {
            if (d < -m && d >= m) throw new Error("unsupported axis for this operation.");
            return d < 0 ? d + m : d;
          }
          static normalizeAxes(d, m) {
            return d.map((y) => this.normalizeAxis(y, m));
          }
          static incrementIndex(d, m, y) {
            if (m.length === 0 || d.length === 0) throw new Error("Index incrementing unsupported for scalar Tensor");
            if (y === void 0) y = m.length;
            else if (y <= 0 || y > m.length) throw new Error("Incorrect axis to increment on");
            for (let w = y - 1; w >= 0 && (d[w]++, !(d[w] < m[w])); --w) d[w] = 0;
          }
          static calculateReshapedDims(d, m) {
            if (m.length === 0) {
              if (d.length === 0 || e.size(d) === 1) return [];
              throw new Error("cannot reshape to a scalar Tensor");
            }
            const y = m.length, w = new Array(y);
            let _ = -1, S = 1;
            for (let P = 0; P < y; P++) {
              if (m[P] < -1) throw new Error("a dimension in shape hints cannot be less than -1");
              if (m[P] === -1) {
                if (_ !== -1) throw new Error("at most one dimension in shape hints can be -1");
                _ = P;
              } else {
                if (m[P] === 0) {
                  if (P >= d.length) throw new Error("the dimension with value zero exceeds the dimension size of the input tensor");
                  w[P] = d[P];
                } else w[P] = m[P];
                S *= w[P];
              }
            }
            const A = e.size(d);
            if (_ !== -1) {
              if (A % S != 0) throw new Error(`the input tensor cannot be reshaped to the requested shape. Input shape: [${d}] Output shape: [${m}]`);
              w[_] = A / S;
            } else if (S !== A) throw new Error("reshapedDims and originalDims don't have matching sizes");
            return w;
          }
          static sortBasedOnPerm(d, m) {
            return m ? m.map((y) => d[y]) : d.slice().reverse();
          }
          static padShape(d, m) {
            const y = d.length;
            return d.map((w, _) => w + m[_] + m[_ + y]);
          }
          static areEqual(d, m) {
            return d.length === m.length && d.every((y, w) => y === m[w]);
          }
          static validateDimsAndCalcSize(d) {
            if (d.length > 6) throw new TypeError("Only rank 0 to 6 is supported for tensor shape.");
            let m = 1;
            for (const y of d) {
              if (!Number.isInteger(y)) throw new TypeError(`Invalid shape: ${y} is not an integer`);
              if (y < 0 || y > 2147483647) throw new TypeError(`Invalid shape: length ${y} is not allowed`);
              m *= y;
            }
            return m;
          }
          static flattenShape(d, m) {
            m < 0 && (m += d.length);
            const y = d.reduce((_, S) => _ * S, 1), w = d.slice(m).reduce((_, S) => _ * S, 1);
            return [y / w, w];
          }
          static squeezeShape(d, m) {
            const y = new Array();
            m = e.normalizeAxes(m, d.length);
            for (let w = 0; w < d.length; w++) {
              const _ = m.indexOf(w) >= 0;
              if (_ && d[w] !== 1) throw new Error("squeeze an axis of size different than 1");
              (m.length === 0 && d[w] > 1 || m.length > 0 && !_) && y.push(d[w]);
            }
            return y;
          }
          static unsqueezeShape(d, m) {
            const y = new Array(d.length + m.length);
            y.fill(0);
            for (let _ = 0; _ < m.length; _++) {
              const S = e.normalizeAxis(m[_], y.length);
              if (S >= y.length) throw new Error("'axes' has an out of range axis");
              if (y[S] !== 0) throw new Error("'axes' has a duplicate axis");
              y[S] = 1;
            }
            let w = 0;
            for (let _ = 0; _ < y.length; _++) y[_] === 0 && (y[_] = d[w++]);
            if (w !== d.length) throw new Error("the unsqueezed dimension could not be established");
            return y;
          }
        }
        u.ShapeUtil = e, u.MathUtil = class {
          static sqr(l, d, m, y, w) {
            if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
            if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
            if (y + w > d.length) throw new Error("source indices to be copied are outside bounds");
            if (m + w > l.length) throw new Error("target array is too small to hold result");
            for (let _ = 0; _ < w; _++) l[m + _] += Math.pow(d[y + _], 2);
          }
          static axpy(l, d, m, y, w, _) {
            if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
            if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
            if (y + w > d.length) throw new Error("source indices to be copied are outside bounds");
            if (m + w > l.length) throw new Error("target array is too small to hold result");
            for (let S = 0; S < w; S++) l[m + S] += _ * d[y + S];
          }
          static powx(l, d, m, y, w, _) {
            if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
            if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
            if (y + w > d.length) throw new Error("source indices to be copied are outside bounds");
            if (m + w > l.length) throw new Error("target array is too small to hold result");
            for (let S = 0; S < w; S++) l[m + S] = Math.pow(d[y + S], _);
          }
          static mul(l, d, m, y, w) {
            if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
            if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
            if (y + w > d.length) throw new Error("source indices to be copied are outside bounds");
            if (m + w > l.length) throw new Error("target array is too small to hold result");
            for (let _ = 0; _ < w; _++) l[m + _] = d[y + _] * l[m + _];
          }
        };
        class n {
          static splitShape(d, m, y, w) {
            if (y.length === 0) {
              if (!w) throw new Error("need to know number of outputs when the 'split' attribute is not specified");
              n.determineSplit(d[m], w, y);
            }
            const _ = [], S = [0];
            for (let A = 0; A < y.length; ++A) {
              A !== 0 && S.push(S[A - 1] + y[A - 1]);
              const P = d.slice();
              P[m] = y[A], _.push(P);
            }
            return [_, S];
          }
          static determineSplit(d, m, y) {
            if (d % m != 0) throw new Error("cannot split tensor to equal sized parts");
            for (let w = 0; w < m; ++w) y.push(d / m);
          }
        }
        u.SplitUtil = n;
        class r {
          static calcReduce(d, m, y, w, _) {
            const S = d.dims.slice(0);
            m.length === 0 && S.forEach((D, O) => m.push(O));
            const A = r.calcReduceShape(S, m, !0), P = e.size(A), v = new c.Tensor(A, d.type), R = e.computeStrides(A), B = e.computeStrides(S), q = new Array(S.length);
            for (let D = 0; D < P; D++) {
              const O = e.offsetToIndices(D, R);
              a.fillIndex(O, S, q), v.set(O, r.calcReduceByAxis(d.numberData, m, S, 0, e.indicesToOffset(q, B), w, _));
            }
            return y ? v : new c.Tensor(r.calcReduceShape(S, m, y), v.type, void 0, void 0, v.data, v.dataId);
          }
          static calcReduceByAxis(d, m, y, w, _, S, A) {
            let P = 0;
            if (w >= m.length) return S(d[_]);
            const v = m[w], R = v >= y.length ? 1 : e.size(y.slice(v + 1));
            for (let B = 0; B < y[v]; B++) P = B === 0 ? r.calcReduceByAxis(d, m, y, w + 1, _, S, A) : A(P, r.calcReduceByAxis(d, m, y, w + 1, _, S, A)), _ += R;
            return P;
          }
          static calcReduceShape(d, m, y) {
            const w = d.slice();
            for (let _ = 0; _ < m.length; _++) w[m[_]] = y ? 1 : 0;
            return w.filter((_) => _ !== 0);
          }
        }
        u.ReduceUtil = r;
        class s {
          static adjustPoolAttributes(d, m, y, w, _, S) {
            if (!d && y.length !== m.length - 2) throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");
            if (d) for (let A = 0; A < m.length - 2; A++) A >= y.length ? y.push(m[A + 2]) : y[A] = m[A + 2];
            for (let A = 0; A < y.length; A++) if (A < w.length) {
              if (w[A] < 0) throw new Error("strides should be greater than or equal to 1");
            } else w.push(1);
            for (let A = 0; A < y.length; A++) if (A < _.length) {
              if (_[A] < 0) throw new Error("dilations should be greater than or equal to 1");
            } else _.push(1);
            for (let A = 0; A < 2 * y.length; A++) if (A < S.length) {
              if (S[A] < 0) throw new Error("pad should be greater than or equal to 1");
            } else S.push(0);
            for (let A = 0; A < y.length; A++) {
              if (y[A] <= 0) throw new Error("kernel shapes need to be greater than 0");
              if (S[A] >= y[A] || S[A + y.length] >= y[A]) throw new Error("pads should be smaller than kernel");
            }
          }
          static adjustPadsBasedOnAutoPad(d, m, y, w, _, S) {
            if (S) {
              if (_.length !== 2 * (d.length - 2)) throw new Error("length of pads should be twice the length of data dimensions");
              if (m.length !== d.length - 2) throw new Error("length of strides should be the length of data dimensions");
              if (w.length !== d.length - 2) throw new Error("length of kernel shapes should be the length of data dimensions");
              for (let A = 0; A < d.length - 2; A++) s.adjustPadAndReturnShape(d[A + 2], m[A], y[A], w[A], _, A, A + d.length - 2, S);
            }
          }
          static computePoolOutputShape(d, m, y, w, _, S, A) {
            if (m.length <= 0) throw new Error("input shape must be of size greater than 0");
            const P = [m[0], m[1]];
            return s.computeShapeHelper(d, m, P, y, w, _, S, A), P;
          }
          static computeConvOutputShape(d, m, y, w, _, S, A) {
            if (d.length <= 0 || m.length <= 0) throw new Error("invalid input tensor dims or invalid filter tensor dims");
            const P = [d[0], m[0]];
            return s.computeShapeHelper(!1, d, P, y, w, _, S, A), P;
          }
          static computeShapeHelper(d, m, y, w, _, S, A, P) {
            if (d) for (let v = 0; v < m.length - 2; v++) y.push(1);
            else for (let v = 0; v < m.length - 2; v++) y.push(s.adjustPadAndReturnShape(m[v + 2], w[v], _[v], S[v], A, v, v + m.length - 2, P));
          }
          static adjustPadAndReturnShape(d, m, y, w, _, S, A, P) {
            const v = y * (w - 1) + 1;
            if (!P || P === "NOTSET") return Math.floor((d + _[S] + _[A] - v) / m + 1);
            switch (P) {
              case "VALID":
                return _[S] = 0, _[A] = 0, Math.floor((d - v) / m + 1);
              case "SAME_LOWER":
              case "SAME_UPPER":
                if (y !== 1) throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");
                {
                  const R = ((d + m - 1) / m - 1) * m + w - d;
                  return _[S] = Math.floor(P === "SAME_LOWER" ? (R + 1) / 2 : R / 2), _[A] = R - _[S], Math.floor((d + R - w) / m + 1);
                }
              default:
                throw new Error("Unsupported AutoPad type");
            }
          }
        }
        u.PoolConvUtil = s, u.MIN_CLIP = -34028234663852886e22, u.MAX_CLIP = 34028234663852886e22, u.decodeUtf8String = function(l) {
          return new TextDecoder().decode(l);
        };
      }, 7967: (C, u) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.iterateExtraOptions = void 0, u.iterateExtraOptions = (b, h, p, g) => {
          if (typeof b == "object" && b !== null) {
            if (p.has(b)) throw new Error("Circular reference in options");
            p.add(b);
          }
          Object.entries(b).forEach(([o, c]) => {
            const f = h ? h + o : o;
            if (typeof c == "object") (0, u.iterateExtraOptions)(c, f + ".", p, g);
            else if (typeof c == "string" || typeof c == "number") g(f, c.toString());
            else {
              if (typeof c != "boolean") throw new Error("Can't handle extra config type: " + typeof c);
              g(f, c ? "1" : "0");
            }
          });
        };
      }, 2157: function(C, u, b) {
        var h, p = this && this.__createBinding || (Object.create ? function(R, B, q, D) {
          D === void 0 && (D = q);
          var O = Object.getOwnPropertyDescriptor(B, q);
          O && !("get" in O ? !B.__esModule : O.writable || O.configurable) || (O = { enumerable: !0, get: function() {
            return B[q];
          } }), Object.defineProperty(R, D, O);
        } : function(R, B, q, D) {
          D === void 0 && (D = q), R[D] = B[q];
        }), g = this && this.__setModuleDefault || (Object.create ? function(R, B) {
          Object.defineProperty(R, "default", { enumerable: !0, value: B });
        } : function(R, B) {
          R.default = B;
        }), o = this && this.__importStar || function(R) {
          if (R && R.__esModule) return R;
          var B = {};
          if (R != null) for (var q in R) q !== "default" && Object.prototype.hasOwnProperty.call(R, q) && p(B, R, q);
          return g(B, R), B;
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.endProfiling = u.run = u.releaseSession = u.createSession = u.createSessionFinalize = u.createSessionAllocate = u.initOrt = u.initWasm = void 0;
        const c = b(1670), f = o(b(349)), a = b(6361), i = () => !!c.env.wasm.proxy && typeof document < "u";
        let t, e, n, r = !1, s = !1, l = !1;
        const d = [], m = [], y = [], w = [], _ = [], S = [], A = () => {
          if (r || !s || l || !t) throw new Error("worker not ready");
        }, P = (R) => {
          switch (R.data.type) {
            case "init-wasm":
              r = !1, R.data.err ? (l = !0, e[1](R.data.err)) : (s = !0, e[0]());
              break;
            case "init-ort":
              R.data.err ? n[1](R.data.err) : n[0]();
              break;
            case "create_allocate":
              R.data.err ? d.shift()[1](R.data.err) : d.shift()[0](R.data.out);
              break;
            case "create_finalize":
              R.data.err ? m.shift()[1](R.data.err) : m.shift()[0](R.data.out);
              break;
            case "create":
              R.data.err ? y.shift()[1](R.data.err) : y.shift()[0](R.data.out);
              break;
            case "release":
              R.data.err ? w.shift()[1](R.data.err) : w.shift()[0]();
              break;
            case "run":
              R.data.err ? _.shift()[1](R.data.err) : _.shift()[0](R.data.out);
              break;
            case "end-profiling":
              R.data.err ? S.shift()[1](R.data.err) : S.shift()[0]();
          }
        }, v = typeof document < "u" ? (h = document == null ? void 0 : document.currentScript) === null || h === void 0 ? void 0 : h.src : void 0;
        u.initWasm = async () => {
          if (i()) {
            if (s) return;
            if (r) throw new Error("multiple calls to 'initWasm()' detected.");
            if (l) throw new Error("previous call to 'initWasm()' failed.");
            return r = !0, c.env.wasm.wasmPaths === void 0 && v && v.indexOf("blob:") !== 0 && (c.env.wasm.wasmPaths = v.substr(0, +v.lastIndexOf("/") + 1)), new Promise((R, B) => {
              t == null || t.terminate(), t = b(9710).Z(), t.onmessage = P, e = [R, B];
              const q = { type: "init-wasm", in: c.env.wasm };
              t.postMessage(q);
            });
          }
          return (0, a.initializeWebAssembly)(c.env.wasm);
        }, u.initOrt = async (R, B) => {
          if (i()) return A(), new Promise((q, D) => {
            n = [q, D];
            const O = { type: "init-ort", in: { numThreads: R, loggingLevel: B } };
            t.postMessage(O);
          });
          f.initOrt(R, B);
        }, u.createSessionAllocate = async (R) => i() ? (A(), new Promise((B, q) => {
          d.push([B, q]);
          const D = { type: "create_allocate", in: { model: R } };
          t.postMessage(D, [R.buffer]);
        })) : f.createSessionAllocate(R), u.createSessionFinalize = async (R, B) => i() ? (A(), new Promise((q, D) => {
          m.push([q, D]);
          const O = { type: "create_finalize", in: { modeldata: R, options: B } };
          t.postMessage(O);
        })) : f.createSessionFinalize(R, B), u.createSession = async (R, B) => i() ? (A(), new Promise((q, D) => {
          y.push([q, D]);
          const O = { type: "create", in: { model: R, options: B } };
          t.postMessage(O, [R.buffer]);
        })) : f.createSession(R, B), u.releaseSession = async (R) => {
          if (i()) return A(), new Promise((B, q) => {
            w.push([B, q]);
            const D = { type: "release", in: R };
            t.postMessage(D);
          });
          f.releaseSession(R);
        }, u.run = async (R, B, q, D, O) => i() ? (A(), new Promise((N, E) => {
          _.push([N, E]);
          const M = { type: "run", in: { sessionId: R, inputIndices: B, inputs: q, outputIndices: D, options: O } };
          t.postMessage(M, f.extractTransferableBuffers(q));
        })) : f.run(R, B, q, D, O), u.endProfiling = async (R) => {
          if (i()) return A(), new Promise((B, q) => {
            S.push([B, q]);
            const D = { type: "end-profiling", in: R };
            t.postMessage(D);
          });
          f.endProfiling(R);
        };
      }, 586: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.setRunOptions = void 0;
        const h = b(7967), p = b(4983), g = b(6361);
        u.setRunOptions = (o) => {
          const c = (0, g.getInstance)();
          let f = 0;
          const a = [], i = o || {};
          try {
            if ((o == null ? void 0 : o.logSeverityLevel) === void 0) i.logSeverityLevel = 2;
            else if (typeof o.logSeverityLevel != "number" || !Number.isInteger(o.logSeverityLevel) || o.logSeverityLevel < 0 || o.logSeverityLevel > 4) throw new Error(`log serverity level is not valid: ${o.logSeverityLevel}`);
            if ((o == null ? void 0 : o.logVerbosityLevel) === void 0) i.logVerbosityLevel = 0;
            else if (typeof o.logVerbosityLevel != "number" || !Number.isInteger(o.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${o.logVerbosityLevel}`);
            (o == null ? void 0 : o.terminate) === void 0 && (i.terminate = !1);
            let t = 0;
            if ((o == null ? void 0 : o.tag) !== void 0 && (t = (0, p.allocWasmString)(o.tag, a)), f = c._OrtCreateRunOptions(i.logSeverityLevel, i.logVerbosityLevel, !!i.terminate, t), f === 0) throw new Error("Can't create run options");
            return (o == null ? void 0 : o.extra) !== void 0 && (0, h.iterateExtraOptions)(o.extra, "", /* @__PURE__ */ new WeakSet(), (e, n) => {
              const r = (0, p.allocWasmString)(e, a), s = (0, p.allocWasmString)(n, a);
              if (c._OrtAddRunConfigEntry(f, r, s) !== 0) throw new Error(`Can't set a run config entry: ${e} - ${n}`);
            }), [f, a];
          } catch (t) {
            throw f !== 0 && c._OrtReleaseRunOptions(f), a.forEach(c._free), t;
          }
        };
      }, 2306: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.OnnxruntimeWebAssemblySessionHandler = void 0;
        const h = b(2806), p = b(1670), g = b(2850), o = b(2157);
        let c;
        u.OnnxruntimeWebAssemblySessionHandler = class {
          async createSessionAllocate(f) {
            const a = await fetch(f), i = await a.arrayBuffer();
            return (0, o.createSessionAllocate)(new Uint8Array(i));
          }
          async loadModel(f, a) {
            if (c || (await (0, o.initOrt)(p.env.wasm.numThreads, ((i) => {
              switch (i) {
                case "verbose":
                  return 0;
                case "info":
                  return 1;
                case "warning":
                  return 2;
                case "error":
                  return 3;
                case "fatal":
                  return 4;
                default:
                  throw new Error(`unsupported logging level: ${i}`);
              }
            })(p.env.logLevel)), c = !0), typeof f == "string") if (typeof fetch > "u") {
              const i = await (0, g.promisify)(h.readFile)(f);
              [this.sessionId, this.inputNames, this.outputNames] = await (0, o.createSession)(i, a);
            } else {
              const i = await this.createSessionAllocate(f);
              [this.sessionId, this.inputNames, this.outputNames] = await (0, o.createSessionFinalize)(i, a);
            }
            else [this.sessionId, this.inputNames, this.outputNames] = await (0, o.createSession)(f, a);
          }
          async dispose() {
            return (0, o.releaseSession)(this.sessionId);
          }
          async run(f, a, i) {
            const t = [], e = [];
            Object.entries(f).forEach((l) => {
              const d = l[0], m = l[1], y = this.inputNames.indexOf(d);
              if (y === -1) throw new Error(`invalid input '${d}'`);
              t.push(m), e.push(y);
            });
            const n = [];
            Object.entries(a).forEach((l) => {
              const d = l[0], m = this.outputNames.indexOf(d);
              if (m === -1) throw new Error(`invalid output '${d}'`);
              n.push(m);
            });
            const r = await (0, o.run)(this.sessionId, e, t.map((l) => [l.type, l.dims, l.data]), n, i), s = {};
            for (let l = 0; l < r.length; l++) s[this.outputNames[n[l]]] = new p.Tensor(r[l][0], r[l][2], r[l][1]);
            return s;
          }
          startProfiling() {
          }
          endProfiling() {
            (0, o.endProfiling)(this.sessionId);
          }
        };
      }, 4919: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.setSessionOptions = void 0;
        const h = b(7967), p = b(4983), g = b(6361);
        u.setSessionOptions = (o) => {
          const c = (0, g.getInstance)();
          let f = 0;
          const a = [], i = o || {};
          ((t) => {
            t.extra || (t.extra = {}), t.extra.session || (t.extra.session = {});
            const e = t.extra.session;
            e.use_ort_model_bytes_directly || (e.use_ort_model_bytes_directly = "1");
          })(i);
          try {
            (o == null ? void 0 : o.graphOptimizationLevel) === void 0 && (i.graphOptimizationLevel = "all");
            const t = ((r) => {
              switch (r) {
                case "disabled":
                  return 0;
                case "basic":
                  return 1;
                case "extended":
                  return 2;
                case "all":
                  return 99;
                default:
                  throw new Error(`unsupported graph optimization level: ${r}`);
              }
            })(i.graphOptimizationLevel);
            (o == null ? void 0 : o.enableCpuMemArena) === void 0 && (i.enableCpuMemArena = !0), (o == null ? void 0 : o.enableMemPattern) === void 0 && (i.enableMemPattern = !0), (o == null ? void 0 : o.executionMode) === void 0 && (i.executionMode = "sequential");
            const e = ((r) => {
              switch (r) {
                case "sequential":
                  return 0;
                case "parallel":
                  return 1;
                default:
                  throw new Error(`unsupported execution mode: ${r}`);
              }
            })(i.executionMode);
            let n = 0;
            if ((o == null ? void 0 : o.logId) !== void 0 && (n = (0, p.allocWasmString)(o.logId, a)), (o == null ? void 0 : o.logSeverityLevel) === void 0) i.logSeverityLevel = 2;
            else if (typeof o.logSeverityLevel != "number" || !Number.isInteger(o.logSeverityLevel) || o.logSeverityLevel < 0 || o.logSeverityLevel > 4) throw new Error(`log serverity level is not valid: ${o.logSeverityLevel}`);
            if ((o == null ? void 0 : o.logVerbosityLevel) === void 0) i.logVerbosityLevel = 0;
            else if (typeof o.logVerbosityLevel != "number" || !Number.isInteger(o.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${o.logVerbosityLevel}`);
            if ((o == null ? void 0 : o.enableProfiling) === void 0 && (i.enableProfiling = !1), f = c._OrtCreateSessionOptions(t, !!i.enableCpuMemArena, !!i.enableMemPattern, e, !!i.enableProfiling, 0, n, i.logSeverityLevel, i.logVerbosityLevel), f === 0) throw new Error("Can't create session options");
            return o != null && o.executionProviders && ((r, s, l) => {
              for (const d of s) {
                let m = typeof d == "string" ? d : d.name;
                switch (m) {
                  case "xnnpack":
                    m = "XNNPACK";
                    break;
                  case "wasm":
                  case "cpu":
                    continue;
                  default:
                    throw new Error(`not supported EP: ${m}`);
                }
                const y = (0, p.allocWasmString)(m, l);
                if ((0, g.getInstance)()._OrtAppendExecutionProvider(r, y) !== 0) throw new Error(`Can't append execution provider: ${m}`);
              }
            })(f, o.executionProviders, a), (o == null ? void 0 : o.extra) !== void 0 && (0, h.iterateExtraOptions)(o.extra, "", /* @__PURE__ */ new WeakSet(), (r, s) => {
              const l = (0, p.allocWasmString)(r, a), d = (0, p.allocWasmString)(s, a);
              if (c._OrtAddSessionConfigEntry(f, l, d) !== 0) throw new Error(`Can't set a session config entry: ${r} - ${s}`);
            }), [f, a];
          } catch (t) {
            throw f !== 0 && c._OrtReleaseSessionOptions(f), a.forEach(c._free), t;
          }
        };
      }, 4983: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.allocWasmString = void 0;
        const h = b(6361);
        u.allocWasmString = (p, g) => {
          const o = (0, h.getInstance)(), c = o.lengthBytesUTF8(p) + 1, f = o._malloc(c);
          return o.stringToUTF8(p, f, c), g.push(f), f;
        };
      }, 349: (C, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.extractTransferableBuffers = u.endProfiling = u.run = u.releaseSession = u.createSession = u.createSessionFinalize = u.createSessionAllocate = u.initOrt = void 0;
        const h = b(586), p = b(4919), g = b(4983), o = b(6361);
        u.initOrt = (t, e) => {
          const n = (0, o.getInstance)()._OrtInit(t, e);
          if (n !== 0) throw new Error(`Can't initialize onnxruntime. error code = ${n}`);
        };
        const c = /* @__PURE__ */ new Map();
        u.createSessionAllocate = (t) => {
          const e = (0, o.getInstance)(), n = e._malloc(t.byteLength);
          return e.HEAPU8.set(t, n), [n, t.byteLength];
        }, u.createSessionFinalize = (t, e) => {
          const n = (0, o.getInstance)();
          let r = 0, s = 0, l = [];
          try {
            if ([s, l] = (0, p.setSessionOptions)(e), r = n._OrtCreateSession(t[0], t[1], s), r === 0) throw new Error("Can't create a session");
          } finally {
            n._free(t[0]), n._OrtReleaseSessionOptions(s), l.forEach(n._free);
          }
          const d = n._OrtGetInputCount(r), m = n._OrtGetOutputCount(r), y = [], w = [], _ = [], S = [];
          for (let A = 0; A < d; A++) {
            const P = n._OrtGetInputName(r, A);
            if (P === 0) throw new Error("Can't get an input name");
            w.push(P), y.push(n.UTF8ToString(P));
          }
          for (let A = 0; A < m; A++) {
            const P = n._OrtGetOutputName(r, A);
            if (P === 0) throw new Error("Can't get an output name");
            S.push(P), _.push(n.UTF8ToString(P));
          }
          return c.set(r, [r, w, S]), [r, y, _];
        }, u.createSession = (t, e) => {
          const n = (0, u.createSessionAllocate)(t);
          return (0, u.createSessionFinalize)(n, e);
        }, u.releaseSession = (t) => {
          const e = (0, o.getInstance)(), n = c.get(t);
          if (!n) throw new Error("invalid session id");
          const r = n[0], s = n[1], l = n[2];
          s.forEach(e._OrtFree), l.forEach(e._OrtFree), e._OrtReleaseSession(r), c.delete(t);
        };
        const f = (t) => {
          switch (t) {
            case "int8":
              return 3;
            case "uint8":
              return 2;
            case "bool":
              return 9;
            case "int16":
              return 5;
            case "uint16":
              return 4;
            case "int32":
              return 6;
            case "uint32":
              return 12;
            case "float32":
              return 1;
            case "float64":
              return 11;
            case "string":
              return 8;
            case "int64":
              return 7;
            case "uint64":
              return 13;
            default:
              throw new Error(`unsupported data type: ${t}`);
          }
        }, a = (t) => {
          switch (t) {
            case 3:
              return "int8";
            case 2:
              return "uint8";
            case 9:
              return "bool";
            case 5:
              return "int16";
            case 4:
              return "uint16";
            case 6:
              return "int32";
            case 12:
              return "uint32";
            case 1:
              return "float32";
            case 11:
              return "float64";
            case 8:
              return "string";
            case 7:
              return "int64";
            case 13:
              return "uint64";
            default:
              throw new Error(`unsupported data type: ${t}`);
          }
        }, i = (t) => {
          switch (t) {
            case "float32":
              return Float32Array;
            case "uint8":
            case "bool":
              return Uint8Array;
            case "int8":
              return Int8Array;
            case "uint16":
              return Uint16Array;
            case "int16":
              return Int16Array;
            case "int32":
              return Int32Array;
            case "float64":
              return Float64Array;
            case "uint32":
              return Uint32Array;
            case "int64":
              return BigInt64Array;
            case "uint64":
              return BigUint64Array;
            default:
              throw new Error(`unsupported type: ${t}`);
          }
        };
        u.run = (t, e, n, r, s) => {
          const l = (0, o.getInstance)(), d = c.get(t);
          if (!d) throw new Error("invalid session id");
          const m = d[0], y = d[1], w = d[2], _ = e.length, S = r.length;
          let A = 0, P = [];
          const v = [], R = [];
          try {
            [A, P] = (0, h.setRunOptions)(s);
            for (let E = 0; E < _; E++) {
              const M = n[E][0], Y = n[E][1], H = n[E][2];
              let te, Z;
              if (Array.isArray(H)) {
                Z = 4 * H.length, te = l._malloc(Z), R.push(te);
                let ye = te / 4;
                for (let oe = 0; oe < H.length; oe++) {
                  if (typeof H[oe] != "string") throw new TypeError(`tensor data at index ${oe} is not a string`);
                  l.HEAPU32[ye++] = (0, g.allocWasmString)(H[oe], R);
                }
              } else Z = H.byteLength, te = l._malloc(Z), R.push(te), l.HEAPU8.set(new Uint8Array(H.buffer, H.byteOffset, Z), te);
              const ne = l.stackSave(), ue = l.stackAlloc(4 * Y.length);
              try {
                let ye = ue / 4;
                Y.forEach((be) => l.HEAP32[ye++] = be);
                const oe = l._OrtCreateTensor(f(M), te, Z, ue, Y.length);
                if (oe === 0) throw new Error("Can't create a tensor");
                v.push(oe);
              } finally {
                l.stackRestore(ne);
              }
            }
            const B = l.stackSave(), q = l.stackAlloc(4 * _), D = l.stackAlloc(4 * _), O = l.stackAlloc(4 * S), N = l.stackAlloc(4 * S);
            try {
              let E = q / 4, M = D / 4, Y = O / 4, H = N / 4;
              for (let ne = 0; ne < _; ne++) l.HEAPU32[E++] = v[ne], l.HEAPU32[M++] = y[e[ne]];
              for (let ne = 0; ne < S; ne++) l.HEAPU32[Y++] = 0, l.HEAPU32[H++] = w[r[ne]];
              let te = l._OrtRun(m, D, q, _, N, S, O, A);
              const Z = [];
              if (te === 0) for (let ne = 0; ne < S; ne++) {
                const ue = l.HEAPU32[O / 4 + ne], ye = l.stackSave(), oe = l.stackAlloc(16);
                let be, me = 0;
                try {
                  if (te = l._OrtGetTensorData(ue, oe, oe + 4, oe + 8, oe + 12), te !== 0) throw new Error(`Can't access output tensor data. error code = ${te}`);
                  let Re = oe / 4;
                  const Ve = l.HEAPU32[Re++];
                  me = l.HEAPU32[Re++];
                  const de = l.HEAPU32[Re++], Ee = l.HEAPU32[Re++], Ie = [];
                  for (let Fe = 0; Fe < Ee; Fe++) Ie.push(l.HEAPU32[de / 4 + Fe]);
                  l._OrtFree(de);
                  const $e = Ie.length === 0 ? 1 : Ie.reduce((Fe, Be) => Fe * Be);
                  if (be = a(Ve), be === "string") {
                    const Fe = [];
                    let Be = me / 4;
                    for (let ze = 0; ze < $e; ze++) {
                      const qe = l.HEAPU32[Be++], Je = ze === $e - 1 ? void 0 : l.HEAPU32[Be] - qe;
                      Fe.push(l.UTF8ToString(qe, Je));
                    }
                    Z.push([be, Ie, Fe]);
                  } else {
                    const Fe = new (i(be))($e);
                    new Uint8Array(Fe.buffer, Fe.byteOffset, Fe.byteLength).set(l.HEAPU8.subarray(me, me + Fe.byteLength)), Z.push([be, Ie, Fe]);
                  }
                } finally {
                  l.stackRestore(ye), be === "string" && me && l._free(me), l._OrtReleaseTensor(ue);
                }
              }
              if (te === 0) return Z;
              throw new Error(`failed to call OrtRun(). error code = ${te}.`);
            } finally {
              l.stackRestore(B);
            }
          } finally {
            v.forEach(l._OrtReleaseTensor), R.forEach(l._free), l._OrtReleaseRunOptions(A), P.forEach(l._free);
          }
        }, u.endProfiling = (t) => {
          const e = (0, o.getInstance)(), n = c.get(t);
          if (!n) throw new Error("invalid session id");
          const r = n[0], s = e._OrtEndProfiling(r);
          if (s === 0) throw new Error("Can't get an profile file name");
          e._OrtFree(s);
        }, u.extractTransferableBuffers = (t) => {
          const e = [];
          for (const n of t) {
            const r = n[2];
            !Array.isArray(r) && r.buffer && e.push(r.buffer);
          }
          return e;
        };
      }, 6361: function(C, u, b) {
        var h = this && this.__createBinding || (Object.create ? function(s, l, d, m) {
          m === void 0 && (m = d);
          var y = Object.getOwnPropertyDescriptor(l, d);
          y && !("get" in y ? !l.__esModule : y.writable || y.configurable) || (y = { enumerable: !0, get: function() {
            return l[d];
          } }), Object.defineProperty(s, m, y);
        } : function(s, l, d, m) {
          m === void 0 && (m = d), s[m] = l[d];
        }), p = this && this.__setModuleDefault || (Object.create ? function(s, l) {
          Object.defineProperty(s, "default", { enumerable: !0, value: l });
        } : function(s, l) {
          s.default = l;
        }), g = this && this.__importStar || function(s) {
          if (s && s.__esModule) return s;
          var l = {};
          if (s != null) for (var d in s) d !== "default" && Object.prototype.hasOwnProperty.call(s, d) && h(l, s, d);
          return p(l, s), l;
        }, o = this && this.__importDefault || function(s) {
          return s && s.__esModule ? s : { default: s };
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.dispose = u.getInstance = u.initializeWebAssembly = void 0;
        const c = g(b(6449)), f = o(b(932)), a = b(3474);
        let i, t = !1, e = !1, n = !1;
        const r = (s, l) => l ? s ? "ort-wasm-simd-threaded.wasm" : "ort-wasm-threaded.wasm" : s ? "ort-wasm-simd.wasm" : "ort-wasm.wasm";
        u.initializeWebAssembly = async (s) => {
          if (t) return Promise.resolve();
          if (e) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
          if (n) throw new Error("previous call to 'initializeWebAssembly()' failed.");
          e = !0;
          const l = s.initTimeout, d = s.numThreads, m = s.simd, y = d > 1 && (() => {
            try {
              return typeof SharedArrayBuffer < "u" && (typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11])));
            } catch {
              return !1;
            }
          })(), w = m && (() => {
            try {
              return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
            } catch {
              return !1;
            }
          })(), _ = typeof s.wasmPaths == "string" ? s.wasmPaths : void 0, S = r(!1, y), A = r(w, y), P = typeof s.wasmPaths == "object" ? s.wasmPaths[A] : void 0;
          let v = !1;
          const R = [];
          if (l > 0 && R.push(new Promise((B) => {
            setTimeout(() => {
              v = !0, B();
            }, l);
          })), R.push(new Promise((B, q) => {
            const D = y ? a : f.default, O = { locateFile: (N, E) => y && N.endsWith(".worker.js") && typeof Blob < "u" ? URL.createObjectURL(new Blob([b(4154)], { type: "text/javascript" })) : N === S ? P ?? (_ ?? E) + A : E + N };
            if (y) if (typeof Blob > "u") O.mainScriptUrlOrBlob = c.join("/", "ort-wasm-threaded.js");
            else {
              const N = `var ortWasmThreaded=(function(){var _scriptDir;return ${D.toString()}})();`;
              O.mainScriptUrlOrBlob = new Blob([N], { type: "text/javascript" });
            }
            D(O).then((N) => {
              e = !1, t = !0, i = N, B();
            }, (N) => {
              e = !1, n = !0, q(N);
            });
          })), await Promise.race(R), v) throw new Error(`WebAssembly backend initializing failed due to timeout: ${l}ms`);
        }, u.getInstance = () => {
          if (t && i) return i;
          throw new Error("WebAssembly is not initialized yet.");
        }, u.dispose = () => {
          var s;
          !t || e || n || (e = !0, (s = i.PThread) === null || s === void 0 || s.terminateAllThreads(), i = void 0, e = !1, t = !1, n = !0);
        };
      }, 9710: (C, u, b) => {
        b.d(u, { Z: () => g });
        var h = b(477), p = b.n(h);
        function g() {
          return p()('/*!\n* ONNX Runtime Web v1.14.0\n* Copyright (c) Microsoft Corporation. All rights reserved.\n* Licensed under the MIT License.\n*/\n(()=>{var t={474:(t,e,n)=>{var _scriptDir,r=(_scriptDir=(_scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(t){function e(){return j.buffer!=D&&N(j.buffer),P}function r(){return j.buffer!=D&&N(j.buffer),U}function a(){return j.buffer!=D&&N(j.buffer),F}function i(){return j.buffer!=D&&N(j.buffer),I}function o(){return j.buffer!=D&&N(j.buffer),W}var u,c,s;t=t||{},u||(u=void 0!==t?t:{}),u.ready=new Promise((function(t,e){c=t,s=e}));var l,f,p,h,d,y,b=Object.assign({},u),m="./this.program",g=(t,e)=>{throw e},v="object"==typeof window,w="function"==typeof importScripts,_="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,O=u.ENVIRONMENT_IS_PTHREAD||!1,A="";function S(t){return u.locateFile?u.locateFile(t,A):A+t}if(_){let e;A=w?n(908).dirname(A)+"/":"//",y=()=>{d||(h=n(384),d=n(908))},l=function(t,e){return y(),t=d.normalize(t),h.readFileSync(t,e?void 0:"utf8")},p=t=>((t=l(t,!0)).buffer||(t=new Uint8Array(t)),t),f=(t,e,n)=>{y(),t=d.normalize(t),h.readFile(t,(function(t,r){t?n(t):e(r.buffer)}))},1<process.argv.length&&(m=process.argv[1].replace(/\\\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(t){if(!(t instanceof ct))throw t})),process.on("unhandledRejection",(function(t){throw t})),g=(t,e)=>{if(Q())throw process.exitCode=t,e;e instanceof ct||x("exiting due to exception: "+e),process.exit(t)},u.inspect=function(){return"[Emscripten Module object]"};try{e=n(925)}catch(t){throw console.error(\'The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?\'),t}n.g.Worker=e.Worker}else(v||w)&&(w?A=self.location.href:"undefined"!=typeof document&&document.currentScript&&(A=document.currentScript.src),_scriptDir&&(A=_scriptDir),A=0!==A.indexOf("blob:")?A.substr(0,A.replace(/[?#].*/,"").lastIndexOf("/")+1):"",_||(l=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.send(null),e.responseText},w&&(p=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.responseType="arraybuffer",e.send(null),new Uint8Array(e.response)}),f=(t,e,n)=>{var r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?e(r.response):n()},r.onerror=n,r.send(null)}));_&&"undefined"==typeof performance&&(n.g.performance=n(953).performance);var T=console.log.bind(console),E=console.warn.bind(console);_&&(y(),T=t=>h.writeSync(1,t+"\\n"),E=t=>h.writeSync(2,t+"\\n"));var M,C=u.print||T,x=u.printErr||E;Object.assign(u,b),b=null,u.thisProgram&&(m=u.thisProgram),u.quit&&(g=u.quit),u.wasmBinary&&(M=u.wasmBinary);var R=u.noExitRuntime||!1;"object"!=typeof WebAssembly&&at("no native wasm support detected");var j,k,D,P,U,F,I,W,H=!1,L="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function z(t,e,n){var r=(e>>>=0)+n;for(n=e;t[n]&&!(n>=r);)++n;if(16<n-e&&t.buffer&&L)return L.decode(t.buffer instanceof SharedArrayBuffer?t.slice(e,n):t.subarray(e,n));for(r="";e<n;){var a=t[e++];if(128&a){var i=63&t[e++];if(192==(224&a))r+=String.fromCharCode((31&a)<<6|i);else{var o=63&t[e++];65536>(a=224==(240&a)?(15&a)<<12|i<<6|o:(7&a)<<18|i<<12|o<<6|63&t[e++])?r+=String.fromCharCode(a):(a-=65536,r+=String.fromCharCode(55296|a>>10,56320|1023&a))}}else r+=String.fromCharCode(a)}return r}function Y(t,e){return(t>>>=0)?z(r(),t,e):""}function B(t,e,n,r){if(!(0<r))return 0;var a=n>>>=0;r=n+r-1;for(var i=0;i<t.length;++i){var o=t.charCodeAt(i);if(55296<=o&&57343>=o&&(o=65536+((1023&o)<<10)|1023&t.charCodeAt(++i)),127>=o){if(n>=r)break;e[n++>>>0]=o}else{if(2047>=o){if(n+1>=r)break;e[n++>>>0]=192|o>>6}else{if(65535>=o){if(n+2>=r)break;e[n++>>>0]=224|o>>12}else{if(n+3>=r)break;e[n++>>>0]=240|o>>18,e[n++>>>0]=128|o>>12&63}e[n++>>>0]=128|o>>6&63}e[n++>>>0]=128|63&o}}return e[n>>>0]=0,n-a}function G(t){for(var e=0,n=0;n<t.length;++n){var r=t.charCodeAt(n);127>=r?e++:2047>=r?e+=2:55296<=r&&57343>=r?(e+=4,++n):e+=3}return e}function N(t){D=t,u.HEAP8=P=new Int8Array(t),u.HEAP16=new Int16Array(t),u.HEAP32=F=new Int32Array(t),u.HEAPU8=U=new Uint8Array(t),u.HEAPU16=new Uint16Array(t),u.HEAPU32=I=new Uint32Array(t),u.HEAPF32=new Float32Array(t),u.HEAPF64=W=new Float64Array(t)}O&&(D=u.buffer);var V=u.INITIAL_MEMORY||16777216;if(O)j=u.wasmMemory,D=u.buffer;else if(u.wasmMemory)j=u.wasmMemory;else if(!((j=new WebAssembly.Memory({initial:V/65536,maximum:65536,shared:!0})).buffer instanceof SharedArrayBuffer))throw x("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),_&&console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"),Error("bad memory");j&&(D=j.buffer),V=D.byteLength,N(D);var $,q=[],X=[],J=[],Z=[];function Q(){return R||!1}function K(){var t=u.preRun.shift();q.unshift(t)}var tt,et=0,nt=null,rt=null;function at(t){throw O?postMessage({cmd:"onAbort",arg:t}):u.onAbort&&u.onAbort(t),x(t="Aborted("+t+")"),H=!0,t=new WebAssembly.RuntimeError(t+". Build with -sASSERTIONS for more info."),s(t),t}function it(){return tt.startsWith("data:application/octet-stream;base64,")}function ot(){var t=tt;try{if(t==tt&&M)return new Uint8Array(M);if(p)return p(t);throw"both async and sync fetching of the wasm failed"}catch(t){at(t)}}tt="ort-wasm-threaded.wasm",it()||(tt=S(tt));var ut={};function ct(t){this.name="ExitStatus",this.message="Program terminated with exit("+t+")",this.status=t}function st(t){(t=ht.Vb[t])||at(),ht.mc(t)}function lt(t){var e=ht.Cc();if(!e)return 6;ht.ac.push(e),ht.Vb[t.Ub]=e,e.Ub=t.Ub;var n={cmd:"run",start_routine:t.Ic,arg:t.zc,pthread_ptr:t.Ub};return e.$b=()=>{n.time=performance.now(),e.postMessage(n,t.Nc)},e.loaded&&(e.$b(),delete e.$b),0}function ft(t){if(O)return $t(1,1,t);Q()||(ht.oc(),u.onExit&&u.onExit(t),H=!0),g(t,new ct(t))}function pt(t,e){if(!e&&O)throw bt(t),"unwind";Q()||O||(me(),dt(J),be(0),re[1].length&&ae(1,10),re[2].length&&ae(2,10),ht.oc()),ft(t)}var ht={Yb:[],ac:[],qc:[],Vb:{},fc:function(){O&&ht.Ec()},Pc:function(){},Ec:function(){ht.receiveObjectTransfer=ht.Gc,ht.threadInitTLS=ht.pc,ht.setExitStatus=ht.nc,R=!1},nc:function(){},oc:function(){for(var t of Object.values(ht.Vb))ht.mc(t);for(t of ht.Yb)t.terminate();ht.Yb=[]},mc:function(t){var e=t.Ub;delete ht.Vb[e],ht.Yb.push(t),ht.ac.splice(ht.ac.indexOf(t),1),t.Ub=0,Oe(e)},Gc:function(){},pc:function(){ht.qc.forEach((t=>t()))},Fc:function(t,e){t.onmessage=n=>{var r=(n=n.data).cmd;if(t.Ub&&(ht.Bc=t.Ub),n.targetThread&&n.targetThread!=he()){var a=ht.Vb[n.Qc];a?a.postMessage(n,n.transferList):x(\'Internal error! Worker sent a message "\'+r+\'" to target pthread \'+n.targetThread+", but that thread no longer exists!")}else"processProxyingQueue"===r?zt(n.queue):"spawnThread"===r?lt(n):"cleanupThread"===r?st(n.thread):"killThread"===r?(n=n.thread,r=ht.Vb[n],delete ht.Vb[n],r.terminate(),Oe(n),ht.ac.splice(ht.ac.indexOf(r),1),r.Ub=0):"cancelThread"===r?ht.Vb[n.thread].postMessage({cmd:"cancel"}):"loaded"===r?(t.loaded=!0,e&&e(t),t.$b&&(t.$b(),delete t.$b)):"print"===r?C("Thread "+n.threadId+": "+n.text):"printErr"===r?x("Thread "+n.threadId+": "+n.text):"alert"===r?alert("Thread "+n.threadId+": "+n.text):"setimmediate"===n.target?t.postMessage(n):"onAbort"===r?u.onAbort&&u.onAbort(n.arg):r&&x("worker sent an unknown command "+r);ht.Bc=void 0},t.onerror=t=>{throw x("worker sent an error! "+t.filename+":"+t.lineno+": "+t.message),t},_&&(t.on("message",(function(e){t.onmessage({data:e})})),t.on("error",(function(e){t.onerror(e)})),t.on("detachedExit",(function(){}))),t.postMessage({cmd:"load",urlOrBlob:u.mainScriptUrlOrBlob||_scriptDir,wasmMemory:j,wasmModule:k})},yc:function(){var t=S("ort-wasm-threaded.worker.js");ht.Yb.push(new Worker(t))},Cc:function(){return 0==ht.Yb.length&&(ht.yc(),ht.Fc(ht.Yb[0])),ht.Yb.pop()}};function dt(t){for(;0<t.length;)t.shift()(u)}function yt(t){var e=Ee();return t=t(),Me(e),t}function bt(t){if(O)return $t(2,0,t);try{pt(t)}catch(t){t instanceof ct||"unwind"==t||g(1,t)}}u.PThread=ht,u.establishStackSpace=function(){var t=he(),e=a()[t+44>>2>>>0];t=a()[t+48>>2>>>0],Te(e,e-t),Me(e)};var mt=[];function gt(t){var e=mt[t];return e||(t>=mt.length&&(mt.length=t+1),mt[t]=e=$.get(t)),e}u.invokeEntryPoint=function(t,e){t=gt(t)(e),Q()?ht.nc(t):Ae(t)};var vt,wt,_t=[],Ot=0,At=0;function St(t){this.Zb=t,this.Sb=t-24,this.xc=function(t){i()[this.Sb+4>>2>>>0]=t},this.bc=function(){return i()[this.Sb+4>>2>>>0]},this.wc=function(t){i()[this.Sb+8>>2>>>0]=t},this.Dc=function(){return i()[this.Sb+8>>2>>>0]},this.rc=function(){a()[this.Sb>>2>>>0]=0},this.hc=function(t){t=t?1:0,e()[this.Sb+12>>0>>>0]=t},this.uc=function(){return 0!=e()[this.Sb+12>>0>>>0]},this.ic=function(t){t=t?1:0,e()[this.Sb+13>>0>>>0]=t},this.kc=function(){return 0!=e()[this.Sb+13>>0>>>0]},this.fc=function(t,e){this.cc(0),this.xc(t),this.wc(e),this.rc(),this.hc(!1),this.ic(!1)},this.sc=function(){Atomics.add(a(),this.Sb>>2,1)},this.Hc=function(){return 1===Atomics.sub(a(),this.Sb>>2,1)},this.cc=function(t){i()[this.Sb+16>>2>>>0]=t},this.tc=function(){return i()[this.Sb+16>>2>>>0]},this.vc=function(){if(Re(this.bc()))return i()[this.Zb>>2>>>0];var t=this.tc();return 0!==t?t:this.Zb}}function Tt(t){return ye(new St(t).Sb)}function Et(t,e,n,r){return O?$t(3,1,t,e,n,r):Mt(t,e,n,r)}function Mt(t,e,n,r){if("undefined"==typeof SharedArrayBuffer)return x("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var a=[];return O&&0===a.length?Et(t,e,n,r):(t={Ic:n,Ub:t,zc:r,Nc:a},O?(t.Oc="spawnThread",postMessage(t,a),0):lt(t))}function Ct(t,e,n){return O?$t(4,1,t,e,n):0}function xt(t,e){if(O)return $t(5,1,t,e)}function Rt(t,e){if(O)return $t(6,1,t,e)}function jt(t,e,n){if(O)return $t(7,1,t,e,n)}function kt(t,e,n){return O?$t(8,1,t,e,n):0}function Dt(t,e){if(O)return $t(9,1,t,e)}function Pt(t,e,n){if(O)return $t(10,1,t,e,n)}function Ut(t,e,n,r){if(O)return $t(11,1,t,e,n,r)}function Ft(t,e,n,r){if(O)return $t(12,1,t,e,n,r)}function It(t,e,n,r){if(O)return $t(13,1,t,e,n,r)}function Wt(t){if(O)return $t(14,1,t)}function Ht(t,e){if(O)return $t(15,1,t,e)}function Lt(t,e,n){if(O)return $t(16,1,t,e,n)}function zt(t){Atomics.store(a(),t>>2,1),he()&&_e(t),Atomics.compareExchange(a(),t>>2,1,0)}function Yt(t){return i()[t>>>2]+4294967296*a()[t+4>>>2]}function Bt(t,e,n,r,a,i){return O?$t(17,1,t,e,n,r,a,i):-52}function Gt(t,e,n,r,a,i){if(O)return $t(18,1,t,e,n,r,a,i)}function Nt(t){var n=G(t)+1,r=de(n);return r&&B(t,e(),r,n),r}function Vt(t,e,n){function r(t){return(t=t.toTimeString().match(/\\(([A-Za-z ]+)\\)$/))?t[1]:"GMT"}if(O)return $t(19,1,t,e,n);var o=(new Date).getFullYear(),u=new Date(o,0,1),c=new Date(o,6,1);o=u.getTimezoneOffset();var s=c.getTimezoneOffset(),l=Math.max(o,s);a()[t>>2>>>0]=60*l,a()[e>>2>>>0]=Number(o!=s),t=r(u),e=r(c),t=Nt(t),e=Nt(e),s<o?(i()[n>>2>>>0]=t,i()[n+4>>2>>>0]=e):(i()[n>>2>>>0]=e,i()[n+4>>2>>>0]=t)}function $t(t,e){var n=arguments.length-2,r=arguments;return yt((()=>{for(var a=Ce(8*n),i=a>>3,u=0;u<n;u++){var c=r[2+u];o()[i+u>>>0]=c}return we(t,n,a,e)}))}u.executeNotifiedProxyingQueue=zt,wt=_?()=>{var t=process.hrtime();return 1e3*t[0]+t[1]/1e6}:O?()=>performance.now()-u.__performance_now_clock_drift:()=>performance.now();var qt,Xt=[],Jt={};function Zt(){if(!qt){var t,e={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:m||"./this.program"};for(t in Jt)void 0===Jt[t]?delete e[t]:e[t]=Jt[t];var n=[];for(t in e)n.push(t+"="+e[t]);qt=n}return qt}function Qt(t,n){if(O)return $t(20,1,t,n);var r=0;return Zt().forEach((function(a,o){var u=n+r;for(o=i()[t+4*o>>2>>>0]=u,u=0;u<a.length;++u)e()[o++>>0>>>0]=a.charCodeAt(u);e()[o>>0>>>0]=0,r+=a.length+1})),0}function Kt(t,e){if(O)return $t(21,1,t,e);var n=Zt();i()[t>>2>>>0]=n.length;var r=0;return n.forEach((function(t){r+=t.length+1})),i()[e>>2>>>0]=r,0}function te(t){return O?$t(22,1,t):52}function ee(t,e,n,r){return O?$t(23,1,t,e,n,r):52}function ne(t,e,n,r,a){return O?$t(24,1,t,e,n,r,a):70}var re=[null,[],[]];function ae(t,e){var n=re[t];0===e||10===e?((1===t?C:x)(z(n,0)),n.length=0):n.push(e)}function ie(t,e,n,a){if(O)return $t(25,1,t,e,n,a);for(var o=0,u=0;u<n;u++){var c=i()[e>>2>>>0],s=i()[e+4>>2>>>0];e+=8;for(var l=0;l<s;l++)ae(t,r()[c+l>>>0]);o+=s}return i()[a>>2>>>0]=o,0}var oe=0;function ue(t){return 0==t%4&&(0!=t%100||0==t%400)}var ce=[31,29,31,30,31,30,31,31,30,31,30,31],se=[31,28,31,30,31,30,31,31,30,31,30,31];function le(t,n,r,i){function o(t,e,n){for(t="number"==typeof t?t.toString():t||"";t.length<e;)t=n[0]+t;return t}function u(t,e){return o(t,e,"0")}function c(t,e){function n(t){return 0>t?-1:0<t?1:0}var r;return 0===(r=n(t.getFullYear()-e.getFullYear()))&&0===(r=n(t.getMonth()-e.getMonth()))&&(r=n(t.getDate()-e.getDate())),r}function s(t){switch(t.getDay()){case 0:return new Date(t.getFullYear()-1,11,29);case 1:return t;case 2:return new Date(t.getFullYear(),0,3);case 3:return new Date(t.getFullYear(),0,2);case 4:return new Date(t.getFullYear(),0,1);case 5:return new Date(t.getFullYear()-1,11,31);case 6:return new Date(t.getFullYear()-1,11,30)}}function l(t){var e=t.Wb;for(t=new Date(new Date(t.Xb+1900,0,1).getTime());0<e;){var n=t.getMonth(),r=(ue(t.getFullYear())?ce:se)[n];if(!(e>r-t.getDate())){t.setDate(t.getDate()+e);break}e-=r-t.getDate()+1,t.setDate(1),11>n?t.setMonth(n+1):(t.setMonth(0),t.setFullYear(t.getFullYear()+1))}return n=new Date(t.getFullYear()+1,0,4),e=s(new Date(t.getFullYear(),0,4)),n=s(n),0>=c(e,t)?0>=c(n,t)?t.getFullYear()+1:t.getFullYear():t.getFullYear()-1}var f=a()[i+40>>2>>>0];for(var p in i={Lc:a()[i>>2>>>0],Kc:a()[i+4>>2>>>0],dc:a()[i+8>>2>>>0],jc:a()[i+12>>2>>>0],ec:a()[i+16>>2>>>0],Xb:a()[i+20>>2>>>0],Tb:a()[i+24>>2>>>0],Wb:a()[i+28>>2>>>0],Rc:a()[i+32>>2>>>0],Jc:a()[i+36>>2>>>0],Mc:f?Y(f):""},r=Y(r),f={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})r=r.replace(new RegExp(p,"g"),f[p]);var h="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),d="January February March April May June July August September October November December".split(" ");for(p in f={"%a":function(t){return h[t.Tb].substring(0,3)},"%A":function(t){return h[t.Tb]},"%b":function(t){return d[t.ec].substring(0,3)},"%B":function(t){return d[t.ec]},"%C":function(t){return u((t.Xb+1900)/100|0,2)},"%d":function(t){return u(t.jc,2)},"%e":function(t){return o(t.jc,2," ")},"%g":function(t){return l(t).toString().substring(2)},"%G":function(t){return l(t)},"%H":function(t){return u(t.dc,2)},"%I":function(t){return 0==(t=t.dc)?t=12:12<t&&(t-=12),u(t,2)},"%j":function(t){for(var e=0,n=0;n<=t.ec-1;e+=(ue(t.Xb+1900)?ce:se)[n++]);return u(t.jc+e,3)},"%m":function(t){return u(t.ec+1,2)},"%M":function(t){return u(t.Kc,2)},"%n":function(){return"\\n"},"%p":function(t){return 0<=t.dc&&12>t.dc?"AM":"PM"},"%S":function(t){return u(t.Lc,2)},"%t":function(){return"\\t"},"%u":function(t){return t.Tb||7},"%U":function(t){return u(Math.floor((t.Wb+7-t.Tb)/7),2)},"%V":function(t){var e=Math.floor((t.Wb+7-(t.Tb+6)%7)/7);if(2>=(t.Tb+371-t.Wb-2)%7&&e++,e)53==e&&(4==(n=(t.Tb+371-t.Wb)%7)||3==n&&ue(t.Xb)||(e=1));else{e=52;var n=(t.Tb+7-t.Wb-1)%7;(4==n||5==n&&ue(t.Xb%400-1))&&e++}return u(e,2)},"%w":function(t){return t.Tb},"%W":function(t){return u(Math.floor((t.Wb+7-(t.Tb+6)%7)/7),2)},"%y":function(t){return(t.Xb+1900).toString().substring(2)},"%Y":function(t){return t.Xb+1900},"%z":function(t){var e=0<=(t=t.Jc);return t=Math.abs(t)/60,(e?"+":"-")+String("0000"+(t/60*100+t%60)).slice(-4)},"%Z":function(t){return t.Mc},"%%":function(){return"%"}},r=r.replace(/%%/g,"\\0\\0"),f)r.includes(p)&&(r=r.replace(new RegExp(p,"g"),f[p](i)));return p=function(t){var e=Array(G(t)+1);return B(t,e,0,e.length),e}(r=r.replace(/\\0\\0/g,"%")),p.length>n?0:(function(t,n){e().set(t,n>>>0)}(p,t),p.length-1)}ht.fc();var fe=[null,ft,bt,Et,Ct,xt,Rt,jt,kt,Dt,Pt,Ut,Ft,It,Wt,Ht,Lt,Bt,Gt,Vt,Qt,Kt,te,ee,ne,ie],pe={b:function(t){return de(t+24)+24},n:function(t){return(t=new St(t)).uc()||(t.hc(!0),Ot--),t.ic(!1),_t.push(t),t.sc(),t.vc()},ma:function(t){throw x("Unexpected exception thrown, this is not properly supported - aborting"),H=!0,t},x:function(){Se(0);var t=_t.pop();if(t.Hc()&&!t.kc()){var e=t.Dc();e&&gt(e)(t.Zb),Tt(t.Zb)}At=0},e:function(){var t=At;if(!t)return oe=0;var e=new St(t);e.cc(t);var n=e.bc();if(!n)return oe=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(xe(i,n,e.Sb+16))return oe=i,t}return oe=n,t},l:function(){var t=At;if(!t)return oe=0;var e=new St(t);e.cc(t);var n=e.bc();if(!n)return oe=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(xe(i,n,e.Sb+16))return oe=i,t}return oe=n,t},h:function(){var t=At;if(!t)return oe=0;var e=new St(t);e.cc(t);var n=e.bc();if(!n)return oe=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(xe(i,n,e.Sb+16))return oe=i,t}return oe=n,t},t:Tt,M:function(){var t=_t.pop();t||at("no exception to throw");var e=t.Zb;throw t.kc()||(_t.push(t),t.ic(!0),t.hc(!1),Ot++),At=e,e},c:function(t,e,n){throw new St(t).fc(e,n),At=t,Ot++,t},pa:function(){return Ot},Fa:function(t){ge(t,!w,1,!v),ht.pc()},T:function(t){O?postMessage({cmd:"cleanupThread",thread:t}):st(t)},xa:Mt,j:function(t){throw At||(At=t),t},H:Ct,Ma:xt,ua:Rt,wa:jt,oa:kt,Ka:Dt,Ca:Pt,Ja:Ut,V:Ft,va:It,sa:Wt,La:Ht,ta:Lt,Ta:function(){},X:function(){at("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},Ua:function(){at("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},W:function(){return Date.now()},ya:function(){return 2097152},Oa:function(){return!0},za:function(t,e,n,r){if(t==e)setTimeout((()=>zt(r)));else if(O)postMessage({targetThread:t,cmd:"processProxyingQueue",queue:r});else{if(!(t=ht.Vb[t]))return;t.postMessage({cmd:"processProxyingQueue",queue:r})}return 1},Ea:function(){return-1},Pa:function(t,e){t=new Date(1e3*Yt(t)),a()[e>>2>>>0]=t.getUTCSeconds(),a()[e+4>>2>>>0]=t.getUTCMinutes(),a()[e+8>>2>>>0]=t.getUTCHours(),a()[e+12>>2>>>0]=t.getUTCDate(),a()[e+16>>2>>>0]=t.getUTCMonth(),a()[e+20>>2>>>0]=t.getUTCFullYear()-1900,a()[e+24>>2>>>0]=t.getUTCDay(),t=(t.getTime()-Date.UTC(t.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,a()[e+28>>2>>>0]=t},Qa:function(t,e){t=new Date(1e3*Yt(t)),a()[e>>2>>>0]=t.getSeconds(),a()[e+4>>2>>>0]=t.getMinutes(),a()[e+8>>2>>>0]=t.getHours(),a()[e+12>>2>>>0]=t.getDate(),a()[e+16>>2>>>0]=t.getMonth(),a()[e+20>>2>>>0]=t.getFullYear()-1900,a()[e+24>>2>>>0]=t.getDay();var n=new Date(t.getFullYear(),0,1),r=(t.getTime()-n.getTime())/864e5|0;a()[e+28>>2>>>0]=r,a()[e+36>>2>>>0]=-60*t.getTimezoneOffset(),r=new Date(t.getFullYear(),6,1).getTimezoneOffset(),t=0|(r!=(n=n.getTimezoneOffset())&&t.getTimezoneOffset()==Math.min(n,r)),a()[e+32>>2>>>0]=t},Ra:function(t){var e=new Date(a()[t+20>>2>>>0]+1900,a()[t+16>>2>>>0],a()[t+12>>2>>>0],a()[t+8>>2>>>0],a()[t+4>>2>>>0],a()[t>>2>>>0],0),n=a()[t+32>>2>>>0],r=e.getTimezoneOffset(),i=new Date(e.getFullYear(),0,1),o=new Date(e.getFullYear(),6,1).getTimezoneOffset(),u=i.getTimezoneOffset(),c=Math.min(u,o);return 0>n?a()[t+32>>2>>>0]=Number(o!=u&&c==r):0<n!=(c==r)&&(o=Math.max(u,o),e.setTime(e.getTime()+6e4*((0<n?c:o)-r))),a()[t+24>>2>>>0]=e.getDay(),n=(e.getTime()-i.getTime())/864e5|0,a()[t+28>>2>>>0]=n,a()[t>>2>>>0]=e.getSeconds(),a()[t+4>>2>>>0]=e.getMinutes(),a()[t+8>>2>>>0]=e.getHours(),a()[t+12>>2>>>0]=e.getDate(),a()[t+16>>2>>>0]=e.getMonth(),e.getTime()/1e3|0},Aa:Bt,Ba:Gt,Sa:function t(e,n,r){t.Ac||(t.Ac=!0,Vt(e,n,r))},y:function(){at("")},U:function(){if(!_&&!w){var t="Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread";vt||(vt={}),vt[t]||(vt[t]=1,_&&(t="warning: "+t),x(t))}},ra:function(){return 4294901760},B:wt,Ia:function(t,e,n){r().copyWithin(t>>>0,e>>>0,e+n>>>0)},F:function(){return _?n(993).cpus().length:navigator.hardwareConcurrency},Da:function(t,e,n){Xt.length=e,n>>=3;for(var r=0;r<e;r++)Xt[r]=o()[n+r>>>0];return(0>t?ut[-t-1]:fe[t]).apply(null,Xt)},qa:function(t){var e=r().length;if((t>>>=0)<=e||4294901760<t)return!1;for(var n=1;4>=n;n*=2){var a=e*(1+.2/n);a=Math.min(a,t+100663296);var i=Math;a=Math.max(t,a),i=i.min.call(i,4294901760,a+(65536-a%65536)%65536);t:{try{j.grow(i-D.byteLength+65535>>>16),N(j.buffer);var o=1;break t}catch(t){}o=void 0}if(o)return!0}return!1},Na:function(){throw"unwind"},Ga:Qt,Ha:Kt,J:pt,I:te,S:ee,ga:ne,R:ie,d:function(){return oe},na:function t(r,a){t.lc||(t.lc=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var t=new Uint8Array(1);return()=>(crypto.getRandomValues(t),t[0])}if(_)try{var e=n(Object(function(){var t=new Error("Cannot find module \'crypto\'");throw t.code="MODULE_NOT_FOUND",t}()));return()=>e.randomBytes(1)[0]}catch(t){}return()=>at("randomDevice")}());for(var i=0;i<a;i++)e()[r+i>>0>>>0]=t.lc();return 0},ia:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},ja:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},K:function(t){var e=Ee();try{return gt(t)()}catch(t){if(Me(e),t!==t+0)throw t;Se(1,0)}},f:function(t,e){var n=Ee();try{return gt(t)(e)}catch(t){if(Me(n),t!==t+0)throw t;Se(1,0)}},P:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},Q:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},k:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},p:function(t,e,n,r){var a=Ee();try{return gt(t)(e,n,r)}catch(t){if(Me(a),t!==t+0)throw t;Se(1,0)}},q:function(t,e,n,r,a){var i=Ee();try{return gt(t)(e,n,r,a)}catch(t){if(Me(i),t!==t+0)throw t;Se(1,0)}},N:function(t,e,n,r,a,i){var o=Ee();try{return gt(t)(e,n,r,a,i)}catch(t){if(Me(o),t!==t+0)throw t;Se(1,0)}},s:function(t,e,n,r,a,i){var o=Ee();try{return gt(t)(e,n,r,a,i)}catch(t){if(Me(o),t!==t+0)throw t;Se(1,0)}},w:function(t,e,n,r,a,i,o){var u=Ee();try{return gt(t)(e,n,r,a,i,o)}catch(t){if(Me(u),t!==t+0)throw t;Se(1,0)}},L:function(t,e,n,r,a,i,o,u){var c=Ee();try{return gt(t)(e,n,r,a,i,o,u)}catch(t){if(Me(c),t!==t+0)throw t;Se(1,0)}},E:function(t,e,n,r,a,i,o,u,c,s,l,f){var p=Ee();try{return gt(t)(e,n,r,a,i,o,u,c,s,l,f)}catch(t){if(Me(p),t!==t+0)throw t;Se(1,0)}},aa:function(t,e,n,r,a,i,o,u){var c=Ee();try{return He(t,e,n,r,a,i,o,u)}catch(t){if(Me(c),t!==t+0)throw t;Se(1,0)}},_:function(t,e,n,r,a,i,o){var u=Ee();try{return ke(t,e,n,r,a,i,o)}catch(t){if(Me(u),t!==t+0)throw t;Se(1,0)}},Z:function(t,e,n,r,a){var i=Ee();try{return Le(t,e,n,r,a)}catch(t){if(Me(i),t!==t+0)throw t;Se(1,0)}},ca:function(t,e,n,r){var a=Ee();try{return Ie(t,e,n,r)}catch(t){if(Me(a),t!==t+0)throw t;Se(1,0)}},$:function(t){var e=Ee();try{return je(t)}catch(t){if(Me(e),t!==t+0)throw t;Se(1,0)}},ba:function(t,e){var n=Ee();try{return We(t,e)}catch(t){if(Me(n),t!==t+0)throw t;Se(1,0)}},Y:function(t,e,n){var r=Ee();try{return De(t,e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},g:function(t){var e=Ee();try{gt(t)()}catch(t){if(Me(e),t!==t+0)throw t;Se(1,0)}},r:function(t,e){var n=Ee();try{gt(t)(e)}catch(t){if(Me(n),t!==t+0)throw t;Se(1,0)}},i:function(t,e,n){var r=Ee();try{gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},ha:function(t,e,n,r){var a=Ee();try{gt(t)(e,n,r)}catch(t){if(Me(a),t!==t+0)throw t;Se(1,0)}},m:function(t,e,n,r){var a=Ee();try{gt(t)(e,n,r)}catch(t){if(Me(a),t!==t+0)throw t;Se(1,0)}},v:function(t,e,n,r,a){var i=Ee();try{gt(t)(e,n,r,a)}catch(t){if(Me(i),t!==t+0)throw t;Se(1,0)}},u:function(t,e,n,r,a,i){var o=Ee();try{gt(t)(e,n,r,a,i)}catch(t){if(Me(o),t!==t+0)throw t;Se(1,0)}},O:function(t,e,n,r,a,i,o){var u=Ee();try{gt(t)(e,n,r,a,i,o)}catch(t){if(Me(u),t!==t+0)throw t;Se(1,0)}},A:function(t,e,n,r,a,i,o,u){var c=Ee();try{gt(t)(e,n,r,a,i,o,u)}catch(t){if(Me(c),t!==t+0)throw t;Se(1,0)}},ka:function(t,e,n,r,a,i,o,u,c){var s=Ee();try{gt(t)(e,n,r,a,i,o,u,c)}catch(t){if(Me(s),t!==t+0)throw t;Se(1,0)}},C:function(t,e,n,r,a,i,o,u,c,s,l){var f=Ee();try{gt(t)(e,n,r,a,i,o,u,c,s,l)}catch(t){if(Me(f),t!==t+0)throw t;Se(1,0)}},D:function(t,e,n,r,a,i,o,u,c,s,l,f,p,h,d,y){var b=Ee();try{gt(t)(e,n,r,a,i,o,u,c,s,l,f,p,h,d,y)}catch(t){if(Me(b),t!==t+0)throw t;Se(1,0)}},fa:function(t,e,n,r,a,i,o,u){var c=Ee();try{Pe(t,e,n,r,a,i,o,u)}catch(t){if(Me(c),t!==t+0)throw t;Se(1,0)}},da:function(t,e,n,r,a,i,o,u,c,s,l,f){var p=Ee();try{Fe(t,e,n,r,a,i,o,u,c,s,l,f)}catch(t){if(Me(p),t!==t+0)throw t;Se(1,0)}},ea:function(t,e,n,r,a,i){var o=Ee();try{Ue(t,e,n,r,a,i)}catch(t){if(Me(o),t!==t+0)throw t;Se(1,0)}},o:function(t){return t},a:j||u.wasmMemory,G:function(t){oe=t},la:le,z:function(t,e,n,r){return le(t,e,n,r)}};!function(){function t(t,e){u.asm=t.exports,ht.qc.push(u.asm.sb),$=u.asm.ub,X.unshift(u.asm.Va),k=e,O||(et--,u.monitorRunDependencies&&u.monitorRunDependencies(et),0==et&&(null!==nt&&(clearInterval(nt),nt=null),rt&&(t=rt,rt=null,t())))}function e(e){t(e.instance,e.module)}function n(t){return function(){if(!M&&(v||w)){if("function"==typeof fetch&&!tt.startsWith("file://"))return fetch(tt,{credentials:"same-origin"}).then((function(t){if(!t.ok)throw"failed to load wasm binary file at \'"+tt+"\'";return t.arrayBuffer()})).catch((function(){return ot()}));if(f)return new Promise((function(t,e){f(tt,(function(e){t(new Uint8Array(e))}),e)}))}return Promise.resolve().then((function(){return ot()}))}().then((function(t){return WebAssembly.instantiate(t,r)})).then((function(t){return t})).then(t,(function(t){x("failed to asynchronously prepare wasm: "+t),at(t)}))}var r={a:pe};if(O||(et++,u.monitorRunDependencies&&u.monitorRunDependencies(et)),u.instantiateWasm)try{return u.instantiateWasm(r,t)}catch(t){return x("Module.instantiateWasm callback failed with error: "+t),!1}(M||"function"!=typeof WebAssembly.instantiateStreaming||it()||tt.startsWith("file://")||_||"function"!=typeof fetch?n(e):fetch(tt,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,r).then(e,(function(t){return x("wasm streaming compile failed: "+t),x("falling back to ArrayBuffer instantiation"),n(e)}))}))).catch(s)}(),u.___wasm_call_ctors=function(){return(u.___wasm_call_ctors=u.asm.Va).apply(null,arguments)},u._OrtInit=function(){return(u._OrtInit=u.asm.Wa).apply(null,arguments)},u._OrtCreateSessionOptions=function(){return(u._OrtCreateSessionOptions=u.asm.Xa).apply(null,arguments)},u._OrtAppendExecutionProvider=function(){return(u._OrtAppendExecutionProvider=u.asm.Ya).apply(null,arguments)},u._OrtAddSessionConfigEntry=function(){return(u._OrtAddSessionConfigEntry=u.asm.Za).apply(null,arguments)},u._OrtReleaseSessionOptions=function(){return(u._OrtReleaseSessionOptions=u.asm._a).apply(null,arguments)},u._OrtCreateSession=function(){return(u._OrtCreateSession=u.asm.$a).apply(null,arguments)},u._OrtReleaseSession=function(){return(u._OrtReleaseSession=u.asm.ab).apply(null,arguments)},u._OrtGetInputCount=function(){return(u._OrtGetInputCount=u.asm.bb).apply(null,arguments)},u._OrtGetOutputCount=function(){return(u._OrtGetOutputCount=u.asm.cb).apply(null,arguments)},u._OrtGetInputName=function(){return(u._OrtGetInputName=u.asm.db).apply(null,arguments)},u._OrtGetOutputName=function(){return(u._OrtGetOutputName=u.asm.eb).apply(null,arguments)},u._OrtFree=function(){return(u._OrtFree=u.asm.fb).apply(null,arguments)},u._OrtCreateTensor=function(){return(u._OrtCreateTensor=u.asm.gb).apply(null,arguments)},u._OrtGetTensorData=function(){return(u._OrtGetTensorData=u.asm.hb).apply(null,arguments)},u._OrtReleaseTensor=function(){return(u._OrtReleaseTensor=u.asm.ib).apply(null,arguments)},u._OrtCreateRunOptions=function(){return(u._OrtCreateRunOptions=u.asm.jb).apply(null,arguments)},u._OrtAddRunConfigEntry=function(){return(u._OrtAddRunConfigEntry=u.asm.kb).apply(null,arguments)},u._OrtReleaseRunOptions=function(){return(u._OrtReleaseRunOptions=u.asm.lb).apply(null,arguments)},u._OrtRun=function(){return(u._OrtRun=u.asm.mb).apply(null,arguments)},u._OrtEndProfiling=function(){return(u._OrtEndProfiling=u.asm.nb).apply(null,arguments)};var he=u._pthread_self=function(){return(he=u._pthread_self=u.asm.ob).apply(null,arguments)},de=u._malloc=function(){return(de=u._malloc=u.asm.pb).apply(null,arguments)},ye=u._free=function(){return(ye=u._free=u.asm.qb).apply(null,arguments)},be=u._fflush=function(){return(be=u._fflush=u.asm.rb).apply(null,arguments)};u.__emscripten_tls_init=function(){return(u.__emscripten_tls_init=u.asm.sb).apply(null,arguments)};var me=u.___funcs_on_exit=function(){return(me=u.___funcs_on_exit=u.asm.tb).apply(null,arguments)},ge=u.__emscripten_thread_init=function(){return(ge=u.__emscripten_thread_init=u.asm.vb).apply(null,arguments)};u.__emscripten_thread_crashed=function(){return(u.__emscripten_thread_crashed=u.asm.wb).apply(null,arguments)};var ve,we=u._emscripten_run_in_main_runtime_thread_js=function(){return(we=u._emscripten_run_in_main_runtime_thread_js=u.asm.xb).apply(null,arguments)},_e=u.__emscripten_proxy_execute_task_queue=function(){return(_e=u.__emscripten_proxy_execute_task_queue=u.asm.yb).apply(null,arguments)},Oe=u.__emscripten_thread_free_data=function(){return(Oe=u.__emscripten_thread_free_data=u.asm.zb).apply(null,arguments)},Ae=u.__emscripten_thread_exit=function(){return(Ae=u.__emscripten_thread_exit=u.asm.Ab).apply(null,arguments)},Se=u._setThrew=function(){return(Se=u._setThrew=u.asm.Bb).apply(null,arguments)},Te=u._emscripten_stack_set_limits=function(){return(Te=u._emscripten_stack_set_limits=u.asm.Cb).apply(null,arguments)},Ee=u.stackSave=function(){return(Ee=u.stackSave=u.asm.Db).apply(null,arguments)},Me=u.stackRestore=function(){return(Me=u.stackRestore=u.asm.Eb).apply(null,arguments)},Ce=u.stackAlloc=function(){return(Ce=u.stackAlloc=u.asm.Fb).apply(null,arguments)},xe=u.___cxa_can_catch=function(){return(xe=u.___cxa_can_catch=u.asm.Gb).apply(null,arguments)},Re=u.___cxa_is_pointer_type=function(){return(Re=u.___cxa_is_pointer_type=u.asm.Hb).apply(null,arguments)},je=u.dynCall_j=function(){return(je=u.dynCall_j=u.asm.Ib).apply(null,arguments)},ke=u.dynCall_iiiiij=function(){return(ke=u.dynCall_iiiiij=u.asm.Jb).apply(null,arguments)},De=u.dynCall_jii=function(){return(De=u.dynCall_jii=u.asm.Kb).apply(null,arguments)},Pe=u.dynCall_viiiiij=function(){return(Pe=u.dynCall_viiiiij=u.asm.Lb).apply(null,arguments)},Ue=u.dynCall_vjji=function(){return(Ue=u.dynCall_vjji=u.asm.Mb).apply(null,arguments)},Fe=u.dynCall_viiijjjii=function(){return(Fe=u.dynCall_viiijjjii=u.asm.Nb).apply(null,arguments)},Ie=u.dynCall_iij=function(){return(Ie=u.dynCall_iij=u.asm.Ob).apply(null,arguments)},We=u.dynCall_ji=function(){return(We=u.dynCall_ji=u.asm.Pb).apply(null,arguments)},He=u.dynCall_iiiiiij=function(){return(He=u.dynCall_iiiiiij=u.asm.Qb).apply(null,arguments)},Le=u.dynCall_iiij=function(){return(Le=u.dynCall_iiij=u.asm.Rb).apply(null,arguments)};function ze(){function t(){if(!ve&&(ve=!0,u.calledRun=!0,!H)&&(O||dt(X),c(u),u.onRuntimeInitialized&&u.onRuntimeInitialized(),!O)){if(u.postRun)for("function"==typeof u.postRun&&(u.postRun=[u.postRun]);u.postRun.length;){var t=u.postRun.shift();Z.unshift(t)}dt(Z)}}if(!(0<et))if(O)c(u),O||dt(X),postMessage({cmd:"loaded"});else{if(u.preRun)for("function"==typeof u.preRun&&(u.preRun=[u.preRun]);u.preRun.length;)K();dt(q),0<et||(u.setStatus?(u.setStatus("Running..."),setTimeout((function(){setTimeout((function(){u.setStatus("")}),1),t()}),1)):t())}}if(u.UTF8ToString=Y,u.stringToUTF8=function(t,e,n){return B(t,r(),e,n)},u.lengthBytesUTF8=G,u.keepRuntimeAlive=Q,u.wasmMemory=j,u.stackSave=Ee,u.stackRestore=Me,u.stackAlloc=Ce,u.ExitStatus=ct,u.PThread=ht,rt=function t(){ve||ze(),ve||(rt=t)},u.preInit)for("function"==typeof u.preInit&&(u.preInit=[u.preInit]);0<u.preInit.length;)u.preInit.pop()();return ze(),t.ready});t.exports=r},932:(t,e,n)=>{var _scriptDir,r=(_scriptDir=(_scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(t){var e,r,a;t=t||{},e||(e=void 0!==t?t:{}),e.ready=new Promise((function(t,e){r=t,a=e}));var i,o,u,c,s,l,f=Object.assign({},e),p="./this.program",h=(t,e)=>{throw e},d="object"==typeof window,y="function"==typeof importScripts,b="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,m="";b?(m=y?n(908).dirname(m)+"/":"//",l=()=>{s||(c=n(384),s=n(908))},i=function(t,e){return l(),t=s.normalize(t),c.readFileSync(t,e?void 0:"utf8")},u=t=>((t=i(t,!0)).buffer||(t=new Uint8Array(t)),t),o=(t,e,n)=>{l(),t=s.normalize(t),c.readFile(t,(function(t,r){t?n(t):e(r.buffer)}))},1<process.argv.length&&(p=process.argv[1].replace(/\\\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(t){if(!(t instanceof J))throw t})),process.on("unhandledRejection",(function(t){throw t})),h=(t,e)=>{if(_||0<L)throw process.exitCode=t,e;e instanceof J||w("exiting due to exception: "+e),process.exit(t)},e.inspect=function(){return"[Emscripten Module object]"}):(d||y)&&(y?m=self.location.href:"undefined"!=typeof document&&document.currentScript&&(m=document.currentScript.src),_scriptDir&&(m=_scriptDir),m=0!==m.indexOf("blob:")?m.substr(0,m.replace(/[?#].*/,"").lastIndexOf("/")+1):"",i=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.send(null),e.responseText},y&&(u=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.responseType="arraybuffer",e.send(null),new Uint8Array(e.response)}),o=(t,e,n)=>{var r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?e(r.response):n()},r.onerror=n,r.send(null)});var g,v=e.print||console.log.bind(console),w=e.printErr||console.warn.bind(console);Object.assign(e,f),f=null,e.thisProgram&&(p=e.thisProgram),e.quit&&(h=e.quit),e.wasmBinary&&(g=e.wasmBinary);var _=e.noExitRuntime||!1;"object"!=typeof WebAssembly&&V("no native wasm support detected");var O,A,S,T,E,M,C=!1,x="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function R(t,e,n){var r=(e>>>=0)+n;for(n=e;t[n]&&!(n>=r);)++n;if(16<n-e&&t.buffer&&x)return x.decode(t.subarray(e,n));for(r="";e<n;){var a=t[e++];if(128&a){var i=63&t[e++];if(192==(224&a))r+=String.fromCharCode((31&a)<<6|i);else{var o=63&t[e++];65536>(a=224==(240&a)?(15&a)<<12|i<<6|o:(7&a)<<18|i<<12|o<<6|63&t[e++])?r+=String.fromCharCode(a):(a-=65536,r+=String.fromCharCode(55296|a>>10,56320|1023&a))}}else r+=String.fromCharCode(a)}return r}function j(t,e){return(t>>>=0)?R(T,t,e):""}function k(t,e,n,r){if(!(0<r))return 0;var a=n>>>=0;r=n+r-1;for(var i=0;i<t.length;++i){var o=t.charCodeAt(i);if(55296<=o&&57343>=o&&(o=65536+((1023&o)<<10)|1023&t.charCodeAt(++i)),127>=o){if(n>=r)break;e[n++>>>0]=o}else{if(2047>=o){if(n+1>=r)break;e[n++>>>0]=192|o>>6}else{if(65535>=o){if(n+2>=r)break;e[n++>>>0]=224|o>>12}else{if(n+3>=r)break;e[n++>>>0]=240|o>>18,e[n++>>>0]=128|o>>12&63}e[n++>>>0]=128|o>>6&63}e[n++>>>0]=128|63&o}}return e[n>>>0]=0,n-a}function D(t){for(var e=0,n=0;n<t.length;++n){var r=t.charCodeAt(n);127>=r?e++:2047>=r?e+=2:55296<=r&&57343>=r?(e+=4,++n):e+=3}return e}function P(){var t=O.buffer;A=t,e.HEAP8=S=new Int8Array(t),e.HEAP16=new Int16Array(t),e.HEAP32=E=new Int32Array(t),e.HEAPU8=T=new Uint8Array(t),e.HEAPU16=new Uint16Array(t),e.HEAPU32=M=new Uint32Array(t),e.HEAPF32=new Float32Array(t),e.HEAPF64=new Float64Array(t)}var U,F=[],I=[],W=[],H=[],L=0;function z(){var t=e.preRun.shift();F.unshift(t)}var Y,B=0,G=null,N=null;function V(t){throw e.onAbort&&e.onAbort(t),w(t="Aborted("+t+")"),C=!0,t=new WebAssembly.RuntimeError(t+". Build with -sASSERTIONS for more info."),a(t),t}function $(){return Y.startsWith("data:application/octet-stream;base64,")}if(Y="ort-wasm.wasm",!$()){var q=Y;Y=e.locateFile?e.locateFile(q,m):m+q}function X(){var t=Y;try{if(t==Y&&g)return new Uint8Array(g);if(u)return u(t);throw"both async and sync fetching of the wasm failed"}catch(t){V(t)}}function J(t){this.name="ExitStatus",this.message="Program terminated with exit("+t+")",this.status=t}function Z(t){for(;0<t.length;)t.shift()(e)}var Q=[],K=0,tt=0;function et(t){this.Db=t,this.zb=t-24,this.Ub=function(t){M[this.zb+4>>2>>>0]=t},this.Eb=function(){return M[this.zb+4>>2>>>0]},this.Sb=function(t){M[this.zb+8>>2>>>0]=t},this.Wb=function(){return M[this.zb+8>>2>>>0]},this.Tb=function(){E[this.zb>>2>>>0]=0},this.Ib=function(t){S[this.zb+12>>0>>>0]=t?1:0},this.Pb=function(){return 0!=S[this.zb+12>>0>>>0]},this.Jb=function(t){S[this.zb+13>>0>>>0]=t?1:0},this.Lb=function(){return 0!=S[this.zb+13>>0>>>0]},this.Rb=function(t,e){this.Fb(0),this.Ub(t),this.Sb(e),this.Tb(),this.Ib(!1),this.Jb(!1)},this.Nb=function(){E[this.zb>>2>>>0]+=1},this.Xb=function(){var t=E[this.zb>>2>>>0];return E[this.zb>>2>>>0]=t-1,1===t},this.Fb=function(t){M[this.zb+16>>2>>>0]=t},this.Ob=function(){return M[this.zb+16>>2>>>0]},this.Qb=function(){if(Mt(this.Eb()))return M[this.Db>>2>>>0];var t=this.Ob();return 0!==t?t:this.Db}}function nt(t){return vt(new et(t).zb)}var rt=[];function at(t){var e=rt[t];return e||(t>=rt.length&&(rt.length=t+1),rt[t]=e=U.get(t)),e}function it(t){var e=D(t)+1,n=gt(e);return n&&k(t,S,n,e),n}var ot={};function ut(){if(!ct){var t,e={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:p||"./this.program"};for(t in ot)void 0===ot[t]?delete e[t]:e[t]=ot[t];var n=[];for(t in e)n.push(t+"="+e[t]);ct=n}return ct}var ct,st=[null,[],[]];function lt(t,e){var n=st[t];0===e||10===e?((1===t?v:w)(R(n,0)),n.length=0):n.push(e)}var ft=0;function pt(t){return 0==t%4&&(0!=t%100||0==t%400)}var ht=[31,29,31,30,31,30,31,31,30,31,30,31],dt=[31,28,31,30,31,30,31,31,30,31,30,31];function yt(t,e,n,r){function a(t,e,n){for(t="number"==typeof t?t.toString():t||"";t.length<e;)t=n[0]+t;return t}function i(t,e){return a(t,e,"0")}function o(t,e){function n(t){return 0>t?-1:0<t?1:0}var r;return 0===(r=n(t.getFullYear()-e.getFullYear()))&&0===(r=n(t.getMonth()-e.getMonth()))&&(r=n(t.getDate()-e.getDate())),r}function u(t){switch(t.getDay()){case 0:return new Date(t.getFullYear()-1,11,29);case 1:return t;case 2:return new Date(t.getFullYear(),0,3);case 3:return new Date(t.getFullYear(),0,2);case 4:return new Date(t.getFullYear(),0,1);case 5:return new Date(t.getFullYear()-1,11,31);case 6:return new Date(t.getFullYear()-1,11,30)}}function c(t){var e=t.Bb;for(t=new Date(new Date(t.Cb+1900,0,1).getTime());0<e;){var n=t.getMonth(),r=(pt(t.getFullYear())?ht:dt)[n];if(!(e>r-t.getDate())){t.setDate(t.getDate()+e);break}e-=r-t.getDate()+1,t.setDate(1),11>n?t.setMonth(n+1):(t.setMonth(0),t.setFullYear(t.getFullYear()+1))}return n=new Date(t.getFullYear()+1,0,4),e=u(new Date(t.getFullYear(),0,4)),n=u(n),0>=o(e,t)?0>=o(n,t)?t.getFullYear()+1:t.getFullYear():t.getFullYear()-1}var s=E[r+40>>2>>>0];for(var l in r={$b:E[r>>2>>>0],Zb:E[r+4>>2>>>0],Gb:E[r+8>>2>>>0],Kb:E[r+12>>2>>>0],Hb:E[r+16>>2>>>0],Cb:E[r+20>>2>>>0],Ab:E[r+24>>2>>>0],Bb:E[r+28>>2>>>0],bc:E[r+32>>2>>>0],Yb:E[r+36>>2>>>0],ac:s?j(s):""},n=j(n),s={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})n=n.replace(new RegExp(l,"g"),s[l]);var f="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),p="January February March April May June July August September October November December".split(" ");for(l in s={"%a":function(t){return f[t.Ab].substring(0,3)},"%A":function(t){return f[t.Ab]},"%b":function(t){return p[t.Hb].substring(0,3)},"%B":function(t){return p[t.Hb]},"%C":function(t){return i((t.Cb+1900)/100|0,2)},"%d":function(t){return i(t.Kb,2)},"%e":function(t){return a(t.Kb,2," ")},"%g":function(t){return c(t).toString().substring(2)},"%G":function(t){return c(t)},"%H":function(t){return i(t.Gb,2)},"%I":function(t){return 0==(t=t.Gb)?t=12:12<t&&(t-=12),i(t,2)},"%j":function(t){for(var e=0,n=0;n<=t.Hb-1;e+=(pt(t.Cb+1900)?ht:dt)[n++]);return i(t.Kb+e,3)},"%m":function(t){return i(t.Hb+1,2)},"%M":function(t){return i(t.Zb,2)},"%n":function(){return"\\n"},"%p":function(t){return 0<=t.Gb&&12>t.Gb?"AM":"PM"},"%S":function(t){return i(t.$b,2)},"%t":function(){return"\\t"},"%u":function(t){return t.Ab||7},"%U":function(t){return i(Math.floor((t.Bb+7-t.Ab)/7),2)},"%V":function(t){var e=Math.floor((t.Bb+7-(t.Ab+6)%7)/7);if(2>=(t.Ab+371-t.Bb-2)%7&&e++,e)53==e&&(4==(n=(t.Ab+371-t.Bb)%7)||3==n&&pt(t.Cb)||(e=1));else{e=52;var n=(t.Ab+7-t.Bb-1)%7;(4==n||5==n&&pt(t.Cb%400-1))&&e++}return i(e,2)},"%w":function(t){return t.Ab},"%W":function(t){return i(Math.floor((t.Bb+7-(t.Ab+6)%7)/7),2)},"%y":function(t){return(t.Cb+1900).toString().substring(2)},"%Y":function(t){return t.Cb+1900},"%z":function(t){var e=0<=(t=t.Yb);return t=Math.abs(t)/60,(e?"+":"-")+String("0000"+(t/60*100+t%60)).slice(-4)},"%Z":function(t){return t.ac},"%%":function(){return"%"}},n=n.replace(/%%/g,"\\0\\0"),s)n.includes(l)&&(n=n.replace(new RegExp(l,"g"),s[l](r)));return l=function(t){var e=Array(D(t)+1);return k(t,e,0,e.length),e}(n=n.replace(/\\0\\0/g,"%")),l.length>e?0:(S.set(l,t>>>0),l.length-1)}var bt={a:function(t){return gt(t+24)+24},m:function(t){return(t=new et(t)).Pb()||(t.Ib(!0),K--),t.Jb(!1),Q.push(t),t.Nb(),t.Qb()},ia:function(t){throw w("Unexpected exception thrown, this is not properly supported - aborting"),C=!0,t},w:function(){Ot(0);var t=Q.pop();if(t.Xb()&&!t.Lb()){var e=t.Wb();e&&at(e)(t.Db),nt(t.Db)}tt=0},d:function(){var t=tt;if(!t)return ft=0;var e=new et(t);e.Fb(t);var n=e.Eb();if(!n)return ft=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(Et(i,n,e.zb+16))return ft=i,t}return ft=n,t},k:function(){var t=tt;if(!t)return ft=0;var e=new et(t);e.Fb(t);var n=e.Eb();if(!n)return ft=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(Et(i,n,e.zb+16))return ft=i,t}return ft=n,t},g:function(){var t=tt;if(!t)return ft=0;var e=new et(t);e.Fb(t);var n=e.Eb();if(!n)return ft=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(Et(i,n,e.zb+16))return ft=i,t}return ft=n,t},s:nt,L:function(){var t=Q.pop();t||V("no exception to throw");var e=t.Db;throw t.Lb()||(Q.push(t),t.Jb(!0),t.Ib(!1),K++),tt=e,e},b:function(t,e,n){throw new et(t).Rb(e,n),tt=t,K++,t},la:function(){return K},i:function(t){throw tt||(tt=t),t},H:function(){return 0},Ba:function(){},pa:function(){},ra:function(){},ka:function(){return 0},za:function(){},ua:function(){},ya:function(){},R:function(){},qa:function(){},na:function(){},Aa:function(){},oa:function(){},Ha:function(){},Ja:function(){V("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},Ia:function(){V("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},S:function(){return Date.now()},Ca:function(){return!0},Da:function(t,e){t=new Date(1e3*(M[t>>>2]+4294967296*E[t+4>>>2])),E[e>>2>>>0]=t.getUTCSeconds(),E[e+4>>2>>>0]=t.getUTCMinutes(),E[e+8>>2>>>0]=t.getUTCHours(),E[e+12>>2>>>0]=t.getUTCDate(),E[e+16>>2>>>0]=t.getUTCMonth(),E[e+20>>2>>>0]=t.getUTCFullYear()-1900,E[e+24>>2>>>0]=t.getUTCDay(),E[e+28>>2>>>0]=(t.getTime()-Date.UTC(t.getUTCFullYear(),0,1,0,0,0,0))/864e5|0},Ea:function(t,e){t=new Date(1e3*(M[t>>>2]+4294967296*E[t+4>>>2])),E[e>>2>>>0]=t.getSeconds(),E[e+4>>2>>>0]=t.getMinutes(),E[e+8>>2>>>0]=t.getHours(),E[e+12>>2>>>0]=t.getDate(),E[e+16>>2>>>0]=t.getMonth(),E[e+20>>2>>>0]=t.getFullYear()-1900,E[e+24>>2>>>0]=t.getDay();var n=new Date(t.getFullYear(),0,1);E[e+28>>2>>>0]=(t.getTime()-n.getTime())/864e5|0,E[e+36>>2>>>0]=-60*t.getTimezoneOffset();var r=new Date(t.getFullYear(),6,1).getTimezoneOffset();n=n.getTimezoneOffset(),E[e+32>>2>>>0]=0|(r!=n&&t.getTimezoneOffset()==Math.min(n,r))},Fa:function(t){var e=new Date(E[t+20>>2>>>0]+1900,E[t+16>>2>>>0],E[t+12>>2>>>0],E[t+8>>2>>>0],E[t+4>>2>>>0],E[t>>2>>>0],0),n=E[t+32>>2>>>0],r=e.getTimezoneOffset(),a=new Date(e.getFullYear(),0,1),i=new Date(e.getFullYear(),6,1).getTimezoneOffset(),o=a.getTimezoneOffset(),u=Math.min(o,i);return 0>n?E[t+32>>2>>>0]=Number(i!=o&&u==r):0<n!=(u==r)&&(i=Math.max(o,i),e.setTime(e.getTime()+6e4*((0<n?u:i)-r))),E[t+24>>2>>>0]=e.getDay(),E[t+28>>2>>>0]=(e.getTime()-a.getTime())/864e5|0,E[t>>2>>>0]=e.getSeconds(),E[t+4>>2>>>0]=e.getMinutes(),E[t+8>>2>>>0]=e.getHours(),E[t+12>>2>>>0]=e.getDate(),E[t+16>>2>>>0]=e.getMonth(),e.getTime()/1e3|0},sa:function(){return-52},ta:function(){},Ga:function t(e,n,r){t.Vb||(t.Vb=!0,function(t,e,n){function r(t){return(t=t.toTimeString().match(/\\(([A-Za-z ]+)\\)$/))?t[1]:"GMT"}var a=(new Date).getFullYear(),i=new Date(a,0,1),o=new Date(a,6,1);a=i.getTimezoneOffset();var u=o.getTimezoneOffset();E[t>>2>>>0]=60*Math.max(a,u),E[e>>2>>>0]=Number(a!=u),t=r(i),e=r(o),t=it(t),e=it(e),u<a?(M[n>>2>>>0]=t,M[n+4>>2>>>0]=e):(M[n>>2>>>0]=e,M[n+4>>2>>>0]=t)}(e,n,r))},B:function(){V("")},ma:function(){return 4294901760},I:b?()=>{var t=process.hrtime();return 1e3*t[0]+t[1]/1e6}:()=>performance.now(),xa:function(t,e,n){T.copyWithin(t>>>0,e>>>0,e+n>>>0)},G:function(t){var e=T.length;if(4294901760<(t>>>=0))return!1;for(var n=1;4>=n;n*=2){var r=e*(1+.2/n);r=Math.min(r,t+100663296);var a=Math;r=Math.max(t,r),a=a.min.call(a,4294901760,r+(65536-r%65536)%65536);t:{try{O.grow(a-A.byteLength+65535>>>16),P();var i=1;break t}catch(t){}i=void 0}if(i)return!0}return!1},va:function(t,e){var n=0;return ut().forEach((function(r,a){var i=e+n;for(a=M[t+4*a>>2>>>0]=i,i=0;i<r.length;++i)S[a++>>0>>>0]=r.charCodeAt(i);S[a>>0>>>0]=0,n+=r.length+1})),0},wa:function(t,e){var n=ut();M[t>>2>>>0]=n.length;var r=0;return n.forEach((function(t){r+=t.length+1})),M[e>>2>>>0]=r,0},ba:function(t){_||0<L||(_t(),Z(W),wt(0),st[1].length&&lt(1,10),st[2].length&&lt(2,10)),_||0<L||(e.onExit&&e.onExit(t),C=!0),h(t,new J(t))},E:function(){return 52},Q:function(){return 52},ca:function(){return 70},P:function(t,e,n,r){for(var a=0,i=0;i<n;i++){var o=M[e>>2>>>0],u=M[e+4>>2>>>0];e+=8;for(var c=0;c<u;c++)lt(t,T[o+c>>>0]);a+=u}return M[r>>2>>>0]=a,0},c:function(){return ft},ja:function t(e,r){t.Mb||(t.Mb=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var t=new Uint8Array(1);return()=>(crypto.getRandomValues(t),t[0])}if(b)try{var e=n(Object(function(){var t=new Error("Cannot find module \'crypto\'");throw t.code="MODULE_NOT_FOUND",t}()));return()=>e.randomBytes(1)[0]}catch(t){}return()=>V("randomDevice")}());for(var a=0;a<r;a++)S[e+a>>0>>>0]=t.Mb();return 0},ea:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},fa:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},J:function(t){var e=At();try{return at(t)()}catch(t){if(St(e),t!==t+0)throw t;Ot(1,0)}},e:function(t,e){var n=At();try{return at(t)(e)}catch(t){if(St(n),t!==t+0)throw t;Ot(1,0)}},N:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},O:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},j:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},o:function(t,e,n,r){var a=At();try{return at(t)(e,n,r)}catch(t){if(St(a),t!==t+0)throw t;Ot(1,0)}},p:function(t,e,n,r,a){var i=At();try{return at(t)(e,n,r,a)}catch(t){if(St(i),t!==t+0)throw t;Ot(1,0)}},M:function(t,e,n,r,a,i){var o=At();try{return at(t)(e,n,r,a,i)}catch(t){if(St(o),t!==t+0)throw t;Ot(1,0)}},r:function(t,e,n,r,a,i){var o=At();try{return at(t)(e,n,r,a,i)}catch(t){if(St(o),t!==t+0)throw t;Ot(1,0)}},v:function(t,e,n,r,a,i,o){var u=At();try{return at(t)(e,n,r,a,i,o)}catch(t){if(St(u),t!==t+0)throw t;Ot(1,0)}},K:function(t,e,n,r,a,i,o,u){var c=At();try{return at(t)(e,n,r,a,i,o,u)}catch(t){if(St(c),t!==t+0)throw t;Ot(1,0)}},D:function(t,e,n,r,a,i,o,u,c,s,l,f){var p=At();try{return at(t)(e,n,r,a,i,o,u,c,s,l,f)}catch(t){if(St(p),t!==t+0)throw t;Ot(1,0)}},X:function(t,e,n,r,a,i,o,u){var c=At();try{return Ft(t,e,n,r,a,i,o,u)}catch(t){if(St(c),t!==t+0)throw t;Ot(1,0)}},V:function(t,e,n,r,a,i,o){var u=At();try{return xt(t,e,n,r,a,i,o)}catch(t){if(St(u),t!==t+0)throw t;Ot(1,0)}},U:function(t,e,n,r,a){var i=At();try{return It(t,e,n,r,a)}catch(t){if(St(i),t!==t+0)throw t;Ot(1,0)}},Z:function(t,e,n,r){var a=At();try{return Pt(t,e,n,r)}catch(t){if(St(a),t!==t+0)throw t;Ot(1,0)}},W:function(t){var e=At();try{return Ct(t)}catch(t){if(St(e),t!==t+0)throw t;Ot(1,0)}},Y:function(t,e){var n=At();try{return Ut(t,e)}catch(t){if(St(n),t!==t+0)throw t;Ot(1,0)}},T:function(t,e,n){var r=At();try{return Rt(t,e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},f:function(t){var e=At();try{at(t)()}catch(t){if(St(e),t!==t+0)throw t;Ot(1,0)}},q:function(t,e){var n=At();try{at(t)(e)}catch(t){if(St(n),t!==t+0)throw t;Ot(1,0)}},h:function(t,e,n){var r=At();try{at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},da:function(t,e,n,r){var a=At();try{at(t)(e,n,r)}catch(t){if(St(a),t!==t+0)throw t;Ot(1,0)}},l:function(t,e,n,r){var a=At();try{at(t)(e,n,r)}catch(t){if(St(a),t!==t+0)throw t;Ot(1,0)}},t:function(t,e,n,r,a){var i=At();try{at(t)(e,n,r,a)}catch(t){if(St(i),t!==t+0)throw t;Ot(1,0)}},u:function(t,e,n,r,a,i){var o=At();try{at(t)(e,n,r,a,i)}catch(t){if(St(o),t!==t+0)throw t;Ot(1,0)}},x:function(t,e,n,r,a,i,o){var u=At();try{at(t)(e,n,r,a,i,o)}catch(t){if(St(u),t!==t+0)throw t;Ot(1,0)}},z:function(t,e,n,r,a,i,o,u){var c=At();try{at(t)(e,n,r,a,i,o,u)}catch(t){if(St(c),t!==t+0)throw t;Ot(1,0)}},ga:function(t,e,n,r,a,i,o,u,c){var s=At();try{at(t)(e,n,r,a,i,o,u,c)}catch(t){if(St(s),t!==t+0)throw t;Ot(1,0)}},A:function(t,e,n,r,a,i,o,u,c,s,l){var f=At();try{at(t)(e,n,r,a,i,o,u,c,s,l)}catch(t){if(St(f),t!==t+0)throw t;Ot(1,0)}},C:function(t,e,n,r,a,i,o,u,c,s,l,f,p,h,d,y){var b=At();try{at(t)(e,n,r,a,i,o,u,c,s,l,f,p,h,d,y)}catch(t){if(St(b),t!==t+0)throw t;Ot(1,0)}},aa:function(t,e,n,r,a,i,o,u){var c=At();try{jt(t,e,n,r,a,i,o,u)}catch(t){if(St(c),t!==t+0)throw t;Ot(1,0)}},_:function(t,e,n,r,a,i,o,u,c,s,l,f){var p=At();try{Dt(t,e,n,r,a,i,o,u,c,s,l,f)}catch(t){if(St(p),t!==t+0)throw t;Ot(1,0)}},$:function(t,e,n,r,a,i){var o=At();try{kt(t,e,n,r,a,i)}catch(t){if(St(o),t!==t+0)throw t;Ot(1,0)}},n:function(t){return t},F:function(t){ft=t},ha:yt,y:function(t,e,n,r){return yt(t,e,n,r)}};!function(){function t(t){e.asm=t.exports,O=e.asm.Ka,P(),U=e.asm.ib,I.unshift(e.asm.La),B--,e.monitorRunDependencies&&e.monitorRunDependencies(B),0==B&&(null!==G&&(clearInterval(G),G=null),N&&(t=N,N=null,t()))}function n(e){t(e.instance)}function r(t){return function(){if(!g&&(d||y)){if("function"==typeof fetch&&!Y.startsWith("file://"))return fetch(Y,{credentials:"same-origin"}).then((function(t){if(!t.ok)throw"failed to load wasm binary file at \'"+Y+"\'";return t.arrayBuffer()})).catch((function(){return X()}));if(o)return new Promise((function(t,e){o(Y,(function(e){t(new Uint8Array(e))}),e)}))}return Promise.resolve().then((function(){return X()}))}().then((function(t){return WebAssembly.instantiate(t,i)})).then((function(t){return t})).then(t,(function(t){w("failed to asynchronously prepare wasm: "+t),V(t)}))}var i={a:bt};if(B++,e.monitorRunDependencies&&e.monitorRunDependencies(B),e.instantiateWasm)try{return e.instantiateWasm(i,t)}catch(t){return w("Module.instantiateWasm callback failed with error: "+t),!1}(g||"function"!=typeof WebAssembly.instantiateStreaming||$()||Y.startsWith("file://")||b||"function"!=typeof fetch?r(n):fetch(Y,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,i).then(n,(function(t){return w("wasm streaming compile failed: "+t),w("falling back to ArrayBuffer instantiation"),r(n)}))}))).catch(a)}(),e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.La).apply(null,arguments)},e._OrtInit=function(){return(e._OrtInit=e.asm.Ma).apply(null,arguments)},e._OrtCreateSessionOptions=function(){return(e._OrtCreateSessionOptions=e.asm.Na).apply(null,arguments)},e._OrtAppendExecutionProvider=function(){return(e._OrtAppendExecutionProvider=e.asm.Oa).apply(null,arguments)},e._OrtAddSessionConfigEntry=function(){return(e._OrtAddSessionConfigEntry=e.asm.Pa).apply(null,arguments)},e._OrtReleaseSessionOptions=function(){return(e._OrtReleaseSessionOptions=e.asm.Qa).apply(null,arguments)},e._OrtCreateSession=function(){return(e._OrtCreateSession=e.asm.Ra).apply(null,arguments)},e._OrtReleaseSession=function(){return(e._OrtReleaseSession=e.asm.Sa).apply(null,arguments)},e._OrtGetInputCount=function(){return(e._OrtGetInputCount=e.asm.Ta).apply(null,arguments)},e._OrtGetOutputCount=function(){return(e._OrtGetOutputCount=e.asm.Ua).apply(null,arguments)},e._OrtGetInputName=function(){return(e._OrtGetInputName=e.asm.Va).apply(null,arguments)},e._OrtGetOutputName=function(){return(e._OrtGetOutputName=e.asm.Wa).apply(null,arguments)},e._OrtFree=function(){return(e._OrtFree=e.asm.Xa).apply(null,arguments)},e._OrtCreateTensor=function(){return(e._OrtCreateTensor=e.asm.Ya).apply(null,arguments)},e._OrtGetTensorData=function(){return(e._OrtGetTensorData=e.asm.Za).apply(null,arguments)},e._OrtReleaseTensor=function(){return(e._OrtReleaseTensor=e.asm._a).apply(null,arguments)},e._OrtCreateRunOptions=function(){return(e._OrtCreateRunOptions=e.asm.$a).apply(null,arguments)},e._OrtAddRunConfigEntry=function(){return(e._OrtAddRunConfigEntry=e.asm.ab).apply(null,arguments)},e._OrtReleaseRunOptions=function(){return(e._OrtReleaseRunOptions=e.asm.bb).apply(null,arguments)},e._OrtRun=function(){return(e._OrtRun=e.asm.cb).apply(null,arguments)},e._OrtEndProfiling=function(){return(e._OrtEndProfiling=e.asm.db).apply(null,arguments)};var mt,gt=e._malloc=function(){return(gt=e._malloc=e.asm.eb).apply(null,arguments)},vt=e._free=function(){return(vt=e._free=e.asm.fb).apply(null,arguments)},wt=e._fflush=function(){return(wt=e._fflush=e.asm.gb).apply(null,arguments)},_t=e.___funcs_on_exit=function(){return(_t=e.___funcs_on_exit=e.asm.hb).apply(null,arguments)},Ot=e._setThrew=function(){return(Ot=e._setThrew=e.asm.jb).apply(null,arguments)},At=e.stackSave=function(){return(At=e.stackSave=e.asm.kb).apply(null,arguments)},St=e.stackRestore=function(){return(St=e.stackRestore=e.asm.lb).apply(null,arguments)},Tt=e.stackAlloc=function(){return(Tt=e.stackAlloc=e.asm.mb).apply(null,arguments)},Et=e.___cxa_can_catch=function(){return(Et=e.___cxa_can_catch=e.asm.nb).apply(null,arguments)},Mt=e.___cxa_is_pointer_type=function(){return(Mt=e.___cxa_is_pointer_type=e.asm.ob).apply(null,arguments)},Ct=e.dynCall_j=function(){return(Ct=e.dynCall_j=e.asm.pb).apply(null,arguments)},xt=e.dynCall_iiiiij=function(){return(xt=e.dynCall_iiiiij=e.asm.qb).apply(null,arguments)},Rt=e.dynCall_jii=function(){return(Rt=e.dynCall_jii=e.asm.rb).apply(null,arguments)},jt=e.dynCall_viiiiij=function(){return(jt=e.dynCall_viiiiij=e.asm.sb).apply(null,arguments)},kt=e.dynCall_vjji=function(){return(kt=e.dynCall_vjji=e.asm.tb).apply(null,arguments)},Dt=e.dynCall_viiijjjii=function(){return(Dt=e.dynCall_viiijjjii=e.asm.ub).apply(null,arguments)},Pt=e.dynCall_iij=function(){return(Pt=e.dynCall_iij=e.asm.vb).apply(null,arguments)},Ut=e.dynCall_ji=function(){return(Ut=e.dynCall_ji=e.asm.wb).apply(null,arguments)},Ft=e.dynCall_iiiiiij=function(){return(Ft=e.dynCall_iiiiiij=e.asm.xb).apply(null,arguments)},It=e.dynCall_iiij=function(){return(It=e.dynCall_iiij=e.asm.yb).apply(null,arguments)};function Wt(){function t(){if(!mt&&(mt=!0,e.calledRun=!0,!C)){if(Z(I),r(e),e.onRuntimeInitialized&&e.onRuntimeInitialized(),e.postRun)for("function"==typeof e.postRun&&(e.postRun=[e.postRun]);e.postRun.length;){var t=e.postRun.shift();H.unshift(t)}Z(H)}}if(!(0<B)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)z();Z(F),0<B||(e.setStatus?(e.setStatus("Running..."),setTimeout((function(){setTimeout((function(){e.setStatus("")}),1),t()}),1)):t())}}if(e.UTF8ToString=j,e.stringToUTF8=function(t,e,n){return k(t,T,e,n)},e.lengthBytesUTF8=D,e.stackSave=At,e.stackRestore=St,e.stackAlloc=Tt,N=function t(){mt||Wt(),mt||(N=t)},e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();return Wt(),t.ready});t.exports=r},967:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.iterateExtraOptions=void 0,e.iterateExtraOptions=(t,n,r,a)=>{if("object"==typeof t&&null!==t){if(r.has(t))throw new Error("Circular reference in options");r.add(t)}Object.entries(t).forEach((([t,i])=>{const o=n?n+t:t;if("object"==typeof i)(0,e.iterateExtraOptions)(i,o+".",r,a);else if("string"==typeof i||"number"==typeof i)a(o,i.toString());else{if("boolean"!=typeof i)throw new Error("Can\'t handle extra config type: "+typeof i);a(o,i?"1":"0")}}))}},586:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.setRunOptions=void 0;const r=n(967),a=n(983),i=n(361);e.setRunOptions=t=>{const e=(0,i.getInstance)();let n=0;const o=[],u=t||{};try{if(void 0===(null==t?void 0:t.logSeverityLevel))u.logSeverityLevel=2;else if("number"!=typeof t.logSeverityLevel||!Number.isInteger(t.logSeverityLevel)||t.logSeverityLevel<0||t.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${t.logSeverityLevel}`);if(void 0===(null==t?void 0:t.logVerbosityLevel))u.logVerbosityLevel=0;else if("number"!=typeof t.logVerbosityLevel||!Number.isInteger(t.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${t.logVerbosityLevel}`);void 0===(null==t?void 0:t.terminate)&&(u.terminate=!1);let i=0;if(void 0!==(null==t?void 0:t.tag)&&(i=(0,a.allocWasmString)(t.tag,o)),n=e._OrtCreateRunOptions(u.logSeverityLevel,u.logVerbosityLevel,!!u.terminate,i),0===n)throw new Error("Can\'t create run options");return void 0!==(null==t?void 0:t.extra)&&(0,r.iterateExtraOptions)(t.extra,"",new WeakSet,((t,r)=>{const i=(0,a.allocWasmString)(t,o),u=(0,a.allocWasmString)(r,o);if(0!==e._OrtAddRunConfigEntry(n,i,u))throw new Error(`Can\'t set a run config entry: ${t} - ${r}`)})),[n,o]}catch(t){throw 0!==n&&e._OrtReleaseRunOptions(n),o.forEach(e._free),t}}},919:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.setSessionOptions=void 0;const r=n(967),a=n(983),i=n(361);e.setSessionOptions=t=>{const e=(0,i.getInstance)();let n=0;const o=[],u=t||{};(t=>{t.extra||(t.extra={}),t.extra.session||(t.extra.session={});const e=t.extra.session;e.use_ort_model_bytes_directly||(e.use_ort_model_bytes_directly="1")})(u);try{void 0===(null==t?void 0:t.graphOptimizationLevel)&&(u.graphOptimizationLevel="all");const c=(t=>{switch(t){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${t}`)}})(u.graphOptimizationLevel);void 0===(null==t?void 0:t.enableCpuMemArena)&&(u.enableCpuMemArena=!0),void 0===(null==t?void 0:t.enableMemPattern)&&(u.enableMemPattern=!0),void 0===(null==t?void 0:t.executionMode)&&(u.executionMode="sequential");const s=(t=>{switch(t){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${t}`)}})(u.executionMode);let l=0;if(void 0!==(null==t?void 0:t.logId)&&(l=(0,a.allocWasmString)(t.logId,o)),void 0===(null==t?void 0:t.logSeverityLevel))u.logSeverityLevel=2;else if("number"!=typeof t.logSeverityLevel||!Number.isInteger(t.logSeverityLevel)||t.logSeverityLevel<0||t.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${t.logSeverityLevel}`);if(void 0===(null==t?void 0:t.logVerbosityLevel))u.logVerbosityLevel=0;else if("number"!=typeof t.logVerbosityLevel||!Number.isInteger(t.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${t.logVerbosityLevel}`);if(void 0===(null==t?void 0:t.enableProfiling)&&(u.enableProfiling=!1),n=e._OrtCreateSessionOptions(c,!!u.enableCpuMemArena,!!u.enableMemPattern,s,!!u.enableProfiling,0,l,u.logSeverityLevel,u.logVerbosityLevel),0===n)throw new Error("Can\'t create session options");return(null==t?void 0:t.executionProviders)&&((t,e,n)=>{for(const r of e){let e="string"==typeof r?r:r.name;switch(e){case"xnnpack":e="XNNPACK";break;case"wasm":case"cpu":continue;default:throw new Error(`not supported EP: ${e}`)}const o=(0,a.allocWasmString)(e,n);if(0!==(0,i.getInstance)()._OrtAppendExecutionProvider(t,o))throw new Error(`Can\'t append execution provider: ${e}`)}})(n,t.executionProviders,o),void 0!==(null==t?void 0:t.extra)&&(0,r.iterateExtraOptions)(t.extra,"",new WeakSet,((t,r)=>{const i=(0,a.allocWasmString)(t,o),u=(0,a.allocWasmString)(r,o);if(0!==e._OrtAddSessionConfigEntry(n,i,u))throw new Error(`Can\'t set a session config entry: ${t} - ${r}`)})),[n,o]}catch(t){throw 0!==n&&e._OrtReleaseSessionOptions(n),o.forEach(e._free),t}}},983:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.allocWasmString=void 0;const r=n(361);e.allocWasmString=(t,e)=>{const n=(0,r.getInstance)(),a=n.lengthBytesUTF8(t)+1,i=n._malloc(a);return n.stringToUTF8(t,i,a),e.push(i),i}},349:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.extractTransferableBuffers=e.endProfiling=e.run=e.releaseSession=e.createSession=e.createSessionFinalize=e.createSessionAllocate=e.initOrt=void 0;const r=n(586),a=n(919),i=n(983),o=n(361);e.initOrt=(t,e)=>{const n=(0,o.getInstance)()._OrtInit(t,e);if(0!==n)throw new Error(`Can\'t initialize onnxruntime. error code = ${n}`)};const u=new Map;e.createSessionAllocate=t=>{const e=(0,o.getInstance)(),n=e._malloc(t.byteLength);return e.HEAPU8.set(t,n),[n,t.byteLength]},e.createSessionFinalize=(t,e)=>{const n=(0,o.getInstance)();let r=0,i=0,c=[];try{if([i,c]=(0,a.setSessionOptions)(e),r=n._OrtCreateSession(t[0],t[1],i),0===r)throw new Error("Can\'t create a session")}finally{n._free(t[0]),n._OrtReleaseSessionOptions(i),c.forEach(n._free)}const s=n._OrtGetInputCount(r),l=n._OrtGetOutputCount(r),f=[],p=[],h=[],d=[];for(let t=0;t<s;t++){const e=n._OrtGetInputName(r,t);if(0===e)throw new Error("Can\'t get an input name");p.push(e),f.push(n.UTF8ToString(e))}for(let t=0;t<l;t++){const e=n._OrtGetOutputName(r,t);if(0===e)throw new Error("Can\'t get an output name");d.push(e),h.push(n.UTF8ToString(e))}return u.set(r,[r,p,d]),[r,f,h]},e.createSession=(t,n)=>{const r=(0,e.createSessionAllocate)(t);return(0,e.createSessionFinalize)(r,n)},e.releaseSession=t=>{const e=(0,o.getInstance)(),n=u.get(t);if(!n)throw new Error("invalid session id");const r=n[0],a=n[1],i=n[2];a.forEach(e._OrtFree),i.forEach(e._OrtFree),e._OrtReleaseSession(r),u.delete(t)};const c=t=>{switch(t){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;default:throw new Error(`unsupported data type: ${t}`)}},s=t=>{switch(t){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";default:throw new Error(`unsupported data type: ${t}`)}},l=t=>{switch(t){case"float32":return Float32Array;case"uint8":case"bool":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${t}`)}};e.run=(t,e,n,a,f)=>{const p=(0,o.getInstance)(),h=u.get(t);if(!h)throw new Error("invalid session id");const d=h[0],y=h[1],b=h[2],m=e.length,g=a.length;let v=0,w=[];const _=[],O=[];try{[v,w]=(0,r.setRunOptions)(f);for(let t=0;t<m;t++){const e=n[t][0],r=n[t][1],a=n[t][2];let o,u;if(Array.isArray(a)){u=4*a.length,o=p._malloc(u),O.push(o);let t=o/4;for(let e=0;e<a.length;e++){if("string"!=typeof a[e])throw new TypeError(`tensor data at index ${e} is not a string`);p.HEAPU32[t++]=(0,i.allocWasmString)(a[e],O)}}else u=a.byteLength,o=p._malloc(u),O.push(o),p.HEAPU8.set(new Uint8Array(a.buffer,a.byteOffset,u),o);const s=p.stackSave(),l=p.stackAlloc(4*r.length);try{let t=l/4;r.forEach((e=>p.HEAP32[t++]=e));const n=p._OrtCreateTensor(c(e),o,u,l,r.length);if(0===n)throw new Error("Can\'t create a tensor");_.push(n)}finally{p.stackRestore(s)}}const t=p.stackSave(),o=p.stackAlloc(4*m),u=p.stackAlloc(4*m),h=p.stackAlloc(4*g),A=p.stackAlloc(4*g);try{let n=o/4,r=u/4,i=h/4,c=A/4;for(let t=0;t<m;t++)p.HEAPU32[n++]=_[t],p.HEAPU32[r++]=y[e[t]];for(let t=0;t<g;t++)p.HEAPU32[i++]=0,p.HEAPU32[c++]=b[a[t]];let f=p._OrtRun(d,u,o,m,A,g,h,v);const w=[];if(0===f)for(let t=0;t<g;t++){const e=p.HEAPU32[h/4+t],n=p.stackSave(),r=p.stackAlloc(16);let a,i=0;try{if(f=p._OrtGetTensorData(e,r,r+4,r+8,r+12),0!==f)throw new Error(`Can\'t access output tensor data. error code = ${f}`);let t=r/4;const o=p.HEAPU32[t++];i=p.HEAPU32[t++];const u=p.HEAPU32[t++],c=p.HEAPU32[t++],h=[];for(let t=0;t<c;t++)h.push(p.HEAPU32[u/4+t]);p._OrtFree(u);const d=0===h.length?1:h.reduce(((t,e)=>t*e));if(a=s(o),"string"===a){const t=[];let e=i/4;for(let n=0;n<d;n++){const r=p.HEAPU32[e++],a=n===d-1?void 0:p.HEAPU32[e]-r;t.push(p.UTF8ToString(r,a))}w.push([a,h,t])}else{const t=new(l(a))(d);new Uint8Array(t.buffer,t.byteOffset,t.byteLength).set(p.HEAPU8.subarray(i,i+t.byteLength)),w.push([a,h,t])}}finally{p.stackRestore(n),"string"===a&&i&&p._free(i),p._OrtReleaseTensor(e)}}if(0===f)return w;throw new Error(`failed to call OrtRun(). error code = ${f}.`)}finally{p.stackRestore(t)}}finally{_.forEach(p._OrtReleaseTensor),O.forEach(p._free),p._OrtReleaseRunOptions(v),w.forEach(p._free)}},e.endProfiling=t=>{const e=(0,o.getInstance)(),n=u.get(t);if(!n)throw new Error("invalid session id");const r=n[0],a=e._OrtEndProfiling(r);if(0===a)throw new Error("Can\'t get an profile file name");e._OrtFree(a)},e.extractTransferableBuffers=t=>{const e=[];for(const n of t){const t=n[2];!Array.isArray(t)&&t.buffer&&e.push(t.buffer)}return e}},361:function(t,e,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(t,e,n,r){void 0===r&&(r=n);var a=Object.getOwnPropertyDescriptor(e,n);a&&!("get"in a?!e.__esModule:a.writable||a.configurable)||(a={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(t,r,a)}:function(t,e,n,r){void 0===r&&(r=n),t[r]=e[n]}),a=this&&this.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),i=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)"default"!==n&&Object.prototype.hasOwnProperty.call(t,n)&&r(e,t,n);return a(e,t),e},o=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.dispose=e.getInstance=e.initializeWebAssembly=void 0;const u=i(n(449)),c=o(n(932)),s=n(474);let l,f=!1,p=!1,h=!1;const d=(t,e)=>e?t?"ort-wasm-simd-threaded.wasm":"ort-wasm-threaded.wasm":t?"ort-wasm-simd.wasm":"ort-wasm.wasm";e.initializeWebAssembly=async t=>{if(f)return Promise.resolve();if(p)throw new Error("multiple calls to \'initializeWebAssembly()\' detected.");if(h)throw new Error("previous call to \'initializeWebAssembly()\' failed.");p=!0;const e=t.initTimeout,r=t.numThreads,a=t.simd,i=r>1&&(()=>{try{return"undefined"!=typeof SharedArrayBuffer&&("undefined"!=typeof MessageChannel&&(new MessageChannel).port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11])))}catch(t){return!1}})(),o=a&&(()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch(t){return!1}})(),y="string"==typeof t.wasmPaths?t.wasmPaths:void 0,b=d(!1,i),m=d(o,i),g="object"==typeof t.wasmPaths?t.wasmPaths[m]:void 0;let v=!1;const w=[];if(e>0&&w.push(new Promise((t=>{setTimeout((()=>{v=!0,t()}),e)}))),w.push(new Promise(((t,e)=>{const r=i?s:c.default,a={locateFile:(t,e)=>i&&t.endsWith(".worker.js")&&"undefined"!=typeof Blob?URL.createObjectURL(new Blob([n(154)],{type:"text/javascript"})):t===b?null!=g?g:(null!=y?y:e)+m:e+t};if(i)if("undefined"==typeof Blob)a.mainScriptUrlOrBlob=u.join("/","ort-wasm-threaded.js");else{const t=`var ortWasmThreaded=(function(){var _scriptDir;return ${r.toString()}})();`;a.mainScriptUrlOrBlob=new Blob([t],{type:"text/javascript"})}r(a).then((e=>{p=!1,f=!0,l=e,t()}),(t=>{p=!1,h=!0,e(t)}))}))),await Promise.race(w),v)throw new Error(`WebAssembly backend initializing failed due to timeout: ${e}ms`)},e.getInstance=()=>{if(f&&l)return l;throw new Error("WebAssembly is not initialized yet.")},e.dispose=()=>{var t;!f||p||h||(p=!0,null===(t=l.PThread)||void 0===t||t.terminateAllThreads(),l=void 0,p=!1,f=!1,h=!0)}},154:t=>{"use strict";t.exports=\'"use strict";var e={},t="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node;if(t){var r=require("worker_threads"),a=r.parentPort;a.on("message",(e=>onmessage({data:e})));var o=require("fs");Object.assign(global,{self:global,require:require,Module:e,location:{href:__filename},Worker:r.Worker,importScripts:function(e){(0,eval)(o.readFileSync(e,"utf8"))},postMessage:function(e){a.postMessage(e)},performance:global.performance||{now:function(){return Date.now()}}})}var s=!1,n=[],i=function(){var e=Array.prototype.slice.call(arguments).join(" ");t?o.writeSync(2,e+"\\\\n"):console.error(e)};self.alert=function(){var t=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:t,threadId:e._pthread_self()})},e.instantiateWasm=(t,r)=>{var a=new WebAssembly.Instance(e.wasmModule,t);return r(a),e.wasmModule=null,a.exports},self.onunhandledrejection=e=>{throw e.reason??e},self.onmessage=t=>{try{if("load"===t.data.cmd){if(e.wasmModule=t.data.wasmModule,e.wasmMemory=t.data.wasmMemory,e.buffer=e.wasmMemory.buffer,e.ENVIRONMENT_IS_PTHREAD=!0,"string"==typeof t.data.urlOrBlob)importScripts(t.data.urlOrBlob);else{var r=URL.createObjectURL(t.data.urlOrBlob);importScripts(r),URL.revokeObjectURL(r)}ortWasmThreaded(e).then((function(t){e=t}))}else if("run"===t.data.cmd){e.__performance_now_clock_drift=performance.now()-t.data.time,e.__emscripten_thread_init(t.data.pthread_ptr,0,0,1),e.establishStackSpace(),e.PThread.receiveObjectTransfer(t.data),e.PThread.threadInitTLS(),s||(n.forEach((t=>{e.executeNotifiedProxyingQueue(t)})),n=[],s=!0);try{e.invokeEntryPoint(t.data.start_routine,t.data.arg)}catch(t){if("unwind"!=t){if(!(t instanceof e.ExitStatus))throw t;e.keepRuntimeAlive()||e.__emscripten_thread_exit(t.status)}}}else"cancel"===t.data.cmd?e._pthread_self()&&e.__emscripten_thread_exit(-1):"setimmediate"===t.data.target||("processProxyingQueue"===t.data.cmd?s?e.executeNotifiedProxyingQueue(t.data.queue):n.push(t.data.queue):(i("worker.js received unknown command "+t.data.cmd),i(t.data)))}catch(t){throw i("worker.js onmessage() captured an uncaught exception: "+t),t&&t.stack&&i(t.stack),e.__emscripten_thread_crashed&&e.__emscripten_thread_crashed(),t}};\\n\'},384:()=>{},993:()=>{},908:()=>{},953:()=>{},925:()=>{},449:()=>{}},e={};function n(r){var a=e[r];if(void 0!==a)return a.exports;var i=e[r]={exports:{}};return t[r].call(i.exports,i,i.exports,n),i.exports}n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),(()=>{"use strict";const t=n(349),e=n(361);self.onmessage=n=>{switch(n.data.type){case"init-wasm":(0,e.initializeWebAssembly)(n.data.in).then((()=>postMessage({type:"init-wasm"})),(t=>postMessage({type:"init-wasm",err:t})));break;case"init-ort":try{const{numThreads:e,loggingLevel:r}=n.data.in;(0,t.initOrt)(e,r),postMessage({type:"init-ort"})}catch(t){postMessage({type:"init-ort",err:t})}break;case"create_allocate":try{const{model:e}=n.data.in,r=(0,t.createSessionAllocate)(e);postMessage({type:"create_allocate",out:r})}catch(t){postMessage({type:"create_allocate",err:t})}break;case"create_finalize":try{const{modeldata:e,options:r}=n.data.in,a=(0,t.createSessionFinalize)(e,r);postMessage({type:"create_finalize",out:a})}catch(t){postMessage({type:"create_finalize",err:t})}break;case"create":try{const{model:e,options:r}=n.data.in,a=(0,t.createSession)(e,r);postMessage({type:"create",out:a})}catch(t){postMessage({type:"create",err:t})}break;case"release":try{const e=n.data.in;(0,t.releaseSession)(e),postMessage({type:"release"})}catch(t){postMessage({type:"release",err:t})}break;case"run":try{const{sessionId:e,inputIndices:r,inputs:a,outputIndices:i,options:o}=n.data.in,u=(0,t.run)(e,r,a,i,o);postMessage({type:"run",out:u},(0,t.extractTransferableBuffers)(u))}catch(t){postMessage({type:"run",err:t})}break;case"end-profiling":try{const e=n.data.in;(0,t.endProfiling)(e),postMessage({type:"end-profiling"})}catch(t){postMessage({type:"end-profiling",err:t})}}}})()})();\n', "Worker", void 0, void 0);
        }
      }, 477: (C) => {
        C.exports = function(u, b, h, p) {
          var g = self || window;
          try {
            try {
              var o;
              try {
                o = new g.Blob([u]);
              } catch {
                (o = new (g.BlobBuilder || g.WebKitBlobBuilder || g.MozBlobBuilder || g.MSBlobBuilder)()).append(u), o = o.getBlob();
              }
              var c = g.URL || g.webkitURL, f = c.createObjectURL(o), a = new g[b](f, h);
              return c.revokeObjectURL(f), a;
            } catch {
              return new g[b]("data:application/javascript,".concat(encodeURIComponent(u)), h);
            }
          } catch {
            if (!p) throw Error("Inline worker is not supported");
            return new g[b](p, h);
          }
        };
      }, 4154: (C) => {
        C.exports = `"use strict";var e={},t="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node;if(t){var r=require("worker_threads"),a=r.parentPort;a.on("message",(e=>onmessage({data:e})));var o=require("fs");Object.assign(global,{self:global,require:require,Module:e,location:{href:__filename},Worker:r.Worker,importScripts:function(e){(0,eval)(o.readFileSync(e,"utf8"))},postMessage:function(e){a.postMessage(e)},performance:global.performance||{now:function(){return Date.now()}}})}var s=!1,n=[],i=function(){var e=Array.prototype.slice.call(arguments).join(" ");t?o.writeSync(2,e+"\\n"):console.error(e)};self.alert=function(){var t=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:t,threadId:e._pthread_self()})},e.instantiateWasm=(t,r)=>{var a=new WebAssembly.Instance(e.wasmModule,t);return r(a),e.wasmModule=null,a.exports},self.onunhandledrejection=e=>{throw e.reason??e},self.onmessage=t=>{try{if("load"===t.data.cmd){if(e.wasmModule=t.data.wasmModule,e.wasmMemory=t.data.wasmMemory,e.buffer=e.wasmMemory.buffer,e.ENVIRONMENT_IS_PTHREAD=!0,"string"==typeof t.data.urlOrBlob)importScripts(t.data.urlOrBlob);else{var r=URL.createObjectURL(t.data.urlOrBlob);importScripts(r),URL.revokeObjectURL(r)}ortWasmThreaded(e).then((function(t){e=t}))}else if("run"===t.data.cmd){e.__performance_now_clock_drift=performance.now()-t.data.time,e.__emscripten_thread_init(t.data.pthread_ptr,0,0,1),e.establishStackSpace(),e.PThread.receiveObjectTransfer(t.data),e.PThread.threadInitTLS(),s||(n.forEach((t=>{e.executeNotifiedProxyingQueue(t)})),n=[],s=!0);try{e.invokeEntryPoint(t.data.start_routine,t.data.arg)}catch(t){if("unwind"!=t){if(!(t instanceof e.ExitStatus))throw t;e.keepRuntimeAlive()||e.__emscripten_thread_exit(t.status)}}}else"cancel"===t.data.cmd?e._pthread_self()&&e.__emscripten_thread_exit(-1):"setimmediate"===t.data.target||("processProxyingQueue"===t.data.cmd?s?e.executeNotifiedProxyingQueue(t.data.queue):n.push(t.data.queue):(i("worker.js received unknown command "+t.data.cmd),i(t.data)))}catch(t){throw i("worker.js onmessage() captured an uncaught exception: "+t),t&&t.stack&&i(t.stack),e.__emscripten_thread_crashed&&e.__emscripten_thread_crashed(),t}};
`;
      }, 1670: (C) => {
        C.exports = __WEBPACK_EXTERNAL_MODULE__1670__;
      }, 7067: () => {
      }, 1296: () => {
      }, 1384: () => {
      }, 3993: () => {
      }, 908: () => {
      }, 6953: () => {
      }, 9925: () => {
      }, 2806: () => {
      }, 6449: () => {
      }, 2850: () => {
      }, 5381: () => {
      }, 5686: (C, u, b) => {
        b.r(u), b.d(u, { flatbuffers: () => h });
        var h = {};
        h.Offset, h.Table, h.SIZEOF_SHORT = 2, h.SIZEOF_INT = 4, h.FILE_IDENTIFIER_LENGTH = 4, h.SIZE_PREFIX_LENGTH = 4, h.Encoding = { UTF8_BYTES: 1, UTF16_STRING: 2 }, h.int32 = new Int32Array(2), h.float32 = new Float32Array(h.int32.buffer), h.float64 = new Float64Array(h.int32.buffer), h.isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1, h.Long = function(p, g) {
          this.low = 0 | p, this.high = 0 | g;
        }, h.Long.create = function(p, g) {
          return p == 0 && g == 0 ? h.Long.ZERO : new h.Long(p, g);
        }, h.Long.prototype.toFloat64 = function() {
          return (this.low >>> 0) + 4294967296 * this.high;
        }, h.Long.prototype.equals = function(p) {
          return this.low == p.low && this.high == p.high;
        }, h.Long.ZERO = new h.Long(0, 0), h.Builder = function(p) {
          if (p) g = p;
          else var g = 1024;
          this.bb = h.ByteBuffer.allocate(g), this.space = g, this.minalign = 1, this.vtable = null, this.vtable_in_use = 0, this.isNested = !1, this.object_start = 0, this.vtables = [], this.vector_num_elems = 0, this.force_defaults = !1;
        }, h.Builder.prototype.clear = function() {
          this.bb.clear(), this.space = this.bb.capacity(), this.minalign = 1, this.vtable = null, this.vtable_in_use = 0, this.isNested = !1, this.object_start = 0, this.vtables = [], this.vector_num_elems = 0, this.force_defaults = !1;
        }, h.Builder.prototype.forceDefaults = function(p) {
          this.force_defaults = p;
        }, h.Builder.prototype.dataBuffer = function() {
          return this.bb;
        }, h.Builder.prototype.asUint8Array = function() {
          return this.bb.bytes().subarray(this.bb.position(), this.bb.position() + this.offset());
        }, h.Builder.prototype.prep = function(p, g) {
          p > this.minalign && (this.minalign = p);
          for (var o = 1 + ~(this.bb.capacity() - this.space + g) & p - 1; this.space < o + p + g; ) {
            var c = this.bb.capacity();
            this.bb = h.Builder.growByteBuffer(this.bb), this.space += this.bb.capacity() - c;
          }
          this.pad(o);
        }, h.Builder.prototype.pad = function(p) {
          for (var g = 0; g < p; g++) this.bb.writeInt8(--this.space, 0);
        }, h.Builder.prototype.writeInt8 = function(p) {
          this.bb.writeInt8(this.space -= 1, p);
        }, h.Builder.prototype.writeInt16 = function(p) {
          this.bb.writeInt16(this.space -= 2, p);
        }, h.Builder.prototype.writeInt32 = function(p) {
          this.bb.writeInt32(this.space -= 4, p);
        }, h.Builder.prototype.writeInt64 = function(p) {
          this.bb.writeInt64(this.space -= 8, p);
        }, h.Builder.prototype.writeFloat32 = function(p) {
          this.bb.writeFloat32(this.space -= 4, p);
        }, h.Builder.prototype.writeFloat64 = function(p) {
          this.bb.writeFloat64(this.space -= 8, p);
        }, h.Builder.prototype.addInt8 = function(p) {
          this.prep(1, 0), this.writeInt8(p);
        }, h.Builder.prototype.addInt16 = function(p) {
          this.prep(2, 0), this.writeInt16(p);
        }, h.Builder.prototype.addInt32 = function(p) {
          this.prep(4, 0), this.writeInt32(p);
        }, h.Builder.prototype.addInt64 = function(p) {
          this.prep(8, 0), this.writeInt64(p);
        }, h.Builder.prototype.addFloat32 = function(p) {
          this.prep(4, 0), this.writeFloat32(p);
        }, h.Builder.prototype.addFloat64 = function(p) {
          this.prep(8, 0), this.writeFloat64(p);
        }, h.Builder.prototype.addFieldInt8 = function(p, g, o) {
          (this.force_defaults || g != o) && (this.addInt8(g), this.slot(p));
        }, h.Builder.prototype.addFieldInt16 = function(p, g, o) {
          (this.force_defaults || g != o) && (this.addInt16(g), this.slot(p));
        }, h.Builder.prototype.addFieldInt32 = function(p, g, o) {
          (this.force_defaults || g != o) && (this.addInt32(g), this.slot(p));
        }, h.Builder.prototype.addFieldInt64 = function(p, g, o) {
          !this.force_defaults && g.equals(o) || (this.addInt64(g), this.slot(p));
        }, h.Builder.prototype.addFieldFloat32 = function(p, g, o) {
          (this.force_defaults || g != o) && (this.addFloat32(g), this.slot(p));
        }, h.Builder.prototype.addFieldFloat64 = function(p, g, o) {
          (this.force_defaults || g != o) && (this.addFloat64(g), this.slot(p));
        }, h.Builder.prototype.addFieldOffset = function(p, g, o) {
          (this.force_defaults || g != o) && (this.addOffset(g), this.slot(p));
        }, h.Builder.prototype.addFieldStruct = function(p, g, o) {
          g != o && (this.nested(g), this.slot(p));
        }, h.Builder.prototype.nested = function(p) {
          if (p != this.offset()) throw new Error("FlatBuffers: struct must be serialized inline.");
        }, h.Builder.prototype.notNested = function() {
          if (this.isNested) throw new Error("FlatBuffers: object serialization must not be nested.");
        }, h.Builder.prototype.slot = function(p) {
          this.vtable[p] = this.offset();
        }, h.Builder.prototype.offset = function() {
          return this.bb.capacity() - this.space;
        }, h.Builder.growByteBuffer = function(p) {
          var g = p.capacity();
          if (3221225472 & g) throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");
          var o = g << 1, c = h.ByteBuffer.allocate(o);
          return c.setPosition(o - g), c.bytes().set(p.bytes(), o - g), c;
        }, h.Builder.prototype.addOffset = function(p) {
          this.prep(h.SIZEOF_INT, 0), this.writeInt32(this.offset() - p + h.SIZEOF_INT);
        }, h.Builder.prototype.startObject = function(p) {
          this.notNested(), this.vtable == null && (this.vtable = []), this.vtable_in_use = p;
          for (var g = 0; g < p; g++) this.vtable[g] = 0;
          this.isNested = !0, this.object_start = this.offset();
        }, h.Builder.prototype.endObject = function() {
          if (this.vtable == null || !this.isNested) throw new Error("FlatBuffers: endObject called without startObject");
          this.addInt32(0);
          for (var p = this.offset(), g = this.vtable_in_use - 1; g >= 0 && this.vtable[g] == 0; g--) ;
          for (var o = g + 1; g >= 0; g--) this.addInt16(this.vtable[g] != 0 ? p - this.vtable[g] : 0);
          this.addInt16(p - this.object_start);
          var c = (o + 2) * h.SIZEOF_SHORT;
          this.addInt16(c);
          var f = 0, a = this.space;
          e: for (g = 0; g < this.vtables.length; g++) {
            var i = this.bb.capacity() - this.vtables[g];
            if (c == this.bb.readInt16(i)) {
              for (var t = h.SIZEOF_SHORT; t < c; t += h.SIZEOF_SHORT) if (this.bb.readInt16(a + t) != this.bb.readInt16(i + t)) continue e;
              f = this.vtables[g];
              break;
            }
          }
          return f ? (this.space = this.bb.capacity() - p, this.bb.writeInt32(this.space, f - p)) : (this.vtables.push(this.offset()), this.bb.writeInt32(this.bb.capacity() - p, this.offset() - p)), this.isNested = !1, p;
        }, h.Builder.prototype.finish = function(p, g, o) {
          var c = o ? h.SIZE_PREFIX_LENGTH : 0;
          if (g) {
            var f = g;
            if (this.prep(this.minalign, h.SIZEOF_INT + h.FILE_IDENTIFIER_LENGTH + c), f.length != h.FILE_IDENTIFIER_LENGTH) throw new Error("FlatBuffers: file identifier must be length " + h.FILE_IDENTIFIER_LENGTH);
            for (var a = h.FILE_IDENTIFIER_LENGTH - 1; a >= 0; a--) this.writeInt8(f.charCodeAt(a));
          }
          this.prep(this.minalign, h.SIZEOF_INT + c), this.addOffset(p), c && this.addInt32(this.bb.capacity() - this.space), this.bb.setPosition(this.space);
        }, h.Builder.prototype.finishSizePrefixed = function(p, g) {
          this.finish(p, g, !0);
        }, h.Builder.prototype.requiredField = function(p, g) {
          var o = this.bb.capacity() - p, c = o - this.bb.readInt32(o);
          if (this.bb.readInt16(c + g) == 0) throw new Error("FlatBuffers: field " + g + " must be set");
        }, h.Builder.prototype.startVector = function(p, g, o) {
          this.notNested(), this.vector_num_elems = g, this.prep(h.SIZEOF_INT, p * g), this.prep(o, p * g);
        }, h.Builder.prototype.endVector = function() {
          return this.writeInt32(this.vector_num_elems), this.offset();
        }, h.Builder.prototype.createString = function(p) {
          if (p instanceof Uint8Array) var g = p;
          else {
            g = [];
            for (var o = 0; o < p.length; ) {
              var c, f = p.charCodeAt(o++);
              (c = f < 55296 || f >= 56320 ? f : (f << 10) + p.charCodeAt(o++) + -56613888) < 128 ? g.push(c) : (c < 2048 ? g.push(c >> 6 & 31 | 192) : (c < 65536 ? g.push(c >> 12 & 15 | 224) : g.push(c >> 18 & 7 | 240, c >> 12 & 63 | 128), g.push(c >> 6 & 63 | 128)), g.push(63 & c | 128));
            }
          }
          this.addInt8(0), this.startVector(1, g.length, 1), this.bb.setPosition(this.space -= g.length), o = 0;
          for (var a = this.space, i = this.bb.bytes(); o < g.length; o++) i[a++] = g[o];
          return this.endVector();
        }, h.Builder.prototype.createLong = function(p, g) {
          return h.Long.create(p, g);
        }, h.ByteBuffer = function(p) {
          this.bytes_ = p, this.position_ = 0;
        }, h.ByteBuffer.allocate = function(p) {
          return new h.ByteBuffer(new Uint8Array(p));
        }, h.ByteBuffer.prototype.clear = function() {
          this.position_ = 0;
        }, h.ByteBuffer.prototype.bytes = function() {
          return this.bytes_;
        }, h.ByteBuffer.prototype.position = function() {
          return this.position_;
        }, h.ByteBuffer.prototype.setPosition = function(p) {
          this.position_ = p;
        }, h.ByteBuffer.prototype.capacity = function() {
          return this.bytes_.length;
        }, h.ByteBuffer.prototype.readInt8 = function(p) {
          return this.readUint8(p) << 24 >> 24;
        }, h.ByteBuffer.prototype.readUint8 = function(p) {
          return this.bytes_[p];
        }, h.ByteBuffer.prototype.readInt16 = function(p) {
          return this.readUint16(p) << 16 >> 16;
        }, h.ByteBuffer.prototype.readUint16 = function(p) {
          return this.bytes_[p] | this.bytes_[p + 1] << 8;
        }, h.ByteBuffer.prototype.readInt32 = function(p) {
          return this.bytes_[p] | this.bytes_[p + 1] << 8 | this.bytes_[p + 2] << 16 | this.bytes_[p + 3] << 24;
        }, h.ByteBuffer.prototype.readUint32 = function(p) {
          return this.readInt32(p) >>> 0;
        }, h.ByteBuffer.prototype.readInt64 = function(p) {
          return new h.Long(this.readInt32(p), this.readInt32(p + 4));
        }, h.ByteBuffer.prototype.readUint64 = function(p) {
          return new h.Long(this.readUint32(p), this.readUint32(p + 4));
        }, h.ByteBuffer.prototype.readFloat32 = function(p) {
          return h.int32[0] = this.readInt32(p), h.float32[0];
        }, h.ByteBuffer.prototype.readFloat64 = function(p) {
          return h.int32[h.isLittleEndian ? 0 : 1] = this.readInt32(p), h.int32[h.isLittleEndian ? 1 : 0] = this.readInt32(p + 4), h.float64[0];
        }, h.ByteBuffer.prototype.writeInt8 = function(p, g) {
          this.bytes_[p] = g;
        }, h.ByteBuffer.prototype.writeUint8 = function(p, g) {
          this.bytes_[p] = g;
        }, h.ByteBuffer.prototype.writeInt16 = function(p, g) {
          this.bytes_[p] = g, this.bytes_[p + 1] = g >> 8;
        }, h.ByteBuffer.prototype.writeUint16 = function(p, g) {
          this.bytes_[p] = g, this.bytes_[p + 1] = g >> 8;
        }, h.ByteBuffer.prototype.writeInt32 = function(p, g) {
          this.bytes_[p] = g, this.bytes_[p + 1] = g >> 8, this.bytes_[p + 2] = g >> 16, this.bytes_[p + 3] = g >> 24;
        }, h.ByteBuffer.prototype.writeUint32 = function(p, g) {
          this.bytes_[p] = g, this.bytes_[p + 1] = g >> 8, this.bytes_[p + 2] = g >> 16, this.bytes_[p + 3] = g >> 24;
        }, h.ByteBuffer.prototype.writeInt64 = function(p, g) {
          this.writeInt32(p, g.low), this.writeInt32(p + 4, g.high);
        }, h.ByteBuffer.prototype.writeUint64 = function(p, g) {
          this.writeUint32(p, g.low), this.writeUint32(p + 4, g.high);
        }, h.ByteBuffer.prototype.writeFloat32 = function(p, g) {
          h.float32[0] = g, this.writeInt32(p, h.int32[0]);
        }, h.ByteBuffer.prototype.writeFloat64 = function(p, g) {
          h.float64[0] = g, this.writeInt32(p, h.int32[h.isLittleEndian ? 0 : 1]), this.writeInt32(p + 4, h.int32[h.isLittleEndian ? 1 : 0]);
        }, h.ByteBuffer.prototype.getBufferIdentifier = function() {
          if (this.bytes_.length < this.position_ + h.SIZEOF_INT + h.FILE_IDENTIFIER_LENGTH) throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");
          for (var p = "", g = 0; g < h.FILE_IDENTIFIER_LENGTH; g++) p += String.fromCharCode(this.readInt8(this.position_ + h.SIZEOF_INT + g));
          return p;
        }, h.ByteBuffer.prototype.__offset = function(p, g) {
          var o = p - this.readInt32(p);
          return g < this.readInt16(o) ? this.readInt16(o + g) : 0;
        }, h.ByteBuffer.prototype.__union = function(p, g) {
          return p.bb_pos = g + this.readInt32(g), p.bb = this, p;
        }, h.ByteBuffer.prototype.__string = function(p, g) {
          p += this.readInt32(p);
          var o = this.readInt32(p), c = "", f = 0;
          if (p += h.SIZEOF_INT, g === h.Encoding.UTF8_BYTES) return this.bytes_.subarray(p, p + o);
          for (; f < o; ) {
            var a, i = this.readUint8(p + f++);
            if (i < 192) a = i;
            else {
              var t = this.readUint8(p + f++);
              if (i < 224) a = (31 & i) << 6 | 63 & t;
              else {
                var e = this.readUint8(p + f++);
                a = i < 240 ? (15 & i) << 12 | (63 & t) << 6 | 63 & e : (7 & i) << 18 | (63 & t) << 12 | (63 & e) << 6 | 63 & this.readUint8(p + f++);
              }
            }
            a < 65536 ? c += String.fromCharCode(a) : (a -= 65536, c += String.fromCharCode(55296 + (a >> 10), 56320 + (1023 & a)));
          }
          return c;
        }, h.ByteBuffer.prototype.__indirect = function(p) {
          return p + this.readInt32(p);
        }, h.ByteBuffer.prototype.__vector = function(p) {
          return p + this.readInt32(p) + h.SIZEOF_INT;
        }, h.ByteBuffer.prototype.__vector_len = function(p) {
          return this.readInt32(p + this.readInt32(p));
        }, h.ByteBuffer.prototype.__has_identifier = function(p) {
          if (p.length != h.FILE_IDENTIFIER_LENGTH) throw new Error("FlatBuffers: file identifier must be length " + h.FILE_IDENTIFIER_LENGTH);
          for (var g = 0; g < h.FILE_IDENTIFIER_LENGTH; g++) if (p.charCodeAt(g) != this.readInt8(this.position_ + h.SIZEOF_INT + g)) return !1;
          return !0;
        }, h.ByteBuffer.prototype.createLong = function(p, g) {
          return h.Long.create(p, g);
        };
      } }, __webpack_module_cache__ = {};
      function __webpack_require__(C) {
        var u = __webpack_module_cache__[C];
        if (u !== void 0) return u.exports;
        var b = __webpack_module_cache__[C] = { exports: {} };
        return __webpack_modules__[C].call(b.exports, b, b.exports, __webpack_require__), b.exports;
      }
      __webpack_require__.n = (C) => {
        var u = C && C.__esModule ? () => C.default : () => C;
        return __webpack_require__.d(u, { a: u }), u;
      }, __webpack_require__.d = (C, u) => {
        for (var b in u) __webpack_require__.o(u, b) && !__webpack_require__.o(C, b) && Object.defineProperty(C, b, { enumerable: !0, get: u[b] });
      }, __webpack_require__.g = function() {
        if (typeof globalThis == "object") return globalThis;
        try {
          return this || new Function("return this")();
        } catch {
          if (typeof window == "object") return window;
        }
      }(), __webpack_require__.o = (C, u) => Object.prototype.hasOwnProperty.call(C, u), __webpack_require__.r = (C) => {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(C, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(C, "__esModule", { value: !0 });
      };
      var __webpack_exports__ = __webpack_require__(6018);
      return __webpack_exports__;
    })());
  }(ortWeb_min)), ortWeb_min.exports;
}
var assetPath = {}, hasRequiredAssetPath;
function requireAssetPath() {
  if (hasRequiredAssetPath) return assetPath;
  hasRequiredAssetPath = 1, Object.defineProperty(assetPath, "__esModule", { value: !0 }), assetPath.baseAssetPath = void 0;
  const u = typeof window < "u" && typeof window.document < "u" ? window.document.currentScript : null;
  let b = "/";
  return u && (b = u.src.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/")), assetPath.baseAssetPath = b, assetPath;
}
var defaultModelFetcher = {}, hasRequiredDefaultModelFetcher;
function requireDefaultModelFetcher() {
  if (hasRequiredDefaultModelFetcher) return defaultModelFetcher;
  hasRequiredDefaultModelFetcher = 1, Object.defineProperty(defaultModelFetcher, "__esModule", { value: !0 }), defaultModelFetcher.defaultModelFetcher = void 0;
  const C = (u) => fetch(u).then((b) => b.arrayBuffer());
  return defaultModelFetcher.defaultModelFetcher = C, defaultModelFetcher;
}
var frameProcessor = {}, logging = {}, hasRequiredLogging;
function requireLogging() {
  return hasRequiredLogging || (hasRequiredLogging = 1, function(C) {
    Object.defineProperty(C, "__esModule", { value: !0 }), C.log = C.LOG_PREFIX = void 0, C.LOG_PREFIX = "[VAD]";
    const u = ["error", "debug", "warn"];
    function b(p) {
      return (...g) => {
        console[p](C.LOG_PREFIX, ...g);
      };
    }
    const h = u.reduce((p, g) => (p[g] = b(g), p), {});
    C.log = h;
  }(logging)), logging;
}
var messages = {}, hasRequiredMessages;
function requireMessages() {
  if (hasRequiredMessages) return messages;
  hasRequiredMessages = 1, Object.defineProperty(messages, "__esModule", { value: !0 }), messages.Message = void 0;
  var C;
  return function(u) {
    u.AudioFrame = "AUDIO_FRAME", u.SpeechStart = "SPEECH_START", u.VADMisfire = "VAD_MISFIRE", u.SpeechEnd = "SPEECH_END", u.SpeechStop = "SPEECH_STOP";
  }(C || (messages.Message = C = {})), messages;
}
var hasRequiredFrameProcessor;
function requireFrameProcessor() {
  if (hasRequiredFrameProcessor) return frameProcessor;
  hasRequiredFrameProcessor = 1, Object.defineProperty(frameProcessor, "__esModule", { value: !0 }), frameProcessor.FrameProcessor = frameProcessor.validateOptions = frameProcessor.defaultV5FrameProcessorOptions = frameProcessor.defaultLegacyFrameProcessorOptions = void 0;
  const C = requireLogging(), u = requireMessages(), b = [512, 1024, 1536];
  frameProcessor.defaultLegacyFrameProcessorOptions = {
    positiveSpeechThreshold: 0.5,
    negativeSpeechThreshold: 0.5 - 0.15,
    preSpeechPadFrames: 1,
    redemptionFrames: 8,
    frameSamples: 1536,
    minSpeechFrames: 3,
    submitUserSpeechOnPause: !1
  }, frameProcessor.defaultV5FrameProcessorOptions = {
    positiveSpeechThreshold: 0.5,
    negativeSpeechThreshold: 0.5 - 0.15,
    preSpeechPadFrames: 3,
    redemptionFrames: 24,
    frameSamples: 512,
    minSpeechFrames: 9,
    submitUserSpeechOnPause: !1
  };
  function h(o) {
    b.includes(o.frameSamples) || C.log.warn("You are using an unusual frame size"), (o.positiveSpeechThreshold < 0 || o.positiveSpeechThreshold > 1) && C.log.error("positiveSpeechThreshold should be a number between 0 and 1"), (o.negativeSpeechThreshold < 0 || o.negativeSpeechThreshold > o.positiveSpeechThreshold) && C.log.error("negativeSpeechThreshold should be between 0 and positiveSpeechThreshold"), o.preSpeechPadFrames < 0 && C.log.error("preSpeechPadFrames should be positive"), o.redemptionFrames < 0 && C.log.error("redemptionFrames should be positive");
  }
  frameProcessor.validateOptions = h;
  const p = (o) => {
    const c = o.reduce((a, i) => (a.push(a.at(-1) + i.length), a), [0]), f = new Float32Array(c.at(-1));
    return o.forEach((a, i) => {
      const t = c[i];
      f.set(a, t);
    }), f;
  };
  class g {
    constructor(c, f, a) {
      this.modelProcessFunc = c, this.modelResetFunc = f, this.options = a, this.speaking = !1, this.redemptionCounter = 0, this.active = !1, this.reset = () => {
        this.speaking = !1, this.audioBuffer = [], this.modelResetFunc(), this.redemptionCounter = 0;
      }, this.pause = () => (this.active = !1, this.options.submitUserSpeechOnPause ? this.endSegment() : (this.reset(), {})), this.resume = () => {
        this.active = !0;
      }, this.endSegment = () => {
        const i = this.audioBuffer;
        this.audioBuffer = [];
        const t = this.speaking;
        this.reset();
        const e = i.reduce((n, r) => n + +r.isSpeech, 0);
        if (t)
          if (e >= this.options.minSpeechFrames) {
            const n = p(i.map((r) => r.frame));
            return { msg: u.Message.SpeechEnd, audio: n };
          } else
            return { msg: u.Message.VADMisfire };
        return {};
      }, this.process = async (i) => {
        if (!this.active)
          return {};
        const t = await this.modelProcessFunc(i);
        if (this.audioBuffer.push({
          frame: i,
          isSpeech: t.isSpeech >= this.options.positiveSpeechThreshold
        }), t.isSpeech >= this.options.positiveSpeechThreshold && this.redemptionCounter && (this.redemptionCounter = 0), t.isSpeech >= this.options.positiveSpeechThreshold && !this.speaking)
          return this.speaking = !0, { probs: t, msg: u.Message.SpeechStart, frame: i };
        if (t.isSpeech < this.options.negativeSpeechThreshold && this.speaking && ++this.redemptionCounter >= this.options.redemptionFrames) {
          this.redemptionCounter = 0, this.speaking = !1;
          const e = this.audioBuffer;
          if (this.audioBuffer = [], e.reduce((r, s) => r + +s.isSpeech, 0) >= this.options.minSpeechFrames) {
            const r = p(e.map((s) => s.frame));
            return { probs: t, msg: u.Message.SpeechEnd, audio: r, frame: i };
          } else
            return { probs: t, msg: u.Message.VADMisfire, frame: i };
        }
        if (!this.speaking)
          for (; this.audioBuffer.length > this.options.preSpeechPadFrames; )
            this.audioBuffer.shift();
        return { probs: t, frame: i };
      }, this.audioBuffer = [], this.reset();
    }
  }
  return frameProcessor.FrameProcessor = g, frameProcessor;
}
var nonRealTimeVad = {}, models = {}, common = {}, hasRequiredCommon;
function requireCommon() {
  return hasRequiredCommon || (hasRequiredCommon = 1, Object.defineProperty(common, "__esModule", { value: !0 })), common;
}
var legacy = {}, hasRequiredLegacy;
function requireLegacy() {
  if (hasRequiredLegacy) return legacy;
  hasRequiredLegacy = 1;
  var C;
  Object.defineProperty(legacy, "__esModule", { value: !0 }), legacy.SileroLegacy = void 0;
  const u = requireLogging();
  class b {
    constructor(p, g, o, c, f) {
      this.ortInstance = p, this._session = g, this._h = o, this._c = c, this._sr = f, this.reset_state = () => {
        const a = Array(128).fill(0);
        this._h = new this.ortInstance.Tensor("float32", a, [2, 1, 64]), this._c = new this.ortInstance.Tensor("float32", a, [2, 1, 64]);
      }, this.process = async (a) => {
        var s;
        const t = {
          input: new this.ortInstance.Tensor("float32", a, [
            1,
            a.length
          ]),
          h: this._h,
          c: this._c,
          sr: this._sr
        }, e = await this._session.run(t);
        this._h = e.hn, this._c = e.cn;
        const [n] = (s = e.output) == null ? void 0 : s.data;
        return { notSpeech: 1 - n, isSpeech: n };
      };
    }
  }
  return legacy.SileroLegacy = b, C = b, b.new = async (h, p) => {
    u.log.debug("initializing vad");
    const g = await p(), o = await h.InferenceSession.create(g), c = new h.Tensor("int64", [16000n]), f = Array(2 * 64).fill(0), a = new h.Tensor("float32", f, [2, 1, 64]), i = new h.Tensor("float32", f, [2, 1, 64]);
    return u.log.debug("vad is initialized"), new C(h, o, a, i, c);
  }, legacy;
}
var v5 = {}, hasRequiredV5;
function requireV5() {
  if (hasRequiredV5) return v5;
  hasRequiredV5 = 1;
  var C;
  Object.defineProperty(v5, "__esModule", { value: !0 }), v5.SileroV5 = void 0;
  const u = requireLogging();
  function b(p) {
    const g = Array(256).fill(0);
    return new p.Tensor("float32", g, [2, 1, 128]);
  }
  class h {
    constructor(g, o, c, f) {
      this._session = g, this._state = o, this._sr = c, this.ortInstance = f, this.reset_state = () => {
        this._state = b(this.ortInstance);
      }, this.process = async (a) => {
        var s;
        const t = {
          input: new this.ortInstance.Tensor("float32", a, [
            1,
            a.length
          ]),
          state: this._state,
          sr: this._sr
        }, e = await this._session.run(t);
        this._state = e.stateN;
        const [n] = (s = e.output) == null ? void 0 : s.data;
        return { notSpeech: 1 - n, isSpeech: n };
      };
    }
  }
  return v5.SileroV5 = h, C = h, h.new = async (p, g) => {
    u.log.debug("Loading VAD...");
    const o = await g(), c = await p.InferenceSession.create(o), f = new p.Tensor("int64", [16000n]), a = b(p);
    return u.log.debug("...finished loading VAD"), new C(c, a, f, p);
  }, v5;
}
var hasRequiredModels;
function requireModels() {
  return hasRequiredModels || (hasRequiredModels = 1, function(C) {
    var u = models.__createBinding || (Object.create ? function(g, o, c, f) {
      f === void 0 && (f = c);
      var a = Object.getOwnPropertyDescriptor(o, c);
      (!a || ("get" in a ? !o.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
        return o[c];
      } }), Object.defineProperty(g, f, a);
    } : function(g, o, c, f) {
      f === void 0 && (f = c), g[f] = o[c];
    }), b = models.__exportStar || function(g, o) {
      for (var c in g) c !== "default" && !Object.prototype.hasOwnProperty.call(o, c) && u(o, g, c);
    };
    Object.defineProperty(C, "__esModule", { value: !0 }), C.SileroV5 = C.SileroLegacy = void 0, b(requireCommon(), C);
    var h = requireLegacy();
    Object.defineProperty(C, "SileroLegacy", { enumerable: !0, get: function() {
      return h.SileroLegacy;
    } });
    var p = requireV5();
    Object.defineProperty(C, "SileroV5", { enumerable: !0, get: function() {
      return p.SileroV5;
    } });
  }(models)), models;
}
var resampler = {}, hasRequiredResampler;
function requireResampler() {
  if (hasRequiredResampler) return resampler;
  hasRequiredResampler = 1, Object.defineProperty(resampler, "__esModule", { value: !0 }), resampler.Resampler = void 0;
  const C = requireLogging();
  class u {
    constructor(h) {
      this.options = h, this.process = (p) => {
        const g = [];
        for (const o of p)
          for (this.inputBuffer.push(o); this.hasEnoughDataForFrame(); ) {
            const c = this.generateOutputFrame();
            g.push(c);
          }
        return g;
      }, this.stream = async function* (p) {
        for (const g of p)
          for (this.inputBuffer.push(g); this.hasEnoughDataForFrame(); )
            yield this.generateOutputFrame();
      }, h.nativeSampleRate < 16e3 && C.log.error("nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate"), this.inputBuffer = [];
    }
    hasEnoughDataForFrame() {
      return this.inputBuffer.length * this.options.targetSampleRate / this.options.nativeSampleRate >= this.options.targetFrameSize;
    }
    generateOutputFrame() {
      const h = new Float32Array(this.options.targetFrameSize);
      let p = 0, g = 0;
      for (; p < this.options.targetFrameSize; ) {
        let o = 0, c = 0;
        for (; g < Math.min(this.inputBuffer.length, (p + 1) * this.options.nativeSampleRate / this.options.targetSampleRate); ) {
          const f = this.inputBuffer[g];
          f !== void 0 && (o += f, c++), g++;
        }
        h[p] = o / c, p++;
      }
      return this.inputBuffer = this.inputBuffer.slice(g), h;
    }
  }
  return resampler.Resampler = u, resampler;
}
var hasRequiredNonRealTimeVad;
function requireNonRealTimeVad() {
  return hasRequiredNonRealTimeVad || (hasRequiredNonRealTimeVad = 1, function(C) {
    Object.defineProperty(C, "__esModule", { value: !0 }), C.PlatformAgnosticNonRealTimeVAD = C.defaultNonRealTimeVADOptions = void 0;
    const u = requireFrameProcessor(), b = requireMessages(), h = requireModels(), p = requireResampler();
    C.defaultNonRealTimeVADOptions = {
      ...u.defaultLegacyFrameProcessorOptions,
      ortConfig: void 0
    };
    class g {
      static async _new(c, f, a = {}) {
        const i = {
          ...C.defaultNonRealTimeVADOptions,
          ...a
        };
        i.ortConfig !== void 0 && i.ortConfig(f);
        const t = new this(c, f, i);
        return await t.init(), t;
      }
      constructor(c, f, a) {
        this.modelFetcher = c, this.ort = f, this.options = a, this.init = async () => {
          const i = await h.SileroLegacy.new(this.ort, this.modelFetcher);
          this.frameProcessor = new u.FrameProcessor(i.process, i.reset_state, {
            frameSamples: this.options.frameSamples,
            positiveSpeechThreshold: this.options.positiveSpeechThreshold,
            negativeSpeechThreshold: this.options.negativeSpeechThreshold,
            redemptionFrames: this.options.redemptionFrames,
            preSpeechPadFrames: this.options.preSpeechPadFrames,
            minSpeechFrames: this.options.minSpeechFrames,
            submitUserSpeechOnPause: this.options.submitUserSpeechOnPause
          }), this.frameProcessor.resume();
        }, this.run = async function* (i, t) {
          const e = {
            nativeSampleRate: t,
            targetSampleRate: 16e3,
            targetFrameSize: this.options.frameSamples
          }, n = new p.Resampler(e);
          let r = 0, s = 0, l = 0;
          for await (const y of n.stream(i)) {
            const { msg: w, audio: _ } = await this.frameProcessor.process(y);
            switch (w) {
              case b.Message.SpeechStart:
                r = l * this.options.frameSamples / 16;
                break;
              case b.Message.SpeechEnd:
                s = (l + 1) * this.options.frameSamples / 16, yield { audio: _, start: r, end: s };
                break;
            }
            l++;
          }
          const { msg: d, audio: m } = this.frameProcessor.endSegment();
          d == b.Message.SpeechEnd && (yield {
            audio: m,
            start: r,
            end: l * this.options.frameSamples / 16
          });
        }, (0, u.validateOptions)(a);
      }
    }
    C.PlatformAgnosticNonRealTimeVAD = g;
  }(nonRealTimeVad)), nonRealTimeVad;
}
var utils = {}, hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1, Object.defineProperty(utils, "__esModule", { value: !0 }), utils.audioFileToArray = utils.encodeWAV = utils.arrayBufferToBase64 = utils.minFramesForTargetMS = void 0;
  function C(c, f, a = 16e3) {
    return Math.ceil(c * a / 1e3 / f);
  }
  utils.minFramesForTargetMS = C;
  function u(c) {
    const f = new Uint8Array(c), a = f.byteLength, i = new Array(a);
    for (var t = 0; t < a; t++) {
      const e = f[t];
      if (e === void 0)
        break;
      i[t] = String.fromCharCode(e);
    }
    return btoa(i.join(""));
  }
  utils.arrayBufferToBase64 = u;
  function b(c, f = 3, a = 16e3, i = 1, t = 32) {
    var e = t / 8, n = i * e, r = new ArrayBuffer(44 + c.length * e), s = new DataView(r);
    return g(s, 0, "RIFF"), s.setUint32(4, 36 + c.length * e, !0), g(s, 8, "WAVE"), g(s, 12, "fmt "), s.setUint32(16, 16, !0), s.setUint16(20, f, !0), s.setUint16(22, i, !0), s.setUint32(24, a, !0), s.setUint32(28, a * n, !0), s.setUint16(32, n, !0), s.setUint16(34, t, !0), g(s, 36, "data"), s.setUint32(40, c.length * e, !0), f === 1 ? p(s, 44, c) : h(s, 44, c), r;
  }
  utils.encodeWAV = b;
  function h(c, f, a) {
    for (var i = 0; i < a.length; i++, f += 4)
      c.setFloat32(f, a[i], !0);
  }
  function p(c, f, a) {
    for (var i = 0; i < a.length; i++, f += 2) {
      var t = Math.max(-1, Math.min(1, a[i]));
      c.setInt16(f, t < 0 ? t * 32768 : t * 32767, !0);
    }
  }
  function g(c, f, a) {
    for (var i = 0; i < a.length; i++)
      c.setUint8(f + i, a.charCodeAt(i));
  }
  async function o(c) {
    const f = new OfflineAudioContext(1, 1, 44100), a = new FileReader();
    let i = null;
    if (await new Promise((n) => {
      a.addEventListener("loadend", (r) => {
        const s = a.result;
        f.decodeAudioData(s, (l) => {
          i = l, f.startRendering().then((d) => {
            console.log("Rendering completed successfully"), n();
          }).catch((d) => {
            console.error(`Rendering failed: ${d}`);
          });
        }, (l) => {
          console.log(`Error with decoding audio data: ${l}`);
        });
      }), a.readAsArrayBuffer(c);
    }), i === null)
      throw Error("some shit");
    let t = i, e = new Float32Array(t.length);
    for (let n = 0; n < t.length; n++)
      for (let r = 0; r < t.numberOfChannels; r++)
        e[n] += t.getChannelData(r)[n];
    return { audio: e, sampleRate: t.sampleRate };
  }
  return utils.audioFileToArray = o, utils;
}
var realTimeVad = {}, hasRequiredRealTimeVad;
function requireRealTimeVad() {
  return hasRequiredRealTimeVad || (hasRequiredRealTimeVad = 1, function(C) {
    var u = realTimeVad.__createBinding || (Object.create ? function(d, m, y, w) {
      w === void 0 && (w = y);
      var _ = Object.getOwnPropertyDescriptor(m, y);
      (!_ || ("get" in _ ? !m.__esModule : _.writable || _.configurable)) && (_ = { enumerable: !0, get: function() {
        return m[y];
      } }), Object.defineProperty(d, w, _);
    } : function(d, m, y, w) {
      w === void 0 && (w = y), d[w] = m[y];
    }), b = realTimeVad.__setModuleDefault || (Object.create ? function(d, m) {
      Object.defineProperty(d, "default", { enumerable: !0, value: m });
    } : function(d, m) {
      d.default = m;
    }), h = realTimeVad.__importStar || function(d) {
      if (d && d.__esModule) return d;
      var m = {};
      if (d != null) for (var y in d) y !== "default" && Object.prototype.hasOwnProperty.call(d, y) && u(m, d, y);
      return b(m, d), m;
    };
    Object.defineProperty(C, "__esModule", { value: !0 }), C.AudioNodeVAD = C.MicVAD = C.getDefaultRealTimeVADOptions = C.ort = C.DEFAULT_MODEL = void 0;
    const p = h(requireOrtWeb_min()), g = requireDefaultModelFetcher(), o = requireFrameProcessor(), c = requireLogging(), f = requireMessages(), a = requireModels(), i = requireResampler();
    C.DEFAULT_MODEL = "legacy", C.ort = p;
    const t = "vad.worklet.bundle.min.js", e = "silero_vad_v5.onnx", n = "silero_vad_legacy.onnx", r = (d) => ({
      ...d === "v5" ? o.defaultV5FrameProcessorOptions : o.defaultLegacyFrameProcessorOptions,
      onFrameProcessed: (y) => {
      },
      onVADMisfire: () => {
        c.log.debug("VAD misfire");
      },
      onSpeechStart: () => {
        c.log.debug("Detected speech start");
      },
      onSpeechEnd: () => {
        c.log.debug("Detected speech end");
      },
      baseAssetPath: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.22/dist/",
      onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/",
      stream: void 0,
      ortConfig: void 0,
      model: C.DEFAULT_MODEL,
      workletOptions: {}
    });
    C.getDefaultRealTimeVADOptions = r;
    class s {
      static async new(m = {}) {
        const y = {
          ...(0, C.getDefaultRealTimeVADOptions)(m.model ?? C.DEFAULT_MODEL),
          ...m
        };
        (0, o.validateOptions)(y);
        let w;
        y.stream === void 0 ? w = await navigator.mediaDevices.getUserMedia({
          audio: {
            ...y.additionalAudioConstraints,
            channelCount: 1,
            echoCancellation: !0,
            autoGainControl: !0,
            noiseSuppression: !0
          }
        }) : w = y.stream;
        const _ = new AudioContext(), S = new MediaStreamAudioSourceNode(_, {
          mediaStream: w
        }), A = await l.new(_, y);
        return A.receive(S), new s(y, _, w, A, S);
      }
      constructor(m, y, w, _, S, A = !1) {
        this.options = m, this.audioContext = y, this.stream = w, this.audioNodeVAD = _, this.sourceNode = S, this.listening = A, this.pause = () => {
          this.audioNodeVAD.pause(), this.listening = !1;
        }, this.start = () => {
          this.audioNodeVAD.start(), this.listening = !0;
        }, this.destroy = () => {
          this.listening && this.pause(), this.options.stream === void 0 && this.stream.getTracks().forEach((P) => P.stop()), this.sourceNode.disconnect(), this.audioNodeVAD.destroy(), this.audioContext.close();
        };
      }
    }
    C.MicVAD = s;
    class l {
      static async new(m, y = {}) {
        const w = {
          ...(0, C.getDefaultRealTimeVADOptions)(y.model ?? C.DEFAULT_MODEL),
          ...y
        };
        (0, o.validateOptions)(w), C.ort.env.wasm.wasmPaths = w.onnxWASMBasePath, w.ortConfig !== void 0 && w.ortConfig(C.ort);
        const _ = w.model === "v5" ? e : n, S = w.baseAssetPath + _, A = w.model === "v5" ? a.SileroV5.new : a.SileroLegacy.new;
        let P;
        try {
          P = await A(C.ort, () => (0, g.defaultModelFetcher)(S));
        } catch (B) {
          throw console.error(`Encountered an error while loading model file ${S}`), B;
        }
        const v = new o.FrameProcessor(P.process, P.reset_state, {
          frameSamples: w.frameSamples,
          positiveSpeechThreshold: w.positiveSpeechThreshold,
          negativeSpeechThreshold: w.negativeSpeechThreshold,
          redemptionFrames: w.redemptionFrames,
          preSpeechPadFrames: w.preSpeechPadFrames,
          minSpeechFrames: w.minSpeechFrames,
          submitUserSpeechOnPause: w.submitUserSpeechOnPause
        }), R = new l(m, w, v);
        return await R.setupAudioNode(), R;
      }
      constructor(m, y, w) {
        this.ctx = m, this.options = y, this.bufferIndex = 0, this.pause = () => {
          const _ = this.frameProcessor.pause();
          this.handleFrameProcessorEvent(_);
        }, this.start = () => {
          this.frameProcessor.resume();
        }, this.receive = (_) => {
          _.connect(this.audioNode);
        }, this.processFrame = async (_) => {
          const S = await this.frameProcessor.process(_);
          this.handleFrameProcessorEvent(S);
        }, this.handleFrameProcessorEvent = (_) => {
          switch (_.probs !== void 0 && this.options.onFrameProcessed(_.probs, _.frame), _.msg) {
            case f.Message.SpeechStart:
              this.options.onSpeechStart();
              break;
            case f.Message.VADMisfire:
              this.options.onVADMisfire();
              break;
            case f.Message.SpeechEnd:
              this.options.onSpeechEnd(_.audio);
              break;
          }
        }, this.destroy = () => {
          var _;
          this.audioNode instanceof AudioWorkletNode && this.audioNode.port.postMessage({
            message: f.Message.SpeechStop
          }), this.audioNode.disconnect(), (_ = this.gainNode) == null || _.disconnect();
        }, this.frameProcessor = w;
      }
      async setupAudioNode() {
        if ("audioWorklet" in this.ctx && typeof AudioWorkletNode == "function")
          try {
            const _ = this.options.baseAssetPath + t;
            await this.ctx.audioWorklet.addModule(_);
            const S = this.options.workletOptions ?? {};
            S.processorOptions = {
              ...S.processorOptions ?? {},
              frameSamples: this.options.frameSamples
            }, this.audioNode = new AudioWorkletNode(this.ctx, "vad-helper-worklet", S), this.audioNode.port.onmessage = async (A) => {
              var P;
              switch ((P = A.data) == null ? void 0 : P.message) {
                case f.Message.AudioFrame:
                  let v = A.data.data;
                  v instanceof ArrayBuffer || (v = new ArrayBuffer(A.data.data.byteLength), new Uint8Array(v).set(new Uint8Array(A.data.data)));
                  const R = new Float32Array(v);
                  await this.processFrame(R);
                  break;
              }
            };
            return;
          } catch (_) {
            console.log("AudioWorklet setup failed, falling back to ScriptProcessor", _);
          }
        this.resampler = new i.Resampler({
          nativeSampleRate: this.ctx.sampleRate,
          targetSampleRate: 16e3,
          targetFrameSize: this.options.frameSamples ?? 480
        });
        const y = 4096;
        this.audioNode = this.ctx.createScriptProcessor(y, 1, 1), this.gainNode = this.ctx.createGain(), this.gainNode.gain.value = 0;
        let w = !1;
        this.audioNode.onaudioprocess = async (_) => {
          if (!w) {
            w = !0;
            try {
              const S = _.inputBuffer.getChannelData(0);
              if (_.outputBuffer.getChannelData(0).fill(0), this.resampler) {
                const P = this.resampler.process(S);
                for (const v of P)
                  await this.processFrame(v);
              }
            } catch (S) {
              console.error("Error processing audio:", S);
            } finally {
              w = !1;
            }
          }
        }, this.audioNode.connect(this.gainNode), this.gainNode.connect(this.ctx.destination);
      }
    }
    C.AudioNodeVAD = l;
  }(realTimeVad)), realTimeVad;
}
var hasRequiredDist;
function requireDist() {
  return hasRequiredDist || (hasRequiredDist = 1, function(C) {
    var u = dist.__createBinding || (Object.create ? function(n, r, s, l) {
      l === void 0 && (l = s);
      var d = Object.getOwnPropertyDescriptor(r, s);
      (!d || ("get" in d ? !r.__esModule : d.writable || d.configurable)) && (d = { enumerable: !0, get: function() {
        return r[s];
      } }), Object.defineProperty(n, l, d);
    } : function(n, r, s, l) {
      l === void 0 && (l = s), n[l] = r[s];
    }), b = dist.__setModuleDefault || (Object.create ? function(n, r) {
      Object.defineProperty(n, "default", { enumerable: !0, value: r });
    } : function(n, r) {
      n.default = r;
    }), h = dist.__importStar || function(n) {
      if (n && n.__esModule) return n;
      var r = {};
      if (n != null) for (var s in n) s !== "default" && Object.prototype.hasOwnProperty.call(n, s) && u(r, n, s);
      return b(r, n), r;
    };
    Object.defineProperty(C, "__esModule", { value: !0 }), C.NonRealTimeVAD = C.Message = C.FrameProcessor = C.getDefaultRealTimeVADOptions = C.MicVAD = C.DEFAULT_MODEL = C.AudioNodeVAD = C.utils = C.defaultNonRealTimeVADOptions = void 0;
    const p = h(requireOrtWeb_min()), g = requireAssetPath(), o = requireDefaultModelFetcher(), c = requireFrameProcessor();
    Object.defineProperty(C, "FrameProcessor", { enumerable: !0, get: function() {
      return c.FrameProcessor;
    } });
    const f = requireMessages();
    Object.defineProperty(C, "Message", { enumerable: !0, get: function() {
      return f.Message;
    } });
    const a = requireNonRealTimeVad(), i = requireUtils();
    C.defaultNonRealTimeVADOptions = {
      modelURL: g.baseAssetPath + "silero_vad_legacy.onnx",
      modelFetcher: o.defaultModelFetcher
    };
    class t extends a.PlatformAgnosticNonRealTimeVAD {
      static async new(r = {}) {
        const { modelURL: s, modelFetcher: l } = {
          ...C.defaultNonRealTimeVADOptions,
          ...r
        };
        return await this._new(() => l(s), p, r);
      }
    }
    C.NonRealTimeVAD = t, C.utils = {
      audioFileToArray: i.audioFileToArray,
      minFramesForTargetMS: i.minFramesForTargetMS,
      arrayBufferToBase64: i.arrayBufferToBase64,
      encodeWAV: i.encodeWAV
    };
    var e = requireRealTimeVad();
    Object.defineProperty(C, "AudioNodeVAD", { enumerable: !0, get: function() {
      return e.AudioNodeVAD;
    } }), Object.defineProperty(C, "DEFAULT_MODEL", { enumerable: !0, get: function() {
      return e.DEFAULT_MODEL;
    } }), Object.defineProperty(C, "MicVAD", { enumerable: !0, get: function() {
      return e.MicVAD;
    } }), Object.defineProperty(C, "getDefaultRealTimeVADOptions", { enumerable: !0, get: function() {
      return e.getDefaultRealTimeVADOptions;
    } });
  }(dist)), dist;
}
var distExports = requireDist();
const startVad = async ({
  onSpeechStart: C,
  onSpeechEnd: u,
  options: b = {}
} = {}) => {
  const { audioContext: h, source: p, stream: g } = await getMicrophoneInput(), { positiveSpeechThreshold: o = 0.9, ...c } = b;
  return (await distExports.MicVAD.new({
    // modelURL: based("vad/silero_vad.onnx"),
    // workletURL: based("vad/vad.worklet.bundle.min.js"),
    stream: g,
    positiveSpeechThreshold: o,
    ortConfig: (a) => {
      console.log("startVad: ortConfig", a), a.env.wasm.numThreads = 1;
    },
    onSpeechStart: () => {
      C == null || C();
    },
    onSpeechEnd: async (a) => {
      const i = distExports.utils.encodeWAV(a);
      u == null || u(i);
    },
    ...c
  })).start(), {
    audioContext: h,
    source: p,
    stream: g
  };
}, useMicAudio = (C) => {
  const [u, b] = require$$0$1.useState({
    analyserNode: void 0
  });
  return useEffect(() => {
    C && !u.analyserNode && getMicAudio(
      // "e18767886adb9583a29268deeae90b9e36fcfb273504d3a9893f40d604aa6c71"
    ).then(({ analyserNode: h }) => {
      b((p) => ({ ...p, analyserNode: h }));
    });
  }, [C]), u.analyserNode;
}, Vads = {
  startVad,
  getMicAudio,
  getMicrophoneInput,
  useMicAudio
};
var jsxRuntime = { exports: {} }, reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var C = require$$0$1, u = Symbol.for("react.element"), b = Symbol.for("react.fragment"), h = Object.prototype.hasOwnProperty, p = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, g = { key: !0, ref: !0, __self: !0, __source: !0 };
  function o(c, f, a) {
    var i, t = {}, e = null, n = null;
    a !== void 0 && (e = "" + a), f.key !== void 0 && (e = "" + f.key), f.ref !== void 0 && (n = f.ref);
    for (i in f) h.call(f, i) && !g.hasOwnProperty(i) && (t[i] = f[i]);
    if (c && c.defaultProps) for (i in f = c.defaultProps, f) t[i] === void 0 && (t[i] = f[i]);
    return { $$typeof: u, type: c, key: e, ref: n, props: t, _owner: p.current };
  }
  return reactJsxRuntime_production_min.Fragment = b, reactJsxRuntime_production_min.jsx = o, reactJsxRuntime_production_min.jsxs = o, reactJsxRuntime_production_min;
}
var reactJsxRuntime_development = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_development;
function requireReactJsxRuntime_development() {
  return hasRequiredReactJsxRuntime_development || (hasRequiredReactJsxRuntime_development = 1, process.env.NODE_ENV !== "production" && function() {
    var C = require$$0$1, u = Symbol.for("react.element"), b = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), p = Symbol.for("react.strict_mode"), g = Symbol.for("react.profiler"), o = Symbol.for("react.provider"), c = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), a = Symbol.for("react.suspense"), i = Symbol.for("react.suspense_list"), t = Symbol.for("react.memo"), e = Symbol.for("react.lazy"), n = Symbol.for("react.offscreen"), r = Symbol.iterator, s = "@@iterator";
    function l(j) {
      if (j === null || typeof j != "object")
        return null;
      var ee = r && j[r] || j[s];
      return typeof ee == "function" ? ee : null;
    }
    var d = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function m(j) {
      {
        for (var ee = arguments.length, se = new Array(ee > 1 ? ee - 1 : 0), I = 1; I < ee; I++)
          se[I - 1] = arguments[I];
        y("error", j, se);
      }
    }
    function y(j, ee, se) {
      {
        var I = d.ReactDebugCurrentFrame, k = I.getStackAddendum();
        k !== "" && (ee += "%s", se = se.concat([k]));
        var L = se.map(function(U) {
          return String(U);
        });
        L.unshift("Warning: " + ee), Function.prototype.apply.call(console[j], console, L);
      }
    }
    var w = !1, _ = !1, S = !1, A = !1, P = !1, v;
    v = Symbol.for("react.module.reference");
    function R(j) {
      return !!(typeof j == "string" || typeof j == "function" || j === h || j === g || P || j === p || j === a || j === i || A || j === n || w || _ || S || typeof j == "object" && j !== null && (j.$$typeof === e || j.$$typeof === t || j.$$typeof === o || j.$$typeof === c || j.$$typeof === f || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      j.$$typeof === v || j.getModuleId !== void 0));
    }
    function B(j, ee, se) {
      var I = j.displayName;
      if (I)
        return I;
      var k = ee.displayName || ee.name || "";
      return k !== "" ? se + "(" + k + ")" : se;
    }
    function q(j) {
      return j.displayName || "Context";
    }
    function D(j) {
      if (j == null)
        return null;
      if (typeof j.tag == "number" && m("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof j == "function")
        return j.displayName || j.name || null;
      if (typeof j == "string")
        return j;
      switch (j) {
        case h:
          return "Fragment";
        case b:
          return "Portal";
        case g:
          return "Profiler";
        case p:
          return "StrictMode";
        case a:
          return "Suspense";
        case i:
          return "SuspenseList";
      }
      if (typeof j == "object")
        switch (j.$$typeof) {
          case c:
            var ee = j;
            return q(ee) + ".Consumer";
          case o:
            var se = j;
            return q(se._context) + ".Provider";
          case f:
            return B(j, j.render, "ForwardRef");
          case t:
            var I = j.displayName || null;
            return I !== null ? I : D(j.type) || "Memo";
          case e: {
            var k = j, L = k._payload, U = k._init;
            try {
              return D(U(L));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var O = Object.assign, N = 0, E, M, Y, H, te, Z, ne;
    function ue() {
    }
    ue.__reactDisabledLog = !0;
    function ye() {
      {
        if (N === 0) {
          E = console.log, M = console.info, Y = console.warn, H = console.error, te = console.group, Z = console.groupCollapsed, ne = console.groupEnd;
          var j = {
            configurable: !0,
            enumerable: !0,
            value: ue,
            writable: !0
          };
          Object.defineProperties(console, {
            info: j,
            log: j,
            warn: j,
            error: j,
            group: j,
            groupCollapsed: j,
            groupEnd: j
          });
        }
        N++;
      }
    }
    function oe() {
      {
        if (N--, N === 0) {
          var j = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: O({}, j, {
              value: E
            }),
            info: O({}, j, {
              value: M
            }),
            warn: O({}, j, {
              value: Y
            }),
            error: O({}, j, {
              value: H
            }),
            group: O({}, j, {
              value: te
            }),
            groupCollapsed: O({}, j, {
              value: Z
            }),
            groupEnd: O({}, j, {
              value: ne
            })
          });
        }
        N < 0 && m("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var be = d.ReactCurrentDispatcher, me;
    function Re(j, ee, se) {
      {
        if (me === void 0)
          try {
            throw Error();
          } catch (k) {
            var I = k.stack.trim().match(/\n( *(at )?)/);
            me = I && I[1] || "";
          }
        return `
` + me + j;
      }
    }
    var Ve = !1, de;
    {
      var Ee = typeof WeakMap == "function" ? WeakMap : Map;
      de = new Ee();
    }
    function Ie(j, ee) {
      if (!j || Ve)
        return "";
      {
        var se = de.get(j);
        if (se !== void 0)
          return se;
      }
      var I;
      Ve = !0;
      var k = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var L;
      L = be.current, be.current = null, ye();
      try {
        if (ee) {
          var U = function() {
            throw Error();
          };
          if (Object.defineProperty(U.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(U, []);
            } catch (Ce) {
              I = Ce;
            }
            Reflect.construct(j, [], U);
          } else {
            try {
              U.call();
            } catch (Ce) {
              I = Ce;
            }
            j.call(U.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Ce) {
            I = Ce;
          }
          j();
        }
      } catch (Ce) {
        if (Ce && I && typeof Ce.stack == "string") {
          for (var z = Ce.stack.split(`
`), W = I.stack.split(`
`), Q = z.length - 1, ae = W.length - 1; Q >= 1 && ae >= 0 && z[Q] !== W[ae]; )
            ae--;
          for (; Q >= 1 && ae >= 0; Q--, ae--)
            if (z[Q] !== W[ae]) {
              if (Q !== 1 || ae !== 1)
                do
                  if (Q--, ae--, ae < 0 || z[Q] !== W[ae]) {
                    var ie = `
` + z[Q].replace(" at new ", " at ");
                    return j.displayName && ie.includes("<anonymous>") && (ie = ie.replace("<anonymous>", j.displayName)), typeof j == "function" && de.set(j, ie), ie;
                  }
                while (Q >= 1 && ae >= 0);
              break;
            }
        }
      } finally {
        Ve = !1, be.current = L, oe(), Error.prepareStackTrace = k;
      }
      var he = j ? j.displayName || j.name : "", Oe = he ? Re(he) : "";
      return typeof j == "function" && de.set(j, Oe), Oe;
    }
    function $e(j, ee, se) {
      return Ie(j, !1);
    }
    function Fe(j) {
      var ee = j.prototype;
      return !!(ee && ee.isReactComponent);
    }
    function Be(j, ee, se) {
      if (j == null)
        return "";
      if (typeof j == "function")
        return Ie(j, Fe(j));
      if (typeof j == "string")
        return Re(j);
      switch (j) {
        case a:
          return Re("Suspense");
        case i:
          return Re("SuspenseList");
      }
      if (typeof j == "object")
        switch (j.$$typeof) {
          case f:
            return $e(j.render);
          case t:
            return Be(j.type, ee, se);
          case e: {
            var I = j, k = I._payload, L = I._init;
            try {
              return Be(L(k), ee, se);
            } catch {
            }
          }
        }
      return "";
    }
    var ze = Object.prototype.hasOwnProperty, qe = {}, Je = d.ReactDebugCurrentFrame;
    function He(j) {
      if (j) {
        var ee = j._owner, se = Be(j.type, j._source, ee ? ee.type : null);
        Je.setExtraStackFrame(se);
      } else
        Je.setExtraStackFrame(null);
    }
    function Ye(j, ee, se, I, k) {
      {
        var L = Function.call.bind(ze);
        for (var U in j)
          if (L(j, U)) {
            var z = void 0;
            try {
              if (typeof j[U] != "function") {
                var W = Error((I || "React class") + ": " + se + " type `" + U + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof j[U] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw W.name = "Invariant Violation", W;
              }
              z = j[U](ee, U, I, se, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Q) {
              z = Q;
            }
            z && !(z instanceof Error) && (He(k), m("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", I || "React class", se, U, typeof z), He(null)), z instanceof Error && !(z.message in qe) && (qe[z.message] = !0, He(k), m("Failed %s type: %s", se, z.message), He(null));
          }
      }
    }
    var We = Array.isArray;
    function ke(j) {
      return We(j);
    }
    function Ge(j) {
      {
        var ee = typeof Symbol == "function" && Symbol.toStringTag, se = ee && j[Symbol.toStringTag] || j.constructor.name || "Object";
        return se;
      }
    }
    function Qe(j) {
      try {
        return _e(j), !1;
      } catch {
        return !0;
      }
    }
    function _e(j) {
      return "" + j;
    }
    function pt(j) {
      if (Qe(j))
        return m("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Ge(j)), _e(j);
    }
    var st = d.ReactCurrentOwner, At = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, et, ut;
    function ht(j) {
      if (ze.call(j, "ref")) {
        var ee = Object.getOwnPropertyDescriptor(j, "ref").get;
        if (ee && ee.isReactWarning)
          return !1;
      }
      return j.ref !== void 0;
    }
    function Ue(j) {
      if (ze.call(j, "key")) {
        var ee = Object.getOwnPropertyDescriptor(j, "key").get;
        if (ee && ee.isReactWarning)
          return !1;
      }
      return j.key !== void 0;
    }
    function ct(j, ee) {
      typeof j.ref == "string" && st.current;
    }
    function le(j, ee) {
      {
        var se = function() {
          et || (et = !0, m("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ee));
        };
        se.isReactWarning = !0, Object.defineProperty(j, "key", {
          get: se,
          configurable: !0
        });
      }
    }
    function it(j, ee) {
      {
        var se = function() {
          ut || (ut = !0, m("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ee));
        };
        se.isReactWarning = !0, Object.defineProperty(j, "ref", {
          get: se,
          configurable: !0
        });
      }
    }
    var Et = function(j, ee, se, I, k, L, U) {
      var z = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: u,
        // Built-in properties that belong on the element
        type: j,
        key: ee,
        ref: se,
        props: U,
        // Record the component responsible for creating this element.
        _owner: L
      };
      return z._store = {}, Object.defineProperty(z._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(z, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: I
      }), Object.defineProperty(z, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: k
      }), Object.freeze && (Object.freeze(z.props), Object.freeze(z)), z;
    };
    function It(j, ee, se, I, k) {
      {
        var L, U = {}, z = null, W = null;
        se !== void 0 && (pt(se), z = "" + se), Ue(ee) && (pt(ee.key), z = "" + ee.key), ht(ee) && (W = ee.ref, ct(ee, k));
        for (L in ee)
          ze.call(ee, L) && !At.hasOwnProperty(L) && (U[L] = ee[L]);
        if (j && j.defaultProps) {
          var Q = j.defaultProps;
          for (L in Q)
            U[L] === void 0 && (U[L] = Q[L]);
        }
        if (z || W) {
          var ae = typeof j == "function" ? j.displayName || j.name || "Unknown" : j;
          z && le(U, ae), W && it(U, ae);
        }
        return Et(j, z, W, k, I, st.current, U);
      }
    }
    var Ze = d.ReactCurrentOwner, Pe = d.ReactDebugCurrentFrame;
    function Xe(j) {
      if (j) {
        var ee = j._owner, se = Be(j.type, j._source, ee ? ee.type : null);
        Pe.setExtraStackFrame(se);
      } else
        Pe.setExtraStackFrame(null);
    }
    var lt;
    lt = !1;
    function rt(j) {
      return typeof j == "object" && j !== null && j.$$typeof === u;
    }
    function ge() {
      {
        if (Ze.current) {
          var j = D(Ze.current.type);
          if (j)
            return `

Check the render method of \`` + j + "`.";
        }
        return "";
      }
    }
    function fe(j) {
      return "";
    }
    var pe = {};
    function yt(j) {
      {
        var ee = ge();
        if (!ee) {
          var se = typeof j == "string" ? j : j.displayName || j.name;
          se && (ee = `

Check the top-level render call using <` + se + ">.");
        }
        return ee;
      }
    }
    function ot(j, ee) {
      {
        if (!j._store || j._store.validated || j.key != null)
          return;
        j._store.validated = !0;
        var se = yt(ee);
        if (pe[se])
          return;
        pe[se] = !0;
        var I = "";
        j && j._owner && j._owner !== Ze.current && (I = " It was passed a child from " + D(j._owner.type) + "."), Xe(j), m('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', se, I), Xe(null);
      }
    }
    function gt(j, ee) {
      {
        if (typeof j != "object")
          return;
        if (ke(j))
          for (var se = 0; se < j.length; se++) {
            var I = j[se];
            rt(I) && ot(I, ee);
          }
        else if (rt(j))
          j._store && (j._store.validated = !0);
        else if (j) {
          var k = l(j);
          if (typeof k == "function" && k !== j.entries)
            for (var L = k.call(j), U; !(U = L.next()).done; )
              rt(U.value) && ot(U.value, ee);
        }
      }
    }
    function _t(j) {
      {
        var ee = j.type;
        if (ee == null || typeof ee == "string")
          return;
        var se;
        if (typeof ee == "function")
          se = ee.propTypes;
        else if (typeof ee == "object" && (ee.$$typeof === f || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ee.$$typeof === t))
          se = ee.propTypes;
        else
          return;
        if (se) {
          var I = D(ee);
          Ye(se, j.props, "prop", I, j);
        } else if (ee.PropTypes !== void 0 && !lt) {
          lt = !0;
          var k = D(ee);
          m("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", k || "Unknown");
        }
        typeof ee.getDefaultProps == "function" && !ee.getDefaultProps.isReactClassApproved && m("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function wt(j) {
      {
        for (var ee = Object.keys(j.props), se = 0; se < ee.length; se++) {
          var I = ee[se];
          if (I !== "children" && I !== "key") {
            Xe(j), m("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", I), Xe(null);
            break;
          }
        }
        j.ref !== null && (Xe(j), m("Invalid attribute `ref` supplied to `React.Fragment`."), Xe(null));
      }
    }
    var mt = {};
    function bt(j, ee, se, I, k, L) {
      {
        var U = R(j);
        if (!U) {
          var z = "";
          (j === void 0 || typeof j == "object" && j !== null && Object.keys(j).length === 0) && (z += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var W = fe();
          W ? z += W : z += ge();
          var Q;
          j === null ? Q = "null" : ke(j) ? Q = "array" : j !== void 0 && j.$$typeof === u ? (Q = "<" + (D(j.type) || "Unknown") + " />", z = " Did you accidentally export a JSX literal instead of a component?") : Q = typeof j, m("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Q, z);
        }
        var ae = It(j, ee, se, k, L);
        if (ae == null)
          return ae;
        if (U) {
          var ie = ee.children;
          if (ie !== void 0)
            if (I)
              if (ke(ie)) {
                for (var he = 0; he < ie.length; he++)
                  gt(ie[he], j);
                Object.freeze && Object.freeze(ie);
              } else
                m("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              gt(ie, j);
        }
        if (ze.call(ee, "key")) {
          var Oe = D(j), Ce = Object.keys(ee).filter(function(xe) {
            return xe !== "key";
          }), Ne = Ce.length > 0 ? "{key: someKey, " + Ce.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!mt[Oe + Ne]) {
            var X = Ce.length > 0 ? "{" + Ce.join(": ..., ") + ": ...}" : "{}";
            m(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Ne, Oe, X, Oe), mt[Oe + Ne] = !0;
          }
        }
        return j === h ? wt(ae) : _t(ae), ae;
      }
    }
    function vt(j, ee, se) {
      return bt(j, ee, se, !0);
    }
    function xt(j, ee, se) {
      return bt(j, ee, se, !1);
    }
    var Tt = xt, St = vt;
    reactJsxRuntime_development.Fragment = h, reactJsxRuntime_development.jsx = Tt, reactJsxRuntime_development.jsxs = St;
  }()), reactJsxRuntime_development;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  return hasRequiredJsxRuntime || (hasRequiredJsxRuntime = 1, process.env.NODE_ENV === "production" ? jsxRuntime.exports = requireReactJsxRuntime_production_min() : jsxRuntime.exports = requireReactJsxRuntime_development()), jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime(), meyda_min$1 = { exports: {} }, meyda_min = meyda_min$1.exports, hasRequiredMeyda_min;
function requireMeyda_min() {
  return hasRequiredMeyda_min || (hasRequiredMeyda_min = 1, function(C, u) {
    (function(b, h) {
      C.exports = h();
    })(meyda_min, function() {
      function b(D, O, N) {
        for (var E, M = 0, Y = O.length; M < Y; M++) !E && M in O || (E || (E = Array.prototype.slice.call(O, 0, M)), E[M] = O[M]);
        return D.concat(E || Array.prototype.slice.call(O));
      }
      var h = Object.freeze({ __proto__: null, blackman: function(D) {
        for (var O = new Float32Array(D), N = 2 * Math.PI / (D - 1), E = 2 * N, M = 0; M < D / 2; M++) O[M] = 0.42 - 0.5 * Math.cos(M * N) + 0.08 * Math.cos(M * E);
        for (M = Math.ceil(D / 2); M > 0; M--) O[D - M] = O[M - 1];
        return O;
      }, hamming: function(D) {
        for (var O = new Float32Array(D), N = 0; N < D; N++) O[N] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (N / D - 1));
        return O;
      }, hanning: function(D) {
        for (var O = new Float32Array(D), N = 0; N < D; N++) O[N] = 0.5 - 0.5 * Math.cos(2 * Math.PI * N / (D - 1));
        return O;
      }, sine: function(D) {
        for (var O = Math.PI / (D - 1), N = new Float32Array(D), E = 0; E < D; E++) N[E] = Math.sin(O * E);
        return N;
      } }), p = {};
      function g(D) {
        for (; D % 2 == 0 && D > 1; ) D /= 2;
        return D === 1;
      }
      function o(D, O) {
        if (O !== "rect") {
          if (O !== "" && O || (O = "hanning"), p[O] || (p[O] = {}), !p[O][D.length]) try {
            p[O][D.length] = h[O](D.length);
          } catch {
            throw new Error("Invalid windowing function");
          }
          D = function(N, E) {
            for (var M = [], Y = 0; Y < Math.min(N.length, E.length); Y++) M[Y] = N[Y] * E[Y];
            return M;
          }(D, p[O][D.length]);
        }
        return D;
      }
      function c(D, O, N) {
        for (var E = new Float32Array(D), M = 0; M < E.length; M++) E[M] = M * O / N, E[M] = 13 * Math.atan(E[M] / 1315.8) + 3.5 * Math.atan(Math.pow(E[M] / 7518, 2));
        return E;
      }
      function f(D) {
        return Float32Array.from(D);
      }
      function a(D) {
        return 1125 * Math.log(1 + D / 700);
      }
      function i(D, O, N) {
        for (var E, M = new Float32Array(D + 2), Y = new Float32Array(D + 2), H = O / 2, te = a(0), Z = (a(H) - te) / (D + 1), ne = new Array(D + 2), ue = 0; ue < M.length; ue++) M[ue] = ue * Z, Y[ue] = (E = M[ue], 700 * (Math.exp(E / 1125) - 1)), ne[ue] = Math.floor((N + 1) * Y[ue] / O);
        for (var ye = new Array(D), oe = 0; oe < ye.length; oe++) {
          for (ye[oe] = new Array(N / 2 + 1).fill(0), ue = ne[oe]; ue < ne[oe + 1]; ue++) ye[oe][ue] = (ue - ne[oe]) / (ne[oe + 1] - ne[oe]);
          for (ue = ne[oe + 1]; ue < ne[oe + 2]; ue++) ye[oe][ue] = (ne[oe + 2] - ue) / (ne[oe + 2] - ne[oe + 1]);
        }
        return ye;
      }
      function t(D, O, N, E, M, Y, H) {
        E === void 0 && (E = 5), M === void 0 && (M = 2), Y === void 0 && (Y = !0), H === void 0 && (H = 440);
        var te = Math.floor(N / 2) + 1, Z = new Array(N).fill(0).map(function(de, Ee) {
          return D * function(Ie, $e) {
            return Math.log2(16 * Ie / $e);
          }(O * Ee / N, H);
        });
        Z[0] = Z[1] - 1.5 * D;
        var ne, ue, ye, oe = Z.slice(1).map(function(de, Ee) {
          return Math.max(de - Z[Ee]);
        }, 1).concat([1]), be = Math.round(D / 2), me = new Array(D).fill(0).map(function(de, Ee) {
          return Z.map(function(Ie) {
            return (10 * D + be + Ie - Ee) % D - be;
          });
        }), Re = me.map(function(de, Ee) {
          return de.map(function(Ie, $e) {
            return Math.exp(-0.5 * Math.pow(2 * me[Ee][$e] / oe[$e], 2));
          });
        });
        if (ue = (ne = Re)[0].map(function() {
          return 0;
        }), ye = ne.reduce(function(de, Ee) {
          return Ee.forEach(function(Ie, $e) {
            de[$e] += Math.pow(Ie, 2);
          }), de;
        }, ue).map(Math.sqrt), Re = ne.map(function(de, Ee) {
          return de.map(function(Ie, $e) {
            return Ie / (ye[$e] || 1);
          });
        }), M) {
          var Ve = Z.map(function(de) {
            return Math.exp(-0.5 * Math.pow((de / D - E) / M, 2));
          });
          Re = Re.map(function(de) {
            return de.map(function(Ee, Ie) {
              return Ee * Ve[Ie];
            });
          });
        }
        return Y && (Re = b(b([], Re.slice(3), !0), Re.slice(0, 3))), Re.map(function(de) {
          return de.slice(0, te);
        });
      }
      function e(D, O) {
        for (var N = 0, E = 0, M = 0; M < O.length; M++) N += Math.pow(M, D) * Math.abs(O[M]), E += O[M];
        return N / E;
      }
      function n(D) {
        var O = D.ampSpectrum, N = D.barkScale, E = D.numberOfBarkBands, M = E === void 0 ? 24 : E;
        if (typeof O != "object" || typeof N != "object") throw new TypeError();
        var Y = M, H = new Float32Array(Y), te = 0, Z = O, ne = new Int32Array(Y + 1);
        ne[0] = 0;
        for (var ue = N[Z.length - 1] / Y, ye = 1, oe = 0; oe < Z.length; oe++) for (; N[oe] > ue; ) ne[ye++] = oe, ue = ye * N[Z.length - 1] / Y;
        for (ne[Y] = Z.length - 1, oe = 0; oe < Y; oe++) {
          for (var be = 0, me = ne[oe]; me < ne[oe + 1]; me++) be += Z[me];
          H[oe] = Math.pow(be, 0.23);
        }
        for (oe = 0; oe < H.length; oe++) te += H[oe];
        return { specific: H, total: te };
      }
      function r(D) {
        var O = D.ampSpectrum;
        if (typeof O != "object") throw new TypeError();
        for (var N = new Float32Array(O.length), E = 0; E < N.length; E++) N[E] = Math.pow(O[E], 2);
        return N;
      }
      function s(D) {
        var O = D.ampSpectrum, N = D.melFilterBank, E = D.bufferSize;
        if (typeof O != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
        if (typeof N != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
        for (var M = r({ ampSpectrum: O }), Y = N.length, H = Array(Y), te = new Float32Array(Y), Z = 0; Z < te.length; Z++) {
          H[Z] = new Float32Array(E / 2), te[Z] = 0;
          for (var ne = 0; ne < E / 2; ne++) H[Z][ne] = N[Z][ne] * M[ne], te[Z] += H[Z][ne];
          te[Z] = Math.log(te[Z] + 1);
        }
        return Array.prototype.slice.call(te);
      }
      function l(D) {
        return D.__esModule && Object.prototype.hasOwnProperty.call(D, "default") ? D.default : D;
      }
      var d = null, m = l(function(D, O) {
        var N = D.length;
        return O = O || 2, d && d[N] || function(E) {
          (d = d || {})[E] = new Array(E * E);
          for (var M = Math.PI / E, Y = 0; Y < E; Y++) for (var H = 0; H < E; H++) d[E][H + Y * E] = Math.cos(M * (H + 0.5) * Y);
        }(N), D.map(function() {
          return 0;
        }).map(function(E, M) {
          return O * D.reduce(function(Y, H, te, Z) {
            return Y + H * d[N][te + M * N];
          }, 0);
        });
      }), y = Object.freeze({ __proto__: null, amplitudeSpectrum: function(D) {
        return D.ampSpectrum;
      }, buffer: function(D) {
        return D.signal;
      }, chroma: function(D) {
        var O = D.ampSpectrum, N = D.chromaFilterBank;
        if (typeof O != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
        if (typeof N != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
        var E = N.map(function(Y, H) {
          return O.reduce(function(te, Z, ne) {
            return te + Z * Y[ne];
          }, 0);
        }), M = Math.max.apply(Math, E);
        return M ? E.map(function(Y) {
          return Y / M;
        }) : E;
      }, complexSpectrum: function(D) {
        return D.complexSpectrum;
      }, energy: function(D) {
        var O = D.signal;
        if (typeof O != "object") throw new TypeError();
        for (var N = 0, E = 0; E < O.length; E++) N += Math.pow(Math.abs(O[E]), 2);
        return N;
      }, loudness: n, melBands: s, mfcc: function(D) {
        var O = D.ampSpectrum, N = D.melFilterBank, E = D.numberOfMFCCCoefficients, M = D.bufferSize, Y = Math.min(40, Math.max(1, E || 13));
        if (N.length < Y) throw new Error("Insufficient filter bank for requested number of coefficients");
        var H = s({ ampSpectrum: O, melFilterBank: N, bufferSize: M });
        return m(H).slice(0, Y);
      }, perceptualSharpness: function(D) {
        for (var O = n({ ampSpectrum: D.ampSpectrum, barkScale: D.barkScale }), N = O.specific, E = 0, M = 0; M < N.length; M++) E += M < 15 ? (M + 1) * N[M + 1] : 0.066 * Math.exp(0.171 * (M + 1));
        return E *= 0.11 / O.total;
      }, perceptualSpread: function(D) {
        for (var O = n({ ampSpectrum: D.ampSpectrum, barkScale: D.barkScale }), N = 0, E = 0; E < O.specific.length; E++) O.specific[E] > N && (N = O.specific[E]);
        return Math.pow((O.total - N) / O.total, 2);
      }, powerSpectrum: r, rms: function(D) {
        var O = D.signal;
        if (typeof O != "object") throw new TypeError();
        for (var N = 0, E = 0; E < O.length; E++) N += Math.pow(O[E], 2);
        return N /= O.length, N = Math.sqrt(N);
      }, spectralCentroid: function(D) {
        var O = D.ampSpectrum;
        if (typeof O != "object") throw new TypeError();
        return e(1, O);
      }, spectralCrest: function(D) {
        var O = D.ampSpectrum;
        if (typeof O != "object") throw new TypeError();
        var N = 0, E = -1 / 0;
        return O.forEach(function(M) {
          N += Math.pow(M, 2), E = M > E ? M : E;
        }), N /= O.length, N = Math.sqrt(N), E / N;
      }, spectralFlatness: function(D) {
        var O = D.ampSpectrum;
        if (typeof O != "object") throw new TypeError();
        for (var N = 0, E = 0, M = 0; M < O.length; M++) N += Math.log(O[M]), E += O[M];
        return Math.exp(N / O.length) * O.length / E;
      }, spectralFlux: function(D) {
        var O = D.signal, N = D.previousSignal, E = D.bufferSize;
        if (typeof O != "object" || typeof N != "object") throw new TypeError();
        for (var M = 0, Y = -E / 2; Y < O.length / 2 - 1; Y++) x = Math.abs(O[Y]) - Math.abs(N[Y]), M += (x + Math.abs(x)) / 2;
        return M;
      }, spectralKurtosis: function(D) {
        var O = D.ampSpectrum;
        if (typeof O != "object") throw new TypeError();
        var N = O, E = e(1, N), M = e(2, N), Y = e(3, N), H = e(4, N);
        return (-3 * Math.pow(E, 4) + 6 * E * M - 4 * E * Y + H) / Math.pow(Math.sqrt(M - Math.pow(E, 2)), 4);
      }, spectralRolloff: function(D) {
        var O = D.ampSpectrum, N = D.sampleRate;
        if (typeof O != "object") throw new TypeError();
        for (var E = O, M = N / (2 * (E.length - 1)), Y = 0, H = 0; H < E.length; H++) Y += E[H];
        for (var te = 0.99 * Y, Z = E.length - 1; Y > te && Z >= 0; ) Y -= E[Z], --Z;
        return (Z + 1) * M;
      }, spectralSkewness: function(D) {
        var O = D.ampSpectrum;
        if (typeof O != "object") throw new TypeError();
        var N = e(1, O), E = e(2, O), M = e(3, O);
        return (2 * Math.pow(N, 3) - 3 * N * E + M) / Math.pow(Math.sqrt(E - Math.pow(N, 2)), 3);
      }, spectralSlope: function(D) {
        var O = D.ampSpectrum, N = D.sampleRate, E = D.bufferSize;
        if (typeof O != "object") throw new TypeError();
        for (var M = 0, Y = 0, H = new Float32Array(O.length), te = 0, Z = 0, ne = 0; ne < O.length; ne++) {
          M += O[ne];
          var ue = ne * N / E;
          H[ne] = ue, te += ue * ue, Y += ue, Z += ue * O[ne];
        }
        return (O.length * Z - Y * M) / (M * (te - Math.pow(Y, 2)));
      }, spectralSpread: function(D) {
        var O = D.ampSpectrum;
        if (typeof O != "object") throw new TypeError();
        return Math.sqrt(e(2, O) - Math.pow(e(1, O), 2));
      }, zcr: function(D) {
        var O = D.signal;
        if (typeof O != "object") throw new TypeError();
        for (var N = 0, E = 1; E < O.length; E++) (O[E - 1] >= 0 && O[E] < 0 || O[E - 1] < 0 && O[E] >= 0) && N++;
        return N;
      } });
      function w(D) {
        if (Array.isArray(D)) {
          for (var O = 0, N = Array(D.length); O < D.length; O++) N[O] = D[O];
          return N;
        }
        return Array.from(D);
      }
      var _ = {}, S = {}, A = { bitReverseArray: function(D) {
        if (_[D] === void 0) {
          for (var O = (D - 1).toString(2).length, N = "0".repeat(O), E = {}, M = 0; M < D; M++) {
            var Y = M.toString(2);
            Y = N.substr(Y.length) + Y, Y = [].concat(w(Y)).reverse().join(""), E[M] = parseInt(Y, 2);
          }
          _[D] = E;
        }
        return _[D];
      }, multiply: function(D, O) {
        return { real: D.real * O.real - D.imag * O.imag, imag: D.real * O.imag + D.imag * O.real };
      }, add: function(D, O) {
        return { real: D.real + O.real, imag: D.imag + O.imag };
      }, subtract: function(D, O) {
        return { real: D.real - O.real, imag: D.imag - O.imag };
      }, euler: function(D, O) {
        var N = -2 * Math.PI * D / O;
        return { real: Math.cos(N), imag: Math.sin(N) };
      }, conj: function(D) {
        return D.imag *= -1, D;
      }, constructComplexArray: function(D) {
        var O = {};
        O.real = D.real === void 0 ? D.slice() : D.real.slice();
        var N = O.real.length;
        return S[N] === void 0 && (S[N] = Array.apply(null, Array(N)).map(Number.prototype.valueOf, 0)), O.imag = S[N].slice(), O;
      } }, P = function(D) {
        var O = {};
        D.real === void 0 || D.imag === void 0 ? O = A.constructComplexArray(D) : (O.real = D.real.slice(), O.imag = D.imag.slice());
        var N = O.real.length, E = Math.log2(N);
        if (Math.round(E) != E) throw new Error("Input size must be a power of 2.");
        if (O.real.length != O.imag.length) throw new Error("Real and imaginary components must have the same length.");
        for (var M = A.bitReverseArray(N), Y = { real: [], imag: [] }, H = 0; H < N; H++) Y.real[M[H]] = O.real[H], Y.imag[M[H]] = O.imag[H];
        for (var te = 0; te < N; te++) O.real[te] = Y.real[te], O.imag[te] = Y.imag[te];
        for (var Z = 1; Z <= E; Z++) for (var ne = Math.pow(2, Z), ue = 0; ue < ne / 2; ue++) for (var ye = A.euler(ue, ne), oe = 0; oe < N / ne; oe++) {
          var be = ne * oe + ue, me = ne * oe + ue + ne / 2, Re = { real: O.real[be], imag: O.imag[be] }, Ve = { real: O.real[me], imag: O.imag[me] }, de = A.multiply(ye, Ve), Ee = A.subtract(Re, de);
          O.real[me] = Ee.real, O.imag[me] = Ee.imag;
          var Ie = A.add(de, Re);
          O.real[be] = Ie.real, O.imag[be] = Ie.imag;
        }
        return O;
      }, v = P, R = function() {
        function D(O, N) {
          var E = this;
          if (this._m = N, !O.audioContext) throw this._m.errors.noAC;
          if (O.bufferSize && !g(O.bufferSize)) throw this._m._errors.notPow2;
          if (!O.source) throw this._m._errors.noSource;
          this._m.audioContext = O.audioContext, this._m.bufferSize = O.bufferSize || this._m.bufferSize || 256, this._m.hopSize = O.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = O.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = O.callback, this._m.windowingFunction = O.windowingFunction || "hanning", this._m.featureExtractors = y, this._m.EXTRACTION_STARTED = O.startImmediately || !1, this._m.channel = typeof O.channel == "number" ? O.channel : 0, this._m.inputs = O.inputs || 1, this._m.outputs = O.outputs || 1, this._m.numberOfMFCCCoefficients = O.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = O.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = O.featureExtractors || [], this._m.barkScale = c(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = i(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(O.source), this._m.spn.onaudioprocess = function(M) {
            var Y;
            E._m.inputData !== null && (E._m.previousInputData = E._m.inputData), E._m.inputData = M.inputBuffer.getChannelData(E._m.channel), E._m.previousInputData ? ((Y = new Float32Array(E._m.previousInputData.length + E._m.inputData.length - E._m.hopSize)).set(E._m.previousInputData.slice(E._m.hopSize)), Y.set(E._m.inputData, E._m.previousInputData.length - E._m.hopSize)) : Y = E._m.inputData;
            var H = function(te, Z, ne) {
              if (te.length < Z) throw new Error("Buffer is too short for frame length");
              if (ne < 1) throw new Error("Hop length cannot be less that 1");
              if (Z < 1) throw new Error("Frame length cannot be less that 1");
              var ue = 1 + Math.floor((te.length - Z) / ne);
              return new Array(ue).fill(0).map(function(ye, oe) {
                return te.slice(oe * ne, oe * ne + Z);
              });
            }(Y, E._m.bufferSize, E._m.hopSize);
            H.forEach(function(te) {
              E._m.frame = te;
              var Z = E._m.extract(E._m._featuresToExtract, E._m.frame, E._m.previousFrame);
              typeof E._m.callback == "function" && E._m.EXTRACTION_STARTED && E._m.callback(Z), E._m.previousFrame = E._m.frame;
            });
          };
        }
        return D.prototype.start = function(O) {
          this._m._featuresToExtract = O || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
        }, D.prototype.stop = function() {
          this._m.EXTRACTION_STARTED = !1;
        }, D.prototype.setSource = function(O) {
          this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = O, this._m.source.connect(this._m.spn);
        }, D.prototype.setChannel = function(O) {
          O <= this._m.inputs ? this._m.channel = O : console.error("Channel ".concat(O, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(O, " when instantiating the MeydaAnalyzer"));
        }, D.prototype.get = function(O) {
          return this._m.inputData ? this._m.extract(O || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
        }, D;
      }(), B = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: y, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: o, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(D) {
        return new R(D, Object.assign({}, B));
      }, listAvailableFeatureExtractors: function() {
        return Object.keys(this.featureExtractors);
      }, extract: function(D, O, N) {
        var E = this;
        if (!O) throw this._errors.invalidInput;
        if (typeof O != "object") throw this._errors.invalidInput;
        if (!D) throw this._errors.featureUndef;
        if (!g(O.length)) throw this._errors.notPow2;
        this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = c(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = i(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = t(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in O && O.buffer === void 0 ? this.signal = f(O) : this.signal = O;
        var M = q(O, this.windowingFunction, this.bufferSize);
        if (this.signal = M.windowedSignal, this.complexSpectrum = M.complexSpectrum, this.ampSpectrum = M.ampSpectrum, N) {
          var Y = q(N, this.windowingFunction, this.bufferSize);
          this.previousSignal = Y.windowedSignal, this.previousComplexSpectrum = Y.complexSpectrum, this.previousAmpSpectrum = Y.ampSpectrum;
        }
        var H = function(te) {
          return E.featureExtractors[te]({ ampSpectrum: E.ampSpectrum, chromaFilterBank: E.chromaFilterBank, complexSpectrum: E.complexSpectrum, signal: E.signal, bufferSize: E.bufferSize, sampleRate: E.sampleRate, barkScale: E.barkScale, melFilterBank: E.melFilterBank, previousSignal: E.previousSignal, previousAmpSpectrum: E.previousAmpSpectrum, previousComplexSpectrum: E.previousComplexSpectrum, numberOfMFCCCoefficients: E.numberOfMFCCCoefficients, numberOfBarkBands: E.numberOfBarkBands });
        };
        if (typeof D == "object") return D.reduce(function(te, Z) {
          var ne;
          return Object.assign({}, te, ((ne = {})[Z] = H(Z), ne));
        }, {});
        if (typeof D == "string") return H(D);
        throw this._errors.invalidFeatureFmt;
      } }, q = function(D, O, N) {
        var E = {};
        D.buffer === void 0 ? E.signal = f(D) : E.signal = D, E.windowedSignal = o(E.signal, O), E.complexSpectrum = v(E.windowedSignal), E.ampSpectrum = new Float32Array(N / 2);
        for (var M = 0; M < N / 2; M++) E.ampSpectrum[M] = Math.sqrt(Math.pow(E.complexSpectrum.real[M], 2) + Math.pow(E.complexSpectrum.imag[M], 2));
        return E;
      };
      return typeof window < "u" && (window.Meyda = B), B;
    });
  }(meyda_min$1)), meyda_min$1.exports;
}
var meyda_minExports = requireMeyda_min();
const Meyda = /* @__PURE__ */ getDefaultExportFromCjs(meyda_minExports), initMeyda = (C, u) => {
  const b = Meyda.createMeydaAnalyzer({
    audioContext: C.context,
    source: C,
    bufferSize: 512,
    featureExtractors: [
      "mfcc",
      "rms",
      "spectralCentroid",
      "spectralFlatness",
      "energy"
    ],
    // callback,
    callback: (h) => {
      const p = calculatePhonemeLevels(h);
      u(p);
    }
  });
  return b.start(), console.log("Meyda initialized"), b;
};
function calculatePhonemeLevels(C) {
  const { mfcc: u, rms: b, spectralCentroid: h } = C;
  return {
    AA: b && u ? Math.min(b * (u[0] || 0), 1) : 0,
    // Broad mouth opening
    EE: u ? Math.min(u[5] || 0, 1) : 0,
    // High frequency for EE
    IH: u ? Math.min(u[3] || 0, 1) : 0,
    // Mid-range frequency for IH
    OH: u ? Math.min(u[2] || 0, 1) : 0,
    // Lower mid-range for OH
    OU: u ? Math.min((u[0] + u[5]) / 2, 1) : 0,
    // Combination for OU
    W: h && h > 1500 ? 1 : 0,
    // W (rounded)
    UW: h && h > 1e3 ? 1 : 0,
    // UW
    TH: h && h > 2e3 ? 1 : 0,
    // TH
    T: h && h > 2500 ? 1 : 0,
    // T
    SH: h && h > 5e3 ? 1 : 0,
    // SH
    S: h && h > 4e3 ? 1 : 0,
    // S
    OW: u ? Math.min((u[0] + u[5]) / 2, 1) : 0,
    // OW
    M: b && u ? Math.min(b * (u[0] || 0), 1) : 0,
    // M (nasal)
    L: u ? Math.min(u[2] || 0, 1) : 0,
    // L (liquid sound)
    K: h && h > 3e3 ? 1 : 0,
    // K
    IY: u ? Math.min(u[4] || 0, 1) : 0,
    // IY
    F: h && h > 6e3 ? 1 : 0,
    // F
    ER: u ? Math.min(u[1] || 0, 1) : 0,
    // ER
    EH: u ? Math.min(u[2] || 0, 1) : 0,
    // EH
    TONGUE_UP_DOWN: u ? Math.min(u[6] || 0, 1) : 0,
    // Placeholder for tongue movement
    TONGUE_IN_OUT: h && h > 1500 ? 1 : 0,
    // Placeholder
    MOUTH_WIDE_NARROW: b && b > 0.5 ? 1 : 0,
    // Placeholder for mouth wide/narrow
    MOUTH_OPEN: b && b > 0.3 ? 1 : 0
    // Placeholder for mouth open
  };
}
const LevelGraph = ({ name: C, value: u }) => {
  const b = useRef(null), [h, p] = useState(0), [g, o] = useState(1);
  return useEffect(() => {
    u && (u < h && p(u), u > g && o(u));
  }, [u, h, g]), useEffect(() => {
    const c = b.current;
    if (c) {
      const f = c.getContext("2d", { willReadFrequently: !0 });
      if (f) {
        const a = f.getImageData(
          1,
          0,
          c.width - 1,
          c.height
        );
        f.putImageData(a, 0, 0), f.clearRect(c.width - 1, 0, 1, c.height);
        const i = g - h || 1, t = (u - h) / i, e = c.height - t * c.height;
        f.lineWidth = 5, f.beginPath(), f.moveTo(c.width - 2, e), f.lineTo(c.width - 1, e), f.strokeStyle = "green", f.stroke();
      }
    }
  }, [u, h, g]), /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: C }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: b, width: 300, height: 100 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Min: ",
      h.toFixed(2),
      " | Max: ",
      g.toFixed(2),
      " | Current:",
      " ",
      u.toFixed(2)
    ] })
  ] });
}, PhonemeLevelsDisplay = ({
  analyserNode: C
}) => {
  const [u, b] = useState({});
  return useEffect(() => {
    if (!C)
      return;
    const h = initMeyda(C, (p) => {
      b(p);
    });
    return () => {
      h.stop();
    };
  }, [C]), /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: { border: "1px solid white", maxHeight: "80vh", overflow: "auto" },
      children: Object.entries(u).map(([h, p]) => /* @__PURE__ */ jsxRuntimeExports.jsx(LevelGraph, { name: h, value: p }, h))
    }
  );
};
export {
  PhonemeLevelsDisplay,
  Vads
};
