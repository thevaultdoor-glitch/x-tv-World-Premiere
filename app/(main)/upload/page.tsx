// FIX: Added import for React to support JSX syntax.
import React from 'react';
import UploadPage from "@/components/UploadPage";

export default function UploadContainerPage() {
    // The navigateTo prop will be replaced by Next.js router actions.
    return <UploadPage navigateTo={() => {}} />;
}
