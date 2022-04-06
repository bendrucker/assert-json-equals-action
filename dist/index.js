import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 1508:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var object        = __nccwpck_require__(6561)
  , stringifiable = __nccwpck_require__(8080)
  , forOf         = __nccwpck_require__(6756);

module.exports = function (text, style) {
	var result = "";
	text = stringifiable(text);
	object(style);
	forOf(text, function (char) { result += style[char] || char; });
	return result;
};


/***/ }),

/***/ 6241:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var d              = __nccwpck_require__(4571)
  , assign         = __nccwpck_require__(1377)
  , forEach        = __nccwpck_require__(9575)
  , map            = __nccwpck_require__(7289)
  , primitiveSet   = __nccwpck_require__(2796)
  , setPrototypeOf = __nccwpck_require__(7165)
  , memoize        = __nccwpck_require__(5841)
  , memoizeMethods = __nccwpck_require__(1936)
  , sgr            = __nccwpck_require__(8139)
  , supportsColor  = __nccwpck_require__(4947);

var mods           = sgr.mods
  , join           = Array.prototype.join
  , defineProperty = Object.defineProperty
  , max            = Math.max
  , min            = Math.min
  , variantModes   = primitiveSet("_fg", "_bg")
  , xtermMatch     = process.platform === "win32" ? __nccwpck_require__(9035) : null;

var getFn;

// Some use cli-color as: console.log(clc.red('Error!'));
// Which is inefficient as on each call it configures new clc object
// with memoization we reuse once created object
var memoized = memoize(function (scope, mod) {
	return defineProperty(getFn(), "_cliColorData", d(assign({}, scope._cliColorData, mod)));
});

var proto = Object.create(
	Function.prototype,
	assign(
		map(mods, function (mod) {
			return d.gs(function () { return memoized(this, mod); });
		}),
		memoizeMethods({
			// xterm (255) color
			xterm: d(function (code) {
				code = isNaN(code) ? 255 : min(max(code, 0), 255);
				return defineProperty(
					getFn(), "_cliColorData",
					d(
						assign({}, this._cliColorData, {
							_fg: [xtermMatch ? xtermMatch[code] : "38;5;" + code, 39]
						})
					)
				);
			}),
			bgXterm: d(function (code) {
				code = isNaN(code) ? 255 : min(max(code, 0), 255);
				return defineProperty(
					getFn(), "_cliColorData",
					d(
						assign({}, this._cliColorData, {
							_bg: [xtermMatch ? xtermMatch[code] + 10 : "48;5;" + code, 49]
						})
					)
				);
			})
		})
	)
);

var getEndRe = memoize(function (code) { return new RegExp("\x1b\\[" + code + "m", "g"); }, {
	primitive: true
});

getFn = function () {
	return setPrototypeOf(
		function self(/* …msg*/) {
			var start = ""
			  , end = ""
			  , msg = join.call(arguments, " ")
			  , conf = self._cliColorData
			  , hasAnsi = sgr.hasCSI(msg);
			forEach(
				conf,
				function (mod, key) {
					end = sgr(mod[1]) + end;
					start += sgr(mod[0]);
					if (hasAnsi) {
						msg = msg.replace(getEndRe(mod[1]), variantModes[key] ? sgr(mod[0]) : "");
					}
				},
				null,
				true
			);
			if (!supportsColor.isColorSupported()) return msg;
			return start + msg + end;
		},
		proto
	);
};

module.exports = Object.defineProperties(getFn(), {
	xtermSupported: d(!xtermMatch),
	_cliColorData: d("", {})
});


/***/ }),

/***/ 6470:
/***/ ((module) => {



module.exports = "\x07";


/***/ }),

/***/ 9828:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var generate          = __nccwpck_require__(2906)
  , from              = __nccwpck_require__(2406)
  , iterable          = __nccwpck_require__(3205)
  , isValue           = __nccwpck_require__(2285)
  , stringifiable     = __nccwpck_require__(1481)
  , repeat            = __nccwpck_require__(5650)
  , getStrippedLength = __nccwpck_require__(5478);

var push = Array.prototype.push;

module.exports = function (inputRows /*, options*/) {
	var options = Object(arguments[1])
	  , colsMeta = []
	  , colsOptions = options.columns || []
	  , rows = [];

	from(iterable(inputRows), function (row) {
		var rowRows = [[]];
		from(iterable(row), function (cellStr, columnIndex) {
			var cellRows = stringifiable(cellStr).split("\n");
			while (cellRows.length > rowRows.length) rowRows.push(generate(columnIndex, ""));
			cellRows.forEach(function (cellRow, rowRowIndex) {
				rowRows[rowRowIndex][columnIndex] = cellRow;
			});
		});
		push.apply(rows, rowRows);
	});

	return (
		rows
			.map(function (row) {
				return from(iterable(row), function (str, index) {
					var col = colsMeta[index], strLength;
					if (!col) col = colsMeta[index] = { width: 0 };
					str = stringifiable(str);
					strLength = getStrippedLength(str);
					if (strLength > col.width) col.width = strLength;
					return { str: str, length: strLength };
				});
			})
			.map(function (row) {
				return row
					.map(function (item, index) {
						var pad, align = "left", colOptions = colsOptions && colsOptions[index];
						align = colOptions && colOptions.align === "right" ? "right" : "left";
						pad = repeat.call(" ", colsMeta[index].width - item.length);
						if (align === "left") return item.str + pad;
						return pad + item.str;
					})
					.join(isValue(options.sep) ? options.sep : " | ");
			})
			.join("\n") + "\n"
	);
};


/***/ }),

/***/ 5715:
/***/ ((module) => {



module.exports = {
	screen: "\x1b[2J",
	screenLeft: "\x1b[1J",
	screenRight: "\x1b[J",
	line: "\x1b[2K",
	lineLeft: "\x1b[1K",
	lineRight: "\x1b[K"
};


/***/ }),

/***/ 5478:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



/*
 * get actual length of ANSI-formatted string
 */

var strip = __nccwpck_require__(1335);

module.exports = function (str) { return strip(str).length; };


/***/ }),

/***/ 1047:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var d = __nccwpck_require__(4571);

module.exports = Object.defineProperties(__nccwpck_require__(6241), {
	windowSize: d(__nccwpck_require__(9717)),
	erase: d(__nccwpck_require__(5715)),
	move: d(__nccwpck_require__(3759)),
	beep: d(__nccwpck_require__(6470)),
	columns: d(__nccwpck_require__(9828)),
	strip: d(__nccwpck_require__(1335)),
	getStrippedLength: d(__nccwpck_require__(5478)),
	slice: d(__nccwpck_require__(2421)),
	throbber: d(__nccwpck_require__(7307)),
	reset: d(__nccwpck_require__(1749)),
	art: d(__nccwpck_require__(1508))
});


/***/ }),

/***/ 8139:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



/* CSI - control sequence introducer */
/* SGR - set graphic rendition */

var assign       = __nccwpck_require__(1377)
  , includes     = __nccwpck_require__(7689)
  , forOwn       = __nccwpck_require__(9575)
  , onlyKey      = __nccwpck_require__(7726)
  , forEachRight = __nccwpck_require__(8137)
  , uniq         = __nccwpck_require__(5684);

var CSI = "\x1b[";

var sgr = function (code) { return CSI + code + "m"; };

sgr.CSI = CSI;

var mods = assign(
	{
		// Style
		bold: { _bold: [1, 22] },
		italic: { _italic: [3, 23] },
		underline: { _underline: [4, 24] },
		blink: { _blink: [5, 25] },
		inverse: { _inverse: [7, 27] },
		strike: { _strike: [9, 29] }

		// Color
	},
	["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"].reduce(function (
		obj,
		color,
		index
	) {
		// foreground
		obj[color] = { _fg: [30 + index, 39] };
		obj[color + "Bright"] = { _fg: [90 + index, 39] };

		// background
		obj["bg" + color[0].toUpperCase() + color.slice(1)] = { _bg: [40 + index, 49] };
		obj["bg" + color[0].toUpperCase() + color.slice(1) + "Bright"] = { _bg: [100 + index, 49] };

		return obj;
	}, {})
);

sgr.mods = mods;

sgr.openers = {};
sgr.closers = {};

forOwn(mods, function (mod) {
	var modPair = mod[onlyKey(mod)];

	sgr.openers[modPair[0]] = modPair;
	sgr.closers[modPair[1]] = modPair;
});

sgr.openStyle = function (openedMods, code) { openedMods.push(sgr.openers[code]); };

sgr.closeStyle = function (openedMods, code) {
	forEachRight.call(openedMods, function (modPair, index) {
		if (modPair[1] === code) {
			openedMods.splice(index, 1);
		}
	});
};

/* prepend openers */
sgr.prepend = function (currentMods) {
	return currentMods.map(function (modPair) { return sgr(modPair[0]); });
};

/* complete non-closed openers with corresponding closers */
sgr.complete = function (openedMods, closerCodes) {
	closerCodes.forEach(function (code) { sgr.closeStyle(openedMods, code); });

	// mods must be closed from the last opened to first opened
	openedMods = openedMods.reverse();

	openedMods = openedMods.map(function (modPair) { return modPair[1]; });

	// one closer can close many openers (31, 32 -> 39)
	openedMods = uniq.call(openedMods);

	return openedMods.map(sgr);
};

var hasCSI = function (str) { return includes.call(str, CSI); };

sgr.hasCSI = hasCSI;

var extractCode = function (csi) {
	var code = csi.slice(2, -1);
	code = Number(code);
	return code;
};

sgr.extractCode = extractCode;

module.exports = sgr;


/***/ }),

/***/ 4947:
/***/ ((module) => {



// store whether supports-color mode is enabled or not.
var state = null;

// force supports-color mode
var enableColor = function () { state = true; };

// disable supports-color mode
var disableColor = function () { state = false; };

// use the NO_COLOR environment variable (default)
var autoDetectSupport = function () { state = null; };

// determine whether supports-color mode is enabled.
var isColorSupported = function () { return state === null ? !process.env.NO_COLOR : state; };

module.exports = {
	enableColor: enableColor,
	disableColor: disableColor,
	autoDetectSupport: autoDetectSupport,
	isColorSupported: isColorSupported
};


/***/ }),

/***/ 226:
/***/ ((module) => {



module.exports = [
	"000000", "800000", "008000", "808000", "000080", "800080", "008080", "c0c0c0", "808080",
	"ff0000", "00ff00", "ffff00", "0000ff", "ff00ff", "00ffff", "ffffff", "000000", "00005f",
	"000087", "0000af", "0000d7", "0000ff", "005f00", "005f5f", "005f87", "005faf", "005fd7",
	"005fff", "008700", "00875f", "008787", "0087af", "0087d7", "0087ff", "00af00", "00af5f",
	"00af87", "00afaf", "00afd7", "00afff", "00d700", "00d75f", "00d787", "00d7af", "00d7d7",
	"00d7ff", "00ff00", "00ff5f", "00ff87", "00ffaf", "00ffd7", "00ffff", "5f0000", "5f005f",
	"5f0087", "5f00af", "5f00d7", "5f00ff", "5f5f00", "5f5f5f", "5f5f87", "5f5faf", "5f5fd7",
	"5f5fff", "5f8700", "5f875f", "5f8787", "5f87af", "5f87d7", "5f87ff", "5faf00", "5faf5f",
	"5faf87", "5fafaf", "5fafd7", "5fafff", "5fd700", "5fd75f", "5fd787", "5fd7af", "5fd7d7",
	"5fd7ff", "5fff00", "5fff5f", "5fff87", "5fffaf", "5fffd7", "5fffff", "870000", "87005f",
	"870087", "8700af", "8700d7", "8700ff", "875f00", "875f5f", "875f87", "875faf", "875fd7",
	"875fff", "878700", "87875f", "878787", "8787af", "8787d7", "8787ff", "87af00", "87af5f",
	"87af87", "87afaf", "87afd7", "87afff", "87d700", "87d75f", "87d787", "87d7af", "87d7d7",
	"87d7ff", "87ff00", "87ff5f", "87ff87", "87ffaf", "87ffd7", "87ffff", "af0000", "af005f",
	"af0087", "af00af", "af00d7", "af00ff", "af5f00", "af5f5f", "af5f87", "af5faf", "af5fd7",
	"af5fff", "af8700", "af875f", "af8787", "af87af", "af87d7", "af87ff", "afaf00", "afaf5f",
	"afaf87", "afafaf", "afafd7", "afafff", "afd700", "afd75f", "afd787", "afd7af", "afd7d7",
	"afd7ff", "afff00", "afff5f", "afff87", "afffaf", "afffd7", "afffff", "d70000", "d7005f",
	"d70087", "d700af", "d700d7", "d700ff", "d75f00", "d75f5f", "d75f87", "d75faf", "d75fd7",
	"d75fff", "d78700", "d7875f", "d78787", "d787af", "d787d7", "d787ff", "d7af00", "d7af5f",
	"d7af87", "d7afaf", "d7afd7", "d7afff", "d7d700", "d7d75f", "d7d787", "d7d7af", "d7d7d7",
	"d7d7ff", "d7ff00", "d7ff5f", "d7ff87", "d7ffaf", "d7ffd7", "d7ffff", "ff0000", "ff005f",
	"ff0087", "ff00af", "ff00d7", "ff00ff", "ff5f00", "ff5f5f", "ff5f87", "ff5faf", "ff5fd7",
	"ff5fff", "ff8700", "ff875f", "ff8787", "ff87af", "ff87d7", "ff87ff", "ffaf00", "ffaf5f",
	"ffaf87", "ffafaf", "ffafd7", "ffafff", "ffd700", "ffd75f", "ffd787", "ffd7af", "ffd7d7",
	"ffd7ff", "ffff00", "ffff5f", "ffff87", "ffffaf", "ffffd7", "ffffff", "080808", "121212",
	"1c1c1c", "262626", "303030", "3a3a3a", "444444", "4e4e4e", "585858", "626262", "6c6c6c",
	"767676", "808080", "8a8a8a", "949494", "9e9e9e", "a8a8a8", "b2b2b2", "bcbcbc", "c6c6c6",
	"d0d0d0", "dadada", "e4e4e4", "eeeeee"
];


/***/ }),

/***/ 9035:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var push = Array.prototype.push
  , reduce = Array.prototype.reduce
  , abs = Math.abs
  , colors
  , match
  , result
  , i;

colors = (__nccwpck_require__(226).map)(function (color) {
	return {
		r: parseInt(color.slice(0, 2), 16),
		g: parseInt(color.slice(2, 4), 16),
		b: parseInt(color.slice(4), 16)
	};
});

match = colors.slice(0, 16);

module.exports = result = [];

i = 0;
while (i < 8) {
	result.push(30 + i++);
}
i = 0;
while (i < 8) {
	result.push(90 + i++);
}
push.apply(
	result,
	colors.slice(16).map(function (data) {
		var index, diff = Infinity;
		match.every(function (innerMatch, currentIndex) {
			var ndiff = reduce.call(
				"rgb",
				function (currentDiff, channel) {
					currentDiff += abs(innerMatch[channel] - data[channel]);
					return currentDiff;
				},
				0
			);
			if (ndiff < diff) {
				index = currentIndex;
				diff = ndiff;
			}
			return ndiff;
		});
		return result[index];
	})
);


/***/ }),

/***/ 3759:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var d     = __nccwpck_require__(4571)
  , trunc = __nccwpck_require__(9394);

var up, down, right, left, abs = Math.abs, floor = Math.floor, max = Math.max;

var getMove = function (control) {
	return function (num) {
		num = isNaN(num) ? 0 : max(floor(num), 0);
		return num ? "\x1b[" + num + control : "";
	};
};

module.exports = Object.defineProperties(
	function (x, y) {
		x = isNaN(x) ? 0 : floor(x);
		y = isNaN(y) ? 0 : floor(y);
		return (x > 0 ? right(x) : left(-x)) + (y > 0 ? down(y) : up(-y));
	},
	{
		up: d((up = getMove("A"))),
		down: d((down = getMove("B"))),
		right: d((right = getMove("C"))),
		left: d((left = getMove("D"))),
		to: d(function (x, y) {
			x = isNaN(x) ? 1 : max(floor(x), 0) + 1;
			y = isNaN(y) ? 1 : max(floor(y), 0) + 1;
			return "\x1b[" + y + ";" + x + "H";
		}),
		lines: d(function (n) {
			var dir;
			n = trunc(n) || 0;
			dir = n >= 0 ? "B" : "A";
			n = floor(abs(n));
			return "\x1b[" + n + dir + "\x1b[1G";
		}),
		top: d("\x1b[5000F"),
		bottom: d("\x1b[5000B"),
		lineBegin: d("\x1b[5000D"),
		lineEnd: d("\x1b[5000C")
	}
);


/***/ }),

/***/ 5648:
/***/ ((module) => {



module.exports = function () {
	// Borrowed from ansi-regex package
	// https://github.com/chalk/ansi-regex/blob/a28b8e7ee67aa9996ba44bf123f0436eea62d285/index.js

	return new RegExp(
		"[\\u001B\\u009B][[\\]()#;?]" +
			"*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]" +
			"+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)" +
			"|" +
			"(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
		"g"
	);
};


/***/ }),

/***/ 1749:
/***/ ((module) => {



module.exports = "\x1b[2J\x1b[0;0H";


/***/ }),

/***/ 2421:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint max-lines: "off" */



var reAnsi        = __nccwpck_require__(5648)
  , stringifiable = __nccwpck_require__(8080)
  , length        = __nccwpck_require__(5478)
  , sgr           = __nccwpck_require__(8139)
  , max           = Math.max;

var Token = function (token) { this.token = token; };

var tokenize = function (str) {
	var match = reAnsi().exec(str);

	if (!match) {
		return [str];
	}

	var index = match.index, head, prehead, tail;

	if (index === 0) {
		head = match[0];
		tail = str.slice(head.length);

		return [new Token(head)].concat(tokenize(tail));
	}

	prehead = str.slice(0, index);
	head = match[0];
	tail = str.slice(index + head.length);

	return [prehead, new Token(head)].concat(tokenize(tail));
};

var isChunkInSlice = function (chunk, index, begin, end) {
	var endIndex = chunk.length + index;

	if (begin > endIndex) return false;
	if (end < index) return false;
	return true;
};

// eslint-disable-next-line max-lines-per-function
var sliceSeq = function (seq, begin, end) {
	var sliced = seq.reduce(
		function (state, chunk) {
			var index = state.index;

			if (chunk instanceof Token) {
				var code = sgr.extractCode(chunk.token);

				if (index <= begin) {
					if (code in sgr.openers) {
						sgr.openStyle(state.preOpeners, code);
					}
					if (code in sgr.closers) {
						sgr.closeStyle(state.preOpeners, code);
					}
				} else if (index < end) {
					if (code in sgr.openers) {
						sgr.openStyle(state.inOpeners, code);
						state.seq.push(chunk);
					} else if (code in sgr.closers) {
						state.inClosers.push(code);
						state.seq.push(chunk);
					}
				}
			} else {
				var nextChunk = "";

				if (isChunkInSlice(chunk, index, begin, end)) {
					var relBegin = Math.max(begin - index, 0)
					  , relEnd = Math.min(end - index, chunk.length);

					nextChunk = chunk.slice(relBegin, relEnd);
				}

				state.seq.push(nextChunk);
				state.index = index + chunk.length;
			}

			return state;
		},
		{
			index: 0,
			seq: [],

			// preOpeners -> [ mod ]
			// preOpeners must be prepended to the slice if they wasn't closed til the end of it
			// preOpeners must be closed if they wasn't closed til the end of the slice
			preOpeners: [],

			// inOpeners  -> [ mod ]
			// inOpeners already in the slice and must not be prepended to the slice
			// inOpeners must be closed if they wasn't closed til the end of the slice
			inOpeners: [], // opener CSI inside slice

			// inClosers -> [ code ]
			// closer CSIs for determining which pre/in-Openers must be closed
			inClosers: []
		}
	);

	sliced.seq = [].concat(
		sgr.prepend(sliced.preOpeners), sliced.seq,
		sgr.complete([].concat(sliced.preOpeners, sliced.inOpeners), sliced.inClosers)
	);

	return sliced.seq;
};

module.exports = function (str /*, begin, end*/) {
	var seq, begin = Number(arguments[1]), end = Number(arguments[2]), len;

	str = stringifiable(str);
	len = length(str);

	if (isNaN(begin)) {
		begin = 0;
	}
	if (isNaN(end)) {
		end = len;
	}
	if (begin < 0) {
		begin = max(len + begin, 0);
	}
	if (end < 0) {
		end = max(len + end, 0);
	}

	seq = tokenize(str);
	seq = sliceSeq(seq, begin, end);
	return seq
		.map(function (chunk) {
			if (chunk instanceof Token) {
				return chunk.token;
			}

			return chunk;
		})
		.join("");
};


/***/ }),

/***/ 1335:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Strip ANSI formatting from string



var stringifiable = __nccwpck_require__(1481)
  , r             = __nccwpck_require__(5648)();

module.exports = function (str) { return stringifiable(str).replace(r, ""); };


/***/ }),

