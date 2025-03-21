# ShadCN Todo List

This is a Todo App built with React, TypeScript, Vite, and [ShadCN UI](https://ui.shadcn.com/). The project uses Redux Toolkit Query (RTK Query) for API calls and state management, and Tailwind CSS for styling.  

## Features

- **Add, update, and delete todos** using RTK Query for efficient API integration.
- **Filter todos** by category and status.
- **Pagination** to navigate through todos.
- Responsive UI built with ShadCN components and Tailwind CSS.
- Theme toggle (dark/light mode) using Next Themes.

## Live Demo

The app is deployed at: [shadcn-todo-app.surge.sh](https://shadcn-todo-app.surge.sh)

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/shadcn_todo_list.git
   cd shadcn_todo_list
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) (or the port provided by Vite).

### Building for Production

To build the project for production:

```bash
npm run build
# or
yarn build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

### JSON Server (Optional)

If you want to run a local JSON server for testing:

```bash
npm run db
# or
yarn db
```

This will start the JSON server on [http://localhost:5000](http://localhost:5000).

## Project Structure

```
├── src
│   ├── components      # UI components (TodoList, Layout, shadcn UI pieces)
│   ├── lib             # Utility functions (e.g. cn wrapper for Tailwind Merge)
│   ├── redux           # Redux store and RTK Query API slice configuration
│   ├── styles.css      # Global styles (Tailwind)
│   ├── App.tsx         # Entry component wrapping Layout and TodoList
│   └── main.tsx        # App bootstrapping
├── db.json             # JSON server mock data for todos and categories
├── package.json        # Project config and dependencies
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Technologies Used

- **React** – JavaScript library for building user interfaces.
- **TypeScript** – Typed superset of JavaScript.
- **Vite** – Next Generation frontend tooling.
- **Redux Toolkit Query (RTK Query)** – For data fetching and caching.
- **Tailwind CSS** – Utility-first CSS framework.
- **ShadCN UI** – Beautiful and customizable UI components.
- **JSON Server** – Mock backend for quick API testing.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is open source and available under the [MIT License](LICENSE).



