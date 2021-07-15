console.log("contentScript")


let interval = 0
let isDataSent = false


const msgHandler = (msg)=>{
    // for group page analysis
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

// ====================================== company data
const getCompany = ()=>{

        const aboutList = document.querySelectorAll('ul')[1]
        const isLoaded = aboutList?.hasChildNodes()
        if (!isLoaded)return
        const nodes = searchNode(aboutList,/\s(?:na|at)\s/g) 
        const elements = nodes.map(n=>n.parentElement)
        const data = elements.map((e)=>{
            const a = e.querySelector('a')
            return{
                text:e.innerText,
                company:a?.innerText ?? 'no <a>',
                url:a?.href ?? 'none'
            }
        })

    chrome.runtime.sendMessage({interaction:'memberData',data:data,ownUrl:document.URL});
    console.log('message sent')
    isDataSent=true
    // console.log('Company',node[0].parentElement.querySelector('a').innerText)
}

// ====================================== search
const searchText = (node,regex,result)=>{
    if(!result) {

        result=[]
    }
    if(!node.hasChildNodes()&&!node.nodeType === Text.TEXT_NODE){
        return
    }else
    if(node.nodeType === Text.TEXT_NODE){
        const match = node.textContent.match(regex)
        
        if(match){
            result.push(match)
            
        }
    }else if(node.hasChildNodes()){
        node.childNodes.forEach(e=>searchText(e,regex,result))

    }

    return result
}
const searchNode = (node,regex,result)=>{
    if(!result) {

        result=[]
    }
    if(!node.hasChildNodes()&&!node.nodeType === Text.TEXT_NODE){
        return
    }else
    if(node.nodeType === Text.TEXT_NODE){
        const match = node.textContent.match(regex)
        
        if(match){
            result.push(node)
            
        }
    }else if(node.hasChildNodes()){
        node.childNodes.forEach(e=>searchNode(e,regex,result))

    }

    return result
}
// ====================================== email scraping
function getCompanyData() {

    // const email = searchText(document.body,/\b[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9.-]+\b/g)
    const domains = document.body.innerText.match(/(www|http:|https:)+[^\s]+[\w]/g)
    const emails = document.body.innerText.match(/\b[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9.-]+\b/g)
    return { emails, domains }
}




// mutationHandler function to execute when mutations are observed
const mutationHandler = function(mutationsList, observer) {
    if(isDataSent){
        console.log('data already sent... returning')
        return
    }
    const baseURL = 'https://www.facebook.com/groups/' // sepa muda pra se for igual a membro
    if(document.URL.substr(0,baseURL.length)===baseURL) return
    if (document.URL.includes('/about')){
        //talvez tenha q esperar o load
        console.log('companyPage')

        const data = getCompanyData()
        chrome.runtime.sendMessage({interaction:'companyData',data ,ownUrl:document.URL});
        console.log('c message sent')
        isDataSent=true
        return
    }
    // execute()
    try{
        getCompany()
    }catch(e){console.error(e)}
};


// Options for the observer (which mutations to observe)
const config = {characterData:true, childList: true, subtree: true };
// ==== nerfed email scraping:
const observer = new MutationObserver(mutationHandler);
observer.observe(document.body, config);
// ======================================

// setTimeout(execute,3000)
// document.body.addEventListener('change',execute)
// if no data is found send it after 3s
timeout = ()=>{
  const data ={
                text:'--',
                company:'no <a>',
               url:'none'
  }
    if(!isDataSent){
    console.log('no Data found, moving on...')
    chrome.runtime.sendMessage({interaction:'memberData',data,ownUrl:document.URL});
  }
}
setTimeout(timeout,3000)
chrome.runtime.onMessage.addListener((msg,sender,response)=>{msgHandler(msg);response('sucess')})



// query(range, found) {
//     if (!found) {
//       found = [];
//     }
//     if (!this.boundary.intersects(range)) { //n eh text e n tem child
//       return;
//     } else {
//       for (let p of this.points) {  //adiciona os match ao found
//         if (range.contains(p)) {
//           found.push(p);
//         }
//       }
//       if (this.divided) { //se tem child
//         this.northwest.query(range, found);
//         this.northeast.query(range, found);
//         this.southwest.query(range, found);
//         this.southeast.query(range, found);
//       }
//     }
//     return found; 
//   }
//
//TODO: colocar os dados sa compania na mensagem e colocar as companias no download
