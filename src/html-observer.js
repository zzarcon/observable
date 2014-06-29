(function() {
  var scope;
  var lastObjectId = 0;
  var BRACKETS_REGEX = /(\{\{[\w\.]*\}\})/g;

  function parseHtml() {
    var key, lastKey, obj, observerId, propertyId;
    var $body = $('body');
    var html = $body.html();

    html = html.replace(BRACKETS_REGEX, function(match, text, offset, string) {
      key = match.replace(/{{/, '').replace('}}', '');
      obj = getObjectFromKey(key);
      observerId = obj._observerId;
      lastKey = key.split('.').pop();
      //Improve this
      return '<o data-observer-id="' + observerId + '" data-property-key="' + lastKey + '">' + obj[lastKey] + "</o>";
    });

    $body.html(html);
  };

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

  function onPropertyChange(changes) {
    var name, type, value, obj, observerId;

    changes.forEach(function(change) {
      name = change.name;
      type = change.type;
      value = change.object[name];
      observerId = change.object._observerId;

      updateObject(observerId, name, value);
    });
  }

  //TODO Improve this for update value in inputs
  function updateObject(observerId, key, value) {
    var $el = $('o[data-observer-id="' + observerId + '"][data-property-key="' + key + '"]');
    $el.text(value);
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

  function observe(s) {
    scope = s;
    watch(scope);

    $(document).ready(parseHtml);
  }

  this.HtmlObserver = {
    observe: observe
  };
}).call(window);