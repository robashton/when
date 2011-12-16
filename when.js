var cleanMessageFromCallback = function(statement) {
  var startIndex = statement.indexOf('this.') + 5;
  var endIndex = statement.indexOf(')', startIndex) + 1;
  return statement.substr(startIndex, endIndex - startIndex);
};

var parseCallbackForExpectedMessages = function(callback) {
  var stringed = callback.toString();
  var components = stringed.split('then(');
  var messages = [];
  for(var i = 1; i < components.length; i++)
    messages.push(cleanMessageFromCallback(components[i]));
  return messages;
};

var when = function(testName, callback) {
  var self = this;
  var statements = [];
  var expectedMessages = parseCallbackForExpectedMessages(callback);
 
  var addStatement = function(statement, valid) {
    statements.push({ valid: valid, text: statement});
    tryAndFinish();
  };

  var tryAndFinish = function() {
    if(statements.length < expectedMessages.length) return;
    console.log('When ' + testName);
    for(var i = 0; i < statements.length; i++) {
      printStatement(statements[i]);
    }
  };

  var printStatement = function(statement) {
    if(statement.valid) {
      console.log('\t then ' + statement.text);
    } else {
      console.warn('\t then ' + statement.text);
    }
  };

  var lookupStatementForCurrentFunction = function() {
    return expectedMessages[statements.length];
  };

  var processStatementAsFunction = function(thenFunction, validity) {
    var text = lookupStatementForCurrentFunction();
    thenFunction.call(self, function(valid) {
      addStatement(text, valid);
    });
  };

  callback(function(statement, validity) {
    if(statement instanceof Function)
      processStatementAsFunction(statement, validity);
    else
     addStatement(statement, validity);
  });
};

exports.when = when;
