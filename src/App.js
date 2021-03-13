import React from 'react';
import {Switch, Route} from 'react-router-dom';
import { connect } from 'react/redux';
import './App.css';
import HomePage from './pages/homepage/homepage.component.jsx';
import ShopPage from './pages/shop/shop.component.jsx';
import Header from './components/header/header.component.jsx';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import {setCurrentUser} from './redux/user/user.actions';

class App extends React.Component {

  unsubscribeFromAuth = null;

  componentDidMount() {
    const {setCurrentUser} = this.props;
    /*onAuthStateChanged is a method on auth library of Firebase takes a function where the parameter is what the user state is*/
    this.unsubscribeFromAuth = auth.onAuthStateChanged ( async userAuth => {
      
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot (snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
        });
      });
    };
   setCurrentUser(userAuth);
    
    });
  };

  componentWillUnmount() {
    /*This closes the subscription*/
    this.unsubscribeFromAuth();
  };

  render() {
    return (
      <div>
        <Header/>
        <Switch>
          <Route exact path='/' component = {HomePage}/>
          <Route path='/shop' component = {ShopPage}/>
          <Route path='/signin' component = {SignInAndSignUpPage}/>
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(App);
