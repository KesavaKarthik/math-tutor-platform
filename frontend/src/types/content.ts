export interface Chapter {
  id: number;
  name: string;
}

export interface Concept {
  id: number;
  section_number: string;
  title: string;
  content: string;
  content_explaination?: string;
}

export interface Example {
  id: number;
  example_number: number;
  title: string;
  question_text: string;
  // solution_text is purposely omitted by the backend
}
