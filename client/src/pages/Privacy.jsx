export default function Privacy() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-6">
        Effective Date: [Insert Date]
      </p>

      <div className="space-y-6">
        <p>
          Orderly ( we, our, us) is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and disclose your
          information when you use our service.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Google Account Data:</strong> When you log in with Google,
              we access your email and Google Calendar to sync your class
              schedule.
            </li>
            <li>
              <strong>Timetable Data:</strong> We store the timetable you enter
              for syncing with Google Calendar.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect non-personal usage
              statistics to improve our service.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Sync your class schedule with Google Calendar.</li>
            <li>Improve and optimize our service.</li>
            <li>Ensure reliable performance and troubleshoot issues.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. Data Sharing and Security
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We do not sell or share your data with third parties.</li>
            <li>Data is securely stored and encrypted.</li>
            <li>
              You can revoke Google access at any time via your Google account
              settings.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              You can delete your timetable and revoke access at any time.
            </li>
            <li>
              Contact us at [Insert Contact Email] for data-related inquiries.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            5. Changes to This Policy
          </h2>
          <p>We may update this policy, and any changes will be posted here.</p>
        </section>
      </div>
    </div>
  );
}
