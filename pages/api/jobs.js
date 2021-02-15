import jobs from '../../data/jobs'

export default async (req, res) => {
  res.statusCode = 200
  let searchText=req.query.search||"";
  searchText=searchText.trim()
  let filterText=req.query.filter||"";
  filterText=filterText.trim().toLowerCase()
  let filterType=req.query.type||"";
  filterType=filterType.trim().replace(" ","_").toLowerCase()
  //console.log(searchText+" ::: "+filterText+">>>"+filterType)
  if(searchText.length>300 || filterText.length>300 || filterType.length>300){res.json({jobs:[]})}
  let newJobs=jobs
  //Search within Jobs
    if(searchText){
      newJobs=jobs.filter((job)=>{
        return job.name.toLowerCase().indexOf(searchText) > -1
      })
    }
  //Filter within Jobs
  
  if(filterText){
    let newData =[];
    jobs.map((job,i)=>{
      let myfilter=job.items.filter((item)=>{
         let selectIt=false
         if(item[filterType] && item[filterType].toLowerCase().indexOf(filterText) > -1){
          selectIt=true
         }
         return selectIt
      })
      if(myfilter.length){
        let mykeys={};
        mykeys.total_jobs_in_hospital=myfilter.length
        mykeys.name=job.name
        mykeys.job_title=job.job_title
        mykeys.items=myfilter
        newData.push(mykeys)
      }
    })
    newJobs=newData
  }
    
  //console.log(req.query.sort)
  // @todo: implement filters and search
  // @todo: implement automated tests

  // this timeout emulates unstable network connection, do not remove this one
  // you need to figure out how to guarantee that client side will render
  // correct results even if server-side can't finish replies in the right order
  await new Promise((resolve) => setTimeout(resolve, 1000 * Math.random()))

  res.json({jobs: newJobs})
}
