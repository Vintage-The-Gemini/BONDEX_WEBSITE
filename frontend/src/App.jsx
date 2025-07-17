function App() {
  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white'>
      <section className='text-center p-10 max-w-xl bg-white/10 backdrop-blur-sm rounded-xl shadow-lg'>
        <h1 className='text-5xl font-bold mb-4'>Welcome to Your Vite App 🎉</h1>
        <p className='text-lg leading-relaxed'>
          Built with <span className='text-accent font-semibold'>Tailwind CSS v4</span>, powered by <span className='text-primary font-semibold'>Vite</span>,
          and ready to scale like a pro.
        </p>
        <button className='mt-6 px-6 py-2 rounded-full bg-white text-primary font-semibold hover:bg-opacity-80 transition'>
          Get Started
        </button>
      </section>
    </main>
  );
}

export default App;
