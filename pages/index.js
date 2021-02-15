import React,{ useState,useEffect } from 'react'
import moment from 'moment';
import jobs from '../data/jobs.json';
import filters from "../data/filters.json";

// number format logic
export function numFormat(num){
  return num.toString().split('').reverse().join("").replace(/(...)/g,"$1,").split('').reverse().join("").replace(/(^,)/,"")
}
 
 //sort logic
export const sortFun=(data,order)=>{
  let i=0;
  order=order?order.toLowerCase():'';
  if(order=="asc")i=1
  if(order=="des")i=-1
  if(i){
    let sortedData=[...data];
    sortedData.sort((a,b)=>a.name>b.name?1*i:-1*i)
    return sortedData;
  }
   return null;
}

const Index = ({ jobs,filters})=>{
  const [showJob, setShowJob] = useState([])
  const [jobsData, setJobsData] = useState(jobs)
  const [jobsFilterData, setJobsFilterData] = useState(jobs)
  const [searchData, setSearchData] = useState("")
  const [filterData, setfilterData] = useState(filters)
  const [showSort, setShowSort] = useState("NONE")
  const [showFilter, setShowFilter] = useState([])
  const [showFilterText, setShowFilterText] = useState([])
  const [showSearch, setShowSearch] = useState("")
  const [model,setModel]=useState(false)
  const [modelKey,setModelKey]=useState("")
  const [totalJob,setTotalJob]=useState(0)

  useEffect(()=>{
    let sortedData=sortFun(jobsFilterData,showSort)
    if(sortedData)setJobsFilterData(sortedData)
    //console.log(jobsData);
  },[showSort])

  //Filter logic
  useEffect(()=>{
    let newData =[];
    let total=0;
    
    if(!showFilterText.length){
      if(jobsFilterData.length<jobsData.length){
        let sortedData=sortFun(jobsData,showSort)
        if(sortedData)setJobsFilterData(sortedData)
      }
      jobsData.map((job,i)=>{
        total=total+job.total_jobs_in_hospital*1
      })
      setTotalJob(total) 
      return;
    }
    //let filterText=["internship","junior"];
    let filterText=showFilterText;
    jobsData.map((job,i)=>{
      let myfilter=job.items.filter((item)=>{
         return showFilter.every((filterType)=>{
            filterType=filterType.toLowerCase()
            let fText;
            if(filterText.length>1)fText=filterText.join("|")
            else {fText=filterText[0]}
            fText=fText?fText.toLowerCase():"";
            if(!filterData[filterType]||!filterData[filterType].some((typeData)=>{return new RegExp(typeData.key.toLowerCase()).test(fText)}))return true
            if(new RegExp(fText).test((item[filterType]+"").toLowerCase())){return true}
            return false
         })
      })
      if(myfilter.length){
        total+=myfilter.length
        let mykeys={};
        mykeys.name=job.name
        mykeys.job_title=job.job_title
        mykeys.items=myfilter
        mykeys.total_jobs_in_hospital=myfilter.length
        newData.push(mykeys)
      }
    })
    let sortedData=sortFun(newData,showSort)
    if(sortedData)setJobsFilterData(sortedData)
    else setJobsFilterData(newData)
    setTotalJob(total)
    console.log(showFilter)
    console.log(showFilterText)
  },[showFilter,showFilterText])

  //offline Search job logic
  useEffect(()=>{
    let filters=showSearch.toLowerCase().match(/(location|department|experience|jobtype):(asc|des|none)/ig);
    let searches=showSearch.toLowerCase().replace(/\w{1,20}:(asc|dec|none)/ig,"").match(/\w{1,20}/ig);
    console.log(filters)
    console.log(searches)
    console.log("online :"+navigator.onLine)
    if(navigator.onLine){
      //To fetch searched data directly from server
      showSearch && fetchJobs(setSearchData,showSearch)
    }else{
      let newJobs=jobsData.filter((job,i)=>{
        //get all the values of a every job in a hospital to make a search query
        /*let jdata=[job.name,job.job_title];
        job.items.map((data)=>{
          jdata=[...jdata,Object.values(data)]
        })
        console.log(jdata.toString())
        //return jdata.toString().toLowerCase().indexOf(searches) > -1
        */
        return job.name.toLowerCase().indexOf(searches) > -1
      })
      setSearchData(newJobs)
    }
  },[showSearch])
    return (
    <>
      <nav>
        <div className="navStart">
          <a className="navicon" onClick={()=>{}}>☰</a>
          <a className="nowrap" style={{color:"#4f9afb"}} href="#"><h1>HEALTH EXPLORER</h1></a>
        </div>
        <div className="navCenter mobile flex">
            <a>PROFILE</a>
            <a>JOBS</a>
            <a>PROFESSIONAL NETWORK</a>
            <a>LOUNGE</a>
            <a>SALARY</a>
        </div>
        <div className="navEnd">
            <a className="btn mobile">CREATE JOB</a>
            <a className="profileImg" data-total="2">JO</a>
            <a className="mobile">LOGOUT</a>
        </div>
      </nav>
      <div className="container">
      <div className="searchBar">
         <svg width="24" height="24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
         <input type="text" placeholder="Search for any job, title, keywords or company" value={showSearch}
         onInput={(e)=>{
           let searchBar=e.target.parentElement.querySelector(".searchData").classList;
           if(e.target.value){
              e.target.nextElementSibling.classList.add("show")
              searchBar.add("show")
           }else{
            e.target.nextElementSibling.classList.remove("show")
            searchBar.remove("show")
           }
           setShowSearch(e.target.value.trim())
         }}/>
         <span className="close" onClick={(e)=>{
            setShowSearch('');
            e.target.classList.remove("show");
            e.target.nextElementSibling.classList.remove("show");
          }}>&times;</span>
         <div className="searchData">
           {showSearch && searchData.length?searchData.map((job,i) => (
            <div className="miniJob">
              <a data-key={i} onClick={(e)=>{}}>
                <div className="imgbox">{job.name.slice(0,2).toUpperCase()}</div>
                <div><span>{job.total_jobs_in_hospital}</span> jobs for {job.name}</div>
              </a>
            </div>)):"No Data Found !"}
         </div>
      </div>
      <div style={{boxShadow:'0 0 4px #fff4',display:"flex",flexWrap:"wrap"}}>
      <div className="showFilters mobile">
      {Object.keys(filters).map(key=>{
          return (
              <>
              <div>
              <h1 onClick={(e)=>{setModelKey(e.target.innerText.toLowerCase().replace(' ',"_")),setModel(true)}}><b>{key.replace('_'," ").toUpperCase()}</b></h1>
              <div className="filterText" onClick={(e)=>{
                      if(e.target.tagName!="A")return;
                      e.target.classList.toggle("active");
                      let key=e.target.innerText;
                      if(showFilterText.includes(key)){
                        setShowFilterText(showFilterText.filter((i)=>i!=key))
                      }else{
                        setShowFilterText([...showFilterText,key])
                      }
                      console.log(showFilterText+ "::" +key)
                    }}>
                {filters[key].map((job) => (
                    <a data-count={numFormat(job.doc_count)}>{job.key}</a>
                ))}
             </div>
             </div>
            </>
        )
      })
      }
        </div>
      <div className="showJobs">
          <div className="myFilters">
              <div><b>{numFormat(totalJob)}</b> job postings</div>
              <div className="filters">
                  <div className="selector" onClick={(e)=>{
                      let myText=e.target.parentElement.classList.contains('selectorBox')?e.target.innerText:showSort;
                      setShowSort(myText)
                      }}>
                    <div className="none">Sort by : {showSort}</div>
                    <div className="selectorBox">
                        <div>ASC</div>
                        <div>DES</div>
                        <div>NONE</div>
                    </div>
                  </div>
                    <div className="filterOptions mobile" onClick={(e)=>{
                      if(e.target.tagName!="A")return;
                      e.target.classList.toggle("active");
                      let key=e.target.innerText.replace(" ","_");
                      if(showFilter.includes(key)){
                        setShowFilter(showFilter.filter((i)=>i!=key))
                      }else{
                        setShowFilter([...showFilter,key])
                      }
                    }}>
                      <a>Location</a>
                      <a>Role</a>
                      <a>Job Type</a>
                      <a>Department</a>
                      <a>Education</a>
                      <a>Experience</a>
                    </div>
              </div>
          </div>
          <div className="myJobs">
            {jobsFilterData.map((job,i) => (
            <div className="miniJob">
               <a data-key={i} onClick={(e)=>{
                e.currentTarget.nextSibling.classList.toggle("show");
                let key =e.currentTarget.dataset.key*1;
                if(showJob.includes(key)){
                  setShowJob(showJob.filter((i)=>i!=key))
                }else{
                  setShowJob([...showJob,key])
                }

              }}>
                <div className="imgbox">{job.name.slice(0,2).toUpperCase()}</div>
                <div><span>{job.total_jobs_in_hospital}</span> jobs for {job.name}</div>
              </a>
              <div className="miniJobData">
                  {  showJob.includes(i) &&
                      job.items.map((miniJobs)=>{
                        return (
                            <div className="miniData">
                                <div className="miniDataDetails" onClick={(e)=>e.currentTarget.nextSibling.classList.toggle("show")}>
                                    <div>
                                        <h1>{miniJobs.job_title}</h1>
                                        <p>{miniJobs.job_type} | ${miniJobs.salary_range.join(" - $")} an hour | {miniJobs.city}</p>
                                    </div>
                                    <div>{moment(miniJobs.created,moment.ISO_8601).fromNow()}</div>
                                </div>
                                <div className="jobDetails">
                                    <div>
                                        <div>
                                            <h1>Department:</h1>
                                            <div>{miniJobs.department.join(", ")}</div>
                                        </div>
                                        <div>
                                            <h1>Experience:</h1>
                                            <div>{miniJobs.experience}</div>
                                        </div>
                                        <div>
                                            <h1>Hours / Shifts:</h1>
                                            <div>{miniJobs.hours} hours / {miniJobs.work_schedule}</div>
                                        </div>
                                        <div>
                                            <h1>Summary:</h1>
                                            <div>{miniJobs.description}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <a className="btn" style={{color:"white",background:"#197dff"}}>Job Details</a>
                                        <a className="btn">Save Job</a>
                                    </div>
                                </div>
                            </div>
                            )
                      })
                  }
              </div>
              </div>
            ))}
          </div>
      </div>
      </div>
      </div>
      {model && (
        <div className="modal-box">
        <div className="modal">
          <div className="sticky">
          <h1>{modelKey.replace('_'," ").toUpperCase()}</h1>
          <span className="close" onClick={()=>setModel(false)}>&times;</span>
          </div>
          <ul className="modelData">
                  {filterData[modelKey] && filterData[modelKey].map((job) => (
                      <li>{job.key} 
                          <span style={{color:"rgba(0,0,0,0.6)",padding:"0 8px",fontSize:'12px'}}>{numFormat(job.doc_count)}</span>
                      </li>
                  ))}
               </ul>
        </div>
        </div>
       )
      }
      
      <footer>
          <div className="footer">
          {
          Object.keys(foot).map(key=>(
              <div>
                <h1><b>{key}</b></h1>
                {foot[key].map((k) => (
                  <p><a>{k}</a></p>
                  ))
                }
             </div>
            )
          )}
          </div>
      </footer>
    </>
    )
  }

  const foot={
    "About Us":["We are a team of nurses, doctors, technologists and executives dedicatedto help nurses find jobs that they love","All copyrights reserved @ 2020 - Helth Explorer"],
    "Sitemap":["Nurses","Employers","Social Networking","Jobs"],
    "Privacy":["Terms of Use","Privacy policy","Cookie Policy"]
}
  export async function getStaticProps() {
    // Call an external API endpoint to get jobs.
    // You can use any data fetching library
    /*const res = await fetch('http://localhost:3000/api/jobs?sort=asc')
    const res2 = await fetch('http://localhost:3000/api/filters')
    const job = await res.json()
    const jobs = job.jobs
    const filters = await res2.json()*/
    
    return {
      props: {
        jobs,
        filters
      },
    }
  }
  
  //Client-Side dataFetch
  async function fetchJobs(updateJobs,showSearch) {
    const res = await fetch(`/api/jobs?search=${showSearch.toLowerCase()}`)
    const job = await res.json()
    const jobs = job.jobs
    updateJobs(jobs)
  }
export default Index