import { useEffect,useRef,useState} from 'react'
import axios from 'axios'
import ReactMarkdone from 'react-markdone';
import { motion } from 'motion/react';
import {sand, Loader2 } from 'lucide-react';
function App() {
  const [chatHistroy, setChatHistroy] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(false);
  const chatContainerRef = useRef(null);
  useEffect(()=>{
    if(chatContainerRef.current){
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  },[chatHistroy, answer]);
  async function generateAnswer(e){
    e.perventDefault();
    if(!question.trim())return;
    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion('');
    try{
      const response = await axios({
        url:`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method:'POST',
        data:{
          contents:[{parts:[{text:currentQuestion}]}]
        }
      })
      const aiResponse = response.data.candidates[0].
      content.parts[0].text;
      setChatHistroy((prev)=>{
        return [...prev, {user:currentQuestion, ai:aiResponse}]
      })
    }
   
  catch(error){
      console.error(error);
  }
  setGeneratingAnswer(false);
}
  return (
   <div>
    
   </div>
  )
}

export default App