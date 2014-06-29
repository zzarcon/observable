var App = {
  id: '1st',
  a: 1,
  b: {
    id: '2nd',
    a: 1
  },
  c: {
    id: '3r',
    a: {
      id: '4rt',
      a: 1
    }
  },
  version: "0.1.0",
  user: {
    firstName: "Hector",
    lastName: "Zarco",
    fullName: function() {
      return this.firstName + ' ' + this.lastName;
    }
  },
  team: {
    league: {
      id: 1999,
      division: "1º"
    }
  }
};

HtmlObserver.observe(App);