import "./App.css";
import { useCrossTabState } from "./useCrossTabState";

function App() {
  const [state, setState] = useCrossTabState<string>(
    "key-in-local-storage",
    ""
  );

  return (
    <div>
      <input
        type="text"
        value={state}
        onChange={(event) => {
          setState(event.target.value);
        }}
      />
      <p>current state : {state}</p>
    </div>
  );
}

export default App;
