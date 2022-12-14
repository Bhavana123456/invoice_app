import Layout from '../Components/Layout'
import '../styles/globals.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function MyApp({ Component, pageProps }) {
  return(
    <Layout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        
        theme="light"
/>
{/* Same as */}
<ToastContainer />
      <Component {...pageProps} />
    </Layout>
  ) 
}

export default MyApp
