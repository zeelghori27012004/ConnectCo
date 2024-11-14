import { Routes, Route } from "react-router-dom"
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";

export const UserContext = createContext({})

const App = () => {

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {

    let userInSession = lookInSession("user");
    let themeInSession = lookInSession("theme");

    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    
    // if (themeInSession) {
    //     setTheme(() => {

    //         document.body.setAttribute('data-theme', themeInSession);

    //         return themeInSession;
        
    //     })
    // } else {
    //     document.body.setAttribute('data-theme', theme)
    // }

}, [])



  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        {/* <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:blog_id" element={<Editor />} /> */}
        <Route path="/" element={<Navbar />}>
          {/* <Route index element={<HomePage />} />
          <Route path="dashboard" element={<SideNav />} >
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="notifications" element={<Notifications />} /> */}
          {/* </Route> */}
          {/* <Route path="settings" element={<SideNav />} >
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route> */}
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          {/* <Route path="search/:query" element={<SearchPage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="blog/:blog_id" element={<BlogPage />} />
          <Route path="*" element={<PageNotFound />} /> */}
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}
export default App;