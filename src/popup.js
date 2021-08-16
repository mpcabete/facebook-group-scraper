let interval;

getState = () => {
  chrome.runtime.sendMessage({ interaction: "getState" }, function (response) {
    console.log("response", response);
    if (response !== "idle") {
      hideButtons();
    }
  });
};
function sendMessageAndHideBtns(message) {
  chrome.runtime.sendMessage( message , function (response) {
    console.log(response);
  });
  displayStop();
  hideButtons();
}

startGroupAnalysis = () => {
  sendMessageAndHideBtns({ interaction: 'gAnalysis'})
};

startMembersAnalysis = () => {
  sendMessageAndHideBtns({ interaction: 'mAnalysis'})
};
startCompaniesAnalysis = () => {
  sendMessageAndHideBtns({ interaction: 'cAnalysis'})
};

download = () => {
  chrome.runtime.sendMessage({ interaction: "download" }, (response) => {
    console.log(response);
    downloadFile("userData.csv", response);
  });
};

downloadCompanies = () => {
  chrome.runtime.sendMessage({ interaction: "downloadCompanies" }, (response) => {
    console.log(response);
    downloadFile("companies.csv", response);
  });
};

stopAnalysis = () => {
  chrome.runtime.sendMessage({ interaction: "stop" }, function (response) {
    if (interval) {
      clearInterval(interval);
    }
    console.log(response);
  });
  displayButtons();
};
clearData = () => {
  chrome.runtime.sendMessage({ interaction: "clear" }, function (response) {
    alert(response + " memeber data removed");
    updateData();
  });
};

function downloadFile(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const gbtn = document.getElementById("startGbtn");
gbtn.addEventListener("click", startGroupAnalysis);

const mbtn = document.getElementById("startMbtn");
mbtn.addEventListener("click", startMembersAnalysis);

const canbtn = document.getElementById("startCbtn");
canbtn.addEventListener("click", startCompaniesAnalysis);

const dbtn = document.getElementById("downloadBtn");
dbtn.addEventListener("click", download);

const dcbtn = document.getElementById("downloadCompBtn");
dcbtn.addEventListener("click", downloadCompanies);


const sbtn = document.getElementById("stop");
sbtn.addEventListener("click", stopAnalysis);

const cbtn = document.getElementById("clear");
cbtn.addEventListener("click", clearData);

displayStop = () => {
  const btn = document.getElementById("stop");
  btn.style.display = "inline-block";
  console.log(btn);
};

displayButtons = () => {
  gbtn.style.display = "inline-block";
  mbtn.style.display = "inline-block";
  dbtn.style.display = "inline-block";
  dcbtn.style.display = "inline-block";
  canbtn.style.display = "inline-block";
  sbtn.style.display = "none";
};

hideButtons = () => {
  gbtn.style.display = "none";
  mbtn.style.display = "none";
  dbtn.style.display = "none";
  dcbtn.style.display = "none";
  canbtn.style.display = "none";
  sbtn.style.display = "inline-block";
};

getState();

updateData = () => {
  chrome.runtime.sendMessage({ interaction: "getCounts" }, function (response) {
    console.log("response: ", response);
    const membersCont = document.getElementById("mCount");
    membersCont.innerText = response?.m ?? 0;
    const analysedMCont = document.getElementById("amCount");
    analysedMCont.innerText = response?.am ?? 0;

    const analysedCCont = document.getElementById("acCount");
    analysedCCont.innerText = response?.ac ?? 0;
  });
};
updateData();

interval = setInterval(updateData, 1000);
