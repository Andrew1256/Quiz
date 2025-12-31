import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {QuizPage} from "./pages/QuizPage.tsx";


function App() {
    return (
        <Router>
            <Suspense fallback={
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <Routes>
                    <Route path="/" element={<QuizPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
