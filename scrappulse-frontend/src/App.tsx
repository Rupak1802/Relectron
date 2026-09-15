import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from './store';
import Login from './pages/auth/Login';
import CollectorLayout from './components/layout/CollectorLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import GlobalAiChat from './components/chat/GlobalAiChat';

// Collector Pages
import Home from './pages/collector/Home';
import Sell from './pages/collector/Sell';
import Recyclers from './pages/collector/Recyclers';
import FairDeal from './pages/collector/FairDeal';
import Earnings from './pages/collector/Earnings';
import Simulator from './pages/collector/Simulator';
import OpportunityMap from './pages/collector/OpportunityMap';
import Profile from './pages/collector/Profile';
import Handover from './pages/collector/Handover';

// Dashboard Pages
import SupplyRadar from './pages/dashboard/SupplyRadar';
import Transactions from './pages/dashboard/Transactions';
import Fleet from './pages/dashboard/Fleet';
import Matcher from './pages/dashboard/Matcher';
import Anomalies from './pages/dashboard/Anomalies';
import Reliability from './pages/dashboard/Reliability';
import DigitalTwin from './pages/dashboard/DigitalTwin';
import Reports from './pages/dashboard/Reports';

// Second Life Pages
import SecondLifeLayout from './components/layout/SecondLifeLayout';
import MarketplaceHome from './pages/marketplace/MarketplaceHome';
import ListingDetail from './pages/marketplace/ListingDetail';
import CartCheckout from './pages/marketplace/CartCheckout';
import ListNewItem from './pages/marketplace/ListNewItem';
import MyOrders from './pages/marketplace/MyOrders';

import CommunityFeed from './pages/community/CommunityFeed';
import PostDetail from './pages/community/PostDetail';
import CreatePost from './pages/community/CreatePost';

import LensScan from './pages/lens/LensScan';
import ProjectIdeaDetail from './pages/lens/ProjectIdeaDetail';
import SavedIdeas from './pages/lens/SavedIdeas';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: ('collector' | 'recycler' | 'maker')[] }) {
  const { isAuthenticated, userRole } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // If authenticated but wrong role, go to their respective dashboard
    if (userRole === 'collector') return <Navigate to="/collector" replace />;
    if (userRole === 'recycler') return <Navigate to="/dashboard" replace />;
    if (userRole === 'maker') return <Navigate to="/marketplace" replace />;
  }

  return children;
}

function RootRedirect() {
  const { isAuthenticated, userRole } = useAppStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole === 'collector') return <Navigate to="/collector" replace />;
  if (userRole === 'recycler') return <Navigate to="/dashboard" replace />;
  if (userRole === 'maker') return <Navigate to="/marketplace" replace />;
  return <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <GlobalAiChat />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootRedirect />} />

        {/* Collector App Routes */}
        <Route path="/collector" element={<ProtectedRoute allowedRoles={['collector']}><CollectorLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="sell" element={<Sell />} />
          <Route path="recyclers" element={<Recyclers />} />
          <Route path="fair-deal" element={<FairDeal />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="opportunity-map" element={<OpportunityMap />} />
          <Route path="profile" element={<Profile />} />
          <Route path="handover/:lotId" element={<Handover />} />
        </Route>

        {/* Admin/Recycler Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['recycler']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<SupplyRadar />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="matcher" element={<Matcher />} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="reliability" element={<Reliability />} />
          <Route path="digital-twin" element={<DigitalTwin />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Second Life Module Routes */}
        <Route element={<ProtectedRoute allowedRoles={['maker']}><SecondLifeLayout /></ProtectedRoute>}>
          {/* Marketplace */}
          <Route path="/marketplace">
            <Route index element={<MarketplaceHome />} />
            <Route path="listing/:id" element={<ListingDetail />} />
            <Route path="cart" element={<CartCheckout />} />
            <Route path="checkout" element={<CartCheckout />} />
            <Route path="sell/new" element={<ListNewItem />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>

          {/* Community */}
          <Route path="/community">
            <Route index element={<CommunityFeed />} />
            <Route path="post/:id" element={<PostDetail />} />
            <Route path="new" element={<CreatePost />} />
          </Route>

          {/* Lens */}
          <Route path="/lens">
            <Route index element={<LensScan />} />
            <Route path="idea/:id" element={<ProjectIdeaDetail />} />
            <Route path="saved" element={<SavedIdeas />} />
          </Route>
        </Route>

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
