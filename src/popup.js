startGroupAnalysis = ()=>{
    chrome.runtime.sendMessage({interaction:'gAnalysis'}, function(response) {
        console.log(response);
      });
} 

document.getElementById('startGbtn').addEventListener('click',startGroupAnalysis)