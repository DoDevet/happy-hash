import { useState } from "react";

interface UseMutationProps {
  url: string;
  method: "POST" | "PUT" | "DELETE";
}

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T>({
  url,
  method,
}: UseMutationProps): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  const fn = (data: any) => {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method,
      headers: {
        "Content-Type": "applications/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch(() => {})
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  };
  return [fn, state];
}
