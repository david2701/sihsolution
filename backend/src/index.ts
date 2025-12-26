import { buildApp } from './app.js';
import { config } from './config/index.js';

async function start() {
    try {
        const app = await buildApp();

        await app.listen({ port: config.port, host: '0.0.0.0' });

        console.log(`🚀 Server running at http://localhost:${config.port}`);
        console.log(`📚 API Documentation: http://localhost:${config.port}/api/health`);
    } catch (err) {
        console.error('❌ Error starting server:', err);
        process.exit(1);
    }
}

start();
