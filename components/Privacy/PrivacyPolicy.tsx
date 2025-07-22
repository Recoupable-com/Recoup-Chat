import { PRIVACY_POLICY_CONTENT } from "./PrivacyPolicyContent";

const PrivacyPolicy = () => (
  <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-8 px-6 md:px-12">
    <h1 className="text-3xl font-bold mb-4">{PRIVACY_POLICY_CONTENT.title}</h1>
    <p className="text-lg mb-8 text-gray-600">
      {PRIVACY_POLICY_CONTENT.description}
    </p>
    {PRIVACY_POLICY_CONTENT.sections.map((section) => (
      <div key={section.title} className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
        {section.paragraphs &&
          section.paragraphs.map((text, idx) => (
            <p key={idx} className="mb-2 text-gray-600">
              {text}
            </p>
          ))}
        {section.list && (
          <ul className="list-disc pl-6 mb-2">
            {section.list.map((item) => (
              <li key={item} className="text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);

export default PrivacyPolicy;
