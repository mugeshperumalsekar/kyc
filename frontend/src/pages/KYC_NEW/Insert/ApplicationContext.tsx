// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface ApplicationContextProps {
//     responseId: number | null;
//     setResponseId: (id: number) => void;
// }

// const ApplicationContext = createContext<ApplicationContextProps | undefined>(undefined);

// export const useApplicationContext = () => {
//     const context = useContext(ApplicationContext);
//     if (!context) {
//         throw new Error('useApplicationContext must be used within an ApplicationProvider');
//     }
//     return context;
// };

// export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [responseId, setResponseId] = useState<number | null>(null);

//     return (
//         <ApplicationContext.Provider value={{ responseId, setResponseId }}>
//             {children}
//         </ApplicationContext.Provider>
//     );
// };
import React from 'react'

const ApplicationContext = () => {
  return (
    <div>ApplicationContext</div>
  )
}

export default ApplicationContext;