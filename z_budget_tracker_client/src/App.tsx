import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import { ToastBar, Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <NavBar></NavBar>
      <div className="p-3 pt-10 w-[82%] mx-auto">
        <Outlet></Outlet>
      </div>
      <Toaster
        gutter={12}
        // containerStyle={{
        //   margin: '8px',
        //   position: 'absolute',
        //   top: '250px',
        // }}
        toastOptions={{
          success: {
            duration: 1500,
          },
          error: {
            duration: 3000,
          },

          style: {
            fontSize: '18px',
            maxWidth: '500px',
            padding: '20px 20px',
            borderRadius: '3px',
            border: '2px solid var(--color-neutral-400)',
          },
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              // animation: t.visible
              //   ? 'custom-enter 1s ease'
              //   : 'custom-exit 1s ease forwards',
            }}
          />
        )}
      </Toaster>
    </>
  );
}

export default App;
