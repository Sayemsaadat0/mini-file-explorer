# Mini File Explorer

A web-based miniature file explorer application built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It provides a simple desktop-like hierarchical file structure where users can easily manage their folders and files directly from their browser.

## Features
- **Hierarchical Structure**: Navigate through nested directories effortlessly.
- **File Management**: 
  - Create new folders and text files.
  - Rename existing folders and files.
  - Delete files and folders (including recursive deletion for folders).
- **Text Editor**: Click on any text file to open an integrated editor and edit its content.
- **Persistence**: All data is automatically saved to the browser's `localStorage`. No backend required!
- **Responsive Design**: Includes a collapsible sidebar for a seamless experience on smaller screens.

## Tech Stack
- **Framework**: React / Next.js (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Context API & Local Storage

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. We recommend using `pnpm` for package management.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/Sayemsaadat0/mini-file-explorer.git
   cd mini-file-explorer
   ```

2. Install dependencies using `pnpm`:
   ```bash
   pnpm install
   ```

### Running the Application

To start the development server, run:
```bash
pnpm run dev
```

Once the server is running, open your browser and go to:
[http://localhost:3000](http://localhost:3000)

## Build for Production
To build and start the optimized production version:
```bash
pnpm run build
pnpm run start
```
