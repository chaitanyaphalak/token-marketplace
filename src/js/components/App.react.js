import React from 'react'
import Home from './Home'
import Store from '../store'
import Modal from './Modal.react'
import Error from './Error.react'
import Navbar from './Navbar.react'
import NetworkActions from '../actions/network'
import NewTokenSale from './containers/NewTokenSale.react'
import ShowTokenSale from './containers/ShowTokenSale.react'
import ShowTokenPurchase from './containers/ShowTokenPurchase.react'
import NewTokenPurchase from './containers/NewTokenPurchase.react'
import { Switch, Route } from 'react-router-dom'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { connected: null, couldAccessAccount: null, fetching: false }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(NetworkActions.checkConnection())
    Store.dispatch(NetworkActions.checkAccountAccess())
  }

  render() {
    const connected = this.state.connected
    const couldAccessAccount = this.state.couldAccessAccount
    const fetching = connected && couldAccessAccount && this.state.fetching !== null

    return (
      <div ref="app">
        <Navbar/>
        <div className="main-container container">
          <Error/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/token-sale/" exact component={NewTokenSale}/>
            <Route path="/token-sale/:address" component={ShowTokenSale}/>
            <Route path="/token-purchase/" exact component={NewTokenPurchase}/>
            <Route path="/token-purchase/:address" component={ShowTokenPurchase}/>
          </Switch>
        </div>
        <Modal open={fetching} progressBar message={this.state.fetching}/>
        <Modal dark open={!connected} message={'Please access using MetaMask'}/>
        <Modal dark open={connected && !couldAccessAccount} message={'Please unlock your account on MetaMask'}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.app) {
      const state = Store.getState()
      this.setState({ fetching: state.fetching, connected: state.network.connected, couldAccessAccount: state.network.couldAccessAccount })
    }
  }
}
