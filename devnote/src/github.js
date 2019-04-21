import axios from 'axios';

export default {
  setToken(token) {
    this.token = token;
  },
  async getIssues() {
    const response = await axios({
      url: 'https://api.github.com/graphql',
      method: 'post',
      headers: {
        Authorization: `bearer ${this.token}`
      },
      data: {
        query: `
                  query {
                    repository(owner:"drsmog", name:"devnote-storage") {
                      issues(last:20) {
                        totalCount
                        edges {
                          node {
                            id
                            title
                            bodyText
                          }
                        }
                      }
                    }
                  }
                `
      }
    });
    return response.data.data.repository.issues.edges;
  },

  async createIssue(issue) {
    const response = await axios({
      url: 'https://api.github.com/graphql',
      method: 'post',
      headers: {
        Authorization: `bearer ${this.token}`
      },
      data: {
        query: `
                mutation{
                    createIssue(input:{
                    repositoryId:"MDEwOlJlcG9zaXRvcnkxODIzOTYyNTI=",
                    title:"${issue.title}"
                    body:"${issue.bodyText}"
                    }) {
                        issue {
                            id
                        }
                    }
                }`
      }
    });
    return response.data.data.createIssue.issue.id;
  }
};
