export type Job = {
  id: string
  title: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  experience: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  isActive: boolean
}

export async function getJobs(): Promise<Job[]> {
  return []
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const jobs = await getJobs()
  return jobs.find(job => job.id === id)
}
