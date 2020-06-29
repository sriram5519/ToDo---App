import React, { useState } from 'react';
import jwtDecode from 'jwt-decode';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/link-context';

import { AuthContext } from './context';

//router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//mui
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

//theme
import theme from './theme';

//compoonents
import Home from './components/Home';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Upload from './components/Upload';

function App() {
  const appTheme = createMuiTheme(theme);

  let initUser = {
    authenticated: false,
    user_name: "",
    user_id: ""
  }
  let isExpired = false;

  const token = localStorage.getItem('access_token');
  if(token){
    const decodedToken = jwtDecode(token);

    if(decodedToken.exp * 1000 > Date.now()){
      initUser = {
        user_name: decodedToken.user_name,
        user_id: decodedToken.user_id,
        authenticated: true
      }
    }
    else{
      isExpired = true
    }
  }

  const link = createUploadLink({ uri: 'http://localhost:5000/query'});
  const authLink = setContext((_, { headers }) => {
    if(!isExpired){
      return ({
        headers: {
          ...headers,
          authorization: token ?`Bearer ${token}` : ''
        }
      });
    }
    else{
      return {
        headers: {
          ...headers
        }
      }
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache(),
  });
  
  const [user, setUser] = useState(initUser);

  return (
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={appTheme}>
          <AuthContext.Provider value={{user, setUser}}>
            <Router>
              <Navbar />
              <Switch>
                <Route exact path='/'>
                  <Home />
                </Route>
                <Route path='/register' component={Register} />
                <Route path='/login' component={Login} />
                <Route path='/upload' component={Upload} />
              </Switch>
            </Router>
          </AuthContext.Provider>
      </MuiThemeProvider>
    </ApolloProvider>
  );
}

export default App;
