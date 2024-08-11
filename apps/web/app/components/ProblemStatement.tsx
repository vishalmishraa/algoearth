import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IProblemStatement {
  description: string,
  title: string,
  tags: {
    id: string;
    name: string;
  }[]
}

export function ProblemStatement({ description, title, tags }: IProblemStatement) {
  return (
    <div className="prose lg:prose-xl dark:prose-gray dark:prose-h2:text-gray-200 dark:prose-h4:text-gray-200">
      <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
    </div>
  );
}