/***/ 7307:
/***/ ((module, exports, __nccwpck_require__) => {



var compose      = __nccwpck_require__(4274)
  , callable     = __nccwpck_require__(6097)
  , d            = __nccwpck_require__(4571)
  , validTimeout = __nccwpck_require__(9953);

var chars = "-\\|/", l = chars.length, ThrobberIterator;

ThrobberIterator = function () {
	// no setup needed
};
Object.defineProperties(ThrobberIterator.prototype, {
	index: d(-1),
	running: d(false),
	next: d(function () {
		var str = this.running ? "\u0008" : "";
		if (!this.running) this.running = true;
		return str + chars[(this.index = (this.index + 1) % l)];
	}),
	reset: d(function () {
		if (!this.running) return "";
		this.index = -1;
		this.running = false;
		return "\u0008";
	})
});

module.exports = exports = function (write, interval /*, format*/) {
	var format = arguments[2], token, iterator = new ThrobberIterator();
	callable(write);
	interval = validTimeout(interval);
	if (format !== undefined) write = compose.call(write, callable(format));
	return {
		start: function () {
			if (token) return;
			token = setInterval(function () { write(iterator.next()); }, interval);
		},
		restart: function () {
			this.stop();
			this.start();
		},
		stop: function () {
			if (!token) return;
			clearInterval(token);
			token = null;
			write(iterator.reset());
		}
	};
};

Object.defineProperty(exports, "Iterator", (d(ThrobberIterator)));


/***/ }),

/***/ 9717:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



var d = __nccwpck_require__(4571);

Object.defineProperties(exports, {
	width: d.gs("ce", function () { return process.stdout.columns || 0; }),
	height: d.gs("ce", function () { return process.stdout.rows || 0; })
});


/***/ }),

/***/ 6362:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue             = __nccwpck_require__(3134)
  , ensureValue         = __nccwpck_require__(942)
  , ensurePlainFunction = __nccwpck_require__(3681)
  , copy                = __nccwpck_require__(3382)
  , normalizeOptions    = __nccwpck_require__(4488)
  , map                 = __nccwpck_require__(7289);

var bind = Function.prototype.bind
  , defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, options) {
	var value = ensureValue(desc) && ensurePlainFunction(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, options.resolveContext ? options.resolveContext(this) : this);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, options*/) {
	var options = normalizeOptions(arguments[1]);
	if (isValue(options.resolveContext)) ensurePlainFunction(options.resolveContext);
	return map(props, function (desc, name) { return define(name, desc, options); });
};


/***/ }),

/***/ 4571:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue         = __nccwpck_require__(3134)
  , isPlainFunction = __nccwpck_require__(6796)
  , assign          = __nccwpck_require__(1377)
  , normalizeOpts   = __nccwpck_require__(4488)
  , contains        = __nccwpck_require__(7689);

var d = (module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if (arguments.length < 2 || typeof dscr !== "string") {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
		w = contains.call(dscr, "w");
	} else {
		c = w = true;
		e = false;
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
});

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== "string") {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (!isValue(get)) {
		get = undefined;
	} else if (!isPlainFunction(get)) {
		options = get;
		get = set = undefined;
	} else if (!isValue(set)) {
		set = undefined;
	} else if (!isPlainFunction(set)) {
		options = set;
		set = undefined;
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
	} else {
		c = true;
		e = false;
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};


/***/ }),

/***/ 7579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isPlainFunction = __nccwpck_require__(6796)
  , ensureValue     = __nccwpck_require__(942)
  , isValue         = __nccwpck_require__(3134)
  , map             = __nccwpck_require__(7289)
  , contains        = __nccwpck_require__(7689);

var call = Function.prototype.call
  , defineProperty = Object.defineProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
  , getPrototypeOf = Object.getPrototypeOf
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , cacheDesc = { configurable: false, enumerable: false, writable: false, value: null }
  , define;

define = function (name, options) {
	var value, dgs, cacheName, desc, writable = false, resolvable, flat;
	options = Object(ensureValue(options));
	cacheName = options.cacheName;
	flat = options.flat;
	if (!isValue(cacheName)) cacheName = name;
	delete options.cacheName;
	value = options.value;
	resolvable = isPlainFunction(value);
	delete options.value;
	dgs = { configurable: Boolean(options.configurable), enumerable: Boolean(options.enumerable) };
	if (name !== cacheName) {
		dgs.get = function () {
			if (hasOwnProperty.call(this, cacheName)) return this[cacheName];
			cacheDesc.value = resolvable ? call.call(value, this, options) : value;
			cacheDesc.writable = writable;
			defineProperty(this, cacheName, cacheDesc);
			cacheDesc.value = null;
			if (desc) defineProperty(this, name, desc);
			return this[cacheName];
		};
	} else if (!flat) {
		dgs.get = function self() {
			var ownDesc;
			if (hasOwnProperty.call(this, name)) {
				ownDesc = getOwnPropertyDescriptor(this, name);
				// It happens in Safari, that getter is still called after property
				// was defined with a value, following workarounds that
				// While in IE11 it may happen that here ownDesc is undefined (go figure)
				if (ownDesc) {
					if (ownDesc.hasOwnProperty("value")) return ownDesc.value;
					if (typeof ownDesc.get === "function" && ownDesc.get !== self) {
						return ownDesc.get.call(this);
					}
					return value;
				}
			}
			desc.value = resolvable ? call.call(value, this, options) : value;
			defineProperty(this, name, desc);
			desc.value = null;
			return this[name];
		};
	} else {
		dgs.get = function self() {
			var base = this, ownDesc;
			if (hasOwnProperty.call(this, name)) {
				// It happens in Safari, that getter is still called after property
				// was defined with a value, following workarounds that
				ownDesc = getOwnPropertyDescriptor(this, name);
				if (ownDesc.hasOwnProperty("value")) return ownDesc.value;
				if (typeof ownDesc.get === "function" && ownDesc.get !== self) {
					return ownDesc.get.call(this);
				}
			}
			while (!hasOwnProperty.call(base, name)) base = getPrototypeOf(base);
			desc.value = resolvable ? call.call(value, base, options) : value;
			defineProperty(base, name, desc);
			desc.value = null;
			return base[name];
		};
	}
	dgs.set = function (value) {
		if (hasOwnProperty.call(this, name)) {
			throw new TypeError("Cannot assign to lazy defined '" + name + "' property of " + this);
		}
		dgs.get.call(this);
		this[cacheName] = value;
	};
	if (options.desc) {
		desc = {
			configurable: contains.call(options.desc, "c"),
			enumerable: contains.call(options.desc, "e")
		};
		if (cacheName === name) {
			desc.writable = contains.call(options.desc, "w");
			desc.value = null;
		} else {
			writable = contains.call(options.desc, "w");
			desc.get = dgs.get;
			desc.set = dgs.set;
		}
		delete options.desc;
	} else if (cacheName === name) {
		desc = {
			configurable: Boolean(options.configurable),
			enumerable: Boolean(options.enumerable),
			writable: Boolean(options.writable),
			value: null
		};
	}
	delete options.configurable;
	delete options.enumerable;
	delete options.writable;
	return dgs;
};

module.exports = function (props) {
	return map(props, function (desc, name) { return define(name, desc); });
};


/***/ }),

/***/ 4087:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(9819);


/***/ }),

/***/ 9819:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.3.1

/*
Module difflib -- helpers for computing deltas between objects.

Function getCloseMatches(word, possibilities, n=3, cutoff=0.6):
    Use SequenceMatcher to return list of the best "good enough" matches.

Function contextDiff(a, b):
    For two lists of strings, return a delta in context diff format.

Function ndiff(a, b):
    Return a delta: the difference between `a` and `b` (lists of strings).

Function restore(delta, which):
    Return one of the two sequences that generated an ndiff delta.

Function unifiedDiff(a, b):
    For two lists of strings, return a delta in unified diff format.

Class SequenceMatcher:
    A flexible class for comparing pairs of sequences of any type.

Class Differ:
    For producing human-readable deltas from sequences of lines of text.
*/


