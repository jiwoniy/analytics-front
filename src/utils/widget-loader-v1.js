/* eslint-disable */
var exports = {};
(function() {
    'use strict';
    window.TF = window.TF || {};
    window.TF.ChatWidget = window.TF.ChatWidget || {};
    var main = window.TF.ChatWidget;
(function (definition, main) {
    main.q = main.q || definition();
})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

var qStartingLine = captureLine();
var qFileName;

var noop = function () {};

var nextTick =(function () {
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        var channel = new MessageChannel();
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        if (arguments.length === 1) {
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        for (; index < length; index++) {
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {

        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

}, main);

/* jshint ignore: end*/

///#source 1 1 /Modules/events.js
(function(main) {
    'use strict';

    var domLevel2Events = window.addEventListener !== window.undefined;
    var exports = {};

    exports.domLevel2Events = domLevel2Events;

    if (domLevel2Events) {
        exports.attachEventHandler = function(target, type, listener) {
            target.addEventListener(type, listener, false);
        };
        exports.detachEventHandler = function(target, type, listener) {
            target.removeEventListener(type, listener, false);
        };
    } else {
        exports.attachEventHandler = function(target, type, listener) {
            target.attachEvent('on' + type, listener, false);
        };
        exports.detachEventHandler = function(target, type, listener) {
            target.detachEvent('on' + type, listener, false);
        };
    }

    exports.fireEvent = function(target, eventName, detail) {
        var messageEvent = window.document.createEvent('CustomEvent');
        messageEvent.initCustomEvent(eventName, true, true, detail);
        return target.dispatchEvent(messageEvent);
    };

    main.events = main.events || exports;
})(main);
///#source 1 1 /Modules/postMessage.js
(function(main) {
    var exports = {};
    exports.postMessage = function(container, eventName, detail) {
        var iframes = container.getElementsByTagName('iframe');
        if (iframes.length === 0) {
            throw 'No plugin iframe found in specified container element';
        }

        var message = JSON.stringify({
            eventName: eventName,
            detail: detail
        });

        iframes[0].contentWindow.postMessage(message, '*');
    };

    main.messaging = main.messaging || exports;
})(main);
///#source 1 1 /Modules/utilities.js
(function (main) {
    'use strict';
    var exports = {};

    exports.forEach = Function.prototype.call.bind(Array.prototype.forEach);

    exports.asArray = function (items) {
        if (items === undefined || items === null) {
            return [];
        }
        var isArray = false;
        if (Array.isArray) {
            isArray = Array.isArray(items);
        } else {
            isArray = Object.prototype.toString.call(items) === '[object Array]';
        }
        
        if (isArray) {
            return items;
        } else {
            var converted = Array.prototype.slice.call(items);
            return converted[0] !== void 0 ? converted : Array.prototype.concat.call(items);
        }
    };

    exports.dashSeparatedToCamel = function (str) {
        if (typeof str !== 'string') {
            throw new TypeError('argument must be a string');
        }
        
        return str.replace(/(\-[a-z])/g, function (input) { return input.toUpperCase().replace('-', ''); });
    };
    
    exports.clone = function (object) {
        return window.JSON.parse(window.JSON.stringify(object));
    };
    
    exports.extend = function (object) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var property in source) {
                if (source.hasOwnProperty(property)) {
                    object[property] = source[property];
                }
            }
        }

        return object;
    };

    exports.isTruthy = function(object) {
        
        if (typeof object === "string") {
            return object.toUpperCase() === "TRUE" || object == "1";
        }
        
        // this works because of object coercsion
        // ES5 defines this well enough that we can do this
        // but it has to stay in an if :)
        if (object) {
            return true;
        }

        return false;
    };

    exports.getAttributeOptions = function (element, prefix) {
        if (!element.attributes) {
            throw new TypeError("element must be a DOMElement");
        }
        
        if (typeof prefix !== "string") {
            throw new TypeError("prefix must be a string");
        }

        if (prefix.substring(prefix.length - 1) !== "-") {
            prefix += "-";
        }
        var prefixLength = prefix.length;

        var options = {};
        var attributes = element.attributes;

        for (var i = 0; i < attributes.length; i++) {
            var attributeName = attributes[i].name;
            if (attributeName.substring(0, prefixLength) == prefix && attributeName.length > prefixLength) {
                var camelCaseProperty = exports.dashSeparatedToCamel(attributeName.slice(prefixLength));
                options[camelCaseProperty] = attributes[i].value;
            }
        }

        return options;
    };

    function ensure(object, property, factory) {
        return (object.hasOwnProperty[property] && object[property] !== null) ? object[property] : (object[property] = factory());
    }

    exports.ensure = function(object, property, factory) {
        var names = property.split('.'),
            last = names.pop();

        exports.forEach(names, function(name) {
            object = ensure(object, name, function() {
                return {};
            });
        });

        return ensure(object, last, factory);
    };

    exports.generateId = function() {
        var text = "",
            length = 16,
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                "abcdefghijklmnopqrstuvwxyz" +
                "0123456789";

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    };

    exports.addUrlParam = function(url, param, value) {
        var encodedParam = encodeURIComponent(param);
        var encodedValue = encodeURIComponent(value);
        var prepend = -1 === url.indexOf('?') ? '?' : '&';
        return url + prepend + encodedParam + '=' + encodedValue;
    };

    exports.getQueryVariables = function() {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        var varsDictionary = {};
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            varsDictionary[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return varsDictionary;
    };

    main.utilities = main.utilities || exports;
})(main);
///#source 1 1 /Modules/domUtil.js
(function (main, events) {
    var exports = {};

    exports.addScript = function (source, onload) {
        var script = window.document.createElement('script');
        script.src = source;
        if (onload) {
            events.attachEventHandler(script, 'load', onload);
        }
        window.document.body.appendChild(script);
    };

    exports.bootstrapAngular = function (container) {
        if (!!angular.element(container).hasClass('ng-scope')) {
            angular.bootstrap(container, []);
        }
    };

    exports.injectAngular = function (container) {
        if (window.angular !== void 0) {
            exports.addScript("//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js", function () {
                exports.bootstrapAngular(container);
            });
        } else {
            exports.bootstrapAngular(container);
        }
    };

    exports.injectPlugin = function (baseUrl, plugin) {
        exports.addScript(baseUrl + "/" + plugin + '.js');
    };

    exports.injectScripts = function (baseUrl, plugin) {
        // plugin script takes url parameter to generate the 
        // proper codez for putting itself on the right part
        // of the window object
        exports.injectPlugin(baseUrl, plugin);
    };

    main.domUtil = main.domUtil || exports;
})(main, main.events);
///#source 1 1 /Modules/domReady.js
(function (main, events, utilities) {
    var readyList, isReady;

    function ready() {
        // if ready fired before the body exists, try again after current event processing completes
        if (!window.document.body) {
            window.setTimeout(ready, 0);
            return;
        }

        isReady = true;
        utilities.forEach(readyList, function (fn) {
            fn.call();
        });
    }

    function detachReadyEvents() {
        events.detachEventHandler(window.document, events.domLevel2Events ? 'DOMContentLoaded' : 'readystatechange', completed);
        events.detachEventHandler(window, 'load', completed);
    }

    function attachReadyEvents() {
        events.attachEventHandler(window.document, events.domLevel2Events ? 'DOMContentLoaded' : 'readystatechange', completed);
        events.attachEventHandler(window, 'load', completed);
    }

    function completed() {
        if (window.document.addEventListener || window.event.type === 'load' || window.document.readyState === 'complete') {
            detachReadyEvents();
            ready();
        }
    }

    var exports = function (callback) {
        if (!readyList) {
            readyList = [];

            // if we're already in a complete state, follow with immediate invocation of our ready function.
            if (window.document.readyState === 'complete') {
                window.setTimeout(ready, 0);
            } else {
                attachReadyEvents();
            }
        }

        readyList.push(callback);
    };

    main.domReady = main.domReady || exports;
})(main, main.events, main.utilities);
///#source 1 1 /Modules/bootstrap.js
(function(main, events, messaging, domUtil, utilities) {
    'use strict';

    var exports = {};
    var pluginSettingsAttribute = 'data-tf-sdk',
        pluginOptions = {
            pluginAttribute: 'data-tf-plugin',
            inlineAttribute: 'data-tf-inline',
            autoInit: true,
            windowProperty: 'TF.ChatWidget',
        };

    // this is for a dynamically generated controller
    var inlineControllerName = 'inlineController';

    function getPluginSource(options) {
        return options.pluginUrl || (options.baseUrl + '/#/' + options.plugin);
    }

    var buildController = function(options) {
        var inlineController = function($scope) {
            $scope.includeUrl = options.baseUrl + '/' + options.plugin;
        };

        inlineController['$inject'] = ['$cope'];

        return inlineController;
    };

    var buildInjection = function(container, options) {
        if (options.inline) {
            var newControllerName = pluginOptions.windowProperty + inlineControllerName;

            var injectedElement = window.document.createElement('div');
            injectedElement.className = 'injectedContent';
            injectedElement.setAttribute('ng-controller', newControllerName);

            utilities.ensure(window, newControllerName, function() {
                return buildController(options);
            });

            var child = window.document.createElement('div');
            child.className = "injectedChild";
            child.setAttribute('ng-include', 'includeUrl');

            injectedElement.appendChild(child);

            domUtil.injectAngular(container);
            domUtil.injectScripts(options.baseUrl, options.plugin);

            // make sure that the proper scripts are on the page
            return injectedElement.outerHTML;
        } else {
            return '<iframe src="' + getPluginSource(options) + '" style="width: 100%; height: 100%; border: 0;" id=plugin-"' + new Date().getTime() + '"></iframe>';
        }
    };

    function initializeContainer(container, options) {
        options = options || {};

        for (var i = 0; i < container.attributes.length; i++) {
            var attr = container.attributes[i];
            var match = attr.nodeName.match(/^(?:data\-)?tf\-sdk\-(.*)/);
            if (match) {
                options[utilities.dashSeparatedToCamel(match[1])] = attr.nodeValue;
            }
        }

        var injection = buildInjection(container, options);
        container.innerHTML = injection;
        var frame = container.querySelector('iframe');

        return frame;
    }

    function initializeAllContainers(options) {
        var containers = window.document.querySelectorAll('[' + pluginOptions.pluginAttribute + ']');
        var injections = [];

        options = options || {};

        utilities.forEach(containers, function(container) {
            var pluginName = container.getAttribute(pluginOptions.pluginAttribute);

            pluginOptions = utilities.clone(options);

            var plugin = TF[pluginName](container, pluginOptions);

            injections.push(plugin);
        });
        return injections;
    }

    function bubbleMessageEvent(event) {
        if (event.origin != pluginOptions.baseUrl) {
            return;
        }

        var iframes = window.document.getElementsByTagName('iframe');
        var sourceFrame;

        for (var i = 0; i < iframes.length; i++) {
            if (iframes[i] && iframes[i].contentWindow === event.source) {
                sourceFrame = iframes[i];
                break;
            }
        }

        if (sourceFrame == null) {
            throw 'Could not identify source iframe of postMessage on content window';
        }
        var message = JSON.parse(event.data),
            eventName = message.eventName,
            detail = message.detail,
            container = sourceFrame.parentElement;

        var spinner = window.document.getElementById('suggest-spinner');
        if (spinner) {
            spinner.parentNode.removeChild(spinner);
        }
        events.fireEvent(container, eventName, detail);
    }

    exports.triggerEvent = function(element, method, options) {
        var attributeOptions = utilities.getAttributeOptions(element, pluginOptions.pluginAttribute + '-');
        var settings = utilities.extend({}, attributeOptions, options);
        messaging.postMessage(element, method, settings);
    };

    exports.applyScriptAttributes = function() {
        var scriptsTags = window.document.querySelectorAll('script[' + pluginSettingsAttribute + ']');

        if (scriptsTags.length > 0) {
            utilities.forEach(scriptsTags, function (script) {
                var overrides = window.JSON.parse(script.getAttribute(pluginSettingsAttribute) || "{}");
                utilities.extend(pluginOptions, overrides);
            });
        }

        if (!pluginOptions.baseUrl) {
            var scriptsTagsWithSrc = window.document.querySelectorAll('script[src][' + pluginSettingsAttribute + ']');

            if (scriptsTagsWithSrc.length > 0) {
                var scriptSource = scriptsTagsWithSrc[scriptsTagsWithSrc.length - 1].getAttribute('src');
                pluginOptions.baseUrl = scriptSource.substring(0, scriptSource.indexOf('/', scriptSource.indexOf('/') + 2));
            }
        }
    };

    exports.initialize = function(element, options) {
        if (element instanceof window.Element) {
            return initializeContainer(element, options);
        } else {
            options = element;
            return initializeAllContainers(options);
        }
    };

    exports.onReady = function() {
        exports.initializeMessageEvents();

        exports.applyScriptAttributes();

        if (pluginOptions.autoInit) {
            initializeAllContainers();
        }
    };

    exports.initializeMessageEvents = function() {
        events.detachEventHandler(window, 'message', bubbleMessageEvent);
        events.attachEventHandler(window, 'message', bubbleMessageEvent);
    };
    
    var setupNamespace = function() {
        main.triggerEvent = main.triggerEvent || exports.triggerEvent;
        main.initialize = main.initialize || exports.initialize;

        main.bootstrap = main.bootstrap || exports;
    };

    setupNamespace();
})(main, main.events, main.messaging, main.domUtil, main.utilities);

///#source 1 1 /Modules/bootstrapMain.js
(function(main, domReady, bootstrap) {
    domReady(bootstrap.onReady);
})(main, main.domReady, main.bootstrap);
///#source 1 1 /Modules/pluginBase.js
(function (main, events, utilities, bootstrap) {
    'use strict';
    
    var enr = main; 

    function callEventListeners(plugin, event, e) {
        for (var i = 0; i < plugin.eventListeners[event].length; i++) {
            plugin.eventListeners[event][i].call(undefined, e);
        }
    }

    // Base plugin constructor
    function pluginBase() {
        
    }
    
    pluginBase.prototype.initBase = function(options) {
        this.options = utilities.extend(this.defaultOptions || {}, options || {});
    };

    // Initialize plugin on a dom element
    pluginBase.prototype.init = function init(dom) {
        this.id = utilities.generateId();
        this.scripts = [];
        this.styles = [];
        this.eventListeners = {};
        this.windowEventListeners = {};
        
        if (this.options.inline) {
            // TODO
        } else {
            this.options.pluginUrl = utilities.addUrlParam(this.options.pluginUrl, 'id', this.id);
            this.frame = bootstrap.initialize(dom, this.options);
        }
    };

    // Add an event handler
    pluginBase.prototype.on = function on(event, callback) {
        var that = this;
        
        if (this.eventListeners[event] === undefined) {
            this.eventListeners[event] = [];
        }

        // Add a window event listener for this event if there isn't one 
        if (this.windowEventListeners[event] === undefined) {
            if (this.options.inline) {
                // No iframe
                this.windowEventListeners[event] = function(e) {
                    if (e.detail !== undefined && e.detail.id === that.id) {
                        callEventListeners(that, event, e);
                    }
                };
                events.attachEventHandler(window, event, this.windowEventListeners[event]);
            } else {
                // iframe
                this.windowEventListeners[event] = function (e) {
                    var data = e.data;
                    if (typeof data === 'string') {
                        try {
                            data = JSON.parse(e.data);
                        } catch (e) {

                        }
                    }
                    if (data !== undefined && data.id === that.id && data.event === event) {
                        var customEvent = window.document.createEvent('CustomEvent');
                        customEvent.initCustomEvent(event, false, true, data.detail);
                        callEventListeners(that, event, customEvent);
                    }
                };
                events.attachEventHandler(window, 'message', this.windowEventListeners[event]);
            }
        }
        this.eventListeners[event].push(callback);
    };

    // Remove an event handler
    pluginBase.prototype.off = function off(event, callback) {
        if (callback === undefined) {
            this.eventListeners[event] = [];
        } else {
            for (var i = 0; i < this.eventListeners[event].length; i++) {
                if (this.eventListeners[event][i] === callback) {
                    this.eventListeners[event].splice(i, 1);
                    return;
                }
            }
        }
    };

    // Trigger an event
    pluginBase.prototype.trigger = function trigger(event, detail) {
        var eventObj = { event: event, id: this.id, detail: detail };

        if (this.options.inline) {
            events.fireEvent(window, event, eventObj);
        } else {
            if (window.FileReader) {
                this.frame.contentWindow.postMessage(eventObj, "*");
            } else {
                this.frame.contentWindow.postMessage(JSON.stringify(eventObj), "*");
            }
        }
    };
    
    // Add PluginBase to the window global
    enr.PluginBase = pluginBase;
})(main, main.events, main.utilities, main.bootstrap);
///#source 1 1 /Extras/tail.js
/* jshint ignore:start */
}());
/* jshint ignore: end */
var isAlpha = window.location.host.indexOf('test') !== -1;
var isDemo = window.location.host.indexOf('demo') !== -1 || window.location.host.indexOf('localhost') !== -1;
var baseUrl = isAlpha ? 'https://flanb-test.travelflan.com' : (isDemo ? 'https://flanb-demo.travelflan.com' : 'https://flanb.travelflan.com')

export default class ChatWidget {
    constructor(dom, options) {
        if (!(this instanceof ChatWidget)) {
            return new ChatWidget(dom, options);
        }
        this.pluginBase = new TF.ChatWidget.PluginBase();
        this.initialize(dom, options);
    }

    getEndpointUrl () {
        const hostname = window.location.hostname
        const isAlpha = hostname.indexOf('alpha') > -1
        const isDemo = hostname.indexOf('demo') > -1
        const isLocal = hostname.indexOf('localhost') > -1

        if (isLocal) {
            return 'widget.travelflan.com/tfwidget';
        }if (isAlpha) {
            return 'alpha-widget.travelflan.com/tfwidget';
        } else if (isDemo) {
            return 'demo-widget.travelflan.com/tfwidget';
        } else {
            return 'widget.travelflan.com/tfwidget';
        }
    }

    isMobile() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    initialize(domelement, options) {
        options = options || {};
        options.pluginUrl = `${window.location.protocol}//${this.getEndpointUrl()}`;
        options.plugin = 'Chat';

        this.initStyle(domelement, options);
        
        this.pluginBase.initBase(options);
        this.pluginBase.init(domelement);
        this.pluginBase.on('loaded', () => {
            const { userToken, provider_uid } = options
            if (userToken && provider_uid) {
                this.getUserToken(options.provider_uid, options.provider_id, options.userToken).then((result) => {
                    this.pluginBase.trigger('tf-initialize', {
                        token: result.token,
                        provider_id: options.provider_id
                    });
                });
            } else {
                this.pluginBase.trigger('tf-initialize', {
                    provider_id: options.provider_id
                });
            }
            
        });

        this.pluginBase.on('minimize', () => {
            TF.ChatWidget.isMinimized = true;
            domelement.firstElementChild.style['border-radius'] = '5px';
            domelement.style.right = '10px';
            domelement.style.bottom = '10px';
        });

        this.pluginBase.on('maximize', () => {
            TF.ChatWidget.isMinimized = false;
            domelement.firstElementChild.style['border-radius'] = '5px';
            domelement.style.height = this.isMobile() ? '100%' : `${(options.height || 667)}px`;
            domelement.style.width = this.isMobile() ? '100%' : `${(options.width || 375)}px`;;
            domelement.style.right = 0;
            domelement.style.bottom = 0;
        });

        this.pluginBase.on('loadmodal', (event) => {
            var modal = document.getElementById("tf-modal");
            var modalContent = document.getElementById("tf-modal-content");
            modal.style.display = "block";

            if(document.getElementById("tf-widget-iframe") === null) {
                var iframeDiv = document.createElement("iframe");
                iframeDiv.setAttribute("id", "tf-widget-iframe");

                iframeDiv.setAttribute("src", event.detail.url);

                modalContent.appendChild(iframeDiv);
            }
        });
    }

    initStyle (domelement, options) {
        if (options.customCss) {
            var cssId = 'tf-external-css';
            if (!document.getElementById(cssId))
            {
                var head  = document.getElementsByTagName('head')[0];
                var link  = document.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = options.customCss;
                link.media = 'all';
                head.appendChild(link);
            }
        }
        domelement.style.right = `${options.right || 10}px`;
        domelement.style.width = this.isMobile() ? '100%' : `${(options.width || 375)}px`;
        var height = options.height ? `${options.height}px` : '667px'
        domelement.style.height = this.isMobile() ? '100%' : height;

        domelement.style.position = 'fixed';
        domelement.style['z-index'] = 5000;
        domelement.style.bottom = '10px';
        TF.ChatWidget.isMinimized = true;
        
        function WidthChange(mq) {
            if (mq.matches) {
                var height = '667px'
                // min width 768px
                domelement.style.width = `${(options.width || 375)}px`;
                domelement.style.height = options.height || height;
            } else {
                if (!TF.ChatWidget.isMinimized) {
                    domelement.style.width = '100%';
                    domelement.style.height = '100%';
                    domelement.style.right = 0;
                    domelement.style.bottom = 0;
                }
            }
        }

        var mq = window.matchMedia( "(min-width: 768px)" );
        mq.addListener(WidthChange);

        if(this.isMobile()) {
            domelement.style.height = '100%';
            domelement.style.width = '100%';
        } else {
            WidthChange(mq);
        }

        this.initializeModal();
    }

    getUserToken (provider_uid, provider, serviceToken) {
        var ajax = {};
        
        ajax.x = function () {
            return new XMLHttpRequest();
        };

        ajax.send = function (url, callback, method, data, async) {
            if (async === undefined) {
                async = true;
            }
            var x = ajax.x();
            x.open(method, url, async);
            x.onreadystatechange = function () {
                if (x.readyState == 4) {
                    callback(x.responseText)
                }
            };
            if (method === 'POST') {
                x.setRequestHeader('Content-type', 'application/json');
                x.setRequestHeader('Authorization', 'Bearer ' + serviceToken);
            }
            x.send(data)
        };

        ajax.post = function (url, data, callback, async) {
            ajax.send(url, callback, 'POST', JSON.stringify(data), async)
        };
        
        return new Promise(function(resolve, reject) {
            ajax.post(baseUrl + '/aaa/token', {
                provider: provider,
                provider_uid: provider_uid
            }, function(result) {
                resolve(JSON.parse(result));
            });
        });
    }

    initializeModal() {
        var modalDiv = document.createElement("div");
        modalDiv.setAttribute("id", "tf-modal");
        modalDiv.setAttribute("class", "tf-modal");

        var modalContentDiv = document.createElement("div");
        modalContentDiv.setAttribute("id", "tf-modal-content");
        modalContentDiv.setAttribute("class", "tf-modal-content");

        var modalCloseDiv = document.createElement("span");
        modalCloseDiv.setAttribute("class", "tf-close");
        var textnode = document.createTextNode("×");
        modalCloseDiv.appendChild(textnode);

        modalContentDiv.appendChild(modalCloseDiv);
        modalDiv.appendChild(modalContentDiv);
        document.body.appendChild(modalDiv);

        modalCloseDiv.onclick = function() {
            modalDiv.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modalDiv) {
                modalDiv.style.display = "none";
            }
        }
    }
}
