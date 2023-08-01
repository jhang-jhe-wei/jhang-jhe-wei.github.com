import { Octokit } from '@octokit/core'

const GithubAPI = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

export default GithubAPI