(function() {
  var Differ, Heap, IS_CHARACTER_JUNK, IS_LINE_JUNK, SequenceMatcher, assert, contextDiff, floor, getCloseMatches, max, min, ndiff, restore, unifiedDiff, _any, _arrayCmp, _calculateRatio, _countLeading, _formatRangeContext, _formatRangeUnified, _has,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  floor = Math.floor, max = Math.max, min = Math.min;

  Heap = __nccwpck_require__(6106);

  assert = __nccwpck_require__(9491);

  _calculateRatio = function(matches, length) {
    if (length) {
      return 2.0 * matches / length;
    } else {
      return 1.0;
    }
  };

  _arrayCmp = function(a, b) {
    var i, la, lb, _i, _ref, _ref1;
    _ref = [a.length, b.length], la = _ref[0], lb = _ref[1];
    for (i = _i = 0, _ref1 = min(la, lb); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      if (a[i] < b[i]) {
        return -1;
      }
      if (a[i] > b[i]) {
        return 1;
      }
    }
    return la - lb;
  };

  _has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  _any = function(items) {
    var item, _i, _len;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (item) {
        return true;
      }
    }
    return false;
  };

  SequenceMatcher = (function() {

    SequenceMatcher.name = 'SequenceMatcher';

    /*
      SequenceMatcher is a flexible class for comparing pairs of sequences of
      any type, so long as the sequence elements are hashable.  The basic
      algorithm predates, and is a little fancier than, an algorithm
      published in the late 1980's by Ratcliff and Obershelp under the
      hyperbolic name "gestalt pattern matching".  The basic idea is to find
      the longest contiguous matching subsequence that contains no "junk"
      elements (R-O doesn't address junk).  The same idea is then applied
      recursively to the pieces of the sequences to the left and to the right
      of the matching subsequence.  This does not yield minimal edit
      sequences, but does tend to yield matches that "look right" to people.
    
      SequenceMatcher tries to compute a "human-friendly diff" between two
      sequences.  Unlike e.g. UNIX(tm) diff, the fundamental notion is the
      longest *contiguous* & junk-free matching subsequence.  That's what
      catches peoples' eyes.  The Windows(tm) windiff has another interesting
      notion, pairing up elements that appear uniquely in each sequence.
      That, and the method here, appear to yield more intuitive difference
      reports than does diff.  This method appears to be the least vulnerable
      to synching up on blocks of "junk lines", though (like blank lines in
      ordinary text files, or maybe "<P>" lines in HTML files).  That may be
      because this is the only method of the 3 that has a *concept* of
      "junk" <wink>.
    
      Example, comparing two strings, and considering blanks to be "junk":
    
      >>> isjunk = (c) -> c is ' '
      >>> s = new SequenceMatcher(isjunk,
                                  'private Thread currentThread;',
                                  'private volatile Thread currentThread;')
    
      .ratio() returns a float in [0, 1], measuring the "similarity" of the
      sequences.  As a rule of thumb, a .ratio() value over 0.6 means the
      sequences are close matches:
    
      >>> s.ratio().toPrecision(3)
      '0.866'
    
      If you're only interested in where the sequences match,
      .getMatchingBlocks() is handy:
    
      >>> for [a, b, size] in s.getMatchingBlocks()
      ...   console.log("a[#{a}] and b[#{b}] match for #{size} elements");
      a[0] and b[0] match for 8 elements
      a[8] and b[17] match for 21 elements
      a[29] and b[38] match for 0 elements
    
      Note that the last tuple returned by .get_matching_blocks() is always a
      dummy, (len(a), len(b), 0), and this is the only case in which the last
      tuple element (number of elements matched) is 0.
    
      If you want to know how to change the first sequence into the second,
      use .get_opcodes():
    
      >>> for [op, a1, a2, b1, b2] in s.getOpcodes()
      ...   console.log "#{op} a[#{a1}:#{a2}] b[#{b1}:#{b2}]"
      equal a[0:8] b[0:8]
      insert a[8:8] b[8:17]
      equal a[8:29] b[17:38]
    
      See the Differ class for a fancy human-friendly file differencer, which
      uses SequenceMatcher both to compare sequences of lines, and to compare
      sequences of characters within similar (near-matching) lines.
    
      See also function getCloseMatches() in this module, which shows how
      simple code building on SequenceMatcher can be used to do useful work.
    
      Timing:  Basic R-O is cubic time worst case and quadratic time expected
      case.  SequenceMatcher is quadratic time for the worst case and has
      expected-case behavior dependent in a complicated way on how many
      elements the sequences have in common; best case time is linear.
    
      Methods:
    
      constructor(isjunk=null, a='', b='')
          Construct a SequenceMatcher.
    
      setSeqs(a, b)
          Set the two sequences to be compared.
    
      setSeq1(a)
          Set the first sequence to be compared.
    
      setSeq2(b)
          Set the second sequence to be compared.
    
      findLongestMatch(alo, ahi, blo, bhi)
          Find longest matching block in a[alo:ahi] and b[blo:bhi].
    
      getMatchingBlocks()
          Return list of triples describing matching subsequences.
    
      getOpcodes()
          Return list of 5-tuples describing how to turn a into b.
    
      ratio()
          Return a measure of the sequences' similarity (float in [0,1]).
    
      quickRatio()
          Return an upper bound on .ratio() relatively quickly.
    
      realQuickRatio()
          Return an upper bound on ratio() very quickly.
    */


    function SequenceMatcher(isjunk, a, b, autojunk) {
      this.isjunk = isjunk;
      if (a == null) {
        a = '';
      }
      if (b == null) {
        b = '';
      }
      this.autojunk = autojunk != null ? autojunk : true;
      /*
          Construct a SequenceMatcher.
      
          Optional arg isjunk is null (the default), or a one-argument
          function that takes a sequence element and returns true iff the
          element is junk.  Null is equivalent to passing "(x) -> 0", i.e.
          no elements are considered to be junk.  For example, pass
              (x) -> x in ' \t'
          if you're comparing lines as sequences of characters, and don't
          want to synch up on blanks or hard tabs.
      
          Optional arg a is the first of two sequences to be compared.  By
          default, an empty string.  The elements of a must be hashable.  See
          also .setSeqs() and .setSeq1().
      
          Optional arg b is the second of two sequences to be compared.  By
          default, an empty string.  The elements of b must be hashable. See
          also .setSeqs() and .setSeq2().
      
          Optional arg autojunk should be set to false to disable the
          "automatic junk heuristic" that treats popular elements as junk
          (see module documentation for more information).
      */

      this.a = this.b = null;
      this.setSeqs(a, b);
    }

    SequenceMatcher.prototype.setSeqs = function(a, b) {
      /* 
      Set the two sequences to be compared. 
      
      >>> s = new SequenceMatcher()
      >>> s.setSeqs('abcd', 'bcde')
      >>> s.ratio()
      0.75
      */
      this.setSeq1(a);
      return this.setSeq2(b);
    };

    SequenceMatcher.prototype.setSeq1 = function(a) {
      /* 
      Set the first sequence to be compared. 
      
      The second sequence to be compared is not changed.
      
      >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
      >>> s.ratio()
      0.75
      >>> s.setSeq1('bcde')
      >>> s.ratio()
      1.0
      
      SequenceMatcher computes and caches detailed information about the
      second sequence, so if you want to compare one sequence S against
      many sequences, use .setSeq2(S) once and call .setSeq1(x)
      repeatedly for each of the other sequences.
      
      See also setSeqs() and setSeq2().
      */
      if (a === this.a) {
        return;
      }
      this.a = a;
      return this.matchingBlocks = this.opcodes = null;
    };

    SequenceMatcher.prototype.setSeq2 = function(b) {
      /*
          Set the second sequence to be compared. 
      
          The first sequence to be compared is not changed.
      
          >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
          >>> s.ratio()
          0.75
          >>> s.setSeq2('abcd')
          >>> s.ratio()
          1.0
      
          SequenceMatcher computes and caches detailed information about the
          second sequence, so if you want to compare one sequence S against
          many sequences, use .setSeq2(S) once and call .setSeq1(x)
          repeatedly for each of the other sequences.
      
          See also setSeqs() and setSeq1().
      */
      if (b === this.b) {
        return;
      }
      this.b = b;
      this.matchingBlocks = this.opcodes = null;
      this.fullbcount = null;
      return this._chainB();
    };

    SequenceMatcher.prototype._chainB = function() {
      var b, b2j, elt, i, idxs, indices, isjunk, junk, n, ntest, popular, _i, _j, _len, _len1, _ref;
      b = this.b;
      this.b2j = b2j = {};
      for (i = _i = 0, _len = b.length; _i < _len; i = ++_i) {
        elt = b[i];
        indices = _has(b2j, elt) ? b2j[elt] : b2j[elt] = [];
        indices.push(i);
      }
      junk = {};
      isjunk = this.isjunk;
      if (isjunk) {
        _ref = Object.keys(b2j);
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          elt = _ref[_j];
          if (isjunk(elt)) {
            junk[elt] = true;
            delete b2j[elt];
          }
        }
      }
      popular = {};
      n = b.length;
      if (this.autojunk && n >= 200) {
        ntest = floor(n / 100) + 1;
        for (elt in b2j) {
          idxs = b2j[elt];
          if (idxs.length > ntest) {
            popular[elt] = true;
            delete b2j[elt];
          }
        }
      }
      this.isbjunk = function(b) {
        return _has(junk, b);
      };
      return this.isbpopular = function(b) {
        return _has(popular, b);
      };
    };

    SequenceMatcher.prototype.findLongestMatch = function(alo, ahi, blo, bhi) {
      /* 
      Find longest matching block in a[alo...ahi] and b[blo...bhi].  
      
      If isjunk is not defined:
      
      Return [i,j,k] such that a[i...i+k] is equal to b[j...j+k], where
          alo <= i <= i+k <= ahi
          blo <= j <= j+k <= bhi
      and for all [i',j',k'] meeting those conditions,
          k >= k'
          i <= i'
          and if i == i', j <= j'
      
      In other words, of all maximal matching blocks, return one that
      starts earliest in a, and of all those maximal matching blocks that
      start earliest in a, return the one that starts earliest in b.
      
      >>> isjunk = (x) -> x is ' '
      >>> s = new SequenceMatcher(isjunk, ' abcd', 'abcd abcd')
      >>> s.findLongestMatch(0, 5, 0, 9)
      [1, 0, 4]
      
      >>> s = new SequenceMatcher(null, 'ab', 'c')
      >>> s.findLongestMatch(0, 2, 0, 1)
      [0, 0, 0]
      */

      var a, b, b2j, besti, bestj, bestsize, i, isbjunk, j, j2len, k, newj2len, _i, _j, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      _ref = [this.a, this.b, this.b2j, this.isbjunk], a = _ref[0], b = _ref[1], b2j = _ref[2], isbjunk = _ref[3];
      _ref1 = [alo, blo, 0], besti = _ref1[0], bestj = _ref1[1], bestsize = _ref1[2];
      j2len = {};
      for (i = _i = alo; alo <= ahi ? _i < ahi : _i > ahi; i = alo <= ahi ? ++_i : --_i) {
        newj2len = {};
        _ref2 = (_has(b2j, a[i]) ? b2j[a[i]] : []);
        for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
          j = _ref2[_j];
          if (j < blo) {
            continue;
          }
          if (j >= bhi) {
            break;
          }
          k = newj2len[j] = (j2len[j - 1] || 0) + 1;
          if (k > bestsize) {
            _ref3 = [i - k + 1, j - k + 1, k], besti = _ref3[0], bestj = _ref3[1], bestsize = _ref3[2];
          }
        }
        j2len = newj2len;
      }
      while (besti > alo && bestj > blo && !isbjunk(b[bestj - 1]) && a[besti - 1] === b[bestj - 1]) {
        _ref4 = [besti - 1, bestj - 1, bestsize + 1], besti = _ref4[0], bestj = _ref4[1], bestsize = _ref4[2];
      }
      while (besti + bestsize < ahi && bestj + bestsize < bhi && !isbjunk(b[bestj + bestsize]) && a[besti + bestsize] === b[bestj + bestsize]) {
        bestsize++;
      }
      while (besti > alo && bestj > blo && isbjunk(b[bestj - 1]) && a[besti - 1] === b[bestj - 1]) {
        _ref5 = [besti - 1, bestj - 1, bestsize + 1], besti = _ref5[0], bestj = _ref5[1], bestsize = _ref5[2];
      }
      while (besti + bestsize < ahi && bestj + bestsize < bhi && isbjunk(b[bestj + bestsize]) && a[besti + bestsize] === b[bestj + bestsize]) {
        bestsize++;
      }
      return [besti, bestj, bestsize];
    };

    SequenceMatcher.prototype.getMatchingBlocks = function() {
      /*
          Return list of triples describing matching subsequences.
      
          Each triple is of the form [i, j, n], and means that
          a[i...i+n] == b[j...j+n].  The triples are monotonically increasing in
          i and in j.  it's also guaranteed that if
          [i, j, n] and [i', j', n'] are adjacent triples in the list, and
          the second is not the last triple in the list, then i+n != i' or
          j+n != j'.  IOW, adjacent triples never describe adjacent equal
          blocks.
      
          The last triple is a dummy, [a.length, b.length, 0], and is the only
          triple with n==0.
      
          >>> s = new SequenceMatcher(null, 'abxcd', 'abcd')
          >>> s.getMatchingBlocks()
          [[0, 0, 2], [3, 2, 2], [5, 4, 0]]
      */

      var ahi, alo, bhi, blo, i, i1, i2, j, j1, j2, k, k1, k2, la, lb, matchingBlocks, nonAdjacent, queue, x, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      if (this.matchingBlocks) {
        return this.matchingBlocks;
      }
      _ref = [this.a.length, this.b.length], la = _ref[0], lb = _ref[1];
      queue = [[0, la, 0, lb]];
      matchingBlocks = [];
      while (queue.length) {
        _ref1 = queue.pop(), alo = _ref1[0], ahi = _ref1[1], blo = _ref1[2], bhi = _ref1[3];
        _ref2 = x = this.findLongestMatch(alo, ahi, blo, bhi), i = _ref2[0], j = _ref2[1], k = _ref2[2];
        if (k) {
          matchingBlocks.push(x);
          if (alo < i && blo < j) {
            queue.push([alo, i, blo, j]);
          }
          if (i + k < ahi && j + k < bhi) {
            queue.push([i + k, ahi, j + k, bhi]);
          }
        }
      }
      matchingBlocks.sort(_arrayCmp);
      i1 = j1 = k1 = 0;
      nonAdjacent = [];
      for (_i = 0, _len = matchingBlocks.length; _i < _len; _i++) {
        _ref3 = matchingBlocks[_i], i2 = _ref3[0], j2 = _ref3[1], k2 = _ref3[2];
        if (i1 + k1 === i2 && j1 + k1 === j2) {
          k1 += k2;
        } else {
          if (k1) {
            nonAdjacent.push([i1, j1, k1]);
          }
          _ref4 = [i2, j2, k2], i1 = _ref4[0], j1 = _ref4[1], k1 = _ref4[2];
        }
      }
      if (k1) {
        nonAdjacent.push([i1, j1, k1]);
      }
      nonAdjacent.push([la, lb, 0]);
      return this.matchingBlocks = nonAdjacent;
    };

    SequenceMatcher.prototype.getOpcodes = function() {
      /* 
      Return list of 5-tuples describing how to turn a into b.
      
      Each tuple is of the form [tag, i1, i2, j1, j2].  The first tuple
      has i1 == j1 == 0, and remaining tuples have i1 == the i2 from the
      tuple preceding it, and likewise for j1 == the previous j2.
      
      The tags are strings, with these meanings:
      
      'replace':  a[i1...i2] should be replaced by b[j1...j2]
      'delete':   a[i1...i2] should be deleted.
                  Note that j1==j2 in this case.
      'insert':   b[j1...j2] should be inserted at a[i1...i1].
                  Note that i1==i2 in this case.
      'equal':    a[i1...i2] == b[j1...j2]
      
      >>> s = new SequenceMatcher(null, 'qabxcd', 'abycdf')
      >>> s.getOpcodes()
      [ [ 'delete'  , 0 , 1 , 0 , 0 ] ,
        [ 'equal'   , 1 , 3 , 0 , 2 ] ,
        [ 'replace' , 3 , 4 , 2 , 3 ] ,
        [ 'equal'   , 4 , 6 , 3 , 5 ] ,
        [ 'insert'  , 6 , 6 , 5 , 6 ] ]
      */

      var ai, answer, bj, i, j, size, tag, _i, _len, _ref, _ref1, _ref2;
      if (this.opcodes) {
        return this.opcodes;
      }
      i = j = 0;
      this.opcodes = answer = [];
      _ref = this.getMatchingBlocks();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], ai = _ref1[0], bj = _ref1[1], size = _ref1[2];
        tag = '';
        if (i < ai && j < bj) {
          tag = 'replace';
        } else if (i < ai) {
          tag = 'delete';
        } else if (j < bj) {
          tag = 'insert';
        }
        if (tag) {
          answer.push([tag, i, ai, j, bj]);
        }
        _ref2 = [ai + size, bj + size], i = _ref2[0], j = _ref2[1];
        if (size) {
          answer.push(['equal', ai, i, bj, j]);
        }
      }
      return answer;
    };

    SequenceMatcher.prototype.getGroupedOpcodes = function(n) {
      var codes, group, groups, i1, i2, j1, j2, nn, tag, _i, _len, _ref, _ref1, _ref2, _ref3;
      if (n == null) {
        n = 3;
      }
      /* 
      Isolate change clusters by eliminating ranges with no changes.
      
      Return a list groups with upto n lines of context.
      Each group is in the same format as returned by get_opcodes().
      
      >>> a = [1...40].map(String)
      >>> b = a.slice()
      >>> b[8...8] = 'i'
      >>> b[20] += 'x'
      >>> b[23...28] = []
      >>> b[30] += 'y'
      >>> s = new SequenceMatcher(null, a, b)
      >>> s.getGroupedOpcodes()
      [ [ [ 'equal'  , 5 , 8  , 5 , 8 ],
          [ 'insert' , 8 , 8  , 8 , 9 ],
          [ 'equal'  , 8 , 11 , 9 , 12 ] ],
        [ [ 'equal'   , 16 , 19 , 17 , 20 ],
          [ 'replace' , 19 , 20 , 20 , 21 ],
          [ 'equal'   , 20 , 22 , 21 , 23 ],
          [ 'delete'  , 22 , 27 , 23 , 23 ],
          [ 'equal'   , 27 , 30 , 23 , 26 ] ],
        [ [ 'equal'   , 31 , 34 , 27 , 30 ],
          [ 'replace' , 34 , 35 , 30 , 31 ],
          [ 'equal'   , 35 , 38 , 31 , 34 ] ] ]
      */

      codes = this.getOpcodes();
      if (!codes.length) {
        codes = [['equal', 0, 1, 0, 1]];
      }
      if (codes[0][0] === 'equal') {
        _ref = codes[0], tag = _ref[0], i1 = _ref[1], i2 = _ref[2], j1 = _ref[3], j2 = _ref[4];
        codes[0] = [tag, max(i1, i2 - n), i2, max(j1, j2 - n), j2];
      }
      if (codes[codes.length - 1][0] === 'equal') {
        _ref1 = codes[codes.length - 1], tag = _ref1[0], i1 = _ref1[1], i2 = _ref1[2], j1 = _ref1[3], j2 = _ref1[4];
        codes[codes.length - 1] = [tag, i1, min(i2, i1 + n), j1, min(j2, j1 + n)];
      }
      nn = n + n;
      groups = [];
      group = [];
      for (_i = 0, _len = codes.length; _i < _len; _i++) {
        _ref2 = codes[_i], tag = _ref2[0], i1 = _ref2[1], i2 = _ref2[2], j1 = _ref2[3], j2 = _ref2[4];
        if (tag === 'equal' && i2 - i1 > nn) {
          group.push([tag, i1, min(i2, i1 + n), j1, min(j2, j1 + n)]);
          groups.push(group);
          group = [];
          _ref3 = [max(i1, i2 - n), max(j1, j2 - n)], i1 = _ref3[0], j1 = _ref3[1];
        }
        group.push([tag, i1, i2, j1, j2]);
      }
      if (group.length && !(group.length === 1 && group[0][0] === 'equal')) {
        groups.push(group);
      }
      return groups;
    };

    SequenceMatcher.prototype.ratio = function() {
      /*
          Return a measure of the sequences' similarity (float in [0,1]).
      
          Where T is the total number of elements in both sequences, and
          M is the number of matches, this is 2.0*M / T.
          Note that this is 1 if the sequences are identical, and 0 if
          they have nothing in common.
      
          .ratio() is expensive to compute if you haven't already computed
          .getMatchingBlocks() or .getOpcodes(), in which case you may
          want to try .quickRatio() or .realQuickRatio() first to get an
          upper bound.
          
          >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
          >>> s.ratio()
          0.75
          >>> s.quickRatio()
          0.75
          >>> s.realQuickRatio()
          1.0
      */

      var match, matches, _i, _len, _ref;
      matches = 0;
      _ref = this.getMatchingBlocks();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        match = _ref[_i];
        matches += match[2];
      }
      return _calculateRatio(matches, this.a.length + this.b.length);
    };

    SequenceMatcher.prototype.quickRatio = function() {
      /*
          Return an upper bound on ratio() relatively quickly.
      
          This isn't defined beyond that it is an upper bound on .ratio(), and
          is faster to compute.
      */

      var avail, elt, fullbcount, matches, numb, _i, _j, _len, _len1, _ref, _ref1;
      if (!this.fullbcount) {
        this.fullbcount = fullbcount = {};
        _ref = this.b;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elt = _ref[_i];
          fullbcount[elt] = (fullbcount[elt] || 0) + 1;
        }
      }
      fullbcount = this.fullbcount;
      avail = {};
      matches = 0;
      _ref1 = this.a;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        elt = _ref1[_j];
        if (_has(avail, elt)) {
          numb = avail[elt];
        } else {
          numb = fullbcount[elt] || 0;
        }
        avail[elt] = numb - 1;
        if (numb > 0) {
          matches++;
        }
      }
      return _calculateRatio(matches, this.a.length + this.b.length);
    };

    SequenceMatcher.prototype.realQuickRatio = function() {
      /*
          Return an upper bound on ratio() very quickly.
      
          This isn't defined beyond that it is an upper bound on .ratio(), and
          is faster to compute than either .ratio() or .quickRatio().
      */

      var la, lb, _ref;
      _ref = [this.a.length, this.b.length], la = _ref[0], lb = _ref[1];
      return _calculateRatio(min(la, lb), la + lb);
    };

    return SequenceMatcher;

  })();

  getCloseMatches = function(word, possibilities, n, cutoff) {
    var result, s, score, x, _i, _j, _len, _len1, _ref, _results;
    if (n == null) {
      n = 3;
    }
    if (cutoff == null) {
      cutoff = 0.6;
    }
    /*
      Use SequenceMatcher to return list of the best "good enough" matches.
    
      word is a sequence for which close matches are desired (typically a
      string).
    
      possibilities is a list of sequences against which to match word
      (typically a list of strings).
    
      Optional arg n (default 3) is the maximum number of close matches to
      return.  n must be > 0.
    
      Optional arg cutoff (default 0.6) is a float in [0, 1].  Possibilities
      that don't score at least that similar to word are ignored.
    
      The best (no more than n) matches among the possibilities are returned
      in a list, sorted by similarity score, most similar first.
    
      >>> getCloseMatches('appel', ['ape', 'apple', 'peach', 'puppy'])
      ['apple', 'ape']
      >>> KEYWORDS = require('coffee-script').RESERVED
      >>> getCloseMatches('wheel', KEYWORDS)
      ['when', 'while']
      >>> getCloseMatches('accost', KEYWORDS)
      ['const']
    */

    if (!(n > 0)) {
      throw new Error("n must be > 0: (" + n + ")");
    }
    if (!((0.0 <= cutoff && cutoff <= 1.0))) {
      throw new Error("cutoff must be in [0.0, 1.0]: (" + cutoff + ")");
    }
    result = [];
    s = new SequenceMatcher();
    s.setSeq2(word);
    for (_i = 0, _len = possibilities.length; _i < _len; _i++) {
      x = possibilities[_i];
      s.setSeq1(x);
      if (s.realQuickRatio() >= cutoff && s.quickRatio() >= cutoff && s.ratio() >= cutoff) {
        result.push([s.ratio(), x]);
      }
    }
    result = Heap.nlargest(result, n, _arrayCmp);
    _results = [];
    for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
      _ref = result[_j], score = _ref[0], x = _ref[1];
      _results.push(x);
    }
    return _results;
  };

  _countLeading = function(line, ch) {
    /*
      Return number of `ch` characters at the start of `line`.
    
      >>> _countLeading('   abc', ' ')
      3
    */

    var i, n, _ref;
    _ref = [0, line.length], i = _ref[0], n = _ref[1];
    while (i < n && line[i] === ch) {
      i++;
    }
    return i;
  };

  Differ = (function() {

    Differ.name = 'Differ';

    /*
      Differ is a class for comparing sequences of lines of text, and
      producing human-readable differences or deltas.  Differ uses
      SequenceMatcher both to compare sequences of lines, and to compare
      sequences of characters within similar (near-matching) lines.
    
      Each line of a Differ delta begins with a two-letter code:
    
          '- '    line unique to sequence 1
          '+ '    line unique to sequence 2
          '  '    line common to both sequences
          '? '    line not present in either input sequence
    
      Lines beginning with '? ' attempt to guide the eye to intraline
      differences, and were not present in either input sequence.  These lines
      can be confusing if the sequences contain tab characters.
    
      Note that Differ makes no claim to produce a *minimal* diff.  To the
      contrary, minimal diffs are often counter-intuitive, because they synch
      up anywhere possible, sometimes accidental matches 100 pages apart.
      Restricting synch points to contiguous matches preserves some notion of
      locality, at the occasional cost of producing a longer diff.
    
      Example: Comparing two texts.
    
      >>> text1 = ['1. Beautiful is better than ugly.\n',
      ...   '2. Explicit is better than implicit.\n',
      ...   '3. Simple is better than complex.\n',
      ...   '4. Complex is better than complicated.\n']
      >>> text1.length
      4
      >>> text2 = ['1. Beautiful is better than ugly.\n',
      ...   '3.   Simple is better than complex.\n',
      ...   '4. Complicated is better than complex.\n',
      ...   '5. Flat is better than nested.\n']
    
      Next we instantiate a Differ object:
    
      >>> d = new Differ()
    
      Note that when instantiating a Differ object we may pass functions to
      filter out line and character 'junk'.
    
      Finally, we compare the two:
    
      >>> result = d.compare(text1, text2)
      [ '  1. Beautiful is better than ugly.\n',
        '- 2. Explicit is better than implicit.\n',
        '- 3. Simple is better than complex.\n',
        '+ 3.   Simple is better than complex.\n',
        '?   ++\n',
        '- 4. Complex is better than complicated.\n',
        '?          ^                     ---- ^\n',
        '+ 4. Complicated is better than complex.\n',
        '?         ++++ ^                      ^\n',
        '+ 5. Flat is better than nested.\n' ]
    
      Methods:
    
      constructor(linejunk=null, charjunk=null)
          Construct a text differencer, with optional filters.
      compare(a, b)
          Compare two sequences of lines; generate the resulting delta.
    */


    function Differ(linejunk, charjunk) {
      this.linejunk = linejunk;
      this.charjunk = charjunk;
      /*
          Construct a text differencer, with optional filters.
      
          The two optional keyword parameters are for filter functions:
      
          - `linejunk`: A function that should accept a single string argument,
            and return true iff the string is junk. The module-level function
            `IS_LINE_JUNK` may be used to filter out lines without visible
            characters, except for at most one splat ('#').  It is recommended
            to leave linejunk null. 
      
          - `charjunk`: A function that should accept a string of length 1. The
            module-level function `IS_CHARACTER_JUNK` may be used to filter out
            whitespace characters (a blank or tab; **note**: bad idea to include
            newline in this!).  Use of IS_CHARACTER_JUNK is recommended.
      */

    }

    Differ.prototype.compare = function(a, b) {
      /*
          Compare two sequences of lines; generate the resulting delta.
      
          Each sequence must contain individual single-line strings ending with
          newlines. Such sequences can be obtained from the `readlines()` method
          of file-like objects.  The delta generated also consists of newline-
          terminated strings, ready to be printed as-is via the writeline()
          method of a file-like object.
      
          Example:
      
          >>> d = new Differ
          >>> d.compare(['one\n', 'two\n', 'three\n'],
          ...           ['ore\n', 'tree\n', 'emu\n'])
          [ '- one\n',
            '?  ^\n',
            '+ ore\n',
            '?  ^\n',
            '- two\n',
            '- three\n',
            '?  -\n',
            '+ tree\n',
            '+ emu\n' ]
      */

      var ahi, alo, bhi, blo, cruncher, g, line, lines, tag, _i, _j, _len, _len1, _ref, _ref1;
      cruncher = new SequenceMatcher(this.linejunk, a, b);
      lines = [];
      _ref = cruncher.getOpcodes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], tag = _ref1[0], alo = _ref1[1], ahi = _ref1[2], blo = _ref1[3], bhi = _ref1[4];
        switch (tag) {
          case 'replace':
            g = this._fancyReplace(a, alo, ahi, b, blo, bhi);
            break;
          case 'delete':
            g = this._dump('-', a, alo, ahi);
            break;
          case 'insert':
            g = this._dump('+', b, blo, bhi);
            break;
          case 'equal':
            g = this._dump(' ', a, alo, ahi);
            break;
          default:
            throw new Error("unknow tag (" + tag + ")");
        }
        for (_j = 0, _len1 = g.length; _j < _len1; _j++) {
          line = g[_j];
          lines.push(line);
        }
      }
      return lines;
    };

    Differ.prototype._dump = function(tag, x, lo, hi) {
      /*
          Generate comparison results for a same-tagged range.
      */

      var i, _i, _results;
      _results = [];
      for (i = _i = lo; lo <= hi ? _i < hi : _i > hi; i = lo <= hi ? ++_i : --_i) {
        _results.push("" + tag + " " + x[i]);
      }
      return _results;
    };

    Differ.prototype._plainReplace = function(a, alo, ahi, b, blo, bhi) {
      var first, g, line, lines, second, _i, _j, _len, _len1, _ref;
      assert(alo < ahi && blo < bhi);
      if (bhi - blo < ahi - alo) {
        first = this._dump('+', b, blo, bhi);
        second = this._dump('-', a, alo, ahi);
      } else {
        first = this._dump('-', a, alo, ahi);
        second = this._dump('+', b, blo, bhi);
      }
      lines = [];
      _ref = [first, second];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        g = _ref[_i];
        for (_j = 0, _len1 = g.length; _j < _len1; _j++) {
          line = g[_j];
          lines.push(line);
        }
      }
      return lines;
    };

    Differ.prototype._fancyReplace = function(a, alo, ahi, b, blo, bhi) {
      /*
          When replacing one block of lines with another, search the blocks
          for *similar* lines; the best-matching pair (if any) is used as a
          synch point, and intraline difference marking is done on the
          similar pair. Lots of work, but often worth it.
      
          Example:
          >>> d = new Differ
          >>> d._fancyReplace(['abcDefghiJkl\n'], 0, 1,
          ...                 ['abcdefGhijkl\n'], 0, 1)
          [ '- abcDefghiJkl\n',
            '?    ^  ^  ^\n',
            '+ abcdefGhijkl\n',
            '?    ^  ^  ^\n' ]
      */

      var aelt, ai, ai1, ai2, atags, belt, bestRatio, besti, bestj, bj, bj1, bj2, btags, cruncher, cutoff, eqi, eqj, i, j, la, lb, line, lines, tag, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _n, _o, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      _ref = [0.74, 0.75], bestRatio = _ref[0], cutoff = _ref[1];
      cruncher = new SequenceMatcher(this.charjunk);
      _ref1 = [null, null], eqi = _ref1[0], eqj = _ref1[1];
      lines = [];
      for (j = _i = blo; blo <= bhi ? _i < bhi : _i > bhi; j = blo <= bhi ? ++_i : --_i) {
        bj = b[j];
        cruncher.setSeq2(bj);
        for (i = _j = alo; alo <= ahi ? _j < ahi : _j > ahi; i = alo <= ahi ? ++_j : --_j) {
          ai = a[i];
          if (ai === bj) {
            if (eqi === null) {
              _ref2 = [i, j], eqi = _ref2[0], eqj = _ref2[1];
            }
            continue;
          }
          cruncher.setSeq1(ai);
          if (cruncher.realQuickRatio() > bestRatio && cruncher.quickRatio() > bestRatio && cruncher.ratio() > bestRatio) {
            _ref3 = [cruncher.ratio(), i, j], bestRatio = _ref3[0], besti = _ref3[1], bestj = _ref3[2];
          }
        }
      }
      if (bestRatio < cutoff) {
        if (eqi === null) {
          _ref4 = this._plainReplace(a, alo, ahi, b, blo, bhi);
          for (_k = 0, _len = _ref4.length; _k < _len; _k++) {
            line = _ref4[_k];
            lines.push(line);
          }
          return lines;
        }
        _ref5 = [eqi, eqj, 1.0], besti = _ref5[0], bestj = _ref5[1], bestRatio = _ref5[2];
      } else {
        eqi = null;
      }
      _ref6 = this._fancyHelper(a, alo, besti, b, blo, bestj);
      for (_l = 0, _len1 = _ref6.length; _l < _len1; _l++) {
        line = _ref6[_l];
        lines.push(line);
      }
      _ref7 = [a[besti], b[bestj]], aelt = _ref7[0], belt = _ref7[1];
      if (eqi === null) {
        atags = btags = '';
        cruncher.setSeqs(aelt, belt);
        _ref8 = cruncher.getOpcodes();
        for (_m = 0, _len2 = _ref8.length; _m < _len2; _m++) {
          _ref9 = _ref8[_m], tag = _ref9[0], ai1 = _ref9[1], ai2 = _ref9[2], bj1 = _ref9[3], bj2 = _ref9[4];
          _ref10 = [ai2 - ai1, bj2 - bj1], la = _ref10[0], lb = _ref10[1];
          switch (tag) {
            case 'replace':
              atags += Array(la + 1).join('^');
              btags += Array(lb + 1).join('^');
              break;
            case 'delete':
              atags += Array(la + 1).join('-');
              break;
            case 'insert':
              btags += Array(lb + 1).join('+');
              break;
            case 'equal':
              atags += Array(la + 1).join(' ');
              btags += Array(lb + 1).join(' ');
              break;
            default:
              throw new Error("unknow tag (" + tag + ")");
          }
        }
        _ref11 = this._qformat(aelt, belt, atags, btags);
        for (_n = 0, _len3 = _ref11.length; _n < _len3; _n++) {
          line = _ref11[_n];
          lines.push(line);
        }
      } else {
        lines.push('  ' + aelt);
      }
      _ref12 = this._fancyHelper(a, besti + 1, ahi, b, bestj + 1, bhi);
      for (_o = 0, _len4 = _ref12.length; _o < _len4; _o++) {
        line = _ref12[_o];
        lines.push(line);
      }
      return lines;
    };

    Differ.prototype._fancyHelper = function(a, alo, ahi, b, blo, bhi) {
      var g;
      g = [];
      if (alo < ahi) {
        if (blo < bhi) {
          g = this._fancyReplace(a, alo, ahi, b, blo, bhi);
        } else {
          g = this._dump('-', a, alo, ahi);
        }
      } else if (blo < bhi) {
        g = this._dump('+', b, blo, bhi);
      }
      return g;
    };

    Differ.prototype._qformat = function(aline, bline, atags, btags) {
      /*
          Format "?" output and deal with leading tabs.
      
          Example:
      
          >>> d = new Differ
          >>> d._qformat('\tabcDefghiJkl\n', '\tabcdefGhijkl\n',
          [ '- \tabcDefghiJkl\n',
            '? \t ^ ^  ^\n',
            '+ \tabcdefGhijkl\n',
            '? \t ^ ^  ^\n' ]
      */

      var common, lines;
      lines = [];
      common = min(_countLeading(aline, '\t'), _countLeading(bline, '\t'));
      common = min(common, _countLeading(atags.slice(0, common), ' '));
      common = min(common, _countLeading(btags.slice(0, common), ' '));
      atags = atags.slice(common).replace(/\s+$/, '');
      btags = btags.slice(common).replace(/\s+$/, '');
      lines.push('- ' + aline);
      if (atags.length) {
        lines.push("? " + (Array(common + 1).join('\t')) + atags + "\n");
      }
      lines.push('+ ' + bline);
      if (btags.length) {
        lines.push("? " + (Array(common + 1).join('\t')) + btags + "\n");
      }
      return lines;
    };

    return Differ;

  })();

  IS_LINE_JUNK = function(line, pat) {
    if (pat == null) {
      pat = /^\s*#?\s*$/;
    }
    /*
      Return 1 for ignorable line: iff `line` is blank or contains a single '#'.
        
      Examples:
    
      >>> IS_LINE_JUNK('\n')
      true
      >>> IS_LINE_JUNK('  #   \n')
      true
      >>> IS_LINE_JUNK('hello\n')
      false
    */

    return pat.test(line);
  };

  IS_CHARACTER_JUNK = function(ch, ws) {
    if (ws == null) {
      ws = ' \t';
    }
    /*
      Return 1 for ignorable character: iff `ch` is a space or tab.
    
      Examples:
      >>> IS_CHARACTER_JUNK(' ').should.be.true
      true
      >>> IS_CHARACTER_JUNK('\t').should.be.true
      true
      >>> IS_CHARACTER_JUNK('\n').should.be.false
      false
      >>> IS_CHARACTER_JUNK('x').should.be.false
      false
    */

    return __indexOf.call(ws, ch) >= 0;
  };

  _formatRangeUnified = function(start, stop) {
    /*
      Convert range to the "ed" format'
    */

    var beginning, length;
    beginning = start + 1;
    length = stop - start;
    if (length === 1) {
      return "" + beginning;
    }
    if (!length) {
      beginning--;
    }
    return "" + beginning + "," + length;
  };

  unifiedDiff = function(a, b, _arg) {
    var file1Range, file2Range, first, fromdate, fromfile, fromfiledate, group, i1, i2, j1, j2, last, line, lines, lineterm, n, started, tag, todate, tofile, tofiledate, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    _ref = _arg != null ? _arg : {}, fromfile = _ref.fromfile, tofile = _ref.tofile, fromfiledate = _ref.fromfiledate, tofiledate = _ref.tofiledate, n = _ref.n, lineterm = _ref.lineterm;
    /*
      Compare two sequences of lines; generate the delta as a unified diff.
    
      Unified diffs are a compact way of showing line changes and a few
      lines of context.  The number of context lines is set by 'n' which
      defaults to three.
    
      By default, the diff control lines (those with ---, +++, or @@) are
      created with a trailing newline.  
    
      For inputs that do not have trailing newlines, set the lineterm
      argument to "" so that the output will be uniformly newline free.
    
      The unidiff format normally has a header for filenames and modification
      times.  Any or all of these may be specified using strings for
      'fromfile', 'tofile', 'fromfiledate', and 'tofiledate'.
      The modification times are normally expressed in the ISO 8601 format.
    
      Example:
    
      >>> unifiedDiff('one two three four'.split(' '),
      ...             'zero one tree four'.split(' '), {
      ...               fromfile: 'Original'
      ...               tofile: 'Current',
      ...               fromfiledate: '2005-01-26 23:30:50',
      ...               tofiledate: '2010-04-02 10:20:52',
      ...               lineterm: ''
      ...             })
      [ '--- Original\t2005-01-26 23:30:50',
        '+++ Current\t2010-04-02 10:20:52',
        '@@ -1,4 +1,4 @@',
        '+zero',
        ' one',
        '-two',
        '-three',
        '+tree',
        ' four' ]
    */

    if (fromfile == null) {
      fromfile = '';
    }
    if (tofile == null) {
      tofile = '';
    }
    if (fromfiledate == null) {
      fromfiledate = '';
    }
    if (tofiledate == null) {
      tofiledate = '';
    }
    if (n == null) {
      n = 3;
    }
    if (lineterm == null) {
      lineterm = '\n';
    }
    lines = [];
    started = false;
    _ref1 = (new SequenceMatcher(null, a, b)).getGroupedOpcodes();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      group = _ref1[_i];
      if (!started) {
        started = true;
        fromdate = fromfiledate ? "\t" + fromfiledate : '';
        todate = tofiledate ? "\t" + tofiledate : '';
        lines.push("--- " + fromfile + fromdate + lineterm);
        lines.push("+++ " + tofile + todate + lineterm);
      }
      _ref2 = [group[0], group[group.length - 1]], first = _ref2[0], last = _ref2[1];
      file1Range = _formatRangeUnified(first[1], last[2]);
      file2Range = _formatRangeUnified(first[3], last[4]);
      lines.push("@@ -" + file1Range + " +" + file2Range + " @@" + lineterm);
      for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
        _ref3 = group[_j], tag = _ref3[0], i1 = _ref3[1], i2 = _ref3[2], j1 = _ref3[3], j2 = _ref3[4];
        if (tag === 'equal') {
          _ref4 = a.slice(i1, i2);
          for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
            line = _ref4[_k];
            lines.push(' ' + line);
          }
          continue;
        }
        if (tag === 'replace' || tag === 'delete') {
          _ref5 = a.slice(i1, i2);
          for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
            line = _ref5[_l];
            lines.push('-' + line);
          }
        }
        if (tag === 'replace' || tag === 'insert') {
          _ref6 = b.slice(j1, j2);
          for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
            line = _ref6[_m];
            lines.push('+' + line);
          }
        }
      }
    }
    return lines;
  };

  _formatRangeContext = function(start, stop) {
    /*
      Convert range to the "ed" format'
    */

    var beginning, length;
    beginning = start + 1;
    length = stop - start;
    if (!length) {
      beginning--;
    }
    if (length <= 1) {
      return "" + beginning;
    }
    return "" + beginning + "," + (beginning + length - 1);
  };

  contextDiff = function(a, b, _arg) {
    var file1Range, file2Range, first, fromdate, fromfile, fromfiledate, group, i1, i2, j1, j2, last, line, lines, lineterm, n, prefix, started, tag, todate, tofile, tofiledate, _, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    _ref = _arg != null ? _arg : {}, fromfile = _ref.fromfile, tofile = _ref.tofile, fromfiledate = _ref.fromfiledate, tofiledate = _ref.tofiledate, n = _ref.n, lineterm = _ref.lineterm;
    /*
      Compare two sequences of lines; generate the delta as a context diff.
    
      Context diffs are a compact way of showing line changes and a few
      lines of context.  The number of context lines is set by 'n' which
      defaults to three.
    
      By default, the diff control lines (those with *** or ---) are
      created with a trailing newline.  This is helpful so that inputs
      created from file.readlines() result in diffs that are suitable for
      file.writelines() since both the inputs and outputs have trailing
      newlines.
    
      For inputs that do not have trailing newlines, set the lineterm
      argument to "" so that the output will be uniformly newline free.
    
      The context diff format normally has a header for filenames and
      modification times.  Any or all of these may be specified using
      strings for 'fromfile', 'tofile', 'fromfiledate', and 'tofiledate'.
      The modification times are normally expressed in the ISO 8601 format.
      If not specified, the strings default to blanks.
    
      Example:
      >>> a = ['one\n', 'two\n', 'three\n', 'four\n']
      >>> b = ['zero\n', 'one\n', 'tree\n', 'four\n']
      >>> contextDiff(a, b, {fromfile: 'Original', tofile: 'Current'})
      [ '*** Original\n',
        '--- Current\n',
        '***************\n',
        '*** 1,4 ****\n',
        '  one\n',
        '! two\n',
        '! three\n',
        '  four\n',
        '--- 1,4 ----\n',
        '+ zero\n',
        '  one\n',
        '! tree\n',
        '  four\n' ]
    */

    if (fromfile == null) {
      fromfile = '';
    }
    if (tofile == null) {
      tofile = '';
    }
    if (fromfiledate == null) {
      fromfiledate = '';
    }
    if (tofiledate == null) {
      tofiledate = '';
    }
    if (n == null) {
      n = 3;
    }
    if (lineterm == null) {
      lineterm = '\n';
    }
    prefix = {
      insert: '+ ',
      "delete": '- ',
      replace: '! ',
      equal: '  '
    };
    started = false;
    lines = [];
    _ref1 = (new SequenceMatcher(null, a, b)).getGroupedOpcodes();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      group = _ref1[_i];
      if (!started) {
        started = true;
        fromdate = fromfiledate ? "\t" + fromfiledate : '';
        todate = tofiledate ? "\t" + tofiledate : '';
        lines.push("*** " + fromfile + fromdate + lineterm);
        lines.push("--- " + tofile + todate + lineterm);
        _ref2 = [group[0], group[group.length - 1]], first = _ref2[0], last = _ref2[1];
        lines.push('***************' + lineterm);
        file1Range = _formatRangeContext(first[1], last[2]);
        lines.push("*** " + file1Range + " ****" + lineterm);
        if (_any((function() {
          var _j, _len1, _ref3, _results;
          _results = [];
          for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
            _ref3 = group[_j], tag = _ref3[0], _ = _ref3[1], _ = _ref3[2], _ = _ref3[3], _ = _ref3[4];
            _results.push(tag === 'replace' || tag === 'delete');
          }
          return _results;
        })())) {
          for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
            _ref3 = group[_j], tag = _ref3[0], i1 = _ref3[1], i2 = _ref3[2], _ = _ref3[3], _ = _ref3[4];
            if (tag !== 'insert') {
              _ref4 = a.slice(i1, i2);
              for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
                line = _ref4[_k];
                lines.push(prefix[tag] + line);
              }
            }
          }
        }
        file2Range = _formatRangeContext(first[3], last[4]);
        lines.push("--- " + file2Range + " ----" + lineterm);
        if (_any((function() {
          var _l, _len3, _ref5, _results;
          _results = [];
          for (_l = 0, _len3 = group.length; _l < _len3; _l++) {
            _ref5 = group[_l], tag = _ref5[0], _ = _ref5[1], _ = _ref5[2], _ = _ref5[3], _ = _ref5[4];
            _results.push(tag === 'replace' || tag === 'insert');
          }
          return _results;
        })())) {
          for (_l = 0, _len3 = group.length; _l < _len3; _l++) {
            _ref5 = group[_l], tag = _ref5[0], _ = _ref5[1], _ = _ref5[2], j1 = _ref5[3], j2 = _ref5[4];
            if (tag !== 'delete') {
              _ref6 = b.slice(j1, j2);
              for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
                line = _ref6[_m];
                lines.push(prefix[tag] + line);
              }
            }
          }
        }
      }
    }
    return lines;
  };

  ndiff = function(a, b, linejunk, charjunk) {
    if (charjunk == null) {
      charjunk = IS_CHARACTER_JUNK;
    }
    /*
      Compare `a` and `b` (lists of strings); return a `Differ`-style delta.
    
      Optional keyword parameters `linejunk` and `charjunk` are for filter
      functions (or None):
    
      - linejunk: A function that should accept a single string argument, and
        return true iff the string is junk.  The default is null, and is
        recommended; 
    
      - charjunk: A function that should accept a string of length 1. The
        default is module-level function IS_CHARACTER_JUNK, which filters out
        whitespace characters (a blank or tab; note: bad idea to include newline
        in this!).
    
      Example:
      >>> a = ['one\n', 'two\n', 'three\n']
      >>> b = ['ore\n', 'tree\n', 'emu\n']
      >>> ndiff(a, b)
      [ '- one\n',
        '?  ^\n',
        '+ ore\n',
        '?  ^\n',
        '- two\n',
        '- three\n',
        '?  -\n',
        '+ tree\n',
        '+ emu\n' ]
    */

    return (new Differ(linejunk, charjunk)).compare(a, b);
  };

  restore = function(delta, which) {
    /*
      Generate one of the two sequences that generated a delta.
    
      Given a `delta` produced by `Differ.compare()` or `ndiff()`, extract
      lines originating from file 1 or 2 (parameter `which`), stripping off line
      prefixes.
    
      Examples:
      >>> a = ['one\n', 'two\n', 'three\n']
      >>> b = ['ore\n', 'tree\n', 'emu\n']
      >>> diff = ndiff(a, b)
      >>> restore(diff, 1)
      [ 'one\n',
        'two\n',
        'three\n' ]
      >>> restore(diff, 2)
      [ 'ore\n',
        'tree\n',
        'emu\n' ]
    */

    var line, lines, prefixes, tag, _i, _len, _ref;
    tag = {
      1: '- ',
      2: '+ '
    }[which];
    if (!tag) {
      throw new Error("unknow delta choice (must be 1 or 2): " + which);
    }
    prefixes = ['  ', tag];
    lines = [];
    for (_i = 0, _len = delta.length; _i < _len; _i++) {
      line = delta[_i];
      if (_ref = line.slice(0, 2), __indexOf.call(prefixes, _ref) >= 0) {
        lines.push(line.slice(2));
      }
    }
    return lines;
  };

  exports._arrayCmp = _arrayCmp;

  exports.SequenceMatcher = SequenceMatcher;

  exports.getCloseMatches = getCloseMatches;

  exports._countLeading = _countLeading;

  exports.Differ = Differ;

  exports.IS_LINE_JUNK = IS_LINE_JUNK;

  exports.IS_CHARACTER_JUNK = IS_CHARACTER_JUNK;

  exports._formatRangeUnified = _formatRangeUnified;

  exports.unifiedDiff = unifiedDiff;

  exports._formatRangeContext = _formatRangeContext;

  exports.contextDiff = contextDiff;

  exports.ndiff = ndiff;

  exports.restore = restore;

}).call(this);


