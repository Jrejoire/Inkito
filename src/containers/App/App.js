import 'core-js';
import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useObserver } from 'mobx-react';
import StoreContext from '../../stores/AppStore';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import '../../sass/App.scss';
import Login from '../../components/Login/Login';
import Home from '../../components/Main/Home';
import Footer from '../../components/Main/Footer';
import FullDisplay from '../../components/FullDisplay/FullDisplay';
import Reader from '../../components/Reader/Reader';
import ProfilePage from '../../components/Profile/ProfilePage';
import Page404 from '../../components/Main/Page404';
import Terms from '../../components/Main/Terms';
import Privacy from '../../components/Main/Privacy';
import Faq from '../../components/Main/Faq';

import PublishPage from '../../components/Publish/PublishPage';

import CookieBanner from '../../components/Main/CookieBanner';

const App = () => {
  const store = React.useContext(StoreContext);

  useEffect(() => {
    store.temporalLogin();

    getUserDetail();
    store.toggleNavMenu(false);
    store.checkCookieConsent();
    if (store.loginLink === "") {
      store.initHSLogin();
    }

    window.addEventListener('scroll', handleScroll);
    return () => {window.removeEventListener('scroll', handleScroll) }
  })

  const handleScroll = () => {
    var st = document.documentElement.scrollTop;
    if (st > 400) {
      store.toggleLogin(false);
    }

  }

  const getUserDetail = () => {
    const accessToken = localStorage.getItem('access-token');
    const user = localStorage.getItem('users');
    if (accessToken && user) {
      store.getUserDetail(JSON.parse(accessToken), JSON.parse(user));
    } else {
      store.getUserDetail();
    }
  }

  const LoginPopUp = () => {
    return useObserver(() => {
        return <Login loginIsActive={store.loginIsActive}/>
    })
  }

  const Publish = () => {
    return useObserver(() => {
      return <PublishPage publishState={store.commentState}/>
    })
  }

  return (
    <Router>
      <Helmet>
        <html lang="en" />
        <title>Help authors get crypto currency rewards for their story | Inkito</title>
        <meta name="description" content="Inkito is a comic and novel hosting powered by the Hive blockchain. Creators can earn crypto currency for their content in proportion to the attention received." />
      </Helmet>
      <div className="App">
        <LoginPopUp />
        <Switch >
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/comics">
            <FullDisplay type={"comics"} />
          </Route>
          <Route exact path="/novels">
            <FullDisplay type={"novels"} />
          </Route>
          <Route path="/comicReader">
            <Reader type={"comics"} />
          </Route>
          <Route path="/novelReader">
            <Reader type={"novels"} />
          </Route>
          <Route path="/@*">
            <ProfilePage />
          </Route>
          <Route path="/publish*">
            <Publish />
          </Route>  
          <Route path="/terms">
            <Terms />
          </Route>
          <Route path="/privacy">
            <Privacy />
          </Route>
          <Route path="/faq">
            <Faq />
          </Route>
          <Route component={Page404} />
        </Switch>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );

}

export default App;
