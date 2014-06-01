(function() {
  var scope;
  var observedObjects = [];
  var lastObserverId = 0;
  var lastObservedObjectId = 0;
  var observers = {};
  var BRACKETS_REGEX = /(\{\{[\w\.]*\}\})/g;

  $(document).ready(parseHtml);

  function parseHtml() {
    var html = $('body').html();
    var key;

    html = html.replace(BRACKETS_REGEX, function(match, text, offset, string) {
      key = match.replace(/{{/, '').replace('}}', '');
      lastObserverId++;
      observers[lastObserverId] = key;

      return '<o data-observer-id="' + lastObserverId + '">' + key + "</o>"; //Improve this
    });

    $('body').html(html);

    for (var key in observers) {
      updateValue(key);
    }
  };

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
    lastObservedObjectId++;
    object._htmlObserverId = lastObservedObjectId;
    observedObjects.push(object);
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

  function observe(s) {
    scope = s;
    watch(s);
  }

  this.HtmlObserver = {
    observe: observe,
    updateValue: updateValue
  };
}).call(window);