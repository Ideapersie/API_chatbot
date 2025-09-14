import Header from './Header';

const Layout = ({ children, onApiKeyUpdate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onApiKeyUpdate={onApiKeyUpdate} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;