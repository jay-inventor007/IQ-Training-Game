import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PatternDefs } from "@/components/PatternDefs";
import { HomePage } from "@/pages/HomePage";
import { TrainingPage } from "@/pages/TrainingPage";
import { AssessmentPage } from "@/pages/AssessmentPage";
import { ProfilePage } from "@/pages/ProfilePage";

export default function App() {
  return (
    <>
      <PatternDefs />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/train" element={<TrainingPage />} />
          <Route path="/train/:domain" element={<TrainingPage />} />
          <Route path="/assess" element={<AssessmentPage />} />
          <Route path="/assess/:domain" element={<AssessmentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}
