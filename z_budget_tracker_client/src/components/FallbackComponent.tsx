// import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

// // 1. Define your fallback component
// export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
//   return (
//     <div role="alert">
//       <p>Something went wrong:</p>
//       <pre style={{ color: 'red' }}>{error.message}</pre>
//       <button onClick={resetErrorBoundary}>Try again</button>
//     </div>
//   );
// }

// function App() {
//   return (
//     <ErrorBoundary
//       FallbackComponent={FallbackComponent}
//       onReset={() => {
//         // Reset the state of your app here so the error doesn't happen again
//       }}
//     >
//       <MyBuggyComponent />
//     </ErrorBoundary>
//   );
// }
