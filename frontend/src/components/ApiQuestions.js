import React from 'react';

const QUESTIONS_API_BASE_URL = 'https://api.frontendexpert.io/api/fe/questions';
const SUBMISSIONS_API_BASE_URL = 'https://api.frontendexpert.io/api/fe/submissions';

export default function QuestionList() {
  const [questions, setQuestions] = useState();
  const[submission, setSubmission] = useState();

useEffect(()={
  const fetchQuestion = fetch(QUESTIONS_API_BASE_URL);
  const questionConverter = fetchQuestion.json();

},[])

useEffect(()={},[])

  return (
    <>
    </>
  );
}