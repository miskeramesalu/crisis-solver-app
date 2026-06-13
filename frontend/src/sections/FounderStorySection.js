
import React from "react";

const FounderStorySection = () => {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-4xl font-bold text-center mb-8">
          Founder's Story
        </h2>

        <div className="space-y-6 text-lg leading-relaxed text-gray-700">
          <p>
            Hello, I'm <strong>Misker Amesalu Mulu</strong>, the founder of
            Crisis Solver. My journey across agriculture, development,
            quality management, research, and technology has given me a
            firsthand understanding of the challenges faced by millions of
            people affected by hunger, poverty, health emergencies, and
            displacement.
          </p>

          <p>
            While humanitarian needs continue to rise globally, I observed
            that many people who want to help often lack a simple,
            transparent, and accessible way to contribute. At the same time,
            traditional funding sources and donor participation face growing
            limitations.
          </p>

          <p>
            These challenges inspired me to create Crisis Solver — a global
            digital platform designed to transform everyday actions into
            meaningful humanitarian impact. By combining technology,
            community engagement, rewards, transparency, and innovation,
            Crisis Solver enables individuals to support verified causes
            while actively participating in positive change.
          </p>

          <p>
            My vision is to build a world where millions of small actions
            unite to create large-scale solutions. I believe that every
            click, every share, every contribution, and every act of
            compassion has the power to improve lives and strengthen
            communities across the globe.
          </p>

          <blockquote className="border-l-4 pl-4 italic text-xl font-medium">
            "Every action you take helps solve a crisis."
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default FounderStorySection;