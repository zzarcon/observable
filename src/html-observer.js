(function() {
  var scope;
  var lastObjectId = 0;
  var lastObserverId = 0;
  var lastPropertyId = 0;
  var observers = {};
  var BRACKETS_REGEX = /(\{\{[\w\.]*\}\})/g;

  function parseHtml() {
    var html = $('body').html();
    var key;
    var lastKey;
    var obj;
    var observerId;
    var propertyId;

    html = html.replace(BRACKETS_REGEX, function(match, text, offset, string) {
      key = match.replace(/{{/, '').replace('}}', '');
      obj = getObjectFromKey(key);
      observerId = obj._observerId;
      lastKey = key.split('.').pop();
      //Improve this
      return '<o data-observer-id="' + observerId + '" data-property-key="' + lastKey + '">' + key + "</o>";
    });

    $('body').html(html);
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

    for (var prop in object) {
      obj = object[prop];
      if (typeof obj === 'object') {
        watch(obj);
        addObserver(scope);
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