## WARNING! Super bleeding edge
This is a WIP for show what can be done with the native Object.observe feature

## CURRENT SUPPORT
This has been tested with Chrome Canary 38.0.2064.0, for more info about the OO you can check the [HTML5  Rocks article](http://www.html5rocks.com/en/tutorials/es7/observe/)


# HTML Observer

This is a very light library that allows you to render the value of your native javascript objects with only using the braces `{{}}` in yout html.

### Usage

You only have to call the `HtmlObserver.observe` method passing as param your `scope`, example:

```javascript
var App = {
  version: 0.1,
  session: {
    token: '123456',
    user: {
      firtName: 'John',
      lastName: 'Smith'
    }
  }
};

HtmlObserver.observe(App);
```

Later in your html:

```html
<h1>Current version {{version}}</h1>

<section>
  {{session.user.firstName}} {{session.user.lastName}} - {{session.token}}
</section>
```

With this your html will always be update to your `scope` values, and if you later make a change like this `App.version = 1` automatically your html will change.
All are properties

Example; imagine that you have the current `person` and you want to get the result of her `fullName`, you only have to write a  function that return the correct value

```javascript
App.person = {
  firstName: 'John',
  lastName: 'Smith',

  fullName: function() {
    return this.firstName + ' ' + this.lastName;
  }
};
```

## Dependencies
None
### TODO
- [ ] Add support for computed properties
- [ ] Remove Zepto dependency
- [ ] Improve way to store references of the object in the DOM
- [ ] Create JSFiddle examples