try {
    self.allData = []
    self.analysisMaxTime = 10*60*1000
    self.currentState = 'idle'
    self.currentTimer = 0


    importScripts(
        'background/memberClass.js',
        'background/csvEntryClass.js',
        'background/csvParsing.js',
        'background/storage.js',
        'background/responseParsing.js',
        'background/memberNavigation.js',
        'background/companyClass.js',
        'background/companyNavigation.js',
        'background/messageHandling.js',
        'background/debugger.js'
        )
    

    //listen for click in popup buttons
    chrome.runtime.onMessage.addListener(messageHandler)
    
    
} catch(e) {
    console.error('eee',e)
}

