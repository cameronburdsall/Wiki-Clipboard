chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'en.wikipedia.org'}, //activate extension when accessing sites from the en.wikipedia.org domain
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
      });
  });