import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const PageWrapper = ({ title, children }) => {
  useEffect(() => {
    // This will make sure the title updates whenever the component is rendered
    document.title = title ? `${title} | FitnessTracker` : "FitnessTracker";
  }, [title]); // Re-run whenever the title changes

  return (
    <>
      <Helmet>
        <title>{title ? `${title} | FitnessTracker` : "FitnessTracker"}</title>
      </Helmet>
      {children}
    </>
  );
};

export default PageWrapper;
