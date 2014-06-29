(function() {
  var scope;
  var lastObjectId = 0;
  var BRACKETS_REGEX = /(\{\{[\w\.]*\}\})/g;

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
      return '<o data-observer-id="' + observerId + '" data-property-key="' + lastKey + '">' + value + "</o>";
    });

    $body.innerHTML = html;

    //TODO Create class for manage common properties (lastKey, value)

    var $formElements = $('input, textarea', true), $el;

    for (var i = 0; i < $formElements.length; i++) {
      $el = $formElements[i];
      key = $el.getAttribute('observes');
      obj = getObjectFromKey(key);
      observerId = obj._observerId;
      lastKey = key.split('.').pop();
      value = obj[lastKey];

      if (typeof value === 'function') {
        value = value.bind(obj)();
      }

      $el.removeAttribute('observes');
      $el.setAttribute("data-observer-id", observerId);
      $el.setAttribute("data-property-key", lastKey);
      $el.value = value;
    }
  };

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

  //TODO Improve this for update value in inputs
  function updateObject(observerId, key, value) {
    var $el = $('[data-observer-id="' + observerId + '"][data-property-key="' + key + '"]');
    $el.innerHTML = value;
  }

  function addObserver(object) {
    Object.observe(object, onPropertyChange);
  }

  function watch(object) {
    var obj;

    lastObjectId++;
    object._observerId = lastObjectId;
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

    window.onload = onWindowLoad;
  }

  this.HtmlObserver = {
    observe: observe
  };
}).call(window);