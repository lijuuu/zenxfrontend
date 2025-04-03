
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import FileSystem from '@/components/compiler/FileSystem';
import CompilerLayout from '@/components/compiler/CompilerLayout';
import ZenXPlayground from '@/components/playground/ZenXPlayground';

const Compiler = () => {
  // Check if we're in playground mode by looking for problem_id in URL
  const isPlaygroundMode = window.location.search.includes('problem_id');

  return (
    <SidebarProvider>
      {isPlaygroundMode ? (
        <ZenXPlayground />
      ) : (
        <>
          <FileSystem />
          <CompilerLayout />
        </>
      )}
      <Toaster />
    </SidebarProvider>
  );
};

export default Compiler;
