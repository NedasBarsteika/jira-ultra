export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: March 3, 2026</p>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p className="leading-relaxed text-muted-foreground">
            At Iterova, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our work planning platform.
            Please read this privacy policy carefully. If you do not agree with the terms of this
            privacy policy, please do not access the application.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Information We Collect</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            We collect information that you provide directly to us when you register for an account,
            create or modify your profile, use our services, or communicate with us. This
            information may include:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
            <li>Name and email address</li>
            <li>Account credentials and authentication information</li>
            <li>Profile information and preferences</li>
            <li>Project and task data you create or upload</li>
            <li>Communications and correspondence with our support team</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            How We Use Your Information
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            We use the information we collect to provide, maintain, and improve our services,
            including:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
            <li>Processing and completing transactions</li>
            <li>Providing customer support and responding to your requests</li>
            <li>Analyzing usage patterns to improve platform functionality</li>
            <li>Sending administrative information and updates</li>
            <li>Preventing fraud and enhancing security</li>
            <li>Personalizing your experience on our platform</li>
          </ul>
        </section>

        {/* Data Storage and Security */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Data Storage and Security</h2>
          <p className="leading-relaxed text-muted-foreground">
            We implement appropriate technical and organizational security measures to protect your
            personal information against unauthorized access, alteration, disclosure, or
            destruction. Your data is stored on secure servers with encryption both in transit and
            at rest. However, no method of transmission over the internet or electronic storage is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* Information Sharing */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Information Sharing</h2>
          <p className="leading-relaxed text-muted-foreground">
            We do not sell, trade, or rent your personal information to third parties. We may share
            your information only in the following circumstances: with your consent, to comply with
            legal obligations, to protect our rights and prevent fraud, or with service providers
            who assist us in operating our platform (subject to strict confidentiality agreements).
          </p>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Your Rights</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Depending on your location, you may have certain rights regarding your personal
            information, including:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
            <li>The right to access and receive a copy of your personal data</li>
            <li>The right to rectify inaccurate or incomplete information</li>
            <li>The right to delete your personal information</li>
            <li>The right to restrict or object to certain processing</li>
            <li>The right to data portability</li>
          </ul>
        </section>

        {/* Cookies and Tracking */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Cookies and Tracking Technologies
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We use cookies and similar tracking technologies to collect information about your
            browsing activities and to distinguish you from other users. This helps us provide you
            with a better experience and allows us to improve our platform. You can control cookies
            through your browser settings, but disabling them may affect functionality.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Changes to This Privacy Policy
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or for other operational, legal, or regulatory reasons. We will notify you of any
            material changes by posting the updated policy on this page and updating the &quot;Last
            updated&quot; date.
          </p>
        </section>

        {/* Contact Section */}
        <section className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Contact Us</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            If you have any questions about this Privacy Policy or our data practices, please
            contact us at:
          </p>
          <p className="text-muted-foreground">
            Email:{' '}
            <a href="mailto:privacy@iterova.com" className="text-primary hover:underline">
              privacy@iterova.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
