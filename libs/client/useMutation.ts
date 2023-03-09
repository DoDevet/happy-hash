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

type UseMutationResult<T, V> = [(data: V) => void, UseMutationState<T>];

export default function useMutation<T, V>({
  url,
  method,
}: UseMutationProps): UseMutationResult<T, V> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  const fn = (data: V) => {
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

/**
 *
 *
 * interface ProductProps{
 *  ok:boolean;
 *  product: Product[];
 * }
 * 
    interface CommunityPost{
        ok:booelan;
        posts:Post[];
    }
 *
 * const [fn, {data, error, loading}] =  useMutation<ProductProps>({url:sdf, method:"POST"});
 *
 *  data{
 *  ok:...;
 *  product: ...;
 * }
 * 
 *  createAccount({phone:123-123-132, email:123@123.23})
 * 
 *
 */
