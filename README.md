# HTML Observer
Very light library that allows you to have a simple but very powerful native two way binding using Object.observe, by this way you always will be up to date of the latest value of your value without deal with update the DOM.

#### WARNING! Super bleeding edge
This is a WIP for show what can be done with the native Object.observe feature.

#### CURRENT SUPPORT
This has been tested with Chrome Canary 38, for more info about the O.O. you can check the [HTML5  Rocks article](http://www.html5rocks.com/en/tutorials/es7/observe/)

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

<b>All are properties:</b>

Imagine that you have the current `person` and you want to get the result of her `fullName`, you only have to write a function that return the correct value like this:

```javascript
App.person = {
  firstName: 'John',
  lastName: 'Smith',

  fullName: function() {
    return this.firstName + ' ' + this.lastName;
  }
};
```

#### Subscribing to value in inputs
```html
<input type="text" observes="person.firstName">
```
#### Demo!
-Here's a demo showing current features http://jsfiddle.net/zzarcon/kX2UB/4/
#### Dependencies
None :D
### TODO
- [ ] Full support for computed properties
- [ ] Improve way to store references of the object in the DOM
- [ ] Create JSFiddle examples
- [ ] Manage all type of changes
- [ ] Observe changes in dynamic html