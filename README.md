When
-------

When is a test runner that allows me to write tests the way my tests want me to (largely with my own code), whilst still supporting a full asynchronous environment.

An example from one of my projects
--------

```javascript
when("a folder is packaged with default configurations", function() {
  swallowTest()
    .buildFrom('./in/assets')
    .into('./tmp/test_one.json')
    .build(function() {
        then(this.file_should_be_round_tripped_correctly('./assets/textures/bars.jpg'));
        then(this.file_should_be_round_tripped_correctly('./assets/shaders/particles.shader'));
        then(this.file_should_be_round_tripped_correctly('./assets/shaders/particles.fragment'));
        then(this.file_should_be_round_tripped_correctly('./assets/sounds/pigeon.wav'));
        then(this.file_should_be_round_tripped_correctly('./assets/textures/bars.jpg'));
        then(this.file_should_be_round_tripped_correctly('./assets/models/hovercraft.json'));
    });
});
```

With the output

<img src="http://github.com/robashton/when/raw/master/images/full_example.png">

Still interested?
------

Make your test file, and run it with

```
node mytests.js
```

A test can look like

```javascript
var when = require('when').when;

when("something happens that I want to assert on", function(then) {
  doSomeSharedSetup(function() {
    then("some condition is true", true);
    then("some condition is false", false);
  });
});
```

Where the output would be

```
When something happens that I want to assert on
  then some condition is true       /
  then some condition is false      X

test run failed
```

Alternatively when more complicated set-up and asserts with nested callbacks are required, we can push them into a function and then handle all that with the code we'd usually write.

```javascript
when("something happens that i want to assert on", function(then) {

  // Async method with a callback
  doSomeSetup(function() {
    then(this.some_value_should_match('some_input'));
    then(this.some_other_value_should_match('something'));  
  });
});
```

Which will give the output

```
When something happens that I want to assert on
  then some_value_should_match('some_input')        /
  then some_other_value_should_match('something')   X

test run failed
```

Where I've written the following code to support my tests in whatever style I feel appropriate at the time
Each assert is on an object that my set-up created and then used as the context for calling each 'then'
Each assert returns a function that is passed a truth object to be invoked when whatever asynchronous code
has been executed with the result of the assertion.

```javascript

// A function we've got somewhere to perform some async set-up
var doSomeSetup = function(callback) {

  // We perform our amazing set-up
  doSomethingElaboratelyAsync(function(data) {
  
    // Then we create an object that contains common assertions across our tests
    var asserts = new AwesomeAsserts(data);

    // And we call the provided callback in the context of the asserts (this is up to you)
    callback.call(asserts);
  });
};

// This is an object that contains the data created as a result of our set-up
var AwesomeAsserts = function(data) {
  this.data = data;
};

AwesomeAsserts.prototype = {
  
  // And each of these is an assert over the provided data
  this_needs_to_match_something: function(input) {
    return function(truth) { truth(input === this.data.something); }
  },

  // This one does something async before finally establishing truth
  this_needs_to_match_something_else = function(input) {
    return function(truth) {
      doSomethingAsync(this.data, function(output) {
        truth(input === output);
      };
    }
  }
};


```


