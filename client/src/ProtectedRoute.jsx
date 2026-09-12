import { useEffect, useState } from "react"; 
import { Navigate } from "react-router-dom"; 

function ProtectedRoute({ children }) { 
    const [status, setStatus] = useState("loading");
    useEffect(() => { 
        const checkAuthentication = async () => { 
            try { 
                const response = await fetch( "http://localhost:5000/api/auth/me", 
                    { 
                        credentials: "include",
                    } 
                ); 
                
            if (response.ok) { 
                setStatus("authenticated"); 
            } else { 
                setStatus("unauthenticated"); 
            } 
        } catch (error) { 
            setStatus("unauthenticated"); 
        } 
    }; 
    checkAuthentication(); 
}, []); 

    if (status === "loading") { 
        return <p>Checking authentication...</p>; 
    } 

    if (status === "unauthenticated") { 
        return <Navigate to="/login" replace />; 
    } 
    return children;
}

export default ProtectedRoute;