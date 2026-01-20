import Layout from "./Layout.jsx";

import Home from "./Home";

import QnAService from "./QnAService";

import DocumentQuality from "./DocumentQuality";

import ReportGenerator from "./ReportGenerator";

import SlowMovingInventory from "./SlowMovingInventory";

import Analytics from "./Analytics";

import ComplaintPage from './ComplaintPage';

import InsightFinder from './InsightFinder';

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {

    Home: Home,

    QnAService: QnAService,

    DocumentQuality: DocumentQuality,

    ReportGenerator: ReportGenerator,

    SlowMovingInventory: SlowMovingInventory,

    Analytics: Analytics,

    InsightFinder: InsightFinder,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>

                    <Route path="/" element={<Home />} />


                <Route path="/Home" element={<Home />} />

                <Route path="/QnAService" element={<QnAService />} />

                <Route path="/DocumentQuality" element={<DocumentQuality />} />

                <Route path="/ReportGenerator" element={<ReportGenerator />} />

                <Route path="/SlowMovingInventory" element={<SlowMovingInventory />} />

                <Route path="/Analytics" element={<Analytics />} />

                <Route path="/complaint" element={<ComplaintPage />} />

                <Route path="/InsightFinder" element={<InsightFinder />} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}