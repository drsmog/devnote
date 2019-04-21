import axios from 'axios';

export default {
  async getIssues() {
    const response = await axios({
      url: 'https://api.github.com/graphql',
      method: 'post',
      headers: {
        Authorization: 'bearer b7b951dfe2f6da88597e0549c5ffbebb65be9dfe'
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
        Authorization: 'bearer b7b951dfe2f6da88597e0549c5ffbebb65be9dfe'
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
    return response.data.data.createIssue.issue.id
  }
};
