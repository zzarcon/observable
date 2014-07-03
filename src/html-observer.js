(function() {
  var scope;
  var store = {};
  var lastObjectId = 0;
  var BRACKETS_REGEX = /(\{\{[\w\.]*\}\})/g;
  var ID_ATTR = "data-observer-id";
  var KEY_ATTR = "data-property-key";

  function $(selector, returnAll) {
    var $elements = document.querySelectorAll(selector);
    return returnAll ? $elements : $elements[0];
  }

  function parseHtml() {
    var key, lastKey, obj, value, observerId, propertyId;
    var $body = $('body');
    var html = $body.innerHTML;

    html = html.replace(BRACKETS_REGEX, function(match, text, offset, string) {
      key = match.replace(/{{/, '').replace('}}', '');
      obj = getObjectFromKey(key);
      observerId = obj._observerId;
      lastKey = key.split('.').pop();
      value = obj[lastKey];

      if (typeof value === 'function') {
        value = value.bind(obj)();
      }

      //Improve this
      return '<o ' + ID_ATTR + '="' + observerId + '" ' + KEY_ATTR + '="' + lastKey + '">' + value + "</o>";
    });

    $body.innerHTML = html;

    //TODO Create class for manage common properties (lastKey, value)

    var $formElements = $('input, textarea', true), $el;

    for (var i = 0; i < $formElements.length; i++) {
      $el = $formElements[i];
      $el.addEventListener('keyup', keypressHandler);
      key = $el.getAttribute('observes');
      obj = getObjectFromKey(key);
      observerId = obj._observerId;
      lastKey = key.split('.').pop();
      value = obj[lastKey];

      if (typeof value === 'function') {
        value = value.bind(obj)();
      }

      $el.removeAttribute('observes');
      $el.setAttribute(ID_ATTR, observerId);
      $el.setAttribute(KEY_ATTR, lastKey);
      $el.value = value;
    }
  };

  function getObjectFromId(id) {
    return store[id];
  }
  /**
   * Return the owner object of the passed key path
   * Example key: app.user.firstName return: user
   * @param  {String} key
   * @return {Object}
   */
  function getObjectFromKey(key) {
    var keys = key.split('.');
    var obj = scope;
    var position;

    keys.forEach(function(key, index) {
      if (typeof obj[key] === 'object') {
        obj = obj[key];
      }
    });

    return obj;
  }

  function keypressHandler() {
    var id = this.getAttribute(ID_ATTR);
    var prop = this.getAttribute(KEY_ATTR);
    var obj = getObjectFromId(id);

    obj[prop] = this.value;
  }

  /**
   * Fired when a property of a object is changed
   * @param  {Array} changes
   */
  function onPropertyChange(changes) {
    var name, type, value, obj, observerId;

    changes.forEach(function(change) {
      name = change.name;
      type = change.type;
      observerId = change.object._observerId;
      value = type === 'update' ? change.object[name] : "";

      updateObject(observerId, name, value);
    });
  }

  function updateObject(observerId, key, value) {
    var $el;
    var elements = $('[' + ID_ATTR + '="' + observerId + '"][' + KEY_ATTR + '="' + key + '"]', true);

    for (var i = 0; i < elements.length; i++) {
      $el = elements[i];

      //Input type
      if ($el.tagName === "O") {
        $el.innerHTML = value;
      } else {
        $el.value = value;
      }
    }
  }

  function addObserver(object) {
    Object.observe(object, onPropertyChange);
  }

  function watch(object) {
    var obj;

    lastObjectId++;
    object._observerId = lastObjectId;
    store[lastObjectId] = object;
    addObserver(object);

    for (var prop in object) {
      obj = object[prop];
      if (typeof obj === 'object') {
        watch(obj);
      }
    }
  }

  function onWindowLoad() {
    parseHtml();
  }

  function observe(s) {
    scope = s;
    watch(scope);

    window.addEventListener("load", onWindowLoad);
  }

  this.HtmlObserver = {
    observe: observe
  };
}).call(window);