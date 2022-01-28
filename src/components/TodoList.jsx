import { useEffect, useState, useCallback } from "react";
import { Layout, Tabs, Row, Col, message, Input } from "antd";
import TodoTab from "./TodoTab";
import TodoForm from "./TodoForm";
import {
  createTodo,
  deleteTodo,
  loadTodos,
  updateTodo,
} from "../Services/todoService";

const { TabPane } = Tabs;
const { Content } = Layout;

const TodoList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState();

  const handleFormSubmit = (todo) => {
    console.log(" todo to create", todo);
    createTodo(todo).then(onRefresh());
    message.sucess("todo added!");
  };

  const handleRemoveTodo = (todo) => {
    deleteTodo(todo.id).then(onRefresh());
    message.warn("Todo removed");
  };

  const handleToggleTodoStatus = (todo) => {
    todo.completed = !todo.completed;
    updateTodo(todo).then(onRefresh());
    message.info("todo status updated");
  };

  const refresh = () => {
    loadTodos()
      .then((json) => {
        setTodos(json);
        setActiveTodos(json.filter((todo) => todo.completed === false));
        setCompletedTodos(json.filter((todo) => todo.completed === true));
      })
      .then(console.log("fetch completed"));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let data = await loadTodos;
    setTodos(data);
    setActiveTodos(data.filter((todo) => todo.completed === false));
    setCompletedTodos(data.filter((todo) => todo.completed === true));
    setRefreshing(false);
    console.log("refresh state", refreshing);
  }, [refreshing]);

  useEffect(() => {
      refresh();
  }, [onRefresh])

  return (
      <Layout className="layout">
          <Content style={{ padding: '0 50px'}}>
              <div className="todolist">
                  <Row>
                      <Col span={14} offset={5}>
                      <h1>V360 Todos</h1>
                      <TodoForm onFormSubmit={handleFormSubmit}/>
                      <br />
                      </Col>
                  </Row>
              </div>
          </Content>
      </Layout>
  )


};