/***/ }),

/***/ 1128:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear



var value = __nccwpck_require__(5282);

module.exports = function () {
	value(this).length = 0;
	return this;
};


/***/ }),

/***/ 2324:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var numberIsNaN       = __nccwpck_require__(6881)
  , toPosInt          = __nccwpck_require__(3755)
  , value             = __nccwpck_require__(5282)
  , indexOf           = Array.prototype.indexOf
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , abs               = Math.abs
  , floor             = Math.floor;

module.exports = function (searchElement /*, fromIndex*/) {
	var i, length, fromIndex, val;
	if (!numberIsNaN(searchElement)) return indexOf.apply(this, arguments);

	length = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < length; ++i) {
		if (objHasOwnProperty.call(this, i)) {
			val = this[i];
			if (numberIsNaN(val)) return i; // Jslint: ignore
		}
	}
	return -1;
};


/***/ }),

/***/ 8137:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var toPosInt          = __nccwpck_require__(3755)
  , callable          = __nccwpck_require__(6097)
  , value             = __nccwpck_require__(5282)
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , call              = Function.prototype.call;

module.exports = function (cb /*, thisArg*/) {
	var i, self, thisArg;

	self = Object(value(this));
	callable(cb);
	thisArg = arguments[1];

	for (i = toPosInt(self.length) - 1; i >= 0; --i) {
		if (objHasOwnProperty.call(self, i)) call.call(cb, thisArg, self[i], i, self);
	}
};


/***/ }),

/***/ 5684:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var indexOf = __nccwpck_require__(2324)
  , filter  = Array.prototype.filter
  , isFirst;

isFirst = function (value, index) { return indexOf.call(this, value) === index; };

module.exports = function () { return filter.call(this, isFirst, this); };


/***/ }),

/***/ 2406:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(6619)() ? Array.from : __nccwpck_require__(8049);


/***/ }),

/***/ 6619:
/***/ ((module) => {



module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== "function") return false;
	arr = ["raz", "dwa"];
	result = from(arr);
	return Boolean(result && result !== arr && result[1] === "dwa");
};


/***/ }),

/***/ 8049:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var iteratorSymbol = (__nccwpck_require__(1228).iterator)
  , isArguments    = __nccwpck_require__(1375)
  , isFunction     = __nccwpck_require__(1003)
  , toPosInt       = __nccwpck_require__(3755)
  , callable       = __nccwpck_require__(6097)
  , validValue     = __nccwpck_require__(5282)
  , isValue        = __nccwpck_require__(2285)
  , isString       = __nccwpck_require__(5624)
  , isArray        = Array.isArray
  , call           = Function.prototype.call
  , desc           = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

// eslint-disable-next-line complexity, max-lines-per-function
module.exports = function (arrayLike /*, mapFn, thisArg*/) {
	var mapFn = arguments[1]
	  , thisArg = arguments[2]
	  , Context
	  , i
	  , j
	  , arr
	  , length
	  , code
	  , iterator
	  , result
	  , getIterator
	  , value;

	arrayLike = Object(validValue(arrayLike));

	if (isValue(mapFn)) callable(mapFn);
	if (!this || this === Array || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				length = arrayLike.length;
				if (length !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array((length = arrayLike.length));
				for (i = 0; i < length; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Context = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Context) arr = new Context();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, i, desc);
				} else {
					arr[i] = value;
				}
				result = iterator.next();
				++i;
			}
			length = i;
		} else if (isString(arrayLike)) {
			// Source: String
			length = arrayLike.length;
			if (Context) arr = new Context();
			for (i = 0, j = 0; i < length; ++i) {
				value = arrayLike[i];
				if (i + 1 < length) {
					code = value.charCodeAt(0);
					// eslint-disable-next-line max-depth
					if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, j, desc);
				} else {
					arr[j] = value;
				}
				++j;
			}
			length = j;
		}
	}
	if (length === undefined) {
		// Source: array or array-like
		length = toPosInt(arrayLike.length);
		if (Context) arr = new Context(length);
		for (i = 0; i < length; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (Context) {
				desc.value = value;
				defineProperty(arr, i, desc);
			} else {
				arr[i] = value;
			}
		}
	}
	if (Context) {
		desc.value = null;
		arr.length = length;
	}
	return arr;
};


/***/ }),

/***/ 2906:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var toPosInt = __nccwpck_require__(3755)
  , value    = __nccwpck_require__(5282)
  , slice    = Array.prototype.slice;

module.exports = function (length /*, …fill*/) {
	var arr, currentLength;
	length = toPosInt(value(length));
	if (length === 0) return [];

	arr = arguments.length < 2 ? [undefined] : slice.call(arguments, 1, 1 + length);

	while ((currentLength = arr.length) < length) {
		arr = arr.concat(arr.slice(0, length - currentLength));
	}
	return arr;
};


/***/ }),

/***/ 2353:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var from    = __nccwpck_require__(2406)
  , isArray = Array.isArray;

module.exports = function (arrayLike) { return isArray(arrayLike) ? arrayLike : from(arrayLike); };


/***/ }),

/***/ 9684:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var assign            = __nccwpck_require__(1377)
  , isObject          = __nccwpck_require__(1380)
  , isValue           = __nccwpck_require__(2285)
  , captureStackTrace = Error.captureStackTrace;

module.exports = function (message /*, code, ext*/) {
	var err = new Error(message), code = arguments[1], ext = arguments[2];
	if (!isValue(ext)) {
		if (isObject(code)) {
			ext = code;
			code = null;
		}
	}
	if (isValue(ext)) assign(err, ext);
	if (isValue(code)) err.code = code;
	if (captureStackTrace) captureStackTrace(err, module.exports);
	return err;
};


/***/ }),

/***/ 4274:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue  = __nccwpck_require__(2285)
  , callable = __nccwpck_require__(6097)
  , aFrom    = __nccwpck_require__(2406);

var apply = Function.prototype.apply
  , call = Function.prototype.call
  , callFn = function (arg, fn) { return call.call(fn, this, arg); };

module.exports = function (fnIgnored /*, …fnn*/) {
	var fns, first;
	var args = aFrom(arguments);
	fns = isValue(this) ? [this].concat(args) : args;
	fns.forEach(callable);
	fns = fns.reverse();
	first = fns[0];
	fns = fns.slice(1);
	return function (argIgnored) { return fns.reduce(callFn, apply.call(first, this, arguments)); };
};


/***/ }),

/***/ 1490:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var toPosInt = __nccwpck_require__(3755);

var test = function (arg1, arg2) { return arg2; };

var desc, defineProperty, generate, mixin;

try {
	Object.defineProperty(test, "length", {
		configurable: true,
		writable: false,
		enumerable: false,
		value: 1
	});
}
catch (ignore) {}

