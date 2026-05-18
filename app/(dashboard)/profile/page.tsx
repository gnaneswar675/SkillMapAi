import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="mb-8 w-full text-left max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences.</p>
      </div>
      <div className="w-full max-w-4xl flex justify-center">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
