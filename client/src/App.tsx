import { Route, Routes } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";

import "./globals.css";
import SigninForm from "./auth/forms/SigninForm";
import SignupForm from "./auth/forms/SignupForm";
import RootLayout from "./root/RootLayout";
import {
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
  UsersPage,
} from "./root/pages";
import { Toaster } from "./components/ui/toaster";
import PersistLogin from "./auth/PersistLogin";
function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/users/:id/*" element={<UsersPage />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:id" element={<EditPost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/profile/:id/*" element={<Profile />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
}
export default App;