if (test.length === 1) {
	// ES6
	desc = { configurable: true, writable: false, enumerable: false };
	defineProperty = Object.defineProperty;
	module.exports = function (fn, length) {
		length = toPosInt(length);
		if (fn.length === length) return fn;
		desc.value = length;
		return defineProperty(fn, "length", desc);
	};
} else {
	mixin = __nccwpck_require__(1070);
	generate = (function () {
		var cache = [];
		return function (length) {
			var args, i = 0;
			if (cache[length]) return cache[length];
			args = [];
			while (length--) args.push("a" + (++i).toString(36));
			// eslint-disable-next-line no-new-func
			return new Function(
				"fn",
				"return function (" + args.join(", ") + ") { return fn.apply(this, arguments); };"
			);
		};
	})();
	module.exports = function (src, length) {
		var target;
		length = toPosInt(length);
		if (src.length === length) return src;
		target = generate(length)(src);
		try { mixin(target, src); }
		catch (ignore) {}
		return target;
	};
}


/***/ }),

/***/ 1375:
/***/ ((module) => {



var objToString = Object.prototype.toString
  , id = objToString.call((function () { return arguments; })());

module.exports = function (value) { return objToString.call(value) === id; };


/***/ }),

/***/ 1003:
/***/ ((module) => {



var objToString = Object.prototype.toString
  , isFunctionStringTag = RegExp.prototype.test.bind(/^[object [A-Za-z0-9]*Function]$/);

module.exports = function (value) {
	return typeof value === "function" && isFunctionStringTag(objToString.call(value));
};


/***/ }),

/***/ 6049:
/***/ ((module) => {



// eslint-disable-next-line no-empty-function
module.exports = function () {};


/***/ }),

/***/ 2024:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var iteratorSymbol = (__nccwpck_require__(1228).iterator)
  , isValue        = __nccwpck_require__(2285)
  , isArrayLike    = __nccwpck_require__(3416);

module.exports = function (value) {
	if (!isValue(value)) return false;
	if (typeof value[iteratorSymbol] === "function") return true;
	return isArrayLike(value);
};


/***/ }),

/***/ 3205:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isObject = __nccwpck_require__(1380)
  , is       = __nccwpck_require__(2024);

module.exports = function (value) {
	if (is(value) && isObject(value)) return value;
	throw new TypeError(value + " is not an iterable or array-like object");
};


/***/ }),

/***/ 2293:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(1492)() ? Math.sign : __nccwpck_require__(8745);


/***/ }),

/***/ 1492:
/***/ ((module) => {



module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== "function") return false;
	return sign(10) === 1 && sign(-20) === -1;
};


/***/ }),

/***/ 8745:
/***/ ((module) => {



module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || value === 0) return value;
	return value > 0 ? 1 : -1;
};


/***/ }),

/***/ 9394:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(9019)() ? Math.trunc : __nccwpck_require__(5707);


/***/ }),

/***/ 9019:
/***/ ((module) => {



module.exports = function () {
	var trunc = Math.trunc;
	if (typeof trunc !== "function") return false;
	return trunc(13.67) === 13 && trunc(-13.67) === -13;
};


/***/ }),

/***/ 5707:
/***/ ((module) => {



var floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return NaN;
	value = Number(value);
	if (value === 0) return value;
	if (value === Infinity) return Infinity;
	if (value === -Infinity) return -Infinity;
	if (value > 0) return floor(value);
	return -floor(-value);
};


/***/ }),

/***/ 6881:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(5587)() ? Number.isNaN : __nccwpck_require__(3259);


/***/ }),

/***/ 5587:
/***/ ((module) => {



module.exports = function () {
	var numberIsNaN = Number.isNaN;
	if (typeof numberIsNaN !== "function") return false;
	return !numberIsNaN({}) && numberIsNaN(NaN) && !numberIsNaN(34);
};


/***/ }),

/***/ 3259:
/***/ ((module) => {



module.exports = function (value) {
	// eslint-disable-next-line no-self-compare
	return value !== value;
};


/***/ }),

/***/ 9836:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var sign  = __nccwpck_require__(2293)
  , abs   = Math.abs
  , floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if (value === 0 || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};


/***/ }),

/***/ 3755:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var toInteger = __nccwpck_require__(9836)
  , max       = Math.max;

module.exports = function (value) { return max(0, toInteger(value)); };


/***/ }),

/***/ 7175:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order



var callable                = __nccwpck_require__(6097)
  , value                   = __nccwpck_require__(5282)
  , bind                    = Function.prototype.bind
  , call                    = Function.prototype.call
  , keys                    = Object.keys
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb /*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== "function") method = list[method];
		return call.call(method, list, function (key, index) {
			if (!objPropertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};


/***/ }),

/***/ 1377:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(8732)() ? Object.assign : __nccwpck_require__(7795);


/***/ }),

/***/ 8732:
/***/ ((module) => {



module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
};


/***/ }),

/***/ 7795:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var keys  = __nccwpck_require__(8336)
  , value = __nccwpck_require__(5282)
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};


/***/ }),

/***/ 3382:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var aFrom  = __nccwpck_require__(2406)
  , assign = __nccwpck_require__(1377)
  , value  = __nccwpck_require__(5282);

module.exports = function (obj /*, propertyNames, options*/) {
	var copy = Object(value(obj)), propertyNames = arguments[1], options = Object(arguments[2]);
	if (copy !== obj && !propertyNames) return copy;
	var result = {};
	if (propertyNames) {
		aFrom(propertyNames, function (propertyName) {
			if (options.ensure || propertyName in obj) result[propertyName] = obj[propertyName];
		});
	} else {
		assign(result, obj);
	}
	return result;
};


/***/ }),

/***/ 8465:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Workaround for http://code.google.com/p/v8/issues/detail?id=2804



var create = Object.create, shim;

if (!__nccwpck_require__(3579)()) {
	shim = __nccwpck_require__(5410);
}

module.exports = (function () {
	var nullObject, polyProps, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	polyProps = {};
	desc = { configurable: false, enumerable: false, writable: true, value: undefined };
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === "__proto__") {
			polyProps[name] = {
				configurable: true,
				enumerable: false,
				writable: true,
				value: undefined
			};
			return;
		}
		polyProps[name] = desc;
	});
	Object.defineProperties(nullObject, polyProps);

	Object.defineProperty(shim, "nullPolyfill", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: nullObject
	});

	return function (prototype, props) {
		return create(prototype === null ? nullObject : prototype, props);
	};
})();


/***/ }),

/***/ 7726:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var value                   = __nccwpck_require__(5282)
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (obj) {
	var i;
	value(obj);
	for (i in obj) {
		if (objPropertyIsEnumerable.call(obj, i)) return i;
	}
	return null;
};


/***/ }),

/***/ 9575:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(7175)("forEach");


/***/ }),

/***/ 3416:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isFunction = __nccwpck_require__(1003)
  , isObject   = __nccwpck_require__(1380)
  , isValue    = __nccwpck_require__(2285);

module.exports = function (value) {
	return (
		(isValue(value) &&
			typeof value.length === "number" &&
			// Just checking ((typeof x === 'object') && (typeof x !== 'function'))
			// won't work right for some cases, e.g.:
			// type of instance of NodeList in Safari is a 'function'
			((isObject(value) && !isFunction(value)) || typeof value === "string")) ||
		false
	);
};


/***/ }),

/***/ 1448:
/***/ ((module) => {

// Deprecated



module.exports = function (obj) { return typeof obj === "function"; };


/***/ }),

/***/ 1380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue = __nccwpck_require__(2285);

var map = { function: true, object: true };

module.exports = function (value) { return (isValue(value) && map[typeof value]) || false; };


/***/ }),

/***/ 2285:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var _undefined = __nccwpck_require__(6049)(); // Support ES3 engines

module.exports = function (val) { return val !== _undefined && val !== null; };


/***/ }),

/***/ 8336:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(7491)() ? Object.keys : __nccwpck_require__(3890);


/***/ }),

/***/ 7491:
/***/ ((module) => {



module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};


/***/ }),

/***/ 3890:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue = __nccwpck_require__(2285);

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };


/***/ }),

/***/ 7289:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var callable = __nccwpck_require__(6097)
  , forEach  = __nccwpck_require__(9575)
  , call     = Function.prototype.call;

module.exports = function (obj, cb /*, thisArg*/) {
	var result = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, targetObj, index) {
		result[key] = call.call(cb, thisArg, value, key, targetObj, index);
	});
	return result;
};


/***/ }),

/***/ 1070:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var value                    = __nccwpck_require__(5282)
  , defineProperty           = Object.defineProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
  , getOwnPropertyNames      = Object.getOwnPropertyNames
  , getOwnPropertySymbols    = Object.getOwnPropertySymbols;

module.exports = function (target, source) {
	var error, sourceObject = Object(value(source));
	target = Object(value(target));
	getOwnPropertyNames(sourceObject).forEach(function (name) {
		try {
			defineProperty(target, name, getOwnPropertyDescriptor(source, name));
		} catch (e) { error = e; }
	});
	if (typeof getOwnPropertySymbols === "function") {
		getOwnPropertySymbols(sourceObject).forEach(function (symbol) {
			try {
				defineProperty(target, symbol, getOwnPropertyDescriptor(source, symbol));
			} catch (e) { error = e; }
		});
	}
	if (error !== undefined) throw error;
	return target;
};


/***/ }),

/***/ 4488:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue = __nccwpck_require__(2285);

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};


/***/ }),

/***/ 2796:
/***/ ((module) => {



var forEach = Array.prototype.forEach, create = Object.create;

// eslint-disable-next-line no-unused-vars
module.exports = function (arg /*, …args*/) {
	var set = create(null);
	forEach.call(arguments, function (name) { set[name] = true; });
	return set;
};


/***/ }),

/***/ 7165:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(3579)() ? Object.setPrototypeOf : __nccwpck_require__(5410);


/***/ }),

/***/ 3579:
/***/ ((module) => {



var create = Object.create, getPrototypeOf = Object.getPrototypeOf, plainObject = {};

module.exports = function (/* CustomCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf, customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== "function") return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
};


/***/ }),

/***/ 5410:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint no-proto: "off" */

// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554



var isObject         = __nccwpck_require__(1380)
  , value            = __nccwpck_require__(5282)
  , objIsPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty   = Object.defineProperty
  , nullDesc         = { configurable: true, enumerable: false, writable: true, value: undefined }
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if (prototype === null || isObject(prototype)) return obj;
	throw new TypeError("Prototype must be null or an object");
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = objIsPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, "__proto__", nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, "level", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: status.level
	});
})(
	(function () {
		var tmpObj1 = Object.create(null)
		  , tmpObj2 = {}
		  , set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(tmpObj1, tmpObj2);
			} catch (ignore) {}
			if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { set: set, level: 2 };
		}

		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 2 };

		tmpObj1 = {};
		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 1 };

		return false;
	})()
);

__nccwpck_require__(8465);


/***/ }),

/***/ 6097:
/***/ ((module) => {



module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};


/***/ }),

/***/ 6561:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isObject = __nccwpck_require__(1380);

module.exports = function (value) {
	if (!isObject(value)) throw new TypeError(value + " is not an Object");
	return value;
};


/***/ }),

/***/ 5282:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue = __nccwpck_require__(2285);

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};


/***/ }),

/***/ 8080:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var ensureValue   = __nccwpck_require__(5282)
  , stringifiable = __nccwpck_require__(1481);

module.exports = function (value) { return stringifiable(ensureValue(value)); };


/***/ }),

/***/ 1481:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isCallable = __nccwpck_require__(1448);

module.exports = function (stringifiable) {
	try {
		if (stringifiable && isCallable(stringifiable.toString)) return stringifiable.toString();
		return String(stringifiable);
	} catch (e) {
		throw new TypeError("Passed argument cannot be stringifed");
	}
};


/***/ }),

/***/ 3949:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isCallable = __nccwpck_require__(1448);

module.exports = function (value) {
	try {
		if (value && isCallable(value.toString)) return value.toString();
		return String(value);
	} catch (e) {
		return "<Non-coercible to string value>";
	}
};


/***/ }),

/***/ 7689:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(9710)() ? String.prototype.contains : __nccwpck_require__(1706);


/***/ }),

/***/ 9710:
/***/ ((module) => {



var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return str.contains("dwa") === true && str.contains("foo") === false;
};


/***/ }),

/***/ 1706:
/***/ ((module) => {



var indexOf = String.prototype.indexOf;

module.exports = function (searchString /*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};


/***/ }),

/***/ 5650:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(4403)() ? String.prototype.repeat : __nccwpck_require__(5076);


/***/ }),

/***/ 4403:
/***/ ((module) => {



var str = "foo";

module.exports = function () {
	if (typeof str.repeat !== "function") return false;
	return str.repeat(2) === "foofoo";
};


/***/ }),

/***/ 5076:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Thanks
// @rauchma http://www.2ality.com/2014/01/efficient-string-repeat.html
// @mathiasbynens https://github.com/mathiasbynens/String.prototype.repeat/blob/4a4b567def/repeat.js



var value     = __nccwpck_require__(5282)
  , toInteger = __nccwpck_require__(9836);

module.exports = function (count) {
	var str = String(value(this)), result;
	count = toInteger(count);
	if (count < 0) throw new RangeError("Count must be >= 0");
	if (!isFinite(count)) throw new RangeError("Count must be < ∞");

	result = "";
	while (count) {
		if (count % 2) result += str;
		if (count > 1) str += str;
		// eslint-disable-next-line no-bitwise
		count >>= 1;
	}
	return result;
};


/***/ }),

/***/ 5624:
/***/ ((module) => {



var objToString = Object.prototype.toString, id = objToString.call("");

module.exports = function (value) {
	return (
		typeof value === "string" ||
		(value &&
			typeof value === "object" &&
			(value instanceof String || objToString.call(value) === id)) ||
		false
	);
};


/***/ }),

/***/ 3298:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var safeToString = __nccwpck_require__(3949);

var reNewLine = /[\n\r\u2028\u2029]/g;

module.exports = function (value) {
	var string = safeToString(value);
	// Trim if too long
	if (string.length > 100) string = string.slice(0, 99) + "…";
	// Replace eventual new lines
	string = string.replace(reNewLine, function (char) {
		return JSON.stringify(char).slice(1, -1);
	});
	return string;
};


/***/ }),

/***/ 3254:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var setPrototypeOf = __nccwpck_require__(7165)
  , contains       = __nccwpck_require__(7689)
  , d              = __nccwpck_require__(4571)
  , Symbol         = __nccwpck_require__(1228)
  , Iterator       = __nccwpck_require__(4580);

var defineProperty = Object.defineProperty, ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) throw new TypeError("Constructor requires 'new'");
	Iterator.call(this, arr);
	if (!kind) kind = "value";
	else if (contains.call(kind, "key+value")) kind = "key+value";
	else if (contains.call(kind, "key")) kind = "key";
	else kind = "value";
	defineProperty(this, "__kind__", d("", kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete ArrayIterator.prototype.constructor;

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	_resolve: d(function (i) {
		if (this.__kind__ === "value") return this.__list__[i];
		if (this.__kind__ === "key+value") return [i, this.__list__[i]];
		return i;
	})
});
defineProperty(ArrayIterator.prototype, Symbol.toStringTag, d("c", "Array Iterator"));


/***/ }),

/***/ 6756:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isArguments = __nccwpck_require__(1375)
  , callable    = __nccwpck_require__(6097)
  , isString    = __nccwpck_require__(5624)
  , get         = __nccwpck_require__(5561);

var isArray = Array.isArray, call = Function.prototype.call, some = Array.prototype.some;

module.exports = function (iterable, cb /*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, length, char, code;
	if (isArray(iterable) || isArguments(iterable)) mode = "array";
	else if (isString(iterable)) mode = "string";
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () {
		broken = true;
	};
	if (mode === "array") {
		some.call(iterable, function (value) {
			call.call(cb, thisArg, value, doBreak);
			return broken;
		});
		return;
	}
	if (mode === "string") {
		length = iterable.length;
		for (i = 0; i < length; ++i) {
			char = iterable[i];
			if (i + 1 < length) {
				code = char.charCodeAt(0);
				if (code >= 0xd800 && code <= 0xdbff) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};


/***/ }),

/***/ 5561:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isArguments    = __nccwpck_require__(1375)
  , isString       = __nccwpck_require__(5624)
  , ArrayIterator  = __nccwpck_require__(3254)
  , StringIterator = __nccwpck_require__(999)
  , iterable       = __nccwpck_require__(7747)
  , iteratorSymbol = (__nccwpck_require__(1228).iterator);

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === "function") return obj[iteratorSymbol]();
	if (isArguments(obj)) return new ArrayIterator(obj);
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};


/***/ }),

/***/ 4580:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var clear    = __nccwpck_require__(1128)
  , assign   = __nccwpck_require__(1377)
  , callable = __nccwpck_require__(6097)
  , value    = __nccwpck_require__(5282)
  , d        = __nccwpck_require__(4571)
  , autoBind = __nccwpck_require__(6362)
  , Symbol   = __nccwpck_require__(1228);

var defineProperty = Object.defineProperty, defineProperties = Object.defineProperties, Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) throw new TypeError("Constructor requires 'new'");
	defineProperties(this, {
		__list__: d("w", value(list)),
		__context__: d("w", context),
		__nextIndex__: d("w", 0)
	});
	if (!context) return;
	callable(context.on);
	context.on("_add", this._onAdd);
	context.on("_delete", this._onDelete);
	context.on("_clear", this._onClear);
};

// Internal %IteratorPrototype% doesn't expose its constructor
delete Iterator.prototype.constructor;

defineProperties(
	Iterator.prototype,
	assign(
		{
			_next: d(function () {
				var i;
				if (!this.__list__) return undefined;
				if (this.__redo__) {
					i = this.__redo__.shift();
					if (i !== undefined) return i;
				}
				if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
				this._unBind();
				return undefined;
			}),
			next: d(function () {
				return this._createResult(this._next());
			}),
			_createResult: d(function (i) {
				if (i === undefined) return { done: true, value: undefined };
				return { done: false, value: this._resolve(i) };
			}),
			_resolve: d(function (i) {
				return this.__list__[i];
			}),
			_unBind: d(function () {
				this.__list__ = null;
				delete this.__redo__;
				if (!this.__context__) return;
				this.__context__.off("_add", this._onAdd);
				this.__context__.off("_delete", this._onDelete);
				this.__context__.off("_clear", this._onClear);
				this.__context__ = null;
			}),
			toString: d(function () {
				return "[object " + (this[Symbol.toStringTag] || "Object") + "]";
			})
		},
		autoBind({
			_onAdd: d(function (index) {
				if (index >= this.__nextIndex__) return;
				++this.__nextIndex__;
				if (!this.__redo__) {
					defineProperty(this, "__redo__", d("c", [index]));
					return;
				}
				this.__redo__.forEach(function (redo, i) {
					if (redo >= index) this.__redo__[i] = ++redo;
				}, this);
				this.__redo__.push(index);
			}),
			_onDelete: d(function (index) {
				var i;
				if (index >= this.__nextIndex__) return;
				--this.__nextIndex__;
				if (!this.__redo__) return;
				i = this.__redo__.indexOf(index);
				if (i !== -1) this.__redo__.splice(i, 1);
				this.__redo__.forEach(function (redo, j) {
					if (redo > index) this.__redo__[j] = --redo;
				}, this);
			}),
			_onClear: d(function () {
				if (this.__redo__) clear.call(this.__redo__);
				this.__nextIndex__ = 0;
			})
		})
	)
);

defineProperty(
	Iterator.prototype,
	Symbol.iterator,
	d(function () {
		return this;
	})
);


/***/ }),

/***/ 2811:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isArguments = __nccwpck_require__(1375)
  , isValue     = __nccwpck_require__(2285)
  , isString    = __nccwpck_require__(5624);

var iteratorSymbol = (__nccwpck_require__(1228).iterator)
  , isArray        = Array.isArray;

module.exports = function (value) {
	if (!isValue(value)) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	if (isArguments(value)) return true;
	return typeof value[iteratorSymbol] === "function";
};


/***/ }),

/***/ 999:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols



var setPrototypeOf = __nccwpck_require__(7165)
  , d              = __nccwpck_require__(4571)
  , Symbol         = __nccwpck_require__(1228)
  , Iterator       = __nccwpck_require__(4580);

var defineProperty = Object.defineProperty, StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) throw new TypeError("Constructor requires 'new'");
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, "__length__", d("", str.length));
};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete StringIterator.prototype.constructor;

StringIterator.prototype = Object.create(Iterator.prototype, {
	_next: d(function () {
		if (!this.__list__) return undefined;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
		return undefined;
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if (code >= 0xd800 && code <= 0xdbff) return char + this.__list__[this.__nextIndex__++];
		return char;
	})
});
defineProperty(StringIterator.prototype, Symbol.toStringTag, d("c", "String Iterator"));


/***/ }),

/***/ 7747:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isIterable = __nccwpck_require__(2811);

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};


/***/ }),

/***/ 1228:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(3338)()
	? (__nccwpck_require__(3407).Symbol)
	: __nccwpck_require__(4347);


/***/ }),

/***/ 3338:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var global     = __nccwpck_require__(3407)
  , validTypes = { object: true, symbol: true };

module.exports = function () {
	var Symbol = global.Symbol;
	var symbol;
	if (typeof Symbol !== "function") return false;
	symbol = Symbol("test symbol");
	try { String(symbol); }
	catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};


/***/ }),

/***/ 3880:
/***/ ((module) => {



module.exports = function (value) {
	if (!value) return false;
	if (typeof value === "symbol") return true;
	if (!value.constructor) return false;
	if (value.constructor.name !== "Symbol") return false;
	return value[value.constructor.toStringTag] === "Symbol";
};


/***/ }),

/***/ 7467:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var d = __nccwpck_require__(4571);

var create = Object.create, defineProperty = Object.defineProperty, objPrototype = Object.prototype;

