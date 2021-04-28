console.log("contentScript")


let interval = 0
// function download(filename, text) {
//     var element = document.createElement('a');
//     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
//     element.setAttribute('download', filename);
    
//     element.style.display = 'none';
//     document.body.appendChild(element);
    
//     element.click();
    
//     document.body.removeChild(element);
//   }

const msgHandler = (msg)=>{
    if (msg.command==='start' && interval==0){
        console.log('msg recived, starting...')
        interval = setInterval(()=>window.scrollTo(0,document.body.scrollHeight),1000)
    }

    if(msg.command==='stop'){
        console.log('msg recived, stopping...')
        clearInterval(interval)
        interval = 0

        
        // const csv = msg.data
        // // TODO: nome dinamico
        // download('users.csv',csv)
    }
}

// ====================================== email scraping
const getEmails = (element)=>{
    if(element.hasChildNodes()){
        element.childNodes.forEach(getEmails)
    }else if(element.nodeType === Text.TEXT_NODE){
        const emails= element.textContent.match(/\b[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9.-]+\b/g)
        // const domains= element.textContent.match(/(https?:\/\/)?([\w\-]){1,10}\.{1}([a-zA-Z]{2,10})([\/\w-]{0,10}){0,10}\/?\??([^#\n\r]{0,10})?#?([^\n\r]{0,10})/g)
        
        if(emails){
            console.log('emails:',emails)
            // console.log('domains:',domains)
        }
        // console.log(element.textContent)
        // element.textContent = element.textContent.replace(/membros/gi,'piroka')
    }
}

const execute = ()=>{
    const start = new Date().getTime()
    // console.log('executing')
    getEmails(document.body)
    const time = new Date().getTime() - start
    // console.log('done! ',time,'ms')
}



// Options for the observer (which mutations to observe)
const config = {characterData:true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    console.log('mutation')
    execute()
};


// ==== nerfed email scraping:
// const observer = new MutationObserver(callback);
// observer.observe(document.body, config);
// ======================================

// setTimeout(execute,3000)
// document.body.addEventListener('change',execute)


chrome.runtime.onMessage.addListener((msg,sender,response)=>{msgHandler(msg);response('sucess')})