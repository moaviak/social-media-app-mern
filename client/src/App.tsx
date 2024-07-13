import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthLayout from "./auth/AuthLayout";

import "./globals.css";
import SigninForm from "./auth/forms/SigninForm";
import SignupForm from "./auth/forms/SignupForm";
import { Toaster } from "./components/ui/toaster";
import PersistLogin from "./auth/PersistLogin";
import { PulseLoader } from "react-spinners";

// Lazy load components
const RootLayout = lazy(() => import("./root/RootLayout"));
const CreatePost = lazy(() => import("./root/pages/CreatePost"));
const EditPost = lazy(() => import("./root/pages/EditPost"));
const Explore = lazy(() => import("./root/pages/Explore"));
const Home = lazy(() => import("./root/pages/Home"));
const PostDetails = lazy(() => import("./root/pages/PostDetails"));
const Profile = lazy(() => import("./root/pages/Profile"));
const Saved = lazy(() => import("./root/pages/Saved"));
const UpdateProfile = lazy(() => import("./root/pages/UpdateProfile"));
const UsersPage = lazy(() => import("./root/pages/UsersPage"));
const ChatsPage = lazy(() => import("./root/pages/ChatsPage"));

function App() {
  return (
    <main className="flex h-screen">
      <Suspense fallback={<PulseLoader color="#fff" />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SigninForm />} />
            <Route path="/sign-up" element={<SignupForm />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/chats/*" element={<ChatsPage />} />
              <Route path="/users/:id/*" element={<UsersPage />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/update-post/:id" element={<EditPost />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/profile/:id/*" element={<Profile />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>

      <Toaster />
    </main>
  );
}

export default App;
