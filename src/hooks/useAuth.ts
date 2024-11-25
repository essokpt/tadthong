// import { useEffect, useState } from "react";

// const token = await getToken() 

// const useAuth = () => {
//   const [user, setUser] = useState<user | null>(null);

//   useEffect(() => {
//     if (token) {
//       const isTokenValid = checkTokenValidity(token);
//       const userData = isTokenValid ? decodeToken(token) : null;

//       if (isTokenValid) {
//         setUser(userData);
//       } else {
//         setUser(null);

//         removeCookie("token");
//       }
//     } else {
//       setUser(null);
//     }
//   }, []);

//   return { user };
// };