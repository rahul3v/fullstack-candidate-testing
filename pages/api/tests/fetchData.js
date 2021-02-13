import jobs from '../../../data/jobs'

export default async (req, res) => {
  let result=jobs?true:false;
  await new Promise((resolve) => setTimeout(resolve, 1000 * Math.random()))

  res.json({test:"Data is fetching",result: result})
}
