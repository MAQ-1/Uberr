import React, { Suspense, lazy } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import UserProtectedWrapper from './pages/UserProtectedWrapper.jsx'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper.jsx'

const Start = lazy(() => import('./pages/Start'))
const CaptainLogin = lazy(() => import('./pages/CaptainLogin'))
const CaptainSignup = lazy(() => import('./pages/CaptainSignup'))
const UserLogin = lazy(() => import('./pages/UserLogin'))
const UserSignup = lazy(() => import('./pages/UserSignup'))
const Home = lazy(() => import('./pages/Home'))
const UserLogout = lazy(() => import('./pages/UserLogout.jsx'))
const CaptainLogout = lazy(() => import('./pages/CaptainLogout.jsx'))
const CaptainHome = lazy(() => import('./pages/CaptainHome.jsx'))
const Riding = lazy(() => import('./pages/Riding.jsx'))
const CaptainRiding = lazy(() => import('./pages/CaptainRiding.jsx'))


function App() {
  const fallback = <div className="p-4 text-center">Loading...</div>

  return (
    <>
      {/* Route-level suspense keeps the initial bundle smaller with lazy-loaded pages. */}
      <Suspense fallback={fallback}>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-signup" element={<CaptainSignup />} />

          <Route
            path="/home"
            element={
              <UserProtectedWrapper>
                <Home />
              </UserProtectedWrapper>
            }
          />

          <Route
            path="/users/logout"
            element={
              <UserProtectedWrapper>
                <UserLogout />
              </UserProtectedWrapper>
            }
          />

          <Route
            path="/captains/logout"
            element={
              <CaptainProtectedWrapper>
                <CaptainLogout />
              </CaptainProtectedWrapper>
            }
          />

          <Route
            path="/captain-home"
            element={
              <CaptainProtectedWrapper>
                <CaptainHome />
              </CaptainProtectedWrapper>
            }
          />

          <Route path="/riding" element={<Riding />} />

          <Route
            path="/captain-riding"
            element={
              <CaptainProtectedWrapper>
                <CaptainRiding />
              </CaptainProtectedWrapper>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
