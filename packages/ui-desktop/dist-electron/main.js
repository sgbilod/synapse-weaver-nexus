import { ipcMain, app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Docker from "dockerode";
import { randomFillSync, randomUUID } from "node:crypto";
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
const native = { randomUUID };
function _v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  return _v4(options);
}
var SchemaType;
(function(SchemaType2) {
  SchemaType2["STRING"] = "string";
  SchemaType2["NUMBER"] = "number";
  SchemaType2["INTEGER"] = "integer";
  SchemaType2["BOOLEAN"] = "boolean";
  SchemaType2["ARRAY"] = "array";
  SchemaType2["OBJECT"] = "object";
})(SchemaType || (SchemaType = {}));
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
var ExecutableCodeLanguage;
(function(ExecutableCodeLanguage2) {
  ExecutableCodeLanguage2["LANGUAGE_UNSPECIFIED"] = "language_unspecified";
  ExecutableCodeLanguage2["PYTHON"] = "python";
})(ExecutableCodeLanguage || (ExecutableCodeLanguage = {}));
var Outcome;
(function(Outcome2) {
  Outcome2["OUTCOME_UNSPECIFIED"] = "outcome_unspecified";
  Outcome2["OUTCOME_OK"] = "outcome_ok";
  Outcome2["OUTCOME_FAILED"] = "outcome_failed";
  Outcome2["OUTCOME_DEADLINE_EXCEEDED"] = "outcome_deadline_exceeded";
})(Outcome || (Outcome = {}));
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
const POSSIBLE_ROLES = ["user", "model", "function", "system"];
var HarmCategory;
(function(HarmCategory2) {
  HarmCategory2["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
  HarmCategory2["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
  HarmCategory2["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
  HarmCategory2["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
  HarmCategory2["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
  HarmCategory2["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
})(HarmCategory || (HarmCategory = {}));
var HarmBlockThreshold;
(function(HarmBlockThreshold2) {
  HarmBlockThreshold2["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
  HarmBlockThreshold2["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
  HarmBlockThreshold2["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
  HarmBlockThreshold2["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
  HarmBlockThreshold2["BLOCK_NONE"] = "BLOCK_NONE";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
var HarmProbability;
(function(HarmProbability2) {
  HarmProbability2["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
  HarmProbability2["NEGLIGIBLE"] = "NEGLIGIBLE";
  HarmProbability2["LOW"] = "LOW";
  HarmProbability2["MEDIUM"] = "MEDIUM";
  HarmProbability2["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
var BlockReason;
(function(BlockReason2) {
  BlockReason2["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
  BlockReason2["SAFETY"] = "SAFETY";
  BlockReason2["OTHER"] = "OTHER";
})(BlockReason || (BlockReason = {}));
var FinishReason;
(function(FinishReason2) {
  FinishReason2["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
  FinishReason2["STOP"] = "STOP";
  FinishReason2["MAX_TOKENS"] = "MAX_TOKENS";
  FinishReason2["SAFETY"] = "SAFETY";
  FinishReason2["RECITATION"] = "RECITATION";
  FinishReason2["LANGUAGE"] = "LANGUAGE";
  FinishReason2["BLOCKLIST"] = "BLOCKLIST";
  FinishReason2["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
  FinishReason2["SPII"] = "SPII";
  FinishReason2["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
  FinishReason2["OTHER"] = "OTHER";
})(FinishReason || (FinishReason = {}));
var TaskType;
(function(TaskType2) {
  TaskType2["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
  TaskType2["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
  TaskType2["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
  TaskType2["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
  TaskType2["CLASSIFICATION"] = "CLASSIFICATION";
  TaskType2["CLUSTERING"] = "CLUSTERING";
})(TaskType || (TaskType = {}));
var FunctionCallingMode;
(function(FunctionCallingMode2) {
  FunctionCallingMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
  FunctionCallingMode2["AUTO"] = "AUTO";
  FunctionCallingMode2["ANY"] = "ANY";
  FunctionCallingMode2["NONE"] = "NONE";
})(FunctionCallingMode || (FunctionCallingMode = {}));
var DynamicRetrievalMode;
(function(DynamicRetrievalMode2) {
  DynamicRetrievalMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
  DynamicRetrievalMode2["MODE_DYNAMIC"] = "MODE_DYNAMIC";
})(DynamicRetrievalMode || (DynamicRetrievalMode = {}));
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
class GoogleGenerativeAIError extends Error {
  constructor(message) {
    super(`[GoogleGenerativeAI Error]: ${message}`);
  }
}
class GoogleGenerativeAIResponseError extends GoogleGenerativeAIError {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}
class GoogleGenerativeAIFetchError extends GoogleGenerativeAIError {
  constructor(message, status, statusText, errorDetails) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.errorDetails = errorDetails;
  }
}
class GoogleGenerativeAIRequestInputError extends GoogleGenerativeAIError {
}
class GoogleGenerativeAIAbortError extends GoogleGenerativeAIError {
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
const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
const DEFAULT_API_VERSION = "v1beta";
const PACKAGE_VERSION = "0.24.1";
const PACKAGE_LOG_HEADER = "genai-js";
var Task;
(function(Task2) {
  Task2["GENERATE_CONTENT"] = "generateContent";
  Task2["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
  Task2["COUNT_TOKENS"] = "countTokens";
  Task2["EMBED_CONTENT"] = "embedContent";
  Task2["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
})(Task || (Task = {}));
class RequestUrl {
  constructor(model, task, apiKey, stream, requestOptions) {
    this.model = model;
    this.task = task;
    this.apiKey = apiKey;
    this.stream = stream;
    this.requestOptions = requestOptions;
  }
  toString() {
    var _a, _b;
    const apiVersion = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.apiVersion) || DEFAULT_API_VERSION;
    const baseUrl = ((_b = this.requestOptions) === null || _b === void 0 ? void 0 : _b.baseUrl) || DEFAULT_BASE_URL;
    let url = `${baseUrl}/${apiVersion}/${this.model}:${this.task}`;
    if (this.stream) {
      url += "?alt=sse";
    }
    return url;
  }
}
function getClientHeaders(requestOptions) {
  const clientHeaders = [];
  if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.apiClient) {
    clientHeaders.push(requestOptions.apiClient);
  }
  clientHeaders.push(`${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`);
  return clientHeaders.join(" ");
}
async function getHeaders(url) {
  var _a;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
  headers.append("x-goog-api-key", url.apiKey);
  let customHeaders = (_a = url.requestOptions) === null || _a === void 0 ? void 0 : _a.customHeaders;
  if (customHeaders) {
    if (!(customHeaders instanceof Headers)) {
      try {
        customHeaders = new Headers(customHeaders);
      } catch (e) {
        throw new GoogleGenerativeAIRequestInputError(`unable to convert customHeaders value ${JSON.stringify(customHeaders)} to Headers: ${e.message}`);
      }
    }
    for (const [headerName, headerValue] of customHeaders.entries()) {
      if (headerName === "x-goog-api-key") {
        throw new GoogleGenerativeAIRequestInputError(`Cannot set reserved header name ${headerName}`);
      } else if (headerName === "x-goog-api-client") {
        throw new GoogleGenerativeAIRequestInputError(`Header name ${headerName} can only be set using the apiClient field`);
      }
      headers.append(headerName, headerValue);
    }
  }
  return headers;
}
async function constructModelRequest(model, task, apiKey, stream, body, requestOptions) {
  const url = new RequestUrl(model, task, apiKey, stream, requestOptions);
  return {
    url: url.toString(),
    fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), { method: "POST", headers: await getHeaders(url), body })
  };
}
async function makeModelRequest(model, task, apiKey, stream, body, requestOptions = {}, fetchFn = fetch) {
  const { url, fetchOptions } = await constructModelRequest(model, task, apiKey, stream, body, requestOptions);
  return makeRequest(url, fetchOptions, fetchFn);
}
async function makeRequest(url, fetchOptions, fetchFn = fetch) {
  let response;
  try {
    response = await fetchFn(url, fetchOptions);
  } catch (e) {
    handleResponseError(e, url);
  }
  if (!response.ok) {
    await handleResponseNotOk(response, url);
  }
  return response;
}
function handleResponseError(e, url) {
  let err = e;
  if (err.name === "AbortError") {
    err = new GoogleGenerativeAIAbortError(`Request aborted when fetching ${url.toString()}: ${e.message}`);
    err.stack = e.stack;
  } else if (!(e instanceof GoogleGenerativeAIFetchError || e instanceof GoogleGenerativeAIRequestInputError)) {
    err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
    err.stack = e.stack;
  }
  throw err;
}
async function handleResponseNotOk(response, url) {
  let message = "";
  let errorDetails;
  try {
    const json = await response.json();
    message = json.error.message;
    if (json.error.details) {
      message += ` ${JSON.stringify(json.error.details)}`;
      errorDetails = json.error.details;
    }
  } catch (e) {
  }
  throw new GoogleGenerativeAIFetchError(`Error fetching from ${url.toString()}: [${response.status} ${response.statusText}] ${message}`, response.status, response.statusText, errorDetails);
}
function buildFetchOptions(requestOptions) {
  const fetchOptions = {};
  if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== void 0 || (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
    const controller = new AbortController();
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
      setTimeout(() => controller.abort(), requestOptions.timeout);
    }
    if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) {
      requestOptions.signal.addEventListener("abort", () => {
        controller.abort();
      });
    }
    fetchOptions.signal = controller.signal;
  }
  return fetchOptions;
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
function addHelpers(response) {
  response.text = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      return getText(response);
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Text not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return "";
  };
  response.functionCall = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      console.warn(`response.functionCall() is deprecated. Use response.functionCalls() instead.`);
      return getFunctionCalls(response)[0];
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return void 0;
  };
  response.functionCalls = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      return getFunctionCalls(response);
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return void 0;
  };
  return response;
}
function getText(response) {
  var _a, _b, _c, _d;
  const textStrings = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.text) {
        textStrings.push(part.text);
      }
      if (part.executableCode) {
        textStrings.push("\n```" + part.executableCode.language + "\n" + part.executableCode.code + "\n```\n");
      }
      if (part.codeExecutionResult) {
        textStrings.push("\n```\n" + part.codeExecutionResult.output + "\n```\n");
      }
    }
  }
  if (textStrings.length > 0) {
    return textStrings.join("");
  } else {
    return "";
  }
}
function getFunctionCalls(response) {
  var _a, _b, _c, _d;
  const functionCalls = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.functionCall) {
        functionCalls.push(part.functionCall);
      }
    }
  }
  if (functionCalls.length > 0) {
    return functionCalls;
  } else {
    return void 0;
  }
}
const badFinishReasons = [
  FinishReason.RECITATION,
  FinishReason.SAFETY,
  FinishReason.LANGUAGE
];
function hadBadFinishReason(candidate) {
  return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
}
function formatBlockErrorMessage(response) {
  var _a, _b, _c;
  let message = "";
  if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
    message += "Response was blocked";
    if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
      message += ` due to ${response.promptFeedback.blockReason}`;
    }
    if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
      message += `: ${response.promptFeedback.blockReasonMessage}`;
    }
  } else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
    const firstCandidate = response.candidates[0];
    if (hadBadFinishReason(firstCandidate)) {
      message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
      if (firstCandidate.finishMessage) {
        message += `: ${firstCandidate.finishMessage}`;
      }
    }
  }
  return message;
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n]) i[n] = function(v) {
      return new Promise(function(a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
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
const responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
function processStream(response) {
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
  const responseStream = getResponseStream(inputStream);
  const [stream1, stream2] = responseStream.tee();
  return {
    stream: generateResponseSequence(stream1),
    response: getResponsePromise(stream2)
  };
}
async function getResponsePromise(stream) {
  const allResponses = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return addHelpers(aggregateResponses(allResponses));
    }
    allResponses.push(value);
  }
}
function generateResponseSequence(stream) {
  return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
    const reader = stream.getReader();
    while (true) {
      const { value, done } = yield __await(reader.read());
      if (done) {
        break;
      }
      yield yield __await(addHelpers(value));
    }
  });
}
function getResponseStream(inputStream) {
  const reader = inputStream.getReader();
  const stream = new ReadableStream({
    start(controller) {
      let currentText = "";
      return pump();
      function pump() {
        return reader.read().then(({ value, done }) => {
          if (done) {
            if (currentText.trim()) {
              controller.error(new GoogleGenerativeAIError("Failed to parse stream"));
              return;
            }
            controller.close();
            return;
          }
          currentText += value;
          let match = currentText.match(responseLineRE);
          let parsedResponse;
          while (match) {
            try {
              parsedResponse = JSON.parse(match[1]);
            } catch (e) {
              controller.error(new GoogleGenerativeAIError(`Error parsing JSON response: "${match[1]}"`));
              return;
            }
            controller.enqueue(parsedResponse);
            currentText = currentText.substring(match[0].length);
            match = currentText.match(responseLineRE);
          }
          return pump();
        }).catch((e) => {
          let err = e;
          err.stack = e.stack;
          if (err.name === "AbortError") {
            err = new GoogleGenerativeAIAbortError("Request aborted when reading from the stream");
          } else {
            err = new GoogleGenerativeAIError("Error reading from the stream");
          }
          throw err;
        });
      }
    }
  });
  return stream;
}
function aggregateResponses(responses) {
  const lastResponse = responses[responses.length - 1];
  const aggregatedResponse = {
    promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
  };
  for (const response of responses) {
    if (response.candidates) {
      let candidateIndex = 0;
      for (const candidate of response.candidates) {
        if (!aggregatedResponse.candidates) {
          aggregatedResponse.candidates = [];
        }
        if (!aggregatedResponse.candidates[candidateIndex]) {
          aggregatedResponse.candidates[candidateIndex] = {
            index: candidateIndex
          };
        }
        aggregatedResponse.candidates[candidateIndex].citationMetadata = candidate.citationMetadata;
        aggregatedResponse.candidates[candidateIndex].groundingMetadata = candidate.groundingMetadata;
        aggregatedResponse.candidates[candidateIndex].finishReason = candidate.finishReason;
        aggregatedResponse.candidates[candidateIndex].finishMessage = candidate.finishMessage;
        aggregatedResponse.candidates[candidateIndex].safetyRatings = candidate.safetyRatings;
        if (candidate.content && candidate.content.parts) {
          if (!aggregatedResponse.candidates[candidateIndex].content) {
            aggregatedResponse.candidates[candidateIndex].content = {
              role: candidate.content.role || "user",
              parts: []
            };
          }
          const newPart = {};
          for (const part of candidate.content.parts) {
            if (part.text) {
              newPart.text = part.text;
            }
            if (part.functionCall) {
              newPart.functionCall = part.functionCall;
            }
            if (part.executableCode) {
              newPart.executableCode = part.executableCode;
            }
            if (part.codeExecutionResult) {
              newPart.codeExecutionResult = part.codeExecutionResult;
            }
            if (Object.keys(newPart).length === 0) {
              newPart.text = "";
            }
            aggregatedResponse.candidates[candidateIndex].content.parts.push(newPart);
          }
        }
      }
      candidateIndex++;
    }
    if (response.usageMetadata) {
      aggregatedResponse.usageMetadata = response.usageMetadata;
    }
  }
  return aggregatedResponse;
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
async function generateContentStream(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(
    model,
    Task.STREAM_GENERATE_CONTENT,
    apiKey,
    /* stream */
    true,
    JSON.stringify(params),
    requestOptions
  );
  return processStream(response);
}
async function generateContent(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(
    model,
    Task.GENERATE_CONTENT,
    apiKey,
    /* stream */
    false,
    JSON.stringify(params),
    requestOptions
  );
  const responseJson = await response.json();
  const enhancedResponse = addHelpers(responseJson);
  return {
    response: enhancedResponse
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
function formatSystemInstruction(input) {
  if (input == null) {
    return void 0;
  } else if (typeof input === "string") {
    return { role: "system", parts: [{ text: input }] };
  } else if (input.text) {
    return { role: "system", parts: [input] };
  } else if (input.parts) {
    if (!input.role) {
      return { role: "system", parts: input.parts };
    } else {
      return input;
    }
  }
}
function formatNewContent(request) {
  let newParts = [];
  if (typeof request === "string") {
    newParts = [{ text: request }];
  } else {
    for (const partOrString of request) {
      if (typeof partOrString === "string") {
        newParts.push({ text: partOrString });
      } else {
        newParts.push(partOrString);
      }
    }
  }
  return assignRoleToPartsAndValidateSendMessageRequest(newParts);
}
function assignRoleToPartsAndValidateSendMessageRequest(parts) {
  const userContent = { role: "user", parts: [] };
  const functionContent = { role: "function", parts: [] };
  let hasUserContent = false;
  let hasFunctionContent = false;
  for (const part of parts) {
    if ("functionResponse" in part) {
      functionContent.parts.push(part);
      hasFunctionContent = true;
    } else {
      userContent.parts.push(part);
      hasUserContent = true;
    }
  }
  if (hasUserContent && hasFunctionContent) {
    throw new GoogleGenerativeAIError("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
  }
  if (!hasUserContent && !hasFunctionContent) {
    throw new GoogleGenerativeAIError("No content is provided for sending chat message.");
  }
  if (hasUserContent) {
    return userContent;
  }
  return functionContent;
}
function formatCountTokensInput(params, modelParams) {
  var _a;
  let formattedGenerateContentRequest = {
    model: modelParams === null || modelParams === void 0 ? void 0 : modelParams.model,
    generationConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.generationConfig,
    safetySettings: modelParams === null || modelParams === void 0 ? void 0 : modelParams.safetySettings,
    tools: modelParams === null || modelParams === void 0 ? void 0 : modelParams.tools,
    toolConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.toolConfig,
    systemInstruction: modelParams === null || modelParams === void 0 ? void 0 : modelParams.systemInstruction,
    cachedContent: (_a = modelParams === null || modelParams === void 0 ? void 0 : modelParams.cachedContent) === null || _a === void 0 ? void 0 : _a.name,
    contents: []
  };
  const containsGenerateContentRequest = params.generateContentRequest != null;
  if (params.contents) {
    if (containsGenerateContentRequest) {
      throw new GoogleGenerativeAIRequestInputError("CountTokensRequest must have one of contents or generateContentRequest, not both.");
    }
    formattedGenerateContentRequest.contents = params.contents;
  } else if (containsGenerateContentRequest) {
    formattedGenerateContentRequest = Object.assign(Object.assign({}, formattedGenerateContentRequest), params.generateContentRequest);
  } else {
    const content = formatNewContent(params);
    formattedGenerateContentRequest.contents = [content];
  }
  return { generateContentRequest: formattedGenerateContentRequest };
}
function formatGenerateContentInput(params) {
  let formattedRequest;
  if (params.contents) {
    formattedRequest = params;
  } else {
    const content = formatNewContent(params);
    formattedRequest = { contents: [content] };
  }
  if (params.systemInstruction) {
    formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
  }
  return formattedRequest;
}
function formatEmbedContentInput(params) {
  if (typeof params === "string" || Array.isArray(params)) {
    const content = formatNewContent(params);
    return { content };
  }
  return params;
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
const VALID_PART_FIELDS = [
  "text",
  "inlineData",
  "functionCall",
  "functionResponse",
  "executableCode",
  "codeExecutionResult"
];
const VALID_PARTS_PER_ROLE = {
  user: ["text", "inlineData"],
  function: ["functionResponse"],
  model: ["text", "functionCall", "executableCode", "codeExecutionResult"],
  // System instructions shouldn't be in history anyway.
  system: ["text"]
};
function validateChatHistory(history) {
  let prevContent = false;
  for (const currContent of history) {
    const { role, parts } = currContent;
    if (!prevContent && role !== "user") {
      throw new GoogleGenerativeAIError(`First content should be with role 'user', got ${role}`);
    }
    if (!POSSIBLE_ROLES.includes(role)) {
      throw new GoogleGenerativeAIError(`Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
    }
    if (!Array.isArray(parts)) {
      throw new GoogleGenerativeAIError("Content should have 'parts' property with an array of Parts");
    }
    if (parts.length === 0) {
      throw new GoogleGenerativeAIError("Each Content should have at least one part");
    }
    const countFields = {
      text: 0,
      inlineData: 0,
      functionCall: 0,
      functionResponse: 0,
      fileData: 0,
      executableCode: 0,
      codeExecutionResult: 0
    };
    for (const part of parts) {
      for (const key of VALID_PART_FIELDS) {
        if (key in part) {
          countFields[key] += 1;
        }
      }
    }
    const validParts = VALID_PARTS_PER_ROLE[role];
    for (const key of VALID_PART_FIELDS) {
      if (!validParts.includes(key) && countFields[key] > 0) {
        throw new GoogleGenerativeAIError(`Content with role '${role}' can't contain '${key}' part`);
      }
    }
    prevContent = true;
  }
}
function isValidResponse(response) {
  var _a;
  if (response.candidates === void 0 || response.candidates.length === 0) {
    return false;
  }
  const content = (_a = response.candidates[0]) === null || _a === void 0 ? void 0 : _a.content;
  if (content === void 0) {
    return false;
  }
  if (content.parts === void 0 || content.parts.length === 0) {
    return false;
  }
  for (const part of content.parts) {
    if (part === void 0 || Object.keys(part).length === 0) {
      return false;
    }
    if (part.text !== void 0 && part.text === "") {
      return false;
    }
  }
  return true;
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
const SILENT_ERROR = "SILENT_ERROR";
class ChatSession {
  constructor(apiKey, model, params, _requestOptions = {}) {
    this.model = model;
    this.params = params;
    this._requestOptions = _requestOptions;
    this._history = [];
    this._sendPromise = Promise.resolve();
    this._apiKey = apiKey;
    if (params === null || params === void 0 ? void 0 : params.history) {
      validateChatHistory(params.history);
      this._history = params.history;
    }
  }
  /**
   * Gets the chat history so far. Blocked prompts are not added to history.
   * Blocked candidates are not added to history, nor are the prompts that
   * generated them.
   */
  async getHistory() {
    await this._sendPromise;
    return this._history;
  }
  /**
   * Sends a chat message and receives a non-streaming
   * {@link GenerateContentResult}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessage(request, requestOptions = {}) {
    var _a, _b, _c, _d, _e, _f;
    await this._sendPromise;
    const newContent = formatNewContent(request);
    const generateContentRequest = {
      safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
      generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
      tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
      toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
      systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
      cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
      contents: [...this._history, newContent]
    };
    const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    let finalResult;
    this._sendPromise = this._sendPromise.then(() => generateContent(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions)).then((result) => {
      var _a2;
      if (isValidResponse(result.response)) {
        this._history.push(newContent);
        const responseContent = Object.assign({
          parts: [],
          // Response seems to come back without a role set.
          role: "model"
        }, (_a2 = result.response.candidates) === null || _a2 === void 0 ? void 0 : _a2[0].content);
        this._history.push(responseContent);
      } else {
        const blockErrorMessage = formatBlockErrorMessage(result.response);
        if (blockErrorMessage) {
          console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
        }
      }
      finalResult = result;
    }).catch((e) => {
      this._sendPromise = Promise.resolve();
      throw e;
    });
    await this._sendPromise;
    return finalResult;
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
  async sendMessageStream(request, requestOptions = {}) {
    var _a, _b, _c, _d, _e, _f;
    await this._sendPromise;
    const newContent = formatNewContent(request);
    const generateContentRequest = {
      safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
      generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
      tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
      toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
      systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
      cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
      contents: [...this._history, newContent]
    };
    const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    const streamPromise = generateContentStream(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions);
    this._sendPromise = this._sendPromise.then(() => streamPromise).catch((_ignored) => {
      throw new Error(SILENT_ERROR);
    }).then((streamResult) => streamResult.response).then((response) => {
      if (isValidResponse(response)) {
        this._history.push(newContent);
        const responseContent = Object.assign({}, response.candidates[0].content);
        if (!responseContent.role) {
          responseContent.role = "model";
        }
        this._history.push(responseContent);
      } else {
        const blockErrorMessage = formatBlockErrorMessage(response);
        if (blockErrorMessage) {
          console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
        }
      }
    }).catch((e) => {
      if (e.message !== SILENT_ERROR) {
        console.error(e);
      }
    });
    return streamPromise;
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
async function countTokens(apiKey, model, params, singleRequestOptions) {
  const response = await makeModelRequest(model, Task.COUNT_TOKENS, apiKey, false, JSON.stringify(params), singleRequestOptions);
  return response.json();
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
async function embedContent(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(model, Task.EMBED_CONTENT, apiKey, false, JSON.stringify(params), requestOptions);
  return response.json();
}
async function batchEmbedContents(apiKey, model, params, requestOptions) {
  const requestsWithModel = params.requests.map((request) => {
    return Object.assign(Object.assign({}, request), { model });
  });
  const response = await makeModelRequest(model, Task.BATCH_EMBED_CONTENTS, apiKey, false, JSON.stringify({ requests: requestsWithModel }), requestOptions);
  return response.json();
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
class GenerativeModel {
  constructor(apiKey, modelParams, _requestOptions = {}) {
    this.apiKey = apiKey;
    this._requestOptions = _requestOptions;
    if (modelParams.model.includes("/")) {
      this.model = modelParams.model;
    } else {
      this.model = `models/${modelParams.model}`;
    }
    this.generationConfig = modelParams.generationConfig || {};
    this.safetySettings = modelParams.safetySettings || [];
    this.tools = modelParams.tools;
    this.toolConfig = modelParams.toolConfig;
    this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
    this.cachedContent = modelParams.cachedContent;
  }
  /**
   * Makes a single non-streaming call to the model
   * and returns an object containing a single {@link GenerateContentResponse}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContent(request, requestOptions = {}) {
    var _a;
    const formattedParams = formatGenerateContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return generateContent(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
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
  async generateContentStream(request, requestOptions = {}) {
    var _a;
    const formattedParams = formatGenerateContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return generateContentStream(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
  }
  /**
   * Gets a new {@link ChatSession} instance which can be used for
   * multi-turn chats.
   */
  startChat(startChatParams) {
    var _a;
    return new ChatSession(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, startChatParams), this._requestOptions);
  }
  /**
   * Counts the tokens in the provided request.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async countTokens(request, requestOptions = {}) {
    const formattedParams = formatCountTokensInput(request, {
      model: this.model,
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings,
      tools: this.tools,
      toolConfig: this.toolConfig,
      systemInstruction: this.systemInstruction,
      cachedContent: this.cachedContent
    });
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return countTokens(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
  }
  /**
   * Embeds the provided content.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async embedContent(request, requestOptions = {}) {
    const formattedParams = formatEmbedContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return embedContent(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
  }
  /**
   * Embeds an array of {@link EmbedContentRequest}s.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async batchEmbedContents(batchEmbedContentRequest, requestOptions = {}) {
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return batchEmbedContents(this.apiKey, this.model, batchEmbedContentRequest, generativeModelRequestOptions);
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
class GoogleGenerativeAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  /**
   * Gets a {@link GenerativeModel} instance for the provided model name.
   */
  getGenerativeModel(modelParams, requestOptions) {
    if (!modelParams.model) {
      throw new GoogleGenerativeAIError(`Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })`);
    }
    return new GenerativeModel(this.apiKey, modelParams, requestOptions);
  }
  /**
   * Creates a {@link GenerativeModel} instance from provided content cache.
   */
  getGenerativeModelFromCachedContent(cachedContent, modelParams, requestOptions) {
    if (!cachedContent.name) {
      throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `name` field.");
    }
    if (!cachedContent.model) {
      throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `model` field.");
    }
    const disallowedDuplicates = ["model", "systemInstruction"];
    for (const key of disallowedDuplicates) {
      if ((modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) && cachedContent[key] && (modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) !== cachedContent[key]) {
        if (key === "model") {
          const modelParamsComp = modelParams.model.startsWith("models/") ? modelParams.model.replace("models/", "") : modelParams.model;
          const cachedContentComp = cachedContent.model.startsWith("models/") ? cachedContent.model.replace("models/", "") : cachedContent.model;
          if (modelParamsComp === cachedContentComp) {
            continue;
          }
        }
        throw new GoogleGenerativeAIRequestInputError(`Different value for "${key}" specified in modelParams (${modelParams[key]}) and cachedContent (${cachedContent[key]})`);
      }
    }
    const modelParamsFromCache = Object.assign(Object.assign({}, modelParams), { model: cachedContent.model, tools: cachedContent.tools, toolConfig: cachedContent.toolConfig, systemInstruction: cachedContent.systemInstruction, cachedContent });
    return new GenerativeModel(this.apiKey, modelParamsFromCache, requestOptions);
  }
}
const AGENT_PROFILES = {
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
function parseIntentLocal(intent) {
  const lower = intent.toLowerCase();
  if (lower.includes("test") || lower.includes("validate") || lower.includes("verify")) {
    return "TEST";
  } else if (lower.includes("refactor") || lower.includes("clean") || lower.includes("improve") || lower.includes("optimize")) {
    return "REFACTOR";
  } else if (lower.includes("research") || lower.includes("find") || lower.includes("look up") || lower.includes("is there a better")) {
    return "RESEARCH";
  } else if (lower.includes("debug") || lower.includes("fix") || lower.includes("solve") || lower.includes("error")) {
    return "DEBUG";
  } else if (lower.includes("document") || lower.includes("comment") || lower.includes("explain")) {
    return "DOCUMENT";
  }
  return "CREATE";
}
class OrchestrationEngine {
  docker;
  agentCredibilityLedger;
  personalEnclave;
  constructor() {
    this.docker = new Docker();
    this.agentCredibilityLedger = /* @__PURE__ */ new Map();
    this.personalEnclave = {
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
  async decomposeTask(userIntent) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === "") {
        console.warn("[NEXUS-CORE] ⚠️  GEMINI_API_KEY not set. Task decomposition disabled. Falling back to simple plan.");
        return [userIntent];
      }
      console.log(`[NEXUS-CORE] Decomposing task with strategic AI: "${userIntent.substring(0, 50)}..."`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const metaPrompt = `You are an expert software architect. Decompose the following user request into a sequence of smaller, specific, single-action developer tasks. Return ONLY a numbered list. DO NOT add any commentary or introduction. Request: '${userIntent}'`;
      const result = await model.generateContent(metaPrompt);
      const response = await result.response;
      const decompositionText = response.text();
      console.log(`[NEXUS-CORE] Decomposition response:
${decompositionText}`);
      const lines = decompositionText.split("\n");
      const subTasks = [];
      for (const line of lines) {
        const trimmed = line.trim();
        const match = trimmed.match(/^\d+[\.\)\-\:]\s*(.+)$/);
        if (match && match[1]) {
          subTasks.push(match[1].trim());
        }
      }
      if (subTasks.length === 0) {
        console.warn("[NEXUS-CORE] ⚠️  Could not parse sub-tasks from decomposition. Using original intent.");
        return [userIntent];
      }
      console.log(`[NEXUS-CORE] Successfully decomposed into ${subTasks.length} sub-task(s).`);
      return subTasks;
    } catch (error) {
      console.error(`[NEXUS-CORE] Task decomposition failed: ${error instanceof Error ? error.message : String(error)}`);
      return [userIntent];
    }
  }
  async receiveTask(vector, projectRootPath) {
    console.log(`[NEXUS-CORE] Task ${vector.id} received. Creating execution plan...`);
    const plan = await this.createExecutionPlan(vector);
    console.log(`[NEXUS-CORE] Plan ${plan.planId} created (${plan.planType}). Dispatching swarm...`);
    const receipt = await this.dispatchSwarm(plan, projectRootPath);
    console.log(`[NEXUS-CORE] Swarm finished. Processing receipt ${receipt.receiptId}...`);
    this.processReceipt(receipt);
    return receipt;
  }
  /**
   * Strategic Genesis Engine - Now with Multi-Stage Intelligence
   *
   * Analyzes the task vector and generates an execution plan.
   * Uses the Task Decomposer to break down complex requests into sequential stages.
   */
  async createExecutionPlan(vector) {
    const planId = v4();
    const subTasks = await this.decomposeTask(vector.naturalLanguageIntent);
    const planType = subTasks.length <= 1 ? "simple" : "sequential";
    console.log(`[NEXUS-CORE] Plan type: ${planType} (${subTasks.length} sub-task(s))`);
    const stages = [];
    let totalEstimatedBudget = 0;
    let totalEstimatedTime = 0;
    if (planType === "simple") {
      let selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
      switch (vector.parsedIntent.primaryAction) {
        case "TEST":
          selectedAgentProfile = AGENT_PROFILES.SENTINEL_JEST_TS;
          break;
        case "REFACTOR":
          selectedAgentProfile = AGENT_PROFILES.ALCHEMIST_TS_REFACTOR;
          break;
        case "RESEARCH":
          selectedAgentProfile = AGENT_PROFILES.SCOUT_NPM_VULNERABILITY;
          break;
        case "CREATE":
        case "DEBUG":
        case "DOCUMENT":
          selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
          break;
        default:
          selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
          break;
      }
      const styleAwareIntent = this.applyStyleGuidance(vector.naturalLanguageIntent);
      stages.push([
        {
          agentProfile: selectedAgentProfile,
          taskChunk: styleAwareIntent
        }
      ]);
      totalEstimatedBudget = selectedAgentProfile.costPerSecond * 30;
      totalEstimatedTime = 30;
    } else {
      for (const subTask of subTasks) {
        const subTaskAction = parseIntentLocal(subTask);
        let selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
        switch (subTaskAction) {
          case "TEST":
            selectedAgentProfile = AGENT_PROFILES.SENTINEL_JEST_TS;
            break;
          case "REFACTOR":
            selectedAgentProfile = AGENT_PROFILES.ALCHEMIST_TS_REFACTOR;
            break;
          case "RESEARCH":
            selectedAgentProfile = AGENT_PROFILES.SCOUT_NPM_VULNERABILITY;
            break;
          case "CREATE":
          case "DEBUG":
          case "DOCUMENT":
            selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
            break;
          default:
            selectedAgentProfile = AGENT_PROFILES.GENERIC_GEMINI_V1;
            break;
        }
        const styleAwareSubTask = this.applyStyleGuidance(subTask);
        stages.push([
          {
            agentProfile: selectedAgentProfile,
            taskChunk: styleAwareSubTask
          }
        ]);
        totalEstimatedBudget += selectedAgentProfile.costPerSecond * 30;
        totalEstimatedTime += 30;
      }
    }
    const plan = {
      planId,
      taskId: vector.id,
      taskVector: vector,
      stages,
      planType,
      estimatedBudget: totalEstimatedBudget,
      estimatedTimeSeconds: totalEstimatedTime
    };
    return plan;
  }
  /**
   * Sequential Swarm Dispatcher - Multi-Stage Execution Engine
   *
   * Executes each stage of the plan in sequence, accumulating results.
   * Only proceeds to next stage if current stage succeeds.
   */
  async dispatchSwarm(plan, projectRootPath) {
    console.log(`[NEXUS-CORE] Dispatching ${plan.planType} swarm for plan ${plan.planId} (${plan.stages.length} stage(s))...`);
    const overallStartTime = Date.now();
    const allResults = [];
    let totalCost = 0;
    let currentStageIndex = 0;
    try {
      for (const stage of plan.stages) {
        currentStageIndex++;
        console.log(`[NEXUS-CORE] Executing stage ${currentStageIndex}/${plan.stages.length}...`);
        const agent = stage[0];
        const stageResult = await this.executeAgent(agent, plan.taskVector, projectRootPath);
        allResults.push(stageResult);
        totalCost += stageResult.cost || 0;
        if (!stageResult.wasAccepted) {
          console.error(`[NEXUS-CORE] Stage ${currentStageIndex} failed. Aborting remaining stages.`);
          const finalTimeSeconds2 = (Date.now() - overallStartTime) / 1e3;
          return {
            receiptId: v4(),
            planId: plan.planId,
            taskId: plan.taskId,
            outcome: "FAILED",
            finalCost: totalCost,
            finalTimeSeconds: finalTimeSeconds2,
            results: allResults,
            failureAnalysis: {
              failedAgentId: stageResult.agentId,
              reason: `Stage ${currentStageIndex} failed`,
              logs: stageResult.output
            }
          };
        }
        console.log(`[NEXUS-CORE] Stage ${currentStageIndex} completed successfully.`);
      }
      const finalTimeSeconds = (Date.now() - overallStartTime) / 1e3;
      const receipt = {
        receiptId: v4(),
        planId: plan.planId,
        taskId: plan.taskId,
        outcome: "COMPLETED",
        finalCost: totalCost,
        finalTimeSeconds,
        results: allResults
      };
      console.log(`[NEXUS-CORE] All ${plan.stages.length} stage(s) completed. Receipt ${receipt.receiptId} generated.`);
      return receipt;
    } catch (error) {
      console.error(`[NEXUS-CORE] Swarm dispatch failed:`, error);
      const finalTimeSeconds = (Date.now() - overallStartTime) / 1e3;
      return {
        receiptId: v4(),
        planId: plan.planId,
        taskId: plan.taskId,
        outcome: "FAILED",
        finalCost: totalCost,
        finalTimeSeconds,
        results: allResults,
        failureAnalysis: {
          failedAgentId: allResults[allResults.length - 1]?.agentId || "unknown",
          reason: `Swarm execution error: ${error instanceof Error ? error.message : String(error)}`,
          logs: error instanceof Error ? error.stack || "" : String(error)
        }
      };
    }
  }
  /**
   * Execute Single Agent - The Worker Bee
   *
   * Builds, runs, and collects output from a single containerized agent.
   */
  async executeAgent(agent, taskVector, projectRootPath) {
    const agentProfile = agent.agentProfile;
    const taskChunk = agent.taskChunk;
    const requiredCredibility = taskVector.constraints.requiredCredibility;
    const agentCredibility = this.agentCredibilityLedger.get(agentProfile.id)?.score ?? 0.5;
    if (agentCredibility < requiredCredibility) {
      throw new Error(`Agent ${agentProfile.id} has insufficient credibility (${agentCredibility.toFixed(2)}) to perform task requiring (${requiredCredibility}).`);
    }
    const agentName = agentProfile.id.toLowerCase().replace(/\s+/g, "-");
    const imageName = `synapse-agent-${agentName}:latest`;
    const path2 = await import("path");
    const dockerfilePath = path2.join(projectRootPath, "packages", "agent-foundry", "src", agentName);
    console.log(`[NEXUS-CORE] Agent: ${agentProfile.id}, Docker context: ${dockerfilePath}`);
    const startTime = Date.now();
    try {
      console.log(`[NEXUS-CORE] Building Docker image: ${imageName}...`);
      try {
        const buildStream = await this.docker.buildImage({
          context: dockerfilePath,
          src: ["Dockerfile", "agent.ts", "package.json"]
        }, { t: imageName });
        await new Promise((resolve, reject) => {
          this.docker.modem.followProgress(buildStream, (err, _res) => {
            if (err) {
              console.error(`[NEXUS-CORE] Docker build error:`, err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
        console.log(`[NEXUS-CORE] Docker image built successfully.`);
      } catch (buildError) {
        console.error(`[NEXUS-CORE] Failed to build Docker image:`, buildError);
        throw new Error(`Docker build failed: ${buildError instanceof Error ? buildError.message : String(buildError)}`);
      }
      console.log(`[NEXUS-CORE] Creating container for ${agentName}...`);
      const geminiApiKey = process.env.GEMINI_API_KEY || "";
      if (!geminiApiKey && (agentName === "generic-llm-agent-v1" || agentName === "generic-gemini-v1")) {
        console.warn(`[NEXUS-CORE] ⚠️  WARNING: GEMINI_API_KEY not found in environment. Agent ${agentName} will fail.`);
      }
      const container = await this.docker.createContainer({
        Image: imageName,
        Cmd: [],
        // Agent entrypoint handles execution
        Env: [
          `TASK_DESCRIPTION=${taskChunk}`,
          // Use the specific task chunk for this agent
          `TASK_ID=${taskVector.id}`,
          `GEMINI_API_KEY=${geminiApiKey}`
          // Securely pass API key to container
        ],
        HostConfig: {
          Binds: [`${projectRootPath}:/project:ro`],
          // Mount project as read-only
          AutoRemove: false
        }
      });
      console.log(`[NEXUS-CORE] Starting container...`);
      await container.start();
      const result = await container.wait();
      console.log(`[NEXUS-CORE] Container exited with status: ${result.StatusCode}`);
      const logs = await container.logs({
        stdout: true,
        stderr: true
      });
      const logOutput = logs.toString("utf-8");
      console.log(`[NEXUS-CORE] Agent output:
${logOutput}`);
      await container.remove();
      console.log(`[NEXUS-CORE] Container removed.`);
      const finalTimeSeconds = (Date.now() - startTime) / 1e3;
      const cost = agentProfile.costPerSecond * finalTimeSeconds;
      return {
        agentId: agentProfile.id,
        output: logOutput,
        wasAccepted: result.StatusCode === 0,
        cost
      };
    } catch (error) {
      console.error(`[NEXUS-CORE] Agent execution failed:`, error);
      const finalTimeSeconds = (Date.now() - startTime) / 1e3;
      const cost = agentProfile.costPerSecond * finalTimeSeconds;
      return {
        agentId: agentProfile.id,
        output: `Error: ${error instanceof Error ? error.message : String(error)}`,
        wasAccepted: false,
        cost
      };
    }
  }
  processReceipt(receipt) {
    const agentId = receipt.results[0].agentId;
    let credibility = this.agentCredibilityLedger.get(agentId) ?? {
      agentId,
      score: 0.5,
      // Default starting score
      history: []
    };
    let credibilityChange = 0;
    let historyOutcome;
    if (receipt.outcome === "COMPLETED" && receipt.results[0].wasAccepted) {
      credibilityChange = 0.05;
      historyOutcome = "SUCCESS";
      this.observeAndLearn(receipt.results[0].output);
    } else if (receipt.outcome === "COMPLETED" && !receipt.results[0].wasAccepted) {
      credibilityChange = -0.1;
      historyOutcome = "REJECTED";
    } else {
      credibilityChange = -0.1;
      historyOutcome = "FAILURE";
    }
    credibility.score = Math.max(0, Math.min(1, credibility.score + credibilityChange));
    credibility.history.push({
      taskId: receipt.taskId,
      outcome: historyOutcome,
      credibilityChange,
      timestamp: Date.now()
    });
    this.agentCredibilityLedger.set(agentId, credibility);
    console.log(`[NEXUS-CORE] Credibility for agent ${agentId} updated to ${credibility.score.toFixed(2)}`);
    return credibility;
  }
  observeAndLearn(acceptedCode) {
    const spaceIndentations = (acceptedCode.match(/^ +/gm) || []).length;
    const tabIndentations = (acceptedCode.match(/^\t+/gm) || []).length;
    if (spaceIndentations > tabIndentations) {
      this.personalEnclave.indentation = "spaces";
    } else if (tabIndentations > spaceIndentations) {
      this.personalEnclave.indentation = "tabs";
    }
    const singleQuotes = (acceptedCode.match(/'/g) || []).length;
    const doubleQuotes = (acceptedCode.match(/"/g) || []).length;
    if (singleQuotes > doubleQuotes) {
      this.personalEnclave.quoteStyle = "single";
    } else if (doubleQuotes > singleQuotes) {
      this.personalEnclave.quoteStyle = "double";
    }
    console.log("[NEXUS-CORE] Personal En-gram updated:", this.personalEnclave);
  }
  applyStyleGuidance(baseIntent) {
    let guidance = "Follow this style guidance: ";
    const guidanceParts = [];
    if (this.personalEnclave.indentation !== "unknown") {
      guidanceParts.push(`Use ${this.personalEnclave.indentation} for indentation.`);
    }
    if (this.personalEnclave.quoteStyle !== "unknown") {
      guidanceParts.push(`Use ${this.personalEnclave.quoteStyle} quotes for strings.`);
    }
    if (guidanceParts.length === 0) {
      return baseIntent;
    }
    return `${baseIntent}. ${guidance}${guidanceParts.join(" ")}`;
  }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, "../../..");
console.log("[COMMAND DECK] Workspace root:", WORKSPACE_ROOT);
console.log("[COMMAND DECK] Current directory:", process.cwd());
console.log("[COMMAND DECK] __dirname:", __dirname);
let nexusEngine;
let mainWindow = null;
let systemEvents = [];
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#0a0e27",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    title: "Synapse Weaver Nexus - Command Deck",
    icon: path.join(__dirname, "../assets/icon.png"),
    show: true
    // Show immediately for debugging
  });
  mainWindow.once("ready-to-show", () => {
    console.log("[COMMAND DECK] Window ready-to-show event fired");
    logSystemEvent("TASK_RECEIVED", "Command Deck initialized and ready");
  });
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("[COMMAND DECK] Renderer process gone!", details);
  });
  mainWindow.on("unresponsive", () => {
    console.error("[COMMAND DECK] Window became unresponsive!");
  });
  mainWindow.webContents.on(
    "console-message",
    (_event, level, message, line, sourceId) => {
      const prefix = level === 0 ? "[RENDERER LOG]" : level === 1 ? "[RENDERER WARN]" : level === 2 ? "[RENDERER ERROR]" : "[RENDERER DEBUG]";
      console.log(`${prefix} ${message} (${sourceId}:${line})`);
    }
  );
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log("[COMMAND DECK] Loading URL:", process.env.VITE_DEV_SERVER_URL);
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const htmlPath = path.join(__dirname, "../dist/index.html");
    console.log("[COMMAND DECK] Loading file:", htmlPath);
    mainWindow.loadFile(htmlPath);
  }
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("[COMMAND DECK] Page finished loading");
  });
  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription) => {
      console.error(
        "[COMMAND DECK] Failed to load:",
        errorCode,
        errorDescription
      );
    }
  );
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
function initializeNexusCore() {
  console.log("[COMMAND DECK] Initializing Nexus Core...");
  nexusEngine = new OrchestrationEngine();
  logSystemEvent("TASK_RECEIVED", "Nexus Core instantiated successfully");
  console.log("[COMMAND DECK] Nexus Core online. Personal En-gram active.");
}
function logSystemEvent(type, message, details) {
  const event = {
    timestamp: Date.now(),
    type,
    message,
    details
  };
  systemEvents.push(event);
  if (systemEvents.length > 100) {
    systemEvents = systemEvents.slice(-100);
  }
  broadcastStateUpdate();
}
function getNexusState() {
  if (!nexusEngine) {
    return {
      personalEnclave: {
        indentation: "unknown",
        quoteStyle: "unknown",
        preferredLibraries: []
      },
      agentCredibilityLedger: {},
      systemEvents
    };
  }
  const engineAny = nexusEngine;
  const personalEnclave = engineAny.personalEnclave || {
    indentation: "unknown",
    quoteStyle: "unknown",
    preferredLibraries: /* @__PURE__ */ new Set()
  };
  const agentCredibilityLedger = engineAny.agentCredibilityLedger || /* @__PURE__ */ new Map();
  const credibilityScores = {};
  for (const [agentId, credibility] of agentCredibilityLedger.entries()) {
    credibilityScores[agentId] = credibility.score;
  }
  return {
    personalEnclave: {
      indentation: personalEnclave.indentation,
      quoteStyle: personalEnclave.quoteStyle,
      preferredLibraries: Array.from(personalEnclave.preferredLibraries)
    },
    agentCredibilityLedger: credibilityScores,
    systemEvents
  };
}
function broadcastStateUpdate() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const state = getNexusState();
    mainWindow.webContents.send("nexus:state-updated", state);
  }
}
ipcMain.handle("nexus:get-initial-state", async () => {
  console.log("[COMMAND DECK] Initial state requested");
  return getNexusState();
});
ipcMain.handle("nexus:submit-task", async (_event, task) => {
  console.log(`[COMMAND DECK] Task received: "${task}"`);
  logSystemEvent("TASK_RECEIVED", `Task submitted: ${task}`, { task });
  try {
    const taskVector = {
      id: `task-${Date.now()}`,
      timestamp: Date.now(),
      sourceCode: "",
      // No source code context from Command Deck
      naturalLanguageIntent: task,
      parsedIntent: {
        primaryAction: "CREATE",
        subject: task,
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
    };
    const projectRoot = WORKSPACE_ROOT;
    console.log("[COMMAND DECK] Using project root for Docker:", projectRoot);
    logSystemEvent("PLAN_CREATED", `Creating execution plan for task...`, {
      taskId: taskVector.id
    });
    const receipt = await nexusEngine.receiveTask(taskVector, projectRoot);
    logSystemEvent(
      "AGENT_DISPATCHED",
      `Execution plan ${receipt.planId} dispatched`,
      { planId: receipt.planId, outcome: receipt.outcome }
    );
    logSystemEvent(
      "RECEIPT_PROCESSED",
      `Task ${receipt.outcome.toLowerCase()}: Cost ${receipt.finalCost}, Time ${receipt.finalTimeSeconds}s`,
      { receiptId: receipt.receiptId, results: receipt.results }
    );
    console.log("[COMMAND DECK] Task successfully processed");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : void 0;
    console.error("[COMMAND DECK] Task processing failed:", errorMessage);
    if (errorStack) {
      console.error("[COMMAND DECK] Error stack:", errorStack);
    }
    logSystemEvent(
      "RECEIPT_PROCESSED",
      `Task processing failed: ${errorMessage}`,
      { task, error }
    );
    throw error;
  }
});
app.whenReady().then(() => {
  initializeNexusCore();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
export {
  getNexusState,
  logSystemEvent,
  nexusEngine
};
