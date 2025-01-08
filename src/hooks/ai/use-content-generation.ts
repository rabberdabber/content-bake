import { useCompletion } from 'ai/react';


export function useContentGeneration() {


  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useCompletion({
    api: `${process.env.NEXT_PUBLIC_API_URL}/ai/generate-content-v2`,
    headers: {
      Accept: "text/event-stream"
    },
    streamProtocol: "text",
  });

  console.log("completion", completion);

  return {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  };
} 