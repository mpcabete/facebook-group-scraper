startGroupAnalysis = ()=>{
    chrome.runtime.sendMessage({interaction:'gAnalysis'}, function(response) {
        console.log(response);
      });
} 

download = ()=>{
    chrome.runtime.sendMessage({interaction:'download'}, (response)=>{
        downloadFile('userData.csv',response);
      });
// const csv = msg.data
//         // TODO: nome dinamico
//         download('users.csv',csv)
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
  }

document.getElementById('startGbtn').addEventListener('click',startGroupAnalysis)
document.getElementById('downloadBtn').addEventListener('click',download)


