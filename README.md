# VideoDescriber AI

## Overview

This is a web application built with Next.js, Tailwind CSS, Vercel AI, OpenAI, Supabase, and UploadThing. It allows users to upload videos and generate transcriptions for easier content creation.

## Features

- User-friendly video upload interface using UploadThing.
- Automatic transcription of uploaded videos using OpenAI.
- AI-powered prompt templates for generating titles and descriptions.
- Secure data storage and management with Supabase.
- Written in TypeScript for type-safe development.

## Roadmap

- [x] Dark mode
- [ ] Add authentication
- [ ] Add option to change OpenAI model
- [ ] Mobile friendly
- [ ] Add payments with Stripe
- [ ] Improve React Server Components to replace useEffect API calls

## Getting Started

Follow these steps to set up and run the project on your local machine:

Clone the repository

   ```bash
   git clone https://github.com/diegosano/video-describer-ai
   cd video-describer-ai
   ```

Install dependencies

   ```bash
    pnpm install
   ```

Clone .env.example and rename to .env

Run the application

   ```bash
    pnpm dev
   ```

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel AI](https://sdk.vercel.ai/)
- [OpenAI](https://platform.openai.com/docs/api-reference)
- [Supabase](supabase.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [UploadThing](uploadthing.com/)

## License

This project is licensed under the [MIT](/LICENSE) License.
