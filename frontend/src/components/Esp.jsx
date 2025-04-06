import axios from 'axios';

const baseUrl = 'http://192.168.100.150';

const Esp = axios.create({
   baseURL: baseUrl,
   timeout: 5000, 
   headers: {
      "Content-Type": "application/json",
      accept: "application/json",
   }
});


export default Esp;
