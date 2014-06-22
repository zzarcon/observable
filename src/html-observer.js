(function() {
  var scope;
  var observedObjects = [];
  var lastObjectId = 0;
  var lastObserverId = 0;
  var lastPropertyId = 0;
  var observers = {};
  var BRACKETS_REGEX = /(\{\{[\w\.]*\}\})/g;

  function parseHtml() {
    var html = $('body').html();
    var key;
    var obj;
    var observerId;
    var propertyId;

    html = html.replace(BRACKETS_REGEX, function(match, text, offset, string) {
      key = match.replace(/{{/, '').replace('}}', '');
      obj = getObjectFromKey(key);
      observerId = obj._observerId;
      //Improve this
      return '<o data-observer-id="' + observerId + '" data-property-id="' + key + '">' + key + "</o>";
    });

    $('body').html(html);

    for (var key in observers) {
      // uupdateValue(key);
    }

    watch(scope);
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

  function updateValue(id) {
    var keys = observers[id].split('.');
    var obj = JSON.parse(JSON.stringify(scope)); //Shit
    var text;

    keys.forEach(function(key) {
      if (typeof obj[key] !== 'object') {
        text = obj[key];
      } else {
        obj = obj[key];
      }
    });

    return $('body').find('o[data-observer-id="' + id + '"]').text(text);
  }

  function onPropertyChange(changes) {
    var name, type, value, obj;

    changes.forEach(function(change) {
      name = change.name;
      type = change.type;
      value = change.object[name];
      obj = findObservedObject(change.object);
      debugger;
    });
    updateValue();
  }

  function findObservedObject(o) {
    return observedObjects.filter(function(object) {
      return object === o;
    })[0];
  }

  function addObserver(object) {
    // lastObservedObjectId++;
    // object._htmlObserverId = lastObservedObjectId;
    // observedObjects.push(object);
    Object.observe(object, onPropertyChange);
  }

  function watch(scope) {
    var obj;
    addObserver(scope);

    for (var prop in scope) {
      obj = scope[prop];

      if (typeof obj === 'object') {
        watch(obj);
      }
    }
  }

  function setObjectId(object) {
    var obj;

    lastObjectId++;
    object._observerId = lastObjectId;

    for (var prop in object) {
      obj = object[prop];
      if (typeof obj === 'object') {
        setObjectId(obj);
      }
    }
  }

  function observe(s) {
    scope = s;
    setObjectId(scope);

    $(document).ready(parseHtml);
  }

  this.HtmlObserver = {
    observe: observe,
    updateValue: updateValue
  };
}).call(window);