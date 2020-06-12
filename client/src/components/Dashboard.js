import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  renderContent() {
    console.log(this.props.auth);
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <a href='/auth/twitch'>Not logged in...</a>;
      default:
        return <p>Logged in as: {this.props.auth.display_name}</p>;
    }
  }

  render() {
    return (
      <div className='flex items-center justify-center content-area '>
        <div className='text-center bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10'>
          <h1 className='text-center'>{this.renderContent()}</h1>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
