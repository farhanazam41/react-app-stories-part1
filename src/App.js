import { useReducer, useState, useEffect } from "react";
import "./styles.css";
import useSemiPersistStorage from "./useSemiPersistStorage";

const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

const getAsyncStories = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: { stories: initialStories } });
    }, 2000);
  });

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_STORIES_INIT":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_STORIES_SUCCESS":
      return { ...state, isLoading: false, data: action.payload };
    case "FETCH_STORIES_FAIL":
      return { ...state, isLoading: false, isError: true };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => story.objectID !== action.payload.objectID
        )
      };
    default:
      throw new Error();
  }
};

export default function App() {
  const { value, setValue } = useSemiPersistStorage("search", "React");
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false
  });
  console.log(stories, "stories");

  const { isLoading, isError, data } = stories;
  const fetchStories = async () => {
    try {
      dispatchStories({ type: "FETCH_STORIES_INIT" });
      const { data } = await getAsyncStories();
      dispatchStories({ type: "FETCH_STORIES_SUCCESS", payload: data.stories });
    } catch (err) {
      dispatchStories({ type: "FETCH_STORIES_FAIL" });
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSearch = (event) => {
    setValue(event.target.value);
  };

  const removeStory = (story) => {
    dispatchStories({ type: "REMOVE_STORY", payload: story });
  };
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <label>Search </label>
      <input type="search" onChange={handleSearch} />
      {isLoading && <p>Loading!!</p>}
      {isError && <p>Error!</p>}
      {!isError &&
        !isLoading &&
        data &&
        data.map((story, index) => {
          return (
            <div key={index}>
              <p>{story.title}</p>
              <button onClick={() => removeStory(story)}>remove story</button>
            </div>
          );
        })}
    </div>
  );
}
