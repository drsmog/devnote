import React, { Component } from 'react';
import github from './github';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  editor = undefined;
  state = {
    issues: [],
    selectedIssue: {
      id: undefined,
      title: '',
      bodyText: ''
    }
  };
  async componentDidMount() {
    //download issues
    const issues = await github.getIssues();
    this.setState({ issues: issues });

    //select first one or set on new
    if (issues.length > 0) {
      this.onIssueSelect(issues[0].node);
    } else {
      this.onNewNote();
    }
  }
  handleDescriptionChange(text) {
    const updatedIssue = {
      ...this.state.selectedIssue,
      bodyText: text
    };
    this.setState({ selectedIssue: updatedIssue });
  }
  handleTitleChange(e) {
    const updatedIssue = {
      ...this.state.selectedIssue,
      title: e.target.value
    };
    this.setState({ selectedIssue: updatedIssue });
  }
  onIssueSelect(issue) {
    this.setState({ selectedIssue: issue });
    if(this.editor){
      this.editor.render();
    }
  }
  onNewNote() {
    const newIssue = { id: null, title: '', bodyText: ' ' };
    this.setState({ selectedIssue: newIssue });
  }
  async onSaveIssue() {
    if (!this.state.selectedIssue.id) {
      const issueId = await github.createIssue(this.state.selectedIssue);
      this.setState({
        selectedIssue: { ...this.state.selectedIssue, id: issueId }
      });
    } else {
      console.log('todo implement update');
    }
  }
  getInsance(e) {
    this.editor = e;
  }
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <ul>
                {this.state.issues.map(item => {
                  const issue = item.node;
                  return (
                    <li
                      key={issue.id}
                      onClick={() => this.onIssueSelect(issue)}
                    >
                      {issue.title}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-sm-12 col-md-6">
              <button onClick={() => this.onNewNote()}>New Note</button>
              <input
                type="text"
                value={this.state.selectedIssue.title}
                onChange={e => this.handleTitleChange(e)}
              />
              <SimpleMDE
                getMdeInstance={(e)=>this.getInsance(e)} // <-- set callback prop
                onChange={e => this.handleDescriptionChange(e)}
                value={this.state.selectedIssue.bodyText}
              />
              <button onClick={() => this.onSaveIssue()}>Save Changes</button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}


export default App;
