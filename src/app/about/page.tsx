import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/logo_192x192.png"
              alt="Iterova Logo"
              width={120}
              height={120}
              className="h-30 w-30"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">About us</h1>
          <p className="text-lg text-muted-foreground">Turning plans into progress</p>
        </div>

        {/* Challenge Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">The Challenge We Solve</h2>
          <p className="leading-relaxed text-muted-foreground">
            In many organizations, work planning is one of the most critical steps toward success.
            While existing systems allow task management, they fail to provide an accurate and
            realistic view of team capacity and progress. As a result, plans don&apos;t align with
            actual outcomes, and team progress remains unclear. This creates a need for a solution
            that enables work planning based on real team capacity and helps monitor team progress
            effectively.
          </p>
        </section>

        {/* Goal Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Our Goal</h2>
          <p className="leading-relaxed text-muted-foreground">
            To create a work planning system that allows teams to plan work in cycles based on real
            capacity, provides clear metric summaries, and ultimately improves planning accuracy
            while reducing the gap between planned and completed work.
          </p>
        </section>

        {/* Product Idea Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">The Iterova Solution</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Iterova is a planning system designed to help organizations plan tasks in cycles based
            on real team capacity. The system is built not just for task tracking, but for more
            accurate work volume forecasting and planning process automation.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Iterova helps clearly distinguish between planned and actually implemented work,
            automatically transfers incomplete tasks to the next cycle, and provides key performance
            metrics including:
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
            <li>Team velocity tracking</li>
            <li>Completion percentage analysis</li>
            <li>Remaining work quantity</li>
            <li>Root cause analysis for incomplete work</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            This approach ensures greater transparency and clearer team performance evaluation.
          </p>
        </section>

        {/* Core Problem Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Addressing the Core Problem
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            The main challenge we address is the gap between planned and actually completed work. In
            practice, sprints are often planned based on subjective assessments, previous
            experience, or Excel spreadsheets that don&apos;t allow for systematic evaluation of
            true team capacity. This reduces planning accuracy and makes team results harder to
            predict. Iterova provides a data-driven approach to overcome these limitations.
          </p>
        </section>

        {/* Call to Action */}
        <section className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Ready to transform your planning?
          </h2>
          <p className="mb-6 text-muted-foreground">
            Join Iterova now to improve your planning accuracy and team productivity!
          </p>
        </section>
      </div>
    </div>
  );
}
