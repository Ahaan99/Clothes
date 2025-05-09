import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
