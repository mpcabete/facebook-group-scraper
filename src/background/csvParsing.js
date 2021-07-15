
   // ========================================================================== csv
   const getPaths = (data,parent,paths)=>{
       if(!paths)paths=[]
       if(!parent){
           parent=''
       }else{
           parent += ':'
       }
       const keys = Object.keys(data)
       for(key in keys){
           const item = data[keys[key]]
           const path = parent+keys[key]
           if(typeof item==='object'){
            getPaths(item,path,paths)
           }else 
        //    console.log('path: ',path)
           paths.push(path)
           // console.log('value: ',item)
           
       }
       
       return paths
   }
    // converts data into csv format
//    generateCsv = (data)=>{
//        let biggest  = data[0]
//      console.log('data',data)
//        for (i in data){
//          console.log('b',biggest?.company?.length ?? 0)
//            console.log('i',data[i]?.company?.length)
//          if((data[i]?.company?.length ??0)>( biggest?.company?.length ?? 0)){
//            biggest = data[i]
//          }
//        }
//      console.log('biggest',biggest)
//      
//        const header = getPaths(biggest)
//
//
//        let csv = [header]
//        data.forEach((d,i)=>{
//            
//            const line = [... new Array(header.length)].fill(' - ')
//            
//            insert = (obj,label)=>{
//                if(!label){
//                    label=''
//                }else{
//                    label += ':'
//                }
//                for(i in Object.keys(obj)){
//                    const key = Object.keys(obj)[i]
//                    const item = obj[key]
//
//                    if(typeof(item)==='object'&& item!==null){
//                        insert(obj[key],label+key)
//                    }else{
//                        const path = label+key
//                        // console.log('path',path)
//                      // console.log('header',header)
//                        const index = header.indexOf(path)
//                        // if (index==-1)return
//                        const parsedItem = '"' + String(item).replace(/"/g,'""')+'"'
//                        // line[index]=parsedItem
//                        line[index]=parsedItem
//                        // console.log('key,item',key,item)
//                        // console.log('in',index)
//                    }
//                }
//
//            }
//            insert(d)
//
//            csv.push(line)
//            
//        })
//
//        const csvString = csv.map(l=>l.join(',')).join('\n')
//        console.log('csv parsed...')
//        return csvString
//    }

async function generateDataEntries(){
  const entries = []
  const {companies, members} = await new Promise((resolve,reject)=>{
        chrome.storage.local.get(data=>{
      resolve(data)
    })
  })

      console.log('members',members)
  members.forEach(({ name, url, company })=>
      entries.push(new Line(
          name.split(' ')[0],
          name.split(' ')[1]??'',
          url,
          company?.map(d=>{
              return{
                  employerName:d.company, 
                  employerFBPageUrl:d.url,
              }})??null



      ))
  )
    entries.forEach(e=>e.updateEmployers(companies))

    const body = entries.map(e=>e.csv())
    console.log('body',body)

}
function generateCsv (){
   generateDataEntries()
}

