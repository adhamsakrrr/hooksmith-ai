import HookGenerator from './components/HookGenerator';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-black text-white selection:bg-purple-500 selection:text-white">
            <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex mb-12">
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-tighter">
                    HookSmith AI
                </h1>
            </div>

            <div className="w-full">
                <HookGenerator />
            </div>
        </main>
    );
}
