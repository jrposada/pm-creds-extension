async function onSyncCredentials(event) {
  console.log("Syncing credentials with PM Credentials");

  const {
    profile,
    aws_access_key_id,
    aws_secret_access_key,
    aws_session_token,
  } = event.detail || {};

  const eventData = {
    aws_access_key_id: get(window, aws_access_key_id),
    aws_secret_access_key: get(window, aws_secret_access_key),
    aws_session_token: get(window, aws_session_token),
  };

  return fetch("https://localhost:9999/aws", {
    method: "PUT",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ [profile]: eventData }),
  });
}

document.addEventListener("sync-credentials", onSyncCredentials);

////////////////////
/* Start of utils */
////////////////////

function isNullOrUndefined(value) {
  return value == null;
}

function get(obj, path, defaultValue) {
  if (!path || !isObject(obj)) {
    return defaultValue;
  }

  const result = compact(path.split(/[,[\].]+?/)).reduce(
    (result, key) => (isNullOrUndefined(result) ? result : result[key]),
    obj
  );

  return isUndefined(result) || result === obj
    ? isUndefined(obj[path])
      ? defaultValue
      : obj[path]
    : result;
}

/////////////////////
/* Start of lodash */
/////////////////////

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * compact([0, 1, false, 2, '', 3])
 * // => [1, 2, 3]
 */
function compact(array) {
  let resIndex = 0;
  const result = [];

  if (array == null) {
    return result;
  }

  for (const value of array) {
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * isObject({})
 * // => true
 *
 * isObject([1, 2, 3])
 * // => true
 *
 * isObject(Function)
 * // => true
 *
 * isObject(null)
 * // => false
 */
function isObject(value) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}

/**
 * Checks if `value` is `undefined`.
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * isUndefined(void 0)
 * // => true
 *
 * isUndefined(null)
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}
