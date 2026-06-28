import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedPage from "./pages/FeedPage";
import MainLayout from "./components/Layouts/MainLayout";
import NavBarLayout from "./components/Layouts/NavBarLayout";
import MoviePage from "./pages/MoviePage";
import TeamPage from "./pages/TeamPage";
import MyReviews from "./pages/MyReviews";
import AboutUs from "./pages/AboutUs";
import { AuthProvider } from "./components/providers/AuthContext";
import WatchMovie from "./pages/WatchMovie";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-movie-bg flex items-center justify-center text-movie-accent animate-pulse">
                      Loading Preview...
                    </div>
                  }
                >
                  <HomePage />
                </Suspense>
              </MainLayout>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense
                    fallback={
                      <div className="min-h-screen bg-movie-bg flex items-center justify-center text-movie-accent animate-pulse">
                        Loading MovieBook Dashboard...
                      </div>
                    }
                  >
                    <HomePage />
                  </Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <NavBarLayout>
                  <ProfilePage />
                </NavBarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FeedPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/movies/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MoviePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <TeamPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/myreviews"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MyReviews />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aboutus"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AboutUs />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchmovie/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <WatchMovie />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
