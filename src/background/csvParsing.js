
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

function generateCsv(members){
  console.log('members',members)
  const entries = []
  // const {members} = data
    // await new Promise((resolve,reject)=>{
        // chrome.storage.local.get(data=>{
      // resolve(data)
    // })
  // })

      console.log('members',members)
  members.forEach(mem =>{
    mem.employers = 
      mem.company?.filter(d=>d.company != 'no <a>').map(d=>{
              return d.company+'('+ d.url+')' }).join(',') ??''
  })
  members.forEach(({ name, url, employers })=>
      entries.push(new Line(
          name.split(' ')[0],
          name.split(' ')[1]??'',
          url,
        employers



      ))
  )
    // entries.forEach(e=>e.updateEmployers(companies))
    const header = '"First Name","Last Name","Profile URL","Possible Employers"\n'
    const body = entries.map(e=>e.csv()).join('\n')
  const csv = header + body

  return csv
}

function generateCompaniesCsv(companies){

  console.log("companies", companies);
  const entries = [];

  companies.filter(c=>c.isChecked).forEach(({ name, url, members, data }) =>
    entries.push(
      [
        name,
        members.join(","),
        data?.emails?.join(',') ?? "",
        data?.domains?.join(',') ?? "",
        url,
      ]
      // new Line(name.split(" ")[0], name.split(" ")[1] ?? "", url, employers)
    )
  );
  // entries.forEach(e=>e.updateEmployers(companies))
  const header = ['Name','Members', 'Emails', 'Domains', 'URL'].map(parse).join(',')+'\n'
  const body = entries.map((e) => e.map(parse).join(',')).join("\n");
  const csv = header + body;

  return csv;
}

function parse(item){
 
      const result = '"' + String(item).replace(/"/g, '""') + '"';
      // console.log('result',result)
      return result;
  
}
