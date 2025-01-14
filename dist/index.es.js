import React, { useEffect, useRef, useState } from "react";
const getMicAudio = async (R) => {
  var f;
  const u = new AudioContext();
  u.state === "suspended" && (await u.resume(), console.log("Audio context resumed after user gesture."));
  const h = (await navigator.mediaDevices.enumerateDevices()).filter((s) => s.kind === "audioinput");
  console.log("Available microphones:", h);
  const p = R || ((f = h[0]) == null ? void 0 : f.deviceId);
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
    const R = await navigator.mediaDevices.getUserMedia({ audio: !0 }), u = new AudioContext(), b = u.createMediaStreamSource(R);
    return { audioContext: u, source: b, stream: R };
  } catch (R) {
    throw new Error("Unable to access microphone", { cause: R });
  }
}
function getDefaultExportFromCjs(R) {
  return R && R.__esModule && Object.prototype.hasOwnProperty.call(R, "default") ? R.default : R;
}
function getAugmentedNamespace(R) {
  if (R.__esModule) return R;
  var u = R.default;
  if (typeof u == "function") {
    var b = function h() {
      return this instanceof h ? Reflect.construct(u, arguments, this.constructor) : u.apply(this, arguments);
    };
    b.prototype = u.prototype;
  } else b = {};
  return Object.defineProperty(b, "__esModule", { value: !0 }), Object.keys(R).forEach(function(h) {
    var p = Object.getOwnPropertyDescriptor(R, h);
    Object.defineProperty(b, h, p.get ? p : {
      enumerable: !0,
      get: function() {
        return R[h];
      }
    });
  }), b;
}
var dist = {}, ortWeb_min = { exports: {} };
const backends = {}, backendsSortedByPriority = [], registerBackend = (R, u, b) => {
  if (u && typeof u.init == "function" && typeof u.createSessionHandler == "function") {
    const h = backends[R];
    if (h === void 0)
      backends[R] = { backend: u, priority: b };
    else {
      if (h.priority > b)
        return;
      if (h.priority === b && h.backend !== u)
        throw new Error(`cannot register backend "${R}" using priority ${b}`);
    }
    if (b >= 0) {
      const p = backendsSortedByPriority.indexOf(R);
      p !== -1 && backendsSortedByPriority.splice(p, 1);
      for (let g = 0; g < backendsSortedByPriority.length; g++)
        if (backends[backendsSortedByPriority[g]].priority <= b) {
          backendsSortedByPriority.splice(g, 0, R);
          return;
        }
      backendsSortedByPriority.push(R);
    }
    return;
  }
  throw new TypeError("not a valid backend");
}, resolveBackend = async (R) => {
  const u = R.length === 0 ? backendsSortedByPriority : R, b = [];
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
const calculateSize = (R) => {
  let u = 1;
  for (let b = 0; b < R.length; b++) {
    const h = R[b];
    if (typeof h != "number" || !Number.isSafeInteger(h))
      throw new TypeError(`dims[${b}] must be an integer, got: ${h}`);
    if (h < 0)
      throw new RangeError(`dims[${b}] must be a non-negative integer, got: ${h}`);
    u *= h;
  }
  return u;
};
let Tensor$1 = class pt {
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
    const f = b.bitmapFormat !== void 0 ? b.bitmapFormat : "RGBA", s = b.tensorFormat !== void 0 && b.tensorFormat !== void 0 ? b.tensorFormat : "RGB", i = h * p, t = s === "RGBA" ? new Float32Array(i * 4) : new Float32Array(i * 3);
    let e = 4, n = 0, r = 1, a = 2, l = 3, d = 0, m = i, y = i * 2, _ = -1;
    f === "RGB" && (e = 3, n = 0, r = 1, a = 2, l = -1), s === "RGBA" ? _ = i * 3 : s === "RBG" ? (d = 0, y = i, m = i * 2) : s === "BGR" && (y = 0, m = i, d = i * 2);
    for (let S = 0; S < i; S++, n += e, a += e, r += e, l += e)
      t[d++] = (u[n] + c) / o, t[m++] = (u[r] + c) / o, t[y++] = (u[a] + c) / o, _ !== -1 && l !== -1 && (t[_++] = (u[l] + c) / o);
    return s === "RGBA" ? new pt("float32", t, [1, 4, h, p]) : new pt("float32", t, [1, 3, h, p]);
  }
  static async fromImage(u, b) {
    const h = typeof HTMLImageElement < "u" && u instanceof HTMLImageElement, p = typeof ImageData < "u" && u instanceof ImageData, g = typeof ImageBitmap < "u" && u instanceof ImageBitmap, o = typeof String < "u" && (u instanceof String || typeof u == "string");
    let c, f = {};
    if (h) {
      const s = document.createElement("canvas"), i = s.getContext("2d");
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
        s.width = e, s.height = t, i.drawImage(u, 0, 0, e, t), c = i.getImageData(0, 0, e, t).data;
      } else
        throw new Error("Can not access image data");
    } else if (p) {
      const s = "RGBA";
      let i, t;
      if (b !== void 0 && b.resizedWidth !== void 0 && b.resizedHeight !== void 0 ? (i = b.resizedHeight, t = b.resizedWidth) : (i = u.height, t = u.width), b !== void 0) {
        if (f = b, b.bitmapFormat !== void 0 && b.bitmapFormat !== s)
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
      const s = document.createElement("canvas").getContext("2d");
      if (s != null) {
        const i = u.height, t = u.width;
        if (s.drawImage(u, 0, 0, t, i), c = s.getImageData(0, 0, t, i).data, b !== void 0) {
          if (b.height !== void 0 && b.height !== i)
            throw new Error("Image input config height doesn't match ImageBitmap height");
          if (f.height = i, b.width !== void 0 && b.width !== t)
            throw new Error("Image input config width doesn't match ImageBitmap width");
          f.width = t;
        } else
          f.height = i, f.width = t;
        return pt.bufferToTensor(c, f);
      } else
        throw new Error("Can not access image data");
    } else {
      if (o)
        return new Promise((s, i) => {
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
            s(pt.bufferToTensor(r.data, f));
          };
        });
      throw new Error("Input data provided is not supported - aborted tensor creation");
    }
    if (c !== void 0)
      return pt.bufferToTensor(c, f);
    throw new Error("Input data provided is not supported - aborted tensor creation");
  }
  toImageData(u) {
    var b, h;
    const p = document.createElement("canvas").getContext("2d");
    let g;
    if (p != null) {
      const o = this.dims[3], c = this.dims[2], f = this.dims[1], s = u !== void 0 && u.format !== void 0 ? u.format : "RGB", i = u !== void 0 && ((b = u.norm) === null || b === void 0 ? void 0 : b.mean) !== void 0 ? u.norm.mean : 255, t = u !== void 0 && ((h = u.norm) === null || h === void 0 ? void 0 : h.bias) !== void 0 ? u.norm.bias : 0, e = c * o;
      if (u !== void 0) {
        if (u.height !== void 0 && u.height !== c)
          throw new Error("Image output config height doesn't match tensor height");
        if (u.width !== void 0 && u.width !== o)
          throw new Error("Image output config width doesn't match tensor width");
        if (u.format !== void 0 && f === 4 && u.format !== "RGBA" || f === 3 && u.format !== "RGB" && u.format !== "BGR")
          throw new Error("Tensor format doesn't match input tensor dims");
      }
      const n = 4;
      let r = 0, a = 1, l = 2, d = 3, m = 0, y = e, _ = e * 2, v = -1;
      s === "RGBA" ? (m = 0, y = e, _ = e * 2, v = e * 3) : s === "RGB" ? (m = 0, y = e, _ = e * 2) : s === "RBG" && (m = 0, _ = e, y = e * 2), g = p.createImageData(o, c);
      for (let S = 0; S < c * o; r += n, a += n, l += n, d += n, S++)
        g.data[r] = (this.data[m++] - t) * i, g.data[a] = (this.data[y++] - t) * i, g.data[l] = (this.data[_++] - t) * i, g.data[d] = v === -1 ? 255 : (this.data[v++] - t) * i;
    } else
      throw new Error("Can not access image data");
    return g;
  }
  // #endregion
  // #region tensor utilities
  reshape(u) {
    return new pt(this.type, this.data, u);
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
        for (const s of b) {
          if (typeof s != "string")
            throw new TypeError("'fetches' must be a string array or an object.");
          if (this.outputNames.indexOf(s) === -1)
            throw new RangeError(`'fetches' contains invalid output name: ${s}.`);
          p[s] = null;
        }
        if (typeof h == "object" && h !== null)
          g = h;
        else if (typeof h < "u")
          throw new TypeError("'options' must be an object.");
      } else {
        let s = !1;
        const i = Object.getOwnPropertyNames(b);
        for (const t of this.outputNames)
          if (i.indexOf(t) !== -1) {
            const e = b[t];
            (e === null || e instanceof Tensor) && (s = !0, o = !1, p[t] = e);
          }
        if (s) {
          if (typeof h == "object" && h !== null)
            g = h;
          else if (typeof h < "u")
            throw new TypeError("'options' must be an object.");
        } else
          g = b;
      }
    } else if (typeof b < "u")
      throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
    for (const s of this.inputNames)
      if (typeof u[s] > "u")
        throw new Error(`input '${s}' is missing in 'feeds'.`);
    if (o)
      for (const s of this.outputNames)
        p[s] = null;
    const c = await this.handler.run(u, p, g), f = {};
    for (const s in c)
      Object.hasOwnProperty.call(c, s) && (f[s] = new Tensor(c[s].type, c[s].data, c[s].dims));
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
    (function(R, u) {
      module.exports = u(require$$0);
    })(self, (__WEBPACK_EXTERNAL_MODULE__1670__) => (() => {
      var __webpack_modules__ = { 3474: (R, u, b) => {
        var h, p = (h = (h = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0) || "/index.js", function(g) {
          function o() {
            return q.buffer != Z && De(q.buffer), ee;
          }
          function c() {
            return q.buffer != Z && De(q.buffer), se;
          }
          function f() {
            return q.buffer != Z && De(q.buffer), me;
          }
          function s() {
            return q.buffer != Z && De(q.buffer), ie;
          }
          function i() {
            return q.buffer != Z && De(q.buffer), _e;
          }
          var t, e, n;
          g = g || {}, t || (t = g !== void 0 ? g : {}), t.ready = new Promise(function(T, P) {
            e = T, n = P;
          });
          var r, a, l, d, m, y, _ = Object.assign({}, t), v = "./this.program", S = (T, P) => {
            throw P;
          }, O = typeof window == "object", I = typeof importScripts == "function", w = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", C = t.ENVIRONMENT_IS_PTHREAD || !1, V = "";
          function G(T) {
            return t.locateFile ? t.locateFile(T, V) : V + T;
          }
          if (w) {
            let T;
            V = I ? b(908).dirname(V) + "/" : "//", y = () => {
              m || (d = b(1384), m = b(908));
            }, r = function(P, k) {
              return y(), P = m.normalize(P), d.readFileSync(P, k ? void 0 : "utf8");
            }, l = (P) => ((P = r(P, !0)).buffer || (P = new Uint8Array(P)), P), a = (P, k, j) => {
              y(), P = m.normalize(P), d.readFile(P, function(z, Y) {
                z ? j(z) : k(Y.buffer);
              });
            }, 1 < process.argv.length && (v = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), process.on("uncaughtException", function(P) {
              if (!(P instanceof We)) throw P;
            }), process.on("unhandledRejection", function(P) {
              throw P;
            }), S = (P, k) => {
              if (Ke()) throw process.exitCode = P, k;
              k instanceof We || F("exiting due to exception: " + k), process.exit(P);
            }, t.inspect = function() {
              return "[Emscripten Module object]";
            };
            try {
              T = b(9925);
            } catch (P) {
              throw console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'), P;
            }
            b.g.Worker = T.Worker;
          } else (O || I) && (I ? V = self.location.href : typeof document < "u" && document.currentScript && (V = document.currentScript.src), h && (V = h), V = V.indexOf("blob:") !== 0 ? V.substr(0, V.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", w || (r = (T) => {
            var P = new XMLHttpRequest();
            return P.open("GET", T, !1), P.send(null), P.responseText;
          }, I && (l = (T) => {
            var P = new XMLHttpRequest();
            return P.open("GET", T, !1), P.responseType = "arraybuffer", P.send(null), new Uint8Array(P.response);
          }), a = (T, P, k) => {
            var j = new XMLHttpRequest();
            j.open("GET", T, !0), j.responseType = "arraybuffer", j.onload = () => {
              j.status == 200 || j.status == 0 && j.response ? P(j.response) : k();
            }, j.onerror = k, j.send(null);
          }));
          w && typeof performance > "u" && (b.g.performance = b(6953).performance);
          var D = console.log.bind(console), A = console.warn.bind(console);
          w && (y(), D = (T) => d.writeSync(1, T + `
`), A = (T) => d.writeSync(2, T + `
`));
          var M, E = t.print || D, F = t.printErr || A;
          Object.assign(t, _), _ = null, t.thisProgram && (v = t.thisProgram), t.quit && (S = t.quit), t.wasmBinary && (M = t.wasmBinary);
          var W = t.noExitRuntime || !1;
          typeof WebAssembly != "object" && le("no native wasm support detected");
          var q, Q, Z, ee, se, me, ie, _e, be = !1, Ce = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
          function ze(T, P, k) {
            var j = (P >>>= 0) + k;
            for (k = P; T[k] && !(k >= j); ) ++k;
            if (16 < k - P && T.buffer && Ce) return Ce.decode(T.buffer instanceof SharedArrayBuffer ? T.slice(P, k) : T.subarray(P, k));
            for (j = ""; P < k; ) {
              var z = T[P++];
              if (128 & z) {
                var Y = 63 & T[P++];
                if ((224 & z) == 192) j += String.fromCharCode((31 & z) << 6 | Y);
                else {
                  var re = 63 & T[P++];
                  65536 > (z = (240 & z) == 224 ? (15 & z) << 12 | Y << 6 | re : (7 & z) << 18 | Y << 12 | re << 6 | 63 & T[P++]) ? j += String.fromCharCode(z) : (z -= 65536, j += String.fromCharCode(55296 | z >> 10, 56320 | 1023 & z));
                }
              } else j += String.fromCharCode(z);
            }
            return j;
          }
          function he(T, P) {
            return (T >>>= 0) ? ze(c(), T, P) : "";
          }
          function Ee(T, P, k, j) {
            if (!(0 < j)) return 0;
            var z = k >>>= 0;
            j = k + j - 1;
            for (var Y = 0; Y < T.length; ++Y) {
              var re = T.charCodeAt(Y);
              if (55296 <= re && 57343 >= re && (re = 65536 + ((1023 & re) << 10) | 1023 & T.charCodeAt(++Y)), 127 >= re) {
                if (k >= j) break;
                P[k++ >>> 0] = re;
              } else {
                if (2047 >= re) {
                  if (k + 1 >= j) break;
                  P[k++ >>> 0] = 192 | re >> 6;
                } else {
                  if (65535 >= re) {
                    if (k + 2 >= j) break;
                    P[k++ >>> 0] = 224 | re >> 12;
                  } else {
                    if (k + 3 >= j) break;
                    P[k++ >>> 0] = 240 | re >> 18, P[k++ >>> 0] = 128 | re >> 12 & 63;
                  }
                  P[k++ >>> 0] = 128 | re >> 6 & 63;
                }
                P[k++ >>> 0] = 128 | 63 & re;
              }
            }
            return P[k >>> 0] = 0, k - z;
          }
          function Ie(T) {
            for (var P = 0, k = 0; k < T.length; ++k) {
              var j = T.charCodeAt(k);
              127 >= j ? P++ : 2047 >= j ? P += 2 : 55296 <= j && 57343 >= j ? (P += 4, ++k) : P += 3;
            }
            return P;
          }
          function De(T) {
            Z = T, t.HEAP8 = ee = new Int8Array(T), t.HEAP16 = new Int16Array(T), t.HEAP32 = me = new Int32Array(T), t.HEAPU8 = se = new Uint8Array(T), t.HEAPU16 = new Uint16Array(T), t.HEAPU32 = ie = new Uint32Array(T), t.HEAPF32 = new Float32Array(T), t.HEAPF64 = _e = new Float64Array(T);
          }
          C && (Z = t.buffer);
          var ke = t.INITIAL_MEMORY || 16777216;
          if (C) q = t.wasmMemory, Z = t.buffer;
          else if (t.wasmMemory) q = t.wasmMemory;
          else if (!((q = new WebAssembly.Memory({ initial: ke / 65536, maximum: 65536, shared: !0 })).buffer instanceof SharedArrayBuffer)) throw F("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"), w && console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"), Error("bad memory");
          q && (Z = q.buffer), ke = Z.byteLength, De(Z);
          var He, Je = [], Xe = [], tt = [], nt = [];
          function Ke() {
            return W || !1;
          }
          function L() {
            var T = t.preRun.shift();
            Je.unshift(T);
          }
          var te, oe = 0, ve = null;
          function le(T) {
            throw C ? postMessage({ cmd: "onAbort", arg: T }) : t.onAbort && t.onAbort(T), F(T = "Aborted(" + T + ")"), be = !0, T = new WebAssembly.RuntimeError(T + ". Build with -sASSERTIONS for more info."), n(T), T;
          }
          function Fe() {
            return te.startsWith("data:application/octet-stream;base64,");
          }
          function pe() {
            var T = te;
            try {
              if (T == te && M) return new Uint8Array(M);
              if (l) return l(T);
              throw "both async and sync fetching of the wasm failed";
            } catch (P) {
              le(P);
            }
          }
          te = "ort-wasm-threaded.wasm", Fe() || (te = G(te));
          var Ze = {};
          function We(T) {
            this.name = "ExitStatus", this.message = "Program terminated with exit(" + T + ")", this.status = T;
          }
          function Ve(T) {
            (T = fe.Vb[T]) || le(), fe.mc(T);
          }
          function Qe(T) {
            var P = fe.Cc();
            if (!P) return 6;
            fe.ac.push(P), fe.Vb[T.Ub] = P, P.Ub = T.Ub;
            var k = { cmd: "run", start_routine: T.Ic, arg: T.zc, pthread_ptr: T.Ub };
            return P.$b = () => {
              k.time = performance.now(), P.postMessage(k, T.Nc);
            }, P.loaded && (P.$b(), delete P.$b), 0;
          }
          function je(T) {
            if (C) return ae(1, 1, T);
            Ke() || (fe.oc(), t.onExit && t.onExit(T), be = !0), S(T, new We(T));
          }
          function Ye(T, P) {
            if (!P && C) throw Pt(T), "unwind";
            Ke() || C || (qt(), Ge(tt), Gt(0), kt[1].length && Ft(1, 10), kt[2].length && Ft(2, 10), fe.oc()), je(T);
          }
          var fe = { Yb: [], ac: [], qc: [], Vb: {}, fc: function() {
            C && fe.Ec();
          }, Pc: function() {
          }, Ec: function() {
            fe.receiveObjectTransfer = fe.Gc, fe.threadInitTLS = fe.pc, fe.setExitStatus = fe.nc, W = !1;
          }, nc: function() {
          }, oc: function() {
            for (var T of Object.values(fe.Vb)) fe.mc(T);
            for (T of fe.Yb) T.terminate();
            fe.Yb = [];
          }, mc: function(T) {
            var P = T.Ub;
            delete fe.Vb[P], fe.Yb.push(T), fe.ac.splice(fe.ac.indexOf(T), 1), T.Ub = 0, Nt(P);
          }, Gc: function() {
          }, pc: function() {
            fe.qc.forEach((T) => T());
          }, Fc: function(T, P) {
            T.onmessage = (k) => {
              var j = (k = k.data).cmd;
              if (T.Ub && (fe.Bc = T.Ub), k.targetThread && k.targetThread != $t()) {
                var z = fe.Vb[k.Qc];
                z ? z.postMessage(k, k.transferList) : F('Internal error! Worker sent a message "' + j + '" to target pthread ' + k.targetThread + ", but that thread no longer exists!");
              } else j === "processProxyingQueue" ? U(k.queue) : j === "spawnThread" ? Qe(k) : j === "cleanupThread" ? Ve(k.thread) : j === "killThread" ? (k = k.thread, j = fe.Vb[k], delete fe.Vb[k], j.terminate(), Nt(k), fe.ac.splice(fe.ac.indexOf(j), 1), j.Ub = 0) : j === "cancelThread" ? fe.Vb[k.thread].postMessage({ cmd: "cancel" }) : j === "loaded" ? (T.loaded = !0, P && P(T), T.$b && (T.$b(), delete T.$b)) : j === "print" ? E("Thread " + k.threadId + ": " + k.text) : j === "printErr" ? F("Thread " + k.threadId + ": " + k.text) : j === "alert" ? alert("Thread " + k.threadId + ": " + k.text) : k.target === "setimmediate" ? T.postMessage(k) : j === "onAbort" ? t.onAbort && t.onAbort(k.arg) : j && F("worker sent an unknown command " + j);
              fe.Bc = void 0;
            }, T.onerror = (k) => {
              throw F("worker sent an error! " + k.filename + ":" + k.lineno + ": " + k.message), k;
            }, w && (T.on("message", function(k) {
              T.onmessage({ data: k });
            }), T.on("error", function(k) {
              T.onerror(k);
            }), T.on("detachedExit", function() {
            })), T.postMessage({ cmd: "load", urlOrBlob: t.mainScriptUrlOrBlob || h, wasmMemory: q, wasmModule: Q });
          }, yc: function() {
            var T = G("ort-wasm-threaded.worker.js");
            fe.Yb.push(new Worker(T));
          }, Cc: function() {
            return fe.Yb.length == 0 && (fe.yc(), fe.Fc(fe.Yb[0])), fe.Yb.pop();
          } };
          function Ge(T) {
            for (; 0 < T.length; ) T.shift()(t);
          }
          function It(T) {
            var P = Te();
            return T = T(), xe(P), T;
          }
          function Pt(T) {
            if (C) return ae(2, 0, T);
            try {
              Ye(T);
            } catch (P) {
              P instanceof We || P == "unwind" || S(1, P);
            }
          }
          t.PThread = fe, t.establishStackSpace = function() {
            var T = $t(), P = f()[T + 44 >> 2 >>> 0];
            T = f()[T + 48 >> 2 >>> 0], Kt(P, P - T), xe(P);
          };
          var at = [];
          function Re(T) {
            var P = at[T];
            return P || (T >= at.length && (at.length = T + 1), at[T] = P = He.get(T)), P;
          }
          t.invokeEntryPoint = function(T, P) {
            T = Re(T)(P), Ke() ? fe.nc(T) : Xt(T);
          };
          var ct, ht, lt = [], ye = 0, de = 0;
          function ge(T) {
            this.Zb = T, this.Sb = T - 24, this.xc = function(P) {
              s()[this.Sb + 4 >> 2 >>> 0] = P;
            }, this.bc = function() {
              return s()[this.Sb + 4 >> 2 >>> 0];
            }, this.wc = function(P) {
              s()[this.Sb + 8 >> 2 >>> 0] = P;
            }, this.Dc = function() {
              return s()[this.Sb + 8 >> 2 >>> 0];
            }, this.rc = function() {
              f()[this.Sb >> 2 >>> 0] = 0;
            }, this.hc = function(P) {
              P = P ? 1 : 0, o()[this.Sb + 12 >> 0 >>> 0] = P;
            }, this.uc = function() {
              return o()[this.Sb + 12 >> 0 >>> 0] != 0;
            }, this.ic = function(P) {
              P = P ? 1 : 0, o()[this.Sb + 13 >> 0 >>> 0] = P;
            }, this.kc = function() {
              return o()[this.Sb + 13 >> 0 >>> 0] != 0;
            }, this.fc = function(P, k) {
              this.cc(0), this.xc(P), this.wc(k), this.rc(), this.hc(!1), this.ic(!1);
            }, this.sc = function() {
              Atomics.add(f(), this.Sb >> 2, 1);
            }, this.Hc = function() {
              return Atomics.sub(f(), this.Sb >> 2, 1) === 1;
            }, this.cc = function(P) {
              s()[this.Sb + 16 >> 2 >>> 0] = P;
            }, this.tc = function() {
              return s()[this.Sb + 16 >> 2 >>> 0];
            }, this.vc = function() {
              if (Jt(this.bc())) return s()[this.Zb >> 2 >>> 0];
              var P = this.tc();
              return P !== 0 ? P : this.Zb;
            };
          }
          function gt(T) {
            return zt(new ge(T).Sb);
          }
          function ft(T, P, k, j) {
            return C ? ae(3, 1, T, P, k, j) : mt(T, P, k, j);
          }
          function mt(T, P, k, j) {
            if (typeof SharedArrayBuffer > "u") return F("Current environment does not support SharedArrayBuffer, pthreads are not available!"), 6;
            var z = [];
            return C && z.length === 0 ? ft(T, P, k, j) : (T = { Ic: k, Ub: T, zc: j, Nc: z }, C ? (T.Oc = "spawnThread", postMessage(T, z), 0) : Qe(T));
          }
          function bt(T, P, k) {
            return C ? ae(4, 1, T, P, k) : 0;
          }
          function yt(T, P) {
            if (C) return ae(5, 1, T, P);
          }
          function vt(T, P) {
            if (C) return ae(6, 1, T, P);
          }
          function _t(T, P, k) {
            if (C) return ae(7, 1, T, P, k);
          }
          function wt(T, P, k) {
            return C ? ae(8, 1, T, P, k) : 0;
          }
          function xt(T, P) {
            if (C) return ae(9, 1, T, P);
          }
          function Tt(T, P, k) {
            if (C) return ae(10, 1, T, P, k);
          }
          function St(T, P, k, j) {
            if (C) return ae(11, 1, T, P, k, j);
          }
          function Ot(T, P, k, j) {
            if (C) return ae(12, 1, T, P, k, j);
          }
          function At(T, P, k, j) {
            if (C) return ae(13, 1, T, P, k, j);
          }
          function Et(T) {
            if (C) return ae(14, 1, T);
          }
          function $(T, P) {
            if (C) return ae(15, 1, T, P);
          }
          function N(T, P, k) {
            if (C) return ae(16, 1, T, P, k);
          }
          function U(T) {
            Atomics.store(f(), T >> 2, 1), $t() && Yt(T), Atomics.compareExchange(f(), T >> 2, 1, 0);
          }
          function B(T) {
            return s()[T >>> 2] + 4294967296 * f()[T + 4 >>> 2];
          }
          function H(T, P, k, j, z, Y) {
            return C ? ae(17, 1, T, P, k, j, z, Y) : -52;
          }
          function J(T, P, k, j, z, Y) {
            if (C) return ae(18, 1, T, P, k, j, z, Y);
          }
          function ne(T) {
            var P = Ie(T) + 1, k = Mt(P);
            return k && Ee(T, o(), k, P), k;
          }
          function ue(T, P, k) {
            function j(Ae) {
              return (Ae = Ae.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? Ae[1] : "GMT";
            }
            if (C) return ae(19, 1, T, P, k);
            var z = (/* @__PURE__ */ new Date()).getFullYear(), Y = new Date(z, 0, 1), re = new Date(z, 6, 1);
            z = Y.getTimezoneOffset();
            var ce = re.getTimezoneOffset(), Oe = Math.max(z, ce);
            f()[T >> 2 >>> 0] = 60 * Oe, f()[P >> 2 >>> 0] = +(z != ce), T = j(Y), P = j(re), T = ne(T), P = ne(P), ce < z ? (s()[k >> 2 >>> 0] = T, s()[k + 4 >> 2 >>> 0] = P) : (s()[k >> 2 >>> 0] = P, s()[k + 4 >> 2 >>> 0] = T);
          }
          function ae(T, P) {
            var k = arguments.length - 2, j = arguments;
            return It(() => {
              for (var z = jt(8 * k), Y = z >> 3, re = 0; re < k; re++) {
                var ce = j[2 + re];
                i()[Y + re >>> 0] = ce;
              }
              return Wt(T, k, z, P);
            });
          }
          t.executeNotifiedProxyingQueue = U, ht = w ? () => {
            var T = process.hrtime();
            return 1e3 * T[0] + T[1] / 1e6;
          } : C ? () => performance.now() - t.__performance_now_clock_drift : () => performance.now();
          var we, Me = [], qe = {};
          function Be() {
            if (!we) {
              var T, P = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: v || "./this.program" };
              for (T in qe) qe[T] === void 0 ? delete P[T] : P[T] = qe[T];
              var k = [];
              for (T in P) k.push(T + "=" + P[T]);
              we = k;
            }
            return we;
          }
          function X(T, P) {
            if (C) return ae(20, 1, T, P);
            var k = 0;
            return Be().forEach(function(j, z) {
              var Y = P + k;
              for (z = s()[T + 4 * z >> 2 >>> 0] = Y, Y = 0; Y < j.length; ++Y) o()[z++ >> 0 >>> 0] = j.charCodeAt(Y);
              o()[z >> 0 >>> 0] = 0, k += j.length + 1;
            }), 0;
          }
          function Pe(T, P) {
            if (C) return ae(21, 1, T, P);
            var k = Be();
            s()[T >> 2 >>> 0] = k.length;
            var j = 0;
            return k.forEach(function(z) {
              j += z.length + 1;
            }), s()[P >> 2 >>> 0] = j, 0;
          }
          function Ne(T) {
            return C ? ae(22, 1, T) : 52;
          }
          function rt(T, P, k, j) {
            return C ? ae(23, 1, T, P, k, j) : 52;
          }
          function st(T, P, k, j, z) {
            return C ? ae(24, 1, T, P, k, j, z) : 70;
          }
          var kt = [null, [], []];
          function Ft(T, P) {
            var k = kt[T];
            P === 0 || P === 10 ? ((T === 1 ? E : F)(ze(k, 0)), k.length = 0) : k.push(P);
          }
          function Lt(T, P, k, j) {
            if (C) return ae(25, 1, T, P, k, j);
            for (var z = 0, Y = 0; Y < k; Y++) {
              var re = s()[P >> 2 >>> 0], ce = s()[P + 4 >> 2 >>> 0];
              P += 8;
              for (var Oe = 0; Oe < ce; Oe++) Ft(T, c()[re + Oe >>> 0]);
              z += ce;
            }
            return s()[j >> 2 >>> 0] = z, 0;
          }
          var et = 0;
          function Dt(T) {
            return T % 4 == 0 && (T % 100 != 0 || T % 400 == 0);
          }
          var Vt = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Ut = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          function Bt(T, P, k, j) {
            function z(K, $e, Le) {
              for (K = typeof K == "number" ? K.toString() : K || ""; K.length < $e; ) K = Le[0] + K;
              return K;
            }
            function Y(K, $e) {
              return z(K, $e, "0");
            }
            function re(K, $e) {
              function Le(dt) {
                return 0 > dt ? -1 : 0 < dt ? 1 : 0;
              }
              var ut;
              return (ut = Le(K.getFullYear() - $e.getFullYear())) === 0 && (ut = Le(K.getMonth() - $e.getMonth())) === 0 && (ut = Le(K.getDate() - $e.getDate())), ut;
            }
            function ce(K) {
              switch (K.getDay()) {
                case 0:
                  return new Date(K.getFullYear() - 1, 11, 29);
                case 1:
                  return K;
                case 2:
                  return new Date(K.getFullYear(), 0, 3);
                case 3:
                  return new Date(K.getFullYear(), 0, 2);
                case 4:
                  return new Date(K.getFullYear(), 0, 1);
                case 5:
                  return new Date(K.getFullYear() - 1, 11, 31);
                case 6:
                  return new Date(K.getFullYear() - 1, 11, 30);
              }
            }
            function Oe(K) {
              var $e = K.Wb;
              for (K = new Date(new Date(K.Xb + 1900, 0, 1).getTime()); 0 < $e; ) {
                var Le = K.getMonth(), ut = (Dt(K.getFullYear()) ? Vt : Ut)[Le];
                if (!($e > ut - K.getDate())) {
                  K.setDate(K.getDate() + $e);
                  break;
                }
                $e -= ut - K.getDate() + 1, K.setDate(1), 11 > Le ? K.setMonth(Le + 1) : (K.setMonth(0), K.setFullYear(K.getFullYear() + 1));
              }
              return Le = new Date(K.getFullYear() + 1, 0, 4), $e = ce(new Date(K.getFullYear(), 0, 4)), Le = ce(Le), 0 >= re($e, K) ? 0 >= re(Le, K) ? K.getFullYear() + 1 : K.getFullYear() : K.getFullYear() - 1;
            }
            var Ae = f()[j + 40 >> 2 >>> 0];
            for (var Ue in j = { Lc: f()[j >> 2 >>> 0], Kc: f()[j + 4 >> 2 >>> 0], dc: f()[j + 8 >> 2 >>> 0], jc: f()[j + 12 >> 2 >>> 0], ec: f()[j + 16 >> 2 >>> 0], Xb: f()[j + 20 >> 2 >>> 0], Tb: f()[j + 24 >> 2 >>> 0], Wb: f()[j + 28 >> 2 >>> 0], Rc: f()[j + 32 >> 2 >>> 0], Jc: f()[j + 36 >> 2 >>> 0], Mc: Ae ? he(Ae) : "" }, k = he(k), Ae = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" }) k = k.replace(new RegExp(Ue, "g"), Ae[Ue]);
            var ot = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), it = "January February March April May June July August September October November December".split(" ");
            for (Ue in Ae = { "%a": function(K) {
              return ot[K.Tb].substring(0, 3);
            }, "%A": function(K) {
              return ot[K.Tb];
            }, "%b": function(K) {
              return it[K.ec].substring(0, 3);
            }, "%B": function(K) {
              return it[K.ec];
            }, "%C": function(K) {
              return Y((K.Xb + 1900) / 100 | 0, 2);
            }, "%d": function(K) {
              return Y(K.jc, 2);
            }, "%e": function(K) {
              return z(K.jc, 2, " ");
            }, "%g": function(K) {
              return Oe(K).toString().substring(2);
            }, "%G": function(K) {
              return Oe(K);
            }, "%H": function(K) {
              return Y(K.dc, 2);
            }, "%I": function(K) {
              return (K = K.dc) == 0 ? K = 12 : 12 < K && (K -= 12), Y(K, 2);
            }, "%j": function(K) {
              for (var $e = 0, Le = 0; Le <= K.ec - 1; $e += (Dt(K.Xb + 1900) ? Vt : Ut)[Le++]) ;
              return Y(K.jc + $e, 3);
            }, "%m": function(K) {
              return Y(K.ec + 1, 2);
            }, "%M": function(K) {
              return Y(K.Kc, 2);
            }, "%n": function() {
              return `
`;
            }, "%p": function(K) {
              return 0 <= K.dc && 12 > K.dc ? "AM" : "PM";
            }, "%S": function(K) {
              return Y(K.Lc, 2);
            }, "%t": function() {
              return "	";
            }, "%u": function(K) {
              return K.Tb || 7;
            }, "%U": function(K) {
              return Y(Math.floor((K.Wb + 7 - K.Tb) / 7), 2);
            }, "%V": function(K) {
              var $e = Math.floor((K.Wb + 7 - (K.Tb + 6) % 7) / 7);
              if (2 >= (K.Tb + 371 - K.Wb - 2) % 7 && $e++, $e) $e == 53 && ((Le = (K.Tb + 371 - K.Wb) % 7) == 4 || Le == 3 && Dt(K.Xb) || ($e = 1));
              else {
                $e = 52;
                var Le = (K.Tb + 7 - K.Wb - 1) % 7;
                (Le == 4 || Le == 5 && Dt(K.Xb % 400 - 1)) && $e++;
              }
              return Y($e, 2);
            }, "%w": function(K) {
              return K.Tb;
            }, "%W": function(K) {
              return Y(Math.floor((K.Wb + 7 - (K.Tb + 6) % 7) / 7), 2);
            }, "%y": function(K) {
              return (K.Xb + 1900).toString().substring(2);
            }, "%Y": function(K) {
              return K.Xb + 1900;
            }, "%z": function(K) {
              var $e = 0 <= (K = K.Jc);
              return K = Math.abs(K) / 60, ($e ? "+" : "-") + ("0000" + (K / 60 * 100 + K % 60)).slice(-4);
            }, "%Z": function(K) {
              return K.Mc;
            }, "%%": function() {
              return "%";
            } }, k = k.replace(/%%/g, "\0\0"), Ae) k.includes(Ue) && (k = k.replace(new RegExp(Ue, "g"), Ae[Ue](j)));
            return Ue = function(K) {
              var $e = Array(Ie(K) + 1);
              return Ee(K, $e, 0, $e.length), $e;
            }(k = k.replace(/\0\0/g, "%")), Ue.length > P ? 0 : (function(K, $e) {
              o().set(K, $e >>> 0);
            }(Ue, T), Ue.length - 1);
          }
          fe.fc();
          var fn = [null, je, Pt, ft, bt, yt, vt, _t, wt, xt, Tt, St, Ot, At, Et, $, N, H, J, ue, X, Pe, Ne, rt, st, Lt], pn = { b: function(T) {
            return Mt(T + 24) + 24;
          }, n: function(T) {
            return (T = new ge(T)).uc() || (T.hc(!0), ye--), T.ic(!1), lt.push(T), T.sc(), T.vc();
          }, ma: function(T) {
            throw F("Unexpected exception thrown, this is not properly supported - aborting"), be = !0, T;
          }, x: function() {
            Se(0);
            var T = lt.pop();
            if (T.Hc() && !T.kc()) {
              var P = T.Dc();
              P && Re(P)(T.Zb), gt(T.Zb);
            }
            de = 0;
          }, e: function() {
            var T = de;
            if (!T) return et = 0;
            var P = new ge(T);
            P.cc(T);
            var k = P.bc();
            if (!k) return et = 0, T;
            for (var j = Array.prototype.slice.call(arguments), z = 0; z < j.length; z++) {
              var Y = j[z];
              if (Y === 0 || Y === k) break;
              if (Ct(Y, k, P.Sb + 16)) return et = Y, T;
            }
            return et = k, T;
          }, l: function() {
            var T = de;
            if (!T) return et = 0;
            var P = new ge(T);
            P.cc(T);
            var k = P.bc();
            if (!k) return et = 0, T;
            for (var j = Array.prototype.slice.call(arguments), z = 0; z < j.length; z++) {
              var Y = j[z];
              if (Y === 0 || Y === k) break;
              if (Ct(Y, k, P.Sb + 16)) return et = Y, T;
            }
            return et = k, T;
          }, h: function() {
            var T = de;
            if (!T) return et = 0;
            var P = new ge(T);
            P.cc(T);
            var k = P.bc();
            if (!k) return et = 0, T;
            for (var j = Array.prototype.slice.call(arguments), z = 0; z < j.length; z++) {
              var Y = j[z];
              if (Y === 0 || Y === k) break;
              if (Ct(Y, k, P.Sb + 16)) return et = Y, T;
            }
            return et = k, T;
          }, t: gt, M: function() {
            var T = lt.pop();
            T || le("no exception to throw");
            var P = T.Zb;
            throw T.kc() || (lt.push(T), T.ic(!0), T.hc(!1), ye++), de = P, P;
          }, c: function(T, P, k) {
            throw new ge(T).fc(P, k), de = T, ye++, T;
          }, pa: function() {
            return ye;
          }, Fa: function(T) {
            Ht(T, !I, 1, !O), fe.pc();
          }, T: function(T) {
            C ? postMessage({ cmd: "cleanupThread", thread: T }) : Ve(T);
          }, xa: mt, j: function(T) {
            throw de || (de = T), T;
          }, H: bt, Ma: yt, ua: vt, wa: _t, oa: wt, Ka: xt, Ca: Tt, Ja: St, V: Ot, va: At, sa: Et, La: $, ta: N, Ta: function() {
          }, X: function() {
            le("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
          }, Ua: function() {
            le("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
          }, W: function() {
            return Date.now();
          }, ya: function() {
            return 2097152;
          }, Oa: function() {
            return !0;
          }, za: function(T, P, k, j) {
            if (T == P) setTimeout(() => U(j));
            else if (C) postMessage({ targetThread: T, cmd: "processProxyingQueue", queue: j });
            else {
              if (!(T = fe.Vb[T])) return;
              T.postMessage({ cmd: "processProxyingQueue", queue: j });
            }
            return 1;
          }, Ea: function() {
            return -1;
          }, Pa: function(T, P) {
            T = new Date(1e3 * B(T)), f()[P >> 2 >>> 0] = T.getUTCSeconds(), f()[P + 4 >> 2 >>> 0] = T.getUTCMinutes(), f()[P + 8 >> 2 >>> 0] = T.getUTCHours(), f()[P + 12 >> 2 >>> 0] = T.getUTCDate(), f()[P + 16 >> 2 >>> 0] = T.getUTCMonth(), f()[P + 20 >> 2 >>> 0] = T.getUTCFullYear() - 1900, f()[P + 24 >> 2 >>> 0] = T.getUTCDay(), T = (T.getTime() - Date.UTC(T.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0, f()[P + 28 >> 2 >>> 0] = T;
          }, Qa: function(T, P) {
            T = new Date(1e3 * B(T)), f()[P >> 2 >>> 0] = T.getSeconds(), f()[P + 4 >> 2 >>> 0] = T.getMinutes(), f()[P + 8 >> 2 >>> 0] = T.getHours(), f()[P + 12 >> 2 >>> 0] = T.getDate(), f()[P + 16 >> 2 >>> 0] = T.getMonth(), f()[P + 20 >> 2 >>> 0] = T.getFullYear() - 1900, f()[P + 24 >> 2 >>> 0] = T.getDay();
            var k = new Date(T.getFullYear(), 0, 1), j = (T.getTime() - k.getTime()) / 864e5 | 0;
            f()[P + 28 >> 2 >>> 0] = j, f()[P + 36 >> 2 >>> 0] = -60 * T.getTimezoneOffset(), j = new Date(T.getFullYear(), 6, 1).getTimezoneOffset(), T = 0 | (j != (k = k.getTimezoneOffset()) && T.getTimezoneOffset() == Math.min(k, j)), f()[P + 32 >> 2 >>> 0] = T;
          }, Ra: function(T) {
            var P = new Date(f()[T + 20 >> 2 >>> 0] + 1900, f()[T + 16 >> 2 >>> 0], f()[T + 12 >> 2 >>> 0], f()[T + 8 >> 2 >>> 0], f()[T + 4 >> 2 >>> 0], f()[T >> 2 >>> 0], 0), k = f()[T + 32 >> 2 >>> 0], j = P.getTimezoneOffset(), z = new Date(P.getFullYear(), 0, 1), Y = new Date(P.getFullYear(), 6, 1).getTimezoneOffset(), re = z.getTimezoneOffset(), ce = Math.min(re, Y);
            return 0 > k ? f()[T + 32 >> 2 >>> 0] = +(Y != re && ce == j) : 0 < k != (ce == j) && (Y = Math.max(re, Y), P.setTime(P.getTime() + 6e4 * ((0 < k ? ce : Y) - j))), f()[T + 24 >> 2 >>> 0] = P.getDay(), k = (P.getTime() - z.getTime()) / 864e5 | 0, f()[T + 28 >> 2 >>> 0] = k, f()[T >> 2 >>> 0] = P.getSeconds(), f()[T + 4 >> 2 >>> 0] = P.getMinutes(), f()[T + 8 >> 2 >>> 0] = P.getHours(), f()[T + 12 >> 2 >>> 0] = P.getDate(), f()[T + 16 >> 2 >>> 0] = P.getMonth(), P.getTime() / 1e3 | 0;
          }, Aa: H, Ba: J, Sa: function T(P, k, j) {
            T.Ac || (T.Ac = !0, ue(P, k, j));
          }, y: function() {
            le("");
          }, U: function() {
            if (!w && !I) {
              var T = "Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread";
              ct || (ct = {}), ct[T] || (ct[T] = 1, w && (T = "warning: " + T), F(T));
            }
          }, ra: function() {
            return 4294901760;
          }, B: ht, Ia: function(T, P, k) {
            c().copyWithin(T >>> 0, P >>> 0, P + k >>> 0);
          }, F: function() {
            return w ? b(3993).cpus().length : navigator.hardwareConcurrency;
          }, Da: function(T, P, k) {
            Me.length = P, k >>= 3;
            for (var j = 0; j < P; j++) Me[j] = i()[k + j >>> 0];
            return (0 > T ? Ze[-T - 1] : fn[T]).apply(null, Me);
          }, qa: function(T) {
            var P = c().length;
            if ((T >>>= 0) <= P || 4294901760 < T) return !1;
            for (var k = 1; 4 >= k; k *= 2) {
              var j = P * (1 + 0.2 / k);
              j = Math.min(j, T + 100663296);
              var z = Math;
              j = Math.max(T, j), z = z.min.call(z, 4294901760, j + (65536 - j % 65536) % 65536);
              e: {
                try {
                  q.grow(z - Z.byteLength + 65535 >>> 16), De(q.buffer);
                  var Y = 1;
                  break e;
                } catch {
                }
                Y = void 0;
              }
              if (Y) return !0;
            }
            return !1;
          }, Na: function() {
            throw "unwind";
          }, Ga: X, Ha: Pe, J: Ye, I: Ne, S: rt, ga: st, R: Lt, d: function() {
            return et;
          }, na: function T(P, k) {
            T.lc || (T.lc = function() {
              if (typeof crypto == "object" && typeof crypto.getRandomValues == "function") {
                var z = new Uint8Array(1);
                return () => (crypto.getRandomValues(z), z[0]);
              }
              if (w) try {
                var Y = b(Object(function() {
                  var re = new Error("Cannot find module 'crypto'");
                  throw re.code = "MODULE_NOT_FOUND", re;
                }()));
                return () => Y.randomBytes(1)[0];
              } catch {
              }
              return () => le("randomDevice");
            }());
            for (var j = 0; j < k; j++) o()[P + j >> 0 >>> 0] = T.lc();
            return 0;
          }, ia: function(T, P, k) {
            var j = Te();
            try {
              return Re(T)(P, k);
            } catch (z) {
              if (xe(j), z !== z + 0) throw z;
              Se(1, 0);
            }
          }, ja: function(T, P, k) {
            var j = Te();
            try {
              return Re(T)(P, k);
            } catch (z) {
              if (xe(j), z !== z + 0) throw z;
              Se(1, 0);
            }
          }, K: function(T) {
            var P = Te();
            try {
              return Re(T)();
            } catch (k) {
              if (xe(P), k !== k + 0) throw k;
              Se(1, 0);
            }
          }, f: function(T, P) {
            var k = Te();
            try {
              return Re(T)(P);
            } catch (j) {
              if (xe(k), j !== j + 0) throw j;
              Se(1, 0);
            }
          }, P: function(T, P, k) {
            var j = Te();
            try {
              return Re(T)(P, k);
            } catch (z) {
              if (xe(j), z !== z + 0) throw z;
              Se(1, 0);
            }
          }, Q: function(T, P, k) {
            var j = Te();
            try {
              return Re(T)(P, k);
            } catch (z) {
              if (xe(j), z !== z + 0) throw z;
              Se(1, 0);
            }
          }, k: function(T, P, k) {
            var j = Te();
            try {
              return Re(T)(P, k);
            } catch (z) {
              if (xe(j), z !== z + 0) throw z;
              Se(1, 0);
            }
          }, p: function(T, P, k, j) {
            var z = Te();
            try {
              return Re(T)(P, k, j);
            } catch (Y) {
              if (xe(z), Y !== Y + 0) throw Y;
              Se(1, 0);
            }
          }, q: function(T, P, k, j, z) {
            var Y = Te();
            try {
              return Re(T)(P, k, j, z);
            } catch (re) {
              if (xe(Y), re !== re + 0) throw re;
              Se(1, 0);
            }
          }, N: function(T, P, k, j, z, Y) {
            var re = Te();
            try {
              return Re(T)(P, k, j, z, Y);
            } catch (ce) {
              if (xe(re), ce !== ce + 0) throw ce;
              Se(1, 0);
            }
          }, s: function(T, P, k, j, z, Y) {
            var re = Te();
            try {
              return Re(T)(P, k, j, z, Y);
            } catch (ce) {
              if (xe(re), ce !== ce + 0) throw ce;
              Se(1, 0);
            }
          }, w: function(T, P, k, j, z, Y, re) {
            var ce = Te();
            try {
              return Re(T)(P, k, j, z, Y, re);
            } catch (Oe) {
              if (xe(ce), Oe !== Oe + 0) throw Oe;
              Se(1, 0);
            }
          }, L: function(T, P, k, j, z, Y, re, ce) {
            var Oe = Te();
            try {
              return Re(T)(P, k, j, z, Y, re, ce);
            } catch (Ae) {
              if (xe(Oe), Ae !== Ae + 0) throw Ae;
              Se(1, 0);
            }
          }, E: function(T, P, k, j, z, Y, re, ce, Oe, Ae, Ue, ot) {
            var it = Te();
            try {
              return Re(T)(P, k, j, z, Y, re, ce, Oe, Ae, Ue, ot);
            } catch (K) {
              if (xe(it), K !== K + 0) throw K;
              Se(1, 0);
            }
          }, aa: function(T, P, k, j, z, Y, re, ce) {
            var Oe = Te();
            try {
              return sn(T, P, k, j, z, Y, re, ce);
            } catch (Ae) {
              if (xe(Oe), Ae !== Ae + 0) throw Ae;
              Se(1, 0);
            }
          }, _: function(T, P, k, j, z, Y, re) {
            var ce = Te();
            try {
              return Qt(T, P, k, j, z, Y, re);
            } catch (Oe) {
              if (xe(ce), Oe !== Oe + 0) throw Oe;
              Se(1, 0);
            }
          }, Z: function(T, P, k, j, z) {
            var Y = Te();
            try {
              return un(T, P, k, j, z);
            } catch (re) {
              if (xe(Y), re !== re + 0) throw re;
              Se(1, 0);
            }
          }, ca: function(T, P, k, j) {
            var z = Te();
            try {
              return on(T, P, k, j);
            } catch (Y) {
              if (xe(z), Y !== Y + 0) throw Y;
              Se(1, 0);
            }
          }, $: function(T) {
            var P = Te();
            try {
              return Zt(T);
            } catch (k) {
              if (xe(P), k !== k + 0) throw k;
              Se(1, 0);
            }
          }, ba: function(T, P) {
            var k = Te();
            try {
              return an(T, P);
            } catch (j) {
              if (xe(k), j !== j + 0) throw j;
              Se(1, 0);
            }
          }, Y: function(T, P, k) {
            var j = Te();
            try {
              return en(T, P, k);
            } catch (z) {
              if (xe(j), z !== z + 0) throw z;
              Se(1, 0);
            }
          }, g: function(T) {
            var P = Te();
            try {
              Re(T)();
            } catch (k) {
              if (xe(P), k !== k + 0) throw k;
              Se(1, 0);
            }
          }, r: function(T, P) {
            var k = Te();
            try {
              Re(T)(P);
            } catch (j) {
              if (xe(k), j !== j + 0) throw j;
              Se(1, 0);
            }
          }, i: function(T, P, k) {
            var j = Te();
            try {
              Re(T)(P, k);
            } catch (z) {
              if (xe(j), z !== z + 0) throw z;
              Se(1, 0);
            }
          }, ha: function(T, P, k, j) {
            var z = Te();
            try {
              Re(T)(P, k, j);
            } catch (Y) {
              if (xe(z), Y !== Y + 0) throw Y;
              Se(1, 0);
            }
          }, m: function(T, P, k, j) {
            var z = Te();
            try {
              Re(T)(P, k, j);
            } catch (Y) {
              if (xe(z), Y !== Y + 0) throw Y;
              Se(1, 0);
            }
          }, v: function(T, P, k, j, z) {
            var Y = Te();
            try {
              Re(T)(P, k, j, z);
            } catch (re) {
              if (xe(Y), re !== re + 0) throw re;
              Se(1, 0);
            }
          }, u: function(T, P, k, j, z, Y) {
            var re = Te();
            try {
              Re(T)(P, k, j, z, Y);
            } catch (ce) {
              if (xe(re), ce !== ce + 0) throw ce;
              Se(1, 0);
            }
          }, O: function(T, P, k, j, z, Y, re) {
            var ce = Te();
            try {
              Re(T)(P, k, j, z, Y, re);
            } catch (Oe) {
              if (xe(ce), Oe !== Oe + 0) throw Oe;
              Se(1, 0);
            }
          }, A: function(T, P, k, j, z, Y, re, ce) {
            var Oe = Te();
            try {
              Re(T)(P, k, j, z, Y, re, ce);
            } catch (Ae) {
              if (xe(Oe), Ae !== Ae + 0) throw Ae;
              Se(1, 0);
            }
          }, ka: function(T, P, k, j, z, Y, re, ce, Oe) {
            var Ae = Te();
            try {
              Re(T)(P, k, j, z, Y, re, ce, Oe);
            } catch (Ue) {
              if (xe(Ae), Ue !== Ue + 0) throw Ue;
              Se(1, 0);
            }
          }, C: function(T, P, k, j, z, Y, re, ce, Oe, Ae, Ue) {
            var ot = Te();
            try {
              Re(T)(P, k, j, z, Y, re, ce, Oe, Ae, Ue);
            } catch (it) {
              if (xe(ot), it !== it + 0) throw it;
              Se(1, 0);
            }
          }, D: function(T, P, k, j, z, Y, re, ce, Oe, Ae, Ue, ot, it, K, $e, Le) {
            var ut = Te();
            try {
              Re(T)(P, k, j, z, Y, re, ce, Oe, Ae, Ue, ot, it, K, $e, Le);
            } catch (dt) {
              if (xe(ut), dt !== dt + 0) throw dt;
              Se(1, 0);
            }
          }, fa: function(T, P, k, j, z, Y, re, ce) {
            var Oe = Te();
            try {
              tn(T, P, k, j, z, Y, re, ce);
            } catch (Ae) {
              if (xe(Oe), Ae !== Ae + 0) throw Ae;
              Se(1, 0);
            }
          }, da: function(T, P, k, j, z, Y, re, ce, Oe, Ae, Ue, ot) {
            var it = Te();
            try {
              rn(T, P, k, j, z, Y, re, ce, Oe, Ae, Ue, ot);
            } catch (K) {
              if (xe(it), K !== K + 0) throw K;
              Se(1, 0);
            }
          }, ea: function(T, P, k, j, z, Y) {
            var re = Te();
            try {
              nn(T, P, k, j, z, Y);
            } catch (ce) {
              if (xe(re), ce !== ce + 0) throw ce;
              Se(1, 0);
            }
          }, o: function(T) {
            return T;
          }, a: q || t.wasmMemory, G: function(T) {
            et = T;
          }, la: Bt, z: function(T, P, k, j) {
            return Bt(T, P, k, j);
          } };
          (function() {
            function T(z, Y) {
              t.asm = z.exports, fe.qc.push(t.asm.sb), He = t.asm.ub, Xe.unshift(t.asm.Va), Q = Y, C || (oe--, t.monitorRunDependencies && t.monitorRunDependencies(oe), oe == 0 && ve && (z = ve, ve = null, z()));
            }
            function P(z) {
              T(z.instance, z.module);
            }
            function k(z) {
              return function() {
                if (!M && (O || I)) {
                  if (typeof fetch == "function" && !te.startsWith("file://")) return fetch(te, { credentials: "same-origin" }).then(function(Y) {
                    if (!Y.ok) throw "failed to load wasm binary file at '" + te + "'";
                    return Y.arrayBuffer();
                  }).catch(function() {
                    return pe();
                  });
                  if (a) return new Promise(function(Y, re) {
                    a(te, function(ce) {
                      Y(new Uint8Array(ce));
                    }, re);
                  });
                }
                return Promise.resolve().then(function() {
                  return pe();
                });
              }().then(function(Y) {
                return WebAssembly.instantiate(Y, j);
              }).then(function(Y) {
                return Y;
              }).then(z, function(Y) {
                F("failed to asynchronously prepare wasm: " + Y), le(Y);
              });
            }
            var j = { a: pn };
            if (C || (oe++, t.monitorRunDependencies && t.monitorRunDependencies(oe)), t.instantiateWasm) try {
              return t.instantiateWasm(j, T);
            } catch (z) {
              return F("Module.instantiateWasm callback failed with error: " + z), !1;
            }
            (M || typeof WebAssembly.instantiateStreaming != "function" || Fe() || te.startsWith("file://") || w || typeof fetch != "function" ? k(P) : fetch(te, { credentials: "same-origin" }).then(function(z) {
              return WebAssembly.instantiateStreaming(z, j).then(P, function(Y) {
                return F("wasm streaming compile failed: " + Y), F("falling back to ArrayBuffer instantiation"), k(P);
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
          }, Ht = t.__emscripten_thread_init = function() {
            return (Ht = t.__emscripten_thread_init = t.asm.vb).apply(null, arguments);
          };
          t.__emscripten_thread_crashed = function() {
            return (t.__emscripten_thread_crashed = t.asm.wb).apply(null, arguments);
          };
          var Rt, Wt = t._emscripten_run_in_main_runtime_thread_js = function() {
            return (Wt = t._emscripten_run_in_main_runtime_thread_js = t.asm.xb).apply(null, arguments);
          }, Yt = t.__emscripten_proxy_execute_task_queue = function() {
            return (Yt = t.__emscripten_proxy_execute_task_queue = t.asm.yb).apply(null, arguments);
          }, Nt = t.__emscripten_thread_free_data = function() {
            return (Nt = t.__emscripten_thread_free_data = t.asm.zb).apply(null, arguments);
          }, Xt = t.__emscripten_thread_exit = function() {
            return (Xt = t.__emscripten_thread_exit = t.asm.Ab).apply(null, arguments);
          }, Se = t._setThrew = function() {
            return (Se = t._setThrew = t.asm.Bb).apply(null, arguments);
          }, Kt = t._emscripten_stack_set_limits = function() {
            return (Kt = t._emscripten_stack_set_limits = t.asm.Cb).apply(null, arguments);
          }, Te = t.stackSave = function() {
            return (Te = t.stackSave = t.asm.Db).apply(null, arguments);
          }, xe = t.stackRestore = function() {
            return (xe = t.stackRestore = t.asm.Eb).apply(null, arguments);
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
              if (!Rt && (Rt = !0, t.calledRun = !0, !be) && (C || Ge(Xe), e(t), t.onRuntimeInitialized && t.onRuntimeInitialized(), !C)) {
                if (t.postRun) for (typeof t.postRun == "function" && (t.postRun = [t.postRun]); t.postRun.length; ) {
                  var P = t.postRun.shift();
                  nt.unshift(P);
                }
                Ge(nt);
              }
            }
            if (!(0 < oe)) if (C) e(t), C || Ge(Xe), postMessage({ cmd: "loaded" });
            else {
              if (t.preRun) for (typeof t.preRun == "function" && (t.preRun = [t.preRun]); t.preRun.length; ) L();
              Ge(Je), 0 < oe || (t.setStatus ? (t.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  t.setStatus("");
                }, 1), T();
              }, 1)) : T());
            }
          }
          if (t.UTF8ToString = he, t.stringToUTF8 = function(T, P, k) {
            return Ee(T, c(), P, k);
          }, t.lengthBytesUTF8 = Ie, t.keepRuntimeAlive = Ke, t.wasmMemory = q, t.stackSave = Te, t.stackRestore = xe, t.stackAlloc = jt, t.ExitStatus = We, t.PThread = fe, ve = function T() {
            Rt || cn(), Rt || (ve = T);
          }, t.preInit) for (typeof t.preInit == "function" && (t.preInit = [t.preInit]); 0 < t.preInit.length; ) t.preInit.pop()();
          return cn(), g.ready;
        });
        R.exports = p;
      }, 932: (R, u, b) => {
        var h, p = (h = (h = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0) || "/index.js", function(g) {
          var o, c, f;
          g = g || {}, o || (o = g !== void 0 ? g : {}), o.ready = new Promise(function($, N) {
            c = $, f = N;
          });
          var s, i, t, e, n, r, a = Object.assign({}, o), l = "./this.program", d = ($, N) => {
            throw N;
          }, m = typeof window == "object", y = typeof importScripts == "function", _ = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", v = "";
          _ ? (v = y ? b(908).dirname(v) + "/" : "//", r = () => {
            n || (e = b(1384), n = b(908));
          }, s = function($, N) {
            return r(), $ = n.normalize($), e.readFileSync($, N ? void 0 : "utf8");
          }, t = ($) => (($ = s($, !0)).buffer || ($ = new Uint8Array($)), $), i = ($, N, U) => {
            r(), $ = n.normalize($), e.readFile($, function(B, H) {
              B ? U(B) : N(H.buffer);
            });
          }, 1 < process.argv.length && (l = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), process.on("uncaughtException", function($) {
            if (!($ instanceof Xe)) throw $;
          }), process.on("unhandledRejection", function($) {
            throw $;
          }), d = ($, N) => {
            if (w || 0 < Ce) throw process.exitCode = $, N;
            N instanceof Xe || I("exiting due to exception: " + N), process.exit($);
          }, o.inspect = function() {
            return "[Emscripten Module object]";
          }) : (m || y) && (y ? v = self.location.href : typeof document < "u" && document.currentScript && (v = document.currentScript.src), h && (v = h), v = v.indexOf("blob:") !== 0 ? v.substr(0, v.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", s = ($) => {
            var N = new XMLHttpRequest();
            return N.open("GET", $, !1), N.send(null), N.responseText;
          }, y && (t = ($) => {
            var N = new XMLHttpRequest();
            return N.open("GET", $, !1), N.responseType = "arraybuffer", N.send(null), new Uint8Array(N.response);
          }), i = ($, N, U) => {
            var B = new XMLHttpRequest();
            B.open("GET", $, !0), B.responseType = "arraybuffer", B.onload = () => {
              B.status == 200 || B.status == 0 && B.response ? N(B.response) : U();
            }, B.onerror = U, B.send(null);
          });
          var S, O = o.print || console.log.bind(console), I = o.printErr || console.warn.bind(console);
          Object.assign(o, a), a = null, o.thisProgram && (l = o.thisProgram), o.quit && (d = o.quit), o.wasmBinary && (S = o.wasmBinary);
          var w = o.noExitRuntime || !1;
          typeof WebAssembly != "object" && De("no native wasm support detected");
          var C, V, G, D, A, M, E = !1, F = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
          function W($, N, U) {
            var B = (N >>>= 0) + U;
            for (U = N; $[U] && !(U >= B); ) ++U;
            if (16 < U - N && $.buffer && F) return F.decode($.subarray(N, U));
            for (B = ""; N < U; ) {
              var H = $[N++];
              if (128 & H) {
                var J = 63 & $[N++];
                if ((224 & H) == 192) B += String.fromCharCode((31 & H) << 6 | J);
                else {
                  var ne = 63 & $[N++];
                  65536 > (H = (240 & H) == 224 ? (15 & H) << 12 | J << 6 | ne : (7 & H) << 18 | J << 12 | ne << 6 | 63 & $[N++]) ? B += String.fromCharCode(H) : (H -= 65536, B += String.fromCharCode(55296 | H >> 10, 56320 | 1023 & H));
                }
              } else B += String.fromCharCode(H);
            }
            return B;
          }
          function q($, N) {
            return ($ >>>= 0) ? W(D, $, N) : "";
          }
          function Q($, N, U, B) {
            if (!(0 < B)) return 0;
            var H = U >>>= 0;
            B = U + B - 1;
            for (var J = 0; J < $.length; ++J) {
              var ne = $.charCodeAt(J);
              if (55296 <= ne && 57343 >= ne && (ne = 65536 + ((1023 & ne) << 10) | 1023 & $.charCodeAt(++J)), 127 >= ne) {
                if (U >= B) break;
                N[U++ >>> 0] = ne;
              } else {
                if (2047 >= ne) {
                  if (U + 1 >= B) break;
                  N[U++ >>> 0] = 192 | ne >> 6;
                } else {
                  if (65535 >= ne) {
                    if (U + 2 >= B) break;
                    N[U++ >>> 0] = 224 | ne >> 12;
                  } else {
                    if (U + 3 >= B) break;
                    N[U++ >>> 0] = 240 | ne >> 18, N[U++ >>> 0] = 128 | ne >> 12 & 63;
                  }
                  N[U++ >>> 0] = 128 | ne >> 6 & 63;
                }
                N[U++ >>> 0] = 128 | 63 & ne;
              }
            }
            return N[U >>> 0] = 0, U - H;
          }
          function Z($) {
            for (var N = 0, U = 0; U < $.length; ++U) {
              var B = $.charCodeAt(U);
              127 >= B ? N++ : 2047 >= B ? N += 2 : 55296 <= B && 57343 >= B ? (N += 4, ++U) : N += 3;
            }
            return N;
          }
          function ee() {
            var $ = C.buffer;
            V = $, o.HEAP8 = G = new Int8Array($), o.HEAP16 = new Int16Array($), o.HEAP32 = A = new Int32Array($), o.HEAPU8 = D = new Uint8Array($), o.HEAPU16 = new Uint16Array($), o.HEAPU32 = M = new Uint32Array($), o.HEAPF32 = new Float32Array($), o.HEAPF64 = new Float64Array($);
          }
          var se, me = [], ie = [], _e = [], be = [], Ce = 0;
          function ze() {
            var $ = o.preRun.shift();
            me.unshift($);
          }
          var he, Ee = 0, Ie = null;
          function De($) {
            throw o.onAbort && o.onAbort($), I($ = "Aborted(" + $ + ")"), E = !0, $ = new WebAssembly.RuntimeError($ + ". Build with -sASSERTIONS for more info."), f($), $;
          }
          function ke() {
            return he.startsWith("data:application/octet-stream;base64,");
          }
          if (he = "ort-wasm.wasm", !ke()) {
            var He = he;
            he = o.locateFile ? o.locateFile(He, v) : v + He;
          }
          function Je() {
            var $ = he;
            try {
              if ($ == he && S) return new Uint8Array(S);
              if (t) return t($);
              throw "both async and sync fetching of the wasm failed";
            } catch (N) {
              De(N);
            }
          }
          function Xe($) {
            this.name = "ExitStatus", this.message = "Program terminated with exit(" + $ + ")", this.status = $;
          }
          function tt($) {
            for (; 0 < $.length; ) $.shift()(o);
          }
          var nt = [], Ke = 0, L = 0;
          function te($) {
            this.Db = $, this.zb = $ - 24, this.Ub = function(N) {
              M[this.zb + 4 >> 2 >>> 0] = N;
            }, this.Eb = function() {
              return M[this.zb + 4 >> 2 >>> 0];
            }, this.Sb = function(N) {
              M[this.zb + 8 >> 2 >>> 0] = N;
            }, this.Wb = function() {
              return M[this.zb + 8 >> 2 >>> 0];
            }, this.Tb = function() {
              A[this.zb >> 2 >>> 0] = 0;
            }, this.Ib = function(N) {
              G[this.zb + 12 >> 0 >>> 0] = N ? 1 : 0;
            }, this.Pb = function() {
              return G[this.zb + 12 >> 0 >>> 0] != 0;
            }, this.Jb = function(N) {
              G[this.zb + 13 >> 0 >>> 0] = N ? 1 : 0;
            }, this.Lb = function() {
              return G[this.zb + 13 >> 0 >>> 0] != 0;
            }, this.Rb = function(N, U) {
              this.Fb(0), this.Ub(N), this.Sb(U), this.Tb(), this.Ib(!1), this.Jb(!1);
            }, this.Nb = function() {
              A[this.zb >> 2 >>> 0] += 1;
            }, this.Xb = function() {
              var N = A[this.zb >> 2 >>> 0];
              return A[this.zb >> 2 >>> 0] = N - 1, N === 1;
            }, this.Fb = function(N) {
              M[this.zb + 16 >> 2 >>> 0] = N;
            }, this.Ob = function() {
              return M[this.zb + 16 >> 2 >>> 0];
            }, this.Qb = function() {
              if (mt(this.Eb())) return M[this.Db >> 2 >>> 0];
              var N = this.Ob();
              return N !== 0 ? N : this.Db;
            };
          }
          function oe($) {
            return ct(new te($).zb);
          }
          var ve = [];
          function le($) {
            var N = ve[$];
            return N || ($ >= ve.length && (ve.length = $ + 1), ve[$] = N = se.get($)), N;
          }
          function Fe($) {
            var N = Z($) + 1, U = Re(N);
            return U && Q($, G, U, N), U;
          }
          var pe = {};
          function Ze() {
            if (!We) {
              var $, N = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: l || "./this.program" };
              for ($ in pe) pe[$] === void 0 ? delete N[$] : N[$] = pe[$];
              var U = [];
              for ($ in N) U.push($ + "=" + N[$]);
              We = U;
            }
            return We;
          }
          var We, Ve = [null, [], []];
          function Qe($, N) {
            var U = Ve[$];
            N === 0 || N === 10 ? (($ === 1 ? O : I)(W(U, 0)), U.length = 0) : U.push(N);
          }
          var je = 0;
          function Ye($) {
            return $ % 4 == 0 && ($ % 100 != 0 || $ % 400 == 0);
          }
          var fe = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Ge = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          function It($, N, U, B) {
            function H(X, Pe, Ne) {
              for (X = typeof X == "number" ? X.toString() : X || ""; X.length < Pe; ) X = Ne[0] + X;
              return X;
            }
            function J(X, Pe) {
              return H(X, Pe, "0");
            }
            function ne(X, Pe) {
              function Ne(st) {
                return 0 > st ? -1 : 0 < st ? 1 : 0;
              }
              var rt;
              return (rt = Ne(X.getFullYear() - Pe.getFullYear())) === 0 && (rt = Ne(X.getMonth() - Pe.getMonth())) === 0 && (rt = Ne(X.getDate() - Pe.getDate())), rt;
            }
            function ue(X) {
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
            function ae(X) {
              var Pe = X.Bb;
              for (X = new Date(new Date(X.Cb + 1900, 0, 1).getTime()); 0 < Pe; ) {
                var Ne = X.getMonth(), rt = (Ye(X.getFullYear()) ? fe : Ge)[Ne];
                if (!(Pe > rt - X.getDate())) {
                  X.setDate(X.getDate() + Pe);
                  break;
                }
                Pe -= rt - X.getDate() + 1, X.setDate(1), 11 > Ne ? X.setMonth(Ne + 1) : (X.setMonth(0), X.setFullYear(X.getFullYear() + 1));
              }
              return Ne = new Date(X.getFullYear() + 1, 0, 4), Pe = ue(new Date(X.getFullYear(), 0, 4)), Ne = ue(Ne), 0 >= ne(Pe, X) ? 0 >= ne(Ne, X) ? X.getFullYear() + 1 : X.getFullYear() : X.getFullYear() - 1;
            }
            var we = A[B + 40 >> 2 >>> 0];
            for (var Me in B = { $b: A[B >> 2 >>> 0], Zb: A[B + 4 >> 2 >>> 0], Gb: A[B + 8 >> 2 >>> 0], Kb: A[B + 12 >> 2 >>> 0], Hb: A[B + 16 >> 2 >>> 0], Cb: A[B + 20 >> 2 >>> 0], Ab: A[B + 24 >> 2 >>> 0], Bb: A[B + 28 >> 2 >>> 0], bc: A[B + 32 >> 2 >>> 0], Yb: A[B + 36 >> 2 >>> 0], ac: we ? q(we) : "" }, U = q(U), we = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" }) U = U.replace(new RegExp(Me, "g"), we[Me]);
            var qe = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), Be = "January February March April May June July August September October November December".split(" ");
            for (Me in we = { "%a": function(X) {
              return qe[X.Ab].substring(0, 3);
            }, "%A": function(X) {
              return qe[X.Ab];
            }, "%b": function(X) {
              return Be[X.Hb].substring(0, 3);
            }, "%B": function(X) {
              return Be[X.Hb];
            }, "%C": function(X) {
              return J((X.Cb + 1900) / 100 | 0, 2);
            }, "%d": function(X) {
              return J(X.Kb, 2);
            }, "%e": function(X) {
              return H(X.Kb, 2, " ");
            }, "%g": function(X) {
              return ae(X).toString().substring(2);
            }, "%G": function(X) {
              return ae(X);
            }, "%H": function(X) {
              return J(X.Gb, 2);
            }, "%I": function(X) {
              return (X = X.Gb) == 0 ? X = 12 : 12 < X && (X -= 12), J(X, 2);
            }, "%j": function(X) {
              for (var Pe = 0, Ne = 0; Ne <= X.Hb - 1; Pe += (Ye(X.Cb + 1900) ? fe : Ge)[Ne++]) ;
              return J(X.Kb + Pe, 3);
            }, "%m": function(X) {
              return J(X.Hb + 1, 2);
            }, "%M": function(X) {
              return J(X.Zb, 2);
            }, "%n": function() {
              return `
`;
            }, "%p": function(X) {
              return 0 <= X.Gb && 12 > X.Gb ? "AM" : "PM";
            }, "%S": function(X) {
              return J(X.$b, 2);
            }, "%t": function() {
              return "	";
            }, "%u": function(X) {
              return X.Ab || 7;
            }, "%U": function(X) {
              return J(Math.floor((X.Bb + 7 - X.Ab) / 7), 2);
            }, "%V": function(X) {
              var Pe = Math.floor((X.Bb + 7 - (X.Ab + 6) % 7) / 7);
              if (2 >= (X.Ab + 371 - X.Bb - 2) % 7 && Pe++, Pe) Pe == 53 && ((Ne = (X.Ab + 371 - X.Bb) % 7) == 4 || Ne == 3 && Ye(X.Cb) || (Pe = 1));
              else {
                Pe = 52;
                var Ne = (X.Ab + 7 - X.Bb - 1) % 7;
                (Ne == 4 || Ne == 5 && Ye(X.Cb % 400 - 1)) && Pe++;
              }
              return J(Pe, 2);
            }, "%w": function(X) {
              return X.Ab;
            }, "%W": function(X) {
              return J(Math.floor((X.Bb + 7 - (X.Ab + 6) % 7) / 7), 2);
            }, "%y": function(X) {
              return (X.Cb + 1900).toString().substring(2);
            }, "%Y": function(X) {
              return X.Cb + 1900;
            }, "%z": function(X) {
              var Pe = 0 <= (X = X.Yb);
              return X = Math.abs(X) / 60, (Pe ? "+" : "-") + ("0000" + (X / 60 * 100 + X % 60)).slice(-4);
            }, "%Z": function(X) {
              return X.ac;
            }, "%%": function() {
              return "%";
            } }, U = U.replace(/%%/g, "\0\0"), we) U.includes(Me) && (U = U.replace(new RegExp(Me, "g"), we[Me](B)));
            return Me = function(X) {
              var Pe = Array(Z(X) + 1);
              return Q(X, Pe, 0, Pe.length), Pe;
            }(U = U.replace(/\0\0/g, "%")), Me.length > N ? 0 : (G.set(Me, $ >>> 0), Me.length - 1);
          }
          var Pt = { a: function($) {
            return Re($ + 24) + 24;
          }, m: function($) {
            return ($ = new te($)).Pb() || ($.Ib(!0), Ke--), $.Jb(!1), nt.push($), $.Nb(), $.Qb();
          }, ia: function($) {
            throw I("Unexpected exception thrown, this is not properly supported - aborting"), E = !0, $;
          }, w: function() {
            ye(0);
            var $ = nt.pop();
            if ($.Xb() && !$.Lb()) {
              var N = $.Wb();
              N && le(N)($.Db), oe($.Db);
            }
            L = 0;
          }, d: function() {
            var $ = L;
            if (!$) return je = 0;
            var N = new te($);
            N.Fb($);
            var U = N.Eb();
            if (!U) return je = 0, $;
            for (var B = Array.prototype.slice.call(arguments), H = 0; H < B.length; H++) {
              var J = B[H];
              if (J === 0 || J === U) break;
              if (ft(J, U, N.zb + 16)) return je = J, $;
            }
            return je = U, $;
          }, k: function() {
            var $ = L;
            if (!$) return je = 0;
            var N = new te($);
            N.Fb($);
            var U = N.Eb();
            if (!U) return je = 0, $;
            for (var B = Array.prototype.slice.call(arguments), H = 0; H < B.length; H++) {
              var J = B[H];
              if (J === 0 || J === U) break;
              if (ft(J, U, N.zb + 16)) return je = J, $;
            }
            return je = U, $;
          }, g: function() {
            var $ = L;
            if (!$) return je = 0;
            var N = new te($);
            N.Fb($);
            var U = N.Eb();
            if (!U) return je = 0, $;
            for (var B = Array.prototype.slice.call(arguments), H = 0; H < B.length; H++) {
              var J = B[H];
              if (J === 0 || J === U) break;
              if (ft(J, U, N.zb + 16)) return je = J, $;
            }
            return je = U, $;
          }, s: oe, L: function() {
            var $ = nt.pop();
            $ || De("no exception to throw");
            var N = $.Db;
            throw $.Lb() || (nt.push($), $.Jb(!0), $.Ib(!1), Ke++), L = N, N;
          }, b: function($, N, U) {
            throw new te($).Rb(N, U), L = $, Ke++, $;
          }, la: function() {
            return Ke;
          }, i: function($) {
            throw L || (L = $), $;
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
            De("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
          }, Ia: function() {
            De("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
          }, S: function() {
            return Date.now();
          }, Ca: function() {
            return !0;
          }, Da: function($, N) {
            $ = new Date(1e3 * (M[$ >>> 2] + 4294967296 * A[$ + 4 >>> 2])), A[N >> 2 >>> 0] = $.getUTCSeconds(), A[N + 4 >> 2 >>> 0] = $.getUTCMinutes(), A[N + 8 >> 2 >>> 0] = $.getUTCHours(), A[N + 12 >> 2 >>> 0] = $.getUTCDate(), A[N + 16 >> 2 >>> 0] = $.getUTCMonth(), A[N + 20 >> 2 >>> 0] = $.getUTCFullYear() - 1900, A[N + 24 >> 2 >>> 0] = $.getUTCDay(), A[N + 28 >> 2 >>> 0] = ($.getTime() - Date.UTC($.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0;
          }, Ea: function($, N) {
            $ = new Date(1e3 * (M[$ >>> 2] + 4294967296 * A[$ + 4 >>> 2])), A[N >> 2 >>> 0] = $.getSeconds(), A[N + 4 >> 2 >>> 0] = $.getMinutes(), A[N + 8 >> 2 >>> 0] = $.getHours(), A[N + 12 >> 2 >>> 0] = $.getDate(), A[N + 16 >> 2 >>> 0] = $.getMonth(), A[N + 20 >> 2 >>> 0] = $.getFullYear() - 1900, A[N + 24 >> 2 >>> 0] = $.getDay();
            var U = new Date($.getFullYear(), 0, 1);
            A[N + 28 >> 2 >>> 0] = ($.getTime() - U.getTime()) / 864e5 | 0, A[N + 36 >> 2 >>> 0] = -60 * $.getTimezoneOffset();
            var B = new Date($.getFullYear(), 6, 1).getTimezoneOffset();
            U = U.getTimezoneOffset(), A[N + 32 >> 2 >>> 0] = 0 | (B != U && $.getTimezoneOffset() == Math.min(U, B));
          }, Fa: function($) {
            var N = new Date(A[$ + 20 >> 2 >>> 0] + 1900, A[$ + 16 >> 2 >>> 0], A[$ + 12 >> 2 >>> 0], A[$ + 8 >> 2 >>> 0], A[$ + 4 >> 2 >>> 0], A[$ >> 2 >>> 0], 0), U = A[$ + 32 >> 2 >>> 0], B = N.getTimezoneOffset(), H = new Date(N.getFullYear(), 0, 1), J = new Date(N.getFullYear(), 6, 1).getTimezoneOffset(), ne = H.getTimezoneOffset(), ue = Math.min(ne, J);
            return 0 > U ? A[$ + 32 >> 2 >>> 0] = +(J != ne && ue == B) : 0 < U != (ue == B) && (J = Math.max(ne, J), N.setTime(N.getTime() + 6e4 * ((0 < U ? ue : J) - B))), A[$ + 24 >> 2 >>> 0] = N.getDay(), A[$ + 28 >> 2 >>> 0] = (N.getTime() - H.getTime()) / 864e5 | 0, A[$ >> 2 >>> 0] = N.getSeconds(), A[$ + 4 >> 2 >>> 0] = N.getMinutes(), A[$ + 8 >> 2 >>> 0] = N.getHours(), A[$ + 12 >> 2 >>> 0] = N.getDate(), A[$ + 16 >> 2 >>> 0] = N.getMonth(), N.getTime() / 1e3 | 0;
          }, sa: function() {
            return -52;
          }, ta: function() {
          }, Ga: function $(N, U, B) {
            $.Vb || ($.Vb = !0, function(H, J, ne) {
              function ue(Be) {
                return (Be = Be.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? Be[1] : "GMT";
              }
              var ae = (/* @__PURE__ */ new Date()).getFullYear(), we = new Date(ae, 0, 1), Me = new Date(ae, 6, 1);
              ae = we.getTimezoneOffset();
              var qe = Me.getTimezoneOffset();
              A[H >> 2 >>> 0] = 60 * Math.max(ae, qe), A[J >> 2 >>> 0] = +(ae != qe), H = ue(we), J = ue(Me), H = Fe(H), J = Fe(J), qe < ae ? (M[ne >> 2 >>> 0] = H, M[ne + 4 >> 2 >>> 0] = J) : (M[ne >> 2 >>> 0] = J, M[ne + 4 >> 2 >>> 0] = H);
            }(N, U, B));
          }, B: function() {
            De("");
          }, ma: function() {
            return 4294901760;
          }, I: _ ? () => {
            var $ = process.hrtime();
            return 1e3 * $[0] + $[1] / 1e6;
          } : () => performance.now(), xa: function($, N, U) {
            D.copyWithin($ >>> 0, N >>> 0, N + U >>> 0);
          }, G: function($) {
            var N = D.length;
            if (4294901760 < ($ >>>= 0)) return !1;
            for (var U = 1; 4 >= U; U *= 2) {
              var B = N * (1 + 0.2 / U);
              B = Math.min(B, $ + 100663296);
              var H = Math;
              B = Math.max($, B), H = H.min.call(H, 4294901760, B + (65536 - B % 65536) % 65536);
              e: {
                try {
                  C.grow(H - V.byteLength + 65535 >>> 16), ee();
                  var J = 1;
                  break e;
                } catch {
                }
                J = void 0;
              }
              if (J) return !0;
            }
            return !1;
          }, va: function($, N) {
            var U = 0;
            return Ze().forEach(function(B, H) {
              var J = N + U;
              for (H = M[$ + 4 * H >> 2 >>> 0] = J, J = 0; J < B.length; ++J) G[H++ >> 0 >>> 0] = B.charCodeAt(J);
              G[H >> 0 >>> 0] = 0, U += B.length + 1;
            }), 0;
          }, wa: function($, N) {
            var U = Ze();
            M[$ >> 2 >>> 0] = U.length;
            var B = 0;
            return U.forEach(function(H) {
              B += H.length + 1;
            }), M[N >> 2 >>> 0] = B, 0;
          }, ba: function($) {
            w || 0 < Ce || (lt(), tt(_e), ht(0), Ve[1].length && Qe(1, 10), Ve[2].length && Qe(2, 10)), w || 0 < Ce || (o.onExit && o.onExit($), E = !0), d($, new Xe($));
          }, E: function() {
            return 52;
          }, Q: function() {
            return 52;
          }, ca: function() {
            return 70;
          }, P: function($, N, U, B) {
            for (var H = 0, J = 0; J < U; J++) {
              var ne = M[N >> 2 >>> 0], ue = M[N + 4 >> 2 >>> 0];
              N += 8;
              for (var ae = 0; ae < ue; ae++) Qe($, D[ne + ae >>> 0]);
              H += ue;
            }
            return M[B >> 2 >>> 0] = H, 0;
          }, c: function() {
            return je;
          }, ja: function $(N, U) {
            $.Mb || ($.Mb = function() {
              if (typeof crypto == "object" && typeof crypto.getRandomValues == "function") {
                var H = new Uint8Array(1);
                return () => (crypto.getRandomValues(H), H[0]);
              }
              if (_) try {
                var J = b(Object(function() {
                  var ne = new Error("Cannot find module 'crypto'");
                  throw ne.code = "MODULE_NOT_FOUND", ne;
                }()));
                return () => J.randomBytes(1)[0];
              } catch {
              }
              return () => De("randomDevice");
            }());
            for (var B = 0; B < U; B++) G[N + B >> 0 >>> 0] = $.Mb();
            return 0;
          }, ea: function($, N, U) {
            var B = de();
            try {
              return le($)(N, U);
            } catch (H) {
              if (ge(B), H !== H + 0) throw H;
              ye(1, 0);
            }
          }, fa: function($, N, U) {
            var B = de();
            try {
              return le($)(N, U);
            } catch (H) {
              if (ge(B), H !== H + 0) throw H;
              ye(1, 0);
            }
          }, J: function($) {
            var N = de();
            try {
              return le($)();
            } catch (U) {
              if (ge(N), U !== U + 0) throw U;
              ye(1, 0);
            }
          }, e: function($, N) {
            var U = de();
            try {
              return le($)(N);
            } catch (B) {
              if (ge(U), B !== B + 0) throw B;
              ye(1, 0);
            }
          }, N: function($, N, U) {
            var B = de();
            try {
              return le($)(N, U);
            } catch (H) {
              if (ge(B), H !== H + 0) throw H;
              ye(1, 0);
            }
          }, O: function($, N, U) {
            var B = de();
            try {
              return le($)(N, U);
            } catch (H) {
              if (ge(B), H !== H + 0) throw H;
              ye(1, 0);
            }
          }, j: function($, N, U) {
            var B = de();
            try {
              return le($)(N, U);
            } catch (H) {
              if (ge(B), H !== H + 0) throw H;
              ye(1, 0);
            }
          }, o: function($, N, U, B) {
            var H = de();
            try {
              return le($)(N, U, B);
            } catch (J) {
              if (ge(H), J !== J + 0) throw J;
              ye(1, 0);
            }
          }, p: function($, N, U, B, H) {
            var J = de();
            try {
              return le($)(N, U, B, H);
            } catch (ne) {
              if (ge(J), ne !== ne + 0) throw ne;
              ye(1, 0);
            }
          }, M: function($, N, U, B, H, J) {
            var ne = de();
            try {
              return le($)(N, U, B, H, J);
            } catch (ue) {
              if (ge(ne), ue !== ue + 0) throw ue;
              ye(1, 0);
            }
          }, r: function($, N, U, B, H, J) {
            var ne = de();
            try {
              return le($)(N, U, B, H, J);
            } catch (ue) {
              if (ge(ne), ue !== ue + 0) throw ue;
              ye(1, 0);
            }
          }, v: function($, N, U, B, H, J, ne) {
            var ue = de();
            try {
              return le($)(N, U, B, H, J, ne);
            } catch (ae) {
              if (ge(ue), ae !== ae + 0) throw ae;
              ye(1, 0);
            }
          }, K: function($, N, U, B, H, J, ne, ue) {
            var ae = de();
            try {
              return le($)(N, U, B, H, J, ne, ue);
            } catch (we) {
              if (ge(ae), we !== we + 0) throw we;
              ye(1, 0);
            }
          }, D: function($, N, U, B, H, J, ne, ue, ae, we, Me, qe) {
            var Be = de();
            try {
              return le($)(N, U, B, H, J, ne, ue, ae, we, Me, qe);
            } catch (X) {
              if (ge(Be), X !== X + 0) throw X;
              ye(1, 0);
            }
          }, X: function($, N, U, B, H, J, ne, ue) {
            var ae = de();
            try {
              return Ot($, N, U, B, H, J, ne, ue);
            } catch (we) {
              if (ge(ae), we !== we + 0) throw we;
              ye(1, 0);
            }
          }, V: function($, N, U, B, H, J, ne) {
            var ue = de();
            try {
              return yt($, N, U, B, H, J, ne);
            } catch (ae) {
              if (ge(ue), ae !== ae + 0) throw ae;
              ye(1, 0);
            }
          }, U: function($, N, U, B, H) {
            var J = de();
            try {
              return At($, N, U, B, H);
            } catch (ne) {
              if (ge(J), ne !== ne + 0) throw ne;
              ye(1, 0);
            }
          }, Z: function($, N, U, B) {
            var H = de();
            try {
              return Tt($, N, U, B);
            } catch (J) {
              if (ge(H), J !== J + 0) throw J;
              ye(1, 0);
            }
          }, W: function($) {
            var N = de();
            try {
              return bt($);
            } catch (U) {
              if (ge(N), U !== U + 0) throw U;
              ye(1, 0);
            }
          }, Y: function($, N) {
            var U = de();
            try {
              return St($, N);
            } catch (B) {
              if (ge(U), B !== B + 0) throw B;
              ye(1, 0);
            }
          }, T: function($, N, U) {
            var B = de();
            try {
              return vt($, N, U);
            } catch (H) {
              if (ge(B), H !== H + 0) throw H;
              ye(1, 0);
            }
          }, f: function($) {
            var N = de();
            try {
              le($)();
            } catch (U) {
              if (ge(N), U !== U + 0) throw U;
              ye(1, 0);
            }
          }, q: function($, N) {
            var U = de();
            try {
              le($)(N);
            } catch (B) {
              if (ge(U), B !== B + 0) throw B;
              ye(1, 0);
            }
          }, h: function($, N, U) {
            var B = de();
            try {
              le($)(N, U);
            } catch (H) {
              if (ge(B), H !== H + 0) throw H;
              ye(1, 0);
            }
          }, da: function($, N, U, B) {
            var H = de();
            try {
              le($)(N, U, B);
            } catch (J) {
              if (ge(H), J !== J + 0) throw J;
              ye(1, 0);
            }
          }, l: function($, N, U, B) {
            var H = de();
            try {
              le($)(N, U, B);
            } catch (J) {
              if (ge(H), J !== J + 0) throw J;
              ye(1, 0);
            }
          }, t: function($, N, U, B, H) {
            var J = de();
            try {
              le($)(N, U, B, H);
            } catch (ne) {
              if (ge(J), ne !== ne + 0) throw ne;
              ye(1, 0);
            }
          }, u: function($, N, U, B, H, J) {
            var ne = de();
            try {
              le($)(N, U, B, H, J);
            } catch (ue) {
              if (ge(ne), ue !== ue + 0) throw ue;
              ye(1, 0);
            }
          }, x: function($, N, U, B, H, J, ne) {
            var ue = de();
            try {
              le($)(N, U, B, H, J, ne);
            } catch (ae) {
              if (ge(ue), ae !== ae + 0) throw ae;
              ye(1, 0);
            }
          }, z: function($, N, U, B, H, J, ne, ue) {
            var ae = de();
            try {
              le($)(N, U, B, H, J, ne, ue);
            } catch (we) {
              if (ge(ae), we !== we + 0) throw we;
              ye(1, 0);
            }
          }, ga: function($, N, U, B, H, J, ne, ue, ae) {
            var we = de();
            try {
              le($)(N, U, B, H, J, ne, ue, ae);
            } catch (Me) {
              if (ge(we), Me !== Me + 0) throw Me;
              ye(1, 0);
            }
          }, A: function($, N, U, B, H, J, ne, ue, ae, we, Me) {
            var qe = de();
            try {
              le($)(N, U, B, H, J, ne, ue, ae, we, Me);
            } catch (Be) {
              if (ge(qe), Be !== Be + 0) throw Be;
              ye(1, 0);
            }
          }, C: function($, N, U, B, H, J, ne, ue, ae, we, Me, qe, Be, X, Pe, Ne) {
            var rt = de();
            try {
              le($)(N, U, B, H, J, ne, ue, ae, we, Me, qe, Be, X, Pe, Ne);
            } catch (st) {
              if (ge(rt), st !== st + 0) throw st;
              ye(1, 0);
            }
          }, aa: function($, N, U, B, H, J, ne, ue) {
            var ae = de();
            try {
              _t($, N, U, B, H, J, ne, ue);
            } catch (we) {
              if (ge(ae), we !== we + 0) throw we;
              ye(1, 0);
            }
          }, _: function($, N, U, B, H, J, ne, ue, ae, we, Me, qe) {
            var Be = de();
            try {
              xt($, N, U, B, H, J, ne, ue, ae, we, Me, qe);
            } catch (X) {
              if (ge(Be), X !== X + 0) throw X;
              ye(1, 0);
            }
          }, $: function($, N, U, B, H, J) {
            var ne = de();
            try {
              wt($, N, U, B, H, J);
            } catch (ue) {
              if (ge(ne), ue !== ue + 0) throw ue;
              ye(1, 0);
            }
          }, n: function($) {
            return $;
          }, F: function($) {
            je = $;
          }, ha: It, y: function($, N, U, B) {
            return It($, N, U, B);
          } };
          (function() {
            function $(H) {
              o.asm = H.exports, C = o.asm.Ka, ee(), se = o.asm.ib, ie.unshift(o.asm.La), Ee--, o.monitorRunDependencies && o.monitorRunDependencies(Ee), Ee == 0 && Ie && (H = Ie, Ie = null, H());
            }
            function N(H) {
              $(H.instance);
            }
            function U(H) {
              return function() {
                if (!S && (m || y)) {
                  if (typeof fetch == "function" && !he.startsWith("file://")) return fetch(he, { credentials: "same-origin" }).then(function(J) {
                    if (!J.ok) throw "failed to load wasm binary file at '" + he + "'";
                    return J.arrayBuffer();
                  }).catch(function() {
                    return Je();
                  });
                  if (i) return new Promise(function(J, ne) {
                    i(he, function(ue) {
                      J(new Uint8Array(ue));
                    }, ne);
                  });
                }
                return Promise.resolve().then(function() {
                  return Je();
                });
              }().then(function(J) {
                return WebAssembly.instantiate(J, B);
              }).then(function(J) {
                return J;
              }).then(H, function(J) {
                I("failed to asynchronously prepare wasm: " + J), De(J);
              });
            }
            var B = { a: Pt };
            if (Ee++, o.monitorRunDependencies && o.monitorRunDependencies(Ee), o.instantiateWasm) try {
              return o.instantiateWasm(B, $);
            } catch (H) {
              return I("Module.instantiateWasm callback failed with error: " + H), !1;
            }
            (S || typeof WebAssembly.instantiateStreaming != "function" || ke() || he.startsWith("file://") || _ || typeof fetch != "function" ? U(N) : fetch(he, { credentials: "same-origin" }).then(function(H) {
              return WebAssembly.instantiateStreaming(H, B).then(N, function(J) {
                return I("wasm streaming compile failed: " + J), I("falling back to ArrayBuffer instantiation"), U(N);
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
          var at, Re = o._malloc = function() {
            return (Re = o._malloc = o.asm.eb).apply(null, arguments);
          }, ct = o._free = function() {
            return (ct = o._free = o.asm.fb).apply(null, arguments);
          }, ht = o._fflush = function() {
            return (ht = o._fflush = o.asm.gb).apply(null, arguments);
          }, lt = o.___funcs_on_exit = function() {
            return (lt = o.___funcs_on_exit = o.asm.hb).apply(null, arguments);
          }, ye = o._setThrew = function() {
            return (ye = o._setThrew = o.asm.jb).apply(null, arguments);
          }, de = o.stackSave = function() {
            return (de = o.stackSave = o.asm.kb).apply(null, arguments);
          }, ge = o.stackRestore = function() {
            return (ge = o.stackRestore = o.asm.lb).apply(null, arguments);
          }, gt = o.stackAlloc = function() {
            return (gt = o.stackAlloc = o.asm.mb).apply(null, arguments);
          }, ft = o.___cxa_can_catch = function() {
            return (ft = o.___cxa_can_catch = o.asm.nb).apply(null, arguments);
          }, mt = o.___cxa_is_pointer_type = function() {
            return (mt = o.___cxa_is_pointer_type = o.asm.ob).apply(null, arguments);
          }, bt = o.dynCall_j = function() {
            return (bt = o.dynCall_j = o.asm.pb).apply(null, arguments);
          }, yt = o.dynCall_iiiiij = function() {
            return (yt = o.dynCall_iiiiij = o.asm.qb).apply(null, arguments);
          }, vt = o.dynCall_jii = function() {
            return (vt = o.dynCall_jii = o.asm.rb).apply(null, arguments);
          }, _t = o.dynCall_viiiiij = function() {
            return (_t = o.dynCall_viiiiij = o.asm.sb).apply(null, arguments);
          }, wt = o.dynCall_vjji = function() {
            return (wt = o.dynCall_vjji = o.asm.tb).apply(null, arguments);
          }, xt = o.dynCall_viiijjjii = function() {
            return (xt = o.dynCall_viiijjjii = o.asm.ub).apply(null, arguments);
          }, Tt = o.dynCall_iij = function() {
            return (Tt = o.dynCall_iij = o.asm.vb).apply(null, arguments);
          }, St = o.dynCall_ji = function() {
            return (St = o.dynCall_ji = o.asm.wb).apply(null, arguments);
          }, Ot = o.dynCall_iiiiiij = function() {
            return (Ot = o.dynCall_iiiiiij = o.asm.xb).apply(null, arguments);
          }, At = o.dynCall_iiij = function() {
            return (At = o.dynCall_iiij = o.asm.yb).apply(null, arguments);
          };
          function Et() {
            function $() {
              if (!at && (at = !0, o.calledRun = !0, !E)) {
                if (tt(ie), c(o), o.onRuntimeInitialized && o.onRuntimeInitialized(), o.postRun) for (typeof o.postRun == "function" && (o.postRun = [o.postRun]); o.postRun.length; ) {
                  var N = o.postRun.shift();
                  be.unshift(N);
                }
                tt(be);
              }
            }
            if (!(0 < Ee)) {
              if (o.preRun) for (typeof o.preRun == "function" && (o.preRun = [o.preRun]); o.preRun.length; ) ze();
              tt(me), 0 < Ee || (o.setStatus ? (o.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  o.setStatus("");
                }, 1), $();
              }, 1)) : $());
            }
          }
          if (o.UTF8ToString = q, o.stringToUTF8 = function($, N, U) {
            return Q($, D, N, U);
          }, o.lengthBytesUTF8 = Z, o.stackSave = de, o.stackRestore = ge, o.stackAlloc = gt, Ie = function $() {
            at || Et(), at || (Ie = $);
          }, o.preInit) for (typeof o.preInit == "function" && (o.preInit = [o.preInit]); 0 < o.preInit.length; ) o.preInit.pop()();
          return Et(), g.ready;
        });
        R.exports = p;
      }, 4537: (R) => {
        R.exports = function(u, b) {
          for (var h = new Array(arguments.length - 1), p = 0, g = 2, o = !0; g < arguments.length; ) h[p++] = arguments[g++];
          return new Promise(function(c, f) {
            h[p] = function(s) {
              if (o) if (o = !1, s) f(s);
              else {
                for (var i = new Array(arguments.length - 1), t = 0; t < i.length; ) i[t++] = arguments[t];
                c.apply(null, i);
              }
            };
            try {
              u.apply(b || null, h);
            } catch (s) {
              o && (o = !1, f(s));
            }
          });
        };
      }, 7419: (R, u) => {
        var b = u;
        b.length = function(c) {
          var f = c.length;
          if (!f) return 0;
          for (var s = 0; --f % 4 > 1 && c.charAt(f) === "="; ) ++s;
          return Math.ceil(3 * c.length) / 4 - s;
        };
        for (var h = new Array(64), p = new Array(123), g = 0; g < 64; ) p[h[g] = g < 26 ? g + 65 : g < 52 ? g + 71 : g < 62 ? g - 4 : g - 59 | 43] = g++;
        b.encode = function(c, f, s) {
          for (var i, t = null, e = [], n = 0, r = 0; f < s; ) {
            var a = c[f++];
            switch (r) {
              case 0:
                e[n++] = h[a >> 2], i = (3 & a) << 4, r = 1;
                break;
              case 1:
                e[n++] = h[i | a >> 4], i = (15 & a) << 2, r = 2;
                break;
              case 2:
                e[n++] = h[i | a >> 6], e[n++] = h[63 & a], r = 0;
            }
            n > 8191 && ((t || (t = [])).push(String.fromCharCode.apply(String, e)), n = 0);
          }
          return r && (e[n++] = h[i], e[n++] = 61, r === 1 && (e[n++] = 61)), t ? (n && t.push(String.fromCharCode.apply(String, e.slice(0, n))), t.join("")) : String.fromCharCode.apply(String, e.slice(0, n));
        };
        var o = "invalid encoding";
        b.decode = function(c, f, s) {
          for (var i, t = s, e = 0, n = 0; n < c.length; ) {
            var r = c.charCodeAt(n++);
            if (r === 61 && e > 1) break;
            if ((r = p[r]) === void 0) throw Error(o);
            switch (e) {
              case 0:
                i = r, e = 1;
                break;
              case 1:
                f[s++] = i << 2 | (48 & r) >> 4, i = r, e = 2;
                break;
              case 2:
                f[s++] = (15 & i) << 4 | (60 & r) >> 2, i = r, e = 3;
                break;
              case 3:
                f[s++] = (3 & i) << 6 | r, e = 0;
            }
          }
          if (e === 1) throw Error(o);
          return s - t;
        }, b.test = function(c) {
          return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(c);
        };
      }, 9211: (R) => {
        function u() {
          this._listeners = {};
        }
        R.exports = u, u.prototype.on = function(b, h, p) {
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
      }, 945: (R) => {
        function u(o) {
          return typeof Float32Array < "u" ? function() {
            var c = new Float32Array([-0]), f = new Uint8Array(c.buffer), s = f[3] === 128;
            function i(r, a, l) {
              c[0] = r, a[l] = f[0], a[l + 1] = f[1], a[l + 2] = f[2], a[l + 3] = f[3];
            }
            function t(r, a, l) {
              c[0] = r, a[l] = f[3], a[l + 1] = f[2], a[l + 2] = f[1], a[l + 3] = f[0];
            }
            function e(r, a) {
              return f[0] = r[a], f[1] = r[a + 1], f[2] = r[a + 2], f[3] = r[a + 3], c[0];
            }
            function n(r, a) {
              return f[3] = r[a], f[2] = r[a + 1], f[1] = r[a + 2], f[0] = r[a + 3], c[0];
            }
            o.writeFloatLE = s ? i : t, o.writeFloatBE = s ? t : i, o.readFloatLE = s ? e : n, o.readFloatBE = s ? n : e;
          }() : function() {
            function c(s, i, t, e) {
              var n = i < 0 ? 1 : 0;
              if (n && (i = -i), i === 0) s(1 / i > 0 ? 0 : 2147483648, t, e);
              else if (isNaN(i)) s(2143289344, t, e);
              else if (i > 34028234663852886e22) s((n << 31 | 2139095040) >>> 0, t, e);
              else if (i < 11754943508222875e-54) s((n << 31 | Math.round(i / 1401298464324817e-60)) >>> 0, t, e);
              else {
                var r = Math.floor(Math.log(i) / Math.LN2);
                s((n << 31 | r + 127 << 23 | 8388607 & Math.round(i * Math.pow(2, -r) * 8388608)) >>> 0, t, e);
              }
            }
            function f(s, i, t) {
              var e = s(i, t), n = 2 * (e >> 31) + 1, r = e >>> 23 & 255, a = 8388607 & e;
              return r === 255 ? a ? NaN : n * (1 / 0) : r === 0 ? 1401298464324817e-60 * n * a : n * Math.pow(2, r - 150) * (a + 8388608);
            }
            o.writeFloatLE = c.bind(null, b), o.writeFloatBE = c.bind(null, h), o.readFloatLE = f.bind(null, p), o.readFloatBE = f.bind(null, g);
          }(), typeof Float64Array < "u" ? function() {
            var c = new Float64Array([-0]), f = new Uint8Array(c.buffer), s = f[7] === 128;
            function i(r, a, l) {
              c[0] = r, a[l] = f[0], a[l + 1] = f[1], a[l + 2] = f[2], a[l + 3] = f[3], a[l + 4] = f[4], a[l + 5] = f[5], a[l + 6] = f[6], a[l + 7] = f[7];
            }
            function t(r, a, l) {
              c[0] = r, a[l] = f[7], a[l + 1] = f[6], a[l + 2] = f[5], a[l + 3] = f[4], a[l + 4] = f[3], a[l + 5] = f[2], a[l + 6] = f[1], a[l + 7] = f[0];
            }
            function e(r, a) {
              return f[0] = r[a], f[1] = r[a + 1], f[2] = r[a + 2], f[3] = r[a + 3], f[4] = r[a + 4], f[5] = r[a + 5], f[6] = r[a + 6], f[7] = r[a + 7], c[0];
            }
            function n(r, a) {
              return f[7] = r[a], f[6] = r[a + 1], f[5] = r[a + 2], f[4] = r[a + 3], f[3] = r[a + 4], f[2] = r[a + 5], f[1] = r[a + 6], f[0] = r[a + 7], c[0];
            }
            o.writeDoubleLE = s ? i : t, o.writeDoubleBE = s ? t : i, o.readDoubleLE = s ? e : n, o.readDoubleBE = s ? n : e;
          }() : function() {
            function c(s, i, t, e, n, r) {
              var a = e < 0 ? 1 : 0;
              if (a && (e = -e), e === 0) s(0, n, r + i), s(1 / e > 0 ? 0 : 2147483648, n, r + t);
              else if (isNaN(e)) s(0, n, r + i), s(2146959360, n, r + t);
              else if (e > 17976931348623157e292) s(0, n, r + i), s((a << 31 | 2146435072) >>> 0, n, r + t);
              else {
                var l;
                if (e < 22250738585072014e-324) s((l = e / 5e-324) >>> 0, n, r + i), s((a << 31 | l / 4294967296) >>> 0, n, r + t);
                else {
                  var d = Math.floor(Math.log(e) / Math.LN2);
                  d === 1024 && (d = 1023), s(4503599627370496 * (l = e * Math.pow(2, -d)) >>> 0, n, r + i), s((a << 31 | d + 1023 << 20 | 1048576 * l & 1048575) >>> 0, n, r + t);
                }
              }
            }
            function f(s, i, t, e, n) {
              var r = s(e, n + i), a = s(e, n + t), l = 2 * (a >> 31) + 1, d = a >>> 20 & 2047, m = 4294967296 * (1048575 & a) + r;
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
        R.exports = u(u);
      }, 7199: (module) => {
        function inquire(moduleName) {
          try {
            var mod = eval("quire".replace(/^/, "re"))(moduleName);
            if (mod && (mod.length || Object.keys(mod).length)) return mod;
          } catch (R) {
          }
          return null;
        }
        module.exports = inquire;
      }, 6662: (R) => {
        R.exports = function(u, b, h) {
          var p = h || 8192, g = p >>> 1, o = null, c = p;
          return function(f) {
            if (f < 1 || f > g) return u(f);
            c + f > p && (o = u(p), c = 0);
            var s = b.call(o, c, c += f);
            return 7 & c && (c = 1 + (7 | c)), s;
          };
        };
      }, 4997: (R, u) => {
        var b = u;
        b.length = function(h) {
          for (var p = 0, g = 0, o = 0; o < h.length; ++o) (g = h.charCodeAt(o)) < 128 ? p += 1 : g < 2048 ? p += 2 : (64512 & g) == 55296 && (64512 & h.charCodeAt(o + 1)) == 56320 ? (++o, p += 4) : p += 3;
          return p;
        }, b.read = function(h, p, g) {
          if (g - p < 1) return "";
          for (var o, c = null, f = [], s = 0; p < g; ) (o = h[p++]) < 128 ? f[s++] = o : o > 191 && o < 224 ? f[s++] = (31 & o) << 6 | 63 & h[p++] : o > 239 && o < 365 ? (o = ((7 & o) << 18 | (63 & h[p++]) << 12 | (63 & h[p++]) << 6 | 63 & h[p++]) - 65536, f[s++] = 55296 + (o >> 10), f[s++] = 56320 + (1023 & o)) : f[s++] = (15 & o) << 12 | (63 & h[p++]) << 6 | 63 & h[p++], s > 8191 && ((c || (c = [])).push(String.fromCharCode.apply(String, f)), s = 0);
          return c ? (s && c.push(String.fromCharCode.apply(String, f.slice(0, s))), c.join("")) : String.fromCharCode.apply(String, f.slice(0, s));
        }, b.write = function(h, p, g) {
          for (var o, c, f = g, s = 0; s < h.length; ++s) (o = h.charCodeAt(s)) < 128 ? p[g++] = o : o < 2048 ? (p[g++] = o >> 6 | 192, p[g++] = 63 & o | 128) : (64512 & o) == 55296 && (64512 & (c = h.charCodeAt(s + 1))) == 56320 ? (o = 65536 + ((1023 & o) << 10) + (1023 & c), ++s, p[g++] = o >> 18 | 240, p[g++] = o >> 12 & 63 | 128, p[g++] = o >> 6 & 63 | 128, p[g++] = 63 & o | 128) : (p[g++] = o >> 12 | 224, p[g++] = o >> 6 & 63 | 128, p[g++] = 63 & o | 128);
          return g - f;
        };
      }, 3442: (R, u) => {
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
      }, 3720: (R) => {
        R.exports = b;
        var u = null;
        try {
          u = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
        } catch {
        }
        function b(w, C, V) {
          this.low = 0 | w, this.high = 0 | C, this.unsigned = !!V;
        }
        function h(w) {
          return (w && w.__isLong__) === !0;
        }
        b.prototype.__isLong__, Object.defineProperty(b.prototype, "__isLong__", { value: !0 }), b.isLong = h;
        var p = {}, g = {};
        function o(w, C) {
          var V, G, D;
          return C ? (D = 0 <= (w >>>= 0) && w < 256) && (G = g[w]) ? G : (V = f(w, (0 | w) < 0 ? -1 : 0, !0), D && (g[w] = V), V) : (D = -128 <= (w |= 0) && w < 128) && (G = p[w]) ? G : (V = f(w, w < 0 ? -1 : 0, !1), D && (p[w] = V), V);
        }
        function c(w, C) {
          if (isNaN(w)) return C ? d : l;
          if (C) {
            if (w < 0) return d;
            if (w >= n) return S;
          } else {
            if (w <= -r) return O;
            if (w + 1 >= r) return v;
          }
          return w < 0 ? c(-w, C).neg() : f(w % e | 0, w / e | 0, C);
        }
        function f(w, C, V) {
          return new b(w, C, V);
        }
        b.fromInt = o, b.fromNumber = c, b.fromBits = f;
        var s = Math.pow;
        function i(w, C, V) {
          if (w.length === 0) throw Error("empty string");
          if (w === "NaN" || w === "Infinity" || w === "+Infinity" || w === "-Infinity") return l;
          if (typeof C == "number" ? (V = C, C = !1) : C = !!C, (V = V || 10) < 2 || 36 < V) throw RangeError("radix");
          var G;
          if ((G = w.indexOf("-")) > 0) throw Error("interior hyphen");
          if (G === 0) return i(w.substring(1), C, V).neg();
          for (var D = c(s(V, 8)), A = l, M = 0; M < w.length; M += 8) {
            var E = Math.min(8, w.length - M), F = parseInt(w.substring(M, M + E), V);
            if (E < 8) {
              var W = c(s(V, E));
              A = A.mul(W).add(c(F));
            } else A = (A = A.mul(D)).add(c(F));
          }
          return A.unsigned = C, A;
        }
        function t(w, C) {
          return typeof w == "number" ? c(w, C) : typeof w == "string" ? i(w, C) : f(w.low, w.high, typeof C == "boolean" ? C : w.unsigned);
        }
        b.fromString = i, b.fromValue = t;
        var e = 4294967296, n = e * e, r = n / 2, a = o(1 << 24), l = o(0);
        b.ZERO = l;
        var d = o(0, !0);
        b.UZERO = d;
        var m = o(1);
        b.ONE = m;
        var y = o(1, !0);
        b.UONE = y;
        var _ = o(-1);
        b.NEG_ONE = _;
        var v = f(-1, 2147483647, !1);
        b.MAX_VALUE = v;
        var S = f(-1, -1, !0);
        b.MAX_UNSIGNED_VALUE = S;
        var O = f(0, -2147483648, !1);
        b.MIN_VALUE = O;
        var I = b.prototype;
        I.toInt = function() {
          return this.unsigned ? this.low >>> 0 : this.low;
        }, I.toNumber = function() {
          return this.unsigned ? (this.high >>> 0) * e + (this.low >>> 0) : this.high * e + (this.low >>> 0);
        }, I.toString = function(w) {
          if ((w = w || 10) < 2 || 36 < w) throw RangeError("radix");
          if (this.isZero()) return "0";
          if (this.isNegative()) {
            if (this.eq(O)) {
              var C = c(w), V = this.div(C), G = V.mul(C).sub(this);
              return V.toString(w) + G.toInt().toString(w);
            }
            return "-" + this.neg().toString(w);
          }
          for (var D = c(s(w, 6), this.unsigned), A = this, M = ""; ; ) {
            var E = A.div(D), F = (A.sub(E.mul(D)).toInt() >>> 0).toString(w);
            if ((A = E).isZero()) return F + M;
            for (; F.length < 6; ) F = "0" + F;
            M = "" + F + M;
          }
        }, I.getHighBits = function() {
          return this.high;
        }, I.getHighBitsUnsigned = function() {
          return this.high >>> 0;
        }, I.getLowBits = function() {
          return this.low;
        }, I.getLowBitsUnsigned = function() {
          return this.low >>> 0;
        }, I.getNumBitsAbs = function() {
          if (this.isNegative()) return this.eq(O) ? 64 : this.neg().getNumBitsAbs();
          for (var w = this.high != 0 ? this.high : this.low, C = 31; C > 0 && !(w & 1 << C); C--) ;
          return this.high != 0 ? C + 33 : C + 1;
        }, I.isZero = function() {
          return this.high === 0 && this.low === 0;
        }, I.eqz = I.isZero, I.isNegative = function() {
          return !this.unsigned && this.high < 0;
        }, I.isPositive = function() {
          return this.unsigned || this.high >= 0;
        }, I.isOdd = function() {
          return (1 & this.low) == 1;
        }, I.isEven = function() {
          return (1 & this.low) == 0;
        }, I.equals = function(w) {
          return h(w) || (w = t(w)), (this.unsigned === w.unsigned || this.high >>> 31 != 1 || w.high >>> 31 != 1) && this.high === w.high && this.low === w.low;
        }, I.eq = I.equals, I.notEquals = function(w) {
          return !this.eq(w);
        }, I.neq = I.notEquals, I.ne = I.notEquals, I.lessThan = function(w) {
          return this.comp(w) < 0;
        }, I.lt = I.lessThan, I.lessThanOrEqual = function(w) {
          return this.comp(w) <= 0;
        }, I.lte = I.lessThanOrEqual, I.le = I.lessThanOrEqual, I.greaterThan = function(w) {
          return this.comp(w) > 0;
        }, I.gt = I.greaterThan, I.greaterThanOrEqual = function(w) {
          return this.comp(w) >= 0;
        }, I.gte = I.greaterThanOrEqual, I.ge = I.greaterThanOrEqual, I.compare = function(w) {
          if (h(w) || (w = t(w)), this.eq(w)) return 0;
          var C = this.isNegative(), V = w.isNegative();
          return C && !V ? -1 : !C && V ? 1 : this.unsigned ? w.high >>> 0 > this.high >>> 0 || w.high === this.high && w.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(w).isNegative() ? -1 : 1;
        }, I.comp = I.compare, I.negate = function() {
          return !this.unsigned && this.eq(O) ? O : this.not().add(m);
        }, I.neg = I.negate, I.add = function(w) {
          h(w) || (w = t(w));
          var C = this.high >>> 16, V = 65535 & this.high, G = this.low >>> 16, D = 65535 & this.low, A = w.high >>> 16, M = 65535 & w.high, E = w.low >>> 16, F = 0, W = 0, q = 0, Q = 0;
          return q += (Q += D + (65535 & w.low)) >>> 16, W += (q += G + E) >>> 16, F += (W += V + M) >>> 16, F += C + A, f((q &= 65535) << 16 | (Q &= 65535), (F &= 65535) << 16 | (W &= 65535), this.unsigned);
        }, I.subtract = function(w) {
          return h(w) || (w = t(w)), this.add(w.neg());
        }, I.sub = I.subtract, I.multiply = function(w) {
          if (this.isZero()) return l;
          if (h(w) || (w = t(w)), u) return f(u.mul(this.low, this.high, w.low, w.high), u.get_high(), this.unsigned);
          if (w.isZero()) return l;
          if (this.eq(O)) return w.isOdd() ? O : l;
          if (w.eq(O)) return this.isOdd() ? O : l;
          if (this.isNegative()) return w.isNegative() ? this.neg().mul(w.neg()) : this.neg().mul(w).neg();
          if (w.isNegative()) return this.mul(w.neg()).neg();
          if (this.lt(a) && w.lt(a)) return c(this.toNumber() * w.toNumber(), this.unsigned);
          var C = this.high >>> 16, V = 65535 & this.high, G = this.low >>> 16, D = 65535 & this.low, A = w.high >>> 16, M = 65535 & w.high, E = w.low >>> 16, F = 65535 & w.low, W = 0, q = 0, Q = 0, Z = 0;
          return Q += (Z += D * F) >>> 16, q += (Q += G * F) >>> 16, Q &= 65535, q += (Q += D * E) >>> 16, W += (q += V * F) >>> 16, q &= 65535, W += (q += G * E) >>> 16, q &= 65535, W += (q += D * M) >>> 16, W += C * F + V * E + G * M + D * A, f((Q &= 65535) << 16 | (Z &= 65535), (W &= 65535) << 16 | (q &= 65535), this.unsigned);
        }, I.mul = I.multiply, I.divide = function(w) {
          if (h(w) || (w = t(w)), w.isZero()) throw Error("division by zero");
          var C, V, G;
          if (u) return this.unsigned || this.high !== -2147483648 || w.low !== -1 || w.high !== -1 ? f((this.unsigned ? u.div_u : u.div_s)(this.low, this.high, w.low, w.high), u.get_high(), this.unsigned) : this;
          if (this.isZero()) return this.unsigned ? d : l;
          if (this.unsigned) {
            if (w.unsigned || (w = w.toUnsigned()), w.gt(this)) return d;
            if (w.gt(this.shru(1))) return y;
            G = d;
          } else {
            if (this.eq(O)) return w.eq(m) || w.eq(_) ? O : w.eq(O) ? m : (C = this.shr(1).div(w).shl(1)).eq(l) ? w.isNegative() ? m : _ : (V = this.sub(w.mul(C)), G = C.add(V.div(w)));
            if (w.eq(O)) return this.unsigned ? d : l;
            if (this.isNegative()) return w.isNegative() ? this.neg().div(w.neg()) : this.neg().div(w).neg();
            if (w.isNegative()) return this.div(w.neg()).neg();
            G = l;
          }
          for (V = this; V.gte(w); ) {
            C = Math.max(1, Math.floor(V.toNumber() / w.toNumber()));
            for (var D = Math.ceil(Math.log(C) / Math.LN2), A = D <= 48 ? 1 : s(2, D - 48), M = c(C), E = M.mul(w); E.isNegative() || E.gt(V); ) E = (M = c(C -= A, this.unsigned)).mul(w);
            M.isZero() && (M = m), G = G.add(M), V = V.sub(E);
          }
          return G;
        }, I.div = I.divide, I.modulo = function(w) {
          return h(w) || (w = t(w)), u ? f((this.unsigned ? u.rem_u : u.rem_s)(this.low, this.high, w.low, w.high), u.get_high(), this.unsigned) : this.sub(this.div(w).mul(w));
        }, I.mod = I.modulo, I.rem = I.modulo, I.not = function() {
          return f(~this.low, ~this.high, this.unsigned);
        }, I.and = function(w) {
          return h(w) || (w = t(w)), f(this.low & w.low, this.high & w.high, this.unsigned);
        }, I.or = function(w) {
          return h(w) || (w = t(w)), f(this.low | w.low, this.high | w.high, this.unsigned);
        }, I.xor = function(w) {
          return h(w) || (w = t(w)), f(this.low ^ w.low, this.high ^ w.high, this.unsigned);
        }, I.shiftLeft = function(w) {
          return h(w) && (w = w.toInt()), (w &= 63) == 0 ? this : w < 32 ? f(this.low << w, this.high << w | this.low >>> 32 - w, this.unsigned) : f(0, this.low << w - 32, this.unsigned);
        }, I.shl = I.shiftLeft, I.shiftRight = function(w) {
          return h(w) && (w = w.toInt()), (w &= 63) == 0 ? this : w < 32 ? f(this.low >>> w | this.high << 32 - w, this.high >> w, this.unsigned) : f(this.high >> w - 32, this.high >= 0 ? 0 : -1, this.unsigned);
        }, I.shr = I.shiftRight, I.shiftRightUnsigned = function(w) {
          if (h(w) && (w = w.toInt()), (w &= 63) == 0) return this;
          var C = this.high;
          return w < 32 ? f(this.low >>> w | C << 32 - w, C >>> w, this.unsigned) : f(w === 32 ? C : C >>> w - 32, 0, this.unsigned);
        }, I.shru = I.shiftRightUnsigned, I.shr_u = I.shiftRightUnsigned, I.toSigned = function() {
          return this.unsigned ? f(this.low, this.high, !1) : this;
        }, I.toUnsigned = function() {
          return this.unsigned ? this : f(this.low, this.high, !0);
        }, I.toBytes = function(w) {
          return w ? this.toBytesLE() : this.toBytesBE();
        }, I.toBytesLE = function() {
          var w = this.high, C = this.low;
          return [255 & C, C >>> 8 & 255, C >>> 16 & 255, C >>> 24, 255 & w, w >>> 8 & 255, w >>> 16 & 255, w >>> 24];
        }, I.toBytesBE = function() {
          var w = this.high, C = this.low;
          return [w >>> 24, w >>> 16 & 255, w >>> 8 & 255, 255 & w, C >>> 24, C >>> 16 & 255, C >>> 8 & 255, 255 & C];
        }, b.fromBytes = function(w, C, V) {
          return V ? b.fromBytesLE(w, C) : b.fromBytesBE(w, C);
        }, b.fromBytesLE = function(w, C) {
          return new b(w[0] | w[1] << 8 | w[2] << 16 | w[3] << 24, w[4] | w[5] << 8 | w[6] << 16 | w[7] << 24, C);
        }, b.fromBytesBE = function(w, C) {
          return new b(w[4] << 24 | w[5] << 16 | w[6] << 8 | w[7], w[0] << 24 | w[1] << 16 | w[2] << 8 | w[3], C);
        };
      }, 1446: (R, u, b) => {
        var h, p, g, o = b(2100), c = o.Reader, f = o.Writer, s = o.util, i = o.roots.default || (o.roots.default = {});
        i.onnx = ((g = {}).Version = (h = {}, (p = Object.create(h))[h[0] = "_START_VERSION"] = 0, p[h[1] = "IR_VERSION_2017_10_10"] = 1, p[h[2] = "IR_VERSION_2017_10_30"] = 2, p[h[3] = "IR_VERSION_2017_11_3"] = 3, p[h[4] = "IR_VERSION_2019_1_22"] = 4, p[h[5] = "IR_VERSION"] = 5, p), g.AttributeProto = function() {
          function t(e) {
            if (this.floats = [], this.ints = [], this.strings = [], this.tensors = [], this.graphs = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.name = "", t.prototype.refAttrName = "", t.prototype.docString = "", t.prototype.type = 0, t.prototype.f = 0, t.prototype.i = s.Long ? s.Long.fromBits(0, 0, !1) : 0, t.prototype.s = s.newBuffer([]), t.prototype.t = null, t.prototype.g = null, t.prototype.floats = s.emptyArray, t.prototype.ints = s.emptyArray, t.prototype.strings = s.emptyArray, t.prototype.tensors = s.emptyArray, t.prototype.graphs = s.emptyArray, t.create = function(e) {
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
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.AttributeProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  a.name = e.string();
                  break;
                case 21:
                  a.refAttrName = e.string();
                  break;
                case 13:
                  a.docString = e.string();
                  break;
                case 20:
                  a.type = e.int32();
                  break;
                case 2:
                  a.f = e.float();
                  break;
                case 3:
                  a.i = e.int64();
                  break;
                case 4:
                  a.s = e.bytes();
                  break;
                case 5:
                  a.t = i.onnx.TensorProto.decode(e, e.uint32());
                  break;
                case 6:
                  a.g = i.onnx.GraphProto.decode(e, e.uint32());
                  break;
                case 7:
                  if (a.floats && a.floats.length || (a.floats = []), (7 & l) == 2) for (var d = e.uint32() + e.pos; e.pos < d; ) a.floats.push(e.float());
                  else a.floats.push(e.float());
                  break;
                case 8:
                  if (a.ints && a.ints.length || (a.ints = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) a.ints.push(e.int64());
                  else a.ints.push(e.int64());
                  break;
                case 9:
                  a.strings && a.strings.length || (a.strings = []), a.strings.push(e.bytes());
                  break;
                case 10:
                  a.tensors && a.tensors.length || (a.tensors = []), a.tensors.push(i.onnx.TensorProto.decode(e, e.uint32()));
                  break;
                case 11:
                  a.graphs && a.graphs.length || (a.graphs = []), a.graphs.push(i.onnx.GraphProto.decode(e, e.uint32()));
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.name != null && e.hasOwnProperty("name") && !s.isString(e.name)) return "name: string expected";
            if (e.refAttrName != null && e.hasOwnProperty("refAttrName") && !s.isString(e.refAttrName)) return "refAttrName: string expected";
            if (e.docString != null && e.hasOwnProperty("docString") && !s.isString(e.docString)) return "docString: string expected";
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
            if (e.i != null && e.hasOwnProperty("i") && !(s.isInteger(e.i) || e.i && s.isInteger(e.i.low) && s.isInteger(e.i.high))) return "i: integer|Long expected";
            if (e.s != null && e.hasOwnProperty("s") && !(e.s && typeof e.s.length == "number" || s.isString(e.s))) return "s: buffer expected";
            if (e.t != null && e.hasOwnProperty("t") && (r = i.onnx.TensorProto.verify(e.t))) return "t." + r;
            if (e.g != null && e.hasOwnProperty("g") && (r = i.onnx.GraphProto.verify(e.g))) return "g." + r;
            if (e.floats != null && e.hasOwnProperty("floats")) {
              if (!Array.isArray(e.floats)) return "floats: array expected";
              for (var n = 0; n < e.floats.length; ++n) if (typeof e.floats[n] != "number") return "floats: number[] expected";
            }
            if (e.ints != null && e.hasOwnProperty("ints")) {
              if (!Array.isArray(e.ints)) return "ints: array expected";
              for (n = 0; n < e.ints.length; ++n) if (!(s.isInteger(e.ints[n]) || e.ints[n] && s.isInteger(e.ints[n].low) && s.isInteger(e.ints[n].high))) return "ints: integer|Long[] expected";
            }
            if (e.strings != null && e.hasOwnProperty("strings")) {
              if (!Array.isArray(e.strings)) return "strings: array expected";
              for (n = 0; n < e.strings.length; ++n) if (!(e.strings[n] && typeof e.strings[n].length == "number" || s.isString(e.strings[n]))) return "strings: buffer[] expected";
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
            if (e.f != null && (n.f = Number(e.f)), e.i != null && (s.Long ? (n.i = s.Long.fromValue(e.i)).unsigned = !1 : typeof e.i == "string" ? n.i = parseInt(e.i, 10) : typeof e.i == "number" ? n.i = e.i : typeof e.i == "object" && (n.i = new s.LongBits(e.i.low >>> 0, e.i.high >>> 0).toNumber())), e.s != null && (typeof e.s == "string" ? s.base64.decode(e.s, n.s = s.newBuffer(s.base64.length(e.s)), 0) : e.s.length && (n.s = e.s)), e.t != null) {
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
              for (n.ints = [], r = 0; r < e.ints.length; ++r) s.Long ? (n.ints[r] = s.Long.fromValue(e.ints[r])).unsigned = !1 : typeof e.ints[r] == "string" ? n.ints[r] = parseInt(e.ints[r], 10) : typeof e.ints[r] == "number" ? n.ints[r] = e.ints[r] : typeof e.ints[r] == "object" && (n.ints[r] = new s.LongBits(e.ints[r].low >>> 0, e.ints[r].high >>> 0).toNumber());
            }
            if (e.strings) {
              if (!Array.isArray(e.strings)) throw TypeError(".onnx.AttributeProto.strings: array expected");
              for (n.strings = [], r = 0; r < e.strings.length; ++r) typeof e.strings[r] == "string" ? s.base64.decode(e.strings[r], n.strings[r] = s.newBuffer(s.base64.length(e.strings[r])), 0) : e.strings[r].length && (n.strings[r] = e.strings[r]);
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
              if (r.name = "", r.f = 0, s.Long) {
                var a = new s.Long(0, 0, !1);
                r.i = n.longs === String ? a.toString() : n.longs === Number ? a.toNumber() : a;
              } else r.i = n.longs === String ? "0" : 0;
              n.bytes === String ? r.s = "" : (r.s = [], n.bytes !== Array && (r.s = s.newBuffer(r.s))), r.t = null, r.g = null, r.docString = "", r.type = n.enums === String ? "UNDEFINED" : 0, r.refAttrName = "";
            }
            if (e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.f != null && e.hasOwnProperty("f") && (r.f = n.json && !isFinite(e.f) ? String(e.f) : e.f), e.i != null && e.hasOwnProperty("i") && (typeof e.i == "number" ? r.i = n.longs === String ? String(e.i) : e.i : r.i = n.longs === String ? s.Long.prototype.toString.call(e.i) : n.longs === Number ? new s.LongBits(e.i.low >>> 0, e.i.high >>> 0).toNumber() : e.i), e.s != null && e.hasOwnProperty("s") && (r.s = n.bytes === String ? s.base64.encode(e.s, 0, e.s.length) : n.bytes === Array ? Array.prototype.slice.call(e.s) : e.s), e.t != null && e.hasOwnProperty("t") && (r.t = i.onnx.TensorProto.toObject(e.t, n)), e.g != null && e.hasOwnProperty("g") && (r.g = i.onnx.GraphProto.toObject(e.g, n)), e.floats && e.floats.length) {
              r.floats = [];
              for (var l = 0; l < e.floats.length; ++l) r.floats[l] = n.json && !isFinite(e.floats[l]) ? String(e.floats[l]) : e.floats[l];
            }
            if (e.ints && e.ints.length) for (r.ints = [], l = 0; l < e.ints.length; ++l) typeof e.ints[l] == "number" ? r.ints[l] = n.longs === String ? String(e.ints[l]) : e.ints[l] : r.ints[l] = n.longs === String ? s.Long.prototype.toString.call(e.ints[l]) : n.longs === Number ? new s.LongBits(e.ints[l].low >>> 0, e.ints[l].high >>> 0).toNumber() : e.ints[l];
            if (e.strings && e.strings.length) for (r.strings = [], l = 0; l < e.strings.length; ++l) r.strings[l] = n.bytes === String ? s.base64.encode(e.strings[l], 0, e.strings[l].length) : n.bytes === Array ? Array.prototype.slice.call(e.strings[l]) : e.strings[l];
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
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.ValueInfoProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  a.name = e.string();
                  break;
                case 2:
                  a.type = i.onnx.TypeProto.decode(e, e.uint32());
                  break;
                case 3:
                  a.docString = e.string();
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.name != null && e.hasOwnProperty("name") && !s.isString(e.name)) return "name: string expected";
            if (e.type != null && e.hasOwnProperty("type")) {
              var n = i.onnx.TypeProto.verify(e.type);
              if (n) return "type." + n;
            }
            return e.docString != null && e.hasOwnProperty("docString") && !s.isString(e.docString) ? "docString: string expected" : null;
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
          return t.prototype.input = s.emptyArray, t.prototype.output = s.emptyArray, t.prototype.name = "", t.prototype.opType = "", t.prototype.domain = "", t.prototype.attribute = s.emptyArray, t.prototype.docString = "", t.create = function(e) {
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
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.NodeProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  a.input && a.input.length || (a.input = []), a.input.push(e.string());
                  break;
                case 2:
                  a.output && a.output.length || (a.output = []), a.output.push(e.string());
                  break;
                case 3:
                  a.name = e.string();
                  break;
                case 4:
                  a.opType = e.string();
                  break;
                case 7:
                  a.domain = e.string();
                  break;
                case 5:
                  a.attribute && a.attribute.length || (a.attribute = []), a.attribute.push(i.onnx.AttributeProto.decode(e, e.uint32()));
                  break;
                case 6:
                  a.docString = e.string();
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.input != null && e.hasOwnProperty("input")) {
              if (!Array.isArray(e.input)) return "input: array expected";
              for (var n = 0; n < e.input.length; ++n) if (!s.isString(e.input[n])) return "input: string[] expected";
            }
            if (e.output != null && e.hasOwnProperty("output")) {
              if (!Array.isArray(e.output)) return "output: array expected";
              for (n = 0; n < e.output.length; ++n) if (!s.isString(e.output[n])) return "output: string[] expected";
            }
            if (e.name != null && e.hasOwnProperty("name") && !s.isString(e.name)) return "name: string expected";
            if (e.opType != null && e.hasOwnProperty("opType") && !s.isString(e.opType)) return "opType: string expected";
            if (e.domain != null && e.hasOwnProperty("domain") && !s.isString(e.domain)) return "domain: string expected";
            if (e.attribute != null && e.hasOwnProperty("attribute")) {
              if (!Array.isArray(e.attribute)) return "attribute: array expected";
              for (n = 0; n < e.attribute.length; ++n) {
                var r = i.onnx.AttributeProto.verify(e.attribute[n]);
                if (r) return "attribute." + r;
              }
            }
            return e.docString != null && e.hasOwnProperty("docString") && !s.isString(e.docString) ? "docString: string expected" : null;
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
              for (var a = 0; a < e.input.length; ++a) r.input[a] = e.input[a];
            }
            if (e.output && e.output.length) for (r.output = [], a = 0; a < e.output.length; ++a) r.output[a] = e.output[a];
            if (e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.opType != null && e.hasOwnProperty("opType") && (r.opType = e.opType), e.attribute && e.attribute.length) for (r.attribute = [], a = 0; a < e.attribute.length; ++a) r.attribute[a] = i.onnx.AttributeProto.toObject(e.attribute[a], n);
            return e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.domain != null && e.hasOwnProperty("domain") && (r.domain = e.domain), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.ModelProto = function() {
          function t(e) {
            if (this.opsetImport = [], this.metadataProps = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.irVersion = s.Long ? s.Long.fromBits(0, 0, !1) : 0, t.prototype.opsetImport = s.emptyArray, t.prototype.producerName = "", t.prototype.producerVersion = "", t.prototype.domain = "", t.prototype.modelVersion = s.Long ? s.Long.fromBits(0, 0, !1) : 0, t.prototype.docString = "", t.prototype.graph = null, t.prototype.metadataProps = s.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.irVersion != null && e.hasOwnProperty("irVersion") && n.uint32(8).int64(e.irVersion), e.producerName != null && e.hasOwnProperty("producerName") && n.uint32(18).string(e.producerName), e.producerVersion != null && e.hasOwnProperty("producerVersion") && n.uint32(26).string(e.producerVersion), e.domain != null && e.hasOwnProperty("domain") && n.uint32(34).string(e.domain), e.modelVersion != null && e.hasOwnProperty("modelVersion") && n.uint32(40).int64(e.modelVersion), e.docString != null && e.hasOwnProperty("docString") && n.uint32(50).string(e.docString), e.graph != null && e.hasOwnProperty("graph") && i.onnx.GraphProto.encode(e.graph, n.uint32(58).fork()).ldelim(), e.opsetImport != null && e.opsetImport.length) for (var r = 0; r < e.opsetImport.length; ++r) i.onnx.OperatorSetIdProto.encode(e.opsetImport[r], n.uint32(66).fork()).ldelim();
            if (e.metadataProps != null && e.metadataProps.length) for (r = 0; r < e.metadataProps.length; ++r) i.onnx.StringStringEntryProto.encode(e.metadataProps[r], n.uint32(114).fork()).ldelim();
            return n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.ModelProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  a.irVersion = e.int64();
                  break;
                case 8:
                  a.opsetImport && a.opsetImport.length || (a.opsetImport = []), a.opsetImport.push(i.onnx.OperatorSetIdProto.decode(e, e.uint32()));
                  break;
                case 2:
                  a.producerName = e.string();
                  break;
                case 3:
                  a.producerVersion = e.string();
                  break;
                case 4:
                  a.domain = e.string();
                  break;
                case 5:
                  a.modelVersion = e.int64();
                  break;
                case 6:
                  a.docString = e.string();
                  break;
                case 7:
                  a.graph = i.onnx.GraphProto.decode(e, e.uint32());
                  break;
                case 14:
                  a.metadataProps && a.metadataProps.length || (a.metadataProps = []), a.metadataProps.push(i.onnx.StringStringEntryProto.decode(e, e.uint32()));
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.irVersion != null && e.hasOwnProperty("irVersion") && !(s.isInteger(e.irVersion) || e.irVersion && s.isInteger(e.irVersion.low) && s.isInteger(e.irVersion.high))) return "irVersion: integer|Long expected";
            if (e.opsetImport != null && e.hasOwnProperty("opsetImport")) {
              if (!Array.isArray(e.opsetImport)) return "opsetImport: array expected";
              for (var n = 0; n < e.opsetImport.length; ++n) if (r = i.onnx.OperatorSetIdProto.verify(e.opsetImport[n])) return "opsetImport." + r;
            }
            if (e.producerName != null && e.hasOwnProperty("producerName") && !s.isString(e.producerName)) return "producerName: string expected";
            if (e.producerVersion != null && e.hasOwnProperty("producerVersion") && !s.isString(e.producerVersion)) return "producerVersion: string expected";
            if (e.domain != null && e.hasOwnProperty("domain") && !s.isString(e.domain)) return "domain: string expected";
            if (e.modelVersion != null && e.hasOwnProperty("modelVersion") && !(s.isInteger(e.modelVersion) || e.modelVersion && s.isInteger(e.modelVersion.low) && s.isInteger(e.modelVersion.high))) return "modelVersion: integer|Long expected";
            if (e.docString != null && e.hasOwnProperty("docString") && !s.isString(e.docString)) return "docString: string expected";
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
            if (e.irVersion != null && (s.Long ? (n.irVersion = s.Long.fromValue(e.irVersion)).unsigned = !1 : typeof e.irVersion == "string" ? n.irVersion = parseInt(e.irVersion, 10) : typeof e.irVersion == "number" ? n.irVersion = e.irVersion : typeof e.irVersion == "object" && (n.irVersion = new s.LongBits(e.irVersion.low >>> 0, e.irVersion.high >>> 0).toNumber())), e.opsetImport) {
              if (!Array.isArray(e.opsetImport)) throw TypeError(".onnx.ModelProto.opsetImport: array expected");
              n.opsetImport = [];
              for (var r = 0; r < e.opsetImport.length; ++r) {
                if (typeof e.opsetImport[r] != "object") throw TypeError(".onnx.ModelProto.opsetImport: object expected");
                n.opsetImport[r] = i.onnx.OperatorSetIdProto.fromObject(e.opsetImport[r]);
              }
            }
            if (e.producerName != null && (n.producerName = String(e.producerName)), e.producerVersion != null && (n.producerVersion = String(e.producerVersion)), e.domain != null && (n.domain = String(e.domain)), e.modelVersion != null && (s.Long ? (n.modelVersion = s.Long.fromValue(e.modelVersion)).unsigned = !1 : typeof e.modelVersion == "string" ? n.modelVersion = parseInt(e.modelVersion, 10) : typeof e.modelVersion == "number" ? n.modelVersion = e.modelVersion : typeof e.modelVersion == "object" && (n.modelVersion = new s.LongBits(e.modelVersion.low >>> 0, e.modelVersion.high >>> 0).toNumber())), e.docString != null && (n.docString = String(e.docString)), e.graph != null) {
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
              if (s.Long) {
                var a = new s.Long(0, 0, !1);
                r.irVersion = n.longs === String ? a.toString() : n.longs === Number ? a.toNumber() : a;
              } else r.irVersion = n.longs === String ? "0" : 0;
              r.producerName = "", r.producerVersion = "", r.domain = "", s.Long ? (a = new s.Long(0, 0, !1), r.modelVersion = n.longs === String ? a.toString() : n.longs === Number ? a.toNumber() : a) : r.modelVersion = n.longs === String ? "0" : 0, r.docString = "", r.graph = null;
            }
            if (e.irVersion != null && e.hasOwnProperty("irVersion") && (typeof e.irVersion == "number" ? r.irVersion = n.longs === String ? String(e.irVersion) : e.irVersion : r.irVersion = n.longs === String ? s.Long.prototype.toString.call(e.irVersion) : n.longs === Number ? new s.LongBits(e.irVersion.low >>> 0, e.irVersion.high >>> 0).toNumber() : e.irVersion), e.producerName != null && e.hasOwnProperty("producerName") && (r.producerName = e.producerName), e.producerVersion != null && e.hasOwnProperty("producerVersion") && (r.producerVersion = e.producerVersion), e.domain != null && e.hasOwnProperty("domain") && (r.domain = e.domain), e.modelVersion != null && e.hasOwnProperty("modelVersion") && (typeof e.modelVersion == "number" ? r.modelVersion = n.longs === String ? String(e.modelVersion) : e.modelVersion : r.modelVersion = n.longs === String ? s.Long.prototype.toString.call(e.modelVersion) : n.longs === Number ? new s.LongBits(e.modelVersion.low >>> 0, e.modelVersion.high >>> 0).toNumber() : e.modelVersion), e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.graph != null && e.hasOwnProperty("graph") && (r.graph = i.onnx.GraphProto.toObject(e.graph, n)), e.opsetImport && e.opsetImport.length) {
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
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.StringStringEntryProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  a.key = e.string();
                  break;
                case 2:
                  a.value = e.string();
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            return typeof e != "object" || e === null ? "object expected" : e.key != null && e.hasOwnProperty("key") && !s.isString(e.key) ? "key: string expected" : e.value != null && e.hasOwnProperty("value") && !s.isString(e.value) ? "value: string expected" : null;
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
          return t.prototype.tensorName = "", t.prototype.quantParameterTensorNames = s.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.tensorName != null && e.hasOwnProperty("tensorName") && n.uint32(10).string(e.tensorName), e.quantParameterTensorNames != null && e.quantParameterTensorNames.length) for (var r = 0; r < e.quantParameterTensorNames.length; ++r) i.onnx.StringStringEntryProto.encode(e.quantParameterTensorNames[r], n.uint32(18).fork()).ldelim();
            return n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.TensorAnnotation(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  a.tensorName = e.string();
                  break;
                case 2:
                  a.quantParameterTensorNames && a.quantParameterTensorNames.length || (a.quantParameterTensorNames = []), a.quantParameterTensorNames.push(i.onnx.StringStringEntryProto.decode(e, e.uint32()));
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.tensorName != null && e.hasOwnProperty("tensorName") && !s.isString(e.tensorName)) return "tensorName: string expected";
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
              for (var a = 0; a < e.quantParameterTensorNames.length; ++a) r.quantParameterTensorNames[a] = i.onnx.StringStringEntryProto.toObject(e.quantParameterTensorNames[a], n);
            }
            return r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.GraphProto = function() {
          function t(e) {
            if (this.node = [], this.initializer = [], this.input = [], this.output = [], this.valueInfo = [], this.quantizationAnnotation = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.node = s.emptyArray, t.prototype.name = "", t.prototype.initializer = s.emptyArray, t.prototype.docString = "", t.prototype.input = s.emptyArray, t.prototype.output = s.emptyArray, t.prototype.valueInfo = s.emptyArray, t.prototype.quantizationAnnotation = s.emptyArray, t.create = function(e) {
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
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.GraphProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  a.node && a.node.length || (a.node = []), a.node.push(i.onnx.NodeProto.decode(e, e.uint32()));
                  break;
                case 2:
                  a.name = e.string();
                  break;
                case 5:
                  a.initializer && a.initializer.length || (a.initializer = []), a.initializer.push(i.onnx.TensorProto.decode(e, e.uint32()));
                  break;
                case 10:
                  a.docString = e.string();
                  break;
                case 11:
                  a.input && a.input.length || (a.input = []), a.input.push(i.onnx.ValueInfoProto.decode(e, e.uint32()));
                  break;
                case 12:
                  a.output && a.output.length || (a.output = []), a.output.push(i.onnx.ValueInfoProto.decode(e, e.uint32()));
                  break;
                case 13:
                  a.valueInfo && a.valueInfo.length || (a.valueInfo = []), a.valueInfo.push(i.onnx.ValueInfoProto.decode(e, e.uint32()));
                  break;
                case 14:
                  a.quantizationAnnotation && a.quantizationAnnotation.length || (a.quantizationAnnotation = []), a.quantizationAnnotation.push(i.onnx.TensorAnnotation.decode(e, e.uint32()));
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.node != null && e.hasOwnProperty("node")) {
              if (!Array.isArray(e.node)) return "node: array expected";
              for (var n = 0; n < e.node.length; ++n) if (r = i.onnx.NodeProto.verify(e.node[n])) return "node." + r;
            }
            if (e.name != null && e.hasOwnProperty("name") && !s.isString(e.name)) return "name: string expected";
            if (e.initializer != null && e.hasOwnProperty("initializer")) {
              if (!Array.isArray(e.initializer)) return "initializer: array expected";
              for (n = 0; n < e.initializer.length; ++n) if (r = i.onnx.TensorProto.verify(e.initializer[n])) return "initializer." + r;
            }
            if (e.docString != null && e.hasOwnProperty("docString") && !s.isString(e.docString)) return "docString: string expected";
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
              for (var a = 0; a < e.node.length; ++a) r.node[a] = i.onnx.NodeProto.toObject(e.node[a], n);
            }
            if (e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.initializer && e.initializer.length) for (r.initializer = [], a = 0; a < e.initializer.length; ++a) r.initializer[a] = i.onnx.TensorProto.toObject(e.initializer[a], n);
            if (e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.input && e.input.length) for (r.input = [], a = 0; a < e.input.length; ++a) r.input[a] = i.onnx.ValueInfoProto.toObject(e.input[a], n);
            if (e.output && e.output.length) for (r.output = [], a = 0; a < e.output.length; ++a) r.output[a] = i.onnx.ValueInfoProto.toObject(e.output[a], n);
            if (e.valueInfo && e.valueInfo.length) for (r.valueInfo = [], a = 0; a < e.valueInfo.length; ++a) r.valueInfo[a] = i.onnx.ValueInfoProto.toObject(e.valueInfo[a], n);
            if (e.quantizationAnnotation && e.quantizationAnnotation.length) for (r.quantizationAnnotation = [], a = 0; a < e.quantizationAnnotation.length; ++a) r.quantizationAnnotation[a] = i.onnx.TensorAnnotation.toObject(e.quantizationAnnotation[a], n);
            return r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g.TensorProto = function() {
          function t(e) {
            if (this.dims = [], this.floatData = [], this.int32Data = [], this.stringData = [], this.int64Data = [], this.externalData = [], this.doubleData = [], this.uint64Data = [], e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.dims = s.emptyArray, t.prototype.dataType = 0, t.prototype.segment = null, t.prototype.floatData = s.emptyArray, t.prototype.int32Data = s.emptyArray, t.prototype.stringData = s.emptyArray, t.prototype.int64Data = s.emptyArray, t.prototype.name = "", t.prototype.docString = "", t.prototype.rawData = s.newBuffer([]), t.prototype.externalData = s.emptyArray, t.prototype.dataLocation = 0, t.prototype.doubleData = s.emptyArray, t.prototype.uint64Data = s.emptyArray, t.create = function(e) {
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
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.TensorProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  if (a.dims && a.dims.length || (a.dims = []), (7 & l) == 2) for (var d = e.uint32() + e.pos; e.pos < d; ) a.dims.push(e.int64());
                  else a.dims.push(e.int64());
                  break;
                case 2:
                  a.dataType = e.int32();
                  break;
                case 3:
                  a.segment = i.onnx.TensorProto.Segment.decode(e, e.uint32());
                  break;
                case 4:
                  if (a.floatData && a.floatData.length || (a.floatData = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) a.floatData.push(e.float());
                  else a.floatData.push(e.float());
                  break;
                case 5:
                  if (a.int32Data && a.int32Data.length || (a.int32Data = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) a.int32Data.push(e.int32());
                  else a.int32Data.push(e.int32());
                  break;
                case 6:
                  a.stringData && a.stringData.length || (a.stringData = []), a.stringData.push(e.bytes());
                  break;
                case 7:
                  if (a.int64Data && a.int64Data.length || (a.int64Data = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) a.int64Data.push(e.int64());
                  else a.int64Data.push(e.int64());
                  break;
                case 8:
                  a.name = e.string();
                  break;
                case 12:
                  a.docString = e.string();
                  break;
                case 9:
                  a.rawData = e.bytes();
                  break;
                case 13:
                  a.externalData && a.externalData.length || (a.externalData = []), a.externalData.push(i.onnx.StringStringEntryProto.decode(e, e.uint32()));
                  break;
                case 14:
                  a.dataLocation = e.int32();
                  break;
                case 10:
                  if (a.doubleData && a.doubleData.length || (a.doubleData = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) a.doubleData.push(e.double());
                  else a.doubleData.push(e.double());
                  break;
                case 11:
                  if (a.uint64Data && a.uint64Data.length || (a.uint64Data = []), (7 & l) == 2) for (d = e.uint32() + e.pos; e.pos < d; ) a.uint64Data.push(e.uint64());
                  else a.uint64Data.push(e.uint64());
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            if (typeof e != "object" || e === null) return "object expected";
            if (e.dims != null && e.hasOwnProperty("dims")) {
              if (!Array.isArray(e.dims)) return "dims: array expected";
              for (var n = 0; n < e.dims.length; ++n) if (!(s.isInteger(e.dims[n]) || e.dims[n] && s.isInteger(e.dims[n].low) && s.isInteger(e.dims[n].high))) return "dims: integer|Long[] expected";
            }
            if (e.dataType != null && e.hasOwnProperty("dataType") && !s.isInteger(e.dataType)) return "dataType: integer expected";
            if (e.segment != null && e.hasOwnProperty("segment") && (r = i.onnx.TensorProto.Segment.verify(e.segment))) return "segment." + r;
            if (e.floatData != null && e.hasOwnProperty("floatData")) {
              if (!Array.isArray(e.floatData)) return "floatData: array expected";
              for (n = 0; n < e.floatData.length; ++n) if (typeof e.floatData[n] != "number") return "floatData: number[] expected";
            }
            if (e.int32Data != null && e.hasOwnProperty("int32Data")) {
              if (!Array.isArray(e.int32Data)) return "int32Data: array expected";
              for (n = 0; n < e.int32Data.length; ++n) if (!s.isInteger(e.int32Data[n])) return "int32Data: integer[] expected";
            }
            if (e.stringData != null && e.hasOwnProperty("stringData")) {
              if (!Array.isArray(e.stringData)) return "stringData: array expected";
              for (n = 0; n < e.stringData.length; ++n) if (!(e.stringData[n] && typeof e.stringData[n].length == "number" || s.isString(e.stringData[n]))) return "stringData: buffer[] expected";
            }
            if (e.int64Data != null && e.hasOwnProperty("int64Data")) {
              if (!Array.isArray(e.int64Data)) return "int64Data: array expected";
              for (n = 0; n < e.int64Data.length; ++n) if (!(s.isInteger(e.int64Data[n]) || e.int64Data[n] && s.isInteger(e.int64Data[n].low) && s.isInteger(e.int64Data[n].high))) return "int64Data: integer|Long[] expected";
            }
            if (e.name != null && e.hasOwnProperty("name") && !s.isString(e.name)) return "name: string expected";
            if (e.docString != null && e.hasOwnProperty("docString") && !s.isString(e.docString)) return "docString: string expected";
            if (e.rawData != null && e.hasOwnProperty("rawData") && !(e.rawData && typeof e.rawData.length == "number" || s.isString(e.rawData))) return "rawData: buffer expected";
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
              for (n = 0; n < e.uint64Data.length; ++n) if (!(s.isInteger(e.uint64Data[n]) || e.uint64Data[n] && s.isInteger(e.uint64Data[n].low) && s.isInteger(e.uint64Data[n].high))) return "uint64Data: integer|Long[] expected";
            }
            return null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.TensorProto) return e;
            var n = new i.onnx.TensorProto();
            if (e.dims) {
              if (!Array.isArray(e.dims)) throw TypeError(".onnx.TensorProto.dims: array expected");
              n.dims = [];
              for (var r = 0; r < e.dims.length; ++r) s.Long ? (n.dims[r] = s.Long.fromValue(e.dims[r])).unsigned = !1 : typeof e.dims[r] == "string" ? n.dims[r] = parseInt(e.dims[r], 10) : typeof e.dims[r] == "number" ? n.dims[r] = e.dims[r] : typeof e.dims[r] == "object" && (n.dims[r] = new s.LongBits(e.dims[r].low >>> 0, e.dims[r].high >>> 0).toNumber());
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
              for (n.stringData = [], r = 0; r < e.stringData.length; ++r) typeof e.stringData[r] == "string" ? s.base64.decode(e.stringData[r], n.stringData[r] = s.newBuffer(s.base64.length(e.stringData[r])), 0) : e.stringData[r].length && (n.stringData[r] = e.stringData[r]);
            }
            if (e.int64Data) {
              if (!Array.isArray(e.int64Data)) throw TypeError(".onnx.TensorProto.int64Data: array expected");
              for (n.int64Data = [], r = 0; r < e.int64Data.length; ++r) s.Long ? (n.int64Data[r] = s.Long.fromValue(e.int64Data[r])).unsigned = !1 : typeof e.int64Data[r] == "string" ? n.int64Data[r] = parseInt(e.int64Data[r], 10) : typeof e.int64Data[r] == "number" ? n.int64Data[r] = e.int64Data[r] : typeof e.int64Data[r] == "object" && (n.int64Data[r] = new s.LongBits(e.int64Data[r].low >>> 0, e.int64Data[r].high >>> 0).toNumber());
            }
            if (e.name != null && (n.name = String(e.name)), e.docString != null && (n.docString = String(e.docString)), e.rawData != null && (typeof e.rawData == "string" ? s.base64.decode(e.rawData, n.rawData = s.newBuffer(s.base64.length(e.rawData)), 0) : e.rawData.length && (n.rawData = e.rawData)), e.externalData) {
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
              for (n.uint64Data = [], r = 0; r < e.uint64Data.length; ++r) s.Long ? (n.uint64Data[r] = s.Long.fromValue(e.uint64Data[r])).unsigned = !0 : typeof e.uint64Data[r] == "string" ? n.uint64Data[r] = parseInt(e.uint64Data[r], 10) : typeof e.uint64Data[r] == "number" ? n.uint64Data[r] = e.uint64Data[r] : typeof e.uint64Data[r] == "object" && (n.uint64Data[r] = new s.LongBits(e.uint64Data[r].low >>> 0, e.uint64Data[r].high >>> 0).toNumber(!0));
            }
            return n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if ((n.arrays || n.defaults) && (r.dims = [], r.floatData = [], r.int32Data = [], r.stringData = [], r.int64Data = [], r.doubleData = [], r.uint64Data = [], r.externalData = []), n.defaults && (r.dataType = 0, r.segment = null, r.name = "", n.bytes === String ? r.rawData = "" : (r.rawData = [], n.bytes !== Array && (r.rawData = s.newBuffer(r.rawData))), r.docString = "", r.dataLocation = n.enums === String ? "DEFAULT" : 0), e.dims && e.dims.length) {
              r.dims = [];
              for (var a = 0; a < e.dims.length; ++a) typeof e.dims[a] == "number" ? r.dims[a] = n.longs === String ? String(e.dims[a]) : e.dims[a] : r.dims[a] = n.longs === String ? s.Long.prototype.toString.call(e.dims[a]) : n.longs === Number ? new s.LongBits(e.dims[a].low >>> 0, e.dims[a].high >>> 0).toNumber() : e.dims[a];
            }
            if (e.dataType != null && e.hasOwnProperty("dataType") && (r.dataType = e.dataType), e.segment != null && e.hasOwnProperty("segment") && (r.segment = i.onnx.TensorProto.Segment.toObject(e.segment, n)), e.floatData && e.floatData.length) for (r.floatData = [], a = 0; a < e.floatData.length; ++a) r.floatData[a] = n.json && !isFinite(e.floatData[a]) ? String(e.floatData[a]) : e.floatData[a];
            if (e.int32Data && e.int32Data.length) for (r.int32Data = [], a = 0; a < e.int32Data.length; ++a) r.int32Data[a] = e.int32Data[a];
            if (e.stringData && e.stringData.length) for (r.stringData = [], a = 0; a < e.stringData.length; ++a) r.stringData[a] = n.bytes === String ? s.base64.encode(e.stringData[a], 0, e.stringData[a].length) : n.bytes === Array ? Array.prototype.slice.call(e.stringData[a]) : e.stringData[a];
            if (e.int64Data && e.int64Data.length) for (r.int64Data = [], a = 0; a < e.int64Data.length; ++a) typeof e.int64Data[a] == "number" ? r.int64Data[a] = n.longs === String ? String(e.int64Data[a]) : e.int64Data[a] : r.int64Data[a] = n.longs === String ? s.Long.prototype.toString.call(e.int64Data[a]) : n.longs === Number ? new s.LongBits(e.int64Data[a].low >>> 0, e.int64Data[a].high >>> 0).toNumber() : e.int64Data[a];
            if (e.name != null && e.hasOwnProperty("name") && (r.name = e.name), e.rawData != null && e.hasOwnProperty("rawData") && (r.rawData = n.bytes === String ? s.base64.encode(e.rawData, 0, e.rawData.length) : n.bytes === Array ? Array.prototype.slice.call(e.rawData) : e.rawData), e.doubleData && e.doubleData.length) for (r.doubleData = [], a = 0; a < e.doubleData.length; ++a) r.doubleData[a] = n.json && !isFinite(e.doubleData[a]) ? String(e.doubleData[a]) : e.doubleData[a];
            if (e.uint64Data && e.uint64Data.length) for (r.uint64Data = [], a = 0; a < e.uint64Data.length; ++a) typeof e.uint64Data[a] == "number" ? r.uint64Data[a] = n.longs === String ? String(e.uint64Data[a]) : e.uint64Data[a] : r.uint64Data[a] = n.longs === String ? s.Long.prototype.toString.call(e.uint64Data[a]) : n.longs === Number ? new s.LongBits(e.uint64Data[a].low >>> 0, e.uint64Data[a].high >>> 0).toNumber(!0) : e.uint64Data[a];
            if (e.docString != null && e.hasOwnProperty("docString") && (r.docString = e.docString), e.externalData && e.externalData.length) for (r.externalData = [], a = 0; a < e.externalData.length; ++a) r.externalData[a] = i.onnx.StringStringEntryProto.toObject(e.externalData[a], n);
            return e.dataLocation != null && e.hasOwnProperty("dataLocation") && (r.dataLocation = n.enums === String ? i.onnx.TensorProto.DataLocation[e.dataLocation] : e.dataLocation), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t.DataType = function() {
            var e = {}, n = Object.create(e);
            return n[e[0] = "UNDEFINED"] = 0, n[e[1] = "FLOAT"] = 1, n[e[2] = "UINT8"] = 2, n[e[3] = "INT8"] = 3, n[e[4] = "UINT16"] = 4, n[e[5] = "INT16"] = 5, n[e[6] = "INT32"] = 6, n[e[7] = "INT64"] = 7, n[e[8] = "STRING"] = 8, n[e[9] = "BOOL"] = 9, n[e[10] = "FLOAT16"] = 10, n[e[11] = "DOUBLE"] = 11, n[e[12] = "UINT32"] = 12, n[e[13] = "UINT64"] = 13, n[e[14] = "COMPLEX64"] = 14, n[e[15] = "COMPLEX128"] = 15, n[e[16] = "BFLOAT16"] = 16, n;
          }(), t.Segment = function() {
            function e(n) {
              if (n) for (var r = Object.keys(n), a = 0; a < r.length; ++a) n[r[a]] != null && (this[r[a]] = n[r[a]]);
            }
            return e.prototype.begin = s.Long ? s.Long.fromBits(0, 0, !1) : 0, e.prototype.end = s.Long ? s.Long.fromBits(0, 0, !1) : 0, e.create = function(n) {
              return new e(n);
            }, e.encode = function(n, r) {
              return r || (r = f.create()), n.begin != null && n.hasOwnProperty("begin") && r.uint32(8).int64(n.begin), n.end != null && n.hasOwnProperty("end") && r.uint32(16).int64(n.end), r;
            }, e.encodeDelimited = function(n, r) {
              return this.encode(n, r).ldelim();
            }, e.decode = function(n, r) {
              n instanceof c || (n = c.create(n));
              for (var a = r === void 0 ? n.len : n.pos + r, l = new i.onnx.TensorProto.Segment(); n.pos < a; ) {
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
              return typeof n != "object" || n === null ? "object expected" : n.begin != null && n.hasOwnProperty("begin") && !(s.isInteger(n.begin) || n.begin && s.isInteger(n.begin.low) && s.isInteger(n.begin.high)) ? "begin: integer|Long expected" : n.end != null && n.hasOwnProperty("end") && !(s.isInteger(n.end) || n.end && s.isInteger(n.end.low) && s.isInteger(n.end.high)) ? "end: integer|Long expected" : null;
            }, e.fromObject = function(n) {
              if (n instanceof i.onnx.TensorProto.Segment) return n;
              var r = new i.onnx.TensorProto.Segment();
              return n.begin != null && (s.Long ? (r.begin = s.Long.fromValue(n.begin)).unsigned = !1 : typeof n.begin == "string" ? r.begin = parseInt(n.begin, 10) : typeof n.begin == "number" ? r.begin = n.begin : typeof n.begin == "object" && (r.begin = new s.LongBits(n.begin.low >>> 0, n.begin.high >>> 0).toNumber())), n.end != null && (s.Long ? (r.end = s.Long.fromValue(n.end)).unsigned = !1 : typeof n.end == "string" ? r.end = parseInt(n.end, 10) : typeof n.end == "number" ? r.end = n.end : typeof n.end == "object" && (r.end = new s.LongBits(n.end.low >>> 0, n.end.high >>> 0).toNumber())), r;
            }, e.toObject = function(n, r) {
              r || (r = {});
              var a = {};
              if (r.defaults) {
                if (s.Long) {
                  var l = new s.Long(0, 0, !1);
                  a.begin = r.longs === String ? l.toString() : r.longs === Number ? l.toNumber() : l;
                } else a.begin = r.longs === String ? "0" : 0;
                s.Long ? (l = new s.Long(0, 0, !1), a.end = r.longs === String ? l.toString() : r.longs === Number ? l.toNumber() : l) : a.end = r.longs === String ? "0" : 0;
              }
              return n.begin != null && n.hasOwnProperty("begin") && (typeof n.begin == "number" ? a.begin = r.longs === String ? String(n.begin) : n.begin : a.begin = r.longs === String ? s.Long.prototype.toString.call(n.begin) : r.longs === Number ? new s.LongBits(n.begin.low >>> 0, n.begin.high >>> 0).toNumber() : n.begin), n.end != null && n.hasOwnProperty("end") && (typeof n.end == "number" ? a.end = r.longs === String ? String(n.end) : n.end : a.end = r.longs === String ? s.Long.prototype.toString.call(n.end) : r.longs === Number ? new s.LongBits(n.end.low >>> 0, n.end.high >>> 0).toNumber() : n.end), a;
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
          return t.prototype.dim = s.emptyArray, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            if (n || (n = f.create()), e.dim != null && e.dim.length) for (var r = 0; r < e.dim.length; ++r) i.onnx.TensorShapeProto.Dimension.encode(e.dim[r], n.uint32(10).fork()).ldelim();
            return n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.TensorShapeProto(); e.pos < r; ) {
              var l = e.uint32();
              l >>> 3 == 1 ? (a.dim && a.dim.length || (a.dim = []), a.dim.push(i.onnx.TensorShapeProto.Dimension.decode(e, e.uint32()))) : e.skipType(7 & l);
            }
            return a;
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
              for (var a = 0; a < e.dim.length; ++a) r.dim[a] = i.onnx.TensorShapeProto.Dimension.toObject(e.dim[a], n);
            }
            return r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t.Dimension = function() {
            function e(r) {
              if (r) for (var a = Object.keys(r), l = 0; l < a.length; ++l) r[a[l]] != null && (this[a[l]] = r[a[l]]);
            }
            var n;
            return e.prototype.dimValue = s.Long ? s.Long.fromBits(0, 0, !1) : 0, e.prototype.dimParam = "", e.prototype.denotation = "", Object.defineProperty(e.prototype, "value", { get: s.oneOfGetter(n = ["dimValue", "dimParam"]), set: s.oneOfSetter(n) }), e.create = function(r) {
              return new e(r);
            }, e.encode = function(r, a) {
              return a || (a = f.create()), r.dimValue != null && r.hasOwnProperty("dimValue") && a.uint32(8).int64(r.dimValue), r.dimParam != null && r.hasOwnProperty("dimParam") && a.uint32(18).string(r.dimParam), r.denotation != null && r.hasOwnProperty("denotation") && a.uint32(26).string(r.denotation), a;
            }, e.encodeDelimited = function(r, a) {
              return this.encode(r, a).ldelim();
            }, e.decode = function(r, a) {
              r instanceof c || (r = c.create(r));
              for (var l = a === void 0 ? r.len : r.pos + a, d = new i.onnx.TensorShapeProto.Dimension(); r.pos < l; ) {
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
              var a = {};
              if (r.dimValue != null && r.hasOwnProperty("dimValue") && (a.value = 1, !(s.isInteger(r.dimValue) || r.dimValue && s.isInteger(r.dimValue.low) && s.isInteger(r.dimValue.high)))) return "dimValue: integer|Long expected";
              if (r.dimParam != null && r.hasOwnProperty("dimParam")) {
                if (a.value === 1) return "value: multiple values";
                if (a.value = 1, !s.isString(r.dimParam)) return "dimParam: string expected";
              }
              return r.denotation != null && r.hasOwnProperty("denotation") && !s.isString(r.denotation) ? "denotation: string expected" : null;
            }, e.fromObject = function(r) {
              if (r instanceof i.onnx.TensorShapeProto.Dimension) return r;
              var a = new i.onnx.TensorShapeProto.Dimension();
              return r.dimValue != null && (s.Long ? (a.dimValue = s.Long.fromValue(r.dimValue)).unsigned = !1 : typeof r.dimValue == "string" ? a.dimValue = parseInt(r.dimValue, 10) : typeof r.dimValue == "number" ? a.dimValue = r.dimValue : typeof r.dimValue == "object" && (a.dimValue = new s.LongBits(r.dimValue.low >>> 0, r.dimValue.high >>> 0).toNumber())), r.dimParam != null && (a.dimParam = String(r.dimParam)), r.denotation != null && (a.denotation = String(r.denotation)), a;
            }, e.toObject = function(r, a) {
              a || (a = {});
              var l = {};
              return a.defaults && (l.denotation = ""), r.dimValue != null && r.hasOwnProperty("dimValue") && (typeof r.dimValue == "number" ? l.dimValue = a.longs === String ? String(r.dimValue) : r.dimValue : l.dimValue = a.longs === String ? s.Long.prototype.toString.call(r.dimValue) : a.longs === Number ? new s.LongBits(r.dimValue.low >>> 0, r.dimValue.high >>> 0).toNumber() : r.dimValue, a.oneofs && (l.value = "dimValue")), r.dimParam != null && r.hasOwnProperty("dimParam") && (l.dimParam = r.dimParam, a.oneofs && (l.value = "dimParam")), r.denotation != null && r.hasOwnProperty("denotation") && (l.denotation = r.denotation), l;
            }, e.prototype.toJSON = function() {
              return this.constructor.toObject(this, o.util.toJSONOptions);
            }, e;
          }(), t;
        }(), g.TypeProto = function() {
          function t(n) {
            if (n) for (var r = Object.keys(n), a = 0; a < r.length; ++a) n[r[a]] != null && (this[r[a]] = n[r[a]]);
          }
          var e;
          return t.prototype.tensorType = null, t.prototype.denotation = "", Object.defineProperty(t.prototype, "value", { get: s.oneOfGetter(e = ["tensorType"]), set: s.oneOfSetter(e) }), t.create = function(n) {
            return new t(n);
          }, t.encode = function(n, r) {
            return r || (r = f.create()), n.tensorType != null && n.hasOwnProperty("tensorType") && i.onnx.TypeProto.Tensor.encode(n.tensorType, r.uint32(10).fork()).ldelim(), n.denotation != null && n.hasOwnProperty("denotation") && r.uint32(50).string(n.denotation), r;
          }, t.encodeDelimited = function(n, r) {
            return this.encode(n, r).ldelim();
          }, t.decode = function(n, r) {
            n instanceof c || (n = c.create(n));
            for (var a = r === void 0 ? n.len : n.pos + r, l = new i.onnx.TypeProto(); n.pos < a; ) {
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
            return n.denotation != null && n.hasOwnProperty("denotation") && !s.isString(n.denotation) ? "denotation: string expected" : null;
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
            var a = {};
            return r.defaults && (a.denotation = ""), n.tensorType != null && n.hasOwnProperty("tensorType") && (a.tensorType = i.onnx.TypeProto.Tensor.toObject(n.tensorType, r), r.oneofs && (a.value = "tensorType")), n.denotation != null && n.hasOwnProperty("denotation") && (a.denotation = n.denotation), a;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t.Tensor = function() {
            function n(r) {
              if (r) for (var a = Object.keys(r), l = 0; l < a.length; ++l) r[a[l]] != null && (this[a[l]] = r[a[l]]);
            }
            return n.prototype.elemType = 0, n.prototype.shape = null, n.create = function(r) {
              return new n(r);
            }, n.encode = function(r, a) {
              return a || (a = f.create()), r.elemType != null && r.hasOwnProperty("elemType") && a.uint32(8).int32(r.elemType), r.shape != null && r.hasOwnProperty("shape") && i.onnx.TensorShapeProto.encode(r.shape, a.uint32(18).fork()).ldelim(), a;
            }, n.encodeDelimited = function(r, a) {
              return this.encode(r, a).ldelim();
            }, n.decode = function(r, a) {
              r instanceof c || (r = c.create(r));
              for (var l = a === void 0 ? r.len : r.pos + a, d = new i.onnx.TypeProto.Tensor(); r.pos < l; ) {
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
              if (r.elemType != null && r.hasOwnProperty("elemType") && !s.isInteger(r.elemType)) return "elemType: integer expected";
              if (r.shape != null && r.hasOwnProperty("shape")) {
                var a = i.onnx.TensorShapeProto.verify(r.shape);
                if (a) return "shape." + a;
              }
              return null;
            }, n.fromObject = function(r) {
              if (r instanceof i.onnx.TypeProto.Tensor) return r;
              var a = new i.onnx.TypeProto.Tensor();
              if (r.elemType != null && (a.elemType = 0 | r.elemType), r.shape != null) {
                if (typeof r.shape != "object") throw TypeError(".onnx.TypeProto.Tensor.shape: object expected");
                a.shape = i.onnx.TensorShapeProto.fromObject(r.shape);
              }
              return a;
            }, n.toObject = function(r, a) {
              a || (a = {});
              var l = {};
              return a.defaults && (l.elemType = 0, l.shape = null), r.elemType != null && r.hasOwnProperty("elemType") && (l.elemType = r.elemType), r.shape != null && r.hasOwnProperty("shape") && (l.shape = i.onnx.TensorShapeProto.toObject(r.shape, a)), l;
            }, n.prototype.toJSON = function() {
              return this.constructor.toObject(this, o.util.toJSONOptions);
            }, n;
          }(), t;
        }(), g.OperatorSetIdProto = function() {
          function t(e) {
            if (e) for (var n = Object.keys(e), r = 0; r < n.length; ++r) e[n[r]] != null && (this[n[r]] = e[n[r]]);
          }
          return t.prototype.domain = "", t.prototype.version = s.Long ? s.Long.fromBits(0, 0, !1) : 0, t.create = function(e) {
            return new t(e);
          }, t.encode = function(e, n) {
            return n || (n = f.create()), e.domain != null && e.hasOwnProperty("domain") && n.uint32(10).string(e.domain), e.version != null && e.hasOwnProperty("version") && n.uint32(16).int64(e.version), n;
          }, t.encodeDelimited = function(e, n) {
            return this.encode(e, n).ldelim();
          }, t.decode = function(e, n) {
            e instanceof c || (e = c.create(e));
            for (var r = n === void 0 ? e.len : e.pos + n, a = new i.onnx.OperatorSetIdProto(); e.pos < r; ) {
              var l = e.uint32();
              switch (l >>> 3) {
                case 1:
                  a.domain = e.string();
                  break;
                case 2:
                  a.version = e.int64();
                  break;
                default:
                  e.skipType(7 & l);
              }
            }
            return a;
          }, t.decodeDelimited = function(e) {
            return e instanceof c || (e = new c(e)), this.decode(e, e.uint32());
          }, t.verify = function(e) {
            return typeof e != "object" || e === null ? "object expected" : e.domain != null && e.hasOwnProperty("domain") && !s.isString(e.domain) ? "domain: string expected" : e.version != null && e.hasOwnProperty("version") && !(s.isInteger(e.version) || e.version && s.isInteger(e.version.low) && s.isInteger(e.version.high)) ? "version: integer|Long expected" : null;
          }, t.fromObject = function(e) {
            if (e instanceof i.onnx.OperatorSetIdProto) return e;
            var n = new i.onnx.OperatorSetIdProto();
            return e.domain != null && (n.domain = String(e.domain)), e.version != null && (s.Long ? (n.version = s.Long.fromValue(e.version)).unsigned = !1 : typeof e.version == "string" ? n.version = parseInt(e.version, 10) : typeof e.version == "number" ? n.version = e.version : typeof e.version == "object" && (n.version = new s.LongBits(e.version.low >>> 0, e.version.high >>> 0).toNumber())), n;
          }, t.toObject = function(e, n) {
            n || (n = {});
            var r = {};
            if (n.defaults) if (r.domain = "", s.Long) {
              var a = new s.Long(0, 0, !1);
              r.version = n.longs === String ? a.toString() : n.longs === Number ? a.toNumber() : a;
            } else r.version = n.longs === String ? "0" : 0;
            return e.domain != null && e.hasOwnProperty("domain") && (r.domain = e.domain), e.version != null && e.hasOwnProperty("version") && (typeof e.version == "number" ? r.version = n.longs === String ? String(e.version) : e.version : r.version = n.longs === String ? s.Long.prototype.toString.call(e.version) : n.longs === Number ? new s.LongBits(e.version.low >>> 0, e.version.high >>> 0).toNumber() : e.version), r;
          }, t.prototype.toJSON = function() {
            return this.constructor.toObject(this, o.util.toJSONOptions);
          }, t;
        }(), g), R.exports = i;
      }, 2100: (R, u, b) => {
        R.exports = b(9482);
      }, 9482: (R, u, b) => {
        var h = u;
        function p() {
          h.util._configure(), h.Writer._configure(h.BufferWriter), h.Reader._configure(h.BufferReader);
        }
        h.build = "minimal", h.Writer = b(1173), h.BufferWriter = b(3155), h.Reader = b(1408), h.BufferReader = b(593), h.util = b(9693), h.rpc = b(5994), h.roots = b(5054), h.configure = p, p();
      }, 1408: (R, u, b) => {
        R.exports = f;
        var h, p = b(9693), g = p.LongBits, o = p.utf8;
        function c(a, l) {
          return RangeError("index out of range: " + a.pos + " + " + (l || 1) + " > " + a.len);
        }
        function f(a) {
          this.buf = a, this.pos = 0, this.len = a.length;
        }
        var s, i = typeof Uint8Array < "u" ? function(a) {
          if (a instanceof Uint8Array || Array.isArray(a)) return new f(a);
          throw Error("illegal buffer");
        } : function(a) {
          if (Array.isArray(a)) return new f(a);
          throw Error("illegal buffer");
        }, t = function() {
          return p.Buffer ? function(a) {
            return (f.create = function(l) {
              return p.Buffer.isBuffer(l) ? new h(l) : i(l);
            })(a);
          } : i;
        };
        function e() {
          var a = new g(0, 0), l = 0;
          if (!(this.len - this.pos > 4)) {
            for (; l < 3; ++l) {
              if (this.pos >= this.len) throw c(this);
              if (a.lo = (a.lo | (127 & this.buf[this.pos]) << 7 * l) >>> 0, this.buf[this.pos++] < 128) return a;
            }
            return a.lo = (a.lo | (127 & this.buf[this.pos++]) << 7 * l) >>> 0, a;
          }
          for (; l < 4; ++l) if (a.lo = (a.lo | (127 & this.buf[this.pos]) << 7 * l) >>> 0, this.buf[this.pos++] < 128) return a;
          if (a.lo = (a.lo | (127 & this.buf[this.pos]) << 28) >>> 0, a.hi = (a.hi | (127 & this.buf[this.pos]) >> 4) >>> 0, this.buf[this.pos++] < 128) return a;
          if (l = 0, this.len - this.pos > 4) {
            for (; l < 5; ++l) if (a.hi = (a.hi | (127 & this.buf[this.pos]) << 7 * l + 3) >>> 0, this.buf[this.pos++] < 128) return a;
          } else for (; l < 5; ++l) {
            if (this.pos >= this.len) throw c(this);
            if (a.hi = (a.hi | (127 & this.buf[this.pos]) << 7 * l + 3) >>> 0, this.buf[this.pos++] < 128) return a;
          }
          throw Error("invalid varint encoding");
        }
        function n(a, l) {
          return (a[l - 4] | a[l - 3] << 8 | a[l - 2] << 16 | a[l - 1] << 24) >>> 0;
        }
        function r() {
          if (this.pos + 8 > this.len) throw c(this, 8);
          return new g(n(this.buf, this.pos += 4), n(this.buf, this.pos += 4));
        }
        f.create = t(), f.prototype._slice = p.Array.prototype.subarray || p.Array.prototype.slice, f.prototype.uint32 = (s = 4294967295, function() {
          if (s = (127 & this.buf[this.pos]) >>> 0, this.buf[this.pos++] < 128 || (s = (s | (127 & this.buf[this.pos]) << 7) >>> 0, this.buf[this.pos++] < 128) || (s = (s | (127 & this.buf[this.pos]) << 14) >>> 0, this.buf[this.pos++] < 128) || (s = (s | (127 & this.buf[this.pos]) << 21) >>> 0, this.buf[this.pos++] < 128) || (s = (s | (15 & this.buf[this.pos]) << 28) >>> 0, this.buf[this.pos++] < 128)) return s;
          if ((this.pos += 5) > this.len) throw this.pos = this.len, c(this, 10);
          return s;
        }), f.prototype.int32 = function() {
          return 0 | this.uint32();
        }, f.prototype.sint32 = function() {
          var a = this.uint32();
          return a >>> 1 ^ -(1 & a) | 0;
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
          var a = p.float.readFloatLE(this.buf, this.pos);
          return this.pos += 4, a;
        }, f.prototype.double = function() {
          if (this.pos + 8 > this.len) throw c(this, 4);
          var a = p.float.readDoubleLE(this.buf, this.pos);
          return this.pos += 8, a;
        }, f.prototype.bytes = function() {
          var a = this.uint32(), l = this.pos, d = this.pos + a;
          if (d > this.len) throw c(this, a);
          return this.pos += a, Array.isArray(this.buf) ? this.buf.slice(l, d) : l === d ? new this.buf.constructor(0) : this._slice.call(this.buf, l, d);
        }, f.prototype.string = function() {
          var a = this.bytes();
          return o.read(a, 0, a.length);
        }, f.prototype.skip = function(a) {
          if (typeof a == "number") {
            if (this.pos + a > this.len) throw c(this, a);
            this.pos += a;
          } else do
            if (this.pos >= this.len) throw c(this);
          while (128 & this.buf[this.pos++]);
          return this;
        }, f.prototype.skipType = function(a) {
          switch (a) {
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
              for (; (a = 7 & this.uint32()) != 4; ) this.skipType(a);
              break;
            case 5:
              this.skip(4);
              break;
            default:
              throw Error("invalid wire type " + a + " at offset " + this.pos);
          }
          return this;
        }, f._configure = function(a) {
          h = a, f.create = t(), h._configure();
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
      }, 593: (R, u, b) => {
        R.exports = g;
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
      }, 5054: (R) => {
        R.exports = {};
      }, 5994: (R, u, b) => {
        u.Service = b(7948);
      }, 7948: (R, u, b) => {
        R.exports = p;
        var h = b(9693);
        function p(g, o, c) {
          if (typeof g != "function") throw TypeError("rpcImpl must be a function");
          h.EventEmitter.call(this), this.rpcImpl = g, this.requestDelimited = !!o, this.responseDelimited = !!c;
        }
        (p.prototype = Object.create(h.EventEmitter.prototype)).constructor = p, p.prototype.rpcCall = function g(o, c, f, s, i) {
          if (!s) throw TypeError("request must be specified");
          var t = this;
          if (!i) return h.asPromise(g, t, o, c, f, s);
          if (t.rpcImpl) try {
            return t.rpcImpl(o, c[t.requestDelimited ? "encodeDelimited" : "encode"](s).finish(), function(e, n) {
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
      }, 1945: (R, u, b) => {
        R.exports = p;
        var h = b(9693);
        function p(f, s) {
          this.lo = f >>> 0, this.hi = s >>> 0;
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
          var s = f < 0;
          s && (f = -f);
          var i = f >>> 0, t = (f - i) / 4294967296 >>> 0;
          return s && (t = ~t >>> 0, i = ~i >>> 0, ++i > 4294967295 && (i = 0, ++t > 4294967295 && (t = 0))), new p(i, t);
        }, p.from = function(f) {
          if (typeof f == "number") return p.fromNumber(f);
          if (h.isString(f)) {
            if (!h.Long) return p.fromNumber(parseInt(f, 10));
            f = h.Long.fromString(f);
          }
          return f.low || f.high ? new p(f.low >>> 0, f.high >>> 0) : g;
        }, p.prototype.toNumber = function(f) {
          if (!f && this.hi >>> 31) {
            var s = 1 + ~this.lo >>> 0, i = ~this.hi >>> 0;
            return s || (i = i + 1 >>> 0), -(s + 4294967296 * i);
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
          var f = this.lo, s = (this.lo >>> 28 | this.hi << 4) >>> 0, i = this.hi >>> 24;
          return i === 0 ? s === 0 ? f < 16384 ? f < 128 ? 1 : 2 : f < 2097152 ? 3 : 4 : s < 16384 ? s < 128 ? 5 : 6 : s < 2097152 ? 7 : 8 : i < 128 ? 9 : 10;
        };
      }, 9693: function(R, u, b) {
        var h = u;
        function p(o, c, f) {
          for (var s = Object.keys(c), i = 0; i < s.length; ++i) o[s[i]] !== void 0 && f || (o[s[i]] = c[s[i]]);
          return o;
        }
        function g(o) {
          function c(f, s) {
            if (!(this instanceof c)) return new c(f, s);
            Object.defineProperty(this, "message", { get: function() {
              return f;
            } }), Error.captureStackTrace ? Error.captureStackTrace(this, c) : Object.defineProperty(this, "stack", { value: new Error().stack || "" }), s && p(this, s);
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
            for (var s = Object.keys(this), i = s.length - 1; i > -1; --i) if (c[s[i]] === 1 && this[s[i]] !== void 0 && this[s[i]] !== null) return s[i];
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
      }, 1173: (R, u, b) => {
        R.exports = t;
        var h, p = b(9693), g = p.LongBits, o = p.base64, c = p.utf8;
        function f(m, y, _) {
          this.fn = m, this.len = y, this.next = void 0, this.val = _;
        }
        function s() {
        }
        function i(m) {
          this.head = m.head, this.tail = m.tail, this.len = m.len, this.next = m.states;
        }
        function t() {
          this.len = 0, this.head = new f(s, 0, 0), this.tail = this.head, this.states = null;
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
        function n(m, y, _) {
          y[_] = 255 & m;
        }
        function r(m, y) {
          this.len = m, this.next = void 0, this.val = y;
        }
        function a(m, y, _) {
          for (; m.hi; ) y[_++] = 127 & m.lo | 128, m.lo = (m.lo >>> 7 | m.hi << 25) >>> 0, m.hi >>>= 7;
          for (; m.lo > 127; ) y[_++] = 127 & m.lo | 128, m.lo = m.lo >>> 7;
          y[_++] = m.lo;
        }
        function l(m, y, _) {
          y[_] = 255 & m, y[_ + 1] = m >>> 8 & 255, y[_ + 2] = m >>> 16 & 255, y[_ + 3] = m >>> 24;
        }
        t.create = e(), t.alloc = function(m) {
          return new p.Array(m);
        }, p.Array !== Array && (t.alloc = p.pool(t.alloc, p.Array.prototype.subarray)), t.prototype._push = function(m, y, _) {
          return this.tail = this.tail.next = new f(m, y, _), this.len += y, this;
        }, r.prototype = Object.create(f.prototype), r.prototype.fn = function(m, y, _) {
          for (; m > 127; ) y[_++] = 127 & m | 128, m >>>= 7;
          y[_] = m;
        }, t.prototype.uint32 = function(m) {
          return this.len += (this.tail = this.tail.next = new r((m >>>= 0) < 128 ? 1 : m < 16384 ? 2 : m < 2097152 ? 3 : m < 268435456 ? 4 : 5, m)).len, this;
        }, t.prototype.int32 = function(m) {
          return m < 0 ? this._push(a, 10, g.fromNumber(m)) : this.uint32(m);
        }, t.prototype.sint32 = function(m) {
          return this.uint32((m << 1 ^ m >> 31) >>> 0);
        }, t.prototype.uint64 = function(m) {
          var y = g.from(m);
          return this._push(a, y.length(), y);
        }, t.prototype.int64 = t.prototype.uint64, t.prototype.sint64 = function(m) {
          var y = g.from(m).zzEncode();
          return this._push(a, y.length(), y);
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
        var d = p.Array.prototype.set ? function(m, y, _) {
          y.set(m, _);
        } : function(m, y, _) {
          for (var v = 0; v < m.length; ++v) y[_ + v] = m[v];
        };
        t.prototype.bytes = function(m) {
          var y = m.length >>> 0;
          if (!y) return this._push(n, 1, 0);
          if (p.isString(m)) {
            var _ = t.alloc(y = o.length(m));
            o.decode(m, _, 0), m = _;
          }
          return this.uint32(y)._push(d, y, m);
        }, t.prototype.string = function(m) {
          var y = c.length(m);
          return y ? this.uint32(y)._push(c.write, y, m) : this._push(n, 1, 0);
        }, t.prototype.fork = function() {
          return this.states = new i(this), this.head = this.tail = new f(s, 0, 0), this.len = 0, this;
        }, t.prototype.reset = function() {
          return this.states ? (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new f(s, 0, 0), this.len = 0), this;
        }, t.prototype.ldelim = function() {
          var m = this.head, y = this.tail, _ = this.len;
          return this.reset().uint32(_), _ && (this.tail.next = m.next, this.tail = y, this.len += _), this;
        }, t.prototype.finish = function() {
          for (var m = this.head.next, y = this.constructor.alloc(this.len), _ = 0; m; ) m.fn(m.val, y, _), _ += m.len, m = m.next;
          return y;
        }, t._configure = function(m) {
          h = m, t.create = e(), h._configure();
        };
      }, 3155: (R, u, b) => {
        R.exports = g;
        var h = b(1173);
        (g.prototype = Object.create(h.prototype)).constructor = g;
        var p = b(9693);
        function g() {
          h.call(this);
        }
        function o(c, f, s) {
          c.length < 40 ? p.utf8.write(c, f, s) : f.utf8Write ? f.utf8Write(c, s) : f.write(c, s);
        }
        g._configure = function() {
          g.alloc = p._Buffer_allocUnsafe, g.writeBytesBuffer = p.Buffer && p.Buffer.prototype instanceof Uint8Array && p.Buffer.prototype.set.name === "set" ? function(c, f, s) {
            f.set(c, s);
          } : function(c, f, s) {
            if (c.copy) c.copy(f, s, 0, c.length);
            else for (var i = 0; i < c.length; ) f[s++] = c[i++];
          };
        }, g.prototype.bytes = function(c) {
          p.isString(c) && (c = p._Buffer_from(c, "base64"));
          var f = c.length >>> 0;
          return this.uint32(f), f && this._push(g.writeBytesBuffer, f, c), this;
        }, g.prototype.string = function(c) {
          var f = p.Buffer.byteLength(c);
          return this.uint32(f), f && this._push(o, f, c), this;
        }, g._configure();
      }, 7714: (R, u, b) => {
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
      }, 4200: (R, u, b) => {
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
            const s = new o.OnnxruntimeWebAssemblySessionHandler();
            return await s.loadModel(c, f), Promise.resolve(s);
          }
        }();
      }, 6018: function(R, u, b) {
        var h = this && this.__createBinding || (Object.create ? function(o, c, f, s) {
          s === void 0 && (s = f);
          var i = Object.getOwnPropertyDescriptor(c, f);
          i && !("get" in i ? !c.__esModule : i.writable || i.configurable) || (i = { enumerable: !0, get: function() {
            return c[f];
          } }), Object.defineProperty(o, s, i);
        } : function(o, c, f, s) {
          s === void 0 && (s = f), o[s] = c[f];
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
      }, 246: (R, u) => {
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
      }, 7778: (R, u, b) => {
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
              for (let a = 0; a < n.length; a++) {
                const l = n[a];
                r[a] = o.LongUtil.longToNumber(l);
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
      }, 7091: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.resolveBackend = u.backend = void 0;
        const h = b(5038), p = /* @__PURE__ */ new Map();
        async function g(o) {
          const c = u.backend;
          if (c[o] !== void 0 && function(f) {
            const s = f;
            return "initialize" in s && typeof s.initialize == "function" && "createSessionHandler" in s && typeof s.createSessionHandler == "function" && "dispose" in s && typeof s.dispose == "function";
          }(c[o])) {
            const f = c[o];
            let s = f.initialize();
            if (typeof s == "object" && "then" in s && (s = await s), s) return p.set(o, f), f;
          }
        }
        u.backend = { webgl: new h.WebGLBackend() }, u.resolveBackend = async function o(c) {
          if (!c) return o(["webgl"]);
          {
            const f = typeof c == "string" ? [c] : c;
            for (const s of f) {
              const i = p.get(s);
              if (i) return i;
              const t = await g(s);
              if (t) return t;
            }
          }
          throw new Error("no available backend to use");
        };
      }, 5038: (R, u, b) => {
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
      }, 5107: (R, u, b) => {
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
            const a = `
      void setOutput(vec4 val) {
        ${(0, g.getGlsl)(this.context.glContext.version).output} = val;
      }
    `;
            return n.floatTextureSetRGBA = new p.GlslLibRoutine(a), n;
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
            const a = `
        void setOutput(float val) {
          ${(0, g.getGlsl)(this.context.glContext.version).output} = vec4(val, 0, 0, 0);
        }
    `;
            return n.floatTextureSetR = new p.GlslLibRoutine(a), n;
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
            const e = [t[0], t[1]], n = Math.ceil(i[2] / 2), r = n * Math.ceil(i[1] / 2), a = `
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
            return new p.GlslLibRoutine(a);
          }
          getOutputPackedNDCoords(i, t) {
            const e = [t[0], t[1]], n = Math.ceil(i[i.length - 1] / 2), r = n * Math.ceil(i[i.length - 2] / 2);
            let a = r, l = "", d = "b, r, c";
            for (let y = 2; y < i.length - 1; y++) a *= i[i.length - y - 1], l = `
      int b${y} = index / ${a};
      index -= b${y} * ${a};
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
            const a = ["r", "c", "d"], l = r.map((d, m) => `int ${a[m]} = index / ${d}; ${m === r.length - 1 ? `int ${a[m + 1]} = index - ${a[m]} * ${d}` : `index -= ${a[m]} * ${d}`};`).join("");
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
            const a = ["r", "c", "d", "d2"], l = r.map((d, m) => `int ${a[m]} = index / ${d}; ${m === r.length - 1 ? `int ${a[m + 1]} = index - ${a[m]} * ${d}` : `index -= ${a[m]} * ${d}`};`).join("");
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
            const a = ["r", "c", "d", "d2", "d3"], l = r.map((d, m) => `int ${a[m]} = index / ${d}; ${m === r.length - 1 ? `int ${a[m + 1]} = index - ${a[m]} * ${d}` : `index -= ${a[m]} * ${d}`};`).join("");
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
            const a = ["r", "c", "d", "d2", "d3", "d4"], l = r.map((d, m) => `int ${a[m]} = index / ${d}; ${m === r.length - 1 ? `int ${a[m + 1]} = index - ${a[m]} * ${d}` : `index -= ${a[m]} * ${d}`};`).join("");
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
              const r = this.context.inputTextureLayouts[n], a = (0, c.generateShaderFuncNameFromInputSamplerName)(e);
              r.isPacked ? i[a] = this.getPackedSamplerFromInput(a, e, r) : i[a] = this.getUnpackedSamplerFromInput(a, e, r);
              const l = (0, c.generateShaderFuncNameFromInputSamplerNameAtOutCoords)(e);
              r.unpackedShape.length <= t.unpackedShape.length && (r.isPacked ? i[l] = this.getPackedSamplerAtOutputCoords(l, r, t, e) : i[l] = this.getUnpackedSamplerAtOutputCoords(l, r, t, e));
            }), i;
          }
          getPackedSamplerAtOutputCoords(i, t, e, n) {
            const r = t.unpackedShape, a = e.unpackedShape, l = n, d = (0, c.generateShaderFuncNameFromInputSamplerName)(l), m = r.length, y = a.length, _ = h.BroadcastUtil.getBroadcastDims(r, a), v = (0, c.getCoordsDataType)(y), S = y - m;
            let O;
            const I = (0, c.getGlChannels)();
            O = m === 0 ? "" : y < 2 && _.length >= 1 ? "coords = 0;" : _.map((A) => `coords.${I[A + S]} = 0;`).join(`
`);
            let w = "";
            w = y < 2 && m > 0 ? "coords" : r.map((A, M) => `coords.${I[M + S]}`).join(", ");
            let C = "return outputValue;";
            const V = h.ShapeUtil.size(r) === 1, G = h.ShapeUtil.size(a) === 1;
            if (m !== 1 || V || G) {
              if (V && !G) C = y === 1 ? `
          return vec4(outputValue.x, outputValue.x, 0., 0.);
        ` : `
          return vec4(outputValue.x);
        `;
              else if (_.length) {
                const A = m - 2, M = m - 1;
                _.indexOf(A) > -1 && _.indexOf(M) > -1 ? C = "return vec4(outputValue.x);" : _.indexOf(A) > -1 ? C = "return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);" : _.indexOf(M) > -1 && (C = "return vec4(outputValue.xx, outputValue.zz);");
              }
            } else C = `
        return vec4(outputValue.xy, outputValue.xy);
      `;
            const D = `
      vec4 ${i}() {
        ${v} coords = getOutputCoords();
        
        int lastDim = coords.${I[y - 1]};
        coords.${I[y - 1]} = coords.${I[y - 2]};
        coords.${I[y - 2]} = lastDim;
      
        ${O}
        vec4 outputValue = ${d}(${w});
        ${C}
      }
    `;
            return new p.GlslLibRoutine(D, ["coordinates.getOutputCoords"]);
          }
          getUnpackedSamplerAtOutputCoords(i, t, e, n) {
            const r = [e.width, e.height], a = [t.width, t.height], l = t.unpackedShape.length, d = e.unpackedShape.length, m = t.unpackedShape, y = e.unpackedShape, _ = (0, c.generateShaderFuncNameFromInputSamplerName)(n);
            if (l === d && h.ArrayUtil.arraysEqual(a, r)) {
              const G = `
          float ${i}() {
            return sampleTexture(${n}, TexCoords);
          }
        `;
              return new p.GlslLibRoutine(G, ["coordinates.sampleTexture"]);
            }
            const v = (0, c.getCoordsDataType)(d), S = h.BroadcastUtil.getBroadcastDims(m, y), O = d - l;
            let I;
            const w = (0, c.getGlChannels)();
            I = l === 0 ? "" : d < 2 && S.length >= 1 ? "coords = 0;" : S.map((G) => `coords.${w[G + O]} = 0;`).join(`
`);
            let C = "";
            C = d < 2 && l > 0 ? "coords" : t.unpackedShape.map((G, D) => `coords.${w[D + O]}`).join(", ");
            const V = `
        float ${i}() {
          ${v} coords = getOutputCoords();
          ${I}
          return ${_}(${C});
        }
      `;
            return new p.GlslLibRoutine(V, ["coordinates.getOutputCoords"]);
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
            const n = [e.width, e.height], r = [n[1], n[0]], a = (0, g.getGlsl)(this.context.glContext.version), l = `vec4 ${i}(int index) {
      vec2 uv = packedUVfrom1D(
      ${r[0]}, ${r[1]}, index);
      return ${a.texture2D}(${t}, uv);
    }`;
            return new p.GlslLibRoutine(l, ["coordinates.packedUVfrom1D"]);
          }
          getPackedSampler2D(i, t, e) {
            const n = e.unpackedShape, r = [e.width, e.height], a = (0, g.getGlsl)(this.context.glContext.version), l = r[0], d = r[1];
            if (r != null && h.ArrayUtil.arraysEqual(n, r)) {
              const v = `vec4 ${i}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${d}.0, ${l}.0);
        return ${a.texture2D}(${t}, uv);
      }`;
              return new p.GlslLibRoutine(v);
            }
            const m = r, y = Math.ceil(n[1] / 2), _ = `vec4 ${i}(int row, int col) {
      vec2 uv = packedUVfrom2D(${m[1]}, ${m[0]}, ${y}, row, col);
      return ${a.texture2D}(${t}, uv);
    }`;
            return new p.GlslLibRoutine(_, ["coordinates.packedUVfrom2D"]);
          }
          getPackedSampler3D(i, t, e) {
            const n = e.unpackedShape, r = [e.width, e.height], a = [r[0], r[1]], l = (0, g.getGlsl)(this.context.glContext.version);
            if (n[0] === 1) {
              const v = n.slice(1), S = [1, 2], O = (0, c.squeezeInputShape)(n, v), I = ["b", "row", "col"], w = JSON.parse(JSON.stringify(e));
              w.unpackedShape = O;
              const C = this.getPackedSamplerFromInput(i, t, w), V = `${C.routineBody}
      vec4 ${i}(int b, int row, int col) {
        return ${i}(${(0, c.getSqueezedParams)(I, S)});
      } `;
              return new p.GlslLibRoutine(V, C.dependencies);
            }
            const d = a[0], m = a[1], y = Math.ceil(n[2] / 2), _ = `vec4 ${i}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${m}, ${d}, ${y * Math.ceil(n[1] / 2)}, ${y}, b, row, col);
      return ${l.texture2D}(${t}, uv);}`;
            return new p.GlslLibRoutine(_, ["coordinates.packedUVfrom3D"]);
          }
          getPackedSamplerND(i, t, e) {
            const n = e.unpackedShape, r = n.length, a = [e.width, e.height], l = (0, g.getGlsl)(this.context.glContext.version), d = [a[0], a[1]], m = d[1], y = d[0], _ = Math.ceil(n[r - 1] / 2);
            let v = _ * Math.ceil(n[r - 2] / 2), S = "int b, int row, int col", O = `b * ${v} + (row / 2) * ${_} + (col / 2)`;
            for (let w = 2; w < r - 1; w++) S = `int b${w}, ` + S, v *= n[r - w - 1], O = `b${w} * ${v} + ` + O;
            const I = `vec4 ${i}(${S}) {
      int index = ${O};
      int texR = index / ${y};
      int texC = index - texR * ${y};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${y}, ${m});
      return ${l.texture2D}(${t}, uv);
    }`;
            return new p.GlslLibRoutine(I);
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
            const a = `
        float ${i}() {
          int offset_${t} = coordsToOffset(TexCoords, ${n}, ${r});
          vec2 uv = uvFromFlat(${n}, ${r}, offset_${t});
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(a, ["coordinates.uvFromFlat", "coordinates.sampleTexture", "coordinates.coordsToOffset"]);
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
            const a = `
        float ${i}(int index) {
          vec2 uv = uvFromFlat(${n}, ${r}, index);
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(a, ["coordinates.uvFromFlat", "coordinates.sampleTexture"]);
          }
          getUnpackedSampler2D(i, t, e) {
            const n = e.unpackedShape, r = [e.height, e.width];
            if (r != null && h.ArrayUtil.arraysEqual(n, r)) {
              const v = `
          float ${i}(int row, int col) {
            vec2 uv = (vec2(row, col) + halfCR) / vec2(${r[1]}.0, ${r[0]}.0);
            return sampleTexture(${t}, uv);
          }
        `;
              return new p.GlslLibRoutine(v, ["coordinates.sampleTexture"]);
            }
            const { newShape: a, keptDims: l } = (0, o.squeezeShape)(n), d = a;
            if (d.length < n.length) {
              const v = (0, c.squeezeInputShape)(n, d), S = JSON.parse(JSON.stringify(e));
              S.unpackedShape = v;
              const O = ["col", "row"], I = `
          ${this.getUnpackedSamplerFromInput(i, t, S).routineBody}
          float ${i}(int row, int col) {
            return ${i}(${(0, c.getSqueezedParams)(O, l)});
          }
        `;
              return new p.GlslLibRoutine(I, ["coordinates.sampleTexture"]);
            }
            const m = r[1], y = r[0];
            if (y === 1) {
              const v = `
          float ${i}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${m}, ${y});
            float index = dot(vec3(row, col, offset_${t}), vec3(${n[1]}, 1, 1));
            vec2 uv = vec2(0.5, (index + 0.5) / ${m}.0);
            return sampleTexture(${t}, uv);
          }
        `;
              return new p.GlslLibRoutine(v, ["coordinates.sampleTexture", "coordinates.coordsToOffset"]);
            }
            if (m === 1) {
              const v = `
          float ${i}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${m}, ${y});
            float index = dot(vec3(row, col, offset_${t}), vec3(${n[1]}, 1, 1));
            vec2 uv = vec2((index + 0.5) / ${y}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;
              return new p.GlslLibRoutine(v, ["coordinates.sampleTexture", "coordinates.coordsToOffset"]);
            }
            const _ = `
        float ${i}(int row, int col) {
          int index = col * ${n[1]} + row;
          vec2 uv = uvFromFlat(${m}, ${y}, index);
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(_, ["coordinates.uvFromFlat", "coordinates.sampleTexture", "coordinates.coordsToOffset"]);
          }
          getUnpackedSampler3D(i, t, e) {
            const n = e.unpackedShape, r = n[1] * n[2], a = n[2], { newShape: l, keptDims: d } = (0, o.squeezeShape)(n), m = l;
            if (m.length < n.length) {
              const _ = (0, c.squeezeInputShape)(n, m), v = ["batch", "col", "row"], S = JSON.parse(JSON.stringify(e));
              S.unpackedShape = _;
              const O = this.getUnpackedSamplerFromInput(i, t, S), I = d.reverse(), w = `
          ${O.routineBody}
          float ${i}(int batch, int row, int col) {
            return ${i}(${(0, c.getSqueezedParams)(v, I)});
          }
        `;
              return new p.GlslLibRoutine(w, O.dependencies);
            }
            const y = `
          float ${i}(int depth, int row, int col) {
            // Explicitly use integer operations as dot() only works on floats.
            int index = depth * ${r} + col * ${a} + row;
            vec2 uv = uvFromFlat(${e.width}, ${e.height}, index);
            return sampleTexture(${t}, uv);
          }
      `;
            return new p.GlslLibRoutine(y, ["coordinates.uvFromFlat", "coordinates.sampleTexture", "coordinates.coordsToOffset"]);
          }
          getUnpackedSampler4D(i, t, e) {
            const n = e.unpackedShape, r = n[3], a = n[2] * r, l = `
        float ${i}(int row, int col, int depth, int depth2) {
          int index = row * ${n[1] * a} + col * ${a} +
              depth2 * ${r} + depth;
          vec2 uv = uvFromFlat(${e.width}, ${e.height}, index);
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(l, ["coordinates.uvFromFlat", "coordinates.sampleTexture"]);
          }
          getUnpackedSampler5D(i, t, e) {
            const n = e.unpackedShape, r = n[4], a = n[3] * r, l = n[2] * a, d = n[1] * l, { newShape: m, keptDims: y } = (0, o.squeezeShape)(n);
            if (m.length < n.length) {
              const v = (0, c.squeezeInputShape)(n, m), S = ["row", "col", "depth", "depth2", "depth3"], O = JSON.parse(JSON.stringify(e));
              O.unpackedShape = v;
              const I = `
          ${this.getUnpackedSamplerFromInput(i, t, O).routineBody}
          float ${i}(int row, int col, int depth, int depth2, int depth3) {
            return ${i}(${(0, c.getSqueezedParams)(S, y)});
          }
        `;
              return new p.GlslLibRoutine(I, ["coordinates.sampleTexture", "coordinates.uvFromFlat"]);
            }
            const _ = `
        float ${i}(int row, int col, int depth, int depth2, int depth3) {
          int index = row * ${d} + col * ${l} + depth * ${a} +
          depth3 * ${r} + depth2;
          vec2 uv = uvFromFlat(${e.width}, ${e.height}, index);
          return sampleTexture(${t}, uv);
        }
      `;
            return new p.GlslLibRoutine(_, ["coordinates.sampleTexture", "coordinates.uvFromFlat"]);
          }
          getUnpackedSampler6D(i, t, e) {
            const n = e.unpackedShape, r = n[5], a = n[4] * r, l = n[3] * a, d = n[2] * l, m = n[1] * d, { newShape: y, keptDims: _ } = (0, o.squeezeShape)(n);
            if (y.length < n.length) {
              const S = (0, c.squeezeInputShape)(n, y), O = ["row", "col", "depth", "depth2", "depth3", "depth4"], I = JSON.parse(JSON.stringify(e));
              I.unpackedShape = S;
              const w = `
            ${this.getUnpackedSamplerFromInput(i, t, I).routineBody}
            float ${i}(int row, int col, int depth,
              int depth2, int depth3, int depth4) {
              return ${i}(${(0, c.getSqueezedParams)(O, _)});
            }
          `;
              return new p.GlslLibRoutine(w, ["coordinates.sampleTexture", "coordinates.uvFromFlat"]);
            }
            const v = `
          float ${i}(int row, int col, int depth,
            int depth2, int depth3, int depth4) {
            int index = row * ${m} + col * ${d} + depth * ${l} +
            depth2 * ${a} + depth3 * ${r} + depth4;
            vec2 uv = uvFromFlat(${e.width}, ${e.height}, index);
            return sampleTexture(${t}, uv);
          }
        `;
            return new p.GlslLibRoutine(v, ["coordinates.uvFromFlat", "coordinates.sampleTexture", "coordinates.coordsToOffset"]);
          }
          toVec() {
            const i = this.context.outputTextureLayout, t = i.shape.length, e = i.strides, n = i.width, r = i.height, a = [];
            for (let d = 0; d < t - 1; ++d) a.push(`
        c[${d}] = offset / ${e[d]};`), a.push(`
        offset -= c[${d}] * ${e[d]};`);
            a.push(`
        c[${t - 1}] = offset;`);
            const l = `
      void toVec(vec2 texCoords, out int c[${t}]) {
        int offset = coordsToOffset(texCoords, ${n}, ${r});
        ${a.join("")}
      }
      void toVec(int offset, out int c[${t}]) {
        ${a.join("")}
      }
    `;
            return { toVec: new p.GlslLibRoutine(l, ["coordinates.coordsToOffset"]) };
          }
          valueFrom() {
            const i = {};
            return this.context.programInfo.inputNames.forEach((t, e) => {
              const n = this.context.inputTextureLayouts[e], r = (n.unpackedShape.length > 0 ? n.unpackedShape : n.shape).length;
              let a = `_${t}`;
              i[a] = new p.GlslLibRoutine(this.getValueFromSingle(t, r, n.width, n.height, !1), [`shapeUtils.indicesToOffset${a}`, "coordinates.offsetToCoords", "fragcolor.getColorAsFloat"]), a += "_T", i[a] = new p.GlslLibRoutine(this.getValueFromSingle(t, r, n.width, n.height, !0), [`shapeUtils.indicesToOffset${a}`, "coordinates.offsetToCoords", "fragcolor.getColorAsFloat"]);
            }), i;
          }
          getValueFromSingle(i, t, e, n, r) {
            let a = `_${i}`;
            return r && (a += "_T"), `
        float ${a}(int m[${t}]) {
          int offset = indicesToOffset${a}(m);
          vec2 coords = offsetToCoords(offset, ${e}, ${n});
          float value = getColorAsFloat(${(0, g.getGlsl)(this.context.glContext.version).texture2D}(${i}, coords));
          return value;
        }
        `;
          }
          getPackedValueFrom(i, t, e, n, r) {
            let a = `_${i}_Pack`;
            return r && (a += "_T"), `
        vec4 ${a}(int m[${t}]) {
          int offset = indicesToOffset_${i}(m);
          vec2 coords = offsetToCoords(offset, ${e}, ${n});
          return ${(0, g.getGlsl)(this.context.glContext.version).texture2D}(${i}, coords);
        }
        `;
          }
        }
        u.CoordsGlslLib = f;
      }, 8520: (R, u) => {
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
      }, 7341: (R, u, b) => {
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
      }, 9894: (R, u, b) => {
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
      }, 2848: (R, u) => {
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
              const s = g[1], i = g[2], t = g[3].split(","), e = s ? `${s} ${i};` : "";
              let n = p[o].body, r = "";
              p[o].params.forEach((l, d) => {
                l && (r += `${l.type} ${l.name} = ${t[d]};
`);
              }), n = `${r}
 ${n}`, n = n.replace("return", `${i} = `);
              const a = `
      ${e}
      {
        ${n}
      }
      `;
              h = h.replace(g[0], a);
            }
          }
          return h.replace(b, "");
        };
      }, 8879: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.GlslPreprocessor = void 0;
        const h = b(8520), p = b(2848), g = b(5483), o = b(5060);
        u.GlslPreprocessor = class {
          constructor(c, f, s, i) {
            this.libs = {}, this.glslLibRoutineDependencyGraph = {}, this.context = new h.GlslContext(c, f, s, i), Object.keys(g.glslRegistry).forEach((e) => {
              const n = new g.glslRegistry[e](this.context);
              this.libs[e] = n;
            });
            const t = this.glslLibRoutineDependencyGraph;
            for (const e in this.libs) {
              const n = this.libs[e].getFunctions();
              for (const r in n) {
                const a = e + "." + r;
                let l;
                t[a] ? (l = t[a], l.routineBody = n[r].routineBody) : (l = new h.GlslLibRoutineNode(a, n[r].routineBody), t[a] = l);
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
            let s = "";
            for (let i = 0; i < f.length; ++i) {
              if (!f[i].routineBody) throw new Error(`Missing body for the Glsl Library routine: ${f[i].name}`);
              s += f[i].routineBody + `
`;
            }
            return s;
          }
          selectGlslLibRoutinesToBeIncluded(c) {
            const f = [];
            return Object.keys(this.glslLibRoutineDependencyGraph).forEach((s) => {
              const i = s.split(".")[1];
              c.indexOf(i) !== -1 && f.push(this.glslLibRoutineDependencyGraph[s]);
            }), h.TopologicalSortGlslRoutines.returnOrderedNodes(f);
          }
          getUniforms(c, f) {
            const s = [];
            if (c) for (const i of c) s.push(`uniform sampler2D ${i};`);
            if (f) for (const i of f) s.push(`uniform ${i.type} ${i.name}${i.arrayLength ? `[${i.arrayLength}]` : ""};`);
            return s.join(`
`);
          }
        };
      }, 5483: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.glslRegistry = void 0;
        const h = b(5107), p = b(7341), g = b(9894), o = b(2655), c = b(3891);
        u.glslRegistry = { encoding: p.EncodingGlslLib, fragcolor: g.FragColorGlslLib, vec: c.VecGlslLib, shapeUtils: o.ShapeUtilsGlslLib, coordinates: h.CoordsGlslLib };
      }, 2655: (R, u, b) => {
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
            return this.context.programInfo.inputNames.forEach((f, s) => {
              const i = this.context.inputTextureLayouts[s].unpackedShape;
              if (i.length <= o) {
                const t = i.length, e = o - t, n = `bcastIndices_${f}`;
                let r = "";
                for (let l = 0; l < t; ++l) r += `
          realIndices[${l}] = int( mod(float(bcastedIndices[${e + l}]), ${i[l]}.0) );
          `;
                const a = `
        void ${n} (int bcastedIndices[${o}], out int realIndices[${t}]) {
          ${r}
        }
        `;
                c[n] = new h.GlslLibRoutine(a);
              }
            }), c;
          }
          bcastMatmulIndex() {
            const o = this.context.outputTextureLayout.shape.length, c = {};
            return this.context.programInfo.inputNames.forEach((f, s) => {
              const i = this.context.inputTextureLayouts[s].shape;
              if (!(i.length < 2 || i.length > o)) {
                const t = i.length, e = o - t, n = `bcastMatmulIndices_${f}`;
                let r = "";
                for (let l = 0; l < t - 2; ++l) r += `
          realIndices[${l}] = int( mod(float(bcastedIndices[${e + l}]), ${i[l]}.0) );
          `;
                const a = `
        void ${n}(int bcastedIndices[${o}], out int realIndices[${t}]) {
          ${r}
          realIndices[${t - 1}] = bcastedIndices[${o - 1}];
          realIndices[${t - 2}] = bcastedIndices[${o - 2}];
        }
        `;
                c[n] = new h.GlslLibRoutine(a);
              }
            }), c;
          }
          indicesToOffset() {
            const o = {};
            return this.context.programInfo.inputNames.forEach((c, f) => {
              const s = this.context.inputTextureLayouts[f].shape, i = this.context.inputTextureLayouts[f].strides, t = s.length;
              let e = `indicesToOffset_${c}`;
              o[e] = new h.GlslLibRoutine(p.indexToOffsetSingle(e, t, i)), e = `indicesToOffset_${c}_T`, o[e] = new h.GlslLibRoutine(p.indexToOffsetSingle(e, t, i.slice().reverse()));
            }), o;
          }
          static indexToOffsetSingle(o, c, f) {
            let s = "";
            for (let i = c - 1; i >= 0; --i) s += `
        offset += indices[${i}] * ${f[i]};
        `;
            return `
      int ${o}(int indices[${c}]) {
        int offset = 0;
        ${s}
        return offset;
      }
      `;
          }
          offsetToIndices() {
            const o = {};
            return this.context.programInfo.inputNames.forEach((c, f) => {
              const s = this.context.inputTextureLayouts[f].shape, i = this.context.inputTextureLayouts[f].strides, t = s.length;
              let e = `offsetToIndices_${c}`;
              o[e] = new h.GlslLibRoutine(p.offsetToIndicesSingle(e, t, i)), e = `offsetToIndices_${c}_T`, o[e] = new h.GlslLibRoutine(p.offsetToIndicesSingle(e, t, i.slice().reverse()));
            }), o;
          }
          static offsetToIndicesSingle(o, c, f) {
            const s = [];
            for (let i = 0; i < c - 1; ++i) s.push(`
      indices[${i}] = offset / ${f[i]};`), s.push(`
        offset -= indices[${i}] * ${f[i]};`);
            return s.push(`
      indices[${c - 1}] = offset;`), `
      void ${o}(int offset, out int indices[${c}]) {
        ${s.join("")}
      }
      `;
          }
          incrementIndices() {
            const o = {};
            return this.context.programInfo.inputNames.forEach((c, f) => {
              const s = this.context.inputTextureLayouts[f].shape, i = s.length, t = `incrementIndices_${c}`;
              let e = "";
              for (let r = 0; r < i; ++r) e += `
        shape[${r}] = ${s[r]};`;
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
      }, 5060: (R, u) => {
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
      }, 3891: (R, u, b) => {
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
            for (const s in c) {
              const i = `${s}Vec`;
              let t = "";
              for (let n = 0; n < o; ++n) t += `
          dest[${n}] ${c[s]} src[${n}];
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
            for (let s = 0; s < o; ++s) c += `
        dest[${s}] = src[${s}];
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
            for (let s = 1; s < o - 1; ++s) c += `
        else if (index == ${s})
            m[${s}] = value;
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
            for (let s = 1; s < o - 1; ++s) c += `
        else if (index == ${s})
            return m[${s}];
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
      }, 8316: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.WebGLInferenceHandler = void 0;
        const h = b(6231), p = b(9162), g = b(2517), o = b(2403), c = b(7019), f = b(8710), s = b(5611), i = b(4057), t = b(2039);
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
            for (let _ = 0; _ < e.inputNames.length; ++_) r[_] = this.getOrCreateTextureData(n[_], e.inputTypes[_]);
            const a = ((_, v) => {
              const S = v.map((I) => `${I.unpackedShape.join(",")};${I.width}x${I.height}`).join("_");
              let O = _.name;
              return _.cacheHint && (O += "[" + _.cacheHint + "]"), O += ":" + S, O;
            })(e, r);
            let l = this.session.programManager.getArtifact(a);
            const d = l ? l.programInfo : typeof e.get == "function" ? e.get() : e, m = (0, i.createTextureLayoutFromTextureType)(this.session.layoutStrategy, d.output.dims, d.output.textureType), y = this.createTextureData(m, d.output.type);
            return l || (l = this.session.programManager.build(d, r, y), this.session.programManager.setArtifact(a, l)), this.runProgram(l, r, y), y;
          }
          run(e, n) {
            return this.executeProgram(e, n).tensor;
          }
          runProgram(e, n, r) {
            for (let a = 0; a < n.length; ++a) if (!!n[a].isPacked != (e.programInfo.inputTypes[a] === t.TextureType.packed)) throw new Error(`input[${a}] property packed inconsistent`);
            if (!!r.isPacked != (e.programInfo.output.textureType === t.TextureType.packed)) throw new Error("output property packed inconsistent");
            this.session.programManager.run(e, n, r);
          }
          getOrCreateTextureData(e, n) {
            let r = this.getTextureData(e.dataId, n === t.TextureType.packed);
            if (!r && (r = this.getTextureData(e.dataId, n !== t.TextureType.packed), r)) return n === t.TextureType.packed ? this.pack(r) : this.unpack(r);
            if (!r) {
              const a = (0, i.createTextureLayoutFromTextureType)(this.session.layoutStrategy, e.dims, n);
              if (n === t.TextureType.packedLastDimension) {
                const m = e.dims;
                if (m.length === 4) {
                  const y = [m[0], Math.ceil(m[1] * m[2] * m[3] / 4)], _ = (0, i.createTextureLayoutFromTextureType)(this.session.layoutStrategy, y, n);
                  let v = e.numberData;
                  if (m[1] * m[2] * m[3] % 4 != 0) {
                    const S = m[0], O = m[1] * m[2] * m[3], I = Math.ceil(O * 1 / 4) * 4;
                    v = new Float32Array(S * I);
                    for (let w = 0; w < S; ++w) {
                      const C = w * O, V = w * I + w % 1 * O;
                      v.set(e.numberData.subarray(C, C + O), V);
                    }
                  }
                  return this.createTextureData(_, e.type, v, e, 1);
                }
              }
              if (n === t.TextureType.packed) {
                const l = (0, i.createTextureLayoutFromShape)(this.session.layoutStrategy, e.dims, 1, [], { reverseWH: !0 }), d = this.createTextureData(l, e.type, e.numberData, e, 1);
                r = this.pack(d);
              } else r = this.createTextureData(a, e.type, e.numberData, e, 1);
            }
            return r;
          }
          createTextureDataFromLayoutBindTensor(e, n, r, a) {
            return this.createTextureData(e, n, r, a, 1);
          }
          createTextureData(e, n, r, a, l) {
            h.Logger.verbose("InferenceHandler", `Creating TextureData: layout:[${JSON.stringify(e)}]`);
            const d = this.session.textureManager.createTextureFromLayout(n, e, r, l);
            return this.createTextureDataFromTexture(e, n, d, a);
          }
          reshapeUnpacked(e, n) {
            const r = this.getOrCreateTextureData(e, t.TextureType.unpacked), a = { channels: r.channels, height: r.height, width: r.width, shape: n.length !== 0 ? n : [1], strides: g.ShapeUtil.computeStrides(n), unpackedShape: n };
            return this.createTextureDataFromTexture(a, e.type, r.texture).tensor;
          }
          reshapePacked(e, n) {
            const r = this.getOrCreateTextureData(e, t.TextureType.packed);
            if ((0, c.isReshapeCheap)(e.dims, n)) {
              const y = { channels: r.channels, height: r.height, width: r.width, shape: n.length !== 0 ? n : [1], strides: g.ShapeUtil.computeStrides(n), unpackedShape: n, isPacked: !0 };
              return this.createTextureDataFromTexture(y, e.type, r.texture).tensor;
            }
            const a = (0, c.processDims3D)(e.dims), l = (0, c.processDims3D)(n), d = this.reshapePacked(e, a), m = this.run((0, c.createPackedReshape3DProgramInfoLoader)(this, d, l), [d]);
            return this.reshapePacked(m, n);
          }
          cast(e, n) {
            const r = this.getOrCreateTextureData(e, t.TextureType.unpacked);
            return this.createTextureDataFromTexture(r, n, r.texture).tensor;
          }
          createTextureDataFromTexture(e, n, r, a, l) {
            const d = Object.assign(Object.assign({}, e), { tensor: a || new p.Tensor(e.unpackedShape, n, (m) => this.readTexture(d), async (m) => this.readTextureAsync(d), void 0, l), texture: r });
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
            return this.executeProgram((0, s.createUnpackProgramInfoLoader)(this, e.tensor), [e.tensor]);
          }
        };
      }, 1640: function(R, u, b) {
        var h = this && this.__createBinding || (Object.create ? function(q, Q, Z, ee) {
          ee === void 0 && (ee = Z);
          var se = Object.getOwnPropertyDescriptor(Q, Z);
          se && !("get" in se ? !Q.__esModule : se.writable || se.configurable) || (se = { enumerable: !0, get: function() {
            return Q[Z];
          } }), Object.defineProperty(q, ee, se);
        } : function(q, Q, Z, ee) {
          ee === void 0 && (ee = Z), q[ee] = Q[Z];
        }), p = this && this.__setModuleDefault || (Object.create ? function(q, Q) {
          Object.defineProperty(q, "default", { enumerable: !0, value: Q });
        } : function(q, Q) {
          q.default = Q;
        }), g = this && this.__importStar || function(q) {
          if (q && q.__esModule) return q;
          var Q = {};
          if (q != null) for (var Z in q) Z !== "default" && Object.prototype.hasOwnProperty.call(q, Z) && h(Q, q, Z);
          return p(Q, q), Q;
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.WEBGL_OP_RESOLVE_RULES = void 0;
        const o = b(2898), c = g(b(7839)), f = b(4196), s = b(2069), i = b(8138), t = b(9663), e = b(5193), n = b(7992), r = b(1253), a = b(4776), l = b(6572), d = b(3346), m = b(5623), y = b(2870), _ = b(2143), v = b(4939), S = b(718), O = b(2268), I = b(8117), w = b(2278), C = b(5524), V = b(5975), G = b(3933), D = b(6558), A = b(5723), M = b(3738), E = g(b(4909)), F = b(8428), W = b(9793);
        u.WEBGL_OP_RESOLVE_RULES = [["Abs", "", "6+", E.abs], ["Acos", "", "7+", E.acos], ["Add", "", "7+", c.add], ["And", "", "7+", c.and], ["Asin", "", "7+", E.asin], ["Atan", "", "7+", E.atan], ["AveragePool", "", "7+", _.averagePool, _.parseAveragePoolAttributes], ["BatchNormalization", "", "7+", o.batchNormalization, o.parseBatchNormalizationAttributes], ["Cast", "", "6+", f.cast, f.parseCastAttributes], ["Ceil", "", "6+", E.ceil], ["Clip", "", "6-10", E.clip, E.parseClipAttributes], ["Clip", "", "11+", E.clipV11], ["Concat", "", "4+", s.concat, s.parseConcatAttributes], ["Conv", "", "1+", i.conv, i.parseConvAttributes], ["ConvTranspose", "", "1+", t.convTranspose, t.parseConvTransposeAttributes], ["Cos", "", "7+", E.cos], ["Div", "", "7+", c.div], ["Dropout", "", "7+", E.identity], ["DepthToSpace", "", "1+", e.depthToSpace, e.parseDepthToSpaceAttributes], ["Equal", "", "7+", c.equal], ["Elu", "", "6+", E.elu, E.parseEluAttributes], ["Exp", "", "6+", E.exp], ["Flatten", "", "1+", n.flatten, n.parseFlattenAttributes], ["Floor", "", "6+", E.floor], ["FusedConv", "com.microsoft", "1+", i.conv, i.parseConvAttributes], ["Gather", "", "1+", r.gather, r.parseGatherAttributes], ["Gemm", "", "7-10", a.gemm, a.parseGemmAttributesV7], ["Gemm", "", "11+", a.gemm, a.parseGemmAttributesV11], ["GlobalAveragePool", "", "1+", _.globalAveragePool, _.parseGlobalAveragePoolAttributes], ["GlobalMaxPool", "", "1+", _.globalMaxPool], ["Greater", "", "7+", c.greater], ["Identity", "", "1+", E.identity], ["ImageScaler", "", "1+", l.imageScaler, l.parseImageScalerAttributes], ["InstanceNormalization", "", "6+", d.instanceNormalization, d.parseInstanceNormalizationAttributes], ["LeakyRelu", "", "6+", E.leakyRelu, E.parseLeakyReluAttributes], ["Less", "", "7+", c.less], ["Log", "", "6+", E.log], ["MatMul", "", "1+", m.matMul, m.parseMatMulAttributes], ["MaxPool", "", "1+", _.maxPool, _.parseMaxPoolAttributes], ["Mul", "", "7+", c.mul], ["Neg", "", "6+", E.neg], ["Not", "", "1+", E.not], ["Or", "", "7+", c.or], ["Pad", "", "2-10", y.padV2, y.parsePadAttributesV2], ["Pad", "", "11+", y.padV11, y.parsePadAttributesV11], ["Pow", "", "7+", c.pow], ["PRelu", "", "7+", c.pRelu], ["ReduceLogSum", "", "1+", v.reduceLogSum, v.parseReduceAttributes], ["ReduceMax", "", "1+", v.reduceMax, v.parseReduceAttributes], ["ReduceMean", "", "1+", v.reduceMean, v.parseReduceAttributes], ["ReduceMin", "", "1+", v.reduceMin, v.parseReduceAttributes], ["ReduceProd", "", "1+", v.reduceProd, v.parseReduceAttributes], ["ReduceSum", "", "1-12", v.reduceSum, v.parseReduceAttributes], ["ReduceSumSquare", "", "1+", v.reduceLogSumSquare, v.parseReduceAttributes], ["Relu", "", "6+", E.relu], ["Reshape", "", "5+", S.reshape], ["Resize", "", "10", O.resize, O.parseResizeAttributesV10], ["Resize", "", "11+", O.resize, O.parseResizeAttributesV11], ["Shape", "", "1+", I.shape], ["Sigmoid", "", "6+", E.sigmoid], ["Sin", "", "7+", E.sin], ["Slice", "", "10+", w.sliceV10], ["Slice", "", "1-9", w.slice, w.parseSliceAttributes], ["Softmax", "", "1-12", C.softmax, C.parseSoftmaxAttributes], ["Softmax", "", "13+", C.softmaxV13, C.parseSoftmaxAttributesV13], ["Split", "", "2-12", V.split, V.parseSplitAttributes], ["Sqrt", "", "6+", E.sqrt], ["Squeeze", "", "1-12", G.squeeze, G.parseSqueezeAttributes], ["Squeeze", "", "13+", G.squeezeV13], ["Sub", "", "7+", c.sub], ["Sum", "", "6+", D.sum], ["Tan", "", "7+", E.tan], ["Tanh", "", "6+", E.tanh], ["Tile", "", "6+", A.tile], ["Transpose", "", "1+", M.transpose, M.parseTransposeAttributes], ["Upsample", "", "7-8", W.upsample, W.parseUpsampleAttributesV7], ["Upsample", "", "9", W.upsample, W.parseUpsampleAttributesV9], ["Unsqueeze", "", "1-12", F.unsqueeze, F.parseUnsqueezeAttributes], ["Unsqueeze", "", "13+", F.unsqueezeV13], ["Xor", "", "7+", c.xor]];
      }, 2898: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseBatchNormalizationAttributes = u.batchNormalization = void 0;
        const h = b(246), p = b(5060), g = b(2039), o = { name: "BatchNormalization", inputNames: ["A", "Scale", "B", "Mean", "Variance"], inputTypes: [g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked] };
        u.batchNormalization = (s, i, t) => (f(i), [s.run(Object.assign(Object.assign({}, o), { cacheHint: t.cacheKey, get: () => c(s, i, t) }), i)]), u.parseBatchNormalizationAttributes = (s) => {
          const i = s.attributes.getFloat("epsilon", 1e-5), t = s.attributes.getFloat("momentum", 0.9), e = s.attributes.getInt("spatial", 1);
          return (0, h.createAttributeWithCacheKey)({ epsilon: i, momentum: t, spatial: e });
        };
        const c = (s, i, t) => {
          const e = (0, p.getGlsl)(s.session.backend.glContext.version), n = i[0].dims.length, [r, a] = s.calculateTextureWidthAndHeight(i[1].dims, g.TextureType.unpacked), l = `
  float process(int[${n}] indices) {
    vec2 position = offsetToCoords(indices[1], ${r}, ${a});
    float scale = getColorAsFloat(${e.texture2D}(Scale, position));
    float mean = getColorAsFloat(${e.texture2D}(Mean, position));
    float variance = getColorAsFloat(${e.texture2D}(Variance, position));
    float b = getColorAsFloat(${e.texture2D}(B, position));

    return scale * ( (_A(indices) - mean) / sqrt(variance + float(${t.epsilon})) ) + b;
  }`;
          return Object.assign(Object.assign({}, o), { output: { dims: i[0].dims, type: i[0].type, textureType: g.TextureType.unpacked }, shaderSource: l });
        }, f = (s) => {
          if (!s || s.length !== 5) throw new Error("BatchNormalization requires 5 inputs.");
          const i = s[0], t = s[1], e = s[2], n = s[3], r = s[4];
          if (i.dims.length < 3 || t.dims.length !== 1 || e.dims.length !== 1 || n.dims.length !== 1 || r.dims.length !== 1) throw new Error("invalid input shape.");
          if (t.dims[0] !== i.dims[1] || e.dims[0] !== i.dims[1] || n.dims[0] !== i.dims[1] || r.dims[0] !== i.dims[1]) throw new Error("invalid input shape.");
          if (i.type !== "float32" && i.type !== "float64" || t.type !== "float32" && t.type !== "float64" || e.type !== "float32" && e.type !== "float64" || n.type !== "float32" && n.type !== "float64" || r.type !== "float32" && r.type !== "float64") throw new Error("invalid input tensor types.");
        };
      }, 7839: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.xor = u.sub = u.pRelu = u.pow = u.or = u.mul = u.less = u.greater = u.equal = u.div = u.and = u.add = u.glslPRelu = u.glslPow = u.glslXor = u.glslOr = u.glslAnd = u.glslLess = u.glslGreater = u.glslEqual = u.glslSub = u.glslMul = u.glslDiv = u.glslAdd = void 0;
        const h = b(2517), p = b(8520), g = b(5060), o = b(2039);
        function c() {
          const v = "add_";
          return { body: `
  float ${v}(float a, float b) {
    return a + b;
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    return v1 + v2;
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function f() {
          const v = "div_";
          return { body: `
  float ${v}(float a, float b) {
    return a / b;
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    return v1 / v2;
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function s() {
          const v = "mul_";
          return { body: `
  float ${v}(float a, float b) {
    return a * b;
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    return v1 * v2;
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function i() {
          const v = "sub_";
          return { body: `
  float ${v}(float a, float b) {
    return a - b;
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    return v1 - v2;
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function t() {
          const v = "equal_";
          return { body: `
  float ${v}(float a, float b) {
    return float(a == b);
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    return vec4(equal(v1, v2));
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function e() {
          const v = "greater_";
          return { body: `
  float ${v}(float a, float b) {
    return float(a > b);
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    return vec4( v1.r > v2.r ,
      v1.g > v2.g,
      v1.b > v2.b,
      v1.a > v2.a );
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function n() {
          const v = "less_";
          return { body: `
  float ${v}(float a, float b) {
    return float(a < b);
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    return vec4( v1.r < v2.r ,
                v1.g < v2.g,
                v1.b < v2.b,
                v1.a < v2.a );
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function r() {
          const v = "and_";
          return { body: `
  float ${v}(float a, float b) {
    return float( bool(a) && bool(b) );
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r && b2.r ,
                b1.g && b2.g,
                b1.b && b2.b,
                b1.a && b2.a );
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function a() {
          const v = "or_";
          return { body: `
  float ${v}(float a, float b) {
    return float( bool(a) || bool(b) );
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r || b2.r ,
                b1.g || b2.g,
                b1.b || b2.b,
                b1.a || b2.a );
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function l() {
          const v = "xor_";
          return { body: `
  float ${v}(float a, float b) {
    return float( bool(a) ^^ bool(b) );
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r ^^ b2.r ,
                b1.g ^^ b2.g,
                b1.b ^^ b2.b,
                b1.a ^^ b2.a );
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        function d() {
          return function(v) {
            const S = `${v}_`;
            return { body: `
  float ${S}(float a, float b) {
    return ${v}(a, b);
  }
  vec4 ${S}(vec4 v1, vec4 v2) {
    return ${v}(v1, v2);
  }
  `, name: S, type: p.FunctionType.ValueBased };
          }("pow");
        }
        function m() {
          const v = "prelu_";
          return { body: `
  float ${v}(float a, float b) {
    return a < 0.0 ? a * b: a;
  }
  vec4 ${v}(vec4 v1, vec4 v2) {
    return vec4(
      v1.r < 0.0 ? v1.r * v2.r: v1.r,
      v1.g < 0.0 ? v1.g * v2.g: v1.g,
      v1.b < 0.0 ? v1.b * v2.b: v1.b,
      v1.a < 0.0 ? v1.a * v2.a: v1.a
      );
  }
  `, name: v, type: p.FunctionType.ValueBased };
        }
        u.glslAdd = c, u.glslDiv = f, u.glslMul = s, u.glslSub = i, u.glslEqual = t, u.glslGreater = e, u.glslLess = n, u.glslAnd = r, u.glslOr = a, u.glslXor = l, u.glslPow = d, u.glslPRelu = m;
        const y = (v, S, O, I = S[0].type, w) => {
          const C = v.session.pack ? o.TextureType.packed : o.TextureType.unpacked;
          return { name: O.name, inputNames: ["A", "B"], inputTypes: [C, C], cacheHint: w, get: () => _(v, S, O, I) };
        }, _ = (v, S, O, I = S[0].type) => {
          const w = v.session.pack ? o.TextureType.packed : o.TextureType.unpacked, C = !h.ShapeUtil.areEqual(S[0].dims, S[1].dims);
          let V = S[0].dims;
          const G = v.session.pack;
          if (C) {
            const M = h.BroadcastUtil.calcShape(S[0].dims, S[1].dims, !1);
            if (!M) throw new Error("Can't perform binary op on the given tensors");
            V = M;
            const E = V.length, F = S[0].dims.length !== 0 ? S[0].dims.length : 1, W = S[1].dims.length !== 0 ? S[1].dims.length : 1, q = S[0].dims.length !== 0 ? "bcastIndices_A(indices, aindices);" : "aindices[0] = 0;", Q = S[1].dims.length !== 0 ? "bcastIndices_B(indices, bindices);" : "bindices[0] = 0;", Z = (0, g.getGlsl)(v.session.backend.glContext.version), ee = G ? `
      ${O.body}
      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();
        vec4 result = ${O.name}(a, b);
        ${Z.output} = result;
      }` : `
      ${O.body}
      float process(int indices[${E}]) {
        int aindices[${F}];
        int bindices[${W}];
        ${q}
        ${Q}
        return ${O.name}(_A(aindices), _B(bindices));
      }`;
            return { name: O.name, inputNames: ["A", "B"], inputTypes: [w, w], output: { dims: V, type: I, textureType: w }, shaderSource: ee, hasMain: G };
          }
          const D = (0, g.getGlsl)(v.session.backend.glContext.version), A = `
    ${O.body}
    void main() {
      vec4 v1 = ${D.texture2D}(A, TexCoords);
      vec4 v2 = ${D.texture2D}(B, TexCoords);
      vec4 result = ${O.name}(v1, v2);
      ${D.output} = result;
    }
    `;
          return { name: O.name, inputNames: ["A", "B"], inputTypes: [w, w], output: { dims: S[0].dims, type: I, textureType: w }, shaderSource: A, hasMain: !0 };
        };
        u.add = (v, S) => [v.run(y(v, S, c()), S)], u.and = (v, S) => [v.run(y(v, S, r(), "bool"), S)], u.div = (v, S) => [v.run(y(v, S, f()), S)], u.equal = (v, S) => [v.run(y(v, S, t(), "bool"), S)], u.greater = (v, S) => [v.run(y(v, S, e(), "bool"), S)], u.less = (v, S) => [v.run(y(v, S, n(), "bool"), S)], u.mul = (v, S) => [v.run(y(v, S, s()), S)], u.or = (v, S) => [v.run(y(v, S, a(), "bool"), S)], u.pow = (v, S) => [v.run(y(v, S, d()), S)], u.pRelu = (v, S) => [v.run(y(v, S, m()), S)], u.sub = (v, S) => [v.run(y(v, S, i()), S)], u.xor = (v, S) => [v.run(y(v, S, l(), "bool"), S)];
      }, 4196: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseCastAttributes = u.cast = void 0;
        const h = b(2517);
        u.cast = (g, o, c) => (p(o), [g.cast(o[0], c)]), u.parseCastAttributes = (g) => h.ProtoUtil.tensorDataTypeFromProto(g.attributes.getInt("to"));
        const p = (g) => {
          if (!g || g.length !== 1) throw new Error("Cast requires 1 input.");
          if (g[0].type === "string") throw new Error("Invalid input type.");
        };
      }, 1163: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createPackedConcatProgramInfoLoader = void 0;
        const h = b(5060), p = b(2039), g = b(9390), o = b(2827);
        u.createPackedConcatProgramInfoLoader = (f, s, i) => {
          const t = (e = s.length, n = i.cacheKey, { name: "Concat (packed)", inputNames: Array.from({ length: e }, (r, a) => `X${a}`), inputTypes: Array(e).fill(p.TextureType.packed), cacheHint: n });
          var e, n;
          return Object.assign(Object.assign({}, t), { get: () => ((r, a, l, d) => {
            const m = l[0].dims.slice();
            if (d >= m.length || d < -1 * m.length) throw new Error("axis specified for concat doesn't match input dimensionality");
            d < 0 && (d = m.length + d);
            const y = m.slice(0);
            for (let q = 1; q < l.length; q++) {
              const Q = l[q].dims.slice();
              for (let Z = 0; Z < m.length; Z++) if (Z === d) y[d] += Q[Z];
              else if (m[Z] !== Q[Z]) throw new Error("non concat dimensions must match");
            }
            const _ = y.length, v = (0, o.getChannels)("coords", _), S = (0, g.getCoordsDataType)(_), O = (0, o.unpackFromChannel)(), I = l.map((q) => q.dims), w = (0, g.getGlChannels)(_), C = new Array(I.length - 1);
            C[0] = I[0][d];
            for (let q = 1; q < C.length; q++) C[q] = C[q - 1] + I[q][d];
            const V = w[d], G = w.slice(-2), D = w.join();
            let A = `if (${V} < ${C[0]}) {
        return getChannel(
            getX0(${D}), vec2(${G.join()}));
        }`;
            for (let q = 1; q < C.length; q++) {
              const Q = C[q - 1];
              A += `
            if (${V} < ${C[q]}  && ${V} >= ${C[q - 1]}) {
              return getChannel(
                getX${q}(${c(w, V, Q)}),
                vec2(${c(G, V, Q)}));
            }`;
            }
            const M = C.length, E = C[C.length - 1];
            A += `
            return getChannel(
              getX${M}(${c(w, V, E)}),
              vec2(${c(G, V, E)}));`;
            const F = (0, h.getGlsl)(r.session.backend.glContext.version), W = `
          ${O}
          float getValue(${w.map((q) => "int " + q)}) {
            ${A}
          }

          void main() {
            ${S} coords = getOutputCoords();
            int lastDim = coords.${w[_ - 1]};
            coords.${w[_ - 1]} = coords.${w[_ - 2]};
            coords.${w[_ - 2]} = lastDim;

            vec4 result = vec4(getValue(${v}), 0., 0., 0.);

            ${v[_ - 1]} = ${v[_ - 1]} + 1;
            if (${v[_ - 1]} < ${y[_ - 1]}) {
              result.g = getValue(${v});
            }

            ${v[_ - 2]} = ${v[_ - 2]} + 1;
            if (${v[_ - 2]} < ${y[_ - 2]}) {
              result.a = getValue(${v});
            }

            ${v[_ - 1]} = ${v[_ - 1]} - 1;
            if (${v[_ - 2]} < ${y[_ - 2]} &&
                ${v[_ - 1]} < ${y[_ - 1]}) {
              result.b = getValue(${v});
            }
            ${F.output} = result;
          }
        `;
            return Object.assign(Object.assign({}, a), { output: { dims: y, type: l[0].type, textureType: p.TextureType.packed }, shaderSource: W, hasMain: !0 });
          })(f, t, s, i.axis) });
        };
        const c = (f, s, i) => {
          const t = f.indexOf(s);
          return f.map((e, n) => n === t ? `${e} - ${i}` : e).join();
        };
      }, 2069: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseConcatAttributes = u.concat = void 0;
        const h = b(246), p = b(2039), g = b(1163);
        u.concat = (e, n, r) => (t(n), e.session.pack && n[0].dims.length > 1 ? [e.run((0, g.createPackedConcatProgramInfoLoader)(e, n, r), n)] : [e.run(o(e, n, r), n)]);
        const o = (e, n, r) => {
          const a = (l = n.length, d = r.cacheKey, { name: "Concat", inputNames: Array.from({ length: l }, (m, y) => `X${y}`), inputTypes: Array(l).fill(p.TextureType.unpacked), cacheHint: d });
          var l, d;
          return Object.assign(Object.assign({}, a), { get: () => ((m, y, _, v) => {
            const S = _[0].dims.slice();
            if (v >= S.length || v < -1 * S.length) throw new Error("axis specified for concat doesn't match input dimensionality");
            v < 0 && (v = S.length + v);
            const O = S.slice(0);
            for (let D = 1; D < _.length; D++) {
              const A = _[D].dims.slice();
              for (let M = 0; M < S.length; M++) if (M === v) O[v] += A[M];
              else if (S[M] !== A[M]) throw new Error("non concat dimensions must match");
            }
            const I = O.length, w = new Array(_.length);
            let C = 0;
            for (let D = 0; D < w.length; ++D) C += _[D].dims[v], w[D] = C;
            let V = "";
            V = _.length < 5 ? c(w) : f(w);
            const G = `
        ${s(_.length, I)}
        ${i(w)}
        ${V}
        float process(int indices[${I}]) {
          int textureIndex = getTextureWhereDataResides (indices[${v}]);

          if(textureIndex != 0) {
            indices[${v}] = indices[${v}] - int(getSizeInConcatAxisValueFromIndex(textureIndex-int(1)));
          }

          return fetchDataFromCorrectTexture(textureIndex, indices);
        }`;
            return Object.assign(Object.assign({}, y), { output: { dims: O, type: _[0].type, textureType: p.TextureType.unpacked }, shaderSource: G });
          })(0, a, n, r.axis) });
        }, c = (e) => `int getTextureWhereDataResides(int index) {
      ${e.map((n, r) => `if(index<${n}) {return ${r};}
`).join("")}
    }`, f = (e) => c(e), s = (e, n) => {
          const r = [`float fetchDataFromCorrectTexture(int textureIndex, int indices[${n}]) {`];
          for (let a = 0; a < e; ++a) a === 0 ? r.push(`	if (textureIndex == ${a}) { return _X${a}(indices); }`) : a === e - 1 ? r.push(`	else { return _X${a}(indices); }`) : r.push(`	else if (textureIndex == ${a}) { return _X${a}(indices); }`);
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
          for (const a of e) {
            if (a.type !== n) throw new Error("input tensors should be one type");
            if (a.dims.length !== r) throw new Error("input tensors should have the same shape");
          }
        };
      }, 4770: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createUnpackedGroupedConvProgramInfoLoader = void 0;
        const h = b(6231), p = b(5060), g = b(2039), o = b(8138), c = b(2823);
        u.createUnpackedGroupedConvProgramInfoLoader = (f, s, i) => {
          const t = (e = s.length > 2, n = i.cacheKey, { name: "GroupedConv", inputNames: e ? ["X", "W", "Bias"] : ["X", "W"], inputTypes: e ? [g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked] : [g.TextureType.unpacked, g.TextureType.unpacked], cacheHint: n });
          var e, n;
          return Object.assign(Object.assign({}, t), { get: () => ((r, a, l, d) => {
            const m = a.length > 2 ? "value += getBias(output_channel);" : "", y = a[0].dims.slice(), _ = a[1].dims.slice(), v = _[0] / d.group;
            h.Logger.verbose("GroupedConv", `autpPad:${d.autoPad}, dilations:${d.dilations}, group:${d.group}, kernelShape:${d.kernelShape}, pads:${d.pads}, strides:${d.strides}`);
            const S = (0, o.calculateOutputShape)(y, _, d.dilations, d.pads, d.strides), O = (0, p.getGlsl)(r.session.backend.glContext.version), { activationFunction: I, applyActivation: w } = (0, c.getActivationSnippet)(d), C = `
  const ivec2 strides = ivec2(${d.strides[0]}, ${d.strides[1]});
  const ivec2 pads = ivec2(${d.pads[0]}, ${d.pads[1]});
  ${I}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;
    ivec2 xRCCorner = coords.zw * strides - pads;
    int group_id = output_channel / ${v};

    float value = 0.0;
    for (int wInChannel = 0; wInChannel < ${_[1]}; wInChannel++) {
      int input_channel = group_id * ${_[1]} + wInChannel;
      for (int wHeight = 0; wHeight < ${_[2]}; wHeight++) {
        int xHeight = xRCCorner.x + wHeight * ${d.dilations[0]};

        if (xHeight < 0 || xHeight >= ${y[2]}) {
          continue;
        }

        for (int wWidth = 0; wWidth < ${_[3]}; wWidth++) {
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
    ${w}
    ${O.output} = vec4(value, .0, .0, .0);
  }
`;
            return Object.assign(Object.assign({}, l), { output: { dims: S, type: a[0].type, textureType: g.TextureType.unpacked }, shaderSource: C, hasMain: !0 });
          })(f, s, t, i) });
        };
      }, 1386: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.conv2DPacked = u.conv2DPackedPointwise = void 0;
        const h = b(8138), p = b(8555), g = b(708);
        u.conv2DPackedPointwise = (o, c, f) => {
          const s = c[0].dims, i = c[1].dims, t = (0, h.calculateOutputShape)(s, i, f.dilations, f.pads, f.strides), e = o.reshapePacked(c[0], [s[1], s[2] * s[3]]), n = o.reshapePacked(c[1], [i[0], i[1]]), r = c.length > 2 ? [n, e, c[2]] : [n, e], a = o.run((0, g.createPackedMatmulProgramInfoLoader)(o, r, f), r);
          return o.reshapePacked(a, t);
        }, u.conv2DPacked = (o, c, f) => {
          const s = c[0].dims, i = c[1].dims, t = (0, h.calculateOutputShape)(s, i, f.dilations, f.pads, f.strides), e = o.run((0, p.createPackedIm2ColProgramInfoLoader)(o, c[0], c[1], t, f), [c[0]]), n = o.reshapePacked(c[1], [i[0], i[1] * i[2] * i[3]]), r = c.length === 3 ? [n, e, c[2]] : [n, e], a = o.run((0, g.createPackedMatmulProgramInfoLoader)(o, r, f), r);
          return o.reshapePacked(a, t);
        };
      }, 9663: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseConvTransposeAttributes = u.convTranspose = void 0;
        const h = b(246), p = b(5060), g = b(2039), o = b(2823), c = (n, r, a, l, d, m) => (n - 1) * r + a + (l - 1) * d + 1 - m, f = (n, r, a, l, d) => {
          const m = Math.floor(n / 2);
          r === "SAME_UPPER" ? (a[l] = m, a[d] = n - m) : r === "SAME_LOWER" && (a[l] = n - m, a[d] = m);
        };
        u.convTranspose = (n, r, a) => (e(r, a), s(n, r, a));
        const s = (n, r, a) => {
          const l = t(a, r);
          return [i(n, r, l)];
        }, i = (n, r, a) => n.run(((l, d, m) => {
          const y = (_ = d.length > 2, v = m.cacheKey, { name: "ConvTranspose", inputNames: _ ? ["X", "W", "B"] : ["X", "W"], inputTypes: _ ? [g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked] : [g.TextureType.unpacked, g.TextureType.unpacked], cacheHint: v });
          var _, v;
          return Object.assign(Object.assign({}, y), { get: () => ((S, O, I, w) => {
            const C = O.length > 2 ? "getB(output_channel)" : "0.0", V = O[0].dims, G = O[1].dims, D = G[1], A = G[0] / w.group, M = [O[0].dims[0], O[1].dims[1] * w.group, ...w.outputShape], E = (0, p.getGlsl)(S.session.backend.glContext.version), { activationFunction: F, applyActivation: W } = (0, o.getActivationSnippet)(w), q = `
  const ivec2 strides = ivec2(${w.strides[0]}, ${w.strides[1]});
  const ivec2 pads = ivec2(${w.pads[0]}, ${w.pads[1]});
  ${F}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;

    ivec2 loc = coords.zw + pads;

    int group_id = output_channel / ${D};
    int wOutChannel = output_channel - group_id * ${D};

    float value = ${C};
    for (int inChannelOffset = 0; inChannelOffset < ${A}; inChannelOffset++) {
      int input_channel = group_id * ${A} + inChannelOffset;
      for (int wWOff = 0; wWOff < ${G[2]}; wWOff++) {
        for (int wHOff = 0; wHOff < ${G[3]}; wHOff++) {
          ivec2 wOff = ivec2(wWOff * ${w.dilations[0]}, wHOff * ${w.dilations[1]});
          ivec2 wLoc = loc - wOff;
          ivec2 wLocIn = wLoc / strides;
          if (
            wLocIn * strides == wLoc &&
            wLocIn.x >= 0 && wLocIn.x < ${V[2]} &&
            wLocIn.y >= 0 && wLocIn.y < ${V[3]}
          ) {
            float xVal = getX(batch, input_channel, wLocIn.y, wLocIn.x);
            float wVal = getW(input_channel, wOutChannel, wHOff, wWOff);
            value += xVal * wVal;
          }
        }
      }
    }
    ${W}
    ${E.output} = vec4(value, .0, .0, .0);
  }
`;
            return Object.assign(Object.assign({}, I), { output: { dims: M, type: O[0].type, textureType: g.TextureType.unpacked }, shaderSource: q, hasMain: !0 });
          })(l, d, y, m) });
        })(n, r, a), r), t = (n, r) => {
          const a = n.kernelShape.slice();
          if (n.kernelShape.length === 0) for (let y = 2; y < r[1].dims.length; ++y) a.push(r[1].dims[y]);
          const l = n.pads.slice(), d = n.outputShape.slice();
          ((y, _, v, S, O, I, w, C) => {
            const V = y.length - 2, G = C.length === 0;
            for (let D = 0; D < V; ++D) {
              const A = G ? y[D + 2] * I[D] : C[D], M = c(y[D + 2], I[D], O[D], _[D], v[D], A);
              f(M, S, O, D, D + V), G && C.push(I[D] * (y[D + 2] - 1) + w[D] + (_[D] - 1) * v[D] + 1 - O[D] - O[D + V]);
            }
          })(r[0].dims, a, n.dilations, n.autoPad, l, n.strides, n.outputPadding, d);
          const m = Object.assign({}, n);
          return Object.assign(m, { kernelShape: a, pads: l, outputShape: d, cacheKey: n.cacheKey }), m;
        };
        u.parseConvTransposeAttributes = (n) => {
          const r = n.attributes, a = (0, o.parseInternalActivationAttributes)(r), l = r.getString("auto_pad", "NOTSET"), d = r.getInts("dilations", [1, 1]), m = r.getInt("group", 1), y = r.getInts("kernel_shape", []), _ = r.getInts("output_padding", [0, 0]), v = r.getInts("output_shape", []), S = r.getInts("pads", [0, 0, 0, 0]), O = r.getInts("strides", [1, 1]);
          return (0, h.createAttributeWithCacheKey)(Object.assign({ autoPad: l, dilations: d, group: m, kernelShape: y, outputPadding: _, outputShape: v, pads: S, strides: O }, a));
        };
        const e = (n, r) => {
          if (!n || n.length !== 2 && n.length !== 3) throw new Error("Conv requires 2 or 3 inputs");
          if (n[0].dims.length !== 4 || n[1].dims.length !== 4) throw new Error("currently only support 2-dimensional conv");
          if (n[0].dims[1] !== n[1].dims[0]) throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");
          const a = n[1].dims[1] * r.group;
          if (n.length === 3 && (n[2].dims.length !== 1 || n[2].dims[0] !== a)) throw new Error("invalid bias");
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
      }, 8138: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseConvAttributes = u.conv = u.calculateOutputShape = void 0;
        const h = b(246), p = b(2517), g = b(4770), o = b(1386), c = b(9828), f = b(2823), s = b(3248), i = b(5623);
        u.calculateOutputShape = (l, d, m, y, _) => {
          const v = l[0], S = l.slice(2), O = S.length, I = d[0], w = d.slice(2).map((V, G) => V + (V - 1) * (m[G] - 1)), C = S.map((V, G) => V + y[G] + y[G + O]).map((V, G) => Math.floor((V - w[G] + _[G]) / _[G]));
          return [v, I].concat(...C);
        }, u.conv = (l, d, m) => (a(d, m), t(l, d, m));
        const t = (l, d, m) => {
          const y = r(m, d), _ = l.session.pack, v = y.kernelShape[0] === 1 && y.kernelShape[1] === 1;
          return y.group > 1 ? [l.run((0, g.createUnpackedGroupedConvProgramInfoLoader)(l, d, y), d)] : v && _ ? [e(l, d, y)] : _ && d[0].dims.length === 4 && d[0].dims[0] === 1 && !v ? [(0, o.conv2DPacked)(l, d, y)] : [n(l, d, y)];
        }, e = (l, d, m) => {
          const y = d[0].dims, _ = d[1].dims, v = (0, u.calculateOutputShape)(y, _, m.dilations, m.pads, m.strides), S = l.reshapeUnpacked(d[0], [y[1], y[2] * y[3]]), O = l.reshapeUnpacked(d[1], [_[0], _[1]]), I = d.length > 2 ? [O, S, d[2]] : [O, S], w = l.run((0, i.createMatmulProgramInfoLoader)(I, m), I);
          return l.reshapeUnpacked(w, v);
        }, n = (l, d, m) => {
          const y = d[0].dims, _ = d[1].dims, v = (0, u.calculateOutputShape)(y, _, m.dilations, m.pads, m.strides), S = l.run((0, s.createIm2ColProgramInfoLoader)(l, d[0], d[1], v, m), [d[0]]), O = d.length === 3 ? [S, d[1], d[2]] : [S, d[1]];
          return l.run((0, c.createDotProductProgramInfoLoader)(l, d, v, m), O);
        }, r = (l, d) => {
          const m = l.kernelShape.slice();
          if (l.kernelShape.length === 0) for (let v = 2; v < d[1].dims.length; ++v) m.push(d[1].dims[v]);
          const y = l.pads.slice();
          p.PoolConvUtil.adjustPadsBasedOnAutoPad(d[0].dims, l.strides, l.dilations, m, y, l.autoPad);
          const _ = Object.assign({}, l);
          return Object.assign(_, { kernelShape: m, pads: y, cacheKey: l.cacheKey }), _;
        };
        u.parseConvAttributes = (l) => {
          const d = l.attributes, m = (0, f.parseInternalActivationAttributes)(d), y = d.getString("auto_pad", "NOTSET"), _ = d.getInts("dilations", [1, 1]), v = d.getInt("group", 1), S = d.getInts("kernel_shape", []), O = d.getInts("pads", [0, 0, 0, 0]), I = d.getInts("strides", [1, 1]);
          return (0, h.createAttributeWithCacheKey)(Object.assign({ autoPad: y, dilations: _, group: v, kernelShape: S, pads: O, strides: I }, m));
        };
        const a = (l, d) => {
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
      }, 5193: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseDepthToSpaceAttributes = u.depthToSpace = void 0;
        const h = b(3738);
        u.depthToSpace = (g, o, c) => {
          p(o);
          const f = c.blocksize, s = f * f, i = c.mode === "DCR" ? [0, 3, 4, 1, 5, 2] : [0, 1, 4, 2, 5, 3], t = c.mode === "DCR" ? [o[0].dims[0], f, f, o[0].dims[1] / s, o[0].dims[2], o[0].dims[3]] : [o[0].dims[0], o[0].dims[1] / s, f, f, o[0].dims[2], o[0].dims[3]], e = g.reshapeUnpacked(o[0], t), n = { perm: i, cacheKey: `${i}` }, [r] = (0, h.transpose)(g, [e], n), a = [o[0].dims[0], o[0].dims[1] / s, o[0].dims[2] * f, o[0].dims[3] * f];
          return [g.reshapeUnpacked(r, a)];
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
      }, 9828: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createDotProductProgramInfoLoader = void 0;
        const h = b(2517), p = b(5060), g = b(2039), o = b(2823), c = b(3248);
        u.createDotProductProgramInfoLoader = (f, s, i, t) => {
          const e = ((n, r) => ({ name: "ConvDotProduct", inputNames: n ? ["Im2Col", "K", "B"] : ["Im2Col", "K"], inputTypes: n ? [g.TextureType.unpacked, g.TextureType.packedLastDimension, g.TextureType.unpacked] : [g.TextureType.unpacked, g.TextureType.packedLastDimension], cacheKey: r.activationCacheKey }))(s.length > 2, t);
          return Object.assign(Object.assign({}, e), { get: () => ((n, r, a, l, d) => {
            const m = a[0].dims, y = a[1].dims, _ = [y[0], Math.ceil(m[1] * y[2] * y[3] / 4)], v = (0, c.calculateIm2ColDims)(m, y, l), [S, O] = n.calculateTextureWidthAndHeight(_, g.TextureType.packedLastDimension), I = h.ShapeUtil.computeStrides(v), [w, C] = n.calculateTextureWidthAndHeight(v, g.TextureType.packedLastDimension), V = l.length, G = a.length < 3 ? "0.0" : "_B(b)", D = Math.ceil(m[1] * y[2] * y[3] / 4), { activationFunction: A, applyActivation: M } = (0, o.getActivationSnippet)(d), E = (0, p.getGlsl)(n.session.backend.glContext.version), F = `
${A}
float process(int indices[${V}]) {
  int b[1];
  b[0] = indices[1];
  int im2col[4];
  im2col[0] = indices[0];
  im2col[1] = indices[2];
  im2col[2] = indices[3];
  int im2colOffset = im2col[0] * ${I[0]} + im2col[1] * ${I[1]} + im2col[2] * ${I[2]};
  int kernelOffset = indices[1] * ${_[1]};
  float value = ${G};
  for (int i = 0; i < ${D}; ++i) {
    vec2 im2colCoords = offsetToCoords(im2colOffset, ${w}, ${C});
    vec2 kernelCoords = offsetToCoords(kernelOffset, ${S}, ${O});
    value += dot(${E.texture2D}(Im2Col, im2colCoords), ${E.texture2D}(K, kernelCoords));
    ++im2colOffset;
    ++kernelOffset;
  }
  ${M}
  return value;
}`;
            return Object.assign(Object.assign({}, r), { output: { dims: l, type: a[0].type, textureType: g.TextureType.unpacked }, shaderSource: F });
          })(f, e, s, i, t) });
        };
      }, 7992: (R, u, b) => {
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
      }, 2823: (R, u, b) => {
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
      }, 1253: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseGatherAttributes = u.gather = void 0;
        const h = b(246), p = b(782), g = b(2517), o = b(2039);
        u.gather = (i, t, e) => (s(t, e.axis), [i.run(f(i, t, e), t)]), u.parseGatherAttributes = (i) => (0, h.createAttributeWithCacheKey)({ axis: i.attributes.getInt("axis", 0) });
        const c = { name: "Gather", inputNames: ["A", "B"], inputTypes: [o.TextureType.unpacked, o.TextureType.unpacked] }, f = (i, t, e) => {
          const n = Object.assign(Object.assign({}, c), { cacheHint: e.cacheKey });
          return Object.assign(Object.assign({}, n), { get: () => ((r, a, l, d) => {
            const m = l[0].dims.slice(), y = l[1].dims.slice(), _ = new Array(m.length + y.length - 1);
            d = g.ShapeUtil.normalizeAxis(d, m.length);
            const v = [];
            for (let O = 0; O < _.length; O++) O < d ? (_[O] = m[O], v.push(`inputIdx[${O}] = outputIdx[${O}];`)) : O < d + y.length ? (_[O] = y[O - d], v.push(`indexDataIdx[${O - d}] = outputIdx[${O}];`)) : (_[O] = m[O - y.length + 1], v.push(`inputIdx[${O - y.length + 1}] = outputIdx[${O}];`));
            const S = `
      float process(int outputIdx[${_.length || 1}]) {
        int inputIdx[${m.length}];
        int indexDataIdx[${y.length || 1}];
        indexDataIdx[0] = 0;
        ${v.join(`
        `)}
        int idx = int(_B(indexDataIdx));
        inputIdx[${d}] = idx < 0 ? idx + ${m[d]} : idx;
        return _A(inputIdx);
      }`;
            return Object.assign(Object.assign({}, a), { output: { dims: _, type: l[0].type, textureType: o.TextureType.unpacked }, shaderSource: S });
          })(0, n, t, e.axis) });
        }, s = (i, t) => {
          if (!i || i.length !== 2) throw new Error("Gather requires 2 inputs.");
          const e = i[0].dims.length;
          if (e < 1) throw new Error("Invalid input shape.");
          if (t < -e || t > e - 1) throw new Error("Invalid axis.");
          if (p.NUMBER_TYPES.indexOf(i[0].type) === -1) throw new Error("Invaid input type.");
          if (i[1].type !== "int32" && i[1].type !== "int16") throw new Error("Invaid input type.");
        };
      }, 4776: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseGemmAttributesV11 = u.parseGemmAttributesV7 = u.gemm = void 0;
        const h = b(246), p = b(2517), g = b(2039);
        u.gemm = (i, t, e) => (s(t, e), [i.run(c(t, e), t)]);
        const o = (i, t) => {
          const e = i.attributes.getInt("transA", 0) !== 0, n = i.attributes.getInt("transB", 0) !== 0, r = i.attributes.getFloat("alpha", 1), a = i.attributes.getFloat("beta", 1);
          return (0, h.createAttributeWithCacheKey)({ transA: e, transB: n, alpha: r, beta: a, isOptionalC: t });
        };
        u.parseGemmAttributesV7 = (i) => o(i, !1), u.parseGemmAttributesV11 = (i) => o(i, !0);
        const c = (i, t) => {
          const e = { name: "Gemm", inputNames: i.length === 3 ? ["A", "B", "C"] : ["A", "B"], inputTypes: i.length === 3 ? [g.TextureType.unpacked, g.TextureType.unpacked, g.TextureType.unpacked] : [g.TextureType.unpacked, g.TextureType.unpacked], key: t.cacheKey };
          return Object.assign(Object.assign({}, e), { get: () => f(e, i, t) });
        }, f = (i, t, e) => {
          const n = t[0].dims.slice(), r = t[1].dims.slice(), [a, l] = p.GemmUtil.getShapeOfGemmResult(n, e.transA, r, e.transB, t.length === 3 ? t[2].dims : void 0), d = [a, l];
          if (!d) throw new Error("Can't use gemm on the given tensors");
          let m = n[n.length - 1], y = "";
          e.transA && (m = n[0]), e.transA && e.transB ? y = "value += _A_T(a) * _B_T(b);" : e.transA && !e.transB ? y = "value += _A_T(a) * _B(b);" : !e.transA && e.transB ? y = "value += _A(a) * _B_T(b);" : e.transA || e.transB || (y = "value += _A(a) * _B(b);");
          const _ = d.length, v = `
      float process(int indices[${_}]) {
          int a[${_}];
          int b[${_}];
          ${t.length === 3 ? `int c[${t[2].dims.length}];` : ""}

          copyVec(indices, a);
          copyVec(indices, b);
          ${t.length === 3 ? "bcastIndices_C(indices, c);" : ""}

          float value = 0.0;
          for (int k=0; k<${m}; ++k) {
              a[${_ - 1}] = k;
              b[${_ - 2}] = k;
              ${y}
          }

          value = value * alpha;
          ${t.length === 3 ? "value += beta * _C(c);" : ""}
          return value;
      }`;
          return Object.assign(Object.assign({}, i), { output: { dims: d, type: t[0].type, textureType: g.TextureType.unpacked }, variables: [{ name: "alpha", type: "float", data: e.alpha }, { name: "beta", type: "float", data: e.beta }], shaderSource: v });
        }, s = (i, t) => {
          if (!i) throw new Error("Input is missing");
          if (t.isOptionalC && (i.length < 2 || i.length > 3)) throw new Error("Invaid input shape.");
          if (!t.isOptionalC && i.length !== 3) throw new Error("Gemm requires 3 inputs");
          if (i.length === 3 && i[2].dims.length !== 1 && i[2].dims.length !== 2) throw new Error("Invalid input shape of C");
          if (i[0].type !== "float32" && i[0].type !== "float64" || i[1].type !== "float32" && i[1].type !== "float64" || i.length === 3 && i[2].type !== "float32" && i[2].type !== "float64") throw new Error("Invalid input type.");
          if (i[0].type !== i[1].type || i.length === 3 && i[0].type !== i[2].type) throw new Error("Input types are mismatched");
        };
      }, 8555: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createPackedIm2ColProgramInfoLoader = void 0;
        const h = b(5060), p = b(2039), g = b(2827);
        u.createPackedIm2ColProgramInfoLoader = (o, c, f, s, i) => {
          const t = (e = i.cacheKey, { name: "Im2Col (packed)", inputNames: ["A"], inputTypes: [p.TextureType.packed], cacheHint: e });
          var e;
          return Object.assign(Object.assign({}, t), { get: () => ((n, r, a, l, d, m) => {
            const y = a.dims, _ = l.dims, v = d.length, S = [_[1] * _[2] * _[3], d[2] * d[3]], O = _[2] * _[3], I = (0, g.unpackFromChannel)(), w = (0, h.getGlsl)(n.session.backend.glContext.version);
            let C = "";
            for (let G = 0; G <= 1; G++) for (let D = 0; D <= 1; D++) C += `
            blockIndex = rc.x + ${D};
            pos = rc.y + ${G};

            if(blockIndex < ${S[1]} && pos < ${S[0]}) {
              offsetY = int(blockIndex / (${d[v - 1]})) * ${m.strides[0]} -
                ${m.pads[0]};
              d0 = offsetY + ${m.dilations[0]} * (imod(pos, ${O}) / ${_[2]});

              if(d0 < ${y[2]} && d0 >= 0) {
                offsetX = imod(blockIndex, ${d[v - 1]}) * ${m.strides[1]} -
                  ${m.pads[1]};
                d1 = offsetX + ${m.dilations[1]} * imod(imod(pos, ${O}), ${_[2]});

                if(d1 < ${y[3]} && d1 >= 0) {

                  ch = int(float(pos)/ ${O}.);
                    innerDims = vec2(d0, d1);
                    result[${2 * G + D}] = getChannel(
                      getA(0, ch, int(innerDims.x),
                      int(innerDims.y)), innerDims);
                }
              }
            }

          `;
            const V = `
      ${I}

      void main() {
        ivec2 rc = getOutputCoords();
          vec4 result = vec4(0.0);
          int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
          vec2 innerDims;
          ${C}
          ${w.output} = result;
      }
            `;
            return Object.assign(Object.assign({}, r), { output: { dims: S, type: a.type, textureType: p.TextureType.packed }, shaderSource: V, hasMain: !0 });
          })(o, t, c, f, s, i) });
        };
      }, 3248: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.calculateIm2ColDims = u.createIm2ColProgramInfoLoader = void 0;
        const h = b(2039);
        u.createIm2ColProgramInfoLoader = (p, g, o, c, f) => {
          const s = (i = f.cacheKey, { name: "Im2Col", inputNames: ["X"], inputTypes: [h.TextureType.unpacked], cacheHint: i });
          var i;
          return Object.assign(Object.assign({}, s), { get: () => ((t, e, n, r, a, l) => {
            const d = n.dims, m = r.dims, y = a.length, _ = (0, u.calculateIm2ColDims)(d, m, a, 4), v = `
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
            return Object.assign(Object.assign({}, e), { output: { dims: _, type: n.type, textureType: h.TextureType.packedLastDimension }, shaderSource: v });
          })(0, s, g, o, c, f) });
        }, u.calculateIm2ColDims = (p, g, o, c = 4) => [o[0], o[2], o[3], Math.ceil(p[1] * g[2] * g[3] / c)];
      }, 6572: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseImageScalerAttributes = u.imageScaler = void 0;
        const h = b(246), p = b(2039);
        u.imageScaler = (s, i, t) => (f(i), [s.run(o(s, i, t), i)]), u.parseImageScalerAttributes = (s) => {
          const i = s.attributes.getFloat("scale"), t = s.attributes.getFloats("bias");
          return (0, h.createAttributeWithCacheKey)({ scale: i, bias: t });
        };
        const g = { name: "ImageScaler", inputNames: ["X"], inputTypes: [p.TextureType.unpacked] }, o = (s, i, t) => {
          const e = Object.assign(Object.assign({}, g), { cacheHint: t.cacheKey });
          return Object.assign(Object.assign({}, e), { get: () => ((n, r, a, l) => {
            const d = a[0].dims.slice(), m = d.length, y = `
      ${c(l.bias.length)}
      float process(int indices[${m}]) {
        return _X(indices) * scale + getBias(bias, indices[1]);
      }`;
            return Object.assign(Object.assign({}, r), { output: { dims: d, type: a[0].type, textureType: p.TextureType.unpacked }, variables: [{ name: "bias", type: "float", arrayLength: l.bias.length, data: l.bias }, { name: "scale", type: "float", data: l.scale }], shaderSource: y });
          })(0, e, i, t) });
        }, c = (s) => {
          const i = [`float getBias(float bias[${s}], int channel) {`];
          for (let t = 0; t < s; ++t) t === 0 ? i.push(`	if (channel == ${t}) { return bias[${t}]; }`) : t === s - 1 ? i.push(`	else { return bias[${t}]; }`) : i.push(`	else if (channel == ${t}) { return bias[${t}]; }`);
          return i.push("	}"), i.join(`
`);
        }, f = (s) => {
          if (!s || s.length !== 1) throw new Error("ImageScaler requires 1 input.");
          if (s[0].dims.length !== 4) throw new Error("Invalid input shape.");
          if (s[0].type !== "float32" && s[0].type !== "float64") throw new Error("Invalid input type.");
        };
      }, 3346: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseInstanceNormalizationAttributes = u.instanceNormalization = void 0;
        const h = b(5060), p = b(2039);
        u.instanceNormalization = (i, t, e) => {
          s(t);
          const n = i.run(o(t[0]), t);
          return [i.run(f(i, t[0], e, n.dims), [t[0], n, t[1], t[2]])];
        }, u.parseInstanceNormalizationAttributes = (i) => i.attributes.getFloat("epsilon", 1e-5);
        const g = { name: "InstanceNormalization_MeanAndVariance", inputNames: ["X"], inputTypes: [p.TextureType.unpacked] }, o = (i) => Object.assign(Object.assign({}, g), { get: () => ((t, e) => {
          const n = e.dims.slice(), r = n[1], a = n[2] * n[3], l = [n[0], r], d = `
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
        float mean = temp / float(${a});
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
        v.g = temp / float(${a});

        return v;
      }`;
          return Object.assign(Object.assign({}, t), { output: { dims: l, type: e.type, textureType: p.TextureType.packedLastDimension }, shaderSource: d });
        })(g, i) }), c = { name: "InstanceNormalization_ComputeOutput", inputNames: ["X", "MeanAndVariance", "Scale", "B"], inputTypes: [p.TextureType.unpacked, p.TextureType.packedLastDimension, p.TextureType.unpacked, p.TextureType.unpacked] }, f = (i, t, e, n) => {
          const r = Object.assign(Object.assign({}, c), { cacheHint: `${e}` });
          return Object.assign(Object.assign({}, r), { get: () => ((a, l, d, m, y) => {
            const _ = (0, h.getGlsl)(a.session.backend.glContext.version), [v, S] = a.calculateTextureWidthAndHeight(y, p.TextureType.packedLastDimension), [O, I] = [v / 4, S], w = `
      vec4 get_MeanAndVariance(int[2] mv) {
        int offset = indicesToOffset_MeanAndVariance(mv);
        vec2 coords = offsetToCoords(offset, ${O}, ${I});
        return ${_.texture2D}(MeanAndVariance, coords);
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
            return Object.assign(Object.assign({}, l), { output: { dims: d.dims, type: d.type, textureType: p.TextureType.unpacked }, variables: [{ name: "epsilon", type: "float", data: m }], shaderSource: w });
          })(i, r, t, e, n) });
        }, s = (i) => {
          if (!i || i.length !== 3) throw new Error("InstanceNormalization requires 3 inputs.");
          const t = i[0], e = i[1], n = i[2];
          if (t.dims.length < 3 || e.dims.length !== 1 || n.dims.length !== 1) throw new Error("Invalid input shape.");
          if (e.dims[0] !== t.dims[1] || n.dims[0] !== t.dims[1]) throw new Error("Input shapes are mismatched.");
          if (t.type !== "float32" && t.type !== "float64" || e.type !== "float32" && e.type !== "float64" || n.type !== "float32" && n.type !== "float64") throw new Error("Invalid input type.");
          if (i[0].dims.length !== 4) throw new Error("Only support 4-D input shape.");
        };
      }, 708: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createPackedMatmulProgramInfoLoader = void 0;
        const h = b(2517), p = b(5060), g = b(2039), o = b(9390), c = b(2823), f = b(5623);
        u.createPackedMatmulProgramInfoLoader = (s, i, t) => {
          const e = (n = i.length > 2, r = t.activationCacheKey, { name: "MatMul (packed)", inputNames: n ? ["A", "B", "Bias"] : ["A", "B"], inputTypes: n ? [g.TextureType.packed, g.TextureType.packed, g.TextureType.packed] : [g.TextureType.packed, g.TextureType.packed], cacheHint: r });
          var n, r;
          return Object.assign(Object.assign({}, e), { get: () => ((a, l, d, m) => {
            const y = d.length > 2, _ = y ? "value += getBiasForMatmul();" : "", v = d[0].dims, S = d[1].dims, O = h.BroadcastUtil.calcShape(v, S, !0), I = !h.ShapeUtil.areEqual(d[0].dims, d[1].dims);
            if (!O) throw new Error("Can't use matmul on the given tensors");
            const w = v[v.length - 1], C = Math.ceil(w / 2), V = v.length, G = S.length, D = (0, p.getGlsl)(a.session.backend.glContext.version), A = (0, o.getCoordsDataType)(O.length), M = O.length, E = (0, o.getGlChannels)(), { activationFunction: F, applyActivation: W } = (0, c.getActivationSnippet)(m), q = y ? `${(0, f.getBiasForMatmul)(A, E, d[2].dims, O, !0)}` : "", Q = I ? `${function(me, ie, _e, be) {
              let Ce = [], ze = [];
              const he = _e[0].dims, Ee = _e[1].dims, Ie = he.length, De = Ee.length, ke = be.length, He = ke - Ie, Je = ke - De;
              Ce = he.map((te, oe) => `coords.${ie[oe + He]}`), Ce[Ie - 1] = "i*2", Ce.join(", "), ze = Ee.map((te, oe) => `coords.${ie[oe + Je]}`), ze[De - 2] = "i*2", ze.join(", ");
              const Xe = h.BroadcastUtil.getBroadcastDims(he, be), tt = h.BroadcastUtil.getBroadcastDims(Ee, be), nt = Xe.map((te) => `coords.${ie[te + He]} = 0;`).join(`
`), Ke = tt.map((te) => `coords.${ie[te + Je]} = 0;`).join(`
`), L = `int lastDim = coords.${ie[ke - 1]};
  coords.${ie[ke - 1]} = coords.${ie[ke - 2]};
  coords.${ie[ke - 2]} = lastDim;`;
              return `
vec4 getAAtOutCoordsMatmul(int i) {
  ${me} coords = getOutputCoords();
  ${L}
  ${nt}
  vec4 outputValue = getA(${Ce});
  return outputValue;
}

vec4 getBAtOutCoordsMatmul(int i) {
  ${me} coords = getOutputCoords();
  ${L}
  ${Ke}
  vec4 outputValue = getB(${ze});
  return outputValue;
}`;
            }(A, E, d, O)}` : "", Z = I ? "getAAtOutCoordsMatmul(i)" : `getA(${function(me, ie) {
              let _e = "";
              for (let be = 0; be < ie - 2; be++) _e += `rc.${me[be]}, `;
              return _e += `rc.${me[ie - 2]}, i*2`, _e;
            }(E, V)})`, ee = I ? "getBAtOutCoordsMatmul(i)" : `getB(${function(me, ie) {
              let _e = "";
              for (let be = 0; be < ie - 2; be++) _e += `rc.${me[be]}, `;
              return _e += `i*2, rc.${me[ie - 1]}`, _e;
            }(E, G)})`, se = `
            ${Q}
            ${q}
            ${F}
            void main() {
              ${I ? "" : `${A} rc =
          getOutputCoords(); int lastDim = rc.${E[M - 1]}; rc.${E[M - 1]} =
          rc.${E[M - 2]}; rc.${E[M - 2]} = lastDim;
      `}

              vec4 value = vec4(0);
              for (int i = 0; i < ${C}; i++) {
                vec4 a = ${Z};
                vec4 b = ${ee};

                value += (a.rrbb * b.rgrg);
                value += (a.ggaa * b.baba);
              }
              ${_}
              ${W}
              ${D.output} = value;
            }`;
            return Object.assign(Object.assign({}, l), { output: { dims: O, type: d[0].type, textureType: g.TextureType.packed }, shaderSource: se, hasMain: !0 });
          })(s, e, i, t) });
        };
      }, 5623: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.getBiasForMatmul = u.createMatmulProgramInfoLoader = u.parseMatMulAttributes = u.matMul = void 0;
        const h = b(2517), p = b(2039), g = b(9390), o = b(2823), c = b(708);
        function f(t, e) {
          const n = (r = t.length > 2, a = e.activationCacheKey, { name: "MatMul", inputNames: r ? ["A", "B", "Bias"] : ["A", "B"], inputTypes: r ? [p.TextureType.unpacked, p.TextureType.unpacked, p.TextureType.unpacked] : [p.TextureType.unpacked, p.TextureType.unpacked], cacheHint: a });
          var r, a;
          return Object.assign(Object.assign({}, n), { get: () => function(l, d, m) {
            const y = d[0].dims, _ = d[1].dims, v = h.BroadcastUtil.calcShape(y, _, !0);
            if (!v) throw new Error("Can't use matmul on the given tensors");
            const S = (0, g.getCoordsDataType)(v.length), O = (0, g.getGlChannels)(), { activationFunction: I, applyActivation: w } = (0, o.getActivationSnippet)(m), C = d.length > 2, V = C ? "value += getBiasForMatmul();" : "", G = C ? `${i(S, O, d[2].dims, v, !1)}` : "", D = v.length, A = y.length, M = _.length, E = `
    ${I}
    ${G}
    float process(int indices[${D}]) {
        int a[${A}];
        int b[${M}];
        bcastMatmulIndices_A(indices, a);
        bcastMatmulIndices_B(indices, b);

        float value;
        for (int k=0; k<${y[y.length - 1]}; ++k) {
            a[${A - 1}] = k;
            b[${M - 2}] = k;
            value += _A(a) * _B(b);
        }
        ${V}
        ${w}
        return value;
    }`;
            return Object.assign(Object.assign({}, l), { output: { dims: v, type: d[0].type, textureType: p.TextureType.unpacked }, shaderSource: E });
          }(n, t, e) });
        }
        u.matMul = (t, e, n) => (s(e), t.session.pack ? [t.run((0, c.createPackedMatmulProgramInfoLoader)(t, e, n), e)] : [t.run(f(e, n), e)]), u.parseMatMulAttributes = (t) => (0, o.parseInternalActivationAttributes)(t.attributes), u.createMatmulProgramInfoLoader = f;
        const s = (t) => {
          if (!t || t.length !== 2) throw new Error("MatMul requires 2 inputs.");
          if (t[0].dims[t[0].dims.length - 1] !== t[1].dims[t[1].dims.length - 2]) throw new Error("shared dimension does not match.");
          if (t[0].type !== "float32" && t[0].type !== "float64" || t[1].type !== "float32" && t[1].type !== "float64") throw new Error("inputs should be float type");
          if (t[0].type !== t[1].type) throw new Error("inputs types should match");
        };
        function i(t, e, n, r, a) {
          let l = "";
          const d = n.length, m = r.length, y = m - d;
          l = m < 2 && d > 0 ? "coords" : n.map((S, O) => `coords.${e[O + y]}`).join(", ");
          const _ = h.BroadcastUtil.getBroadcastDims(n, r).map((S) => `coords.${e[S + y]} = 0;`).join(`
`);
          let v = "vec4(outputValue.xx, outputValue.yy)";
          return h.ShapeUtil.size(n) === 1 && (v = "vec4(outputValue.x)"), a ? `
vec4 getBiasForMatmul() {
  ${t} coords = getOutputCoords();
  ${_}
  vec4 outputValue = getBias(${l});
  return ${v};
}` : `
float getBiasForMatmul() {
  ${t} coords = getOutputCoords();
  ${_}
  return getBias(coords.x);
}`;
        }
        u.getBiasForMatmul = i;
      }, 2403: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createPackProgramInfoLoader = void 0;
        const h = b(5060), p = b(2039), g = b(9390), o = b(2827), c = { name: "pack", inputNames: ["A"], inputTypes: [p.TextureType.unpackedReversed] };
        u.createPackProgramInfoLoader = (f, s) => Object.assign(Object.assign({}, c), { get: () => ((i, t) => {
          const e = (0, h.getGlsl)(i.session.backend.glContext.version), n = t.dims, r = n.length, a = t.dims.length, l = (0, g.getCoordsDataType)(a), d = (0, o.getChannels)("rc", a), m = (y = a, _ = d, v = n[n.length - 2], S = n[n.length - 1], y === 0 || y === 1 ? "" : `
    int r = ${_[y - 2]};
    int c = ${_[y - 1]};
    int rp1 = ${_[y - 2]} + 1;
    int cp1 = ${_[y - 1]} + 1;
    bool rEdge = rp1 >= ${S};
    bool cEdge = cp1 >= ${v};
    `);
          var y, _, v, S;
          let O;
          O = r === 0 ? [1, 1] : r === 1 ? [n[0], 1] : [n[a - 1], n[a - 2]];
          const I = function(V, G, D) {
            if (V === 0) return "false";
            if (V === 1) return `rc > ${G[0]}`;
            let A = "";
            for (let M = V - 2; M < V; M++) A += `${D[M]} >= ${G[M - V + 2]}`, M < V - 1 && (A += "||");
            return A;
          }(a, O, d), w = function(V, G) {
            const D = V.length;
            if (D === 0) return "getA(), 0, 0, 0";
            if (D === 1) return `getA(rc),
            rc + 1 >= ${V[0]} ? 0. : getA(rc + 1),
            0, 0`;
            let A = "";
            if (D > 2) for (let M = 0; M < D - 2; ++M) A += `${G[M]},`;
            return `getA(${A}r, c),
          rEdge ? 0. : getA(${A}rp1, c),
          cEdge ? 0. : getA(${A}r, cp1),
          rEdge || cEdge ? 0. : getA(${A}rp1, cp1)`;
          }(n, d), C = `
        void main() {
          ${l} rc = getOutputCoords();

          if(${I}) {
            ${e.output} = vec4(0);
          } else {
            ${m}

            ${e.output} = vec4(${w});
          }
        }
      `;
          return Object.assign(Object.assign({}, c), { hasMain: !0, output: { dims: t.dims, type: t.type, textureType: p.TextureType.packed }, shaderSource: C });
        })(f, s) });
      }, 2827: (R, u, b) => {
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
      }, 2870: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parsePadAttributesV11 = u.padV11 = u.parsePadAttributesV2 = u.padV2 = void 0;
        const h = b(246), p = b(2517), g = b(5060), o = b(2039), c = { name: "Pad", inputNames: ["A"], inputTypes: [o.TextureType.unpacked] };
        u.padV2 = (l, d, m) => (i(d), [l.run(Object.assign(Object.assign({}, c), { cacheHint: m.cacheKey, get: () => s(l, d[0], m) }), d)]), u.parsePadAttributesV2 = (l) => {
          const d = l.attributes.getString("mode", "constant"), m = l.attributes.getFloat("value", 0), y = l.attributes.getInts("pads");
          return (0, h.createAttributeWithCacheKey)({ mode: d, value: m, pads: y });
        }, u.padV11 = (l, d, m) => {
          t(d);
          const y = f(l, d, m);
          return (0, u.padV2)(l, [d[0]], y);
        }, u.parsePadAttributesV11 = (l) => l.attributes.getString("mode", "constant");
        const f = (l, d, m) => {
          if (!l.session.isInitializer(d[1].dataId) || d.length >= 3 && !l.session.isInitializer(d[2].dataId)) throw new Error("dynamic pad attributes are not allowed");
          const y = Array.from(d[1].integerData), _ = d.length >= 3 ? d[2].floatData[0] : 0;
          return (0, h.createAttributeWithCacheKey)({ mode: m, pads: y, value: _ });
        }, s = (l, d, m) => {
          const y = p.ShapeUtil.padShape(d.dims.slice(), m.pads), _ = y.length, v = `
      ${e(l, d, m)}
      float process(int[${_}] indices) {
          return padA(indices);
      }`;
          return { name: "Pad", inputNames: ["A"], inputTypes: [o.TextureType.unpacked], output: { dims: y, type: d.type, textureType: o.TextureType.unpacked }, shaderSource: v };
        }, i = (l) => {
          if (!l || l.length !== 1) throw new Error("Pad requires 1 input");
          if (l[0].type !== "float32" && l[0].type !== "float64") throw new Error("Invalid input type.");
        }, t = (l) => {
          if (!l || l.length !== 2 && l.length !== 3) throw new Error("Pad requires 2 or 3 inputs");
          if (l[1].type !== "int32") throw new Error("Invalid input type.");
          if (l.length >= 3 && l[2].type === "string") throw new Error("Invalid input type.");
        }, e = (l, d, m) => {
          const y = (0, g.getGlsl)(l.session.backend.glContext.version), [_, v] = l.calculateTextureWidthAndHeight(d.dims, o.TextureType.unpacked), S = p.ShapeUtil.computeStrides(d.dims);
          switch (m.mode) {
            case "constant":
              return n(y, d.dims, S, _, v, m.pads, m.value);
            case "reflect":
              return r(y, d.dims, S, _, v, m.pads);
            case "edge":
              return a(y, d.dims, S, _, v, m.pads);
            default:
              throw new Error("Invalid mode");
          }
        }, n = (l, d, m, y, _, v, S) => {
          const O = d.length;
          let I = "";
          for (let w = O - 1; w >= 0; --w) I += `
        k = m[${w}] - ${v[w]};
        if (k < 0)  return constant;
        if (k >= ${d[w]}) return constant;
        offset += k * ${m[w]};
        `;
          return `
      float padA(int m[${O}]) {
        const float constant = float(${S});
        int offset = 0;
        int k = 0;
        ${I}
        vec2 coords = offsetToCoords(offset, ${y}, ${_});
        float value = getColorAsFloat(${l.texture2D}(A, coords));
        return value;
      }
      `;
        }, r = (l, d, m, y, _, v) => {
          const S = d.length;
          let O = "";
          for (let I = S - 1; I >= 0; --I) O += `
        k = m[${I}] - ${v[I]};
        if (k < 0) { k = -k; }
        {
          const int _2n_1 = ${2 * (d[I] - 1)};
          k = int( mod( float(k), float(_2n_1) ) ) ;
          if(k >= ${d[I]}) { k = _2n_1 - k; }
        }
        offset += k * ${m[I]};
        `;
          return `
      float padA(int m[${S}]) {
        int offset = 0;
        int k = 0;
        ${O}
        vec2 coords = offsetToCoords(offset, ${y}, ${_});
        float value = getColorAsFloat(${l.texture2D}(A, coords));
        return value;
      }
      `;
        }, a = (l, d, m, y, _, v) => {
          const S = d.length;
          let O = "";
          for (let I = S - 1; I >= 0; --I) O += `
        k = m[${I}] - ${v[I]};
        if (k < 0)  k = 0;
        if (k >= ${d[I]}) k = ${d[I] - 1};
        offset += k * ${m[I]};
      `;
          return `
      float padA(int m[${S}]) {
        int offset = 0;
        int k = 0;
        ${O}
        vec2 coords = offsetToCoords(offset, ${y}, ${_});
        float value = getColorAsFloat(${l.texture2D}(A, coords));
        return value;
      }
      `;
        };
      }, 2143: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.globalMaxPool = u.parseMaxPoolAttributes = u.maxPool = u.parseGlobalAveragePoolAttributes = u.globalAveragePool = u.parseAveragePoolAttributes = u.averagePool = void 0;
        const h = b(246), p = b(2517), g = b(2039);
        u.averagePool = (a, l, d) => {
          t(l);
          const m = { name: "AveragePool", inputNames: ["X"], inputTypes: [g.TextureType.unpacked], cacheHint: d.cacheKey };
          return [a.run(Object.assign(Object.assign({}, m), { get: () => o(l, m, !1, d) }), l)];
        }, u.parseAveragePoolAttributes = (a) => {
          const l = a.attributes.getString("auto_pad", "NOTSET"), d = a.attributes.getInt("ceil_mode", 0), m = a.attributes.getInt("count_include_pad", 0) !== 0, y = a.attributes.getInts("kernel_shape"), _ = a.attributes.getInts("strides", []), v = a.attributes.getInts("pads", []);
          if (d !== 0) throw new Error("using ceil() in shape computation is not yet supported for AveragePool");
          return (0, h.createAttributeWithCacheKey)({ autoPad: l, ceilMode: d, countIncludePad: m, kernelShape: y, strides: _, pads: v });
        };
        const o = (a, l, d, m) => {
          const [y, _] = f(a, m, d), v = p.ShapeUtil.size(y.kernelShape);
          let S = "";
          y.countIncludePad ? S += `value /= float(${v});` : S += `value /= float(${v} - pad);`;
          const O = `
        ${e(a[0].dims, y, "value += _X(x);", S, "0.0")}
      `;
          return Object.assign(Object.assign({}, l), { output: { dims: _, type: a[0].type, textureType: g.TextureType.unpacked }, shaderSource: O });
        };
        u.globalAveragePool = (a, l, d) => {
          t(l);
          const m = { name: "GlobalAveragePool", inputNames: ["X"], inputTypes: [g.TextureType.unpacked], cacheHint: `${d.countIncludePad}` };
          return [a.run(Object.assign(Object.assign({}, m), { get: () => o(l, m, !0, d) }), l)];
        }, u.parseGlobalAveragePoolAttributes = (a) => {
          const l = a.attributes.getInt("count_include_pad", 0) !== 0;
          return (0, h.createAttributeWithCacheKey)({ autoPad: "", ceilMode: 0, countIncludePad: l, kernelShape: [], strides: [], pads: [] });
        }, u.maxPool = (a, l, d) => {
          t(l);
          const m = { name: "MaxPool", inputNames: ["X"], inputTypes: [g.TextureType.unpacked], cacheHint: d.cacheKey };
          return [a.run(Object.assign(Object.assign({}, m), { get: () => c(l, m, !1, d) }), l)];
        }, u.parseMaxPoolAttributes = (a) => {
          const l = a.attributes.getString("auto_pad", "NOTSET"), d = a.attributes.getInt("ceil_mode", 0), m = a.attributes.getInts("kernel_shape"), y = a.attributes.getInts("strides", []), _ = a.attributes.getInts("pads", []), v = a.attributes.getInt("storage_order", 0), S = a.attributes.getInts("dilations", []);
          if (v !== 0) throw new Error("column major storage order is not yet supported for MaxPool");
          if (d !== 0) throw new Error("using ceil() in shape computation is not yet supported for MaxPool");
          return (0, h.createAttributeWithCacheKey)({ autoPad: l, ceilMode: d, countIncludePad: !1, kernelShape: m, strides: y, pads: _, storageOrder: v, dilations: S });
        };
        const c = (a, l, d, m) => {
          const [y, _] = f(a, m, d), v = `
      ${e(a[0].dims, y, `
      value = max(_X(x), value);
    `, "", "-1e5")}
    `;
          return Object.assign(Object.assign({}, l), { output: { dims: _, type: a[0].type, textureType: g.TextureType.unpacked }, shaderSource: v });
        }, f = (a, l, d) => {
          const m = a[0].dims.slice(), y = Object.hasOwnProperty.call(l, "dilations"), _ = l.kernelShape.slice(), v = l.strides.slice(), S = y ? l.dilations.slice() : [], O = l.pads.slice();
          p.PoolConvUtil.adjustPoolAttributes(d, m, _, v, S, O);
          const I = p.PoolConvUtil.computePoolOutputShape(d, m, v, S, _, O, l.autoPad), w = Object.assign({}, l);
          return y ? Object.assign(w, { kernelShape: _, strides: v, pads: O, dilations: S, cacheKey: l.cacheKey }) : Object.assign(w, { kernelShape: _, strides: v, pads: O, cacheKey: l.cacheKey }), [w, I];
        }, s = { autoPad: "", ceilMode: 0, countIncludePad: !1, kernelShape: [], strides: [], pads: [], storageOrder: 0, dilations: [], cacheKey: "" }, i = { name: "GlobalMaxPool", inputNames: ["X"], inputTypes: [g.TextureType.unpacked] };
        u.globalMaxPool = (a, l) => (t(l), [a.run(Object.assign(Object.assign({}, i), { get: () => c(l, i, !0, s) }), l)]);
        const t = (a) => {
          if (!a || a.length !== 1) throw new Error("Pool ops requires 1 input.");
          if (a[0].type !== "float32" && a[0].type !== "float64") throw new Error("Invalid input type.");
        }, e = (a, l, d, m, y) => {
          const _ = a.length;
          if (l.kernelShape.length <= 2) {
            const v = l.kernelShape[l.kernelShape.length - 1], S = l.strides[l.strides.length - 1], O = l.pads[l.pads.length / 2 - 1], I = l.pads[l.pads.length - 1], w = a[_ - 1];
            let C = "", V = "", G = "";
            if (C = O + I !== 0 ? `
          for (int i = 0; i < ${v}; i++) {
            x[${_} - 1] = indices[${_} - 1] * ${S} - ${O} + i;
            if (x[${_} - 1] < 0 || x[${_} - 1] >= ${w}) {
              pad++;
              continue;
            }
            ${d}
          }` : `
          for (int i = 0; i < ${v}; i++) {
            x[${_} - 1] = indices[${_} - 1] * ${S} - ${O} + i;
            ${d}
          }`, l.kernelShape.length === 2) {
              const D = l.kernelShape[l.kernelShape.length - 2], A = l.strides[l.strides.length - 2], M = l.pads[l.pads.length / 2 - 2], E = l.pads[l.pads.length - 2], F = a[_ - 2];
              V = M + E !== 0 ? `
            for (int j = 0; j < ${D}; j++) {
              x[${_} - 2] = indices[${_} - 2] * ${A} - ${M} + j;
              if (x[${_} - 2] < 0 || x[${_} - 2] >= ${F}) {
                pad+= ${v};
                continue;
              }
          ` : `
            for (int j = 0; j < ${D}; j++) {
              x[${_} - 2] = indices[${_} - 2] * ${A} - ${M} + j;
            `, G = `
          }
        `;
            }
            return `
        float process(int indices[${_}]) {
          int x[${_}];
          copyVec(indices, x);

          float value = ${y};
          int pad = 0;
          ${V}
          ${C}
          ${G}
          ${m}
          return value;
        }
      `;
          }
          {
            const v = p.ShapeUtil.size(l.kernelShape), S = p.ShapeUtil.computeStrides(l.kernelShape), O = S.length, I = l.pads.length, w = r(O), C = n(a, "inputDims"), V = n(l.pads, "pads"), G = n(S, "kernelStrides"), D = n(l.strides, "strides");
            let A = "";
            return A = l.pads.reduce((M, E) => M + E) ? `
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
        ${w}
        float process(int indices[${_}]) {
          int x[${_}];
          copyVec(indices, x);
          int offset[${O}];
          int pads[${I}];
          int inputDims[${_}];
          int kernelStrides[${O}];
          int strides[${O}];
          ${V}
          ${C}
          ${D}
          ${G}

          float value = ${y};
          int pad = 0;
          bool isPad = false;
          for (int i = 0; i < ${v}; i++) {
            offsetToIndices(i, kernelStrides, offset);
            isPad = false;
            for (int j = ${_} - ${O}; j < ${_}; j++) {
              x[j] = indices[j] * strides[j - ${_} + ${O}]
                + offset[j - ${_} + ${O}] - pads[j - 2];
              ${A}
          }
          ${m}

          return value;
        }
      `;
          }
        }, n = (a, l) => {
          let d = "";
          for (let m = 0; m < a.length; m++) d += `
      ${l}[${m}] = ${a[m]};
    `;
          return d;
        }, r = (a) => `
  void offsetToIndices(int offset, int[${a}] strides, out int[${a}] indices) {
    if (${a} == 0) {
      return;
    }
    for (int i = 0; i < ${a} - 1; ++i) {
      indices[i] = offset / strides[i];
      offset -= indices[i] * strides[i];
    }
    indices[${a} - 1] = offset;
  }`;
      }, 4939: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.reduceLogSumSquare = u.reduceLogSum = u.reduceProd = u.reduceMin = u.reduceMax = u.reduceMean = u.reduceSum = u.parseReduceAttributes = void 0;
        const h = b(246), p = b(782), g = b(2517), o = b(2039), c = (i, t, e, n, r) => {
          s(t);
          const a = { name: n, inputNames: ["A"], inputTypes: [o.TextureType.unpacked] };
          return [i.run(Object.assign(Object.assign({}, a), { cacheHint: e.cacheKey, get: () => f(i, t, e, n, r, a) }), t)];
        };
        u.parseReduceAttributes = (i) => {
          const t = i.attributes.getInts("axes", []), e = i.attributes.getInt("keepdims", 1) === 1;
          return (0, h.createAttributeWithCacheKey)({ axes: t, keepDims: e });
        };
        const f = (i, t, e, n, r, a) => {
          const l = [], d = t[0].dims.length || 1, m = [], y = g.ShapeUtil.normalizeAxes(e.axes, t[0].dims.length), _ = r(t, y);
          let v = _[1];
          for (let O = 0; O < t[0].dims.length; O++) y.indexOf(O) >= 0 || y.length === 0 ? (e.keepDims && l.push(1), v = `
          for(int j${O} = 0; j${O} < ${t[0].dims[O]}; j${O}++) {
            inputIdx[${O}] = j${O};
            ${v}
          }`) : (m.push(`inputIdx[${O}] = outputIdx[${l.length}];`), l.push(t[0].dims[O]));
          const S = `
      float process(int outputIdx[${l.length || 1}]) {
        float value;                 // final result
        int inputIdx[${d}];      // addressing input data
        ${m.join(`
`)}
        ${_[0]}       // init ops for reduce max/min
        ${v}
        ${_[2]}       // final computation for reduce mean
        return value;
      }`;
          return Object.assign(Object.assign({}, a), { output: { dims: l, type: t[0].type, textureType: o.TextureType.unpacked }, shaderSource: S });
        }, s = (i) => {
          if (!i || i.length !== 1) throw new Error("Reduce op requires 1 input.");
          if (p.NUMBER_TYPES.indexOf(i[0].type) === -1) throw new Error("Invalid input type.");
        };
        u.reduceSum = (i, t, e) => c(i, t, e, "ReduceSum", () => ["value = 0.0;", "value += _A(inputIdx);", ""]), u.reduceMean = (i, t, e) => c(i, t, e, "ReduceMean", (n, r) => {
          let a = 1;
          for (let l = 0; l < n[0].dims.length; l++) (r.indexOf(l) >= 0 || r.length === 0) && (a *= n[0].dims[l]);
          return ["value = 0.0;", "value += _A(inputIdx);", `value /= ${a}.;`];
        }), u.reduceMax = (i, t, e) => c(i, t, e, "ReduceMax", (n, r) => {
          const a = [];
          for (let l = 0; l < n[0].dims.length; l++) (r.indexOf(l) >= 0 || r.length === 0) && a.push(`inputIdx[${l}] = 0;`);
          return [`${a.join(`
`)}
value = _A(inputIdx);`, "value = max(value, _A(inputIdx));", ""];
        }), u.reduceMin = (i, t, e) => c(i, t, e, "ReduceMin", (n, r) => {
          const a = [];
          for (let l = 0; l < n[0].dims.length; l++) (r.indexOf(l) >= 0 || r.length === 0) && a.push(`inputIdx[${l}] = 0;`);
          return [`${a.join(`
`)}
value = _A(inputIdx);`, "value = min(value, _A(inputIdx));", ""];
        }), u.reduceProd = (i, t, e) => c(i, t, e, "ReduceProd", () => ["value = 1.0;", "value *= _A(inputIdx);", ""]), u.reduceLogSum = (i, t, e) => c(i, t, e, "ReduceLogSum", () => ["value = 0.0;", "value += _A(inputIdx);", "value = log(value);"]), u.reduceLogSumSquare = (i, t, e) => c(i, t, e, "ReduceLogSumSquare", () => ["float t; value = 0.0;", "t = _A(inputIdx); value += t * t;", ""]);
      }, 7019: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.isReshapeCheap = u.processDims3D = u.createPackedReshape3DProgramInfoLoader = void 0;
        const h = b(2517), p = b(5060), g = b(2039), o = b(2827);
        u.createPackedReshape3DProgramInfoLoader = (c, f, s) => {
          const i = ((t) => ({ name: "Reshape (packed)", inputTypes: [g.TextureType.packed], inputNames: ["A"], cacheHint: `${t}` }))(s);
          return Object.assign(Object.assign({}, i), { get: () => ((t, e, n, r) => {
            const a = e.dims, l = r;
            let d = "";
            for (let _ = 0; _ < 4; _++) {
              let v = "";
              switch (_) {
                case 0:
                  v = "outputCoords = rc;";
                  break;
                case 1:
                  v = "outputCoords = ivec3(rc.x, rc.y+1, rc.z);";
                  break;
                case 2:
                  v = "outputCoords = ivec3(rc.x, rc.y, rc.z+1);";
                  break;
                case 3:
                  v = "outputCoords = ivec3(rc.x, rc.y+1, rc.z+1);";
                  break;
                default:
                  throw new Error();
              }
              d += `
        ${v}
        ${_ > 0 ? "if(outputCoords.y < rows && outputCoords.z < cols){" : ""}
          int flattenedIndex = getFlattenedIndex(outputCoords);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flattenedIndex);
          vec2 innerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${_}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), innerDims);

        ${_ > 0 ? "}" : ""}
      `;
            }
            const m = (0, p.getGlsl)(t.session.backend.glContext.version), y = `
      ${function(_) {
              const v = h.ShapeUtil.computeStrides(_), S = ["b", "r", "c"], O = "index";
              return `
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${v.map((I, w) => `int ${S[w]} = ${O} / ${I}; ${w === v.length - 1 ? `int ${S[w + 1]} = ${O} - ${S[w]} * ${I}` : `index -= ${S[w]} * ${I}`};`).join("")}
      return ivec3(b, r, c);
    }
  `;
            }(a)}
      ${function(_) {
              const v = h.ShapeUtil.computeStrides(_);
              return `
  int getFlattenedIndex(ivec3 coords) {
    // reverse y, z order
    return coords.x * ${v[0]} + coords.z * ${v[1]} + coords.y;
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
          })(c, f, i, s) });
        }, u.processDims3D = function(c) {
          if (c.length === 0) return [1, 1, 1];
          let f = 1;
          for (let s = 0; s < c.length - 2; ++s) f *= c[s];
          return [f, c.length > 1 ? c[c.length - 2] : 1, c[c.length - 1]];
        }, u.isReshapeCheap = function(c, f) {
          let s = !1;
          return s = c.length === 0 || f.length === 0 || (c.length < 2 || f.length < 2 ? c[c.length - 1] === f[f.length - 1] : c[c.length - 1] === f[f.length - 1] && c[c.length - 2] === f[f.length - 2]), s;
        };
      }, 718: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.reshape = void 0;
        const h = b(2517);
        u.reshape = (p, g) => {
          const o = h.ShapeUtil.calculateReshapedDims(g[0].dims, g[1].integerData);
          return p.session.pack ? [p.reshapePacked(g[0], o)] : [p.reshapeUnpacked(g[0], o)];
        };
      }, 2268: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseResizeAttributesV11 = u.parseResizeAttributesV10 = u.resize = void 0;
        const h = b(5060), p = b(2039), g = b(9390), o = b(2827), c = b(9793), f = { name: "Resize", inputNames: ["A"], inputTypes: [p.TextureType.packed] };
        u.resize = (n, r, a) => ((0, c.validateInputs)(r, a), [n.run(Object.assign(Object.assign({}, f), { cacheHint: a.cacheKey, get: () => s(n, r, a) }), r)]), u.parseResizeAttributesV10 = (n) => (0, c.parseUpsampleAttributes)(n, 10), u.parseResizeAttributesV11 = (n) => (0, c.parseUpsampleAttributes)(n, 11);
        const s = (n, r, a) => {
          const l = (0, h.getGlsl)(n.session.backend.glContext.version), [d, m] = i(r, a);
          if (d.every((A) => A === 1) && a.coordinateTransformMode !== "tf_crop_and_resize") return Object.assign(Object.assign({}, f), { output: { dims: m, type: r[0].type, textureType: p.TextureType.packed }, hasMain: !0, shaderSource: `void main() {
                    vec4 v = ${l.texture2D}(X, TexCoords);
                    ${l.output} = v;
                }` });
          const y = m.length;
          if (y < 2) throw new Error(`output dimension should be at least 2, but got ${y}`);
          const _ = m[y - 2], v = m[y - 1], S = r[0].dims;
          if (y !== S.length) throw new Error(`output dimension should match input ${S.length}, but got ${y}`);
          const O = S[y - 2], I = S[y - 1], w = d[y - 2], C = d[y - 1];
          let V = "";
          if (a.mode !== "linear") throw new Error(`resize (packed) does not support mode: '${a.mode}'`);
          switch (a.coordinateTransformMode) {
            case "asymmetric":
              V = `
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return vec4(coords) / scaleWHWH;
                    }
                `;
              break;
            case "half_pixel":
              V = `
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return (vec4(coords) + 0.5) / scaleWHWH - 0.5;
                    }
                `;
              break;
            case "pytorch_half_pixel":
              V = `
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 fcoords = vec4(coords);
                        return vec4(
                            ${v}.0 > 1.0 ? (fcoords.x + 0.5) / scaleWHWH.x - 0.5 : 0.0,
                            ${_}.0 > 1.0 ? (fcoords.y + 0.5) / scaleWHWH.y - 0.5 : 0.0,
                            ${v}.0 > 1.0 ? (fcoords.z + 0.5) / scaleWHWH.z - 0.5 : 0.0,
                            ${_}.0 > 1.0 ? (fcoords.w + 0.5) / scaleWHWH.w - 0.5 : 0.0
                          );
                    }
                `;
              break;
            case "align_corners":
              V = `
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 resized = vec4(${v}.0 - 1.0, ${_}.0 - 1.0, ${v}.0 - 1.0,
                            ${_}.0 - 1.0);
                        vec4 original = vec4(${I}.0 - 1.0, ${O}.0 - 1.0, ${I}.0 - 1.0,
                            ${O}.0 - 1.0);
                        vec4 new_scale = original / resized;
                        return vec4(coords) * new_scale;
                    }
                `;
              break;
            default:
              throw new Error(`resize (packed) does not support coordinateTransformMode:                                 '${a.coordinateTransformMode}'`);
          }
          const G = (0, g.getCoordsDataType)(y), D = `
            const vec2 inputWH = vec2(${O}.0, ${I}.0);
            const vec4 scaleWHWH = vec4(float(${w}), float(${C}), float(${w}), float(${C}));
            ${(0, o.unpackFromChannel)()}
            ${V}
            float getAValue(int x10, int r, int c, int d) {
                return getChannel(getA(x10, r, c, d), vec2(c, d));
            }
            void main() {
                ${G} rc = getOutputCoords();

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

                bool hasNextRow = rc.w < ${_ - 1};
                bool hasNextCol = rc.z < ${v - 1};

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
          const a = n[0].dims;
          let l, d = r.scales;
          if (d.length === 0) {
            const y = n[r.scalesInputIdx];
            if (y && y.size !== 0) {
              if (n[r.sizesInputIdx]) throw new Error("Only one of scales or sizes must be provided as input.");
              d = t(y, r.mode, r.isResize);
            } else {
              const _ = n[r.sizesInputIdx];
              if (!_ || _.size === 0) throw new Error("Either scales or sizes MUST be provided as input.");
              l = Array.from(_.integerData), d = e(l, a, r.mode, r.isResize);
            }
          } else if (n[r.sizesInputIdx]) throw new Error("Only one of scales or sizes must be provided as input.");
          const m = l || a.map((y, _) => Math.floor(y * d[_]));
          return [d, m];
        }, t = (n, r, a) => {
          const l = Array.from(n.floatData);
          return (0, c.scalesValidation)(l, r, a), l;
        }, e = (n, r, a, l) => {
          const d = r.length, m = new Array(d);
          for (let y = 0, _ = d; y < _; y++) if (r[y] === 0) {
            if (n[y] !== 0) throw new Error("Input dim is zero but required output dim is non-zero.");
            m[y] = 1;
          } else m[y] = n[y] / r[y];
          return (0, c.scalesValidation)(m, a, l), m;
        };
      }, 8117: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.shape = void 0;
        const h = b(9162);
        u.shape = (g, o) => (p(o), [new h.Tensor([o[0].dims.length], "int32", void 0, void 0, new Int32Array(o[0].dims))]);
        const p = (g) => {
          if (!g || g.length !== 1) throw new Error("Shape requires 1 input.");
        };
      }, 2278: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.sliceV10 = u.parseSliceAttributes = u.slice = void 0;
        const h = b(246), p = b(782), g = b(2517), o = b(2039), c = { name: "Slice", inputNames: ["A"], inputTypes: [o.TextureType.unpacked] };
        u.slice = (e, n, r) => (s(n), [e.run(Object.assign(Object.assign({}, c), { cacheHint: r.cacheKey, get: () => f(e, n[0], r) }), n)]), u.parseSliceAttributes = (e) => {
          const n = e.attributes.getInts("starts"), r = e.attributes.getInts("ends"), a = e.attributes.getInts("axes", []);
          return (0, h.createAttributeWithCacheKey)({ starts: n, ends: r, axes: a });
        };
        const f = (e, n, r) => {
          const a = r.axes.length === 0 ? n.dims.slice(0).map((S, O) => O) : r.axes, l = g.ShapeUtil.normalizeAxes(a, n.dims.length), d = r.starts.map((S, O) => S > n.dims[l[O]] - 1 ? n.dims[l[O]] : g.ShapeUtil.normalizeAxis(S, n.dims[l[O]])), m = r.ends.map((S, O) => S > n.dims[l[O]] - 1 ? n.dims[l[O]] : g.ShapeUtil.normalizeAxis(S, n.dims[l[O]])), y = n.dims.slice(), _ = [];
          for (let S = 0; S < l.length; S++) y[l[S]] = m[S] - d[S], d[S] > 0 && _.push(`outputIdx[${l[S]}] += ${d[S]};`);
          const v = `
      float process(int outputIdx[${y.length}]) {
        ${_.join(`
      `)}
        return _A(outputIdx);
      }`;
          return Object.assign(Object.assign({}, c), { output: { dims: y, type: n.type, textureType: o.TextureType.unpacked }, shaderSource: v });
        }, s = (e) => {
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
          const r = Array.from(n[1].integerData), a = Array.from(n[2].integerData), l = n.length >= 4 ? Array.from(n[3].integerData) : [];
          return { starts: r, ends: a, axes: l, cacheKey: `${l};${r};${a}` };
        }, t = (e) => {
          if (!e || e.length < 3 || e.length > 5) throw new Error("Invalid input number.");
          if (e[1].type !== "int32" || e[1].dims.length !== 1) throw new Error("Invalid input type.");
          if (e[2].type !== "int32" || e[2].dims.length !== 1) throw new Error("Invalid input type.");
          if (e.length >= 4 && (e[3].type !== "int32" || e[3].dims.length !== 1)) throw new Error("Invalid input type.");
          if (e.length >= 5 && (e[4].type !== "int32" || e[4].dims.length !== 1)) throw new Error("Invalid input type.");
        };
      }, 5524: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.softmaxV13 = u.parseSoftmaxAttributesV13 = u.parseSoftmaxAttributes = u.softmax = void 0;
        const h = b(246), p = b(2517), g = b(5060), o = b(2039), c = b(3738), f = { name: "SoftmaxComputeMax", inputNames: ["A"], inputTypes: [o.TextureType.unpacked] }, s = { name: "SoftmaxComputeScale", inputNames: ["A", "Max"], inputTypes: [o.TextureType.unpacked, o.TextureType.unpacked] }, i = { name: "SoftMax", inputNames: ["A", "Max", "Norm"], inputTypes: [o.TextureType.unpacked, o.TextureType.unpacked, o.TextureType.unpacked] };
        u.softmax = (l, d, m) => {
          a(d);
          const y = d[0].dims.slice(), _ = p.ShapeUtil.normalizeAxis(m.axis, y.length), v = p.ShapeUtil.sizeToDimension(y, _), S = p.ShapeUtil.sizeFromDimension(y, _);
          return t(l, d, m, v, S);
        }, u.parseSoftmaxAttributes = (l) => (0, h.createAttributeWithCacheKey)({ axis: l.attributes.getInt("axis", 1) }), u.parseSoftmaxAttributesV13 = (l) => (0, h.createAttributeWithCacheKey)({ axis: l.attributes.getInt("axis", -1) }), u.softmaxV13 = (l, d, m) => {
          a(d);
          const y = d[0].dims.slice(), _ = p.ShapeUtil.normalizeAxis(m.axis, y.length), v = y.length, S = _ !== v - 1, O = [];
          let I, w = [], C = [];
          S && (w = Array.from({ length: v }).map((A, M) => M), w[_] = v - 1, w[v - 1] = _, w.map((A) => O.push(y[A])), I = (0, h.createAttributeWithCacheKey)({ perm: w }), C = (0, c.transpose)(l, d, I));
          const V = S ? p.ShapeUtil.sizeToDimension(O, v - 1) : p.ShapeUtil.sizeToDimension(y, v - 1), G = S ? p.ShapeUtil.sizeFromDimension(O, v - 1) : p.ShapeUtil.sizeFromDimension(y, v - 1), D = t(l, S ? C : d, m, V, G);
          return S ? (0, c.transpose)(l, D, I) : D;
        };
        const t = (l, d, m, y, _) => {
          const v = e(l, d[0], y, _, [y]), S = l.run(Object.assign(Object.assign({}, f), { cacheHint: m.cacheKey, get: () => v }), d), O = n(l, d[0], y, _, v.output.dims, [y]), I = l.run(Object.assign(Object.assign({}, s), { cacheHint: m.cacheKey, get: () => O }), [d[0], S]), w = r(l, d[0], y, _, v.output.dims, O.output.dims);
          return [l.run(Object.assign(Object.assign({}, i), { cacheHint: m.cacheKey, get: () => w }), [d[0], S, I])];
        }, e = (l, d, m, y, _) => {
          const [v, S] = l.calculateTextureWidthAndHeight(d.dims, o.TextureType.unpacked), O = _.length;
          if (m < 1 || y < 1) throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
          if (_.length !== 1) throw new Error("Dimensionality of the output should be 1");
          if (_[0] !== m) throw new Error("Shape of the output should be equal to logical row count");
          const I = (0, g.getGlsl)(l.session.backend.glContext.version), w = `
      float process(int[${O}] indices) {
        int logical_row_start_offset = indices[0] * ${y};

        float max = getColorAsFloat(${I.texture2D}(A, offsetToCoords(logical_row_start_offset, ${v},
        ${S} )));
        for(int i=1; i<${y}; ++i)
        {
          float current = getColorAsFloat(${I.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${v}, ${S})));
          if(current > max)
          max = current;
        }

        return max;
      }`;
          return Object.assign(Object.assign({}, f), { output: { dims: _, type: d.type, textureType: o.TextureType.unpacked }, shaderSource: w });
        }, n = (l, d, m, y, _, v) => {
          const [S, O] = l.calculateTextureWidthAndHeight(d.dims, o.TextureType.unpacked), I = v.length;
          if (m < 1 || y < 1) throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
          if (v.length !== 1) throw new Error("Dimensionality of the output should be 1");
          if (v[0] !== m) throw new Error("Shape of the output should be equal to logical row count");
          if (_.length !== 1) throw new Error("Dimensionality of the intermediate results should be 1");
          if (_[0] !== m) throw new Error("Shape of the intermediate results should be equal to logical row count");
          const w = `
      float process(int[${I}] indices) {
        int logical_row_start_offset = indices[0] * ${y};

        float norm_factor = 0.0;
        float max = _Max(indices);
        for(int i=0; i<${y}; ++i)
        {
          norm_factor += exp(getColorAsFloat(${(0, g.getGlsl)(l.session.backend.glContext.version).texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${S}, ${O}))) - max);
        }

        return norm_factor;
      }`;
          return Object.assign(Object.assign({}, s), { output: { dims: v, type: d.type, textureType: o.TextureType.unpacked }, shaderSource: w });
        }, r = (l, d, m, y, _, v) => {
          const [S, O] = l.calculateTextureWidthAndHeight(d.dims, o.TextureType.unpacked), I = d.dims.length;
          if (m < 1 || y < 1) throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
          if (_.length !== 1 || v.length !== 1) throw new Error("Dimensionality of the intermediate results should be 1");
          if (_[0] !== m || v[0] !== m) throw new Error("Shape of the intermediate results should be equal to logical row count");
          const w = `
      float process(int[${I}] indices) {

      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)
      int offset = coordsToOffset(TexCoords, ${S}, ${O});

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
          return Object.assign(Object.assign({}, i), { output: { dims: d.dims, type: d.type, textureType: o.TextureType.unpacked }, shaderSource: w });
        }, a = (l) => {
          if (!l || l.length !== 1) throw new Error("Softmax requires 1 input.");
          if (l[0].type !== "float32" && l[0].type !== "float64") throw new Error("Invalid input type");
        };
      }, 5975: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseSplitAttributes = u.split = void 0;
        const h = b(246), p = b(2517), g = b(2039), o = { name: "Split", inputNames: ["A"], inputTypes: [g.TextureType.unpacked] };
        u.split = (i, t, e) => {
          s(t);
          const n = p.ShapeUtil.normalizeAxis(e.axis, t[0].dims.length), r = c(i, t, n, e), a = [];
          for (let l = 0; l < r; ++l) a.push(i.run(Object.assign(Object.assign({}, o), { cacheHint: `${e.cacheKey};${l}`, get: () => f(i, t[0], e, n, l) }), t));
          return a;
        }, u.parseSplitAttributes = (i) => {
          const t = i.attributes.getInt("axis", 0), e = i.attributes.getInts("split", []), n = i.outputs.length;
          return (0, h.createAttributeWithCacheKey)({ axis: t, split: e, numOutputs: n });
        };
        const c = (i, t, e, n) => {
          const [, r] = p.SplitUtil.splitShape(t[0].dims, e, n.split, n.numOutputs);
          return r.length;
        }, f = (i, t, e, n, r) => {
          const [a, l] = p.SplitUtil.splitShape(t.dims, n, e.split, e.numOutputs), d = l[r], m = a[r], y = `
      float process(int indices[${m.length}]) {
        indices[${n}] += ${d};
        return _A(indices);
      }
    `;
          return Object.assign(Object.assign({}, o), { cacheHint: `${e.cacheKey}:${r}`, output: { dims: m, type: t.type, textureType: g.TextureType.unpacked }, shaderSource: y });
        }, s = (i) => {
          if (!i || i.length !== 1) throw new Error("Split requires one input.");
          if (i[0].type !== "int8" && i[0].type !== "uint8" && i[0].type !== "int16" && i[0].type !== "uint16" && i[0].type !== "int32" && i[0].type !== "uint32" && i[0].type !== "float32" && i[0].type !== "float64" && i[0].type !== "bool") throw new Error("Invalid input type.");
        };
      }, 3933: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseSqueezeAttributes = u.squeezeV13 = u.squeeze = void 0;
        const h = b(2517);
        u.squeeze = (o, c, f) => {
          p(c);
          const s = h.ShapeUtil.squeezeShape(c[0].dims, f);
          return [o.reshapeUnpacked(c[0], s)];
        }, u.squeezeV13 = (o, c) => (g(c), (0, u.squeeze)(o, [c[0]], Array.from(c[1].integerData))), u.parseSqueezeAttributes = (o) => o.attributes.getInts("axes");
        const p = (o) => {
          if (!o || o.length !== 1) throw new Error("Squeeze requires 1 input.");
          if (o[0].type === "string") throw new Error("invalid input tensor types.");
        }, g = (o) => {
          if (!o || o.length !== 2) throw new Error("Squeeze requires 2 inputs.");
          if (o[1].type !== "int32") throw new Error("Invalid input type.");
        };
      }, 6558: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.sum = void 0;
        const h = b(5060), p = b(2039);
        u.sum = (c, f) => {
          o(f);
          const s = { name: "Sum", inputNames: f.map((i, t) => `X${t}`), inputTypes: new Array(f.length).fill(p.TextureType.unpacked) };
          return [c.run(Object.assign(Object.assign({}, s), { get: () => g(c, f, s) }), f)];
        };
        const g = (c, f, s) => {
          const i = (0, h.getGlsl)(c.session.backend.glContext.version), t = f[0].dims.slice(), e = `
      void main() {
        vec4 result = ${f.map((n, r) => `${i.texture2D}(X${r},TexCoords)`).join(" + ")};
        ${i.output} = result;
      }
    `;
          return Object.assign(Object.assign({}, s), { output: { dims: t, type: f[0].type, textureType: p.TextureType.unpacked }, hasMain: !0, shaderSource: e });
        }, o = (c) => {
          if (!c || c.length === 0) throw new Error("Sum requires inputs.");
          const f = c[0].dims.length;
          for (let s = 1; s < c.length; s++) {
            if (f !== c[s].dims.length) throw new Error("Input shapes are mismatched.");
            for (let i = 0; i < f; i++) if (c[0].dims[i] !== c[s].dims[i]) throw new Error("Input shapes are not matched.");
          }
          if (c[0].type !== "float32" && c[0].type !== "float64") throw new Error("Invalid input type.");
          for (let s = 1; s < c.length; s++) if (c[0].type !== c[s].type) throw new Error("Input types are not matched.");
        };
      }, 5723: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.tile = void 0;
        const h = b(782), p = b(2039);
        u.tile = (c, f) => {
          o(f);
          const s = { name: "Tile", inputNames: ["A"], inputTypes: [p.TextureType.unpacked] };
          return [c.run(Object.assign(Object.assign({}, s), { get: () => g(c, f, s) }), f)];
        };
        const g = (c, f, s) => {
          const i = f[0].dims.slice(), t = new Array(i.length), e = [];
          for (let a = 0; a < i.length; a++) t[a] = i[a] * f[1].numberData[a], e.push(`inputIdx[${a}] = int(mod(float(outputIdx[${a}]), ${i[a]}.));`);
          const n = t.length, r = `
      float process(int outputIdx[${n}]) {
        int inputIdx[${n}];
        ${e.join(`
`)}
        return _A(inputIdx);
      }
    `;
          return Object.assign(Object.assign({}, s), { output: { dims: t, type: f[0].type, textureType: p.TextureType.unpacked }, shaderSource: r });
        }, o = (c) => {
          if (!c || c.length !== 2) throw new Error("Tile requires 2 input.");
          if (c[1].dims.length !== 1) throw new Error("The second input shape must 1 dimension.");
          if (c[1].dims[0] !== c[0].dims.length) throw new Error("Invalid input shape.");
          if (h.NUMBER_TYPES.indexOf(c[0].type) === -1) throw new Error("Invalid input type.");
          if (c[1].type !== "int32" && c[1].type !== "int16") throw new Error("Invalid repeat type.");
        };
      }, 3738: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseTransposeAttributes = u.transpose = void 0;
        const h = b(246), p = b(2517), g = b(2039), o = { name: "Transpose", inputNames: ["A"], inputTypes: [g.TextureType.unpacked] };
        u.transpose = (e, n, r) => (t(n), [e.run(Object.assign(Object.assign({}, o), { cacheHint: r.cacheKey, get: () => c(e, n[0], r.perm) }), n)]), u.parseTransposeAttributes = (e) => (0, h.createAttributeWithCacheKey)({ perm: e.attributes.getInts("perm", []) });
        const c = (e, n, r) => {
          const a = n.dims;
          r = f(a, r);
          const l = s(a, r), d = a.length, m = `
      ${i("perm", r, d)}
      float process(int indices[${d}]) {
        int a[${d}];
        perm(a, indices);
        return _A(a);
      }`;
          return Object.assign(Object.assign({}, o), { output: { dims: l, type: n.type, textureType: g.TextureType.unpacked }, shaderSource: m });
        }, f = (e, n) => (n && n.length !== e.length && (n = [...e.keys()].reverse()), n), s = (e, n) => (n = f(e, n), p.ShapeUtil.sortBasedOnPerm(e, n)), i = (e, n, r) => {
          const a = [];
          a.push(`void ${e}(out int a[${r}], int src[${r}]) {`);
          for (let l = 0; l < r; ++l) a.push(`	a[${n[l]}]=src[${l}];`);
          return a.push("	}"), a.join(`
`);
        }, t = (e) => {
          if (!e || e.length !== 1) throw new Error("Transpose requires 1 input.");
          if (e[0].type !== "float32" && e[0].type !== "float64") throw new Error("input should be float tensor");
        };
      }, 8710: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.encodeAsUint8 = void 0;
        const h = b(5060), p = b(2039);
        u.encodeAsUint8 = (g, o) => {
          const c = o.shape, f = (0, h.getGlsl)(g.session.backend.glContext.version), s = `
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
    }`, i = { name: "Uint8Encode", inputTypes: [p.TextureType.unpacked], inputNames: ["X"], output: { dims: c, type: o.tensor.type, textureType: p.TextureType.downloadUint8AsFloat }, shaderSource: s, hasMain: !0 };
          return g.executeProgram(i, [o.tensor]);
        };
      }, 4909: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.tanh = u.tan = u.sqrt = u.sin = u.sigmoid = u.relu = u.not = u.neg = u.log = u.parseLeakyReluAttributes = u.leakyRelu = u.identity = u.floor = u.exp = u.parseEluAttributes = u.elu = u.cos = u.ceil = u.clipV11 = u.parseClipAttributes = u.clip = u.atan = u.asin = u.acos = u.abs = u.glslTanh = u.glslTan = u.glslSqrt = u.glslSigmoid = u.glslRelu = u.glslSin = u.glslNot = u.glslNeg = u.glslLog = u.glslLeakyRelu = u.glslIdentity = u.glslClip = u.glslFloor = u.glslExp = u.glslElu = u.glslCos = u.glslCeil = u.glslAtan = u.glslAsin = u.glslAcos = u.glslAbs = void 0;
        const h = b(246), p = b(2517), g = b(8520), o = b(5060), c = b(2039);
        function f() {
          return D("abs");
        }
        function s() {
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
          const F = "elu";
          return { body: `
  const float alpha = float(${E});

  float ${F}_(float a) {
    return a >= 0.0 ? a: (exp(a) - 1.0) * alpha;
  }
  vec4 ${F}_(vec4 v) {
    return vec4(${F}_(v.x), ${F}_(v.y), ${F}_(v.z), ${F}_(v.w));
  }
  `, name: F, type: g.FunctionType.ValueBased };
        }
        function a() {
          return D("exp");
        }
        function l() {
          return D("floor");
        }
        function d(E, F) {
          const W = "clip";
          return { body: `
  const float min = float(${E});
  const float max = float(${F});

  float ${W}_(float a) {
    return clamp(a, min, max);
  }
  vec4 ${W}_(vec4 v) {
    return clamp(v, min, max);
  }
  `, name: W, type: g.FunctionType.ValueBased };
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
          const F = "leakyRelu";
          return { body: `
  const float alpha = float(${E});

  float ${F}_(float a) {
    return a < 0.0 ? a * alpha : a;
  }
  vec4 ${F}_(vec4 v) {
    return vec4(${F}_(v.x), ${F}_(v.y), ${F}_(v.z), ${F}_(v.w));
  }
  `, name: F, type: g.FunctionType.ValueBased };
        }
        function _() {
          return D("log");
        }
        function v() {
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
        function O() {
          return D("sin");
        }
        function I() {
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
        function w() {
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
        function C() {
          return D("sqrt");
        }
        function V() {
          return D("tan");
        }
        function G() {
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
        u.glslAbs = f, u.glslAcos = s, u.glslAsin = i, u.glslAtan = t, u.glslCeil = e, u.glslCos = n, u.glslElu = r, u.glslExp = a, u.glslFloor = l, u.glslClip = d, u.glslIdentity = m, u.glslLeakyRelu = y, u.glslLog = _, u.glslNeg = v, u.glslNot = S, u.glslSin = O, u.glslRelu = I, u.glslSigmoid = w, u.glslSqrt = C, u.glslTan = V, u.glslTanh = G;
        const A = (E, F, W, q) => {
          const Q = E.session.pack ? c.TextureType.packed : c.TextureType.unpacked, Z = { name: W.name, inputTypes: [Q], inputNames: ["A"], cacheHint: q };
          return Object.assign(Object.assign({}, Z), { get: () => ((ee, se, me, ie) => {
            const _e = ee.session.pack ? c.TextureType.packed : c.TextureType.unpacked, be = (0, o.getGlsl)(ee.session.backend.glContext.version);
            return Object.assign(Object.assign({}, se), { output: { dims: me.dims, type: me.type, textureType: _e }, shaderSource: `
     ${ie.body}
     void main() {
       vec4 v = ${be.texture2D}(A, TexCoords);
       v = ${ie.name}_(v);
       ${be.output} = v;
     }
     `, hasMain: !0 });
          })(E, Z, F, W) });
        };
        u.abs = (E, F) => [E.run(A(E, F[0], f()), F)], u.acos = (E, F) => [E.run(A(E, F[0], s()), F)], u.asin = (E, F) => [E.run(A(E, F[0], i()), F)], u.atan = (E, F) => [E.run(A(E, F[0], t()), F)], u.clip = (E, F, W) => [E.run(A(E, F[0], d(W.min, W.max), W.cacheKey), F)], u.parseClipAttributes = (E) => (0, h.createAttributeWithCacheKey)({ min: E.attributes.getFloat("min", p.MIN_CLIP), max: E.attributes.getFloat("max", p.MAX_CLIP) }), u.clipV11 = (E, F) => {
          const W = M(E, F);
          return (0, u.clip)(E, [F[0]], W);
        };
        const M = (E, F) => {
          if (F.length >= 3 && (!E.session.isInitializer(F[1].dataId) || !E.session.isInitializer(F[2].dataId))) throw new Error("dynamic clip attributes are not allowed");
          const W = F.length >= 3 ? F[1].numberData[0] : p.MIN_CLIP, q = F.length >= 3 ? F[2].numberData[0] : p.MAX_CLIP;
          return (0, h.createAttributeWithCacheKey)({ min: W, max: q });
        };
        u.ceil = (E, F) => [E.run(A(E, F[0], e()), F)], u.cos = (E, F) => [E.run(A(E, F[0], n()), F)], u.elu = (E, F, W) => [E.run(A(E, F[0], r(W.alpha), W.cacheKey), F)], u.parseEluAttributes = (E) => (0, h.createAttributeWithCacheKey)({ alpha: E.attributes.getFloat("alpha", 1) }), u.exp = (E, F) => [E.run(A(E, F[0], a()), F)], u.floor = (E, F) => [E.run(A(E, F[0], l()), F)], u.identity = (E, F) => [E.run(A(E, F[0], m()), F)], u.leakyRelu = (E, F, W) => [E.run(A(E, F[0], y(W.alpha), W.cacheKey), F)], u.parseLeakyReluAttributes = (E) => (0, h.createAttributeWithCacheKey)({ alpha: E.attributes.getFloat("alpha", 0.01) }), u.log = (E, F) => [E.run(A(E, F[0], _()), F)], u.neg = (E, F) => [E.run(A(E, F[0], v()), F)], u.not = (E, F) => [E.run(A(E, F[0], S()), F)], u.relu = (E, F) => [E.run(A(E, F[0], I()), F)], u.sigmoid = (E, F) => [E.run(A(E, F[0], w()), F)], u.sin = (E, F) => [E.run(A(E, F[0], O()), F)], u.sqrt = (E, F) => [E.run(A(E, F[0], C()), F)], u.tan = (E, F) => [E.run(A(E, F[0], V()), F)], u.tanh = (E, F) => [E.run(A(E, F[0], G()), F)];
      }, 5611: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createUnpackProgramInfoLoader = u.createUnpackProgramInfo = void 0;
        const h = b(5060), p = b(2039), g = b(9390), o = b(2827), c = { name: "unpack", inputNames: ["A"], inputTypes: [p.TextureType.packed] };
        u.createUnpackProgramInfo = (f, s) => {
          const i = s.dims.length, t = (0, o.getChannels)("rc", i), e = t.slice(-2), n = (0, g.getCoordsDataType)(i), r = (0, o.unpackFromChannel)(), a = s.dims.length === 0 ? "" : function(m, y) {
            if (m === 1) return "rc";
            let _ = "";
            for (let v = 0; v < m; v++) _ += y[v], v < m - 1 && (_ += ",");
            return _;
          }(i, t), l = i <= 1 ? "rc" : `vec2(${e.join(",")})`, d = `
    ${r}
    void main() {
      ${n} rc = getOutputCoords();

       // Sample the texture with the coords to get the rgba channel value.
       vec4 packedInput = getA(${a});

       ${(0, h.getGlsl)(f.session.backend.glContext.version).output} = vec4(getChannel(packedInput, ${l}), 0, 0, 0);
     }
   `;
          return Object.assign(Object.assign({}, c), { hasMain: !0, output: { dims: s.dims, type: s.type, textureType: p.TextureType.unpacked }, shaderSource: d });
        }, u.createUnpackProgramInfoLoader = (f, s) => Object.assign(Object.assign({}, c), { get: () => (0, u.createUnpackProgramInfo)(f, s) });
      }, 8428: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.parseUnsqueezeAttributes = u.unsqueezeV13 = u.unsqueeze = void 0;
        const h = b(2517);
        u.unsqueeze = (o, c, f) => {
          p(c);
          const s = h.ShapeUtil.unsqueezeShape(c[0].dims, f);
          return [o.reshapeUnpacked(c[0], s)];
        }, u.unsqueezeV13 = (o, c) => (g(c), (0, u.unsqueeze)(o, [c[0]], Array.from(c[1].integerData))), u.parseUnsqueezeAttributes = (o) => o.attributes.getInts("axes");
        const p = (o) => {
          if (!o || o.length !== 1) throw new Error("Unsqueeze requires 1 input.");
          if (o[0].type === "string") throw new Error("invalid input tensor types.");
        }, g = (o) => {
          if (!o || o.length !== 2) throw new Error("Unsqueeze requires 2 inputs.");
          if (o[1].type !== "int32") throw new Error("Invalid input type.");
        };
      }, 9793: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.scalesValidation = u.validateInputs = u.parseUpsampleAttributes = u.parseUpsampleAttributesV9 = u.parseUpsampleAttributesV7 = u.upsample = void 0;
        const h = b(246), p = b(5060), g = b(2039), o = { name: "Upsample", inputNames: ["X"], inputTypes: [g.TextureType.unpacked] };
        u.upsample = (f, s, i) => ((0, u.validateInputs)(s, i), [f.run(Object.assign(Object.assign({}, o), { cacheHint: i.cacheKey, get: () => c(f, s, i) }), s)]), u.parseUpsampleAttributesV7 = (f) => (0, u.parseUpsampleAttributes)(f, 7), u.parseUpsampleAttributesV9 = (f) => (0, u.parseUpsampleAttributes)(f, 9), u.parseUpsampleAttributes = (f, s) => {
          const i = s >= 10, t = f.attributes.getString("mode", "nearest");
          if (t !== "nearest" && t !== "linear" && (s < 11 || t !== "cubic")) throw new Error(`unrecognized mode: ${t}`);
          let e = [];
          s < 9 && (e = f.attributes.getFloats("scales"), (0, u.scalesValidation)(e, t, i));
          const n = f.attributes.getFloat("extrapolation_value", 0), r = s > 10 ? f.attributes.getString("coordinate_transformation_mode", "half_pixel") : "asymmetric";
          if (["asymmetric", "pytorch_half_pixel", "tf_half_pixel_for_nn", "align_corners", "tf_crop_and_resize", "half_pixel"].indexOf(r) === -1) throw new Error(`coordinate_transform_mode '${r}' is not supported`);
          const a = r === "tf_crop_and_resize", l = a, d = t === "nearest" && s >= 11 ? f.attributes.getString("nearest_mode", "round_prefer_floor") : "";
          if (["round_prefer_floor", "round_prefer_ceil", "floor", "ceil", ""].indexOf(d) === -1) throw new Error(`nearest_mode '${d}' is not supported`);
          const m = f.attributes.getFloat("cubic_coeff_a", -0.75), y = f.attributes.getInt("exclude_outside", 0) !== 0;
          if (y && t !== "cubic") throw new Error("exclude_outside can be set to 1 only when mode is CUBIC.");
          const _ = s < 11 || t === "nearest" && r === "asymmetric" && d === "floor";
          let v = 0, S = 0, O = 0;
          return s > 10 ? f.inputs.length > 2 ? (v = 1, S = 2, O = 3) : (S = 1, O = 2) : s === 9 && (S = 1), (0, h.createAttributeWithCacheKey)({ opset: s, isResize: i, mode: t, scales: e, extrapolationValue: n, coordinateTransformMode: r, useExtrapolation: l, needRoiInput: a, nearestMode: d, cubicCoefficientA: m, excludeOutside: y, useNearest2xOptimization: _, roiInputIdx: v, scalesInputIdx: S, sizesInputIdx: O });
        };
        const c = (f, s, i) => {
          const t = (0, p.getGlsl)(f.session.backend.glContext.version), [e, n] = f.calculateTextureWidthAndHeight(s[0].dims, g.TextureType.unpacked), r = s[0].dims.map((O, I) => Math.floor(O * i.scales[I])), [a, l] = f.calculateTextureWidthAndHeight(r, g.TextureType.unpacked), d = r.length, m = new Array(d), y = new Array(d);
          let _ = `
      int output_pitches[${d}];
      int input_pitches[${d}];
      `;
          for (let O = d - 1; O >= 0; O--) m[O] = O === d - 1 ? 1 : m[O + 1] * r[O + 1], y[O] = O === d - 1 ? 1 : y[O + 1] * s[0].dims[O + 1], _ += `
        output_pitches[${O}] = ${m[O]};
        input_pitches[${O}] = ${y[O]};
        `;
          const v = `
      float getInputFloat(int index) {
        vec2 coords = offsetToCoords(index, ${e}, ${n});
        float value = getColorAsFloat(${t.texture2D}(X, coords));
        return value;
      }
      `, S = i.mode === "nearest" ? `
    ${v}
    float process(int indices[${d}]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${a}, ${l});

      ${_}

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
    ${v}
    float process(int indices[4]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${a}, ${l});

      ${_}

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
      if (index_of_input_dim2 == (${s[0].dims[2]} - 1)) {
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
    ${v}
    float process(int indices[2]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${a}, ${l});

      ${_}

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
      if (index_of_input_dim0 == (${s[0].dims[0]} - 1)) {
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
          return Object.assign(Object.assign({}, o), { output: { dims: r, type: s[0].type, textureType: g.TextureType.unpacked }, shaderSource: S, variables: [{ name: "scales", type: "int", arrayLength: i.scales.length, data: i.scales.map((O) => Math.ceil(O)) }] });
        };
        u.validateInputs = (f, s) => {
          if (!f || s.opset < 9 && f.length !== 1 || s.opset >= 9 && s.opset < 11 && f.length !== 2 || s.opset >= 11 && f.length < 2) throw new Error("invalid inputs.");
          if (s.scales.length > 0 && f[0].dims.length !== s.scales.length) throw new Error("Invalid input shape.");
          if (f[0].type === "string") throw new Error("Invalid input tensor types.");
        }, u.scalesValidation = (f, s, i) => {
          if (i) {
            for (const t of f) if (t <= 0) throw new Error("Scale value should be greater than 0.");
          } else for (const t of f) if (t < 1) throw new Error("Scale value should be greater than or equal to 1.");
          if (!(s !== "linear" && s !== "cubic" || f.length === 2 || f.length === 4 && f[0] === 1 && f[1] === 1)) throw new Error(`'Linear' mode and 'Cubic' mode only support 2-D inputs ('Bilinear', 'Bicubic')         or 4-D inputs with the corresponding outermost 2 scale values being 1         in the ${i ? "Resize" : "Upsample"} opeartor.`);
        };
      }, 1958: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.ProgramManager = void 0;
        const h = b(1670), p = b(6231), g = b(8879), o = b(5060);
        u.ProgramManager = class {
          constructor(c, f, s) {
            this.profiler = c, this.glContext = f, this.textureLayoutStrategy = s, this.repo = /* @__PURE__ */ new Map(), this.attributesBound = !1;
          }
          getArtifact(c) {
            return this.repo.get(c);
          }
          setArtifact(c, f) {
            this.repo.set(c, f);
          }
          run(c, f, s) {
            var i;
            this.profiler.event("op", `ProgramManager.run ${(i = c.programInfo.name) !== null && i !== void 0 ? i : "unknown kernel"}`, () => {
              var t;
              const e = this.glContext.gl, n = c.program;
              e.useProgram(n);
              try {
                this.bindOutput(s), this.attributesBound || this.bindAttributes(c.attribLocations), this.bindUniforms(c.uniformLocations, (t = c.programInfo.variables) !== null && t !== void 0 ? t : [], f);
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
          build(c, f, s) {
            return this.profiler.event("backend", "ProgramManager.build", () => {
              const i = new g.GlslPreprocessor(this.glContext, c, f, s), t = i.preprocess(), e = this.compile(t);
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
            const f = this.glContext.compileShader(c, this.glContext.gl.FRAGMENT_SHADER), s = this.glContext.createProgram(this.vertexShader, f);
            return this.glContext.deleteShader(f), s;
          }
          bindOutput(c) {
            const f = c.width, s = c.height;
            p.Logger.verbose("ProrgramManager", `Binding output texture to Framebuffer: w/h=${f}/${s}, shape=${c.shape}, type=${c.tensor.type}`), this.glContext.attachFramebuffer(c.texture, f, s);
          }
          bindAttributes(c) {
            const f = c.position, s = c.textureCoord;
            this.glContext.setVertexAttributes(f, s), this.attributesBound = !0;
          }
          bindUniforms(c, f, s) {
            var i;
            const t = this.glContext.gl;
            let e = 0;
            for (const { name: n, type: r, location: a, arrayLength: l } of c) {
              const d = (i = f.find((m) => m.name === n)) === null || i === void 0 ? void 0 : i.data;
              if (r !== "sampler2D" && !d) throw new Error(`variable '${n}' does not have data defined in program info`);
              switch (r) {
                case "sampler2D":
                  this.bindTexture(s[e], a, e), e++;
                  break;
                case "float":
                  l ? t.uniform1fv(a, d) : t.uniform1f(a, d);
                  break;
                case "int":
                  l ? t.uniform1iv(a, d) : t.uniform1i(a, d);
                  break;
                default:
                  throw new Error(`Uniform not implemented: ${r}`);
              }
            }
          }
          bindTexture(c, f, s) {
            this.glContext.bindTextureToUniform(c.texture, s, f);
          }
          getAttribLocations(c) {
            return { position: this.getAttribLocation(c, "position"), textureCoord: this.getAttribLocation(c, "textureCoord") };
          }
          getUniformLocations(c, f, s) {
            const i = [];
            if (f) for (const t of f) i.push({ name: t, type: "sampler2D", location: this.getUniformLocation(c, t) });
            if (s) for (const t of s) i.push(Object.assign(Object.assign({}, t), { location: this.getUniformLocation(c, t.name) }));
            return i;
          }
          getUniformLocation(c, f) {
            const s = this.glContext.gl.getUniformLocation(c, f);
            if (s === null) throw new Error(`Uniform ${f} not found.`);
            return s;
          }
          getAttribLocation(c, f) {
            return this.glContext.gl.getAttribLocation(c, f);
          }
        };
      }, 6416: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.WebGLSessionHandler = void 0;
        const h = b(6231), p = b(1047), g = b(8316), o = b(1640), c = b(1958), f = b(7859), s = b(5702);
        u.WebGLSessionHandler = class {
          constructor(i, t) {
            this.backend = i, this.context = t, this.layoutStrategy = new f.PreferLogicalStrategy(i.glContext.maxTextureSize), this.programManager = new c.ProgramManager(this.context.profiler, i.glContext, this.layoutStrategy), this.textureManager = new s.TextureManager(i.glContext, this.layoutStrategy, this.context.profiler, { reuseTextures: i.textureCacheMode === "full" }), this.packedTextureDataCache = /* @__PURE__ */ new Map(), this.unpackedTextureDataCache = /* @__PURE__ */ new Map(), this.pack = i.pack, this.pack2unpackMap = /* @__PURE__ */ new Map(), this.unpack2packMap = /* @__PURE__ */ new Map();
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
      }, 7769: (R, u, b) => {
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
            return p.constructor !== Float32Array && (h.Logger.warning("Encoder", "data was not of type Float32; creating new Float32Array"), c = new Float32Array(p)), g * this.channelSize > p.length ? (h.Logger.warning("Encoder", "Source data too small. Allocating larger array"), c = p, o = this.allocate(g * this.channelSize), c.forEach((f, s) => o[s] = f)) : (c = p, o = c), o;
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
      }, 7859: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.getBatchDim = u.sizeToSquarishShape = u.getRowsCols = u.sizeFromShape = u.isInt = u.parseAxisParam = u.squeezeShape = u.PreferLogicalStrategy = u.AlwaysKeepOriginalSizeStrategy = void 0;
        const h = b(6231), p = b(2517);
        function g(i, t) {
          const e = [], n = [], r = t != null && Array.isArray(t) && t.length === 0, a = t == null || r ? null : o(t, i).sort();
          let l = 0;
          for (let d = 0; d < i.length; ++d) {
            if (a != null) {
              if (a[l] === d && i[d] !== 1) throw new Error(`Can't squeeze axis ${d} since its dim '${i[d]}' is not 1`);
              (a[l] == null || a[l] > d) && i[d] === 1 && (e.push(i[d]), n.push(d)), a[l] <= d && l++;
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
        function s(i) {
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
              const a = t.breakAxis >= i.length ? 1 : i.slice(t.breakAxis).reduce((d, m) => d * m), l = t.breakAxis <= 0 ? 1 : i.slice(0, t.breakAxis).reduce((d, m) => d * m);
              if (!(a > e || l > e)) return [a, l];
              h.Logger.verbose("TextureLayout", `Given width/height preferences were unattainable: shape:${i}, breakAxis:${t.breakAxis}`);
            }
            const n = i.reduce((a, l) => a * l);
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
            const a = f(r);
            return r.length <= 1 && a <= n ? [1, a] : r.length === 2 && r[0] <= n && r[1] <= n ? r : r.length === 3 && r[0] * r[1] <= n && r[2] <= n ? [r[0] * r[1], r[2]] : r.length === 3 && r[0] <= n && r[1] * r[2] <= n ? [r[0], r[1] * r[2]] : r.length === 4 && r[0] * r[1] * r[2] <= n && r[3] <= n ? [r[0] * r[1] * r[2], r[3]] : r.length === 4 && r[0] <= n && r[1] * r[2] * r[3] <= n ? [r[0], r[1] * r[2] * r[3]] : e ? s(a / 4).map((l) => 2 * l) : s(a);
          }
        }, u.squeezeShape = g, u.parseAxisParam = o, u.isInt = c, u.sizeFromShape = f, u.getRowsCols = function(i) {
          if (i.length === 0) throw Error("Cannot get rows and columns of an empty shape array.");
          return [i.length > 1 ? i[i.length - 2] : 1, i[i.length - 1]];
        }, u.sizeToSquarishShape = s, u.getBatchDim = function(i, t = 2) {
          return f(i.slice(0, i.length - t));
        };
      }, 4057: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.createTextureLayoutFromShape = u.calculateTextureWidthAndHeight = u.createTextureLayoutFromTextureType = void 0;
        const h = b(2517), p = b(2039);
        u.createTextureLayoutFromTextureType = (g, o, c) => {
          const f = c === p.TextureType.unpacked || c === p.TextureType.unpackedReversed ? 1 : 4, s = c === p.TextureType.packed, i = c === p.TextureType.unpackedReversed || c === p.TextureType.packed, t = c === p.TextureType.packedLastDimension ? o.length - 1 : void 0, e = c === p.TextureType.packedLastDimension ? o.map((n, r) => r === o.length - 1 ? 4 * n : n) : void 0;
          return (0, u.createTextureLayoutFromShape)(g, o, f, e, { isPacked: s, reverseWH: i, breakAxis: t });
        }, u.calculateTextureWidthAndHeight = (g, o, c) => {
          const f = (0, u.createTextureLayoutFromTextureType)(g, o, c);
          return [f.width, f.height];
        }, u.createTextureLayoutFromShape = (g, o, c = 1, f, s) => {
          const i = !(!s || !s.isPacked), [t, e] = g.computeTextureWH(i && f || o, s), n = o.length;
          let r = o.slice(0);
          if (n === 0 && (r = [1]), c === 1) f = o;
          else if (i) {
            if (c !== 4) throw new Error("a packed texture must be 4-channel");
            f = o, n > 0 && (r[n - 1] = Math.ceil(r[n - 1] / 2)), n > 1 && (r[n - 2] = Math.ceil(r[n - 2] / 2));
          } else if (!f) throw new Error("Unpacked shape is needed when using channels > 1");
          return { width: t, height: e, channels: c, isPacked: i, shape: r, strides: h.ShapeUtil.computeStrides(r), unpackedShape: f, reversedWH: s && s.reverseWH };
        };
      }, 5702: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.TextureManager = void 0;
        const h = b(6231);
        u.TextureManager = class {
          constructor(p, g, o, c) {
            this.glContext = p, this.layoutStrategy = g, this.profiler = o, this.config = c, this.pendingRead = /* @__PURE__ */ new Map(), c.reuseTextures && (this.inUseTextures = /* @__PURE__ */ new Map(), this.idleTextures = /* @__PURE__ */ new Map(), this.textureLookup = /* @__PURE__ */ new Map());
          }
          createTextureFromLayout(p, g, o, c) {
            const f = this.toEncoderType(p), s = this.glContext.getEncoder(f, g.channels || 1, c);
            if (g.isPacked && c === 1) throw new Error("not implemented");
            const i = g.width, t = g.height;
            let e, n;
            if (this.config.reuseTextures) {
              e = `${i}x${t}_${s.format}_${s.internalFormat}_${s.textureType}`, n = this.inUseTextures.get(e), n || (n = [], this.inUseTextures.set(e, n));
              const a = this.idleTextures.get(e);
              if (a && a.length > 0) {
                const l = a.pop();
                return n.push(l), c === 1 && this.glContext.updateTexture(l, i, t, s, this.toTextureData(p, o)), l;
              }
            }
            h.Logger.verbose("TextureManager", `Creating new texture of size ${g.width}x${g.height}`);
            const r = this.glContext.allocateTexture(i, t, s, this.toTextureData(p, o));
            return this.config.reuseTextures && (n.push(r), this.textureLookup.set(r, e)), r;
          }
          readTexture(p, g, o) {
            return o || (o = 1), this.profiler.event("backend", "TextureManager.readTexture", () => {
              const c = p.shape.reduce((s, i) => s * i) * o, f = this.glContext.readTexture(p.texture, p.width, p.height, c, this.toEncoderType(g), o);
              return this.toTensorData(g, f);
            });
          }
          async readTextureAsync(p, g, o) {
            const c = p.tensor.dataId;
            if (o || (o = 1), this.pendingRead.has(c)) {
              const f = this.pendingRead.get(c);
              return new Promise((s) => f == null ? void 0 : f.push(s));
            }
            return this.profiler.event("backend", "TextureManager.readTextureAsync", async () => {
              this.pendingRead.set(c, []);
              const f = p.shape.reduce((e, n) => e * n) * o;
              await this.glContext.createAndWaitForFence();
              const s = this.glContext.readTexture(p.texture, p.width, p.height, f, this.toEncoderType(g), o), i = this.toTensorData(g, s), t = this.pendingRead.get(c);
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
                  let s = this.idleTextures.get(o);
                  s || (s = [], this.idleTextures.set(o, s)), s.push(p.texture);
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
      }, 2039: (R, u) => {
        var b;
        Object.defineProperty(u, "__esModule", { value: !0 }), u.TextureType = void 0, (b = u.TextureType || (u.TextureType = {}))[b.unpacked = 0] = "unpacked", b[b.unpackedReversed = 1] = "unpackedReversed", b[b.packed = 2] = "packed", b[b.downloadUint8AsFloat = 3] = "downloadUint8AsFloat", b[b.packedLastDimension = 4] = "packedLastDimension";
      }, 9390: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.getGlChannels = u.getCoordsDataType = u.getSqueezedParams = u.squeezeInputShape = u.generateShaderFuncNameFromInputSamplerNameAtOutCoords = u.generateShaderFuncNameFromInputSamplerName = u.repeatedTry = u.getPackedShape = void 0;
        const h = b(2517);
        u.getPackedShape = function(p) {
          const g = p.length;
          return p.slice(0, g - 1).concat(p[g - 1] / 4);
        }, u.repeatedTry = async function(p, g = (c) => 0, o) {
          return new Promise((c, f) => {
            let s = 0;
            const i = () => {
              if (p()) return void c();
              s++;
              const t = g(s);
              o != null && s >= o ? f() : setTimeout(i, t);
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
      }, 7305: (R, u, b) => {
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
          let s;
          const i = { alpha: !1, depth: !1, antialias: !1, stencil: !1, preserveDrawingBuffer: !1, premultipliedAlpha: !1, failIfMajorPerformanceCaveat: !1 };
          if ((!c || c === "webgl2") && (s = f.getContext("webgl2", i), s)) try {
            return new p.WebGLContext(s, 2);
          } catch (t) {
            h.Logger.warning("GlContextFactory", `failed to create WebGLContext using contextId 'webgl2'. Error: ${t}`);
          }
          if ((!c || c === "webgl") && (s = f.getContext("webgl", i) || f.getContext("experimental-webgl", i), s)) try {
            return new p.WebGLContext(s, 1);
          } catch (t) {
            h.Logger.warning("GlContextFactory", `failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: ${t}`);
          }
          throw new Error("WebGL is not supported");
        }
        u.createWebGLContext = function c(f) {
          let s;
          f && f !== "webgl2" || !("webgl2" in g) ? f && f !== "webgl" || !("webgl" in g) || (s = g.webgl) : s = g.webgl2, s = s || o(f), f = f || s.version === 1 ? "webgl" : "webgl2";
          const i = s.gl;
          return g[f] = s, i.isContextLost() ? (delete g[f], c(f)) : (i.disable(i.DEPTH_TEST), i.disable(i.STENCIL_TEST), i.disable(i.BLEND), i.disable(i.DITHER), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SAMPLE_COVERAGE), i.enable(i.SCISSOR_TEST), i.enable(i.CULL_FACE), i.cullFace(i.BACK), s);
        }, u.createNewWebGLContext = o;
      }, 1713: function(R, u, b) {
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
        function s(i) {
          let t = 0;
          for (; t < i.length && i[t](); ++t) ;
          return t - 1;
        }
        u.linearSearchLastTrue = s, u.WebGLContext = class {
          constructor(i, t) {
            this.frameBufferBound = !1, this.itemsToPoll = [], this.gl = i, this.version = t, this.getExtensions(), this.vertexbuffer = this.createVertexbuffer(), this.framebuffer = this.createFramebuffer(), this.queryVitalParameters();
          }
          allocateTexture(i, t, e, n) {
            const r = this.gl, a = r.createTexture();
            r.bindTexture(r.TEXTURE_2D, a), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE);
            const l = n ? e.encode(n, i * t) : null;
            return r.texImage2D(r.TEXTURE_2D, 0, e.internalFormat, i, t, 0, e.format, e.textureType, l), this.checkError(), a;
          }
          updateTexture(i, t, e, n, r) {
            const a = this.gl;
            a.bindTexture(a.TEXTURE_2D, i);
            const l = n.encode(r, t * e);
            a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, t, e, n.format, n.textureType, l), this.checkError();
          }
          attachFramebuffer(i, t, e) {
            const n = this.gl;
            n.bindTexture(n.TEXTURE_2D, i), n.bindFramebuffer(n.FRAMEBUFFER, this.framebuffer), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, i, 0), this.checkError(), n.viewport(0, 0, t, e), n.scissor(0, 0, t, e);
          }
          readTexture(i, t, e, n, r, a) {
            const l = this.gl;
            a || (a = 1), this.frameBufferBound || this.attachFramebuffer(i, t, e);
            const d = this.getEncoder(r, a), m = d.allocate(t * e);
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
            let t, e, n, r, a;
            try {
              t = i.createTexture(), e = i.createFramebuffer(), i.bindTexture(i.TEXTURE_2D, t);
              const l = this.version === 2 ? i.RGBA32F : i.RGBA;
              return i.texImage2D(i.TEXTURE_2D, 0, l, 1, 1, 0, i.RGBA, i.FLOAT, null), i.bindFramebuffer(i.FRAMEBUFFER, e), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, t, 0), i.enable(i.BLEND), n = i.createShader(i.VERTEX_SHADER), !!n && (i.shaderSource(n, "void main(){}"), i.compileShader(n), r = i.createShader(i.FRAGMENT_SHADER), !!r && (i.shaderSource(r, "precision highp float;void main(){gl_FragColor=vec4(0.5);}"), i.compileShader(r), a = i.createProgram(), !!a && (i.attachShader(a, n), i.attachShader(a, r), i.linkProgram(a), i.useProgram(a), i.drawArrays(i.POINTS, 0, 1), i.getError() === i.NO_ERROR)));
            } finally {
              i.disable(i.BLEND), a && i.deleteProgram(a), n && i.deleteShader(n), r && i.deleteShader(r), e && (i.bindFramebuffer(i.FRAMEBUFFER, null), i.deleteFramebuffer(e)), t && (i.bindTexture(i.TEXTURE_2D, null), i.deleteTexture(t));
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
            const i = s(this.itemsToPoll.map((t) => t.isDoneFn));
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
      }, 1036: (R, u, b) => {
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
                let s = !0;
                for (const i of c.node.inputs) if (!this._values[i] && this.graph.getInputIndices().indexOf(i) === -1) {
                  s = !1;
                  break;
                }
                s && this._starter.push(f);
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
              o.forEach((r, a) => {
                const l = f[a];
                this._values[l] = r;
              });
              const s = this._starter.slice(0), i = this.graph.getValues(), t = this.graph.getNodes();
              let e = 0;
              for (; e < s.length; ) {
                const r = s[e++], a = this._ops[r], l = a.node.inputs.map((_) => this._values[_]);
                if (l.indexOf(void 0) !== -1) throw new Error(`unresolved input detected: op: ${a.node}`);
                const d = l;
                h.Logger.verbose("ExecPlan", `Runing op:${a.node.name} (${d.map((_, v) => `'${a.node.inputs[v]}': ${_.type}[${_.dims.join(",")}]`).join(", ")})`);
                const m = await this.profiler.event("node", a.node.name, async () => a.op.impl(c, d, a.op.context));
                if (m.length !== a.node.outputs.length) throw new Error("the size of output does not match model definition.");
                m.forEach((_, v) => {
                  const S = a.node.outputs[v];
                  if (this._values[S]) throw new Error(`output [${S}] already has value: op:${a.node.name}`);
                  this._values[S] = _;
                });
                const y = /* @__PURE__ */ new Set();
                m.forEach((_, v) => {
                  const S = a.node.outputs[v];
                  for (const O of i[S].to) {
                    const I = t[O];
                    let w = !0;
                    for (const C of I.inputs) if (!this._values[C]) {
                      w = !1;
                      break;
                    }
                    w && y.add(O);
                  }
                }), s.push(...y);
              }
              const n = [];
              for (let r = 0; r < this.graph.getOutputIndices().length; r++) {
                const a = this.graph.getOutputIndices()[r], l = this._values[a];
                if (l === void 0) throw new Error(`required output [${a}] does not have value`);
                a === 0 ? await l.getData() : l.data, n.push(l);
              }
              return h.Logger.verbose("ExecPlan", "disposing of inferenceHandler"), c.dispose(), n;
            });
          }
        };
      }, 7070: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Graph = void 0;
        const h = b(1446), p = b(7778), g = b(9395), o = b(9162), c = b(2517);
        var f = g.onnxruntime.experimental.fbs;
        u.Graph = { from: (e, n) => new t(e, n) };
        class s {
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
            const a = /* @__PURE__ */ new Map();
            if (!n.input) throw new Error("missing information in graph: input");
            const l = [];
            for (const d of n.input) {
              if (r.has(d.name)) throw new Error(`duplicated input name: ${d.name}`);
              const m = this._allData.push(new s(d)) - 1;
              r.set(d.name, m), l.push(d.name);
            }
            if (!n.initializer) throw new Error("missing information in graph: initializer");
            for (const d of n.initializer) {
              let m = r.get(d.name);
              if (m === void 0) {
                const y = new s();
                y.type = { shape: { dims: c.ProtoUtil.tensorDimsFromProto(d.dims) }, tensorType: c.ProtoUtil.tensorDataTypeFromProto(d.dataType) }, m = this._allData.push(y) - 1, r.set(d.name, m);
              }
              this._allData[m]._from = -1, this._allData[m].tensor = o.Tensor.fromProto(d);
            }
            for (let d = 0; d < this._allData.length; d++) this._allData[d].tensor || (this._allInputIndices.push(d), this._allInputNames.push(l[d]));
            if (!n.output) throw new Error("missing information in graph: output");
            for (const d of n.output) {
              if (r.has(d.name)) throw new Error(`duplicated output name: ${d.name}`);
              const m = this._allData.push(new s(d)) - 1;
              r.set(d.name, m), this._allOutputIndices.push(m), this._allOutputNames.push(d.name);
            }
            if (!n.node) throw new Error("missing information in graph: node");
            for (const d of n.node) {
              if (!d.name) for (let y = 0; ; y++) {
                const _ = `unnamed_${d.opType}_${y}`;
                if (!a.has(_)) {
                  d.name = _;
                  break;
                }
              }
              if (a.has(d.name)) throw new Error(`duplicated node name: ${d.name}`);
              const m = this._nodes.push(new i(d)) - 1;
              a.set(d.name, m);
            }
            for (let d = 0; d < this._nodes.length; d++) {
              const m = this._nodes[d], y = n.node[d];
              if (!y.output) throw new Error(`missing output for node: ${y.name}`);
              for (const _ of y.output) {
                let v = r.get(_);
                if (v === void 0 && (v = this._allData.push(new s()) - 1, r.set(_, v)), m.outputs.push(v), this._allData[v]._from !== void 0) throw new Error(`multiple nodes output to one data value: ${v}`);
                if (this._allData[v]._from = d, y.opType === "Constant") {
                  if (!y.attribute || y.attribute.length !== 1 || !y.attribute[0].t) throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");
                  if (!y.output || y.output.length !== 1) throw new Error("missing output or incorrect number of outputs for this Constant operator");
                  m.outputs.pop(), m.executeNode = !1, this._allData[v]._from = -1, this._allData[v].tensor = o.Tensor.fromProto(y.attribute[0].t);
                }
              }
            }
            for (let d = 0; d < this._nodes.length; d++) {
              const m = this._nodes[d], y = n.node[d];
              if (!y.input) throw new Error(`missing input for node: ${y.name}`);
              for (const _ of y.input) {
                const v = r.get(_);
                if (v === void 0) {
                  if (_ === "" && y.input.length === 3 && y.opType === "Resize") continue;
                  throw new Error(`unrecognized input '${_}' for node: ${y.name}`);
                }
                m.inputs.push(v), this._allData[v]._to.push(d);
              }
            }
            return !0;
          }
          buildGraphFromOrtFormat(n) {
            var r, a, l;
            const d = /* @__PURE__ */ new Map();
            this._allData = [], this._allInputIndices = [], this._allInputNames = [], this._allOutputIndices = [], this._allOutputNames = [], this._nodes = [];
            const m = /* @__PURE__ */ new Map(), y = [];
            for (let _ = 0; _ < n.inputsLength(); _++) {
              const v = n.inputs(_);
              if (d.has(v)) throw new Error(`duplicated input name: ${v}`);
              for (let S = 0; S < n.nodeArgsLength(); S++) if (((r = n.nodeArgs(S)) === null || r === void 0 ? void 0 : r.name()) === v) {
                const O = new s();
                if (((l = (a = n.nodeArgs(S)) === null || a === void 0 ? void 0 : a.type()) === null || l === void 0 ? void 0 : l.valueType()) !== f.TypeInfoValue.tensor_type) throw new Error("Unexpected value type for the nodeArg.");
                const I = n.nodeArgs(S).type().value(new f.TensorTypeAndShape()), w = c.ProtoUtil.tensorDataTypeFromProto(I.elemType()), C = I.shape(), V = [];
                for (let D = 0; D < C.dimLength(); D++) V.push(c.LongUtil.longToNumber(C.dim(D).value().dimValue()));
                O.type = { shape: { dims: V }, tensorType: w };
                const G = this._allData.push(O) - 1;
                d.set(v, G), y.push(v);
              }
            }
            for (let _ = 0; _ < n.initializersLength(); _++) {
              const v = n.initializers(_);
              let S = d.get(v.name());
              if (S === void 0) {
                const O = new s(), I = c.ProtoUtil.tensorDimsFromORTFormat(v), w = c.ProtoUtil.tensorDataTypeFromProto(v.dataType());
                O.type = { shape: { dims: I }, tensorType: w }, S = this._allData.push(O) - 1, d.set(v.name(), S);
              }
              this._allData[S]._from = -1, this._allData[S].tensor = o.Tensor.fromOrtTensor(v);
            }
            for (let _ = 0; _ < this._allData.length; _++) this._allData[_].tensor || (this._allInputIndices.push(_), this._allInputNames.push(y[_]));
            for (let _ = 0; _ < n.outputsLength(); _++) {
              const v = n.outputs(_);
              if (d.has(v)) throw new Error(`duplicated output name: ${v}`);
              const S = this._allData.push(new s()) - 1;
              d.set(v, S), this._allOutputIndices.push(S), this._allOutputNames.push(v);
            }
            if (!n.nodes) throw new Error("missing information in graph: node");
            for (let _ = 0; _ < n.nodesLength(); _++) {
              const v = n.nodes(_);
              let S = v.name();
              if (!S) for (let I = 0; S = `unnamed_${v.opType()}_${I}`, m.has(S); I++) ;
              if (m.has(S)) throw new Error(`duplicated node name: ${S}`);
              const O = this._nodes.push(new i(v, S)) - 1;
              m.set(S, O);
            }
            for (let _ = 0; _ < this._nodes.length; _++) {
              const v = this._nodes[_], S = n.nodes(_);
              if (S == null) throw new Error(`No node exists at index ${_}`);
              if ((S == null ? void 0 : S.outputsLength()) === 0) throw new Error(`missing output for node: ${S.name}`);
              for (let O = 0; O < (S == null ? void 0 : S.outputsLength()); O++) {
                const I = S == null ? void 0 : S.outputs(O);
                let w = d.get(I);
                if (w === void 0 && (w = this._allData.push(new s()) - 1, d.set(I, w)), v.outputs.push(w), this._allData[w]._from !== void 0) throw new Error(`multiple nodes output to one data value: ${w}`);
                if (this._allData[w]._from = _, S.opType() === "Constant") {
                  if (S.attributesLength() !== 1 || !S.attributes(0).t()) throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");
                  if (S.outputsLength() !== 1) throw new Error("missing output or incorrect number of outputs for this Constant operator");
                  v.outputs.pop(), v.executeNode = !1, this._allData[w]._from = -1, this._allData[w].tensor = o.Tensor.fromOrtTensor(S.attributes(0).t());
                }
              }
            }
            for (let _ = 0; _ < this._nodes.length; _++) {
              const v = this._nodes[_], S = n.nodes(_);
              if (S.inputsLength() === 0) throw new Error(`missing input for node: ${S.name}`);
              for (let O = 0; O < S.inputsLength(); O++) {
                const I = S.inputs(O), w = d.get(I);
                if (w === void 0) throw new Error(`unrecognized input '${I}' for node: ${S.name()}`);
                v.inputs.push(w), this._allData[w]._to.push(_);
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
            const r = Array.from(n), a = new Array(this._nodes.length).fill("white");
            for (; r.length > 0; ) {
              const l = r.pop();
              a[l] === "gray" ? a[l] = "black" : (r.push(l), a[l] = "gray", this._nodes[l].outputs.forEach((d) => {
                const m = this._allData[d];
                if (m.tensor !== void 0) throw new Error("node outputs should not be initialized");
                if (m._from !== l) throw new Error("from property of the Value object doesn't match index of Node being processed");
                m._to.forEach((y) => {
                  if (a[y] === "gray") throw new Error("model graph is cyclic");
                  a[y] === "white" && r.push(y);
                });
              }));
            }
          }
          transformGraph(n) {
            this.removeAllIdentityNodes(), this.removeAllDropoutNodes(), this.fuseConvActivationNodes(), n && n.transformGraph(this), this.finalizeGraph();
          }
          finalizeGraph() {
            let n = 0;
            for (let r = 0; r < this._nodes.length; r++) this._nodes[r].executeNode ? n > 0 && (this._nodes[r].inputs.forEach((a) => {
              const l = this._allData[a]._to.indexOf(r + n);
              l !== -1 && (this._allData[a]._to[l] = r);
            }), this._nodes[r].outputs.forEach((a) => {
              this._allData[a]._from && this._allData[a]._from === r + n && (this._allData[a]._from = r);
            })) : (n++, this._nodes[r].outputs.forEach((a) => {
              this._allData[a]._from = -2;
            }), this._nodes.splice(r, 1), r--);
            n = 0;
            for (let r = 0; r < this._allData.length; r++) if (this._allData[r].from !== -2 || this._allOutputIndices.indexOf(r + n) !== -1) {
              if (n > 0) {
                let a = -1;
                this._allData[r].from !== void 0 && this._allData[r].from !== -1 ? (a = this._nodes[this._allData[r].from].outputs.indexOf(r + n), a !== -1 && (this._nodes[this._allData[r].from].outputs[a] = r)) : (a = this._allInputIndices.indexOf(r + n), a !== -1 && (this._allInputIndices[a] = r)), this._allData[r].to.forEach((l) => {
                  a = this._nodes[l].inputs.indexOf(r + n), a !== -1 && (this._nodes[l].inputs[a] = r);
                }), this._allData[r].to.length === 0 && (a = this._allOutputIndices.indexOf(r + n), a !== -1 && (this._allOutputIndices[a] = r));
              }
            } else n++, this._allData.splice(r, 1), r--;
          }
          deleteNode(n) {
            const r = this._nodes[n];
            if (r.outputs.length > 1) {
              for (let _ = 1; _ < r.outputs.length; _++) if (this._allData[r.outputs[_]].to.length > 0) throw new Error("Node deletion with more than one output connected to other nodes is not supported. ");
            }
            r.executeNode = !1;
            const a = r.inputs[0], l = r.outputs[0], d = this._allData[l].to, m = this._allData[a].to.indexOf(n);
            if (m === -1) throw new Error("The Value object doesn't have the current Node in it's 'to' property ");
            this._allData[a].to.splice(m, 1), this._allData[l]._to = [];
            const y = this._allOutputIndices.indexOf(l);
            if (y !== -1 && (this._allOutputIndices[y] = a), d && d.length > 0) for (const _ of d) {
              const v = this._nodes[_].inputs.indexOf(l);
              if (v === -1) throw new Error("The Node object doesn't have the output Value in it's 'inputs' property ");
              this._nodes[_].inputs[v] = a, this._allData[a].to.push(_);
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
                const a = this._nodes[r[0]];
                if (a.opType === "Clip") if (a.inputs.length === 1) try {
                  n.attributes.set("activation_params", "floats", [a.attributes.getFloat("min"), a.attributes.getFloat("max")]);
                } catch {
                  n.attributes.set("activation_params", "floats", [c.MIN_CLIP, c.MAX_CLIP]);
                }
                else {
                  if (!(a.inputs.length >= 3 && this._allData[a.inputs[1]].tensor !== void 0 && this._allData[a.inputs[2]].tensor !== void 0)) continue;
                  n.attributes.set("activation_params", "floats", [this._allData[a.inputs[1]].tensor.floatData[0], this._allData[a.inputs[2]].tensor.floatData[0]]);
                }
                n.attributes.set("activation", "string", a.opType), this.deleteNode(r[0]);
              }
            }
          }
        }
      }, 6231: (R, u) => {
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
              const a = g[n] || p;
              g[n] = { provider: r.provider || a.provider, minimalSeverity: r.minimalSeverity || a.minimalSeverity, logDateTime: r.logDateTime === void 0 ? a.logDateTime : r.logDateTime, logSourceLocation: r.logSourceLocation === void 0 ? a.logSourceLocation : r.logSourceLocation };
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
          constructor(t, e, n, r, a, l) {
            this.category = t, this.name = e, this.startTime = n, this.endCallback = r, this.timer = a, this.ctx = l;
          }
          end() {
            return this.endCallback(this);
          }
          async checkTimer() {
            if (this.ctx === void 0 || this.timer === void 0) throw new Error("No webgl timer found");
            return this.ctx.endTimer(), this.ctx.waitForQueryAndGetTime(this.timer);
          }
        }
        class s {
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
            let a = !1;
            const l = e();
            if (l && typeof l.then == "function") return a = !0, new Promise((d, m) => {
              l.then(async (y) => {
                r && await r.end(), d(y);
              }, async (y) => {
                r && await r.end(), m(y);
              });
            });
            if (!a && r) {
              const d = r.end();
              if (d && typeof d.then == "function") return new Promise((m, y) => {
                d.then(() => {
                  m(l);
                }, (_) => {
                  y(_);
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
            this._timingEvents.length < this._maxNumberEvents && (this._timingEvents.push(new s(i.category, i.name, i.startTime, t)), this.flush(t));
          }
          endSync(i) {
            const t = (0, u.now)();
            this._timingEvents.length < this._maxNumberEvents && (this._timingEvents.push(new s(i.category, i.name, i.startTime, t)), this.flush(t));
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
      }, 2644: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Model = void 0;
        const h = b(5686), p = b(1446), g = b(7070), o = b(9395), c = b(2517);
        var f = o.onnxruntime.experimental.fbs;
        u.Model = class {
          constructor() {
          }
          load(s, i, t) {
            if (!t) try {
              return void this.loadFromOnnxFormat(s, i);
            } catch (e) {
              if (t !== void 0) throw e;
            }
            this.loadFromOrtFormat(s, i);
          }
          loadFromOnnxFormat(s, i) {
            const t = p.onnx.ModelProto.decode(s);
            if (c.LongUtil.longToNumber(t.irVersion) < 3) throw new Error("only support ONNX model with IR_VERSION>=3");
            this._opsets = t.opsetImport.map((e) => ({ domain: e.domain, version: c.LongUtil.longToNumber(e.version) })), this._graph = g.Graph.from(t.graph, i);
          }
          loadFromOrtFormat(s, i) {
            const t = new h.flatbuffers.ByteBuffer(s), e = f.InferenceSession.getRootAsInferenceSession(t).model();
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
      }, 782: (R, u) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.FLOAT_TYPES = u.INT_TYPES = u.NUMBER_TYPES = void 0, u.NUMBER_TYPES = ["float32", "float64", "int32", "int16", "int8", "uint16", "uint32", "uint8"], u.INT_TYPES = ["int32", "int16", "int8", "uint16", "uint32", "uint8"], u.FLOAT_TYPES = ["float32", "float64"];
      }, 1047: (R, u) => {
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
            const c = o[0], f = o[1], s = o[2], i = o[3], t = o[4];
            if (h.opType === c) {
              for (const e of p) if ((e.domain === f || e.domain === "ai.onnx" && f === "") && b(e.version, s)) return { opImpl: i, opInit: t };
            }
          }
          throw new TypeError(`cannot resolve operator '${h.opType}' with opsets: ${p.map((o) => `${o.domain || "ai.onnx"} v${o.version}`).join(", ")}`);
        };
      }, 9395: (R, u, b) => {
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
              (function(s) {
                s[s.UNKNOWN = 0] = "UNKNOWN", s[s.VALUE = 1] = "VALUE", s[s.PARAM = 2] = "PARAM";
              })(f.DimensionValueType || (f.DimensionValueType = {}));
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              (function(s) {
                s[s.UNDEFINED = 0] = "UNDEFINED", s[s.FLOAT = 1] = "FLOAT", s[s.UINT8 = 2] = "UINT8", s[s.INT8 = 3] = "INT8", s[s.UINT16 = 4] = "UINT16", s[s.INT16 = 5] = "INT16", s[s.INT32 = 6] = "INT32", s[s.INT64 = 7] = "INT64", s[s.STRING = 8] = "STRING", s[s.BOOL = 9] = "BOOL", s[s.FLOAT16 = 10] = "FLOAT16", s[s.DOUBLE = 11] = "DOUBLE", s[s.UINT32 = 12] = "UINT32", s[s.UINT64 = 13] = "UINT64", s[s.COMPLEX64 = 14] = "COMPLEX64", s[s.COMPLEX128 = 15] = "COMPLEX128", s[s.BFLOAT16 = 16] = "BFLOAT16";
              })(f.TensorDataType || (f.TensorDataType = {}));
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              (function(s) {
                s[s.Primitive = 0] = "Primitive", s[s.Fused = 1] = "Fused";
              })(f.NodeType || (f.NodeType = {}));
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              (function(s) {
                s[s.NONE = 0] = "NONE", s[s.tensor_type = 1] = "tensor_type", s[s.sequence_type = 2] = "sequence_type", s[s.map_type = 3] = "map_type";
              })(f.TypeInfoValue || (f.TypeInfoValue = {}));
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsShape(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsShape(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startShape(t), s.addDim(t, e), s.endShape(t);
                }
              }
              f.Shape = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsDimension(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsDimension(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startDimension(t), s.addValue(t, e), s.addDenotation(t, n), s.endDimension(t);
                }
              }
              f.Dimension = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsDimensionValue(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsDimensionValue(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startDimensionValue(t), s.addDimType(t, e), s.addDimValue(t, n), s.addDimParam(t, r), s.endDimensionValue(t);
                }
              }
              f.DimensionValue = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsTensorTypeAndShape(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsTensorTypeAndShape(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startTensorTypeAndShape(t), s.addElemType(t, e), s.addShape(t, n), s.endTensorTypeAndShape(t);
                }
              }
              f.TensorTypeAndShape = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsMapType(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsMapType(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startMapType(t), s.addKeyType(t, e), s.addValueType(t, n), s.endMapType(t);
                }
              }
              f.MapType = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsSequenceType(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsSequenceType(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startSequenceType(t), s.addElemType(t, e), s.endSequenceType(t);
                }
              }
              f.SequenceType = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (c.fbs || (c.fbs = {})).EdgeEnd = class {
              constructor() {
                this.bb = null, this.bb_pos = 0;
              }
              __init(f, s) {
                return this.bb_pos = f, this.bb = s, this;
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
              static createEdgeEnd(f, s, i, t) {
                return f.prep(4, 12), f.writeInt32(t), f.writeInt32(i), f.writeInt32(s), f.offset();
              }
            };
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsNodeEdge(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsNodeEdge(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startNodeEdge(t), s.addNodeIndex(t, e), s.addInputEdges(t, n), s.addOutputEdges(t, r), s.endNodeEdge(t);
                }
              }
              f.NodeEdge = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsNode(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsNode(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                static createNode(t, e, n, r, a, l, d, m, y, _, v, S, O, I) {
                  return s.startNode(t), s.addName(t, e), s.addDocString(t, n), s.addDomain(t, r), s.addSinceVersion(t, a), s.addIndex(t, l), s.addOpType(t, d), s.addType(t, m), s.addExecutionProviderType(t, y), s.addInputs(t, _), s.addOutputs(t, v), s.addAttributes(t, S), s.addInputArgCounts(t, O), s.addImplicitInputs(t, I), s.endNode(t);
                }
              }
              f.Node = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsValueInfo(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsValueInfo(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startValueInfo(t), s.addName(t, e), s.addDocString(t, n), s.addType(t, r), s.endValueInfo(t);
                }
              }
              f.ValueInfo = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsTypeInfo(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsTypeInfo(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startTypeInfo(t), s.addDenotation(t, e), s.addValueType(t, n), s.addValue(t, r), s.endTypeInfo(t);
                }
              }
              f.TypeInfo = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsOperatorSetId(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsOperatorSetId(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startOperatorSetId(t), s.addDomain(t, e), s.addVersion(t, n), s.endOperatorSetId(t);
                }
              }
              f.OperatorSetId = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsTensor(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsTensor(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                static createTensor(t, e, n, r, a, l, d) {
                  return s.startTensor(t), s.addName(t, e), s.addDocString(t, n), s.addDims(t, r), s.addDataType(t, a), s.addRawData(t, l), s.addStringData(t, d), s.endTensor(t);
                }
              }
              f.Tensor = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsSparseTensor(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsSparseTensor(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startSparseTensor(t), s.addValues(t, e), s.addIndices(t, n), s.addDims(t, r), s.endSparseTensor(t);
                }
              }
              f.SparseTensor = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsAttribute(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsAttribute(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                static createAttribute(t, e, n, r, a, l, d, m, y, _, v, S, O, I) {
                  return s.startAttribute(t), s.addName(t, e), s.addDocString(t, n), s.addType(t, r), s.addF(t, a), s.addI(t, l), s.addS(t, d), s.addT(t, m), s.addG(t, y), s.addFloats(t, _), s.addInts(t, v), s.addStrings(t, S), s.addTensors(t, O), s.addGraphs(t, I), s.endAttribute(t);
                }
              }
              f.Attribute = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsGraph(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsGraph(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                static createGraph(t, e, n, r, a, l, d, m, y) {
                  return s.startGraph(t), s.addInitializers(t, e), s.addNodeArgs(t, n), s.addNodes(t, r), s.addMaxNodeIndex(t, a), s.addNodeEdges(t, l), s.addInputs(t, d), s.addOutputs(t, m), s.addSparseInitializers(t, y), s.endGraph(t);
                }
              }
              f.Graph = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsModel(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsModel(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                static createModel(t, e, n, r, a, l, d, m, y, _) {
                  return s.startModel(t), s.addIrVersion(t, e), s.addOpsetImport(t, n), s.addProducerName(t, r), s.addProducerVersion(t, a), s.addDomain(t, l), s.addModelVersion(t, d), s.addDocString(t, m), s.addGraph(t, y), s.addGraphDocString(t, _), s.endModel(t);
                }
              }
              f.Model = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsKernelCreateInfos(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsKernelCreateInfos(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startKernelCreateInfos(t), s.addNodeIndices(t, e), s.addKernelDefHashes(t, n), s.endKernelCreateInfos(t);
                }
              }
              f.KernelCreateInfos = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsSubGraphSessionState(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsSubGraphSessionState(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startSubGraphSessionState(t), s.addGraphId(t, e), s.addSessionState(t, n), s.endSubGraphSessionState(t);
                }
              }
              f.SubGraphSessionState = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsSessionState(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsSessionState(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startSessionState(t), s.addKernels(t, e), s.addSubGraphSessionStates(t, n), s.endSessionState(t);
                }
              }
              f.SessionState = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {})), function(o) {
          (function(c) {
            (function(f) {
              class s {
                constructor() {
                  this.bb = null, this.bb_pos = 0;
                }
                __init(t, e) {
                  return this.bb_pos = t, this.bb = e, this;
                }
                static getRootAsInferenceSession(t, e) {
                  return (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
                }
                static getSizePrefixedRootAsInferenceSession(t, e) {
                  return t.setPosition(t.position() + h.flatbuffers.SIZE_PREFIX_LENGTH), (e || new s()).__init(t.readInt32(t.position()) + t.position(), t);
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
                  return s.startInferenceSession(t), s.addOrtVersion(t, e), s.addModel(t, n), s.addSessionState(t, r), s.endInferenceSession(t);
                }
              }
              f.InferenceSession = s;
            })(c.fbs || (c.fbs = {}));
          })(o.experimental || (o.experimental = {}));
        }(u.onnxruntime || (u.onnxruntime = {}));
      }, 7448: (R, u, b) => {
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
            const s = await this.session.run(f), i = {};
            return s.forEach((t, e) => {
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
      }, 6919: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Session = void 0;
        const h = b(7067), p = b(1296), g = b(7091), o = b(1036), c = b(6231), f = b(2644);
        u.Session = class {
          constructor(s = {}) {
            this._initialized = !1, this.backendHint = s.backendHint, this.profiler = c.Profiler.create(s.profiler), this.context = { profiler: this.profiler, graphInputTypes: [], graphInputDims: [] };
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
          async loadModel(s, i, t) {
            await this.profiler.event("session", "Session.loadModel", async () => {
              const e = await (0, g.resolveBackend)(this.backendHint);
              if (this.sessionHandler = e.createSessionHandler(this.context), this._model = new f.Model(), typeof s == "string") {
                const n = s.endsWith(".ort");
                if (typeof fetch > "u") {
                  const r = await (0, p.promisify)(h.readFile)(s);
                  this.initialize(r, n);
                } else {
                  const r = await fetch(s), a = await r.arrayBuffer();
                  this.initialize(new Uint8Array(a), n);
                }
              } else if (ArrayBuffer.isView(s)) this.initialize(s);
              else {
                const n = new Uint8Array(s, i || 0, t || s.byteLength);
                this.initialize(n);
              }
            });
          }
          initialize(s, i) {
            if (this._initialized) throw new Error("already initialized");
            this.profiler.event("session", "Session.initialize", () => {
              const t = this.sessionHandler.transformGraph ? this.sessionHandler : void 0;
              this._model.load(s, t, i), this.sessionHandler.onGraphInitialized && this.sessionHandler.onGraphInitialized(this._model.graph), this.initializeOps(this._model.graph), this._executionPlan = new o.ExecutionPlan(this._model.graph, this._ops, this.profiler);
            }), this._initialized = !0;
          }
          async run(s) {
            if (!this._initialized) throw new Error("session not initialized yet");
            return this.profiler.event("session", "Session.run", async () => {
              const i = this.normalizeAndValidateInputs(s), t = await this._executionPlan.execute(this.sessionHandler, i);
              return this.createOutput(t);
            });
          }
          normalizeAndValidateInputs(s) {
            const i = this._model.graph.getInputNames();
            if (Array.isArray(s)) {
              if (s.length !== i.length) throw new Error(`incorrect input array length: expected ${i.length} but got ${s.length}`);
            } else {
              if (s.size !== i.length) throw new Error(`incorrect input map size: expected ${i.length} but got ${s.size}`);
              const t = new Array(s.size);
              let e = 0;
              for (let n = 0; n < i.length; ++n) {
                const r = s.get(i[n]);
                if (!r) throw new Error(`missing input tensor for: '${name}'`);
                t[e++] = r;
              }
              s = t;
            }
            if (this.context.graphInputTypes && this.context.graphInputTypes.length !== 0 && this.context.graphInputDims && this.context.graphInputDims.length !== 0) this.validateInputTensorDims(this.context.graphInputDims, s, !1);
            else {
              const t = this._model.graph.getInputIndices(), e = this._model.graph.getValues(), n = new Array(t.length);
              for (let r = 0; r < t.length; ++r) {
                const a = e[t[r]];
                n[r] = a.type.shape.dims, this.context.graphInputTypes.push(a.type.tensorType), this.context.graphInputDims.push(s[r].dims);
              }
              this.validateInputTensorDims(n, s, !0);
            }
            return this.validateInputTensorTypes(this.context.graphInputTypes, s), s;
          }
          validateInputTensorTypes(s, i) {
            for (let t = 0; t < i.length; t++) {
              const e = s[t], n = i[t].type;
              if (e !== n) throw new Error(`input tensor[${t}] check failed: expected type '${e}' but got ${n}`);
            }
          }
          validateInputTensorDims(s, i, t) {
            for (let e = 0; e < i.length; e++) {
              const n = s[e], r = i[e].dims;
              if (!this.compareTensorDims(n, r, t)) throw new Error(`input tensor[${e}] check failed: expected shape '[${n.join(",")}]' but got [${r.join(",")}]`);
            }
          }
          compareTensorDims(s, i, t) {
            if (s.length !== i.length) return !1;
            for (let e = 0; e < s.length; ++e) if (s[e] !== i[e] && (!t || s[e] !== 0)) return !1;
            return !0;
          }
          createOutput(s) {
            const i = this._model.graph.getOutputNames();
            if (s.length !== i.length) throw new Error("expected number of outputs do not match number of generated outputs");
            const t = /* @__PURE__ */ new Map();
            for (let e = 0; e < i.length; ++e) t.set(i[e], s[e]);
            return t;
          }
          initializeOps(s) {
            const i = s.getNodes();
            this._ops = new Array(i.length);
            for (let t = 0; t < i.length; t++) this._ops[t] = this.sessionHandler.resolve(i[t], this._model.opsets, s);
          }
        };
      }, 9162: function(R, u, b) {
        var h = this && this.__importDefault || function(a) {
          return a && a.__esModule ? a : { default: a };
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.Tensor = void 0;
        const p = b(3442), g = h(b(3720)), o = b(1446), c = b(9395), f = b(2517);
        var s = c.onnxruntime.experimental.fbs;
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
          constructor(l, d, m, y, _, v = p.Guid.create()) {
            this.dims = l, this.type = d, this.dataProvider = m, this.asyncDataProvider = y, this.cache = _, this.dataId = v, this.size = f.ShapeUtil.validateDimsAndCalcSize(l);
            const S = this.size, O = m === void 0 && y === void 0 && _ === void 0;
            if (_ !== void 0 && _.length !== S) throw new RangeError("Input dims doesn't match data length.");
            if (d === "string") {
              if (!(_ === void 0 || Array.isArray(_) && _.every((I) => typeof I == "string"))) throw new TypeError("cache should be a string array");
              O && (this.cache = new Array(S));
            } else {
              if (_ !== void 0) {
                const I = e(d);
                if (!(_ instanceof I)) throw new TypeError(`cache should be type ${I.name}`);
              }
              if (O) {
                const I = new ArrayBuffer(S * function(w) {
                  switch (w) {
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
                      throw new Error(`cannot calculate sizeof() on type ${w}`);
                  }
                }(d));
                this.cache = function(w, C) {
                  return new (e(C))(w);
                }(I, d);
              }
            }
          }
          static fromProto(l) {
            if (!l) throw new Error("cannot construct Value from an empty tensor");
            const d = f.ProtoUtil.tensorDataTypeFromProto(l.dataType), m = f.ProtoUtil.tensorDimsFromProto(l.dims), y = new i(m, d);
            if (d === "string") l.stringData.forEach((_, v) => {
              y.data[v] = (0, f.decodeUtf8String)(_);
            });
            else if (l.rawData && typeof l.rawData.byteLength == "number" && l.rawData.byteLength > 0) {
              const _ = y.data, v = new DataView(l.rawData.buffer, l.rawData.byteOffset, l.rawData.byteLength), S = t(l.dataType), O = l.rawData.byteLength / S;
              if (l.rawData.byteLength % S != 0) throw new Error("invalid buffer length");
              if (_.length !== O) throw new Error("buffer length mismatch");
              for (let I = 0; I < O; I++) {
                const w = r(v, l.dataType, I * S);
                _[I] = w;
              }
            } else {
              let _;
              switch (l.dataType) {
                case o.onnx.TensorProto.DataType.FLOAT:
                  _ = l.floatData;
                  break;
                case o.onnx.TensorProto.DataType.INT32:
                case o.onnx.TensorProto.DataType.INT16:
                case o.onnx.TensorProto.DataType.UINT16:
                case o.onnx.TensorProto.DataType.INT8:
                case o.onnx.TensorProto.DataType.UINT8:
                case o.onnx.TensorProto.DataType.BOOL:
                  _ = l.int32Data;
                  break;
                case o.onnx.TensorProto.DataType.INT64:
                  _ = l.int64Data;
                  break;
                case o.onnx.TensorProto.DataType.DOUBLE:
                  _ = l.doubleData;
                  break;
                case o.onnx.TensorProto.DataType.UINT32:
                case o.onnx.TensorProto.DataType.UINT64:
                  _ = l.uint64Data;
                  break;
                default:
                  throw new Error("unspecific error");
              }
              if (_ == null) throw new Error("failed to populate data from a tensorproto value");
              const v = y.data;
              if (v.length !== _.length) throw new Error("array length mismatch");
              for (let S = 0; S < _.length; S++) {
                const O = _[S];
                g.default.isLong(O) ? v[S] = n(O, l.dataType) : v[S] = O;
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
            if (m === "string") for (let _ = 0; _ < l.stringDataLength(); _++) y.data[_] = l.stringData(_);
            else if (l.rawDataArray() && typeof l.rawDataLength() == "number" && l.rawDataLength() > 0) {
              const _ = y.data, v = new DataView(l.rawDataArray().buffer, l.rawDataArray().byteOffset, l.rawDataLength()), S = t(l.dataType()), O = l.rawDataLength() / S;
              if (l.rawDataLength() % S != 0) throw new Error("invalid buffer length");
              if (_.length !== O) throw new Error("buffer length mismatch");
              for (let I = 0; I < O; I++) {
                const w = r(v, l.dataType(), I * S);
                _[I] = w;
              }
            }
            return y;
          }
        }
        function t(a) {
          switch (a) {
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
              throw new Error(`cannot calculate sizeof() on type ${o.onnx.TensorProto.DataType[a]}`);
          }
        }
        function e(a) {
          switch (a) {
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
        function n(a, l) {
          if (l === o.onnx.TensorProto.DataType.INT64 || l === s.TensorDataType.INT64) {
            if (a.greaterThanOrEqual(2147483648) || a.lessThan(-2147483648)) throw new TypeError("int64 is not supported");
          } else {
            if (l !== o.onnx.TensorProto.DataType.UINT32 && l !== s.TensorDataType.UINT32 && l !== o.onnx.TensorProto.DataType.UINT64 && l !== s.TensorDataType.UINT64) throw new TypeError(`not a LONG type: ${o.onnx.TensorProto.DataType[l]}`);
            if (a.greaterThanOrEqual(4294967296) || a.lessThan(0)) throw new TypeError("uint64 is not supported");
          }
          return a.toNumber();
        }
        function r(a, l, d) {
          switch (l) {
            case o.onnx.TensorProto.DataType.BOOL:
            case o.onnx.TensorProto.DataType.UINT8:
              return a.getUint8(d);
            case o.onnx.TensorProto.DataType.INT8:
              return a.getInt8(d);
            case o.onnx.TensorProto.DataType.UINT16:
              return a.getUint16(d, !0);
            case o.onnx.TensorProto.DataType.INT16:
              return a.getInt16(d, !0);
            case o.onnx.TensorProto.DataType.FLOAT:
              return a.getFloat32(d, !0);
            case o.onnx.TensorProto.DataType.INT32:
              return a.getInt32(d, !0);
            case o.onnx.TensorProto.DataType.UINT32:
              return a.getUint32(d, !0);
            case o.onnx.TensorProto.DataType.INT64:
              return n(g.default.fromBits(a.getUint32(d, !0), a.getUint32(d + 4, !0), !1), l);
            case o.onnx.TensorProto.DataType.DOUBLE:
              return a.getFloat64(d, !0);
            case o.onnx.TensorProto.DataType.UINT64:
              return n(g.default.fromBits(a.getUint32(d, !0), a.getUint32(d + 4, !0), !0), l);
            default:
              throw new Error(`cannot read from DataView for type ${o.onnx.TensorProto.DataType[l]}`);
          }
        }
        u.Tensor = i;
      }, 2517: function(R, u, b) {
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
        class s {
          static calcShape(d, m, y = !1) {
            const _ = d.length, v = m.length;
            if (_ === 0) return m;
            if (v === 0) return d;
            const S = Math.max(d.length, m.length), O = new Array(S);
            if (y) {
              if (_ < 2 || v < 2) return;
              const I = f.calcMatMulShape([d[_ - 2], d[_ - 1]], [m[v - 2], m[v - 1]]);
              if (I === void 0) return;
              [O[S - 2], O[S - 1]] = I;
            }
            for (let I = y ? 3 : 1; I <= S; I++) {
              const w = _ - I < 0 ? 1 : d[_ - I], C = v - I < 0 ? 1 : m[v - I];
              if (w !== C && w > 1 && C > 1) return;
              O[S - I] = Math.max(w, C);
            }
            return O;
          }
          static index(d, m) {
            const y = new Array(m.length);
            return s.fillIndex(d, m, y), y;
          }
          static fillIndex(d, m, y) {
            const _ = d.length - m.length;
            for (let v = 0; v < m.length; v++) y[v] = d[_ + v] % m[v];
          }
          static calc(d, m, y, _, v) {
            const S = s.calcShape(d.dims, m.dims);
            if (S) {
              if (_ && !e.areEqual(S, d.dims)) return;
              const O = e.size(S), I = _ ? d : new c.Tensor(S, v || d.type);
              if (S.length === 0) I.set([], y(d.get([]), m.get([])));
              else {
                const w = new Array(S.length), C = new Array(d.dims.length), V = new Array(m.dims.length);
                let G, D = 0, A = 0, M = !1, E = !1;
                d.dims.length === 0 && (D = d.get([]), M = !0), m.dims.length === 0 && (A = m.get([]), E = !0);
                for (let F = 0; F < O; F++) {
                  G = F;
                  for (let W = S.length - 1; W >= 0; W--) w[W] = G % S[W], G = Math.floor(G / S[W]);
                  M || (s.fillIndex(w, d.dims, C), D = d.get(C)), E || (s.fillIndex(w, m.dims, V), A = m.get(V)), I.set(w, y(D, A));
                }
              }
              return I;
            }
          }
          static isValidBroadcast(d, m) {
            const y = d.length, _ = m.length;
            if (y > _) return !1;
            for (let v = 1; v <= y; v++) if (d[y - v] !== 1 && d[y - v] !== m[_ - v]) return !1;
            return !0;
          }
          static getBroadcastDims(d, m) {
            const y = d.length, _ = [];
            for (let v = 0; v < y; v++) {
              const S = y - 1 - v, O = d[S] || 1;
              (m[m.length - 1 - v] || 1) > 1 && O === 1 && _.unshift(S);
            }
            return _;
          }
        }
        u.BroadcastUtil = s, u.arrayCopyHelper = function(l, d, m, y, _) {
          if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
          if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
          if (y + _ > d.length) throw new Error("source indices to be copied are outside bounds");
          if (m + _ > l.length) throw new Error("target array is too small to hold result");
          for (let v = 0; v < _; v++) l[m + v] = d[y + v];
        }, u.GemmUtil = class {
          static getShapeOfGemmResult(l, d, m, y, _) {
            if (l.length !== 2 || m.length !== 2) throw new Error("shape need to be of size 2");
            let v, S, O;
            d ? (v = l[1], S = l[0]) : (v = l[0], S = l[1]);
            let I = -1;
            if (y ? (O = m[0], I = 1) : (O = m[1], I = 0), m[I] !== S) throw new Error("dimension mismatch");
            if (v <= 0 || O <= 0 || S <= 0) throw new Error("invalid shape specified");
            if (_ && !s.isValidBroadcast(_, [v, O])) throw new Error("gemm: invalid bias shape for broadcast");
            return [v, O, S];
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
            let _ = 1;
            for (let v = m; v < y; v++) {
              if (d[v] <= 0) throw new Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");
              _ *= d[v];
            }
            return _;
          }
          static computeStrides(d) {
            const m = d.length;
            if (m === 0) return [];
            if (m === 1) return [1];
            const y = new Array(m);
            y[m - 1] = 1, y[m - 2] = d[m - 1];
            for (let _ = m - 3; _ >= 0; --_) y[_] = y[_ + 1] * d[_ + 1];
            return y;
          }
          static transpose(d) {
            return d.slice().reverse();
          }
          static indicesToOffset(d, m, y) {
            y === void 0 && (y = d.length);
            let _ = 0;
            for (let v = 0; v < y; ++v) _ += m[v] * d[v];
            return _;
          }
          static offsetToIndices(d, m) {
            const y = m.length;
            if (y === 0) return [];
            if (y === 1) return [d * m[0]];
            const _ = new Array(m.length);
            for (let v = 0; v < _.length - 1; ++v) _[v] = Math.floor(d / m[v]), d -= _[v] * m[v];
            return _[_.length - 1] = d, _;
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
            for (let _ = y - 1; _ >= 0 && (d[_]++, !(d[_] < m[_])); --_) d[_] = 0;
          }
          static calculateReshapedDims(d, m) {
            if (m.length === 0) {
              if (d.length === 0 || e.size(d) === 1) return [];
              throw new Error("cannot reshape to a scalar Tensor");
            }
            const y = m.length, _ = new Array(y);
            let v = -1, S = 1;
            for (let I = 0; I < y; I++) {
              if (m[I] < -1) throw new Error("a dimension in shape hints cannot be less than -1");
              if (m[I] === -1) {
                if (v !== -1) throw new Error("at most one dimension in shape hints can be -1");
                v = I;
              } else {
                if (m[I] === 0) {
                  if (I >= d.length) throw new Error("the dimension with value zero exceeds the dimension size of the input tensor");
                  _[I] = d[I];
                } else _[I] = m[I];
                S *= _[I];
              }
            }
            const O = e.size(d);
            if (v !== -1) {
              if (O % S != 0) throw new Error(`the input tensor cannot be reshaped to the requested shape. Input shape: [${d}] Output shape: [${m}]`);
              _[v] = O / S;
            } else if (S !== O) throw new Error("reshapedDims and originalDims don't have matching sizes");
            return _;
          }
          static sortBasedOnPerm(d, m) {
            return m ? m.map((y) => d[y]) : d.slice().reverse();
          }
          static padShape(d, m) {
            const y = d.length;
            return d.map((_, v) => _ + m[v] + m[v + y]);
          }
          static areEqual(d, m) {
            return d.length === m.length && d.every((y, _) => y === m[_]);
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
            const y = d.reduce((v, S) => v * S, 1), _ = d.slice(m).reduce((v, S) => v * S, 1);
            return [y / _, _];
          }
          static squeezeShape(d, m) {
            const y = new Array();
            m = e.normalizeAxes(m, d.length);
            for (let _ = 0; _ < d.length; _++) {
              const v = m.indexOf(_) >= 0;
              if (v && d[_] !== 1) throw new Error("squeeze an axis of size different than 1");
              (m.length === 0 && d[_] > 1 || m.length > 0 && !v) && y.push(d[_]);
            }
            return y;
          }
          static unsqueezeShape(d, m) {
            const y = new Array(d.length + m.length);
            y.fill(0);
            for (let v = 0; v < m.length; v++) {
              const S = e.normalizeAxis(m[v], y.length);
              if (S >= y.length) throw new Error("'axes' has an out of range axis");
              if (y[S] !== 0) throw new Error("'axes' has a duplicate axis");
              y[S] = 1;
            }
            let _ = 0;
            for (let v = 0; v < y.length; v++) y[v] === 0 && (y[v] = d[_++]);
            if (_ !== d.length) throw new Error("the unsqueezed dimension could not be established");
            return y;
          }
        }
        u.ShapeUtil = e, u.MathUtil = class {
          static sqr(l, d, m, y, _) {
            if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
            if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
            if (y + _ > d.length) throw new Error("source indices to be copied are outside bounds");
            if (m + _ > l.length) throw new Error("target array is too small to hold result");
            for (let v = 0; v < _; v++) l[m + v] += Math.pow(d[y + v], 2);
          }
          static axpy(l, d, m, y, _, v) {
            if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
            if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
            if (y + _ > d.length) throw new Error("source indices to be copied are outside bounds");
            if (m + _ > l.length) throw new Error("target array is too small to hold result");
            for (let S = 0; S < _; S++) l[m + S] += v * d[y + S];
          }
          static powx(l, d, m, y, _, v) {
            if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
            if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
            if (y + _ > d.length) throw new Error("source indices to be copied are outside bounds");
            if (m + _ > l.length) throw new Error("target array is too small to hold result");
            for (let S = 0; S < _; S++) l[m + S] = Math.pow(d[y + S], v);
          }
          static mul(l, d, m, y, _) {
            if (y < 0 || y >= d.length) throw new Error("sourceIndex out of bounds");
            if (m < 0 || m >= l.length) throw new Error("targetIndex out of bounds");
            if (y + _ > d.length) throw new Error("source indices to be copied are outside bounds");
            if (m + _ > l.length) throw new Error("target array is too small to hold result");
            for (let v = 0; v < _; v++) l[m + v] = d[y + v] * l[m + v];
          }
        };
        class n {
          static splitShape(d, m, y, _) {
            if (y.length === 0) {
              if (!_) throw new Error("need to know number of outputs when the 'split' attribute is not specified");
              n.determineSplit(d[m], _, y);
            }
            const v = [], S = [0];
            for (let O = 0; O < y.length; ++O) {
              O !== 0 && S.push(S[O - 1] + y[O - 1]);
              const I = d.slice();
              I[m] = y[O], v.push(I);
            }
            return [v, S];
          }
          static determineSplit(d, m, y) {
            if (d % m != 0) throw new Error("cannot split tensor to equal sized parts");
            for (let _ = 0; _ < m; ++_) y.push(d / m);
          }
        }
        u.SplitUtil = n;
        class r {
          static calcReduce(d, m, y, _, v) {
            const S = d.dims.slice(0);
            m.length === 0 && S.forEach((D, A) => m.push(A));
            const O = r.calcReduceShape(S, m, !0), I = e.size(O), w = new c.Tensor(O, d.type), C = e.computeStrides(O), V = e.computeStrides(S), G = new Array(S.length);
            for (let D = 0; D < I; D++) {
              const A = e.offsetToIndices(D, C);
              s.fillIndex(A, S, G), w.set(A, r.calcReduceByAxis(d.numberData, m, S, 0, e.indicesToOffset(G, V), _, v));
            }
            return y ? w : new c.Tensor(r.calcReduceShape(S, m, y), w.type, void 0, void 0, w.data, w.dataId);
          }
          static calcReduceByAxis(d, m, y, _, v, S, O) {
            let I = 0;
            if (_ >= m.length) return S(d[v]);
            const w = m[_], C = w >= y.length ? 1 : e.size(y.slice(w + 1));
            for (let V = 0; V < y[w]; V++) I = V === 0 ? r.calcReduceByAxis(d, m, y, _ + 1, v, S, O) : O(I, r.calcReduceByAxis(d, m, y, _ + 1, v, S, O)), v += C;
            return I;
          }
          static calcReduceShape(d, m, y) {
            const _ = d.slice();
            for (let v = 0; v < m.length; v++) _[m[v]] = y ? 1 : 0;
            return _.filter((v) => v !== 0);
          }
        }
        u.ReduceUtil = r;
        class a {
          static adjustPoolAttributes(d, m, y, _, v, S) {
            if (!d && y.length !== m.length - 2) throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");
            if (d) for (let O = 0; O < m.length - 2; O++) O >= y.length ? y.push(m[O + 2]) : y[O] = m[O + 2];
            for (let O = 0; O < y.length; O++) if (O < _.length) {
              if (_[O] < 0) throw new Error("strides should be greater than or equal to 1");
            } else _.push(1);
            for (let O = 0; O < y.length; O++) if (O < v.length) {
              if (v[O] < 0) throw new Error("dilations should be greater than or equal to 1");
            } else v.push(1);
            for (let O = 0; O < 2 * y.length; O++) if (O < S.length) {
              if (S[O] < 0) throw new Error("pad should be greater than or equal to 1");
            } else S.push(0);
            for (let O = 0; O < y.length; O++) {
              if (y[O] <= 0) throw new Error("kernel shapes need to be greater than 0");
              if (S[O] >= y[O] || S[O + y.length] >= y[O]) throw new Error("pads should be smaller than kernel");
            }
          }
          static adjustPadsBasedOnAutoPad(d, m, y, _, v, S) {
            if (S) {
              if (v.length !== 2 * (d.length - 2)) throw new Error("length of pads should be twice the length of data dimensions");
              if (m.length !== d.length - 2) throw new Error("length of strides should be the length of data dimensions");
              if (_.length !== d.length - 2) throw new Error("length of kernel shapes should be the length of data dimensions");
              for (let O = 0; O < d.length - 2; O++) a.adjustPadAndReturnShape(d[O + 2], m[O], y[O], _[O], v, O, O + d.length - 2, S);
            }
          }
          static computePoolOutputShape(d, m, y, _, v, S, O) {
            if (m.length <= 0) throw new Error("input shape must be of size greater than 0");
            const I = [m[0], m[1]];
            return a.computeShapeHelper(d, m, I, y, _, v, S, O), I;
          }
          static computeConvOutputShape(d, m, y, _, v, S, O) {
            if (d.length <= 0 || m.length <= 0) throw new Error("invalid input tensor dims or invalid filter tensor dims");
            const I = [d[0], m[0]];
            return a.computeShapeHelper(!1, d, I, y, _, v, S, O), I;
          }
          static computeShapeHelper(d, m, y, _, v, S, O, I) {
            if (d) for (let w = 0; w < m.length - 2; w++) y.push(1);
            else for (let w = 0; w < m.length - 2; w++) y.push(a.adjustPadAndReturnShape(m[w + 2], _[w], v[w], S[w], O, w, w + m.length - 2, I));
          }
          static adjustPadAndReturnShape(d, m, y, _, v, S, O, I) {
            const w = y * (_ - 1) + 1;
            if (!I || I === "NOTSET") return Math.floor((d + v[S] + v[O] - w) / m + 1);
            switch (I) {
              case "VALID":
                return v[S] = 0, v[O] = 0, Math.floor((d - w) / m + 1);
              case "SAME_LOWER":
              case "SAME_UPPER":
                if (y !== 1) throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");
                {
                  const C = ((d + m - 1) / m - 1) * m + _ - d;
                  return v[S] = Math.floor(I === "SAME_LOWER" ? (C + 1) / 2 : C / 2), v[O] = C - v[S], Math.floor((d + C - _) / m + 1);
                }
              default:
                throw new Error("Unsupported AutoPad type");
            }
          }
        }
        u.PoolConvUtil = a, u.MIN_CLIP = -34028234663852886e22, u.MAX_CLIP = 34028234663852886e22, u.decodeUtf8String = function(l) {
          return new TextDecoder().decode(l);
        };
      }, 7967: (R, u) => {
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
      }, 2157: function(R, u, b) {
        var h, p = this && this.__createBinding || (Object.create ? function(C, V, G, D) {
          D === void 0 && (D = G);
          var A = Object.getOwnPropertyDescriptor(V, G);
          A && !("get" in A ? !V.__esModule : A.writable || A.configurable) || (A = { enumerable: !0, get: function() {
            return V[G];
          } }), Object.defineProperty(C, D, A);
        } : function(C, V, G, D) {
          D === void 0 && (D = G), C[D] = V[G];
        }), g = this && this.__setModuleDefault || (Object.create ? function(C, V) {
          Object.defineProperty(C, "default", { enumerable: !0, value: V });
        } : function(C, V) {
          C.default = V;
        }), o = this && this.__importStar || function(C) {
          if (C && C.__esModule) return C;
          var V = {};
          if (C != null) for (var G in C) G !== "default" && Object.prototype.hasOwnProperty.call(C, G) && p(V, C, G);
          return g(V, C), V;
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.endProfiling = u.run = u.releaseSession = u.createSession = u.createSessionFinalize = u.createSessionAllocate = u.initOrt = u.initWasm = void 0;
        const c = b(1670), f = o(b(349)), s = b(6361), i = () => !!c.env.wasm.proxy && typeof document < "u";
        let t, e, n, r = !1, a = !1, l = !1;
        const d = [], m = [], y = [], _ = [], v = [], S = [], O = () => {
          if (r || !a || l || !t) throw new Error("worker not ready");
        }, I = (C) => {
          switch (C.data.type) {
            case "init-wasm":
              r = !1, C.data.err ? (l = !0, e[1](C.data.err)) : (a = !0, e[0]());
              break;
            case "init-ort":
              C.data.err ? n[1](C.data.err) : n[0]();
              break;
            case "create_allocate":
              C.data.err ? d.shift()[1](C.data.err) : d.shift()[0](C.data.out);
              break;
            case "create_finalize":
              C.data.err ? m.shift()[1](C.data.err) : m.shift()[0](C.data.out);
              break;
            case "create":
              C.data.err ? y.shift()[1](C.data.err) : y.shift()[0](C.data.out);
              break;
            case "release":
              C.data.err ? _.shift()[1](C.data.err) : _.shift()[0]();
              break;
            case "run":
              C.data.err ? v.shift()[1](C.data.err) : v.shift()[0](C.data.out);
              break;
            case "end-profiling":
              C.data.err ? S.shift()[1](C.data.err) : S.shift()[0]();
          }
        }, w = typeof document < "u" ? (h = document == null ? void 0 : document.currentScript) === null || h === void 0 ? void 0 : h.src : void 0;
        u.initWasm = async () => {
          if (i()) {
            if (a) return;
            if (r) throw new Error("multiple calls to 'initWasm()' detected.");
            if (l) throw new Error("previous call to 'initWasm()' failed.");
            return r = !0, c.env.wasm.wasmPaths === void 0 && w && w.indexOf("blob:") !== 0 && (c.env.wasm.wasmPaths = w.substr(0, +w.lastIndexOf("/") + 1)), new Promise((C, V) => {
              t == null || t.terminate(), t = b(9710).Z(), t.onmessage = I, e = [C, V];
              const G = { type: "init-wasm", in: c.env.wasm };
              t.postMessage(G);
            });
          }
          return (0, s.initializeWebAssembly)(c.env.wasm);
        }, u.initOrt = async (C, V) => {
          if (i()) return O(), new Promise((G, D) => {
            n = [G, D];
            const A = { type: "init-ort", in: { numThreads: C, loggingLevel: V } };
            t.postMessage(A);
          });
          f.initOrt(C, V);
        }, u.createSessionAllocate = async (C) => i() ? (O(), new Promise((V, G) => {
          d.push([V, G]);
          const D = { type: "create_allocate", in: { model: C } };
          t.postMessage(D, [C.buffer]);
        })) : f.createSessionAllocate(C), u.createSessionFinalize = async (C, V) => i() ? (O(), new Promise((G, D) => {
          m.push([G, D]);
          const A = { type: "create_finalize", in: { modeldata: C, options: V } };
          t.postMessage(A);
        })) : f.createSessionFinalize(C, V), u.createSession = async (C, V) => i() ? (O(), new Promise((G, D) => {
          y.push([G, D]);
          const A = { type: "create", in: { model: C, options: V } };
          t.postMessage(A, [C.buffer]);
        })) : f.createSession(C, V), u.releaseSession = async (C) => {
          if (i()) return O(), new Promise((V, G) => {
            _.push([V, G]);
            const D = { type: "release", in: C };
            t.postMessage(D);
          });
          f.releaseSession(C);
        }, u.run = async (C, V, G, D, A) => i() ? (O(), new Promise((M, E) => {
          v.push([M, E]);
          const F = { type: "run", in: { sessionId: C, inputIndices: V, inputs: G, outputIndices: D, options: A } };
          t.postMessage(F, f.extractTransferableBuffers(G));
        })) : f.run(C, V, G, D, A), u.endProfiling = async (C) => {
          if (i()) return O(), new Promise((V, G) => {
            S.push([V, G]);
            const D = { type: "end-profiling", in: C };
            t.postMessage(D);
          });
          f.endProfiling(C);
        };
      }, 586: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.setRunOptions = void 0;
        const h = b(7967), p = b(4983), g = b(6361);
        u.setRunOptions = (o) => {
          const c = (0, g.getInstance)();
          let f = 0;
          const s = [], i = o || {};
          try {
            if ((o == null ? void 0 : o.logSeverityLevel) === void 0) i.logSeverityLevel = 2;
            else if (typeof o.logSeverityLevel != "number" || !Number.isInteger(o.logSeverityLevel) || o.logSeverityLevel < 0 || o.logSeverityLevel > 4) throw new Error(`log serverity level is not valid: ${o.logSeverityLevel}`);
            if ((o == null ? void 0 : o.logVerbosityLevel) === void 0) i.logVerbosityLevel = 0;
            else if (typeof o.logVerbosityLevel != "number" || !Number.isInteger(o.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${o.logVerbosityLevel}`);
            (o == null ? void 0 : o.terminate) === void 0 && (i.terminate = !1);
            let t = 0;
            if ((o == null ? void 0 : o.tag) !== void 0 && (t = (0, p.allocWasmString)(o.tag, s)), f = c._OrtCreateRunOptions(i.logSeverityLevel, i.logVerbosityLevel, !!i.terminate, t), f === 0) throw new Error("Can't create run options");
            return (o == null ? void 0 : o.extra) !== void 0 && (0, h.iterateExtraOptions)(o.extra, "", /* @__PURE__ */ new WeakSet(), (e, n) => {
              const r = (0, p.allocWasmString)(e, s), a = (0, p.allocWasmString)(n, s);
              if (c._OrtAddRunConfigEntry(f, r, a) !== 0) throw new Error(`Can't set a run config entry: ${e} - ${n}`);
            }), [f, s];
          } catch (t) {
            throw f !== 0 && c._OrtReleaseRunOptions(f), s.forEach(c._free), t;
          }
        };
      }, 2306: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.OnnxruntimeWebAssemblySessionHandler = void 0;
        const h = b(2806), p = b(1670), g = b(2850), o = b(2157);
        let c;
        u.OnnxruntimeWebAssemblySessionHandler = class {
          async createSessionAllocate(f) {
            const s = await fetch(f), i = await s.arrayBuffer();
            return (0, o.createSessionAllocate)(new Uint8Array(i));
          }
          async loadModel(f, s) {
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
              [this.sessionId, this.inputNames, this.outputNames] = await (0, o.createSession)(i, s);
            } else {
              const i = await this.createSessionAllocate(f);
              [this.sessionId, this.inputNames, this.outputNames] = await (0, o.createSessionFinalize)(i, s);
            }
            else [this.sessionId, this.inputNames, this.outputNames] = await (0, o.createSession)(f, s);
          }
          async dispose() {
            return (0, o.releaseSession)(this.sessionId);
          }
          async run(f, s, i) {
            const t = [], e = [];
            Object.entries(f).forEach((l) => {
              const d = l[0], m = l[1], y = this.inputNames.indexOf(d);
              if (y === -1) throw new Error(`invalid input '${d}'`);
              t.push(m), e.push(y);
            });
            const n = [];
            Object.entries(s).forEach((l) => {
              const d = l[0], m = this.outputNames.indexOf(d);
              if (m === -1) throw new Error(`invalid output '${d}'`);
              n.push(m);
            });
            const r = await (0, o.run)(this.sessionId, e, t.map((l) => [l.type, l.dims, l.data]), n, i), a = {};
            for (let l = 0; l < r.length; l++) a[this.outputNames[n[l]]] = new p.Tensor(r[l][0], r[l][2], r[l][1]);
            return a;
          }
          startProfiling() {
          }
          endProfiling() {
            (0, o.endProfiling)(this.sessionId);
          }
        };
      }, 4919: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.setSessionOptions = void 0;
        const h = b(7967), p = b(4983), g = b(6361);
        u.setSessionOptions = (o) => {
          const c = (0, g.getInstance)();
          let f = 0;
          const s = [], i = o || {};
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
            if ((o == null ? void 0 : o.logId) !== void 0 && (n = (0, p.allocWasmString)(o.logId, s)), (o == null ? void 0 : o.logSeverityLevel) === void 0) i.logSeverityLevel = 2;
            else if (typeof o.logSeverityLevel != "number" || !Number.isInteger(o.logSeverityLevel) || o.logSeverityLevel < 0 || o.logSeverityLevel > 4) throw new Error(`log serverity level is not valid: ${o.logSeverityLevel}`);
            if ((o == null ? void 0 : o.logVerbosityLevel) === void 0) i.logVerbosityLevel = 0;
            else if (typeof o.logVerbosityLevel != "number" || !Number.isInteger(o.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${o.logVerbosityLevel}`);
            if ((o == null ? void 0 : o.enableProfiling) === void 0 && (i.enableProfiling = !1), f = c._OrtCreateSessionOptions(t, !!i.enableCpuMemArena, !!i.enableMemPattern, e, !!i.enableProfiling, 0, n, i.logSeverityLevel, i.logVerbosityLevel), f === 0) throw new Error("Can't create session options");
            return o != null && o.executionProviders && ((r, a, l) => {
              for (const d of a) {
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
            })(f, o.executionProviders, s), (o == null ? void 0 : o.extra) !== void 0 && (0, h.iterateExtraOptions)(o.extra, "", /* @__PURE__ */ new WeakSet(), (r, a) => {
              const l = (0, p.allocWasmString)(r, s), d = (0, p.allocWasmString)(a, s);
              if (c._OrtAddSessionConfigEntry(f, l, d) !== 0) throw new Error(`Can't set a session config entry: ${r} - ${a}`);
            }), [f, s];
          } catch (t) {
            throw f !== 0 && c._OrtReleaseSessionOptions(f), s.forEach(c._free), t;
          }
        };
      }, 4983: (R, u, b) => {
        Object.defineProperty(u, "__esModule", { value: !0 }), u.allocWasmString = void 0;
        const h = b(6361);
        u.allocWasmString = (p, g) => {
          const o = (0, h.getInstance)(), c = o.lengthBytesUTF8(p) + 1, f = o._malloc(c);
          return o.stringToUTF8(p, f, c), g.push(f), f;
        };
      }, 349: (R, u, b) => {
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
          let r = 0, a = 0, l = [];
          try {
            if ([a, l] = (0, p.setSessionOptions)(e), r = n._OrtCreateSession(t[0], t[1], a), r === 0) throw new Error("Can't create a session");
          } finally {
            n._free(t[0]), n._OrtReleaseSessionOptions(a), l.forEach(n._free);
          }
          const d = n._OrtGetInputCount(r), m = n._OrtGetOutputCount(r), y = [], _ = [], v = [], S = [];
          for (let O = 0; O < d; O++) {
            const I = n._OrtGetInputName(r, O);
            if (I === 0) throw new Error("Can't get an input name");
            _.push(I), y.push(n.UTF8ToString(I));
          }
          for (let O = 0; O < m; O++) {
            const I = n._OrtGetOutputName(r, O);
            if (I === 0) throw new Error("Can't get an output name");
            S.push(I), v.push(n.UTF8ToString(I));
          }
          return c.set(r, [r, _, S]), [r, y, v];
        }, u.createSession = (t, e) => {
          const n = (0, u.createSessionAllocate)(t);
          return (0, u.createSessionFinalize)(n, e);
        }, u.releaseSession = (t) => {
          const e = (0, o.getInstance)(), n = c.get(t);
          if (!n) throw new Error("invalid session id");
          const r = n[0], a = n[1], l = n[2];
          a.forEach(e._OrtFree), l.forEach(e._OrtFree), e._OrtReleaseSession(r), c.delete(t);
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
        }, s = (t) => {
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
        u.run = (t, e, n, r, a) => {
          const l = (0, o.getInstance)(), d = c.get(t);
          if (!d) throw new Error("invalid session id");
          const m = d[0], y = d[1], _ = d[2], v = e.length, S = r.length;
          let O = 0, I = [];
          const w = [], C = [];
          try {
            [O, I] = (0, h.setRunOptions)(a);
            for (let E = 0; E < v; E++) {
              const F = n[E][0], W = n[E][1], q = n[E][2];
              let Q, Z;
              if (Array.isArray(q)) {
                Z = 4 * q.length, Q = l._malloc(Z), C.push(Q);
                let me = Q / 4;
                for (let ie = 0; ie < q.length; ie++) {
                  if (typeof q[ie] != "string") throw new TypeError(`tensor data at index ${ie} is not a string`);
                  l.HEAPU32[me++] = (0, g.allocWasmString)(q[ie], C);
                }
              } else Z = q.byteLength, Q = l._malloc(Z), C.push(Q), l.HEAPU8.set(new Uint8Array(q.buffer, q.byteOffset, Z), Q);
              const ee = l.stackSave(), se = l.stackAlloc(4 * W.length);
              try {
                let me = se / 4;
                W.forEach((_e) => l.HEAP32[me++] = _e);
                const ie = l._OrtCreateTensor(f(F), Q, Z, se, W.length);
                if (ie === 0) throw new Error("Can't create a tensor");
                w.push(ie);
              } finally {
                l.stackRestore(ee);
              }
            }
            const V = l.stackSave(), G = l.stackAlloc(4 * v), D = l.stackAlloc(4 * v), A = l.stackAlloc(4 * S), M = l.stackAlloc(4 * S);
            try {
              let E = G / 4, F = D / 4, W = A / 4, q = M / 4;
              for (let ee = 0; ee < v; ee++) l.HEAPU32[E++] = w[ee], l.HEAPU32[F++] = y[e[ee]];
              for (let ee = 0; ee < S; ee++) l.HEAPU32[W++] = 0, l.HEAPU32[q++] = _[r[ee]];
              let Q = l._OrtRun(m, D, G, v, M, S, A, O);
              const Z = [];
              if (Q === 0) for (let ee = 0; ee < S; ee++) {
                const se = l.HEAPU32[A / 4 + ee], me = l.stackSave(), ie = l.stackAlloc(16);
                let _e, be = 0;
                try {
                  if (Q = l._OrtGetTensorData(se, ie, ie + 4, ie + 8, ie + 12), Q !== 0) throw new Error(`Can't access output tensor data. error code = ${Q}`);
                  let Ce = ie / 4;
                  const ze = l.HEAPU32[Ce++];
                  be = l.HEAPU32[Ce++];
                  const he = l.HEAPU32[Ce++], Ee = l.HEAPU32[Ce++], Ie = [];
                  for (let ke = 0; ke < Ee; ke++) Ie.push(l.HEAPU32[he / 4 + ke]);
                  l._OrtFree(he);
                  const De = Ie.length === 0 ? 1 : Ie.reduce((ke, He) => ke * He);
                  if (_e = s(ze), _e === "string") {
                    const ke = [];
                    let He = be / 4;
                    for (let Je = 0; Je < De; Je++) {
                      const Xe = l.HEAPU32[He++], tt = Je === De - 1 ? void 0 : l.HEAPU32[He] - Xe;
                      ke.push(l.UTF8ToString(Xe, tt));
                    }
                    Z.push([_e, Ie, ke]);
                  } else {
                    const ke = new (i(_e))(De);
                    new Uint8Array(ke.buffer, ke.byteOffset, ke.byteLength).set(l.HEAPU8.subarray(be, be + ke.byteLength)), Z.push([_e, Ie, ke]);
                  }
                } finally {
                  l.stackRestore(me), _e === "string" && be && l._free(be), l._OrtReleaseTensor(se);
                }
              }
              if (Q === 0) return Z;
              throw new Error(`failed to call OrtRun(). error code = ${Q}.`);
            } finally {
              l.stackRestore(V);
            }
          } finally {
            w.forEach(l._OrtReleaseTensor), C.forEach(l._free), l._OrtReleaseRunOptions(O), I.forEach(l._free);
          }
        }, u.endProfiling = (t) => {
          const e = (0, o.getInstance)(), n = c.get(t);
          if (!n) throw new Error("invalid session id");
          const r = n[0], a = e._OrtEndProfiling(r);
          if (a === 0) throw new Error("Can't get an profile file name");
          e._OrtFree(a);
        }, u.extractTransferableBuffers = (t) => {
          const e = [];
          for (const n of t) {
            const r = n[2];
            !Array.isArray(r) && r.buffer && e.push(r.buffer);
          }
          return e;
        };
      }, 6361: function(R, u, b) {
        var h = this && this.__createBinding || (Object.create ? function(a, l, d, m) {
          m === void 0 && (m = d);
          var y = Object.getOwnPropertyDescriptor(l, d);
          y && !("get" in y ? !l.__esModule : y.writable || y.configurable) || (y = { enumerable: !0, get: function() {
            return l[d];
          } }), Object.defineProperty(a, m, y);
        } : function(a, l, d, m) {
          m === void 0 && (m = d), a[m] = l[d];
        }), p = this && this.__setModuleDefault || (Object.create ? function(a, l) {
          Object.defineProperty(a, "default", { enumerable: !0, value: l });
        } : function(a, l) {
          a.default = l;
        }), g = this && this.__importStar || function(a) {
          if (a && a.__esModule) return a;
          var l = {};
          if (a != null) for (var d in a) d !== "default" && Object.prototype.hasOwnProperty.call(a, d) && h(l, a, d);
          return p(l, a), l;
        }, o = this && this.__importDefault || function(a) {
          return a && a.__esModule ? a : { default: a };
        };
        Object.defineProperty(u, "__esModule", { value: !0 }), u.dispose = u.getInstance = u.initializeWebAssembly = void 0;
        const c = g(b(6449)), f = o(b(932)), s = b(3474);
        let i, t = !1, e = !1, n = !1;
        const r = (a, l) => l ? a ? "ort-wasm-simd-threaded.wasm" : "ort-wasm-threaded.wasm" : a ? "ort-wasm-simd.wasm" : "ort-wasm.wasm";
        u.initializeWebAssembly = async (a) => {
          if (t) return Promise.resolve();
          if (e) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
          if (n) throw new Error("previous call to 'initializeWebAssembly()' failed.");
          e = !0;
          const l = a.initTimeout, d = a.numThreads, m = a.simd, y = d > 1 && (() => {
            try {
              return typeof SharedArrayBuffer < "u" && (typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11])));
            } catch {
              return !1;
            }
          })(), _ = m && (() => {
            try {
              return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
            } catch {
              return !1;
            }
          })(), v = typeof a.wasmPaths == "string" ? a.wasmPaths : void 0, S = r(!1, y), O = r(_, y), I = typeof a.wasmPaths == "object" ? a.wasmPaths[O] : void 0;
          let w = !1;
          const C = [];
          if (l > 0 && C.push(new Promise((V) => {
            setTimeout(() => {
              w = !0, V();
            }, l);
          })), C.push(new Promise((V, G) => {
            const D = y ? s : f.default, A = { locateFile: (M, E) => y && M.endsWith(".worker.js") && typeof Blob < "u" ? URL.createObjectURL(new Blob([b(4154)], { type: "text/javascript" })) : M === S ? I ?? (v ?? E) + O : E + M };
            if (y) if (typeof Blob > "u") A.mainScriptUrlOrBlob = c.join("/", "ort-wasm-threaded.js");
            else {
              const M = `var ortWasmThreaded=(function(){var _scriptDir;return ${D.toString()}})();`;
              A.mainScriptUrlOrBlob = new Blob([M], { type: "text/javascript" });
            }
            D(A).then((M) => {
              e = !1, t = !0, i = M, V();
            }, (M) => {
              e = !1, n = !0, G(M);
            });
          })), await Promise.race(C), w) throw new Error(`WebAssembly backend initializing failed due to timeout: ${l}ms`);
        }, u.getInstance = () => {
          if (t && i) return i;
          throw new Error("WebAssembly is not initialized yet.");
        }, u.dispose = () => {
          var a;
          !t || e || n || (e = !0, (a = i.PThread) === null || a === void 0 || a.terminateAllThreads(), i = void 0, e = !1, t = !1, n = !0);
        };
      }, 9710: (R, u, b) => {
        b.d(u, { Z: () => g });
        var h = b(477), p = b.n(h);
        function g() {
          return p()('/*!\n* ONNX Runtime Web v1.14.0\n* Copyright (c) Microsoft Corporation. All rights reserved.\n* Licensed under the MIT License.\n*/\n(()=>{var t={474:(t,e,n)=>{var _scriptDir,r=(_scriptDir=(_scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(t){function e(){return j.buffer!=D&&N(j.buffer),P}function r(){return j.buffer!=D&&N(j.buffer),U}function a(){return j.buffer!=D&&N(j.buffer),F}function i(){return j.buffer!=D&&N(j.buffer),I}function o(){return j.buffer!=D&&N(j.buffer),W}var u,c,s;t=t||{},u||(u=void 0!==t?t:{}),u.ready=new Promise((function(t,e){c=t,s=e}));var l,f,p,h,d,y,b=Object.assign({},u),m="./this.program",g=(t,e)=>{throw e},v="object"==typeof window,w="function"==typeof importScripts,_="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,O=u.ENVIRONMENT_IS_PTHREAD||!1,A="";function S(t){return u.locateFile?u.locateFile(t,A):A+t}if(_){let e;A=w?n(908).dirname(A)+"/":"//",y=()=>{d||(h=n(384),d=n(908))},l=function(t,e){return y(),t=d.normalize(t),h.readFileSync(t,e?void 0:"utf8")},p=t=>((t=l(t,!0)).buffer||(t=new Uint8Array(t)),t),f=(t,e,n)=>{y(),t=d.normalize(t),h.readFile(t,(function(t,r){t?n(t):e(r.buffer)}))},1<process.argv.length&&(m=process.argv[1].replace(/\\\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(t){if(!(t instanceof ct))throw t})),process.on("unhandledRejection",(function(t){throw t})),g=(t,e)=>{if(Q())throw process.exitCode=t,e;e instanceof ct||x("exiting due to exception: "+e),process.exit(t)},u.inspect=function(){return"[Emscripten Module object]"};try{e=n(925)}catch(t){throw console.error(\'The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?\'),t}n.g.Worker=e.Worker}else(v||w)&&(w?A=self.location.href:"undefined"!=typeof document&&document.currentScript&&(A=document.currentScript.src),_scriptDir&&(A=_scriptDir),A=0!==A.indexOf("blob:")?A.substr(0,A.replace(/[?#].*/,"").lastIndexOf("/")+1):"",_||(l=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.send(null),e.responseText},w&&(p=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.responseType="arraybuffer",e.send(null),new Uint8Array(e.response)}),f=(t,e,n)=>{var r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?e(r.response):n()},r.onerror=n,r.send(null)}));_&&"undefined"==typeof performance&&(n.g.performance=n(953).performance);var T=console.log.bind(console),E=console.warn.bind(console);_&&(y(),T=t=>h.writeSync(1,t+"\\n"),E=t=>h.writeSync(2,t+"\\n"));var M,C=u.print||T,x=u.printErr||E;Object.assign(u,b),b=null,u.thisProgram&&(m=u.thisProgram),u.quit&&(g=u.quit),u.wasmBinary&&(M=u.wasmBinary);var R=u.noExitRuntime||!1;"object"!=typeof WebAssembly&&at("no native wasm support detected");var j,k,D,P,U,F,I,W,H=!1,L="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function z(t,e,n){var r=(e>>>=0)+n;for(n=e;t[n]&&!(n>=r);)++n;if(16<n-e&&t.buffer&&L)return L.decode(t.buffer instanceof SharedArrayBuffer?t.slice(e,n):t.subarray(e,n));for(r="";e<n;){var a=t[e++];if(128&a){var i=63&t[e++];if(192==(224&a))r+=String.fromCharCode((31&a)<<6|i);else{var o=63&t[e++];65536>(a=224==(240&a)?(15&a)<<12|i<<6|o:(7&a)<<18|i<<12|o<<6|63&t[e++])?r+=String.fromCharCode(a):(a-=65536,r+=String.fromCharCode(55296|a>>10,56320|1023&a))}}else r+=String.fromCharCode(a)}return r}function Y(t,e){return(t>>>=0)?z(r(),t,e):""}function B(t,e,n,r){if(!(0<r))return 0;var a=n>>>=0;r=n+r-1;for(var i=0;i<t.length;++i){var o=t.charCodeAt(i);if(55296<=o&&57343>=o&&(o=65536+((1023&o)<<10)|1023&t.charCodeAt(++i)),127>=o){if(n>=r)break;e[n++>>>0]=o}else{if(2047>=o){if(n+1>=r)break;e[n++>>>0]=192|o>>6}else{if(65535>=o){if(n+2>=r)break;e[n++>>>0]=224|o>>12}else{if(n+3>=r)break;e[n++>>>0]=240|o>>18,e[n++>>>0]=128|o>>12&63}e[n++>>>0]=128|o>>6&63}e[n++>>>0]=128|63&o}}return e[n>>>0]=0,n-a}function G(t){for(var e=0,n=0;n<t.length;++n){var r=t.charCodeAt(n);127>=r?e++:2047>=r?e+=2:55296<=r&&57343>=r?(e+=4,++n):e+=3}return e}function N(t){D=t,u.HEAP8=P=new Int8Array(t),u.HEAP16=new Int16Array(t),u.HEAP32=F=new Int32Array(t),u.HEAPU8=U=new Uint8Array(t),u.HEAPU16=new Uint16Array(t),u.HEAPU32=I=new Uint32Array(t),u.HEAPF32=new Float32Array(t),u.HEAPF64=W=new Float64Array(t)}O&&(D=u.buffer);var V=u.INITIAL_MEMORY||16777216;if(O)j=u.wasmMemory,D=u.buffer;else if(u.wasmMemory)j=u.wasmMemory;else if(!((j=new WebAssembly.Memory({initial:V/65536,maximum:65536,shared:!0})).buffer instanceof SharedArrayBuffer))throw x("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),_&&console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"),Error("bad memory");j&&(D=j.buffer),V=D.byteLength,N(D);var $,q=[],X=[],J=[],Z=[];function Q(){return R||!1}function K(){var t=u.preRun.shift();q.unshift(t)}var tt,et=0,nt=null,rt=null;function at(t){throw O?postMessage({cmd:"onAbort",arg:t}):u.onAbort&&u.onAbort(t),x(t="Aborted("+t+")"),H=!0,t=new WebAssembly.RuntimeError(t+". Build with -sASSERTIONS for more info."),s(t),t}function it(){return tt.startsWith("data:application/octet-stream;base64,")}function ot(){var t=tt;try{if(t==tt&&M)return new Uint8Array(M);if(p)return p(t);throw"both async and sync fetching of the wasm failed"}catch(t){at(t)}}tt="ort-wasm-threaded.wasm",it()||(tt=S(tt));var ut={};function ct(t){this.name="ExitStatus",this.message="Program terminated with exit("+t+")",this.status=t}function st(t){(t=ht.Vb[t])||at(),ht.mc(t)}function lt(t){var e=ht.Cc();if(!e)return 6;ht.ac.push(e),ht.Vb[t.Ub]=e,e.Ub=t.Ub;var n={cmd:"run",start_routine:t.Ic,arg:t.zc,pthread_ptr:t.Ub};return e.$b=()=>{n.time=performance.now(),e.postMessage(n,t.Nc)},e.loaded&&(e.$b(),delete e.$b),0}function ft(t){if(O)return $t(1,1,t);Q()||(ht.oc(),u.onExit&&u.onExit(t),H=!0),g(t,new ct(t))}function pt(t,e){if(!e&&O)throw bt(t),"unwind";Q()||O||(me(),dt(J),be(0),re[1].length&&ae(1,10),re[2].length&&ae(2,10),ht.oc()),ft(t)}var ht={Yb:[],ac:[],qc:[],Vb:{},fc:function(){O&&ht.Ec()},Pc:function(){},Ec:function(){ht.receiveObjectTransfer=ht.Gc,ht.threadInitTLS=ht.pc,ht.setExitStatus=ht.nc,R=!1},nc:function(){},oc:function(){for(var t of Object.values(ht.Vb))ht.mc(t);for(t of ht.Yb)t.terminate();ht.Yb=[]},mc:function(t){var e=t.Ub;delete ht.Vb[e],ht.Yb.push(t),ht.ac.splice(ht.ac.indexOf(t),1),t.Ub=0,Oe(e)},Gc:function(){},pc:function(){ht.qc.forEach((t=>t()))},Fc:function(t,e){t.onmessage=n=>{var r=(n=n.data).cmd;if(t.Ub&&(ht.Bc=t.Ub),n.targetThread&&n.targetThread!=he()){var a=ht.Vb[n.Qc];a?a.postMessage(n,n.transferList):x(\'Internal error! Worker sent a message "\'+r+\'" to target pthread \'+n.targetThread+", but that thread no longer exists!")}else"processProxyingQueue"===r?zt(n.queue):"spawnThread"===r?lt(n):"cleanupThread"===r?st(n.thread):"killThread"===r?(n=n.thread,r=ht.Vb[n],delete ht.Vb[n],r.terminate(),Oe(n),ht.ac.splice(ht.ac.indexOf(r),1),r.Ub=0):"cancelThread"===r?ht.Vb[n.thread].postMessage({cmd:"cancel"}):"loaded"===r?(t.loaded=!0,e&&e(t),t.$b&&(t.$b(),delete t.$b)):"print"===r?C("Thread "+n.threadId+": "+n.text):"printErr"===r?x("Thread "+n.threadId+": "+n.text):"alert"===r?alert("Thread "+n.threadId+": "+n.text):"setimmediate"===n.target?t.postMessage(n):"onAbort"===r?u.onAbort&&u.onAbort(n.arg):r&&x("worker sent an unknown command "+r);ht.Bc=void 0},t.onerror=t=>{throw x("worker sent an error! "+t.filename+":"+t.lineno+": "+t.message),t},_&&(t.on("message",(function(e){t.onmessage({data:e})})),t.on("error",(function(e){t.onerror(e)})),t.on("detachedExit",(function(){}))),t.postMessage({cmd:"load",urlOrBlob:u.mainScriptUrlOrBlob||_scriptDir,wasmMemory:j,wasmModule:k})},yc:function(){var t=S("ort-wasm-threaded.worker.js");ht.Yb.push(new Worker(t))},Cc:function(){return 0==ht.Yb.length&&(ht.yc(),ht.Fc(ht.Yb[0])),ht.Yb.pop()}};function dt(t){for(;0<t.length;)t.shift()(u)}function yt(t){var e=Ee();return t=t(),Me(e),t}function bt(t){if(O)return $t(2,0,t);try{pt(t)}catch(t){t instanceof ct||"unwind"==t||g(1,t)}}u.PThread=ht,u.establishStackSpace=function(){var t=he(),e=a()[t+44>>2>>>0];t=a()[t+48>>2>>>0],Te(e,e-t),Me(e)};var mt=[];function gt(t){var e=mt[t];return e||(t>=mt.length&&(mt.length=t+1),mt[t]=e=$.get(t)),e}u.invokeEntryPoint=function(t,e){t=gt(t)(e),Q()?ht.nc(t):Ae(t)};var vt,wt,_t=[],Ot=0,At=0;function St(t){this.Zb=t,this.Sb=t-24,this.xc=function(t){i()[this.Sb+4>>2>>>0]=t},this.bc=function(){return i()[this.Sb+4>>2>>>0]},this.wc=function(t){i()[this.Sb+8>>2>>>0]=t},this.Dc=function(){return i()[this.Sb+8>>2>>>0]},this.rc=function(){a()[this.Sb>>2>>>0]=0},this.hc=function(t){t=t?1:0,e()[this.Sb+12>>0>>>0]=t},this.uc=function(){return 0!=e()[this.Sb+12>>0>>>0]},this.ic=function(t){t=t?1:0,e()[this.Sb+13>>0>>>0]=t},this.kc=function(){return 0!=e()[this.Sb+13>>0>>>0]},this.fc=function(t,e){this.cc(0),this.xc(t),this.wc(e),this.rc(),this.hc(!1),this.ic(!1)},this.sc=function(){Atomics.add(a(),this.Sb>>2,1)},this.Hc=function(){return 1===Atomics.sub(a(),this.Sb>>2,1)},this.cc=function(t){i()[this.Sb+16>>2>>>0]=t},this.tc=function(){return i()[this.Sb+16>>2>>>0]},this.vc=function(){if(Re(this.bc()))return i()[this.Zb>>2>>>0];var t=this.tc();return 0!==t?t:this.Zb}}function Tt(t){return ye(new St(t).Sb)}function Et(t,e,n,r){return O?$t(3,1,t,e,n,r):Mt(t,e,n,r)}function Mt(t,e,n,r){if("undefined"==typeof SharedArrayBuffer)return x("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var a=[];return O&&0===a.length?Et(t,e,n,r):(t={Ic:n,Ub:t,zc:r,Nc:a},O?(t.Oc="spawnThread",postMessage(t,a),0):lt(t))}function Ct(t,e,n){return O?$t(4,1,t,e,n):0}function xt(t,e){if(O)return $t(5,1,t,e)}function Rt(t,e){if(O)return $t(6,1,t,e)}function jt(t,e,n){if(O)return $t(7,1,t,e,n)}function kt(t,e,n){return O?$t(8,1,t,e,n):0}function Dt(t,e){if(O)return $t(9,1,t,e)}function Pt(t,e,n){if(O)return $t(10,1,t,e,n)}function Ut(t,e,n,r){if(O)return $t(11,1,t,e,n,r)}function Ft(t,e,n,r){if(O)return $t(12,1,t,e,n,r)}function It(t,e,n,r){if(O)return $t(13,1,t,e,n,r)}function Wt(t){if(O)return $t(14,1,t)}function Ht(t,e){if(O)return $t(15,1,t,e)}function Lt(t,e,n){if(O)return $t(16,1,t,e,n)}function zt(t){Atomics.store(a(),t>>2,1),he()&&_e(t),Atomics.compareExchange(a(),t>>2,1,0)}function Yt(t){return i()[t>>>2]+4294967296*a()[t+4>>>2]}function Bt(t,e,n,r,a,i){return O?$t(17,1,t,e,n,r,a,i):-52}function Gt(t,e,n,r,a,i){if(O)return $t(18,1,t,e,n,r,a,i)}function Nt(t){var n=G(t)+1,r=de(n);return r&&B(t,e(),r,n),r}function Vt(t,e,n){function r(t){return(t=t.toTimeString().match(/\\(([A-Za-z ]+)\\)$/))?t[1]:"GMT"}if(O)return $t(19,1,t,e,n);var o=(new Date).getFullYear(),u=new Date(o,0,1),c=new Date(o,6,1);o=u.getTimezoneOffset();var s=c.getTimezoneOffset(),l=Math.max(o,s);a()[t>>2>>>0]=60*l,a()[e>>2>>>0]=Number(o!=s),t=r(u),e=r(c),t=Nt(t),e=Nt(e),s<o?(i()[n>>2>>>0]=t,i()[n+4>>2>>>0]=e):(i()[n>>2>>>0]=e,i()[n+4>>2>>>0]=t)}function $t(t,e){var n=arguments.length-2,r=arguments;return yt((()=>{for(var a=Ce(8*n),i=a>>3,u=0;u<n;u++){var c=r[2+u];o()[i+u>>>0]=c}return we(t,n,a,e)}))}u.executeNotifiedProxyingQueue=zt,wt=_?()=>{var t=process.hrtime();return 1e3*t[0]+t[1]/1e6}:O?()=>performance.now()-u.__performance_now_clock_drift:()=>performance.now();var qt,Xt=[],Jt={};function Zt(){if(!qt){var t,e={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:m||"./this.program"};for(t in Jt)void 0===Jt[t]?delete e[t]:e[t]=Jt[t];var n=[];for(t in e)n.push(t+"="+e[t]);qt=n}return qt}function Qt(t,n){if(O)return $t(20,1,t,n);var r=0;return Zt().forEach((function(a,o){var u=n+r;for(o=i()[t+4*o>>2>>>0]=u,u=0;u<a.length;++u)e()[o++>>0>>>0]=a.charCodeAt(u);e()[o>>0>>>0]=0,r+=a.length+1})),0}function Kt(t,e){if(O)return $t(21,1,t,e);var n=Zt();i()[t>>2>>>0]=n.length;var r=0;return n.forEach((function(t){r+=t.length+1})),i()[e>>2>>>0]=r,0}function te(t){return O?$t(22,1,t):52}function ee(t,e,n,r){return O?$t(23,1,t,e,n,r):52}function ne(t,e,n,r,a){return O?$t(24,1,t,e,n,r,a):70}var re=[null,[],[]];function ae(t,e){var n=re[t];0===e||10===e?((1===t?C:x)(z(n,0)),n.length=0):n.push(e)}function ie(t,e,n,a){if(O)return $t(25,1,t,e,n,a);for(var o=0,u=0;u<n;u++){var c=i()[e>>2>>>0],s=i()[e+4>>2>>>0];e+=8;for(var l=0;l<s;l++)ae(t,r()[c+l>>>0]);o+=s}return i()[a>>2>>>0]=o,0}var oe=0;function ue(t){return 0==t%4&&(0!=t%100||0==t%400)}var ce=[31,29,31,30,31,30,31,31,30,31,30,31],se=[31,28,31,30,31,30,31,31,30,31,30,31];function le(t,n,r,i){function o(t,e,n){for(t="number"==typeof t?t.toString():t||"";t.length<e;)t=n[0]+t;return t}function u(t,e){return o(t,e,"0")}function c(t,e){function n(t){return 0>t?-1:0<t?1:0}var r;return 0===(r=n(t.getFullYear()-e.getFullYear()))&&0===(r=n(t.getMonth()-e.getMonth()))&&(r=n(t.getDate()-e.getDate())),r}function s(t){switch(t.getDay()){case 0:return new Date(t.getFullYear()-1,11,29);case 1:return t;case 2:return new Date(t.getFullYear(),0,3);case 3:return new Date(t.getFullYear(),0,2);case 4:return new Date(t.getFullYear(),0,1);case 5:return new Date(t.getFullYear()-1,11,31);case 6:return new Date(t.getFullYear()-1,11,30)}}function l(t){var e=t.Wb;for(t=new Date(new Date(t.Xb+1900,0,1).getTime());0<e;){var n=t.getMonth(),r=(ue(t.getFullYear())?ce:se)[n];if(!(e>r-t.getDate())){t.setDate(t.getDate()+e);break}e-=r-t.getDate()+1,t.setDate(1),11>n?t.setMonth(n+1):(t.setMonth(0),t.setFullYear(t.getFullYear()+1))}return n=new Date(t.getFullYear()+1,0,4),e=s(new Date(t.getFullYear(),0,4)),n=s(n),0>=c(e,t)?0>=c(n,t)?t.getFullYear()+1:t.getFullYear():t.getFullYear()-1}var f=a()[i+40>>2>>>0];for(var p in i={Lc:a()[i>>2>>>0],Kc:a()[i+4>>2>>>0],dc:a()[i+8>>2>>>0],jc:a()[i+12>>2>>>0],ec:a()[i+16>>2>>>0],Xb:a()[i+20>>2>>>0],Tb:a()[i+24>>2>>>0],Wb:a()[i+28>>2>>>0],Rc:a()[i+32>>2>>>0],Jc:a()[i+36>>2>>>0],Mc:f?Y(f):""},r=Y(r),f={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})r=r.replace(new RegExp(p,"g"),f[p]);var h="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),d="January February March April May June July August September October November December".split(" ");for(p in f={"%a":function(t){return h[t.Tb].substring(0,3)},"%A":function(t){return h[t.Tb]},"%b":function(t){return d[t.ec].substring(0,3)},"%B":function(t){return d[t.ec]},"%C":function(t){return u((t.Xb+1900)/100|0,2)},"%d":function(t){return u(t.jc,2)},"%e":function(t){return o(t.jc,2," ")},"%g":function(t){return l(t).toString().substring(2)},"%G":function(t){return l(t)},"%H":function(t){return u(t.dc,2)},"%I":function(t){return 0==(t=t.dc)?t=12:12<t&&(t-=12),u(t,2)},"%j":function(t){for(var e=0,n=0;n<=t.ec-1;e+=(ue(t.Xb+1900)?ce:se)[n++]);return u(t.jc+e,3)},"%m":function(t){return u(t.ec+1,2)},"%M":function(t){return u(t.Kc,2)},"%n":function(){return"\\n"},"%p":function(t){return 0<=t.dc&&12>t.dc?"AM":"PM"},"%S":function(t){return u(t.Lc,2)},"%t":function(){return"\\t"},"%u":function(t){return t.Tb||7},"%U":function(t){return u(Math.floor((t.Wb+7-t.Tb)/7),2)},"%V":function(t){var e=Math.floor((t.Wb+7-(t.Tb+6)%7)/7);if(2>=(t.Tb+371-t.Wb-2)%7&&e++,e)53==e&&(4==(n=(t.Tb+371-t.Wb)%7)||3==n&&ue(t.Xb)||(e=1));else{e=52;var n=(t.Tb+7-t.Wb-1)%7;(4==n||5==n&&ue(t.Xb%400-1))&&e++}return u(e,2)},"%w":function(t){return t.Tb},"%W":function(t){return u(Math.floor((t.Wb+7-(t.Tb+6)%7)/7),2)},"%y":function(t){return(t.Xb+1900).toString().substring(2)},"%Y":function(t){return t.Xb+1900},"%z":function(t){var e=0<=(t=t.Jc);return t=Math.abs(t)/60,(e?"+":"-")+String("0000"+(t/60*100+t%60)).slice(-4)},"%Z":function(t){return t.Mc},"%%":function(){return"%"}},r=r.replace(/%%/g,"\\0\\0"),f)r.includes(p)&&(r=r.replace(new RegExp(p,"g"),f[p](i)));return p=function(t){var e=Array(G(t)+1);return B(t,e,0,e.length),e}(r=r.replace(/\\0\\0/g,"%")),p.length>n?0:(function(t,n){e().set(t,n>>>0)}(p,t),p.length-1)}ht.fc();var fe=[null,ft,bt,Et,Ct,xt,Rt,jt,kt,Dt,Pt,Ut,Ft,It,Wt,Ht,Lt,Bt,Gt,Vt,Qt,Kt,te,ee,ne,ie],pe={b:function(t){return de(t+24)+24},n:function(t){return(t=new St(t)).uc()||(t.hc(!0),Ot--),t.ic(!1),_t.push(t),t.sc(),t.vc()},ma:function(t){throw x("Unexpected exception thrown, this is not properly supported - aborting"),H=!0,t},x:function(){Se(0);var t=_t.pop();if(t.Hc()&&!t.kc()){var e=t.Dc();e&&gt(e)(t.Zb),Tt(t.Zb)}At=0},e:function(){var t=At;if(!t)return oe=0;var e=new St(t);e.cc(t);var n=e.bc();if(!n)return oe=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(xe(i,n,e.Sb+16))return oe=i,t}return oe=n,t},l:function(){var t=At;if(!t)return oe=0;var e=new St(t);e.cc(t);var n=e.bc();if(!n)return oe=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(xe(i,n,e.Sb+16))return oe=i,t}return oe=n,t},h:function(){var t=At;if(!t)return oe=0;var e=new St(t);e.cc(t);var n=e.bc();if(!n)return oe=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(xe(i,n,e.Sb+16))return oe=i,t}return oe=n,t},t:Tt,M:function(){var t=_t.pop();t||at("no exception to throw");var e=t.Zb;throw t.kc()||(_t.push(t),t.ic(!0),t.hc(!1),Ot++),At=e,e},c:function(t,e,n){throw new St(t).fc(e,n),At=t,Ot++,t},pa:function(){return Ot},Fa:function(t){ge(t,!w,1,!v),ht.pc()},T:function(t){O?postMessage({cmd:"cleanupThread",thread:t}):st(t)},xa:Mt,j:function(t){throw At||(At=t),t},H:Ct,Ma:xt,ua:Rt,wa:jt,oa:kt,Ka:Dt,Ca:Pt,Ja:Ut,V:Ft,va:It,sa:Wt,La:Ht,ta:Lt,Ta:function(){},X:function(){at("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},Ua:function(){at("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},W:function(){return Date.now()},ya:function(){return 2097152},Oa:function(){return!0},za:function(t,e,n,r){if(t==e)setTimeout((()=>zt(r)));else if(O)postMessage({targetThread:t,cmd:"processProxyingQueue",queue:r});else{if(!(t=ht.Vb[t]))return;t.postMessage({cmd:"processProxyingQueue",queue:r})}return 1},Ea:function(){return-1},Pa:function(t,e){t=new Date(1e3*Yt(t)),a()[e>>2>>>0]=t.getUTCSeconds(),a()[e+4>>2>>>0]=t.getUTCMinutes(),a()[e+8>>2>>>0]=t.getUTCHours(),a()[e+12>>2>>>0]=t.getUTCDate(),a()[e+16>>2>>>0]=t.getUTCMonth(),a()[e+20>>2>>>0]=t.getUTCFullYear()-1900,a()[e+24>>2>>>0]=t.getUTCDay(),t=(t.getTime()-Date.UTC(t.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,a()[e+28>>2>>>0]=t},Qa:function(t,e){t=new Date(1e3*Yt(t)),a()[e>>2>>>0]=t.getSeconds(),a()[e+4>>2>>>0]=t.getMinutes(),a()[e+8>>2>>>0]=t.getHours(),a()[e+12>>2>>>0]=t.getDate(),a()[e+16>>2>>>0]=t.getMonth(),a()[e+20>>2>>>0]=t.getFullYear()-1900,a()[e+24>>2>>>0]=t.getDay();var n=new Date(t.getFullYear(),0,1),r=(t.getTime()-n.getTime())/864e5|0;a()[e+28>>2>>>0]=r,a()[e+36>>2>>>0]=-60*t.getTimezoneOffset(),r=new Date(t.getFullYear(),6,1).getTimezoneOffset(),t=0|(r!=(n=n.getTimezoneOffset())&&t.getTimezoneOffset()==Math.min(n,r)),a()[e+32>>2>>>0]=t},Ra:function(t){var e=new Date(a()[t+20>>2>>>0]+1900,a()[t+16>>2>>>0],a()[t+12>>2>>>0],a()[t+8>>2>>>0],a()[t+4>>2>>>0],a()[t>>2>>>0],0),n=a()[t+32>>2>>>0],r=e.getTimezoneOffset(),i=new Date(e.getFullYear(),0,1),o=new Date(e.getFullYear(),6,1).getTimezoneOffset(),u=i.getTimezoneOffset(),c=Math.min(u,o);return 0>n?a()[t+32>>2>>>0]=Number(o!=u&&c==r):0<n!=(c==r)&&(o=Math.max(u,o),e.setTime(e.getTime()+6e4*((0<n?c:o)-r))),a()[t+24>>2>>>0]=e.getDay(),n=(e.getTime()-i.getTime())/864e5|0,a()[t+28>>2>>>0]=n,a()[t>>2>>>0]=e.getSeconds(),a()[t+4>>2>>>0]=e.getMinutes(),a()[t+8>>2>>>0]=e.getHours(),a()[t+12>>2>>>0]=e.getDate(),a()[t+16>>2>>>0]=e.getMonth(),e.getTime()/1e3|0},Aa:Bt,Ba:Gt,Sa:function t(e,n,r){t.Ac||(t.Ac=!0,Vt(e,n,r))},y:function(){at("")},U:function(){if(!_&&!w){var t="Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread";vt||(vt={}),vt[t]||(vt[t]=1,_&&(t="warning: "+t),x(t))}},ra:function(){return 4294901760},B:wt,Ia:function(t,e,n){r().copyWithin(t>>>0,e>>>0,e+n>>>0)},F:function(){return _?n(993).cpus().length:navigator.hardwareConcurrency},Da:function(t,e,n){Xt.length=e,n>>=3;for(var r=0;r<e;r++)Xt[r]=o()[n+r>>>0];return(0>t?ut[-t-1]:fe[t]).apply(null,Xt)},qa:function(t){var e=r().length;if((t>>>=0)<=e||4294901760<t)return!1;for(var n=1;4>=n;n*=2){var a=e*(1+.2/n);a=Math.min(a,t+100663296);var i=Math;a=Math.max(t,a),i=i.min.call(i,4294901760,a+(65536-a%65536)%65536);t:{try{j.grow(i-D.byteLength+65535>>>16),N(j.buffer);var o=1;break t}catch(t){}o=void 0}if(o)return!0}return!1},Na:function(){throw"unwind"},Ga:Qt,Ha:Kt,J:pt,I:te,S:ee,ga:ne,R:ie,d:function(){return oe},na:function t(r,a){t.lc||(t.lc=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var t=new Uint8Array(1);return()=>(crypto.getRandomValues(t),t[0])}if(_)try{var e=n(Object(function(){var t=new Error("Cannot find module \'crypto\'");throw t.code="MODULE_NOT_FOUND",t}()));return()=>e.randomBytes(1)[0]}catch(t){}return()=>at("randomDevice")}());for(var i=0;i<a;i++)e()[r+i>>0>>>0]=t.lc();return 0},ia:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},ja:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},K:function(t){var e=Ee();try{return gt(t)()}catch(t){if(Me(e),t!==t+0)throw t;Se(1,0)}},f:function(t,e){var n=Ee();try{return gt(t)(e)}catch(t){if(Me(n),t!==t+0)throw t;Se(1,0)}},P:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},Q:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},k:function(t,e,n){var r=Ee();try{return gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},p:function(t,e,n,r){var a=Ee();try{return gt(t)(e,n,r)}catch(t){if(Me(a),t!==t+0)throw t;Se(1,0)}},q:function(t,e,n,r,a){var i=Ee();try{return gt(t)(e,n,r,a)}catch(t){if(Me(i),t!==t+0)throw t;Se(1,0)}},N:function(t,e,n,r,a,i){var o=Ee();try{return gt(t)(e,n,r,a,i)}catch(t){if(Me(o),t!==t+0)throw t;Se(1,0)}},s:function(t,e,n,r,a,i){var o=Ee();try{return gt(t)(e,n,r,a,i)}catch(t){if(Me(o),t!==t+0)throw t;Se(1,0)}},w:function(t,e,n,r,a,i,o){var u=Ee();try{return gt(t)(e,n,r,a,i,o)}catch(t){if(Me(u),t!==t+0)throw t;Se(1,0)}},L:function(t,e,n,r,a,i,o,u){var c=Ee();try{return gt(t)(e,n,r,a,i,o,u)}catch(t){if(Me(c),t!==t+0)throw t;Se(1,0)}},E:function(t,e,n,r,a,i,o,u,c,s,l,f){var p=Ee();try{return gt(t)(e,n,r,a,i,o,u,c,s,l,f)}catch(t){if(Me(p),t!==t+0)throw t;Se(1,0)}},aa:function(t,e,n,r,a,i,o,u){var c=Ee();try{return He(t,e,n,r,a,i,o,u)}catch(t){if(Me(c),t!==t+0)throw t;Se(1,0)}},_:function(t,e,n,r,a,i,o){var u=Ee();try{return ke(t,e,n,r,a,i,o)}catch(t){if(Me(u),t!==t+0)throw t;Se(1,0)}},Z:function(t,e,n,r,a){var i=Ee();try{return Le(t,e,n,r,a)}catch(t){if(Me(i),t!==t+0)throw t;Se(1,0)}},ca:function(t,e,n,r){var a=Ee();try{return Ie(t,e,n,r)}catch(t){if(Me(a),t!==t+0)throw t;Se(1,0)}},$:function(t){var e=Ee();try{return je(t)}catch(t){if(Me(e),t!==t+0)throw t;Se(1,0)}},ba:function(t,e){var n=Ee();try{return We(t,e)}catch(t){if(Me(n),t!==t+0)throw t;Se(1,0)}},Y:function(t,e,n){var r=Ee();try{return De(t,e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},g:function(t){var e=Ee();try{gt(t)()}catch(t){if(Me(e),t!==t+0)throw t;Se(1,0)}},r:function(t,e){var n=Ee();try{gt(t)(e)}catch(t){if(Me(n),t!==t+0)throw t;Se(1,0)}},i:function(t,e,n){var r=Ee();try{gt(t)(e,n)}catch(t){if(Me(r),t!==t+0)throw t;Se(1,0)}},ha:function(t,e,n,r){var a=Ee();try{gt(t)(e,n,r)}catch(t){if(Me(a),t!==t+0)throw t;Se(1,0)}},m:function(t,e,n,r){var a=Ee();try{gt(t)(e,n,r)}catch(t){if(Me(a),t!==t+0)throw t;Se(1,0)}},v:function(t,e,n,r,a){var i=Ee();try{gt(t)(e,n,r,a)}catch(t){if(Me(i),t!==t+0)throw t;Se(1,0)}},u:function(t,e,n,r,a,i){var o=Ee();try{gt(t)(e,n,r,a,i)}catch(t){if(Me(o),t!==t+0)throw t;Se(1,0)}},O:function(t,e,n,r,a,i,o){var u=Ee();try{gt(t)(e,n,r,a,i,o)}catch(t){if(Me(u),t!==t+0)throw t;Se(1,0)}},A:function(t,e,n,r,a,i,o,u){var c=Ee();try{gt(t)(e,n,r,a,i,o,u)}catch(t){if(Me(c),t!==t+0)throw t;Se(1,0)}},ka:function(t,e,n,r,a,i,o,u,c){var s=Ee();try{gt(t)(e,n,r,a,i,o,u,c)}catch(t){if(Me(s),t!==t+0)throw t;Se(1,0)}},C:function(t,e,n,r,a,i,o,u,c,s,l){var f=Ee();try{gt(t)(e,n,r,a,i,o,u,c,s,l)}catch(t){if(Me(f),t!==t+0)throw t;Se(1,0)}},D:function(t,e,n,r,a,i,o,u,c,s,l,f,p,h,d,y){var b=Ee();try{gt(t)(e,n,r,a,i,o,u,c,s,l,f,p,h,d,y)}catch(t){if(Me(b),t!==t+0)throw t;Se(1,0)}},fa:function(t,e,n,r,a,i,o,u){var c=Ee();try{Pe(t,e,n,r,a,i,o,u)}catch(t){if(Me(c),t!==t+0)throw t;Se(1,0)}},da:function(t,e,n,r,a,i,o,u,c,s,l,f){var p=Ee();try{Fe(t,e,n,r,a,i,o,u,c,s,l,f)}catch(t){if(Me(p),t!==t+0)throw t;Se(1,0)}},ea:function(t,e,n,r,a,i){var o=Ee();try{Ue(t,e,n,r,a,i)}catch(t){if(Me(o),t!==t+0)throw t;Se(1,0)}},o:function(t){return t},a:j||u.wasmMemory,G:function(t){oe=t},la:le,z:function(t,e,n,r){return le(t,e,n,r)}};!function(){function t(t,e){u.asm=t.exports,ht.qc.push(u.asm.sb),$=u.asm.ub,X.unshift(u.asm.Va),k=e,O||(et--,u.monitorRunDependencies&&u.monitorRunDependencies(et),0==et&&(null!==nt&&(clearInterval(nt),nt=null),rt&&(t=rt,rt=null,t())))}function e(e){t(e.instance,e.module)}function n(t){return function(){if(!M&&(v||w)){if("function"==typeof fetch&&!tt.startsWith("file://"))return fetch(tt,{credentials:"same-origin"}).then((function(t){if(!t.ok)throw"failed to load wasm binary file at \'"+tt+"\'";return t.arrayBuffer()})).catch((function(){return ot()}));if(f)return new Promise((function(t,e){f(tt,(function(e){t(new Uint8Array(e))}),e)}))}return Promise.resolve().then((function(){return ot()}))}().then((function(t){return WebAssembly.instantiate(t,r)})).then((function(t){return t})).then(t,(function(t){x("failed to asynchronously prepare wasm: "+t),at(t)}))}var r={a:pe};if(O||(et++,u.monitorRunDependencies&&u.monitorRunDependencies(et)),u.instantiateWasm)try{return u.instantiateWasm(r,t)}catch(t){return x("Module.instantiateWasm callback failed with error: "+t),!1}(M||"function"!=typeof WebAssembly.instantiateStreaming||it()||tt.startsWith("file://")||_||"function"!=typeof fetch?n(e):fetch(tt,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,r).then(e,(function(t){return x("wasm streaming compile failed: "+t),x("falling back to ArrayBuffer instantiation"),n(e)}))}))).catch(s)}(),u.___wasm_call_ctors=function(){return(u.___wasm_call_ctors=u.asm.Va).apply(null,arguments)},u._OrtInit=function(){return(u._OrtInit=u.asm.Wa).apply(null,arguments)},u._OrtCreateSessionOptions=function(){return(u._OrtCreateSessionOptions=u.asm.Xa).apply(null,arguments)},u._OrtAppendExecutionProvider=function(){return(u._OrtAppendExecutionProvider=u.asm.Ya).apply(null,arguments)},u._OrtAddSessionConfigEntry=function(){return(u._OrtAddSessionConfigEntry=u.asm.Za).apply(null,arguments)},u._OrtReleaseSessionOptions=function(){return(u._OrtReleaseSessionOptions=u.asm._a).apply(null,arguments)},u._OrtCreateSession=function(){return(u._OrtCreateSession=u.asm.$a).apply(null,arguments)},u._OrtReleaseSession=function(){return(u._OrtReleaseSession=u.asm.ab).apply(null,arguments)},u._OrtGetInputCount=function(){return(u._OrtGetInputCount=u.asm.bb).apply(null,arguments)},u._OrtGetOutputCount=function(){return(u._OrtGetOutputCount=u.asm.cb).apply(null,arguments)},u._OrtGetInputName=function(){return(u._OrtGetInputName=u.asm.db).apply(null,arguments)},u._OrtGetOutputName=function(){return(u._OrtGetOutputName=u.asm.eb).apply(null,arguments)},u._OrtFree=function(){return(u._OrtFree=u.asm.fb).apply(null,arguments)},u._OrtCreateTensor=function(){return(u._OrtCreateTensor=u.asm.gb).apply(null,arguments)},u._OrtGetTensorData=function(){return(u._OrtGetTensorData=u.asm.hb).apply(null,arguments)},u._OrtReleaseTensor=function(){return(u._OrtReleaseTensor=u.asm.ib).apply(null,arguments)},u._OrtCreateRunOptions=function(){return(u._OrtCreateRunOptions=u.asm.jb).apply(null,arguments)},u._OrtAddRunConfigEntry=function(){return(u._OrtAddRunConfigEntry=u.asm.kb).apply(null,arguments)},u._OrtReleaseRunOptions=function(){return(u._OrtReleaseRunOptions=u.asm.lb).apply(null,arguments)},u._OrtRun=function(){return(u._OrtRun=u.asm.mb).apply(null,arguments)},u._OrtEndProfiling=function(){return(u._OrtEndProfiling=u.asm.nb).apply(null,arguments)};var he=u._pthread_self=function(){return(he=u._pthread_self=u.asm.ob).apply(null,arguments)},de=u._malloc=function(){return(de=u._malloc=u.asm.pb).apply(null,arguments)},ye=u._free=function(){return(ye=u._free=u.asm.qb).apply(null,arguments)},be=u._fflush=function(){return(be=u._fflush=u.asm.rb).apply(null,arguments)};u.__emscripten_tls_init=function(){return(u.__emscripten_tls_init=u.asm.sb).apply(null,arguments)};var me=u.___funcs_on_exit=function(){return(me=u.___funcs_on_exit=u.asm.tb).apply(null,arguments)},ge=u.__emscripten_thread_init=function(){return(ge=u.__emscripten_thread_init=u.asm.vb).apply(null,arguments)};u.__emscripten_thread_crashed=function(){return(u.__emscripten_thread_crashed=u.asm.wb).apply(null,arguments)};var ve,we=u._emscripten_run_in_main_runtime_thread_js=function(){return(we=u._emscripten_run_in_main_runtime_thread_js=u.asm.xb).apply(null,arguments)},_e=u.__emscripten_proxy_execute_task_queue=function(){return(_e=u.__emscripten_proxy_execute_task_queue=u.asm.yb).apply(null,arguments)},Oe=u.__emscripten_thread_free_data=function(){return(Oe=u.__emscripten_thread_free_data=u.asm.zb).apply(null,arguments)},Ae=u.__emscripten_thread_exit=function(){return(Ae=u.__emscripten_thread_exit=u.asm.Ab).apply(null,arguments)},Se=u._setThrew=function(){return(Se=u._setThrew=u.asm.Bb).apply(null,arguments)},Te=u._emscripten_stack_set_limits=function(){return(Te=u._emscripten_stack_set_limits=u.asm.Cb).apply(null,arguments)},Ee=u.stackSave=function(){return(Ee=u.stackSave=u.asm.Db).apply(null,arguments)},Me=u.stackRestore=function(){return(Me=u.stackRestore=u.asm.Eb).apply(null,arguments)},Ce=u.stackAlloc=function(){return(Ce=u.stackAlloc=u.asm.Fb).apply(null,arguments)},xe=u.___cxa_can_catch=function(){return(xe=u.___cxa_can_catch=u.asm.Gb).apply(null,arguments)},Re=u.___cxa_is_pointer_type=function(){return(Re=u.___cxa_is_pointer_type=u.asm.Hb).apply(null,arguments)},je=u.dynCall_j=function(){return(je=u.dynCall_j=u.asm.Ib).apply(null,arguments)},ke=u.dynCall_iiiiij=function(){return(ke=u.dynCall_iiiiij=u.asm.Jb).apply(null,arguments)},De=u.dynCall_jii=function(){return(De=u.dynCall_jii=u.asm.Kb).apply(null,arguments)},Pe=u.dynCall_viiiiij=function(){return(Pe=u.dynCall_viiiiij=u.asm.Lb).apply(null,arguments)},Ue=u.dynCall_vjji=function(){return(Ue=u.dynCall_vjji=u.asm.Mb).apply(null,arguments)},Fe=u.dynCall_viiijjjii=function(){return(Fe=u.dynCall_viiijjjii=u.asm.Nb).apply(null,arguments)},Ie=u.dynCall_iij=function(){return(Ie=u.dynCall_iij=u.asm.Ob).apply(null,arguments)},We=u.dynCall_ji=function(){return(We=u.dynCall_ji=u.asm.Pb).apply(null,arguments)},He=u.dynCall_iiiiiij=function(){return(He=u.dynCall_iiiiiij=u.asm.Qb).apply(null,arguments)},Le=u.dynCall_iiij=function(){return(Le=u.dynCall_iiij=u.asm.Rb).apply(null,arguments)};function ze(){function t(){if(!ve&&(ve=!0,u.calledRun=!0,!H)&&(O||dt(X),c(u),u.onRuntimeInitialized&&u.onRuntimeInitialized(),!O)){if(u.postRun)for("function"==typeof u.postRun&&(u.postRun=[u.postRun]);u.postRun.length;){var t=u.postRun.shift();Z.unshift(t)}dt(Z)}}if(!(0<et))if(O)c(u),O||dt(X),postMessage({cmd:"loaded"});else{if(u.preRun)for("function"==typeof u.preRun&&(u.preRun=[u.preRun]);u.preRun.length;)K();dt(q),0<et||(u.setStatus?(u.setStatus("Running..."),setTimeout((function(){setTimeout((function(){u.setStatus("")}),1),t()}),1)):t())}}if(u.UTF8ToString=Y,u.stringToUTF8=function(t,e,n){return B(t,r(),e,n)},u.lengthBytesUTF8=G,u.keepRuntimeAlive=Q,u.wasmMemory=j,u.stackSave=Ee,u.stackRestore=Me,u.stackAlloc=Ce,u.ExitStatus=ct,u.PThread=ht,rt=function t(){ve||ze(),ve||(rt=t)},u.preInit)for("function"==typeof u.preInit&&(u.preInit=[u.preInit]);0<u.preInit.length;)u.preInit.pop()();return ze(),t.ready});t.exports=r},932:(t,e,n)=>{var _scriptDir,r=(_scriptDir=(_scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(t){var e,r,a;t=t||{},e||(e=void 0!==t?t:{}),e.ready=new Promise((function(t,e){r=t,a=e}));var i,o,u,c,s,l,f=Object.assign({},e),p="./this.program",h=(t,e)=>{throw e},d="object"==typeof window,y="function"==typeof importScripts,b="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,m="";b?(m=y?n(908).dirname(m)+"/":"//",l=()=>{s||(c=n(384),s=n(908))},i=function(t,e){return l(),t=s.normalize(t),c.readFileSync(t,e?void 0:"utf8")},u=t=>((t=i(t,!0)).buffer||(t=new Uint8Array(t)),t),o=(t,e,n)=>{l(),t=s.normalize(t),c.readFile(t,(function(t,r){t?n(t):e(r.buffer)}))},1<process.argv.length&&(p=process.argv[1].replace(/\\\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(t){if(!(t instanceof J))throw t})),process.on("unhandledRejection",(function(t){throw t})),h=(t,e)=>{if(_||0<L)throw process.exitCode=t,e;e instanceof J||w("exiting due to exception: "+e),process.exit(t)},e.inspect=function(){return"[Emscripten Module object]"}):(d||y)&&(y?m=self.location.href:"undefined"!=typeof document&&document.currentScript&&(m=document.currentScript.src),_scriptDir&&(m=_scriptDir),m=0!==m.indexOf("blob:")?m.substr(0,m.replace(/[?#].*/,"").lastIndexOf("/")+1):"",i=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.send(null),e.responseText},y&&(u=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.responseType="arraybuffer",e.send(null),new Uint8Array(e.response)}),o=(t,e,n)=>{var r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?e(r.response):n()},r.onerror=n,r.send(null)});var g,v=e.print||console.log.bind(console),w=e.printErr||console.warn.bind(console);Object.assign(e,f),f=null,e.thisProgram&&(p=e.thisProgram),e.quit&&(h=e.quit),e.wasmBinary&&(g=e.wasmBinary);var _=e.noExitRuntime||!1;"object"!=typeof WebAssembly&&V("no native wasm support detected");var O,A,S,T,E,M,C=!1,x="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function R(t,e,n){var r=(e>>>=0)+n;for(n=e;t[n]&&!(n>=r);)++n;if(16<n-e&&t.buffer&&x)return x.decode(t.subarray(e,n));for(r="";e<n;){var a=t[e++];if(128&a){var i=63&t[e++];if(192==(224&a))r+=String.fromCharCode((31&a)<<6|i);else{var o=63&t[e++];65536>(a=224==(240&a)?(15&a)<<12|i<<6|o:(7&a)<<18|i<<12|o<<6|63&t[e++])?r+=String.fromCharCode(a):(a-=65536,r+=String.fromCharCode(55296|a>>10,56320|1023&a))}}else r+=String.fromCharCode(a)}return r}function j(t,e){return(t>>>=0)?R(T,t,e):""}function k(t,e,n,r){if(!(0<r))return 0;var a=n>>>=0;r=n+r-1;for(var i=0;i<t.length;++i){var o=t.charCodeAt(i);if(55296<=o&&57343>=o&&(o=65536+((1023&o)<<10)|1023&t.charCodeAt(++i)),127>=o){if(n>=r)break;e[n++>>>0]=o}else{if(2047>=o){if(n+1>=r)break;e[n++>>>0]=192|o>>6}else{if(65535>=o){if(n+2>=r)break;e[n++>>>0]=224|o>>12}else{if(n+3>=r)break;e[n++>>>0]=240|o>>18,e[n++>>>0]=128|o>>12&63}e[n++>>>0]=128|o>>6&63}e[n++>>>0]=128|63&o}}return e[n>>>0]=0,n-a}function D(t){for(var e=0,n=0;n<t.length;++n){var r=t.charCodeAt(n);127>=r?e++:2047>=r?e+=2:55296<=r&&57343>=r?(e+=4,++n):e+=3}return e}function P(){var t=O.buffer;A=t,e.HEAP8=S=new Int8Array(t),e.HEAP16=new Int16Array(t),e.HEAP32=E=new Int32Array(t),e.HEAPU8=T=new Uint8Array(t),e.HEAPU16=new Uint16Array(t),e.HEAPU32=M=new Uint32Array(t),e.HEAPF32=new Float32Array(t),e.HEAPF64=new Float64Array(t)}var U,F=[],I=[],W=[],H=[],L=0;function z(){var t=e.preRun.shift();F.unshift(t)}var Y,B=0,G=null,N=null;function V(t){throw e.onAbort&&e.onAbort(t),w(t="Aborted("+t+")"),C=!0,t=new WebAssembly.RuntimeError(t+". Build with -sASSERTIONS for more info."),a(t),t}function $(){return Y.startsWith("data:application/octet-stream;base64,")}if(Y="ort-wasm.wasm",!$()){var q=Y;Y=e.locateFile?e.locateFile(q,m):m+q}function X(){var t=Y;try{if(t==Y&&g)return new Uint8Array(g);if(u)return u(t);throw"both async and sync fetching of the wasm failed"}catch(t){V(t)}}function J(t){this.name="ExitStatus",this.message="Program terminated with exit("+t+")",this.status=t}function Z(t){for(;0<t.length;)t.shift()(e)}var Q=[],K=0,tt=0;function et(t){this.Db=t,this.zb=t-24,this.Ub=function(t){M[this.zb+4>>2>>>0]=t},this.Eb=function(){return M[this.zb+4>>2>>>0]},this.Sb=function(t){M[this.zb+8>>2>>>0]=t},this.Wb=function(){return M[this.zb+8>>2>>>0]},this.Tb=function(){E[this.zb>>2>>>0]=0},this.Ib=function(t){S[this.zb+12>>0>>>0]=t?1:0},this.Pb=function(){return 0!=S[this.zb+12>>0>>>0]},this.Jb=function(t){S[this.zb+13>>0>>>0]=t?1:0},this.Lb=function(){return 0!=S[this.zb+13>>0>>>0]},this.Rb=function(t,e){this.Fb(0),this.Ub(t),this.Sb(e),this.Tb(),this.Ib(!1),this.Jb(!1)},this.Nb=function(){E[this.zb>>2>>>0]+=1},this.Xb=function(){var t=E[this.zb>>2>>>0];return E[this.zb>>2>>>0]=t-1,1===t},this.Fb=function(t){M[this.zb+16>>2>>>0]=t},this.Ob=function(){return M[this.zb+16>>2>>>0]},this.Qb=function(){if(Mt(this.Eb()))return M[this.Db>>2>>>0];var t=this.Ob();return 0!==t?t:this.Db}}function nt(t){return vt(new et(t).zb)}var rt=[];function at(t){var e=rt[t];return e||(t>=rt.length&&(rt.length=t+1),rt[t]=e=U.get(t)),e}function it(t){var e=D(t)+1,n=gt(e);return n&&k(t,S,n,e),n}var ot={};function ut(){if(!ct){var t,e={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:p||"./this.program"};for(t in ot)void 0===ot[t]?delete e[t]:e[t]=ot[t];var n=[];for(t in e)n.push(t+"="+e[t]);ct=n}return ct}var ct,st=[null,[],[]];function lt(t,e){var n=st[t];0===e||10===e?((1===t?v:w)(R(n,0)),n.length=0):n.push(e)}var ft=0;function pt(t){return 0==t%4&&(0!=t%100||0==t%400)}var ht=[31,29,31,30,31,30,31,31,30,31,30,31],dt=[31,28,31,30,31,30,31,31,30,31,30,31];function yt(t,e,n,r){function a(t,e,n){for(t="number"==typeof t?t.toString():t||"";t.length<e;)t=n[0]+t;return t}function i(t,e){return a(t,e,"0")}function o(t,e){function n(t){return 0>t?-1:0<t?1:0}var r;return 0===(r=n(t.getFullYear()-e.getFullYear()))&&0===(r=n(t.getMonth()-e.getMonth()))&&(r=n(t.getDate()-e.getDate())),r}function u(t){switch(t.getDay()){case 0:return new Date(t.getFullYear()-1,11,29);case 1:return t;case 2:return new Date(t.getFullYear(),0,3);case 3:return new Date(t.getFullYear(),0,2);case 4:return new Date(t.getFullYear(),0,1);case 5:return new Date(t.getFullYear()-1,11,31);case 6:return new Date(t.getFullYear()-1,11,30)}}function c(t){var e=t.Bb;for(t=new Date(new Date(t.Cb+1900,0,1).getTime());0<e;){var n=t.getMonth(),r=(pt(t.getFullYear())?ht:dt)[n];if(!(e>r-t.getDate())){t.setDate(t.getDate()+e);break}e-=r-t.getDate()+1,t.setDate(1),11>n?t.setMonth(n+1):(t.setMonth(0),t.setFullYear(t.getFullYear()+1))}return n=new Date(t.getFullYear()+1,0,4),e=u(new Date(t.getFullYear(),0,4)),n=u(n),0>=o(e,t)?0>=o(n,t)?t.getFullYear()+1:t.getFullYear():t.getFullYear()-1}var s=E[r+40>>2>>>0];for(var l in r={$b:E[r>>2>>>0],Zb:E[r+4>>2>>>0],Gb:E[r+8>>2>>>0],Kb:E[r+12>>2>>>0],Hb:E[r+16>>2>>>0],Cb:E[r+20>>2>>>0],Ab:E[r+24>>2>>>0],Bb:E[r+28>>2>>>0],bc:E[r+32>>2>>>0],Yb:E[r+36>>2>>>0],ac:s?j(s):""},n=j(n),s={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})n=n.replace(new RegExp(l,"g"),s[l]);var f="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),p="January February March April May June July August September October November December".split(" ");for(l in s={"%a":function(t){return f[t.Ab].substring(0,3)},"%A":function(t){return f[t.Ab]},"%b":function(t){return p[t.Hb].substring(0,3)},"%B":function(t){return p[t.Hb]},"%C":function(t){return i((t.Cb+1900)/100|0,2)},"%d":function(t){return i(t.Kb,2)},"%e":function(t){return a(t.Kb,2," ")},"%g":function(t){return c(t).toString().substring(2)},"%G":function(t){return c(t)},"%H":function(t){return i(t.Gb,2)},"%I":function(t){return 0==(t=t.Gb)?t=12:12<t&&(t-=12),i(t,2)},"%j":function(t){for(var e=0,n=0;n<=t.Hb-1;e+=(pt(t.Cb+1900)?ht:dt)[n++]);return i(t.Kb+e,3)},"%m":function(t){return i(t.Hb+1,2)},"%M":function(t){return i(t.Zb,2)},"%n":function(){return"\\n"},"%p":function(t){return 0<=t.Gb&&12>t.Gb?"AM":"PM"},"%S":function(t){return i(t.$b,2)},"%t":function(){return"\\t"},"%u":function(t){return t.Ab||7},"%U":function(t){return i(Math.floor((t.Bb+7-t.Ab)/7),2)},"%V":function(t){var e=Math.floor((t.Bb+7-(t.Ab+6)%7)/7);if(2>=(t.Ab+371-t.Bb-2)%7&&e++,e)53==e&&(4==(n=(t.Ab+371-t.Bb)%7)||3==n&&pt(t.Cb)||(e=1));else{e=52;var n=(t.Ab+7-t.Bb-1)%7;(4==n||5==n&&pt(t.Cb%400-1))&&e++}return i(e,2)},"%w":function(t){return t.Ab},"%W":function(t){return i(Math.floor((t.Bb+7-(t.Ab+6)%7)/7),2)},"%y":function(t){return(t.Cb+1900).toString().substring(2)},"%Y":function(t){return t.Cb+1900},"%z":function(t){var e=0<=(t=t.Yb);return t=Math.abs(t)/60,(e?"+":"-")+String("0000"+(t/60*100+t%60)).slice(-4)},"%Z":function(t){return t.ac},"%%":function(){return"%"}},n=n.replace(/%%/g,"\\0\\0"),s)n.includes(l)&&(n=n.replace(new RegExp(l,"g"),s[l](r)));return l=function(t){var e=Array(D(t)+1);return k(t,e,0,e.length),e}(n=n.replace(/\\0\\0/g,"%")),l.length>e?0:(S.set(l,t>>>0),l.length-1)}var bt={a:function(t){return gt(t+24)+24},m:function(t){return(t=new et(t)).Pb()||(t.Ib(!0),K--),t.Jb(!1),Q.push(t),t.Nb(),t.Qb()},ia:function(t){throw w("Unexpected exception thrown, this is not properly supported - aborting"),C=!0,t},w:function(){Ot(0);var t=Q.pop();if(t.Xb()&&!t.Lb()){var e=t.Wb();e&&at(e)(t.Db),nt(t.Db)}tt=0},d:function(){var t=tt;if(!t)return ft=0;var e=new et(t);e.Fb(t);var n=e.Eb();if(!n)return ft=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(Et(i,n,e.zb+16))return ft=i,t}return ft=n,t},k:function(){var t=tt;if(!t)return ft=0;var e=new et(t);e.Fb(t);var n=e.Eb();if(!n)return ft=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(Et(i,n,e.zb+16))return ft=i,t}return ft=n,t},g:function(){var t=tt;if(!t)return ft=0;var e=new et(t);e.Fb(t);var n=e.Eb();if(!n)return ft=0,t;for(var r=Array.prototype.slice.call(arguments),a=0;a<r.length;a++){var i=r[a];if(0===i||i===n)break;if(Et(i,n,e.zb+16))return ft=i,t}return ft=n,t},s:nt,L:function(){var t=Q.pop();t||V("no exception to throw");var e=t.Db;throw t.Lb()||(Q.push(t),t.Jb(!0),t.Ib(!1),K++),tt=e,e},b:function(t,e,n){throw new et(t).Rb(e,n),tt=t,K++,t},la:function(){return K},i:function(t){throw tt||(tt=t),t},H:function(){return 0},Ba:function(){},pa:function(){},ra:function(){},ka:function(){return 0},za:function(){},ua:function(){},ya:function(){},R:function(){},qa:function(){},na:function(){},Aa:function(){},oa:function(){},Ha:function(){},Ja:function(){V("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},Ia:function(){V("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},S:function(){return Date.now()},Ca:function(){return!0},Da:function(t,e){t=new Date(1e3*(M[t>>>2]+4294967296*E[t+4>>>2])),E[e>>2>>>0]=t.getUTCSeconds(),E[e+4>>2>>>0]=t.getUTCMinutes(),E[e+8>>2>>>0]=t.getUTCHours(),E[e+12>>2>>>0]=t.getUTCDate(),E[e+16>>2>>>0]=t.getUTCMonth(),E[e+20>>2>>>0]=t.getUTCFullYear()-1900,E[e+24>>2>>>0]=t.getUTCDay(),E[e+28>>2>>>0]=(t.getTime()-Date.UTC(t.getUTCFullYear(),0,1,0,0,0,0))/864e5|0},Ea:function(t,e){t=new Date(1e3*(M[t>>>2]+4294967296*E[t+4>>>2])),E[e>>2>>>0]=t.getSeconds(),E[e+4>>2>>>0]=t.getMinutes(),E[e+8>>2>>>0]=t.getHours(),E[e+12>>2>>>0]=t.getDate(),E[e+16>>2>>>0]=t.getMonth(),E[e+20>>2>>>0]=t.getFullYear()-1900,E[e+24>>2>>>0]=t.getDay();var n=new Date(t.getFullYear(),0,1);E[e+28>>2>>>0]=(t.getTime()-n.getTime())/864e5|0,E[e+36>>2>>>0]=-60*t.getTimezoneOffset();var r=new Date(t.getFullYear(),6,1).getTimezoneOffset();n=n.getTimezoneOffset(),E[e+32>>2>>>0]=0|(r!=n&&t.getTimezoneOffset()==Math.min(n,r))},Fa:function(t){var e=new Date(E[t+20>>2>>>0]+1900,E[t+16>>2>>>0],E[t+12>>2>>>0],E[t+8>>2>>>0],E[t+4>>2>>>0],E[t>>2>>>0],0),n=E[t+32>>2>>>0],r=e.getTimezoneOffset(),a=new Date(e.getFullYear(),0,1),i=new Date(e.getFullYear(),6,1).getTimezoneOffset(),o=a.getTimezoneOffset(),u=Math.min(o,i);return 0>n?E[t+32>>2>>>0]=Number(i!=o&&u==r):0<n!=(u==r)&&(i=Math.max(o,i),e.setTime(e.getTime()+6e4*((0<n?u:i)-r))),E[t+24>>2>>>0]=e.getDay(),E[t+28>>2>>>0]=(e.getTime()-a.getTime())/864e5|0,E[t>>2>>>0]=e.getSeconds(),E[t+4>>2>>>0]=e.getMinutes(),E[t+8>>2>>>0]=e.getHours(),E[t+12>>2>>>0]=e.getDate(),E[t+16>>2>>>0]=e.getMonth(),e.getTime()/1e3|0},sa:function(){return-52},ta:function(){},Ga:function t(e,n,r){t.Vb||(t.Vb=!0,function(t,e,n){function r(t){return(t=t.toTimeString().match(/\\(([A-Za-z ]+)\\)$/))?t[1]:"GMT"}var a=(new Date).getFullYear(),i=new Date(a,0,1),o=new Date(a,6,1);a=i.getTimezoneOffset();var u=o.getTimezoneOffset();E[t>>2>>>0]=60*Math.max(a,u),E[e>>2>>>0]=Number(a!=u),t=r(i),e=r(o),t=it(t),e=it(e),u<a?(M[n>>2>>>0]=t,M[n+4>>2>>>0]=e):(M[n>>2>>>0]=e,M[n+4>>2>>>0]=t)}(e,n,r))},B:function(){V("")},ma:function(){return 4294901760},I:b?()=>{var t=process.hrtime();return 1e3*t[0]+t[1]/1e6}:()=>performance.now(),xa:function(t,e,n){T.copyWithin(t>>>0,e>>>0,e+n>>>0)},G:function(t){var e=T.length;if(4294901760<(t>>>=0))return!1;for(var n=1;4>=n;n*=2){var r=e*(1+.2/n);r=Math.min(r,t+100663296);var a=Math;r=Math.max(t,r),a=a.min.call(a,4294901760,r+(65536-r%65536)%65536);t:{try{O.grow(a-A.byteLength+65535>>>16),P();var i=1;break t}catch(t){}i=void 0}if(i)return!0}return!1},va:function(t,e){var n=0;return ut().forEach((function(r,a){var i=e+n;for(a=M[t+4*a>>2>>>0]=i,i=0;i<r.length;++i)S[a++>>0>>>0]=r.charCodeAt(i);S[a>>0>>>0]=0,n+=r.length+1})),0},wa:function(t,e){var n=ut();M[t>>2>>>0]=n.length;var r=0;return n.forEach((function(t){r+=t.length+1})),M[e>>2>>>0]=r,0},ba:function(t){_||0<L||(_t(),Z(W),wt(0),st[1].length&&lt(1,10),st[2].length&&lt(2,10)),_||0<L||(e.onExit&&e.onExit(t),C=!0),h(t,new J(t))},E:function(){return 52},Q:function(){return 52},ca:function(){return 70},P:function(t,e,n,r){for(var a=0,i=0;i<n;i++){var o=M[e>>2>>>0],u=M[e+4>>2>>>0];e+=8;for(var c=0;c<u;c++)lt(t,T[o+c>>>0]);a+=u}return M[r>>2>>>0]=a,0},c:function(){return ft},ja:function t(e,r){t.Mb||(t.Mb=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var t=new Uint8Array(1);return()=>(crypto.getRandomValues(t),t[0])}if(b)try{var e=n(Object(function(){var t=new Error("Cannot find module \'crypto\'");throw t.code="MODULE_NOT_FOUND",t}()));return()=>e.randomBytes(1)[0]}catch(t){}return()=>V("randomDevice")}());for(var a=0;a<r;a++)S[e+a>>0>>>0]=t.Mb();return 0},ea:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},fa:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},J:function(t){var e=At();try{return at(t)()}catch(t){if(St(e),t!==t+0)throw t;Ot(1,0)}},e:function(t,e){var n=At();try{return at(t)(e)}catch(t){if(St(n),t!==t+0)throw t;Ot(1,0)}},N:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},O:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},j:function(t,e,n){var r=At();try{return at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},o:function(t,e,n,r){var a=At();try{return at(t)(e,n,r)}catch(t){if(St(a),t!==t+0)throw t;Ot(1,0)}},p:function(t,e,n,r,a){var i=At();try{return at(t)(e,n,r,a)}catch(t){if(St(i),t!==t+0)throw t;Ot(1,0)}},M:function(t,e,n,r,a,i){var o=At();try{return at(t)(e,n,r,a,i)}catch(t){if(St(o),t!==t+0)throw t;Ot(1,0)}},r:function(t,e,n,r,a,i){var o=At();try{return at(t)(e,n,r,a,i)}catch(t){if(St(o),t!==t+0)throw t;Ot(1,0)}},v:function(t,e,n,r,a,i,o){var u=At();try{return at(t)(e,n,r,a,i,o)}catch(t){if(St(u),t!==t+0)throw t;Ot(1,0)}},K:function(t,e,n,r,a,i,o,u){var c=At();try{return at(t)(e,n,r,a,i,o,u)}catch(t){if(St(c),t!==t+0)throw t;Ot(1,0)}},D:function(t,e,n,r,a,i,o,u,c,s,l,f){var p=At();try{return at(t)(e,n,r,a,i,o,u,c,s,l,f)}catch(t){if(St(p),t!==t+0)throw t;Ot(1,0)}},X:function(t,e,n,r,a,i,o,u){var c=At();try{return Ft(t,e,n,r,a,i,o,u)}catch(t){if(St(c),t!==t+0)throw t;Ot(1,0)}},V:function(t,e,n,r,a,i,o){var u=At();try{return xt(t,e,n,r,a,i,o)}catch(t){if(St(u),t!==t+0)throw t;Ot(1,0)}},U:function(t,e,n,r,a){var i=At();try{return It(t,e,n,r,a)}catch(t){if(St(i),t!==t+0)throw t;Ot(1,0)}},Z:function(t,e,n,r){var a=At();try{return Pt(t,e,n,r)}catch(t){if(St(a),t!==t+0)throw t;Ot(1,0)}},W:function(t){var e=At();try{return Ct(t)}catch(t){if(St(e),t!==t+0)throw t;Ot(1,0)}},Y:function(t,e){var n=At();try{return Ut(t,e)}catch(t){if(St(n),t!==t+0)throw t;Ot(1,0)}},T:function(t,e,n){var r=At();try{return Rt(t,e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},f:function(t){var e=At();try{at(t)()}catch(t){if(St(e),t!==t+0)throw t;Ot(1,0)}},q:function(t,e){var n=At();try{at(t)(e)}catch(t){if(St(n),t!==t+0)throw t;Ot(1,0)}},h:function(t,e,n){var r=At();try{at(t)(e,n)}catch(t){if(St(r),t!==t+0)throw t;Ot(1,0)}},da:function(t,e,n,r){var a=At();try{at(t)(e,n,r)}catch(t){if(St(a),t!==t+0)throw t;Ot(1,0)}},l:function(t,e,n,r){var a=At();try{at(t)(e,n,r)}catch(t){if(St(a),t!==t+0)throw t;Ot(1,0)}},t:function(t,e,n,r,a){var i=At();try{at(t)(e,n,r,a)}catch(t){if(St(i),t!==t+0)throw t;Ot(1,0)}},u:function(t,e,n,r,a,i){var o=At();try{at(t)(e,n,r,a,i)}catch(t){if(St(o),t!==t+0)throw t;Ot(1,0)}},x:function(t,e,n,r,a,i,o){var u=At();try{at(t)(e,n,r,a,i,o)}catch(t){if(St(u),t!==t+0)throw t;Ot(1,0)}},z:function(t,e,n,r,a,i,o,u){var c=At();try{at(t)(e,n,r,a,i,o,u)}catch(t){if(St(c),t!==t+0)throw t;Ot(1,0)}},ga:function(t,e,n,r,a,i,o,u,c){var s=At();try{at(t)(e,n,r,a,i,o,u,c)}catch(t){if(St(s),t!==t+0)throw t;Ot(1,0)}},A:function(t,e,n,r,a,i,o,u,c,s,l){var f=At();try{at(t)(e,n,r,a,i,o,u,c,s,l)}catch(t){if(St(f),t!==t+0)throw t;Ot(1,0)}},C:function(t,e,n,r,a,i,o,u,c,s,l,f,p,h,d,y){var b=At();try{at(t)(e,n,r,a,i,o,u,c,s,l,f,p,h,d,y)}catch(t){if(St(b),t!==t+0)throw t;Ot(1,0)}},aa:function(t,e,n,r,a,i,o,u){var c=At();try{jt(t,e,n,r,a,i,o,u)}catch(t){if(St(c),t!==t+0)throw t;Ot(1,0)}},_:function(t,e,n,r,a,i,o,u,c,s,l,f){var p=At();try{Dt(t,e,n,r,a,i,o,u,c,s,l,f)}catch(t){if(St(p),t!==t+0)throw t;Ot(1,0)}},$:function(t,e,n,r,a,i){var o=At();try{kt(t,e,n,r,a,i)}catch(t){if(St(o),t!==t+0)throw t;Ot(1,0)}},n:function(t){return t},F:function(t){ft=t},ha:yt,y:function(t,e,n,r){return yt(t,e,n,r)}};!function(){function t(t){e.asm=t.exports,O=e.asm.Ka,P(),U=e.asm.ib,I.unshift(e.asm.La),B--,e.monitorRunDependencies&&e.monitorRunDependencies(B),0==B&&(null!==G&&(clearInterval(G),G=null),N&&(t=N,N=null,t()))}function n(e){t(e.instance)}function r(t){return function(){if(!g&&(d||y)){if("function"==typeof fetch&&!Y.startsWith("file://"))return fetch(Y,{credentials:"same-origin"}).then((function(t){if(!t.ok)throw"failed to load wasm binary file at \'"+Y+"\'";return t.arrayBuffer()})).catch((function(){return X()}));if(o)return new Promise((function(t,e){o(Y,(function(e){t(new Uint8Array(e))}),e)}))}return Promise.resolve().then((function(){return X()}))}().then((function(t){return WebAssembly.instantiate(t,i)})).then((function(t){return t})).then(t,(function(t){w("failed to asynchronously prepare wasm: "+t),V(t)}))}var i={a:bt};if(B++,e.monitorRunDependencies&&e.monitorRunDependencies(B),e.instantiateWasm)try{return e.instantiateWasm(i,t)}catch(t){return w("Module.instantiateWasm callback failed with error: "+t),!1}(g||"function"!=typeof WebAssembly.instantiateStreaming||$()||Y.startsWith("file://")||b||"function"!=typeof fetch?r(n):fetch(Y,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,i).then(n,(function(t){return w("wasm streaming compile failed: "+t),w("falling back to ArrayBuffer instantiation"),r(n)}))}))).catch(a)}(),e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.La).apply(null,arguments)},e._OrtInit=function(){return(e._OrtInit=e.asm.Ma).apply(null,arguments)},e._OrtCreateSessionOptions=function(){return(e._OrtCreateSessionOptions=e.asm.Na).apply(null,arguments)},e._OrtAppendExecutionProvider=function(){return(e._OrtAppendExecutionProvider=e.asm.Oa).apply(null,arguments)},e._OrtAddSessionConfigEntry=function(){return(e._OrtAddSessionConfigEntry=e.asm.Pa).apply(null,arguments)},e._OrtReleaseSessionOptions=function(){return(e._OrtReleaseSessionOptions=e.asm.Qa).apply(null,arguments)},e._OrtCreateSession=function(){return(e._OrtCreateSession=e.asm.Ra).apply(null,arguments)},e._OrtReleaseSession=function(){return(e._OrtReleaseSession=e.asm.Sa).apply(null,arguments)},e._OrtGetInputCount=function(){return(e._OrtGetInputCount=e.asm.Ta).apply(null,arguments)},e._OrtGetOutputCount=function(){return(e._OrtGetOutputCount=e.asm.Ua).apply(null,arguments)},e._OrtGetInputName=function(){return(e._OrtGetInputName=e.asm.Va).apply(null,arguments)},e._OrtGetOutputName=function(){return(e._OrtGetOutputName=e.asm.Wa).apply(null,arguments)},e._OrtFree=function(){return(e._OrtFree=e.asm.Xa).apply(null,arguments)},e._OrtCreateTensor=function(){return(e._OrtCreateTensor=e.asm.Ya).apply(null,arguments)},e._OrtGetTensorData=function(){return(e._OrtGetTensorData=e.asm.Za).apply(null,arguments)},e._OrtReleaseTensor=function(){return(e._OrtReleaseTensor=e.asm._a).apply(null,arguments)},e._OrtCreateRunOptions=function(){return(e._OrtCreateRunOptions=e.asm.$a).apply(null,arguments)},e._OrtAddRunConfigEntry=function(){return(e._OrtAddRunConfigEntry=e.asm.ab).apply(null,arguments)},e._OrtReleaseRunOptions=function(){return(e._OrtReleaseRunOptions=e.asm.bb).apply(null,arguments)},e._OrtRun=function(){return(e._OrtRun=e.asm.cb).apply(null,arguments)},e._OrtEndProfiling=function(){return(e._OrtEndProfiling=e.asm.db).apply(null,arguments)};var mt,gt=e._malloc=function(){return(gt=e._malloc=e.asm.eb).apply(null,arguments)},vt=e._free=function(){return(vt=e._free=e.asm.fb).apply(null,arguments)},wt=e._fflush=function(){return(wt=e._fflush=e.asm.gb).apply(null,arguments)},_t=e.___funcs_on_exit=function(){return(_t=e.___funcs_on_exit=e.asm.hb).apply(null,arguments)},Ot=e._setThrew=function(){return(Ot=e._setThrew=e.asm.jb).apply(null,arguments)},At=e.stackSave=function(){return(At=e.stackSave=e.asm.kb).apply(null,arguments)},St=e.stackRestore=function(){return(St=e.stackRestore=e.asm.lb).apply(null,arguments)},Tt=e.stackAlloc=function(){return(Tt=e.stackAlloc=e.asm.mb).apply(null,arguments)},Et=e.___cxa_can_catch=function(){return(Et=e.___cxa_can_catch=e.asm.nb).apply(null,arguments)},Mt=e.___cxa_is_pointer_type=function(){return(Mt=e.___cxa_is_pointer_type=e.asm.ob).apply(null,arguments)},Ct=e.dynCall_j=function(){return(Ct=e.dynCall_j=e.asm.pb).apply(null,arguments)},xt=e.dynCall_iiiiij=function(){return(xt=e.dynCall_iiiiij=e.asm.qb).apply(null,arguments)},Rt=e.dynCall_jii=function(){return(Rt=e.dynCall_jii=e.asm.rb).apply(null,arguments)},jt=e.dynCall_viiiiij=function(){return(jt=e.dynCall_viiiiij=e.asm.sb).apply(null,arguments)},kt=e.dynCall_vjji=function(){return(kt=e.dynCall_vjji=e.asm.tb).apply(null,arguments)},Dt=e.dynCall_viiijjjii=function(){return(Dt=e.dynCall_viiijjjii=e.asm.ub).apply(null,arguments)},Pt=e.dynCall_iij=function(){return(Pt=e.dynCall_iij=e.asm.vb).apply(null,arguments)},Ut=e.dynCall_ji=function(){return(Ut=e.dynCall_ji=e.asm.wb).apply(null,arguments)},Ft=e.dynCall_iiiiiij=function(){return(Ft=e.dynCall_iiiiiij=e.asm.xb).apply(null,arguments)},It=e.dynCall_iiij=function(){return(It=e.dynCall_iiij=e.asm.yb).apply(null,arguments)};function Wt(){function t(){if(!mt&&(mt=!0,e.calledRun=!0,!C)){if(Z(I),r(e),e.onRuntimeInitialized&&e.onRuntimeInitialized(),e.postRun)for("function"==typeof e.postRun&&(e.postRun=[e.postRun]);e.postRun.length;){var t=e.postRun.shift();H.unshift(t)}Z(H)}}if(!(0<B)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)z();Z(F),0<B||(e.setStatus?(e.setStatus("Running..."),setTimeout((function(){setTimeout((function(){e.setStatus("")}),1),t()}),1)):t())}}if(e.UTF8ToString=j,e.stringToUTF8=function(t,e,n){return k(t,T,e,n)},e.lengthBytesUTF8=D,e.stackSave=At,e.stackRestore=St,e.stackAlloc=Tt,N=function t(){mt||Wt(),mt||(N=t)},e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();return Wt(),t.ready});t.exports=r},967:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.iterateExtraOptions=void 0,e.iterateExtraOptions=(t,n,r,a)=>{if("object"==typeof t&&null!==t){if(r.has(t))throw new Error("Circular reference in options");r.add(t)}Object.entries(t).forEach((([t,i])=>{const o=n?n+t:t;if("object"==typeof i)(0,e.iterateExtraOptions)(i,o+".",r,a);else if("string"==typeof i||"number"==typeof i)a(o,i.toString());else{if("boolean"!=typeof i)throw new Error("Can\'t handle extra config type: "+typeof i);a(o,i?"1":"0")}}))}},586:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.setRunOptions=void 0;const r=n(967),a=n(983),i=n(361);e.setRunOptions=t=>{const e=(0,i.getInstance)();let n=0;const o=[],u=t||{};try{if(void 0===(null==t?void 0:t.logSeverityLevel))u.logSeverityLevel=2;else if("number"!=typeof t.logSeverityLevel||!Number.isInteger(t.logSeverityLevel)||t.logSeverityLevel<0||t.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${t.logSeverityLevel}`);if(void 0===(null==t?void 0:t.logVerbosityLevel))u.logVerbosityLevel=0;else if("number"!=typeof t.logVerbosityLevel||!Number.isInteger(t.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${t.logVerbosityLevel}`);void 0===(null==t?void 0:t.terminate)&&(u.terminate=!1);let i=0;if(void 0!==(null==t?void 0:t.tag)&&(i=(0,a.allocWasmString)(t.tag,o)),n=e._OrtCreateRunOptions(u.logSeverityLevel,u.logVerbosityLevel,!!u.terminate,i),0===n)throw new Error("Can\'t create run options");return void 0!==(null==t?void 0:t.extra)&&(0,r.iterateExtraOptions)(t.extra,"",new WeakSet,((t,r)=>{const i=(0,a.allocWasmString)(t,o),u=(0,a.allocWasmString)(r,o);if(0!==e._OrtAddRunConfigEntry(n,i,u))throw new Error(`Can\'t set a run config entry: ${t} - ${r}`)})),[n,o]}catch(t){throw 0!==n&&e._OrtReleaseRunOptions(n),o.forEach(e._free),t}}},919:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.setSessionOptions=void 0;const r=n(967),a=n(983),i=n(361);e.setSessionOptions=t=>{const e=(0,i.getInstance)();let n=0;const o=[],u=t||{};(t=>{t.extra||(t.extra={}),t.extra.session||(t.extra.session={});const e=t.extra.session;e.use_ort_model_bytes_directly||(e.use_ort_model_bytes_directly="1")})(u);try{void 0===(null==t?void 0:t.graphOptimizationLevel)&&(u.graphOptimizationLevel="all");const c=(t=>{switch(t){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${t}`)}})(u.graphOptimizationLevel);void 0===(null==t?void 0:t.enableCpuMemArena)&&(u.enableCpuMemArena=!0),void 0===(null==t?void 0:t.enableMemPattern)&&(u.enableMemPattern=!0),void 0===(null==t?void 0:t.executionMode)&&(u.executionMode="sequential");const s=(t=>{switch(t){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${t}`)}})(u.executionMode);let l=0;if(void 0!==(null==t?void 0:t.logId)&&(l=(0,a.allocWasmString)(t.logId,o)),void 0===(null==t?void 0:t.logSeverityLevel))u.logSeverityLevel=2;else if("number"!=typeof t.logSeverityLevel||!Number.isInteger(t.logSeverityLevel)||t.logSeverityLevel<0||t.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${t.logSeverityLevel}`);if(void 0===(null==t?void 0:t.logVerbosityLevel))u.logVerbosityLevel=0;else if("number"!=typeof t.logVerbosityLevel||!Number.isInteger(t.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${t.logVerbosityLevel}`);if(void 0===(null==t?void 0:t.enableProfiling)&&(u.enableProfiling=!1),n=e._OrtCreateSessionOptions(c,!!u.enableCpuMemArena,!!u.enableMemPattern,s,!!u.enableProfiling,0,l,u.logSeverityLevel,u.logVerbosityLevel),0===n)throw new Error("Can\'t create session options");return(null==t?void 0:t.executionProviders)&&((t,e,n)=>{for(const r of e){let e="string"==typeof r?r:r.name;switch(e){case"xnnpack":e="XNNPACK";break;case"wasm":case"cpu":continue;default:throw new Error(`not supported EP: ${e}`)}const o=(0,a.allocWasmString)(e,n);if(0!==(0,i.getInstance)()._OrtAppendExecutionProvider(t,o))throw new Error(`Can\'t append execution provider: ${e}`)}})(n,t.executionProviders,o),void 0!==(null==t?void 0:t.extra)&&(0,r.iterateExtraOptions)(t.extra,"",new WeakSet,((t,r)=>{const i=(0,a.allocWasmString)(t,o),u=(0,a.allocWasmString)(r,o);if(0!==e._OrtAddSessionConfigEntry(n,i,u))throw new Error(`Can\'t set a session config entry: ${t} - ${r}`)})),[n,o]}catch(t){throw 0!==n&&e._OrtReleaseSessionOptions(n),o.forEach(e._free),t}}},983:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.allocWasmString=void 0;const r=n(361);e.allocWasmString=(t,e)=>{const n=(0,r.getInstance)(),a=n.lengthBytesUTF8(t)+1,i=n._malloc(a);return n.stringToUTF8(t,i,a),e.push(i),i}},349:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.extractTransferableBuffers=e.endProfiling=e.run=e.releaseSession=e.createSession=e.createSessionFinalize=e.createSessionAllocate=e.initOrt=void 0;const r=n(586),a=n(919),i=n(983),o=n(361);e.initOrt=(t,e)=>{const n=(0,o.getInstance)()._OrtInit(t,e);if(0!==n)throw new Error(`Can\'t initialize onnxruntime. error code = ${n}`)};const u=new Map;e.createSessionAllocate=t=>{const e=(0,o.getInstance)(),n=e._malloc(t.byteLength);return e.HEAPU8.set(t,n),[n,t.byteLength]},e.createSessionFinalize=(t,e)=>{const n=(0,o.getInstance)();let r=0,i=0,c=[];try{if([i,c]=(0,a.setSessionOptions)(e),r=n._OrtCreateSession(t[0],t[1],i),0===r)throw new Error("Can\'t create a session")}finally{n._free(t[0]),n._OrtReleaseSessionOptions(i),c.forEach(n._free)}const s=n._OrtGetInputCount(r),l=n._OrtGetOutputCount(r),f=[],p=[],h=[],d=[];for(let t=0;t<s;t++){const e=n._OrtGetInputName(r,t);if(0===e)throw new Error("Can\'t get an input name");p.push(e),f.push(n.UTF8ToString(e))}for(let t=0;t<l;t++){const e=n._OrtGetOutputName(r,t);if(0===e)throw new Error("Can\'t get an output name");d.push(e),h.push(n.UTF8ToString(e))}return u.set(r,[r,p,d]),[r,f,h]},e.createSession=(t,n)=>{const r=(0,e.createSessionAllocate)(t);return(0,e.createSessionFinalize)(r,n)},e.releaseSession=t=>{const e=(0,o.getInstance)(),n=u.get(t);if(!n)throw new Error("invalid session id");const r=n[0],a=n[1],i=n[2];a.forEach(e._OrtFree),i.forEach(e._OrtFree),e._OrtReleaseSession(r),u.delete(t)};const c=t=>{switch(t){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;default:throw new Error(`unsupported data type: ${t}`)}},s=t=>{switch(t){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";default:throw new Error(`unsupported data type: ${t}`)}},l=t=>{switch(t){case"float32":return Float32Array;case"uint8":case"bool":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${t}`)}};e.run=(t,e,n,a,f)=>{const p=(0,o.getInstance)(),h=u.get(t);if(!h)throw new Error("invalid session id");const d=h[0],y=h[1],b=h[2],m=e.length,g=a.length;let v=0,w=[];const _=[],O=[];try{[v,w]=(0,r.setRunOptions)(f);for(let t=0;t<m;t++){const e=n[t][0],r=n[t][1],a=n[t][2];let o,u;if(Array.isArray(a)){u=4*a.length,o=p._malloc(u),O.push(o);let t=o/4;for(let e=0;e<a.length;e++){if("string"!=typeof a[e])throw new TypeError(`tensor data at index ${e} is not a string`);p.HEAPU32[t++]=(0,i.allocWasmString)(a[e],O)}}else u=a.byteLength,o=p._malloc(u),O.push(o),p.HEAPU8.set(new Uint8Array(a.buffer,a.byteOffset,u),o);const s=p.stackSave(),l=p.stackAlloc(4*r.length);try{let t=l/4;r.forEach((e=>p.HEAP32[t++]=e));const n=p._OrtCreateTensor(c(e),o,u,l,r.length);if(0===n)throw new Error("Can\'t create a tensor");_.push(n)}finally{p.stackRestore(s)}}const t=p.stackSave(),o=p.stackAlloc(4*m),u=p.stackAlloc(4*m),h=p.stackAlloc(4*g),A=p.stackAlloc(4*g);try{let n=o/4,r=u/4,i=h/4,c=A/4;for(let t=0;t<m;t++)p.HEAPU32[n++]=_[t],p.HEAPU32[r++]=y[e[t]];for(let t=0;t<g;t++)p.HEAPU32[i++]=0,p.HEAPU32[c++]=b[a[t]];let f=p._OrtRun(d,u,o,m,A,g,h,v);const w=[];if(0===f)for(let t=0;t<g;t++){const e=p.HEAPU32[h/4+t],n=p.stackSave(),r=p.stackAlloc(16);let a,i=0;try{if(f=p._OrtGetTensorData(e,r,r+4,r+8,r+12),0!==f)throw new Error(`Can\'t access output tensor data. error code = ${f}`);let t=r/4;const o=p.HEAPU32[t++];i=p.HEAPU32[t++];const u=p.HEAPU32[t++],c=p.HEAPU32[t++],h=[];for(let t=0;t<c;t++)h.push(p.HEAPU32[u/4+t]);p._OrtFree(u);const d=0===h.length?1:h.reduce(((t,e)=>t*e));if(a=s(o),"string"===a){const t=[];let e=i/4;for(let n=0;n<d;n++){const r=p.HEAPU32[e++],a=n===d-1?void 0:p.HEAPU32[e]-r;t.push(p.UTF8ToString(r,a))}w.push([a,h,t])}else{const t=new(l(a))(d);new Uint8Array(t.buffer,t.byteOffset,t.byteLength).set(p.HEAPU8.subarray(i,i+t.byteLength)),w.push([a,h,t])}}finally{p.stackRestore(n),"string"===a&&i&&p._free(i),p._OrtReleaseTensor(e)}}if(0===f)return w;throw new Error(`failed to call OrtRun(). error code = ${f}.`)}finally{p.stackRestore(t)}}finally{_.forEach(p._OrtReleaseTensor),O.forEach(p._free),p._OrtReleaseRunOptions(v),w.forEach(p._free)}},e.endProfiling=t=>{const e=(0,o.getInstance)(),n=u.get(t);if(!n)throw new Error("invalid session id");const r=n[0],a=e._OrtEndProfiling(r);if(0===a)throw new Error("Can\'t get an profile file name");e._OrtFree(a)},e.extractTransferableBuffers=t=>{const e=[];for(const n of t){const t=n[2];!Array.isArray(t)&&t.buffer&&e.push(t.buffer)}return e}},361:function(t,e,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(t,e,n,r){void 0===r&&(r=n);var a=Object.getOwnPropertyDescriptor(e,n);a&&!("get"in a?!e.__esModule:a.writable||a.configurable)||(a={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(t,r,a)}:function(t,e,n,r){void 0===r&&(r=n),t[r]=e[n]}),a=this&&this.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),i=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)"default"!==n&&Object.prototype.hasOwnProperty.call(t,n)&&r(e,t,n);return a(e,t),e},o=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.dispose=e.getInstance=e.initializeWebAssembly=void 0;const u=i(n(449)),c=o(n(932)),s=n(474);let l,f=!1,p=!1,h=!1;const d=(t,e)=>e?t?"ort-wasm-simd-threaded.wasm":"ort-wasm-threaded.wasm":t?"ort-wasm-simd.wasm":"ort-wasm.wasm";e.initializeWebAssembly=async t=>{if(f)return Promise.resolve();if(p)throw new Error("multiple calls to \'initializeWebAssembly()\' detected.");if(h)throw new Error("previous call to \'initializeWebAssembly()\' failed.");p=!0;const e=t.initTimeout,r=t.numThreads,a=t.simd,i=r>1&&(()=>{try{return"undefined"!=typeof SharedArrayBuffer&&("undefined"!=typeof MessageChannel&&(new MessageChannel).port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11])))}catch(t){return!1}})(),o=a&&(()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch(t){return!1}})(),y="string"==typeof t.wasmPaths?t.wasmPaths:void 0,b=d(!1,i),m=d(o,i),g="object"==typeof t.wasmPaths?t.wasmPaths[m]:void 0;let v=!1;const w=[];if(e>0&&w.push(new Promise((t=>{setTimeout((()=>{v=!0,t()}),e)}))),w.push(new Promise(((t,e)=>{const r=i?s:c.default,a={locateFile:(t,e)=>i&&t.endsWith(".worker.js")&&"undefined"!=typeof Blob?URL.createObjectURL(new Blob([n(154)],{type:"text/javascript"})):t===b?null!=g?g:(null!=y?y:e)+m:e+t};if(i)if("undefined"==typeof Blob)a.mainScriptUrlOrBlob=u.join("/","ort-wasm-threaded.js");else{const t=`var ortWasmThreaded=(function(){var _scriptDir;return ${r.toString()}})();`;a.mainScriptUrlOrBlob=new Blob([t],{type:"text/javascript"})}r(a).then((e=>{p=!1,f=!0,l=e,t()}),(t=>{p=!1,h=!0,e(t)}))}))),await Promise.race(w),v)throw new Error(`WebAssembly backend initializing failed due to timeout: ${e}ms`)},e.getInstance=()=>{if(f&&l)return l;throw new Error("WebAssembly is not initialized yet.")},e.dispose=()=>{var t;!f||p||h||(p=!0,null===(t=l.PThread)||void 0===t||t.terminateAllThreads(),l=void 0,p=!1,f=!1,h=!0)}},154:t=>{"use strict";t.exports=\'"use strict";var e={},t="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node;if(t){var r=require("worker_threads"),a=r.parentPort;a.on("message",(e=>onmessage({data:e})));var o=require("fs");Object.assign(global,{self:global,require:require,Module:e,location:{href:__filename},Worker:r.Worker,importScripts:function(e){(0,eval)(o.readFileSync(e,"utf8"))},postMessage:function(e){a.postMessage(e)},performance:global.performance||{now:function(){return Date.now()}}})}var s=!1,n=[],i=function(){var e=Array.prototype.slice.call(arguments).join(" ");t?o.writeSync(2,e+"\\\\n"):console.error(e)};self.alert=function(){var t=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:t,threadId:e._pthread_self()})},e.instantiateWasm=(t,r)=>{var a=new WebAssembly.Instance(e.wasmModule,t);return r(a),e.wasmModule=null,a.exports},self.onunhandledrejection=e=>{throw e.reason??e},self.onmessage=t=>{try{if("load"===t.data.cmd){if(e.wasmModule=t.data.wasmModule,e.wasmMemory=t.data.wasmMemory,e.buffer=e.wasmMemory.buffer,e.ENVIRONMENT_IS_PTHREAD=!0,"string"==typeof t.data.urlOrBlob)importScripts(t.data.urlOrBlob);else{var r=URL.createObjectURL(t.data.urlOrBlob);importScripts(r),URL.revokeObjectURL(r)}ortWasmThreaded(e).then((function(t){e=t}))}else if("run"===t.data.cmd){e.__performance_now_clock_drift=performance.now()-t.data.time,e.__emscripten_thread_init(t.data.pthread_ptr,0,0,1),e.establishStackSpace(),e.PThread.receiveObjectTransfer(t.data),e.PThread.threadInitTLS(),s||(n.forEach((t=>{e.executeNotifiedProxyingQueue(t)})),n=[],s=!0);try{e.invokeEntryPoint(t.data.start_routine,t.data.arg)}catch(t){if("unwind"!=t){if(!(t instanceof e.ExitStatus))throw t;e.keepRuntimeAlive()||e.__emscripten_thread_exit(t.status)}}}else"cancel"===t.data.cmd?e._pthread_self()&&e.__emscripten_thread_exit(-1):"setimmediate"===t.data.target||("processProxyingQueue"===t.data.cmd?s?e.executeNotifiedProxyingQueue(t.data.queue):n.push(t.data.queue):(i("worker.js received unknown command "+t.data.cmd),i(t.data)))}catch(t){throw i("worker.js onmessage() captured an uncaught exception: "+t),t&&t.stack&&i(t.stack),e.__emscripten_thread_crashed&&e.__emscripten_thread_crashed(),t}};\\n\'},384:()=>{},993:()=>{},908:()=>{},953:()=>{},925:()=>{},449:()=>{}},e={};function n(r){var a=e[r];if(void 0!==a)return a.exports;var i=e[r]={exports:{}};return t[r].call(i.exports,i,i.exports,n),i.exports}n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),(()=>{"use strict";const t=n(349),e=n(361);self.onmessage=n=>{switch(n.data.type){case"init-wasm":(0,e.initializeWebAssembly)(n.data.in).then((()=>postMessage({type:"init-wasm"})),(t=>postMessage({type:"init-wasm",err:t})));break;case"init-ort":try{const{numThreads:e,loggingLevel:r}=n.data.in;(0,t.initOrt)(e,r),postMessage({type:"init-ort"})}catch(t){postMessage({type:"init-ort",err:t})}break;case"create_allocate":try{const{model:e}=n.data.in,r=(0,t.createSessionAllocate)(e);postMessage({type:"create_allocate",out:r})}catch(t){postMessage({type:"create_allocate",err:t})}break;case"create_finalize":try{const{modeldata:e,options:r}=n.data.in,a=(0,t.createSessionFinalize)(e,r);postMessage({type:"create_finalize",out:a})}catch(t){postMessage({type:"create_finalize",err:t})}break;case"create":try{const{model:e,options:r}=n.data.in,a=(0,t.createSession)(e,r);postMessage({type:"create",out:a})}catch(t){postMessage({type:"create",err:t})}break;case"release":try{const e=n.data.in;(0,t.releaseSession)(e),postMessage({type:"release"})}catch(t){postMessage({type:"release",err:t})}break;case"run":try{const{sessionId:e,inputIndices:r,inputs:a,outputIndices:i,options:o}=n.data.in,u=(0,t.run)(e,r,a,i,o);postMessage({type:"run",out:u},(0,t.extractTransferableBuffers)(u))}catch(t){postMessage({type:"run",err:t})}break;case"end-profiling":try{const e=n.data.in;(0,t.endProfiling)(e),postMessage({type:"end-profiling"})}catch(t){postMessage({type:"end-profiling",err:t})}}}})()})();\n', "Worker", void 0, void 0);
        }
      }, 477: (R) => {
        R.exports = function(u, b, h, p) {
          var g = self || window;
          try {
            try {
              var o;
              try {
                o = new g.Blob([u]);
              } catch {
                (o = new (g.BlobBuilder || g.WebKitBlobBuilder || g.MozBlobBuilder || g.MSBlobBuilder)()).append(u), o = o.getBlob();
              }
              var c = g.URL || g.webkitURL, f = c.createObjectURL(o), s = new g[b](f, h);
              return c.revokeObjectURL(f), s;
            } catch {
              return new g[b]("data:application/javascript,".concat(encodeURIComponent(u)), h);
            }
          } catch {
            if (!p) throw Error("Inline worker is not supported");
            return new g[b](p, h);
          }
        };
      }, 4154: (R) => {
        R.exports = `"use strict";var e={},t="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node;if(t){var r=require("worker_threads"),a=r.parentPort;a.on("message",(e=>onmessage({data:e})));var o=require("fs");Object.assign(global,{self:global,require:require,Module:e,location:{href:__filename},Worker:r.Worker,importScripts:function(e){(0,eval)(o.readFileSync(e,"utf8"))},postMessage:function(e){a.postMessage(e)},performance:global.performance||{now:function(){return Date.now()}}})}var s=!1,n=[],i=function(){var e=Array.prototype.slice.call(arguments).join(" ");t?o.writeSync(2,e+"\\n"):console.error(e)};self.alert=function(){var t=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:t,threadId:e._pthread_self()})},e.instantiateWasm=(t,r)=>{var a=new WebAssembly.Instance(e.wasmModule,t);return r(a),e.wasmModule=null,a.exports},self.onunhandledrejection=e=>{throw e.reason??e},self.onmessage=t=>{try{if("load"===t.data.cmd){if(e.wasmModule=t.data.wasmModule,e.wasmMemory=t.data.wasmMemory,e.buffer=e.wasmMemory.buffer,e.ENVIRONMENT_IS_PTHREAD=!0,"string"==typeof t.data.urlOrBlob)importScripts(t.data.urlOrBlob);else{var r=URL.createObjectURL(t.data.urlOrBlob);importScripts(r),URL.revokeObjectURL(r)}ortWasmThreaded(e).then((function(t){e=t}))}else if("run"===t.data.cmd){e.__performance_now_clock_drift=performance.now()-t.data.time,e.__emscripten_thread_init(t.data.pthread_ptr,0,0,1),e.establishStackSpace(),e.PThread.receiveObjectTransfer(t.data),e.PThread.threadInitTLS(),s||(n.forEach((t=>{e.executeNotifiedProxyingQueue(t)})),n=[],s=!0);try{e.invokeEntryPoint(t.data.start_routine,t.data.arg)}catch(t){if("unwind"!=t){if(!(t instanceof e.ExitStatus))throw t;e.keepRuntimeAlive()||e.__emscripten_thread_exit(t.status)}}}else"cancel"===t.data.cmd?e._pthread_self()&&e.__emscripten_thread_exit(-1):"setimmediate"===t.data.target||("processProxyingQueue"===t.data.cmd?s?e.executeNotifiedProxyingQueue(t.data.queue):n.push(t.data.queue):(i("worker.js received unknown command "+t.data.cmd),i(t.data)))}catch(t){throw i("worker.js onmessage() captured an uncaught exception: "+t),t&&t.stack&&i(t.stack),e.__emscripten_thread_crashed&&e.__emscripten_thread_crashed(),t}};
`;
      }, 1670: (R) => {
        R.exports = __WEBPACK_EXTERNAL_MODULE__1670__;
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
      }, 5686: (R, u, b) => {
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
          var f = 0, s = this.space;
          e: for (g = 0; g < this.vtables.length; g++) {
            var i = this.bb.capacity() - this.vtables[g];
            if (c == this.bb.readInt16(i)) {
              for (var t = h.SIZEOF_SHORT; t < c; t += h.SIZEOF_SHORT) if (this.bb.readInt16(s + t) != this.bb.readInt16(i + t)) continue e;
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
            for (var s = h.FILE_IDENTIFIER_LENGTH - 1; s >= 0; s--) this.writeInt8(f.charCodeAt(s));
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
          for (var s = this.space, i = this.bb.bytes(); o < g.length; o++) i[s++] = g[o];
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
            var s, i = this.readUint8(p + f++);
            if (i < 192) s = i;
            else {
              var t = this.readUint8(p + f++);
              if (i < 224) s = (31 & i) << 6 | 63 & t;
              else {
                var e = this.readUint8(p + f++);
                s = i < 240 ? (15 & i) << 12 | (63 & t) << 6 | 63 & e : (7 & i) << 18 | (63 & t) << 12 | (63 & e) << 6 | 63 & this.readUint8(p + f++);
              }
            }
            s < 65536 ? c += String.fromCharCode(s) : (s -= 65536, c += String.fromCharCode(55296 + (s >> 10), 56320 + (1023 & s)));
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
      function __webpack_require__(R) {
        var u = __webpack_module_cache__[R];
        if (u !== void 0) return u.exports;
        var b = __webpack_module_cache__[R] = { exports: {} };
        return __webpack_modules__[R].call(b.exports, b, b.exports, __webpack_require__), b.exports;
      }
      __webpack_require__.n = (R) => {
        var u = R && R.__esModule ? () => R.default : () => R;
        return __webpack_require__.d(u, { a: u }), u;
      }, __webpack_require__.d = (R, u) => {
        for (var b in u) __webpack_require__.o(u, b) && !__webpack_require__.o(R, b) && Object.defineProperty(R, b, { enumerable: !0, get: u[b] });
      }, __webpack_require__.g = function() {
        if (typeof globalThis == "object") return globalThis;
        try {
          return this || new Function("return this")();
        } catch {
          if (typeof window == "object") return window;
        }
      }(), __webpack_require__.o = (R, u) => Object.prototype.hasOwnProperty.call(R, u), __webpack_require__.r = (R) => {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(R, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(R, "__esModule", { value: !0 });
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
  const R = (u) => fetch(u).then((b) => b.arrayBuffer());
  return defaultModelFetcher.defaultModelFetcher = R, defaultModelFetcher;
}
var frameProcessor = {}, logging = {}, hasRequiredLogging;
function requireLogging() {
  return hasRequiredLogging || (hasRequiredLogging = 1, function(R) {
    Object.defineProperty(R, "__esModule", { value: !0 }), R.log = R.LOG_PREFIX = void 0, R.LOG_PREFIX = "[VAD]";
    const u = ["error", "debug", "warn"];
    function b(p) {
      return (...g) => {
        console[p](R.LOG_PREFIX, ...g);
      };
    }
    const h = u.reduce((p, g) => (p[g] = b(g), p), {});
    R.log = h;
  }(logging)), logging;
}
var messages = {}, hasRequiredMessages;
function requireMessages() {
  if (hasRequiredMessages) return messages;
  hasRequiredMessages = 1, Object.defineProperty(messages, "__esModule", { value: !0 }), messages.Message = void 0;
  var R;
  return function(u) {
    u.AudioFrame = "AUDIO_FRAME", u.SpeechStart = "SPEECH_START", u.VADMisfire = "VAD_MISFIRE", u.SpeechEnd = "SPEECH_END", u.SpeechStop = "SPEECH_STOP";
  }(R || (messages.Message = R = {})), messages;
}
var hasRequiredFrameProcessor;
function requireFrameProcessor() {
  if (hasRequiredFrameProcessor) return frameProcessor;
  hasRequiredFrameProcessor = 1, Object.defineProperty(frameProcessor, "__esModule", { value: !0 }), frameProcessor.FrameProcessor = frameProcessor.validateOptions = frameProcessor.defaultV5FrameProcessorOptions = frameProcessor.defaultLegacyFrameProcessorOptions = void 0;
  const R = requireLogging(), u = requireMessages(), b = [512, 1024, 1536];
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
    b.includes(o.frameSamples) || R.log.warn("You are using an unusual frame size"), (o.positiveSpeechThreshold < 0 || o.positiveSpeechThreshold > 1) && R.log.error("positiveSpeechThreshold should be a number between 0 and 1"), (o.negativeSpeechThreshold < 0 || o.negativeSpeechThreshold > o.positiveSpeechThreshold) && R.log.error("negativeSpeechThreshold should be between 0 and positiveSpeechThreshold"), o.preSpeechPadFrames < 0 && R.log.error("preSpeechPadFrames should be positive"), o.redemptionFrames < 0 && R.log.error("redemptionFrames should be positive");
  }
  frameProcessor.validateOptions = h;
  const p = (o) => {
    const c = o.reduce((s, i) => (s.push(s.at(-1) + i.length), s), [0]), f = new Float32Array(c.at(-1));
    return o.forEach((s, i) => {
      const t = c[i];
      f.set(s, t);
    }), f;
  };
  class g {
    constructor(c, f, s) {
      this.modelProcessFunc = c, this.modelResetFunc = f, this.options = s, this.speaking = !1, this.redemptionCounter = 0, this.active = !1, this.reset = () => {
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
          if (this.audioBuffer = [], e.reduce((r, a) => r + +a.isSpeech, 0) >= this.options.minSpeechFrames) {
            const r = p(e.map((a) => a.frame));
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
  var R;
  Object.defineProperty(legacy, "__esModule", { value: !0 }), legacy.SileroLegacy = void 0;
  const u = requireLogging();
  class b {
    constructor(p, g, o, c, f) {
      this.ortInstance = p, this._session = g, this._h = o, this._c = c, this._sr = f, this.reset_state = () => {
        const s = Array(128).fill(0);
        this._h = new this.ortInstance.Tensor("float32", s, [2, 1, 64]), this._c = new this.ortInstance.Tensor("float32", s, [2, 1, 64]);
      }, this.process = async (s) => {
        var a;
        const t = {
          input: new this.ortInstance.Tensor("float32", s, [
            1,
            s.length
          ]),
          h: this._h,
          c: this._c,
          sr: this._sr
        }, e = await this._session.run(t);
        this._h = e.hn, this._c = e.cn;
        const [n] = (a = e.output) == null ? void 0 : a.data;
        return { notSpeech: 1 - n, isSpeech: n };
      };
    }
  }
  return legacy.SileroLegacy = b, R = b, b.new = async (h, p) => {
    u.log.debug("initializing vad");
    const g = await p(), o = await h.InferenceSession.create(g), c = new h.Tensor("int64", [16000n]), f = Array(2 * 64).fill(0), s = new h.Tensor("float32", f, [2, 1, 64]), i = new h.Tensor("float32", f, [2, 1, 64]);
    return u.log.debug("vad is initialized"), new R(h, o, s, i, c);
  }, legacy;
}
var v5 = {}, hasRequiredV5;
function requireV5() {
  if (hasRequiredV5) return v5;
  hasRequiredV5 = 1;
  var R;
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
      }, this.process = async (s) => {
        var a;
        const t = {
          input: new this.ortInstance.Tensor("float32", s, [
            1,
            s.length
          ]),
          state: this._state,
          sr: this._sr
        }, e = await this._session.run(t);
        this._state = e.stateN;
        const [n] = (a = e.output) == null ? void 0 : a.data;
        return { notSpeech: 1 - n, isSpeech: n };
      };
    }
  }
  return v5.SileroV5 = h, R = h, h.new = async (p, g) => {
    u.log.debug("Loading VAD...");
    const o = await g(), c = await p.InferenceSession.create(o), f = new p.Tensor("int64", [16000n]), s = b(p);
    return u.log.debug("...finished loading VAD"), new R(c, s, f, p);
  }, v5;
}
var hasRequiredModels;
function requireModels() {
  return hasRequiredModels || (hasRequiredModels = 1, function(R) {
    var u = models.__createBinding || (Object.create ? function(g, o, c, f) {
      f === void 0 && (f = c);
      var s = Object.getOwnPropertyDescriptor(o, c);
      (!s || ("get" in s ? !o.__esModule : s.writable || s.configurable)) && (s = { enumerable: !0, get: function() {
        return o[c];
      } }), Object.defineProperty(g, f, s);
    } : function(g, o, c, f) {
      f === void 0 && (f = c), g[f] = o[c];
    }), b = models.__exportStar || function(g, o) {
      for (var c in g) c !== "default" && !Object.prototype.hasOwnProperty.call(o, c) && u(o, g, c);
    };
    Object.defineProperty(R, "__esModule", { value: !0 }), R.SileroV5 = R.SileroLegacy = void 0, b(requireCommon(), R);
    var h = requireLegacy();
    Object.defineProperty(R, "SileroLegacy", { enumerable: !0, get: function() {
      return h.SileroLegacy;
    } });
    var p = requireV5();
    Object.defineProperty(R, "SileroV5", { enumerable: !0, get: function() {
      return p.SileroV5;
    } });
  }(models)), models;
}
var resampler = {}, hasRequiredResampler;
function requireResampler() {
  if (hasRequiredResampler) return resampler;
  hasRequiredResampler = 1, Object.defineProperty(resampler, "__esModule", { value: !0 }), resampler.Resampler = void 0;
  const R = requireLogging();
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
      }, h.nativeSampleRate < 16e3 && R.log.error("nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate"), this.inputBuffer = [];
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
  return hasRequiredNonRealTimeVad || (hasRequiredNonRealTimeVad = 1, function(R) {
    Object.defineProperty(R, "__esModule", { value: !0 }), R.PlatformAgnosticNonRealTimeVAD = R.defaultNonRealTimeVADOptions = void 0;
    const u = requireFrameProcessor(), b = requireMessages(), h = requireModels(), p = requireResampler();
    R.defaultNonRealTimeVADOptions = {
      ...u.defaultLegacyFrameProcessorOptions,
      ortConfig: void 0
    };
    class g {
      static async _new(c, f, s = {}) {
        const i = {
          ...R.defaultNonRealTimeVADOptions,
          ...s
        };
        i.ortConfig !== void 0 && i.ortConfig(f);
        const t = new this(c, f, i);
        return await t.init(), t;
      }
      constructor(c, f, s) {
        this.modelFetcher = c, this.ort = f, this.options = s, this.init = async () => {
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
          let r = 0, a = 0, l = 0;
          for await (const y of n.stream(i)) {
            const { msg: _, audio: v } = await this.frameProcessor.process(y);
            switch (_) {
              case b.Message.SpeechStart:
                r = l * this.options.frameSamples / 16;
                break;
              case b.Message.SpeechEnd:
                a = (l + 1) * this.options.frameSamples / 16, yield { audio: v, start: r, end: a };
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
        }, (0, u.validateOptions)(s);
      }
    }
    R.PlatformAgnosticNonRealTimeVAD = g;
  }(nonRealTimeVad)), nonRealTimeVad;
}
var utils = {}, hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1, Object.defineProperty(utils, "__esModule", { value: !0 }), utils.audioFileToArray = utils.encodeWAV = utils.arrayBufferToBase64 = utils.minFramesForTargetMS = void 0;
  function R(c, f, s = 16e3) {
    return Math.ceil(c * s / 1e3 / f);
  }
  utils.minFramesForTargetMS = R;
  function u(c) {
    const f = new Uint8Array(c), s = f.byteLength, i = new Array(s);
    for (var t = 0; t < s; t++) {
      const e = f[t];
      if (e === void 0)
        break;
      i[t] = String.fromCharCode(e);
    }
    return btoa(i.join(""));
  }
  utils.arrayBufferToBase64 = u;
  function b(c, f = 3, s = 16e3, i = 1, t = 32) {
    var e = t / 8, n = i * e, r = new ArrayBuffer(44 + c.length * e), a = new DataView(r);
    return g(a, 0, "RIFF"), a.setUint32(4, 36 + c.length * e, !0), g(a, 8, "WAVE"), g(a, 12, "fmt "), a.setUint32(16, 16, !0), a.setUint16(20, f, !0), a.setUint16(22, i, !0), a.setUint32(24, s, !0), a.setUint32(28, s * n, !0), a.setUint16(32, n, !0), a.setUint16(34, t, !0), g(a, 36, "data"), a.setUint32(40, c.length * e, !0), f === 1 ? p(a, 44, c) : h(a, 44, c), r;
  }
  utils.encodeWAV = b;
  function h(c, f, s) {
    for (var i = 0; i < s.length; i++, f += 4)
      c.setFloat32(f, s[i], !0);
  }
  function p(c, f, s) {
    for (var i = 0; i < s.length; i++, f += 2) {
      var t = Math.max(-1, Math.min(1, s[i]));
      c.setInt16(f, t < 0 ? t * 32768 : t * 32767, !0);
    }
  }
  function g(c, f, s) {
    for (var i = 0; i < s.length; i++)
      c.setUint8(f + i, s.charCodeAt(i));
  }
  async function o(c) {
    const f = new OfflineAudioContext(1, 1, 44100), s = new FileReader();
    let i = null;
    if (await new Promise((n) => {
      s.addEventListener("loadend", (r) => {
        const a = s.result;
        f.decodeAudioData(a, (l) => {
          i = l, f.startRendering().then((d) => {
            console.log("Rendering completed successfully"), n();
          }).catch((d) => {
            console.error(`Rendering failed: ${d}`);
          });
        }, (l) => {
          console.log(`Error with decoding audio data: ${l}`);
        });
      }), s.readAsArrayBuffer(c);
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
  return hasRequiredRealTimeVad || (hasRequiredRealTimeVad = 1, function(R) {
    var u = realTimeVad.__createBinding || (Object.create ? function(d, m, y, _) {
      _ === void 0 && (_ = y);
      var v = Object.getOwnPropertyDescriptor(m, y);
      (!v || ("get" in v ? !m.__esModule : v.writable || v.configurable)) && (v = { enumerable: !0, get: function() {
        return m[y];
      } }), Object.defineProperty(d, _, v);
    } : function(d, m, y, _) {
      _ === void 0 && (_ = y), d[_] = m[y];
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
    Object.defineProperty(R, "__esModule", { value: !0 }), R.AudioNodeVAD = R.MicVAD = R.getDefaultRealTimeVADOptions = R.ort = R.DEFAULT_MODEL = void 0;
    const p = h(requireOrtWeb_min()), g = requireDefaultModelFetcher(), o = requireFrameProcessor(), c = requireLogging(), f = requireMessages(), s = requireModels(), i = requireResampler();
    R.DEFAULT_MODEL = "legacy", R.ort = p;
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
      model: R.DEFAULT_MODEL,
      workletOptions: {}
    });
    R.getDefaultRealTimeVADOptions = r;
    class a {
      static async new(m = {}) {
        const y = {
          ...(0, R.getDefaultRealTimeVADOptions)(m.model ?? R.DEFAULT_MODEL),
          ...m
        };
        (0, o.validateOptions)(y);
        let _;
        y.stream === void 0 ? _ = await navigator.mediaDevices.getUserMedia({
          audio: {
            ...y.additionalAudioConstraints,
            channelCount: 1,
            echoCancellation: !0,
            autoGainControl: !0,
            noiseSuppression: !0
          }
        }) : _ = y.stream;
        const v = new AudioContext(), S = new MediaStreamAudioSourceNode(v, {
          mediaStream: _
        }), O = await l.new(v, y);
        return O.receive(S), new a(y, v, _, O, S);
      }
      constructor(m, y, _, v, S, O = !1) {
        this.options = m, this.audioContext = y, this.stream = _, this.audioNodeVAD = v, this.sourceNode = S, this.listening = O, this.pause = () => {
          this.audioNodeVAD.pause(), this.listening = !1;
        }, this.start = () => {
          this.audioNodeVAD.start(), this.listening = !0;
        }, this.destroy = () => {
          this.listening && this.pause(), this.options.stream === void 0 && this.stream.getTracks().forEach((I) => I.stop()), this.sourceNode.disconnect(), this.audioNodeVAD.destroy(), this.audioContext.close();
        };
      }
    }
    R.MicVAD = a;
    class l {
      static async new(m, y = {}) {
        const _ = {
          ...(0, R.getDefaultRealTimeVADOptions)(y.model ?? R.DEFAULT_MODEL),
          ...y
        };
        (0, o.validateOptions)(_), R.ort.env.wasm.wasmPaths = _.onnxWASMBasePath, _.ortConfig !== void 0 && _.ortConfig(R.ort);
        const v = _.model === "v5" ? e : n, S = _.baseAssetPath + v, O = _.model === "v5" ? s.SileroV5.new : s.SileroLegacy.new;
        let I;
        try {
          I = await O(R.ort, () => (0, g.defaultModelFetcher)(S));
        } catch (V) {
          throw console.error(`Encountered an error while loading model file ${S}`), V;
        }
        const w = new o.FrameProcessor(I.process, I.reset_state, {
          frameSamples: _.frameSamples,
          positiveSpeechThreshold: _.positiveSpeechThreshold,
          negativeSpeechThreshold: _.negativeSpeechThreshold,
          redemptionFrames: _.redemptionFrames,
          preSpeechPadFrames: _.preSpeechPadFrames,
          minSpeechFrames: _.minSpeechFrames,
          submitUserSpeechOnPause: _.submitUserSpeechOnPause
        }), C = new l(m, _, w);
        return await C.setupAudioNode(), C;
      }
      constructor(m, y, _) {
        this.ctx = m, this.options = y, this.bufferIndex = 0, this.pause = () => {
          const v = this.frameProcessor.pause();
          this.handleFrameProcessorEvent(v);
        }, this.start = () => {
          this.frameProcessor.resume();
        }, this.receive = (v) => {
          v.connect(this.audioNode);
        }, this.processFrame = async (v) => {
          const S = await this.frameProcessor.process(v);
          this.handleFrameProcessorEvent(S);
        }, this.handleFrameProcessorEvent = (v) => {
          switch (v.probs !== void 0 && this.options.onFrameProcessed(v.probs, v.frame), v.msg) {
            case f.Message.SpeechStart:
              this.options.onSpeechStart();
              break;
            case f.Message.VADMisfire:
              this.options.onVADMisfire();
              break;
            case f.Message.SpeechEnd:
              this.options.onSpeechEnd(v.audio);
              break;
          }
        }, this.destroy = () => {
          var v;
          this.audioNode instanceof AudioWorkletNode && this.audioNode.port.postMessage({
            message: f.Message.SpeechStop
          }), this.audioNode.disconnect(), (v = this.gainNode) == null || v.disconnect();
        }, this.frameProcessor = _;
      }
      async setupAudioNode() {
        if ("audioWorklet" in this.ctx && typeof AudioWorkletNode == "function")
          try {
            const v = this.options.baseAssetPath + t;
            await this.ctx.audioWorklet.addModule(v);
            const S = this.options.workletOptions ?? {};
            S.processorOptions = {
              ...S.processorOptions ?? {},
              frameSamples: this.options.frameSamples
            }, this.audioNode = new AudioWorkletNode(this.ctx, "vad-helper-worklet", S), this.audioNode.port.onmessage = async (O) => {
              var I;
              switch ((I = O.data) == null ? void 0 : I.message) {
                case f.Message.AudioFrame:
                  let w = O.data.data;
                  w instanceof ArrayBuffer || (w = new ArrayBuffer(O.data.data.byteLength), new Uint8Array(w).set(new Uint8Array(O.data.data)));
                  const C = new Float32Array(w);
                  await this.processFrame(C);
                  break;
              }
            };
            return;
          } catch (v) {
            console.log("AudioWorklet setup failed, falling back to ScriptProcessor", v);
          }
        this.resampler = new i.Resampler({
          nativeSampleRate: this.ctx.sampleRate,
          targetSampleRate: 16e3,
          targetFrameSize: this.options.frameSamples ?? 480
        });
        const y = 4096;
        this.audioNode = this.ctx.createScriptProcessor(y, 1, 1), this.gainNode = this.ctx.createGain(), this.gainNode.gain.value = 0;
        let _ = !1;
        this.audioNode.onaudioprocess = async (v) => {
          if (!_) {
            _ = !0;
            try {
              const S = v.inputBuffer.getChannelData(0);
              if (v.outputBuffer.getChannelData(0).fill(0), this.resampler) {
                const I = this.resampler.process(S);
                for (const w of I)
                  await this.processFrame(w);
              }
            } catch (S) {
              console.error("Error processing audio:", S);
            } finally {
              _ = !1;
            }
          }
        }, this.audioNode.connect(this.gainNode), this.gainNode.connect(this.ctx.destination);
      }
    }
    R.AudioNodeVAD = l;
  }(realTimeVad)), realTimeVad;
}
var hasRequiredDist;
function requireDist() {
  return hasRequiredDist || (hasRequiredDist = 1, function(R) {
    var u = dist.__createBinding || (Object.create ? function(n, r, a, l) {
      l === void 0 && (l = a);
      var d = Object.getOwnPropertyDescriptor(r, a);
      (!d || ("get" in d ? !r.__esModule : d.writable || d.configurable)) && (d = { enumerable: !0, get: function() {
        return r[a];
      } }), Object.defineProperty(n, l, d);
    } : function(n, r, a, l) {
      l === void 0 && (l = a), n[l] = r[a];
    }), b = dist.__setModuleDefault || (Object.create ? function(n, r) {
      Object.defineProperty(n, "default", { enumerable: !0, value: r });
    } : function(n, r) {
      n.default = r;
    }), h = dist.__importStar || function(n) {
      if (n && n.__esModule) return n;
      var r = {};
      if (n != null) for (var a in n) a !== "default" && Object.prototype.hasOwnProperty.call(n, a) && u(r, n, a);
      return b(r, n), r;
    };
    Object.defineProperty(R, "__esModule", { value: !0 }), R.NonRealTimeVAD = R.Message = R.FrameProcessor = R.getDefaultRealTimeVADOptions = R.MicVAD = R.DEFAULT_MODEL = R.AudioNodeVAD = R.utils = R.defaultNonRealTimeVADOptions = void 0;
    const p = h(requireOrtWeb_min()), g = requireAssetPath(), o = requireDefaultModelFetcher(), c = requireFrameProcessor();
    Object.defineProperty(R, "FrameProcessor", { enumerable: !0, get: function() {
      return c.FrameProcessor;
    } });
    const f = requireMessages();
    Object.defineProperty(R, "Message", { enumerable: !0, get: function() {
      return f.Message;
    } });
    const s = requireNonRealTimeVad(), i = requireUtils();
    R.defaultNonRealTimeVADOptions = {
      modelURL: g.baseAssetPath + "silero_vad_legacy.onnx",
      modelFetcher: o.defaultModelFetcher
    };
    class t extends s.PlatformAgnosticNonRealTimeVAD {
      static async new(r = {}) {
        const { modelURL: a, modelFetcher: l } = {
          ...R.defaultNonRealTimeVADOptions,
          ...r
        };
        return await this._new(() => l(a), p, r);
      }
    }
    R.NonRealTimeVAD = t, R.utils = {
      audioFileToArray: i.audioFileToArray,
      minFramesForTargetMS: i.minFramesForTargetMS,
      arrayBufferToBase64: i.arrayBufferToBase64,
      encodeWAV: i.encodeWAV
    };
    var e = requireRealTimeVad();
    Object.defineProperty(R, "AudioNodeVAD", { enumerable: !0, get: function() {
      return e.AudioNodeVAD;
    } }), Object.defineProperty(R, "DEFAULT_MODEL", { enumerable: !0, get: function() {
      return e.DEFAULT_MODEL;
    } }), Object.defineProperty(R, "MicVAD", { enumerable: !0, get: function() {
      return e.MicVAD;
    } }), Object.defineProperty(R, "getDefaultRealTimeVADOptions", { enumerable: !0, get: function() {
      return e.getDefaultRealTimeVADOptions;
    } });
  }(dist)), dist;
}
var distExports = requireDist();
const startVad = async () => {
  console.log("startVad: starting VAD...");
  const { audioContext: R, source: u, stream: b } = await getMicrophoneInput();
  (await distExports.MicVAD.new({
    // modelURL: based("vad/silero_vad.onnx"),
    // workletURL: based("vad/vad.worklet.bundle.min.js"),
    stream: b,
    // minSpeechFrames: 50,
    positiveSpeechThreshold: 0.9,
    // negativeSpeechThreshold: 0.01,
    ortConfig: (p) => {
      console.log("startVad: ortConfig", p), p.env.wasm.numThreads = 1;
    },
    onVADMisfire: () => {
      console.log("startVad:onVADMisfire");
    },
    onSpeechStart: () => {
      console.log("startVad:onSpeechStart");
    },
    onSpeechEnd: async (p) => {
      console.log("startVad:onSpeechEnd");
    }
  })).start();
}, useMicAudio = (R) => {
  const [u, b] = React.useState({
    analyserNode: void 0
  });
  return useEffect(() => {
    R && !u.analyserNode && getMicAudio(
      // "e18767886adb9583a29268deeae90b9e36fcfb273504d3a9893f40d604aa6c71"
    ).then(({ analyserNode: h }) => {
      b((p) => ({ ...p, analyserNode: h }));
    });
  }, [R]), u.analyserNode;
}, Vads = {
  startVad,
  getMicAudio,
  getMicrophoneInput,
  useMicAudio
};
var jsxRuntime = { exports: {} }, reactJsxRuntime_production = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production;
function requireReactJsxRuntime_production() {
  if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
  hasRequiredReactJsxRuntime_production = 1;
  var R = Symbol.for("react.transitional.element"), u = Symbol.for("react.fragment");
  function b(h, p, g) {
    var o = null;
    if (g !== void 0 && (o = "" + g), p.key !== void 0 && (o = "" + p.key), "key" in p) {
      g = {};
      for (var c in p)
        c !== "key" && (g[c] = p[c]);
    } else g = p;
    return p = g.ref, {
      $$typeof: R,
      type: h,
      key: o,
      ref: p !== void 0 ? p : null,
      props: g
    };
  }
  return reactJsxRuntime_production.Fragment = u, reactJsxRuntime_production.jsx = b, reactJsxRuntime_production.jsxs = b, reactJsxRuntime_production;
}
var reactJsxRuntime_development = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_development;
function requireReactJsxRuntime_development() {
  return hasRequiredReactJsxRuntime_development || (hasRequiredReactJsxRuntime_development = 1, process.env.NODE_ENV !== "production" && function() {
    function R(L) {
      if (L == null) return null;
      if (typeof L == "function")
        return L.$$typeof === W ? null : L.displayName || L.name || null;
      if (typeof L == "string") return L;
      switch (L) {
        case S:
          return "Fragment";
        case v:
          return "Portal";
        case I:
          return "Profiler";
        case O:
          return "StrictMode";
        case G:
          return "Suspense";
        case D:
          return "SuspenseList";
      }
      if (typeof L == "object")
        switch (typeof L.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), L.$$typeof) {
          case C:
            return (L.displayName || "Context") + ".Provider";
          case w:
            return (L._context.displayName || "Context") + ".Consumer";
          case V:
            var te = L.render;
            return L = L.displayName, L || (L = te.displayName || te.name || "", L = L !== "" ? "ForwardRef(" + L + ")" : "ForwardRef"), L;
          case A:
            return te = L.displayName || null, te !== null ? te : R(L.type) || "Memo";
          case M:
            te = L._payload, L = L._init;
            try {
              return R(L(te));
            } catch {
            }
        }
      return null;
    }
    function u(L) {
      return "" + L;
    }
    function b(L) {
      try {
        u(L);
        var te = !1;
      } catch {
        te = !0;
      }
      if (te) {
        te = console;
        var oe = te.error, ve = typeof Symbol == "function" && Symbol.toStringTag && L[Symbol.toStringTag] || L.constructor.name || "Object";
        return oe.call(
          te,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          ve
        ), u(L);
      }
    }
    function h() {
    }
    function p() {
      if (me === 0) {
        ie = console.log, _e = console.info, be = console.warn, Ce = console.error, ze = console.group, he = console.groupCollapsed, Ee = console.groupEnd;
        var L = {
          configurable: !0,
          enumerable: !0,
          value: h,
          writable: !0
        };
        Object.defineProperties(console, {
          info: L,
          log: L,
          warn: L,
          error: L,
          group: L,
          groupCollapsed: L,
          groupEnd: L
        });
      }
      me++;
    }
    function g() {
      if (me--, me === 0) {
        var L = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: Z({}, L, { value: ie }),
          info: Z({}, L, { value: _e }),
          warn: Z({}, L, { value: be }),
          error: Z({}, L, { value: Ce }),
          group: Z({}, L, { value: ze }),
          groupCollapsed: Z({}, L, { value: he }),
          groupEnd: Z({}, L, { value: Ee })
        });
      }
      0 > me && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function o(L) {
      if (Ie === void 0)
        try {
          throw Error();
        } catch (oe) {
          var te = oe.stack.trim().match(/\n( *(at )?)/);
          Ie = te && te[1] || "", De = -1 < oe.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < oe.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + Ie + L + De;
    }
    function c(L, te) {
      if (!L || ke) return "";
      var oe = He.get(L);
      if (oe !== void 0) return oe;
      ke = !0, oe = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var ve = null;
      ve = q.H, q.H = null, p();
      try {
        var le = {
          DetermineComponentFrameRoot: function() {
            try {
              if (te) {
                var Ye = function() {
                  throw Error();
                };
                if (Object.defineProperty(Ye.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Ye, []);
                  } catch (Ge) {
                    var fe = Ge;
                  }
                  Reflect.construct(L, [], Ye);
                } else {
                  try {
                    Ye.call();
                  } catch (Ge) {
                    fe = Ge;
                  }
                  L.call(Ye.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (Ge) {
                  fe = Ge;
                }
                (Ye = L()) && typeof Ye.catch == "function" && Ye.catch(function() {
                });
              }
            } catch (Ge) {
              if (Ge && fe && typeof Ge.stack == "string")
                return [Ge.stack, fe.stack];
            }
            return [null, null];
          }
        };
        le.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var Fe = Object.getOwnPropertyDescriptor(
          le.DetermineComponentFrameRoot,
          "name"
        );
        Fe && Fe.configurable && Object.defineProperty(
          le.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var pe = le.DetermineComponentFrameRoot(), Ze = pe[0], We = pe[1];
        if (Ze && We) {
          var Ve = Ze.split(`
`), Qe = We.split(`
`);
          for (pe = Fe = 0; Fe < Ve.length && !Ve[Fe].includes(
            "DetermineComponentFrameRoot"
          ); )
            Fe++;
          for (; pe < Qe.length && !Qe[pe].includes(
            "DetermineComponentFrameRoot"
          ); )
            pe++;
          if (Fe === Ve.length || pe === Qe.length)
            for (Fe = Ve.length - 1, pe = Qe.length - 1; 1 <= Fe && 0 <= pe && Ve[Fe] !== Qe[pe]; )
              pe--;
          for (; 1 <= Fe && 0 <= pe; Fe--, pe--)
            if (Ve[Fe] !== Qe[pe]) {
              if (Fe !== 1 || pe !== 1)
                do
                  if (Fe--, pe--, 0 > pe || Ve[Fe] !== Qe[pe]) {
                    var je = `
` + Ve[Fe].replace(
                      " at new ",
                      " at "
                    );
                    return L.displayName && je.includes("<anonymous>") && (je = je.replace("<anonymous>", L.displayName)), typeof L == "function" && He.set(L, je), je;
                  }
                while (1 <= Fe && 0 <= pe);
              break;
            }
        }
      } finally {
        ke = !1, q.H = ve, g(), Error.prepareStackTrace = oe;
      }
      return Ve = (Ve = L ? L.displayName || L.name : "") ? o(Ve) : "", typeof L == "function" && He.set(L, Ve), Ve;
    }
    function f(L) {
      if (L == null) return "";
      if (typeof L == "function") {
        var te = L.prototype;
        return c(
          L,
          !(!te || !te.isReactComponent)
        );
      }
      if (typeof L == "string") return o(L);
      switch (L) {
        case G:
          return o("Suspense");
        case D:
          return o("SuspenseList");
      }
      if (typeof L == "object")
        switch (L.$$typeof) {
          case V:
            return L = c(L.render, !1), L;
          case A:
            return f(L.type);
          case M:
            te = L._payload, L = L._init;
            try {
              return f(L(te));
            } catch {
            }
        }
      return "";
    }
    function s() {
      var L = q.A;
      return L === null ? null : L.getOwner();
    }
    function i(L) {
      if (Q.call(L, "key")) {
        var te = Object.getOwnPropertyDescriptor(L, "key").get;
        if (te && te.isReactWarning) return !1;
      }
      return L.key !== void 0;
    }
    function t(L, te) {
      function oe() {
        Xe || (Xe = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          te
        ));
      }
      oe.isReactWarning = !0, Object.defineProperty(L, "key", {
        get: oe,
        configurable: !0
      });
    }
    function e() {
      var L = R(this.type);
      return tt[L] || (tt[L] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), L = this.props.ref, L !== void 0 ? L : null;
    }
    function n(L, te, oe, ve, le, Fe) {
      return oe = Fe.ref, L = {
        $$typeof: _,
        type: L,
        key: te,
        props: Fe,
        _owner: le
      }, (oe !== void 0 ? oe : null) !== null ? Object.defineProperty(L, "ref", {
        enumerable: !1,
        get: e
      }) : Object.defineProperty(L, "ref", { enumerable: !1, value: null }), L._store = {}, Object.defineProperty(L._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(L, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(L.props), Object.freeze(L)), L;
    }
    function r(L, te, oe, ve, le, Fe) {
      if (typeof L == "string" || typeof L == "function" || L === S || L === I || L === O || L === G || L === D || L === E || typeof L == "object" && L !== null && (L.$$typeof === M || L.$$typeof === A || L.$$typeof === C || L.$$typeof === w || L.$$typeof === V || L.$$typeof === ee || L.getModuleId !== void 0)) {
        var pe = te.children;
        if (pe !== void 0)
          if (ve)
            if (se(pe)) {
              for (ve = 0; ve < pe.length; ve++)
                a(pe[ve], L);
              Object.freeze && Object.freeze(pe);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else a(pe, L);
      } else
        pe = "", (L === void 0 || typeof L == "object" && L !== null && Object.keys(L).length === 0) && (pe += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), L === null ? ve = "null" : se(L) ? ve = "array" : L !== void 0 && L.$$typeof === _ ? (ve = "<" + (R(L.type) || "Unknown") + " />", pe = " Did you accidentally export a JSX literal instead of a component?") : ve = typeof L, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          ve,
          pe
        );
      if (Q.call(te, "key")) {
        pe = R(L);
        var Ze = Object.keys(te).filter(function(Ve) {
          return Ve !== "key";
        });
        ve = 0 < Ze.length ? "{key: someKey, " + Ze.join(": ..., ") + ": ...}" : "{key: someKey}", nt[pe + ve] || (Ze = 0 < Ze.length ? "{" + Ze.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          ve,
          pe,
          Ze,
          pe
        ), nt[pe + ve] = !0);
      }
      if (pe = null, oe !== void 0 && (b(oe), pe = "" + oe), i(te) && (b(te.key), pe = "" + te.key), "key" in te) {
        oe = {};
        for (var We in te)
          We !== "key" && (oe[We] = te[We]);
      } else oe = te;
      return pe && t(
        oe,
        typeof L == "function" ? L.displayName || L.name || "Unknown" : L
      ), n(L, pe, Fe, le, s(), oe);
    }
    function a(L, te) {
      if (typeof L == "object" && L && L.$$typeof !== Je) {
        if (se(L))
          for (var oe = 0; oe < L.length; oe++) {
            var ve = L[oe];
            l(ve) && d(ve, te);
          }
        else if (l(L))
          L._store && (L._store.validated = 1);
        else if (L === null || typeof L != "object" ? oe = null : (oe = F && L[F] || L["@@iterator"], oe = typeof oe == "function" ? oe : null), typeof oe == "function" && oe !== L.entries && (oe = oe.call(L), oe !== L))
          for (; !(L = oe.next()).done; )
            l(L.value) && d(L.value, te);
      }
    }
    function l(L) {
      return typeof L == "object" && L !== null && L.$$typeof === _;
    }
    function d(L, te) {
      if (L._store && !L._store.validated && L.key == null && (L._store.validated = 1, te = m(te), !Ke[te])) {
        Ke[te] = !0;
        var oe = "";
        L && L._owner != null && L._owner !== s() && (oe = null, typeof L._owner.tag == "number" ? oe = R(L._owner.type) : typeof L._owner.name == "string" && (oe = L._owner.name), oe = " It was passed a child from " + oe + ".");
        var ve = q.getCurrentStack;
        q.getCurrentStack = function() {
          var le = f(L.type);
          return ve && (le += ve() || ""), le;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          te,
          oe
        ), q.getCurrentStack = ve;
      }
    }
    function m(L) {
      var te = "", oe = s();
      return oe && (oe = R(oe.type)) && (te = `

Check the render method of \`` + oe + "`."), te || (L = R(L)) && (te = `

Check the top-level render call using <` + L + ">."), te;
    }
    var y = React, _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), S = Symbol.for("react.fragment"), O = Symbol.for("react.strict_mode"), I = Symbol.for("react.profiler"), w = Symbol.for("react.consumer"), C = Symbol.for("react.context"), V = Symbol.for("react.forward_ref"), G = Symbol.for("react.suspense"), D = Symbol.for("react.suspense_list"), A = Symbol.for("react.memo"), M = Symbol.for("react.lazy"), E = Symbol.for("react.offscreen"), F = Symbol.iterator, W = Symbol.for("react.client.reference"), q = y.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = Object.prototype.hasOwnProperty, Z = Object.assign, ee = Symbol.for("react.client.reference"), se = Array.isArray, me = 0, ie, _e, be, Ce, ze, he, Ee;
    h.__reactDisabledLog = !0;
    var Ie, De, ke = !1, He = new (typeof WeakMap == "function" ? WeakMap : Map)(), Je = Symbol.for("react.client.reference"), Xe, tt = {}, nt = {}, Ke = {};
    reactJsxRuntime_development.Fragment = S, reactJsxRuntime_development.jsx = function(L, te, oe, ve, le) {
      return r(L, te, oe, !1, ve, le);
    }, reactJsxRuntime_development.jsxs = function(L, te, oe, ve, le) {
      return r(L, te, oe, !0, ve, le);
    };
  }()), reactJsxRuntime_development;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  return hasRequiredJsxRuntime || (hasRequiredJsxRuntime = 1, process.env.NODE_ENV === "production" ? jsxRuntime.exports = requireReactJsxRuntime_production() : jsxRuntime.exports = requireReactJsxRuntime_development()), jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime(), meyda_min$1 = { exports: {} }, meyda_min = meyda_min$1.exports, hasRequiredMeyda_min;
function requireMeyda_min() {
  return hasRequiredMeyda_min || (hasRequiredMeyda_min = 1, function(R, u) {
    (function(b, h) {
      R.exports = h();
    })(meyda_min, function() {
      function b(D, A, M) {
        for (var E, F = 0, W = A.length; F < W; F++) !E && F in A || (E || (E = Array.prototype.slice.call(A, 0, F)), E[F] = A[F]);
        return D.concat(E || Array.prototype.slice.call(A));
      }
      var h = Object.freeze({ __proto__: null, blackman: function(D) {
        for (var A = new Float32Array(D), M = 2 * Math.PI / (D - 1), E = 2 * M, F = 0; F < D / 2; F++) A[F] = 0.42 - 0.5 * Math.cos(F * M) + 0.08 * Math.cos(F * E);
        for (F = Math.ceil(D / 2); F > 0; F--) A[D - F] = A[F - 1];
        return A;
      }, hamming: function(D) {
        for (var A = new Float32Array(D), M = 0; M < D; M++) A[M] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (M / D - 1));
        return A;
      }, hanning: function(D) {
        for (var A = new Float32Array(D), M = 0; M < D; M++) A[M] = 0.5 - 0.5 * Math.cos(2 * Math.PI * M / (D - 1));
        return A;
      }, sine: function(D) {
        for (var A = Math.PI / (D - 1), M = new Float32Array(D), E = 0; E < D; E++) M[E] = Math.sin(A * E);
        return M;
      } }), p = {};
      function g(D) {
        for (; D % 2 == 0 && D > 1; ) D /= 2;
        return D === 1;
      }
      function o(D, A) {
        if (A !== "rect") {
          if (A !== "" && A || (A = "hanning"), p[A] || (p[A] = {}), !p[A][D.length]) try {
            p[A][D.length] = h[A](D.length);
          } catch {
            throw new Error("Invalid windowing function");
          }
          D = function(M, E) {
            for (var F = [], W = 0; W < Math.min(M.length, E.length); W++) F[W] = M[W] * E[W];
            return F;
          }(D, p[A][D.length]);
        }
        return D;
      }
      function c(D, A, M) {
        for (var E = new Float32Array(D), F = 0; F < E.length; F++) E[F] = F * A / M, E[F] = 13 * Math.atan(E[F] / 1315.8) + 3.5 * Math.atan(Math.pow(E[F] / 7518, 2));
        return E;
      }
      function f(D) {
        return Float32Array.from(D);
      }
      function s(D) {
        return 1125 * Math.log(1 + D / 700);
      }
      function i(D, A, M) {
        for (var E, F = new Float32Array(D + 2), W = new Float32Array(D + 2), q = A / 2, Q = s(0), Z = (s(q) - Q) / (D + 1), ee = new Array(D + 2), se = 0; se < F.length; se++) F[se] = se * Z, W[se] = (E = F[se], 700 * (Math.exp(E / 1125) - 1)), ee[se] = Math.floor((M + 1) * W[se] / A);
        for (var me = new Array(D), ie = 0; ie < me.length; ie++) {
          for (me[ie] = new Array(M / 2 + 1).fill(0), se = ee[ie]; se < ee[ie + 1]; se++) me[ie][se] = (se - ee[ie]) / (ee[ie + 1] - ee[ie]);
          for (se = ee[ie + 1]; se < ee[ie + 2]; se++) me[ie][se] = (ee[ie + 2] - se) / (ee[ie + 2] - ee[ie + 1]);
        }
        return me;
      }
      function t(D, A, M, E, F, W, q) {
        E === void 0 && (E = 5), F === void 0 && (F = 2), W === void 0 && (W = !0), q === void 0 && (q = 440);
        var Q = Math.floor(M / 2) + 1, Z = new Array(M).fill(0).map(function(he, Ee) {
          return D * function(Ie, De) {
            return Math.log2(16 * Ie / De);
          }(A * Ee / M, q);
        });
        Z[0] = Z[1] - 1.5 * D;
        var ee, se, me, ie = Z.slice(1).map(function(he, Ee) {
          return Math.max(he - Z[Ee]);
        }, 1).concat([1]), _e = Math.round(D / 2), be = new Array(D).fill(0).map(function(he, Ee) {
          return Z.map(function(Ie) {
            return (10 * D + _e + Ie - Ee) % D - _e;
          });
        }), Ce = be.map(function(he, Ee) {
          return he.map(function(Ie, De) {
            return Math.exp(-0.5 * Math.pow(2 * be[Ee][De] / ie[De], 2));
          });
        });
        if (se = (ee = Ce)[0].map(function() {
          return 0;
        }), me = ee.reduce(function(he, Ee) {
          return Ee.forEach(function(Ie, De) {
            he[De] += Math.pow(Ie, 2);
          }), he;
        }, se).map(Math.sqrt), Ce = ee.map(function(he, Ee) {
          return he.map(function(Ie, De) {
            return Ie / (me[De] || 1);
          });
        }), F) {
          var ze = Z.map(function(he) {
            return Math.exp(-0.5 * Math.pow((he / D - E) / F, 2));
          });
          Ce = Ce.map(function(he) {
            return he.map(function(Ee, Ie) {
              return Ee * ze[Ie];
            });
          });
        }
        return W && (Ce = b(b([], Ce.slice(3), !0), Ce.slice(0, 3))), Ce.map(function(he) {
          return he.slice(0, Q);
        });
      }
      function e(D, A) {
        for (var M = 0, E = 0, F = 0; F < A.length; F++) M += Math.pow(F, D) * Math.abs(A[F]), E += A[F];
        return M / E;
      }
      function n(D) {
        var A = D.ampSpectrum, M = D.barkScale, E = D.numberOfBarkBands, F = E === void 0 ? 24 : E;
        if (typeof A != "object" || typeof M != "object") throw new TypeError();
        var W = F, q = new Float32Array(W), Q = 0, Z = A, ee = new Int32Array(W + 1);
        ee[0] = 0;
        for (var se = M[Z.length - 1] / W, me = 1, ie = 0; ie < Z.length; ie++) for (; M[ie] > se; ) ee[me++] = ie, se = me * M[Z.length - 1] / W;
        for (ee[W] = Z.length - 1, ie = 0; ie < W; ie++) {
          for (var _e = 0, be = ee[ie]; be < ee[ie + 1]; be++) _e += Z[be];
          q[ie] = Math.pow(_e, 0.23);
        }
        for (ie = 0; ie < q.length; ie++) Q += q[ie];
        return { specific: q, total: Q };
      }
      function r(D) {
        var A = D.ampSpectrum;
        if (typeof A != "object") throw new TypeError();
        for (var M = new Float32Array(A.length), E = 0; E < M.length; E++) M[E] = Math.pow(A[E], 2);
        return M;
      }
      function a(D) {
        var A = D.ampSpectrum, M = D.melFilterBank, E = D.bufferSize;
        if (typeof A != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
        if (typeof M != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
        for (var F = r({ ampSpectrum: A }), W = M.length, q = Array(W), Q = new Float32Array(W), Z = 0; Z < Q.length; Z++) {
          q[Z] = new Float32Array(E / 2), Q[Z] = 0;
          for (var ee = 0; ee < E / 2; ee++) q[Z][ee] = M[Z][ee] * F[ee], Q[Z] += q[Z][ee];
          Q[Z] = Math.log(Q[Z] + 1);
        }
        return Array.prototype.slice.call(Q);
      }
      function l(D) {
        return D.__esModule && Object.prototype.hasOwnProperty.call(D, "default") ? D.default : D;
      }
      var d = null, m = l(function(D, A) {
        var M = D.length;
        return A = A || 2, d && d[M] || function(E) {
          (d = d || {})[E] = new Array(E * E);
          for (var F = Math.PI / E, W = 0; W < E; W++) for (var q = 0; q < E; q++) d[E][q + W * E] = Math.cos(F * (q + 0.5) * W);
        }(M), D.map(function() {
          return 0;
        }).map(function(E, F) {
          return A * D.reduce(function(W, q, Q, Z) {
            return W + q * d[M][Q + F * M];
          }, 0);
        });
      }), y = Object.freeze({ __proto__: null, amplitudeSpectrum: function(D) {
        return D.ampSpectrum;
      }, buffer: function(D) {
        return D.signal;
      }, chroma: function(D) {
        var A = D.ampSpectrum, M = D.chromaFilterBank;
        if (typeof A != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
        if (typeof M != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
        var E = M.map(function(W, q) {
          return A.reduce(function(Q, Z, ee) {
            return Q + Z * W[ee];
          }, 0);
        }), F = Math.max.apply(Math, E);
        return F ? E.map(function(W) {
          return W / F;
        }) : E;
      }, complexSpectrum: function(D) {
        return D.complexSpectrum;
      }, energy: function(D) {
        var A = D.signal;
        if (typeof A != "object") throw new TypeError();
        for (var M = 0, E = 0; E < A.length; E++) M += Math.pow(Math.abs(A[E]), 2);
        return M;
      }, loudness: n, melBands: a, mfcc: function(D) {
        var A = D.ampSpectrum, M = D.melFilterBank, E = D.numberOfMFCCCoefficients, F = D.bufferSize, W = Math.min(40, Math.max(1, E || 13));
        if (M.length < W) throw new Error("Insufficient filter bank for requested number of coefficients");
        var q = a({ ampSpectrum: A, melFilterBank: M, bufferSize: F });
        return m(q).slice(0, W);
      }, perceptualSharpness: function(D) {
        for (var A = n({ ampSpectrum: D.ampSpectrum, barkScale: D.barkScale }), M = A.specific, E = 0, F = 0; F < M.length; F++) E += F < 15 ? (F + 1) * M[F + 1] : 0.066 * Math.exp(0.171 * (F + 1));
        return E *= 0.11 / A.total;
      }, perceptualSpread: function(D) {
        for (var A = n({ ampSpectrum: D.ampSpectrum, barkScale: D.barkScale }), M = 0, E = 0; E < A.specific.length; E++) A.specific[E] > M && (M = A.specific[E]);
        return Math.pow((A.total - M) / A.total, 2);
      }, powerSpectrum: r, rms: function(D) {
        var A = D.signal;
        if (typeof A != "object") throw new TypeError();
        for (var M = 0, E = 0; E < A.length; E++) M += Math.pow(A[E], 2);
        return M /= A.length, M = Math.sqrt(M);
      }, spectralCentroid: function(D) {
        var A = D.ampSpectrum;
        if (typeof A != "object") throw new TypeError();
        return e(1, A);
      }, spectralCrest: function(D) {
        var A = D.ampSpectrum;
        if (typeof A != "object") throw new TypeError();
        var M = 0, E = -1 / 0;
        return A.forEach(function(F) {
          M += Math.pow(F, 2), E = F > E ? F : E;
        }), M /= A.length, M = Math.sqrt(M), E / M;
      }, spectralFlatness: function(D) {
        var A = D.ampSpectrum;
        if (typeof A != "object") throw new TypeError();
        for (var M = 0, E = 0, F = 0; F < A.length; F++) M += Math.log(A[F]), E += A[F];
        return Math.exp(M / A.length) * A.length / E;
      }, spectralFlux: function(D) {
        var A = D.signal, M = D.previousSignal, E = D.bufferSize;
        if (typeof A != "object" || typeof M != "object") throw new TypeError();
        for (var F = 0, W = -E / 2; W < A.length / 2 - 1; W++) x = Math.abs(A[W]) - Math.abs(M[W]), F += (x + Math.abs(x)) / 2;
        return F;
      }, spectralKurtosis: function(D) {
        var A = D.ampSpectrum;
        if (typeof A != "object") throw new TypeError();
        var M = A, E = e(1, M), F = e(2, M), W = e(3, M), q = e(4, M);
        return (-3 * Math.pow(E, 4) + 6 * E * F - 4 * E * W + q) / Math.pow(Math.sqrt(F - Math.pow(E, 2)), 4);
      }, spectralRolloff: function(D) {
        var A = D.ampSpectrum, M = D.sampleRate;
        if (typeof A != "object") throw new TypeError();
        for (var E = A, F = M / (2 * (E.length - 1)), W = 0, q = 0; q < E.length; q++) W += E[q];
        for (var Q = 0.99 * W, Z = E.length - 1; W > Q && Z >= 0; ) W -= E[Z], --Z;
        return (Z + 1) * F;
      }, spectralSkewness: function(D) {
        var A = D.ampSpectrum;
        if (typeof A != "object") throw new TypeError();
        var M = e(1, A), E = e(2, A), F = e(3, A);
        return (2 * Math.pow(M, 3) - 3 * M * E + F) / Math.pow(Math.sqrt(E - Math.pow(M, 2)), 3);
      }, spectralSlope: function(D) {
        var A = D.ampSpectrum, M = D.sampleRate, E = D.bufferSize;
        if (typeof A != "object") throw new TypeError();
        for (var F = 0, W = 0, q = new Float32Array(A.length), Q = 0, Z = 0, ee = 0; ee < A.length; ee++) {
          F += A[ee];
          var se = ee * M / E;
          q[ee] = se, Q += se * se, W += se, Z += se * A[ee];
        }
        return (A.length * Z - W * F) / (F * (Q - Math.pow(W, 2)));
      }, spectralSpread: function(D) {
        var A = D.ampSpectrum;
        if (typeof A != "object") throw new TypeError();
        return Math.sqrt(e(2, A) - Math.pow(e(1, A), 2));
      }, zcr: function(D) {
        var A = D.signal;
        if (typeof A != "object") throw new TypeError();
        for (var M = 0, E = 1; E < A.length; E++) (A[E - 1] >= 0 && A[E] < 0 || A[E - 1] < 0 && A[E] >= 0) && M++;
        return M;
      } });
      function _(D) {
        if (Array.isArray(D)) {
          for (var A = 0, M = Array(D.length); A < D.length; A++) M[A] = D[A];
          return M;
        }
        return Array.from(D);
      }
      var v = {}, S = {}, O = { bitReverseArray: function(D) {
        if (v[D] === void 0) {
          for (var A = (D - 1).toString(2).length, M = "0".repeat(A), E = {}, F = 0; F < D; F++) {
            var W = F.toString(2);
            W = M.substr(W.length) + W, W = [].concat(_(W)).reverse().join(""), E[F] = parseInt(W, 2);
          }
          v[D] = E;
        }
        return v[D];
      }, multiply: function(D, A) {
        return { real: D.real * A.real - D.imag * A.imag, imag: D.real * A.imag + D.imag * A.real };
      }, add: function(D, A) {
        return { real: D.real + A.real, imag: D.imag + A.imag };
      }, subtract: function(D, A) {
        return { real: D.real - A.real, imag: D.imag - A.imag };
      }, euler: function(D, A) {
        var M = -2 * Math.PI * D / A;
        return { real: Math.cos(M), imag: Math.sin(M) };
      }, conj: function(D) {
        return D.imag *= -1, D;
      }, constructComplexArray: function(D) {
        var A = {};
        A.real = D.real === void 0 ? D.slice() : D.real.slice();
        var M = A.real.length;
        return S[M] === void 0 && (S[M] = Array.apply(null, Array(M)).map(Number.prototype.valueOf, 0)), A.imag = S[M].slice(), A;
      } }, I = function(D) {
        var A = {};
        D.real === void 0 || D.imag === void 0 ? A = O.constructComplexArray(D) : (A.real = D.real.slice(), A.imag = D.imag.slice());
        var M = A.real.length, E = Math.log2(M);
        if (Math.round(E) != E) throw new Error("Input size must be a power of 2.");
        if (A.real.length != A.imag.length) throw new Error("Real and imaginary components must have the same length.");
        for (var F = O.bitReverseArray(M), W = { real: [], imag: [] }, q = 0; q < M; q++) W.real[F[q]] = A.real[q], W.imag[F[q]] = A.imag[q];
        for (var Q = 0; Q < M; Q++) A.real[Q] = W.real[Q], A.imag[Q] = W.imag[Q];
        for (var Z = 1; Z <= E; Z++) for (var ee = Math.pow(2, Z), se = 0; se < ee / 2; se++) for (var me = O.euler(se, ee), ie = 0; ie < M / ee; ie++) {
          var _e = ee * ie + se, be = ee * ie + se + ee / 2, Ce = { real: A.real[_e], imag: A.imag[_e] }, ze = { real: A.real[be], imag: A.imag[be] }, he = O.multiply(me, ze), Ee = O.subtract(Ce, he);
          A.real[be] = Ee.real, A.imag[be] = Ee.imag;
          var Ie = O.add(he, Ce);
          A.real[_e] = Ie.real, A.imag[_e] = Ie.imag;
        }
        return A;
      }, w = I, C = function() {
        function D(A, M) {
          var E = this;
          if (this._m = M, !A.audioContext) throw this._m.errors.noAC;
          if (A.bufferSize && !g(A.bufferSize)) throw this._m._errors.notPow2;
          if (!A.source) throw this._m._errors.noSource;
          this._m.audioContext = A.audioContext, this._m.bufferSize = A.bufferSize || this._m.bufferSize || 256, this._m.hopSize = A.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = A.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = A.callback, this._m.windowingFunction = A.windowingFunction || "hanning", this._m.featureExtractors = y, this._m.EXTRACTION_STARTED = A.startImmediately || !1, this._m.channel = typeof A.channel == "number" ? A.channel : 0, this._m.inputs = A.inputs || 1, this._m.outputs = A.outputs || 1, this._m.numberOfMFCCCoefficients = A.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = A.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = A.featureExtractors || [], this._m.barkScale = c(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = i(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(A.source), this._m.spn.onaudioprocess = function(F) {
            var W;
            E._m.inputData !== null && (E._m.previousInputData = E._m.inputData), E._m.inputData = F.inputBuffer.getChannelData(E._m.channel), E._m.previousInputData ? ((W = new Float32Array(E._m.previousInputData.length + E._m.inputData.length - E._m.hopSize)).set(E._m.previousInputData.slice(E._m.hopSize)), W.set(E._m.inputData, E._m.previousInputData.length - E._m.hopSize)) : W = E._m.inputData;
            var q = function(Q, Z, ee) {
              if (Q.length < Z) throw new Error("Buffer is too short for frame length");
              if (ee < 1) throw new Error("Hop length cannot be less that 1");
              if (Z < 1) throw new Error("Frame length cannot be less that 1");
              var se = 1 + Math.floor((Q.length - Z) / ee);
              return new Array(se).fill(0).map(function(me, ie) {
                return Q.slice(ie * ee, ie * ee + Z);
              });
            }(W, E._m.bufferSize, E._m.hopSize);
            q.forEach(function(Q) {
              E._m.frame = Q;
              var Z = E._m.extract(E._m._featuresToExtract, E._m.frame, E._m.previousFrame);
              typeof E._m.callback == "function" && E._m.EXTRACTION_STARTED && E._m.callback(Z), E._m.previousFrame = E._m.frame;
            });
          };
        }
        return D.prototype.start = function(A) {
          this._m._featuresToExtract = A || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
        }, D.prototype.stop = function() {
          this._m.EXTRACTION_STARTED = !1;
        }, D.prototype.setSource = function(A) {
          this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = A, this._m.source.connect(this._m.spn);
        }, D.prototype.setChannel = function(A) {
          A <= this._m.inputs ? this._m.channel = A : console.error("Channel ".concat(A, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(A, " when instantiating the MeydaAnalyzer"));
        }, D.prototype.get = function(A) {
          return this._m.inputData ? this._m.extract(A || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
        }, D;
      }(), V = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: y, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: o, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(D) {
        return new C(D, Object.assign({}, V));
      }, listAvailableFeatureExtractors: function() {
        return Object.keys(this.featureExtractors);
      }, extract: function(D, A, M) {
        var E = this;
        if (!A) throw this._errors.invalidInput;
        if (typeof A != "object") throw this._errors.invalidInput;
        if (!D) throw this._errors.featureUndef;
        if (!g(A.length)) throw this._errors.notPow2;
        this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = c(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = i(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = t(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in A && A.buffer === void 0 ? this.signal = f(A) : this.signal = A;
        var F = G(A, this.windowingFunction, this.bufferSize);
        if (this.signal = F.windowedSignal, this.complexSpectrum = F.complexSpectrum, this.ampSpectrum = F.ampSpectrum, M) {
          var W = G(M, this.windowingFunction, this.bufferSize);
          this.previousSignal = W.windowedSignal, this.previousComplexSpectrum = W.complexSpectrum, this.previousAmpSpectrum = W.ampSpectrum;
        }
        var q = function(Q) {
          return E.featureExtractors[Q]({ ampSpectrum: E.ampSpectrum, chromaFilterBank: E.chromaFilterBank, complexSpectrum: E.complexSpectrum, signal: E.signal, bufferSize: E.bufferSize, sampleRate: E.sampleRate, barkScale: E.barkScale, melFilterBank: E.melFilterBank, previousSignal: E.previousSignal, previousAmpSpectrum: E.previousAmpSpectrum, previousComplexSpectrum: E.previousComplexSpectrum, numberOfMFCCCoefficients: E.numberOfMFCCCoefficients, numberOfBarkBands: E.numberOfBarkBands });
        };
        if (typeof D == "object") return D.reduce(function(Q, Z) {
          var ee;
          return Object.assign({}, Q, ((ee = {})[Z] = q(Z), ee));
        }, {});
        if (typeof D == "string") return q(D);
        throw this._errors.invalidFeatureFmt;
      } }, G = function(D, A, M) {
        var E = {};
        D.buffer === void 0 ? E.signal = f(D) : E.signal = D, E.windowedSignal = o(E.signal, A), E.complexSpectrum = w(E.windowedSignal), E.ampSpectrum = new Float32Array(M / 2);
        for (var F = 0; F < M / 2; F++) E.ampSpectrum[F] = Math.sqrt(Math.pow(E.complexSpectrum.real[F], 2) + Math.pow(E.complexSpectrum.imag[F], 2));
        return E;
      };
      return typeof window < "u" && (window.Meyda = V), V;
    });
  }(meyda_min$1)), meyda_min$1.exports;
}
var meyda_minExports = requireMeyda_min();
const Meyda = /* @__PURE__ */ getDefaultExportFromCjs(meyda_minExports), initMeyda = (R, u) => {
  const b = Meyda.createMeydaAnalyzer({
    audioContext: R.context,
    source: R,
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
function calculatePhonemeLevels(R) {
  const { mfcc: u, rms: b, spectralCentroid: h } = R;
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
const LevelGraph = ({ name: R, value: u }) => {
  const b = useRef(null), [h, p] = useState(0), [g, o] = useState(1);
  return useEffect(() => {
    u && (u < h && p(u), u > g && o(u));
  }, [u, h, g]), useEffect(() => {
    const c = b.current;
    if (c) {
      const f = c.getContext("2d", { willReadFrequently: !0 });
      if (f) {
        const s = f.getImageData(
          1,
          0,
          c.width - 1,
          c.height
        );
        f.putImageData(s, 0, 0), f.clearRect(c.width - 1, 0, 1, c.height);
        const i = g - h || 1, t = (u - h) / i, e = c.height - t * c.height;
        f.lineWidth = 5, f.beginPath(), f.moveTo(c.width - 2, e), f.lineTo(c.width - 1, e), f.strokeStyle = "green", f.stroke();
      }
    }
  }, [u, h, g]), /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: R }),
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
  analyserNode: R
}) => {
  const [u, b] = useState({});
  return useEffect(() => {
    if (!R)
      return;
    const h = initMeyda(R, (p) => {
      b(p);
    });
    return () => {
      h.stop();
    };
  }, [R]), /* @__PURE__ */ jsxRuntimeExports.jsx(
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
