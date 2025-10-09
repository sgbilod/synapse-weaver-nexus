import { ipcMain as ce, app as $, BrowserWindow as le } from "electron";
import T from "path";
import { fileURLToPath as _e } from "url";
import Se from "dockerode";
import { randomFillSync as Oe, randomUUID as Ae } from "node:crypto";
const h = [];
for (let e = 0; e < 256; ++e)
  h.push((e + 256).toString(16).slice(1));
function ye(e, t = 0) {
  return (h[e[t + 0]] + h[e[t + 1]] + h[e[t + 2]] + h[e[t + 3]] + "-" + h[e[t + 4]] + h[e[t + 5]] + "-" + h[e[t + 6]] + h[e[t + 7]] + "-" + h[e[t + 8]] + h[e[t + 9]] + "-" + h[e[t + 10]] + h[e[t + 11]] + h[e[t + 12]] + h[e[t + 13]] + h[e[t + 14]] + h[e[t + 15]]).toLowerCase();
}
const U = new Uint8Array(256);
let L = U.length;
function Ne() {
  return L > U.length - 16 && (Oe(U), L = 0), U.slice(L, L += 16);
}
const H = { randomUUID: Ae };
function Te(e, t, n) {
  e = e || {};
  const o = e.random ?? e.rng?.() ?? Ne();
  if (o.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, ye(o);
}
function k(e, t, n) {
  return H.randomUUID && !e ? H.randomUUID() : Te(e);
}
var j;
(function(e) {
  e.STRING = "string", e.NUMBER = "number", e.INTEGER = "integer", e.BOOLEAN = "boolean", e.ARRAY = "array", e.OBJECT = "object";
})(j || (j = {}));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var q;
(function(e) {
  e.LANGUAGE_UNSPECIFIED = "language_unspecified", e.PYTHON = "python";
})(q || (q = {}));
var B;
(function(e) {
  e.OUTCOME_UNSPECIFIED = "outcome_unspecified", e.OUTCOME_OK = "outcome_ok", e.OUTCOME_FAILED = "outcome_failed", e.OUTCOME_DEADLINE_EXCEEDED = "outcome_deadline_exceeded";
})(B || (B = {}));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Y = ["user", "model", "function", "system"];
var V;
(function(e) {
  e.HARM_CATEGORY_UNSPECIFIED = "HARM_CATEGORY_UNSPECIFIED", e.HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH", e.HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT", e.HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT", e.HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT", e.HARM_CATEGORY_CIVIC_INTEGRITY = "HARM_CATEGORY_CIVIC_INTEGRITY";
})(V || (V = {}));
var X;
(function(e) {
  e.HARM_BLOCK_THRESHOLD_UNSPECIFIED = "HARM_BLOCK_THRESHOLD_UNSPECIFIED", e.BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE", e.BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE", e.BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH", e.BLOCK_NONE = "BLOCK_NONE";
})(X || (X = {}));
var W;
(function(e) {
  e.HARM_PROBABILITY_UNSPECIFIED = "HARM_PROBABILITY_UNSPECIFIED", e.NEGLIGIBLE = "NEGLIGIBLE", e.LOW = "LOW", e.MEDIUM = "MEDIUM", e.HIGH = "HIGH";
})(W || (W = {}));
var J;
(function(e) {
  e.BLOCKED_REASON_UNSPECIFIED = "BLOCKED_REASON_UNSPECIFIED", e.SAFETY = "SAFETY", e.OTHER = "OTHER";
})(J || (J = {}));
var v;
(function(e) {
  e.FINISH_REASON_UNSPECIFIED = "FINISH_REASON_UNSPECIFIED", e.STOP = "STOP", e.MAX_TOKENS = "MAX_TOKENS", e.SAFETY = "SAFETY", e.RECITATION = "RECITATION", e.LANGUAGE = "LANGUAGE", e.BLOCKLIST = "BLOCKLIST", e.PROHIBITED_CONTENT = "PROHIBITED_CONTENT", e.SPII = "SPII", e.MALFORMED_FUNCTION_CALL = "MALFORMED_FUNCTION_CALL", e.OTHER = "OTHER";
})(v || (v = {}));
var z;
(function(e) {
  e.TASK_TYPE_UNSPECIFIED = "TASK_TYPE_UNSPECIFIED", e.RETRIEVAL_QUERY = "RETRIEVAL_QUERY", e.RETRIEVAL_DOCUMENT = "RETRIEVAL_DOCUMENT", e.SEMANTIC_SIMILARITY = "SEMANTIC_SIMILARITY", e.CLASSIFICATION = "CLASSIFICATION", e.CLUSTERING = "CLUSTERING";
})(z || (z = {}));
var Q;
(function(e) {
  e.MODE_UNSPECIFIED = "MODE_UNSPECIFIED", e.AUTO = "AUTO", e.ANY = "ANY", e.NONE = "NONE";
})(Q || (Q = {}));
var Z;
(function(e) {
  e.MODE_UNSPECIFIED = "MODE_UNSPECIFIED", e.MODE_DYNAMIC = "MODE_DYNAMIC";
})(Z || (Z = {}));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class C extends Error {
  constructor(t) {
    super(`[GoogleGenerativeAI Error]: ${t}`);
  }
}
class y extends C {
  constructor(t, n) {
    super(t), this.response = n;
  }
}
class de extends C {
  constructor(t, n, o, s) {
    super(t), this.status = n, this.statusText = o, this.errorDetails = s;
  }
}
class _ extends C {
}
class ue extends C {
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ve = "https://generativelanguage.googleapis.com", we = "v1beta", be = "0.24.1", De = "genai-js";
var O;
(function(e) {
  e.GENERATE_CONTENT = "generateContent", e.STREAM_GENERATE_CONTENT = "streamGenerateContent", e.COUNT_TOKENS = "countTokens", e.EMBED_CONTENT = "embedContent", e.BATCH_EMBED_CONTENTS = "batchEmbedContents";
})(O || (O = {}));
class Me {
  constructor(t, n, o, s, i) {
    this.model = t, this.task = n, this.apiKey = o, this.stream = s, this.requestOptions = i;
  }
  toString() {
    var t, n;
    const o = ((t = this.requestOptions) === null || t === void 0 ? void 0 : t.apiVersion) || we;
    let i = `${((n = this.requestOptions) === null || n === void 0 ? void 0 : n.baseUrl) || ve}/${o}/${this.model}:${this.task}`;
    return this.stream && (i += "?alt=sse"), i;
  }
}
function Le(e) {
  const t = [];
  return e?.apiClient && t.push(e.apiClient), t.push(`${De}/${be}`), t.join(" ");
}
async function ke(e) {
  var t;
  const n = new Headers();
  n.append("Content-Type", "application/json"), n.append("x-goog-api-client", Le(e.requestOptions)), n.append("x-goog-api-key", e.apiKey);
  let o = (t = e.requestOptions) === null || t === void 0 ? void 0 : t.customHeaders;
  if (o) {
    if (!(o instanceof Headers))
      try {
        o = new Headers(o);
      } catch (s) {
        throw new _(`unable to convert customHeaders value ${JSON.stringify(o)} to Headers: ${s.message}`);
      }
    for (const [s, i] of o.entries()) {
      if (s === "x-goog-api-key")
        throw new _(`Cannot set reserved header name ${s}`);
      if (s === "x-goog-api-client")
        throw new _(`Header name ${s} can only be set using the apiClient field`);
      n.append(s, i);
    }
  }
  return n;
}
async function Ue(e, t, n, o, s, i) {
  const a = new Me(e, t, n, o, i);
  return {
    url: a.toString(),
    fetchOptions: Object.assign(Object.assign({}, Pe(i)), { method: "POST", headers: await ke(a), body: s })
  };
}
async function M(e, t, n, o, s, i = {}, a = fetch) {
  const { url: r, fetchOptions: c } = await Ue(e, t, n, o, s, i);
  return xe(r, c, a);
}
async function xe(e, t, n = fetch) {
  let o;
  try {
    o = await n(e, t);
  } catch (s) {
    $e(s, e);
  }
  return o.ok || await Ge(o, e), o;
}
function $e(e, t) {
  let n = e;
  throw n.name === "AbortError" ? (n = new ue(`Request aborted when fetching ${t.toString()}: ${e.message}`), n.stack = e.stack) : e instanceof de || e instanceof _ || (n = new C(`Error fetching from ${t.toString()}: ${e.message}`), n.stack = e.stack), n;
}
async function Ge(e, t) {
  let n = "", o;
  try {
    const s = await e.json();
    n = s.error.message, s.error.details && (n += ` ${JSON.stringify(s.error.details)}`, o = s.error.details);
  } catch {
  }
  throw new de(`Error fetching from ${t.toString()}: [${e.status} ${e.statusText}] ${n}`, e.status, e.statusText, o);
}
function Pe(e) {
  const t = {};
  if (e?.signal !== void 0 || e?.timeout >= 0) {
    const n = new AbortController();
    e?.timeout >= 0 && setTimeout(() => n.abort(), e.timeout), e?.signal && e.signal.addEventListener("abort", () => {
      n.abort();
    }), t.signal = n.signal;
  }
  return t;
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function K(e) {
  return e.text = () => {
    if (e.candidates && e.candidates.length > 0) {
      if (e.candidates.length > 1 && console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`), x(e.candidates[0]))
        throw new y(`${R(e)}`, e);
      return Ke(e);
    } else if (e.promptFeedback)
      throw new y(`Text not available. ${R(e)}`, e);
    return "";
  }, e.functionCall = () => {
    if (e.candidates && e.candidates.length > 0) {
      if (e.candidates.length > 1 && console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`), x(e.candidates[0]))
        throw new y(`${R(e)}`, e);
      return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."), ee(e)[0];
    } else if (e.promptFeedback)
      throw new y(`Function call not available. ${R(e)}`, e);
  }, e.functionCalls = () => {
    if (e.candidates && e.candidates.length > 0) {
      if (e.candidates.length > 1 && console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`), x(e.candidates[0]))
        throw new y(`${R(e)}`, e);
      return ee(e);
    } else if (e.promptFeedback)
      throw new y(`Function call not available. ${R(e)}`, e);
  }, e;
}
function Ke(e) {
  var t, n, o, s;
  const i = [];
  if (!((n = (t = e.candidates) === null || t === void 0 ? void 0 : t[0].content) === null || n === void 0) && n.parts)
    for (const a of (s = (o = e.candidates) === null || o === void 0 ? void 0 : o[0].content) === null || s === void 0 ? void 0 : s.parts)
      a.text && i.push(a.text), a.executableCode && i.push("\n```" + a.executableCode.language + `
` + a.executableCode.code + "\n```\n"), a.codeExecutionResult && i.push("\n```\n" + a.codeExecutionResult.output + "\n```\n");
  return i.length > 0 ? i.join("") : "";
}
function ee(e) {
  var t, n, o, s;
  const i = [];
  if (!((n = (t = e.candidates) === null || t === void 0 ? void 0 : t[0].content) === null || n === void 0) && n.parts)
    for (const a of (s = (o = e.candidates) === null || o === void 0 ? void 0 : o[0].content) === null || s === void 0 ? void 0 : s.parts)
      a.functionCall && i.push(a.functionCall);
  if (i.length > 0)
    return i;
}
const Fe = [
  v.RECITATION,
  v.SAFETY,
  v.LANGUAGE
];
function x(e) {
  return !!e.finishReason && Fe.includes(e.finishReason);
}
function R(e) {
  var t, n, o;
  let s = "";
  if ((!e.candidates || e.candidates.length === 0) && e.promptFeedback)
    s += "Response was blocked", !((t = e.promptFeedback) === null || t === void 0) && t.blockReason && (s += ` due to ${e.promptFeedback.blockReason}`), !((n = e.promptFeedback) === null || n === void 0) && n.blockReasonMessage && (s += `: ${e.promptFeedback.blockReasonMessage}`);
  else if (!((o = e.candidates) === null || o === void 0) && o[0]) {
    const i = e.candidates[0];
    x(i) && (s += `Candidate was blocked due to ${i.finishReason}`, i.finishMessage && (s += `: ${i.finishMessage}`));
  }
  return s;
}
function b(e) {
  return this instanceof b ? (this.v = e, this) : new b(e);
}
function He(e, t, n) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var o = n.apply(e, t || []), s, i = [];
  return s = {}, a("next"), a("throw"), a("return"), s[Symbol.asyncIterator] = function() {
    return this;
  }, s;
  function a(d) {
    o[d] && (s[d] = function(l) {
      return new Promise(function(E, I) {
        i.push([d, l, E, I]) > 1 || r(d, l);
      });
    });
  }
  function r(d, l) {
    try {
      c(o[d](l));
    } catch (E) {
      f(i[0][3], E);
    }
  }
  function c(d) {
    d.value instanceof b ? Promise.resolve(d.value.v).then(u, g) : f(i[0][2], d);
  }
  function u(d) {
    r("next", d);
  }
  function g(d) {
    r("throw", d);
  }
  function f(d, l) {
    d(l), i.shift(), i.length && r(i[0][0], i[0][1]);
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const te = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
function je(e) {
  const t = e.body.pipeThrough(new TextDecoderStream("utf8", { fatal: !0 })), n = Ye(t), [o, s] = n.tee();
  return {
    stream: Be(o),
    response: qe(s)
  };
}
async function qe(e) {
  const t = [], n = e.getReader();
  for (; ; ) {
    const { done: o, value: s } = await n.read();
    if (o)
      return K(Ve(t));
    t.push(s);
  }
}
function Be(e) {
  return He(this, arguments, function* () {
    const n = e.getReader();
    for (; ; ) {
      const { value: o, done: s } = yield b(n.read());
      if (s)
        break;
      yield yield b(K(o));
    }
  });
}
function Ye(e) {
  const t = e.getReader();
  return new ReadableStream({
    start(o) {
      let s = "";
      return i();
      function i() {
        return t.read().then(({ value: a, done: r }) => {
          if (r) {
            if (s.trim()) {
              o.error(new C("Failed to parse stream"));
              return;
            }
            o.close();
            return;
          }
          s += a;
          let c = s.match(te), u;
          for (; c; ) {
            try {
              u = JSON.parse(c[1]);
            } catch {
              o.error(new C(`Error parsing JSON response: "${c[1]}"`));
              return;
            }
            o.enqueue(u), s = s.substring(c[0].length), c = s.match(te);
          }
          return i();
        }).catch((a) => {
          let r = a;
          throw r.stack = a.stack, r.name === "AbortError" ? r = new ue("Request aborted when reading from the stream") : r = new C("Error reading from the stream"), r;
        });
      }
    }
  });
}
function Ve(e) {
  const t = e[e.length - 1], n = {
    promptFeedback: t?.promptFeedback
  };
  for (const o of e) {
    if (o.candidates) {
      let s = 0;
      for (const i of o.candidates)
        if (n.candidates || (n.candidates = []), n.candidates[s] || (n.candidates[s] = {
          index: s
        }), n.candidates[s].citationMetadata = i.citationMetadata, n.candidates[s].groundingMetadata = i.groundingMetadata, n.candidates[s].finishReason = i.finishReason, n.candidates[s].finishMessage = i.finishMessage, n.candidates[s].safetyRatings = i.safetyRatings, i.content && i.content.parts) {
          n.candidates[s].content || (n.candidates[s].content = {
            role: i.content.role || "user",
            parts: []
          });
          const a = {};
          for (const r of i.content.parts)
            r.text && (a.text = r.text), r.functionCall && (a.functionCall = r.functionCall), r.executableCode && (a.executableCode = r.executableCode), r.codeExecutionResult && (a.codeExecutionResult = r.codeExecutionResult), Object.keys(a).length === 0 && (a.text = ""), n.candidates[s].content.parts.push(a);
        }
      s++;
    }
    o.usageMetadata && (n.usageMetadata = o.usageMetadata);
  }
  return n;
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function fe(e, t, n, o) {
  const s = await M(
    t,
    O.STREAM_GENERATE_CONTENT,
    e,
    /* stream */
    !0,
    JSON.stringify(n),
    o
  );
  return je(s);
}
async function Ee(e, t, n, o) {
  const i = await (await M(
    t,
    O.GENERATE_CONTENT,
    e,
    /* stream */
    !1,
    JSON.stringify(n),
    o
  )).json();
  return {
    response: K(i)
  };
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ge(e) {
  if (e != null) {
    if (typeof e == "string")
      return { role: "system", parts: [{ text: e }] };
    if (e.text)
      return { role: "system", parts: [e] };
    if (e.parts)
      return e.role ? e : { role: "system", parts: e.parts };
  }
}
function D(e) {
  let t = [];
  if (typeof e == "string")
    t = [{ text: e }];
  else
    for (const n of e)
      typeof n == "string" ? t.push({ text: n }) : t.push(n);
  return Xe(t);
}
function Xe(e) {
  const t = { role: "user", parts: [] }, n = { role: "function", parts: [] };
  let o = !1, s = !1;
  for (const i of e)
    "functionResponse" in i ? (n.parts.push(i), s = !0) : (t.parts.push(i), o = !0);
  if (o && s)
    throw new C("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
  if (!o && !s)
    throw new C("No content is provided for sending chat message.");
  return o ? t : n;
}
function We(e, t) {
  var n;
  let o = {
    model: t?.model,
    generationConfig: t?.generationConfig,
    safetySettings: t?.safetySettings,
    tools: t?.tools,
    toolConfig: t?.toolConfig,
    systemInstruction: t?.systemInstruction,
    cachedContent: (n = t?.cachedContent) === null || n === void 0 ? void 0 : n.name,
    contents: []
  };
  const s = e.generateContentRequest != null;
  if (e.contents) {
    if (s)
      throw new _("CountTokensRequest must have one of contents or generateContentRequest, not both.");
    o.contents = e.contents;
  } else if (s)
    o = Object.assign(Object.assign({}, o), e.generateContentRequest);
  else {
    const i = D(e);
    o.contents = [i];
  }
  return { generateContentRequest: o };
}
function ne(e) {
  let t;
  return e.contents ? t = e : t = { contents: [D(e)] }, e.systemInstruction && (t.systemInstruction = ge(e.systemInstruction)), t;
}
function Je(e) {
  return typeof e == "string" || Array.isArray(e) ? { content: D(e) } : e;
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const oe = [
  "text",
  "inlineData",
  "functionCall",
  "functionResponse",
  "executableCode",
  "codeExecutionResult"
], ze = {
  user: ["text", "inlineData"],
  function: ["functionResponse"],
  model: ["text", "functionCall", "executableCode", "codeExecutionResult"],
  // System instructions shouldn't be in history anyway.
  system: ["text"]
};
function Qe(e) {
  let t = !1;
  for (const n of e) {
    const { role: o, parts: s } = n;
    if (!t && o !== "user")
      throw new C(`First content should be with role 'user', got ${o}`);
    if (!Y.includes(o))
      throw new C(`Each item should include role field. Got ${o} but valid roles are: ${JSON.stringify(Y)}`);
    if (!Array.isArray(s))
      throw new C("Content should have 'parts' property with an array of Parts");
    if (s.length === 0)
      throw new C("Each Content should have at least one part");
    const i = {
      text: 0,
      inlineData: 0,
      functionCall: 0,
      functionResponse: 0,
      fileData: 0,
      executableCode: 0,
      codeExecutionResult: 0
    };
    for (const r of s)
      for (const c of oe)
        c in r && (i[c] += 1);
    const a = ze[o];
    for (const r of oe)
      if (!a.includes(r) && i[r] > 0)
        throw new C(`Content with role '${o}' can't contain '${r}' part`);
    t = !0;
  }
}
function se(e) {
  var t;
  if (e.candidates === void 0 || e.candidates.length === 0)
    return !1;
  const n = (t = e.candidates[0]) === null || t === void 0 ? void 0 : t.content;
  if (n === void 0 || n.parts === void 0 || n.parts.length === 0)
    return !1;
  for (const o of n.parts)
    if (o === void 0 || Object.keys(o).length === 0 || o.text !== void 0 && o.text === "")
      return !1;
  return !0;
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ie = "SILENT_ERROR";
class Ze {
  constructor(t, n, o, s = {}) {
    this.model = n, this.params = o, this._requestOptions = s, this._history = [], this._sendPromise = Promise.resolve(), this._apiKey = t, o?.history && (Qe(o.history), this._history = o.history);
  }
  /**
   * Gets the chat history so far. Blocked prompts are not added to history.
   * Blocked candidates are not added to history, nor are the prompts that
   * generated them.
   */
  async getHistory() {
    return await this._sendPromise, this._history;
  }
  /**
   * Sends a chat message and receives a non-streaming
   * {@link GenerateContentResult}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessage(t, n = {}) {
    var o, s, i, a, r, c;
    await this._sendPromise;
    const u = D(t), g = {
      safetySettings: (o = this.params) === null || o === void 0 ? void 0 : o.safetySettings,
      generationConfig: (s = this.params) === null || s === void 0 ? void 0 : s.generationConfig,
      tools: (i = this.params) === null || i === void 0 ? void 0 : i.tools,
      toolConfig: (a = this.params) === null || a === void 0 ? void 0 : a.toolConfig,
      systemInstruction: (r = this.params) === null || r === void 0 ? void 0 : r.systemInstruction,
      cachedContent: (c = this.params) === null || c === void 0 ? void 0 : c.cachedContent,
      contents: [...this._history, u]
    }, f = Object.assign(Object.assign({}, this._requestOptions), n);
    let d;
    return this._sendPromise = this._sendPromise.then(() => Ee(this._apiKey, this.model, g, f)).then((l) => {
      var E;
      if (se(l.response)) {
        this._history.push(u);
        const I = Object.assign({
          parts: [],
          // Response seems to come back without a role set.
          role: "model"
        }, (E = l.response.candidates) === null || E === void 0 ? void 0 : E[0].content);
        this._history.push(I);
      } else {
        const I = R(l.response);
        I && console.warn(`sendMessage() was unsuccessful. ${I}. Inspect response object for details.`);
      }
      d = l;
    }).catch((l) => {
      throw this._sendPromise = Promise.resolve(), l;
    }), await this._sendPromise, d;
  }
  /**
   * Sends a chat message and receives the response as a
   * {@link GenerateContentStreamResult} containing an iterable stream
   * and a response promise.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessageStream(t, n = {}) {
    var o, s, i, a, r, c;
    await this._sendPromise;
    const u = D(t), g = {
      safetySettings: (o = this.params) === null || o === void 0 ? void 0 : o.safetySettings,
      generationConfig: (s = this.params) === null || s === void 0 ? void 0 : s.generationConfig,
      tools: (i = this.params) === null || i === void 0 ? void 0 : i.tools,
      toolConfig: (a = this.params) === null || a === void 0 ? void 0 : a.toolConfig,
      systemInstruction: (r = this.params) === null || r === void 0 ? void 0 : r.systemInstruction,
      cachedContent: (c = this.params) === null || c === void 0 ? void 0 : c.cachedContent,
      contents: [...this._history, u]
    }, f = Object.assign(Object.assign({}, this._requestOptions), n), d = fe(this._apiKey, this.model, g, f);
    return this._sendPromise = this._sendPromise.then(() => d).catch((l) => {
      throw new Error(ie);
    }).then((l) => l.response).then((l) => {
      if (se(l)) {
        this._history.push(u);
        const E = Object.assign({}, l.candidates[0].content);
        E.role || (E.role = "model"), this._history.push(E);
      } else {
        const E = R(l);
        E && console.warn(`sendMessageStream() was unsuccessful. ${E}. Inspect response object for details.`);
      }
    }).catch((l) => {
      l.message !== ie && console.error(l);
    }), d;
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function et(e, t, n, o) {
  return (await M(t, O.COUNT_TOKENS, e, !1, JSON.stringify(n), o)).json();
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function tt(e, t, n, o) {
  return (await M(t, O.EMBED_CONTENT, e, !1, JSON.stringify(n), o)).json();
}
async function nt(e, t, n, o) {
  const s = n.requests.map((a) => Object.assign(Object.assign({}, a), { model: t }));
  return (await M(t, O.BATCH_EMBED_CONTENTS, e, !1, JSON.stringify({ requests: s }), o)).json();
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ae {
  constructor(t, n, o = {}) {
    this.apiKey = t, this._requestOptions = o, n.model.includes("/") ? this.model = n.model : this.model = `models/${n.model}`, this.generationConfig = n.generationConfig || {}, this.safetySettings = n.safetySettings || [], this.tools = n.tools, this.toolConfig = n.toolConfig, this.systemInstruction = ge(n.systemInstruction), this.cachedContent = n.cachedContent;
  }
  /**
   * Makes a single non-streaming call to the model
   * and returns an object containing a single {@link GenerateContentResponse}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContent(t, n = {}) {
    var o;
    const s = ne(t), i = Object.assign(Object.assign({}, this._requestOptions), n);
    return Ee(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (o = this.cachedContent) === null || o === void 0 ? void 0 : o.name }, s), i);
  }
  /**
   * Makes a single streaming call to the model and returns an object
   * containing an iterable stream that iterates over all chunks in the
   * streaming response as well as a promise that returns the final
   * aggregated response.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContentStream(t, n = {}) {
    var o;
    const s = ne(t), i = Object.assign(Object.assign({}, this._requestOptions), n);
    return fe(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (o = this.cachedContent) === null || o === void 0 ? void 0 : o.name }, s), i);
  }
  /**
   * Gets a new {@link ChatSession} instance which can be used for
   * multi-turn chats.
   */
  startChat(t) {
    var n;
    return new Ze(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (n = this.cachedContent) === null || n === void 0 ? void 0 : n.name }, t), this._requestOptions);
  }
  /**
   * Counts the tokens in the provided request.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async countTokens(t, n = {}) {
    const o = We(t, {
      model: this.model,
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings,
      tools: this.tools,
      toolConfig: this.toolConfig,
      systemInstruction: this.systemInstruction,
      cachedContent: this.cachedContent
    }), s = Object.assign(Object.assign({}, this._requestOptions), n);
    return et(this.apiKey, this.model, o, s);
  }
  /**
   * Embeds the provided content.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async embedContent(t, n = {}) {
    const o = Je(t), s = Object.assign(Object.assign({}, this._requestOptions), n);
    return tt(this.apiKey, this.model, o, s);
  }
  /**
   * Embeds an array of {@link EmbedContentRequest}s.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async batchEmbedContents(t, n = {}) {
    const o = Object.assign(Object.assign({}, this._requestOptions), n);
    return nt(this.apiKey, this.model, t, o);
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ot {
  constructor(t) {
    this.apiKey = t;
  }
  /**
   * Gets a {@link GenerativeModel} instance for the provided model name.
   */
  getGenerativeModel(t, n) {
    if (!t.model)
      throw new C("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");
    return new ae(this.apiKey, t, n);
  }
  /**
   * Creates a {@link GenerativeModel} instance from provided content cache.
   */
  getGenerativeModelFromCachedContent(t, n, o) {
    if (!t.name)
      throw new _("Cached content must contain a `name` field.");
    if (!t.model)
      throw new _("Cached content must contain a `model` field.");
    const s = ["model", "systemInstruction"];
    for (const a of s)
      if (n?.[a] && t[a] && n?.[a] !== t[a]) {
        if (a === "model") {
          const r = n.model.startsWith("models/") ? n.model.replace("models/", "") : n.model, c = t.model.startsWith("models/") ? t.model.replace("models/", "") : t.model;
          if (r === c)
            continue;
        }
        throw new _(`Different value for "${a}" specified in modelParams (${n[a]}) and cachedContent (${t[a]})`);
      }
    const i = Object.assign(Object.assign({}, n), { model: t.model, tools: t.tools, toolConfig: t.toolConfig, systemInstruction: t.systemInstruction, cachedContent: t });
    return new ae(this.apiKey, i, o);
  }
}
const m = {
  SENTINEL_JEST_TS: {
    id: "sentinel-jest-ts-v1",
    archetype: "Sentinel",
    specializations: ["Jest", "TypeScript", "Unit Testing"],
    costPerToken: 1e-4,
    costPerSecond: 0.05
  },
  ALCHEMIST_TS_REFACTOR: {
    id: "alchemist-ts-refactor-v1",
    archetype: "Alchemist",
    specializations: ["TypeScript", "Code Refactoring", "Best Practices"],
    costPerToken: 15e-5,
    costPerSecond: 0.07
  },
  SCOUT_NPM_VULNERABILITY: {
    id: "scout-npm-vuln-v1",
    archetype: "Scout",
    specializations: ["NPM", "Dependency Analysis", "Security"],
    costPerToken: 8e-5,
    costPerSecond: 0.04
  },
  GENERIC_GEMINI_V1: {
    id: "generic-gemini-v1",
    archetype: "Alchemist",
    specializations: [
      "AI Code Generation",
      "Google Gemini API",
      "Natural Language Processing",
      "Intelligent Code Synthesis"
    ],
    costPerToken: 15e-5,
    costPerSecond: 0.08
  }
};
function st(e) {
  const t = e.toLowerCase();
  return t.includes("test") || t.includes("validate") || t.includes("verify") ? "TEST" : t.includes("refactor") || t.includes("clean") || t.includes("improve") || t.includes("optimize") ? "REFACTOR" : t.includes("research") || t.includes("find") || t.includes("look up") || t.includes("is there a better") ? "RESEARCH" : t.includes("debug") || t.includes("fix") || t.includes("solve") || t.includes("error") ? "DEBUG" : t.includes("document") || t.includes("comment") || t.includes("explain") ? "DOCUMENT" : "CREATE";
}
class it {
  docker;
  agentCredibilityLedger;
  personalEnclave;
  constructor() {
    this.docker = new Se(), this.agentCredibilityLedger = /* @__PURE__ */ new Map(), this.personalEnclave = {
      indentation: "unknown",
      quoteStyle: "unknown",
      preferredLibraries: /* @__PURE__ */ new Set()
    };
  }
  /**
   * Task Decomposer - The Strategic Mind
   *
   * Uses Gemini LLM to decompose a high-level user intent into a sequence of smaller,
   * actionable sub-tasks. This enables multi-stage execution plans.
   *
   * @param userIntent - The natural language description of what the user wants
   * @returns Array of sub-task strings. Returns empty array on failure or single-element array for simple tasks.
   */
  async decomposeTask(t) {
    try {
      const n = process.env.GEMINI_API_KEY;
      if (!n || n.trim() === "")
        return console.warn("[NEXUS-CORE] ⚠️  GEMINI_API_KEY not set. Task decomposition disabled. Falling back to simple plan."), [t];
      console.log(`[NEXUS-CORE] Decomposing task with strategic AI: "${t.substring(0, 50)}..."`);
      const s = new ot(n).getGenerativeModel({ model: "gemini-2.0-flash-exp" }), i = `You are an expert software architect. Decompose the following user request into a sequence of smaller, specific, single-action developer tasks. Return ONLY a numbered list. DO NOT add any commentary or introduction. Request: '${t}'`, c = (await (await s.generateContent(i)).response).text();
      console.log(`[NEXUS-CORE] Decomposition response:
${c}`);
      const u = c.split(`
`), g = [];
      for (const f of u) {
        const l = f.trim().match(/^\d+[\.\)\-\:]\s*(.+)$/);
        l && l[1] && g.push(l[1].trim());
      }
      return g.length === 0 ? (console.warn("[NEXUS-CORE] ⚠️  Could not parse sub-tasks from decomposition. Using original intent."), [t]) : (console.log(`[NEXUS-CORE] Successfully decomposed into ${g.length} sub-task(s).`), g);
    } catch (n) {
      return console.error(`[NEXUS-CORE] Task decomposition failed: ${n instanceof Error ? n.message : String(n)}`), [t];
    }
  }
  async receiveTask(t, n) {
    console.log(`[NEXUS-CORE] Task ${t.id} received. Creating execution plan...`);
    const o = await this.createExecutionPlan(t);
    console.log(`[NEXUS-CORE] Plan ${o.planId} created (${o.planType}). Dispatching swarm...`);
    const s = await this.dispatchSwarm(o, n);
    return console.log(`[NEXUS-CORE] Swarm finished. Processing receipt ${s.receiptId}...`), this.processReceipt(s), s;
  }
  /**
   * Strategic Genesis Engine - Now with Multi-Stage Intelligence
   *
   * Analyzes the task vector and generates an execution plan.
   * Uses the Task Decomposer to break down complex requests into sequential stages.
   */
  async createExecutionPlan(t) {
    const n = k(), o = await this.decomposeTask(t.naturalLanguageIntent), s = o.length <= 1 ? "simple" : "sequential";
    console.log(`[NEXUS-CORE] Plan type: ${s} (${o.length} sub-task(s))`);
    const i = [];
    let a = 0, r = 0;
    if (s === "simple") {
      let u = m.GENERIC_GEMINI_V1;
      switch (t.parsedIntent.primaryAction) {
        case "TEST":
          u = m.SENTINEL_JEST_TS;
          break;
        case "REFACTOR":
          u = m.ALCHEMIST_TS_REFACTOR;
          break;
        case "RESEARCH":
          u = m.SCOUT_NPM_VULNERABILITY;
          break;
        case "CREATE":
        case "DEBUG":
        case "DOCUMENT":
          u = m.GENERIC_GEMINI_V1;
          break;
        default:
          u = m.GENERIC_GEMINI_V1;
          break;
      }
      const g = this.applyStyleGuidance(t.naturalLanguageIntent);
      i.push([
        {
          agentProfile: u,
          taskChunk: g
        }
      ]), a = u.costPerSecond * 30, r = 30;
    } else
      for (const u of o) {
        const g = st(u);
        let f = m.GENERIC_GEMINI_V1;
        switch (g) {
          case "TEST":
            f = m.SENTINEL_JEST_TS;
            break;
          case "REFACTOR":
            f = m.ALCHEMIST_TS_REFACTOR;
            break;
          case "RESEARCH":
            f = m.SCOUT_NPM_VULNERABILITY;
            break;
          case "CREATE":
          case "DEBUG":
          case "DOCUMENT":
            f = m.GENERIC_GEMINI_V1;
            break;
          default:
            f = m.GENERIC_GEMINI_V1;
            break;
        }
        const d = this.applyStyleGuidance(u);
        i.push([
          {
            agentProfile: f,
            taskChunk: d
          }
        ]), a += f.costPerSecond * 30, r += 30;
      }
    return {
      planId: n,
      taskId: t.id,
      taskVector: t,
      stages: i,
      planType: s,
      estimatedBudget: a,
      estimatedTimeSeconds: r
    };
  }
  /**
   * Sequential Swarm Dispatcher - Multi-Stage Execution Engine
   *
   * Executes each stage of the plan in sequence, accumulating results.
   * Only proceeds to next stage if current stage succeeds.
   */
  async dispatchSwarm(t, n) {
    console.log(`[NEXUS-CORE] Dispatching ${t.planType} swarm for plan ${t.planId} (${t.stages.length} stage(s))...`);
    const o = Date.now(), s = [];
    let i = 0, a = 0;
    try {
      for (const u of t.stages) {
        a++, console.log(`[NEXUS-CORE] Executing stage ${a}/${t.stages.length}...`);
        const g = u[0], f = await this.executeAgent(g, t.taskVector, n);
        if (s.push(f), i += f.cost || 0, !f.wasAccepted) {
          console.error(`[NEXUS-CORE] Stage ${a} failed. Aborting remaining stages.`);
          const d = (Date.now() - o) / 1e3;
          return {
            receiptId: k(),
            planId: t.planId,
            taskId: t.taskId,
            outcome: "FAILED",
            finalCost: i,
            finalTimeSeconds: d,
            results: s,
            failureAnalysis: {
              failedAgentId: f.agentId,
              reason: `Stage ${a} failed`,
              logs: f.output
            }
          };
        }
        console.log(`[NEXUS-CORE] Stage ${a} completed successfully.`);
      }
      const r = (Date.now() - o) / 1e3, c = {
        receiptId: k(),
        planId: t.planId,
        taskId: t.taskId,
        outcome: "COMPLETED",
        finalCost: i,
        finalTimeSeconds: r,
        results: s
      };
      return console.log(`[NEXUS-CORE] All ${t.stages.length} stage(s) completed. Receipt ${c.receiptId} generated.`), c;
    } catch (r) {
      console.error("[NEXUS-CORE] Swarm dispatch failed:", r);
      const c = (Date.now() - o) / 1e3;
      return {
        receiptId: k(),
        planId: t.planId,
        taskId: t.taskId,
        outcome: "FAILED",
        finalCost: i,
        finalTimeSeconds: c,
        results: s,
        failureAnalysis: {
          failedAgentId: s[s.length - 1]?.agentId || "unknown",
          reason: `Swarm execution error: ${r instanceof Error ? r.message : String(r)}`,
          logs: r instanceof Error ? r.stack || "" : String(r)
        }
      };
    }
  }
  /**
   * Execute Single Agent - The Worker Bee
   *
   * Builds, runs, and collects output from a single containerized agent.
   */
  async executeAgent(t, n, o) {
    const s = t.agentProfile, i = t.taskChunk, a = n.constraints.requiredCredibility, r = this.agentCredibilityLedger.get(s.id)?.score ?? 0.5;
    if (r < a)
      throw new Error(`Agent ${s.id} has insufficient credibility (${r.toFixed(2)}) to perform task requiring (${a}).`);
    const c = s.id.toLowerCase().replace(/\s+/g, "-"), u = `synapse-agent-${c}:latest`, f = (await import("path")).join(o, "packages", "agent-foundry", "src", c);
    console.log(`[NEXUS-CORE] Agent: ${s.id}, Docker context: ${f}`);
    const d = Date.now();
    try {
      console.log(`[NEXUS-CORE] Building Docker image: ${u}...`);
      try {
        const A = await this.docker.buildImage({
          context: f,
          src: ["Dockerfile", "agent.ts", "package.json"]
        }, { t: u });
        await new Promise((Ie, Re) => {
          this.docker.modem.followProgress(A, (P, dt) => {
            P ? (console.error("[NEXUS-CORE] Docker build error:", P), Re(P)) : Ie();
          });
        }), console.log("[NEXUS-CORE] Docker image built successfully.");
      } catch (A) {
        throw console.error("[NEXUS-CORE] Failed to build Docker image:", A), new Error(`Docker build failed: ${A instanceof Error ? A.message : String(A)}`);
      }
      console.log(`[NEXUS-CORE] Creating container for ${c}...`);
      const l = process.env.GEMINI_API_KEY || "";
      !l && (c === "generic-llm-agent-v1" || c === "generic-gemini-v1") && console.warn(`[NEXUS-CORE] ⚠️  WARNING: GEMINI_API_KEY not found in environment. Agent ${c} will fail.`);
      const E = await this.docker.createContainer({
        Image: u,
        Cmd: [],
        // Agent entrypoint handles execution
        Env: [
          `TASK_DESCRIPTION=${i}`,
          // Use the specific task chunk for this agent
          `TASK_ID=${n.id}`,
          `GEMINI_API_KEY=${l}`
          // Securely pass API key to container
        ],
        HostConfig: {
          Binds: [`${o}:/project:ro`],
          // Mount project as read-only
          AutoRemove: !1
        }
      });
      console.log("[NEXUS-CORE] Starting container..."), await E.start();
      const I = await E.wait();
      console.log(`[NEXUS-CORE] Container exited with status: ${I.StatusCode}`);
      const F = (await E.logs({
        stdout: !0,
        stderr: !0
      })).toString("utf-8");
      console.log(`[NEXUS-CORE] Agent output:
${F}`), await E.remove(), console.log("[NEXUS-CORE] Container removed.");
      const pe = (Date.now() - d) / 1e3, me = s.costPerSecond * pe;
      return {
        agentId: s.id,
        output: F,
        wasAccepted: I.StatusCode === 0,
        cost: me
      };
    } catch (l) {
      console.error("[NEXUS-CORE] Agent execution failed:", l);
      const E = (Date.now() - d) / 1e3, I = s.costPerSecond * E;
      return {
        agentId: s.id,
        output: `Error: ${l instanceof Error ? l.message : String(l)}`,
        wasAccepted: !1,
        cost: I
      };
    }
  }
  processReceipt(t) {
    const n = t.results[0].agentId;
    let o = this.agentCredibilityLedger.get(n) ?? {
      agentId: n,
      score: 0.5,
      // Default starting score
      history: []
    }, s = 0, i;
    return t.outcome === "COMPLETED" && t.results[0].wasAccepted ? (s = 0.05, i = "SUCCESS", this.observeAndLearn(t.results[0].output)) : t.outcome === "COMPLETED" && !t.results[0].wasAccepted ? (s = -0.1, i = "REJECTED") : (s = -0.1, i = "FAILURE"), o.score = Math.max(0, Math.min(1, o.score + s)), o.history.push({
      taskId: t.taskId,
      outcome: i,
      credibilityChange: s,
      timestamp: Date.now()
    }), this.agentCredibilityLedger.set(n, o), console.log(`[NEXUS-CORE] Credibility for agent ${n} updated to ${o.score.toFixed(2)}`), o;
  }
  observeAndLearn(t) {
    const n = (t.match(/^ +/gm) || []).length, o = (t.match(/^\t+/gm) || []).length;
    n > o ? this.personalEnclave.indentation = "spaces" : o > n && (this.personalEnclave.indentation = "tabs");
    const s = (t.match(/'/g) || []).length, i = (t.match(/"/g) || []).length;
    s > i ? this.personalEnclave.quoteStyle = "single" : i > s && (this.personalEnclave.quoteStyle = "double"), console.log("[NEXUS-CORE] Personal En-gram updated:", this.personalEnclave);
  }
  applyStyleGuidance(t) {
    let n = "Follow this style guidance: ";
    const o = [];
    return this.personalEnclave.indentation !== "unknown" && o.push(`Use ${this.personalEnclave.indentation} for indentation.`), this.personalEnclave.quoteStyle !== "unknown" && o.push(`Use ${this.personalEnclave.quoteStyle} quotes for strings.`), o.length === 0 ? t : `${t}. ${n}${o.join(" ")}`;
  }
}
const at = _e(import.meta.url), w = T.dirname(at), he = T.resolve(w, "../../..");
console.log("[COMMAND DECK] Workspace root:", he);
console.log("[COMMAND DECK] Current directory:", process.cwd());
console.log("[COMMAND DECK] __dirname:", w);
let G, p = null, N = [];
function re() {
  if (p = new le({
    width: 1400,
    height: 900,
    backgroundColor: "#0a0e27",
    webPreferences: {
      preload: T.join(w, "preload.cjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: !1
    },
    title: "Synapse Weaver Nexus - Command Deck",
    icon: T.join(w, "../assets/icon.png"),
    show: !0
    // Show immediately for debugging
  }), p.once("ready-to-show", () => {
    console.log("[COMMAND DECK] Window ready-to-show event fired"), S("TASK_RECEIVED", "Command Deck initialized and ready");
  }), p.webContents.on("render-process-gone", (e, t) => {
    console.error("[COMMAND DECK] Renderer process gone!", t);
  }), p.on("unresponsive", () => {
    console.error("[COMMAND DECK] Window became unresponsive!");
  }), p.webContents.on(
    "console-message",
    (e, t, n, o, s) => {
      console.log(`${t === 0 ? "[RENDERER LOG]" : t === 1 ? "[RENDERER WARN]" : t === 2 ? "[RENDERER ERROR]" : "[RENDERER DEBUG]"} ${n} (${s}:${o})`);
    }
  ), process.env.VITE_DEV_SERVER_URL)
    console.log("[COMMAND DECK] Loading URL:", process.env.VITE_DEV_SERVER_URL), p.loadURL(process.env.VITE_DEV_SERVER_URL), p.webContents.openDevTools();
  else {
    const e = T.join(w, "../dist/index.html");
    console.log("[COMMAND DECK] Loading file:", e), p.loadFile(e);
  }
  p.webContents.on("did-finish-load", () => {
    console.log("[COMMAND DECK] Page finished loading");
  }), p.webContents.on(
    "did-fail-load",
    (e, t, n) => {
      console.error(
        "[COMMAND DECK] Failed to load:",
        t,
        n
      );
    }
  ), p.on("closed", () => {
    p = null;
  });
}
function rt() {
  console.log("[COMMAND DECK] Initializing Nexus Core..."), G = new it(), S("TASK_RECEIVED", "Nexus Core instantiated successfully"), console.log("[COMMAND DECK] Nexus Core online. Personal En-gram active.");
}
function S(e, t, n) {
  const o = {
    timestamp: Date.now(),
    type: e,
    message: t,
    details: n
  };
  N.push(o), N.length > 100 && (N = N.slice(-100)), ct();
}
function Ce() {
  if (!G)
    return {
      personalEnclave: {
        indentation: "unknown",
        quoteStyle: "unknown",
        preferredLibraries: []
      },
      agentCredibilityLedger: {},
      systemEvents: N
    };
  const e = G, t = e.personalEnclave || {
    indentation: "unknown",
    quoteStyle: "unknown",
    preferredLibraries: /* @__PURE__ */ new Set()
  }, n = e.agentCredibilityLedger || /* @__PURE__ */ new Map(), o = {};
  for (const [s, i] of n.entries())
    o[s] = i.score;
  return {
    personalEnclave: {
      indentation: t.indentation,
      quoteStyle: t.quoteStyle,
      preferredLibraries: Array.from(t.preferredLibraries)
    },
    agentCredibilityLedger: o,
    systemEvents: N
  };
}
function ct() {
  if (p && !p.isDestroyed()) {
    const e = Ce();
    p.webContents.send("nexus:state-updated", e);
  }
}
ce.handle("nexus:get-initial-state", async () => (console.log("[COMMAND DECK] Initial state requested"), Ce()));
ce.handle("nexus:submit-task", async (e, t) => {
  console.log(`[COMMAND DECK] Task received: "${t}"`), S("TASK_RECEIVED", `Task submitted: ${t}`, { task: t });
  try {
    const n = {
      id: `task-${Date.now()}`,
      timestamp: Date.now(),
      sourceCode: "",
      // No source code context from Command Deck
      naturalLanguageIntent: t,
      parsedIntent: {
        primaryAction: "CREATE",
        subject: t,
        context: []
      },
      projectContext: {
        projectId: "command-deck",
        filePath: "",
        projectStyleGuide: {}
      },
      constraints: {
        maxBudget: 1e3,
        maxTimeSeconds: 300,
        requiredCredibility: 0.5
      }
    }, o = he;
    console.log("[COMMAND DECK] Using project root for Docker:", o), S("PLAN_CREATED", "Creating execution plan for task...", {
      taskId: n.id
    });
    const s = await G.receiveTask(n, o);
    S(
      "AGENT_DISPATCHED",
      `Execution plan ${s.planId} dispatched`,
      { planId: s.planId, outcome: s.outcome }
    ), S(
      "RECEIPT_PROCESSED",
      `Task ${s.outcome.toLowerCase()}: Cost ${s.finalCost}, Time ${s.finalTimeSeconds}s`,
      { receiptId: s.receiptId, results: s.results }
    ), console.log("[COMMAND DECK] Task successfully processed");
  } catch (n) {
    const o = n instanceof Error ? n.message : String(n), s = n instanceof Error ? n.stack : void 0;
    throw console.error("[COMMAND DECK] Task processing failed:", o), s && console.error("[COMMAND DECK] Error stack:", s), S(
      "RECEIPT_PROCESSED",
      `Task processing failed: ${o}`,
      { task: t, error: n }
    ), n;
  }
});
$.whenReady().then(() => {
  rt(), re(), $.on("activate", () => {
    le.getAllWindows().length === 0 && re();
  });
});
$.on("window-all-closed", () => {
  process.platform !== "darwin" && $.quit();
});
export {
  Ce as getNexusState,
  S as logSystemEvent,
  G as nexusEngine
};
