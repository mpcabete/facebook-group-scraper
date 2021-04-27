## [network traffic API](https://www.pubnub.com/blog/building-a-devtools-chrome-extension-to-monitor-traffic-from-pubnub/)
- Devtools extensions
- [network API](https://developer.chrome.com/docs/extensions/reference/devtools_network/)
  - `chrome.devtools.network.getHAR()`
  - `chrome.devtools.network.onRequestFinished` -event
  - `getContent()`
- [extension examples](https://github.com/GoogleChrome/chrome-extensions-samples)

## [Reference docs](https://developer.chrome.com/docs/extensions/reference/)
- [browsingData](https://developer.chrome.com/docs/extensions/reference/browsingData)
  - Use the chrome.browsingData API to remove browsing data from a user's local profile.
- [debugger](debugger)
  - The chrome.debugger API serves as an alternate transport for Chrome's remote debugging protocol. Use chrome.debugger to attach to one or more tabs to instrument network interaction, debug JavaScript, mutate the DOM and CSS, etc. Use the Debuggee tabId to target tabs with sendCommand and route events by tabId from onEvent callbacks.
  - https://chromedevtools.github.io/devtools-protocol/1-3/Network/
- [declarativeContent](https://developer.chrome.com/docs/extensions/reference/declarativeContent)
  - Use the chrome.declarativeContent API to take actions depending on the content of a page, without requiring permission to read the page's content.
- [declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest)
  - The chrome.declarativeNetRequest API is used to block or modify network requests by specifying declarative rules. This lets extensions modify network requests without intercepting them and viewing their content, thus providing more privacy.
- [desktopCapture](https://developer.chrome.com/docs/extensions/reference/desktopCapture)
  - Desktop Capture API that can be used to capture content of screen, individual windows or tabs.
- [devtools.network](https://developer.chrome.com/docs/extensions/reference/devtools_network)
  - Use the chrome.devtools.network API to retrieve the information about network requests displayed by the Developer Tools in the Network panel.
- [downloads](https://developer.chrome.com/docs/extensions/reference/downloads)
  - Use the chrome.downloads API to programmatically initiate, monitor, manipulate, and search for downloads.
- [events](https://developer.chrome.com/docs/extensions/reference/events)
  - The chrome.events namespace contains common types used by APIs dispatching events to notify you when something interesting happens.
- [scripting](https://developer.chrome.com/docs/extensions/reference/scripting)
  - Use the chrome.scripting API to execute script in different contexts.
- [webNavigation](https://developer.chrome.com/docs/extensions/reference/webNavigation)
  - Use the chrome.webNavigation API to receive notifications about the status of navigation requests in-flight.
- [webRequest](https://developer.chrome.com/docs/extensions/reference/webRequest)
  - Use the chrome.webRequest API to observe and analyze traffic and to intercept, block, or modify requests in-flight.
    - N da pra ter acesso ao body das respostas, esse eh mais util pra modificar os headers antes de mandar, mudar click pra trusted seria uma boa
- \[...\]

## [Google Sheets JavaScript Quickstart](https://developers.google.com/sheets/api/quickstart/js)
