## Quick Start

To spin up this example locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
1. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN` from your Vercel project to your `.env` if you want to use Vercel Blob and the Neon database that was created for you.
1. `pnpm install && pnpm dev` to install dependencies and start the dev server
1. open `http://localhost:3000` to open the app in your browser
