export function handleGlobalErrors() {
    process.on('uncaughtException', (err) => {
        console.error('Uncaught exception:', err);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
}
