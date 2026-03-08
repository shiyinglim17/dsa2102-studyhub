// App.tsx — DSA2102 Midterm Study Hub
// Design: "Golden Hour Study Retreat" — Bali treehouse aesthetic
// Layout: Fixed sidebar (dark mahogany) + scrollable main content area

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { Sidebar } from "./components/Sidebar";
import { useState } from "react";
import HomeView from "./views/HomeView";
import ChapterView from "./views/ChapterView";
import TopicView from "./views/TopicView";
import ProgressView from "./views/ProgressView";
import FormulaView from "./views/FormulaView";
import SearchView from "./views/SearchView";
import QuizView from "./views/QuizView";

export type ViewType = 'home' | 'chapter' | 'topic' | 'progress' | 'formulas' | 'search' | 'quiz';

function StudyHub() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [currentChapter, setCurrentChapter] = useState<string>('ch1');
  const [currentTopic, setCurrentTopic] = useState<string>('');

  const handleNavigate = (view: string, chapterId?: string, topicId?: string) => {
    setCurrentView(view as ViewType);
    if (chapterId) setCurrentChapter(chapterId);
    if (topicId !== undefined) setCurrentTopic(topicId);
    else if (view === 'chapter') setCurrentTopic('');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      case 'chapter':
        return <ChapterView chapterId={currentChapter} onNavigate={handleNavigate} />;
      case 'topic':
        return <TopicView chapterId={currentChapter} topicId={currentTopic} onNavigate={handleNavigate} />;
      case 'progress':
        return <ProgressView onNavigate={handleNavigate} />;
      case 'formulas':
        return <FormulaView onNavigate={handleNavigate} />;
      case 'search':
        return <SearchView onNavigate={handleNavigate} />;
      case 'quiz':
        return <QuizView chapterId={currentChapter} onNavigate={handleNavigate} />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'oklch(0.97 0.02 85)' }}>
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        currentChapter={currentChapter}
        currentTopic={currentTopic}
        onNavigate={handleNavigate}
      />
      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ProgressProvider>
          <TooltipProvider>
            <Toaster />
            <StudyHub />
          </TooltipProvider>
        </ProgressProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
