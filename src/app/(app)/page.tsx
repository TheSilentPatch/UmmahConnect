import Image from 'next/image';

export default function AppHomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-8 text-center">
      <Image 
        src="https://placehold.co/400x300.png"
        data-ai-hint="community connection"
        alt="A vibrant illustration of diverse people connecting."
        width={400}
        height={300}
        className="mb-8 max-w-sm rounded-lg"
      />
      <h2 className="font-headline text-3xl font-bold text-foreground">Welcome to UmmahConnect!</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Select a channel from the sidebar to start a conversation, share knowledge, and connect with the community.
      </p>
    </div>
  );
}
