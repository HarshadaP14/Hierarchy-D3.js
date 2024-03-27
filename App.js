// import React from "react";
// import LayoutFlow from "./LayoutFlow";
// import TreeVisualization from "./D3-tree/TreeVisualization";

// const App = () => {
//   return (
//     <div>
//       {/* <LayoutFlow /> */}
//       <TreeVisualization />
//     </div>
//   );
// };

// export default App;
import React, { useState } from "react";
import TreeVisualization from "./D3-tree/TreeVisualization";
import Login from "./D3-tree/Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    // Simulate login validation
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <TreeVisualization />
          <div className="tooltip">Logged in successfully!</div>
        </div>
      )}
    </div>
  );
};

export default App;
