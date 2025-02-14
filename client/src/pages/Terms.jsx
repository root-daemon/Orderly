export default function Terms() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-gray-600 mb-6">
        Effective Date: [Insert Date]
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>By using Orderly, you agree to these Terms of Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Use of Service</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must use Orderly in compliance with applicable laws.</li>
            <li>
              We provide this service as is without warranties of any kind.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. User Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must provide accurate timetable information.</li>
            <li>
              You are responsible for managing your Google Calendar permissions.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            4. Limitations of Liability
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              We are not responsible for missed classes, incorrect schedules, or
              any issues arising from service use.
            </li>
            <li>
              Orderly is provided without warranties, and we are not liable for
              any damages.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access if you
            violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
          <p>For questions, contact us at [Insert Contact Email].</p>
        </section>

        <p className="font-semibold mt-4">
          By using Orderly, you agree to these Terms of Service.
        </p>
      </div>
    </div>
  );
}
