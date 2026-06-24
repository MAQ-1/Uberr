import { createContext, useState } from 'react';

export const UserdataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    Fullname: {
      Firstname: "",
      Lastname: ""
    },
    password: ""
  });

  return (
    <UserdataContext.Provider value={{ user, setUser }}>
      {children}
    </UserdataContext.Provider>
  );
};

export default UserContext;