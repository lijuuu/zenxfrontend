
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import CompilerLayout from '@/components/compiler/CompilerPlayground';
import ZenXPlayground from '@/components/playground/Playground';

const Compiler = () => {
  //check if we're in playground mode by looking for problemId in URL
  const isPlaygroundMode = window.location.search.includes('problemId');
  const params = new URLSearchParams(window.location.search)
  const challengeId = params.get("challengeId")


  return (
    <SidebarProvider>
      {isPlaygroundMode ? (
        <ZenXPlayground challengeId={challengeId} />
      ) : (
        <>
          <CompilerLayout />
        </>
      )}
      <Toaster />
    </SidebarProvider>
  );
};

export default Compiler;
