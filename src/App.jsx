import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import DashboardLayout from "./components/layout/dashboardLayout";
import Participants from "./pages/participants";
import Events from "./pages/events";
import Results from "./pages/results";
import Rep from "./pages/rep";
import PrivateRoute from "./components/PrivateRoute";
import EventType from "./pages/event_type";
import EventRegistration from "./pages/event_registration";
import ScoreTable from "./pages/score_table";
import College from "./pages/college";
import Settings from "./pages/settings";

function App() {


  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/score-table" element={<ScoreTable />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/type" element={<EventType />} />
          <Route path="/event/registration" element={<EventRegistration />} />
          <Route path="/results" element={<Results />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/college" element={<College />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
