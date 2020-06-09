import React from 'react';
import StoreContext from '../../stores/AppStore';
import { useHistory } from "react-router-dom";

import '../../sass/components/Nav.scss';

const NavMenu = ({ navMenuIsActive, user }) => {
  const store = React.useContext(StoreContext);
  const history = useHistory();
  
  if (user && user.account) {
    let userData = JSON.parse(user.account.posting_json_metadata);
    return (
      <li className="login user">
        <button className="hide" onClick={() => store.toggleNavMenu()}>
          <img src={userData.profile.profile_image} alt=" " className="user-thumbnail pointer"/>
        </button>
        <div className={navMenuIsActive ? "user-menu flex col" : "user-menu flex col hidden"}>
          <button className="hide reset" onClick={() => { history.push(`/@${user.name}`); window.location.reload() }}>
            <p className="pointer">Profile</p>
          </button>
          <button className="hide reset" onClick={() => { history.push(`/publish?user=${user.name}`); window.location.reload() }}>
            <p className="pointer">Publish</p>
          </button>
          <a href={`https://wallet.hive.blog/@${user.name}/transfers`} target="_blank" rel="noopener noreferrer" title="Hive wallet page">Wallet</a>
          <button className="hide reset" onClick={store.logOut}>
            <p className="pointer">Logout</p>
          </button>
        </div>
      </li>
    )
  } else {
    return (
      <li className="login flex row">
        <p className="pointer focus" onClick={() => { store.toggleLogin() }}><button className="hide">Login</button></p>
        <p>/</p>
        <a href="https://hiveonboard.com/create-account?redirect_url=https://inkito.io" title="Hive register page">Register</a>
      </li>
    )
  }
}

export default NavMenu;
