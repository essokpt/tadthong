import { ApiType } from '../../../types/api'
import { createContext, useState } from "react";

// type ThemeType = {   
//     refresh : string
//     setRefresh: (refresh: string) => void;
//   };
  
  // สร้าง Context
  const ApiContext = createContext<ApiType | null>(null);
  
  const ApiProvider : React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [refresh, setRefresh] = useState(false);
  
    return (
      <ApiContext.Provider value={{ refresh, setRefresh }}>
        {children}
      </ApiContext.Provider>
    );
  };
  
  export { ApiProvider, ApiContext };