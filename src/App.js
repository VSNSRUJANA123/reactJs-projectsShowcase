import './App.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const getAllViews = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'INPROGRESS',
}

class App extends Component {
  state = {
    activeState: categoriesList[0].id,
    activeView: getAllViews.initial,
    getProjects: [],
  }

  componentDidMount() {
    this.getFetchData()
  }

  getFetchData = async () => {
    const {activeState} = this.state

    this.setState({activeView: getAllViews.in_progress})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeState}`
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const formatData = data.projects.map(items => ({
        id: items.id,
        imageUrl: items.image_url,
        name: items.name,
      }))
      this.setState({activeView: getAllViews.success, getProjects: formatData})
    } else {
      console.log('failure state')
      this.setState({activeView: getAllViews.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderSuccess = () => {
    const {getProjects} = this.state
    return (
      <ul className="projects-container">
        {getProjects.map(items => (
          <li key={items.id}>
            <img src={items.imageUrl} alt={items.name} />
            <p key={items.name}>{items.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  retry = () => {
    this.setState({activeView: getAllViews.success})
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.retry}>Retry</button>
    </div>
  )

  switchCase = () => {
    const {activeView} = this.state
    switch (activeView) {
      case getAllViews.success:
        return this.renderSuccess()
      case getAllViews.failure:
        return this.renderFailure()
      case getAllViews.in_progress:
        return this.renderLoader()
      default:
        return ''
    }
  }

  changeProject = e => {
    this.setState({activeState: e.target.value}, this.getFetchData)
  }

  render() {
    const {activeView} = this.state
    // console.log(activeView)
    return (
      <div>
        <div className="bg-container">
          <img
            className="star-img"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <select onChange={this.changeProject} className="select-container">
          {categoriesList.map(items => (
            <option key={items.id} value={items.id}>
              {items.displayText}
            </option>
          ))}
        </select>
        {this.switchCase()}
      </div>
    )
  }
}

export default App