var created = create(null);
module.exports = function (desc) {
	var postfix = 0, name, ie11BugWorkaround;
	while (created[desc + (postfix || "")]) ++postfix;
	desc += postfix || "";
	created[desc] = true;
	name = "@@" + desc;
	defineProperty(
		objPrototype,
		name,
		d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		})
	);
	return name;
};


/***/ }),

/***/ 2605:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var d            = __nccwpck_require__(4571)
  , NativeSymbol = (__nccwpck_require__(3407).Symbol);

module.exports = function (SymbolPolyfill) {
	return Object.defineProperties(SymbolPolyfill, {
		// To ensure proper interoperability with other native functions (e.g. Array.from)
		// fallback to eventual native implementation of given symbol
		hasInstance: d(
			"", (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill("hasInstance")
		),
		isConcatSpreadable: d(
			"",
			(NativeSymbol && NativeSymbol.isConcatSpreadable) ||
				SymbolPolyfill("isConcatSpreadable")
		),
		iterator: d("", (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill("iterator")),
		match: d("", (NativeSymbol && NativeSymbol.match) || SymbolPolyfill("match")),
		replace: d("", (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill("replace")),
		search: d("", (NativeSymbol && NativeSymbol.search) || SymbolPolyfill("search")),
		species: d("", (NativeSymbol && NativeSymbol.species) || SymbolPolyfill("species")),
		split: d("", (NativeSymbol && NativeSymbol.split) || SymbolPolyfill("split")),
		toPrimitive: d(
			"", (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill("toPrimitive")
		),
		toStringTag: d(
			"", (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill("toStringTag")
		),
		unscopables: d(
			"", (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill("unscopables")
		)
	});
};


/***/ }),

/***/ 4823:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var d              = __nccwpck_require__(4571)
  , validateSymbol = __nccwpck_require__(9371);

var registry = Object.create(null);

module.exports = function (SymbolPolyfill) {
	return Object.defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (registry[key]) return registry[key];
			return (registry[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (symbol) {
			var key;
			validateSymbol(symbol);
			for (key in registry) {
				if (registry[key] === symbol) return key;
			}
			return undefined;
		})
	});
};


/***/ }),

/***/ 4347:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// ES2015 Symbol polyfill for environments that do not (or partially) support it



var d                    = __nccwpck_require__(4571)
  , validateSymbol       = __nccwpck_require__(9371)
  , NativeSymbol         = (__nccwpck_require__(3407).Symbol)
  , generateName         = __nccwpck_require__(7467)
  , setupStandardSymbols = __nccwpck_require__(2605)
  , setupSymbolRegistry  = __nccwpck_require__(4823);

var create = Object.create
  , defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty;

var SymbolPolyfill, HiddenSymbol, isNativeSafe;

if (typeof NativeSymbol === "function") {
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
} else {
	NativeSymbol = null;
}

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError("Symbol is not a constructor");
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError("Symbol is not a constructor");
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = description === undefined ? "" : String(description);
	return defineProperties(symbol, {
		__description__: d("", description),
		__name__: d("", generateName(description))
	});
};

setupStandardSymbols(SymbolPolyfill);
setupSymbolRegistry(SymbolPolyfill);

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d("", function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return "Symbol (" + validateSymbol(this).__description__ + ")"; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(
	SymbolPolyfill.prototype,
	SymbolPolyfill.toPrimitive,
	d("", function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === "symbol") return symbol;
		return symbol.toString();
	})
);
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d("c", "Symbol"));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(
	HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d("c", SymbolPolyfill.prototype[SymbolPolyfill.toStringTag])
);

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(
	HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d("c", SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive])
);


/***/ }),

/***/ 9371:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isSymbol = __nccwpck_require__(3880);

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};


/***/ }),

/***/ 3647:
/***/ ((module, exports, __nccwpck_require__) => {



var d        = __nccwpck_require__(4571)
  , callable = __nccwpck_require__(6097)

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;


/***/ }),

/***/ 4053:
/***/ ((module) => {

var naiveFallback = function () {
	if (typeof self === "object" && self) return self;
	if (typeof window === "object" && window) return window;
	throw new Error("Unable to resolve global `this`");
};

module.exports = (function () {
	if (this) return this;

	// Unexpected strict mode (may happen if e.g. bundled into ESM module)

	// Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
	// In all ES5+ engines global object inherits from Object.prototype
	// (if you approached one that doesn't please report)
	try {
		Object.defineProperty(Object.prototype, "__global__", {
			get: function () { return this; },
			configurable: true
		});
	} catch (error) {
		// Unfortunate case of Object.prototype being sealed (via preventExtensions, seal or freeze)
		return naiveFallback();
	}
	try {
		// Safari case (window.__global__ is resolved with global context, but __global__ does not)
		if (!__global__) return naiveFallback();
		return __global__;
	} finally {
		delete Object.prototype.__global__;
	}
})();


/***/ }),

/***/ 3407:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(3831)() ? globalThis : __nccwpck_require__(4053);


/***/ }),

/***/ 3831:
/***/ ((module) => {



module.exports = function () {
	if (typeof globalThis !== "object") return false;
	if (!globalThis) return false;
	return globalThis.Array === Array;
};


/***/ }),

/***/ 6106:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(5177);


/***/ }),

/***/ 5177:
/***/ (function(module) {

// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else if (true) {
      return module.exports = factory();
    } else {}
  })(this, function() {
    return Heap;
  });

}).call(this);


/***/ }),

/***/ 8794:
/***/ ((module) => {

module.exports = isPromise;
module.exports["default"] = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}


/***/ }),

/***/ 8329:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const color = __nccwpck_require__(1047)

const { extendedTypeOf } = __nccwpck_require__(2356)

const Theme = {
  ' ' (s) { return s },
  '+': color.green,
  '-': color.red
}

const subcolorizeToCallback = function (options, key, diff, output, color, indent) {
  let subvalue
  const prefix = key ? `${key}: ` : ''
  const subindent = indent + '  '

  const outputElisions = (n) => {
    let maxElisions = options.maxElisions === undefined ? Infinity : options.maxElisions
    if (n < maxElisions) {
      for (let i = 0; i < n; i++) {
        output(' ', subindent + '...')
      }
    } else {
      output(' ', subindent + `... (${n} entries)`)
    }
  }

  switch (extendedTypeOf(diff)) {
    case 'object':
      if (('__old' in diff) && ('__new' in diff) && (Object.keys(diff).length === 2)) {
        subcolorizeToCallback(options, key, diff.__old, output, '-', indent)
        return subcolorizeToCallback(options, key, diff.__new, output, '+', indent)
      } else {
        output(color, `${indent}${prefix}{`)
        for (const subkey of Object.keys(diff)) {
          let m
          subvalue = diff[subkey]
          if ((m = subkey.match(/^(.*)__deleted$/))) {
            subcolorizeToCallback(options, m[1], subvalue, output, '-', subindent)
          } else if ((m = subkey.match(/^(.*)__added$/))) {
            subcolorizeToCallback(options, m[1], subvalue, output, '+', subindent)
          } else {
            subcolorizeToCallback(options, subkey, subvalue, output, color, subindent)
          }
        }
        return output(color, `${indent}}`)
      }

    case 'array': {
      output(color, `${indent}${prefix}[`)

      let looksLikeDiff = true
      for (const item of diff) {
        if ((extendedTypeOf(item) !== 'array') || !((item.length === 2) || ((item.length === 1) && (item[0] === ' '))) || !(typeof (item[0]) === 'string') || (item[0].length !== 1) || !([' ', '-', '+', '~'].includes(item[0]))) {
          looksLikeDiff = false
        }
      }

      if (looksLikeDiff) {
        let op
        let elisionCount = 0
        for ([op, subvalue] of diff) {
          if (op === ' ' && subvalue == null) {
            elisionCount++
          } else {
            if (elisionCount > 0) {
              outputElisions(elisionCount)
            }
            elisionCount = 0

            if (![' ', '~', '+', '-'].includes(op)) {
              throw new Error(`Unexpected op '${op}' in ${JSON.stringify(diff, null, 2)}`)
            }
            if (op === '~') { op = ' ' }
            subcolorizeToCallback(options, '', subvalue, output, op, subindent)
          }
        }
        if (elisionCount > 0) {
          outputElisions(elisionCount)
        }
      } else {
        for (subvalue of diff) {
          subcolorizeToCallback(options, '', subvalue, output, color, subindent)
        }
      }

      return output(color, `${indent}]`)
    }

    default:
      if (diff === 0 || diff === null || diff === false || diff === '' || diff) {
        return output(color, indent + prefix + JSON.stringify(diff))
      }
  }
}

const colorizeToCallback = (diff, options, output) =>
  subcolorizeToCallback(options, '', diff, output, ' ', '')

const colorizeToArray = function (diff, options = {}) {
  const output = []
  colorizeToCallback(diff, options, (color, line) => output.push(`${color}${line}`))
  return output
}

const colorize = function (diff, options = {}) {
  const output = []
  colorizeToCallback(diff, options, function (color, line) {
    if (options.color != null ? options.color : true) {
      return output.push(((options.theme != null ? options.theme[color] : undefined) != null ? (options.theme != null ? options.theme[color] : undefined) : Theme[color])(`${color}${line}`) + '\n')
    } else {
      return output.push(`${color}${line}\n`)
    }
  })
  return output.join('')
}

module.exports = { colorize, colorizeToArray, colorizeToCallback }


/***/ }),

/***/ 9031:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SequenceMatcher } = __nccwpck_require__(4087)
const { extendedTypeOf, roundObj } = __nccwpck_require__(2356)
const { colorize } = __nccwpck_require__(8329)

class JsonDiff {
  constructor (options) {
    options.outputKeys = options.outputKeys || []
    this.options = options
  }

  isScalar (obj) {
    return typeof obj !== 'object' || obj === null
  }

  objectDiff (obj1, obj2) {
    let result = {}
    let score = 0
    let equal = true

    for (const [key, value] of Object.entries(obj1)) {
      if (!(key in obj2)) {
        result[`${key}__deleted`] = value
        score -= 30
        equal = false
      }
    }

    for (const [key, value] of Object.entries(obj2)) {
      if (!(key in obj1)) {
        result[`${key}__added`] = value
        score -= 30
        equal = false
      }
    }

    for (const [key, value1] of Object.entries(obj1)) {
      if (key in obj2) {
        score += 20
        const value2 = obj2[key]
        const change = this.diff(value1, value2)
        if (!change.equal) {
          result[key] = change.result
          equal = false
        } else if (this.options.full || this.options.outputKeys.includes(key)) {
          result[key] = value1
        }
        // console.log(`key ${key} change.score=${change.score} ${change.result}`)
        score += Math.min(20, Math.max(-10, change.score / 5)) // BATMAN!
      }
    }

    if (equal) {
      score = 100 * Math.max(Object.keys(obj1).length, 0.5)
      if (!this.options.full) {
        result = undefined
      }
    } else {
      score = Math.max(0, score)
    }

    // console.log(`objectDiff(${JSON.stringify(obj1, null, 2)} <=> ${JSON.stringify(obj2, null, 2)}) == ${JSON.stringify({score, result, equal})}`)
    return { score, result, equal }
  }

  findMatchingObject (item, index, fuzzyOriginals) {
    // console.log("findMatchingObject: " + JSON.stringify({item, fuzzyOriginals}, null, 2))
    let bestMatch = null

    let matchIndex = 0
    for (const [key, candidate] of Object.entries(fuzzyOriginals)) {
      if (key !== '__next') {
        const indexDistance = Math.abs(matchIndex - index)
        if (extendedTypeOf(item) === extendedTypeOf(candidate)) {
          const { score } = this.diff(item, candidate)
          if (
            !bestMatch ||
            score > bestMatch.score ||
            (score === bestMatch.score &&
              indexDistance < bestMatch.indexDistance)
          ) {
            bestMatch = { score, key, indexDistance }
          }
        }
        matchIndex++
      }
    }

    // console.log"findMatchingObject result = " + JSON.stringify(bestMatch, null, 2)
    return bestMatch
  }

  scalarize (array, originals, fuzzyOriginals) {
    const fuzzyMatches = []
    if (fuzzyOriginals) {
      // Find best fuzzy match for each object in the array
      const keyScores = {}
      for (let index = 0; index < array.length; index++) {
        const item = array[index]
        if (this.isScalar(item)) {
          continue
        }
        const bestMatch = this.findMatchingObject(item, index, fuzzyOriginals)
        if (bestMatch && (!keyScores[bestMatch.key] || bestMatch.score > keyScores[bestMatch.key].score)) {
          keyScores[bestMatch.key] = { score: bestMatch.score, index }
        }
      }
      for (const [key, match] of Object.entries(keyScores)) {
        fuzzyMatches[match.index] = key
      }
    }

    const result = []
    for (let index = 0; index < array.length; index++) {
      const item = array[index]
      if (this.isScalar(item)) {
        result.push(item)
      } else {
        const key = fuzzyMatches[index] || '__$!SCALAR' + originals.__next++
        originals[key] = item
        result.push(key)
      }
    }
    return result
  }

  isScalarized (item, originals) {
    return typeof item === 'string' && item in originals
  }

  descalarize (item, originals) {
    if (this.isScalarized(item, originals)) {
      return originals[item]
    } else {
      return item
    }
  }

  arrayDiff (obj1, obj2) {
    const originals1 = { __next: 1 }
    const seq1 = this.scalarize(obj1, originals1)
    const originals2 = { __next: originals1.__next }
    const seq2 = this.scalarize(obj2, originals2, originals1)

    if (this.options.sort) {
      seq1.sort()
      seq2.sort()
    }
    const opcodes = new SequenceMatcher(null, seq1, seq2).getOpcodes()

    // console.log(`arrayDiff:\nobj1 = ${JSON.stringify(obj1, null, 2)}\nobj2 = ${JSON.stringify(obj2, null, 2)}\nseq1 = ${JSON.stringify(seq1, null, 2)}\nseq2 = ${JSON.stringify(seq2, null, 2)}\nopcodes = ${JSON.stringify(opcodes, null, 2)}`)

    let result = []
    let score = 0
    let equal = true

    for (const [op, i1, i2, j1, j2] of opcodes) {
      let i, j
      let asc, end
      let asc1, end1
      let asc2, end2
      if (!(op === 'equal' || (this.options.keysOnly && op === 'replace'))) {
        equal = false
      }

      switch (op) {
        case 'equal':
          for (
            i = i1, end = i2, asc = i1 <= end;
            asc ? i < end : i > end;
            asc ? i++ : i--
          ) {
            const item = seq1[i]
            if (this.isScalarized(item, originals1)) {
              if (!this.isScalarized(item, originals2)) {
                throw new Error(
                  `internal bug: isScalarized(item, originals1) != isScalarized(item, originals2) for item ${JSON.stringify(
                    item
                  )}`
                )
              }
              const item1 = this.descalarize(item, originals1)
              const item2 = this.descalarize(item, originals2)
              const change = this.diff(item1, item2)
              if (!change.equal) {
                result.push(['~', change.result])
                equal = false
              } else {
                if (this.options.full) {
                  result.push([' ', item1])
                } else {
                  result.push([' '])
                }
              }
            } else {
              if (this.options.full) {
                result.push([' ', item])
              } else {
                result.push([' '])
              }
            }
            score += 10
          }
          break
        case 'delete':
          for (
            i = i1, end1 = i2, asc1 = i1 <= end1;
            asc1 ? i < end1 : i > end1;
            asc1 ? i++ : i--
          ) {
            result.push(['-', this.descalarize(seq1[i], originals1)])
            score -= 5
          }
          break
        case 'insert':
          for (
            j = j1, end2 = j2, asc2 = j1 <= end2;
            asc2 ? j < end2 : j > end2;
            asc2 ? j++ : j--
          ) {
            result.push(['+', this.descalarize(seq2[j], originals2)])
            score -= 5
          }
          break
        case 'replace':
          if (!this.options.keysOnly) {
            let asc3, end3
            let asc4, end4
            for (
              i = i1, end3 = i2, asc3 = i1 <= end3;
              asc3 ? i < end3 : i > end3;
              asc3 ? i++ : i--
            ) {
              result.push(['-', this.descalarize(seq1[i], originals1)])
              score -= 5
            }
            for (
              j = j1, end4 = j2, asc4 = j1 <= end4;
              asc4 ? j < end4 : j > end4;
              asc4 ? j++ : j--
            ) {
              result.push(['+', this.descalarize(seq2[j], originals2)])
              score -= 5
            }
          } else {
            let asc5, end5
            for (
              i = i1, end5 = i2, asc5 = i1 <= end5;
              asc5 ? i < end5 : i > end5;
              asc5 ? i++ : i--
            ) {
              const change = this.diff(
                this.descalarize(seq1[i], originals1),
                this.descalarize(seq2[i - i1 + j1], originals2)
              )
              if (!change.equal) {
                result.push(['~', change.result])
                equal = false
              } else {
                result.push([' '])
              }
            }
          }
          break
      }
    }

    if (equal || opcodes.length === 0) {
      if (!this.options.full) {
        result = undefined
      } else {
        result = obj1
      }
      score = 100
    } else {
      score = Math.max(0, score)
    }

    return { score, result, equal }
  }

  diff (obj1, obj2) {
    const type1 = extendedTypeOf(obj1)
    const type2 = extendedTypeOf(obj2)

    if (type1 === type2) {
      switch (type1) {
        case 'object':
          return this.objectDiff(obj1, obj2)

        case 'array':
          return this.arrayDiff(obj1, obj2)
      }
    }

    // Compare primitives or complex objects of different types
    let score = 100
    let result = obj1
    let equal
    if (!this.options.keysOnly) {
      equal = obj1 === obj2
      if (!equal) {
        score = 0
        result = { __old: obj1, __new: obj2 }
      } else if (!this.options.full) {
        result = undefined
      }
    } else {
      equal = true
      result = undefined
    }

    return { score, result, equal }
  }
}

function diff (obj1, obj2, options = {}) {
  if (options.precision !== undefined) {
    obj1 = roundObj(obj1, options.precision)
    obj2 = roundObj(obj2, options.precision)
  }
  return new JsonDiff(options).diff(obj1, obj2).result
}

function diffString (obj1, obj2, options = {}) {
  return colorize(diff(obj1, obj2, options), options)
}

module.exports = { diff, diffString }


/***/ }),

/***/ 2356:
/***/ ((module) => {

const extendedTypeOf = function (obj) {
  const result = typeof obj
  if (obj == null) {
    return 'null'
  } else if (result === 'object' && obj.constructor === Array) {
    return 'array'
  } else {
    return result
  }
}

const roundObj = function (data, precision) {
  const type = typeof data
  if (type === 'array') {
    return data.map((x) => roundObj(x, precision))
  } else if (type === 'object') {
    for (const key in data) {
      data[key] = roundObj(data[key], precision)
    }
    return data
  } else if (
    type === 'number' &&
    Number.isFinite(data) &&
    !Number.isInteger(data)
  ) {
    return +data.toFixed(precision)
  } else {
    return data
  }
}

module.exports = { extendedTypeOf, roundObj }


/***/ }),

/***/ 9537:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var toPosInt = __nccwpck_require__(3755)

  , create = Object.create, hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function (limit) {
	var size = 0, base = 1, queue = create(null), map = create(null), index = 0, del;
	limit = toPosInt(limit);
	return {
		hit: function (id) {
			var oldIndex = map[id], nuIndex = ++index;
			queue[nuIndex] = id;
			map[id] = nuIndex;
			if (!oldIndex) {
				++size;
				if (size <= limit) return;
				id = queue[base];
				del(id);
				return id;
			}
			delete queue[oldIndex];
			if (base !== oldIndex) return;
			while (!hasOwnProperty.call(queue, ++base)) continue; //jslint: skip
		},
		delete: del = function (id) {
			var oldIndex = map[id];
			if (!oldIndex) return;
			delete queue[oldIndex];
			delete map[id];
			--size;
			if (base !== oldIndex) return;
			if (!size) {
				index = 0;
				base = 1;
				return;
			}
			while (!hasOwnProperty.call(queue, ++base)) continue; //jslint: skip
		},
		clear: function () {
			size = 0;
			base = 1;
			queue = create(null);
			map = create(null);
			index = 0;
		}
	};
};


/***/ }),

/***/ 7192:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint consistent-this: 0, no-shadow:0, no-eq-null: 0, eqeqeq: 0, no-unused-vars: 0 */

// Support for asynchronous functions



var aFrom        = __nccwpck_require__(2406)
  , objectMap    = __nccwpck_require__(7289)
  , mixin        = __nccwpck_require__(1070)
  , defineLength = __nccwpck_require__(1490)
  , nextTick     = __nccwpck_require__(4152);

var slice = Array.prototype.slice, apply = Function.prototype.apply, create = Object.create;

