import { useCompletion } from "ai/react";

export function useContentGeneration(id: string) {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
  } = useCompletion({
    api: `${process.env.NEXT_PUBLIC_API_URL}/ai/generate-content-v2`,
    headers: {
      Accept: "text/event-stream",
    },
    streamProtocol: "text",
    id,
  });

  return {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
  };
}
