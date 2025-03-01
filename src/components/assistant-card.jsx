function AssistantCards() {
  const assistants = [
    {
      id: 1,
      title: "PRD Assistant",
      description: "A specialized AI agent for helping with PRD generation.",
      model: "gpt-4o",
    },
    {
      id: 2,
      title: "Legal Policy GPT",
      description:
        "An AI Agent to assist with legal topics such as policy template creation",
      model: "gpt-4o",
    },
    {
      id: 3,
      title: "General Chat",
      description: "An AI assistant for your everyday tasks",
      model: "gpt-4o",
    },
    {
      id: 4,
      title: "Research Assistant",
      description: "An AI Agent to assist with research topics",
      model: "gpt-4o",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {assistants.map((assistant) => (
        <div
          key={assistant.id}
          className="bg-[#0e1024] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors cursor-pointer"
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium mb-1">{assistant.title}</h3>
              <p className="text-sm text-gray-400 mb-2">
                {assistant.description}
              </p>
              <div className="text-xs text-gray-500">
                Model: {assistant.model}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssistantCards;
