export function createRealtimeApiExample({ endpoint = "wss://api.example.invalid/realtime", tokenProvider } = {}) {
  return {
    endpoint,
    async connect() {
      const token = tokenProvider ? await tokenProvider() : "";
      if (!token) {
        throw new Error("A short-lived demo token is required.");
      }
      return {
        endpoint,
        tokenPreview: `${token.slice(0, 4)}...`,
        note: "This example only shows a standard API connection shape."
      };
    }
  };
}
