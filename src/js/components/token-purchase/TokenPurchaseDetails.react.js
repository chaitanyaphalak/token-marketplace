import React from 'react'
import Store from '../../store'
import { Link } from 'react-router-dom'
import TokenPurchaseActions from '../../actions/tokenpurchases'
import contractStatusToString from "../../helpers/contractStatusToString";

export default class TokenPurchaseDetails extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenPurchase: this.props.tokenPurchase, account: this.props.account }
    this._refund = this._refund.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tokenPurchase: nextProps.tokenPurchase, account: nextProps.account })
  }

  render() {
    const account = this.state.account || {}
    const tokenPurchase = this.state.tokenPurchase;
    const status = contractStatusToString(tokenPurchase)
    const isOwner = tokenPurchase.purchaser === account.address
    return (
      <div ref="tokenPurchaseDetails" className={"col " + this.props.col}>
        <div className="card">
          <div className="card-content">
            <div className="row valign-wrapper">
              <div className="col s10 valign"><h3 className="title">{tokenPurchase.tokenSymbol} token purchase</h3></div>
              <div className="col s2 valign"><span className={`chip ${status}-chip`}>{status}</span></div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <label className="active">Token Purchase</label>
                <p className="labeled">{tokenPurchase.address}</p>
              </div>
              <div className="input-field col s6">
                <label className="active">Purchaser</label>
                <p className="labeled">{tokenPurchase.purchaser}</p>
              </div>
              { tokenPurchase.transactionHash ?
                <div className={"input-field col " + (tokenPurchase.seller ? 's6' : 's12 ')}>
                  <label className="active">Confirmed Transaction</label>
                  <p className="labeled">
                    <a href={`https://ropsten.etherscan.io/tx/${tokenPurchase.transactionHash}`} target="blank">{tokenPurchase.transactionHash}</a>
                  </p>
                </div> : ''
              }
              { tokenPurchase.seller ?
                <div className="input-field col s6">
                  <label className="active">Seller</label>
                  <p className="labeled">{tokenPurchase.seller}</p>
                </div> : ''
              }
              <div className="input-field col s3">
                <label className="active">Requested amount of tokens</label>
                <p className="labeled">{tokenPurchase.amount.toString()}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Total Ether you will get in return</label>
                <p className="labeled">{tokenPurchase.price.toString()}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Token Name</label>
                <p className="labeled">{tokenPurchase.tokenName}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Token Symbol</label>
                <p className="labeled">{tokenPurchase.tokenSymbol}</p>
              </div>
              <div className="input-field col s12">
                <label className="active">Sharing Link</label>
                <p className="labeled">
                  <Link to={`/token-purchase/${tokenPurchase.address}`}>{window.location.origin}/token-purchase/{tokenPurchase.address}</Link>
                </p>
              </div>
            </div>
          </div>
          { isOwner ?
              <div className="card-action">
                <button className="btn btn-alert" disabled={tokenPurchase.closed} onClick={this._refund}>Refund</button>
              </div>
            : ''
          }
        </div>
      </div>
    );
  }

  _refund(e) {
    e.preventDefault()
    const tokenPurchase = this.state.tokenPurchase;
    Store.dispatch(TokenPurchaseActions.refund(tokenPurchase.address, tokenPurchase.purchaser))
  }
}