(__nccwpck_require__(4334).async) = function (tbi, conf) {
	var waiting = create(null)
	  , cache = create(null)
	  , base = conf.memoized
	  , original = conf.original
	  , currentCallback
	  , currentContext
	  , currentArgs;

	// Initial
	conf.memoized = defineLength(function (arg) {
		var args = arguments, last = args[args.length - 1];
		if (typeof last === "function") {
			currentCallback = last;
			args = slice.call(args, 0, -1);
		}
		return base.apply(currentContext = this, currentArgs = args);
	}, base);
	try { mixin(conf.memoized, base); }
	catch (ignore) {}

	// From cache (sync)
	conf.on("get", function (id) {
		var cb, context, args;
		if (!currentCallback) return;

		// Unresolved
		if (waiting[id]) {
			if (typeof waiting[id] === "function") waiting[id] = [waiting[id], currentCallback];
			else waiting[id].push(currentCallback);
			currentCallback = null;
			return;
		}

		// Resolved, assure next tick invocation
		cb = currentCallback;
		context = currentContext;
		args = currentArgs;
		currentCallback = currentContext = currentArgs = null;
		nextTick(function () {
			var data;
			if (hasOwnProperty.call(cache, id)) {
				data = cache[id];
				conf.emit("getasync", id, args, context);
				apply.call(cb, data.context, data.args);
			} else {
				// Purged in a meantime, we shouldn't rely on cached value, recall
				currentCallback = cb;
				currentContext = context;
				currentArgs = args;
				base.apply(context, args);
			}
		});
	});

	// Not from cache
	conf.original = function () {
		var args, cb, origCb, result;
		if (!currentCallback) return apply.call(original, this, arguments);
		args = aFrom(arguments);
		cb = function self(err) {
			var cb, args, id = self.id;
			if (id == null) {
				// Shouldn't happen, means async callback was called sync way
				nextTick(apply.bind(self, this, arguments));
				return undefined;
			}
			delete self.id;
			cb = waiting[id];
			delete waiting[id];
			if (!cb) {
				// Already processed,
				// outcome of race condition: asyncFn(1, cb), asyncFn.clear(), asyncFn(1, cb)
				return undefined;
			}
			args = aFrom(arguments);
			if (conf.has(id)) {
				if (err) {
					conf.delete(id);
				} else {
					cache[id] = { context: this, args: args };
					conf.emit("setasync", id, typeof cb === "function" ? 1 : cb.length);
				}
			}
			if (typeof cb === "function") {
				result = apply.call(cb, this, args);
			} else {
				cb.forEach(function (cb) { result = apply.call(cb, this, args); }, this);
			}
			return result;
		};
		origCb = currentCallback;
		currentCallback = currentContext = currentArgs = null;
		args.push(cb);
		result = apply.call(original, this, args);
		cb.cb = origCb;
		currentCallback = cb;
		return result;
	};

	// After not from cache call
	conf.on("set", function (id) {
		if (!currentCallback) {
			conf.delete(id);
			return;
		}
		if (waiting[id]) {
			// Race condition: asyncFn(1, cb), asyncFn.clear(), asyncFn(1, cb)
			if (typeof waiting[id] === "function") waiting[id] = [waiting[id], currentCallback.cb];
			else waiting[id].push(currentCallback.cb);
		} else {
			waiting[id] = currentCallback.cb;
		}
		delete currentCallback.cb;
		currentCallback.id = id;
		currentCallback = null;
	});

	// On delete
	conf.on("delete", function (id) {
		var result;
		// If false, we don't have value yet, so we assume that intention is not
		// to memoize this call. After value is obtained we don't cache it but
		// gracefully pass to callback
		if (hasOwnProperty.call(waiting, id)) return;
		if (!cache[id]) return;
		result = cache[id];
		delete cache[id];
		conf.emit("deleteasync", id, slice.call(result.args, 1));
	});

	// On clear
	conf.on("clear", function () {
		var oldCache = cache;
		cache = create(null);
		conf.emit(
			"clearasync", objectMap(oldCache, function (data) { return slice.call(data.args, 1); })
		);
	});
};


/***/ }),

/***/ 6245:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

// Call dispose callback on each cache purge



var callable   = __nccwpck_require__(6097)
  , forEach    = __nccwpck_require__(9575)
  , extensions = __nccwpck_require__(4334)

  , apply = Function.prototype.apply;

extensions.dispose = function (dispose, conf, options) {
	var del;
	callable(dispose);
	if ((options.async && extensions.async) || (options.promise && extensions.promise)) {
		conf.on("deleteasync", del = function (id, resultArray) {
			apply.call(dispose, null, resultArray);
		});
		conf.on("clearasync", function (cache) {
			forEach(cache, function (result, id) {
 del(id, result);
});
		});
		return;
	}
	conf.on("delete", del = function (id, result) {
 dispose(result);
});
	conf.on("clear", function (cache) {
		forEach(cache, function (result, id) {
 del(id, result);
});
	});
};


/***/ }),

/***/ 9474:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint consistent-this: 0 */

// Timeout cached values



var aFrom      = __nccwpck_require__(2406)
  , forEach    = __nccwpck_require__(9575)
  , nextTick   = __nccwpck_require__(4152)
  , isPromise  = __nccwpck_require__(8794)
  , timeout    = __nccwpck_require__(9953)
  , extensions = __nccwpck_require__(4334);

var noop = Function.prototype, max = Math.max, min = Math.min, create = Object.create;

extensions.maxAge = function (maxAge, conf, options) {
	var timeouts, postfix, preFetchAge, preFetchTimeouts;

	maxAge = timeout(maxAge);
	if (!maxAge) return;

	timeouts = create(null);
	postfix =
		(options.async && extensions.async) || (options.promise && extensions.promise)
			? "async"
			: "";
	conf.on("set" + postfix, function (id) {
		timeouts[id] = setTimeout(function () { conf.delete(id); }, maxAge);
		if (typeof timeouts[id].unref === "function") timeouts[id].unref();
		if (!preFetchTimeouts) return;
		if (preFetchTimeouts[id]) {
			if (preFetchTimeouts[id] !== "nextTick") clearTimeout(preFetchTimeouts[id]);
		}
		preFetchTimeouts[id] = setTimeout(function () {
			delete preFetchTimeouts[id];
		}, preFetchAge);
		if (typeof preFetchTimeouts[id].unref === "function") preFetchTimeouts[id].unref();
	});
	conf.on("delete" + postfix, function (id) {
		clearTimeout(timeouts[id]);
		delete timeouts[id];
		if (!preFetchTimeouts) return;
		if (preFetchTimeouts[id] !== "nextTick") clearTimeout(preFetchTimeouts[id]);
		delete preFetchTimeouts[id];
	});

	if (options.preFetch) {
		if (options.preFetch === true || isNaN(options.preFetch)) {
			preFetchAge = 0.333;
		} else {
			preFetchAge = max(min(Number(options.preFetch), 1), 0);
		}
		if (preFetchAge) {
			preFetchTimeouts = {};
			preFetchAge = (1 - preFetchAge) * maxAge;
			conf.on("get" + postfix, function (id, args, context) {
				if (!preFetchTimeouts[id]) {
					preFetchTimeouts[id] = "nextTick";
					nextTick(function () {
						var result;
						if (preFetchTimeouts[id] !== "nextTick") return;
						delete preFetchTimeouts[id];
						conf.delete(id);
						if (options.async) {
							args = aFrom(args);
							args.push(noop);
						}
						result = conf.memoized.apply(context, args);
						if (options.promise) {
							// Supress eventual error warnings
							if (isPromise(result)) {
								if (typeof result.done === "function") result.done(noop, noop);
								else result.then(noop, noop);
							}
						}
					});
				}
			});
		}
	}

	conf.on("clear" + postfix, function () {
		forEach(timeouts, function (id) { clearTimeout(id); });
		timeouts = {};
		if (preFetchTimeouts) {
			forEach(preFetchTimeouts, function (id) { if (id !== "nextTick") clearTimeout(id); });
			preFetchTimeouts = {};
		}
	});
};


/***/ }),

/***/ 1233:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

// Limit cache size, LRU (least recently used) algorithm.



var toPosInteger = __nccwpck_require__(3755)
  , lruQueue     = __nccwpck_require__(9537)
  , extensions   = __nccwpck_require__(4334);

extensions.max = function (max, conf, options) {
	var postfix, queue, hit;

	max = toPosInteger(max);
	if (!max) return;

	queue = lruQueue(max);
	postfix = (options.async && extensions.async) || (options.promise && extensions.promise)
		? "async" : "";

	conf.on("set" + postfix, hit = function (id) {
		id = queue.hit(id);
		if (id === undefined) return;
		conf.delete(id);
	});
	conf.on("get" + postfix, hit);
	conf.on("delete" + postfix, queue.delete);
	conf.on("clear" + postfix, queue.clear);
};


/***/ }),

/***/ 5796:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint max-statements: 0 */

// Support for functions returning promise



var objectMap     = __nccwpck_require__(7289)
  , primitiveSet  = __nccwpck_require__(2796)
  , ensureString  = __nccwpck_require__(8080)
  , toShortString = __nccwpck_require__(3298)
  , isPromise     = __nccwpck_require__(8794)
  , nextTick      = __nccwpck_require__(4152);

var create = Object.create
  , supportedModes = primitiveSet("then", "then:finally", "done", "done:finally");

(__nccwpck_require__(4334).promise) = function (mode, conf) {
	var waiting = create(null), cache = create(null), promises = create(null);

	if (mode === true) {
		mode = null;
	} else {
		mode = ensureString(mode);
		if (!supportedModes[mode]) {
			throw new TypeError("'" + toShortString(mode) + "' is not valid promise mode");
		}
	}

	// After not from cache call
	conf.on("set", function (id, ignore, promise) {
		var isFailed = false;

		if (!isPromise(promise)) {
			// Non promise result
			cache[id] = promise;
			conf.emit("setasync", id, 1);
			return;
		}
		waiting[id] = 1;
		promises[id] = promise;
		var onSuccess = function (result) {
			var count = waiting[id];
			if (isFailed) {
				throw new Error(
					"Memoizee error: Detected unordered then|done & finally resolution, which " +
						"in turn makes proper detection of success/failure impossible (when in " +
						"'done:finally' mode)\n" +
						"Consider to rely on 'then' or 'done' mode instead."
				);
			}
			if (!count) return; // Deleted from cache before resolved
			delete waiting[id];
			cache[id] = result;
			conf.emit("setasync", id, count);
		};
		var onFailure = function () {
			isFailed = true;
			if (!waiting[id]) return; // Deleted from cache (or succeed in case of finally)
			delete waiting[id];
			delete promises[id];
			conf.delete(id);
		};

		var resolvedMode = mode;
		if (!resolvedMode) resolvedMode = "then";

		if (resolvedMode === "then") {
			var nextTickFailure = function () { nextTick(onFailure); };
			// Eventual finally needs to be attached to non rejected promise
			// (so we not force propagation of unhandled rejection)
			promise = promise.then(function (result) {
				nextTick(onSuccess.bind(this, result));
			}, nextTickFailure);
			// If `finally` is a function we attach to it to remove cancelled promises.
			if (typeof promise.finally === "function") {
				promise.finally(nextTickFailure);
			}
		} else if (resolvedMode === "done") {
			// Not recommended, as it may mute any eventual "Unhandled error" events
			if (typeof promise.done !== "function") {
				throw new Error(
					"Memoizee error: Retrieved promise does not implement 'done' " +
						"in 'done' mode"
				);
			}
			promise.done(onSuccess, onFailure);
		} else if (resolvedMode === "done:finally") {
			// The only mode with no side effects assuming library does not throw unconditionally
			// for rejected promises.
			if (typeof promise.done !== "function") {
				throw new Error(
					"Memoizee error: Retrieved promise does not implement 'done' " +
						"in 'done:finally' mode"
				);
			}
			if (typeof promise.finally !== "function") {
				throw new Error(
					"Memoizee error: Retrieved promise does not implement 'finally' " +
						"in 'done:finally' mode"
				);
			}
			promise.done(onSuccess);
			promise.finally(onFailure);
		}
	});

	// From cache (sync)
	conf.on("get", function (id, args, context) {
		var promise;
		if (waiting[id]) {
			++waiting[id]; // Still waiting
			return;
		}
		promise = promises[id];
		var emit = function () { conf.emit("getasync", id, args, context); };
		if (isPromise(promise)) {
			if (typeof promise.done === "function") promise.done(emit);
			else {
				promise.then(function () { nextTick(emit); });
			}
		} else {
			emit();
		}
	});

	// On delete
	conf.on("delete", function (id) {
		delete promises[id];
		if (waiting[id]) {
			delete waiting[id];
			return; // Not yet resolved
		}
		if (!hasOwnProperty.call(cache, id)) return;
		var result = cache[id];
		delete cache[id];
		conf.emit("deleteasync", id, [result]);
	});

	// On clear
	conf.on("clear", function () {
		var oldCache = cache;
		cache = create(null);
		waiting = create(null);
		promises = create(null);
		conf.emit("clearasync", objectMap(oldCache, function (data) { return [data]; }));
	});
};


/***/ }),

/***/ 9822:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

// Reference counter, useful for garbage collector like functionality



var d          = __nccwpck_require__(4571)
  , extensions = __nccwpck_require__(4334)

  , create = Object.create, defineProperties = Object.defineProperties;

extensions.refCounter = function (ignore, conf, options) {
	var cache, postfix;

	cache = create(null);
	postfix = (options.async && extensions.async) || (options.promise && extensions.promise)
		? "async" : "";

	conf.on("set" + postfix, function (id, length) {
 cache[id] = length || 1;
});
	conf.on("get" + postfix, function (id) {
 ++cache[id];
});
	conf.on("delete" + postfix, function (id) {
 delete cache[id];
});
	conf.on("clear" + postfix, function () {
 cache = {};
});

	defineProperties(conf.memoized, {
		deleteRef: d(function () {
			var id = conf.get(arguments);
			if (id === null) return null;
			if (!cache[id]) return null;
			if (!--cache[id]) {
				conf.delete(id);
				return true;
			}
			return false;
		}),
		getRefCount: d(function () {
			var id = conf.get(arguments);
			if (id === null) return 0;
			if (!cache[id]) return 0;
			return cache[id];
		})
	});
};


/***/ }),

/***/ 5841:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var normalizeOpts = __nccwpck_require__(4488)
  , resolveLength = __nccwpck_require__(1257)
  , plain         = __nccwpck_require__(4039);

module.exports = function (fn/*, options*/) {
	var options = normalizeOpts(arguments[1]), length;

	if (!options.normalizer) {
		length = options.length = resolveLength(options.length, fn.length, options.async);
		if (length !== 0) {
			if (options.primitive) {
				if (length === false) {
					options.normalizer = __nccwpck_require__(7054);
				} else if (length > 1) {
					options.normalizer = __nccwpck_require__(9543)(length);
				}
			} else if (length === false) options.normalizer = __nccwpck_require__(2929)();
				else if (length === 1) options.normalizer = __nccwpck_require__(1290)();
				else options.normalizer = __nccwpck_require__(6591)(length);
		}
	}

	// Assure extensions
	if (options.async) __nccwpck_require__(7192);
	if (options.promise) __nccwpck_require__(5796);
	if (options.dispose) __nccwpck_require__(6245);
	if (options.maxAge) __nccwpck_require__(9474);
	if (options.max) __nccwpck_require__(1233);
	if (options.refCounter) __nccwpck_require__(9822);

	return plain(fn, options);
};


/***/ }),

/***/ 5769:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint no-eq-null: 0, eqeqeq: 0, no-unused-vars: 0 */



var customError      = __nccwpck_require__(9684)
  , defineLength     = __nccwpck_require__(1490)
  , d                = __nccwpck_require__(4571)
  , ee               = (__nccwpck_require__(3647).methods)
  , resolveResolve   = __nccwpck_require__(7230)
  , resolveNormalize = __nccwpck_require__(9076);

var apply = Function.prototype.apply
  , call = Function.prototype.call
  , create = Object.create
  , defineProperties = Object.defineProperties
  , on = ee.on
  , emit = ee.emit;

module.exports = function (original, length, options) {
	var cache = create(null)
	  , conf
	  , memLength
	  , get
	  , set
	  , del
	  , clear
	  , extDel
	  , extGet
	  , extHas
	  , normalizer
	  , getListeners
	  , setListeners
	  , deleteListeners
	  , memoized
	  , resolve;
	if (length !== false) memLength = length;
	else if (isNaN(original.length)) memLength = 1;
	else memLength = original.length;

	if (options.normalizer) {
		normalizer = resolveNormalize(options.normalizer);
		get = normalizer.get;
		set = normalizer.set;
		del = normalizer.delete;
		clear = normalizer.clear;
	}
	if (options.resolvers != null) resolve = resolveResolve(options.resolvers);

	if (get) {
		memoized = defineLength(function (arg) {
			var id, result, args = arguments;
			if (resolve) args = resolve(args);
			id = get(args);
			if (id !== null) {
				if (hasOwnProperty.call(cache, id)) {
					if (getListeners) conf.emit("get", id, args, this);
					return cache[id];
				}
			}
			if (args.length === 1) result = call.call(original, this, args[0]);
			else result = apply.call(original, this, args);
			if (id === null) {
				id = get(args);
				if (id !== null) throw customError("Circular invocation", "CIRCULAR_INVOCATION");
				id = set(args);
			} else if (hasOwnProperty.call(cache, id)) {
				throw customError("Circular invocation", "CIRCULAR_INVOCATION");
			}
			cache[id] = result;
			if (setListeners) conf.emit("set", id, null, result);
			return result;
		}, memLength);
	} else if (length === 0) {
		memoized = function () {
			var result;
			if (hasOwnProperty.call(cache, "data")) {
				if (getListeners) conf.emit("get", "data", arguments, this);
				return cache.data;
			}
			if (arguments.length) result = apply.call(original, this, arguments);
			else result = call.call(original, this);
			if (hasOwnProperty.call(cache, "data")) {
				throw customError("Circular invocation", "CIRCULAR_INVOCATION");
			}
			cache.data = result;
			if (setListeners) conf.emit("set", "data", null, result);
			return result;
		};
	} else {
		memoized = function (arg) {
			var result, args = arguments, id;
			if (resolve) args = resolve(arguments);
			id = String(args[0]);
			if (hasOwnProperty.call(cache, id)) {
				if (getListeners) conf.emit("get", id, args, this);
				return cache[id];
			}
			if (args.length === 1) result = call.call(original, this, args[0]);
			else result = apply.call(original, this, args);
			if (hasOwnProperty.call(cache, id)) {
				throw customError("Circular invocation", "CIRCULAR_INVOCATION");
			}
			cache[id] = result;
			if (setListeners) conf.emit("set", id, null, result);
			return result;
		};
	}
	conf = {
		original: original,
		memoized: memoized,
		profileName: options.profileName,
		get: function (args) {
			if (resolve) args = resolve(args);
			if (get) return get(args);
			return String(args[0]);
		},
		has: function (id) { return hasOwnProperty.call(cache, id); },
		delete: function (id) {
			var result;
			if (!hasOwnProperty.call(cache, id)) return;
			if (del) del(id);
			result = cache[id];
			delete cache[id];
			if (deleteListeners) conf.emit("delete", id, result);
		},
		clear: function () {
			var oldCache = cache;
			if (clear) clear();
			cache = create(null);
			conf.emit("clear", oldCache);
		},
		on: function (type, listener) {
			if (type === "get") getListeners = true;
			else if (type === "set") setListeners = true;
			else if (type === "delete") deleteListeners = true;
			return on.call(this, type, listener);
		},
		emit: emit,
		updateEnv: function () { original = conf.original; }
	};
	if (get) {
		extDel = defineLength(function (arg) {
			var id, args = arguments;
			if (resolve) args = resolve(args);
			id = get(args);
			if (id === null) return;
			conf.delete(id);
		}, memLength);
	} else if (length === 0) {
		extDel = function () { return conf.delete("data"); };
	} else {
		extDel = function (arg) {
			if (resolve) arg = resolve(arguments)[0];
			return conf.delete(arg);
		};
	}
	extGet = defineLength(function () {
		var id, args = arguments;
		if (length === 0) return cache.data;
		if (resolve) args = resolve(args);
		if (get) id = get(args);
		else id = String(args[0]);
		return cache[id];
	});
	extHas = defineLength(function () {
		var id, args = arguments;
		if (length === 0) return conf.has("data");
		if (resolve) args = resolve(args);
		if (get) id = get(args);
		else id = String(args[0]);
		if (id === null) return false;
		return conf.has(id);
	});
	defineProperties(memoized, {
		__memoized__: d(true),
		delete: d(extDel),
		clear: d(conf.clear),
		_get: d(extGet),
		_has: d(extHas)
	});
	return conf;
};


/***/ }),

/***/ 5550:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var forEach       = __nccwpck_require__(9575)
  , normalizeOpts = __nccwpck_require__(4488)
  , callable      = __nccwpck_require__(6097)
  , lazy          = __nccwpck_require__(7579)
  , resolveLength = __nccwpck_require__(1257)
  , extensions    = __nccwpck_require__(4334);

module.exports = function (memoize) {
	return function (props) {
		forEach(props, function (desc) {
			var fn = callable(desc.value), length;
			desc.value = function (options) {
				if (options.getNormalizer) {
					options = normalizeOpts(options);
					if (length === undefined) {
						length = resolveLength(
							options.length,
							fn.length,
							options.async && extensions.async
						);
					}
					options.normalizer = options.getNormalizer(length);
					delete options.getNormalizer;
				}
				return memoize(fn.bind(this), options);
			};
		});
		return lazy(props);
	};
};


/***/ }),

/***/ 4334:
/***/ (() => {




/***/ }),

/***/ 1257:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var toPosInt = __nccwpck_require__(3755);

module.exports = function (optsLength, fnLength, isAsync) {
	var length;
	if (isNaN(optsLength)) {
		length = fnLength;
		if (!(length >= 0)) return 1;
		if (isAsync && length) return length - 1;
		return length;
	}
	if (optsLength === false) return false;
	return toPosInt(optsLength);
};


/***/ }),

/***/ 9076:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var callable = __nccwpck_require__(6097);

