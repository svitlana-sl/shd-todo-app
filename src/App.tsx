import Layout from "./components/Layout";
import TodoList from "./components/TodoList";

const App = () => {
  return (
    <>
      <Layout>
        <p className="mt-2 text-center text-gray-600">
          Organize your tasks efficiently
        </p>
        <TodoList />
      </Layout>
    </>
  );
};
export default App;
