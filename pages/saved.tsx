import Layout from "@/components/Layout";
import { UserContextProvider } from "@/contexts/userContext";
import React from "react";

const savedPostPage = () => {
  return (
    <Layout>
      <UserContextProvider>
        <h1>Hello Saved</h1>
      </UserContextProvider>
    </Layout>
  );
};

export default savedPostPage;