module.exports = function (userNormalizer) {
	var normalizer;
	if (typeof userNormalizer === "function") return { set: userNormalizer, get: userNormalizer };
	normalizer = { get: callable(userNormalizer.get) };
	if (userNormalizer.set !== undefined) {
		normalizer.set = callable(userNormalizer.set);
		if (userNormalizer.delete) normalizer.delete = callable(userNormalizer.delete);
		if (userNormalizer.clear) normalizer.clear = callable(userNormalizer.clear);
		return normalizer;
	}
	normalizer.set = normalizer.get;
	return normalizer;
};


/***/ }),

/***/ 7230:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var toArray  = __nccwpck_require__(2353)
  , isValue  = __nccwpck_require__(2285)
  , callable = __nccwpck_require__(6097);

var slice = Array.prototype.slice, resolveArgs;

resolveArgs = function (args) {
	return this.map(function (resolve, i) {
		return resolve ? resolve(args[i]) : args[i];
	}).concat(slice.call(args, this.length));
};

module.exports = function (resolvers) {
	resolvers = toArray(resolvers);
	resolvers.forEach(function (resolve) {
		if (isValue(resolve)) callable(resolve);
	});
	return resolveArgs.bind(resolvers);
};


/***/ }),

/***/ 1936:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



module.exports = __nccwpck_require__(5550)(__nccwpck_require__(5841));


/***/ }),

/***/ 1290:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var indexOf = __nccwpck_require__(2324);

module.exports = function () {
	var lastId = 0, argsMap = [], cache = [];
	return {
		get: function (args) {
			var index = indexOf.call(argsMap, args[0]);
			return index === -1 ? null : cache[index];
		},
		set: function (args) {
			argsMap.push(args[0]);
			cache.push(++lastId);
			return lastId;
		},
		delete: function (id) {
			var index = indexOf.call(cache, id);
			if (index !== -1) {
				argsMap.splice(index, 1);
				cache.splice(index, 1);
			}
		},
		clear: function () {
			argsMap = [];
			cache = [];
		}
	};
};


/***/ }),

/***/ 6591:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var indexOf = __nccwpck_require__(2324)
  , create  = Object.create;

module.exports = function (length) {
	var lastId = 0, map = [[], []], cache = create(null);
	return {
		get: function (args) {
			var index = 0, set = map, i;
			while (index < length - 1) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) return null;
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) return null;
			return set[1][i] || null;
		},
		set: function (args) {
			var index = 0, set = map, i;
			while (index < length - 1) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					i = set[0].push(args[index]) - 1;
					set[1].push([[], []]);
				}
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) {
				i = set[0].push(args[index]) - 1;
			}
			set[1][i] = ++lastId;
			cache[lastId] = args;
			return lastId;
		},
		delete: function (id) {
			var index = 0, set = map, i, path = [], args = cache[id];
			while (index < length - 1) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					return;
				}
				path.push(set, i);
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) {
				return;
			}
			id = set[1][i];
			set[0].splice(i, 1);
			set[1].splice(i, 1);
			while (!set[0].length && path.length) {
				i = path.pop();
				set = path.pop();
				set[0].splice(i, 1);
				set[1].splice(i, 1);
			}
			delete cache[id];
		},
		clear: function () {
			map = [[], []];
			cache = create(null);
		}
	};
};


/***/ }),

/***/ 9543:
/***/ ((module) => {



module.exports = function (length) {
	if (!length) {
		return function () {
			return "";
		};
	}
	return function (args) {
		var id = String(args[0]), i = 0, currentLength = length;
		while (--currentLength) {
			id += "\u0001" + args[++i];
		}
		return id;
	};
};


/***/ }),

/***/ 2929:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint max-statements: 0 */



var indexOf = __nccwpck_require__(2324);

var create = Object.create;

module.exports = function () {
	var lastId = 0, map = [], cache = create(null);
	return {
		get: function (args) {
			var index = 0, set = map, i, length = args.length;
			if (length === 0) return set[length] || null;
			if ((set = set[length])) {
				while (index < length - 1) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) return null;
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) return null;
				return set[1][i] || null;
			}
			return null;
		},
		set: function (args) {
			var index = 0, set = map, i, length = args.length;
			if (length === 0) {
				set[length] = ++lastId;
			} else {
				if (!set[length]) {
					set[length] = [[], []];
				}
				set = set[length];
				while (index < length - 1) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) {
						i = set[0].push(args[index]) - 1;
						set[1].push([[], []]);
					}
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					i = set[0].push(args[index]) - 1;
				}
				set[1][i] = ++lastId;
			}
			cache[lastId] = args;
			return lastId;
		},
		delete: function (id) {
			var index = 0, set = map, i, args = cache[id], length = args.length, path = [];
			if (length === 0) {
				delete set[length];
			} else if ((set = set[length])) {
				while (index < length - 1) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) {
						return;
					}
					path.push(set, i);
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					return;
				}
				id = set[1][i];
				set[0].splice(i, 1);
				set[1].splice(i, 1);
				while (!set[0].length && path.length) {
					i = path.pop();
					set = path.pop();
					set[0].splice(i, 1);
					set[1].splice(i, 1);
				}
			}
			delete cache[id];
		},
		clear: function () {
			map = [];
			cache = create(null);
		}
	};
};


/***/ }),

/***/ 7054:
/***/ ((module) => {



module.exports = function (args) {
	var id, i, length = args.length;
	if (!length) return "\u0002";
	id = String(args[i = 0]);
	while (--length) id += "\u0001" + args[++i];
	return id;
};


/***/ }),

/***/ 4039:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var callable      = __nccwpck_require__(6097)
  , forEach       = __nccwpck_require__(9575)
  , extensions    = __nccwpck_require__(4334)
  , configure     = __nccwpck_require__(5769)
  , resolveLength = __nccwpck_require__(1257);

module.exports = function self(fn /*, options */) {
	var options, length, conf;

	callable(fn);
	options = Object(arguments[1]);

	if (options.async && options.promise) {
		throw new Error("Options 'async' and 'promise' cannot be used together");
	}

	// Do not memoize already memoized function
	if (hasOwnProperty.call(fn, "__memoized__") && !options.force) return fn;

	// Resolve length;
	length = resolveLength(options.length, fn.length, options.async && extensions.async);

	// Configure cache map
	conf = configure(fn, length, options);

	// Bind eventual extensions
	forEach(extensions, function (extFn, name) {
		if (options[name]) extFn(options[name], conf, options);
	});

	if (self.__profiler__) self.__profiler__(conf);

	conf.updateEnv();
	return conf.memoized;
};


/***/ }),

/***/ 4152:
/***/ ((module) => {



var ensureCallable = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

var byObserver = function (Observer) {
	var node = document.createTextNode(''), queue, currentQueue, i = 0;
	new Observer(function () {
		var callback;
		if (!queue) {
			if (!currentQueue) return;
			queue = currentQueue;
		} else if (currentQueue) {
			queue = currentQueue.concat(queue);
		}
		currentQueue = queue;
		queue = null;
		if (typeof currentQueue === 'function') {
			callback = currentQueue;
			currentQueue = null;
			callback();
			return;
		}
		node.data = (i = ++i % 2); // Invoke other batch, to handle leftover callbacks in case of crash
		while (currentQueue) {
			callback = currentQueue.shift();
			if (!currentQueue.length) currentQueue = null;
			callback();
		}
	}).observe(node, { characterData: true });
	return function (fn) {
		ensureCallable(fn);
		if (queue) {
			if (typeof queue === 'function') queue = [queue, fn];
			else queue.push(fn);
			return;
		}
		queue = fn;
		node.data = (i = ++i % 2);
	};
};

module.exports = (function () {
	// Node.js
	if ((typeof process === 'object') && process && (typeof process.nextTick === 'function')) {
		return process.nextTick;
	}

	// queueMicrotask
	if (typeof queueMicrotask === "function") {
		return function (cb) { queueMicrotask(ensureCallable(cb)); };
	}

	// MutationObserver
	if ((typeof document === 'object') && document) {
		if (typeof MutationObserver === 'function') return byObserver(MutationObserver);
		if (typeof WebKitMutationObserver === 'function') return byObserver(WebKitMutationObserver);
	}

	// W3C Draft
	// http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
	if (typeof setImmediate === 'function') {
		return function (cb) { setImmediate(ensureCallable(cb)); };
	}

	// Wide available standard
	if ((typeof setTimeout === 'function') || (typeof setTimeout === 'object')) {
		return function (cb) { setTimeout(ensureCallable(cb), 0); };
	}

	return null;
}());


/***/ }),

/***/ 3686:
/***/ ((module) => {



module.exports = 2147483647;


/***/ }),

/***/ 9953:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var toPosInt   = __nccwpck_require__(3755)
  , maxTimeout = __nccwpck_require__(3686);

module.exports = function (value) {
	value = toPosInt(value);
	if (value > maxTimeout) throw new TypeError(value + " exceeds maximum possible timeout");
	return value;
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 8951:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isPrototype = __nccwpck_require__(2884);

module.exports = function (value) {
	if (typeof value !== "function") return false;

	if (!hasOwnProperty.call(value, "length")) return false;

	try {
		if (typeof value.length !== "number") return false;
		if (typeof value.call !== "function") return false;
		if (typeof value.apply !== "function") return false;
	} catch (error) {
		return false;
	}

	return !isPrototype(value);
};


/***/ }),

/***/ 6010:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue       = __nccwpck_require__(3134)
  , isObject      = __nccwpck_require__(862)
  , stringCoerce  = __nccwpck_require__(8113)
  , toShortString = __nccwpck_require__(1887);

var resolveMessage = function (message, value) {
	return message.replace("%v", toShortString(value));
};

module.exports = function (value, defaultMessage, inputOptions) {
	if (!isObject(inputOptions)) throw new TypeError(resolveMessage(defaultMessage, value));
	if (!isValue(value)) {
		if ("default" in inputOptions) return inputOptions["default"];
		if (inputOptions.isOptional) return null;
	}
	var errorMessage = stringCoerce(inputOptions.errorMessage);
	if (!isValue(errorMessage)) errorMessage = defaultMessage;
	throw new TypeError(resolveMessage(errorMessage, value));
};


/***/ }),

/***/ 6765:
/***/ ((module) => {



module.exports = function (value) {
	try {
		return value.toString();
	} catch (error) {
		try { return String(value); }
		catch (error2) { return null; }
	}
};


/***/ }),

/***/ 1887:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var safeToString = __nccwpck_require__(6765);

var reNewLine = /[\n\r\u2028\u2029]/g;

module.exports = function (value) {
	var string = safeToString(value);
	if (string === null) return "<Non-coercible to string value>";
	// Trim if too long
	if (string.length > 100) string = string.slice(0, 99) + "…";
	// Replace eventual new lines
	string = string.replace(reNewLine, function (char) {
		switch (char) {
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\u2028":
				return "\\u2028";
			case "\u2029":
				return "\\u2029";
			/* istanbul ignore next */
			default:
				throw new Error("Unexpected character");
		}
	});
	return string;
};


/***/ }),

/***/ 862:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue = __nccwpck_require__(3134);

// prettier-ignore
var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

module.exports = function (value) {
	if (!isValue(value)) return false;
	return hasOwnProperty.call(possibleTypes, typeof value);
};


/***/ }),

/***/ 3681:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var resolveException = __nccwpck_require__(6010)
  , is               = __nccwpck_require__(6796);

module.exports = function (value/*, options*/) {
	if (is(value)) return value;
	return resolveException(value, "%v is not a plain function", arguments[1]);
};


/***/ }),

/***/ 6796:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isFunction = __nccwpck_require__(8951);

var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

module.exports = function (value) {
	if (!isFunction(value)) return false;
	if (classRe.test(functionToString.call(value))) return false;
	return true;
};


/***/ }),

/***/ 2884:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isObject = __nccwpck_require__(862);

module.exports = function (value) {
	if (!isObject(value)) return false;
	try {
		if (!value.constructor) return false;
		return value.constructor.prototype === value;
	} catch (error) {
		return false;
	}
};


/***/ }),

/***/ 8113:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var isValue  = __nccwpck_require__(3134)
  , isObject = __nccwpck_require__(862);

var objectToString = Object.prototype.toString;

module.exports = function (value) {
	if (!isValue(value)) return null;
	if (isObject(value)) {
		// Reject Object.prototype.toString coercion
		var valueToString = value.toString;
		if (typeof valueToString !== "function") return null;
		if (valueToString === objectToString) return null;
		// Note: It can be object coming from other realm, still as there's no ES3 and CSP compliant
		// way to resolve its realm's Object.prototype.toString it's left as not addressed edge case
	}
	try {
		return "" + value; // Ensure implicit coercion
	} catch (error) {
		return null;
	}
};


/***/ }),

/***/ 942:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



var resolveException = __nccwpck_require__(6010)
  , is               = __nccwpck_require__(3134);

module.exports = function (value/*, options*/) {
	if (is(value)) return value;
	return resolveException(value, "Cannot use %v", arguments[1]);
};


/***/ }),

/***/ 3134:
/***/ ((module) => {



// ES3 safe
var _undefined = void 0;

module.exports = function (value) { return value !== _undefined && value !== null; };


/***/ }),

/***/ 9491:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 4404:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
// EXTERNAL MODULE: ./node_modules/json-diff/lib/index.js
var lib = __nccwpck_require__(9031);
;// CONCATENATED MODULE: ./node_modules/chalk/source/vendor/ansi-styles/index.js
const ANSI_BACKGROUND_OFFSET = 10;

const wrapAnsi16 = (offset = 0) => code => `\u001B[${code + offset}m`;

const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			overline: [53, 55],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29],
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39],
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49],
		},
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`,
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false,
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false,
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = wrapAnsi16();
	styles.color.ansi256 = wrapAnsi256();
	styles.color.ansi16m = wrapAnsi16m();
	styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
	Object.defineProperties(styles, {
		rgbToAnsi256: {
			value: (red, green, blue) => {
				// We use the extended greyscale palette here, with the exception of
				// black and white. normal palette only has 4 greyscale shades.
				if (red === green && green === blue) {
					if (red < 8) {
						return 16;
					}

					if (red > 248) {
						return 231;
					}

					return Math.round(((red - 8) / 247) * 24) + 232;
				}

				return 16
					+ (36 * Math.round(red / 255 * 5))
					+ (6 * Math.round(green / 255 * 5))
					+ Math.round(blue / 255 * 5);
			},
			enumerable: false,
		},
		hexToRgb: {
			value: hex => {
				const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
				if (!matches) {
					return [0, 0, 0];
				}

				let {colorString} = matches.groups;

				if (colorString.length === 3) {
					colorString = [...colorString].map(character => character + character).join('');
				}

				const integer = Number.parseInt(colorString, 16);

				return [
					/* eslint-disable no-bitwise */
					(integer >> 16) & 0xFF,
					(integer >> 8) & 0xFF,
					integer & 0xFF,
					/* eslint-enable no-bitwise */
				];
			},
			enumerable: false,
		},
		hexToAnsi256: {
			value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
			enumerable: false,
		},
		ansi256ToAnsi: {
			value: code => {
				if (code < 8) {
					return 30 + code;
				}

				if (code < 16) {
					return 90 + (code - 8);
				}

				let red;
				let green;
				let blue;

				if (code >= 232) {
					red = (((code - 232) * 10) + 8) / 255;
					green = red;
					blue = red;
				} else {
					code -= 16;

					const remainder = code % 36;

					red = Math.floor(code / 36) / 5;
					green = Math.floor(remainder / 6) / 5;
					blue = (remainder % 6) / 5;
				}

				const value = Math.max(red, green, blue) * 2;

				if (value === 0) {
					return 30;
				}

				// eslint-disable-next-line no-bitwise
				let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

				if (value === 2) {
					result += 60;
				}

				return result;
			},
			enumerable: false,
		},
		rgbToAnsi: {
			value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
			enumerable: false,
		},
		hexToAnsi: {
			value: hex => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
			enumerable: false,
		},
	});

	return styles;
}

const ansiStyles = assembleStyles();

/* harmony default export */ const ansi_styles = (ansiStyles);

;// CONCATENATED MODULE: external "node:process"
const external_node_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:process");
;// CONCATENATED MODULE: external "node:os"
const external_node_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:os");
;// CONCATENATED MODULE: external "node:tty"
const external_node_tty_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:tty");
;// CONCATENATED MODULE: ./node_modules/chalk/source/vendor/supports-color/index.js




// From: https://github.com/sindresorhus/has-flag/blob/main/index.js
function hasFlag(flag, argv = external_node_process_namespaceObject.argv) {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}

const {env} = external_node_process_namespaceObject;

let flagForceColor;
if (
	hasFlag('no-color')
	|| hasFlag('no-colors')
	|| hasFlag('color=false')
	|| hasFlag('color=never')
) {
	flagForceColor = 0;
} else if (
	hasFlag('color')
	|| hasFlag('colors')
	|| hasFlag('color=true')
	|| hasFlag('color=always')
) {
	flagForceColor = 1;
}

function envForceColor() {
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			return 1;
		}

		if (env.FORCE_COLOR === 'false') {
			return 0;
		}

		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3,
	};
}

function _supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== undefined) {
		flagForceColor = noFlagForceColor;
	}

	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

	if (forceColor === 0) {
		return 0;
	}

	if (sniffFlags) {
		if (hasFlag('color=16m')
			|| hasFlag('color=full')
			|| hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (external_node_process_namespaceObject.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = external_node_os_namespaceObject.release().split('.');
		if (
			Number(osRelease[0]) >= 10
			&& Number(osRelease[2]) >= 10_586
		) {
			return Number(osRelease[2]) >= 14_931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	// Check for Azure DevOps pipelines
	if ('TF_BUILD' in env && 'AGENT_NAME' in env) {
		return 1;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function createSupportsColor(stream, options = {}) {
	const level = _supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options,
	});

	return translateLevel(level);
}

const supportsColor = {
	stdout: createSupportsColor({isTTY: external_node_tty_namespaceObject.isatty(1)}),
	stderr: createSupportsColor({isTTY: external_node_tty_namespaceObject.isatty(2)}),
};

/* harmony default export */ const supports_color = (supportsColor);

;// CONCATENATED MODULE: ./node_modules/chalk/source/utilities.js
// TODO: When targeting Node.js 16, use `String.prototype.replaceAll`.
function stringReplaceAll(string, substring, replacer) {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

;// CONCATENATED MODULE: ./node_modules/chalk/source/index.js




const {stdout: stdoutColor, stderr: stderrColor} = supports_color;

const GENERATOR = Symbol('GENERATOR');
const STYLER = Symbol('STYLER');
const IS_EMPTY = Symbol('IS_EMPTY');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m',
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class Chalk {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = (...strings) => strings.join(' ');
	applyOptions(chalk, options);

	Object.setPrototypeOf(chalk, createChalk.prototype);

	return chalk;
};

function createChalk(options) {
	return chalkFactory(options);
}

Object.setPrototypeOf(createChalk.prototype, Function.prototype);

for (const [styleName, style] of Object.entries(ansi_styles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		},
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this[STYLER], true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	},
};

const getModelAnsi = (model, level, type, ...arguments_) => {
	if (model === 'rgb') {
		if (level === 'ansi16m') {
			return ansi_styles[type].ansi16m(...arguments_);
		}

		if (level === 'ansi256') {
			return ansi_styles[type].ansi256(ansi_styles.rgbToAnsi256(...arguments_));
		}

		return ansi_styles[type].ansi(ansi_styles.rgbToAnsi(...arguments_));
	}

	if (model === 'hex') {
		return getModelAnsi('rgb', level, type, ...ansi_styles.hexToRgb(...arguments_));
	}

	return ansi_styles[type][model](...arguments_);
};

const usedModels = ['rgb', 'hex', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'color', ...arguments_), ansi_styles.color.close, this[STYLER]);
				return createBuilder(this, styler, this[IS_EMPTY]);
			};
		},
	};

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'bgColor', ...arguments_), ansi_styles.bgColor.close, this[STYLER]);
				return createBuilder(this, styler, this[IS_EMPTY]);
			};
		},
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this[GENERATOR].level;
		},
		set(level) {
			this[GENERATOR].level = level;
		},
	},
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent,
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	// Single argument is hot path, implicit coercion is faster than anything
	// eslint-disable-next-line no-implicit-coercion
	const builder = (...arguments_) => applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder[GENERATOR] = self;
	builder[STYLER] = _styler;
	builder[IS_EMPTY] = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self[IS_EMPTY] ? '' : string;
	}

	let styler = self[STYLER];

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.includes('\u001B')) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

Object.defineProperties(createChalk.prototype, styles);

const chalk = createChalk();
const chalkStderr = createChalk({level: stderrColor ? stderrColor.level : 0});



/* harmony default export */ const source = (chalk);

;// CONCATENATED MODULE: ./index.js


(function () {
  try {
    const expected = parseJSON('expected', core.getInput('expected'))
    const actual = parseJSON('actual', core.getInput('actual'))

    if (!(0,lib.diff)(actual, expected)) {
      core.info(source.green('"expected" and "actual" are equivalent JSON'))
      core.setOutput('equal', 'true')
      return
    }

    if (core.getBooleanInput('fail')) {
      core.setFailed('"expected" and "actual" are not equivalent JSON')
    }

    core.setOutput('equal', 'false')

    const output = (0,lib.diffString)(actual, expected)
    core.setOutput('diff', output)
    console.log(output)
  } catch (err) {
    core.setFailed(err.message)
  }
})()


function parseJSON(name, json) {
  try {
    return JSON.parse(json)
  } catch (err) {
    throw new Error(`Failed to parse "${name}" as JSON: ${err}`)
  }
}
})();

