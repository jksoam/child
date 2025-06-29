import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Navbar } from './components/layout/Navbar';
import { StoriesFeed } from './components/feed/StoriesFeed';
import { CreateStoryModal } from './components/story/CreateStoryModal';
import { useStories } from './hooks/useStories';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const { addStory } = useStories();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateStory = async (caption: string, imageFile: File) => {
    if (user) {
      await addStory(caption, imageFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCreateStory={() => setIsCreateModalOpen(true)} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <StoriesFeed />
      </main>

      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateStory}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  return user ? <MainApp /> : <AuthScreen />;
};

export default App;