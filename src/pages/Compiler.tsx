
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import FileSystem from '@/components/compiler/FileSystem';
import CompilerLayout from '@/components/compiler/CompilerLayout';
import ZenXPlayground from '@/components/playground/Playground';

const Compiler = () => {
  // Check if we're in playground mode by looking for problemId in URL
  const isPlaygroundMode = window.location.search.includes('problemId');

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
