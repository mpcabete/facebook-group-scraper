   // ========================================================================== csv
    // converts data into csv format
    generateCsv = (data)=>{
        const header = 'name,bio,url,type'
        let csv = [header]
        data.forEach((d,i)=>{
            const{name,bio_text, url, __isProfile:type} = d
            let bio = '--'
            if (bio_text?.text){
                bio = bio_text.text
            }
            try{

                const line = [name,bio,url,type].map((x)=>{
                    return '"' + x.replace(/"/g,'""')+'"'
                }).join(',')
                csv.push(line)
            }catch(e){console.log(e)}
            
        })
        return csv.join('\n')
    }
