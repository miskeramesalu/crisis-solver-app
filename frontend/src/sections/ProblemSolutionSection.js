import React from "react";

const ProblemSolutionSection = () => {
  return (
    <section
      className="py-12 px-6 max-w-6xl mx-auto"
      id="problem-solution"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">
        Problem & Solution
      </h2>

      {/* Problem */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">The Problem</h3>

        <p className="mb-4">
          Millions of people around the world face severe challenges caused by
          hunger, health emergencies, poverty, disasters, and displacement.
          Despite the growing need for humanitarian support, global donations
          and traditional funding sources are declining each year.
        </p>

        <p>
          Many people want to help but lack a simple, transparent, and engaging
          way to contribute. At the same time, humanitarian organizations need
          sustainable funding and greater public participation to address
          ongoing crises effectively.
        </p>
      </div>

      {/* Solution */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Our Solution</h3>

        <p className="mb-4">
          Crisis Solver is a global digital platform that transforms everyday
          online activities into humanitarian impact. Users can watch videos,
          upload content, answer surveys, play educational games, share
          information, and participate in awareness campaigns while earning
          rewards.
        </p>

        <p className="mb-4">
          Revenue generated through advertisements, sponsorships, partnerships,
          and platform activities is shared between user rewards and a Global
          Crisis Support Fund that helps verified humanitarian projects and
          organizations.
        </p>

        <p>
          By combining technology, community engagement, transparency, and
          micro-donations, Crisis Solver enables millions of small actions to
          create meaningful change for people affected by crises worldwide.
        </p>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;