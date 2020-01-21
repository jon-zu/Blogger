import React from "react";

export const LoadingComponent: React.FC = () => {
    return (
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};
