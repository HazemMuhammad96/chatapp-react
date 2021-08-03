import React, { useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Chats from './pages/chats';
import { useEffect } from "react";




function App() {
  const [userLogged, setUserLogged] = useState(undefined)
  useEffect(() => {
    setUserLogged(localStorage.getItem("currentUserId"))

  })


  if (userLogged)
    return (
      <Router>
        <>
          <Switch>
            <Route path="/chats/:chatId">
              <Chats />
            </Route>
            <Route path="/chats">
              <Chats />
            </Route>
            <Route>
              <Redirect to="/chats" />
            </Route>
          </Switch>
        </>
      </Router>
    )
  else
    return (
      <Router>
        <>
          <Switch>
            <Route path="/signIn">
              <SignIn />
            </Route>
            <Route path="/signUp">
              <SignUp />
            </Route>
            <Route>
              <Redirect to="/signIn" />
            </Route>
          </Switch>
        </>
      </Router>
    )
}



export default App;

{/* <Router>
<>
  <Switch>
    <Route path="/signIn">
      {userLogged ? <Redirect to="/chats" /> : <SignIn />}
    </Route>
    <Route path="/signUp">
      {userLogged ? <Redirect to="/chats" /> : <SignUp />}
    </Route>
    <Route path="/chats/:chatId">
      {userLogged ? <Chats /> : <Redirect to="/signIn" />}
    </Route>
    <Route path="/chats">
      {userLogged ? <Chats /> : <Redirect to="/signIn" />}
    </Route>
    <Route>
      <Redirect to="/chats" />
    </Route>
  </Switch>
</>
</Router> */}